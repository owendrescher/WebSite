# MLB Dashboard Utilities And Data Sources

This is a map of the current active dashboard, the standalone tools in this folder, the updater scripts, and the archived/prototype folders. It focuses on what each utility does, what source it uses, and where that source is wired in.

## Active Entry Points

### `index.html`
- Main overlay-style MLB dashboard.
- Loads:
  - `styles.css`
  - `app.js`
  - `../shared/supabase-config.js`
  - `../shared/owentools-sync.js`
- Main UI: scoreboard, lineup card, player card, leaders, hot players, team stats, HR leaderboard, bet tools, home run feed, goal panels, matchup lab.

### `dashboard.html`
- Game-center layout around the same `app.js`.
- Loads:
  - `styles.css`
  - `dashboard.css`
  - `app.js`
  - `../shared/supabase-config.js`
  - `../shared/owentools-sync.js`
- Same data backbone as `index.html`, but a different page layout.

### `predictions.html`
- Prediction-focused dashboard.
- Loads:
  - `styles.css`
  - `dashboard.css`
  - `predictions.js`
  - `../shared/supabase-config.js`
  - `../shared/owentools-sync.js`
- Adds the predictions page and prediction-specific filters/exports on top of the normal dashboard utilities.

## Main Dashboard Utilities

### Scoreboard / Live Grid
- Files: `app.js`, `predictions.js`, `index.html`, `dashboard.html`, `predictions.html`.
- Sources:
  - MLB schedule: `https://statsapi.mlb.com/api/v1/schedule`
  - MLB live feed: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
  - MLB boxscore: `https://statsapi.mlb.com/api/v1/game/{gamePk}/boxscore`
- Used for:
  - Game list.
  - Official game start time.
  - Scores, innings, bases, count, play ticker.
  - Home/away records and streaks.
  - Live current batter/pitcher after official first pitch time.

### Lineup Card
- Files: `app.js`, `predictions.js`.
- Views:
  - `Lineups`
  - `Pitching`
  - `Roster`
- Sources:
  - MLB live feed: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
  - MLB boxscore: `https://statsapi.mlb.com/api/v1/game/{gamePk}/boxscore`
  - MLB schedule: `https://statsapi.mlb.com/api/v1/schedule`
  - MLB team rosters: `https://statsapi.mlb.com/api/v1/teams/{teamId}/roster`
  - MLB team starting-lineup page: `https://www.mlb.com/{teamSlug}/roster/starting-lineups`
  - MLB probable pitchers page by team/date: `https://www.mlb.com/{teamSlug}/roster/probable-pitchers/{date}`
  - MLB probable pitchers page by team: `https://www.mlb.com/{teamSlug}/roster/probable-pitchers`
  - MLB probable pitchers global page: `https://www.mlb.com/probable-pitchers/{date}`
  - Baseball Savant probable pitchers page: `https://baseballsavant.mlb.com/probable-pitchers`
  - Jina text proxy for MLB pages: `https://r.jina.ai/{sourceUrl}`
- Used for:
  - Actual starting lineups when available.
  - Fallback previous/expected lineups.
  - Probable starter validation.
  - Starter/bullpen/roster cards.
  - Sitting players, injured list, and prospects.

### Roster / Prospects
- Files: `app.js`, `predictions.js`.
- Sources:
  - MLB active/40-man/injury-style roster calls through `https://statsapi.mlb.com/api/v1/teams/{teamId}/roster`
  - MLB prospects pages through Jina:
    - `https://r.jina.ai/https://www.mlb.com/milb/prospects/{teamSlug}`
    - `https://r.jina.ai/https://www.mlb.com/prospects/{season}/{teamSlug}/`
    - `https://r.jina.ai/https://www.mlb.com/milb/prospects/{season}/{teamSlug}`
    - `https://r.jina.ai/https://www.mlb.com/{teamSlug}/prospects/stats/top-prospects`

