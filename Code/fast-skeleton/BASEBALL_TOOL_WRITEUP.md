# OwenTools MLB Dashboard: Complete As-Built Reference

Last audited against the shared MLB implementation on 2026-07-22.

This document describes the current production behavior, every major visible statistic and indicator, the source and fallback chain behind the data, formatting rules, persistence, refresh behavior, and the code location responsible for each system. Function names are used as stable locators because line numbers move frequently.

## 1. Production entrypoints and file map

| File | Responsibility |
| --- | --- |
| `../mlb/heavy_mlb.html` | Full production MLB page. Loads every analytical system. |
| `../mlb/light_mlb.html` | Lightweight production page. Uses the shared application but disables triangles, pitch-type information, velocity sections, and lineup power calculations. |
| `dashboard-live-prototype.html` | Shared/development scoreboard entrypoint and the canonical markup source. |
| `live-dashboard-prototype.js` | Almost all application state, API access, caching, normalization, rendering, interaction, calculations, polling, tooltips, player cards, predictions, and manual-state bridging. |
| `live-prototype.css` | MLB-specific scoreboard, lineup, tracker, feed, player-card, graph, animation, responsive, and interaction styling. |
| `dashboard.css` | Older/base dashboard layout, team cards, panels, controls, and shared visual primitives. MLB-specific overrides generally live in `live-prototype.css`. |
| `styles.css` | Global OwenTools typography, colors, buttons, dialogs, and shared shell styling. |
| `rotowire-default-lineups.js` | Published RotoWire lineup seeds, organized by club and opposing pitcher hand. |
| `rotowire-current-defaults.json` | Refreshable current lineup seed payload. |
| `update-rotowire-default-lineups.js` / `.ps1` | Maintenance scripts for refreshing published RotoWire defaults. |
| `mlb-contracts-data.js` and contract CSV | Contract lookup fallback/data bundle. |
| `../shared/owentools-sync.js` | Authentication, durable session handling, Supabase Save/Load, immutable save history, and shared sync widget. |
| `../shared/supabase-config.js` | Supabase connection configuration. |

Both production pages set a `<base href="../fast-skeleton/">`, so their CSS, JavaScript, audio, images, lineup seeds, and contract assets resolve from `Code/fast-skeleton` while the public URLs remain under `Code/mlb`.

### Heavy versus light feature gate

`light_mlb.html` defines:

```js
window.MLB_DASHBOARD_LITE = {
  triangles: false,
  pitchInfo: false,
  velocity: false,
  lineupPower: false
};
```

`live-dashboard-prototype.js` freezes this into `MLB_DASHBOARD_LITE` at startup. Heavy MLB does not define the object, so all four features default on. This distinction is important: the light page must not fetch or calculate hidden pitch, velocity, triangle, or power-grade work merely to hide it with CSS.

## 2. Overall application architecture

The page uses a fast-shell/hydration model:

1. The selected date and locally cached cards restore immediately.
2. The schedule supplies the game shell, teams, status, probable pitchers, and records.
3. Live feeds and box scores enrich scores, innings, bases, counts, play events, lineups, player lookups, pitchers, and today statlines.
4. Official lineups are preferred. RotoWire and recent same-handed lineups fill incomplete pregame batting orders.
5. Player, team, recent-form, Statcast/Savant, contract, ranking, prediction, and graph information hydrates lazily or in background lanes.
6. `finalizeRenderedGames()` deduplicates the cards, repaints only changed fingerprints, refreshes dependent panels, and schedules lower-priority work.
7. Live games continue passive refreshes without destroying user interaction state.

Core orchestration is in `loadGames()`, `finalizeRenderedGames()`, `upsertCard()`, `updateScoreboardLiveCard()`, `scheduleScoreboardIdlePrewarm()`, and the passive-refresh functions near the end of `live-dashboard-prototype.js`.

## 3. Top bar and global controls

Markup is in the three HTML entrypoints under `.topbar`. Control behavior is initialized near the beginning of `live-dashboard-prototype.js`.

### Date control

- Accepts flexible typed dates and normalizes them to `YYYY-MM-DD`.
- Opens a custom month picker on focus/click.
- Previous/next arrows move one day.
- Middle-click returns to today.
- The selected date persists as `dashboard-date:v1`.
- Changing dates clears date-scoped rendered state, restores that date's manual state, and loads the selected slate.

Code: `parseFlexibleDateInput()`, `renderDatePicker()`, `setDateInputValue()`, `refreshForSelectedDate()`, and the `dateInput` event handlers.

### Help and player search

- `?` opens the controls/site-capability help.
- The magnifying glass opens global player search.
- Search supports team, skill/group, position, age, and handedness filters.
- Results use headshots, identity data, and open the same player-stat overlay used by lineups and trackers.

Code: `initGlobalPlayerSearch()`, global search render/fetch helpers, and `.global-player-search-*` CSS.

### Today-only Hide menu

The Hide button appears immediately after player search only when the selected date is today. Hovering or pressing it opens three line-separated checkbox-style choices:

- Past games: completed/final games.
- Ongoing games: live, in-progress, warmup, delayed, review, or manager-challenge states.
- Future games: all remaining not-started games.

An illuminated dot means that category is hidden. The selection persists in `mlb-game-visibility:v1`. Hiding a category hides its scoreboard cards and also removes tracked-player rows belonging to those games. On every other date, the entire control is absent and all categories display normally.

Code: `visibilityStateForGame()`, `gameAllowedByVisibility()`, `gamesAllowedByVisibility()`, `syncGameVisibilityControl()`, and `.game-visibility-*` CSS.

### Docking, sizing, columns, and pages

- Scoreboard can dock and resize within the workspace.
- Column count is normalized to the available width.
- Panels can move, resize, snap to neighbors, avoid overlap, and restore saved positions.
- Page tabs expose Scoreboard, Leaders, Team Stats, and Playoff Picture; additional internal views support predictions/hot-player surfaces.

