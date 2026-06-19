# Shell hydration refresh + real L/A archetype samples

Changes:
- Kept the shell-first loading pattern.
- Keeps real official schedule shells visible if a full card times out instead of deleting that matchup.
- If any shell/hydration-pending game remains, auto-refresh retries on a short controlled cadence until the slate is actually hydrated.
- Once every visible card is fully hydrated, the no-refresh-cycle behavior remains in place.
- Batter Vs Pitcher Type rows for K/I/L/R now summarize real starter-only event rows filtered to pitchers that qualify for that archetype instead of leaving L/A blank.
- Arsenal Imbalance can additionally qualify from real starter event-row pitch concentration when season-wide pitch-usage is not available.
- Still no generic handedness fallback.
- Still no fake AWAY/HOME shells.
- No lineup-source changes.
- No Rotowire changes.
- No cache-key changes.

Validation:
- node --check app.js
- node --check live-dashboard-prototype.js
