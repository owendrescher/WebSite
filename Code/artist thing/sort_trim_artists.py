#%%

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sort an artists CSV by "Page Views" (numeric, desc), trim to 365 rows,
and write a new CSV.

Expected header columns (case-insensitive):
  Artist name, Description, Wiki URL, Page Views

Usage:
  python sort_trim_artists.py --in artists_wiki_views.csv --out artists_top365.csv
  # or rely on defaults:
  python sort_trim_artists.py
"""

import csv
import argparse

def parse_views(val: str) -> int:
    """Convert '12,345' -> 12345; 'N/A' -> 0; tolerate extra text."""
    if not val:
        return 0
    digits = ''.join(ch for ch in str(val) if ch.isdigit())
    return int(digits) if digits else 0

def main():
    ap = argparse.ArgumentParser(description="Sort by page views, trim to 365.")
    ap.add_argument("--in", dest="in_path", default="artists_wiki_views_fixed.csv", help="Input CSV path")
    ap.add_argument("--out", dest="out_path", default="artists_top365.csv", help="Output CSV path")
    args, _ = ap.parse_known_args()

    rows = []
    with open(args.in_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise SystemExit("Input CSV has no header row.")
        # Map lowercase header names back to original
        fields = {name.lower(): name for name in reader.fieldnames}
        required = ["artist name", "description", "wiki url", "page views"]
        missing = [r for r in required if r not in fields]
        if missing:
            raise SystemExit(f"Missing expected columns: {missing}. Found: {reader.fieldnames}")

        for r in reader:
            views_raw = r[fields["page views"]]
            rows.append({
                "Artist name": r[fields["artist name"]],
                "Description": r[fields["description"]],
                "Wiki URL": r[fields["wiki url"]],
                "Page Views": views_raw,
                "_views_num": parse_views(views_raw),
            })

    rows.sort(key=lambda x: x["_views_num"], reverse=True)
    trimmed = rows[:365]

    with open(args.out_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["Artist name", "Description", "Wiki URL", "Page Views"])
        for r in trimmed:
            w.writerow([r["Artist name"], r["Description"], r["Wiki URL"], r["Page Views"]])

    print(f"Read {len(rows)} rows; wrote {len(trimmed)} to {args.out_path}")

if __name__ == "__main__":
    main()

# %%
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Re-validate Wikipedia links, skip 'no article' or disambiguation pages,
fetch recent pageviews, and write a clean CSV.

Input CSV must contain (case-insensitive headers):
  Artist name, Description, Wiki URL
Output CSV will contain:
  Artist name, Description, Wiki URL, Page Views

Example:
  python recount_wiki_views.py --in artists_wiki_views.csv --out artists_wiki_views_fixed.csv --days 60
Then:
  python sort_trim_artists.py --in artists_wiki_views_fixed.csv --out artists_top365.csv
"""

import csv
import argparse
import time
import sys
import re
from datetime import datetime, timedelta
from urllib.parse import quote, urlparse, unquote
import requests

UA = "ArtCyclopediaScraper/1.0 (contact: your_email@example.com)"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": UA, "Accept": "text/html,application/json"})

NOARTICLE_PATTERNS = [
    r'Wikipedia does not have an article with this exact name',   # soft 404 message
    r'id=["\']noarticletext',                                     # container on 'no article' pages
]
DISAMBIG_PATTERNS = [
    r'\bdisambiguation\b',  # appears in categories/hatnotes
]

WIKI_API = "https://en.wikipedia.org/w/api.php"
REST_SUMMARY = "https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
REST_PAGEVIEWS = ("https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/"
                  "en.wikipedia.org/all-access/user/{title}/daily/{start}/{end}")

def read_rows(path):
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise SystemExit("Input CSV has no header row.")
        fields = {name.lower(): name for name in reader.fieldnames}
        required = ["artist name", "description", "wiki url"]
        missing = [r for r in required if r not in fields]
        if missing:
            raise SystemExit(f"Missing expected columns: {missing}. Found: {reader.fieldnames}")
        for r in reader:
            yield {
                "Artist name": r[fields["artist name"]].strip(),
                "Description": r[fields["description"]].strip(),
                "Wiki URL": r[fields["wiki url"]].strip(),
            }

def is_no_article(html: str) -> bool:
    h = html if html else ""
    for pat in NOARTICLE_PATTERNS:
        if re.search(pat, h, flags=re.IGNORECASE):
            return True
    return False

def is_disambiguation_html(html: str) -> bool:
    """
    Heuristic: look for 'disambiguation' in hatnotes/categories rendered in HTML.
    """
    if not html:
        return False
    # quick checks: hatnote block or category links
    if re.search(r'class=["\']hatnote[^"\']*["\'][^<]*disambiguation', html, re.IGNORECASE):
        return True
    if re.search(r'Category:\s*Disambiguation pages', html, re.IGNORECASE):
        return True
    # generic fallback
    if re.search(DISAMBIG_PATTERNS[0], html, re.IGNORECASE):
        return True
    return False

def http_get(url: str, timeout=15):
    try:
        r = SESSION.get(url, timeout=timeout, allow_redirects=True)
        if r.status_code >= 400:
            return None
        return r.text
    except requests.RequestException:
        return None

def candidate_titles_from_api(artist: str, max_results=5):
    """
    Use Wikipedia search to propose titles (namespace 0 only).
    """
    try:
        params = {
            "action": "query",
            "list": "search",
            "srsearch": artist,
            "srlimit": max_results,
            "srnamespace": 0,
            "format": "json"
        }
        r = SESSION.get(WIKI_API, params=params, timeout=15)
        r.raise_for_status()
        data = r.json()
        for item in data.get("query", {}).get("search", []):
            title = item.get("title")
            if title:
                yield title
    except requests.RequestException:
        return

