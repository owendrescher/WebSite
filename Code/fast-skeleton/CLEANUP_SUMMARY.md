# Live auto-refresh fix

Starting point: `mlb_dashboard_lock_scoreboard_fix.zip`.

Changes in this pass:
- Restored automatic scoreboard DOM repaint during passive refreshes. The previous passive path updated each card's `_game` object but skipped `upsertCard()` unless a schedule shell was being replaced, so scores/counts/play state could change in memory without changing the visible scoreboard.
- Passive refreshes now compare each card's `scoreboardCardRenderFingerprint()` and repaint only cards whose visible state actually changed.
- Live-game auto-refresh cadence was tightened from 30 seconds to 8 seconds while the page is visible.
- Auto-refresh no longer fully pauses just because the lineup modal is open. If the open lineup game is live, passive refreshes continue and update the open lineup/live screen too.
- The passive-refresh hold still protects non-live overlays from unnecessary repainting, but it no longer blocks true live games.
- No feature blocks or large code sections were removed.

Validation:
- `node --check app.js`
- `node --check live-dashboard-prototype.js`
