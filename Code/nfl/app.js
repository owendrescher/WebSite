// The web host sends CORS headers when this dashboard is opened directly from disk.
const API_BASE = 'https://site.web.api.espn.com/apis/site/v2/sports/football/nfl';
const CORE_BASE = 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl';
const STORAGE_PREFIX = 'nfl-game-center:v1';
const nflAthleteProfileCache = new Map();
const nflverseRosterCache = new Map();
const nflversePlayerEvidenceCache = new Map();
const playerSchemeProfileCache = new Map();
const RUN_DEFENSE_2025 = [{"team":"JAX","games":17,"yards":1455,"ypg":85.6,"rank":1},{"team":"DEN","games":17,"yards":1548,"ypg":91.1,"rank":2},{"team":"SEA","games":17,"yards":1563,"ypg":91.9,"rank":3},{"team":"HOU","games":17,"yards":1593,"ypg":93.7,"rank":4},{"team":"TB","games":17,"yards":1684,"ypg":99.1,"rank":5},{"team":"NE","games":17,"yards":1729,"ypg":101.7,"rank":6},{"team":"IND","games":17,"yards":1732,"ypg":101.9,"rank":7},{"team":"LAC","games":17,"yards":1791,"ypg":105.4,"rank":8},{"team":"KC","games":17,"yards":1797,"ypg":105.7,"rank":9},{"team":"BAL","games":17,"yards":1813,"ypg":106.6,"rank":10},{"team":"SF","games":17,"yards":1833,"ypg":107.8,"rank":11},{"team":"LA","games":17,"yards":1884,"ypg":110.8,"rank":12},{"team":"PIT","games":17,"yards":1922,"ypg":113.1,"rank":13},{"team":"DET","games":17,"yards":1947,"ypg":114.5,"rank":14},{"team":"TEN","games":17,"yards":1948,"ypg":114.6,"rank":15},{"team":"CLE","games":17,"yards":1979,"ypg":116.4,"rank":16},{"team":"LV","games":17,"yards":1986,"ypg":116.8,"rank":17},{"team":"GB","games":17,"yards":2001,"ypg":117.7,"rank":18},{"team":"NO","games":17,"yards":2050,"ypg":120.6,"rank":19},{"team":"CAR","games":17,"yards":2096,"ypg":123.3,"rank":20},{"team":"MIN","games":17,"yards":2110,"ypg":124.1,"rank":21},{"team":"PHI","games":17,"yards":2115,"ypg":124.4,"rank":22},{"team":"DAL","games":17,"yards":2133,"ypg":125.5,"rank":23},{"team":"ATL","games":17,"yards":2146,"ypg":126.2,"rank":24},{"team":"ARI","games":17,"yards":2158,"ypg":126.9,"rank":25},{"team":"MIA","games":17,"yards":2251,"ypg":132.4,"rank":26},{"team":"CHI","games":17,"yards":2287,"ypg":134.5,"rank":27},{"team":"BUF","games":17,"yards":2315,"ypg":136.2,"rank":28},{"team":"NYJ","games":17,"yards":2371,"ypg":139.5,"rank":29},{"team":"WAS","games":17,"yards":2406,"ypg":141.5,"rank":30},{"team":"NYG","games":17,"yards":2470,"ypg":145.3,"rank":31},{"team":"CIN","games":17,"yards":2500,"ypg":147.1,"rank":32}];

// Opening-2025 baseline. Game-day callers change more often than titles, so every value is editable.
const STAFF_BASELINE_2025 = {
  ARI: ['Drew Petzing', 'Nick Rallis'], ATL: ['Zac Robinson', 'Jeff Ulbrich'], BAL: ['Todd Monken', 'Zach Orr'], BUF: ['Joe Brady', 'Sean McDermott'],
  CAR: ['Dave Canales', 'Ejiro Evero'], CHI: ['Ben Johnson', 'Dennis Allen'], CIN: ['Zac Taylor', 'Al Golden'], CLE: ['Kevin Stefanski', 'Jim Schwartz'],
  DAL: ['Brian Schottenheimer', 'Matt Eberflus'], DEN: ['Sean Payton', 'Vance Joseph'], DET: ['John Morton', 'Kelvin Sheppard'], GB: ['Matt LaFleur', 'Jeff Hafley'],
  HOU: ['Nick Caley', 'DeMeco Ryans'], IND: ['Shane Steichen', 'Lou Anarumo'], JAX: ['Liam Coen', 'Anthony Campanile'], KC: ['Andy Reid', 'Steve Spagnuolo'],
  LV: ['Chip Kelly', 'Patrick Graham'], LAC: ['Greg Roman', 'Jesse Minter'], LA: ['Sean McVay', 'Chris Shula'], MIA: ['Mike McDaniel', 'Anthony Weaver'],
  MIN: ['Kevin O’Connell', 'Brian Flores'], NE: ['Josh McDaniels', 'Mike Vrabel / staff'], NO: ['Kellen Moore', 'Brandon Staley'], NYG: ['Brian Daboll', 'Shane Bowen'],
  NYJ: ['Tanner Engstrand', 'Steve Wilks'], PHI: ['Kevin Patullo', 'Vic Fangio'], PIT: ['Arthur Smith', 'Teryl Austin'], SF: ['Kyle Shanahan', 'Robert Saleh'],
  SEA: ['Klint Kubiak', 'Mike Macdonald'], TB: ['Josh Grizzard', 'Todd Bowles'], TEN: ['Brian Callahan', 'Dennard Wilson'], WAS: ['Kliff Kingsbury', 'Joe Whitt Jr.'],
};
// Active 2026 game-day callers. Titles are intentionally secondary to the person expected to call the game.
const STAFF_BASELINE_2026 = {
  ...STAFF_BASELINE_2025,
  ARI: ['Mike LaFleur', 'Nick Rallis'], ATL: ['Tommy Rees', 'Jeff Ulbrich'], BAL: ['Declan Doyle', 'Anthony Weaver'], BUF: ['Joe Brady', 'Jim Leonhard'],
  CLE: ['Todd Monken', 'Mike Rutenberg'], DEN: ['Davis Webb', 'Vance Joseph'], LV: ['Klint Kubiak', 'Rob Leonard'], MIA: ['Bobby Slowik', 'Jeff Hafley'],
  NE: ['Josh McDaniels', 'Zak Kuhr'], NYG: ['Matt Nagy', 'Dennard Wilson'], PIT: ['Mike McCarthy', 'Patrick Graham'], SEA: ['Brian Fleury', 'Mike Macdonald / Aden Durde'],
  TEN: ['Brian Daboll', 'Gus Bradley'], WAS: ['David Blough', 'Daronte Jones'],
};
const CALLER_TRANSFERS_2026 = {
  mikelafleur: { side: 'offense', sourceTeam: 'LA', weight: .45, note: 'Rams coaching-tree prior' },
  tommyrees: { side: 'offense', sourceTeam: 'CLE', weight: .65, note: 'Browns play-calling prior' },
  declandoyle: { side: 'offense', sourceTeam: 'CHI', weight: .45, note: 'Bears coaching-tree prior' },
  anthonyweaver: { side: 'defense', sourceTeam: 'MIA', weight: .65, note: 'Dolphins defensive prior' },
  toddmonken: { side: 'offense', sourceTeam: 'BAL', weight: .65, note: 'Ravens play-calling prior' },
  mikerutenberg: { side: 'defense', sourceTeam: 'ATL', weight: .45, note: 'Falcons coaching-tree prior' },
  jimleonhard: { side: 'defense', sourceTeam: 'DEN', weight: .45, note: 'Broncos coaching-tree prior' },
  klintkubiak: { side: 'offense', sourceTeam: 'SEA', weight: .65, note: 'Seahawks play-calling prior' },
  bobbyslowik: { side: 'offense', sourceTeam: 'HOU', sourceSeason: 2024, weight: .65, note: '2024 Texans play-calling prior' },
  jeffhafley: { side: 'defense', sourceTeam: 'GB', weight: .65, note: 'Packers defensive prior' },
  mattnagy: { side: 'offense', sourceTeam: 'KC', weight: .45, note: 'Chiefs coaching-tree prior' },
  dennardwilson: { side: 'defense', sourceTeam: 'TEN', weight: .65, note: 'Titans defensive prior' },
  mikemccarthy: { side: 'offense', sourceTeam: 'DAL', sourceSeason: 2024, weight: .65, note: '2024 Cowboys play-calling prior' },
  patrickgraham: { side: 'defense', sourceTeam: 'LV', weight: .65, note: 'Raiders defensive prior' },
  brianfleury: { side: 'offense', sourceTeam: 'SF', weight: .45, note: '49ers coaching-tree prior' },
  briandaboll: { side: 'offense', sourceTeam: 'NYG', weight: .65, note: 'Giants play-calling prior' },
  gusbradley: { side: 'defense', sourceTeam: 'SF', weight: .45, note: '49ers coaching-tree prior' },
  darontejones: { side: 'defense', sourceTeam: 'MIN', weight: .45, note: 'Vikings coaching-tree prior' },
};
const NFL_TEAM_COLORS = {
  ARI: ['#97233F','#101820','#FFB612'], ATL: ['#A71930','#101820','#A5ACAF'], BAL: ['#241773','#101820','#9E7C0C'], BUF: ['#00338D','#C60C30','#FFFFFF'],
  CAR: ['#0085CA','#101820','#BFC0BF'], CHI: ['#0B162A','#C83803','#FFFFFF'], CIN: ['#FB4F14','#101820','#FFFFFF'], CLE: ['#311D00','#FF3C00','#FFFFFF'],
  DAL: ['#003594','#041E42','#869397'], DEN: ['#FB4F14','#002244','#FFFFFF'], DET: ['#0076B6','#B0B7BC','#FFFFFF'], GB: ['#203731','#FFB612','#FFFFFF'],
  HOU: ['#03202F','#A71930','#FFFFFF'], IND: ['#002C5F','#A2AAAD','#FFFFFF'], JAX: ['#006778','#101820','#D7A22A'], KC: ['#E31837','#FFB81C','#FFFFFF'],
  LV: ['#101820','#A5ACAF','#FFFFFF'], LAC: ['#0080C6','#FFC20E','#FFFFFF'], LA: ['#003594','#FFA300','#FFCD00'], MIA: ['#008E97','#FC4C02','#005778'],
  MIN: ['#4F2683','#FFC62F','#FFFFFF'], NE: ['#002244','#C60C30','#B0B7BC'], NO: ['#D3BC8D','#101820','#FFFFFF'], NYG: ['#0B2265','#A71930','#A5ACAF'],
  NYJ: ['#125740','#101820','#FFFFFF'], PHI: ['#004C54','#A5ACAF','#101820'], PIT: ['#FFB612','#101820','#A5ACAF'], SF: ['#AA0000','#B3995D','#FFFFFF'],
  SEA: ['#002244','#69BE28','#A5ACAF'], TB: ['#D50A0A','#34302B','#FF7900'], TEN: ['#0C2340','#4B92DB','#C8102E'], WAS: ['#5A1414','#FFB612','#FFFFFF'],
};
const NFL_WEEK_ONE_STARTS = { 2026: '2026-09-09' };
const forecastSummaryCache = new Map();
const participationCache = new Map();
const callerTransferCache = new Map();
const historicalTransferGamesCache = new Map();
const matchupPersonnelCache = new Map();
let slateForecastPrimeToken = 0;

const els = {
  slateLabel: document.getElementById('slateLabel'),
  statusBar: document.getElementById('statusBar'),
  dateInput: document.getElementById('dateInput'),
  weekPickerBtn: document.getElementById('weekPickerBtn'),
  weekPhaseLabel: document.getElementById('weekPhaseLabel'),
  weekNameLabel: document.getElementById('weekNameLabel'),
  weekDatesLabel: document.getElementById('weekDatesLabel'),
  prevWeekBtn: document.getElementById('prevWeekBtn'),
  nextWeekBtn: document.getElementById('nextWeekBtn'),
  prevDayBtn: document.getElementById('prevDayBtn'),
  nextDayBtn: document.getElementById('nextDayBtn'),
  todayBtn: document.getElementById('todayBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  refreshTdBtn: document.getElementById('refreshTdBtn'),
  gamesGrid: document.getElementById('gamesGrid'),
  gameTemplate: document.getElementById('gameCardTemplate'),
  forecastGameSelect: document.getElementById('forecastGameSelect'),
  forecastSampleSize: document.getElementById('forecastSampleSize'),
  forecastAnalyzeBtn: document.getElementById('forecastAnalyzeBtn'),
  forecastStatus: document.getElementById('forecastStatus'),
  forecastHero: document.getElementById('forecastHero'),
  forecastLikely: document.getElementById('forecastLikely'),
  forecastTendencies: document.getElementById('forecastTendencies'),
  forecastUnits: document.getElementById('forecastUnits'),
  forecastCoverage: document.getElementById('forecastCoverage'),
  forecastCoaches: document.getElementById('forecastCoaches'),
  teamsTableWrap: document.getElementById('teamsTableWrap'),
  divisionToggle: document.getElementById('divisionToggle'),
  leadersGrid: document.getElementById('leadersGrid'),
  leaderSeasonType: document.getElementById('leaderSeasonType'),
  matchupGameSelect: document.getElementById('matchupGameSelect'),
  matchupWindow: document.getElementById('matchupWindow'),
  matchupSummary: document.getElementById('matchupSummary'),
  matchupBoard: document.getElementById('matchupBoard'),
  coverageDataStatus: document.getElementById('coverageDataStatus'),
  coverageImport: document.getElementById('coverageImport'),
  coverageExportBtn: document.getElementById('coverageExportBtn'),
  coverageTemplateBtn: document.getElementById('coverageTemplateBtn'),
  coverageClearBtn: document.getElementById('coverageClearBtn'),
  propForm: document.getElementById('propForm'),
  propSelection: document.getElementById('propSelection'),
  propMarket: document.getElementById('propMarket'),
  propTarget: document.getElementById('propTarget'),
  propOdds: document.getElementById('propOdds'),
  propOptions: document.getElementById('propOptions'),
  watchList: document.getElementById('watchList'),
  betSlip: document.getElementById('betSlip'),
  clearSlipBtn: document.getElementById('clearSlipBtn'),
  slateNotes: document.getElementById('slateNotes'),
  touchdownFeed: document.getElementById('touchdownFeed'),
  gameDialog: document.getElementById('gameDialog'),
  gameDialogBody: document.getElementById('gameDialogBody'),
  playerDialog: document.getElementById('playerDialog'),
  playerDialogBody: document.getElementById('playerDialogBody'),
};

const state = {
  page: new URLSearchParams(window.location.search).get('page') || localStorage.getItem(key('page')) || 'scoreboard',
  selectedDate: new URLSearchParams(window.location.search).get('date') || localStorage.getItem(key('date')) || todayValue(),
  snappedDate: false,
  games: [],
  teams: [],
  leaders: {},
  seasonGames: [],
  priorSeasonGames: [],
  touchdowns: [],
  watched: readJson(key('watched'), []),
  slip: readJson(key('slip'), []),
  groupDivisions: readJson(key('groupDivisions'), true),
  teamSort: readJson(key('teamSort'), { key: 'winPct', dir: 'desc' }),
  coverageRows: readJson(key('coverageRows'), []),
  matchupGameId: localStorage.getItem(key('matchupGameId')) || '',
  matchupSummaries: new Map(),
  openGameId: '',
  playerCardContext: [],
  playerCardIndex: -1,
  personnelPlayers: new Map(),
  playerTierOverrides: readJson(key('playerTierOverrides'), {}),
  ratingCohorts: new Map(),
  runDefenseRatings: new Map(),
  forecastGameId: localStorage.getItem(key('forecastGameId')) || '',
  forecastResult: null,
  forecastLoading: false,
  forecastError: '',
  forecastCoverageLoading: false,
  forecastCoverageSeason: null,
  staffOverrides: readJson(key('staffOverrides'), {}),
  callerSamples: readJson(key('callerSamples'), {}),
  gameForecastCache: new Map(),
};

function key(name) {
  return `${STORAGE_PREFIX}:${name}`;
}

function readJson(storageKey, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || 'null');
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}

function writeJson(storageKey, value) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {}
}

function todayValue() {
  return formatDate(new Date());
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function compactDate(value) {
  return String(value || todayValue()).replaceAll('-', '');
}

function parseDate(value) {
  const isoDate = String(value || todayValue()).match(/^\d{4}-\d{2}-\d{2}/)?.[0] || String(value || todayValue());
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return new Date();
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function addDays(value, days) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

function parseFlexibleDateInput(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) match = text.match(/^(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?$/);
  let year; let month; let day;
  if (match && match[1]?.length === 4) [, year, month, day] = match.map(Number);
  else if (match) { month = Number(match[1]); day = Number(match[2]); year = Number(match[3] || new Date().getFullYear()); if (year < 100) year += 2000; }
  else { match = text.match(/^(\d{4})(\d{2})(\d{2})$/); if (match) [, year, month, day] = match.map(Number); }
  const parsed = new Date(year, Number(month) - 1, day, 12);
  return Number.isFinite(year) && parsed.getFullYear() === year && parsed.getMonth() === Number(month) - 1 && parsed.getDate() === day ? formatDate(parsed) : '';
}

function nflWeekStart(value) {
  const date = parseDate(value);
  const day = date.getDay();
  const delta = -((day + 4) % 7);
  date.setDate(date.getDate() + delta);
  return formatDate(date);
}

function nflWeekEnd(value) { return addDays(nflWeekStart(value), 6); }

function nflWeekOneStart(season) {
  if (NFL_WEEK_ONE_STARTS[season]) return NFL_WEEK_ONE_STARTS[season];
  const septemberFirst = new Date(Number(season), 8, 1, 12);
  const firstMonday = 1 + ((8 - septemberFirst.getDay()) % 7);
  return formatDate(new Date(Number(season), 8, firstMonday + 2, 12));
}

function nflWeekContext(value) {
  const start = nflWeekStart(value); const season = seasonForDate(start); const regularStart = nflWeekOneStart(season);
  const weekOffset = Math.round((parseDate(start) - parseDate(regularStart)) / 604800000);
  if (weekOffset >= 0 && weekOffset < 18) return { season, phase: 'REGULAR SEASON', shortPhase: 'REG', name: `WEEK ${weekOffset + 1}`, week: weekOffset + 1, start, end: nflWeekEnd(start), baselineSeason: weekOffset === 0 ? season - 1 : season, baselineReason: weekOffset === 0 ? 'Week 1 uses the previous full season' : 'Current-season sample' };
  if (weekOffset < 0) {
    const before = Math.abs(weekOffset);
    const name = before === 1 ? 'ROSTER WEEK' : before === 2 ? 'PRESEASON WEEK 3' : before === 3 ? 'PRESEASON WEEK 2' : before === 4 ? 'PRESEASON WEEK 1' : before === 5 ? 'HALL OF FAME' : 'OFFSEASON';
    return { season, phase: before <= 5 ? 'PRESEASON' : 'OFFSEASON', shortPhase: before <= 5 ? 'PRE' : 'OFF', name, week: before >= 2 && before <= 4 ? 5 - before : 0, start, end: nflWeekEnd(start), baselineSeason: season - 1, baselineReason: 'Preseason uses the previous full season' };
  }
  const postseason = ['WILD CARD', 'DIVISIONAL', 'CONFERENCE', 'PRO BOWL / BYE', 'SUPER BOWL'];
  const postIndex = Math.min(postseason.length - 1, weekOffset - 18);
  return { season, phase: 'POSTSEASON', shortPhase: 'POST', name: postseason[postIndex], week: 19 + postIndex, start, end: nflWeekEnd(start), baselineSeason: season, baselineReason: 'Current-season and playoff sample' };
}

function nflSeasonWeekOptions(season) {
  const regularStart = nflWeekOneStart(season);
  return [-5,-4,-3,-2,-1, ...Array.from({ length: 23 }, (_, index) => index)].map((offset) => nflWeekContext(addDays(regularStart, offset * 7)));
}

function nflWeekLabel(value) {
  const start = parseDate(nflWeekStart(value)); const end = parseDate(nflWeekEnd(value));
  const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  return `${fmt.format(start)} – ${fmt.format(end)}, ${end.getFullYear()}`;
}

let datePickerEl = null; let datePickerMonth = null; let datePickerSeason = null;

function closeDatePicker() {
  datePickerEl?.remove();
  datePickerEl = null;
  els.weekPickerBtn?.setAttribute('aria-expanded', 'false');
}

function renderDatePicker() {
  if (!datePickerEl) return;
  const selectedStart = nflWeekStart(state.selectedDate); const selectedEnd = nflWeekEnd(state.selectedDate); const today = todayValue();
  const first = datePickerMonth || new Date(parseDate(selectedStart).getFullYear(), parseDate(selectedStart).getMonth(), 1);
  const start = new Date(first); start.setDate(1 - first.getDay());
  const days = Array.from({ length: 42 }, (_, index) => { const day = new Date(start); day.setDate(start.getDate() + index); const value = formatDate(day); const inWeek = value >= selectedStart && value <= selectedEnd; return `<button type="button" class="date-picker-day${day.getMonth() !== first.getMonth() ? ' muted' : ''}${inWeek ? ' selected-week' : ''}${value === selectedStart ? ' week-start' : ''}${value === selectedEnd ? ' week-end' : ''}${value === today ? ' today' : ''}" data-date-picker-day="${value}" title="NFL week ${nflWeekLabel(value)}">${day.getDate()}</button>`; }).join('');
  datePickerEl.innerHTML = `<div class="date-picker-head"><button data-date-picker-year="-1">&laquo;</button><button data-date-picker-shift="-1">&lsaquo;</button><strong>${new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(first)}</strong><button data-date-picker-shift="1">&rsaquo;</button><button data-date-picker-year="1">&raquo;</button></div><div class="date-picker-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div class="date-picker-grid">${days}</div><div class="date-picker-legend">Highlighted NFL week runs Thursday through Monday.</div><div class="date-picker-actions"><button data-date-picker-today>Current week</button><button data-date-picker-close>Close</button></div>`;
  const rect = els.dateInput.getBoundingClientRect(); const width = Math.min(340, window.innerWidth - 16); datePickerEl.style.width = `${width}px`; datePickerEl.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))}px`; datePickerEl.style.top = `${Math.max(8, Math.min(rect.bottom + 8, window.innerHeight - 390))}px`;
}

function openDatePicker() {
  if (!datePickerEl) { datePickerEl = document.createElement('div'); datePickerEl.className = 'date-picker-popover'; datePickerEl.addEventListener('mousedown', (event) => event.preventDefault()); datePickerEl.addEventListener('click', (event) => { const day = event.target.closest('[data-date-picker-day]'); if (day) { state.selectedDate = nflWeekStart(day.dataset.datePickerDay); closeDatePicker(); loadAll(); return; } const shift = event.target.closest('[data-date-picker-shift]'); if (shift) { datePickerMonth.setMonth(datePickerMonth.getMonth() + Number(shift.dataset.datePickerShift)); renderDatePicker(); return; } const year = event.target.closest('[data-date-picker-year]'); if (year) { datePickerMonth.setFullYear(datePickerMonth.getFullYear() + Number(year.dataset.datePickerYear)); renderDatePicker(); return; } if (event.target.closest('[data-date-picker-today]')) { state.selectedDate = nflWeekStart(todayValue()); closeDatePicker(); loadAll(); } if (event.target.closest('[data-date-picker-close]')) closeDatePicker(); }); document.body.appendChild(datePickerEl); }
  const selected = parseDate(nflWeekStart(state.selectedDate)); datePickerMonth = new Date(selected.getFullYear(), selected.getMonth(), 1); renderDatePicker();
}

// NFL-first season picker. These later declarations intentionally replace the generic month picker above.
function renderDatePicker() {
  if (!datePickerEl) return;
  const selectedStart = nflWeekStart(state.selectedDate); const options = nflSeasonWeekOptions(datePickerSeason);
  const rows = options.map((context) => `<button type="button" class="nfl-week-option ${context.phase.toLowerCase().replaceAll(' ','-')} ${context.start === selectedStart ? 'active' : ''}" data-nfl-week="${context.start}"><span>${escapeHtml(context.shortPhase)}</span><strong>${escapeHtml(context.name)}</strong><small>${escapeHtml(nflWeekLabel(context.start))}</small>${context.week === 1 && context.phase === 'REGULAR SEASON' ? '<em>Prior-year baseline</em>' : ''}</button>`).join('');
  datePickerEl.innerHTML = `<div class="nfl-picker-head"><button data-picker-season="-1" aria-label="Previous season">‹</button><div><span>NFL SEASON</span><strong>${datePickerSeason}</strong></div><button data-picker-season="1" aria-label="Next season">›</button></div><div class="nfl-week-list">${rows}</div><div class="date-picker-actions"><button data-date-picker-today>Current NFL week</button><button data-date-picker-close>Close</button></div>`;
  datePickerEl.querySelector('.nfl-week-option.active')?.scrollIntoView({ block: 'center' });
  const rect = els.weekPickerBtn.getBoundingClientRect(); const width = Math.min(430, window.innerWidth - 16); datePickerEl.style.width = `${width}px`; datePickerEl.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))}px`; datePickerEl.style.top = `${Math.max(8, Math.min(rect.bottom + 8, window.innerHeight - Math.min(620, window.innerHeight - 16)))}px`;
}

function openDatePicker() {
  if (!datePickerEl) {
    datePickerEl = document.createElement('div'); datePickerEl.className = 'date-picker-popover nfl-season-picker';
    datePickerEl.addEventListener('mousedown', (event) => event.preventDefault());
    datePickerEl.addEventListener('click', (event) => {
      const week = event.target.closest('[data-nfl-week]');
      if (week) { state.selectedDate = week.dataset.nflWeek; closeDatePicker(); els.weekPickerBtn?.setAttribute('aria-expanded', 'false'); loadAll(); return; }
      const seasonShift = event.target.closest('[data-picker-season]');
      if (seasonShift) { datePickerSeason += Number(seasonShift.dataset.pickerSeason); renderDatePicker(); return; }
      if (event.target.closest('[data-date-picker-today]')) { state.selectedDate = nflWeekStart(todayValue()); closeDatePicker(); loadAll(); return; }
      if (event.target.closest('[data-date-picker-close]')) { closeDatePicker(); els.weekPickerBtn?.setAttribute('aria-expanded', 'false'); }
    });
    document.body.appendChild(datePickerEl);
  }
  datePickerSeason = nflWeekContext(state.selectedDate).season; els.weekPickerBtn?.setAttribute('aria-expanded', 'true'); renderDatePicker();
}

function renderWeekControls() {
  const context = nflWeekContext(state.selectedDate);
  els.weekPhaseLabel.textContent = context.shortPhase;
  els.weekNameLabel.textContent = `${context.season} · ${context.name}`;
  els.weekDatesLabel.textContent = nflWeekLabel(context.start);
  els.weekPickerBtn.dataset.phase = context.shortPhase.toLowerCase();
  return context;
}

function longDate(value) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(parseDate(value));
}

function seasonForDate(value) {
  const date = parseDate(value);
  return date.getMonth() >= 2 ? date.getFullYear() : date.getFullYear() - 1;
}

function analysisSeasonForGame(game) {
  const season = Number(game?.season?.year || seasonForDate(game?.date || state.selectedDate));
  const seasonType = Number(game?.season?.type || 2); const week = Number(game?.week?.number || game?.week || 0);
  const context = nflWeekContext(game?.date || state.selectedDate);
  return seasonType === 1 || context.phase === 'PRESEASON' || week === 1 || (context.phase === 'REGULAR SEASON' && context.week === 1) ? season - 1 : season;
}