def normalize_title_via_summary(title: str):
    """
    REST summary returns a normalized/canonical 'title' if exists.
    Returns None if page missing.
    """
    try:
        r = SESSION.get(REST_SUMMARY.format(title=quote(title, safe="")), timeout=15)
        if r.status_code == 404:
            return None
        j = r.json()
        if j.get("type") in {"https://mediawiki.org/wiki/HyperSwitch/errors/not_found", "standard"} and j.get("title") == "Not found.":
            return None
        # If it's a disambiguation summary, skip
        if j.get("description", "").lower().find("disambiguation") != -1:
            return None
        return j.get("title") or title
    except requests.RequestException:
        return None

def pageviews_sum(title: str, days: int) -> int:
    end = (datetime.utcnow() - timedelta(days=1)).strftime("%Y%m%d") + "00"
    start = (datetime.utcnow() - timedelta(days=days)).strftime("%Y%m%d") + "00"
    url = REST_PAGEVIEWS.format(title=quote(title, safe=""), start=start, end=end)
    try:
        r = SESSION.get(url, timeout=20)
        if r.status_code >= 400:
            return 0
        j = r.json()
        items = j.get("items", [])
        return sum(int(it.get("views", 0)) for it in items)
    except requests.RequestException:
        return 0

def html_is_valid_article(url: str) -> bool:
    html = http_get(url)
    if not html:
        return False
    if is_no_article(html):
        return False
    if is_disambiguation_html(html):
        return False
    return True

def url_title_from_wiki_url(url: str) -> str | None:
    try:
        p = urlparse(url)
        if not p.netloc.endswith("wikipedia.org"):
            return None
        path = unquote(p.path or "")
        # /wiki/Title_with_Underscores
        if not path.startswith("/wiki/"):
            return None
        return path.split("/wiki/", 1)[1]
    except Exception:
        return None

def choose_working_title(artist: str, starting_url: str | None) -> str | None:
    # 1) Try given URL first (if present)
    if starting_url:
        if html_is_valid_article(starting_url):
            t = url_title_from_wiki_url(starting_url)
            if t:
                # Normalize via summary to canonical casing/diacritics
                norm = normalize_title_via_summary(t)
                if norm:
                    return norm

    # 2) Try title generated from name
    guess = artist.replace(" ", "_")
    norm = normalize_title_via_summary(guess)
    if norm:
        # sanity-check with HTML
        if html_is_valid_article(f"https://en.wikipedia.org/wiki/{quote(norm, safe='')}"):
            return norm

    # 3) Fall back to API search candidates
    for cand in candidate_titles_from_api(artist, max_results=6):
        norm = normalize_title_via_summary(cand)
        if not norm:
            continue
        if html_is_valid_article(f"https://en.wikipedia.org/wiki/{quote(norm, safe='')}"):
            return norm

    return None

def main():
    ap = argparse.ArgumentParser(description="Recount/repair Wikipedia views with soft-404 & disambiguation skip.")
    ap.add_argument("--in", dest="in_path", default="artists_wiki_views.csv", help="Input CSV path")
    ap.add_argument("--out", dest="out_path", default="artists_wiki_views_fixed.csv", help="Output CSV path")
    ap.add_argument("--days", type=int, default=60, help="Days of pageviews to sum (default 60)")
    ap.add_argument("--max", dest="max_rows", type=int, default=0, help="Process only first N rows (0 = all)")
    args, _ = ap.parse_known_args()

    t0 = time.time()
    in_rows = list(read_rows(args.in_path))
    if args.max_rows > 0:
        in_rows = in_rows[:args.max_rows]

    out_rows = []
    total_ok = total_skipped = 0

    for i, row in enumerate(in_rows, 1):
        start = time.time()
        name = row["Artist name"]
        desc = row["Description"]
        given_url = row["Wiki URL"]

        title = choose_working_title(name, given_url if given_url else None)
        if not title:
            # Could not find a valid article; mark N/A
            out_rows.append({
                "Artist name": name,
                "Description": desc,
                "Wiki URL": given_url,
                "Page Views": "N/A"
            })
            total_skipped += 1
            dt = time.time() - start
            print(f"[{i}/{len(in_rows)}] {name}: NO VALID PAGE (took {dt:.2f}s)")
            continue

        # Compute views
        views = pageviews_sum(title, days=args.days)
        wiki_url = f"https://en.wikipedia.org/wiki/{quote(title, safe='')}"
        out_rows.append({
            "Artist name": name,
            "Description": desc,
            "Wiki URL": wiki_url,
            "Page Views": f"{views:,d}"
        })
        total_ok += 1
        dt = time.time() - start
        print(f"[{i}/{len(in_rows)}] {name}: {views} views over {args.days}d (took {dt:.2f}s) → {wiki_url}")

    # Write output
    with open(args.out_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["Artist name", "Description", "Wiki URL", "Page Views"])
        for r in out_rows:
            w.writerow([r["Artist name"], r["Description"], r["Wiki URL"], r["Page Views"]])

    T = time.time() - t0
    print(f"\nDone. {total_ok} OK, {total_skipped} skipped. Wrote {len(out_rows)} rows to {args.out_path} in {T:.1f}s.")

if __name__ == "__main__":
    sys.exit(main())

# %%
