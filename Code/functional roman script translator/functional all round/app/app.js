const els = {
  statusLabel: document.getElementById("status-label"),
  title: document.getElementById("track-title"),
  artist: document.getElementById("track-artist"),
  translationChip: document.getElementById("translation-chip"),
  modeChip: document.getElementById("mode-chip"),
  progressBar: document.getElementById("progress-bar"),
  elapsed: document.getElementById("elapsed"),
  duration: document.getElementById("duration"),
  empty: document.getElementById("empty-state"),
  emptyCopy: document.getElementById("empty-copy"),
  list: document.getElementById("lyrics-list"),
  jumpButton: document.getElementById("jump-button"),
  languageSelect: document.getElementById("language-select"),
  albumCover: document.getElementById("album-cover"),
  albumFallback: document.getElementById("album-fallback")
};

const ALIGNMENT_COLORS = [
  "rgba(106, 242, 174, 0.4)",
  "rgba(255, 210, 124, 0.4)",
  "rgba(129, 201, 255, 0.4)",
  "rgba(240, 167, 255, 0.36)",
  "rgba(255, 170, 170, 0.36)",
  "rgba(190, 255, 165, 0.38)"
];

const ACTIVE_STATE_POLL_MS = 500;
const IDLE_STATE_POLL_MS = 500;
const TRANSITION_STATE_POLL_MS = 120;
const RESET_POSITION_MS = 800;
const DRIFT_RESYNC_MS = 5000;

const state = {
  payload: null,
  activeIndex: -1,
  activeTrackKey: "",
  lastRenderKey: "",
  config: null,
  alignmentCache: new Map(),
  alignmentPending: new Set(),
  lyricsLoadedKeys: new Set(),
  lyricsPendingKey: "",
  pollInFlight: false,
  pendingImmediateRefresh: false,
  lastImmediateRefreshAtMs: 0,
  transitioningTrack: false,
  playback: {
    trackKey: "",
    anchorPositionMs: 0,
    anchorClientMs: 0,
    endTimeMs: 0,
    playbackStatus: ""
  }
};

function normalizeLanguageTag(tag) {
  return String(tag || "").trim().toLowerCase();
}

function lineNeedsTranslation(line) {
  const targetLanguage = normalizeLanguageTag(state.payload?.settings?.targetLanguage || state.config?.targetLanguage || "en");
  const sourceLanguage = normalizeLanguageTag(line?.sourceLanguage);
  if (!line?.translation) return false;
  if (!sourceLanguage) return line.translation.trim() !== String(line.text || "").trim();
  if (sourceLanguage === "mixed") return true;

  const targetBase = targetLanguage.split("-")[0];
  const sourceBase = sourceLanguage.split("-")[0];
  return sourceBase !== targetBase;
}

