const previewCanvas = document.getElementById("previewCanvas");
const previewCtx = previewCanvas.getContext("2d");
const layerCanvasStack = document.getElementById("layerCanvasStack");
const canvasScroll = document.querySelector(".canvas-scroll");
const toolButtons = [...document.querySelectorAll(".tool-btn")];
const adjustButtons = [...document.querySelectorAll(".adjust-btn")];
const palette = document.getElementById("palette");
const sizeRange = document.getElementById("sizeRange");
const sizeNumber = document.getElementById("sizeNumber");
const textSizeInput = document.getElementById("textSizeInput");
const shapeModeSelect = document.getElementById("shapeModeSelect");
const primaryColorInput = document.getElementById("primaryColorInput");
const secondaryColorInput = document.getElementById("secondaryColorInput");
const primaryColorChip = document.getElementById("primaryColorChip");
const secondaryColorChip = document.getElementById("secondaryColorChip");
const swapColorsBtn = document.getElementById("swapColorsBtn");
const colorPopover = document.getElementById("colorPopover");
const closeColorPopoverBtn = document.getElementById("closeColorPopoverBtn");
const colorPopoverTitle = document.getElementById("colorPopoverTitle");
const colorField = document.getElementById("colorField");
const colorFieldHandle = document.getElementById("colorFieldHandle");
const hueRange = document.getElementById("hueRange");
const brightnessSlider = document.getElementById("brightnessSlider");
const colorHexInput = document.getElementById("colorHexInput");
const zoomRange = document.getElementById("zoomRange");
const zoomReadout = document.getElementById("zoomReadout");
const toolSummary = document.getElementById("toolSummary");
const canvasWrapper = document.getElementById("canvasWrapper");
const canvasWidthInput = document.getElementById("canvasWidthInput");
const canvasHeightInput = document.getElementById("canvasHeightInput");
const brightnessRange = document.getElementById("brightnessRange");
const contrastRange = document.getElementById("contrastRange");
const cutoutModeSelect = document.getElementById("cutoutModeSelect");
const applySelectionCutoutBtn = document.getElementById("applySelectionCutoutBtn");
const deselectSelectionBtn = document.getElementById("deselectSelectionBtn");
const smartCutoutBtn = document.getElementById("smartCutoutBtn");
const smartCutoutStatus = document.getElementById("smartCutoutStatus");
const layersList = document.getElementById("layersList");
const layerOpacityRange = document.getElementById("layerOpacityRange");
const blendModeSelect = document.getElementById("blendModeSelect");
const layerCountTag = document.getElementById("layerCountTag");
const statusTool = document.getElementById("statusTool");
const statusCoords = document.getElementById("statusCoords");
const statusSize = document.getElementById("statusSize");
const statusCanvas = document.getElementById("statusCanvas");
const statusLayer = document.getElementById("statusLayer");
const fileInput = document.getElementById("fileInput");

const AUTOSAVE_DB_NAME = "animation-helper-db";
const AUTOSAVE_STORE_NAME = "projects";
const AUTOSAVE_KEY = "autosave";

const COLORS = [
  "#111111", "#666666", "#9ca3af", "#ffffff",
  "#7f1d1d", "#d66a3f", "#f6ad55", "#f6e05e",
  "#166534", "#2f855a", "#38b2ac", "#0f766e",
  "#1d4ed8", "#2563eb", "#7c3aed", "#c026d3",
  "#be185d", "#ef4444", "#fb7185", "#7c5e3c",
];

const state = {
  tool: "move",
  size: 8,
  textSize: 30,
  primaryColor: "#111111",
  secondaryColor: "#ffffff",
  shapeMode: "stroke",
  cutoutMode: "remove",
  zoom: 1,
  projectWidth: 960,
  projectHeight: 540,
  layers: [],
  activeLayerId: null,
  history: [],
  redoStack: [],
  pointerButton: 0,
  isDrawing: false,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  moveDeltaX: 0,
  moveDeltaY: 0,
  handStartScrollLeft: 0,
  handStartScrollTop: 0,
  nextLayerId: 1,
  snapshotLimit: 30,
  bodyPixModelPromise: null,
  restoring: false,
  colorEditor: {
    target: "primary",
    hue: 0,
    saturation: 0,
    value: 0,
    brightness: 100,
    isDraggingField: false,
  },
  selection: null,
};

function activeLayer() {
  return state.layers.find((layer) => layer.id === state.activeLayerId) || null;
}

function makeCanvas(width = state.projectWidth, height = state.projectHeight) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function cloneCanvas(source) {
  const clone = makeCanvas(source.width, source.height);
  clone.getContext("2d").drawImage(source, 0, 0);
  return clone;
}

function createLayerRecord(options = {}) {
  const canvas = makeCanvas();
  canvas.className = "layer-canvas";
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  return {
    id: options.id ?? state.nextLayerId++,
    name: options.name ?? `Layer ${state.nextLayerId - 1}`,
    visible: options.visible ?? true,
    opacity: options.opacity ?? 1,
    blendMode: options.blendMode ?? "source-over",
    canvas,
    ctx,
  };
}

function openAutosaveDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(AUTOSAVE_DB_NAME, 1);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(AUTOSAVE_STORE_NAME)) {
        request.result.createObjectStore(AUTOSAVE_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function persistAutosave(snapshot) {
  if (!window.indexedDB) {
    return;
  }

  try {
    const db = await openAutosaveDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(AUTOSAVE_STORE_NAME, "readwrite");
      const store = transaction.objectStore(AUTOSAVE_STORE_NAME);
      store.put(snapshot, AUTOSAVE_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  } catch (error) {
    // Ignore autosave failures so the editor remains usable.
  }
}

async function loadAutosave() {
  if (!window.indexedDB) {
    return null;
  }

  try {
    const db = await openAutosaveDatabase();
    const result = await new Promise((resolve, reject) => {
      const transaction = db.transaction(AUTOSAVE_STORE_NAME, "readonly");
      const store = transaction.objectStore(AUTOSAVE_STORE_NAME);
      const request = store.get(AUTOSAVE_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return result;
  } catch (error) {
    return null;
  }
}

function syncLayerCanvasPresentation(layer) {
  layer.canvas.style.opacity = String(layer.opacity);
  layer.canvas.style.display = layer.visible ? "block" : "none";
  layer.canvas.style.mixBlendMode = layer.blendMode === "source-over" ? "normal" : layer.blendMode;
  layer.canvas.style.transform = "";
}

function syncCanvasWrapper() {
  canvasWrapper.style.width = `${state.projectWidth * state.zoom}px`;
  canvasWrapper.style.height = `${state.projectHeight * state.zoom}px`;
  previewCanvas.width = state.projectWidth;
  previewCanvas.height = state.projectHeight;
  statusCanvas.textContent = `Canvas: ${state.projectWidth} x ${state.projectHeight}`;
  zoomReadout.textContent = `${Math.round(state.zoom * 100)}%`;
  renderSelectionPreview();
}

function setZoom(nextZoom, clientX = null, clientY = null) {
  const clamped = Math.max(0.25, Math.min(4, nextZoom));
  const previousZoom = state.zoom;
  if (clamped === previousZoom) {
    return;
  }

  if (clientX !== null && clientY !== null) {
    const scrollRect = canvasScroll.getBoundingClientRect();
    const offsetX = clientX - scrollRect.left + canvasScroll.scrollLeft;
    const offsetY = clientY - scrollRect.top + canvasScroll.scrollTop;
    const canvasX = offsetX / previousZoom;
    const canvasY = offsetY / previousZoom;
    state.zoom = clamped;
    zoomRange.value = String(Math.round(clamped * 100));
    syncCanvasWrapper();
    canvasScroll.scrollLeft = (canvasX * clamped) - (clientX - scrollRect.left);
    canvasScroll.scrollTop = (canvasY * clamped) - (clientY - scrollRect.top);
    return;
  }

  state.zoom = clamped;
  zoomRange.value = String(Math.round(clamped * 100));
  syncCanvasWrapper();
}

function updateColorChips() {
  primaryColorChip.style.background = state.primaryColor;
  secondaryColorChip.style.background = state.secondaryColor;
  primaryColorInput.value = state.primaryColor;
  secondaryColorInput.value = state.secondaryColor;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsv(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
  }

  return {
    hue: Math.round(((hue * 60) + 360) % 360),
    saturation: max === 0 ? 0 : delta / max,
    value: max,
  };
}

function hsvToRgb(hue, saturation, value) {
  const chroma = value * saturation;
  const hueSection = (hue % 360) / 60;
  const x = chroma * (1 - Math.abs((hueSection % 2) - 1));
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hueSection >= 0 && hueSection < 1) {
    red = chroma;
    green = x;
  } else if (hueSection < 2) {
    red = x;
    green = chroma;
  } else if (hueSection < 3) {
    green = chroma;
    blue = x;
  } else if (hueSection < 4) {
    green = x;
    blue = chroma;
  } else if (hueSection < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const match = value - chroma;
  return {
    r: (red + match) * 255,
    g: (green + match) * 255,
    b: (blue + match) * 255,
  };
}

function applyEditorColor() {
  const editor = state.colorEditor;
  const value = Math.max(0, Math.min(1, editor.value * (editor.brightness / 100)));
  const rgb = hsvToRgb(editor.hue, editor.saturation, value);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  if (editor.target === "primary") {
    state.primaryColor = hex;
  } else {
    state.secondaryColor = hex;
  }

  colorHexInput.value = hex.toUpperCase();
  updateColorChips();
}

function updateColorFieldVisuals() {
  const editor = state.colorEditor;
  colorField.style.background =
    `linear-gradient(to top, #000 0%, transparent 100%), linear-gradient(to right, #fff 0%, hsl(${editor.hue} 100% 50%) 100%)`;
  colorFieldHandle.style.left = `${editor.saturation * 100}%`;
  colorFieldHandle.style.top = `${(1 - editor.value) * 100}%`;
}

function syncEditorFromHex(hex) {
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  state.colorEditor.hue = hsv.hue;
  state.colorEditor.saturation = hsv.saturation;
  state.colorEditor.value = hsv.value;
  state.colorEditor.brightness = 100;
  hueRange.value = String(hsv.hue);
  brightnessSlider.value = "100";
  colorHexInput.value = hex.toUpperCase();
  updateColorFieldVisuals();
}

function openColorPopover(target) {
  state.colorEditor.target = target;
  const currentHex = target === "primary" ? state.primaryColor : state.secondaryColor;
  colorPopoverTitle.textContent = target === "primary" ? "Primary Color" : "Secondary Color";
  syncEditorFromHex(currentHex);
  colorPopover.hidden = false;
}

function closeColorPopover() {
  colorPopover.hidden = true;
  state.colorEditor.isDraggingField = false;
}

function updateColorFromFieldPointer(event) {
  const rect = colorField.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  state.colorEditor.saturation = rect.width === 0 ? 0 : x / rect.width;
  state.colorEditor.value = rect.height === 0 ? 0 : 1 - (y / rect.height);
  updateColorFieldVisuals();
  applyEditorColor();
}

function updateStatus() {
  const toolName = state.tool.charAt(0).toUpperCase() + state.tool.slice(1);
  const layer = activeLayer();
  toolSummary.textContent = toolName;
  statusTool.textContent = `Tool: ${toolName}`;
  statusSize.textContent = `Brush: ${state.size} px`;
  statusLayer.textContent = `Layer: ${layer ? layer.name : "--"}`;
  zoomReadout.textContent = `${Math.round(state.zoom * 100)}%`;
}

function updateToolButtons() {
  toolButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tool === state.tool);
  });

  if (state.tool === "move") {
    previewCanvas.style.cursor = "grab";
  } else if (state.tool === "hand") {
    previewCanvas.style.cursor = "grab";
  } else if (state.tool === "select") {
    previewCanvas.style.cursor = "crosshair";
  } else if (state.tool === "fill") {
    previewCanvas.style.cursor = "cell";
  } else if (state.tool === "text") {
    previewCanvas.style.cursor = "text";
  } else {
    previewCanvas.style.cursor = "crosshair";
  }

  updateStatus();
}

function setTool(tool) {
  state.tool = tool;
  updateToolButtons();
}

function renderLayerOrder() {
  layerCanvasStack.replaceChildren();
  state.layers.forEach((layer, index) => {
    layer.canvas.style.zIndex = String(index + 1);
    layerCanvasStack.appendChild(layer.canvas);
    syncLayerCanvasPresentation(layer);
  });
}

function syncActiveLayerControls() {
  const layer = activeLayer();
  if (!layer) {
    layerOpacityRange.value = "100";
    blendModeSelect.value = "source-over";
    updateStatus();
    return;
  }

  layerOpacityRange.value = String(Math.round(layer.opacity * 100));
  blendModeSelect.value = layer.blendMode;
  updateStatus();
}

function renderLayersList() {
  layersList.replaceChildren();

  [...state.layers].reverse().forEach((layer) => {
    const row = document.createElement("div");
    row.className = "layer-row";
    if (layer.id === state.activeLayerId) {
      row.classList.add("is-active");
    }
    if (!layer.visible) {
      row.classList.add("is-hidden");
    }
    row.addEventListener("click", () => {
      state.activeLayerId = layer.id;
      renderLayersList();
      syncActiveLayerControls();
    });

    const visibilityBtn = document.createElement("button");
    visibilityBtn.className = "layer-visibility-btn";
    visibilityBtn.textContent = layer.visible ? "◉" : "○";
    visibilityBtn.title = layer.visible ? "Hide layer" : "Show layer";
    visibilityBtn.type = "button";
    visibilityBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      layer.visible = !layer.visible;
      syncLayerCanvasPresentation(layer);
      renderLayersList();
      commitHistory();
    });

    const main = document.createElement("div");
    main.className = "layer-row-main";

    const nameInput = document.createElement("input");
    nameInput.className = "layer-name";
    nameInput.value = layer.name;
    nameInput.addEventListener("click", (event) => event.stopPropagation());
    nameInput.addEventListener("change", (event) => {
      layer.name = event.target.value.trim() || layer.name;
      renderLayersList();
      syncActiveLayerControls();
      commitHistory();
    });

    const meta = document.createElement("p");
    meta.className = "layer-meta";
    const blendLabel = layer.blendMode === "source-over" ? "Normal" : layer.blendMode;
    meta.textContent = `${Math.round(layer.opacity * 100)}% | ${blendLabel}`;

    main.append(nameInput, meta);
    row.append(visibilityBtn, main);
    layersList.appendChild(row);
  });

  layerCountTag.textContent = `${state.layers.length} Layer${state.layers.length === 1 ? "" : "s"}`;
}

function addLayer(options = {}) {
  const layer = createLayerRecord(options);
  state.layers.push(layer);
  state.activeLayerId = layer.id;
  renderLayerOrder();
  renderLayersList();
  syncActiveLayerControls();
  return layer;
}

function removeLayerById(layerId) {
  const index = state.layers.findIndex((layer) => layer.id === layerId);
  if (index === -1) {
    return;
  }

  const [removed] = state.layers.splice(index, 1);
  removed.canvas.remove();

  if (!state.layers.length) {
    const layer = addLayer({ name: "Layer 1" });
    state.activeLayerId = layer.id;
  } else if (state.activeLayerId === layerId) {
    const fallback = state.layers[Math.max(0, index - 1)] || state.layers[0];
    state.activeLayerId = fallback.id;
  }

  renderLayerOrder();
  renderLayersList();
  syncActiveLayerControls();
}

function serializeProject() {
  return {
    projectWidth: state.projectWidth,
    projectHeight: state.projectHeight,
    activeLayerId: state.activeLayerId,
    nextLayerId: state.nextLayerId,
    cutoutMode: state.cutoutMode,
    selection: state.selection,
    layers: state.layers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      visible: layer.visible,
      opacity: layer.opacity,
      blendMode: layer.blendMode,
      dataUrl: layer.canvas.toDataURL("image/png"),
    })),
  };
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function restoreProject(snapshot) {
  state.restoring = true;
  state.projectWidth = snapshot.projectWidth;
  state.projectHeight = snapshot.projectHeight;
  state.activeLayerId = snapshot.activeLayerId;
  state.nextLayerId = snapshot.nextLayerId;
  state.cutoutMode = snapshot.cutoutMode || "remove";
  state.selection = snapshot.selection || null;

  state.layers.forEach((layer) => layer.canvas.remove());
  state.layers = [];

  syncCanvasWrapper();
  canvasWidthInput.value = String(state.projectWidth);
  canvasHeightInput.value = String(state.projectHeight);

  for (const layerSnapshot of snapshot.layers) {
    const layer = createLayerRecord(layerSnapshot);
    layer.name = layerSnapshot.name;
    layer.visible = layerSnapshot.visible;
    layer.opacity = layerSnapshot.opacity;
    layer.blendMode = layerSnapshot.blendMode;
    const image = await loadImage(layerSnapshot.dataUrl);
    layer.ctx.clearRect(0, 0, state.projectWidth, state.projectHeight);
    layer.ctx.drawImage(image, 0, 0);
    state.layers.push(layer);
  }

  if (!state.layers.length) {
    addLayer({ name: "Layer 1" });
  }

  if (!state.layers.some((layer) => layer.id === state.activeLayerId)) {
    state.activeLayerId = state.layers[state.layers.length - 1].id;
  }

  renderLayerOrder();
  renderLayersList();
  syncActiveLayerControls();
  cutoutModeSelect.value = state.cutoutMode;
  clearPreview();
  renderSelectionPreview();
  state.restoring = false;
}

