# OwenTools NFL Game Center: As-Built Reference

Last audited 2026-08-07. This is the NFL counterpart to `../fast-skeleton/BASEBALL_TOOL_WRITEUP.md`.

## Entrypoint and files

Open `index.html`. `app.js` contains state, ESPN access, normalization, rendering, matchup calculations, local persistence, and interactions. `styles.css` contains the complete responsive presentation. The tool was moved intact from `../fast-skeleton/nfl-dashboard/` into this root-level `nfl/` directory so it sits beside `../mlb/`.

No build step or server is required, although a local HTTP server is preferable because browser privacy rules can restrict API requests from `file://` pages.

## Data sources and honesty boundary

The live shell uses ESPN's public NFL site and core endpoints for schedules, scores, game summaries, play-by-play, team information, standings, leaders, team rosters, player box-score rows, positions, and season totals. Pregame personnel additionally uses nflverse's timestamped depth charts and week-level rosters. The order is nflverse depth chart, nflverse weekly roster, ESPN team roster, then game participants.

ESPN does **not** expose authoritative snap-by-snap coverage responsibility in these payloads. Therefore:

- Yellow `Projected—not charted` pairings are orientation aids based on available listed positions/order. They must not be interpreted as shadow assignments.
- Green `Imported / charted` rows are user-supplied coverage observations.
- The UI never silently combines a projection with verified coverage history.
- Blank data remains blank or is labeled unavailable; it is not fabricated.

Verified coverage can come from a licensed charting provider, a manually reviewed film log, or another source the user has permission to use. The `source` column preserves provenance.

## Major pages

### Scoreboard

- MLB-style custom calendar with flexible typed dates and month/year navigation.
- A selected NFL week is visibly highlighted from Thursday through Monday. Tuesday and Wednesday map forward to the coming Thursday slate.
- Previous/next controls and keyboard arrows move exactly one NFL week.
- Automatic fallback to the most recent slate when a selected date has no games.
- Pregame, live, and final status; score, clock, possession/state, venue, broadcast, odds, and quarter scoring.
- Watch list and team-pick/bet-slip interaction.
- Game dialogs with Depth Charts, WR vs Secondary, Player Stats, and Team Stats tabs.

### Teams

- League teams, records, win percentage, points for/against, differential, streak, and sortable columns.
- Division grouping can be toggled and persists locally.
- Standings are merged with aggregates calculated from season games when a source is incomplete.

### Leaders

- Passing, rushing, receiving, and defensive leader groups.
- Regular-season/postseason selection.
- Season-scoreboard aggregation provides a fallback when the leader endpoint is unavailable.

### WR vs Secondary

The Coverage Lab is game-scoped and has two layers.

**Projected personnel**

- Loads timestamp-appropriate nflverse depth charts, the selected NFL week's nflverse roster, live ESPN team rosters, and game-summary participants in a verified fallback chain.
- Identifies WR/TE participants and CB/DB/S/FS/SS participants from available position data.
- Labels every player with the source's specific position, including alignments such as LWR/RWR and LCB/RCB/NB when available.
- Pregame depth views cap each position group at first, second, and third string. Live/final depth views begin with ESPN game participants, attach roster positions, and do not expand back to the full roster.
- String inference prefers published depth rank. When it is absent, position-specific usage breaks ties: WR uses receptions/yards/touchdowns/targets; QB uses attempts/yards/touchdowns; RB uses carries/yards/touchdowns/receptions; defense uses tackles/sacks/interceptions/TFL.
- Game and player overlays provide previous/next buttons and left/right keyboard navigation.
- Displays both offensive directions.
- Pairs players by source-listed role/order only and visibly disclaims shadow-coverage certainty.

**Verified history**

- Filters imported rows to the two teams or exact ESPN game ID.
- Supports all imported meetings, last five meetings, or last three meetings.
- Aggregates a receiver/defender pair across games.
- Displays games, routes, targets, receptions, yards, touchdowns, interceptions, yards per route, and catch rate.
- Preserves alignment, coverage type, IDs, game/date, passer rating, and source in storage/export even when a field is not visible in the compact table.
- Appears both on the dedicated page and inside the game dialog.
- Aggregates receiver production by defender quality (`elite`, `mid`, or `bad`) so a receiver's output against each coverage tier is visible separately.

## Forecasting and quality tiers

