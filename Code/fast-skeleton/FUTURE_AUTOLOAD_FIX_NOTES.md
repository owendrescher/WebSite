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


Additional v18 player-card polish:
- Restored themed/custom tooltips for batter-vs-pitcher archetype rows while keeping ordinary handedness/pitch/graph tooltips suppressed.
- Tightened Last 5 Series and Last 5 Starts/Opponents card spacing after removing old rank/stat lines.
- Added dot loading placeholders to initial batter Last 14D stat cells so the card does not show plain -- while async data is still loading.
- Validation: node --check app.js; node --check live-dashboard-prototype.js.


Additional v19 loading/archetype stability fix:
- Batter Last 14D stat cells now repaint as soon as recent batting data loads instead of waiting behind Starter SoS hydration.
- Added a small player-card batting season cache so already-loaded recent data does not fall back to bouncing dots during same-card repaints.
- Batter-vs-pitcher archetype rows now keep their last stable card and never disappear during async pitch/archetype rehydration.
- If archetype computation is still thin/loading, the row stays as a loading archetype row rather than removing the section.
- Validation: node --check app.js; node --check live-dashboard-prototype.js.


Additional v20 player-card archetype fix:
- Player-card archetype matchup rows no longer stay stuck on `Archetype sample loading`; empty/time-out samples resolve to `No archetype sample`.
- Added a timeout guard to the async archetype sample call so a slow live request cannot hold the row forever.
- Restored compact pitcher markers/archetype badges beside the archetype label.
- Swapped the right-card order so the archetype table renders before the pitch cards.
- Validation: node --check app.js; node --check live-dashboard-prototype.js.


v21 archetype sample + badge fix:
- Batter-card archetype requests no longer turn a timeout into a permanent no-sample row; late live-site samples replace the loading row when they finish.
- Expanded starter/archetype event hydration timeouts and made Flame Thrower filtering use event-derived velocity qualification when profile/eligibility hydration is late.
- Busted the player-vs-archetype cache key so stale v20 no-sample rows do not survive.
- Restored pitcher handedness and risk/archetype markers after the archetype label, with CSS that keeps those badges visible in the compact table.
- Hydrates pitcher marker placeholders after every batter-card archetype repaint.


v22 loading/SoS/archetype badge fix:
- Flame Thrower archetype rows now reserve visible space for pitcher badges, including L/R and risk markers; only the text label ellipsizes.
- Batter Last 14D stat cells now paint immediately after game-log splits resolve, without waiting for hand splits, HR role split, or Starter SoS.
- Batter Starter SoS hydrates independently and repaints the same open card once available.
- Pitcher Opp AVG/SLG SoS now hydrates independently after the recent/rank pitcher rows paint, then repaints the same open card once available.
- Bumped batting season, starter SoS, and archetype matchup cache keys to avoid sticky stale live-site rows.
- Validation: node --check app.js; node --check live-dashboard-prototype.js.


V23 archetype badge hard fix:
- Archetype row badge, pitcher handedness, and risk markers are now rendered before the long archetype label so Flame Thrower text cannot push them out.
- Added a non-empty badge cluster for every archetype row; only the text label can ellipsize.
- Removed fixed table behavior that was clipping F rows in the player-card archetype table.
- Validation: node --check app.js; node --check live-dashboard-prototype.js.


V27 pitcher identity cleanup:
- Rolled back the word-label archetype display in lineup/pitching starter rows.
- Archetype now renders as a single letter badge only.
- Removed forced archetype placeholders for pitchers that do not qualify.
- Separated async velocity/archetype refresh from marker spans so HR/L/R/fire/cold markers are not wiped after first hydration.
- Added a marker rehydration helper after identity updates.
- Added CSS guards so name text shrinks first while handedness, archetype letter, and markers stay visible.


v29 scoreboard layout stability fix:
- Dashboard scoreboard cards no longer write transient measured widths into `--sb-scale` during first render/hydration.
- Locked dashboard scoreboard density to CSS/media rules so cards stop visually pinching when lineup/probable/HR marker data loads.
- Team pick highlighting no longer changes logo box dimensions, so the first click should not collapse the team ID/win badge area.
- Win/loss streak badges are kept in a reserved logo-stack row so W/L labels remain visible during loading and selection.

v30 scoreboard spacing follow-up:
- Kept the v29 stable no-pinch sizing, but reduced the fixed density so dashboard cards no longer overcrowd.
- Disabled dashboard marquee animation inside compact scoreboard rows; pitcher text now clips from the right instead of sliding left and hiding the starter name.
- Restored a fixed logo/team/meta/score column balance and reserved room for the center game-state strip.
- Pick highlight styles no longer change logo dimensions, while W/L labels keep a fixed row below the logo.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js

## v31 scoreboard state strip spacing fix
- Restored the score-state strip to span the full scoreboard-main width instead of reserving an extra score-column offset inside the wrong parent.
- Kept v29/v30 no-pinch sizing for the team rows and score buttons.
- Centered the base diamond, B/S/O boxes, inning, and play text inside the strip.
- Prevented `PRE Starts...` from being squeezed into fragments by giving the context area its own flexible column.

v32 scoreboard strip/marquee follow-up:
- Kept the no-pinch scoreboard sizing from v29-v31.
- Restored marquee scrolling for compact scoreboard pitcher text and last-play/play-by-play text.
- Re-expanded the score-state strip to the full scoreboard body up to the score-button column, rather than letting it sit in a squeezed center lane.
- Reduced B/S/O chip widths slightly so the play text has more usable horizontal room.
- Syntax checks: node --check app.js, node --check live-dashboard-prototype.js.


V34 scoreboard start-time/marquee fix:
- Pregame state strip now renders Starts {time} as visible text, not only hover title.
- Marquee measurement no longer locks in 0px/compact widths during first dashboard paint.
- Pitcher and last-play marquee tracks force max-content measurement before overflow testing.
- Score strip keeps no-pinch sizing while reserving visible room for PRE + start time.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js

v35 scoreboard start-time tooltip and strip background fix:
- Pregame start time remains visible in the play text.
- Removed start-time hover tooltip from the pregame play text.
- Removed start-time text from lineup-state inning hover titles.
- Added score-mini-no-tooltip suppression so themed tooltip code does not recreate a start-time tooltip.
- Extended the B/S/O visual capsule through the PRE + start-time play-text area.
- Kept previous no-pinch scoreboard sizing and marquee behavior.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js


v36 scoreboard start strip fix:
- Pregame start time is rendered as fixed visible text instead of a marquee/tooltip target.
- Removed the start-time hover path from the pregame play text.
- Made the state-strip background a single full-width capsule through the count and play/start-time area.
- Kept live play-by-play and pitcher-name marquee behavior.