function commitHistory() {
  if (state.restoring) {
    return;
  }

  const snapshot = serializeProject();
  state.history.push(snapshot);
  if (state.history.length > state.snapshotLimit) {
    state.history.shift();
  }
  state.redoStack = [];
  void persistAutosave(snapshot);
}

async function undo() {
  if (state.history.length <= 1) {
    return;
  }

  const current = state.history.pop();
  state.redoStack.push(current);
  await restoreProject(state.history[state.history.length - 1]);
}

async function redo() {
  if (!state.redoStack.length) {
    return;
  }

  const snapshot = state.redoStack.pop();
  state.history.push(snapshot);
  await restoreProject(snapshot);
}

function resizeProject(width, height, preserve = true) {
  const safeWidth = Math.max(64, Math.min(4096, Number(width) || state.projectWidth));
  const safeHeight = Math.max(64, Math.min(4096, Number(height) || state.projectHeight));

  state.projectWidth = safeWidth;
  state.projectHeight = safeHeight;
  canvasWidthInput.value = String(safeWidth);
  canvasHeightInput.value = String(safeHeight);

  state.layers.forEach((layer) => {
    const temp = preserve ? cloneCanvas(layer.canvas) : null;
    layer.canvas.width = safeWidth;
    layer.canvas.height = safeHeight;
    if (temp) {
      layer.ctx.drawImage(temp, 0, 0);
    }
  });

  syncCanvasWrapper();
  renderLayerOrder();
  clearPreview();
}

