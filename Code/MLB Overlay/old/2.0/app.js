const gamesEl = document.getElementById('games');
const template = document.getElementById('gameTemplate');
const dateInput = document.getElementById('dateInput');
const overlayEl = document.getElementById('overlay');
const themeSelectEl = document.getElementById('themeSelect');
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

const betFormEl = document.getElementById('betForm');
const betDescEl = document.getElementById('betDesc');
const betPlayerSearchEl = document.getElementById('betPlayerSearch');
const betPlayerOptionsEl = document.getElementById('betPlayerOptions');
const betPropSelectEl = document.getElementById('betPropSelect');
const betAddLegBtnEl = document.getElementById('betAddLegBtn');
const betClearLegsBtnEl = document.getElementById('betClearLegsBtn');
const betOddsEl = document.getElementById('betOdds');
const betAmountEl = document.getElementById('betAmount');
const betListEl = document.getElementById('betList');
const betDayLabelEl = document.getElementById('betDayLabel');
const clearBetsBtn = document.getElementById('clearBetsBtn');
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

const previousState = new Map();
let currentLineupView = 'lineups';
let activeLineupGame = null;
let latestRenderedGames = [];
let goalCompletePulseTimeout = null;
let draftBetLegs = [];
const PANEL_LAYOUT_KEY = 'panel-layout:v1';
const THEME_KEY = 'overlay-theme:v1';
const LINEUP_OPEN_KEY = 'lineup-open:v2';
const GAME_ARCHIVE_PREFIX = 'games-archive:v1';
const MLB_API_BASE = 'https://statsapi.mlb.com/api/v1';
const MLB_API_BASE_LIVE = 'https://statsapi.mlb.com/api/v1.1';
const REQUEST_TIMEOUT_MS = 9000;
const REQUEST_RETRY_COUNT = 2;

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

function getOverlayLeftBound() {
  return window.innerWidth - overlayEl.getBoundingClientRect().width;
}

function constrainMovable(panel) {
  const rightLimit = getOverlayLeftBound() - 8;
  const maxW = Math.max(180, rightLimit - 8);
  const width = clamp(panel.getBoundingClientRect().width, 180, maxW);
  const height = clamp(panel.getBoundingClientRect().height, 180, window.innerHeight - 8);
  panel.style.width = `${width}px`;
  panel.style.height = `${height}px`;

  const maxLeft = rightLimit - width;
  panel.style.left = `${clamp(panel.offsetLeft, 0, maxLeft)}px`;
  panel.style.top = `${clamp(panel.offsetTop, 0, window.innerHeight - height)}px`;
}

function constrainMovablePosition(panel) {
  const width = panel.getBoundingClientRect().width;
  const height = panel.getBoundingClientRect().height;
  const rightLimit = getOverlayLeftBound() - 8;
  const maxLeft = rightLimit - width;
  panel.style.left = `${clamp(panel.offsetLeft, 0, maxLeft)}px`;
  panel.style.top = `${clamp(panel.offsetTop, 0, window.innerHeight - height)}px`;
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

function initMovables() {
  for (const panel of document.querySelectorAll('.movable')) {
    const header = panel.querySelector('[data-drag-handle]');
    const resizeHandles = panel.querySelectorAll('[data-resize-handle]');
    let action = null;

    restorePanelLayout(panel);

    for (const handle of resizeHandles) {
      handle.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        action = {
          type: 'resize',
          pointerId: e.pointerId,
          dir: handle.dataset.dir || 'se',
          startX: e.clientX,
          startY: e.clientY,
          left: panel.offsetLeft,
          top: panel.offsetTop,
          width: panel.offsetWidth,
          height: panel.offsetHeight,
        };
        e.preventDefault();
        e.stopPropagation();
      });
    }

    header.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (action) return;
      action = {
        type: 'move',
        pointerId: e.pointerId,
        dx: e.clientX - panel.offsetLeft,
        dy: e.clientY - panel.offsetTop,
      };
      e.preventDefault();
    });

    window.addEventListener('pointermove', (e) => {
      if (!action || e.pointerId !== action.pointerId) return;

      if (action.type === 'move') {
        panel.style.left = `${e.clientX - action.dx}px`;
        panel.style.top = `${e.clientY - action.dy}px`;
        constrainMovablePosition(panel);
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

        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
        panel.style.width = `${width}px`;
        panel.style.height = `${height}px`;
        constrainMovable(panel);
      }
    });

    const endAction = (e) => {
      if (!action || (e.pointerId !== undefined && e.pointerId !== action.pointerId)) return;
      persistPanelLayout(panel);
      action = null;
    };

    window.addEventListener('pointerup', endAction);
    window.addEventListener('pointercancel', endAction);

    constrainMovable(panel);
    persistPanelLayout(panel);
  }

  window.addEventListener('resize', () => {
    for (const panel of document.querySelectorAll('.movable')) {
      constrainMovable(panel);
      persistPanelLayout(panel);
    }
  });
}

function oddsToPayout(oddsRaw, stake) {
  const odds = Number(oddsRaw);
  if (!Number.isFinite(odds) || odds === 0) return 0;
  const profit = odds > 0 ? (stake * odds) / 100 : (stake * 100) / Math.abs(odds);
  return stake + profit;
}

function getBets() {
  return JSON.parse(localStorage.getItem(storageKey('bets')) || '[]');
}

function saveBets(bets) {
  try {
    localStorage.setItem(storageKey('bets'), JSON.stringify(bets));
  } catch {}
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
  const milliseconds = totalMs % 1000;
  return `${[hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')}.${String(milliseconds).padStart(3, '0')}`;
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
  return JSON.parse(localStorage.getItem(gameCacheKey()) || '[]');
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
    localStorage.setItem(gameCacheKey(), JSON.stringify((games || []).map(compactStoredGame)));
  } catch {}
}

function getArchivedGames(date) {
  return JSON.parse(localStorage.getItem(archiveKey(date)) || '[]');
}

function saveArchivedGames(date, games) {
  try {
    localStorage.setItem(archiveKey(date), JSON.stringify((games || []).map(compactStoredGame)));
  } catch {}
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
  return fullName.trim().split(/\s+/).slice(-1)[0] || '-';
}

function battingOrderValue(player) {
  const raw = player?.battingOrder;
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) return '-';
  return String(Math.floor(num / 100) || num);
}

