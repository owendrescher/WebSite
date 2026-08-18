"""Refresh the checked-in RotoWire default batting-order seed file."""
from __future__ import annotations

import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

TEAMS = "ARI ATH ATL BAL BOS CHC CIN CLE COL CWS DET HOU KC LAA LAD MIA MIL MIN NYM NYY PHI PIT SD SEA SF STL TB TEX TOR WSH".split()
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "rotowire-default-lineups.js"

def extract_order(page: str, hand: str) -> list[str]:
    marker = rf"Default vs\. {hand}</div>"
    match = re.search(marker + r"(.*?)(?=<div class=\"col border-rb mb-20\"|<div class=\"heading border-t|$)", page, re.S | re.I)
    if not match:
        return []
    names = re.findall(r'<li class="md-text"><a[^>]*>([^<]+)</a></li>', match.group(1), re.I)
    return [html.unescape(re.sub(r"\s+", " ", name)).strip() for name in names[:9]]

def fetch_team(team: str) -> dict[str, list[str]]:
    request = Request(f"https://www.rotowire.com/baseball/batting-orders.php?team={team}", headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(request, timeout=30) as response:
        page = response.read().decode("utf-8", "replace")
    result = {hand: extract_order(page, hand) for hand in ("RHP", "LHP")}
    if any(len(order) != 9 for order in result.values()):
        raise RuntimeError(f"{team}: could not read two complete 9-player batting orders")
    return result

def main() -> None:
    seeds = {team: fetch_team(team) for team in TEAMS}
    timestamp = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    payload = json.dumps(seeds, ensure_ascii=False, separators=(",", ":"))
    OUTPUT.write_text("// Generated from current RotoWire default batting orders by opposing pitcher hand.\n" + f"// Generated at {timestamp}.\n" + f"window.ROTOWIRE_DEFAULT_LINEUP_SEEDS = {payload};\n", encoding="utf-8")
    print(f"Updated {OUTPUT.name} for {len(seeds)} teams at {timestamp}")

if __name__ == "__main__":
    main()
