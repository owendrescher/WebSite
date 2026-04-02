from flask import Flask, request, send_file, jsonify, send_from_directory
from playwright.sync_api import sync_playwright
import io

app = Flask(__name__)


def remove_cookie_banners(page):
    """
    Best-effort removal of cookie / consent overlays before screenshot.
    This uses heuristics on id/class names and role=dialog.
    """
    selectors = [
        "[id*='cookie']",
        "[class*='cookie']",
        "[id*='consent']",
        "[class*='consent']",
        "[id*='gdpr']",
        "[class*='gdpr']",
        "[id*='privacy']",
        "[class*='privacy']",
        "div[role='dialog']",
        "section[role='dialog']",
        "div[aria-modal='true']",
    ]

    page.evaluate(
        """
        (selectors) => {
          const hide = (el) => {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
            el.style.setProperty('opacity', '0', 'important');
          };

          selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => hide(el));
          });

          // Also remove any full-screen fixed overlays with high z-index
          document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            const zi = parseInt(style.zIndex || '0', 10);
            if (
              (style.position === 'fixed' || style.position === 'sticky') &&
              zi >= 1000 &&
              (el.clientHeight > window.innerHeight * 0.4 ||
               el.clientWidth > window.innerWidth * 0.4)
            ) {
              hide(el);
            }
          });
        }
        """,
        selectors,
    )


def take_screenshot(url: str, mode: str = "instagram") -> bytes:
    """
    Open URL in headless Chromium and return screenshot bytes.

    mode = "instagram" -> 1080x1350 viewport (4:5, Insta portrait)
    mode = "full"      -> 1280x720 full-page screenshot
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        if mode == "instagram":
            page = browser.new_page(viewport={"width": 1080, "height": 1350})
        else:
            page = browser.new_page(viewport={"width": 1280, "height": 720})

        page.goto(url, wait_until="networkidle", timeout=60000)

        # Give scripts/overlays a second to load
        page.wait_for_timeout(2000)

        # Try to strip cookie / consent overlays
        try:
            remove_cookie_banners(page)
        except Exception:
            # Don't fail the whole capture if this heuristic explodes
            pass

        if mode == "instagram":
            screenshot_bytes = page.screenshot(full_page=False)
        else:
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