function formatMillis(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function resetPlaybackState() {
  state.playback = {
    trackKey: "",
    anchorPositionMs: 0,
    anchorClientMs: 0,
    endTimeMs: 0,
    playbackStatus: ""
  };
}

function buildTransientPayload() {
  const settings = state.payload?.settings || state.config || {
    targetLanguage: "en",
    translationProvider: "googleweb",
    languageChoices: []
  };

  return {
    status: "transition",
    settings,
    track: null,
    lyrics: {
      mode: "missing",
      synced: [],
      plain: [],
      sourceLanguage: "",
      translationVisible: false,
      provider: ""
    }
  };
}

function enterTrackTransition() {
  state.transitioningTrack = true;
  state.lastRenderKey = "";
  state.activeIndex = -1;
  state.activeTrackKey = "";
  resetPlaybackState();
  state.payload = buildTransientPayload();
  updateHeader(state.payload);
  renderLyrics(state.payload);
}

function requestImmediateStateRefresh() {
  const now = Date.now();
  if ((now - state.lastImmediateRefreshAtMs) < 350) return;

  state.lastImmediateRefreshAtMs = now;
  if (state.pollInFlight) {
    state.pendingImmediateRefresh = true;
    return;
  }

  state.pollInFlight = true;
  loadState()
    .catch(() => {})
    .finally(() => {
      state.pollInFlight = false;
    });
}

function rememberActiveIndex(payload, activeIndex) {
  const trackKey = payload?.track?.trackKey || "";
  state.activeTrackKey = trackKey;
  state.activeIndex = activeIndex;
}

function getLyricsRequestKey(track, settings) {
  if (!track?.trackKey) return "";
  return [
    track.trackKey,
    settings?.targetLanguage || "en",
    settings?.translationProvider || "googleweb"
  ].join("|");
}

function getPlaybackEstimate() {
  const playback = state.playback;
  if (!playback.trackKey) return 0;

  let position = playback.anchorPositionMs || 0;
  if (playback.playbackStatus === "Playing") {
    position += Math.max(0, Date.now() - playback.anchorClientMs);
  }

  const endTimeMs = playback.endTimeMs || position;
  return Math.min(position, endTimeMs);
}

function syncPlaybackState(payload) {
  const track = payload?.track;
  if (!track) {
    resetPlaybackState();
    return { shouldImmediateRefresh: false };
  }

  const now = Date.now();
  const trackKey = track.trackKey || "";
  const serverPositionMs = Math.max(0, Number(track.positionMs || 0));
  const endTimeMs = Math.max(0, Number(track.endTimeMs || 0));
  const playbackStatus = String(track.playbackStatus || "");
  const sameTrack = state.playback.trackKey === trackKey;
  const estimatedPositionMs = sameTrack ? getPlaybackEstimate() : serverPositionMs;
  const playbackStatusChanged = sameTrack && state.playback.playbackStatus !== playbackStatus;
  const suddenReset =
    sameTrack &&
    state.playback.playbackStatus === "Playing" &&
    playbackStatus === "Playing" &&
    estimatedPositionMs > 5000 &&
    serverPositionMs < RESET_POSITION_MS;
  const largeDrift = sameTrack && Math.abs(serverPositionMs - estimatedPositionMs) > DRIFT_RESYNC_MS;
  const shouldResync =
    !sameTrack ||
    playbackStatusChanged ||
    playbackStatus !== "Playing" ||
    suddenReset ||
    largeDrift;

  const anchorPositionMs = shouldResync ? serverPositionMs : estimatedPositionMs;

  state.playback = {
    trackKey,
    anchorPositionMs: Math.min(anchorPositionMs, endTimeMs || anchorPositionMs),
    anchorClientMs: now,
    endTimeMs,
    playbackStatus
  };

  return {
    shouldImmediateRefresh: suddenReset,
    shouldEnterTransition: suddenReset
  };
}

function getLivePosition(track) {
  if (!track) return 0;
  if (state.playback.trackKey === track.trackKey) {
    return getPlaybackEstimate();
  }

  let position = track.positionMs || 0;
  if (track.playbackStatus === "Playing" && track.lastUpdatedIso) {
    position += Math.max(0, Date.now() - Date.parse(track.lastUpdatedIso));
  }
  return Math.min(position, track.endTimeMs || position);
}

function findSyncedActiveIndex(lines, positionMs) {
  if (!Array.isArray(lines) || !lines.length) return -1;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (positionMs >= lines[i].timestampMs) return i;
  }
  return -1;
}

function findPlainActiveIndex(lines, positionMs, durationMs) {
  if (!Array.isArray(lines) || !lines.length) return -1;
  if (!durationMs || durationMs <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, positionMs / durationMs));
  return Math.min(lines.length - 1, Math.floor(ratio * lines.length));
}

function tokenizeLine(text) {
  if (!text) return [];
  const compact = text.trim();
  if (!compact) return [];
  const scriptLike = /[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af\u0600-\u06ff\u0400-\u04ff]/.test(compact);
  if (scriptLike && !/\s/.test(compact)) {
    return Array.from(compact).filter((char) => !/\s/.test(char));
  }
  return compact.split(/\s+/).filter(Boolean);
}

function buildWordRow(tokens, rowClass) {
  const row = document.createElement("div");
  row.className = `word-row ${rowClass}`;
  tokens.forEach((token, index) => {
    const span = document.createElement("span");
    span.className = "word-token";
    span.dataset.tokenIndex = String(index);
    span.textContent = token;
    row.appendChild(span);
  });
  return row;
}

function buildGlossRow() {
  const row = document.createElement("div");
  row.className = "word-row gloss-row";
  return row;
}

