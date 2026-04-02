from flask import Flask, request, jsonify, send_file, render_template
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import os, re, zipfile, datetime, io, urllib.parse

app = Flask(__name__)

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def slugify(text, max_len=60):
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"\s+", "-", text).strip("-")
    return text[:max_len]


def extract_article(page):
    html = page.content()
    soup = BeautifulSoup(html, "html.parser")

    # headline: try h1 first, fallback to og:title
    h1 = soup.find("h1")
    title = h1.get_text(strip=True) if h1 else None

    if not title:
        og = soup.find("meta", property="og:title")
        title = og["content"] if og else "Untitled"

    # image: og:image first
    img = None
    og_img = soup.find("meta", property="og:image")
    if og_img:
        img = og_img["content"]

    # text: first real paragraph
    paragraphs = [
        p.get_text(" ", strip=True)
        for p in soup.find_all("p")
        if len(p.get_text(strip=True)) > 80
    ]
    body = paragraphs[0] if paragraphs else ""

    return title, img, body


def render_card(browser, title, img, body, filename):
    page = browser.new_page(viewport={"width": 1080, "height": 1350})

    page.goto("about:blank")
    page.set_content(render_template(
        "frame.html",
        title=title,
        img=img,
        body=body
    ))

    page.wait_for_timeout(500)

    out_path = os.path.join(OUTPUT_DIR, filename)
    page.screenshot(path=out_path)
    page.close()

    return out_path


@app.route("/api/capture", methods=["POST"])
def capture():
    data = request.json
    urls = data.get("urls", [])

    if not urls:
        return jsonify({"error": "No URLs provided"}), 400

    ts = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    batch_dir = os.path.join(OUTPUT_DIR, ts)
    os.makedirs(batch_dir, exist_ok=True)

    zip_path = os.path.join(OUTPUT_DIR, f"{ts}.zip")

    with sync_playwright() as p:
        browser = p.chromium.launch()

        for i, url in enumerate(urls, 1):
            page = browser.new_page()
            page.goto(url, wait_until="networkidle", timeout=60000)

            title, img, body = extract_article(page)
            page.close()

            domain = urllib.parse.urlparse(url).netloc.replace("www.", "")
            fname = f"{i:02d}_{domain}_{slugify(title)}.png"

            render_card(browser, title, img, body, os.path.join(ts, fname))

        browser.close()

    # zip
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(batch_dir):
            for f in files:
                full = os.path.join(root, f)
                z.write(full, arcname=f)

    return jsonify({"zip": zip_path})


@app.route("/")
def index():
    return """
    <html><body style="font-family:sans-serif;padding:30px">
    <h2>Article → Instagram Frames</h2>
    <textarea id="urls" rows="10" style="width:100%"></textarea><br><br>
    <button onclick="go()">Generate</button>
    <pre id="out"></pre>
    <script>
    async function go(){
      const urls=document.getElementById("urls").value
        .split("\\n").map(x=>x.trim()).filter(Boolean)
      const r=await fetch("/api/capture",{method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({urls})})
      document.getElementById("out").textContent=await r.text()
    }
    </script>
    </body></html>
    """


if __name__ == "__main__":
    app.run(port=5000, debug=True)