function nflSeasonYearsForDate(value) {
  const base = seasonForDate(value);
  return [base, base - 1, base + 1].filter((year, index, arr) => arr.indexOf(year) === index);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

async function getJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function getText(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function getJsonFirst(urls) {
  let lastError = null;
  for (const url of urls) {
    try {
      return await getJson(url);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('No source URL available');
}

function statusText(game) {
  const status = game?.status?.type || {};
  if (status.state === 'pre') return game?.status?.type?.shortDetail || game?.status?.type?.detail || game?.dateText || 'Pregame';
  if (status.state === 'in') return status.shortDetail || status.detail || 'Live';
  if (status.completed) return 'Final';
  return status.shortDetail || status.detail || 'Scheduled';
}

function teamLogo(team) {
  return team?.logo || team?.logos?.[0]?.href || '';
}

function teamColor(team, fallback = '#376996') {
  const raw = team?.color || team?.alternateColor || '';
  return raw ? `#${String(raw).replace('#', '')}` : fallback;
}

function colorLuminance(color) {
  const raw = String(color || '').replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(raw)) return .2;
  const channels = [0, 2, 4].map((index) => Number.parseInt(raw.slice(index, index + 2), 16) / 255).map((value) => value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}

function teamPalette(teamOrAbbrev) {
  const abbrev = normalizedNflTeam(typeof teamOrAbbrev === 'string' ? teamOrAbbrev : teamOrAbbrev?.abbrev);
  const source = NFL_TEAM_COLORS[abbrev] || [teamColor(teamOrAbbrev), teamColor({ color: teamOrAbbrev?.alternateColor }, '#17324D'), '#A5ACAF'];
  const [primary, secondary, tertiary] = source;
  return { primary, secondary, tertiary, lightText: '#F7FAFF', darkText: '#06111D', onPrimary: colorLuminance(primary) > .42 ? '#06111D' : '#F7FAFF', onSecondary: colorLuminance(secondary) > .42 ? '#06111D' : '#F7FAFF', onTertiary: colorLuminance(tertiary) > .42 ? '#06111D' : '#F7FAFF' };
}

function teamPaletteVars(away, home = away) {
  const a = teamPalette(away); const h = teamPalette(home);
  return `--away-primary:${a.primary};--away-secondary:${a.secondary};--away-tertiary:${a.tertiary};--away-on-primary:${a.onPrimary};--away-light-text:${a.lightText};--away-dark-text:${a.darkText};--home-primary:${h.primary};--home-secondary:${h.secondary};--home-tertiary:${h.tertiary};--home-on-primary:${h.onPrimary};--home-light-text:${h.lightText};--home-dark-text:${h.darkText}`;
}

function readableTeamColor(color) {
  const raw = String(color || '').replace('#', '');
  if (!/^[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(raw)) return '#dbe9ff';
  const full = raw.length === 3 ? raw.split('').map((part) => part + part).join('') : raw;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (luminance >= 0.42) return `#${full}`;
  return `rgb(${Math.round(r * 0.42 + 255 * 0.58)}, ${Math.round(g * 0.42 + 255 * 0.58)}, ${Math.round(b * 0.42 + 255 * 0.58)})`;
}

function recordText(team) {
  const record = team?.records?.find?.((item) => item.type === 'total') || team?.records?.[0];
  return record?.summary || '--';
}

function statValue(stats, name) {
  const item = stats?.find?.((entry) => entry.name === name || entry.abbreviation === name || entry.displayName === name);
  return item?.displayValue || item?.value || '--';
}

function statLookup(stats, aliases = []) {
  const normalizedAliases = aliases.map(normalizeStatKey);
  const item = (stats || []).find((entry) => {
    const keys = [entry.name, entry.abbreviation, entry.displayName, entry.label].map(normalizeStatKey);
    return keys.some((keyName) => normalizedAliases.includes(keyName));
  });
  const value = item?.displayValue ?? item?.value ?? item?.summary;
  return value == null || value === '' ? '--' : String(value);
}

function normalizeStatKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function numberFromRecord(summary) {
  const [wins, losses, ties] = String(summary || '').split('-').map((part) => Number(part) || 0);
  const games = wins + losses + ties;
  return games ? (wins + (ties * 0.5)) / games : 0;
}

function normalizeGame(event) {
  const competition = event?.competitions?.[0] || {};
  const competitors = competition?.competitors || [];
  const away = competitors.find((item) => item.homeAway === 'away') || competitors[0] || {};
  const home = competitors.find((item) => item.homeAway === 'home') || competitors[1] || {};
  const awayTeam = away.team || {};
  const homeTeam = home.team || {};
  const odds = competition?.odds?.[0] || event?.odds?.[0] || {};
  const situation = competition?.situation || {};
  const venue = competition?.venue || {};
  return {
    id: String(event.id || ''),
    uid: event.uid || '',
    name: event.name || `${awayTeam.abbreviation || 'AWAY'} at ${homeTeam.abbreviation || 'HOME'}`,
    shortName: event.shortName || '',
    date: event.date || '',
    dateText: formatKickoff(event.date),
    status: event.status || {},
    season: event.season || {},
    week: event.week || {},
    venue: venue.fullName || venue.address?.city || '',
    broadcast: competition.broadcasts?.map((item) => item.names?.join(', ') || item.name).filter(Boolean).join(' / ') || '',
    odds: {
      details: odds.details || '',
      spread: odds.spread,
      overUnder: odds.overUnder,
      provider: odds.provider?.name || odds.provider || '',
    },
    situation,
    away: normalizeCompetitor(away),
    home: normalizeCompetitor(home),
    leaders: event.competitions?.[0]?.leaders || event.leaders || [],
    links: event.links || [],
  };
}

function normalizeCompetitor(comp) {
  const team = comp?.team || {};
  const abbrev = team.abbreviation || team.shortDisplayName || 'NFL';
  const palette = teamPalette(abbrev);
  return {
    id: String(team.id || comp.id || ''),
    uid: team.uid || '',
    abbrev,
    name: team.displayName || team.name || team.location || 'Team',
    shortName: team.shortDisplayName || team.abbreviation || 'Team',
    score: comp?.score ?? '0',
    winner: Boolean(comp?.winner),
    record: recordText(comp),
    logo: teamLogo(team),
    color: palette.primary,
    alternateColor: palette.secondary,
    tertiaryColor: palette.tertiary,
    lightText: palette.lightText,
    darkText: palette.darkText,
    onPrimary: palette.onPrimary,
    stats: comp?.statistics || [],
    linescores: comp?.linescores || [],
  };
}

function formatKickoff(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  }).format(new Date(value));
}

async function fetchScoreboard() {
  const url = new URL(`${API_BASE}/scoreboard`);
  url.searchParams.set('dates', `${compactDate(nflWeekStart(state.selectedDate))}-${compactDate(nflWeekEnd(state.selectedDate))}`);
  url.searchParams.set('limit', '100');
  const data = await getJson(url.toString());
  return {
    raw: data,
    games: (data.events || []).map(normalizeGame),
  };
}

async function fetchScoreboardForDate(date) {
  const url = new URL(`${API_BASE}/scoreboard`);
  url.searchParams.set('dates', compactDate(date));
  url.searchParams.set('limit', '100');
  const data = await getJson(url.toString());
  return (data.events || []).map(normalizeGame);
}

async function fetchScoreboardRange(startDate, endDate) {
  const url = new URL(`${API_BASE}/scoreboard`);
  url.searchParams.set('dates', `${compactDate(startDate)}-${compactDate(endDate)}`);
  url.searchParams.set('limit', '1000');
  const data = await getJson(url.toString());
  return (data.events || []).map(normalizeGame);
}

async function fetchSeasonScoreboard(season, seasonType = '2') {
  const url = new URL(`${API_BASE}/scoreboard`);
  url.searchParams.set('dates', String(season));
  url.searchParams.set('seasontype', String(seasonType));
  url.searchParams.set('limit', '1000');
  const data = await getJson(url.toString());
  return (data.events || []).map(normalizeGame);
}

async function findMostRecentSlateDate(anchorDate) {
  const endDate = anchorDate || todayValue();
  const startDate = addDays(endDate, -390);
  const ranged = await fetchScoreboardRange(startDate, endDate).catch(() => []);
  const pastDates = ranged
    .map((game) => String(game.date || '').slice(0, 10))
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date <= endDate)
    .sort();
  if (pastDates.length) return pastDates[pastDates.length - 1];

  for (const season of nflSeasonYearsForDate(endDate)) {
    for (const type of ['3', '2', '1']) {
      const seasonGames = await fetchSeasonScoreboard(season, type).catch(() => []);
      const dates = seasonGames
        .map((game) => String(game.date || '').slice(0, 10))
        .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date <= endDate)
        .sort();
      if (dates.length) return dates[dates.length - 1];
    }
  }
  return endDate;
}

async function fetchTeams() {
  const data = await getJson(`${API_BASE}/teams?limit=32`);
  const teams = (data.sports?.[0]?.leagues?.[0]?.teams || data.teams || [])
    .map((entry) => entry.team || entry)
    .filter(Boolean)
    .map((team) => {
      const abbrev = team.abbreviation || team.shortDisplayName || '';
      const palette = teamPalette(abbrev);
      return {
      id: String(team.id || ''),
      abbrev,
      name: team.displayName || team.name || '',
      shortName: team.shortDisplayName || team.name || '',
      division: team.groups?.name || team.group?.name || team.division || 'NFL',
      logo: teamLogo(team),
      color: palette.primary,
      alternateColor: palette.secondary,
      tertiaryColor: palette.tertiary,
      lightText: palette.lightText,
      darkText: palette.darkText,
      onPrimary: palette.onPrimary,
      links: team.links || [],
      record: team.record?.items?.[0]?.summary || team.record?.summary || '--',
    };
    });
  return teams;
}

async function fetchStandings(season) {
  const data = await getJsonFirst([
    `${API_BASE}/standings?season=${season}&seasontype=2&groups=80`,
    `${API_BASE}/standings?season=${season}&type=2&groups=80`,
    `${CORE_BASE}/seasons/${season}/types/2/standings?lang=en&region=us`,
  ]);
  const entries = data?.children?.flatMap((group) => group?.standings?.entries || group?.entries || [])
    || data?.standings?.entries
    || data?.standings
    || [];
  const map = new Map();
  for (const entry of entries) {
    const teamRef = entry?.team?.$ref || '';
    const id = teamRef.match(/teams\/(\d+)/)?.[1] || entry?.team?.id || entry?.teamId || '';
    if (!id) continue;
    const stats = entry.stats || entry.statistics || [];
    map.set(String(id), {
      wins: statValue(stats, 'wins'),
      losses: statValue(stats, 'losses'),
      ties: statValue(stats, 'ties'),
      pointsFor: statValue(stats, 'pointsFor'),
      pointsAgainst: statValue(stats, 'pointsAgainst'),
      differential: statValue(stats, 'differential'),
      streak: statValue(stats, 'streak'),
      winPct: statValue(stats, 'winPercent') || statValue(stats, 'winningPct'),
    });
  }
  return map;
}

function aggregateTeamStatsFromGames(games = []) {
  const map = new Map();
  for (const game of games) {
    if (!game?.away?.id || !game?.home?.id) continue;
    const completed = Boolean(game?.status?.type?.completed);
    const awayScore = Number(game.away.score) || 0;
    const homeScore = Number(game.home.score) || 0;
    rememberTeamGame(map, game.away, awayScore, homeScore, completed);
    rememberTeamGame(map, game.home, homeScore, awayScore, completed);
  }
  for (const entry of map.values()) {
    entry.record = `${entry.wins}-${entry.losses}${entry.ties ? `-${entry.ties}` : ''}`;
    const gamesPlayed = entry.wins + entry.losses + entry.ties;
    entry.winPct = gamesPlayed ? (entry.wins + entry.ties * 0.5) / gamesPlayed : 0;
    entry.pointsFor = entry.pointsFor || '--';
    entry.pointsAgainst = entry.pointsAgainst || '--';
    entry.differential = Number(entry.pointsFor) - Number(entry.pointsAgainst);
    entry.streak = entry.streak || '--';
  }
  return map;
}

function rememberTeamGame(map, team, pointsFor, pointsAgainst, completed) {
  if (!team?.id) return;
  if (!map.has(String(team.id))) {
    map.set(String(team.id), {
      id: String(team.id),
      record: team.record || '--',
      wins: 0,
      losses: 0,
      ties: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      differential: 0,
      winPct: 0,
      streak: '--',
    });
  }
  const entry = map.get(String(team.id));
  entry.pointsFor += pointsFor;
  entry.pointsAgainst += pointsAgainst;
  if (!completed) return;
  if (pointsFor > pointsAgainst) {
    entry.wins += 1;
    entry.streak = 'W';
  } else if (pointsFor < pointsAgainst) {
    entry.losses += 1;
    entry.streak = 'L';
  } else {
    entry.ties += 1;
    entry.streak = 'T';
  }
}

function teamsFromGames(games = []) {
  const map = new Map();
  for (const game of games) {
    for (const side of ['away', 'home']) {
      const team = game?.[side];
      if (!team?.id || map.has(String(team.id))) continue;
      map.set(String(team.id), {
        id: String(team.id),
        abbrev: team.abbrev,
        name: team.name,
        shortName: team.shortName,
        division: 'NFL',
        logo: team.logo,
        color: team.color,
        alternateColor: team.alternateColor,
        links: [],
        record: team.record || '--',
      });
    }
  }
  return [...map.values()].sort((a, b) => String(a.abbrev).localeCompare(String(b.abbrev)));
}

async function fetchLeaders(seasonType = '2') {
  const season = seasonForDate(state.selectedDate);
  const categories = [
    ['passingYards', 'Passing Yards'],
    ['passingTouchdowns', 'Passing TD'],
    ['rushingYards', 'Rushing Yards'],
    ['rushingTouchdowns', 'Rushing TD'],
    ['receivingYards', 'Receiving Yards'],
    ['receivingTouchdowns', 'Receiving TD'],
    ['totalTackles', 'Tackles'],
    ['sacks', 'Sacks'],
    ['interceptions', 'Interceptions'],
  ];
  const url = new URL(`${API_BASE}/statistics/leaders`);
  url.searchParams.set('season', String(season));
  url.searchParams.set('seasontype', String(seasonType));
  url.searchParams.set('limit', '8');
  try {
    const data = await getJsonFirst([
      url.toString(),
      `${CORE_BASE}/seasons/${season}/types/${seasonType}/leaders?lang=en&region=us`,
    ]);
    const leaders = {};
    const buckets = data?.leaders || data?.categories || [];
    for (const bucket of buckets) {
      const keyName = bucket.name || bucket.abbreviation || bucket.displayName;
      leaders[keyName] = {
        label: bucket.displayName || keyName,
        entries: (bucket.leaders || bucket.athletes || []).map(normalizeLeader).filter(Boolean).slice(0, 8),
      };
    }
    return leaders;
  } catch {
    return leadersFromGames(state.seasonGames.length ? state.seasonGames : state.games, categories);
  }
}

function leadersFromGames(games = [], categories = []) {
  const buckets = new Map(categories.map(([name, label]) => [name, { label, entries: new Map() }]));
  for (const game of games) {
    for (const group of game.leaders || []) {
      const groupName = group.name || group.displayName || '';
      for (const leader of group.leaders || []) {
        const athlete = leader.athlete || {};
        const name = athlete.displayName || leader.displayName || '';
        const value = Number(leader.value);
        if (!name || !Number.isFinite(value)) continue;
        const keyName = inferLeaderCategory(groupName, leader);
        if (!buckets.has(keyName)) continue;
        const entries = buckets.get(keyName).entries;
        const id = String(athlete.id || name);
        const existing = entries.get(id) || {
          id,
          name,
          team: leader.team?.abbreviation || athlete.team?.abbreviation || '',
          logo: teamLogo(leader.team || athlete.team || {}),
          value: 0,
        };
        existing.value += value;
        entries.set(id, existing);
      }
    }
  }
  const result = {};
  for (const [name, bucket] of buckets.entries()) {
    result[name] = {
      label: bucket.label,
      entries: [...bucket.entries.values()]
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
        .map((entry) => ({ ...entry, value: String(Math.round(entry.value)) })),
    };
  }
  return result;
}

function inferLeaderCategory(groupName, leader) {
  const text = `${groupName} ${leader?.displayName || leader?.name || ''}`.toLowerCase();
  if (text.includes('pass') && text.includes('touchdown')) return 'passingTouchdowns';
  if (text.includes('pass')) return 'passingYards';
  if (text.includes('rush') && text.includes('touchdown')) return 'rushingTouchdowns';
  if (text.includes('rush')) return 'rushingYards';
  if (text.includes('receiv') && text.includes('touchdown')) return 'receivingTouchdowns';
  if (text.includes('receiv')) return 'receivingYards';
  if (text.includes('sack')) return 'sacks';
  if (text.includes('interception')) return 'interceptions';
  if (text.includes('tackle')) return 'totalTackles';
  return '';
}

function normalizeLeader(entry) {
  const athlete = entry.athlete || entry;
  if (!athlete) return null;
  return {
    id: athlete.id || '',
    name: athlete.displayName || athlete.fullName || athlete.shortName || 'Player',
    team: entry.team?.abbreviation || athlete.team?.abbreviation || '',
    logo: teamLogo(entry.team || athlete.team || {}),
    value: entry.displayValue || entry.value || '--',
  };
}

function renderAll() {
  renderTabs();
  renderScoreboard();
  renderForecast();
  renderTeams();
  renderLeaders();
  renderMatchups();
  renderBetSlip();
  renderWatchList();
  renderSlateNotes();
  renderTouchdownFeed();
  populatePropOptions();
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function average(values, fallback = 0) {
  const usable = values.map(Number).filter(Number.isFinite);
  return usable.length ? usable.reduce((sum, value) => sum + value, 0) / usable.length : fallback;
}

function percent(value, digits = 0) {
  return value != null && value !== '' && Number.isFinite(Number(value)) ? `${(Number(value) * 100).toFixed(digits)}%` : '--';
}

function selectedForecastGame() {
  return state.games.find((game) => game.id === state.forecastGameId) || state.games[0] || null;
}

function gameIncludesTeam(game, team) {
  const abbrev = normalizedNflTeam(team?.abbrev || team);
  return [game?.away, game?.home].some((side) => String(side?.id) === String(team?.id || '') || normalizedNflTeam(side?.abbrev) === abbrev);
}

function opponentInGame(game, team) {
  return gameIncludesTeam({ away: game?.away }, team) ? game?.home : game?.away;
}

function recentGamesForTeam(team, targetGame, limit) {
  const cutoff = new Date(targetGame?.date || state.selectedDate).getTime();
  const pool = [...state.priorSeasonGames, ...state.seasonGames];
  return [...new Map(pool.map((game) => [game.id, game])).values()]
    .filter((game) => game.id !== targetGame?.id && gameIncludesTeam(game, team) && game.status?.type?.completed && new Date(game.date).getTime() < cutoff)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

function staffForTeam(teamAbbrev) {
  const team = normalizedNflTeam(teamAbbrev);
  const season = nflWeekContext(state.selectedDate).season;
  const baseline = (season >= 2026 ? STAFF_BASELINE_2026 : STAFF_BASELINE_2025)[team] || ['Team offensive staff', 'Team defensive staff'];
  const override = state.staffOverrides[team] || {};
  return { offense: override.offense || baseline[0], defense: override.defense || baseline[1] };
}

function historicalStaffForTeam(teamAbbrev, season) {
  const team = normalizedNflTeam(teamAbbrev);
  const baseline = (Number(season) >= 2026 ? STAFF_BASELINE_2026 : STAFF_BASELINE_2025)[team] || ['Team offensive staff', 'Team defensive staff'];
  return { offense: baseline[0], defense: baseline[1] };
}

async function fetchForecastSummary(game) {
  if (!game?.id) return null;
  if (!forecastSummaryCache.has(game.id)) {
    forecastSummaryCache.set(game.id, getJson(`${API_BASE}/summary?event=${encodeURIComponent(game.id)}`).catch(() => null));
  }
  return forecastSummaryCache.get(game.id);
}

function sourceValue(row, aliases) {
  for (const alias of aliases) {
    const direct = row?.[alias];
    if (direct != null && direct !== '') return direct;
    const normalized = row?.[normalizeStatKey(alias)];
    if (normalized != null && normalized !== '') return normalized;
  }
  return null;
}

function participationKey(row) {
  return `${String(sourceValue(row, ['old_game_id', 'game_id', 'espn_game_id']) || '')}|${String(sourceValue(row, ['play_id']) || '')}`;
}

async function fetchParticipationForGames(season, gameIds) {
  const year = Number(season);
  const ids = new Set([...gameIds].map(String));
  const cacheKey = `${year}|${[...ids].sort().join(',')}`;
  if (participationCache.has(cacheKey)) return participationCache.get(cacheKey);
  const promise = (async () => {
    const url = `https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_${year}.csv`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!response.body || typeof TextDecoderStream === 'undefined') {
      const lines = (await response.text()).split(/\r?\n/); const header = lines.shift() || '';
      return parseCsv([header, ...lines.filter((line) => ids.has(String(line.split(',', 3)[1] || '')))].join('\n'));
    }
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = ''; let header = ''; const matching = [];
    const useLine = (line) => {
      if (!header) { header = line; return; }
      const firstComma = line.indexOf(','); const secondComma = line.indexOf(',', firstComma + 1);
      const gameId = firstComma >= 0 && secondComma > firstComma ? line.slice(firstComma + 1, secondComma) : '';
      if (ids.has(gameId)) matching.push(line);
    };
    while (true) {
      const { value, done } = await reader.read();
      buffer += value || '';
      const lines = buffer.split(/\r?\n/); buffer = lines.pop() || '';
      lines.forEach(useLine);
      if (done) break;
    }
    if (buffer) useLine(buffer);
    return parseCsv([header, ...matching].join('\n'));
  })();
  participationCache.set(cacheKey, promise);
  return promise;
}

function summaryPlayRows(game, summary) {
  const drives = [...(summary?.drives?.previous || []), ...(summary?.drives?.current ? [summary.drives.current] : [])];
  const rows = [];
  for (const drive of drives) {
    const offenseId = String(drive?.team?.id || drive?.teamId || '');
    for (const play of drive?.plays || []) rows.push({ ...play, _gameId: game.id, _offenseId: offenseId });
  }
  for (const play of summary?.plays || []) rows.push({ ...play, _gameId: game.id, _offenseId: String(play?.start?.team?.id || '') });
  return [...new Map(rows.map((play) => [String(play.id || `${play.text}|${play.period?.number}|${play.clock?.displayValue}`), play])).values()];
}

function playCallType(play) {
  const text = String(play?.text || play?.description || '').toLowerCase();
  const type = String(play?.type?.text || play?.type?.name || '').toLowerCase();
  if (/kickoff|extra point|field goal|punt|timeout|end of|two-point|2-point/.test(`${type} ${text}`)) return '';
  if (/no play/.test(text)) return '';
  if (/sack|pass|scrambl/.test(`${type} ${text}`)) return 'pass';
  if (/rush|rushing|run|kneel|left end|left tackle|left guard|up the middle|right guard|right tackle|right end/.test(`${type} ${text}`)) return 'rush';
  return '';
}

function playDirection(text) {
  const value = String(text || '').toLowerCase();
  if (/left end|left tackle|left guard|to the left/.test(value)) return 'left';
  if (/right end|right tackle|right guard|to the right/.test(value)) return 'right';
  if (/middle|center|scrambles up/.test(value)) return 'middle';
  return 'unknown';
}

function playQuarterback(text) {
  const match = String(text || '').match(/^(.+?)\s+(?:pass|sacked|scrambles)/i);
  return match?.[1]?.replace(/^\([^)]*\)\s*/, '').trim() || '';
}

function normalizePlayEvidence(game, play, participation = null) {
  const type = playCallType(play);
  if (!type) return null;
  const offenseId = String(play?._offenseId || play?.start?.team?.id || play?.team?.id || '');
  const offense = [game.away, game.home].find((team) => String(team.id) === offenseId || normalizedNflTeam(team.abbrev) === normalizedNflTeam(offenseId));
  if (!offense) return null;
  const defense = offense === game.away ? game.home : game.away;
  const text = String(play?.text || play?.description || '');
  const lower = text.toLowerCase();
  const down = Number(play?.start?.down || play?.down || 0);
  const distance = Number(play?.start?.distance || play?.distance || 0);
  const yards = Number.isFinite(Number(play?.statYardage)) ? Number(play.statYardage) : Number(lower.match(/for (-?\d+) yards?/)?.[1] || 0);
  const yardsToGoal = Number(play?.start?.yardsToEndzone || play?.start?.yardsToGoal || play?.start?.distanceToEndzone);
  const complete = type === 'pass' && !/incomplete/.test(lower) && /pass complete|complete to/.test(lower);
  const sack = type === 'pass' && /sack/.test(lower);
  const interception = /intercept/.test(lower);
  const fumbleLost = /fumble/.test(lower) && /lost|recovered by/.test(lower);
  const success = down >= 3 ? yards >= distance : down === 2 ? yards >= Math.max(3, distance * .5) : yards >= 4;
  const manZone = String(sourceValue(participation, ['defense_man_zone_type']) || '').toLowerCase();
  const coverage = String(sourceValue(participation, ['defense_coverage_type']) || '').replaceAll('_', ' ');
  const rushersValue = sourceValue(participation, ['number_of_pass_rushers', 'pass_rushers']); const rushers = rushersValue == null ? NaN : Number(rushersValue);
  const pressureValue = String(sourceValue(participation, ['was_pressure', 'pressure']) || '').toLowerCase();
  const chartedFormation = String(sourceValue(participation, ['offense_formation']) || '').toUpperCase();
  const boxValue = sourceValue(participation, ['defenders_in_box', 'number_of_defenders_in_box']); const defendersInBox = boxValue == null ? NaN : Number(boxValue);
  const formation = chartedFormation || (/shotgun/i.test(text) ? 'SHOTGUN' : /under center/i.test(text) ? 'UNDER CENTER' : 'OTHER / UNCHARTED');
  return {
    gameId: game.id, playId: String(play.id || ''), offense: offense.abbrev, defense: defense.abbrev, type, text,
    down, distance, yards, earlyDown: down === 1 || down === 2, thirdDown: down === 3, redZone: Number.isFinite(yardsToGoal) && yardsToGoal <= 20,
    direction: playDirection(text), quarterback: playQuarterback(text), complete, sack, interception, turnover: interception || fumbleLost,
    success, explosive: type === 'pass' ? yards >= 15 : yards >= 10, touchdown: /touchdown/.test(lower),
    manZone: /man/.test(manZone) ? 'man' : /zone/.test(manZone) ? 'zone' : '', coverage,
    pressure: ['1', 'true', 'yes'].includes(pressureValue), blitz: Number.isFinite(rushers) ? rushers >= 5 : false, rushers: Number.isFinite(rushers) ? rushers : null,
    formation, noHuddle: /no huddle/i.test(text), offensePersonnel: String(sourceValue(participation, ['offense_personnel']) || ''),
    offensePlayers: String(sourceValue(participation, ['offense_players']) || ''), defensePlayers: String(sourceValue(participation, ['defense_players']) || ''),
    defendersInBox: Number.isFinite(defendersInBox) ? defendersInBox : null,
  };
}

function evidenceFromSummaries(items, participationRows = []) {
  const participation = new Map(participationRows.map((row) => [participationKey(row), row]));
  const evidence = [];
  for (const { game, summary } of items) {
    for (const play of summaryPlayRows(game, summary)) {
      const charted = participation.get(`${game.id}|${String(play.id || '')}`) || null;
      const normalized = normalizePlayEvidence(game, play, charted);
      if (normalized) evidence.push(normalized);
    }
  }
  return evidence;
}

function aggregatePlayProfile(plays) {
  const pass = plays.filter((play) => play.type === 'pass');
  const rush = plays.filter((play) => play.type === 'rush');
  const early = plays.filter((play) => play.earlyDown);
  const third = plays.filter((play) => play.thirdDown);
  const redZone = plays.filter((play) => play.redZone);
  const chartedPass = pass.filter((play) => play.manZone);
  const shotgun = plays.filter((play) => play.formation === 'SHOTGUN'); const nonShotgun = plays.filter((play) => play.formation !== 'SHOTGUN');
  const directionRate = (direction) => rush.length ? rush.filter((play) => play.direction === direction).length / rush.length : 0;
  return {
    plays: plays.length, passPlays: pass.length, rushPlays: rush.length,
    passRate: plays.length ? pass.length / plays.length : .56,
    earlyDownPassRate: early.length ? early.filter((play) => play.type === 'pass').length / early.length : .53,
    thirdDownPassRate: third.length ? third.filter((play) => play.type === 'pass').length / third.length : .72,
    redZonePassRate: redZone.length ? redZone.filter((play) => play.type === 'pass').length / redZone.length : .50,
    successRate: plays.length ? plays.filter((play) => play.success).length / plays.length : .43,
    passSuccessRate: pass.length ? pass.filter((play) => play.success).length / pass.length : .44,
    rushSuccessRate: rush.length ? rush.filter((play) => play.success).length / rush.length : .41,
    explosiveRate: plays.length ? plays.filter((play) => play.explosive).length / plays.length : .12,
    explosivePassRate: pass.length ? pass.filter((play) => play.explosive).length / pass.length : .14,
    sackRate: pass.length ? pass.filter((play) => play.sack).length / pass.length : .07,
    turnoverRate: plays.length ? plays.filter((play) => play.turnover).length / plays.length : .025,
    yardsPerPlay: average(plays.map((play) => play.yards), 5.3), yardsPerPass: average(pass.map((play) => play.yards), 6.3), yardsPerRush: average(rush.map((play) => play.yards), 4.2),
    leftRunRate: directionRate('left'), middleRunRate: directionRate('middle'), rightRunRate: directionRate('right'),
    chartedPasses: chartedPass.length, manRate: chartedPass.length ? chartedPass.filter((play) => play.manZone === 'man').length / chartedPass.length : null,
    zoneRate: chartedPass.length ? chartedPass.filter((play) => play.manZone === 'zone').length / chartedPass.length : null,
    pressureRate: chartedPass.length ? chartedPass.filter((play) => play.pressure).length / chartedPass.length : null,
    blitzRate: chartedPass.length ? chartedPass.filter((play) => play.blitz).length / chartedPass.length : null,
    shotgunRate: plays.length ? shotgun.length / plays.length : 0,
    shotgunSuccessRate: shotgun.length ? shotgun.filter((play) => play.success).length / shotgun.length : null,
    nonShotgunSuccessRate: nonShotgun.length ? nonShotgun.filter((play) => play.success).length / nonShotgun.length : null,
    noHuddleRate: plays.length ? plays.filter((play) => play.noHuddle).length / plays.length : 0,
  };
}

function teamPowerRatings(targetGame) {
  const cutoff = new Date(targetGame?.date || state.selectedDate).getTime();
  const games = [...state.priorSeasonGames, ...state.seasonGames].filter((game) => game.status?.type?.completed && new Date(game.date).getTime() < cutoff);
  const base = new Map();
  for (const game of games) {
    for (const [team, opponent] of [[game.away, game.home], [game.home, game.away]]) {
      const keyName = normalizedNflTeam(team.abbrev);
      const row = base.get(keyName) || { margins: [], opponents: [] };
      row.margins.push(Number(team.score) - Number(opponent.score));
      row.opponents.push(normalizedNflTeam(opponent.abbrev));
      base.set(keyName, row);
    }
  }
  let ratings = new Map([...base].map(([team, row]) => [team, average(row.margins)]));
  for (let iteration = 0; iteration < 4; iteration += 1) {
    ratings = new Map([...base].map(([team, row]) => [team, average(row.margins) * .68 + average(row.opponents.map((opponent) => ratings.get(opponent) || 0)) * .32]));
  }
  return ratings;
}

function scoringProfile(team, games) {
  const forValues = []; const againstValues = [];
  for (const game of games) {
    const own = [game.away, game.home].find((side) => String(side.id) === String(team.id) || normalizedNflTeam(side.abbrev) === normalizedNflTeam(team.abbrev));
    const opponent = own === game.away ? game.home : game.away;
    if (own && opponent) { forValues.push(Number(own.score)); againstValues.push(Number(opponent.score)); }
  }
  return { pointsFor: average(forValues, 22), pointsAgainst: average(againstValues, 22), games: forValues.length };
}

function scheduleStrength(team, games, ratings) {
  return average(games.map((game) => ratings.get(normalizedNflTeam(opponentInGame(game, team)?.abbrev)) || 0));
}

function adjustedTeamProfile(team, games, evidence, ratings) {
  const offensePlays = evidence.filter((play) => normalizedNflTeam(play.offense) === normalizedNflTeam(team.abbrev));
  const defensePlays = evidence.filter((play) => normalizedNflTeam(play.defense) === normalizedNflTeam(team.abbrev));
  const offense = aggregatePlayProfile(offensePlays);
  const defense = aggregatePlayProfile(defensePlays);
  const sos = scheduleStrength(team, games, ratings);
  offense.adjustedSuccessRate = clamp(offense.successRate + sos * .004, .25, .65);
  offense.adjustedExplosiveRate = clamp(offense.explosiveRate + sos * .002, .04, .25);
  defense.adjustedSuccessRate = clamp(defense.successRate - sos * .004, .25, .65);
  defense.adjustedExplosiveRate = clamp(defense.explosiveRate - sos * .002, .04, .25);
  const offenseLine = clamp(50 + (offense.rushSuccessRate - .41) * 95 + (.07 - offense.sackRate) * 145 + (offense.yardsPerRush - 4.2) * 3 + sos * .35, 20, 80);
  const defenseFront = clamp(50 + (.41 - defense.rushSuccessRate) * 95 + (defense.sackRate - .07) * 145 + (4.2 - defense.yardsPerRush) * 3 + sos * .35, 20, 80);
  const secondary = clamp(50 + (.44 - defense.passSuccessRate) * 85 + (.14 - defense.explosivePassRate) * 110 + (defense.turnoverRate - .025) * 90 + sos * .35, 20, 80);
  return { team, games, offense, defense, scoring: scoringProfile(team, games), sos, units: { offenseLine, defenseFront, secondary }, baselineUnits: teamUnitRecord(team), scheme: teamSchemeRecord(team) };
}

const CALLER_PROFILE_FIELDS = ['passRate', 'earlyDownPassRate', 'thirdDownPassRate', 'redZonePassRate', 'successRate', 'passSuccessRate', 'rushSuccessRate', 'explosiveRate', 'explosivePassRate', 'sackRate', 'turnoverRate', 'yardsPerPlay', 'yardsPerPass', 'yardsPerRush', 'leftRunRate', 'middleRunRate', 'rightRunRate', 'manRate', 'zoneRate', 'pressureRate', 'blitzRate', 'shotgunRate', 'shotgunSuccessRate', 'nonShotgunSuccessRate', 'noHuddleRate'];

function compactCallerMetrics(profile) {
  return Object.fromEntries(CALLER_PROFILE_FIELDS.filter((field) => Number.isFinite(Number(profile?.[field]))).map((field) => [field, Number(profile[field])]));
}

function rememberCallerSample(name, side, team, season, profile) {
  if (!name || !profile?.plays) return;
  const sampleKey = `${normalizeStatKey(name)}|${side}|${normalizedNflTeam(team)}|${season}`;
  state.callerSamples[sampleKey] = { name, side, team: normalizedNflTeam(team), season, plays: profile.plays, metrics: compactCallerMetrics(profile), updatedAt: new Date().toISOString() };
  writeJson(key('callerSamples'), state.callerSamples);
}

function callerPrior(name, side, currentTeam) {
  const matches = Object.values(state.callerSamples).filter((sample) => normalizeStatKey(sample.name) === normalizeStatKey(name) && sample.side === side && normalizedNflTeam(sample.team) !== normalizedNflTeam(currentTeam));
  if (!matches.length) return null;
  const weight = matches.reduce((sum, sample) => sum + Math.max(1, Number(sample.plays) || 1), 0);
  const metrics = {};
  for (const field of CALLER_PROFILE_FIELDS) {
    const rows = matches.filter((sample) => Number.isFinite(Number(sample.metrics?.[field])));
    if (rows.length) metrics[field] = rows.reduce((sum, sample) => sum + Number(sample.metrics[field]) * Math.max(1, Number(sample.plays) || 1), 0) / rows.reduce((sum, sample) => sum + Math.max(1, Number(sample.plays) || 1), 0);
  }
  return { metrics, plays: weight, teams: [...new Set(matches.map((sample) => sample.team))], samples: matches.length };
}

async function transferredCallerPrior(name, side, currentTeam, targetGame, limit, ratings) {
  const learned = callerPrior(name, side, currentTeam);
  if (learned) return learned;
  const transfer = CALLER_TRANSFERS_2026[normalizeStatKey(name)];
  if (!transfer || transfer.side !== side || normalizedNflTeam(transfer.sourceTeam) === normalizedNflTeam(currentTeam)) return null;
  const cacheKey = `${normalizeStatKey(name)}|${side}|${targetGame?.id || state.selectedDate}|${limit}`;
  if (!callerTransferCache.has(cacheKey)) {
    callerTransferCache.set(cacheKey, (async () => {
      const sourceAbbrev = normalizedNflTeam(transfer.sourceTeam);
      let sourceGames;
      if (transfer.sourceSeason) {
        if (!historicalTransferGamesCache.has(transfer.sourceSeason)) {
          historicalTransferGamesCache.set(transfer.sourceSeason, Promise.all([
            fetchSeasonScoreboard(transfer.sourceSeason, '2').catch(() => []),
            fetchSeasonScoreboard(transfer.sourceSeason, '3').catch(() => []),
          ]).then(([regular, playoffs]) => [...regular, ...playoffs]));
        }
        const historicalGames = await historicalTransferGamesCache.get(transfer.sourceSeason);
        sourceGames = historicalGames.filter((game) => game.status?.type?.completed && gameIncludesTeam(game, { abbrev: sourceAbbrev })).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
      } else {
        sourceGames = recentGamesForTeam({ abbrev: sourceAbbrev }, targetGame, limit);
      }
      if (!sourceGames.length) return null;
      const sourceSummaries = await Promise.all(sourceGames.map(async (game) => ({ game, summary: await fetchForecastSummary(game) })));
      const sourceEvidence = evidenceFromSummaries(sourceSummaries.filter((item) => item.summary), []);
      const sourceTeam = state.teams.find((team) => normalizedNflTeam(team.abbrev) === sourceAbbrev)
        || [...sourceGames].flatMap((game) => [game.away, game.home]).find((team) => normalizedNflTeam(team.abbrev) === sourceAbbrev)
        || { abbrev: sourceAbbrev, name: sourceAbbrev };
      const sourceProfile = adjustedTeamProfile(sourceTeam, sourceGames, sourceEvidence, ratings)[side];
      if (!sourceProfile?.plays) return null;
      return { metrics: compactCallerMetrics(sourceProfile), plays: sourceProfile.plays, teams: [sourceAbbrev], samples: sourceGames.length, weight: transfer.weight, transfer: true, note: transfer.note };
    })());
  }
  return callerTransferCache.get(cacheKey);
}

function blendCallerProfile(observed, prior, weight = .65) {
  if (!prior) return { ...observed, callerPrior: null };
  const appliedWeight = Number.isFinite(Number(prior.weight)) ? Number(prior.weight) : weight;
  const blended = { ...observed };
  for (const field of CALLER_PROFILE_FIELDS) {
    if (Number.isFinite(Number(prior.metrics?.[field])) && Number.isFinite(Number(observed?.[field]))) blended[field] = Number(prior.metrics[field]) * appliedWeight + Number(observed[field]) * (1 - appliedWeight);
  }
  return { ...blended, callerPrior: prior, callerWeight: appliedWeight };
}

function coverageSplit(plays, type) {
  const rows = plays.filter((play) => play.type === 'pass' && play.manZone === type);
  const attempts = rows.filter((play) => !play.sack).length;
  return {
    attempts, plays: rows.length, completions: rows.filter((play) => play.complete).length,
    completionRate: attempts ? rows.filter((play) => play.complete).length / attempts : null,
    yardsPerPlay: rows.length ? average(rows.map((play) => play.yards)) : null,
    successRate: rows.length ? rows.filter((play) => play.success).length / rows.length : null,
    explosiveRate: rows.length ? rows.filter((play) => play.explosive).length / rows.length : null,
    sackRate: rows.length ? rows.filter((play) => play.sack).length / rows.length : null,
  };
}

function coverageProfile(team, evidence) {
  const offense = evidence.filter((play) => normalizedNflTeam(play.offense) === normalizedNflTeam(team.abbrev) && play.manZone);
  const defense = evidence.filter((play) => normalizedNflTeam(play.defense) === normalizedNflTeam(team.abbrev) && play.manZone);
  const baseline = teamSchemeRecord(team);
  const quarterbackCounts = new Map();
  offense.forEach((play) => { if (play.quarterback) quarterbackCounts.set(play.quarterback, (quarterbackCounts.get(play.quarterback) || 0) + 1); });
  const quarterback = [...quarterbackCounts].sort((a, b) => b[1] - a[1])[0]?.[0] || 'Team quarterback';
  const qbRows = offense.filter((play) => !play.quarterback || play.quarterback === quarterback);
  const familyCounts = new Map();
  defense.forEach((play) => { if (play.coverage) familyCounts.set(play.coverage, (familyCounts.get(play.coverage) || 0) + 1); });
  return {
    quarterback, offensePlays: offense.length || Number(baseline?.passVsMan?.plays || 0) + Number(baseline?.passVsZone?.plays || 0), defensePlays: defense.length || Number(baseline?.coveragePlays || 0),
    quarterbackMan: offense.length ? coverageSplit(qbRows, 'man') : baseline?.passVsMan || {}, quarterbackZone: offense.length ? coverageSplit(qbRows, 'zone') : baseline?.passVsZone || {},
    defenseManRate: defense.length ? defense.filter((play) => play.manZone === 'man').length / defense.length : baseline?.defenseManRate ?? null,
    defenseZoneRate: defense.length ? defense.filter((play) => play.manZone === 'zone').length / defense.length : baseline?.defenseZoneRate ?? null,
    families: [...familyCounts].sort((a, b) => b[1] - a[1]).slice(0, 4),
    pressureRate: baseline?.pressureRate ?? (defense.length ? defense.filter((play) => play.pressure).length / defense.length : null),
    blitzRate: baseline?.blitzRate ?? (defense.length ? defense.filter((play) => play.blitz).length / defense.length : null),
    baseFront: String(baseline?.baseFront || '').replace('-', '–') || 'Multiple', dataSource: defense.length ? 'sample charting' : baseline ? 'season baseline' : 'unavailable',
  };
}

function likelihoodLabel(value) {
  const probability = Number(value);
  if (probability >= .67) return 'Strong signal';
  if (probability >= .58) return 'Likely';
  if (probability >= .53) return 'Lean';
  return 'Near toss-up';
}

function coverageSplitGrade(split) {
  if (!Number(split?.plays)) return null;
  const epa = Number.isFinite(Number(split.epaPerPlay)) ? Number(split.epaPerPlay) : 0;
  const success = Number.isFinite(Number(split.successRate)) ? Number(split.successRate) : .45;
  const yards = Number.isFinite(Number(split.yardsPerPlay)) ? Number(split.yardsPerPlay) : 6.5;
  const raw = clamp(50 + epa * 38 + (success - .45) * 65 + (yards - 6.5) * 1.7, 22, 86);
  const reliability = clamp(Number(split.plays) / 120, .28, 1);
  return 50 + (raw - 50) * reliability;
}

function schemePassMatchup(offense, defense) {
  const manGrade = coverageSplitGrade(offense.scheme?.passVsMan); const zoneGrade = coverageSplitGrade(offense.scheme?.passVsZone);
  const rawMan = Number(defense.coverage?.defenseManRate); const rawZone = Number(defense.coverage?.defenseZoneRate); const rateTotal = (Number.isFinite(rawMan) ? rawMan : 0) + (Number.isFinite(rawZone) ? rawZone : 0);
  const manRate = rateTotal ? (Number.isFinite(rawMan) ? rawMan : 0) / rateTotal : .35; const zoneRate = rateTotal ? (Number.isFinite(rawZone) ? rawZone : 0) / rateTotal : .65;
  const available = [[manGrade,manRate],[zoneGrade,zoneRate]].filter(([grade])=>Number.isFinite(grade)); const availableRate = available.reduce((sum,[,usage])=>sum+usage,0);
  const expectedGrade = available.length ? available.reduce((sum,[grade,usage])=>sum+grade*(availableRate?usage/availableRate:1/available.length),0) : 50;
  const neutralGrade = available.length ? average(available.map(([grade])=>grade),50) : 50; const coverageEdge = expectedGrade-neutralGrade; const pointAdjustment = clamp(coverageEdge*.16,-2,2); const primaryCoverage = zoneRate >= manRate ? 'zone' : 'man'; const primaryRate = Math.max(zoneRate,manRate); const primaryGrade = primaryCoverage==='zone' ? zoneGrade : manGrade;
  return { manGrade,zoneGrade,manRate,zoneRate,expectedGrade,neutralGrade,coverageEdge,pointAdjustment,primaryCoverage,primaryRate,primaryGrade };
}

function teamUnitMatchup(offense, defense) {
  const passAttack=average([leagueRankStrength(offense.team,'passGame'),leagueRankStrength(offense.team,'pocketProtection'),offense.units.offenseLine]); const passStop=average([leagueRankStrength(defense.team,'passDefense'),leagueRankStrength(defense.team,'passRush'),defense.units.secondary]);
  const runAttack=average([leagueRankStrength(offense.team,'runGame'),offense.units.offenseLine]); const runStop=average([leagueRankStrength(defense.team,'runDefense'),defense.units.defenseFront]); const passEdge=passAttack-passStop; const runEdge=runAttack-runStop; const edge=passEdge*.62+runEdge*.38;
  return { passAttack,passStop,runAttack,runStop,passEdge,runEdge,edge,pointAdjustment:clamp(edge*.07,-2.8,2.8) };
}

function playerGradeMatchup(personnel, offenseSide, defenseSide) {
  if (!personnel?.starters?.[offenseSide] || !personnel?.starters?.[defenseSide]) return { passAttack:68,passStop:68,runAttack:68,runStop:68,passEdge:0,runEdge:0,edge:0,pointAdjustment:0 };
  const qb=starterGradeAverage(personnel,offenseSide,'offense',/^QB$/); const targets=starterGradeAverage(personnel,offenseSide,'offense',/^(WR|LWR|RWR|SWR|SLWR|SRWR|TE)$/); const backs=starterGradeAverage(personnel,offenseSide,'offense',/^(RB|HB|FB)$/); const line=starterGradeAverage(personnel,offenseSide,'offense',/^(LT|LG|C|RG|RT|T|OT|G|OG|OL)$/); const front=starterGradeAverage(personnel,defenseSide,'defense',/^(DE|LDE|RDE|DT|LDT|RDT|NT|DL|EDGE|LB|ILB|MLB|OLB|WLB|SLB)$/); const coverage=starterGradeAverage(personnel,defenseSide,'defense',/^(CB|LCB|RCB|SCB|NB|DB|S|FS|SS)$/);
  const passAttack=average([qb,targets,line]); const passStop=average([front,coverage]); const runAttack=average([backs,line]); const runStop=front; const passEdge=passAttack-passStop; const runEdge=runAttack-runStop; const edge=passEdge*.62+runEdge*.38;
  return { qb,targets,backs,line,front,coverage,passAttack,passStop,runAttack,runStop,passEdge,runEdge,edge,pointAdjustment:clamp(edge*.05,-2.2,2.2) };
}

function matchupModel(game, away, home, personnel = null) {
  const teamProjection = (offense, defense, offenseSide, defenseSide, homeField = 0) => {
    const rosterOffense = Number(offense.roster?.offenseAdjustment) || 0; const rosterDefense = Number(defense.roster?.defenseAdjustment) || 0; const lineDelta = Number(offense.roster?.lineDelta) || 0; const opponentFrontDelta = Number(defense.roster?.frontDelta) || 0; const skillDelta = Number(offense.roster?.skillDelta) || 0; const opponentSecondaryDelta = Number(defense.roster?.secondaryDelta) || 0; const offenseContinuity=Number(offense.roster?.offenseContinuity) || 1; const defenseContinuity=Number(defense.roster?.defenseContinuity) || 1;
    const continuityAdjustedFor=offense.scoring.pointsFor*offenseContinuity+22*(1-offenseContinuity); const continuityAdjustedAgainst=defense.scoring.pointsAgainst*defenseContinuity+22*(1-defenseContinuity); const baselinePoints = (continuityAdjustedFor * .52) + (continuityAdjustedAgainst * .48) + ((offense.sos - defense.sos) * .12) + homeField;
    const rosterPointAdjustment = rosterOffense * .32 - rosterDefense * .28;
    const schemeMatchup=schemePassMatchup(offense,defense); const unitMatchup=teamUnitMatchup(offense,defense); const playerMatchup=playerGradeMatchup(personnel,offenseSide,defenseSide); const schemePointAdjustment=schemeMatchup.pointAdjustment; const unitPointAdjustment=unitMatchup.pointAdjustment; const playerPointAdjustment=playerMatchup.pointAdjustment; const matchupPointAdjustment=schemePointAdjustment+unitPointAdjustment+playerPointAdjustment;
    const points = clamp(baselinePoints + rosterPointAdjustment + matchupPointAdjustment,8,42);
    const passRate = clamp(offense.offense.passRate * .58 + defense.defense.passRate * .42, .35, .76);
    const earlyPass = clamp(offense.offense.earlyDownPassRate * .62 + defense.defense.earlyDownPassRate * .38, .30, .78);
    const pressure = clamp(offense.offense.sackRate * .48 + defense.defense.sackRate * .52 + (opponentFrontDelta-lineDelta)*.0016, .025, .17);
    const runSuccess = clamp(offense.offense.rushSuccessRate * .55 + defense.defense.rushSuccessRate * .45 + (lineDelta+skillDelta*.35-opponentFrontDelta)*.0014, .25, .62);
    const explosivePass = clamp(offense.offense.explosivePassRate * .55 + defense.defense.explosivePassRate * .45 + (skillDelta-opponentSecondaryDelta)*.0012 + schemeMatchup.coverageEdge*.001, .05, .28);
    const turnover = clamp(offense.offense.turnoverRate * .55 + defense.defense.turnoverRate * .45, .008, .09);
    const redZonePass = clamp(offense.offense.redZonePassRate * .6 + defense.defense.redZonePassRate * .4, .25, .75);
    return { points, baselinePoints, rosterPointAdjustment, schemePointAdjustment,unitPointAdjustment,playerPointAdjustment,matchupPointAdjustment,schemeMatchup,unitMatchup,playerMatchup,offenseContinuity,defenseContinuity,passRate, earlyPass, pressure, runSuccess, explosivePass, turnover, redZonePass };
  };
  const awayProjection = teamProjection(away, home, 'away', 'home');
  const homeProjection = teamProjection(home, away, 'home', 'away', 1.35);
  const margin = homeProjection.points - awayProjection.points;
  const homeWin = clamp(1 / (1 + Math.exp(-margin / 6.5)), .08, .92);
  const outcomes = [];
  const addDirectional = (team, metric, value, highLabel, lowLabel, explanation, formula, definition = 'Matchup index, not a betting probability.') => {
    const high = value >= .5;
    const probability = high ? value : 1 - value;
    outcomes.push({ team, metric, probability, title: high ? highLabel : lowLabel, explanation, formula, definition });
  };
  for (const [profile, opponent, projection] of [[away,home,awayProjection],[home,away,homeProjection]]) {
    const name = profile.team.abbrev;
    addDirectional(name,'CALL',projection.earlyPass,`${name} early-down pass`,`${name} early-down run`,'Expected first/second-down call share.',`62% ${name} call history (${percent(profile.offense.earlyDownPassRate)}) + 38% ${opponent.team.abbrev} defensive tendency (${percent(opponent.defense.earlyDownPassRate)}) = ${percent(projection.earlyPass)}.`, 'Expected share of early-down calls, not the chance one specific play is a pass.');
    addDirectional(name,'SCRIPT',projection.passRate,`${name} pass-heavy script`,`${name} run-heavy script`,'Expected dropback share after caller and opponent blending.',`58% ${name} offense (${percent(profile.offense.passRate)}) + 42% ${opponent.team.abbrev} defense (${percent(opponent.defense.passRate)}) = ${percent(projection.passRate)}.`, 'Expected share of offensive plays that become dropbacks.');
    addDirectional(name,'PRESSURE',clamp(.50+(projection.pressure-.07)*4.2,.36,.79),`${name} QB pressured`,`${name} QB kept cleaner`,'Pass protection matched with the opposing rush.',`48% ${name} sack exposure (${percent(profile.offense.sackRate,1)}) + 52% ${opponent.team.abbrev} sack creation (${percent(opponent.defense.sackRate,1)}) = ${percent(projection.pressure,1)} raw risk; 7% raw risk is centered at a 50 index.`);
    addDirectional(name,'EXPLOSIVE',clamp(.50+(projection.explosivePass-.14)*2.7,.35,.78),`${name} explosive pass`,`${name} explosive passing limited`,'15+ yard pass production matched with explosives allowed.',`55% ${name} explosive rate (${percent(profile.offense.explosivePassRate,1)}) + 45% ${opponent.team.abbrev} allowed (${percent(opponent.defense.explosivePassRate,1)}) = ${percent(projection.explosivePass,1)} raw; 14% is centered at a 50 index.`);
  }
  return { away: awayProjection, home: homeProjection, homeWin, outcomes: outcomes.sort((a, b) => Math.abs(b.probability - .5) - Math.abs(a.probability - .5)).slice(0, 6) };
}

function compactForecastFromDeep(result) {
  const { game, model } = result; const homeWin = model.homeWin; const awayWin = 1 - homeWin;
  const favorite = homeWin >= .5 ? game.home : game.away;
  return {
    awayPoints: model.away.points, homePoints: model.home.points, homeWin, awayWin, favorite,
    favoriteWin: Math.max(homeWin, awayWin), topEdge: model.outcomes[0]?.title || 'No dominant unit edge',
    sampleGames: result.sampleGames.length, baselineSeason: result.coverageSeason, fullModel: true,
  };
}

async function buildForecastForGame(game, { sampleSize = 6, loadCoverage = false, coverageProgress = null } = {}) {
  const cacheKey = `deep:${game.id}:${sampleSize}:${loadCoverage || state.forecastCoverageSeason === analysisSeasonForGame(game) ? 'coverage' : 'public'}`;
  if (state.gameForecastCache.has(cacheKey)) return state.gameForecastCache.get(cacheKey);
  const awayGames = recentGamesForTeam(game.away, game, sampleSize); const homeGames = recentGamesForTeam(game.home, game, sampleSize);
  const sampleGames = [...new Map([...awayGames, ...homeGames].map((item) => [item.id, item])).values()];
  const [summaries, personnel] = await Promise.all([Promise.all(sampleGames.map(async (sampleGame) => ({ game: sampleGame, summary: await fetchForecastSummary(sampleGame) }))),loadMatchupPersonnel(game).catch(() => null)]);
  let participationRows = []; let coverageError = ''; const coverageSeason = analysisSeasonForGame(game);
  if (loadCoverage || state.forecastCoverageSeason === coverageSeason) {
    coverageProgress?.();
    try {
      participationRows = await fetchParticipationForGames(coverageSeason, new Set(sampleGames.map((sampleGame) => String(sampleGame.id))));
      state.forecastCoverageSeason = coverageSeason;
    } catch (error) { coverageError = `Charted coverage could not load: ${error.message}`; }
  }
  const evidence = evidenceFromSummaries(summaries.filter((item) => item.summary), participationRows); const ratings = teamPowerRatings(game);
  const away = adjustedTeamProfile(game.away, awayGames, evidence, ratings); const home = adjustedTeamProfile(game.home, homeGames, evidence, ratings); const season = analysisSeasonForGame(game);
  for (const profile of [away, home]) {
    const historicalStaff = historicalStaffForTeam(profile.team.abbrev, season);
    rememberCallerSample(historicalStaff.offense, 'offense', profile.team.abbrev, season, profile.offense);
    rememberCallerSample(historicalStaff.defense, 'defense', profile.team.abbrev, season, profile.defense);
    const staff = staffForTeam(profile.team.abbrev);
    const [offensePrior, defensePrior] = await Promise.all([
      transferredCallerPrior(staff.offense, 'offense', profile.team.abbrev, game, sampleSize, ratings),
      transferredCallerPrior(staff.defense, 'defense', profile.team.abbrev, game, sampleSize, ratings),
    ]);
    profile.observedOffense = profile.offense; profile.observedDefense = profile.defense; profile.offense = blendCallerProfile(profile.offense, offensePrior); profile.defense = blendCallerProfile(profile.defense, defensePrior);
    profile.staff = staff; profile.offensePrior = offensePrior; profile.defensePrior = defensePrior; profile.coverage = coverageProfile(profile.team, evidence);
  }
  if (personnel) { applyRosterEvolution(away,personnel,'away'); applyRosterEvolution(home,personnel,'home'); }
  const result = { game, away, home, personnel, sampleGames, evidence, coverageRows: participationRows.length, coverageSeason, coverageError, model: matchupModel(game, away, home, personnel), createdAt: new Date(), baseline: nflWeekContext(game.date || state.selectedDate) };
  state.gameForecastCache.set(cacheKey, result);
  state.gameForecastCache.set(`quick:${game.id}`, compactForecastFromDeep(result));
  if (state.page === 'scoreboard' && state.games.some((item) => item.id === game.id)) requestAnimationFrame(renderScoreboard);
  return result;
}

async function primeSlateForecasts() {
  const token=++slateForecastPrimeToken; const games=state.games.filter((game)=>game.status?.type?.state==='pre');
  for (let index=0;index<games.length;index+=4) { if (token!==slateForecastPrimeToken) return; await Promise.all(games.slice(index,index+4).map((game)=>buildForecastForGame(game,{sampleSize:6}).catch(()=>null))); }
}

async function analyzeForecast({ loadCoverage = false } = {}) {
  const game = selectedForecastGame();
  if (!game || state.forecastLoading) return;
  state.forecastLoading = true; state.forecastError = '';
  if (!loadCoverage) state.forecastResult = null;
  renderForecast();
  try {
    const sampleSize = Number(els.forecastSampleSize?.value) || 6;
    state.forecastResult = await buildForecastForGame(game, { sampleSize, loadCoverage, coverageProgress: () => { state.forecastCoverageLoading = true; renderForecast(); } });
  } catch (error) {
    state.forecastError = error.message || 'Forecast analysis failed.';
  } finally {
    state.forecastLoading = false; state.forecastCoverageLoading = false; renderForecast();
  }
}

function forecastTeamOption(game) {
  return `${game.away.abbrev} at ${game.home.abbrev} · ${game.dateText || statusText(game)}`;
}

function forecastGrade(value) {
  const score = Math.round(Number(value) || 50);
  return { score, label: score >= 64 ? 'Advantage' : score >= 55 ? 'Above average' : score <= 36 ? 'Liability' : score <= 45 ? 'Below average' : 'Neutral' };
}

function probabilityRing(value, label) {
  const amount = Math.round(clamp(value) * 100);
  return `<div class="probability-ring" style="--probability:${amount}"><div><b>${amount}%</b><span>${escapeHtml(label)}</span></div></div>`;
}

function renderForecast() {
  if (!els.forecastGameSelect) return;
  if (!state.games.length) {
    els.forecastGameSelect.innerHTML = '<option>No games on this slate</option>';
    els.forecastStatus.innerHTML = '<div class="empty">Choose a slate with NFL games to build a matchup forecast.</div>';
    [els.forecastHero, els.forecastLikely, els.forecastTendencies, els.forecastUnits, els.forecastCoverage, els.forecastCoaches].forEach((element) => { element.innerHTML = ''; });
    return;
  }
  if (!state.forecastGameId || !state.games.some((game) => game.id === state.forecastGameId)) state.forecastGameId = state.games[0].id;
  els.forecastGameSelect.innerHTML = state.games.map((game) => `<option value="${escapeHtml(game.id)}" ${game.id === state.forecastGameId ? 'selected' : ''}>${escapeHtml(forecastTeamOption(game))}</option>`).join('');
  const game = selectedForecastGame();
  if (state.forecastLoading) {
    els.forecastStatus.innerHTML = `<div class="forecast-loading"><span></span><div><strong>${state.forecastCoverageLoading ? 'Joining charted coverage' : 'Reading recent play-by-play'}</strong><small>${escapeHtml(game?.away?.abbrev || '')} and ${escapeHtml(game?.home?.abbrev || '')} · opponent adjustment · play-caller transfer</small></div></div>`;
    return;
  }
  if (state.forecastError) {
    els.forecastStatus.innerHTML = `<div class="forecast-alert bad"><strong>Analysis stopped</strong><span>${escapeHtml(state.forecastError)}</span></div>`;
    return;
  }
  const result = state.forecastResult;
  if (!result || result.game.id !== game.id) {
    els.forecastStatus.innerHTML = '<div class="forecast-intro"><strong>Ready to analyze</strong><span>The lab will read recent completed games for both teams and show the evidence behind every lean.</span></div>';
    els.forecastHero.innerHTML = forecastEmptyHero(game);
    els.forecastLikely.innerHTML = '';
    els.forecastTendencies.innerHTML = '';
    els.forecastUnits.innerHTML = '';
    els.forecastCoverage.innerHTML = '';
    els.forecastCoaches.innerHTML = '';
    return;
  }
  const minGames = Math.min(result.away.games.length, result.home.games.length);
  const minPlays = Math.min(result.away.observedOffense.plays, result.home.observedOffense.plays);
  const confidence = minGames >= 6 && minPlays >= 300 ? 'Solid sample' : minGames >= 4 && minPlays >= 180 ? 'Developing sample' : 'Thin sample';
  els.forecastStatus.innerHTML = `<div class="forecast-data-line"><span class="evidence-chip observed">Observed · ${result.sampleGames.length} games</span><span class="evidence-chip adjusted">Opponent adjusted</span><span class="evidence-chip ${result.coverageRows ? 'charted' : 'muted'}">${result.coverageRows ? `Charted · ${result.coverageRows} rows` : 'Coverage not loaded'}</span><span class="evidence-chip">${confidence}</span>${result.coverageError ? `<span class="coverage-error">${escapeHtml(result.coverageError)}</span>` : ''}</div>`;
  els.forecastHero.innerHTML = forecastHeroHtml(result);
  els.forecastLikely.innerHTML = result.model.outcomes.map(forecastOutcomeHtml).join('');
  els.forecastTendencies.innerHTML = forecastTendenciesHtml(result);
  els.forecastUnits.innerHTML = forecastUnitsHtml(result);
  els.forecastCoverage.innerHTML = forecastCoverageHtml(result);
  els.forecastCoaches.innerHTML = forecastCoachesHtml(result);
}

function forecastEmptyHero(game) {
  if (!game) return '';
  return `<section class="forecast-matchup-card is-empty" style="--away-color:${escapeHtml(game.away.color)};--home-color:${escapeHtml(game.home.color)}">
    <div class="forecast-team"><img src="${escapeHtml(game.away.logo)}" alt=""><strong>${escapeHtml(game.away.abbrev)}</strong><span>${escapeHtml(game.away.record || 'Away')}</span></div>
    <div class="forecast-vs"><span>Pregame model</span><b>VS</b><small>Run the analysis to reveal the strongest signals</small></div>
    <div class="forecast-team home"><img src="${escapeHtml(game.home.logo)}" alt=""><strong>${escapeHtml(game.home.abbrev)}</strong><span>${escapeHtml(game.home.record || 'Home')}</span></div>
  </section>`;
}

function forecastHeroHtml(result) {
  const { game, model } = result;
  const awayWin = 1 - model.homeWin;
  const favorite = model.homeWin >= .5 ? game.home.abbrev : game.away.abbrev;
  const favoriteWin = Math.max(model.homeWin, awayWin);
  return `<section class="forecast-matchup-card" style="--away-color:${escapeHtml(game.away.color)};--home-color:${escapeHtml(game.home.color)}">
    <div class="forecast-team"><img src="${escapeHtml(game.away.logo)}" alt=""><strong>${escapeHtml(game.away.abbrev)}</strong><span>${model.away.points.toFixed(1)} projected · ${percent(awayWin)}</span></div>
    <div class="forecast-vs">${probabilityRing(favoriteWin, `${favorite} win lean`)}<strong>${escapeHtml(favorite)} has the clearer path</strong><small>Expected band: ${Math.max(0, model.away.points - 6).toFixed(0)}–${(model.away.points + 6).toFixed(0)} vs ${Math.max(0, model.home.points - 6).toFixed(0)}–${(model.home.points + 6).toFixed(0)}</small></div>
    <div class="forecast-team home"><img src="${escapeHtml(game.home.logo)}" alt=""><strong>${escapeHtml(game.home.abbrev)}</strong><span>${model.home.points.toFixed(1)} projected · ${percent(model.homeWin)}</span></div>
  </section>`;
}

function forecastOutcomeHtml(outcome) {
  const amount = Math.round(clamp(outcome.probability) * 100);
  return `<article class="likely-card team-likely-card" style="${teamPaletteVars(outcome.team)}"><header><span>${escapeHtml(outcome.team)} · ${escapeHtml(outcome.metric)}</span><b>${likelihoodLabel(outcome.probability)}</b></header><strong>${escapeHtml(outcome.title)}</strong><div class="likelihood-track"><i style="width:${amount}%"></i></div><div class="likely-value"><b>${amount}%</b><span>edge index</span></div>${outcome.formula ? `<details><summary>Inputs</summary><p>${escapeHtml(outcome.formula)}</p></details>` : ''}</article>`;
}

function tendencyRow(label, awayValue, homeValue, note) {
  const away = clamp(awayValue); const home = clamp(homeValue);
  return `<div class="tendency-row"><div><strong>${escapeHtml(label)}</strong><small>${escapeHtml(note)}</small></div><div class="tendency-team away"><b>${percent(away)}</b><span><i style="width:${Math.round(away * 100)}%"></i></span></div><div class="tendency-team home"><b>${percent(home)}</b><span><i style="width:${Math.round(home * 100)}%"></i></span></div></div>`;
}

function matchupCallMetric(offense, defense, field) {
  return clamp(Number(offense.offense[field]) * .6 + Number(defense.defense[field]) * .4);
}

function forecastTendenciesHtml(result) {
  const { away, home, model } = result;
  return `<section class="forecast-panel" style="--away-color:${escapeHtml(away.team.color)};--home-color:${escapeHtml(home.team.color)}"><header class="forecast-section-head"><div><span class="eyebrow">Situational call sheet</span><h2>What each offense is likely to call</h2></div><div class="tendency-legend"><b style="--team:${escapeHtml(away.team.color)}">${escapeHtml(away.team.abbrev)}</b><b style="--team:${escapeHtml(home.team.color)}">${escapeHtml(home.team.abbrev)}</b></div></header>
    <div class="tendency-table">
      ${tendencyRow('Overall pass', model.away.passRate, model.home.passRate, 'Dropbacks including scrambles and sacks')}
      ${tendencyRow('Early-down pass', model.away.earlyPass, model.home.earlyPass, 'First and second down')}
      ${tendencyRow('Third-down pass', matchupCallMetric(away, home, 'thirdDownPassRate'), matchupCallMetric(home, away, 'thirdDownPassRate'), 'All third downs in the sample')}
      ${tendencyRow('Red-zone pass', model.away.redZonePass, model.home.redZonePass, 'Inside the opponent 20')}
      ${tendencyRow('Run up the middle', matchupCallMetric(away, home, 'middleRunRate'), matchupCallMetric(home, away, 'middleRunRate'), 'Share of designed runs with known direction')}
      ${tendencyRow('Play success', (away.offense.adjustedSuccessRate + (1 - home.defense.adjustedSuccessRate)) / 2, (home.offense.adjustedSuccessRate + (1 - away.defense.adjustedSuccessRate)) / 2, 'Down-and-distance success proxy, adjusted for schedule')}
    </div>
  </section>`;
}

function unitCard(team, label, value, opponentLabel, opponentValue, description) {
  const grade = forecastGrade(value); const opponent = forecastGrade(opponentValue); const edge = Math.round(value - opponentValue);
  return `<article class="unit-card" style="--team-color:${escapeHtml(team.color)}"><header><img src="${escapeHtml(team.logo)}" alt=""><div><span>${escapeHtml(team.abbrev)}</span><strong>${escapeHtml(label)}</strong></div><b>${grade.score}</b></header><div class="unit-grade-track"><i style="width:${grade.score}%"></i><em>50</em></div><div class="unit-edge ${edge >= 0 ? 'positive' : 'negative'}"><strong>${edge >= 0 ? '+' : ''}${edge}</strong><span>vs ${escapeHtml(opponentLabel)} ${opponent.score}</span></div><p>${escapeHtml(description)} · ${grade.label}.</p></article>`;
}

function passAttackGrade(profile) {
  return clamp(50 + (profile.offense.passSuccessRate - .44) * 90 + (profile.offense.explosivePassRate - .14) * 110 + (7 - profile.offense.yardsPerPass) * -2, 20, 80);
}

function forecastUnitsHtml(result) {
  const { away, home } = result;
  return `<section class="forecast-panel"><header class="forecast-section-head"><div><span class="eyebrow">Opponent-adjusted units</span><h2>Trenches and secondary</h2></div><span class="method-tag">Recent opponents weighted by schedule strength</span></header><div class="unit-grid">
    ${unitCard(away.team, 'Offensive line', away.units.offenseLine, `${home.team.abbrev} front`, home.units.defenseFront, 'Rush success plus sack avoidance')}
    ${unitCard(home.team, 'Defensive front', home.units.defenseFront, `${away.team.abbrev} OL`, away.units.offenseLine, 'Rush suppression plus sack creation')}
    ${unitCard(home.team, 'Offensive line', home.units.offenseLine, `${away.team.abbrev} front`, away.units.defenseFront, 'Rush success plus sack avoidance')}
    ${unitCard(away.team, 'Defensive front', away.units.defenseFront, `${home.team.abbrev} OL`, home.units.offenseLine, 'Rush suppression plus sack creation')}
    ${unitCard(away.team, 'Secondary', away.units.secondary, `${home.team.abbrev} pass`, passAttackGrade(home), 'Pass success, explosives allowed, and takeaways')}
    ${unitCard(home.team, 'Secondary', home.units.secondary, `${away.team.abbrev} pass`, passAttackGrade(away), 'Pass success, explosives allowed, and takeaways')}
  </div></section>`;
}

function coverageSplitBlock(label, split) {
  if (!split?.plays) return `<div class="coverage-split empty-split"><strong>${escapeHtml(label)}</strong><span>No charted attempts</span></div>`;
  return `<div class="coverage-split"><strong>${escapeHtml(label)}</strong><div><span>Comp</span><b>${percent(split.completionRate)}</b></div><div><span>Y/play</span><b>${split.yardsPerPlay.toFixed(1)}</b></div><div><span>Success</span><b>${percent(split.successRate)}</b></div><small>${split.plays} charted dropbacks</small></div>`;
}

function coverageTeamHtml(profile) {
  const coverage = profile.coverage;
  const families = coverage.families.length ? coverage.families.map(([name, count]) => `<span><b>${escapeHtml(name)}</b>${count}</span>`).join('') : '<span>No named shells in this sample</span>';
  return `<article class="coverage-deep-card" style="--team-color:${escapeHtml(profile.team.color)}"><header><img src="${escapeHtml(profile.team.logo)}" alt=""><div><span>${escapeHtml(profile.team.abbrev)} quarterback</span><strong>${escapeHtml(coverage.quarterback)}</strong></div></header><div class="qb-coverage-grid">${coverageSplitBlock('vs man', coverage.quarterbackMan)}${coverageSplitBlock('vs zone', coverage.quarterbackZone)}</div><div class="defense-call-strip"><div><span>Defense man</span><b>${percent(coverage.defenseManRate)}</b></div><div><span>Defense zone</span><b>${percent(coverage.defenseZoneRate)}</b></div><div><span>Pressure</span><b>${percent(coverage.pressureRate)}</b></div><div><span>5+ rushers</span><b>${percent(coverage.blitzRate)}</b></div></div><div class="coverage-family-list">${families}</div></article>`;
}

function forecastCoverageHtml(result) {
  const hasCharting = result.coverageRows > 0 && (result.away.coverage.offensePlays + result.home.coverage.offensePlays > 0);
  if (!hasCharting) return `<section class="forecast-panel coverage-gate"><div><span class="eyebrow">Deep coverage layer</span><h2>Man, zone, shell, formation, and pressure</h2><p>${state.forecastCoverageSeason === result.coverageSeason ? 'The season file loaded, but none of the sampled plays matched charted participation rows.' : `Load ${result.coverageSeason} nflverse participation data to add verified coverage calls. This can be a larger one-time download.`}</p></div><button type="button" data-load-forecast-coverage ${state.forecastCoverageLoading ? 'disabled' : ''}>${state.forecastCoverageLoading ? 'Loading charting…' : 'Add charted coverage'}</button><small>FTN Data via nflverse (2023 onward), CC BY-SA 4.0. Coverage is never inferred from the play description.</small></section>`;
  return `<section class="forecast-panel"><header class="forecast-section-head"><div><span class="eyebrow">Charted coverage layer</span><h2>Quarterback splits and defensive calls</h2></div><span class="method-tag charted">FTN Data via nflverse · ${result.coverageSeason}</span></header><div class="coverage-deep-grid">${coverageTeamHtml(result.away)}${coverageTeamHtml(result.home)}</div></section>`;
}

function coachCard(profile, side) {
  const name = profile.staff[side]; const prior = side === 'offense' ? profile.offensePrior : profile.defensePrior;
  const callProfile = side === 'offense' ? profile.offense : profile.defense;
  const callerWeight = Math.round(Number(callProfile.callerWeight || prior?.weight || .65) * 100);
  const summary = side === 'offense'
    ? `${percent(callProfile.earlyDownPassRate)} early-down pass · ${percent(callProfile.redZonePassRate)} red-zone pass`
    : callProfile.manRate != null ? `${percent(callProfile.manRate)} man · ${percent(callProfile.blitzRate)} 5+ rushers` : `${percent(callProfile.sackRate)} sacks/dropback · ${percent(callProfile.rushSuccessRate)} rush success allowed`;
  return `<article class="coach-card" style="--team-color:${escapeHtml(profile.team.color)}"><header><img src="${escapeHtml(profile.team.logo)}" alt=""><div><span>${escapeHtml(profile.team.abbrev)} ${side === 'offense' ? 'offensive' : 'defensive'} caller</span><input type="text" value="${escapeHtml(name)}" data-staff-input data-team="${escapeHtml(profile.team.abbrev)}" data-side="${side}" aria-label="${escapeHtml(profile.team.abbrev)} ${side} play caller"></div></header><p>${escapeHtml(summary)}</p><div class="caller-history"><strong>${prior ? 'Portable caller prior active' : 'Learning team sample'}</strong><span>${prior ? `${callerWeight}% weight from ${prior.teams.join(', ')} · ${prior.plays} plays${prior.note ? ` · ${prior.note}` : ''}` : `${callProfile.plays} observed plays · assign this name elsewhere to carry the fingerprint`}</span></div></article>`;
}

function forecastCoachesHtml(result) {
  return `<section class="forecast-panel"><header class="forecast-section-head"><div><span class="eyebrow">Play-caller fingerprints</span><h2>The coach moves; the prior moves too</h2></div><span class="method-tag">Active 2026 callers · editable</span></header><p class="panel-copy">Game-day play callers are weighted ahead of coordinator titles. Established transfers carry 65% of their former-team fingerprint; first-time callers carry a lighter 45% coaching-tree prior. Correct a name below if duties change.</p><div class="coach-grid">${coachCard(result.away, 'offense')}${coachCard(result.home, 'offense')}${coachCard(result.away, 'defense')}${coachCard(result.home, 'defense')}</div></section>`;
}

const COVERAGE_COLUMNS = ['date', 'game_id', 'offense_team', 'defense_team', 'receiver', 'receiver_id', 'receiver_tier', 'defender', 'defender_id', 'defender_tier', 'receiver_alignment', 'coverage_type', 'routes', 'targets', 'receptions', 'yards', 'touchdowns', 'interceptions', 'passer_rating', 'source'];

function normalizeCoverageRow(row = {}) {
  const clean = {};
  for (const column of COVERAGE_COLUMNS) clean[column] = String(row[column] ?? row[normalizeStatKey(column)] ?? '').trim();
  for (const column of ['routes', 'targets', 'receptions', 'yards', 'touchdowns', 'interceptions', 'passer_rating']) {
    clean[column] = clean[column] === '' ? null : Number(clean[column]);
  }
  clean.offense_team = clean.offense_team.toUpperCase();
  clean.defense_team = clean.defense_team.toUpperCase();
  return clean;
}

function coverageRowValid(row) {
  return row.receiver && row.defender && row.offense_team && row.defense_team && (row.date || row.game_id);
}

function parseCsv(text) {
  const lines = String(text).replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];
  const cells = (line) => {
    const output = []; let value = ''; let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"' && quoted && line[i + 1] === '"') { value += '"'; i += 1; }
      else if (char === '"') quoted = !quoted;
      else if (char === ',' && !quoted) { output.push(value); value = ''; }
      else value += char;
    }
    output.push(value); return output;
  };
  const headers = cells(lines.shift()).map((value) => normalizeStatKey(value));
  return lines.map((line) => Object.fromEntries(cells(line).map((value, index) => [headers[index], value])));
}

