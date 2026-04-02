// Configs
const wordsetMap = {
  "Adjectives": "Adjectives.csv",
  "Verbs": "Verbs.csv",
  "Conjunctions": "Conjunctions.csv",
  "Top 1000": "Top 1000.csv",
  "Times": "Times.csv",
  "Professions": "Professions.csv",
  "Animals": "Animals.csv",
  "Foods": "Food.csv",
  "Numbers": "Numbers.csv"
};

const langColMap = {
  "French": 1,
  "Italian": 2,
  "German": 3,
  "Spanish": 4,
  "Chinese": 5
};

let settings = {
  wordset: "Adjectives.csv",
  language: "French",
  interval: 0,
  displayCount: 10,
  speechEnabled: true
};

const game = {
  words: {},
  selected: [],
  matched: 0,
  correct: 0,
  incorrect: 0,
  total: 0,
  startTime: Date.now()
};

// Utilities
function speak(text, lang = "en-US") {
  if (!settings.speechEnabled) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function updateStats() {
  document.getElementById("correct").textContent = `Correct: ${game.correct}`;
  document.getElementById("incorrect").textContent = `Incorrect: ${game.incorrect}`;
  document.getElementById("accuracy").textContent = `Accuracy: ${game.total ? ((game.correct / game.total) * 100).toFixed(2) + '%' : 'N/A'}`;
}

function updateTimer() {
  const elapsed = ((Date.now() - game.startTime) / 1000).toFixed(2);
  document.getElementById("timer").textContent = `Time: ${elapsed}`;
  requestAnimationFrame(updateTimer);
}
updateTimer();

function resetGame() {
  game.selected = [];
  game.correct = 0;
  game.incorrect = 0;
  game.total = 0;
  game.matched = 0;
  game.startTime = Date.now();
  updateStats();
  updateScoreboard();
  buildButtons(); // <- THIS is what's missing
}


function createButtons(containerId, options, handler) {
  const container = document.getElementById(containerId);
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;
    btn.dataset.value = opt.value;
    btn.onclick = () => {
      [...container.children].forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      handler(opt.value);
    };
    container.appendChild(btn);
  });
}

function loadCSV(path) {
  const realPath = path.includes("?") ? `${path}&_=${Date.now()}` : `${path}?_=${Date.now()}`;
  Papa.parse(realPath, {
    download: true,
    header: false,
    complete: function (res) {
      const rows = res.data;
      if (!rows || rows.length === 0) return;

      const englishCol = 0;
      const langCol = langColMap[settings.language];
      const total = rows.length;
      const start = settings.interval === 100 ? 0 : Math.floor(total * (settings.interval / 100));
      const end = settings.interval === 100 ? total : Math.floor(total * ((settings.interval + 10) / 100));
      const filtered = rows.slice(start, end).filter(row => row[englishCol] && row[langCol]);
      const selected = filtered.map(row => [row[englishCol].trim(), row[langCol].trim()])
                                .sort(() => 0.5 - Math.random())
                                .slice(0, settings.displayCount);
      game.words = Object.fromEntries(selected);
      resetGame();
      setTimeout(buildButtons, 0);
    }
  });
}

function buildButtons() {
  const englishCol = document.getElementById("english-column");
  const translatedCol = document.getElementById("translated-column");
  if (!englishCol || !translatedCol || !game.words) return;

  const eng = Object.keys(game.words);
  const trans = Object.values(game.words);
  shuffle(eng);
  shuffle(trans);
  englishCol.innerHTML = "";
  translatedCol.innerHTML = "";

  eng.forEach(w => englishCol.appendChild(makeBtn(w, "english")));
  trans.forEach(w => translatedCol.appendChild(makeBtn(w, "translated")));
}

function makeBtn(word, lang) {
  const btn = document.createElement("div");
  btn.className = "word-button";
  btn.textContent = word;
  btn.dataset.lang = lang;

  btn.onclick = () => {
    selectBtn(btn);
    const voiceLang = lang === "english"
      ? "en-US"
      : settings.language === "French" ? "fr-FR"
      : settings.language === "Italian" ? "it-IT"
      : settings.language === "German" ? "de-DE"
      : settings.language === "Spanish" ? "es-ES"
      : settings.language === "Chinese" ? "zh-CN"
      : "en-US";
    speak(btn.textContent, voiceLang);
  };

  btn.oncontextmenu = (e) => {
    e.preventDefault();
    const match = lang === "english"
      ? game.words[word]
      : Object.entries(game.words).find(([k, v]) => v === word)?.[0] || "Unknown";
    alert(`Match: ${match}`);
  };

  return btn;
}

