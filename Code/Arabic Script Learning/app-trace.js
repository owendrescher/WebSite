(function registerTrace() {
  const runtime = window.ScriptLearningRuntime;
  const { elements, traceState } = runtime;

  let activeVoice = null;
  let traceTargetCanvas = null;
  let traceTargetCtx = null;
  let traceInkCanvas = null;
  let traceInkCtx = null;
  let fontReadyPromise = Promise.resolve();

  runtime.setAudioStatus = (message, tone = "info") => {
    elements.traceAudioStatus.textContent = message;
    elements.traceAudioStatus.className = `audio-status ${tone}`;
  };

  runtime.resolveScriptVoice = () => {
    const script = runtime.getActiveScript();
    if (!script) {
      activeVoice = null;
      elements.tracePronounce.disabled = true;
      runtime.setAudioStatus("Choose a script to enable browser playback.", "info");
      return;
    }
    if (!("speechSynthesis" in window)) {
      activeVoice = null;
      elements.tracePronounce.disabled = true;
      runtime.setAudioStatus("Browser speech playback is not available in this browser.", "warning");
      return;
    }

    const primaryLang = script.speechLang.split("-")[0].toLowerCase();
    const voices = window.speechSynthesis.getVoices();
    activeVoice =
      voices.find((voice) => voice.lang.toLowerCase() === script.speechLang.toLowerCase()) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith(primaryLang)) ||
      voices.find((voice) => script.voiceHints.some((hint) => voice.name.toLowerCase().includes(hint) || voice.lang.toLowerCase().includes(hint))) ||
      null;

    elements.tracePronounce.disabled = false;
    if (activeVoice) {
      runtime.setAudioStatus(`${script.name} browser voice ready: ${activeVoice.name}.`, "success");
      return;
    }
    if (voices.length) {
      runtime.setAudioStatus(`Using browser speech in ${script.speechLang} mode.`, "info");
      return;
    }
    runtime.setAudioStatus(`Waiting for browser voices. Playback will still try ${script.name}.`, "info");
  };

  runtime.hydrateLetterSelect = () => {
    elements.letterSelect.innerHTML = "";
    runtime.getActiveLetters().forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.id;
      option.textContent = `${entry.symbol} - ${entry.name}`;
      elements.letterSelect.append(option);
    });
    if (traceState.currentLetterId) {
      elements.letterSelect.value = traceState.currentLetterId;
    }
  };

  runtime.primeFont = (script) => {
    if (document.fonts && document.fonts.load) {
      fontReadyPromise = document.fonts.load(script.fontLoad).catch(() => undefined);
      return;
    }
    fontReadyPromise = Promise.resolve();
  };

  runtime.getCurrentTraceLetter = () => {
    const script = runtime.getActiveScript();
    return script ? script.letterById[traceState.currentLetterId] || null : null;
  };

  runtime.getStrokeDemoUrl = (entry) => {
    const script = runtime.getActiveScript();
    const fileName = script?.strokeDemoFiles?.[entry.id];
    return fileName ? `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}` : "";
  };

  runtime.updateMasteryChip = () => {
    elements.masteryCount.textContent = `${traceState.masteredIds.size} / ${runtime.getActiveLetters().length}`;
  };

  runtime.setTraceMessage = (message, tone = "info") => {
    elements.traceMessage.textContent = message;
    elements.traceMessage.className = `feedback ${tone}`;
  };

  runtime.clearTraceInkBuffers = () => {
    if (traceInkCtx) {
      traceInkCtx.clearRect(0, 0, runtime.TRACE_SIZE, runtime.TRACE_SIZE);
    }
  };

  runtime.resetTraceSession = () => {
    runtime.clearDemoTimers();
    traceState.completed = false;
    traceState.isDrawing = false;
    traceState.currentPointerId = null;
    traceState.currentStrokePoints = [];
    traceState.committedStrokePoints = {};
    traceState.coverage = 0;
    traceState.rowCoverage = 0;
    traceState.colCoverage = 0;
    traceState.spanCoverage = 0;
    traceState.targetReady = false;
    traceState.targetSamples = [];
    traceState.targetRows = [];
    traceState.targetCols = [];
    traceState.dominantAxis = "balanced";
    traceState.targetGlyph = { fontSize: 140, x: 100, y: 112 };
    runtime.clearTraceInkBuffers();
  };

  runtime.renderStrokeList = () => {
    const entry = runtime.getCurrentTraceLetter();
    elements.strokeList.innerHTML = "";
    if (!entry) {
      return;
    }
    entry.strokeSteps.forEach((step, index) => {
      const item = document.createElement("li");
      item.textContent = step;
      if (traceState.demoIndex === index) {
        item.classList.add("active");
      } else if (traceState.demoIndex > index) {
        item.classList.add("complete");
      }
      elements.strokeList.append(item);
    });
  };

  runtime.setupTraceBoard = () => {
    elements.traceBoard.style.touchAction = "none";
    traceTargetCanvas = document.createElement("canvas");
    traceTargetCanvas.width = runtime.TRACE_SIZE;
    traceTargetCanvas.height = runtime.TRACE_SIZE;
    traceTargetCtx = traceTargetCanvas.getContext("2d", { willReadFrequently: true });
    traceInkCanvas = document.createElement("canvas");
    traceInkCanvas.width = runtime.TRACE_SIZE;
    traceInkCanvas.height = runtime.TRACE_SIZE;
    traceInkCtx = traceInkCanvas.getContext("2d", { willReadFrequently: true });
  };

  runtime.prepareTraceTarget = () => {
    const script = runtime.getActiveScript();
    const entry = runtime.getCurrentTraceLetter();
    const targetLetterId = entry?.id;
    if (!script || !entry || !traceTargetCtx) {
      return Promise.resolve();
    }

    traceState.targetReady = false;
    traceState.targetSamples = [];
    traceState.coverage = 0;
    traceState.rowCoverage = 0;
    traceState.colCoverage = 0;
    traceState.spanCoverage = 0;
    traceTargetCtx.clearRect(0, 0, runtime.TRACE_SIZE, runtime.TRACE_SIZE);

    return fontReadyPromise.catch(() => undefined).then(() => {
      if (traceState.currentLetterId !== targetLetterId) {
        return;
      }

      let fontSize = 168;
      let metrics = null;
      let width = 0;
      let height = 0;
      traceTargetCtx.textAlign = "center";
      traceTargetCtx.textBaseline = "alphabetic";
      traceTargetCtx.direction = script.textDirection;

      while (fontSize >= 78) {
        traceTargetCtx.font = `${fontSize}px ${script.glyphFont}`;
        metrics = traceTargetCtx.measureText(entry.symbol);
        width = (metrics.actualBoundingBoxLeft || 0) + (metrics.actualBoundingBoxRight || 0) || metrics.width;
        height = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0) || fontSize * 0.9;
        if (width <= 130 && height <= 122) {
          break;
        }
        fontSize -= 6;
      }

      const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.6;
      const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2;
      const x = 100;
      const y = 108 + (ascent - descent) / 2;
      traceState.targetGlyph = { fontSize, x, y };

      traceTargetCtx.clearRect(0, 0, runtime.TRACE_SIZE, runtime.TRACE_SIZE);
      traceTargetCtx.fillStyle = "#143f3d";
      traceTargetCtx.font = `${fontSize}px ${script.glyphFont}`;
      traceTargetCtx.fillText(entry.symbol, x, y);

      const imageData = traceTargetCtx.getImageData(0, 0, runtime.TRACE_SIZE, runtime.TRACE_SIZE).data;
      const samples = [];
      const rowSet = new Set();
      const colSet = new Set();
      let minX = runtime.TRACE_SIZE;
      let minY = runtime.TRACE_SIZE;
      let maxX = 0;
      let maxY = 0;

      for (let yIndex = 0; yIndex < runtime.TRACE_SIZE; yIndex += 2) {
        for (let xIndex = 0; xIndex < runtime.TRACE_SIZE; xIndex += 2) {
          const alpha = imageData[(yIndex * runtime.TRACE_SIZE + xIndex) * 4 + 3];
          if (alpha > 24) {
            samples.push({ x: xIndex, y: yIndex });
            rowSet.add(yIndex);
            colSet.add(xIndex);
            minX = Math.min(minX, xIndex);
            minY = Math.min(minY, yIndex);
            maxX = Math.max(maxX, xIndex);
            maxY = Math.max(maxY, yIndex);
          }
        }
      }

      traceState.targetSamples = runtime.shuffle(samples).slice(0, Math.min(900, samples.length));
      traceState.targetRows = [...rowSet];
      traceState.targetCols = [...colSet];
      traceState.dominantAxis = maxY - minY > (maxX - minX) * 1.25 ? "vertical" : maxX - minX > (maxY - minY) * 1.25 ? "horizontal" : "balanced";
      traceState.targetReady = true;
      runtime.renderTracePanel();
    });
  };

  runtime.renderTraceGuide = () => {
    const script = runtime.getActiveScript();
    const entry = runtime.getCurrentTraceLetter();
    elements.traceBoard.innerHTML = "";
    if (!script || !entry) {
      return;
    }

    const guideFrame = document.createElementNS(runtime.SVG_NS, "rect");
    guideFrame.setAttribute("x", "18");
    guideFrame.setAttribute("y", "18");
    guideFrame.setAttribute("width", "164");
    guideFrame.setAttribute("height", "164");
    guideFrame.setAttribute("rx", "24");
    guideFrame.setAttribute("fill", "none");
    guideFrame.setAttribute("stroke", "#1c6663");
    guideFrame.setAttribute("stroke-opacity", "0.08");
    guideFrame.setAttribute("stroke-width", "1.5");
    guideFrame.setAttribute("stroke-dasharray", "5 7");
    elements.traceBoard.append(guideFrame);

    const guideLayer = document.createElementNS(runtime.SVG_NS, "g");
    const inkLayer = document.createElementNS(runtime.SVG_NS, "g");
    const glyph = document.createElementNS(runtime.SVG_NS, "text");
    glyph.setAttribute("x", traceState.targetGlyph.x);
    glyph.setAttribute("y", traceState.targetGlyph.y);
    glyph.setAttribute("text-anchor", "middle");
    glyph.setAttribute("direction", script.textDirection);
    glyph.setAttribute("font-family", script.glyphFont);
    glyph.setAttribute("font-size", String(traceState.targetGlyph.fontSize));
    glyph.setAttribute("fill", traceState.completed ? "rgba(45, 141, 105, 0.24)" : "rgba(214, 109, 68, 0.3)");
    glyph.textContent = entry.symbol;
    guideLayer.append(glyph);

    const appendInkPath = (points) => {
      if (!points || points.filter(Boolean).length < 2) {
        return;
      }
      const path = document.createElementNS(runtime.SVG_NS, "path");
      const segments = [];
      let shouldMove = true;
      points.forEach((point) => {
        if (!point) {
          shouldMove = true;
          return;
        }
        segments.push(`${shouldMove ? "M" : "L"} ${point.x} ${point.y}`);
        shouldMove = false;
      });
      path.setAttribute("d", segments.join(" "));
      path.setAttribute("class", "trace-ink");
      inkLayer.append(path);
    };

    Object.values(traceState.committedStrokePoints).forEach((points) => appendInkPath(points));
    if (traceState.currentStrokePoints.length) {
      appendInkPath(traceState.currentStrokePoints);
    }
    elements.traceBoard.append(guideLayer, inkLayer);
  };

  runtime.renderTracePanel = () => {
    const script = runtime.getActiveScript();
    const entry = runtime.getCurrentTraceLetter();
    if (!script || !entry) {
      return;
    }

    const strokeDemoUrl = runtime.getStrokeDemoUrl(entry);
    elements.traceSymbol.textContent = entry.symbol;
    elements.traceSymbol.style.fontFamily = script.glyphFont;
    elements.traceSymbol.dir = script.textDirection;
    elements.traceName.textContent = entry.nativeName ? `${entry.name} • ${entry.nativeName}` : entry.name;
    elements.traceSound.textContent = `${entry.speechText} - ${entry.soundLabel} - ${entry.soundHint}`;
    elements.traceNoteCopy.textContent = entry.note;
    elements.traceBoardNote.textContent = script.traceBoardNote;
    elements.practiceNoteCopy.textContent = script.practiceNote;
    elements.strokeDemoCaption.textContent = script.strokeCaption;

    if (strokeDemoUrl) {
      elements.strokeDemoImage.hidden = false;
      elements.strokeDemoImage.src = strokeDemoUrl;
      elements.strokeDemoImage.alt = `${entry.name} stroke reference`;
      elements.strokeDemoEmpty.classList.add("is-hidden");
      elements.strokeDemoEmpty.textContent = "";
    } else {
      elements.strokeDemoImage.hidden = true;
      elements.strokeDemoImage.src = "";
      elements.strokeDemoImage.alt = "";
      elements.strokeDemoEmpty.classList.remove("is-hidden");
      elements.strokeDemoEmpty.textContent = script.strokeEmpty;
    }

    if (traceState.completed) {
      elements.traceStatus.textContent = "Character complete";
      elements.traceCompleteBadge.classList.remove("is-hidden");
    } else if (!traceState.targetReady) {
      elements.traceStatus.textContent = "Preparing trace guide";
      elements.traceCompleteBadge.classList.add("is-hidden");
    } else {
      elements.traceStatus.textContent = `Coverage ${Math.round(traceState.coverage * 100)}% • Span ${Math.round(traceState.spanCoverage * 100)}%`;
      elements.traceCompleteBadge.classList.add("is-hidden");
    }

    runtime.renderStrokeList();
    runtime.renderTraceGuide();
    runtime.updateMasteryChip();
  };

  runtime.resetTracingForCurrentLetter = () => {
    const script = runtime.getActiveScript();
    const letterId = traceState.currentLetterId;
    if (!script || !letterId) {
      return;
    }

    runtime.resetTraceSession();
    runtime.renderTracePanel();
    runtime.setTraceMessage(`Loading the ${script.name} glyph for tracing.`, "info");
    runtime.prepareTraceTarget().then(() => {
      if (traceState.currentLetterId !== letterId) {
        return;
      }
      runtime.setTraceMessage(traceState.masteredIds.has(letterId) ? "Already mastered locally. Trace it again to reinforce the shape." : "Trace the highlighted glyph and use the ordered steps as your stroke guide.", "info");
    });
  };

  runtime.selectTraceLetter = (letterId) => {
    if (!letterId) {
      return;
    }
    traceState.currentLetterId = letterId;
    elements.letterSelect.value = letterId;
    runtime.resetTracingForCurrentLetter();
  };

  runtime.getPointFromPointerEvent = (event) => {
    const rect = elements.traceBoard.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * runtime.TRACE_SIZE,
      y: ((event.clientY - rect.top) / rect.height) * runtime.TRACE_SIZE
    };
  };

  runtime.drawToInkCanvas = (from, to) => {
    if (!from || !to || !traceInkCtx) {
      return;
    }
    traceInkCtx.strokeStyle = "#104e6f";
    traceInkCtx.lineWidth = 14;
    traceInkCtx.lineCap = "round";
    traceInkCtx.lineJoin = "round";
    traceInkCtx.beginPath();
    traceInkCtx.moveTo(from.x, from.y);
    traceInkCtx.lineTo(to.x, to.y);
    traceInkCtx.stroke();
  };

  runtime.updateTraceCoverage = () => {
    if (!traceState.targetSamples.length || !traceInkCtx) {
      traceState.coverage = 0;
      traceState.rowCoverage = 0;
      traceState.colCoverage = 0;
      traceState.spanCoverage = 0;
      return;
    }
    const inkData = traceInkCtx.getImageData(0, 0, runtime.TRACE_SIZE, runtime.TRACE_SIZE).data;
    let covered = 0;
    const coveredRows = new Set();
    const coveredCols = new Set();
    traceState.targetSamples.forEach((sample) => {
      const index = (Math.round(sample.y) * runtime.TRACE_SIZE + Math.round(sample.x)) * 4 + 3;
      if (inkData[index] > 10) {
        covered += 1;
        coveredRows.add(sample.y);
        coveredCols.add(sample.x);
      }
    });
    traceState.coverage = covered / traceState.targetSamples.length;
    traceState.rowCoverage = traceState.targetRows.length ? coveredRows.size / traceState.targetRows.length : 0;
    traceState.colCoverage = traceState.targetCols.length ? coveredCols.size / traceState.targetCols.length : 0;
    traceState.spanCoverage = traceState.dominantAxis === "vertical" ? traceState.rowCoverage : traceState.dominantAxis === "horizontal" ? traceState.colCoverage : (traceState.rowCoverage + traceState.colCoverage) / 2;
  };

  runtime.finalizeTraceCompletion = () => {
    traceState.completed = true;
    traceState.masteredIds.add(traceState.currentLetterId);
    runtime.saveStoredArray(runtime.storageKey("mastery"), [...traceState.masteredIds]);
    runtime.renderTracePanel();
    runtime.setTraceMessage(`Character complete. Playing the ${runtime.getActiveScript().name} sound.`, "success");
    runtime.playLetterSound(runtime.getCurrentTraceLetter(), "trace");
  };

  runtime.onTracePointerDown = (event) => {
    if (traceState.completed) {
      runtime.setTraceMessage("This character is complete. Clear the board or pick another one to practice again.", "info");
      return;
    }
    if (!traceState.targetReady) {
      runtime.setTraceMessage("The trace guide is still loading.", "warning");
      return;
    }
    const point = runtime.getPointFromPointerEvent(event);
    traceState.isDrawing = true;
    traceState.currentPointerId = event.pointerId;
    if (traceState.currentStrokePoints.length) {
      traceState.currentStrokePoints.push(null);
    }
    traceState.currentStrokePoints.push(point);
    elements.traceBoard.setPointerCapture(event.pointerId);
    runtime.renderTraceGuide();
  };

  runtime.onTracePointerMove = (event) => {
    if (!traceState.isDrawing || event.pointerId !== traceState.currentPointerId || traceState.completed) {
      return;
    }
    const point = runtime.getPointFromPointerEvent(event);
    const previousPoint = [...traceState.currentStrokePoints].reverse().find(Boolean);
    traceState.currentStrokePoints.push(point);
    runtime.drawToInkCanvas(previousPoint, point);
    runtime.updateTraceCoverage();
    runtime.renderTraceGuide();
  };

  runtime.onTracePointerEnd = (event) => {
    if (!traceState.isDrawing || event.pointerId !== traceState.currentPointerId) {
      return;
    }
    if (elements.traceBoard.hasPointerCapture(event.pointerId)) {
      elements.traceBoard.releasePointerCapture(event.pointerId);
    }
    traceState.isDrawing = false;
    traceState.currentPointerId = null;
    if (traceState.currentStrokePoints.length) {
      traceState.committedStrokePoints[Object.keys(traceState.committedStrokePoints).length] = [...traceState.currentStrokePoints];
      traceState.currentStrokePoints = [];
    }
    runtime.renderTraceGuide();
    if (!traceState.completed && traceState.coverage >= runtime.TRACE_POINTER_END_THRESHOLD && traceState.spanCoverage >= runtime.TRACE_POINTER_END_SPAN_THRESHOLD) {
      runtime.finalizeTraceCompletion();
      return;
    }
    runtime.setTraceMessage(`Keep tracing. Coverage is ${Math.round(traceState.coverage * 100)}% and span is ${Math.round(traceState.spanCoverage * 100)}% of the target glyph.`, "info");
  };

  runtime.replayStrokeOrder = () => {
    const entry = runtime.getCurrentTraceLetter();
    const strokeDemoUrl = entry ? runtime.getStrokeDemoUrl(entry) : "";
    if (!entry || (!entry.strokeSteps.length && !strokeDemoUrl)) {
      runtime.setTraceMessage("No stroke-order cues are available for this character yet.", "warning");
      return;
    }
    runtime.clearDemoTimers();
    if (strokeDemoUrl) {
      elements.strokeDemoImage.hidden = true;
      elements.strokeDemoImage.src = "";
      window.setTimeout(() => {
        elements.strokeDemoImage.src = strokeDemoUrl;
      }, 20);
    }
    entry.strokeSteps.forEach((_, index) => {
      traceState.demoTimers.push(window.setTimeout(() => {
        traceState.demoIndex = index;
        runtime.renderStrokeList();
      }, index * 620));
    });
    traceState.demoTimers.push(window.setTimeout(() => {
      traceState.demoIndex = -1;
      runtime.renderStrokeList();
    }, entry.strokeSteps.length * 620 + 260));
    runtime.setTraceMessage("Walking through the stroke-order cues.", "info");
  };

  runtime.playLetterSound = (entry, context = "trace") => {
    const script = runtime.getActiveScript();
    if (!script || !entry) {
      return;
    }
    if (!("speechSynthesis" in window)) {
      if (context === "trace") {
        runtime.setTraceMessage(`${script.name} speech playback is not available in this browser.`, "warning");
      }
      runtime.setAudioStatus("Browser speech playback is not available in this browser.", "warning");
      return;
    }
    if (!activeVoice) {
      runtime.resolveScriptVoice();
    }
    runtime.stopAllLetterAudio();
    const utterance = new SpeechSynthesisUtterance((entry.speechText || entry.symbol).normalize("NFC"));
    utterance.lang = script.speechLang;
    utterance.rate = script.speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (activeVoice) {
      utterance.voice = activeVoice;
    }
    utterance.onstart = () => {
      runtime.setAudioStatus(`Playing browser ${script.name} speech${activeVoice ? `: ${activeVoice.name}` : ""}.`, "success");
    };
    utterance.onerror = () => {
      runtime.setAudioStatus(`${script.name} speech playback failed in this browser.`, "warning");
      if (context === "trace") {
        runtime.setTraceMessage(`${script.name} speech playback failed for this character.`, "warning");
      }
    };
    window.speechSynthesis.resume();
    window.setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 20);
  };

  runtime.onRandomLetterClick = () => {
    const letters = runtime.getActiveLetters();
    const remaining = letters.filter((entry) => entry.id !== traceState.currentLetterId);
    const nextEntry = runtime.shuffle(remaining)[0] || letters[0];
    if (nextEntry) {
      runtime.selectTraceLetter(nextEntry.id);
    }
  };

  runtime.initialize = () => {
    runtime.updateHero(null);
    runtime.renderScriptGrid();
    runtime.renderLeaderboard();
    runtime.renderChoiceLeaderboard();
    runtime.updateGameStats();
    runtime.updateChoiceStats();
    runtime.setupTraceBoard();
    runtime.resolveScriptVoice();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => runtime.resolveScriptVoice();
    }

    elements.strokeDemoImage.addEventListener("error", () => {
      elements.strokeDemoImage.hidden = true;
    });
    elements.strokeDemoImage.addEventListener("load", () => {
      elements.strokeDemoImage.hidden = false;
    });

    elements.browseScripts.addEventListener("click", runtime.showScriptSelection);
    elements.modeMatch.addEventListener("click", () => runtime.setStage("match"));
    elements.modeChoice.addEventListener("click", () => runtime.setStage("choice"));
    elements.modeTrace.addEventListener("click", () => {
      runtime.setStage("trace");
      runtime.selectTraceLetter(traceState.currentLetterId || runtime.getActiveLetters()[0]?.id);
    });
    elements.matchHome.addEventListener("click", runtime.showModeSelection);
    elements.choiceHome.addEventListener("click", runtime.showModeSelection);
    elements.traceHome.addEventListener("click", runtime.showModeSelection);
    elements.matchStart.addEventListener("click", runtime.startRound);
    elements.matchReset.addEventListener("click", runtime.resetRound);
    elements.choiceStart.addEventListener("click", runtime.startChoiceRound);
    elements.choiceReset.addEventListener("click", runtime.resetChoiceRound);
    elements.answerGrid.addEventListener("click", () => {
      if (!runtime.matchState.active) {
        runtime.startRound();
      }
    });
    elements.choiceOptions.addEventListener("click", () => {
      if (!runtime.choiceState.active) {
        runtime.startChoiceRound();
      }
    });
    elements.letterSelect.addEventListener("change", (event) => runtime.selectTraceLetter(event.target.value));
    elements.traceRandom.addEventListener("click", runtime.onRandomLetterClick);
    elements.tracePronounce.addEventListener("click", () => runtime.playLetterSound(runtime.getCurrentTraceLetter(), "trace"));
    elements.traceClear.addEventListener("click", runtime.resetTracingForCurrentLetter);
    elements.traceDemo.addEventListener("click", runtime.replayStrokeOrder);
    elements.traceBoard.addEventListener("pointerdown", runtime.onTracePointerDown);
    elements.traceBoard.addEventListener("pointermove", runtime.onTracePointerMove);
    elements.traceBoard.addEventListener("pointerup", runtime.onTracePointerEnd);
    elements.traceBoard.addEventListener("pointercancel", runtime.onTracePointerEnd);
    elements.traceBoard.addEventListener("pointerleave", runtime.onTracePointerEnd);
    window.addEventListener("pointermove", runtime.onMatchTilePointerMove);
    window.addEventListener("pointerup", runtime.onMatchTilePointerEnd);
    window.addEventListener("pointercancel", runtime.onMatchTilePointerEnd);
    runtime.showScriptSelection();
  };

  runtime.initialize();
})();
