const els = {
  subjectList: document.getElementById("subjectList"),
  levelSelect: document.getElementById("levelSelect"),
  questionCountInput: document.getElementById("questionCountInput"),
  timerModeSelect: document.getElementById("timerModeSelect"),
  secondsInput: document.getElementById("secondsInput"),
  toleranceSelect: document.getElementById("toleranceSelect"),
  allowFractionsInput: document.getElementById("allowFractionsInput"),
  allowNegativesInput: document.getElementById("allowNegativesInput"),
  instantFeedbackInput: document.getElementById("instantFeedbackInput"),
  checkAllBtn: document.getElementById("checkAllBtn"),
  uncheckAllBtn: document.getElementById("uncheckAllBtn"),
  startBtn: document.getElementById("startBtn"),
  resetBtn: document.getElementById("resetBtn"),
  restartBtn: document.getElementById("restartBtn"),
  startState: document.getElementById("startState"),
  questionCard: document.getElementById("questionCard"),
  summaryCard: document.getElementById("summaryCard"),
  questionNumber: document.getElementById("questionNumber"),
  topicLabel: document.getElementById("topicLabel"),
  questionText: document.getElementById("questionText"),
  answerForm: document.getElementById("answerForm"),
  answerInput: document.getElementById("answerInput"),
  answerPreview: document.getElementById("answerPreview"),
  submitBtn: document.getElementById("submitBtn"),
  feedback: document.getElementById("feedback"),
  explainBtn: document.getElementById("explainBtn"),
  explanationBox: document.getElementById("explanationBox"),
  nextBtn: document.getElementById("nextBtn"),
  scoreReadout: document.getElementById("scoreReadout"),
  streakReadout: document.getElementById("streakReadout"),
  timerReadout: document.getElementById("timerReadout"),
  summaryStats: document.getElementById("summaryStats"),
  reviewList: document.getElementById("reviewList"),
};

const subjects = [
  { id: "arithmetic", label: "Arithmetic", minLevel: 1 },
  { id: "place", label: "Place Value and Rounding", minLevel: 1 },
  { id: "fractions", label: "Fractions", minLevel: 2 },
  { id: "decimals", label: "Decimals and Percents", minLevel: 2 },
  { id: "numberTheory", label: "Number Theory", minLevel: 2 },
  { id: "prealgebra", label: "Pre-Algebra", minLevel: 3 },
  { id: "algebra", label: "Algebra", minLevel: 3 },
  { id: "inequalities", label: "Inequalities", minLevel: 3 },
  { id: "exponents", label: "Exponents and Radicals", minLevel: 4 },
  { id: "functions", label: "Functions", minLevel: 4 },
  { id: "geometry", label: "Geometry", minLevel: 3 },
  { id: "coordinate", label: "Coordinate Geometry", minLevel: 4 },
  { id: "trig", label: "Trigonometry", minLevel: 4 },
  { id: "stats", label: "Statistics and Probability", minLevel: 4 },
  { id: "precalc", label: "Precalculus", minLevel: 5 },
  { id: "limits", label: "Limits", minLevel: 5 },
  { id: "calculus", label: "Derivatives and Integrals", minLevel: 5 },
  { id: "sequences", label: "Sequences and Series", minLevel: 5 },
  { id: "complex", label: "Complex Numbers", minLevel: 5 },
  { id: "linear", label: "Linear Algebra", minLevel: 6 },
  { id: "diffeq", label: "Differential Equations", minLevel: 6 },
  { id: "multi", label: "Multivariable Calculus", minLevel: 7 },
];

const DEFAULT_START_COPY = "Questions appear one at a time. The checker accepts exact values, simplified fractions, and decimals where appropriate.";
const SETTINGS_KEY = "owentools.mathQuiz.settings.v1";

const generators = {
  arithmetic: arithmeticQuestion,
  place: placeValueQuestion,
  fractions: fractionQuestion,
  decimals: decimalPercentQuestion,
  numberTheory: numberTheoryQuestion,
  prealgebra: prealgebraQuestion,
  algebra: algebraQuestion,
  inequalities: inequalityQuestion,
  exponents: exponentQuestion,
  functions: functionQuestion,
  geometry: geometryQuestion,
  coordinate: coordinateQuestion,
  trig: trigQuestion,
  stats: statsQuestion,
  precalc: precalcQuestion,
  limits: limitsQuestion,
  calculus: calculusQuestion,
  sequences: sequenceQuestion,
  complex: complexQuestion,
  linear: linearQuestion,
  diffeq: differentialEquationQuestion,
  multi: multivariableQuestion,
};

