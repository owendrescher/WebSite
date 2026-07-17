# Baseball Dashboard Write-Up

## Purpose

This site is a live MLB dashboard for tracking daily games, probable starters, lineups, predictions, player props, and manual betting/tracking notes. The main experience is the scoreboard: each game card gives a compact game state, team context, pitcher and hitter context, manual pick controls, and links into deeper lineup and player analysis.

The tool is meant to support live decision-making before and during games. It combines cached schedule/game data, MLB StatsAPI data, RotoWire fallback lineup data, local user state, and cross-device sync.

## Main Screens And Workflows

### Scoreboard

The scoreboard is the primary screen. Each game card shows:

- Away and home teams with logos, records, streak badges, and scores.
- Pregame probable pitcher lines with handedness, ERA, and pitch-count tags when available.
- Live count/state strip once a game starts.
- Manual game pick state, including selected teams and live hit/miss or leading/trailing styling.
- Tossup/near-lock/lock states for pregame games.
- Over/under lean controls.
- Pregame yellow HR-risk sheen when at least one displayed starter has allowed 3 or more HR over his last 3 starts.
- Team-colored underline/highlight on the offending pitcher line when the HR-risk sheen is active.

The yellow HR-risk sheen is pregame-only. It should disappear once the game reaches scheduled/game-start state.

### Lineup View

The lineup overlay opens from a scoreboard card and gives a deeper game-level view:

- Projected or confirmed batting orders.
- Batter handedness, position, today status, recent stat badges, streak markers, hot/cold indicators, HR indicators, and matchup flags.
- Opposing pitcher context and pitcher markers.
- Team bullpen cards with overall and last-14-calendar-day IP, ERA, WHIP, HR/9, and K/9 plus MLB ranks for both windows. Values use `overall/14D - overall rank/14D rank`.
- Lineup HR score buttons and prediction detail links.
- Manual game pick and over/under controls mirrored from the scoreboard.
- Tracked player styling in the lineup row when a player is added to the player tracker.

The lineup view tries confirmed lineups first, then fallback/projected sources when needed.

### Player Cards

Player cards provide individual player analysis.

For hitters, the card includes:

- Season and recent batting stats.
- Recent game windows.
- Handedness splits.
- HR and extra-base indicators.
- Matchup and heatmap-style context.

For pitchers, the card includes:

- Season and recent pitching stats.
- Last 3 starts or appearances, depending on role.
- Pitcher rank context.
- Opponent strength context.
- Average Stamina, shown as average IP and average pitches per appearance/start.
- Ext. W-L, which counts whether the pitcher's club won games he started, independent of pitcher decision W-L.
- Last-start/HR risk details and pitcher heatmap sections.

Pitcher names themselves do not carry hover tooltips. Indicator badges and analytical cells may still provide their own focused explanations.

### Player Tracker

The tracker lets you mark players to monitor across games. Tracked players are saved locally and synced. When a tracked player appears in the lineup view, the corresponding lineup slot gets a visual effect so the player is easier to spot.

Tracked player state is date-scoped and backed up through multiple manual-state stores.

The Player Tracker and Home Run Feed can be swapped vertically with either **SWAP** control. Each panel also has a persisted **compact** mode. Both compact feeds use the same 48px row height. Compact player rows show a small inline portrait with a slight inset so the face remains prominent, the player's last name in its existing team/status color, live daily statline, and a right-aligned remove button. Compact home-run rows show the team logo, a team-colored player last name, season HR number, footage, and inning. The Home Run Rating display is fixed to letter grades and no longer exposes a style toggle. The former tracker count indicators and bulk Clear Tracker button are intentionally hidden; players are removed individually. These display preferences are local UI settings and are not part of manual save snapshots.

The player-card recent-days selector is intentionally trim and has an accessibility label without a hover tooltip.

Player tracker statlines repaint during passive live-game refreshes; a full page refresh is not required.

### Live Refresh And Event Ordering

- Active games poll approximately every 3 seconds while the page is visible.
- Passive refreshes repaint scoreboards, the player tracker, and the home-run feed.
- Pitch events retain MLB's chronological event index/time ordering so ball, strike, in-play, and completed-play calls advance in sequence.
- Administrative events such as game advisories, mound visits, reviews, and status changes remain in chronological source data but are excluded from the transient baseball-event flash, preventing an old advisory from repeatedly presenting as the newest play.

### Lineup Power Grades

Numeric lineup HR scores have been replaced by date-isolated power grades. The grade compares each hitter's SLG with the eligible MLB hitter population in four windows ending on the day before the selected dashboard date, converts each window to a league decile, and weights them as follows:

- Season-to-date: 50%.
- Last 30 days: 25%.
- Last 14 days: 15%.
- Last 3 days: 10%.

The weighted 0-100 result maps to grades from A+ through F. Clicking a grade shows every window's decile and the exact as-of date, which makes historical hot stretches independently auditable without using the selected game or later games. Grade tooltips remain on one line. League snapshots are cached by explicit start/end date. The dashboard style picker has been removed and the established team-tone style is now fixed.

Power grades are handedness-specific. A lineup hitter is ranked only against league SLG distributions for the opposing starter's throwing hand (`vs LHP` or `vs RHP`). Pitcher quality grades are split versus left-handed and right-handed batters and display both values as `L:{grade} R:{grade}`. HR-opponent averages use the handedness that applied to the actual HR matchup.

Pitcher cards use one compact team-colored quality grade built from equal-weight league deciles for ERA, WHIP, and K/9 through the day before the selected game. Lower ERA and WHIP rank higher; higher K/9 ranks higher. All three verified MLB results are required, so incomplete rows display unavailable rather than receiving a manufactured grade. The pitching table places `HR Hitters Grades` directly below Average Stamina using `Power/Vision/Study`.

MLB handed pitching aggregates can omit a target player's WHIP even when the league response contains other pitchers. The grade resolver therefore fetches the pitcher's own handed WHIP directly and injects it into the league distribution. When the handed population is sparse or the direct split is unavailable, it falls back to the overall eligible WHIP population rather than treating a missing record as an F.

For current-day cards, a missing date-range handed WHIP also tries MLB's season situational split before falling back. Pitcher `vL`/`vR` chips use the pitcher's team color.

`Vision` is a hidden handedness-specific OBP-decile grade representing overall difficulty of recording an out. `Study` is based strictly on handed at-bat volume relative to the most-used eligible league hitter, with near-full usage in the A range and lower grades as volume falls. The grade detail dialog presents a player portrait and colorful Power, Vision, and Study headings while retaining all isolated-window math.

`HR Hitters Grades` scans every pregame season appearance in which the pitcher allowed a home run, resolves the individual HR events, and deduplicates the hitters. Grades are calculated through the day before each HR, not merely at the currently selected date. Hovering the aggregate opens a triangular Power/Vision/Study plot with internal guide lines and nonlinear placement toward a dominant vertex. The batting table's `Avg HR Pitcher Grade` opens a historical event plot whose axes are pitcher quality (ERA/WHIP/K9 composite), batter heat, and pitcher studyability. Batter heat is 70% the hitter's league-decile SLG during the three calendar days before the HR plus a 30-point bonus for homering in the previous game. Every pitcher-quality and heat result is calculated through the day before that specific HR, and incomplete points are omitted rather than assigned invented values. The compact pitcher directory contains only full name, throwing hand, and SP/RP/CP role. Left-handed players use circular points and right-handed players use square points on both graph types. Every point uses that player's team color; the opaque portrait tooltip carries the same color on its border, glow, portrait, and player name. Home runs occurring during the applicable player's last three games use a thick black point outline. Gold stars sit directly inside the corresponding graph points for every loaded hitter in today's opposing lineup and today's probable/current opposing pitcher. The star and shape are one interactive SVG target, so either surface opens the same player's portrait tooltip. Current matchup entries are added as contextual graph points when they are absent from the historical HR set, but are excluded from historical average calculations. Matchup discovery first resolves the open pitcher to the actual away/home pitching slot, then selects the opposite lineup. It falls back to the same RotoWire seed used by the dashboard and resolves name-only entries to MLB player IDs before plotting. All themed tooltips can be pinned until click-away by middle-clicking or holding the source/tooltip for three seconds; a perimeter trace shows hold progress, middle-click suppresses browser auto-scroll, and Escape dismisses the tooltip.

The triangle axes now model the interaction directly. On batter cards, opposing pitchers are positioned by isolated power allowed (`SLG allowed - AVG allowed`), contact allowed (opponent AVG), and the batter's pre-HR heat. On pitcher cards, HR hitters are positioned by handed power, handed contact AVG, and the pitcher's pre-HR heat. Pitcher heat weights the immediately preceding appearance 60%, the second 25%, and the third 15%, combining runs, baserunners, and strikeout rate. Study is no longer a vertex or performance grade: it controls a translucent team-colored uncertainty radius, which expands as the relevant hitter or pitcher has less studyable usage history.