const NFLVERSE_TEAM_ALIASES = { JAC: 'JAX', WSH: 'WAS', LAR: 'LA' };
function normalizedNflTeam(value) { const team = String(value || '').toUpperCase(); return NFLVERSE_TEAM_ALIASES[team] || team; }
function snapshotTeamUnits() { return Array.isArray(window.NFL_EVIDENCE_SNAPSHOT?.teamUnits) ? window.NFL_EVIDENCE_SNAPSHOT.teamUnits : []; }
function snapshotTeamSchemes() { return Array.isArray(window.NFL_EVIDENCE_SNAPSHOT?.teamSchemes) ? window.NFL_EVIDENCE_SNAPSHOT.teamSchemes : []; }
function teamUnitRecord(team) { return snapshotTeamUnits().find((row) => normalizedNflTeam(row.team) === normalizedNflTeam(team?.abbrev || team)) || null; }
function teamSchemeRecord(team) { return snapshotTeamSchemes().find((row) => normalizedNflTeam(row.team) === normalizedNflTeam(team?.abbrev || team)) || null; }
function nestedNumber(row, path) { const value = String(path).split('.').reduce((current, field) => current?.[field],row); return Number.isFinite(Number(value)) ? Number(value) : null; }

const TEAM_RANK_DEFINITIONS = {
  runGame: { label:'Run Game', fields:[['runGame.epaPerCarry',.55,1],['runGame.yardsPerCarry',.25,1],['runGame.firstDownRate',.20,1]] },
  passGame: { label:'Pass Game', fields:[['passGame.epaPerDropback',.45,1],['passGame.yardsPerDropback',.25,1],['passGame.cpoe',.20,1],['passGame.interceptionRate',.10,-1]] },
  pocketProtection: { label:'Pocket Protection', fields:[['pocketProtection.sackRate',1,-1]] },
  passDefense: { label:'Pass Defense', fields:[['passDefense.epaPerDropback',.50,-1],['passDefense.yardsPerDropback',.25,-1],['passDefense.touchdownRate',.10,-1],['passDefense.interceptionRate',.15,1]] },
  passRush: { label:'Pass Rush', fields:[['passRush.sackRate',.65,1],['passRush.hitRate',.35,1]] },
  runDefense: { label:'Run Defense', fields:[['runDefense.epaPerCarry',.45,-1],['runDefense.yardsPerCarry',.25,-1],['runDefense.firstDownRate',.15,-1],['runDefense.tackleForLossRate',.15,1]] },
};

function teamRankRows(metric) {
  const definition = TEAM_RANK_DEFINITIONS[metric]; const rows = snapshotTeamUnits(); if (!definition || !rows.length) return [];
  const distributions = definition.fields.map(([path]) => { const values = rows.map((row) => nestedNumber(row,path)).filter(Number.isFinite); const mean = average(values); const deviation = Math.sqrt(average(values.map((value) => (value - mean) ** 2),1)) || 1; return { mean, deviation }; });
  return rows.map((row) => ({ row, team:normalizedNflTeam(row.team), score:definition.fields.reduce((total,[path,weight,direction],index) => { const value = nestedNumber(row,path); return total + (Number.isFinite(value) ? ((value-distributions[index].mean)/distributions[index].deviation)*weight*direction : 0); },0) })).sort((a,b) => b.score-a.score).map((entry,index) => ({ ...entry, rank:index+1 }));
}

function teamMetricRank(team, metric) { return teamRankRows(metric).find((entry) => entry.team === normalizedNflTeam(team?.abbrev || team)) || null; }
function schemeRateRank(team, field) { const rows = snapshotTeamSchemes().filter((row) => Number.isFinite(Number(row[field]))).sort((a,b) => Number(b[field])-Number(a[field])); const index = rows.findIndex((row) => normalizedNflTeam(row.team) === normalizedNflTeam(team?.abbrev || team)); return index < 0 ? null : { rank:index+1, total:rows.length, value:Number(rows[index][field]) }; }
function normalizedPlayerName(value) {
  const parts = String(value || '').trim().split(/\s+/); const suffix = normalizeStatKey(parts.at(-1));
  if (['jr','sr','ii','iii','iv','v'].includes(suffix)) parts.pop();
  return normalizeStatKey(parts.join(' '));
}
function rosterPlayer(row = {}, source = 'nflverse weekly roster') {
  const espnId = String(row.espnid || row.espn_id || '');
  const gsisId = String(row.gsisid || row.gsis_id || row.playerid || '');
  const pfrId = String(row.pfrid || row.pfr_id || row.pfrplayerid || '');
  return {
    id: espnId || gsisId || String(row.id || ''), espnId, gsisId, pfrId,
    name: row.playername || row.playerdisplayname || row.fullname || row.footballname || row.displayname || row.name || 'Player',
    position: String(row.posabb || row.posname || row.depthchartposition || row.depthchartpos || row.position || row.ngsposition || '').toUpperCase(),
    positionGroup: String(row.posgrp || row.positiongroup || '').toUpperCase(),
    depth: Number(row.posrank || row.depthteam || row.depth || row.rank) || 99,
    slot: Number(row.posslot || row.position_slot) || 99,
    team: normalizedNflTeam(row.team || row.clubcode || row.recentteam || ''),
    status: row.status || row.statusdescriptionabbr || row.statusdescription || '',
    yearsExp: Number(row.yearsexp || row.years_exp), draftNumber: Number(row.draftnumber || row.draft_number),
    entryYear: Number(row.entryyear || row.entry_year), rookieYear: Number(row.rookieyear || row.rookie_year),
    headshot: row.headshoturl || row.headshot_url || '', source, stats: [],
  };
}
async function fetchNflverseSeasonFile(kind, season) {
  const cacheKey = `${kind}:${season}`;
  if (nflverseRosterCache.has(cacheKey)) return nflverseRosterCache.get(cacheKey);
  const snapshot = window.NFL_EVIDENCE_SNAPSHOT;
  if (snapshot && Number(snapshot.rosterSeason) === Number(season) && Array.isArray(snapshot[kind])) {
    const rows = snapshot[kind].map((row) => Object.fromEntries(Object.entries(row).map(([field,value]) => [normalizeStatKey(field), value])));
    const promise = Promise.resolve(rows); nflverseRosterCache.set(cacheKey, promise); return promise;
  }
  const filename = kind === 'depth' ? `depth_charts_${season}.csv` : `roster_weekly_${season}.csv`;
  const tag = kind === 'depth' ? 'depth_charts' : 'weekly_rosters';
  const promise = getText(`https://github.com/nflverse/nflverse-data/releases/download/${tag}/${filename}`).then(parseCsv).catch(() => []);
  nflverseRosterCache.set(cacheKey, promise); return promise;
}
function newestDepthRows(rows, team, game) {
  const matching = rows.filter((row) => normalizedNflTeam(row.clubcode || row.team) === normalizedNflTeam(team.abbrev));
  const gameDate = String(game?.date || state.selectedDate).slice(0, 10);
  const stamps = [...new Set(matching.map((row) => row.timestamp || row.dt || row.date || '').filter(Boolean))].sort();
  const newest = stamps.filter((stamp) => stamp.slice(0, 10) <= gameDate).pop() || stamps[0];
  return (newest ? matching.filter((row) => (row.timestamp || row.dt || row.date || '') === newest) : matching).map((row) => rosterPlayer(row, 'nflverse depth chart'));
}
function weeklyRosterRows(rows, team, game) {
  const week = Number(game?.week?.number || game?.week || 0);
  const matching = rows.filter((row) => normalizedNflTeam(row.team) === normalizedNflTeam(team.abbrev));
  const available = [...new Set(matching.map((row) => Number(row.week)).filter(Number.isFinite))].sort((a, b) => a - b);
  const selectedWeek = available.filter((value) => !week || value <= week).pop() || available.pop();
  return matching.filter((row) => !selectedWeek || Number(row.week) === selectedWeek).map((row) => rosterPlayer(row));
}
async function fetchEspnRoster(team) {
  const data = await getJson(`${API_BASE}/teams/${encodeURIComponent(team.id || team.abbrev)}/roster`); const output = [];
  for (const group of data?.athletes || []) for (const item of group?.items || group?.athletes || []) output.push({ id: String(item.id || ''), espnId: String(item.id || ''), name: item.fullName || item.displayName || item.shortName || 'Player', position: String(item.position?.abbreviation || group.position || group.abbreviation || '').toUpperCase(), depth: Number(item.depth || item.rank) || 99, status: item.status?.abbreviation || item.status?.name || '', headshot: item.headshot?.href || '', source: 'ESPN roster', stats: [] });
  return output;
}

const PLAYER_EVIDENCE_SUM_FIELDS = [
  'completions','attempts','passingyards','interceptions','passingfirstdowns','passingepa','carries','rushingyards','rushingfirstdowns','rushingepa',
  'receptions','targets','receivingyards','receivingfirstdowns','receivingepa','receivingairyards','receivingyardsaftercatch','tacklessolo','tackleswithassist','tackleassists','tacklesforloss','fumblesforced','sacks','qbhits','passdefended','defensivetouchdowns','specialteamstds','fantasypoints','fantasypointsppr',
];
const PLAYER_EVIDENCE_RATE_FIELDS = ['cpoe','passingcpoe','pacr','racr','targetshare','airyards_share','airyardsshare','wopr','woprx','dakota'];
const PLAYER_EVIDENCE_ALIASES = {
  passingtouchdowns: ['passingtds'], rushingtouchdowns: ['rushingtds'], receivingtouchdowns: ['receivingtds'],
  tacklessolo: ['deftacklessolo'], tackleswithassist: ['deftackleswithassist'], tackleassists: ['deftackleassists'], tacklesforloss: ['deftacklesforloss'],
  fumblesforced: ['deffumblesforced'], sacks: ['defsacks'], qbhits: ['defqbhits'], interceptions: ['passinginterceptions','definterceptions'], passdefended: ['defpassdefended'], defensivetouchdowns: ['deftds'],
};

function evidenceIdentityKeys(row = {}) {
  const keys = [];
  const add = (prefix, value) => { if (value != null && String(value).trim()) keys.push(`${prefix}:${String(value).trim().toLowerCase()}`); };
  add('gsis', row.gsisid || row.playerid || row.gsisId); add('espn', row.espnid || row.espnId); add('pfr', row.pfrid || row.pfrplayerid || row.pfrId);
  const name = row.playerdisplayname || row.playername || row.player || row.name; if (name) keys.push(`name:${normalizedPlayerName(name)}`);
  return [...new Set(keys)];
}