const state = {
  active: false,
  questions: [],
  currentIndex: 0,
  correct: 0,
  answered: 0,
  streak: 0,
  bestStreak: 0,
  review: [],
  startedAt: 0,
  questionStartedAt: 0,
  timerId: null,
  autoAdvanceId: null,
  inputCheckId: null,
  answeredCurrent: false,
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(items) {
  return items[randInt(0, items.length - 1)];
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

function simplifyFraction(num, den) {
  const sign = den < 0 ? -1 : 1;
  const common = gcd(num, den);
  return { num: (num / common) * sign, den: Math.abs(den / common) };
}

function fractionText(num, den) {
  const simple = simplifyFraction(num, den);
  return simple.den === 1 ? String(simple.num) : `${simple.num}/${simple.den}`;
}

function fractionLatex(num, den) {
  const simple = simplifyFraction(num, den);
  return simple.den === 1 ? String(simple.num) : `\\frac{${simple.num}}{${simple.den}}`;
}

function formatNumber(value) {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return String(Number(value.toFixed(4))).replace(/\.0+$/, "");
}

function q(topic, latex, answer, displayAnswer, kind = "number", plain = "", explanation = "") {
  return {
    topic,
    latex,
    plain: plain || latex.replace(/\\/g, ""),
    kind,
    answer,
    displayAnswer,
    displayLatex: answer.displayLatex || displayAnswer,
    explanation,
  };
}

function cleanAnswer(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\*/g, "")
    .replace(/\u00b7/g, "")
    .replace(/\u2212/g, "-")
    .replace(/[()[\]{}]/g, "")
    .replace(/\\left|\\right/g, "")
    .replace(/\\cdot/g, "");
}

function cleanSymbolic(value) {
  return cleanAnswer(value)
    .replace(/\\frac([+-]?\d+)([+-]?\d+)/g, "$1/$2")
    .replace(/\^\{?([+-]?\d+)\}?/g, "^$1")
    .replace(/([0-9])\.0+(?=[^0-9]|$)/g, "$1");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseNumeric(value) {
  const clean = cleanAnswer(value)
    .replace(/^x=/, "")
    .replace(/^y=/, "")
    .replace(/^r=/, "")
    .replace(/%$/, "");
  const latexFrac = clean.match(/^\\frac([+-]?\d+(?:\.\d+)?)([+-]?\d+(?:\.\d+)?)$/);
  if (latexFrac) {
    const den = Number(latexFrac[2]);
    return den === 0 ? null : Number(latexFrac[1]) / den;
  }
  if (/^[+-]?\d+(\.\d+)?\/[+-]?\d+(\.\d+)?$/.test(clean)) {
    const [num, den] = clean.split("/").map(Number);
    return den === 0 ? null : num / den;
  }
  if (/^[+-]?\d+(\.\d+)?$/.test(clean)) {
    return Number(clean);
  }
  return null;
}

function parseList(value) {
  const clean = String(value).trim().replace(/[()[\]{}]/g, "");
  if (!clean) {
    return null;
  }
  const parts = clean.split(/[;,]/).map((part) => parseNumeric(part));
  return parts.every((part) => part !== null) ? parts : null;
}

function numericTolerance() {
  const mode = els.toleranceSelect.value;
  if (mode === "strict") {
    return 0.000001;
  }
  if (mode === "decimal") {
    return 0.005;
  }
  return 0.03;
}

function equivalentSymbolic(userAnswer, accepted) {
  const actual = cleanSymbolic(userAnswer);
  return accepted.map(cleanSymbolic).includes(actual);
}

function checkAnswer(question, userAnswer) {
  const expected = question.answer;
  if (!String(userAnswer).trim()) {
    return false;
  }
  if (question.kind === "text") {
    return equivalentSymbolic(userAnswer, expected.accepted);
  }
  if (question.kind === "list") {
    const actualList = parseList(userAnswer);
    if (!actualList || actualList.length !== expected.values.length) {
      return false;
    }
    if (expected.unordered) {
      const sortedActual = [...actualList].sort((a, b) => a - b);
      const sortedExpected = [...expected.values].sort((a, b) => a - b);
      return sortedActual.every((value, index) => Math.abs(value - sortedExpected[index]) <= numericTolerance());
    }
    return actualList.every((value, index) => Math.abs(value - expected.values[index]) <= numericTolerance());
  }
  const actual = parseNumeric(userAnswer);
  return actual !== null && Math.abs(actual - expected.value) <= numericTolerance();
}

function makeQuestion(subjectId, level, options) {
  return generators[subjectId](level, options);
}

function arithmeticQuestion(level, options) {
  const limit = [10, 25, 60, 120, 300, 600, 1200][level - 1] || 1200;
  let a = randInt(1, limit);
  let b = randInt(1, limit);
  if (options.allowNegatives && level >= 2 && Math.random() < 0.35) {
    a *= -1;
  }
  if (options.allowNegatives && level >= 2 && Math.random() < 0.25) {
    b *= -1;
  }
  const ops = level <= 1 ? ["+", "-"] : ["+", "-", "\\times", "\\div"];
  const op = choice(ops);
  if (op === "\\div") {
    const answer = randInt(2, Math.max(5, level * 5));
    b = randInt(2, Math.max(5, level * 5));
    a = answer * b;
  }
  const value = op === "+" ? a + b : op === "-" ? a - b : op === "\\times" ? a * b : a / b;
  return q("Arithmetic", `${a} ${op} ${b}`, { value }, formatNumber(value));
}

function placeValueQuestion() {
  const value = randInt(1000, 999999);
  const places = [
    ["nearest ten", 10],
    ["nearest hundred", 100],
    ["nearest thousand", 1000],
  ];
  const [label, place] = choice(places);
  const answer = Math.round(value / place) * place;
  return q("Place Value", `\\text{Round } ${value.toLocaleString()} \\text{ to the ${label}.}`, { value: answer }, String(answer));
}

function fractionQuestion(level, options) {
  const denMax = level <= 2 ? 9 : 18;
  let a = randInt(1, denMax);
  let b = randInt(2, denMax);
  let c = randInt(1, denMax);
  let d = randInt(2, denMax);
  if (options.allowNegatives && Math.random() < 0.3) {
    a *= -1;
  }
  const op = choice(["+", "-", "\\times", "\\div"]);
  const num = op === "+"
    ? a * d + c * b
    : op === "-"
      ? a * d - c * b
      : op === "\\times"
        ? a * c
        : a * d;
  const den = op === "\\div" ? b * c : b * d;
  const simple = simplifyFraction(num, den);
  return q(
    "Fractions",
    `${fractionLatex(a, b)} ${op} ${fractionLatex(c, d)}`,
    { value: simple.num / simple.den, displayLatex: fractionLatex(simple.num, simple.den) },
    fractionText(simple.num, simple.den),
  );
}

function decimalPercentQuestion() {
  const type = choice(["percent-of", "decimal-percent", "increase"]);
  if (type === "decimal-percent") {
    const value = randInt(5, 95) / 100;
    const percent = formatNumber(value * 100);
    return q("Decimals and Percents", `\\text{Write } ${value} \\text{ as a percent.}`, { value: value * 100, displayLatex: `${percent}\\%` }, `${percent}%`);
  }
  if (type === "increase") {
    const base = randInt(20, 200);
    const pct = choice([5, 10, 15, 20, 25, 30]);
    const answer = base * (1 + pct / 100);
    return q("Decimals and Percents", `${base} \\text{ increased by } ${pct}\\%`, { value: answer }, formatNumber(answer));
  }
  const pct = choice([5, 10, 12, 15, 20, 25, 30, 40, 50, 75]);
  const base = randInt(4, 40) * 5;
  return q("Decimals and Percents", `${pct}\\% \\text{ of } ${base}`, { value: (pct / 100) * base }, formatNumber((pct / 100) * base));
}

function numberTheoryQuestion() {
  const type = choice(["gcd", "lcm", "prime"]);
  if (type === "prime") {
    const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
    const composites = [21, 27, 33, 35, 39, 45, 49, 51, 57, 63];
    const n = Math.random() < 0.5 ? choice(primes) : choice(composites);
    const isPrime = primes.includes(n);
    return q("Number Theory", `\\text{Is } ${n} \\text{ prime? Enter yes or no.}`, { accepted: [isPrime ? "yes" : "no"] }, isPrime ? "yes" : "no", "text");
  }
  const a = randInt(8, 72);
  const b = randInt(8, 72);
  if (type === "lcm") {
    const value = Math.abs(a * b) / gcd(a, b);
    return q("Number Theory", `\\operatorname{lcm}(${a}, ${b})`, { value }, String(value));
  }
  const value = gcd(a, b);
  return q("Number Theory", `\\gcd(${a}, ${b})`, { value }, String(value));
}

function prealgebraQuestion() {
  const x = randInt(2, 12);
  const a = randInt(2, 9);
  const b = randInt(1, 20);
  return q("Pre-Algebra", `${a}x + ${b} = ${a * x + b}`, { value: x }, String(x));
}

function algebraQuestion(level) {
  const type = level >= 4 ? choice(["linear", "expand", "slope", "quadratic", "system", "factor"]) : choice(["linear", "expand", "slope"]);
  if (type === "linear") {
    const x = randInt(-8, 12);
    const a = choice([-5, -4, -3, -2, 2, 3, 4, 5]);
    const b = randInt(-15, 15);
    const c = a * x + b;
    return q("Algebra", `\\text{Solve for } x:\\quad ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`, { value: x }, `x = ${x}`);
  }
  if (type === "slope") {
    const x1 = randInt(-6, 6);
    const y1 = randInt(-6, 6);
    const x2 = x1 + choice([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const y2 = randInt(-6, 6);
    return q("Algebra", `\\text{Find the slope through } (${x1}, ${y1}) \\text{ and } (${x2}, ${y2}).`, { value: (y2 - y1) / (x2 - x1) }, fractionText(y2 - y1, x2 - x1));
  }
  if (type === "quadratic") {
    const r1 = randInt(-6, 6);
    const r2 = randInt(-6, 6);
    return q("Algebra", `\\text{If } (x-${r1})(x-${r2})=0, \\text{ enter both roots as } a,b.`, { values: [r1, r2], unordered: true }, `${r1}, ${r2}`, "list");
  }
  if (type === "system") {
    const x = randInt(-5, 7);
    const y = randInt(-5, 7);
    const a = randInt(1, 6);
    const b = randInt(1, 6);
    const c = randInt(1, 6);
    const d = randInt(1, 6);
    return q(
      "Algebra",
      `\\begin{cases}${a}x+${b}y=${a * x + b * y}\\\\${c}x+${d}y=${c * x + d * y}\\end{cases}\\quad \\text{Enter } x,y.`,
      { values: [x, y] },
      `${x}, ${y}`,
      "list",
    );
  }
  if (type === "factor") {
    const r1 = randInt(-7, 7);
    const r2 = randInt(-7, 7);
    const bTerm = -(r1 + r2);
    const cTerm = r1 * r2;
    return q("Algebra", `\\text{Roots of } x^2${bTerm >= 0 ? "+" : ""}${bTerm}x${cTerm >= 0 ? "+" : ""}${cTerm}=0.\\quad \\text{Enter } a,b.`, { values: [r1, r2], unordered: true }, `${r1}, ${r2}`, "list");
  }
  const a = randInt(2, 9);
  const b = randInt(-9, 9);
  const c = randInt(-9, 9);
  const total = b + c;
  const accepted = total === 0 ? [`${a}x`, `${a}x+0`] : [`${a}x${total >= 0 ? "+" : ""}${total}`];
  const display = total === 0 ? `${a}x` : `${a}x ${total >= 0 ? "+" : "-"} ${Math.abs(total)}`;
  return q("Algebra", `\\text{Simplify: } ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} ${c >= 0 ? "+" : "-"} ${Math.abs(c)}`, { accepted }, display, "text");
}

function inequalityQuestion() {
  const x = randInt(-8, 10);
  const a = choice([2, 3, 4, 5]);
  const b = randInt(-10, 10);
  const c = a * x + b;
  return q("Inequalities", `\\text{Solve the boundary value: } ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} < ${c}`, { value: x }, `x = ${x}`);
}

function exponentQuestion() {
  const type = choice(["power", "radical", "law"]);
  if (type === "radical") {
    const n = randInt(2, 12);
    return q("Exponents and Radicals", `\\sqrt{${n * n}}`, { value: n }, String(n));
  }
  if (type === "law") {
    const a = randInt(2, 8);
    const b = randInt(2, 8);
    return q("Exponents and Radicals", `\\text{Simplify: } x^${a}x^${b}`, { accepted: [`x^${a + b}`] }, `x^${a + b}`, "text");
  }
  const base = randInt(2, 9);
  const exp = randInt(2, 4);
  return q("Exponents and Radicals", `${base}^{${exp}}`, { value: base ** exp }, String(base ** exp));
}

function functionQuestion() {
  const a = randInt(2, 6);
  const b = randInt(-8, 8);
  const x = randInt(-5, 6);
  return q("Functions", `f(x)=${a}x${b >= 0 ? "+" : "-"}${Math.abs(b)},\\quad f(${x})=?`, { value: a * x + b }, String(a * x + b));
}

function geometryQuestion(level) {
  const type = choice(["area", "pythagorean", "circle", "volume"]);
  if (type === "pythagorean" || level >= 4) {
    const [a, b, c] = choice([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
    return q("Geometry", `\\text{Right triangle legs: } ${a}, ${b}.\\quad \\text{Hypotenuse?}`, { value: c }, String(c));
  }
  if (type === "circle") {
    const r = randInt(2, 12);
    return q("Geometry", `\\text{Using } \\pi=3.14,\\quad A=\\pi r^2,\\quad r=${r}`, { value: 3.14 * r * r }, formatNumber(3.14 * r * r));
  }
  if (type === "volume") {
    const l = randInt(2, 10);
    const w = randInt(2, 10);
    const h = randInt(2, 10);
    return q("Geometry", `\\text{Rectangular prism volume: } ${l}\\times ${w}\\times ${h}`, { value: l * w * h }, String(l * w * h));
  }
  const w = randInt(3, 30);
  const h = randInt(3, 30);
  return q("Geometry", `\\text{Rectangle area with width } ${w} \\text{ and height } ${h}`, { value: w * h }, String(w * h));
}

function coordinateQuestion() {
  const type = choice(["distance", "midpoint"]);
  const x1 = randInt(-6, 6);
  const y1 = randInt(-6, 6);
  const x2 = x1 + choice([-6, -4, -3, 3, 4, 6]);
  const y2 = y1 + choice([-6, -4, -3, 3, 4, 6]);
  if (type === "midpoint") {
    return q("Coordinate Geometry", `\\text{Midpoint of } (${x1},${y1}) \\text{ and } (${x2},${y2}). \\text{ Enter } x,y.`, { values: [(x1 + x2) / 2, (y1 + y2) / 2] }, `${fractionText(x1 + x2, 2)}, ${fractionText(y1 + y2, 2)}`, "list");
  }
  const value = Math.hypot(x2 - x1, y2 - y1);
  return q("Coordinate Geometry", `\\text{Distance between } (${x1},${y1}) \\text{ and } (${x2},${y2}).`, { value }, formatNumber(value));
}

function trigQuestion() {
  if (Math.random() < 0.35) {
    const angle = choice([
      [30, 1, 2],
      [45, Math.sqrt(2), 2],
      [60, Math.sqrt(3), 2],
    ]);
    const hyp = choice([6, 8, 10, 12]);
    const value = hyp * angle[1] / angle[2];
    return q("Trigonometry", `\\text{Right triangle: hypotenuse } ${hyp},\\ \\theta=${angle[0]}^\\circ.\\ \\text{Opposite side?}`, { value }, formatNumber(value));
  }
  const exact = [
    ["\\sin(30^\\circ)", 0.5, "\\frac{1}{2}", "1/2"],
    ["\\cos(60^\\circ)", 0.5, "\\frac{1}{2}", "1/2"],
    ["\\tan(45^\\circ)", 1, "1", "1"],
    ["\\sin(90^\\circ)", 1, "1", "1"],
    ["\\cos(0^\\circ)", 1, "1", "1"],
    ["\\sin(0^\\circ)", 0, "0", "0"],
  ];
  const [prompt, value, displayLatex, display] = choice(exact);
  return q("Trigonometry", prompt, { value, displayLatex }, display);
}

function statsQuestion() {
  const type = choice(["mean", "probability", "median", "range", "counting"]);
  if (type === "probability") {
    const good = randInt(1, 8);
    const total = good + randInt(2, 8);
    return q("Statistics and Probability", `\\text{Probability of success with } ${good} \\text{ favorable out of } ${total}?`, { value: good / total, displayLatex: fractionLatex(good, total) }, fractionText(good, total));
  }
  if (type === "median") {
    const nums = Array.from({ length: 5 }, () => randInt(1, 30)).sort((a, b) => a - b);
    return q("Statistics and Probability", `\\text{Median of } ${nums.join(", ")}`, { value: nums[2] }, String(nums[2]));
  }
  if (type === "range") {
    const nums = Array.from({ length: 6 }, () => randInt(1, 40));
    return q("Statistics and Probability", `\\text{Range of } ${nums.join(", ")}`, { value: Math.max(...nums) - Math.min(...nums) }, String(Math.max(...nums) - Math.min(...nums)));
  }
  if (type === "counting") {
    const a = randInt(2, 8);
    const b = randInt(2, 8);
    return q("Statistics and Probability", `\\text{A menu has } ${a} \\text{ mains and } ${b} \\text{ drinks. How many meal pairs?}`, { value: a * b }, String(a * b));
  }
  const nums = Array.from({ length: 5 }, () => randInt(2, 20));
  const sum = nums.reduce((a, b) => a + b, 0);
  return q("Statistics and Probability", `\\text{Mean of } ${nums.join(", ")}`, { value: sum / nums.length }, formatNumber(sum / nums.length));
}

function precalcQuestion() {
  const type = choice(["log", "composition", "inverse-linear", "exponential"]);
  if (type === "log") {
    const base = choice([2, 3, 4, 5]);
    const exp = randInt(2, 4);
    return q("Precalculus", `\\log_${base}(${base ** exp})`, { value: exp }, String(exp));
  }
  if (type === "inverse-linear") {
    const a = randInt(2, 8);
    const b = randInt(-9, 9);
    const y = randInt(-8, 12);
    return q("Precalculus", `f(x)=${a}x${b >= 0 ? "+" : "-"}${Math.abs(b)}.\\quad f^{-1}(${a * y + b})=?`, { value: y }, String(y));
  }
  if (type === "exponential") {
    const base = choice([2, 3, 4, 5]);
    const x = randInt(2, 5);
    return q("Precalculus", `f(x)=${base}^x.\\quad f(${x})=?`, { value: base ** x }, String(base ** x));
  }
  const a = randInt(2, 5);
  const b = randInt(-4, 4);
  const c = randInt(2, 5);
  const x = randInt(-3, 5);
  return q("Precalculus", `f(x)=${a}x${b >= 0 ? "+" : "-"}${Math.abs(b)},\\quad g(x)=${c}x.\\quad f(g(${x}))=?`, { value: a * c * x + b }, String(a * c * x + b));
}

function limitsQuestion() {
  const a = randInt(1, 6);
  const b = randInt(-8, 8);
  const c = randInt(-4, 4);
  return q("Limits", `\\lim_{x\\to ${c}} (${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)})`, { value: a * c + b }, String(a * c + b));
}

function calculusQuestion() {
  const type = choice(["power-derivative", "power-integral", "definite", "trig-derivative", "chain-derivative", "product-derivative"]);
  if (type === "power-integral") {
    const n = randInt(1, 6);
    const c = randInt(1, 8);
    const ans = `${fractionText(c, n + 1)}x^${n + 1}`;
    return q("Calculus", `\\int ${c}x^${n}\\,dx\\quad \\text{without } +C`, { accepted: [ans, `${c}/${n + 1}x^${n + 1}`] }, `${ans} + C`, "text");
  }
  if (type === "definite") {
    const n = randInt(1, 4);
    const upper = randInt(2, 5);
    const value = upper ** (n + 1) / (n + 1);
    return q("Calculus", `\\int_0^{${upper}} x^${n}\\,dx`, { value, displayLatex: fractionLatex(upper ** (n + 1), n + 1) }, fractionText(upper ** (n + 1), n + 1));
  }
  if (type === "trig-derivative") {
    const fn = choice([
      ["\\sin(x)", "\\cos(x)", "cos(x)"],
      ["\\cos(x)", "-\\sin(x)", "-sin(x)"],
      ["\\tan(x)", "\\sec^2(x)", "sec^2(x)"],
    ]);
    return q("Calculus", `\\frac{d}{dx}\\left(${fn[0]}\\right)`, { accepted: [fn[2], fn[1]] }, fn[2], "text");
  }
  if (type === "chain-derivative") {
    const a = randInt(2, 8);
    const b = randInt(-6, 6);
    const n = randInt(2, 5);
    const coeff = a * n;
    return q(
      "Calculus",
      `\\frac{d}{dx}\\left((${a}x${b >= 0 ? "+" : "-"}${Math.abs(b)})^${n}\\right)`,
      { accepted: [`${coeff}(${a}x${b >= 0 ? "+" : ""}${b})^${n - 1}`, `${coeff}(${a}x${b >= 0 ? "+" : "-"}${Math.abs(b)})^${n - 1}`] },
      `${coeff}(${a}x${b >= 0 ? "+" : "-"}${Math.abs(b)})^${n - 1}`,
      "text",
    );
  }
  if (type === "product-derivative") {
    const m = randInt(2, 5);
    const n = randInt(2, 5);
    const coeff = m + n;
    return q(
      "Calculus",
      `\\frac{d}{dx}\\left(x^${m}\\cdot x^${n}\\right)`,
      { accepted: [`${coeff}x^${coeff - 1}`] },
      `${coeff}x^${coeff - 1}`,
      "text",
    );
  }
  const n = randInt(2, 8);
  const c = randInt(1, 9);
  const power = n - 1;
  const accepted = power === 1 ? [`${c * n}x`, `${c * n}x^1`] : [`${c * n}x^${power}`];
  const display = power === 1 ? `${c * n}x` : `${c * n}x^${power}`;
  return q("Calculus", `\\frac{d}{dx}\\left(${c}x^${n}\\right)`, { accepted }, display, "text");
}

function sequenceQuestion() {
  const a1 = randInt(1, 12);
  const d = randInt(2, 8);
  const n = randInt(5, 12);
  return q("Sequences and Series", `a_1=${a1},\\ d=${d}.\\quad a_${n}=?`, { value: a1 + (n - 1) * d }, String(a1 + (n - 1) * d));
}

function complexQuestion() {
  const a = randInt(-8, 8);
  const b = randInt(-8, 8);
  const c = randInt(-8, 8);
  const d = randInt(-8, 8);
  return q("Complex Numbers", `(${a}${b >= 0 ? "+" : "-"}${Math.abs(b)}i)+(${c}${d >= 0 ? "+" : "-"}${Math.abs(d)}i).\\quad \\text{Enter } a,b \\text{ for } a+bi.`, { values: [a + c, b + d] }, `${a + c}, ${b + d}`, "list");
}

function linearQuestion() {
  const type = choice(["dot", "det2", "matrix-vector", "matrix-add"]);
  if (type === "det2") {
    const a = randInt(-5, 7);
    const b = randInt(-5, 7);
    const c = randInt(-5, 7);
    const d = randInt(-5, 7);
    return q("Linear Algebra", `\\det\\begin{bmatrix}${a}&${b}\\\\${c}&${d}\\end{bmatrix}`, { value: a * d - b * c }, String(a * d - b * c));
  }
  if (type === "matrix-vector") {
    const a = randInt(-4, 5);
    const b = randInt(-4, 5);
    const c = randInt(-4, 5);
    const d = randInt(-4, 5);
    const x = randInt(-4, 5);
    const y = randInt(-4, 5);
    return q("Linear Algebra", `\\begin{bmatrix}${a}&${b}\\\\${c}&${d}\\end{bmatrix}\\begin{bmatrix}${x}\\\\${y}\\end{bmatrix}\\quad \\text{Enter } a,b.`, { values: [a * x + b * y, c * x + d * y] }, `${a * x + b * y}, ${c * x + d * y}`, "list");
  }
  if (type === "matrix-add") {
    const a = randInt(-5, 7);
    const b = randInt(-5, 7);
    const c = randInt(-5, 7);
    const d = randInt(-5, 7);
    const e = randInt(-5, 7);
    const f = randInt(-5, 7);
    const g = randInt(-5, 7);
    const h = randInt(-5, 7);
    const values = [a + e, b + f, c + g, d + h];
    const displayLatex = `\\begin{bmatrix}${values[0]}&${values[1]}\\\\${values[2]}&${values[3]}\\end{bmatrix}`;
    return q(
      "Linear Algebra",
      `\\begin{bmatrix}${a}&${b}\\\\${c}&${d}\\end{bmatrix}+\\begin{bmatrix}${e}&${f}\\\\${g}&${h}\\end{bmatrix}\\quad \\text{Enter rows as } a,b;c,d.`,
      { values, displayLatex },
      `${values[0]},${values[1]};${values[2]},${values[3]}`,
      "list",
    );
  }
  const v = [randInt(-6, 6), randInt(-6, 6), randInt(-6, 6)];
  const w = [randInt(-6, 6), randInt(-6, 6), randInt(-6, 6)];
  const value = v.reduce((sum, item, index) => sum + item * w[index], 0);
  return q("Linear Algebra", `(${v.join(", ")})\\cdot(${w.join(", ")})`, { value }, String(value));
}

function differentialEquationQuestion() {
  const k = randInt(2, 8);
  return q("Differential Equations", `\\text{If } y'= ${k}y, \\text{ what is } y'/y?`, { value: k }, String(k));
}

function multivariableQuestion() {
  const type = choice(["partial", "gradient", "directional"]);
  const a = randInt(1, 7);
  const b = randInt(1, 7);
  if (type === "gradient") {
    const x = randInt(-3, 4);
    const y = randInt(-3, 4);
    return q("Multivariable Calculus", `f(x,y)=${a}x^2+${b}y^2.\\quad \\nabla f(${x},${y})=?\\quad \\text{Enter } a,b.`, { values: [2 * a * x, 2 * b * y] }, `${2 * a * x}, ${2 * b * y}`, "list");
  }
  if (type === "directional") {
    const x = randInt(1, 4);
    const y = randInt(1, 4);
    return q("Multivariable Calculus", `f(x,y)=xy.\\quad D_{(1/\\sqrt2,1/\\sqrt2)}f(${x},${y})`, { value: (x + y) / Math.sqrt(2) }, formatNumber((x + y) / Math.sqrt(2)));
  }
  const dx = choice(["x", "y"]);
  const display = dx === "x"
    ? `${a * 2}xy^${b}`
    : b - 1 === 0
      ? `${a * b}x^2`
      : b - 1 === 1
        ? `${a * b}x^2y`
        : `${a * b}x^2y^${b - 1}`;
  return q("Multivariable Calculus", `\\frac{\\partial}{\\partial ${dx}}\\left(${a}x^2y^${b}\\right)`, { accepted: [display] }, display, "text");
}

function selectedSubjects() {
  return Array.from(els.subjectList.querySelectorAll("input:checked")).map((input) => input.value);
}

function currentOptions() {
  return {
    level: Number(els.levelSelect.value),
    count: Number(els.questionCountInput.value),
    timerMode: els.timerModeSelect.value,
    seconds: Number(els.secondsInput.value),
    allowFractions: els.allowFractionsInput.checked,
    allowNegatives: els.allowNegativesInput.checked,
  };
}

function eligibleSubjects(options) {
  const selected = selectedSubjects();
  return subjects
    .filter((subject) => selected.includes(subject.id))
    .filter((subject) => subject.minLevel <= options.level)
    .map((subject) => subject.id);
}

function buildQuestions() {
  const options = currentOptions();
  const pool = eligibleSubjects(options);
  const usablePool = pool.length ? pool : ["arithmetic"];
  const seen = new Set();
  const questions = [];
  while (questions.length < options.count) {
    let next = null;
    for (let attempt = 0; attempt < 18; attempt += 1) {
      const subjectId = choice(usablePool);
      const candidate = makeQuestion(subjectId, options.level, options);
      if (!seen.has(candidate.latex)) {
        next = candidate;
        break;
      }
    }
    if (!next) {
      const subjectId = choice(usablePool);
      next = makeQuestion(subjectId, options.level, options);
    }
    seen.add(next.latex);
    questions.push(next);
  }
  return questions;
}

function renderSubjects() {
  els.subjectList.innerHTML = "";
  subjects.forEach((subject) => {
    const label = document.createElement("label");
    label.className = "toggle-row";
    label.innerHTML = `
      <input type="checkbox" value="${subject.id}" checked>
      ${subject.label}
      <small>Level ${subject.minLevel}+</small>
    `;
    els.subjectList.appendChild(label);
  });
}

function setAllSubjects(checked) {
  els.subjectList.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = checked;
  });
  saveSettings();
}

function collectSettings() {
  return {
    subjects: selectedSubjects(),
    level: els.levelSelect.value,
    questionCount: els.questionCountInput.value,
    timerMode: els.timerModeSelect.value,
    seconds: els.secondsInput.value,
    tolerance: els.toleranceSelect.value,
    allowFractions: els.allowFractionsInput.checked,
    allowNegatives: els.allowNegativesInput.checked,
    instantFeedback: els.instantFeedbackInput.checked,
  };
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(collectSettings()));
  } catch (error) {
    // Settings persistence is a convenience; the quiz should keep working without storage.
  }
}

function restoreSettings() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
  } catch (error) {
    saved = null;
  }
  if (!saved) {
    return;
  }
  const subjectSet = new Set(saved.subjects || []);
  els.subjectList.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = subjectSet.has(input.value);
  });
  if (saved.level) els.levelSelect.value = saved.level;
  if (saved.questionCount) els.questionCountInput.value = saved.questionCount;
  if (saved.timerMode) els.timerModeSelect.value = saved.timerMode;
  if (saved.seconds) els.secondsInput.value = saved.seconds;
  if (saved.tolerance) els.toleranceSelect.value = saved.tolerance;
  if (typeof saved.allowFractions === "boolean") els.allowFractionsInput.checked = saved.allowFractions;
  if (typeof saved.allowNegatives === "boolean") els.allowNegativesInput.checked = saved.allowNegatives;
  if (typeof saved.instantFeedback === "boolean") els.instantFeedbackInput.checked = saved.instantFeedback;
}