function selectBtn(btn) {
  if (game.selected.length === 1 && game.selected[0].dataset.lang === btn.dataset.lang) {
    game.selected[0].classList.remove("selected");
    game.selected = [];
    return;
  }
  if (!btn.classList.contains("selected")) {
    btn.classList.add("selected");
    game.selected.push(btn);
  }
  if (game.selected.length === 2) checkMatch();
}

function checkMatch() {
  game.total++;
  const [b1, b2] = game.selected;
  const w1 = b1.textContent;
  const w2 = b2.textContent;
  const isMatch = (game.words[w1] === w2) || (Object.entries(game.words).find(([k, v]) => v === w1 && k === w2));

  if (isMatch) {
    game.correct++;
    game.matched++;
    [b1, b2].forEach(b => {
      b.style.backgroundColor = "var(--correct)";
      b.onclick = null;
      b.classList.remove("selected");
    });
  } else {
    game.incorrect++;
    [b1, b2].forEach(b => {
      b.style.backgroundColor = "var(--incorrect)";
      b.classList.remove("selected");
    });
    setTimeout(() => {
      [b1, b2].forEach(b => b.style.backgroundColor = "var(--btn-bg)");
    }, 500);
  }

  game.selected = [];
  updateStats();

  if (game.matched === Object.keys(game.words).length) {
    const totalTime = ((Date.now() - game.startTime) / 1000);
    const accuracy = ((game.correct / game.total) * 100).toFixed(1);
    const key = `${settings.wordset}-${settings.language}-${settings.displayCount}`;
    const listKey = `highscore-list-${key}`;
    let scores = JSON.parse(localStorage.getItem(listKey) || "[]");
    scores.push({ time: totalTime, acc: accuracy });
    scores.sort((a, b) => a.time - b.time);
    scores = scores.slice(0, 5);
    localStorage.setItem(listKey, JSON.stringify(scores));
    alert(`✅ All matched!\nTime: ${totalTime.toFixed(2)}s\nAccuracy: ${accuracy}%`);
    updateScoreboard();
  }
}

function updateScoreboard() {
  let scoreboard = document.getElementById("scoreboard");
  if (!scoreboard) return;

  const key = `${settings.wordset}-${settings.language}-${settings.displayCount}`;
  const raw = localStorage.getItem(`highscore-list-${key}`);
  const scores = raw ? JSON.parse(raw) : [];

  scoreboard.textContent = scores.length === 0
    ? `🏆 High Scores (${settings.wordset.replace(".csv", "")} - ${settings.language} - ${settings.displayCount} words)\nNo scores yet!`
    : [`🏆 High Scores (${settings.wordset.replace(".csv", "")} - ${settings.language} - ${settings.displayCount} words)`,
        ...scores.map((s, i) => `${i + 1}. ${s.time.toFixed(2)}s — ${s.acc}%`)].join("\n");

  scoreboard.style.color = "#111";
  const colorMap = {
    German: "#f5f5a3",
    Spanish: "#fce797",
    Italian: "#ffffff",
    French: "#ffffff",
    Chinese: "#f4aaaa"
  };
  scoreboard.style.backgroundColor = colorMap[settings.language] || "black";
}

function newWords() {
  if (!settings.wordset) return alert("No wordset selected.");
  loadCSV(`wordsets/${settings.wordset}`);
  updateScoreboard();
}

function shuffleWords() {
  if (!game.words || Object.keys(game.words).length === 0) return;

  const englishCol = document.getElementById("english-column");
  const translatedCol = document.getElementById("translated-column");
  if (!englishCol || !translatedCol) return;

  const engButtons = Array.from(englishCol.children);
  const transButtons = Array.from(translatedCol.children);

  // Separate correct buttons
  const correctEng = engButtons.filter(btn => btn.onclick === null);
  const correctTrans = transButtons.filter(btn => btn.onclick === null);
  const restEng = engButtons.filter(btn => btn.onclick !== null);
  const restTrans = transButtons.filter(btn => btn.onclick !== null);

  shuffle(restEng);
  shuffle(restTrans);

  englishCol.innerHTML = "";
  translatedCol.innerHTML = "";

  [...correctEng, ...restEng].forEach(btn => englishCol.appendChild(btn));
  [...correctTrans, ...restTrans].forEach(btn => translatedCol.appendChild(btn));
}

