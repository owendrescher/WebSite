const MLB_API = 'https://statsapi.mlb.com/api/v1';
const MLB_LIVE_API = 'https://statsapi.mlb.com/api/v1.1';
const CACHE_TTL_MS = 20_000;
const DETAIL_TTL_MS = 12_000;
const REQUEST_TIMEOUT_MS = 8_000;

const TEAM_LOGOS = {
  ARI: 'Diamondbacks.png',
  ATL: 'Braves.png',
  BAL: 'Orioles.png',
  BOS: 'RedSox.png',
  CHC: 'Cubs.png',
  CHW: 'WhiteSox.png',
  CIN: 'Reds.png',
  CLE: 'Guardians.png',
  COL: 'Rockies.png',
  DET: 'Tigers.png',
  HOU: 'Astros.png',
  KC: 'Royals.png',
  LAA: 'Angels.png',
  LAD: 'Dodgers.png',
  MIA: 'Marlins.png',
  MIL: 'Brewers.png',
  MIN: 'Twins.png',
  NYM: 'Mets.png',
  NYY: 'Yankees.png',
  ATH: 'Athletics.png',
  PHI: 'Phillies.png',
  PIT: 'Pirates.png',
  SD: 'Padres.png',
  SEA: 'Mariners.png',
  SF: 'Giants.png',
  STL: 'Cardinals.png',
  TB: 'Rays.png',
  TEX: 'Rangers.png',
  TOR: 'BlueJays.png',
  WSH: 'Nationals.png',
};

const TEAM_CANONICAL = {
  OAK: 'ATH',
  ATH: 'ATH',
  AZ: 'ARI',
  ARZ: 'ARI',
  CWS: 'CHW',
  WSH: 'WSH',
  WAS: 'WSH',
  SFG: 'SF',
  SDP: 'SD',
  TBR: 'TB',
  KCR: 'KC',
};

const state = {
  date: formatDate(new Date()),
  games: [],
  selectedGamePk: '',
  detailAbort: null,
};

const elements = {
  summary: document.getElementById('summary'),
  loadState: document.getElementById('loadState'),
  dateInput: document.getElementById('dateInput'),
  controls: document.getElementById('controls'),
  games: document.getElementById('games'),
  detailPanel: document.getElementById('detailPanel'),
};

class RequestScheduler {
  constructor({ concurrency = 4 } = {}) {
    this.concurrency = concurrency;
    this.active = 0;
    this.queue = [];
  }

  run(task, { priority = 0 } = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.pump();
    });
  }

  pump() {
    while (this.active < this.concurrency && this.queue.length) {
      const item = this.queue.shift();
      this.active += 1;
      Promise.resolve()
        .then(item.task)
        .then(item.resolve, item.reject)
        .finally(() => {
          this.active -= 1;
          this.pump();
        });
    }
  }
}

class ApiCache {
  constructor(scheduler) {
    this.scheduler = scheduler;
    this.memory = new Map();
  }

  async json(url, options = {}) {
    const now = Date.now();
    const cached = this.memory.get(url);
    const ttl = Number(options.ttlMs) || CACHE_TTL_MS;
    if (cached && now - cached.ts < ttl) return cached.value;
    if (cached?.promise) return cached.promise;

    const promise = this.scheduler.run(
      () => fetchJson(url, options),
      { priority: options.priority || 0 },
    ).then((value) => {
      this.memory.set(url, { ts: Date.now(), value });
      return value;
    }).catch((error) => {
      if (cached?.value) return cached.value;
      this.memory.delete(url);
      throw error;
    });

    this.memory.set(url, { ...(cached || {}), promise });
    return promise;
  }

  peek(url) {
    return this.memory.get(url)?.value || null;
  }
}

const scheduler = new RequestScheduler({ concurrency: 5 });
const api = new ApiCache(scheduler);

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function canonicalTeam(value) {
  const code = String(value || '').trim().toUpperCase();
  return TEAM_CANONICAL[code] || code;
}

