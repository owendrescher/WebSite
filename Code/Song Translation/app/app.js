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
  scroll: document.getElementById("lyrics-scroll"),
  list: document.getElementById("lyrics-list"),
  jumpButton: document.getElementById("jump-button"),
  fullscreenButton: document.getElementById("fullscreen-button"),
  languageSelect: document.getElementById("language-select"),
  albumCover: document.getElementById("album-cover"),
  albumFallback: document.getElementById("album-fallback"),
  panelLanguageFlag: document.getElementById("panel-language-flag"),
  manualToggle: document.getElementById("manual-toggle"),
  manualPanel: document.getElementById("manual-panel"),
  manualTitle: document.getElementById("manual-title"),
  manualArtist: document.getElementById("manual-artist"),
  manualSource: document.getElementById("manual-source"),
  manualLyrics: document.getElementById("manual-lyrics"),
  manualFile: document.getElementById("manual-file"),
  manualTranslate: document.getElementById("manual-translate"),
  manualNote: document.getElementById("manual-note")
};

const SONG_SYNC_POLL_MS = 1000;
const RESET_POSITION_MS = 800;
const DRIFT_RESYNC_MS = 5000;
const LOCAL_API_BASE = "http://localhost:8974";

const state = {
  payload: null,
  activeIndex: -1,
  activeTrackKey: "",
  lastRenderKey: "",
  config: null,
  apiBase: "",
  pollInFlight: false,
  pendingImmediateRefresh: false,
  lastImmediateRefreshAtMs: 0,
  transitioningTrack: false,
  followActiveLine: true,
  lastAutoCenteredKey: "",
  suppressScrollTrackingUntilMs: 0,
  fullscreenLyrics: false,
  manualMode: false,
  playback: {
    trackKey: "",
    anchorPositionMs: 0,
    anchorClientMs: 0,
    endTimeMs: 0,
    playbackStatus: ""
  }
};

const FALLBACK_LANGUAGE_CHOICES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "it", label: "Italian" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" }
];

function normalizeApiBase(base) {
  return String(base || "").trim().replace(/\/+$/, "");
}

function getApiBaseCandidates() {
  const params = new URLSearchParams(window.location.search);
  const candidates = [];
  const queryBase = normalizeApiBase(params.get("apiBase"));

  if (queryBase) {
    candidates.push(queryBase);
  }

  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    candidates.push(normalizeApiBase(window.location.origin));
  }

  candidates.push(LOCAL_API_BASE);
  return [...new Set(candidates.filter(Boolean))];
}

function getApiUrl(path, base = state.apiBase) {
  return `${base}${path}`;
}

async function requestJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}

async function resolveApiBase(forceRefresh = false) {
  if (state.apiBase && !forceRefresh) {
    return state.apiBase;
  }

  let lastError = null;
  for (const candidate of getApiBaseCandidates()) {
    try {
      await requestJson(getApiUrl("/api/config", candidate));
      state.apiBase = candidate;
      return candidate;
    } catch (error) {
      lastError = error;
    }
  }

  state.apiBase = "";
  throw lastError || new Error("Could not reach the local Spotify bridge.");
}

async function apiGetJson(path, options = {}) {
  const base = await resolveApiBase(Boolean(options.forceRefresh));
  return requestJson(getApiUrl(path, base));
}

function normalizeLanguageTag(tag) {
  return String(tag || "").trim().toLowerCase();
}

function normalizeLanguageCode(tag) {
  const normalized = normalizeLanguageTag(tag);
  if (!normalized || normalized === "mixed") return "";

  const match = normalized.match(/^[a-z]{2}/);
  if (match) return match[0];
  return normalized.split("-")[0];
}

