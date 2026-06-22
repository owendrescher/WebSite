# Future autoload, lineup, archetype, and SoS tooltip fixes v6

Changes carried forward:
- Future/preview games hydrate probable pitchers, projected starters, lineup fallbacks, bullpen context, and HR score shells in the background.
- Split View button remains hidden while the split-view implementation remains in the code.
- Native browser title tooltips are stripped and replaced by themed site tooltips.
- HR score 80+ text remains fiery and readable on dark backgrounds.

v6 changes:
- Lineup modal now repaints completed fallback/remote lineups immediately after completion instead of waiting for later hot-player/HR-score hydration. This prevents short/partial lineups from staying visible until switching away and back.
- Lineup modal render signature now includes current lineups, preview fallback lineups, and pitcher IDs, so stale non-live lineup renders are not skipped after async hydration.
- Pitcher archetype badges now show Finesse Killer on the pitcher line even when it is a secondary archetype. This should surface cases like Drew Rasmussen on the lineup screen while keeping the player-card archetype logic intact.
- SoS compact equivalent team now uses the full current league rank table nearest the pitcher’s average opponent rank, not the nearest opponent from the pitcher’s own recent sample. Example: 21.3 now targets the #21 team when available instead of a previously faced #19 team.
- SoS tooltip copy is condensed to data-only lines.
- SoS opponent lines now use: `{date} {vs./@} {Opponent} {rank} {rate} | {IP} IP | {K} K | {ER} ER | {HR} HR`.
- Tooltip rank numbers after `#` now bold correctly, while non-numeric text remains normal weight.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js


V7 lineup K badge and tooltip stability fix:
- Finesse Killer K fallback now applies to elite command starters when opponent AVG is unavailable: 30+ IP, WHIP <= 1.05, ERA <= 3.10, K/9 >= 7.5. This lets the lineup starter line match the player-card archetype classification when the lineup card has only basic pitcher stats loaded.
- Themed tooltips now anchor at the initial hover position and no longer follow cursor movement inside the same hoverable element. They still disappear when the cursor leaves that hoverable element.
- Validation: node --check app.js; node --check live-dashboard-prototype.js.


v8 tooltip / batter starter SoS cleanup:
- Suppressed custom/native tooltips for handedness tables, pitch cards/strips, and graph hover dots.
- Custom tooltips now debounce adjacent same-title targets, so logo/abbreviation hover zones do not flicker.
- Last 5 Series cards no longer show team BAA or HR-allowed ranks.
- Last 5 Opponents cards no longer show Team AVG/SLG blocks.
- Batter cards now add Starter SoS, based on the average SP rank of starters faced, with nearest equivalent SP and compact hover detail.


v9 tooltip / archetype layout / Finesse audit:
- Tightened same-tooltip adjacency grouping from 18px to 7px to reduce accidental grouping while keeping adjacent logo/text pairs smooth.
- Tooltip hover now self-heals during async stat repaints: disconnected/emptied hover targets hide immediately, and pointer movement can rebind to the new target without chasing the cursor.
- Batter-card pitcher-archetype matchup table moved from the season-stat block to the right-side matchup area under the pitch info.
- Audited Finesse Killer assignment: no Flame Thrower exclusion exists, but missing opponent AVG could block otherwise qualifying high-velo command arms. Finesse now falls back to WHIP/ERA/K/run-prevention when opponent AVG is unavailable, and velocity still does not suppress K.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js


v14 final matchup/TBD polish:
- Pregame visual display keeps unconfirmed starters as TBD, but the fallback starter is now used as the matchup pitcher for opposing lineup hand splits, HR scoring, and player-card batter-vs-pitcher context.
- Scoreboard pitcher line now uses the same TBD fallback starter selected in the lineup/pitching tab instead of drifting to another rotation candidate.
- Scoreboard text shows TBD plus the fallback last name until an official probable is confirmed.
- Pitching tab starter rows now show last pitched date/rest instead of every starter saying unused today; rows hydrate from game-log memory when available.


Additional v15 bullpen/scoreboard fix:
- Fixed Pitching tab bullpen rows that accidentally rendered the `statusLine()` function source instead of the reliever status text.
- Scoreboard pregame pitcher lines now prioritize the same preview/TBD fallback probable used by the lineup and Pitching tab before stale rotation/current-pitching cache values.
- Scoreboard unconfirmed fallback starters now render as `TBD Lastname` so the projected matchup remains visible without implying official confirmation.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js


v16 scoreboard fallback priority fix:
- Fixed the PHI-only Luzardo/Nola drift by changing probable-pitcher merge priority instead of adding a visual-only override.
- A deliberate `TBD + fallback` probable now survives later schedule/boxscore/staff hydration.
- High-confidence probable pages can still replace TBD/fallback if a real official probable is published.
- Scoreboard, lineup card, and Pitching tab now use the same probable selection priority.
- Validation: node --check app.js; node --check live-dashboard-prototype.js


v17 starter-memory / live-lineup correction:
- Bumped pitcher start memory storage to v3 so stale live-site v2 rest ledgers cannot keep showing yesterday's starter as 7d rested.
- Added TTL-based refresh for recent target dates; near-live starter/rest memory now refreshes quickly instead of persisting stale pre-final gameLog reads.
- Added team recent starter reconciliation from final schedule boxscores before picking a TBD fallback starter, so a pitcher who actually started yesterday is marked as 1d rest and not selected as the longest-rest fallback.
- `completeLineupToNine()` now really completes short lineups from bench, player lookup, and active roster candidates instead of returning 8-man arrays unchanged.
- Lineup rendering no longer treats any non-empty partial lineup as ready; it requires a usable 9-hitter lineup before final paint.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js
