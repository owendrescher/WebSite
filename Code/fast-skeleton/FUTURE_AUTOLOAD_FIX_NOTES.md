# Future auto-load fix v2

What was still broken:
- Future `Preview` cards could stay on `Probable pitcher pending` because the first pass waited on official probable sources that may be empty/slow for future dates.
- The background preview hydrator also waited for bullpen/lineup work before repainting the card, so even when a starter was resolved the scoreboard could remain visually stale.
- Card merging could let a more complete cached lineup overwrite newly resolved probable pitchers.

Changes in v2:
- Added a fast pregame probable resolver that checks StatsAPI schedule probables first, then falls back to a roster/rotation starter projection without waiting on MLB page scraping.
- Added a quick roster starter fallback if detailed game-log rotation memory times out.
- Future-card background hydration now applies starter/probable pitcher data immediately, then continues loading bullpen and lineup context afterward.
- Pregame scoreboard rows now fall back to the hydrated pitching current starter when `previewProbableForSide()` is still unavailable.
- `chooseBestGameCard()` now explicitly merges probable pitchers so newly hydrated starters do not get overwritten by cached shells or cached lineups.
- Pregame hydration retries are no longer locked out for five minutes after a bad/stalled attempt.
- Background future-card hydration concurrency increased from 1 to 3.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js

Deploy notes:
- Replace your existing `app.js` and `live-dashboard-prototype.js` with these files.
- The zip also includes the current HTML/CSS files you uploaded, renamed to their deploy filenames.