function setupSettingsPersistence() {
  [
    els.levelSelect,
    els.questionCountInput,
    els.timerModeSelect,
    els.secondsInput,
    els.toleranceSelect,
    els.allowFractionsInput,
    els.allowNegativesInput,
    els.instantFeedbackInput,
    els.subjectList,
  ].forEach((input) => {
    input.addEventListener("change", saveSettings);
  });
}

function inputToLatex(value) {
  const raw = String(value).trim();
  if (!raw) {
    return "\\text{ }";
  }
  if (raw.includes(";")) {
    const rows = raw
      .split(";")
      .map((row) => row.split(",").map((part) => inputToLatex(part)).join(" & "))
      .join(" \\\\ ");
    return `\\begin{bmatrix}${rows}\\end{bmatrix}`;
  }
  const list = raw.split(",");
  if (list.length > 1) {
    return `\\left(${list.map((part) => inputToLatex(part)).join(", ")}\\right)`;
  }
  const clean = raw.replace(/\s+/g, "");
  const fraction = splitTopLevel(clean, "/");
  if (fraction) {
    return `\\frac{${inputToLatex(fraction[0])}}{${inputToLatex(fraction[1])}}`;
  }
  return clean
    .replace(/\*/g, "\\cdot ")
    .replace(/sqrt\(([^)]+)\)/gi, "\\sqrt{$1}")
    .replace(/sqrt([a-z0-9]+)/gi, "\\sqrt{$1}")
    .replace(/\^(-?\d+|[a-z])/gi, "^{$1}");
}

