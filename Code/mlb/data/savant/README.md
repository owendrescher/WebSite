# Baseball Savant pitch-data cache

`tools/savant_ingest.py` turns Baseball Savant Statcast exports into compact,
static season aggregates. It performs all network work ahead of time; the
dashboard reads the generated data locally rather than downloading a full
Statcast season in the browser.

Both dashboard entry points load the published bundle for the active season:

```text
data/savant/savant_aggregates_YEAR.js
```

The two CSVs are retained as inspectable source artifacts and as a fallback for
the in-page loader. The browser bundle exposes them as
`window.MLB_SAVANT_AGGREGATE_CSV`.

## Update the current season

The script only uses the Python standard library. From the repository's `mlb`
directory, run:

```powershell
python tools/savant_ingest.py --season 2026
```

This is the normal incremental update. It reuses each existing daily gzip cache
file and downloads only dates that are missing between March 1 and today. It
then rewrites both CSVs, the browser bundle, and `manifest.json`.

Useful maintenance commands:

```powershell
# Test a small inclusive date range. Existing cache files are reused.
python tools/savant_ingest.py --season 2026 --start 2026-08-01 --end 2026-08-03

# Rebuild the published files from the local daily cache only. No network or
# player-name lookup is performed.
python tools/savant_ingest.py --season 2026 --offline

# Re-download a narrow range when Baseball Savant corrects or backfills it.
# Do not use --refresh for an entire season unless that is intentional.
python tools/savant_ingest.py --season 2026 --start 2026-08-20 --end 2026-08-24 --refresh

# Publish to another directory without touching this cache.
python tools/savant_ingest.py --season 2026 --output C:\deploy\mlb-savant
```

After a production update, verify `manifest.json` has the expected `end`,
`cached_days`, row counts, and UTC generation time. If a browser or CDN has
cached the bundle, change the `?v=` value on the
`data/savant/savant_aggregates_YEAR.js` script tag in both `light_mlb.html` and
`heavy_mlb.html` when deploying the updated file.

## Published files

| File | Purpose |
| --- | --- |
| `pitcher_arsenals_YEAR.csv` | One row per pitcher, pitch type, and opposing batter hand. Used for arsenal and pitch-quality views. |
| `batter_pitch_profiles_YEAR.csv` | One row per batter, pitch type, and opposing pitcher hand. Used for batter-versus-pitch matchup views. |
| `savant_aggregates_YEAR.js` | Browser-ready wrapper containing both CSVs; this is the normal site payload. |
| `player_names.json` | MLB-ID-to-name cache. A non-offline run fills missing names from the MLB Stats API. |
| `manifest.json` | Season coverage, published row counts, and generation timestamp. |
| `cache/YEAR/YYYY-MM-DD.csv.gz` | Resumable raw daily Statcast downloads. Development/update input only; keep it out of the deployed site. |

The `cache/` directory is intentionally ignored by Git. Generated aggregates
and the manifest are the files that should be published with the site.

## Row shape and definitions

Both aggregate files use the same columns:

```text
player_id, player_name, team, hand, opponent_hand, pitch_type, pitch_name,
pitches, usage_pct, avg_speed_mph, avg_horizontal_break_in,
avg_induced_vertical_break_in, avg_spin_rpm, pa, ab, hits, home_runs,
avg_arm_angle_deg, total_bases, avg, slg, xba, xslg, batted_balls,
avg_exit_velocity, hard_hit_pct
```

For each player/pitch type, the export writes one `ALL` row and, when source
data is available, separate `L` and `R` rows:

- In `pitcher_arsenals_YEAR.csv`, `hand` is the pitcher's throwing hand and
  `opponent_hand` is the batter's stance.
- In `batter_pitch_profiles_YEAR.csv`, `hand` is the batter's stance and
  `opponent_hand` is the pitcher's throwing hand.
- `usage_pct` is the pitch type's share of **all** season pitches for that
  player. The same full-player denominator is intentionally used for the `L`
  and `R` split rows, so their percentages describe overall exposure rather
  than a within-split mix.
- `team` is the most common team code in the exported Statcast rows. It is a
  season-data label, not a guaranteed current-roster assignment.

`pa`, `ab`, `hits`, `home_runs`, `total_bases`, `avg`, and `slg` are attributed
to the pitch that ended the plate appearance. Walks, hit-by-pitches, and
sacrifices raise `pa` but not `ab`. `xba` and `xslg` are averaged only when
Baseball Savant supplies those source values; absent data stays blank.