function logoPath(teamCode) {
  const logo = TEAM_LOGOS[canonicalTeam(teamCode)];
  return logo ? `../Logos/${logo}` : '../placeholder.png';
}

function statNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatRecord(teamNode) {
  const record = teamNode?.leagueRecord || teamNode?.record || {};
  const wins = Number(record.wins);
  const losses = Number(record.losses);
  return Number.isFinite(wins) && Number.isFinite(losses) ? `${wins}-${losses}` : '';
}

function gameStatus(game) {
  const detailed = String(game?.status?.detailedState || '').trim();
  const coded = String(game?.status?.codedGameState || '').toUpperCase();
  if (/cancel|postpon|suspend|delay|makeup/i.test(detailed) || ['C', 'D'].includes(coded)) {
    return detailed || 'Game status unavailable';
  }
  const abstract = game?.status?.abstractGameState;
  if (abstract === 'Preview') return `${startTime(game.gameDate)} EST`;
  if (abstract === 'Final') return 'Final';
  return detailed || 'Live';
}

function startTime(value) {
  if (!value) return 'Scheduled';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  }).format(new Date(value));
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || REQUEST_TIMEOUT_MS);
  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    options.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function scheduleUrl(date) {
  const url = new URL(`${MLB_API}/schedule`);
  url.searchParams.set('sportId', '1');
  url.searchParams.set('date', date);
  url.searchParams.set('gameTypes', 'S,E,R');
  url.searchParams.set('hydrate', 'team,probablePitcher,linescore');
  return url.toString();
}

function liveUrl(gamePk) {
  return `${MLB_LIVE_API}/game/${gamePk}/feed/live`;
}

function playerStatsUrl(playerId, group, date) {
  const url = new URL(`${MLB_API}/people/${playerId}/stats`);
  url.searchParams.set('stats', 'gameLog');
  url.searchParams.set('group', group);
  url.searchParams.set('season', String(date).slice(0, 4));
  url.searchParams.set('gameType', 'R');
  return url.toString();
}

async function loadSchedule(date) {
  setLoadState('Loading schedule');
  const data = await api.json(scheduleUrl(date), { priority: 10, ttlMs: 15_000 });
  const games = (data?.dates?.[0]?.games || [])
    .map(normalizeScheduleGame)
    .sort(sortGamesChronologically);
  state.games = games;
  renderGames(games);
  setLoadState('Ready');
  elements.summary.textContent = `${games.length} games | ${date}`;
}