### Player Card
- Files: `app.js`, `predictions.js`.
- Sources:
  - MLB player profile: `https://statsapi.mlb.com/api/v1/people/{playerId}`
  - MLB player stats: `https://statsapi.mlb.com/api/v1/people/{playerId}/stats`
  - MLB headshots: `https://img.mlbstatic.com/mlb-photos/image/upload/w_106,q_auto:good/v1/people/{playerId}/headshot/67/current`
  - Heatmap CSV:
    - local: `season_data_0401-0520.csv`
    - Supabase public: `https://dzebznhmnrbtzuqogtnt.supabase.co/storage/v1/object/public/mlb-heatmaps/season_data_0401-0520.csv`
- Used for:
  - Batter stat card.
  - Pitcher stat card.
  - Recent form.
  - Heatmap tab.
  - Pitch matchup detail.

### Player Heatmap Tab Inside Player Card
- Files: `app.js`, `predictions.js`.
- Sources:
  - Same heatmap CSV as above.
  - MLB player stats endpoints for missing stat hydration.
  - Baseball Savant pitch-by-pitch summaries:
    - `https://baseballsavant.mlb.com/statcast_search/csv`
    - grouped by pitch type with batter/pitcher lookup query params.
- Used for:
  - Total-bases calendar.
  - Batter pitch breakdown.
  - Pitcher pitch breakdown.
  - Handedness splits and selected-day context.

### League Leaders
- Files: `app.js`, `predictions.js`.
- Sources:
  - MLB teams: `https://statsapi.mlb.com/api/v1/teams`
  - MLB season stats leaderboard: `https://statsapi.mlb.com/api/v1/stats`
  - MLB player headshots: `https://img.mlbstatic.com/mlb-photos/image/upload/w_106,q_auto:good/v1/people/{playerId}/headshot/67/current`
- Categories live in `LEADER_SECTIONS`.
- Covers batting and pitching leaders, with team/position filters and optional opponent context.

### Hot Players
- Files: `app.js`, `predictions.js`.
- Sources:
  - Local analytics index built from MLB live feeds/boxscores.
  - MLB player stat hydration: `https://statsapi.mlb.com/api/v1/people/{playerId}/stats`
  - Baseball Savant pitch data for matchup/pitch strength where needed: `https://baseballsavant.mlb.com/statcast_search/csv`
- Used for:
  - Hot/cold hitter recognition.
  - Recent hard-hit/slugging signals.
  - Pitcher vulnerability markers.

### Team Stats
- Files: `app.js`, `predictions.js`.
- Sources:
  - MLB team stats: `https://statsapi.mlb.com/api/v1/teams/stats`
  - MLB standings: `https://statsapi.mlb.com/api/v1/standings`
  - MLB schedule/boxscore for recent-window stats:
    - `https://statsapi.mlb.com/api/v1/schedule`
    - `https://statsapi.mlb.com/api/v1/game/{gamePk}/boxscore`
- Used for:
  - Team batting/pitching tables.
  - Standings/records.
  - Recent team form.
  - Bullpen stats.

### HR Leaderboard / Home Run Feed
- Files: `app.js`, `predictions.js`.
- Sources:
  - MLB live feed: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
  - MLB player stats/profile when needed:
    - `https://statsapi.mlb.com/api/v1/people/{playerId}`
    - `https://statsapi.mlb.com/api/v1/people/{playerId}/stats`
- Used for:
  - Live home run feed.
  - Pitcher HR allowed context.
  - Batter HR number and rating.
  - Stored per-day HR cache in localStorage.

### Matchup Lab / Matchup Export
- Files: `app.js`, `predictions.js`, `index.html`.
- Sources:
  - MLB schedule: `https://statsapi.mlb.com/api/v1/schedule`
  - MLB live feed: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
  - MLB boxscore: `https://statsapi.mlb.com/api/v1/game/{gamePk}/boxscore`
- Exports:
  - `mlb-matchups-plate-appearances-{range}.csv`
  - `mlb-matchups-summary-{range}.csv`

### Bet Panel / Pending Picks
- Files: `app.js`, `predictions.js`, `index.html`, `dashboard.html`, `predictions.html`.
- Sources:
  - Mostly internal UI state and current game cards.
  - Uses MLB live score data to resolve picked team/game outcomes.
- Storage:
  - localStorage key family: `bets:v2:all`, `pending-game-picks:v1`, legacy `bets:*`.