function splitTopLevel(value, operator) {
  let depth = 0;
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;
    } else if (char === operator && depth === 0) {
      return [value.slice(0, i), value.slice(i + 1)];
    }
  }
  return null;
}

function typesetMath(...nodes) {
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise(nodes).catch(() => {});
  }
}

function renderAnswerPreview() {
  const latex = inputToLatex(els.answerInput.value);
  els.answerPreview.innerHTML = `\\(${latex}\\)`;
  typesetMath(els.answerPreview);
}

function startQuiz() {
  if (!selectedSubjects().length) {
    els.startState.hidden = false;
    els.summaryCard.hidden = true;
    els.questionCard.hidden = true;
    els.startState.querySelector("p").textContent = "Select at least one subject before starting.";
    return;
  }
  els.startState.querySelector("p").textContent = DEFAULT_START_COPY;
  stopTimer();
  clearTimeout(state.autoAdvanceId);
  state.active = true;
  state.questions = buildQuestions();
  state.currentIndex = 0;
  state.correct = 0;
  state.answered = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.review = [];
  state.startedAt = Date.now();
  state.questionStartedAt = Date.now();
  state.answeredCurrent = false;
  els.startState.hidden = true;
  els.summaryCard.hidden = true;
  els.questionCard.hidden = false;
  showQuestion();
  startTimer();
}

