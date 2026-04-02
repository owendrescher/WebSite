import os
import re
import io
import base64
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


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Max-Age"] = "600"
    return response

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
                        frame.page.wait_for_timeout(350)
                        return True
                    except Exception:
                        continue
            except Exception:
                continue

    return False


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


def screenshot_one(page, url: str, out_path: Path, max_height: int = 3000):
    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(900)

    try_accept_cookies(page)
    page.wait_for_timeout(600)

    # --- NEW: force top after cookies ---
    page.evaluate("() => window.scrollTo(0, 0)")
    page.wait_for_timeout(250)

    try:
        page.wait_for_load_state("networkidle", timeout=8000)
    except PWTimeoutError:
        pass

    page.wait_for_timeout(400)

    # cap screenshot height
    page_height = page.evaluate("""
        () => Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        )
    """)
    cap_height = min(int(page_height), int(max_height))

    vp = page.viewport_size or {"width": 1400, "height": 900}
    page.set_viewport_size({"width": int(vp["width"]), "height": int(cap_height)})
    page.wait_for_timeout(150)

    # --- NEW: force top again after viewport resize ---
    page.evaluate("() => window.scrollTo(0, 0)")
    page.wait_for_timeout(150)

    # screenshot viewport only (capped)
    page.screenshot(path=str(out_path), full_page=False)



def safe_join_under_output(rel_path: str) -> Path:
    # prevent path traversal
    p = (OUTPUT_DIR / rel_path).resolve()
    if not str(p).startswith(str(OUTPUT_DIR.resolve())):
        raise ValueError("Invalid path")
    return p


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

    # parse URLs from textarea
    if isinstance(urls_raw, str):
        urls = [u.strip() for u in urls_raw.splitlines() if u.strip()]
    elif isinstance(urls_raw, list):
        urls = [str(u).strip() for u in urls_raw if str(u).strip()]
    else:
        urls = []

    urls = [u for u in urls if u.startswith("http://") or u.startswith("https://")]
    if not urls:
        return jsonify({"error": "No valid URLs. Must start with http:// or https://"}), 400

    # folder under date
    now = datetime.datetime.now()
    date_folder = now.strftime("%Y-%m-%d")
    batch_folder = f"shots_{now.strftime('%H%M%S')}"
    batch_rel = f"{date_folder}/{batch_folder}"

    batch_dir = OUTPUT_DIR / batch_rel
    (batch_dir / "raw").mkdir(parents=True, exist_ok=True)
    (batch_dir / "final").mkdir(parents=True, exist_ok=True)

    results = []
    domain_counts = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=(not headful))
        context = browser.new_context(
            viewport={"width": 1400, "height": 900},
            locale="en-US",
        )
        context.set_default_timeout(60000)
        page = context.new_page()

        for url in urls:
            dom = domain_of(url)
            domain_counts[dom] = domain_counts.get(dom, 0) + 1

            # raw file name: domain(.png) with suffix if repeated
            suffix = f"_{domain_counts[dom]}" if domain_counts[dom] > 1 else ""
            raw_name = f"{dom}{suffix}.png"

            raw_rel = f"{batch_rel}/raw/{raw_name}"
            raw_path = OUTPUT_DIR / raw_rel

            try:
                screenshot_one(page, url, raw_path, max_height=3000)
                results.append({
                    "url": url,
                    "domain": dom,
                    "raw_file": raw_rel,
                    "raw_url": f"/output/{raw_rel}",
                    # final will be domain(.png) too; frontend will save crops as domain(+_n).png
                })
            except Exception as e:
                results.append({"url": url, "domain": dom, "error": str(e)})

        context.close()
        browser.close()

    return jsonify({
        "batch": batch_rel,   # e.g. 2025-12-30/shots_133012
        "items": results
    })


@app.route("/api/save_crop", methods=["POST"])
def save_crop():
    data = request.get_json(silent=True) or {}
    batch = (data.get("batch") or "").strip()
    filename = (data.get("filename") or "").strip()  # e.g. dw.com.png
    png_b64 = (data.get("png_base64") or "").strip()

    if not batch or not filename or not png_b64:
        return jsonify({"error": "Missing batch, filename, or png_base64"}), 400

    # accept either raw base64 or data URL
    if png_b64.startswith("data:image/png;base64,"):
        png_b64 = png_b64.split(",", 1)[1]

    try:
        png_bytes = base64.b64decode(png_b64, validate=True)
    except Exception:
        return jsonify({"error": "Invalid base64"}), 400

    # write to final folder
    final_rel = f"{batch}/final/{filename}"
    final_path = safe_join_under_output(final_rel)
    final_path.parent.mkdir(parents=True, exist_ok=True)
    final_path.write_bytes(png_bytes)

    return jsonify({"ok": True, "final_file": final_rel, "final_url": f"/output/{final_rel}"})


@app.route("/api/delete_raw", methods=["POST"])
def delete_raw():
    data = request.get_json(silent=True) or {}
    raw_file = (data.get("raw_file") or "").strip()
    if not raw_file:
        return jsonify({"error": "Missing raw_file"}), 400

    try:
        p = safe_join_under_output(raw_file)
    except Exception:
        return jsonify({"error": "Invalid path"}), 400

    if p.exists() and p.is_file():
        p.unlink()

    return jsonify({"ok": True})


@app.route("/api/zip_final", methods=["POST"])
def zip_final():
    data = request.get_json(silent=True) or {}
    batch = (data.get("batch") or "").strip()
    if not batch:
        return jsonify({"error": "Missing batch"}), 400

    final_dir = safe_join_under_output(f"{batch}/final")
    if not final_dir.exists():
        return jsonify({"error": "Final folder does not exist"}), 400

    # zip sits next to batch folder: output/YYYY-MM-DD/shots_HHMMSS_final.zip
    batch_name = batch.split("/")[-1]
    date_folder = batch.split("/")[0]
    zip_rel = f"{date_folder}/{batch_name}_final.zip"
    zip_path = safe_join_under_output(zip_rel)

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(final_dir.glob("*.png")):
            z.write(p, arcname=p.name)

    return jsonify({"ok": True, "zip_file": zip_rel, "zip_url": f"/output/{zip_rel}"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
