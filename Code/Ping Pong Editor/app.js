const els = {
  videoInput: document.getElementById("videoInput"),
  analyzeBtn: document.getElementById("analyzeBtn"),
  video: document.getElementById("video"),
  emptyState: document.getElementById("emptyState"),
  scoreboard: document.getElementById("scoreboard"),
  playerAName: document.getElementById("playerAName"),
  playerBName: document.getElementById("playerBName"),
  playerAScore: document.getElementById("playerAScore"),
  playerBScore: document.getElementById("playerBScore"),
  sensitivityRange: document.getElementById("sensitivityRange"),
  spacingRange: document.getElementById("spacingRange"),
  rallyGapRange: document.getElementById("rallyGapRange"),
  paddingRange: document.getElementById("paddingRange"),
  spacingValue: document.getElementById("spacingValue"),
  rallyGapValue: document.getElementById("rallyGapValue"),
  paddingValue: document.getElementById("paddingValue"),
  timeline: document.getElementById("timeline"),
  playhead: document.getElementById("playhead"),
  analysisSummary: document.getElementById("analysisSummary"),
  rallyList: document.getElementById("rallyList"),
  scoreEventList: document.getElementById("scoreEventList"),
  prevRallyBtn: document.getElementById("prevRallyBtn"),
  playRallyBtn: document.getElementById("playRallyBtn"),
  nextRallyBtn: document.getElementById("nextRallyBtn"),
  timeReadout: document.getElementById("timeReadout"),
  nameAInput: document.getElementById("nameAInput"),
  nameBInput: document.getElementById("nameBInput"),
  scoreAInput: document.getElementById("scoreAInput"),
  scoreBInput: document.getElementById("scoreBInput"),
  addScoreEventBtn: document.getElementById("addScoreEventBtn"),
  scoreTextInput: document.getElementById("scoreTextInput"),
  parseScoresBtn: document.getElementById("parseScoresBtn"),
  exportPlanBtn: document.getElementById("exportPlanBtn"),
};

const state = {
  fileName: "",
  videoUrl: "",
  duration: 0,
  hitTimes: [],
  rallies: [],
  scoreEvents: [],
  activeRallyIndex: 0,
  playUntil: null,
};