function aggregateNflverseEvidence(statRows, snapRows, season) {
  const records = new Set(); const byKey = new Map();
  const obtain = (row) => {
    const keys = evidenceIdentityKeys(row); let record = keys.map((keyValue) => byKey.get(keyValue)).find(Boolean);
    if (!record) { record = { season: Number(season), games: new Set(), snapGames: new Set(), sums: {}, weighted: {}, previousTeams: [], position: String(row.positiongroup || row.position_group || row.position || '').toUpperCase(), offenseSnaps: 0, defenseSnaps: 0, specialTeamsSnaps: 0, offenseStarts: 0, defenseStarts: 0, offensePctTotal: 0, defensePctTotal: 0, name: row.playerdisplayname || row.playername || row.player || row.name || '' }; records.add(record); }
    const previousTeam = normalizedNflTeam(row.recentteam || row.recent_team || row.team); if (previousTeam && !record.previousTeams.includes(previousTeam)) record.previousTeams.push(previousTeam); if (!record.position) record.position = String(row.positiongroup || row.position_group || row.position || '').toUpperCase();
    keys.forEach((keyValue) => byKey.set(keyValue, record)); return record;
  };
  for (const row of statRows.filter((item) => (!item.season || Number(item.season) === Number(season)) && (!item.seasontype || item.seasontype === 'REG'))) {
    const record = obtain(row); record.games.add(String(row.gameid || `${row.week || ''}|${row.recentteam || row.team || ''}`));
    for (const field of PLAYER_EVIDENCE_SUM_FIELDS) record.sums[field] = (record.sums[field] || 0) + (Number(row[field]) || 0);
    for (const [canonical, aliases] of Object.entries(PLAYER_EVIDENCE_ALIASES)) record.sums[canonical] = (record.sums[canonical] || 0) + aliases.reduce((total, alias) => total + (Number(row[alias]) || 0), 0);
    for (const field of PLAYER_EVIDENCE_RATE_FIELDS) {
      const normalizedField = normalizeStatKey(field); const value = Number(row[normalizedField]); if (!Number.isFinite(value)) continue;
      const weight = Math.max(1, Number(row.attempts || row.targets || row.carries) || 1); const item = record.weighted[normalizedField] || { total: 0, weight: 0 };
      item.total += value * weight; item.weight += weight; record.weighted[normalizedField] = item;
    }
  }
  for (const row of snapRows.filter((item) => (!item.season || Number(item.season) === Number(season)) && (!item.gametype || item.gametype === 'REG'))) {
    const record = obtain(row); record.snapGames.add(String(row.gameid || row.pfrgameid || `${row.week || ''}|${row.team || ''}`));
    const offensePct = Number(row.offensepct) || 0; const defensePct = Number(row.defensepct) || 0;
    record.offenseSnaps += Number(row.offensesnaps) || 0; record.defenseSnaps += Number(row.defensesnaps) || 0; record.specialTeamsSnaps += Number(row.stsnaps) || 0;
    record.offensePctTotal += offensePct; record.defensePctTotal += defensePct; if (offensePct >= .5) record.offenseStarts += 1; if (defensePct >= .5) record.defenseStarts += 1;
  }
  for (const record of records) {
    record.games = record.games.size; record.snapGameCount = record.snapGames.size; delete record.snapGames;
    record.offenseSnapShare = record.snapGameCount ? record.offensePctTotal / record.snapGameCount : 0; record.defenseSnapShare = record.snapGameCount ? record.defensePctTotal / record.snapGameCount : 0;
    for (const [field, item] of Object.entries(record.weighted)) record[field] = item.weight ? item.total / item.weight : 0;
  }
  return { season: Number(season), byKey, records: [...records] };
}

async function fetchNflversePlayerEvidence(season) {
  const year = Number(season); if (nflversePlayerEvidenceCache.has(year)) return nflversePlayerEvidenceCache.get(year);
  const snapshot = window.NFL_EVIDENCE_SNAPSHOT;
  if (snapshot && Number(snapshot.evidenceSeason) === year && Array.isArray(snapshot.evidence)) {
    const records = []; const byKey = new Map();
    snapshot.evidence.forEach((sourceRecord) => {
      const identities = evidenceIdentityKeys(sourceRecord); let record = identities.map((identity) => byKey.get(identity)).find(Boolean);
      if (!record) { record = { ...sourceRecord, sums: { ...(sourceRecord.sums || {}) } }; records.push(record); }
      else {
        for (const [field,value] of Object.entries(sourceRecord.sums || {})) record.sums[field] = (Number(record.sums[field]) || 0) + (Number(value) || 0);
        for (const field of ['games','snapGameCount','offenseSnaps','defenseSnaps','specialTeamsSnaps','offenseStarts','defenseStarts']) record[field] = (Number(record[field]) || 0) + (Number(sourceRecord[field]) || 0);
        for (const field of ['gsisId','pfrId','position']) record[field] = record[field] || sourceRecord[field] || '';
        record.previousTeams = [...new Set([...(record.previousTeams || []),...(sourceRecord.previousTeams || [])].map(normalizedNflTeam).filter(Boolean))];
        if (Number(sourceRecord.offenseSnapShare) > Number(record.offenseSnapShare || 0)) record.offenseSnapShare = sourceRecord.offenseSnapShare;
        if (Number(sourceRecord.defenseSnapShare) > Number(record.defenseSnapShare || 0)) record.defenseSnapShare = sourceRecord.defenseSnapShare;
        if (Number(sourceRecord.cpoe)) record.cpoe = sourceRecord.cpoe; if (Number(sourceRecord.targetshare)) record.targetshare = sourceRecord.targetshare;
      }
      evidenceIdentityKeys(record).forEach((identity) => byKey.set(identity, record)); identities.forEach((identity) => byKey.set(identity, record));
    });
    const promise = Promise.resolve({ season: year, byKey, records, snapshot: true }); nflversePlayerEvidenceCache.set(year, promise); return promise;
  }
  const promise = Promise.all([
    getText(`https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_${year}.csv`).then(parseCsv).catch(() => []),
    getText(`https://github.com/nflverse/nflverse-data/releases/download/snap_counts/snap_counts_${year}.csv`).then(parseCsv).catch(() => []),
  ]).then(([stats, snaps]) => aggregateNflverseEvidence(stats, snaps, year));
  nflversePlayerEvidenceCache.set(year, promise); return promise;
}

function evidenceForPlayer(player, evidence) {
  const matches = [...new Set(evidenceIdentityKeys(player).map((identity) => evidence?.byKey?.get(identity)).filter(Boolean))];
  if (matches.length && matches.every((record) => !Number(record.offenseSnaps) && !Number(record.defenseSnaps))) {
    const cleanParts = (name) => String(name || '').toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().split(/\s+/).filter((part) => !['jr','sr','ii','iii','iv','v'].includes(part)); const playerParts = cleanParts(player.name); const first = playerParts[0]?.[0]; const last = playerParts.at(-1);
    const aliases = (evidence?.records || []).filter((record) => { const parts = cleanParts(record.name); return parts.length > 1 && parts[0]?.[0] === first && parts.at(-1) === last && (Number(record.offenseSnaps) || Number(record.defenseSnaps)); });
    if (aliases.length === 1) matches.push(aliases[0]);
  }
  if (!matches.length) return null; if (matches.length === 1) return matches[0];
  const merged = { ...matches[0], sums:{} };
  for (const record of matches) {
    for (const [field,value] of Object.entries(record.sums || {})) merged.sums[field] = (Number(merged.sums[field]) || 0) + (Number(value) || 0);
    for (const field of ['games','snapGameCount','offenseSnaps','defenseSnaps','specialTeamsSnaps','offenseStarts','defenseStarts']) merged[field] = Math.max(Number(merged[field]) || 0,Number(record[field]) || 0);
    for (const field of ['offenseSnapShare','defenseSnapShare']) merged[field] = Math.max(Number(merged[field]) || 0,Number(record[field]) || 0);
    for (const field of ['cpoe','targetshare']) if (Number.isFinite(Number(record[field])) && Number(record[field]) !== 0) merged[field] = Number(record[field]);
    for (const field of ['gsisId','pfrId','position']) merged[field] = merged[field] || record[field] || '';
    merged.previousTeams = [...new Set([...(merged.previousTeams || []),...(record.previousTeams || [])].map(normalizedNflTeam).filter(Boolean))];
  }
  return merged;
}

function positionUnit(position) {
  const pos = String(position || '').toUpperCase();
  if (/^(QB|RB|HB|FB|WR|LWR|RWR|SWR|SLWR|SRWR|TE|LT|LG|C|RG|RT|T|OT|G|OG|OL)$/.test(pos)) return 'offense';
  if (/^(DE|LDE|RDE|DT|LDT|RDT|NT|DL|EDGE|LB|ILB|MLB|OLB|WLB|SLB|CB|LCB|RCB|SCB|NB|DB|S|FS|SS)$/.test(pos)) return 'defense';
  return 'special';
}

function playerGrade(player, evidence) {
  const e = evidence || { games: 0, snapGameCount: 0, sums: {} }; const s = e.sums || {}; const games = Math.max(1, e.games || e.snapGameCount || 0); const pos = depthPositionGroup(player.position); let value = 57; let basis = ''; const metrics = [];
  const perGame = (field) => (Number(s[field]) || 0) / games; const rate = (num, den) => den ? Number(num || 0) / Number(den) : 0; const recordedDefenseSnaps = Math.max(0,Number(e.defenseSnaps) || 0); const defenseSnaps = Math.max(1,recordedDefenseSnaps); const defensiveRateDenominator = Math.max(350,recordedDefenseSnaps); const stabilizedPer100 = (field) => rate(s[field],defensiveRateDenominator) * 100; const stabilizedValuePer100 = (value) => rate(value,defensiveRateDenominator) * 100; const pedigree = Number.isFinite(player.draftNumber) ? clamp((90-player.draftNumber)/22,0,4) : 0; const establishedRole = player.depth === 1 ? 1.5 : player.depth === 2 ? .5 : 0;
  if (pos === 'QB') {
    const attempts = Number(s.attempts) || 0; const epa = rate(s.passingepa,attempts); const cpoe = Number(e.cpoe || e.passingcpoe) || 0; const ypa = rate(s.passingyards,attempts); const tdRate = rate(s.passingtouchdowns,attempts); const intRate = rate(s.interceptions,attempts);
    value = 57 + (epa - .02) * 45 + cpoe * .55 + (ypa - 6.7) * 2.8 + (tdRate - .04) * 85 - (intRate - .022) * 105 + clamp(attempts / 420,0,1) * 8;
    metrics.push(['EPA / attempt',epa],['CPOE',`${cpoe >= 0 ? '+' : ''}${cpoe.toFixed(1)}`],['Yards / attempt',ypa],['TD–INT',`${s.passingtouchdowns || 0}–${s.interceptions || 0}`]); basis = 'EPA, completion value, downfield efficiency, scoring and ball security';
  } else if (pos === 'RB' || pos === 'FB') {
    const carries = Number(s.carries) || 0; const ypc = rate(s.rushingyards,carries); const rushEpa = rate(s.rushingepa,carries); const firstDownRate = rate(s.rushingfirstdowns,carries); const scrim = perGame('rushingyards') + perGame('receivingyards');
    const efficiencyWeight = clamp((s.carries || 0) / 80, .08, 1);
    value = 55 + (clamp(ypc,2,6.5) - 3.8) * 4.3 * efficiencyWeight + scrim / 11 + rushEpa * 28 * efficiencyWeight + (firstDownRate - .20) * 35 + (perGame('rushingtouchdowns') + perGame('receivingtouchdowns')) * 3;
    metrics.push(['Scrim yds / game',scrim],['Yards / carry',ypc],['Rush EPA / carry',rushEpa],['1st-down rate',firstDownRate]); basis = 'rushing value, down-to-down efficiency, first downs and receiving production';
  } else if (pos === 'WR' || pos === 'TE') {
    const targets = Number(s.targets) || 0; const ypt = rate(s.receivingyards,targets); const targetShare = Number(e.targetshare) || 0; const receivingEpa = rate(s.receivingepa,targets); const firstDownRate = rate(s.receivingfirstdowns,targets);
    const efficiencyWeight = clamp((s.targets || 0) / 40, .06, 1);
    value = 53 + perGame('receivingyards') / 7 + (clamp(ypt,3,13) - 6.5) * 2.2 * efficiencyWeight + targetShare * 25 + receivingEpa * 14 * efficiencyWeight + (firstDownRate - .32) * 20 + perGame('receivingtouchdowns') * 4;
    metrics.push(['Rec yds / game',perGame('receivingyards')],['Yards / target',ypt],['EPA / target',receivingEpa],['Target share',targetShare]); basis = 'target earning, EPA per target, first-down creation and after-catch value';
  } else if (/^(LT|LG|C|RG|RT|T|OT|G|OG|OL)$/.test(String(player.position || '').toUpperCase())) {
    const share = e.offenseSnapShare || 0; const startRate = rate(e.offenseStarts || 0, e.snapGameCount || 0); const evidenceTeam = e.previousTeams?.[0] || player.team; const protectionRank = teamMetricRank(evidenceTeam,'pocketProtection')?.rank; const runRank = teamMetricRank(evidenceTeam,'runGame')?.rank; const protectionBoost = protectionRank ? (33-protectionRank)/32*8 : 4; const runBoost = runRank ? (33-runRank)/32*4 : 2;
    value = 53 + share * 14 + startRate * 5 + Math.min(3,(e.offenseSnaps || 0)/300) + protectionBoost + runBoost;
    metrics.push(['Offense snaps',e.offenseSnaps || 0],['Snap share',share],['Starter games',e.offenseStarts || 0],['2025 protection context',protectionRank ? `${evidenceTeam} #${protectionRank}/32` : '—'],['2025 run context',runRank ? `${evidenceTeam} #${runRank}/32` : '—']); basis = 'availability and lineup stability, plus the player’s prior-team protection/run context; individual pressure allowed is not inferred';
  } else if (pos === 'CB') {
    const share = e.defenseSnapShare || 0;
    const defensiveInterceptions = Number(s.defensiveinterceptions || s.interceptions) || 0;
    value = 58 + share * 14 + stabilizedPer100('passdefended') * 4.8 + stabilizedValuePer100(defensiveInterceptions) * 15 + stabilizedPer100('tacklessolo') * .38 + stabilizedPer100('tacklesforloss') * 2 + pedigree + establishedRole;
    metrics.push(['Coverage snaps',e.defenseSnaps || 0],['Regressed PD / 100',stabilizedPer100('passdefended')],['Regressed INT / 100',stabilizedValuePer100(defensiveInterceptions)],['Regressed solo / 100',stabilizedPer100('tacklessolo')],['Role / pedigree',pedigree + establishedRole]); basis = 'coverage plays, interceptions, tackling and workload, with counting rates regressed below 350 snaps and stabilized by current role and draft pedigree';
  } else if (['S','FS','SS','DB'].includes(pos)) {
    const share = e.defenseSnapShare || 0; const defensiveInterceptions = Number(s.defensiveinterceptions || s.interceptions) || 0;
    value = 56 + share * 13 + stabilizedPer100('passdefended') * 3.5 + stabilizedValuePer100(defensiveInterceptions) * 12 + stabilizedPer100('tacklessolo') * .5 + stabilizedPer100('tacklesforloss') * 2.7 + pedigree + establishedRole;
    metrics.push(['Defense snaps',e.defenseSnaps || 0],['Regressed solo / 100',stabilizedPer100('tacklessolo')],['Regressed PD / 100',stabilizedPer100('passdefended')],['Regressed TFL / 100',stabilizedPer100('tacklesforloss')]); basis = 'coverage production, range, tackling and run-support disruption, with counting rates regressed below 350 snaps';
  } else if (['DE','EDGE'].includes(pos)) {
    const share = e.defenseSnapShare || 0;
    value = 54 + share * 12 + stabilizedPer100('sacks') * 5.8 + stabilizedPer100('qbhits') * 1.8 + stabilizedPer100('tacklesforloss') * 2.8 + stabilizedPer100('fumblesforced') * 4 + pedigree + establishedRole;
    metrics.push(['Defense snaps',e.defenseSnaps || 0],['Regressed sacks / 100',stabilizedPer100('sacks')],['Regressed hits / 100',stabilizedPer100('qbhits')],['Regressed TFL / 100',stabilizedPer100('tacklesforloss')]); basis = 'edge pressure, quarterback hits, backfield disruption and workload, with counting rates regressed below 350 snaps';
  } else if (['DT','NT','DL'].includes(pos)) {
    const share = e.defenseSnapShare || 0;
    value = 55 + share * 12 + stabilizedPer100('tacklesforloss') * 4.2 + stabilizedPer100('tacklessolo') * .65 + stabilizedPer100('sacks') * 4 + stabilizedPer100('qbhits') * 1.4 + pedigree + establishedRole;
    metrics.push(['Defense snaps',e.defenseSnaps || 0],['Regressed TFL / 100',stabilizedPer100('tacklesforloss')],['Regressed solo / 100',stabilizedPer100('tacklessolo')],['Regressed hits / 100',stabilizedPer100('qbhits')]); basis = 'interior run disruption, tackles for loss, pressure and snap load, with counting rates regressed below 350 snaps';
  } else if (pos === 'LB') {
    const share = e.defenseSnapShare || 0; const defensiveInterceptions = Number(s.defensiveinterceptions || s.interceptions) || 0;
    value = 54 + share * 13 + stabilizedPer100('tacklessolo') * .6 + stabilizedPer100('tacklesforloss') * 3.1 + stabilizedPer100('sacks') * 3.5 + stabilizedPer100('passdefended') * 2.1 + stabilizedValuePer100(defensiveInterceptions) * 8 + pedigree + establishedRole;
    metrics.push(['Defense snaps',e.defenseSnaps || 0],['Regressed solo / 100',stabilizedPer100('tacklessolo')],['Regressed TFL / 100',stabilizedPer100('tacklesforloss')],['Regressed PD / 100',stabilizedPer100('passdefended')]); basis = 'tackling range, run disruption, pressure and coverage plays, with counting rates regressed below 350 snaps';
  } else {
    const share = e.defenseSnapShare || 0;
    value = 54 + share * 12 + stabilizedPer100('sacks') * 4 + stabilizedPer100('tacklesforloss') * 3 + stabilizedPer100('tacklessolo') * .5;
    metrics.push(['Defense snaps',e.defenseSnaps || 0],['Regressed solo / 100',stabilizedPer100('tacklessolo')],['Regressed sacks / 100',stabilizedPer100('sacks')],['Regressed TFL / 100',stabilizedPer100('tacklesforloss')]); basis = 'position-neutral defensive workload and disruption, with counting rates regressed below 350 snaps';
  }
  const hasEvidence = Boolean((e.games || e.snapGameCount) && ((e.offenseSnaps || e.defenseSnaps) || Object.values(s).some((number) => Number(number))));
  if (!hasEvidence) {
    const draftBoost = Number.isFinite(player.draftNumber) ? clamp((170 - player.draftNumber) / 18, 0, 8) : 0; const chartBoost = player.depth === 1 ? 8 : player.depth === 2 ? 4 : 0;
    value = 54 + draftBoost + chartBoost; basis = 'current roster role and draft capital; no prior-season NFL sample'; metrics.push(['Depth rank',player.depth < 99 ? player.depth : '—'],['Draft slot',Number.isFinite(player.draftNumber) ? player.draftNumber : 'UDFA/NA'],['NFL sample','None']);
  }
  const grade = Math.round(clamp(value, 45, 96)); const label = grade >= 90 ? 'ELITE' : grade >= 84 ? 'IMPACT' : grade >= 78 ? 'PLUS' : grade >= 71 ? 'SOLID' : grade >= 64 ? 'COMPETE' : 'DEPTH';
  const confidence = hasEvidence && Math.max(e.games || 0, e.snapGameCount || 0) >= 10 ? 'HIGH' : hasEvidence ? 'MEDIUM' : 'PROJECTED';
  return { grade, label, confidence, basis, metrics, season: e.season || analysisSeasonForGame(null), hasEvidence };
}

function unavailableForStarter(player) { return /\b(IR|PUP|NFI|OUT|SUSP|SUS|RES|RESERVE|INACTIVE)\b/i.test(String(player.status || '')); }
function starterScore(player) {
  const e = player.evidence || {}; const unit = positionUnit(player.position); const snapShare = unit === 'offense' ? e.offenseSnapShare : e.defenseSnapShare;
  return player.evaluation.grade + (snapShare || 0) * 16 + (player.depth === 1 ? 8 : player.depth === 2 ? 3 : 0) - (unavailableForStarter(player) ? 100 : 0);
}

function defensiveBaseFront(rows) {
  const labels = rows.map((player) => String(player.positionGroup || '')).filter(Boolean);
  if (labels.some((label) => /base\s*4-3/i.test(label))) return '4–3';
  if (labels.some((label) => /base\s*3-4/i.test(label))) return '3–4';
  const snapshot = teamSchemeRecord(rows[0]?.team); return String(snapshot?.baseFront || '').replace('-', '–') || 'Multiple';
}

function expectedStarters(rows, baseFront = 'Multiple') {
  const selected = new Set(); const pick = (role, predicate, count = 1) => {
    const candidates = rows.filter((player) => !selected.has(player) && predicate(String(player.position || '').toUpperCase())).sort((a, b) => starterScore(b) - starterScore(a) || a.depth - b.depth || a.name.localeCompare(b.name));
    candidates.slice(0, count).forEach((player, index) => { selected.add(player); player.expectedStarter = true; player.expectedRole = count > 1 ? `${role}${index + 1}` : role; });
  };
  pick('QB', (pos) => pos === 'QB'); pick('RB', (pos) => /^(RB|HB|FB)$/.test(pos)); pick('WR', (pos) => /^(WR|LWR|RWR|SWR|SLWR|SRWR)$/.test(pos), 3); pick('TE', (pos) => pos === 'TE');
  pick('LT', (pos) => /^(LT|T|OT|OL)$/.test(pos)); pick('LG', (pos) => /^(LG|G|OG|OL)$/.test(pos)); pick('C', (pos) => pos === 'C'); pick('RG', (pos) => /^(RG|G|OG|OL)$/.test(pos)); pick('RT', (pos) => /^(RT|T|OT|OL)$/.test(pos));
  const offense = [...selected].filter((player) => positionUnit(player.position) === 'offense');
  if (offense.length < 11) rows.filter((player) => positionUnit(player.position) === 'offense' && !selected.has(player)).sort((a,b) => starterScore(b) - starterScore(a)).slice(0, 11 - offense.length).forEach((player) => { selected.add(player); player.expectedStarter = true; player.expectedRole = player.position; offense.push(player); });
  const threeFour = /3[–-]4/.test(baseFront); pick('DL', (pos) => /^(DE|LDE|RDE|DT|LDT|RDT|NT|DL|EDGE)$/.test(pos), threeFour ? 3 : 4); pick('LB', (pos) => /^(LB|ILB|MLB|OLB|WLB|SLB)$/.test(pos), threeFour ? 4 : 3); pick('CB', (pos) => /^(CB|LCB|RCB|SCB|NB|DB)$/.test(pos), 2); pick('S', (pos) => /^(S|FS|SS|DB)$/.test(pos), 2);
  const defense = [...selected].filter((player) => positionUnit(player.position) === 'defense');
  if (defense.length < 11) rows.filter((player) => positionUnit(player.position) === 'defense' && !selected.has(player)).sort((a,b) => starterScore(b) - starterScore(a)).slice(0, 11 - defense.length).forEach((player) => { selected.add(player); player.expectedStarter = true; player.expectedRole = player.position; defense.push(player); });
  return { offense: offense.slice(0, 11), defense: defense.slice(0, 11) };
}

function mergePersonnelSources(chart, roster, espn) {
  const players = new Map();
  const merge = (incoming, priority) => {
    const keyValue = normalizedPlayerName(incoming.name); const current = players.get(keyValue) || { _priority: 0 };
    const identifiers = { id: incoming.espnId || current.espnId ? (incoming.espnId || current.espnId) : (current.id || incoming.id), espnId: incoming.espnId || current.espnId || '', gsisId: incoming.gsisId || current.gsisId || '', pfrId: incoming.pfrId || current.pfrId || '' };
    const merged = priority >= current._priority ? { ...current, ...incoming, ...identifiers, _priority: priority } : { ...incoming, ...current, ...identifiers };
    merged.status = incoming.status || current.status || ''; merged.headshot = incoming.headshot || current.headshot || '';
    for (const field of ['yearsExp','draftNumber','entryYear','rookieYear']) if (!Number.isFinite(merged[field])) merged[field] = Number.isFinite(current[field]) ? current[field] : incoming[field];
    if (incoming.source === 'nflverse depth chart') { merged.position = incoming.position || merged.position; merged.depth = incoming.depth; merged.slot = incoming.slot; merged.depthSource = incoming.source; }
    players.set(keyValue, merged);
  };
  roster.forEach((player) => merge(player, 2)); espn.forEach((player) => merge(player, 1)); chart.forEach((player) => merge(player, 3));
  return [...players.values()].map(({ _priority, ...player }) => player);
}

async function buildMatchupPersonnel(game) {
  const season = seasonForDate(game?.date || state.selectedDate);
  const evidenceSeason = analysisSeasonForGame(game);
  const [depth, weekly, awayEspn, homeEspn, evidence] = await Promise.all([fetchNflverseSeasonFile('depth', season), fetchNflverseSeasonFile('weekly', season), fetchEspnRoster(game.away).catch(() => []), fetchEspnRoster(game.home).catch(() => []), fetchNflversePlayerEvidence(evidenceSeason).catch(() => ({ season: evidenceSeason, byKey: new Map(), records: [] }))]);
  const side = (team, espn) => {
    const chart = newestDepthRows(depth, team, game); const roster = weeklyRosterRows(weekly, team, game); const rows = mergePersonnelSources(chart, roster, espn).filter((player) => player.name && player.position);
    rows.forEach((player) => { player.team = team.abbrev; player.evidence = evidenceForPlayer(player, evidence); player.evaluation = playerGrade(player, player.evidence); const identity = `${team.abbrev}|${player.id || normalizeStatKey(player.name)}`; player.personnelKey = identity; state.personnelPlayers.set(identity, player); });
    const baseFront = defensiveBaseFront(rows); const starters = expectedStarters(rows,baseFront);
    return { rows: rows.sort((a, b) => Number(b.expectedStarter) - Number(a.expectedStarter) || footballPositionRank(a.position, positionUnit(a.position)) - footballPositionRank(b.position, positionUnit(b.position)) || starterScore(b) - starterScore(a)), starters, baseFront };
  };
  const away = side(game.away, awayEspn); const home = side(game.home, homeEspn);
  return { away: away.rows, home: home.rows, starters: { away: away.starters, home: home.starters }, schemes: { away: { baseFront: away.baseFront }, home: { baseFront: home.baseFront } }, evidenceSeason, sources: { depth: depth.length > 0, weekly: weekly.length > 0, espn: awayEspn.length + homeEspn.length > 0, stats: evidence.records.length > 0 } };
}

function loadMatchupPersonnel(game) {
  const cacheKey = `${game?.id || `${game?.away?.abbrev}-${game?.home?.abbrev}`}|${analysisSeasonForGame(game)}`;
  if (!matchupPersonnelCache.has(cacheKey)) matchupPersonnelCache.set(cacheKey, buildMatchupPersonnel(game).catch((error) => { matchupPersonnelCache.delete(cacheKey); throw error; }));
  return matchupPersonnelCache.get(cacheKey);
}

function priorTeamsForPlayer(player) { return [...new Set((player?.evidence?.previousTeams || []).map(normalizedNflTeam).filter(Boolean))]; }
function playerReturnedToTeam(player, team) { return priorTeamsForPlayer(player).includes(normalizedNflTeam(team?.abbrev || team)); }
function personnelIdentity(player) { return player?.gsisId || player?.espnId || player?.pfrId || normalizedPlayerName(player?.name); }
function gradeAverage(rows, fallback = 68) { return rows?.length ? average(rows.map((player) => Number(player.evaluation?.grade) || playerGrade(player,player.evidence).grade),fallback) : fallback; }

function priorTeamLineup(team) {
  const teamAbbrev = normalizedNflTeam(team?.abbrev || team); const snapshot = window.NFL_EVIDENCE_SNAPSHOT; const evidence = (snapshot?.evidence || []).filter((record) => (record.previousTeams || []).map(normalizedNflTeam).includes(teamAbbrev) && record.position);
  const rows = evidence.map((record) => { const player={ id:record.gsisId || record.pfrId || normalizedPlayerName(record.name), gsisId:record.gsisId || '', pfrId:record.pfrId || '', name:record.name, position:String(record.position || '').toUpperCase(), team:teamAbbrev, depth:1, status:'2025 sample', evidence:record }; player.evaluation=playerGrade(player,record); return player; });
  return { ...expectedStarters(rows,String(teamSchemeRecord(teamAbbrev)?.baseFront || 'Multiple').replace('-', '–')), all:rows };
}

function rosterEvolution(profile, personnel, side) {
  const current = personnel?.starters?.[side] || { offense:[],defense:[] }; const prior = priorTeamLineup(profile.team); const currentRows=personnel?.[side] || []; const currentIds=new Set(currentRows.map(personnelIdentity)); const line=/^(LT|LG|C|RG|RT|T|OT|G|OG|OL)$/; const skill=/^(QB|RB|HB|FB|WR|LWR|RWR|SWR|SLWR|SRWR|TE)$/; const front=/^(DE|LDE|RDE|DT|LDT|RDT|NT|DL|EDGE|LB|ILB|MLB|OLB|WLB|SLB)$/; const secondary=/^(CB|LCB|RCB|SCB|NB|DB|S|FS|SS)$/;
  const currentOff=current.offense || []; const currentDef=current.defense || []; const priorOff=prior.offense || []; const priorDef=prior.defense || []; const group=(rows,matcher)=>rows.filter((player)=>matcher.test(String(player.position||'').toUpperCase())); const currentOl=group(currentOff,line); const priorOl=group(priorOff,line); const currentSkill=group(currentOff,skill); const priorSkill=group(priorOff,skill); const currentFront=group(currentDef,front); const priorFront=group(priorDef,front); const currentSecondary=group(currentDef,secondary); const priorSecondary=group(priorDef,secondary);
  const unavailable=[...currentOff,...currentDef].filter(unavailableForStarter); const olUnavailable=currentOl.filter(unavailableForStarter); const olHealthy=currentOl.length>=5 && !olUnavailable.length; const additions=[...currentOff,...currentDef].filter((player)=>{const teams=priorTeamsForPlayer(player); return teams.length ? !teams.includes(normalizedNflTeam(profile.team.abbrev)) : !player.evaluation?.hasEvidence;}); const departures=[...priorOff,...priorDef].filter((player)=>!currentIds.has(personnelIdentity(player))); const offenseReturning=currentOff.filter((player)=>playerReturnedToTeam(player,profile.team)).length; const defenseReturning=currentDef.filter((player)=>playerReturnedToTeam(player,profile.team)).length; const offenseContinuity=clamp(offenseReturning/Math.max(11,currentOff.length),.35,1); const defenseContinuity=clamp(defenseReturning/Math.max(11,currentDef.length),.35,1);
  const offenseDelta=gradeAverage(currentOff)-gradeAverage(priorOff,gradeAverage(currentOff)); const defenseDelta=gradeAverage(currentDef)-gradeAverage(priorDef,gradeAverage(currentDef)); const lineDelta=gradeAverage(currentOl)-gradeAverage(priorOl,gradeAverage(currentOl)); const skillDelta=gradeAverage(currentSkill)-gradeAverage(priorSkill,gradeAverage(currentSkill)); const frontDelta=gradeAverage(currentFront)-gradeAverage(priorFront,gradeAverage(currentFront)); const secondaryDelta=gradeAverage(currentSecondary)-gradeAverage(priorSecondary,gradeAverage(currentSecondary)); const offenseUnavailable=currentOff.filter(unavailableForStarter).length; const defenseUnavailable=currentDef.filter(unavailableForStarter).length; const priorOlStartCoverage=priorOl.length?average(priorOl.map((player)=>clamp((Number(player.evidence?.offenseStarts)||0)/Math.max(1,Number(player.evidence?.snapGameCount)||17)))):.8; const priorOlStartersUsed=group(prior.all||priorOff,line).filter((player)=>Number(player.evidence?.offenseStarts)>0).length; const currentOlAvailability=clamp((currentOl.length-olUnavailable.length)/5); const olChurnRecovery=olHealthy?clamp((priorOlStartersUsed-5)*.6,0,3):0; const olHealthAdjustment=(currentOlAvailability-priorOlStartCoverage)*7+(olHealthy ? .8 : 0)+olChurnRecovery-olUnavailable.length*1.2;
  const offenseAdjustment=clamp(offenseDelta*.5+lineDelta*.25+skillDelta*.25+olHealthAdjustment-offenseUnavailable*.9,-7,7); const defenseAdjustment=clamp(defenseDelta*.55+frontDelta*.25+secondaryDelta*.2-defenseUnavailable*.9,-7,7); const returning=[...currentOff,...currentDef].filter((player)=>playerReturnedToTeam(player,profile.team));
  return { currentOffenseGrade:gradeAverage(currentOff),priorOffenseGrade:gradeAverage(priorOff,gradeAverage(currentOff)),currentDefenseGrade:gradeAverage(currentDef),priorDefenseGrade:gradeAverage(priorDef,gradeAverage(currentDef)),offenseDelta,defenseDelta,lineDelta,skillDelta,frontDelta,secondaryDelta,offenseAdjustment,defenseAdjustment,olHealthAdjustment,olChurnRecovery,priorOlStartersUsed,priorOlStartCoverage,currentOlAvailability,offenseReturning,defenseReturning,offenseContinuity,defenseContinuity,olHealthy,olAvailable:currentOl.length-olUnavailable.length,olCount:currentOl.length,unavailable,additions,departures,returning: returning.length,starterCount:currentOff.length+currentDef.length };
}

function applyRosterEvolution(profile, personnel, side) {
  const roster=rosterEvolution(profile,personnel,side); profile.roster=roster; profile.units.preRoster={...profile.units}; profile.units.offenseLine=clamp(profile.units.offenseLine+roster.lineDelta*.55+roster.olHealthAdjustment*.7,20,88); profile.units.defenseFront=clamp(profile.units.defenseFront+roster.frontDelta*.55,20,88); profile.units.secondary=clamp(profile.units.secondary+roster.secondaryDelta*.55,20,88); return profile;
}

function coverageRowsForGame(game) {
  if (!game) return [];
  const teams = new Set([game.away.abbrev, game.home.abbrev].map((value) => String(value).toUpperCase()));
  const matching = state.coverageRows.filter((row) => row.game_id === game.id || (teams.has(row.offense_team) && teams.has(row.defense_team)));
  const baselineSeason = analysisSeasonForGame(game);
  const seasonRows = matching.filter((row) => String(row.date || '').startsWith(`${baselineSeason}-`));
  const rows = baselineSeason < seasonForDate(game.date || state.selectedDate) && seasonRows.length ? seasonRows : matching;
  const limit = Number(els.matchupWindow?.value);
  if (!Number.isFinite(limit)) return rows;
  const dates = [...new Set(rows.map((row) => row.date).filter(Boolean))].sort().reverse().slice(0, limit);
  return rows.filter((row) => !row.date || dates.includes(row.date));
}

function aggregateCoverage(rows) {
  const groups = new Map();
  for (const row of rows) {
    const id = `${row.receiver_id || normalizeStatKey(row.receiver)}|${row.defender_id || normalizeStatKey(row.defender)}`;
    const item = groups.get(id) || { ...row, games: new Set(), routes: 0, targets: 0, receptions: 0, yards: 0, touchdowns: 0, interceptions: 0 };
    item.games.add(row.game_id || row.date);
    for (const field of ['routes', 'targets', 'receptions', 'yards', 'touchdowns', 'interceptions']) item[field] += Number(row[field]) || 0;
    groups.set(id, item);
  }
  return [...groups.values()].map((item) => ({ ...item, games: item.games.size })).sort((a, b) => b.routes - a.routes || b.targets - a.targets);
}

function coverageMetric(value, fallback = '0') {
  return Number.isFinite(Number(value)) ? String(Number(value).toFixed(Number(value) % 1 ? 1 : 0)) : fallback;
}

function coverageHistoryHtml(rows) {
  const aggregated = aggregateCoverage(rows);
  const tierGroups = new Map();
  for (const row of rows) { const tier = state.playerTierOverrides[String(row.defender_id)] || row.defender_tier || 'unrated'; const item = tierGroups.get(tier) || { targets: 0, receptions: 0, yards: 0, touchdowns: 0 }; for (const field of Object.keys(item)) item[field] += Number(row[field]) || 0; tierGroups.set(tier, item); }
  const tierSummary = `<div class="coverage-tier-splits">${[...tierGroups].map(([tier, item]) => `<span class="tier-${tier}"><b>vs ${escapeHtml(tier)} CB</b><em>${item.receptions}/${item.targets} · ${item.yards} yds · ${item.touchdowns} TD</em></span>`).join('')}</div>`;
  if (!aggregated.length) return '<div class="empty">No verified WR–defender history has been imported for these teams.</div>';
  return `${tierSummary}<div class="table-wrap"><table class="nfl-table coverage-table"><thead><tr><th>Receiver</th><th>Defender</th><th>Align / coverage</th><th>G</th><th>Routes</th><th>Tgt</th><th>Rec</th><th>Yds</th><th>TD</th><th>INT</th><th>Y/RR</th><th>Catch%</th></tr></thead><tbody>${aggregated.map((row) => {
    const yardsPerRoute = row.routes ? row.yards / row.routes : 0;
    const catchRate = row.targets ? (row.receptions / row.targets) * 100 : 0;
    const receiverTier = state.playerTierOverrides[String(row.receiver_id)] || row.receiver_tier || ''; const defenderTier = state.playerTierOverrides[String(row.defender_id)] || row.defender_tier || '';
    return `<tr><td><strong>${escapeHtml(row.receiver)}</strong><small>${escapeHtml(row.offense_team)}${receiverTier ? ` · ${escapeHtml(receiverTier)}` : ''}</small></td><td><strong>${escapeHtml(row.defender)}</strong><small>${escapeHtml(row.defense_team)}${defenderTier ? ` · ${escapeHtml(defenderTier)}` : ''}</small></td><td>${escapeHtml([row.receiver_alignment, row.coverage_type].filter(Boolean).join(' / ') || '--')}</td><td>${row.games}</td><td>${coverageMetric(row.routes)}</td><td>${coverageMetric(row.targets)}</td><td>${coverageMetric(row.receptions)}</td><td>${coverageMetric(row.yards)}</td><td>${coverageMetric(row.touchdowns)}</td><td>${coverageMetric(row.interceptions)}</td><td>${yardsPerRoute.toFixed(2)}</td><td>${catchRate.toFixed(1)}%</td></tr>`;
  }).join('')}</tbody></table></div>`;
}