function applyLanguageBackground(lang) {
  const body = document.body;
  body.classList.remove("lang-fr", "lang-it", "lang-de", "lang-es", "lang-cn");
  const classMap = {
    French: "lang-fr",
    Italian: "lang-it",
    German: "lang-de",
    Spanish: "lang-es",
    Chinese: "lang-cn"
  };
  if (classMap[lang]) body.classList.add(classMap[lang]);
}

function toggleSpeech() {
  settings.speechEnabled = !settings.speechEnabled;
  document.getElementById("toggle-speech").textContent = settings.speechEnabled ? "🔊 Mute" : "🔇 Unmute";
}

// (full code above remains unchanged)

function alphabetizeWords() {
  if (!game.words || Object.keys(game.words).length === 0) return;

  const englishCol = document.getElementById("english-column");
  const translatedCol = document.getElementById("translated-column");
  if (!englishCol || !translatedCol) return;

  const matchedEnglish = new Set();
  const matchedTranslated = new Set();

  // Identify matched words by finding disabled buttons
  document.querySelectorAll("#english-column .word-button").forEach(btn => {
    if (!btn.onclick) matchedEnglish.add(btn.textContent);
  });
  document.querySelectorAll("#translated-column .word-button").forEach(btn => {
    if (!btn.onclick) matchedTranslated.add(btn.textContent);
  });

  const eng = Object.keys(game.words).sort((a, b) => a.localeCompare(b));
  const trans = Object.values(game.words).sort((a, b) => a.localeCompare(b));

  englishCol.innerHTML = "";
  translatedCol.innerHTML = "";

  eng.forEach(w => {
    const btn = document.createElement("div");
    btn.className = "word-button";
    btn.textContent = w;
    btn.dataset.lang = "english";
    if (matchedEnglish.has(w)) {
      btn.onclick = null;
      btn.style.backgroundColor = "var(--correct)";
    } else {
      btn.onclick = () => {
        selectBtn(btn);
        speak(w, "en-US");
      };
    }
    englishCol.appendChild(btn);
  });

  trans.forEach(w => {
    const btn = document.createElement("div");
    btn.className = "word-button";
    btn.textContent = w;
    btn.dataset.lang = "translated";
    if (matchedTranslated.has(w)) {
      btn.onclick = null;
      btn.style.backgroundColor = "var(--correct)";
    } else {
      const lang = settings.language;
      const voiceLang =
        lang === "French" ? "fr-FR" :
        lang === "Italian" ? "it-IT" :
        lang === "German" ? "de-DE" :
        lang === "Spanish" ? "es-ES" :
        lang === "Chinese" ? "zh-CN" : "en-US";
      btn.onclick = () => {
        selectBtn(btn);
        speak(w, voiceLang);
      };
    }
    translatedCol.appendChild(btn);
  });
}


function backToMenu() {
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("menu-screen").style.display = "block";
  document.body.classList.remove("lang-fr", "lang-it", "lang-de", "lang-es", "lang-cn");
}

function exitGame() {
  if (window.confirm("Close this tab?")) {
    window.open('', '_self')?.close();
  }
}

document.getElementById("toggle-theme").onclick = () => {
  document.body.classList.toggle("dark");
};

document.getElementById("proceed-btn").onclick = () => {
  applyLanguageBackground(settings.language);
  document.getElementById("menu-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  if (!settings.wordset || !settings.language) {
    alert("Please select a wordset and language.");
    return;
  }

  loadCSV(`wordsets/${settings.wordset}`);
};

window.onload = () => {
  createButtons("wordset-buttons", Object.keys(wordsetMap).map(k => ({ label: k, value: wordsetMap[k] })), val => settings.wordset = val);
  createButtons("interval-buttons", [...Array(10).keys()].map(i => ({ label: `${i * 10}-${(i + 1) * 10}%`, value: i * 10 })).concat([{ label: "Full Set", value: 100 }]), val => settings.interval = val);
  createButtons("display-buttons", Array.from({ length: 9 }, (_, i) => ({ label: `${(i + 1) * 5}`, value: (i + 1) * 5 })), val => settings.displayCount = val);
  createButtons("language-buttons", Object.keys(langColMap).map(l => ({ label: l, value: l })), val => settings.language = val);

  document.querySelector("#wordset-buttons button")?.click();
  document.querySelector("#language-buttons button")?.click();
  document.querySelector("#interval-buttons button")?.click();
  document.querySelector("#display-buttons button")?.click();

  const muteBtn = document.createElement("button");
  muteBtn.id = "toggle-speech";
  muteBtn.textContent = "🔊 Mute";
  muteBtn.onclick = toggleSpeech;
  document.querySelector("footer")?.appendChild(muteBtn);
};
