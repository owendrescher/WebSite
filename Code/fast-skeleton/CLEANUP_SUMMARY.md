# Safe retry cleanup summary

This build is based on the uploaded originals, not on the previously over-trimmed build.

Functional fixes:
- Scoreboard play-by-play now prefers the first non-placeholder ticker/play-by-play item over placeholder text.
- `app.js` now uses the expanded placeholder filter already present in the live prototype.
- Pregame still shows `Starts <time>` in the play lane and suppresses the start-time tooltip.
- The score strip CSS now gives the play-by-play its own remaining grid lane after diamond/balls/strikes/outs.
- The marquee track rules are restored so long pitcher/play text can scroll again.

Conservative trimming:
- No JS functions or feature blocks were removed in this retry.
- The repeated dashboard score-strip override stack (`v31` through `v36`) was replaced by one equivalent final override in `dashboard.css` and `live-prototype.css`.
- File names were normalized by removing parenthetical upload numbers.

Validation:
- `node --check app.js`
- `node --check live-dashboard-prototype.js`

Rationale:
The previous build likely broke because the automated unused-function pass removed functions that are called indirectly by event handlers, dynamic render paths, or string-based UI wiring. This retry avoids that class of removal entirely.

## v37 play-by-play lane correction
- Fixed the actual cause of the cut-off: `.score-state-strip` lives inside `.scoreboard-main`, so the previous CSS was subtracting the right-side score column twice with `right: 50px` / `58px`.
- The strip now runs from `left: 7px` to `right: 7px` inside the main scoreboard area, stopping before the white score block naturally because of the DOM structure.
- Pregame cards now show only the start time in the play lane because `PRE` already labels the state. This prevents `Starts ...` from eating the visible lane.
- No JS functions or feature blocks were removed in this pass.