function isReceiverPosition(position) { return /^(WR|TE|LWR|RWR|SWR|SLWR|SRWR)$/.test(String(position || '').toUpperCase()); }
function isSecondaryPosition(position) { return /^(CB|DB|S|FS|SS|NB|LCB|RCB|SCB)$/.test(String(position || '').toUpperCase()); }
function brandCoverageSide(html, offense, defense) {
  const style = `--offense-color:${offense.color};--defense-color:${defense.color};--offense-logo:url('${offense.logo}');--defense-logo:url('${defense.logo}')`;
  return html.replace('class="coverage-side"', `class="coverage-side" style="${escapeHtml(style)}"`);
}
function projectedMatchupsHtml(game, box, personnel = null) {
  const away = depthChartForTeam(box?.players || [], game.away);
  const home = depthChartForTeam(box?.players || [], game.home);
  const awayRoster = personnel?.away || []; const homeRoster = personnel?.home || [];
  const offense = (rows) => rows.filter((row) => isReceiverPosition(row.position));
  const defense = (rows) => rows.filter((row) => isSecondaryPosition(row.position));
  return [brandCoverageSide(projectedSideHtml(game.away, offense(awayRoster).length ? offense(awayRoster) : away.offense, game.home, defense(homeRoster).length ? defense(homeRoster) : home.defense), game.away, game.home), brandCoverageSide(projectedSideHtml(game.home, offense(homeRoster).length ? offense(homeRoster) : home.offense, game.away, defense(awayRoster).length ? defense(awayRoster) : away.defense), game.home, game.away)].join('');
}

function matchupDepthOrder(rows, matcher, rolePrefix, limit) {
  const roleNumber = (player) => Number(String(player.expectedRole || '').match(new RegExp(`^${rolePrefix}(\\d+)$`))?.[1]) || 99;
  return rows.filter((player) => matcher.test(String(player.position || '').toUpperCase())).sort((a,b) => Number(b.expectedStarter) - Number(a.expectedStarter) || roleNumber(a) - roleNumber(b) || (a.depth || 99) - (b.depth || 99) || (a.slot || 99) - (b.slot || 99) || (Number(b.evaluation?.grade) || playerUsageScore(b)) - (Number(a.evaluation?.grade) || playerUsageScore(a))).slice(0,limit).map((player,index) => ({ ...player, matchupRole: `${rolePrefix}${index + 1}` }));
}

function projectedPairRow(receiver, defender, offense, defense) {
  const receiverGrade = Number(receiver?.evaluation?.grade); const defenderGrade = Number(defender?.evaluation?.grade); const edge = Number.isFinite(receiverGrade) && Number.isFinite(defenderGrade) ? receiverGrade - defenderGrade : null;
  return `<div class="alignment-row role-aligned"><div><span class="position-label">${escapeHtml(receiver?.matchupRole || receiver?.position || 'WR')}</span><strong>${receiver ? playerButtonHtml(receiver, offense) : 'Receiver TBD'}</strong>${Number.isFinite(receiverGrade) ? `<small>OVR ${receiverGrade}</small>` : ''}</div><b>vs</b><div><span class="position-label">${escapeHtml(defender?.matchupRole || defender?.position || 'CB')}</span><strong>${defender ? playerButtonHtml(defender, defense) : 'Corner TBD'}</strong>${Number.isFinite(defenderGrade) ? `<small>OVR ${defenderGrade}${edge == null ? '' : ` · ${edge > 0 ? offense.abbrev : edge < 0 ? defense.abbrev : 'EVEN'} ${edge === 0 ? '' : Math.abs(edge)}`}</small>` : ''}</div></div>`;
}

function projectedSideHtml(offense, offenseRows, defense, defenseRows) {
  const receivers = matchupDepthOrder(offenseRows,/^(WR|LWR|RWR|SWR|SLWR|SRWR)$/,'WR',4); const corners = matchupDepthOrder(defenseRows,/^(CB|LCB|RCB|SCB|NB)$/,'CB',4);
  const tightEnds = matchupDepthOrder(offenseRows,/^TE$/,'TE',2); const tightEndDefenders = matchupDepthOrder(defenseRows,/^(S|FS|SS|LB|ILB|MLB|OLB|WLB|SLB)$/,'COV',2);
  const count = Math.max(receivers.length, corners.length);
  if (!count) return `<section class="coverage-side"><header><strong>${escapeHtml(offense.abbrev)} receivers vs ${escapeHtml(defense.abbrev)} secondary</strong><span class="status-pill projected">Projected</span></header><div class="empty">Pregame personnel is not available in this ESPN game payload yet. Import verified history below or reopen near kickoff.</div></section>`;
  return `<section class="coverage-side"><header><strong>${escapeHtml(offense.abbrev)} WR depth vs ${escapeHtml(defense.abbrev)} CB depth</strong><span class="status-pill projected">Role aligned</span></header><p class="source-note">WR1 is compared with CB1, WR2 with CB2, through WR4/CB4. These are depth-corresponding matchup lanes, not a claim of shadow coverage.</p><div class="alignment-list">${Array.from({ length: count }, (_, index) => projectedPairRow(receivers[index],corners[index],offense,defense)).join('')}</div>${tightEnds.length ? `<div class="tight-end-coverage"><strong>TE coverage lanes</strong><small>Safety/linebacker role comparison</small>${tightEnds.map((tightEnd,index)=>projectedPairRow(tightEnd,tightEndDefenders[index],offense,defense)).join('')}</div>` : ''}</section>`;
}

async function renderMatchups() {
  if (!els.matchupBoard) return;
  const previous = state.matchupGameId;
  els.matchupGameSelect.innerHTML = state.games.map((game) => `<option value="${escapeHtml(game.id)}">${escapeHtml(game.away.abbrev)} at ${escapeHtml(game.home.abbrev)}</option>`).join('');
  const game = state.games.find((item) => item.id === previous) || state.games[0];
  if (!game) { els.matchupBoard.innerHTML = '<div class="empty">Load a slate to analyze its coverage matchups.</div>'; return; }
  state.matchupGameId = game.id; els.matchupGameSelect.value = game.id;
  localStorage.setItem(key('matchupGameId'), game.id);
  const rows = coverageRowsForGame(game);
  els.coverageDataStatus.textContent = `${state.coverageRows.length} verified row${state.coverageRows.length === 1 ? '' : 's'} stored locally`;
  els.matchupSummary.innerHTML = `<span><b>${rows.length}</b> source rows for this matchup</span><span><b>${new Set(rows.map((row) => row.receiver)).size}</b> receivers</span><span><b>${new Set(rows.map((row) => row.defender)).size}</b> defenders</span><span><b>${new Set(rows.map((row) => row.game_id || row.date)).size}</b> meetings</span>`;
  els.matchupBoard.innerHTML = '<div class="empty">Loading matchup personnel…</div>';
  let summary = state.matchupSummaries.get(game.id);
  if (!summary) {
    summary = await getJson(`${API_BASE}/summary?event=${encodeURIComponent(game.id)}`).catch(() => null);
    if (summary) { await hydrateGamePlayerProfiles(summary.boxscore || {}, game).catch(() => {}); state.matchupSummaries.set(game.id, summary); }
  }
  const personnel = await loadMatchupPersonnel(game).catch(() => null);
  if (state.matchupGameId !== game.id) return;
  const source = personnel?.sources?.depth ? 'nflverse depth charts' : personnel?.sources?.weekly ? 'nflverse weekly rosters' : personnel?.sources?.espn ? 'ESPN team rosters' : 'game participant fallback';
  els.matchupBoard.innerHTML = `<div class="matchup-source-strip">Personnel source: ${source}. Every player includes an explicit position label.</div><div class="projected-grid">${projectedMatchupsHtml(game, summary?.boxscore || {}, personnel)}</div><section class="coverage-history"><header><div><span class="eyebrow">Verified History</span><strong>Receiver vs defender results</strong></div><span class="status-pill verified">Imported / charted</span></header>${coverageHistoryHtml(rows)}</section>`;
}

function downloadText(filename, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function relevantStatCategories(position, categories = []) {
  const pos = String(position || '').toUpperCase();
  const wanted = isReceiverPosition(pos) ? ['receiving','rushing']
    : /^(QB)$/.test(pos) ? ['passing','rushing']
    : /^(RB|HB|FB)$/.test(pos) ? ['rushing','receiving']
    : isSecondaryPosition(pos) ? ['defensive','interceptions','fumbles']
    : /^(DE|LDE|RDE|DT|LDT|RDT|NT|DL|EDGE|LB|ILB|MLB|OLB|WLB|SLB)$/.test(pos) ? ['defensive','sacks','fumbles','interceptions']
    : /^(K|PK)$/.test(pos) ? ['kicking'] : /^(P)$/.test(pos) ? ['punting'] : [];
  const selected = categories.filter((category) => wanted.some((name) => normalizeStatKey(category.name).includes(normalizeStatKey(name))));
  return selected.length ? selected : categories.slice(0, 3);
}

function playerStatCardHtml(category) {
  const useful = category.stats.filter((stat) => stat.value !== '--').slice(0, 12);
  return `<section class="player-card-stat-group stat-${normalizeStatKey(category.name)}"><header><strong>${escapeHtml(category.displayName)}</strong><span>${escapeHtml(category.position || '')}</span></header><div class="player-card-stat-grid">${useful.map((stat) => `<div><span>${escapeHtml(stat.label)}</span><b>${escapeHtml(stat.value)}</b><small>${escapeHtml(stat.displayName)}</small></div>`).join('')}</div></section>`;
}

function profileStat(profile, names) {
  for (const category of profile?.statCategories || []) for (const stat of category.stats || []) if (names.some((name) => normalizeStatKey(stat.name || stat.label) === normalizeStatKey(name))) return numericStatValue(stat.value);
  return 0;
}

function playerForecastScore(position, profile) {
  const pos = depthPositionGroup(position || profile?.position);
  if (pos === 'QB') return profileStat(profile, ['passingYards']) / 35 + profileStat(profile, ['passingTouchdowns']) * 5 - profileStat(profile, ['interceptions']) * 3 + profileStat(profile, ['adjQBR']) / 4;
  if (pos === 'WR' || pos === 'TE') return profileStat(profile, ['receivingYards']) / 12 + profileStat(profile, ['receptions']) * .7 + profileStat(profile, ['receivingTouchdowns']) * 7;
  if (pos === 'RB' || pos === 'FB') return profileStat(profile, ['rushingYards']) / 12 + profileStat(profile, ['rushingTouchdowns']) * 7 + profileStat(profile, ['receivingYards']) / 25;
  if (['CB','S','FS','SS','DB'].includes(pos)) return profileStat(profile, ['interceptions']) * 15 + profileStat(profile, ['passesDefended']) * 4 + profileStat(profile, ['totalTackles']) * .4 + profileStat(profile, ['sacks']) * 5;
  return profileStat(profile, ['totalTackles']) * .5 + profileStat(profile, ['sacks']) * 8 + profileStat(profile, ['interceptions']) * 12 + profileStat(profile, ['tacklesForLoss']) * 3;
}

function autoPlayerTier(id, position, profile) {
  const group = depthPositionGroup(position || profile?.position); const score = playerForecastScore(group, profile);
  if (!Number.isFinite(score) || score <= 0) return { tier: 'mid', decile: 5, score: 0, provisional: true };
  if (id && Number.isFinite(score)) { if (!state.ratingCohorts.has(group)) state.ratingCohorts.set(group, new Map()); state.ratingCohorts.get(group).set(String(id), score); }
  const values = [...(state.ratingCohorts.get(group)?.values() || [])].sort((a, b) => a - b); const rank = values.length > 1 ? values.filter((value) => value <= score).length / values.length : .5;
  const tier = rank >= .8 ? 'elite' : rank <= .3 ? 'bad' : 'mid';
  return { tier, decile: Math.max(1, Math.min(10, Math.ceil(rank * 10))), score };
}

function playerTierFor(id, position, profile) {
  const auto = autoPlayerTier(id, position, profile); const override = state.playerTierOverrides[String(id)]; return { ...auto, tier: override || auto.tier, overridden: Boolean(override) };
}

function forecastHighlights(position, profile) {
  const pos = depthPositionGroup(position || profile?.position); const games = Math.max(1, profileStat(profile, ['gamesPlayed']));
  const metrics = pos === 'QB' ? [['Pass Yds/G', profileStat(profile,['passingYards']) / games],['Pass TD/G',profileStat(profile,['passingTouchdowns']) / games],['INT/G',profileStat(profile,['interceptions']) / games],['Rating',profileStat(profile,['QBRating'])]]
    : pos === 'WR' || pos === 'TE' ? [['Rec/G',profileStat(profile,['receptions']) / games],['Rec Yds/G',profileStat(profile,['receivingYards']) / games],['TD/G',profileStat(profile,['receivingTouchdowns']) / games],['Y/Rec',profileStat(profile,['yardsPerReception'])]]
    : pos === 'RB' || pos === 'FB' ? [['Rush Yds/G',profileStat(profile,['rushingYards']) / games],['Y/Carry',profileStat(profile,['yardsPerRushAttempt'])],['Rush TD/G',profileStat(profile,['rushingTouchdowns']) / games],['Rec Yds/G',profileStat(profile,['receivingYards']) / games]]
    : [['Tackles/G',profileStat(profile,['totalTackles']) / games],['Sacks',profileStat(profile,['sacks'])],['INT',profileStat(profile,['interceptions'])],['TFL',profileStat(profile,['tacklesForLoss'])]];
  return metrics.map(([label,value]) => `<div><span>${label}</span><b>${Number(value || 0).toFixed(1)}</b></div>`).join('');
}

function playReferencesPlayer(play, player, side) {
  const id = String(player.gsisId || ''); const participantList = side === 'offense' ? play.offensePlayers : play.defensePlayers;
  if (id && String(participantList || '').includes(id)) return true;
  if (/^(LT|LG|C|RG|RT|T|OT|G|OG|OL)$/.test(String(player.position || '').toUpperCase())) return false;
  const words = String(player.name || '').trim().split(/\s+/); if (['jr','sr','ii','iii','iv','v'].includes(normalizeStatKey(words.at(-1)))) words.pop(); const surname = normalizeStatKey(words.at(-1) || '');
  if (!surname) return false;
  if (depthPositionGroup(player.position) === 'QB') return normalizeStatKey(play.quarterback).includes(surname);
  return normalizeStatKey(play.text).includes(surname);
}

function schemeSample(label, rows, perspective = 'offense') {
  const success = rows.length ? rows.filter((play) => play.success).length / rows.length : null; const yards = rows.length ? average(rows.map((play) => play.yards)) : null;
  const explosive = rows.length ? rows.filter((play) => play.explosive).length / rows.length : null; const passes = rows.filter((play) => play.type === 'pass'); const pressure = passes.length ? passes.filter((play) => play.pressure || play.sack).length / passes.length : null;
  const score = rows.length ? (perspective === 'defense' ? (1 - success) * .7 + clamp((6 - yards) / 8, 0, 1) * .3 : success * .7 + clamp((yards - 1) / 9, 0, 1) * .3) : null;
  return { label, plays: rows.length, success, yards, explosive, pressure, score };
}

async function playerSchemeProfile(player, team, contextGame, season) {
  const cacheKey = `${season}|${team?.abbrev || player.team}|${player.gsisId || normalizeStatKey(player.name)}|${contextGame?.id || ''}`;
  if (playerSchemeProfileCache.has(cacheKey)) return playerSchemeProfileCache.get(cacheKey);
  const promise = (async () => {
    if (!team || !contextGame) return { samples: [], plays: 0, exact: false, charted: 0, games: 0 };
    const sampleGames = recentGamesForTeam(team, contextGame, 8); if (!sampleGames.length) return { samples: [], plays: 0, exact: false, charted: 0, games: 0 };
    const summaries = await Promise.all(sampleGames.map(async (game) => ({ game, summary: await fetchForecastSummary(game) })));
    const participationRows = await fetchParticipationForGames(season, new Set(sampleGames.map((game) => String(game.id)))).catch(() => []);
    const all = evidenceFromSummaries(summaries.filter((item) => item.summary), participationRows); const side = positionUnit(player.position); const teamKey = normalizedNflTeam(team.abbrev);
    const teamRows = all.filter((play) => normalizedNflTeam(side === 'defense' ? play.defense : play.offense) === teamKey); let rows = teamRows.filter((play) => playReferencesPlayer(play, player, side));
    const exact = rows.length > 0; const pos = depthPositionGroup(player.position); const isLine = /^(LT|LG|C|RG|RT|T|OT|G|OG|OL)$/.test(String(player.position || '').toUpperCase());
    if (!rows.length && isLine) rows = teamRows;
    const perspective = side === 'defense' ? 'defense' : 'offense'; const pass = rows.filter((play) => play.type === 'pass'); const rush = rows.filter((play) => play.type === 'rush'); let samples = [];
    if (pos === 'QB') samples = [schemeSample('vs man',pass.filter((play)=>play.manZone==='man')),schemeSample('vs zone',pass.filter((play)=>play.manZone==='zone')),schemeSample('vs blitz',pass.filter((play)=>play.blitz)),schemeSample('vs 4 or fewer',pass.filter((play)=>play.rushers != null && !play.blitz)),schemeSample('shotgun',pass.filter((play)=>play.formation==='SHOTGUN')),schemeSample('under center',pass.filter((play)=>play.formation!=='SHOTGUN'))];
    else if (pos === 'RB' || pos === 'FB') samples = [schemeSample('light box',rush.filter((play)=>play.defendersInBox != null && play.defendersInBox <= 6)),schemeSample('7+ box',rush.filter((play)=>play.defendersInBox >= 7)),schemeSample('shotgun run',rush.filter((play)=>play.formation==='SHOTGUN')),schemeSample('under-center run',rush.filter((play)=>play.formation!=='SHOTGUN')),schemeSample('left',rush.filter((play)=>play.direction==='left')),schemeSample('middle',rush.filter((play)=>play.direction==='middle')),schemeSample('right',rush.filter((play)=>play.direction==='right'))];
    else if (pos === 'WR' || pos === 'TE') samples = [schemeSample('target vs man',pass.filter((play)=>play.manZone==='man')),schemeSample('target vs zone',pass.filter((play)=>play.manZone==='zone')),schemeSample('target vs blitz',pass.filter((play)=>play.blitz)),schemeSample('shotgun target',pass.filter((play)=>play.formation==='SHOTGUN'))];
    else if (isLine) samples = [schemeSample('pass protection',pass),schemeSample('run blocking',rush),schemeSample('shotgun',rows.filter((play)=>play.formation==='SHOTGUN')),schemeSample('under center',rows.filter((play)=>play.formation!=='SHOTGUN'))];
    else samples = [schemeSample('vs pass',pass,perspective),schemeSample('vs run',rush,perspective),schemeSample('vs shotgun',rows.filter((play)=>play.formation==='SHOTGUN'),perspective),schemeSample('vs under center',rows.filter((play)=>play.formation!=='SHOTGUN'),perspective),schemeSample('on blitz calls',pass.filter((play)=>play.blitz),perspective)];
    return { samples: samples.filter((sample) => sample.plays), plays: rows.length, exact, charted: participationRows.length, games: sampleGames.length };
  })();
  playerSchemeProfileCache.set(cacheKey, promise); return promise;
}

function schemeSampleHtml(sample) {
  return `<article class="player-scheme-sample"><header><strong>${escapeHtml(sample.label)}</strong><span>${sample.plays} plays</span></header><div><span>Success</span><b>${percent(sample.success)}</b></div><div><span>Y/play</span><b>${sample.yards.toFixed(1)}</b></div>${sample.pressure == null ? `<div><span>Explosive</span><b>${percent(sample.explosive)}</b></div>` : `<div><span>Pressure</span><b>${percent(sample.pressure)}</b></div>`}</article>`;
}

function playerSchemeHtml(player, scheme) {
  if (!scheme?.samples?.length) return '<section class="player-scheme-section"><header><div><span class="eyebrow">Scheme performance</span><strong>No attributable play sample</strong></div></header><p>There were no verified prior-season plays that could be joined to this player. No scheme claim is being inferred.</p></section>';
  const qualified = scheme.samples.filter((sample) => sample.plays >= 3 && Number.isFinite(sample.score)).sort((a,b) => b.score - a.score); const best = qualified[0]; const worst = qualified.at(-1);
  return `<section class="player-scheme-section"><header><div><span class="eyebrow">Scheme performance</span><strong>${best ? `Best verified split: ${escapeHtml(best.label)}` : 'Small-sample scheme splits'}</strong></div><small>${scheme.games} games · ${scheme.plays} attributed plays · ${scheme.charted ? 'FTN charting joined' : 'public play-by-play'}</small></header><div class="player-scheme-grid">${scheme.samples.map(schemeSampleHtml).join('')}</div><div class="player-scheme-readout"><div><span>EXCELS</span><strong>${best ? `${escapeHtml(best.label)} · ${percent(best.success)} success` : 'Needs 3+ attributable plays'}</strong></div><div><span>WATCH</span><strong>${worst && worst !== best ? `${escapeHtml(worst.label)} · ${percent(worst.success)} success` : 'No reliable downside split yet'}</strong></div></div><p>${scheme.exact ? 'Player participation or direct play attribution was verified.' : 'Offensive-line fallback uses team-unit plays because individual participation could not be joined; this is labeled as a unit proxy.'}</p></section>`;
}

function ratingEvidenceHtml(player, evaluation) {
  const rows = evaluation.metrics.map(([label,value]) => `<div><span>${escapeHtml(label)}</span><b>${escapeHtml(typeof value === 'number' ? (Math.abs(value) < 1 && value !== 0 ? value.toFixed(2) : String(Math.round(value * 10) / 10)) : value)}</b></div>`).join('');
  return `<section class="player-rating-evidence"><header><div class="player-overall-grade"><b>${evaluation.grade}</b><span>${evaluation.label}<small>${evaluation.confidence}</small></span></div><div><strong>Why this rating</strong><p>${escapeHtml(evaluation.basis)}</p></div></header><div>${rows}</div><footer>${evaluation.season} regular season · nflverse player stats and snap counts${evaluation.hasEvidence ? '' : ' · role-based projection due to no NFL sample'}</footer></section>`;
}

function positionResponsibilityHtml(player, scheme) {
  const pos = depthPositionGroup(player.position); const best = scheme?.samples?.filter((sample)=>sample.plays>=3).sort((a,b)=>b.score-a.score)[0];
  const copy = pos === 'QB' ? ['Decision quality','EPA, CPOE, sacks and turnovers','Coverage and pressure splits'] : pos === 'RB' || pos === 'FB' ? ['Rushing value','Efficiency, volume and receiving value','Box count, direction and formation'] : pos === 'WR' || pos === 'TE' ? ['Route outcome','Targets, yards per target and scoring','Man/zone and blitz targets'] : /^(LT|LG|C|RG|RT|T|OT|G|OG|OL)$/.test(String(player.position||'').toUpperCase()) ? ['Blocking reliability','Snap share and lineup stability','Pressure, run success and formation'] : ['Defensive impact','Disruption, coverage plays and workload','Pass/run and formation results'];
  return `<section class="position-responsibility"><div><span>POSITION JOB</span><strong>${copy[0]}</strong><small>${copy[1]}</small></div><div><span>SCHEME LENS</span><strong>${copy[2]}</strong><small>${best ? `Strongest sample: ${escapeHtml(best.label)}` : 'Awaiting a qualified sample'}</small></div><div><span>AVAILABILITY</span><strong>${escapeHtml(player.status || 'ACTIVE')}</strong><small>${player.expectedStarter ? `Expected ${escapeHtml(player.expectedRole || 'starter')}` : 'Roster competition / rotation'}</small></div></section>`;
}

function playerMatchupFitHtml(player, team, contextGame, forecast, scheme) {
  if (!forecast || !contextGame || !team?.abbrev) return '';
  const isAway = normalizedNflTeam(team.abbrev) === normalizedNflTeam(contextGame.away.abbrev); const own = isAway ? forecast.away : forecast.home; const opponent = isAway ? forecast.home : forecast.away; const projection = isAway ? forecast.model.away : forecast.model.home; const opponentTeam = isAway ? contextGame.home : contextGame.away; const pos = depthPositionGroup(player.position); const side = positionUnit(player.position);
  let metrics;
  if (side === 'defense') metrics = [['Opponent pass rate',percent(opponent.offense.passRate)],['Opponent success',percent(opponent.offense.successRate)],['Opponent Y/play',opponent.offense.yardsPerPlay.toFixed(1)]];
  else if (pos === 'RB' || pos === 'FB') metrics = [['Rush success allowed',percent(opponent.defense.rushSuccessRate)],['Rush yards allowed',opponent.defense.yardsPerRush.toFixed(1)],['Opponent front',Math.round(opponent.units.defenseFront)]];
  else if (/^(LT|LG|C|RG|RT|T|OT|G|OG|OL)$/.test(String(player.position||'').toUpperCase())) metrics = [['Projected pressure',percent(projection.pressure)],['Opponent sack rate',percent(opponent.defense.sackRate)],['Opponent front',Math.round(opponent.units.defenseFront)]];
  else metrics = [['Projected pressure',percent(projection.pressure)],['Pass success allowed',percent(opponent.defense.passSuccessRate)],['Explosives allowed',percent(opponent.defense.explosivePassRate)]];
  const best = scheme?.samples?.filter((sample)=>sample.plays>=3).sort((a,b)=>b.score-a.score)[0]; let allowed = null;
  if (best?.label.includes('shotgun')) allowed = opponent.defense.shotgunSuccessRate;
  else if (best?.label.includes('under center')) allowed = opponent.defense.nonShotgunSuccessRate;
  else if (best?.label.includes('run') || pos === 'RB' || pos === 'FB') allowed = opponent.defense.rushSuccessRate;
  else if (best) allowed = opponent.defense.passSuccessRate;
  const alignment = Number.isFinite(allowed) ? (allowed >= .45 ? `${opponentTeam.abbrev} has allowed ${percent(allowed)} success in that family — favorable alignment.` : `${opponentTeam.abbrev} has held that family to ${percent(allowed)} success — resistance point.`) : 'The opponent-specific tendency does not have a qualified public sample.';
  return `<section class="player-matchup-fit"><header><div><span class="eyebrow">Current matchup fit</span><strong>${escapeHtml(player.name)} vs ${escapeHtml(opponentTeam.name)} scheme</strong></div><small>${forecast.sampleGames.length} opponent-adjusted games</small></header><div>${metrics.map(([label,value])=>`<div><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`).join('')}</div><p><b>${best ? `Best prior split: ${escapeHtml(best.label)}.` : 'No qualified player split.'}</b> ${escapeHtml(alignment)}</p></section>`;
}

async function openNflPlayerCard(button, preserveContext = false) {
  const id = button.dataset.playerId || ''; const name = button.dataset.playerName || 'Player'; const position = button.dataset.playerPosition || ''; const teamAbbrev = button.dataset.playerTeam || ''; const personnelKey = button.dataset.personnelKey || `${teamAbbrev}|${id || normalizeStatKey(name)}`;
  if (!preserveContext) {
    const scope = button.closest('#gameDialog, #matchupsPage') || document;
    state.playerCardContext = [...new Map([...scope.querySelectorAll('[data-player-card]')].map((entry) => [`${entry.dataset.playerId}|${entry.dataset.playerName}`, entry])).values()];
  }
  state.playerCardIndex = state.playerCardContext.findIndex((entry) => String(entry.dataset.playerId) === String(id) && entry.dataset.playerName === name);
  const team = state.teams.find((entry) => entry.abbrev === teamAbbrev) || [...state.games.flatMap((game) => [game.away, game.home])].find((entry) => entry.abbrev === teamAbbrev) || {};
  const color = button.dataset.playerColor || team.color || '#62d7ff'; const logo = button.dataset.playerLogo || team.logo || '';
  els.playerDialogBody.innerHTML = `<div class="player-card-loading">Loading ${escapeHtml(name)}…</div>`; if (!els.playerDialog.open) els.playerDialog.showModal();
  const contextGame = state.games.find((game) => game.id === state.openGameId) || state.games.find((game) => game.away.abbrev === teamAbbrev || game.home.abbrev === teamAbbrev);
  const season = analysisSeasonForGame(contextGame); const player = state.personnelPlayers.get(personnelKey) || { id, espnId: id, name, position, team: teamAbbrev, evaluation: null, evidence: null, status: '' };
  const [profile, scheme, matchupForecast] = await Promise.all([id ? fetchNflAthleteSeasonProfile(id, season).catch(() => null) : Promise.resolve(null), playerSchemeProfile(player, team, contextGame, season).catch(() => null), contextGame ? buildForecastForGame(contextGame,{ sampleSize: 6 }).catch(() => null) : Promise.resolve(null)]);
  const categories = relevantStatCategories(position || profile?.position, profile?.statCategories || []);
  const evaluation = player.evaluation || playerGrade(player, player.evidence); const actualYear = categories.find((category) => category.season)?.season || season;
  els.playerDialogBody.innerHTML = `<article class="nfl-player-card" style="--player-team:${escapeHtml(color)};--player-logo:url('${escapeHtml(logo)}')"><button type="button" class="player-card-close" data-player-dialog-close>×</button><button type="button" class="player-nav-arrow player-nav-prev" data-player-nav="-1" ${state.playerCardIndex <= 0 ? 'disabled' : ''} aria-label="Previous player">‹</button><button type="button" class="player-nav-arrow player-nav-next" data-player-nav="1" ${state.playerCardIndex < 0 || state.playerCardIndex >= state.playerCardContext.length - 1 ? 'disabled' : ''} aria-label="Next player">›</button><header class="nfl-player-card-head"><div class="player-card-portrait-wrap"><img class="player-card-logo" src="${escapeHtml(logo)}" alt=""><img class="player-card-portrait" src="${escapeHtml(profile?.headshot || player.headshot || (id ? `https://a.espncdn.com/i/headshots/nfl/players/full/${id}.png` : logo))}" alt="${escapeHtml(name)}"></div><div><span>${escapeHtml(teamAbbrev)} · ${escapeHtml(position || profile?.position || 'Position unavailable')} · ${actualYear} baseline</span><h2>${escapeHtml(name)}</h2><p>Position-specific production, role, availability and scheme performance.</p></div></header><div class="nfl-player-card-content">${ratingEvidenceHtml(player,evaluation)}${positionResponsibilityHtml(player,scheme)}${playerMatchupFitHtml(player,team,contextGame,matchupForecast,scheme)}${playerSchemeHtml(player,scheme)}<section class="official-season-section"><header><div><span class="eyebrow">Official season totals</span><strong>${actualYear} statistics</strong></div><small>ESPN player feed</small></header>${categories.length ? categories.map(playerStatCardHtml).join('') : `<div class="empty">${/^(LT|LG|C|RG|RT|T|OT|G|OG|OL)$/.test(position) ? 'NFL box scores do not publish individual blocking totals. This card uses verified snap participation and team outcomes instead.' : 'No official box-score category was returned; the rating evidence above still shows its source and confidence.'}</div>`}</section></div></article>`;
  const positionGroup = normalizeStatKey(depthPositionGroup(position || profile?.position));
  els.playerDialogBody.querySelector('.nfl-player-card')?.classList.add(`player-card-${positionGroup}`);
}

function renderTabs() {
  document.body.dataset.page = state.page;
  document.querySelectorAll('[data-page]').forEach((button) => {
    const active = button.dataset.page === state.page;
    button.classList.toggle('active', active);
    document.getElementById(`${button.dataset.page}Page`)?.classList.toggle('active', active);
  });
}

function quickGameForecast(game) {
  const cached = state.gameForecastCache.get(`quick:${game.id}`);
  if (cached) return cached;
  const sampleSize = 6; const awayGames = recentGamesForTeam(game.away, game, sampleSize); const homeGames = recentGamesForTeam(game.home, game, sampleSize);
  const awayScoring = scoringProfile(game.away, awayGames); const homeScoring = scoringProfile(game.home, homeGames); const ratings = teamPowerRatings(game);
  const awayPower = ratings.get(normalizedNflTeam(game.away.abbrev)) || 0; const homePower = ratings.get(normalizedNflTeam(game.home.abbrev)) || 0;
  const awayPoints = clamp(awayScoring.pointsFor * .53 + homeScoring.pointsAgainst * .47 + (awayPower - homePower) * .16, 10, 38);
  const homePoints = clamp(homeScoring.pointsFor * .53 + awayScoring.pointsAgainst * .47 + (homePower - awayPower) * .16 + 1.25, 10, 38);
  const homeWin = clamp(1 / (1 + Math.exp(-(homePoints - awayPoints) / 6.5)), .12, .88); const awayWin = 1 - homeWin;
  const favorite = homeWin >= .5 ? game.home : game.away; const favoriteWin = Math.max(homeWin, awayWin);
  const awayRunDefense = RUN_DEFENSE_2025.find((row) => row.team === normalizedNflTeam(game.away.abbrev)); const homeRunDefense = RUN_DEFENSE_2025.find((row) => row.team === normalizedNflTeam(game.home.abbrev));
  const edges = [
    { team: game.away, label: 'scoring form', value: awayScoring.pointsFor - homeScoring.pointsFor },
    { team: game.home, label: 'scoring form', value: homeScoring.pointsFor - awayScoring.pointsFor },
    { team: game.away, label: 'run defense', value: (homeRunDefense?.rank || 16.5) - (awayRunDefense?.rank || 16.5) },
    { team: game.home, label: 'run defense', value: (awayRunDefense?.rank || 16.5) - (homeRunDefense?.rank || 16.5) },
  ].sort((a, b) => b.value - a.value);
  const topEdge = edges[0]?.value > 1 ? `${edges[0].team.abbrev} ${edges[0].label}` : 'No dominant unit edge';
  const result = { awayPoints, homePoints, homeWin, awayWin, favorite, favoriteWin, topEdge, sampleGames: Math.min(awayGames.length, homeGames.length), baselineSeason: analysisSeasonForGame(game) };
  state.gameForecastCache.set(`quick:${game.id}`, result); return result;
}

function compactTeamRowHtml(team, side, projected, game) {
  const palette = teamPalette(team); const isFinal = game.status?.type?.completed; const selected=teamPickSelected(game,side); const score = isFinal || game.status?.type?.state === 'in' ? team.score : projected.toFixed(1);
  return `<button type="button" class="compact-team ${side} ${selected?'is-selected':''}" data-side="${side}" style="--team-primary:${palette.primary};--team-secondary:${palette.secondary};--team-tertiary:${palette.tertiary};--team-on-primary:${palette.onPrimary}"><i class="compact-team-logo"><img src="${escapeHtml(team.logo)}" alt=""></i><span><strong>${escapeHtml(team.abbrev)}</strong><small>${escapeHtml(team.record || '--')}</small></span><b>${escapeHtml(score)}</b><em>${selected?'PICKED':isFinal || game.status?.type?.state === 'in' ? 'score' : 'proj'}</em></button>`;
}

function compactForecastHtml(game, forecast) {
  if (game.status?.type?.completed) {
    const winner = game.away.winner ? game.away : game.home.winner ? game.home : null;
    return `<div class="compact-pick final"><strong>${winner ? `${escapeHtml(winner.abbrev)} WON` : 'FINAL'}</strong><span>${escapeHtml(forecast.topEdge)}</span></div>`;
  }
  return `<div class="compact-pick"><strong>${escapeHtml(forecast.favorite.abbrev)} ${percent(forecast.favoriteWin)}</strong><span>${escapeHtml(forecast.topEdge)}</span><i style="width:${Math.round(forecast.favoriteWin * 100)}%"></i></div>`;
}

function renderScoreboard() {
  els.gamesGrid.replaceChildren();
  if (!state.games.length) {
    els.gamesGrid.innerHTML = `<div class="empty">No NFL games loaded for ${escapeHtml(longDate(state.selectedDate))}. Try a Sunday, Monday, Thursday, or playoff date.</div>`;
    return;
  }
  for (const game of [...state.games].sort((a, b) => new Date(a.date) - new Date(b.date))) {
    const forecast = quickGameForecast(game); const awayPalette = teamPalette(game.away); const homePalette = teamPalette(game.home);
    const node = els.gameTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.gameId = game.id;
    node.style.cssText += `;${teamPaletteVars(game.away, game.home)}`;
    node.style.setProperty('--away-color', awayPalette.primary);
    node.style.setProperty('--home-color', homePalette.primary);
    node.style.setProperty('--game-accent', homePalette.primary);
    node.style.setProperty('--ghost-logo', `url("${game.home.logo || game.away.logo}")`);
    node.querySelector('.game-meta').innerHTML = `<span>${escapeHtml(game.dateText || statusText(game))}</span><span>${escapeHtml(game.broadcast || statusText(game))}</span>`;
    node.querySelector('.compact-matchup').innerHTML = `${compactTeamRowHtml(game.away, 'away', forecast.awayPoints, game)}<span class="compact-at">AT</span>${compactTeamRowHtml(game.home, 'home', forecast.homePoints, game)}`;
    node.querySelector('.compact-forecast').innerHTML = compactForecastHtml(game, forecast);
    node.querySelectorAll('.compact-team').forEach((row) => {
      row.dataset.pickable = 'true';
      const selected = state.slip.some((item) => item.type === 'team' && item.gameId === game.id && item.side === row.dataset.side);
      row.classList.toggle('is-selected', selected);
    });
    node.querySelector('.game-card-footer').innerHTML = `<span>${escapeHtml(game.venue || game.week?.text || '')}</span><strong>OPEN FORECAST →</strong>`;
    const watchBtn = node.querySelector('.watch-btn');
    watchBtn.classList.toggle('active', state.watched.includes(game.id));
    watchBtn.textContent = state.watched.includes(game.id) ? '*' : '+';
    watchBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleWatch(game.id);
    });
    node.querySelectorAll('.compact-team').forEach((row) => {
      row.addEventListener('click', (event) => {
        event.stopPropagation();
        addTeamPick(game, row.dataset.side);
      });
    });
    node.addEventListener('click', () => openGameDialog(game.id));
    els.gamesGrid.appendChild(node);
  }
}

function teamRowHtml(game, side) {
  const team = game[side];
  const possession = possessionTeam(game) === team.id ? '<span class="possession">POS</span>' : '';
  return `
    <img src="${escapeHtml(team.logo)}" alt="${escapeHtml(team.abbrev)} logo" />
    <div class="team-name">
      <strong style="color:${escapeHtml(readableTeamColor(team.color))}">${escapeHtml(team.abbrev)} ${escapeHtml(team.shortName)}</strong>
      <span>${escapeHtml(team.record)} ${possession}</span>
    </div>
    <div class="team-score">${escapeHtml(team.score)}</div>
  `;
}