### Tossup / Pregame Uncertainty Marker
- Files: `app.js`, `predictions.js`, `styles.css`.
- Sources:
  - Internal user marker only.
  - Saved by date in localStorage key family `tossup-scoreboards:v1`.
- UI:
  - `PRE` pill in lineup card before official start time.
  - Bold yellow outline on marked scoreboard.

### Goal Timer / Goal History
- Files: `app.js`, `predictions.js`, `index.html`.
- Sources:
  - No external sports source.
  - localStorage state under `goal-state`.
- Used for:
  - Current goal text.
  - Timer.
  - Completed goal history.

### Layout / Theme / Sync Utilities
- Files:
  - `app.js`, `predictions.js`
  - `../shared/supabase-config.js`
  - `../shared/owentools-sync.js`
- Sources:
  - Supabase JS CDN: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
  - Supabase project: `https://dzebznhmnrbtzuqogtnt.supabase.co`
  - Supabase table: `tool_state`
- Synced state:
  - UI preferences and selected state that pass the sync filters.
- Explicitly not synced:
  - hard-denied cache keys beginning with `games:`, `games-archive:`, `analytics-day:`, `hrs:`.

## Predictions Utilities

### Hitting / Pitching Prediction Pages
- Files: `predictions.html`, `predictions.js`; some functionality also exists in `app.js`.
- Sources:
  - MLB schedule/live/boxscore/player/team endpoints.
  - Baseball Savant Statcast CSV: `https://baseballsavant.mlb.com/statcast_search/csv`
  - Baseball Savant custom leaderboard CSV: `https://baseballsavant.mlb.com/leaderboard/custom`
  - Oddstrader weather: `https://www.oddstrader.com/mlb/weather/`
  - Jina Oddstrader text mirror: `https://r.jina.ai/https://www.oddstrader.com/mlb/weather/`
  - Open-Meteo Archive: `https://archive-api.open-meteo.com/v1/archive`
  - FanGraphs hardcoded seed for one pitcher split:
    - `https://www.fangraphs.com/players/sandy-alcantara/18684/splits?position=P`
- Outputs:
  - Current predictions CSV.
  - Date-range prediction audit CSV.
  - Score-band/validation CSVs in `predictions.js`.

### Moneyline Prediction System
- Files: `predictions.js`, also mirrored in `app.js`.
- Version constant:
  - `moneyline-v4-sos-grouped`
- Sources:
  - MLB schedule: `https://statsapi.mlb.com/api/v1/schedule`
  - MLB boxscore: `https://statsapi.mlb.com/api/v1/game/{gamePk}/boxscore`
  - MLB team stats: `https://statsapi.mlb.com/api/v1/teams/stats`
  - MLB standings: `https://statsapi.mlb.com/api/v1/standings`
  - Locally cached prediction snapshots where available.
- Uses:
  - Team-vs-opponent scoring.
  - Strength-of-schedule adjusted recent-form fields.
  - Grouped upset-category warnings.
- Outputs:
  - `mlb_moneyline_predictions_{date}_{version}.csv`
  - `moneyline_prediction_audit_batch_{range}.csv`

### Weather Model
- Files: `app.js`, `predictions.js`.
- Sources:
  - Oddstrader weather page: `https://www.oddstrader.com/mlb/weather/`
  - Jina mirror: `https://r.jina.ai/https://www.oddstrader.com/mlb/weather/`
  - Open-Meteo archive API: `https://archive-api.open-meteo.com/v1/archive`
- Internal static data:
  - `PREDICTION_STADIUM_WIND_MODELS`
  - `PREDICTION_STADIUM_COORDINATES`
- Used for:
  - Temperature.
  - Wind direction and strength.
  - Park/stadium weather context.
  - Roof/controlled-weather handling.

### Baseball Savant Pitch And Spray Data
- Files: `app.js`, `predictions.js`.
- Sources:
  - Pitch type CSV: `https://baseballsavant.mlb.com/statcast_search/csv`
  - Spray leaderboard CSV: `https://baseballsavant.mlb.com/leaderboard/custom`
