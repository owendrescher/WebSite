from flask import Flask, request, send_file, jsonify, send_from_directory
from playwright.sync_api import sync_playwright
import io
import re
import zipfile
from datetime import datetime
from urllib.parse import urlparse, unquote

app = Flask(__name__)

DOMAIN_LABELS = {
    "www.dw.com": "DW",
    "dw.com": "DW",
    "www.france24.com": "FRANCE24",
    "france24.com": "FRANCE24",
    "www.ansa.it": "ANSA",
    "ansa.it": "ANSA",
}

CONSENT_TEXTS = [
    "Ablehnen", "Zustimmen",
    "ACCETTA", "ACCETTA E CONTINUA", "RIFIUTA", "Rifiuta",
    "Tout accepter", "Accepter", "Refuser",
    "Accept", "I agree", "Agree", "Reject", "Decline", "Continue", "OK",
]


# ----------------- naming -----------------

def slugify(s: str, max_len: int = 60) -> str:
    s = unquote(s or "")
    s = s.lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[\s_-]+", "-", s).strip("-")
    return (s or "article")[:max_len].rstrip("-")


def label_for_host(host: str) -> str:
    host = (host or "").lower()
    return DOMAIN_LABELS.get(host, host.split(".")[0].upper() or "SITE")


def nice_filename(url: str, i: int) -> str:
    parsed = urlparse(url)
    host_label = label_for_host(parsed.netloc)
    path = parsed.path.strip("/")
    last = path.split("/")[-1] if path else ""
    slug = slugify(last) if last else "article"
    return f"{i:03d}_{host_label}_{slug}.png"


# ----------------- consent / overlays -----------------

def click_consent_everywhere(page) -> bool:
    clicked = False

    def try_in_frame(frame) -> bool:
        nonlocal clicked
        for txt in CONSENT_TEXTS:
            try:
                btn = frame.get_by_role("button", name=txt).first
                if btn.count() > 0 and btn.is_visible():
                    btn.click(timeout=1500, force=True)
                    clicked = True
                    return True
            except Exception:
                pass
            try:
                loc = frame.locator(f"text={txt}").first
                if loc.count() > 0 and loc.is_visible():
                    loc.click(timeout=1500, force=True)
                    clicked = True
                    return True
            except Exception:
                pass
        return False

    try_in_frame(page)

    try:
        for fr in page.frames:
            if fr == page.main_frame:
                continue
            if try_in_frame(fr):
                break
    except Exception:
        pass

    try:
        page.keyboard.press("Escape")
    except Exception:
        pass

    return clicked


def remove_overlays_hard(page):
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
        "[data-testid*='consent']",
        "[data-testid*='cookie']",
        "[aria-label*='cookie']",
        "[aria-label*='consent']",
    ]

    page.evaluate(
        """
        (selectors) => {
          const hide = (el) => {
            try {
              el.style.setProperty('display', 'none', 'important');
              el.style.setProperty('visibility', 'hidden', 'important');
              el.style.setProperty('opacity', '0', 'important');
              el.style.setProperty('pointer-events', 'none', 'important');
            } catch (e) {}
          };

          selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => hide(el));
          });

          document.querySelectorAll("iframe").forEach(ifr => {
            const src = (ifr.getAttribute("src") || "").toLowerCase();
            const name = (ifr.getAttribute("name") || "").toLowerCase();
            if (
              src.includes("consent") || src.includes("privacy") || src.includes("cookie") ||
              src.includes("cmp") || src.includes("sp_message") ||
              name.includes("consent") || name.includes("cmp")
            ) hide(ifr);
          });

          const vh = window.innerHeight;
          const vw = window.innerWidth;
          document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            const zi = parseInt(style.zIndex || '0', 10);
            const pos = style.position;
            if ((pos === 'fixed' || pos === 'sticky') && zi >= 999) {
              const r = el.getBoundingClientRect();
              const big = (r.height > vh * 0.35) || (r.width > vw * 0.35);
              const centerish = (r.top < vh*0.2 && r.bottom > vh*0.8);
              if (big || centerish) hide(el);
            }
          });

          document.documentElement.style.overflow = 'auto';
          document.body.style.overflow = 'auto';
          document.body.style.position = 'static';
        }
        """,
        selectors,
    )


# ----------------- “text + images only” pruning -----------------

