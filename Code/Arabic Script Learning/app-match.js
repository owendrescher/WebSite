(function () {
  const runtime = window.ScriptLearningRuntime;
  const { elements, matchState } = runtime;

  runtime.formatAccuracy = (correct, attempts) => (attempts ? `${Math.round((correct / attempts) * 100)}%` : "--");

  runtime.getMatchedPairCount = () => {
    if (!matchState.totalPairs) {
      return 0;
    }
    return Math.round((matchState.totalPairs * 2 - runtime.getVisibleTiles().length) / 2);
  };

  runtime.updateGameStats = () => {
    elements.timeLeft.textContent = runtime.formatElapsed(matchState.elapsedMs);
    elements.scoreValue.textContent = String(matchState.score);
    elements.streakValue.textContent = String(matchState.streak);
    elements.accuracyValue.textContent = runtime.formatAccuracy(matchState.correct, matchState.attempts);
    const completion = matchState.totalPairs ? (runtime.getMatchedPairCount() / matchState.totalPairs) * 100 : 0;
    elements.timeMeterFill.style.width = `${completion}%`;
  };

  runtime.renderLeaderboard = () => {
    elements.leaderboardList.innerHTML = "";
    if (!matchState.leaderboard.length) {
      const placeholder = document.createElement("li");
      placeholder.textContent = "Clear one board to save your first speed run on this device.";
      elements.leaderboardList.append(placeholder);
      return;
    }

    matchState.leaderboard.forEach((entry, index) => {
      const item = document.createElement("li");
      item.textContent = `#${index + 1} ${runtime.formatElapsed(entry.elapsedMs || 0)} - ${entry.accuracy} - ${entry.correct}/${entry.attempts} correct - ${entry.date}`;
      elements.leaderboardList.append(item);
    });
  };

  runtime.setMatchFeedback = (message, tone = "info") => {
    elements.matchFeedback.textContent = message;
    elements.matchFeedback.className = `feedback ${tone}`;
  };

  runtime.hideSummary = () => {
    elements.matchSummary.classList.add("is-hidden");
  };

  runtime.showSummary = (message) => {
    elements.summaryCopy.textContent = message;
    elements.matchSummary.classList.remove("is-hidden");
  };

  runtime.layoutMatchTiles = (tiles) => {
    const slotPositions = runtime.shuffle([
      { x: 14, y: 18 }, { x: 34, y: 14 }, { x: 55, y: 20 }, { x: 76, y: 16 },
      { x: 18, y: 39 }, { x: 38, y: 34 }, { x: 60, y: 40 }, { x: 80, y: 35 },
      { x: 15, y: 63 }, { x: 36, y: 58 }, { x: 58, y: 62 }, { x: 79, y: 58 }
    ]);

    return tiles.map((tile, index) => {
      const slot = slotPositions[index] || { x: 12 + index * 6, y: 20 + index * 4 };
      return { ...tile, x: slot.x, y: slot.y };
    });
  };

  runtime.buildMatchTiles = () => {
    const script = runtime.getActiveScript();
    const letters = runtime.getActiveLetters();
    if (!script || !letters.length) {
      return [];
    }

    const selectedLetters = runtime.shuffle(letters).slice(0, Math.min(runtime.MATCH_PAIR_COUNT, letters.length));
    matchState.totalPairs = selectedLetters.length;

    return runtime.layoutMatchTiles(
      selectedLetters
        .flatMap((entry) => [
          {
            tileId: `${entry.id}-symbol`,
            pairId: entry.id,
            kind: "symbol",
            primary: entry.symbol,
            secondary: "",
            soundLabel: entry.soundLabel,
            soundHint: entry.soundHint,
            revealName: entry.name,
            ariaLabel: `${script.name} ${script.unitSingular}`,
            matched: false
          },
          {
            tileId: `${entry.id}-cue`,
            pairId: entry.id,
            kind: "cue",
            primary: entry.soundLabel,
            secondary: entry.soundHint,
            revealName: entry.name,
            symbol: entry.symbol,
            ariaLabel: `Sound cue ${entry.soundLabel}`,
            matched: false
          }
        ])
        .sort(() => Math.random() - 0.5)
    );
  };

  runtime.getTileById = (tileId) => matchState.currentTiles.find((tile) => tile.tileId === tileId) || null;
  runtime.getVisibleTiles = () => matchState.currentTiles.filter((tile) => !tile.matched);

  runtime.applyPromptValue = (value, isGlyph) => {
    const script = runtime.getActiveScript();
    elements.matchLetter.textContent = value;
    elements.matchLetter.classList.toggle("is-glyph", isGlyph);
    elements.matchLetter.style.fontFamily = isGlyph && script ? script.glyphFont : "";
    elements.matchLetter.dir = isGlyph && script ? script.textDirection : "ltr";
  };

  runtime.renderCurrentPrompt = () => {
    const script = runtime.getActiveScript();
    const selectedTile = runtime.getTileById(matchState.selectedTileId);
    elements.answerGrid.innerHTML = "";
    if (!script) {
      runtime.applyPromptValue("Choose a script", false);
      return;
    }

    if (!matchState.active) {
      elements.matchPromptLabel.textContent = "Warm-up";
      runtime.applyPromptValue("Pick a tile", false);
      elements.matchLetterName.textContent = "Then match it to the right sound";
      elements.matchCopy.textContent = `Start a round to clear one ${script.name} board as fast as you can. Romanized letter names stay hidden until each result resolves.`;
    } else if (matchState.pendingResult && matchState.resultRevealName) {
      elements.matchPromptLabel.textContent = matchState.pendingResult === "correct" ? "Correct" : "Not Quite";
      runtime.applyPromptValue(matchState.resultRevealSymbol, true);
      elements.matchLetterName.textContent = matchState.resultRevealName;
      elements.matchCopy.textContent = matchState.resultRevealCopy;
    } else if (selectedTile) {
      elements.matchPromptLabel.textContent = selectedTile.kind === "symbol" ? `${script.name} Tile Selected` : "Sound Tile Selected";
      runtime.applyPromptValue(selectedTile.primary, selectedTile.kind === "symbol");
      elements.matchLetterName.textContent = selectedTile.kind === "symbol" ? "Choose the matching sound cue." : `Choose the matching ${script.name} ${script.unitSingular}.`;
      elements.matchCopy.textContent = "Romanized letter names stay hidden until the answer resolves.";
    } else {
      const remainingPairs = Math.ceil(runtime.getVisibleTiles().length / 2) || matchState.totalPairs || runtime.MATCH_PAIR_COUNT;
      elements.matchPromptLabel.textContent = "Board Live";
      runtime.applyPromptValue(`${remainingPairs} pairs left`, false);
      elements.matchLetterName.textContent = `Match one ${script.name} symbol with one sound cue.`;
      elements.matchCopy.textContent = "Clear the full board for your final speed time.";
    }

    if (!matchState.active) {
      const placeholder = document.createElement("div");
      placeholder.className = "match-board-placeholder";
      placeholder.innerHTML = "<strong>Board ready</strong><span>Press Start Speed Round, then drag one tile onto its partner.</span>";
      elements.answerGrid.append(placeholder);
      return;
    }

    runtime.getVisibleTiles().forEach((tile) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `answer-card ${tile.kind === "symbol" ? "is-symbol" : "is-cue"}`;
      button.dataset.tileId = tile.tileId;
      button.style.left = `${tile.x}%`;
      button.style.top = `${tile.y}%`;
      button.disabled = matchState.locked;
      button.setAttribute("aria-label", tile.ariaLabel);
      if (matchState.selectedTileId === tile.tileId) {
        button.classList.add("is-selected");
      }
      if (matchState.draggingTileId === tile.tileId) {
        button.classList.add("is-dragging");
      }
      if (matchState.pendingTileIds.includes(tile.tileId)) {
        button.classList.add(matchState.pendingResult === "correct" ? "is-correct" : "is-wrong");
      }
      button.innerHTML = tile.kind === "symbol"
        ? `<strong class="answer-symbol">${tile.primary}</strong>`
        : `<strong>${tile.primary}</strong><span class="answer-detail">${tile.secondary}</span>`;
      button.addEventListener("pointerdown", runtime.onMatchTilePointerDown);
      elements.answerGrid.append(button);
    });
  };

  runtime.queueNextPrompt = () => {
    matchState.currentTiles = runtime.buildMatchTiles();
    matchState.selectedTileId = "";
    matchState.pendingTileIds = [];
    matchState.pendingResult = "";
    matchState.draggingTileId = "";
    matchState.draggingPointerId = null;
    matchState.resultRevealName = "";
    matchState.resultRevealCopy = "";
    matchState.resultRevealSymbol = "";
    runtime.renderCurrentPrompt();
  };

  runtime.stopMatchClock = () => {
    if (matchState.clockStarted) {
      matchState.elapsedMs = Date.now() - matchState.startedAt;
    }
    window.clearInterval(matchState.intervalId);
    matchState.intervalId = null;
    matchState.clockStarted = false;
  };

  runtime.finishRound = () => {
    matchState.active = false;
    matchState.locked = false;
    runtime.stopMatchClock();
    runtime.updateGameStats();
    runtime.renderCurrentPrompt();

    const accuracy = runtime.formatAccuracy(matchState.correct, matchState.attempts);
    if (matchState.attempts) {
      const entry = {
        elapsedMs: matchState.elapsedMs,
        score: matchState.score,
        correct: matchState.correct,
        attempts: matchState.attempts,
        accuracy,
        date: new Date().toLocaleDateString()
      };
      matchState.leaderboard = [...matchState.leaderboard, entry]
        .sort((left, right) => (left.elapsedMs || Number.MAX_SAFE_INTEGER) - (right.elapsedMs || Number.MAX_SAFE_INTEGER) || right.score - left.score || right.correct - left.correct)
        .slice(0, 5);
      runtime.saveStoredArray(runtime.storageKey("match-leaderboard"), matchState.leaderboard);
      runtime.renderLeaderboard();
    }

    runtime.showSummary(`Board cleared in ${runtime.formatElapsed(matchState.elapsedMs)} with ${accuracy} accuracy.`);
    runtime.setMatchFeedback("Round complete. Start again when you want to chase a faster clear.", "success");
    elements.matchPromptLabel.textContent = "Round Complete";
    elements.matchLetterName.textContent = "Your final time is locked in.";
    elements.matchCopy.textContent = "Local speed rankings are saved only in this browser for the active script.";
  };

  runtime.beginMatchClockIfNeeded = () => {
    if (!matchState.active || matchState.clockStarted) {
      return;
    }
    matchState.clockStarted = true;
    matchState.startedAt = Date.now() - matchState.elapsedMs;
    window.clearInterval(matchState.intervalId);
    matchState.intervalId = window.setInterval(() => {
      matchState.elapsedMs = Date.now() - matchState.startedAt;
      runtime.updateGameStats();
    }, 100);
    runtime.setMatchFeedback("Stopwatch live. Drag a symbol tile onto its matching sound tile.", "info");
  };

  runtime.startRound = () => {
    runtime.stopMatchClock();
    matchState.active = true;
    matchState.elapsedMs = 0;
    matchState.score = 0;
    matchState.streak = 0;
    matchState.correct = 0;
    matchState.attempts = 0;
    matchState.locked = false;
    matchState.clockStarted = false;
    matchState.startedAt = 0;
    runtime.hideSummary();
    runtime.queueNextPrompt();
    runtime.updateGameStats();
    runtime.setMatchFeedback("Board ready. The stopwatch starts when you drag your first tile.", "info");
  };

  runtime.resetRound = () => {
    const script = runtime.getActiveScript();
    runtime.stopMatchClock();
    matchState.active = false;
    matchState.elapsedMs = 0;
    matchState.score = 0;
    matchState.streak = 0;
    matchState.correct = 0;
    matchState.attempts = 0;
    matchState.totalPairs = 0;
    matchState.locked = false;
    matchState.currentTiles = [];
    matchState.selectedTileId = "";
    matchState.pendingTileIds = [];
    matchState.pendingResult = "";
    matchState.draggingTileId = "";
    matchState.draggingPointerId = null;
    matchState.clockStarted = false;
    matchState.startedAt = 0;
    matchState.resultRevealName = "";
    matchState.resultRevealCopy = "";
    matchState.resultRevealSymbol = "";
    runtime.hideSummary();
    runtime.updateGameStats();
    runtime.renderCurrentPrompt();
    if (script) {
      runtime.setMatchFeedback(`Drag one ${script.name} symbol tile onto one sound tile. The stopwatch starts on your first drag.`, "info");
    }
  };

  runtime.attemptMatchPair = (firstTileId, secondTileId) => {
    const firstTile = runtime.getTileById(firstTileId);
    const secondTile = runtime.getTileById(secondTileId);
    if (!firstTile || !secondTile || firstTile.tileId === secondTile.tileId) {
      matchState.locked = false;
      matchState.pendingTileIds = [];
      matchState.pendingResult = "";
      runtime.renderCurrentPrompt();
      return;
    }
    if (firstTile.kind === secondTile.kind) {
      matchState.locked = false;
      runtime.renderCurrentPrompt();
      return;
    }

    const symbolTile = firstTile.kind === "symbol" ? firstTile : secondTile;
    const cueTile = firstTile.kind === "cue" ? firstTile : secondTile;

    matchState.attempts += 1;
    matchState.pendingTileIds = [firstTile.tileId, secondTile.tileId];
    matchState.resultRevealName = symbolTile.revealName;
    matchState.resultRevealSymbol = symbolTile.primary;

    if (firstTile.pairId === secondTile.pairId) {
      const streakBonus = matchState.streak > 0 && (matchState.streak + 1) % 3 === 0 ? 5 : 0;
      matchState.pendingResult = "correct";
      matchState.correct += 1;
      matchState.streak += 1;
      matchState.score += 12 + streakBonus;
      matchState.resultRevealCopy = `${symbolTile.revealName} matches ${cueTile.primary}.`;
      runtime.setMatchFeedback(
        streakBonus
          ? `Correct. ${symbolTile.primary} is ${symbolTile.revealName} and matches ${cueTile.primary}. Bonus +${streakBonus}.`
          : `Correct. ${symbolTile.primary} is ${symbolTile.revealName} and matches ${cueTile.primary}.`,
        "success"
      );
      runtime.renderCurrentPrompt();
      runtime.updateGameStats();

      window.setTimeout(() => {
        if (!matchState.active) {
          return;
        }
        matchState.currentTiles = matchState.currentTiles.map((tile) => (
          matchState.pendingTileIds.includes(tile.tileId) ? { ...tile, matched: true } : tile
        ));
        matchState.selectedTileId = "";
        matchState.pendingTileIds = [];
        matchState.pendingResult = "";
        matchState.draggingTileId = "";
        matchState.draggingPointerId = null;
        matchState.locked = false;
        matchState.resultRevealName = "";
        matchState.resultRevealCopy = "";
        matchState.resultRevealSymbol = "";
        runtime.updateGameStats();
        if (!runtime.getVisibleTiles().length) {
          runtime.finishRound();
          return;
        }
        runtime.renderCurrentPrompt();
      }, 320);
      return;
    }

    matchState.pendingResult = "wrong";
    matchState.streak = 0;
    matchState.score = Math.max(0, matchState.score - 3);
    matchState.resultRevealCopy = `${symbolTile.revealName} matches ${symbolTile.soundLabel}, not ${cueTile.primary}.`;
    runtime.setMatchFeedback(
      `Not quite. ${symbolTile.primary} is ${symbolTile.revealName} and matches ${symbolTile.soundLabel}.`,
      "warning"
    );
    runtime.renderCurrentPrompt();
    runtime.updateGameStats();
    window.setTimeout(() => {
      if (!matchState.active) {
        return;
      }
      matchState.selectedTileId = "";
      matchState.pendingTileIds = [];
      matchState.pendingResult = "";
      matchState.draggingTileId = "";
      matchState.draggingPointerId = null;
      matchState.locked = false;
      matchState.resultRevealName = "";
      matchState.resultRevealCopy = "";
      matchState.resultRevealSymbol = "";
      runtime.renderCurrentPrompt();
    }, 420);
  };

  runtime.getBoardPositionFromEvent = (event) => {
    const rect = elements.answerGrid.getBoundingClientRect();
    return {
      x: runtime.clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92),
      y: runtime.clamp(((event.clientY - rect.top) / rect.height) * 100, 10, 90)
    };
  };

  runtime.moveTile = (tileId, x, y) => {
    matchState.currentTiles = matchState.currentTiles.map((tile) => (tile.tileId === tileId ? { ...tile, x, y } : tile));
  };

  runtime.findDropTarget = (sourceTileId) => {
    const sourceTile = runtime.getTileById(sourceTileId);
    if (!sourceTile) {
      return null;
    }
    const boardRect = elements.answerGrid.getBoundingClientRect();
    let bestTarget = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    runtime.getVisibleTiles().forEach((tile) => {
      if (tile.tileId === sourceTile.tileId || tile.kind === sourceTile.kind) {
        return;
      }
      const dx = ((tile.x - sourceTile.x) / 100) * boardRect.width;
      const dy = ((tile.y - sourceTile.y) / 100) * boardRect.height;
      const distanceBetween = Math.hypot(dx, dy);
      if (distanceBetween < runtime.MATCH_TILE_DROP_DISTANCE && distanceBetween < bestDistance) {
        bestDistance = distanceBetween;
        bestTarget = tile;
      }
    });
    return bestTarget;
  };

  runtime.onMatchTilePointerDown = (event) => {
    if (!matchState.active || matchState.locked) {
      return;
    }
    const tileId = event.currentTarget.dataset.tileId;
    const tile = runtime.getTileById(tileId);
    if (!tile) {
      return;
    }
    event.preventDefault();
    runtime.beginMatchClockIfNeeded();
    matchState.draggingTileId = tileId;
    matchState.draggingPointerId = event.pointerId;
    matchState.selectedTileId = tileId;
    runtime.renderCurrentPrompt();
  };

  runtime.onMatchTilePointerMove = (event) => {
    if (!matchState.draggingTileId || event.pointerId !== matchState.draggingPointerId || matchState.locked) {
      return;
    }
    const { x, y } = runtime.getBoardPositionFromEvent(event);
    runtime.moveTile(matchState.draggingTileId, x, y);
    runtime.renderCurrentPrompt();
  };

  runtime.onMatchTilePointerEnd = (event) => {
    if (!matchState.draggingTileId || event.pointerId !== matchState.draggingPointerId) {
      return;
    }
    const draggingTileId = matchState.draggingTileId;
    const dropTarget = runtime.findDropTarget(draggingTileId);
    if (!dropTarget) {
      matchState.draggingTileId = "";
      matchState.draggingPointerId = null;
      runtime.renderCurrentPrompt();
      return;
    }
    matchState.locked = true;
    runtime.attemptMatchPair(draggingTileId, dropTarget.tileId);
  };
})();
