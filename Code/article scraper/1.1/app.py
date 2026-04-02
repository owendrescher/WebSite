from flask import Flask, request, send_file, jsonify, send_from_directory
from playwright.sync_api import sync_playwright
import io

app = Flask(__name__)


def take_screenshot(url: str, mode: str = "instagram") -> bytes:
    """
    Open URL in headless Chromium and return screenshot bytes.

    mode = "instagram" -> 1080x1350 viewport (4:5, Insta portrait)
    mode = "full"      -> standard 1280x720 full-page screenshot
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        if mode == "instagram":
            # Instagram portrait: 1080 x 1350 (4:5 aspect)
            page = browser.new_page(viewport={"width": 1080, "height": 1350})
            page.goto(url, wait_until="networkidle", timeout=60000)
            # Only capture what fits in the viewport (top portion: title + image)
            screenshot_bytes = page.screenshot(full_page=False)
        else:
            # Default "full" mode: wider viewport and full-page capture
            page = browser.new_page(viewport={"width": 1280, "height": 720})
            page.goto(url, wait_until="networkidle", timeout=60000)
            screenshot_bytes = page.screenshot(full_page=True)

        browser.close()
        return screenshot_bytes


@app.route("/snapshot", methods=["POST"])
def snapshot():
    """
    Expects JSON: { "url": "https://example.com", "mode": "instagram" | "full" }
    Returns: PNG image of the page.
    """
    data = request.get_json(silent=True) or {}
    url = data.get("url", "").strip()
    mode = (data.get("mode") or "instagram").strip().lower()

    if not url:
        return jsonify({"error": "Missing 'url' in JSON body"}), 400

    if not (url.startswith("http://") or url.startswith("https://")):
        return jsonify({"error": "URL must start with http:// or https://"}), 400

    if mode not in ("instagram", "full"):
        mode = "instagram"

    try:
        screenshot_bytes = take_screenshot(url, mode=mode)
    except Exception as e:
        return jsonify({"error": f"Could not capture screenshot: {e}"}), 500

    # Return the image directly
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
    app.run(host="127.0.0.1", port=5000, debug=True)