function gameSortTime(game) {
  const parsed = Date.parse(game?.gameDate || '');
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

function sortGamesChronologically(a, b) {
  const timeDiff = gameSortTime(a) - gameSortTime(b);
  if (timeDiff) return timeDiff;
  return (Number(a?.gameNumber) || 1) - (Number(b?.gameNumber) || 1)
    || String(a?.away?.code || '').localeCompare(String(b?.away?.code || ''))
    || String(a?.home?.code || '').localeCompare(String(b?.home?.code || ''));
}

function normalizeScheduleGame(game) {
  const away = game?.teams?.away || {};
  const home = game?.teams?.home || {};
  const awayCode = canonicalTeam(away.team?.abbreviation || away.team?.teamCode);
  const homeCode = canonicalTeam(home.team?.abbreviation || home.team?.teamCode);
  return {
    gamePk: String(game.gamePk),
    gameDate: game.gameDate,
    gameNumber: game.gameNumber || 1,
    status: game.status || {},
    away: {
      code: awayCode,
      name: away.team?.teamName || away.team?.name || awayCode,
      record: formatRecord(away),
      score: away.score ?? '-',
      probable: away.probablePitcher || null,
    },
    home: {
      code: homeCode,
      name: home.team?.teamName || home.team?.name || homeCode,
      record: formatRecord(home),
      score: home.score ?? '-',
      probable: home.probablePitcher || null,
    },
    summary: gameStatus(game),
  };
}

function renderGames(games) {
  elements.games.replaceChildren();
  if (!games.length) {
    const empty = document.createElement('div');
    empty.className = 'detail-empty';
    empty.textContent = 'No games found.';
    elements.games.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const game of games) {
    const button = document.createElement('button');
    button.className = `game-card${state.selectedGamePk === game.gamePk ? ' active' : ''}`;
    button.type = 'button';
    button.dataset.gamePk = game.gamePk;
    button.innerHTML = gameCardHtml(game);
    button.addEventListener('click', () => selectGame(game.gamePk));
    fragment.appendChild(button);
  }
  elements.games.appendChild(fragment);
}

function gameCardHtml(game) {
  return `
    ${teamRowHtml(game.away)}
    ${teamRowHtml(game.home)}
    <div class="game-meta">
      <span>${escapeHtml(game.summary)}</span>
      <span>${escapeHtml(game.away.probable?.fullName || game.home.probable?.fullName ? 'Probables loaded' : 'Details on demand')}</span>
    </div>
  `;
}

function teamRowHtml(team) {
  return `
    <div class="team-row">
      <img src="${logoPath(team.code)}" alt="${escapeHtml(team.code)} logo" />
      <span class="team-name">
        <strong>${escapeHtml(team.code)}</strong>
        <span>${escapeHtml(team.name)}</span>
        <em class="team-record">${escapeHtml(team.record)}</em>
      </span>
      <span class="score">${escapeHtml(team.score)}</span>
    </div>
  `;
}

async function selectGame(gamePk) {
  state.selectedGamePk = String(gamePk);
  renderGames(state.games);
  if (state.detailAbort) state.detailAbort.abort();
  const abort = new AbortController();
  state.detailAbort = abort;
  const game = state.games.find((item) => item.gamePk === String(gamePk));
  renderDetailShell(game);

  try {
    const live = await api.json(liveUrl(gamePk), {
      priority: 20,
      ttlMs: DETAIL_TTL_MS,
      signal: abort.signal,
    });
    if (abort.signal.aborted) return;
    renderGameDetail(game, normalizeLiveGame(live, game));
  } catch (error) {
    if (abort.signal.aborted) return;
    renderDetailError(game, error);
  }
}

function renderDetailShell(game) {
  elements.detailPanel.innerHTML = `
    <div class="detail-content">
      <div class="detail-title">
        <h2>${escapeHtml(game.away.code)} @ ${escapeHtml(game.home.code)}</h2>
        <span>Loading live details</span>
      </div>
      <div class="detail-loading">Fetching boxscore, lineup, and current pitcher...</div>
    </div>
  `;
}

function normalizeLiveGame(live, fallbackGame) {
  const box = live?.liveData?.boxscore || {};
  const linescore = live?.liveData?.linescore || {};
  const currentPlay = live?.liveData?.plays?.currentPlay || {};
  const allPlays = live?.liveData?.plays?.allPlays || [];
  const activePlay = currentPlay?.matchup ? currentPlay : allPlays[allPlays.length - 1] || null;
  const half = String(linescore.inningHalf || activePlay?.about?.halfInning || '').toLowerCase();
  const fieldingSide = half.includes('bottom') ? 'away' : half.includes('top') ? 'home' : '';
  const currentPitcherId = latestPitcherId(box, fieldingSide) || Number(linescore?.defense?.pitcher?.id) || Number(activePlay?.matchup?.pitcher?.id) || null;
  const unavailableStatus = gameStatus(live?.gameData || fallbackGame);
  const inning = /cancel|postpon|suspend|delay|makeup/i.test(unavailableStatus)
    ? unavailableStatus
    : (linescore.currentInningOrdinal || fallbackGame.summary);

  return {
    game: fallbackGame,
    state: {
      inning,
      half,
      balls: linescore.balls ?? activePlay?.count?.balls ?? 0,
      strikes: linescore.strikes ?? activePlay?.count?.strikes ?? 0,
      outs: linescore.outs ?? activePlay?.count?.outs ?? 0,
      lastPlay: activePlay?.result?.description || 'Awaiting play data',
      currentPitcherId,
      fieldingSide,
    },
    away: normalizeTeamDetail(box.teams?.away, fallbackGame.away, currentPitcherId, allPlays),
    home: normalizeTeamDetail(box.teams?.home, fallbackGame.home, currentPitcherId, allPlays),
    homeRuns: homeRunsFromPlays(allPlays, fallbackGame),
  };
}

function latestPitcherId(boxscore, side) {
  const ids = boxscore?.teams?.[side]?.pitchers || [];
  for (let i = ids.length - 1; i >= 0; i -= 1) {
    const id = Number(ids[i]);
    if (Number.isFinite(id) && boxscore?.teams?.[side]?.players?.[`ID${id}`]) return id;
  }
  return null;
}

function normalizeTeamDetail(rawTeam = {}, fallbackTeam, currentPitcherId, allPlays = []) {
  const players = rawTeam.players || {};
  const battingOrder = rawTeam.battingOrder || rawTeam.batters || [];
  const lineup = battingOrder
    .map((id, index) => normalizePlayer(players[`ID${id}`], index + 1))
    .filter(Boolean);
  const pitchers = (rawTeam.pitchers || [])
    .map((id) => normalizePlayer(players[`ID${id}`], null))
    .filter(Boolean);
  return {
    ...fallbackTeam,
    lineup,
    pitchers,
    currentPitcher: pitchers.find((player) => Number(player.id) === Number(currentPitcherId)) || null,
    pitchingHistory: pitchingHistoryForTeam(rawTeam, allPlays),
  };
}

function normalizePlayer(player, slot) {
  if (!player?.person?.id) return null;
  const batting = player.stats?.batting || {};
  const pitching = player.stats?.pitching || {};
  return {
    id: player.person.id,
    slot,
    name: player.person.fullName || 'Unknown',
    position: player.position?.abbreviation || player.position?.code || '',
    batting: {
      hits: statNumber(batting.hits),
      atBats: statNumber(batting.atBats),
      walks: statNumber(batting.baseOnBalls ?? batting.walks),
      strikeOuts: statNumber(batting.strikeOuts),
      homeRuns: statNumber(batting.homeRuns),
    },
    pitching: {
      ip: pitching.inningsPitched || '0.0',
      pitches: statNumber(pitching.pitchesThrown ?? pitching.numberOfPitches),
      strikeOuts: statNumber(pitching.strikeOuts),
      walks: statNumber(pitching.baseOnBalls ?? pitching.walks),
      earnedRuns: statNumber(pitching.earnedRuns),
      hits: statNumber(pitching.hits),
      era: player.seasonStats?.pitching?.era || '---',
      whip: player.seasonStats?.pitching?.whip || '---',
    },
  };
}

function playTimestampMs(play, fallback = 0) {
  const events = Array.isArray(play?.playEvents) ? [...play.playEvents].reverse() : [];
  const candidates = [
    play?.about?.endTime,
    play?.about?.startTime,
    ...events.flatMap((event) => [event?.endTime, event?.startTime]),
  ].filter(Boolean);
  for (const value of candidates) {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return Number(fallback) || 0;
}

function easternClock(timestampMs) {
  if (!Number.isFinite(Number(timestampMs)) || Number(timestampMs) <= 0) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York',
  }).format(new Date(Number(timestampMs)));
}

