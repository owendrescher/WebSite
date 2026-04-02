const aestheticTabs = document.querySelectorAll(".aesthetic-tab");
const scenes = document.querySelectorAll(".aesthetic-scene");

applyImageDisplayMode();

aestheticTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetId = tab.dataset.aesthetic;

    aestheticTabs.forEach((item) => {
      item.classList.toggle("is-active", item === tab);
    });

    scenes.forEach((scene) => {
      scene.classList.toggle("is-visible", scene.id === targetId);
    });
  });
});

const classForm = document.getElementById("class-form");

if (classForm) {
  classForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.querySelector('[data-form-message="class-form"]');
    const formData = new FormData(classForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const className = String(formData.get("class") || "").trim();

    addClassRequest({ name, email, className });

    message.textContent = `${name}, your class request has been captured. A confirmation will follow by email.`;
    message.classList.add("is-success");
    classForm.reset();
  });
}

const shopGrid = document.getElementById("shop-grid");
const modal = document.getElementById("shop-modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalDescription = document.getElementById("modal-description");
const modalClose = document.getElementById("modal-close");
const modalPrev = document.getElementById("modal-prev");
const modalNext = document.getElementById("modal-next");

let shopItems = getShopItems();
let activeIndex = 0;

function renderShopItems() {
  if (!shopGrid) {
    return;
  }

  shopItems = getShopItems();

  if (!shopItems.length) {
    shopGrid.innerHTML = '<p class="empty-state">No items available yet.</p>';
    return;
  }

  shopGrid.innerHTML = shopItems.map((item, index) => `
    <button class="shop-item" type="button" data-index="${index}">
      <div class="shop-image-wrap">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="shop-copy">
        <div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
        <span>View</span>
      </div>
    </button>
  `).join("");

  shopGrid.querySelectorAll(".shop-item").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(Number(button.dataset.index));
    });
  });
}

function renderModal(index) {
  const item = shopItems[index];
  if (!item) {
    return;
  }

  activeIndex = index;
  modalImage.src = item.image;
  modalImage.alt = item.name;
  modalName.textContent = item.name;
  modalPrice.textContent = `$${item.price}`;
  modalDescription.textContent = item.description;
}

function openModal(index) {
  renderModal(index);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function moveModal(direction) {
  if (!shopItems.length) {
    return;
  }

  const nextIndex = (activeIndex + direction + shopItems.length) % shopItems.length;
  renderModal(nextIndex);
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modalPrev) {
  modalPrev.addEventListener("click", () => moveModal(-1));
}

if (modalNext) {
  modalNext.addEventListener("click", () => moveModal(1));
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

const calendarTitle = document.getElementById("calendar-title");
const calendarGrid = document.getElementById("calendar-grid");
const calendarPrev = document.getElementById("calendar-prev");
const calendarNext = document.getElementById("calendar-next");
const slotList = document.getElementById("slot-list");
const selectedDateLabel = document.getElementById("selected-date-label");
const selectedDateNote = document.getElementById("selected-date-note");
const appointmentForm = document.getElementById("appointment-form");
const appointmentDateInput = document.getElementById("appointment-date");
const appointmentTimeInput = document.getElementById("appointment-time");

const now = new Date();
const today = new Date(now);
today.setHours(0, 0, 0, 0);

const monthOptions = [
  new Date(today.getFullYear(), today.getMonth(), 1),
  new Date(today.getFullYear(), today.getMonth() + 1, 1)
];

let visibleMonthIndex = 0;
let selectedDateKey = "";
let selectedTime = "";

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLong(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(date);
}

function formatMonthTitle(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatTimeLabel(hour, minute) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(2026, 0, 1, hour, minute));
}

function isBookableDay(date) {
  const day = date.getDay();
  return (day === 2 || day === 4) && date >= today;
}

function getSlotsForDate(dateKey) {
  const appointments = getStoredAppointments();
  const booked = new Set((appointments[dateKey] || []).map((item) => item.time));
  const isToday = dateKey === formatDateKey(today);
  const slots = [];

  for (let hour = 10; hour < 17; hour += 1) {
    slots.push(createSlot(hour, 0, booked, isToday));
    slots.push(createSlot(hour, 30, booked, isToday));
  }

  return slots;
}

function formatTimeValue(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function createSlot(hour, minute, bookedSet, isToday) {
  const value = formatTimeValue(hour, minute);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const slotMinutes = hour * 60 + minute;
  const expired = isToday && slotMinutes <= nowMinutes;

  return {
    value,
    label: formatTimeLabel(hour, minute),
    booked: bookedSet.has(value) || expired
  };
}

function renderCalendar() {
  if (!calendarGrid || !calendarTitle) {
    return;
  }

  const monthDate = monthOptions[visibleMonthIndex];
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingDays = firstDay.getDay();
  const totalDays = lastDay.getDate();

  calendarTitle.textContent = formatMonthTitle(monthDate);
  calendarPrev.disabled = visibleMonthIndex === 0;
  calendarNext.disabled = visibleMonthIndex === monthOptions.length - 1;

  const cells = [];

  for (let index = 0; index < leadingDays; index += 1) {
    cells.push('<div class="calendar-cell is-empty" aria-hidden="true"></div>');
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    const bookable = isBookableDay(date);
    const selected = dateKey === selectedDateKey;
    const classes = ["calendar-cell"];

    if (!bookable) {
      classes.push("is-disabled");
    }

    if (selected) {
      classes.push("is-selected");
    }

    cells.push(`
      <button
        class="${classes.join(" ")}"
        type="button"
        data-date="${dateKey}"
        ${bookable ? "" : "disabled"}
      >
        <span>${day}</span>
      </button>
    `);
  }

  calendarGrid.innerHTML = cells.join("");

  calendarGrid.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDateKey = button.dataset.date;
      selectedTime = "";
      appointmentDateInput.value = selectedDateKey;
      appointmentTimeInput.value = "";
      renderCalendar();
      renderSlots();
    });
  });
}

