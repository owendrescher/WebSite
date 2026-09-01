# OwenTools NFL Game Center: As-Built Reference

Last audited 2026-09-01. This is the NFL counterpart to `../fast-skeleton/BASEBALL_TOOL_WRITEUP.md`.

## Entrypoint and files

Open `index.html`. `app.js` contains state, ESPN access, normalization, rendering, matchup calculations, local persistence, and interactions. `styles.css` contains the complete responsive presentation. `nfl-evidence-snapshot.js` is a generated, browser-safe fallback containing the latest 2026 roster/depth snapshot plus aggregated 2025 player, snap, team-unit, coverage, pressure, blitz, and scheme-split evidence.

No build step or server is required. The bundled evidence snapshot keeps personnel and ratings available when browser privacy rules block large GitHub release downloads from a `file://` page. It also retains each player's prior team and listed position so offseason acquisitions can be evaluated against their former unit instead of inheriting the new team's 2025 rank. Run `powershell -ExecutionPolicy Bypass -File .\scripts\build-nfl-snapshot.ps1` to refresh that generated snapshot from nflverse.

## Forecast Lab

The Forecast Lab is now the primary matchup-research surface. Select any game on the current slate and the browser loads the most recent four, six, or eight completed games for both teams.

- ESPN play-by-play is classified into dropback/run calls, early downs, third downs, red zone, run direction, down-and-distance success, explosives, sacks, turnovers, and scoring.
- Team success and unit grades are adjusted for the strength of the opponents in the sampled schedule rather than presented as raw rank alone.
- Offensive-line grades combine rush success and sack avoidance. Defensive-front grades combine rush suppression and sack creation. Secondary grades combine pass success allowed, explosive passes, and takeaways.
- The six strongest matchup signals are phrased as the outcome the model actually favors. A low explosive-pass index therefore becomes "explosive passing limited," not a misleading low percentage beside "explosive pass."
- Every forecast opens with a percentage key. Win lean is the model's normalized team-strength estimate; call share is the projected portion of offensive plays; success lean and the other event values are matchup indices centered at 50, not literal event probabilities or sportsbook prices. Each signal exposes its blend and raw inputs behind a **Why this %?** disclosure.
- The overall view makes unit mismatches explicit with equations such as `SEA OL/RB 57 < NE DL/Run D 68`, followed by the exact line/front grades, `#/32` unit ranks, starter averages, coverage tendency, and offense performance against the opponent's primary coverage.
- A current-roster correction compares each club's projected 2026 starters with its evidence-backed 2025 lineup. Additions, departures, unavailable starters, offensive-line availability, and offense/defense continuity alter the forecast; low continuity reduces how much last season's scoring result is allowed to dictate the new team. A healthy five-man line receives a recovery adjustment when the prior club had to start extra linemen.
- League Ranks deliberately remains the raw 2025 reference. Current personnel adjustments are shown separately in Overall and applied to the forecast, so a roster upgrade never masquerades as a historical rank it did not earn.

### Portable play-caller fingerprints

The app keeps separate 2025 historical and active-2026 game-day caller maps. Titles are not treated as proof of play-calling responsibility. Known 2026 transfers automatically fetch the caller's former-team sample: established callers carry a 65% prior, while first-time callers receive a lighter 45% coaching-tree prior. The remaining weight comes from the new team's personnel and opponent-adjusted sample. Continuity callers keep the prior-team profile without inventing a transfer.

The active map includes the 2026 coaching changes relevant to forecasting, including Mike LaFleur in Arizona, Tommy Rees in Atlanta, Declan Doyle/Anthony Weaver in Baltimore, Joe Brady/Jim Leonhard in Buffalo, Todd Monken in Cleveland, Davis Webb in Denver, Klint Kubiak in Las Vegas, Jeff Hafley in Miami, Matt Nagy/Dennard Wilson with the Giants, Mike McCarthy/Patrick Graham in Pittsburgh, Brian Fleury in Seattle, Brian Daboll in Tennessee, and David Blough/Daronte Jones in Washington. Names remain editable because game-day duties can change after titles are announced.

Caller names and learned samples are browser-local under `staffOverrides` and `callerSamples` in the existing storage namespace.

### Bundled and optional charted coverage layers

The generated snapshot now bundles full-season defensive man/zone/pressure rates, FTN-charted blitz rates, offense performance against man and zone, and pass/run output grouped by opponents currently listed as 4–3 or 3–4. Every team has a base-front label and a league rank for each defensive rate. Front splits explicitly say that the current front classification is being applied to the 2025 opponent sample; they do not pretend every snap used base personnel.

The **Add charted coverage** action streams the selected baseline season's nflverse participation CSV and retains only rows for the games in the current sample. The full 2025 source file is approximately 47 MB, but streaming avoids retaining or parsing the entire season in memory.

When charting is present, the app joins rows to ESPN game and play IDs and adds:

- quarterback completion rate, yards per play, success, and explosives against man and zone;
- defensive man/zone rates and named coverage families;
- charted pressure rate and a 5+ pass-rusher proxy;
- offense formation and personnel fields in the evidence model for later interface expansion.