function battingAverage(player) {
  return player?.stats?.batting?.avg || player?.seasonStats?.batting?.avg || '---';
}

function cleanSummary(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
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
  return parts.join(' ') || 'No PA yet';
}

function pitcherEra(player) {
  return player?.stats?.pitching?.era || player?.seasonStats?.pitching?.era || '---';
}

function pitcherWhip(player) {
  return player?.stats?.pitching?.whip || player?.seasonStats?.pitching?.whip || '---';
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
  const safe = encodeURIComponent(String(teamAbbrev).slice(0, 4).toUpperCase());
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
      batting: {
        avg: batting.avg || '---',
        obp: batting.obp || '---',
        slg: batting.slg || '---',
        ops: batting.ops || '---',
        hr: statNumber(batting.homeRuns),
        doubles: statNumber(batting.doubles),
        triples: statNumber(batting.triples),
        rbi: statNumber(batting.rbi),
        hits: statNumber(batting.hits),
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
        wins: statNumber(pitching.wins),
        losses: statNumber(pitching.losses),
        saves: statNumber(pitching.saves),
        ip: cleanSummary(pitching.inningsPitched) || '0.0',
        so: statNumber(pitching.strikeOuts),
        bb: statNumber(pitching.baseOnBalls ?? pitching.walks),
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

function getTeamColor(abbrev) {
  return TEAM_COLORS[abbrev] || '#DDE9FF';
}

function getLogoPath(abbrev) {
  return TEAM_LOGOS[abbrev] ? `Logos/${TEAM_LOGOS[abbrev]}` : 'placeholder.png';
}

function gameMatchKey(away, home) {
  return `${away}@${home}`;
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

async function getLiveGameFeed(gamePk) {
  return getJson(`${MLB_API_BASE_LIVE}/game/${gamePk}/feed/live`);
}

async function getGameBoxscore(gamePk) {
  return getJson(`${MLB_API_BASE}/game/${gamePk}/boxscore`);
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
  el.classList.remove('overflow-marquee');
  el.style.removeProperty('--marquee-distance');
  el.style.removeProperty('--marquee-duration');
  const text = el.textContent || '';
  el.textContent = '';
  const track = document.createElement('span');
  track.className = 'marquee-track';
  track.textContent = text;
  el.appendChild(track);
  void el.offsetWidth;
  const overflow = Math.ceil(track.scrollWidth - el.clientWidth);
  if (overflow <= 10) return;
  const travel = overflow + 4;
  const duration = Math.max(2.8, travel / 38);
  el.style.setProperty('--marquee-distance', `${travel}px`);
  el.style.setProperty('--marquee-duration', `${duration.toFixed(2)}s`);
  el.classList.add('overflow-marquee');
}

function statusLine(game) {
  const st = game?.status?.abstractGameState;
  if (st === 'Preview') return `Not Started | ${estTime(game.gameDate)} EST`;
  if (st === 'Final') return 'Final';
  return game?.status?.detailedState || 'Unknown';
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

function matchupLineForSide(game, side) {
  const battingSide = game?.battingSide || 'away';
  if (side === battingSide) {
    const hitter = side === 'away' ? game?.awayHitter : game?.homeHitter;
    return `AB ${hitter || '-'}`;
  }
  const pitcher = side === 'away' ? game?.awayPitcher : game?.homePitcher;
  return `P ${pitcher || '-'}`;
}

function baseState(linescore) {
  const o = linescore?.offense || {};
  return { first: Boolean(o.first), second: Boolean(o.second), third: Boolean(o.third) };
}

function parseHrNumber(description) {
  const m = description?.match(/(\d+)(st|nd|rd|th)\s+home run/i);
  return m ? Number(m[1]) : null;
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

function buildPitcherEntry(player, forceActive = false) {
  if (!player) return null;
  return {
    id: player?.person?.id ?? null,
    name: lastName(player?.person?.fullName || player?.person?.lastName || 'Unknown'),
    fullName: player?.person?.fullName || 'Unknown',
    era: pitcherEra(player),
    whip: pitcherWhip(player),
    today: pitcherTodaySummary(player),
    pitches: pitchCount(player),
    isActive: forceActive,
  };
}

function buildPitchingStaff(players, activePitcherId, probablePitcher) {
  const allPitchers = Object.values(players || {}).filter(isPitcherPlayer);
  const activeNumericId = Number(activePitcherId);
  const activePlayer = Number.isFinite(activeNumericId) ? allPitchers.find((player) => Number(player?.person?.id) === activeNumericId) : null;
  let current = buildPitcherEntry(activePlayer, true);

  if (!current && probablePitcher?.id) {
    const probablePlayer = allPitchers.find((player) => Number(player?.person?.id) === Number(probablePitcher.id));
    current = buildPitcherEntry(probablePlayer, true) || {
      id: probablePitcher.id,
      name: lastName(probablePitcher.fullName || 'Unknown'),
      fullName: probablePitcher.fullName || 'Unknown',
      era: '---',
      whip: '---',
      today: 'Not in yet',
      pitches: 0,
      isActive: true,
    };
  }

  const bullpen = allPitchers
    .filter((player) => Number(player?.person?.id) !== Number(current?.id))
    .map((player) => buildPitcherEntry(player, false))
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

function chooseBetterPitching(primary, secondary) {
  if (!primary && !secondary) return { away: { current: null, bullpen: [] }, home: { current: null, bullpen: [] } };
  if (!primary) return secondary;
  if (!secondary) return primary;
  return pitchingTotalCount(primary) >= pitchingTotalCount(secondary) ? primary : secondary;
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

  if (existingFinal || incomingFinal) {
    const finalized = incomingFinal
      ? normalizeCompletedCard(mergeFinishedGameState(incoming, existing))
      : normalizeCompletedCard(existing);
    const canReplaceFinalScore = incomingFinal || !existingFinal;
    return {
      ...finalized,
      awayScore: canReplaceFinalScore && incomingHasAwayScore ? incoming.awayScore : finalized.awayScore,
      homeScore: canReplaceFinalScore && incomingHasHomeScore ? incoming.homeScore : finalized.homeScore,
      lineup: chooseBetterLineup(finalized.lineup, existing.lineup),
      pitching: chooseBetterPitching(finalized.pitching, existing.pitching),
      ticker: chooseBetterTicker(finalized.ticker, existing.ticker),
      lastPlay: !isPlaceholderPlay(finalized.lastPlay) ? finalized.lastPlay : (existing.lastPlay || incoming.lastPlay || 'Final'),
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
    awayScore: Number.isFinite(Number(preferred.awayScore)) ? preferred.awayScore : fallback.awayScore,
    homeScore: Number.isFinite(Number(preferred.homeScore)) ? preferred.homeScore : fallback.homeScore,
    lineup: chooseBetterLineup(preferred.lineup, fallback.lineup),
    pitching: chooseBetterPitching(preferred.pitching, fallback.pitching),
    ticker: chooseBetterTicker(preferred.ticker, fallback.ticker),
    lastPlay: !isPlaceholderPlay(preferred.lastPlay) ? preferred.lastPlay : (fallback.lastPlay || preferred.lastPlay),
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
  const awayAbbrev = options.awayAbbrev || game?.teams?.away?.team?.abbreviation || game?.away || 'AWAY';
  const homeAbbrev = options.homeAbbrev || game?.teams?.home?.team?.abbreviation || game?.home || 'HOME';
  const awayColor = options.awayColor || getTeamColor(awayAbbrev);
  const homeColor = options.homeColor || getTeamColor(homeAbbrev);
  const battingSide = options.battingSide || 'away';
  const awayPlayers = boxscore?.teams?.away?.players || {};
  const homePlayers = boxscore?.teams?.home?.players || {};
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
        battingSide === 'home' ? activePlay?.matchup?.pitcher?.id : game?.teams?.away?.probablePitcher?.id,
        game?.teams?.away?.probablePitcher,
      ),
      home: buildPitchingStaff(
        homePlayers,
        battingSide === 'away' ? activePlay?.matchup?.pitcher?.id : game?.teams?.home?.probablePitcher?.id,
        game?.teams?.home?.probablePitcher,
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
    playerLookup: { ...(cached.playerLookup || {}), ...(card.playerLookup || {}) },
  };
}

function resolveActivePlay(game, currentPlay, allPlays) {
  if (game?.status?.abstractGameState === 'Final' && allPlays.length) return allPlays[allPlays.length - 1];
  if (currentPlay?.matchup) return currentPlay;
  if (allPlays.length) return allPlays[allPlays.length - 1];
  return game?.status?.abstractGameState === 'Final' ? null : currentPlay || null;
}

function betPropLabel(type) {
  if (type === 'hit') return 'Hit';
  if (type === 'hr') return 'HR';
  if (type === 'xbh') return 'XBH';
  return String(type || 'Prop').toUpperCase();
}

function buildBetSlipText(legs) {
  return (legs || []).map((leg) => `${leg.playerName} ${betPropLabel(leg.propType)}`).join(' + ');
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

function refreshBetPlayerOptions(games = latestRenderedGames) {
  if (!betPlayerOptionsEl) return;
  betPlayerOptionsEl.replaceChildren();
  for (const player of getBetSearchPool(games)) {
    const option = document.createElement('option');
    option.value = `${player.playerName} | ${player.teamAbbrev || 'MLB'} | ${player.playerId}`;
    betPlayerOptionsEl.appendChild(option);
  }
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
}

function addDraftBetLeg() {
  const player = resolveBetSearchPlayer(betPlayerSearchEl?.value || '', latestRenderedGames);
  const propType = betPropSelectEl?.value || 'hit';
  if (!player) return;
  const exists = draftBetLegs.some((leg) => String(leg.playerId) === String(player.playerId) && leg.propType === propType);
  if (exists) return;
  draftBetLegs.push({
    playerId: player.playerId,
    playerName: player.playerName,
    playerNameKey: player.playerNameKey,
    teamAbbrev: player.teamAbbrev,
    propType,
  });
  renderDraftBetSlip();
  if (betPlayerSearchEl) betPlayerSearchEl.value = '';
}

function parseTrackedBet(desc) {
  const text = cleanSummary(desc);
  const lowered = text.toLowerCase();
  const patterns = [
    { type: 'hit', regex: /^(.*?)\s+for\s+a\s+hit$/i },
    { type: 'hit', regex: /^(.*?)\s+to\s+record\s+a\s+hit$/i },
    { type: 'hit', regex: /^(.*?)\s+hit$/i },
    { type: 'hr', regex: /^(.*?)\s+(?:for\s+a\s+)?home\s+run$/i },
    { type: 'hr', regex: /^(.*?)\s+(?:for\s+a\s+)?hr$/i },
    { type: 'xbh', regex: /^(.*?)\s+(?:for\s+an?\s+)?xbh$/i },
    { type: 'xbh', regex: /^(.*?)\s+(?:for\s+an?\s+)?extra\s+base\s+hit$/i },
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (!match) continue;
    const playerName = cleanSummary(match[1]);
    if (!playerName) continue;
    return {
      type: pattern.type,
      playerName,
      playerNameKey: normalizeNameKey(playerName),
      raw: text,
    };
  }
  if (/\bfor\b/.test(lowered) || /\bhit\b/.test(lowered)) {
    const fallback = text.replace(/\s+(for|to)\b.*$/i, '').trim();
    if (fallback) {
      return {
        type: lowered.includes('hit') ? 'hit' : 'unknown',
        playerName: fallback,
        playerNameKey: normalizeNameKey(fallback),
        raw: text,
      };
    }
  }
  return null;
}

function gameStatusIsFinal(game) {
  return isCompletedGameCard(game);
}

function trackedBetCandidate(game, tracked) {
  if (!game || (!tracked?.playerNameKey && !tracked?.playerId)) return null;
  for (const profile of Object.values(game.playerLookup || {})) {
    if (String(profile?.position || '').toUpperCase() === 'P' && ['hit', 'hr', 'xbh'].includes(tracked.type)) continue;
    const idMatches = Number.isFinite(Number(tracked.playerId)) && Number(profile?.id) === Number(tracked.playerId);
    const nameMatches = tracked?.playerNameKey && profile?.fullNameKey === tracked.playerNameKey;
    if (idMatches || nameMatches) {
      return {
        gamePk: game.gamePk,
        playerId: profile.id,
        fullName: profile.fullName,
        teamAbbrev: profile.teamAbbrev,
        batting: profile.batting,
        activeBatterId: game.activeBatterId,
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
        batting: { hits: 0 },
        activeBatterId: game.activeBatterId,
        final: gameStatusIsFinal(game),
      };
    }
  }
  return null;
}

function normalizedBetLegs(bet) {
  if (Array.isArray(bet?.legs) && bet.legs.length) {
    return bet.legs.map((leg) => ({
      playerId: Number(leg.playerId),
      playerName: leg.playerName || 'Unknown',
      playerNameKey: leg.playerNameKey || normalizeNameKey(leg.playerName || ''),
      type: leg.propType || leg.type || 'hit',
      propType: leg.propType || leg.type || 'hit',
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
  const candidates = (games || []).map((game) => trackedBetCandidate(game, leg)).filter(Boolean);
  const candidate = candidates[0] || null;
  if (!candidate) return { leg, status: 'unmatched', label: 'SEARCH', active: false, candidate: null };
  const hits = Number(candidate?.batting?.hits) || 0;
  const homeRuns = Number(candidate?.batting?.hr) || 0;
  const xbh = (Number(candidate?.batting?.hr) || 0) + (Number(candidate?.batting?.doubles) || 0) + (Number(candidate?.batting?.triples) || 0);
  if (leg.type === 'hit') {
    if (hits > 0) return { leg, candidate, status: 'hit', label: 'HIT', active: Number(candidate.activeBatterId) === Number(candidate.playerId) };
    if (candidate.final) return { leg, candidate, status: 'miss', label: 'MISS', active: false };
    return { leg, candidate, status: 'pending', label: 'PENDING', active: Number(candidate.activeBatterId) === Number(candidate.playerId) };
  }
  if (leg.type === 'hr') {
    if (homeRuns > 0) return { leg, candidate, status: 'hit', label: 'HIT', active: Number(candidate.activeBatterId) === Number(candidate.playerId) };
    if (candidate.final) return { leg, candidate, status: 'miss', label: 'MISS', active: false };
    return { leg, candidate, status: 'pending', label: 'PENDING', active: Number(candidate.activeBatterId) === Number(candidate.playerId) };
  }
  if (leg.type === 'xbh') {
    if (xbh > 0) return { leg, candidate, status: 'hit', label: 'HIT', active: Number(candidate.activeBatterId) === Number(candidate.playerId) };
    if (candidate.final) return { leg, candidate, status: 'miss', label: 'MISS', active: false };
    return { leg, candidate, status: 'pending', label: 'PENDING', active: Number(candidate.activeBatterId) === Number(candidate.playerId) };
  }
  return { leg, candidate, status: 'manual', label: 'MANUAL', active: Number(candidate.activeBatterId) === Number(candidate.playerId) };
}

function resolveTrackedBet(bet, games = latestRenderedGames) {
  const legs = normalizedBetLegs(bet);
  if (!legs.length) return { tracked: null, status: 'manual', label: 'MANUAL', active: false, legs: [] };
  const resolvedLegs = legs.map((leg) => resolveTrackedLeg(leg, games));
  const allHit = resolvedLegs.every((leg) => leg.status === 'hit');
  const anyMiss = resolvedLegs.some((leg) => leg.status === 'miss');
  const anyPending = resolvedLegs.some((leg) => leg.status === 'pending');
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

function renderBetList(games = latestRenderedGames) {
  betDayLabelEl.textContent = dateInput.value;
  refreshBetPlayerOptions(games);
  const bets = getBets();
  betListEl.replaceChildren();
  for (const b of bets) {
    const resolved = resolveTrackedBet(b, games);
    const el = document.createElement('div');
    el.className = `panel-item bet-item bet-status-${resolved.status || 'manual'}`;
    const textWrap = document.createElement('div');
    textWrap.className = 'bet-text';
    const summary = document.createElement('div');
    summary.textContent = `${b.desc} | ${b.odds} | $${b.amount.toFixed(2)} -> $${b.payout.toFixed(2)}`;
    const statusRow = document.createElement('div');
    statusRow.className = 'bet-status-row';
    const statusPill = document.createElement('span');
    statusPill.className = 'bet-status-pill';
    statusPill.textContent = resolved.label;
    statusRow.appendChild(statusPill);
    if (resolved.candidate?.fullName) {
      const meta = document.createElement('span');
      meta.textContent = `${resolved.candidate.fullName} | ${resolved.candidate.teamAbbrev}`;
      statusRow.appendChild(meta);
    }
    textWrap.append(summary, statusRow);
    if ((resolved.legs || []).length) {
      const legsEl = document.createElement('div');
      legsEl.className = 'bet-legs';
      for (const leg of resolved.legs) {
        const pill = document.createElement('span');
        pill.className = `bet-leg-pill bet-status-${leg.status}`;
        if (leg.active) pill.classList.add('bet-leg-pill-active');
        if (leg?.candidate?.playerId) {
          pill.dataset.playerId = String(leg.candidate.playerId);
          pill.dataset.gamePk = String(leg.candidate.gamePk || '');
        }
        pill.textContent = `${leg.leg.playerName} ${betPropLabel(leg.leg.type)} ${leg.label}`;
        legsEl.appendChild(pill);
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
}

function initBetInput() {
  renderBetList();
  clearBetsBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
  betAddLegBtnEl?.addEventListener('pointerdown', (e) => e.stopPropagation());
  betClearLegsBtnEl?.addEventListener('pointerdown', (e) => e.stopPropagation());

  betAddLegBtnEl?.addEventListener('click', addDraftBetLeg);
  betClearLegsBtnEl?.addEventListener('click', clearDraftBetSlip);
  betPlayerSearchEl?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    addDraftBetLeg();
  });

  betFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = betDescEl.value.trim();
    const odds = betOddsEl.value.trim();
    const amount = Number(betAmountEl.value);
    if (!desc || !odds || !Number.isFinite(amount) || amount <= 0) return;

    const payout = oddsToPayout(odds, amount);
    if (!Number.isFinite(payout) || payout <= 0) return;

    const bets = getBets();
    bets.unshift({
      id: String(Date.now()),
      desc,
      odds,
      amount,
      payout,
      ts: Date.now(),
      legs: draftBetLegs.length ? draftBetLegs.map((leg) => ({ ...leg })) : [],
    });
    saveBets(bets);

    betFormEl.reset();
    clearDraftBetSlip();
    renderBetList();
  });

  clearBetsBtn.addEventListener('click', () => {
    saveBets([]);
    renderBetList();
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
  goalTimerEl.textContent = formatGoalDuration(elapsedMs);
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
  goalSaveBtnEl?.addEventListener('click', () => commitGoalFromInput(true));
  goalCompleteBtnEl?.addEventListener('click', completeCurrentGoal);
  clearGoalsBtnEl?.addEventListener('click', clearCompletedGoals);
  goalCurrentInputEl?.addEventListener('input', saveGoalInputValue);
  goalCurrentInputEl?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();
    commitGoalFromInput(true);
  });

  for (const button of [goalStartPauseBtnEl, goalResetBtnEl, goalSaveBtnEl, goalCompleteBtnEl, clearGoalsBtnEl]) {
    button?.addEventListener('pointerdown', (e) => e.stopPropagation());
  }
  goalCurrentInputEl?.addEventListener('pointerdown', (e) => e.stopPropagation());

  setInterval(updateGoalTimerDisplay, 31);
}

async function fetchGamesAndHomeRuns(date) {
  const schedule = await getSchedule(date);
  const games = schedule?.dates?.[0]?.games || [];
  const homeRuns = [];
  const cachedCards = new Map(getCachedGames().map((card) => [card.gamePk, card]));
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
        if (ticker.length >= 2) break;
      }

      for (const play of allPlays) {
        if (play?.result?.event === 'Home Run') {
          const batterId = play?.matchup?.batter?.id;
          const batter = play?.matchup?.batter?.fullName || 'Unknown';
          const half = play?.about?.halfInning;
          const battingTeamAbbr = half === 'top' ? awayAbbrev : homeAbbrev;
          const battingColor = half === 'top' ? awayColor : homeColor;
          const players = half === 'top' ? awayPlayers : homePlayers;
          const jersey = players[`ID${batterId}`]?.jerseyNumber || '?';
          const hrNo = parseHrNumber(play?.result?.description || '');
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
        away: awayAbbrev,
        home: homeAbbrev,
        awayScore: linescore?.teams?.away?.runs ?? game?.teams?.away?.score ?? '-',
        homeScore: linescore?.teams?.home?.runs ?? game?.teams?.home?.score ?? '-',
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
          lineup: lineupCount(cached?.lineup) > 0 ? cached.lineup : derivedLineup,
          pitching: (cached?.pitching?.away?.current || cached?.pitching?.home?.current
            || cached?.pitching?.away?.bullpen?.length || cached?.pitching?.home?.bullpen?.length)
            ? cached.pitching
            : derivedPitching,
          awayScore: game?.teams?.away?.score ?? cached.awayScore,
          homeScore: game?.teams?.home?.score ?? cached.homeScore,
          status: statusLine(game) || cached.status,
          playerLookup: { ...(cached.playerLookup || {}), ...derivedLookup },
        });
      }
      return normalizeCompletedCard({
        gamePk,
        away: awayFromSchedule,
        home: homeFromSchedule,
        awayScore: game?.teams?.away?.score ?? '-',
        homeScore: game?.teams?.home?.score ?? '-',
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
        lineup: derivedLineup,
        pitching: derivedPitching,
        playerLookup: derivedLookup,
      });
    }
  }));

  const cards = cardResults.filter(Boolean);
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

    const cards = await Promise.all(games.map(async (game) => {
      const awayAbbrev = game?.teams?.away?.team?.abbreviation || game?.teams?.away?.team?.teamCode?.toUpperCase() || 'AWAY';
      const homeAbbrev = game?.teams?.home?.team?.abbreviation || game?.teams?.home?.team?.teamCode?.toUpperCase() || 'HOME';
      const cached = cachedCards.get(gameMatchKey(awayAbbrev, homeAbbrev)) || null;
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
        away: awayAbbrev,
        home: homeAbbrev,
        awayScore: game?.teams?.away?.score ?? cached?.awayScore ?? '-',
        homeScore: game?.teams?.home?.score ?? cached?.homeScore ?? '-',
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

    return cards.map(normalizeCompletedCard);
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
        <div>${hr.hrNo ? `HR #${hr.hrNo}` : 'HR'}${hr.distance ? ` | ${hr.distance} ft` : ''}</div>
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

function renderPitchingSide(sectionEl, teamCode, color, staff) {
  if (!sectionEl) return;
  const titleEl = sectionEl.querySelector('.lineup-pitching-team-code');
  const currentEl = sectionEl.querySelector('.current-pitcher-card');
  const bullpenEl = sectionEl.querySelector('.bullpen-list');
  if (titleEl) {
    titleEl.textContent = teamCode;
    titleEl.style.color = color;
  }

  const current = staff?.current;
  if (currentEl) {
    currentEl.dataset.playerId = String(current?.id ?? '');
    currentEl.innerHTML = current ? `
      <div class="pitching-card-label">Current Pitcher</div>
      <div class="pitching-card-name" style="color:${color}">${current.fullName}</div>
      <div class="pitching-card-meta">WHIP ${current.whip} | ERA ${current.era}</div>
      <div class="pitching-card-today">${current.today}</div>
    ` : '<div class="pitching-card-empty">Awaiting pitcher</div>';
  }

  if (!bullpenEl) return;
  bullpenEl.replaceChildren();
  const bullpen = staff?.bullpen || [];
  if (!bullpen.length) {
    const empty = document.createElement('div');
    empty.className = 'lineup-empty';
    empty.textContent = 'Awaiting bullpen data';
    bullpenEl.appendChild(empty);
    return;
  }

  for (const arm of bullpen) {
    const li = document.createElement('li');
    li.className = 'bullpen-item';
    li.dataset.playerId = String(arm.id ?? '');
    li.innerHTML = `
      <div class="bullpen-main">
        <span class="bullpen-name" style="color:${color}">${arm.fullName}</span>
        <span class="bullpen-meta">WHIP ${arm.whip} | ERA ${arm.era}</span>
      </div>
      <div class="bullpen-today">${arm.today}</div>
    `;
    bullpenEl.appendChild(li);
  }
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
  card.querySelector('.score-mini-balls strong').textContent = game.balls;
  card.querySelector('.score-mini-strikes strong').textContent = game.strikes;
  card.querySelector('.score-mini-outs strong').textContent = game.outs;
  card.querySelector('.score-mini-base.first')?.classList.toggle('on', Boolean(game.bases?.first));
  card.querySelector('.score-mini-base.second')?.classList.toggle('on', Boolean(game.bases?.second));
  card.querySelector('.score-mini-base.third')?.classList.toggle('on', Boolean(game.bases?.third));
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
      wins: mlbStatNumber(pitching, 'wins') || fallbackProfile?.pitching?.wins || 0,
      losses: mlbStatNumber(pitching, 'losses') || fallbackProfile?.pitching?.losses || 0,
      saves: mlbStatNumber(pitching, 'saves') || fallbackProfile?.pitching?.saves || 0,
      ip: mlbStatValue(pitching, 'inningsPitched', fallbackProfile?.pitching?.ip || '0.0'),
      so: mlbStatNumber(pitching, 'strikeOuts') || fallbackProfile?.pitching?.so || 0,
      bb: mlbStatNumber(pitching, 'baseOnBalls') || fallbackProfile?.pitching?.bb || 0,
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

async function hydratePlayerLookupForGame(game) {
  if (!game?.gamePk) return game?.playerLookup || {};
  try {
    let lookup = {};
    try {
      const live = await getLiveGameFeed(game.gamePk);
      const awayTeam = live?.gameData?.teams?.away || {};
      const homeTeam = live?.gameData?.teams?.home || {};
      const awayAbbrev = awayTeam.abbreviation || awayTeam.teamCode?.toUpperCase() || game.away || 'AWAY';
      const homeAbbrev = homeTeam.abbreviation || homeTeam.teamCode?.toUpperCase() || game.home || 'HOME';
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
  if (!profile && Number.isFinite(Number(playerId)) && Number(playerId) > 0) {
    await hydratePlayerLookupForGame(game);
    profile = game?.playerLookup?.[String(playerId)];
  }
  if (!profile && Number.isFinite(Number(playerId)) && Number(playerId) > 0) {
    profile = await fetchMlbPlayerProfile(playerId, game);
    if (profile) persistPlayerLookupForGame(game, { [String(playerId)]: profile });
  }
  const fallbackLogo = game?.awayLogo || game?.homeLogo || 'placeholder.png';
  if (!profile) {
    playerStatNameEl.textContent = 'PLAYER DATA UNAVAILABLE';
    playerStatMetaEl.textContent = `${game?.away || ''} @ ${game?.home || ''}`.trim();
    playerStatHeadshotEl.src = fallbackLogo;
    playerStatBioEl.textContent = 'No detailed data available for this player in the current feed.';
    playerStatTodayEl.innerHTML = '<strong>TODAY</strong>Awaiting player detail data';
    playerStatSeasonEl.innerHTML = '<strong>SEASON</strong>Awaiting player detail data';
    playerStatExtraEl.innerHTML = '<strong>INFO</strong>MLB player endpoint did not return a profile for this player.';
    playerStatOverlayEl.hidden = false;
    return;
  }

  playerStatNameEl.textContent = profile.fullName;
  playerStatMetaEl.textContent = `${profile.teamAbbrev} #${profile.jersey} | ${profile.position}`;
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
  if (isPitcherProfile(profile)) {
    playerStatTodayEl.innerHTML = `<strong>TODAY</strong>${profile.todayPitching}`;
    playerStatSeasonEl.innerHTML = `<strong>PITCHING</strong>ERA ${profile.pitching.era} • WHIP ${profile.pitching.whip}<br>IP ${profile.pitching.ip} • K ${profile.pitching.so} • BB ${profile.pitching.bb}<br>W-L ${profile.pitching.wins}-${profile.pitching.losses} • SV ${profile.pitching.saves}`;
    playerStatExtraEl.innerHTML = `<strong>OPPONENT / HAND</strong>B/T ${profile.bats}/${profile.throws}<br>Batting line: AVG ${profile.batting.avg} • OPS ${profile.batting.ops}<br>${profile.teamAbbrev} #${profile.jersey} • ${profile.position}`;
  } else {
    playerStatTodayEl.innerHTML = `<strong>TODAY</strong>${profile.todayBatting}`;
    playerStatSeasonEl.innerHTML = `<strong>BATTING</strong>AVG ${profile.batting.avg} • OBP ${profile.batting.obp} • SLG ${profile.batting.slg} • OPS ${profile.batting.ops}<br>H ${profile.batting.hits} • AB ${profile.batting.atBats} • HR ${profile.batting.hr} • RBI ${profile.batting.rbi}`;
    playerStatExtraEl.innerHTML = `<strong>FIELD / BASES</strong>SB ${profile.batting.sb} • CS ${profile.batting.cs} • BB ${profile.batting.bb} • K ${profile.batting.so}<br>Fld% ${profile.fielding.pct} • E ${profile.fielding.errors} • A ${profile.fielding.assists} • PO ${profile.fielding.putOuts}<br>Fld Inn ${profile.fielding.innings}`;
  }
  playerStatOverlayEl.hidden = false;
}

function normalizedLineupEntry(entry, slot) {
  return {
    slot,
    id: entry?.id ?? null,
    name: entry?.name || lastName(entry?.fullName || 'Unknown'),
    fullName: entry?.fullName || entry?.name || 'Unknown',
    position: entry?.position || '',
    avg: entry?.avg || '---',
    today: entry?.today || 'No PA yet',
    isActive: Boolean(entry?.isActive),
  };
}

function fallbackTeamLineupFromLookup(game, side) {
  const team = side === 'away' ? game?.away : game?.home;
  const lineup = side === 'away' ? game?.lineup?.away : game?.lineup?.home;
  const bench = side === 'away' ? game?.lineup?.awayBench : game?.lineup?.homeBench;
  if (Array.isArray(lineup) && lineup.length) return lineup;

  if (Array.isArray(bench) && bench.length) {
    return bench.slice(0, 9).map((entry, idx) => normalizedLineupEntry(entry, idx + 1));
  }

  const pool = Object.values(game?.playerLookup || {})
    .filter((p) => String(p?.teamAbbrev || '').toUpperCase() === String(team || '').toUpperCase())
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

  return pool.slice(0, 9).map((p, idx) => normalizedLineupEntry({
    id: p.id,
    name: lastName(p.fullName),
    fullName: p.fullName,
    position: p.position,
    avg: p?.batting?.avg || '---',
    today: p.todayBatting || 'No PA yet',
  }, idx + 1));
}

function syncLineupOverlay(game) {
  const open = game && isLineupOpen(game.gamePk);
  lineupOverlayEl.hidden = !open;
  lineupOverlayEl.classList.toggle('open', Boolean(open));
  if (!open) {
    activeLineupGame = null;
    closePlayerStatOverlay();
    return;
  }
  activeLineupGame = game;

  lineupModalMatchupEl.textContent = `${game.away} @ ${game.home}`;
  lineupStateInningEl.textContent = game.inningShort;
  lineupStateAwayCodeEl.textContent = game.away;
  lineupStateAwayScoreEl.textContent = game.awayScore;
  lineupStateHomeCodeEl.textContent = game.home;
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
  awayTeamEl.textContent = game.away;
  homeTeamEl.textContent = game.home;
  awayTeamEl.style.color = game.awayColor;
  homeTeamEl.style.color = game.homeColor;
  const awayTeamPanel = lineupOverlayEl.querySelector('.away-lineup');
  const homeTeamPanel = lineupOverlayEl.querySelector('.home-lineup');
  const awayPitchingPanel = lineupOverlayEl.querySelector('.away-pitching');
  const homePitchingPanel = lineupOverlayEl.querySelector('.home-pitching');
  if (awayTeamPanel) awayTeamPanel.style.setProperty('--team-logo-bg', `url("${game.awayLogo}")`);
  if (homeTeamPanel) homeTeamPanel.style.setProperty('--team-logo-bg', `url("${game.homeLogo}")`);
  if (awayPitchingPanel) awayPitchingPanel.style.setProperty('--team-logo-bg', `url("${game.awayLogo}")`);
  if (homePitchingPanel) homePitchingPanel.style.setProperty('--team-logo-bg', `url("${game.homeLogo}")`);

  const awayDisplayLineup = fallbackTeamLineupFromLookup(game, 'away');
  const homeDisplayLineup = fallbackTeamLineupFromLookup(game, 'home');
  renderLineupList(lineupOverlayEl.querySelector('.away-lineup-list'), awayDisplayLineup, game.awayColor, game.away);
  renderLineupList(lineupOverlayEl.querySelector('.home-lineup-list'), homeDisplayLineup, game.homeColor, game.home);
  renderPitchingSide(lineupOverlayEl.querySelector('.away-pitching'), game.away, game.awayColor, game.pitching?.away);
  renderPitchingSide(lineupOverlayEl.querySelector('.home-pitching'), game.home, game.homeColor, game.pitching?.home);
}

function renderActiveLineupOverlay(games = []) {
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

  syncLineupOverlay(game);
}

function initLineupOverlay() {
  lineupBackdropEl.addEventListener('click', closeLineupOverlay);
  lineupCloseBtnEl.addEventListener('click', closeLineupOverlay);
  if (playerStatBackdropEl) playerStatBackdropEl.addEventListener('click', closePlayerStatOverlay);
  if (playerStatCloseBtnEl) playerStatCloseBtnEl.addEventListener('click', closePlayerStatOverlay);
  lineupOverlayEl.addEventListener('click', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const row = e.target.closest('.lineup-list li[data-player-id], .current-pitcher-card[data-player-id], .bullpen-item[data-player-id]');
    if (!row) return;
    const playerId = Number(row.dataset.playerId);
    if (!Number.isFinite(playerId) || playerId <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    openPlayerStatOverlay(playerId, activeLineupGame);
  });
  hrListEl.addEventListener('click', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
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

function renderLineupList(listEl, lineup, color, teamCode = '') {
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
    const indicatorClass = isAtBat ? 'is-atbat' : isOnDeck ? 'is-ondeck' : '';
    const rowClass = isAtBat ? 'lineup-row-atbat' : isOnDeck ? 'lineup-row-ondeck' : '';
    const indicatorSrc = isAtBat ? 'atbat.png' : isOnDeck ? 'ondeck.png' : '';
    const indicatorAlt = isAtBat ? 'At bat' : isOnDeck ? 'On deck' : '';
    const indicatorHtml = indicatorSrc
      ? `<img class="lineup-indicator ${indicatorClass}" src="${indicatorSrc}" alt="${indicatorAlt}" />`
      : '';

    const li = document.createElement('li');
    li.className = rowClass;
    li.dataset.playerId = Number.isFinite(Number(entry.id)) && Number(entry.id) > 0 ? String(entry.id) : '';
    li.dataset.team = teamCode;
    li.innerHTML = `
      <span class="lineup-slot">${entry.slot}</span>
      <span class="lineup-name" title="${entry.fullName}">
        ${indicatorHtml}
        <span class="lineup-name-text">${entry.name}</span>
      </span>
      <span class="lineup-pos">${entry.position || ''}</span>
      <span class="lineup-avg">AVG ${entry.avg || '---'}</span>
      <span class="lineup-today">${entry.today || 'No PA yet'}</span>
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

  card.addEventListener('click', () => animateScoreChange(card, game.awayColor, false));

  card.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    animateScoreChange(card, game.homeColor, true);
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
  const trackedPlayersByGame = trackedBetMap(latestRenderedGames.length ? latestRenderedGames : [game]);
  const trackedForGame = trackedPlayersByGame.get(String(game.gamePk));
  const isTrackedAtBat = trackedForGame && trackedForGame.has(String(game.activeBatterId || ''));
  card.classList.toggle('bet-watch', Boolean(isTrackedAtBat));

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

  card.querySelector('.away').textContent = game.away;
  card.querySelector('.home').textContent = game.home;
  card.querySelector('.away').style.color = awayText;
  card.querySelector('.home').style.color = homeText;
  card.querySelector('.away-score').textContent = game.awayScore;
  card.querySelector('.home-score').textContent = game.homeScore;
  card.querySelector('.away-score').style.color = awayText;
  card.querySelector('.home-score').style.color = homeText;

  setLogo(card.querySelector('.away-logo'), game.awayLogo, `${game.away} logo`);
  setLogo(card.querySelector('.home-logo'), game.homeLogo, `${game.home} logo`);

  const awayMatchupEl = card.querySelector('.away-matchup');
  const homeMatchupEl = card.querySelector('.home-matchup');
  awayMatchupEl.textContent = matchupLineForSide(game, 'away');
  homeMatchupEl.textContent = matchupLineForSide(game, 'home');
  awayMatchupEl.style.color = awayText;
  homeMatchupEl.style.color = homeText;
  card.querySelector('.score-mini-inning').textContent = game.inningShort;
  const lastPlayEl = card.querySelector('.score-mini-last-play');
  lastPlayEl.textContent = game.lastPlay || 'Awaiting first pitch';
  setupOverflowMarquee(awayMatchupEl);
  setupOverflowMarquee(homeMatchupEl);
  setupOverflowMarquee(lastPlayEl);

  renderScoreStateStrip(card, game);

  const prev = previousState.get(game.gamePk);
  const awayRuns = Number(game.awayScore);
  const homeRuns = Number(game.homeScore);
  if (prev) {
    if (Number.isFinite(awayRuns) && awayRuns > prev.awayRuns) {
      animateScoreChange(card, game.awayColor, game.currentEvent === 'Home Run');
      flashHomePlate(card);
    } else if (Number.isFinite(homeRuns) && homeRuns > prev.homeRuns) {
      animateScoreChange(card, game.homeColor, game.currentEvent === 'Home Run');
      flashHomePlate(card);
    }
  }

  previousState.set(game.gamePk, {
    awayRuns: Number.isFinite(awayRuns) ? awayRuns : 0,
    homeRuns: Number.isFinite(homeRuns) ? homeRuns : 0,
  });
}

function removeStaleCards(games) {
  const keep = new Set(games.map((g) => String(g.gamePk)));
  for (const card of gamesEl.querySelectorAll('.game-card')) {
    if (!keep.has(card.dataset.gamePk)) {
      previousState.delete(Number(card.dataset.gamePk));
      card.remove();
    }
  }
}

async function loadGames() {
  const selectedDate = dateInput.value || formatDate(new Date());
  const cached = getCachedGames();
  const archived = getArchivedGames(selectedDate);
  const mergedCached = mergeCardsWithArchive(cached, archived);
  const cachedByTeams = new Map(mergedCached.map((game) => [gameMatchKey(game.away, game.home), game]));
  try {
    let { cards, homeRuns } = await fetchGamesAndHomeRuns(selectedDate);
    cards = mergeCardsWithArchive(cards.map(normalizeCompletedCard), archived);
    const existingEmpty = gamesEl.querySelector('.empty');
    if (existingEmpty) existingEmpty.remove();

    if (!cards.length) {
      cards = await fetchMlbFallbackCards(selectedDate, cachedByTeams);
      cards = mergeCardsWithArchive(cards.map(normalizeCompletedCard), archived);
    }

    if (cards.length) {
      saveCachedGames(cards);
      saveArchivedGames(selectedDate, cards);
      latestRenderedGames = cards;
      for (const game of cards) upsertCard(game);
      removeStaleCards(cards);
      renderActiveLineupOverlay(cards);
      renderBetList(cards);
      renderHomeRunFeed(homeRuns);
      return;
    }

    if (archived.length) {
      const archivedCards = archived.map(normalizeCompletedCard);
      saveCachedGames(archivedCards);
      latestRenderedGames = archivedCards;
      for (const game of archivedCards) upsertCard(game);
      removeStaleCards(archivedCards);
      renderActiveLineupOverlay(archivedCards);
      renderBetList(archivedCards);
      renderHomeRunFeed([]);
      return;
    }

    const latestDate = latestArchiveDate(selectedDate);
    if (latestDate) {
      const latestArchive = getArchivedGames(latestDate).map(normalizeCompletedCard);
      if (latestArchive.length) {
        latestRenderedGames = latestArchive;
        for (const game of latestArchive) upsertCard(game);
        removeStaleCards(latestArchive);
        renderActiveLineupOverlay(latestArchive);
        renderBetList(latestArchive);
        renderHomeRunFeed([]);
        return;
      }
    }

    gamesEl.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = `No games for ${selectedDate}.`;
    gamesEl.appendChild(empty);
    latestRenderedGames = [];
    renderBetList([]);
    renderHomeRunFeed([]);
  } catch (error) {
    const fallbackCards = await fetchMlbFallbackCards(selectedDate, cachedByTeams);
    const normalizedFallback = mergeCardsWithArchive(fallbackCards.map(normalizeCompletedCard), archived);
    if (normalizedFallback.length) {
      saveCachedGames(normalizedFallback);
      saveArchivedGames(selectedDate, normalizedFallback);
      latestRenderedGames = normalizedFallback;
      for (const game of normalizedFallback) upsertCard(game);
      removeStaleCards(normalizedFallback);
      renderActiveLineupOverlay(normalizedFallback);
      renderBetList(normalizedFallback);
      renderHomeRunFeed([]);
      return;
    }

    if (mergedCached.length) {
      const normalizedCached = mergedCached.map(normalizeCompletedCard);
      latestRenderedGames = normalizedCached;
      for (const game of normalizedCached) upsertCard(game);
      removeStaleCards(normalizedCached);
      renderActiveLineupOverlay(normalizedCached);
      renderBetList(normalizedCached);
      renderHomeRunFeed([]);
      return;
    }

    if (archived.length) {
      const normalizedArchived = archived.map(normalizeCompletedCard);
      latestRenderedGames = normalizedArchived;
      for (const game of normalizedArchived) upsertCard(game);
      removeStaleCards(normalizedArchived);
      renderActiveLineupOverlay(normalizedArchived);
      renderBetList(normalizedArchived);
      renderHomeRunFeed([]);
      return;
    }

    const latestDate = latestArchiveDate(selectedDate);
    if (latestDate) {
      const latestArchive = getArchivedGames(latestDate).map(normalizeCompletedCard);
      if (latestArchive.length) {
        latestRenderedGames = latestArchive;
        for (const game of latestArchive) upsertCard(game);
        removeStaleCards(latestArchive);
        renderActiveLineupOverlay(latestArchive);
        renderBetList(latestArchive);
        renderHomeRunFeed([]);
        return;
      }
    }

    gamesEl.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = `Could not load MLB data (${error.message}).`;
    gamesEl.appendChild(empty);
    latestRenderedGames = [];
    renderBetList([]);
    renderHomeRunFeed([]);
  }
}

dateInput.addEventListener('change', () => {
  closeLineupOverlay();
  clearDraftBetSlip();
  renderBetList();
  renderGoalTracker(true);
  renderHomeRunFeed([]);
  loadGames();
});

compactExistingStorage();
initThemePicker();
initLineupOverlay();
initMovables();
initBetInput();
initGoalTracker();
renderHomeRunFeed([]);
loadGames();
setInterval(() => {
  const selectedDate = dateInput.value || formatDate(new Date());
  if (selectedDate !== formatDate(new Date())) return;
  loadGames();
}, 15000);