function normalizeLatinText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getScriptLanguageHint(text) {
  const value = String(text || "");
  if (/[\u3040-\u30ff]/.test(value)) return "ja";
  if (/[\uac00-\ud7af\u1100-\u11ff]/.test(value)) return "ko";
  if (/[\u4e00-\u9fff]/.test(value)) return "zh";
  if (/[\u0400-\u04ff]/.test(value)) return "ru";
  if (/[\u0370-\u03ff]/.test(value)) return "el";
  if (/[\u0600-\u06ff]/.test(value)) return "ar";
  return "";
}

function getLatinLanguageHint(text) {
  const normalized = normalizeLatinText(text);
  if (!normalized) return "";

  const tokens = normalized.split(" ").filter(Boolean);
  if (!tokens.length) return "";

  const markers = {
    en: ["and", "for", "from", "like", "the", "with", "you"],
    fr: ["avec", "dans", "des", "du", "est", "et", "jamais", "je", "mais", "mon", "pas", "pour", "que", "qui", "sur", "tous", "une", "vous"],
    it: ["anche", "anni", "che", "come", "con", "della", "gli", "indiana", "me", "nella", "non", "per", "ponte", "quelli", "sei", "sono", "su", "terrazza", "tre", "tutti", "una", "uno"],
    es: ["como", "con", "del", "eres", "esta", "la", "los", "para", "pero", "por", "que", "una", "uno"],
    pt: ["com", "como", "da", "de", "do", "dos", "em", "nao", "para", "por", "que", "se", "uma", "um", "voce"],
    de: ["auf", "das", "dem", "den", "der", "die", "ein", "eine", "ich", "ist", "mit", "nicht", "und", "wir"]
  };

  let bestLanguage = "";
  let bestScore = 0;
  let runnerUp = 0;

  Object.entries(markers).forEach(([language, words]) => {
    let score = 0;
    tokens.forEach((token) => {
      if (words.includes(token)) score += 1;
    });

    if (score > bestScore) {
      runnerUp = bestScore;
      bestScore = score;
      bestLanguage = language;
    } else if (score > runnerUp) {
      runnerUp = score;
    }
  });

  if (bestScore < 2 || bestScore <= runnerUp) return "";
  return bestLanguage;
}

function isScriptSpecificLanguage(languageCode) {
  return ["ar", "el", "ja", "ko", "ru", "uk", "bg", "sr", "mk", "be", "zh"].includes(languageCode);
}

function getDisplayLanguageCode(line) {
  const detected = normalizeLanguageCode(line?.sourceLanguage);
  const text = String(line?.text || "");
  const scriptHint = getScriptLanguageHint(text);
  if (scriptHint) return scriptHint;

  const latinHint = getLatinLanguageHint(text);
  if (!detected) return latinHint;
  if (isScriptSpecificLanguage(detected) && !scriptHint) {
    return latinHint || "";
  }

  return detected;
}

function getCountryCodeForLanguage(languageTag) {
  const base = normalizeLanguageCode(languageTag);
  if (!base) return "";

  const flagMap = {
    ar: "sa",
    de: "de",
    en: "gb",
    es: "es",
    fr: "fr",
    hi: "in",
    it: "it",
    ja: "jp",
    ko: "kr",
    nl: "nl",
    pl: "pl",
    pt: "pt",
    ru: "ru",
    sv: "se",
    tr: "tr",
    uk: "ua",
    vi: "vn",
    zh: "cn"
  };

  return flagMap[base] || "";
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

function getCurrentTargetLanguage() {
  return normalizeLanguageTag(els.languageSelect.value || state.config?.targetLanguage || "en") || "en";
}

function parseManualLyrics(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const lrc = line.match(/^\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]\s*(.*)$/);
      if (!lrc) {
        return { text: line, timestampMs: index * 4200, sourceLanguage: normalizeLanguageCode(els.manualSource.value) };
      }

      const minutes = Number(lrc[1]);
      const seconds = Number(lrc[2]);
      const fraction = String(lrc[3] || "0").padEnd(3, "0").slice(0, 3);
      return {
        text: lrc[4].trim(),
        timestampMs: ((minutes * 60) + seconds) * 1000 + Number(fraction),
        sourceLanguage: normalizeLanguageCode(els.manualSource.value)
      };
    })
    .filter((line) => line.text);
}