function showQuestion() {
  const question = state.questions[state.currentIndex];
  clearTimeout(state.autoAdvanceId);
  state.answeredCurrent = false;
  state.questionStartedAt = Date.now();
  els.feedback.hidden = true;
  els.feedback.textContent = "";
  els.explanationBox.hidden = true;
  els.explanationBox.innerHTML = "";
  els.nextBtn.hidden = true;
  els.answerInput.disabled = false;
  els.submitBtn.disabled = false;
  els.submitBtn.textContent = "Check";
  els.answerInput.value = "";
  els.questionNumber.textContent = `Question ${state.currentIndex + 1} of ${state.questions.length}`;
  els.topicLabel.textContent = question.topic;
  els.questionText.innerHTML = `\\[${question.latex}\\]`;
  renderAnswerPreview();
  typesetMath(els.questionText);
  els.answerInput.focus();
  updateStatus();
}

function explanationFor(question) {
  if (question.explanation) {
    return question.explanation;
  }
  const topicHelp = {
    "Linear Algebra": "For matrix addition, add matching entries. For a matrix-vector product, multiply each row by the vector. For determinants of a 2 by 2 matrix, use \\(ad-bc\\).",
    "Calculus": "Use the power rule: \\(\\frac{d}{dx}x^n=nx^{n-1}\\), and \\(\\int x^n dx=\\frac{x^{n+1}}{n+1}\\) when \\(n\\ne -1\\).",
    "Multivariable Calculus": "For partial derivatives, treat every other variable as a constant. For gradients, compute each partial derivative and then plug in the point.",
    "Fractions": "Use a common denominator for addition or subtraction. For multiplication, multiply numerators and denominators, then simplify.",
    "Coordinate Geometry": "For midpoints, average the x-values and y-values separately. For distance, use the Pythagorean distance formula.",
    "Trigonometry": "Use the standard exact-angle values for 0, 30, 45, 60, and 90 degrees.",
  };
  const prefix = topicHelp[question.topic] ? `${topicHelp[question.topic]} ` : "";
  if (question.kind === "list") {
    return `${prefix}This answer has multiple entries. Enter them in order as \\(${question.displayLatex}\\). For vectors or points, use commas like \\(2,-5\\). For matrices, use semicolons between rows, like \\(1,2;3,4\\).`;
  }
  if (question.kind === "text") {
    return `${prefix}Simplify the expression using the rule shown in the problem, then type the result in compact form. Here the expected result is \\(${question.displayLatex}\\). Powers can be typed with ^, for example \\(x^2\\).`;
  }
  return `${prefix}Work the arithmetic or formula in the prompt and simplify. The answer is \\(${question.displayLatex}\\). Fractions like \\(\\frac{3}{4}\\) can be typed as 3/4.`;
}