Participation data from 2023 onward is credited to FTN Data via nflverse and is licensed CC BY-SA 4.0. The charted layer is deliberately opt-in because of the download size. If coverage is absent, the app leaves it unavailable rather than inferring a shell from ordinary play-by-play.

## Data sources and honesty boundary

The live shell uses ESPN's public NFL site and core endpoints for schedules, scores, game summaries, play-by-play, team information, standings, leaders, team rosters, player box-score rows, positions, and season totals. Pregame personnel merges nflverse's timestamped depth charts and week-level rosters with ESPN team rosters. A preseason depth rank is never treated as sufficient evidence that a camp player should start: current roster status and health, prior-season snap share, starts, and position-specific production determine the expected lineup, with depth rank used as a tiebreaker.

ESPN does **not** expose authoritative snap-by-snap coverage responsibility in these payloads. Therefore:

- Yellow `Projected—not charted` pairings are orientation aids based on available listed positions/order. They must not be interpreted as shadow assignments.
- Green `Imported / charted` rows are user-supplied coverage observations.
- The UI never silently combines a projection with verified coverage history.
- Blank data remains blank or is labeled unavailable; it is not fabricated.

Verified coverage can come from a licensed charting provider, a manually reviewed film log, or another source the user has permission to use. The `source` column preserves provenance.

## Major pages

### Scoreboard

- NFL season picker organized into Hall of Fame, Preseason Weeks 1–3, roster week, Regular Season Weeks 1–18, and postseason rounds.
- The week window is Wednesday through Tuesday so the 2026 opener on Wednesday, September 9 is included in Week 1. Week 1 is visibly badged as using a prior-year baseline.
- Previous/next controls and keyboard arrows move exactly one NFL week.
- Automatic fallback to the most recent slate when a selected date has no games.
- A four-column MLB-style board fits all 16 games in a normal desktop viewport. Each card combines projected or actual score, favorite probability, strongest matchup edge, venue, broadcast, and status.
- Watch list and team-pick/bet-slip interaction. Away and home logo controls are mutually exclusive within a game, synchronize between the dialog and scoreboard, and radiate the selected club's team color.
- Pregame dialogs are a seven-stage forecast in this order: Overall, Player Edges, League Ranks, Run Game, Pass Game, Receiving, and Defense & Schemes. Live/final dialogs retain the box-score and team-stat views.
- Player Edges separates QB, WR, RB, and Defensive Imbalances. It surfaces each team's strongest yardage and touchdown leans, pairs WR projections with the corresponding CB depth role, and gives every player an expected touchdown count alongside the probability of at least one touchdown. The visible formulas trace prior rate × projected volume × opponent × scheme rather than presenting unexplained percentages.
- Defensive Imbalances compares pass defense/rush against pass offense/protection and front/run defense against OL/run offense. It explicitly labels when either side outclasses the other, but requires a broad average pass/run advantage so one strong matchup family is not mislabeled as total domination. Its suppression index is a severity signal rather than shutout probability.
- The rank stage gives each team an explicit `#1–32` for Run Game, Pass Game, Pocket Protection, Pass Defense, Pass Rush, and Run Defense, with the raw EPA, yards, sack, pressure, hit, first-down, interception, and TFL rates beside each rank.
- The overall stage contains a compact 44-player board: 11 expected offensive and 11 expected defensive starters for each team. Every row is clickable and numerically rated.
- Team styling is generated from primary, secondary, and tertiary palettes for all 32 clubs, with luminance-selected light/dark text tokens for contrast.

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

- Merges the latest timestamp-appropriate nflverse depth chart, selected-week nflverse roster, live ESPN roster, and game-summary participants. Stable GSIS/ESPN/PFR IDs and suffix-normalized names prevent duplicate or missed joins.
- Identifies WR/TE participants and CB/DB/S/FS/SS participants from available position data.
- Labels every player with the source's specific position, including alignments such as LWR/RWR and LCB/RCB/NB when available.
- Pregame views show starters only at single-starter positions, all five offensive-line roles in LT–LG–C–RG–RT order, and useful rotations only at WR (through WR4), RB, and TE. Live/final depth views begin with ESPN game participants and attach roster positions.
- Personnel rows visually separate expected starters, core multi-player roles, rotations, and depth players. Every player receives a 45–96 numeric grade with `HIGH`, `MEDIUM`, or `PROJECTED` confidence; no row remains `UNRATED`.
- Expected starters prioritize active health status, prior-season snap share/starts, and position-specific production. Published preseason depth rank breaks ties but cannot by itself put a camp quarterback over an established starter. Defensive starter construction follows each club's listed 4–3 or 3–4 base front, then presents scheme rates separately from personnel labels.
- Game and player overlays provide previous/next buttons and left/right keyboard navigation. Moving between games preserves the selected forecast tab and, within Player Edges, the selected position subtab.
- Displays both offensive directions.
- Pairs WR1 with CB1, WR2 with CB2, through WR4/CB4 using current depth role first, followed by published depth/slot order. Tight ends have separate safety/linebacker coverage lanes. Every pairing visibly disclaims shadow-coverage certainty.