Code: `applyOverlayDock()`, `applyOverlaySize()`, `applyScoreboardColumns()`, `initMovables()`, panel geometry helpers, and `normalizeOverlayPage()`.

Persisted keys include `panel-layout:v2`, `overlay-dock:v1`, `overlay-size:v2`, `scoreboard-columns:v2`, `overlay-page:v1`, and `scoreboard-width:v1`.

## 4. Scoreboard game cards

Each `.game-card` is created from `#gameTemplate`. Rendering is primarily in `upsertCard()`, the card-render helpers around it, and `updateScoreboardLiveCard()`.

### Header and team information

Cards can show:

- Away/home abbreviation and logo.
- Season record.
- Team streak.
- Last-five/last-seven recent record where hydrated.
- Team score or pregame dash.
- Scheduled start time in Eastern Time.
- Game status, inning half/number, delay/final state, doubleheader/game number, and series context.
- Team-strength/record badges and selected manual state.

Recent records are audited from MLB regular-season final games. Games without a resolvable winner, postponed games, and ties are excluded. The same audited game set is used for its AVG/SLG/OPS/ERA aggregates.

Code: `getTeamStreakMap()`, `getTeamLastSevenRecord()`, `getLineupTeamRecentStats()`, `recentTeamScheduleSummary()`, and `formatRecentTeamSummary()`.

### Pitcher line

The displayed starter/current pitcher line can include:

- Name and throwing hand.
- SP/RP/CP role.
- IP.
- ERA.
- WHIP.
- HR/9.
- K/9.
- Pitch count when applicable.
- Risk/status markers, probable/starter confidence, opener context, and recent usage/readiness indicators.

Probable selection verifies team association and protects doubleheaders from assigning one pitcher to both games. Live/current pitchers supersede probable pitchers after play starts. TBD fallbacks may use recent rotation memory but remain labeled as fallback/TBD rather than presented as confirmed.

Code: `previewProbableForSide()`, `resolveOfficialPregameProbablePitchers()`, `resolveDuplicateProbablePitchersAsTbd()`, `fillPotentialStartersForTbdProbables()`, `formatPitcherLine()`, `pitchCountTag()`, and `pitcherDisplayUsageRole()`.

### Live game strip

During live play the card displays:

- Line score / R and H.
- Current inning and half.
- Balls, strikes, and outs.
- Base occupancy diamond.
- Current pitcher and current/upcoming hitters.
- Play/event text.

Live event ordering uses MLB play/event indices and timestamps. Administrative events remain in source history but are excluded from the transient baseball-action flash so old advisories do not repeatedly look like the newest pitch.

### Manual game controls

- Clicking/selecting a team creates a pending game pick.
- Picks receive leading/trailing styling live and hit/miss styling when final.
- Clear Picks removes pending selections.
- Pregame confidence cycles Tossup (yellow), Near Lock (unlocked/intermediate), and Lock (gray lock).
- Over/under markers are stored per game and mirrored into the lineup overlay.

Code: the pending-pick functions near `restorePendingGamePicks()`, `syncAllCardGamePickStates()`, tossup functions using `TOSSUP_SCOREBOARD_STORAGE_KEY`, and over/under functions using `OVER_UNDER_SCOREBOARD_STORAGE_KEY`.

### Pregame risk styling

A pregame starter allowing at least three home runs across the applicable last-three-start window can activate the yellow HR-risk card sheen and a team-colored emphasis on the relevant pitcher. The effect stops being a pregame warning after the game begins.

## 5. Lineup overlay

Opening a card presents a full game overlay. State is date-scoped with `lineup-open:v2:{date}`, `lineup-view:v1:{date}`, and the shared lineup-stat-window preference.

Views:

- Lineups.
- Pitching.
- Roster.
- Live.

Navigation arrows move through games. Split-peer behavior can place another lineup beside the first. The overlay retains mirrored game-pick, tossup/lock, and over/under controls.

### Team header and series strip

The overlay includes team identity, color, logo, record/recent form, handedness matchup summaries, opener context, series results, and starters from recent series games. Season head-to-head and current-series fallbacks are resolved from MLB schedules.

Code: `renderLineupSeriesStrip()`, `getTeamSeriesResults()`, `getSeasonHeadToHeadRecord()`, `lineupSeriesStripHtml()`, and lineup team status helpers.

### Batter rows: visible content

Each batting-order row can show:

- Batting-order slot.
- Player name with a 2px black outline for contrast.
- Batting hand.
- Position.
- Today's batting line and outcome shorthand.
- Selected recent-window hits-at-bats.
- AVG.
- OPS.
- XBH.
- HR.
- HR/XBH and other situational badges.
- Hot/cold icons, streak/context icons, next/up-now state, and tracked-player highlighting.

The compact recent format is `H-AB | AVG | OPS | XBH | HR`, produced by `lineupDashboardStatsHtml()`. Today's line is built from actual game batting totals in `lineupGameBattingStats()` and `battingTodaySummaryFromGameStats()`.

### Light-page OPS color scale

On the light page, every lineup player receives a recent-OPS tone:

- The continuous scale spans `.000` OPS through `.900+`.
- Low values trend blue.
- Middle values fade toward the neutral row treatment.
- High values trend orange.
- The lowest extreme receives an ice treatment.
- `.900+` receives the fire treatment.
- A tracked player who is also in the fire state keeps a static fire appearance; the pulse is deliberately disabled for that combined state to prevent blinking between highlighted states.

Code: light tone helpers near `applyLightPerformanceTone()`, lineup-row rendering near the end of the file, `.light-lineup-ops-tone`, `.is-lite-ice`, `.is-lite-fire`, and the `.lineup-row-tracked.is-lite-fire` override.

### Pitcher light-page ERA scale

Pitcher rows use an inverse last-three-appearance/start ERA scale:

- `0.00` is orange/hot.
- `7.00+` is blue/cold.
- Values between are continuously blended.