- Used for:
  - Batter pitch breakdown.
  - Pitcher pitch breakdown.
  - Pitch family/type aggregation.
  - Hard hit, whiff, xwOBA/wOBA, EV, SLG, BAA-like indicators.
  - Pull/straightaway/opposite spray profile.

## Standalone Pages

### `stat-crawler.html`
- Purpose:
  - One-hit dataset crawler.
  - Creates one row per batter/game matchup, with target fields for `hit_1plus`, `full_pa`, `full_ab`, and `full_h`.
  - Preserves exact batter-vs-every-pitcher-faced detail in `pitcher_matchups_json`; this includes starter and bullpen plate appearances separately, so a batter facing the starter early and a reliever late is not collapsed into one starter-only matchup.
  - Builds in-house pregame rolling stats before each game is added to the history stores.
- Sources:
  - MLB schedule: `https://statsapi.mlb.com/api/v1/schedule`
  - MLB live feed/play-by-play: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
  - MLB boxscore fallback: `https://statsapi.mlb.com/api/v1/game/{gamePk}/boxscore`
  - MLB player bio fallback for missing handedness: `https://statsapi.mlb.com/api/v1/people/{playerId}`
- Generated feature layers:
  - Batter usage and expected PA.
  - Batter season/recent/vs-hand hit skill with sample-size columns.
  - Opposing starter hit vulnerability with neutral fallback flags for no prior MLB sample.
  - Opposing bullpen hit environment, recent usage, and left/right mix.
  - Batter pitch-type result history vs pitcher pitch-type allowed history, with pitch-mix sample/fallback fields.
  - Exact same-game pitcher segments for actual starter and every reliever faced.
  - Dedupe and validation reporting for player-game uniqueness, handedness coverage, starter counts, PA/AB consistency, and calibration buckets.
- Outputs:
  - Downloaded CSV, default filename pattern `stat-crawler-{start}-to-{end}.csv`.
  - Downloaded JSON, same rows plus parsed `pitcher_matchups`.

### `player-heatmaps.html`
- Purpose:
  - Workshop page for the heatmap CSV.
  - Calendar visualization by player/date.
  - Pitcher/batter stat panels.
  - Manual and generated CSV updates.
- Sources:
  - Local CSV: `season_data_0401-0520.csv`
  - Supabase public CSV: `https://dzebznhmnrbtzuqogtnt.supabase.co/storage/v1/object/public/mlb-heatmaps/season_data_0401-0520.csv`
  - Optional configured CSV from `window.OWENTOOLS_HEATMAP_CSV_URL`.
  - Derived Supabase CSV from `window.OWENTOOLS_SUPABASE.url`.
  - MLB live feed: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
  - MLB player stats:
    - `https://statsapi.mlb.com/api/v1/people/{playerId}/stats`
  - MLB headshots:
    - `https://img.mlbstatic.com/mlb-photos/image/upload/w_160,q_auto:good/v1/people/{playerId}/headshot/67/current`
  - Local save endpoint when served by `start-heatmaps-server.ps1`:
    - `/api/save-season-csv`
- Also opens the predictions page in a hidden iframe and uses:
  - `window.exportPredictionAuditRangeCsv`
  - `window.downloadTextFile`

### `hr-consistency.html`
- Purpose:
  - Local CSV lab for home-run cadence/pattern consistency.
  - Player detail graph.
- Sources:
  - Local CSV: `season_data_0401-0520.csv`
  - Optional user-uploaded CSV through file input.
- No external network sports API in this page.

### `prediction-study.html`
- Purpose:
  - "Sponge" builder for historical team-game/pregame rows.
  - Builds ranges by date/season.
  - Adds team heat, starter heat, HR/OPS/runs fields, and strength-of-schedule adjusted fields.
- Sources:
  - MLB schedule: `https://statsapi.mlb.com/api/v1/schedule`
  - MLB boxscore: `https://statsapi.mlb.com/api/v1/game/{gamePk}/boxscore`
  - MLB player profile for handedness: `https://statsapi.mlb.com/api/v1/people/{playerId}`
- Outputs:
  - Downloaded CSV, default filename pattern `prediction-sponge-{start}-to-{end}.csv`.
  - Latest generated rows in localStorage key `prediction-study-latest:v1`.