- Every clickable player card begins with position-specific forecast signals: QB passing efficiency, RB rushing/receiving efficiency, WR/TE receiving usage, and defensive production.
- Automatic labels are calculated inside the player's positional cohort and shown as a decile. The top two deciles are `elite`, the bottom three are `bad`, and the middle five are `mid`. A player with no usable production remains a clearly provisional mid/D5 instead of receiving a false extreme grade.
- Each card has a persistent manual `elite`, `mid`, `bad`, or `Auto` control. Manual designations override the automatic label and are saved locally.
- Imported receiver/defender observations accept both player tiers and roll up results into `vs elite CB`, `vs mid CB`, and `vs bad CB` splits.
- Run defenses are graded as a unit from opponent rushing yards allowed per game. Ranks 1–8 are `elite`, 25–32 are `bad`, and the remaining teams are `mid`; the exact league rank and yards allowed are displayed in the matchup panel.
- Preseason and Week 1 player cards and imported matchup-history filters intentionally use the previous season. The UI labels that prior-season baseline. Later weeks prefer their current-season context, while the bundled verified 2025 run-defense table is explicitly labeled as a fallback when necessary.

## Coverage import schema

Use the built-in **Download template** button. CSV and JSON are accepted. JSON may be an array of rows or `{ "rows": [...] }`.

| Column | Meaning |
| --- | --- |
| `date` | Observation/game date in `YYYY-MM-DD` form. |
| `game_id` | ESPN event ID when known. Exact IDs take precedence in game filtering. |
| `offense_team`, `defense_team` | Team abbreviations. Normalized to uppercase. |
| `receiver`, `receiver_id` | Receiver display name and optional stable provider ID. |
| `receiver_tier` | Optional `elite`, `mid`, or `bad` designation at observation time. |
| `defender`, `defender_id` | Primary defender display name and optional stable provider ID. |
| `defender_tier` | Optional `elite`, `mid`, or `bad` designation at observation time. |
| `receiver_alignment` | Examples: `wide-left`, `wide-right`, `slot`, `inline`. |
| `coverage_type` | Examples: `man`, `zone`, `press-man`, `off-man`; use the source's definition. |
| `routes` | Charted routes against this defender. |
| `targets`, `receptions`, `yards` | Target production credited to this pairing. |
| `touchdowns`, `interceptions` | Scoring and turnover results credited to this pairing. |
| `passer_rating` | Optional passer rating when targeted, as defined by the source. |
| `source` | Provider, film log, or dataset provenance. |

Rows require receiver, defender, offense team, defense team, and either date or game ID. Imports are normalized, invalid rows are rejected, and exact duplicate records are collapsed. Data is stored under `nfl-game-center:v1:coverageRows`. Export creates a versioned JSON backup. Clearing requires browser confirmation.

## Persistence

All state is browser-local under the `nfl-game-center:v1` prefix. Persisted systems include selected page/date, watched games, bet slip, team grouping/sort, selected matchup, and imported coverage history. There is no account or cloud synchronization yet; export coverage data before clearing site storage or moving browsers.

## Refresh and fallback behavior

`loadAll()` loads the selected scoreboard, regular/postseason games, teams, standings, leaders, and touchdown plays in parallel where possible. Team aggregates and leaders can be reconstructed from season games. A Coverage Lab selection lazily loads only that game's summary and caches it for the session. Game dialog loading reuses the same source family and enriches player positions/stats through the ESPN core API.

## Known limits and next data upgrades

- Pregame ESPN summaries may lack complete personnel; projected rows improve closer to kickoff or after box-score participants exist.
- Box-score participants are not the same as an official depth chart or inactive list.
- True route alignment, shadow rate, targets in coverage, separation, motion, press rate, and coverage shell require charted play data. The import model is the supported bridge for these fields/results.
- Team-abbreviation changes and provider-specific player names are safest when stable player IDs and ESPN game IDs are supplied.
- Imported totals inherit the charting provider's attribution rules. Avoid mixing providers in one aggregate unless their definitions match.

## Verification checklist

1. Open a known NFL game date and confirm scoreboard cards load.
2. Open a game and switch among all four detail tabs.
3. Open WR vs Secondary and change game and history window.
4. Download the CSV template, import it, and confirm the row is labeled verified and appears for the matching teams.
5. Export JSON, clear with confirmation, reimport the JSON, and confirm totals are unchanged.
6. Confirm projections remain labeled projected and are never shown in the verified table.
7. Test narrow/mobile layout and horizontal table scrolling.
8. Run a JavaScript syntax check in an environment with Node (`node --check nfl/app.js`) before publishing.