function showExplanation() {
  const question = state.questions[state.currentIndex];
  if (!question) {
    return;
  }
  els.explanationBox.hidden = false;
  els.explanationBox.innerHTML = explanationFor(question);
  typesetMath(els.explanationBox);
}

function submitAnswer(event, auto = false) {
  event.preventDefault();
  if (!state.active || state.answeredCurrent) {
    return;
  }
  const question = state.questions[state.currentIndex];
  const userAnswer = els.answerInput.value;
  const isCorrect = checkAnswer(question, userAnswer);
  if (auto && !isCorrect) {
    return;
  }
  recordAnswer(isCorrect, userAnswer);
}

function recordAnswer(isCorrect, userAnswer) {
  const question = state.questions[state.currentIndex];
  const elapsed = (Date.now() - state.questionStartedAt) / 1000;
  state.answered += 1;
  state.correct += isCorrect ? 1 : 0;
  state.streak = isCorrect ? state.streak + 1 : 0;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  state.answeredCurrent = true;
  state.review.push({
    latex: question.latex,
    prompt: question.plain,
    topic: question.topic,
    userAnswer,
    correctAnswer: question.displayAnswer,
    correctLatex: question.displayLatex,
    isCorrect,
    seconds: elapsed,
  });
  if (els.instantFeedbackInput.checked || isCorrect) {
    els.feedback.hidden = false;
    els.feedback.className = `feedback ${isCorrect ? "is-correct" : "is-wrong"}`;
    els.feedback.innerHTML = isCorrect ? "Correct. Moving on..." : `Not quite. Answer: \\(${question.displayLatex}\\)`;
    typesetMath(els.feedback);
  }
  els.answerInput.disabled = true;
  els.submitBtn.disabled = true;
  els.nextBtn.hidden = false;
  updateStatus();
  if (isCorrect) {
    state.autoAdvanceId = setTimeout(nextQuestion, 650);
  }
}

