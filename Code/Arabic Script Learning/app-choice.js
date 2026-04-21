(function () {
  const runtime = window.ScriptLearningRuntime;
  const { elements, choiceState } = runtime;

  runtime.getChoiceCompletedCount = () => {
    if (!choiceState.totalQuestions) {
      return 0;
    }
    if (!choiceState.active) {
      return choiceState.questions.length ? choiceState.totalQuestions : 0;
    }
    return choiceState.questionIndex + (choiceState.currentQuestion?.revealed ? 1 : 0);
  };

  runtime.updateChoiceStats = () => {
    elements.choiceTime.textContent = runtime.formatElapsed(choiceState.elapsedMs);
    elements.choiceScore.textContent = String(choiceState.score);
    elements.choiceStreak.textContent = String(choiceState.streak);
    elements.choiceAccuracy.textContent = runtime.formatAccuracy(choiceState.correct, choiceState.attempts);
    const completion = choiceState.totalQuestions
      ? (runtime.getChoiceCompletedCount() / choiceState.totalQuestions) * 100
      : 0;
    elements.choiceProgressFill.style.width = `${completion}%`;
  };

  runtime.renderChoiceLeaderboard = () => {
    elements.choiceLeaderboardList.innerHTML = "";
    if (!choiceState.leaderboard.length) {
      const placeholder = document.createElement("li");
      placeholder.textContent = "Finish one choice round to save your first speed run on this device.";
      elements.choiceLeaderboardList.append(placeholder);
      return;
    }

    choiceState.leaderboard.forEach((entry, index) => {
      const item = document.createElement("li");
      item.textContent = `#${index + 1} ${runtime.formatElapsed(entry.elapsedMs || 0)} - ${entry.accuracy} - ${entry.correct}/${entry.attempts} correct - ${entry.date}`;
      elements.choiceLeaderboardList.append(item);
    });
  };

  runtime.setChoiceFeedback = (message, tone = "info") => {
    elements.choiceFeedback.textContent = message;
    elements.choiceFeedback.className = `feedback ${tone}`;
  };

  runtime.hideChoiceSummary = () => {
    elements.choiceSummary.classList.add("is-hidden");
  };

  runtime.showChoiceSummary = (message) => {
    elements.choiceSummaryCopy.textContent = message;
    elements.choiceSummary.classList.remove("is-hidden");
  };

  runtime.buildChoiceQuestions = () => {
    const letters = runtime.getActiveLetters();
    if (!letters.length) {
      return [];
    }

    const totalQuestions = Math.min(runtime.CHOICE_QUESTION_COUNT, letters.length);
    choiceState.totalQuestions = totalQuestions;

    return runtime.shuffle(letters)
      .slice(0, totalQuestions)
      .map((entry, index) => {
        const distractors = runtime.shuffle(letters.filter((letter) => letter.id !== entry.id))
          .slice(0, Math.max(0, Math.min(runtime.CHOICE_OPTION_COUNT - 1, letters.length - 1)));
        const options = runtime.shuffle([entry, ...distractors]).map((letter, optionIndex) => ({
          optionId: `${entry.id}-option-${optionIndex}`,
          letterId: letter.id,
          label: letter.soundLabel,
          hint: letter.soundHint,
          isCorrect: letter.id === entry.id
        }));

        return {
          questionId: `${entry.id}-${index}`,
          symbol: entry.symbol,
          revealName: entry.name,
          soundLabel: entry.soundLabel,
          soundHint: entry.soundHint,
          options,
          revealed: false,
          selectedOptionId: ""
        };
      });
  };

  runtime.renderChoiceRound = () => {
    const script = runtime.getActiveScript();
    const question = choiceState.currentQuestion;

    if (!script) {
      elements.choiceOptions.innerHTML = "";
      elements.choiceSymbol.textContent = "?";
      return;
    }

    elements.choiceSymbol.style.fontFamily = script.glyphFont;
    elements.choiceSymbol.dir = script.textDirection;
    elements.choiceOptions.innerHTML = "";

    if (!choiceState.active || !question) {
      elements.choicePromptLabel.textContent = "Warm-up";
      elements.choiceSymbol.textContent = "?";
      elements.choiceReveal.textContent = "The character name appears after each answer.";
      elements.choiceCopy.textContent = `Start a round to answer ${Math.min(runtime.CHOICE_QUESTION_COUNT, runtime.getActiveLetters().length)} quick ${script.name} prompts as fast as you can.`;

      const placeholder = document.createElement("div");
      placeholder.className = "choice-placeholder";
      placeholder.textContent = "Press Start Choice Round to begin.";
      elements.choiceOptions.append(placeholder);
      return;
    }

    elements.choicePromptLabel.textContent = `Question ${choiceState.questionIndex + 1} of ${choiceState.totalQuestions}`;
    elements.choiceSymbol.textContent = question.symbol;

    if (question.revealed) {
      elements.choiceReveal.textContent = `${question.revealName} - ${question.soundLabel}`;
      elements.choiceCopy.textContent = question.selectedOptionId && choiceState.pendingResult === "correct"
        ? "Nice hit. Keep moving for a faster total time."
        : `The correct sound was ${question.soundLabel}.`;
    } else {
      elements.choiceReveal.textContent = "Pick the sound first. The romanized name stays hidden until you answer.";
      elements.choiceCopy.textContent = `Choose the sound that matches this ${script.name} ${script.unitSingular}.`;
    }

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-option";
      button.dataset.optionId = option.optionId;
      button.disabled = choiceState.locked || question.revealed;

      if (question.revealed && option.isCorrect) {
        button.classList.add("is-correct");
      }
      if (question.revealed && question.selectedOptionId === option.optionId && !option.isCorrect) {
        button.classList.add("is-wrong");
      }

      button.innerHTML = `<strong>${option.label}</strong><span class="answer-detail">${option.hint}</span>`;
      button.addEventListener("click", runtime.onChoiceOptionClick);
      elements.choiceOptions.append(button);
    });
  };

  runtime.stopChoiceClock = () => {
    if (choiceState.clockStarted) {
      choiceState.elapsedMs = Date.now() - choiceState.startedAt;
    }
    window.clearInterval(choiceState.intervalId);
    choiceState.intervalId = null;
    choiceState.clockStarted = false;
  };

  runtime.beginChoiceClockIfNeeded = () => {
    if (!choiceState.active || choiceState.clockStarted) {
      return;
    }
    choiceState.clockStarted = true;
    choiceState.startedAt = Date.now() - choiceState.elapsedMs;
    window.clearInterval(choiceState.intervalId);
    choiceState.intervalId = window.setInterval(() => {
      choiceState.elapsedMs = Date.now() - choiceState.startedAt;
      runtime.updateChoiceStats();
    }, 100);
    runtime.setChoiceFeedback("Stopwatch live. Keep moving and trust your first recognition pass.", "info");
  };

  runtime.finishChoiceRound = () => {
    choiceState.active = false;
    choiceState.locked = false;
    runtime.stopChoiceClock();
    runtime.updateChoiceStats();
    runtime.renderChoiceRound();

    const accuracy = runtime.formatAccuracy(choiceState.correct, choiceState.attempts);
    if (choiceState.attempts) {
      const entry = {
        elapsedMs: choiceState.elapsedMs,
        score: choiceState.score,
        correct: choiceState.correct,
        attempts: choiceState.attempts,
        accuracy,
        date: new Date().toLocaleDateString()
      };
      choiceState.leaderboard = [...choiceState.leaderboard, entry]
        .sort((left, right) => (left.elapsedMs || Number.MAX_SAFE_INTEGER) - (right.elapsedMs || Number.MAX_SAFE_INTEGER) || right.score - left.score || right.correct - left.correct)
        .slice(0, 5);
      runtime.saveStoredArray(runtime.storageKey("choice-leaderboard"), choiceState.leaderboard);
      runtime.renderChoiceLeaderboard();
    }

    runtime.showChoiceSummary(`Round finished in ${runtime.formatElapsed(choiceState.elapsedMs)} with ${accuracy} accuracy.`);
    runtime.setChoiceFeedback("Choice round complete. Start again when you want to chase a faster run.", "success");
    elements.choicePromptLabel.textContent = "Round Complete";
    elements.choiceCopy.textContent = "Local speed rankings are saved only in this browser for the active script.";
  };

  runtime.startChoiceRound = () => {
    runtime.stopChoiceClock();
    choiceState.active = true;
    choiceState.elapsedMs = 0;
    choiceState.score = 0;
    choiceState.streak = 0;
    choiceState.correct = 0;
    choiceState.attempts = 0;
    choiceState.questionIndex = 0;
    choiceState.selectedOptionId = "";
    choiceState.pendingResult = "";
    choiceState.revealed = false;
    choiceState.locked = false;
    choiceState.clockStarted = false;
    choiceState.startedAt = 0;
    choiceState.questions = runtime.buildChoiceQuestions();
    choiceState.currentQuestion = choiceState.questions[0] || null;
    runtime.hideChoiceSummary();
    runtime.updateChoiceStats();
    runtime.renderChoiceRound();
    runtime.setChoiceFeedback("Round ready. The stopwatch starts when you answer your first prompt.", "info");
  };

  runtime.resetChoiceRound = () => {
    const script = runtime.getActiveScript();
    runtime.stopChoiceClock();
    choiceState.active = false;
    choiceState.elapsedMs = 0;
    choiceState.score = 0;
    choiceState.streak = 0;
    choiceState.correct = 0;
    choiceState.attempts = 0;
    choiceState.totalQuestions = Math.min(runtime.CHOICE_QUESTION_COUNT, runtime.getActiveLetters().length);
    choiceState.questionIndex = 0;
    choiceState.questions = [];
    choiceState.currentQuestion = null;
    choiceState.selectedOptionId = "";
    choiceState.pendingResult = "";
    choiceState.revealed = false;
    choiceState.locked = false;
    choiceState.clockStarted = false;
    choiceState.startedAt = 0;
    runtime.hideChoiceSummary();
    runtime.updateChoiceStats();
    runtime.renderChoiceRound();
    if (script) {
      runtime.setChoiceFeedback(`Choose the matching sound for each ${script.name} ${script.unitSingular}. The stopwatch starts on your first answer.`, "info");
    }
  };

  runtime.onChoiceOptionClick = (event) => {
    if (!choiceState.active || choiceState.locked || !choiceState.currentQuestion) {
      return;
    }

    const optionId = event.currentTarget.dataset.optionId;
    const question = choiceState.currentQuestion;
    const selectedOption = question.options.find((option) => option.optionId === optionId);
    if (!selectedOption) {
      return;
    }

    runtime.beginChoiceClockIfNeeded();

    choiceState.locked = true;
    choiceState.attempts += 1;
    choiceState.selectedOptionId = optionId;
    choiceState.pendingResult = selectedOption.isCorrect ? "correct" : "wrong";
    question.selectedOptionId = optionId;
    question.revealed = true;

    if (selectedOption.isCorrect) {
      const streakBonus = choiceState.streak > 0 && (choiceState.streak + 1) % 3 === 0 ? 4 : 0;
      choiceState.correct += 1;
      choiceState.streak += 1;
      choiceState.score += 10 + streakBonus;
      runtime.setChoiceFeedback(
        streakBonus
          ? `Correct. ${question.symbol} is ${question.revealName} and sounds like ${question.soundLabel}. Bonus +${streakBonus}.`
          : `Correct. ${question.symbol} is ${question.revealName} and sounds like ${question.soundLabel}.`,
        "success"
      );
    } else {
      choiceState.streak = 0;
      choiceState.score = Math.max(0, choiceState.score - 2);
      runtime.setChoiceFeedback(
        `Not quite. ${question.symbol} is ${question.revealName} and matches ${question.soundLabel}.`,
        "warning"
      );
    }

    runtime.updateChoiceStats();
    runtime.renderChoiceRound();

    window.setTimeout(() => {
      if (!choiceState.active) {
        return;
      }

      const nextIndex = choiceState.questionIndex + 1;
      if (nextIndex >= choiceState.totalQuestions) {
        runtime.finishChoiceRound();
        return;
      }

      choiceState.questionIndex = nextIndex;
      choiceState.currentQuestion = choiceState.questions[nextIndex];
      choiceState.selectedOptionId = "";
      choiceState.pendingResult = "";
      choiceState.revealed = false;
      choiceState.locked = false;
      runtime.updateChoiceStats();
      runtime.renderChoiceRound();
    }, 750);
  };
})();
