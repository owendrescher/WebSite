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
  languageSelect: document.getElementById("language-select")
};

const state = {
  payload: null,
  activeIndex: -1,
  lastRenderKey: "",
  config: null
};

function formatMillis(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getLivePosition(track) {
  if (!track) return 0;
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

  if (line.translation && state.payload?.lyrics?.translationVisible) {
    const translation = document.createElement("p");
    translation.className = "lyric-translation";
    translation.textContent = line.translation;
    article.appendChild(translation);
  }

  if (line.phonetic) {
    const phonetic = document.createElement("p");
    phonetic.className = "lyric-phonetic";
    phonetic.textContent = line.phonetic;
    article.appendChild(phonetic);
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

function getActiveIndex(payload) {
  const lyrics = payload?.lyrics;
  const track = payload?.track;
  const positionMs = getLivePosition(track);
  if (lyrics?.mode === "synced") return findSyncedActiveIndex(lyrics.synced, positionMs);
  if (lyrics?.mode === "plain") return findPlainActiveIndex(lyrics.plain, positionMs, track?.endTimeMs || 0);
  return -1;
}

function renderLyrics(payload) {
  const lyrics = payload?.lyrics;
  const mode = lyrics?.mode || "missing";
  const activeIndex = getActiveIndex(payload);
  const renderKey = `${payload?.track?.trackKey || "idle"}|${mode}|${activeIndex}|${lyrics?.translationVisible}`;

  if (state.lastRenderKey === renderKey) {
    updateActiveClasses(activeIndex);
    return;
  }

  state.lastRenderKey = renderKey;
  state.activeIndex = activeIndex;
  els.list.replaceChildren();

  if (payload?.status !== "active") {
    els.empty.hidden = false;
    return;
  }

  const lines = mode === "synced" ? lyrics.synced : mode === "plain" ? lyrics.plain : [];
  if (!lines.length) {
    els.empty.hidden = false;
    els.empty.querySelector("h3").textContent = "Lyrics not found for this track";
    els.emptyCopy.textContent = "Track detection is working, but the lyric source did not return lines for this song yet.";
    return;
  }

  els.empty.hidden = true;
  const fragment = document.createDocumentFragment();
  lines.forEach((line, index) => fragment.appendChild(buildLine(line, index, activeIndex, mode)));
  els.list.appendChild(fragment);
  updateActiveClasses(activeIndex);
  if (activeIndex >= 0) centerActiveLine();
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
        : "Waiting for lyrics"
    : "Spotify closed";

  if (payload?.status !== "active" || !track) {
    els.statusLabel.textContent = "Waiting for Spotify";
    els.title.textContent = "Dual Lyrics";
    els.artist.textContent = "Local-only detection, lyrics lookup, and translation.";
    els.progressBar.style.width = "0%";
    els.elapsed.textContent = "00:00";
    els.duration.textContent = "00:00";
    els.empty.querySelector("h3").textContent = "Press play in Spotify desktop";
    els.emptyCopy.textContent = "The app refreshes every five seconds, notices when Spotify closes, reloads lyrics when the song changes, and translates automatically when needed.";
    return;
  }

  els.statusLabel.textContent = track.playbackStatus === "Playing" ? "Playing now" : "Detected locally";
  els.title.textContent = track.title || "Spotify is open";
  els.artist.textContent = track.artist
    ? `${track.artist}${track.album ? ` • ${track.album}` : ""}`
    : `Detector: ${track.sourceApp || "unknown"}. Full timing may be unavailable.`;
  const progress = track.endTimeMs ? Math.min(100, (positionMs / track.endTimeMs) * 100) : 0;
  els.progressBar.style.width = `${progress}%`;
  els.elapsed.textContent = formatMillis(positionMs);
  els.duration.textContent = formatMillis(track.endTimeMs || 0);
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
  await fetchConfig();
  await loadState();
}

async function loadState() {
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    state.payload = await response.json();
    updateHeader(state.payload);
    renderLyrics(state.payload);
  } catch (error) {
    els.statusLabel.textContent = "Connection problem";
    els.title.textContent = "Dual Lyrics";
    els.artist.textContent = error.message || "Start the PowerShell server to load Spotify state.";
  }
}

els.jumpButton.addEventListener("click", centerActiveLine);
els.languageSelect.addEventListener("change", (event) => {
  updateTargetLanguage(event.target.value).catch((error) => {
    els.artist.textContent = error.message;
  });
});

setInterval(() => {
  if (!state.payload || state.payload.status !== "active") return;
  updateHeader(state.payload);
  const activeIndex = getActiveIndex(state.payload);
  if (activeIndex !== state.activeIndex) {
    state.lastRenderKey = "";
    renderLyrics(state.payload);
  } else {
    updateActiveClasses(activeIndex);
  }
}, 500);

async function bootstrap() {
  await fetchConfig();
  await loadState();
  const interval = Number(state.config?.refreshIntervalMs || 5000);
  setInterval(loadState, interval);
}

bootstrap().catch((error) => {
  els.statusLabel.textContent = "Startup failed";
  els.artist.textContent = error.message;
});
