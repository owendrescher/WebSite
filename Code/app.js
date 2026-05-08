const tools = [
  {
    title: "Animation",
    href: "Animation Helper/index.html",
    preview: "animation.png",
    previewType: "image",
  },
  {
    title: "Script Learning",
    href: "Arabic Script Learning/index.html",
    preview: "script.png",
    previewType: "image",
  },
  {
    title: "Articles",
    href: "article scraper/3.1/index.html",
    preview: "articlescan.png",
    previewType: "image",
  },
  {
    title: "Reader",
    href: "Book Reader/Custom PDF Reader.html",
    preview: "bookreader.png",
    previewType: "image",
  },
  {
    title: "Club",
    href: "Club-Automation Replacement/index.html",
    preview: "clubauto.png",
    previewType: "image",
  },
  {
    title: "Lang Game",
    href: "Converted Lang Game/index.html",
    preview: "matchinggame.png",
    previewType: "image",
  },
  {
    title: "Tasks",
    href: "Daily Task List/tasks_v1.html",
    preview: "dailytask.png",
    previewType: "image",
  },
  {
    title: "Portfolio",
    href: "Web Portfolio/index.html",
    preview: "webportfolio.png",
    previewType: "image",
  },
  {
    title: "Map",
    href: "Map Info/index.html",
    preview: "mapinfo.png",
    previewType: "image",
  },
  {
    title: "Baseball",
    href: "fast-skeleton/dashboard.html",
    preview: "baseballtrack.png",
    previewType: "image",
  },
  {
    title: "Nutrition",
    href: "Nutrition and Cost Analysis/Nutrition.html",
    preview: "nutritioninfo.png",
    previewType: "image",
  },
  {
    title: "Lyrics",
    href: "Song Translation/app/index.html",
    preview: "songtranslation.png",
    previewType: "image",
  },
  {
    title: "Solar",
    href: "SolarSystem.html",
    preview: "solar.png",
    previewType: "image",
  },
];

const panels = Array.from(document.querySelectorAll("[data-tool-index]"));
const launcherGrid = document.getElementById("launcher-grid");
const toolCore = launcherGrid?.querySelector(".tool-core");
const overflowLinks = document.getElementById("core-extra-links");

function createPanelMarkup(tool) {
  const previewMarkup = tool.previewType === "image"
    ? `<img class="preview-image" src="${tool.preview}" alt="" loading="lazy" decoding="async">`
    : `<iframe class="preview-frame" title="${tool.title} preview" src="${tool.preview}" loading="lazy" tabindex="-1"></iframe>`;

  return `
    <div class="edge-content">
      <span class="panel-title">${tool.title}</span>
      <div class="mini-preview" aria-hidden="true">
        ${previewMarkup}
      </div>
    </div>
  `;
}

function hideEmbeddedHomeLink(frame) {
  try {
    const doc = frame.contentDocument;
    if (!doc) {
      return;
    }

    const existingStyle = doc.getElementById("owentools-preview-style");
    if (!existingStyle) {
      const style = doc.createElement("style");
      style.id = "owentools-preview-style";
      style.textContent = ".owentools-home-link{display:none !important;}";
      doc.head?.appendChild(style);
    }

    const homeLink = doc.querySelector(".owentools-home-link");
    if (homeLink) {
      homeLink.style.display = "none";
    }
  } catch (error) {
    // Same-origin preview pages should allow this; fail silently if a page doesn't.
  }
}

function populatePanels() {
  panels.forEach((panel) => {
    const tool = tools[Number(panel.dataset.toolIndex)];
    if (!tool) {
      panel.remove();
      return;
    }

    panel.hidden = false;
    panel.href = tool.href;
    panel.setAttribute("aria-label", `Open ${tool.title}`);
    panel.innerHTML = createPanelMarkup(tool);

    const frame = panel.querySelector(".preview-frame");
    if (frame) {
      frame.addEventListener("load", () => hideEmbeddedHomeLink(frame));
    }
  });
}

function populateOverflowLinks() {
  if (!overflowLinks) {
    return;
  }

  const overflowTools = tools.slice(panels.length);
  overflowLinks.innerHTML = "";
  overflowLinks.hidden = overflowTools.length === 0;

  overflowTools.forEach((tool) => {
    const link = document.createElement("a");
    link.className = "core-extra-link";
    link.href = tool.href;
    link.textContent = tool.title;
    overflowLinks.appendChild(link);
  });
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 35, 300)}ms`;
    observer.observe(node);
  });

  if (toolCore) {
    toolCore.style.transitionDelay = `${Math.min(panels.length * 35, 320)}ms`;
    observer.observe(toolCore);
  }
}

function shouldUseTileLayout() {
  if (!launcherGrid) {
    return false;
  }

  const width = window.innerWidth || document.documentElement.clientWidth || 0;
  const height = window.innerHeight || document.documentElement.clientHeight || 0;
  const portraitMedia = window.matchMedia?.("(orientation: portrait)")?.matches;
  const definitelyVertical = height > width * 1.08;
  const narrowTouchPortrait = portraitMedia && width <= 820;

  return definitelyVertical || narrowTouchPortrait;
}

function syncLayoutMode() {
  if (!launcherGrid) {
    return;
  }

  const useTileLayout = shouldUseTileLayout();
  launcherGrid.classList.toggle("is-tile-layout", useTileLayout);
  document.body.classList.toggle("tiles-mode", useTileLayout);
}

function setupPointerGlow() {
  if (!launcherGrid) {
    return;
  }

  launcherGrid.addEventListener("pointermove", (event) => {
    const rect = launcherGrid.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    launcherGrid.style.setProperty("--spot-x", `${x}%`);
    launcherGrid.style.setProperty("--spot-y", `${y}%`);
  });

  launcherGrid.addEventListener("pointerleave", () => {
    launcherGrid.style.setProperty("--spot-x", "50%");
    launcherGrid.style.setProperty("--spot-y", "50%");
  });
}

populatePanels();
populateOverflowLinks();
setupReveal();
syncLayoutMode();
setupPointerGlow();

window.addEventListener("resize", syncLayoutMode);