def simplify_to_text_and_images(page):
    # NOTE: this version does NOT nuke header/nav first.
    # It finds the best article/root, then hides everything else,
    # then removes nav-like blocks using link-density + position heuristics.
    page.evaluate(
        r"""
        () => {
          const HIDE = (el) => {
            try {
              el.style.setProperty("display", "none", "important");
              el.style.setProperty("visibility", "hidden", "important");
              el.style.setProperty("opacity", "0", "important");
              el.style.setProperty("pointer-events", "none", "important");
            } catch (e) {}
          };

          const isVisible = (el) => {
            if (!el) return false;
            const st = window.getComputedStyle(el);
            if (st.display === "none" || st.visibility === "hidden" || st.opacity === "0") return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          };

          const textLen = (el) => ((el && el.innerText) ? el.innerText.replace(/\s+/g," ").trim().length : 0);
          const imgCount = (el) => el ? el.querySelectorAll("img, picture").length : 0;
          const linkCount = (el) => el ? el.querySelectorAll("a").length : 0;

          const linkDensity = (el) => {
            const t = textLen(el);
            const lc = linkCount(el);
            if (t <= 0) return lc > 0 ? 1 : 0;
            return Math.min(1, (lc * 20) / t); // heuristic
          };

          // candidate set
          const candSel = [
            "article",
            "main",
            "[role='main']",
            "[itemprop='articleBody']",
            "[data-article-body]",
            ".article",
            ".article-body",
            ".article__body",
            ".article-content",
            ".post",
            ".post-content",
            ".content",
            ".story",
            ".story-body",
          ].join(",");

          const candidates = Array.from(document.querySelectorAll(candSel))
            .filter(el => isVisible(el));

          // fallback candidates: big containers
          const bigOnes = Array.from(document.querySelectorAll("div, section"))
            .filter(el => isVisible(el) && textLen(el) > 800);

          const pool = candidates.length ? candidates : bigOnes.length ? bigOnes : [document.body];

          const score = (el) => {
            const t = textLen(el);
            const imgs = imgCount(el);
            const ld = linkDensity(el);
            // penalize navigation-heavy containers
            return t + imgs * 2500 - ld * 4000;
          };

          let root = null;
          let best = -1;
          for (const el of pool) {
            const s = score(el);
            if (s > best) { best = s; root = el; }
          }
          if (!root) root = document.body;

          // if root is body, pick best direct child by score
          if (root === document.body) {
            let bestChild = null;
            let bestChildScore = -1;
            Array.from(document.body.children).forEach(ch => {
              if (!isVisible(ch)) return;
              const s = score(ch);
              if (s > bestChildScore) { bestChildScore = s; bestChild = ch; }
            });
            if (bestChild && bestChildScore > 1200) root = bestChild;
          }

          // Hide everything outside root (and ancestors needed to keep layout stable)
          const keep = new Set();
          let p = root;
          while (p && p !== document.body) { keep.add(p); p = p.parentElement; }

          Array.from(document.body.children).forEach(ch => {
            if (ch === root) return;
            if (keep.has(ch)) return;
            if (!root.contains(ch)) HIDE(ch);
          });

          // Remove fixed/sticky top bars (DW/ANSA style) by behavior:
          // lots of links, small height, near top, not containing the main h1.
          const mainH1 = root.querySelector("h1") || document.querySelector("h1");

          const isNavBarLike = (el) => {
            if (!isVisible(el)) return false;
            const r = el.getBoundingClientRect();
            if (r.top < -10 || r.top > 260) return false;
            if (r.height < 36 || r.height > 220) return false;

            const lc = linkCount(el);
            const t = textLen(el);
            const ld = linkDensity(el);
            const style = window.getComputedStyle(el);
            const pos = style.position;

            const manyLinks = lc >= 6;
            const navish = manyLinks && (ld > 0.25 || t < 260);
            const fixedish = (pos === "fixed" || pos === "sticky");
            const wide = r.width > window.innerWidth * 0.6;

            // don't kill headline container
            if (mainH1 && el.contains(mainH1)) return false;

            return wide && (navish || fixedish);
          };

          // scan near top for bars
          const topEls = Array.from(document.querySelectorAll("body *"))
            .filter(el => {
              const r = el.getBoundingClientRect();
              return r.top >= -10 && r.top <= 260 && r.height >= 36 && r.height <= 220;
            });

          for (const el of topEls) {
            if (isNavBarLike(el)) HIDE(el);
          }

          // Now keep only text-ish + image-ish content inside root.
          const badHints = [
            "ad","ads","advert","advertis","pub","publicit",
            "sponsor","promo","promoted","banner",
            "cookie","consent","gdpr","privacy",
            "newsletter","subscribe","login","register",
            "share","social","follow","comment",
            "related","recommended","most-read","trending","popular",
            "outbrain","taboola"
          ];

          const looksBad = (el) => {
            const id = (el.id || "").toLowerCase();
            const cls = (el.className || "").toString().toLowerCase();
            const aria = (el.getAttribute("aria-label") || "").toLowerCase();
            const role = (el.getAttribute("role") || "").toLowerCase();
            const blob = `${id} ${cls} ${aria} ${role}`;
            return badHints.some(h => blob.includes(h));
          };

          const hasImage = (el) => !!el.querySelector("img, picture");
          const hasText = (el) => textLen(el) > 0;

          const allowedTags = new Set([
            "article","main","section","div",
            "h1","h2","h3","h4","h5","h6",
            "p","span","strong","em","b","i","u",
            "ul","ol","li",
            "blockquote","pre","code",
            "figure","figcaption",
            "img","picture","source",
            "br","hr",
            "time"
          ]);

          // remove obvious non-content nodes inside root
          root.querySelectorAll("script, style, noscript, iframe, form, button, input, select, textarea, svg, canvas, video, audio").forEach(HIDE);

          const all = Array.from(root.querySelectorAll("*"));

          for (const el of all) {
            const tag = el.tagName.toLowerCase();

            if (looksBad(el)) { HIDE(el); continue; }

            // kill sidebars/menus inside root by link density
            const r = el.getBoundingClientRect();
            if (r.top < 320 && r.height < 240 && linkCount(el) >= 8 && linkDensity(el) > 0.25) {
              if (!(mainH1 && el.contains(mainH1))) { HIDE(el); continue; }
            }

            if (!allowedTags.has(tag)) { HIDE(el); continue; }

            if (tag === "img" || tag === "picture" || tag === "source") continue;

            // Keep headline elements even if short
            if (tag === "h1" || tag === "h2") continue;

            if (!hasText(el) && !hasImage(el)) { HIDE(el); continue; }
          }

          // tighten layout for screenshot
          document.documentElement.style.background = "#fff";
          document.body.style.background = "#fff";

          // Make root centered and readable
          root.style.maxWidth = "980px";
          root.style.margin = "0 auto";
          root.style.padding = "0 18px";

          // scroll to headline if we have one (prefer h1 inside root, else global h1)
          const h1 = root.querySelector("h1") || document.querySelector("h1");
          if (h1 && isVisible(h1)) {
            h1.scrollIntoView({ block: "start" });
            const rr = h1.getBoundingClientRect();
            window.scrollTo(0, Math.max(0, window.scrollY + rr.top - 12));
          } else {
            root.scrollIntoView({ block: "start" });
            window.scrollTo(0, Math.max(0, window.scrollY - 12));
          }
        }
        """
    )


