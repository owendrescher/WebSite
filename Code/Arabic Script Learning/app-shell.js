(function registerShell() {
  const runtime = (window.ScriptLearningRuntime = {
    BUILD_ID: window.ScriptLearningData.BUILD_ID,
    HOME_VIEW: window.ScriptLearningData.HOME_VIEW,
    SCRIPTS: window.ScriptLearningData.SCRIPTS,
    SCRIPT_LIST: Object.values(window.ScriptLearningData.SCRIPTS),
    STORAGE_PREFIX: "script-learning-studio",
    MATCH_PAIR_COUNT: 6,
    CHOICE_QUESTION_COUNT: 10,
    CHOICE_OPTION_COUNT: 4,
    MATCH_TILE_DROP_DISTANCE: 110,
    TRACE_SIZE: 200,
    TRACE_POINTER_END_THRESHOLD: 0.34,
    TRACE_POINTER_END_SPAN_THRESHOLD: 0.54,
    SVG_NS: "http://www.w3.org/2000/svg"
  });

  runtime.SCRIPT_LIST.forEach((script) => {
    script.letterById = Object.fromEntries(script.letters.map((entry) => [entry.id, entry]));
  });

  runtime.elements = {
    heroEyebrow: document.getElementById("hero-eyebrow"),
    heroTitle: document.getElementById("hero-title"),
    heroText: document.getElementById("hero-text"),
    heroBadges: document.getElementById("hero-badges"),
    metricOneText: document.getElementById("metric-one-text"),
    metricTwoText: document.getElementById("metric-two-text"),
    metricThreeText: document.getElementById("metric-three-text"),
    scriptPanel: document.getElementById("script-panel"),
    scriptGrid: document.getElementById("script-grid"),
    scriptToolbar: document.getElementById("script-toolbar"),
    scriptSwitcher: document.getElementById("script-switcher"),
    toolbarTitle: document.getElementById("toolbar-title"),
    toolbarText: document.getElementById("toolbar-text"),
    browseScripts: document.getElementById("browse-scripts"),
    modePanel: document.getElementById("mode-panel"),
    modePanelKicker: document.getElementById("mode-panel-kicker"),
    modePanelTitle: document.getElementById("mode-panel-title"),
    modePanelText: document.getElementById("mode-panel-text"),
    modeMatch: document.getElementById("mode-match"),
    modeChoice: document.getElementById("mode-choice"),
    modeTrace: document.getElementById("mode-trace"),
    modeMatchTitle: document.getElementById("mode-match-title"),
    modeMatchText: document.getElementById("mode-match-text"),
    modeChoiceTitle: document.getElementById("mode-choice-title"),
    modeChoiceText: document.getElementById("mode-choice-text"),
    modeTraceTitle: document.getElementById("mode-trace-title"),
    modeTraceText: document.getElementById("mode-trace-text"),
    matchPanel: document.getElementById("match-panel"),
    matchHome: document.getElementById("match-home"),
    matchTitle: document.getElementById("match-title"),
    matchStart: document.getElementById("match-start"),
    matchReset: document.getElementById("match-reset"),
    matchPromptLabel: document.getElementById("match-prompt-label"),
    matchLetter: document.getElementById("match-letter"),
    matchLetterName: document.getElementById("match-letter-name"),
    matchCopy: document.getElementById("match-copy"),
    answerGrid: document.getElementById("answer-grid"),
    timeLeft: document.getElementById("time-left"),
    scoreValue: document.getElementById("score-value"),
    streakValue: document.getElementById("streak-value"),
    accuracyValue: document.getElementById("accuracy-value"),
    timeMeterFill: document.getElementById("time-meter-fill"),
    matchFeedback: document.getElementById("match-feedback"),
    matchSummary: document.getElementById("match-summary"),
    summaryCopy: document.getElementById("summary-copy"),
    leaderboardList: document.getElementById("leaderboard-list"),
    choicePanel: document.getElementById("choice-panel"),
    choiceHome: document.getElementById("choice-home"),
    choiceTitle: document.getElementById("choice-title"),
    choiceStart: document.getElementById("choice-start"),
    choiceReset: document.getElementById("choice-reset"),
    choicePromptLabel: document.getElementById("choice-prompt-label"),
    choiceSymbol: document.getElementById("choice-symbol"),
    choiceReveal: document.getElementById("choice-reveal"),
    choiceCopy: document.getElementById("choice-copy"),
    choiceOptions: document.getElementById("choice-options"),
    choiceTime: document.getElementById("choice-time"),
    choiceScore: document.getElementById("choice-score"),
    choiceStreak: document.getElementById("choice-streak"),
    choiceAccuracy: document.getElementById("choice-accuracy"),
    choiceProgressFill: document.getElementById("choice-progress-fill"),
    choiceFeedback: document.getElementById("choice-feedback"),
    choiceSummary: document.getElementById("choice-summary"),
    choiceSummaryCopy: document.getElementById("choice-summary-copy"),
    choiceLeaderboardList: document.getElementById("choice-leaderboard-list"),
    tracePanel: document.getElementById("trace-panel"),
    tracePanelTitle: document.getElementById("trace-panel-title"),
    tracePanelText: document.getElementById("trace-panel-text"),
    traceHome: document.getElementById("trace-home"),
    traceRandom: document.getElementById("trace-random"),
    tracePronounce: document.getElementById("trace-pronounce"),
    traceClear: document.getElementById("trace-clear"),
    traceDemo: document.getElementById("trace-demo"),
    traceBoard: document.getElementById("trace-board-svg"),
    traceSymbol: document.getElementById("trace-symbol"),
    traceName: document.getElementById("trace-name"),
    traceSound: document.getElementById("trace-sound"),
    traceStatus: document.getElementById("trace-status"),
    traceCompleteBadge: document.getElementById("trace-complete-badge"),
    traceAudioStatus: document.getElementById("trace-audio-status"),
    traceMessage: document.getElementById("trace-message"),
    traceNoteCopy: document.getElementById("trace-note-copy"),
    traceBoardNote: document.getElementById("trace-board-note"),
    practiceNoteCopy: document.getElementById("practice-note-copy"),
    strokeDemoImage: document.getElementById("stroke-demo-image"),
    strokeDemoEmpty: document.getElementById("stroke-demo-empty"),
    strokeDemoCaption: document.getElementById("stroke-demo-caption"),
    strokeList: document.getElementById("stroke-list"),
    letterSelectLabel: document.getElementById("letter-select-label"),
    letterSelect: document.getElementById("letter-select"),
    masteryCount: document.getElementById("mastery-count")
  };

  runtime.matchState = {
    active: false,
    elapsedMs: 0,
    score: 0,
    streak: 0,
    correct: 0,
    attempts: 0,
    totalPairs: 0,
    currentTiles: [],
    selectedTileId: "",
    pendingTileIds: [],
    pendingResult: "",
    draggingTileId: "",
    draggingPointerId: null,
    clockStarted: false,
    startedAt: 0,
    intervalId: null,
    locked: false,
    leaderboard: []
  };

  runtime.choiceState = {
    active: false,
    elapsedMs: 0,
    score: 0,
    streak: 0,
    correct: 0,
    attempts: 0,
    totalQuestions: runtime.CHOICE_QUESTION_COUNT,
    questionIndex: 0,
    questions: [],
    currentQuestion: null,
    selectedOptionId: "",
    pendingResult: "",
    revealed: false,
    clockStarted: false,
    startedAt: 0,
    intervalId: null,
    locked: false,
    leaderboard: []
  };

  runtime.traceState = {
    currentLetterId: "",
    isDrawing: false,
    currentPointerId: null,
    currentStrokePoints: [],
    committedStrokePoints: {},
    coverage: 0,
    rowCoverage: 0,
    colCoverage: 0,
    spanCoverage: 0,
    targetReady: false,
    targetSamples: [],
    targetRows: [],
    targetCols: [],
    dominantAxis: "balanced",
    targetGlyph: { fontSize: 140, x: 100, y: 112 },
    completed: false,
    masteredIds: new Set(),
    demoTimers: [],
    demoIndex: -1
  };

  runtime.uiState = {
    stage: "scripts",
    activeScriptId: ""
  };

  runtime.getActiveScript = () =>
    runtime.uiState.activeScriptId ? runtime.SCRIPTS[runtime.uiState.activeScriptId] || null : null;

  runtime.getActiveLetters = () => {
    const script = runtime.getActiveScript();
    return script ? script.letters : [];
  };

  runtime.storageKey = (kind, scriptId = runtime.uiState.activeScriptId) =>
    `${runtime.STORAGE_PREFIX}:${scriptId}:${kind}`;

  runtime.loadStoredArray = (key) => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  runtime.saveStoredArray = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  };

  runtime.shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  };

  runtime.clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  runtime.formatElapsed = (elapsedMs) => {
    const totalTenths = Math.max(0, Math.round(elapsedMs / 100));
    const minutes = Math.floor(totalTenths / 600);
    const seconds = Math.floor((totalTenths % 600) / 10);
    const tenths = totalTenths % 10;
    return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths}`;
  };

  runtime.applyTheme = (theme) => {
    Object.entries(theme).forEach(([token, value]) => {
      document.documentElement.style.setProperty(`--${token}`, value);
    });
  };

  runtime.renderHeroBadges = (labels) => {
    runtime.elements.heroBadges.innerHTML = "";
    [...labels, `Build ${runtime.BUILD_ID}`].forEach((label) => {
      const badge = document.createElement("span");
      badge.textContent = label;
      if (label.startsWith("Build ")) {
        badge.classList.add("build-badge");
      }
      runtime.elements.heroBadges.append(badge);
    });
  };

  runtime.updateHero = (script) => {
    const { elements } = runtime;
    if (!script) {
      document.body.dataset.script = "none";
      runtime.applyTheme(runtime.HOME_VIEW.theme);
      elements.heroEyebrow.textContent = runtime.HOME_VIEW.eyebrow;
      elements.heroTitle.textContent = runtime.HOME_VIEW.title;
      elements.heroText.textContent = runtime.HOME_VIEW.text;
      elements.metricOneText.textContent = "Fastest-clear matching rounds with streak bonuses, accuracy tracking, and a saved local leaderboard.";
      elements.metricTwoText.textContent = "See one live character, choose from four sound cues, and keep the romanized name hidden until the answer resolves.";
      elements.metricThreeText.textContent = "Trace the live glyph, walk through ordered stroke cues, and hear script playback when the browser supports it.";
      runtime.renderHeroBadges(runtime.HOME_VIEW.badges);
      return;
    }

    document.body.dataset.script = script.id;
    runtime.applyTheme(script.theme);
    document.documentElement.style.setProperty("--glyph-font", script.glyphFont);
    elements.heroEyebrow.textContent = script.headline;
    elements.heroTitle.textContent = script.heroTitle;
    elements.heroText.textContent = script.heroText;
    elements.metricOneText.textContent = `Clear a mixed ${script.name} board as fast as possible with elapsed time, score, streak, and per-script rankings.`;
    elements.metricTwoText.textContent = `Pick the right sound for each ${script.name} ${script.unitSingular} from four options, with the name revealed only after each answer.`;
    elements.metricThreeText.textContent = `Trace the rendered ${script.unitSingular}, replay ordered stroke cues, and hear ${script.name} browser playback when available.`;
    runtime.renderHeroBadges([script.countLabel, "Switch scripts any time", `Browser ${script.name} audio`]);
  };

  runtime.renderScriptGrid = () => {
    const { elements, uiState, SCRIPT_LIST } = runtime;
    elements.scriptGrid.innerHTML = "";
    SCRIPT_LIST.forEach((script) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `script-card${uiState.activeScriptId === script.id ? " is-active" : ""}`;
      button.innerHTML = `<span class="script-badge">${script.countLabel}</span><strong>${script.name}</strong><span class="script-sample">${script.sampleText}</span><p>${script.matchDescription}</p>`;
      button.addEventListener("click", () => runtime.selectScript(script.id, "modes"));
      elements.scriptGrid.append(button);
    });
  };

  runtime.renderScriptSwitcher = () => {
    const { elements, uiState, SCRIPT_LIST } = runtime;
    elements.scriptSwitcher.innerHTML = "";
    SCRIPT_LIST.forEach((script) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `script-pill${uiState.activeScriptId === script.id ? " is-active" : ""}`;
      button.textContent = script.name;
      button.addEventListener("click", () => {
        const targetStage = uiState.stage === "scripts" ? "modes" : uiState.stage;
        runtime.selectScript(script.id, targetStage);
      });
      elements.scriptSwitcher.append(button);
    });
  };

  runtime.renderToolbar = () => {
    const script = runtime.getActiveScript();
    if (!script) {
      runtime.elements.toolbarTitle.textContent = "Choose a script";
      runtime.elements.toolbarText.textContent = "Pick a script to unlock the connected practice flow.";
      return;
    }
    runtime.elements.toolbarTitle.textContent = script.name;
    runtime.elements.toolbarText.textContent = `${script.countLabel} with speed match, quick choice, tracing, and saved local progress.`;
  };

  runtime.renderModePanel = () => {
    const script = runtime.getActiveScript();
    if (!script) {
      return;
    }

    const { elements } = runtime;
    elements.modePanelKicker.textContent = `${script.name} Practice`;
    elements.modePanelTitle.textContent = `Pick one way to practice ${script.name}`;
    elements.modePanelText.textContent = `Use the same three-mode flow for ${script.countLabel.toLowerCase()}: drag-and-match speed work, four-choice recognition, or slower shape work in the tracer.`;
    elements.modeMatchTitle.textContent = `${script.name} Speed Match`;
    elements.modeMatchText.textContent = script.matchDescription;
    elements.modeChoiceTitle.textContent = `${script.name} Quick Choice`;
    elements.modeChoiceText.textContent = `See one ${script.name} ${script.unitSingular} at a time and choose the matching sound from four random options.`;
    elements.modeTraceTitle.textContent = `${script.name} Guided Tracing`;
    elements.modeTraceText.textContent = script.traceDescription;
    elements.matchTitle.textContent = `${script.name} Speed Match`;
    elements.choiceTitle.textContent = `${script.name} Quick Choice`;
    elements.tracePanelTitle.textContent = `${script.name} Guided Tracing`;
    elements.tracePanelText.textContent = `Practice one ${script.unitSingular} at a time with ordered stroke cues and browser pronunciation playback.`;
    elements.letterSelectLabel.textContent = `Pick a ${script.unitSingular}`;
  };

  runtime.refreshShell = () => {
    runtime.updateHero(runtime.getActiveScript());
    runtime.renderScriptGrid();
    runtime.renderScriptSwitcher();
    runtime.renderToolbar();
    runtime.renderModePanel();
  };

  runtime.setStage = (stage) => {
    runtime.uiState.stage = stage;
    const { elements } = runtime;
    elements.scriptPanel.classList.toggle("is-hidden", stage !== "scripts");
    elements.scriptToolbar.classList.toggle("is-hidden", stage === "scripts" || !runtime.getActiveScript());
    elements.modePanel.classList.toggle("is-hidden", stage !== "modes");
    elements.matchPanel.classList.toggle("is-hidden", stage !== "match");
    elements.choicePanel.classList.toggle("is-hidden", stage !== "choice");
    elements.tracePanel.classList.toggle("is-hidden", stage !== "trace");
    if (stage === "match" && runtime.renderCurrentPrompt) {
      runtime.renderCurrentPrompt();
    }
    if (stage === "choice" && runtime.renderChoiceRound) {
      runtime.renderChoiceRound();
    }
    if (stage === "trace" && runtime.renderTracePanel) {
      runtime.renderTracePanel();
    }
  };

  runtime.clearDemoTimers = () => {
    runtime.traceState.demoTimers.forEach((timerId) => window.clearTimeout(timerId));
    runtime.traceState.demoTimers = [];
    runtime.traceState.demoIndex = -1;
  };

  runtime.stopAllLetterAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  runtime.showScriptSelection = () => {
    if (runtime.matchState.active && runtime.resetRound) {
      runtime.resetRound();
    }
    if (runtime.choiceState.active && runtime.resetChoiceRound) {
      runtime.resetChoiceRound();
    }
    runtime.clearDemoTimers();
    runtime.stopAllLetterAudio();
    runtime.setStage("scripts");
  };

  runtime.showModeSelection = () => {
    if (!runtime.getActiveScript()) {
      runtime.showScriptSelection();
      return;
    }
    if (runtime.matchState.active && runtime.resetRound) {
      runtime.resetRound();
    }
    if (runtime.choiceState.active && runtime.resetChoiceRound) {
      runtime.resetChoiceRound();
    }
    runtime.clearDemoTimers();
    runtime.stopAllLetterAudio();
    runtime.setStage("modes");
  };

  runtime.initializeScript = (scriptId) => {
    runtime.uiState.activeScriptId = scriptId;
    const script = runtime.getActiveScript();
    runtime.matchState.leaderboard = runtime.loadStoredArray(runtime.storageKey("match-leaderboard", scriptId));
    runtime.choiceState.leaderboard = runtime.loadStoredArray(runtime.storageKey("choice-leaderboard", scriptId));
    runtime.traceState.masteredIds = new Set(runtime.loadStoredArray(runtime.storageKey("mastery", scriptId)));
    runtime.traceState.currentLetterId = script.letters[0]?.id || "";
    if (runtime.resetTraceSession) {
      runtime.resetTraceSession();
    }
    if (runtime.primeFont) {
      runtime.primeFont(script);
    }
    if (runtime.hydrateLetterSelect) {
      runtime.hydrateLetterSelect();
    }
    if (runtime.renderLeaderboard) {
      runtime.renderLeaderboard();
    }
    if (runtime.renderChoiceLeaderboard) {
      runtime.renderChoiceLeaderboard();
    }
    runtime.refreshShell();
    if (runtime.resetRound) {
      runtime.resetRound();
    }
    if (runtime.resetChoiceRound) {
      runtime.resetChoiceRound();
    }
    if (runtime.resolveScriptVoice) {
      runtime.resolveScriptVoice();
    }
  };

  runtime.selectScript = (scriptId, targetStage = "modes") => {
    if (!runtime.SCRIPTS[scriptId]) {
      return;
    }
    runtime.stopAllLetterAudio();
    runtime.clearDemoTimers();
    runtime.initializeScript(scriptId);
    if (targetStage === "match") {
      runtime.setStage("match");
      return;
    }
    if (targetStage === "choice") {
      runtime.setStage("choice");
      return;
    }
    if (targetStage === "trace") {
      runtime.setStage("trace");
      if (runtime.selectTraceLetter) {
        runtime.selectTraceLetter(runtime.traceState.currentLetterId);
      }
      return;
    }
    runtime.setStage("modes");
  };
})();
