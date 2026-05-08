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

const betFormEl = document.getElementById('betForm');
const betDescEl = document.getElementById('betDesc');
const betOddsEl = document.getElementById('betOdds');
const betAmountEl = document.getElementById('betAmount');
const betListEl = document.getElementById('betList');
const betDayLabelEl = document.getElementById('betDayLabel');
const clearBetsBtn = document.getElementById('clearBetsBtn');
const hrListEl = document.getElementById('hrList');

const previousState = new Map();
let currentLineupView = 'lineups';
const PANEL_LAYOUT_KEY = 'panel-layout:v1';
const THEME_KEY = 'overlay-theme:v1';
const LINEUP_OPEN_KEY = 'lineup-open:v2';
const ESPN_SCOREBOARD_URL = 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard';
const ESPN_SUMMARY_URL = 'https://site.web.api.espn.com/apis/site/v2/sports/baseball/mlb/summary';

const THEMES = [
  { value: 'current', label: 'Current' },
  { value: 'baseball-retro', label: 'Baseball Retro' },
  { value: 'emerald-diamond', label: 'Emerald Diamond' },
  { value: 'black-ice', label: 'Black Ice' },
  { value: 'paper-scorebook', label: 'Paper Scorebook' },
];

const TEAM_COLORS = {
  ARI: '#E3D4AD', ATL: '#CE1141', BAL: '#DF4601', BOS: '#BD3039', CHC: '#7FB8FF',
  CWS: '#E6EDF7', CIN: '#C6011F', CLE: '#E31937', COL: '#C4B6E2', DET: '#5DA9FF',
  HOU: '#EB6E1F', KC: '#7EC3FF', LAA: '#BA0021', LAD: '#4FA3FF', MIA: '#00A3E0',
  MIL: '#FFC52F', MIN: '#8AB8FF', NYM: '#4DA3FF', NYY: '#AFC8EF', ATH: '#4FD38E',
  PHI: '#E81828', PIT: '#FDB827', SD: '#C7A86A', SEA: '#4FD2BD', SF: '#FD5A1E',
  STL: '#C41E3A', TB: '#7EB3FF', TEX: '#5EA5FF', TOR: '#6DB4FF', WSH: '#AB0003'
};

const TEAM_LOGOS = {
  ARI: 'Diamondbacks.png', ATL: 'Braves.png', BAL: 'Orioles.png', BOS: 'RedSox.png', CHC: 'Cubs.png',
  CWS: 'WhiteSox.png', CIN: 'Reds.png', CLE: 'Guardians.png', COL: 'Rockies.png', DET: 'Tigers.png',
  HOU: 'Astros.png', KC: 'Royals.png', LAA: 'Angels.png', LAD: 'Dodgers.png', MIA: 'Marlins.png',
  MIL: 'Brewers.png', MIN: 'Twins.png', NYM: 'Mets.png', NYY: 'Yankees.png', ATH: 'Athletics.png',
  PHI: 'Phillies.png', PIT: 'Pirates.png', SD: 'Padres.png', SEA: 'Mariners.png', SF: 'Giants.png',
  STL: 'Cardinals.png', TB: 'Rays.png', TEX: 'Rangers.png', TOR: 'BlueJays.png', WSH: 'Nationals.png'
};

const formatDate = (d) => d.toISOString().slice(0, 10);
dateInput.value = formatDate(new Date());

function storageKey(prefix) {
  return `${prefix}:${dateInput.value || formatDate(new Date())}`;
}

function gameCacheKey() {
  return storageKey('games');
}

function getPanelLayouts() {
  return JSON.parse(localStorage.getItem(PANEL_LAYOUT_KEY) || '{}');
}

function savePanelLayouts(layouts) {
  localStorage.setItem(PANEL_LAYOUT_KEY, JSON.stringify(layouts));
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
  localStorage.setItem(storageKey('bets'), JSON.stringify(bets));
}

function getCachedGames() {
  return JSON.parse(localStorage.getItem(gameCacheKey()) || '[]');
}

function saveCachedGames(games) {
  localStorage.setItem(gameCacheKey(), JSON.stringify(games));
}

function getOpenLineupGamePk() {
  return localStorage.getItem(storageKey(LINEUP_OPEN_KEY)) || '';
}

