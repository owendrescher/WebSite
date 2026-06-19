# Progressive order + vs-archetype pitcher detail fix

Changes:
- Progressive scoreboard hydration now starts in chronological game order and keeps DOM order earliest-to-latest as each card updates.
- Live feed hydration is limited to small ordered batches instead of firing the whole slate at once.
- Card updates still paint progressively without fake AWAY/HOME placeholder shells.
- Batter-side Vs Pitcher Type hover text now includes per-pitcher statlines for the qualifying starter archetype sample.
- Per-pitcher statlines show H-AB, SLG, and HR for each qualifying pitcher.
- Pitcher statlines with 0 AB are removed from the hover detail.
- Existing Flame Thrower max/avg qualification and SP-only archetype sample logic is preserved.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js


## Shell-first ordered hydration fix

Changes:
- Official MLB schedule shells now paint first for every game in chronological order.
- Shells are real matchup shells from MLB schedule data, not fake AWAY/HOME placeholders.
- Full card hydration still fetches in small batches, but visible full-card updates are released earliest-to-latest.
- Final full-data completion no longer repaints every card if the progressive full-card updates already rendered them.
- Existing no-refresh-cycle behavior is preserved.
- No lineup-source, Rotowire, archetype, or cache-key changes.
