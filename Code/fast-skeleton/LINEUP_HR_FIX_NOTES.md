# Quiet HR retention, archetype consistency, and SoS logo fix

Changes:
- Scoreboard tab return no longer calls a full invalidating `loadGames({ invalidate: true })` reload.
- Returning to the scoreboard now restores the retained/cached HR feed immediately and only runs a quiet HR-only refresh when appropriate.
- HR feed state is no longer mutated while building signatures or sorting display items.
- Empty same-date HR payloads are treated as unreliable refresh misses, not as a command to clear the feed.
- Partial same-date HR payloads merge into retained/cached HRs instead of replacing the whole feed.
- Explicit date changes and true empty states can still clear the HR feed with `forceClear`.
- `app.js` now has the same stable `homeRunEventKey()` helper used by the live prototype.
- Batter-card vs-archetype rows still trust the resolved async matchup rows instead of re-filtering them against stale base pitcher data.
- Opponent strength rows still render an equivalent opponent logo/rank chip instead of the `toughest / hardest` text.
- No lineup-source, Rotowire, or cache-key changes.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js

Additional pitcher retention fix:
- Returning to the scoreboard no longer triggers a passive full-board reload just because retained game objects still carry hydration flags.
- Scoreboard pitcher matchup lines now keep a stable render signature, so identical pitcher rows do not recreate their DOM spans on tab return/responsive refresh.
- Pitcher fire/cold/last-start-HR/handedness markers now hydrate once per selected date/player and do not blank themselves before cached results return.
- Lineup pitcher summary/current pitcher cards and bullpen/rotation lists now no-op when their pitcher fingerprint has not changed, preserving already displayed pitcher stats and markers.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js