function renderSlots() {
  if (!slotList || !selectedDateLabel || !selectedDateNote) {
    return;
  }

  if (!selectedDateKey) {
    selectedDateLabel.textContent = "Choose a Tuesday or Thursday";
    selectedDateNote.textContent = "Half-hour appointment slots from 10:00 AM to 5:00 PM.";
    slotList.innerHTML = '<p class="empty-state">Select an available date to view appointment times.</p>';
    return;
  }

  const [year, month, day] = selectedDateKey.split("-").map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const slots = getSlotsForDate(selectedDateKey);
  const remainingCount = slots.filter((slot) => !slot.booked).length;

  selectedDateLabel.textContent = formatDateLong(selectedDate);
  selectedDateNote.textContent = `${remainingCount} available slot${remainingCount === 1 ? "" : "s"} remaining.`;

  slotList.innerHTML = slots.map((slot) => `
    <button
      class="slot-button ${slot.booked ? "is-booked" : ""} ${selectedTime === slot.value ? "is-selected" : ""}"
      type="button"
      data-time="${slot.value}"
      ${slot.booked ? "disabled" : ""}
    >
      ${slot.label}
    </button>
  `).join("");

  slotList.querySelectorAll("[data-time]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTime = button.dataset.time;
      appointmentTimeInput.value = selectedTime;
      renderSlots();
    });
  });
}

function bookAppointment(payload) {
  const appointments = getStoredAppointments();
  const dayAppointments = appointments[payload.date] || [];

  if (dayAppointments.some((item) => item.time === payload.time)) {
    return false;
  }

  dayAppointments.push(payload);
  dayAppointments.sort((a, b) => a.time.localeCompare(b.time));
  appointments[payload.date] = dayAppointments;
  saveStoredAppointments(appointments);
  return true;
}

if (calendarPrev) {
  calendarPrev.addEventListener("click", () => {
    visibleMonthIndex = Math.max(0, visibleMonthIndex - 1);
    renderCalendar();
  });
}

if (calendarNext) {
  calendarNext.addEventListener("click", () => {
    visibleMonthIndex = Math.min(monthOptions.length - 1, visibleMonthIndex + 1);
    renderCalendar();
  });
}

if (appointmentForm) {
  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.querySelector('[data-form-message="appointment-form"]');
    const formData = new FormData(appointmentForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const focus = String(formData.get("focus") || "").trim();
    const date = String(formData.get("appointmentDate") || "");
    const time = String(formData.get("appointmentTime") || "");

    if (!date || !time) {
      message.classList.remove("is-success");
      message.textContent = "Please select both a date and a time slot.";
      return;
    }

    const booked = bookAppointment({ name, email, focus, date, time });

    if (!booked) {
      message.classList.remove("is-success");
      message.textContent = "That appointment slot was just taken. Please choose another.";
      renderSlots();
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);
    message.textContent = `${name}, your appointment is booked for ${formatDateLong(selectedDate)} at ${formatTimeLabel(Number(time.split(":")[0]), Number(time.split(":")[1]))}.`;
    message.classList.add("is-success");
    appointmentForm.reset();
    selectedTime = "";
    appointmentDateInput.value = selectedDateKey;
    appointmentTimeInput.value = "";
    renderSlots();
  });
}

document.addEventListener("keydown", (event) => {
  if (!modal || !modal.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeModal();
  }

  if (event.key === "ArrowLeft") {
    moveModal(-1);
  }

  if (event.key === "ArrowRight") {
    moveModal(1);
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === SHOP_STORAGE_KEY) {
    renderShopItems();
  }

  if (event.key === APPOINTMENT_STORAGE_KEY) {
    renderSlots();
  }

  if (event.key === IMAGE_DISPLAY_MODE_KEY) {
    applyImageDisplayMode();
  }

  if (event.key === CLASS_REQUESTS_STORAGE_KEY) {
    return;
  }
});

// Scroll-driven background crossfade for the three landing placeholders.
const landingLayers = Array.from(document.querySelectorAll(".landing-bg-layer"));

if (landingLayers.length === 3) {
  let ticking = false;

  const updateLandingBackground = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

    const layerOneOpacity = Math.max(0, 1 - (progress * 2));
    const layerThreeOpacity = Math.max(0, (progress * 2) - 1);
    const layerTwoOpacity = 1 - Math.abs((progress * 2) - 1);

    landingLayers[0].style.opacity = layerOneOpacity.toFixed(3);
    landingLayers[1].style.opacity = layerTwoOpacity.toFixed(3);
    landingLayers[2].style.opacity = layerThreeOpacity.toFixed(3);
    ticking = false;
  };

  const requestBackgroundUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateLandingBackground);
    }
  };

  window.addEventListener("scroll", requestBackgroundUpdate, { passive: true });
  window.addEventListener("resize", requestBackgroundUpdate);
  requestBackgroundUpdate();
}

renderShopItems();
renderCalendar();
renderSlots();
