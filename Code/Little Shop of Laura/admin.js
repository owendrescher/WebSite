const adminForm = document.getElementById("admin-form");
const imageInput = document.getElementById("item-image");
const nameInput = document.getElementById("item-name");
const priceInput = document.getElementById("item-price");
const descriptionInput = document.getElementById("item-description");
const imagePreview = document.getElementById("admin-image-preview");
const adminMessage = document.getElementById("admin-message");
const imageModeSelect = document.getElementById("image-mode");
const inventoryList = document.getElementById("inventory-list");
const appointmentRequests = document.getElementById("appointment-requests");
const classRequests = document.getElementById("class-requests");

let uploadedImage = "";

applyImageDisplayMode();

async function fileToOptimizedDataUrl(file) {
  const rawDataUrl = await readFileAsDataUrl(file);
  const bitmap = await loadBitmap(rawDataUrl);

  const maxSide = 1800;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.84);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("FILE_READ_FAILED"));
    reader.readAsDataURL(file);
  });
}

function loadBitmap(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("IMAGE_LOAD_FAILED"));
    image.src = dataUrl;
  });
}

function updatePreview(image) {
  if (!imagePreview) {
    return;
  }

  if (!image) {
    imagePreview.style.backgroundImage = "";
    return;
  }

  imagePreview.style.backgroundImage = `linear-gradient(180deg, rgba(17, 17, 17, 0.04), rgba(17, 17, 17, 0.12)), url("${image}")`;
}

function formatAdminDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatAdminTime(value) {
  const [hour, minute] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(2026, 0, 1, hour, minute));
}

function renderInventory() {
  if (!inventoryList) {
    return;
  }

  const items = getShopItems();
  if (!items.length) {
    inventoryList.innerHTML = '<p class="empty-state">No inventory yet.</p>';
    return;
  }

  inventoryList.innerHTML = items.map((item) => `
    <article class="admin-entry inventory-entry">
      <div class="admin-thumb"><img src="${item.image}" alt="${item.name}"></div>
      <div>
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
        <p>${item.description}</p>
      </div>
    </article>
  `).join("");
}

function renderAppointments() {
  if (!appointmentRequests) {
    return;
  }

  const appointments = getStoredAppointments();
  const flattened = Object.entries(appointments)
    .flatMap(([date, entries]) => entries.map((entry) => ({ ...entry, date })))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  if (!flattened.length) {
    appointmentRequests.innerHTML = '<p class="empty-state">No appointment requests yet.</p>';
    return;
  }

  appointmentRequests.innerHTML = flattened.map((entry) => `
    <article class="admin-entry">
      <h3>${entry.name}</h3>
      <p>${formatAdminDate(entry.date)} at ${formatAdminTime(entry.time)}</p>
      <p>${entry.email}</p>
      <p>${entry.focus}</p>
    </article>
  `).join("");
}

function renderClassRequests() {
  if (!classRequests) {
    return;
  }

  const requests = getClassRequests();
  if (!requests.length) {
    classRequests.innerHTML = '<p class="empty-state">No class requests yet.</p>';
    return;
  }

  classRequests.innerHTML = requests.map((request) => `
    <article class="admin-entry">
      <h3>${request.name}</h3>
      <p>${request.className}</p>
      <p>${request.email}</p>
      <p>Received ${formatAdminDate(request.createdAt)}</p>
    </article>
  `).join("");
}

function renderAdminData() {
  renderInventory();
  renderAppointments();
  renderClassRequests();
}

if (imageInput) {
  imageInput.addEventListener("change", async () => {
    const [file] = imageInput.files || [];
    if (!file) {
      uploadedImage = "";
      updatePreview("");
      return;
    }

    try {
      uploadedImage = await fileToOptimizedDataUrl(file);
      updatePreview(uploadedImage);
      adminMessage.classList.remove("is-success");
      adminMessage.textContent = "";
    } catch (error) {
      uploadedImage = "";
      updatePreview("");
      adminMessage.classList.remove("is-success");
      adminMessage.textContent = "Could not process that image. Please try a different file.";
    }
  });
}

if (adminForm) {
  adminForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!uploadedImage) {
      adminMessage.classList.remove("is-success");
      adminMessage.textContent = "Please upload an image before saving the item.";
      return;
    }

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const price = Number(priceInput.value || 0);

    if (!name || !description || Number.isNaN(price) || price < 0) {
      adminMessage.classList.remove("is-success");
      adminMessage.textContent = "Please complete all item fields with valid values.";
      return;
    }

    let item;
    try {
      item = addShopItem({
        name,
        price: price.toFixed(2),
        description,
        image: uploadedImage
      });
    } catch (error) {
      adminMessage.classList.remove("is-success");
      adminMessage.textContent = "Item could not be saved. Try a smaller image file.";
      return;
    }

    adminMessage.textContent = `${item.name} has been added to the shop collection and is ready on the storefront.`;
    adminMessage.classList.add("is-success");
    adminForm.reset();
    imageModeSelect.value = getImageDisplayMode();
    uploadedImage = "";
    updatePreview("");
    renderInventory();
  });
}

if (imageModeSelect) {
  imageModeSelect.value = getImageDisplayMode();

  imageModeSelect.addEventListener("change", () => {
    saveImageDisplayMode(imageModeSelect.value);
    applyImageDisplayMode(imageModeSelect.value);
    adminMessage.textContent = "Feature image treatment updated.";
    adminMessage.classList.add("is-success");
  });
}

window.addEventListener("storage", (event) => {
  if (
    event.key === SHOP_STORAGE_KEY ||
    event.key === APPOINTMENT_STORAGE_KEY ||
    event.key === CLASS_REQUESTS_STORAGE_KEY
  ) {
    renderAdminData();
  }

  if (event.key === IMAGE_DISPLAY_MODE_KEY) {
    applyImageDisplayMode();
    imageModeSelect.value = getImageDisplayMode();
  }
});

renderAdminData();