function liveCheckAnswer() {
  renderAnswerPreview();
  clearTimeout(state.inputCheckId);
  if (!state.active || state.answeredCurrent) {
    return;
  }
  state.inputCheckId = setTimeout(() => {
    const question = state.questions[state.currentIndex];
    if (checkAnswer(question, els.answerInput.value)) {
      submitAnswer(new Event("submit"), true);
    }
  }, 220);
}

function nextQuestion() {
  if (state.currentIndex >= state.questions.length - 1) {
    finishQuiz();
    return;
  }
  state.currentIndex += 1;
  showQuestion();
}

function finishQuiz() {
  stopTimer();
  clearTimeout(state.autoAdvanceId);
  state.active = false;
  els.questionCard.hidden = true;
  els.summaryCard.hidden = false;
  const totalSeconds = Math.round((Date.now() - state.startedAt) / 1000);
  const percent = state.questions.length ? Math.round((state.correct / state.questions.length) * 100) : 0;
  els.summaryStats.innerHTML = `
    <span><strong>${state.correct}/${state.questions.length}</strong> Correct</span>
    <span><strong>${percent}%</strong> Accuracy</span>
    <span><strong>${formatTimer(totalSeconds)}</strong> Time</span>
    <span><strong>${state.bestStreak}</strong> Best streak</span>
  `;
  renderReview();
  updateStatus();
}