function getAlignmentKey(line) {
  return `${line.text || ""}||${line.translation || ""}||${line.sourceLanguage || ""}`;
}

function buildAlignmentMap(line) {
  const sourceTokens = tokenizeLine(line.text);
  if (!sourceTokens.length || !line.translation) return null;

  const wrap = document.createElement("div");
  wrap.className = "alignment-map hidden";
  wrap.dataset.alignmentKey = getAlignmentKey(line);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("alignment-svg");
  wrap.appendChild(svg);
  wrap.appendChild(buildWordRow(sourceTokens, "original-row"));
  wrap.appendChild(buildGlossRow());
  return wrap;
}

async function fetchAlignment(line) {
  const key = getAlignmentKey(line);
  if (state.alignmentCache.has(key) || state.alignmentPending.has(key)) return;

  state.alignmentPending.add(key);
  const params = new URLSearchParams({
    originalText: line.text || "",
    translatedText: line.translation || "",
    sourceLanguage: line.sourceLanguage || ""
  });

  try {
    const response = await fetch(`/api/alignment?${params.toString()}`, { cache: "no-store" });
    const payload = await response.json();
    state.alignmentCache.set(key, Array.isArray(payload.pairs) ? payload.pairs : []);
  } catch (_) {
    state.alignmentCache.set(key, []);
  } finally {
    state.alignmentPending.delete(key);
    requestAnimationFrame(() => {
      document.querySelectorAll(`.alignment-map[data-alignment-key="${CSS.escape(key)}"]`).forEach(drawAlignmentMap);
    });
  }
}

function drawAlignmentMap(container) {
  const svg = container.querySelector(".alignment-svg");
  const sourceTokens = [...container.querySelectorAll(".original-row .word-token")];
  const glossRow = container.querySelector(".gloss-row");
  if (!svg || !glossRow || !sourceTokens.length) return;

  const key = container.dataset.alignmentKey;
  const cachedPairs = state.alignmentCache.get(key) || [];
  const pairs = cachedPairs.filter((pair) => Number(pair.confidence || 0) >= 0.42);

  glossRow.replaceChildren();
  svg.innerHTML = "";
  if (!pairs.length) {
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");

  pairs.forEach((pair, index) => {
    const glossText = String(pair.gloss || "").trim();
    if (!glossText) return;

    const bubble = document.createElement("span");
    bubble.className = "word-token gloss-token";
    bubble.dataset.pairIndex = String(index);
    bubble.textContent = glossText;
    glossRow.appendChild(bubble);
  });

  const glossTokens = [...glossRow.querySelectorAll(".gloss-token")];
  if (!glossTokens.length) return;

  const box = container.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);

  pairs.forEach((pair, index) => {
    const sourceStart = Number.isInteger(pair.sourceStart) ? pair.sourceStart : pair.sourceIndex;
    const sourceEnd = Number.isInteger(pair.sourceEnd) ? pair.sourceEnd : sourceStart;
    if (sourceStart == null) return;

    const sourceGroup = sourceTokens.slice(sourceStart, sourceEnd + 1);
    const glossBubble = glossTokens[index];
    if (!sourceGroup.length || !glossBubble) return;

    const firstSourceBox = sourceGroup[0].getBoundingClientRect();
    const lastSourceBox = sourceGroup[sourceGroup.length - 1].getBoundingClientRect();
    const targetBox = glossBubble.getBoundingClientRect();

    const x1 = ((firstSourceBox.left + lastSourceBox.right) / 2) - box.left;
    const y1 = firstSourceBox.bottom - box.top;
    const x2 = (targetBox.left + targetBox.width / 2) - box.left;
    const y2 = targetBox.top - box.top;
    const curve = Math.max(20, Math.abs(y2 - y1) * 0.45);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${y1 + curve}, ${x2} ${y2 - curve}, ${x2} ${y2}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", ALIGNMENT_COLORS[index % ALIGNMENT_COLORS.length]);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);
  });
}

