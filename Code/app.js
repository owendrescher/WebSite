const tools = [
  {
    title: "Web Portfolio",
    href: "Web Portfolio/index.html",
    preview: "Web Portfolio/index.html",
  },
  {
    title: "Solar System",
    href: "SolarSystem.html",
    preview: "SolarSystem.html",
  },
  {
    title: "Daily Task List",
    href: "Daily Task List/tasks_v1.html",
    preview: "Daily Task List/tasks_v1.html",
  },
  {
    title: "Article Scraper",
    href: "article scraper/3.1/index.html",
    preview: "article scraper/3.1/index.html",
  },
  {
    title: "Book Reader",
    href: "Book Reader/Custom PDF Reader.html",
    preview: "Book Reader/Custom PDF Reader.html",
  },
  {
    title: "Nutrition Analysis",
    href: "Nutrition and Cost Analysis/Nutrition.html",
    preview: "Nutrition and Cost Analysis/Nutrition.html",
  },
  {
    title: "MLB Overlay",
    href: "MLB Overlay/index.html",
    preview: "MLB Overlay/index.html",
  },
  {
    title: "Converted Lang Game",
    href: "Converted Lang Game/index.html",
    preview: "Converted Lang Game/index.html",
  },
  {
    title: "Song Translation",
    href: "Song Translation/app/index.html",
    preview: "Song Translation/app/index.html",
  },
  {
    title: "Roman Script Tool",
    href: "functional roman script translator/app/index.html",
    preview: "functional roman script translator/app/index.html",
  },
  {
    title: "Little Shop of Laura",
    href: "Little Shop of Laura/index.html",
    preview: "Little Shop of Laura/index.html",
  },
  {
    title: "To-Do List",
    href: "To-Do List/test.html",
    preview: "To-Do List/test.html",
  },
  {
    title: "Codex Test",
    href: "codex test/index.html",
    preview: "codex test/index.html",
  },
];

const panels = document.querySelectorAll("[data-tool-index]");
const launcherGrid = document.getElementById("launcher-grid");

function createPanelMarkup(tool) {
  return `
    <div class="edge-content">
      <span class="panel-title">${tool.title}</span>
      <div class="mini-preview" aria-hidden="true">
        <iframe class="preview-frame" title="${tool.title} preview" src="${tool.preview}" loading="lazy" tabindex="-1"></iframe>
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

    panel.href = tool.href;
    panel.setAttribute("aria-label", `Open ${tool.title}`);
    panel.innerHTML = createPanelMarkup(tool);

    const frame = panel.querySelector(".preview-frame");
    if (frame) {
      frame.addEventListener("load", () => hideEmbeddedHomeLink(frame));
    }
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
setupReveal();
setupPointerGlow();