def prepare_uniform_instagram(page, url: str):
    page.wait_for_timeout(1200)

    click_consent_everywhere(page)
    page.wait_for_timeout(600)

    # keep popup stuff same
    try:
        remove_overlays_hard(page)
        page.wait_for_timeout(250)
        remove_overlays_hard(page)
    except Exception:
        pass

    # now: strip to text + images only (robust version)
    try:
        simplify_to_text_and_images(page)
        page.wait_for_timeout(250)
        simplify_to_text_and_images(page)
    except Exception:
        pass


# ----------------- capture -----------------

def screenshot_one(page, url: str, mode: str) -> bytes:
    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    try:
        page.wait_for_load_state("networkidle", timeout=6000)
    except Exception:
        pass

    prepare_uniform_instagram(page, url)

    if mode == "instagram":
        return page.screenshot(full_page=False)
    else:
        return page.screenshot(full_page=True)


# ----------------- routes -----------------

@app.route("/snapshot", methods=["POST"])
def snapshot_single():
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()
    mode = (data.get("mode") or "instagram").strip().lower()

    if not url:
        return jsonify({"error": "Missing 'url' in JSON body"}), 400
    if not (url.startswith("http://") or url.startswith("https://")):
        return jsonify({"error": "URL must start with http:// or https://"}), 400
    if mode not in ("instagram", "full"):
        mode = "instagram"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(
            viewport={"width": 1080, "height": 1350} if mode == "instagram" else {"width": 1280, "height": 720}
        )
        try:
            png = screenshot_one(page, url, mode)
        except Exception as e:
            browser.close()
            return jsonify({"error": f"Could not capture screenshot: {e}"}), 500
        browser.close()

    return send_file(io.BytesIO(png), mimetype="image/png", as_attachment=False, download_name="snapshot.png")


@app.route("/snapshots_zip", methods=["POST"])
def snapshots_zip():
    data = request.get_json(silent=True) or {}
    urls = data.get("urls") or []
    mode = (data.get("mode") or "instagram").strip().lower()

    if not isinstance(urls, list) or not urls:
        return jsonify({"error": "Provide non-empty 'urls' array"}), 400

    cleaned = []
    for u in urls:
        if isinstance(u, str):
            u = u.strip()
            if u.startswith("http://") or u.startswith("https://"):
                cleaned.append(u)

    if not cleaned:
        return jsonify({"error": "No valid URLs (must start with http:// or https://)"}), 400
    if mode not in ("instagram", "full"):
        mode = "instagram"

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    bundle_name = f"igshots_{ts}"
    zip_name = f"{bundle_name}.zip"

    zip_buf = io.BytesIO()

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(
            viewport={"width": 1080, "height": 1350} if mode == "instagram" else {"width": 1280, "height": 720}
        )

        with zipfile.ZipFile(zip_buf, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            for i, url in enumerate(cleaned, start=1):
                try:
                    png = screenshot_one(page, url, mode)
                    zf.writestr(f"{bundle_name}/{nice_filename(url, i)}", png)
                except Exception as e:
                    zf.writestr(f"{bundle_name}/{i:03d}_ERROR.txt", f"Failed: {url}\nReason: {e}\n")

        browser.close()

    zip_buf.seek(0)
    return send_file(zip_buf, mimetype="application/zip", as_attachment=True, download_name=zip_name)


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
