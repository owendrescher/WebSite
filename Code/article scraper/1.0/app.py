from flask import Flask, request, send_file, jsonify, send_from_directory
from playwright.sync_api import sync_playwright
import io

app = Flask(__name__)


def take_screenshot(url: str) -> bytes:
    """Open URL in headless Chromium and return screenshot bytes."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        page.goto(url, wait_until="networkidle", timeout=60000)
        screenshot_bytes = page.screenshot(full_page=True)
        browser.close()
        return screenshot_bytes


@app.route("/snapshot", methods=["POST"])
def snapshot():
    """
    Expects JSON: { "url": "https://example.com" }
    Returns: PNG image of the page.
    """
    data = request.get_json(silent=True) or {}
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "Missing 'url' in JSON body"}), 400

    if not (url.startswith("http://") or url.startswith("https://")):
        return jsonify({"error": "URL must start with http:// or https://"}), 400

    try:
        screenshot_bytes = take_screenshot(url)
    except Exception as e:
        return jsonify({"error": f"Could not capture screenshot: {e}"}), 500

    return send_file(
        io.BytesIO(screenshot_bytes),
        mimetype="image/png",
        as_attachment=False,
        download_name="snapshot.png",
    )


@app.route("/")
def index():
    # serve index.html from the same folder as app.py
    return send_from_directory(".", "index.html")


if __name__ == "__main__":
    # run the dev server
    app.run(host="127.0.0.1", port=5000, debug=True)