### `intense-sponge.html`
- Purpose:
  - Multi-table "intense sponge" for heavier historical absorption.
  - Builds context from April 1 of the selected start season while outputting only the selected target range.
  - Exports separate tables for games, team-game context, starter context, bullpen context, lineups, player lineup stats, weather/park placeholders, and postgame results.
- Sources:
  - MLB schedule: `https://statsapi.mlb.com/api/v1/schedule`
  - MLB live feed/play-by-play: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
  - MLB boxscore from live feed fallback shape: `https://statsapi.mlb.com/api/v1/game/{gamePk}/boxscore`
  - MLB player bio fallback: `https://statsapi.mlb.com/api/v1/people/{playerId}`
- Populated from MLB data:
  - Game identity, results, first-five runs, extra innings, day/night from start time.
  - Team season-to-date offense, recent windows, home/away, venue, handedness splits, pitch-type splits.
  - Opponent staff pitching, starter workload/form/splits/arsenal, bullpen season/recent/fatigue/top usage arms.
  - Starting lineup slots and player-level season/split/recent/history rows.
  - Postgame batting and opponent starter/bullpen outcomes.
- Explicit placeholders/flags:
  - Weather, park factors, odds, umpire, injury/WAR, public defense, travel miles, and some Statcast-only metrics are exported as blank fields with missing-source flags until those sources are wired in.

## Updater And Local Server Scripts

### `scripts/update-heatmap-csv.mjs`
- Purpose:
  - Automated heatmap CSV updater.
  - Downloads current CSV from Supabase, opens the predictions page with Playwright, exports prediction audit rows, corrects final outcome stat lines from MLB live feed, then uploads merged CSV back to Supabase.
- Dependencies:
  - `@supabase/supabase-js`
  - `playwright`
- Sources:
  - Supabase storage bucket: `mlb-heatmaps`
  - Supabase object path default: `season_data_0401-0520.csv`
  - Supabase project URL from `SUPABASE_URL`.
  - Supabase service role key from `SUPABASE_SERVICE_ROLE_KEY`.
  - MLB live feed correction: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
  - Local browser-served `predictions.html`.
- Environment controls:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_HEATMAP_BUCKET`
  - `SUPABASE_HEATMAP_OBJECT`
  - `HEATMAP_TIME_ZONE`
  - `HEATMAP_START_DATE`
  - `HEATMAP_END_DATE`

### `start-heatmaps-server.ps1`
- Purpose:
  - Local static file server for `player-heatmaps.html`.
  - Adds a POST endpoint for saving the master CSV locally.
- Local endpoints:
  - `http://localhost:{Port}/player-heatmaps.html`
  - `POST /api/save-season-csv`
- Writes:
  - `season_data_0401-0520.csv`

### `open-player-heatmaps.cmd`
- Purpose:
  - Opens the local heatmaps workshop.
- URL:
  - `http://localhost:8765/player-heatmaps.html`

### `install-daily-heatmaps-update-task.ps1`
- Purpose:
  - Installs/schedules the automated daily heatmap updater.
- Uses:
  - The npm script `npm run update:heatmaps`.
  - Environment variables for Supabase and date range behavior.

### `package.json`
- npm script:
  - `update:heatmaps` -> `node scripts/update-heatmap-csv.mjs`
- Dependencies:
  - `@supabase/supabase-js`
  - `playwright`

## Shared Cross-Device Sync

### `../shared/supabase-config.js`
- Project:
  - `https://dzebznhmnrbtzuqogtnt.supabase.co`
- Public heatmap CSV:
  - `https://dzebznhmnrbtzuqogtnt.supabase.co/storage/v1/object/public/mlb-heatmaps/season_data_0401-0520.csv`
- Provides:
  - `window.OWENTOOLS_SUPABASE`

