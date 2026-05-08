const gamesEl = document.getElementById('games');
const template = document.getElementById('gameTemplate');
const dateInput = document.getElementById('dateInput');
const overlayEl = document.getElementById('overlay');
const overlayResizeHandleEl = document.getElementById('overlayResizeHandle');
const overlayDockToggleBtnEl = document.getElementById('overlayDockToggleBtn');
const scoreboardColumnsBtnEl = document.getElementById('scoreboardColumnsBtn');
const pageToggleBtnEl = document.getElementById('pageToggleBtn');
const themeSelectEl = document.getElementById('themeSelect');
const leadersToolbarEl = document.getElementById('leadersToolbar');
const leadersPageEl = document.getElementById('leadersPage');
const hotPageEl = document.getElementById('hotPage');
const leadersTeamSelectEl = document.getElementById('leadersTeamSelect');
const leadersOpponentsBtnEl = document.getElementById('leadersOpponentsBtn');
const leadersContextEl = document.getElementById('leadersContext');
const lineupOverlayEl = document.getElementById('lineupOverlay');
const lineupBackdropEl = document.getElementById('lineupBackdrop');
const lineupCloseBtnEl = document.getElementById('lineupCloseBtn');
const lineupViewBtns = Array.from(document.querySelectorAll('.lineup-view-btn'));
const lineupModalMatchupEl = document.getElementById('lineupModalMatchup');
const lineupStateInningEl = document.getElementById('lineupStateInning');
const lineupStateAwayCodeEl = document.getElementById('lineupStateAwayCode');
const lineupStateAwayScoreEl = document.getElementById('lineupStateAwayScore');
const lineupStateHomeCodeEl = document.getElementById('lineupStateHomeCode');
const lineupStateHomeScoreEl = document.getElementById('lineupStateHomeScore');
const lineupStateBallsEl = document.getElementById('lineupStateBalls');
const lineupStateStrikesEl = document.getElementById('lineupStateStrikes');
const lineupStateOutsEl = document.getElementById('lineupStateOuts');
const lineupTickerEl = document.getElementById('lineupTicker');
const lineupStatusEl = document.getElementById('lineupStatus');
const lineupDiamondEl = document.getElementById('lineupDiamond');
const lineupBallsDotsEl = document.getElementById('lineupBallsDots');
const lineupStrikesDotsEl = document.getElementById('lineupStrikesDots');
const lineupOutsDotsEl = document.getElementById('lineupOutsDots');
const playerStatOverlayEl = document.getElementById('playerStatOverlay');
const playerStatBackdropEl = document.getElementById('playerStatBackdrop');
const playerStatCloseBtnEl = document.getElementById('playerStatCloseBtn');
const playerStatNameEl = document.getElementById('playerStatName');
const playerStatMetaEl = document.getElementById('playerStatMeta');
const playerStatHeadshotEl = document.getElementById('playerStatHeadshot');
const playerStatBioEl = document.getElementById('playerStatBio');
const playerStatTodayEl = document.getElementById('playerStatToday');
const playerStatSeasonEl = document.getElementById('playerStatSeason');
const playerStatExtraEl = document.getElementById('playerStatExtra');
const playerStatMatchupEl = document.getElementById('playerStatMatchup');

const betFormEl = document.getElementById('betForm');
const betDescEl = document.getElementById('betDesc');
const betPlayerSearchEl = document.getElementById('betPlayerSearch');
const betPlayerOptionsEl = document.getElementById('betPlayerOptions');
const betPropSelectEl = document.getElementById('betPropSelect');
const betPropTargetEl = document.getElementById('betPropTarget');
const betAddLegBtnEl = document.getElementById('betAddLegBtn');
const betClearLegsBtnEl = document.getElementById('betClearLegsBtn');
const betOddsEl = document.getElementById('betOdds');
const betAmountEl = document.getElementById('betAmount');
const clearGamePicksBtnEl = document.getElementById('clearGamePicksBtn');
const gamePickDraftListEl = document.getElementById('gamePickDraftList');
const confirmGamePicksBtnEl = document.getElementById('confirmGamePicksBtn');
const betListEl = document.getElementById('betList');
const betDayLabelEl = document.getElementById('betDayLabel');
const clearBetsBtn = document.getElementById('clearBetsBtn');
const gamePickDialogEl = document.getElementById('gamePickDialog');
const gamePickDialogFormEl = document.getElementById('gamePickDialogForm');
const gamePickDialogSummaryEl = document.getElementById('gamePickDialogSummary');
const gamePickDialogOddsEl = document.getElementById('gamePickDialogOdds');
const gamePickDialogAmountEl = document.getElementById('gamePickDialogAmount');
const gamePickDialogCancelBtnEl = document.getElementById('gamePickDialogCancelBtn');
const gamePickDialogDismissBtnEl = document.getElementById('gamePickDialogDismissBtn');
const gamePickDialogSaveBtnEl = document.getElementById('gamePickDialogSaveBtn');
const hrListEl = document.getElementById('hrList');
const goalDisplayEl = document.getElementById('goalDisplay');
const goalDayLabelEl = document.getElementById('goalDayLabel');
const goalTimerEl = document.getElementById('goalTimer');
const goalActiveTextEl = document.getElementById('goalActiveText');
const goalCurrentInputEl = document.getElementById('goalCurrentInput');
const goalStartPauseBtnEl = document.getElementById('goalStartPauseBtn');
const goalResetBtnEl = document.getElementById('goalResetBtn');
const goalSaveBtnEl = document.getElementById('goalSaveBtn');
const goalCompleteBtnEl = document.getElementById('goalCompleteBtn');
const goalHistoryDayLabelEl = document.getElementById('goalHistoryDayLabel');
const goalHistoryListEl = document.getElementById('goalHistoryList');
const clearGoalsBtnEl = document.getElementById('clearGoalsBtn');
const matchupExportMetaEl = document.getElementById('matchupExportMeta');
const matchupExportStartEl = document.getElementById('matchupExportStart');
const matchupExportEndEl = document.getElementById('matchupExportEnd');
const matchupLoadBtnEl = document.getElementById('matchupLoadBtn');
const matchupExportBtnEl = document.getElementById('matchupExportBtn');
const matchupLookupBatterEl = document.getElementById('matchupLookupBatter');
const matchupLookupPitcherEl = document.getElementById('matchupLookupPitcher');
const matchupLookupClearBtnEl = document.getElementById('matchupLookupClearBtn');
const matchupExportStatusEl = document.getElementById('matchupExportStatus');
const matchupLookupResultsEl = document.getElementById('matchupLookupResults');
const matchupBatterOptionsEl = document.getElementById('matchupBatterOptions');
const matchupPitcherOptionsEl = document.getElementById('matchupPitcherOptions');

const previousState = new Map();
let currentLineupView = 'lineups';
let activeLineupGame = null;
let latestRenderedGames = [];
let loadGamesInFlight = false;
let loadGamesRequestSeq = 0;
let goalCompletePulseTimeout = null;
let focusedGamePk = null;
const focusedMatchupSideByGame = new Map();
let draftBetLegs = [];
let pendingGamePickSelections = new Map();
const PANEL_LAYOUT_KEY = 'panel-layout:v2';
const OVERLAY_DOCK_KEY = 'overlay-dock:v1';
const OVERLAY_SIZE_KEY = 'overlay-size:v2';
const SCOREBOARD_COLUMNS_KEY = 'scoreboard-columns:v2';
const THEME_KEY = 'overlay-theme:v1';
const OVERLAY_PAGE_KEY = 'overlay-page:v1';
const LINEUP_OPEN_KEY = 'lineup-open:v2';
const SCOREBOARD_WIDTH_KEY = 'scoreboard-width:v1';
const GAME_ARCHIVE_PREFIX = 'games-archive:v1';
const ANALYTICS_DAY_INDEX_PREFIX = 'analytics-day:v1';
const BETS_STORAGE_KEY = 'bets:v2:all';
const LEGACY_BET_PREFIX = 'bets:';
const MLB_API_BASE = 'https://statsapi.mlb.com/api/v1';
const MLB_API_BASE_LIVE = 'https://statsapi.mlb.com/api/v1.1';
const REQUEST_TIMEOUT_MS = 9000;
const REQUEST_RETRY_COUNT = 2;
const PANEL_GAP = 8;
const PANEL_SNAP_THRESHOLD = 10;
const OVERLAY_RAIL_MIN = 420;
const OVERLAY_BAND_MIN = 220;
const DEFAULT_SCOREBOARD_WIDTH = 320;
const SCOREBOARD_MIN_WIDTH = 220;
const OVERLAY_DOCKS = ['right', 'left', 'top', 'bottom'];
const BET_PLAYER_SEARCH_MIN_CHARS = 3;
const BET_HIT_FIREWORK_DURATION_MS = 5000;
const LEADER_ROW_LIMIT = 10;
const RECENT_FORM_DAY_WINDOW = 7;
const MIN_HOT_HITTERS_PER_TEAM = 2;
const MIN_COLD_HITTERS_PER_TEAM = 2;
const MATCHUP_LOOKBACK_SEASONS = 4;
const SCOREBOARD_MARQUEE_DURATION_S = 8.5;

const BET_PROP_DEFS = {
  hit: { label: 'Hit', multiLabel: 'Hits', statKind: 'batting', statKey: 'hits', activeRole: 'batter' },
  double: { label: '2B', multiLabel: '2B', statKind: 'batting', statKey: 'doubles', activeRole: 'batter' },
  triple: { label: '3B', multiLabel: '3B', statKind: 'batting', statKey: 'triples', activeRole: 'batter' },
  hr: { label: 'HR', multiLabel: 'HR', statKind: 'batting', statKey: 'hr', activeRole: 'batter' },
  run: { label: 'R', multiLabel: 'Runs', statKind: 'batting', statKey: 'runs', activeRole: 'batter' },
  tb: { label: 'Total Bases', multiLabel: 'Total Bases', statKind: 'batting', statKey: 'tb', activeRole: 'batter' },
  xbh: { label: 'XBH', multiLabel: 'XBH', statKind: 'batting', statKey: 'xbh', activeRole: 'batter' },
  rbi: { label: 'RBI', multiLabel: 'RBI', statKind: 'batting', statKey: 'rbi', activeRole: 'batter' },
  k: { label: 'K', multiLabel: 'K', statKind: 'mixed', statKey: 'so', activeRole: 'player' },
};

const GOAL_TIMER_SEGMENTS = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'd', 'e', 'g'],
  '3': ['a', 'b', 'c', 'd', 'g'],
  '4': ['b', 'c', 'f', 'g'],
  '5': ['a', 'c', 'd', 'f', 'g'],
  '6': ['a', 'c', 'd', 'e', 'f', 'g'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
};

let currentOverlayDock = 'right';
let currentOverlayPage = 'scoreboard';
let currentOverlayWindowFullscreen = false;
let scoreboardWidthPreference = DEFAULT_SCOREBOARD_WIDTH;
let currentScoreboardColumns = 2;
let latestLeaderTeams = [];
let currentLeadersOpponentMode = false;
let leadersRenderSequence = 0;
let hotRenderSequence = 0;
const leadersSeasonCache = new Map();
const leadersTeamsCache = new Map();
const hotHitterRangeCache = new Map();
const lineupHotRecognitionCache = new Map();
const matchupHistoryCache = new Map();
const teamMatchupHistoryCache = new Map();
const playerCareerStartCache = new Map();
const betPlayerLastFiveCache = new Map();
const pitcherFireStreakCache = new Map();
const pitcherColdStreakCache = new Map();
const playerSeasonHomeRunCache = new Map();
const teamStreakCache = new Map();
const fireworkControllers = new WeakMap();
let latestMatchupExportData = null;
let activeMatchupLookupKey = '';

const THEMES = [
  { value: 'current', label: 'Current' },
  { value: 'baseball-retro', label: 'Baseball Retro' },
  { value: 'team-tone', label: 'Team Tone' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'dark-pastel', label: 'Dark Pastel' },
  { value: 'emerald-diamond', label: 'Emerald Diamond' },
  { value: 'black-ice', label: 'Black Ice' },
  { value: 'paper-scorebook', label: 'Paper Scorebook' },
];

const LEADER_SECTIONS = [
  {
    key: 'hitting',
    title: 'Batting Leaders',
    subtitle: 'Hits, average, power, and speed',
    categories: [
      { key: 'hits', label: 'Hits', valueType: 'count', group: 'hitting', sortStat: 'hits' },
      { key: 'battingAverage', label: 'AVG', valueType: 'avg', group: 'hitting', sortStat: 'avg' },
      { key: 'homeRuns', label: 'HR', valueType: 'count', group: 'hitting', sortStat: 'homeRuns' },
      { key: 'runsBattedIn', label: 'RBI', valueType: 'count', group: 'hitting', sortStat: 'rbi' },
      { key: 'onBasePlusSlugging', label: 'OPS', valueType: 'ops', group: 'hitting', sortStat: 'ops' },
      { key: 'stolenBases', label: 'SB', valueType: 'count', group: 'hitting', sortStat: 'stolenBases' },
    ],
  },
  {
    key: 'pitching',
    title: 'Pitching Leaders',
    subtitle: 'Run prevention and strikeout pace',
    categories: [
      { key: 'strikeOuts', label: 'K', valueType: 'count', group: 'pitching', sortStat: 'strikeOuts' },
      { key: 'earnedRunAverage', label: 'ERA', valueType: 'era', group: 'pitching', sortStat: 'era', sort: 'asc' },
      { key: 'walksAndHitsPerInningPitched', label: 'WHIP', valueType: 'whip', group: 'pitching', sortStat: 'whip', sort: 'asc' },
      { key: 'wins', label: 'Wins', valueType: 'count', group: 'pitching', sortStat: 'wins' },
      { key: 'saves', label: 'Saves', valueType: 'count', group: 'pitching', sortStat: 'saves' },
      { key: 'inningsPitched', label: 'IP', valueType: 'innings', group: 'pitching', sortStat: 'inningsPitched' },
    ],
  },
];

const TEAM_COLORS = {
  ARI: '#E3D4AD', ATL: '#CE1141', BAL: '#DF4601', BOS: '#BD3039', CHC: '#7FB8FF',
  CHW: '#E6EDF7', CIN: '#C6011F', CLE: '#E31937', COL: '#C4B6E2', DET: '#5DA9FF',
  HOU: '#EB6E1F', KC: '#7EC3FF', LAA: '#BA0021', LAD: '#4FA3FF', MIA: '#00A3E0',
  MIL: '#FFC52F', MIN: '#8AB8FF', NYM: '#4DA3FF', NYY: '#AFC8EF', ATH: '#4FD38E',
  PHI: '#E81828', PIT: '#FDB827', SD: '#C7A86A', SEA: '#4FD2BD', SF: '#FD5A1E',
  STL: '#C41E3A', TB: '#7EB3FF', TEX: '#5EA5FF', TOR: '#6DB4FF', WSH: '#AB0003'
};

const TEAM_LOGOS = {
  ARI: 'Diamondbacks.png', ATL: 'Braves.png', BAL: 'Orioles.png', BOS: 'RedSox.png', CHC: 'Cubs.png',
  CHW: 'WhiteSox.png', CIN: 'Reds.png', CLE: 'Guardians.png', COL: 'Rockies.png', DET: 'Tigers.png',
  HOU: 'Astros.png', KC: 'Royals.png', LAA: 'Angels.png', LAD: 'Dodgers.png', MIA: 'Marlins.png',
  MIL: 'Brewers.png', MIN: 'Twins.png', NYM: 'Mets.png', NYY: 'Yankees.png', ATH: 'Athletics.png',
  PHI: 'Phillies.png', PIT: 'Pirates.png', SD: 'Padres.png', SEA: 'Mariners.png', SF: 'Giants.png',
  STL: 'Cardinals.png', TB: 'Rays.png', TEX: 'Rangers.png', TOR: 'BlueJays.png', WSH: 'Nationals.png'
};

const TEAM_ABBREV_CANONICAL = {
  AZ: 'ARI',
  CWS: 'CHW',
};

const TEAM_ABBREV_DISPLAY = {
  ARI: 'AZ',
  CHW: 'CWS',
};

const formatDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function seasonForDate(date) {
  const year = Number(String(date || formatDate(new Date())).slice(0, 4));
  return Number.isFinite(year) ? year : new Date().getFullYear();
}

function normalizeOverlayPage(value) {
  return ['scoreboard', 'leaders', 'hot'].includes(value) ? value : 'scoreboard';
}

function listify(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function formatLeadersDateLabel(date) {
  const value = String(date || formatDate(new Date()));
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)));
}

function parseLocalDateValue(value) {
  const text = String(value || '').trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date();
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0);
}

function recentCalendarDateWindow(endDate = '', maxDays = RECENT_FORM_DAY_WINDOW) {
  const base = parseLocalDateValue(endDate || formatDate(new Date()));
  const totalDays = Math.max(1, Number(maxDays) || 1);
  const dates = [];
  for (let offset = totalDays - 1; offset >= 0; offset -= 1) {
    const day = new Date(base);
    day.setDate(base.getDate() - offset);
    dates.push(formatDate(day));
  }
  return dates;
}

function inningsToOuts(value) {
  if (value == null || value === '') return 0;
  const text = String(value).trim();
  const parts = text.split('.');
  const whole = Number(parts[0]);
  const fraction = Number(parts[1] || 0);
  if (!Number.isFinite(whole) || !Number.isFinite(fraction)) return 0;
  return (whole * 3) + fraction;
}

function outsToInnings(outs) {
  const total = Math.max(0, Math.floor(Number(outs) || 0));
  const whole = Math.floor(total / 3);
  const remainder = total % 3;
  return `${whole}.${remainder}`;
}

function formatRateValue(value, digits = 3, trimLeadingZero = true) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '---';
  const fixed = numeric.toFixed(digits);
  if (!trimLeadingZero) return fixed;
  return fixed.replace(/^0\./, '.').replace(/^-0\./, '-.');
}

function formatLeaderValue(value, valueType = 'count') {
  if (valueType === 'avg') return formatRateValue(value, 3, true);
  if (valueType === 'ops') return formatRateValue(value, 3, false);
  if (valueType === 'era' || valueType === 'whip') return formatRateValue(value, 2, false);
  if (valueType === 'innings') return outsToInnings(value);
  const numeric = Number(value);
  return Number.isFinite(numeric) ? String(Math.round(numeric)) : String(value || '0');
}

dateInput.value = formatDate(new Date());

function storageKey(prefix) {
  return `${prefix}:${dateInput.value || formatDate(new Date())}`;
}

function gameCacheKey() {
  return storageKey('games');
}

function archiveKey(date) {
  return `${GAME_ARCHIVE_PREFIX}:${date || formatDate(new Date())}`;
}

function getPanelLayouts() {
  return JSON.parse(localStorage.getItem(PANEL_LAYOUT_KEY) || '{}');
}

function savePanelLayouts(layouts) {
  try {
    localStorage.setItem(PANEL_LAYOUT_KEY, JSON.stringify(layouts));
  } catch {}
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function normalizeOverlayDock(value) {
  return OVERLAY_DOCKS.includes(value) ? value : 'right';
}

function titleCase(value) {
  return String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1);
}

function defaultColumnsForDock(dock = currentOverlayDock) {
  return dock === 'top' || dock === 'bottom' ? 7 : 2;
}

function columnsBoundsForDock(dock = currentOverlayDock) {
  return dock === 'top' || dock === 'bottom'
    ? { min: 3, max: 10 }
    : { min: 1, max: 4 };
}

function getScoreboardColumnsState() {
  const raw = JSON.parse(localStorage.getItem(SCOREBOARD_COLUMNS_KEY) || '{}');
  return typeof raw === 'object' && raw ? raw : {};
}

function saveScoreboardColumnsState(state) {
  try {
    localStorage.setItem(SCOREBOARD_COLUMNS_KEY, JSON.stringify(state || {}));
  } catch {}
}

function normalizeScoreboardColumns(value, dock = currentOverlayDock) {
  const bounds = columnsBoundsForDock(dock);
  const parsed = Number(value);
  const fallback = defaultColumnsForDock(dock);
  return clamp(Math.round(Number.isFinite(parsed) ? parsed : fallback), bounds.min, bounds.max);
}

function updateScoreboardColumnsButton() {
  if (!scoreboardColumnsBtnEl) return;
  scoreboardColumnsBtnEl.textContent = `Cells/Row: ${currentScoreboardColumns}`;
}

function getWorkspaceBounds(dock = currentOverlayDock) {
  const overlayRect = overlayEl.getBoundingClientRect();
  switch (dock) {
    case 'left':
      return { left: Math.min(window.innerWidth, overlayRect.right + PANEL_GAP), top: 0, right: window.innerWidth, bottom: window.innerHeight };
    case 'top':
      return { left: 0, top: Math.min(window.innerHeight, overlayRect.bottom + PANEL_GAP), right: window.innerWidth, bottom: window.innerHeight };
    case 'bottom':
      return { left: 0, top: 0, right: window.innerWidth, bottom: Math.max(0, overlayRect.top - PANEL_GAP) };
    case 'right':
    default:
      return { left: 0, top: 0, right: Math.max(0, overlayRect.left - PANEL_GAP), bottom: window.innerHeight };
  }
}

function getPanelSizeLimits(panel, workspace = getWorkspaceBounds()) {
  const styles = window.getComputedStyle(panel);
  const availableWidth = Math.max(1, workspace.right - workspace.left);
  const availableHeight = Math.max(1, workspace.bottom - workspace.top);
  const parsedMinWidth = Number.parseFloat(styles.minWidth);
  const parsedMinHeight = Number.parseFloat(styles.minHeight);
  const minWidth = Math.min(Number.isFinite(parsedMinWidth) ? parsedMinWidth : 180, availableWidth);
  const minHeight = Math.min(Number.isFinite(parsedMinHeight) ? parsedMinHeight : 180, availableHeight);
  return { minWidth, minHeight, maxWidth: availableWidth, maxHeight: availableHeight };
}

function getPanelBox(panel) {
  const rect = panel.getBoundingClientRect();
  return {
    left: panel.offsetLeft,
    top: panel.offsetTop,
    width: rect.width,
    height: rect.height,
  };
}

function applyPanelBox(panel, box) {
  panel.style.left = `${Math.round(box.left)}px`;
  panel.style.top = `${Math.round(box.top)}px`;
  panel.style.width = `${Math.round(box.width)}px`;
  panel.style.height = `${Math.round(box.height)}px`;
}

function normalizePanelBox(panel, box, workspace = getWorkspaceBounds(), options = {}) {
  const strictMin = Boolean(options.strictMin);
  const { minWidth, minHeight, maxWidth, maxHeight } = getPanelSizeLimits(panel, workspace);
  if (strictMin && (box.width < minWidth || box.height < minHeight)) return null;
  const width = clamp(box.width, minWidth, maxWidth);
  const height = clamp(box.height, minHeight, maxHeight);
  const left = clamp(box.left, workspace.left, workspace.right - width);
  const top = clamp(box.top, workspace.top, workspace.bottom - height);
  return { left, top, width, height };
}

function boxesOverlap(a, b, gap = PANEL_GAP) {
  return (
    a.left < b.left + b.width + gap &&
    a.left + a.width + gap > b.left &&
    a.top < b.top + b.height + gap &&
    a.top + a.height + gap > b.top
  );
}

function boxKey(box) {
  return [
    Math.round(box.left),
    Math.round(box.top),
    Math.round(box.width),
    Math.round(box.height),
  ].join(':');
}

function panelMoveScore(candidate, desired) {
  return Math.abs(candidate.left - desired.left) + Math.abs(candidate.top - desired.top);
}

function panelResizeScore(candidate, desired) {
  return (
    Math.abs(candidate.left - desired.left) +
    Math.abs(candidate.top - desired.top) +
    Math.abs(candidate.width - desired.width) * 2 +
    Math.abs(candidate.height - desired.height) * 2
  );
}

function getMovablePanels(exceptPanel = null) {
  return Array.from(document.querySelectorAll('.movable')).filter((panel) => panel !== exceptPanel);
}

function getStaticObstaclePanels() {
  return Array.from(document.querySelectorAll('.utility-panel')).filter((panel) => !panel.classList.contains('movable'));
}

function getObstacleBoxes(panels) {
  return panels.map((panel) => getPanelBox(panel));
}

function boxesAreSideBySide(a, b, gap = PANEL_GAP, tolerance = PANEL_SNAP_THRESHOLD) {
  const aRight = a.left + a.width;
  const bRight = b.left + b.width;
  return (
    Math.abs((aRight + gap) - b.left) <= tolerance
    || Math.abs((bRight + gap) - a.left) <= tolerance
  );
}

function snapPanelBoxToNeighbors(panel, candidate, obstacles = getObstacleBoxes(getMovablePanels(panel))) {
  if (!candidate) return candidate;
  const workspace = getWorkspaceBounds();
  let best = candidate;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let index = 0; index < obstacles.length; index += 1) {
    const obstacle = obstacles[index];
    if (!boxesAreSideBySide(candidate, obstacle)) continue;
    const heightDiff = Math.abs(candidate.height - obstacle.height);
    if (heightDiff > PANEL_SNAP_THRESHOLD) continue;

    const candidateBottom = candidate.top + candidate.height;
    const obstacleBottom = obstacle.top + obstacle.height;
    const topDiff = Math.abs(candidate.top - obstacle.top);
    const bottomDiff = Math.abs(candidateBottom - obstacleBottom);
    if (topDiff > PANEL_SNAP_THRESHOLD && bottomDiff > PANEL_SNAP_THRESHOLD) continue;

    const snapped = normalizePanelBox(panel, {
      ...candidate,
      top: obstacle.top,
      height: obstacle.height,
    }, workspace);
    if (!snapped) continue;

    const overlaps = obstacles.some((other, otherIndex) => otherIndex !== index && boxesOverlap(snapped, other));
    if (overlaps) continue;

    const score = Math.min(topDiff, bottomDiff) + heightDiff;
    if (score < bestScore) {
      best = snapped;
      bestScore = score;
    }
  }

  return best;
}

function findNearestFreeBox(panel, desiredBox, obstacles = getObstacleBoxes([...getStaticObstaclePanels(), ...getMovablePanels(panel)])) {
  const workspace = getWorkspaceBounds();
  const normalizedDesired = normalizePanelBox(panel, desiredBox, workspace);
  const queue = [normalizedDesired];
  const seen = new Set();
  let best = null;
  let bestScore = Number.POSITIVE_INFINITY;
  let iterations = 0;

  while (queue.length && iterations < 240) {
    iterations += 1;
    const candidate = normalizePanelBox(panel, queue.shift(), workspace);
    const key = boxKey(candidate);
    if (seen.has(key)) continue;
    seen.add(key);

    const overlaps = obstacles.filter((obstacle) => boxesOverlap(candidate, obstacle));
    if (!overlaps.length) {
      const score = panelMoveScore(candidate, normalizedDesired);
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
        if (score === 0) break;
      }
      continue;
    }

    for (const obstacle of overlaps) {
      queue.push({ ...candidate, left: obstacle.left - candidate.width - PANEL_GAP });
      queue.push({ ...candidate, left: obstacle.left + obstacle.width + PANEL_GAP });
      queue.push({ ...candidate, top: obstacle.top - candidate.height - PANEL_GAP });
      queue.push({ ...candidate, top: obstacle.top + obstacle.height + PANEL_GAP });
    }
  }

  return best;
}

function buildResizeCandidates(candidate, obstacle, dir) {
  const candidates = [];
  const right = candidate.left + candidate.width;
  const bottom = candidate.top + candidate.height;

  if (dir.includes('e')) {
    candidates.push({ ...candidate, width: obstacle.left - PANEL_GAP - candidate.left });
  }
  if (dir.includes('w')) {
    const nextLeft = obstacle.left + obstacle.width + PANEL_GAP;
    candidates.push({ ...candidate, left: nextLeft, width: right - nextLeft });
  }
  if (dir.includes('s')) {
    candidates.push({ ...candidate, height: obstacle.top - PANEL_GAP - candidate.top });
  }
  if (dir.includes('n')) {
    const nextTop = obstacle.top + obstacle.height + PANEL_GAP;
    candidates.push({ ...candidate, top: nextTop, height: bottom - nextTop });
  }

  return candidates;
}

function findNearestResizeBox(panel, desiredBox, dir, fallbackBox) {
  const workspace = getWorkspaceBounds();
  const normalizedDesired = normalizePanelBox(panel, desiredBox, workspace);
  const obstacles = getObstacleBoxes([...getStaticObstaclePanels(), ...getMovablePanels(panel)]);
  const queue = [{ box: normalizedDesired, isFallback: false }];
  if (fallbackBox) {
    const normalizedFallback = normalizePanelBox(panel, fallbackBox, workspace);
    if (normalizedFallback) queue.push({ box: normalizedFallback, isFallback: true });
  }
  const seen = new Set();
  let best = null;
  let bestScore = Number.POSITIVE_INFINITY;
  let iterations = 0;

  while (queue.length && iterations < 240) {
    iterations += 1;
    const { box: rawCandidate, isFallback } = queue.shift();
    const candidate = normalizePanelBox(panel, rawCandidate, workspace, { strictMin: !isFallback });
    if (!candidate) continue;
    const key = boxKey(candidate);
    if (seen.has(key)) continue;
    seen.add(key);

    const overlaps = obstacles.filter((obstacle) => boxesOverlap(candidate, obstacle));
    if (!overlaps.length) {
      const score = panelResizeScore(candidate, normalizedDesired);
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
        if (score === 0) break;
      }
      continue;
    }

    for (const obstacle of overlaps) {
      const nextCandidates = buildResizeCandidates(candidate, obstacle, dir);
      for (const nextCandidate of nextCandidates) {
        if (nextCandidate.width <= 0 || nextCandidate.height <= 0) continue;
        queue.push({ box: nextCandidate, isFallback: false });
      }
    }
  }

  return best || (fallbackBox ? normalizePanelBox(panel, fallbackBox, workspace) : null);
}

function constrainMovable(panel) {
  const resolved = normalizePanelBox(panel, getPanelBox(panel));
  if (!resolved) return;
  const snapped = snapPanelBoxToNeighbors(panel, resolved);
  applyPanelBox(panel, snapped || resolved);
}

function constrainMovablePosition(panel, desiredBox = getPanelBox(panel)) {
  const resolved = findNearestFreeBox(panel, desiredBox);
  if (!resolved) return;
  const snapped = snapPanelBoxToNeighbors(panel, resolved);
  applyPanelBox(panel, snapped || resolved);
}

function restorePanelLayout(panel) {
  const layout = getPanelLayouts()[panel.dataset.panel];
  if (!layout) return;
  if (Number.isFinite(layout.left)) panel.style.left = `${layout.left}px`;
  if (Number.isFinite(layout.top)) panel.style.top = `${layout.top}px`;
  if (Number.isFinite(layout.width)) panel.style.width = `${layout.width}px`;
  if (Number.isFinite(layout.height)) panel.style.height = `${layout.height}px`;
}

function persistPanelLayout(panel) {
  const layouts = getPanelLayouts();
  layouts[panel.dataset.panel] = {
    left: panel.offsetLeft,
    top: panel.offsetTop,
    width: Math.round(panel.getBoundingClientRect().width),
    height: Math.round(panel.getBoundingClientRect().height),
  };
  savePanelLayouts(layouts);
}

function resolveAllMovables() {
  const panels = getMovablePanels().sort((a, b) => (a.offsetTop - b.offsetTop) || (a.offsetLeft - b.offsetLeft));
  const placed = getObstacleBoxes(getStaticObstaclePanels());
  for (const panel of panels) {
    const desiredBox = getPanelBox(panel);
    const resolved = findNearestFreeBox(panel, desiredBox, placed);
    if (resolved) {
      const snapped = snapPanelBoxToNeighbors(panel, resolved, placed.filter((box) => !boxesOverlap(resolved, box, 0)));
      applyPanelBox(panel, snapped || resolved);
    }
    placed.push(getPanelBox(panel));
    persistPanelLayout(panel);
  }
}

function updateOverlayDockButton() {
  if (!overlayDockToggleBtnEl) return;
  overlayDockToggleBtnEl.textContent = `Scoreboard: ${titleCase(currentOverlayDock)}`;
}

function getOverlaySizeState() {
  const raw = JSON.parse(localStorage.getItem(OVERLAY_SIZE_KEY) || '{}');
  return {
    rail: Number.isFinite(Number(raw?.rail)) ? Number(raw.rail) : null,
    band: Number.isFinite(Number(raw?.band)) ? Number(raw.band) : null,
  };
}

function saveOverlaySizeState(state) {
  try {
    localStorage.setItem(OVERLAY_SIZE_KEY, JSON.stringify({
      rail: Number.isFinite(Number(state?.rail)) ? Math.round(Number(state.rail)) : null,
      band: Number.isFinite(Number(state?.band)) ? Math.round(Number(state.band)) : null,
    }));
  } catch {}
}

function overlayRailBounds() {
  return {
    min: Math.min(OVERLAY_RAIL_MIN, Math.max(OVERLAY_RAIL_MIN, window.innerWidth - 120)),
    max: Math.max(OVERLAY_RAIL_MIN, window.innerWidth - 80),
  };
}

function overlayBandBounds() {
  return {
    min: Math.min(OVERLAY_BAND_MIN, Math.max(OVERLAY_BAND_MIN, window.innerHeight - 120)),
    max: Math.max(OVERLAY_BAND_MIN, window.innerHeight - 40),
  };
}

function normalizeOverlayRailSize(value) {
  const bounds = overlayRailBounds();
  return clamp(Math.round(Number(value) || bounds.min), bounds.min, bounds.max);
}

function normalizeOverlayBandSize(value) {
  const bounds = overlayBandBounds();
  return clamp(Math.round(Number(value) || bounds.min), bounds.min, bounds.max);
}

function applyOverlaySize(state = {}, options = {}) {
  const computed = getComputedStyle(document.body);
  const currentRail = Number.parseFloat(computed.getPropertyValue('--overlay-rail-size')) || OVERLAY_RAIL_MIN;
  const currentBand = Number.parseFloat(computed.getPropertyValue('--overlay-band-size')) || OVERLAY_BAND_MIN;
  const rail = normalizeOverlayRailSize(state.rail ?? currentRail);
  const band = normalizeOverlayBandSize(state.band ?? currentBand);
  document.body.style.setProperty('--overlay-rail-size', `${rail}px`);
  document.body.style.setProperty('--overlay-band-size', `${band}px`);
  if (options.persist !== false) saveOverlaySizeState({ rail, band });
  if (options.resolvePanels !== false) resolveAllMovables();
  requestAnimationFrame(refreshAllScoreboardResponsiveLayout);
}

function applyScoreboardColumns(value, options = {}) {
  currentScoreboardColumns = normalizeScoreboardColumns(value, currentOverlayDock);
  document.documentElement.style.setProperty('--games-columns', String(currentScoreboardColumns));
  updateScoreboardColumnsButton();
  if (options.persist !== false) {
    const nextState = { ...getScoreboardColumnsState(), [currentOverlayDock]: currentScoreboardColumns };
    saveScoreboardColumnsState(nextState);
  }
  requestAnimationFrame(refreshAllScoreboardResponsiveLayout);
}

function initScoreboardColumnsControl() {
  applyScoreboardColumns(getScoreboardColumnsState()[currentOverlayDock] ?? defaultColumnsForDock(currentOverlayDock), { persist: false });
  if (!scoreboardColumnsBtnEl) return;
  scoreboardColumnsBtnEl.addEventListener('click', () => {
    const bounds = columnsBoundsForDock(currentOverlayDock);
    const next = currentScoreboardColumns >= bounds.max ? bounds.min : currentScoreboardColumns + 1;
    applyScoreboardColumns(next);
  });
}

function initOverlayResizeControl() {
  applyOverlaySize(getOverlaySizeState(), { persist: false, resolvePanels: false });
  if (!overlayResizeHandleEl) return;
  let action = null;

  overlayResizeHandleEl.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    action = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      rail: Number.parseFloat(getComputedStyle(document.body).getPropertyValue('--overlay-rail-size')) || OVERLAY_RAIL_MIN,
      band: Number.parseFloat(getComputedStyle(document.body).getPropertyValue('--overlay-band-size')) || OVERLAY_BAND_MIN,
      dock: currentOverlayDock,
    };
    document.body.classList.add('overlay-resizing');
    e.preventDefault();
    e.stopPropagation();
  });

  window.addEventListener('pointermove', (e) => {
    if (!action || e.pointerId !== action.pointerId) return;
    const deltaX = e.clientX - action.startX;
    const deltaY = e.clientY - action.startY;
    let rail = action.rail;
    let band = action.band;
    if (action.dock === 'right') rail = action.rail - deltaX;
    else if (action.dock === 'left') rail = action.rail + deltaX;
    else if (action.dock === 'top') band = action.band + deltaY;
    else if (action.dock === 'bottom') band = action.band - deltaY;
    applyOverlaySize({ rail, band }, { persist: false });
  });

  const endAction = (e) => {
    if (!action || (e.pointerId !== undefined && e.pointerId !== action.pointerId)) return;
    document.body.classList.remove('overlay-resizing');
    applyOverlaySize({
      rail: Number.parseFloat(getComputedStyle(document.body).getPropertyValue('--overlay-rail-size')) || action.rail,
      band: Number.parseFloat(getComputedStyle(document.body).getPropertyValue('--overlay-band-size')) || action.band,
    });
    action = null;
  };

  window.addEventListener('pointerup', endAction);
  window.addEventListener('pointercancel', endAction);
  window.addEventListener('resize', () => applyOverlaySize(getOverlaySizeState(), { persist: false }));
}

function applyOverlayDock(dockValue, options = {}) {
  const persist = options.persist !== false;
  const resolvePanels = options.resolvePanels !== false;
  currentOverlayDock = normalizeOverlayDock(dockValue);
  document.body.dataset.overlayDock = currentOverlayDock;
  if (persist) {
    try {
      localStorage.setItem(OVERLAY_DOCK_KEY, currentOverlayDock);
    } catch {}
  }
  updateOverlayDockButton();
  applyScoreboardColumns(getScoreboardColumnsState()[currentOverlayDock] ?? defaultColumnsForDock(currentOverlayDock), { persist: false });
  if (resolvePanels) resolveAllMovables();
  requestAnimationFrame(refreshAllScoreboardResponsiveLayout);
}

function initOverlayDockControl() {
  applyOverlayDock(localStorage.getItem(OVERLAY_DOCK_KEY) || 'right', { resolvePanels: false });
  if (!overlayDockToggleBtnEl) return;
  overlayDockToggleBtnEl.addEventListener('click', () => {
    const currentIndex = OVERLAY_DOCKS.indexOf(currentOverlayDock);
    const nextDock = OVERLAY_DOCKS[(currentIndex + 1) % OVERLAY_DOCKS.length];
    applyOverlayDock(nextDock);
  });
}

function initMovables() {
  for (const panel of document.querySelectorAll('.movable')) {
    const header = panel.querySelector('[data-drag-handle]');
    const resizeHandles = panel.querySelectorAll('[data-resize-handle]');
    let action = null;

    restorePanelLayout(panel);

    for (const handle of resizeHandles) {
      handle.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        const startBox = getPanelBox(panel);
        action = {
          type: 'resize',
          pointerId: e.pointerId,
          dir: handle.dataset.dir || 'se',
          startX: e.clientX,
          startY: e.clientY,
          left: startBox.left,
          top: startBox.top,
          width: startBox.width,
          height: startBox.height,
          lastBox: startBox,
        };
        e.preventDefault();
        e.stopPropagation();
      });
    }

    header.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (action) return;
      const startBox = getPanelBox(panel);
      action = {
        type: 'move',
        pointerId: e.pointerId,
        dx: e.clientX - startBox.left,
        dy: e.clientY - startBox.top,
        lastBox: startBox,
      };
      e.preventDefault();
    });

    window.addEventListener('pointermove', (e) => {
      if (!action || e.pointerId !== action.pointerId) return;

      if (action.type === 'move') {
        const nextBox = {
          ...getPanelBox(panel),
          left: e.clientX - action.dx,
          top: e.clientY - action.dy,
        };
        const resolvedBase = findNearestFreeBox(panel, nextBox) || action.lastBox;
        const resolved = snapPanelBoxToNeighbors(panel, resolvedBase);
        applyPanelBox(panel, resolved);
        action.lastBox = resolved;
      } else {
        const dx = e.clientX - action.startX;
        const dy = e.clientY - action.startY;

        let left = action.left;
        let top = action.top;
        let width = action.width;
        let height = action.height;

        if (action.dir.includes('e')) width = action.width + dx;
        if (action.dir.includes('s')) height = action.height + dy;
        if (action.dir.includes('w')) {
          width = action.width - dx;
          left = action.left + dx;
        }
        if (action.dir.includes('n')) {
          height = action.height - dy;
          top = action.top + dy;
        }

        const desiredBox = { left, top, width, height };
        const resolvedBase = findNearestResizeBox(panel, desiredBox, action.dir, action.lastBox) || action.lastBox;
        const resolved = snapPanelBoxToNeighbors(panel, resolvedBase);
        applyPanelBox(panel, resolved);
        action.lastBox = resolved;
      }
    });

    const endAction = (e) => {
      if (!action || (e.pointerId !== undefined && e.pointerId !== action.pointerId)) return;
      constrainMovable(panel);
      persistPanelLayout(panel);
      action = null;
    };

    window.addEventListener('pointerup', endAction);
    window.addEventListener('pointercancel', endAction);

    constrainMovable(panel);
  }

  window.addEventListener('resize', () => {
    for (const panel of document.querySelectorAll('.movable')) {
      constrainMovable(panel);
    }
    resolveAllMovables();
  });

  resolveAllMovables();
}

function oddsToPayout(oddsRaw, stake) {
  const odds = Number(oddsRaw);
  if (!Number.isFinite(odds) || odds === 0) return 0;
  const profit = odds > 0 ? (stake * odds) / 100 : (stake * 100) / Math.abs(odds);
  return stake + profit;
}

function normalizeStoredBet(bet) {
  if (!bet || typeof bet !== 'object') return null;
  const odds = String(bet?.odds || '').trim();
  const amount = Number(bet?.amount);
  const payout = Number(bet?.payout);
  const betDate = String(bet?.betDate || '').trim() || (dateInput.value || formatDate(new Date()));
  const normalizedAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const normalizedPayout = Number.isFinite(payout) && payout > 0
    ? payout
    : oddsToPayout(odds, normalizedAmount);
  return {
    ...bet,
    id: String(bet?.id || Date.now()),
    desc: String(bet?.desc || '').trim(),
    odds,
    amount: normalizedAmount,
    payout: Number.isFinite(normalizedPayout) && normalizedPayout > 0 ? normalizedPayout : 0,
    ts: Number.isFinite(Number(bet?.ts)) ? Number(bet.ts) : Date.now(),
    betDate,
    legs: Array.isArray(bet?.legs) ? bet.legs : [],
  };
}

let volatileBetCache = [];

function sanitizeStoredBets(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map(normalizeStoredBet)
    .filter((bet) => bet && bet.odds && bet.amount > 0 && bet.payout > 0)
    .sort((a, b) => Number(b?.ts || 0) - Number(a?.ts || 0));
}

function legacyBetKeys() {
  const keys = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || key === BETS_STORAGE_KEY) continue;
      if (!new RegExp(`^${LEGACY_BET_PREFIX}\\d{4}-\\d{2}-\\d{2}$`).test(key)) continue;
      keys.push(key);
    }
  } catch {}
  return keys.sort();
}

function getLegacyStoredBets() {
  const combined = [];
  for (const key of legacyBetKeys()) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(parsed)) combined.push(...parsed);
    } catch {}
  }
  return sanitizeStoredBets(combined);
}

function legacyBetsForDate(targetDate = dateInput.value || formatDate(new Date())) {
  return getLegacyStoredBets().filter((bet) => String(bet?.betDate || '') === String(targetDate));
}

function pruneBetStoragePressure(targetDate = dateInput.value || formatDate(new Date())) {
  const protectedDates = new Set([String(targetDate || formatDate(new Date()))]);
  const archiveKeys = [];
  const analyticsKeys = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || key === BETS_STORAGE_KEY) continue;
      if (key.startsWith(`${GAME_ARCHIVE_PREFIX}:`)) {
        const date = key.slice(`${GAME_ARCHIVE_PREFIX}:`.length);
        if (!protectedDates.has(date)) archiveKeys.push(key);
        continue;
      }
      if (key.startsWith(`${ANALYTICS_DAY_INDEX_PREFIX}:`)) {
        const date = key.slice(`${ANALYTICS_DAY_INDEX_PREFIX}:`.length);
        if (!protectedDates.has(date)) analyticsKeys.push(key);
      }
    }
    for (const key of analyticsKeys.sort()) localStorage.removeItem(key);
    for (const key of archiveKeys.sort()) localStorage.removeItem(key);
  } catch {}
}

function persistBetsToStorage(allBets, targetDate = dateInput.value || formatDate(new Date())) {
  const normalized = sanitizeStoredBets(allBets);
  const payload = JSON.stringify(normalized);
  try {
    localStorage.setItem(BETS_STORAGE_KEY, payload);
    for (const key of legacyBetKeys()) localStorage.removeItem(key);
    return true;
  } catch (error) {
    pruneBetStoragePressure(targetDate);
    try {
      localStorage.setItem(BETS_STORAGE_KEY, payload);
      for (const key of legacyBetKeys()) localStorage.removeItem(key);
      return true;
    } catch (retryError) {
      console.warn('Unable to persist bets to localStorage.', retryError || error);
      return false;
    }
  }
}

function getAllStoredBets() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BETS_STORAGE_KEY) || '[]');
    if (Array.isArray(parsed) && parsed.length) {
      const normalized = sanitizeStoredBets(parsed);
      volatileBetCache = normalized;
      return normalized;
    }
  } catch {}
  const legacy = getLegacyStoredBets();
  if (legacy.length) {
    volatileBetCache = legacy;
    return legacy;
  }
  return sanitizeStoredBets(volatileBetCache);
}

function getBets(targetDate = dateInput.value || formatDate(new Date())) {
  return getAllStoredBets().filter((bet) => String(bet?.betDate || '') === String(targetDate));
}

function saveBets(bets, targetDate = dateInput.value || formatDate(new Date())) {
  const normalizedTargetDate = String(targetDate || dateInput.value || formatDate(new Date()));
  const nextDayBets = (bets || [])
    .map((bet) => normalizeStoredBet({ ...bet, betDate: bet?.betDate || normalizedTargetDate }))
    .filter(Boolean);
  const merged = [
    ...nextDayBets,
    ...getAllStoredBets().filter((bet) => String(bet?.betDate || '') !== normalizedTargetDate),
  ]
    .sort((a, b) => Number(b?.ts || 0) - Number(a?.ts || 0));
  volatileBetCache = merged;
  persistBetsToStorage(merged, normalizedTargetDate);
}

function goalStateKey() {
  return storageKey('goal-state');
}

function defaultGoalState() {
  return {
    currentText: '',
    running: false,
    startedAt: null,
    elapsedMs: 0,
    completed: [],
  };
}

function getGoalState() {
  const raw = JSON.parse(localStorage.getItem(goalStateKey()) || 'null');
  if (!raw || typeof raw !== 'object') return defaultGoalState();
  return {
    currentText: String(raw.currentText || ''),
    running: Boolean(raw.running),
    startedAt: Number.isFinite(Number(raw.startedAt)) ? Number(raw.startedAt) : null,
    elapsedMs: Number.isFinite(Number(raw.elapsedMs)) ? Number(raw.elapsedMs) : 0,
    completed: Array.isArray(raw.completed) ? raw.completed : [],
  };
}

function saveGoalState(state) {
  try {
    localStorage.setItem(goalStateKey(), JSON.stringify({
      currentText: String(state?.currentText || ''),
      running: Boolean(state?.running),
      startedAt: Number.isFinite(Number(state?.startedAt)) ? Number(state.startedAt) : null,
      elapsedMs: Number.isFinite(Number(state?.elapsedMs)) ? Number(state.elapsedMs) : 0,
      completed: Array.isArray(state?.completed) ? state.completed.slice(0, 100) : [],
    }));
  } catch {}
}

function currentGoalElapsedMs(state) {
  const elapsed = Number(state?.elapsedMs) || 0;
  if (!state?.running || !Number.isFinite(Number(state?.startedAt))) return Math.max(0, elapsed);
  return Math.max(0, elapsed + (Date.now() - Number(state.startedAt)));
}

function formatGoalDuration(ms) {
  const totalMs = Math.max(0, Math.floor(Number(ms) || 0));
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${[hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')}`;
}

function createGoalTimerDigit(char) {
  if (char === ':' || char === '.') {
    const separator = document.createElement('span');
    separator.className = `goal-timer-separator goal-timer-separator-${char === ':' ? 'colon' : 'dot'}`;
    const dotCount = char === ':' ? 2 : 1;
    for (let index = 0; index < dotCount; index += 1) {
      const dot = document.createElement('span');
      dot.className = 'goal-timer-separator-dot';
      separator.appendChild(dot);
    }
    return separator;
  }

  const digit = document.createElement('span');
  digit.className = 'goal-timer-digit';
  const activeSegments = new Set(GOAL_TIMER_SEGMENTS[char] || []);
  for (const name of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
    const segment = document.createElement('span');
    segment.className = `goal-timer-segment goal-timer-segment-${name}`;
    if (activeSegments.has(name)) segment.classList.add('is-on');
    digit.appendChild(segment);
  }
  return digit;
}

function renderGoalTimerDisplay(value) {
  if (!goalTimerEl) return;
  const text = String(value || '00:00:00.00');
  if (goalTimerEl.dataset.renderValue === text) return;
  goalTimerEl.replaceChildren();
  for (const char of text) {
    goalTimerEl.appendChild(createGoalTimerDigit(char));
  }
  goalTimerEl.dataset.renderValue = text;
  goalTimerEl.setAttribute('aria-label', text);
}

function formatGoalTimeStamp(ts) {
  const value = Number(ts);
  if (!Number.isFinite(value)) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value));
}

function getCachedGames() {
  return dedupeGameCards(JSON.parse(localStorage.getItem(gameCacheKey()) || '[]')).map(sanitizeStoredGameCard);
}

function compactStoredGame(card) {
  if (!card) return card;
  return {
    ...card,
    playerLookup: {},
  };
}

function compactStoredGamesIfNeeded(list) {
  if (!Array.isArray(list)) return null;
  let changed = false;
  const compacted = list.map((card) => {
    const needsCompaction = card && card.playerLookup && Object.keys(card.playerLookup).length;
    if (needsCompaction) changed = true;
    return needsCompaction ? compactStoredGame(card) : card;
  });
  return changed ? compacted : null;
}

function compactExistingStorage() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key === gameCacheKey() || key.startsWith(`${GAME_ARCHIVE_PREFIX}:`)) keys.push(key);
    }
    for (const key of keys) {
      try {
        const raw = JSON.parse(localStorage.getItem(key) || '[]');
        const compacted = compactStoredGamesIfNeeded(raw);
        if (compacted) localStorage.setItem(key, JSON.stringify(compacted));
      } catch {}
    }
  } catch {}
}

function saveCachedGames(games) {
  try {
    localStorage.setItem(gameCacheKey(), JSON.stringify(dedupeGameCards(games).map(sanitizeStoredGameCard).map(compactStoredGame)));
  } catch {}
}

function getArchivedGames(date) {
  return dedupeGameCards(JSON.parse(localStorage.getItem(archiveKey(date)) || '[]'), date).map(sanitizeStoredGameCard);
}

function saveArchivedGames(date, games) {
  try {
    localStorage.setItem(archiveKey(date), JSON.stringify(dedupeGameCards(games, date).map(sanitizeStoredGameCard).map(compactStoredGame)));
  } catch {}
}

function analyticsDayKey(date) {
  return `${ANALYTICS_DAY_INDEX_PREFIX}:${date || formatDate(new Date())}`;
}

function emptyAnalyticsDayIndex(date) {
  return {
    date: date || formatDate(new Date()),
    updatedAt: Date.now(),
    players: {},
    matchups: {},
  };
}

function getAnalyticsDayIndex(date) {
  try {
    const raw = JSON.parse(localStorage.getItem(analyticsDayKey(date)) || 'null');
    return raw && typeof raw === 'object'
      ? {
        date: raw.date || date || formatDate(new Date()),
        updatedAt: Number(raw.updatedAt) || 0,
        players: raw.players && typeof raw.players === 'object' ? raw.players : {},
        matchups: raw.matchups && typeof raw.matchups === 'object' ? raw.matchups : {},
      }
      : emptyAnalyticsDayIndex(date);
  } catch {
    return emptyAnalyticsDayIndex(date);
  }
}

function saveAnalyticsDayIndex(date, payload) {
  try {
    localStorage.setItem(analyticsDayKey(date), JSON.stringify({
      date: date || formatDate(new Date()),
      updatedAt: Date.now(),
      players: payload?.players && typeof payload.players === 'object' ? payload.players : {},
      matchups: payload?.matchups && typeof payload.matchups === 'object' ? payload.matchups : {},
    }));
  } catch {}
}

function listIndexedAnalyticsDates(endDate = '') {
  const prefix = `${ANALYTICS_DAY_INDEX_PREFIX}:`;
  const dates = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(prefix)) continue;
      const date = key.slice(prefix.length);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      if (endDate && date > endDate) continue;
      dates.push(date);
    }
  } catch {}
  dates.sort();
  return dates;
}

function latestArchiveDate(excludeDate = '') {
  const prefix = `${GAME_ARCHIVE_PREFIX}:`;
  const dates = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(prefix)) continue;
    const date = key.slice(prefix.length);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (excludeDate && date === excludeDate) continue;
    dates.push(date);
  }
  dates.sort();
  return dates[dates.length - 1] || '';
}

function getOpenLineupGamePk() {
  return localStorage.getItem(storageKey(LINEUP_OPEN_KEY)) || '';
}

function saveOpenLineupGamePk(gamePk) {
  try {
    if (!gamePk) localStorage.removeItem(storageKey(LINEUP_OPEN_KEY));
    else localStorage.setItem(storageKey(LINEUP_OPEN_KEY), String(gamePk));
  } catch {}
}

function isLineupOpen(gamePk) {
  return String(getOpenLineupGamePk()) === String(gamePk);
}

function setLineupOpen(gamePk) {
  saveOpenLineupGamePk(gamePk);
}

function closeLineupOverlay() {
  saveOpenLineupGamePk('');
  lineupOverlayEl.hidden = true;
  lineupOverlayEl.classList.remove('open');
  activeLineupGame = null;
  closePlayerStatOverlay();
}

function populateThemeSelect() {
  themeSelectEl.replaceChildren();
  for (const theme of THEMES) {
    const option = document.createElement('option');
    option.value = theme.value;
    option.textContent = theme.label;
    themeSelectEl.appendChild(option);
  }
}

function applyTheme(themeValue) {
  const allowed = THEMES.find((theme) => theme.value === themeValue)?.value || 'current';
  document.body.dataset.theme = allowed;
  try {
    localStorage.setItem(THEME_KEY, allowed);
  } catch {}
  themeSelectEl.value = allowed;
  for (const card of gamesEl.querySelectorAll('.game-card')) {
    if (card._game) upsertCard(card._game);
  }
}

function initThemePicker() {
  populateThemeSelect();
  applyTheme(localStorage.getItem(THEME_KEY) || 'current');
  themeSelectEl.addEventListener('change', () => applyTheme(themeSelectEl.value));
}

function lastName(fullName) {
  if (!fullName) return '-';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '-';
  const suffixPattern = /^(?:jr\.?|sr\.?|ii|iii|iv|v|vi)$/i;
  const last = parts[parts.length - 1];
  if (parts.length >= 2 && suffixPattern.test(last)) {
    return `${parts[parts.length - 2]} ${last}`;
  }
  return last || '-';
}

function battingOrderValue(player) {
  const raw = player?.battingOrder;
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) return '-';
  return String(Math.floor(num / 100) || num);
}

function battingAverage(player) {
  return player?.batting?.avg || player?.stats?.batting?.avg || player?.seasonStats?.batting?.avg || '---';
}

function lineupAvgValue(source, fallback = '---') {
  const direct = cleanSummary(
    source?.avg
    || source?.batting?.avg
    || source?.stats?.batting?.avg
    || source?.seasonStats?.batting?.avg,
  );
  if (direct && direct !== '---') return direct;
  const batting = source?.batting || source?.stats?.batting || source || {};
  const atBats = statNumber(batting?.atBats);
  const hits = statNumber(batting?.hits);
  if (atBats > 0) return formatRateValue(hits / atBats, 3, true);
  return fallback;
}

function normalizeLineupTodayValue(value) {
  const text = cleanSummary(value);
  if (!text) return '0-0';
  const normalized = text.toLowerCase();
  if (
    normalized === '0 for 0'
    || normalized.includes('no pa yet')
    || normalized.includes('no plate appearance')
    || normalized.includes('awaiting first pitch')
  ) return '0-0';
  return text;
}

function handednessCode(value) {
  const text = cleanSummary(value).toUpperCase();
  if (!text || text === '-') return '';
  if (text === 'L' || text.startsWith('LEFT')) return 'L';
  if (text === 'R' || text.startsWith('RIGHT')) return 'R';
  if (text === 'S' || text.startsWith('SWITCH')) return 'S';
  return /^[LRS]$/.test(text) ? text : '';
}

function handednessHtml(value) {
  const code = handednessCode(value);
  return code ? `<span class="handedness-tag">(${code})</span>` : '';
}

function handednessSuffixText(value) {
  const code = handednessCode(value);
  return code ? ` (${code})` : '';
}

function playerProfileHasMeaningfulStats(profile) {
  if (!profile) return false;
  if (isPitcherProfile(profile)) {
    return [profile?.pitching?.era, profile?.pitching?.whip, profile?.pitching?.ip]
      .some((value) => {
        const text = cleanSummary(value);
        return text && text !== '---' && text !== '0.0';
      });
  }
  return [profile?.batting?.avg, profile?.batting?.obp, profile?.batting?.slg, profile?.batting?.ops]
    .some((value) => {
      const text = cleanSummary(value);
      return text && text !== '---';
    });
}

async function enrichFallbackLineupDisplay(game, side, lineup = []) {
  if (!game || !Array.isArray(lineup) || !lineup.length) return lineup;
  const enriched = await Promise.all(lineup.map(async (entry) => {
    const playerId = Number(entry?.id);
    const existing = findLineupEntryProfile(game, side, entry);
    if (!Number.isFinite(playerId) || playerId <= 0) {
      return normalizeLineupEntryForSide(game, side, { ...entry, today: normalizeLineupTodayValue(entry?.today) });
    }
    let profile = existing;
    if (!playerProfileHasMeaningfulStats(profile)) {
      const fetched = await fetchMlbPlayerProfile(playerId, game).catch(() => null);
      if (fetched) {
        profile = fetched;
        persistPlayerLookupForGame(game, { [String(playerId)]: fetched });
      }
    }
    return normalizeLineupEntryForSide(game, side, {
      ...entry,
      id: profile?.id ?? existing?.id ?? entry?.id ?? null,
      fullName: profile?.fullName || existing?.fullName || entry?.fullName || 'Unknown',
      position: profile?.position || existing?.position || entry?.position || '',
      bats: profile?.bats || existing?.bats || entry?.bats || '',
      throws: profile?.throws || existing?.throws || entry?.throws || '',
      avg: lineupAvgValue(profile || existing || entry, entry?.avg || '---'),
      today: normalizeLineupTodayValue(profile?.todayBatting || existing?.todayBatting || entry?.today),
    });
  }));
  return enriched;
}

function lineupSideTeamCode(game, side, entry = null) {
  const directTeam = side === 'away' ? game?.away : side === 'home' ? game?.home : '';
  return canonicalTeamAbbrev(directTeam || entry?.teamAbbrev || '');
}

function lineupNameKey(entry) {
  return normalizeNameKey(entry?.fullName || entry?.name || '');
}

function findLineupEntryProfile(game, side, entry) {
  if (!game?.playerLookup || !entry) return null;
  const playerId = Number(entry?.id);
  const teamCode = lineupSideTeamCode(game, side, entry);
  const lookup = game.playerLookup || {};
  const direct = Number.isFinite(playerId) && playerId > 0 ? lookup[String(playerId)] || null : null;
  if (direct) return direct;

  const entryKey = lineupNameKey(entry);
  if (!entryKey) return null;

  const matches = Object.values(lookup).filter((profile) => {
    if (!profile) return false;
    const profileTeam = canonicalTeamAbbrev(profile?.teamAbbrev || '');
    if (teamCode && profileTeam && profileTeam !== teamCode) return false;
    const profileKey = profile?.fullNameKey || normalizeNameKey(profile?.fullName || '');
    return profileKey === entryKey;
  });
  if (!matches.length) return null;
  if (matches.length === 1) return matches[0];

  const exactFullName = cleanSummary(entry?.fullName);
  if (exactFullName) {
    const exactMatch = matches.find((profile) => cleanSummary(profile?.fullName) === exactFullName);
    if (exactMatch) return exactMatch;
  }

  return matches.find((profile) => String(profile?.position || '').toUpperCase() !== 'P') || matches[0];
}

function normalizeLineupEntryForSide(game, side, entry, slot = null) {
  const resolvedSlot = slot ?? entry?.slot ?? null;
  const normalized = normalizedLineupEntry(entry, resolvedSlot);
  const profile = findLineupEntryProfile(game, side, entry);
  if (!profile) {
    return {
      ...normalized,
      isActive: Boolean(entry?.isActive) || Number(normalized?.id) === Number(game?.activeBatterId),
    };
  }
  return normalizedLineupEntry({
    ...entry,
    slot: resolvedSlot,
    id: profile?.id ?? entry?.id ?? null,
    name: lastName(profile?.fullName || entry?.fullName || entry?.name || 'Unknown'),
    fullName: profile?.fullName || entry?.fullName || entry?.name || 'Unknown',
    position: profile?.position || entry?.position || '',
    bats: profile?.bats || entry?.bats || '',
    throws: profile?.throws || entry?.throws || '',
    avg: lineupAvgValue(profile, entry?.avg || '---'),
    today: normalizeLineupTodayValue(profile?.todayBatting || entry?.today),
    isActive: Boolean(entry?.isActive) || Number(profile?.id) === Number(game?.activeBatterId),
  }, resolvedSlot);
}

function normalizeLineupCollectionForSide(game, side, lineup = []) {
  if (!Array.isArray(lineup) || !lineup.length) return [];
  return lineup.map((entry, index) => normalizeLineupEntryForSide(game, side, entry, index + 1));
}

function sanitizeStoredLineup(lineup) {
  const safe = lineup || { away: [], home: [], awayBench: [], homeBench: [] };
  const mapEntries = (entries) => Array.isArray(entries)
    ? entries.map((entry, index) => normalizedLineupEntry(entry, entry?.slot ?? (index + 1)))
    : [];
  return {
    away: mapEntries(safe.away),
    home: mapEntries(safe.home),
    awayBench: mapEntries(safe.awayBench),
    homeBench: mapEntries(safe.homeBench),
  };
}

function sanitizeStoredGameCard(card) {
  if (!card) return card;
  return {
    ...card,
    lineup: sanitizeStoredLineup(card.lineup),
  };
}

function cleanSummary(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeNameKey(value) {
  return cleanSummary(value)
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function statNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function statRate(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function totalBasesFromBatting(statLine = {}) {
  const hits = statNumber(statLine.hits);
  const doubles = statNumber(statLine.doubles);
  const triples = statNumber(statLine.triples);
  const homeRuns = statNumber(statLine.homeRuns ?? statLine.hr);
  const singles = Math.max(0, hits - doubles - triples - homeRuns);
  return singles + (doubles * 2) + (triples * 3) + (homeRuns * 4);
}

function buildPlayerAnalyticsEntry(player, gamePk) {
  return {
    playerId: Number(player?.id) || null,
    fullName: player?.fullName || 'Unknown',
    teamAbbrev: player?.teamAbbrev || '',
    teamColor: player?.teamColor || getTeamColor(player?.teamAbbrev || ''),
    teamLogo: player?.teamLogo || getLogoPath(player?.teamAbbrev || ''),
    position: player?.position || '',
    gamePk: gamePk || null,
    games: 0,
    batting: { hits: 0, atBats: 0, homeRuns: 0, rbi: 0, walks: 0, totalBases: 0, stolenBases: 0, strikeOuts: 0 },
    pitching: { outs: 0, strikeOuts: 0, walks: 0, hits: 0, earnedRuns: 0, wins: 0, saves: 0 },
  };
}

function mergePlayerIntoAnalyticsIndex(playersIndex, player, gamePk) {
  if (!player?.id) return;
  const key = String(player.id);
  const entry = playersIndex[key] || buildPlayerAnalyticsEntry(player, gamePk);
  entry.fullName = player.fullName || entry.fullName;
  entry.teamAbbrev = player.teamAbbrev || entry.teamAbbrev;
  entry.teamColor = player.teamColor || entry.teamColor;
  entry.teamLogo = player.teamLogo || entry.teamLogo;
  entry.position = player.position || entry.position;
  entry.gamePk = gamePk || entry.gamePk;
  entry.games += 1;
  entry.batting.hits += statNumber(player?.gameBatting?.hits);
  entry.batting.atBats += statNumber(player?.gameBatting?.atBats);
  entry.batting.homeRuns += statNumber(player?.gameBatting?.hr);
  entry.batting.rbi += statNumber(player?.gameBatting?.rbi);
  entry.batting.walks += statNumber(player?.gameBatting?.bb);
  entry.batting.totalBases += statNumber(player?.gameBatting?.tb);
  entry.batting.stolenBases += statNumber(player?.gameBatting?.sb);
  entry.batting.strikeOuts += statNumber(player?.gameBatting?.so);
  entry.pitching.outs += inningsToOuts(player?.gamePitching?.ip);
  entry.pitching.strikeOuts += statNumber(player?.gamePitching?.so);
  entry.pitching.walks += statNumber(player?.gamePitching?.bb);
  entry.pitching.hits += statNumber(player?.gamePitching?.hits);
  entry.pitching.earnedRuns += statNumber(player?.gamePitching?.earnedRuns);
  entry.pitching.wins += statNumber(player?.gamePitching?.wins);
  entry.pitching.saves += statNumber(player?.gamePitching?.saves);
  playersIndex[key] = entry;
}

function matchupIndexKey(batterId, pitcherId) {
  return `${Number(batterId) || 0}:${Number(pitcherId) || 0}`;
}

function buildMatchupAnalyticsEntry(play, game, playerLookup = {}) {
  const batterId = Number(play?.matchup?.batter?.id);
  const pitcherId = Number(play?.matchup?.pitcher?.id);
  if (!Number.isFinite(batterId) || batterId <= 0 || !Number.isFinite(pitcherId) || pitcherId <= 0) return null;
  const batter = playerLookup[String(batterId)] || {};
  const pitcher = playerLookup[String(pitcherId)] || {};
  return {
    batterId,
    pitcherId,
    batterName: play?.matchup?.batter?.fullName || batter.fullName || 'Unknown',
    pitcherName: play?.matchup?.pitcher?.fullName || pitcher.fullName || 'Unknown',
    batterTeam: batter.teamAbbrev || '',
    pitcherTeam: pitcher.teamAbbrev || '',
    gamePk: game?.gamePk || null,
    plateAppearances: 0,
    atBats: 0,
    hits: 0,
    doubles: 0,
    triples: 0,
    homeRuns: 0,
    rbi: 0,
    walks: 0,
    strikeOuts: 0,
    totalBases: 0,
  };
}

function mergePlayIntoMatchupIndex(matchupsIndex, play, game, playerLookup = {}) {
  if (!play?.about?.isComplete) return;
  const batterId = Number(play?.matchup?.batter?.id);
  const pitcherId = Number(play?.matchup?.pitcher?.id);
  if (!Number.isFinite(batterId) || batterId <= 0 || !Number.isFinite(pitcherId) || pitcherId <= 0) return;
  const key = matchupIndexKey(batterId, pitcherId);
  const entry = matchupsIndex[key] || buildMatchupAnalyticsEntry(play, game, playerLookup);
  if (!entry) return;
  const eventType = String(play?.result?.eventType || '').toLowerCase();
  const hitBases = eventType === 'single' ? 1
    : eventType === 'double' ? 2
      : eventType === 'triple' ? 3
        : eventType === 'home_run' ? 4
          : 0;
  const isWalk = eventType === 'walk' || eventType === 'intent_walk';
  const isHitByPitch = eventType === 'hit_by_pitch';
  const isSacrifice = eventType === 'sac_fly' || eventType === 'sac_bunt';
  entry.plateAppearances += 1;
  entry.hits += hitBases > 0 ? 1 : 0;
  entry.doubles += eventType === 'double' ? 1 : 0;
  entry.triples += eventType === 'triple' ? 1 : 0;
  entry.homeRuns += eventType === 'home_run' ? 1 : 0;
  entry.walks += isWalk || isHitByPitch ? 1 : 0;
  entry.strikeOuts += eventType.includes('strikeout') ? 1 : 0;
  entry.rbi += statNumber(play?.result?.rbi);
  entry.totalBases += hitBases;
  if (!isWalk && !isHitByPitch && !isSacrifice) entry.atBats += 1;
  matchupsIndex[key] = entry;
}

function buildDailyAnalyticsIndex(date, games = [], matchupEvents = []) {
  const index = emptyAnalyticsDayIndex(date);
  for (const game of games) {
    for (const player of Object.values(game?.playerLookup || {})) {
      mergePlayerIntoAnalyticsIndex(index.players, player, game?.gamePk || null);
    }
  }
  for (const event of matchupEvents) {
    mergePlayIntoMatchupIndex(index.matchups, event.play, event.game, event.playerLookup);
  }
  return index;
}

function recentHittingForm(entry) {
  const atBats = statNumber(entry?.batting?.atBats);
  if (atBats <= 0) return '';
  const hits = statNumber(entry?.batting?.hits);
  const walks = statNumber(entry?.batting?.walks);
  const totalBases = statNumber(entry?.batting?.totalBases);
  const obpDenominator = atBats + walks;
  const obp = obpDenominator > 0 ? (hits + walks) / obpDenominator : 0;
  const slg = totalBases / atBats;
  const games = Math.max(1, statNumber(entry?.games));
  return `Last ${games}G | AVG ${formatRateValue(hits / atBats, 3, true)} | OPS ${formatRateValue(obp + slg, 3, false)} | HR ${entry.batting.homeRuns} | RBI ${entry.batting.rbi}`;
}

function recentPitchingForm(entry) {
  const outs = statNumber(entry?.pitching?.outs);
  if (outs <= 0) return '';
  const hits = statNumber(entry?.pitching?.hits);
  const walks = statNumber(entry?.pitching?.walks);
  const earnedRuns = statNumber(entry?.pitching?.earnedRuns);
  const era = (earnedRuns * 27) / outs;
  const whip = ((hits + walks) * 3) / outs;
  const games = Math.max(1, statNumber(entry?.games));
  return `Last ${games}G | IP ${outsToInnings(outs)} | ERA ${formatRateValue(era, 2, false)} | WHIP ${formatRateValue(whip, 2, false)} | K ${entry.pitching.strikeOuts}`;
}

function getIndexedRecentAggregate(playerId, endDate = '', maxDays = RECENT_FORM_DAY_WINDOW) {
  const numericId = Number(playerId);
  if (!Number.isFinite(numericId) || numericId <= 0) return null;
  const recentDates = recentCalendarDateWindow(endDate || (dateInput.value || formatDate(new Date())), maxDays);
  if (!recentDates.length) return null;
  const aggregate = buildPlayerAnalyticsEntry({ id: numericId }, null);
  let found = false;
  for (const date of recentDates) {
    const dayIndex = getAnalyticsDayIndex(date);
    const entry = dayIndex?.players?.[String(numericId)];
    if (!entry) continue;
    found = true;
    aggregate.games += statNumber(entry.games);
    aggregate.batting.hits += statNumber(entry?.batting?.hits);
    aggregate.batting.atBats += statNumber(entry?.batting?.atBats);
    aggregate.batting.homeRuns += statNumber(entry?.batting?.homeRuns);
    aggregate.batting.rbi += statNumber(entry?.batting?.rbi);
    aggregate.batting.walks += statNumber(entry?.batting?.walks);
    aggregate.batting.totalBases += statNumber(entry?.batting?.totalBases);
    aggregate.pitching.outs += statNumber(entry?.pitching?.outs);
    aggregate.pitching.strikeOuts += statNumber(entry?.pitching?.strikeOuts);
    aggregate.pitching.walks += statNumber(entry?.pitching?.walks);
    aggregate.pitching.hits += statNumber(entry?.pitching?.hits);
    aggregate.pitching.earnedRuns += statNumber(entry?.pitching?.earnedRuns);
  }
  if (!found) return null;
  return aggregate;
}

function getIndexedRecentForm(playerId, group = 'hitting', endDate = '', maxDays = RECENT_FORM_DAY_WINDOW) {
  const aggregate = getIndexedRecentAggregate(playerId, endDate, maxDays);
  if (!aggregate) return '';
  return group === 'pitching' ? recentPitchingForm(aggregate) : recentHittingForm(aggregate);
}

function matchupHistoryHasSample(entry) {
  return Boolean(
    statNumber(entry?.plateAppearances)
    || statNumber(entry?.atBats)
    || statNumber(entry?.hits)
    || statNumber(entry?.walks)
    || statNumber(entry?.strikeOuts)
    || statNumber(entry?.homeRuns),
  );
}

function subtractMatchupHistoryEntry(target, delta) {
  if (!target || !delta) return target;
  const keys = ['plateAppearances', 'atBats', 'hits', 'doubles', 'triples', 'homeRuns', 'rbi', 'walks', 'strikeOuts', 'totalBases'];
  for (const key of keys) {
    target[key] = Math.max(0, statNumber(target[key]) - statNumber(delta[key]));
  }
  return target;
}

function indexedMatchupAdjustment(batterId, pitcherId, selectedDate = '') {
  const date = String(selectedDate || dateInput.value || formatDate(new Date()));
  const season = seasonForDate(date);
  const key = matchupIndexKey(batterId, pitcherId);
  const totals = {
    plateAppearances: 0,
    atBats: 0,
    hits: 0,
    doubles: 0,
    triples: 0,
    homeRuns: 0,
    rbi: 0,
    walks: 0,
    strikeOuts: 0,
    totalBases: 0,
  };
  let found = false;
  for (const indexedDate of listIndexedAnalyticsDates()) {
    if (indexedDate < date) continue;
    if (seasonForDate(indexedDate) !== season) continue;
    const matchup = getAnalyticsDayIndex(indexedDate)?.matchups?.[key];
    if (!matchupHistoryHasSample(matchup)) continue;
    found = true;
    totals.plateAppearances += statNumber(matchup?.plateAppearances);
    totals.atBats += statNumber(matchup?.atBats);
    totals.hits += statNumber(matchup?.hits);
    totals.doubles += statNumber(matchup?.doubles);
    totals.triples += statNumber(matchup?.triples);
    totals.homeRuns += statNumber(matchup?.homeRuns);
    totals.rbi += statNumber(matchup?.rbi);
    totals.walks += statNumber(matchup?.walks);
    totals.strikeOuts += statNumber(matchup?.strikeOuts);
    totals.totalBases += statNumber(matchup?.totalBases);
  }
  return found ? totals : null;
}

function battingTodaySummary(player) {
  const batting = player?.stats?.batting || {};
  const direct = cleanSummary(batting.summary || batting.note);
  if (direct) return direct;

  const atBats = statNumber(batting.atBats);
  const hits = statNumber(batting.hits);
  const doubles = statNumber(batting.doubles);
  const triples = statNumber(batting.triples);
  const homeRuns = statNumber(batting.homeRuns);
  const runs = statNumber(batting.runs);
  const rbi = statNumber(batting.rbi);
  const walks = statNumber(batting.baseOnBalls ?? batting.walks);

  const parts = [];
  if (atBats > 0 || hits > 0) parts.push(`${hits}-${atBats}`);
  if (doubles > 0) parts.push(`${doubles} 2B`);
  if (triples > 0) parts.push(`${triples} 3B`);
  if (homeRuns > 0) parts.push(`${homeRuns} HR`);
  if (runs > 0) parts.push(`${runs} R`);
  if (rbi > 0) parts.push(`${rbi} RBI`);
  if (walks > 0) parts.push(`${walks} BB`);
  return parts.join(' ') || '0-0';
}

function pitcherEra(player) {
  return player?.pitching?.era || player?.stats?.pitching?.era || player?.seasonStats?.pitching?.era || '---';
}

function pitcherWhip(player) {
  return player?.pitching?.whip || player?.stats?.pitching?.whip || player?.seasonStats?.pitching?.whip || '---';
}

function pitcherInningsPitched(player) {
  return cleanSummary(
    player?.pitching?.ip
    || player?.seasonStats?.pitching?.inningsPitched
    || player?.stats?.pitching?.inningsPitched,
  ) || '0.0';
}

function pitcherHomeRunsAllowed(player) {
  return statNumber(
    player?.pitching?.hrAllowed
    ?? player?.pitching?.homeRuns
    ?? player?.hrAllowed
    ?? player?.homeRuns
    ?? player?.seasonStats?.pitching?.homeRuns
    ?? player?.stats?.pitching?.homeRuns,
  );
}

function pitcherGamesStarted(player) {
  return statNumber(
    player?.pitching?.gamesStarted
    ?? player?.seasonStats?.pitching?.gamesStarted
    ?? player?.stats?.pitching?.gamesStarted
    ?? player?.gamesStarted,
  );
}

function pitcherGamesPlayed(player) {
  return statNumber(
    player?.pitching?.gamesPlayed
    ?? player?.seasonStats?.pitching?.gamesPlayed
    ?? player?.stats?.pitching?.gamesPlayed
    ?? player?.gamesPlayed,
  );
}

function pitcherGamesFinished(player) {
  return statNumber(
    player?.pitching?.gamesFinished
    ?? player?.seasonStats?.pitching?.gamesFinished
    ?? player?.stats?.pitching?.gamesFinished
    ?? player?.gamesFinished,
  );
}

function pitcherSaveCount(player) {
  return statNumber(
    player?.pitching?.saves
    ?? player?.seasonStats?.pitching?.saves
    ?? player?.stats?.pitching?.saves
    ?? player?.saves,
  );
}

function pitcherStrikeoutCount(player) {
  return statNumber(
    player?.pitching?.so
    ?? player?.pitching?.strikeOuts
    ?? player?.seasonStats?.pitching?.strikeOuts
    ?? player?.stats?.pitching?.strikeOuts
    ?? player?.so,
  );
}

function isStarterLikePitcher(player) {
  const gs = pitcherGamesStarted(player);
  const gp = Math.max(gs, pitcherGamesPlayed(player));
  if (gs <= 0) return false;
  return gs >= (gp / 2) || gs >= 3;
}

function hasPitcherHomeRunsAllowedData(player) {
  return Boolean(
    player
    && (
      Object.prototype.hasOwnProperty.call(player?.pitching || {}, 'hrAllowed')
      || Object.prototype.hasOwnProperty.call(player?.pitching || {}, 'homeRuns')
      || Object.prototype.hasOwnProperty.call(player || {}, 'hrAllowed')
      || Object.prototype.hasOwnProperty.call(player || {}, 'homeRuns')
      || Object.prototype.hasOwnProperty.call(player?.seasonStats?.pitching || {}, 'homeRuns')
      || Object.prototype.hasOwnProperty.call(player?.stats?.pitching || {}, 'homeRuns')
    )
  );
}

function pitcherTodaySummary(player) {
  const pitching = player?.stats?.pitching || {};
  const direct = cleanSummary(pitching.summary || pitching.note);
  if (direct) return direct;

  const inningsPitched = cleanSummary(pitching.inningsPitched);
  const hits = statNumber(pitching.hits);
  const earnedRuns = statNumber(pitching.earnedRuns);
  const walks = statNumber(pitching.baseOnBalls ?? pitching.walks);
  const strikeOuts = statNumber(pitching.strikeOuts);

  const parts = [];
  if (inningsPitched) parts.push(`${inningsPitched} IP`);
  if (hits > 0 || inningsPitched) parts.push(`${hits} H`);
  if (earnedRuns > 0 || inningsPitched) parts.push(`${earnedRuns} ER`);
  if (walks > 0 || inningsPitched) parts.push(`${walks} BB`);
  if (strikeOuts > 0 || inningsPitched) parts.push(`${strikeOuts} K`);
  return parts.join(' ') || 'Unused today';
}

function pitchCount(player) {
  const count = player?.stats?.pitching?.numberOfPitches;
  if (Number.isFinite(count)) return count;
  const fallback = player?.stats?.pitching?.pitchesThrown;
  return Number.isFinite(fallback) ? fallback : 0;
}

function playerHeadshotUrl(playerId) {
  const id = Number(playerId);
  if (!Number.isFinite(id)) return 'placeholder.png';
  return `https://img.mlbstatic.com/mlb-photos/image/upload/w_106,q_auto:good/v1/people/${id}/headshot/67/current`;
}

function statCardBadgeDataUri(teamAbbrev = 'MLB', teamColor = '#224b7a') {
  const safe = encodeURIComponent(displayTeamAbbrev(teamAbbrev).slice(0, 4));
  const color = String(teamColor || '#224b7a').replace(/"/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="212" height="260" viewBox="0 0 212 260"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#0e1628"/></linearGradient></defs><rect width="212" height="260" rx="10" fill="url(#g)"/><text x="106" y="140" font-family="Arial, sans-serif" font-size="46" fill="#ffffff" text-anchor="middle" font-weight="700">${safe}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function loadStatCardImage(imgEl, sources = []) {
  if (!imgEl) return;
  const queue = sources.filter(Boolean);
  const next = () => {
    if (!queue.length) return;
    const src = queue.shift();
    imgEl.onerror = next;
    imgEl.src = src;
  };
  next();
}

function ageFromBirthDate(birthDate) {
  if (!birthDate) return '-';
  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) return '-';
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDelta = now.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age >= 0 ? age : '-';
}

function buildPlayerLookup(players, gamePlayers, teamAbbrev, teamColor, teamLogo) {
  const lookup = {};
  for (const player of Object.values(players || {})) {
    const id = Number(player?.person?.id);
    if (!Number.isFinite(id)) continue;
    const gameBio = gamePlayers?.[`ID${id}`] || {};
    const gameBatting = player?.stats?.batting || {};
    const gamePitching = player?.stats?.pitching || {};
    const batting = player?.seasonStats?.batting || {};
    const pitching = player?.seasonStats?.pitching || {};
    const fielding = player?.seasonStats?.fielding || {};
    const position = shortPosition(player) || gameBio?.primaryPosition?.abbreviation || '-';
    const bats = gameBio?.batSide?.code || gameBio?.batSide?.description || '-';
    const throws = gameBio?.pitchHand?.code || gameBio?.pitchHand?.description || '-';
    const birthPlace = [gameBio?.birthCity, gameBio?.birthStateProvince || gameBio?.birthCountry].filter(Boolean).join(', ') || '-';

    lookup[String(id)] = {
      id,
      fullName: player?.person?.fullName || gameBio?.fullName || 'Unknown',
      fullNameKey: normalizeNameKey(player?.person?.fullName || gameBio?.fullName || 'Unknown'),
      jersey: player?.jerseyNumber || gameBio?.primaryNumber || '?',
      teamAbbrev,
      teamColor,
      teamLogo,
      position,
      bats,
      throws,
      age: ageFromBirthDate(gameBio?.birthDate),
      birthPlace,
      height: gameBio?.height || '-',
      weight: gameBio?.weight || '-',
      headshot: playerHeadshotUrl(id),
      todayBatting: battingTodaySummary(player),
      todayPitching: pitcherTodaySummary(player),
      gameBatting: {
        hr: statNumber(gameBatting.homeRuns),
        doubles: statNumber(gameBatting.doubles),
        triples: statNumber(gameBatting.triples),
        runs: statNumber(gameBatting.runs),
        rbi: statNumber(gameBatting.rbi),
        hits: statNumber(gameBatting.hits),
        tb: totalBasesFromBatting(gameBatting),
        atBats: statNumber(gameBatting.atBats),
        bb: statNumber(gameBatting.baseOnBalls ?? gameBatting.walks),
        so: statNumber(gameBatting.strikeOuts),
        sb: statNumber(gameBatting.stolenBases),
        cs: statNumber(gameBatting.caughtStealing),
      },
      gamePitching: {
        ip: cleanSummary(gamePitching.inningsPitched) || '0.0',
        so: statNumber(gamePitching.strikeOuts),
        bb: statNumber(gamePitching.baseOnBalls ?? gamePitching.walks),
        hits: statNumber(gamePitching.hits),
        earnedRuns: statNumber(gamePitching.earnedRuns),
        gamesStarted: statNumber(gamePitching.gamesStarted),
        gamesPlayed: statNumber(gamePitching.gamesPlayed),
        gamesFinished: statNumber(gamePitching.gamesFinished),
        wins: statNumber(gamePitching.wins),
        saves: statNumber(gamePitching.saves),
        hrAllowed: statNumber(gamePitching.homeRuns),
      },
      batting: {
        avg: batting.avg || '---',
        obp: batting.obp || '---',
        slg: batting.slg || '---',
        ops: batting.ops || '---',
        hr: statNumber(batting.homeRuns),
        doubles: statNumber(batting.doubles),
        triples: statNumber(batting.triples),
        runs: statNumber(batting.runs),
        rbi: statNumber(batting.rbi),
        hits: statNumber(batting.hits),
        tb: statNumber(batting.totalBases) || totalBasesFromBatting(batting),
        atBats: statNumber(batting.atBats),
        bb: statNumber(batting.baseOnBalls ?? batting.walks),
        so: statNumber(batting.strikeOuts),
        sb: statNumber(batting.stolenBases),
        cs: statNumber(batting.caughtStealing),
      },
      fielding: {
        pct: fielding.fielding || fielding.fieldingPercentage || '---',
        errors: statNumber(fielding.errors),
        assists: statNumber(fielding.assists),
        putOuts: statNumber(fielding.putOuts),
        innings: cleanSummary(fielding.innings) || cleanSummary(fielding.inningsPlayed) || '-',
      },
      pitching: {
        era: pitching.era || '---',
        whip: pitching.whip || '---',
        gamesStarted: statNumber(pitching.gamesStarted),
        gamesPlayed: statNumber(pitching.gamesPlayed),
        gamesFinished: statNumber(pitching.gamesFinished),
        wins: statNumber(pitching.wins),
        losses: statNumber(pitching.losses),
        saves: statNumber(pitching.saves),
        ip: cleanSummary(pitching.inningsPitched) || '0.0',
        so: statNumber(pitching.strikeOuts),
        bb: statNumber(pitching.baseOnBalls ?? pitching.walks),
        hrAllowed: statNumber(pitching.homeRuns),
      },
    };
  }
  return lookup;
}

function formatPitcherLine(player, fallbackName) {
  const name = lastName(player?.person?.fullName || fallbackName);
  const pitches = pitchCount(player);
  const ks = statNumber(player?.stats?.pitching?.strikeOuts);
  return `${name} ${pitches}P ${ks}K`;
}

function formatBatterLine(player, fallbackName) {
  const name = lastName(player?.person?.fullName || fallbackName);
  const batting = player?.stats?.batting || {};
  const hits = statNumber(batting.hits);
  const atBats = statNumber(batting.atBats);
  const avg = battingAverage(player);
  return `${name} (${hits}-${atBats}) AVG ${avg}`;
}

function canonicalTeamAbbrev(abbrev) {
  const normalized = String(abbrev || '').trim().toUpperCase();
  return TEAM_ABBREV_CANONICAL[normalized] || normalized;
}

function displayTeamAbbrev(abbrev) {
  const canonical = canonicalTeamAbbrev(abbrev);
  return TEAM_ABBREV_DISPLAY[canonical] || canonical;
}

function sameTeamAbbrev(left, right) {
  const a = canonicalTeamAbbrev(left);
  const b = canonicalTeamAbbrev(right);
  return Boolean(a) && Boolean(b) && a === b;
}

function formatTeamRecord(teamNode) {
  const record = teamNode?.leagueRecord || teamNode?.record || null;
  const wins = Number(record?.wins);
  const losses = Number(record?.losses);
  if (!Number.isFinite(wins) || !Number.isFinite(losses)) return '';
  return `${wins}-${losses}`;
}

function normalizeTeamStreak(value) {
  const code = String(value || '').trim().toUpperCase().replace(/\s+/g, '');
  return /^[WL]\d+$/.test(code) ? code : '';
}

function formatTeamStreakFromNode(node) {
  const streak = node?.streak || node?.record?.streak || node?.leagueRecord?.streak || null;
  const direct = normalizeTeamStreak(streak?.streakCode || streak?.code || node?.streakCode);
  if (direct) return direct;

  const number = Number(streak?.streakNumber ?? streak?.number ?? node?.streakNumber);
  const type = String(streak?.streakType || streak?.type || node?.streakType || '').toLowerCase();
  if (!Number.isFinite(number) || number <= 0) return '';
  if (type.startsWith('win')) return `W${number}`;
  if (type.startsWith('loss') || type.startsWith('los')) return `L${number}`;
  return '';
}

function teamStreakKey(team) {
  const id = Number(team?.id || team?.team?.id);
  if (Number.isFinite(id) && id > 0) return `id:${id}`;
  const abbrev = canonicalTeamAbbrev(team?.abbreviation || team?.team?.abbreviation || team?.team?.teamCode || '');
  return abbrev ? `abbr:${abbrev}` : '';
}

function rememberTeamStreak(map, team, streak) {
  const clean = normalizeTeamStreak(streak);
  if (!clean || !team) return;
  const id = Number(team?.id || team?.team?.id);
  if (Number.isFinite(id) && id > 0) map.set(`id:${id}`, clean);
  const abbrev = canonicalTeamAbbrev(team?.abbreviation || team?.team?.abbreviation || team?.team?.teamCode || team?.teamCode || team?.fileCode || '');
  if (abbrev) map.set(`abbr:${abbrev}`, clean);
}

async function getTeamStreakMap(date) {
  const selectedDate = String(date || dateInput.value || formatDate(new Date()));
  const season = seasonForDate(selectedDate);
  const cacheKey = `${season}:${selectedDate}`;
  if (teamStreakCache.has(cacheKey)) return teamStreakCache.get(cacheKey);

  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/standings`);
    url.searchParams.set('leagueId', '103,104');
    url.searchParams.set('season', String(season));
    url.searchParams.set('standingsTypes', 'regularSeason');
    url.searchParams.set('date', selectedDate);
    const response = await getJson(url.toString());
    const map = new Map();
    for (const record of listify(response?.records)) {
      for (const teamRecord of listify(record?.teamRecords)) {
        rememberTeamStreak(map, teamRecord?.team, formatTeamStreakFromNode(teamRecord));
      }
    }
    return map;
  })().catch((error) => {
    teamStreakCache.delete(cacheKey);
    throw error;
  });
  teamStreakCache.set(cacheKey, promise);
  return promise;
}

function teamStreakForGameTeam(streakMap, gameTeamNode, liveTeamNode, abbrev) {
  const nodeStreak = formatTeamStreakFromNode(gameTeamNode) || formatTeamStreakFromNode(liveTeamNode);
  if (nodeStreak) return nodeStreak;
  const byGameTeam = streakMap?.get?.(teamStreakKey(gameTeamNode?.team || gameTeamNode));
  if (byGameTeam) return byGameTeam;
  const byLiveTeam = streakMap?.get?.(teamStreakKey(liveTeamNode));
  if (byLiveTeam) return byLiveTeam;
  const byAbbrev = streakMap?.get?.(`abbr:${canonicalTeamAbbrev(abbrev)}`);
  return byAbbrev || '';
}

function renderTeamStreakBadge(el, streak) {
  if (!el) return;
  const clean = normalizeTeamStreak(streak);
  el.textContent = clean;
  el.hidden = !clean;
  el.classList.toggle('is-win-streak', clean.startsWith('W'));
  el.classList.toggle('is-loss-streak', clean.startsWith('L'));
}

function getTeamColor(abbrev) {
  return TEAM_COLORS[canonicalTeamAbbrev(abbrev)] || '#DDE9FF';
}

function getLogoPath(abbrev) {
  const canonical = canonicalTeamAbbrev(abbrev);
  return TEAM_LOGOS[canonical] ? `Logos/${TEAM_LOGOS[canonical]}` : 'placeholder.png';
}

function gameMatchKey(away, home) {
  return `${away}@${home}`;
}

function calendarDateOnly(value, fallback = '') {
  const text = String(value || fallback || '').trim();
  if (!text) return '';
  const iso = text.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return '';
  return formatDate(parsed);
}

function normalizedGameNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function gameCardInstanceKey(card, fallbackDate = '') {
  const away = String(card?.away || '').toUpperCase();
  const home = String(card?.home || '').toUpperCase();
  const date = calendarDateOnly(card?.officialDate || card?.gameDate || fallbackDate);
  const gameNumber = normalizedGameNumber(card?.gameNumber) || 1;
  if (!away || !home || !date || !gameNumber) return '';
  return `${away}@${home}|${date}|${gameNumber}`;
}

function dedupeGameCards(cards = [], fallbackDate = '') {
  const byPk = [];
  const pkIndex = new Map();
  for (const rawCard of Array.isArray(cards) ? cards : []) {
    const card = rawCard || null;
    if (!card) continue;
    const pk = String(card?.gamePk || '');
    if (pk && pkIndex.has(pk)) {
      const index = pkIndex.get(pk);
      byPk[index] = chooseBestGameCard(byPk[index], card);
      continue;
    }
    if (pk) pkIndex.set(pk, byPk.length);
    byPk.push(card);
  }

  const deduped = [];
  const instanceIndex = new Map();
  for (const card of byPk) {
    const instanceKey = gameCardInstanceKey(card, fallbackDate);
    if (instanceKey && instanceIndex.has(instanceKey)) {
      const index = instanceIndex.get(instanceKey);
      deduped[index] = chooseBestGameCard(deduped[index], card);
      continue;
    }
    if (instanceKey) instanceIndex.set(instanceKey, deduped.length);
    deduped.push(card);
  }
  return deduped;
}

function estTime(gameDate) {
  const dt = new Date(gameDate);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(dt);
}

async function getJson(url) {
  const urls = Array.isArray(url) ? url.filter(Boolean) : [url];
  if (!urls.length) throw new Error('No URL provided');
  let lastError = new Error('Request failed');
  for (const target of urls) {
    for (let attempt = 0; attempt < REQUEST_RETRY_COUNT; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const noCacheUrl = new URL(target);
        noCacheUrl.searchParams.set('_ts', `${Date.now()}`);
        const r = await fetch(noCacheUrl.toString(), { signal: controller.signal, cache: 'no-store' });
        if (!r.ok) throw new Error(`Request failed ${r.status}`);
        clearTimeout(timeout);
        return await r.json();
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;
      }
    }
  }
  throw lastError;
}

async function getSchedule(date) {
  const scheduleUrl = new URL(`${MLB_API_BASE}/schedule`);
  scheduleUrl.searchParams.set('sportId', '1');
  scheduleUrl.searchParams.set('date', date);
  scheduleUrl.searchParams.set('gameTypes', 'S,E,R');
  return getJson(scheduleUrl.toString());
}

async function getTeamsForSeason(season) {
  const key = String(seasonForDate(season));
  if (leadersTeamsCache.has(key)) return leadersTeamsCache.get(key);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/teams`);
    url.searchParams.set('sportId', '1');
    url.searchParams.set('season', key);
    const response = await getJson(url.toString());
    return listify(response?.teams)
      .map((team) => ({
        id: Number(team?.id),
        abbreviation: String(team?.abbreviation || team?.fileCode || '').toUpperCase(),
        name: team?.name || team?.teamName || team?.clubName || 'Unknown Team',
      }))
      .filter((team) => Number.isFinite(team.id) && team.abbreviation)
      .sort((a, b) => String(a.abbreviation).localeCompare(String(b.abbreviation)));
  })().catch((error) => {
    leadersTeamsCache.delete(key);
    throw error;
  });
  leadersTeamsCache.set(key, promise);
  return promise;
}

function seasonLeaderNumericValue(category, stat = {}) {
  const atBats = statNumber(stat.atBats);
  const hits = statNumber(stat.hits);
  const walks = statNumber(stat.baseOnBalls ?? stat.walks);
  const hitByPitch = statNumber(stat.hitByPitch);
  const sacFlies = statNumber(stat.sacFlies);
  const totalBases = statNumber(stat.totalBases) || totalBasesFromBatting(stat);
  switch (category.key) {
    case 'hits': return statNumber(stat.hits);
    case 'battingAverage':
      return statRate(stat.avg)
        ?? statRate(stat.battingAverage)
        ?? (atBats > 0 ? hits / atBats : null);
    case 'homeRuns': return statNumber(stat.homeRuns);
    case 'runsBattedIn': return statNumber(stat.rbi);
    case 'onBasePlusSlugging': {
      const directOps = statRate(stat.ops) ?? statRate(stat.onBasePlusSlugging);
      if (directOps != null) return directOps;
      const directObp = statRate(stat.obp) ?? statRate(stat.onBasePercentage);
      const directSlg = statRate(stat.slg) ?? statRate(stat.sluggingPercentage);
      if (directObp != null && directSlg != null) return directObp + directSlg;
      if (atBats <= 0) return null;
      const obpDenominator = atBats + walks + hitByPitch + sacFlies;
      const obp = obpDenominator > 0 ? (hits + walks + hitByPitch) / obpDenominator : 0;
      const slg = totalBases / atBats;
      return obp + slg;
    }
    case 'stolenBases': return statNumber(stat.stolenBases);
    case 'strikeOuts': return statNumber(stat.strikeOuts);
    case 'earnedRunAverage': return statRate(stat.era);
    case 'walksAndHitsPerInningPitched': return statRate(stat.whip);
    case 'wins': return statNumber(stat.wins);
    case 'saves': return statNumber(stat.saves);
    case 'inningsPitched': return inningsToOuts(stat.inningsPitched);
    default: return null;
  }
}

function passesSeasonLeaderQualifier(category, stat = {}, scope = 'league') {
  const atBats = statNumber(stat.atBats);
  const walks = statNumber(stat.baseOnBalls ?? stat.walks);
  const outs = inningsToOuts(stat.inningsPitched);
  if (category.key === 'battingAverage' || category.key === 'onBasePlusSlugging') return atBats + walks > 0;
  if (category.key === 'earnedRunAverage' || category.key === 'walksAndHitsPerInningPitched') return outs > 0;
  if (category.key === 'inningsPitched') return outs > 0;
  return true;
}

function leaderSummaryText(category, stat = {}) {
  if (category.group === 'pitching') {
    return `ERA ${cleanSummary(stat.era) || '---'} | WHIP ${cleanSummary(stat.whip) || '---'} | K ${statNumber(stat.strikeOuts)} | IP ${cleanSummary(stat.inningsPitched) || '0.0'} | SV ${statNumber(stat.saves)}`;
  }
  const avg = formatLeaderValue(seasonLeaderNumericValue({ key: 'battingAverage' }, stat), 'avg');
  const slg = formatRateValue(statRate(stat.slg) ?? statRate(stat.sluggingPercentage) ?? (statNumber(stat.atBats) > 0 ? (statNumber(stat.totalBases) || totalBasesFromBatting(stat)) / statNumber(stat.atBats) : null), 3, true);
  const ops = formatLeaderValue(seasonLeaderNumericValue({ key: 'onBasePlusSlugging' }, stat), 'ops');
  return `AVG ${avg} | SLG ${slg} | OPS ${ops} | HR ${statNumber(stat.homeRuns)} | RBI ${statNumber(stat.rbi)}`;
}

function formatSeasonLeaderEntries(entries, category, gamePk = null) {
  return entries.slice(0, LEADER_ROW_LIMIT).map((entry, index) => ({
    rank: index + 1,
    value: formatLeaderValue(entry.numericValue, category.valueType),
    playerId: entry.playerId,
    fullName: entry.fullName,
    teamAbbrev: entry.teamAbbrev,
    teamName: entry.teamName,
    teamColor: entry.teamColor,
    teamLogo: entry.teamLogo,
    gamePk: gamePk ?? entry.gamePk ?? null,
    summaryText: leaderSummaryText(category, entry.stat),
    recentFormText: getIndexedRecentForm(entry.playerId, category.group, dateInput.value || formatDate(new Date())),
  }));
}

async function getSortedSeasonStats(category, season, team = null, options = {}) {
  const { rowLimit = LEADER_ROW_LIMIT, formatted = true } = options;
  const numericTeamId = Number(team?.id);
  const hasTeamId = Number.isFinite(numericTeamId) && numericTeamId > 0;
  const scopeKey = hasTeamId ? `team:${numericTeamId}` : 'league';
  const cacheKey = `${season}:${scopeKey}:${category.key}:raw`;
  let promise = leadersSeasonCache.get(cacheKey);
  if (!promise) {
    promise = (async () => {
      const url = new URL(`${MLB_API_BASE}/stats`);
      url.searchParams.set('stats', 'season');
      url.searchParams.set('group', category.group);
      url.searchParams.set('season', String(season));
      url.searchParams.set('gameType', 'R');
      url.searchParams.set('sportIds', '1');
      url.searchParams.set('limit', '2000');
      url.searchParams.set('sortStat', category.sortStat);
      url.searchParams.set('order', category.sort === 'asc' ? 'asc' : 'desc');
      url.searchParams.set('hydrate', 'person,team');
      if (hasTeamId) url.searchParams.set('teamId', String(numericTeamId));
      const response = await getJson(url.toString());
      return listify(response?.stats?.[0]?.splits)
        .map((split) => {
          const stat = split?.stat || {};
          const player = split?.player || split?.person || {};
          const splitTeam = split?.team || team || {};
          const teamAbbrev = String(splitTeam?.abbreviation || team?.abbreviation || '').toUpperCase();
          const value = seasonLeaderNumericValue(category, stat);
          return {
            playerId: player?.id ?? null,
            fullName: player?.fullName || 'Unknown',
            teamAbbrev,
            teamName: splitTeam?.name || team?.name || teamAbbrev || 'MLB',
            teamColor: getTeamColor(teamAbbrev),
            teamLogo: getLogoPath(teamAbbrev),
            gamePk: latestRenderedGames.find((game) => Boolean(game?.playerLookup?.[String(player?.id)]))?.gamePk || null,
            stat,
            numericValue: value,
          };
        })
        .filter((entry) => Number.isFinite(entry.numericValue))
        .filter((entry) => passesSeasonLeaderQualifier(category, entry.stat, hasTeamId ? 'team' : 'league'))
        .filter((entry) => category.valueType === 'count' ? entry.numericValue > 0 : true);
    })().catch((error) => {
      leadersSeasonCache.delete(cacheKey);
      throw error;
    });
    leadersSeasonCache.set(cacheKey, promise);
  }
  const raw = await promise;
  const limited = Number.isFinite(rowLimit) ? raw.slice(0, Math.max(0, rowLimit)) : raw;
  return formatted ? formatSeasonLeaderEntries(limited, category) : limited;
}

async function getLiveGameFeed(gamePk) {
  return getJson(`${MLB_API_BASE_LIVE}/game/${gamePk}/feed/live`);
}

async function getGameBoxscore(gamePk) {
  return getJson(`${MLB_API_BASE}/game/${gamePk}/boxscore`);
}

function dateRangeInclusive(startDate, endDate = startDate) {
  const start = formatDate(parseLocalDateValue(startDate || formatDate(new Date())));
  const end = formatDate(parseLocalDateValue(endDate || start));
  const from = start <= end ? start : end;
  const to = start <= end ? end : start;
  const dates = [];
  const cursor = parseLocalDateValue(from);
  const limit = parseLocalDateValue(to);
  while (formatDate(cursor) <= formatDate(limit)) {
    dates.push(formatDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return { startDate: from, endDate: to, dates };
}

async function mapWithConcurrency(items, limit, iteratee) {
  const queue = Array.isArray(items) ? items : [];
  const concurrency = Math.max(1, Number(limit) || 1);
  const results = new Array(queue.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < queue.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await iteratee(queue[currentIndex], currentIndex);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()));
  return results;
}

function csvEscape(value) {
  const text = value == null ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function rowsToCsv(rows, columns) {
  const header = columns.map((column) => csvEscape(column.header)).join(',');
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column.key])).join(',')).join('\r\n');
  return body ? `${header}\r\n${body}` : header;
}

function downloadTextFile(filename, content, mimeType = 'text/csv;charset=utf-8;') {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvRate(value, digits = 3) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(digits) : '';
}

function matchupHalfSortValue(value) {
  return String(value || '').toLowerCase() === 'top' ? 0 : 1;
}

function extractMatchupRowsFromLiveFeed(date, game, live) {
  const gamePk = game?.gamePk || live?.gameData?.game?.pk || '';
  const gameDate = game?.gameDate || live?.gameData?.datetime?.dateTime || live?.gameData?.datetime?.officialDate || '';
  const status = live?.gameData?.status?.detailedState || game?.status?.detailedState || '';
  const awayTeam = live?.gameData?.teams?.away || game?.teams?.away?.team || {};
  const homeTeam = live?.gameData?.teams?.home || game?.teams?.home?.team || {};
  const awayAbbrev = displayTeamAbbrev(awayTeam?.abbreviation || awayTeam?.teamCode || game?.teams?.away?.team?.abbreviation || '');
  const homeAbbrev = displayTeamAbbrev(homeTeam?.abbreviation || homeTeam?.teamCode || game?.teams?.home?.team?.abbreviation || '');
  const awayName = awayTeam?.name || awayTeam?.teamName || game?.teams?.away?.team?.name || awayAbbrev || 'Away';
  const homeName = homeTeam?.name || homeTeam?.teamName || game?.teams?.home?.team?.name || homeAbbrev || 'Home';
  const allPlays = listify(live?.liveData?.plays?.allPlays);
  return allPlays
    .filter((play) => play?.about?.isComplete && play?.matchup?.batter?.id && play?.matchup?.pitcher?.id)
    .map((play, index) => {
      const inningHalf = normalizeHalfInning(play?.about?.halfInning);
      const battingTeam = inningHalf === 'bottom' ? homeAbbrev : awayAbbrev;
      const pitchingTeam = inningHalf === 'bottom' ? awayAbbrev : homeAbbrev;
      const eventType = String(play?.result?.eventType || '').toLowerCase();
      const hitBases = eventType === 'single' ? 1
        : eventType === 'double' ? 2
          : eventType === 'triple' ? 3
            : eventType === 'home_run' ? 4
              : 0;
      const isWalk = eventType === 'walk' || eventType === 'intent_walk';
      const isHitByPitch = eventType === 'hit_by_pitch';
      const isSacFly = eventType === 'sac_fly';
      const isSacBunt = eventType === 'sac_bunt';
      const isStrikeout = eventType.includes('strikeout');
      const isAtBat = !isWalk && !isHitByPitch && !isSacFly && !isSacBunt;
      const batterId = Number(play?.matchup?.batter?.id) || '';
      const pitcherId = Number(play?.matchup?.pitcher?.id) || '';
      const inningNumber = Number(play?.about?.inning);
      const atBatIndex = Number(play?.about?.atBatIndex);
      return {
        date,
        season: seasonForDate(date),
        game_pk: gamePk,
        game_date: gameDate,
        game_status: status,
        away_team: awayAbbrev,
        away_team_name: awayName,
        home_team: homeAbbrev,
        home_team_name: homeName,
        batting_team: battingTeam,
        pitching_team: pitchingTeam,
        inning: Number.isFinite(inningNumber) ? inningNumber : '',
        inning_half: inningHalf || '',
        at_bat_index: Number.isFinite(atBatIndex) ? atBatIndex : index,
        plate_appearance_number: index + 1,
        batter_id: batterId,
        batter_name: play?.matchup?.batter?.fullName || 'Unknown',
        pitcher_id: pitcherId,
        pitcher_name: play?.matchup?.pitcher?.fullName || 'Unknown',
        matchup_key: matchupIndexKey(batterId, pitcherId),
        matchup_label: `${play?.matchup?.batter?.fullName || 'Unknown'} vs ${play?.matchup?.pitcher?.fullName || 'Unknown'}`,
        event_type: eventType,
        event: play?.result?.event || '',
        description: play?.result?.description || '',
        rbi: statNumber(play?.result?.rbi),
        is_at_bat: isAtBat ? 1 : 0,
        is_hit: hitBases > 0 ? 1 : 0,
        is_double: eventType === 'double' ? 1 : 0,
        is_triple: eventType === 'triple' ? 1 : 0,
        is_home_run: eventType === 'home_run' ? 1 : 0,
        is_xbh: hitBases >= 2 ? 1 : 0,
        is_walk: isWalk ? 1 : 0,
        is_hit_by_pitch: isHitByPitch ? 1 : 0,
        is_sac_fly: isSacFly ? 1 : 0,
        is_sac_bunt: isSacBunt ? 1 : 0,
        is_strikeout: isStrikeout ? 1 : 0,
        hits: hitBases > 0 ? 1 : 0,
        total_bases: hitBases,
      };
    });
}

function aggregateMatchupCsvRows(rows) {
  const byMatchup = new Map();
  for (const row of rows) {
    const key = String(row?.matchup_key || '');
    if (!key) continue;
    const existing = byMatchup.get(key) || {
      matchup_key: key,
      matchup_label: row.matchup_label,
      batter_id: row.batter_id,
      batter_name: row.batter_name,
      batter_team: row.batting_team,
      pitcher_id: row.pitcher_id,
      pitcher_name: row.pitcher_name,
      pitcher_team: row.pitching_team,
      plate_appearances: 0,
      at_bats: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      home_runs: 0,
      xbh: 0,
      walks: 0,
      hit_by_pitch: 0,
      sac_flies: 0,
      sac_bunts: 0,
      strikeouts: 0,
      rbi: 0,
      total_bases: 0,
      first_date: row.date,
      last_date: row.date,
      games_seen: new Set(),
      dates_seen: new Set(),
    };
    existing.plate_appearances += 1;
    existing.at_bats += statNumber(row.is_at_bat);
    existing.hits += statNumber(row.hits);
    existing.doubles += statNumber(row.is_double);
    existing.triples += statNumber(row.is_triple);
    existing.home_runs += statNumber(row.is_home_run);
    existing.xbh += statNumber(row.is_xbh);
    existing.walks += statNumber(row.is_walk);
    existing.hit_by_pitch += statNumber(row.is_hit_by_pitch);
    existing.sac_flies += statNumber(row.is_sac_fly);
    existing.sac_bunts += statNumber(row.is_sac_bunt);
    existing.strikeouts += statNumber(row.is_strikeout);
    existing.rbi += statNumber(row.rbi);
    existing.total_bases += statNumber(row.total_bases);
    if (String(row.date || '') < String(existing.first_date || row.date || '')) existing.first_date = row.date;
    if (String(row.date || '') > String(existing.last_date || row.date || '')) existing.last_date = row.date;
    existing.games_seen.add(String(row.game_pk || ''));
    existing.dates_seen.add(String(row.date || ''));
    byMatchup.set(key, existing);
  }
  return [...byMatchup.values()]
    .map((entry) => {
      const ab = statNumber(entry.at_bats);
      const pa = statNumber(entry.plate_appearances);
      const bb = statNumber(entry.walks);
      const hbp = statNumber(entry.hit_by_pitch);
      const sf = statNumber(entry.sac_flies);
      const avg = ab > 0 ? entry.hits / ab : null;
      const obpDenominator = ab + bb + hbp + sf;
      const obp = obpDenominator > 0 ? (entry.hits + bb + hbp) / obpDenominator : null;
      const slg = ab > 0 ? entry.total_bases / ab : null;
      return {
        matchup_key: entry.matchup_key,
        matchup_label: entry.matchup_label,
        batter_id: entry.batter_id,
        batter_name: entry.batter_name,
        batter_team: entry.batter_team,
        pitcher_id: entry.pitcher_id,
        pitcher_name: entry.pitcher_name,
        pitcher_team: entry.pitcher_team,
        plate_appearances: pa,
        at_bats: ab,
        hits: entry.hits,
        doubles: entry.doubles,
        triples: entry.triples,
        home_runs: entry.home_runs,
        xbh: entry.xbh,
        walks: bb,
        hit_by_pitch: hbp,
        sac_flies: entry.sac_flies,
        sac_bunts: entry.sac_bunts,
        strikeouts: entry.strikeouts,
        rbi: entry.rbi,
        total_bases: entry.total_bases,
        avg: csvRate(avg),
        obp: csvRate(obp),
        slg: csvRate(slg),
        ops: csvRate((obp ?? 0) + (slg ?? 0)),
        first_date: entry.first_date,
        last_date: entry.last_date,
        game_count: entry.games_seen.size,
        date_count: entry.dates_seen.size,
      };
    })
    .sort((a, b) => String(a.matchup_key).localeCompare(String(b.matchup_key)) || String(a.first_date).localeCompare(String(b.first_date)));
}

const MATCHUP_PA_CSV_COLUMNS = [
  { key: 'date', header: 'date' },
  { key: 'season', header: 'season' },
  { key: 'game_pk', header: 'game_pk' },
  { key: 'game_date', header: 'game_date' },
  { key: 'game_status', header: 'game_status' },
  { key: 'away_team', header: 'away_team' },
  { key: 'away_team_name', header: 'away_team_name' },
  { key: 'home_team', header: 'home_team' },
  { key: 'home_team_name', header: 'home_team_name' },
  { key: 'batting_team', header: 'batting_team' },
  { key: 'pitching_team', header: 'pitching_team' },
  { key: 'inning', header: 'inning' },
  { key: 'inning_half', header: 'inning_half' },
  { key: 'at_bat_index', header: 'at_bat_index' },
  { key: 'plate_appearance_number', header: 'plate_appearance_number' },
  { key: 'batter_id', header: 'batter_id' },
  { key: 'batter_name', header: 'batter_name' },
  { key: 'pitcher_id', header: 'pitcher_id' },
  { key: 'pitcher_name', header: 'pitcher_name' },
  { key: 'matchup_key', header: 'matchup_key' },
  { key: 'matchup_label', header: 'matchup_label' },
  { key: 'event_type', header: 'event_type' },
  { key: 'event', header: 'event' },
  { key: 'description', header: 'description' },
  { key: 'rbi', header: 'rbi' },
  { key: 'is_at_bat', header: 'is_at_bat' },
  { key: 'is_hit', header: 'is_hit' },
  { key: 'is_double', header: 'is_double' },
  { key: 'is_triple', header: 'is_triple' },
  { key: 'is_home_run', header: 'is_home_run' },
  { key: 'is_xbh', header: 'is_xbh' },
  { key: 'is_walk', header: 'is_walk' },
  { key: 'is_hit_by_pitch', header: 'is_hit_by_pitch' },
  { key: 'is_sac_fly', header: 'is_sac_fly' },
  { key: 'is_sac_bunt', header: 'is_sac_bunt' },
  { key: 'is_strikeout', header: 'is_strikeout' },
  { key: 'hits', header: 'hits' },
  { key: 'total_bases', header: 'total_bases' },
];

const MATCHUP_SUMMARY_CSV_COLUMNS = [
  { key: 'matchup_key', header: 'matchup_key' },
  { key: 'matchup_label', header: 'matchup_label' },
  { key: 'batter_id', header: 'batter_id' },
  { key: 'batter_name', header: 'batter_name' },
  { key: 'batter_team', header: 'batter_team' },
  { key: 'pitcher_id', header: 'pitcher_id' },
  { key: 'pitcher_name', header: 'pitcher_name' },
  { key: 'pitcher_team', header: 'pitcher_team' },
  { key: 'plate_appearances', header: 'plate_appearances' },
  { key: 'at_bats', header: 'at_bats' },
  { key: 'hits', header: 'hits' },
  { key: 'doubles', header: 'doubles' },
  { key: 'triples', header: 'triples' },
  { key: 'home_runs', header: 'home_runs' },
  { key: 'xbh', header: 'xbh' },
  { key: 'walks', header: 'walks' },
  { key: 'hit_by_pitch', header: 'hit_by_pitch' },
  { key: 'sac_flies', header: 'sac_flies' },
  { key: 'sac_bunts', header: 'sac_bunts' },
  { key: 'strikeouts', header: 'strikeouts' },
  { key: 'rbi', header: 'rbi' },
  { key: 'total_bases', header: 'total_bases' },
  { key: 'avg', header: 'avg' },
  { key: 'obp', header: 'obp' },
  { key: 'slg', header: 'slg' },
  { key: 'ops', header: 'ops' },
  { key: 'first_date', header: 'first_date' },
  { key: 'last_date', header: 'last_date' },
  { key: 'game_count', header: 'game_count' },
  { key: 'date_count', header: 'date_count' },
];

async function exportMlbMatchupRangeCsv(startDate = '', endDate = '', options = {}) {
  const fallbackDate = dateInput.value || formatDate(new Date());
  const range = dateRangeInclusive(startDate || fallbackDate, endDate || startDate || fallbackDate);
  const feedConcurrency = Math.max(1, Number(options.feedConcurrency) || 4);
  const rawRows = [];
  const errors = [];
  for (const date of range.dates) {
    const schedule = await getSchedule(date);
    const games = listify(schedule?.dates?.[0]?.games).sort((a, b) => String(a?.gameDate || '').localeCompare(String(b?.gameDate || '')));
    const rowsByGame = await mapWithConcurrency(games, feedConcurrency, async (game) => {
      try {
        const live = await getLiveGameFeed(game.gamePk);
        return extractMatchupRowsFromLiveFeed(date, game, live);
      } catch (error) {
        errors.push({ date, gamePk: game?.gamePk || '', message: error?.message || String(error) });
        return [];
      }
    });
    for (const rows of rowsByGame) rawRows.push(...rows);
  }
  rawRows.sort((a, b) =>
    String(a.matchup_key).localeCompare(String(b.matchup_key))
    || String(a.date).localeCompare(String(b.date))
    || String(a.game_pk).localeCompare(String(b.game_pk))
    || (Number(a.inning) - Number(b.inning))
    || matchupHalfSortValue(a.inning_half) - matchupHalfSortValue(b.inning_half)
    || (Number(a.at_bat_index) - Number(b.at_bat_index))
  );
  const summaryRows = aggregateMatchupCsvRows(rawRows);
  const suffix = `${range.startDate}_to_${range.endDate}`;
  const rawFilename = `mlb-matchups-plate-appearances-${suffix}.csv`;
  const summaryFilename = `mlb-matchups-summary-${suffix}.csv`;
  if (options.download !== false) {
    downloadTextFile(rawFilename, rowsToCsv(rawRows, MATCHUP_PA_CSV_COLUMNS));
    downloadTextFile(summaryFilename, rowsToCsv(summaryRows, MATCHUP_SUMMARY_CSV_COLUMNS));
  }
  console.info(`MLB matchup export complete for ${range.startDate} through ${range.endDate}: ${rawRows.length} plate appearances, ${summaryRows.length} unique batter/pitcher matchups.`);
  if (errors.length) {
    console.warn('Some games could not be exported:', errors);
  }
  return {
    ...range,
    rawFilename,
    summaryFilename,
    rawRows,
    summaryRows,
    errors,
  };
}

function normalizeLookupText(value) {
  return String(value || '').trim().toLowerCase();
}

function createPanelMessage(text) {
  const el = document.createElement('div');
  el.className = 'panel-item';
  el.textContent = text;
  return el;
}

function syncMatchupExportDatesFromCurrent() {
  const value = dateInput.value || formatDate(new Date());
  if (matchupExportStartEl && !matchupExportStartEl.value) matchupExportStartEl.value = value;
  if (matchupExportEndEl && !matchupExportEndEl.value) matchupExportEndEl.value = value;
}

function setMatchupExportBusy(isBusy) {
  if (matchupLoadBtnEl) matchupLoadBtnEl.disabled = isBusy;
  if (matchupExportBtnEl) matchupExportBtnEl.disabled = isBusy;
  if (matchupLookupClearBtnEl) matchupLookupClearBtnEl.disabled = isBusy;
}

function setMatchupExportStatus(message) {
  if (matchupExportStatusEl) matchupExportStatusEl.textContent = message;
}

function populateMatchupLookupOptions(data) {
  if (!matchupBatterOptionsEl || !matchupPitcherOptionsEl) return;
  matchupBatterOptionsEl.replaceChildren();
  matchupPitcherOptionsEl.replaceChildren();
  const batterNames = [...new Set(listify(data?.summaryRows).map((row) => String(row?.batter_name || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const pitcherNames = [...new Set(listify(data?.summaryRows).map((row) => String(row?.pitcher_name || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  for (const name of batterNames) {
    const option = document.createElement('option');
    option.value = name;
    matchupBatterOptionsEl.appendChild(option);
  }
  for (const name of pitcherNames) {
    const option = document.createElement('option');
    option.value = name;
    matchupPitcherOptionsEl.appendChild(option);
  }
}

function lookupFilteredMatchupRows() {
  const data = latestMatchupExportData;
  if (!data) return [];
  const batterQuery = normalizeLookupText(matchupLookupBatterEl?.value);
  const pitcherQuery = normalizeLookupText(matchupLookupPitcherEl?.value);
  return listify(data.summaryRows)
    .filter((row) => !batterQuery || normalizeLookupText(row?.batter_name).includes(batterQuery))
    .filter((row) => !pitcherQuery || normalizeLookupText(row?.pitcher_name).includes(pitcherQuery))
    .sort((a, b) => Number(b?.plate_appearances || 0) - Number(a?.plate_appearances || 0) || String(a?.batter_name || '').localeCompare(String(b?.batter_name || '')));
}

function renderMatchupLookupResults() {
  if (!matchupLookupResultsEl) return;
  matchupLookupResultsEl.replaceChildren();
  if (!latestMatchupExportData) {
    matchupLookupResultsEl.appendChild(createPanelMessage('Load a range to search batter vs pitcher matchups.'));
    return;
  }

  const filtered = lookupFilteredMatchupRows();
  if (!filtered.length) {
    matchupLookupResultsEl.appendChild(createPanelMessage('No matchup rows matched the current batter/pitcher lookup.'));
    return;
  }

  const candidateKeys = new Set(filtered.map((row) => String(row.matchup_key)));
  if (!candidateKeys.has(String(activeMatchupLookupKey || ''))) {
    activeMatchupLookupKey = String(filtered[0]?.matchup_key || '');
  }

  const summarySection = document.createElement('section');
  summarySection.className = 'matchup-lookup-section';
  const summaryHeading = document.createElement('div');
  summaryHeading.className = 'matchup-lookup-heading';
  summaryHeading.textContent = `Summary Matches (${filtered.length})`;
  summarySection.appendChild(summaryHeading);

  for (const row of filtered.slice(0, 12)) {
    const card = document.createElement('article');
    card.className = `panel-item matchup-summary-item${String(row.matchup_key) === String(activeMatchupLookupKey) ? ' is-active' : ''}`;
    card.dataset.matchupKey = String(row.matchup_key || '');
    card.innerHTML = `
      <div class="matchup-summary-top">
        <div>
          <div class="matchup-summary-title">${row.batter_name || 'Unknown'} vs ${row.pitcher_name || 'Unknown'}</div>
          <div class="matchup-summary-subtitle">${row.batter_team || ''} batting vs ${row.pitcher_team || ''} pitching | ${row.first_date || ''} to ${row.last_date || ''}</div>
        </div>
        <div class="matchup-summary-subtitle">${row.game_count || 0} games</div>
      </div>
      <div class="matchup-summary-grid">
        <div class="matchup-summary-stat"><span>H-AB</span><strong>${row.hits || 0}-${row.at_bats || 0}</strong></div>
        <div class="matchup-summary-stat"><span>PA</span><strong>${row.plate_appearances || 0}</strong></div>
        <div class="matchup-summary-stat"><span>AVG</span><strong>${row.avg || '0.000'}</strong></div>
        <div class="matchup-summary-stat"><span>OPS</span><strong>${row.ops || '0.000'}</strong></div>
        <div class="matchup-summary-stat"><span>XBH</span><strong>${row.xbh || 0}</strong></div>
        <div class="matchup-summary-stat"><span>HR</span><strong>${row.home_runs || 0}</strong></div>
      </div>
    `;
    summarySection.appendChild(card);
  }
  matchupLookupResultsEl.appendChild(summarySection);

  const selectedRows = listify(latestMatchupExportData.rawRows)
    .filter((row) => String(row?.matchup_key || '') === String(activeMatchupLookupKey || ''))
    .sort((a, b) =>
      String(b.date).localeCompare(String(a.date))
      || String(b.game_pk).localeCompare(String(a.game_pk))
      || (Number(b.inning) - Number(a.inning))
      || matchupHalfSortValue(b.inning_half) - matchupHalfSortValue(a.inning_half)
      || (Number(b.at_bat_index) - Number(a.at_bat_index))
    );

  const paSection = document.createElement('section');
  paSection.className = 'matchup-lookup-section';
  const paHeading = document.createElement('div');
  paHeading.className = 'matchup-lookup-heading';
  paHeading.textContent = `Plate Appearances (${selectedRows.length})`;
  paSection.appendChild(paHeading);
  for (const row of selectedRows.slice(0, 18)) {
    const card = document.createElement('article');
    card.className = 'panel-item matchup-pa-item';
    card.innerHTML = `
      <div class="matchup-pa-top">
        <div class="matchup-pa-event">${row.event || row.event_type || 'Event'}</div>
        <div class="matchup-pa-meta">${row.date || ''} | ${row.away_team || ''} @ ${row.home_team || ''} | ${String(row.inning_half || '').toUpperCase()} ${row.inning || ''}</div>
      </div>
      <div class="matchup-pa-desc">${row.description || 'No description available.'}</div>
      <div class="matchup-pa-meta">AB ${row.is_at_bat || 0} | H ${row.is_hit || 0} | XBH ${row.is_xbh || 0} | HR ${row.is_home_run || 0} | BB ${row.is_walk || 0} | K ${row.is_strikeout || 0} | RBI ${row.rbi || 0}</div>
    `;
    paSection.appendChild(card);
  }
  matchupLookupResultsEl.appendChild(paSection);
}

async function runMatchupExportPanel(options = {}) {
  syncMatchupExportDatesFromCurrent();
  const start = matchupExportStartEl?.value || dateInput.value || formatDate(new Date());
  const end = matchupExportEndEl?.value || start;
  if (matchupExportStartEl) matchupExportStartEl.value = start;
  if (matchupExportEndEl) matchupExportEndEl.value = end;
  setMatchupExportBusy(true);
  setMatchupExportStatus(`Loading matchup history from ${start} through ${end}...`);
  try {
    const payload = await exportMlbMatchupRangeCsv(start, end, options);
    latestMatchupExportData = payload;
    window.latestMatchupExportData = payload;
    activeMatchupLookupKey = '';
    populateMatchupLookupOptions(payload);
    if (matchupExportMetaEl) matchupExportMetaEl.textContent = `${payload.summaryRows.length} matchups | ${payload.rawRows.length} PA`;
    setMatchupExportStatus(payload.errors.length
      ? `Loaded ${payload.summaryRows.length} matchups with ${payload.errors.length} game fetch errors.`
      : `Loaded ${payload.summaryRows.length} matchups and ${payload.rawRows.length} plate appearances.`);
    renderMatchupLookupResults();
    return payload;
  } catch (error) {
    setMatchupExportStatus(`Could not load matchup export (${error.message}).`);
    if (matchupLookupResultsEl) {
      matchupLookupResultsEl.replaceChildren(createPanelMessage(`Could not load matchup export (${error.message}).`));
    }
    throw error;
  } finally {
    setMatchupExportBusy(false);
  }
}

function initMatchupExportWidget() {
  syncMatchupExportDatesFromCurrent();
  renderMatchupLookupResults();
  matchupLoadBtnEl?.addEventListener('click', () => {
    runMatchupExportPanel({ download: false }).catch(() => {});
  });
  matchupExportBtnEl?.addEventListener('click', () => {
    runMatchupExportPanel({ download: true }).catch(() => {});
  });
  matchupLookupClearBtnEl?.addEventListener('click', () => {
    if (matchupLookupBatterEl) matchupLookupBatterEl.value = '';
    if (matchupLookupPitcherEl) matchupLookupPitcherEl.value = '';
    activeMatchupLookupKey = '';
    renderMatchupLookupResults();
  });
  matchupLookupBatterEl?.addEventListener('input', () => {
    activeMatchupLookupKey = '';
    renderMatchupLookupResults();
  });
  matchupLookupPitcherEl?.addEventListener('input', () => {
    activeMatchupLookupKey = '';
    renderMatchupLookupResults();
  });
  matchupLookupResultsEl?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const card = target.closest('[data-matchup-key]');
    if (!card) return;
    activeMatchupLookupKey = String(card.dataset.matchupKey || '');
    renderMatchupLookupResults();
  });
}

async function getPerson(playerId) {
  return getJson(`${MLB_API_BASE}/people/${playerId}`);
}

async function getPlayerSeasonStats(playerId, group, season) {
  const url = new URL(`${MLB_API_BASE}/people/${playerId}/stats`);
  url.searchParams.set('stats', 'season');
  url.searchParams.set('group', group);
  url.searchParams.set('season', String(season));
  return getJson(url.toString());
}

function statSplit(response) {
  return response?.stats?.[0]?.splits?.[0]?.stat || {};
}

function hexToRgb(hex) {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const num = Number.parseInt(full, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

function rgbChannels(hex) {
  const raw = String(hex || '').replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const num = Number.parseInt(full, 16);
  if (!Number.isFinite(num)) return { r: 221, g: 233, b: 255 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function mixHex(hex, target, amount) {
  const c = rgbChannels(hex);
  const t = target === 'white' ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };
  const a = Math.max(0, Math.min(1, Number(amount) || 0));
  const r = Math.round(c.r * (1 - a) + t.r * a);
  const g = Math.round(c.g * (1 - a) + t.g * a);
  const b = Math.round(c.b * (1 - a) + t.b * a);
  return `rgb(${r}, ${g}, ${b})`;
}

function eventLabel(play) {
  const batterName = play?.matchup?.batter?.fullName || 'Unknown';
  const shortName = batterName.split(' ').slice(-1)[0];
  const event = String(play?.result?.event || play?.result?.eventType || 'Play');
  const description = play?.result?.description || '';
  if (/home run/i.test(event)) return `${shortName} HR`;
  if (/single/i.test(event)) return `${shortName} 1B`;
  if (/double/i.test(event)) return `${shortName} 2B`;
  if (/triple/i.test(event)) return `${shortName} 3B`;
  if (/^play$/i.test(event)) return `${shortName} At Bat`;
  if (event.includes('Strikeout')) return `${shortName} K`;
  const shorthand = description.match(/\bP\d{1,2}\b/i)?.[0];
  if (shorthand) return `${shortName} ${shorthand.toUpperCase()}`;
  return `${shortName} ${event}`;
}

function setupOverflowMarquee(el) {
  if (!el) return;
  const text = String(el.dataset.renderValue ?? el.textContent ?? '');
  const width = Math.round(el.clientWidth || 0);
  if (
    el.dataset.marqueeMode === 'single'
    && el.dataset.marqueeText === text
    && Number(el.dataset.marqueeWidth || 0) === width
    && el.querySelector('.marquee-track')
  ) return;
  el.dataset.marqueeMode = 'single';
  el.dataset.marqueeText = text;
  el.dataset.marqueeWidth = String(width);
  el.classList.remove('overflow-marquee');
  el.style.removeProperty('--marquee-distance');
  el.style.removeProperty('--marquee-duration');
  let track = el.querySelector('.marquee-track');
  if (!track) {
    el.replaceChildren();
    track = document.createElement('span');
    track.className = 'marquee-track';
    el.appendChild(track);
  }
  track.textContent = text;
  void track.offsetWidth;
  const overflow = Math.ceil(track.scrollWidth - el.clientWidth);
  if (overflow <= 10) {
    el.textContent = text;
    return;
  }
  const travel = overflow + 4;
  const duration = SCOREBOARD_MARQUEE_DURATION_S;
  const elapsed = typeof performance !== 'undefined' ? (performance.now() / 1000) % duration : 0;
  el.style.setProperty('--marquee-distance', `${travel}px`);
  el.style.setProperty('--marquee-duration', `${duration.toFixed(2)}s`);
  el.style.setProperty('--marquee-delay', `-${elapsed.toFixed(2)}s`);
  el.classList.add('overflow-marquee');
}

function clearOverflowMarquee(el) {
  if (!el) return;
  el.classList.remove('overflow-marquee');
  el.style.removeProperty('--marquee-distance');
  el.style.removeProperty('--marquee-duration');
  el.style.removeProperty('--marquee-delay');
  el.dataset.marqueeMode = '';
  el.dataset.marqueeWidth = '';
  el.replaceChildren();
}

function renderSingleLineMarquee(el, text) {
  if (!el) return;
  const nextText = String(text || '');
  const nextWidth = Math.round(el.clientWidth || 0);
  const contentChanged = el.dataset.renderMode !== 'single' || el.dataset.renderValue !== nextText;
  const widthChanged = Number(el.dataset.renderWidth || 0) !== nextWidth;
  if (!contentChanged && !widthChanged) return;
  if (contentChanged) {
    el.classList.remove('is-multi');
    clearOverflowMarquee(el);
    el.textContent = nextText;
  }
  el.dataset.renderMode = 'single';
  el.dataset.renderValue = nextText;
  el.dataset.renderWidth = String(nextWidth);
  setupOverflowMarquee(el);
}

function renderMultiLineSummary(el, items) {
  if (!el) return;
  const normalizedItems = (items || []).map((item) => ({
    text: String(item?.text || 'Awaiting first pitch'),
    color: String(item?.color || ''),
  }));
  const signature = JSON.stringify(normalizedItems);
  if (el.dataset.renderMode === 'multi' && el.dataset.renderValue === signature) return;
  clearOverflowMarquee(el);
  el.classList.add('is-multi');
  for (const item of normalizedItems) {
    const line = document.createElement('span');
    line.className = 'score-mini-play-line';
    line.textContent = item.text;
    if (item.color) line.style.color = item.color;
    el.appendChild(line);
  }
  el.dataset.renderMode = 'multi';
  el.dataset.renderValue = signature;
  el.dataset.renderWidth = String(Math.round(el.clientWidth || 0));
}

function isFocusedGame(gamePk) {
  return focusedGamePk !== null && String(focusedGamePk) === String(gamePk);
}

function animateNumericChange(el, color) {
  if (!el) return;
  el.style.setProperty('--number-flash-rgb', hexToRgb(color || '#66d9ff'));
  el.classList.remove('number-flip');
  void el.offsetWidth;
  el.classList.add('number-flip');
}

function syncFocusedGameLayout() {
  if (!gamesEl) return;
  const hasFocusedGame = focusedGamePk !== null;
  gamesEl.classList.toggle('has-focused-game', hasFocusedGame);
  for (const card of gamesEl.querySelectorAll('.game-card')) {
    const isFocused = hasFocusedGame && String(card.dataset.gamePk) === String(focusedGamePk);
    card.classList.toggle('is-focused', isFocused);
    card.classList.toggle('is-condensed', hasFocusedGame && !isFocused);
  }
  requestAnimationFrame(refreshAllScoreboardResponsiveLayout);
}

function setFocusedGame(gamePk) {
  focusedGamePk = gamePk === null ? null : String(gamePk);
  if (focusedGamePk && !focusedMatchupSideByGame.has(focusedGamePk)) {
    focusedMatchupSideByGame.set(focusedGamePk, 'away');
  }
  syncFocusedGameLayout();
  for (const card of gamesEl.querySelectorAll('.game-card')) {
    if (card._game) upsertCard(card._game);
  }
}

function focusedMatchupSide(gamePk) {
  return focusedMatchupSideByGame.get(String(gamePk || '')) || 'away';
}

function setFocusedMatchupSide(gamePk, side) {
  const normalizedGamePk = String(gamePk || '');
  if (!normalizedGamePk || (side !== 'away' && side !== 'home')) return;
  if (focusedMatchupSideByGame.get(normalizedGamePk) === side) return;
  focusedMatchupSideByGame.set(normalizedGamePk, side);
  const card = gamesEl?.querySelector(`.game-card[data-game-pk='${normalizedGamePk}']`);
  if (card?._game) upsertCard(card._game);
}

function syncFocusedMatchupSelection(card) {
  if (!card) return;
  const isFocused = isFocusedGame(card.dataset.gamePk);
  const activeSide = isFocused ? focusedMatchupSide(card.dataset.gamePk) : '';
  card.dataset.focusedMatchupSide = activeSide;
  const awayTargets = card.querySelectorAll('.away-row, .away-score');
  const homeTargets = card.querySelectorAll('.home-row, .home-score');
  awayTargets.forEach((el) => el.classList.toggle('is-matchup-active', isFocused && activeSide === 'away'));
  homeTargets.forEach((el) => el.classList.toggle('is-matchup-active', isFocused && activeSide === 'home'));
}

function toggleFocusedGame(gamePk) {
  if (!gamePk) return;
  setFocusedGame(String(focusedGamePk) === String(gamePk) ? null : gamePk);
}

function statusLine(game) {
  const st = game?.status?.abstractGameState;
  if (st === 'Preview') return `Not Started | ${estTime(game.gameDate)} EST`;
  if (st === 'Final') return 'Final';
  return game?.status?.detailedState || 'Unknown';
}

function shouldPreferProbablePitcher(game) {
  if (!game) return false;
  if (game?.status?.abstractGameState === 'Preview') return true;
  const inningShort = String(game?.inningShort || '').toUpperCase();
  if (inningShort === 'PRE') return true;
  const status = String(game?.status || '').toLowerCase();
  return status.includes('not started') || status.includes('scheduled') || status.includes('pre-game');
}

function normalizeHalfInning(value) {
  const raw = String(value || '').toLowerCase();
  if (raw.includes('top')) return 'top';
  if (raw.includes('bottom') || raw.includes('bot')) return 'bottom';
  if (raw.includes('middle') || raw === 'mid') return 'middle';
  if (raw.includes('end')) return 'end';
  return '';
}

function ordinalForDisplay(linescore) {
  return linescore?.currentInningOrdinal || (Number.isFinite(linescore?.currentInning) ? `${linescore.currentInning}` : '-');
}

function inningDisplay(linescore, game, activePlay) {
  const st = game?.status?.abstractGameState;
  if (st === 'Preview') return { short: 'PRE', long: `Starts ${estTime(game.gameDate)} EST` };
  if (st === 'Final') return { short: 'F', long: 'Final' };

  const ordinal = ordinalForDisplay(linescore);
  const liveHalf = normalizeHalfInning(activePlay?.about?.halfInning);
  const stateHalf = normalizeHalfInning(linescore?.inningHalf || linescore?.inningState);
  const half = liveHalf || stateHalf;

  if (half === 'top') return { short: `TOP ${ordinal}`, long: `Top ${ordinal}` };
  if (half === 'bottom') return { short: `BOT ${ordinal}`, long: `Bottom ${ordinal}` };
  if (half === 'middle') return { short: `MID ${ordinal}`, long: `Mid ${ordinal}` };
  if (half === 'end') return { short: `END ${ordinal}`, long: `End ${ordinal}` };

  return { short: game?.status?.codedGameState === 'D' ? 'DEL' : 'LIVE', long: game?.status?.detailedState || 'Live' };
}

function countForGame(linescore, currentPlay) {
  const c = currentPlay?.count;
  if (c && Number.isInteger(c.balls)) {
    return { balls: c.balls, strikes: c.strikes ?? 0, outs: c.outs ?? linescore?.outs ?? 0 };
  }
  return { balls: linescore?.balls ?? 0, strikes: linescore?.strikes ?? 0, outs: linescore?.outs ?? 0 };
}

function playerById(players, id) {
  return players?.[`ID${id}`] || null;
}

function resolveCurrentSide(activePlay, linescore) {
  const liveHalf = normalizeHalfInning(activePlay?.about?.halfInning);
  const lineHalf = normalizeHalfInning(linescore?.inningHalf);
  const half = liveHalf || lineHalf;
  return {
    half,
    battingSide: half === 'bottom' ? 'home' : 'away',
    fieldingSide: half === 'bottom' ? 'away' : 'home',
  };
}

function currentPeople(activePlay, linescore, game, awayPlayers, homePlayers) {
  const probableAway = game?.teams?.away?.probablePitcher;
  const probableHome = game?.teams?.home?.probablePitcher;

  let awayPitcher = formatPitcherLine(playerById(awayPlayers, probableAway?.id), probableAway?.fullName || '');
  let homePitcher = formatPitcherLine(playerById(homePlayers, probableHome?.id), probableHome?.fullName || '');
  let awayHitter = '-';
  let homeHitter = '-';

  const activePitcher = activePlay?.matchup?.pitcher;
  const activeBatter = activePlay?.matchup?.batter;
  const side = resolveCurrentSide(activePlay, linescore);

  if (side.battingSide === 'away') {
    awayHitter = formatBatterLine(playerById(awayPlayers, activeBatter?.id), activeBatter?.fullName || '');
    homePitcher = formatPitcherLine(playerById(homePlayers, activePitcher?.id), activePitcher?.fullName || '');
  } else if (side.battingSide === 'home') {
    homeHitter = formatBatterLine(playerById(homePlayers, activeBatter?.id), activeBatter?.fullName || '');
    awayPitcher = formatPitcherLine(playerById(awayPlayers, activePitcher?.id), activePitcher?.fullName || '');
  }

  return { awayPitcher, homePitcher, awayHitter, homeHitter, battingSide: side.battingSide };
}

function scoreboardHitterForSide(game, side) {
  if (hasLiveAtBat(game)) {
    const batterId = Number(game?.activeBatterId);
    const profile = Number.isFinite(batterId) && batterId > 0 ? game?.playerLookup?.[String(batterId)] || null : null;
    return profile || {
      id: batterId || null,
      fullName: side === 'away' ? game?.awayHitter : game?.homeHitter,
      name: side === 'away' ? game?.awayHitter : game?.homeHitter,
      batting: {},
    };
  }
  const lineup = fallbackTeamLineupFromLookup(game, side);
  const hitter = lineup.find((entry) => Number(entry?.slot) === 1) || lineup[0] || null;
  if (!hitter) return null;
  const profile = Number.isFinite(Number(hitter?.id)) ? game?.playerLookup?.[String(hitter.id)] || null : null;
  return profile ? { ...hitter, ...profile, avg: hitter.avg || profile?.batting?.avg || '---' } : hitter;
}

function scoreboardPitcherSideForLine(game, side) {
  if (!game) return '';
  const battingSide = game?.battingSide || 'away';
  return side === battingSide ? '' : side;
}

function scoreboardHitterName(hitter) {
  if (!hitter) return '-';
  const fullName = cleanSummary(hitter.fullName || hitter.name || '');
  if (!fullName) return '-';
  const nameOnly = fullName.replace(/\s*\(.*$/, '').replace(/\s+AVG\b.*$/i, '').trim();
  return lastName(nameOnly || fullName);
}

function scoreboardHitterAvg(hitter) {
  const raw = cleanSummary(hitter?.batting?.avg || hitter?.avg || '');
  return raw && raw !== '---' ? raw : '---';
}

function scoreboardHitterHr(hitter) {
  return statNumber(hitter?.batting?.hr ?? hitter?.batting?.homeRuns ?? hitter?.homeRuns);
}

function scoreboardPitcherEra(pitcher) {
  const raw = cleanSummary(pitcher?.pitching?.era || pitcher?.era || '');
  return raw && raw !== '---' ? raw : '---';
}

function scoreboardPitcherName(pitcher) {
  const fullName = cleanSummary(pitcher?.fullName || pitcher?.name || '');
  const nameOnly = fullName.replace(/\s+\d+P\b.*$/i, '').trim();
  return nameOnly ? lastName(nameOnly) : '-';
}

function hasLiveAtBat(game) {
  return Number.isFinite(Number(game?.activeBatterId)) && Number(game.activeBatterId) > 0;
}

function matchupLineForSide(game, side) {
  const battingSide = game?.battingSide || 'away';
  if (side === battingSide) {
    const hitter = scoreboardHitterForSide(game, battingSide);
    const hitterName = scoreboardHitterName(hitter);
    if (hitterName === '-') return 'Hitter pending';
    return `${hitterName}${handednessSuffixText(hitter?.bats || hitter?.batSide?.code || hitter?.batSide?.description)} AVG ${scoreboardHitterAvg(hitter)} ${scoreboardHitterHr(hitter)} HR`;
  }
  const pitcher = scoreboardPitcherForSide(game, side);
  const pitcherName = scoreboardPitcherName(pitcher);
  return pitcherName === '-' ? 'Pitcher pending' : `${pitcherName}${handednessSuffixText(pitcher?.throws || pitcher?.pitchHand?.code || pitcher?.pitchHand?.description)} ERA ${scoreboardPitcherEra(pitcher)}`;
}

function scoreboardPitcherForSide(game, side) {
  if (!game) return null;
  const pitcherSide = scoreboardPitcherSideForLine(game, side);
  if (!pitcherSide) return null;
  const pitcher = (shouldPreferProbablePitcher(game)
    ? game?.probablePitchers?.[pitcherSide]
      || game?.teams?.[pitcherSide]?.probablePitcher
      || game?.pitching?.[pitcherSide]?.current
    : game?.pitching?.[pitcherSide]?.current
      || game?.probablePitchers?.[pitcherSide]
      || game?.teams?.[pitcherSide]?.probablePitcher)
    || null;
  const profile = pitcher?.id ? game?.playerLookup?.[String(pitcher.id)] || null : null;
  return profile ? { ...pitcher, ...profile, role: pitcher?.role || profile?.role } : pitcher;
}

function renderScoreboardMatchupLine(el, game, side) {
  if (!el) return;
  const text = matchupLineForSide(game, side);
  const pitcher = scoreboardPitcherForSide(game, side);
  const pitcherId = Number(pitcher?.id);
  const markerId = Number.isFinite(pitcherId) && pitcherId > 0 ? String(pitcherId) : '';
  const width = Math.round(el.clientWidth || 0);
  const forceRender = el.dataset.scoreboardPitcherId !== markerId || Number(el.dataset.renderWidth || 0) !== width;
  if (forceRender) {
    el.dataset.renderMode = '';
    el.dataset.renderValue = '';
  }
  renderSingleLineMarquee(el, text);
  el.dataset.scoreboardPitcherId = markerId;
  el.querySelectorAll('.pitcher-fire-streak').forEach((marker) => marker.remove());
  if (!markerId) return;
  const markerWrap = document.createElement('span');
  const track = el.querySelector('.marquee-track');
  const target = track || el;
  markerWrap.innerHTML = pitcherFireMarkerHtml(markerId);
  const marker = markerWrap.firstElementChild;
  if (marker) target.appendChild(marker);
  const riskWrap = document.createElement('span');
  riskWrap.innerHTML = pitcherHomeRunRiskMarkerHtml(pitcher);
  const riskMarker = riskWrap.firstElementChild;
  if (riskMarker) target.appendChild(riskMarker);
}

function baseState(linescore) {
  const o = linescore?.offense || {};
  return { first: Boolean(o.first), second: Boolean(o.second), third: Boolean(o.third) };
}

function parseHrNumber(description) {
  const m = description?.match(/(\d+)(st|nd|rd|th)\s+home run/i);
  if (m) return Number(m[1]);
  const parenthetical = description?.match(/\bhomers?\s*\((\d+)\)/i);
  return parenthetical ? Number(parenthetical[1]) : null;
}

function positiveStatNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function lookupPlayerSeasonHomeRuns(playerId, lookup = {}) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const profile = lookup[String(id)] || lookup[`ID${id}`] || null;
  return positiveStatNumber(profile?.batting?.hr ?? profile?.batting?.homeRuns ?? profile?.seasonStats?.batting?.homeRuns);
}

async function getPlayerSeasonHomeRuns(playerId, season) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const normalizedSeason = seasonForDate(season || (dateInput.value || formatDate(new Date())));
  const cacheKey = `${id}:${normalizedSeason}:hr`;
  if (playerSeasonHomeRunCache.has(cacheKey)) return playerSeasonHomeRunCache.get(cacheKey);

  const promise = getPlayerSeasonStats(id, 'hitting', normalizedSeason)
    .then((response) => positiveStatNumber(statSplit(response)?.homeRuns))
    .catch((error) => {
      playerSeasonHomeRunCache.delete(cacheKey);
      throw error;
    });
  playerSeasonHomeRunCache.set(cacheKey, promise);
  return promise;
}

function deriveSlotFromOrder(order) {
  const num = Number(order);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.floor(num / 100) || num;
}

function numericPlayerId(value) {
  const direct = Number(value);
  if (Number.isFinite(direct)) return direct;
  const match = String(value || '').match(/(\d{4,})/);
  return match ? Number(match[1]) : NaN;
}

function shortPosition(player) {
  return player?.position?.abbreviation || player?.position?.code || player?.allPositions?.[0]?.abbreviation || '';
}

function buildLineup(players, activeBatterId, battingOrderIds = []) {
  const bySlot = new Map();
  const byId = new Map(
    Object.values(players || {})
      .map((player) => [Number(player?.person?.id), player])
      .filter(([id]) => Number.isFinite(id)),
  );

  if (Array.isArray(battingOrderIds) && battingOrderIds.length) {
    for (let i = 0; i < battingOrderIds.length; i += 1) {
      const id = numericPlayerId(battingOrderIds[i]);
      if (!Number.isFinite(id)) continue;
      const player = byId.get(id);
      if (!player) continue;
      bySlot.set(i + 1, player);
    }
  }

  for (const player of Object.values(players || {})) {
    const slot = deriveSlotFromOrder(player?.battingOrder);
    if (!slot) continue;
    const existing = bySlot.get(slot);
    const currentOrder = Number(player?.battingOrder) || 0;
    const existingOrder = Number(existing?.battingOrder) || 0;
    if (!existing || currentOrder >= existingOrder) {
      bySlot.set(slot, player);
    }
  }

  return [...bySlot.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([slot, player]) => ({
      slot,
      id: player?.person?.id ?? null,
      name: lastName(player?.person?.fullName || player?.person?.lastName || 'Unknown'),
      fullName: player?.person?.fullName || 'Unknown',
      position: shortPosition(player),
      bats: player?.person?.batSide?.code || player?.batSide?.code || player?.batSide?.description || '',
      throws: player?.person?.pitchHand?.code || player?.pitchHand?.code || player?.pitchHand?.description || '',
      avg: battingAverage(player),
      today: battingTodaySummary(player),
      isActive: Number(player?.person?.id) === Number(activeBatterId),
    }));
}


function buildBench(players, lineup) {
  const lineupIds = new Set((lineup || []).map((entry) => Number(entry.id)).filter(Number.isFinite));
  return Object.values(players || {})
    .filter((player) => !isPitcherPlayer(player))
    .filter((player) => !lineupIds.has(Number(player?.person?.id)))
    .map((player) => ({
      id: player?.person?.id ?? null,
      name: lastName(player?.person?.fullName || player?.person?.lastName || 'Unknown'),
      fullName: player?.person?.fullName || 'Unknown',
      position: shortPosition(player),
      bats: player?.person?.batSide?.code || player?.batSide?.code || player?.batSide?.description || '',
      throws: player?.person?.pitchHand?.code || player?.pitchHand?.code || player?.pitchHand?.description || '',
      avg: battingAverage(player),
      today: battingTodaySummary(player),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function isPitcherPlayer(player) {
  const primary = String(shortPosition(player) || '').toUpperCase();
  if (primary === 'P') return true;
  return Array.isArray(player?.allPositions)
    && player.allPositions.some((pos) => String(pos?.abbreviation || pos?.code || '').toUpperCase() === 'P');
}

function buildPitcherEntry(player, forceActive = false, role = 'current') {
  if (!player) return null;
  return {
    id: player?.person?.id ?? null,
    name: lastName(player?.person?.fullName || player?.person?.lastName || 'Unknown'),
    fullName: player?.person?.fullName || 'Unknown',
    ip: pitcherInningsPitched(player),
    era: pitcherEra(player),
    whip: pitcherWhip(player),
    hrAllowed: pitcherHomeRunsAllowed(player),
    gs: pitcherGamesStarted(player),
    gp: pitcherGamesPlayed(player),
    gf: pitcherGamesFinished(player),
    saves: pitcherSaveCount(player),
    so: pitcherStrikeoutCount(player),
    throws: player?.throws || player?.person?.pitchHand?.code || player?.pitchHand?.code || player?.pitchHand?.description || '',
    today: pitcherTodaySummary(player),
    pitches: pitchCount(player),
    isActive: forceActive,
    role,
  };
}

function starterCandidateFromPitchers(allPitchers, probablePitcher, pitcherOrder = []) {
  if (!Array.isArray(allPitchers) || !allPitchers.length) return null;
  if (probablePitcher?.id) {
    const probableMatch = allPitchers.find((player) => Number(player?.person?.id) === Number(probablePitcher.id));
    if (probableMatch) return probableMatch;
  }

  const byWorkload = [...allPitchers]
    .map((player) => ({
      player,
      seasonOuts: inningsToOuts(player?.seasonStats?.pitching?.inningsPitched),
      outs: inningsToOuts(player?.stats?.pitching?.inningsPitched),
      pitches: pitchCount(player),
    }))
    .sort((a, b) => {
      if (b.seasonOuts !== a.seasonOuts) return b.seasonOuts - a.seasonOuts;
      if (b.outs !== a.outs) return b.outs - a.outs;
      if (b.pitches !== a.pitches) return b.pitches - a.pitches;
      return String(a.player?.person?.fullName || '').localeCompare(String(b.player?.person?.fullName || ''));
    });
  if (byWorkload[0]?.player) return byWorkload[0].player;

  const orderedIds = Array.isArray(pitcherOrder) ? pitcherOrder.map((id) => Number(id)).filter(Number.isFinite) : [];
  for (const pitcherId of orderedIds) {
    const orderedMatch = allPitchers.find((player) => Number(player?.person?.id) === pitcherId);
    if (orderedMatch) return orderedMatch;
  }

  return allPitchers[0] || null;
}

function buildPitchingStaff(players, activePitcherId, probablePitcher, pitcherOrder = []) {
  const allPitchers = Object.values(players || {}).filter(isPitcherPlayer);
  const activeNumericId = Number(activePitcherId);
  const activePlayer = Number.isFinite(activeNumericId) ? allPitchers.find((player) => Number(player?.person?.id) === activeNumericId) : null;
  let current = buildPitcherEntry(activePlayer, true, 'current');
  const starterPlayer = starterCandidateFromPitchers(allPitchers, probablePitcher, pitcherOrder);

  if (!current && probablePitcher?.id) {
    const probablePlayer = allPitchers.find((player) => Number(player?.person?.id) === Number(probablePitcher.id));
    current = buildPitcherEntry(probablePlayer, true, 'starter') || {
      id: probablePitcher.id,
      name: lastName(probablePitcher.fullName || 'Unknown'),
      fullName: probablePitcher.fullName || 'Unknown',
      ip: '0.0',
      era: '---',
      whip: '---',
      hrAllowed: 0,
      throws: probablePitcher.pitchHand?.code || probablePitcher.pitchHand?.description || '',
      today: 'Not in yet',
      pitches: 0,
      isActive: true,
      role: 'starter',
    };
  }
  if (!current && starterPlayer) {
    current = buildPitcherEntry(starterPlayer, true, 'starter');
  }

  const bullpen = allPitchers
    .filter((player) => Number(player?.person?.id) !== Number(current?.id))
    .map((player) => buildPitcherEntry(player, false, 'bullpen'))
    .filter(Boolean)
    .sort((a, b) => {
      const aToday = a.today !== 'Unused today' ? 1 : 0;
      const bToday = b.today !== 'Unused today' ? 1 : 0;
      if (bToday !== aToday) return bToday - aToday;
      if (b.pitches !== a.pitches) return b.pitches - a.pitches;
      return a.name.localeCompare(b.name);
    });

  return { current, bullpen };
}

function lineupEntryCount(lineup) {
  const away = Array.isArray(lineup?.away) ? lineup.away.length : 0;
  const home = Array.isArray(lineup?.home) ? lineup.home.length : 0;
  const awayBench = Array.isArray(lineup?.awayBench) ? lineup.awayBench.length : 0;
  const homeBench = Array.isArray(lineup?.homeBench) ? lineup.homeBench.length : 0;
  return away + home + awayBench + homeBench;
}

function hasLineupData(lineup) {
  return lineupEntryCount(lineup) > 0;
}

function normalizeLineupForDisplay(lineup) {
  const safe = lineup || { away: [], home: [], awayBench: [], homeBench: [] };
  const away = Array.isArray(safe.away) ? [...safe.away] : [];
  const home = Array.isArray(safe.home) ? [...safe.home] : [];
  const awayBench = Array.isArray(safe.awayBench) ? [...safe.awayBench] : [];
  const homeBench = Array.isArray(safe.homeBench) ? [...safe.homeBench] : [];

  if (!away.length && awayBench.length) {
    const promoted = awayBench.slice(0, 9).map((entry, idx) => ({ ...entry, slot: idx + 1 }));
    away.push(...promoted);
  }
  if (!home.length && homeBench.length) {
    const promoted = homeBench.slice(0, 9).map((entry, idx) => ({ ...entry, slot: idx + 1 }));
    home.push(...promoted);
  }

  const awayIds = new Set(away.map((entry) => Number(entry?.id)).filter(Number.isFinite));
  const homeIds = new Set(home.map((entry) => Number(entry?.id)).filter(Number.isFinite));
  const awayBenchFiltered = awayBench.filter((entry) => !awayIds.has(Number(entry?.id)));
  const homeBenchFiltered = homeBench.filter((entry) => !homeIds.has(Number(entry?.id)));

  return { away, home, awayBench: awayBenchFiltered, homeBench: homeBenchFiltered };
}

function chooseBetterLineup(primary, secondary) {
  if (!primary && !secondary) return { away: [], home: [], awayBench: [], homeBench: [] };
  if (!primary) return secondary;
  if (!secondary) return primary;
  return lineupEntryCount(primary) >= lineupEntryCount(secondary) ? primary : secondary;
}

function pitchingEntryCount(side) {
  const current = side?.current ? 1 : 0;
  const bullpen = Array.isArray(side?.bullpen) ? side.bullpen.length : 0;
  return current + bullpen;
}

function pitchingTotalCount(pitching) {
  return pitchingEntryCount(pitching?.away) + pitchingEntryCount(pitching?.home);
}

function chooseBetterPitchingSide(primary, secondary) {
  if (!primary && !secondary) return { current: null, bullpen: [] };
  if (!primary) return secondary;
  if (!secondary) return primary;
  return pitchingEntryCount(primary) >= pitchingEntryCount(secondary) ? primary : secondary;
}

function chooseBetterPitching(primary, secondary) {
  if (!primary && !secondary) return { away: { current: null, bullpen: [] }, home: { current: null, bullpen: [] } };
  if (!primary) return secondary;
  if (!secondary) return primary;
  return {
    away: chooseBetterPitchingSide(primary.away, secondary.away),
    home: chooseBetterPitchingSide(primary.home, secondary.home),
  };
}

function tickerQuality(ticker) {
  if (!Array.isArray(ticker) || !ticker.length) return 0;
  const first = String(ticker[0]?.text || '').trim().toLowerCase();
  if (!first) return 0;
  if (first.includes('awaiting first pitch')) return 1;
  return Math.min(5, ticker.length) + 1;
}

function chooseBetterTicker(primary, secondary) {
  return tickerQuality(primary) >= tickerQuality(secondary) ? (primary || []) : (secondary || []);
}

function scoreCardData(card) {
  if (!card) return 0;
  const lineup = lineupEntryCount(card.lineup);
  const pitching = pitchingTotalCount(card.pitching);
  const ticker = tickerQuality(card.ticker);
  const lookup = Object.keys(card.playerLookup || {}).length;
  const awayScore = Number(card.awayScore);
  const homeScore = Number(card.homeScore);
  const scoreKnown = Number.isFinite(awayScore) && Number.isFinite(homeScore) ? 3 : 0;
  const playKnown = isPlaceholderPlay(card.lastPlay) ? 0 : 2;
  return lineup + pitching + ticker + Math.min(lookup, 25) + scoreKnown + playKnown;
}

function chooseBestGameCard(existing, incoming) {
  if (!existing) return incoming;
  if (!incoming) return existing;

  const existingFinal = isCompletedGameCard(existing);
  const incomingFinal = isCompletedGameCard(incoming);
  const incomingHasAwayScore = Number.isFinite(Number(incoming.awayScore));
  const incomingHasHomeScore = Number.isFinite(Number(incoming.homeScore));
  const pregame = shouldPreferProbablePitcher(incoming) || shouldPreferProbablePitcher(existing);

  if (existingFinal || incomingFinal) {
    const finalized = incomingFinal
      ? normalizeCompletedCard(mergeFinishedGameState(incoming, existing))
      : normalizeCompletedCard(existing);
    const canReplaceFinalScore = incomingFinal || !existingFinal;
    return {
      ...finalized,
      awayScore: pregame ? '-' : (canReplaceFinalScore && incomingHasAwayScore ? incoming.awayScore : finalized.awayScore),
      homeScore: pregame ? '-' : (canReplaceFinalScore && incomingHasHomeScore ? incoming.homeScore : finalized.homeScore),
      lineup: chooseBetterLineup(finalized.lineup, existing.lineup),
      pitching: chooseBetterPitching(finalized.pitching, existing.pitching),
      ticker: chooseBetterTicker(finalized.ticker, existing.ticker),
      lastPlay: !isPlaceholderPlay(finalized.lastPlay) ? finalized.lastPlay : (existing.lastPlay || incoming.lastPlay || 'Final'),
      awayStreak: finalized.awayStreak || incoming.awayStreak || existing.awayStreak || '',
      homeStreak: finalized.homeStreak || incoming.homeStreak || existing.homeStreak || '',
      playerLookup: { ...(existing.playerLookup || {}), ...(incoming.playerLookup || {}) },
    };
  }

  const incomingScore = scoreCardData(incoming);
  const existingScore = scoreCardData(existing);
  const preferred = incomingScore >= existingScore ? incoming : existing;
  const fallback = preferred === incoming ? existing : incoming;

  return {
    ...fallback,
    ...preferred,
    awayScore: pregame ? '-' : (Number.isFinite(Number(preferred.awayScore)) ? preferred.awayScore : fallback.awayScore),
    homeScore: pregame ? '-' : (Number.isFinite(Number(preferred.homeScore)) ? preferred.homeScore : fallback.homeScore),
    lineup: chooseBetterLineup(preferred.lineup, fallback.lineup),
    pitching: chooseBetterPitching(preferred.pitching, fallback.pitching),
    ticker: chooseBetterTicker(preferred.ticker, fallback.ticker),
    lastPlay: !isPlaceholderPlay(preferred.lastPlay) ? preferred.lastPlay : (fallback.lastPlay || preferred.lastPlay),
    awayStreak: preferred.awayStreak || fallback.awayStreak || '',
    homeStreak: preferred.homeStreak || fallback.homeStreak || '',
    playerLookup: { ...(fallback.playerLookup || {}), ...(preferred.playerLookup || {}) },
  };
}

function mergeCardsWithArchive(cards, archivedCards) {
  const archivedByPk = new Map((archivedCards || []).map((card) => [String(card.gamePk), card]));
  return cards.map((card) => chooseBestGameCard(archivedByPk.get(String(card.gamePk)), card));
}

function emptyLineupData() {
  return { away: [], home: [], awayBench: [], homeBench: [] };
}

function emptyPitchingData() {
  return { away: { current: null, bullpen: [] }, home: { current: null, bullpen: [] } };
}

function normalizeBoxscorePayload(rawBox) {
  return rawBox?.teams ? rawBox : rawBox?.liveData?.boxscore || {};
}

function buildGameDataFromBoxscore(boxscore, game, options = {}) {
  const activePlay = options.activePlay || null;
  const gamePlayers = options.gamePlayers || {};
  const awayAbbrev = canonicalTeamAbbrev(options.awayAbbrev || game?.teams?.away?.team?.abbreviation || game?.away || 'AWAY');
  const homeAbbrev = canonicalTeamAbbrev(options.homeAbbrev || game?.teams?.home?.team?.abbreviation || game?.home || 'HOME');
  const awayColor = options.awayColor || getTeamColor(awayAbbrev);
  const homeColor = options.homeColor || getTeamColor(homeAbbrev);
  const battingSide = options.battingSide || 'away';
  const awayProbablePitcher = options?.probablePitchers?.away || game?.probablePitchers?.away || game?.teams?.away?.probablePitcher || null;
  const homeProbablePitcher = options?.probablePitchers?.home || game?.probablePitchers?.home || game?.teams?.home?.probablePitcher || null;
  const awayPlayers = boxscore?.teams?.away?.players || {};
  const homePlayers = boxscore?.teams?.home?.players || {};
  const awayPitcherOrder = boxscore?.teams?.away?.pitchers || [];
  const homePitcherOrder = boxscore?.teams?.home?.pitchers || [];
  const awayOrder = boxscore?.teams?.away?.battingOrder || boxscore?.teams?.away?.batters || [];
  const homeOrder = boxscore?.teams?.home?.battingOrder || boxscore?.teams?.home?.batters || [];
  const awayLineup = buildLineup(awayPlayers, activePlay?.matchup?.batter?.id, awayOrder);
  const homeLineup = buildLineup(homePlayers, activePlay?.matchup?.batter?.id, homeOrder);

  return {
    lineup: {
      away: awayLineup,
      home: homeLineup,
      awayBench: buildBench(awayPlayers, awayLineup),
      homeBench: buildBench(homePlayers, homeLineup),
    },
    pitching: {
      away: buildPitchingStaff(
        awayPlayers,
        battingSide === 'home' ? activePlay?.matchup?.pitcher?.id : awayProbablePitcher?.id,
        awayProbablePitcher,
        awayPitcherOrder,
      ),
      home: buildPitchingStaff(
        homePlayers,
        battingSide === 'away' ? activePlay?.matchup?.pitcher?.id : homeProbablePitcher?.id,
        homeProbablePitcher,
        homePitcherOrder,
      ),
    },
    playerLookup: {
      ...buildPlayerLookup(awayPlayers, gamePlayers, awayAbbrev, awayColor, getLogoPath(awayAbbrev)),
      ...buildPlayerLookup(homePlayers, gamePlayers, homeAbbrev, homeColor, getLogoPath(homeAbbrev)),
    },
  };
}

function lineupCount(lineup) {
  const away = Array.isArray(lineup?.away) ? lineup.away.length : 0;
  const home = Array.isArray(lineup?.home) ? lineup.home.length : 0;
  return away + home;
}

function isCompletedGameCard(card) {
  const s = String(card?.status || '').toLowerCase();
  const i = String(card?.inning || '').toLowerCase();
  const sh = String(card?.inningShort || '').toLowerCase();
  return s.includes('final') || i.includes('final') || sh.includes('final');
}

function normalizeCompletedCard(card) {
  if (!isCompletedGameCard(card)) return card;
  return {
    ...card,
    status: 'Final',
    inning: 'Final',
    inningShort: 'Final',
    balls: 0,
    strikes: 0,
    outs: 0,
  };
}

function isPlaceholderPlay(text) {
  const t = String(text || '').trim().toLowerCase();
  return !t || t.includes('awaiting first pitch');
}

function mergeFinishedGameState(card, cached) {
  if (!cached) return card;
  const cachedLineupCount = (cached?.lineup?.away?.length || 0) + (cached?.lineup?.home?.length || 0);
  const cachedPitchCount = (cached?.pitching?.away?.bullpen?.length || 0) + (cached?.pitching?.home?.bullpen?.length || 0)
    + (cached?.pitching?.away?.current ? 1 : 0) + (cached?.pitching?.home?.current ? 1 : 0);
  const cachedTickerGood = Array.isArray(cached?.ticker) && cached.ticker.length && !isPlaceholderPlay(cached.ticker[0]?.text);
  const cardTickerGood = Array.isArray(card?.ticker) && card.ticker.length && !isPlaceholderPlay(card.ticker[0]?.text);
  const ticker = cachedTickerGood ? cached.ticker : (cardTickerGood ? card.ticker : (cached?.ticker?.length ? cached.ticker : card.ticker));
  const lastPlay = !isPlaceholderPlay(card?.lastPlay) ? card.lastPlay
    : (!isPlaceholderPlay(cached?.lastPlay) ? cached.lastPlay : 'Final');
  return {
    ...card,
    awayPitcher: cached.awayPitcher || card.awayPitcher,
    homePitcher: cached.homePitcher || card.homePitcher,
    awayHitter: cached.awayHitter || card.awayHitter,
    homeHitter: cached.homeHitter || card.homeHitter,
    ticker,
    lastPlay,
    balls: cached.balls ?? card.balls,
    strikes: cached.strikes ?? card.strikes,
    outs: cached.outs ?? card.outs,
    bases: cached.bases || card.bases,
    lineup: cachedLineupCount > 0 ? cached.lineup : card.lineup,
    pitching: cachedPitchCount > 0 ? cached.pitching : card.pitching,
    awayStreak: card.awayStreak || cached.awayStreak || '',
    homeStreak: card.homeStreak || cached.homeStreak || '',
    playerLookup: { ...(cached.playerLookup || {}), ...(card.playerLookup || {}) },
  };
}

function resolveActivePlay(game, currentPlay, allPlays) {
  if (game?.status?.abstractGameState === 'Final' && allPlays.length) return allPlays[allPlays.length - 1];
  if (currentPlay?.matchup) return currentPlay;
  if (allPlays.length) return allPlays[allPlays.length - 1];
  return game?.status?.abstractGameState === 'Final' ? null : currentPlay || null;
}

function betPropDefinition(type) {
  return BET_PROP_DEFS[type] || { label: String(type || 'Prop').toUpperCase(), multiLabel: String(type || 'Prop').toUpperCase(), statKind: 'batting', statKey: '', activeRole: 'batter' };
}

function normalizeBetTarget(target) {
  const value = Math.floor(Number(target));
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function betPropLabel(type, target = 1) {
  const prop = betPropDefinition(type);
  return normalizeBetTarget(target) > 1 ? prop.multiLabel : prop.label;
}

function formatBetLegProp(leg) {
  const target = normalizeBetTarget(leg?.target);
  const label = betPropLabel(leg?.propType || leg?.type, target);
  return target > 1 ? `${target}+ ${label}` : label;
}

function queueTextSelection(input) {
  if (!input) return;
  requestAnimationFrame(() => {
    if (document.activeElement !== input) return;
    try {
      input.select();
    } catch {}
    try {
      input.setSelectionRange(0, String(input.value || '').length);
    } catch {}
  });
}

function focusBetPlayerSearch() {
  if (!betPlayerSearchEl) return;
  betPlayerSearchEl.focus();
  queueTextSelection(betPlayerSearchEl);
}

function normalizeGamePickSide(side) {
  return side === 'home' ? 'home' : side === 'away' ? 'away' : '';
}

function scoreStateForGame(game) {
  const awayScore = Number(game?.awayScore);
  const homeScore = Number(game?.homeScore);
  const scoreKnown = Number.isFinite(awayScore) && Number.isFinite(homeScore);
  let leaderSide = '';
  if (scoreKnown) {
    if (awayScore > homeScore) leaderSide = 'away';
    else if (homeScore > awayScore) leaderSide = 'home';
  }
  return { awayScore, homeScore, scoreKnown, leaderSide };
}

function createGamePickLeg(game, side) {
  const normalizedSide = normalizeGamePickSide(side);
  if (!game || !normalizedSide) return null;
  const isAway = normalizedSide === 'away';
  const teamAbbrev = isAway ? game.away : game.home;
  const opponentAbbrev = isAway ? game.home : game.away;
  return {
    type: 'teamWin',
    propType: 'teamWin',
    target: 1,
    gamePk: game.gamePk,
    side: normalizedSide,
    teamAbbrev,
    opponentAbbrev,
    teamLogo: isAway ? game.awayLogo : game.homeLogo,
    teamColor: isAway ? game.awayColor : game.homeColor,
  };
}

function getPendingGamePickEntries(games = latestRenderedGames) {
  const cards = games?.length ? games : latestRenderedGames;
  return [...pendingGamePickSelections.entries()]
    .map(([gamePk, side]) => {
      const game = cards.find((entry) => String(entry.gamePk) === String(gamePk));
      if (!game) return null;
      return createGamePickLeg(game, side);
    })
    .filter(Boolean);
}

function clearPendingGamePicks({ render = true } = {}) {
  pendingGamePickSelections = new Map();
  if (render) renderPendingGamePicks(latestRenderedGames);
}

function setPendingGamePick(game, side) {
  if (!game?.gamePk) return;
  const normalizedSide = normalizeGamePickSide(side);
  const key = String(game.gamePk);
  if (!normalizedSide) {
    pendingGamePickSelections.delete(key);
  } else if (pendingGamePickSelections.get(key) === normalizedSide) {
    pendingGamePickSelections.delete(key);
  } else {
    pendingGamePickSelections.set(key, normalizedSide);
  }
  renderPendingGamePicks(latestRenderedGames);
}

function closeGamePickDialog() {
  if (!gamePickDialogEl) return;
  if (typeof gamePickDialogEl.close === 'function') {
    try {
      gamePickDialogEl.close();
      return;
    } catch {}
  }
  gamePickDialogEl.removeAttribute('open');
}

function openGamePickDialog() {
  const picks = getPendingGamePickEntries(latestRenderedGames);
  if (!picks.length || !gamePickDialogEl || !gamePickDialogSummaryEl || !gamePickDialogOddsEl || !gamePickDialogAmountEl) return;

  gamePickDialogSummaryEl.replaceChildren();
  for (const pick of picks) {
    const chip = document.createElement('div');
    chip.className = 'game-pick-dialog-chip';
    const logo = document.createElement('img');
    logo.className = 'game-pick-dialog-logo';
    setLogo(logo, pick.teamLogo || getLogoPath(pick.teamAbbrev), `${displayTeamAbbrev(pick.teamAbbrev)} logo`);
    const text = document.createElement('span');
    text.textContent = `${displayTeamAbbrev(pick.teamAbbrev)} WIN`;
    chip.append(logo, text);
    gamePickDialogSummaryEl.appendChild(chip);
  }

  gamePickDialogOddsEl.value = String(betOddsEl?.value || '').trim();
  gamePickDialogAmountEl.value = String(betAmountEl?.value || '').trim();

  if (typeof gamePickDialogEl.showModal === 'function') {
    if (!gamePickDialogEl.open) gamePickDialogEl.showModal();
  } else {
    gamePickDialogEl.setAttribute('open', 'open');
  }

  requestAnimationFrame(() => {
    gamePickDialogOddsEl.focus();
    queueTextSelection(gamePickDialogOddsEl);
  });
}

function buildGamePickBetDescription(picks = []) {
  return `${picks.map((pick) => displayTeamAbbrev(pick.teamAbbrev)).join(' + ')} to win`;
}

function combinedDraftBetLegs(games = latestRenderedGames) {
  return [
    ...getPendingGamePickEntries(games).map((pick) => ({ ...pick })),
    ...draftBetLegs.map((leg) => ({ ...leg })),
  ];
}

function buildBetDescriptionFromLegs(desc, legs = []) {
  const cleanDesc = cleanSummary(desc);
  const autoDesc = buildBetSlipText(legs);
  if (!cleanDesc) return autoDesc;
  const playerOnlyDesc = buildBetSlipText(draftBetLegs);
  return cleanDesc === playerOnlyDesc ? (autoDesc || cleanDesc) : cleanDesc;
}

function addBetToLog({ desc, odds, amount, legs = [] }) {
  const cleanOdds = String(odds || '').trim();
  const numericAmount = Number(amount);
  const cleanDesc = cleanSummary(desc);
  if (!cleanDesc || !cleanOdds || !Number.isFinite(numericAmount) || numericAmount <= 0) return false;
  const payout = oddsToPayout(cleanOdds, numericAmount);
  if (!Number.isFinite(payout) || payout <= 0) return false;
  const bets = getBets();
  bets.unshift({
    id: String(Date.now()),
    desc: cleanDesc,
    odds: cleanOdds,
    amount: numericAmount,
    payout,
    ts: Date.now(),
    legs: Array.isArray(legs) ? legs.map((leg) => ({ ...leg })) : [],
  });
  saveBets(bets);
  return true;
}

function saveGamePickBetEntry(picks, odds, amount) {
  return addBetToLog({
    desc: buildGamePickBetDescription(picks),
    odds,
    amount,
    legs: picks,
  });
}

function focusBetInputField(field) {
  if (field === 'odds') {
    betOddsEl?.focus();
    queueTextSelection(betOddsEl);
    return;
  }
  if (field === 'amount') {
    betAmountEl?.focus();
    queueTextSelection(betAmountEl);
    return;
  }
  betDescEl?.focus();
  queueTextSelection(betDescEl);
}

function buildBetSubmissionPayload(options = {}) {
  const {
    descOverride = null,
    oddsOverride = null,
    amountOverride = null,
    includePendingGamePicks = true,
  } = options;
  const pendingPicks = includePendingGamePicks ? getPendingGamePickEntries(latestRenderedGames) : [];
  const legs = [
    ...pendingPicks.map((pick) => ({ ...pick })),
    ...draftBetLegs.map((leg) => ({ ...leg })),
  ];
  return {
    pendingPicks,
    legs,
    desc: buildBetDescriptionFromLegs(descOverride ?? betDescEl?.value ?? '', legs),
    odds: String(oddsOverride ?? betOddsEl?.value ?? '').trim(),
    amount: Number(amountOverride ?? betAmountEl?.value),
  };
}

function submitBetInput(options = {}) {
  const payload = buildBetSubmissionPayload(options);
  if (!payload.desc) {
    focusBetInputField('desc');
    return false;
  }
  if (!payload.odds) {
    focusBetInputField('odds');
    return false;
  }
  if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
    focusBetInputField('amount');
    return false;
  }
  if (!addBetToLog({
    desc: payload.desc,
    odds: payload.odds,
    amount: payload.amount,
    legs: payload.legs,
  })) return false;

  betFormEl?.reset();
  clearDraftBetSlip();
  clearPendingGamePicks({ render: false });
  renderPendingGamePicks(latestRenderedGames);
  renderBetList();
  return true;
}

function canSubmitPendingGamePicksFromMainForm(desc, pendingPicks = getPendingGamePickEntries(latestRenderedGames)) {
  if (!Array.isArray(pendingPicks) || !pendingPicks.length) return false;
  if (draftBetLegs.length) return false;
  const cleanDesc = String(desc || '').trim();
  return !cleanDesc || cleanDesc === buildGamePickBetDescription(pendingPicks);
}

function isGamePickLeg(leg) {
  return (leg?.propType || leg?.type) === 'teamWin';
}

function isGamePickBet(bet) {
  if (bet?.betType === 'gamePicks') return true;
  return Array.isArray(bet?.legs) && bet.legs.length > 0 && bet.legs.every((leg) => isGamePickLeg(leg));
}

function renderPendingGamePicks(games = latestRenderedGames) {
  if (!gamePickDraftListEl || !confirmGamePicksBtnEl || !clearGamePicksBtnEl) return;
  const picks = getPendingGamePickEntries(games);
  if (betDescEl) {
    const shouldRelaxRequired = picks.length > 0 && draftBetLegs.length === 0;
    betDescEl.required = !shouldRelaxRequired;
    if (shouldRelaxRequired && !String(betDescEl.value || '').trim()) {
      betDescEl.placeholder = 'Game picks selected below. Enter odds and amount, then click Add, or use Confirm Game Picks.';
    } else {
      betDescEl.placeholder = 'Build legs below or type a manual bet';
    }
  }
  gamePickDraftListEl.replaceChildren();
  if (!picks.length) {
    gamePickDraftListEl.textContent = 'Left-click a team on the scoreboard to mark them as your winner pick.';
    confirmGamePicksBtnEl.disabled = true;
    clearGamePicksBtnEl.disabled = true;
  } else {
    for (const pick of picks) {
      const item = document.createElement('div');
      item.className = 'game-pick-draft-item';
      item.title = `${displayTeamAbbrev(pick.teamAbbrev)} to win`;
      const logo = document.createElement('img');
      logo.className = 'game-pick-draft-logo';
      setLogo(logo, pick.teamLogo || getLogoPath(pick.teamAbbrev), `${displayTeamAbbrev(pick.teamAbbrev)} logo`);
      const text = document.createElement('span');
      text.textContent = `${displayTeamAbbrev(pick.teamAbbrev)} WIN`;
      item.append(logo, text);
      gamePickDraftListEl.appendChild(item);
    }
    confirmGamePicksBtnEl.disabled = false;
    clearGamePicksBtnEl.disabled = false;
  }
  syncAllCardGamePickStates(games);
}

function createBetProgressBoxes(completed, total, status = 'pending') {
  const totalCount = Math.max(0, Math.floor(Number(total)) || 0);
  const completeCount = Math.max(0, Math.min(totalCount, Math.floor(Number(completed)) || 0));
  const wrap = document.createElement('span');
  wrap.className = `bet-progress-boxes bet-progress-${status}`;
  wrap.setAttribute('role', 'img');
  wrap.setAttribute('aria-label', `${completeCount} of ${totalCount}`);
  for (let index = 0; index < totalCount; index += 1) {
    const box = document.createElement('span');
    box.className = 'bet-progress-box';
    if (index < completeCount) {
      box.classList.add('is-complete');
      box.textContent = '✓';
    }
    wrap.appendChild(box);
  }
  return wrap;
}

function buildBetStatusPill(resolved) {
  const statusPill = document.createElement('span');
  statusPill.className = 'bet-status-pill';
  const legs = resolved?.legs || [];
  if (legs.length > 1) {
    const completed = legs.filter((leg) => leg.status === 'hit').length;
    const label = resolved.status === 'hit' ? 'PARLAY HIT'
      : resolved.status === 'miss' ? 'PARLAY MISS'
      : 'PARLAY';
    statusPill.append(document.createTextNode(`${label} `), createBetProgressBoxes(completed, legs.length, resolved.status));
    return statusPill;
  }
  statusPill.textContent = resolved?.label || 'MANUAL';
  return statusPill;
}

function formatBetRate(value, digits = 3) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '.000';
  return numeric.toFixed(digits).replace(/^0\./, '.');
}

function ordinalNumber(value) {
  const num = Math.floor(Number(value));
  if (!Number.isFinite(num) || num <= 0) return '';
  const mod100 = num % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${num}th`;
  switch (num % 10) {
    case 1: return `${num}st`;
    case 2: return `${num}nd`;
    case 3: return `${num}rd`;
    default: return `${num}th`;
  }
}

function summarizeLastFiveBatting(splits = []) {
  const details = summarizeLastFiveBattingDetails(splits);
  if (!details) return null;
  return details.totalsRows.map(([label, value]) => `${label}${label.startsWith('L') ? ':' : ''} ${value}`);
}

function gameIsLiveForRecentHistory(game) {
  if (!game) return false;
  if (shouldPreferProbablePitcher(game)) return false;
  const abstractState = String(game?.status?.abstractGameState || '').toLowerCase();
  return abstractState !== 'final';
}

function statLogSplitGamePk(split) {
  const value = split?.game?.gamePk
    ?? split?.game?.pk
    ?? split?.gamePk
    ?? split?.game?.id
    ?? split?.game?.game?.pk
    ?? null;
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function filteredRecentHistorySplits(splits = [], game = null) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const eligible = listify(splits)
    .filter((split) => split?.date && String(split.date) <= String(selectedDate))
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  if (!gameIsLiveForRecentHistory(game)) return eligible;
  const currentDate = calendarDateOnly(game?.officialDate || game?.gameDate || selectedDate, selectedDate);
  if (!currentDate || currentDate !== String(selectedDate)) return eligible;
  const currentGamePk = Number(game?.gamePk);
  let skippedSameDayFallback = false;
  return eligible.filter((split) => {
    if (String(split?.date || '') !== currentDate) return true;
    const splitGamePk = statLogSplitGamePk(split);
    if (Number.isFinite(currentGamePk) && Number.isFinite(splitGamePk) && splitGamePk === currentGamePk) return false;
    if (!skippedSameDayFallback) {
      skippedSameDayFallback = true;
      return false;
    }
    return true;
  });
}

function summarizeLastFiveBattingDetails(splits = [], game = null) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const eligibleGames = filteredRecentHistorySplits(splits, game);
  const games = eligibleGames.slice(0, 5);
  if (!games.length) return null;
  const totals = games.reduce((sum, split) => {
    const stat = split?.stat || {};
    sum.games += 1;
    sum.atBats += statNumber(stat.atBats);
    sum.hits += statNumber(stat.hits);
    sum.hr += statNumber(stat.homeRuns);
    sum.rbi += statNumber(stat.rbi);
    sum.walks += statNumber(stat.baseOnBalls ?? stat.walks);
    sum.so += statNumber(stat.strikeOuts);
    sum.totalBases += statNumber(stat.totalBases) || totalBasesFromBatting(stat);
    return sum;
  }, { games: 0, atBats: 0, hits: 0, hr: 0, rbi: 0, walks: 0, so: 0, totalBases: 0 });
  const avg = totals.atBats > 0 ? totals.hits / totals.atBats : 0;
  const obpDenominator = totals.atBats + totals.walks;
  const obp = obpDenominator > 0 ? (totals.hits + totals.walks) / obpDenominator : 0;
  const slg = totals.atBats > 0 ? totals.totalBases / totals.atBats : 0;
  const ops = obp + slg;
  let hitStreak = 0;
  for (const split of eligibleGames) {
    const stat = split?.stat || {};
    const hits = statNumber(stat.hits);
    const atBats = statNumber(stat.atBats);
    if (hits > 0) {
      hitStreak += 1;
      continue;
    }
    if (atBats > 0) break;
  }
  const lastSplit = games[0];
  const lastStat = lastSplit?.stat || {};
  const lastOpponent = displayTeamAbbrev(
    lastSplit?.opponent?.abbreviation
      || lastSplit?.opponent?.teamCode
      || lastSplit?.opponent?.name
      || lastSplit?.opponentTeam?.abbreviation
      || lastSplit?.opponentTeam?.name
      || '',
  );
  return {
    feature: {
      label: 'LAST GAME',
      meta: [formatLeadersDateLabel(lastSplit?.date || selectedDate), lastOpponent ? `vs ${lastOpponent}` : ''].filter(Boolean).join(' '),
      main: `${statNumber(lastStat.hits)}-${statNumber(lastStat.atBats)}`,
      side: `TB ${statNumber(lastStat.totalBases) || totalBasesFromBatting(lastStat)}`,
      chips: [
        `HR ${statNumber(lastStat.homeRuns)}`,
        `RBI ${statNumber(lastStat.rbi)}`,
        `BB ${statNumber(lastStat.baseOnBalls ?? lastStat.walks)}`,
        `K ${statNumber(lastStat.strikeOuts)}`,
      ],
    },
    lastGame: {
      date: formatLeadersDateLabel(lastSplit?.date || selectedDate),
      opponent: lastOpponent,
      hits: statNumber(lastStat.hits),
      atBats: statNumber(lastStat.atBats),
      totalBases: statNumber(lastStat.totalBases) || totalBasesFromBatting(lastStat),
      hr: statNumber(lastStat.homeRuns),
      rbi: statNumber(lastStat.rbi),
      walks: statNumber(lastStat.baseOnBalls ?? lastStat.walks),
      so: statNumber(lastStat.strikeOuts),
    },
    totals: {
      games: totals.games,
      atBats: totals.atBats,
      hits: totals.hits,
      homeRuns: totals.hr,
      rbi: totals.rbi,
      walks: totals.walks,
      strikeOuts: totals.so,
      totalBases: totals.totalBases,
      xbh: Math.max(0, totals.totalBases - totals.hits),
    },
    metrics: {
      avg,
      obp,
      slg,
      ops,
    },
    hitStreak,
    totalsRows: [
      [`L${totals.games}`, `${totals.hits}-${totals.atBats}`],
      ['AVG', formatBetRate(avg)],
      ['SLG', formatBetRate(slg)],
      ['HR', totals.hr],
      ['RBI', totals.rbi],
      ['K', totals.so],
    ],
  };
}

function summarizeLastFivePitchingStartsDetails(splits = [], game = null) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const starts = filteredRecentHistorySplits(splits, game)
    .filter((split) => statNumber(split?.stat?.gamesStarted) > 0)
    .slice(0, 5);
  if (!starts.length) return null;
  const totals = starts.reduce((sum, split) => {
    const stat = split?.stat || {};
    sum.starts += 1;
    sum.outs += inningsToOuts(stat.inningsPitched);
    sum.k += statNumber(stat.strikeOuts);
    sum.bb += statNumber(stat.baseOnBalls ?? stat.walks);
    sum.hits += statNumber(stat.hits);
    sum.er += statNumber(stat.earnedRuns);
    sum.pitches += statNumber(stat.numberOfPitches ?? stat.pitchesThrown);
    return sum;
  }, { starts: 0, outs: 0, k: 0, bb: 0, hits: 0, er: 0, pitches: 0 });
  const era = totals.outs > 0 ? (totals.er * 27) / totals.outs : null;
  const whip = totals.outs > 0 ? ((totals.hits + totals.bb) * 3) / totals.outs : null;
  const lastSplit = starts[0];
  const lastStat = lastSplit?.stat || {};
  const lastOpponent = displayTeamAbbrev(
    lastSplit?.opponent?.abbreviation
      || lastSplit?.opponent?.teamCode
      || lastSplit?.opponent?.name
      || lastSplit?.opponentTeam?.abbreviation
      || lastSplit?.opponentTeam?.name
      || '',
  );
  const lastPitches = statNumber(lastStat.numberOfPitches ?? lastStat.pitchesThrown);
  return {
    historyTitle: 'RECENT STARTS',
    feature: {
      label: 'LAST START',
      meta: [formatLeadersDateLabel(lastSplit?.date || selectedDate), lastOpponent ? `vs ${lastOpponent}` : ''].filter(Boolean).join(' '),
      main: `IP ${cleanSummary(lastStat.inningsPitched) || '0.0'}`,
      side: `ER ${statNumber(lastStat.earnedRuns)}`,
      chips: [
        `K ${statNumber(lastStat.strikeOuts)}`,
        `BB ${statNumber(lastStat.baseOnBalls ?? lastStat.walks)}`,
        `H ${statNumber(lastStat.hits)}`,
        lastPitches ? `P ${lastPitches}` : 'P --',
      ],
    },
    totalsRows: [
      [`L${totals.starts} GS`, `${outsToInnings(totals.outs)} IP`],
      ['ERA', formatRateValue(era, 2, false)],
      ['WHIP', formatRateValue(whip, 2, false)],
      ['K', totals.k],
      ['BB', totals.bb],
      ['H', totals.hits],
      ['ER', totals.er],
    ],
  };
}

function playerStatRowsHtml(title, rows = []) {
  const safeRows = rows
    .filter((row) => Array.isArray(row) && row.length >= 2)
    .map(([label, value]) => `
      <tr>
        <th>${escapeHtml(label)}</th>
        <td>${escapeHtml(value)}</td>
      </tr>
    `)
    .join('');
  return `<strong>${escapeHtml(title)}</strong><table class="player-stat-table"><tbody>${safeRows || '<tr><td colspan="2">---</td></tr>'}</tbody></table>`;
}

function splitPlayerStatLine(line) {
  const value = cleanSummary(line);
  if (!value) return ['Info', 'Unavailable'];
  const colonIndex = value.indexOf(':');
  if (colonIndex > 0) return [value.slice(0, colonIndex).trim(), value.slice(colonIndex + 1).trim()];
  const spaceIndex = value.indexOf(' ');
  if (spaceIndex > 0) return [value.slice(0, spaceIndex).trim(), value.slice(spaceIndex + 1).trim()];
  return ['Info', value];
}

function renderRecentBattingHistoryHtml(lines) {
  if (lines && typeof lines === 'object' && !Array.isArray(lines)) {
    const last = lines.feature || null;
    const lastGameHtml = last ? `
      <div class="player-last-game">
        <div class="player-last-game-top">
          <span>${escapeHtml(last.label || 'LAST GAME')}</span>
          <em>${escapeHtml(last.meta || '')}</em>
        </div>
        <div class="player-last-game-line">
          <b>${escapeHtml(last.main || '---')}</b>
          <span>${escapeHtml(last.side || '')}</span>
        </div>
        <div class="player-last-game-chips">
          ${(Array.isArray(last.chips) ? last.chips : []).map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')}
        </div>
      </div>
    ` : '';
    return `<strong>${escapeHtml(lines.historyTitle || 'RECENT HISTORY')}</strong>${lastGameHtml}${playerStatTableHtml(lines.totalsRows || [])}`;
  }
  const rows = Array.isArray(lines) && lines.length ? lines : ['Recent history unavailable'];
  return playerStatRowsHtml('RECENT HISTORY', rows.map(splitPlayerStatLine));
}

function playerStatTableHtml(rows = []) {
  const safeRows = rows
    .filter((row) => Array.isArray(row) && row.length >= 2)
    .map(([label, value]) => `
      <tr>
        <th>${escapeHtml(label)}</th>
        <td>${escapeHtml(value)}</td>
      </tr>
    `)
    .join('');
  return `<table class="player-stat-table"><tbody>${safeRows || '<tr><td colspan="2">---</td></tr>'}</tbody></table>`;
}

async function getBetPlayerLastFiveLines(playerId) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const selectedDate = dateInput.value || formatDate(new Date());
  const key = `${id}:${selectedDate}:hitting`;
  if (betPlayerLastFiveCache.has(key)) return betPlayerLastFiveCache.get(key);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'hitting');
    url.searchParams.set('season', String(seasonForDate(selectedDate)));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    return summarizeLastFiveBatting(response?.stats?.[0]?.splits || []);
  })().catch((error) => {
    betPlayerLastFiveCache.delete(key);
    throw error;
  });
  betPlayerLastFiveCache.set(key, promise);
  return promise;
}

async function getPlayerRecentBattingDetails(playerId, game = null) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const selectedDate = dateInput.value || formatDate(new Date());
  const key = `${id}:${selectedDate}:hitting-details:${gameIsLiveForRecentHistory(game) ? String(game?.gamePk || 'live') : 'default'}`;
  if (betPlayerLastFiveCache.has(key)) return betPlayerLastFiveCache.get(key);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'hitting');
    url.searchParams.set('season', String(seasonForDate(selectedDate)));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    return summarizeLastFiveBattingDetails(response?.stats?.[0]?.splits || [], game);
  })().catch((error) => {
    betPlayerLastFiveCache.delete(key);
    throw error;
  });
  betPlayerLastFiveCache.set(key, promise);
  return promise;
}

async function getPlayerRecentPitchingDetails(playerId, game = null) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const selectedDate = dateInput.value || formatDate(new Date());
  const key = `${id}:${selectedDate}:pitching-starts-details:${gameIsLiveForRecentHistory(game) ? String(game?.gamePk || 'live') : 'default'}`;
  if (betPlayerLastFiveCache.has(key)) return betPlayerLastFiveCache.get(key);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'pitching');
    url.searchParams.set('season', String(seasonForDate(selectedDate)));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    return summarizeLastFivePitchingStartsDetails(response?.stats?.[0]?.splits || [], game);
  })().catch((error) => {
    betPlayerLastFiveCache.delete(key);
    throw error;
  });
  betPlayerLastFiveCache.set(key, promise);
  return promise;
}

function isVeryGoodPitchingAppearance(stat = {}) {
  const outs = inningsToOuts(stat.inningsPitched);
  const earnedRuns = statNumber(stat.earnedRuns);
  const hits = statNumber(stat.hits);
  const walks = statNumber(stat.baseOnBalls ?? stat.walks);
  const strikeOuts = statNumber(stat.strikeOuts);
  const baserunners = hits + walks;
  if (outs >= 15) return earnedRuns <= 2 && (baserunners <= 6 || strikeOuts >= 5);
  if (outs >= 6) return earnedRuns === 0 && baserunners <= 2;
  if (outs >= 3) return earnedRuns === 0 && baserunners <= 1;
  return false;
}

function isBadPitchingAppearance(stat = {}) {
  const outs = inningsToOuts(stat.inningsPitched);
  const earnedRuns = statNumber(stat.earnedRuns);
  const hits = statNumber(stat.hits);
  const walks = statNumber(stat.baseOnBalls ?? stat.walks);
  const homeRuns = statNumber(stat.homeRuns);
  const baserunners = hits + walks;
  if (outs >= 15) return earnedRuns >= 4 || baserunners >= 10 || homeRuns >= 2;
  if (outs >= 6) return earnedRuns >= 2 || baserunners >= 5 || homeRuns >= 1;
  if (outs >= 3) return earnedRuns >= 1 && (baserunners >= 3 || homeRuns >= 1);
  return false;
}

function pitcherFireStreakFromSplits(splits = []) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const appearances = listify(splits)
    .filter((split) => split?.date && String(split.date) <= String(selectedDate))
    .filter((split) => inningsToOuts(split?.stat?.inningsPitched) > 0)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 3);
  let streak = 0;
  for (const appearance of appearances) {
    if (!isVeryGoodPitchingAppearance(appearance?.stat || {})) break;
    streak += 1;
  }
  return Math.min(3, streak);
}

function pitcherColdStreakFromSplits(splits = []) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const appearances = listify(splits)
    .filter((split) => split?.date && String(split.date) <= String(selectedDate))
    .filter((split) => inningsToOuts(split?.stat?.inningsPitched) > 0)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 3);
  let streak = 0;
  for (const appearance of appearances) {
    if (!isBadPitchingAppearance(appearance?.stat || {})) break;
    streak += 1;
  }
  return Math.min(3, streak);
}

async function getPitcherFireStreak(playerId) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return 0;
  const selectedDate = dateInput.value || formatDate(new Date());
  const key = `${id}:${selectedDate}:pitcher-fire-streak`;
  if (pitcherFireStreakCache.has(key)) return pitcherFireStreakCache.get(key);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'pitching');
    url.searchParams.set('season', String(seasonForDate(selectedDate)));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    return pitcherFireStreakFromSplits(response?.stats?.[0]?.splits || []);
  })().catch((error) => {
    pitcherFireStreakCache.delete(key);
    throw error;
  });
  pitcherFireStreakCache.set(key, promise);
  return promise;
}

async function getPitcherColdStreak(playerId) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return 0;
  const selectedDate = dateInput.value || formatDate(new Date());
  const key = `${id}:${selectedDate}:pitcher-cold-streak`;
  if (pitcherColdStreakCache.has(key)) return pitcherColdStreakCache.get(key);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'pitching');
    url.searchParams.set('season', String(seasonForDate(selectedDate)));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    return pitcherColdStreakFromSplits(response?.stats?.[0]?.splits || []);
  })().catch((error) => {
    pitcherColdStreakCache.delete(key);
    throw error;
  });
  pitcherColdStreakCache.set(key, promise);
  return promise;
}

function pitcherFireMarkerHtml(playerId) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return '';
  return `<span class="pitcher-fire-streak" data-pitcher-fire-id="${id}" aria-label="Pitcher hot streak"></span>`;
}

function pitcherColdMarkerHtml(playerId) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return '';
  return `<span class="pitcher-cold-streak" data-pitcher-cold-id="${id}" aria-label="Pitcher cold streak"></span>`;
}

function pitcherHomeRunRatePerNine(pitcher) {
  const outs = inningsToOuts(cleanSummary(pitcher?.ip || pitcher?.pitching?.inningsPitched || pitcher?.seasonStats?.pitching?.inningsPitched || pitcher?.stats?.pitching?.inningsPitched));
  if (outs <= 0) return null;
  return (pitcherHomeRunsAllowed(pitcher) * 27) / outs;
}

function pitcherHomeRunRiskMarkerHtml(pitcher) {
  const hrPerNine = pitcherHomeRunRatePerNine(pitcher);
  if (!Number.isFinite(hrPerNine) || hrPerNine < 0.9) return '';
  return `<span class="pitcher-hr-risk" title="Allowing ${hrPerNine.toFixed(2)} HR/9" aria-label="High home run rate">🥶</span>`;
}

function pitcherNameHtml(pitcher) {
  return `${escapeHtml(pitcher?.fullName || pitcher?.name || 'Unknown')}${handednessHtml(pitcher?.throws || pitcher?.pitchHand?.code || pitcher?.pitchHand?.description)}${pitcherFireMarkerHtml(pitcher?.id)}${pitcherColdMarkerHtml(pitcher?.id)}${pitcherHomeRunRiskMarkerHtml(pitcher)}`;
}

function hydratePitcherFireStreaks(rootEl) {
  const markers = Array.from(rootEl?.querySelectorAll?.('.pitcher-fire-streak[data-pitcher-fire-id]') || []);
  if (!markers.length) return;
  const token = `${Date.now()}:${markers.length}`;
  rootEl.dataset.pitcherFireToken = token;
  const ids = [...new Set(markers.map((marker) => Number(marker.dataset.pitcherFireId)).filter((id) => Number.isFinite(id) && id > 0))];
  for (const marker of markers) {
    marker.textContent = '';
    marker.title = '';
  }
  Promise.all(ids.map((id) => getPitcherFireStreak(id).then((count) => [id, count]).catch(() => [id, 0])))
    .then((results) => {
      if (rootEl.dataset.pitcherFireToken !== token) return;
      const counts = new Map(results);
      for (const marker of markers) {
        const count = Math.max(0, Math.min(3, Number(counts.get(Number(marker.dataset.pitcherFireId))) || 0));
        marker.textContent = count > 0 ? '🔥'.repeat(count) : '';
        marker.title = count > 0 ? `${count} straight strong pitching ${count === 1 ? 'appearance' : 'appearances'}` : '';
      }
    });
}

function hydratePitcherColdStreaks(rootEl) {
  const markers = Array.from(rootEl?.querySelectorAll?.('.pitcher-cold-streak[data-pitcher-cold-id]') || []);
  if (!markers.length) return;
  const token = `${Date.now()}:${markers.length}`;
  rootEl.dataset.pitcherColdToken = token;
  const ids = [...new Set(markers.map((marker) => Number(marker.dataset.pitcherColdId)).filter((id) => Number.isFinite(id) && id > 0))];
  for (const marker of markers) {
    marker.textContent = '';
    marker.title = '';
  }
  Promise.all(ids.map((id) => getPitcherColdStreak(id).then((count) => [id, count]).catch(() => [id, 0])))
    .then((results) => {
      if (rootEl.dataset.pitcherColdToken !== token) return;
      const counts = new Map(results);
      for (const marker of markers) {
        const count = Math.max(0, Math.min(3, Number(counts.get(Number(marker.dataset.pitcherColdId))) || 0));
        marker.textContent = count ? '❄️'.repeat(count) : '';
        marker.title = count ? `Cold streak: ${count} straight poor outings` : '';
      }
    })
    .catch(() => {});
}

function renderBetPlayerLastFive(pill, playerId) {
  const stats = pill.querySelector('.bet-leg-player-stats');
  if (!stats || !playerId) return;
  const token = `${playerId}:${dateInput.value || formatDate(new Date())}:${Date.now()}`;
  stats.dataset.lastFiveToken = token;
  stats.replaceChildren();
  const loading = document.createElement('span');
  loading.textContent = 'L5 loading';
  stats.appendChild(loading);
  getBetPlayerLastFiveLines(playerId)
    .then((lines) => {
      if (stats.dataset.lastFiveToken !== token) return;
      stats.replaceChildren();
      for (const line of lines || ['L5 unavailable']) {
        const row = document.createElement('span');
        row.textContent = line;
        stats.appendChild(row);
      }
    })
    .catch(() => {
      if (stats.dataset.lastFiveToken !== token) return;
      stats.replaceChildren();
      const row = document.createElement('span');
      row.textContent = 'L5 unavailable';
      stats.appendChild(row);
    });
}

function buildBetLegPill(leg) {
  const pill = document.createElement('span');
  const isTeamWin = isGamePickLeg(leg?.leg);
  pill.className = `bet-leg-pill bet-status-${leg.status}${isTeamWin ? ' bet-type-team' : ' bet-type-player'}`;
  if (leg.active) pill.classList.add('bet-leg-pill-active');
  if (leg?.candidate?.playerId) {
    pill.dataset.playerId = String(leg.candidate.playerId);
    pill.dataset.gamePk = String(leg.candidate.gamePk || '');
  }
  if (isTeamWin) {
    pill.dataset.gamePk = String(leg?.candidate?.gamePk || leg?.leg?.gamePk || '');
    pill.title = `${displayTeamAbbrev(leg?.leg?.teamAbbrev)} to win${leg?.label ? ` | ${leg.label}` : ''}`;
    const logo = document.createElement('img');
    logo.className = 'bet-leg-team-logo';
    setLogo(
      logo,
      leg?.candidate?.teamLogo || leg?.leg?.teamLogo || getLogoPath(leg?.leg?.teamAbbrev),
      `${displayTeamAbbrev(leg?.leg?.teamAbbrev)} logo`,
    );
    const goal = document.createElement('span');
    goal.className = 'bet-leg-team-goal';
    goal.textContent = 'WIN';
    pill.append(logo, goal);
    return pill;
  }
  const playerId = leg?.candidate?.playerId || leg?.leg?.playerId;
  const teamAbbrev = leg?.candidate?.teamAbbrev || leg?.leg?.teamAbbrev || '';
  const teamLogo = getLogoPath(teamAbbrev);
  const avatar = document.createElement('img');
  avatar.className = 'bet-leg-player-avatar';
  avatar.alt = `${leg?.leg?.playerName || leg?.candidate?.fullName || 'Player'} headshot`;
  loadStatCardImage(avatar, [
    Number.isFinite(Number(playerId)) ? playerHeadshotUrl(playerId) : '',
    teamLogo,
    'placeholder.png',
  ]);

  const text = document.createElement('span');
  text.className = 'bet-leg-player-text';

  const name = document.createElement('span');
  name.className = 'bet-leg-player-name';
  name.textContent = leg?.leg?.playerName || leg?.candidate?.fullName || 'Unknown';

  const goal = document.createElement('span');
  goal.className = 'bet-leg-player-goal';
  goal.textContent = formatBetLegProp(leg.leg);

  text.append(name, goal);
  pill.append(avatar, text);

  const stats = document.createElement('span');
  stats.className = 'bet-leg-player-stats';

  if (leg.status === 'unmatched') {
    const state = document.createElement('span');
    state.className = 'bet-leg-pill-state';
    state.textContent = leg.label;
    pill.append(state, stats);
    renderBetPlayerLastFive(pill, playerId);
    return pill;
  }

  if (normalizeBetTarget(leg.target) > 1) {
    pill.appendChild(createBetProgressBoxes(Math.min(leg.currentValue || 0, leg.target), leg.target, leg.status));
    pill.title = `${leg.currentValue || 0}/${leg.target}`;
    pill.appendChild(stats);
    renderBetPlayerLastFive(pill, playerId);
    return pill;
  }

  const state = document.createElement('span');
  state.className = 'bet-leg-pill-state';
  state.textContent = leg.label;
  pill.append(state, stats);
  renderBetPlayerLastFive(pill, playerId);
  return pill;
}

function buildBetSlipText(legs) {
  return (legs || []).map((leg) => (
    isGamePickLeg(leg)
      ? `${displayTeamAbbrev(leg.teamAbbrev)} WIN`
      : `${leg.playerName} ${formatBetLegProp(leg)}`
  )).join(' + ');
}

function betLegStatValue(candidate, leg) {
  const type = leg?.type || leg?.propType || 'hit';
  const prop = betPropDefinition(type);
  if (prop.statKey === 'tb') {
    return Number(candidate?.batting?.tb) || totalBasesFromBatting({
      hits: candidate?.batting?.hits,
      doubles: candidate?.batting?.doubles,
      triples: candidate?.batting?.triples,
      hr: candidate?.batting?.hr,
    });
  }
  if (prop.statKey === 'xbh') {
    return (Number(candidate?.batting?.hr) || 0) + (Number(candidate?.batting?.doubles) || 0) + (Number(candidate?.batting?.triples) || 0);
  }
  if (type === 'k') {
    return candidate?.isPitcher ? (Number(candidate?.pitching?.so) || 0) : (Number(candidate?.batting?.so) || 0);
  }
  return Number(candidate?.[prop.statKind]?.[prop.statKey]) || 0;
}

function betLegActive(candidate, leg) {
  const type = leg?.type || leg?.propType || 'hit';
  if (type === 'k' && candidate?.isPitcher) {
    return Number(candidate?.activePitcherId) === Number(candidate?.playerId);
  }
  return Number(candidate?.activeBatterId) === Number(candidate?.playerId);
}

function getBetSearchPool(games = latestRenderedGames) {
  const map = new Map();
  for (const game of games || []) {
    for (const profile of Object.values(game?.playerLookup || {})) {
      const id = Number(profile?.id);
      if (!Number.isFinite(id)) continue;
      map.set(String(id), {
        playerId: id,
        playerName: profile.fullName,
        playerNameKey: profile.fullNameKey || normalizeNameKey(profile.fullName),
        teamAbbrev: profile.teamAbbrev || '',
      });
    }
    for (const entry of [
      ...(game?.lineup?.away || []),
      ...(game?.lineup?.home || []),
      ...(game?.lineup?.awayBench || []),
      ...(game?.lineup?.homeBench || []),
    ]) {
      const id = Number(entry?.id);
      if (!Number.isFinite(id)) continue;
      if (map.has(String(id))) continue;
      map.set(String(id), {
        playerId: id,
        playerName: entry.fullName || entry.name || 'Unknown',
        playerNameKey: normalizeNameKey(entry.fullName || entry.name || 'Unknown'),
        teamAbbrev: '',
      });
    }
  }
  return [...map.values()].sort((a, b) => (
    String(a.playerName || '').localeCompare(String(b.playerName || ''))
    || String(a.teamAbbrev || '').localeCompare(String(b.teamAbbrev || ''))
  ));
}

function refreshBetPlayerOptions(games = latestRenderedGames, searchValue = betPlayerSearchEl?.value || '') {
  if (!betPlayerOptionsEl) return;
  betPlayerOptionsEl.replaceChildren();
  const query = normalizeNameKey(searchValue);
  if (query.length < BET_PLAYER_SEARCH_MIN_CHARS) return;
  const matches = getBetSearchPool(games).filter((player) => player.playerNameKey.includes(query));
  for (const player of matches) {
    const option = document.createElement('option');
    option.value = `${player.playerName} | ${player.teamAbbrev || 'MLB'} | ${player.playerId}`;
    betPlayerOptionsEl.appendChild(option);
  }
}

function getBetPlayerOptionValues() {
  return betPlayerOptionsEl ? Array.from(betPlayerOptionsEl.options).map((option) => option.value) : [];
}

function maybeSelectSingleBetPlayerOption() {
  if (!betPlayerSearchEl) return false;
  const options = getBetPlayerOptionValues();
  if (options.length !== 1) return false;
  betPlayerSearchEl.value = options[0];
  refreshBetPlayerOptions(latestRenderedGames, betPlayerSearchEl.value);
  return true;
}

function resolveBetSearchPlayer(searchValue, games = latestRenderedGames) {
  const text = cleanSummary(searchValue);
  if (!text) return null;
  const idMatch = text.match(/(?:\||#)\s*(\d{4,})\s*$/);
  const pool = getBetSearchPool(games);
  if (idMatch) {
    const match = pool.find((player) => String(player.playerId) === String(idMatch[1]));
    if (match) return match;
  }
  const nameOnly = normalizeNameKey(text.split('|')[0] || text);
  const exact = pool.find((player) => player.playerNameKey === nameOnly);
  if (exact) return exact;
  const fuzzy = pool.filter((player) => player.playerNameKey.includes(nameOnly) || nameOnly.includes(player.playerNameKey));
  return fuzzy.length === 1 ? fuzzy[0] : null;
}

function renderDraftBetSlip() {
  if (!betDescEl) return;
  if (draftBetLegs.length) {
    betDescEl.value = buildBetSlipText(draftBetLegs);
  }
}

function clearDraftBetSlip() {
  draftBetLegs = [];
  if (betDescEl) betDescEl.value = '';
  if (betPlayerSearchEl) betPlayerSearchEl.value = '';
  if (betPropSelectEl) betPropSelectEl.value = 'hit';
  if (betPropTargetEl) betPropTargetEl.value = '1';
  refreshBetPlayerOptions();
  focusBetPlayerSearch();
}

function addDraftBetLeg() {
  const player = resolveBetSearchPlayer(betPlayerSearchEl?.value || '', latestRenderedGames);
  const propType = betPropSelectEl?.value || 'hit';
  const target = normalizeBetTarget(betPropTargetEl?.value || 1);
  if (!player) return false;
  const exists = draftBetLegs.some((leg) => (
    String(leg.playerId) === String(player.playerId)
    && leg.propType === propType
    && normalizeBetTarget(leg.target) === target
  ));
  if (exists) return false;
  draftBetLegs.push({
    playerId: player.playerId,
    playerName: player.playerName,
    playerNameKey: player.playerNameKey,
    teamAbbrev: player.teamAbbrev,
    propType,
    target,
  });
  renderDraftBetSlip();
  if (betPlayerSearchEl) betPlayerSearchEl.value = '';
  if (betPropTargetEl) betPropTargetEl.value = '1';
  refreshBetPlayerOptions();
  focusBetPlayerSearch();
  return true;
}

function parseTrackedBet(desc) {
  const text = cleanSummary(desc);
  const patterns = [
    { type: 'hit', regex: /^(.*?)\s+(?:(\d+)\+\s+)?(?:for\s+a\s+|to\s+record\s+a\s+)?hits?$/i },
    { type: 'double', regex: /^(.*?)\s+(?:(\d+)\+\s+)?(?:(?:for|to\s+record)\s+)?(?:2b|doubles?)$/i },
    { type: 'triple', regex: /^(.*?)\s+(?:(\d+)\+\s+)?(?:(?:for|to\s+record)\s+)?(?:3b|triples?)$/i },
    { type: 'hr', regex: /^(.*?)\s+(?:(\d+)\+\s+)?(?:for\s+a\s+)?(?:home\s+runs?|hrs?)$/i },
    { type: 'run', regex: /^(.*?)\s+(?:(\d+)\+\s+)?(?:(?:for|to\s+record)\s+)?(?:r|rs|runs?)$/i },
    { type: 'tb', regex: /^(.*?)\s+(?:(\d+)\+\s+)?(?:(?:for|to\s+record)\s+)?(?:tbs?|total\s+bases?)$/i },
    { type: 'xbh', regex: /^(.*?)\s+(?:(\d+)\+\s+)?(?:for\s+an?\s+)?(?:xbh|extra\s+base\s+hits?)$/i },
    { type: 'rbi', regex: /^(.*?)\s+(?:(\d+)\+\s+)?(?:(?:for|to\s+record)\s+)?rbis?$/i },
    { type: 'k', regex: /^(.*?)\s+(?:(\d+)\+\s+)?(?:(?:for|to\s+record)\s+)?(?:ks?|strikeouts?)$/i },
    { type: 'double', regex: /^(.*?)\s+(?:for|to\s+record)\s+(\d+)\+\s+(?:2b|doubles?)$/i },
    { type: 'triple', regex: /^(.*?)\s+(?:for|to\s+record)\s+(\d+)\+\s+(?:3b|triples?)$/i },
    { type: 'run', regex: /^(.*?)\s+(?:for|to\s+record)\s+(\d+)\+\s+(?:r|rs|runs?)$/i },
    { type: 'tb', regex: /^(.*?)\s+(?:for|to\s+record)\s+(\d+)\+\s+(?:tbs?|total\s+bases?)$/i },
    { type: 'rbi', regex: /^(.*?)\s+(?:for|to\s+record)\s+(\d+)\+\s+rbis?$/i },
    { type: 'k', regex: /^(.*?)\s+(?:for|to\s+record)\s+(\d+)\+\s+(?:ks?|strikeouts?)$/i },
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (!match) continue;
    const playerName = cleanSummary(match[1]);
    if (!playerName) continue;
    return {
      type: pattern.type,
      propType: pattern.type,
      target: normalizeBetTarget(match[2] || 1),
      playerName,
      playerNameKey: normalizeNameKey(playerName),
      raw: text,
    };
  }
  return null;
}

function gameStatusIsFinal(game) {
  return isCompletedGameCard(game);
}

function trackedBetCandidate(game, tracked) {
  if (!game || (!tracked?.playerNameKey && !tracked?.playerId)) return null;
  const awayCurrentPitcherId = Number(game?.pitching?.away?.current?.id) || null;
  const homeCurrentPitcherId = Number(game?.pitching?.home?.current?.id) || null;
  for (const profile of Object.values(game.playerLookup || {})) {
    if (String(profile?.position || '').toUpperCase() === 'P' && betPropDefinition(tracked?.type).statKind === 'batting') continue;
    const idMatches = Number.isFinite(Number(tracked.playerId)) && Number(profile?.id) === Number(tracked.playerId);
    const nameMatches = tracked?.playerNameKey && profile?.fullNameKey === tracked.playerNameKey;
    if (idMatches || nameMatches) {
      const teamAbbrev = profile.teamAbbrev;
      return {
        gamePk: game.gamePk,
        playerId: profile.id,
        fullName: profile.fullName,
        teamAbbrev,
        teamColor: profile.teamColor || (sameTeamAbbrev(teamAbbrev, game.away) ? game.awayColor : game.homeColor),
        batting: profile.gameBatting || { hr: 0, doubles: 0, triples: 0, runs: 0, rbi: 0, hits: 0, atBats: 0, bb: 0, so: 0, sb: 0, cs: 0 },
        pitching: profile.gamePitching || { ip: '0.0', so: 0, bb: 0 },
        isPitcher: String(profile?.position || '').toUpperCase() === 'P',
        activeBatterId: game.activeBatterId,
        activePitcherId: sameTeamAbbrev(teamAbbrev, game.away) ? awayCurrentPitcherId : homeCurrentPitcherId,
        final: gameStatusIsFinal(game),
      };
    }
  }
  const sides = [
    { code: game.away, lineup: game.lineup?.away || [] },
    { code: game.home, lineup: game.lineup?.home || [] },
  ];
  for (const side of sides) {
    for (const entry of side.lineup) {
      const idMatches = Number.isFinite(Number(tracked.playerId)) && Number(entry?.id) === Number(tracked.playerId);
      const nameMatches = tracked?.playerNameKey && normalizeNameKey(entry?.fullName || entry?.name || '') === tracked.playerNameKey;
      if (!idMatches && !nameMatches) continue;
      return {
        gamePk: game.gamePk,
        playerId: entry.id,
        fullName: entry.fullName || entry.name,
        teamAbbrev: side.code,
        teamColor: sameTeamAbbrev(side.code, game.away) ? game.awayColor : game.homeColor,
        batting: { hits: 0, doubles: 0, triples: 0, runs: 0, rbi: 0, tb: 0 },
        pitching: { so: 0 },
        isPitcher: String(entry?.position || '').toUpperCase() === 'P',
        activeBatterId: game.activeBatterId,
        activePitcherId: sameTeamAbbrev(side.code, game.away) ? awayCurrentPitcherId : homeCurrentPitcherId,
        final: gameStatusIsFinal(game),
      };
    }
  }
  return null;
}

function normalizedBetLegs(bet) {
  if (Array.isArray(bet?.legs) && bet.legs.length) {
    return bet.legs.map((leg) => ({
      ...(isGamePickLeg(leg) ? {
        gamePk: leg.gamePk,
        side: normalizeGamePickSide(leg.side || (String(leg.teamAbbrev) === String(leg.away) ? 'away' : 'home')),
        teamAbbrev: leg.teamAbbrev || '',
        opponentAbbrev: leg.opponentAbbrev || '',
        teamLogo: leg.teamLogo || '',
        teamColor: leg.teamColor || '',
      } : {
        playerId: Number(leg.playerId),
        playerName: leg.playerName || 'Unknown',
        playerNameKey: leg.playerNameKey || normalizeNameKey(leg.playerName || ''),
      }),
      type: leg.propType || leg.type || 'hit',
      propType: leg.propType || leg.type || 'hit',
      target: normalizeBetTarget(leg.target || leg.count || 1),
    }));
  }
  const text = cleanSummary(bet?.desc || '');
  const segments = text.split(/\s*(?:\+|;|\/)\s*/).map((segment) => cleanSummary(segment)).filter(Boolean);
  if (segments.length > 1) {
    const parsed = segments.map((segment) => parseTrackedBet(segment)).filter(Boolean);
    if (parsed.length === segments.length) return parsed.map((tracked) => ({ ...tracked, propType: tracked.type }));
  }
  const tracked = parseTrackedBet(text);
  return tracked ? [{ ...tracked, propType: tracked.type }] : [];
}

function resolveTrackedLeg(leg, games = latestRenderedGames) {
  if (isGamePickLeg(leg)) {
    const candidateGame = (games || []).find((game) => String(game?.gamePk) === String(leg?.gamePk))
      || (games || []).find((game) => (
        [game?.away, game?.home].some((abbrev) => sameTeamAbbrev(abbrev, leg?.teamAbbrev))
        && [game?.away, game?.home].some((abbrev) => sameTeamAbbrev(abbrev, leg?.opponentAbbrev))
      ))
      || null;
    if (!candidateGame) return { leg, status: 'unmatched', label: 'SEARCH', active: false, candidate: null, target: 1, currentValue: 0 };
    const pickedSide = normalizeGamePickSide(leg?.side || (sameTeamAbbrev(candidateGame?.away, leg?.teamAbbrev) ? 'away' : 'home'));
    const teamAbbrev = pickedSide === 'home' ? candidateGame.home : candidateGame.away;
    const opponentAbbrev = pickedSide === 'home' ? candidateGame.away : candidateGame.home;
    const teamLogo = pickedSide === 'home' ? candidateGame.homeLogo : candidateGame.awayLogo;
    const teamColor = pickedSide === 'home' ? candidateGame.homeColor : candidateGame.awayColor;
    const scoreState = scoreStateForGame(candidateGame);
    const final = gameStatusIsFinal(candidateGame);
    let status = 'pending';
    let label = 'TIED';
    if (scoreState.scoreKnown && scoreState.leaderSide) {
      if (final) {
        status = scoreState.leaderSide === pickedSide ? 'hit' : 'miss';
        label = status === 'hit' ? 'WIN' : 'LOSS';
      } else {
        status = scoreState.leaderSide === pickedSide ? 'leading' : 'trailing';
        label = status === 'leading' ? 'AHEAD' : 'BEHIND';
      }
    } else if (!final && candidateGame?.status?.includes('Not Started')) {
      label = 'PREGAME';
    } else if (final) {
      label = 'FINAL';
    }
    return {
      leg: { ...leg, side: pickedSide, teamAbbrev, opponentAbbrev, teamLogo, teamColor },
      candidate: {
        gamePk: candidateGame.gamePk,
        teamAbbrev,
        opponentAbbrev,
        teamLogo,
        teamColor,
        pickedSide,
        final,
      },
      status,
      label,
      active: false,
      activeRole: 'team',
      currentValue: status === 'hit' ? 1 : 0,
      target: 1,
    };
  }
  const candidates = (games || []).map((game) => trackedBetCandidate(game, leg)).filter(Boolean);
  const candidate = candidates[0] || null;
  if (!candidate) return { leg, status: 'unmatched', label: 'SEARCH', active: false, candidate: null };
  const target = normalizeBetTarget(leg.target);
  const currentValue = betLegStatValue(candidate, leg);
  const active = betLegActive(candidate, leg);
  const activeRole = leg.type === 'k' && candidate?.isPitcher ? 'pitcher' : 'batter';
  if (currentValue >= target) return { leg, candidate, status: 'hit', label: 'HIT', active, activeRole, currentValue, target };
  if (candidate.final) return { leg, candidate, status: 'miss', label: 'MISS', active: false, activeRole, currentValue, target };
  return { leg, candidate, status: 'pending', label: `${currentValue}/${target}`, active, activeRole, currentValue, target };
}

function resolveTrackedBet(bet, games = latestRenderedGames) {
  const legs = normalizedBetLegs(bet);
  if (!legs.length) return { tracked: null, status: 'manual', label: 'MANUAL', active: false, legs: [] };
  const resolvedLegs = legs.map((leg) => resolveTrackedLeg(leg, games));
  const allHit = resolvedLegs.every((leg) => leg.status === 'hit');
  const anyMiss = resolvedLegs.some((leg) => leg.status === 'miss');
  const anyPending = resolvedLegs.some((leg) => ['pending', 'leading', 'trailing'].includes(leg.status));
  const anyActive = resolvedLegs.some((leg) => leg.active);
  const anyUnmatched = resolvedLegs.some((leg) => leg.status === 'unmatched');
  const status = allHit ? 'hit' : anyMiss ? 'miss' : anyPending ? 'pending' : anyUnmatched ? 'unmatched' : 'manual';
  const hitCount = resolvedLegs.filter((leg) => leg.status === 'hit').length;
  const label = legs.length > 1
    ? (allHit ? 'PARLAY HIT' : anyMiss ? 'PARLAY MISS' : `${hitCount}/${legs.length}`)
    : (resolvedLegs[0]?.label || 'MANUAL');
  return {
    tracked: legs,
    candidate: resolvedLegs.find((leg) => leg.candidate)?.candidate || null,
    status,
    label,
    active: anyActive,
    legs: resolvedLegs,
  };
}

function trackedBetMap(games = latestRenderedGames) {
  const map = new Map();
  for (const bet of getBets()) {
    const resolved = resolveTrackedBet(bet, games);
    for (const leg of resolved.legs || []) {
      if (!leg.active || !leg?.candidate?.gamePk || !leg?.candidate?.playerId) continue;
      if (!map.has(String(leg.candidate.gamePk))) map.set(String(leg.candidate.gamePk), new Set());
      map.get(String(leg.candidate.gamePk)).add(String(leg.candidate.playerId));
    }
  }
  return map;
}

function trackedBetHighlightMap(games = latestRenderedGames) {
  const map = new Map();
  for (const bet of getBets()) {
    const resolved = resolveTrackedBet(bet, games);
    for (const leg of resolved.legs || []) {
      if (leg.activeRole !== 'batter') continue;
      if (!leg.active || !leg?.candidate?.gamePk || !leg?.candidate?.playerId) continue;
      const teamColor = leg.candidate.teamColor;
      if (!teamColor) continue;
      map.set(String(leg.candidate.gamePk), {
        playerId: String(leg.candidate.playerId),
        teamColor,
      });
    }
  }
  return map;
}

function trackedGamePickStateMap(games = latestRenderedGames) {
  const map = new Map();
  for (const bet of getBets()) {
    const resolved = resolveTrackedBet(bet, games);
    for (const leg of resolved.legs || []) {
      if (!isGamePickLeg(leg?.leg) || !leg?.candidate?.gamePk) continue;
      const gamePk = String(leg.candidate.gamePk);
      const side = normalizeGamePickSide(leg?.leg?.side || leg?.candidate?.pickedSide);
      if (!side) continue;
      if (!map.has(gamePk)) map.set(gamePk, { away: '', home: '' });
      const entry = map.get(gamePk);
      entry[side] = leg.status;
    }
  }
  return map;
}

function applyGamePickLogoState(logoEl, state) {
  if (!logoEl) return;
  logoEl.classList.remove(
    'is-pick-selected',
    'is-game-pick-leading',
    'is-game-pick-trailing',
    'is-game-pick-hit',
    'is-game-pick-miss',
  );
  if (state === 'selected') logoEl.classList.add('is-pick-selected');
  if (state === 'leading') logoEl.classList.add('is-game-pick-leading');
  if (state === 'trailing') logoEl.classList.add('is-game-pick-trailing');
  if (state === 'hit') logoEl.classList.add('is-game-pick-hit');
  if (state === 'miss') logoEl.classList.add('is-game-pick-miss');
}

function applyGamePickSurfaceState(targetEl, state) {
  if (!targetEl) return;
  targetEl.classList.remove(
    'is-pick-selected',
    'is-game-pick-leading',
    'is-game-pick-trailing',
    'is-game-pick-hit',
    'is-game-pick-miss',
  );
  if (state === 'selected') targetEl.classList.add('is-pick-selected');
  if (state === 'leading') targetEl.classList.add('is-game-pick-leading');
  if (state === 'trailing') targetEl.classList.add('is-game-pick-trailing');
  if (state === 'hit') targetEl.classList.add('is-game-pick-hit');
  if (state === 'miss') targetEl.classList.add('is-game-pick-miss');
}

function syncCardGamePickState(card, game, gamePickStates = trackedGamePickStateMap(latestRenderedGames)) {
  if (!card || !game?.gamePk) return;
  const pendingSide = pendingGamePickSelections.get(String(game.gamePk)) || '';
  const tracked = gamePickStates.get(String(game.gamePk)) || { away: '', home: '' };
  const awayState = tracked.away || (pendingSide === 'away' ? 'selected' : '');
  const homeState = tracked.home || (pendingSide === 'home' ? 'selected' : '');
  applyGamePickLogoState(card.querySelector('.away-logo'), awayState);
  applyGamePickLogoState(card.querySelector('.home-logo'), homeState);
  applyGamePickSurfaceState(card.querySelector('.away-row'), awayState);
  applyGamePickSurfaceState(card.querySelector('.home-row'), homeState);
  applyGamePickSurfaceState(card.querySelector('.away-score'), awayState);
  applyGamePickSurfaceState(card.querySelector('.home-score'), homeState);
}

function syncAllCardGamePickStates(games = latestRenderedGames) {
  if (!(games || []).length) {
    for (const card of gamesEl?.querySelectorAll('.game-card') || []) {
      applyGamePickLogoState(card.querySelector('.away-logo'), '');
      applyGamePickLogoState(card.querySelector('.home-logo'), '');
      applyGamePickSurfaceState(card.querySelector('.away-row'), '');
      applyGamePickSurfaceState(card.querySelector('.home-row'), '');
      applyGamePickSurfaceState(card.querySelector('.away-score'), '');
      applyGamePickSurfaceState(card.querySelector('.home-score'), '');
    }
    return;
  }
  const stateMap = trackedGamePickStateMap(games);
  for (const game of games || []) {
    const card = gamesEl?.querySelector(`.game-card[data-game-pk='${game.gamePk}']`);
    if (!card) continue;
    syncCardGamePickState(card, game, stateMap);
  }
}

function renderBetList(games = latestRenderedGames) {
  if (!betListEl || !betDayLabelEl) return;
  betDayLabelEl.textContent = dateInput.value;
  refreshBetPlayerOptions(games);
  const bets = getBets();
  betListEl.replaceChildren();
  if (!bets.length) {
    const empty = document.createElement('div');
    empty.className = 'lineup-empty';
    empty.textContent = 'No bets logged yet.';
    betListEl.appendChild(empty);
  }
  for (const b of bets) {
    const resolved = (() => {
      try {
        return resolveTrackedBet(b, games);
      } catch {
        return { tracked: null, status: 'manual', label: 'MANUAL', active: false, legs: [] };
      }
    })();
    const isGamePick = isGamePickBet(b);
    const amount = Number(b?.amount) || 0;
    const payout = Number(b?.payout) || 0;
    const el = document.createElement('div');
    el.className = `panel-item bet-item bet-status-${resolved.status || 'manual'}`;
    const textWrap = document.createElement('div');
    textWrap.className = 'bet-text';
    const summary = document.createElement('div');
    summary.textContent = `${b.desc || 'Bet'} | ${b.odds} | $${amount.toFixed(2)} -> $${payout.toFixed(2)}`;
    textWrap.appendChild(summary);

    const statusRow = document.createElement('div');
    statusRow.className = 'bet-status-row';
    statusRow.appendChild(buildBetStatusPill(resolved));
    if (isGamePick) {
      const meta = document.createElement('span');
      meta.textContent = 'Goal: WIN';
      statusRow.appendChild(meta);
    } else if (resolved.candidate?.fullName) {
      const meta = document.createElement('span');
      meta.textContent = `${resolved.candidate.fullName} | ${displayTeamAbbrev(resolved.candidate.teamAbbrev)}`;
      statusRow.appendChild(meta);
    }
    textWrap.appendChild(statusRow);

    if (Array.isArray(resolved.legs) && resolved.legs.length) {
      const legsEl = document.createElement('div');
      legsEl.className = 'bet-legs';
      for (const leg of resolved.legs) {
        try {
          legsEl.appendChild(buildBetLegPill(leg));
        } catch {
          const fallbackLeg = document.createElement('span');
          fallbackLeg.className = 'bet-leg-pill bet-status-unmatched';
          fallbackLeg.textContent = isGamePickLeg(leg?.leg)
            ? `${displayTeamAbbrev(leg?.leg?.teamAbbrev)} WIN`
            : `${leg?.leg?.playerName || 'Leg'} ${formatBetLegProp(leg?.leg || {})}`;
          legsEl.appendChild(fallbackLeg);
        }
      }
      textWrap.appendChild(legsEl);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'bet-delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.dataset.betId = b.id;
    deleteBtn.textContent = 'X';
    el.append(textWrap, deleteBtn);
    if (resolved.active) el.classList.add('bet-item-active');
    betListEl.appendChild(el);
  }
  syncAllCardGamePickStates(games);
  if (!betListEl.children.length) {
    const empty = document.createElement('div');
    empty.className = 'lineup-empty';
    empty.textContent = 'No bets logged yet.';
    betListEl.appendChild(empty);
  }
}

function initBetInput() {
  if (betFormEl) betFormEl.noValidate = true;
  renderBetList();
  renderPendingGamePicks();
  clearBetsBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
  betAddLegBtnEl?.addEventListener('pointerdown', (e) => e.stopPropagation());
  betClearLegsBtnEl?.addEventListener('pointerdown', (e) => e.stopPropagation());
  clearGamePicksBtnEl?.addEventListener('pointerdown', (e) => e.stopPropagation());
  confirmGamePicksBtnEl?.addEventListener('pointerdown', (e) => e.stopPropagation());

  betAddLegBtnEl?.addEventListener('click', addDraftBetLeg);
  betClearLegsBtnEl?.addEventListener('click', clearDraftBetSlip);
  clearGamePicksBtnEl?.addEventListener('click', () => clearPendingGamePicks());
  confirmGamePicksBtnEl?.addEventListener('click', () => {
    if (!submitPendingGamePicksThroughBetInput()) openGamePickDialog();
  });
  gamePickDialogCancelBtnEl?.addEventListener('click', closeGamePickDialog);
  gamePickDialogDismissBtnEl?.addEventListener('click', closeGamePickDialog);
  gamePickDialogSaveBtnEl?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    confirmPendingGamePicksFromDialog();
  });
  gamePickDialogEl?.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeGamePickDialog();
  });
  betPlayerSearchEl?.addEventListener('input', () => refreshBetPlayerOptions(latestRenderedGames, betPlayerSearchEl.value));
  betPlayerSearchEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      if (maybeSelectSingleBetPlayerOption()) return;
    }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (!resolveBetSearchPlayer(betPlayerSearchEl.value, latestRenderedGames)) maybeSelectSingleBetPlayerOption();
    betPropSelectEl?.focus();
  });
  betPropTargetEl?.addEventListener('input', () => {
    const normalized = normalizeBetTarget(betPropTargetEl.value || 1);
    betPropTargetEl.value = String(normalized);
  });
  betPropTargetEl?.addEventListener('focus', () => queueTextSelection(betPropTargetEl));
  betPropTargetEl?.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'mouse') e.preventDefault();
    queueTextSelection(betPropTargetEl);
  });
  betPropSelectEl?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    betPropTargetEl?.focus();
    queueTextSelection(betPropTargetEl);
  });
  betPropTargetEl?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    addDraftBetLeg();
  });
  betOddsEl?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const pendingPicks = getPendingGamePickEntries(latestRenderedGames);
    const amount = Number(betAmountEl?.value);
    if (canSubmitPendingGamePicksFromMainForm(betDescEl?.value, pendingPicks) && Number.isFinite(amount) && amount > 0) {
      submitBetInput();
      return;
    }
    betAmountEl?.focus();
    betAmountEl?.select?.();
  });
  betAmountEl?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    submitBetInput();
  });

  betFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBetInput();
  });

  clearBetsBtn.addEventListener('click', () => {
    saveBets([]);
    renderBetList();
  });

  gamePickDialogFormEl?.addEventListener('submit', (e) => {
    e.preventDefault();
    confirmPendingGamePicksFromDialog();
  });

  betListEl.addEventListener('click', (e) => {
    if ((e.ctrlKey || e.metaKey)) {
      const legEl = e.target.closest('.bet-leg-pill[data-player-id]');
      if (legEl) {
        const playerId = Number(legEl.dataset.playerId);
        const gamePk = String(legEl.dataset.gamePk || '');
        const game = latestRenderedGames.find((g) => String(g.gamePk) === gamePk) || getCachedGames().find((g) => String(g.gamePk) === gamePk);
        if (Number.isFinite(playerId) && game) {
          e.preventDefault();
          e.stopPropagation();
          openPlayerStatOverlay(playerId, game);
          return;
        }
      }
      const itemEl = e.target.closest('.bet-item');
      if (itemEl) {
        const firstLeg = itemEl.querySelector('.bet-leg-pill[data-player-id]');
        if (firstLeg) {
          const playerId = Number(firstLeg.dataset.playerId);
          const gamePk = String(firstLeg.dataset.gamePk || '');
          const game = latestRenderedGames.find((g) => String(g.gamePk) === gamePk) || getCachedGames().find((g) => String(g.gamePk) === gamePk);
          if (Number.isFinite(playerId) && game) {
            e.preventDefault();
            e.stopPropagation();
            openPlayerStatOverlay(playerId, game);
            return;
          }
        }
      }
    }
    const button = e.target.closest('[data-bet-id]');
    if (!button) return;
    saveBets(getBets().filter((bet) => bet.id !== button.dataset.betId));
    renderBetList();
  });
}

function updateGoalTimerDisplay() {
  if (!goalTimerEl || !goalStartPauseBtnEl || !goalCompleteBtnEl || !goalResetBtnEl) return;
  const state = getGoalState();
  const hasGoal = Boolean(String(state.currentText || '').trim());
  const elapsedMs = currentGoalElapsedMs(state);
  renderGoalTimerDisplay(formatGoalDuration(elapsedMs));
  goalStartPauseBtnEl.textContent = state.running ? 'PAUSE' : 'START';
  goalStartPauseBtnEl.disabled = !hasGoal && elapsedMs <= 0;
  goalCompleteBtnEl.disabled = !hasGoal;
  goalResetBtnEl.disabled = !state.running && elapsedMs <= 0;
}

function renderGoalHistory(state) {
  if (!goalHistoryListEl) return;
  goalHistoryListEl.replaceChildren();
  const completed = Array.isArray(state?.completed) ? state.completed : [];
  if (!completed.length) {
    const empty = document.createElement('div');
    empty.className = 'panel-item';
    empty.textContent = 'No completed objectives yet.';
    goalHistoryListEl.appendChild(empty);
    return;
  }

  for (const item of completed) {
    const row = document.createElement('div');
    row.className = 'panel-item goal-history-item';
    const main = document.createElement('div');
    main.className = 'goal-history-main';
    const check = document.createElement('span');
    check.className = 'goal-history-check';
    check.textContent = 'OK';
    const text = document.createElement('div');
    text.className = 'goal-history-text';
    text.textContent = item.text || 'Completed objective';
    main.append(check, text);
    const meta = document.createElement('div');
    meta.className = 'goal-history-meta';
    meta.textContent = `${formatGoalTimeStamp(item.completedAt)} | ${formatGoalDuration(item.durationMs)}`;
    row.append(main, meta);
    goalHistoryListEl.appendChild(row);
  }
}

function renderGoalTracker(syncInput = true) {
  if (!goalDisplayEl) return;
  const state = getGoalState();
  if (goalDayLabelEl) goalDayLabelEl.textContent = dateInput.value;
  if (goalHistoryDayLabelEl) goalHistoryDayLabelEl.textContent = dateInput.value;
  if (syncInput && goalCurrentInputEl && goalCurrentInputEl.value !== state.currentText) {
    goalCurrentInputEl.value = '';
  }
  if (goalActiveTextEl) {
    const text = String(state.currentText || '').trim();
    goalActiveTextEl.textContent = text || 'No active objective.';
    goalActiveTextEl.classList.toggle('is-empty', !text);
    goalActiveTextEl.classList.toggle('is-live', Boolean(text));
  }
  updateGoalTimerDisplay();
  renderGoalHistory(state);
}

function saveGoalInputValue() {
  if (!goalCurrentInputEl) return;
  const state = getGoalState();
  goalCurrentInputEl.value = goalCurrentInputEl.value;
  updateGoalTimerDisplay();
}

function commitGoalFromInput(startTimer = true) {
  if (!goalCurrentInputEl) return;
  const text = goalCurrentInputEl.value.trim();
  if (!text) return;
  const state = getGoalState();
  state.currentText = text;
  state.elapsedMs = 0;
  state.startedAt = startTimer ? Date.now() : null;
  state.running = Boolean(startTimer);
  saveGoalState(state);
  goalCurrentInputEl.value = '';
  renderGoalTracker(false);
}

function toggleGoalTimer() {
  const state = getGoalState();
  if (state.running && Number.isFinite(state.startedAt)) {
    state.elapsedMs = currentGoalElapsedMs(state);
    state.running = false;
    state.startedAt = null;
  } else {
    state.running = true;
    state.startedAt = Date.now();
  }
  saveGoalState(state);
  updateGoalTimerDisplay();
}

function resetGoalTimer() {
  const state = getGoalState();
  state.running = false;
  state.startedAt = null;
  state.elapsedMs = 0;
  saveGoalState(state);
  updateGoalTimerDisplay();
}

function pulseGoalCompleteButton() {
  if (!goalCompleteBtnEl) return;
  goalDisplayEl?.classList.remove('goal-celebrate');
  void goalCompleteBtnEl.offsetWidth;
  goalCompleteBtnEl.classList.remove('is-finished');
  goalCompleteBtnEl.classList.add('is-finished');
  goalDisplayEl?.classList.add('goal-celebrate');
  if (goalCompletePulseTimeout) clearTimeout(goalCompletePulseTimeout);
  goalCompletePulseTimeout = setTimeout(() => {
    goalCompleteBtnEl.classList.remove('is-finished');
    goalDisplayEl?.classList.remove('goal-celebrate');
    goalCompletePulseTimeout = null;
  }, 1200);
}

function completeCurrentGoal() {
  const state = getGoalState();
  const text = String(state.currentText || '').trim();
  if (!text) return;
  const durationMs = currentGoalElapsedMs(state);
  state.completed.unshift({
    id: String(Date.now()),
    text,
    durationMs,
    completedAt: Date.now(),
  });
  state.currentText = '';
  state.running = false;
  state.startedAt = null;
  state.elapsedMs = 0;
  saveGoalState(state);
  renderGoalTracker(true);
  pulseGoalCompleteButton();
}

function clearCompletedGoals() {
  const state = getGoalState();
  state.completed = [];
  saveGoalState(state);
  renderGoalTracker(false);
}

function initGoalTracker() {
  if (!goalDisplayEl) return;
  renderGoalTracker(true);

  goalStartPauseBtnEl?.addEventListener('click', toggleGoalTimer);
  goalResetBtnEl?.addEventListener('click', resetGoalTimer);
  goalCompleteBtnEl?.addEventListener('click', completeCurrentGoal);
  clearGoalsBtnEl?.addEventListener('click', clearCompletedGoals);
  goalCurrentInputEl?.addEventListener('input', saveGoalInputValue);
  goalCurrentInputEl?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();
    commitGoalFromInput(true);
  });

  for (const button of [goalStartPauseBtnEl, goalResetBtnEl, goalCompleteBtnEl, clearGoalsBtnEl]) {
    button?.addEventListener('pointerdown', (e) => e.stopPropagation());
  }
  goalCurrentInputEl?.addEventListener('pointerdown', (e) => e.stopPropagation());

  setInterval(updateGoalTimerDisplay, 20);
}

async function fetchGamesAndHomeRuns(date) {
  const schedule = await getSchedule(date);
  const games = schedule?.dates?.[0]?.games || [];
  const homeRuns = [];
  const matchupEvents = [];
  const cachedCards = new Map(getCachedGames().map((card) => [card.gamePk, card]));
  const teamStreaks = await getTeamStreakMap(date).catch(() => new Map());
  const cardResults = await Promise.all(games.map(async (game) => {
    const gamePk = game.gamePk;
    try {
      const live = await getLiveGameFeed(gamePk);
      const boxscore = live?.liveData?.boxscore || {};
      const linescore = live?.liveData?.linescore || {};
      const allPlays = live?.liveData?.plays?.allPlays || [];
      const currentPlay = live?.liveData?.plays?.currentPlay;
      const activePlay = resolveActivePlay(game, currentPlay, allPlays);

      const awayTeam = live?.gameData?.teams?.away || game?.teams?.away?.team || {};
      const homeTeam = live?.gameData?.teams?.home || game?.teams?.home?.team || {};
      const probablePitchers = {
        away: live?.gameData?.teams?.away?.probablePitcher || game?.teams?.away?.probablePitcher || null,
        home: live?.gameData?.teams?.home?.probablePitcher || game?.teams?.home?.probablePitcher || null,
      };
      const awayAbbrev = awayTeam.abbreviation || awayTeam.teamCode?.toUpperCase() || awayTeam.name || 'AWAY';
      const homeAbbrev = homeTeam.abbreviation || homeTeam.teamCode?.toUpperCase() || homeTeam.name || 'HOME';
      const awayColor = getTeamColor(awayAbbrev);
      const homeColor = getTeamColor(homeAbbrev);

      const awayPlayers = boxscore?.teams?.away?.players || {};
      const homePlayers = boxscore?.teams?.home?.players || {};
      const gamePlayers = live?.gameData?.players || {};
      const playerLookup = {
        ...buildPlayerLookup(awayPlayers, gamePlayers, awayAbbrev, awayColor, getLogoPath(awayAbbrev)),
        ...buildPlayerLookup(homePlayers, gamePlayers, homeAbbrev, homeColor, getLogoPath(homeAbbrev)),
      };

      const ticker = [];
      if (activePlay) ticker.push({ text: eventLabel(activePlay), color: activePlay?.about?.halfInning === 'top' ? awayColor : homeColor });
      for (const play of [...allPlays].slice(-10).reverse()) {
        const text = eventLabel(play);
        if (!ticker.find((t) => t.text === text)) ticker.push({ text, color: play?.about?.halfInning === 'top' ? awayColor : homeColor });
        if (ticker.length >= 6) break;
      }

      for (const play of allPlays) {
        if (play?.about?.isComplete && play?.matchup?.batter?.id && play?.matchup?.pitcher?.id) {
          matchupEvents.push({ play, game: { gamePk, away: awayAbbrev, home: homeAbbrev }, playerLookup });
        }
        if (play?.result?.event === 'Home Run') {
          const batterId = play?.matchup?.batter?.id;
          const batter = play?.matchup?.batter?.fullName || 'Unknown';
          const half = play?.about?.halfInning;
          const battingTeamAbbr = half === 'top' ? awayAbbrev : homeAbbrev;
          const battingColor = half === 'top' ? awayColor : homeColor;
          const players = half === 'top' ? awayPlayers : homePlayers;
          const jersey = players[`ID${batterId}`]?.jerseyNumber || '?';
          const parsedHrNo = parseHrNumber(play?.result?.description || '');
          const lookupHrNo = parsedHrNo ? null : lookupPlayerSeasonHomeRuns(batterId, playerLookup);
          const fetchedHrNo = (parsedHrNo || lookupHrNo) ? null : await getPlayerSeasonHomeRuns(batterId, date).catch(() => null);
          const hrNo = parsedHrNo || lookupHrNo || fetchedHrNo;
          const distance = play?.playEvents?.find((e) => e?.hitData?.totalDistance)?.hitData?.totalDistance || null;

          homeRuns.push({
            gamePk,
            batterId,
            batter,
            jersey,
            hrNo,
            distance,
            teamAbbr: battingTeamAbbr,
            teamColor: battingColor,
            teamLogo: getLogoPath(battingTeamAbbr),
            order: play?.about?.atBatIndex ?? 0,
          });
        }
      }

      const count = countForGame(linescore, activePlay);
      const ppl = currentPeople(activePlay, linescore, game, awayPlayers, homePlayers);
      const inning = inningDisplay(linescore, game, activePlay);
      let card = {
        gamePk,
        gameDate: game?.gameDate || '',
        officialDate: game?.officialDate || schedule?.dates?.[0]?.date || '',
        gameNumber: game?.gameNumber || 1,
        doubleHeader: game?.doubleHeader || 'N',
        away: awayAbbrev,
        home: homeAbbrev,
        awayRecord: formatTeamRecord(live?.gameData?.teams?.away) || formatTeamRecord(game?.teams?.away),
        homeRecord: formatTeamRecord(live?.gameData?.teams?.home) || formatTeamRecord(game?.teams?.home),
        awayStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.away, live?.gameData?.teams?.away, awayAbbrev),
        homeStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.home, live?.gameData?.teams?.home, homeAbbrev),
        awayScore: game?.status?.abstractGameState === 'Preview' ? '-' : (linescore?.teams?.away?.runs ?? game?.teams?.away?.score ?? '-'),
        homeScore: game?.status?.abstractGameState === 'Preview' ? '-' : (linescore?.teams?.home?.runs ?? game?.teams?.home?.score ?? '-'),
        status: statusLine(game),
        inning: inning.long,
        inningShort: inning.short,
        balls: count.balls,
        strikes: count.strikes,
        outs: count.outs,
        awayColor,
        homeColor,
        awayLogo: getLogoPath(awayAbbrev),
        homeLogo: getLogoPath(homeAbbrev),
        awayPitcher: ppl.awayPitcher,
        homePitcher: ppl.homePitcher,
        awayHitter: ppl.awayHitter,
        homeHitter: ppl.homeHitter,
        bases: baseState(linescore),
        ticker,
        lastPlay: ticker[0]?.text || 'Awaiting first pitch',
        currentEvent: activePlay?.result?.event || '',
        activeBatterId: activePlay?.matchup?.batter?.id || null,
        battingSide: ppl.battingSide,
        probablePitchers,
        lineup: emptyLineupData(),
        pitching: emptyPitchingData(),
        playerLookup: {},
      };

      const derived = buildGameDataFromBoxscore(boxscore, game, {
        activePlay,
        gamePlayers,
        awayAbbrev,
        homeAbbrev,
        awayColor,
        homeColor,
        battingSide: ppl.battingSide,
        probablePitchers,
      });
      card.lineup = derived.lineup;
      card.pitching = derived.pitching;
      card.playerLookup = { ...playerLookup, ...derived.playerLookup };

      if (lineupCount(card.lineup) === 0) {
        try {
          const rawBox = await getGameBoxscore(gamePk);
          const box = normalizeBoxscorePayload(rawBox);
          const boxDerived = buildGameDataFromBoxscore(box, game, {
            activePlay,
            gamePlayers,
            awayAbbrev,
            homeAbbrev,
            awayColor,
            homeColor,
            battingSide: ppl.battingSide,
            probablePitchers,
          });
          card = {
            ...card,
            lineup: chooseBetterLineup(boxDerived.lineup, card.lineup),
            pitching: chooseBetterPitching(boxDerived.pitching, card.pitching),
            playerLookup: { ...card.playerLookup, ...boxDerived.playerLookup },
          };
        } catch {}
      }

      if (game?.status?.abstractGameState === 'Final') {
        card = mergeFinishedGameState(card, cachedCards.get(gamePk));
      }

      return normalizeCompletedCard(card);
    } catch (error) {
      const cached = cachedCards.get(gamePk);
      const awayFromSchedule = game?.teams?.away?.team?.abbreviation || game?.teams?.away?.team?.teamCode?.toUpperCase() || cached?.away || 'AWAY';
      const homeFromSchedule = game?.teams?.home?.team?.abbreviation || game?.teams?.home?.team?.teamCode?.toUpperCase() || cached?.home || 'HOME';
      const awayColor = getTeamColor(awayFromSchedule);
      const homeColor = getTeamColor(homeFromSchedule);
      let derivedLineup = emptyLineupData();
      let derivedPitching = emptyPitchingData();
      let derivedLookup = cached?.playerLookup || {};
      try {
        const rawBox = await getGameBoxscore(gamePk);
        const box = normalizeBoxscorePayload(rawBox);
        const boxDerived = buildGameDataFromBoxscore(box, game, {
          awayAbbrev: awayFromSchedule,
          homeAbbrev: homeFromSchedule,
          awayColor,
          homeColor,
        });
        derivedLineup = chooseBetterLineup(boxDerived.lineup, derivedLineup);
        derivedPitching = chooseBetterPitching(boxDerived.pitching, derivedPitching);
        derivedLookup = { ...derivedLookup, ...boxDerived.playerLookup };
      } catch {}
      if (cached) {
        return normalizeCompletedCard({
          ...cached,
          gameDate: game?.gameDate || cached?.gameDate || '',
          officialDate: game?.officialDate || schedule?.dates?.[0]?.date || cached?.officialDate || '',
          gameNumber: game?.gameNumber || cached?.gameNumber || 1,
          doubleHeader: game?.doubleHeader || cached?.doubleHeader || 'N',
          lineup: lineupCount(cached?.lineup) > 0 ? cached.lineup : derivedLineup,
          pitching: (cached?.pitching?.away?.current || cached?.pitching?.home?.current
            || cached?.pitching?.away?.bullpen?.length || cached?.pitching?.home?.bullpen?.length)
            ? cached.pitching
            : derivedPitching,
          awayScore: game?.status?.abstractGameState === 'Preview' ? '-' : (game?.teams?.away?.score ?? cached.awayScore),
          homeScore: game?.status?.abstractGameState === 'Preview' ? '-' : (game?.teams?.home?.score ?? cached.homeScore),
          awayRecord: formatTeamRecord(game?.teams?.away) || cached?.awayRecord || '',
          homeRecord: formatTeamRecord(game?.teams?.home) || cached?.homeRecord || '',
          awayStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.away, null, awayFromSchedule) || cached?.awayStreak || '',
          homeStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.home, null, homeFromSchedule) || cached?.homeStreak || '',
          status: statusLine(game) || cached.status,
          probablePitchers: {
            away: game?.teams?.away?.probablePitcher || cached?.probablePitchers?.away || null,
            home: game?.teams?.home?.probablePitcher || cached?.probablePitchers?.home || null,
          },
          playerLookup: { ...(cached.playerLookup || {}), ...derivedLookup },
        });
      }
      return normalizeCompletedCard({
        gamePk,
        gameDate: game?.gameDate || '',
        officialDate: game?.officialDate || schedule?.dates?.[0]?.date || '',
        gameNumber: game?.gameNumber || 1,
        doubleHeader: game?.doubleHeader || 'N',
        away: awayFromSchedule,
        home: homeFromSchedule,
        awayRecord: formatTeamRecord(game?.teams?.away),
        homeRecord: formatTeamRecord(game?.teams?.home),
        awayStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.away, null, awayFromSchedule),
        homeStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.home, null, homeFromSchedule),
        awayScore: game?.status?.abstractGameState === 'Preview' ? '-' : (game?.teams?.away?.score ?? '-'),
        homeScore: game?.status?.abstractGameState === 'Preview' ? '-' : (game?.teams?.home?.score ?? '-'),
        status: statusLine(game),
        inning: statusLine(game),
        inningShort: statusLine(game),
        balls: 0,
        strikes: 0,
        outs: 0,
        awayColor,
        homeColor,
        awayLogo: getLogoPath(awayFromSchedule),
        homeLogo: getLogoPath(homeFromSchedule),
        awayPitcher: '-',
        homePitcher: '-',
        awayHitter: '-',
        homeHitter: '-',
        bases: { first: false, second: false, third: false },
        ticker: [],
        lastPlay: 'Awaiting first pitch',
        currentEvent: '',
        activeBatterId: null,
        battingSide: 'away',
        probablePitchers: {
          away: game?.teams?.away?.probablePitcher || cached?.probablePitchers?.away || null,
          home: game?.teams?.home?.probablePitcher || cached?.probablePitchers?.home || null,
        },
        lineup: derivedLineup,
        pitching: derivedPitching,
        playerLookup: derivedLookup,
      });
    }
  }));

  const cards = dedupeGameCards(cardResults.filter(Boolean), date);
  saveAnalyticsDayIndex(date, buildDailyAnalyticsIndex(date, cards, matchupEvents));
  homeRuns.sort((a, b) => b.gamePk - a.gamePk || b.order - a.order);
  if (homeRuns.length) {
    try {
      localStorage.setItem(storageKey('hrs'), JSON.stringify(homeRuns.slice(0, 120)));
    } catch {}
  }
  return { cards, homeRuns };
}

async function fetchMlbFallbackCards(date, cachedCards) {
  try {
    const schedule = await getSchedule(date);
    const games = schedule?.dates?.[0]?.games || [];
    if (!games.length) return [];
    const teamStreaks = await getTeamStreakMap(date).catch(() => new Map());

    const cards = await Promise.all(games.map(async (game) => {
      const awayAbbrev = game?.teams?.away?.team?.abbreviation || game?.teams?.away?.team?.teamCode?.toUpperCase() || 'AWAY';
      const homeAbbrev = game?.teams?.home?.team?.abbreviation || game?.teams?.home?.team?.teamCode?.toUpperCase() || 'HOME';
      const identityKey = gameCardInstanceKey({
        away: awayAbbrev,
        home: homeAbbrev,
        gameDate: game?.gameDate || '',
        officialDate: game?.officialDate || date || '',
        gameNumber: game?.gameNumber || 1,
      }, date);
      const cached = cachedCards.get(identityKey) || cachedCards.get(gameMatchKey(awayAbbrev, homeAbbrev)) || null;
      const awayColor = cached?.awayColor || getTeamColor(awayAbbrev);
      const homeColor = cached?.homeColor || getTeamColor(homeAbbrev);
      const detail = statusLine(game);
      let derivedLineup = emptyLineupData();
      let derivedPitching = emptyPitchingData();
      let derivedLookup = cached?.playerLookup || {};

      try {
        const rawBox = await getGameBoxscore(game.gamePk);
        const box = normalizeBoxscorePayload(rawBox);
        const derived = buildGameDataFromBoxscore(box, game, {
          awayAbbrev,
          homeAbbrev,
          awayColor,
          homeColor,
        });
        derivedLineup = chooseBetterLineup(derived.lineup, derivedLineup);
        derivedPitching = chooseBetterPitching(derived.pitching, derivedPitching);
        derivedLookup = { ...derivedLookup, ...derived.playerLookup };
      } catch {}

      const cachedPitchingHasData = Boolean(
        cached?.pitching?.away?.current
        || cached?.pitching?.home?.current
        || cached?.pitching?.away?.bullpen?.length
        || cached?.pitching?.home?.bullpen?.length,
      );

      return {
        ...(cached || {}),
        gamePk: cached?.gamePk || game.gamePk || `${awayAbbrev}${homeAbbrev}`,
        gameDate: game?.gameDate || cached?.gameDate || '',
        officialDate: game?.officialDate || date || cached?.officialDate || '',
        gameNumber: game?.gameNumber || cached?.gameNumber || 1,
        doubleHeader: game?.doubleHeader || cached?.doubleHeader || 'N',
        away: awayAbbrev,
        home: homeAbbrev,
        awayRecord: formatTeamRecord(game?.teams?.away) || cached?.awayRecord || '',
        homeRecord: formatTeamRecord(game?.teams?.home) || cached?.homeRecord || '',
        awayStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.away, null, awayAbbrev) || cached?.awayStreak || '',
        homeStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.home, null, homeAbbrev) || cached?.homeStreak || '',
        awayScore: game?.status?.abstractGameState === 'Preview' ? '-' : (game?.teams?.away?.score ?? cached?.awayScore ?? '-'),
        homeScore: game?.status?.abstractGameState === 'Preview' ? '-' : (game?.teams?.home?.score ?? cached?.homeScore ?? '-'),
        status: detail || cached?.status || 'Unknown',
        inning: cached?.inning || detail,
        inningShort: cached?.inningShort || detail,
        awayColor,
        homeColor,
        awayLogo: cached?.awayLogo || getLogoPath(awayAbbrev),
        homeLogo: cached?.homeLogo || getLogoPath(homeAbbrev),
        awayPitcher: cached?.awayPitcher || '-',
        homePitcher: cached?.homePitcher || '-',
        awayHitter: cached?.awayHitter || '-',
        homeHitter: cached?.homeHitter || '-',
        probablePitchers: {
          away: game?.teams?.away?.probablePitcher || cached?.probablePitchers?.away || null,
          home: game?.teams?.home?.probablePitcher || cached?.probablePitchers?.home || null,
        },
        balls: cached?.balls ?? 0,
        strikes: cached?.strikes ?? 0,
        outs: cached?.outs ?? 0,
        bases: cached?.bases || { first: false, second: false, third: false },
        ticker: cached?.ticker || [],
        lastPlay: cached?.lastPlay || 'Awaiting first pitch',
        currentEvent: cached?.currentEvent || '',
        lineup: lineupCount(cached?.lineup) > 0 ? cached.lineup : derivedLineup,
        pitching: cachedPitchingHasData ? cached.pitching : derivedPitching,
        playerLookup: derivedLookup,
      };
    }));

    return dedupeGameCards(cards.map(normalizeCompletedCard), date);
  } catch {
    return [];
  }
}

function renderHomeRunFeed(homeRuns) {
  const list = homeRuns.length ? homeRuns : JSON.parse(localStorage.getItem(storageKey('hrs')) || '[]');
  hrListEl.replaceChildren();
  for (const hr of list) {
    const item = document.createElement('div');
    item.className = 'panel-item hr-item';
    item.dataset.gamePk = String(hr.gamePk ?? '');
    item.dataset.playerId = String(hr.batterId ?? '');
    item.innerHTML = `
      <img class="hr-logo" src="${hr.teamLogo || 'placeholder.png'}" alt="${hr.teamAbbr || 'team'}" />
      <div>
        <div class="hr-name" style="color:${hr.teamColor || '#dbebff'}">${hr.batter} #${hr.jersey ?? '?'}</div>
        <div>${hr.hrNo ? `${ordinalNumber(hr.hrNo)} HR of season` : 'Season HR #?'}${hr.distance ? ` | ${hr.distance} ft` : ''}</div>
      </div>
    `;
    const img = item.querySelector('img');
    img.onerror = () => {
      img.onerror = null;
      img.src = 'placeholder.png';
    };
    hrListEl.appendChild(item);
  }
}

function currentLeaderTeamSelection() {
  const option = leadersTeamSelectEl?.selectedOptions?.[0] || null;
  return {
    teamId: leadersTeamSelectEl?.value || '',
    teamAbbrev: option?.dataset.abbrev || '',
    teamName: option?.dataset.name || option?.textContent || 'MLB',
  };
}

function selectedLeaderMatchup(games = latestRenderedGames) {
  const { teamAbbrev } = currentLeaderTeamSelection();
  if (!teamAbbrev) return null;
  const team = String(teamAbbrev || '').toUpperCase();
  return games.find((game) => String(game.away).toUpperCase() === team || String(game.home).toUpperCase() === team) || null;
}

function currentFilteredTeamAbbrevs(games = latestRenderedGames) {
  const { teamAbbrev } = currentLeaderTeamSelection();
  const selected = String(teamAbbrev || '').toUpperCase();
  if (!selected) return [];
  if (!currentLeadersOpponentMode) return [selected];
  const matchup = selectedLeaderMatchup(games);
  if (!matchup) return [selected];
  return [String(matchup.away || '').toUpperCase(), String(matchup.home || '').toUpperCase()].filter(Boolean);
}

function currentFilteredTeamIds(games = latestRenderedGames) {
  const teamAbbrevs = currentFilteredTeamAbbrevs(games);
  if (!teamAbbrevs.length) {
    const { teamId } = currentLeaderTeamSelection();
    return teamId ? [Number(teamId)].filter((value) => Number.isFinite(value) && value > 0) : [];
  }
  return teamAbbrevs
    .map((abbrev) => latestLeaderTeams.find((team) => String(team.abbreviation).toUpperCase() === abbrev)?.id)
    .filter((value) => Number.isFinite(Number(value)) && Number(value) > 0)
    .map(Number);
}

function currentFocusedGame(games = latestRenderedGames) {
  if (focusedGamePk === null) return null;
  return games.find((game) => String(game?.gamePk) === String(focusedGamePk))
    || getCachedGames().find((game) => String(game?.gamePk) === String(focusedGamePk))
    || null;
}

function gameMatchesCurrentFilter(game, games = latestRenderedGames) {
  const teams = currentFilteredTeamAbbrevs(games);
  if (!teams.length) return true;
  return teams.includes(String(game?.away || '').toUpperCase()) || teams.includes(String(game?.home || '').toUpperCase());
}

function leaderContextSummary() {
  const date = dateInput.value || formatDate(new Date());
  const season = seasonForDate(date);
  const { teamAbbrev } = currentLeaderTeamSelection();
  const matchup = selectedLeaderMatchup(latestRenderedGames);
  if (currentOverlayPage === 'hot') {
    if (currentLeadersOpponentMode && matchup) return `${displayTeamAbbrev(matchup.away)} vs ${displayTeamAbbrev(matchup.home)} hot hitters | last 7 days`;
    if (teamAbbrev) return `${displayTeamAbbrev(teamAbbrev)} hot hitters | last 7 days`;
    return `MLB hot hitters | last 7 days`;
  }
  if (currentLeadersOpponentMode && matchup) return `${displayTeamAbbrev(matchup.away)} vs ${displayTeamAbbrev(matchup.home)} leaders | ${formatLeadersDateLabel(date)}`;
  if (teamAbbrev) return `${displayTeamAbbrev(teamAbbrev)} season leaders | ${season}`;
  return `MLB season leaders | ${season}`;
}

function updateLeadersContext() {
  if (!leadersContextEl) return;
  leadersContextEl.textContent = leaderContextSummary();
}

function setOverlayPage(page, options = {}) {
  const { persist = true, refresh = true } = options;
  currentOverlayPage = normalizeOverlayPage(page);
  if (pageToggleBtnEl) {
    pageToggleBtnEl.textContent = `Page: ${currentOverlayPage === 'leaders' ? 'Leaders' : currentOverlayPage === 'hot' ? 'Hot' : 'Scoreboard'}`;
  }
  if (gamesEl) {
    gamesEl.hidden = currentOverlayPage !== 'scoreboard';
    gamesEl.style.display = currentOverlayPage === 'scoreboard' ? '' : 'none';
  }
  if (leadersPageEl) {
    leadersPageEl.hidden = currentOverlayPage !== 'leaders';
    leadersPageEl.style.display = currentOverlayPage === 'leaders' ? '' : 'none';
  }
  if (hotPageEl) {
    hotPageEl.hidden = currentOverlayPage !== 'hot';
    hotPageEl.style.display = currentOverlayPage === 'hot' ? '' : 'none';
  }
  if (leadersToolbarEl) leadersToolbarEl.hidden = currentOverlayPage === 'scoreboard';
  if (scoreboardColumnsBtnEl) scoreboardColumnsBtnEl.hidden = currentOverlayPage !== 'scoreboard';
  if (persist) {
    try {
      localStorage.setItem(OVERLAY_PAGE_KEY, currentOverlayPage);
    } catch {}
  }
  updateLeadersContext();
  if (refresh && currentOverlayPage === 'leaders') refreshLeadersView();
  if (refresh && currentOverlayPage === 'hot') refreshHotView();
}

function initOverlayPageControl() {
  const saved = normalizeOverlayPage(localStorage.getItem(OVERLAY_PAGE_KEY) || 'scoreboard');
  pageToggleBtnEl?.addEventListener('click', () => {
    const next = currentOverlayPage === 'scoreboard' ? 'leaders' : currentOverlayPage === 'leaders' ? 'hot' : 'scoreboard';
    setOverlayPage(next);
  });
  setOverlayPage(saved, { persist: false, refresh: false });
}

function isTextEntryTarget(target = document.activeElement) {
  if (!target || target === document.body || target === document.documentElement) return false;
  if (target.isContentEditable) return true;
  const tagName = String(target.tagName || '').toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

function setOverlayWindowFullscreen(enabled) {
  currentOverlayWindowFullscreen = Boolean(enabled);
  document.body.classList.toggle('overlay-window-fullscreen', currentOverlayWindowFullscreen);
  requestAnimationFrame(refreshAllScoreboardResponsiveLayout);
}

function toggleOverlayWindowFullscreen() {
  setOverlayWindowFullscreen(!currentOverlayWindowFullscreen);
}

function firstScrollableElement(candidates = []) {
  for (const candidate of candidates) {
    if (!candidate || candidate.hidden) continue;
    const rect = candidate.getBoundingClientRect?.();
    if (!rect || rect.width <= 0 || rect.height <= 0) continue;
    if (candidate.scrollHeight > candidate.clientHeight + 2) return candidate;
  }
  return candidates.find((candidate) => candidate && !candidate.hidden) || null;
}

function currentOverlayScrollTarget() {
  if (playerStatOverlayEl && !playerStatOverlayEl.hidden) {
    return firstScrollableElement([
      playerStatOverlayEl.querySelector('.player-stat-right'),
      playerStatOverlayEl.querySelector('.player-stat-body'),
      playerStatOverlayEl.querySelector('.player-stat-modal'),
    ]);
  }

  if (lineupOverlayEl && !lineupOverlayEl.hidden) {
    return firstScrollableElement([
      lineupOverlayEl.querySelector('.lineup-modal-body'),
      lineupOverlayEl.querySelector('.lineup-modal'),
    ]);
  }

  if (currentOverlayPage === 'leaders') {
    return firstScrollableElement([leadersPageEl?.querySelector('.leaders-shell'), leadersPageEl]);
  }

  if (currentOverlayPage === 'hot') {
    return firstScrollableElement([hotPageEl?.querySelector('.leaders-shell'), hotPageEl]);
  }

  return firstScrollableElement([gamesEl, overlayEl]);
}

function scrollCurrentOverlay(direction) {
  const target = currentOverlayScrollTarget();
  if (!target) return false;
  const amount = Math.max(72, Math.round((target.clientHeight || 0) * 0.72));
  target.scrollBy({ top: amount * direction, behavior: 'auto' });
  return true;
}

function shiftOverlayPage(direction) {
  const pages = ['scoreboard', 'leaders', 'hot'];
  const index = Math.max(0, pages.indexOf(currentOverlayPage));
  const nextIndex = (index + direction + pages.length) % pages.length;
  setOverlayPage(pages[nextIndex]);
}

function initOverlayKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (isTextEntryTarget(e.target)) return;

    if (e.key === 's' || e.key === 'S') {
      e.preventDefault();
      toggleOverlayWindowFullscreen();
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      shiftOverlayPage(-1);
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      shiftOverlayPage(1);
      return;
    }

    if (e.key === 'ArrowUp') {
      if (scrollCurrentOverlay(-1)) e.preventDefault();
      return;
    }

    if (e.key === 'ArrowDown') {
      if (scrollCurrentOverlay(1)) e.preventDefault();
    }
  });
}

async function syncLeaderTeamOptions(games = latestRenderedGames) {
  if (!leadersTeamSelectEl) return;
  const previous = leadersTeamSelectEl.value || '';
  const season = seasonForDate(dateInput.value || formatDate(new Date()));
  try {
    latestLeaderTeams = await getTeamsForSeason(season);
  } catch {
    const fallback = new Map();
    for (const game of games) {
      fallback.set(game.away, { id: game.away, abbreviation: game.away, name: game.away });
      fallback.set(game.home, { id: game.home, abbreviation: game.home, name: game.home });
    }
    latestLeaderTeams = [...fallback.values()].sort((a, b) => String(a.abbreviation).localeCompare(String(b.abbreviation)));
  }
  const currentSignature = Array.from(leadersTeamSelectEl.options).map((option) => `${option.value}:${option.textContent}`).join('|');
  const nextOptions = [
    { value: '', text: 'League', abbrev: '', name: 'MLB' },
    ...latestLeaderTeams.map((team) => ({
      value: String(team.id),
      text: `${displayTeamAbbrev(team.abbreviation)} | ${team.name}`,
      abbrev: team.abbreviation,
      name: team.name,
    })),
  ];
  const nextSignature = nextOptions.map((option) => `${option.value}:${option.text}`).join('|');
  if (currentSignature !== nextSignature) {
    leadersTeamSelectEl.replaceChildren();
    for (const team of nextOptions) {
      const option = document.createElement('option');
      option.value = team.value;
      option.dataset.abbrev = team.abbrev;
      option.dataset.name = team.name;
      option.textContent = team.text;
      leadersTeamSelectEl.appendChild(option);
    }
  }

  const valid = new Set(Array.from(leadersTeamSelectEl.options).map((option) => option.value));
  leadersTeamSelectEl.value = valid.has(previous) ? previous : '';
}

function syncLeadersOpponentsButton(games = latestRenderedGames) {
  if (!leadersOpponentsBtnEl) return;
  const matchup = selectedLeaderMatchup(games);
  const enabled = Boolean(matchup);
  leadersOpponentsBtnEl.disabled = !enabled;
  leadersOpponentsBtnEl.classList.toggle('is-active', enabled && currentLeadersOpponentMode);
  leadersOpponentsBtnEl.title = enabled
    ? `Filter leaders to ${matchup.away} and ${matchup.home}`
    : 'Select a team that is playing on the selected date';
  if (!enabled) currentLeadersOpponentMode = false;
}

async function syncLeaderFilters(games = latestRenderedGames) {
  await syncLeaderTeamOptions(games);
  syncLeadersOpponentsButton(games);
  updateLeadersContext();
}

function createLeaderEmpty(message) {
  const empty = document.createElement('div');
  empty.className = 'leaders-empty';
  empty.textContent = message;
  return empty;
}

async function getSeasonLeaderBoards(team = null) {
  const season = seasonForDate(dateInput.value || formatDate(new Date()));
  const merged = new Map();
  const jobs = [];
  for (const section of LEADER_SECTIONS) {
    for (const category of section.categories) {
      jobs.push(
        getSortedSeasonStats(category, season, team)
          .then((leaders) => {
            merged.set(category.key, leaders);
          }),
      );
    }
  }
  await Promise.all(jobs);
  return merged;
}

async function getOpponentFilteredLeaderBoards(matchup) {
  const season = seasonForDate(dateInput.value || formatDate(new Date()));
  const { teamId, teamAbbrev } = currentLeaderTeamSelection();
  const selectedTeam = latestLeaderTeams.find((team) => String(team.id) === String(teamId))
    || latestLeaderTeams.find((team) => String(team.abbreviation).toUpperCase() === String(teamAbbrev || '').toUpperCase())
    || null;
  const opponentAbbrev = [matchup?.away, matchup?.home]
    .map((value) => String(value || '').toUpperCase())
    .find((value) => value && value !== String(selectedTeam?.abbreviation || teamAbbrev || '').toUpperCase()) || '';
  const opponentTeam = latestLeaderTeams.find((team) => String(team.abbreviation).toUpperCase() === opponentAbbrev) || null;
  const teams = [selectedTeam, opponentTeam].filter(Boolean);
  if (!teams.length) return getSeasonLeaderBoards(selectedTeam);
  const merged = new Map();
  const jobs = [];
  for (const section of LEADER_SECTIONS) {
    for (const category of section.categories) {
      jobs.push((async () => {
        const teamEntries = await Promise.all(
          teams.map((team) => getSortedSeasonStats(category, season, team, { formatted: false, rowLimit: null })),
        );
        const combined = [...new Map(teamEntries
          .flat()
          .filter((entry) => teams.some((team) => String(team.abbreviation).toUpperCase() === String(entry.teamAbbrev || '').toUpperCase()))
          .map((entry) => [`${entry.playerId || ''}:${entry.teamAbbrev || ''}`, entry]))
          .values()]
          .sort((a, b) => {
            if (category.sort === 'asc' && a.numericValue !== b.numericValue) return a.numericValue - b.numericValue;
            if (category.sort !== 'asc' && a.numericValue !== b.numericValue) return b.numericValue - a.numericValue;
            return String(a.fullName || '').localeCompare(String(b.fullName || ''));
          });
        merged.set(category.key, formatSeasonLeaderEntries(combined, category, matchup?.gamePk || null));
      })());
    }
  }
  await Promise.all(jobs);
  return merged;
}

function matchupLeaderValue(category, player) {
  if (!player) return null;
  switch (category.key) {
    case 'hits': return statNumber(player?.batting?.hits);
    case 'battingAverage': return Number(player?.batting?.avg);
    case 'homeRuns': return statNumber(player?.batting?.hr);
    case 'runsBattedIn': return statNumber(player?.batting?.rbi);
    case 'onBasePlusSlugging': return Number(player?.batting?.ops);
    case 'stolenBases': return statNumber(player?.batting?.sb);
    case 'strikeOuts': return statNumber(player?.pitching?.so);
    case 'earnedRunAverage': return Number(player?.pitching?.era);
    case 'walksAndHitsPerInningPitched': return Number(player?.pitching?.whip);
    case 'wins': return statNumber(player?.pitching?.wins);
    case 'saves': return statNumber(player?.pitching?.saves);
    case 'inningsPitched': return inningsToOuts(player?.pitching?.ip);
    default: return null;
  }
}

function matchupLeaderQualified(category, player) {
  const atBats = statNumber(player?.batting?.atBats);
  const walks = statNumber(player?.batting?.bb);
  const outs = inningsToOuts(player?.pitching?.ip);
  if (category.key === 'battingAverage' || category.key === 'onBasePlusSlugging') return atBats + walks >= 10;
  if (category.key === 'earnedRunAverage' || category.key === 'walksAndHitsPerInningPitched') return outs >= 6;
  if (category.key === 'inningsPitched') return outs > 0;
  return true;
}

function buildOpponentFilteredLeaders(game) {
  const leaderMap = new Map();
  const players = Object.values(game?.playerLookup || {}).filter((player) => {
    const team = String(player?.teamAbbrev || '').toUpperCase();
    return team === String(game?.away || '').toUpperCase() || team === String(game?.home || '').toUpperCase();
  });
  for (const section of LEADER_SECTIONS) {
    for (const category of section.categories) {
      const leaders = players
        .map((player) => ({
          player,
          numericValue: matchupLeaderValue(category, player),
        }))
        .filter((entry) => Number.isFinite(entry.numericValue))
        .filter((entry) => matchupLeaderQualified(category, entry.player))
        .filter((entry) => category.valueType === 'count' ? entry.numericValue > 0 : true)
        .filter((entry) => category.valueType === 'innings' ? entry.numericValue > 0 : true)
        .sort((a, b) => {
          if (category.sort === 'asc' && a.numericValue !== b.numericValue) return a.numericValue - b.numericValue;
          if (category.sort !== 'asc' && a.numericValue !== b.numericValue) return b.numericValue - a.numericValue;
          return String(a.player?.fullName || '').localeCompare(String(b.player?.fullName || ''));
        })
        .slice(0, LEADER_ROW_LIMIT)
        .map((entry, index) => ({
          rank: index + 1,
          value: formatLeaderValue(entry.numericValue, category.valueType),
          playerId: entry.player?.id || null,
          fullName: entry.player?.fullName || 'Unknown',
          teamAbbrev: entry.player?.teamAbbrev || '',
          teamName: entry.player?.teamAbbrev || '',
          teamColor: entry.player?.teamColor || getTeamColor(entry.player?.teamAbbrev || ''),
          teamLogo: entry.player?.teamLogo || getLogoPath(entry.player?.teamAbbrev || ''),
          gamePk: game?.gamePk || null,
        }));
      leaderMap.set(category.key, leaders);
    }
  }
  return leaderMap;
}

function createDailyLeaderSeed(player, gamePk = null) {
  return {
    playerId: player.id || null,
    fullName: player.fullName || 'Unknown',
    teamAbbrev: player.teamAbbrev || '',
    teamColor: player.teamColor || getTeamColor(player.teamAbbrev || ''),
    teamLogo: player.teamLogo || getLogoPath(player.teamAbbrev || ''),
    gamePk,
    batting: { hits: 0, atBats: 0, homeRuns: 0, rbi: 0, walks: 0, totalBases: 0, stolenBases: 0 },
    pitching: { strikeOuts: 0, walks: 0, hits: 0, earnedRuns: 0, outs: 0, wins: 0, saves: 0 },
  };
}

function buildDailyLeaderPool(games, teamAbbrev = '') {
  const team = String(teamAbbrev || '').toUpperCase();
  const pool = new Map();
  for (const game of games) {
    for (const player of Object.values(game?.playerLookup || {})) {
      if (!player?.id) continue;
      if (team && String(player.teamAbbrev || '').toUpperCase() !== team) continue;
      const key = String(player.id);
      const entry = pool.get(key) || createDailyLeaderSeed(player, game.gamePk);
      entry.batting.hits += statNumber(player?.gameBatting?.hits);
      entry.batting.atBats += statNumber(player?.gameBatting?.atBats);
      entry.batting.homeRuns += statNumber(player?.gameBatting?.hr);
      entry.batting.rbi += statNumber(player?.gameBatting?.rbi);
      entry.batting.walks += statNumber(player?.gameBatting?.bb);
      entry.batting.totalBases += statNumber(player?.gameBatting?.tb);
      entry.batting.stolenBases += statNumber(player?.gameBatting?.sb);
      entry.pitching.strikeOuts += statNumber(player?.gamePitching?.so);
      entry.pitching.walks += statNumber(player?.gamePitching?.bb);
      entry.pitching.hits += statNumber(player?.gamePitching?.hits);
      entry.pitching.earnedRuns += statNumber(player?.gamePitching?.earnedRuns);
      entry.pitching.outs += inningsToOuts(player?.gamePitching?.ip);
      entry.pitching.wins += statNumber(player?.gamePitching?.wins);
      entry.pitching.saves += statNumber(player?.gamePitching?.saves);
      pool.set(key, entry);
    }
  }
  return [...pool.values()];
}

function dailyLeaderStat(entry, category) {
  if (!entry) return null;
  switch (category.key) {
    case 'hits': return entry.batting.hits;
    case 'battingAverage': return entry.batting.atBats > 0 ? entry.batting.hits / entry.batting.atBats : null;
    case 'homeRuns': return entry.batting.homeRuns;
    case 'runsBattedIn': return entry.batting.rbi;
    case 'onBasePlusSlugging': {
      const plateAppearances = entry.batting.atBats + entry.batting.walks;
      if (plateAppearances <= 0 || entry.batting.atBats <= 0) return null;
      const obp = (entry.batting.hits + entry.batting.walks) / plateAppearances;
      const slg = entry.batting.totalBases / entry.batting.atBats;
      return obp + slg;
    }
    case 'stolenBases': return entry.batting.stolenBases;
    case 'strikeOuts': return entry.pitching.strikeOuts;
    case 'earnedRunAverage': return entry.pitching.outs > 0 ? (entry.pitching.earnedRuns * 27) / entry.pitching.outs : null;
    case 'walksAndHitsPerInningPitched': return entry.pitching.outs > 0 ? ((entry.pitching.walks + entry.pitching.hits) * 3) / entry.pitching.outs : null;
    case 'wins': return entry.pitching.wins;
    case 'saves': return entry.pitching.saves;
    case 'inningsPitched': return entry.pitching.outs;
    default: return null;
  }
}

function buildDailyLeaders(games, teamAbbrev = '') {
  const pool = buildDailyLeaderPool(games, teamAbbrev);
  const categories = new Map();
  for (const section of LEADER_SECTIONS) {
    for (const category of section.categories) {
      const leaders = pool
        .map((entry) => ({
          ...entry,
          statValue: dailyLeaderStat(entry, category),
        }))
        .filter((entry) => Number.isFinite(entry.statValue))
        .filter((entry) => (typeof category.qualifier === 'function' ? category.qualifier(entry) : true))
        .filter((entry) => category.valueType === 'innings' ? entry.statValue > 0 : true)
        .filter((entry) => category.valueType === 'count' ? entry.statValue > 0 : true)
        .sort((a, b) => {
          if (category.sort === 'asc' && a.statValue !== b.statValue) return a.statValue - b.statValue;
          if (category.sort !== 'asc' && a.statValue !== b.statValue) return b.statValue - a.statValue;
          return String(a.fullName || '').localeCompare(String(b.fullName || ''));
        })
        .slice(0, LEADER_ROW_LIMIT)
        .map((entry, index) => ({
          rank: index + 1,
          value: formatLeaderValue(entry.statValue, category.valueType),
          playerId: entry.playerId,
          fullName: entry.fullName,
          teamAbbrev: entry.teamAbbrev,
          teamName: entry.teamAbbrev,
          teamColor: entry.teamColor,
          teamLogo: entry.teamLogo,
          gamePk: entry.gamePk,
        }));
      categories.set(category.key, leaders);
    }
  }
  return categories;
}

function renderLeaderSpotlight(category, leader) {
  if (!leader) return null;
  const hero = document.createElement('section');
  hero.className = 'leader-spotlight';
  if (leader.playerId) hero.classList.add('is-clickable');
  hero.dataset.playerId = String(leader.playerId || '');
  hero.dataset.teamAbbrev = String(leader.teamAbbrev || '');
  hero.dataset.teamName = String(leader.teamName || '');
  hero.dataset.gamePk = String(leader.gamePk || '');
  hero.style.setProperty('--team-color', leader.teamColor || '#66d9ff');
  hero.innerHTML = `
    <div class="leader-spotlight-main">
      <div class="leader-spotlight-media">
        <img class="leader-spotlight-avatar" src="${playerHeadshotUrl(leader.playerId)}" alt="${leader.fullName || 'Player'} headshot" />
        <img class="leader-spotlight-logo" src="${leader.teamLogo || 'placeholder.png'}" alt="${leader.teamAbbrev || 'team'} logo" />
      </div>
      <div class="leader-spotlight-copy">
        <div class="leader-spotlight-kicker">Leader Spotlight</div>
        <div class="leader-spotlight-name-row">
          <span class="leader-spotlight-team">${leader.teamAbbrev || 'MLB'}</span>
          <span class="leader-spotlight-name">${leader.fullName || 'Unknown'}</span>
        </div>
        <div class="leader-spotlight-summary">${leader.summaryText || 'Season detail unavailable.'}</div>
        <div class="leader-spotlight-trend">${leader.recentFormText || 'Recent form will appear as more dates get indexed.'}</div>
      </div>
    </div>
    <div class="leader-spotlight-value-wrap">
      <div class="leader-spotlight-value">${leader.value}</div>
      <div class="leader-spotlight-value-label">${category.label}</div>
    </div>
  `;
  const avatar = hero.querySelector('.leader-spotlight-avatar');
  if (avatar) {
    avatar.onerror = () => {
      avatar.onerror = null;
      avatar.src = leader.teamLogo || 'placeholder.png';
    };
  }
  const logo = hero.querySelector('.leader-spotlight-logo');
  if (logo) {
    logo.onerror = () => {
      logo.onerror = null;
      logo.src = 'placeholder.png';
    };
  }
  return hero;
}

function renderLeaderCard(category, leaders = []) {
  const card = document.createElement('article');
  card.className = 'leader-card';
  card.innerHTML = `
    <header class="leader-card-header">
      <span class="leader-card-label">${category.label}</span>
      <span class="leader-card-meta">${category.group}</span>
    </header>
  `;
  if (!leaders.length) {
    const empty = document.createElement('div');
    empty.className = 'leader-empty';
    empty.textContent = 'No leaders yet for this filter.';
    card.appendChild(empty);
    return card;
  }
  const [featuredLeader, ...restLeaders] = leaders;
  const spotlight = renderLeaderSpotlight(category, featuredLeader);
  if (spotlight) card.appendChild(spotlight);
  const list = document.createElement('ol');
  list.className = 'leader-list';
  for (const leader of restLeaders) {
    const item = document.createElement('li');
    item.className = 'leader-item';
    if (leader.playerId) item.classList.add('is-clickable');
    item.dataset.playerId = String(leader.playerId || '');
    item.dataset.teamAbbrev = String(leader.teamAbbrev || '');
    item.dataset.teamName = String(leader.teamName || '');
    item.dataset.gamePk = String(leader.gamePk || '');
    item.innerHTML = `
      <span class="leader-rank">${leader.rank}</span>
      <div class="leader-avatar-wrap">
        <img class="leader-avatar" src="${playerHeadshotUrl(leader.playerId)}" alt="${leader.fullName || 'Player'} headshot" />
        <img class="leader-team-logo" src="${leader.teamLogo || 'placeholder.png'}" alt="${leader.teamAbbrev || 'team'} logo" />
      </div>
      <div class="leader-player">
        <div class="leader-player-top">
          <span class="leader-team-chip" style="--team-color:${leader.teamColor || '#66d9ff'}">${leader.teamAbbrev || 'MLB'}</span>
          <span class="leader-name">${leader.fullName || 'Unknown'}</span>
        </div>
        <span class="leader-detail">${leader.teamName || leader.teamAbbrev || 'MLB'}</span>
      </div>
      <span class="leader-value">${leader.value}</span>
    `;
    const avatar = item.querySelector('.leader-avatar');
    if (avatar) {
      avatar.onerror = () => {
        avatar.onerror = null;
        avatar.src = leader.teamLogo || 'placeholder.png';
      };
    }
    const logo = item.querySelector('.leader-team-logo');
    if (logo) {
      logo.onerror = () => {
        logo.onerror = null;
        logo.src = 'placeholder.png';
      };
    }
    list.appendChild(item);
  }
  if (restLeaders.length) card.appendChild(list);
  return card;
}

function renderLeadersBoard(leaderMap) {
  if (!leadersPageEl) return;
  const previousScroll = leadersPageEl.querySelector('.leaders-shell')?.scrollTop || 0;
  leadersPageEl.replaceChildren();
  const shell = document.createElement('div');
  shell.className = 'leaders-shell';
  for (const section of LEADER_SECTIONS) {
    const wrap = document.createElement('section');
    wrap.className = 'leaders-section';
    wrap.innerHTML = `
      <div class="leaders-section-header">
        <span class="leaders-section-title">${section.title}</span>
        <span class="leaders-section-subtitle">${section.subtitle}</span>
      </div>
    `;
    const grid = document.createElement('div');
    grid.className = 'leaders-card-grid';
    for (const category of section.categories) {
      grid.appendChild(renderLeaderCard(category, leaderMap.get(category.key) || []));
    }
    wrap.appendChild(grid);
    shell.appendChild(wrap);
  }
  leadersPageEl.appendChild(shell);
  shell.scrollTop = previousScroll;
}

function recentHitterMetrics(entry) {
  const atBats = statNumber(entry?.batting?.atBats);
  const hits = statNumber(entry?.batting?.hits);
  const walks = statNumber(entry?.batting?.walks);
  const totalBases = statNumber(entry?.batting?.totalBases);
  const plateAppearances = atBats + walks;
  if (plateAppearances <= 0 || atBats <= 0) return null;
  const avg = hits / atBats;
  const obp = (hits + walks) / plateAppearances;
  const slg = totalBases / atBats;
  const ops = obp + slg;
  return { avg, obp, slg, ops };
}

function recentPitcherMetrics(entry) {
  const outs = statNumber(entry?.pitching?.outs);
  if (outs <= 0) return null;
  const hits = statNumber(entry?.pitching?.hits);
  const walks = statNumber(entry?.pitching?.walks);
  const earnedRuns = statNumber(entry?.pitching?.earnedRuns);
  return {
    era: (earnedRuns * 27) / outs,
    whip: ((hits + walks) * 3) / outs,
    ip: outsToInnings(outs),
  };
}

function normalizeHotAnalyticsEntry(entry, fallbackGames = 1) {
  const normalized = buildPlayerAnalyticsEntry({
    id: entry?.playerId ?? entry?.id,
    fullName: entry?.fullName,
    teamAbbrev: entry?.teamAbbrev,
    teamColor: entry?.teamColor,
    teamLogo: entry?.teamLogo,
    position: entry?.position,
  }, entry?.gamePk || null);
  normalized.playerId = Number(entry?.playerId ?? entry?.id) || normalized.playerId;
  normalized.fullName = entry?.fullName || normalized.fullName;
  normalized.teamAbbrev = entry?.teamAbbrev || normalized.teamAbbrev;
  normalized.teamColor = entry?.teamColor || normalized.teamColor;
  normalized.teamLogo = entry?.teamLogo || normalized.teamLogo;
  normalized.position = entry?.position || normalized.position;
  normalized.gamePk = entry?.gamePk || normalized.gamePk;
  normalized.games = Math.max(statNumber(entry?.games), fallbackGames);
  normalized.batting.hits = statNumber(entry?.batting?.hits);
  normalized.batting.atBats = statNumber(entry?.batting?.atBats);
  normalized.batting.homeRuns = statNumber(entry?.batting?.homeRuns);
  normalized.batting.rbi = statNumber(entry?.batting?.rbi);
  normalized.batting.walks = statNumber(entry?.batting?.walks);
  normalized.batting.totalBases = statNumber(entry?.batting?.totalBases);
  normalized.batting.stolenBases = statNumber(entry?.batting?.stolenBases);
  normalized.batting.strikeOuts = statNumber(entry?.batting?.strikeOuts);
  normalized.pitching.outs = statNumber(entry?.pitching?.outs);
  normalized.pitching.strikeOuts = statNumber(entry?.pitching?.strikeOuts);
  normalized.pitching.walks = statNumber(entry?.pitching?.walks);
  normalized.pitching.hits = statNumber(entry?.pitching?.hits);
  normalized.pitching.earnedRuns = statNumber(entry?.pitching?.earnedRuns);
  normalized.pitching.wins = statNumber(entry?.pitching?.wins);
  normalized.pitching.saves = statNumber(entry?.pitching?.saves);
  return normalized;
}

function mergeHotAnalyticsEntry(aggregate, entry, fallbackGames = 1) {
  const normalized = normalizeHotAnalyticsEntry(entry, fallbackGames);
  const key = String(normalized?.playerId || '');
  if (!key) return;
  const existing = aggregate.get(key) || buildPlayerAnalyticsEntry(normalized, normalized.gamePk || null);
  existing.playerId = normalized.playerId || existing.playerId;
  existing.fullName = normalized.fullName || existing.fullName;
  existing.teamAbbrev = normalized.teamAbbrev || existing.teamAbbrev;
  existing.teamColor = normalized.teamColor || existing.teamColor;
  existing.teamLogo = normalized.teamLogo || existing.teamLogo;
  existing.position = normalized.position || existing.position;
  existing.gamePk = normalized.gamePk || existing.gamePk;
  existing.games += Math.max(1, statNumber(normalized.games));
  existing.batting.hits += statNumber(normalized.batting.hits);
  existing.batting.atBats += statNumber(normalized.batting.atBats);
  existing.batting.homeRuns += statNumber(normalized.batting.homeRuns);
  existing.batting.rbi += statNumber(normalized.batting.rbi);
  existing.batting.walks += statNumber(normalized.batting.walks);
  existing.batting.totalBases += statNumber(normalized.batting.totalBases);
  existing.batting.stolenBases += statNumber(normalized.batting.stolenBases);
  existing.batting.strikeOuts += statNumber(normalized.batting.strikeOuts);
  existing.pitching.outs += statNumber(normalized.pitching.outs);
  existing.pitching.strikeOuts += statNumber(normalized.pitching.strikeOuts);
  existing.pitching.walks += statNumber(normalized.pitching.walks);
  existing.pitching.hits += statNumber(normalized.pitching.hits);
  existing.pitching.earnedRuns += statNumber(normalized.pitching.earnedRuns);
  existing.pitching.wins += statNumber(normalized.pitching.wins);
  existing.pitching.saves += statNumber(normalized.pitching.saves);
  aggregate.set(key, existing);
}

function hotWindowDates(endDate = '') {
  return recentCalendarDateWindow(endDate || (dateInput.value || formatDate(new Date())), RECENT_FORM_DAY_WINDOW);
}

function hotWindowLabel(dates = []) {
  if (!dates.length) return 'Today only';
  const first = dates[0];
  const last = dates[dates.length - 1];
  if (first === last) return formatLeadersDateLabel(first);
  return `${formatLeadersDateLabel(first)} - ${formatLeadersDateLabel(last)}`;
}

function hotHitterScore(entry, metrics) {
  const xbh = Math.max(0, statNumber(entry?.batting?.totalBases) - statNumber(entry?.batting?.hits));
  return (metrics.ops * 110)
    + (metrics.avg * 45)
    + (statNumber(entry?.batting?.hits) * 2.2)
    + (xbh * 4.5)
    + (statNumber(entry?.batting?.homeRuns) * 7)
    + (statNumber(entry?.batting?.rbi) * 1.35)
    - (statNumber(entry?.batting?.strikeOuts) * 0.35);
}

function coldHitterScore(entry, metrics) {
  const hits = statNumber(entry?.batting?.hits);
  const homeRuns = statNumber(entry?.batting?.homeRuns);
  const walks = statNumber(entry?.batting?.walks);
  const strikeOuts = statNumber(entry?.batting?.strikeOuts);
  const avgPenalty = Math.max(0, 0.280 - metrics.avg);
  const opsPenalty = Math.max(0, 0.760 - metrics.ops);
  return (avgPenalty * 260)
    + (opsPenalty * 115)
    + (strikeOuts * 1.45)
    - (hits * 1.2)
    - (homeRuns * 7)
    - (walks * 0.5);
}

function compareHotHitterEntries(a, b) {
  return (Number(b?.score) || 0) - (Number(a?.score) || 0)
    || (Number(b?.metrics?.ops) || 0) - (Number(a?.metrics?.ops) || 0)
    || (Number(b?.metrics?.avg) || 0) - (Number(a?.metrics?.avg) || 0)
    || String(a?.fullName || '').localeCompare(String(b?.fullName || ''));
}

function compareColdHitterEntries(a, b) {
  return (Number(b?.coldScore) || 0) - (Number(a?.coldScore) || 0)
    || (Number(a?.metrics?.ops) || 0) - (Number(b?.metrics?.ops) || 0)
    || (Number(a?.metrics?.avg) || 0) - (Number(b?.metrics?.avg) || 0)
    || String(a?.fullName || '').localeCompare(String(b?.fullName || ''));
}

function hotTeamKey(value) {
  return canonicalTeamAbbrev(value) || String(value || '').toUpperCase();
}

function visibleHotTeams(games = latestRenderedGames, fallbackEntries = []) {
  const filteredGames = games.filter((game) => gameMatchesCurrentFilter(game, games));
  const teams = new Set();
  for (const game of filteredGames) {
    const away = hotTeamKey(game?.away);
    const home = hotTeamKey(game?.home);
    if (away) teams.add(away);
    if (home) teams.add(home);
  }
  if (!teams.size) {
    for (const entry of fallbackEntries) {
      const team = hotTeamKey(entry?.teamAbbrev);
      if (team) teams.add(team);
    }
  }
  return [...teams];
}

function scoreHotHitterCandidate(candidate, endDate = '') {
  if (!candidate) return null;
  if (candidate?.metrics && Number.isFinite(Number(candidate?.score))) return candidate;
  const playerId = Number(candidate?.playerId ?? candidate?.id);
  if (!Number.isFinite(playerId) || playerId <= 0) return null;
  const teamAbbrev = String(candidate?.teamAbbrev || candidate?.teamCode || candidate?.team || '').toUpperCase();
  const recent = getIndexedRecentAggregate(playerId, endDate || (dateInput.value || formatDate(new Date())), RECENT_FORM_DAY_WINDOW);
  const normalized = recent
    ? normalizeHotAnalyticsEntry({
        playerId,
        fullName: candidate?.fullName || candidate?.name || 'Unknown',
        teamAbbrev,
        teamColor: candidate?.teamColor || getTeamColor(teamAbbrev),
        teamLogo: candidate?.teamLogo || getLogoPath(teamAbbrev),
        position: candidate?.position || '',
        gamePk: candidate?.gamePk || null,
        games: Math.max(1, statNumber(recent?.games)),
        batting: recent?.batting,
        pitching: recent?.pitching,
      }, Math.max(1, statNumber(recent?.games)))
    : normalizeHotAnalyticsEntry({
        playerId,
        fullName: candidate?.fullName || candidate?.name || 'Unknown',
        teamAbbrev,
        teamColor: candidate?.teamColor || getTeamColor(teamAbbrev),
        teamLogo: candidate?.teamLogo || getLogoPath(teamAbbrev),
        position: candidate?.position || '',
        gamePk: candidate?.gamePk || null,
        games: Math.max(1, statNumber(candidate?.games || 1)),
        batting: candidate?.batting,
        pitching: candidate?.pitching,
      }, Math.max(1, statNumber(candidate?.games || 1)));
  const metrics = recentHitterMetrics(normalized);
  if (!metrics) return null;
  return {
    ...normalized,
    metrics,
    score: hotHitterScore(normalized, metrics),
  };
}

function confirmedTeamLineupForHot(game, side) {
  const lineup = side === 'away' ? game?.lineup?.away : game?.lineup?.home;
  if (!Array.isArray(lineup) || !lineup.length) return [];
  return normalizeLineupCollectionForSide(game, side, lineup)
    .filter((entry) => Number.isFinite(Number(entry?.id)) && Number(entry.id) > 0)
    .filter((entry) => String(entry?.position || '').toUpperCase() !== 'P');
}

function activeLineupForRecognition(game, side) {
  const confirmed = confirmedTeamLineupForHot(game, side).slice(0, 9);
  if (confirmed.length) return confirmed;
  return fallbackTeamLineupFromLookup(game, side)
    .filter((entry) => Number.isFinite(Number(entry?.id)) && Number(entry.id) > 0)
    .filter((entry) => String(entry?.position || '').toUpperCase() !== 'P')
    .slice(0, 9);
}

function hotBattingLineFromProfileEntry(profile, entry) {
  const batting = profile?.batting || entry?.batting || {};
  const hits = statNumber(batting.hits);
  const atBats = statNumber(batting.atBats);
  const homeRuns = statNumber(batting.homeRuns ?? batting.hr);
  const doubles = statNumber(batting.doubles);
  const triples = statNumber(batting.triples);
  const walks = statNumber(batting.walks ?? batting.baseOnBalls ?? batting.bb);
  const totalBases = statNumber(batting.totalBases) || Math.max(0, hits + doubles + (triples * 2) + (homeRuns * 3));
  return {
    hits,
    atBats,
    homeRuns,
    rbi: statNumber(batting.rbi),
    walks,
    totalBases,
    stolenBases: statNumber(batting.stolenBases ?? batting.sb),
    strikeOuts: statNumber(batting.strikeOuts ?? batting.so),
  };
}

function buildLineupHotCandidate(game, side, entry, endDate = '') {
  const playerId = Number(entry?.id);
  if (!Number.isFinite(playerId) || playerId <= 0) return null;
  const profile = game?.playerLookup?.[String(playerId)] || null;
  const teamAbbrev = String(side === 'away' ? game?.away : game?.home || profile?.teamAbbrev || '').toUpperCase();
  const candidate = {
    playerId,
    fullName: profile?.fullName || entry?.fullName || entry?.name || 'Unknown',
    teamAbbrev,
    teamColor: profile?.teamColor || getTeamColor(teamAbbrev),
    teamLogo: profile?.teamLogo || getLogoPath(teamAbbrev),
    position: entry?.position || profile?.position || '',
    gamePk: game?.gamePk || null,
    batting: hotBattingLineFromProfileEntry(profile, entry),
  };
  const scored = scoreHotHitterCandidate(candidate, endDate);
  if (scored) return scored;
  const avg = Number(String(entry?.avg || profile?.batting?.avg || '').replace(/[^\d.]/g, ''));
  const fallbackAvg = Number.isFinite(avg) ? avg : 0;
  return {
    ...normalizeHotAnalyticsEntry(candidate, 0),
    metrics: {
      avg: fallbackAvg,
      obp: fallbackAvg,
      slg: fallbackAvg,
      ops: fallbackAvg * 2,
    },
    score: (fallbackAvg * 50) - ((Number(entry?.slot) || 9) * 0.1),
  };
}

function lineupHitterHotScore(details = null) {
  const totals = details?.totals || {};
  const metrics = details?.metrics || {};
  const sample = statNumber(totals.atBats) + statNumber(totals.walks);
  const sampleFactor = clamp(sample / 18, 0.45, 1);
  return (
    ((Number(metrics.ops) || 0) * 145)
    + ((Number(metrics.avg) || 0) * 90)
    + (statNumber(totals.hits) * 4.2)
    + (statNumber(totals.xbh) * 5.5)
    + (statNumber(totals.homeRuns) * 9)
    + (statNumber(totals.rbi) * 1.4)
    - (statNumber(totals.strikeOuts) * 0.45)
  ) * sampleFactor;
}

function lineupHitterColdScore(details = null) {
  const totals = details?.totals || {};
  const metrics = details?.metrics || {};
  const sample = statNumber(totals.atBats) + statNumber(totals.walks);
  const sampleFactor = clamp(sample / 18, 0.45, 1);
  return (
    (Math.max(0, 0.275 - (Number(metrics.avg) || 0)) * 330)
    + (Math.max(0, 0.735 - (Number(metrics.ops) || 0)) * 160)
    + (statNumber(totals.strikeOuts) * 1.55)
    - (statNumber(totals.hits) * 1.4)
    - (statNumber(totals.xbh) * 4.5)
    - (statNumber(totals.homeRuns) * 8)
    - (statNumber(totals.walks) * 0.45)
  ) * sampleFactor;
}

function compareLineupRecentHotCandidates(a, b) {
  return (Number(b?.recentHotScore) || 0) - (Number(a?.recentHotScore) || 0)
    || (Number(b?.details?.metrics?.ops) || 0) - (Number(a?.details?.metrics?.ops) || 0)
    || (Number(b?.details?.metrics?.avg) || 0) - (Number(a?.details?.metrics?.avg) || 0)
    || String(a?.fullName || '').localeCompare(String(b?.fullName || ''));
}

function compareLineupRecentColdCandidates(a, b) {
  return (Number(b?.recentColdScore) || 0) - (Number(a?.recentColdScore) || 0)
    || (Number(a?.details?.metrics?.ops) || 0) - (Number(b?.details?.metrics?.ops) || 0)
    || (Number(a?.details?.metrics?.avg) || 0) - (Number(b?.details?.metrics?.avg) || 0)
    || String(a?.fullName || '').localeCompare(String(b?.fullName || ''));
}

async function buildLineupRecentHitterCandidate(game, side, entry, endDate = '') {
  const playerId = Number(entry?.id);
  if (!Number.isFinite(playerId) || playerId <= 0) return null;
  const profile = game?.playerLookup?.[String(playerId)] || null;
  let details = null;
  try {
    details = await getPlayerRecentBattingDetails(playerId);
  } catch {}
  if (!details?.totals) {
    const fallback = buildLineupHotCandidate(game, side, entry, endDate);
    if (!fallback) return null;
    return {
      ...fallback,
      details: null,
      hitStreak: 0,
      recentHotScore: Number(fallback?.score) || 0,
      recentColdScore: coldHitterScore(fallback, fallback?.metrics || {}),
    };
  }
  const teamAbbrev = String(side === 'away' ? game?.away : game?.home || profile?.teamAbbrev || '').toUpperCase();
  return {
    playerId,
    fullName: profile?.fullName || entry?.fullName || entry?.name || 'Unknown',
    teamAbbrev,
    teamColor: profile?.teamColor || getTeamColor(teamAbbrev),
    teamLogo: profile?.teamLogo || getLogoPath(teamAbbrev),
    position: entry?.position || profile?.position || '',
    gamePk: game?.gamePk || null,
    details,
    hitStreak: Math.max(0, statNumber(details?.hitStreak)),
    recentHotScore: lineupHitterHotScore(details),
    recentColdScore: lineupHitterColdScore(details),
  };
}

async function selectRecognizedHotHitters(entries, endDate = '', games = latestRenderedGames) {
  const date = endDate || (dateInput.value || formatDate(new Date()));
  const rankedEntries = Array.isArray(entries)
    ? entries
        .filter(Boolean)
        .map((entry) => scoreHotHitterCandidate(entry, date))
        .filter(Boolean)
        .sort(compareHotHitterEntries)
    : [];
  const visibleTeams = visibleHotTeams(games, rankedEntries);
  const filteredGames = games.filter((game) => gameMatchesCurrentFilter(game, games));
  const activeLineupIdsByTeam = new Map();
  const activeCandidatesByTeam = new Map();
  const rememberActive = (team, entry) => {
    const code = hotTeamKey(team);
    const playerId = Number(entry?.playerId ?? entry?.id);
    if (!code || !Number.isFinite(playerId) || playerId <= 0) return;
    if (!activeLineupIdsByTeam.has(code)) activeLineupIdsByTeam.set(code, new Set());
    activeLineupIdsByTeam.get(code).add(String(playerId));
  };
  for (const game of filteredGames) {
    for (const side of ['away', 'home']) {
      const team = hotTeamKey(side === 'away' ? game?.away : game?.home);
      const lineup = activeLineupForRecognition(game, side);
      if (!lineup.length) continue;
      for (const entry of lineup) rememberActive(team, entry);
    }
  }
  const byTeam = new Map();
  for (const entry of rankedEntries) {
    const team = hotTeamKey(entry?.teamAbbrev);
    if (!team) continue;
    if (!byTeam.has(team)) byTeam.set(team, []);
    byTeam.get(team).push(entry);
    if (activeLineupIdsByTeam.get(team)?.has(String(entry?.playerId || ''))) {
      if (!activeCandidatesByTeam.has(team)) activeCandidatesByTeam.set(team, []);
      activeCandidatesByTeam.get(team).push(entry);
    }
  }
  for (const game of filteredGames) {
    for (const side of ['away', 'home']) {
      const team = hotTeamKey(side === 'away' ? game?.away : game?.home);
      if (!activeLineupIdsByTeam.has(team)) continue;
      for (const entry of activeLineupForRecognition(game, side)) {
        const candidate = buildLineupHotCandidate(game, side, entry, date);
        if (!candidate) continue;
        if (!activeCandidatesByTeam.has(team)) activeCandidatesByTeam.set(team, []);
        const bucket = activeCandidatesByTeam.get(team);
        if (!bucket.some((existing) => Number(existing?.playerId) === Number(candidate?.playerId))) {
          bucket.push(candidate);
        }
      }
    }
  }
  const selected = [];
  const selectedIds = new Set();
  const teamNeeds = new Map();
  for (const team of visibleTeams) {
    const hasActiveLineup = activeLineupIdsByTeam.has(team);
    const picks = (hasActiveLineup ? (activeCandidatesByTeam.get(team) || []) : (byTeam.get(team) || []))
      .sort(compareHotHitterEntries)
      .slice(0, MIN_HOT_HITTERS_PER_TEAM);
    for (const entry of picks) {
      const playerId = Number(entry?.playerId);
      if (!Number.isFinite(playerId) || selectedIds.has(playerId)) continue;
      selectedIds.add(playerId);
      selected.push(entry);
    }
    teamNeeds.set(team, hasActiveLineup ? 0 : Math.max(0, MIN_HOT_HITTERS_PER_TEAM - picks.length));
  }
  if ([...teamNeeds.values()].some((value) => value > 0)) {
    const fallbackCandidates = fallbackHotPlayersFromRenderedGames('hitting')
      .map((entry) => scoreHotHitterCandidate(entry, date))
      .filter(Boolean);
    const seasonFallback = await getSeasonFallbackHotHitters(endDate).catch(() => []);
    const teamSupplements = new Map();
    const tryAddSupplement = (candidate) => {
      const scored = scoreHotHitterCandidate(candidate, date);
      const playerId = Number(scored?.playerId);
      const team = hotTeamKey(scored?.teamAbbrev);
      if (!scored || !team || !teamNeeds.get(team) || teamNeeds.get(team) <= 0) return;
      if (!Number.isFinite(playerId) || selectedIds.has(playerId)) return;
      if (!teamSupplements.has(team)) teamSupplements.set(team, []);
      if (teamSupplements.get(team).some((entry) => Number(entry?.playerId) === playerId)) return;
      teamSupplements.get(team).push(scored);
    };
    for (const candidate of fallbackCandidates) tryAddSupplement(candidate);
    for (const team of visibleTeams) {
      if (!teamNeeds.get(team)) continue;
      const teamGames = games.filter((game) => {
        const away = hotTeamKey(game?.away);
        const home = hotTeamKey(game?.home);
        return away === team || home === team;
      });
      for (const game of teamGames) {
        const sides = [
          { side: 'away', code: hotTeamKey(game?.away) },
          { side: 'home', code: hotTeamKey(game?.home) },
        ];
        for (const sideInfo of sides) {
          if (sideInfo.code !== team) continue;
          const lineup = fallbackTeamLineupFromLookup(game, sideInfo.side).slice(0, 9);
          for (const entry of lineup) {
            tryAddSupplement(buildLineupHotCandidate(game, sideInfo.side, entry, date));
          }
        }
      }
    }
    for (const candidate of seasonFallback) tryAddSupplement(candidate);
    for (const team of visibleTeams) {
      const need = teamNeeds.get(team) || 0;
      if (!need) continue;
      const supplements = (teamSupplements.get(team) || [])
        .sort(compareHotHitterEntries)
        .slice(0, need);
      for (const entry of supplements) {
        const playerId = Number(entry?.playerId);
        if (!Number.isFinite(playerId) || selectedIds.has(playerId)) continue;
        selectedIds.add(playerId);
        selected.push(entry);
      }
    }
  }
  return selected.sort(compareHotHitterEntries);
}

function lineupHotRecognitionSignature(game, endDate = '') {
  const date = endDate || (dateInput.value || formatDate(new Date()));
  const awayIds = activeLineupForRecognition(game, 'away').map((entry) => String(entry?.id || '')).join(',');
  const homeIds = activeLineupForRecognition(game, 'home').map((entry) => String(entry?.id || '')).join(',');
  return `${String(game?.gamePk || '')}:${date}:${awayIds}|${homeIds}`;
}

async function getRecognizedLineupHotPlayerIds(game, endDate = '') {
  const hotIds = new Set();
  if (!game) return hotIds;
  const recognition = await getRecognizedLineupBatterSignals(game, endDate);
  for (const id of recognition.hotIds || []) hotIds.add(String(id));
  return hotIds;
}

async function getRecognizedLineupColdPlayerIds(game, endDate = '', excludeIds = new Set()) {
  const coldIds = new Set();
  if (!game) return coldIds;
  const recognition = await getRecognizedLineupBatterSignals(game, endDate);
  for (const id of recognition.coldIds || []) {
    if (!excludeIds?.has?.(String(id))) coldIds.add(String(id));
  }
  return coldIds;
}

async function getRecognizedLineupHitStreakMap(game, endDate = '') {
  const hitStreaks = new Map();
  if (!game) return hitStreaks;
  const recognition = await getRecognizedLineupBatterSignals(game, endDate);
  for (const [id, count] of recognition.hitStreaks || []) {
    if (Number(count) >= 3) hitStreaks.set(String(id), Number(count));
  }
  return hitStreaks;
}

async function getRecognizedLineupBatterBadgeMap(game, endDate = '') {
  const badges = new Map();
  if (!game) return badges;
  const recognition = await getRecognizedLineupBatterSignals(game, endDate);
  for (const [id, value] of recognition.batterBadges || []) {
    if (!id || !value || typeof value !== 'object') continue;
    badges.set(String(id), {
      avgBurst: Boolean(value.avgBurst),
      powerBurst: Boolean(value.powerBurst),
    });
  }
  return badges;
}

async function getRecognizedLineupBatterSignals(game, endDate = '') {
  const empty = { hotIds: [], coldIds: [], hitStreaks: [], batterBadges: [] };
  if (!game) return empty;
  const date = endDate || (dateInput.value || formatDate(new Date()));
  const signature = lineupHotRecognitionSignature(game, date);
  const cached = lineupHotRecognitionCache.get(signature);
  if (cached && Array.isArray(cached.hotIds) && Array.isArray(cached.coldIds) && Array.isArray(cached.hitStreaks) && Array.isArray(cached.batterBadges)) {
    return cached;
  }

  const hotIds = new Set();
  const coldIds = new Set();
  const hitStreaks = new Map();
  const batterBadges = new Map();

  for (const side of ['away', 'home']) {
    const lineup = activeLineupForRecognition(game, side);
    if (!lineup.length) continue;
    const candidates = (await Promise.all(lineup.map((entry) => buildLineupRecentHitterCandidate(game, side, entry, date))))
      .filter(Boolean)
      .filter((entry, index, collection) => index === collection.findIndex((candidate) => Number(candidate?.playerId) === Number(entry?.playerId)));
    if (!candidates.length) continue;

    for (const candidate of candidates) {
      if (Number(candidate?.hitStreak) >= 3) {
        hitStreaks.set(String(candidate.playerId), Number(candidate.hitStreak));
      }
      const avgBurst = Number(candidate?.details?.metrics?.avg) >= 0.35;
      const powerBurst = statNumber(candidate?.details?.totals?.homeRuns) >= 2;
      if (avgBurst || powerBurst) {
        batterBadges.set(String(candidate.playerId), { avgBurst, powerBurst });
      }
    }

    const hottest = [...candidates]
      .sort(compareLineupRecentHotCandidates)
      .slice(0, MIN_HOT_HITTERS_PER_TEAM);
    const hottestIds = new Set();
    for (const entry of hottest) {
      const playerId = Number(entry?.playerId);
      if (Number.isFinite(playerId) && playerId > 0) {
        hotIds.add(String(playerId));
        hottestIds.add(String(playerId));
      }
    }

    const coldest = [...candidates]
      .filter((entry) => !hottestIds.has(String(entry?.playerId || '')))
      .sort(compareLineupRecentColdCandidates)
      .slice(0, MIN_COLD_HITTERS_PER_TEAM);
    for (const entry of coldest) {
      const playerId = Number(entry?.playerId);
      if (Number.isFinite(playerId) && playerId > 0) coldIds.add(String(playerId));
    }
  }

  const result = {
    hotIds: [...hotIds],
    coldIds: [...coldIds],
    hitStreaks: [...hitStreaks.entries()],
    batterBadges: [...batterBadges.entries()],
  };
  lineupHotRecognitionCache.set(signature, result);
  return result;
}

async function getHotHitterRangeStats(startDate, endDate) {
  const cacheKey = `${startDate}:${endDate}`;
  let promise = hotHitterRangeCache.get(cacheKey);
  if (!promise) {
    promise = (async () => {
      const url = new URL(`${MLB_API_BASE}/stats`);
      url.searchParams.set('stats', 'byDateRange');
      url.searchParams.set('group', 'hitting');
      url.searchParams.set('sportIds', '1');
      url.searchParams.set('gameType', 'R');
      url.searchParams.set('limit', '2500');
      url.searchParams.set('startDate', startDate);
      url.searchParams.set('endDate', endDate);
      url.searchParams.set('hydrate', 'person,team');
      const response = await getJson(url.toString());
      return listify(response?.stats?.[0]?.splits)
        .map((split) => {
          const stat = split?.stat || {};
          const player = split?.player || split?.person || {};
          const team = split?.team || {};
          const teamAbbrev = String(team?.abbreviation || '').toUpperCase();
          const atBats = statNumber(stat.atBats);
          const hits = statNumber(stat.hits);
          const walks = statNumber(stat.baseOnBalls ?? stat.walks);
          const totalBases = statNumber(stat.totalBases) || totalBasesFromBatting(stat);
          const games = statNumber(stat.gamesPlayed || stat.games || split?.gamesPlayed);
          return {
            playerId: player?.id ?? null,
            fullName: player?.fullName || 'Unknown',
            teamAbbrev,
            teamName: team?.name || team?.teamName || teamAbbrev || 'MLB',
            teamColor: getTeamColor(teamAbbrev),
            teamLogo: getLogoPath(teamAbbrev),
            gamePk: latestRenderedGames.find((game) => Boolean(game?.playerLookup?.[String(player?.id)]))?.gamePk || null,
            games: games > 0 ? games : 1,
            batting: {
              hits,
              atBats,
              homeRuns: statNumber(stat.homeRuns),
              rbi: statNumber(stat.rbi),
              walks,
              totalBases,
              stolenBases: statNumber(stat.stolenBases),
              strikeOuts: statNumber(stat.strikeOuts),
            },
            pitching: { outs: 0, strikeOuts: 0, walks: 0, hits: 0, earnedRuns: 0, wins: 0, saves: 0 },
          };
        })
        .filter((entry) => Number.isFinite(Number(entry.playerId)) && Number(entry.playerId) > 0)
        .filter((entry) => (statNumber(entry?.batting?.atBats) + statNumber(entry?.batting?.walks)) > 0);
    })().catch((error) => {
      hotHitterRangeCache.delete(cacheKey);
      throw error;
    });
    hotHitterRangeCache.set(cacheKey, promise);
  }
  return promise;
}

async function getSeasonFallbackHotHitters(endDate = '') {
  const allowedTeams = currentFilteredTeamAbbrevs(latestRenderedGames);
  const season = seasonForDate(endDate || (dateInput.value || formatDate(new Date())));
  const category = { key: 'onBasePlusSlugging', group: 'hitting', sortStat: 'ops', valueType: 'ops' };
  const raw = await getSortedSeasonStats(category, season, null, { formatted: false, rowLimit: null });
  return raw
    .filter((entry) => !allowedTeams.length || allowedTeams.includes(String(entry.teamAbbrev || '').toUpperCase()))
    .map((entry) => normalizeHotAnalyticsEntry({
      playerId: entry.playerId,
      fullName: entry.fullName,
      teamAbbrev: entry.teamAbbrev,
      teamColor: entry.teamColor,
      teamLogo: entry.teamLogo,
      gamePk: entry.gamePk || null,
      games: statNumber(entry?.stat?.gamesPlayed || entry?.stat?.games || 1),
      batting: {
        hits: statNumber(entry?.stat?.hits),
        atBats: statNumber(entry?.stat?.atBats),
        homeRuns: statNumber(entry?.stat?.homeRuns),
        rbi: statNumber(entry?.stat?.rbi),
        walks: statNumber(entry?.stat?.baseOnBalls ?? entry?.stat?.walks),
        totalBases: statNumber(entry?.stat?.totalBases) || totalBasesFromBatting(entry?.stat || {}),
        stolenBases: statNumber(entry?.stat?.stolenBases),
        strikeOuts: statNumber(entry?.stat?.strikeOuts),
      },
      pitching: { outs: 0, strikeOuts: 0, walks: 0, hits: 0, earnedRuns: 0, wins: 0, saves: 0 },
    }, Math.max(1, statNumber(entry?.stat?.gamesPlayed || entry?.stat?.games || 1))))
    .map((entry) => {
      const metrics = recentHitterMetrics(entry);
      if (!metrics) return null;
      return {
        ...entry,
        metrics,
        score: hotHitterScore(entry, metrics),
      };
    })
    .filter(Boolean)
    .sort(compareHotHitterEntries);
}

async function collectHotHitters(endDate = '') {
  const dates = hotWindowDates(endDate);
  const startDate = dates[0] || (endDate || (dateInput.value || formatDate(new Date())));
  const finalDate = dates[dates.length - 1] || (endDate || (dateInput.value || formatDate(new Date())));
  const allowedTeams = currentFilteredTeamAbbrevs(latestRenderedGames);
  const aggregate = new Map();
  try {
    const rangeEntries = await getHotHitterRangeStats(startDate, finalDate);
    for (const entry of rangeEntries) {
      const team = String(entry?.teamAbbrev || '').toUpperCase();
      if (allowedTeams.length && !allowedTeams.includes(team)) continue;
      mergeHotAnalyticsEntry(aggregate, entry, Math.max(1, statNumber(entry?.games)));
    }
  } catch {}
  if (!aggregate.size) {
    for (const date of dates) {
      const dayIndex = getAnalyticsDayIndex(date);
      for (const entry of Object.values(dayIndex?.players || {})) {
        const team = String(entry?.teamAbbrev || '').toUpperCase();
        if (allowedTeams.length && !allowedTeams.includes(team)) continue;
        if ((statNumber(entry?.batting?.atBats) + statNumber(entry?.batting?.walks)) <= 0) continue;
        mergeHotAnalyticsEntry(aggregate, entry, Math.max(1, statNumber(entry?.games)));
      }
    }
  }
  const selectedDate = endDate || (dateInput.value || formatDate(new Date()));
  if (!aggregate.size || !dates.includes(selectedDate)) {
    const filteredGames = latestRenderedGames.filter((game) => gameMatchesCurrentFilter(game, latestRenderedGames));
    for (const entry of buildDailyLeaderPool(filteredGames)) {
      if ((statNumber(entry?.batting?.atBats) + statNumber(entry?.batting?.walks)) <= 0) continue;
      mergeHotAnalyticsEntry(aggregate, entry, 1);
    }
  }
  const entries = [...aggregate.values()]
    .map((entry) => {
      const metrics = recentHitterMetrics(entry);
      if (!metrics) return null;
      return {
        ...entry,
        metrics,
        score: hotHitterScore(entry, metrics),
      };
    })
    .filter(Boolean)
    .sort(compareHotHitterEntries);
  const recognizedEntries = await selectRecognizedHotHitters(entries, endDate);
  if (recognizedEntries.length) {
    const enrichedEntries = await Promise.all(recognizedEntries.map((entry) => enrichHotEntryWithTodayMatchup(entry)));
    return { entries: enrichedEntries, dates, mode: 'range' };
  }
  const sameDayFallback = await selectRecognizedHotHitters(fallbackHotPlayersFromRenderedGames('hitting'), endDate);
  if (sameDayFallback.length) {
    const enrichedFallback = await Promise.all(sameDayFallback.map((entry) => enrichHotEntryWithTodayMatchup(entry)));
    return { entries: enrichedFallback, dates, mode: 'same-day-fallback' };
  }
  try {
    const seasonFallback = await selectRecognizedHotHitters(await getSeasonFallbackHotHitters(endDate), endDate);
    if (seasonFallback.length) {
      const enrichedSeasonFallback = await Promise.all(seasonFallback.map((entry) => enrichHotEntryWithTodayMatchup(entry)));
      return { entries: enrichedSeasonFallback, dates, mode: 'season-fallback' };
    }
  } catch {}
  return { entries: [], dates, mode: 'empty' };
}

function fallbackHotPlayersFromRenderedGames(group = 'hitting') {
  const filteredGames = latestRenderedGames.filter((game) => gameMatchesCurrentFilter(game, latestRenderedGames));
  const allowedTeams = currentFilteredTeamAbbrevs(latestRenderedGames);
  const pool = buildDailyLeaderPool(filteredGames);
  return pool
    .filter((entry) => !allowedTeams.length || allowedTeams.includes(String(entry.teamAbbrev || '').toUpperCase()))
    .map((entry) => {
      const normalized = normalizeHotAnalyticsEntry(entry, 1);
      if (group === 'pitching') {
        const metrics = recentPitcherMetrics(normalized);
        if (!metrics || normalized.pitching.outs <= 0) return null;
        return {
          ...normalized,
          metrics,
          score: (normalized.pitching.strikeOuts * 2) + (normalized.pitching.saves * 3) + (normalized.pitching.wins * 2) - (metrics.era * 2.2) - (metrics.whip * 1.8),
        };
      }
      const metrics = recentHitterMetrics(normalized);
      if (!metrics) return null;
      return {
        ...normalized,
        metrics,
        score: hotHitterScore(normalized, metrics),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || String(a.fullName || '').localeCompare(String(b.fullName || '')));
}

function collectRecentHotPlayers(group = 'hitting', endDate = '') {
  const recentDates = recentCalendarDateWindow(endDate || (dateInput.value || formatDate(new Date())), RECENT_FORM_DAY_WINDOW);
  if (!recentDates.length) return fallbackHotPlayersFromRenderedGames(group);
  const allowedTeams = currentFilteredTeamAbbrevs(latestRenderedGames);
  const aggregate = new Map();
  for (const date of recentDates) {
    const dayIndex = getAnalyticsDayIndex(date);
    for (const entry of Object.values(dayIndex?.players || {})) {
      const team = String(entry?.teamAbbrev || '').toUpperCase();
      if (allowedTeams.length && !allowedTeams.includes(team)) continue;
      const key = String(entry?.playerId || '');
      if (!key) continue;
      const existing = aggregate.get(key) || buildPlayerAnalyticsEntry(entry, entry?.gamePk || null);
      existing.playerId = Number(entry?.playerId) || existing.playerId;
      existing.fullName = entry?.fullName || existing.fullName;
      existing.teamAbbrev = entry?.teamAbbrev || existing.teamAbbrev;
      existing.position = entry?.position || existing.position;
      existing.games += statNumber(entry?.games);
      existing.batting.hits += statNumber(entry?.batting?.hits);
      existing.batting.atBats += statNumber(entry?.batting?.atBats);
      existing.batting.homeRuns += statNumber(entry?.batting?.homeRuns);
      existing.batting.rbi += statNumber(entry?.batting?.rbi);
      existing.batting.walks += statNumber(entry?.batting?.walks);
      existing.batting.totalBases += statNumber(entry?.batting?.totalBases);
      existing.batting.stolenBases += statNumber(entry?.batting?.stolenBases);
      existing.batting.strikeOuts += statNumber(entry?.batting?.strikeOuts);
      existing.pitching.outs += statNumber(entry?.pitching?.outs);
      existing.pitching.strikeOuts += statNumber(entry?.pitching?.strikeOuts);
      existing.pitching.walks += statNumber(entry?.pitching?.walks);
      existing.pitching.hits += statNumber(entry?.pitching?.hits);
      existing.pitching.earnedRuns += statNumber(entry?.pitching?.earnedRuns);
      existing.pitching.wins += statNumber(entry?.pitching?.wins);
      existing.pitching.saves += statNumber(entry?.pitching?.saves);
      aggregate.set(key, existing);
    }
  }
  const ranked = [...aggregate.values()]
    .map((entry) => {
      if (group === 'pitching') {
        const metrics = recentPitcherMetrics(entry);
        if (!metrics || entry.pitching.outs <= 0) return null;
        return {
          ...entry,
          metrics,
          score: (entry.pitching.strikeOuts * 2.2) + (entry.pitching.saves * 3) + (entry.pitching.wins * 2) - (metrics.era * 2.8) - (metrics.whip * 2),
        };
      }
      const metrics = recentHitterMetrics(entry);
      if (!metrics) return null;
      return {
        ...entry,
        metrics,
        score: (metrics.ops * 100) + (entry.batting.homeRuns * 6) + (entry.batting.rbi * 1.2) + entry.batting.hits,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || String(a.fullName || '').localeCompare(String(b.fullName || '')));
  return ranked.length ? ranked : fallbackHotPlayersFromRenderedGames(group);
}

async function collectHotMatchupCandidates(games = latestRenderedGames) {
  const filteredGames = games.filter((game) => gameMatchesCurrentFilter(game, games));
  const candidates = [];
  for (const game of filteredGames) {
    const awayPitcher = game?.pitching?.home?.current || null;
    const homePitcher = game?.pitching?.away?.current || null;
    const awayLineup = fallbackTeamLineupFromLookup(game, 'away').slice(0, 6);
    const homeLineup = fallbackTeamLineupFromLookup(game, 'home').slice(0, 6);
    for (const batter of awayLineup) {
      if (!awayPitcher?.id || !batter?.id) continue;
      candidates.push({ game, batterId: batter.id, pitcher: awayPitcher, teamAbbrev: game.away, opponentAbbrev: game.home });
    }
    for (const batter of homeLineup) {
      if (!homePitcher?.id || !batter?.id) continue;
      candidates.push({ game, batterId: batter.id, pitcher: homePitcher, teamAbbrev: game.home, opponentAbbrev: game.away });
    }
  }
  const enriched = await Promise.all(candidates.map(async (candidate) => {
    const profile = candidate.game?.playerLookup?.[String(candidate.batterId)] || null;
    if (!profile) return null;
    const recent = getIndexedRecentAggregate(profile.id, dateInput.value || formatDate(new Date()), RECENT_FORM_DAY_WINDOW);
    const recentMetrics = recentHitterMetrics(recent);
    const opponentTeam = candidate?.opponentAbbrev ? await getTeamByAbbrev(candidate.opponentAbbrev).catch(() => null) : null;
    const matchupContext = await getPreferredBatterMatchupHistory(profile.id, candidate.pitcher.id, opponentTeam?.id || null).catch(() => ({ history: null, source: 'none' }));
    const history = matchupContext?.history;
    const bvpAvg = history?.atBats > 0 ? history.hits / history.atBats : null;
    const bvpSlg = history?.atBats > 0 ? history.totalBases / history.atBats : null;
    const recentOps = recentMetrics?.ops ?? null;
    const score = ((recentOps ?? 0.65) * 90) + ((bvpAvg ?? 0.24) * 70) + ((bvpSlg ?? 0.35) * 28) + statNumber(history?.homeRuns) * 4;
    return {
      playerId: profile.id,
      fullName: profile.fullName,
      teamAbbrev: profile.teamAbbrev,
      teamColor: profile.teamColor || getTeamColor(profile.teamAbbrev || ''),
      teamLogo: profile.teamLogo || getLogoPath(profile.teamAbbrev || ''),
      pitcherId: candidate.pitcher.id,
      pitcherName: candidate.pitcher.fullName || candidate.pitcher.name || 'Opposing pitcher',
      opponentAbbrev: candidate.opponentAbbrev,
      gamePk: candidate.game?.gamePk || null,
      score,
      recentText: recent ? recentHittingForm(recent) : 'Recent form index still building.',
      matchupText: history && (history.atBats || history.walks)
        ? `${history.hits}-${history.atBats} vs ${matchupContext?.source === 'team' ? `${candidate.opponentAbbrev} team` : (candidate.pitcher.fullName || candidate.pitcher.name || 'pitcher')} | AVG ${history.atBats > 0 ? formatRateValue(history.hits / history.atBats, 3, true) : '---'} | HR ${history.homeRuns}`
        : `No direct MLB sample yet vs ${candidate.pitcher.fullName || candidate.pitcher.name || 'pitcher'}${candidate.opponentAbbrev ? ` or ${candidate.opponentAbbrev} team` : ''}.`,
    };
  }));
  return enriched
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || String(a.fullName || '').localeCompare(String(b.fullName || '')))
    .slice(0, 10);
}

function findTodayMatchupGame(entry) {
  const team = String(entry?.teamAbbrev || '').toUpperCase();
  const playerId = Number(entry?.playerId);
  return latestRenderedGames.find((candidate) => {
    if (Number.isFinite(playerId) && playerId > 0 && candidate?.playerLookup?.[String(playerId)]) return true;
    return team && ([String(candidate?.away || '').toUpperCase(), String(candidate?.home || '').toUpperCase()].includes(team));
  }) || null;
}

function entryTodayPitcher(entry) {
  const game = findTodayMatchupGame(entry);
  if (!game) return { game: null, pitcher: null, opponentAbbrev: '', gameState: '' };
  const team = String(entry?.teamAbbrev || '').toUpperCase();
  const isAway = team === String(game.away || '').toUpperCase();
  return {
    game,
    pitcher: resolveFocusedOpponentPitcher(game, isAway ? 'away' : 'home'),
    opponentAbbrev: isAway ? game.home : game.away,
    gameState: game?.inningShort || game?.status || statusLine(game),
  };
}

function matchupMetrics(history) {
  if (!history || (!history.atBats && !history.walks && !history.plateAppearances)) {
    return {
      hasSample: false,
      sample: 'N/A',
      avgText: 'N/A',
      xbhText: 'N/A',
      hrText: 'N/A',
      kText: 'N/A',
      score: -1000,
    };
  }
  const atBats = statNumber(history.atBats);
  const hits = statNumber(history.hits);
  const strikeOuts = statNumber(history.strikeOuts);
  const homeRuns = statNumber(history.homeRuns);
  const xbh = statNumber(history.doubles) + statNumber(history.triples) + homeRuns;
  const avg = atBats > 0 ? hits / atBats : null;
  const slg = atBats > 0 ? statNumber(history.totalBases) / atBats : null;
  return {
    hasSample: true,
    sample: `${hits}-${atBats}`,
    avgText: atBats > 0 ? formatRateValue(avg, 3, true) : 'N/A',
    xbhText: String(xbh),
    hrText: String(homeRuns),
    kText: String(strikeOuts),
    score: ((avg ?? 0) * 180) + ((slg ?? 0) * 65) + (xbh * 7) + (homeRuns * 10) - (strikeOuts * 1.25),
  };
}

async function enrichHotEntryWithTodayMatchup(entry) {
  const today = entryTodayPitcher(entry);
  const pitcherId = Number(today?.pitcher?.id);
  const opponentTeam = today?.opponentAbbrev ? await getTeamByAbbrev(today.opponentAbbrev).catch(() => null) : null;
  const matchupContext = await getPreferredBatterMatchupHistory(entry.playerId, pitcherId, opponentTeam?.id || null).catch(() => ({ history: null, source: 'none' }));
  return {
    ...entry,
    matchup: matchupMetrics(matchupContext?.history),
    matchupSource: matchupContext?.source || 'none',
    pitcherId: pitcherId || null,
    pitcherName: today?.pitcher?.fullName || today?.pitcher?.name || '',
    opponentAbbrev: today?.opponentAbbrev || '',
    gamePk: entry?.gamePk || today?.game?.gamePk || null,
    matchupSummary: today?.game
      ? (today.pitcher
          ? `Today: vs ${today.opponentAbbrev} | ${today.pitcher.fullName || today.pitcher.name || 'Opponent pitcher'} | ${today.gameState}${matchupContext?.source === 'team' ? ' | team split fallback' : ''}`
          : `Today: vs ${today.opponentAbbrev} | ${today.gameState}`)
      : 'Today matchup unavailable for the selected date.',
  };
}

function hotEntryTodayMatchup(entry) {
  return entry?.matchupSummary || 'Today matchup unavailable for the selected date.';
}

function renderHotCards(entries, type = 'hitter') {
  const grid = document.createElement('div');
  grid.className = 'hot-card-grid';
  if (!entries.length) {
    const empty = createLeaderEmpty('No hot trends available for this filter yet.');
    grid.appendChild(empty);
    return grid;
  }
  for (const entry of entries) {
    const card = document.createElement('article');
    card.className = 'hot-card';
    if (entry.playerId) card.classList.add('is-clickable');
    card.dataset.playerId = String(entry.playerId || '');
    card.dataset.teamAbbrev = String(entry.teamAbbrev || '');
    card.dataset.teamName = String(entry.teamAbbrev || '');
    card.dataset.gamePk = String(entry.gamePk || '');
    card.style.setProperty('--team-color', entry.teamColor || '#66d9ff');
    const headline = type === 'pitcher'
        ? `Last ${Math.max(1, statNumber(entry?.games))} games`
        : `Last ${Math.max(1, statNumber(entry?.games))} games`;
    const xbh = Math.max(0, statNumber(entry?.batting?.totalBases) - statNumber(entry?.batting?.hits));
    const subLine = type === 'pitcher' ? recentPitchingForm(entry) : hotEntryTodayMatchup(entry);
    card.innerHTML = `
      <div class="hot-card-main">
        <div class="hot-card-media">
          <img class="hot-card-avatar" src="${playerHeadshotUrl(entry.playerId)}" alt="${entry.fullName || 'Player'} headshot" />
          <img class="hot-card-logo" src="${entry.teamLogo || 'placeholder.png'}" alt="${entry.teamAbbrev || 'team'} logo" />
        </div>
        <div class="hot-card-copy">
          <div class="hot-card-kicker">${headline}</div>
          <div class="hot-card-name-row">
            <span class="hot-card-team">${entry.teamAbbrev || 'MLB'}</span>
            <span class="hot-card-name">${entry.fullName || 'Unknown'}</span>
          </div>
          <div class="hot-card-summary">${subLine || 'Index building.'}</div>
        </div>
      </div>
      ${type === 'pitcher' ? '' : `
        <div class="hot-card-stats">
          <div class="hot-card-stat"><span>AVG</span><strong>${formatRateValue(entry.metrics?.avg, 3, true)}</strong></div>
          <div class="hot-card-stat"><span>OPS</span><strong>${formatRateValue(entry.metrics?.ops, 3, false)}</strong></div>
          <div class="hot-card-stat"><span>SLG</span><strong>${formatRateValue(entry.metrics?.slg, 3, true)}</strong></div>
          <div class="hot-card-stat"><span>H</span><strong>${statNumber(entry?.batting?.hits)}</strong></div>
          <div class="hot-card-stat"><span>XBH</span><strong>${xbh}</strong></div>
          <div class="hot-card-stat"><span>HR</span><strong>${statNumber(entry?.batting?.homeRuns)}</strong></div>
        </div>
        <div class="hot-card-stats hot-card-matchup-stats">
          <div class="hot-card-stat"><span>H-AB</span><strong>${entry?.matchup?.sample || 'N/A'}</strong></div>
          <div class="hot-card-stat"><span>AVG</span><strong>${entry?.matchup?.avgText || 'N/A'}</strong></div>
          <div class="hot-card-stat"><span>XBH</span><strong>${entry?.matchup?.xbhText || 'N/A'}</strong></div>
          <div class="hot-card-stat"><span>HR</span><strong>${entry?.matchup?.hrText || 'N/A'}</strong></div>
          <div class="hot-card-stat"><span>K</span><strong>${entry?.matchup?.kText || 'N/A'}</strong></div>
        </div>
      `}
    `;
    const avatar = card.querySelector('.hot-card-avatar');
    if (avatar) {
      avatar.onerror = () => {
        avatar.onerror = null;
        avatar.src = entry.teamLogo || 'placeholder.png';
      };
    }
    const logo = card.querySelector('.hot-card-logo');
    if (logo) {
      logo.onerror = () => {
        logo.onerror = null;
        logo.src = 'placeholder.png';
      };
    }
    grid.appendChild(card);
  }
  return grid;
}

function renderHotSection(title, subtitle, entries, type = 'hitter') {
  const wrap = document.createElement('section');
  wrap.className = 'hot-section';
  wrap.innerHTML = `
    <div class="leaders-section-header">
      <span class="leaders-section-title">${title}</span>
      <span class="leaders-section-subtitle">${subtitle}</span>
    </div>
  `;
  wrap.appendChild(renderHotCards(entries, type));
  return wrap;
}

function renderHotSpotlight(entry, coverageLabel) {
  const xbh = Math.max(0, statNumber(entry?.batting?.totalBases) - statNumber(entry?.batting?.hits));
  const card = document.createElement('article');
  card.className = 'hot-spotlight';
  if (entry?.playerId) card.classList.add('is-clickable');
  card.dataset.playerId = String(entry?.playerId || '');
  card.dataset.teamAbbrev = String(entry?.teamAbbrev || '');
  card.dataset.teamName = String(entry?.teamAbbrev || '');
  card.dataset.gamePk = String(entry?.gamePk || '');
  card.style.setProperty('--team-color', entry?.teamColor || '#66d9ff');
  card.innerHTML = `
    <div class="hot-spotlight-main">
      <div class="hot-spotlight-media">
        <img class="hot-spotlight-avatar" src="${playerHeadshotUrl(entry.playerId)}" alt="${entry.fullName || 'Player'} headshot" />
        <img class="hot-spotlight-logo" src="${entry.teamLogo || 'placeholder.png'}" alt="${entry.teamAbbrev || 'team'} logo" />
      </div>
      <div class="hot-spotlight-copy">
        <div class="hot-spotlight-kicker">Hottest Active Bat | ${coverageLabel}</div>
        <div class="hot-spotlight-name-row">
          <span class="hot-spotlight-team">${entry.teamAbbrev || 'MLB'}</span>
          <span class="hot-spotlight-name">${entry.fullName || 'Unknown'}</span>
        </div>
        <div class="hot-spotlight-summary">${hotEntryTodayMatchup(entry)}</div>
      </div>
    </div>
    <div class="hot-spotlight-stats">
      <div class="hot-spotlight-stat"><span>AVG</span><strong>${formatRateValue(entry.metrics?.avg, 3, true)}</strong></div>
      <div class="hot-spotlight-stat"><span>OPS</span><strong>${formatRateValue(entry.metrics?.ops, 3, false)}</strong></div>
      <div class="hot-spotlight-stat"><span>SLG</span><strong>${formatRateValue(entry.metrics?.slg, 3, true)}</strong></div>
      <div class="hot-spotlight-stat"><span>H</span><strong>${statNumber(entry?.batting?.hits)}</strong></div>
      <div class="hot-spotlight-stat"><span>XBH</span><strong>${xbh}</strong></div>
      <div class="hot-spotlight-stat"><span>HR</span><strong>${statNumber(entry?.batting?.homeRuns)}</strong></div>
    </div>
    <div class="hot-spotlight-stats hot-spotlight-matchup-stats">
      <div class="hot-spotlight-stat"><span>H-AB</span><strong>${entry?.matchup?.sample || 'N/A'}</strong></div>
      <div class="hot-spotlight-stat"><span>AVG</span><strong>${entry?.matchup?.avgText || 'N/A'}</strong></div>
      <div class="hot-spotlight-stat"><span>XBH</span><strong>${entry?.matchup?.xbhText || 'N/A'}</strong></div>
      <div class="hot-spotlight-stat"><span>HR</span><strong>${entry?.matchup?.hrText || 'N/A'}</strong></div>
      <div class="hot-spotlight-stat"><span>K</span><strong>${entry?.matchup?.kText || 'N/A'}</strong></div>
    </div>
  `;
  const avatar = card.querySelector('.hot-spotlight-avatar');
  if (avatar) {
    avatar.onerror = () => {
      avatar.onerror = null;
      avatar.src = entry.teamLogo || 'placeholder.png';
    };
  }
  const logo = card.querySelector('.hot-spotlight-logo');
  if (logo) {
    logo.onerror = () => {
      logo.onerror = null;
      logo.src = 'placeholder.png';
    };
  }
  return card;
}

function renderHotHittersBoard(payload) {
  const entries = Array.isArray(payload?.entries) ? payload.entries : [];
  const dates = Array.isArray(payload?.dates) ? payload.dates : [];
  const mode = String(payload?.mode || 'range');
  const coverageLabel = mode === 'season-fallback' ? `Season fallback | ${seasonForDate(dateInput.value || formatDate(new Date()))}` : hotWindowLabel(dates);
  const subtitle = mode === 'season-fallback'
    ? 'Recent 7-day data unavailable, showing best available season bats for this filter'
    : `Best bats over the last ${RECENT_FORM_DAY_WINDOW} days | ${coverageLabel}`;
  const shell = document.createElement('div');
  shell.className = 'leaders-shell hot-board-shell';
  const board = document.createElement('section');
  board.className = 'hot-board';
  board.innerHTML = `
    <div class="leaders-section-header">
      <span class="leaders-section-title">Active Hot Board</span>
      <span class="leaders-section-subtitle">${subtitle}</span>
    </div>
  `;
  if (!entries.length) {
    board.appendChild(createLeaderEmpty('No hot hitters available for this filter yet.'));
    shell.appendChild(board);
    return shell;
  }
  board.appendChild(renderHotSpotlight(entries[0], coverageLabel));
  const rest = entries.slice(1);
  if (rest.length) {
    const ranking = document.createElement('section');
    ranking.className = 'hot-section';
    ranking.innerHTML = `
      <div class="leaders-section-header">
        <span class="leaders-section-title">Team Picks</span>
        <span class="leaders-section-subtitle">${rest.length} more active hitters in the current board</span>
      </div>
    `;
    ranking.appendChild(renderHotCards(rest, 'hitter'));
    board.appendChild(ranking);
  }
  shell.appendChild(board);
  return shell;
}

async function refreshHotView(options = {}) {
  const { showLoading = false } = options;
  if (!hotPageEl || currentOverlayPage !== 'hot') return;
  const renderId = ++hotRenderSequence;
  updateLeadersContext();
  if (showLoading || !hotPageEl.querySelector('.leaders-shell')) {
    hotPageEl.replaceChildren(createLeaderEmpty('Loading hot board...'));
  }
  try {
    const hotHitters = await collectHotHitters(dateInput.value || formatDate(new Date()));
    if (renderId !== hotRenderSequence) return;
    const signature = JSON.stringify({
      mode: 'hot-hitters',
      sourceMode: hotHitters.mode || 'range',
      teamFilter: currentLeaderTeamSelection().teamId || '',
      opponents: currentLeadersOpponentMode,
      dates: hotHitters.dates,
      hitters: hotHitters.entries.map((entry) => [entry.playerId, Math.round(entry.score || 0)]),
    });
    if (hotPageEl.dataset.renderSignature === signature && hotPageEl.querySelector('.hot-board-shell')) return;
    hotPageEl.dataset.renderSignature = signature;
    hotPageEl.replaceChildren();
    hotPageEl.appendChild(renderHotHittersBoard(hotHitters));
  } catch (error) {
    if (renderId !== hotRenderSequence) return;
    hotPageEl.replaceChildren(createLeaderEmpty(`Could not load hot board (${error.message}).`));
  }
}

async function buildFocusedMatchupRows(game, side) {
  await hydratePlayerLookupForGame(game);
  const lineup = fallbackTeamLineupFromLookup(game, side).slice(0, 9);
  const opponentPitcher = resolveFocusedOpponentPitcher(game, side);
  const opponentAbbrev = String(side === 'away' ? game?.home : game?.away || '').toUpperCase();
  const opponentTeam = opponentAbbrev ? await getTeamByAbbrev(opponentAbbrev).catch(() => null) : null;
  if (!lineup.length) return [];
  const rows = await Promise.all(lineup.map(async (entry, index) => {
    let profile = game?.playerLookup?.[String(entry.id)] || null;
    if (!profile && Number.isFinite(Number(entry?.id)) && Number(entry.id) > 0) {
      profile = await fetchMlbPlayerProfile(entry.id, game).catch(() => null);
      if (profile) persistPlayerLookupForGame(game, { [String(entry.id)]: profile });
    }
    if (!profile?.id) return null;
    const matchupContext = await getPreferredBatterMatchupHistory(profile.id, opponentPitcher?.id || null, opponentTeam?.id || null).catch(() => ({ history: null, source: 'none' }));
    const recent = getIndexedRecentAggregate(profile.id, dateInput.value || formatDate(new Date()), RECENT_FORM_DAY_WINDOW);
    const recentMetrics = recentHitterMetrics(recent);
    const matchup = matchupMetrics(matchupContext?.history);
    const score = matchupContext?.source === 'pitcher'
      ? (matchup.hasSample
          ? matchup.score + ((recentMetrics?.ops ?? 0.62) * 6)
          : ((recentMetrics?.ops ?? 0.62) * 2) - 1000)
      : matchupContext?.source === 'team'
        ? (matchup.hasSample
            ? matchup.score + ((recentMetrics?.ops ?? 0.62) * 4) - 40
            : ((recentMetrics?.ops ?? 0.62) * 2) - 1000)
        : ((recentMetrics?.ops ?? 0.62) * 2) - 1000;
    return {
      playerId: profile.id,
      fullName: profile.fullName,
      teamAbbrev: profile.teamAbbrev,
      teamColor: profile.teamColor || getTeamColor(profile.teamAbbrev || ''),
      teamLogo: profile.teamLogo || getLogoPath(profile.teamAbbrev || ''),
      gamePk: game?.gamePk || null,
      pitcherName: opponentPitcher?.fullName || opponentPitcher?.name || 'Opposing pitcher',
      lineupSlot: Number(entry.slot) || index + 1,
      sample: matchup.sample,
      avgText: matchup.avgText,
      xbhText: matchup.xbhText,
      hrText: matchup.hrText,
      kText: matchup.kText,
      hasMatchupSample: matchup.hasSample,
      matchupSource: matchupContext?.source || 'none',
      matchupNote: matchupContext?.source === 'team'
        ? `#${Number(entry.slot) || index + 1} in order | team split vs ${opponentAbbrev}`
        : `#${Number(entry.slot) || index + 1} in order`,
      recentOps: recentMetrics?.ops ?? null,
      recent: recent ? recentHittingForm(recent) : 'Recent form index building.',
      score,
    };
  }));
  return rows
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || (a.lineupSlot - b.lineupSlot))
    .slice(0, 9);
}

function resolveFocusedOpponentPitcher(game, side) {
  const opponentSide = side === 'away' ? 'home' : 'away';
  const current = game?.pitching?.[opponentSide]?.current || null;
  if (current?.id) {
    const currentSummary = String(current?.today || '').trim().toLowerCase();
    const sourceLabel = currentSummary === 'not in yet' ? 'probable starter' : 'live pitcher';
    return { ...current, sourceLabel };
  }
  const probable = game?.probablePitchers?.[opponentSide] || game?.teams?.[opponentSide]?.probablePitcher || null;
  if (probable?.id) return { ...probable, sourceLabel: 'probable starter' };
  return null;
}

window.exportMlbMatchupRangeCsv = exportMlbMatchupRangeCsv;
window.exportMlbRangeCsv = exportMlbMatchupRangeCsv;

function renderFocusedMatchupTable(title, subtitle, rows = []) {
  const wrap = document.createElement('section');
  wrap.className = 'focused-matchup-table-wrap';
  wrap.innerHTML = `
    <div class="focused-matchup-header">
      <span class="focused-matchup-title">${title}</span>
      <span class="focused-matchup-subtitle">${subtitle}</span>
    </div>
  `;
  if (!rows.length) {
    const empty = createLeaderEmpty('No hitter matchup sample available yet.');
    wrap.appendChild(empty);
    return wrap;
  }
  const table = document.createElement('table');
  table.className = 'focused-matchup-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Hitter</th>
        <th>H-AB</th>
        <th>AVG</th>
        <th>XBH</th>
        <th>HR</th>
        <th>K</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');
  for (const row of rows) {
    const avgValue = statRate(row.avgText);
    const hrValue = statNumber(row.hrText);
    const avgClass = avgValue != null && avgValue >= 0.300 ? ' focused-matchup-stat-elite' : '';
    const hrClass = hrValue >= 1 ? ' focused-matchup-stat-elite' : '';
    const tr = document.createElement('tr');
    tr.dataset.playerId = String(row.playerId || '');
    tr.dataset.teamAbbrev = String(row.teamAbbrev || '');
    tr.dataset.teamName = String(row.teamAbbrev || '');
    tr.dataset.gamePk = String(row.gamePk || '');
    tr.innerHTML = `
      <td class="focused-matchup-col-player">
        <div class="focused-matchup-player">
          <img class="focused-matchup-avatar" src="${playerHeadshotUrl(row.playerId)}" alt="${row.fullName || 'Player'} headshot" />
          <div>
            <div class="focused-matchup-player-name">${row.fullName || 'Unknown'}</div>
            <div class="focused-matchup-player-note">${row.matchupNote || `#${row.lineupSlot || '-'} in order`}</div>
          </div>
        </div>
      </td>
      <td class="focused-matchup-col-stat">${row.sample}</td>
      <td class="focused-matchup-col-stat${avgClass}">${row.avgText}</td>
      <td class="focused-matchup-col-stat">${row.xbhText}</td>
      <td class="focused-matchup-col-stat${hrClass}">${row.hrText}</td>
      <td class="focused-matchup-col-stat">${row.kText}</td>
    `;
    const img = tr.querySelector('.focused-matchup-avatar');
    if (img) {
      img.onerror = () => {
        img.onerror = null;
        img.src = row.teamLogo || 'placeholder.png';
      };
    }
    tbody?.appendChild(tr);
  }
  wrap.appendChild(table);
  return wrap;
}

function focusedMatchupSubtitle(game, side) {
  const pitcher = resolveFocusedOpponentPitcher(game, side);
  const opponent = displayTeamAbbrev(side === 'away' ? game?.home : game?.away);
  if (!pitcher) return `Vs ${opponent || 'Opponent'}`;
  const pitcherName = pitcher.fullName || pitcher.name || opponent || 'Opponent';
  return pitcher.sourceLabel ? `Vs ${pitcherName} (${pitcher.sourceLabel})` : `Vs ${pitcherName}`;
}

async function renderFocusedMatchupPanel(card, game) {
  const panel = card?.querySelector('.focused-matchup-panel');
  if (!panel) return;
  if (!isFocusedGame(game?.gamePk)) {
    panel.hidden = true;
    panel.dataset.renderSignature = '';
    panel.replaceChildren();
    return;
  }
  panel.hidden = false;
  const token = `${game?.gamePk || ''}:${Date.now()}`;
  panel.dataset.renderToken = token;
  try {
    const activeSide = focusedMatchupSide(game?.gamePk);
    const rows = await buildFocusedMatchupRows(game, activeSide);
    if (panel.dataset.renderToken !== token) return;
    const signature = JSON.stringify({
      activeSide,
      pitcher: resolveFocusedOpponentPitcher(game, activeSide)?.id || '',
      rows: rows.map((row) => [row.playerId, row.sample, row.avgText, row.xbhText, row.hrText, row.kText]),
    });
    if (panel.dataset.renderSignature === signature && panel.children.length) return;
    panel.dataset.renderSignature = signature;
    panel.replaceChildren();
    const teamTitle = activeSide === 'home' ? `${displayTeamAbbrev(game.home)} Hitters` : `${displayTeamAbbrev(game.away)} Hitters`;
    const table = renderFocusedMatchupTable(teamTitle, focusedMatchupSubtitle(game, activeSide), rows);
    table.classList.add('focused-matchup-table-wrap-single');
    panel.appendChild(table);
  } catch (error) {
    if (panel.dataset.renderToken !== token) return;
    panel.replaceChildren(createLeaderEmpty(`Could not load hitter matchups (${error.message}).`));
  }
}

function renderHotFocusedGameCard(game) {
  const sourceCard = gamesEl?.querySelector(`.game-card[data-game-pk='${game?.gamePk}']`);
  let card = sourceCard ? sourceCard.cloneNode(true) : null;
  if (!card) {
    const fragment = template.content.cloneNode(true);
    card = fragment.querySelector('.game-card');
    if (!card) return createLeaderEmpty('Could not render focused game preview.');
    card.dataset.gamePk = String(game?.gamePk || '');
    const scoreboardEl = card.querySelector('.scoreboard');
    card.querySelector('.away').textContent = game?.away || '';
    card.querySelector('.home').textContent = game?.home || '';
    card.querySelector('.away-score').textContent = game?.awayScore ?? '';
    card.querySelector('.home-score').textContent = game?.homeScore ?? '';
    card.querySelector('.away').style.color = game?.awayColor || '';
    card.querySelector('.home').style.color = game?.homeColor || '';
    card.querySelector('.away-score').style.color = game?.awayColor || '';
    card.querySelector('.home-score').style.color = game?.homeColor || '';
    setLogo(card.querySelector('.away-logo'), game?.awayLogo, `${game?.away || 'Away'} logo`);
    setLogo(card.querySelector('.home-logo'), game?.homeLogo, `${game?.home || 'Home'} logo`);
    const awayMatchupEl = card.querySelector('.away-matchup');
    const homeMatchupEl = card.querySelector('.home-matchup');
    renderScoreboardMatchupLine(awayMatchupEl, game, 'away');
    renderScoreboardMatchupLine(homeMatchupEl, game, 'home');
    hydratePitcherFireStreaks(card);
    hydratePitcherColdStreaks(card);
    renderScoreStateStrip(card, game);
    renderScorePlaySummary(card, game);
    syncScoreboardScale(scoreboardEl);
  }
  card.classList.add('hot-focused-card', 'is-focused');
  card.classList.remove('is-condensed');
  card.querySelector('.focused-matchup-panel')?.remove();
  card.querySelectorAll('.scoreboard-resize-handle').forEach((handle) => handle.remove());
  return card;
}

async function renderHotFocusedMatchupBoard(game) {
  const [awayRows, homeRows] = await Promise.all([
    buildFocusedMatchupRows(game, 'away'),
    buildFocusedMatchupRows(game, 'home'),
  ]);
  const wrap = document.createElement('section');
  wrap.className = 'hot-focused-matchups';
  wrap.innerHTML = `
    <div class="leaders-section-header">
      <span class="leaders-section-title">Best Matchups</span>
      <span class="leaders-section-subtitle">${game?.away || ''} vs ${game?.home || ''} hitter edges</span>
    </div>
  `;
  const grid = document.createElement('div');
  grid.className = 'focused-matchup-grid hot-focused-matchup-grid';
  grid.appendChild(renderFocusedMatchupTable(`${displayTeamAbbrev(game.away)} Hitters`, `Vs ${game?.pitching?.home?.current?.fullName || displayTeamAbbrev(game.home)}`, awayRows));
  grid.appendChild(renderFocusedMatchupTable(`${displayTeamAbbrev(game.home)} Hitters`, `Vs ${game?.pitching?.away?.current?.fullName || displayTeamAbbrev(game.away)}`, homeRows));
  wrap.appendChild(grid);
  return wrap;
}

function buildLeaderOverlayGame(leader) {
  const liveGame = leader?.gamePk
    ? latestRenderedGames.find((game) => String(game.gamePk) === String(leader.gamePk))
      || getCachedGames().find((game) => String(game.gamePk) === String(leader.gamePk))
    : null;
  if (liveGame) return liveGame;
  const teamAbbrev = leader?.teamAbbrev || 'MLB';
  return {
    away: teamAbbrev,
    home: '',
    awayLogo: leader?.teamLogo || getLogoPath(teamAbbrev),
    homeLogo: leader?.teamLogo || getLogoPath(teamAbbrev),
    awayColor: leader?.teamColor || getTeamColor(teamAbbrev),
    homeColor: leader?.teamColor || getTeamColor(teamAbbrev),
    playerLookup: {},
  };
}

async function refreshLeadersView(options = {}) {
  const { showLoading = false } = options;
  if (!leadersPageEl || currentOverlayPage !== 'leaders') return;
  const renderId = ++leadersRenderSequence;
  updateLeadersContext();
  if (showLoading || !leadersPageEl.querySelector('.leaders-shell')) {
    leadersPageEl.replaceChildren(createLeaderEmpty('Loading leaders...'));
  }
  try {
    const { teamId } = currentLeaderTeamSelection();
    const matchup = selectedLeaderMatchup(latestRenderedGames);
    let leaderMap;
    if (currentLeadersOpponentMode && matchup) {
      leaderMap = await getOpponentFilteredLeaderBoards(matchup);
    } else {
      const selectedTeam = latestLeaderTeams.find((team) => String(team.id) === String(teamId)) || null;
      leaderMap = await getSeasonLeaderBoards(selectedTeam);
    }
    if (renderId !== leadersRenderSequence) return;
    const signature = JSON.stringify(
      LEADER_SECTIONS.flatMap((section) => section.categories.map((category) => ({
        key: category.key,
        leaders: leaderMap.get(category.key) || [],
      }))),
    );
    if (leadersPageEl.dataset.renderSignature === signature && leadersPageEl.querySelector('.leaders-shell')) return;
    leadersPageEl.dataset.renderSignature = signature;
    renderLeadersBoard(leaderMap);
  } catch (error) {
    if (renderId !== leadersRenderSequence) return;
    leadersPageEl.replaceChildren(createLeaderEmpty(`Could not load leaders (${error.message}).`));
  }
}

function initLeadersControls() {
  leadersTeamSelectEl?.addEventListener('change', () => {
    syncLeadersOpponentsButton(latestRenderedGames);
    updateLeadersContext();
    if (currentOverlayPage === 'leaders') refreshLeadersView();
    if (currentOverlayPage === 'hot') refreshHotView();
  });
  leadersOpponentsBtnEl?.addEventListener('click', () => {
    if (leadersOpponentsBtnEl.disabled) return;
    currentLeadersOpponentMode = !currentLeadersOpponentMode;
    syncLeadersOpponentsButton(latestRenderedGames);
    updateLeadersContext();
    if (currentOverlayPage === 'leaders') refreshLeadersView();
    if (currentOverlayPage === 'hot') refreshHotView();
  });
  leadersPageEl?.addEventListener('click', (e) => {
    const item = e.target.closest('.leader-item[data-player-id], .leader-spotlight[data-player-id]');
    if (!item) return;
    const playerId = Number(item.dataset.playerId);
    if (!Number.isFinite(playerId) || playerId <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    openPlayerStatOverlay(playerId, buildLeaderOverlayGame({
      playerId,
      teamAbbrev: item.dataset.teamAbbrev || '',
      teamName: item.dataset.teamName || '',
      gamePk: item.dataset.gamePk || '',
    }));
  });
  hotPageEl?.addEventListener('click', (e) => {
    const item = e.target.closest('.hot-card[data-player-id], .hot-spotlight[data-player-id]');
    if (!item) return;
    const playerId = Number(item.dataset.playerId);
    if (!Number.isFinite(playerId) || playerId <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    openPlayerStatOverlay(playerId, buildLeaderOverlayGame({
      playerId,
      teamAbbrev: item.dataset.teamAbbrev || '',
      teamName: item.dataset.teamName || '',
      gamePk: item.dataset.gamePk || '',
    }));
  });
}

function baseSummaryText(bases) {
  const labels = [];
  if (bases?.first) labels.push('1B');
  if (bases?.second) labels.push('2B');
  if (bases?.third) labels.push('3B');
  return labels.length ? labels.join(' | ') : 'Bases empty';
}

function countSummaryText(game) {
  return `B ${game.balls} | S ${game.strikes} | O ${game.outs}`;
}

function renderMiniBases(container, bases) {
  container.querySelector('.mini-base.first')?.classList.toggle('on', Boolean(bases?.first));
  container.querySelector('.mini-base.second')?.classList.toggle('on', Boolean(bases?.second));
  container.querySelector('.mini-base.third')?.classList.toggle('on', Boolean(bases?.third));
}

function renderPitcherListItems(listEl, pitchers, color, emptyText) {
  if (!listEl) return;
  listEl.replaceChildren();
  const items = Array.isArray(pitchers) ? pitchers : [];
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'lineup-empty';
    empty.textContent = emptyText;
    listEl.appendChild(empty);
    return;
  }
  for (const arm of items) {
    const li = document.createElement('li');
    li.className = 'bullpen-item';
    li.dataset.playerId = String(arm.id ?? '');
    li.innerHTML = `
      <div class="bullpen-main">
        <span class="bullpen-name" style="color:${color}">${pitcherNameHtml(arm)}</span>
        <span class="bullpen-meta">${pitcherSeasonMetaLine(arm)}</span>
      </div>
      <div class="bullpen-today">${arm.today}</div>
    `;
    listEl.appendChild(li);
  }
}

function splitPitchingDisplayGroups(staff) {
  const current = staff?.current || null;
  const bullpen = Array.isArray(staff?.bullpen) ? [...staff.bullpen] : [];
  const currentId = Number(current?.id);
  const starters = bullpen
    .filter((arm) => Number(arm?.id) !== currentId)
    .filter((arm) => isStarterLikePitcher(arm))
    .sort((a, b) => pitcherGamesStarted(b) - pitcherGamesStarted(a) || pitcherStrikeoutCount(b) - pitcherStrikeoutCount(a) || String(a?.name || '').localeCompare(String(b?.name || '')));
  const relievers = bullpen
    .filter((arm) => Number(arm?.id) !== currentId)
    .filter((arm) => !isStarterLikePitcher(arm));
  const closer = relievers.length
    ? [...relievers].sort((a, b) => pitcherSaveCount(b) - pitcherSaveCount(a) || pitcherStrikeoutCount(b) - pitcherStrikeoutCount(a) || String(a?.name || '').localeCompare(String(b?.name || '')))[0]
    : null;
  const reliefOrdered = closer
    ? relievers
        .filter((arm) => Number(arm?.id) !== Number(closer?.id))
        .sort((a, b) => {
          const aToday = a.today !== 'Unused today' ? 1 : 0;
          const bToday = b.today !== 'Unused today' ? 1 : 0;
          if (bToday !== aToday) return bToday - aToday;
          if (b.pitches !== a.pitches) return b.pitches - a.pitches;
          return String(a?.name || '').localeCompare(String(b?.name || ''));
        })
        .concat([closer])
    : relievers.sort((a, b) => {
        const aToday = a.today !== 'Unused today' ? 1 : 0;
        const bToday = b.today !== 'Unused today' ? 1 : 0;
        if (bToday !== aToday) return bToday - aToday;
        if (b.pitches !== a.pitches) return b.pitches - a.pitches;
        return String(a?.name || '').localeCompare(String(b?.name || ''));
      });
  return { starters, relievers: reliefOrdered };
}

function renderPitchingSide(sectionEl, teamCode, color, staff) {
  if (!sectionEl) return;
  const titleEl = sectionEl.querySelector('.lineup-pitching-team-code');
  const currentEl = sectionEl.querySelector('.current-pitcher-card');
  const rotationEl = sectionEl.querySelector('.rotation-list');
  const bullpenEl = sectionEl.querySelector('.bullpen-list');
  if (titleEl) {
    titleEl.textContent = displayTeamAbbrev(teamCode);
    titleEl.style.color = color;
  }

  const current = staff?.current;
  if (currentEl) {
    currentEl.dataset.playerId = String(current?.id ?? '');
    const currentLabel = current?.role === 'starter' ? 'Starter' : 'Current Pitcher';
    currentEl.innerHTML = current ? `
      <div class="pitching-card-label">${currentLabel}</div>
      <div class="pitching-card-name" style="color:${color}">${pitcherNameHtml(current)}</div>
      <div class="pitching-card-meta">${pitcherSeasonMetaLine(current)}</div>
      <div class="pitching-card-today">${current.today}</div>
    ` : '<div class="pitching-card-empty">Awaiting pitcher</div>';
  }

  const groups = splitPitchingDisplayGroups(staff);
  renderPitcherListItems(rotationEl, groups.starters, color, 'No additional starters loaded');
  renderPitcherListItems(bullpenEl, groups.relievers, color, 'Awaiting relief data');
}

function renderLineupPitcherSummary(containerEl, color, staff) {
  if (!containerEl) return;
  const starter = staff?.starter || staff?.current || null;
  const current = staff?.current || starter || null;
  const active = Boolean(staff?.active && current);
  const hasChangedPitcher = Boolean(current && starter && Number(current?.id) !== Number(starter?.id));
  const showingCurrent = Boolean(current && (active || hasChangedPitcher));
  const displayPitcher = showingCurrent ? current : starter;
  containerEl.dataset.playerId = String((displayPitcher?.id ?? current?.id ?? starter?.id) || '');
  containerEl.classList.toggle('is-current-pitching', active);
  if (!starter) {
    containerEl.innerHTML = '<span class="lineup-team-pitcher-empty">Awaiting pitcher</span>';
    return;
  }
  const detailLine = showingCurrent && hasChangedPitcher
    ? `<span class="lineup-team-pitcher-current">Starter: ${pitcherNameHtml(starter)}</span>`
    : `<span class="lineup-team-pitcher-current${active ? ' is-active' : ''}">Current: ${pitcherNameHtml(current)}${Number(current?.id) === Number(starter?.id) ? ' (starter)' : ''}</span>`;
  containerEl.innerHTML = `
    <span class="lineup-team-pitcher-label">${showingCurrent ? 'Current Pitcher' : 'Starter'}</span>
    <span class="lineup-team-pitcher-name" style="color:${color}">${pitcherNameHtml(displayPitcher)}</span>
    <span class="lineup-team-pitcher-meta">${pitcherSeasonMetaLine(displayPitcher)}</span>
    ${detailLine}
  `;
}

function pitcherSeasonMetaLine(pitcher) {
  return `IP ${cleanSummary(pitcher?.ip) || '0.0'} | ERA ${cleanSummary(pitcher?.era) || '---'} | WHIP ${cleanSummary(pitcher?.whip) || '---'} | HR Allowed ${pitcherHomeRunsAllowed(pitcher)}`;
}

function normalizePitcherDisplayEntry(entry, role = 'current') {
  if (!entry) return null;
  if (entry.fullName && Object.prototype.hasOwnProperty.call(entry, 'era') && Object.prototype.hasOwnProperty.call(entry, 'whip')) {
    return {
      ...entry,
      ip: cleanSummary(entry.ip) || '0.0',
      hrAllowed: pitcherHomeRunsAllowed(entry),
      gs: pitcherGamesStarted(entry),
      gp: pitcherGamesPlayed(entry),
      gf: pitcherGamesFinished(entry),
      saves: pitcherSaveCount(entry),
      so: pitcherStrikeoutCount(entry),
      throws: entry.throws || entry.pitchHand?.code || entry.pitchHand?.description || '',
      today: cleanSummary(entry.today) || (role === 'starter' ? 'Not in yet' : 'Awaiting pitcher'),
      role: entry.role || role,
    };
  }
  return {
    id: entry?.id ?? entry?.person?.id ?? null,
    name: entry?.name || lastName(entry?.fullName || entry?.person?.fullName || 'Unknown'),
    fullName: entry?.fullName || entry?.person?.fullName || 'Unknown',
    ip: pitcherInningsPitched(entry),
    era: pitcherEra(entry),
    whip: pitcherWhip(entry),
    hrAllowed: pitcherHomeRunsAllowed(entry),
    gs: pitcherGamesStarted(entry),
    gp: pitcherGamesPlayed(entry),
    gf: pitcherGamesFinished(entry),
    saves: pitcherSaveCount(entry),
    so: pitcherStrikeoutCount(entry),
    throws: entry?.throws || entry?.pitching?.throws || entry?.person?.pitchHand?.code || entry?.pitchHand?.code || entry?.pitchHand?.description || '',
    today: cleanSummary(entry?.today || entry?.todayPitching) || (role === 'starter' ? 'Not in yet' : pitcherTodaySummary(entry)),
    pitches: Number(entry?.pitches) || pitchCount(entry),
    isActive: Boolean(entry?.isActive),
    role: entry?.role || role,
  };
}

function pitcherEntryNeedsProfile(entry) {
  if (!entry) return true;
  const era = cleanSummary(entry?.pitching?.era || entry?.stats?.pitching?.era || entry?.seasonStats?.pitching?.era || entry?.era);
  const whip = cleanSummary(entry?.pitching?.whip || entry?.stats?.pitching?.whip || entry?.seasonStats?.pitching?.whip || entry?.whip);
  const throws = handednessCode(entry?.throws || entry?.pitching?.throws || entry?.person?.pitchHand?.code || entry?.pitchHand?.code || entry?.pitchHand?.description);
  return !era || era === '---' || !whip || whip === '---' || !hasPitcherHomeRunsAllowedData(entry) || !throws;
}

function resolveLivePitcherSnapshot(live) {
  const currentPlay = live?.liveData?.plays?.currentPlay;
  const allPlays = live?.liveData?.plays?.allPlays || [];
  const activePlay = currentPlay?.matchup ? currentPlay : (allPlays.length ? allPlays[allPlays.length - 1] : null);
  const side = resolveCurrentSide(activePlay, live?.liveData?.linescore);
  return {
    activePlay,
    battingSide: side.battingSide,
    currentPitcher: activePlay?.matchup?.pitcher || null,
    currentPitchingSide: activePlay?.matchup?.pitcher?.id ? side.fieldingSide : '',
  };
}

async function resolveFreshLineupPitchers(game) {
  const fallback = {
    away: resolveLineupPitcherForDisplay(game, 'away'),
    home: resolveLineupPitcherForDisplay(game, 'home'),
  };
  if (!game?.gamePk) return fallback;
  if (shouldPreferProbablePitcher(game)) return fallback;

  try {
    const live = await getLiveGameFeed(game.gamePk);
    const awayTeam = live?.gameData?.teams?.away || {};
    const homeTeam = live?.gameData?.teams?.home || {};
    const probablePitchers = {
      away: awayTeam?.probablePitcher || game?.probablePitchers?.away || null,
      home: homeTeam?.probablePitcher || game?.probablePitchers?.home || null,
    };
    const awayAbbrev = canonicalTeamAbbrev(awayTeam.abbreviation || awayTeam.teamCode?.toUpperCase() || game?.away || 'AWAY');
    const homeAbbrev = canonicalTeamAbbrev(homeTeam.abbreviation || homeTeam.teamCode?.toUpperCase() || game?.home || 'HOME');
    const awayPlayers = live?.liveData?.boxscore?.teams?.away?.players || {};
    const homePlayers = live?.liveData?.boxscore?.teams?.home?.players || {};
    const liveLookup = {
      ...buildPlayerLookup(awayPlayers, live?.gameData?.players || {}, awayAbbrev, game?.awayColor || getTeamColor(awayAbbrev), game?.awayLogo || getLogoPath(awayAbbrev)),
      ...buildPlayerLookup(homePlayers, live?.gameData?.players || {}, homeAbbrev, game?.homeColor || getTeamColor(homeAbbrev), game?.homeLogo || getLogoPath(homeAbbrev)),
    };
    if (Object.keys(liveLookup).length) persistPlayerLookupForGame(game, liveLookup);
    game.probablePitchers = probablePitchers;

    const livePitcher = resolveLivePitcherSnapshot(live);
    const sidePlayers = {
      away: awayPlayers,
      home: homePlayers,
    };
    const sidePitcherOrder = {
      away: live?.liveData?.boxscore?.teams?.away?.pitchers || [],
      home: live?.liveData?.boxscore?.teams?.home?.pitchers || [],
    };

    const buildSide = async (side) => {
      const probable = probablePitchers?.[side] || null;
      const players = sidePlayers[side] || {};
      const starterCandidate = starterCandidateFromPitchers(
        Object.values(players).filter(isPitcherPlayer),
        probable,
        sidePitcherOrder[side],
      );
      let starterSource = probable?.id
        ? game?.playerLookup?.[String(probable.id)] || players[`ID${probable.id}`] || probable
        : starterCandidate;
      if (probable?.id && pitcherEntryNeedsProfile(starterSource)) {
        const fetchedStarter = await fetchMlbPlayerProfile(probable.id, game).catch(() => null);
        if (fetchedStarter) {
          starterSource = fetchedStarter;
          persistPlayerLookupForGame(game, { [String(probable.id)]: fetchedStarter });
        }
      }
      if ((!starterSource || pitcherEntryNeedsProfile(starterSource)) && starterCandidate?.person?.id) {
        const starterCandidateId = Number(starterCandidate.person.id);
        const fetchedStarterCandidate = await fetchMlbPlayerProfile(starterCandidateId, game).catch(() => null);
        if (fetchedStarterCandidate) {
          starterSource = fetchedStarterCandidate;
          persistPlayerLookupForGame(game, { [String(starterCandidateId)]: fetchedStarterCandidate });
        } else if (!starterSource) {
          starterSource = starterCandidate;
        }
      }

      const currentPitcherId = livePitcher.currentPitchingSide === side ? Number(livePitcher.currentPitcher?.id) : NaN;
      let currentSource = Number.isFinite(currentPitcherId)
        ? game?.playerLookup?.[String(currentPitcherId)] || players[`ID${currentPitcherId}`] || livePitcher.currentPitcher
        : starterSource;
      if (Number.isFinite(currentPitcherId) && pitcherEntryNeedsProfile(currentSource)) {
        const fetchedCurrent = await fetchMlbPlayerProfile(currentPitcherId, game).catch(() => null);
        if (fetchedCurrent) {
          currentSource = fetchedCurrent;
          persistPlayerLookupForGame(game, { [String(currentPitcherId)]: fetchedCurrent });
        }
      }

      const starter = normalizePitcherDisplayEntry(starterSource || probable, 'starter');
      const current = normalizePitcherDisplayEntry(currentSource, 'current');
      return {
        starter: starter || current,
        current,
        active: side === livePitcher.currentPitchingSide,
      };
    };

    return {
      away: await buildSide('away'),
      home: await buildSide('home'),
    };
  } catch {
    return fallback;
  }
}

async function ensurePitcherProfiles(game, entries = []) {
  const neededIds = [...new Set(
    listify(entries)
      .map((entry) => Number(entry?.id))
      .filter((id) => Number.isFinite(id) && id > 0),
  )].filter((id) => {
    const existing = game?.playerLookup?.[String(id)] || entries.find((entry) => Number(entry?.id) === id) || null;
    return pitcherEntryNeedsProfile(existing);
  });
  if (!neededIds.length) return;
  const fetchedPairs = await Promise.all(
    neededIds.map(async (id) => {
      const profile = await fetchMlbPlayerProfile(id, game).catch(() => null);
      return profile ? [String(id), profile] : null;
    }),
  );
  const lookup = Object.fromEntries(fetchedPairs.filter(Boolean));
  if (Object.keys(lookup).length) persistPlayerLookupForGame(game, lookup);
}

function resolvePitchingSideForDisplay(game, side) {
  const rawStaff = game?.pitching?.[side] || { current: null, bullpen: [] };
  const enrichPitcher = (entry) => {
    const profile = Number.isFinite(Number(entry?.id)) ? game?.playerLookup?.[String(entry.id)] || null : null;
    return profile ? { ...entry, ...profile, role: entry?.role || profile?.role } : entry;
  };
  const bullpen = Array.isArray(rawStaff?.bullpen)
    ? rawStaff.bullpen.map((entry) => normalizePitcherDisplayEntry(enrichPitcher(entry), entry?.role || 'bullpen')).filter(Boolean)
    : [];
  const probable = game?.probablePitchers?.[side] || game?.teams?.[side]?.probablePitcher || null;
  const probableProfile = probable?.id ? game?.playerLookup?.[String(probable.id)] || null : null;
  const fallback = normalizePitcherDisplayEntry(probableProfile || probable, 'starter');
  if (shouldPreferProbablePitcher(game) && fallback) {
    return {
      current: { ...fallback, today: cleanSummary(fallback.today) || 'Not in yet', role: 'starter' },
      bullpen,
    };
  }

  const current = normalizePitcherDisplayEntry(enrichPitcher(rawStaff?.current), rawStaff?.current?.role || 'current');
  if (current) return { current, bullpen };

  return {
    current: fallback ? { ...fallback, today: cleanSummary(fallback.today) || 'Not in yet', role: 'starter' } : null,
    bullpen,
  };
}

function resolveLineupPitcherForDisplay(game, side) {
  const probable = game?.probablePitchers?.[side] || game?.teams?.[side]?.probablePitcher || null;
  const probableProfile = probable?.id ? game?.playerLookup?.[String(probable.id)] || null : null;
  const starter = normalizePitcherDisplayEntry(probableProfile || probable, 'starter');
  const currentSource = game?.pitching?.[side]?.current;
  const currentProfile = currentSource?.id ? game?.playerLookup?.[String(currentSource.id)] || null : null;
  const current = normalizePitcherDisplayEntry(currentProfile ? { ...currentSource, ...currentProfile, role: currentSource?.role || currentProfile?.role } : currentSource, 'current');
  const activeSide = game?.battingSide === 'home' ? 'away' : game?.battingSide === 'away' ? 'home' : '';
  return {
    starter: starter || current,
    current: shouldPreferProbablePitcher(game) ? (starter || current) : current,
    active: side === activeSide,
  };
}

function submitPendingGamePicksThroughBetInput(oddsOverride = null, amountOverride = null) {
  const picks = getPendingGamePickEntries(latestRenderedGames);
  if (!picks.length) return false;
  const payload = buildBetSubmissionPayload({
    oddsOverride,
    amountOverride,
    includePendingGamePicks: true,
  });
  if (!payload.odds || !Number.isFinite(payload.amount) || payload.amount <= 0) {
    focusBetInputField(!payload.odds ? 'odds' : 'amount');
    return false;
  }
  return submitBetInput({
    oddsOverride: payload.odds,
    amountOverride: payload.amount,
    includePendingGamePicks: true,
  });
}

function confirmPendingGamePicksFromDialog() {
  const odds = String(gamePickDialogOddsEl?.value || '').trim();
  const amount = String(gamePickDialogAmountEl?.value || '').trim();
  if (!submitPendingGamePicksThroughBetInput(odds, amount)) return false;
  closeGamePickDialog();
  return true;
}

function jumpDateToToday() {
  const today = formatDate(new Date());
  if (dateInput.value === today) return;
  dateInput.value = today;
  dateInput.dispatchEvent(new Event('change', { bubbles: true }));
}

function setLogo(el, src, alt) {
  if (el.dataset.src !== src) {
    el.src = src;
    el.dataset.src = src;
  }
  el.alt = alt;
  el.onerror = () => {
    el.onerror = null;
    el.src = 'placeholder.png';
  };
}

function renderCountDots(container, total, filled, type) {
  if (!container) return;
  container.replaceChildren();
  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (i < filled) dot.classList.add(`fill-${type}`);
    container.appendChild(dot);
  }
}

function renderScoreStateStrip(card, game) {
  const pregame = shouldPreferProbablePitcher(game);
  card.querySelector('.score-mini-balls strong').textContent = pregame ? '-' : game.balls;
  card.querySelector('.score-mini-strikes strong').textContent = pregame ? '-' : game.strikes;
  card.querySelector('.score-mini-outs strong').textContent = pregame ? '-' : game.outs;
  card.querySelector('.score-mini-base.first')?.classList.toggle('on', !pregame && Boolean(game.bases?.first));
  card.querySelector('.score-mini-base.second')?.classList.toggle('on', !pregame && Boolean(game.bases?.second));
  card.querySelector('.score-mini-base.third')?.classList.toggle('on', !pregame && Boolean(game.bases?.third));
}

function renderScorePlaySummary(card, game) {
  const inningEl = card.querySelector('.score-mini-inning');
  const lastPlayEl = card.querySelector('.score-mini-last-play');
  if (inningEl && inningEl.textContent !== String(game.inningShort || '')) inningEl.textContent = game.inningShort;
  if (!lastPlayEl) return;

  if (isFocusedGame(game.gamePk)) {
    const plays = (game.ticker?.length ? game.ticker : [{ text: game.lastPlay || 'Awaiting first pitch', color: '#cddfff' }]).slice(0, 3);
    renderMultiLineSummary(lastPlayEl, plays);
    return;
  }

  renderSingleLineMarquee(lastPlayEl, game.lastPlay || 'Awaiting first pitch');
}

function scoreboardWidthBounds() {
  const availableWidth = Math.max(SCOREBOARD_MIN_WIDTH, Math.round(overlayEl?.clientWidth || window.innerWidth || DEFAULT_SCOREBOARD_WIDTH));
  return {
    min: Math.min(SCOREBOARD_MIN_WIDTH, availableWidth),
    max: Math.max(SCOREBOARD_MIN_WIDTH, availableWidth - 18),
  };
}

function normalizeScoreboardWidth(width) {
  const bounds = scoreboardWidthBounds();
  const parsed = Number(width);
  if (!Number.isFinite(parsed)) return clamp(DEFAULT_SCOREBOARD_WIDTH, bounds.min, bounds.max);
  return clamp(Math.round(parsed), bounds.min, bounds.max);
}

function syncScoreboardScale(scoreboard) {
  if (!scoreboard) return;
  const width = scoreboard.getBoundingClientRect().width || scoreboard.clientWidth || scoreboardWidthPreference;
  const isFocused = scoreboard.closest('.game-card')?.classList.contains('is-focused');
  const scale = clamp(width / DEFAULT_SCOREBOARD_WIDTH, 0.42, isFocused ? 1.08 : 1.85);
  scoreboard.style.setProperty('--sb-scale', scale.toFixed(3));
}

function refreshCardResponsiveText(card) {
  if (!card?._game) return;
  const game = card._game;
  renderScoreboardMatchupLine(card.querySelector('.away-matchup'), game, 'away');
  renderScoreboardMatchupLine(card.querySelector('.home-matchup'), game, 'home');
  hydratePitcherFireStreaks(card);
  hydratePitcherColdStreaks(card);
  renderScorePlaySummary(card, game);
}

function refreshAllScoreboardResponsiveLayout() {
  for (const card of gamesEl.querySelectorAll('.game-card')) {
    syncScoreboardScale(card.querySelector('.scoreboard'));
    refreshCardResponsiveText(card);
  }
}

function applyScoreboardWidth(width, options = {}) {
  scoreboardWidthPreference = normalizeScoreboardWidth(width);
  document.documentElement.style.setProperty('--scoreboard-card-width', `${scoreboardWidthPreference}px`);
  if (options.persist !== false) {
    try {
      localStorage.setItem(SCOREBOARD_WIDTH_KEY, String(scoreboardWidthPreference));
    } catch {}
  }
  requestAnimationFrame(refreshAllScoreboardResponsiveLayout);
}

function initScoreboardWidthControl() {
  applyScoreboardWidth(localStorage.getItem(SCOREBOARD_WIDTH_KEY) || DEFAULT_SCOREBOARD_WIDTH, { persist: false });
  let resizeAction = null;

  gamesEl.addEventListener('pointerdown', (e) => {
    const handle = e.target.closest('[data-scoreboard-resize]');
    if (!handle) return;
    if (e.button !== undefined && e.button !== 0) return;
    const card = handle.closest('.game-card');
    if (!card) return;
    resizeAction = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startWidth: card.getBoundingClientRect().width || scoreboardWidthPreference,
    };
    document.body.classList.add('scoreboard-resizing');
    e.preventDefault();
    e.stopPropagation();
  });

  gamesEl.addEventListener('click', (e) => {
    if (!e.target.closest('[data-scoreboard-resize]')) return;
    e.preventDefault();
    e.stopPropagation();
  });

  window.addEventListener('pointermove', (e) => {
    if (!resizeAction || e.pointerId !== resizeAction.pointerId) return;
    const nextWidth = resizeAction.startWidth + (e.clientX - resizeAction.startX);
    applyScoreboardWidth(nextWidth, { persist: false });
  });

  const endResize = (e) => {
    if (!resizeAction || (e.pointerId !== undefined && e.pointerId !== resizeAction.pointerId)) return;
    document.body.classList.remove('scoreboard-resizing');
    applyScoreboardWidth(scoreboardWidthPreference);
    resizeAction = null;
  };

  window.addEventListener('pointerup', endResize);
  window.addEventListener('pointercancel', endResize);
  window.addEventListener('resize', () => applyScoreboardWidth(scoreboardWidthPreference, { persist: false }));
}

function renderBases(card, bases) {
  card.querySelector('.base.first')?.classList.toggle('on', bases.first);
  card.querySelector('.base.second')?.classList.toggle('on', bases.second);
  card.querySelector('.base.third')?.classList.toggle('on', bases.third);
}

function flashHomePlate(card) {
  const home = card.querySelector('.base.home');
  if (!home) return;
  home.classList.remove('flash');
  void home.offsetWidth;
  home.classList.add('flash');
}

function ensureFireworkLayer(host) {
  let layer = Array.from(host.children || []).find((child) => child.classList?.contains('firework-layer'));
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'firework-layer';
    host.appendChild(layer);
  }
  return layer;
}

function spawnFireworkBurst(host, color) {
  if (!host) return;
  const layer = ensureFireworkLayer(host);
  const burst = document.createElement('div');
  burst.className = 'firework-burst';
  burst.style.left = `${12 + Math.random() * 76}%`;
  burst.style.top = `${10 + Math.random() * 62}%`;
  burst.style.setProperty('--burst-color', color || '#ffd166');
  const sparkCount = 12 + Math.floor(Math.random() * 4);
  for (let i = 0; i < sparkCount; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'firework-spark';
    spark.style.setProperty('--angle', `${Math.round((360 / sparkCount) * i + Math.random() * 10)}deg`);
    spark.style.setProperty('--distance', `${34 + Math.random() * 34}px`);
    spark.style.setProperty('--spark-delay', `${Math.random() * 0.08}s`);
    burst.appendChild(spark);
  }
  layer.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1300);
}

function cleanupFireworkHost(host) {
  const layer = host ? Array.from(host.children || []).find((child) => child.classList?.contains('firework-layer')) : null;
  if (layer) layer.remove();
  host?.classList.remove('fireworks-active');
  host?.style.removeProperty('--firework-color');
}

function activateFireworksOnHost(host, color, duration = BET_HIT_FIREWORK_DURATION_MS) {
  if (!host) return;
  const existing = fireworkControllers.get(host);
  if (existing) {
    window.clearInterval(existing.intervalId);
    window.clearTimeout(existing.timeoutId);
  }
  host.classList.add('fireworks-active');
  host.style.setProperty('--firework-color', color || '#ffd166');
  spawnFireworkBurst(host, color);
  spawnFireworkBurst(host, color);
  const intervalId = window.setInterval(() => {
    spawnFireworkBurst(host, color);
  }, 520);
  const timeoutId = window.setTimeout(() => {
    window.clearInterval(intervalId);
    cleanupFireworkHost(host);
    fireworkControllers.delete(host);
  }, duration);
  fireworkControllers.set(host, { intervalId, timeoutId });
}

function triggerBetHitCelebration(gamePk, color) {
  const tint = color || '#ffd166';
  const hosts = Array.from(document.querySelectorAll('.utility-panel'));
  const scoreboard = gamesEl.querySelector(`.game-card[data-game-pk='${gamePk}'] .scoreboard`);
  if (scoreboard) hosts.push(scoreboard);
  for (const host of hosts) activateFireworksOnHost(host, tint);
}

function animateScoreChange(card, flashColor, isHomeRun) {
  card.style.setProperty('--flash-rgb', hexToRgb(flashColor));
  card.classList.remove('score-flash', 'hr-flash');
  void card.offsetWidth;
  card.classList.add(isHomeRun ? 'hr-flash' : 'score-flash');
}

function setLineupView(view) {
  currentLineupView = view === 'pitching' ? 'pitching' : 'lineups';
  for (const btn of lineupViewBtns) {
    const active = btn.dataset.lineupView === currentLineupView;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  }
  for (const panel of lineupOverlayEl.querySelectorAll('[data-lineup-panel]')) {
    const show = panel.dataset.lineupPanel === currentLineupView;
    panel.hidden = !show;
    panel.setAttribute('aria-hidden', show ? 'false' : 'true');
  }
  const liveDetails = lineupOverlayEl.querySelector('.lineup-live-details');
  if (liveDetails) liveDetails.hidden = currentLineupView !== 'lineups';
}

function renderLineupLiveDetails(game) {
  if (lineupTickerEl) {
    lineupTickerEl.replaceChildren();
    const items = game.ticker?.length ? game.ticker : [{ text: 'Awaiting first pitch', color: '#cddfff' }];
    for (const item of items) {
      const li = document.createElement('li');
      const words = String(item.text || '').trim().split(/\s+/).filter(Boolean);
      const name = words.shift() || '';
      const rest = words.join(' ');
      const strong = document.createElement('strong');
      strong.className = 'ticker-name';
      strong.textContent = name;
      li.appendChild(strong);
      if (rest) li.appendChild(document.createTextNode(` ${rest}`));
      li.style.color = item.color;
      lineupTickerEl.appendChild(li);
    }
  }
  if (lineupStatusEl) lineupStatusEl.textContent = `${game.status} | ${game.inning}`;
  if (lineupDiamondEl) {
    lineupDiamondEl.querySelector('.base.first')?.classList.toggle('on', Boolean(game.bases?.first));
    lineupDiamondEl.querySelector('.base.second')?.classList.toggle('on', Boolean(game.bases?.second));
    lineupDiamondEl.querySelector('.base.third')?.classList.toggle('on', Boolean(game.bases?.third));
  }
  renderCountDots(lineupBallsDotsEl, 4, game.balls, 'ball');
  renderCountDots(lineupStrikesDotsEl, 3, game.strikes, 'strike');
  renderCountDots(lineupOutsDotsEl, 3, game.outs, 'out');
}

function closePlayerStatOverlay() {
  if (!playerStatOverlayEl) return;
  playerStatOverlayEl.hidden = true;
}

function isPitcherProfile(profile) {
  return String(profile?.position || '').toUpperCase() === 'P';
}

function persistPlayerLookupForGame(game, lookup) {
  if (!game?.gamePk || !lookup || !Object.keys(lookup).length) return;
  game.playerLookup = { ...(game.playerLookup || {}), ...lookup };

  const rendered = latestRenderedGames.find((g) => String(g.gamePk) === String(game.gamePk));
  if (rendered) rendered.playerLookup = { ...(rendered.playerLookup || {}), ...lookup };

  const cached = getCachedGames();
  const cachedIdx = cached.findIndex((g) => String(g.gamePk) === String(game.gamePk));
  if (cachedIdx >= 0) {
    cached[cachedIdx] = { ...cached[cachedIdx], playerLookup: { ...(cached[cachedIdx].playerLookup || {}), ...lookup } };
    saveCachedGames(cached);
  }

  const selectedDate = dateInput.value || formatDate(new Date());
  const archived = getArchivedGames(selectedDate);
  const archivedIdx = archived.findIndex((g) => String(g.gamePk) === String(game.gamePk));
  if (archivedIdx >= 0) {
    archived[archivedIdx] = { ...archived[archivedIdx], playerLookup: { ...(archived[archivedIdx].playerLookup || {}), ...lookup } };
    saveArchivedGames(selectedDate, archived);
  }
}

function mlbStatNumber(stat, key) {
  const value = Number(stat?.[key]);
  return Number.isFinite(value) ? value : 0;
}

function mlbStatValue(stat, key, fallback = '---') {
  const value = cleanSummary(stat?.[key]);
  return value || fallback;
}

function buildMlbPlayerProfile(playerId, person, seasonStats, fallbackProfile, game) {
  if (!person) return null;
  const teamAbbrev = fallbackProfile?.teamAbbrev || person?.currentTeam?.abbreviation || game?.away || game?.home || 'MLB';
  const teamColor = fallbackProfile?.teamColor || getTeamColor(teamAbbrev);
  const teamLogo = fallbackProfile?.teamLogo || getLogoPath(teamAbbrev);
  const hitting = seasonStats?.hitting || {};
  const pitching = seasonStats?.pitching || {};
  const fielding = seasonStats?.fielding || {};
  const fullName = person?.fullName || fallbackProfile?.fullName || 'Unknown';
  const birthPlace = [
    person?.birthCity,
    person?.birthStateProvince || person?.birthCountry,
  ].filter(Boolean).join(', ') || fallbackProfile?.birthPlace || '-';

  return {
    id: Number(playerId),
    fullName,
    fullNameKey: normalizeNameKey(fullName),
    jersey: fallbackProfile?.jersey || person?.primaryNumber || '?',
    teamAbbrev,
    teamColor,
    teamLogo,
    position: person?.primaryPosition?.abbreviation || fallbackProfile?.position || '-',
    bats: person?.batSide?.code || fallbackProfile?.bats || '-',
    throws: person?.pitchHand?.code || fallbackProfile?.throws || '-',
    age: ageFromBirthDate(person?.birthDate) || fallbackProfile?.age || '-',
    birthPlace,
    height: person?.height || fallbackProfile?.height || '-',
    weight: person?.weight || fallbackProfile?.weight || '-',
    headshot: playerHeadshotUrl(playerId),
    todayBatting: fallbackProfile?.todayBatting || 'No game detail available',
    todayPitching: fallbackProfile?.todayPitching || 'No game detail available',
    batting: {
      avg: mlbStatValue(hitting, 'avg', fallbackProfile?.batting?.avg || '---'),
      obp: mlbStatValue(hitting, 'obp', fallbackProfile?.batting?.obp || '---'),
      slg: mlbStatValue(hitting, 'slg', fallbackProfile?.batting?.slg || '---'),
      ops: mlbStatValue(hitting, 'ops', fallbackProfile?.batting?.ops || '---'),
      hr: mlbStatNumber(hitting, 'homeRuns') || fallbackProfile?.batting?.hr || 0,
      doubles: mlbStatNumber(hitting, 'doubles') || fallbackProfile?.batting?.doubles || 0,
      triples: mlbStatNumber(hitting, 'triples') || fallbackProfile?.batting?.triples || 0,
      rbi: mlbStatNumber(hitting, 'rbi') || fallbackProfile?.batting?.rbi || 0,
      hits: mlbStatNumber(hitting, 'hits') || fallbackProfile?.batting?.hits || 0,
      atBats: mlbStatNumber(hitting, 'atBats') || fallbackProfile?.batting?.atBats || 0,
      bb: mlbStatNumber(hitting, 'baseOnBalls') || fallbackProfile?.batting?.bb || 0,
      so: mlbStatNumber(hitting, 'strikeOuts') || fallbackProfile?.batting?.so || 0,
      sb: mlbStatNumber(hitting, 'stolenBases') || fallbackProfile?.batting?.sb || 0,
      cs: mlbStatNumber(hitting, 'caughtStealing') || fallbackProfile?.batting?.cs || 0,
    },
    fielding: {
      pct: mlbStatValue(fielding, 'fielding', mlbStatValue(fielding, 'fieldingPercentage', fallbackProfile?.fielding?.pct || '---')),
      errors: mlbStatNumber(fielding, 'errors') || fallbackProfile?.fielding?.errors || 0,
      assists: mlbStatNumber(fielding, 'assists') || fallbackProfile?.fielding?.assists || 0,
      putOuts: mlbStatNumber(fielding, 'putOuts') || fallbackProfile?.fielding?.putOuts || 0,
      innings: mlbStatValue(fielding, 'innings', fallbackProfile?.fielding?.innings || '-'),
    },
    pitching: {
      era: mlbStatValue(pitching, 'era', fallbackProfile?.pitching?.era || '---'),
      whip: mlbStatValue(pitching, 'whip', fallbackProfile?.pitching?.whip || '---'),
      gamesStarted: mlbStatNumber(pitching, 'gamesStarted') || fallbackProfile?.pitching?.gamesStarted || 0,
      gamesPlayed: mlbStatNumber(pitching, 'gamesPlayed') || fallbackProfile?.pitching?.gamesPlayed || 0,
      gamesFinished: mlbStatNumber(pitching, 'gamesFinished') || fallbackProfile?.pitching?.gamesFinished || 0,
      wins: mlbStatNumber(pitching, 'wins') || fallbackProfile?.pitching?.wins || 0,
      losses: mlbStatNumber(pitching, 'losses') || fallbackProfile?.pitching?.losses || 0,
      saves: mlbStatNumber(pitching, 'saves') || fallbackProfile?.pitching?.saves || 0,
        ip: mlbStatValue(pitching, 'inningsPitched', fallbackProfile?.pitching?.ip || '0.0'),
        so: mlbStatNumber(pitching, 'strikeOuts') || fallbackProfile?.pitching?.so || 0,
        bb: mlbStatNumber(pitching, 'baseOnBalls') || fallbackProfile?.pitching?.bb || 0,
        hrAllowed: mlbStatNumber(pitching, 'homeRuns') || fallbackProfile?.pitching?.hrAllowed || 0,
      },
  };
}

async function fetchMlbPlayerProfile(playerId, game) {
  if (!Number.isFinite(Number(playerId)) || Number(playerId) <= 0) return null;
  const season = seasonForDate(dateInput.value || formatDate(new Date()));
  const fallbackProfile = game?.playerLookup?.[String(playerId)] || null;
  try {
    const [personResult, hittingResult, pitchingResult, fieldingResult] = await Promise.allSettled([
      getPerson(playerId),
      getPlayerSeasonStats(playerId, 'hitting', season),
      getPlayerSeasonStats(playerId, 'pitching', season),
      getPlayerSeasonStats(playerId, 'fielding', season),
    ]);

    const person = personResult.status === 'fulfilled' ? personResult.value?.people?.[0] : null;
    if (!person) return fallbackProfile;

    return buildMlbPlayerProfile(playerId, person, {
      hitting: hittingResult.status === 'fulfilled' ? statSplit(hittingResult.value) : {},
      pitching: pitchingResult.status === 'fulfilled' ? statSplit(pitchingResult.value) : {},
      fielding: fieldingResult.status === 'fulfilled' ? statSplit(fieldingResult.value) : {},
    }, fallbackProfile, game);
  } catch {
    return fallbackProfile;
  }
}

function currentMatchupPitcher(profile, game) {
  if (!profile || isPitcherProfile(profile) || !game) return null;
  const team = canonicalTeamAbbrev(profile.teamAbbrev || '');
  if (!team) return null;
  const opponentSide = sameTeamAbbrev(team, game.away) ? 'home'
    : sameTeamAbbrev(team, game.home) ? 'away'
      : '';
  if (!opponentSide) return null;
  return game?.pitching?.[opponentSide]?.current
    || game?.teams?.[opponentSide]?.probablePitcher
    || null;
}

async function getPlayerCareerStartYear(playerId) {
  const numericId = Number(playerId);
  if (!Number.isFinite(numericId) || numericId <= 0) return null;
  if (playerCareerStartCache.has(numericId)) return playerCareerStartCache.get(numericId);
  const promise = (async () => {
    try {
      const person = (await getPerson(numericId))?.people?.[0] || null;
      const debut = String(person?.mlbDebutDate || '').trim();
      const year = Number(debut.slice(0, 4));
      return Number.isFinite(year) && year > 0 ? year : null;
    } catch {
      return null;
    }
  })().catch((error) => {
    playerCareerStartCache.delete(numericId);
    throw error;
  });
  playerCareerStartCache.set(numericId, promise);
  return promise;
}

async function getBatterVsPitcherHistory(batterId, pitcherId, seasonsBack = MATCHUP_LOOKBACK_SEASONS) {
  const batter = Number(batterId);
  const pitcher = Number(pitcherId);
  if (!Number.isFinite(batter) || batter <= 0 || !Number.isFinite(pitcher) || pitcher <= 0) return null;
  const selectedDate = String(dateInput.value || formatDate(new Date()));
  const currentSeason = seasonForDate(selectedDate);
  const cacheKey = `${batter}:${pitcher}:${selectedDate}:${seasonsBack}`;
  if (matchupHistoryCache.has(cacheKey)) return matchupHistoryCache.get(cacheKey);
  const promise = (async () => {
    const [batterStartYear, pitcherStartYear] = await Promise.all([
      getPlayerCareerStartYear(batter).catch(() => null),
      getPlayerCareerStartYear(pitcher).catch(() => null),
    ]);
    const fallbackStartYear = currentSeason - Math.max(1, seasonsBack) + 1;
    const earliestSeason = Math.max(
      1900,
      batterStartYear || fallbackStartYear,
      pitcherStartYear || fallbackStartYear,
    );
    const totals = {
      seasons: [],
      plateAppearances: 0,
      atBats: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeRuns: 0,
      rbi: 0,
      walks: 0,
      strikeOuts: 0,
      totalBases: 0,
      firstSeason: null,
      lastSeason: null,
    };
    for (let season = currentSeason; season >= earliestSeason; season -= 1) {
      const url = new URL(`${MLB_API_BASE}/people/${batter}`);
      url.searchParams.set('hydrate', `stats(group=[hitting],type=[vsPlayer],opposingPlayerId=${pitcher},season=${season},sportId=1)`);
      const response = await getJson(url.toString());
      const stat = response?.people?.[0]?.stats?.[0]?.splits?.[0]?.stat || null;
      if (!stat) continue;
      const seasonEntry = {
        season,
        plateAppearances: statNumber(stat.plateAppearances) || (statNumber(stat.atBats) + statNumber(stat.baseOnBalls ?? stat.walks)),
        atBats: statNumber(stat.atBats),
        hits: statNumber(stat.hits),
        doubles: statNumber(stat.doubles),
        triples: statNumber(stat.triples),
        homeRuns: statNumber(stat.homeRuns),
        rbi: statNumber(stat.rbi),
        walks: statNumber(stat.baseOnBalls ?? stat.walks),
        strikeOuts: statNumber(stat.strikeOuts),
        totalBases: statNumber(stat.totalBases) || totalBasesFromBatting(stat),
      };
      if (!seasonEntry.plateAppearances && !seasonEntry.atBats && !seasonEntry.hits && !seasonEntry.walks) continue;
      totals.seasons.push(seasonEntry);
      totals.firstSeason = totals.firstSeason == null ? season : Math.min(totals.firstSeason, season);
      totals.lastSeason = totals.lastSeason == null ? season : Math.max(totals.lastSeason, season);
      totals.plateAppearances += seasonEntry.plateAppearances;
      totals.atBats += seasonEntry.atBats;
      totals.hits += seasonEntry.hits;
      totals.doubles = (totals.doubles || 0) + seasonEntry.doubles;
      totals.triples = (totals.triples || 0) + seasonEntry.triples;
      totals.homeRuns += seasonEntry.homeRuns;
      totals.rbi += seasonEntry.rbi;
      totals.walks += seasonEntry.walks;
      totals.strikeOuts += seasonEntry.strikeOuts;
      totals.totalBases += seasonEntry.totalBases;
    }
    const adjustment = indexedMatchupAdjustment(batter, pitcher, selectedDate);
    if (adjustment) {
      const currentSeasonEntry = totals.seasons.find((entry) => Number(entry?.season) === currentSeason);
      if (currentSeasonEntry) {
        subtractMatchupHistoryEntry(currentSeasonEntry, adjustment);
      }
      subtractMatchupHistoryEntry(totals, adjustment);
      totals.seasons = totals.seasons.filter((entry) => matchupHistoryHasSample(entry));
      totals.firstSeason = totals.seasons.length ? Math.min(...totals.seasons.map((entry) => Number(entry.season) || currentSeason)) : null;
      totals.lastSeason = totals.seasons.length ? Math.max(...totals.seasons.map((entry) => Number(entry.season) || currentSeason)) : null;
    }
    return totals;
  })().catch((error) => {
    matchupHistoryCache.delete(cacheKey);
    throw error;
  });
  matchupHistoryCache.set(cacheKey, promise);
  return promise;
}

function matchupHistorySeasonEntry(stat, season) {
  if (!stat) return null;
  return {
    season,
    plateAppearances: statNumber(stat.plateAppearances) || (statNumber(stat.atBats) + statNumber(stat.baseOnBalls ?? stat.walks)),
    atBats: statNumber(stat.atBats),
    hits: statNumber(stat.hits),
    doubles: statNumber(stat.doubles),
    triples: statNumber(stat.triples),
    homeRuns: statNumber(stat.homeRuns),
    rbi: statNumber(stat.rbi),
    walks: statNumber(stat.baseOnBalls ?? stat.walks),
    strikeOuts: statNumber(stat.strikeOuts),
    totalBases: statNumber(stat.totalBases) || totalBasesFromBatting(stat),
  };
}

async function getTeamByAbbrev(teamAbbrev, season = '') {
  const abbrev = canonicalTeamAbbrev(teamAbbrev || '');
  if (!abbrev) return null;
  const teams = await getTeamsForSeason(season || (dateInput.value || formatDate(new Date()))).catch(() => []);
  return teams.find((team) => sameTeamAbbrev(team?.abbreviation, abbrev)) || null;
}

function matchupOpponentAbbrevForGame(profile, game) {
  const team = canonicalTeamAbbrev(profile?.teamAbbrev || '');
  if (!team || !game) return '';
  const away = canonicalTeamAbbrev(game?.away || '');
  const home = canonicalTeamAbbrev(game?.home || '');
  if (team === away) return home;
  if (team === home) return away;
  return '';
}

async function getBatterVsTeamHistory(batterId, opponentTeamId, seasonsBack = MATCHUP_LOOKBACK_SEASONS) {
  const batter = Number(batterId);
  const opponent = Number(opponentTeamId);
  if (!Number.isFinite(batter) || batter <= 0 || !Number.isFinite(opponent) || opponent <= 0) return null;
  const selectedDate = String(dateInput.value || formatDate(new Date()));
  const currentSeason = seasonForDate(selectedDate);
  const cacheKey = `${batter}:${opponent}:${selectedDate}:${seasonsBack}`;
  if (teamMatchupHistoryCache.has(cacheKey)) return teamMatchupHistoryCache.get(cacheKey);
  const promise = (async () => {
    const batterStartYear = await getPlayerCareerStartYear(batter).catch(() => null);
    const fallbackStartYear = currentSeason - Math.max(1, seasonsBack) + 1;
    const earliestSeason = Math.max(1900, batterStartYear || 0, fallbackStartYear);
    const totals = {
      seasons: [],
      plateAppearances: 0,
      atBats: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeRuns: 0,
      rbi: 0,
      walks: 0,
      strikeOuts: 0,
      totalBases: 0,
      firstSeason: null,
      lastSeason: null,
    };
    for (let season = currentSeason; season >= earliestSeason; season -= 1) {
      const url = new URL(`${MLB_API_BASE}/people/${batter}`);
      url.searchParams.set('hydrate', `stats(group=[hitting],type=[vsTeam],opposingTeamId=${opponent},season=${season},sportId=1)`);
      const response = await getJson(url.toString());
      const seasonEntry = matchupHistorySeasonEntry(response?.people?.[0]?.stats?.[0]?.splits?.[0]?.stat || null, season);
      if (!matchupHistoryHasSample(seasonEntry)) continue;
      totals.seasons.push(seasonEntry);
      totals.firstSeason = totals.firstSeason == null ? season : Math.min(totals.firstSeason, season);
      totals.lastSeason = totals.lastSeason == null ? season : Math.max(totals.lastSeason, season);
      totals.plateAppearances += seasonEntry.plateAppearances;
      totals.atBats += seasonEntry.atBats;
      totals.hits += seasonEntry.hits;
      totals.doubles += seasonEntry.doubles;
      totals.triples += seasonEntry.triples;
      totals.homeRuns += seasonEntry.homeRuns;
      totals.rbi += seasonEntry.rbi;
      totals.walks += seasonEntry.walks;
      totals.strikeOuts += seasonEntry.strikeOuts;
      totals.totalBases += seasonEntry.totalBases;
    }
    return totals;
  })().catch((error) => {
    teamMatchupHistoryCache.delete(cacheKey);
    throw error;
  });
  teamMatchupHistoryCache.set(cacheKey, promise);
  return promise;
}

async function getPreferredBatterMatchupHistory(batterId, pitcherId, opponentTeamId) {
  const directHistory = Number.isFinite(Number(pitcherId)) && Number(pitcherId) > 0
    ? await getBatterVsPitcherHistory(batterId, pitcherId).catch(() => null)
    : null;
  if (matchupHistoryHasSample(directHistory)) {
    return { history: directHistory, source: 'pitcher', directHistory, teamHistory: null };
  }
  const teamHistory = Number.isFinite(Number(opponentTeamId)) && Number(opponentTeamId) > 0
    ? await getBatterVsTeamHistory(batterId, opponentTeamId).catch(() => null)
    : null;
  if (matchupHistoryHasSample(teamHistory)) {
    return { history: teamHistory, source: 'team', directHistory, teamHistory };
  }
  return { history: null, source: 'none', directHistory, teamHistory };
}

function matchupDisplayLabel(pitcher, source = 'pitcher', opponentLabel = '') {
  if (source === 'team') return `${opponentLabel || 'opponent'} team`;
  if (pitcher) return pitcher.fullName || pitcher.name || 'opposing pitcher';
  if (opponentLabel) return opponentLabel;
  return 'opponent';
}

function renderMatchupHistory(profile, pitcher, history, options = {}) {
  const { source = 'pitcher', opponentLabel = '' } = options;
  const displayLabel = matchupDisplayLabel(pitcher, source, opponentLabel);
  if (!profile || (!pitcher && !opponentLabel)) return '<strong>Matchup Index</strong>Open a hitter from a game or lineup card to see pitcher or team matchup data.';
  if (!history || (!history.plateAppearances && !history.atBats && !history.walks)) {
    const emptyLabel = pitcher ? `Vs ${pitcher.fullName || pitcher.name || 'opposing pitcher'}` : `Vs ${displayLabel}`;
    const teamFallbackNote = pitcher && opponentLabel ? ` No team split sample vs ${opponentLabel} yet either.` : '';
    return `<strong>Matchup Index</strong>${emptyLabel}: no indexed MLB matchup sample yet over the tracked seasons.${teamFallbackNote}`;
  }
  const coverage = history.firstSeason && history.lastSeason
    ? (history.firstSeason === history.lastSeason ? `${history.firstSeason}` : `${history.firstSeason}-${history.lastSeason}`)
    : 'tracked career';
  const rows = history.seasons
    .sort((a, b) => b.season - a.season)
    .map((entry) => {
      const xbh = statNumber(entry.doubles) + statNumber(entry.triples) + statNumber(entry.homeRuns);
      return `
        <tr>
          <td>${entry.season}</td>
          <td>${entry.hits}-${entry.atBats}</td>
          <td>${xbh}</td>
          <td>${entry.homeRuns}</td>
          <td>${entry.strikeOuts}</td>
        </tr>
      `;
    })
    .join('');
  const totalXbh = statNumber(history.doubles) + statNumber(history.triples) + statNumber(history.homeRuns);
  return `
    <strong>Matchup Index</strong>
    <div class="matchup-index-summary">Vs ${displayLabel} | ${coverage} | PA ${history.plateAppearances} | ${history.hits}-${history.atBats} | XBH ${totalXbh} | HR ${history.homeRuns} | K ${history.strikeOuts}</div>
    <div class="matchup-index-table-wrap">
      <table class="matchup-index-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>X for Y</th>
            <th>XBH</th>
            <th>HR</th>
            <th>K</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

async function hydratePlayerLookupForGame(game) {
  if (!game?.gamePk) return game?.playerLookup || {};
  try {
    let lookup = {};
    try {
      const live = await getLiveGameFeed(game.gamePk);
      const awayTeam = live?.gameData?.teams?.away || {};
      const homeTeam = live?.gameData?.teams?.home || {};
      const awayAbbrev = canonicalTeamAbbrev(awayTeam.abbreviation || awayTeam.teamCode?.toUpperCase() || game.away || 'AWAY');
      const homeAbbrev = canonicalTeamAbbrev(homeTeam.abbreviation || homeTeam.teamCode?.toUpperCase() || game.home || 'HOME');
      const awayColor = game.awayColor || getTeamColor(awayAbbrev);
      const homeColor = game.homeColor || getTeamColor(homeAbbrev);
      const awayPlayers = live?.liveData?.boxscore?.teams?.away?.players || {};
      const homePlayers = live?.liveData?.boxscore?.teams?.home?.players || {};
      const gamePlayers = live?.gameData?.players || {};
      lookup = {
        ...buildPlayerLookup(awayPlayers, gamePlayers, awayAbbrev, awayColor, game.awayLogo || getLogoPath(awayAbbrev)),
        ...buildPlayerLookup(homePlayers, gamePlayers, homeAbbrev, homeColor, game.homeLogo || getLogoPath(homeAbbrev)),
      };
    } catch {
      const rawBox = await getGameBoxscore(game.gamePk);
      const box = normalizeBoxscorePayload(rawBox);
      const derived = buildGameDataFromBoxscore(box, game, {
        awayAbbrev: game.away,
        homeAbbrev: game.home,
        awayColor: game.awayColor,
        homeColor: game.homeColor,
      });
      lookup = derived.playerLookup;
    }
    if (!Object.keys(lookup).length) return game?.playerLookup || {};
    persistPlayerLookupForGame(game, lookup);
    return game.playerLookup;
  } catch {
    return game?.playerLookup || {};
  }
}

async function openPlayerStatOverlay(playerId, game) {
  if (!playerStatOverlayEl) return;
  let profile = game?.playerLookup?.[String(playerId)];
  if (Number.isFinite(Number(playerId)) && Number(playerId) > 0) {
    await hydratePlayerLookupForGame(game);
    profile = game?.playerLookup?.[String(playerId)];
  }
  if (Number.isFinite(Number(playerId)) && Number(playerId) > 0) {
    const fetchedProfile = await fetchMlbPlayerProfile(playerId, game).catch(() => null);
    if (fetchedProfile && (!profile || playerProfileHasMeaningfulStats(fetchedProfile))) {
      profile = fetchedProfile;
      persistPlayerLookupForGame(game, { [String(playerId)]: fetchedProfile });
    }
  }
  const fallbackLogo = game?.awayLogo || game?.homeLogo || 'placeholder.png';
  if (!profile) {
    playerStatNameEl.textContent = 'PLAYER DATA UNAVAILABLE';
    playerStatMetaEl.textContent = `${displayTeamAbbrev(game?.away || '')} @ ${displayTeamAbbrev(game?.home || '')}`.trim();
    playerStatHeadshotEl.src = fallbackLogo;
    playerStatBioEl.textContent = 'No detailed data available for this player in the current feed.';
    playerStatTodayEl.innerHTML = playerStatRowsHtml('TODAY', [['Status', 'Awaiting player detail data']]);
    playerStatSeasonEl.innerHTML = playerStatRowsHtml('SEASON', [['Status', 'Awaiting player detail data']]);
    playerStatExtraEl.innerHTML = playerStatRowsHtml('INFO', [['Source', 'MLB player endpoint did not return a profile for this player']]);
    if (playerStatMatchupEl) playerStatMatchupEl.innerHTML = renderRecentBattingHistoryHtml(['Recent history unavailable']);
    playerStatOverlayEl.hidden = false;
    return;
  }

  const pitcherProfile = isPitcherProfile(profile);
  if (pitcherProfile) {
    playerStatNameEl.innerHTML = pitcherNameHtml(profile);
  } else {
    playerStatNameEl.textContent = profile.fullName;
  }
  playerStatMetaEl.textContent = `${displayTeamAbbrev(profile.teamAbbrev)} #${profile.jersey} | ${profile.position}`;
  playerStatNameEl.style.color = profile.teamColor || '#f0da99';
  playerStatMetaEl.style.color = '';
  const teamLogoFallback = profile.teamLogo || getLogoPath(profile.teamAbbrev) || fallbackLogo || 'placeholder.png';
  const generatedBadge = statCardBadgeDataUri(profile.teamAbbrev, profile.teamColor);
  playerStatHeadshotEl.alt = `${profile.fullName} headshot`;
  loadStatCardImage(playerStatHeadshotEl, [
    profile.headshot,
    teamLogoFallback,
    fallbackLogo,
    'placeholder.png',
    generatedBadge,
  ]);

  playerStatBioEl.innerHTML = `Age ${profile.age} • B/T ${profile.bats}/${profile.throws}<br>Ht ${profile.height} • Wt ${profile.weight}<br>${profile.birthPlace}`;
  if (pitcherProfile) {
    playerStatTodayEl.innerHTML = playerStatRowsHtml('TODAY', [['Line', profile.todayPitching]]);
    playerStatSeasonEl.innerHTML = playerStatRowsHtml('PITCHING', [
      ['ERA', profile.pitching.era],
      ['WHIP', profile.pitching.whip],
      ['IP', profile.pitching.ip],
      ['K', profile.pitching.so],
      ['BB', profile.pitching.bb],
      ['W-L', `${profile.pitching.wins}-${profile.pitching.losses}`],
      ['SV', profile.pitching.saves],
    ]);
    playerStatExtraEl.innerHTML = playerStatRowsHtml('OPPONENT / HAND', [
      ['B/T', `${profile.bats}/${profile.throws}`],
      ['AVG', profile.batting.avg],
      ['OPS', profile.batting.ops],
      ['Team', `${displayTeamAbbrev(profile.teamAbbrev)} #${profile.jersey}`],
      ['Pos', profile.position],
    ]);
  } else {
    playerStatTodayEl.innerHTML = playerStatRowsHtml('TODAY', [['Line', profile.todayBatting]]);
    playerStatSeasonEl.innerHTML = playerStatRowsHtml('BATTING', [
      ['AVG', profile.batting.avg],
      ['OBP', profile.batting.obp],
      ['SLG', profile.batting.slg],
      ['OPS', profile.batting.ops],
      ['H', profile.batting.hits],
      ['AB', profile.batting.atBats],
      ['HR', profile.batting.hr],
      ['RBI', profile.batting.rbi],
    ]);
    playerStatExtraEl.innerHTML = playerStatRowsHtml('FIELD / BASES', [
      ['SB', profile.batting.sb],
      ['CS', profile.batting.cs],
      ['BB', profile.batting.bb],
      ['K', profile.batting.so],
      ['Fld%', profile.fielding.pct],
      ['E', profile.fielding.errors],
      ['A', profile.fielding.assists],
      ['PO', profile.fielding.putOuts],
      ['Fld Inn', profile.fielding.innings],
    ]);
  }
  if (playerStatMatchupEl) {
    const pitcherCard = pitcherProfile;
    const recentToken = `${profile.id}:${dateInput.value || formatDate(new Date())}:${Date.now()}`;
    playerStatMatchupEl.dataset.recentToken = recentToken;
    playerStatMatchupEl.innerHTML = renderRecentBattingHistoryHtml([pitcherCard ? 'Recent starts loading' : 'Recent history loading']);
    (pitcherCard ? getPlayerRecentPitchingDetails(profile.id, game) : getPlayerRecentBattingDetails(profile.id, game))
      .then((details) => {
        if (!playerStatMatchupEl || playerStatMatchupEl.dataset.recentToken !== recentToken) return;
        playerStatMatchupEl.innerHTML = renderRecentBattingHistoryHtml(details);
      })
      .catch(() => {
        if (!playerStatMatchupEl || playerStatMatchupEl.dataset.recentToken !== recentToken) return;
        const indexedTrend = getIndexedRecentForm(profile.id, pitcherCard ? 'pitching' : 'hitting', dateInput.value || formatDate(new Date()));
        playerStatMatchupEl.innerHTML = renderRecentBattingHistoryHtml(indexedTrend ? [indexedTrend] : ['Recent history unavailable']);
      });
  }
  playerStatOverlayEl.hidden = false;
  if (pitcherProfile) {
    hydratePitcherFireStreaks(playerStatOverlayEl);
    hydratePitcherColdStreaks(playerStatOverlayEl);
  }
}

function normalizedLineupEntry(entry, slot) {
  return {
    slot,
    id: entry?.id ?? null,
    name: entry?.name || lastName(entry?.fullName || 'Unknown'),
    fullName: entry?.fullName || entry?.name || 'Unknown',
    position: entry?.position || '',
    bats: entry?.bats || entry?.batSide?.code || entry?.batSide?.description || '',
    throws: entry?.throws || entry?.pitchHand?.code || entry?.pitchHand?.description || '',
    avg: lineupAvgValue(entry, '---'),
    today: normalizeLineupTodayValue(entry?.today),
    isActive: Boolean(entry?.isActive),
  };
}

function archivedFallbackLineup(game, side) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const [yesterday] = recentCalendarDateWindow(selectedDate, 2);
  const team = canonicalTeamAbbrev(side === 'away' ? game?.away : game?.home || '');
  const opponent = canonicalTeamAbbrev(side === 'away' ? game?.home : game?.away || '');
  const candidates = [];
  if (yesterday && yesterday !== selectedDate) {
    candidates.push(...getArchivedGames(yesterday).map(normalizeCompletedCard));
  }
  const latestDate = latestArchiveDate(selectedDate);
  if (latestDate && latestDate !== yesterday) {
    candidates.push(...getArchivedGames(latestDate).map(normalizeCompletedCard));
  }
  const exactMatch = candidates.find((card) => {
    return sameTeamAbbrev(card?.away, game?.away) && sameTeamAbbrev(card?.home, game?.home);
  });
  const sameTeam = exactMatch || candidates.find((card) => {
    const away = canonicalTeamAbbrev(card?.away || '');
    const home = canonicalTeamAbbrev(card?.home || '');
    return away === team || home === team || away === opponent || home === opponent;
  });
  const archived = sameTeam || null;
  if (!archived) return [];
  const archivedSide = sameTeamAbbrev(archived?.away, team)
    ? 'away'
    : sameTeamAbbrev(archived?.home, team)
      ? 'home'
      : side;
  const archivedLineup = archivedSide === 'away'
    ? archived?.lineup?.away
    : archived?.lineup?.home;
  if (Array.isArray(archivedLineup) && archivedLineup.length) return sanitizeStoredLineup({ [archivedSide]: archivedLineup })?.[archivedSide] || [];
  return [];
}

function fallbackTeamLineupFromLookup(game, side) {
  const team = side === 'away' ? game?.away : game?.home;
  const lineup = side === 'away' ? game?.lineup?.away : game?.lineup?.home;
  const bench = side === 'away' ? game?.lineup?.awayBench : game?.lineup?.homeBench;
  if (Array.isArray(lineup) && lineup.length) return normalizeLineupCollectionForSide(game, side, lineup);

  const archived = archivedFallbackLineup(game, side);
  if (archived.length) return normalizeLineupCollectionForSide(game, side, archived);

  if (Array.isArray(bench) && bench.length) {
    return normalizeLineupCollectionForSide(game, side, bench.slice(0, 9));
  }

  const pool = Object.values(game?.playerLookup || {})
    .filter((p) => sameTeamAbbrev(p?.teamAbbrev, team))
    .filter((p) => String(p?.position || '').toUpperCase() !== 'P');

  if (!pool.length) return [];

  pool.sort((a, b) => {
    const aOps = Number(a?.batting?.ops);
    const bOps = Number(b?.batting?.ops);
    const aHas = Number.isFinite(aOps);
    const bHas = Number.isFinite(bOps);
    if (aHas && bHas && bOps !== aOps) return bOps - aOps;
    return String(a?.fullName || '').localeCompare(String(b?.fullName || ''));
  });

  return normalizeLineupCollectionForSide(game, side, pool.slice(0, 9).map((p, idx) => ({
    id: p.id,
    name: lastName(p.fullName),
    fullName: p.fullName,
    position: p.position,
    bats: p.bats,
    throws: p.throws,
    avg: lineupAvgValue(p, '---'),
    today: normalizeLineupTodayValue(p.todayBatting),
    batting: p?.batting || {},
  })));
}

async function syncLineupOverlay(game) {
  const open = game && isLineupOpen(game.gamePk);
  lineupOverlayEl.hidden = !open;
  lineupOverlayEl.classList.toggle('open', Boolean(open));
  if (!open) {
    activeLineupGame = null;
    closePlayerStatOverlay();
    return;
  }
  activeLineupGame = game;

  lineupModalMatchupEl.textContent = `${displayTeamAbbrev(game.away)} @ ${displayTeamAbbrev(game.home)}`;
  lineupStateInningEl.textContent = game.inningShort;
  lineupStateAwayCodeEl.textContent = displayTeamAbbrev(game.away);
  lineupStateAwayScoreEl.textContent = game.awayScore;
  lineupStateHomeCodeEl.textContent = displayTeamAbbrev(game.home);
  lineupStateHomeScoreEl.textContent = game.homeScore;
  lineupStateBallsEl.textContent = game.balls;
  lineupStateStrikesEl.textContent = game.strikes;
  lineupStateOutsEl.textContent = game.outs;

  const stateAwayCode = lineupOverlayEl.querySelector('.lineup-state-away-code');
  const stateHomeCode = lineupOverlayEl.querySelector('.lineup-state-home-code');
  if (stateAwayCode) stateAwayCode.style.color = game.awayColor;
  if (stateHomeCode) stateHomeCode.style.color = game.homeColor;

  renderMiniBases(lineupOverlayEl.querySelector('.lineup-mini-diamond'), game.bases);
  const baseTextEl = lineupOverlayEl.querySelector('.lineup-base-text');
  if (baseTextEl) baseTextEl.textContent = baseSummaryText(game.bases);
  renderLineupLiveDetails(game);

  setLogo(lineupOverlayEl.querySelector('.away-lineup-logo'), game.awayLogo, `${game.away} logo`);
  setLogo(lineupOverlayEl.querySelector('.home-lineup-logo'), game.homeLogo, `${game.home} logo`);

  const awayTeamEl = lineupOverlayEl.querySelector('.away-lineup-team');
  const homeTeamEl = lineupOverlayEl.querySelector('.home-lineup-team');
  const awayLineupStreakEl = lineupOverlayEl.querySelector('.away-lineup-streak');
  const homeLineupStreakEl = lineupOverlayEl.querySelector('.home-lineup-streak');
  const awayPitcherSummaryEl = lineupOverlayEl.querySelector('.away-lineup-pitcher');
  const homePitcherSummaryEl = lineupOverlayEl.querySelector('.home-lineup-pitcher');
  awayTeamEl.textContent = displayTeamAbbrev(game.away);
  homeTeamEl.textContent = displayTeamAbbrev(game.home);
  awayTeamEl.style.color = game.awayColor;
  homeTeamEl.style.color = game.homeColor;
  renderTeamStreakBadge(awayLineupStreakEl, game.awayStreak);
  renderTeamStreakBadge(homeLineupStreakEl, game.homeStreak);
  const awayTeamPanel = lineupOverlayEl.querySelector('.away-lineup');
  const homeTeamPanel = lineupOverlayEl.querySelector('.home-lineup');
  const awayPitchingPanel = lineupOverlayEl.querySelector('.away-pitching');
  const homePitchingPanel = lineupOverlayEl.querySelector('.home-pitching');
  if (awayTeamPanel) awayTeamPanel.style.setProperty('--team-logo-bg', `url("${game.awayLogo}")`);
  if (homeTeamPanel) homeTeamPanel.style.setProperty('--team-logo-bg', `url("${game.homeLogo}")`);
  if (awayPitchingPanel) awayPitchingPanel.style.setProperty('--team-logo-bg', `url("${game.awayLogo}")`);
  if (homePitchingPanel) homePitchingPanel.style.setProperty('--team-logo-bg', `url("${game.homeLogo}")`);

  const freshPitchers = await resolveFreshLineupPitchers(game);
  if (freshPitchers?.away?.current) {
    game.pitching = game.pitching || emptyPitchingData();
    game.pitching.away = { ...(game.pitching?.away || { current: null, bullpen: [] }), current: freshPitchers.away.current };
  }
  if (freshPitchers?.home?.current) {
    game.pitching = game.pitching || emptyPitchingData();
    game.pitching.home = { ...(game.pitching?.home || { current: null, bullpen: [] }), current: freshPitchers.home.current };
  }
  let awayPitcherSummary = freshPitchers?.away || resolveLineupPitcherForDisplay(game, 'away');
  let homePitcherSummary = freshPitchers?.home || resolveLineupPitcherForDisplay(game, 'home');
  let awayPitchingDisplay = resolvePitchingSideForDisplay(game, 'away');
  let homePitchingDisplay = resolvePitchingSideForDisplay(game, 'home');
  await ensurePitcherProfiles(game, [
    awayPitcherSummary?.starter,
    awayPitcherSummary?.current,
    ...(awayPitchingDisplay?.bullpen || []),
    homePitcherSummary?.starter,
    homePitcherSummary?.current,
    ...(homePitchingDisplay?.bullpen || []),
  ]);
  awayPitcherSummary = freshPitchers?.away || resolveLineupPitcherForDisplay(game, 'away');
  homePitcherSummary = freshPitchers?.home || resolveLineupPitcherForDisplay(game, 'home');
  awayPitchingDisplay = resolvePitchingSideForDisplay(game, 'away');
  homePitchingDisplay = resolvePitchingSideForDisplay(game, 'home');
  renderLineupPitcherSummary(awayPitcherSummaryEl, game.awayColor, awayPitcherSummary);
  renderLineupPitcherSummary(homePitcherSummaryEl, game.homeColor, homePitcherSummary);
  const awayHasConfirmedLineup = Array.isArray(game?.lineup?.away) && game.lineup.away.length > 0;
  const homeHasConfirmedLineup = Array.isArray(game?.lineup?.home) && game.lineup.home.length > 0;
  let awayDisplayLineup = fallbackTeamLineupFromLookup(game, 'away');
  let homeDisplayLineup = fallbackTeamLineupFromLookup(game, 'home');
  if (!awayHasConfirmedLineup) {
    awayDisplayLineup = await enrichFallbackLineupDisplay(game, 'away', awayDisplayLineup);
  }
  if (!homeHasConfirmedLineup) {
    homeDisplayLineup = await enrichFallbackLineupDisplay(game, 'home', homeDisplayLineup);
  }
  renderLineupList(lineupOverlayEl.querySelector('.away-lineup-list'), awayDisplayLineup, game.awayColor, game.away, new Set(), new Set(), new Map(), new Map());
  renderLineupList(lineupOverlayEl.querySelector('.home-lineup-list'), homeDisplayLineup, game.homeColor, game.home, new Set(), new Set(), new Map(), new Map());
  renderPitchingSide(lineupOverlayEl.querySelector('.away-pitching'), game.away, game.awayColor, awayPitchingDisplay);
  renderPitchingSide(lineupOverlayEl.querySelector('.home-pitching'), game.home, game.homeColor, homePitchingDisplay);
  hydratePitcherFireStreaks(lineupOverlayEl);
  hydratePitcherColdStreaks(lineupOverlayEl);

  const hotToken = `${String(game.gamePk || '')}:${Date.now()}`;
  lineupOverlayEl.dataset.hotToken = hotToken;
  try {
    const hotPlayerIds = await getRecognizedLineupHotPlayerIds(game, dateInput.value || formatDate(new Date()));
    const coldPlayerIds = await getRecognizedLineupColdPlayerIds(game, dateInput.value || formatDate(new Date()), hotPlayerIds);
    const hitStreakMap = await getRecognizedLineupHitStreakMap(game, dateInput.value || formatDate(new Date()));
    const batterBadgeMap = await getRecognizedLineupBatterBadgeMap(game, dateInput.value || formatDate(new Date()));
    if (lineupOverlayEl.dataset.hotToken !== hotToken) return;
    if (!isLineupOpen(game.gamePk) || String(activeLineupGame?.gamePk || '') !== String(game.gamePk || '')) return;
    renderLineupList(lineupOverlayEl.querySelector('.away-lineup-list'), awayDisplayLineup, game.awayColor, game.away, hotPlayerIds, coldPlayerIds, hitStreakMap, batterBadgeMap);
    renderLineupList(lineupOverlayEl.querySelector('.home-lineup-list'), homeDisplayLineup, game.homeColor, game.home, hotPlayerIds, coldPlayerIds, hitStreakMap, batterBadgeMap);
  } catch {}
}

async function renderActiveLineupOverlay(games = []) {
  const openPk = getOpenLineupGamePk();
  if (!openPk) {
    closeLineupOverlay();
    return;
  }

  const game = games.find((g) => String(g.gamePk) === String(openPk)) || getCachedGames().find((g) => String(g.gamePk) === String(openPk));
  if (!game) {
    closeLineupOverlay();
    return;
  }

  await syncLineupOverlay(game);
}

function initLineupOverlay() {
  lineupBackdropEl.addEventListener('click', closeLineupOverlay);
  lineupCloseBtnEl.addEventListener('click', closeLineupOverlay);
  if (playerStatBackdropEl) playerStatBackdropEl.addEventListener('click', closePlayerStatOverlay);
  if (playerStatCloseBtnEl) playerStatCloseBtnEl.addEventListener('click', closePlayerStatOverlay);
  lineupOverlayEl.addEventListener('click', (e) => {
    const row = e.target.closest('.lineup-list li[data-player-id], .lineup-team-pitcher[data-player-id], .current-pitcher-card[data-player-id], .bullpen-item[data-player-id]');
    if (!row) return;
    const playerId = Number(row.dataset.playerId);
    if (!Number.isFinite(playerId) || playerId <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    openPlayerStatOverlay(playerId, activeLineupGame);
  });
  hrListEl.addEventListener('click', (e) => {
    const item = e.target.closest('.hr-item[data-player-id]');
    if (!item) return;
    const playerId = Number(item.dataset.playerId);
    const gamePk = String(item.dataset.gamePk || '');
    if (!Number.isFinite(playerId) || playerId <= 0 || !gamePk) return;
    const game = latestRenderedGames.find((g) => String(g.gamePk) === gamePk) || getCachedGames().find((g) => String(g.gamePk) === gamePk);
    if (!game) return;
    e.preventDefault();
    e.stopPropagation();
    openPlayerStatOverlay(playerId, game);
  });
  for (const btn of lineupViewBtns) {
    btn.addEventListener('click', () => setLineupView(btn.dataset.lineupView));
  }
  setLineupView('lineups');
  closeLineupOverlay();
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lineupOverlayEl.hidden) closeLineupOverlay();
    if (e.key === 'Escape' && playerStatOverlayEl && !playerStatOverlayEl.hidden) closePlayerStatOverlay();
  });
}

function renderLineupList(listEl, lineup, color, teamCode = '', hotPlayerIds = new Set(), coldPlayerIds = new Set(), hitStreakMap = new Map(), batterBadgeMap = new Map()) {
  listEl.replaceChildren();
  if (!lineup?.length) {
    const empty = document.createElement('div');
    empty.className = 'lineup-empty';
    empty.textContent = 'Awaiting confirmed lineup';
    listEl.appendChild(empty);
    return;
  }

  const activeIndex = lineup.findIndex((entry) => entry.isActive);
  const onDeckIndex = activeIndex >= 0 && lineup.length ? (activeIndex + 1) % lineup.length : -1;

  for (let i = 0; i < lineup.length; i += 1) {
    const entry = lineup[i];
    const isAtBat = i === activeIndex;
    const isOnDeck = i === onDeckIndex;
    const isHot = hotPlayerIds?.has?.(String(entry?.id));
    const isCold = coldPlayerIds?.has?.(String(entry?.id));
    const hitStreak = Math.max(0, Number(hitStreakMap?.get?.(String(entry?.id)) || 0));
    const batterBadges = batterBadgeMap?.get?.(String(entry?.id)) || null;
    const indicatorClass = isAtBat ? 'is-atbat' : isOnDeck ? 'is-ondeck' : '';
    const rowClasses = [];
    if (isAtBat) rowClasses.push('lineup-row-atbat');
    if (isOnDeck) rowClasses.push('lineup-row-ondeck');
    if (isHot) rowClasses.push('lineup-row-hot');
    if (isCold) rowClasses.push('lineup-row-cold');
    const indicatorSrc = isAtBat ? 'atbat.png' : isOnDeck ? 'ondeck.png' : '';
    const indicatorAlt = isAtBat ? 'At bat' : isOnDeck ? 'On deck' : '';
    const indicatorHtml = indicatorSrc
      ? `<img class="lineup-indicator ${indicatorClass}" src="${indicatorSrc}" alt="${indicatorAlt}" />`
      : '';
    const hotEmojiHtml = isHot ? '<span class="lineup-hot-emoji" aria-hidden="true">🔥</span>' : '';
    const coldEmojiHtml = isCold ? '<span class="lineup-cold-emoji" aria-hidden="true">❄️</span>' : '';
    const avgBurstHtml = batterBadges?.avgBurst ? '<span class="lineup-avg-burst" title="Batting .350+ over the last five games" aria-label="Batting .350 plus over the last five games">🧨</span>' : '';
    const powerBurstHtml = batterBadges?.powerBurst ? '<span class="lineup-power-burst" title="Multiple home runs over the last five games" aria-label="Multiple home runs over the last five games">💥</span>' : '';
    const hitStreakHtml = hitStreak >= 3
      ? `<span class="lineup-hit-streak" title="${hitStreak}-game hit streak" aria-label="${hitStreak}-game hit streak">${hitStreak}G</span>`
      : '';
    const batterHandHtml = handednessHtml(entry?.bats);

    const li = document.createElement('li');
    li.className = rowClasses.join(' ');
    li.dataset.playerId = Number.isFinite(Number(entry.id)) && Number(entry.id) > 0 ? String(entry.id) : '';
    li.dataset.team = teamCode;
    li.dataset.hot = isHot ? '1' : '0';
    li.innerHTML = `
      <span class="lineup-slot">${entry.slot}</span>
      <span class="lineup-name" title="${entry.fullName}">
        ${indicatorHtml}
        <span class="lineup-name-text">${entry.name}</span>${batterHandHtml}
        ${hotEmojiHtml}
        ${coldEmojiHtml}
        ${avgBurstHtml}
        ${powerBurstHtml}
        ${hitStreakHtml}
      </span>
      <span class="lineup-pos">${entry.position || ''}</span>
      <span class="lineup-avg">AVG ${entry.avg || '---'}</span>
      <span class="lineup-today">${normalizeLineupTodayValue(entry.today)}</span>
    `;
    const markerImg = li.querySelector('.lineup-indicator');
    if (markerImg) {
      markerImg.onerror = () => {
        markerImg.onerror = null;
        markerImg.remove();
      };
    }
    li.style.setProperty('--team-color', color);
    listEl.appendChild(li);
  }
}

function bindCardInteractions(card, game) {
  if (card.dataset.bound === '1') return;
  card.dataset.bound = '1';

  card.addEventListener('mousedown', (e) => {
    if (e.button === 1) e.preventDefault();
  });

  card.addEventListener('click', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      toggleFocusedGame(card.dataset.gamePk);
      return;
    }
    const liveGame = card._game || game;
    const clickedAway = e.target.closest('.away-row, .away-score');
    const clickedHome = e.target.closest('.home-row, .home-score');
    if (clickedAway || clickedHome) {
      e.preventDefault();
      const side = clickedAway ? 'away' : 'home';
      setPendingGamePick(liveGame, side);
      if (isFocusedGame(card.dataset.gamePk)) {
        setFocusedMatchupSide(card.dataset.gamePk, side);
      }
      return;
    }
    if (isFocusedGame(card.dataset.gamePk)) {
      return;
    }
  });

  card.addEventListener('auxclick', (e) => {
    if (e.button !== 1) return;
    e.preventDefault();
    const liveGame = card._game || game;
    const isOpen = isLineupOpen(card.dataset.gamePk);
    if (isOpen) closeLineupOverlay();
    else {
      setLineupOpen(card.dataset.gamePk);
      setLineupView('lineups');
      syncLineupOverlay(liveGame);
    }
  });
}

function upsertCard(game) {
  let card = gamesEl.querySelector(`.game-card[data-game-pk='${game.gamePk}']`);
  if (!card) {
    const fragment = template.content.cloneNode(true);
    card = fragment.querySelector('.game-card');
    card.dataset.gamePk = String(game.gamePk);
    gamesEl.appendChild(fragment);
    card = gamesEl.querySelector(`.game-card[data-game-pk='${game.gamePk}']`);
  }

  card._game = game;
  bindCardInteractions(card, game);
  syncFocusedGameLayout();
  syncFocusedMatchupSelection(card);
  const scoreboardEl = card.querySelector('.scoreboard');
  const trackedHighlightsByGame = trackedBetHighlightMap(latestRenderedGames.length ? latestRenderedGames : [game]);
  const activeHighlight = trackedHighlightsByGame.get(String(game.gamePk));
  const isTrackedAtBat = Boolean(
    activeHighlight
    && String(activeHighlight.playerId) === String(game.activeBatterId || '')
  );
  scoreboardEl?.classList.toggle('bet-watch', isTrackedAtBat);
  if (scoreboardEl) {
    scoreboardEl.style.setProperty('--bet-watch-color', isTrackedAtBat ? activeHighlight.teamColor : 'transparent');
    scoreboardEl.style.setProperty('--bet-watch-rgb', isTrackedAtBat ? hexToRgb(activeHighlight.teamColor) : '102,217,255');
  }

  const themeMode = document.body.dataset.theme || 'current';
  const useTeamCellTheme = themeMode === 'team-tone' || themeMode === 'pastel' || themeMode === 'dark-pastel';
  const isPastel = themeMode === 'pastel';
  const isDarkPastel = themeMode === 'dark-pastel';
  const shadeAmount = themeMode === 'dark-pastel' ? 0.65 : 0.5;
  const awayRowBg = useTeamCellTheme ? mixHex(game.awayColor, isPastel ? 'white' : 'black', shadeAmount) : 'transparent';
  const homeRowBg = useTeamCellTheme ? mixHex(game.homeColor, isPastel ? 'white' : 'black', shadeAmount) : 'transparent';
  const awayText = isDarkPastel ? '#000000' : (isPastel ? mixHex(game.awayColor, 'black', 0.68) : game.awayColor);
  const homeText = isDarkPastel ? '#000000' : (isPastel ? mixHex(game.homeColor, 'black', 0.68) : game.homeColor);
  card.style.setProperty('--away-row-bg', awayRowBg);
  card.style.setProperty('--home-row-bg', homeRowBg);
  card.style.setProperty('--away-rgb', hexToRgb(game.awayColor || '#66d9ff'));
  card.style.setProperty('--home-rgb', hexToRgb(game.homeColor || '#f0da99'));

  card.querySelector('.away').textContent = displayTeamAbbrev(game.away);
  card.querySelector('.home').textContent = displayTeamAbbrev(game.home);
  card.querySelector('.away-record').textContent = game.awayRecord || '';
  card.querySelector('.home-record').textContent = game.homeRecord || '';
  renderTeamStreakBadge(card.querySelector('.away-streak'), game.awayStreak);
  renderTeamStreakBadge(card.querySelector('.home-streak'), game.homeStreak);
  card.querySelector('.away').style.color = awayText;
  card.querySelector('.home').style.color = homeText;
  card.querySelector('.away-record').style.color = awayText;
  card.querySelector('.home-record').style.color = homeText;
  card.querySelector('.away-score').textContent = game.awayScore;
  card.querySelector('.home-score').textContent = game.homeScore;
  card.querySelector('.away-score').style.color = awayText;
  card.querySelector('.home-score').style.color = homeText;

  setLogo(card.querySelector('.away-logo'), game.awayLogo, `${game.away} logo`);
  setLogo(card.querySelector('.home-logo'), game.homeLogo, `${game.home} logo`);
  syncCardGamePickState(card, game);

  const awayMatchupEl = card.querySelector('.away-matchup');
  const homeMatchupEl = card.querySelector('.home-matchup');
  awayMatchupEl.style.color = awayText;
  homeMatchupEl.style.color = homeText;
  renderScoreboardMatchupLine(awayMatchupEl, game, 'away');
  renderScoreboardMatchupLine(homeMatchupEl, game, 'home');
  hydratePitcherFireStreaks(card);
  hydratePitcherColdStreaks(card);
  renderScoreStateStrip(card, game);
  renderScorePlaySummary(card, game);
  syncScoreboardScale(scoreboardEl);
  renderFocusedMatchupPanel(card, game);

  const prev = previousState.get(game.gamePk);
  const awayRuns = Number(game.awayScore);
  const homeRuns = Number(game.homeScore);
  const balls = Number(game.balls);
  const strikes = Number(game.strikes);
  const outs = Number(game.outs);
  if (prev) {
    if (Number.isFinite(awayRuns) && awayRuns > prev.awayRuns) {
      animateScoreChange(card, game.awayColor, game.currentEvent === 'Home Run');
      flashHomePlate(card);
      animateNumericChange(card.querySelector('.away-score'), game.awayColor);
    } else if (Number.isFinite(homeRuns) && homeRuns > prev.homeRuns) {
      animateScoreChange(card, game.homeColor, game.currentEvent === 'Home Run');
      flashHomePlate(card);
      animateNumericChange(card.querySelector('.home-score'), game.homeColor);
    }
    if (balls !== prev.balls) animateNumericChange(card.querySelector('.score-mini-balls strong'), '#5aa7ff');
    if (strikes !== prev.strikes) animateNumericChange(card.querySelector('.score-mini-strikes strong'), '#ffd166');
    if (outs !== prev.outs) animateNumericChange(card.querySelector('.score-mini-outs strong'), '#ff6b6b');
    if (String(game.inningShort || '') !== String(prev.inningShort || '')) animateNumericChange(card.querySelector('.score-mini-inning'), '#f0da99');
  }

  previousState.set(game.gamePk, {
    awayRuns: Number.isFinite(awayRuns) ? awayRuns : 0,
    homeRuns: Number.isFinite(homeRuns) ? homeRuns : 0,
    balls: Number.isFinite(balls) ? balls : 0,
    strikes: Number.isFinite(strikes) ? strikes : 0,
    outs: Number.isFinite(outs) ? outs : 0,
    inningShort: game.inningShort || '',
  });
}

function removeStaleCards(games) {
  const keep = new Set(games.map((g) => String(g.gamePk)));
  for (const card of gamesEl.querySelectorAll('.game-card')) {
    if (!keep.has(card.dataset.gamePk)) {
      previousState.delete(Number(card.dataset.gamePk));
      focusedMatchupSideByGame.delete(String(card.dataset.gamePk));
      if (String(focusedGamePk) === String(card.dataset.gamePk)) focusedGamePk = null;
      card.remove();
    }
  }
  syncFocusedGameLayout();
}

async function finalizeRenderedGames(cards, homeRuns = []) {
  const dedupedCards = dedupeGameCards(cards, dateInput.value || formatDate(new Date()));
  latestRenderedGames = dedupedCards;
  for (const game of dedupedCards) upsertCard(game);
  removeStaleCards(dedupedCards);
  await renderActiveLineupOverlay(dedupedCards);
  renderBetList(dedupedCards);
  renderHomeRunFeed(homeRuns);
  await syncLeaderFilters(dedupedCards);
  if (currentOverlayPage === 'leaders') await refreshLeadersView({ showLoading: false });
  if (currentOverlayPage === 'hot') await refreshHotView({ showLoading: false });
}

function isCurrentLoadGamesRequest(requestId) {
  return requestId === loadGamesRequestSeq;
}

async function renderGamesEmptyState(message) {
  gamesEl.replaceChildren();
  const empty = document.createElement('div');
  empty.className = 'empty';
  empty.textContent = message;
  gamesEl.appendChild(empty);
  latestRenderedGames = [];
  renderBetList([]);
  renderHomeRunFeed([]);
  await syncLeaderFilters([]);
  if (currentOverlayPage === 'leaders') await refreshLeadersView({ showLoading: false });
  if (currentOverlayPage === 'hot') await refreshHotView({ showLoading: false });
}

async function loadGames() {
  const requestId = ++loadGamesRequestSeq;
  if (loadGamesInFlight) return;
  loadGamesInFlight = true;
  lineupHotRecognitionCache.clear();
  const selectedDate = dateInput.value || formatDate(new Date());
  const cached = getCachedGames();
  const archived = getArchivedGames(selectedDate);
  const mergedCached = dedupeGameCards(mergeCardsWithArchive(cached, archived), selectedDate);
  const cachedByTeams = new Map();
  for (const game of mergedCached) {
    cachedByTeams.set(gameMatchKey(game.away, game.home), game);
    const identityKey = gameCardInstanceKey(game, selectedDate);
    if (identityKey) cachedByTeams.set(identityKey, game);
  }
  try {
    let { cards, homeRuns } = await fetchGamesAndHomeRuns(selectedDate);
    if (!isCurrentLoadGamesRequest(requestId)) return;
    cards = dedupeGameCards(mergeCardsWithArchive(cards.map(normalizeCompletedCard), archived), selectedDate);
    const existingEmpty = gamesEl.querySelector('.empty');
    if (existingEmpty) existingEmpty.remove();

    if (!cards.length) {
      cards = await fetchMlbFallbackCards(selectedDate, cachedByTeams);
      if (!isCurrentLoadGamesRequest(requestId)) return;
      cards = dedupeGameCards(mergeCardsWithArchive(cards.map(normalizeCompletedCard), archived), selectedDate);
    }

    if (cards.length) {
      saveCachedGames(cards);
      saveArchivedGames(selectedDate, cards);
      if (!isCurrentLoadGamesRequest(requestId)) return;
      await finalizeRenderedGames(cards, homeRuns);
      return;
    }

    if (archived.length) {
      const archivedCards = dedupeGameCards(archived.map(normalizeCompletedCard), selectedDate);
      saveCachedGames(archivedCards);
      if (!isCurrentLoadGamesRequest(requestId)) return;
      await finalizeRenderedGames(archivedCards, []);
      return;
    }

    const latestDate = latestArchiveDate(selectedDate);
    if (latestDate) {
      const latestArchive = getArchivedGames(latestDate).map(normalizeCompletedCard);
      if (latestArchive.length) {
        if (!isCurrentLoadGamesRequest(requestId)) return;
        await finalizeRenderedGames(latestArchive, []);
        return;
      }
    }

    if (!isCurrentLoadGamesRequest(requestId)) return;
    await renderGamesEmptyState(`No games for ${selectedDate}.`);
  } catch (error) {
    const fallbackCards = await fetchMlbFallbackCards(selectedDate, cachedByTeams);
    if (!isCurrentLoadGamesRequest(requestId)) return;
      const normalizedFallback = dedupeGameCards(mergeCardsWithArchive(fallbackCards.map(normalizeCompletedCard), archived), selectedDate);
    if (normalizedFallback.length) {
      saveCachedGames(normalizedFallback);
      saveArchivedGames(selectedDate, normalizedFallback);
      if (!isCurrentLoadGamesRequest(requestId)) return;
      await finalizeRenderedGames(normalizedFallback, []);
      return;
    }

    if (mergedCached.length) {
      const normalizedCached = dedupeGameCards(mergedCached.map(normalizeCompletedCard), selectedDate);
      if (!isCurrentLoadGamesRequest(requestId)) return;
      await finalizeRenderedGames(normalizedCached, []);
      return;
    }

    if (archived.length) {
      const normalizedArchived = dedupeGameCards(archived.map(normalizeCompletedCard), selectedDate);
      if (!isCurrentLoadGamesRequest(requestId)) return;
      await finalizeRenderedGames(normalizedArchived, []);
      return;
    }

    const latestDate = latestArchiveDate(selectedDate);
    if (latestDate) {
      const latestArchive = getArchivedGames(latestDate).map(normalizeCompletedCard);
      if (latestArchive.length) {
        if (!isCurrentLoadGamesRequest(requestId)) return;
        await finalizeRenderedGames(latestArchive, []);
        return;
      }
    }

    if (!isCurrentLoadGamesRequest(requestId)) return;
    await renderGamesEmptyState(`Could not load MLB data (${error.message}).`);
  } finally {
    loadGamesInFlight = false;
    if (requestId !== loadGamesRequestSeq) {
      loadGames();
    }
  }
}

dateInput.addEventListener('change', () => {
  closeLineupOverlay();
  clearDraftBetSlip();
  clearPendingGamePicks({ render: false });
  closeGamePickDialog();
  renderBetList();
  renderPendingGamePicks([]);
  renderGoalTracker(true);
  renderHomeRunFeed([]);
  loadGames();
});
dateInput.addEventListener('auxclick', (e) => {
  if (e.button !== 1) return;
  e.preventDefault();
  jumpDateToToday();
});
dateInput.addEventListener('mousedown', (e) => {
  if (e.button !== 1) return;
  e.preventDefault();
});

compactExistingStorage();
initThemePicker();
initOverlayPageControl();
initOverlayKeyboardShortcuts();
initOverlayDockControl();
initScoreboardColumnsControl();
initOverlayResizeControl();
initLineupOverlay();
initMovables();
initBetInput();
initGoalTracker();
initLeadersControls();
initMatchupExportWidget();
renderHomeRunFeed([]);
loadGames();
setInterval(() => {
  const selectedDate = dateInput.value || formatDate(new Date());
  if (selectedDate !== formatDate(new Date())) return;
  loadGames();
}, 5000);
