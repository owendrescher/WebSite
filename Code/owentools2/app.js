const landing = document.getElementById("landing");
const toolNames = [
  "Cost of Capital",
  "Crazy Slots",
  "Flag Designer",
  "Hanyu Exposure",
  "Idiom Collector",
  "Language Keyboard Practice",
  "Music Drills",
  "Pingpong 3D",
  "Poetry Archive",
  "Power Scaling Fights",
  "Sound Effect Design",
  "Suspicious Death Tracker",
  "Time Simulator",
  "Vocab Exposure",
];
const toolPages = {
  "Cost of Capital": "cost-of-capital/index.html",
  "Crazy Slots": "crazy-slots/index.html",
  "Flag Designer": "flag-designer/index.html",
  "Hanyu Exposure": "hanyu-exposure/index.html",
  "Idiom Collector": "idiom-collector/index.html",
  "Music Drills": "music-drills/index.html",
  "Pingpong 3D": "pingpong-3d/index.html",
  "Poetry Archive": "poetry-archive/index.html",
  "Power Scaling Fights": "power-scaling-fights/index.html",
  "Sound Effect Design": "sound-effect-design/index.html",
};

document.querySelectorAll("[data-tool-index]").forEach((panel) => {
  const title = toolNames[Number(panel.dataset.toolIndex)];
  const href = toolPages[title];
  if (href) {
    panel.href = href;
    panel.setAttribute("aria-label", `Open ${title}`);
  } else {
    panel.removeAttribute("href");
    panel.setAttribute("aria-label", `${title} — coming soon`);
  }
  panel.innerHTML = `<div class="edge-content"><span class="panel-title">${title}</span></div>`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((panel, index) => {
  panel.style.transitionDelay = `${Math.min(index * 35, 300)}ms`;
  revealObserver.observe(panel);
});

landing?.addEventListener("pointermove", (event) => {
  const rect = landing.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  landing.style.setProperty("--spot-x", `${x}%`);
  landing.style.setProperty("--spot-y", `${y}%`);
});

landing?.addEventListener("pointerleave", () => {
  landing.style.setProperty("--spot-x", "50%");
  landing.style.setProperty("--spot-y", "50%");
});