function pitcherInningsMap(rawTeam = {}, allPlays = []) {
  const players = rawTeam.players || {};
  const inningMap = new Map();
  for (const play of Array.isArray(allPlays) ? allPlays : []) {
    const pitcherId = Number(play?.matchup?.pitcher?.id);
    if (!Number.isFinite(pitcherId) || !players[`ID${pitcherId}`]) continue;
    const inning = Number(play?.about?.inning);
    if (!Number.isFinite(inning) || inning <= 0) continue;
    if (!inningMap.has(pitcherId)) inningMap.set(pitcherId, new Set());
    inningMap.get(pitcherId).add(inning);
  }
  return inningMap;
}

function inningRangeText(innings) {
  const values = [...(innings || new Set())].sort((a, b) => a - b);
  if (!values.length) return '';
  return values.length === 1 ? String(values[0]) : `${values[0]}-${values[values.length - 1]}`;
}

function pitchingHistoryForTeam(rawTeam = {}, allPlays = []) {
  const players = rawTeam.players || {};
  const inningMap = pitcherInningsMap(rawTeam, allPlays);
  return (rawTeam.pitchers || [])
    .map((id) => normalizePlayer(players[`ID${id}`], null))
    .filter(Boolean)
    .filter((pitcher) => pitcher.pitching.ip !== '0.0' || inningMap.has(Number(pitcher.id)))
    .map((pitcher) => ({
      ...pitcher,
      inningsText: inningRangeText(inningMap.get(Number(pitcher.id))),
    }));
}