**Verified history**

- Filters imported rows to the two teams or exact ESPN game ID.
- Supports all imported meetings, last five meetings, or last three meetings.
- Aggregates a receiver/defender pair across games.
- Displays games, routes, targets, receptions, yards, touchdowns, interceptions, yards per route, and catch rate.
- Preserves alignment, coverage type, IDs, game/date, passer rating, and source in storage/export even when a field is not visible in the compact table.
- Appears both on the dedicated page and inside the game dialog.
- Aggregates receiver production by defender quality (`elite`, `mid`, or `bad`) so a receiver's output against each coverage tier is visible separately.

## Player ratings and dossiers

- Every clickable player card begins with a numeric overall grade, confidence, calculation basis, and the exact evidence that drove it.
- Quarterbacks use EPA per attempt, CPOE, yards per attempt, touchdown rate, interception rate, and workload. Backs use scrimmage production, yards and EPA per carry, and first-down rate. Receivers use target share, yards and EPA per target, first-down creation, and scoring. Edge, interior line, linebacker, corner, and safety formulas are separate and normalize sacks, hits, TFLs, passes defended, interceptions, and tackles per 100 defensive snaps. Offensive linemen use snap share, starts, and lineup stability because public NFL box scores do not publish individual pressure-allowed totals.
- Defensive ratings stabilize public-box-score production with snap share, expected current role, and draft pedigree. Per-snap counting rates are regressed through 350 defensive snaps, preventing one tackle or sack in a tiny sample from creating a 90+ grade while retaining separate CB, safety, edge, interior, and linebacker formulas. The player card exposes those inputs instead of presenting the grade as an unexplained scouting score.
- Efficiency is sample-regressed so a player with four targets cannot outrank an established receiver solely because those targets produced a high yards-per-target result.
- No-evidence rookies still receive a visibly `PROJECTED` grade based on current role and draft capital; the card states that no prior NFL sample exists.
- Cards add position-specific scheme slices: QB coverage/pressure/formation, RB box/direction/formation, receiver man/zone/blitz targets, offensive-line pass/run/formation unit outcomes, and defender pass/run/formation outcomes. Small samples are shown rather than promoted as reliable conclusions.
- A current-opponent block compares the player's strongest qualified prior split with the opponent's adjusted scheme results. Offensive-line cards show snaps, snap share, starts, pressure projection, opposing sack rate/front grade, and clearly label team-unit play outcomes as a proxy when player participation cannot be joined.
- Official ESPN prior-season totals remain visible below the forecast layers; Drake Maye's card, for example, exposes the complete passing and rushing categories returned for 2025.
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

`loadAll()` loads the selected scoreboard, regular/postseason games, teams, standings, leaders, and touchdown plays in parallel where possible. Team aggregates and leaders can be reconstructed from season games. A Coverage Lab selection lazily loads only that game's summary and caches it for the session. Game dialogs merge the generated verified snapshot with live ESPN data. Player cards lazily load the selected player's official season totals and recent play-by-play scheme sample.

## Known limits and next data upgrades

- Expected starters are forecasts, not official game-day inactive lists. The model uses the latest available status and should be refreshed after final inactives are released.
- The bundled snapshot is dated in its generated payload. Re-run `scripts/build-nfl-snapshot.ps1` whenever roster/depth releases materially change.
- Box-score participants are not the same as an official depth chart or inactive list.
- True route alignment, shadow rate, targets in coverage, separation, motion, press rate, and coverage shell require charted play data. The import model is the supported bridge for these fields/results.
- Team-abbreviation changes and provider-specific player names are safest when stable player IDs and ESPN game IDs are supplied.
- Imported totals inherit the charting provider's attribution rules. Avoid mixing providers in one aggregate unless their definitions match.

## Verification checklist

1. Open a known NFL game date and confirm scoreboard cards load.
2. Open a pregame and switch through all seven forecast stages in the documented order; confirm Week 1 reports the previous season as its analysis baseline and Overall begins with the percentage key, current-roster corrections, and two unit equations.
3. Confirm Receiving shows WR1–WR4 against CB1–CB4, Pass Game shows LT–LG–C–RG–RT, Player Edges switches among QB/WR/RB/Defensive Imbalances and displays numeric expected touchdowns, Defense shows outclassed/competitive labels plus base front and blitz/man/zone/pressure rates, and League Ranks contains all six unmodified 2025 `#/32` rows.
4. Open WR vs Secondary and change game and history window.
5. Download the CSV template, import it, and confirm the row is labeled verified and appears for the matching teams.
6. Export JSON, clear with confirmation, reimport the JSON, and confirm totals are unchanged.
7. Confirm projections remain labeled projected and are never shown in the verified table.
8. Test narrow/mobile layout and horizontal table scrolling.
9. Select each club's circular logo in a pregame, confirm only one side remains selected and the scoreboard mirrors it, then move to another game and confirm the active forecast tab persists.
10. Run a JavaScript syntax check in an environment with Node (`node --check app.js`) before publishing.