function renderReview() {
  els.reviewList.innerHTML = "";
  state.review.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = `review-row ${item.isCorrect ? "is-correct" : "is-wrong"}`;
    row.innerHTML = `
      <span>${index + 1}</span>
      <div>
        <strong>\\(${item.latex}\\)</strong>
        <p>Your answer: ${escapeHtml(item.userAnswer || "(blank)")} | Correct: \\(${item.correctLatex}\\)</p>
      </div>
      <em>${Math.round(item.seconds)}s</em>
    `;
    els.reviewList.appendChild(row);
  });
  typesetMath(els.reviewList);
}

function resetQuiz() {
  stopTimer();
  clearTimeout(state.autoAdvanceId);
  clearTimeout(state.inputCheckId);
  state.active = false;
  state.questions = [];
  state.currentIndex = 0;
  state.correct = 0;
  state.answered = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.review = [];
  els.questionCard.hidden = true;
  els.summaryCard.hidden = true;
  els.startState.hidden = false;
  els.timerReadout.textContent = "00:00";
  els.startState.querySelector("p").textContent = DEFAULT_START_COPY;
  updateStatus();
}

function formatTimer(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function timerRemaining() {
  const options = currentOptions();
  if (options.timerMode === "elapsed") {
    return null;
  }
  const started = options.timerMode === "per-question" ? state.questionStartedAt : state.startedAt;
  const elapsed = Math.floor((Date.now() - started) / 1000);
  return options.seconds - elapsed;
}

function tickTimer() {
  if (!state.active) {
    return;
  }
  const options = currentOptions();
  if (options.timerMode === "elapsed") {
    els.timerReadout.textContent = formatTimer(Math.floor((Date.now() - state.startedAt) / 1000));
    return;
  }
  const remaining = timerRemaining();
  els.timerReadout.textContent = formatTimer(Math.max(0, remaining));
  if (remaining <= 0) {
    if (options.timerMode === "per-question") {
      if (!state.answeredCurrent) {
        recordAnswer(false, els.answerInput.value);
      }
      nextQuestion();
    } else {
      finishQuiz();
    }
  }
}

function startTimer() {
  tickTimer();
  state.timerId = setInterval(tickTimer, 250);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateStatus() {
  els.scoreReadout.textContent = `${state.correct}/${state.answered}`;
  els.streakReadout.textContent = String(state.streak);
}

els.startBtn.addEventListener("click", startQuiz);
els.resetBtn.addEventListener("click", resetQuiz);
els.restartBtn.addEventListener("click", startQuiz);
els.answerForm.addEventListener("submit", submitAnswer);
els.answerInput.addEventListener("input", liveCheckAnswer);
els.explainBtn.addEventListener("click", showExplanation);
els.checkAllBtn.addEventListener("click", () => setAllSubjects(true));
els.uncheckAllBtn.addEventListener("click", () => setAllSubjects(false));
els.nextBtn.addEventListener("click", nextQuestion);

renderSubjects();
restoreSettings();
setupSettingsPersistence();
renderAnswerPreview();
updateStatus();
