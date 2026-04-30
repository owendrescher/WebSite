#%%

# -*- coding: utf-8 -*-
"""
Scrape Artcyclopedia A–Z -> (Artist, Description),
then fetch Wikipedia 30-day page views from action=info.

CSV columns: Artist name, Description, Wiki URL, Page Views

Usage:
  python scrape_art_wiki_v4.py --limit 5 --dump
  python scrape_art_wiki_v4.py --limit 0            # 0 = all
"""

import csv, re, time, argparse, urllib.parse
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
    # Respect the page’s declared encoding (ISO-8859-1 on Artcyclopedia)
    if not r.encoding:
        r.encoding = r.apparent_encoding or "utf-8"
    return r.text

def clean_description(desc: str) -> str:
    if not desc:
        return ""
    return re.sub(r"^\s*[-–—]\s*", "", desc).strip()

def parse_artcyclopedia(html: str, limit: Optional[int] = None) -> List[Tuple[str, str]]:
    """
    The A–Z page uses <BASE HREF=".../artists/"> and then anchors like:
      <a href="abecket_maria.html"> Maria A'Becket</a> - American Painter
    So we target anchors ending with .html and pull the following text node.
    """
    soup = BeautifulSoup(html, "lxml")
    out: List[Tuple[str, str]] = []

    # Content blocks hold many <a>…</a> entries with <br> after each.
    # Use a broad but safe selector, then filter.
    for a in soup.select('a[href$=".html"]'):
        href = a.get("href", "")
        # Skip obvious non-artist or navigation links if they appear
        if href.startswith(("http://", "https://")):
            continue

        name = a.get_text(" ", strip=True)
        if not name:
            continue

        # Preferred: text node immediately after the link
        desc = ""
        for sib in a.next_siblings:
            if isinstance(sib, NavigableString):
                txt = str(sib).strip()
                if txt:
                    desc = clean_description(txt)
                    break
            # if it's a tag (e.g., <br>), keep scanning

        # Fallback: remove "Name – " from parent <p>/<td> text
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

import re
from bs4 import BeautifulSoup

def extract_views_from_info(html: str) -> str | None:
    soup = BeautifulSoup(html, "lxml")

    # 1) Fast path: the row has a stable id on enwiki
    row = soup.select_one("tr#mw-pvi-month-count")
    if row:
        cells = row.find_all("td")
        if cells:
            text = cells[-1].get_text(strip=True)
            m = re.search(r"[\d,]+", text)
            if m:
                return m.group(0)

    # 2) Fallback: handle pages that use <th> or <td> as the label cell
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

def fetch_wiki_views(session: requests.Session, artist_name: str, sleep: float = 0.3) -> Tuple[str, str]:
    # try direct title
    wiki_url, info_url = build_wiki_urls_from_title(artist_name)
    try:
        html = fetch_html(info_url, session=session)
        views = extract_views_from_info(html)
        time.sleep(sleep)
        if views:
            return wiki_url, views
    except Exception:
        pass

    # fallback to search (handles Maria a'Becket, etc.)
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
    ap.add_argument("--sleep", type=float, default=0.3, help="Delay between Wikipedia requests")
    ap.add_argument("--out", type=str, default="artists_wiki_views.csv", help="CSV output file")
    ap.add_argument("--dump", action="store_true", help="Dump fetched Artcyclopedia HTML to artcyclopedia_AZ_dump.html")
    args, _ = ap.parse_known_args()

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
    for name, desc in artists:
        wiki_url, views = fetch_wiki_views(s, name, sleep=args.sleep)
        rows.append((name, desc, wiki_url, views))

    with open(args.out, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["Artist name", "Description", "Wiki URL", "Page Views"])
        w.writerows(rows)

    print(f"Wrote {len(rows)} rows to {args.out}")

if __name__ == "__main__":
    main()
