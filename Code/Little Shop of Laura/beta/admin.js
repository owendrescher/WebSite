const adminForm = document.getElementById("admin-form");
const imageInput = document.getElementById("item-image");
const nameInput = document.getElementById("item-name");
const priceInput = document.getElementById("item-price");
const descriptionInput = document.getElementById("item-description");
const imagePreview = document.getElementById("admin-image-preview");
const adminMessage = document.getElementById("admin-message");
const imageModeSelect = document.getElementById("image-mode");

let uploadedImage = "";

applyImageDisplayMode();

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

if (imageInput) {
  imageInput.addEventListener("change", () => {
    const [file] = imageInput.files || [];
    if (!file) {
      uploadedImage = "";
      updatePreview("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      uploadedImage = String(reader.result);
      updatePreview(uploadedImage);
    };
    reader.readAsDataURL(file);
  });
}

if (adminForm) {
  adminForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!uploadedImage) {
      adminMessage.textContent = "Please upload an image before saving the item.";
      return;
    }

    const item = addShopItem({
      name: nameInput.value.trim(),
      price: Number(priceInput.value).toFixed(2),
      description: descriptionInput.value.trim(),
      image: uploadedImage
    });

    adminMessage.textContent = `${item.name} has been added to the shop collection.`;
    adminMessage.classList.add("is-success");
    adminForm.reset();
    uploadedImage = "";
    updatePreview("");
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