function homeRunsFromPlays(allPlays = [], game) {
  return (Array.isArray(allPlays) ? allPlays : [])
    .filter((play) => play?.result?.event === 'Home Run')
    .map((play) => {
      const timestampMs = playTimestampMs(play, Date.parse(game?.gameDate || state.date) || 0);
      const half = String(play?.about?.halfInning || '').toLowerCase();
      return {
        batter: play?.matchup?.batter?.fullName || 'Unknown',
        team: half === 'top' ? game?.away?.code : game?.home?.code,
        distance: play?.playEvents?.find((event) => event?.hitData?.totalDistance)?.hitData?.totalDistance || '',
        timestampMs,
        time: easternClock(timestampMs),
      };
    })
    .sort((a, b) => b.timestampMs - a.timestampMs);
}

function renderGameDetail(game, detail) {
  elements.detailPanel.innerHTML = `
    <div class="detail-content">
      <div class="detail-title">
        <h2>${escapeHtml(game.away.code)} @ ${escapeHtml(game.home.code)}</h2>
        <span>${escapeHtml(detail.state.inning)} | B ${detail.state.balls} S ${detail.state.strikes} O ${detail.state.outs}</span>
      </div>
      <div class="subtle">${escapeHtml(detail.state.lastPlay)}</div>
      ${homeRunsSectionHtml(detail.homeRuns)}
      ${pitchingSectionHtml(detail.away, 'Away')}
      ${pitchingSectionHtml(detail.home, 'Home')}
      ${lineupSectionHtml(detail.away)}
      ${lineupSectionHtml(detail.home)}
    </div>
  `;
  hydrateRecentStats(detail);
}

function pitchingSectionHtml(team, label) {
  const current = team.currentPitcher || team.pitchers[team.pitchers.length - 1] || null;
  return `
    <section class="split-section">
      <h3>${escapeHtml(label)} Pitching - ${escapeHtml(team.code)}</h3>
      <div>${current ? pitcherLine(current) : 'Pitcher pending'}</div>
      ${pitchingHistoryHtml(team.pitchingHistory)}
    </section>
  `;
}

function pitcherLine(pitcher) {
  return `${escapeHtml(pitcher.name)} | IP ${escapeHtml(pitcher.pitching.ip)} | ER ${pitcher.pitching.earnedRuns} | BB ${pitcher.pitching.walks} | K ${pitcher.pitching.strikeOuts} | H ${pitcher.pitching.hits}`;
}

function pitchingHistoryHtml(history = []) {
  const items = Array.isArray(history) ? history : [];
  if (!items.length) return '';
  return `
    <details class="pitching-history">
      <summary>Pitching history</summary>
      <ol>
        ${items.map((pitcher) => `
          <li>${escapeHtml(pitcher.name)}${pitcher.inningsText ? ` | Inn ${escapeHtml(pitcher.inningsText)}` : ''} | IP ${escapeHtml(pitcher.pitching.ip)} | ER ${pitcher.pitching.earnedRuns} | BB ${pitcher.pitching.walks} | K ${pitcher.pitching.strikeOuts} | H ${pitcher.pitching.hits}</li>
        `).join('')}
      </ol>
    </details>
  `;
}