### `../shared/owentools-sync.js`
- Loads Supabase JS from:
  - `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
- Auth:
  - Supabase email/password auth.
- Sync table:
  - `tool_state`
- Operations:
  - `upsert` local state.
  - `select` cloud state.
  - `delete` denied cached keys from cloud.
- Hard-denied cache key families:
  - `games:`
  - `games-archive:`
  - `analytics-day:`
  - `hrs:`

## Local Static Assets

### Logos
- Folder:
  - `Logos/`
- Used by:
  - Scoreboard cards.
  - Lineup cards.
  - Player/stat cards.
  - Team stat pages.

### Default Baseball Icon
- File:
  - `baseball.png`
- Used by:
  - favicon/apple touch icon.

### Heatmap Master CSV
- File:
  - `season_data_0401-0520.csv`
- Used by:
  - Player heatmap tab.
  - `player-heatmaps.html`.
  - `hr-consistency.html`.
  - as local seed fallback for updater.

## Prototype And Archived Folders

### `next/`
- Purpose:
  - Architecture sandbox for a faster rebuild.
- Sources:
  - MLB API base: `https://statsapi.mlb.com/api/v1`
  - MLB live API base: `https://statsapi.mlb.com/api/v1.1`
- Goal from `next/README.md`:
  - Render schedule/live scores first.
  - Hydrate expensive details only when opened.

### `old/`
- Purpose:
  - Archived versions.
- Sources seen there:
  - ESPN scoreboard: `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard`
  - ESPN summary:
    - `https://site.web.api.espn.com/apis/site/v2/sports/baseball/mlb/summary`
    - `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary`
  - MLB schedule: `https://statsapi.mlb.com/api/v1/schedule`
  - MLB live feed: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
  - MLB boxscore/profile endpoints in later archived versions.
- These are not the active production entry points, but they are still present in the repo.

## Duplicate / Legacy Current File

### `predictions.js.js`
- Appears to be an older duplicate of the predictions/dashboard script.
- Sources overlap with `app.js`/`predictions.js`:
  - MLB Stats API.
  - MLB live API.
  - Baseball Savant.
  - Oddstrader.
  - Open-Meteo.
  - Supabase heatmap CSV.
  - Jina text mirrors.
- It is not loaded by `index.html`, `dashboard.html`, or `predictions.html`.

## Source Inventory Summary

### MLB / MLBAM
- `https://statsapi.mlb.com/api/v1`
- `https://statsapi.mlb.com/api/v1.1`
- `https://img.mlbstatic.com/mlb-photos/image/upload/w_106,q_auto:good/v1/people/{playerId}/headshot/67/current`
- `https://img.mlbstatic.com/mlb-photos/image/upload/w_160,q_auto:good/v1/people/{playerId}/headshot/67/current`
- `https://www.mlb.com/{teamSlug}/roster/starting-lineups`
- `https://www.mlb.com/{teamSlug}/roster/probable-pitchers`
- `https://www.mlb.com/{teamSlug}/roster/probable-pitchers/{date}`
- `https://www.mlb.com/probable-pitchers/{date}`
- `https://www.mlb.com/milb/prospects/{teamSlug}`
- `https://www.mlb.com/prospects/{season}/{teamSlug}/`
- `https://www.mlb.com/milb/prospects/{season}/{teamSlug}`
- `https://www.mlb.com/{teamSlug}/prospects/stats/top-prospects`

### Baseball Savant
- `https://baseballsavant.mlb.com/probable-pitchers`
- `https://baseballsavant.mlb.com/statcast_search/csv`
- `https://baseballsavant.mlb.com/leaderboard/custom`

### Weather
- `https://www.oddstrader.com/mlb/weather/`
- `https://archive-api.open-meteo.com/v1/archive`

### Text Proxy
- `https://r.jina.ai/{sourceUrl}`

### Supabase
- Project: `https://dzebznhmnrbtzuqogtnt.supabase.co`
- Heatmap CSV: `https://dzebznhmnrbtzuqogtnt.supabase.co/storage/v1/object/public/mlb-heatmaps/season_data_0401-0520.csv`
- JS CDN: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
- Storage bucket: `mlb-heatmaps`
- Sync table: `tool_state`

### FanGraphs
- Seed link currently present:
  - `https://www.fangraphs.com/players/sandy-alcantara/18684/splits?position=P`

### ESPN, Archived Only
- `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard`
- `https://site.web.api.espn.com/apis/site/v2/sports/baseball/mlb/summary`
- `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary`