function newProject() {
  state.layers.forEach((layer) => layer.canvas.remove());
  state.layers = [];
  state.history = [];
  state.redoStack = [];
  state.nextLayerId = 1;
  state.cutoutMode = "remove";
  state.selection = null;
  state.projectWidth = 960;
  state.projectHeight = 540;
  canvasWidthInput.value = "960";
  canvasHeightInput.value = "540";
  zoomRange.value = "100";
  state.zoom = 1;
  cutoutModeSelect.value = "remove";
  syncCanvasWrapper();
  addLayer({ name: "Layer 1" });
  commitHistory();
}

function getCanvasPoint(event) {
  const rect = previewCanvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (previewCanvas.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (previewCanvas.height / rect.height));
  return {
    x: Math.max(0, Math.min(state.projectWidth - 1, x)),
    y: Math.max(0, Math.min(state.projectHeight - 1, y)),
  };
}

function activeColor(button = state.pointerButton) {
  return button === 2 ? state.secondaryColor : state.primaryColor;
}

function clearPreview() {
  previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
}

function normalizeRect(x1, y1, x2, y2) {
  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  return { x: left, y: top, width, height };
}

function hasSelection() {
  return Boolean(state.selection && state.selection.width > 0 && state.selection.height > 0);
}

function renderSelectionPreview() {
  if (!hasSelection()) {
    return;
  }

  const { x, y, width, height } = state.selection;
  previewCtx.save();
  previewCtx.setLineDash([8, 4]);
  previewCtx.lineWidth = 1;
  previewCtx.strokeStyle = "rgba(255,255,255,0.95)";
  previewCtx.strokeRect(x + 0.5, y + 0.5, width, height);
  previewCtx.setLineDash([4, 6]);
  previewCtx.strokeStyle = "rgba(0,0,0,0.8)";
  previewCtx.strokeRect(x + 0.5, y + 0.5, width, height);
  previewCtx.restore();
}

function clearPreviewAndSelectionOverlay() {
  clearPreview();
  renderSelectionPreview();
}

function getSelectionRectOrCanvas() {
  if (hasSelection()) {
    return { ...state.selection };
  }
  return { x: 0, y: 0, width: state.projectWidth, height: state.projectHeight };
}

function drawStrokeSegment(ctx, fromX, fromY, toX, toY, tool, button) {
  ctx.save();
  ctx.lineCap = tool === "pencil" ? "square" : "round";
  ctx.lineJoin = tool === "pencil" ? "miter" : "round";
  ctx.lineWidth = tool === "pencil" ? Math.max(1, Math.round(state.size / 2)) : state.size;

  if (tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = activeColor(button);
  }

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.restore();
}

function drawShape(ctx, tool, x1, y1, x2, y2) {
  const width = x2 - x1;
  const height = y2 - y1;

  ctx.save();
  ctx.lineWidth = state.size;
  ctx.strokeStyle = state.primaryColor;
  ctx.fillStyle = state.secondaryColor;
  ctx.lineJoin = "round";

  if (tool === "line") {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
    return;
  }

  ctx.beginPath();
  if (tool === "rectangle") {
    ctx.rect(x1, y1, width, height);
  }

  if (tool === "ellipse") {
    const centerX = x1 + width / 2;
    const centerY = y1 + height / 2;
    ctx.ellipse(centerX, centerY, Math.abs(width / 2), Math.abs(height / 2), 0, 0, Math.PI * 2);
  }

  if (state.shapeMode === "fill" || state.shapeMode === "both") {
    ctx.fill();
  }

  if (state.shapeMode === "stroke" || state.shapeMode === "both") {
    ctx.stroke();
  }

  ctx.restore();
}

function colorsMatch(data, offset, target) {
  return (
    data[offset] === target[0] &&
    data[offset + 1] === target[1] &&
    data[offset + 2] === target[2] &&
    data[offset + 3] === target[3]
  );
}

function hexToRgba(hex) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  return [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255,
    255,
  ];
}

function floodFillLayer(layer, startX, startY, fillHex) {
  const imageData = layer.ctx.getImageData(0, 0, state.projectWidth, state.projectHeight);
  const { data, width, height } = imageData;
  const startOffset = (startY * width + startX) * 4;
  const target = [
    data[startOffset],
    data[startOffset + 1],
    data[startOffset + 2],
    data[startOffset + 3],
  ];
  const replacement = hexToRgba(fillHex);

  if (target.every((value, index) => value === replacement[index])) {
    return false;
  }

  const stack = [[startX, startY]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= width || y < 0 || y >= height) {
      continue;
    }

    const offset = (y * width + x) * 4;
    if (!colorsMatch(data, offset, target)) {
      continue;
    }

    data[offset] = replacement[0];
    data[offset + 1] = replacement[1];
    data[offset + 2] = replacement[2];
    data[offset + 3] = replacement[3];

    stack.push([x + 1, y]);
    stack.push([x - 1, y]);
    stack.push([x, y + 1]);
    stack.push([x, y - 1]);
  }

  layer.ctx.putImageData(imageData, 0, 0);
  return true;
}

function placeTextOnLayer(layer, x, y, button) {
  const text = window.prompt("Enter text to place on the active layer:");
  if (!text) {
    return false;
  }

  layer.ctx.save();
  layer.ctx.fillStyle = activeColor(button);
  layer.ctx.font = `${state.textSize}px "Aptos", "Trebuchet MS", sans-serif`;
  layer.ctx.textBaseline = "top";
  layer.ctx.fillText(text, x, y);
  layer.ctx.restore();
  return true;
}

function composeVisibleLayers() {
  const composite = makeCanvas();
  const ctx = composite.getContext("2d", { willReadFrequently: true });
  state.layers.forEach((layer) => {
    if (!layer.visible) {
      return;
    }
    ctx.save();
    ctx.globalAlpha = layer.opacity;
    ctx.globalCompositeOperation = layer.blendMode;
    ctx.drawImage(layer.canvas, 0, 0);
    ctx.restore();
  });
  return composite;
}

