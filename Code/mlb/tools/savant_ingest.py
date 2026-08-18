#!/usr/bin/env python3
"""Build compact, static pitch-type CSVs from Baseball Savant Statcast exports.

Network work happens only when this script is run. The website does not import it.
Downloaded daily CSVs are gzip-cached so subsequent updates fetch only missing days.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import gzip
import io
import json
import math
import time
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path

SAVANT_URL = "https://baseballsavant.mlb.com/statcast_search/csv"
PEOPLE_URL = "https://statsapi.mlb.com/api/v1/people"
ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "data" / "savant"

AB_EVENTS = {
    "single", "double", "triple", "home_run", "field_out", "force_out",
    "grounded_into_double_play", "field_error", "fielders_choice",
    "fielders_choice_out", "strikeout", "strikeout_double_play",
    "double_play", "triple_play",
}
HIT_BASES = {"single": 1, "double": 2, "triple": 3, "home_run": 4}


def number(value):
    try:
        result = float(value)
        return result if math.isfinite(result) else None
    except (TypeError, ValueError):
        return None


def integer(value):
    value = number(value)
    return int(value) if value is not None else None


def mean(total, count, digits=3):
    return "" if not count else f"{total / count:.{digits}f}"


def daterange(start, end):
    current = start
    while current <= end:
        yield current
        current += dt.timedelta(days=1)


def download_day(day, cache_dir, refresh=False, retries=3):
    cache_dir.mkdir(parents=True, exist_ok=True)
    target = cache_dir / f"{day.isoformat()}.csv.gz"
    if target.exists() and not refresh:
        return target
    query = urllib.parse.urlencode({
        "all": "true", "type": "details", "player_type": "pitcher",
        "game_date_gt": day.isoformat(), "game_date_lt": day.isoformat(),
        "hfGT": "R|", "min_pitches": "0", "min_results": "0",
    })
    request = urllib.request.Request(
        f"{SAVANT_URL}?{query}",
        headers={"User-Agent": "mlb-dashboard-offline-ingest/1.0", "Accept": "text/csv"},
    )
    last_error = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                payload = response.read()
            if payload.lstrip().startswith(b"<"):
                raise RuntimeError("Baseball Savant returned HTML instead of CSV")
            with gzip.open(target, "wb", compresslevel=6) as handle:
                handle.write(payload)
            return target
        except Exception as error:  # network errors should leave prior cache intact
            last_error = error
            if attempt + 1 < retries:
                time.sleep(2 ** attempt)
    raise RuntimeError(f"Failed to download {day}: {last_error}")


def cached_rows(paths):
    for path in paths:
        with gzip.open(path, "rt", encoding="utf-8-sig", newline="") as handle:
            yield from csv.DictReader(handle)


def new_bucket(player_id, pitch_type, pitch_name, opponent_hand="ALL"):
    return {
        "player_id": player_id, "pitch_type": pitch_type, "pitch_name": pitch_name,
        "pitches": 0, "speed_sum": 0.0, "speed_n": 0,
        "pfx_x_sum": 0.0, "pfx_x_n": 0, "pfx_z_sum": 0.0, "pfx_z_n": 0,
        "arm_angle_sum": 0.0, "arm_angle_n": 0,
        "spin_sum": 0.0, "spin_n": 0, "bbe": 0, "exit_sum": 0.0,
        "hard_hit": 0, "pa": 0, "ab": 0, "hits": 0, "home_runs": 0, "total_bases": 0,
        "xba_sum": 0.0, "xba_n": 0, "xslg_sum": 0.0, "xslg_n": 0,
        "teams": defaultdict(int), "hand": "", "opponent_hand": opponent_hand,
    }


def add_value(bucket, row, field, total_key, count_key, multiplier=1.0):
    value = number(row.get(field))
    if value is not None:
        bucket[total_key] += value * multiplier
        bucket[count_key] += 1


def add_result(bucket, row):
    event = (row.get("events") or "").strip()
    if not event:
        return
    bucket["pa"] += 1
    if event in AB_EVENTS:
        bucket["ab"] += 1
        bases = HIT_BASES.get(event, 0)
        bucket["hits"] += int(bases > 0)
        bucket["home_runs"] += int(event == "home_run")
        bucket["total_bases"] += bases
    add_value(bucket, row, "estimated_ba_using_speedangle", "xba_sum", "xba_n")
    # Savant exposes xwOBA and ISO, but not a direct xSLG column. xSLG is kept
    # blank unless a future export adds it, so the output never invents a value.
    add_value(bucket, row, "estimated_slg_using_speedangle", "xslg_sum", "xslg_n")


def aggregate(rows):
    pitchers, batters = {}, {}
    pitcher_totals, batter_totals = defaultdict(int), defaultdict(int)
    for row in rows:
        pitch_type = (row.get("pitch_type") or "").strip()
        pitcher_id, batter_id = integer(row.get("pitcher")), integer(row.get("batter"))
        if not pitch_type or not pitcher_id or not batter_id:
            continue
        pitch_name = (row.get("pitch_name") or pitch_type).strip()
        batter_side = (row.get("stand") or "").strip().upper()
        pitcher_side = (row.get("p_throws") or "").strip().upper()
        pitcher_keys = [(pitcher_id, pitch_type, "ALL")]
        batter_keys = [(batter_id, pitch_type, "ALL")]
        if batter_side in {"L", "R"}:
            pitcher_keys.append((pitcher_id, pitch_type, batter_side))
        if pitcher_side in {"L", "R"}:
            batter_keys.append((batter_id, pitch_type, pitcher_side))
        pitcher_buckets = [pitchers.setdefault(key, new_bucket(pitcher_id, pitch_type, pitch_name, key[2])) for key in pitcher_keys]
        batter_buckets = [batters.setdefault(key, new_bucket(batter_id, pitch_type, pitch_name, key[2])) for key in batter_keys]
        for bucket in pitcher_buckets + batter_buckets:
            bucket["pitches"] += 1
        pitcher_totals[pitcher_id] += 1
        batter_totals[batter_id] += 1
        top = (row.get("inning_topbot") or "").lower() == "top"
        for bucket in pitcher_buckets:
            bucket["hand"] = bucket["hand"] or pitcher_side
            bucket["teams"][row.get("home_team") if top else row.get("away_team")] += 1
        for bucket in batter_buckets:
            bucket["hand"] = bucket["hand"] or batter_side
            bucket["teams"][row.get("away_team") if top else row.get("home_team")] += 1
        for bucket in pitcher_buckets + batter_buckets:
            add_value(bucket, row, "release_speed", "speed_sum", "speed_n")
            add_value(bucket, row, "pfx_x", "pfx_x_sum", "pfx_x_n", 12.0)
            add_value(bucket, row, "pfx_z", "pfx_z_sum", "pfx_z_n", 12.0)
            add_value(bucket, row, "release_spin_rate", "spin_sum", "spin_n")
        for bucket in pitcher_buckets:
            add_value(bucket, row, "arm_angle", "arm_angle_sum", "arm_angle_n")
        exit_velocity = number(row.get("launch_speed"))
        if exit_velocity is not None:
            for bucket in pitcher_buckets + batter_buckets:
                bucket["bbe"] += 1
                bucket["exit_sum"] += exit_velocity
                bucket["hard_hit"] += int(exit_velocity >= 95)
        for bucket in pitcher_buckets + batter_buckets:
            add_result(bucket, row)
    return pitchers, batters, pitcher_totals, batter_totals


def load_names(path):
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def hydrate_names(ids, cache_path, offline=False):
    names = load_names(cache_path)
    missing = [value for value in sorted(set(ids)) if str(value) not in names]
    if not offline:
        for offset in range(0, len(missing), 100):
            batch = missing[offset:offset + 100]
            url = f"{PEOPLE_URL}?{urllib.parse.urlencode({'personIds': ','.join(map(str, batch))})}"
            request = urllib.request.Request(url, headers={"User-Agent": "mlb-dashboard-offline-ingest/1.0"})
            try:
                with urllib.request.urlopen(request, timeout=45) as response:
                    payload = json.load(response)
                for person in payload.get("people", []):
                    names[str(person["id"])] = person.get("fullName", "")
            except Exception as error:
                print(f"warning: player-name lookup failed: {error}")
                break
            time.sleep(0.15)
        cache_path.write_text(json.dumps(names, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return names


FIELDS = [
    "player_id", "player_name", "team", "hand", "opponent_hand", "pitch_type", "pitch_name",
    "pitches", "usage_pct", "avg_speed_mph", "avg_horizontal_break_in",
    "avg_induced_vertical_break_in", "avg_spin_rpm", "pa", "ab", "hits", "home_runs",
    "avg_arm_angle_deg",
    "total_bases", "avg", "slg", "xba", "xslg", "batted_balls",
    "avg_exit_velocity", "hard_hit_pct",
]


def output_row(bucket, total, names):
    ab = bucket["ab"]
    team = max(bucket["teams"], key=bucket["teams"].get) if bucket["teams"] else ""
    return {
        "player_id": bucket["player_id"],
        "player_name": names.get(str(bucket["player_id"]), ""),
        "team": team or "", "hand": bucket["hand"], "opponent_hand": bucket["opponent_hand"],
        "pitch_type": bucket["pitch_type"], "pitch_name": bucket["pitch_name"],
        "pitches": bucket["pitches"], "usage_pct": mean(bucket["pitches"] * 100, total, 1),
        "avg_speed_mph": mean(bucket["speed_sum"], bucket["speed_n"], 1),
        "avg_horizontal_break_in": mean(bucket["pfx_x_sum"], bucket["pfx_x_n"], 1),
        "avg_induced_vertical_break_in": mean(bucket["pfx_z_sum"], bucket["pfx_z_n"], 1),
        "avg_spin_rpm": mean(bucket["spin_sum"], bucket["spin_n"], 0),
        "avg_arm_angle_deg": mean(bucket["arm_angle_sum"], bucket["arm_angle_n"], 1),
        "pa": bucket["pa"], "ab": ab, "hits": bucket["hits"], "home_runs": bucket["home_runs"],
        "total_bases": bucket["total_bases"],
        "avg": mean(bucket["hits"], ab), "slg": mean(bucket["total_bases"], ab),
        "xba": mean(bucket["xba_sum"], bucket["xba_n"]),
        "xslg": mean(bucket["xslg_sum"], bucket["xslg_n"]),
        "batted_balls": bucket["bbe"],
        "avg_exit_velocity": mean(bucket["exit_sum"], bucket["bbe"], 1),
        "hard_hit_pct": mean(bucket["hard_hit"] * 100, bucket["bbe"], 1),
    }


def write_csv(path, buckets, totals, names, min_pitches):
    rows = [output_row(bucket, totals[bucket["player_id"]], names)
            for bucket in buckets.values() if bucket["pitches"] >= min_pitches]
    rows.sort(key=lambda row: (row["player_name"] or str(row["player_id"]), row["opponent_hand"] != "ALL", row["opponent_hand"], -row["pitches"], row["pitch_type"]))
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    return len(rows)


def parse_args():
    today = dt.date.today()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--season", type=int, default=today.year)
    parser.add_argument("--start", type=dt.date.fromisoformat)
    parser.add_argument("--end", type=dt.date.fromisoformat, default=today)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--min-pitches", type=int, default=5)
    parser.add_argument("--refresh", action="store_true", help="redownload cached dates")
    parser.add_argument("--offline", action="store_true", help="aggregate cache without network calls")
    return parser.parse_args()


def main():
    args = parse_args()
    start = args.start or dt.date(args.season, 3, 1)
    end = min(args.end, dt.date(args.season, 11, 30))
    output = args.output.resolve()
    cache = output / "cache" / str(args.season)
    output.mkdir(parents=True, exist_ok=True)
    paths = []
    for day in daterange(start, end):
        target = cache / f"{day.isoformat()}.csv.gz"
        if args.offline:
            if target.exists():
                paths.append(target)
        else:
            print(f"fetch {day}")
            paths.append(download_day(day, cache, args.refresh))
            time.sleep(0.2)
    if not paths:
        raise SystemExit("No cached Statcast days found for the requested range")
    pitchers, batters, pitcher_totals, batter_totals = aggregate(cached_rows(paths))
    names = hydrate_names(
        [key[0] for key in pitchers] + [key[0] for key in batters],
        output / "player_names.json", args.offline,
    )
    pitcher_count = write_csv(output / f"pitcher_arsenals_{args.season}.csv", pitchers, pitcher_totals, names, args.min_pitches)
    batter_count = write_csv(output / f"batter_pitch_profiles_{args.season}.csv", batters, batter_totals, names, args.min_pitches)
    embedded = {
        args.season: {
            "pitcher": (output / f"pitcher_arsenals_{args.season}.csv").read_text(encoding="utf-8"),
            "batter": (output / f"batter_pitch_profiles_{args.season}.csv").read_text(encoding="utf-8"),
        }
    }
    (output / f"savant_aggregates_{args.season}.js").write_text(
        "window.MLB_SAVANT_AGGREGATE_CSV = " + json.dumps(embedded, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    manifest = {
        "season": args.season, "start": start.isoformat(), "end": end.isoformat(),
        "cached_days": len(paths), "pitcher_pitch_rows": pitcher_count,
        "batter_pitch_rows": batter_count, "generated_at_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
    }
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
