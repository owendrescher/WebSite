(function () {
  const runtime = window.ScriptLearningRuntime;
  const { elements, choiceState } = runtime;

  runtime.getChoiceEntries = () => {
    const script = runtime.getActiveScript();
    return choiceState.mode === "words" ? (script?.words || []) : runtime.getActiveLetters();
  };

  runtime.getChoiceCompletedCount = () => choiceState.completedQuestions;

  runtime.updateChoiceStats = () => {
    elements.choiceTime.textContent = runtime.formatElapsed(choiceState.elapsedMs);
    elements.choiceScore.textContent = String(choiceState.score);
    elements.choiceStreak.textContent = String(choiceState.streak);
    elements.choiceAccuracy.textContent = runtime.formatAccuracy(choiceState.correct, choiceState.attempts);
    const completion = choiceState.totalQuestions
      ? (choiceState.completedQuestions / choiceState.totalQuestions) * 100
      : 0;
    elements.choiceProgressFill.style.width = `${completion}%`;
  };

  runtime.renderChoiceLeaderboard = () => {
    elements.choiceLeaderboardList.innerHTML = "";
    if (!choiceState.leaderboard.length) {
      const placeholder = document.createElement("li");
      placeholder.textContent = "No runs yet.";
      elements.choiceLeaderboardList.append(placeholder);
      return;
    }
    choiceState.leaderboard.forEach((entry, index) => {
      const item = document.createElement("li");
      item.textContent = `#${index + 1} ${runtime.formatElapsed(entry.elapsedMs || 0)} | ${entry.accuracy} | ${entry.correct}/${entry.attempts}`;
      elements.choiceLeaderboardList.append(item);
    });
  };

  runtime.setChoiceFeedback = (message, tone = "info") => {
    elements.choiceFeedback.textContent = message;
    elements.choiceFeedback.className = `feedback ${tone}`;
  };
  runtime.hideChoiceSummary = () => elements.choiceSummary.classList.add("is-hidden");
  runtime.showChoiceSummary = (message) => {
    elements.choiceSummaryCopy.textContent = message;
    elements.choiceSummary.classList.remove("is-hidden");
  };

  runtime.makeChoiceQuestion = (entry, serial) => {
    const entries = runtime.getChoiceEntries();
    const isWord = choiceState.mode === "words";
    const isName = choiceState.mode === "names";
    const distractors = runtime.shuffle(entries.filter((candidate) => candidate.id !== entry.id))
      .slice(0, Math.min(runtime.CHOICE_OPTION_COUNT - 1, entries.length - 1));
    const options = runtime.shuffle([entry, ...distractors]).map((candidate, optionIndex) => ({
      optionId: `${entry.id}-${serial}-option-${optionIndex}`,
      entryId: candidate.id,
      label: isWord ? candidate.pronunciation : isName ? candidate.name : candidate.soundLabel,
      hint: isWord ? "Choose this pronunciation" : isName ? (candidate.nativeName || "Letter name") : candidate.soundHint,
      isCorrect: candidate.id === entry.id
    }));
    return {
      questionId: `${entry.id}-${serial}`,
      entryId: entry.id,
      symbol: entry.symbol,
      revealName: isWord ? entry.pronunciation : entry.name,
      answerLabel: isWord ? entry.pronunciation : isName ? entry.name : entry.soundLabel,
      translation: isWord ? entry.translation : "",
      options,
      revealed: false,
      selectedOptionId: ""
    };
  };

  runtime.buildChoiceQuestions = () => {
    const entries = runtime.shuffle(runtime.getChoiceEntries());
    choiceState.totalQuestions = entries.length;
    return entries.map((entry, index) => runtime.makeChoiceQuestion(entry, index));
  };

  runtime.renderChoiceRound = () => {
    const script = runtime.getActiveScript();
    const question = choiceState.currentQuestion;
    const isWord = choiceState.mode === "words";
    const isName = choiceState.mode === "names";
    if (!script) return;

    const hasWords = Boolean(script.words?.length);
    elements.choiceTypeWords.disabled = !hasWords;
    elements.choiceTypeWords.title = hasWords ? "Practice word pronunciation" : "Word practice is not available for this script yet";
    elements.choiceTypeLetters.classList.toggle("is-active", choiceState.mode === "letters");
    elements.choiceTypeNames.classList.toggle("is-active", isName);
    elements.choiceTypeWords.classList.toggle("is-active", isWord);
    elements.choiceTitle.textContent = `${script.name} ${isWord ? "Word Choice" : isName ? "Letter Names" : "Quick Choice"}`;
    elements.choiceSymbol.style.fontFamily = script.glyphFont;
    elements.choiceSymbol.dir = script.textDirection;
    elements.choiceContextSymbol.style.fontFamily = script.glyphFont;
    elements.choiceOptions.innerHTML = "";

    if (!choiceState.active || !question) {
      const count = runtime.getChoiceEntries().length;
      elements.choicePromptLabel.textContent = "Warm-up";
      elements.choiceSymbol.textContent = "?";
      elements.choiceContextSymbol.textContent = "?";
      elements.choiceSymbolPair.classList.remove("show-context");
      elements.choiceReveal.textContent = isWord ? "The English translation appears after each answer." : isName ? "Choose the letter name rather than its sound." : "The character name appears after each answer.";
      elements.choiceCopy.textContent = `Start a round to work through all ${count} ${isWord ? "words" : script.unitPlural}${isName ? " by name" : ""}. Missed answers return later in the round.`;
      const placeholder = document.createElement("div");
      placeholder.className = "choice-placeholder";
      placeholder.textContent = "Press this board to begin.";
      elements.choiceOptions.append(placeholder);
      return;
    }

    elements.choicePromptLabel.textContent = `${choiceState.completedQuestions} of ${choiceState.totalQuestions} mastered · Attempt ${choiceState.questionIndex + 1}`;
    elements.choiceSymbol.textContent = question.symbol;
    const showArabicContext = script.id === "arabic" && !isWord;
    elements.choiceSymbolPair.classList.toggle("show-context", showArabicContext);
    elements.choiceContextSymbol.textContent = showArabicContext ? `${question.symbol}ا` : "";
    elements.choiceContextSymbol.setAttribute("aria-label", showArabicContext ? `${question.revealName} before alif` : "");
    if (question.revealed) {
      const correct = choiceState.pendingResult === "correct";
      elements.choiceReveal.textContent = isWord
        ? `${question.revealName} — ${question.translation}`
        : isName ? question.revealName : `${question.revealName} — ${question.answerLabel}`;
      elements.choiceCopy.textContent = correct
        ? `${isWord ? `Translation: ${question.translation}. ` : "Nice hit. "}Press Space to continue.`
        : `The correct ${isWord ? "pronunciation" : isName ? "name" : "sound"} was ${question.answerLabel}.${isWord ? ` Translation: ${question.translation}.` : ""} Press Space to continue; this ${isWord ? "word" : "letter"} will return later.`;
    } else {
      elements.choiceReveal.textContent = isWord ? "Which pronunciation matches this word?" : isName ? `What is this ${script.unitSingular} called?` : "Pick the sound first. The romanized name stays hidden until you answer.";
      elements.choiceCopy.textContent = "Click an answer or use 1–4: top-left, top-right, bottom-left, bottom-right.";
    }

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-option";
      button.dataset.optionId = option.optionId;
      button.disabled = choiceState.locked || question.revealed;
      if (question.revealed && option.isCorrect) button.classList.add("is-correct");
      if (question.revealed && question.selectedOptionId === option.optionId && !option.isCorrect) button.classList.add("is-wrong");
      button.innerHTML = `<span class="choice-key" aria-hidden="true">${index + 1}</span><strong>${option.label}</strong><span class="answer-detail">${option.hint}</span>`;
      button.setAttribute("aria-label", `${index + 1}: ${option.label}`);
      button.addEventListener("click", runtime.onChoiceOptionClick);
      elements.choiceOptions.append(button);
    });
  };

  runtime.stopChoiceClock = () => {
    if (choiceState.clockStarted) choiceState.elapsedMs = Date.now() - choiceState.startedAt;
    window.clearInterval(choiceState.intervalId);
    choiceState.intervalId = null;
    choiceState.clockStarted = false;
    runtime.updateChoiceStats();
  };
  runtime.beginChoiceClockIfNeeded = () => {
    if (!choiceState.active || choiceState.clockStarted) return;
    choiceState.clockStarted = true;
    choiceState.startedAt = Date.now() - choiceState.elapsedMs;
    choiceState.intervalId = window.setInterval(() => {
      choiceState.elapsedMs = Date.now() - choiceState.startedAt;
      runtime.updateChoiceStats();
    }, 100);
  };

  runtime.finishChoiceRound = () => {
    choiceState.active = false;
    choiceState.locked = false;
    choiceState.awaitingAdvance = false;
    runtime.stopChoiceClock();
    const accuracy = runtime.formatAccuracy(choiceState.correct, choiceState.attempts);
    const entry = { elapsedMs: choiceState.elapsedMs, score: choiceState.score, correct: choiceState.correct, attempts: choiceState.attempts, accuracy, date: new Date().toLocaleDateString(), mode: choiceState.mode };
    choiceState.leaderboard = [...choiceState.leaderboard, entry]
      .sort((a, b) => (a.elapsedMs || Number.MAX_SAFE_INTEGER) - (b.elapsedMs || Number.MAX_SAFE_INTEGER) || b.score - a.score)
      .slice(0, 5);
    runtime.saveStoredArray(runtime.storageKey("choice-leaderboard"), choiceState.leaderboard);
    runtime.renderChoiceLeaderboard();
    runtime.renderChoiceRound();
    runtime.showChoiceSummary(`Round finished in ${runtime.formatElapsed(choiceState.elapsedMs)} with ${accuracy} accuracy.`);
    runtime.setChoiceFeedback("Round complete — every item was answered correctly.", "success");
    elements.choicePromptLabel.textContent = "Round Complete";
  };

  runtime.startChoiceRound = () => {
    runtime.stopChoiceClock();
    Object.assign(choiceState, { active: true, elapsedMs: 0, score: 0, streak: 0, correct: 0, attempts: 0, completedQuestions: 0, questionIndex: 0, selectedOptionId: "", pendingResult: "", awaitingAdvance: false, revealed: false, locked: false, clockStarted: false, startedAt: 0 });
    choiceState.questions = runtime.buildChoiceQuestions();
    choiceState.currentQuestion = choiceState.questions[0] || null;
    runtime.hideChoiceSummary();
    runtime.updateChoiceStats();
    runtime.renderChoiceRound();
    if (choiceState.currentQuestion) {
      runtime.beginChoiceClockIfNeeded();
      runtime.setChoiceFeedback("Round ready. Use the mouse or keys 1–4.", "info");
    }
  };

  runtime.resetChoiceRound = () => {
    runtime.stopChoiceClock();
    if (choiceState.mode === "words" && !runtime.getActiveScript()?.words?.length) {
      choiceState.mode = "letters";
    }
    Object.assign(choiceState, { active: false, elapsedMs: 0, score: 0, streak: 0, correct: 0, attempts: 0, completedQuestions: 0, totalQuestions: runtime.getChoiceEntries().length, questionIndex: 0, questions: [], currentQuestion: null, selectedOptionId: "", pendingResult: "", awaitingAdvance: false, revealed: false, locked: false, clockStarted: false, startedAt: 0 });
    runtime.hideChoiceSummary();
    runtime.updateChoiceStats();
    runtime.renderChoiceRound();
    runtime.setChoiceFeedback("Choose an answer with a click or the 1–4 keys.", "info");
  };

  runtime.setChoiceMode = (mode) => {
    if (mode === "words" && !runtime.getActiveScript()?.words?.length) return;
    if (choiceState.mode === mode) return;
    choiceState.mode = mode;
    runtime.resetChoiceRound();
  };

  runtime.answerChoiceOption = (optionId) => {
    if (!choiceState.active || choiceState.locked || !choiceState.currentQuestion) return;
    const question = choiceState.currentQuestion;
    const selected = question.options.find((option) => option.optionId === optionId);
    if (!selected) return;
    choiceState.locked = true;
    choiceState.awaitingAdvance = true;
    choiceState.attempts += 1;
    choiceState.selectedOptionId = optionId;
    choiceState.pendingResult = selected.isCorrect ? "correct" : "wrong";
    question.selectedOptionId = optionId;
    question.revealed = true;
    if (selected.isCorrect) {
      const bonus = choiceState.streak > 0 && (choiceState.streak + 1) % 3 === 0 ? 4 : 0;
      choiceState.correct += 1;
      choiceState.completedQuestions += 1;
      choiceState.streak += 1;
      choiceState.score += 10 + bonus;
      const translation = choiceState.mode === "words" ? ` It means “${question.translation}.”` : "";
      runtime.setChoiceFeedback(`Correct.${translation} Press Space for the next one.`, "success");
    } else {
      choiceState.streak = 0;
      choiceState.score = Math.max(0, choiceState.score - 2);
      const entry = runtime.getChoiceEntries().find((candidate) => candidate.id === question.entryId);
      const retry = runtime.makeChoiceQuestion(entry, `${Date.now()}-retry`);
      const earliest = choiceState.questionIndex + 2;
      const insertionIndex = Math.min(choiceState.questions.length, earliest + Math.floor(Math.random() * Math.max(1, choiceState.questions.length - earliest + 1)));
      choiceState.questions.splice(insertionIndex, 0, retry);
      const translation = choiceState.mode === "words" ? ` It means “${question.translation}.”` : "";
      runtime.setChoiceFeedback(`Not quite. The correct answer is ${question.answerLabel}.${translation} It has been shuffled back into the round.`, "warning");
    }
    runtime.stopChoiceClock();
    runtime.renderChoiceRound();
  };

  runtime.onChoiceOptionClick = (event) => {
    event.stopPropagation();
    runtime.answerChoiceOption(event.currentTarget.dataset.optionId);
  };
  runtime.selectChoiceOption = (index) => {
    const option = choiceState.currentQuestion?.options[index];
    if (option) runtime.answerChoiceOption(option.optionId);
  };

  runtime.advanceChoiceRound = () => {
    if (!choiceState.active || !choiceState.awaitingAdvance) return;
    const nextIndex = choiceState.questionIndex + 1;
    if (nextIndex >= choiceState.questions.length) {
      runtime.finishChoiceRound();
      return;
    }
    Object.assign(choiceState, { questionIndex: nextIndex, currentQuestion: choiceState.questions[nextIndex], selectedOptionId: "", pendingResult: "", awaitingAdvance: false, revealed: false, locked: false, clockStarted: false });
    runtime.updateChoiceStats();
    runtime.renderChoiceRound();
    runtime.beginChoiceClockIfNeeded();
  };
})();