function pickColorFromComposite(x, y, button) {
  const composite = composeVisibleLayers();
  const pixel = composite.getContext("2d", { willReadFrequently: true }).getImageData(x, y, 1, 1).data;
  const hex = `#${[pixel[0], pixel[1], pixel[2]]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

  if (button === 2) {
    state.secondaryColor = hex;
  } else {
    state.primaryColor = hex;
  }
  updateColorChips();
}

function translateLayerPixels(layer, dx, dy) {
  const temp = cloneCanvas(layer.canvas);
  layer.ctx.clearRect(0, 0, state.projectWidth, state.projectHeight);
  layer.ctx.drawImage(temp, dx, dy);
}

function applyLayerFilter(layer, filterString) {
  const temp = cloneCanvas(layer.canvas);
  layer.ctx.clearRect(0, 0, state.projectWidth, state.projectHeight);
  layer.ctx.save();
  layer.ctx.filter = filterString;
  layer.ctx.drawImage(temp, 0, 0);
  layer.ctx.restore();
}

function applyKernel(layer, kernel, divisor = 1) {
  const source = layer.ctx.getImageData(0, 0, state.projectWidth, state.projectHeight);
  const output = layer.ctx.createImageData(state.projectWidth, state.projectHeight);
  const side = Math.sqrt(kernel.length);
  const halfSide = Math.floor(side / 2);

  for (let y = 0; y < state.projectHeight; y += 1) {
    for (let x = 0; x < state.projectWidth; x += 1) {
      const destinationOffset = (y * state.projectWidth + x) * 4;
      let red = 0;
      let green = 0;
      let blue = 0;
      let alpha = 0;

      for (let ky = 0; ky < side; ky += 1) {
        for (let kx = 0; kx < side; kx += 1) {
          const sampleX = Math.min(state.projectWidth - 1, Math.max(0, x + kx - halfSide));
          const sampleY = Math.min(state.projectHeight - 1, Math.max(0, y + ky - halfSide));
          const sourceOffset = (sampleY * state.projectWidth + sampleX) * 4;
          const weight = kernel[ky * side + kx];
          red += source.data[sourceOffset] * weight;
          green += source.data[sourceOffset + 1] * weight;
          blue += source.data[sourceOffset + 2] * weight;
          alpha += source.data[sourceOffset + 3] * weight;
        }
      }

      output.data[destinationOffset] = Math.min(255, Math.max(0, red / divisor));
      output.data[destinationOffset + 1] = Math.min(255, Math.max(0, green / divisor));
      output.data[destinationOffset + 2] = Math.min(255, Math.max(0, blue / divisor));
      output.data[destinationOffset + 3] = Math.min(255, Math.max(0, alpha / divisor));
    }
  }

  layer.ctx.putImageData(output, 0, 0);
}

function applyBlurBrush(layer, centerX, centerY, radius) {
  const size = Math.max(2, Math.round(radius * 2));
  const sourceX = Math.max(0, centerX - size);
  const sourceY = Math.max(0, centerY - size);
  const width = Math.min(state.projectWidth - sourceX, size * 2);
  const height = Math.min(state.projectHeight - sourceY, size * 2);
  if (width <= 0 || height <= 0) {
    return;
  }

  const temp = document.createElement("canvas");
  temp.width = width;
  temp.height = height;
  const tempCtx = temp.getContext("2d");
  tempCtx.filter = "blur(5px)";
  tempCtx.drawImage(layer.canvas, sourceX, sourceY, width, height, 0, 0, width, height);

  layer.ctx.save();
  layer.ctx.beginPath();
  layer.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  layer.ctx.clip();
  layer.ctx.drawImage(temp, sourceX, sourceY);
  layer.ctx.restore();
}

function applyGradient(layer, x1, y1, x2, y2, button) {
  const gradient = layer.ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, activeColor(button));
  gradient.addColorStop(1, button === 2 ? state.primaryColor : state.secondaryColor);
  layer.ctx.save();
  layer.ctx.fillStyle = gradient;
  const target = getSelectionRectOrCanvas();
  layer.ctx.fillRect(target.x, target.y, target.width, target.height);
  layer.ctx.restore();
}

function applySelectionCutout() {
  const layer = activeLayer();
  if (!layer || !hasSelection()) {
    return;
  }

  const { x, y, width, height } = state.selection;
  if (state.cutoutMode === "remove") {
    layer.ctx.clearRect(x, y, width, height);
  } else {
    const composite = composeVisibleLayers();
    layer.ctx.drawImage(composite, x, y, width, height, x, y, width, height);
  }
  commitHistory();
}

function updateSmartCutoutStatus(message) {
  smartCutoutStatus.textContent = message;
}

async function loadBodyPixModel() {
  if (!window.bodyPix || !window.tf) {
    throw new Error("TensorFlow scripts are unavailable.");
  }

  if (!state.bodyPixModelPromise) {
    state.bodyPixModelPromise = (async () => {
      try {
        await window.tf.setBackend("webgl");
      } catch (error) {
        await window.tf.setBackend("cpu");
      }
      await window.tf.ready();
      return window.bodyPix.load({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
      });
    })();
  }

  return state.bodyPixModelPromise;
}

async function smartCutoutActiveLayer() {
  const layer = activeLayer();
  if (!layer) {
    updateSmartCutoutStatus("No active layer selected.");
    return;
  }

  smartCutoutBtn.disabled = true;
  updateSmartCutoutStatus("Loading person-segmentation model...");

  try {
    const model = await loadBodyPixModel();
    updateSmartCutoutStatus("Detecting person on active layer...");
    const sourceTarget = state.cutoutMode === "add" ? composeVisibleLayers() : layer.canvas;
    const segmentation = await model.segmentPerson(sourceTarget, {
      internalResolution: "medium",
      segmentationThreshold: 0.72,
      maxDetections: 1,
      scoreThreshold: 0.25,
    });

    const containsPerson = segmentation.data.some((value) => value === 1);
    if (!containsPerson) {
      updateSmartCutoutStatus("No person detected on the active layer.");
      smartCutoutBtn.disabled = false;
      return;
    }

    const source = cloneCanvas(sourceTarget);
    const maskCanvas = makeCanvas();
    const maskCtx = maskCanvas.getContext("2d");
    const maskImage = maskCtx.createImageData(state.projectWidth, state.projectHeight);

    for (let index = 0; index < segmentation.data.length; index += 1) {
      const alpha = segmentation.data[index] === 1 ? 255 : 0;
      const pixelOffset = index * 4;
      maskImage.data[pixelOffset] = 255;
      maskImage.data[pixelOffset + 1] = 255;
      maskImage.data[pixelOffset + 2] = 255;
      maskImage.data[pixelOffset + 3] = alpha;
    }
    maskCtx.putImageData(maskImage, 0, 0);

    const softenedMask = makeCanvas();
    const softenedMaskCtx = softenedMask.getContext("2d");
    softenedMaskCtx.save();
    softenedMaskCtx.filter = "blur(1.5px)";
    softenedMaskCtx.drawImage(maskCanvas, 0, 0);
    softenedMaskCtx.restore();

    const subjectCanvas = makeCanvas();
    const subjectCtx = subjectCanvas.getContext("2d");
    subjectCtx.drawImage(source, 0, 0);
    subjectCtx.save();
    subjectCtx.globalCompositeOperation = "destination-in";
    subjectCtx.drawImage(softenedMask, 0, 0);
    subjectCtx.restore();

    if (state.cutoutMode === "remove") {
      layer.ctx.clearRect(0, 0, state.projectWidth, state.projectHeight);
      layer.ctx.drawImage(subjectCanvas, 0, 0);
      updateSmartCutoutStatus("Background removed from active layer.");
    } else {
      layer.ctx.drawImage(subjectCanvas, 0, 0);
      updateSmartCutoutStatus("Detected subject added to active layer.");
    }

    commitHistory();
  } catch (error) {
    updateSmartCutoutStatus("Smart cutout failed. Check browser support or network access for model scripts.");
  } finally {
    smartCutoutBtn.disabled = false;
  }
}

function startPointer(event) {
  event.preventDefault();
  const layer = activeLayer();
  if (!layer) {
    return;
  }

  const { x, y } = getCanvasPoint(event);
  state.pointerButton = event.button;
  state.startX = x;
  state.startY = y;
  state.lastX = x;
  state.lastY = y;

  if (state.tool === "select") {
    state.isDrawing = true;
    state.selection = null;
    clearPreview();
    return;
  }

  if (state.tool === "fill") {
    if (floodFillLayer(layer, x, y, activeColor())) {
      commitHistory();
    }
    return;
  }

  if (state.tool === "eyedropper") {
    pickColorFromComposite(x, y, state.pointerButton);
    return;
  }

  if (state.tool === "text") {
    if (placeTextOnLayer(layer, x, y, state.pointerButton)) {
      commitHistory();
    }
    return;
  }

  state.isDrawing = true;

  if (state.tool === "move") {
    state.moveDeltaX = 0;
    state.moveDeltaY = 0;
    layer.canvas.style.transform = "translate(0px, 0px)";
    previewCanvas.style.cursor = "grabbing";
    return;
  }

  if (state.tool === "hand") {
    state.handStartScrollLeft = canvasScroll.scrollLeft;
    state.handStartScrollTop = canvasScroll.scrollTop;
    previewCanvas.style.cursor = "grabbing";
    return;
  }

  if (state.tool === "pencil" || state.tool === "brush" || state.tool === "eraser") {
    drawStrokeSegment(layer.ctx, x, y, x, y, state.tool, state.pointerButton);
  } else if (state.tool === "blur") {
    applyBlurBrush(layer, x, y, Math.max(4, state.size));
  } else {
    clearPreviewAndSelectionOverlay();
  }
}

function movePointer(event) {
  const { x, y } = getCanvasPoint(event);
  statusCoords.textContent = `Coords: ${x}, ${y}`;

  if (!state.isDrawing) {
    return;
  }

  const layer = activeLayer();
  if (!layer) {
    return;
  }

  if (state.tool === "select") {
    clearPreview();
    const rect = normalizeRect(state.startX, state.startY, x, y);
    previewCtx.save();
    previewCtx.setLineDash([8, 4]);
    previewCtx.lineWidth = 1;
    previewCtx.strokeStyle = "rgba(255,255,255,0.95)";
    previewCtx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height);
    previewCtx.restore();
    return;
  }

  if (state.tool === "move") {
    state.moveDeltaX = x - state.startX;
    state.moveDeltaY = y - state.startY;
    layer.canvas.style.transform = `translate(${state.moveDeltaX * state.zoom}px, ${state.moveDeltaY * state.zoom}px)`;
    return;
  }

  if (state.tool === "hand") {
    canvasScroll.scrollLeft = state.handStartScrollLeft - (x - state.startX) * state.zoom;
    canvasScroll.scrollTop = state.handStartScrollTop - (y - state.startY) * state.zoom;
    return;
  }

  if (state.tool === "pencil" || state.tool === "brush" || state.tool === "eraser") {
    drawStrokeSegment(layer.ctx, state.lastX, state.lastY, x, y, state.tool, state.pointerButton);
    state.lastX = x;
    state.lastY = y;
    return;
  }

  if (state.tool === "blur") {
    applyBlurBrush(layer, x, y, Math.max(4, state.size));
    state.lastX = x;
    state.lastY = y;
    return;
  }

  clearPreviewAndSelectionOverlay();
  if (state.tool === "gradient") {
    previewCtx.save();
    previewCtx.strokeStyle = "rgba(255,255,255,0.95)";
    previewCtx.lineWidth = 2;
    previewCtx.beginPath();
    previewCtx.moveTo(state.startX, state.startY);
    previewCtx.lineTo(x, y);
    previewCtx.stroke();
    previewCtx.restore();
  } else {
    drawShape(previewCtx, state.tool, state.startX, state.startY, x, y);
  }
}

function finishPointer(event) {
  if (!state.isDrawing) {
    return;
  }

  const layer = activeLayer();
  if (!layer) {
    state.isDrawing = false;
    return;
  }

  const { x, y } = getCanvasPoint(event);

  if (state.tool === "select") {
    state.selection = normalizeRect(state.startX, state.startY, x, y);
    clearPreviewAndSelectionOverlay();
  } else if (state.tool === "move") {
    layer.canvas.style.transform = "";
    previewCanvas.style.cursor = "grab";
    if (state.moveDeltaX !== 0 || state.moveDeltaY !== 0) {
      translateLayerPixels(layer, state.moveDeltaX, state.moveDeltaY);
      commitHistory();
    }
  } else if (state.tool === "hand") {
    previewCanvas.style.cursor = "grab";
  } else if (state.tool === "line" || state.tool === "rectangle" || state.tool === "ellipse") {
    clearPreviewAndSelectionOverlay();
    drawShape(layer.ctx, state.tool, state.startX, state.startY, x, y);
    commitHistory();
  } else if (state.tool === "gradient") {
    clearPreviewAndSelectionOverlay();
    applyGradient(layer, state.startX, state.startY, x, y, state.pointerButton);
    commitHistory();
  } else {
    commitHistory();
  }

  state.isDrawing = false;
  state.moveDeltaX = 0;
  state.moveDeltaY = 0;
}

function buildPalette() {
  COLORS.forEach((color) => {
    const swatch = document.createElement("button");
    swatch.className = "palette-swatch";
    swatch.style.background = color;
    swatch.type = "button";
    swatch.title = `${color} - left click primary, right click secondary`;
    swatch.addEventListener("click", () => {
      if (!colorPopover.hidden) {
        if (state.colorEditor.target === "primary") {
          state.primaryColor = color;
        } else {
          state.secondaryColor = color;
        }
        updateColorChips();
        syncEditorFromHex(color);
      } else {
        state.primaryColor = color;
        updateColorChips();
      }
    });
    swatch.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      state.secondaryColor = color;
      updateColorChips();
    });
    palette.appendChild(swatch);
  });
}

function bindColorEditor() {
  primaryColorChip.addEventListener("click", () => {
    if (!colorPopover.hidden && state.colorEditor.target === "primary") {
      closeColorPopover();
      return;
    }
    openColorPopover("primary");
  });
  secondaryColorChip.addEventListener("click", () => {
    if (!colorPopover.hidden && state.colorEditor.target === "secondary") {
      closeColorPopover();
      return;
    }
    openColorPopover("secondary");
  });
  closeColorPopoverBtn.addEventListener("click", closeColorPopover);

  hueRange.addEventListener("input", () => {
    state.colorEditor.hue = Number(hueRange.value);
    updateColorFieldVisuals();
    applyEditorColor();
  });

  brightnessSlider.addEventListener("input", () => {
    state.colorEditor.brightness = Number(brightnessSlider.value);
    applyEditorColor();
  });

  colorHexInput.addEventListener("change", () => {
    const normalized = colorHexInput.value.trim();
    if (!/^#?[0-9a-fA-F]{6}$/.test(normalized)) {
      colorHexInput.value = (state.colorEditor.target === "primary" ? state.primaryColor : state.secondaryColor).toUpperCase();
      return;
    }
    const hex = normalized.startsWith("#") ? normalized : `#${normalized}`;
    if (state.colorEditor.target === "primary") {
      state.primaryColor = hex;
    } else {
      state.secondaryColor = hex;
    }
    updateColorChips();
    syncEditorFromHex(hex);
  });

  colorField.addEventListener("pointerdown", (event) => {
    state.colorEditor.isDraggingField = true;
    updateColorFromFieldPointer(event);
  });

  window.addEventListener("pointermove", (event) => {
    if (!state.colorEditor.isDraggingField) {
      return;
    }
    updateColorFromFieldPointer(event);
  });

  window.addEventListener("pointerup", () => {
    state.colorEditor.isDraggingField = false;
  });

  document.addEventListener("pointerdown", (event) => {
    if (colorPopover.hidden) {
      return;
    }

    if (
      colorPopover.contains(event.target) ||
      primaryColorChip.contains(event.target) ||
      secondaryColorChip.contains(event.target)
    ) {
      return;
    }

    closeColorPopover();
  });
}

function importImageFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    loadImage(reader.result).then((image) => {
      const needsResize = image.width > state.projectWidth || image.height > state.projectHeight;
      if (needsResize) {
        resizeProject(
          Math.max(state.projectWidth, image.width),
          Math.max(state.projectHeight, image.height),
          true
        );
      }

      const layer = addLayer({ name: file.name.replace(/\.[^.]+$/, "") || `Layer ${state.nextLayerId}` });
      layer.ctx.drawImage(image, 0, 0);
      commitHistory();
    });
  };
  reader.readAsDataURL(file);
}

function exportCompositePng() {
  const composite = composeVisibleLayers();
  const link = document.createElement("a");
  link.download = "layer-studio-export.png";
  link.href = composite.toDataURL("image/png");
  link.click();
}

function applyAdjustment(type) {
  const layer = activeLayer();
  if (!layer) {
    return;
  }

  if (type === "sharpen") {
    applyKernel(layer, [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0,
    ]);
  } else if (type === "blur") {
    applyLayerFilter(layer, "blur(1.5px)");
  } else if (type === "grayscale") {
    applyLayerFilter(layer, "grayscale(1)");
  } else if (type === "invert") {
    applyLayerFilter(layer, "invert(1)");
  } else if (type === "sepia") {
    applyLayerFilter(layer, "sepia(1)");
  }

  commitHistory();
}