function buildLine(line, index, activeIndex, mode) {
  const article = document.createElement("article");
  article.className = "lyric-line";
  article.dataset.index = String(index);

  if (index === activeIndex) article.classList.add("active");
  else if (index < activeIndex) article.classList.add("past");
  else article.classList.add("future");

  const original = document.createElement("p");
  original.className = "lyric-original";
  original.textContent = line.text || "";
  article.appendChild(original);

  if (line.phonetic) {
    const phonetic = document.createElement("p");
    phonetic.className = "lyric-phonetic";
    phonetic.textContent = line.phonetic;
    article.appendChild(phonetic);
  }

  const translationVisible = lineNeedsTranslation(line);
  if (translationVisible) {
    const translation = document.createElement("p");
    translation.className = "lyric-translation";
    translation.textContent = line.translation;
    article.appendChild(translation);

    if (index === activeIndex) {
      const map = buildAlignmentMap(line);
      if (map) {
        article.classList.add("has-map");
        article.appendChild(map);
      }
    }
  }

  if (mode === "synced") {
    const time = document.createElement("span");
    time.className = "lyric-time";
    time.textContent = formatMillis(line.timestampMs);
    article.appendChild(time);
  }

  return article;
}

function updateActiveClasses(activeIndex) {
  const nodes = els.list.querySelectorAll(".lyric-line");
  nodes.forEach((node) => {
    const index = Number(node.dataset.index);
    node.classList.remove("active", "past", "future");
    if (index === activeIndex) node.classList.add("active");
    else if (index < activeIndex) node.classList.add("past");
    else node.classList.add("future");
  });
}