function saveOpenLineupGamePk(gamePk) {
  if (!gamePk) localStorage.removeItem(storageKey(LINEUP_OPEN_KEY));
  else localStorage.setItem(storageKey(LINEUP_OPEN_KEY), String(gamePk));
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
  localStorage.setItem(THEME_KEY, allowed);
  themeSelectEl.value = allowed;
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

function formatPitcherLine(player, fallbackName) {
  return `${pitchCount(player)} ${lastName(player?.person?.fullName || fallbackName)}`;
}

function formatBatterLine(player, fallbackName) {
  return `${battingOrderValue(player)} ${lastName(player?.person?.fullName || fallbackName)} ${battingAverage(player)}`;
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

function compactDate(date) {
  return date.replace(/-/g, '');
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
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Request failed ${r.status}`);
  return r.json();
}

function hexToRgb(hex) {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const num = Number.parseInt(full, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

function eventLabel(play) {
  const batterName = play?.matchup?.batter?.fullName || 'Unknown';
  const shortName = batterName.split(' ').slice(-1)[0];
  const event = play?.result?.event || play?.result?.eventType || 'Play';
  const description = play?.result?.description || '';
  if (event === 'Home Run') return `${shortName} HR`;
  if (event.includes('Strikeout')) return `${shortName} K`;
  const shorthand = description.match(/\bP\d{1,2}\b/i)?.[0];
  if (shorthand) return `${shortName} ${shorthand.toUpperCase()}`;
  return `${shortName} ${event}`;
}

function statusLine(game) {
  const st = game?.status?.abstractGameState;
  if (st === 'Preview') return `Not Started • ${estTime(game.gameDate)} EST`;
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
  let awayHitter = '- - ---';
  let homeHitter = '- - ---';

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

function shortPosition(player) {
  return player?.position?.abbreviation || player?.position?.code || player?.allPositions?.[0]?.abbreviation || '';
}

function buildLineup(players, activeBatterId) {
  const bySlot = new Map();
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

function mergeFinishedGameState(card, cached) {
  if (!cached) return card;
  return {
    ...card,
    awayPitcher: cached.awayPitcher || card.awayPitcher,
    homePitcher: cached.homePitcher || card.homePitcher,
    awayHitter: cached.awayHitter || card.awayHitter,
    homeHitter: cached.homeHitter || card.homeHitter,
    ticker: cached.ticker?.length ? cached.ticker : card.ticker,
    balls: cached.balls ?? card.balls,
    strikes: cached.strikes ?? card.strikes,
    outs: cached.outs ?? card.outs,
    bases: cached.bases || card.bases,
    lineup: cached.lineup || card.lineup,
    pitching: cached.pitching || card.pitching,
  };
}

function resolveActivePlay(game, currentPlay, allPlays) {
  if (game?.status?.abstractGameState === 'Final' && allPlays.length) return allPlays[allPlays.length - 1];
  if (currentPlay?.matchup) return currentPlay;
  if (allPlays.length) return allPlays[allPlays.length - 1];
  return game?.status?.abstractGameState === 'Final' ? null : currentPlay || null;
}

function renderBetList() {
  betDayLabelEl.textContent = dateInput.value;
  const bets = getBets();
  betListEl.replaceChildren();
  for (const b of bets) {
    const el = document.createElement('div');
    el.className = 'panel-item bet-item';
    el.innerHTML = `
      <div class="bet-text">${b.desc} | ${b.odds} | $${b.amount.toFixed(2)} -> $${b.payout.toFixed(2)}</div>
      <button class="bet-delete-btn" type="button" data-bet-id="${b.id}">X</button>
    `;
    betListEl.appendChild(el);
  }
}

function initBetInput() {
  renderBetList();
  clearBetsBtn.addEventListener('pointerdown', (e) => e.stopPropagation());

  betFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = betDescEl.value.trim();
    const odds = betOddsEl.value.trim();
    const amount = Number(betAmountEl.value);
    if (!desc || !odds || !Number.isFinite(amount) || amount <= 0) return;

    const payout = oddsToPayout(odds, amount);
    if (!Number.isFinite(payout) || payout <= 0) return;

    const bets = getBets();
    bets.unshift({ id: String(Date.now()), desc, odds, amount, payout, ts: Date.now() });
    saveBets(bets);

    betFormEl.reset();
    renderBetList();
  });

  clearBetsBtn.addEventListener('click', () => {
    saveBets([]);
    renderBetList();
  });

  betListEl.addEventListener('click', (e) => {
    const button = e.target.closest('[data-bet-id]');
    if (!button) return;
    saveBets(getBets().filter((bet) => bet.id !== button.dataset.betId));
    renderBetList();
  });
}

async function fetchGamesAndHomeRuns(date) {
  const scheduleUrl = new URL('https://statsapi.mlb.com/api/v1/schedule');
  scheduleUrl.searchParams.set('sportId', '1');
  scheduleUrl.searchParams.set('date', date);
  scheduleUrl.searchParams.set('gameTypes', 'S,E,R');

  const schedule = await getJson(scheduleUrl.toString());
  const games = schedule?.dates?.[0]?.games || [];
  const homeRuns = [];
  const cachedCards = new Map(getCachedGames().map((card) => [card.gamePk, card]));

  const cards = await Promise.all(games.map(async (game) => {
    const gamePk = game.gamePk;
    const live = await getJson(`https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`);
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

    const awayPlayers = live?.liveData?.boxscore?.teams?.away?.players || {};
    const homePlayers = live?.liveData?.boxscore?.teams?.home?.players || {};

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
      currentEvent: activePlay?.result?.event || '',
      activeBatterId: activePlay?.matchup?.batter?.id || null,
      battingSide: ppl.battingSide,
      lineup: (() => {
        const away = buildLineup(awayPlayers, activePlay?.matchup?.batter?.id);
        const home = buildLineup(homePlayers, activePlay?.matchup?.batter?.id);
        return {
          away,
          home,
          awayBench: buildBench(awayPlayers, away),
          homeBench: buildBench(homePlayers, home),
        };
      })(),
      pitching: {
        away: buildPitchingStaff(
          awayPlayers,
          ppl.battingSide === 'home' ? activePlay?.matchup?.pitcher?.id : game?.teams?.away?.probablePitcher?.id,
          game?.teams?.away?.probablePitcher,
        ),
        home: buildPitchingStaff(
          homePlayers,
          ppl.battingSide === 'away' ? activePlay?.matchup?.pitcher?.id : game?.teams?.home?.probablePitcher?.id,
          game?.teams?.home?.probablePitcher,
        ),
      },
    };

    if (game?.status?.abstractGameState === 'Final') {
      card = mergeFinishedGameState(card, cachedCards.get(gamePk));
    }

    return card;
  }));

  homeRuns.sort((a, b) => b.gamePk - a.gamePk || b.order - a.order);
  localStorage.setItem(storageKey('hrs'), JSON.stringify(homeRuns.slice(0, 120)));
  saveCachedGames(cards);
  return { cards, homeRuns };
}

async function fetchEspnFallbackCards(date, cachedCards) {
  try {
    const scoreboard = await getJson(`${ESPN_SCOREBOARD_URL}?dates=${compactDate(date)}`);
    const events = scoreboard?.events || [];
    if (!events.length) return [];

    const cards = await Promise.all(events.map(async (event) => {
      const competition = event?.competitions?.[0] || {};
      const competitors = competition?.competitors || [];
      const away = competitors.find((c) => c.homeAway === 'away');
      const home = competitors.find((c) => c.homeAway === 'home');
      const awayAbbrev = away?.team?.abbreviation || 'AWAY';
      const homeAbbrev = home?.team?.abbreviation || 'HOME';
      const cached = cachedCards.get(gameMatchKey(awayAbbrev, homeAbbrev)) || null;

      let summary = null;
      try {
        summary = await getJson(`${ESPN_SUMMARY_URL}?event=${event.id}`);
      } catch {}

      const plays = summary?.plays || [];
      const lastPlay = plays.length ? plays[plays.length - 1] : null;
      const detail = event?.status?.type?.detail || event?.status?.type?.description || 'Unknown';

      return {
        ...(cached || {}),
        gamePk: cached?.gamePk || Number(event.id) || `${awayAbbrev}${homeAbbrev}`,
        away: awayAbbrev,
        home: homeAbbrev,
        awayScore: away?.score ?? cached?.awayScore ?? '-',
        homeScore: home?.score ?? cached?.homeScore ?? '-',
        status: event?.status?.type?.description || cached?.status || 'Unknown',
        inning: cached?.inning || detail,
        inningShort: cached?.inningShort || detail,
        awayColor: cached?.awayColor || getTeamColor(awayAbbrev),
        homeColor: cached?.homeColor || getTeamColor(homeAbbrev),
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
        ticker: lastPlay?.text ? [{ text: lastPlay.text, color: cached?.ticker?.[0]?.color || '#cddfff' }] : (cached?.ticker || []),
        currentEvent: cached?.currentEvent || '',
        lineup: cached?.lineup || { away: [], home: [], awayBench: [], homeBench: [] },
        pitching: cached?.pitching || { away: { current: null, bullpen: [] }, home: { current: null, bullpen: [] } },
      };
    }));

    return cards;
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
    item.innerHTML = `
      <img class="hr-logo" src="${hr.teamLogo || 'placeholder.png'}" alt="${hr.teamAbbr || 'team'}" />
      <div>
        <div class="hr-name" style="color:${hr.teamColor || '#dbebff'}">${hr.batter} #${hr.jersey ?? '?'}</div>
        <div>${hr.hrNo ? `HR #${hr.hrNo}` : 'HR'}${hr.distance ? ` • ${hr.distance} ft` : ''}</div>
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
  return labels.length ? labels.join(' • ') : 'Bases empty';
}

function countSummaryText(game) {
  return `B ${game.balls} • S ${game.strikes} • O ${game.outs}`;
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
    currentEl.innerHTML = current ? `
      <div class="pitching-card-label">Current Pitcher</div>
      <div class="pitching-card-name" style="color:${color}">${current.fullName}</div>
      <div class="pitching-card-meta">WHIP ${current.whip} • ERA ${current.era}</div>
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
    li.innerHTML = `
      <div class="bullpen-main">
        <span class="bullpen-name" style="color:${color}">${arm.fullName}</span>
        <span class="bullpen-meta">WHIP ${arm.whip} • ERA ${arm.era}</span>
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
  card.querySelector('.base.first').classList.toggle('on', bases.first);
  card.querySelector('.base.second').classList.toggle('on', bases.second);
  card.querySelector('.base.third').classList.toggle('on', bases.third);
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
    panel.hidden = panel.dataset.lineupPanel !== currentLineupView;
  }
}

function renderBenchList(listEl, bench, color) {
  listEl.replaceChildren();
  if (!bench?.length) {
    const empty = document.createElement('div');
    empty.className = 'lineup-empty';
    empty.textContent = 'No bench data yet';
    listEl.appendChild(empty);
    return;
  }

  for (const entry of bench) {
    const li = document.createElement('li');
    li.className = 'bench-item';
    li.innerHTML = `
      <span class="bench-name" title="${entry.fullName}" style="color:${color}">${entry.name}</span>
      <span class="bench-pos">${entry.position || ''}</span>
      <span class="bench-avg">AVG ${entry.avg || '---'}</span>
      <span class="bench-today">${entry.today || 'No PA yet'}</span>
    `;
    listEl.appendChild(li);
  }
}

function syncLineupOverlay(game) {
  const open = game && isLineupOpen(game.gamePk);
  lineupOverlayEl.hidden = !open;
  lineupOverlayEl.classList.toggle('open', Boolean(open));
  if (!open) return;

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

  setLogo(lineupOverlayEl.querySelector('.away-lineup-logo'), game.awayLogo, `${game.away} logo`);
  setLogo(lineupOverlayEl.querySelector('.home-lineup-logo'), game.homeLogo, `${game.home} logo`);

  const awayTeamEl = lineupOverlayEl.querySelector('.away-lineup-team');
  const homeTeamEl = lineupOverlayEl.querySelector('.home-lineup-team');
  awayTeamEl.textContent = game.away;
  homeTeamEl.textContent = game.home;
  awayTeamEl.style.color = game.awayColor;
  homeTeamEl.style.color = game.homeColor;

  renderLineupList(lineupOverlayEl.querySelector('.away-lineup-list'), game.lineup?.away || [], game.awayColor);
  renderLineupList(lineupOverlayEl.querySelector('.home-lineup-list'), game.lineup?.home || [], game.homeColor);
  renderBenchList(lineupOverlayEl.querySelector('.away-bench-list'), game.lineup?.awayBench || [], game.awayColor);
  renderBenchList(lineupOverlayEl.querySelector('.home-bench-list'), game.lineup?.homeBench || [], game.homeColor);
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
  for (const btn of lineupViewBtns) {
    btn.addEventListener('click', () => setLineupView(btn.dataset.lineupView));
  }
  setLineupView('lineups');
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lineupOverlayEl.hidden) closeLineupOverlay();
  });
}

