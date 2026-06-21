# Date switch full-slate retention fix

Changes:
- Keeps the previous shell-first chronological hydration behavior.
- When moving forward or backward dates, cards from the old date are still cleared immediately.
- Current-date schedule seeds are now always included in the final card set, even when live-feed hydration times out for some games.
- Cached/archive cards are now hard-filtered by official game date before they can seed or merge into the current slate.
- Cached-card lookup is keyed by game id, matchup, and date-aware matchup identity, but only after date filtering.
- Late progressive updates from an old date are still ignored.
- This prevents the slate from collapsing to only matchups that happened to overlap with the previous date.
- No lineup, archetype, Rotowire, or cache-key changes.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js
- node --check live-dashboard-prototype.20260619-dateclear1.js