function applyToneAdjustment() {
  const layer = activeLayer();
  if (!layer) {
    return;
  }

  const brightness = Number(brightnessRange.value) / 100;
  const contrast = Number(contrastRange.value) / 100;
  applyLayerFilter(layer, `brightness(${brightness}) contrast(${contrast})`);
  commitHistory();
}

function duplicateActiveLayer() {
  const layer = activeLayer();
  if (!layer) {
    return;
  }

  const duplicate = addLayer({
    name: `${layer.name} Copy`,
    visible: layer.visible,
    opacity: layer.opacity,
    blendMode: layer.blendMode,
  });
  duplicate.ctx.drawImage(layer.canvas, 0, 0);
  commitHistory();
}

function mergeActiveLayerDown() {
  const layer = activeLayer();
  if (!layer) {
    return;
  }

  const index = state.layers.findIndex((item) => item.id === layer.id);
  if (index <= 0) {
    return;
  }

  const below = state.layers[index - 1];
  below.ctx.save();
  below.ctx.globalAlpha = layer.opacity;
  below.ctx.globalCompositeOperation = layer.blendMode;
  below.ctx.drawImage(layer.canvas, 0, 0);
  below.ctx.restore();
  removeLayerById(layer.id);
  state.activeLayerId = below.id;
  renderLayersList();
  syncActiveLayerControls();
  commitHistory();
}

function moveActiveLayer(direction) {
  const layer = activeLayer();
  if (!layer) {
    return;
  }

  const index = state.layers.findIndex((item) => item.id === layer.id);
  const targetIndex = direction === "up" ? index + 1 : index - 1;
  if (targetIndex < 0 || targetIndex >= state.layers.length) {
    return;
  }

  [state.layers[index], state.layers[targetIndex]] = [state.layers[targetIndex], state.layers[index]];
  renderLayerOrder();
  renderLayersList();
  commitHistory();
}

