# Pitcher Classification Test Branch

This folder is an isolated copy of the lightweight MLB dashboard for developing pitcher classification and batter-versus-pitcher analysis without changing the production MLB pages.

Open `index.html` through the same web server used for the main dashboard. Every player card opens on **Stats** by default. **Overview** is the second tab for both pitchers and hitters.

## Pitcher Overview

The first implementation contains:

- Team-colored profile hero with MLB headshot, team logo, name, roster status, role, jersey number, throwing hand, player ID, and update date.
- League-relative Overall, vs. RHB, and vs. LHB ratings. The Overall tile includes the last-three-appearances rating as a superscript when available.
- Season snapshot: innings, ERA, WHIP, K/9, HR/9, primary pitch, average velocity, and maximum velocity.
- Handedness profile: rating, opponent average, opponent slugging, home runs allowed, and strikeouts against left- and right-handed batters.
- A multi-label archetype map. A pitcher can carry several traits at once; the strongest is emphasized.
- A pitch-specific classification for every qualifying pitch in the arsenal, such as Strong Slider, Effective Changeup, Slider Neutral, Soft Curveball, or Fastball Vulnerable.
- Full horizontally scrollable arsenal table. It supports pitch count, usage, average/max/effective velocity, spin/active spin, horizontal and vertical break, movement versus average, release X/Z, extension, zone/chase/whiff/CSW rates, BA, SLG, xwOBA, hard-hit rate, barrel rate, HR per 100 pitches, and run value per 100 pitches. Missing upstream values display as `--`.

## Archetype Rules

The overview reuses the dashboard's existing Flame Thrower, Finesse Killer, Rock Spinner, Deep Bag, Shallow Bag, Mistake Leaker, Arsenal Imbalance, and Repeat Pattern classifications. It supplements them with the attached pitcher-schema concepts when the necessary fields are present:

- Deep Bag: six or more pitches at an 8% usage floor.
- Shallow Bag: three or fewer pitches at that floor.
- Gas and Soft Tosser: usage-weighted velocity bands.
- Sinker Heavy, Sweeper Heavy, and Changeup / Splitter Heavy: pitch-family usage.
- Contact Manager: season run-prevention and traffic profile.
- Power Vulnerable: home-run allowance.

Each individual pitch also receives a sample-regressed 1–100 strength score. The calculation uses the pitch's available SLG allowed, xwOBA, whiff rate, hard-hit rate, and run value per 100 pitches. The card shows the underlying evidence and sample confidence; a pitch name by itself never creates a strength label.

The primary Overview is a vertical pitch matrix. Pitcher rows contain parallel `VS LHB` and `VS RHB` columns; hitter rows contain parallel `VS LHP` and `VS RHP` columns. Every side is simplified to **Weak / Average / Strong** and displays HR or HR allowed, whiff percentage, SLG, and PA/AB.

Pitcher rows also display usage, raw velocity, raw movement, and upstream league velocity/movement deciles. A decile is shown only when the source supplies a league decile or percentile field. Missing league comparisons display `D—`; raw measurements are never converted into invented deciles.

These handedness grades come only from full-season Baseball Savant pitch events filtered to that batter or pitcher side. Player-page or broad pitch rows may supply physical velocity/movement columns, but cannot supply a handedness grade.

The system is intentionally multi-label. It does not force every pitcher into one exclusive bucket. Movement, release-slot, approach-direction, and additional batter-side archetypes can be added as the corresponding columns are populated.

## Batter Versus Pitcher Overview

Hitter Overview uses the inverse model:

- Team-colored batter profile, season ratings, 14-day superscripts, and handedness performance.
- Current or probable opposing pitcher, throwing hand, role, ERA, innings, team logo, and team-color treatment.
- Results against each available pitch type, filtered to the opposing pitcher's hand when a game context exists.
- Current-opponent arsenal pitches are outlined in the opposing team's color.
- A Live Pitch Collisions section pairs the hitter and pitcher on the exact same pitch type. It explicitly surfaces combinations such as **Slider Mistake Maker vs Slider Mistake Punisher**, pitcher leverage, strength-versus-strength, volatility, and missing-sample cases.
- “Sizes Up” and “Attackable” summaries identify the strongest and weakest pitch-type patterns.
- Each pitch card displays its sample, AVG, SLG, HR, whiff rate, hard-hit rate, score, sample confidence, and classification.

Batter pitch-pattern scores use AVG, SLG, xwOBA, hard-hit rate, and inverse whiff rate. Small samples regress toward 50, preventing a handful of plate appearances from creating extreme labels.

For a live matchup, hitter classifications use full-season pitch events filtered to the opposing pitcher's throwing hand. Pitcher classifications use the same season filtered to the hitter's effective batting side. Broad fallback rows are deliberately excluded; unavailable strict samples display as unavailable.

The Statcast event cache is keyed by both pitcher throwing hand and batter standing side. Left/right requests cannot reuse a cached payload from the opposite split.

Collision cards state `ADVANTAGE: HITTER`, `ADVANTAGE: PITCHER`, `ADVANTAGE: EVEN`, or `ADVANTAGE: UNKNOWN` and use Weak/Average/Strong words instead of presenting unexplained composite numbers.

Both Overview variants own the middle scrolling row of the player modal. Their full contents scroll independently on desktop and touch devices without moving or clipping the fixed player-card header.

In lineup pitcher headers, the full last name has higher layout priority than optional marker emojis. The marker cluster clips first when horizontal space becomes constrained.

## Data Flow and Code Locations

- `index.html`: isolated app shell and the pitcher-only Overview tab/container.
- `live-dashboard-prototype.js`:
  - `renderPitcherOverview`: loads and paints the profile.
  - `pitcherOverviewHtml`: overview composition.
  - `pitcherOverviewArchetypes`: multi-label classification.
  - `pitcherPitchTrait`: evidence-backed per-pitch pitcher classification.
  - `batterPitchPattern`: inverse pitch-type hitter classification.
  - `renderBatterOverview` / `batterOverviewHtml`: batter-versus-pitcher experience.
  - `pitcherOverviewPitchRow`: attached-schema arsenal columns.
  - Existing `getVisiblePitchBreakdown`, `getPitcherOverallRatings`, `getPitcherLastThreeOverallRating`, and `getPitcherOpponentHandSplits` functions remain the data sources.
- `live-prototype.css`: all Overview layout, team-color theming, tables, cards, and responsive behavior under the “Pitcher classification test branch” section.
- `shared/`: local copies of the dashboard session/config scripts so the test folder does not depend on a parent-relative URL.
- `Logos/`, images, contract data, Rotowire defaults, and the remaining CSS/JS files are copied dependencies needed to run this branch as a standalone child path.

## Next Layer

The structure is ready for batter matchup profiles keyed by batter ID, pitcher ID, pitch type, pitcher hand, batter side, and season/window. Those matchup scores can later combine pitch quality, location/approach, handedness, velocity band, movement, and archetype fit without changing the Overview tab's data contract.
