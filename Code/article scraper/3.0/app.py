import os
import re
import io
import zipfile
import datetime
import urllib.parse
from pathlib import Path

from flask import Flask, request, jsonify, send_from_directory
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeoutError

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ACCEPT_TEXTS = [
    # English
    "accept", "accept all", "agree", "i agree", "allow all", "ok", "got it",
    # German
    "akzeptieren", "alle akzeptieren", "zustimmen", "einverstanden", "ok",
    # French
    "accepter", "tout accepter", "j'accepte", "d'accord", "ok",
    # Italian
    "accetta", "accetta tutto", "accetto", "va bene", "ok",
    # Spanish/Portuguese
    "aceptar", "aceptar todo", "de acuerdo", "ok",
    "aceitar", "aceitar tudo", "concordo", "ok",
    # Common short ones
    "yes", "continue", "continue to site",
]


def domain_of(url: str) -> str:
    netloc = urllib.parse.urlparse(url).netloc
    return (netloc.replace("www.", "") or "site").lower()


def safe_click_accept_in_frame(frame) -> bool:
    clicked = False
    pattern = r"(" + "|".join(re.escape(t) for t in ACCEPT_TEXTS) + r")"
    rx = re.compile(pattern, re.IGNORECASE)

    candidates = [
        "button",
        "input[type='button']",
        "input[type='submit']",
        "[role='button']",
        "a[role='button']",
    ]

    for sel in candidates:
        loc = frame.locator(sel)
        try:
            count = loc.count()
        except Exception:
            continue
        if count == 0:
            continue

        limit = min(count, 50)
        for i in range(limit):
            el = loc.nth(i)
            try:
                if not el.is_visible():
                    continue

                text = ""
                try:
                    text = (el.inner_text() or "").strip()
                except Exception:
                    text = ""

                val = ""
                try:
                    val = (el.get_attribute("value") or "").strip()
                except Exception:
                    val = ""

                label = f"{text} {val}".strip()
                if not label:
                    continue

                if rx.search(label):
                    try:
                        el.scroll_into_view_if_needed(timeout=1500)
                    except Exception:
                        pass
                    try:
                        el.click(timeout=2500, force=True)
                        clicked = True
                        frame.page.wait_for_timeout(350)
                        return True
                    except Exception:
                        continue
            except Exception:
                continue

    return clicked


def try_accept_cookies(page) -> bool:
    clicked_any = False
    for _ in range(3):
        clicked = False
        clicked |= safe_click_accept_in_frame(page.main_frame)
        for fr in page.frames:
            if fr == page.main_frame:
                continue
            try:
                clicked |= safe_click_accept_in_frame(fr)
            except Exception:
                pass

        clicked_any |= clicked
        if not clicked:
            break

    try:
        page.keyboard.press("Escape")
    except Exception:
        pass

    return clicked_any


def screenshot_one(page, url: str, out_path: Path):
    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(900)

    try_accept_cookies(page)
    page.wait_for_timeout(800)

    try:
        page.wait_for_load_state("networkidle", timeout=8000)
    except PWTimeoutError:
        pass

    page.wait_for_timeout(500)

    # ---- NEW: cap screenshot height ----
    page_height = page.evaluate("""
        () => Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        )
    """)

    MAX_HEIGHT = 3000
    cap_height = min(page_height, MAX_HEIGHT)

    # Resize viewport to capped height
    page.set_viewport_size({
        "width": page.viewport_size["width"],
        "height": cap_height
    })

    page.wait_for_timeout(200)

    # Screenshot ONLY viewport (now capped)
    page.screenshot(path=str(out_path), full_page=False)



@app.route("/")
def index():
    return send_from_directory(str(BASE_DIR), "index.html")


@app.route("/output/<path:filename>")
def output_files(filename):
    return send_from_directory(str(OUTPUT_DIR), filename)


@app.route("/api/run", methods=["POST"])
def run():
    data = request.get_json(silent=True) or {}
    urls_raw = data.get("urls", "")
    headful = bool(data.get("headful", False))

    urls = []
    if isinstance(urls_raw, str):
        urls = [u.strip() for u in urls_raw.splitlines() if u.strip()]
    elif isinstance(urls_raw, list):
        urls = [str(u).strip() for u in urls_raw if str(u).strip()]

    urls = [u for u in urls if u.startswith("http://") or u.startswith("https://")]
    if not urls:
        return jsonify({"error": "No valid URLs. Must start with http:// or https://"}), 400

    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    folder_name = f"shots_{ts}"
    batch_dir = OUTPUT_DIR / folder_name
    batch_dir.mkdir(parents=True, exist_ok=True)

    zip_name = f"{folder_name}.zip"
    zip_path = OUTPUT_DIR / zip_name

    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=(not headful))
        context = browser.new_context(
            viewport={"width": 1400, "height": 900},
            locale="en-US",
        )
        context.set_default_timeout(60000)
        page = context.new_page()

        for i, url in enumerate(urls, 1):
            dom = domain_of(url)
            fname = f"{i:02d}_{dom}.png"
            out_path = batch_dir / fname

            try:
                screenshot_one(page, url, out_path)
                results.append({
                    "url": url,
                    "file": f"{folder_name}/{fname}",
                    "img_url": f"/output/{folder_name}/{fname}",
                })
            except Exception as e:
                err_name = f"{i:02d}_{dom}_FAILED.txt"
                (batch_dir / err_name).write_text(f"URL: {url}\nError: {e}\n", encoding="utf-8")
                results.append({"url": url, "error": str(e)})

        context.close()
        browser.close()

    # Zip the batch folder
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for pth in sorted(batch_dir.glob("*")):
            z.write(pth, arcname=pth.name)

    return jsonify({
        "folder": folder_name,
        "images": results,
        "zip_url": f"/output/{zip_name}",
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
