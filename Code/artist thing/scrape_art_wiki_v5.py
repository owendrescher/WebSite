#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scrape Artcyclopedia A–Z -> (Artist, Description),
then fetch Wikipedia 30‑day page views from each artist's "action=info" page.

Outputs CSV with columns:
  Artist name, Description, Wiki URL, Page Views

Adds a run timer and prints:
  start time, end time, duration, artists processed, average time per artist

Usage:
  pip install requests beautifulsoup4 lxml
  python scrape_art_wiki_v5.py --limit 5 --dump --log
  python scrape_art_wiki_v5.py --limit 0  # 0 = all

Notes:
- Fast: requests + BeautifulSoup (no Selenium/browser).
- Parses Artcyclopedia anchors that are bare *.html (BASE href points at /artists/).
- Wikipedia title fallback via the Search API for tricky names (e.g., Maria a’Becket).
"""

import csv
import re
import time
import argparse
import urllib.parse
from datetime import datetime
from typing import Optional, List, Tuple

import requests
from bs4 import BeautifulSoup, NavigableString

ARTCYC_AZ = "http://www.artcyclopedia.com/artists/AZ.html"
WIKI_API  = "https://en.wikipedia.org/w/api.php"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

def fetch_html(url: str, session: Optional[requests.Session] = None, timeout: int = 25) -> str:
    s = session or requests.Session()
    r = s.get(url, headers=HEADERS, timeout=timeout)
    r.raise_for_status()
    if not r.encoding:
        r.encoding = r.apparent_encoding or "utf-8"
    return r.text

def clean_description(desc: str) -> str:
    if not desc:
        return ""
    return re.sub(r"^\s*[-–—]\s*", "", desc).strip()

def parse_artcyclopedia(html: str, limit: Optional[int] = None) -> List[Tuple[str, str]]:
    """
    Artcyclopedia A–Z uses <BASE href=".../artists/"> and anchors like:
      <a href="abecket_maria.html">Maria A'Becket</a> - American Painter
    We target anchors ending with .html and read the following text node as the description.
    """
    soup = BeautifulSoup(html, "lxml")
    out: List[Tuple[str, str]] = []

    for a in soup.select('a[href$=".html"]'):
        href = a.get("href", "")
        # Skip absolute links (rare) or navigation if any appear
        if href.startswith(("http://", "https://")):
            continue

        name = a.get_text(" ", strip=True)
        if not name:
            continue

        desc = ""
        # Preferred: text node immediately after the link (e.g., " - American Painter")
        for sib in a.next_siblings:
            if isinstance(sib, NavigableString):
                txt = str(sib).strip()
                if txt:
                    desc = clean_description(txt)
                    break
        # Fallback: remove "Name – " from parent text
        if not desc and a.parent:
            full = a.parent.get_text(" ", strip=True)
            desc = re.sub(rf"^{re.escape(name)}\s*[-–—]?\s*", "", full).strip()

        out.append((name, desc))
        if limit and len(out) >= limit:
            return out

    return out[:limit] if limit else out

def build_wiki_urls_from_title(title: str) -> Tuple[str, str]:
    safe = urllib.parse.quote(title.replace(" ", "_"), safe="_()")
    wiki_url = f"https://en.wikipedia.org/wiki/{safe}"
    info_url = f"https://en.wikipedia.org/w/index.php?title={safe}&action=info"
    return wiki_url, info_url

def extract_views_from_info(html: str) -> Optional[str]:
    """
    Robust extraction:
      - Prefer row id '#mw-pvi-month-count' where both cells are <td>
      - Fallback to table label scan (first cell "Page views in the past 30 days")
    Returns the numeric text (with commas) or None.
    """
    soup = BeautifulSoup(html, "lxml")

    # 1) Preferred path (present on enwiki as of 2025)
    row = soup.select_one("tr#mw-pvi-month-count")
    if row:
        cells = row.find_all("td")
        if cells:
            text = cells[-1].get_text(strip=True)
            m = re.search(r"[\d,]+", text)
            if m:
                return m.group(0)

    # 2) Fallback: scan page info table rows
    for tr in soup.select("table.mw-page-info tr"):
        cells = tr.find_all(["th", "td"])
        if not cells:
            continue
        if "Page views in the past 30 days" in cells[0].get_text(strip=True):
            text = cells[-1].get_text(strip=True)
            m = re.search(r"[\d,]+", text)
            if m:
                return m.group(0)

    return None

def wikipedia_search_title(session: requests.Session, query: str) -> Optional[str]:
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "format": "json",
        "srlimit": 1,
    }
    try:
        r = session.get(WIKI_API, params=params, headers=HEADERS, timeout=25)
        r.raise_for_status()
        hits = r.json().get("query", {}).get("search", [])
        return hits[0]["title"] if hits else None
    except Exception:
        return None

def fetch_wiki_views(session: requests.Session, artist_name: str, sleep: float = 0.25) -> Tuple[str, str]:
    # try direct title first
    wiki_url, info_url = build_wiki_urls_from_title(artist_name)
    try:
        html = fetch_html(info_url, session=session)
        views = extract_views_from_info(html)
        time.sleep(sleep)
        if views:
            return wiki_url, views
    except Exception:
        pass

    # fallback to search API
    title = wikipedia_search_title(session, artist_name)
    if title:
        wiki_url, info_url = build_wiki_urls_from_title(title)
        try:
            html = fetch_html(info_url, session=session)
            views = extract_views_from_info(html) or "N/A"
            time.sleep(sleep)
            return wiki_url, views
        except Exception:
            return wiki_url, "N/A"

    return wiki_url, "N/A"

def main():
    ap = argparse.ArgumentParser(description="Scrape Artcyclopedia and fetch Wikipedia 30-day page views.")
    ap.add_argument("--limit", type=int, default=5, help="Limit artists (0 = all)")
    ap.add_argument("--sleep", type=float, default=0.25, help="Delay between Wikipedia requests (seconds)")
    ap.add_argument("--out", type=str, default="artists_wiki_views.csv", help="CSV output filename")
    ap.add_argument("--dump", action="store_true", help="Dump fetched Artcyclopedia HTML to artcyclopedia_AZ_dump.html")
    ap.add_argument("--log", action="store_true", help="Print per-artist progress lines")
    args, _ = ap.parse_known_args()  # ignore unknown args in notebooks

    start_dt = datetime.now()
    t0 = time.perf_counter()

    s = requests.Session()
    az_html = fetch_html(ARTCYC_AZ, session=s)
    if args.dump:
        with open("artcyclopedia_AZ_dump.html", "w", encoding="utf-8", errors="ignore") as f:
            f.write(az_html)

    artists = parse_artcyclopedia(az_html, limit=(None if args.limit == 0 else args.limit))
    if not artists:
        print("No artists parsed from Artcyclopedia. Check network or page structure.")
        return

    rows = []
    for i, (name, desc) in enumerate(artists, 1):
        wiki_url, views = fetch_wiki_views(s, name, sleep=args.sleep)
        rows.append((name, desc, wiki_url, views))
        if args.log:
            print(f"[{i}/{len(artists)}] {name} -> views={views}")

    with open(args.out, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["Artist name", "Description", "Wiki URL", "Page Views"])
        w.writerows(rows)

    t1 = time.perf_counter()
    end_dt = datetime.now()
    elapsed = t1 - t0
    per = elapsed / max(len(artists), 1)
    print(f"Started:  {start_dt.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Finished: {end_dt.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Duration: {elapsed:.2f} seconds "
          f"({elapsed/60:.2f} minutes); {len(artists)} artists; ~{per:.3f}s/artist")

if __name__ == "__main__":
    main()