const numberWords = new Map([
  ["zero", 0],
  ["oh", 0],
  ["love", 0],
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["for", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
  ["ten", 10],
  ["eleven", 11],
  ["twelve", 12],
  ["thirteen", 13],
  ["fourteen", 14],
  ["fifteen", 15],
  ["sixteen", 16],
  ["seventeen", 17],
  ["eighteen", 18],
  ["nineteen", 19],
  ["twenty", 20],
  ["twentyone", 21],
]);

function formatTime(seconds) {
  const safe = Math.max(0, seconds || 0);
  const minutes = Math.floor(safe / 60);
  const wholeSeconds = Math.floor(safe % 60);
  const hundredths = Math.floor((safe % 1) * 100);
  return `${String(minutes).padStart(2, "0")}:${String(wholeSeconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

function parseClock(value) {
  const clean = value.trim();
  if (!clean) {
    return null;
  }

  const parts = clean.split(":").map(Number);
  if (parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return parts[0];
}

function parseScorePair(text) {
  const numeric = text.match(/\b(\d{1,2})\s*[-:]\s*(\d{1,2})\b/);
  if (numeric) {
    return [Number(numeric[1]), Number(numeric[2])];
  }

  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.replace("-", ""));

  const values = [];
  tokens.forEach((token) => {
    if (/^\d{1,2}$/.test(token)) {
      values.push(Number(token));
    } else if (numberWords.has(token)) {
      values.push(numberWords.get(token));
    }
  });

  return values.length >= 2 ? [values[0], values[1]] : null;
}

function syncSettingLabels() {
  els.spacingValue.textContent = `${els.spacingRange.value} ms`;
  els.rallyGapValue.textContent = `${Number(els.rallyGapRange.value).toFixed(1)} s`;
  els.paddingValue.textContent = `${Number(els.paddingRange.value).toFixed(1)} s`;
}

function updateScoreboard() {
  const current = els.video.currentTime || 0;
  const active = [...state.scoreEvents]
    .sort((a, b) => a.time - b.time)
    .filter((event) => event.time <= current + 0.02)
    .pop();

  els.playerAName.textContent = els.nameAInput.value || "Player A";
  els.playerBName.textContent = els.nameBInput.value || "Player B";
  els.playerAScore.textContent = active ? active.a : Number(els.scoreAInput.value || 0);
  els.playerBScore.textContent = active ? active.b : Number(els.scoreBInput.value || 0);
  els.scoreboard.hidden = !state.videoUrl;
}

function drawTimeline() {
  els.timeline.querySelectorAll(".hit-marker, .rally-block, .score-marker").forEach((node) => node.remove());

  if (!state.duration) {
    els.playhead.style.left = "0%";
    return;
  }

  state.rallies.forEach((rally, index) => {
    const block = document.createElement("button");
    block.type = "button";
    block.className = "rally-block";
    block.style.left = `${(rally.cutStart / state.duration) * 100}%`;
    block.style.width = `${Math.max(0.5, ((rally.cutEnd - rally.cutStart) / state.duration) * 100)}%`;
    block.textContent = index + 1;
    block.title = `Rally ${index + 1}: ${formatTime(rally.cutStart)} - ${formatTime(rally.cutEnd)}`;
    block.addEventListener("click", () => seekRally(index));
    els.timeline.appendChild(block);
  });

  state.hitTimes.forEach((time) => {
    const marker = document.createElement("span");
    marker.className = "hit-marker";
    marker.style.left = `${(time / state.duration) * 100}%`;
    marker.title = `Hit at ${formatTime(time)}`;
    els.timeline.appendChild(marker);
  });

  state.scoreEvents.forEach((event) => {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "score-marker";
    marker.style.left = `${(event.time / state.duration) * 100}%`;
    marker.title = `${formatTime(event.time)} score ${event.a}-${event.b}`;
    marker.textContent = `${event.a}-${event.b}`;
    marker.addEventListener("click", () => {
      els.video.currentTime = event.time;
      updateScoreboard();
    });
    els.timeline.appendChild(marker);
  });

  updatePlayhead();
}

function updatePlayhead() {
  if (!state.duration) {
    els.playhead.style.left = "0%";
    return;
  }

  els.playhead.style.left = `${Math.min(100, (els.video.currentTime / state.duration) * 100)}%`;
  els.timeReadout.textContent = formatTime(els.video.currentTime);
}

function detectHits(audioBuffer) {
  const sampleRate = audioBuffer.sampleRate;
  const channelCount = audioBuffer.numberOfChannels;
  const windowSize = Math.floor(sampleRate * 0.012);
  const hopSize = Math.floor(sampleRate * 0.006);
  const energies = [];

  for (let start = 0; start < audioBuffer.length - windowSize; start += hopSize) {
    let sum = 0;
    for (let channel = 0; channel < channelCount; channel += 1) {
      const data = audioBuffer.getChannelData(channel);
      for (let i = 0; i < windowSize; i += 1) {
        const sample = data[start + i];
        sum += sample * sample;
      }
    }
    energies.push(Math.sqrt(sum / (windowSize * channelCount)));
  }

  const sorted = [...energies].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length * 0.5)] || 0;
  const p90 = sorted[Math.floor(sorted.length * 0.9)] || median;
  const sensitivity = Number(els.sensitivityRange.value);
  const threshold = median + (p90 - median) * (1.62 - sensitivity * 0.085);
  const minSpacing = Number(els.spacingRange.value) / 1000;
  const hits = [];
  let lastHit = -Infinity;

  for (let i = 8; i < energies.length - 8; i += 1) {
    const current = energies[i];
    const previousAverage = energies.slice(Math.max(0, i - 8), i).reduce((sum, value) => sum + value, 0) / Math.min(8, i);
    const nextMax = Math.max(...energies.slice(i + 1, i + 5));
    const time = (i * hopSize) / sampleRate;
    const isTransient = current > threshold && current > previousAverage * 2.15 && current >= nextMax * 0.82;

    if (isTransient && time - lastHit >= minSpacing) {
      hits.push(time);
      lastHit = time;
    }
  }

  return hits;
}

function groupRallies(hitTimes) {
  const rallyGap = Number(els.rallyGapRange.value);
  const padding = Number(els.paddingRange.value);
  const rallies = [];
  let group = [];

  hitTimes.forEach((time) => {
    if (!group.length || time - group[group.length - 1] <= rallyGap) {
      group.push(time);
      return;
    }

    if (group.length >= 2) {
      rallies.push(createRally(group, padding));
    }
    group = [time];
  });

  if (group.length >= 2) {
    rallies.push(createRally(group, padding));
  }

  return rallies;
}

function createRally(hitGroup, padding) {
  const start = hitGroup[0];
  const end = hitGroup[hitGroup.length - 1];
  return {
    start,
    end,
    hitCount: hitGroup.length,
    cutStart: Math.max(0, start - padding),
    cutEnd: Math.min(state.duration, end + padding),
  };
}

async function analyzeVideo() {
  const file = els.videoInput.files?.[0];
  if (!file) {
    return;
  }

  els.analyzeBtn.disabled = true;
  els.analyzeBtn.textContent = "Analyzing...";
  els.analysisSummary.textContent = "Decoding audio and listening for ball hits...";

  try {
    const arrayBuffer = await file.arrayBuffer();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    await audioContext.close();

    state.hitTimes = detectHits(audioBuffer);
    state.rallies = groupRallies(state.hitTimes);
    state.activeRallyIndex = 0;
    renderResults();
  } catch (error) {
    console.error(error);
    els.analysisSummary.textContent = "Could not decode this video's audio. Try another browser or transcode the file to MP4.";
  } finally {
    els.analyzeBtn.disabled = false;
    els.analyzeBtn.textContent = "Analyze Audio";
  }
}

function renderResults() {
  els.analysisSummary.textContent = `${state.hitTimes.length} likely hits found. ${state.rallies.length} rally cut${state.rallies.length === 1 ? "" : "s"} suggested.`;
  renderRallyList();
  renderScoreEvents();
  drawTimeline();
  updateButtons();
}

function renderRallyList() {
  els.rallyList.innerHTML = "";
  els.rallyList.classList.toggle("empty-list", state.rallies.length === 0);

  if (!state.rallies.length) {
    els.rallyList.textContent = "No rallies yet.";
    return;
  }

  state.rallies.forEach((rally, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `rally-item${index === state.activeRallyIndex ? " is-active" : ""}`;
    item.innerHTML = `
      <strong>Rally ${index + 1}</strong>
      <span>${formatTime(rally.cutStart)} - ${formatTime(rally.cutEnd)}</span>
      <em>${rally.hitCount} hits</em>
    `;
    item.addEventListener("click", () => seekRally(index));
    els.rallyList.appendChild(item);
  });
}

function renderScoreEvents() {
  els.scoreEventList.innerHTML = "";
  els.scoreEventList.classList.toggle("empty-list", state.scoreEvents.length === 0);

  if (!state.scoreEvents.length) {
    els.scoreEventList.textContent = "No score events yet.";
    return;
  }

  [...state.scoreEvents].sort((a, b) => a.time - b.time).forEach((event) => {
    const item = document.createElement("div");
    item.className = "score-event";
    item.innerHTML = `
      <button type="button" data-time="${event.time}">${formatTime(event.time)}</button>
      <strong>${event.a}-${event.b}</strong>
      <span>${event.source}</span>
    `;
    item.querySelector("button").addEventListener("click", () => {
      els.video.currentTime = event.time;
    });
    els.scoreEventList.appendChild(item);
  });
}

function seekRally(index) {
  const rally = state.rallies[index];
  if (!rally) {
    return;
  }

  state.activeRallyIndex = index;
  els.video.currentTime = rally.cutStart;
  renderRallyList();
  updateButtons();
}

function playActiveRally() {
  const rally = state.rallies[state.activeRallyIndex];
  if (!rally) {
    return;
  }

  state.playUntil = rally.cutEnd;
  els.video.currentTime = rally.cutStart;
  els.video.play();
}

function updateButtons() {
  const hasVideo = Boolean(state.videoUrl);
  const hasRallies = state.rallies.length > 0;
  els.addScoreEventBtn.disabled = !hasVideo;
  els.prevRallyBtn.disabled = !hasRallies || state.activeRallyIndex <= 0;
  els.playRallyBtn.disabled = !hasRallies;
  els.nextRallyBtn.disabled = !hasRallies || state.activeRallyIndex >= state.rallies.length - 1;
  els.exportPlanBtn.disabled = !hasVideo || (!hasRallies && !state.scoreEvents.length);
}

function addScoreEvent(time, a, b, source = "manual") {
  if (!Number.isFinite(time) || !Number.isFinite(a) || !Number.isFinite(b)) {
    return;
  }

  state.scoreEvents.push({
    time: Math.max(0, Math.min(state.duration || time, time)),
    a,
    b,
    source,
  });
  state.scoreEvents.sort((x, y) => x.time - y.time);
  renderScoreEvents();
  drawTimeline();
  updateScoreboard();
  updateButtons();
}

function parseScoreNotes() {
  const lines = els.scoreTextInput.value.split(/\r?\n/);
  let added = 0;

  lines.forEach((line) => {
    const match = line.match(/^\s*(\d{1,2}(?::\d{2}){0,2}(?:\.\d+)?)\s+(.+)$/);
    if (!match) {
      return;
    }

    const time = parseClock(match[1]);
    const pair = parseScorePair(match[2]);
    if (!pair || time === null) {
      return;
    }

    addScoreEvent(time, pair[0], pair[1], "notes");
    added += 1;
  });

  if (added) {
    els.scoreTextInput.value = "";
  }
}

function copyEditPlan() {
  const plan = {
    video: state.fileName,
    duration: state.duration,
    detection: {
      sensitivity: Number(els.sensitivityRange.value),
      minimumHitSpacingMs: Number(els.spacingRange.value),
      rallyGapSeconds: Number(els.rallyGapRange.value),
      cutPaddingSeconds: Number(els.paddingRange.value),
    },
    cuts: state.rallies.map((rally, index) => ({
      label: `Rally ${index + 1}`,
      start: Number(rally.cutStart.toFixed(3)),
      end: Number(rally.cutEnd.toFixed(3)),
      hitCount: rally.hitCount,
    })),
    scoreboard: {
      playerA: els.nameAInput.value || "Player A",
      playerB: els.nameBInput.value || "Player B",
      events: state.scoreEvents.map((event) => ({
        time: Number(event.time.toFixed(3)),
        score: `${event.a}-${event.b}`,
        source: event.source,
      })),
    },
  };

  navigator.clipboard?.writeText(JSON.stringify(plan, null, 2));
  els.exportPlanBtn.textContent = "Copied";
  setTimeout(() => {
    els.exportPlanBtn.textContent = "Copy Edit Plan";
  }, 1200);
}

els.videoInput.addEventListener("change", () => {
  const file = els.videoInput.files?.[0];
  if (!file) {
    return;
  }

  if (state.videoUrl) {
    URL.revokeObjectURL(state.videoUrl);
  }

  state.fileName = file.name;
  state.videoUrl = URL.createObjectURL(file);
  state.hitTimes = [];
  state.rallies = [];
  state.scoreEvents = [];
  state.activeRallyIndex = 0;
  els.video.src = state.videoUrl;
  els.emptyState.hidden = true;
  els.analyzeBtn.disabled = false;
  els.analysisSummary.textContent = "Video loaded. Analyze audio to find hits.";
  renderResults();
});

els.video.addEventListener("loadedmetadata", () => {
  state.duration = els.video.duration || 0;
  drawTimeline();
  updateButtons();
});

els.video.addEventListener("timeupdate", () => {
  if (state.playUntil && els.video.currentTime >= state.playUntil) {
    els.video.pause();
    state.playUntil = null;
  }

  updatePlayhead();
  updateScoreboard();
});

els.timeline.addEventListener("click", (event) => {
  if (!state.duration || event.target !== els.timeline) {
    return;
  }

  const rect = els.timeline.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  els.video.currentTime = Math.max(0, Math.min(state.duration, ratio * state.duration));
});

els.analyzeBtn.addEventListener("click", analyzeVideo);
els.prevRallyBtn.addEventListener("click", () => seekRally(Math.max(0, state.activeRallyIndex - 1)));
els.nextRallyBtn.addEventListener("click", () => seekRally(Math.min(state.rallies.length - 1, state.activeRallyIndex + 1)));
els.playRallyBtn.addEventListener("click", playActiveRally);
els.addScoreEventBtn.addEventListener("click", () => {
  addScoreEvent(els.video.currentTime, Number(els.scoreAInput.value || 0), Number(els.scoreBInput.value || 0));
});
els.parseScoresBtn.addEventListener("click", parseScoreNotes);
els.exportPlanBtn.addEventListener("click", copyEditPlan);

[els.sensitivityRange, els.spacingRange, els.rallyGapRange, els.paddingRange].forEach((input) => {
  input.addEventListener("input", () => {
    syncSettingLabels();
    if (state.hitTimes.length) {
      state.rallies = groupRallies(state.hitTimes);
      renderResults();
    }
  });
});

[els.nameAInput, els.nameBInput, els.scoreAInput, els.scoreBInput].forEach((input) => {
  input.addEventListener("input", updateScoreboard);
});

syncSettingLabels();
updateButtons();