function possessionTeam(game) {
  return String(game?.situation?.possession || game?.situation?.possessionTeam?.id || '');
}

function stateStripHtml(game) {
  const downDistance = game.situation?.downDistanceText || game.situation?.shortDownDistanceText || '';
  const yardLine = game.situation?.possessionText || game.situation?.yardLineText || '';
  const odds = game.odds?.details || (game.odds?.overUnder ? `O/U ${game.odds.overUnder}` : '');
  return `<span>${escapeHtml(game.week?.text || game.dateText || '')}</span><span>${escapeHtml(downDistance || statusText(game))}</span><span>${escapeHtml(yardLine || odds)}</span>`;
}

function footerText(game) {
  const details = [];
  if (game.odds?.details) details.push(game.odds.details);
  if (game.odds?.overUnder) details.push(`O/U ${game.odds.overUnder}`);
  if (game.venue) details.push(game.venue);
  return details.join(' | ') || 'Click card for leaders, drives, and box score';
}

function renderTeams() {
  if (!state.teams.length) {
    els.teamsTableWrap.innerHTML = '<div class="empty">Team information has not loaded yet.</div>';
    return;
  }
  els.divisionToggle.textContent = state.groupDivisions ? 'Divisions On' : 'Divisions Off';
  const rows = sortedTeams();
  if (state.groupDivisions) {
    const groups = new Map();
    rows.forEach((team) => {
      const division = team.division || 'NFL';
      if (!groups.has(division)) groups.set(division, []);
      groups.get(division).push(team);
    });
    els.teamsTableWrap.innerHTML = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([division, teams]) => `
      <div class="division-title">${escapeHtml(division)}</div>
      ${teamTableHtml(teams)}
    `).join('');
  } else {
    els.teamsTableWrap.innerHTML = teamTableHtml(rows);
  }
}

function sortedTeams() {
  const { key: sortKey, dir } = state.teamSort;
  const direction = dir === 'asc' ? 1 : -1;
  return [...state.teams].sort((a, b) => {
    const av = teamSortValue(a, sortKey);
    const bv = teamSortValue(b, sortKey);
    if (typeof av === 'string' || typeof bv === 'string') return String(av).localeCompare(String(bv)) * direction;
    return (av - bv) * direction || a.abbrev.localeCompare(b.abbrev);
  });
}

function teamSortValue(team, sortKey) {
  if (sortKey === 'team') return team.abbrev;
  if (sortKey === 'record') return numberFromRecord(team.record);
  if (sortKey === 'winPct') return Number(team.winPct) || numberFromRecord(team.record);
  return Number(team[sortKey]) || 0;
}