function homeRunsSectionHtml(homeRuns = []) {
  const items = Array.isArray(homeRuns) ? homeRuns : [];
  if (!items.length) return '';
  return `
    <section class="split-section">
      <h3>Home Runs</h3>
      <ol class="home-run-list">
        ${items.map((hr) => `
          <li>${escapeHtml(hr.batter)} | ${escapeHtml(hr.team || '')}${hr.distance ? ` | ${escapeHtml(hr.distance)} ft` : ''}${hr.time ? ` | ${escapeHtml(hr.time)} EST` : ''}</li>
        `).join('')}
      </ol>
    </section>
  `;
}

function lineupSectionHtml(team) {
  return `
    <section class="split-section">
      <h3>${escapeHtml(team.code)} Lineup</h3>
      <table class="compact-table">
        <thead>
          <tr><th>#</th><th>Name</th><th>Pos</th><th>Today</th><th>Last 5 games</th></tr>
        </thead>
        <tbody>
          ${team.lineup.map((player) => `
            <tr data-player-id="${player.id}">
              <td>${player.slot}</td>
              <td>${escapeHtml(player.name)}</td>
              <td>${escapeHtml(player.position)}</td>
              <td>AB ${player.batting.atBats} | H ${player.batting.hits} | BB ${player.batting.walks} | K ${player.batting.strikeOuts} | HR ${player.batting.homeRuns}</td>
              <td class="recent-cell">queued</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `;
}

function hydrateRecentStats(detail) {
  const players = [...detail.away.lineup, ...detail.home.lineup];
  for (const player of players) {
    scheduler.run(async () => {
      const stats = await recentHittingSummary(player.id, state.date);
      const row = elements.detailPanel.querySelector(`tr[data-player-id="${player.id}"] .recent-cell`);
      if (row) row.textContent = stats;
    }, { priority: 2 });
  }
}

async function recentHittingSummary(playerId, date) {
  const data = await api.json(playerStatsUrl(playerId, 'hitting', date), {
    ttlMs: 10 * 60_000,
    priority: 1,
  });
  const games = (data?.stats?.[0]?.splits || [])
    .filter((split) => split.date <= date)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 5);
  const totals = games.reduce((sum, split) => {
    const stat = split.stat || {};
    sum.ab += statNumber(stat.atBats);
    sum.h += statNumber(stat.hits);
    sum.bb += statNumber(stat.baseOnBalls ?? stat.walks);
    sum.k += statNumber(stat.strikeOuts);
    sum.hr += statNumber(stat.homeRuns);
    sum.xbh += statNumber(stat.doubles) + statNumber(stat.triples) + statNumber(stat.homeRuns);
    return sum;
  }, { ab: 0, h: 0, bb: 0, k: 0, hr: 0, xbh: 0 });
  const avg = totals.ab > 0 ? (totals.h / totals.ab).toFixed(3).replace(/^0/, '') : '---';
  return `AB ${totals.ab} | H ${totals.h} | AVG ${avg} | XBH ${totals.xbh} | HR ${totals.hr} | BB ${totals.bb} | K ${totals.k}`;
}

function renderDetailError(game, error) {
  elements.detailPanel.innerHTML = `
    <div class="detail-content">
      <div class="detail-title">
        <h2>${escapeHtml(game.away.code)} @ ${escapeHtml(game.home.code)}</h2>
        <span>Details unavailable</span>
      </div>
      <div class="subtle">${escapeHtml(error?.message || 'Unable to load details')}</div>
    </div>
  `;
}

function setLoadState(text) {
  elements.loadState.textContent = text;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function init() {
  elements.dateInput.value = state.date;
  elements.controls.addEventListener('submit', (event) => {
    event.preventDefault();
    state.date = elements.dateInput.value || formatDate(new Date());
    loadSchedule(state.date).catch((error) => {
      setLoadState('Error');
      elements.summary.textContent = error?.message || 'Unable to load schedule';
    });
  });
  loadSchedule(state.date).catch((error) => {
    setLoadState('Error');
    elements.summary.textContent = error?.message || 'Unable to load schedule';
  });
}

init();