function guessManualSourceLanguage(lines) {
  const selected = normalizeLanguageCode(els.manualSource.value);
  if (selected && selected !== "auto") return selected;

  const joined = lines.map((line) => line.text).slice(0, 12).join(" ");
  return getScriptLanguageHint(joined) || getLatinLanguageHint(joined) || "auto";
}

async function translateLine(text, sourceLanguage, targetLanguage) {
  if (!text.trim()) return "";
  const source = sourceLanguage && sourceLanguage !== "auto" ? sourceLanguage : "auto";
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(`${source}|${targetLanguage}`)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Translation failed (${response.status})`);
  const data = await response.json();
  return data?.responseData?.translatedText || text;
}

async function buildManualPayload() {
  const lines = parseManualLyrics(els.manualLyrics.value);
  if (!lines.length) {
    throw new Error("Paste lyrics or import a text file first.");
  }

  const targetLanguage = getCurrentTargetLanguage();
  const sourceLanguage = guessManualSourceLanguage(lines);
  const translated = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    els.manualNote.textContent = `Translating line ${i + 1} of ${lines.length}...`;
    const translation = await translateLine(line.text, sourceLanguage, targetLanguage);
    translated.push({
      ...line,
      sourceLanguage,
      translation
    });
  }

  const durationMs = Math.max(60000, (translated.at(-1)?.timestampMs || (translated.length * 4200)) + 5000);
  return {
    status: "active",
    settings: {
      targetLanguage,
      translationProvider: "browser",
      languageChoices: FALLBACK_LANGUAGE_CHOICES
    },
    track: {
      trackKey: `manual-${Date.now()}`,
      title: els.manualTitle.value.trim() || "Manual Lyrics",
      artist: els.manualArtist.value.trim() || "Browser translation",
      album: "",
      sourceApp: "browser",
      playbackStatus: "Paused",
      positionMs: 0,
      endTimeMs: durationMs,
      lastUpdatedIso: new Date().toISOString()
    },
    lyrics: {
      mode: "plain",
      synced: [],
      plain: translated,
      sourceLanguage,
      translationVisible: true,
      provider: "browser"
    }
  };
}

function enableManualMode(payload) {
  state.manualMode = true;
  state.payload = payload;
  state.lastRenderKey = "";
  state.followActiveLine = true;
  resetPlaybackState();
  syncPlaybackState(payload);
  updateHeader(payload);
  renderLyrics(payload);
  els.manualNote.textContent = "Translated in browser mode. Live Spotify sync remains optional.";
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

function updateJumpButton() {
  els.jumpButton.textContent = state.followActiveLine ? "Following active line" : "Refocus active line";
  els.jumpButton.classList.toggle("attention", !state.followActiveLine);
}

function updateFullscreenButton() {
  els.fullscreenButton.textContent = state.fullscreenLyrics ? "Exit fullscreen" : "Fullscreen lyrics";
  els.fullscreenButton.setAttribute("aria-pressed", String(state.fullscreenLyrics));
}

function setFullscreenLyrics(enabled) {
  state.fullscreenLyrics = Boolean(enabled);
  document.body.classList.toggle("fullscreen-lyrics", state.fullscreenLyrics);
  state.followActiveLine = true;
  state.lastAutoCenteredKey = "";
  state.lastRenderKey = "";
  updateJumpButton();
  updateFullscreenButton();
  renderLyrics(state.payload);
}

function getRenderableLines(payload) {
  const lyrics = payload?.lyrics;
  const mode = lyrics?.mode || "missing";
  return mode === "synced" ? lyrics.synced : mode === "plain" ? lyrics.plain : [];
}

function applyFullscreenFontSizes(originalSize) {
  const translationSize = Math.max(18, Math.floor(originalSize * 0.58));
  const phoneticSize = Math.max(16, Math.floor(originalSize * 0.45));

  document.documentElement.style.setProperty("--fullscreen-original-size", `${originalSize}px`);
  document.documentElement.style.setProperty("--fullscreen-translation-size", `${translationSize}px`);
  document.documentElement.style.setProperty("--fullscreen-phonetic-size", `${phoneticSize}px`);
}

function fullscreenLineOverflows(line) {
  const verticalOverflow = line.scrollHeight - line.clientHeight > 1;
  const horizontalOverflow = line.scrollWidth - line.clientWidth > 1;
  return verticalOverflow || horizontalOverflow;
}

function applyFullscreenLineFontSizes(line, originalSize) {
  const translationSize = Math.max(18, Math.floor(originalSize * 0.58));
  const phoneticSize = Math.max(16, Math.floor(originalSize * 0.45));
  line.style.setProperty("--line-original-size", `${originalSize}px`);
  line.style.setProperty("--line-translation-size", `${translationSize}px`);
  line.style.setProperty("--line-phonetic-size", `${phoneticSize}px`);
}

function clearFullscreenLineFontSizes(line) {
  line.style.removeProperty("--line-original-size");
  line.style.removeProperty("--line-translation-size");
  line.style.removeProperty("--line-phonetic-size");
}

function fitFullscreenLine(line, baseOriginalSize) {
  clearFullscreenLineFontSizes(line);
  let fittedOriginalSize = baseOriginalSize;
  const minOriginalSize = 18;

  while (fullscreenLineOverflows(line) && fittedOriginalSize > minOriginalSize) {
    fittedOriginalSize -= 2;
    applyFullscreenLineFontSizes(line, fittedOriginalSize);
  }
}

function syncFullscreenSizing() {
  if (!state.fullscreenLyrics) {
    document.documentElement.style.removeProperty("--fullscreen-original-size");
    document.documentElement.style.removeProperty("--fullscreen-translation-size");
    document.documentElement.style.removeProperty("--fullscreen-phonetic-size");
    document.documentElement.style.removeProperty("--fullscreen-line-height");
    return;
  }

  const visibleLines = [...els.list.querySelectorAll(".lyric-line")];
  if (!visibleLines.length) return;

  const availableHeight = Math.max(320, els.scroll.clientHeight - 24);
  const gap = parseFloat(window.getComputedStyle(els.list).rowGap || window.getComputedStyle(els.list).gap || "0") || 0;
  const lineHeight = Math.max(96, Math.floor((availableHeight - (gap * 3)) / 4));
  const baseOriginalSize = Math.max(28, Math.min(104, Math.floor(availableHeight / 9.44)));

  document.documentElement.style.setProperty("--fullscreen-line-height", `${lineHeight}px`);
  applyFullscreenFontSizes(baseOriginalSize);

  visibleLines.forEach((line) => fitFullscreenLine(line, baseOriginalSize));
}

function getFullscreenFollowOffset(active) {
  const gap = parseFloat(window.getComputedStyle(els.list).rowGap || window.getComputedStyle(els.list).gap || "0") || 0;
  return active.clientHeight + gap;
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

function getLyricLanguageSummary(lyrics) {
  const lines = [
    ...(Array.isArray(lyrics?.synced) ? lyrics.synced : []),
    ...(Array.isArray(lyrics?.plain) ? lyrics.plain : [])
  ];

  const detectedLanguages = [...new Set(
    lines
      .map((line) => getDisplayLanguageCode(line))
      .filter(Boolean)
  )];
  const nonEnglishLanguages = detectedLanguages.filter((language) => language !== "en");
  const flaggableLanguages = nonEnglishLanguages.length >= 2 ? nonEnglishLanguages : [];

  return {
    detectedLanguages,
    flaggableLanguages
  };
}

function createFlagIcon(languageTag, className, titlePrefix) {
  const languageCode = normalizeLanguageCode(languageTag);
  const countryCode = getCountryCodeForLanguage(languageCode);
  if (!languageCode || !countryCode) return null;

  const icon = document.createElement("img");
  icon.className = className;
  icon.src = `https://flagcdn.com/${countryCode}.svg`;
  icon.alt = languageCode.toUpperCase();
  icon.title = `${titlePrefix} ${languageCode.toUpperCase()}`;
  icon.loading = "lazy";
  icon.decoding = "async";
  return icon;
}