Triangle placement uses F as the zero baseline and normalizes each letter-grade band's distance above F. This uses the complete triangle: A+/F/F lands at the top vertex, F/A+/F at the lower-left vertex, and F/F/A+ at the lower-right vertex. F/F/F has no dominant component and therefore falls back to the centroid. Raw metric values remain available in the point portrait tooltip. Pitcher names inside batter series-history cards retain a portrait/handedness/series-statline tooltip; the separate main player-name header remains tooltip-free.

Lineup L5/L7/L10/L15 team records are derived from a strict MLB regular-season schedule audit through the day before the selected matchup. Each result resolves the requested club primarily by MLB team ID, then requires an explicit `isWinner` boolean or a non-tied final score. Postponed, tied, and unresolved games are excluded rather than treated as losses. The exact audited game IDs are reused for the accompanying AVG, SLG, OPS, and ERA box-score aggregates so the record and statistics always describe the same window. Local-cache fallback follows the same requested window and never silently substitutes L7 for L5. The recent-form cache is versioned when this resolution logic changes. A July 16, 2026 verification produced BOS L5 5-0 and TB L5 3-2 from MLB's July 8-12 finals.

Pitcher opponent-history cards show only the HR hitter's last name and handedness. Hovering that compact label shows the hitter portrait, full name, handedness, and Power/Vision/Study grades as they stood when the HR occurred.

### Predictions And Picks

The dashboard includes prediction surfaces and manual pick controls:

- Manual game picks are stored separately from prediction output.
- Picked teams get visual live result states such as leading/trailing or hit/miss.
- Prediction pages and detail panels explain model-derived team/player views.
- Manual game picks are included in each explicit save snapshot.

### Tossup, Near-Lock, And Lock States

Pregame games support a three-step manual confidence ladder:

1. Tossup: yellow state.
2. Near-lock: unlocked emoji and intermediate color.
3. Lock: gray lock state.

This uses the existing tossup and locked tossup storage sets, and both are captured in every save snapshot.

### Over/Under Controls

Pregame score strips support under/over markers. These are mirrored into lineup views and synced with the rest of manual game state.

## Data Sources

The site uses several data layers:

- MLB StatsAPI for schedule, live game feed, player stats, game logs, standings, rosters, and probable pitcher data.
- RotoWire/projected lineup fallbacks when official lineups are incomplete.
- Local cached schedule/game data for fast rendering.
- Player profile and stat caches to avoid repeated network work.
- Supabase-backed immutable save history for cross-device Save and Load.

The app favors quick first paint, then hydrates heavier details in the background.

## Local Storage And Manual State

The app stores both volatile data and user-authored manual state. Local dated keys drive the active UI and provide recovery copies. Cross-device persistence uses immutable Supabase save rows rather than continuously synchronizing or merging localStorage.

Important manual keys include:

- `manual-save:v2:{date}:{timestamp}:{id}` (Supabase save-history row)
- `manual-state-current:v1:{date}`
- `manual-state-backup:v1:{date}`
- `manual-state-mirror:v1`
- `manual-state-durable:v1`
- `player-tracker:v1:{date}`
- `player-tracker-backup:v1`
- `pending-game-picks:v1:{date}`
- `tossup-scoreboards:v1:{date}`
- `locked-tossup-scoreboards:v1:{date}`
- `over-under-scoreboards:v1:{date}`
- `rotowire-dynamic-lineup-source:v1`
- `lineup-stat-window:v1`
- `player-stat-season-recent-days:v1`

Heavy schedule/cache keys such as `games:`, `games-archive:`, `analytics-day:`, and `hrs:` should not be synced.

## Save And Load

### What A Save Contains

Each save is a complete snapshot for one selected dashboard date:

- Tracked players.
- Game picks.
- Tossup/near-lock/lock states.
- Over/under markers.
- The dashboard date associated with the snapshot.

Large schedule, game, analytics, and home-run-feed caches are never included.

### How Save/Load Is Wired

The HTML page defines `window.OWENTOOLS_SYNC` before loading the shared sync helper:

```js
window.OWENTOOLS_SYNC = {
  toolId: "baseball-dashboard",
  label: "Baseball dashboard",
  manualOnly: true,
  saveHistory: true,
  saveHistoryPrefix: "manual-save:v2:",
  include: [
    "manual-save:v2:",
    "manual-state-last-push:v1",
    "rotowire-dynamic-lineup-source:v1",
    "lineup-stat-window:v1",
    "player-stat-season-recent-days:v1"
  ]
};
```

Then it loads:

```html
<script src="../shared/owentools-sync.js?..."></script>
```

The dashboard exposes `window.MLBDashboardManualSyncBridge`. Before Save, the shared helper asks the dashboard to create a snapshot from current in-memory state. The serialized snapshot is inserted directly into Supabase; localStorage is not used as the transport layer.

### Save Flow

1. The user selects a dashboard date and changes manual state.
2. The user clicks **Save**.
3. The dashboard serializes the current tracker, picks, tossup/lock states, and over/under selections.
4. The helper inserts a new unique `manual-save:v2:{date}:{timestamp}:{id}` row.
5. No previous row is updated or deleted.
6. The widget reports the save time and refreshes the history for that date.

### Load Controls

- **Quick Load** restores the newest save for the currently selected dashboard date. The smaller italic line beneath the label shows its save time.
- The right half of the split Load control opens every save for the currently selected date.
- Each history entry shows its timestamp, dashboard date, and counts for picks, tracked players, tossups, and over/under selections.
- Changing the dashboard date changes which saves are shown. Saves from other dates are not mixed into the list.

### Load Flow

1. The helper queries immutable `manual-save:v2:` rows for the signed-in user.
2. It filters them to the currently selected dashboard date and sorts newest first.
3. Quick Load chooses the first row; a history click chooses that exact row.
4. The serialized value is passed directly to the dashboard bridge.
5. The dashboard replaces its current in-memory manual state with the saved snapshot.
6. It updates local recovery keys and repaints the tracker, picks, tossup/lock, and over/under UI.
7. Loading never changes or deletes the saved row.

### Save/Load Health Checklist

1. Confirm the widget is signed in.
2. Confirm the page build and shared-helper query strings are current.
3. Confirm `saveHistory` is enabled and `manual-save:v2:` is included.
4. Select the intended dashboard date before saving.
5. Make a pick, Save, remove the pick, then Quick Load. The pick should return.
6. Repeat with a tracked player, tossup/lock state, and over/under selection.
7. Open the Load list and confirm only saves for the selected date appear.
8. Confirm an older history entry restores that exact snapshot without removing newer saves.

### Safe Rules For Future Changes

- Never turn save-history rows back into one mutable overwrite key.
- Never merge a loaded snapshot with newer local state; Load means replace with the chosen save.
- Never delete an older save as a side effect of Save or Load.
- Keep the date inside both the snapshot and new save-row key.
- Keep local backup/durable/mirror stores only as recovery layers, not as the Supabase upload payload.
- Add new manual fields to snapshot creation, normalization, counts, and application together.
- Do not include large schedule or game cache data in snapshots.

## Tracker And Hitter Grade Notes

- The player-tracker header shows the total tracked-player count immediately before `SWAP`.
- HR-hitter triangles use Power / Contact / Strikeout Proclivity. Power and contact reward the highest league deciles; strikeout proclivity is inverse-ranked, so the lowest strikeout rate earns decile 10 and an A+ grade.
- Batter-card pitcher triangles use Power Allowed / K/9 / Hitter Heat at the time of the home run. Higher K/9 earns the higher decile. Left-clicking a tight cluster cycles the nearby HR markers and their portrait tooltip.
- The short hitter heat component uses each player's last three games actually played through the prior day, not three calendar days. Exact game-log dates are aggregated before the player is placed into the recent league comparison population, avoiding All-Star-break empty-window grades and selected-day leakage.

## Current Relevant Files

- `dashboard-live-prototype.html`: production dashboard entrypoint and Save/Load configuration.
- `dashboard-live-prototype-dev.html`: development dashboard entrypoint and Save/Load configuration.
- `live-dashboard-prototype.js`: main app logic, rendering, state, hydration, and save bridge.
- `live-prototype.css`: scoreboard, lineup, player-card, and dashboard styling.
- `../shared/owentools-sync.js`: shared Supabase authentication and immutable save-history helper.
- `../shared/supabase-config.js`: Supabase URL/key configuration.

## Practical Maintenance Notes

- When changing scoreboard UI, avoid touching save keys or manual-state storage unless the change explicitly requires it.
- When adding a new manual control, decide whether it belongs in save snapshots before implementing it.
- Prefer date-scoped keys for game-day state.
- Keep visible UI refresh separate from localStorage writes: write state first, then repaint.
- Use cache-busting query strings when changing JS/CSS used by the HTML entrypoints.
- If a loaded value appears only after refresh, inspect the snapshot application and repaint path.
- If Save works but Load does not, inspect the immutable row value, dashboard bridge, and selected-date filter.