Code: `.light-pitcher-era-tone` and the same light performance-tone functions.

### Recent home-run card stacks

Batter and pitcher rows can carry compact vertical stacks for home runs in the player's last three games played:

- Most recent game uses the strongest/gold treatment.
- Second-most-recent uses an intermediate treatment.
- Third-most-recent is gray.
- Multiple HR in one game create multiple cards.
- Cards overlap vertically but leave enough of each top edge visible to show the exact stack count.
- The stack remains centered within its row and does not change row height.
- At five or more cards, it may use a second compact row without widening the assigned indicator area.
- Left-handed participants use rounded corners; right-handed participants use sharp corners.
- Batter tooltip includes game/date/opponent, opposing pitcher, pitcher hand, and pitch type when available.
- Pitcher HR-allowed tooltip mirrors the batter interaction and includes the batter name/hand plus pitch type.
- Left-click cycles the active card and immediately updates the tooltip to that HR.
- Hover tooltips are transient; middle-click pins a tooltip until dismissed.

Code: the recent-HR hydration/render helpers, HR stack event handlers, `fetchPlayerLastHomeRuns()`-family logic, and `.lineup-recent-hr-*` / HR stack CSS.

### Pitching and bullpen views

The pitching view separates current pitcher, starters, and bullpen. Pitcher rows can show:

- Role and throwing hand.
- IP, ERA, WHIP, HR/9, and K/9.
- Season and recent/current-game workload.
- Availability/readiness inferred from recent usage.
- Potential closer/opener context.
- HR-allowed history stack.

Bullpen summary uses two windows in each metric: overall and last 14 calendar days, with corresponding league ranks. Displayed metrics are IP, ERA, WHIP, HR/9, and K/9. Formatting is `overall/14D` plus `overall rank/14D rank`.

Code: `renderBullpenSummary()`, `hydrateBullpenSummaryRanks()`, `formatBullpenOverallRecentValue()`, bullpen aggregation/ranking helpers, and reliever usage functions (`relieverRecentUsageMemory()`, `buildRelieverUsagePredictions()`).

## 6. Player tracker

The tracker stores date-scoped player selections and remains live during passive refreshes.

### Row content

A full tracker row shows:

- Drag handle (`||`).
- Player headshot with team-logo fallback.
- Full player name.
- Superscript `vs. Pitcher (R/L)` matchup on the same wrapped name line.
- Opposing pitcher surname in that pitcher's team color.
- Pressing the pitcher surname opens the pitcher card with pitcher role forced.
- Team and position.
- Live/up-now/due status.
- Current-day batting line.
- Vertical confidence gradient control.
- Expectation selector.
- Individual remove button.

The confidence control intentionally shows only the color/vibe, not a numeric label and not a confidence tooltip. Dragging it changes confidence without starting player reorder. Reorder begins only from the `||` handle and works with pointer input on desktop and phone.

Code: `renderPlayerTrackerList()`, `trackedPlayerOpponentPitcher()`, tracker pointer events, `normalizeTrackerConfidence()`, and `.player-track-*` CSS.

### Sorting and layout

Tracker sort modes include time added and confidence. SWAP exchanges the vertical position of Player Tracker and Home Run Feed. On narrow/mobile screens the explicit CSS order changes too, so the feed can truly sit above the tracker rather than only changing a desktop grid. Compact mode is persisted and preserves the important identity/live-line content in a shorter row.

Tracker/fire repaint protection:

- Render fingerprints prevent needless DOM replacement.
- Passive refresh updates statlines.
- Pulse/shimmer does not alternate the tracker row.
- The lineup's combined tracked + fire state is static.

### Tracker persistence

Primary key: `player-tracker:v1:{date}`. Recovery also uses `player-tracker-backup:v1`, manual-state backup/mirror/durable stores, and explicit Supabase Save snapshots. Tracked records include player identity, team/position, expectation, confidence, and ordering information.

## 7. Home Run Feed and audio

The feed lists home runs for the selected date with:

- Batter/team identity and logo.
- Solo/two-run/three-run/grand-slam description.
- Season HR number.
- Distance when available.
- Time and inning/half.
- Opposing pitcher and HR-allowed number.
- Score/result context.
- Pitch type and velocity when present.
- Team-colored styling and rating/grade treatment.

Feed ordering can use latest-first behavior. Compact mode shares the shortened panel style. SWAP is shared with the tracker.

New live HR events can play `homerun.mp3`. Already-played event identities persist under the date-scoped `home-run-audio-played:v1` key so polling or refreshing does not replay the same event.

Code: home-run extraction/normalization around the `hrs` storage helpers, `updateHomeRunFeedIfChanged()`, `syncHomeRunAudioAlerts()`, and HR rating functions.

## 8. Player cards: shared structure

Player cards open from lineup names, tracker rows, tracker pitcher links, search, leaders, roster/pitching lists, graph points, and relevant feed/stat surfaces.

Header:

- Full name and handedness.
- Team, uniform number, and position/role.
- Headshot and team styling.
- Hitter/pitcher indicators.
- Navigation to prior/next player in the invoking context.
- Tabs for Stats, Outcomes, and Contract.
- Heavy-only power/quality and graph-related adornments when enabled.

Player profile loading and rendering are in `openPlayerStatOverlay()`, the `fetchPlayer*`/player-stat render helpers, and player-stat event delegation.

### Hitter Stats tab

The main season/recent comparison table can show:

- G.
- AB.
- H.
- AVG.
- OBP.
- SLG.
- OPS.
- HR.
- AB/HR.
- HR versus starter/reliever context where available.

Season values appear beside the selected recent window. The recent-days selector is intentionally compact and accessible without a native hover title.

Handed split table:

- Split (`vs RHP` / `vs LHP`).
- H-AB.
- AVG.
- SLG.
- XBH.
- HR.

Historical/recent series cards show the last five series with opponent, series record, AVG, games started, HR, ISO, and opposing pitchers. Pitcher labels can expose portrait/handedness/stat context in their focused tooltip.

