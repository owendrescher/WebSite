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

### Player Tracker

The tracker lets you mark players to monitor across games. Tracked players are saved locally and synced. When a tracked player appears in the lineup view, the corresponding lineup slot gets a visual effect so the player is easier to spot.

Tracked player state is date-scoped and backed up through multiple manual-state stores.

### Predictions And Picks

The dashboard includes prediction surfaces and manual pick controls:

- Manual game picks are stored separately from prediction output.
- Picked teams get visual live result states such as leading/trailing or hit/miss.
- Prediction pages and detail panels explain model-derived team/player views.
- Manual game picks are included in sync state.

### Tossup, Near-Lock, And Lock States

Pregame games support a three-step manual confidence ladder:

1. Tossup: yellow state.
2. Near-lock: unlocked emoji and intermediate color.
3. Lock: gray lock state.

This uses the existing tossup and locked tossup storage sets, so it does not require a new sync key.

### Over/Under Controls

Pregame score strips support under/over markers. These are mirrored into lineup views and synced with the rest of manual game state.

## Data Sources

The site uses several data layers:

- MLB StatsAPI for schedule, live game feed, player stats, game logs, standings, rosters, and probable pitcher data.
- RotoWire/projected lineup fallbacks when official lineups are incomplete.
- Local cached schedule/game data for fast rendering.
- Player profile and stat caches to avoid repeated network work.
- Supabase-backed OwenTools sync for cross-device localStorage state.

The app favors quick first paint, then hydrates heavier details in the background.

## Local Storage And Manual State

The app stores both volatile data and user-authored manual state. Manual state is the important part for push/pull.

Important synced keys include:

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

## Push/Pull Sync

### What Sync Is Responsible For

Push/pull should keep manual user state aligned across devices:

- Tracked players.
- Game picks.
- Tossup/near-lock/lock states.
- Over/under markers.
- Lineup/player-stat window preferences.
- Dynamic lineup source preference.

It should not try to sync large schedule/game caches.

### How Sync Is Wired

The HTML page defines `window.OWENTOOLS_SYNC` before loading the shared sync helper:

```js
window.OWENTOOLS_SYNC = {
  toolId: "baseball-dashboard",
  label: "Baseball dashboard",
  include: [
    "manual-state-mirror:v1",
    "manual-state-durable:v1",
    "manual-state-backup:v1",
    "manual-state-current:v1",
    "player-tracker:v1:",
    "player-tracker-backup:v1",
    "pending-game-picks:v1",
    "tossup-scoreboards:v1",
    "locked-tossup-scoreboards:v1",
    "over-under-scoreboards:v1",
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

The shared helper patches `localStorage.setItem` and `localStorage.removeItem`, queues changed included keys, uploads them to Supabase, pulls cloud state, and dispatches lifecycle events.

The dashboard listens for:

- `owentools:sync-before-push`
- `owentools:sync-pulled`
- `owentools:sync-state-changed`

Before a push, the dashboard writes a fresh manual snapshot. After a pull or state change, the dashboard re-reads synced manual snapshots and refreshes visible UI.

### Expected Push Flow

1. User changes manual state, such as tracking a player or locking a game.
2. The app writes the relevant localStorage key.
3. The shared sync helper queues that key for upload.
4. On manual Push, the dashboard first writes `manual-state-current:v1:{date}`.
5. The shared helper uploads all syncable local keys for the signed-in user.
6. The sync widget should return to `Synced`.

### Expected Pull Flow

1. User clicks Pull, or realtime/polling detects remote changes.
2. The shared helper downloads cloud state for `tool_id = baseball-dashboard`.
3. It writes newer or stronger cloud values into localStorage.
4. It dispatches a sync event with changed keys.
5. The dashboard derives the affected date or dates from those keys.
6. The dashboard applies `manual-state-current:v1:{date}` if present, falling back to durable/mirror/backup reconciliation.
7. Scoreboard, tracker, tossup, lock, and over/under UI refresh.

### Sync Health Checklist

Use this checklist when push/pull appears disconnected:

1. Confirm the page has loaded `../shared/supabase-config.js`.
2. Confirm the page has loaded `../shared/owentools-sync.js` with a fresh query string.
3. Confirm `window.OWENTOOLS_SYNC.toolId` is exactly `baseball-dashboard`.
4. Confirm included keys still contain all manual-state prefixes listed above.
5. Confirm the sync widget is signed in and not showing `Sync setup`, `Sync offline`, or `Sync failed`.
6. Make a small manual change, such as toggling a tossup state.
7. Check localStorage for the relevant dated key and `manual-state-current:v1:{date}`.
8. Click Push and verify the widget returns to `Synced`.
9. On another device, click Pull or focus the tab and wait for auto-pull.
10. Confirm the UI updates without needing a full reload.

### Common Sync Failure Modes

The most likely issues are:

- A browser cached an old sync helper script. Fix with a query-string bump on `owentools-sync.js`.
- The dashboard writes manual state but does not snapshot it before Push. Fix by keeping `owentools:sync-before-push` wired to `snapshotManualStateForSync()`.
- Pull updates localStorage but the UI does not refresh. Fix by keeping `owentools:sync-state-changed` and `owentools:sync-pulled` wired to manual-state refresh.
- A dated key changes but the dashboard refreshes only the currently selected date. Fix by deriving dates from changed keys.
- Empty local state overwrites richer cloud state. The shared sync helper uses data weight checks to reduce this risk, but manual Push intentionally uploads local state, so avoid pushing from a stale/empty device unless that is intended.

### Safe Rules For Future Sync Changes

- Do not rename synced localStorage keys unless a migration is added.
- Do not add new manual states without adding them to `window.OWENTOOLS_SYNC.include`.
- Do not sync large schedule or game cache keys.
- Keep `manual-state-current:v1:{date}` as the compact source of truth for manual state.
- Keep backup/durable/mirror stores as recovery layers.
- Before manual Push, always snapshot current in-memory state into localStorage.
- After Pull, always apply the synced snapshot and then repaint tracker, picks, tossup/lock, and over/under UI.
- Avoid changing sync behavior while working on unrelated visual features.

## Current Relevant Files

- `dashboard-live-prototype.html`: production dashboard entrypoint and sync configuration.
- `dashboard-live-prototype-dev.html`: development dashboard entrypoint and sync configuration.
- `live-dashboard-prototype.js`: main app logic, rendering, state, hydration, and sync event bridge.
- `live-prototype.css`: scoreboard, lineup, player-card, and dashboard styling.
- `../shared/owentools-sync.js`: shared Supabase-backed localStorage sync helper.
- `../shared/supabase-config.js`: Supabase URL/key configuration.

## Practical Maintenance Notes

- When changing scoreboard UI, avoid touching sync keys or manual-state storage unless the change explicitly requires it.
- When adding a new manual control, decide whether it must sync before implementing it.
- Prefer date-scoped keys for game-day state.
- Keep visible UI refresh separate from localStorage writes: write state first, then repaint.
- Use cache-busting query strings when changing JS/CSS used by the HTML entrypoints.
- If something works only after refresh, look for a missing repaint after async hydration or sync pull.
- If something syncs only one way, inspect the pre-push snapshot and post-pull apply paths.