function teamTableHtml(teams) {
  const headers = [
    ['team', 'Team'],
    ['record', 'Record'],
    ['winPct', 'Pct'],
    ['pointsFor', 'PF'],
    ['pointsAgainst', 'PA'],
    ['differential', 'Diff'],
    ['streak', 'Streak'],
  ];
  return `
    <table class="nfl-table">
      <thead><tr>${headers.map(([keyName, label]) => `<th><button type="button" data-team-sort="${keyName}">${label}${state.teamSort.key === keyName ? (state.teamSort.dir === 'asc' ? ' +' : ' -') : ''}</button></th>`).join('')}</tr></thead>
      <tbody>
        ${teams.map((team) => `
          <tr>
            <td><div class="team-cell"><img src="${escapeHtml(team.logo)}" alt="${escapeHtml(team.abbrev)} logo" /><div><strong style="color:${escapeHtml(readableTeamColor(team.color))}">${escapeHtml(team.abbrev)}</strong><span>${escapeHtml(team.name)}</span></div></div></td>
            <td>${escapeHtml(team.record)}</td>
            <td>${escapeHtml(displayPct(team.winPct || numberFromRecord(team.record)))}</td>
            <td>${escapeHtml(team.pointsFor)}</td>
            <td>${escapeHtml(team.pointsAgainst)}</td>
            <td>${escapeHtml(team.differential)}</td>
            <td>${escapeHtml(team.streak)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function displayPct(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '--';
  return numeric <= 1 ? numeric.toFixed(3).replace(/^0/, '') : (numeric / 100).toFixed(3).replace(/^0/, '');
}

function renderLeaders() {
  const buckets = Object.values(state.leaders);
  if (!buckets.length) {
    els.leadersGrid.innerHTML = '<div class="empty">Leader data is not loaded yet.</div>';
    return;
  }
  els.leadersGrid.innerHTML = buckets.map((bucket) => `
    <section class="leader-card">
      <header><span class="eyebrow">${escapeHtml(bucket.label || 'Leaders')}</span></header>
      <div class="leader-list">
        ${(bucket.entries || []).length ? bucket.entries.map((entry, index) => `
          <div class="leader-row">
            <strong>${index + 1}</strong>
            <div class="leader-main"><strong>${escapeHtml(entry.name)}</strong><span>${escapeHtml(entry.team || 'NFL')}</span></div>
            <div class="leader-value">${escapeHtml(entry.value)}</div>
          </div>
        `).join('') : '<div class="empty">Unavailable from source</div>'}
      </div>
    </section>
  `).join('');
}

function renderBetSlip() {
  if (!state.slip.length) {
    els.betSlip.innerHTML = '<div class="empty">No picks yet. Click a team row or use the prop builder.</div>';
    return;
  }
  els.betSlip.innerHTML = state.slip.map((item, index) => `
    <div class="slip-item">
      <div class="slip-main"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subtitle || '')}</span></div>
      <button class="slip-remove" type="button" data-slip-remove="${index}">x</button>
    </div>
  `).join('');
}

function renderWatchList() {
  const watchedGames = state.games.filter((game) => state.watched.includes(game.id));
  els.watchList.innerHTML = watchedGames.length ? watchedGames.map((game) => `
    <div class="watch-item">
      <img src="${escapeHtml(game.away.logo)}" alt="" />
      <div class="leader-main"><strong>${escapeHtml(game.shortName || game.name)}</strong><span>${escapeHtml(statusText(game))}</span></div>
      <span class="leader-value">${escapeHtml(game.away.score)}-${escapeHtml(game.home.score)}</span>
    </div>
  `).join('') : '<div class="empty">No watched games on this slate.</div>';
}

function renderSlateNotes() {
  const live = state.games.filter((game) => game.status?.type?.state === 'in').length;
  const finals = state.games.filter((game) => game.status?.type?.completed).length;
  const withOdds = state.games.filter((game) => game.odds?.details || game.odds?.overUnder).length;
  const notes = [
    ['Slate', `${state.games.length} games | ${live} live | ${finals} final`],
    ['Odds', `${withOdds} games with spread/total hints`],
    ['Date', longDate(state.selectedDate)],
  ];
  els.slateNotes.innerHTML = notes.map(([title, value]) => `
    <div class="note-item">
      <div class="note-main"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(value)}</span></div>
    </div>
  `).join('');
}

function renderTouchdownFeed() {
  if (!els.touchdownFeed) return;
  if (!state.touchdowns.length) {
    els.touchdownFeed.innerHTML = '<div class="empty">No touchdowns found for this slate yet.</div>';
    return;
  }
  els.touchdownFeed.innerHTML = state.touchdowns.map((td) => `
    <article class="td-item">
      <img src="${escapeHtml(td.logo)}" alt="${escapeHtml(td.team || 'NFL')} logo" />
      <div class="td-main">
        <strong>${escapeHtml(td.headline)}</strong>
        <span>${escapeHtml(td.detail)}</span>
      </div>
      <div class="td-time">${escapeHtml(td.time)}</div>
    </article>
  `).join('');
}

async function fetchTouchdownsForSlate(games = state.games) {
  const summaries = await Promise.all((games || []).map((game) => (
    getJson(`${API_BASE}/summary?event=${encodeURIComponent(game.id)}`)
      .then((summary) => ({ game, summary }))
      .catch(() => ({ game, summary: null }))
  )));
  const touchdowns = [];
  for (const { game, summary } of summaries) {
    enrichGameFromSummary(game, summary);
    const plays = [
      ...(summary?.scoringPlays || []),
      ...(summary?.drives?.previous || []).flatMap((drive) => drive?.plays || []),
    ];
    for (const play of plays) {
      const td = normalizeTouchdownPlay(game, play);
      if (td) touchdowns.push(td);
    }
  }
  return dedupeTouchdowns(touchdowns).sort((a, b) => a.sortTime - b.sortTime || a.gameLabel.localeCompare(b.gameLabel));
}

function enrichGameFromSummary(game, summary) {
  if (!game || !summary) return;
  const teams = summary?.boxscore?.teams || [];
  for (const side of ['away', 'home']) {
    const current = game[side];
    const boxTeam = teams.find((entry) => String(entry?.team?.id || '') === String(current?.id || '')
      || String(entry?.team?.abbreviation || '').toUpperCase() === String(current?.abbrev || '').toUpperCase());
    if (!boxTeam) continue;
    if (Array.isArray(boxTeam.statistics) && boxTeam.statistics.length) current.stats = boxTeam.statistics;
    if (Array.isArray(boxTeam.linescores) && boxTeam.linescores.length) current.linescores = boxTeam.linescores;
  }
  if (summary.leaders?.length) game.leaders = summary.leaders;
}

function normalizeTouchdownPlay(game, play) {
  const text = play?.text || play?.description || play?.displayResult || '';
  const lower = text.toLowerCase();
  const isTouchdown = lower.includes('touchdown') || /\btd\b/i.test(text) || play?.scoringType?.name === 'touchdown';
  if (!isTouchdown) return null;
  const team = touchdownTeam(game, play);
  const parsed = parseTouchdownText(text);
  const period = play?.period?.number || play?.period || '';
  const clock = play?.clock?.displayValue || play?.clock || play?.displayClock || '';
  const gameClock = [period ? `Q${period}` : '', clock].filter(Boolean).join(' ');
  const headline = parsed.headline || `${team?.abbrev || 'NFL'} Touchdown`;
  return {
    id: String(play?.id || `${game.id}:${text}:${gameClock}`),
    gameId: game.id,
    gameLabel: game.shortName || game.name,
    team: team?.abbrev || '',
    logo: team?.logo || '',
    headline,
    detail: `${game.shortName || game.name} | ${parsed.detail || text || 'Touchdown'}`,
    time: gameClock || statusText(game),
    sortTime: touchdownSortValue(game, period, clock),
    raw: text,
  };
}

function gameScoreboardHtml(game) {
  return `
    <div class="madden-team madden-away team-row" data-side="away">
      ${teamBadgeHtml(game.away)}
    </div>
    <div class="madden-score-core">
      <div class="score-line">
        <strong style="color:${escapeHtml(readableTeamColor(game.away.color))}">${escapeHtml(game.away.score)}</strong>
        <span>${escapeHtml(scoreClockText(game))}</span>
        <strong style="color:${escapeHtml(readableTeamColor(game.home.color))}">${escapeHtml(game.home.score)}</strong>
      </div>
      ${quarterScoreHtml(game)}
    </div>
    <div class="madden-team madden-home team-row" data-side="home">
      ${teamBadgeHtml(game.home)}
    </div>
  `;
}

function teamBadgeHtml(team) {
  return `
    <img src="${escapeHtml(team.logo)}" alt="${escapeHtml(team.abbrev)} logo" />
    <div class="team-name">
      <strong style="color:${escapeHtml(readableTeamColor(team.color))}">${escapeHtml(team.abbrev)}</strong>
      <span>${escapeHtml(team.record || '--')}</span>
    </div>
  `;
}

function scoreClockText(game) {
  const downDistance = game.situation?.shortDownDistanceText || game.situation?.downDistanceText || '';
  const yardLine = game.situation?.possessionText || game.situation?.yardLineText || '';
  return downDistance || yardLine || statusText(game);
}

function quarterScoreHtml(game) {
  const count = Math.max(game.away.linescores?.length || 0, game.home.linescores?.length || 0, 4);
  const head = Array.from({ length: count }, (_, index) => `<span>${index + 1}</span>`).join('');
  const row = (team) => Array.from({ length: count }, (_, index) => `<span>${escapeHtml(team.linescores?.[index]?.value ?? team.linescores?.[index]?.displayValue ?? '-')}</span>`).join('');
  return `
    <div class="quarter-grid" style="--quarters:${count}">
      <b></b>${head}<b>T</b>
      <b>${escapeHtml(game.away.abbrev)}</b>${row(game.away)}<b>${escapeHtml(game.away.score)}</b>
      <b>${escapeHtml(game.home.abbrev)}</b>${row(game.home)}<b>${escapeHtml(game.home.score)}</b>
    </div>
  `;
}

function gameStatMenuHtml(game) {
  return `
    <div class="madden-stat-head"><span>${escapeHtml(game.away.abbrev)}</span><strong>Team Stats</strong><span>${escapeHtml(game.home.abbrev)}</span></div>
    ${gameStatRows(game).map((row) => `
      <div class="madden-stat-row">
        <span>${escapeHtml(row.away)}</span>
        <strong>${escapeHtml(row.label)}</strong>
        <span>${escapeHtml(row.home)}</span>
      </div>
    `).join('')}
  `;
}

function gameStatRows(game) {
  return [
    ['First Downs', ['firstDowns', 'first downs']],
    ['Total Offense', ['totalYards', 'total yards', 'total offensive yards']],
    ['Rush Yards', ['rushingYards', 'rushing yards']],
    ['Pass Yards', ['netPassingYards', 'passingYards', 'net passing yards', 'passing yards']],
    ['Turnovers', ['turnovers', 'total turnovers']],
    ['3rd Down', ['thirdDownEff', 'third down efficiency', '3rd down efficiency']],
  ].map(([label, aliases]) => ({
    label,
    away: statLookup(game.away.stats, aliases),
    home: statLookup(game.home.stats, aliases),
  }));
}

function touchdownTeam(game, play) {
  const teamId = String(play?.team?.id || play?.teamId || play?.scoringTeam?.id || '');
  if (teamId && String(game.away.id) === teamId) return game.away;
  if (teamId && String(game.home.id) === teamId) return game.home;
  const text = `${play?.team?.abbreviation || play?.team?.displayName || ''} ${play?.text || play?.description || ''}`.toLowerCase();
  if (text.includes(String(game.away.abbrev || '').toLowerCase())) return game.away;
  if (text.includes(String(game.home.abbrev || '').toLowerCase())) return game.home;
  return game.home;
}

function parseTouchdownText(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  let match = clean.match(/^(.+?)\s+pass(?:ed)?\s+.*?\s+to\s+(.+?)\s+for\s+.*?touchdown/i)
    || clean.match(/^(.+?)\s+pass\s+to\s+(.+?)\s+for\s+.*?td/i);
  if (match) {
    return {
      headline: `${shortPlayerName(match[1])} to ${shortPlayerName(match[2])}`,
      detail: `Passing TD | ${clean}`,
    };
  }
  match = clean.match(/^(.+?)\s+(?:run|rush|rushed)\s+.*?touchdown/i)
    || clean.match(/^(.+?)\s+\d+\s+yd\s+run/i);
  if (match) {
    return {
      headline: `${shortPlayerName(match[1])} rushing TD`,
      detail: `Rushing TD | ${clean}`,
    };
  }
  match = clean.match(/^(.+?)\s+(?:return|returns|returned)\s+.*?touchdown/i);
  if (match) {
    return {
      headline: `${shortPlayerName(match[1])} return TD`,
      detail: `Return TD | ${clean}`,
    };
  }
  match = clean.match(/^(.+?)\s+.*?touchdown/i);
  if (match) {
    return {
      headline: `${shortPlayerName(match[1])} TD`,
      detail: clean,
    };
  }
  return { headline: '', detail: clean };
}

function shortPlayerName(value) {
  return String(value || '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\b\d+\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(-2)
    .join(' ');
}

function touchdownSortValue(game, period, clock) {
  const gameTime = Date.parse(game?.date || '') || 0;
  const quarter = Number(period) || 0;
  const match = String(clock || '').match(/(\d+):(\d+)/);
  const secondsLeft = match ? (Number(match[1]) * 60) + Number(match[2]) : 0;
  return gameTime + (quarter * 100000) - secondsLeft;
}

function dedupeTouchdowns(items) {
  const map = new Map();
  for (const item of items) {
    const keyName = `${item.gameId}:${item.id}:${item.raw}`;
    if (!map.has(keyName)) map.set(keyName, item);
  }
  return [...map.values()];
}

function populatePropOptions() {
  const values = new Set();
  state.games.forEach((game) => {
    values.add(game.name);
    values.add(`${game.away.abbrev} ${game.away.name}`);
    values.add(`${game.home.abbrev} ${game.home.name}`);
    (game.leaders || []).forEach((group) => {
      (group.leaders || []).forEach((leader) => values.add(leader.athlete?.displayName || leader.displayName || ''));
    });
  });
  els.propOptions.innerHTML = [...values].filter(Boolean).sort().map((value) => `<option value="${escapeHtml(value)}"></option>`).join('');
}

function addTeamPick(game, side) {
  const team = game[side];
  const duplicate = state.slip.find((item) => item.type === 'team' && item.gameId === game.id && item.side === side);
  state.slip = state.slip.filter((item) => item.type !== 'team' || item.gameId !== game.id);
  if (!duplicate) {
    state.slip.push({
      type: 'team',
      gameId: game.id,
      side,
      title: `${team.abbrev} moneyline`,
      subtitle: `${game.away.abbrev} @ ${game.home.abbrev} | ${game.odds?.details || 'odds TBD'}`,
    });
  }
  writeJson(key('slip'), state.slip);
  renderScoreboard();
  renderBetSlip();
  syncDialogTeamPickState(game);
}

function teamPickSelected(game, side) { return state.slip.some((item)=>item.type==='team'&&item.gameId===game.id&&item.side===side); }
function dialogTeamPickButton(game, side) { const team=game[side]; const palette=teamPalette(team); const selected=teamPickSelected(game,side); return `<button type="button" class="dialog-team-pick ${side} ${selected?'is-selected':''}" data-dialog-team-pick="${side}" style="--pick-primary:${palette.primary};--pick-secondary:${palette.secondary};--pick-tertiary:${palette.tertiary}" aria-pressed="${selected}" title="Select ${escapeHtml(team.name)}"><img src="${escapeHtml(team.logo)}" alt="${escapeHtml(team.abbrev)}"><span>${escapeHtml(team.abbrev)}</span></button>`; }
function syncDialogTeamPickState(game) { if (!els.gameDialog?.open || state.openGameId!==game.id) return; els.gameDialog.querySelectorAll('[data-dialog-team-pick]').forEach((button)=>{const selected=teamPickSelected(game,button.dataset.dialogTeamPick); button.classList.toggle('is-selected',selected); button.setAttribute('aria-pressed',String(selected));}); }

function toggleWatch(gameId) {
  const id = String(gameId);
  state.watched = state.watched.includes(id) ? state.watched.filter((item) => item !== id) : [...state.watched, id];
  writeJson(key('watched'), state.watched);
  renderScoreboard();
  renderWatchList();
}

function currentGameDialogView() { return { tab:els.gameDialog?.querySelector('.madden-dialog-tabs [data-game-detail-tab].active')?.dataset.gameDetailTab || els.gameDialog?.querySelector('[data-game-detail-panel].active')?.dataset.gameDetailPanel || '', edge:els.gameDialog?.querySelector('[data-matchup-edge-tab].active')?.dataset.matchupEdgeTab || 'qb' }; }
function restoreGameDialogView(view) { if (!view?.tab) return; const panel=els.gameDialog.querySelector(`[data-game-detail-panel="${view.tab}"]`); if (!panel) return; els.gameDialog.querySelectorAll('.madden-dialog-tabs [data-game-detail-tab]').forEach((button)=>button.classList.toggle('active',button.dataset.gameDetailTab===view.tab)); els.gameDialog.querySelectorAll('[data-game-detail-panel]').forEach((item)=>item.classList.toggle('active',item===panel)); if (view.tab==='edges'&&view.edge) { els.gameDialog.querySelectorAll('[data-matchup-edge-tab]').forEach((button)=>button.classList.toggle('active',button.dataset.matchupEdgeTab===view.edge)); els.gameDialog.querySelectorAll('[data-matchup-edge-panel]').forEach((item)=>item.classList.toggle('active',item.dataset.matchupEdgePanel===view.edge)); } }

async function openGameDialog(gameId, preservedView = null) {
  const game = state.games.find((item) => item.id === String(gameId));
  if (!game) return;
  state.openGameId = game.id;
  els.gameDialogBody.innerHTML = gameDialogLoadingHtml(game);
  if (!els.gameDialog.open) els.gameDialog.showModal();
  try {
    const summary = await getJson(`${API_BASE}/summary?event=${encodeURIComponent(game.id)}`);
    enrichGameFromSummary(game, summary);
    const [, personnel, forecast] = await Promise.all([
      hydrateGamePlayerProfiles(summary?.boxscore || {}, game),
      loadMatchupPersonnel(game).catch(() => null),
      game.status?.type?.state === 'pre' ? buildForecastForGame(game, { sampleSize: 6 }).catch(() => null) : Promise.resolve(null),
    ]);
    els.gameDialogBody.innerHTML = gameDialogHtml(game, summary, personnel, forecast);
    restoreGameDialogView(preservedView);
    syncDialogTeamPickState(game);
  } catch {
    els.gameDialogBody.innerHTML = gameDialogHtml(game, null);
    restoreGameDialogView(preservedView);
    syncDialogTeamPickState(game);
  }
}

async function hydrateGamePlayerProfiles(box, game) {
  const athletes = [];
  for (const teamBlock of box?.players || []) {
    for (const category of teamBlock?.statistics || []) {
      for (const row of category?.athletes || []) {
        const athlete = row?.athlete || {};
        const id = String(athlete.id || '');
        if (id) athletes.push({ id, athlete });
      }
    }
  }
  const unique = [...new Map(athletes.map((entry) => [entry.id, entry])).values()].slice(0, 80);
  await Promise.all(unique.map(async ({ id, athlete }) => {
    const profile = await fetchNflAthleteSeasonProfile(id, analysisSeasonForGame(game)).catch(() => null);
    if (profile) Object.assign(athlete, profile);
  }));
}

async function fetchNflAthleteSeasonProfile(id, season) {
  const cacheKey = `${id}:${season}`;
  if (nflAthleteProfileCache.has(cacheKey)) return nflAthleteProfileCache.get(cacheKey);
  const promise = (async () => {
    const [profile, stats] = await Promise.all([
      getJson(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${encodeURIComponent(id)}`).catch(() => null),
      getJson(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${encodeURIComponent(id)}/stats?region=us&lang=en&season=${encodeURIComponent(season)}`).catch(() => null),
    ]);
    const positionRef = profile?.position?.$ref || '';
    const position = profile?.position?.abbreviation || profile?.position?.displayName || (positionRef ? await getJson(positionRef).then((pos) => pos.abbreviation || pos.displayName || pos.name || '').catch(() => '') : '');
    return {
      position,
      seasonStats: flattenNflSeasonStats(stats, season),
      statCategories: nflSeasonStatCategories(stats, season),
      headshot: profile?.athlete?.headshot?.href || profile?.headshot?.href || `https://a.espncdn.com/i/headshots/nfl/players/full/${encodeURIComponent(id)}.png`,
    };
  })();
  nflAthleteProfileCache.set(cacheKey, promise);
  return promise;
}

function nflSeasonStatCategories(payload, season) {
  return (payload?.categories || []).map((category) => {
    const row = (category.statistics || []).find((entry) => Number(entry?.season?.year) === Number(season)) || (category.statistics || []).at(-1);
    if (!row) return null;
    return { name: category.name || '', displayName: category.displayName || category.name || 'Statistics', position: row.position || '', season: Number(row?.season?.year) || Number(season), stats: (category.labels || []).map((label, index) => ({ label, name: category.names?.[index] || label, displayName: category.displayNames?.[index] || label, value: row.stats?.[index] ?? '--' })) };
  }).filter(Boolean);
}

function flattenNflSeasonStats(payload, season) {
  const common = nflSeasonStatCategories(payload, season).flatMap((category) => category.stats.map((stat) => ({ label: stat.label, value: String(stat.value), category: category.name })));
  if (common.length) return common;
  const rows = [];
  const categories = payload?.splits?.categories || payload?.categories || payload?.statistics || [];
  for (const category of categories || []) {
    const stats = category?.stats || category?.statistics || [];
    for (const stat of stats || []) {
      const label = stat.abbreviation || stat.shortDisplayName || stat.displayName || stat.name || '';
      const value = stat.displayValue ?? stat.value;
      if (label && value != null && value !== '') rows.push({ label, value: String(value) });
    }
  }
  return rows;
}

function gameDialogLoadingHtml(game) {
  return `
    <div class="dialog-head">
      <div><span class="eyebrow">Game Detail</span><h2>${escapeHtml(game.name)}</h2></div>
      <button type="button" data-dialog-close>x</button>
    </div>
    <div class="empty">Loading game detail...</div>
  `;
}

function forecastStageFooter(previous, next) {
  return `<footer class="forecast-stage-footer">${previous ? `<button type="button" data-game-detail-tab="${previous[0]}">← ${previous[1]}</button>` : '<span></span>'}${next ? `<button type="button" class="next" data-game-detail-tab="${next[0]}">${next[1]} →</button>` : '<span></span>'}</footer>`;
}

function forecastComparisonRow(label, away, home, formatter = (value) => String(value), higherIsBetter = true) {
  const awayBetter = higherIsBetter ? Number(away) > Number(home) : Number(away) < Number(home); const homeBetter = higherIsBetter ? Number(home) > Number(away) : Number(home) < Number(away);
  return `<div class="forecast-compare-row"><span class="${awayBetter ? 'edge' : ''}">${escapeHtml(formatter(away))}</span><strong><small>${escapeHtml(label)}</small><b>${awayBetter?'>':homeBetter?'<':'='}</b></strong><span class="${homeBetter ? 'edge' : ''}">${escapeHtml(formatter(home))}</span></div>`;
}

function starterUnitPanel(team, title, rows) {
  return `<section class="starter-unit-panel" style="${teamPaletteVars(team)}"><header><img src="${escapeHtml(team.logo)}" alt=""><div><span>${escapeHtml(team.abbrev)}</span><strong>${escapeHtml(title)}</strong></div><b>${rows.length}/11</b></header><div class="starter-unit-list">${rows.map((player) => `<div><span>${escapeHtml(player.expectedRole || player.position)}</span><strong>${playerButtonHtml(player, team)}</strong><b class="starter-grade">${player.evaluation?.grade || playerGrade(player,player.evidence).grade}</b><small>${escapeHtml(player.status || 'ACTIVE')}</small></div>`).join('')}</div></section>`;
}

function forecastStarterBoard(forecast, personnel) {
  const { game } = forecast; const starters = personnel?.starters;
  if (!starters) return '<div class="empty">Verifying current starters…</div>';
  return `<section class="verified-starter-board"><header><div><span class="eyebrow">Current starters</span><strong>22 vs 22</strong></div><small>${personnel.evidenceSeason} stats · current health</small></header><div>${starterUnitPanel(game.away,'Offense · 11',starters.away.offense)}${starterUnitPanel(game.away,'Defense · 11',starters.away.defense)}${starterUnitPanel(game.home,'Offense · 11',starters.home.offense)}${starterUnitPanel(game.home,'Defense · 11',starters.home.defense)}</div></section>`;
}

function percentageGuideHtml(forecast) {
  const margin = Math.abs(forecast.model.home.points-forecast.model.away.points); return `<section class="percentage-guide"><strong>MODEL KEY</strong><span><b>WIN %</b> score lean</span><span><b>CALL %</b> expected share</span><span><b>EDGE %</b> 50 = even</span><em>${margin.toFixed(1)}-pt gap</em></section>`;
}

function rosterChangeNames(rows, limit = 3) { return rows?.length ? rows.slice(0,limit).map((player)=>player.name).join(', ') : 'None'; }
function signedGrade(value) { const amount=Number(value)||0; return `${amount>=0?'+':''}${amount.toFixed(1)}`; }
function rosterEvolutionCard(profile, projection) {
  const roster=profile.roster; if (!roster) return `<article class="roster-evolution-card" style="${teamPaletteVars(profile.team)}"><div class="empty">Current-roster correction unavailable.</div></article>`; const totalDelta=roster.offenseAdjustment+roster.defenseAdjustment; const tone=totalDelta>=2?'upgrade':totalDelta<=-2?'downgrade':'steady';
  return `<article class="roster-evolution-card ${tone}" style="${teamPaletteVars(profile.team)}"><header><img src="${escapeHtml(profile.team.logo)}" alt=""><div><span>2025 → 2026</span><strong>${escapeHtml(profile.team.abbrev)} · ${tone==='upgrade'?'UP':tone==='downgrade'?'DOWN':'EVEN'}</strong></div><b>${signedGrade(projection.rosterPointAdjustment)}<small>PTS</small></b></header><div class="roster-grade-grid"><p><span>OFF</span><strong>${roster.priorOffenseGrade.toFixed(0)} → ${roster.currentOffenseGrade.toFixed(0)}</strong></p><p><span>DEF</span><strong>${roster.priorDefenseGrade.toFixed(0)} → ${roster.currentDefenseGrade.toFixed(0)}</strong></p><p class="${roster.olHealthy?'healthy':'warning'}"><span>OL</span><strong>${roster.olAvailable}/5</strong><small>${roster.priorOlStartersUsed} used in 2025</small></p><p><span>RETURN</span><strong>${roster.offenseReturning}/11 O · ${roster.defenseReturning}/11 D</strong></p></div><div class="roster-movement"><p><b>+</b><span>${escapeHtml(rosterChangeNames(roster.additions))}</span></p><p><b>−</b><span>${escapeHtml(rosterChangeNames(roster.departures))}</span></p></div></article>`;
}
function rosterEvolutionHtml(forecast) { return `<section class="roster-evolution-section"><header><span class="eyebrow">${forecast.coverageSeason} → ${forecast.baseline?.season || forecast.coverageSeason+1}</span><strong>ROSTER CHANGE</strong></header><div>${rosterEvolutionCard(forecast.away,forecast.model.away)}${rosterEvolutionCard(forecast.home,forecast.model.home)}</div></section>`; }

function leagueRankStrength(team, metric, fallback = 50) { const row = teamMetricRank(team,metric); return row ? 84-((row.rank-1)/31)*38 : fallback; }
function starterGradeAverage(personnel, side, unit, matcher, fallback = 68) { const rows=(personnel?.starters?.[side]?.[unit] || []).filter((player)=>matcher.test(String(player.position || '').toUpperCase())); return rows.length ? average(rows.map((player)=>player.evaluation?.grade || playerGrade(player,player.evidence).grade),fallback) : fallback; }

function matchupEquationCard(profile, opponent, projection) {
  const unit=projection.unitMatchup; const players=projection.playerMatchup; const scheme=projection.schemeMatchup; const symbol=(left,right)=>left>right?'>':left<right?'<':'='; const schemeGrade=Number.isFinite(scheme.primaryGrade)?scheme.primaryGrade:50;
  return `<article class="matchup-equation-card" style="${teamPaletteVars(profile.team)}"><header><img src="${escapeHtml(profile.team.logo)}" alt=""><div><span>${escapeHtml(profile.team.abbrev)} OFFENSE</span><strong>vs ${escapeHtml(opponent.team.abbrev)} DEFENSE</strong></div></header><div class="equation-line"><span>RUN</span><strong>${escapeHtml(profile.team.abbrev)} ${Math.round(unit.runAttack)} ${symbol(unit.runAttack,unit.runStop)} ${escapeHtml(opponent.team.abbrev)} ${Math.round(unit.runStop)}</strong><small>team units · ${signedGrade(unit.runEdge)} edge</small></div><div class="equation-line"><span>PASS</span><strong>${escapeHtml(profile.team.abbrev)} ${Math.round(unit.passAttack)} ${symbol(unit.passAttack,unit.passStop)} ${escapeHtml(opponent.team.abbrev)} ${Math.round(unit.passStop)}</strong><small>team units · ${signedGrade(unit.passEdge)} edge</small></div><div class="equation-line"><span>PLAYERS</span><strong>${escapeHtml(profile.team.abbrev)} ${Math.round(players.passAttack)} ${symbol(players.passAttack,players.passStop)} ${escapeHtml(opponent.team.abbrev)} ${Math.round(players.passStop)}</strong><small>QB/WR/OL vs rush/secondary · ${signedGrade(projection.playerPointAdjustment)} pts</small></div><div class="equation-line"><span>${scheme.primaryCoverage.toUpperCase()}</span><strong>${escapeHtml(profile.team.abbrev)} ${Math.round(schemeGrade)} ${symbol(scheme.expectedGrade,scheme.neutralGrade)} BASE ${Math.round(scheme.neutralGrade)}</strong><small>${escapeHtml(opponent.team.abbrev)} calls ${scheme.primaryCoverage} ${percent(scheme.primaryRate,0)} · ${signedGrade(projection.schemePointAdjustment)} pts</small></div></article>`;
}

function matchupEquationsHtml(forecast) { return `<section class="matchup-equation-section"><header><span class="eyebrow">MATCHUP MATH</span><strong>Every row moves the score</strong></header><div>${matchupEquationCard(forecast.away,forecast.home,forecast.model.away)}${matchupEquationCard(forecast.home,forecast.away,forecast.model.home)}</div></section>`; }

function scoreBuildRow(team, projection) {
  return `<div class="score-build-row" style="${teamPaletteVars(team)}"><img src="${escapeHtml(team.logo)}" alt=""><strong>${escapeHtml(team.abbrev)} ${projection.points.toFixed(1)}</strong><span>BASE <b>${projection.baselinePoints.toFixed(1)}</b></span><span>ROSTER <b>${signedGrade(projection.rosterPointAdjustment)}</b></span><span>SCHEME <b>${signedGrade(projection.schemePointAdjustment)}</b></span><span>UNITS <b>${signedGrade(projection.unitPointAdjustment)}</b></span><span>PLAYERS <b>${signedGrade(projection.playerPointAdjustment)}</b></span></div>`;
}

function scoreBuildHtml(forecast) { return `<section class="score-build"><header>SCORE BUILD</header>${scoreBuildRow(forecast.game.away,forecast.model.away)}${scoreBuildRow(forecast.game.home,forecast.model.home)}</section>`; }

function forecastDialogOverview(forecast, personnel) {
  const { game, away, home, model } = forecast; const awayWin = 1 - model.homeWin; const favorite = model.homeWin >= .5 ? game.home : game.away; const favoriteWin = Math.max(model.homeWin, awayWin);
  const offenseGrade = (profile) => clamp(50 + (profile.offense.adjustedSuccessRate - .43) * 100 + (profile.offense.adjustedExplosiveRate - .12) * 70 + (profile.roster?.offenseAdjustment||0), 20, 88);
  const defenseGrade = (profile) => clamp(50 + (.43 - profile.defense.adjustedSuccessRate) * 100 + (.12 - profile.defense.adjustedExplosiveRate) * 70 + (profile.roster?.defenseAdjustment||0), 20, 88);
  const margin=Math.abs(model.home.points-model.away.points);
  return `${percentageGuideHtml(forecast)}<div class="dialog-forecast-hero"><div class="dialog-forecast-team"><img src="${escapeHtml(game.away.logo)}" alt=""><strong>${escapeHtml(game.away.abbrev)}</strong><span>${model.away.points.toFixed(1)} PTS</span><small>${percent(awayWin)} WIN</small></div><div class="dialog-favorite">${probabilityRing(favoriteWin, `${favorite.abbrev} favorite`)}<strong>${escapeHtml(favorite.abbrev)} FAVORITE</strong><small>+${margin.toFixed(1)} PTS</small></div><div class="dialog-forecast-team"><img src="${escapeHtml(game.home.logo)}" alt=""><strong>${escapeHtml(game.home.abbrev)}</strong><span>${model.home.points.toFixed(1)} PTS</span><small>${percent(model.homeWin)} WIN</small></div></div>${scoreBuildHtml(forecast)}${rosterEvolutionHtml(forecast)}
  <section class="dialog-layer-card"><header><span class="eyebrow">Whole-team stack</span><div><b>${escapeHtml(game.away.abbrev)}</b><b>${escapeHtml(game.home.abbrev)}</b></div></header><div class="forecast-compare-table">
    ${forecastComparisonRow('Projected points', model.away.points, model.home.points, (value) => Number(value).toFixed(1))}
    ${forecastComparisonRow('Offense grade', offenseGrade(away), offenseGrade(home), (value) => Math.round(value))}
    ${forecastComparisonRow('Defense grade', defenseGrade(away), defenseGrade(home), (value) => Math.round(value))}
    ${forecastComparisonRow('Offensive line', away.units.offenseLine, home.units.offenseLine, (value) => Math.round(value))}
    ${forecastComparisonRow('Defensive front', away.units.defenseFront, home.units.defenseFront, (value) => Math.round(value))}
    ${forecastComparisonRow('Secondary', away.units.secondary, home.units.secondary, (value) => Math.round(value))}
  </div></section>${matchupEquationsHtml(forecast)}${forecastStarterBoard(forecast, personnel)}<div class="dialog-signal-grid">${model.outcomes.slice(0,4).map(forecastOutcomeHtml).join('')}</div>${forecastStageFooter(null,['edges','Player edges'])}`;
}

function forecastPersonnelRows(personnel, side, matcher, unit, limit = 8, { includeBackups = false } = {}) {
  const matching = (personnel?.[side] || []).filter((player) => matcher.test(String(player.position || '').toUpperCase()) && (includeBackups || player.expectedStarter));
  return assignDepthStrings(matching, unit).slice(0, limit);
}

function offensiveLineRows(personnel, side) {
  const offense = personnel?.starters?.[side]?.offense || []; const roles = ['LT','LG','C','RG','RT']; const used = new Set();
  return roles.map((role) => {
    let player = offense.find((candidate) => !used.has(candidate) && candidate.expectedRole === role);
    if (!player) player = offense.find((candidate) => !used.has(candidate) && String(candidate.position || '').toUpperCase() === role);
    if (!player) player = offense.find((candidate) => !used.has(candidate) && /^(LT|LG|C|RG|RT|T|OT|G|OG|OL)$/.test(String(candidate.position || '').toUpperCase()));
    if (player) used.add(player); return player ? { ...player, position: role, positionGroup: role, hierarchy: 'starter', string: 1 } : null;
  }).filter(Boolean);
}

function forecastPersonnelPanel(team, title, rows) {
  return `<section class="forecast-personnel-panel" style="${teamPaletteVars(team)}"><header><img src="${escapeHtml(team.logo)}" alt=""><div><span>${escapeHtml(team.abbrev)}</span><strong>${escapeHtml(title)}</strong></div></header><div>${rows.length ? rows.map((player) => depthPlayerRowHtml(player, team)).join('') : '<div class="empty">Personnel unavailable.</div>'}</div></section>`;
}

function runDirectionRows(profile) {
  return [['Left',profile.offense.leftRunRate],['Middle',profile.offense.middleRunRate],['Right',profile.offense.rightRunRate]].map(([label,value]) => `<div><span>${label}</span><b>${percent(value)}</b><i style="width:${Math.round(value * 100)}%"></i></div>`).join('');
}

function forecastDialogRun(forecast, personnel) {
  const { game, away, home, model } = forecast;
  const awayBacks = forecastPersonnelRows(personnel,'away',/^(RB|HB|FB)$/, 'offense', 3,{includeBackups:true}); const homeBacks = forecastPersonnelRows(personnel,'home',/^(RB|HB|FB)$/, 'offense',3,{includeBackups:true});
  const awayFront = forecastPersonnelRows(personnel,'away',/^(DE|LDE|RDE|DT|LDT|RDT|NT|DL|EDGE|LB|ILB|MLB|OLB|WLB|SLB)$/, 'defense',7); const homeFront = forecastPersonnelRows(personnel,'home',/^(DE|LDE|RDE|DT|LDT|RDT|NT|DL|EDGE|LB|ILB|MLB|OLB|WLB|SLB)$/, 'defense',7);
  return `<div class="dialog-unit-hero"><article><span>${escapeHtml(game.away.abbrev)} rushing outlook</span><strong>${percent(model.away.runSuccess)} success lean</strong><small>OL ${Math.round(away.units.offenseLine)} vs ${game.home.abbrev} front ${Math.round(home.units.defenseFront)}</small><div class="run-direction-strip">${runDirectionRows(away)}</div></article><article><span>${escapeHtml(game.home.abbrev)} rushing outlook</span><strong>${percent(model.home.runSuccess)} success lean</strong><small>OL ${Math.round(home.units.offenseLine)} vs ${game.away.abbrev} front ${Math.round(away.units.defenseFront)}</small><div class="run-direction-strip">${runDirectionRows(home)}</div></article></div><div class="forecast-personnel-grid">${forecastPersonnelPanel(game.away,'Backfield hierarchy',awayBacks)}${forecastPersonnelPanel(game.home,'Defensive front',homeFront)}${forecastPersonnelPanel(game.home,'Backfield hierarchy',homeBacks)}${forecastPersonnelPanel(game.away,'Defensive front',awayFront)}</div>${forecastStageFooter(['ranks','League ranks'],['pass','Pass game'])}`;
}

function forecastDialogPass(forecast, personnel) {
  const { game, away, home, model } = forecast;
  const awayQb = forecastPersonnelRows(personnel,'away',/^QB$/, 'offense',1); const homeQb = forecastPersonnelRows(personnel,'home',/^QB$/, 'offense',1);
  const awayOl = offensiveLineRows(personnel,'away'); const homeOl = offensiveLineRows(personnel,'home');
  return `<section class="dialog-layer-card"><header><span class="eyebrow">Pass-game matchup</span><div><b>${escapeHtml(game.away.abbrev)}</b><b>${escapeHtml(game.home.abbrev)}</b></div></header><div class="forecast-compare-table">${forecastComparisonRow('Pass rate',model.away.passRate,model.home.passRate,(value)=>percent(value))}${forecastComparisonRow('Early-down pass',model.away.earlyPass,model.home.earlyPass,(value)=>percent(value))}${forecastComparisonRow('Pressure risk',model.away.pressure,model.home.pressure,(value)=>percent(value),false)}${forecastComparisonRow('Explosive pass',model.away.explosivePass,model.home.explosivePass,(value)=>percent(value))}${forecastComparisonRow('Yards / dropback',away.offense.yardsPerPass,home.offense.yardsPerPass,(value)=>Number(value).toFixed(1))}${forecastComparisonRow('Sack avoidance',1-away.offense.sackRate,1-home.offense.sackRate,(value)=>percent(value))}</div></section><div class="forecast-personnel-grid">${forecastPersonnelPanel(game.away,'Starting quarterback',awayQb)}${forecastPersonnelPanel(game.home,'Starting quarterback',homeQb)}${forecastPersonnelPanel(game.away,'Starting OL · LT–RT',awayOl)}${forecastPersonnelPanel(game.home,'Starting OL · LT–RT',homeOl)}</div>${forecastStageFooter(['run','Run game'],['receiving','Receiving matchups'])}`;
}

function forecastDialogReceiving(forecast, box, personnel) {
  const game = forecast.game;
  return `<div class="matchup-source-strip">Projected by listed alignment and role. Starter/core targets are emphasized; a pairing is not presented as verified shadow coverage.</div><div class="projected-grid dialog-receiving-grid">${projectedMatchupsHtml(game, box, personnel)}</div><section class="coverage-history"><header><div><span class="eyebrow">Verified imported history</span><strong>Receiver vs defender outcomes</strong></div><span class="status-pill verified">Charted only</span></header>${coverageHistoryHtml(coverageRowsForGame(game))}</section>${forecastStageFooter(['pass','Pass game'],['defense','Defense & schemes'])}`;
}

function leagueUnitAverage(path, fallback) { const values=snapshotTeamUnits().map((row)=>nestedNumber(row,path)).filter(Number.isFinite); return average(values,fallback); }
function matchupRankFactor(team, metric, scale = .012) { const rank=teamMetricRank(team,metric)?.rank || 16.5; return 1+(rank-16.5)*scale; }
function atLeastOneTouchdown(lambda) { return clamp(1-Math.exp(-Math.max(0,lambda)),.02,.88); }
function playerEvidenceGames(player) { return Math.max(1,Number(player.evidence?.games)||Number(player.evidence?.snapGameCount)||0); }

function projectPlayerEdge(player, position, profile, opponent, projection, defender = null) {
  const s=player.evidence?.sums || {}; const games=playerEvidenceGames(player); const pointsFactor=clamp(Number(projection.points||22)/Math.max(15,Number(profile.scoring.pointsFor)||22),.72,1.32); const passDefenseFactor=matchupRankFactor(opponent.team,'passDefense'); const runDefenseFactor=matchupRankFactor(opponent.team,'runDefense'); let yardage=0; let yardageType='yards'; let tdLambda=.08; let formula='';
  if (position === 'QB') {
    const base=(Number(s.passingyards)||0)/games || 210; const volume=clamp(Number(projection.passRate||.56)/.56,.78,1.26); const pressure=clamp(1-(Number(projection.pressure||.07)-.07)*2.2,.78,1.16); yardage=base*volume*passDefenseFactor*pressure; yardageType='pass yards'; const tdBase=(Number(s.passingtouchdowns||0)+.5)/(games+1); const tdAllowed=Number(opponent.baselineUnits?.passDefense?.touchdownRate); const tdLeague=leagueUnitAverage('passDefense.touchdownRate',.045); tdLambda=tdBase*pointsFactor*clamp(tdAllowed/tdLeague,.72,1.35); formula=`${base.toFixed(0)} pass yds/game × volume ${volume.toFixed(2)} × pass-D ${passDefenseFactor.toFixed(2)} × pressure ${pressure.toFixed(2)}`;
  } else if (position === 'WR') {
    const base=(Number(s.receivingyards)||0)/games || (player.matchupRole==='WR1'?52:player.matchupRole==='WR2'?38:26); const volume=clamp(Number(projection.passRate||.56)/.56,.80,1.24); const receiverGrade=Number(player.evaluation?.grade)||68; const defenderGrade=Number(defender?.evaluation?.grade)||68; const coverageFactor=clamp(1+(receiverGrade-defenderGrade)*.008,.78,1.24); yardage=base*volume*passDefenseFactor*coverageFactor; yardageType='rec yards'; const tdBase=(Number(s.receivingtouchdowns||0)+.25)/(games+.75); const tdAllowed=Number(opponent.baselineUnits?.passDefense?.touchdownRate); const tdLeague=leagueUnitAverage('passDefense.touchdownRate',.045); tdLambda=tdBase*pointsFactor*clamp(tdAllowed/tdLeague,.72,1.35)*coverageFactor; formula=`${base.toFixed(0)} rec yds/game × volume ${volume.toFixed(2)} × pass-D ${passDefenseFactor.toFixed(2)} × WR/CB ${coverageFactor.toFixed(2)}`;
  } else {
    const base=((Number(s.rushingyards)||0)+(Number(s.receivingyards)||0))/games || (player.matchupRole==='RB1'?72:38); const success=clamp(Number(projection.runSuccess||.41)/.41,.72,1.34); const trench=clamp(1+(Number(profile.units.offenseLine)-Number(opponent.units.defenseFront))*.008,.78,1.24); yardage=base*success*runDefenseFactor*trench; yardageType='scrim yards'; const tdBase=(Number(s.rushingtouchdowns||0)+Number(s.receivingtouchdowns||0)+.25)/(games+.75); const tdAllowed=Number(opponent.baselineUnits?.runDefense?.firstDownRate); const tdLeague=leagueUnitAverage('runDefense.firstDownRate',.22); tdLambda=tdBase*pointsFactor*clamp(tdAllowed/tdLeague,.76,1.30)*trench; formula=`${base.toFixed(0)} scrim yds/game × run success ${success.toFixed(2)} × run-D ${runDefenseFactor.toFixed(2)} × trench ${trench.toFixed(2)}`;
  }
  return { player,team:profile.team,opponent:opponent.team,defender,position,yardage:Math.round(clamp(yardage,8,position==='QB'?390:160)),yardageType,tdMean:clamp(tdLambda,.01,3.5),tdProbability:atLeastOneTouchdown(tdLambda),formula,score:yardage+(atLeastOneTouchdown(tdLambda)*55) };
}

function playerEdgeRows(forecast, personnel, position) {
  const output=[]; for (const [side,opponentSide,profile,opponent,projection] of [['away','home',forecast.away,forecast.home,forecast.model.away],['home','away',forecast.home,forecast.away,forecast.model.home]]) {
    if (position==='QB') forecastPersonnelRows(personnel,side,/^QB$/,'offense',1).forEach((player)=>output.push(projectPlayerEdge(player,'QB',profile,opponent,projection)));
    if (position==='RB') matchupDepthOrder(personnel?.[side]||[],/^(RB|HB|FB)$/,'RB',3).forEach((player)=>output.push(projectPlayerEdge(player,'RB',profile,opponent,projection)));
    if (position==='WR') { const receivers=matchupDepthOrder(personnel?.[side]||[],/^(WR|LWR|RWR|SWR|SLWR|SRWR)$/,'WR',4); const corners=matchupDepthOrder(personnel?.[opponentSide]||[],/^(CB|LCB|RCB|SCB|NB)$/,'CB',4); receivers.forEach((player,index)=>output.push(projectPlayerEdge(player,'WR',profile,opponent,projection,corners[index]))); }
  } return output;
}

function selectedPlayerEdgeRows(rows) { const selected=[]; for (const team of [...new Set(rows.map((row)=>row.team.abbrev))]) { const teamRows=rows.filter((row)=>row.team.abbrev===team); const yard=[...teamRows].sort((a,b)=>b.yardage-a.yardage)[0]; const td=[...teamRows].sort((a,b)=>b.tdProbability-a.tdProbability)[0]; const next=[...teamRows].sort((a,b)=>b.score-a.score).find((row)=>row!==yard&&row!==td); [yard,td,next].filter(Boolean).forEach((row)=>{if(!selected.includes(row))selected.push(row);}); } return selected; }

function playerEdgeCard(row, allRows) {
  const bestYards=Math.max(...allRows.map((item)=>item.yardage)); const bestTd=Math.max(...allRows.map((item)=>item.tdProbability)); const defender=row.defender ? ` vs ${row.defender.matchupRole || row.defender.position} ${row.defender.name} (${row.defender.evaluation?.grade || '--'})` : ''; const touchdownLabel=row.position==='QB'?'1+ pass TD':'1+ touchdown';
  return `<article class="player-edge-card" style="${teamPaletteVars(row.team)}"><header><img src="${escapeHtml(row.team.logo)}" alt=""><div><span>${escapeHtml(row.team.abbrev)} ${escapeHtml(row.position)} MATCHUP</span><strong>${playerButtonHtml(row.player,row.team)}</strong></div><b>${row.player.evaluation?.grade || '--'} OVR</b></header><div class="edge-projection"><div><span>YARDAGE LEAN</span><b>${row.yardage}</b><small>${escapeHtml(row.yardageType)}</small></div><div><span>PROJECTED TD</span><b>${row.tdMean.toFixed(2)}</b><small>${row.position==='QB'?'pass touchdowns':'total touchdowns'}</small></div><div><span>${row.position==='QB'?'PASS-TD CHANCE':'ANY-TD CHANCE'}</span><b>${percent(row.tdProbability)}</b><small>${touchdownLabel}</small></div></div><div class="edge-badges">${row.yardage===bestYards?'<em>BEST YARDAGE</em>':''}${row.tdProbability===bestTd?'<em>BEST TD</em>':''}</div><p>${escapeHtml(row.formula)}${escapeHtml(defender)}</p><footer>Projected TD is the model’s expected count (λ). The 1+ TD chance is 1−e<sup>−λ</sup>; neither is a market price.</footer></article>`;
}

function playerEdgePanel(forecast, personnel, position) { const rows=playerEdgeRows(forecast,personnel,position); const selected=selectedPlayerEdgeRows(rows); return `<div class="player-edge-grid">${selected.map((row)=>playerEdgeCard(row,rows)).join('')}</div>`; }

function defenseImbalanceCard(defense, offense, personnel, side, opponentSide, opponentProjection) {
  const passStop=average([leagueRankStrength(defense.team,'passDefense'),leagueRankStrength(defense.team,'passRush'),defense.units.secondary])+(defense.roster?.defenseAdjustment||0); const passAttack=average([leagueRankStrength(offense.team,'passGame'),leagueRankStrength(offense.team,'pocketProtection')])+(offense.roster?.offenseAdjustment||0); const runStop=average([leagueRankStrength(defense.team,'runDefense'),defense.units.defenseFront])+(defense.roster?.defenseAdjustment||0); const runAttack=average([leagueRankStrength(offense.team,'runGame'),offense.units.offenseLine])+(offense.roster?.offenseAdjustment||0); const passEdge=passStop-passAttack; const runEdge=runStop-runAttack; const bestEdge=Math.max(passEdge,runEdge); const overallEdge=average([passEdge,runEdge]); const family=passEdge>=runEdge?'dropback game':'run game'; const headline=overallEdge>=7?`${defense.team.abbrev} defense outclasses this offense`:overallEdge<=-7?`${offense.team.abbrev} offense outclasses this defense`:bestEdge>=6?`${defense.team.abbrev} owns the ${family}, not the whole matchup`:'No overwhelming suppression edge'; const index=clamp(.5+overallEdge/70+(22-Number(opponentProjection.points||22))*.009,.18,.82); const defenders=[...(personnel?.starters?.[side]?.defense||[])].sort((a,b)=>(b.evaluation?.grade||0)-(a.evaluation?.grade||0)).slice(0,3);
  return `<article class="defense-imbalance-card ${overallEdge>=7?'outclasses':overallEdge<=-7?'outclassed':'competitive'}" style="${teamPaletteVars(defense.team)}"><header><img src="${escapeHtml(defense.team.logo)}" alt=""><div><span>${escapeHtml(defense.team.abbrev)} DEFENSIVE IMBALANCE</span><strong>${escapeHtml(headline)}</strong></div><b>${percent(index)}<small>suppression index</small></b></header><div class="defense-equations"><p><span>PASS</span><strong>${Math.round(passStop)} ${passEdge>=0?'>':'<'} ${Math.round(passAttack)}</strong><small>${defense.team.abbrev} Pass D/Rush vs ${offense.team.abbrev} Pass O/Protection</small></p><p><span>RUN</span><strong>${Math.round(runStop)} ${runEdge>=0?'>':'<'} ${Math.round(runAttack)}</strong><small>${defense.team.abbrev} Front/Run D vs ${offense.team.abbrev} OL/Run O</small></p></div><div class="imbalance-players">${defenders.map((player)=>`<span>${playerButtonHtml(player,defense.team)} <b>${player.evaluation?.grade||'--'}</b></span>`).join('')}</div><footer>The suppression index uses the average pass/run unit edge plus projected scoring context. A one-dimensional edge is no longer labeled as domination of the entire offense.</footer></article>`;
}

function offenseDefenseMismatch(offense, defense) {
  const offenseAdjustment=offense.roster?.offenseAdjustment||0; const defenseAdjustment=defense.roster?.defenseAdjustment||0; const passAttack=average([leagueRankStrength(offense.team,'passGame'),leagueRankStrength(offense.team,'pocketProtection'),offense.units.offenseLine])+offenseAdjustment; const passStop=average([leagueRankStrength(defense.team,'passDefense'),leagueRankStrength(defense.team,'passRush'),defense.units.secondary])+defenseAdjustment; const runAttack=average([leagueRankStrength(offense.team,'runGame'),offense.units.offenseLine])+offenseAdjustment; const runStop=average([leagueRankStrength(defense.team,'runDefense'),defense.units.defenseFront])+defenseAdjustment; const edge=average([passAttack-passStop,runAttack-runStop]); const tone=edge>=7?'offense':edge<=-7?'defense':'even'; const headline=tone==='offense'?`${offense.team.abbrev} offense outclasses ${defense.team.abbrev} defense`:tone==='defense'?`${defense.team.abbrev} defense outclasses ${offense.team.abbrev} offense`:'Neither side clearly outclasses the other'; return {offense,defense,passAttack,passStop,runAttack,runStop,edge,tone,headline};
}
function offenseDefenseMismatchCard(row) { return `<article class="outclassed-card ${row.tone}" style="${teamPaletteVars(row.offense.team,row.defense.team)}"><header><div><span>${escapeHtml(row.offense.team.abbrev)} OFFENSE vs ${escapeHtml(row.defense.team.abbrev)} DEFENSE</span><strong>${escapeHtml(row.headline)}</strong></div><b>${row.edge>=0?'+':''}${row.edge.toFixed(1)}<small>overall edge</small></b></header><div><p><span>PASS</span><strong>${Math.round(row.passAttack)} ${row.passAttack>=row.passStop?'>':'<'} ${Math.round(row.passStop)}</strong><small>Pass O/Protection/OL vs Pass D/Rush/Secondary</small></p><p><span>RUN</span><strong>${Math.round(row.runAttack)} ${row.runAttack>=row.runStop?'>':'<'} ${Math.round(row.runStop)}</strong><small>Run O/OL vs Run D/Front</small></p></div><footer>Current-roster offense and defense corrections are included. “Outclasses” requires a seven-point average unit edge, not one favorable category.</footer></article>`; }
function outclassedMatchupHtml(forecast) { return `<section class="outclassed-section"><header><span class="eyebrow">Is either side actually outclassed?</span><strong>Current offense vs current defense</strong></header><div>${offenseDefenseMismatchCard(offenseDefenseMismatch(forecast.away,forecast.home))}${offenseDefenseMismatchCard(offenseDefenseMismatch(forecast.home,forecast.away))}</div></section>`; }

function forecastDialogEdges(forecast, personnel) {
  return `<section class="player-edges-shell"><header><div><span class="eyebrow">Best individual matchups</span><strong>Yardage, touchdown and suppression leans</strong></div><small>Prior-season player rates × projected volume × current roster × opponent unit/scheme</small></header><div class="player-edge-tabs" role="tablist"><button type="button" class="active" data-matchup-edge-tab="qb">QB</button><button type="button" data-matchup-edge-tab="wr">WR</button><button type="button" data-matchup-edge-tab="rb">RB</button><button type="button" data-matchup-edge-tab="defense">Defensive imbalances</button></div><div class="matchup-edge-panel active" data-matchup-edge-panel="qb">${playerEdgePanel(forecast,personnel,'QB')}</div><div class="matchup-edge-panel" data-matchup-edge-panel="wr">${playerEdgePanel(forecast,personnel,'WR')}</div><div class="matchup-edge-panel" data-matchup-edge-panel="rb">${playerEdgePanel(forecast,personnel,'RB')}</div><div class="matchup-edge-panel" data-matchup-edge-panel="defense"><div class="defense-imbalance-grid">${defenseImbalanceCard(forecast.away,forecast.home,personnel,'away','home',forecast.model.home)}${defenseImbalanceCard(forecast.home,forecast.away,personnel,'home','away',forecast.model.away)}</div></div></section>${forecastStageFooter(['overview','Overview'],['ranks','League ranks'])}`;
}

function schemeAlignmentSignals(offense, defense) {
  const offenseName = offense.team.abbrev; const defenseName = defense.team.abbrev; const rows = [];
  const add = (name, usage, offenseResult, defenseResult, evidence) => {
    if (!Number.isFinite(Number(usage)) || !Number.isFinite(Number(offenseResult)) || !Number.isFinite(Number(defenseResult))) return;
    const edge = Number(offenseResult) - Number(defenseResult); const tone = edge >= .04 ? 'positive' : edge <= -.04 ? 'negative' : 'neutral';
    const headline = tone === 'positive' ? `${offenseName} can press this tendency` : tone === 'negative' ? `${defenseName} can punish this tendency` : 'No clear scheme winner';
    rows.push({ name, usage, edge, tone, headline, evidence });
  };
  add('SHOTGUN', offense.offense.shotgunRate, offense.offense.shotgunSuccessRate, defense.defense.shotgunSuccessRate, `${offenseName} uses it ${percent(offense.offense.shotgunRate)} · offense success ${percent(offense.offense.shotgunSuccessRate)} · ${defenseName} allows ${percent(defense.defense.shotgunSuccessRate)}`);
  add('EARLY-DOWN PASS', offense.offense.earlyDownPassRate, offense.offense.passSuccessRate, defense.defense.passSuccessRate, `${offenseName} calls it ${percent(offense.offense.earlyDownPassRate)} · pass success ${percent(offense.offense.passSuccessRate)} vs ${percent(defense.defense.passSuccessRate)} allowed`);
  add('MIDDLE RUN', offense.offense.middleRunRate, offense.offense.rushSuccessRate, defense.defense.rushSuccessRate, `${offenseName} runs middle ${percent(offense.offense.middleRunRate)} · rush success ${percent(offense.offense.rushSuccessRate)} vs ${percent(defense.defense.rushSuccessRate)} allowed`);
  add('EXPLOSIVE PASS', offense.offense.passRate, offense.offense.explosivePassRate, defense.defense.explosivePassRate, `${offenseName} explosive rate ${percent(offense.offense.explosivePassRate)} · ${defenseName} allows ${percent(defense.defense.explosivePassRate)}`);
  add('RED ZONE PASS', offense.offense.redZonePassRate, offense.offense.successRate, defense.defense.successRate, `${offenseName} passes ${percent(offense.offense.redZonePassRate)} inside the 20`);
  return rows;
}

function schemeSignalHtml(signal) {
  return `<article class="scheme-signal ${signal.tone}"><header><span>${escapeHtml(signal.name)}</span><b>${signal.edge >= 0 ? '+' : ''}${Math.round(signal.edge * 100)} edge</b></header><strong>${escapeHtml(signal.headline)}</strong><div class="scheme-usage"><i style="width:${Math.round(clamp(signal.usage) * 100)}%"></i></div><p>${escapeHtml(signal.evidence)}</p></article>`;
}

function rankedRate(team, field, label, value) {
  const ranking = schemeRateRank(team,field); return `<div><span>${escapeHtml(label)}</span><b>${percent(value,1)}</b><small>${ranking ? `#${ranking.rank}/${ranking.total}` : 'rank unavailable'}</small></div>`;
}

function defenseIdentityCard(profile, personnelSide) {
  const coverage = profile.coverage || {}; const front = personnelSide?.baseFront || coverage.baseFront || 'Multiple';
  return `<article class="defense-identity-card" style="--team-color:${escapeHtml(profile.team.color)}"><header><img src="${escapeHtml(profile.team.logo)}" alt=""><div><span>${escapeHtml(profile.team.abbrev)} DEFENSIVE IDENTITY</span><strong>Base ${escapeHtml(front)}</strong></div><em>${escapeHtml(coverage.dataSource || 'season baseline')}</em></header><div>${rankedRate(profile.team,'blitzRate','Blitz rate',coverage.blitzRate)}${rankedRate(profile.team,'defenseManRate','Man rate',coverage.defenseManRate)}${rankedRate(profile.team,'defenseZoneRate','Zone rate',coverage.defenseZoneRate)}${rankedRate(profile.team,'pressureRate','Pressure rate',coverage.pressureRate)}</div><footer>Blitz = FTN charted additional rushers; man/zone and pressure = nflverse participation charting.</footer></article>`;
}

function schemeSplitLine(label, split, successLabel = 'success') {
  if (!split?.plays) return `<div class="scheme-split-line empty"><strong>${escapeHtml(label)}</strong><span>No qualified plays</span></div>`;
  return `<div class="scheme-split-line"><strong>${escapeHtml(label)}</strong><span><b>${Number(split.epaPerPlay).toFixed(2)}</b> EPA/play</span><span><b>${Number(split.yardsPerPlay).toFixed(1)}</b> Y/play</span><span><b>${percent(split.successRate,1)}</b> ${escapeHtml(successLabel)}</span><small>${split.plays} plays</small></div>`;
}

function offenseSchemeCard(profile) {
  const scheme = profile.scheme || {}; return `<article class="offense-scheme-card" style="--team-color:${escapeHtml(profile.team.color)}"><header><img src="${escapeHtml(profile.team.logo)}" alt=""><div><span>${escapeHtml(profile.team.abbrev)} PASSING SPLITS</span><strong>Performance by coverage</strong></div></header>${schemeSplitLine('vs man',scheme.passVsMan)}${schemeSplitLine('vs zone',scheme.passVsZone)}<div class="front-split-title">Current opponent front classification</div>${schemeSplitLine('Pass vs 4–3',scheme.vs43?.pass,'1st-down rate')}${schemeSplitLine('Run vs 4–3',scheme.vs43?.run,'1st-down rate')}${schemeSplitLine('Pass vs 3–4',scheme.vs34?.pass,'1st-down rate')}${schemeSplitLine('Run vs 3–4',scheme.vs34?.run,'1st-down rate')}<footer>2025 results grouped by each opponent’s current listed base front; front labels are context, not a claim that every snap used that personnel.</footer></article>`;
}

function unitRawText(row, metric) {
  if (!row) return 'No baseline'; const signed = (value) => Number.isFinite(Number(value)) ? `${Number(value) >= 0 ? '+' : ''}${Number(value).toFixed(3)}` : '--';
  if (metric === 'runGame') return `${Number(row.runGame?.yardsPerCarry).toFixed(2)} YPC · ${signed(row.runGame?.epaPerCarry)} EPA/rush`;
  if (metric === 'passGame') return `${Number(row.passGame?.yardsPerDropback).toFixed(2)} Y/db · ${signed(row.passGame?.epaPerDropback)} EPA/db · ${Number(row.passGame?.cpoe).toFixed(1)} CPOE`;
  if (metric === 'pocketProtection') return `${percent(row.pocketProtection?.sackRate,1)} sack rate · ${row.pocketProtection?.sacks || 0}/${row.pocketProtection?.dropbacks || 0}`;
  if (metric === 'passDefense') return `${Number(row.passDefense?.yardsPerDropback).toFixed(2)} Y/db · ${signed(row.passDefense?.epaPerDropback)} EPA/db`;
  if (metric === 'passRush') return `${percent(row.passRush?.sackRate,1)} sack · ${percent(row.passRush?.hitRate,1)} hit`;
  return `${Number(row.runDefense?.yardsPerCarry).toFixed(2)} YPC · ${signed(row.runDefense?.epaPerCarry)} EPA/rush`;
}

function rankComparisonRow(metric, awayTeam, homeTeam) {
  const definition = TEAM_RANK_DEFINITIONS[metric]; const away = teamMetricRank(awayTeam,metric); const home = teamMetricRank(homeTeam,metric); const awayWins = away && home ? away.rank < home.rank : false; const homeWins = away && home ? home.rank < away.rank : false;
  return `<div class="league-rank-row"><div class="${awayWins ? 'rank-winner' : ''}"><b>${away ? `#${away.rank}/32` : '--'}</b><small>${escapeHtml(unitRawText(away?.row,metric))}</small></div><strong>${escapeHtml(definition.label)}</strong><div class="${homeWins ? 'rank-winner' : ''}"><b>${home ? `#${home.rank}/32` : '--'}</b><small>${escapeHtml(unitRawText(home?.row,metric))}</small></div></div>`;
}

function forecastDialogRanks(forecast) {
  const { game } = forecast; const keys = Object.keys(TEAM_RANK_DEFINITIONS);
  return `<section class="league-ranks-card"><header><div><span class="eyebrow">Pure-number comparison</span><strong>2025 regular-season league ranks</strong></div><div><b>${escapeHtml(game.away.abbrev)}</b><b>${escapeHtml(game.home.abbrev)}</b></div></header><div class="league-rank-team-head"><span><img src="${escapeHtml(game.away.logo)}" alt="">${escapeHtml(game.away.name)}</span><span>Metric</span><span>${escapeHtml(game.home.name)}<img src="${escapeHtml(game.home.logo)}" alt=""></span></div>${keys.map((metric) => rankComparisonRow(metric,game.away,game.home)).join('')}<footer>These are deliberately the unmodified 2025 ranks; the Overall tab separately shows how the current roster changes the team. EPA leads Run/Pass Game and Run/Pass Defense; sack rate leads Protection and Pass Rush. Lower rank number is better.</footer></section>${forecastStageFooter(['edges','Player edges'],['run','Run game'])}`;
}

function forecastDialogDefense(forecast, personnel) {
  const { game, away, home } = forecast; const awaySignals = schemeAlignmentSignals(away,home); const homeSignals = schemeAlignmentSignals(home,away);
  return `${outclassedMatchupHtml(forecast)}<div class="defense-identity-grid">${defenseIdentityCard(away,personnel?.schemes?.away)}${defenseIdentityCard(home,personnel?.schemes?.home)}</div><div class="offense-scheme-grid">${offenseSchemeCard(away)}${offenseSchemeCard(home)}</div><div class="scheme-direction-head"><span>${escapeHtml(game.away.abbrev)} offense vs ${escapeHtml(game.home.abbrev)} defense</span><span>${escapeHtml(game.home.abbrev)} offense vs ${escapeHtml(game.away.abbrev)} defense</span></div><div class="scheme-signal-grid"><div>${awaySignals.map(schemeSignalHtml).join('')}</div><div>${homeSignals.map(schemeSignalHtml).join('')}</div></div><section class="dialog-layer-card coordinator-layer"><header><span class="eyebrow">Defensive play callers</span></header><div class="coach-grid">${coachCard(away,'defense')}${coachCard(home,'defense')}</div></section><div class="coverage-availability charted"><strong>Season scheme baseline active</strong><span>${forecast.coverageRows ? `${forecast.coverageRows} matchup-window participation rows also joined.` : 'Man/zone, FTN blitz, pressure and coverage performance come from the local 2025 season snapshot.'}</span></div>${forecastStageFooter(['receiving','Receiving matchups'],null)}`;
}

function forecastGameDialogHtml(game, summary, personnel, forecast) {
  const gameIndex = state.games.findIndex((item) => item.id === game.id); const context = nflWeekContext(game.date || state.selectedDate);
  return `<div class="dialog-head forecast-dialog-head" style="${teamPaletteVars(game.away,game.home)}"><button type="button" class="dialog-nav-arrow" data-game-nav="-1" ${gameIndex <= 0 ? 'disabled' : ''}>‹</button><div class="forecast-head-matchup">${dialogTeamPickButton(game,'away')}<div class="forecast-head-copy"><span class="eyebrow">${context.season} ${context.name} · ${escapeHtml(game.dateText)}</span><h2>${escapeHtml(game.away.name)} at ${escapeHtml(game.home.name)}</h2><small>${escapeHtml(context.baselineReason)} · analysis season ${analysisSeasonForGame(game)}</small></div>${dialogTeamPickButton(game,'home')}</div><button type="button" class="dialog-nav-arrow" data-game-nav="1" ${gameIndex >= state.games.length - 1 ? 'disabled' : ''}>›</button><button type="button" data-dialog-close>×</button></div><section class="forecast-dialog-shell" style="${teamPaletteVars(game.away,game.home)}"><div class="madden-dialog-tabs forecast-stage-tabs" role="tablist"><button type="button" class="active" data-game-detail-tab="overview"><span>1</span>Overall</button><button type="button" data-game-detail-tab="edges"><span>2</span>Player edges</button><button type="button" data-game-detail-tab="ranks"><span>3</span>League ranks</button><button type="button" data-game-detail-tab="run"><span>4</span>Run game</button><button type="button" data-game-detail-tab="pass"><span>5</span>Pass game</button><button type="button" data-game-detail-tab="receiving"><span>6</span>Receiving</button><button type="button" data-game-detail-tab="defense"><span>7</span>Defense & schemes</button></div><div class="game-detail-tab-panel active forecast-stage-panel" data-game-detail-panel="overview">${forecastDialogOverview(forecast,personnel)}</div><div class="game-detail-tab-panel forecast-stage-panel" data-game-detail-panel="edges">${forecastDialogEdges(forecast,personnel)}</div><div class="game-detail-tab-panel forecast-stage-panel" data-game-detail-panel="ranks">${forecastDialogRanks(forecast)}</div><div class="game-detail-tab-panel forecast-stage-panel" data-game-detail-panel="run">${forecastDialogRun(forecast,personnel)}</div><div class="game-detail-tab-panel forecast-stage-panel" data-game-detail-panel="pass">${forecastDialogPass(forecast,personnel)}</div><div class="game-detail-tab-panel forecast-stage-panel" data-game-detail-panel="receiving">${forecastDialogReceiving(forecast,summary?.boxscore || {},personnel)}</div><div class="game-detail-tab-panel forecast-stage-panel" data-game-detail-panel="defense">${forecastDialogDefense(forecast,personnel)}</div></section>`;
}

function gameDialogHtml(game, summary, personnel = null, forecast = null) {
  if (forecast && game?.status?.type?.state === 'pre') return forecastGameDialogHtml(game, summary, personnel, forecast);
  const box = summary?.boxscore || {};
  const gameIndex = state.games.findIndex((item) => item.id === game.id);
  return `
    <div class="dialog-head">
      <button type="button" class="dialog-nav-arrow" data-game-nav="-1" ${gameIndex <= 0 ? 'disabled' : ''} aria-label="Previous game">‹</button>
      <div class="standard-head-matchup">${dialogTeamPickButton(game,'away')}<div><span class="eyebrow">${escapeHtml(statusText(game))}</span><h2>${escapeHtml(game.name)}</h2></div>${dialogTeamPickButton(game,'home')}</div>
      <button type="button" class="dialog-nav-arrow" data-game-nav="1" ${gameIndex >= state.games.length - 1 ? 'disabled' : ''} aria-label="Next game">›</button>
      <button type="button" data-dialog-close>x</button>
    </div>
    <section class="madden-dialog-panel">
      <div class="madden-dialog-tabs" role="tablist" aria-label="Game detail tabs">
        <button type="button" class="active" data-game-detail-tab="depth">Depth Charts</button>
        <button type="button" data-game-detail-tab="coverage">WR vs Secondary</button>
        <button type="button" data-game-detail-tab="players">Player Stats</button>
        <button type="button" data-game-detail-tab="teams">Team Stats</button>
      </div>
      <div class="game-detail-tab-panel active" data-game-detail-panel="depth">
        ${dialogDepthChartsHtml(game, box, personnel)}
      </div>
      <div class="game-detail-tab-panel" data-game-detail-panel="coverage">
        <div class="projected-grid">${projectedMatchupsHtml(game, box, personnel)}</div>
        <section class="coverage-history"><header><div><span class="eyebrow">Verified History</span><strong>Imported head-to-head coverage</strong></div><span class="status-pill verified">Charted</span></header>${coverageHistoryHtml(coverageRowsForGame(game))}</section>
      </div>
      <div class="game-detail-tab-panel" data-game-detail-panel="players">
        ${dialogPlayerStatsHtml(box)}
      </div>
      <div class="game-detail-tab-panel" data-game-detail-panel="teams">
        ${dialogTeamStatsHtml(game)}
      </div>
    </section>
    <div class="detail-grid">
      <section class="detail-card">
        <span class="eyebrow">Score</span>
        ${dialogTeamHtml(game.away)}
        ${dialogTeamHtml(game.home)}
      </section>
      <section class="detail-card">
        <span class="eyebrow">Context</span>
        <p>${escapeHtml(game.venue || 'Venue TBD')}</p>
        <p>${escapeHtml(game.broadcast || 'Broadcast TBD')}</p>
        <p>${escapeHtml(game.odds?.details || 'Line TBD')} ${game.odds?.overUnder ? `| O/U ${escapeHtml(game.odds.overUnder)}` : ''}</p>
      </section>
    </div>
    <section class="detail-card"><span class="eyebrow">Line Score</span>${dialogLineScoreHtml(game)}</section>
    ${box?.teams ? `<section class="detail-card"><span class="eyebrow">Box Score</span>${dialogBoxHtml(box)}</section>` : ''}
  `;
}

function dialogDepthChartsHtml(game, box, personnel = null) {
  const playerGroups = box?.players || [];
  const away = depthChartForTeam(playerGroups, game.away);
  const home = depthChartForTeam(playerGroups, game.home);
  const offense = (rows) => rows.filter((row) => isReceiverPosition(row.position) || /^(QB|RB|FB|LT|LG|C|RG|RT|OL)$/.test(row.position));
  const defense = (rows) => rows.filter((row) => isSecondaryPosition(row.position) || /^(DE|LDE|RDE|DT|LDT|RDT|DL|NT|LB|ILB|MLB|WLB|SLB|OLB|EDGE)$/.test(row.position));
  const gameHasParticipants = game?.status?.type?.state !== 'pre';
  const resolveUnit = (participants, roster, filter, unit) => {
    const eligibleRoster = filter(roster || []);
    const rows = gameHasParticipants && participants.length ? mergeParticipantPositions(participants, eligibleRoster) : eligibleRoster;
    return assignDepthStrings(rows, unit);
  };
  away.offense = resolveUnit(away.offense, personnel?.away, offense, 'offense');
  away.defense = resolveUnit(away.defense, personnel?.away, defense, 'defense');
  home.offense = resolveUnit(home.offense, personnel?.home, offense, 'offense');
  home.defense = resolveUnit(home.defense, personnel?.home, defense, 'defense');
  return `
    <div class="depth-matchup-toggle" role="tablist" aria-label="Depth chart matchup">
      <button type="button" class="active" data-depth-matchup="away">${escapeHtml(game.away.abbrev)} O vs ${escapeHtml(game.home.abbrev)} D</button>
      <button type="button" data-depth-matchup="home">${escapeHtml(game.home.abbrev)} O vs ${escapeHtml(game.away.abbrev)} D</button>
    </div>
    <div class="depth-chart-grid active" data-depth-matchup-panel="away">
      ${depthMatchupHtml(game.away, away.offense, game.home, home.defense, game)}
    </div>
    <div class="depth-chart-grid" data-depth-matchup-panel="home">
      ${depthMatchupHtml(game.home, home.offense, game.away, away.defense, game)}
    </div>
  `;
}

function depthChartForTeam(playerGroups = [], team) {
  const group = playerGroups.find((entry) => String(entry?.team?.id || '') === String(team?.id || '')
    || String(entry?.team?.abbreviation || '').toUpperCase() === String(team?.abbrev || '').toUpperCase());
  const buckets = {
    offense: new Map(),
    defense: new Map(),
  };
  for (const category of group?.statistics || []) {
    const name = normalizeStatKey(category?.name || category?.displayName || category?.text);
    const bucket = name.includes('defensive') || name.includes('interception') || name.includes('sack') ? buckets.defense : buckets.offense;
    for (const athlete of category?.athletes || []) {
      const player = athlete?.athlete || {};
      const id = String(player.id || player.uid || player.displayName || '');
      if (!id) continue;
      const existing = bucket.get(id) || {
        id,
        name: player.displayName || player.shortName || 'Player',
        position: player.position?.abbreviation || player.position?.displayName || athlete.position?.abbreviation || athlete.position?.displayName || athlete.position || '',
        stats: [],
        statCategories: player.statCategories || [],
      };
      if (!existing.position && athlete.position) existing.position = athlete.position;
      const labels = category.labels || category.names || [];
      if (Array.isArray(athlete.seasonStats) && athlete.seasonStats.length) {
        existing.stats.push(...athlete.seasonStats.slice(0, 8));
      } else if (labels.length && Array.isArray(athlete.stats)) {
        labels.slice(0, 6).forEach((label, index) => {
          existing.stats.push({ label, value: athlete.stats[index] ?? '' });
        });
      } else {
        existing.stats.push({
          label: category.displayName || category.name || category.abbreviation || category.shortDisplayName || 'Stat',
          value: athlete.displayValue || athlete.stats?.join(' / ') || athlete.value || '',
        });
      }
      bucket.set(id, existing);
    }
  }
  return {
    offense: [...buckets.offense.values()],
    defense: [...buckets.defense.values()],
  };
}

function depthMatchupHtml(offenseTeam, offenseRows, defenseTeam, defenseRows, game) {
  const enrichedOffense = enrichDepthRowsWithAverages(offenseRows).sort((a, b) => footballPositionRank(a.position, 'offense') - footballPositionRank(b.position, 'offense') || (a.depth || 99) - (b.depth || 99) || a.name.localeCompare(b.name));
  const enrichedDefense = enrichDepthRowsWithAverages(defenseRows).sort((a, b) => footballPositionRank(a.position, 'defense') - footballPositionRank(b.position, 'defense') || (a.depth || 99) - (b.depth || 99) || a.name.localeCompare(b.name));
  return `
    <section class="depth-team" style="--team-accent:${escapeHtml(offenseTeam.color)};--depth-logo:url('${escapeHtml(offenseTeam.logo)}')">
      <header>
        <img src="${escapeHtml(offenseTeam.logo)}" alt="" />
        <div><strong style="color:${escapeHtml(readableTeamColor(offenseTeam.color))}">${escapeHtml(offenseTeam.abbrev)} Offense</strong><span>season/game stats vs ${escapeHtml(defenseTeam.abbrev)} defense</span></div>
      </header>
      <div class="matchup-read">
        ${matchupReadHtml(offenseTeam, defenseTeam, game)}
      </div>
      <div class="depth-lanes">
        <div><span class="eyebrow">${escapeHtml(offenseTeam.abbrev)} Offense</span>${enrichedOffense.length ? enrichedOffense.map((player) => depthPlayerRowHtml(player, offenseTeam)).join('') : '<div class="empty">Offensive data unavailable.</div>'}</div>
        <div><span class="eyebrow">${escapeHtml(defenseTeam.abbrev)} Defense</span>${enrichedDefense.length ? enrichedDefense.map((player) => depthPlayerRowHtml(player, defenseTeam)).join('') : '<div class="empty">Defensive data unavailable.</div>'}</div>
      </div>
    </section>
  `;
}

function footballPositionRank(position, unit = '') {
  const keyName = String(position || '').toUpperCase();
  const offense = ['QB','RB','HB','FB','LWR','WR','RWR','SWR','SLWR','SRWR','TE','LT','LG','C','RG','RT','OL'];
  const defense = ['LDE','DE','RDE','LDT','DT','RDT','NT','DL','EDGE','WLB','OLB','MLB','ILB','LB','SLB','LCB','CB','RCB','SCB','NB','FS','SS','S','DB'];
  const special = ['K','PK','P','LS','H','KR','PR'];
  const order = unit === 'offense' ? offense : unit === 'defense' ? defense : [...offense, ...defense, ...special];
  const index = order.indexOf(keyName); return index < 0 ? 999 : index;
}

function depthPositionGroup(position) {
  const pos = String(position || '').toUpperCase();
  if (/^(LWR|RWR|SWR|SLWR|SRWR|WR)$/.test(pos)) return 'WR';
  if (/^(HB|RB)$/.test(pos)) return 'RB';
  if (/^(LDE|RDE|DE)$/.test(pos)) return 'DE';
  if (/^(LDT|RDT|DT|NT)$/.test(pos)) return 'DT';
  if (/^(WLB|SLB|MLB|ILB|OLB|LB)$/.test(pos)) return 'LB';
  if (/^(LCB|RCB|SCB|CB|NB)$/.test(pos)) return 'CB';
  return pos;
}

function numericPlayerStat(player, aliases) {
  for (const stat of dedupeDepthStats(player?.stats || [])) if (aliases.some((alias) => normalizeStatKey(stat.label) === normalizeStatKey(alias))) { const value = numericStatValue(stat.value); if (Number.isFinite(value)) return value; }
  return 0;
}

function playerUsageScore(player) {
  const group = depthPositionGroup(player.position);
  if (group === 'QB') return numericPlayerStat(player, ['ATT','passingAttempts']) * 12 + numericPlayerStat(player, ['YDS','passingYards']) + numericPlayerStat(player, ['TD','passingTouchdowns']) * 75;
  if (group === 'RB' || group === 'FB') return numericPlayerStat(player, ['CAR','rushingAttempts']) * 12 + numericPlayerStat(player, ['YDS','rushingYards']) + numericPlayerStat(player, ['TD','rushingTouchdowns']) * 65 + numericPlayerStat(player, ['REC','receptions']) * 8;
  if (group === 'WR' || group === 'TE') return numericPlayerStat(player, ['REC','receptions']) * 30 + numericPlayerStat(player, ['YDS','receivingYards']) + numericPlayerStat(player, ['TD','receivingTouchdowns']) * 80 + numericPlayerStat(player, ['TGTS','targets']) * 8;
  if (['DE','DT','DL','EDGE','LB','CB','S','FS','SS','DB'].includes(group)) return numericPlayerStat(player, ['TOT','totalTackles']) * 12 + numericPlayerStat(player, ['SOLO','soloTackles']) * 4 + numericPlayerStat(player, ['SACKS','sacks']) * 45 + numericPlayerStat(player, ['INT','interceptions']) * 70 + numericPlayerStat(player, ['TFL','tacklesForLoss']) * 15;
  return numericPlayerStat(player, ['GP','gamesPlayed']) * 2;
}

function assignDepthStrings(rows, unit) {
  const groups = new Map();
  for (const row of rows) { const group = depthPositionGroup(row.position); if (!groups.has(group)) groups.set(group, []); groups.get(group).push(row); }
  const output = [];
  for (const [group, sourcePlayers] of groups) {
    const hasExpectedRoles = sourcePlayers.some((player) => player.expectedStarter); const allowsRotation = ['WR','RB','TE'].includes(group); const limit = group === 'WR' ? 4 : allowsRotation ? 3 : sourcePlayers.length;
    const players = (hasExpectedRoles && !allowsRotation ? sourcePlayers.filter((player) => player.expectedStarter) : sourcePlayers).sort((a, b) => Number(b.expectedStarter) - Number(a.expectedStarter) || starterScore(b) - starterScore(a) || (Number(a.depth) || 99) - (Number(b.depth) || 99) || playerUsageScore(b) - playerUsageScore(a) || a.name.localeCompare(b.name));
    players.slice(0, limit).forEach((player, index) => {
      const string = index + 1;
      const multiStarterGroup = ['WR','CB','DL','LB','OL'].includes(group);
      const hierarchy = player.expectedStarter ? 'starter' : multiStarterGroup && string <= 3 ? 'core' : string === 2 ? 'rotation' : 'depth';
      output.push({ ...player, string, positionGroup: group, hierarchy });
    });
  }
  return output.sort((a, b) => footballPositionRank(a.position, unit) - footballPositionRank(b.position, unit) || Number(b.expectedStarter) - Number(a.expectedStarter) || a.string - b.string || starterScore(b) - starterScore(a));
}

function mergeParticipantPositions(participants, roster) {
  return participants.map((player) => { const match = roster.find((row) => String(row.id) === String(player.id) || normalizeStatKey(row.name) === normalizeStatKey(player.name)); return match ? { ...match, ...player, position: player.position || match.position, depth: match.depth, slot: match.slot, status: match.status } : player; }).filter((player) => player.position);
}

function playerButtonHtml(player, team) {
  const personnelKey = player.personnelKey || `${team?.abbrev || ''}|${player.id || normalizeStatKey(player.name)}`;
  return `<button type="button" class="player-name-button" data-player-card data-personnel-key="${escapeHtml(personnelKey)}" data-player-id="${escapeHtml(player.espnId || player.id || '')}" data-player-name="${escapeHtml(player.name)}" data-player-position="${escapeHtml(player.position || '')}" data-player-team="${escapeHtml(team?.abbrev || '')}" data-player-color="${escapeHtml(team?.color || '')}" data-player-logo="${escapeHtml(team?.logo || '')}">${escapeHtml(player.name)}</button>`;
}

function depthPlayerRowHtml(player, team) {
  const evaluation = player.evaluation || playerGrade(player, player.evidence);
  const hierarchy = player.hierarchy || (Number(player.string) === 1 ? 'starter' : Number(player.string) === 2 ? 'rotation' : 'depth');
  const roleLabel = hierarchy === 'starter' ? 'STARTER' : hierarchy === 'core' ? 'CORE ROLE' : hierarchy === 'rotation' ? 'ROTATION' : 'DEPTH';
  const statText = dedupeDepthStats(player.stats).slice(0, 4).map((stat) => {
    const delta = Number(stat.delta);
    const deltaText = Number.isFinite(delta) && delta > 0 ? ` (+${formatCompactNumber(delta)} vs avg)` : '';
    return `${stat.label}: ${stat.value}${deltaText}`;
  }).join(' | ');
  const evidenceText = evaluation.metrics.slice(0, 3).map(([label, value]) => `${label} ${typeof value === 'number' ? (Math.abs(value) < 1 && value !== 0 ? value.toFixed(2) : Math.round(value * 10) / 10) : value}`).join(' · ');
  return `
    <div class="depth-player hierarchy-${hierarchy}">
      <span>${escapeHtml(player.position || '-')}<small class="string-rank">${player.string ? `${player.string}${player.string === 1 ? 'st' : player.string === 2 ? 'nd' : 'rd'}` : ''}</small></span>
      <strong>${playerButtonHtml(player, team)} <small class="player-role">${roleLabel}</small> <span class="inline-rating rating-${evaluation.label.toLowerCase()}"><b>${evaluation.grade}</b> ${evaluation.label}</span></strong>
      <em>${escapeHtml(statText || evidenceText || evaluation.basis)} <small class="rating-confidence">${escapeHtml(evaluation.confidence)} · ${evaluation.season}</small></em>
    </div>
  `;
}

function enrichDepthRowsWithAverages(rows = []) {
  const totals = new Map();
  for (const row of rows) {
    for (const stat of dedupeDepthStats(row.stats)) {
      const value = numericStatValue(stat.value);
      if (!Number.isFinite(value)) continue;
      const keyName = normalizeStatKey(stat.label);
      const current = totals.get(keyName) || { total: 0, count: 0 };
      current.total += value;
      current.count += 1;
      totals.set(keyName, current);
    }
  }
  return rows.map((row) => ({
    ...row,
    stats: (row.stats || []).map((stat) => {
      const value = numericStatValue(stat.value);
      const avg = totals.get(normalizeStatKey(stat.label));
      if (!Number.isFinite(value) || !avg?.count) return stat;
      return { ...stat, delta: value - (avg.total / avg.count) };
    }),
  }));
}

function numericStatValue(value) {
  const match = String(value ?? '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function formatCompactNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return Math.abs(number) >= 10 ? String(Math.round(number)) : number.toFixed(1).replace(/\.0$/, '');
}

function dedupeDepthStats(stats = []) {
  const seen = new Set();
  return stats.filter((stat) => {
    const keyName = normalizeStatKey(stat?.label || '');
    if (!keyName || seen.has(keyName)) return false;
    seen.add(keyName);
    return stat?.value != null && stat.value !== '';
  });
}

function matchupReadHtml(team, opponent, game) {
  const runDefense = RUN_DEFENSE_2025.find((row) => row.team === normalizedNflTeam(opponent.abbrev));
  const rows = [
    ['Pass', statLookup(team.stats, ['netPassingYards', 'passing yards']), statLookup(opponent.stats, ['netPassingYards', 'passing yards'])],
    ['Rush', statLookup(team.stats, ['rushingYards', 'rushing yards']), statLookup(opponent.stats, ['rushingYards', 'rushing yards'])],
    ['TO', statLookup(team.stats, ['turnovers']), statLookup(opponent.stats, ['takeaways', 'turnovers'])],
  ];
  const basics = rows.map(([label, teamValue, oppValue]) => `<span><b>${escapeHtml(label)}</b><em>Off ${escapeHtml(teamValue)}</em><em>Def ${escapeHtml(oppValue)}</em></span>`).join('');
  if (!runDefense) return basics;
  const tier = runDefense.rank <= 8 ? 'elite' : runDefense.rank >= 25 ? 'bad' : 'mid';
  const baselineSeason = analysisSeasonForGame(game);
  return `${basics}<span class="run-defense-read tier-${tier}"><b>Run D ${tier}</b><em>#${runDefense.rank} NFL</em><em>${runDefense.ypg} rush YPG allowed · ${baselineSeason === 2025 ? '2025 model baseline' : '2025 fallback baseline'}</em></span>`;
}

function dialogPlayerStatsHtml(box) {
  const groups = playerStatSections(box);
  return `
    <div class="player-stat-tabs">
      ${groups.map((group) => `
        <section class="player-stat-board">
          <header><span class="eyebrow">${escapeHtml(group.label)}</span><strong>${escapeHtml(group.hint)}</strong></header>
          ${group.rows.length ? playerStatTableHtml(group) : '<div class="empty">Unavailable from source.</div>'}
        </section>
      `).join('')}
    </div>
  `;
}

function playerStatSections(box) {
  const wanted = [
    { key: 'passing', label: 'Passing', hint: 'QB production' },
    { key: 'rushing', label: 'Rushing', hint: 'Backfield and scrambles' },
    { key: 'receiving', label: 'Receiving', hint: 'Targets and explosive plays' },
    { key: 'passRush', label: 'Pass Rush', hint: 'Sacks, TFL, QB pressure clues' },
    { key: 'passDefense', label: 'Pass Defense', hint: 'INT and coverage plays' },
  ];
  return wanted.map((section) => ({ ...section, rows: playerStatRows(box, section.key) }));
}

function playerStatRows(box, keyName) {
  const rows = [];
  for (const teamBlock of box?.players || []) {
    const team = teamBlock.team || {};
    const categoryKey = (keyName === 'passRush' || keyName === 'passDefense') ? 'defensive' : keyName;
    const category = (teamBlock.statistics || []).find((stat) => normalizeStatKey(stat.name || stat.displayName || stat.text).includes(normalizeStatKey(categoryKey)));
    if (!category) continue;
    const labels = filteredPlayerStatLabels(category.labels || category.names || [], keyName);
    for (const athlete of category.athletes || []) {
      const rawValues = category.labels || category.names || [];
      rows.push({
        team: team.abbreviation || team.shortDisplayName || '',
        color: teamColor(team),
        name: athlete.athlete?.displayName || athlete.athlete?.shortName || 'Player',
        values: labels.map((label) => {
          const sourceIndex = rawValues.findIndex((candidate) => candidate === label);
          return [label, athlete.stats?.[sourceIndex] ?? ''];
        }).filter(([, value]) => value !== ''),
      });
    }
  }
  return rows.slice(0, 14);
}

function filteredPlayerStatLabels(labels, keyName) {
  if (keyName === 'passRush') return labels.filter((label) => /sack|tfl|qb/i.test(label)).slice(0, 5);
  if (keyName === 'passDefense') return labels.filter((label) => /int|pd|pass|td/i.test(label)).slice(0, 5);
  return labels.slice(0, 6);
}

function playerStatTableHtml(group) {
  const labels = [...new Set(group.rows.flatMap((row) => row.values.map(([label]) => label)))].slice(0, 6);
  return `
    <div class="table-wrap player-stat-table-wrap">
      <table class="nfl-table player-stat-table">
        <thead><tr><th>Team</th><th>Player</th>${labels.map((label) => `<th>${escapeHtml(label)}</th>`).join('')}</tr></thead>
        <tbody>
          ${group.rows.map((row) => `
            <tr>
              <td style="color:${escapeHtml(readableTeamColor(row.color))}">${escapeHtml(row.team)}</td>
              <td>${escapeHtml(row.name)}</td>
              ${labels.map((label) => `<td>${escapeHtml(row.values.find(([keyName]) => keyName === label)?.[1] || '--')}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function dialogTeamHtml(team) {
  return `<div class="team-row"><img src="${escapeHtml(team.logo)}" alt="" /><div class="team-name"><strong style="color:${escapeHtml(readableTeamColor(team.color))}">${escapeHtml(team.name)}</strong><span>${escapeHtml(team.record)}</span></div><div class="team-score">${escapeHtml(team.score)}</div></div>`;
}

function dialogTeamStatsHtml(game) {
  return `
    <div class="dialog-team-stats">
      <div class="dialog-team-head">
        <span style="color:${escapeHtml(readableTeamColor(game.away.color))}">${escapeHtml(game.away.abbrev)}</span>
        <strong>${escapeHtml(game.away.score)} - ${escapeHtml(game.home.score)}</strong>
        <span style="color:${escapeHtml(readableTeamColor(game.home.color))}">${escapeHtml(game.home.abbrev)}</span>
      </div>
      ${gameStatRows(game).concat([
        { label: 'Record', away: game.away.record, home: game.home.record },
        { label: 'Possession', away: possessionTeam(game) === game.away.id ? 'Yes' : '-', home: possessionTeam(game) === game.home.id ? 'Yes' : '-' },
      ]).map((row) => `
        <div class="dialog-stat-row">
          <span>${escapeHtml(row.away)}</span>
          <strong>${escapeHtml(row.label)}</strong>
          <span>${escapeHtml(row.home)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function dialogLeadersHtml(leaders) {
  const rows = [];
  for (const group of leaders || []) {
    for (const leader of group.leaders || []) {
      rows.push({
        label: group.displayName || group.name || 'Leader',
        name: leader.athlete?.displayName || leader.displayName || 'Player',
        value: leader.displayValue || leader.value || '',
      });
    }
  }
  return rows.length ? `<div class="leader-list">${rows.slice(0, 10).map((row) => `<div class="leader-row"><div class="leader-main"><strong>${escapeHtml(row.name)}</strong><span>${escapeHtml(row.label)}</span></div><div class="leader-value">${escapeHtml(row.value)}</div></div>`).join('')}</div>` : '<div class="empty">No leaders available.</div>';
}

function dialogPlaysHtml(items) {
  const rows = Array.isArray(items) ? items.slice(0, 8) : [];
  return rows.length ? `<div class="leader-list">${rows.map((item) => {
    const period = item.period?.displayValue || (item.period?.number ? `Q${item.period.number}` : '');
    const clock = item.clock?.displayValue || item.displayClock || '';
    const title = [period, clock].filter(Boolean).join(' ') || item.shortDisplayResult || item.result || item.type?.text || 'Scoring';
    const detail = item.text || item.description || item.displayResult || item.team?.displayName || '';
    return `<div class="note-item"><div class="note-main"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div></div>`;
  }).join('')}</div>` : '<div class="empty">No drive data available.</div>';
}

function dialogLineScoreHtml(game) {
  const quarters = Math.max(game.away.linescores?.length || 0, game.home.linescores?.length || 0, 4);
  const head = Array.from({ length: quarters }, (_, index) => `<th>Q${index + 1}</th>`).join('');
  const row = (team) => `
    <tr>
      <td>${escapeHtml(team.abbrev)}</td>
      ${Array.from({ length: quarters }, (_, index) => `<td>${escapeHtml(team.linescores?.[index]?.value ?? team.linescores?.[index]?.displayValue ?? '-')}</td>`).join('')}
      <td>${escapeHtml(team.score)}</td>
    </tr>
  `;
  return `
    <div class="table-wrap">
      <table class="nfl-table">
        <thead><tr><th>Team</th>${head}<th>Total</th></tr></thead>
        <tbody>${row(game.away)}${row(game.home)}</tbody>
      </table>
    </div>
  `;
}

function dialogBoxHtml(box) {
  const teams = box.teams || [];
  return `<div class="table-wrap"><table class="nfl-table"><tbody>${teams.map((team) => `
    <tr><td>${escapeHtml(team.team?.abbreviation || team.team?.displayName || '')}</td>${(team.statistics || []).slice(0, 8).map((stat) => `<td>${escapeHtml(stat.label || stat.name)} ${escapeHtml(stat.displayValue || stat.value || '')}</td>`).join('')}</tr>
  `).join('')}</tbody></table></div>`;
}

function mergeStandings(teams, standings) {
  return teams.map((team) => {
    const stats = standings.get(String(team.id)) || {};
    const wins = stats.wins !== '--' ? stats.wins : '';
    const losses = stats.losses !== '--' ? stats.losses : '';
    const ties = stats.ties && stats.ties !== '0' && stats.ties !== '--' ? `-${stats.ties}` : '';
    return {
      ...team,
      record: wins !== '' && losses !== '' ? `${wins}-${losses}${ties}` : team.record,
      winPct: stats.winPct || numberFromRecord(team.record),
      pointsFor: stats.pointsFor || '--',
      pointsAgainst: stats.pointsAgainst || '--',
      differential: stats.differential || '--',
      streak: stats.streak || '--',
    };
  });
}

async function loadAll({ silent = false } = {}) {
  state.selectedDate = nflWeekStart(state.selectedDate || todayValue());
  const weekContext = renderWeekControls();
  if (!silent) els.statusBar.textContent = `Loading ${weekContext.season} ${weekContext.name}...`;
  els.dateInput.value = state.selectedDate;
  localStorage.setItem(key('date'), state.selectedDate);
  try {
    let scoreboard = await fetchScoreboard();
    if (!scoreboard.games.length) {
      const snapDate = await findMostRecentSlateDate(state.selectedDate).catch(() => state.selectedDate);
      if (snapDate && snapDate !== state.selectedDate) {
        state.selectedDate = nflWeekStart(snapDate);
        state.snappedDate = true;
        els.dateInput.value = state.selectedDate;
        localStorage.setItem(key('date'), state.selectedDate);
        scoreboard = { games: await fetchScoreboardRange(nflWeekStart(state.selectedDate), nflWeekEnd(state.selectedDate)), raw: null };
      } else {
        state.snappedDate = false;
      }
    } else {
      state.snappedDate = false;
    }

    const season = seasonForDate(state.selectedDate);
    const [regularGames, playoffGames, priorRegularGames, priorPlayoffGames, teamsSource, standingsSource] = await Promise.all([
      fetchSeasonScoreboard(season, '2').catch(() => []),
      fetchSeasonScoreboard(season, '3').catch(() => []),
      fetchSeasonScoreboard(season - 1, '2').catch(() => []),
      fetchSeasonScoreboard(season - 1, '3').catch(() => []),
      fetchTeams().catch(() => []),
      fetchStandings(season).catch(() => new Map()),
    ]);
    state.games = scoreboard.games;
    state.gameForecastCache.clear();
    matchupPersonnelCache.clear();
    state.seasonGames = [...regularGames, ...playoffGames];
    state.priorSeasonGames = [...priorRegularGames, ...priorPlayoffGames];
    if (!state.forecastGameId || !state.games.some((game) => game.id === state.forecastGameId)) state.forecastGameId = state.games[0]?.id || '';
    state.forecastResult = null;
    const aggregateStandings = aggregateTeamStatsFromGames(state.seasonGames.length ? state.seasonGames : state.games);
    const teams = teamsSource.length ? teamsSource : teamsFromGames(state.seasonGames.length ? state.seasonGames : state.games);
    const standings = standingsSource.size ? standingsSource : aggregateStandings;
    state.teams = mergeStandings(teams, standings);
    state.leaders = await fetchLeaders(els.leaderSeasonType.value).catch(() => leadersFromGames(state.seasonGames.length ? state.seasonGames : state.games));
    state.touchdowns = await fetchTouchdownsForSlate(state.games).catch(() => []);
    const resolvedWeek = renderWeekControls();
    els.slateLabel.textContent = `${resolvedWeek.shortPhase} · ${resolvedWeek.name} · ${state.games.length} games`;
    els.statusBar.textContent = state.snappedDate
      ? `No games in the requested NFL window. Showing ${resolvedWeek.phase} ${resolvedWeek.name}: ${nflWeekLabel(state.selectedDate)}.`
      : `${resolvedWeek.season} ${resolvedWeek.phase} · ${resolvedWeek.name} · ${state.games.length} games · ${resolvedWeek.baselineReason}.`;
    renderAll();
    if (state.page === 'scoreboard') void primeSlateForecasts();
    const query = new URLSearchParams(window.location.search);
    if (query.get('picker') === 'open' && !datePickerEl) openDatePicker();
    const requestedGame = query.get('game');
    if (state.page === 'scoreboard' && !state.openGameId && requestedGame) {
      const target = requestedGame === 'first' ? state.games.find((game) => game.status?.type?.state === 'pre') || state.games[0] : state.games.find((game) => game.id === requestedGame);
      if (target) openGameDialog(target.id).then(() => {
        const stage = query.get('stage');
        if (['overview','run','pass','receiving','edges','defense','ranks'].includes(stage)) els.gameDialog.querySelector(`[data-game-detail-tab="${stage}"]`)?.click();
        const edgeStage=query.get('edge'); if (['qb','wr','rb','defense'].includes(edgeStage)) els.gameDialog.querySelector(`[data-matchup-edge-tab="${edgeStage}"]`)?.click();
        const requestedPlayer = normalizeStatKey(query.get('player'));
        if (requestedPlayer) {
          const playerButton = [...els.gameDialog.querySelectorAll('[data-player-card]')].find((entry) => normalizeStatKey(entry.dataset.playerName).includes(requestedPlayer));
          if (playerButton) openNflPlayerCard(playerButton);
        }
      });
    }
    if (state.page === 'forecast' && state.games.length) analyzeForecast();
  } catch (error) {
    els.statusBar.textContent = `Could not load NFL data: ${error.message}`;
    renderAll();
  }
}

function setPage(page) {
  state.page = page;
  localStorage.setItem(key('page'), page);
  renderTabs();
  if (page === 'forecast' && state.games.length && (!state.forecastResult || state.forecastResult.game.id !== selectedForecastGame()?.id)) analyzeForecast();
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-load-forecast-coverage]')) { analyzeForecast({ loadCoverage: true }); return; }
    const tierButton = event.target.closest('[data-tier-player]');
    if (tierButton) { const id = tierButton.dataset.tierPlayer; if (tierButton.dataset.tierValue === 'auto') delete state.playerTierOverrides[id]; else state.playerTierOverrides[id] = tierButton.dataset.tierValue; writeJson(key('playerTierOverrides'), state.playerTierOverrides); const current = state.playerCardContext[state.playerCardIndex]; if (current) openNflPlayerCard(current, true); return; }
    const playerNav = event.target.closest('[data-player-nav]');
    if (playerNav && !playerNav.disabled) { const next = state.playerCardContext[state.playerCardIndex + Number(playerNav.dataset.playerNav)]; if (next) openNflPlayerCard(next, true); return; }
    const playerButton = event.target.closest('[data-player-card]');
    if (playerButton) { event.preventDefault(); event.stopPropagation(); openNflPlayerCard(playerButton); return; }
    if (event.target.closest('[data-player-dialog-close]') || event.target === els.playerDialog) els.playerDialog?.close();
  });
  document.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => setPage(button.dataset.page));
  });
  els.forecastGameSelect?.addEventListener('change', () => {
    state.forecastGameId = els.forecastGameSelect.value;
    localStorage.setItem(key('forecastGameId'), state.forecastGameId);
    state.forecastResult = null;
    renderForecast();
    analyzeForecast();
  });
  els.forecastSampleSize?.addEventListener('change', () => { state.forecastResult = null; analyzeForecast(); });
  els.forecastAnalyzeBtn?.addEventListener('click', () => analyzeForecast());
  els.forecastCoaches?.addEventListener('change', (event) => {
    const input = event.target.closest('[data-staff-input]');
    if (!input) return;
    const team = normalizedNflTeam(input.dataset.team); const side = input.dataset.side;
    state.staffOverrides[team] = { ...(state.staffOverrides[team] || {}), [side]: input.value.trim() || staffForTeam(team)[side] };
    writeJson(key('staffOverrides'), state.staffOverrides);
    state.forecastResult = null;
    analyzeForecast();
  });
  els.dateInput.addEventListener('change', () => {
    state.selectedDate = nflWeekStart(parseFlexibleDateInput(els.dateInput.value) || state.selectedDate || todayValue());
    loadAll();
  });
  els.dateInput.addEventListener('focus', openDatePicker);
  els.dateInput.addEventListener('click', openDatePicker);
  els.weekPickerBtn?.addEventListener('click', () => datePickerEl ? closeDatePicker() : openDatePicker());
  els.prevDayBtn.addEventListener('click', () => {
    state.selectedDate = addDays(nflWeekStart(state.selectedDate), -7);
    loadAll();
  });
  els.nextDayBtn.addEventListener('click', () => {
    state.selectedDate = addDays(nflWeekStart(state.selectedDate), 7);
    loadAll();
  });
  els.prevWeekBtn.addEventListener('click', () => {
    state.selectedDate = addDays(state.selectedDate, -7);
    loadAll();
  });
  els.nextWeekBtn.addEventListener('click', () => {
    state.selectedDate = addDays(state.selectedDate, 7);
    loadAll();
  });
  els.todayBtn.addEventListener('click', () => {
    state.selectedDate = nflWeekStart(todayValue());
    loadAll();
  });
  els.refreshBtn.addEventListener('click', () => loadAll({ silent: true }));
  els.refreshTdBtn?.addEventListener('click', async () => {
    els.touchdownFeed.innerHTML = '<div class="empty">Refreshing touchdown feed...</div>';
    state.touchdowns = await fetchTouchdownsForSlate(state.games).catch(() => []);
    renderTouchdownFeed();
  });
  els.divisionToggle.addEventListener('click', () => {
    state.groupDivisions = !state.groupDivisions;
    writeJson(key('groupDivisions'), state.groupDivisions);
    renderTeams();
  });
  els.teamsTableWrap.addEventListener('click', (event) => {
    const button = event.target.closest('[data-team-sort]');
    if (!button) return;
    const sortKey = button.dataset.teamSort;
    state.teamSort = {
      key: sortKey,
      dir: state.teamSort.key === sortKey && state.teamSort.dir === 'desc' ? 'asc' : 'desc',
    };
    writeJson(key('teamSort'), state.teamSort);
    renderTeams();
  });
  els.leaderSeasonType.addEventListener('change', async () => {
    state.leaders = await fetchLeaders(els.leaderSeasonType.value).catch(() => leadersFromGames(state.seasonGames.length ? state.seasonGames : state.games));
    renderLeaders();
  });
  els.matchupGameSelect?.addEventListener('change', () => {
    state.matchupGameId = els.matchupGameSelect.value;
    renderMatchups();
  });
  els.matchupWindow?.addEventListener('change', renderMatchups);
  els.coverageImport?.addEventListener('change', async () => {
    const file = els.coverageImport.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : parseCsv(text);
      const sourceRows = Array.isArray(parsed) ? parsed : parsed.rows;
      if (!Array.isArray(sourceRows)) throw new Error('Expected an array or an object with a rows array.');
      const incoming = sourceRows.map(normalizeCoverageRow).filter(coverageRowValid);
      if (!incoming.length) throw new Error('No valid rows. Receiver, defender, offense_team, defense_team, and date or game_id are required.');
      const merged = new Map(state.coverageRows.map((row) => [JSON.stringify(COVERAGE_COLUMNS.map((column) => row[column])), row]));
      incoming.forEach((row) => merged.set(JSON.stringify(COVERAGE_COLUMNS.map((column) => row[column])), row));
      state.coverageRows = [...merged.values()];
      writeJson(key('coverageRows'), state.coverageRows);
      els.coverageImport.value = '';
      renderMatchups();
    } catch (error) {
      els.coverageDataStatus.textContent = `Import failed: ${error.message}`;
    }
  });
  els.coverageExportBtn?.addEventListener('click', () => downloadText('nfl-coverage-history.json', JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), rows: state.coverageRows }, null, 2), 'application/json'));
  els.coverageTemplateBtn?.addEventListener('click', () => downloadText('nfl-coverage-template.csv', `${COVERAGE_COLUMNS.join(',')}\n2025-09-07,,PHI,DAL,A.J. Brown,,elite,DaRon Bland,,elite,wide,man,28,7,5,84,1,0,118.8,charting-provider\n`, 'text/csv'));
  els.coverageClearBtn?.addEventListener('click', () => {
    if (!state.coverageRows.length || !window.confirm(`Remove all ${state.coverageRows.length} imported coverage rows from this browser?`)) return;
    state.coverageRows = []; writeJson(key('coverageRows'), state.coverageRows); renderMatchups();
  });
  els.propForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = `${els.propSelection.value || 'NFL prop'} - ${els.propMarket.value}`;
    const subtitle = [els.propTarget.value, els.propOdds.value].filter(Boolean).join(' | ');
    state.slip.push({ type: 'prop', title, subtitle });
    writeJson(key('slip'), state.slip);
    els.propSelection.value = '';
    els.propTarget.value = '';
    els.propOdds.value = '';
    renderBetSlip();
  });
  els.betSlip.addEventListener('click', (event) => {
    const button = event.target.closest('[data-slip-remove]');
    if (!button) return;
    state.slip.splice(Number(button.dataset.slipRemove), 1);
    writeJson(key('slip'), state.slip);
    renderBetSlip();
    renderScoreboard();
    const openGame=state.games.find((game)=>game.id===state.openGameId); if (openGame) syncDialogTeamPickState(openGame);
  });
  els.clearSlipBtn.addEventListener('click', () => {
    state.slip = [];
    writeJson(key('slip'), state.slip);
    renderBetSlip();
    renderScoreboard();
    const openGame=state.games.find((game)=>game.id===state.openGameId); if (openGame) syncDialogTeamPickState(openGame);
  });
  els.gameDialog.addEventListener('click', (event) => {
    const gameNav = event.target.closest('[data-game-nav]');
    if (gameNav && !gameNav.disabled) {
      const current = state.games.findIndex((game) => game.id === state.openGameId); const next = state.games[current + Number(gameNav.dataset.gameNav)];
      if (next) openGameDialog(next.id,currentGameDialogView());
      return;
    }
    const dialogTeamPick = event.target.closest('[data-dialog-team-pick]');
    if (dialogTeamPick) { const game=state.games.find((item)=>item.id===state.openGameId); if (game) addTeamPick(game,dialogTeamPick.dataset.dialogTeamPick); return; }
    const depthTab = event.target.closest('[data-depth-matchup]');
    if (depthTab) {
      event.preventDefault();
      const value = depthTab.dataset.depthMatchup;
      els.gameDialog.querySelectorAll('[data-depth-matchup]').forEach((button) => button.classList.toggle('active', button === depthTab));
      els.gameDialog.querySelectorAll('[data-depth-matchup-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.depthMatchupPanel === value));
      return;
    }
    const edgeTab = event.target.closest('[data-matchup-edge-tab]');
    if (edgeTab) {
      event.preventDefault(); const value=edgeTab.dataset.matchupEdgeTab; const shell=edgeTab.closest('.player-edges-shell');
      shell?.querySelectorAll('[data-matchup-edge-tab]').forEach((button)=>button.classList.toggle('active',button===edgeTab));
      shell?.querySelectorAll('[data-matchup-edge-panel]').forEach((panel)=>panel.classList.toggle('active',panel.dataset.matchupEdgePanel===value));
      return;
    }
    const tab = event.target.closest('[data-game-detail-tab]');
    if (tab) {
      event.preventDefault();
      const value = tab.dataset.gameDetailTab;
      els.gameDialog.querySelectorAll('[data-game-detail-tab]').forEach((button) => button.classList.toggle('active', button === tab));
      els.gameDialog.querySelectorAll('[data-game-detail-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.gameDetailPanel === value));
      return;
    }
    if (event.target === els.gameDialog || event.target.closest('[data-dialog-close]')) els.gameDialog.close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.target.matches('input, select, textarea')) return;
    const direction = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (direction && els.playerDialog?.open) { const next = state.playerCardContext[state.playerCardIndex + direction]; if (next) { event.preventDefault(); openNflPlayerCard(next, true); } return; }
    if (direction && els.gameDialog?.open) { const current = state.games.findIndex((game) => game.id === state.openGameId); const next = state.games[current + direction]; if (next) { event.preventDefault(); openGameDialog(next.id,currentGameDialogView()); } return; }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      state.selectedDate = addDays(nflWeekStart(state.selectedDate), -7);
      loadAll();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      state.selectedDate = addDays(nflWeekStart(state.selectedDate), 7);
      loadAll();
    }
    if (event.key.toLowerCase() === 'r') loadAll({ silent: true });
  });
}

bindEvents();
setPage(state.page);
loadAll();