### Light player-card replacement metrics

The light page completely removes the old pitch section, velocity bucket, and PWR grade work. The former right-side area instead contains:

- **Average HR Distance** in feet, presented as the visually emphasized metric.
- **Overall Ratings**: Overall, vs RHP, and vs LHP. Each rating uses an outlined numeral, tier color, glow, gradient background, and proportional bar.
- **Average Bat Speed**: season and last seven days.

These use the same borders, typography, spacing, and panel background as the rest of the player card; average HR distance receives the stronger decorative treatment. Rating colors move from blue below average through neutral and orange to red/gold at All-Star/elite levels. Rendering is in `lightBatterMetricHtml()`, with Statcast data assembled by `getLightBatterMetrics()` and rating data supplied by `getHitterOverallRatings()`.

### Heavy hitter-only analytical content

When enabled, hitter cards may also display:

- Pitch-type performance: Type, AVG, SLG, EV; or pitcher-allowed comparison columns.
- Velocity buckets: H-AB, AVG, SLG, XBH, HR.
- Batted-ball profile: Pull%, center%, opposite/push%, air-ball%, ground-ball%, and PA per 300+ foot air ball.
- Handed matchup/archetype rows.
- HR-history triangle and league-decile grade bars.
- Heatmap/outcome detail.

Pitch/velocity work is gated by `MLB_DASHBOARD_LITE.pitchInfo` and `.velocity`; graph work is gated by `.triangles`.

### Pitcher Stats tab

The season/recent pitcher table can show:

- G and/or GS/role context.
- W-L.
- Extended W-L: whether the pitcher's club won starts, regardless of official pitcher decision.
- IP.
- ERA.
- WHIP.
- K and K/9.
- HR and HR/9.
- Average Stamina: average innings and average pitches per start/appearance.
- Relevant league rank formatting.
- Heavy-only hitter-grade/quality analysis.

Opponent-handed split table:

- Split.
- Opp AVG.
- Opp SLG.
- HR.
- HR/9.
- K.

Last-three starts/appearances, last opponents, team results, pitch counts, workload, and HR-allowed events feed the supporting panels and graphs.

Code: `pitcherStatRows()`, `pitcherOpponentHandHtml()`, `pitcherAverageStaminaText()`, extended-record fetchers, and pitcher history helpers.

### Outcomes tab

The hierarchical outcome viewer navigates:

1. Games.
2. Plate appearances/outcomes.
3. Individual pitches.
4. Field/outcome detail.

It uses MLB live-feed plays and keeps game/play/pitch identity so back navigation and selected outcome remain stable. Relevant descriptions, count, pitch result/type/velocity, hit result, and field position are shown when supplied.

Code: player outcome loaders/renderers and `[data-player-outcome-*]` event handlers.

### Heatmaps

Hitter/pitcher heatmap surfaces can show:

- Split.
- PA.
- AVG allowed (AVGA).
- Isolated power allowed (ISOA).
- HR allowed (HRA).
- HR/9.
- Selected batter/pitcher identities.
- Hitter/pitcher season context such as AVG, OPS, WHIP, K/9, and HR/9.

Remote season heatmap CSV is configured as `PLAYER_HEATMAP_REMOTE_CSV_URL`; MLB/Savant and current-game context supplement it. Code is in player/pitcher heatmap fetch, row normalization, and render functions around `renderPlayerStatHeatMap()`.

### Contract tab

Contract rows are loaded from the bundled/global contract dataset or CSV. The tab handles no-match/loading/unavailable states and formats labeled contract tables with explanatory tooltips.

Code: `loadPlayerContractRows()`, `renderPlayerContractTab()`, `contractTooltip()`, and `mlb-contracts-data.js`.

## 9. Heavy-only power grades, triangles, and analytical markers

This entire section is disabled on the light page.

### Lineup hitter power grade

Hitter SLG is compared with eligible MLB hitters through the day before the selected date. Windows and weights:

- Season: 50%.
- Last 30 days: 25%.
- Last 14 days: 15%.
- Last 3 days: 10%.

Each window becomes a league decile, the weighted score maps A+ through F, and the comparison uses the opposing starter's throwing-hand split. Date isolation prevents later games or the selected game from leaking into a historical grade.

### Pitcher quality

Pitcher quality combines league deciles for ERA, WHIP, and K/9, requiring complete verified inputs. Lower ERA/WHIP and higher K/9 are better. Handed variants can use direct player split data when aggregate MLB results omit the pitcher.

### Power / Vision / Study

- Power: handed SLG/power quality.
- Vision: handed OBP/out-avoidance quality.
- Study: handed usage/sample volume, not performance.

Study controls uncertainty radius in triangle plots. It is not a performance vertex.

### HR-history triangles

Historical batter and pitcher HR events are calculated using information available through the day before each event. Current opponent/lineup entries may be added as context points but do not alter historical averages.

- Position shows the relative balance of three traits.
- Marker size and brightness show absolute quality.
- Left-handed players use circular points; right-handed players use square points.
- Team color fills each point.
- Thick black outlines identify events in the player's last three games.
- Gold stars identify today's relevant opposing lineup/pitcher.
- Tight clusters cycle on left click.
- Hover shows portrait, identity, raw metrics, grades, and year-wide/trait bars.
- Middle-click or long hold pins the tooltip; Escape/click-away dismisses it.

Key code families include lineup HR score snapshot functions, league decile fetchers, `pitcherQuality*`, HR grade history functions, `hrGradeTriangle*`, and `renderPlayerStatGradeBars()`.

## 9A. Player Overall Rating system

The shared rating engine answers how good a player is now relative to MLB on a 1-100 nonlinear scale. It is distinct from the heavy-only letter-grade/triangle system and can be used by the light page.

Hitter outputs:

- Overall.
- Versus RHP.
- Versus LHP.

