# Baseball Savant pitch-data cache

This directory is populated by `tools/savant_ingest.py`. It is deliberately
not loaded by the website yet.

Run an incremental season update:

```powershell
python tools/savant_ingest.py --season 2026
```

Useful development commands:

```powershell
# Small test window
python tools/savant_ingest.py --season 2026 --start 2026-08-01 --end 2026-08-03

# Rebuild aggregates using only already-downloaded days
python tools/savant_ingest.py --season 2026 --offline
```

Outputs:

- `pitcher_arsenals_YEAR.csv`: one row per pitcher and pitch type. Includes
  usage, velocity, horizontal/vertical break, spin, AVG/SLG allowed, expected
  results when supplied by Savant, exit velocity, and hard-hit rate.
- `batter_pitch_profiles_YEAR.csv`: one row per batter and pitch type, with the
  same shape. Usage means share of that batter's pitches seen; AVG/SLG describe
  the batter's results against that pitch.
- `player_names.json`: small MLB-ID-to-name cache.
- `manifest.json`: coverage and row counts for freshness checks.
- `cache/YEAR/*.csv.gz`: resumable daily raw downloads. Keep these out of the
  deployed site; they exist only to make updates cheap and recoverable.

AVG and SLG use only official at-bat events on the pitch that ended the plate
appearance. Walks, hit-by-pitches, and sacrifices count as plate appearances
but not at-bats. Movement is exported in inches; Savant's raw `pfx_x`/`pfx_z`
values are feet. Blank metrics remain blank rather than being inferred.

The default five-pitch minimum only removes tiny pitch-type samples from the
published aggregates. Raise it with `--min-pitches` when the UI integration is
ready. For production, run this script once nightly or after games and deploy
only the two aggregate CSVs plus `manifest.json`.