function centerActiveLine() {
  const active = els.list.querySelector(".lyric-line.active");
  if (active) active.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getRawActiveIndex(payload) {
  const lyrics = payload?.lyrics;
  const track = payload?.track;
  const positionMs = getLivePosition(track);
  if (lyrics?.mode === "synced") return findSyncedActiveIndex(lyrics.synced, positionMs);
  if (lyrics?.mode === "plain") return findPlainActiveIndex(lyrics.plain, positionMs, track?.endTimeMs || 0);
  return -1;
}

function getActiveIndex(payload) {
  const rawActiveIndex = getRawActiveIndex(payload);
  const trackKey = payload?.track?.trackKey || "";
  const sameTrack = trackKey && trackKey === state.activeTrackKey;

  if (sameTrack && state.activeIndex >= 0 && rawActiveIndex < state.activeIndex) {
    return state.activeIndex;
  }

  return rawActiveIndex;
}

function updateAlbumArt(track) {
  if (track?.artworkUrl) {
    els.albumCover.src = track.artworkUrl;
    els.albumCover.classList.remove("hidden");
    els.albumFallback.classList.add("hidden");
    return;
  }

  els.albumCover.removeAttribute("src");
  els.albumCover.classList.add("hidden");
  els.albumFallback.classList.remove("hidden");
}

async function ensureLyricsLoaded(payload) {
  if (payload?.status !== "active" || !payload?.track) return;

  const track = payload.track;
  const lyricsMode = payload?.lyrics?.mode || "missing";
  if (lyricsMode === "synced" || lyricsMode === "plain") return;
  if (!track.title || !track.artist || !track.trackKey) return;

  const requestKey = getLyricsRequestKey(track, payload.settings || state.config || {});
  if (!requestKey) return;
  if (state.lyricsPendingKey === requestKey || state.lyricsLoadedKeys.has(requestKey)) return;

  state.lyricsPendingKey = requestKey;
  const params = new URLSearchParams({
    trackKey: track.trackKey || "",
    title: track.title || "",
    artist: track.artist || "",
    album: track.album || "",
    durationMs: String(track.endTimeMs || 0)
  });

  try {
    const response = await fetch(`/api/lyrics?${params.toString()}`, { cache: "no-store" });
    const lyricsPayload = await response.json();
    state.lyricsLoadedKeys.add(requestKey);

    const currentRequestKey = getLyricsRequestKey(state.payload?.track, state.payload?.settings || state.config || {});
    if (currentRequestKey !== requestKey) return;

    state.payload = {
      ...state.payload,
      lyrics: lyricsPayload
    };
    state.transitioningTrack = false;
    state.lastRenderKey = "";
    updateHeader(state.payload);
    renderLyrics(state.payload);
  } catch (_) {
  } finally {
    if (state.lyricsPendingKey === requestKey) {
      state.lyricsPendingKey = "";
    }
  }
}

function renderLyrics(payload) {
  const lyrics = payload?.lyrics;
  const mode = lyrics?.mode || "missing";
  const activeIndex = getActiveIndex(payload);
  const renderKey = `${payload?.track?.trackKey || "idle"}|${mode}|${activeIndex}|${lyrics?.translationVisible}|${window.innerWidth}`;

  if (state.lastRenderKey === renderKey) {
    rememberActiveIndex(payload, activeIndex);
    updateActiveClasses(activeIndex);
    return;
  }

  state.lastRenderKey = renderKey;
  rememberActiveIndex(payload, activeIndex);
  els.list.replaceChildren();

  if (payload?.status !== "active") {
    els.empty.hidden = false;
    return;
  }

  const lines = mode === "synced" ? lyrics.synced : mode === "plain" ? lyrics.plain : [];
  if (!lines.length) {
    els.empty.hidden = false;
    if (mode === "loading") {
      els.empty.querySelector("h3").textContent = "Loading lyrics";
      els.emptyCopy.textContent = "Track detection is working. Fetching lyrics for this song now.";
    } else {
      els.empty.querySelector("h3").textContent = "Lyrics not found for this track";
      els.emptyCopy.textContent = "Track detection is working, but the lyric source did not return lines for this song yet.";
    }
    return;
  }

  const activeLine = lines[activeIndex];
  if (activeLine && lineNeedsTranslation(activeLine)) {
    fetchAlignment(activeLine);
  }

  els.empty.hidden = true;
  const fragment = document.createDocumentFragment();
  lines.forEach((line, index) => fragment.appendChild(buildLine(line, index, activeIndex, mode)));
  els.list.appendChild(fragment);
  updateActiveClasses(activeIndex);

  requestAnimationFrame(() => {
    els.list.querySelectorAll(".alignment-map").forEach((map) => {
      try {
        drawAlignmentMap(map);
      } catch (_) {
      }
    });
    if (activeIndex >= 0) centerActiveLine();
  });
}

function updateHeader(payload) {
  const track = payload?.track;
  const lyrics = payload?.lyrics;
  const positionMs = getLivePosition(track);
  const settings = payload?.settings || {};
  const translationVisible = Boolean(lyrics?.translationVisible);

  els.translationChip.textContent = translationVisible
    ? `Translated to ${String(settings.targetLanguage || "").toUpperCase()}`
    : "Original language";
  els.modeChip.textContent = payload?.status === "active"
    ? lyrics?.mode === "synced"
      ? "Synced lyrics"
      : lyrics?.mode === "plain"
        ? "Auto-scroll mode"
        : lyrics?.mode === "loading"
          ? "Loading lyrics"
          : "Waiting for lyrics"
    : "Spotify closed";

  if (payload?.status !== "active" || !track) {
    if (payload?.status === "transition") {
      els.statusLabel.textContent = "Syncing next song";
      els.title.textContent = "Refreshing track";
      els.artist.textContent = "Detected a reset or skip. Reloading Spotify state.";
      els.progressBar.style.width = "0%";
      els.elapsed.textContent = "00:00";
      els.duration.textContent = "00:00";
      els.empty.querySelector("h3").textContent = "Loading next song";
      els.emptyCopy.textContent = "The previous track was cleared immediately. Waiting for the next Spotify state sample.";
      updateAlbumArt(null);
      return;
    }

    els.statusLabel.textContent = "Waiting for Spotify";
    els.title.textContent = "Dual Lyrics";
    els.artist.textContent = "Local-only detection, lyrics lookup, and translation.";
    els.progressBar.style.width = "0%";
    els.elapsed.textContent = "00:00";
    els.duration.textContent = "00:00";
    els.empty.querySelector("h3").textContent = "Press play in Spotify desktop";
    els.emptyCopy.textContent = "The app refreshes every half second, notices when Spotify closes, reloads lyrics when the song changes, and translates automatically when needed.";
    updateAlbumArt(null);
    return;
  }

  els.statusLabel.textContent = track.playbackStatus === "Playing" ? "Playing now" : "Detected locally";
  els.title.textContent = track.title || "Spotify is open";
  els.artist.textContent = track.artist
    ? `${track.artist}${track.album ? ` - ${track.album}` : ""}`
    : `Detector: ${track.sourceApp || "unknown"}. Full timing may be unavailable.`;
  const progress = track.endTimeMs ? Math.min(100, (positionMs / track.endTimeMs) * 100) : 0;
  els.progressBar.style.width = `${progress}%`;
  els.elapsed.textContent = formatMillis(positionMs);
  els.duration.textContent = formatMillis(track.endTimeMs || 0);
  updateAlbumArt(track);
}

function renderLanguageChoices(config) {
  const choices = Array.isArray(config?.languageChoices) ? config.languageChoices : [];
  if (!choices.length) return;

  els.languageSelect.replaceChildren();
  choices.forEach((choice) => {
    const option = document.createElement("option");
    option.value = choice.code;
    option.textContent = choice.label;
    option.selected = config.targetLanguage === choice.code;
    els.languageSelect.appendChild(option);
  });
}

async function fetchConfig() {
  const response = await fetch("/api/config", { cache: "no-store" });
  state.config = await response.json();
  renderLanguageChoices(state.config);
}

async function updateTargetLanguage(targetLanguage) {
  await fetch(`/api/preferences?targetLanguage=${encodeURIComponent(targetLanguage)}`, { cache: "no-store" });
  state.lastRenderKey = "";
  state.alignmentCache.clear();
  state.lyricsLoadedKeys.clear();
  state.lyricsPendingKey = "";
  await fetchConfig();
  await loadState();
}

async function loadState() {
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    state.payload = await response.json();
    const syncResult = syncPlaybackState(state.payload);
    if (!syncResult?.shouldEnterTransition) {
      state.transitioningTrack = false;
    }
    if (syncResult?.shouldEnterTransition) {
      enterTrackTransition();
    }
    updateHeader(state.payload);
    renderLyrics(state.payload);
    if (syncResult?.shouldImmediateRefresh) {
      requestImmediateStateRefresh();
    }
    ensureLyricsLoaded(state.payload).catch(() => {});
  } catch (error) {
    els.statusLabel.textContent = "Connection problem";
    els.title.textContent = "Dual Lyrics";
    els.artist.textContent = error.message || "Start the PowerShell server to load Spotify state.";
    resetPlaybackState();
  }
}

