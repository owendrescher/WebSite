const SHOP_STORAGE_KEY = "little-shop-items-v1";
const IMAGE_DISPLAY_MODE_KEY = "little-shop-image-mode-v1";

function createPlaceholderImage(label, tone) {
  const safeLabel = encodeURIComponent(label);
  const fill = tone.replace("#", "%23");

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 1100'%3E%3Crect width='900' height='1100' fill='%23f6f1ea'/%3E%3Crect x='125' y='125' width='650' height='850' rx='34' fill='${fill}' opacity='0.28'/%3E%3Ccircle cx='310' cy='360' r='110' fill='%23181818' opacity='0.92'/%3E%3Crect x='430' y='255' width='170' height='340' fill='%23f8f4ee'/%3E%3Crect x='240' y='735' width='420' height='54' fill='%23111111'/%3E%3Ctext x='120' y='1030' fill='%23111111' font-family='Georgia' font-size='54'%3E${safeLabel}%3C/text%3E%3C/svg%3E`;
}

const DEFAULT_SHOP_ITEMS = [
  {
    id: "stoneware-vessel",
    name: "Stoneware Vessel",
    price: "68",
    description: "A hand-finished ceramic form with a soft matte surface and sculptural profile.",
    image: createPlaceholderImage("Stoneware Vessel", "#d1c7bb")
  },
  {
    id: "black-linen-throw",
    name: "Black Linen Throw",
    price: "124",
    description: "Washed linen with a dense drape and tonal texture designed for quiet layering.",
    image: createPlaceholderImage("Black Linen Throw", "#b9b0a4")
  },
  {
    id: "low-oak-bench",
    name: "Low Oak Bench",
    price: "420",
    description: "Solid oak seating with a charred edge detail and a restrained architectural line.",
    image: createPlaceholderImage("Low Oak Bench", "#c8beb2")
  }
];

function normalizeItem(item) {
  return {
    id: item.id || `item-${Date.now()}`,
    name: item.name || "Untitled Item",
    price: item.price || "0",
    description: item.description || "",
    image: item.image || createPlaceholderImage(item.name || "Item", "#cec4b8")
  };
}

function getShopItems() {
  const stored = localStorage.getItem(SHOP_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(DEFAULT_SHOP_ITEMS));
    return [...DEFAULT_SHOP_ITEMS];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(DEFAULT_SHOP_ITEMS));
      return [...DEFAULT_SHOP_ITEMS];
    }

    return parsed.map(normalizeItem);
  } catch (error) {
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(DEFAULT_SHOP_ITEMS));
    return [...DEFAULT_SHOP_ITEMS];
  }
}

function saveShopItems(items) {
  localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(items.map(normalizeItem)));
}

function addShopItem(item) {
  const items = getShopItems();
  const newItem = normalizeItem({
    ...item,
    id: `item-${Date.now()}`
  });

  items.unshift(newItem);
  saveShopItems(items);
  return newItem;
}

function getImageDisplayMode() {
  return localStorage.getItem(IMAGE_DISPLAY_MODE_KEY) || "beigescale";
}

function saveImageDisplayMode(mode) {
  localStorage.setItem(IMAGE_DISPLAY_MODE_KEY, mode);
}

function applyImageDisplayMode(mode = getImageDisplayMode()) {
  document.body.dataset.imageMode = mode;
}