function updateLanguageFlag(lyrics) {
  const { detectedLanguages } = getLyricLanguageSummary(lyrics);
  const flags = detectedLanguages
    .map((language) => createFlagIcon(language, "flag-icon flag-icon-heading", "Detected lyric language:"))
    .filter(Boolean);

  els.panelLanguageFlag.replaceChildren();
  if (!flags.length) {
    els.panelLanguageFlag.classList.add("hidden");
    els.panelLanguageFlag.removeAttribute("title");
    return;
  }

  els.panelLanguageFlag.append(...flags);
  els.panelLanguageFlag.classList.remove("hidden");
  els.panelLanguageFlag.title = `Detected lyric languages: ${detectedLanguages.join(", ")}`;
}

function buildLine(line, index, activeIndex, mode, flaggableLanguages, options = {}) {
  const { hideTime = false } = options;
  const article = document.createElement("article");
  article.className = "lyric-line";
  article.dataset.index = String(index);

  if (index === activeIndex) article.classList.add("active");
  else if (index < activeIndex) article.classList.add("past");
  else article.classList.add("future");

  const original = document.createElement("p");
  original.className = "lyric-original";
  original.append(document.createTextNode(line.text || ""));

  const lineLanguage = getDisplayLanguageCode(line);
  if (flaggableLanguages.includes(lineLanguage)) {
    const lineFlag = createFlagIcon(lineLanguage, "flag-icon lyric-line-flag", "Line language:");
    if (lineFlag) {
      original.append(document.createTextNode(" "));
      original.appendChild(lineFlag);
    }
  }

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
  }

  if (mode === "synced" && !hideTime) {
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

function getCurrentActiveLineKey() {
  return `${state.payload?.track?.trackKey || "idle"}|${state.activeIndex}`;
}

function centerActiveLine(options = {}) {
  const { behavior = "smooth", forceFollow = false } = options;
  const active = els.list.querySelector(".lyric-line.active");
  if (!active) return;

  if (forceFollow) {
    state.followActiveLine = true;
    updateJumpButton();
  }

  state.lastAutoCenteredKey = getCurrentActiveLineKey();
  state.suppressScrollTrackingUntilMs = Date.now() + 500;
  if (state.fullscreenLyrics) {
    const desiredTop = Math.max(0, active.offsetTop - getFullscreenFollowOffset(active));
    els.scroll.scrollTo({ top: desiredTop, behavior });
    return;
  }

  active.scrollIntoView({ behavior, block: "center" });
}

function maybeAutoCenterActiveLine() {
  if (!state.followActiveLine || state.activeIndex < 0) return;

  const activeKey = getCurrentActiveLineKey();
  if (activeKey === state.lastAutoCenteredKey) return;
  centerActiveLine({ behavior: "smooth" });
}

function handleLyricsScroll() {
  if (Date.now() < state.suppressScrollTrackingUntilMs) return;
  if (!state.followActiveLine) return;

  const active = els.list.querySelector(".lyric-line.active");
  if (!active) return;

  let centerDrift = 0;
  let allowedDrift = 0;

  if (state.fullscreenLyrics) {
    const activeTop = active.offsetTop - els.scroll.scrollTop;
    const desiredTop = getFullscreenFollowOffset(active);
    centerDrift = Math.abs(activeTop - desiredTop);
    allowedDrift = Math.max(18, active.clientHeight * 0.12);
  } else {
    const scrollBox = els.scroll.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    const scrollCenter = scrollBox.top + (scrollBox.height / 2);
    const activeCenter = activeBox.top + (activeBox.height / 2);
    centerDrift = Math.abs(activeCenter - scrollCenter);
    allowedDrift = Math.max(96, scrollBox.height * 0.16);
  }

  if (centerDrift > allowedDrift) {
    state.followActiveLine = false;
    updateJumpButton();
  }
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

function showConnectionHelp(error) {
  if (state.manualMode) return;
  resetPlaybackState();
  state.transitioningTrack = false;
  state.payload = null;
  state.activeIndex = -1;
  state.activeTrackKey = "";
  state.lastRenderKey = "";

  els.list.replaceChildren();
  els.empty.hidden = false;
  els.statusLabel.textContent = "Local bridge offline";
  els.title.textContent = "Dual Lyrics";
  els.artist.textContent = "Use Manual lyrics for browser-only translation, or start the local bridge for Spotify sync.";
  els.translationChip.textContent = "Browser mode available";
  els.modeChip.textContent = "Manual or local bridge";
  els.progressBar.style.width = "0%";
  els.elapsed.textContent = "00:00";
  els.duration.textContent = "00:00";
  els.empty.querySelector("h3").textContent = "Use manual lyrics or start Spotify bridge";
  els.emptyCopy.textContent = `Manual lyrics translate in this page. Automatic Spotify detection still needs the local bridge at ${LOCAL_API_BASE}, because browsers cannot read desktop app playback state directly.`;
  els.panelLanguageFlag.replaceChildren();
  els.panelLanguageFlag.classList.add("hidden");
  updateAlbumArt(null);

  if (error?.message) {
    els.fullscreenButton.title = error.message;
  }
}

function renderLyrics(payload) {
  const lyrics = payload?.lyrics;
  const mode = lyrics?.mode || "missing";
  const activeIndex = getActiveIndex(payload);
  const lines = getRenderableLines(payload);
  const renderKey = [
    payload?.track?.trackKey || "idle",
    mode,
    String(lyrics?.translationVisible),
    String(window.innerWidth),
    String(window.innerHeight),
    state.fullscreenLyrics ? "fullscreen" : "standard"
  ].join("|");

  if (state.lastRenderKey === renderKey) {
    rememberActiveIndex(payload, activeIndex);
    updateActiveClasses(activeIndex);
    maybeAutoCenterActiveLine();
    syncFullscreenSizing();
    return;
  }

  state.lastRenderKey = renderKey;
  rememberActiveIndex(payload, activeIndex);
  state.lastAutoCenteredKey = "";
  els.list.replaceChildren();

  if (payload?.status !== "active") {
    els.empty.hidden = false;
    return;
  }

  if (!lines.length) {
    els.empty.hidden = false;
    if (mode === "loading") {
      els.empty.querySelector("h3").textContent = "Loading lyrics";
      els.emptyCopy.textContent = "Track sync stays live while lyrics continue loading in the background.";
    } else {
      els.empty.querySelector("h3").textContent = "Lyrics not found for this track";
      els.emptyCopy.textContent = "Spotify sync is still active, but the lyric source has not returned lines for this song.";
    }
    syncFullscreenSizing();
    return;
  }

  els.empty.hidden = true;
  const { flaggableLanguages } = getLyricLanguageSummary(lyrics);
  const fragment = document.createDocumentFragment();
  lines.forEach((line, index) => {
    fragment.appendChild(buildLine(line, index, activeIndex, mode, flaggableLanguages, { hideTime: state.fullscreenLyrics }));
  });
  els.list.appendChild(fragment);
  updateActiveClasses(activeIndex);

  requestAnimationFrame(() => {
    maybeAutoCenterActiveLine();
    syncFullscreenSizing();
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
  updateLanguageFlag(lyrics);

  if (payload?.status !== "active" || !track) {
    state.followActiveLine = true;
    state.lastAutoCenteredKey = "";
    updateJumpButton();
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
    els.emptyCopy.textContent = "The app checks Spotify every second, keeps song changes ahead of lyric loading, and translates automatically when needed.";
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
  try {
    state.config = await apiGetJson("/api/config");
  } catch (error) {
    state.config = {
      targetLanguage: "en",
      translationProvider: "browser",
      languageChoices: FALLBACK_LANGUAGE_CHOICES
    };
  }
  renderLanguageChoices(state.config);
}

async function updateTargetLanguage(targetLanguage) {
  await apiGetJson(`/api/preferences?targetLanguage=${encodeURIComponent(targetLanguage)}`);
  state.lastRenderKey = "";
  await fetchConfig();
  await loadState();
}

async function loadState() {
  if (state.manualMode) return;
  try {
    const previousTrackKey = state.payload?.track?.trackKey || "";
    state.payload = await apiGetJson("/api/state");
    const currentTrackKey = state.payload?.track?.trackKey || "";
    if (currentTrackKey && currentTrackKey !== previousTrackKey) {
      state.followActiveLine = true;
      state.lastAutoCenteredKey = "";
      updateJumpButton();
    }
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
  } catch (error) {
    showConnectionHelp(error);
  }
}

els.jumpButton.addEventListener("click", () => {
  centerActiveLine({ behavior: "smooth", forceFollow: true });
});
els.fullscreenButton.addEventListener("click", () => {
  setFullscreenLyrics(!state.fullscreenLyrics);
});
els.languageSelect.addEventListener("change", (event) => {
  if (state.manualMode) {
    state.config = {
      ...(state.config || {}),
      targetLanguage: event.target.value,
      languageChoices: FALLBACK_LANGUAGE_CHOICES
    };
    els.manualNote.textContent = "Output language changed. Run manual translation again to refresh the lines.";
    return;
  }
  updateTargetLanguage(event.target.value).catch((error) => {
    els.artist.textContent = error.message;
  });
});
els.manualToggle.addEventListener("click", () => {
  const isHidden = els.manualPanel.classList.toggle("hidden");
  els.manualToggle.setAttribute("aria-expanded", String(!isHidden));
});
els.manualFile.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  els.manualLyrics.value = await file.text();
  if (!els.manualTitle.value.trim()) {
    els.manualTitle.value = file.name.replace(/\.[^.]+$/, "");
  }
});
els.manualTranslate.addEventListener("click", async () => {
  els.manualTranslate.disabled = true;
  try {
    const payload = await buildManualPayload();
    enableManualMode(payload);
  } catch (error) {
    els.manualNote.textContent = error.message;
  } finally {
    els.manualTranslate.disabled = false;
  }
});
els.scroll.addEventListener("scroll", handleLyricsScroll, { passive: true });
window.addEventListener("resize", () => {
  state.lastRenderKey = "";
  syncFullscreenSizing();
  renderLyrics(state.payload);
});

function startUiTicker() {
  const tick = () => {
    if (state.payload) {
      updateHeader(state.payload);
      if (state.payload.status === "active") {
        const activeIndex = getActiveIndex(state.payload);
        if (activeIndex !== state.activeIndex) {
          renderLyrics(state.payload);
        }
      }
    }

    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
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

    const nextDelay = state.pendingImmediateRefresh ? 0 : SONG_SYNC_POLL_MS;
    state.pendingImmediateRefresh = false;
    window.setTimeout(poll, nextDelay);
  };

  window.setTimeout(poll, SONG_SYNC_POLL_MS);
}

async function bootstrap() {
  await Promise.all([
    fetchConfig(),
    loadState()
  ]);
  updateJumpButton();
  updateFullscreenButton();
  startUiTicker();
  startStatePolling();
}

bootstrap().catch((error) => {
  showConnectionHelp(error);
});