els.jumpButton.addEventListener("click", centerActiveLine);
els.languageSelect.addEventListener("change", (event) => {
  updateTargetLanguage(event.target.value).catch((error) => {
    els.artist.textContent = error.message;
  });
});

window.addEventListener("resize", () => {
  requestAnimationFrame(() => {
    els.list.querySelectorAll(".alignment-map").forEach((map) => {
      try {
        drawAlignmentMap(map);
      } catch (_) {
      }
    });
  });
});

function startUiTicker() {
  const tick = () => {
    if (state.payload) {
      updateHeader(state.payload);
      if (state.payload.status === "active") {
        const activeIndex = getActiveIndex(state.payload);
        if (activeIndex !== state.activeIndex) {
          state.lastRenderKey = "";
          renderLyrics(state.payload);
        }
      }
    }

    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
}

function getStatePollInterval() {
  if (state.transitioningTrack) {
    return TRANSITION_STATE_POLL_MS;
  }

  const configuredInterval = Number(state.config?.refreshIntervalMs || IDLE_STATE_POLL_MS);
  if (state.payload?.status === "active") {
    return Math.min(configuredInterval, ACTIVE_STATE_POLL_MS);
  }

  return Math.max(configuredInterval, IDLE_STATE_POLL_MS);
}

function startStatePolling() {
  const poll = async () => {
    if (!state.pollInFlight) {
      state.pollInFlight = true;
      try {
        await loadState();
      } finally {
        state.pollInFlight = false;
      }
    }

    const nextDelay = state.pendingImmediateRefresh ? 0 : getStatePollInterval();
    state.pendingImmediateRefresh = false;
    window.setTimeout(poll, nextDelay);
  };

  window.setTimeout(poll, getStatePollInterval());
}

async function bootstrap() {
  await fetchConfig();
  await loadState();
  startUiTicker();
  startStatePolling();
}

bootstrap().catch((error) => {
  els.statusLabel.textContent = "Startup failed";
  els.artist.textContent = error.message;
});