The established hitter component compares SLG (28%), AVG (16%), OPS/overall production (24%), HR per plate appearance (18%), and XBH per plate appearance (14%) against the corresponding MLB population. Every input becomes a league percentile before it is combined; there are no fixed stat cutoffs.

Season hitter Overall and handedness ratings now contain established season ability only. Current form is deliberately excluded because it is displayed independently as the last-14-day superscript. This keeps the main number stable and interpretable while the superscript shows how differently the player is performing now.

Handed season samples regress toward the hitter's overall established ability with reliability `PA / (PA + 110)`. This prevents a few plate appearances against one pitcher hand from producing an extreme rating. Overall combines the finished handed ratings as approximately 73% versus RHP and 27% versus LHP.

The percentile-to-rating curve is nonlinear around league-average 50. Its upper half uses a more open power curve than its lower half, allowing good and very-good players to separate into the 70s and 80s instead of clustering below 70, while 50 remains anchored to league average. The climb compresses again near the ceiling and ordinary computed ratings remain capped below 100, so leading MLB does not automatically produce a perfect score. Ratings map to descriptive bands: 90+ Elite, 80s All-Star, 60-79 above average, around 50 league average, and lower values below average.

Light lineup batter rows place a compact rating pill immediately to the right of position. A vertical divider separates current `OVR` from the handed matchup rating (`vR` or `vL`, selected from the opposing pitcher's hand). Each current number has a smaller superscript containing the corresponding league-relative last-14-day form rating. This is a recent-performance rating, not the player's rating frozen at a historical date. Lineup pills share cached league-window rows for the whole lineup rather than issuing redundant stat requests. The 17px pill fits within the existing first line and does not establish row height.

For hitters, the player-card header strip begins with numeric `OVR`; its superscript is the league-relative last-14-day Overall. YEAR WAR and the existing trait bars follow. Pitchers instead receive a larger highlighted Overall badge in the dedicated header slot between player identity and the trait strip. Its main number is season/current Overall and its superscript is last-three-outing Overall. The last-three calculation aggregates the pitcher's actual three most recent starts/appearances using ERA, WHIP, K/9, HR/9, and workload, then compares that line with the recent MLB pitching population. The light hitter card's Overall, vs RHP, and vs LHP tiles use the same current-number plus L14-superscript convention.

Pitcher recent-HR-allowed cards use this engine for the batter who homered. The card tooltip formats the matchup line as `{batter name} ({hand}) ({Overall}{L14 Overall superscript} OVR) ({rating versus pitcher hand} vP)`. A right-handed pitcher selects the hitter's `vsRHP`; a left-handed pitcher selects `vsLHP`. The event retains game/opponent context and pitch type/detail. Cycling a stack switches the tooltip and all ratings to the newly selected HR.

Batter recent-HR cards perform the inverse lookup. They calculate the opposing pitcher's season Overall/vs RHB/vs LHB profile from opponent SLG, opponent AVG, HR/9, K/9, WHIP, and ERA league percentiles. The batter's side selects `vsRHB` or `vsLHB`, with small-sample regression toward established Overall but no recent-form blend. Their matchup line is `{pitcher name} ({hand}) ({Overall}{L3 Overall superscript} OVR) ({rating versus batter hand} vP)`. Both HR directions use a three-line immediate tooltip: event timing/context, rated opponent line, then pitch detail. These HR-card tooltips intentionally bypass the normal 1.5-second sitewide hover delay.

Pitcher quality is not treated as rate statistics in isolation. After opponent SLG, opponent AVG, HR/9, K/9, WHIP, and ERA are combined, the result is stabilized by innings/workload. A large starter sample therefore provides more confidence than the same ERA in a short sample. Strong starter performance also receives a bounded value adjustment based on games-started share and workload percentile. The adjustment only magnifies above-average quality; innings cannot turn poor run prevention into a strong rating. This makes a 2.00 ERA across a substantial rotation workload more significant than 2.00 in a brief sample or relief-only role while still allowing elite closers to rate well.

Code: `getHitterOverallRatings()`, `getHitterOverallRatingsFromLeagueRows()`, `getHitterRecentRatings()`, `getPitcherOverallRatings()`, `getPitcherLastThreeOverallRating()`, hitter/pitcher rating normalization and percentile helpers, `playerRatingFromPercentile()`, `lineupOverallRatingPillHtml()`, `hydrateLineupOverallRatingPills()`, `hydratePlayerHeaderGradeBars()`, `lightBatterMetricHtml()`, the `playerOverallRatingCache`, `getPitcherRecentHomeRunHistory()`, `getLineupRecentBattingStats()`, and `homeRunHistoryCardHtml()`.

## 10. Leaders, Team Stats, Playoff Picture, Hot, and Predictions

### Leaders

Leader definitions include hitting and pitching categories. Visible examples include AVG/OPS and pitching ERA/WHIP/K/9; category definitions live in the leader configuration near the top of `live-dashboard-prototype.js`. Filters include date range, team, position, qualifier, and opponent context. Rows open player cards.

### Team Stats

Team-stat tables use sortable headers and MLB team aggregates/standings. Opening a team exposes a four-score rating panel in the identity side of the team header:

- `BAT vLHP`: average vs-LHP rating of the nine hitters selected for the displayed left-handed-pitcher lineup.
- `BAT vRHP`: average vs-RHP rating of the nine hitters selected for the displayed right-handed-pitcher lineup.
- `STARTING`: average Overall of the classified starting rotation.
- `BULLPEN`: average Overall of the classified relief group.

Each unit first calculates its underlying player-rating average, but that raw average is not displayed directly. The dashboard builds the equivalent unit averages for all MLB teams, locates the selected club within that league distribution, and displays its decile as a 10–100 team score. The superscript independently ranks the unit's last-14-day average against every team's corresponding last-14-day unit. This prevents the unavoidable lower end of a full roster from compressing nearly every team around the same mediocre raw average. The panel still uses the shared player rating engines rather than translating team AVG or ERA through fixed thresholds.

Every player row in the team detail also ends with a current/recent rating pill. Batter rows use the handed score appropriate to their panel: `vL` in Lineup vs LHP and `vR` in Lineup vs RHP. Starting-pitcher and bullpen rows use pitcher Overall. The smaller superscript is that player's last-14-day rating. Batter score resolution uses the detailed handed profile first, then the shared league-window handed score, player Overall, and finally recent rating as progressively broader fallbacks. A missing split endpoint therefore does not produce `--` when other valid player data exists. These pills occupy a fixed right-edge column so names, positions, and stat lines remain aligned.

Team-detail heat coloring is derived from the same recent rating shown in the superscript. A score near league-average 50 is visually neutral. Scores below 50 move continuously toward blue, scores above 50 move continuously toward orange, and the strength of the tint is proportional to the distance from 50. The prior fixed batter OPS/AVG and pitcher earned-run thresholds remain only as a fallback when rating data is unavailable.

Rendering, sorting, and formatters are in the `teamStats*` function family. Team-detail rating code is in `getTeamDetailRatings()`, `getTeamDetailLeagueRatingDistributions()`, `teamDetailLeagueUnitAverages()`, `teamDetailLeagueDecileScore()`, `teamDetailRatingsHtml()`, `teamDetailRatingCardHtml()`, `teamDetailRowRatingHtml()`, `teamDetailRatingToneStyle()`, and `getPitcherRecentWindowOverallRating()`.

### Playoff Picture

Displays AL/NL seeded teams and In The Hunt tables. Fields include seed, team, role/path, record, winning percentage, games back, and L10. Data comes from MLB standings.

### Hot-player surfaces

Hot/cold player cards use recent hitting metrics including H-AB, AVG, SLG/OPS, XBH, HR, and contextual matchup values. They reuse the lineup thresholds and open player cards.

### Predictions

Prediction/detail surfaces can use:

- Batter L5 and L10 AVG/SLG/OPS.
- Batter season AVG/SLG/OPS.
- XBH, HR, RBI and recent form.
- Team L5 AVG/SLG/OPS.
- Starter season ERA, WHIP, HR/9, and K/9.
- Starter recent ERA/WHIP and HR/9/K/9.
- Opponent lineup heat/coldness.
- Bullpen and team context.
- Moneyline-style comparison reasons and component points.

Prediction snapshots and hitting prediction caches are date-scoped. Manual picks remain independent from model output.

Code: `predictionPointPart()`, prediction metric/build/render functions, moneyline comparison helpers, `prediction-snapshots:v1`, and `hitting-predictions-cache:v1`.

## 11. Data sources and exact pull responsibilities

### MLB StatsAPI (`statsapi.mlb.com/api/v1`)

Used for:

- Schedule, status, teams, probable pitchers, doubleheaders, scores, and game identifiers.
- Standings, records, playoff picture, and team streak/recent schedule audits.
- Box scores and player pools.
- Player biography/profile and handedness.
- Season, date-range, game-log, handed, situational, and opponent splits.
- Team hitting/pitching aggregates.
- Rosters.
- Player search/name-to-ID resolution.
- Prior games, series history, and starter usage.

Base constant: `MLB_API_BASE`. Calls are distributed across `getJson()` users; endpoint construction is readily searchable by `new URL(`${MLB_API_BASE}``.

### MLB live feed (`statsapi.mlb.com/api/v1.1`)

`/game/{gamePk}/feed/live` supplies live scores, inning/count/bases, plays, pitches, substitutions, current batter/pitcher, official lineups, boxscore-like player state, and home-run event detail. Base constant: `MLB_API_BASE_LIVE`; primary cached loader: `getLiveGameFeed()`.

### Baseball Savant / Statcast

Used for pitch-type results, exit velocity, pitch velocity buckets, batted-ball direction/profile, average bat speed, HR distance, pitch details, and specialized analytical inputs. URLs use `statcast_search/csv`, `savant-player/{id}`, and the custom leaderboard. Savant work is cached and aggressively gated on the light page.

### RotoWire

Used only as a lineup projection/fallback layer when official MLB lineups are unavailable or incomplete. Resolution order considers:

1. Official/current lineup.
2. Fresh RotoWire today batting-order extraction.
3. Dynamic published seed for team and opponent hand.
4. Static hand-specific seed.
5. Recent same-handed official lineup / prior completed lineup.

The app fetches `rotowire-current-defaults.json` with `cache: no-store`, timestamps refresh attempts, invalidates date-specific in-memory promises, and keeps a short TTL for batting-order pages. Parsed names are validated, deduplicated, assigned slots 1-9, resolved to MLB IDs, and locked to the correct team side.

Code: `refreshPublishedRotowireSeeds()`, `refreshVisibleRotowireLineups()`, `fetchRotowireProjectedBattingOrder()`, `parseRotowireTodayBattingOrder()`, `seededRotowireDefaultBattingOrder()`, and `fetchMlbStartingLineupFallback()`.

### Supabase

- Authentication/session persistence via shared sync helper.
- Immutable manual Save history.
- Remote heatmap CSV storage.

Login status is owned by the shared durable session helper and should survive ordinary page refreshes. The dashboard must not clear auth/session keys during date or scoreboard resets.

## 12. Caching, refresh, and performance

- Schedule/game cards cache under date-scoped `games:*` and archive keys.
- Home runs cache under `hrs:{date}`.
- Analytics indexes cache by day and aggregate recent player/matchup data.
- Player profiles, game logs, handed splits, Savant data, rankings, team form, and predictions use in-memory promise/result caches.
- Network helpers apply timeout, no-cache parameters where required, TTL decisions, and failure fallbacks.
- Cards use render and live-state fingerprints so unchanged DOM is retained.
- Lineup prewarm has lanes and concurrency limits; player-stat work does not compete indiscriminately with lineup-source work.
- Heavy analytical work is delayed/backgrounded.
- Active/live games poll at a short interval (approximately three seconds while visible); non-live data refreshes less aggressively.
- Visibility and interaction holds prevent passive updates from replacing UI while the user is actively manipulating an overlay.

Performance diagnostics are exposed through the stats-profiler functions near the top of the JavaScript (`statsProfilerRecord()`, summary/export/panel helpers).

## 13. Persistence and manual state

### UI preference keys

- `dashboard-date:v1`
- `panel-layout:v2`
- `overlay-dock:v1`
- `overlay-size:v2`
- `scoreboard-columns:v2`
- `overlay-theme:v1`
- `overlay-page:v1`
- `lineup-open:v2:{date}`
- `lineup-view:v1:{date}`
- `lineup-stat-window:v1`
- `player-stat-recent-window:v1:{date}`
- `player-stat-season-recent-days:v1`
- `prediction-sort:v1:{date}`
- `mlb-game-visibility:v1`

### User-authored/manual keys

- `bets:v2:all`
- `player-tracker:v1:{date}`
- `player-tracker-backup:v1`
- `pending-game-picks:v1:{date}`
- `tossup-scoreboards:v1:{date}`
- `locked-tossup-scoreboards:v1:{date}`
- `over-under-scoreboards:v1:{date}`
- `manual-state-current:v1:{date}`
- `manual-state-backup:v1:{date}`
- `manual-state-mirror:v1`
- `manual-state-durable:v1`
- `manual-state-last-push:v1`

Local manual state remains in memory/storage until direct user input or an explicit loaded Save replaces it. Passive scoreboard data must never erase picks, over/under markers, tracked players, expectations, confidence, order, or login state.

### Data/cache keys not intended for manual Save payloads

- `games:*`
- game archives.
- analytics-day indexes.
- `hrs:*`.
- prediction caches/snapshots.
- pitcher start memory.
- home-run audio played IDs.
- RotoWire dynamic lineup source.

## 14. Save, Load, and durable login

Each HTML entrypoint defines `window.OWENTOOLS_SYNC` with tool ID `baseball-dashboard`, manual-only operation, and immutable save history. It then loads Supabase config and `../shared/owentools-sync.js`.

### Save payload

An explicit Save snapshot contains the selected dashboard date and normalized copies of:

- Tracked players, including expectation/confidence/order fields.
- Pending game picks.
- Tossup/near-lock/lock state.
- Over/under markers.

It does not upload schedule cards, feeds, analytics, or other large caches.

### Save behavior

1. `window.MLBDashboardManualSyncBridge` serializes current in-memory state.
2. A unique `manual-save:v2:{date}:{timestamp}:{id}` row is inserted.
3. Prior saves remain immutable and are not deleted or overwritten.
4. Save history refreshes for the current date.

### Load behavior

- Quick Load selects the newest save for the selected date.
- The split Load/history control lists every save for that date.
- Loading replaces current manual state; it does not merge with newer local values.
- Local recovery stores are updated.
- Picks, locks, over/under markers, and tracker repaint immediately.
- Loading does not mutate the saved row.

### Authentication

Supabase login/session persistence is managed by the shared helper. Ordinary refresh, live polling, date changes, and local manual-state restoration must leave the session intact. If login begins resetting, inspect `../shared/owentools-sync.js`, its storage/session options, and any code that clears broad localStorage ranges.

## 15. Tooltip and interaction rules

- Sitewide hover tooltips wait 1.5 seconds before appearing, except recent-HR stack cards, which appear immediately.
- Confidence has no tooltip.
- Elements deliberately marked tooltip-free, including certain main pitcher/player name labels, do not receive generic inferred tooltips.
- Leaving before the delay cancels display.
- Middle-click pins supported analytical/HR tooltips.
- Long hold can pin supported graph/analytical tooltips and displays perimeter progress.
- Escape and click-away dismiss pinned tooltips.
- Middle-click suppresses browser autoscroll where it is used for tooltip pinning.
- Recent-HR left click cycles the selected event and updates its tooltip.

Code: global tooltip scheduler/manager functions, pin/hold helpers, HR stack handlers, and graph tooltip handlers.

## 16. Formatting and visual system

### Team identity

- `getTeamColor()` and `getLogoPath()` provide canonical team styling.
- `canonicalTeamAbbrev()` resolves abbreviation variants.
- Team color drives card edges, names, pills, tracker pitcher links, graph points, portraits, and modal accents.
- Player names in lineup rows use a 2px black stroke plus black directional shadow for legibility over hot/cold backgrounds.

### Numeric formatting

- AVG/OBP/SLG commonly omit the leading zero (`.269`).
- OPS retains the leading zero where context requires (`0.801`) and may use three decimals.
- ERA, WHIP, HR/9, and K/9 generally use two decimals.
- Innings preserve baseball thirds (`6.1`, `6.2`) via outs conversion, not decimal-tenths arithmetic.
- Ranks use ordinal formatting and can be paired overall/recent.
- Missing values use `---`, `--`, or context-specific loading text rather than fabricated zeroes.
- H-AB is always hits-at-bats, not a record.
- XBH is extra-base hits.

Core formatters: `formatRateValue()`, `inningsToOuts()`, `outsToInnings()`, `rankOrdinal()`, `statNumber()`, and `statRate()`.

### Handedness

- Batter `L/R/S` and pitcher `L/R` are normalized by `handednessCode()`.
- Recent-HR cards use rounded corners for left-handed participants and sharp corners for right-handed participants.
- Heavy graph shapes use circle for left and square for right.
- RotoWire seed selection uses the opposing pitcher's throwing hand.

### Hot/cold treatment

- Light hitter scale is blue → neutral → orange across `.000` to `.900+` recent OPS.
- Light pitcher scale is orange → neutral → blue across `0.00` to `7.00+` recent ERA.
- Ice/fire extremes add texture/glow.
- Tracked + fire is frozen to eliminate alternating repaint flicker.
- Current/up-now/tracked states add borders and inset indicators without changing row height.

### Responsive behavior

- Topbar controls wrap at narrow widths.
- Mobile tabs remain reachable independently of desktop tabs.
- Scoreboard columns reduce with available space.
- Lineup rows change grid areas while preserving slot/name/stats/today/position.
- Tracker/feed SWAP sets mobile order explicitly.
- Tracker confidence remains a touch-friendly vertical range.
- Tracker reorder uses pointer capture only from the handle.
- HR stacks and their second row remain inside fixed indicator width/row height.
- Player cards and live lineup areas become internally scrollable rather than expanding beyond the viewport.

### CSS ownership

Search `live-prototype.css` by these stable prefixes:

- `.game-visibility-*`: today-only hide menu.
- `.game-card`, `.score-state-*`: scoreboard.
- `.lineup-*`: lineup overlay and rows.
- `.light-lineup-ops-tone`, `.light-pitcher-era-tone`: light scales.
- `.player-track-*`: tracker.
- `.home-run-*` / `.hr-*`: feed and HR indicators.
- `.player-stat-*`: player modal/tables/tabs.
- `.light-player-*`: light replacement metrics.
- `.hr-grade-*`, `.graph-point-*`: heavy triangles and tooltips.
- `.global-player-search-*`: search overlay.

## 17. Code locator index

| System | Primary JavaScript locators |
| --- | --- |
| Startup/DOM | Top-level element constants and initialization block |
| Date picker | `parseFlexibleDateInput`, `renderDatePicker`, `refreshForSelectedDate` |
| Hide menu | `visibilityStateForGame`, `syncGameVisibilityControl` |
| Network/cache | `getJson`, `getText`, request TTL/timeout helpers |
| Schedule/card lifecycle | `loadGames`, `finalizeRenderedGames`, `upsertCard`, `updateScoreboardLiveCard` |
| Live feed/boxscore | `getLiveGameFeed`, `getGameBoxscore`, live normalization helpers |
| Teams/standings | `getTeamStreakMap`, `getTeamLastSevenRecord`, team stats/standings functions |
| Probable pitchers | `resolveOfficialPregameProbablePitchers`, duplicate/TBD fallback helpers |
| RotoWire | `refreshPublishedRotowireSeeds`, `fetchRotowireProjectedBattingOrder`, parse/seed helpers |
| Lineup normalization | `normalizeLineupEntryForSide`, `normalizeLineupCollectionForSide`, duplication repair |
| Lineup rendering | lineup render functions near the final third of the file |
| Recent HR stacks | recent-HR fetch/hydrate/render/cycle helpers and delegated events |
| Bullpen | bullpen summary/rank helpers and reliever usage functions |
| Manual picks | pending-pick restore/save/sync functions |
| Tossup/lock | tossup storage and cycling functions |
| Over/under | over-under storage/restore/sync functions |
| Tracker | `renderPlayerTrackerList`, `trackedPlayerOpponentPitcher`, tracker events |
| HR feed/audio | HR extraction/render/update/audio functions |
| Player cards | `openPlayerStatOverlay`, player profile/stat fetch/render families |
| Light metrics | `lightBatterMetricHtml`, `getLightBatterMetrics`, `lightBatterMetricsFromRows` |
| Outcomes | player-outcome loader/render/event family |
| Heatmaps | player/pitcher heatmap loader/normalizer/render family |
| Contracts | contract load/render family |
| Grades/triangles | lineup HR snapshot, league decile, pitcher quality, HR triangle families |
| Predictions | prediction build/score/detail/render families |
| Save bridge | manual snapshot normalize/create/apply and `MLBDashboardManualSyncBridge` |
| Tooltips | global delayed tooltip scheduler plus pin/hold helpers |

## 18. Maintenance rules

1. Update both production HTML cache-busting query strings whenever shared CSS or JavaScript changes.
2. Preserve the light feature gate: do not perform disabled heavy calculations in the background.
3. A new manual field must be added to normalization, local save, backup/mirror/durable state, snapshot creation, snapshot counts, and snapshot application together.
4. Load means replace, never merge.
5. Never overwrite or delete immutable Save rows as a side effect of Save/Load.
6. Do not clear login/session state during scoreboard resets.
7. Keep official team/game identity attached to probable pitchers, players, and lineup entries; name-only matching is fallback, not authority.
8. Treat innings as outs internally.
9. Do not manufacture grades or stats when required inputs are missing.
10. Keep historical calculations date-isolated through the day before the event/game.
11. Keep live passive repaint separate from user-authored state writes.
12. When adding a filter, apply it consistently to the scoreboard and dependent tracker/feed panels.
13. Tooltips should use the shared 1.5-second scheduler unless explicitly exempt or direct-click driven.
14. New row indicators must not change established lineup row height.
15. Validate desktop and phone pointer behavior, especially drag handles, vertical ranges, SWAP, card stacks, and pinned tooltips.

## 19. Verification checklist

- Open both `heavy_mlb.html` and `light_mlb.html`; verify the latter performs no pitch/velocity/triangle/power work.
- Change away from today; verify Hide disappears entirely.
- On today, hide each game state and verify its tracker rows disappear too.
- Refresh; verify hide selections, tracker confidence/order/expectation, picks, over/under, and login persist.
- Track a `.900+` OPS player; verify the lineup fire state stays static rather than blinking.
- Press the tracker opponent pitcher; verify the pitcher card opens and name uses opponent team color.
- Check a multi-HR player and pitcher; verify every card edge is visible, centered, cycles correctly, and row height does not change.
- Verify HR tooltips contain opponent identity/hand and pitch type when source data exists.
- Verify sitewide hover tooltips wait 1.5 seconds and confidence shows none.
- Save, change manual state, Quick Load, and confirm exact replacement.
- Open an older save and confirm newer saves remain.
- Compare final-game recent records against the exact audited MLB games.
- Run syntax/format checks and `git diff --check` before publishing.