Movement is the source `pfx_x`/`pfx_z` value converted from feet to inches and
retains Savant's direction convention. `avg_arm_angle_deg` is populated only
for pitcher rows. `batted_balls`, exit velocity, and hard-hit percentage use
batted-ball events; a hard-hit ball is defined here as at least 95 mph.

## Sampling and refresh behavior

The default `--min-pitches 5` filters out individual player/pitch/hand rows
below five pitches. It applies independently to `ALL`, `L`, and `R` rows, so a
pitch can have an `ALL` row without a small handedness split. Raise the threshold
with `--min-pitches` if the UI should suppress more small samples.

Daily downloads are retried up to three times and only replace the cached file
after a successful CSV response. A failed request therefore leaves an existing
cache file intact. Early spring-training or off-day files can be small; the
manifest's coverage and row counts are the authoritative freshness check.

## Dashboard team color registry

The editable source of truth is `TEAM_COLOR_REGISTRY` in
`live-dashboard-prototype.js`. Every club has exactly four user-facing roles:

- `text` — the current, vetted readable text color. Keep this for names and
  labels on dark surfaces.
- `lightPrimary` — bright uniform/logo accent for small highlights.
- `darkPrimary` — dark uniform/logo accent for subtle borders and fills.
- `tertiary` — a final trim color; this is gray for both the White Sox and
  Yankees.

Changing a value in the registry updates the derived text and accent helpers;
the established scoreboard and lineup palette maps remain intact so a color
edit does not unexpectedly reorganize those views.

| Team | Text | Light primary | Dark primary | Tertiary |
| --- | --- | --- | --- | --- |
| ARI | `#FF6B7E` | `#E3D4AD` | `#A71930` | `#30CED8` |
| ATL | `#F35D83` | `#CE1141` | `#13274F` | `#8EC9E8` |
| BAL | `#FF7A2F` | `#DF4601` | `#111111` | `#FFFFFF` |
| BOS | `#F06A72` | `#BD3039` | `#0C2340` | `#FFFFFF` |
| CHC | `#72A5FF` | `#CC3433` | `#0E3386` | `#FFFFFF` |
| CHW | `#E4E8EA` | `#FFFFFF` | `#27251F` | `#C4CED4` |
| CIN | `#FF6277` | `#C6011F` | `#111111` | `#FFFFFF` |
| CLE | `#FF627A` | `#E31937` | `#0C2340` | `#FFFFFF` |
| COL | `#AAA8FF` | `#C4CED4` | `#333366` | `#131413` |
| DET | `#FF7847` | `#FA4616` | `#0C2340` | `#FFFFFF` |
| HOU | `#FF8A45` | `#EB6E1F` | `#002D62` | `#F4911E` |
| KC | `#68AEF2` | `#7AB2DD` | `#004687` | `#BD9B60` |
| LAA | `#FF647E` | `#BA0021` | `#001F3F` | `#C4CED4` |
| LAD | `#71B5FF` | `#FFFFFF` | `#005A9C` | `#EF3E42` |
| MIA | `#55D7FF` | `#00A3E0` | `#111111` | `#EF3340` |
| MIL | `#FFD457` | `#FFC52F` | `#002B5C` | `#FFFFFF` |
| MIN | `#FF6489` | `#D31145` | `#002B5C` | `#FFFFFF` |
| NYM | `#FF7B35` | `#FF5910` | `#002D72` | `#FFFFFF` |
| NYY | `#DCE4EC` | `#FFFFFF` | `#000000` | `#C4CED4` |
| ATH | `#54D2A3` | `#FFFFFF` | `#003831` | `#EFB21E` |
| PHI | `#FF6875` | `#FFFFFF` | `#E81828` | `#002D72` |
| PIT | `#FFD04D` | `#FDB827` | `#111111` | `#FFFFFF` |
| SD | `#FFD05C` | `#FFC425` | `#2F241D` | `#FFFFFF` |
| SEA | `#61D1CB` | `#005C5C` | `#0C2C56` | `#C4CED4` |
| SF | `#FF8051` | `#FD5A1E` | `#27251F` | `#FFF2D6` |
| STL | `#F7657E` | `#FFFFFF` | `#C41E3A` | `#C4CED4` |
| TB | `#8FCBFF` | `#8FBCE6` | `#092C5C` | `#F5D130` |
| TEX | `#70A6FF` | `#C0111F` | `#003278` | `#FFFFFF` |
| TOR | `#6CACF3` | `#134A8E` | `#1D2D5C` | `#E8291C` |
| WSH | `#FF6670` | `#AB0003` | `#14225A` | `#FFFFFF` |
