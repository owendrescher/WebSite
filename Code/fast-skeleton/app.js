const gamesEl = document.getElementById('games');
const template = document.getElementById('gameTemplate');
const dateInput = document.getElementById('dateInput');
const datePrevBtnEl = document.getElementById('datePrevBtn');
const dateNextBtnEl = document.getElementById('dateNextBtn');
const overlayEl = document.getElementById('overlay');
const overlayResizeHandleEl = document.getElementById('overlayResizeHandle');
const overlayDockToggleBtnEl = document.getElementById('overlayDockToggleBtn');
const scoreboardColumnsBtnEl = document.getElementById('scoreboardColumnsBtn');
const clearPendingPicksBtnEl = document.getElementById('clearPendingPicksBtn');
const siteHelpDialogEl = document.getElementById('siteHelpDialog');
const siteHelpCloseBtnEl = document.getElementById('siteHelpCloseBtn');
const pageToggleBtnEl = document.getElementById('pageToggleBtn');
const themeSelectEl = document.getElementById('themeSelect');
const leadersToolbarEl = document.getElementById('leadersToolbar');
const leadersPageEl = document.getElementById('leadersPage');
const hotPageEl = document.getElementById('hotPage');
const teamStatsPageEl = document.getElementById('teamStatsPage');
const hrLeaderboardPageEl = document.getElementById('hrLeaderboardPage');
const leadersTeamSelectEl = document.getElementById('leadersTeamSelect');
const leadersPositionSelectEl = document.getElementById('leadersPositionSelect');
const leadersOpponentsBtnEl = document.getElementById('leadersOpponentsBtn');
const leadersContextEl = document.getElementById('leadersContext');
const dashboardSummaryEl = document.getElementById('dashboardSummary');
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
const playerStatLeaderBadgesEl = document.getElementById('playerStatLeaderBadges');
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
const playerTrackerListEl = document.getElementById('playerTrackerList');
const betInputPanelEl = document.getElementById('betInputPanel');
const betDayLabelEl = document.getElementById('betDayLabel');
const clearBetsBtn = document.getElementById('clearBetsBtn');
const betLogTabBtnEl = document.getElementById('betLogTabBtn');
const betInputTabBtnEl = document.getElementById('betInputTabBtn');
const playerTrackerTabBtnEl = document.getElementById('playerTrackerTabBtn');
const gamePickDialogEl = document.getElementById('gamePickDialog');
const gamePickDialogFormEl = document.getElementById('gamePickDialogForm');
const gamePickDialogSummaryEl = document.getElementById('gamePickDialogSummary');
const gamePickDialogOddsEl = document.getElementById('gamePickDialogOdds');
const gamePickDialogAmountEl = document.getElementById('gamePickDialogAmount');
const gamePickDialogCancelBtnEl = document.getElementById('gamePickDialogCancelBtn');
const gamePickDialogDismissBtnEl = document.getElementById('gamePickDialogDismissBtn');
const gamePickDialogSaveBtnEl = document.getElementById('gamePickDialogSaveBtn');
const hrListEl = document.getElementById('hrList');
const hrSortToggleBtnEl = document.getElementById('hrSortToggleBtn');
const hrGradeToggleBtnEl = document.getElementById('hrGradeToggleBtn');
const hrRatingDialogEl = document.getElementById('hrRatingDialog');
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
let betPanelMode = 'players';
let homeRunFeedSortMode = 'latest';
let homeRunRatingDisplayMode = 'letter';
let hrLeaderboardPeriod = 'week';
let latestRenderedHomeRuns = [];
const trackedPlayersMemoryByDate = new Map();
const hrLeaderboardHydratingPeriods = new Set();
let activeBetContextMenuPlayer = null;
let activeLineupGame = null;
let activePlayerStatContext = null;
let playerStatTouchStart = null;
let openLineupGamePkMemory = '';
let lineupStatGameWindow = 7;
let nonLiveLineupRenderSignature = '';
let playerStatRecentGameWindow = 5;
let latestRenderedGames = [];
let loadGamesInFlight = false;
let loadGamesQueued = false;
let loadGamesRequestSeq = 0;
let suppressScoreAnimationsUntil = 0;
let dateInputRefreshTimer = 0;
let lastHandledDateValue = '';
let autoRefreshTimerId = 0;
let lastLoadFinishedAt = 0;
let loadGamesStartedAt = 0;
let initialGamesLoadingShown = false;
let goalCompletePulseTimeout = null;
let focusedGamePk = null;
const focusedMatchupSideByGame = new Map();
const tossupScoreboardGamePks = new Set();
let draftBetLegs = [];
let pendingGamePickSelections = new Map();
const PANEL_LAYOUT_KEY = 'panel-layout:v2';
const OVERLAY_DOCK_KEY = 'overlay-dock:v1';
const OVERLAY_SIZE_KEY = 'overlay-size:v2';
const SCOREBOARD_COLUMNS_KEY = 'scoreboard-columns:v2';
const THEME_KEY = 'overlay-theme:v1';
const OVERLAY_PAGE_KEY = 'overlay-page:v1';
const LINEUP_OPEN_KEY = 'lineup-open:v2';
const LINEUP_VIEW_KEY = 'lineup-view:v1';
const LINEUP_STAT_WINDOW_KEY = 'lineup-stat-window:v1';
const PLAYER_STAT_RECENT_WINDOW_KEY = 'player-stat-recent-window:v1';
const SCOREBOARD_WIDTH_KEY = 'scoreboard-width:v1';
const GAME_ARCHIVE_PREFIX = 'games-archive:v1';
const ANALYTICS_DAY_INDEX_PREFIX = 'analytics-day:v1';
const BETS_STORAGE_KEY = 'bets:v2:all';
const PLAYER_TRACKER_STORAGE_KEY = 'player-tracker:v1';
const PENDING_GAME_PICKS_STORAGE_KEY = 'pending-game-picks:v1';
const TOSSUP_SCOREBOARD_STORAGE_KEY = 'tossup-scoreboards:v1';
const PITCHER_START_MEMORY_KEY = 'pitcher-start-memory:v2';
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
const LINEUP_TREND_GAME_WINDOW = 7;
const LINEUP_HOT_OPS_THRESHOLD = 0.950;
const LINEUP_COLD_OPS_THRESHOLD = 0.500;
const MIN_HOT_HITTERS_PER_TEAM = 2;
const MIN_COLD_HITTERS_PER_TEAM = 2;
const SLUG_BURST_THRESHOLD = 0.75;
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
  pitcherK: { label: 'K', multiLabel: 'K', statKind: 'pitching', statKey: 'so', activeRole: 'pitcher' },
  pitcherBB: { label: 'BB', multiLabel: 'BB', statKind: 'pitching', statKey: 'bb', activeRole: 'pitcher' },
  pitcherHits: { label: 'Hits Allowed', multiLabel: 'Hits Allowed', statKind: 'pitching', statKey: 'hits', activeRole: 'pitcher' },
  pitcherER: { label: 'ER', multiLabel: 'ER', statKind: 'pitching', statKey: 'earnedRuns', activeRole: 'pitcher' },
  pitcherHR: { label: 'HR Allowed', multiLabel: 'HR Allowed', statKind: 'pitching', statKey: 'hrAllowed', activeRole: 'pitcher' },
  teamWin: { label: 'Team Win', multiLabel: 'Team Wins', statKind: 'team', statKey: 'win', activeRole: 'team' },
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
const leaderCardPayloads = new WeakMap();
const leaderCardPages = new Map();
let hotRenderSequence = 0;
let teamStatsRenderSequence = 0;
let teamStatsSortState = { key: 'record', dir: 'desc' };
let teamStatsGroupByDivision = true;
const leadersSeasonCache = new Map();
const leadersTeamsCache = new Map();
const teamStatsCache = new Map();
const hotHitterRangeCache = new Map();
const lineupHotRecognitionCache = new Map();
const officialProbablePitcherCache = new Map();
const mlbProbablePageCache = new Map();
const mlbProbablePageTextCache = new Map();
const mlbStartingLineupPageCache = new Map();
const mlbPreviousLineupCache = new Map();
const playerNameSearchCache = new Map();
const matchupHistoryCache = new Map();
const teamMatchupHistoryCache = new Map();
const playerCareerStartCache = new Map();
const betPlayerLastFiveCache = new Map();
const pitcherFireStreakCache = new Map();
const pitcherColdStreakCache = new Map();
const teamPitcherRosterCache = new Map();
const teamActiveRosterCache = new Map();
const teamInjuryRosterCache = new Map();
const teamProspectsCache = new Map();
const pitcherUsageDateCache = new Map();
const pitcherLastPitchedCache = new Map();
const playerHandedSplitsCache = new Map();
const pitcherOpponentHandSplitsCache = new Map();
const playerSeasonHomeRunCache = new Map();
const teamStreakCache = new Map();
const teamLastSevenRecordCache = new Map();
const teamRecentFormCache = new Map();
const teamBullpenRanksCache = new Map();
const teamStandingRecordCache = new Map();
const lineupRecentBattingCache = new Map();
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

const FANGRAPHS_PITCHER_HAND_SPLIT_SEEDS = {
  [normalizeNameKey('Sandy Alcantara')]: {
    season: 2026,
    playerId: 645261,
    source: 'FanGraphs',
    sourceUrl: 'https://www.fangraphs.com/players/sandy-alcantara/18684/splits?position=P',
    vsLeft: { avg: '.248', slg: '.390', homeRuns: 3, strikeOuts: 17 },
    vsRight: { avg: '.234', slg: '.319', homeRuns: 1, strikeOuts: 19 },
  },
};

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
  CHW: 'CHW',
};

const TEAM_SEARCH_NAMES = {
  ARI: 'Arizona Diamondbacks Dbacks D-backs',
  ATL: 'Atlanta Braves',
  BAL: 'Baltimore Orioles',
  BOS: 'Boston Red Sox',
  CHC: 'Chicago Cubs',
  CHW: 'Chicago White Sox CWS',
  CIN: 'Cincinnati Reds',
  CLE: 'Cleveland Guardians',
  COL: 'Colorado Rockies',
  DET: 'Detroit Tigers',
  HOU: 'Houston Astros',
  KC: 'Kansas City Royals',
  LAA: 'Los Angeles Angels Anaheim',
  LAD: 'Los Angeles Dodgers LA Dodgers',
  MIA: 'Miami Marlins',
  MIL: 'Milwaukee Brewers',
  MIN: 'Minnesota Twins',
  NYM: 'New York Mets',
  NYY: 'New York Yankees',
  ATH: 'Athletics Oakland Sacramento',
  PHI: 'Philadelphia Phillies',
  PIT: 'Pittsburgh Pirates',
  SD: 'San Diego Padres',
  SEA: 'Seattle Mariners',
  SF: 'San Francisco Giants',
  STL: 'St Louis Cardinals Saint Louis',
  TB: 'Tampa Bay Rays',
  TEX: 'Texas Rangers',
  TOR: 'Toronto Blue Jays',
  WSH: 'Washington Nationals Nats',
};

const TEAM_IDS = {
  ARI: 109, ATL: 144, BAL: 110, BOS: 111, CHC: 112, CHW: 145, CIN: 113, CLE: 114, COL: 115,
  DET: 116, HOU: 117, KC: 118, LAA: 108, LAD: 119, MIA: 146, MIL: 158, MIN: 142, NYM: 121,
  NYY: 147, ATH: 133, PHI: 143, PIT: 134, SD: 135, SEA: 136, SF: 137, STL: 138, TB: 139,
  TEX: 140, TOR: 141, WSH: 120,
};

const TEAM_MLB_SLUGS = {
  ARI: 'dbacks', ATL: 'braves', BAL: 'orioles', BOS: 'redsox', CHC: 'cubs', CHW: 'whitesox',
  CIN: 'reds', CLE: 'guardians', COL: 'rockies', DET: 'tigers', HOU: 'astros', KC: 'royals',
  LAA: 'angels', LAD: 'dodgers', MIA: 'marlins', MIL: 'brewers', MIN: 'twins', NYM: 'mets',
  NYY: 'yankees', ATH: 'athletics', PHI: 'phillies', PIT: 'pirates', SD: 'padres', SEA: 'mariners',
  SF: 'giants', STL: 'cardinals', TB: 'rays', TEX: 'rangers', TOR: 'bluejays', WSH: 'nationals',
};

const TEAM_NICKNAMES = {
  ARI: 'D-backs Diamondbacks', ATL: 'Braves', BAL: 'Orioles', BOS: 'Red Sox', CHC: 'Cubs',
  CHW: 'White Sox', CIN: 'Reds', CLE: 'Guardians', COL: 'Rockies', DET: 'Tigers', HOU: 'Astros',
  KC: 'Royals', LAA: 'Angels', LAD: 'Dodgers', MIA: 'Marlins', MIL: 'Brewers', MIN: 'Twins',
  NYM: 'Mets', NYY: 'Yankees', ATH: "Athletics A's", PHI: 'Phillies', PIT: 'Pirates',
  SD: 'Padres', SEA: 'Mariners', SF: 'Giants', STL: 'Cardinals', TB: 'Rays', TEX: 'Rangers',
  TOR: 'Blue Jays', WSH: 'Nationals Nats',
};

const formatDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function parseFlexibleDateInput(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  let year;
  let month;
  let day;
  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  } else {
    match = text.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
    if (match) {
      month = Number(match[1]);
      day = Number(match[2]);
      year = match[3] ? Number(match[3]) : new Date().getFullYear();
      if (year < 100) year += 2000;
    } else {
      match = text.match(/^(\d{4})(\d{2})(\d{2})$/);
      if (match) {
        year = Number(match[1]);
        month = Number(match[2]);
        day = Number(match[3]);
      }
    }
  }
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return '';
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return '';
  return formatDate(parsed);
}

function seasonForDate(date) {
  const year = Number(String(date || formatDate(new Date())).slice(0, 4));
  return Number.isFinite(year) ? year : new Date().getFullYear();
}

function normalizeOverlayPage(value) {
  return ['scoreboard', 'leaders', 'hot', 'teamStats', 'hrLeaderboard'].includes(value) ? value : 'scoreboard';
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

function formatLongDateLabel(date) {
  const value = String(date || formatDate(new Date()));
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)));
}

let datePickerEl = null;
let datePickerMonth = null;

function datePickerBaseDate() {
  return new Date(parseLocalDateValue(parseFlexibleDateInput(dateInput.value) || formatDate(new Date())).getFullYear(), parseLocalDateValue(parseFlexibleDateInput(dateInput.value) || formatDate(new Date())).getMonth(), 1);
}

function setDateInputValue(date, options = {}) {
  const next = typeof date === 'string' ? parseFlexibleDateInput(date) : formatDate(date);
  if (!next) return false;
  if (dateInput.value !== next) {
    dateInput.value = next;
    if (options.dispatch !== false) dateInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
  return true;
}

function closeDatePicker() {
  datePickerEl?.remove();
  datePickerEl = null;
}

function positionDatePicker() {
  if (!datePickerEl) return;
  const rect = dateInput.getBoundingClientRect();
  const margin = 8;
  const width = Math.min(320, window.innerWidth - margin * 2);
  datePickerEl.style.width = `${width}px`;
  datePickerEl.style.left = `${Math.min(Math.max(margin, rect.left), window.innerWidth - width - margin)}px`;
  datePickerEl.style.top = `${Math.max(margin, Math.min(rect.bottom + margin, window.innerHeight - 360))}px`;
}

function renderDatePicker() {
  if (!datePickerEl) return;
  const monthDate = datePickerMonth || datePickerBaseDate();
  const selected = parseFlexibleDateInput(dateInput.value) || formatDate(new Date());
  const today = formatDate(new Date());
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const value = formatDate(day);
    days.push(`<button type="button" class="date-picker-day${day.getMonth() !== first.getMonth() ? ' muted' : ''}${value === selected ? ' selected' : ''}${value === today ? ' today' : ''}" data-date-picker-day="${value}">${day.getDate()}</button>`);
  }
  datePickerEl.innerHTML = `
    <div class="date-picker-head">
      <button type="button" data-date-picker-year="-1" aria-label="Previous year">&laquo;</button>
      <button type="button" data-date-picker-shift="-1" aria-label="Previous month">&lsaquo;</button>
      <strong>${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(first)}</strong>
      <button type="button" data-date-picker-shift="1" aria-label="Next month">&rsaquo;</button>
      <button type="button" data-date-picker-year="1" aria-label="Next year">&raquo;</button>
    </div>
    <div class="date-picker-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
    <div class="date-picker-grid">${days.join('')}</div>
    <div class="date-picker-actions">
      <button type="button" data-date-picker-today>Today</button>
      <button type="button" data-date-picker-close>Close</button>
    </div>
  `;
  positionDatePicker();
}

function openDatePicker() {
  if (!datePickerEl) {
    datePickerEl = document.createElement('div');
    datePickerEl.className = 'date-picker-popover';
    datePickerEl.addEventListener('mousedown', (e) => e.preventDefault());
    datePickerEl.addEventListener('click', (e) => {
      const dayBtn = e.target.closest('[data-date-picker-day]');
      if (dayBtn) {
        setDateInputValue(dayBtn.dataset.datePickerDay);
        closeDatePicker();
        return;
      }
      const shiftBtn = e.target.closest('[data-date-picker-shift]');
      if (shiftBtn) {
        datePickerMonth.setMonth(datePickerMonth.getMonth() + (Number(shiftBtn.dataset.datePickerShift) || 0));
        renderDatePicker();
        return;
      }
      const yearBtn = e.target.closest('[data-date-picker-year]');
      if (yearBtn) {
        datePickerMonth.setFullYear(datePickerMonth.getFullYear() + (Number(yearBtn.dataset.datePickerYear) || 0));
        renderDatePicker();
        return;
      }
      if (e.target.closest('[data-date-picker-today]')) {
        setDateInputValue(formatDate(new Date()));
        closeDatePicker();
        return;
      }
      if (e.target.closest('[data-date-picker-close]')) closeDatePicker();
    });
    document.body.appendChild(datePickerEl);
  }
  datePickerMonth = datePickerBaseDate();
  renderDatePicker();
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

function addDaysToDateValue(date, days) {
  const base = parseLocalDateValue(date || formatDate(new Date()));
  base.setDate(base.getDate() + Number(days || 0));
  return formatDate(base);
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

dateInput.type = 'text';
dateInput.inputMode = 'numeric';
dateInput.autocomplete = 'off';
dateInput.placeholder = 'YYYY-MM-DD';
try {
  dateInput.value = parseFlexibleDateInput(localStorage.getItem('dashboard-date:v1')) || formatDate(new Date());
} catch {
  dateInput.value = formatDate(new Date());
}

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
  return 4;
}

function columnsBoundsForDock(dock = currentOverlayDock) {
  return { min: 4, max: 4 };
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
  scoreboardColumnsBtnEl.textContent = '?';
  scoreboardColumnsBtnEl.setAttribute('aria-label', 'Open site controls help');
  scoreboardColumnsBtnEl.title = 'Controls and site capabilities';
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
  scoreboardColumnsBtnEl.classList.add('help-btn');
  scoreboardColumnsBtnEl.addEventListener('click', () => {
    if (siteHelpDialogEl?.showModal) siteHelpDialogEl.showModal();
    else window.alert('Controls: left-click a team to stage a winner pick. Ctrl/Cmd-click a game to focus it. Middle-click, Alt-click, or press L while hovering a game to open the lineup card. Use A/D to move the date.');
  });
  siteHelpCloseBtnEl?.addEventListener('click', () => siteHelpDialogEl?.close());
  siteHelpDialogEl?.addEventListener('click', (e) => {
    if (e.target === siteHelpDialogEl) siteHelpDialogEl.close();
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
  try {
    return localStorage.getItem(storageKey(LINEUP_OPEN_KEY)) || openLineupGamePkMemory || '';
  } catch {
    return openLineupGamePkMemory || '';
  }
}

function saveOpenLineupGamePk(gamePk) {
  openLineupGamePkMemory = gamePk ? String(gamePk) : '';
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

function savedLineupView() {
  try {
    const saved = localStorage.getItem(storageKey(LINEUP_VIEW_KEY));
    return ['lineups', 'roster', 'pitching'].includes(saved) ? saved : 'lineups';
  } catch {
    return 'lineups';
  }
}

function saveLineupView(view) {
  try {
    localStorage.setItem(storageKey(LINEUP_VIEW_KEY), ['lineups', 'roster', 'pitching'].includes(view) ? view : 'lineups');
  } catch {}
}

function normalizeLineupStatWindow(value) {
  const numeric = Number(value);
  return [5, 7, 10, 15].includes(numeric) ? numeric : 7;
}

function nextLineupStatWindow(value = lineupStatGameWindow) {
  const options = [5, 7, 10, 15];
  const current = normalizeLineupStatWindow(value);
  const index = options.indexOf(current);
  return options[(index + 1) % options.length];
}

function savedLineupStatWindow() {
  try {
    return normalizeLineupStatWindow(localStorage.getItem(storageKey(LINEUP_STAT_WINDOW_KEY)));
  } catch {
    return 7;
  }
}

function saveLineupStatWindow(value) {
  const next = normalizeLineupStatWindow(value);
  try {
    localStorage.setItem(storageKey(LINEUP_STAT_WINDOW_KEY), String(next));
  } catch {}
}

function syncLineupStatWindowToggle() {
  lineupOverlayEl?.querySelectorAll?.('[data-lineup-stat-window]').forEach((button) => {
    button.textContent = `L${lineupStatGameWindow}`;
    button.title = `Showing last ${lineupStatGameWindow} games`;
    button.setAttribute('aria-label', `Showing last ${lineupStatGameWindow} games. Click to change.`);
  });
}

function savedPlayerStatRecentWindow() {
  try {
    return Number(localStorage.getItem(storageKey(PLAYER_STAT_RECENT_WINDOW_KEY))) === 10 ? 10 : 5;
  } catch {
    return 5;
  }
}

function savePlayerStatRecentWindow(value) {
  const next = Number(value) === 10 ? 10 : 5;
  try {
    localStorage.setItem(storageKey(PLAYER_STAT_RECENT_WINDOW_KEY), String(next));
  } catch {}
}

function syncPlayerStatRecentToggle() {
  playerStatMatchupEl?.querySelectorAll?.('.player-recent-window-toggle').forEach((button) => {
    button.textContent = `L${playerStatRecentGameWindow}`;
    button.setAttribute('aria-pressed', playerStatRecentGameWindow === 10 ? 'true' : 'false');
    button.title = `Showing last ${playerStatRecentGameWindow} game stats`;
  });
}

function closeLineupOverlay() {
  saveOpenLineupGamePk('');
  nonLiveLineupRenderSignature = '';
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
  const allowed = THEMES.find((theme) => theme.value === themeValue)?.value || 'team-tone';
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
  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme && savedTheme !== 'current' ? savedTheme : 'team-tone');
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

function lineupBatterLastName(entry) {
  const fullName = cleanSummary(entry?.fullName || entry?.name || '');
  const fallback = cleanSummary(entry?.name || fullName);
  if (!fullName) return fallback || '-';
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (!parts.length) return fallback || '-';
  const suffixPattern = /^(?:jr\.?|sr\.?|ii|iii|iv|v|vi)$/i;
  const suffix = suffixPattern.test(parts[parts.length - 1]) ? parts.pop() : '';
  if (!parts.length) return suffix || fallback || '-';
  const particles = new Set(['da', 'de', 'del', 'den', 'der', 'di', 'dos', 'du', 'la', 'las', 'le', 'van', 'von']);
  const nameParts = [parts.pop()];
  while (parts.length && particles.has(parts[parts.length - 1].toLowerCase())) {
    nameParts.unshift(parts.pop());
  }
  if (suffix) nameParts.push(suffix);
  return nameParts.join(' ') || fallback || '-';
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

function lineupGameBattingStats(source = {}) {
  const gameBatting = source?.gameBatting || source?.stats?.batting || {};
  return {
    atBats: statNumber(gameBatting.atBats),
    hits: statNumber(gameBatting.hits),
    walks: statNumber(gameBatting.bb ?? gameBatting.baseOnBalls ?? gameBatting.walks),
    strikeOuts: statNumber(gameBatting.so ?? gameBatting.strikeOuts),
  };
}

function lineupRecentBattingStatsFromDetails(details) {
  if (!details?.totals) return null;
  return {
    games: statNumber(details.totals.games),
    atBats: statNumber(details.totals.atBats),
    hits: statNumber(details.totals.hits),
    extraBaseHits: statNumber(details.totals.xbh),
    homeRuns: statNumber(details.totals.homeRuns),
    walks: statNumber(details.totals.walks),
    strikeOuts: statNumber(details.totals.strikeOuts),
    avg: formatBetRate(details.metrics?.avg || 0),
    ops: formatBetRate(details.metrics?.ops || 0),
  };
}

function lineupDashboardStatsHtml(entry, recentStatsMap = new Map()) {
  const recent = recentStatsMap?.get?.(String(entry?.id)) || null;
  const games = Number(recent?.games) || lineupStatGameWindow;
  const label = `Last ${games}G`;
  if (!recent) {
    return `<span class="lineup-dashboard-stats">${label}: ----- | AVG --- | OPS --- | XBH -- | HR --</span>`;
  }
  return `<span class="lineup-dashboard-stats">${label}: ${recent.hits}-${recent.atBats} | AVG ${escapeHtml(recent.avg || '---')} | OPS ${escapeHtml(recent.ops || '---')} | XBH ${recent.extraBaseHits} | HR ${recent.homeRuns}</span>`;
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
  if (direct) {
    const directTeam = canonicalTeamAbbrev(direct?.teamAbbrev || '');
    if (teamCode && directTeam && directTeam !== teamCode) return null;
    return direct;
  }

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
      isNextUp: Boolean(entry?.isNextUp),
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
    gameBatting: profile?.gameBatting || entry?.gameBatting || lineupGameBattingStats(entry),
    batting: profile?.batting || entry?.batting || {},
    isActive: Boolean(entry?.isActive) || Number(profile?.id) === Number(game?.activeBatterId),
    isNextUp: Boolean(entry?.isNextUp),
  }, resolvedSlot);
}

function lineupEntryAllowedForSide(game, side, entry) {
  const teamCode = lineupSideTeamCode(game, side, entry);
  const entryTeam = canonicalTeamAbbrev(entry?.teamAbbrev || entry?.team || '');
  if (teamCode && entryTeam && entryTeam !== teamCode) return false;
  const playerId = Number(entry?.id ?? entry?.playerId ?? entry?.person?.id);
  const profile = Number.isFinite(playerId) && playerId > 0 ? game?.playerLookup?.[String(playerId)] || null : null;
  const profileTeam = canonicalTeamAbbrev(profile?.teamAbbrev || '');
  if (teamCode && profileTeam && profileTeam !== teamCode) return false;
  return true;
}

function normalizeLineupCollectionForSide(game, side, lineup = []) {
  if (!Array.isArray(lineup) || !lineup.length) return [];
  return lineup
    .filter((entry) => lineupEntryAllowedForSide(game, side, entry))
    .map((entry, index) => normalizeLineupEntryForSide(game, side, entry, index + 1));
}

function lineupIdSignature(lineup = []) {
  return (Array.isArray(lineup) ? lineup : [])
    .map((entry) => Number(entry?.id ?? entry?.playerId ?? entry?.person?.id))
    .filter((id) => Number.isFinite(id) && id > 0)
    .join(',');
}

function lineupsAreDuplicated(awayLineup = [], homeLineup = []) {
  const awayIds = lineupIdSignature(awayLineup);
  const homeIds = lineupIdSignature(homeLineup);
  if (!awayIds || !homeIds || awayIds !== homeIds) return false;
  return awayIds.split(',').length >= 4;
}

function repairDuplicatedTeamLineups(game) {
  if (!game?.lineup || sameTeamAbbrev(game?.away, game?.home)) return game;
  const lineup = { ...game.lineup };
  let changed = false;
  if (lineupsAreDuplicated(lineup.away, lineup.home)) {
    lineup.home = [];
    changed = true;
  }
  if (lineupsAreDuplicated(lineup.awayBench, lineup.homeBench)) {
    lineup.homeBench = [];
    changed = true;
  }
  return changed ? { ...game, lineup } : game;
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
  let probablePitchers = sanitizeProbablePitchers(card.probablePitchers || {}, card, card.away, card.home);
  if (shouldPreferProbablePitcher(card)) {
    probablePitchers = {
      away: isReusablePreviewProbableForSide(probablePitchers.away, card, 'away') ? probablePitchers.away : null,
      home: isReusablePreviewProbableForSide(probablePitchers.home, card, 'home') ? probablePitchers.home : null,
    };
  }
  return repairDuplicatedTeamLineups({
    ...card,
    lineup: sanitizeStoredLineup(card.lineup),
    probablePitchers,
  });
}

function isReusablePreviewProbableForSide(pitcher, game, side) {
  if (!isTrustedPreviewProbable(pitcher, game)) return false;
  const team = side === 'away' ? game?.away : game?.home;
  const pitcherTeam = probablePitcherTeamAbbrev(pitcher, game);
  if (pitcherTeam && team && !sameTeamAbbrev(pitcherTeam, team)) return false;
  if (pitcher?.source === 'rotation-memory' || pitcher?.source === 'statsapi-team-schedule') return true;
  return Number.isFinite(Number(pitcher?.id ?? pitcher?.person?.id)) && Boolean(pitcherTeam);
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

function cssEscape(value) {
  if (window.CSS?.escape) return CSS.escape(String(value ?? ''));
  return String(value ?? '').replace(/["\\\]]/g, '\\$&');
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
  return player?.pitching?.era
    || player?.seasonStats?.pitching?.era
    || player?.era
    || player?.stats?.pitching?.era
    || '---';
}

function pitcherWhip(player) {
  return player?.pitching?.whip
    || player?.pitching?.walksAndHitsPerInningPitched
    || player?.seasonStats?.pitching?.whip
    || player?.seasonStats?.pitching?.walksAndHitsPerInningPitched
    || player?.whip
    || player?.stats?.pitching?.whip
    || player?.stats?.pitching?.walksAndHitsPerInningPitched
    || '---';
}

function pitcherInningsPitched(player) {
  return cleanSummary(
    player?.pitching?.ip
    || player?.seasonStats?.pitching?.inningsPitched
    || player?.ip
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

function pitcherHealthText(player) {
  return cleanSummary([
    player?.status?.description,
    player?.status?.code,
    player?.status?.reason,
    player?.rosterStatus,
    player?.injuryStatus,
  ].filter(Boolean).join(' '));
}

function isHealthyPitcherCandidate(player) {
  const text = pitcherHealthText(player);
  return !/(injur|disabled|il\b|10-day|15-day|60-day|out|bereavement|restricted|suspended)/i.test(text);
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
  const homeRuns = statNumber(pitching.homeRuns ?? pitching.hrAllowed ?? pitching.hr);

  const parts = [];
  if (inningsPitched) parts.push(`${inningsPitched} IP`);
  if (hits > 0 || inningsPitched) parts.push(`${hits} H`);
  if (earnedRuns > 0 || inningsPitched) parts.push(`${earnedRuns} ER`);
  if (homeRuns > 0 || inningsPitched) parts.push(`${homeRuns} HR`);
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
        games: statNumber(
          batting.gamesPlayed
          ?? batting.games
          ?? fielding.gamesPlayed
          ?? player?.stats?.fielding?.gamesPlayed
          ?? gameBio?.gamesPlayed
        ),
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

function teamSearchText(abbrev) {
  const canonical = canonicalTeamAbbrev(abbrev);
  return [canonical, displayTeamAbbrev(canonical), TEAM_SEARCH_NAMES[canonical] || ''].filter(Boolean).join(' ');
}

function sameTeamAbbrev(left, right) {
  const a = canonicalTeamAbbrev(left);
  const b = canonicalTeamAbbrev(right);
  return Boolean(a) && Boolean(b) && a === b;
}

function scheduleTeamAbbrev(team = {}) {
  const id = Number(team?.id);
  if (Number.isFinite(id)) {
    const fromId = Object.entries(TEAM_IDS).find(([, teamId]) => Number(teamId) === id)?.[0];
    if (fromId) return fromId;
  }
  const direct = canonicalTeamAbbrev(team?.abbreviation || team?.teamCode?.toUpperCase() || team?.fileCode?.toUpperCase() || '');
  if (TEAM_IDS[direct]) return direct;
  const nameKey = normalizeNameKey(team?.name || team?.teamName || team?.clubName || '');
  if (nameKey) {
    const fromName = Object.entries(TEAM_SEARCH_NAMES).find(([abbrev, search]) => normalizeNameKey(search).includes(nameKey) || nameKey.includes(normalizeNameKey(search)))?.[0];
    if (fromName) return fromName;
    const fromNickname = Object.entries(TEAM_NICKNAMES).find(([, nicknames]) => normalizeNameKey(nicknames).split(/\s+/).some((part) => part && nameKey.includes(part)))?.[0];
    if (fromNickname) return fromNickname;
  }
  return canonicalTeamAbbrev(team?.name || '');
}

function normalizeProbablePitcher(pitcher, teamAbbrev = '') {
  if (!pitcher) return null;
  const id = Number(pitcher?.id ?? pitcher?.person?.id);
  const normalized = {
    ...pitcher,
    id: Number.isFinite(id) && id > 0 ? id : pitcher?.id ?? pitcher?.person?.id ?? null,
    fullName: pitcher?.fullName || pitcher?.person?.fullName || pitcher?.name || '',
  };
  if (teamAbbrev) normalized.teamAbbrev = canonicalTeamAbbrev(teamAbbrev);
  return normalized.fullName || normalized.id ? normalized : null;
}

function isOfficialProbableSource(pitcher) {
  const source = String(pitcher?.source || '');
  return source === 'mlb-probable-page' || source === 'baseball-savant-probables' || source === 'rotation-memory';
}

function isAuthoritativeProbableSource(pitcher) {
  const source = String(pitcher?.source || '');
  return source === 'mlb-probable-page' || source === 'baseball-savant-probables';
}

function isTrustedPreviewProbable(pitcher, game) {
  if (!pitcher || !isOfficialProbableSource(pitcher)) return false;
  return String(pitcher.sourceDate || '') === String(officialDateForGame(game));
}

function previewProbableForSide(game, side) {
  const probable = game?.probablePitchers?.[side] || null;
  const team = side === 'away' ? game?.away : game?.home;
  const pitcherTeam = probablePitcherTeamAbbrev(probable, game);
  if (pitcherTeam && team && !sameTeamAbbrev(pitcherTeam, team)) return null;
  return isTrustedPreviewProbable(probable, game) ? probable : null;
}

function isValidProbablePitcherName(name) {
  const text = cleanSummary(name);
  if (!text) return false;
  if (/^TBD$/i.test(text)) return true;
  if (isPlaceholderProbablePitcherText(text)) return false;
  if (/preview|matchup|tickets?|gameday|wrap|recap|image|career vs|statcast|pitch arsenal/i.test(text)) return false;
  if (/\b(mon|tue|wed|thu|fri|sat|sun|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(text)) return false;
  if (/[|@•]|\d{4}/.test(text)) return false;
  const words = text.split(/\s+/).filter(Boolean);
  return words.length >= 2 && words.length <= 4 && words.every((word) => /^[A-Za-zÀ-ÿ'.-]+$/.test(word));
}

function isPlaceholderProbablePitcherText(value) {
  const text = cleanSummary(value).replace(/\s+/g, ' ').trim();
  if (!text) return true;
  if (/^TBD$/i.test(text)) return true;
  if (/^(announced|announced\.|to be announced|starter announced|pitcher announced|no starter announced|not announced)$/i.test(text)) return true;
  if (/\b(to be\s+)?announc(?:ed|ement)?\b/i.test(text)) return true;
  if (/\b(no|not)\s+(starter|pitcher|probable)\b/i.test(text)) return true;
  if (/\b(starter|pitcher|probable)\s+(unknown|tbd|pending)\b/i.test(text)) return true;
  return false;
}

function probablePageTeamTerms(teamAbbrev) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const nickname = TEAM_NICKNAMES[team] || '';
  const searchName = TEAM_SEARCH_NAMES[team] || '';
  const searchWords = searchName.split(/\s+/).filter(Boolean);
  return [
    team,
    displayTeamAbbrev(team),
    nickname,
    searchName,
    searchWords.slice(-1).join(' '),
    searchWords.slice(-2).join(' '),
    ...nickname.split(/\s+/),
  ]
    .map((term) => normalizeNameKey(term))
    .filter((term, index, list) => term.length >= 2 && list.indexOf(term) === index);
}

function lineContainsTeamTerm(line, teamAbbrev) {
  const normalized = normalizeNameKey(line);
  return probablePageTeamTerms(teamAbbrev).some((term) => normalized === term || normalized.includes(term));
}

function textFromProbablePage(rawText) {
  const raw = String(rawText || '');
  if (raw.includes('<') && typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(raw, 'text/html');
      return doc?.body?.textContent || raw;
    } catch {}
  }
  return raw.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n');
}

function probablePageLines(rawText) {
  return textFromProbablePage(rawText)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .split(/\r?\n+/)
    .map(cleanSummary)
    .filter(Boolean);
}

function isProbablePageNoiseLine(line) {
  const text = cleanSummary(line);
  if (!text) return true;
  if (/^!\[/.test(text) || /^https?:\/\//i.test(text)) return true;
  if (/^(image|tickets?|gameday|preview|wrap|recap|view|close stats|accordion|arrow|grid icon|list view)$/i.test(text)) return true;
  if (/^\(\d+-\d+\)$/.test(text)) return true;
  if (/^(tv:|at |all times|player stats|subject to change)/i.test(text)) return true;
  if (/[•@]/.test(text)) return true;
  return false;
}

function probableNameFromLine(line) {
  return cleanSummary(line)
    .replace(/^【\d+†\s*([^】]*)】$/, '$1')
    .replace(/^#+\s*/, '')
    .replace(/^!\[[^\]]*]\([^)]*\)\s*/, '')
    .replace(/^\[([^\]]+)]\([^)]*\).*$/, '$1')
    .replace(/\s+#\d+\s+Throws:.*$/i, '')
    .replace(/\s+\|\s+.*$/, '')
    .trim();
}

function isProbableMatchupLine(line) {
  const text = cleanSummary(line);
  return text.includes('@') && /[A-Za-z]/.test(text) && !/^(tv:|at\s)/i.test(text);
}

function probablePitcherBlockEnd(lines, matchupIndex, maxLines = 90) {
  const hardEnd = Math.min(lines.length, matchupIndex + maxLines);
  for (let i = matchupIndex + 1; i < hardEnd; i += 1) {
    if (isProbableMatchupLine(lines[i])) return i;
  }
  return hardEnd;
}

function previousProbablePitcherName(lines, index) {
  for (let i = index; i >= 0; i -= 1) {
    const line = probableNameFromLine(lines[i]);
    if (isProbableMatchupLine(line)) break;
    if (isProbablePageNoiseLine(line)) continue;
    if (/^(RHP|LHP|TBD)$/i.test(line)) continue;
    if (/^\d+-\d+,/.test(line)) continue;
    if (!/[A-Za-z]/.test(line)) continue;
    if (!isValidProbablePitcherName(line)) continue;
    return line;
  }
  return '';
}

function parseProbablePitchersFromPage(rawText, awayAbbrev, homeAbbrev, targetDate = '') {
  const lines = probablePageLines(rawText);
  const matchupIndex = lines.findIndex((line) => {
    if (!line.includes('@')) return false;
    return lineContainsTeamTerm(line, awayAbbrev) && lineContainsTeamTerm(line, homeAbbrev);
  });
  if (matchupIndex < 0) return null;

  const entries = [];
  const end = probablePitcherBlockEnd(lines, matchupIndex, 90);
  for (let i = matchupIndex + 1; i < end; i += 1) {
    const line = cleanSummary(lines[i]);
    const hand = line.match(/^(RHP|LHP)$/i)?.[1]?.toUpperCase() || '';
    if (hand) {
      const name = previousProbablePitcherName(lines, i - 1);
      if (name && !/^TBD$/i.test(name)) {
        entries.push({ fullName: name, name: lastName(name), pitchHand: { code: hand[0], description: hand }, source: 'mlb-probable-page', sourceDate: targetDate });
      } else {
        entries.push({ fullName: 'TBD', name: 'TBD', source: 'mlb-probable-page', sourceDate: targetDate });
      }
    } else if (/^TBD$/i.test(line)) {
      entries.push({ fullName: 'TBD', name: 'TBD', source: 'mlb-probable-page', sourceDate: targetDate });
    }
    if (entries.length >= 2) break;
  }
  if (!entries.length) return null;
  return sanitizeProbablePitchers({
    away: entries[0] || null,
    home: entries[1] || null,
  }, null, awayAbbrev, homeAbbrev);
}

function startingLineupDateTerms(date) {
  const parsed = parseLocalDateValue(date);
  const monthLong = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'America/New_York' }).format(parsed);
  const monthShort = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'America/New_York' }).format(parsed);
  const day = parsed.getDate();
  const year = parsed.getFullYear();
  const ordinal = `${day}${day % 10 === 1 && day % 100 !== 11 ? 'st' : day % 10 === 2 && day % 100 !== 12 ? 'nd' : day % 10 === 3 && day % 100 !== 13 ? 'rd' : 'th'}`;
  return [
    `${monthLong} ${ordinal}, ${year}`,
    `${monthLong} ${day}, ${year}`,
    `${monthShort} ${day}, ${year}`,
  ].map(normalizeNameKey);
}

function lineMatchesStartingLineupDate(line, date) {
  const normalized = normalizeNameKey(line);
  return startingLineupDateTerms(date).some((term) => normalized.includes(term));
}

function parseStartingLineupPitchersFromPage(rawText, awayAbbrev, homeAbbrev, targetDate) {
  const lines = probablePageLines(rawText);
  const dateIndex = lines.findIndex((line) => lineMatchesStartingLineupDate(line, targetDate));
  const searchStart = dateIndex >= 0 ? dateIndex : 0;
  const searchEnd = dateIndex >= 0
    ? Math.min(lines.length, dateIndex + 140)
    : lines.length;
  const matchupIndex = lines.findIndex((line, index) => {
    if (index < searchStart || index >= searchEnd || !line.includes('@')) return false;
    return lineContainsTeamTerm(line, awayAbbrev) && lineContainsTeamTerm(line, homeAbbrev);
  });
  if (matchupIndex < 0) return null;

  const entries = [];
  const end = probablePitcherBlockEnd(lines, matchupIndex, 70);
  for (let i = matchupIndex + 1; i < end; i += 1) {
    const marker = cleanSummary(lines[i]);
    if (/\bLineup\b/i.test(marker)) break;
    const hand = marker.match(/^(RHP|LHP)$/i)?.[1]?.toUpperCase() || '';
    if (hand) {
      const name = previousProbablePitcherName(lines, i - 1);
      if (isValidProbablePitcherName(name)) {
        entries.push({ fullName: name, name: lastName(name), pitchHand: { code: hand[0], description: hand }, source: 'mlb-probable-page', sourceDate: targetDate });
      } else {
        entries.push({ fullName: 'TBD', name: 'TBD', source: 'mlb-probable-page', sourceDate: targetDate });
      }
    } else if (/^TBD$/i.test(marker)) {
      entries.push({ fullName: 'TBD', name: 'TBD', source: 'mlb-probable-page', sourceDate: targetDate });
    }
    if (entries.length >= 2) break;
  }
  if (!entries.length) return null;
  return sanitizeProbablePitchers({
    away: entries[0] || null,
    home: entries[1] || null,
  }, null, awayAbbrev, homeAbbrev);
}

function startingLineupLabelTeam(line) {
  const label = cleanSummary(line).match(/^(.+?)\s+Lineup$/i)?.[1] || '';
  if (!label) return '';
  const normalized = canonicalTeamAbbrev(label);
  if (TEAM_MLB_SLUGS[normalized] || TEAM_IDS[normalized]) return normalized;
  const key = normalizeNameKey(label);
  return Object.keys(TEAM_SEARCH_NAMES).find((team) => {
    return normalizeNameKey(displayTeamAbbrev(team)) === key
      || normalizeNameKey(TEAM_NICKNAMES[team] || '') === key
      || normalizeNameKey(TEAM_SEARCH_NAMES[team] || '').includes(key);
  }) || '';
}

function parseStartingLineupBatterLine(line) {
  let text = cleanSummary(line)
    .replace(/^\s*\d+\.\s*/, '')
    .replace(/^【\d+†\s*/, '')
    .replace(/】/g, '')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .trim();
  if (!text || /^TBD$/i.test(text)) return null;
  const handMatch = text.match(/\(([LRS])\)/i);
  const bats = handMatch?.[1]?.toUpperCase() || '';
  text = text.replace(/\s*\([LRS]\)\s*/i, ' ').trim();
  const positionMatch = text.match(/\s+(P|C|1B|2B|3B|SS|LF|CF|RF|DH)$/i);
  const position = positionMatch?.[1]?.toUpperCase() || '';
  if (position) text = text.slice(0, -positionMatch[0].length).trim();
  text = text.replace(/^【\d+†/, '').replace(/†.*$/, '').trim();
  if (!isValidProbablePitcherName(text) && !/^[A-Za-zÀ-ÿ'.-]+(?:\s+[A-Za-zÀ-ÿ'.-]+){1,4}$/.test(text)) return null;
  return {
    fullName: text,
    name: lastName(text),
    position,
    bats,
    source: 'mlb-starting-lineups-page',
  };
}

function numberedLineupEntriesFromLine(line) {
  const text = cleanSummary(line);
  if (!/\b\d{1,2}\.\s+/.test(text)) return [];
  return text
    .split(/(?=\b\d{1,2}\.\s+)/g)
    .map((part) => cleanSummary(part))
    .filter((part) => /^\d{1,2}\.\s+/.test(part));
}

function parseStartingLineupBattersFromPage(rawText, teamAbbrev) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const lines = probablePageLines(rawText);
  for (let i = 0; i < lines.length; i += 1) {
    const firstLabelTeam = startingLineupLabelTeam(lines[i]);
    if (!firstLabelTeam) continue;
    const labelTeams = [];
    let cursor = i;
    while (cursor < lines.length) {
      const labelTeam = startingLineupLabelTeam(lines[cursor]);
      if (!labelTeam) break;
      labelTeams.push(labelTeam);
      cursor += 1;
    }
    const teamIndex = labelTeams.findIndex((labelTeam) => sameTeamAbbrev(labelTeam, team));
    if (teamIndex < 0) continue;
    const numbered = [];
    for (let j = cursor; j < Math.min(lines.length, cursor + 40); j += 1) {
      if (startingLineupLabelTeam(lines[j])) break;
      if (/^(Preview|Tickets|Recap|Video|Final|MLB)$/i.test(cleanSummary(lines[j]))) break;
      numbered.push(...numberedLineupEntriesFromLine(lines[j]));
      if (numbered.length >= labelTeams.length * 9) break;
    }
    const teamNumbered = labelTeams.length > 1
      ? numbered.slice(teamIndex * 9, teamIndex * 9 + 9)
      : numbered.slice(0, 9);
    const entries = teamNumbered
      .map(parseStartingLineupBatterLine)
      .filter(Boolean)
      .map((entry, index) => ({ ...entry, slot: index + 1 }));
    if (entries.length >= 7) return entries.slice(0, 9);
  }
  return [];
}

function parseProbablePitchersFromSavantPage(rawText, awayAbbrev, homeAbbrev, targetDate = '') {
  const lines = probablePageLines(rawText);
  const matchupIndex = lines.findIndex((line) => line.includes('@') && lineContainsTeamTerm(line, awayAbbrev) && lineContainsTeamTerm(line, homeAbbrev));
  if (matchupIndex < 0) return null;
  const names = [];
  const end = probablePitcherBlockEnd(lines, matchupIndex, 80);
  for (let i = matchupIndex + 1; i < end; i += 1) {
    const rawLine = cleanSummary(lines[i]);
    const line = probableNameFromLine(lines[i]);
    if (!line || isProbablePageNoiseLine(line)) continue;
    if (/^(career vs|pa\s+\||exit velo|statcast data|throws:|pitch arsenal|pitcher matchup)/i.test(line)) continue;
    if (/^(right|left|rhp|lhp)$/i.test(line)) continue;
    if (/^\d/.test(line) || line.includes('|')) continue;
    if (!/[A-Za-z]/.test(line)) continue;
    const name = line;
    const nearbyLines = lines.slice(i + 1, i + 7).map(cleanSummary).join(' ');
    const looksLikeSavantPitcher = /^#{2,4}\s+/.test(rawLine)
      || /^\[[^\]]+]\([^)]*\)/.test(rawLine)
      || /throws:\s*(right|left)|^(right|left)$/i.test(nearbyLines);
    if (looksLikeSavantPitcher && isValidProbablePitcherName(name) && !names.some((existing) => normalizeNameKey(existing) === normalizeNameKey(name))) {
      names.push(name);
    }
    if (names.length >= 2) break;
  }
  if (!names.length) return null;
  return sanitizeProbablePitchers({
    away: names[0] ? { fullName: names[0], name: lastName(names[0]), source: 'baseball-savant-probables', sourceDate: targetDate } : null,
    home: names[1] ? { fullName: names[1], name: lastName(names[1]), source: 'baseball-savant-probables', sourceDate: targetDate } : null,
  }, null, awayAbbrev, homeAbbrev);
}

function probablePitcherTeamAbbrev(pitcher, game) {
  if (!pitcher) return '';
  const direct = pitcher.teamAbbrev
    || pitcher.team?.abbreviation
    || pitcher.currentTeam?.abbreviation
    || pitcher.currentTeam?.teamCode
    || '';
  if (direct) return canonicalTeamAbbrev(direct);
  const id = Number(pitcher.id ?? pitcher.person?.id);
  const lookupTeam = Number.isFinite(id) ? game?.playerLookup?.[String(id)]?.teamAbbrev : '';
  return lookupTeam ? canonicalTeamAbbrev(lookupTeam) : '';
}

function sanitizeProbablePitcherForTeam(pitcher, teamAbbrev, game) {
  if (!pitcher) return null;
  if (!isValidProbablePitcherName(pitcher.fullName || pitcher.name || '')) return null;
  const pitcherTeam = probablePitcherTeamAbbrev(pitcher, game);
  if (pitcherTeam && !sameTeamAbbrev(pitcherTeam, teamAbbrev)) return null;
  const source = String(pitcher?.source || '');
  const id = Number(pitcher?.id ?? pitcher?.person?.id);
  if (game && (source === 'mlb-probable-page' || source === 'baseball-savant-probables') && !Number.isFinite(id) && !pitcherTeam) return null;
  const normalized = normalizeProbablePitcher(pitcher);
  return normalized;
}

function sanitizeProbablePitchers(probablePitchers = {}, game, awayAbbrev, homeAbbrev) {
  return {
    away: sanitizeProbablePitcherForTeam(probablePitchers?.away, awayAbbrev, game),
    home: sanitizeProbablePitcherForTeam(probablePitchers?.home, homeAbbrev, game),
  };
}

function officialDateForGame(game, fallbackDate = '') {
  return game?.officialDate || String(game?.gameDate || '').slice(0, 10) || fallbackDate || dateInput.value || formatDate(new Date());
}

async function fetchOfficialProbablePitcherForSide(teamAbbrev, opponentAbbrev, targetDate, gamePk) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const opponent = canonicalTeamAbbrev(opponentAbbrev);
  const teamId = TEAM_IDS[team];
  if (!teamId || !targetDate) return null;
  const cacheKey = `${team}:${targetDate}:${gamePk || opponent || ''}`;
  if (officialProbablePitcherCache.has(cacheKey)) return officialProbablePitcherCache.get(cacheKey);

  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/schedule`);
    url.searchParams.set('sportId', '1');
    url.searchParams.set('teamId', String(teamId));
    url.searchParams.set('date', targetDate);
    url.searchParams.set('gameTypes', 'S,E,R');
    url.searchParams.set('hydrate', 'probablePitcher(note)');
    const response = await getJson(url.toString());
    const games = listify(response?.dates).flatMap((day) => listify(day?.games));
    const matched = games.find((candidate) => String(candidate?.gamePk || '') === String(gamePk || ''))
      || games.find((candidate) => {
        const away = scheduleTeamAbbrev(candidate?.teams?.away?.team);
        const home = scheduleTeamAbbrev(candidate?.teams?.home?.team);
        return (sameTeamAbbrev(away, team) && sameTeamAbbrev(home, opponent))
          || (sameTeamAbbrev(home, team) && sameTeamAbbrev(away, opponent));
      })
      || games.find((candidate) => {
        const away = scheduleTeamAbbrev(candidate?.teams?.away?.team);
        const home = scheduleTeamAbbrev(candidate?.teams?.home?.team);
        return sameTeamAbbrev(away, team) || sameTeamAbbrev(home, team);
      });
    const side = sameTeamAbbrev(scheduleTeamAbbrev(matched?.teams?.away?.team), team)
      ? 'away'
      : sameTeamAbbrev(scheduleTeamAbbrev(matched?.teams?.home?.team), team)
        ? 'home'
        : '';
    const probable = normalizeProbablePitcher(side ? matched?.teams?.[side]?.probablePitcher : null, team);
    if (!probable) return null;
    const probableTeam = probablePitcherTeamAbbrev(probable, null);
    if (probableTeam && !sameTeamAbbrev(probableTeam, team)) return null;
    if (!probableTeam && probable.fullName) {
      const verified = await searchMlbPlayerByName(probable.fullName, team);
      if (!verified) return null;
      return { ...probable, ...verified, source: 'statsapi-team-schedule' };
    }
    return { ...probable, source: 'statsapi-team-schedule' };
  })().catch(() => {
    officialProbablePitcherCache.delete(cacheKey);
    return null;
  });

  officialProbablePitcherCache.set(cacheKey, promise);
  return promise;
}

async function searchMlbPlayerByName(fullName, teamAbbrev = '') {
  const name = cleanSummary(fullName);
  if (!name || isPlaceholderProbablePitcherText(name)) return null;
  const team = canonicalTeamAbbrev(teamAbbrev);
  const cacheKey = `${normalizeNameKey(name)}:${team}`;
  if (playerNameSearchCache.has(cacheKey)) return playerNameSearchCache.get(cacheKey);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/search`);
    url.searchParams.set('names', name);
    url.searchParams.set('sportId', '1');
    url.searchParams.set('activeStatus', 'Y');
    const data = await getJson(url.toString());
    const people = listify(data?.people);
    const exact = people.find((person) => normalizeNameKey(person?.fullName) === normalizeNameKey(name))
      || people.find((person) => normalizeNameKey(person?.fullName).includes(normalizeNameKey(name)));
    if (!exact) return null;
    const probable = normalizeProbablePitcher({
      id: exact.id,
      fullName: exact.fullName || name,
      pitchHand: exact.pitchHand || null,
      currentTeam: exact.currentTeam || null,
    });
    const foundTeam = probablePitcherTeamAbbrev(probable, null);
    if (foundTeam && team && !sameTeamAbbrev(foundTeam, team)) return null;
    return { ...probable, teamAbbrev: team };
  })().catch(() => {
    playerNameSearchCache.delete(cacheKey);
    return null;
  });
  playerNameSearchCache.set(cacheKey, promise);
  return promise;
}

async function enrichProbablePitcherFromName(pitcher, teamAbbrev) {
  if (!pitcher?.fullName || pitcher.id || /^TBD$/i.test(pitcher.fullName)) return pitcher;
  const found = await searchMlbPlayerByName(pitcher.fullName, teamAbbrev);
  return found ? { ...pitcher, ...found, source: pitcher.source || found.source } : null;
}

function fetchMlbProbablePageText(url) {
  if (mlbProbablePageTextCache.has(url)) return mlbProbablePageTextCache.get(url);
  const promise = getText(url).catch((error) => {
    mlbProbablePageTextCache.delete(url);
    throw error;
  });
  mlbProbablePageTextCache.set(url, promise);
  return promise;
}

async function fetchMlbProbablePitchersFromPage(game, awayAbbrev, homeAbbrev, targetDate) {
  const away = canonicalTeamAbbrev(awayAbbrev);
  const home = canonicalTeamAbbrev(homeAbbrev);
  const date = targetDate || officialDateForGame(game);
  const key = `${date}:${away}:${home}`;
  if (mlbProbablePageCache.has(key)) return mlbProbablePageCache.get(key);

  const promise = (async () => {
    const awaySlug = TEAM_MLB_SLUGS[away];
    const homeSlug = TEAM_MLB_SLUGS[home];
    const pageUrls = [
      awaySlug ? `https://www.mlb.com/${awaySlug}/roster/probable-pitchers/${date}` : '',
      homeSlug ? `https://www.mlb.com/${homeSlug}/roster/probable-pitchers/${date}` : '',
      awaySlug ? `https://www.mlb.com/${awaySlug}/roster/starting-lineups` : '',
      homeSlug ? `https://www.mlb.com/${homeSlug}/roster/starting-lineups` : '',
      awaySlug ? `https://www.mlb.com/${awaySlug}/roster/probable-pitchers` : '',
      homeSlug ? `https://www.mlb.com/${homeSlug}/roster/probable-pitchers` : '',
      'https://baseballsavant.mlb.com/probable-pitchers',
      `https://www.mlb.com/probable-pitchers/${date}`,
    ].filter(Boolean);
    const readerUrls = pageUrls.map((url) => `https://r.jina.ai/${url}`);
    const texts = await Promise.allSettled([...pageUrls, ...readerUrls].map((url) => fetchMlbProbablePageText(url)));
    let bestParsed = null;
    let bestScore = -1;
    for (const result of texts) {
      if (result.status !== 'fulfilled') continue;
      const parsed = parseStartingLineupPitchersFromPage(result.value, away, home, date)
        || parseProbablePitchersFromSavantPage(result.value, away, home, date)
        || parseProbablePitchersFromPage(result.value, away, home, date);
      if (!parsed?.away && !parsed?.home) continue;
      const score = ['away', 'home'].reduce((total, side) => {
        const name = cleanSummary(parsed?.[side]?.fullName || '');
        return total + (name && !/^TBD$/i.test(name) ? 2 : name ? 1 : 0);
      }, 0);
      if (score > bestScore) {
        bestParsed = parsed;
        bestScore = score;
      }
      if (score >= 4) break;
    }
    if (!bestParsed) return null;
    const [parsedAway, parsedHome] = await Promise.all([
      enrichProbablePitcherFromName(bestParsed.away, away),
      enrichProbablePitcherFromName(bestParsed.home, home),
    ]);
    return sanitizeProbablePitchers({ away: parsedAway, home: parsedHome }, game, away, home);
  })().catch(() => {
    mlbProbablePageCache.delete(key);
    return null;
  });

  mlbProbablePageCache.set(key, promise);
  return promise;
}

async function fetchMlbStartingLineupPitchersForGame(game, awayAbbrev, homeAbbrev, targetDate) {
  const away = canonicalTeamAbbrev(awayAbbrev);
  const home = canonicalTeamAbbrev(homeAbbrev);
  const date = targetDate || officialDateForGame(game);
  const key = `starting:${date}:${away}:${home}`;
  if (mlbProbablePageCache.has(key)) return mlbProbablePageCache.get(key);

  const promise = (async () => {
    const awaySlug = TEAM_MLB_SLUGS[away];
    const homeSlug = TEAM_MLB_SLUGS[home];
    const pageUrls = [
      awaySlug ? `https://www.mlb.com/${awaySlug}/roster/probable-pitchers/${date}` : '',
      homeSlug ? `https://www.mlb.com/${homeSlug}/roster/probable-pitchers/${date}` : '',
      awaySlug ? `https://www.mlb.com/${awaySlug}/roster/starting-lineups` : '',
      homeSlug ? `https://www.mlb.com/${homeSlug}/roster/starting-lineups` : '',
    ].filter(Boolean);
    const readerUrls = pageUrls.map((url) => `https://r.jina.ai/${url}`);
    const texts = await Promise.allSettled([...pageUrls, ...readerUrls].map((url) => fetchMlbProbablePageText(url)));
    for (const result of texts) {
      if (result.status !== 'fulfilled') continue;
      const parsed = parseStartingLineupPitchersFromPage(result.value, away, home, date);
      if (!parsed?.away && !parsed?.home) continue;
      const [parsedAway, parsedHome] = await Promise.all([
        enrichProbablePitcherFromName(parsed.away, away),
        enrichProbablePitcherFromName(parsed.home, home),
      ]);
      return sanitizeProbablePitchers({ away: parsedAway, home: parsedHome }, game, away, home);
    }
    return null;
  })().catch(() => {
    mlbProbablePageCache.delete(key);
    return null;
  });

  mlbProbablePageCache.set(key, promise);
  return promise;
}

function findLineupLookupProfile(game, teamAbbrev, parsedEntry) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const nameKey = normalizeNameKey(parsedEntry?.fullName || parsedEntry?.name || '');
  if (!nameKey) return null;
  const pool = Object.values(game?.playerLookup || {})
    .filter((player) => sameTeamAbbrev(player?.teamAbbrev, team));
  return pool.find((player) => normalizeNameKey(player?.fullName || player?.name || '') === nameKey)
    || pool.find((player) => {
      const full = normalizeNameKey(player?.fullName || '');
      return full && (full.includes(nameKey) || nameKey.includes(full));
    })
    || pool.find((player) => normalizeNameKey(lastName(player?.fullName || player?.name || '')) === normalizeNameKey(lastName(parsedEntry?.fullName || parsedEntry?.name || '')))
    || null;
}

function enrichMlbStartingLineupEntries(game, teamAbbrev, entries = []) {
  return entries.map((entry, index) => {
    const profile = findLineupLookupProfile(game, teamAbbrev, entry);
    return {
      ...(profile || {}),
      ...entry,
      id: profile?.id ?? entry?.id ?? null,
      fullName: profile?.fullName || entry.fullName,
      name: lastName(profile?.fullName || entry.fullName),
      position: entry.position || profile?.position || '',
      bats: entry.bats || profile?.bats || '',
      batting: profile?.batting || entry?.batting || {},
      slot: index + 1,
      today: '0-0',
      isActive: false,
      isNextUp: false,
      source: entry.source || 'mlb-starting-lineups-page',
    };
  });
}

async function fetchPreviousCompletedLineupFromStatsApi(game, side) {
  if (!game || !shouldPreferProbablePitcher(game)) return [];
  const team = canonicalTeamAbbrev(side === 'away' ? game.away : game.home);
  const teamId = TEAM_IDS[team];
  const date = officialDateForGame(game);
  if (!teamId || !date) return [];
  const key = `previous:${date}:${team}`;
  if (mlbPreviousLineupCache.has(key)) return mlbPreviousLineupCache.get(key);

  const promise = (async () => {
    const today = formatDate(new Date());
    const requestedPrevious = addDaysToDateValue(date, -1);
    const endDate = requestedPrevious > today ? today : requestedPrevious;
    const startDate = addDaysToDateValue(endDate, -45);
    const url = new URL(`${MLB_API_BASE}/schedule`);
    url.searchParams.set('sportId', '1');
    url.searchParams.set('teamId', String(teamId));
    url.searchParams.set('startDate', startDate);
    url.searchParams.set('endDate', endDate);
    url.searchParams.set('gameType', 'S,E,R');
    url.searchParams.set('gameTypes', 'S,E,R');
    const schedule = await getJson(url.toString());
    const games = listify(schedule?.dates)
      .flatMap((day) => listify(day?.games))
      .filter((candidate) => {
        const state = String(candidate?.status?.detailedState || candidate?.status?.abstractGameState || candidate?.status?.codedGameState || '');
        return /final|game over|completed/i.test(state) || String(candidate?.status?.abstractGameState || '').toLowerCase() === 'final';
      })
      .sort((a, b) => String(b?.gameDate || '').localeCompare(String(a?.gameDate || '')));
    for (const previousGame of games) {
      const previousSide = sameTeamAbbrev(scheduleTeamAbbrev(previousGame?.teams?.away?.team), team)
        ? 'away'
        : sameTeamAbbrev(scheduleTeamAbbrev(previousGame?.teams?.home?.team), team)
          ? 'home'
          : '';
      if (!previousSide) continue;
      const boxscore = await getGameBoxscore(previousGame.gamePk).catch(() => null);
      const teamBox = boxscore?.teams?.[previousSide] || {};
      const lineup = buildStartingLineupFromBoxscore(teamBox.players || {}, teamBox.battingOrder || teamBox.batters || []);
      if (lineup.length >= 7 && !lineupLooksAlphabetical(lineup)) {
        return enrichMlbStartingLineupEntries(game, team, lineup);
      }
    }
    return [];
  })().catch(() => {
    mlbPreviousLineupCache.delete(key);
    return [];
  });

  mlbPreviousLineupCache.set(key, promise);
  return promise;
}

async function fetchMlbStartingLineupFallback(game, side) {
  if (!game || !shouldPreferProbablePitcher(game)) return [];
  if (isFutureGameDate(game)) return fetchPreviousCompletedLineupFromStatsApi(game, side);
  const team = canonicalTeamAbbrev(side === 'away' ? game.away : game.home);
  const slug = TEAM_MLB_SLUGS[team];
  if (!slug) return [];
  const date = officialDateForGame(game);
  const key = `batters:${date}:${team}:${game?.gamePk || ''}`;
  if (mlbStartingLineupPageCache.has(key)) return mlbStartingLineupPageCache.get(key);

  const promise = (async () => {
    const sourceUrl = `https://www.mlb.com/${slug}/roster/starting-lineups`;
    const pageUrls = [
      sourceUrl,
      `https://r.jina.ai/${sourceUrl}`,
    ];
    const texts = await Promise.allSettled(pageUrls.map((url) => fetchMlbProbablePageText(url)));
    for (const result of texts) {
      if (result.status !== 'fulfilled') continue;
      const parsed = parseStartingLineupBattersFromPage(result.value, team);
      if (parsed.length >= 7 && !lineupLooksAlphabetical(parsed)) {
        return enrichMlbStartingLineupEntries(game, team, parsed);
      }
    }
    return fetchPreviousCompletedLineupFromStatsApi(game, side);
  })().catch(() => {
    mlbStartingLineupPageCache.delete(key);
    return [];
  });

  mlbStartingLineupPageCache.set(key, promise);
  return promise;
}

async function fetchOfficialProbablePitchersForGame(game, awayAbbrev, homeAbbrev, targetDate) {
  let probables = null;
  if (shouldPreferProbablePitcher(game)) {
    const [startingLineupProbables, pageProbables] = await Promise.all([
      fetchMlbStartingLineupPitchersForGame(game, awayAbbrev, homeAbbrev, targetDate).catch(() => null),
      fetchMlbProbablePitchersFromPage(game, awayAbbrev, homeAbbrev, targetDate).catch(() => null),
    ]);
    probables = mergeProbablePitchers(startingLineupProbables || {}, pageProbables || {}, game, awayAbbrev, homeAbbrev);
    return fillPotentialStartersForTbdProbables(probables, game, awayAbbrev, homeAbbrev, targetDate);
  }
  const pageProbables = await fetchMlbProbablePitchersFromPage(game, awayAbbrev, homeAbbrev, targetDate).catch(() => null);
  const [away, home] = await Promise.all([
    fetchOfficialProbablePitcherForSide(awayAbbrev, homeAbbrev, targetDate, game?.gamePk),
    fetchOfficialProbablePitcherForSide(homeAbbrev, awayAbbrev, targetDate, game?.gamePk),
  ]);
  probables = mergeProbablePitchers({ away, home }, pageProbables, game, awayAbbrev, homeAbbrev);
  return fillPotentialStartersForTbdProbables(probables, game, awayAbbrev, homeAbbrev, targetDate);
}

function mergeProbablePitchers(base, official, game, awayAbbrev, homeAbbrev) {
  return sanitizeProbablePitchers({
    away: official?.away && (isAuthoritativeProbableSource(official.away) || !base?.away || !isAuthoritativeProbableSource(base.away))
      ? official.away
      : base?.away || official?.away || null,
    home: official?.home && (isAuthoritativeProbableSource(official.home) || !base?.home || !isAuthoritativeProbableSource(base.home))
      ? official.home
      : base?.home || official?.home || null,
  }, game, awayAbbrev, homeAbbrev);
}

function probablePitcherIsTbd(pitcher) {
  return isPlaceholderProbablePitcherText(pitcher?.fullName || pitcher?.name || '');
}

function probablePitchersNeedFallback(probables = {}) {
  return ['away', 'home'].some((side) => {
    const pitcher = probables?.[side] || null;
    return !pitcher || probablePitcherIsTbd(pitcher);
  });
}

function pitcherMemoryStorageKey(playerId, targetDate) {
  return `${PITCHER_START_MEMORY_KEY}:${Number(playerId) || 0}:${seasonForDate(targetDate)}:${targetDate}`;
}

function dateDiffDays(fromDate, toDate) {
  const from = parseLocalDateValue(fromDate);
  const to = parseLocalDateValue(toDate);
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86400000));
}

async function pitcherLastPitchedMemory(playerId, targetDate, game) {
  const id = Number(playerId);
  const date = calendarDateOnly(targetDate || officialDateForGame(game));
  if (!Number.isFinite(id) || id <= 0 || !date) return null;
  const cacheKey = `${id}:${date}:last-pitched`;
  if (pitcherLastPitchedCache.has(cacheKey)) return pitcherLastPitchedCache.get(cacheKey);

  const promise = (async () => {
    const storageKey = pitcherMemoryStorageKey(id, date);
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (stored?.targetDate === date && stored?.playerId === id) return stored;
    } catch {}

    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'pitching');
    url.searchParams.set('season', String(seasonForDate(date)));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    const pitchingSplits = listify(response?.stats?.[0]?.splits)
      .filter((split) => String(split?.date || '') < date)
      .filter((split) => inningsToOuts(split?.stat?.inningsPitched) > 0
        || statNumber(split?.stat?.numberOfPitches ?? split?.stat?.pitchesThrown) > 0
        || statNumber(split?.stat?.battersFaced) > 0)
      .sort((a, b) => String(b?.date || '').localeCompare(String(a?.date || '')));
    const lastSplit = pitchingSplits[0];
    const lastStarterWorkloadSplit = pitchingSplits
      .find((split) => statNumber(split?.stat?.gamesStarted) > 0 || inningsToOuts(split?.stat?.inningsPitched) >= 6)
      || lastSplit;
    const memory = {
      playerId: id,
      targetDate: date,
      lastPitchedDate: lastSplit?.date || '',
      daysSinceLastPitched: lastSplit?.date ? dateDiffDays(lastSplit.date, date) : null,
      lastStarterWorkloadDate: lastStarterWorkloadSplit?.date || '',
      daysSinceStarterWorkload: lastStarterWorkloadSplit?.date ? dateDiffDays(lastStarterWorkloadSplit.date, date) : null,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(memory));
    } catch {}
    return memory;
  })().catch(() => null);

  pitcherLastPitchedCache.set(cacheKey, promise);
  return promise;
}

async function potentialStarterFromRotationMemory(teamAbbrev, game, targetDate, excludedPitcherIds = new Set()) {
  const date = calendarDateOnly(targetDate || officialDateForGame(game));
  const excludedIds = new Set([...excludedPitcherIds].map((id) => String(Number(id))).filter((id) => id !== 'NaN'));
  const profiles = await fetchTeamPitcherRosterProfiles(teamAbbrev, game).catch(() => []);
  const healthyProfiles = profiles.filter(isHealthyPitcherCandidate);
  const activeStarters = healthyProfiles
    .filter((profile) => isStarterLikePitcher(profile) || pitcherGamesStarted(profile) > 0)
    .sort((a, b) => {
      const starterDiff = Number(isStarterLikePitcher(b)) - Number(isStarterLikePitcher(a));
      if (starterDiff) return starterDiff;
      return pitcherGamesStarted(b) - pitcherGamesStarted(a)
        || pitcherGamesPlayed(a) - pitcherGamesPlayed(b)
        || String(a.fullName || '').localeCompare(String(b.fullName || ''));
    });
  const candidates = activeStarters.length
    ? activeStarters
    : healthyProfiles
      .filter((profile) => String(profile?.position || '').toUpperCase() === 'P')
      .sort((a, b) => pitcherGamesPlayed(b) - pitcherGamesPlayed(a))
      .slice(0, 8);
  const eligibleCandidates = candidates.filter((profile) => !excludedIds.has(String(Number(profile?.id))));
  if (!eligibleCandidates.length) return null;
  const memories = await mapWithConcurrency(eligibleCandidates, 5, async (profile) => {
    const memory = await pitcherLastPitchedMemory(profile.id, date, game);
    return { profile, memory };
  });
  const ranked = memories
    .filter((entry) => Number.isFinite(Number(entry?.memory?.daysSinceStarterWorkload ?? entry?.memory?.daysSinceLastPitched)))
    .sort((a, b) => {
      const bRest = Number(b.memory.daysSinceStarterWorkload ?? b.memory.daysSinceLastPitched);
      const aRest = Number(a.memory.daysSinceStarterWorkload ?? a.memory.daysSinceLastPitched);
      const dayDiff = bRest - aRest;
      if (dayDiff) return dayDiff;
      return pitcherGamesStarted(b.profile) - pitcherGamesStarted(a.profile)
        || String(a.profile?.fullName || '').localeCompare(String(b.profile?.fullName || ''));
    });
  const selected = ranked[0] || memories
    .filter((entry) => entry?.profile)
    .sort((a, b) => pitcherGamesStarted(b.profile) - pitcherGamesStarted(a.profile))[0];
  if (!selected?.profile) return null;
  const profile = selected.profile;
  return normalizeProbablePitcher({
    ...profile,
    id: profile.id,
    fullName: profile.fullName || profile.name || 'Pitcher',
    name: lastName(profile.fullName || profile.name || 'Pitcher'),
    source: 'rotation-memory',
    sourceDate: date,
    isPotentialStarter: true,
    lastPitchedDate: selected.memory?.lastPitchedDate || '',
    daysSinceLastPitched: selected.memory?.daysSinceLastPitched ?? null,
    lastStarterWorkloadDate: selected.memory?.lastStarterWorkloadDate || '',
    daysSinceStarterWorkload: selected.memory?.daysSinceStarterWorkload ?? null,
    teamAbbrev: canonicalTeamAbbrev(teamAbbrev),
  }, teamAbbrev);
}

async function fillPotentialStartersForTbdProbables(probables, game, awayAbbrev, homeAbbrev, targetDate) {
  const sanitized = sanitizeProbablePitchers(probables || {}, game, awayAbbrev, homeAbbrev);
  const date = calendarDateOnly(targetDate || officialDateForGame(game));
  const [yesterday] = recentCalendarDateWindow(date, 2);
  const sides = [
    ['away', awayAbbrev],
    ['home', homeAbbrev],
  ];
  const replacements = await Promise.all(sides.map(async ([side, team]) => {
    const pitcher = sanitized?.[side] || null;
    const pitcherId = Number(pitcher?.id);
    const usedYesterday = !probablePitcherIsTbd(pitcher)
      && yesterday
      && yesterday !== date
      && Number.isFinite(pitcherId)
      && await pitcherUsedOnDate(pitcherId, yesterday, game).catch(() => false);
    if (pitcher && !probablePitcherIsTbd(pitcher) && !usedYesterday) return pitcher;
    const excludedIds = usedYesterday && Number.isFinite(pitcherId) ? new Set([pitcherId]) : new Set();
    const potential = await potentialStarterFromRotationMemory(team, game, targetDate, excludedIds).catch(() => null);
    return potential || sanitized?.[side] || null;
  }));
  return sanitizeProbablePitchers({ away: replacements[0], home: replacements[1] }, game, awayAbbrev, homeAbbrev);
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

function gameIsFinalForTeamRecord(game) {
  const state = String(game?.status?.abstractGameState || '').toLowerCase();
  const detailed = String(game?.status?.detailedState || '').toLowerCase();
  return state === 'final' || detailed.includes('final');
}

function teamWonScheduleGame(game, teamAbbrev) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const away = scheduleTeamAbbrev(game?.teams?.away?.team);
  const home = scheduleTeamAbbrev(game?.teams?.home?.team);
  const awayScore = Number(game?.teams?.away?.score);
  const homeScore = Number(game?.teams?.home?.score);
  if (team === away) {
    if (typeof game?.teams?.away?.isWinner === 'boolean') return game.teams.away.isWinner;
    return Number.isFinite(awayScore) && Number.isFinite(homeScore) ? awayScore > homeScore : null;
  }
  if (team === home) {
    if (typeof game?.teams?.home?.isWinner === 'boolean') return game.teams.home.isWinner;
    return Number.isFinite(awayScore) && Number.isFinite(homeScore) ? homeScore > awayScore : null;
  }
  return null;
}

function teamScoreLineForGame(game, teamAbbrev) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const away = canonicalTeamAbbrev(game?.away || scheduleTeamAbbrev(game?.teams?.away?.team));
  const home = canonicalTeamAbbrev(game?.home || scheduleTeamAbbrev(game?.teams?.home?.team));
  const awayScore = Number(game?.awayScore ?? game?.teams?.away?.score);
  const homeScore = Number(game?.homeScore ?? game?.teams?.home?.score);
  if (!Number.isFinite(awayScore) || !Number.isFinite(homeScore)) return null;
  if (team === away) return { runsFor: awayScore, runsAgainst: homeScore };
  if (team === home) return { runsFor: homeScore, runsAgainst: awayScore };
  return null;
}

function teamWonStoredGame(game, teamAbbrev) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const away = canonicalTeamAbbrev(game?.away || scheduleTeamAbbrev(game?.teams?.away?.team));
  const home = canonicalTeamAbbrev(game?.home || scheduleTeamAbbrev(game?.teams?.home?.team));
  const scheduleResult = teamWonScheduleGame(game, team);
  if (typeof scheduleResult === 'boolean') return scheduleResult;
  const awayScore = Number(game?.awayScore ?? game?.teams?.away?.score);
  const homeScore = Number(game?.homeScore ?? game?.teams?.home?.score);
  if (!Number.isFinite(awayScore) || !Number.isFinite(homeScore)) return null;
  if (team === away) return awayScore > homeScore;
  if (team === home) return homeScore > awayScore;
  return null;
}

function lastSevenSummaryFromGames(games = [], teamAbbrev = '') {
  return recentTeamSummaryFromGames(games, teamAbbrev, 7);
}

function recentTeamSummaryFromGames(games = [], teamAbbrev = '', gameLimit = 7) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const limit = normalizeLineupStatWindow(gameLimit);
  const finished = listify(games)
    .filter((game) => {
      const away = canonicalTeamAbbrev(game?.away || scheduleTeamAbbrev(game?.teams?.away?.team));
      const home = canonicalTeamAbbrev(game?.home || scheduleTeamAbbrev(game?.teams?.home?.team));
      return team && (away === team || home === team) && (isCompletedGameCard(game) || gameIsFinalForTeamRecord(game));
    })
    .sort((a, b) => {
      const dateCompare = String(b?.officialDate || b?.gameDate || '').localeCompare(String(a?.officialDate || a?.gameDate || ''));
      if (dateCompare) return dateCompare;
      return Number(b?.gamePk || 0) - Number(a?.gamePk || 0);
    })
    .slice(0, limit);
  let wins = 0;
  let losses = 0;
  let runsFor = 0;
  let runsAgainst = 0;
  for (const game of finished) {
    const won = teamWonStoredGame(game, team);
    if (won === true) wins += 1;
    else if (won === false) losses += 1;
    const line = teamScoreLineForGame(game, team);
    if (line) {
      runsFor += line.runsFor;
      runsAgainst += line.runsAgainst;
    }
  }
  const gamesCount = finished.length;
  if (gamesCount > 0 && wins + losses < gamesCount) losses += gamesCount - wins - losses;
  return gamesCount > 0 ? { wins, losses, games: gamesCount, requestedGames: limit, runsFor, runsAgainst } : null;
}

function formatLastSevenSummary(summary, options = {}) {
  return formatRecentTeamSummary(summary, options);
}

function formatRecentTeamSummary(summary, options = {}) {
  if (!summary || !(Number(summary.wins) + Number(summary.losses) > 0)) return '';
  const requestedGames = normalizeLineupStatWindow(options.gameLimit || summary.requestedGames || summary.games || 7);
  const label = options.lockLabel ? `L${requestedGames}` : options.partial || summary.games < requestedGames ? `L${summary.games}` : `L${requestedGames}`;
  const hasRuns = Number.isFinite(Number(summary.runsFor)) && Number.isFinite(Number(summary.runsAgainst));
  return `${label} ${summary.wins}-${summary.losses}${hasRuns ? ` | RF ${summary.runsFor} RA ${summary.runsAgainst}` : ''}`;
}

function formatLineupTeamStatus(record = '', stats = null) {
  const parts = [cleanSummary(record)];
  if (stats?.avg) parts.push(`AVG ${stats.avg}`);
  if (stats?.era) parts.push(`ERA ${stats.era}`);
  return parts.filter(Boolean).join(' | ');
}

async function getLineupTeamSeasonStats(teamAbbrev, date) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const rows = await getTeamStatsRows(seasonForDate(date || dateInput.value || formatDate(new Date())));
  const row = rows.find((entry) => sameTeamAbbrev(entry.abbrev, team));
  if (!row) return null;
  return { avg: cleanSummary(row.avg), era: cleanSummary(row.era) };
}

function teamBoxSideForGame(game, teamAbbrev) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const away = scheduleTeamAbbrev(game?.teams?.away?.team) || canonicalTeamAbbrev(game?.away);
  const home = scheduleTeamAbbrev(game?.teams?.home?.team) || canonicalTeamAbbrev(game?.home);
  if (sameTeamAbbrev(away, team)) return 'away';
  if (sameTeamAbbrev(home, team)) return 'home';
  return '';
}

function aggregateRecentTeamBoxStats(aggregate, teamBox = {}) {
  const batting = teamBox?.teamStats?.batting || {};
  const pitching = teamBox?.teamStats?.pitching || {};
  aggregate.atBats += statNumber(batting.atBats);
  aggregate.hits += statNumber(batting.hits);
  aggregate.pitchingOuts += inningsToOuts(pitching.inningsPitched);
  aggregate.earnedRuns += statNumber(pitching.earnedRuns);
}

async function getLineupTeamRecentStats(teamAbbrev, date, gameLimit = 7) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const teamId = TEAM_IDS[team];
  const selectedDate = String(date || dateInput.value || formatDate(new Date()));
  const limit = normalizeLineupStatWindow(gameLimit);
  if (!teamId || !selectedDate) return { recordText: '', avg: '', era: '' };
  const cacheKey = `${team}:${selectedDate}:recent-form:${limit}:v2`;
  if (teamRecentFormCache.has(cacheKey)) return teamRecentFormCache.get(cacheKey);

  const promise = (async () => {
    const localGamesByPk = new Map();
    for (const day of recentCalendarDateWindow(selectedDate, 120)) {
      for (const archived of getArchivedGames(day)) {
        localGamesByPk.set(String(archived?.gamePk || `${archived?.away}@${archived?.home}:${day}`), archived);
      }
    }
    for (const cached of getCachedGames()) {
      localGamesByPk.set(String(cached?.gamePk || `${cached?.away}@${cached?.home}:cached`), cached);
    }

    const url = new URL(`${MLB_API_BASE}/schedule`);
    url.searchParams.set('sportId', '1');
    url.searchParams.set('teamId', String(teamId));
    url.searchParams.set('startDate', addDaysToDateValue(selectedDate, -120));
    url.searchParams.set('endDate', selectedDate);
    url.searchParams.set('gameTypes', 'S,E,R');
    const response = await getJson(url.toString());
    const finished = listify(response?.dates)
      .flatMap((day) => listify(day?.games))
      .filter(gameIsFinalForTeamRecord)
      .sort((a, b) => {
        const dateCompare = String(b?.officialDate || b?.gameDate || '').localeCompare(String(a?.officialDate || a?.gameDate || ''));
        if (dateCompare) return dateCompare;
        return Number(b?.gamePk || 0) - Number(a?.gamePk || 0);
      })
      .slice(0, limit);
    const summarySource = finished.length ? finished : [...localGamesByPk.values()];
    const summary = recentTeamSummaryFromGames(summarySource, team, limit);
    const aggregate = { atBats: 0, hits: 0, pitchingOuts: 0, earnedRuns: 0 };

    await mapWithConcurrency(finished, 3, async (game) => {
      const side = teamBoxSideForGame(game, team);
      if (!side || !game?.gamePk) return;
      const boxscore = await getGameBoxscore(game.gamePk).catch(() => null);
      aggregateRecentTeamBoxStats(aggregate, boxscore?.teams?.[side] || {});
    });

    return {
      recordText: summary ? formatRecentTeamSummary(summary, { gameLimit: limit, lockLabel: true }) : '',
      avg: aggregate.atBats > 0 ? formatRateValue(aggregate.hits / aggregate.atBats, 3, true) : '',
      era: aggregate.pitchingOuts > 0 ? formatRateValue((aggregate.earnedRuns * 27) / aggregate.pitchingOuts, 2, false) : '',
    };
  })().catch(async () => {
    const fallbackRecord = await getTeamLastSevenRecord(team, selectedDate).catch(() => '');
    return { recordText: fallbackRecord, avg: '', era: '' };
  });

  teamRecentFormCache.set(cacheKey, promise);
  return promise;
}

function formatLastSevenRecordFromGames(games = [], teamAbbrev = '', options = {}) {
  const summary = lastSevenSummaryFromGames(games, teamAbbrev);
  if (!summary) return '';
  if (options.requireSeven && summary.games < 7) return '';
  return formatLastSevenSummary(summary, { partial: summary.games < 7 });
}

function localTeamLastSevenRecord(teamAbbrev, date) {
  const selectedDate = String(date || dateInput.value || formatDate(new Date()));
  const gamesByPk = new Map();
  for (const day of recentCalendarDateWindow(selectedDate, 30)) {
    for (const game of getArchivedGames(day)) {
      if (String(game?.officialDate || game?.gameDate || '').slice(0, 10) > selectedDate) continue;
      gamesByPk.set(String(game?.gamePk || `${game?.away}@${game?.home}:${day}`), game);
    }
  }
  for (const game of getCachedGames()) {
    if (String(game?.officialDate || game?.gameDate || '').slice(0, 10) > selectedDate) continue;
    gamesByPk.set(String(game?.gamePk || `${game?.away}@${game?.home}:cached`), game);
  }
  return formatLastSevenRecordFromGames([...gamesByPk.values()], teamAbbrev, { requireSeven: true });
}

async function getTeamStandingRecordOnDate(teamAbbrev, date) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const teamId = TEAM_IDS[team];
  const selectedDate = String(date || dateInput.value || formatDate(new Date()));
  if (!teamId || !selectedDate) return null;
  const cacheKey = `${team}:${selectedDate}:standing-record:v1`;
  if (teamStandingRecordCache.has(cacheKey)) return teamStandingRecordCache.get(cacheKey);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/standings`);
    url.searchParams.set('leagueId', '103,104');
    url.searchParams.set('season', String(seasonForDate(selectedDate)));
    url.searchParams.set('standingsTypes', 'regularSeason');
    url.searchParams.set('date', selectedDate);
    const response = await getJson(url.toString());
    for (const record of listify(response?.records)) {
      for (const teamRecord of listify(record?.teamRecords)) {
        const recordTeamId = Number(teamRecord?.team?.id);
        const recordTeamAbbrev = canonicalTeamAbbrev(teamRecord?.team?.abbreviation || teamRecord?.team?.teamCode || '');
        if (recordTeamId !== teamId && recordTeamAbbrev !== team) continue;
        const wins = Number(teamRecord?.leagueRecord?.wins ?? teamRecord?.record?.wins ?? teamRecord?.wins);
        const losses = Number(teamRecord?.leagueRecord?.losses ?? teamRecord?.record?.losses ?? teamRecord?.losses);
        if (!Number.isFinite(wins) || !Number.isFinite(losses)) return null;
        return { wins, losses, games: wins + losses };
      }
    }
    return null;
  })().catch((error) => {
    teamStandingRecordCache.delete(cacheKey);
    throw error;
  });
  teamStandingRecordCache.set(cacheKey, promise);
  return promise;
}

async function standingDeltaLastSevenRecord(teamAbbrev, date) {
  const selectedDate = String(date || dateInput.value || formatDate(new Date()));
  const current = await getTeamStandingRecordOnDate(teamAbbrev, selectedDate).catch(() => null);
  if (!current?.games) return '';
  const lookbackDates = recentCalendarDateWindow(addDaysToDateValue(selectedDate, -1), 45).reverse();
  let best = null;
  for (const priorDate of lookbackDates) {
    const prior = await getTeamStandingRecordOnDate(teamAbbrev, priorDate).catch(() => null);
    if (!prior) continue;
    const played = current.games - prior.games;
    if (played <= 0) continue;
    best = { prior, played };
    if (played >= 7) break;
  }
  if (!best) return '';
  const wins = Math.max(0, current.wins - best.prior.wins);
  const losses = Math.max(0, current.losses - best.prior.losses);
  if (wins + losses <= 0) return '';
  return `L${wins + losses} ${wins}-${losses}`;
}

async function getTeamLastSevenRecord(teamAbbrev, date) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const teamId = TEAM_IDS[team];
  const selectedDate = String(date || dateInput.value || formatDate(new Date()));
  if (!teamId || !selectedDate) return '';
  const cacheKey = `${team}:${selectedDate}:last7:v3`;
  if (teamLastSevenRecordCache.has(cacheKey)) return teamLastSevenRecordCache.get(cacheKey);

  const promise = (async () => {
    const localRecord = localTeamLastSevenRecord(team, selectedDate);
    if (localRecord) return localRecord;
    const url = new URL(`${MLB_API_BASE}/schedule`);
    url.searchParams.set('sportId', '1');
    url.searchParams.set('teamId', String(teamId));
    url.searchParams.set('startDate', addDaysToDateValue(selectedDate, -30));
    url.searchParams.set('endDate', selectedDate);
    const response = await getJson(url.toString());
    const finished = listify(response?.dates)
      .flatMap((day) => listify(day?.games))
      .filter(gameIsFinalForTeamRecord)
      .sort((a, b) => {
        const dateCompare = String(b?.officialDate || b?.gameDate || '').localeCompare(String(a?.officialDate || a?.gameDate || ''));
        if (dateCompare) return dateCompare;
        return Number(b?.gamePk || 0) - Number(a?.gamePk || 0);
      })
      .slice(0, 7);
    if (!finished.length) return standingDeltaLastSevenRecord(team, selectedDate);
    const summary = lastSevenSummaryFromGames(finished, team);
    return summary ? formatLastSevenSummary(summary, { partial: summary.games < 7 }) : standingDeltaLastSevenRecord(team, selectedDate);
  })().catch((error) => {
    teamLastSevenRecordCache.delete(cacheKey);
    return localTeamLastSevenRecord(team, selectedDate) || standingDeltaLastSevenRecord(team, selectedDate);
  });
  teamLastSevenRecordCache.set(cacheKey, promise);
  return promise;
}

async function hydrateTeamLastSevenRecords(cards = [], date = dateInput.value || formatDate(new Date())) {
  const teams = [...new Set(
    listify(cards)
      .flatMap((card) => [card?.away, card?.home])
      .map(canonicalTeamAbbrev)
      .filter(Boolean),
  )];
  if (!teams.length) return cards;
  const records = new Map(await Promise.all(
    teams.map(async (team) => [team, await getTeamLastSevenRecord(team, date).catch(() => '')]),
  ));
  for (const card of cards) {
    card.awayLastSevenRecord = records.get(canonicalTeamAbbrev(card?.away)) || card.awayLastSevenRecord || '';
    card.homeLastSevenRecord = records.get(canonicalTeamAbbrev(card?.home)) || card.homeLastSevenRecord || '';
  }
  return cards;
}

function renderTeamLastSevenBadge(streakEl, record) {
  if (!streakEl) return;
  let badge = streakEl.parentElement?.querySelector?.('.lineup-team-last7') || null;
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'lineup-team-last7';
    streakEl.insertAdjacentElement('afterend', badge);
  }
  const clean = cleanSummary(record);
  badge.textContent = clean;
  badge.hidden = !clean;
}

function renderLineupStatusBadges(streakEl, streak, lastSevenRecord) {
  renderTeamStreakBadge(streakEl, streak);
  renderTeamLastSevenBadge(streakEl, cleanSummary(lastSevenRecord));
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
    if (!card || isPostponedGameCard(card)) continue;
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
  return sortGameCardsChronologically(deduped);
}

function isPostponedGameStatus(game) {
  const text = [
    game?.status?.detailedState,
    game?.status?.abstractGameState,
    game?.status,
    game?.inning,
    game?.inningShort,
  ].map((value) => String(value || '').toLowerCase()).join(' ');
  return /postpon/.test(text);
}

function isPostponedGameCard(card) {
  return isPostponedGameStatus(card);
}

function gameCardSortTime(card) {
  const parsed = Date.parse(card?.gameDate || card?.officialDate || '');
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

function sortGameCardsChronologically(cards = []) {
  return [...(Array.isArray(cards) ? cards : [])].sort((a, b) => {
    const timeDiff = gameCardSortTime(a) - gameCardSortTime(b);
    if (timeDiff) return timeDiff;
    const gameNumberDiff = normalizedGameNumber(a?.gameNumber) - normalizedGameNumber(b?.gameNumber);
    if (gameNumberDiff) return gameNumberDiff;
    return String(a?.away || '').localeCompare(String(b?.away || '')) || String(a?.home || '').localeCompare(String(b?.home || ''));
  });
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

function gameStartTimeText(game) {
  const value = game?.gameDate || game?.gameData?.datetime?.dateTime || '';
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return 'Start time pending';
  return `${estTime(value)} EST`;
}

function gameHeaderTimeText(game) {
  const time = gameStartTimeText(game);
  const status = cleanSummary(game?.status || game?.inning || '');
  const delayed = /delay|delayed|postponed|suspended/i.test(status);
  return delayed ? `${time} | ${status}` : time;
}

function lineupModalMatchupText(game) {
  return `${displayTeamAbbrev(game?.away)} @ ${displayTeamAbbrev(game?.home)} | ${gameHeaderTimeText(game)}`;
}

function defaultPlayText(game) {
  return shouldPreferProbablePitcher(game) ? gameStartTimeText(game) : 'Awaiting first pitch';
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

async function getText(url) {
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
        return await r.text();
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
        division: team?.division?.name || 'MLB',
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
    position: entry.position || '',
    gamePk: gamePk ?? entry.gamePk ?? null,
    summaryText: leaderSummaryText(category, entry.stat),
    recentFormText: getIndexedRecentForm(entry.playerId, category.group, dateInput.value || formatDate(new Date())),
  }));
}

function normalizeLeaderPosition(value) {
  const pos = String(value || '').toUpperCase();
  if (['LF', 'CF', 'RF'].includes(pos)) return pos;
  if (pos === 'MIF' || pos === 'MI' || pos === 'MIDDLE IF') return 'MIF';
  if (pos === 'OF') return 'OF';
  return pos;
}

function selectedLeaderPosition() {
  return normalizeLeaderPosition(leadersPositionSelectEl?.value || '');
}

function leaderPositionFilterLabel(position = selectedLeaderPosition()) {
  const normalized = normalizeLeaderPosition(position);
  if (normalized === 'MIF') return '2B, SS';
  if (normalized === 'OF') return 'LF, CF, RF';
  return normalized || '';
}

function leaderMatchesPosition(leader, selectedPosition) {
  if (!selectedPosition) return true;
  const pos = normalizeLeaderPosition(leader?.position || '');
  if (!pos) return false;
  if (selectedPosition === 'MIF') return ['2B', 'SS'].includes(pos);
  if (selectedPosition === 'OF') return ['OF', 'LF', 'CF', 'RF'].includes(pos);
  return pos === selectedPosition;
}

function filterLeaderMapByPosition(leaderMap) {
  const position = selectedLeaderPosition();
  if (!position) return leaderMap;
  const filtered = new Map();
  for (const [key, leaders] of leaderMap.entries()) {
    filtered.set(key, (leaders || []).filter((leader) => leaderMatchesPosition(leader, position)));
  }
  return filtered;
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
            position: normalizeLeaderPosition(player?.primaryPosition?.abbreviation || player?.primaryPosition?.code || player?.position?.abbreviation || ''),
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
  const position = selectedLeaderPosition();
  const filteredRaw = position ? raw.filter((entry) => leaderMatchesPosition(entry, position)) : raw;
  const limited = Number.isFinite(rowLimit) ? filteredRaw.slice(0, Math.max(0, rowLimit)) : filteredRaw;
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

async function getPlayerHandedBattingSplit(playerId, sitCode, season = seasonForDate(dateInput.value || formatDate(new Date()))) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0 || !sitCode) return null;
  const cacheKey = `${id}:${season}:${sitCode}`;
  if (playerHandedSplitsCache.has(cacheKey)) return playerHandedSplitsCache.get(cacheKey);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'statSplits');
    url.searchParams.set('group', 'hitting');
    url.searchParams.set('season', String(season));
    url.searchParams.set('sitCodes', sitCode);
    const response = await getJson(url.toString());
    return response?.stats?.[0]?.splits?.[0]?.stat || null;
  })().catch((error) => {
    playerHandedSplitsCache.delete(cacheKey);
    throw error;
  });
  playerHandedSplitsCache.set(cacheKey, promise);
  return promise;
}

async function getPlayerHandedBattingSplits(playerId, season = seasonForDate(dateInput.value || formatDate(new Date()))) {
  const [vsLeft, vsRight] = await Promise.all([
    getPlayerHandedBattingSplit(playerId, 'vl', season).catch(() => null),
    getPlayerHandedBattingSplit(playerId, 'vr', season).catch(() => null),
  ]);
  return { vsLeft, vsRight };
}

function rateNumber(value) {
  const parsed = Number(String(value || '').replace(/^\./, '0.'));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function handedSplitFlagHtml(stat, splitHand, matchupHand = '') {
  if (!stat) return '';
  const avg = rateNumber(stat.avg);
  const slg = rateNumber(stat.slg);
  const flags = [];
  if (Number.isFinite(avg) && avg < 0.175) flags.push('<span title="Poor split AVG">👎</span>');
  if (Number.isFinite(avg) && avg >= 0.330) flags.push('<span title="Strong split AVG">👍</span>');
  if (Number.isFinite(slg) && slg >= 0.600) flags.push('<span title="Power split">⚡</span>');
  const splitMatchesToday = matchupHand && handednessCode(matchupHand) === splitHand;
  return `<span class="handed-split-flags${splitMatchesToday ? ' is-today-matchup' : ''}">${flags.join('')}</span>`;
}

function handedSplitEmojiHtml(stat, splitHand, matchupHand = '') {
  const avg = rateNumber(stat?.avg);
  const slg = rateNumber(stat?.slg);
  const matchesToday = matchupHand && handednessCode(matchupHand) === splitHand;
  if (!matchesToday && !(Number.isFinite(avg) && (avg < 0.175 || avg >= 0.330)) && !(Number.isFinite(slg) && slg >= 0.600)) return '';
  const pieces = [];
  if (Number.isFinite(avg) && avg < 0.175) pieces.push('<span class="lineup-split-flag" title="Poor handed split" aria-label="Poor handed split">👎</span>');
  if (Number.isFinite(avg) && avg >= 0.330) pieces.push('<span class="lineup-split-flag" title="Strong handed split" aria-label="Strong handed split">👍</span>');
  if (Number.isFinite(slg) && slg >= 0.600) pieces.push('<span class="lineup-split-flag" title="Power handed split" aria-label="Power handed split">⚡</span>');
  return pieces.join('');
}

function handedSplitTableRow(label, splitHand, stat, matchupHand = '') {
  const hits = statNumber(stat?.hits);
  const atBats = statNumber(stat?.atBats);
  const xbh = statNumber(stat?.doubles) + statNumber(stat?.triples) + statNumber(stat?.homeRuns);
  return `
    <tr${matchupHand && handednessCode(matchupHand) === splitHand ? ' class="is-today-matchup"' : ''}>
      <th>${escapeHtml(label)}</th>
      <td>${stat ? `${hits}-${atBats}` : '---'}</td>
      <td>${escapeHtml(cleanSummary(stat?.avg) || '---')}</td>
      <td>${escapeHtml(cleanSummary(stat?.slg) || '---')}</td>
      <td>${stat ? xbh : '---'}</td>
      <td>${statNumber(stat?.homeRuns)}</td>
      <td>${handedSplitFlagHtml(stat, splitHand, matchupHand)}</td>
    </tr>
  `;
}

function handedSplitsTableHtml({ vsLeft = null, vsRight = null } = {}, matchupHand = '') {
  return `
    <table class="player-stat-table handed-splits-table">
      <thead>
        <tr>
          <th>Split</th>
          <th>H-AB</th>
          <th>AVG</th>
          <th>SLG</th>
          <th>XBH</th>
          <th>HR</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${handedSplitTableRow('Vs LHP', 'L', vsLeft, matchupHand)}
        ${handedSplitTableRow('Vs RHP', 'R', vsRight, matchupHand)}
      </tbody>
    </table>
  `;
}

function battingContextHtml(profile, splits = null, matchupHand = '', game = null, gamesSince = null) {
  const rightRows = battingProjectionRows(profile, game, gamesSince);
  return `
    <strong>BATTING PROFILE</strong>
    ${playerStatTableHtml(rightRows)}
    <strong class="player-stat-subtitle">HANDED SPLITS</strong>
    ${splits ? handedSplitsTableHtml(splits, matchupHand) : '<div class="player-stat-loading">Loading handed splits</div>'}
  `;
}

function formatProjectedSeasonTotal(total, games) {
  const count = statNumber(total);
  const played = statNumber(games);
  if (played <= 0) return '---';
  return formatRateValue((count / played) * 162, 1, false);
}

function formatProjectedRemainingSeasonTotal(total, playerGames, teamGamesPlayed = playerGames) {
  const count = statNumber(total);
  const played = statNumber(playerGames);
  const teamPlayed = statNumber(teamGamesPlayed) || played;
  if (played <= 0) return '---';
  const gamesLeft = Math.max(0, 162 - teamPlayed);
  return formatRateValue(count + ((count / played) * gamesLeft), 1, false);
}

function formatGamesPerEvent(total, games) {
  const count = statNumber(total);
  const played = statNumber(games);
  if (count <= 0 || played <= 0) return '---';
  return formatRateValue(played / count, 1, false);
}

function formatGamesPerEventLabel(total, games, label) {
  const value = formatGamesPerEvent(total, games);
  return value === '---' ? '---' : `${value} per ${label}`;
}

function gamesFromRecordString(record = '') {
  const parsed = parseRecordValue(record);
  const games = statNumber(parsed.wins) + statNumber(parsed.losses);
  return games > 0 ? games : 0;
}

function battingProjectionGames(profile, game = null) {
  const batting = profile?.batting || {};
  const direct = statNumber(
    batting.playerGames
    ?? batting.gamesPlayed
    ?? profile?.playerGames
    ?? profile?.playerGamesPlayed
  );
  if (direct > 0) return direct;

  const team = String(profile?.teamAbbrev || '').toUpperCase();
  if (!team || !game) return 0;
  if (String(game.away || '').toUpperCase() === team) {
    return gamesFromRecordString(game.awayRecord);
  }
  if (String(game.home || '').toUpperCase() === team) {
    return gamesFromRecordString(game.homeRecord);
  }
  return 0;
}

function battingProjectionTeamGames(profile, game = null) {
  const team = String(profile?.teamAbbrev || '').toUpperCase();
  if (!team || !game) return battingProjectionGames(profile, game);
  if (String(game.away || '').toUpperCase() === team) return gamesFromRecordString(game.awayRecord);
  if (String(game.home || '').toUpperCase() === team) return gamesFromRecordString(game.homeRecord);
  return battingProjectionGames(profile, game);
}

function formatGamesSinceEvent(value) {
  const count = Number(value);
  if (!Number.isFinite(count) || count < 0) return '---';
  return `${Math.floor(count)} games`;
}

function battingProjectionRows(profile, game = null, gamesSince = null) {
  const batting = profile?.batting || {};
  const games = battingProjectionGames(profile, game);
  const teamGames = battingProjectionTeamGames(profile, game);
  const homeRuns = statNumber(batting.hr);
  const extraBaseHits = statNumber(batting.doubles) + statNumber(batting.triples) + homeRuns;
  return [
    ['Proj HR', formatProjectedRemainingSeasonTotal(homeRuns, games, teamGames || games)],
    ['Proj XBH', formatProjectedRemainingSeasonTotal(extraBaseHits, games, teamGames || games)],
    ['Per HR', formatGamesPerEventLabel(homeRuns, games, 'HR')],
    ['Per XBH', formatGamesPerEventLabel(extraBaseHits, games, 'XBH')],
    ['Since HR', formatGamesSinceEvent(gamesSince?.hr)],
    ['Since XBH', formatGamesSinceEvent(gamesSince?.xbh)],
  ];
}

function pitcherOpponentHandSeed(profile, season = seasonForDate(dateInput.value || formatDate(new Date()))) {
  const id = Number(profile?.id);
  const nameKey = normalizeNameKey(profile?.fullName || profile?.name || '');
  const seed = FANGRAPHS_PITCHER_HAND_SPLIT_SEEDS[nameKey]
    || Object.values(FANGRAPHS_PITCHER_HAND_SPLIT_SEEDS).find((entry) => Number(entry.playerId) === id)
    || null;
  if (!seed || Number(seed.season) !== Number(season)) return null;
  return seed;
}

async function getPitcherOpponentHandSplit(playerId, sitCode, season = seasonForDate(dateInput.value || formatDate(new Date()))) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0 || !sitCode) return null;
  const cacheKey = `pitcher:${id}:${season}:${sitCode}`;
  if (pitcherOpponentHandSplitsCache.has(cacheKey)) return pitcherOpponentHandSplitsCache.get(cacheKey);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'statSplits');
    url.searchParams.set('group', 'pitching');
    url.searchParams.set('season', String(season));
    url.searchParams.set('sitCodes', sitCode);
    const response = await getJson(url.toString());
    return response?.stats?.[0]?.splits?.[0]?.stat || null;
  })().catch((error) => {
    pitcherOpponentHandSplitsCache.delete(cacheKey);
    throw error;
  });
  pitcherOpponentHandSplitsCache.set(cacheKey, promise);
  return promise;
}

async function getPitcherOpponentHandSplits(profile, season = seasonForDate(dateInput.value || formatDate(new Date()))) {
  const seed = pitcherOpponentHandSeed(profile, season);
  if (seed) {
    return {
      vsLeft: seed.vsLeft,
      vsRight: seed.vsRight,
      source: seed.source,
      sourceUrl: seed.sourceUrl,
    };
  }
  const [vsLeft, vsRight] = await Promise.all([
    getPitcherOpponentHandSplit(profile?.id, 'vl', season).catch(() => null),
    getPitcherOpponentHandSplit(profile?.id, 'vr', season).catch(() => null),
  ]);
  return { vsLeft, vsRight, source: 'MLB Stats API' };
}

function pitcherOpponentHandValue(stat, key) {
  if (!stat) return '---';
  if (key === 'avg') return cleanSummary(stat.avg) || '---';
  if (key === 'slg') return cleanSummary(stat.slg) || '---';
  if (key === 'homeRuns') return statNumber(stat.homeRuns ?? stat.hrAllowed ?? stat.hr);
  if (key === 'strikeOuts') return statNumber(stat.strikeOuts ?? stat.so);
  return '---';
}

function pitcherOpponentHandAvgMarker(stat, hand) {
  const avg = rateNumber(stat?.avg);
  const slg = rateNumber(stat?.slg);
  const code = handednessCode(hand);
  if (!code) return '';
  const markers = [];
  if (Number.isFinite(avg) && avg < 0.210) {
    markers.push(`<span class="pitcher-hand-avg-marker is-low" title="Opponent ${code} AVG ${formatRateValue(avg, 3, true)}">${code}</span>`);
  }
  if (Number.isFinite(avg) && avg >= 0.300) {
    markers.push(`<span class="pitcher-hand-avg-marker is-high" title="Opponent ${code} AVG ${formatRateValue(avg, 3, true)}">${code}</span>`);
  }
  if (Number.isFinite(slg) && slg > 0.600) {
    markers.push(`<span class="pitcher-hand-avg-marker is-power" title="Opponent ${code} SLG ${formatRateValue(slg, 3, true)}">${code}</span>`);
  }
  return markers.join('');
}

function pitcherOpponentHandRow(label, stat) {
  return `
    <tr>
      <th>${escapeHtml(label)}</th>
      <td>${escapeHtml(pitcherOpponentHandValue(stat, 'avg'))}</td>
      <td>${escapeHtml(pitcherOpponentHandValue(stat, 'slg'))}</td>
      <td>${pitcherOpponentHandValue(stat, 'homeRuns')}</td>
      <td>${pitcherOpponentHandValue(stat, 'strikeOuts')}</td>
    </tr>
  `;
}

function pitcherOpponentHandHtml(splits = null) {
  const source = splits?.source || '';
  return `
    <strong>OPPONENT / HAND${source ? ` <span class="player-stat-source">${escapeHtml(source)}</span>` : ''}</strong>
    <table class="player-stat-table handed-splits-table pitcher-opponent-hand-table">
      <thead>
        <tr>
          <th>Split</th>
          <th>Opp AVG</th>
          <th>Opp SLG</th>
          <th>HR</th>
          <th>K</th>
        </tr>
      </thead>
      <tbody>
        ${pitcherOpponentHandRow('vs L', splits?.vsLeft)}
        ${pitcherOpponentHandRow('vs R', splits?.vsRight)}
      </tbody>
    </table>
  `;
}

function renderPitcherOpponentHandSplits(profile, token) {
  if (!playerStatExtraEl || !profile?.id) return;
  playerStatExtraEl.innerHTML = `${pitcherOpponentHandHtml(null)}<div class="player-stat-loading">Loading opponent handed splits</div>`;
  getPitcherOpponentHandSplits(profile)
    .then((splits) => {
      if (!playerStatExtraEl || playerStatExtraEl.dataset.splitToken !== token) return;
      playerStatExtraEl.innerHTML = pitcherOpponentHandHtml(splits);
    })
    .catch(() => {
      if (!playerStatExtraEl || playerStatExtraEl.dataset.splitToken !== token) return;
      playerStatExtraEl.innerHTML = `${pitcherOpponentHandHtml(null)}<div class="player-stat-loading">Unavailable</div>`;
    });
}

function hydratePitcherOpponentHandMarkers(rootEl) {
  const markers = Array.from(rootEl?.querySelectorAll?.('.pitcher-hand-markers[data-pitcher-hand-id]') || []);
  if (!markers.length) return;
  const token = `${Date.now()}:${markers.length}`;
  rootEl.dataset.pitcherHandMarkerToken = token;
  const ids = [...new Set(markers.map((marker) => Number(marker.dataset.pitcherHandId)).filter((id) => Number.isFinite(id) && id > 0))];
  Promise.all(ids.map(async (id) => {
    const profile = latestRenderedGames
      .map((game) => game?.playerLookup?.[String(id)])
      .find(Boolean) || { id };
    const splits = await getPitcherOpponentHandSplits(profile).catch(() => null);
    return [id, splits];
  })).then((results) => {
    if (rootEl.dataset.pitcherHandMarkerToken !== token) return;
    const splitMap = new Map(results);
    for (const marker of markers) {
      const id = Number(marker.dataset.pitcherHandId);
      const splits = splitMap.get(id);
      marker.innerHTML = splits
        ? `${pitcherOpponentHandAvgMarker(splits.vsLeft, 'L')}${pitcherOpponentHandAvgMarker(splits.vsRight, 'R')}`
        : '';
    }
  });
}

function renderPlayerHandedSplits(profile, game, token) {
  if (!playerStatExtraEl || !profile?.id) return;
  const matchupHand = currentMatchupPitcher(profile, game)?.throws || '';
  playerStatExtraEl.innerHTML = battingContextHtml(profile, null, matchupHand, game);
  Promise.allSettled([
    getPlayerHandedBattingSplits(profile.id),
    getPlayerRecentBattingDetails(profile.id, game),
  ]).then(([splitResult, recentResult]) => {
    if (!playerStatExtraEl || playerStatExtraEl.dataset.splitToken !== token) return;
    const splits = splitResult.status === 'fulfilled' ? splitResult.value : null;
    const gamesSince = recentResult.status === 'fulfilled' ? recentResult.value?.gamesSince || null : null;
    const handed = splits ? { vsLeft: splits.vsLeft, vsRight: splits.vsRight } : null;
    if (handed) {
      playerStatExtraEl.innerHTML = battingContextHtml(profile, handed, matchupHand, game, gamesSince);
    } else {
      playerStatExtraEl.innerHTML = `${playerStatRowsHtml('BATTING PROFILE', battingProjectionRows(profile, game, gamesSince))}<strong class="player-stat-subtitle">HANDED SPLITS</strong><div class="player-stat-loading">Unavailable</div>`;
    }
  });
}

function matchupPitcherHandForLineup(game, battingSide) {
  const pitcherSide = battingSide === 'home' ? 'away' : battingSide === 'away' ? 'home' : '';
  if (!pitcherSide) return '';
  const pitcher = scoreboardPitcherForSide(game, pitcherSide)
    || resolveLineupPitcherForDisplay(game, pitcherSide)?.current
    || resolveLineupPitcherForDisplay(game, pitcherSide)?.starter
    || null;
  return pitcher?.throws || pitcher?.pitchHand?.code || pitcher?.pitchHand?.description || '';
}

function matchupPitcherForLineup(game, battingSide) {
  const pitcherSide = battingSide === 'home' ? 'away' : battingSide === 'away' ? 'home' : '';
  if (!pitcherSide) return null;
  return scoreboardPitcherForSide(game, pitcherSide)
    || resolveLineupPitcherForDisplay(game, pitcherSide)?.current
    || resolveLineupPitcherForDisplay(game, pitcherSide)?.starter
    || null;
}

async function handedSplitFlagMapForLineup(game, side, lineup = []) {
  const matchupHand = matchupPitcherHandForLineup(game, side);
  const splitHand = handednessCode(matchupHand);
  if (!splitHand || !Array.isArray(lineup) || !lineup.length) return new Map();
  const pairs = await Promise.all(
    lineup.map(async (entry) => {
      const id = Number(entry?.id);
      if (!Number.isFinite(id) || id <= 0) return null;
      const stat = await getPlayerHandedBattingSplit(id, splitHand === 'L' ? 'vl' : 'vr').catch(() => null);
      const html = handedSplitEmojiHtml(stat, splitHand, matchupHand);
      return html ? [String(id), html] : null;
    }),
  );
  return new Map(pairs.filter(Boolean));
}

function effectiveBatterHandForPitcher(batterHand, pitcherHand) {
  const batter = handednessCode(batterHand);
  if (batter === 'S') return handednessCode(pitcherHand) === 'L' ? 'R' : 'L';
  return batter === 'L' || batter === 'R' ? batter : '';
}

function isGoodHitterHandedSplit(stat = null) {
  const avg = rateNumber(stat?.avg);
  const slg = rateNumber(stat?.slg);
  return (Number.isFinite(avg) && avg >= 0.300) || (Number.isFinite(slg) && slg >= 0.500);
}

function isBadPitcherOpponentHandSplit(stat = null) {
  const avg = rateNumber(stat?.avg);
  const slg = rateNumber(stat?.slg);
  return (Number.isFinite(avg) && avg >= 0.300) || (Number.isFinite(slg) && slg > 0.600);
}

async function eliteMatchupMapForLineup(game, side, lineup = [], batterBadgeMap = new Map()) {
  const pitcher = matchupPitcherForLineup(game, side);
  const pitcherHand = handednessCode(pitcher?.throws || pitcher?.pitchHand?.code || pitcher?.pitchHand?.description || '');
  const pitcherId = Number(pitcher?.id);
  if (!pitcherHand || !Number.isFinite(pitcherId) || pitcherId <= 0 || !Array.isArray(lineup) || !lineup.length) return new Map();
  const pitcherSplits = await getPitcherOpponentHandSplits(pitcher).catch(() => null);
  if (!pitcherSplits) return new Map();
  const pairs = await Promise.all(lineup.map(async (entry) => {
    const id = Number(entry?.id);
    if (!Number.isFinite(id) || id <= 0) return null;
    const badges = batterBadgeMap?.get?.(String(id));
    if (!badges?.slugBurst) return null;
    const batterHand = effectiveBatterHandForPitcher(entry?.bats, pitcherHand);
    if (!batterHand) return null;
    const pitcherSplit = batterHand === 'L' ? pitcherSplits.vsLeft : pitcherSplits.vsRight;
    if (!isBadPitcherOpponentHandSplit(pitcherSplit)) return null;
    const hitterSplit = await getPlayerHandedBattingSplit(id, pitcherHand === 'L' ? 'vl' : 'vr').catch(() => null);
    if (!isGoodHitterHandedSplit(hitterSplit)) return null;
    const title = [
      `Elite matchup vs ${handednessCode(pitcherHand)}HP`,
      `recent SLG ${formatRateValue(badges.slugBurstValue, 3, true)}`,
      `hitter split ${cleanSummary(hitterSplit?.avg) || '---'} AVG/${cleanSummary(hitterSplit?.slg) || '---'} SLG`,
      `pitcher vs ${batterHand} ${cleanSummary(pitcherSplit?.avg) || '---'} AVG/${cleanSummary(pitcherSplit?.slg) || '---'} SLG`,
    ].join(' | ');
    return [String(id), title];
  }));
  return new Map(pairs.filter(Boolean));
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

function cleanPlayText(value) {
  return cleanSummary(value)
    .replace(/\bGame Advisory\b/gi, '')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function eventLabel(play) {
  const batterName = cleanPlayText(play?.matchup?.batter?.fullName || 'Unknown');
  const shortName = batterName.split(' ').slice(-1)[0];
  const event = cleanPlayText(play?.result?.event || play?.result?.eventType || 'Play') || 'Play';
  const description = cleanPlayText(play?.result?.description || '');
  const describedName = (pattern) => {
    const match = String(description || '').match(pattern);
    return match?.[1] ? lastName(match[1].trim()) : '';
  };
  if (/stolen base/i.test(event) || /steals/i.test(description)) {
    const runner = describedName(/^(.+?)\s+steals\b/i) || describedName(/^(.+?)\s+to\s+\d/i);
    return `${runner || shortName} SB`;
  }
  if (/caught stealing/i.test(event) || /caught stealing/i.test(description)) {
    const runner = describedName(/^(.+?)\s+caught stealing/i);
    return `${runner || shortName} CS`;
  }
  if (/pitching substitution|pitching change/i.test(event) || /pitching change/i.test(description)) {
    const change = description.match(/pitching change:\s*(.+?)\s+replaces\s+(.+?)(?:\.|$)/i)
      || description.match(/(.+?)\s+replaces\s+(.+?)(?:\.|$)/i);
    if (change) return `${lastName(change[2])} substituted for ${lastName(change[1])}`;
    return description || 'Pitching substitution';
  }
  if (/defensive substitution|offensive substitution|pinch/i.test(event) || /defensive substitution|offensive substitution|pinch/i.test(description)) {
    const change = description.match(/(.+?)\s+replaces\s+(.+?)(?:\.|$)/i)
      || description.match(/(.+?)\s+enters.*?for\s+(.+?)(?:\.|$)/i);
    if (change) return `${lastName(change[2])} substituted for ${lastName(change[1])}`;
    return description || 'Substitution';
  }
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

function playByPlayDescription(play) {
  const label = eventLabel(play);
  const description = cleanPlayText(play?.result?.description || '');
  if (!description) return label;
  return description.toLowerCase().startsWith(label.toLowerCase()) ? description : `${label} - ${description}`;
}

function scoreFromPlayHistory(allPlays, side) {
  const keyName = side === 'away' ? 'awayScore' : 'homeScore';
  for (const play of [...(Array.isArray(allPlays) ? allPlays : [])].reverse()) {
    const value = Number(play?.result?.[keyName]);
    if (Number.isFinite(value)) return value;
  }
  return null;
}

function scoreFromLineInnings(linescore, side) {
  const total = (Array.isArray(linescore?.innings) ? linescore.innings : [])
    .reduce((sum, inning) => {
      const runs = Number(inning?.[side]?.runs);
      return Number.isFinite(runs) ? sum + runs : sum;
    }, 0);
  return total > 0 ? total : null;
}

function gameScoreForSide(game, linescore, allPlays, side) {
  const lineValue = Number(linescore?.teams?.[side]?.runs);
  if (Number.isFinite(lineValue)) return lineValue;
  const inningValue = scoreFromLineInnings(linescore, side);
  if (Number.isFinite(Number(inningValue))) return inningValue;
  const scheduleValue = Number(game?.teams?.[side]?.score);
  if (Number.isFinite(scheduleValue)) return scheduleValue;
  const playValue = scoreFromPlayHistory(allPlays, side);
  if (Number.isFinite(Number(playValue))) return playValue;
  return '-';
}

function gameHitsForSide(linescore, side) {
  const lineValue = Number(linescore?.teams?.[side]?.hits);
  if (Number.isFinite(lineValue)) return lineValue;
  const inningValue = (Array.isArray(linescore?.innings) ? linescore.innings : [])
    .reduce((sum, inning) => {
      const hits = Number(inning?.[side]?.hits);
      return Number.isFinite(hits) ? sum + hits : sum;
    }, 0);
  return inningValue > 0 ? inningValue : '-';
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

function suppressScoreAnimations(ms = 8000) {
  suppressScoreAnimationsUntil = Math.max(suppressScoreAnimationsUntil, Date.now() + ms);
}

function canAnimateScoreIncrease(game, prev, currentRuns, previousRuns) {
  const current = Number(currentRuns);
  const previous = Number(previousRuns);
  if (!prev || !Number.isFinite(current) || !Number.isFinite(previous)) return false;
  const delta = current - previous;
  if (delta <= 0 || delta > 4) return false;
  if (Date.now() < suppressScoreAnimationsUntil) return false;
  if (document.visibilityState === 'hidden') return false;
  if (!lineupGameShouldAutoRefresh(game)) return false;
  return !prev.seenAt || Date.now() - prev.seenAt <= 45000;
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
  const detailed = cleanSummary(game?.status?.detailedState || game?.status || '');
  const coded = String(game?.status?.codedGameState || '').toUpperCase();
  if (/cancel|postpon|suspend|delay|makeup/i.test(detailed) || ['C', 'D'].includes(coded)) return detailed || 'Game status unavailable';
  const st = game?.status?.abstractGameState;
  if (st === 'Preview') return `Not Started | ${estTime(game.gameDate)} EST`;
  if (st === 'Final') return 'Final';
  return detailed || 'Unknown';
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
  const unavailable = statusLine(game);
  if (/cancel|postpon|suspend|delay|makeup/i.test(unavailable)) return { short: unavailable, long: unavailable };
  const st = game?.status?.abstractGameState;
  if (st === 'Preview') return { short: 'PRE', long: `Starts ${estTime(game.gameDate)} EST` };
  if (st === 'Final') return { short: 'F', long: 'Final' };

  const ordinal = ordinalForDisplay(linescore);
  const liveHalf = normalizeHalfInning(activePlay?.about?.halfInning);
  const stateHalf = normalizeHalfInning(linescore?.inningHalf || linescore?.inningState);
  const half = stateHalf || liveHalf;

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
  const lineHalf = normalizeHalfInning(linescore?.inningHalf || linescore?.inningState);
  const lineHalfIsPlayable = lineHalf === 'top' || lineHalf === 'bottom';
  const liveHalfIsPlayable = liveHalf === 'top' || liveHalf === 'bottom';
  const half = lineHalfIsPlayable ? lineHalf : (liveHalfIsPlayable ? liveHalf : lineHalf);
  return {
    half,
    battingSide: half === 'bottom' ? 'home' : half === 'top' ? 'away' : '',
    fieldingSide: half === 'bottom' ? 'away' : half === 'top' ? 'home' : '',
  };
}

function linescorePitcherSnapshot(linescore) {
  const pitcher = linescore?.defense?.pitcher || linescore?.defense?.currentPitcher || null;
  const id = Number(pitcher?.id);
  return {
    pitcher: Number.isFinite(id) && id > 0 ? pitcher : null,
    pitcherId: Number.isFinite(id) && id > 0 ? id : null,
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
  const livePitcher = linescorePitcherSnapshot(linescore);
  const currentPitcherId = livePitcher.pitcherId || activePitcher?.id;
  const currentPitcherName = livePitcher.pitcher?.fullName || activePitcher?.fullName || '';

  if (side.battingSide === 'away') {
    awayHitter = formatBatterLine(playerById(awayPlayers, activeBatter?.id), activeBatter?.fullName || '');
    homePitcher = formatPitcherLine(playerById(homePlayers, currentPitcherId), currentPitcherName);
  } else if (side.battingSide === 'home') {
    homeHitter = formatBatterLine(playerById(homePlayers, activeBatter?.id), activeBatter?.fullName || '');
    awayPitcher = formatPitcherLine(playerById(awayPlayers, currentPitcherId), currentPitcherName);
  }

  return { awayPitcher, homePitcher, awayHitter, homeHitter, battingSide: side.battingSide, currentPitcherId };
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
    ? previewProbableForSide(game, pitcherSide)
      || null
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
  el.querySelectorAll('.pitcher-fire-streak, .pitcher-cold-streak, .pitcher-hr-risk, .pitcher-whip-risk').forEach((marker) => marker.remove());
  if (!markerId) return;
  const markerWrap = document.createElement('span');
  const track = el.querySelector('.marquee-track');
  const target = track || el;
  markerWrap.innerHTML = pitcherFireMarkerHtml(markerId);
  const marker = markerWrap.firstElementChild;
  if (marker) target.appendChild(marker);
  const riskWrap = document.createElement('span');
  riskWrap.innerHTML = `${pitcherHomeRunRiskMarkerHtml(pitcher)}${pitcherWhipRiskMarkerHtml(pitcher)}`;
  for (const riskMarker of Array.from(riskWrap.children)) {
    target.appendChild(riskMarker);
  }
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

function homeRunResultLabel(play, isWalkOff = false) {
  const rbi = Number(play?.result?.rbi);
  const prefix = isWalkOff ? 'Walkoff ' : '';
  if (rbi >= 4) return `${prefix}Grand Slam`;
  if (rbi === 3) return `${prefix}Three Run Homerun`;
  if (rbi === 2) return `${prefix}2 Run Homerun`;
  if (rbi === 1) return `${prefix}Solo Homerun`;
  const description = String(play?.result?.description || '').toLowerCase();
  if (description.includes('grand slam')) return `${prefix}Grand Slam`;
  if (description.includes('three-run') || description.includes('3-run')) return `${prefix}Three Run Homerun`;
  if (description.includes('two-run') || description.includes('2-run')) return `${prefix}2 Run Homerun`;
  if (description.includes('solo')) return `${prefix}Solo Homerun`;
  return `${prefix}Homerun`;
}

function ordinalInningNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return '';
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : (n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th');
  return `${n}${suffix}`;
}

function formatHrInningText(play) {
  const half = normalizeHalfInning(play?.about?.halfInning);
  const inning = ordinalInningNumber(play?.about?.inning);
  if (!half && !inning) return '';
  return `${half === 'top' ? 'Top' : half === 'bottom' ? 'Bot' : cleanSummary(play?.about?.halfInning || '')} ${inning}`.trim();
}

function homeRunRunsScored(play) {
  const rbi = Number(play?.result?.rbi);
  if (Number.isFinite(rbi) && rbi > 0) return Math.min(4, Math.max(1, Math.round(rbi)));
  const label = homeRunResultLabel(play).toLowerCase();
  if (label.includes('grand')) return 4;
  if (label.includes('three')) return 3;
  if (label.includes('2') || label.includes('two')) return 2;
  return 1;
}

function homeRunInningPoints(inning) {
  const n = Number(inning);
  if (!Number.isFinite(n) || n <= 0) return 10;
  if (n <= 3) return 10;
  if (n === 4) return 30;
  if (n === 5) return 45;
  if (n === 6) return 60;
  if (n === 7) return 75;
  if (n === 8) return 95;
  if (n === 9) return 115;
  return 120;
}

function homeRunRunsPoints(runs) {
  if (runs >= 4) return 150;
  if (runs === 3) return 115;
  if (runs === 2) return 75;
  return 35;
}

function homeRunDistancePoints(distance) {
  const feet = Number(distance);
  if (!Number.isFinite(feet)) return 0;
  if (feet < 360) return 10;
  if (feet < 380) return 25;
  if (feet < 400) return 40;
  if (feet < 420) return 60;
  if (feet < 440) return 75;
  if (feet < 460) return 88;
  return 100;
}

function pitcherDifficultyDetails(profile) {
  if (!profile) {
    return {
      points: 0,
      hr9: null,
      ip: null,
      base: 0,
      multiplier: 0,
    };
  }
  const ipOuts = inningsToOuts(profile?.pitching?.ip ?? profile?.ip ?? profile?.seasonStats?.pitching?.inningsPitched);
  const ip = ipOuts > 0 ? ipOuts / 3 : 0;
  const hrAllowed = pitcherHomeRunsAllowed(profile);
  const hr9 = ip > 0 ? (hrAllowed * 9) / ip : Number.POSITIVE_INFINITY;
  const base = hr9 <= 0.40 ? 200
    : hr9 <= 0.70 ? 175
      : hr9 <= 1.00 ? 140
        : hr9 <= 1.30 ? 100
          : hr9 <= 1.70 ? 60
            : 25;
  const multiplier = ip < 20 ? 0.45
    : ip < 40 ? 0.65
      : ip < 70 ? 0.80
        : ip < 110 ? 0.95
          : 1;
  return {
    points: base * multiplier,
    hr9: Number.isFinite(hr9) ? hr9 : null,
    ip,
    base,
    multiplier,
  };
}

function pitcherDifficultyPoints(profile) {
  return pitcherDifficultyDetails(profile).points;
}

function homeRunResultPoints(play, battingSide) {
  const runs = homeRunRunsScored(play);
  const beforeAway = Number(play?.result?.awayScore) - (battingSide === 'away' ? runs : 0);
  const beforeHome = Number(play?.result?.homeScore) - (battingSide === 'home' ? runs : 0);
  const afterAway = Number(play?.result?.awayScore);
  const afterHome = Number(play?.result?.homeScore);
  if (![beforeAway, beforeHome, afterAway, afterHome].every(Number.isFinite)) return 20;
  const beforeBatting = battingSide === 'away' ? beforeAway : beforeHome;
  const beforeOpponent = battingSide === 'away' ? beforeHome : beforeAway;
  const afterBatting = battingSide === 'away' ? afterAway : afterHome;
  const afterOpponent = battingSide === 'away' ? afterHome : afterAway;
  if (beforeBatting > beforeOpponent && afterBatting > afterOpponent) return 20;
  if (afterBatting < afterOpponent) return 60;
  if (afterBatting === afterOpponent) return 110;
  if (beforeBatting === beforeOpponent && afterBatting > afterOpponent) return 140;
  if (beforeBatting < beforeOpponent && afterBatting > afterOpponent) return 180;
  return 20;
}

function homeRunWalkOffPoints(play, battingSide) {
  const description = `${play?.result?.description || ''} ${play?.result?.event || ''}`;
  const runs = homeRunRunsScored(play);
  const inning = Number(play?.about?.inning);
  const afterAway = Number(play?.result?.awayScore);
  const afterHome = Number(play?.result?.homeScore);
  const beforeHome = afterHome - (battingSide === 'home' ? runs : 0);
  const isBottomWalkOffScore = battingSide === 'home'
    && Number.isFinite(inning)
    && inning >= 9
    && Number.isFinite(afterAway)
    && Number.isFinite(afterHome)
    && Number.isFinite(beforeHome)
    && beforeHome <= afterAway
    && afterHome > afterAway;
  const isWalkOff = Boolean(play?.about?.isWalkOff || play?.result?.isWalkOff || /walk-?off/i.test(description) || isBottomWalkOffScore);
  if (!isWalkOff) return 0;
  const beforeAway = Number(play?.result?.awayScore) - (battingSide === 'away' ? runs : 0);
  const beforeHomeScore = Number(play?.result?.homeScore) - (battingSide === 'home' ? runs : 0);
  if (!Number.isFinite(beforeAway) || !Number.isFinite(beforeHomeScore)) return 180;
  const beforeBatting = battingSide === 'away' ? beforeAway : beforeHomeScore;
  const beforeOpponent = battingSide === 'away' ? beforeHomeScore : beforeAway;
  if (runs >= 4 && beforeBatting < beforeOpponent) return 250;
  if (beforeBatting < beforeOpponent) return 230;
  return 180;
}

function isWalkOffHomeRunByPlayHistory(play, allPlays = [], battingSide = '') {
  if (play?.about?.isWalkOff || play?.result?.isWalkOff) return true;
  const description = `${play?.result?.description || ''} ${play?.result?.event || ''}`;
  if (/walk-?off/i.test(description)) return true;
  const half = normalizeHalfInning(play?.about?.halfInning);
  const inning = Number(play?.about?.inning);
  const runs = homeRunRunsScored(play);
  const afterAway = Number(play?.result?.awayScore);
  const afterHome = Number(play?.result?.homeScore);
  const beforeHome = afterHome - (battingSide === 'home' ? runs : 0);
  if (
    battingSide !== 'home'
    || half !== 'bottom'
    || !Number.isFinite(inning)
    || inning < 9
    || !Number.isFinite(afterAway)
    || !Number.isFinite(afterHome)
    || !Number.isFinite(beforeHome)
    || beforeHome > afterAway
    || afterHome <= afterAway
  ) return false;
  const atBatIndex = Number(play?.about?.atBatIndex);
  if (!Number.isFinite(atBatIndex)) return true;
  return !(allPlays || []).some((candidate) => (
    Number(candidate?.about?.atBatIndex) > atBatIndex
    && candidate?.matchup?.batter?.id
    && candidate?.matchup?.pitcher?.id
    && candidate?.about?.isComplete !== false
  ));
}

function homeRunRatingBreakdown(play, pitcherProfile, distance, battingSide) {
  const pitcherDifficulty = pitcherDifficultyDetails(pitcherProfile);
  const runsScored = homeRunRunsScored(play);
  const walkOff = homeRunWalkOffPoints(play, battingSide);
  const inning = homeRunInningPoints(play?.about?.inning);
  const result = homeRunResultPoints(play, battingSide);
  const runs = homeRunRunsPoints(runsScored);
  const distancePoints = homeRunDistancePoints(distance);
  const score = walkOff + inning + result + runs + pitcherDifficulty.points + distancePoints;
  return {
    score: Math.round(Math.max(0, Math.min(1000, score))),
    walkOff,
    inning,
    result,
    runs,
    pitcher: pitcherDifficulty.points,
    distance: distancePoints,
    runsScored,
    inningText: formatHrInningText(play),
    distanceFeet: Number.isFinite(Number(distance)) ? Number(distance) : null,
    pitcherHr9: pitcherDifficulty.hr9,
    pitcherIp: pitcherDifficulty.ip,
    pitcherBase: pitcherDifficulty.base,
    pitcherMultiplier: pitcherDifficulty.multiplier,
  };
}

function homeRunRating(play, pitcherProfile, distance, battingSide) {
  const { score } = homeRunRatingBreakdown(play, pitcherProfile, distance, battingSide);
  return Math.round(Math.max(0, Math.min(1000, score)));
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

function buildLineup(players, activeBatterId, battingOrderIds = [], nextBatterId = null) {
  const bySlot = new Map();
  const substitutionsBySlot = new Map();
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
    if (!substitutionsBySlot.has(slot)) substitutionsBySlot.set(slot, []);
    substitutionsBySlot.get(slot).push(player);
    const existing = bySlot.get(slot);
    const currentOrder = Number(player?.battingOrder) || 0;
    const existingOrder = Number(existing?.battingOrder) || 0;
    if (!existing || currentOrder >= existingOrder) {
      bySlot.set(slot, player);
    }
  }

  return [...bySlot.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([slot, player]) => {
      const gameBatting = player?.stats?.batting || {};
      const slotPlayers = (substitutionsBySlot.get(slot) || [player])
        .slice()
        .sort((a, b) => (Number(a?.battingOrder) || 0) - (Number(b?.battingOrder) || 0));
      const starter = slotPlayers[0] || player;
      const hasSubstitution = Number(starter?.person?.id) !== Number(player?.person?.id);
      const starterBatting = starter?.stats?.batting || {};
      return {
        slot,
        id: player?.person?.id ?? null,
        name: lastName(player?.person?.fullName || player?.person?.lastName || 'Unknown'),
        fullName: player?.person?.fullName || 'Unknown',
        position: shortPosition(player),
        bats: player?.person?.batSide?.code || player?.batSide?.code || player?.batSide?.description || '',
        throws: player?.person?.pitchHand?.code || player?.pitchHand?.code || player?.pitchHand?.description || '',
        avg: battingAverage(player),
        today: battingTodaySummary(player),
        gameBatting: lineupGameBattingStats({ gameBatting }),
        batting: player?.seasonStats?.batting || {},
        isActive: Number(player?.person?.id) === Number(activeBatterId),
        isNextUp: Number(player?.person?.id) === Number(nextBatterId),
        substitutionStarter: hasSubstitution ? {
          id: starter?.person?.id ?? null,
          name: lastName(starter?.person?.fullName || starter?.person?.lastName || 'Unknown'),
          fullName: starter?.person?.fullName || 'Unknown',
          position: shortPosition(starter),
          bats: starter?.person?.batSide?.code || starter?.batSide?.code || starter?.batSide?.description || '',
          avg: battingAverage(starter),
          today: battingTodaySummary(starter),
          gameBatting: lineupGameBattingStats({ gameBatting: starterBatting }),
        } : null,
      };
    });
}

function buildStartingLineupFromBoxscore(players, battingOrderIds = []) {
  const startersBySlot = new Map();
  for (const player of Object.values(players || {})) {
    const slot = deriveSlotFromOrder(player?.battingOrder);
    if (!slot) continue;
    const existing = startersBySlot.get(slot);
    const order = Number(player?.battingOrder) || 0;
    const existingOrder = Number(existing?.battingOrder) || 0;
    if (!existing || order < existingOrder) startersBySlot.set(slot, player);
  }
  if (!startersBySlot.size && Array.isArray(battingOrderIds)) {
    const byId = new Map(
      Object.values(players || {})
        .map((player) => [Number(player?.person?.id), player])
        .filter(([id]) => Number.isFinite(id)),
    );
    battingOrderIds.slice(0, 9).forEach((value, index) => {
      const player = byId.get(numericPlayerId(value));
      if (player) startersBySlot.set(index + 1, player);
    });
  }
  return [...startersBySlot.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(0, 9)
    .map(([slot, player]) => ({
      slot,
      id: player?.person?.id ?? null,
      name: lastName(player?.person?.fullName || player?.person?.lastName || 'Unknown'),
      fullName: player?.person?.fullName || 'Unknown',
      position: shortPosition(player),
      bats: player?.person?.batSide?.code || player?.batSide?.code || player?.batSide?.description || '',
      throws: player?.person?.pitchHand?.code || player?.pitchHand?.code || player?.pitchHand?.description || '',
      avg: battingAverage(player),
      today: '0-0',
      gameBatting: {},
      batting: player?.seasonStats?.batting || {},
      isActive: false,
      isNextUp: false,
      substitutionStarter: null,
      source: 'mlb-previous-boxscore',
    }));
}

function battingSideForPlay(play) {
  const half = normalizeHalfInning(play?.about?.halfInning);
  return half === 'top' ? 'away' : half === 'bottom' ? 'home' : '';
}

function nextBatterIdFromOrder(orderIds = [], lastBatterId = null) {
  const order = listify(orderIds)
    .map(numericPlayerId)
    .filter((id) => Number.isFinite(id) && id > 0);
  if (!order.length) return null;
  const last = Number(lastBatterId);
  if (!Number.isFinite(last) || last <= 0) return order[0];
  const index = order.findIndex((id) => Number(id) === last);
  return index >= 0 ? order[(index + 1) % order.length] : order[0];
}

function nextBatterIdsFromPlayLog(allPlays = [], awayOrder = [], homeOrder = []) {
  const lastBySide = { away: null, home: null };
  for (const play of listify(allPlays)) {
    if (!play?.about?.isComplete) continue;
    const side = battingSideForPlay(play);
    const batterId = Number(play?.matchup?.batter?.id);
    if (!side || !Number.isFinite(batterId) || batterId <= 0) continue;
    lastBySide[side] = batterId;
  }
  return {
    away: nextBatterIdFromOrder(awayOrder, lastBySide.away),
    home: nextBatterIdFromOrder(homeOrder, lastBySide.home),
  };
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
      gameBatting: lineupGameBattingStats({ gameBatting: player?.stats?.batting || {} }),
      batting: player?.seasonStats?.batting || {},
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

  const orderedIds = Array.isArray(pitcherOrder) ? pitcherOrder.map((id) => Number(id)).filter(Number.isFinite) : [];
  for (const pitcherId of orderedIds) {
    const orderedMatch = allPitchers.find((player) => Number(player?.person?.id) === pitcherId);
    if (orderedMatch) return orderedMatch;
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

async function fetchTeamPitcherRosterProfiles(teamAbbrev, game) {
  const team = await getTeamByAbbrev(teamAbbrev, officialDateForGame(game)).catch(() => null);
  const teamId = Number(team?.id);
  if (!Number.isFinite(teamId)) return [];
  const season = seasonForDate(officialDateForGame(game));
  const cacheKey = `${teamId}:${season}`;
  if (teamPitcherRosterCache.has(cacheKey)) return teamPitcherRosterCache.get(cacheKey);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/teams/${teamId}/roster`);
    url.searchParams.set('rosterType', 'active');
    url.searchParams.set('season', String(season));
    const roster = await getJson(url.toString());
    const pitcherEntries = listify(roster?.roster)
      .filter((entry) => String(entry?.position?.abbreviation || entry?.position?.code || '').toUpperCase() === 'P');
    const entryById = new Map(pitcherEntries
      .map((entry) => [Number(entry?.person?.id), entry])
      .filter(([id]) => Number.isFinite(id) && id > 0));
    const pitcherIds = [...entryById.keys()];
    const profiles = await Promise.all(
      [...new Set(pitcherIds)].map(async (id) => {
        const profile = await fetchMlbPlayerProfile(id, game).catch(() => null);
        const rosterEntry = entryById.get(id) || {};
        return profile ? {
          ...profile,
          status: profile.status || rosterEntry?.status || rosterEntry?.person?.status || {},
          rosterStatus: rosterEntry?.status?.description || rosterEntry?.status?.code || '',
        } : null;
      }),
    );
    return profiles.filter(Boolean);
  })().catch((error) => {
    teamPitcherRosterCache.delete(cacheKey);
    throw error;
  });
  teamPitcherRosterCache.set(cacheKey, promise);
  return promise;
}

function pitcherUsedInGame(entry) {
  if (!entry) return false;
  const today = cleanSummary(entry?.today || entry?.todayPitching || '');
  if (inningsToOuts(entry?.ip || entry?.innings || entry?.inningsText || entry?.pitching?.ip || entry?.stats?.pitching?.inningsPitched) > 0) return true;
  if (Number(entry?.pitches || entry?.pitchCount || entry?.stats?.pitching?.numberOfPitches || 0) > 0) return true;
  return /\b\d+(?:\.\d)?\s*IP\b/i.test(today) || /\b\d+\s*(?:P|pitches)\b/i.test(today);
}

function pitcherUsageIdsForArchivedSide(staff) {
  const ids = new Set();
  const add = (entry) => {
    const id = Number(entry?.id ?? entry?.person?.id ?? entry?.playerId);
    if (Number.isFinite(id) && pitcherUsedInGame(entry)) ids.add(id);
  };
  add(staff?.current);
  add(staff?.starter);
  for (const arm of listify(staff?.bullpen)) add(arm);
  for (const arm of listify(staff?.history)) add(arm);
  return ids;
}

function pitcherUsedYesterdayIdsForTeam(game, teamAbbrev) {
  const selectedDate = officialDateForGame(game);
  const [yesterday] = recentCalendarDateWindow(selectedDate, 2);
  if (!yesterday || yesterday === selectedDate) return new Set();
  const team = canonicalTeamAbbrev(teamAbbrev || '');
  const ids = new Set();
  for (const archived of getArchivedGames(yesterday).map(normalizeCompletedCard)) {
    const side = sameTeamAbbrev(archived?.away, team)
      ? 'away'
      : sameTeamAbbrev(archived?.home, team)
        ? 'home'
        : '';
    if (!side) continue;
    for (const id of pitcherUsageIdsForArchivedSide(archived?.pitching?.[side])) ids.add(id);
  }
  return ids;
}

function markPitchersUsedYesterday(entries, usedIds = new Set()) {
  return listify(entries).map((entry) => {
    const id = Number(entry?.id ?? entry?.person?.id);
    return Number.isFinite(id) && usedIds.has(id) ? { ...entry, usedYesterday: true } : entry;
  });
}

async function pitcherUsedOnDate(playerId, date, game) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0 || !date) return false;
  const season = seasonForDate(date);
  const cacheKey = `${id}:${date}:used`;
  if (pitcherUsageDateCache.has(cacheKey)) return pitcherUsageDateCache.get(cacheKey);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'pitching');
    url.searchParams.set('season', String(season));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    return listify(response?.stats?.[0]?.splits).some((split) => {
      if (String(split?.date || '') !== String(date)) return false;
      return inningsToOuts(split?.stat?.inningsPitched) > 0
        || statNumber(split?.stat?.numberOfPitches ?? split?.stat?.pitchesThrown) > 0
        || statNumber(split?.stat?.battersFaced) > 0;
    });
  })().catch((error) => {
    pitcherUsageDateCache.delete(cacheKey);
    throw error;
  });
  pitcherUsageDateCache.set(cacheKey, promise);
  return promise;
}

async function markPitchersUsedOnPreviousDate(entries, game) {
  const selectedDate = officialDateForGame(game);
  const [yesterday] = recentCalendarDateWindow(selectedDate, 2);
  if (!yesterday || yesterday === selectedDate) return entries;
  const marked = await mapWithConcurrency(listify(entries), 6, async (entry) => {
    const id = Number(entry?.id ?? entry?.person?.id);
    if (!Number.isFinite(id)) return entry;
    const used = await pitcherUsedOnDate(id, yesterday, game).catch(() => false);
    return used ? { ...entry, usedYesterday: true } : entry;
  });
  return marked;
}

async function ensurePreviewBullpen(game) {
  if (!shouldPreferProbablePitcher(game)) return;
  game.pitching = game.pitching || emptyPitchingData();
  for (const side of ['away', 'home']) {
    const team = side === 'away' ? game.away : game.home;
    const existing = game.pitching?.[side] || { current: null, bullpen: [] };
    const probableId = Number(game?.probablePitchers?.[side]?.id);
    const profiles = await fetchTeamPitcherRosterProfiles(team, game).catch(() => []);
    const profilesById = new Map(profiles.map((profile) => [String(profile.id), profile]));
    const existingBullpen = listify(existing.bullpen)
      .map((entry) => {
        const profile = profilesById.get(String(entry?.id ?? ''));
        return normalizePitcherDisplayEntry(profile ? { ...entry, ...profile, role: entry?.role || 'bullpen' } : entry, entry?.role || 'bullpen');
      })
      .filter(Boolean);
    let bullpen = profiles
      .filter((profile) => Number(profile?.id) !== probableId)
      .filter((profile) => !isStarterLikePitcher(profile) || pitcherSaveCount(profile) > 0 || pitcherGamesFinished(profile) > 0)
      .map((profile) => normalizePitcherDisplayEntry(profile, 'bullpen'))
      .filter(Boolean)
      .sort((a, b) => pitcherSaveCount(b) - pitcherSaveCount(a) || pitcherGamesFinished(b) - pitcherGamesFinished(a) || pitcherStrikeoutCount(b) - pitcherStrikeoutCount(a) || String(a?.name || '').localeCompare(String(b?.name || '')));
    if (!bullpen.length) {
      bullpen = profiles
        .filter((profile) => Number(profile?.id) !== probableId)
        .map((profile) => normalizePitcherDisplayEntry(profile, 'bullpen'))
        .filter(Boolean)
        .sort((a, b) => pitcherSaveCount(b) - pitcherSaveCount(a) || pitcherGamesFinished(b) - pitcherGamesFinished(a) || pitcherStrikeoutCount(b) - pitcherStrikeoutCount(a) || String(a?.name || '').localeCompare(String(b?.name || '')));
    }
    const merged = new Map();
    for (const arm of [...existingBullpen, ...bullpen]) {
      const id = String(arm?.id ?? arm?.fullName ?? arm?.name ?? '');
      if (!id) continue;
      const prev = merged.get(id);
      merged.set(id, prev ? normalizePitcherDisplayEntry({ ...prev, ...arm, role: prev.role || arm.role || 'bullpen' }, 'bullpen') : arm);
    }
    bullpen = [...merged.values()]
      .filter((arm) => Number(arm?.id) !== probableId)
      .sort((a, b) => pitcherSaveCount(b) - pitcherSaveCount(a) || pitcherGamesFinished(b) - pitcherGamesFinished(a) || pitcherStrikeoutCount(b) - pitcherStrikeoutCount(a) || String(a?.name || '').localeCompare(String(b?.name || '')));
    bullpen = await markPitchersUsedOnPreviousDate(bullpen, game);
    game.pitching[side] = { ...existing, bullpen };
    const lookup = Object.fromEntries(profiles.map((profile) => [String(profile.id), profile]));
    if (Object.keys(lookup).length) persistPlayerLookupForGame(game, lookup);
  }
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
  const primaryCount = pitchingEntryCount(primary);
  const secondaryCount = pitchingEntryCount(secondary);
  const current = primary.current || secondary.current || null;
  const history = primary.history?.length ? primary.history : (secondary.history || []);
  if (primaryCount !== secondaryCount) {
    const bullpenSource = (primary.bullpen?.length || 0) >= (secondary.bullpen?.length || 0) ? primary : secondary;
    return {
      current,
      bullpen: bullpenSource.bullpen || [],
      history,
    };
  }
  return {
    current,
    bullpen: (primary.bullpen?.length ? primary.bullpen : secondary.bullpen) || [],
    history,
  };
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
  let awayProbablePitcher = shouldPreferProbablePitcher(game)
    ? options?.probablePitchers?.away || game?.probablePitchers?.away || null
    : options?.probablePitchers?.away || game?.probablePitchers?.away || game?.teams?.away?.probablePitcher || null;
  let homeProbablePitcher = shouldPreferProbablePitcher(game)
    ? options?.probablePitchers?.home || game?.probablePitchers?.home || null
    : options?.probablePitchers?.home || game?.probablePitchers?.home || game?.teams?.home?.probablePitcher || null;
  const awayPlayers = boxscore?.teams?.away?.players || {};
  const homePlayers = boxscore?.teams?.home?.players || {};
  const awayPitcherOrder = boxscore?.teams?.away?.pitchers || [];
  const homePitcherOrder = boxscore?.teams?.home?.pitchers || [];
  const awayOrder = boxscore?.teams?.away?.battingOrder || boxscore?.teams?.away?.batters || [];
  const homeOrder = boxscore?.teams?.home?.battingOrder || boxscore?.teams?.home?.batters || [];
  const activePitcherId = options.currentPitcherId || activePlay?.matchup?.pitcher?.id;
  const nextBatterIds = options.nextBatterIds || nextBatterIdsFromPlayLog(options.allPlays || [], awayOrder, homeOrder);
  const activeBatterId = activePlay?.matchup?.batter?.id;
  const awayLineup = buildLineup(awayPlayers, activeBatterId, awayOrder, nextBatterIds.away);
  const homeLineup = buildLineup(homePlayers, activeBatterId, homeOrder, nextBatterIds.home);

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
        battingSide === 'home' ? activePitcherId : awayProbablePitcher?.id,
        awayProbablePitcher,
        awayPitcherOrder,
      ),
      home: buildPitchingStaff(
        homePlayers,
        battingSide === 'away' ? activePitcherId : homeProbablePitcher?.id,
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
  if (!isCompletedGameCard(card)) return repairDuplicatedTeamLineups(card);
  return repairDuplicatedTeamLineups({
    ...card,
    status: 'Final',
    inning: 'Final',
    inningShort: 'Final',
    balls: 0,
    strikes: 0,
    outs: 0,
  });
}

function isPlaceholderPlay(text) {
  const t = String(text || '').trim().toLowerCase();
  return !t || t.includes('awaiting first pitch');
}

function mergeFinishedGameState(card, cached) {
  if (!cached) return card;
  const sameOfficialDate = calendarDateOnly(card?.officialDate || card?.gameDate || '') === calendarDateOnly(cached?.officialDate || cached?.gameDate || '');
  const mayUseCachedLineup = sameOfficialDate && isCompletedGameCard(card);
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
    lineup: mayUseCachedLineup && cachedLineupCount > 0 ? cached.lineup : card.lineup,
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

function betBuilderIsTeamWin() {
  return (betPropSelectEl?.value || '') === 'teamWin';
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

function readPendingGamePickStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PENDING_GAME_PICKS_STORAGE_KEY) || '[]');
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') {
      return Object.values(parsed).flat().filter(Array.isArray);
    }
    return [];
  } catch {
    return [];
  }
}

function writePendingGamePickStore(picks) {
  try {
    localStorage.setItem(PENDING_GAME_PICKS_STORAGE_KEY, JSON.stringify(Array.isArray(picks) ? picks : []));
  } catch {}
}

function savePendingGamePicks() {
  const picks = [...pendingGamePickSelections.entries()]
    .map(([gamePk, side]) => [String(gamePk), normalizeGamePickSide(side)])
    .filter(([, side]) => side);
  writePendingGamePickStore(picks);
}

function restorePendingGamePicks() {
  const picks = readPendingGamePickStore();
  pendingGamePickSelections = new Map(
    (Array.isArray(picks) ? picks : [])
      .map(([gamePk, side]) => [String(gamePk), normalizeGamePickSide(side)])
      .filter(([gamePk, side]) => gamePk && side),
  );
}

function tossupScoreboardStorageKey(date = dateInput.value || formatDate(new Date())) {
  return `${TOSSUP_SCOREBOARD_STORAGE_KEY}:${date || formatDate(new Date())}`;
}

function readTossupScoreboardStore(date = dateInput.value || formatDate(new Date())) {
  try {
    const parsed = JSON.parse(localStorage.getItem(tossupScoreboardStorageKey(date)) || '[]');
    return Array.isArray(parsed) ? parsed.map((gamePk) => String(gamePk)).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveTossupScoreboards(date = dateInput.value || formatDate(new Date())) {
  try {
    localStorage.setItem(tossupScoreboardStorageKey(date), JSON.stringify([...tossupScoreboardGamePks]));
  } catch {}
}

function restoreTossupScoreboards(date = dateInput.value || formatDate(new Date())) {
  tossupScoreboardGamePks.clear();
  readTossupScoreboardStore(date).forEach((gamePk) => tossupScoreboardGamePks.add(String(gamePk)));
}

function clearCompletedPendingGamePicks(games = latestRenderedGames) {
  if (!pendingGamePickSelections.size || !Array.isArray(games) || !games.length) return false;
  const selectedGamePks = [...pendingGamePickSelections.keys()];
  const selectedGames = selectedGamePks
    .map((gamePk) => games.find((game) => String(game?.gamePk) === String(gamePk)))
    .filter(Boolean);
  if (selectedGames.length !== selectedGamePks.length) return false;
  if (!selectedGames.every((game) => gameStatusIsFinal(game))) return false;
  pendingGamePickSelections = new Map();
  savePendingGamePicks();
  return true;
}

function clearPendingGamePicks({ render = true } = {}) {
  pendingGamePickSelections = new Map();
  savePendingGamePicks();
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
  savePendingGamePicks();
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
  if (!gamePickDraftListEl || !confirmGamePicksBtnEl || !clearGamePicksBtnEl) {
    syncAllCardGamePickStates(games);
    if (activeLineupGame) syncLineupGamePickState(activeLineupGame);
    return;
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
  if (activeLineupGame) syncLineupGamePickState(activeLineupGame);
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

function battingSplitExtraBaseHits(stat = {}) {
  return statNumber(stat.doubles) + statNumber(stat.triples) + statNumber(stat.homeRuns);
}

function gamesSinceBattingEvent(eligibleGames = [], hasEvent = () => false) {
  let gamesSince = 0;
  for (const split of eligibleGames) {
    const stat = split?.stat || {};
    if (hasEvent(stat)) return gamesSince;
    gamesSince += 1;
  }
  return eligibleGames.length ? gamesSince : null;
}

function battingGamesSinceEventsFromSplits(eligibleGames = []) {
  return {
    hr: gamesSinceBattingEvent(eligibleGames, (stat) => statNumber(stat.homeRuns) > 0),
    xbh: gamesSinceBattingEvent(eligibleGames, (stat) => battingSplitExtraBaseHits(stat) > 0),
  };
}

function summarizeLastFiveBattingDetails(splits = [], game = null, gameLimit = 5) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const eligibleGames = filteredRecentHistorySplits(splits, game);
  const games = eligibleGames.slice(0, Math.max(1, Math.floor(Number(gameLimit)) || 5));
  if (!games.length) return null;
  const gamesSince = battingGamesSinceEventsFromSplits(eligibleGames);
  const totals = games.reduce((sum, split) => {
    const stat = split?.stat || {};
    sum.games += 1;
    sum.atBats += statNumber(stat.atBats);
    sum.hits += statNumber(stat.hits);
    sum.hr += statNumber(stat.homeRuns);
    sum.rbi += statNumber(stat.rbi);
    sum.walks += statNumber(stat.baseOnBalls ?? stat.walks);
    sum.so += statNumber(stat.strikeOuts);
    sum.doubles += statNumber(stat.doubles);
    sum.triples += statNumber(stat.triples);
    sum.totalBases += statNumber(stat.totalBases) || totalBasesFromBatting(stat);
    return sum;
  }, { games: 0, atBats: 0, hits: 0, hr: 0, rbi: 0, walks: 0, so: 0, doubles: 0, triples: 0, totalBases: 0 });
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
      doubles: totals.doubles,
      triples: totals.triples,
      totalBases: totals.totalBases,
      xbh: totals.doubles + totals.triples + totals.hr,
    },
    metrics: {
      avg,
      obp,
      slg,
      ops,
    },
    gamesSince,
    hitStreak,
    totalsRows: [
      [`L${totals.games}`, `${totals.hits}-${totals.atBats}`],
      ['AVG', formatBetRate(avg)],
      ['OPS', formatBetRate(ops)],
      ['SLG', formatBetRate(slg)],
      ['XBH', totals.doubles + totals.triples + totals.hr],
      ['HR', totals.hr],
      ['RBI', totals.rbi],
      ['K', totals.so],
    ],
  };
}

function summarizeLastFivePitchingAppearancesDetails(splits = [], game = null) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const appearances = filteredRecentHistorySplits(splits, game)
    .filter((split) => inningsToOuts(split?.stat?.inningsPitched) > 0 || statNumber(split?.stat?.gamesPlayed) > 0)
    .slice(0, 5);
  if (!appearances.length) return null;
  const totals = appearances.reduce((sum, split) => {
    const stat = split?.stat || {};
    sum.games += 1;
    sum.starts += statNumber(stat.gamesStarted) > 0 ? 1 : 0;
    sum.outs += inningsToOuts(stat.inningsPitched);
    sum.k += statNumber(stat.strikeOuts);
    sum.bb += statNumber(stat.baseOnBalls ?? stat.walks);
    sum.hits += statNumber(stat.hits);
    sum.er += statNumber(stat.earnedRuns);
    sum.hr += statNumber(stat.homeRuns ?? stat.hrAllowed ?? stat.hr);
    sum.pitches += statNumber(stat.numberOfPitches ?? stat.pitchesThrown);
    return sum;
  }, { games: 0, starts: 0, outs: 0, k: 0, bb: 0, hits: 0, er: 0, hr: 0, pitches: 0 });
  const era = totals.outs > 0 ? (totals.er * 27) / totals.outs : null;
  const whip = totals.outs > 0 ? ((totals.hits + totals.bb) * 3) / totals.outs : null;
  const lastSplit = appearances[0];
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
    historyTitle: 'RECENT APPEARANCES',
    feature: {
      label: 'LAST APP',
      meta: [formatLeadersDateLabel(lastSplit?.date || selectedDate), lastOpponent ? `vs ${lastOpponent}` : ''].filter(Boolean).join(' '),
      main: `IP ${cleanSummary(lastStat.inningsPitched) || '0.0'}`,
      side: `ER ${statNumber(lastStat.earnedRuns)}`,
      chips: [
        `K ${statNumber(lastStat.strikeOuts)}`,
        `BB ${statNumber(lastStat.baseOnBalls ?? lastStat.walks)}`,
        `H ${statNumber(lastStat.hits)}`,
        `HR ${statNumber(lastStat.homeRuns ?? lastStat.hrAllowed ?? lastStat.hr)}`,
        lastPitches ? `P ${lastPitches}` : 'P --',
      ],
    },
    totalsRows: [
      [`L${totals.games} G`, `${outsToInnings(totals.outs)} IP`],
      ['GS', totals.starts],
      ['ERA', formatRateValue(era, 2, false)],
      ['WHIP', formatRateValue(whip, 2, false)],
      ['K', totals.k],
      ['BB', totals.bb],
      ['H', totals.hits],
      ['ER', totals.er],
      ['HR', totals.hr],
    ],
  };
}

function playerStatRowsHtml(title, rows = []) {
    const safeRows = rows
      .filter((row) => Array.isArray(row) && row.length >= 2)
      .map(([label, value], index) => {
        const isRecentWindow = index === 0 && /^L\d+$/.test(String(label || ''));
        const labelHtml = isRecentWindow
          ? `<button class="player-recent-window-toggle" type="button" aria-pressed="${playerStatRecentGameWindow === 10 ? 'true' : 'false'}" title="Toggle last 5 / last 10 game stats">L${playerStatRecentGameWindow}</button>`
          : escapeHtml(label);
        return `
      <tr>
        <th>${labelHtml}</th>
        <td>${escapeHtml(value)}</td>
      </tr>
    `;
      })
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
    .map(([label, value], index) => {
      const isRecentWindow = index === 0 && /^L\d+$/.test(String(label || ''));
      const labelHtml = isRecentWindow
        ? `<button class="player-recent-window-toggle" type="button" aria-pressed="${playerStatRecentGameWindow === 10 ? 'true' : 'false'}" title="Toggle last 5 / last 10 game stats">L${playerStatRecentGameWindow}</button>`
        : escapeHtml(label);
      return `
      <tr>
        <th>${labelHtml}</th>
        <td>${escapeHtml(value)}</td>
      </tr>
    `;
    })
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

async function getPlayerRecentBattingDetails(playerId, game = null, gameLimit = 5) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const selectedDate = dateInput.value || formatDate(new Date());
  const limit = Math.max(1, Math.floor(Number(gameLimit)) || 5);
  const key = `${id}:${selectedDate}:hitting-details:${limit}:${gameIsLiveForRecentHistory(game) ? String(game?.gamePk || 'live') : 'default'}`;
  if (betPlayerLastFiveCache.has(key)) return betPlayerLastFiveCache.get(key);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'hitting');
    url.searchParams.set('season', String(seasonForDate(selectedDate)));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    return summarizeLastFiveBattingDetails(response?.stats?.[0]?.splits || [], game, limit);
  })().catch((error) => {
    betPlayerLastFiveCache.delete(key);
    throw error;
  });
  betPlayerLastFiveCache.set(key, promise);
  return promise;
}

async function getLineupRecentBattingStats(playerId, game = null, gameLimit = 5) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const selectedDate = dateInput.value || formatDate(new Date());
  const limit = Math.max(1, Math.floor(Number(gameLimit)) || 5);
  const key = `${id}:${selectedDate}:${String(game?.gamePk || 'none')}:lineup-l${limit}-hitting`;
  if (lineupRecentBattingCache.has(key)) return lineupRecentBattingCache.get(key);
  const promise = getPlayerRecentBattingDetails(id, game, limit)
    .then(lineupRecentBattingStatsFromDetails)
    .catch((error) => {
      lineupRecentBattingCache.delete(key);
      throw error;
    });
  lineupRecentBattingCache.set(key, promise);
  return promise;
}

async function getLineupRecentBattingStatsMap(game, lineups = [], gameLimit = 5) {
  if (!document.body?.classList?.contains('dashboard-page')) return new Map();
  const ids = [...new Set(
    listify(lineups)
      .flatMap((lineup) => Array.isArray(lineup) ? lineup : [])
      .map((entry) => Number(entry?.id))
      .filter((id) => Number.isFinite(id) && id > 0),
  )];
  if (!ids.length) return new Map();
  const pairs = await mapWithConcurrency(ids, 6, async (id) => {
    const stats = await getLineupRecentBattingStats(id, game, gameLimit).catch(() => null);
    return [String(id), stats];
  });
  return new Map(pairs.filter((pair) => pair?.[1]));
}

function dueBadgeTitleForEvent(profile, game, details = null, type = 'hr') {
  const batting = profile?.batting || {};
  const games = battingProjectionGames(profile, game);
  const homeRuns = statNumber(batting.hr ?? batting.homeRuns);
  const extraBaseHits = statNumber(batting.doubles) + statNumber(batting.triples) + homeRuns;
  const eventCount = type === 'xbh' ? extraBaseHits : homeRuns;
  const since = Number(type === 'xbh' ? details?.gamesSince?.xbh : details?.gamesSince?.hr);
  const label = type === 'xbh' ? 'XBH' : 'HR';
  if (games <= 0 || eventCount <= 0 || !Number.isFinite(since)) return '';
  const perEvent = games / eventCount;
  if (since - perEvent < 1.5) return '';
  return `Due: ${since.toFixed(0)} games since ${label}, ${perEvent.toFixed(1)} per ${label}`;
}

function dueBadgePayload(profile, game, details = null) {
  return {
    hr: dueBadgeTitleForEvent(profile, game, details, 'hr'),
    xbh: dueBadgeTitleForEvent(profile, game, details, 'xbh'),
  };
}

async function getLineupHomeRunDueBadgeMap(game, lineups = []) {
  const entries = listify(lineups).flatMap((lineup) => Array.isArray(lineup) ? lineup : []);
  const ids = [...new Set(entries.map((entry) => Number(entry?.id)).filter((id) => Number.isFinite(id) && id > 0))];
  if (!ids.length) return new Map();
  const pairs = await mapWithConcurrency(ids, 6, async (id) => {
    const fallbackProfile = game?.playerLookup?.[String(id)] || entries.find((entry) => Number(entry?.id) === id) || null;
    const details = await getPlayerRecentBattingDetails(id, game).catch(() => null);
    let payload = dueBadgePayload(fallbackProfile, game, details);
    if (!payload.hr && !payload.xbh) {
      const fetchedProfile = await fetchMlbPlayerProfile(id, game).catch(() => null);
      if (fetchedProfile) {
        persistPlayerLookupForGame(game, { [String(id)]: fetchedProfile });
        payload = dueBadgePayload(fetchedProfile, game, details);
      }
    }
    return payload.hr || payload.xbh ? [String(id), payload] : null;
  });
  return new Map(pairs.filter(Boolean));
}

async function getPlayerRecentPitchingDetails(playerId, game = null) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const selectedDate = dateInput.value || formatDate(new Date());
  const key = `${id}:${selectedDate}:pitching-appearances-details:${gameIsLiveForRecentHistory(game) ? String(game?.gamePk || 'live') : 'default'}`;
  if (betPlayerLastFiveCache.has(key)) return betPlayerLastFiveCache.get(key);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'pitching');
    url.searchParams.set('season', String(seasonForDate(selectedDate)));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    return summarizeLastFivePitchingAppearancesDetails(response?.stats?.[0]?.splits || [], game);
  })().catch((error) => {
    betPlayerLastFiveCache.delete(key);
    throw error;
  });
  betPlayerLastFiveCache.set(key, promise);
  return promise;
}

function isVeryGoodPitchingAppearance(stat = {}) {
  const earnedRuns = statNumber(stat.earnedRuns);
  const hits = statNumber(stat.hits);
  return hits <= 4 && earnedRuns <= 1;
}

function isBadPitchingAppearance(stat = {}) {
  const earnedRuns = statNumber(stat.earnedRuns);
  const hits = statNumber(stat.hits);
  return hits > 6 && earnedRuns > 5;
}

function pitchingAppearanceHadHomeRun(stat = {}) {
  return statNumber(stat.homeRuns ?? stat.hrAllowed ?? stat.hr) > 0;
}

function isPitchingStartSplit(split = {}) {
  const stat = split?.stat || {};
  const rawStarts = stat.gamesStarted ?? stat.gameStarted ?? stat.starts;
  const starts = statNumber(rawStarts);
  if (starts > 0) return true;
  if (rawStarts != null && starts === 0) return false;
  return inningsToOuts(stat.inningsPitched) > 0;
}

function lastPitchingStartSplit(splits = []) {
  const selectedDate = dateInput.value || formatDate(new Date());
  return listify(splits)
    .filter((split) => split?.date && String(split.date) <= String(selectedDate))
    .filter(isPitchingStartSplit)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0] || null;
}

function pitcherFireStreakFromSplits(splits = []) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const appearances = listify(splits)
    .filter((split) => split?.date && String(split.date) <= String(selectedDate))
    .filter(isPitchingStartSplit)
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
    .filter(isPitchingStartSplit)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 3);
  let streak = 0;
  for (const appearance of appearances) {
    if (!isBadPitchingAppearance(appearance?.stat || {})) break;
    streak += 1;
  }
  return Math.min(3, streak);
}

function pitcherLastStartHomeRunFromSplits(splits = []) {
  const lastStart = lastPitchingStartSplit(splits);
  return lastStart ? pitchingAppearanceHadHomeRun(lastStart.stat || {}) : false;
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

async function getPitcherLastStartHomeRun(playerId) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return false;
  const selectedDate = dateInput.value || formatDate(new Date());
  const key = `${id}:${selectedDate}:pitcher-last-start-hr`;
  if (pitcherColdStreakCache.has(key)) return pitcherColdStreakCache.get(key);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/people/${id}/stats`);
    url.searchParams.set('stats', 'gameLog');
    url.searchParams.set('group', 'pitching');
    url.searchParams.set('season', String(seasonForDate(selectedDate)));
    url.searchParams.set('gameType', 'R');
    const response = await getJson(url.toString());
    return pitcherLastStartHomeRunFromSplits(response?.stats?.[0]?.splits || []);
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

function pitcherLastStartHrMarkerHtml(playerId) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return '';
  return `<span class="pitcher-last-start-hr" data-pitcher-last-hr-id="${id}" aria-label="Allowed home run in last start"></span>`;
}

function pitcherHandAvgMarkersHtml(playerId) {
  const id = Number(playerId);
  if (!Number.isFinite(id) || id <= 0) return '';
  return `<span class="pitcher-hand-markers" data-pitcher-hand-id="${id}" aria-label="Opponent handed average markers"></span>`;
}

function pitcherHomeRunRatePerNine(pitcher) {
  const outs = inningsToOuts(cleanSummary(pitcher?.ip || pitcher?.pitching?.inningsPitched || pitcher?.seasonStats?.pitching?.inningsPitched || pitcher?.stats?.pitching?.inningsPitched));
  if (outs <= 0) return null;
  return (pitcherHomeRunsAllowed(pitcher) * 27) / outs;
}

function pitcherHomeRunRiskMarkerHtml(pitcher) {
  const hrPerNine = pitcherHomeRunRatePerNine(pitcher);
  if (!Number.isFinite(hrPerNine) || hrPerNine < 1.3) return '';
  return `<span class="pitcher-hr-risk" title="Allowing ${hrPerNine.toFixed(2)} HR/9" aria-label="High home run rate">🥶</span>`;
}

function pitcherRateNumber(value) {
  const text = cleanSummary(value);
  if (!text || text === '---') return null;
  const numeric = Number(text.replace(/[^\d.-]/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
}

function pitcherWhipRiskMarkerHtml(pitcher) {
  const whip = pitcherRateNumber(
    pitcher?.whip
      ?? pitcher?.pitching?.whip
      ?? pitcher?.pitching?.walksAndHitsPerInningPitched
      ?? pitcher?.stats?.pitching?.whip
      ?? pitcher?.stats?.pitching?.walksAndHitsPerInningPitched
      ?? pitcher?.seasonStats?.pitching?.whip
      ?? pitcher?.seasonStats?.pitching?.walksAndHitsPerInningPitched,
  );
  if (!Number.isFinite(whip) || whip < 1.4) return '';
  return `<span class="pitcher-whip-risk" title="Allowing ${whip.toFixed(2)} WHIP" aria-label="High WHIP">🧊</span>`;
}

function pitcherNameHtml(pitcher) {
  const usedYesterday = pitcher?.usedYesterday
    ? '<span class="pitcher-used-yesterday" title="Pitched yesterday" aria-label="Pitched yesterday">Y</span>'
    : '';
  return `${escapeHtml(pitcher?.fullName || pitcher?.name || 'Unknown')}${handednessHtml(pitcher?.throws || pitcher?.pitchHand?.code || pitcher?.pitchHand?.description)}${usedYesterday}${pitcherFireMarkerHtml(pitcher?.id)}${pitcherColdMarkerHtml(pitcher?.id)}${pitcherLastStartHrMarkerHtml(pitcher?.id)}${pitcherHandAvgMarkersHtml(pitcher?.id)}${pitcherHomeRunRiskMarkerHtml(pitcher)}${pitcherWhipRiskMarkerHtml(pitcher)}`;
}

function lineupPitcherNameHtml(pitcher) {
  const fullName = pitcher?.fullName || pitcher?.name || 'Unknown';
  const usedYesterday = pitcher?.usedYesterday
    ? '<span class="pitcher-used-yesterday" title="Pitched yesterday" aria-label="Pitched yesterday">Y</span>'
    : '';
  return `
    <span class="pitcher-name-text">${escapeHtml(lastName(fullName) || fullName)}</span>
    ${handednessHtml(pitcher?.throws || pitcher?.pitchHand?.code || pitcher?.pitchHand?.description)}
    ${usedYesterday}
    ${pitcherFireMarkerHtml(pitcher?.id)}
    ${pitcherColdMarkerHtml(pitcher?.id)}
    ${pitcherLastStartHrMarkerHtml(pitcher?.id)}
    ${pitcherHandAvgMarkersHtml(pitcher?.id)}
    ${pitcherHomeRunRiskMarkerHtml(pitcher)}
    ${pitcherWhipRiskMarkerHtml(pitcher)}
  `;
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

function hydratePitcherLastStartHrMarkers(rootEl) {
  const markers = Array.from(rootEl?.querySelectorAll?.('.pitcher-last-start-hr[data-pitcher-last-hr-id]') || []);
  if (!markers.length) return;
  const token = `${Date.now()}:${markers.length}`;
  rootEl.dataset.pitcherLastHrToken = token;
  const ids = [...new Set(markers.map((marker) => Number(marker.dataset.pitcherLastHrId)).filter((id) => Number.isFinite(id) && id > 0))];
  for (const marker of markers) {
    marker.textContent = '';
    marker.title = '';
  }
  Promise.all(ids.map((id) => getPitcherLastStartHomeRun(id).then((allowed) => [id, allowed]).catch(() => [id, false])))
    .then((results) => {
      if (rootEl.dataset.pitcherLastHrToken !== token) return;
      const allowedMap = new Map(results);
      for (const marker of markers) {
        const allowed = Boolean(allowedMap.get(Number(marker.dataset.pitcherLastHrId)));
        marker.textContent = allowed ? 'HR' : '';
        marker.title = allowed ? 'Allowed a home run in last start' : '';
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
  const prop = betPropDefinition(type);
  if (prop.statKind === 'pitching' || (type === 'k' && candidate?.isPitcher)) {
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

function getBetTeamSearchPool(games = latestRenderedGames) {
  const teams = [];
  for (const game of games || []) {
    for (const side of ['away', 'home']) {
      const isAway = side === 'away';
      const teamAbbrev = isAway ? game?.away : game?.home;
      const opponentAbbrev = isAway ? game?.home : game?.away;
      if (!teamAbbrev || !game?.gamePk) continue;
      teams.push({
        gamePk: game.gamePk,
        side,
        teamAbbrev,
        opponentAbbrev,
        teamLogo: isAway ? game.awayLogo : game.homeLogo,
        teamColor: isAway ? game.awayColor : game.homeColor,
        teamNameKey: normalizeNameKey(`${teamSearchText(teamAbbrev)} win w`),
        label: `${displayTeamAbbrev(teamAbbrev)} W vs ${displayTeamAbbrev(opponentAbbrev)}`,
        value: `${displayTeamAbbrev(teamAbbrev)} W vs ${displayTeamAbbrev(opponentAbbrev)} | ${game.gamePk} | ${side}`,
        game,
      });
    }
  }
  return teams.sort((a, b) => (
    String(a.teamAbbrev || '').localeCompare(String(b.teamAbbrev || ''))
    || String(a.opponentAbbrev || '').localeCompare(String(b.opponentAbbrev || ''))
  ));
}

function refreshBetPlayerOptions(games = latestRenderedGames, searchValue = betPlayerSearchEl?.value || '') {
  if (!betPlayerOptionsEl) return;
  const query = normalizeNameKey(searchValue);
  const values = [];
  if (query.length >= 1) {
    const matches = getBetTeamSearchPool(games).filter((team) => (
      team.teamNameKey.includes(query)
      || normalizeNameKey(team.label).includes(query)
      || query.includes(normalizeNameKey(team.teamAbbrev))
    )).slice(0, 12);
    for (const team of matches) {
      values.push(team.value);
    }
    if (betBuilderIsTeamWin()) {
      renderBetOptionValues(values);
      return;
    }
  }
  if (!betBuilderIsTeamWin() && query.length >= BET_PLAYER_SEARCH_MIN_CHARS) {
    const matches = getBetSearchPool(games).filter((player) => player.playerNameKey.includes(query));
    for (const player of matches) {
      values.push(`${player.playerName} | ${player.teamAbbrev || 'MLB'} | ${player.playerId}`);
    }
  }
  renderBetOptionValues(values);
}

function renderBetOptionValues(values = []) {
  if (!betPlayerOptionsEl) return;
  const fingerprint = values.join('\n');
  if (betPlayerOptionsEl.dataset.renderFingerprint === fingerprint) return;
  betPlayerOptionsEl.dataset.renderFingerprint = fingerprint;
  betPlayerOptionsEl.replaceChildren();
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value;
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

function resolveBetSearchTeam(searchValue, games = latestRenderedGames) {
  const text = cleanSummary(searchValue);
  if (!text) return null;
  const teams = getBetTeamSearchPool(games);
  const parts = text.split('|').map((part) => cleanSummary(part)).filter(Boolean);
  if (parts.length >= 3) {
    const gamePk = parts[parts.length - 2];
    const side = normalizeGamePickSide(parts[parts.length - 1]);
    const exact = teams.find((team) => String(team.gamePk) === String(gamePk) && team.side === side);
    if (exact) return exact;
  }
  const query = normalizeNameKey((text.split('|')[0] || text).replace(/\b(?:w|win|wins|to win|moneyline|ml)\b/gi, '').split(' vs ')[0] || text);
  const exact = teams.filter((team) => (
    normalizeNameKey(team.teamAbbrev) === query
    || normalizeNameKey(displayTeamAbbrev(team.teamAbbrev)) === query
    || normalizeNameKey(TEAM_SEARCH_NAMES[canonicalTeamAbbrev(team.teamAbbrev)] || '').split(/\s+/).includes(query)
  ));
  if (exact.length === 1) return exact[0];
  const fuzzy = teams.filter((team) => team.teamNameKey.includes(query) || query.includes(normalizeNameKey(team.teamAbbrev)));
  return fuzzy.length === 1 ? fuzzy[0] : null;
}

function updateBetBuilderMode() {
  const isTeamWin = betBuilderIsTeamWin();
  if (betPlayerSearchEl) {
    betPlayerSearchEl.placeholder = isTeamWin ? 'Search team' : 'Search player';
    betPlayerSearchEl.value = '';
  }
  if (betPropTargetEl) {
    betPropTargetEl.value = '1';
    betPropTargetEl.disabled = isTeamWin;
    betPropTargetEl.closest('label')?.classList.toggle('is-disabled', isTeamWin);
  }
  refreshBetPlayerOptions();
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
  updateBetBuilderMode();
  refreshBetPlayerOptions();
  focusBetPlayerSearch();
}

function addDraftBetLeg() {
  const propType = betPropSelectEl?.value || 'hit';
  const target = normalizeBetTarget(betPropTargetEl?.value || 1);
  const team = resolveBetSearchTeam(betPlayerSearchEl?.value || '', latestRenderedGames);
  if (propType === 'teamWin' || team) {
    if (!team) return false;
    const leg = createGamePickLeg(team.game, team.side);
    if (!leg) return false;
    const exists = draftBetLegs.some((existing) => (
      isGamePickLeg(existing)
      && String(existing.gamePk) === String(leg.gamePk)
      && normalizeGamePickSide(existing.side) === normalizeGamePickSide(leg.side)
    ));
    if (exists) return false;
    draftBetLegs.push(leg);
    renderDraftBetSlip();
    if (betPlayerSearchEl) betPlayerSearchEl.value = '';
    refreshBetPlayerOptions();
    focusBetPlayerSearch();
    return true;
  }
  const player = resolveBetSearchPlayer(betPlayerSearchEl?.value || '', latestRenderedGames);
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

function betContextTargetPlayer(target) {
  if (!(target instanceof Element)) return null;
  const row = target.closest('[data-player-id]');
  const playerId = Number(row?.dataset?.playerId);
  if (!Number.isFinite(playerId) || playerId <= 0) return null;

  const game = (lineupOverlayEl && !lineupOverlayEl.hidden && activeLineupGame)
    ? activeLineupGame
    : latestRenderedGames.find((candidate) => candidate?.playerLookup?.[String(playerId)])
      || null;
  if (!game) return null;

  const profile = game.playerLookup?.[String(playerId)] || {};
  const name = profile.fullName || row.getAttribute('title') || row.querySelector?.('.lineup-name')?.textContent || row.textContent || '';
  const position = profile.position || row.querySelector?.('.lineup-pos')?.textContent || '';
    return {
      playerId,
      playerName: cleanSummary(name).replace(/\s+/g, ' ') || 'Unknown',
      playerNameKey: profile.fullNameKey || normalizeNameKey(name),
      teamAbbrev: profile.teamAbbrev || row.dataset.team || '',
      position,
      isPitcher: String(position || '').toUpperCase() === 'P' || row.classList.contains('bullpen-item') || row.classList.contains('current-pitcher-card'),
    };
}

function quickAddBetLeg(player, propType, target = 1) {
  if (!player || !propType) return false;
  const normalizedTarget = normalizeBetTarget(target);
  draftBetLegs.push({
    playerId: player.playerId,
    playerName: player.playerName,
    playerNameKey: player.playerNameKey || normalizeNameKey(player.playerName),
    teamAbbrev: player.teamAbbrev || '',
    propType,
    target: normalizedTarget,
  });
  renderDraftBetSlip();
  if (betPropTargetEl) betPropTargetEl.value = '1';
  betOddsEl?.focus();
  return true;
}

function openBetContextMenu(player, x, y) {
  const existing = document.getElementById('playerBetMenu');
  if (existing) existing.remove();
  activeBetContextMenuPlayer = player;
  const menu = document.createElement('div');
  menu.id = 'playerBetMenu';
  menu.className = 'player-bet-menu';
  const props = player.isPitcher
    ? [['pitcherK', 'K'], ['pitcherBB', 'BB'], ['pitcherHits', 'Hits Allowed'], ['pitcherER', 'ER'], ['pitcherHR', 'HR Allowed']]
    : [['hit', 'Hit'], ['double', '2B'], ['triple', '3B'], ['hr', 'HR'], ['run', 'Run'], ['tb', 'Total Bases'], ['xbh', 'XBH'], ['rbi', 'RBI'], ['k', 'K']];
  menu.innerHTML = `
    <div class="player-bet-menu-head">
      <strong>${escapeHtml(player.playerName)}</strong>
      <span>${escapeHtml(displayTeamAbbrev(player.teamAbbrev || ''))}</span>
    </div>
    <button class="player-bet-menu-track" type="button" data-menu-action="track-player">Track Player</button>
    <label class="player-bet-menu-target"><span>#</span><input type="number" min="1" step="1" value="1" /></label>
    <div class="player-bet-menu-options"></div>
  `;
  const optionsEl = menu.querySelector('.player-bet-menu-options');
  for (const [prop, label] of props) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.propType = prop;
    btn.textContent = label;
    optionsEl.appendChild(btn);
  }
  const handleMenuAction = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const propBtn = target?.closest?.('[data-prop-type]');
    const trackBtn = target?.closest?.('[data-menu-action="track-player"]');
    const expectationBtn = target?.closest?.('[data-expectation-value]');
    if (!propBtn && !trackBtn && !expectationBtn) return;
    event.preventDefault();
    event.stopPropagation();
    if (trackBtn) {
      showTrackExpectationStep(menu, player);
      return;
    }
    try {
      if (expectationBtn) {
        addPlayerToTracker(player, { expectation: expectationBtn.dataset.expectationValue });
      } else {
        quickAddBetLeg(player, propBtn.dataset.propType, menu.querySelector('input')?.value || 1);
      }
    } catch (error) {
      console.warn('Player context menu action failed', error);
    } finally {
      if (activeBetContextMenuPlayer === player) activeBetContextMenuPlayer = null;
      menu.remove();
    }
  };
  menu.addEventListener('pointerdown', (event) => {
    event.stopPropagation();
    handleMenuAction(event);
  }, true);
  menu.addEventListener('mousedown', (event) => {
    event.stopPropagation();
    handleMenuAction(event);
  }, true);
  menu.addEventListener('click', handleMenuAction, true);
  menu.addEventListener('contextmenu', (event) => event.preventDefault());
  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  menu.style.left = `${Math.min(Math.max(8, x), window.innerWidth - rect.width - 8)}px`;
  menu.style.top = `${Math.min(Math.max(8, y), window.innerHeight - rect.height - 8)}px`;
}

function showTrackExpectationStep(menu, player) {
  menu.innerHTML = `
    <div class="player-bet-menu-head">
      <strong>${escapeHtml(player.playerName)}</strong>
      <span>What do you expect?</span>
    </div>
    <div class="player-confidence-options" aria-label="Expected outcome">
      ${PLAYER_EXPECTATION_OPTIONS.map(([value, label]) => `<button type="button" data-expectation-value="${value}">${label}</button>`).join('')}
    </div>
    <button class="player-bet-menu-track player-bet-menu-cancel" type="button" data-menu-action="cancel-track">Cancel</button>
  `;
  menu.querySelector('[data-menu-action="cancel-track"]')?.addEventListener('click', () => {
    if (activeBetContextMenuPlayer === player) activeBetContextMenuPlayer = null;
    menu.remove();
  }, { once: true });
}

function initPlayerBetContextMenu() {
  document.addEventListener('contextmenu', (e) => {
    if (isTextEntryTarget(e.target)) return;
    e.preventDefault();
    const player = betContextTargetPlayer(e.target);
    if (!player) {
      activeBetContextMenuPlayer = null;
      document.getElementById('playerBetMenu')?.remove();
      return;
    }
    openBetContextMenu(player, e.clientX, e.clientY);
  });
  document.addEventListener('pointerdown', (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target?.closest?.('#playerBetMenu')) {
      activeBetContextMenuPlayer = null;
      document.getElementById('playerBetMenu')?.remove();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      activeBetContextMenuPlayer = null;
      document.getElementById('playerBetMenu')?.remove();
    }
  });
}

function parseTrackedBet(desc) {
  const text = cleanSummary(desc);
  const teamWinMatch = text.match(/^(.*?)\s+(?:to\s+win|wins?|moneyline|ml)$/i);
  if (teamWinMatch) {
    const teamName = cleanSummary(teamWinMatch[1]);
    if (teamName) {
      return {
        type: 'teamWin',
        propType: 'teamWin',
        target: 1,
        teamAbbrev: teamName,
        teamNameKey: normalizeNameKey(teamName),
        raw: text,
      };
    }
  }
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
    const propKind = betPropDefinition(tracked?.type).statKind;
    const profileIsPitcher = String(profile?.position || '').toUpperCase() === 'P';
    if (profileIsPitcher && propKind === 'batting') continue;
    if (!profileIsPitcher && propKind === 'pitching') continue;
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
      const propKind = betPropDefinition(tracked?.type).statKind;
      const entryIsPitcher = String(entry?.position || '').toUpperCase() === 'P';
      if (entryIsPitcher && propKind === 'batting') continue;
      if (!entryIsPitcher && propKind === 'pitching') continue;
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
    const teamKey = normalizeNameKey(leg?.teamAbbrev || leg?.teamName || '');
    const opponentKey = normalizeNameKey(leg?.opponentAbbrev || '');
    const gameHasTeam = (game, keyOrAbbrev) => {
      const key = normalizeNameKey(keyOrAbbrev || '');
      if (!game || !key) return false;
      return [game.away, game.home].some((abbrev) => (
        sameTeamAbbrev(abbrev, keyOrAbbrev)
        || normalizeNameKey(abbrev) === key
        || normalizeNameKey(displayTeamAbbrev(abbrev)) === key
      ));
    };
    const candidateGame = (games || []).find((game) => String(game?.gamePk) === String(leg?.gamePk))
      || (games || []).find((game) => (
        gameHasTeam(game, leg?.teamAbbrev || leg?.teamName || teamKey)
        && (!opponentKey || gameHasTeam(game, leg?.opponentAbbrev || opponentKey))
      ))
      || null;
    if (!candidateGame) return { leg, status: 'unmatched', label: 'SEARCH', active: false, candidate: null, target: 1, currentValue: 0 };
    const awayMatches = gameHasTeam({ away: candidateGame.away, home: '' }, leg?.teamAbbrev || leg?.teamName || teamKey);
    const pickedSide = normalizeGamePickSide(leg?.side || (awayMatches ? 'away' : 'home'));
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

function trackedPlayersStorageKey(date = dateInput.value || formatDate(new Date())) {
  return `${PLAYER_TRACKER_STORAGE_KEY}:${date || formatDate(new Date())}`;
}

function normalizePlayerConfidence(value) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? clamp(n, 1, 5) : 3;
}

const PLAYER_EXPECTATION_OPTIONS = [
  ['H', 'H'],
  ['XBH', 'XBH'],
  ['HR', 'HR'],
  ['2+TB', '2+TB'],
];

function normalizePlayerExpectation(value) {
  const text = String(value || '').trim().toUpperCase().replace(/\s+/g, '');
  if (text === '2TB' || text === '2+TB' || text === 'TB2+') return '2+TB';
  if (['H', 'XBH', 'HR'].includes(text)) return text;
  return 'H';
}

function getTrackedPlayers(date = dateInput.value || formatDate(new Date())) {
  const key = trackedPlayersStorageKey(date);
  if (trackedPlayersMemoryByDate.has(key)) {
    return trackedPlayersMemoryByDate.get(key) || [];
  }
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(parsed)) {
      const filtered = parsed
        .filter((entry) => Number.isFinite(Number(entry?.playerId)))
        .map((entry) => ({ ...entry, expectation: normalizePlayerExpectation(entry?.expectation || entry?.expected || '') }));
      trackedPlayersMemoryByDate.set(key, filtered);
      return filtered;
    }
  } catch {
    return trackedPlayersMemoryByDate.get(key) || [];
  }
  return trackedPlayersMemoryByDate.get(key) || [];
}

function saveTrackedPlayers(players = [], date = dateInput.value || formatDate(new Date())) {
  const key = trackedPlayersStorageKey(date);
  const deduped = [];
  const seen = new Set();
  for (const entry of players) {
    const playerId = Number(entry?.playerId);
    if (!Number.isFinite(playerId) || seen.has(String(playerId))) continue;
    seen.add(String(playerId));
    deduped.push({
      playerId,
      playerName: entry?.playerName || entry?.fullName || entry?.name || 'Unknown',
      teamAbbrev: entry?.teamAbbrev || '',
      position: entry?.position || '',
      expectation: normalizePlayerExpectation(entry?.expectation || entry?.expected || ''),
    });
  }
  trackedPlayersMemoryByDate.set(key, deduped);
  try {
    localStorage.setItem(key, JSON.stringify(deduped));
  } catch {}
  if (playerTrackerListEl) playerTrackerListEl.dataset.renderFingerprint = '';
}

function moveTrackedPlayer(playerId, beforePlayerId = '') {
  const movingId = String(playerId || '');
  const beforeId = String(beforePlayerId || '');
  if (!movingId || movingId === beforeId) return false;
  const tracked = [...getTrackedPlayers()];
  const fromIndex = tracked.findIndex((entry) => String(entry.playerId) === movingId);
  if (fromIndex < 0) return false;
  const [moving] = tracked.splice(fromIndex, 1);
  const toIndex = beforeId
    ? tracked.findIndex((entry) => String(entry.playerId) === beforeId)
    : tracked.length;
  tracked.splice(toIndex >= 0 ? toIndex : tracked.length, 0, moving);
  saveTrackedPlayers(tracked);
  renderPlayerTrackerList(latestRenderedGames);
  return true;
}

function setBetPanelMode(mode = 'bets') {
  betPanelMode = mode === 'input' ? 'input' : mode === 'bets' ? 'bets' : 'players';
  betLogTabBtnEl?.classList.toggle('is-active', betPanelMode === 'bets');
  betInputTabBtnEl?.classList.toggle('is-active', betPanelMode === 'input');
  playerTrackerTabBtnEl?.classList.toggle('is-active', betPanelMode === 'players');
  if (betListEl) {
    betListEl.hidden = betPanelMode !== 'bets';
    betListEl.style.display = betPanelMode === 'bets' ? '' : 'none';
  }
  if (playerTrackerListEl) {
    playerTrackerListEl.hidden = betPanelMode !== 'players';
    playerTrackerListEl.style.display = betPanelMode === 'players' ? '' : 'none';
  }
  if (betInputPanelEl) {
    betInputPanelEl.hidden = betPanelMode !== 'input';
    betInputPanelEl.style.display = betPanelMode === 'input' ? '' : 'none';
  }
  if (clearBetsBtn) {
    clearBetsBtn.hidden = false;
    clearBetsBtn.style.visibility = betPanelMode === 'input' ? 'hidden' : 'visible';
    clearBetsBtn.textContent = betPanelMode === 'players' ? 'CLEAR TRACKED' : 'CLEAR';
  }
}

function resolveTrackedPlayerProfile(entry, games = latestRenderedGames) {
  const playerId = Number(entry?.playerId);
  if (!Number.isFinite(playerId)) return { profile: null, game: null };
  const game = (games || []).find((candidate) => candidate?.playerLookup?.[String(playerId)])
    || getCachedGames().find((candidate) => candidate?.playerLookup?.[String(playerId)])
    || null;
  const profile = game?.playerLookup?.[String(playerId)] || null;
  return { profile, game };
}

function trackedPlayerTodayLine(profile) {
  if (!profile) return 'No game data loaded';
  const batting = cleanSummary(profile.todayBatting || '');
  const pitching = cleanSummary(profile.todayPitching || '');
  const position = String(profile.position || '').toUpperCase();
  if (position === 'P' && pitching && pitching !== 'Unused today') return pitching;
  if (batting && batting !== '0-0') return batting;
  if (pitching && pitching !== 'Unused today') return pitching;
  return batting || pitching || '0-0';
}

function renderPlayerTrackerList(games = latestRenderedGames) {
  if (!playerTrackerListEl) return;
  const tracked = getTrackedPlayers();
  if (tracked.length) {
    setBetPanelMode('players');
  }
  const fingerprint = JSON.stringify({
    day: dateInput.value,
    tracked,
    stats: tracked.map((entry) => {
      const { profile } = resolveTrackedPlayerProfile(entry, games);
      return `${entry.playerId}:${profile?.todayBatting || ''}:${profile?.todayPitching || ''}:${profile?.teamAbbrev || ''}`;
    }),
  });
  if (playerTrackerListEl.dataset.renderFingerprint === fingerprint) return;
  const scrollTop = playerTrackerListEl.scrollTop;
  playerTrackerListEl.dataset.renderFingerprint = fingerprint;
  playerTrackerListEl.replaceChildren();
  if (!tracked.length) {
    const empty = document.createElement('div');
    empty.className = 'lineup-empty';
    empty.textContent = 'No players tracked yet.';
    playerTrackerListEl.appendChild(empty);
  }
  for (const entry of tracked) {
    const { profile, game } = resolveTrackedPlayerProfile(entry, games);
    const playerId = Number(entry.playerId);
    const teamAbbrev = profile?.teamAbbrev || entry.teamAbbrev || '';
    const position = profile?.position || entry.position || '';
    const teamColor = profile?.teamColor || game?.awayColor || game?.homeColor || '#66d9ff';
    const el = document.createElement('div');
    el.className = 'panel-item player-track-item';
    el.dataset.playerId = String(playerId);
    el.dataset.gamePk = String(game?.gamePk || '');
    el.draggable = true;
    el.style.setProperty('--tracker-team-color', teamColor);
    el.style.setProperty('--tracker-team-rgb', hexToRgb(teamColor));
    el.innerHTML = `
      <button class="player-track-drag" type="button" draggable="true" data-player-track-drag="${playerId}" aria-label="Drag to reorder tracked player">||</button>
      <img class="player-track-face" src="${playerHeadshotUrl(playerId)}" alt="${escapeHtml(profile?.fullName || entry.playerName || 'Player')} headshot" />
      <div class="player-track-copy">
        <strong>${escapeHtml(profile?.fullName || entry.playerName || 'Unknown')}</strong>
        <div class="player-track-meta">
          <span>${escapeHtml([displayTeamAbbrev(teamAbbrev), position].filter(Boolean).join(' | '))}</span>
          <label class="player-track-confidence">
            <span>Expect</span>
            <select data-tracked-expectation-id="${playerId}" aria-label="Expected outcome for ${escapeHtml(profile?.fullName || entry.playerName || 'tracked player')}">
              ${PLAYER_EXPECTATION_OPTIONS.map(([value, label]) => `<option value="${value}"${normalizePlayerExpectation(entry.expectation) === value ? ' selected' : ''}>${label}</option>`).join('')}
            </select>
          </label>
        </div>
        <div>${escapeHtml(trackedPlayerTodayLine(profile))}</div>
      </div>
      <button class="player-track-remove" type="button" data-tracked-player-id="${playerId}" aria-label="Remove tracked player">X</button>
    `;
    const img = el.querySelector('.player-track-face');
    if (img) {
      img.onerror = () => {
        img.onerror = null;
        img.src = profile?.teamLogo || getLogoPath(teamAbbrev) || 'placeholder.png';
      };
    }
    playerTrackerListEl.appendChild(el);
  }
  playerTrackerListEl.scrollTop = scrollTop;
}

function addSelectedPlayerToTracker() {
  let player = resolveBetSearchPlayer(betPlayerSearchEl?.value || '', latestRenderedGames);
  if (!player && maybeSelectSingleBetPlayerOption()) {
    player = resolveBetSearchPlayer(betPlayerSearchEl?.value || '', latestRenderedGames);
  }
  if (!player) return false;
  const key = trackedPlayersStorageKey();
  const tracked = trackedPlayersMemoryByDate.has(key)
    ? [...(trackedPlayersMemoryByDate.get(key) || [])]
    : getTrackedPlayers();
  if (!tracked.some((entry) => String(entry.playerId) === String(player.playerId))) {
    tracked.push({ ...player, expectation: normalizePlayerExpectation(player.expectation) });
  }
  saveTrackedPlayers(tracked);
  if (betPlayerSearchEl) betPlayerSearchEl.value = '';
  refreshBetPlayerOptions();
  setBetPanelMode('players');
  if (playerTrackerListEl) playerTrackerListEl.dataset.renderFingerprint = '';
  renderPlayerTrackerList(latestRenderedGames);
  focusBetPlayerSearch();
  return true;
}

function addPlayerToTracker(player, options = {}) {
  if (!player || !Number.isFinite(Number(player.playerId))) return false;
  const key = trackedPlayersStorageKey();
  const tracked = trackedPlayersMemoryByDate.has(key)
    ? [...(trackedPlayersMemoryByDate.get(key) || [])]
    : getTrackedPlayers();
  const existingIndex = tracked.findIndex((entry) => String(entry.playerId) === String(player.playerId));
  const expectation = normalizePlayerExpectation(options.expectation ?? player.expectation);
  if (existingIndex >= 0) {
    tracked[existingIndex] = { ...tracked[existingIndex], expectation };
  } else {
    tracked.push({ ...player, expectation });
  }
  saveTrackedPlayers(tracked);
  setBetPanelMode('players');
  if (playerTrackerListEl) playerTrackerListEl.dataset.renderFingerprint = '';
  renderPlayerTrackerList(latestRenderedGames);
  return true;
}

window.trackActiveContextPlayer = () => addPlayerToTracker(activeBetContextMenuPlayer);

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

function syncLineupGamePickState(game, gamePickStates = trackedGamePickStateMap(latestRenderedGames)) {
  if (!lineupOverlayEl || !game?.gamePk) return;
  const pendingSide = pendingGamePickSelections.get(String(game.gamePk)) || '';
  const tracked = gamePickStates.get(String(game.gamePk)) || { away: '', home: '' };
  const awayState = tracked.away || (pendingSide === 'away' ? 'selected' : '');
  const homeState = tracked.home || (pendingSide === 'home' ? 'selected' : '');
  applyGamePickLogoState(lineupOverlayEl.querySelector('.away-lineup-logo'), awayState);
  applyGamePickLogoState(lineupOverlayEl.querySelector('.home-lineup-logo'), homeState);
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
  setBetPanelMode(betPanelMode);
  renderPlayerTrackerList(games);
  const bets = getBets();
  const betStates = bets.map((bet) => {
    try {
      const resolved = resolveTrackedBet(bet, games);
      return `${resolved.status || ''}:${resolved.label || ''}:${resolved.active ? '1' : '0'}`;
    } catch {
      return 'manual';
    }
  });
  const fingerprint = JSON.stringify({
    day: dateInput.value,
    ids: bets.map((bet) => `${bet.id}:${bet.desc}:${bet.odds}:${bet.amount}:${bet.payout}`),
    states: betStates,
    picks: [...pendingGamePickSelections.entries()],
  });
  if (betListEl.dataset.renderFingerprint === fingerprint) {
    syncAllCardGamePickStates(games);
    return;
  }
  const scrollTop = betListEl.scrollTop;
  betListEl.dataset.renderFingerprint = fingerprint;
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
  betListEl.scrollTop = scrollTop;
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
  betLogTabBtnEl?.addEventListener('click', () => setBetPanelMode('bets'));
  betInputTabBtnEl?.addEventListener('click', () => setBetPanelMode('input'));
  playerTrackerTabBtnEl?.addEventListener('click', () => {
    setBetPanelMode('players');
    renderPlayerTrackerList(latestRenderedGames);
  });
  clearPendingPicksBtnEl?.addEventListener('click', () => clearPendingGamePicks());
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
  initPlayerBetContextMenu();
  updateBetBuilderMode();
  betPlayerSearchEl?.addEventListener('input', () => refreshBetPlayerOptions(latestRenderedGames, betPlayerSearchEl.value));
  betPlayerSearchEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      if (maybeSelectSingleBetPlayerOption()) return;
    }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (betBuilderIsTeamWin()) {
      if (!resolveBetSearchTeam(betPlayerSearchEl.value, latestRenderedGames)) maybeSelectSingleBetPlayerOption();
      if (addDraftBetLeg()) return;
    }
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
  betPropSelectEl?.addEventListener('change', updateBetBuilderMode);
  betPropSelectEl?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (betBuilderIsTeamWin()) {
      focusBetPlayerSearch();
      return;
    }
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
    if (betPanelMode === 'players') {
      saveTrackedPlayers([]);
      renderPlayerTrackerList(latestRenderedGames);
      return;
    }
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
    if (!button) {
      const removeTrackedBtn = e.target.closest('[data-tracked-player-id]');
      if (removeTrackedBtn) {
        const playerId = String(removeTrackedBtn.dataset.trackedPlayerId || '');
        saveTrackedPlayers(getTrackedPlayers().filter((entry) => String(entry.playerId) !== playerId));
        renderPlayerTrackerList(latestRenderedGames);
        return;
      }
      const expectationSelect = e.target.closest('[data-tracked-expectation-id]');
      if (expectationSelect) {
        const playerId = String(expectationSelect.dataset.trackedExpectationId || '');
        saveTrackedPlayers(getTrackedPlayers().map((entry) => (
          String(entry.playerId) === playerId
            ? { ...entry, expectation: normalizePlayerExpectation(expectationSelect.value) }
            : entry
        )));
        renderPlayerTrackerList(latestRenderedGames);
        return;
      }
      const trackedItem = e.target.closest('.player-track-item[data-player-id]');
      if (trackedItem && !e.target.closest('button,select,input,label')) {
        const playerId = Number(trackedItem.dataset.playerId);
        const gamePk = String(trackedItem.dataset.gamePk || '');
        const game = latestRenderedGames.find((g) => String(g.gamePk) === gamePk) || getCachedGames().find((g) => String(g.gamePk) === gamePk);
        if (Number.isFinite(playerId) && game) openPlayerStatOverlay(playerId, game);
      }
      return;
    }
    saveBets(getBets().filter((bet) => bet.id !== button.dataset.betId));
    renderBetList();
  });

  playerTrackerListEl?.addEventListener('click', (e) => {
    const removeTrackedBtn = e.target.closest('[data-tracked-player-id]');
    if (removeTrackedBtn) {
      const playerId = String(removeTrackedBtn.dataset.trackedPlayerId || '');
      saveTrackedPlayers(getTrackedPlayers().filter((entry) => String(entry.playerId) !== playerId));
      renderPlayerTrackerList(latestRenderedGames);
      return;
    }
    const trackedItem = e.target.closest('.player-track-item[data-player-id]');
    if (!trackedItem || e.target.closest('button,select,input,label')) return;
    const playerId = Number(trackedItem.dataset.playerId);
    const gamePk = String(trackedItem.dataset.gamePk || '');
    const game = latestRenderedGames.find((g) => String(g.gamePk) === gamePk) || getCachedGames().find((g) => String(g.gamePk) === gamePk);
    if (Number.isFinite(playerId) && game) openPlayerStatOverlay(playerId, game);
  });
  playerTrackerListEl?.addEventListener('change', (e) => {
    const expectationSelect = e.target.closest('[data-tracked-expectation-id]');
    if (!expectationSelect) return;
    const playerId = String(expectationSelect.dataset.trackedExpectationId || '');
    saveTrackedPlayers(getTrackedPlayers().map((entry) => (
      String(entry.playerId) === playerId
        ? { ...entry, expectation: normalizePlayerExpectation(expectationSelect.value) }
        : entry
    )));
    renderPlayerTrackerList(latestRenderedGames);
  });
  playerTrackerListEl?.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.player-track-item[data-player-id]');
    if (!item) return;
    item.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.dataset.playerId || '');
  });
  playerTrackerListEl?.addEventListener('dragover', (e) => {
    const draggingId = e.dataTransfer?.getData('text/plain') || playerTrackerListEl.querySelector('.player-track-item.is-dragging')?.dataset.playerId || '';
    if (!draggingId) return;
    const overItem = e.target.closest('.player-track-item[data-player-id]');
    if (!overItem || overItem.dataset.playerId === draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = overItem.getBoundingClientRect();
    overItem.classList.toggle('is-drop-before', e.clientY < rect.top + (rect.height / 2));
    overItem.classList.toggle('is-drop-after', e.clientY >= rect.top + (rect.height / 2));
  });
  playerTrackerListEl?.addEventListener('dragleave', (e) => {
    const item = e.target.closest('.player-track-item');
    item?.classList.remove('is-drop-before', 'is-drop-after');
  });
  playerTrackerListEl?.addEventListener('drop', (e) => {
    const movingId = e.dataTransfer?.getData('text/plain') || '';
    const overItem = e.target.closest('.player-track-item[data-player-id]');
    if (!movingId || !overItem) return;
    e.preventDefault();
    const rect = overItem.getBoundingClientRect();
    const after = e.clientY >= rect.top + (rect.height / 2);
    const tracked = getTrackedPlayers();
    const overIndex = tracked.findIndex((entry) => String(entry.playerId) === String(overItem.dataset.playerId || ''));
    const beforeEntry = after ? tracked[overIndex + 1] : tracked[overIndex];
    moveTrackedPlayer(movingId, beforeEntry?.playerId || '');
  });
  playerTrackerListEl?.addEventListener('dragend', () => {
    playerTrackerListEl.querySelectorAll('.player-track-item').forEach((item) => {
      item.classList.remove('is-dragging', 'is-drop-before', 'is-drop-after');
    });
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
  const games = (schedule?.dates?.[0]?.games || []).filter((game) => !isPostponedGameStatus(game));
  const homeRuns = [];
  const matchupEvents = [];
  const cachedCards = new Map(getCachedGames().map((card) => [card.gamePk, card]));
  const teamStreaks = await getTeamStreakMap(date).catch(() => new Map());
  const cardResults = await Promise.all(games.map(async (game) => {
    const gamePk = game.gamePk;
    const gameOfficialDate = officialDateForGame(game, date);
    const isFuturePreview = game?.status?.abstractGameState === 'Preview' && gameOfficialDate > formatDate(new Date());
    if (isFuturePreview) {
      const awayTeam = game?.teams?.away?.team || {};
      const homeTeam = game?.teams?.home?.team || {};
      const awayAbbrev = awayTeam.abbreviation || awayTeam.teamCode?.toUpperCase() || awayTeam.name || 'AWAY';
      const homeAbbrev = homeTeam.abbreviation || homeTeam.teamCode?.toUpperCase() || homeTeam.name || 'HOME';
      const awayColor = getTeamColor(awayAbbrev);
      const homeColor = getTeamColor(homeAbbrev);
      let probablePitchers = sanitizeProbablePitchers({
        away: game?.teams?.away?.probablePitcher || null,
        home: game?.teams?.home?.probablePitcher || null,
      }, game, awayAbbrev, homeAbbrev);
      if (probablePitchersNeedFallback(probablePitchers)) {
        const officialProbables = await fetchOfficialProbablePitchersForGame(
          game,
          awayAbbrev,
          homeAbbrev,
          gameOfficialDate,
        ).catch(() => null);
        probablePitchers = sanitizeProbablePitchers(officialProbables || probablePitchers, game, awayAbbrev, homeAbbrev);
      }
      if (shouldPreferProbablePitcher(game)) {
        probablePitchers = await fillPotentialStartersForTbdProbables(probablePitchers, game, awayAbbrev, homeAbbrev, gameOfficialDate);
      }
      return normalizeCompletedCard({
        gamePk,
        gameDate: game?.gameDate || '',
        officialDate: gameOfficialDate,
        gameNumber: game?.gameNumber || 1,
        doubleHeader: game?.doubleHeader || 'N',
        away: awayAbbrev,
        home: homeAbbrev,
        awayRecord: formatTeamRecord(game?.teams?.away),
        homeRecord: formatTeamRecord(game?.teams?.home),
        awayStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.away, null, awayAbbrev),
        homeStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.home, null, homeAbbrev),
        awayScore: '-',
        homeScore: '-',
        awayHits: '-',
        homeHits: '-',
        status: statusLine(game),
        inning: statusLine(game),
        inningShort: 'PRE',
        balls: 0,
        strikes: 0,
        outs: 0,
        lineScoreInnings: [],
        awayColor,
        homeColor,
        awayLogo: getLogoPath(awayAbbrev),
        homeLogo: getLogoPath(homeAbbrev),
        awayPitcher: '-',
        homePitcher: '-',
        awayHitter: '-',
        homeHitter: '-',
        bases: { first: false, second: false, third: false },
        ticker: [],
        playByPlay: [],
        lastPlay: defaultPlayText(game),
        currentEvent: '',
        activeBatterId: null,
        battingSide: 'away',
        probablePitchers,
        lineup: emptyLineupData(),
        pitching: emptyPitchingData(),
        playerLookup: {},
      });
    }
    try {
      const live = await getLiveGameFeed(gamePk);
      const boxscore = live?.liveData?.boxscore || {};
      const linescore = live?.liveData?.linescore || {};
      const allPlays = live?.liveData?.plays?.allPlays || [];
      const currentPlay = live?.liveData?.plays?.currentPlay;
      const activePlay = resolveActivePlay(game, currentPlay, allPlays);

      const awayTeam = live?.gameData?.teams?.away || game?.teams?.away?.team || {};
      const homeTeam = live?.gameData?.teams?.home || game?.teams?.home?.team || {};
      const awayAbbrev = awayTeam.abbreviation || awayTeam.teamCode?.toUpperCase() || awayTeam.name || 'AWAY';
      const homeAbbrev = homeTeam.abbreviation || homeTeam.teamCode?.toUpperCase() || homeTeam.name || 'HOME';
      let probablePitchers = sanitizeProbablePitchers({
        away: live?.gameData?.teams?.away?.probablePitcher || game?.teams?.away?.probablePitcher || null,
        home: live?.gameData?.teams?.home?.probablePitcher || game?.teams?.home?.probablePitcher || null,
      }, game, awayAbbrev, homeAbbrev);
      if (shouldPreferProbablePitcher(game) && probablePitchersNeedFallback(probablePitchers)) {
        const officialProbables = await fetchOfficialProbablePitchersForGame(
          game,
          awayAbbrev,
          homeAbbrev,
          officialDateForGame(game, date),
        );
        probablePitchers = sanitizeProbablePitchers(officialProbables || {}, game, awayAbbrev, homeAbbrev);
      }
      if (shouldPreferProbablePitcher(game)) {
        probablePitchers = await fillPotentialStartersForTbdProbables(probablePitchers, game, awayAbbrev, homeAbbrev, officialDateForGame(game, date));
      }
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

      const pitcherHrTotalsInGame = new Map();
      for (const play of allPlays) {
        if (play?.result?.event !== 'Home Run') continue;
        const pitcherId = Number(play?.matchup?.pitcher?.id);
        if (!Number.isFinite(pitcherId)) continue;
        pitcherHrTotalsInGame.set(pitcherId, (pitcherHrTotalsInGame.get(pitcherId) || 0) + 1);
      }
      const pitcherHrSeenInGame = new Map();
      for (const play of allPlays) {
        if (play?.about?.isComplete && play?.matchup?.batter?.id && play?.matchup?.pitcher?.id) {
          matchupEvents.push({ play, game: { gamePk, away: awayAbbrev, home: homeAbbrev }, playerLookup });
        }
        if (play?.result?.event === 'Home Run') {
          const batterId = play?.matchup?.batter?.id;
          const pitcherId = play?.matchup?.pitcher?.id;
          const batter = play?.matchup?.batter?.fullName || 'Unknown';
          const pitcherProfile = pitcherId ? playerLookup[String(pitcherId)] || playerLookup[`ID${pitcherId}`] : null;
          const pitcherName = play?.matchup?.pitcher?.fullName || pitcherProfile?.fullName || '';
          const numericPitcherId = Number(pitcherId);
          const pitcherGameHrIndex = Number.isFinite(numericPitcherId) ? (pitcherHrSeenInGame.get(numericPitcherId) || 0) + 1 : 0;
          if (Number.isFinite(numericPitcherId)) pitcherHrSeenInGame.set(numericPitcherId, pitcherGameHrIndex);
          const pitcherSeasonHrAllowed = pitcherProfile ? pitcherHomeRunsAllowed(pitcherProfile) : null;
          const pitcherGameHrTotal = Number.isFinite(numericPitcherId) ? pitcherHrTotalsInGame.get(numericPitcherId) || 0 : 0;
          const pitcherHrAllowedDisplay = Number.isFinite(Number(pitcherSeasonHrAllowed))
            ? Math.max(0, Number(pitcherSeasonHrAllowed) - pitcherGameHrTotal) + pitcherGameHrIndex
            : null;
          const half = play?.about?.halfInning;
          const battingTeamAbbr = half === 'top' ? awayAbbrev : homeAbbrev;
          const battingColor = half === 'top' ? awayColor : homeColor;
          const battingSide = half === 'top' ? 'away' : 'home';
          const players = half === 'top' ? awayPlayers : homePlayers;
          const jersey = players[`ID${batterId}`]?.jerseyNumber || '?';
          const isWalkOffHr = isWalkOffHomeRunByPlayHistory(play, allPlays, battingSide);
          const ratingPlay = isWalkOffHr
            ? { ...play, about: { ...(play.about || {}), isWalkOff: true }, result: { ...(play.result || {}), isWalkOff: true } }
            : play;
          const parsedHrNo = parseHrNumber(play?.result?.description || '');
          const lookupHrNo = parsedHrNo ? null : lookupPlayerSeasonHomeRuns(batterId, playerLookup);
          const fetchedHrNo = (parsedHrNo || lookupHrNo) ? null : await getPlayerSeasonHomeRuns(batterId, date).catch(() => null);
          const hrNo = parsedHrNo || lookupHrNo || fetchedHrNo;
          const distance = play?.playEvents?.find((e) => e?.hitData?.totalDistance)?.hitData?.totalDistance || null;
          const ratingBreakdown = homeRunRatingBreakdown(ratingPlay, pitcherProfile, distance, battingSide);

          homeRuns.push({
            gamePk,
            batterId,
            batter,
            jersey,
            resultLabel: homeRunResultLabel(play, isWalkOffHr),
            hrNo,
            distance,
            pitcherId,
            pitcherName,
            pitcherHand: handednessCode(pitcherProfile?.throws || pitcherProfile?.pitching?.throws || pitcherProfile?.pitchHand?.code || play?.matchup?.pitchHand?.code || ''),
            pitcherHrAllowed: pitcherHrAllowedDisplay,
            eventTimeMs: playTimestampMs(play, (Date.parse(game?.gameDate || date) || 0) + ((play?.about?.atBatIndex ?? 0) * 1000)),
            eventTimeEt: formatEasternClock(playTimestampMs(play, (Date.parse(game?.gameDate || date) || 0) + ((play?.about?.atBatIndex ?? 0) * 1000))),
            inningText: formatHrInningText(play),
            rating: ratingBreakdown.score,
            ratingBreakdown,
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
        awayScore: game?.status?.abstractGameState === 'Preview' ? '-' : gameScoreForSide(game, linescore, allPlays, 'away'),
        homeScore: game?.status?.abstractGameState === 'Preview' ? '-' : gameScoreForSide(game, linescore, allPlays, 'home'),
        awayHits: game?.status?.abstractGameState === 'Preview' ? '-' : gameHitsForSide(linescore, 'away'),
        homeHits: game?.status?.abstractGameState === 'Preview' ? '-' : gameHitsForSide(linescore, 'home'),
        status: statusLine(game),
        inning: inning.long,
        inningShort: inning.short,
        balls: count.balls,
        strikes: count.strikes,
        outs: count.outs,
        lineScoreInnings: Array.isArray(linescore?.innings) ? linescore.innings : [],
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
        playByPlay: allPlays.map((play) => ({
          inning: play?.about?.inning || '',
          half: play?.about?.halfInning || '',
          event: play?.result?.event || '',
          description: playByPlayDescription(play),
          color: play?.about?.halfInning === 'top' ? awayColor : homeColor,
          atBatIndex: play?.about?.atBatIndex ?? 0,
        })),
        lastPlay: ticker[0]?.text || defaultPlayText(game),
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
        currentPitcherId: ppl.currentPitcherId,
        allPlays,
      });
      card.lineup = derived.lineup;
      card.pitching = derived.pitching;
      card.pitching.away.history = pitcherAppearanceHistoryForSide(boxscore, 'away', allPlays);
      card.pitching.home.history = pitcherAppearanceHistoryForSide(boxscore, 'home', allPlays);
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
            currentPitcherId: ppl.currentPitcherId,
            allPlays,
          });
          card = {
            ...card,
            lineup: chooseBetterLineup(boxDerived.lineup, card.lineup),
            pitching: chooseBetterPitching({
              away: { ...boxDerived.pitching.away, history: pitcherAppearanceHistoryForSide(box, 'away', allPlays) },
              home: { ...boxDerived.pitching.home, history: pitcherAppearanceHistoryForSide(box, 'home', allPlays) },
            }, card.pitching),
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
        derivedPitching = chooseBetterPitching({
          away: { ...boxDerived.pitching.away, history: pitcherAppearanceHistoryForSide(box, 'away', []) },
          home: { ...boxDerived.pitching.home, history: pitcherAppearanceHistoryForSide(box, 'home', []) },
        }, derivedPitching);
        derivedLookup = { ...derivedLookup, ...boxDerived.playerLookup };
      } catch {}
      let fallbackProbablePitchers = sanitizeProbablePitchers({
        away: game?.teams?.away?.probablePitcher || cached?.probablePitchers?.away || null,
        home: game?.teams?.home?.probablePitcher || cached?.probablePitchers?.home || null,
      }, { ...game, playerLookup: derivedLookup }, awayFromSchedule, homeFromSchedule);
      if (shouldPreferProbablePitcher(game) && probablePitchersNeedFallback(fallbackProbablePitchers)) {
        const officialProbables = await fetchOfficialProbablePitchersForGame(
          { ...game, playerLookup: derivedLookup },
          awayFromSchedule,
          homeFromSchedule,
          officialDateForGame(game, date),
        );
        fallbackProbablePitchers = sanitizeProbablePitchers(officialProbables || {}, { ...game, playerLookup: derivedLookup }, awayFromSchedule, homeFromSchedule);
      }
      if (shouldPreferProbablePitcher(game)) {
        fallbackProbablePitchers = await fillPotentialStartersForTbdProbables(fallbackProbablePitchers, { ...game, playerLookup: derivedLookup }, awayFromSchedule, homeFromSchedule, officialDateForGame(game, date));
      }
      if (cached) {
        return normalizeCompletedCard({
          ...cached,
          gameDate: game?.gameDate || cached?.gameDate || '',
          officialDate: game?.officialDate || schedule?.dates?.[0]?.date || cached?.officialDate || '',
          gameNumber: game?.gameNumber || cached?.gameNumber || 1,
          doubleHeader: game?.doubleHeader || cached?.doubleHeader || 'N',
          lineup: lineupCount(derivedLineup) > 0 ? derivedLineup : emptyLineupData(),
          pitching: chooseBetterPitching(derivedPitching, cached?.pitching),
          awayScore: game?.status?.abstractGameState === 'Preview' ? '-' : (game?.teams?.away?.score ?? cached.awayScore),
          homeScore: game?.status?.abstractGameState === 'Preview' ? '-' : (game?.teams?.home?.score ?? cached.homeScore),
          awayRecord: formatTeamRecord(game?.teams?.away) || cached?.awayRecord || '',
          homeRecord: formatTeamRecord(game?.teams?.home) || cached?.homeRecord || '',
          awayStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.away, null, awayFromSchedule) || cached?.awayStreak || '',
          homeStreak: teamStreakForGameTeam(teamStreaks, game?.teams?.home, null, homeFromSchedule) || cached?.homeStreak || '',
          status: statusLine(game) || cached.status,
          probablePitchers: fallbackProbablePitchers,
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
        playByPlay: [],
        lastPlay: defaultPlayText(game),
        currentEvent: '',
        activeBatterId: null,
        battingSide: 'away',
        probablePitchers: fallbackProbablePitchers,
        lineup: derivedLineup,
        pitching: derivedPitching,
        playerLookup: derivedLookup,
      });
    }
  }));

  const cards = dedupeGameCards(cardResults.filter(Boolean), date);
  saveAnalyticsDayIndex(date, buildDailyAnalyticsIndex(date, cards, matchupEvents));
  homeRuns.sort((a, b) => (Number(b.eventTimeMs) || 0) - (Number(a.eventTimeMs) || 0) || b.gamePk - a.gamePk || b.order - a.order);
  try {
    localStorage.setItem(`hrs:${date}`, JSON.stringify(homeRuns.slice(0, 120)));
    localStorage.setItem(hrLoadedStorageKey(date), '1');
  } catch {}
  return { cards, homeRuns };
}

async function fetchMlbFallbackCards(date, cachedCards) {
  try {
    const schedule = await getSchedule(date);
    const games = (schedule?.dates?.[0]?.games || []).filter((game) => !isPostponedGameStatus(game));
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
        derivedPitching.away.history = pitcherAppearanceHistoryForSide(box, 'away', []);
        derivedPitching.home.history = pitcherAppearanceHistoryForSide(box, 'home', []);
        derivedLookup = { ...derivedLookup, ...derived.playerLookup };
      } catch {}

      let probablePitchers = sanitizeProbablePitchers({
        away: game?.teams?.away?.probablePitcher || cached?.probablePitchers?.away || null,
        home: game?.teams?.home?.probablePitcher || cached?.probablePitchers?.home || null,
      }, { ...game, playerLookup: derivedLookup }, awayAbbrev, homeAbbrev);
      if (shouldPreferProbablePitcher(game) && probablePitchersNeedFallback(probablePitchers)) {
        const officialProbables = await fetchOfficialProbablePitchersForGame(
          { ...game, playerLookup: derivedLookup },
          awayAbbrev,
          homeAbbrev,
          officialDateForGame(game, date),
        );
        probablePitchers = sanitizeProbablePitchers(officialProbables || {}, { ...game, playerLookup: derivedLookup }, awayAbbrev, homeAbbrev);
      }
      if (shouldPreferProbablePitcher(game)) {
        probablePitchers = await fillPotentialStartersForTbdProbables(probablePitchers, { ...game, playerLookup: derivedLookup }, awayAbbrev, homeAbbrev, officialDateForGame(game, date));
      }

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
        inning: /cancel|postpon|suspend|delay|makeup/i.test(detail) ? detail : (cached?.inning || detail),
        inningShort: /cancel|postpon|suspend|delay|makeup/i.test(detail) ? detail : (cached?.inningShort || detail),
        awayColor,
        homeColor,
        awayLogo: cached?.awayLogo || getLogoPath(awayAbbrev),
        homeLogo: cached?.homeLogo || getLogoPath(homeAbbrev),
        awayPitcher: cached?.awayPitcher || '-',
        homePitcher: cached?.homePitcher || '-',
        awayHitter: cached?.awayHitter || '-',
        homeHitter: cached?.homeHitter || '-',
        probablePitchers,
        balls: cached?.balls ?? 0,
        strikes: cached?.strikes ?? 0,
        outs: cached?.outs ?? 0,
        bases: cached?.bases || { first: false, second: false, third: false },
        ticker: cached?.ticker || [],
        lastPlay: !isPlaceholderPlay(cached?.lastPlay) ? cached.lastPlay : defaultPlayText(game),
        currentEvent: cached?.currentEvent || '',
        lineup: lineupCount(cached?.lineup) > 0 ? cached.lineup : derivedLineup,
        pitching: chooseBetterPitching(derivedPitching, cached?.pitching),
        playerLookup: derivedLookup,
      };
    }));

    return dedupeGameCards(cards.map(normalizeCompletedCard), date);
  } catch {
    return [];
  }
}

function currentHomeRunSortLabel() {
  return homeRunFeedSortMode === 'rating' ? 'highest rated first' : 'latest first';
}

function homeRunSortValue(hr) {
  const rating = Number(hr?.rating ?? hr?.ratingBreakdown?.score);
  return Number.isFinite(rating) ? rating : -1;
}

function homeRunGradeLabel(value) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return '--';
  if (rating < 150) return 'C';
  if (rating < 200) return 'C+';
  if (rating <= 250) return 'B-';
  if (rating < 300) return 'B';
  if (rating <= 350) return 'B+';
  if (rating <= 400) return 'A-';
  if (rating <= 450) return 'A';
  if (rating < 500) return 'A+';
  return 'S';
}

function homeRunRatingDisplayLabel(value) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return '--';
  return homeRunRatingDisplayMode === 'letter' ? homeRunGradeLabel(rating) : String(Math.round(rating));
}

function sortHomeRunFeedItems(items) {
  return items.slice().sort((a, b) => {
    if (homeRunFeedSortMode === 'rating') {
      return homeRunSortValue(b) - homeRunSortValue(a)
        || (Number(b.eventTimeMs) || 0) - (Number(a.eventTimeMs) || 0)
        || Number(b.gamePk || 0) - Number(a.gamePk || 0)
        || Number(b.order || 0) - Number(a.order || 0);
    }
    return (Number(b.eventTimeMs) || 0) - (Number(a.eventTimeMs) || 0)
      || Number(b.gamePk || 0) - Number(a.gamePk || 0)
      || Number(b.order || 0) - Number(a.order || 0);
  });
}

function cachedHomeRunsForSelectedDate() {
  try {
    return JSON.parse(localStorage.getItem(storageKey('hrs')) || '[]');
  } catch {
    return [];
  }
}

function currentHomeRunFeedItems(homeRuns = []) {
  if (Array.isArray(homeRuns) && homeRuns.length) {
    latestRenderedHomeRuns = homeRuns.slice();
    return latestRenderedHomeRuns;
  }
  if (latestRenderedHomeRuns.length) return latestRenderedHomeRuns;
  return cachedHomeRunsForSelectedDate();
}

function refreshHomeRunFeedAfterControlChange() {
  if (hrRatingDialogEl) hrRatingDialogEl.hidden = true;
  renderHomeRunFeed(latestRenderedHomeRuns);
  if (!latestRenderedHomeRuns.length && !cachedHomeRunsForSelectedDate().length && !loadGamesInFlight) {
    loadGames({ invalidate: true });
  }
}

function renderHomeRunFeed(homeRuns) {
  if (hrSortToggleBtnEl) hrSortToggleBtnEl.textContent = currentHomeRunSortLabel();
  if (hrGradeToggleBtnEl) hrGradeToggleBtnEl.textContent = homeRunRatingDisplayMode === 'letter' ? 'letter' : 'number';
  const list = sortHomeRunFeedItems(currentHomeRunFeedItems(homeRuns));
  const seen = new Set();
  for (const hr of list) {
    const key = [
      hr.gamePk ?? '',
      hr.batterId ?? hr.batter ?? '',
      hr.eventTimeMs ?? hr.order ?? '',
      hr.hrNo ?? '',
    ].join(':');
    seen.add(key);
    let item = hrListEl.querySelector(`.hr-item[data-hr-key="${cssEscape(key)}"]`);
    if (!item) {
      item = document.createElement('div');
      item.className = 'panel-item hr-item';
      item.dataset.hrKey = key;
      item.innerHTML = `
        <img class="hr-logo" src="placeholder.png" alt="team" />
        <div class="hr-copy">
          <div class="hr-name"></div>
          <div class="hr-meta"></div>
        </div>
        <div class="hr-rating" title="1000-point Home Run Rating"></div>
      `;
      const img = item.querySelector('img');
      img.onerror = () => {
        img.onerror = null;
        img.src = 'placeholder.png';
      };
    }
    item.dataset.gamePk = String(hr.gamePk ?? '');
    item.dataset.playerId = String(hr.batterId ?? '');
    const isWalkOff = Number(hr?.ratingBreakdown?.walkOff || 0) > 0;
    item.classList.toggle('hr-item-walkoff', isWalkOff);
    item.dataset.hr = JSON.stringify({
      batter: hr.batter || 'Unknown',
      resultLabel: hr.resultLabel || 'Homerun',
      rating: hr.rating ?? hr.ratingBreakdown?.score ?? null,
      ratingBreakdown: hr.ratingBreakdown || null,
      distance: hr.distance || null,
      inningText: hr.inningText || '',
      pitcherName: hr.pitcherName || '',
      pitcherHand: hr.pitcherHand || '',
    });
    item.style.setProperty('--hr-team-color', hr.teamColor || '#66d9ff');
    item.style.setProperty('--hr-team-rgb', hexToRgb(hr.teamColor || '#66d9ff'));
    const img = item.querySelector('.hr-logo');
    if (img && img.dataset.src !== String(hr.teamLogo || 'placeholder.png')) {
      img.dataset.src = String(hr.teamLogo || 'placeholder.png');
      img.src = img.dataset.src;
    }
    if (img) img.alt = `${hr.teamAbbr || 'team'} logo`;
    const nameEl = item.querySelector('.hr-name');
    if (nameEl) {
      nameEl.textContent = `${hr.batter || 'Unknown'} ${hr.resultLabel || 'Homerun'}`;
      nameEl.style.color = hr.teamColor || '#dbebff';
    }
    const metaEl = item.querySelector('.hr-meta');
    if (metaEl) {
      const hrBits = [
        hr.hrNo ? `${ordinalNumber(hr.hrNo)} HR of season` : 'Season HR #?',
        hr.distance ? `${hr.distance} ft` : '',
        hr.eventTimeEt ? `${hr.eventTimeEt} EST${hr.inningText ? ` | ${hr.inningText}` : ''}` : (hr.inningText || ''),
      ].filter(Boolean);
      const pitcherBits = [
        hr.pitcherName ? `${hr.pitcherName} (${hr.pitcherHand || '-'})` : '',
        Number.isFinite(Number(hr.pitcherHrAllowed)) ? `HR allowed #${Number(hr.pitcherHrAllowed)}` : '',
      ].filter(Boolean);
      metaEl.textContent = `${hrBits.join(' | ')}${pitcherBits.length ? `\n${pitcherBits.join(' | ')}` : ''}`;
    }
    const ratingEl = item.querySelector('.hr-rating');
    if (ratingEl) {
      const rating = Number(hr.rating);
      ratingEl.textContent = homeRunRatingDisplayLabel(rating);
      ratingEl.title = 'Click for Home Run Rating breakdown';
    }
    hrListEl.appendChild(item);
  }
  for (const item of Array.from(hrListEl.querySelectorAll('.hr-item[data-hr-key]'))) {
    if (!seen.has(item.dataset.hrKey)) item.remove();
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
  if (currentOverlayPage === 'teamStats') {
    if (currentLeadersOpponentMode && matchup) return `${displayTeamAbbrev(matchup.away)} vs ${displayTeamAbbrev(matchup.home)} team stats | ${season}`;
    if (teamAbbrev) return `${displayTeamAbbrev(teamAbbrev)} team stats | ${season}`;
    return `MLB team stats | ${season}`;
  }
  if (currentOverlayPage === 'hrLeaderboard') {
    return `Home run rating leaderboard | ${season}`;
  }
  const positionText = selectedLeaderPosition() ? ` | ${selectedLeaderPosition()}` : '';
  if (currentLeadersOpponentMode && matchup) return `${displayTeamAbbrev(matchup.away)} vs ${displayTeamAbbrev(matchup.home)} leaders | ${formatLeadersDateLabel(date)}${positionText}`;
  if (teamAbbrev) return `${displayTeamAbbrev(teamAbbrev)} season leaders | ${season}${positionText}`;
  return `MLB season leaders | ${season}${positionText}`;
}

function updateLeadersContext() {
  if (!leadersContextEl) return;
  leadersContextEl.textContent = leaderContextSummary();
}

function overlayPageLabel(page) {
  switch (page) {
    case 'leaders': return 'Leaders';
    case 'hot': return 'Hot Players';
    case 'teamStats': return 'Team Stats';
    case 'hrLeaderboard': return 'HR Leaderboard';
    default: return 'Scoreboard';
  }
}

function hrBreakdownRowsHtml(breakdown) {
  const rows = [
    ['Walk-off', breakdown?.walkOff],
    ['Inning', breakdown?.inning],
    ['Result', breakdown?.result],
    ['Runs', breakdown?.runs],
    ['Pitcher Difficulty', breakdown?.pitcher],
    ['Distance', breakdown?.distance],
  ];
  return rows.map(([label, value]) => `
    <div class="hr-rating-row">
      <span>${escapeHtml(label)}</span>
      <strong>${Number.isFinite(Number(value)) ? Math.round(Number(value)) : '--'}</strong>
    </div>
  `).join('');
}

function openHomeRunRatingDialogFromItem(item) {
  if (!hrRatingDialogEl || !item) return;
  let data = null;
  try {
    data = JSON.parse(item.dataset.hr || '{}');
  } catch {
    data = null;
  }
  const breakdown = data?.ratingBreakdown || null;
  const score = Number(data?.rating ?? breakdown?.score);
  const detailBits = [];
  if (breakdown?.inningText || data?.inningText) detailBits.push(breakdown?.inningText || data.inningText);
  if (Number.isFinite(Number(breakdown?.runsScored))) detailBits.push(`${breakdown.runsScored} run${Number(breakdown.runsScored) === 1 ? '' : 's'}`);
  if (Number.isFinite(Number(breakdown?.distanceFeet ?? data?.distance))) detailBits.push(`${Number(breakdown?.distanceFeet ?? data.distance)} ft`);
  if (data?.pitcherName) detailBits.push(`${data.pitcherName}${data.pitcherHand ? ` (${data.pitcherHand})` : ''}`);
  const pitcherContext = breakdown && Number.isFinite(Number(breakdown.pitcherHr9))
    ? `<p class="hr-rating-note">Pitcher difficulty used ${Number(breakdown.pitcherHr9).toFixed(2)} HR/9 over ${Number(breakdown.pitcherIp || 0).toFixed(1)} IP (${Math.round(Number(breakdown.pitcherBase || 0))} base x ${Number(breakdown.pitcherMultiplier || 0).toFixed(2)} reliability).</p>`
    : '';
  hrRatingDialogEl.innerHTML = `
    <header>
      <strong>${Number.isFinite(score) ? Math.round(score) : '--'}</strong>
      <button type="button" class="hr-rating-close" aria-label="Close home run rating breakdown">x</button>
    </header>
    <div class="hr-rating-title">${escapeHtml(data?.batter || 'Home Run')} ${escapeHtml(data?.resultLabel || '')}</div>
    <div class="hr-rating-subtitle">${escapeHtml(detailBits.join(' | ') || 'Rating breakdown')}</div>
    ${breakdown ? `<div class="hr-rating-rows">${hrBreakdownRowsHtml(breakdown)}</div>${pitcherContext}` : '<p class="hr-rating-note">Breakdown unavailable for this cached home run. New home runs will include the full scoring detail.</p>'}
  `;
  hrRatingDialogEl.hidden = false;
  hrRatingDialogEl.querySelector('.hr-rating-close')?.addEventListener('click', () => {
    hrRatingDialogEl.hidden = true;
  }, { once: true });
}

function parseHrStorageDate(key = '') {
  const match = String(key).match(/^hrs:(\d{4}-\d{2}-\d{2})$/);
  return match ? match[1] : '';
}

function hrLoadedStorageKey(date) {
  return `hrs-loaded:${date}`;
}

function hrLeaderboardDateRange(period = hrLeaderboardPeriod) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const selectedMs = Date.parse(`${selectedDate}T12:00:00`);
  if (!Number.isFinite(selectedMs)) return [];
  const selectedYear = seasonForDate(selectedDate);
  const startMs = period === 'week'
    ? selectedMs - (6 * 24 * 60 * 60 * 1000)
    : period === 'month'
      ? selectedMs - (30 * 24 * 60 * 60 * 1000)
      : Date.parse(`${selectedYear}-03-01T12:00:00`);
  const effectiveStartMs = Math.min(selectedMs, Number.isFinite(startMs) ? startMs : selectedMs);
  const dates = [];
  for (let time = effectiveStartMs; time <= selectedMs; time += 24 * 60 * 60 * 1000) {
    dates.push(formatDate(new Date(time)));
  }
  return dates;
}

function hrLeaderboardDatesNeedingLoad(period = hrLeaderboardPeriod) {
  return hrLeaderboardDateRange(period).filter((date) => {
    try {
      if (localStorage.getItem(hrLoadedStorageKey(date)) === '1') return false;
      const stored = JSON.parse(localStorage.getItem(`hrs:${date}`) || 'null');
      if (Array.isArray(stored) && stored.length > 0) return false;
    } catch {}
    return true;
  });
}

async function hydrateHrLeaderboardPeriod(period = hrLeaderboardPeriod) {
  const periodKey = `${period}:${dateInput.value || formatDate(new Date())}`;
  if (hrLeaderboardHydratingPeriods.has(periodKey)) return;
  const dates = hrLeaderboardDatesNeedingLoad(period);
  if (!dates.length) return;
  hrLeaderboardHydratingPeriods.add(periodKey);
  hrLeaderboardPageEl?.classList.add('is-loading-period');
  try {
    for (let i = 0; i < dates.length; i += 2) {
      const chunk = dates.slice(i, i + 2);
      await Promise.all(chunk.map(async (date) => {
        try {
          await fetchGamesAndHomeRuns(date);
        } catch {
          try {
            if (localStorage.getItem(`hrs:${date}`) === null) localStorage.setItem(`hrs:${date}`, '[]');
          } catch {}
        }
      }));
      if (currentOverlayPage === 'hrLeaderboard' && hrLeaderboardPeriod === period) {
        hrLeaderboardPageEl?.replaceChildren(renderHrLeaderboardBoard(period, {
          loadingText: `Loading ${Math.min(i + chunk.length, dates.length)} of ${dates.length} dates...`,
        }));
      }
    }
  } finally {
    hrLeaderboardHydratingPeriods.delete(periodKey);
    hrLeaderboardPageEl?.classList.remove('is-loading-period');
    if (currentOverlayPage === 'hrLeaderboard' && hrLeaderboardPeriod === period) {
      hrLeaderboardPageEl?.replaceChildren(renderHrLeaderboardBoard(period));
    }
  }
}

function collectStoredHomeRunsForPeriod(period = hrLeaderboardPeriod) {
  const selectedDate = dateInput.value || formatDate(new Date());
  const selectedMs = Date.parse(`${selectedDate}T12:00:00`);
  const selectedYear = seasonForDate(selectedDate);
  const cutoffMs = period === 'week'
    ? selectedMs - (6 * 24 * 60 * 60 * 1000)
    : period === 'month'
      ? selectedMs - (30 * 24 * 60 * 60 * 1000)
      : Date.parse(`${selectedYear}-01-01T00:00:00`);
  const byKey = new Map();
  const addHr = (hr, fallbackDate = '') => {
    if (!hr) return;
    const bucketTime = Date.parse(`${fallbackDate || selectedDate}T12:00:00`);
    const eventTime = Number(hr.eventTimeMs);
    const time = Number.isFinite(eventTime) ? eventTime : bucketTime;
    const filterTime = Number.isFinite(bucketTime) ? bucketTime : time;
    if (!Number.isFinite(filterTime) || filterTime < cutoffMs || filterTime > selectedMs + (36 * 60 * 60 * 1000)) return;
    if (period === 'season' && seasonForDate(fallbackDate || new Date(filterTime).toISOString().slice(0, 10)) !== selectedYear) return;
    const key = [hr.gamePk ?? '', hr.batterId ?? hr.batter ?? '', hr.eventTimeMs ?? hr.order ?? '', hr.hrNo ?? ''].join(':');
    byKey.set(key, { ...hr, eventTimeMs: time, leaderboardDate: fallbackDate || selectedDate });
  };
  for (const hr of latestRenderedHomeRuns || []) addHr(hr);
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i) || '';
      const date = parseHrStorageDate(key);
      if (!date) continue;
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(list)) continue;
      for (const hr of list) addHr(hr, date);
    }
  } catch {}
  return [...byKey.values()];
}

function hrLeaderboardPeriodLabel(period = hrLeaderboardPeriod) {
  if (period === 'month') return 'month';
  if (period === 'season') return 'season';
  return 'week';
}

function hrLeaderboardScore(value) {
  const rating = Number(value);
  return Number.isFinite(rating) ? String(Math.round(rating)) : '-';
}

function hrLeaderboardPoints(value) {
  const num = Number(value);
  return Number.isFinite(num) ? String(Math.round(num)) : '-';
}

function hrLeaderboardMedalClass(index) {
  if (index === 0) return 'hr-medal hr-medal-gold';
  if (index === 1) return 'hr-medal hr-medal-silver';
  if (index === 2) return 'hr-medal hr-medal-bronze';
  return '';
}

function renderHrLeaderboardTable(items, emptyText, columns) {
  if (!items.length) return `<div class="leaders-empty">${escapeHtml(emptyText)}</div>`;
  return `
    <div class="hr-leaderboard-table-wrap">
      <table class="hr-leaderboard-table">
        <thead>
          <tr>
            ${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${items.map((item, index) => {
            const teamColor = item.teamColor || getTeamColor(item.teamAbbr) || '#66d9ff';
            const rowClass = hrLeaderboardMedalClass(index);
            const style = `--hr-leaderboard-team:${teamColor};--hr-leaderboard-team-rgb:${hexToRgb(teamColor)};`;
            return `
              <tr class="${rowClass}" style="${escapeHtml(style)}">
                ${columns.map((column) => `<td class="${column.className || ''}">${column.render(item, index)}</td>`).join('')}
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderHrLeaderboardBoard(period = hrLeaderboardPeriod, options = {}) {
  const hrs = collectStoredHomeRunsForPeriod(period);
  const topHomeRuns = hrs
    .slice()
    .sort((a, b) => homeRunSortValue(b) - homeRunSortValue(a) || (Number(b.eventTimeMs) || 0) - (Number(a.eventTimeMs) || 0))
    .slice(0, 10)
    .map((hr) => ({
      ...hr,
      title: `${hr.batter || 'Unknown'} ${hr.resultLabel || 'Homerun'}`,
      meta: [
        hr.teamAbbr ? displayTeamAbbrev(hr.teamAbbr) : '',
        hr.inningText || '',
        hr.distance ? `${hr.distance} ft` : '',
      ].filter(Boolean).join(' | '),
      scoreText: hrLeaderboardScore(hr.rating ?? hr.ratingBreakdown?.score),
      teamColor: hr.teamColor || getTeamColor(hr.teamAbbr),
    }));
  const playerTotals = new Map();
  for (const hr of hrs) {
    const key = String(hr.batterId || hr.batter || '');
    if (!key) continue;
    const breakdown = hr.ratingBreakdown || {};
    const existing = playerTotals.get(key) || {
      batter: hr.batter || 'Unknown',
      teamAbbr: hr.teamAbbr || '',
      teamLogo: hr.teamLogo || getLogoPath(hr.teamAbbr),
      teamColor: hr.teamColor || getTeamColor(hr.teamAbbr),
      total: 0,
      count: 0,
      best: 0,
      breakdown: {
        walkOff: 0,
        inning: 0,
        result: 0,
        runs: 0,
        pitcher: 0,
        distance: 0,
      },
    };
    const score = Number(hr.rating ?? hr.ratingBreakdown?.score) || 0;
    existing.total += score;
    existing.count += 1;
    existing.best = Math.max(existing.best, score);
    existing.breakdown.walkOff += Number(breakdown.walkOff) || 0;
    existing.breakdown.inning += Number(breakdown.inning) || 0;
    existing.breakdown.result += Number(breakdown.result) || 0;
    existing.breakdown.runs += Number(breakdown.runs) || 0;
    existing.breakdown.pitcher += Number(breakdown.pitcher) || 0;
    existing.breakdown.distance += Number(breakdown.distance) || 0;
    existing.teamAbbr = existing.teamAbbr || hr.teamAbbr || '';
    existing.teamLogo = existing.teamLogo || hr.teamLogo || getLogoPath(hr.teamAbbr);
    existing.teamColor = existing.teamColor || hr.teamColor || getTeamColor(hr.teamAbbr);
    playerTotals.set(key, existing);
  }
  const topPlayers = [...playerTotals.values()]
    .sort((a, b) => b.total - a.total || b.count - a.count || a.batter.localeCompare(b.batter))
    .slice(0, 10)
    .map((player) => ({
      teamLogo: player.teamLogo,
      teamAbbr: player.teamAbbr,
      teamColor: player.teamColor,
      title: player.batter,
      meta: `${displayTeamAbbrev(player.teamAbbr)} | ${player.count} HR`,
      scoreText: String(Math.round(player.total)),
      rating: player.total,
      count: player.count,
      average: player.count ? player.total / player.count : 0,
      best: player.best,
      ratingBreakdown: player.breakdown,
    }));
  const label = hrLeaderboardPeriodLabel(period);
  const hrColumns = [
    { label: '#', className: 'rank-cell', render: (_item, index) => String(index + 1) },
    { label: 'Home Run', className: 'name-cell', render: (item) => `
      <span class="hr-leaderboard-player">
        <img class="hr-leaderboard-logo" src="${escapeHtml(item.teamLogo || getLogoPath(item.teamAbbr) || 'placeholder.png')}" alt="" />
        <span><strong>${escapeHtml(item.title || item.batter || 'Unknown')}</strong><small>${escapeHtml(item.meta || '')}</small></span>
      </span>
    ` },
    { label: 'Score', className: 'score-cell', render: (item) => hrLeaderboardScore(item.rating ?? item.ratingBreakdown?.score) },
    { label: 'WO', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.walkOff) },
    { label: 'Inn', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.inning) },
    { label: 'Result', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.result) },
    { label: 'Runs', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.runs) },
    { label: 'Pitcher', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.pitcher) },
    { label: 'Dist', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.distance) },
  ];
  const playerColumns = [
    { label: '#', className: 'rank-cell', render: (_item, index) => String(index + 1) },
    { label: 'Player', className: 'name-cell', render: (item) => `
      <span class="hr-leaderboard-player">
        <img class="hr-leaderboard-logo" src="${escapeHtml(item.teamLogo || getLogoPath(item.teamAbbr) || 'placeholder.png')}" alt="" />
        <span><strong>${escapeHtml(item.title || item.batter || 'Unknown')}</strong><small>${escapeHtml(item.meta || '')}</small></span>
      </span>
    ` },
    { label: 'Total', className: 'score-cell', render: (item) => hrLeaderboardScore(item.rating) },
    { label: 'HR', render: (item) => hrLeaderboardPoints(item.count) },
    { label: 'Avg', render: (item) => hrLeaderboardScore(item.average) },
    { label: 'Best', render: (item) => hrLeaderboardScore(item.best) },
    { label: 'WO', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.walkOff) },
    { label: 'Inn', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.inning) },
    { label: 'Result', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.result) },
    { label: 'Runs', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.runs) },
    { label: 'Pitcher', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.pitcher) },
    { label: 'Dist', render: (item) => hrLeaderboardPoints(item.ratingBreakdown?.distance) },
  ];
  const shell = document.createElement('div');
  shell.className = 'leaders-shell hr-leaderboard-shell';
  shell.innerHTML = `
    <section class="leaders-section hr-leaderboard-section">
      <div class="leaders-section-header">
        <div>
          <span class="leaders-section-title">HR Leaderboard</span>
          <span class="leaders-section-subtitle">Top rated home runs and cumulative player scores | ${escapeHtml(label)}${options.loadingText ? ` | ${escapeHtml(options.loadingText)}` : ''}</span>
        </div>
        <div class="hr-leaderboard-periods">
          ${['week', 'month', 'season'].map((value) => `<button type="button" data-hr-period="${value}" class="${value === period ? 'active' : ''}">${value}</button>`).join('')}
        </div>
      </div>
      <div class="hr-leaderboard-grid">
        <section class="hr-leaderboard-table-section">
          <h3>Top 10 Home Runs Of The ${escapeHtml(label)}</h3>
          ${renderHrLeaderboardTable(topHomeRuns, `No rated home runs found for this ${label}.`, hrColumns)}
        </section>
        <section class="hr-leaderboard-table-section">
          <h3>Top 10 Cumulative HR Scores</h3>
          ${renderHrLeaderboardTable(topPlayers, `No player home run scores found for this ${label}.`, playerColumns)}
        </section>
      </div>
    </section>
  `;
  return shell;
}

function refreshHrLeaderboardView() {
  if (!hrLeaderboardPageEl || currentOverlayPage !== 'hrLeaderboard') return;
  updateLeadersContext();
  const missingDates = hrLeaderboardDatesNeedingLoad(hrLeaderboardPeriod);
  hrLeaderboardPageEl.replaceChildren(renderHrLeaderboardBoard(hrLeaderboardPeriod, missingDates.length
    ? { loadingText: `Loading ${missingDates.length} dates...` }
    : {}));
  hydrateHrLeaderboardPeriod(hrLeaderboardPeriod).catch(() => {});
}

function updateDashboardSummary(games = latestRenderedGames) {
  if (!dashboardSummaryEl) return;
  const list = Array.isArray(games) ? games : [];
  const live = list.filter((game) => /top|bot|live/i.test(`${game?.inningShort || ''} ${game?.status || ''}`)).length;
  dashboardSummaryEl.textContent = `${list.length} games | ${live} live | ${dateInput.value || formatDate(new Date())}`;
}

function setOverlayPage(page, options = {}) {
  const { persist = true, refresh = true } = options;
  currentOverlayPage = normalizeOverlayPage(page);
  if (pageToggleBtnEl) {
    pageToggleBtnEl.textContent = `Page: ${overlayPageLabel(currentOverlayPage)}`;
  }
  for (const btn of document.querySelectorAll('[data-page-nav]')) {
    const active = btn.dataset.pageNav === currentOverlayPage;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
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
  if (teamStatsPageEl) {
    teamStatsPageEl.hidden = currentOverlayPage !== 'teamStats';
    teamStatsPageEl.style.display = currentOverlayPage === 'teamStats' ? '' : 'none';
  }
  if (hrLeaderboardPageEl) {
    hrLeaderboardPageEl.hidden = currentOverlayPage !== 'hrLeaderboard';
    hrLeaderboardPageEl.style.display = currentOverlayPage === 'hrLeaderboard' ? '' : 'none';
  }
  if (leadersToolbarEl) leadersToolbarEl.hidden = currentOverlayPage === 'scoreboard' || currentOverlayPage === 'hrLeaderboard';
  if (scoreboardColumnsBtnEl) scoreboardColumnsBtnEl.hidden = false;
  if (persist) {
    try {
      localStorage.setItem(OVERLAY_PAGE_KEY, currentOverlayPage);
    } catch {}
  }
  updateLeadersContext();
  scheduleAutoRefresh();
  if (refresh && currentOverlayPage === 'scoreboard') loadGames({ invalidate: true });
  if (refresh && currentOverlayPage === 'leaders') refreshLeadersView();
  if (refresh && currentOverlayPage === 'hot') refreshHotView();
  if (refresh && currentOverlayPage === 'teamStats') refreshTeamStatsView();
  if (refresh && currentOverlayPage === 'hrLeaderboard') refreshHrLeaderboardView();
}

function initOverlayPageControl() {
  const saved = normalizeOverlayPage(localStorage.getItem(OVERLAY_PAGE_KEY) || 'scoreboard');
  pageToggleBtnEl?.addEventListener('click', () => {
    const pages = ['scoreboard', 'leaders', 'hot', 'teamStats', 'hrLeaderboard'];
    const next = pages[(Math.max(0, pages.indexOf(currentOverlayPage)) + 1) % pages.length];
    setOverlayPage(next);
  });
  for (const btn of document.querySelectorAll('[data-page-nav]')) {
    btn.addEventListener('click', () => setOverlayPage(btn.dataset.pageNav));
  }
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

  if (currentOverlayPage === 'teamStats') {
    return firstScrollableElement([teamStatsPageEl?.querySelector('.leaders-shell'), teamStatsPageEl]);
  }
  if (currentOverlayPage === 'hrLeaderboard') {
    return firstScrollableElement([hrLeaderboardPageEl?.querySelector('.leaders-shell'), hrLeaderboardPageEl]);
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
  const pages = ['scoreboard', 'leaders', 'hot', 'teamStats', 'hrLeaderboard'];
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
      if (playerStatOverlayEl && !playerStatOverlayEl.hidden) {
        navigatePlayerStatCard(-1);
        return;
      }
      if (!navigateOpenLineupGame(-1)) shiftOverlayPage(-1);
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (playerStatOverlayEl && !playerStatOverlayEl.hidden) {
        navigatePlayerStatCard(1);
        return;
      }
      if (!navigateOpenLineupGame(1)) shiftOverlayPage(1);
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

async function fetchTeamStatsGroup(season, group) {
  const url = new URL(`${MLB_API_BASE}/teams/stats`);
  url.searchParams.set('stats', 'season');
  url.searchParams.set('group', group);
  url.searchParams.set('season', String(season));
  url.searchParams.set('gameType', 'R');
  url.searchParams.set('sportIds', '1');
  const response = await getJson(url.toString());
  const map = new Map();
  for (const split of listify(response?.stats?.[0]?.splits)) {
    const teamId = Number(split?.team?.id);
    if (!Number.isFinite(teamId)) continue;
    map.set(teamId, split?.stat || {});
  }
  return map;
}

async function fetchTeamRispStatsMap(season) {
  const url = new URL(`${MLB_API_BASE}/teams/stats`);
  url.searchParams.set('stats', 'statSplits');
  url.searchParams.set('group', 'hitting');
  url.searchParams.set('sitCodes', 'risp');
  url.searchParams.set('season', String(season));
  url.searchParams.set('gameType', 'R');
  url.searchParams.set('sportIds', '1');
  const response = await getJson(url.toString());
  const map = new Map();
  for (const split of listify(response?.stats?.[0]?.splits)) {
    const teamId = Number(split?.team?.id);
    if (!Number.isFinite(teamId)) continue;
    map.set(teamId, split?.stat || {});
  }
  return map;
}

async function fetchTeamRecordMap(season) {
  const url = new URL(`${MLB_API_BASE}/standings`);
  url.searchParams.set('sportId', '1');
  url.searchParams.set('leagueId', '103,104');
  url.searchParams.set('season', String(season));
  url.searchParams.set('standingsTypes', 'regularSeason');
  const response = await getJson(url.toString());
  const map = new Map();
  for (const record of listify(response?.records)) {
    for (const teamRecord of listify(record?.teamRecords)) {
      const teamId = Number(teamRecord?.team?.id);
      if (!Number.isFinite(teamId)) continue;
      const wins = statNumber(teamRecord?.wins);
      const losses = statNumber(teamRecord?.losses);
      map.set(teamId, {
        text: `${wins}-${losses}`,
        pct: cleanSummary(teamRecord?.winningPercentage || ''),
        gb: cleanSummary(teamRecord?.divisionGamesBack ?? teamRecord?.gamesBack ?? ''),
        lastTen: lastTenRecordText(teamRecord),
      });
    }
  }
  return map;
}

function lastTenRecordText(teamRecord) {
  const candidates = [
    ...listify(teamRecord?.records?.splitRecords),
    ...listify(teamRecord?.records?.overallRecords),
    ...listify(teamRecord?.splitRecords),
    ...listify(teamRecord?.overallRecords),
  ];
  const found = candidates.find((entry) => /last\s*ten|last10/i.test(String(entry?.type || entry?.description || '')));
  if (!found) return '--';
  const wins = statNumber(found.wins);
  const losses = statNumber(found.losses);
  return `${wins}-${losses}`;
}

function selectedTeamStatsIds() {
  const ids = currentFilteredTeamIds(latestRenderedGames);
  return ids.length ? new Set(ids.map((id) => Number(id))) : null;
}

function latestRenderedRecordForTeam(abbrev) {
  const team = String(abbrev || '').toUpperCase();
  for (const game of latestRenderedGames) {
    if (String(game.away || '').toUpperCase() === team && game.awayRecord) return game.awayRecord;
    if (String(game.home || '').toUpperCase() === team && game.homeRecord) return game.homeRecord;
  }
  return '';
}

function parseRecordValue(record = '') {
  const match = String(record || '').match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return { wins: 0, losses: 0, pct: 0 };
  const wins = Number(match[1]) || 0;
  const losses = Number(match[2]) || 0;
  return { wins, losses, pct: wins + losses > 0 ? wins / (wins + losses) : 0 };
}

function formatTeamRate(value) {
  const rate = statRate(value);
  if (rate == null) return '---';
  return formatRateValue(rate, 3, true);
}

function teamStatsRowHtml(row) {
  return `
    <tr>
      <td>
        <div class="team-stats-team">
          <img src="${escapeHtml(row.logo)}" alt="${escapeHtml(row.abbrev)} logo" />
          <span style="color:${escapeHtml(row.color)}">${escapeHtml(row.abbrev)}</span>
          <small>${escapeHtml(row.name)}</small>
        </div>
      </td>
      <td>${escapeHtml(row.record || '---')}</td>
      <td>${escapeHtml(row.gamesBack || '-')}</td>
      <td>${escapeHtml(row.lastTen || '--')}</td>
      <td>${row.runs}</td>
      <td>${row.homeRuns}</td>
      <td>${row.stolenBases}</td>
      <td>${row.leftOnBase}</td>
      <td>${escapeHtml(row.avg)}</td>
      <td>${escapeHtml(row.rispAvg)}</td>
      <td>${escapeHtml(row.era)}</td>
      <td>${escapeHtml(row.slg)}</td>
      <td>${row.errors}</td>
      <td>${row.pitcherStrikeOuts}</td>
      <td>${row.hitterStrikeOuts}</td>
      <td>${row.pitcherWalks}</td>
      <td>${row.hitterWalks}</td>
    </tr>
  `;
}

function teamStatsSortValue(row, key) {
  switch (key) {
    case 'record': return Number(row.recordPct) || 0;
    case 'gamesBack': return row.gamesBack === '-' || row.gamesBack === '' ? 0 : Number(row.gamesBack) || 0;
    case 'lastTen': return numberFromRecordPct(row.lastTen);
    case 'runs': return Number(row.runs) || 0;
    case 'homeRuns': return Number(row.homeRuns) || 0;
    case 'stolenBases': return Number(row.stolenBases) || 0;
    case 'leftOnBase': return Number(row.leftOnBase) || 0;
    case 'avg': return statRate(row.avg) ?? -1;
    case 'rispAvg': return statRate(row.rispAvg) ?? -1;
    case 'era': return statRate(row.era) ?? Number.POSITIVE_INFINITY;
    case 'slg': return statRate(row.slg) ?? -1;
    case 'errors': return Number(row.errors) || 0;
    case 'pitcherStrikeOuts': return Number(row.pitcherStrikeOuts) || 0;
    case 'hitterStrikeOuts': return Number(row.hitterStrikeOuts) || 0;
    case 'pitcherWalks': return Number(row.pitcherWalks) || 0;
    case 'hitterWalks': return Number(row.hitterWalks) || 0;
    case 'abbrev':
    default: return String(row.abbrev || '');
  }
}

function sortedTeamStatsRows(rows = []) {
  const { key, dir } = teamStatsSortState;
  const direction = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = teamStatsSortValue(a, key);
    const bv = teamStatsSortValue(b, key);
    if (typeof av === 'string' || typeof bv === 'string') {
      return String(av).localeCompare(String(bv)) * direction;
    }
    if (av === bv) return String(a.abbrev || '').localeCompare(String(b.abbrev || ''));
    return (av - bv) * direction;
  });
}

function numberFromRecordPct(record = '') {
  const parsed = parseRecordValue(record);
  return parsed.pct;
}

function teamStatsHeaderHtml(key, label) {
  const active = teamStatsSortState.key === key;
  const ariaSort = active ? (teamStatsSortState.dir === 'asc' ? 'ascending' : 'descending') : 'none';
  const indicator = active ? (teamStatsSortState.dir === 'asc' ? '▲' : '▼') : '';
  return `<th aria-sort="${ariaSort}"><button type="button" class="team-stats-sort-btn${active ? ' active' : ''}" data-team-stats-sort="${key}"><span>${label}</span><span class="team-stats-sort-indicator">${indicator}</span></button></th>`;
}

async function getTeamStatsRows(season) {
  const cacheKey = String(season);
  let promise = teamStatsCache.get(cacheKey);
  if (!promise) {
    promise = (async () => {
      const [teams, hittingMap, pitchingMap, fieldingMap, recordMap, rispMap] = await Promise.all([
        getTeamsForSeason(season),
        fetchTeamStatsGroup(season, 'hitting'),
        fetchTeamStatsGroup(season, 'pitching'),
        fetchTeamStatsGroup(season, 'fielding').catch(() => new Map()),
        fetchTeamRecordMap(season).catch(() => new Map()),
        fetchTeamRispStatsMap(season).catch(() => new Map()),
      ]);
      return teams.map((team) => {
        const teamId = Number(team.id);
        const hitting = hittingMap.get(teamId) || {};
        const pitching = pitchingMap.get(teamId) || {};
        const fielding = fieldingMap.get(teamId) || {};
        const risp = rispMap.get(teamId) || {};
        const abbrev = displayTeamAbbrev(team.abbreviation);
        const recordInfo = recordMap.get(teamId) || null;
        const record = recordInfo?.text || latestRenderedRecordForTeam(abbrev);
        const parsedRecord = parseRecordValue(record);
        return {
          id: teamId,
          abbrev,
          name: team.name,
          division: team.division || 'MLB',
          logo: getLogoPath(abbrev),
          color: getTeamColor(abbrev),
          record,
          recordPct: statRate(recordInfo?.pct) ?? parsedRecord.pct,
          gamesBack: recordInfo?.gb || '-',
          lastTen: recordInfo?.lastTen || '--',
          runs: statNumber(hitting.runs),
          homeRuns: statNumber(hitting.homeRuns),
          stolenBases: statNumber(hitting.stolenBases),
          leftOnBase: statNumber(hitting.leftOnBase ?? hitting.lob ?? hitting.teamLeftOnBase),
          avg: formatTeamRate(hitting.avg ?? hitting.battingAverage),
          rispAvg: formatTeamRate(risp.avg ?? risp.battingAverage ?? hitting.avgWithRisp ?? hitting.rispAvg),
          era: cleanSummary(pitching.era) || '---',
          slg: formatTeamRate(hitting.slg ?? hitting.sluggingPercentage),
          errors: statNumber(fielding.errors),
          pitcherStrikeOuts: statNumber(pitching.strikeOuts),
          hitterStrikeOuts: statNumber(hitting.strikeOuts),
          pitcherWalks: statNumber(pitching.baseOnBalls ?? pitching.walks),
          hitterWalks: statNumber(hitting.baseOnBalls ?? hitting.walks),
        };
      }).sort((a, b) => String(a.abbrev).localeCompare(String(b.abbrev)));
    })().catch((error) => {
      teamStatsCache.delete(cacheKey);
      throw error;
    });
    teamStatsCache.set(cacheKey, promise);
  }
  return promise;
}

function teamStatsTableHtml(rows) {
  return `
    <div class="team-stats-table-wrap">
      <table class="team-stats-table">
        <thead>
          <tr>
            ${teamStatsHeaderHtml('abbrev', 'Team')}
            ${teamStatsHeaderHtml('record', 'Record')}
            ${teamStatsHeaderHtml('gamesBack', 'GB')}
            ${teamStatsHeaderHtml('lastTen', 'L10')}
            ${teamStatsHeaderHtml('runs', 'R')}
            ${teamStatsHeaderHtml('homeRuns', 'HR')}
            ${teamStatsHeaderHtml('stolenBases', 'SB')}
            ${teamStatsHeaderHtml('leftOnBase', 'LOB')}
            ${teamStatsHeaderHtml('avg', 'AVG')}
            ${teamStatsHeaderHtml('rispAvg', 'AVG/RISP')}
            ${teamStatsHeaderHtml('era', 'ERA')}
            ${teamStatsHeaderHtml('slg', 'SLG')}
            ${teamStatsHeaderHtml('errors', 'E')}
            ${teamStatsHeaderHtml('pitcherStrikeOuts', 'K (P)')}
            ${teamStatsHeaderHtml('hitterStrikeOuts', 'K (H)')}
            ${teamStatsHeaderHtml('pitcherWalks', 'BB (P)')}
            ${teamStatsHeaderHtml('hitterWalks', 'BB (H)')}
          </tr>
        </thead>
        <tbody>${rows.map(teamStatsRowHtml).join('') || '<tr><td colspan="17">No team stats loaded</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

function divisionShortName(name = '') {
  return String(name || 'MLB').replace(/^American League\s+/i, 'AL ').replace(/^National League\s+/i, 'NL ');
}

function teamStatsDivisionTablesHtml(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = divisionShortName(row.division || 'MLB');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([division, divisionRows]) => `
      <section class="team-stats-division">
        <header class="team-stats-division-head">
          <strong>${escapeHtml(division)}</strong>
          <span>${divisionRows.length} teams</span>
        </header>
        ${teamStatsTableHtml(divisionRows)}
      </section>
    `).join('');
}

function renderTeamStatsBoard(rows, season) {
  const shell = document.createElement('div');
  shell.className = 'leaders-shell team-stats-shell';
  const selectedIds = selectedTeamStatsIds();
  const filteredRows = selectedIds ? rows.filter((row) => selectedIds.has(Number(row.id))) : rows;
  const visibleRows = sortedTeamStatsRows(filteredRows);
  shell.innerHTML = `
    <section class="leaders-section team-stats-section">
      <div class="leaders-section-header">
        <div>
          <span class="leaders-section-title">Team Stats</span>
          <span class="leaders-section-subtitle">${visibleRows.length} teams | ${season} regular season</span>
        </div>
        <button type="button" class="team-stats-division-toggle${teamStatsGroupByDivision ? ' active' : ''}" data-team-stats-division-toggle aria-pressed="${teamStatsGroupByDivision ? 'true' : 'false'}">
          ${teamStatsGroupByDivision ? 'Divisions On' : 'Divisions Off'}
        </button>
      </div>
      ${teamStatsGroupByDivision ? teamStatsDivisionTablesHtml(visibleRows) : teamStatsTableHtml(visibleRows)}
    </section>
  `;
  return shell;
}

function initTeamStatsTableSorting() {
  teamStatsPageEl?.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-team-stats-division-toggle]');
    if (toggle) {
      teamStatsGroupByDivision = !teamStatsGroupByDivision;
      teamStatsPageEl.dataset.renderSignature = '';
      refreshTeamStatsView({ showLoading: false });
      return;
    }
    const btn = e.target.closest('[data-team-stats-sort]');
    if (!btn) return;
    const key = btn.dataset.teamStatsSort || 'abbrev';
    if (teamStatsSortState.key === key) {
      teamStatsSortState = { key, dir: teamStatsSortState.dir === 'asc' ? 'desc' : 'asc' };
    } else {
      teamStatsSortState = { key, dir: key === 'abbrev' ? 'asc' : key === 'era' ? 'asc' : 'desc' };
    }
    teamStatsPageEl.dataset.renderSignature = '';
    refreshTeamStatsView({ showLoading: false });
  });
}

async function refreshTeamStatsView(options = {}) {
  const { showLoading = false } = options;
  if (!teamStatsPageEl || currentOverlayPage !== 'teamStats') return;
  const renderId = ++teamStatsRenderSequence;
  const season = seasonForDate(dateInput.value || formatDate(new Date()));
  updateLeadersContext();
  if (showLoading || !teamStatsPageEl.querySelector('.team-stats-shell')) {
    teamStatsPageEl.replaceChildren(createLeaderEmpty('Loading team stats...'));
  }
  try {
    const rows = await getTeamStatsRows(season);
    if (renderId !== teamStatsRenderSequence) return;
    const selected = Array.from(selectedTeamStatsIds() || []).sort((a, b) => a - b).join(',');
    const signature = JSON.stringify({ season, selected, rows });
    if (teamStatsPageEl.dataset.renderSignature === signature && teamStatsPageEl.querySelector('.team-stats-shell')) return;
    teamStatsPageEl.dataset.renderSignature = signature;
    teamStatsPageEl.replaceChildren(renderTeamStatsBoard(rows, season));
  } catch (error) {
    if (renderId !== teamStatsRenderSequence) return;
    teamStatsPageEl.replaceChildren(createLeaderEmpty(`Could not load team stats (${error.message}).`));
  }
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
        .filter((entry) => leaderMatchesPosition({ position: entry.player?.position || entry.player?.primaryPosition?.abbreviation || '' }, selectedLeaderPosition()))
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
          position: normalizeLeaderPosition(entry.player?.position || entry.player?.primaryPosition?.abbreviation || ''),
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
    position: normalizeLeaderPosition(player.position || player.primaryPosition?.abbreviation || ''),
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
        .filter((entry) => leaderMatchesPosition(entry, selectedLeaderPosition()))
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
          position: entry.position || '',
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

function renderLeaderListItems(list, leaders = []) {
  for (const leader of leaders) {
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
}

function renderLeaderCardPage(card) {
  const payload = leaderCardPayloads.get(card);
  if (!payload) return;
  const { category, leaders } = payload;
  let leaderIndex = Number(card.dataset.leaderPage || leaderCardPages.get(category.key) || 0);
  const leaderCount = leaders.length;
  if (leaderCount > 0) {
    leaderIndex = ((leaderIndex % leaderCount) + leaderCount) % leaderCount;
  } else {
    leaderIndex = 0;
  }
  leaderCardPages.set(category.key, leaderIndex);
  card.dataset.leaderPage = String(leaderIndex);
  const body = card.querySelector('.leader-card-body');
  if (!body) return;
  body.replaceChildren();
  if (!leaders.length) {
    const empty = document.createElement('div');
    empty.className = 'leader-empty';
    empty.textContent = 'No leaders yet for this filter.';
    body.appendChild(empty);
    return;
  }
  const rotatedLeaders = [];
  for (let i = 0; i < Math.min(leaders.length, LEADER_ROW_LIMIT); i += 1) {
    rotatedLeaders.push(leaders[(leaderIndex + i) % leaders.length]);
  }
  const [featuredLeader, ...restLeaders] = rotatedLeaders;
  const spotlight = renderLeaderSpotlight(category, featuredLeader);
  if (spotlight) body.appendChild(spotlight);
  const list = document.createElement('ol');
  list.className = 'leader-list';
  renderLeaderListItems(list, restLeaders);
  if (restLeaders.length) body.appendChild(list);
  const pageEl = card.querySelector('.leader-card-page');
  if (pageEl) pageEl.textContent = `${leaderIndex + 1}/${leaderCount}`;
  card.querySelectorAll('[data-leader-card-nav]').forEach((btn) => {
    btn.hidden = leaderCount < 2;
  });
}

function shiftLeaderCard(card, direction = 1) {
  if (!card) return;
  const payload = leaderCardPayloads.get(card);
  if (!payload?.leaders?.length) return;
  const leaderCount = payload.leaders.length;
  const current = Number(card.dataset.leaderPage || leaderCardPages.get(payload.category.key) || 0);
  card.dataset.leaderPage = String((current + Number(direction || 1) + leaderCount) % leaderCount);
  renderLeaderCardPage(card);
}

function leaderPlayerNavContextFromCard(card, playerId) {
  const payload = leaderCardPayloads.get(card);
  const leaders = (payload?.leaders || []).filter((leader) => Number(leader?.playerId) > 0);
  const entries = leaders.map((leader) => ({
    id: Number(leader.playerId),
    rank: Number(leader.rank) || 0,
    statLabel: payload?.category?.label || '',
    statValue: leader.value || '',
    teamAbbrev: leader.teamAbbrev || '',
    teamName: leader.teamName || leader.teamAbbrev || '',
    teamLogo: leader.teamLogo || '',
    teamColor: leader.teamColor || '',
    gamePk: leader.gamePk || '',
  }));
  if (!entries.length) return null;
  return {
    game: buildLeaderOverlayGame(entries.find((entry) => Number(entry.id) === Number(playerId)) || entries[0]),
    playerId: Number(playerId),
    kind: 'leader',
    categoryKey: payload?.category?.key || '',
    categoryLabel: payload?.category?.label || '',
    positionFilterLabel: leaderPositionFilterLabel(),
    entries,
  };
}

function renderLeaderCard(category, leaders = []) {
  const card = document.createElement('article');
  card.className = 'leader-card';
  card.dataset.leaderCategory = category.key;
  card.innerHTML = `
    <header class="leader-card-header">
      <span class="leader-card-label">${category.label}</span>
      <span class="leader-card-meta">${category.group} <b class="leader-card-page"></b></span>
    </header>
    <div class="leader-card-board">
      <div class="leader-card-body"></div>
    </div>
  `;
  leaderCardPayloads.set(card, { category, leaders });
  card.dataset.leaderPage = String(leaderCardPages.get(category.key) || 0);
  renderLeaderCardPage(card);
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
  if (!hasTrustedLineupOrder(game, side)) return [];
  return normalizeLineupCollectionForSide(game, side, lineup)
    .filter((entry) => Number.isFinite(Number(entry?.id)) && Number(entry.id) > 0)
    .filter((entry) => String(entry?.position || '').toUpperCase() !== 'P');
}

function activeLineupForRecognition(game, side) {
  const previewFallback = game?.previewLineupFallback?.[side] || [];
  if (Array.isArray(previewFallback) && previewFallback.length) {
    return normalizeLineupCollectionForSide(game, side, previewFallback)
      .filter((entry) => Number.isFinite(Number(entry?.id)) && Number(entry.id) > 0)
      .filter((entry) => String(entry?.position || '').toUpperCase() !== 'P')
      .slice(0, 9);
  }
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
    details = await getPlayerRecentBattingDetails(playerId, game, LINEUP_TREND_GAME_WINDOW);
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
  return `${String(game?.gamePk || '')}:${date}:ops-merit-${LINEUP_TREND_GAME_WINDOW}:${awayIds}|${homeIds}`;
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
      slugBurst: Boolean(value.slugBurst),
      slugBurstValue: Number.isFinite(Number(value.slugBurstValue)) ? Number(value.slugBurstValue) : SLUG_BURST_THRESHOLD,
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
      const slugBurstValue = Number(candidate?.details?.metrics?.slg);
      const slugBurst = Number.isFinite(slugBurstValue) && slugBurstValue >= SLUG_BURST_THRESHOLD;
      if (avgBurst || powerBurst || slugBurst) {
        batterBadges.set(String(candidate.playerId), { avgBurst, powerBurst, slugBurst, slugBurstValue });
      }
    }

    for (const entry of candidates) {
      const playerId = Number(entry?.playerId);
      const ops = Number(entry?.details?.metrics?.ops);
      if (!Number.isFinite(playerId) || playerId <= 0 || !Number.isFinite(ops)) continue;
      if (ops >= LINEUP_HOT_OPS_THRESHOLD) {
        hotIds.add(String(playerId));
      } else if (ops <= LINEUP_COLD_OPS_THRESHOLD) {
        coldIds.add(String(playerId));
      }
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
  if (entries.length) {
    const enrichedEntries = await Promise.all(entries.slice(0, LEADER_ROW_LIMIT + 2).map((entry) => enrichHotEntryWithTodayMatchup(entry)));
    return { entries: enrichedEntries, dates, mode: 'range' };
  }
  const sameDayFallback = fallbackHotPlayersFromRenderedGames('hitting').slice(0, LEADER_ROW_LIMIT + 2);
  if (sameDayFallback.length) {
    const enrichedFallback = await Promise.all(sameDayFallback.map((entry) => enrichHotEntryWithTodayMatchup(entry)));
    return { entries: enrichedFallback, dates, mode: 'same-day-fallback' };
  }
  try {
    const seasonFallback = (await getSeasonFallbackHotHitters(endDate)).slice(0, LEADER_ROW_LIMIT + 2);
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
    const awayPitcher = resolvePitchingSideForDisplay(game, 'home')?.current || null;
    const homePitcher = resolvePitchingSideForDisplay(game, 'away')?.current || null;
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
  const [opponentTeam, recentDetails] = await Promise.all([
    today?.opponentAbbrev ? getTeamByAbbrev(today.opponentAbbrev).catch(() => null) : Promise.resolve(null),
    getPlayerRecentBattingDetails(entry.playerId, today?.game || null).catch(() => null),
  ]);
  const matchupContext = await getPreferredBatterMatchupHistory(entry.playerId, pitcherId, opponentTeam?.id || null).catch(() => ({ history: null, source: 'none' }));
  const lastFiveSlug = Number(recentDetails?.metrics?.slg);
  return {
    ...entry,
    slugBurstValue: Number.isFinite(lastFiveSlug) ? lastFiveSlug : Number(entry?.slugBurstValue ?? entry?.metrics?.slg),
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

function slugBurstMarkerHtml(metrics) {
  const slg = Number(metrics?.slugBurstValue ?? metrics?.slg);
  if (!Number.isFinite(slg) || slg < SLUG_BURST_THRESHOLD) return '';
  const thresholdText = formatRateValue(SLUG_BURST_THRESHOLD, 3, true);
  return `<span class="lineup-slug-burst" title="Slugging ${formatRateValue(slg, 3, true)} over the last five games (${thresholdText}+ flag)" aria-label="Slugging ${thresholdText} plus over the last five games">💪</span>`;
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
            <span class="hot-card-name">${escapeHtml(entry.fullName || 'Unknown')}</span>${type === 'pitcher' ? '' : slugBurstMarkerHtml(entry)}
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
        <div class="hot-spotlight-kicker">Hottest Bat | ${coverageLabel}</div>
        <div class="hot-spotlight-name-row">
          <span class="hot-spotlight-team">${entry.teamAbbrev || 'MLB'}</span>
          <span class="hot-spotlight-name">${escapeHtml(entry.fullName || 'Unknown')}</span>${slugBurstMarkerHtml(entry)}
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
      <span class="leaders-section-title">Hot Players</span>
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
        <span class="leaders-section-title">Top Form</span>
        <span class="leaders-section-subtitle">${rest.length} more hitters in the current board</span>
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
  if (shouldPreferProbablePitcher(game)) {
    const probable = previewProbableForSide(game, opponentSide);
    return probable?.id ? { ...probable, sourceLabel: 'probable starter' } : null;
  }
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
    hydratePitcherLastStartHrMarkers(card);
    hydratePitcherOpponentHandMarkers(card);
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
    leaderMap = filterLeaderMapByPosition(leaderMap);
    const signature = JSON.stringify({
      position: selectedLeaderPosition(),
      sections:
      LEADER_SECTIONS.flatMap((section) => section.categories.map((category) => ({
        key: category.key,
        leaders: leaderMap.get(category.key) || [],
      }))),
    });
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
    if (currentOverlayPage === 'teamStats') refreshTeamStatsView();
    if (currentOverlayPage === 'hrLeaderboard') refreshHrLeaderboardView();
  });
  leadersPositionSelectEl?.addEventListener('change', () => {
    updateLeadersContext();
    if (currentOverlayPage === 'leaders') refreshLeadersView();
  });
  leadersOpponentsBtnEl?.addEventListener('click', () => {
    if (leadersOpponentsBtnEl.disabled) return;
    currentLeadersOpponentMode = !currentLeadersOpponentMode;
    syncLeadersOpponentsButton(latestRenderedGames);
    updateLeadersContext();
    if (currentOverlayPage === 'leaders') refreshLeadersView();
    if (currentOverlayPage === 'hot') refreshHotView();
    if (currentOverlayPage === 'teamStats') refreshTeamStatsView();
    if (currentOverlayPage === 'hrLeaderboard') refreshHrLeaderboardView();
  });
  hrLeaderboardPageEl?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-hr-period]');
    if (!btn) return;
    hrLeaderboardPeriod = btn.dataset.hrPeriod || 'week';
    refreshHrLeaderboardView();
  });
  leadersPageEl?.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-leader-card-nav]');
    if (navBtn) {
      e.preventDefault();
      e.stopPropagation();
      shiftLeaderCard(navBtn.closest('.leader-card'), Number(navBtn.dataset.leaderCardNav) || 1);
      return;
    }
    const item = e.target.closest('.leader-item[data-player-id], .leader-spotlight[data-player-id]');
    if (!item) return;
    const playerId = Number(item.dataset.playerId);
    if (!Number.isFinite(playerId) || playerId <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    const leaderGame = buildLeaderOverlayGame({
      playerId,
      teamAbbrev: item.dataset.teamAbbrev || '',
      teamName: item.dataset.teamName || '',
      gamePk: item.dataset.gamePk || '',
    });
    const leaderNavContext = leaderPlayerNavContextFromCard(item.closest('.leader-card'), playerId);
    openPlayerStatOverlay(playerId, leaderGame, leaderNavContext ? { navContext: leaderNavContext } : {});
  });
  leadersPageEl?.addEventListener('touchstart', (e) => {
    const card = e.target.closest('.leader-card');
    if (!card || e.touches.length !== 1) return;
    const touch = e.touches[0];
    card.dataset.touchStartX = String(touch.clientX);
    card.dataset.touchStartY = String(touch.clientY);
  }, { passive: true });
  leadersPageEl?.addEventListener('touchend', (e) => {
    const card = e.target.closest('.leader-card');
    if (!card || !card.dataset.touchStartX) return;
    const touch = e.changedTouches?.[0];
    if (!touch) return;
    const dx = touch.clientX - Number(card.dataset.touchStartX);
    const dy = touch.clientY - Number(card.dataset.touchStartY);
    delete card.dataset.touchStartX;
    delete card.dataset.touchStartY;
    if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
    shiftLeaderCard(card, dx < 0 ? 1 : -1);
  }, { passive: true });
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

function playTimestampMs(play, fallback = 0) {
  const candidates = [
    play?.about?.endTime,
    play?.about?.startTime,
    ...(Array.isArray(play?.playEvents) ? play.playEvents : []).slice().reverse().flatMap((event) => [event?.endTime, event?.startTime]),
  ].filter(Boolean);
  for (const value of candidates) {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return Number(fallback) || 0;
}

function formatEasternClock(timestampMs) {
  if (!Number.isFinite(Number(timestampMs)) || Number(timestampMs) <= 0) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(Number(timestampMs)));
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
      <div class="bullpen-main pitcher-priority-line">
        <span class="bullpen-name pitcher-priority-name" title="${escapeHtml(arm.fullName || arm.name || 'Pitcher')}" style="color:${color}">${lineupPitcherNameHtml(arm)}</span>
        <span class="bullpen-meta pitcher-priority-meta">${pitcherSeasonMetaLine(arm)}</span>
      </div>
      <div class="bullpen-today">${arm.today}</div>
    `;
    listEl.appendChild(li);
  }
}

function pitcherHistoryMetaLine(entry) {
  const innings = cleanSummary(entry?.inningsText || entry?.innings || '');
  return [
    innings ? `Inn ${innings}` : '',
    `IP ${cleanSummary(entry?.ip) || '0.0'}`,
    `ER ${statNumber(entry?.er ?? entry?.earnedRuns)}`,
    `HR ${statNumber(entry?.hr ?? entry?.homeRuns ?? entry?.hrAllowed)}`,
    `BB ${statNumber(entry?.bb ?? entry?.walks)}`,
    `K ${statNumber(entry?.k ?? entry?.strikeOuts)}`,
    `H ${statNumber(entry?.hits)}`,
  ].filter(Boolean).join(' | ');
}

function renderPitchingHistory(containerEl, history = [], color = '') {
  if (!containerEl) return;
  const items = Array.isArray(history) ? history.filter(Boolean) : [];
  if (!items.length) {
    containerEl.replaceChildren();
    return;
  }
  const fingerprint = JSON.stringify(items.map((entry) => [
    entry?.id || '',
    entry?.name || entry?.fullName || '',
    entry?.inningsText || entry?.innings || '',
    entry?.ip || '',
    entry?.er ?? entry?.earnedRuns ?? '',
    entry?.hr ?? entry?.homeRuns ?? entry?.hrAllowed ?? '',
    entry?.bb ?? entry?.walks ?? '',
    entry?.k ?? entry?.strikeOuts ?? '',
    entry?.hits ?? '',
  ]));
  const existing = containerEl.querySelector('.pitching-history-menu');
  if (containerEl.dataset.renderFingerprint === fingerprint && existing) return;
  const wasOpen = Boolean(existing?.open);
  containerEl.dataset.renderFingerprint = fingerprint;
  const details = document.createElement('details');
  details.className = 'pitching-history-menu';
  details.open = wasOpen;
  const summary = document.createElement('summary');
  summary.textContent = 'Pitching history';
  const list = document.createElement('ol');
  list.className = 'pitching-history-list';
  for (const entry of items) {
    const item = document.createElement('li');
    item.dataset.playerId = String(entry?.id || '');
    const name = document.createElement('span');
    name.className = 'pitching-history-name';
    name.style.color = color;
    name.textContent = entry?.name || entry?.fullName || 'Pitcher';
    const meta = document.createElement('span');
    meta.className = 'pitching-history-meta';
    meta.textContent = pitcherHistoryMetaLine(entry);
    item.append(name, meta);
    list.appendChild(item);
  }
  details.append(summary, list);
  containerEl.replaceChildren(details);
}

function starterFromPitchingHistory(game, side) {
  const history = game?.pitching?.[side]?.history;
  const first = Array.isArray(history) ? history.find((entry) => Number(entry?.id) > 0) : null;
  if (!first) return null;
  const profile = game?.playerLookup?.[String(first.id)] || null;
  return normalizePitcherDisplayEntry({
    ...first,
    ...(profile || {}),
    id: first.id,
    fullName: profile?.fullName || first.fullName || first.name,
    name: profile?.name || lastName(first.fullName || first.name || 'Pitcher'),
    today: pitcherHistoryMetaLine(first),
    role: 'starter',
  }, 'starter');
}

function isFinishedGame(game) {
  return game?.status?.abstractGameState === 'Final' || /^final/i.test(String(game?.status || ''));
}

function isHistoricalGameDate(game) {
  const selected = calendarDateOnly(dateInput?.value || formatDate(new Date()));
  const current = formatDate(new Date());
  const gameDate = calendarDateOnly(game?.officialDate || game?.gameDate || selected);
  return Boolean(gameDate && gameDate < current);
}

function isFutureGameDate(game) {
  const selected = calendarDateOnly(dateInput?.value || formatDate(new Date()));
  const current = formatDate(new Date());
  const gameDate = calendarDateOnly(game?.officialDate || game?.gameDate || selected);
  return Boolean(gameDate && gameDate > current);
}

function shouldDisplayStarterOnly(game) {
  return isHistoricalGameDate(game);
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

function renderPitchingSide(sectionEl, teamCode, color, staff, game = null) {
  if (!sectionEl) return;
  const titleEl = sectionEl.querySelector('.lineup-pitching-team-code');
  const currentEl = sectionEl.querySelector('.current-pitcher-card');
  const rotationEl = sectionEl.querySelector('.rotation-list');
  const bullpenEl = sectionEl.querySelector('.bullpen-list');
  let bullpenSummaryEl = sectionEl.querySelector('.bullpen-summary-card');
  if (!bullpenSummaryEl) {
    bullpenSummaryEl = document.createElement('div');
    bullpenSummaryEl.className = 'bullpen-summary-card';
    const reliefHead = bullpenEl?.previousElementSibling?.classList?.contains('lineup-pitching-subhead')
      ? bullpenEl.previousElementSibling
      : bullpenEl;
    reliefHead?.insertAdjacentElement('beforebegin', bullpenSummaryEl);
  }
  let historyEl = sectionEl.querySelector('.pitching-history-wrap');
  if (!historyEl) {
    historyEl = document.createElement('div');
    historyEl.className = 'pitching-history-wrap';
    currentEl?.insertAdjacentElement('afterend', historyEl);
  }
  if (titleEl) {
    titleEl.textContent = displayTeamAbbrev(teamCode);
    titleEl.style.color = color;
  }

  const current = staff?.current;
  if (currentEl) {
    currentEl.dataset.playerId = String(current?.id ?? '');
    const currentLabel = current?.isPotentialStarter ? 'Potential Starter:' : current?.role === 'starter' ? 'Starter' : 'Current Pitcher';
    currentEl.innerHTML = current ? `
      <div class="pitching-card-label">${currentLabel}</div>
      <div class="pitching-card-main pitcher-priority-line">
        <div class="pitching-card-name pitcher-priority-name" title="${escapeHtml(current.fullName || current.name || 'Pitcher')}" style="color:${color}">${lineupPitcherNameHtml(current)}</div>
        <div class="pitching-card-meta pitcher-priority-meta">${pitcherSeasonMetaLine(current)}</div>
      </div>
    ` : '<div class="pitching-card-empty">Awaiting pitcher</div>';
  }

  renderPitchingHistory(historyEl, staff?.history || [], color);
  const groups = splitPitchingDisplayGroups(staff);
  renderPitcherListItems(rotationEl, groups.starters, color, 'No additional starters loaded');
  renderBullpenSummary(bullpenSummaryEl, groups.relievers, color);
  hydrateBullpenSummaryRanks(bullpenSummaryEl, teamCode, groups.relievers, color, game);
  renderPitcherListItems(bullpenEl, groups.relievers, color, 'Awaiting relief data');
}

function pitcherRateNumber(value) {
  const numeric = Number(cleanSummary(value).replace(/[^\d.-]/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
}

function bullpenAggregateStats(relievers = []) {
  const aggregate = {
    pitchers: 0,
    outs: 0,
    earnedRuns: 0,
    baserunners: 0,
    homeRuns: 0,
  };
  for (const arm of Array.isArray(relievers) ? relievers : []) {
    const outs = inningsToOuts(arm?.ip || arm?.innings || arm?.inningsText);
    if (outs <= 0) continue;
    const innings = outs / 3;
    const era = pitcherRateNumber(pitcherEra(arm));
    const whip = pitcherRateNumber(pitcherWhip(arm));
    aggregate.pitchers += 1;
    aggregate.outs += outs;
    if (Number.isFinite(era)) aggregate.earnedRuns += (era * innings) / 9;
    if (Number.isFinite(whip)) aggregate.baserunners += whip * innings;
    aggregate.homeRuns += statNumber(pitcherHomeRunsAllowed(arm));
  }
  return aggregate;
}

function bullpenSummaryValues(relievers = []) {
  const aggregate = bullpenAggregateStats(relievers);
  if (!aggregate.pitchers || aggregate.outs <= 0) return null;
  return {
    pitchers: aggregate.pitchers,
    outs: aggregate.outs,
    ip: outsToInnings(aggregate.outs),
    era: (aggregate.earnedRuns * 27) / aggregate.outs,
    whip: (aggregate.baserunners * 3) / aggregate.outs,
    homeRuns: aggregate.homeRuns,
    earnedRuns: aggregate.earnedRuns,
    baserunners: aggregate.baserunners,
  };
}

function bullpenMetricRankingList(rows, key, lowerIsBetter = true) {
  return rows
    .filter((row) => Number.isFinite(Number(row?.[key])))
    .sort((a, b) => lowerIsBetter ? Number(a[key]) - Number(b[key]) : Number(b[key]) - Number(a[key]));
}

function buildVerifiedBullpenRankData(rows = [], expectedTeamCount = 30) {
  const expected = Math.max(1, Number(expectedTeamCount) || 30);
  const lists = {
    ip: bullpenMetricRankingList(rows, 'outs', false),
    era: bullpenMetricRankingList(rows, 'era', true),
    whip: bullpenMetricRankingList(rows, 'whip', true),
    homeRuns: bullpenMetricRankingList(rows, 'homeRuns', true),
  };
  const verified = Object.values(lists).every((list) => list.length >= expected);
  if (!verified) {
    return { verified: false, expectedTeamCount: expected, teamCount: rows.length, lists, ranks: new Map() };
  }
  const ranks = new Map(rows.map((row) => [row.teamCode, {}]));
  for (const [metric, list] of Object.entries(lists)) {
    list.forEach((row, index) => {
      const entry = ranks.get(row.teamCode) || {};
      entry[metric] = index + 1;
      ranks.set(row.teamCode, entry);
    });
  }
  return { verified: true, expectedTeamCount: expected, teamCount: rows.length, lists, ranks };
}

async function getBullpenRankData(game) {
  const officialDate = officialDateForGame(game) || formatDate(new Date());
  const season = seasonForDate(officialDate);
  const cacheKey = `${season}:${officialDate}:bullpen-ranks:v2`;
  if (teamBullpenRanksCache.has(cacheKey)) return teamBullpenRanksCache.get(cacheKey);
  const promise = (async () => {
    const teams = await getTeamsForSeason(season);
    const expectedTeamCount = teams.length || 30;
    const rows = (await mapWithConcurrency(teams, 3, async (team) => {
      const teamCode = canonicalTeamAbbrev(team?.abbreviation);
      if (!teamCode) return null;
      const profiles = await fetchTeamPitcherRosterProfiles(teamCode, { officialDate }).catch(() => []);
      const relievers = listify(profiles)
        .filter((profile) => !isStarterLikePitcher(profile))
        .map((profile) => normalizePitcherDisplayEntry(profile, 'bullpen'))
        .filter(Boolean);
      const values = bullpenSummaryValues(relievers);
      return values ? { teamCode, ranks: {}, ...values } : null;
    })).filter(Boolean);
    return buildVerifiedBullpenRankData(rows, expectedTeamCount);
  })().catch((error) => {
    teamBullpenRanksCache.delete(cacheKey);
    throw error;
  });
  teamBullpenRanksCache.set(cacheKey, promise);
  return promise;
}

async function hydrateBullpenSummaryRanks(containerEl, teamCode, relievers = [], color = '', game = null) {
  if (!containerEl || !game) return;
  const token = `${canonicalTeamAbbrev(teamCode)}:${officialDateForGame(game) || ''}:${Date.now()}`;
  containerEl.dataset.rankToken = token;
  const rankData = await getBullpenRankData(game).catch(() => null);
  if (!rankData?.verified || containerEl.dataset.rankToken !== token) return;
  const ranks = rankData.ranks.get(canonicalTeamAbbrev(teamCode)) || null;
  renderBullpenSummary(containerEl, relievers, color, ranks, rankData);
}

function formatBullpenRankValue(value, rank) {
  const numericRank = Number(rank);
  return Number.isFinite(numericRank) && numericRank > 0 ? `${value} - ${numericRank}` : value;
}

function renderBullpenSummary(containerEl, relievers = [], color = '', ranks = null, rankData = null) {
  if (!containerEl) return;
  const values = bullpenSummaryValues(relievers);
  const fingerprint = JSON.stringify([
    values?.pitchers || 0,
    values?.outs || 0,
    Number(values?.earnedRuns || 0).toFixed(3),
    Number(values?.baserunners || 0).toFixed(3),
    values?.homeRuns || 0,
    ranks?.ip || '',
    ranks?.era || '',
    ranks?.whip || '',
    ranks?.homeRuns || '',
    rankData?.verified ? `${rankData.teamCount}:${rankData.expectedTeamCount}` : '',
  ]);
  if (containerEl.dataset.renderFingerprint === fingerprint) return;
  containerEl.dataset.renderFingerprint = fingerprint;
  if (!values) {
    containerEl.innerHTML = '<span class="bullpen-summary-empty">Bullpen stats unavailable</span>';
    return;
  }
  containerEl.innerHTML = `
    <div class="bullpen-summary-label" style="color:${color}" title="${rankData?.verified ? `Ranks verified against ${rankData.teamCount} clubs` : 'Bullpen ranks loading'}">Bullpen</div>
    <div class="bullpen-summary-grid">
      <span><b>IP</b>${formatBullpenRankValue(values.ip, ranks?.ip)}</span>
      <span><b>ERA</b>${formatBullpenRankValue(formatRateValue(values.era, 2, false), ranks?.era)}</span>
      <span><b>WHIP</b>${formatBullpenRankValue(formatRateValue(values.whip, 2, false), ranks?.whip)}</span>
      <span><b>HR</b>${formatBullpenRankValue(values.homeRuns, ranks?.homeRuns)}</span>
    </div>
  `;
}

function renderLineupPitcherSummary(containerEl, color, staff) {
  if (!containerEl) return;
  const rawStarter = staff?.starter || staff?.current || null;
  const rawCurrent = staff?.current || rawStarter || null;
  const starter = isPlaceholderProbablePitcherText(rawStarter?.fullName || rawStarter?.name || '') ? null : rawStarter;
  const current = isPlaceholderProbablePitcherText(rawCurrent?.fullName || rawCurrent?.name || '') ? starter : rawCurrent;
  const active = Boolean(staff?.active && current && current?.role !== 'starter');
  const hasChangedPitcher = Boolean(current && starter && Number(current?.id) !== Number(starter?.id));
  const showingCurrent = Boolean(current && active);
  const displayPitcher = showingCurrent ? current : starter;
  containerEl.dataset.playerId = String((displayPitcher?.id ?? current?.id ?? starter?.id) || '');
  containerEl.classList.toggle('is-current-pitching', active);
  if (!starter) {
    containerEl.innerHTML = '<span class="lineup-team-pitcher-empty">Awaiting pitcher</span>';
    return;
  }
  const detailLine = showingCurrent && hasChangedPitcher
    ? `<span class="lineup-team-pitcher-current">Starter: ${escapeHtml(lastName(starter?.fullName || starter?.name || 'Pitcher'))}</span>`
    : '';
  const label = displayPitcher?.isPotentialStarter ? 'Potential Starter:' : showingCurrent ? 'Current Pitcher' : 'Starter';
  containerEl.innerHTML = `
    <span class="lineup-team-pitcher-label">${label}</span>
    <span class="lineup-team-pitcher-main pitcher-priority-line">
      <span class="lineup-team-pitcher-name pitcher-priority-name" title="${escapeHtml(displayPitcher?.fullName || displayPitcher?.name || 'Pitcher')}" style="color:${color}">${lineupPitcherNameHtml(displayPitcher)}</span>
      <span class="lineup-team-pitcher-meta pitcher-priority-meta">${pitcherSeasonMetaLine(displayPitcher)}</span>
    </span>
    ${detailLine}
  `;
}

function pitcherSeasonMetaLine(pitcher) {
  const starterRest = Number(pitcher?.daysSinceStarterWorkload);
  const lastPitched = Number(pitcher?.daysSinceLastPitched);
  const memory = pitcher?.isPotentialStarter && Number.isFinite(starterRest)
    ? ` | Starter rest ${starterRest}d${Number.isFinite(lastPitched) && lastPitched !== starterRest ? ` | Last pitched ${lastPitched}d ago` : ''}`
    : pitcher?.isPotentialStarter && Number.isFinite(lastPitched)
      ? ` | Last pitched ${lastPitched}d ago`
      : '';
  return `IP ${pitcherInningsPitched(pitcher)} | ERA ${pitcherEra(pitcher)} | WHIP ${pitcherWhip(pitcher)} | HR Allowed ${pitcherHomeRunsAllowed(pitcher)}${memory}`;
}

function pitcherAppearanceHistoryForSide(boxscore, side, allPlays = []) {
  const team = boxscore?.teams?.[side] || {};
  const players = team?.players || {};
  const pitcherOrder = Array.isArray(team?.pitchers) ? team.pitchers : [];
  const inningMap = new Map();
  for (const play of Array.isArray(allPlays) ? allPlays : []) {
    const pitcherId = Number(play?.matchup?.pitcher?.id);
    if (!Number.isFinite(pitcherId) || pitcherId <= 0) continue;
    if (!players[`ID${pitcherId}`]) continue;
    const inning = Number(play?.about?.inning);
    if (!Number.isFinite(inning) || inning <= 0) continue;
    if (!inningMap.has(pitcherId)) inningMap.set(pitcherId, new Set());
    inningMap.get(pitcherId).add(inning);
  }
  return pitcherOrder
    .map((rawId) => Number(rawId))
    .filter((id) => Number.isFinite(id) && players[`ID${id}`])
    .map((id) => {
      const player = players[`ID${id}`];
      const stat = player?.stats?.pitching || {};
      const innings = [...(inningMap.get(id) || new Set())].sort((a, b) => a - b);
      return {
        id,
        name: player?.person?.fullName || 'Pitcher',
        fullName: player?.person?.fullName || 'Pitcher',
        inningsText: innings.length ? (innings.length === 1 ? String(innings[0]) : `${innings[0]}-${innings[innings.length - 1]}`) : '',
        ip: cleanSummary(stat.inningsPitched) || '0.0',
        er: statNumber(stat.earnedRuns),
        hr: statNumber(stat.homeRuns ?? stat.hrAllowed ?? stat.hr),
        bb: statNumber(stat.baseOnBalls ?? stat.walks),
        k: statNumber(stat.strikeOuts),
        hits: statNumber(stat.hits),
      };
    })
    .filter((entry) => inningsToOuts(entry.ip) > 0 || entry.inningsText);
}

function normalizePitcherDisplayEntry(entry, role = 'current') {
  if (!entry) return null;
  const displayName = cleanSummary(entry?.fullName || entry?.person?.fullName || entry?.name || '');
  if (isPlaceholderProbablePitcherText(displayName)) return null;
  const fallbackToday = role === 'starter' ? 'Not in yet' : 'Available';
  if (entry.fullName && Object.prototype.hasOwnProperty.call(entry, 'era') && Object.prototype.hasOwnProperty.call(entry, 'whip')) {
    const today = cleanSummary(entry.today || entry.todayPitching);
    return {
      ...entry,
      ip: pitcherInningsPitched(entry),
      era: pitcherEra(entry),
      whip: pitcherWhip(entry),
      hrAllowed: pitcherHomeRunsAllowed(entry),
      gs: pitcherGamesStarted(entry),
      gp: pitcherGamesPlayed(entry),
      gf: pitcherGamesFinished(entry),
      saves: pitcherSaveCount(entry),
      so: pitcherStrikeoutCount(entry),
      throws: entry.throws || entry.pitchHand?.code || entry.pitchHand?.description || '',
      today: today && !/no game detail available/i.test(today) ? today : fallbackToday,
      isPotentialStarter: Boolean(entry.isPotentialStarter),
      lastPitchedDate: entry.lastPitchedDate || '',
      daysSinceLastPitched: entry.daysSinceLastPitched ?? null,
      lastStarterWorkloadDate: entry.lastStarterWorkloadDate || '',
      daysSinceStarterWorkload: entry.daysSinceStarterWorkload ?? null,
      usedYesterday: Boolean(entry.usedYesterday),
      role: entry.role || role,
    };
  }
  const today = cleanSummary(entry?.today || entry?.todayPitching);
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
    today: today && !/no game detail available/i.test(today) ? today : (role === 'starter' ? 'Not in yet' : pitcherTodaySummary(entry)),
    pitches: Number(entry?.pitches) || pitchCount(entry),
    isActive: Boolean(entry?.isActive),
    isPotentialStarter: Boolean(entry?.isPotentialStarter),
    lastPitchedDate: entry?.lastPitchedDate || '',
    daysSinceLastPitched: entry?.daysSinceLastPitched ?? null,
    lastStarterWorkloadDate: entry?.lastStarterWorkloadDate || '',
    daysSinceStarterWorkload: entry?.daysSinceStarterWorkload ?? null,
    usedYesterday: Boolean(entry?.usedYesterday),
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
  const linescore = live?.liveData?.linescore;
  const side = resolveCurrentSide(activePlay, linescore);
  const livePitcher = linescorePitcherSnapshot(linescore);
  const currentPitcher = livePitcher.pitcher || activePlay?.matchup?.pitcher || null;
  return {
    activePlay,
    battingSide: side.battingSide,
    currentPitcher,
    currentPitchingSide: currentPitcher?.id ? side.fieldingSide : '',
  };
}

async function resolveFreshLineupPitchers(game) {
  const fallback = {
    away: resolveLineupPitcherForDisplay(game, 'away'),
    home: resolveLineupPitcherForDisplay(game, 'home'),
  };
  if (shouldDisplayStarterOnly(game)) return fallback;
  if (!game?.gamePk) return fallback;
  if (shouldPreferProbablePitcher(game)) {
    const awayAbbrev = canonicalTeamAbbrev(game?.away || game?.teams?.away?.team?.abbreviation || 'AWAY');
    const homeAbbrev = canonicalTeamAbbrev(game?.home || game?.teams?.home?.team?.abbreviation || 'HOME');
    const officialProbables = await fetchOfficialProbablePitchersForGame(
      game,
      awayAbbrev,
      homeAbbrev,
      officialDateForGame(game),
    );
    game.probablePitchers = sanitizeProbablePitchers(officialProbables || {}, game, awayAbbrev, homeAbbrev);
    if (probablePitchersNeedFallback(game.probablePitchers)) {
      game.probablePitchers = await fillPotentialStartersForTbdProbables(game.probablePitchers, game, awayAbbrev, homeAbbrev, officialDateForGame(game));
    }
    return {
      away: resolveLineupPitcherForDisplay(game, 'away'),
      home: resolveLineupPitcherForDisplay(game, 'home'),
    };
  }

  try {
    const live = await getLiveGameFeed(game.gamePk);
    const awayTeam = live?.gameData?.teams?.away || {};
    const homeTeam = live?.gameData?.teams?.home || {};
    const awayAbbrev = canonicalTeamAbbrev(awayTeam.abbreviation || awayTeam.teamCode?.toUpperCase() || game?.away || 'AWAY');
    const homeAbbrev = canonicalTeamAbbrev(homeTeam.abbreviation || homeTeam.teamCode?.toUpperCase() || game?.home || 'HOME');
    const probablePitchers = sanitizeProbablePitchers({
      away: awayTeam?.probablePitcher || game?.probablePitchers?.away || null,
      home: homeTeam?.probablePitcher || game?.probablePitchers?.home || null,
    }, game, awayAbbrev, homeAbbrev);
    const awayPlayers = live?.liveData?.boxscore?.teams?.away?.players || {};
    const homePlayers = live?.liveData?.boxscore?.teams?.home?.players || {};
    const liveLookup = {
      ...buildPlayerLookup(awayPlayers, live?.gameData?.players || {}, awayAbbrev, game?.awayColor || getTeamColor(awayAbbrev), game?.awayLogo || getLogoPath(awayAbbrev)),
      ...buildPlayerLookup(homePlayers, live?.gameData?.players || {}, homeAbbrev, game?.homeColor || getTeamColor(homeAbbrev), game?.homeLogo || getLogoPath(homeAbbrev)),
    };
    if (Object.keys(liveLookup).length) persistPlayerLookupForGame(game, liveLookup);
    game.probablePitchers = probablePitchers;

    const livePitcher = resolveLivePitcherSnapshot(live);
    const liveAllPlays = live?.liveData?.plays?.allPlays || [];
    const sidePlayers = {
      away: awayPlayers,
      home: homePlayers,
    };
    const livePitcherId = Number(livePitcher.currentPitcher?.id);
    const currentPitchingSide = livePitcher.currentPitchingSide
      || (Number.isFinite(livePitcherId) && awayPlayers[`ID${livePitcherId}`] ? 'away' : '')
      || (Number.isFinite(livePitcherId) && homePlayers[`ID${livePitcherId}`] ? 'home' : '');
    const sidePitcherOrder = {
      away: live?.liveData?.boxscore?.teams?.away?.pitchers || [],
      home: live?.liveData?.boxscore?.teams?.home?.pitchers || [],
    };
    game.pitching = game.pitching || emptyPitchingData();
    game.pitching.away = {
      ...(game.pitching.away || { current: null, bullpen: [] }),
      history: pitcherAppearanceHistoryForSide(live?.liveData?.boxscore, 'away', liveAllPlays),
    };
    game.pitching.home = {
      ...(game.pitching.home || { current: null, bullpen: [] }),
      history: pitcherAppearanceHistoryForSide(live?.liveData?.boxscore, 'home', liveAllPlays),
    };
    const latestPitcherIdForSide = (side) => {
      const ordered = Array.isArray(sidePitcherOrder[side]) ? sidePitcherOrder[side] : [];
      for (let i = ordered.length - 1; i >= 0; i -= 1) {
        const id = numericPlayerId(ordered[i]);
        if (Number.isFinite(id) && (sidePlayers[side] || {})[`ID${id}`]) return id;
      }
      return NaN;
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
          starterSource = { ...fetchedStarter, isPotentialStarter: Boolean(probable.isPotentialStarter), lastPitchedDate: probable.lastPitchedDate || '', daysSinceLastPitched: probable.daysSinceLastPitched ?? null, source: probable.source || fetchedStarter.source };
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

      const liveCurrentPitcherId = Number(livePitcher.currentPitcher?.id);
      const latestPitcherId = latestPitcherIdForSide(side);
      const currentPitcherId = currentPitchingSide === side
        ? (Number.isFinite(liveCurrentPitcherId) && liveCurrentPitcherId > 0 ? liveCurrentPitcherId : latestPitcherId)
        : NaN;
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
        active: side === currentPitchingSide,
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
  const activePitchingSide = game?.battingSide === 'home' ? 'away' : game?.battingSide === 'away' ? 'home' : '';
  const usedYesterdayIds = pitcherUsedYesterdayIdsForTeam(game, side === 'away' ? game?.away : game?.home);
  const enrichPitcher = (entry) => {
    const profile = Number.isFinite(Number(entry?.id)) ? game?.playerLookup?.[String(entry.id)] || null : null;
    const id = Number(entry?.id ?? profile?.id);
    const marked = Number.isFinite(id) && usedYesterdayIds.has(id) ? { ...entry, usedYesterday: true } : entry;
    return profile ? {
      ...marked,
      ...profile,
      isPotentialStarter: Boolean(marked?.isPotentialStarter || profile?.isPotentialStarter),
      lastPitchedDate: marked?.lastPitchedDate || profile?.lastPitchedDate || '',
      daysSinceLastPitched: marked?.daysSinceLastPitched ?? profile?.daysSinceLastPitched ?? null,
      usedYesterday: Boolean(marked?.usedYesterday || profile?.usedYesterday),
      role: entry?.role || profile?.role,
    } : marked;
  };
  const bullpen = Array.isArray(rawStaff?.bullpen)
    ? rawStaff.bullpen.map((entry) => normalizePitcherDisplayEntry(enrichPitcher(entry), entry?.role || 'bullpen')).filter(Boolean)
    : [];
  const history = Array.isArray(rawStaff?.history) ? rawStaff.history : [];
  const probable = shouldPreferProbablePitcher(game)
    ? previewProbableForSide(game, side)
    : game?.probablePitchers?.[side] || game?.teams?.[side]?.probablePitcher || null;
  const probableProfile = probable?.id ? game?.playerLookup?.[String(probable.id)] || null : null;
  const historyStarter = starterFromPitchingHistory(game, side);
  const fallback = historyStarter || normalizePitcherDisplayEntry(enrichPitcher(probableProfile || probable), 'starter');
  if (historyStarter) {
    if (shouldDisplayStarterOnly(game) || shouldPreferProbablePitcher(game) || side !== activePitchingSide) {
      return {
        current: historyStarter,
        bullpen,
        history,
      };
    }
  }
  if (shouldPreferProbablePitcher(game) && fallback) {
    return {
      current: { ...fallback, today: cleanSummary(fallback.today) || 'Not in yet', role: 'starter' },
      bullpen,
      history,
    };
  }
  if (shouldPreferProbablePitcher(game)) {
    return { current: null, bullpen, history };
  }

  const current = side === activePitchingSide
    ? normalizePitcherDisplayEntry(enrichPitcher(rawStaff?.current), rawStaff?.current?.role || 'current')
    : null;
  if (current) return { current, bullpen, history };

  return {
    current: fallback ? { ...fallback, today: cleanSummary(fallback.today) || 'Not in yet', role: 'starter' } : null,
    bullpen,
    history,
  };
}

function resolveLineupPitcherForDisplay(game, side) {
  const activePitchingSide = game?.battingSide === 'home' ? 'away' : game?.battingSide === 'away' ? 'home' : '';
  const probable = shouldPreferProbablePitcher(game)
    ? previewProbableForSide(game, side)
    : game?.probablePitchers?.[side] || game?.teams?.[side]?.probablePitcher || null;
  const probableProfile = probable?.id ? game?.playerLookup?.[String(probable.id)] || null : null;
  const historyStarter = shouldPreferProbablePitcher(game) ? null : starterFromPitchingHistory(game, side);
  const starter = historyStarter || normalizePitcherDisplayEntry(probableProfile || probable, 'starter');
  if (shouldDisplayStarterOnly(game)) {
    return {
      starter,
      current: starter,
      active: false,
    };
  }
  if (shouldPreferProbablePitcher(game)) {
    return {
      starter,
      current: starter,
      active: false,
    };
  }
  const currentSource = game?.pitching?.[side]?.current;
  const currentProfile = currentSource?.id ? game?.playerLookup?.[String(currentSource.id)] || null : null;
  const current = side === activePitchingSide
    ? normalizePitcherDisplayEntry(currentProfile ? { ...currentSource, ...currentProfile, role: currentSource?.role || currentProfile?.role } : currentSource, 'current')
    : null;
  return {
    starter: starter || current,
    current,
    active: side === activePitchingSide,
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

function shiftSelectedDate(days) {
  const baseValue = dateInput.value || formatDate(new Date());
  const parsed = new Date(`${baseValue}T00:00:00`);
  const baseDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  baseDate.setDate(baseDate.getDate() + days);
  const nextDate = formatDate(baseDate);
  if (dateInput.value === nextDate) return;
  dateInput.value = nextDate;
  dateInput.dispatchEvent(new Event('change', { bubbles: true }));
  requestAnimationFrame(() => {
    if (isTextEntryTarget(document.activeElement)) document.activeElement.blur();
  });
}

function isDateShortcutTypingTarget(target) {
  const el = target instanceof Element ? target : null;
  if (!el) return false;
  if (el.closest('input, textarea, select, [contenteditable="true"]')) return true;
  return false;
}

function initDateKeyboardShortcuts() {
  datePrevBtnEl?.addEventListener('click', () => shiftSelectedDate(-1));
  dateNextBtnEl?.addEventListener('click', () => shiftSelectedDate(1));
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    if (isDateShortcutTypingTarget(e.target)) return;
    const key = String(e.key || '').toLowerCase();
    if (key !== 'a' && key !== 'd') return;
    e.preventDefault();
    shiftSelectedDate(key === 'a' ? -1 : 1);
  });
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
  const inningEl = card.querySelector('.score-mini-inning');
  if (inningEl) {
    inningEl.classList.toggle('is-pregame-toggle', pregame);
    inningEl.setAttribute('role', pregame ? 'button' : 'text');
    inningEl.setAttribute('tabindex', pregame ? '0' : '-1');
    inningEl.setAttribute('title', pregame ? 'Mark this pregame as a tossup' : '');
  }
  card.querySelector('.scoreboard')?.classList.toggle('is-tossup-marked', tossupScoreboardGamePks.has(String(game.gamePk)));
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
    const plays = (game.ticker?.length ? game.ticker : [{ text: game.lastPlay || defaultPlayText(game), color: '#cddfff' }]).slice(0, 3);
    renderMultiLineSummary(lastPlayEl, plays);
    return;
  }

  renderSingleLineMarquee(lastPlayEl, game.lastPlay || defaultPlayText(game));
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
  hydratePitcherLastStartHrMarkers(card);
  hydratePitcherOpponentHandMarkers(card);
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

function setLineupView(view, options = {}) {
  currentLineupView = ['lineups', 'roster', 'pitching'].includes(view) ? view : 'lineups';
  if (options.persist !== false) saveLineupView(currentLineupView);
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
    const playColumn = lineupTickerEl.closest('.play-col');
    if (playColumn) {
      playColumn.dataset.playByPlayTrigger = '1';
      playColumn.title = 'Open full play by play';
    }
    const items = game.ticker?.length ? game.ticker : [{ text: defaultPlayText(game), color: '#cddfff' }];
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

function boldNamesInPlayText(text) {
  const escaped = escapeHtml(cleanPlayText(text));
  return escaped.replace(/\b([A-Z][A-Za-z'.-]+(?:\s+[A-Z][A-Za-z'.-]+){1,3})\b/g, '<strong>$1</strong>');
}

function fullPlayByPlayDialogHtml(game) {
  const plays = Array.isArray(game?.playByPlay) ? [...game.playByPlay] : [];
  if (!plays.length) return '<p class="pbp-empty">Full play by play is not loaded for this game yet.</p>';
  const groups = new Map();
  for (const play of plays) {
    const half = play.half === 'top' ? 'top' : play.half === 'bottom' ? 'bottom' : '';
    const inning = play.inning || '';
    const key = `${inning}:${half}`;
    if (!groups.has(key)) {
      groups.set(key, {
        inning,
        half,
        color: play.color || (half === 'top' ? game?.awayColor : game?.homeColor) || '#cddfff',
        descriptions: [],
      });
    }
    const description = cleanPlayText(play.description || play.event || '');
    if (description) groups.get(key).descriptions.push(description);
  }
  return [...groups.values()].reverse().map((group) => {
    const label = `${group.half === 'top' ? 'Top' : group.half === 'bottom' ? 'Bottom' : 'Inning'} ${group.inning || ''}`.trim();
    const paragraph = group.descriptions.map((description) => boldNamesInPlayText(description)).join(' ');
    return `
      <section class="pbp-half" style="--pbp-team-color:${escapeHtml(group.color)}">
        <h3>${escapeHtml(label)}</h3>
        <p>${paragraph || 'No recorded plays.'}</p>
      </section>
    `;
  }).join('');
}

function playByPlayDialogShellHtml(game) {
  return `
    <div class="player-card-head">
      <div>
        <span class="eyebrow">Play By Play</span>
        <h2>${escapeHtml(displayTeamAbbrev(game?.away))} @ ${escapeHtml(displayTeamAbbrev(game?.home))}</h2>
      </div>
      <button type="button" data-pbp-close>x</button>
    </div>
    <div class="pbp-text"></div>
  `;
}

function openFullPlayByPlayDialog(game) {
  if (!game) return;
  let dialog = document.getElementById('playByPlayDialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'playByPlayDialog';
    dialog.className = 'player-stat-modal play-by-play-modal';
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.closest('[data-pbp-close]')) dialog.close();
    });
    document.body.appendChild(dialog);
  }
  dialog.innerHTML = playByPlayDialogShellHtml(game);
  const content = dialog.querySelector('.pbp-text');
  if (content) content.innerHTML = fullPlayByPlayDialogHtml(game);
  dialog.showModal();
}

function lineupRunDisplay(value) {
  return Number.isFinite(Number(value)) ? String(Number(value)) : '-';
}

function lineupTotalDisplay(value) {
  return Number.isFinite(Number(value)) ? String(Number(value)) : '-';
}

function lineupHitsDisplay(game, side) {
  const direct = side === 'away' ? game?.awayHits : game?.homeHits;
  if (Number.isFinite(Number(direct))) return String(Number(direct));
  const inningHits = (Array.isArray(game?.lineScoreInnings) ? game.lineScoreInnings : [])
    .reduce((sum, inning) => {
      const hits = Number(inning?.[side]?.hits);
      return Number.isFinite(hits) ? sum + hits : sum;
    }, 0);
  return inningHits > 0 ? String(inningHits) : '-';
}

function renderLineupScoreboard(game) {
  const board = lineupOverlayEl?.querySelector('.lineup-state-scoreboard');
  if (!board || !game) return;
  board.dataset.gamePk = String(game.gamePk || '');
  const innings = (Array.isArray(game.lineScoreInnings) ? game.lineScoreInnings : [])
    .filter((inning) => Number.isFinite(Number(inning?.num)))
    .slice(0, 12);

  board.replaceChildren();
  if (!innings.length) {
    const awayCode = document.createElement('span');
    awayCode.className = 'lineup-state-away-code';
    awayCode.textContent = displayTeamAbbrev(game.away);
    awayCode.style.color = game.awayColor;
    const awayScore = document.createElement('span');
    awayScore.className = 'lineup-state-score';
    awayScore.textContent = game.awayScore;
    const inning = document.createElement('span');
    inning.className = 'lineup-state-inning';
    inning.textContent = game.inningShort;
    const pregame = shouldPreferProbablePitcher(game);
    inning.classList.toggle('is-pregame-toggle', pregame);
    inning.setAttribute('role', pregame ? 'button' : 'text');
    inning.setAttribute('tabindex', pregame ? '0' : '-1');
    inning.setAttribute('title', pregame ? 'Mark this pregame as a tossup' : '');
    inning.setAttribute('aria-pressed', tossupScoreboardGamePks.has(String(game.gamePk)) ? 'true' : 'false');
    const homeScore = document.createElement('span');
    homeScore.className = 'lineup-state-score';
    homeScore.textContent = game.homeScore;
    const homeCode = document.createElement('span');
    homeCode.className = 'lineup-state-home-code';
    homeCode.textContent = displayTeamAbbrev(game.home);
    homeCode.style.color = game.homeColor;
    board.append(awayCode, awayScore, inning, homeScore, homeCode);
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'lineup-inning-scoreboard';
  wrap.style.setProperty('--lineup-score-cols', String(innings.length));

  const corner = document.createElement('span');
  corner.className = 'lineup-score-cell lineup-score-corner';
  wrap.appendChild(corner);
  for (const inning of innings) {
    const head = document.createElement('span');
    head.className = 'lineup-score-cell lineup-score-head';
    head.textContent = String(inning.num);
    wrap.appendChild(head);
  }
  const totalHead = document.createElement('span');
  totalHead.className = 'lineup-score-cell lineup-score-total-head';
  totalHead.textContent = 'R';
  wrap.appendChild(totalHead);
  const hitsHead = document.createElement('span');
  hitsHead.className = 'lineup-score-cell lineup-score-total-head lineup-score-hits-head';
  hitsHead.textContent = 'H';
  wrap.appendChild(hitsHead);

  const addTeamRow = (side, abbrev, score, color) => {
    const team = document.createElement('span');
    team.className = `lineup-score-cell lineup-score-team lineup-score-team-${side}`;
    team.textContent = displayTeamAbbrev(abbrev);
    team.style.color = color;
    wrap.appendChild(team);
    for (const inning of innings) {
      const cell = document.createElement('span');
      cell.className = 'lineup-score-cell lineup-score-run';
      cell.textContent = lineupRunDisplay(inning?.[side]?.runs);
      wrap.appendChild(cell);
    }
    const total = document.createElement('span');
    total.className = 'lineup-score-cell lineup-score-total';
    total.textContent = lineupTotalDisplay(score);
    wrap.appendChild(total);
    const hits = document.createElement('span');
    hits.className = 'lineup-score-cell lineup-score-total lineup-score-hits';
    hits.textContent = lineupHitsDisplay(game, side);
    wrap.appendChild(hits);
  };

  addTeamRow('away', game.away, game.awayScore, game.awayColor);
  addTeamRow('home', game.home, game.homeScore, game.homeColor);
  board.appendChild(wrap);
}

function closePlayerStatOverlay() {
  if (!playerStatOverlayEl) return;
  playerStatOverlayEl.hidden = true;
  activePlayerStatContext = null;
  playerStatTouchStart = null;
  syncPlayerStatLeaderBadges();
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
  const status = person?.status || fallbackProfile?.status || {};

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
    status,
    playerGames: mlbStatNumber(hitting, 'gamesPlayed') || mlbStatNumber(fielding, 'gamesPlayed') || fallbackProfile?.playerGames || fallbackProfile?.playerGamesPlayed || 0,
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
      runs: mlbStatNumber(hitting, 'runs') || fallbackProfile?.batting?.runs || 0,
      hits: mlbStatNumber(hitting, 'hits') || fallbackProfile?.batting?.hits || 0,
      atBats: mlbStatNumber(hitting, 'atBats') || fallbackProfile?.batting?.atBats || 0,
      playerGames: mlbStatNumber(hitting, 'gamesPlayed') || mlbStatNumber(fielding, 'gamesPlayed') || fallbackProfile?.batting?.playerGames || fallbackProfile?.playerGames || 0,
      games: mlbStatNumber(hitting, 'gamesPlayed')
        || mlbStatNumber(fielding, 'gamesPlayed')
        || fallbackProfile?.batting?.games
        || fallbackProfile?.games
        || 0,
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
  if (shouldPreferProbablePitcher(game)) {
    return previewProbableForSide(game, opponentSide);
  }
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
    const seenSeasonSignatures = new Set();
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
      const signature = matchupHistoryEntrySignature(seasonEntry);
      if (seenSeasonSignatures.has(signature)) continue;
      seenSeasonSignatures.add(signature);
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

function matchupHistoryEntrySignature(entry) {
  if (!entry) return '';
  return [
    entry.plateAppearances,
    entry.atBats,
    entry.hits,
    entry.doubles,
    entry.triples,
    entry.homeRuns,
    entry.rbi,
    entry.walks,
    entry.strikeOuts,
    entry.totalBases,
  ].map((value) => String(statNumber(value))).join(':');
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
    const seenSeasonSignatures = new Set();
    for (let season = currentSeason; season >= earliestSeason; season -= 1) {
      const url = new URL(`${MLB_API_BASE}/people/${batter}`);
      url.searchParams.set('hydrate', `stats(group=[hitting],type=[vsTeam],opposingTeamId=${opponent},season=${season},sportId=1)`);
      const response = await getJson(url.toString());
      const seasonEntry = matchupHistorySeasonEntry(response?.people?.[0]?.stats?.[0]?.splits?.[0]?.stat || null, season);
      if (!matchupHistoryHasSample(seasonEntry)) continue;
      const signature = matchupHistoryEntrySignature(seasonEntry);
      if (seenSeasonSignatures.has(signature)) continue;
      seenSeasonSignatures.add(signature);
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

function playerStatLineupForSide(game, side) {
  return fallbackTeamLineupFromLookup(game, side)
    .filter((entry) => Number.isFinite(Number(entry?.id)) && Number(entry.id) > 0);
}

function playerStatSideForProfile(profile, game) {
  const team = String(profile?.teamAbbrev || '').toUpperCase();
  if (team && String(game?.away || '').toUpperCase() === team) return 'away';
  if (team && String(game?.home || '').toUpperCase() === team) return 'home';
  const id = Number(profile?.id);
  if (playerStatLineupForSide(game, 'away').some((entry) => Number(entry.id) === id)) return 'away';
  if (playerStatLineupForSide(game, 'home').some((entry) => Number(entry.id) === id)) return 'home';
  return '';
}

function activePitcherNavEntriesForGame(game) {
  return ['away', 'home']
    .map((side) => {
      const summary = resolveLineupPitcherForDisplay(game, side);
      const pitcher = summary?.current || summary?.starter || scoreboardPitcherForSide(game, side);
      const id = Number(pitcher?.id);
      return Number.isFinite(id) && id > 0 ? { id, side } : null;
    })
    .filter(Boolean);
}

function playerStatNavEntriesForProfile(profile, game, pitcherProfile) {
  if (!game || !profile) return [];
  if (pitcherProfile) return activePitcherNavEntriesForGame(game);
  const side = playerStatSideForProfile(profile, game);
  if (!side) return [];
  return playerStatLineupForSide(game, side).map((entry) => ({ id: Number(entry.id), side }));
}

function setPlayerStatNavigationContext(profile, game, pitcherProfile) {
  const entries = playerStatNavEntriesForProfile(profile, game, pitcherProfile);
  activePlayerStatContext = {
    game,
    playerId: Number(profile?.id),
    kind: pitcherProfile ? 'pitcher' : 'hitter',
    entries,
  };
  if (playerStatOverlayEl) {
    playerStatOverlayEl.dataset.playerId = String(profile?.id || '');
    playerStatOverlayEl.dataset.playerNavKind = activePlayerStatContext.kind;
  }
}

function syncPlayerStatLeaderBadges() {
  if (!playerStatLeaderBadgesEl) return;
  const context = activePlayerStatContext;
  const entry = context?.kind === 'leader'
    ? (context.entries || []).find((item) => Number(item.id) === Number(context.playerId))
    : null;
  if (!entry) {
    playerStatLeaderBadgesEl.hidden = true;
    playerStatLeaderBadgesEl.replaceChildren();
    return;
  }
  const rank = ordinalNumber(entry.rank);
  const statLabel = entry.statLabel || context.categoryLabel || '';
  const statValue = entry.statValue || '';
  const rankSubLabel = context.positionFilterLabel || 'Rank';
  playerStatLeaderBadgesEl.hidden = false;
  playerStatLeaderBadgesEl.innerHTML = `
    <span class="player-stat-leader-ribbon"><b>${escapeHtml(rank || '#')}</b><small>${escapeHtml(rankSubLabel)}</small></span>
    <span class="player-stat-leader-ribbon"><b>${escapeHtml(statLabel)}</b><small>Stat</small></span>
    <span class="player-stat-leader-ribbon"><b>${escapeHtml(statValue)}</b><small>Total</small></span>
  `;
}

function navigatePlayerStatCard(step = 1) {
  if (!playerStatOverlayEl || playerStatOverlayEl.hidden || !activePlayerStatContext) return false;
  const entries = activePlayerStatContext.entries || [];
  if (entries.length < 2) return false;
  const currentId = Number(activePlayerStatContext.playerId);
  const currentIndex = Math.max(0, entries.findIndex((entry) => Number(entry.id) === currentId));
  const nextIndex = (currentIndex + Number(step || 1) + entries.length) % entries.length;
  const next = entries[nextIndex];
  if (!next?.id) return false;
  const nextGame = activePlayerStatContext.kind === 'leader'
    ? buildLeaderOverlayGame(next)
    : activePlayerStatContext.game;
  const nextContext = activePlayerStatContext.kind === 'leader'
    ? { ...activePlayerStatContext, game: nextGame, playerId: Number(next.id) }
    : null;
  openPlayerStatOverlay(next.id, nextGame, nextContext ? { navContext: nextContext } : {});
  return true;
}

function setTossupScoreboardMarked(gamePk, marked) {
  const key = String(gamePk || '');
  if (!key) return false;
  if (marked) tossupScoreboardGamePks.add(key);
  else tossupScoreboardGamePks.delete(key);
  saveTossupScoreboards();
  const card = cardForGamePk(key);
  card?.querySelector('.scoreboard')?.classList.toggle('is-tossup-marked', tossupScoreboardGamePks.has(key));
  lineupOverlayEl?.querySelector('.lineup-state-inning.is-pregame-toggle')
    ?.setAttribute('aria-pressed', tossupScoreboardGamePks.has(key) ? 'true' : 'false');
  return true;
}

function toggleTossupScoreboardMarked(gamePk) {
  const key = String(gamePk || '');
  return setTossupScoreboardMarked(key, !tossupScoreboardGamePks.has(key));
}

async function openPlayerStatOverlay(playerId, game, options = {}) {
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
    if (options.navContext) {
      activePlayerStatContext = { ...options.navContext, playerId: Number(playerId), game };
      if (playerStatOverlayEl) {
        playerStatOverlayEl.dataset.playerId = String(playerId || '');
        playerStatOverlayEl.dataset.playerNavKind = activePlayerStatContext.kind || 'leader';
      }
    }
    syncPlayerStatLeaderBadges();
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
  if (options.navContext) {
    activePlayerStatContext = { ...options.navContext, playerId: Number(playerId), game };
    if (playerStatOverlayEl) {
      playerStatOverlayEl.dataset.playerId = String(playerId || '');
      playerStatOverlayEl.dataset.playerNavKind = activePlayerStatContext.kind || 'leader';
    }
  } else {
    setPlayerStatNavigationContext(profile, game, pitcherProfile);
  }
  syncPlayerStatLeaderBadges();
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
  const splitToken = `${profile.id || ''}:${Date.now()}`;
  if (playerStatExtraEl) playerStatExtraEl.dataset.splitToken = splitToken;
  if (pitcherProfile) {
    playerStatTodayEl.innerHTML = playerStatRowsHtml('TODAY', [['Line', profile.todayPitching]]);
    playerStatSeasonEl.innerHTML = playerStatRowsHtml('PITCHING', [
      ['ERA', profile.pitching.era],
      ['WHIP', profile.pitching.whip],
      ['IP', profile.pitching.ip],
      ['K', profile.pitching.so],
      ['BB', profile.pitching.bb],
      ['HR', pitcherHomeRunsAllowed(profile)],
      ['W-L', `${profile.pitching.wins}-${profile.pitching.losses}`],
      ['SV', profile.pitching.saves],
    ]);
    renderPitcherOpponentHandSplits(profile, splitToken);
  } else {
    playerStatTodayEl.innerHTML = playerStatRowsHtml('TODAY', [['Line', profile.todayBatting]]);
    const extraBaseHits = statNumber(profile.batting.doubles) + statNumber(profile.batting.triples) + statNumber(profile.batting.hr);
    playerStatSeasonEl.innerHTML = playerStatRowsHtml('BATTING', [
      ['AB', profile.batting.atBats],
      ['H', profile.batting.hits],
      ['AVG', profile.batting.avg],
      ['OBP', profile.batting.obp],
      ['SLG', profile.batting.slg],
      ['XBH', extraBaseHits],
      ['HR', profile.batting.hr],
      ['RBI', profile.batting.rbi],
      ['R', profile.batting.runs],
    ]);
    renderPlayerHandedSplits(profile, game, splitToken);
  }
  if (playerStatMatchupEl) {
    const pitcherCard = pitcherProfile;
    const recentToken = `${profile.id}:${dateInput.value || formatDate(new Date())}:${Date.now()}`;
    playerStatMatchupEl.dataset.recentToken = recentToken;
    playerStatMatchupEl.innerHTML = renderRecentBattingHistoryHtml([pitcherCard ? 'Recent appearances loading' : 'Recent history loading']);
    (pitcherCard ? getPlayerRecentPitchingDetails(profile.id, game) : getPlayerRecentBattingDetails(profile.id, game, playerStatRecentGameWindow))
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
    hydratePitcherLastStartHrMarkers(playerStatOverlayEl);
    hydratePitcherOpponentHandMarkers(playerStatOverlayEl);
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
    gameBatting: lineupGameBattingStats(entry),
    batting: entry?.batting || entry?.seasonStats?.batting || {},
    isActive: Boolean(entry?.isActive),
    substitutionStarter: entry?.substitutionStarter ? normalizedLineupEntry(entry.substitutionStarter, slot) : null,
  };
}

function lineupDisplayName(entry) {
  return cleanSummary(entry?.fullName || entry?.name || entry?.person?.fullName || '');
}

function lineupLooksAlphabetical(lineup = []) {
  const names = (Array.isArray(lineup) ? lineup : [])
    .map(lineupDisplayName)
    .filter(Boolean);
  if (names.length < 5) return false;
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  let samePositions = 0;
  for (let i = 0; i < names.length; i += 1) {
    if (normalizeNameKey(names[i]) === normalizeNameKey(sorted[i])) samePositions += 1;
  }
  return samePositions >= Math.max(5, names.length - 1);
}

function hasTrustedLineupOrder(game, side) {
  const lineup = side === 'away' ? game?.lineup?.away : game?.lineup?.home;
  if (!Array.isArray(lineup) || !lineup.length) return false;
  if (shouldPreferProbablePitcher(game) && lineupLooksAlphabetical(lineup)) return false;
  return true;
}

function archivedFallbackLineup(game, side) {
  if (!shouldPreferProbablePitcher(game) && !isCompletedGameCard(game)) return [];
  const selectedDate = dateInput.value || formatDate(new Date());
  const today = formatDate(new Date());
  const lookupEnd = selectedDate > today ? today : selectedDate;
  const dates = recentCalendarDateWindow(lookupEnd, 21).filter((date) => date < selectedDate);
  const team = canonicalTeamAbbrev(side === 'away' ? game?.away : game?.home || '');
  const candidates = [];
  for (const date of dates.reverse()) {
    candidates.push(...getArchivedGames(date).map(normalizeCompletedCard));
  }
  const exactMatch = candidates.find((card) => {
    return sameTeamAbbrev(card?.away, game?.away) && sameTeamAbbrev(card?.home, game?.home);
  });
  const sameTeam = exactMatch || candidates.find((card) => {
    const away = canonicalTeamAbbrev(card?.away || '');
    const home = canonicalTeamAbbrev(card?.home || '');
    return away === team || home === team;
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
  if (Array.isArray(archivedLineup) && archivedLineup.length) {
    return (sanitizeStoredLineup({ [archivedSide]: archivedLineup })?.[archivedSide] || [])
      .map((entry) => entry?.substitutionStarter ? entry.substitutionStarter : entry)
      .map((entry) => ({ ...entry, substitutionStarter: null, today: '0-0', isActive: false, isNextUp: false }));
  }
  return [];
}

function fallbackTeamLineupFromLookup(game, side) {
  const team = side === 'away' ? game?.away : game?.home;
  const lineup = side === 'away' ? game?.lineup?.away : game?.lineup?.home;
  const bench = side === 'away' ? game?.lineup?.awayBench : game?.lineup?.homeBench;
  const archived = archivedFallbackLineup(game, side);
  if (shouldPreferProbablePitcher(game) && archived.length) {
    return normalizeLineupCollectionForSide(game, side, archived);
  }

  if (Array.isArray(lineup) && lineup.length && hasTrustedLineupOrder(game, side)) {
    return normalizeLineupCollectionForSide(game, side, lineup);
  }

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
    gameBatting: p?.gameBatting || {},
    batting: p?.batting || {},
  })));
}

function rosterEntryPlayer(entry) {
  const person = entry?.person || entry || {};
  const position = entry?.position || person?.primaryPosition || {};
  return {
    id: Number(person?.id),
    fullName: person?.fullName || person?.name || entry?.fullName || 'Unknown',
    position: position?.abbreviation || position?.code || person?.primaryPosition?.abbreviation || '',
    status: entry?.status || person?.status || {},
  };
}

async function fetchTeamActiveRoster(teamAbbrev, game) {
  const team = await getTeamByAbbrev(teamAbbrev, officialDateForGame(game)).catch(() => null);
  const teamId = Number(team?.id || TEAM_IDS[canonicalTeamAbbrev(teamAbbrev)]);
  if (!Number.isFinite(teamId)) return [];
  const season = seasonForDate(officialDateForGame(game));
  const cacheKey = `${teamId}:${season}:active`;
  if (teamActiveRosterCache.has(cacheKey)) return teamActiveRosterCache.get(cacheKey);
  const promise = (async () => {
    const url = new URL(`${MLB_API_BASE}/teams/${teamId}/roster`);
    url.searchParams.set('rosterType', 'active');
    url.searchParams.set('season', String(season));
    url.searchParams.set('hydrate', 'person');
    const roster = await getJson(url.toString());
    return listify(roster?.roster).map(rosterEntryPlayer).filter((player) => Number.isFinite(player.id));
  })().catch((error) => {
    teamActiveRosterCache.delete(cacheKey);
    throw error;
  });
  teamActiveRosterCache.set(cacheKey, promise);
  return promise;
}

function injuryTimeText(entry, rosterType) {
  const text = [
    entry?.status?.description,
    entry?.status?.code,
    entry?.status?.reason,
    rosterType,
  ].filter(Boolean).join(' ');
  if (/60/.test(text)) return '60-day IL';
  if (/15/.test(text)) return '15-day IL';
  if (/10/.test(text)) return '10-day IL';
  return cleanSummary(entry?.status?.description || rosterType || 'Injured list');
}

function rosterStatusText(entry) {
  return [
    entry?.status?.code,
    entry?.status?.description,
    entry?.status?.reason,
    entry?.person?.status?.code,
    entry?.person?.status?.description,
    entry?.person?.status?.reason,
  ].filter(Boolean).join(' ');
}

function isInjuredRosterEntry(entry) {
  const statusText = rosterStatusText(entry);
  return /(injur|disabled|IL|10-day|15-day|60-day)/i.test(statusText)
    && !/7-day|full season/i.test(statusText)
    && !/^(A|active)$/i.test(statusText.trim());
}

function injuryDiagnosisText(entry) {
  const person = entry?.person || {};
  const injury = listify(person?.injuries || person?.currentInjuries || entry?.injuries)[0] || {};
  return cleanSummary(
    injury?.description
    || injury?.bodyPart
    || injury?.injury
    || entry?.status?.reason
    || entry?.status?.description
    || 'Diagnosis unavailable'
  );
}

async function fetchTeamInjuredPlayers(teamAbbrev, game) {
  const team = await getTeamByAbbrev(teamAbbrev, officialDateForGame(game)).catch(() => null);
  const teamId = Number(team?.id || TEAM_IDS[canonicalTeamAbbrev(teamAbbrev)]);
  if (!Number.isFinite(teamId)) return [];
  const season = seasonForDate(officialDateForGame(game));
  const cacheKey = `${teamId}:${season}:injuries`;
  if (teamInjuryRosterCache.has(cacheKey)) return teamInjuryRosterCache.get(cacheKey);
  const promise = (async () => {
    const fortyManUrl = new URL(`${MLB_API_BASE}/teams/${teamId}/roster`);
    fortyManUrl.searchParams.set('rosterType', '40Man');
    fortyManUrl.searchParams.set('season', String(season));
    fortyManUrl.searchParams.set('hydrate', 'person');
    const fortyManRoster = await getJson(fortyManUrl.toString()).catch(() => null);
    const majorRosterIds = new Set(listify(fortyManRoster?.roster)
      .map((entry) => Number(entry?.person?.id))
      .filter((id) => Number.isFinite(id) && id > 0));
    const rosterTypes = ['40Man', '10DayInjuredList', '15DayInjuredList', '60DayInjuredList'];
    const results = await Promise.all(rosterTypes.map(async (rosterType) => {
      const url = new URL(`${MLB_API_BASE}/teams/${teamId}/roster`);
      url.searchParams.set('rosterType', rosterType);
      url.searchParams.set('season', String(season));
      url.searchParams.set('hydrate', 'person');
      const roster = await getJson(url.toString()).catch(() => null);
      return listify(roster?.roster)
        .filter((entry) => majorRosterIds.has(Number(entry?.person?.id)))
        .filter(isInjuredRosterEntry)
        .map((entry) => ({
          ...rosterEntryPlayer(entry),
          diagnosis: injuryDiagnosisText(entry),
          time: injuryTimeText(entry, rosterType),
        }));
    }));
    const byId = new Map();
    results.flat().forEach((player) => {
      if (Number.isFinite(player.id) && !byId.has(player.id)) byId.set(player.id, player);
    });
    return Array.from(byId.values()).sort((a, b) => a.fullName.localeCompare(b.fullName));
  })().catch((error) => {
    teamInjuryRosterCache.delete(cacheKey);
    throw error;
  });
  teamInjuryRosterCache.set(cacheKey, promise);
  return promise;
}

function parseProspectsFromMlbPage(html) {
  const names = [];
  const seen = new Set();
  const text = String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  const positionCodes = '(?:C|1B|2B|3B|SS|OF|RHP|LHP)';
  const detailPattern = new RegExp(`\\b([1-9]|[12]\\d|30)\\s+(?:Image\\s*)?([A-Z][A-Za-zÀ-ÿ' .-]+?)\\s+(${positionCodes})\\s+(?:Image\\s*)?[A-Z][A-Za-z .-]+?\\s+(?:MLB|AAA|AA|A\\+|A|ROK|R)?\\s*\\d{4}\\s+(\\d{2})\\s+\\d+'\\s*\\d+"\\s*\\/\\s*\\d+\\s*lbs\\s+([RLS])\\s+([RLS])`, 'g');
  let detailMatch;
  while ((detailMatch = detailPattern.exec(text)) && names.length < 3) {
    const name = detailMatch[2].trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    names.push({
      fullName: name,
      position: detailMatch[3],
      age: detailMatch[4],
      bats: detailMatch[5],
      throws: detailMatch[6],
      meta: `${detailMatch[3]} | Age ${detailMatch[4]} | B/T ${detailMatch[5]}/${detailMatch[6]}`,
    });
  }
  if (names.length >= 3) return names.slice(0, 3);

  const rowPattern = /\b([1-9]|[12]\d|30)\s*\|\s*(?:Image\s*)?([A-Z][A-Za-zÀ-ÿ' .-]+?)\s*\|\s*([A-Z0-9/]{1,7})\s*\|/g;
  let rowMatch;
  while ((rowMatch = rowPattern.exec(text)) && names.length < 3) {
    const name = rowMatch[2].trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    names.push({ fullName: name, position: rowMatch[3], meta: `${rowMatch[3]} | MLB Pipeline` });
  }
  if (names.length >= 3) return names.slice(0, 3);

  const patterns = [
    /"rank"\s*:\s*([1-9]|[12]\d|30)[\s\S]{0,900}?"(?:playerName|fullName)"\s*:\s*"([^"]+)"[\s\S]{0,400}?"(?:position|primaryPosition)"\s*:\s*"?([^",}{]+)"?/g,
    /"(?:playerName|fullName)"\s*:\s*"([^"]+)"[\s\S]{0,400}?"rank"\s*:\s*([1-9]|[12]\d|30)/g,
    /"name"\s*:\s*"([^"]+)"/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) && names.length < 3) {
      const rawName = match[2] && /^\d+$/.test(String(match[1])) ? match[2] : match[1];
      const position = match[3] && !/^\d+$/.test(String(match[3])) ? ` | ${match[3]}` : '';
      const name = rawName.replace(/\\u002F/g, '/').replace(/\\"/g, '"').trim();
      if (!name || seen.has(name) || /\b(MLB|Pipeline|Prospects|Baseball)\b/i.test(name)) continue;
      seen.add(name);
      names.push({ fullName: name, position: position ? position.slice(3) : '', meta: `${position ? position.slice(3) + ' | ' : ''}MLB Pipeline` });
    }
    if (names.length >= 3) break;
  }
  return names.slice(0, 3);
}

async function fetchTeamProspects(teamAbbrev) {
  const team = canonicalTeamAbbrev(teamAbbrev);
  const slug = TEAM_MLB_SLUGS[team];
  if (!slug) return [];
  const cacheKey = `${team}:prospects`;
  if (teamProspectsCache.has(cacheKey)) return teamProspectsCache.get(cacheKey);
  const promise = (async () => {
    const season = seasonForDate(dateInput.value || formatDate(new Date()));
    const html = await getText([
      `https://r.jina.ai/https://www.mlb.com/milb/prospects/${slug}`,
      `https://r.jina.ai/https://www.mlb.com/prospects/${season}/${slug}/`,
      `https://r.jina.ai/https://www.mlb.com/milb/prospects/${season}/${slug}`,
      `https://r.jina.ai/https://www.mlb.com/${slug}/prospects/stats/top-prospects`,
    ]);
    return parseProspectsFromMlbPage(html);
  })().catch((error) => {
    teamProspectsCache.delete(cacheKey);
    throw error;
  });
  teamProspectsCache.set(cacheKey, promise);
  return promise;
}

function rosterStatusEmpty(text) {
  return `<li class="roster-status-item"><span class="roster-status-rank">--</span><div class="roster-status-meta">${escapeHtml(text)}</div></li>`;
}

function rosterStatusItemHtml(player, chip = '', meta = '', index = null) {
  const rank = index == null ? '' : String(index + 1);
  return `
    <li class="roster-status-item" ${Number.isFinite(player?.id) ? `data-player-id="${player.id}"` : ''}>
      <span class="roster-status-rank">${escapeHtml(rank)}</span>
      <div class="roster-status-main">
        <span class="roster-status-name">${escapeHtml(player?.fullName || 'Unknown')}</span>
      </div>
      ${chip ? `<span class="roster-status-chip">${escapeHtml(chip)}</span>` : ''}
      ${meta ? `<div class="roster-status-meta">${escapeHtml(meta)}</div>` : ''}
    </li>
  `;
}

function renderRosterSide(panel, teamAbbrev, color, data = {}) {
  if (!panel) return;
  panel.style.setProperty('--team-color', color || getTeamColor(teamAbbrev));
  const teamCodeEl = panel.querySelector('.lineup-roster-team-code');
  if (teamCodeEl) teamCodeEl.textContent = displayTeamAbbrev(teamAbbrev);
  const sittingList = panel.querySelector('.sitting-list');
  const injuryList = panel.querySelector('.injury-list');
  const prospectList = panel.querySelector('.prospect-list');
  if (sittingList) {
    sittingList.innerHTML = data.loading
      ? rosterStatusEmpty('Loading active roster...')
      : (data.sitting?.length
        ? data.sitting.map((player, index) => rosterStatusItemHtml(player, player.position || '', 'Active roster, not in today lineup', index)).join('')
        : rosterStatusEmpty('No active non-pitcher bench players found.'));
  }
  if (injuryList) {
    injuryList.innerHTML = data.loading
      ? rosterStatusEmpty('Loading injured list...')
      : (data.injured?.length
        ? data.injured.map((player, index) => rosterStatusItemHtml(player, player.time || 'IL', player.diagnosis || 'Diagnosis unavailable', index)).join('')
        : rosterStatusEmpty('No injured-list players found from MLB roster data.'));
  }
  if (prospectList) {
    prospectList.innerHTML = data.loading
      ? rosterStatusEmpty('Loading prospects...')
      : (data.prospects?.length
        ? data.prospects.map((player, index) => rosterStatusItemHtml(player, `#${index + 1}`, player.meta || 'Prospect ranking', index)).join('')
        : rosterStatusEmpty('Top prospect rankings unavailable from the current data source.'));
  }
}

async function hydrateRosterSide(panel, game, side, lineup) {
  if (!panel) return;
  const teamAbbrev = side === 'away' ? game.away : game.home;
  const color = side === 'away' ? game.awayColor : game.homeColor;
  const rosterKey = `${String(game?.gamePk || '')}:${side}:${officialDateForGame(game)}:${(lineup || []).map((entry) => entry?.id || entry?.fullName || '').join(',')}`;
  if (panel.dataset.rosterKey === rosterKey && (panel.dataset.rosterState === 'loading' || panel.dataset.rosterState === 'loaded')) {
    return;
  }
  panel.dataset.rosterKey = rosterKey;
  panel.dataset.rosterState = 'loading';
  renderRosterSide(panel, teamAbbrev, color, { loading: true });
  const lineupIds = new Set((lineup || []).map((entry) => Number(entry?.id)).filter((id) => Number.isFinite(id)));
  const [activeRoster, injured, prospects] = await Promise.all([
    fetchTeamActiveRoster(teamAbbrev, game).catch(() => []),
    fetchTeamInjuredPlayers(teamAbbrev, game).catch(() => []),
    fetchTeamProspects(teamAbbrev).catch(() => []),
  ]);
  const sitting = activeRoster
    .filter((player) => String(player.position || '').toUpperCase() !== 'P')
    .filter((player) => !lineupIds.has(Number(player.id)))
    .sort((a, b) => String(a.position || '').localeCompare(String(b.position || '')) || a.fullName.localeCompare(b.fullName));
  if (panel.dataset.rosterKey !== rosterKey) return;
  renderRosterSide(panel, teamAbbrev, color, { sitting, injured, prospects });
  panel.dataset.rosterState = 'loaded';
}

function lineupListHasRows(listEl) {
  return Boolean(listEl?.querySelector?.('li[data-player-id]'));
}

function setLineupListRefreshing(listEl, refreshing = false) {
  if (!listEl) return;
  listEl.classList.toggle('is-refreshing', Boolean(refreshing));
  listEl.setAttribute('aria-busy', refreshing ? 'true' : 'false');
  let bar = listEl.querySelector(':scope > .lineup-refresh-bar');
  if (refreshing) {
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'lineup-refresh-bar';
      bar.setAttribute('aria-hidden', 'true');
      bar.innerHTML = '<span></span>';
      listEl.appendChild(bar);
    }
  } else if (bar) {
    bar.remove();
  }
}

function preserveLineupTextDuringRefresh(listEl, teamCode = '', renderFallback) {
  const sameTeam = !teamCode || String(listEl?.dataset?.teamCode || '') === String(teamCode || '');
  if (sameTeam && lineupListHasRows(listEl)) {
    setLineupListRefreshing(listEl, true);
    return;
  }
  renderFallback?.();
}

async function syncLineupOverlay(game, options = {}) {
  const open = Boolean(game && (options.forceOpen || isLineupOpen(game.gamePk)));
  lineupOverlayEl.hidden = !open;
  lineupOverlayEl.classList.toggle('open', Boolean(open));
  if (!open) {
    activeLineupGame = null;
    closePlayerStatOverlay();
    return;
  }
  activeLineupGame = game;
  syncLineupStatWindowToggle();

  lineupModalMatchupEl.textContent = lineupModalMatchupText(game);
  renderLineupScoreboard(game);
  const stateAwayCode = lineupOverlayEl.querySelector('.lineup-state-away-code');
  const stateHomeCode = lineupOverlayEl.querySelector('.lineup-state-home-code');
  if (stateAwayCode) stateAwayCode.style.color = game.awayColor;
  if (stateHomeCode) stateHomeCode.style.color = game.homeColor;

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
  renderLineupStatusBadges(awayLineupStreakEl, game.awayStreak, formatLineupTeamStatus(game.awayLastSevenRecord || '', game.awaySeasonStats));
  renderLineupStatusBadges(homeLineupStreakEl, game.homeStreak, formatLineupTeamStatus(game.homeLastSevenRecord || '', game.homeSeasonStats));
  const lineupTeamStatusPromise = Promise.all([
    getLineupTeamRecentStats(game.away, officialDateForGame(game), lineupStatGameWindow).catch(() => null),
    getLineupTeamRecentStats(game.home, officialDateForGame(game), lineupStatGameWindow).catch(() => null),
  ]);
  const awayTeamPanel = lineupOverlayEl.querySelector('.away-lineup');
  const homeTeamPanel = lineupOverlayEl.querySelector('.home-lineup');
  const awayPitchingPanel = lineupOverlayEl.querySelector('.away-pitching');
  const homePitchingPanel = lineupOverlayEl.querySelector('.home-pitching');
  const awayRosterPanel = lineupOverlayEl.querySelector('.away-roster');
  const homeRosterPanel = lineupOverlayEl.querySelector('.home-roster');
  if (awayTeamPanel) awayTeamPanel.style.setProperty('--team-logo-bg', `url("${game.awayLogo}")`);
  if (homeTeamPanel) homeTeamPanel.style.setProperty('--team-logo-bg', `url("${game.homeLogo}")`);
  if (awayPitchingPanel) awayPitchingPanel.style.setProperty('--team-logo-bg', `url("${game.awayLogo}")`);
  if (homePitchingPanel) homePitchingPanel.style.setProperty('--team-logo-bg', `url("${game.homeLogo}")`);
  if (awayRosterPanel) awayRosterPanel.style.setProperty('--team-logo-bg', `url("${game.awayLogo}")`);
  if (homeRosterPanel) homeRosterPanel.style.setProperty('--team-logo-bg', `url("${game.homeLogo}")`);

  const freshPitchers = await resolveFreshLineupPitchers(game);
  if (shouldPreferProbablePitcher(game)) {
    game.pitching = game.pitching || emptyPitchingData();
    await ensurePreviewBullpen(game);
  }
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
  renderLineupPitcherSummary(awayPitcherSummaryEl, game.awayColor, awayPitcherSummary);
  renderLineupPitcherSummary(homePitcherSummaryEl, game.homeColor, homePitcherSummary);
  await ensurePitcherProfiles(game, [
    awayPitcherSummary?.starter,
    awayPitcherSummary?.current,
    ...(awayPitchingDisplay?.bullpen || []),
    homePitcherSummary?.starter,
    homePitcherSummary?.current,
    ...(homePitchingDisplay?.bullpen || []),
  ]);
  awayPitcherSummary = resolveLineupPitcherForDisplay(game, 'away');
  homePitcherSummary = resolveLineupPitcherForDisplay(game, 'home');
  awayPitchingDisplay = resolvePitchingSideForDisplay(game, 'away');
  homePitchingDisplay = resolvePitchingSideForDisplay(game, 'home');
  renderLineupPitcherSummary(awayPitcherSummaryEl, game.awayColor, awayPitcherSummary);
  renderLineupPitcherSummary(homePitcherSummaryEl, game.homeColor, homePitcherSummary);
  syncLineupGamePickState(game);
  const awayLineupListEl = lineupOverlayEl.querySelector('.away-lineup-list');
  const homeLineupListEl = lineupOverlayEl.querySelector('.home-lineup-list');
  const awayHasConfirmedLineup = hasTrustedLineupOrder(game, 'away');
  const homeHasConfirmedLineup = hasTrustedLineupOrder(game, 'home');
  let awayDisplayLineup = awayHasConfirmedLineup ? fallbackTeamLineupFromLookup(game, 'away') : [];
  let homeDisplayLineup = homeHasConfirmedLineup ? fallbackTeamLineupFromLookup(game, 'home') : [];
  preserveLineupTextDuringRefresh(
    awayLineupListEl,
    game.away,
    () => renderLineupList(awayLineupListEl, awayDisplayLineup, game.awayColor, game.away, new Set(), new Set(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()),
  );
  preserveLineupTextDuringRefresh(
    homeLineupListEl,
    game.home,
    () => renderLineupList(homeLineupListEl, homeDisplayLineup, game.homeColor, game.home, new Set(), new Set(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()),
  );
  const [remoteAwayLineup, remoteHomeLineup] = await Promise.all([
    awayHasConfirmedLineup ? Promise.resolve(awayDisplayLineup) : fetchMlbStartingLineupFallback(game, 'away').catch(() => []),
    homeHasConfirmedLineup ? Promise.resolve(homeDisplayLineup) : fetchMlbStartingLineupFallback(game, 'home').catch(() => []),
  ]);
  if (!awayHasConfirmedLineup) {
    awayDisplayLineup = normalizeLineupCollectionForSide(game, 'away', remoteAwayLineup) || [];
  }
  if (!homeHasConfirmedLineup) {
    homeDisplayLineup = normalizeLineupCollectionForSide(game, 'home', remoteHomeLineup) || [];
  }
  if (!awayDisplayLineup.length) {
    awayDisplayLineup = fallbackTeamLineupFromLookup(game, 'away');
  }
  if (!homeDisplayLineup.length) {
    homeDisplayLineup = fallbackTeamLineupFromLookup(game, 'home');
  }
  [awayDisplayLineup, homeDisplayLineup] = await Promise.all([
    !awayHasConfirmedLineup ? enrichFallbackLineupDisplay(game, 'away', awayDisplayLineup) : Promise.resolve(awayDisplayLineup),
    !homeHasConfirmedLineup ? enrichFallbackLineupDisplay(game, 'home', homeDisplayLineup) : Promise.resolve(homeDisplayLineup),
  ]);
  if (!awayHasConfirmedLineup && awayDisplayLineup.length) {
    game.previewLineupFallback = { ...(game.previewLineupFallback || {}), away: awayDisplayLineup };
  }
  if (!homeHasConfirmedLineup && homeDisplayLineup.length) {
    game.previewLineupFallback = { ...(game.previewLineupFallback || {}), home: homeDisplayLineup };
  }
  const recentBattingStatsPromise = getLineupRecentBattingStatsMap(game, [awayDisplayLineup, homeDisplayLineup], lineupStatGameWindow).catch(() => new Map());
  renderLineupList(awayLineupListEl, awayDisplayLineup, game.awayColor, game.away, new Set(), new Set(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map());
  renderLineupList(homeLineupListEl, homeDisplayLineup, game.homeColor, game.home, new Set(), new Set(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map());
  renderPitchingSide(lineupOverlayEl.querySelector('.away-pitching'), game.away, game.awayColor, awayPitchingDisplay, game);
  renderPitchingSide(lineupOverlayEl.querySelector('.home-pitching'), game.home, game.homeColor, homePitchingDisplay, game);
  Promise.all([
    hydrateRosterSide(awayRosterPanel, game, 'away', awayDisplayLineup),
    hydrateRosterSide(homeRosterPanel, game, 'home', homeDisplayLineup),
  ]).catch(() => {});
  hydratePitcherFireStreaks(lineupOverlayEl);
  hydratePitcherColdStreaks(lineupOverlayEl);
  hydratePitcherLastStartHrMarkers(lineupOverlayEl);
  hydratePitcherOpponentHandMarkers(lineupOverlayEl);

  const hotToken = `${String(game.gamePk || '')}:${Date.now()}`;
  lineupOverlayEl.dataset.hotToken = hotToken;
  try {
    const hotPlayerIds = await getRecognizedLineupHotPlayerIds(game, dateInput.value || formatDate(new Date())).catch(() => new Set());
    const [lineupTeamStatus, coldPlayerIds, hitStreakMap, batterBadgeMap, recentBattingStatsMap] = await Promise.all([
      lineupTeamStatusPromise.catch(() => [null, null]),
      getRecognizedLineupColdPlayerIds(game, dateInput.value || formatDate(new Date()), hotPlayerIds).catch(() => new Set()),
      getRecognizedLineupHitStreakMap(game, dateInput.value || formatDate(new Date())).catch(() => new Map()),
      getRecognizedLineupBatterBadgeMap(game, dateInput.value || formatDate(new Date())).catch(() => new Map()),
      recentBattingStatsPromise,
    ]);
    const [awayRecentStats, homeRecentStats] = lineupTeamStatus || [];
    game.awayLastSevenRecord = awayRecentStats?.recordText || '';
    game.homeLastSevenRecord = homeRecentStats?.recordText || '';
    game.awaySeasonStats = awayRecentStats || null;
    game.homeSeasonStats = homeRecentStats || null;
    if (lineupOverlayEl.dataset.hotToken !== hotToken) return;
    if (!isLineupOpen(game.gamePk) || String(activeLineupGame?.gamePk || '') !== String(game.gamePk || '')) return;
    renderLineupStatusBadges(awayLineupStreakEl, game.awayStreak, formatLineupTeamStatus(game.awayLastSevenRecord, game.awaySeasonStats));
    renderLineupStatusBadges(homeLineupStreakEl, game.homeStreak, formatLineupTeamStatus(game.homeLastSevenRecord, game.homeSeasonStats));
    const [awaySplitFlagMap, homeSplitFlagMap] = await Promise.all([
      handedSplitFlagMapForLineup(game, 'away', awayDisplayLineup).catch(() => new Map()),
      handedSplitFlagMapForLineup(game, 'home', homeDisplayLineup).catch(() => new Map()),
    ]);
    const [awayEliteMatchupMap, homeEliteMatchupMap, awayDueBadgeMap, homeDueBadgeMap] = await Promise.all([
      eliteMatchupMapForLineup(game, 'away', awayDisplayLineup, batterBadgeMap).catch(() => new Map()),
      eliteMatchupMapForLineup(game, 'home', homeDisplayLineup, batterBadgeMap).catch(() => new Map()),
      getLineupHomeRunDueBadgeMap(game, [awayDisplayLineup]).catch(() => new Map()),
      getLineupHomeRunDueBadgeMap(game, [homeDisplayLineup]).catch(() => new Map()),
    ]);
    renderLineupList(awayLineupListEl, awayDisplayLineup, game.awayColor, game.away, hotPlayerIds, coldPlayerIds, hitStreakMap, batterBadgeMap, recentBattingStatsMap, awaySplitFlagMap, awayEliteMatchupMap, awayDueBadgeMap);
    renderLineupList(homeLineupListEl, homeDisplayLineup, game.homeColor, game.home, hotPlayerIds, coldPlayerIds, hitStreakMap, batterBadgeMap, recentBattingStatsMap, homeSplitFlagMap, homeEliteMatchupMap, homeDueBadgeMap);
  } catch {
    setLineupListRefreshing(awayLineupListEl, false);
    setLineupListRefreshing(homeLineupListEl, false);
  }
  if (!lineupGameShouldAutoRefresh(game)) nonLiveLineupRenderSignature = lineupRefreshSignature(game);
}

async function renderActiveLineupOverlay(games = []) {
  const openPk = getOpenLineupGamePk();
  if (!openPk) {
    lineupOverlayEl.hidden = true;
    lineupOverlayEl.classList.remove('open');
    activeLineupGame = null;
    closePlayerStatOverlay();
    return;
  }

  const game = games.find((g) => String(g.gamePk) === String(openPk)) || getCachedGames().find((g) => String(g.gamePk) === String(openPk));
  if (!game) {
    if (activeLineupGame) {
      lineupOverlayEl.hidden = false;
      lineupOverlayEl.classList.add('open');
      if (lineupStatusEl) lineupStatusEl.textContent = 'Refreshing live data...';
    }
    return;
  }

  const signature = lineupRefreshSignature(game);
  if (!lineupGameShouldAutoRefresh(game) && nonLiveLineupRenderSignature === signature) return;
  await syncLineupOverlay(game);
  if (!lineupGameShouldAutoRefresh(game)) nonLiveLineupRenderSignature = signature;
}

function lineupGameShouldAutoRefresh(game) {
  const state = String(game?.status?.abstractGameState || '').toLowerCase();
  const text = `${game?.status || ''} ${game?.inning || ''} ${game?.inningShort || ''}`.toLowerCase();
  return state === 'live' || state === 'in progress' || /\b(live|top|bot|bottom|middle|end)\b/.test(text);
}

function lineupRefreshSignature(game) {
  return [
    String(game?.gamePk || ''),
    officialDateForGame(game),
    lineupStatGameWindow,
  ].join(':');
}

function initLineupOverlay() {
  lineupBackdropEl.addEventListener('click', closeLineupOverlay);
  lineupCloseBtnEl.addEventListener('click', closeLineupOverlay);
  if (playerStatBackdropEl) playerStatBackdropEl.addEventListener('click', closePlayerStatOverlay);
  if (playerStatCloseBtnEl) playerStatCloseBtnEl.addEventListener('click', closePlayerStatOverlay);
  playerStatOverlayEl?.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-player-stat-nav]');
    if (!navBtn) return;
    e.preventDefault();
    e.stopPropagation();
    navigatePlayerStatCard(Number(navBtn.dataset.playerStatNav) || 1);
  });
  playerStatOverlayEl?.addEventListener('touchstart', (e) => {
    if (playerStatOverlayEl.hidden || e.touches.length !== 1) return;
    const touch = e.touches[0];
    playerStatTouchStart = { x: touch.clientX, y: touch.clientY, at: Date.now() };
  }, { passive: true });
  playerStatOverlayEl?.addEventListener('touchend', (e) => {
    if (!playerStatTouchStart || playerStatOverlayEl.hidden) {
      playerStatTouchStart = null;
      return;
    }
    const touch = e.changedTouches?.[0];
    if (!touch) {
      playerStatTouchStart = null;
      return;
    }
    const dx = touch.clientX - playerStatTouchStart.x;
    const dy = touch.clientY - playerStatTouchStart.y;
    const elapsed = Date.now() - playerStatTouchStart.at;
    playerStatTouchStart = null;
    if (elapsed > 900 || Math.abs(dx) < 52 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
    e.preventDefault();
    navigatePlayerStatCard(dx < 0 ? 1 : -1);
  }, { passive: false });
  let lineupTouchStart = null;
  lineupOverlayEl.addEventListener('click', (e) => {
    const statWindowToggle = e.target.closest('[data-lineup-stat-window]');
    if (statWindowToggle) {
      e.preventDefault();
      e.stopPropagation();
      lineupStatGameWindow = nextLineupStatWindow(lineupStatGameWindow);
      saveLineupStatWindow(lineupStatGameWindow);
      nonLiveLineupRenderSignature = '';
      syncLineupStatWindowToggle();
      if (activeLineupGame) {
        syncLineupOverlay(activeLineupGame, { forceOpen: true }).catch(() => {
          if (lineupStatusEl) lineupStatusEl.textContent = 'Lineup stats are still loading...';
        });
      }
      return;
    }
    const navBtn = e.target.closest('[data-lineup-nav]');
    if (navBtn) {
      e.preventDefault();
      e.stopPropagation();
      navigateOpenLineupGame(Number(navBtn.dataset.lineupNav) || 1);
      return;
    }
    const pickLogo = e.target.closest('.lineup-logo-pick-trigger[data-lineup-pick-side]');
    if (pickLogo) {
      e.preventDefault();
      e.stopPropagation();
      if (activeLineupGame) setPendingGamePick(activeLineupGame, pickLogo.dataset.lineupPickSide);
      return;
    }
    const playByPlayTrigger = e.target.closest('[data-play-by-play-trigger]');
    if (playByPlayTrigger) {
      e.preventDefault();
      e.stopPropagation();
      openFullPlayByPlayDialog(activeLineupGame);
      return;
    }
    const pregameToggle = e.target.closest('.lineup-state-inning.is-pregame-toggle');
    if (pregameToggle && activeLineupGame && shouldPreferProbablePitcher(activeLineupGame)) {
      e.preventDefault();
      e.stopPropagation();
      toggleTossupScoreboardMarked(activeLineupGame.gamePk);
      return;
    }
    const row = e.target.closest('.lineup-sub-player[data-player-id], .lineup-list li[data-player-id], .lineup-team-pitcher[data-player-id], .current-pitcher-card[data-player-id], .bullpen-item[data-player-id], .pitching-history-list li[data-player-id], .roster-status-item[data-player-id]');
    if (!row) return;
    const playerId = Number(row.dataset.playerId);
    if (!Number.isFinite(playerId) || playerId <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    openPlayerStatOverlay(playerId, activeLineupGame);
  });
  hrListEl.addEventListener('click', (e) => {
    const rating = e.target.closest('.hr-rating');
    if (rating) {
      const ratingItem = rating.closest('.hr-item[data-hr-key]');
      if (!ratingItem) return;
      e.preventDefault();
      e.stopPropagation();
      openHomeRunRatingDialogFromItem(ratingItem);
      return;
    }
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
  hrSortToggleBtnEl?.addEventListener('click', () => {
    homeRunFeedSortMode = homeRunFeedSortMode === 'rating' ? 'latest' : 'rating';
    refreshHomeRunFeedAfterControlChange();
  });
  hrGradeToggleBtnEl?.addEventListener('click', () => {
    homeRunRatingDisplayMode = homeRunRatingDisplayMode === 'letter' ? 'number' : 'letter';
    refreshHomeRunFeedAfterControlChange();
  });
  lineupOverlayEl.addEventListener('touchstart', (e) => {
    if (lineupOverlayEl.hidden || e.touches.length !== 1) return;
    const touch = e.touches[0];
    lineupTouchStart = { x: touch.clientX, y: touch.clientY, at: Date.now() };
  }, { passive: true });
  lineupOverlayEl.addEventListener('touchend', (e) => {
    if (!lineupTouchStart || lineupOverlayEl.hidden || (playerStatOverlayEl && !playerStatOverlayEl.hidden)) {
      lineupTouchStart = null;
      return;
    }
    const touch = e.changedTouches?.[0];
    if (!touch) {
      lineupTouchStart = null;
      return;
    }
    const dx = touch.clientX - lineupTouchStart.x;
    const dy = touch.clientY - lineupTouchStart.y;
    const elapsed = Date.now() - lineupTouchStart.at;
    lineupTouchStart = null;
    if (elapsed > 900 || Math.abs(dx) < 52 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
    e.preventDefault();
    navigateOpenLineupGame(dx < 0 ? 1 : -1);
  }, { passive: false });
  lineupOverlayEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const navBtn = e.target.closest('[data-lineup-nav]');
    if (navBtn) {
      e.preventDefault();
      e.stopPropagation();
      navigateOpenLineupGame(Number(navBtn.dataset.lineupNav) || 1);
      return;
    }
    const pregameToggle = e.target.closest('.lineup-state-inning.is-pregame-toggle');
    if (pregameToggle && activeLineupGame && shouldPreferProbablePitcher(activeLineupGame)) {
      e.preventDefault();
      e.stopPropagation();
      toggleTossupScoreboardMarked(activeLineupGame.gamePk);
      return;
    }
    const pickLogo = e.target.closest('.lineup-logo-pick-trigger[data-lineup-pick-side]');
    if (pickLogo) {
      e.preventDefault();
      e.stopPropagation();
      if (activeLineupGame) setPendingGamePick(activeLineupGame, pickLogo.dataset.lineupPickSide);
      return;
    }
    const row = e.target.closest('.lineup-sub-player[data-player-id], .lineup-list li[data-player-id], .lineup-team-pitcher[data-player-id], .current-pitcher-card[data-player-id], .bullpen-item[data-player-id], .pitching-history-list li[data-player-id], .roster-status-item[data-player-id]');
    if (!row) return;
    const playerId = Number(row.dataset.playerId);
    if (!Number.isFinite(playerId) || playerId <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    openPlayerStatOverlay(playerId, activeLineupGame);
  });
  for (const btn of lineupViewBtns) {
    btn.addEventListener('click', () => setLineupView(btn.dataset.lineupView));
  }
  lineupStatGameWindow = savedLineupStatWindow();
  syncLineupStatWindowToggle();
  playerStatRecentGameWindow = savedPlayerStatRecentWindow();
  syncPlayerStatRecentToggle();
  playerStatMatchupEl?.addEventListener('click', (e) => {
    const toggle = e.target.closest('.player-recent-window-toggle');
    if (!toggle) return;
    e.preventDefault();
    e.stopPropagation();
    playerStatRecentGameWindow = playerStatRecentGameWindow === 10 ? 5 : 10;
    savePlayerStatRecentWindow(playerStatRecentGameWindow);
    syncPlayerStatRecentToggle();
    const playerId = Number(playerStatOverlayEl?.dataset?.playerId);
    if (Number.isFinite(playerId) && playerId > 0 && activePlayerStatContext?.game) {
      const navContext = activePlayerStatContext.kind === 'leader' ? { ...activePlayerStatContext, playerId } : null;
      openPlayerStatOverlay(playerId, activePlayerStatContext.game, navContext ? { navContext } : {});
    }
  });
  setLineupView(savedLineupView(), { persist: false });
  lineupOverlayEl.hidden = true;
  lineupOverlayEl.classList.remove('open');
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) return;
    if (playerStatOverlayEl && !playerStatOverlayEl.hidden) {
      if (e.key === 'Escape') {
        closePlayerStatOverlay();
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigatePlayerStatCard(e.key === 'ArrowRight' ? 1 : -1);
        return;
      }
    }
    if (e.key === 'Escape' && !lineupOverlayEl.hidden) closeLineupOverlay();
  });
}

function renderLineupList(listEl, lineup, color, teamCode = '', hotPlayerIds = new Set(), coldPlayerIds = new Set(), hitStreakMap = new Map(), batterBadgeMap = new Map(), recentStatsMap = new Map(), handedSplitFlagMap = new Map(), eliteMatchupMap = new Map(), dueBadgeMap = new Map()) {
  if (!listEl) return;
  listEl.dataset.teamCode = String(teamCode || '');
  const fingerprint = JSON.stringify((lineup || []).map((entry) => {
    const id = String(entry?.id || '');
    const recent = recentStatsMap?.get?.(id) || null;
    const badges = batterBadgeMap?.get?.(id) || null;
    return [
      id,
      entry?.slot,
      entry?.name,
      entry?.position,
      entry?.avg,
      entry?.today,
      entry?.isActive ? 1 : 0,
      entry?.isNextUp ? 1 : 0,
      hotPlayerIds?.has?.(id) ? 1 : 0,
      coldPlayerIds?.has?.(id) ? 1 : 0,
      hitStreakMap?.get?.(id) || 0,
      badges?.avgBurst ? 1 : 0,
      badges?.powerBurst ? 1 : 0,
      badges?.slugBurst ? 1 : 0,
      handedSplitFlagMap?.get?.(id) || '',
      eliteMatchupMap?.get?.(id) || '',
      dueBadgeMap?.get?.(id)?.hr || '',
      dueBadgeMap?.get?.(id)?.xbh || '',
      recent ? `${recent.atBats}:${recent.hits}:${recent.avg}:${recent.extraBaseHits}:${recent.homeRuns}:${recent.walks}:${recent.strikeOuts}` : '',
      entry?.substitutionStarter ? `${entry.substitutionStarter.id}:${entry.substitutionStarter.fullName}:${entry.substitutionStarter.today}` : '',
    ];
  }));
  if (listEl.dataset.renderFingerprint === fingerprint) {
    setLineupListRefreshing(listEl, false);
    return;
  }
  setLineupListRefreshing(listEl, false);
  listEl.dataset.renderFingerprint = fingerprint;
  listEl.replaceChildren();
  if (!lineup?.length) {
    const empty = document.createElement('div');
    empty.className = 'lineup-empty';
    empty.textContent = 'Previous lineup unavailable';
    listEl.appendChild(empty);
    return;
  }

  const activeIndex = lineup.findIndex((entry) => entry.isActive);
  const onDeckIndex = activeIndex >= 0 && lineup.length ? (activeIndex + 1) % lineup.length : -1;

  for (let i = 0; i < lineup.length; i += 1) {
    const entry = lineup[i];
    const isAtBat = i === activeIndex;
    const isOnDeck = i === onDeckIndex;
    const isNextUp = !isAtBat && Boolean(entry?.isNextUp);
    const recentOps = Number.parseFloat(String(recentStatsMap?.get?.(String(entry?.id))?.ops || '').replace(/^\./, '0.'));
    const isHot = Boolean(hotPlayerIds?.has?.(String(entry?.id)) || (Number.isFinite(recentOps) && recentOps >= LINEUP_HOT_OPS_THRESHOLD));
    const isCold = !isHot && Boolean(coldPlayerIds?.has?.(String(entry?.id)) || (Number.isFinite(recentOps) && recentOps <= LINEUP_COLD_OPS_THRESHOLD));
    const eliteMatchupTitle = eliteMatchupMap?.get?.(String(entry?.id)) || '';
    const dueBadge = dueBadgeMap?.get?.(String(entry?.id)) || null;
    const hitStreak = Math.max(0, Number(hitStreakMap?.get?.(String(entry?.id)) || 0));
    const batterBadges = batterBadgeMap?.get?.(String(entry?.id)) || null;
    const indicatorClass = isAtBat ? 'is-atbat' : isOnDeck ? 'is-ondeck' : '';
    const rowClasses = [];
    if (isAtBat) rowClasses.push('lineup-row-atbat');
    if (isOnDeck) rowClasses.push('lineup-row-ondeck');
    if (isNextUp) rowClasses.push('lineup-row-nextup');
    if (isHot) rowClasses.push('lineup-row-hot');
    if (isCold) rowClasses.push('lineup-row-cold');
    if (eliteMatchupTitle) rowClasses.push('lineup-row-elite-matchup');
    const indicatorSrc = isAtBat ? 'atbat.png' : isOnDeck ? 'ondeck.png' : '';
    const indicatorAlt = isAtBat ? 'At bat' : isOnDeck ? 'On deck' : '';
    const indicatorHtml = indicatorSrc
      ? `<img class="lineup-indicator ${indicatorClass}" src="${indicatorSrc}" alt="${indicatorAlt}" />`
      : '';
    const nextUpHtml = isNextUp ? '<span class="lineup-nextup-badge" title="Next up when this team bats" aria-label="Next up">NEXT</span>' : '';
    const hotEmojiHtml = isHot ? '<span class="lineup-hot-emoji" aria-hidden="true">🔥</span>' : '';
    const coldEmojiHtml = isCold ? '<span class="lineup-cold-emoji" aria-hidden="true">❄️</span>' : '';
    const avgBurstHtml = batterBadges?.avgBurst ? '<span class="lineup-avg-burst" title="Batting .350+ over the last five games" aria-label="Batting .350 plus over the last five games">🧨</span>' : '';
    const powerBurstHtml = batterBadges?.powerBurst ? '<span class="lineup-power-burst" title="Multiple home runs over the last five games" aria-label="Multiple home runs over the last five games">💥</span>' : '';
    const slugBurstHtml = batterBadges?.slugBurst ? slugBurstMarkerHtml({ slg: batterBadges.slugBurstValue }) : '';
    const handedSplitHtml = handedSplitFlagMap?.get?.(String(entry?.id)) || '';
    const eliteMatchupHtml = eliteMatchupTitle
      ? `<span class="lineup-elite-matchup-badge" title="${escapeHtml(eliteMatchupTitle)}" aria-label="Elite matchup">★</span>`
      : '';
    const dueBadgeHtml = [
      dueBadge?.hr ? `<span class="lineup-due-badge lineup-due-badge-hr" title="${escapeHtml(dueBadge.hr)}" aria-label="Home run due">HR</span>` : '',
      dueBadge?.xbh ? `<span class="lineup-due-badge lineup-due-badge-xbh" title="${escapeHtml(dueBadge.xbh)}" aria-label="Extra-base hit due">XBH</span>` : '',
    ].join('');
    const hitStreakHtml = hitStreak >= 3
      ? `<span class="lineup-hit-streak" title="${hitStreak}-game hit streak" aria-label="${hitStreak}-game hit streak">${hitStreak}G</span>`
      : '';
    const batterHandHtml = handednessHtml(entry?.bats);
    const emojiHtml = `${indicatorHtml}${nextUpHtml}${hotEmojiHtml}${coldEmojiHtml}${avgBurstHtml}${powerBurstHtml}${slugBurstHtml}${handedSplitHtml}${eliteMatchupHtml}${dueBadgeHtml}${hitStreakHtml}`;
    const displayLastName = lineupBatterLastName(entry);
    const starter = entry?.substitutionStarter || null;
    const starterToday = normalizeLineupTodayValue(starter?.today);
    const subToday = normalizeLineupTodayValue(entry.today);
    const nameBlockHtml = starter ? `
        <span class="lineup-sub-split">
          <span class="lineup-sub-player" data-player-id="${Number.isFinite(Number(starter.id)) ? String(starter.id) : ''}" role="button" tabindex="0" title="${escapeHtml(starter.fullName || starter.name || 'Starter')}">
            <span class="lineup-name-text">${escapeHtml(lineupBatterLastName(starter))}</span>${handednessHtml(starter?.bats)}
            <span class="lineup-sub-today">${escapeHtml(starterToday)}</span>
          </span>
          <span class="lineup-sub-player" data-player-id="${Number.isFinite(Number(entry.id)) ? String(entry.id) : ''}" role="button" tabindex="0" title="${escapeHtml(entry.fullName || entry.name || 'Substitution')}">
            <span class="lineup-name-text">${escapeHtml(displayLastName)}</span>${batterHandHtml}
            <span class="lineup-sub-today">${escapeHtml(subToday)}</span>
          </span>
        </span>
      ` : `
        <span class="lineup-name-text">${escapeHtml(displayLastName)}</span>${batterHandHtml}
        ${emojiHtml}
        ${lineupDashboardStatsHtml(entry, recentStatsMap)}
      `;

    const li = document.createElement('li');
    li.className = rowClasses.join(' ');
    if (starter) li.classList.add('lineup-row-substitution');
    li.dataset.playerId = Number.isFinite(Number(entry.id)) && Number(entry.id) > 0 ? String(entry.id) : '';
    li.dataset.team = teamCode;
    li.dataset.hot = isHot ? '1' : '0';
    li.innerHTML = `
      <span class="lineup-slot">${entry.slot}</span>
      <span class="lineup-name" title="${escapeHtml(entry.fullName)}">
        ${nameBlockHtml}
      </span>
      <span class="lineup-pos">${escapeHtml(entry.position || '')}</span>
      <span class="lineup-avg">AVG ${escapeHtml(entry.avg || '---')}</span>
      <span class="lineup-today">${starter ? '' : escapeHtml(subToday)}</span>
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

let lineupShortcutHandledAt = 0;
let lineupShortcutHandledGamePk = '';
let hoveredScoreboardGamePk = '';

function cardForGamePk(gamePk) {
  const normalized = String(gamePk || '');
  return normalized ? gamesEl?.querySelector?.(`.game-card[data-game-pk='${normalized}']`) || null : null;
}

function lineupNavigationGames() {
  const byPk = new Map([
    ...latestRenderedGames,
    ...getCachedGames(),
  ].map((game) => [String(game?.gamePk || ''), game]).filter(([gamePk]) => gamePk));
  const visibleCards = Array.from(gamesEl?.querySelectorAll?.('.game-card[data-game-pk]') || []);
  const fromCards = visibleCards
    .map((card) => card._game || byPk.get(String(card.dataset.gamePk || '')))
    .filter((game) => game?.gamePk);
  const fallback = latestRenderedGames.length ? latestRenderedGames : getCachedGames();
  const seen = new Set();
  return (fromCards.length ? fromCards : fallback).filter((game) => {
    const gamePk = String(game?.gamePk || '');
    if (!gamePk || seen.has(gamePk)) return false;
    seen.add(gamePk);
    return true;
  });
}

function navigateOpenLineupGame(direction) {
  if (!lineupOverlayEl || lineupOverlayEl.hidden) return false;
  if (playerStatOverlayEl && !playerStatOverlayEl.hidden) return false;
  const games = lineupNavigationGames();
  if (!games.length) return false;
  const currentPk = String(activeLineupGame?.gamePk || getOpenLineupGamePk() || '');
  const currentIndex = games.findIndex((game) => String(game?.gamePk || '') === currentPk);
  const startIndex = currentIndex >= 0 ? currentIndex : 0;
  const step = Number(direction) < 0 ? -1 : 1;
  const nextIndex = (startIndex + step + games.length) % games.length;
  const nextGame = games[nextIndex];
  if (!nextGame?.gamePk) return false;
  const card = cardForGamePk(nextGame.gamePk);
  if (card) return openLineupFromCard(card);
  setLineupOpen(nextGame.gamePk);
  activeLineupGame = nextGame;
  lineupOverlayEl.hidden = false;
  lineupOverlayEl.classList.add('open');
  syncLineupOverlay(nextGame, { forceOpen: true }).catch(() => {
    if (lineupStatusEl) lineupStatusEl.textContent = 'Lineup data is still loading...';
  });
  return true;
}

function rememberScoreboardCard(card) {
  const gamePk = String(card?.dataset?.gamePk || '');
  if (gamePk) hoveredScoreboardGamePk = gamePk;
}

function openLineupFromCard(card, e = null) {
  if (!card) return false;
  rememberScoreboardCard(card);
  const gamePk = String(card.dataset.gamePk || '');
  if (!gamePk) return false;
  const now = Date.now();
  if (gamePk === lineupShortcutHandledGamePk && now - lineupShortcutHandledAt < 350) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    return true;
  }
  lineupShortcutHandledAt = now;
  lineupShortcutHandledGamePk = gamePk;
  e?.preventDefault?.();
  e?.stopPropagation?.();

  const liveGame = card._game
    || latestRenderedGames.find((candidate) => String(candidate?.gamePk) === gamePk)
    || getCachedGames().find((candidate) => String(candidate?.gamePk) === gamePk);
  if (!liveGame) {
    setLineupOpen(gamePk);
    lineupOverlayEl.hidden = false;
    lineupOverlayEl.classList.add('open');
    if (lineupModalMatchupEl) lineupModalMatchupEl.textContent = 'Loading lineup card';
    if (lineupStatusEl) lineupStatusEl.textContent = 'Lineup data is still loading...';
    return true;
  }

  setLineupOpen(gamePk);
  lineupOverlayEl.hidden = false;
  lineupOverlayEl.classList.add('open');
  activeLineupGame = liveGame;
  syncLineupOverlay(liveGame, { forceOpen: true }).catch(() => {
    if (lineupStatusEl) lineupStatusEl.textContent = 'Lineup data is still loading...';
  });
  return true;
}

window.openLineupCardForGame = (gamePk) => {
  const card = cardForGamePk(gamePk) || gamesEl?.querySelector?.('.game-card[data-game-pk]');
  return openLineupFromCard(card);
};

function initScoreboardLineupShortcuts() {
  if (!gamesEl) return;
  const cardFromEvent = (e) => {
    const direct = e.target?.closest?.('.game-card[data-game-pk]');
    if (direct) return direct;
    if (Number.isFinite(e.clientX) && Number.isFinite(e.clientY)) {
      const pointed = document.elementFromPoint(e.clientX, e.clientY);
      return pointed?.closest?.('.game-card[data-game-pk]') || null;
    }
    return null;
  };
  const handle = (e) => {
    const isMiddle = e.button === 1 || e.buttons === 4;
    const isAltPrimary = e.altKey && (e.button === 0 || e.button === undefined);
    if (!isMiddle && !isAltPrimary) return;
    const card = cardFromEvent(e);
    if (!card) return;
    rememberScoreboardCard(card);
    openLineupFromCard(card, e);
  };
  gamesEl.addEventListener('pointerover', (e) => {
    const card = cardFromEvent(e);
    if (card) rememberScoreboardCard(card);
  }, true);
  gamesEl.addEventListener('mouseover', (e) => {
    const card = cardFromEvent(e);
    if (card) rememberScoreboardCard(card);
  }, true);
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (String(e.key || '').toLowerCase() !== 'l') return;
    const card = cardForGamePk(hoveredScoreboardGamePk) || cardFromEvent(e);
    if (isTextEntryTarget(e.target) && !card) return;
    if (card) openLineupFromCard(card, e);
  }, true);
  for (const target of [gamesEl, document]) {
    target.addEventListener('mousedown', handle, true);
    target.addEventListener('mouseup', handle, true);
    target.addEventListener('pointerdown', handle, true);
    target.addEventListener('pointerup', handle, true);
    target.addEventListener('auxclick', handle, true);
    target.addEventListener('click', handle, true);
  }
}

function bindCardInteractions(card, game) {
  if (card.dataset.bound === '1') return;
  card.dataset.bound = '1';
  let lineupClickHandledAt = 0;

  card.addEventListener('pointerenter', () => rememberScoreboardCard(card));
  card.addEventListener('mouseenter', () => rememberScoreboardCard(card));

  const togglePregameTossup = (e) => {
    const pregameToggle = e.target.closest('.score-mini-inning.is-pregame-toggle');
    if (!pregameToggle) return false;
    const liveGame = card._game || game;
    if (!shouldPreferProbablePitcher(liveGame)) return false;
    e.preventDefault();
    e.stopPropagation();
    toggleTossupScoreboardMarked(card.dataset.gamePk || liveGame?.gamePk || '');
    return true;
  };

  card.addEventListener('click', (e) => {
    togglePregameTossup(e);
  }, true);

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') togglePregameTossup(e);
  }, true);

  const toggleLineup = (e) => {
    lineupClickHandledAt = Date.now();
    openLineupFromCard(card, e);
  };

  card.addEventListener('mousedown', (e) => {
    if (e.button === 1) toggleLineup(e);
  });

  card.addEventListener('pointerup', (e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) toggleLineup(e);
  });

  card.addEventListener('mouseup', (e) => {
    if (Date.now() - lineupClickHandledAt < 250) return;
    if (e.button === 1 || (e.button === 0 && e.altKey)) toggleLineup(e);
  });

  card.addEventListener('click', (e) => {
    if (Date.now() - lineupClickHandledAt < 250) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.altKey) {
      toggleLineup(e);
      return;
    }
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
    if (Date.now() - lineupClickHandledAt < 250) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.button !== 1) return;
    toggleLineup(e);
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
  hydratePitcherLastStartHrMarkers(card);
  hydratePitcherOpponentHandMarkers(card);
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
    if (canAnimateScoreIncrease(game, prev, awayRuns, prev.awayRuns)) {
      animateScoreChange(card, game.awayColor, game.currentEvent === 'Home Run');
      flashHomePlate(card);
      animateNumericChange(card.querySelector('.away-score'), game.awayColor);
    } else if (canAnimateScoreIncrease(game, prev, homeRuns, prev.homeRuns)) {
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
    seenAt: Date.now(),
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
  const selectedDate = dateInput.value || formatDate(new Date());
  const dedupedCards = await hydrateTeamLastSevenRecords(dedupeGameCards(cards, selectedDate), selectedDate);
  latestRenderedGames = dedupedCards;
  restorePendingGamePicks();
  restoreTossupScoreboards(selectedDate);
  clearCompletedPendingGamePicks(dedupedCards);
  updateDashboardSummary(dedupedCards);
  gamesEl.querySelectorAll('.empty, .games-loading').forEach((el) => el.remove());
  for (const game of dedupedCards) upsertCard(game);
  removeStaleCards(dedupedCards);
  await renderActiveLineupOverlay(dedupedCards);
  renderBetList(dedupedCards);
  latestRenderedHomeRuns = Array.isArray(homeRuns) ? homeRuns.slice() : [];
  renderHomeRunFeed(homeRuns);
  await syncLeaderFilters(dedupedCards);
  if (currentOverlayPage === 'leaders') await refreshLeadersView({ showLoading: false });
  if (currentOverlayPage === 'hot') await refreshHotView({ showLoading: false });
  if (currentOverlayPage === 'teamStats') await refreshTeamStatsView({ showLoading: false });
  if (currentOverlayPage === 'hrLeaderboard') refreshHrLeaderboardView();
}

function isCurrentLoadGamesRequest(requestId) {
  return requestId === loadGamesRequestSeq;
}

function renderGamesLoadingState(date) {
  if (!gamesEl) return;
  gamesEl.replaceChildren();
  const loading = document.createElement('div');
  loading.className = 'games-loading';
  loading.setAttribute('role', 'status');
  loading.setAttribute('aria-live', 'polite');
  const label = document.createElement('div');
  label.className = 'games-loading-label';
  label.textContent = `Loading ${formatLongDateLabel(date)} MLB Games`;
  const bar = document.createElement('div');
  bar.className = 'games-loading-bar';
  const fill = document.createElement('span');
  bar.appendChild(fill);
  loading.append(label, bar);
  gamesEl.appendChild(loading);
}

async function renderGamesEmptyState(message) {
  gamesEl.replaceChildren();
  const empty = document.createElement('div');
  empty.className = 'empty';
  empty.textContent = message;
  gamesEl.appendChild(empty);
  latestRenderedGames = [];
  updateDashboardSummary([]);
  renderBetList([]);
  renderHomeRunFeed([]);
  await syncLeaderFilters([]);
    if (currentOverlayPage === 'leaders') await refreshLeadersView({ showLoading: false });
    if (currentOverlayPage === 'hot') await refreshHotView({ showLoading: false });
    if (currentOverlayPage === 'teamStats') await refreshTeamStatsView({ showLoading: false });
    if (currentOverlayPage === 'hrLeaderboard') refreshHrLeaderboardView();
}

async function loadGames(options = {}) {
  if (loadGamesInFlight) {
    loadGamesQueued = true;
    if (options.invalidate) loadGamesRequestSeq += 1;
    return;
  }
  const hadRenderedGames = latestRenderedGames.length > 0 || Boolean(gamesEl?.querySelector?.('.game-card'));
  const requestId = options.reuseRequestId ? loadGamesRequestSeq : ++loadGamesRequestSeq;
  loadGamesInFlight = true;
  loadGamesStartedAt = Date.now();
  lineupHotRecognitionCache.clear();
  const selectedDate = dateInput.value || formatDate(new Date());
  const shouldShowLoadingState = options.showLoading === true
    || (options.showLoading !== false && !hadRenderedGames && !initialGamesLoadingShown);
  if (shouldShowLoadingState) {
    initialGamesLoadingShown = true;
    renderGamesLoadingState(selectedDate);
  }
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
    loadGamesStartedAt = 0;
    lastLoadFinishedAt = Date.now();
    if (loadGamesQueued || requestId !== loadGamesRequestSeq) {
      loadGamesQueued = false;
      window.setTimeout(() => loadGames({ reuseRequestId: requestId === loadGamesRequestSeq }), 150);
    }
  }
}

function isCompleteDateInputText(value) {
  const text = String(value || '').trim();
  return /^(\d{4})-(\d{2})-(\d{2})$/.test(text)
    || /^(\d{4})(\d{2})(\d{2})$/.test(text)
    || /^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/.test(text);
}

function refreshForSelectedDate(options = {}) {
  const normalized = parseFlexibleDateInput(dateInput.value);
  if (!normalized) {
    if (options.fallbackToToday === false) return false;
    dateInput.value = formatDate(new Date());
  } else if (dateInput.value !== normalized) {
    dateInput.value = normalized;
  }
  if (lastHandledDateValue === dateInput.value && !options.force) return false;
  lastHandledDateValue = dateInput.value;
  try {
    localStorage.setItem('dashboard-date:v1', dateInput.value);
  } catch {}
  if (playerTrackerListEl) playerTrackerListEl.dataset.renderFingerprint = '';
  closeLineupOverlay();
  clearDraftBetSlip();
  closeGamePickDialog();
  renderBetList();
  renderGoalTracker(true);
  latestRenderedHomeRuns = [];
  renderHomeRunFeed([]);
  loadGames({ invalidate: true });
  return true;
}

dateInput.addEventListener('change', () => {
  refreshForSelectedDate({ fallbackToToday: true });
});
dateInput.addEventListener('input', () => {
  window.clearTimeout(dateInputRefreshTimer);
  if (!isCompleteDateInputText(dateInput.value) || !parseFlexibleDateInput(dateInput.value)) return;
  dateInputRefreshTimer = window.setTimeout(() => {
    refreshForSelectedDate({ fallbackToToday: false });
  }, 150);
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
dateInput.addEventListener('focus', () => {
  openDatePicker();
});
dateInput.addEventListener('click', () => openDatePicker());
dateInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    closeDatePicker();
    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
  if (e.key === 'Escape') closeDatePicker();
});
dateInput.addEventListener('blur', () => {
  const normalized = parseFlexibleDateInput(dateInput.value);
  if (normalized) dateInput.value = normalized;
});
document.addEventListener('mousedown', (e) => {
  if (!datePickerEl) return;
  if (e.target === dateInput || datePickerEl.contains(e.target)) return;
  closeDatePicker();
});
window.addEventListener('resize', positionDatePicker);
window.addEventListener('scroll', positionDatePicker, true);

compactExistingStorage();
initThemePicker();
initOverlayPageControl();
initOverlayKeyboardShortcuts();
initDateKeyboardShortcuts();
initOverlayDockControl();
initScoreboardColumnsControl();
initOverlayResizeControl();
initLineupOverlay();
initScoreboardLineupShortcuts();
initMovables();
initBetInput();
initGoalTracker();
initLeadersControls();
initTeamStatsTableSorting();
initMatchupExportWidget();
renderHomeRunFeed([]);
loadGames();

function autoRefreshDelayMs() {
  if (document.hidden) return 30000;
  if (loadGamesInFlight) return 10000;
  const idleMs = Date.now() - (lastLoadFinishedAt || 0);
  return idleMs > 20 * 60_000 ? 12000 : 6500;
}

function scheduleAutoRefresh() {
  if (autoRefreshTimerId) window.clearTimeout(autoRefreshTimerId);
  if (currentOverlayPage !== 'scoreboard') return;
  autoRefreshTimerId = window.setTimeout(() => {
    const selectedDate = dateInput.value || formatDate(new Date());
    if (loadGamesInFlight && loadGamesStartedAt && Date.now() - loadGamesStartedAt > 90000) {
      loadGamesInFlight = false;
      loadGamesQueued = false;
      loadGames({ invalidate: true });
      scheduleAutoRefresh();
      return;
    }
    if (selectedDate === formatDate(new Date())) loadGames();
    scheduleAutoRefresh();
  }, autoRefreshDelayMs());
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') suppressScoreAnimations();
  scheduleAutoRefresh();
});
window.addEventListener('online', () => {
  if (currentOverlayPage === 'scoreboard') loadGames();
});
window.addEventListener('focus', () => {
  suppressScoreAnimations();
  if (currentOverlayPage === 'scoreboard') loadGames();
});
scheduleAutoRefresh();