function renderLineupList(listEl, lineup, color) {
  listEl.replaceChildren();
  if (!lineup?.length) {
    const empty = document.createElement('div');
    empty.className = 'lineup-empty';
    empty.textContent = 'Awaiting confirmed lineup';
    listEl.appendChild(empty);
    return;
  }

  for (const entry of lineup) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="lineup-slot">${entry.slot}</span>
      <span class="lineup-name" title="${entry.fullName}">
        <span class="lineup-bat${entry.isActive ? ' active' : ''}" aria-hidden="true"></span>
        <span class="lineup-name-text">${entry.name}</span>
      </span>
      <span class="lineup-pos">${entry.position || ''}</span>
      <span class="lineup-avg">AVG ${entry.avg || '---'}</span>
      <span class="lineup-today">${entry.today || 'No PA yet'}</span>
    `;
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

  card.querySelector('.away').textContent = game.away;
  card.querySelector('.home').textContent = game.home;
  card.querySelector('.away').style.color = game.awayColor;
  card.querySelector('.home').style.color = game.homeColor;
  card.querySelector('.away-score').textContent = game.awayScore;
  card.querySelector('.home-score').textContent = game.homeScore;
  card.querySelector('.away-score').style.color = game.awayColor;
  card.querySelector('.home-score').style.color = game.homeColor;

  setLogo(card.querySelector('.away-logo'), game.awayLogo, `${game.away} logo`);
  setLogo(card.querySelector('.home-logo'), game.homeLogo, `${game.home} logo`);

  card.querySelector('.away-pitcher').textContent = game.awayPitcher;
  card.querySelector('.home-pitcher').textContent = game.homePitcher;
  card.querySelector('.away-hitter').textContent = game.awayHitter;
  card.querySelector('.home-hitter').textContent = game.homeHitter;
  card.querySelector('.away-pitcher').style.color = game.awayColor;
  card.querySelector('.away-hitter').style.color = game.awayColor;
  card.querySelector('.home-pitcher').style.color = game.homeColor;
  card.querySelector('.home-hitter').style.color = game.homeColor;
  card.querySelector('.inning-badge').textContent = game.inningShort;
  card.querySelector('.status').textContent = `${game.status} | ${game.inning}`;

  renderScoreStateStrip(card, game);
  renderBases(card, game.bases);
  renderCountDots(card.querySelector('.balls-dots'), 4, game.balls, 'ball');
  renderCountDots(card.querySelector('.strikes-dots'), 3, game.strikes, 'strike');
  renderCountDots(card.querySelector('.outs-dots'), 3, game.outs, 'out');

  const ticker = card.querySelector('.ticker');
  ticker.replaceChildren();
  for (const item of game.ticker.length ? game.ticker : [{ text: 'Awaiting first pitch', color: '#cddfff' }]) {
    const li = document.createElement('li');
    li.textContent = item.text;
    li.style.color = item.color;
    ticker.appendChild(li);
  }


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
  const cached = getCachedGames();
  const cachedByTeams = new Map(cached.map((game) => [gameMatchKey(game.away, game.home), game]));
  try {
    let { cards, homeRuns } = await fetchGamesAndHomeRuns(dateInput.value || formatDate(new Date()));
    const existingEmpty = gamesEl.querySelector('.empty');
    if (existingEmpty) existingEmpty.remove();

    if (!cards.length) {
      cards = await fetchEspnFallbackCards(dateInput.value, cachedByTeams);
    }

    if (cards.length) {
      for (const game of cards) upsertCard(game);
      removeStaleCards(cards);
      renderActiveLineupOverlay(cards);
      renderHomeRunFeed(homeRuns);
      return;
    }

    gamesEl.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = `No games for ${dateInput.value}.`;
    gamesEl.appendChild(empty);
    renderHomeRunFeed([]);
  } catch (error) {
    const fallbackCards = await fetchEspnFallbackCards(dateInput.value || formatDate(new Date()), cachedByTeams);
    if (fallbackCards.length) {
      for (const game of fallbackCards) upsertCard(game);
      removeStaleCards(fallbackCards);
      renderActiveLineupOverlay(fallbackCards);
      renderHomeRunFeed([]);
      return;
    }

    if (cached.length) {
      for (const game of cached) upsertCard(game);
      removeStaleCards(cached);
      renderActiveLineupOverlay(cached);
      renderHomeRunFeed([]);
      return;
    }

    gamesEl.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = `Could not load MLB data (${error.message}).`;
    gamesEl.appendChild(empty);
    renderHomeRunFeed([]);
  }
}

dateInput.addEventListener('change', () => {
  closeLineupOverlay();
  renderBetList();
  renderHomeRunFeed([]);
  loadGames();
});

initThemePicker();
initLineupOverlay();
initMovables();
initBetInput();
renderHomeRunFeed([]);
loadGames();
setInterval(loadGames, 15000);
