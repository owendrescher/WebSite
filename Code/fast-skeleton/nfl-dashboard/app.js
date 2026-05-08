const API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
const CORE_BASE = 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl';
const STORAGE_PREFIX = 'nfl-game-center:v1';
const nflAthleteProfileCache = new Map();

const els = {
  slateLabel: document.getElementById('slateLabel'),
  statusBar: document.getElementById('statusBar'),
  dateInput: document.getElementById('dateInput'),
  prevWeekBtn: document.getElementById('prevWeekBtn'),
  nextWeekBtn: document.getElementById('nextWeekBtn'),
  prevDayBtn: document.getElementById('prevDayBtn'),
  nextDayBtn: document.getElementById('nextDayBtn'),
  todayBtn: document.getElementById('todayBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  refreshTdBtn: document.getElementById('refreshTdBtn'),
  gamesGrid: document.getElementById('gamesGrid'),
  gameTemplate: document.getElementById('gameCardTemplate'),
  teamsTableWrap: document.getElementById('teamsTableWrap'),
  divisionToggle: document.getElementById('divisionToggle'),
  leadersGrid: document.getElementById('leadersGrid'),
  leaderSeasonType: document.getElementById('leaderSeasonType'),
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
};

const state = {
  page: localStorage.getItem(key('page')) || 'scoreboard',
  selectedDate: localStorage.getItem(key('date')) || todayValue(),
  snappedDate: false,
  games: [],
  teams: [],
  leaders: {},
  seasonGames: [],
  touchdowns: [],
  watched: readJson(key('watched'), []),
  slip: readJson(key('slip'), []),
  groupDivisions: readJson(key('groupDivisions'), true),
  teamSort: readJson(key('teamSort'), { key: 'winPct', dir: 'desc' }),
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
  const [year, month, day] = String(value || todayValue()).split('-').map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return new Date();
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function addDays(value, days) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

function longDate(value) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(parseDate(value));
}

function seasonForDate(value) {
  const date = parseDate(value);
  return date.getMonth() >= 2 ? date.getFullYear() : date.getFullYear() - 1;
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
  return {
    id: String(team.id || comp.id || ''),
    uid: team.uid || '',
    abbrev: team.abbreviation || team.shortDisplayName || 'NFL',
    name: team.displayName || team.name || team.location || 'Team',
    shortName: team.shortDisplayName || team.abbreviation || 'Team',
    score: comp?.score ?? '0',
    winner: Boolean(comp?.winner),
    record: recordText(comp),
    logo: teamLogo(team),
    color: teamColor(team),
    alternateColor: teamColor({ color: team.alternateColor }, '#0d2035'),
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
  url.searchParams.set('dates', compactDate(state.selectedDate));
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
    .map((team) => ({
      id: String(team.id || ''),
      abbrev: team.abbreviation || team.shortDisplayName || '',
      name: team.displayName || team.name || '',
      shortName: team.shortDisplayName || team.name || '',
      division: team.groups?.name || team.group?.name || team.division || 'NFL',
      logo: teamLogo(team),
      color: teamColor(team),
      alternateColor: teamColor({ color: team.alternateColor }, '#0d2035'),
      links: team.links || [],
      record: team.record?.items?.[0]?.summary || team.record?.summary || '--',
    }));
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
  renderTeams();
  renderLeaders();
  renderBetSlip();
  renderWatchList();
  renderSlateNotes();
  renderTouchdownFeed();
  populatePropOptions();
}

function renderTabs() {
  document.querySelectorAll('[data-page]').forEach((button) => {
    const active = button.dataset.page === state.page;
    button.classList.toggle('active', active);
    document.getElementById(`${button.dataset.page}Page`)?.classList.toggle('active', active);
  });
}

function renderScoreboard() {
  els.gamesGrid.replaceChildren();
  if (!state.games.length) {
    els.gamesGrid.innerHTML = `<div class="empty">No NFL games loaded for ${escapeHtml(longDate(state.selectedDate))}. Try a Sunday, Monday, Thursday, or playoff date.</div>`;
    return;
  }
  for (const game of state.games) {
    const node = els.gameTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.gameId = game.id;
    node.style.setProperty('--away-color', game.away.color);
    node.style.setProperty('--home-color', game.home.color);
    node.style.setProperty('--game-accent', game.home.color);
    node.style.setProperty('--ghost-logo', `url("${game.home.logo || game.away.logo}")`);
    node.querySelector('.game-meta').innerHTML = `<span>${escapeHtml(statusText(game))}</span><span>${escapeHtml(game.broadcast || game.venue || '')}</span>`;
    node.querySelector('.madden-scoreboard').innerHTML = gameScoreboardHtml(game);
    node.querySelectorAll('.team-row').forEach((row) => {
      row.dataset.pickable = 'true';
      const selected = state.slip.some((item) => item.type === 'team' && item.gameId === game.id && item.side === row.dataset.side);
      row.classList.toggle('is-selected', selected);
    });
    node.querySelector('.game-state-strip').innerHTML = stateStripHtml(game);
    node.querySelector('.game-card-footer').textContent = footerText(game);
    const watchBtn = node.querySelector('.watch-btn');
    watchBtn.classList.toggle('active', state.watched.includes(game.id));
    watchBtn.textContent = state.watched.includes(game.id) ? '*' : '+';
    watchBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleWatch(game.id);
    });
    node.querySelectorAll('.team-row').forEach((row) => {
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
  if (duplicate) {
    state.slip = state.slip.filter((item) => item !== duplicate);
  } else {
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
}

function toggleWatch(gameId) {
  const id = String(gameId);
  state.watched = state.watched.includes(id) ? state.watched.filter((item) => item !== id) : [...state.watched, id];
  writeJson(key('watched'), state.watched);
  renderScoreboard();
  renderWatchList();
}

async function openGameDialog(gameId) {
  const game = state.games.find((item) => item.id === String(gameId));
  if (!game) return;
  els.gameDialogBody.innerHTML = gameDialogLoadingHtml(game);
  els.gameDialog.showModal();
  try {
    const summary = await getJson(`${API_BASE}/summary?event=${encodeURIComponent(game.id)}`);
    enrichGameFromSummary(game, summary);
    await hydrateGamePlayerProfiles(summary?.boxscore || {}, game);
    els.gameDialogBody.innerHTML = gameDialogHtml(game, summary);
  } catch {
    els.gameDialogBody.innerHTML = gameDialogHtml(game, null);
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
    const profile = await fetchNflAthleteSeasonProfile(id, seasonForDate(game?.date || state.selectedDate)).catch(() => null);
    if (profile) Object.assign(athlete, profile);
  }));
}

async function fetchNflAthleteSeasonProfile(id, season) {
  const cacheKey = `${id}:${season}`;
  if (nflAthleteProfileCache.has(cacheKey)) return nflAthleteProfileCache.get(cacheKey);
  const promise = (async () => {
    const [profile, stats] = await Promise.all([
      getJson(`${CORE_BASE}/athletes/${encodeURIComponent(id)}?lang=en&region=us`).catch(() => null),
      getJson(`${CORE_BASE}/seasons/${encodeURIComponent(season)}/types/2/athletes/${encodeURIComponent(id)}/statistics?lang=en&region=us`).catch(() => null),
    ]);
    const positionRef = profile?.position?.$ref || '';
    const position = profile?.position?.abbreviation || profile?.position?.displayName || (positionRef ? await getJson(positionRef).then((pos) => pos.abbreviation || pos.displayName || pos.name || '').catch(() => '') : '');
    return {
      position,
      seasonStats: flattenNflSeasonStats(stats),
    };
  })();
  nflAthleteProfileCache.set(cacheKey, promise);
  return promise;
}

function flattenNflSeasonStats(payload) {
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

function gameDialogHtml(game, summary) {
  const box = summary?.boxscore || {};
  return `
    <div class="dialog-head">
      <div><span class="eyebrow">${escapeHtml(statusText(game))}</span><h2>${escapeHtml(game.name)}</h2></div>
      <button type="button" data-dialog-close>x</button>
    </div>
    <section class="madden-dialog-panel">
      <div class="madden-dialog-tabs" role="tablist" aria-label="Game detail tabs">
        <button type="button" class="active" data-game-detail-tab="depth">Depth Charts</button>
        <button type="button" data-game-detail-tab="players">Player Stats</button>
        <button type="button" data-game-detail-tab="teams">Team Stats</button>
      </div>
      <div class="game-detail-tab-panel active" data-game-detail-panel="depth">
        ${dialogDepthChartsHtml(game, box)}
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

function dialogDepthChartsHtml(game, box) {
  const playerGroups = box?.players || [];
  const away = depthChartForTeam(playerGroups, game.away);
  const home = depthChartForTeam(playerGroups, game.home);
  return `
    <div class="depth-matchup-toggle" role="tablist" aria-label="Depth chart matchup">
      <button type="button" class="active" data-depth-matchup="away">${escapeHtml(game.away.abbrev)} O vs ${escapeHtml(game.home.abbrev)} D</button>
      <button type="button" data-depth-matchup="home">${escapeHtml(game.home.abbrev)} O vs ${escapeHtml(game.away.abbrev)} D</button>
    </div>
    <div class="depth-chart-grid active" data-depth-matchup-panel="away">
      ${depthMatchupHtml(game.away, away.offense, game.home, home.defense)}
    </div>
    <div class="depth-chart-grid" data-depth-matchup-panel="home">
      ${depthMatchupHtml(game.home, home.offense, game.away, away.defense)}
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
    offense: [...buckets.offense.values()].slice(0, 12),
    defense: [...buckets.defense.values()].slice(0, 12),
  };
}

function depthMatchupHtml(offenseTeam, offenseRows, defenseTeam, defenseRows) {
  const enrichedOffense = enrichDepthRowsWithAverages(offenseRows);
  const enrichedDefense = enrichDepthRowsWithAverages(defenseRows);
  return `
    <section class="depth-team" style="--team-accent:${escapeHtml(offenseTeam.color)}">
      <header>
        <img src="${escapeHtml(offenseTeam.logo)}" alt="" />
        <div><strong style="color:${escapeHtml(readableTeamColor(offenseTeam.color))}">${escapeHtml(offenseTeam.abbrev)} Offense</strong><span>season/game stats vs ${escapeHtml(defenseTeam.abbrev)} defense</span></div>
      </header>
      <div class="matchup-read">
        ${matchupReadHtml(offenseTeam, defenseTeam)}
      </div>
      <div class="depth-lanes">
        <div><span class="eyebrow">${escapeHtml(offenseTeam.abbrev)} Offense</span>${enrichedOffense.length ? enrichedOffense.map((player) => depthPlayerRowHtml(player)).join('') : '<div class="empty">Offensive data unavailable.</div>'}</div>
        <div><span class="eyebrow">${escapeHtml(defenseTeam.abbrev)} Defense</span>${enrichedDefense.length ? enrichedDefense.map((player) => depthPlayerRowHtml(player)).join('') : '<div class="empty">Defensive data unavailable.</div>'}</div>
      </div>
    </section>
  `;
}

function depthPlayerRowHtml(player) {
  const statText = dedupeDepthStats(player.stats).slice(0, 4).map((stat) => {
    const delta = Number(stat.delta);
    const deltaText = Number.isFinite(delta) && delta > 0 ? ` (+${formatCompactNumber(delta)} vs avg)` : '';
    return `${stat.label}: ${stat.value}${deltaText}`;
  }).join(' | ');
  return `
    <div class="depth-player">
      <span>${escapeHtml(player.position || '-')}</span>
      <strong>${escapeHtml(player.name)}</strong>
      <em>${escapeHtml(statText || 'Season data unavailable')}</em>
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

function matchupReadHtml(team, opponent) {
  const rows = [
    ['Pass', statLookup(team.stats, ['netPassingYards', 'passing yards']), statLookup(opponent.stats, ['netPassingYards', 'passing yards'])],
    ['Rush', statLookup(team.stats, ['rushingYards', 'rushing yards']), statLookup(opponent.stats, ['rushingYards', 'rushing yards'])],
    ['TO', statLookup(team.stats, ['turnovers']), statLookup(opponent.stats, ['takeaways', 'turnovers'])],
  ];
  return rows.map(([label, teamValue, oppValue]) => `<span><b>${escapeHtml(label)}</b><em>Off ${escapeHtml(teamValue)}</em><em>Def ${escapeHtml(oppValue)}</em></span>`).join('');
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
  if (!silent) els.statusBar.textContent = `Loading ${longDate(state.selectedDate)} NFL slate...`;
  els.dateInput.value = state.selectedDate;
  localStorage.setItem(key('date'), state.selectedDate);
  try {
    let scoreboard = await fetchScoreboard();
    if (!scoreboard.games.length) {
      const snapDate = await findMostRecentSlateDate(state.selectedDate).catch(() => state.selectedDate);
      if (snapDate && snapDate !== state.selectedDate) {
        state.selectedDate = snapDate;
        state.snappedDate = true;
        els.dateInput.value = state.selectedDate;
        localStorage.setItem(key('date'), state.selectedDate);
        scoreboard = { games: await fetchScoreboardForDate(state.selectedDate), raw: null };
      } else {
        state.snappedDate = false;
      }
    } else {
      state.snappedDate = false;
    }

    const season = seasonForDate(state.selectedDate);
    const [regularGames, playoffGames, teamsSource, standingsSource] = await Promise.all([
      fetchSeasonScoreboard(season, '2').catch(() => []),
      fetchSeasonScoreboard(season, '3').catch(() => []),
      fetchTeams().catch(() => []),
      fetchStandings(season).catch(() => new Map()),
    ]);
    state.games = scoreboard.games;
    state.seasonGames = [...regularGames, ...playoffGames];
    const aggregateStandings = aggregateTeamStatsFromGames(state.seasonGames.length ? state.seasonGames : state.games);
    const teams = teamsSource.length ? teamsSource : teamsFromGames(state.seasonGames.length ? state.seasonGames : state.games);
    const standings = standingsSource.size ? standingsSource : aggregateStandings;
    state.teams = mergeStandings(teams, standings);
    state.leaders = await fetchLeaders(els.leaderSeasonType.value).catch(() => leadersFromGames(state.seasonGames.length ? state.seasonGames : state.games));
    state.touchdowns = await fetchTouchdownsForSlate(state.games).catch(() => []);
    els.slateLabel.textContent = `${state.games.length} games | ${longDate(state.selectedDate)}`;
    els.statusBar.textContent = state.snappedDate
      ? `No games on the requested date. Showing the most recent NFL slate: ${longDate(state.selectedDate)}.`
      : `Loaded ${state.games.length} games for ${longDate(state.selectedDate)}.`;
    renderAll();
  } catch (error) {
    els.statusBar.textContent = `Could not load NFL data: ${error.message}`;
    renderAll();
  }
}

function setPage(page) {
  state.page = page;
  localStorage.setItem(key('page'), page);
  renderTabs();
}

function bindEvents() {
  document.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => setPage(button.dataset.page));
  });
  els.dateInput.addEventListener('change', () => {
    state.selectedDate = els.dateInput.value || todayValue();
    loadAll();
  });
  els.prevDayBtn.addEventListener('click', () => {
    state.selectedDate = addDays(state.selectedDate, -1);
    loadAll();
  });
  els.nextDayBtn.addEventListener('click', () => {
    state.selectedDate = addDays(state.selectedDate, 1);
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
    state.selectedDate = todayValue();
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
  });
  els.clearSlipBtn.addEventListener('click', () => {
    state.slip = [];
    writeJson(key('slip'), state.slip);
    renderBetSlip();
    renderScoreboard();
  });
  els.gameDialog.addEventListener('click', (event) => {
    const depthTab = event.target.closest('[data-depth-matchup]');
    if (depthTab) {
      event.preventDefault();
      const value = depthTab.dataset.depthMatchup;
      els.gameDialog.querySelectorAll('[data-depth-matchup]').forEach((button) => button.classList.toggle('active', button === depthTab));
      els.gameDialog.querySelectorAll('[data-depth-matchup-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.depthMatchupPanel === value));
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
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      state.selectedDate = addDays(state.selectedDate, -1);
      loadAll();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      state.selectedDate = addDays(state.selectedDate, 1);
      loadAll();
    }
    if (event.key.toLowerCase() === 'r') loadAll({ silent: true });
  });
}

bindEvents();
setPage(state.page);
loadAll();