function clearActiveLayer() {
  const layer = activeLayer();
  if (!layer) {
    return;
  }

  layer.ctx.clearRect(0, 0, state.projectWidth, state.projectHeight);
  commitHistory();
}

toolButtons.forEach((button) => {
  button.addEventListener("click", () => setTool(button.dataset.tool));
});

adjustButtons.forEach((button) => {
  button.addEventListener("click", () => applyAdjustment(button.dataset.adjust));
});

sizeRange.addEventListener("input", () => {
  state.size = Number(sizeRange.value);
  sizeNumber.value = String(state.size);
  updateStatus();
});

sizeNumber.addEventListener("input", () => {
  const value = Math.max(1, Math.min(96, Number(sizeNumber.value) || 1));
  state.size = value;
  sizeRange.value = String(value);
  updateStatus();
});

textSizeInput.addEventListener("input", () => {
  state.textSize = Math.max(8, Math.min(144, Number(textSizeInput.value) || 30));
});

shapeModeSelect.addEventListener("change", () => {
  state.shapeMode = shapeModeSelect.value;
});

primaryColorInput.addEventListener("input", () => {
  state.primaryColor = primaryColorInput.value;
  updateColorChips();
});

secondaryColorInput.addEventListener("input", () => {
  state.secondaryColor = secondaryColorInput.value;
  updateColorChips();
});

swapColorsBtn.addEventListener("click", () => {
  [state.primaryColor, state.secondaryColor] = [state.secondaryColor, state.primaryColor];
  updateColorChips();
});

cutoutModeSelect.addEventListener("change", () => {
  state.cutoutMode = cutoutModeSelect.value;
  commitHistory();
});

zoomRange.addEventListener("input", () => {
  setZoom(Number(zoomRange.value) / 100);
});

layerOpacityRange.addEventListener("input", () => {
  const layer = activeLayer();
  if (!layer) {
    return;
  }
  layer.opacity = Number(layerOpacityRange.value) / 100;
  syncLayerCanvasPresentation(layer);
  renderLayersList();
});

layerOpacityRange.addEventListener("change", () => {
  const layer = activeLayer();
  if (!layer) {
    return;
  }
  layer.opacity = Number(layerOpacityRange.value) / 100;
  syncLayerCanvasPresentation(layer);
  renderLayersList();
  commitHistory();
});

blendModeSelect.addEventListener("change", () => {
  const layer = activeLayer();
  if (!layer) {
    return;
  }
  layer.blendMode = blendModeSelect.value;
  syncLayerCanvasPresentation(layer);
  renderLayersList();
  commitHistory();
});

document.getElementById("newProjectBtn").addEventListener("click", newProject);
document.getElementById("openImageBtn").addEventListener("click", () => fileInput.click());
document.getElementById("saveImageBtn").addEventListener("click", exportCompositePng);
document.getElementById("undoBtn").addEventListener("click", () => {
  void undo();
});
document.getElementById("redoBtn").addEventListener("click", () => {
  void redo();
});
document.getElementById("clearLayerBtn").addEventListener("click", clearActiveLayer);
document.getElementById("resizeCanvasBtn").addEventListener("click", () => {
  resizeProject(canvasWidthInput.value, canvasHeightInput.value, true);
  commitHistory();
});
document.getElementById("addLayerBtn").addEventListener("click", () => {
  addLayer();
  commitHistory();
});
document.getElementById("duplicateLayerBtn").addEventListener("click", duplicateActiveLayer);
document.getElementById("deleteLayerBtn").addEventListener("click", () => {
  removeLayerById(state.activeLayerId);
  commitHistory();
});
document.getElementById("mergeDownBtn").addEventListener("click", mergeActiveLayerDown);
document.getElementById("moveLayerUpBtn").addEventListener("click", () => moveActiveLayer("up"));
document.getElementById("moveLayerDownBtn").addEventListener("click", () => moveActiveLayer("down"));
document.getElementById("applyToneBtn").addEventListener("click", applyToneAdjustment);
applySelectionCutoutBtn.addEventListener("click", applySelectionCutout);
deselectSelectionBtn.addEventListener("click", () => {
  state.selection = null;
  clearPreview();
});
smartCutoutBtn.addEventListener("click", () => {
  void smartCutoutActiveLayer();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files && fileInput.files[0]) {
    importImageFile(fileInput.files[0]);
    fileInput.value = "";
  }
});

previewCanvas.addEventListener("pointerdown", startPointer);
previewCanvas.addEventListener("pointermove", movePointer);
window.addEventListener("pointerup", finishPointer);
window.addEventListener("pointercancel", finishPointer);
canvasScroll.addEventListener("wheel", (event) => {
  const isPinchZoom = event.ctrlKey;
  if (isPinchZoom) {
    event.preventDefault();
    const zoomDelta = Math.exp(-event.deltaY * 0.0025);
    setZoom(state.zoom * zoomDelta, event.clientX, event.clientY);
    return;
  }

  if (canvasScroll.matches(":hover")) {
    event.preventDefault();
    canvasScroll.scrollLeft += event.deltaX;
    canvasScroll.scrollTop += event.deltaY;
  }
}, { passive: false });
previewCanvas.addEventListener("contextmenu", (event) => event.preventDefault());
window.addEventListener("pointerleave", () => {
  statusCoords.textContent = "Coords: --, --";
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (event.ctrlKey && key === "z") {
    event.preventDefault();
    void undo();
  }

  if (event.ctrlKey && key === "y") {
    event.preventDefault();
    void redo();
  }

  if (event.ctrlKey && key === "s") {
    event.preventDefault();
    exportCompositePng();
  }

  if (event.ctrlKey && key === "o") {
    event.preventDefault();
    fileInput.click();
  }
});

window.addEventListener("pagehide", () => {
  if (state.layers.length) {
    void persistAutosave(serializeProject());
  }
});

window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && state.layers.length) {
    void persistAutosave(serializeProject());
  }
});

async function initializeApp() {
  updateColorChips();
  syncCanvasWrapper();
  const savedProject = await loadAutosave();

  if (savedProject && savedProject.layers && savedProject.layers.length) {
    await restoreProject(savedProject);
    state.history = [serializeProject()];
    state.redoStack = [];
  } else {
    newProject();
  }

  updateToolButtons();
  updateSmartCutoutStatus("Model idle.");
}

buildPalette();
bindColorEditor();
void initializeApp();
