const STORAGE_KEYS = {
  authDay: "clubflow-auth-day",
  authSession: "clubflow-auth-session",
  authName: "clubflow-auth-name",
  records: "clubflow-records-v3",
  memberDraft: "clubflow-member-draft-v1",
  memberPhotosFallback: "clubflow-member-photos-v1",
  schedule: "clubflow-schedule-v3",
  overview: "clubflow-overview-v3",
  alerts: "clubflow-alerts-v1",
  posContext: "clubflow-pos-context-v1",
  posCart: "clubflow-pos-cart-v1",
  memberNavContext: "clubflow-member-nav-context",
};

const NAV_ITEMS = [
  ["overview", "Overview", "OV", "index.html"],
  ["members", "Members", "MB", "members.html"],
  ["checkin", "Check In", "CI", "checkin.html"],
  ["schedules", "Schedules", "SC", "schedules.html"],
  ["analytics", "Analytics", "AN", "analytics.html"],
  ["communications", "Outreach", "OR", "outreach.html"],
  ["tools", "Tools", "TL", "tools.html"],
  ["events", "Events", "EV", "events.html"],
];

const LINK_OPTIONS = NAV_ITEMS.map(([, label, , href]) => ({ label, href }));

const MEMBER_PLAN_OPTIONS = ["Individual", "Family", "Junior", "Tennis", "Fitness", "Corporate"];

const POS_CATALOG = [
  { sku: "DAYPASS", department: "Front Desk", name: "Guest Day Pass", price: 25 },
  { sku: "SMOOTHIE", department: "Cafe", name: "Protein Smoothie", price: 9.5 },
  { sku: "TENNIS1", department: "Tennis", name: "Private Tennis Lesson", price: 85 },
  { sku: "PICKLE1", department: "Pickleball", name: "Pickleball Open Play", price: 18 },
  { sku: "STRING", department: "Repair", name: "Racquet Stringing", price: 32 },
  { sku: "LOCKER", department: "Membership", name: "Locker Rental", price: 14 },
];

const DEFAULT_OVERVIEW_TILES = [
  { id: "pos", title: "Point of Sale", color: "#000f9f", href: "tools.html", actions: ["Sell to a Guest", "Search Sale"], featured: true, visible: true },
  { id: "fitness", title: "Fitness", color: "#2333b0", href: "schedules.html", actions: [], featured: false, visible: true },
  { id: "repair", title: "Racquet Repair", color: "#4054c4", href: "tools.html", actions: [], featured: false, visible: true },
  { id: "tennis", title: "Tennis", color: "#95c93d", href: "schedules.html", actions: [], featured: false, visible: true },
  { id: "payroll", title: "My Payroll", color: "#6ca623", href: "tools.html", actions: [], featured: false, visible: true },
  { id: "checkin", title: "Check In", color: "#3044b8", href: "checkin.html", actions: [], featured: false, visible: true },
  { id: "schedule", title: "Schedule", color: "#7eb82d", href: "schedules.html", actions: [], featured: false, visible: true },
  { id: "reports", title: "Reports", color: "#5569d5", href: "analytics.html", actions: [], featured: false, visible: true },
  { id: "email", title: "Email", color: "#b1da68", href: "outreach.html", actions: [], featured: false, visible: true },
];

const PAGE_DEFS = {
  members: {
    banner: "Members",
    title: "Member workspace",
    search: "Search members by name, barcode, member ID, phone, or town",
    entity: "member",
    actions: [["New member", "primary"], ["Clear selection", "secondary"]],
    preview: (record) => ({ title: getMemberDisplayName(record), meta: [getMemberAge(record.dob), record.town].filter(Boolean).join(" | ") || "Member profile", badge: record.status || "Draft" }),
  },
  checkin: {
    banner: "Check In",
    title: "Front desk log",
    search: "Search names, guest entries, locations, or visit notes",
    entity: "entry",
    actions: [["New check-in", "primary"], ["Clear selection", "secondary"]],
    fields: [
      { name: "personName", label: "Person name", type: "text", required: true },
      { name: "entryType", label: "Entry type", type: "select", options: ["Member", "Guest", "Staff"] },
      { name: "location", label: "Location", type: "text" },
      { name: "time", label: "Time", type: "datetime-local" },
      { name: "status", label: "Status", type: "select", options: ["Checked In", "Expected", "Blocked"] },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    preview: (record) => ({ title: record.personName || "Untitled entry", meta: [record.entryType, record.location].filter(Boolean).join(" | ") || "No type or location yet", badge: record.status || "Open" }),
  },
  analytics: {
    banner: "Analytics",
    title: "Report requests",
    search: "Search reports, exports, owners, or cadence",
    entity: "report",
    actions: [["New report", "primary"], ["Clear selection", "secondary"]],
    fields: [
      { name: "reportName", label: "Report name", type: "text", required: true },
      { name: "owner", label: "Owner", type: "text" },
      { name: "scope", label: "Scope", type: "text" },
      { name: "cadence", label: "Cadence", type: "select", options: ["One time", "Daily", "Weekly", "Monthly"] },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    preview: (record) => ({ title: record.reportName || "Untitled report", meta: [record.owner, record.scope].filter(Boolean).join(" | ") || "No owner or scope yet", badge: record.cadence || "Draft" }),
  },
  tools: {
    banner: "Tools",
    title: "Operations queue",
    search: "Search tasks, departments, categories, or status",
    entity: "task",
    actions: [["New task", "primary"], ["Clear selection", "secondary"]],
    fields: [
      { name: "taskName", label: "Task name", type: "text", required: true },
      { name: "department", label: "Department", type: "text" },
      { name: "category", label: "Category", type: "select", options: ["POS", "Payroll", "Repair", "Admin"] },
      { name: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Done"] },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    preview: (record) => ({ title: record.taskName || "Untitled task", meta: [record.department, record.category].filter(Boolean).join(" | ") || "No department or category yet", badge: record.status || "Open" }),
  },
  events: {
    banner: "Events",
    title: "Event planner",
    search: "Search events, spaces, owners, or status",
    entity: "event",
    actions: [["New event", "primary"], ["Clear selection", "secondary"]],
    fields: [
      { name: "eventName", label: "Event name", type: "text", required: true },
      { name: "date", label: "Date", type: "date" },
      { name: "space", label: "Space", type: "text" },
      { name: "owner", label: "Owner", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["Planned", "Confirmed", "Live", "Closed"] },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    preview: (record) => ({ title: record.eventName || "Untitled event", meta: [record.date, record.space].filter(Boolean).join(" | ") || "No date or space yet", badge: record.status || "Planned" }),
  },
};

const SCHEDULE_AREAS = [
  { key: "tennis", label: "Tennis Courts 1-4", resources: ["Court 1", "Court 2", "Court 3", "Court 4"] },
  { key: "pickleball", label: "Pickleball Courts 1-6", resources: ["Court 1", "Court 2", "Court 3", "Court 4", "Court 5", "Court 6"] },
  { key: "dance", label: "Dance Room", resources: ["Dance Room"] },
  { key: "spin", label: "Spin Room", resources: ["Spin Room"] },
];

const DAY_START_MINUTES = 6 * 60;
const DAY_END_MINUTES = 22 * 60;
const SLOT_MINUTES = 30;

const app = document.querySelector("#app");
const pageKey = document.body.dataset.page || "overview";
const urlParams = new URLSearchParams(window.location.search);
let memberCameraStream = null;
let memberPhotoDbPromise = null;

const state = {
  records: loadRecords(),
  scheduleEntries: loadStorage(STORAGE_KEYS.schedule, []).map(normalizeScheduleEntry),
  overviewTiles: loadStorage(STORAGE_KEYS.overview, DEFAULT_OVERVIEW_TILES).map(normalizeOverviewTile),
  alerts: loadStorage(STORAGE_KEYS.alerts, []).map(normalizeAlert).sort(sortByCreatedAtDesc),
  posContext: loadStorage(STORAGE_KEYS.posContext, null),
  posCart: loadStorage(STORAGE_KEYS.posCart, []),
  posLookupQuery: "",
  posMemberQuery: "",
  posItemQuery: "",
  posDevice: "square-terminal",
  globalMemberQuery: "",
  checkinLastResult: null,
  memberDraft: loadStorage(STORAGE_KEYS.memberDraft, null),
  memberPhotos: {},
  selectedRecordId: null,
  selectedAlertId: null,
  selectedScheduleId: null,
  scheduleArea: SCHEDULE_AREAS[0].key,
  scheduleDate: todayKey(),
  visibleMonth: startOfMonth(todayKey()),
  layoutEditorOpen: false,
  editingTileId: null,
  alertMenuOpen: false,
  scheduleModalOpen: false,
  scheduleDraft: createScheduleDraft(),
  memberProfileOpen: false,
};

if (pageKey === "members") {
  const pendingMemberId = loadStorage(STORAGE_KEYS.memberNavContext, "");
  if (pendingMemberId) {
    state.selectedRecordId = pendingMemberId;
    state.memberProfileOpen = true;
    localStorage.removeItem(STORAGE_KEYS.memberNavContext);
  }
}

if (pageKey === "tools") {
  applyPOSRouteIntent();
}

document.title = `${getPageTitle()} | ClubFlow OS`;
boot();

function boot() {
  render();
  hydrateMemberPhotos()
    .then((didChange) => {
      if (didChange) rerenderApp();
    })
    .catch(() => {
      // Keep the initial UI responsive even if background media hydration fails.
    });
}

function render(searchValue = state.globalMemberQuery) {
  stopMemberCameraStream();
  const lookupResults = getMemberLookupResults(searchValue);
  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <a class="brand__link" href="index.html" aria-label="Cedardale home">
          <div class="brand__halo"></div>
          <div class="brand__mark">
            <img class="brand__logo" src="./cedardale.png" alt="Cedardale logo" />
          </div>
          <div class="brand__wordmark">
            <strong>Cedardale</strong>
            <span>ClubFlow OS</span>
          </div>
        </a>
        <nav class="sidebar__nav">
          ${NAV_ITEMS.map(([key, label, short, href]) => `<a class="nav-item ${key === pageKey ? "is-active" : ""}" href="${href}"><span class="nav-item__icon">${short}</span><span>${label}</span></a>`).join("")}
        </nav>
        <div class="sidebar__footer"><p>Operations shell</p><strong>Cedardale</strong><span>Courtside desk</span></div>
      </aside>
      <main class="workspace">
        <header class="topbar">
          <div class="topbar__location">
            <div class="topbar__brand">
              <img class="topbar__logo" src="./cedardale.png" alt="Cedardale logo" />
              <div>
                <p class="eyebrow">Active location</p>
                <h2>Cedardale - Courtside Operations</h2>
              </div>
            </div>
            <div class="topbar__meta"><span class="meta-chip">Courtside Desk</span><span class="meta-chip meta-chip--live">Live</span></div>
          </div>
          <label class="search">
            <span>Member lookup</span>
            <input id="page-search" type="text" value="${escapeHtml(searchValue)}" placeholder="${getSearchPlaceholder()}" />
            ${searchValue ? `<div class="global-member-results">${lookupResults.length ? lookupResults.map((member) => renderGlobalLookupCard(member)).join("") : `<div class="empty-inline">No member matched that lookup.</div>`}</div>` : ""}
          </label>
          <div class="topbar__actions">
            <div class="alerts-shell">
              <button class="ghost-button alerts-toggle ${state.alertMenuOpen ? "is-open" : ""}" id="alerts-toggle" type="button">
                <span>Alerts</span>
                ${renderAlertsCount()}
              </button>
              ${state.alertMenuOpen ? renderAlertsDropdown() : ""}
            </div>
            <button class="ghost-button" id="sign-out-button" type="button">Sign out</button>
            <button class="profile-chip" id="profile-chip" type="button">${getInitials()}</button>
          </div>
        </header>
        <section class="page-frame" id="page-frame">${renderCurrentPage(searchValue)}</section>
        <footer class="footer"><span>ClubFlow OS prototype</span><span>Editable local data with scheduling and broadcast alerts</span></footer>
      </main>
    </div>
    ${renderTileEditorModal()}
    ${renderScheduleModal()}
    ${renderMemberCameraModal()}
    ${renderAuthModal()}
  `;

  bindSearch();
  bindTopbarInteractions();
  bindPageInteractions();
  bindModalInteractions();
  bindAuth();
  syncAuthState();
}

function renderCurrentPage(query = "") {
  if (pageKey === "overview") return renderOverview(query);
  if (pageKey === "checkin") return renderCheckinPage();
  if (pageKey === "schedules") return renderSchedules(query);
  if (pageKey === "communications") return renderOutreach(query);
  if (pageKey === "members") return renderMembersPage(query);
  if (pageKey === "tools") return renderPOSPage(query);
  return renderRecordPage(PAGE_DEFS[pageKey], query);
}

function renderOverview(query = "") {
  const text = query.toLowerCase();
  const tiles = state.overviewTiles.filter((tile) => tile.visible).filter((tile) => !text || `${tile.title} ${tile.actions.join(" ")} ${tile.href}`.toLowerCase().includes(text));

  return `
    <section class="overview-toolbar">
      <div><p class="eyebrow">Operations cockpit</p><h3>Choose an area and get to work.</h3></div>
      <div class="overview-toolbar__right">
        ${state.layoutEditorOpen ? `<div class="overview-note">Drag modules to reorder. Use Edit on any tile to change color, title, and link.</div>` : ``}
        <button class="manage-button" id="layout-toggle" type="button">${state.layoutEditorOpen ? "Done Editing Layout" : "Manage/Edit Layouts"}</button>
      </div>
    </section>
    <section class="overview-grid ${state.layoutEditorOpen ? "is-editing" : ""}">
      ${tiles.length ? tiles.map((tile) => renderOverviewTile(tile)).join("") : `<article class="panel empty-panel"><h4>No visible modules matched that search.</h4></article>`}
    </section>
  `;
}

function renderOverviewTile(tile) {
  const tileStyle = `--tile-color:${tile.color}; --tile-color-dark:${shadeHex(tile.color, 0.76)};`;
  const tag = tile.id !== "pos" && !state.layoutEditorOpen ? "a" : "article";
  const href = tag === "a" ? ` href="${sanitizeHref(tile.href)}"` : "";
  return `
    <${tag} class="overview-tile ${tile.featured ? "overview-tile--featured" : ""} ${state.layoutEditorOpen ? "is-editing" : ""} ${tag === "a" ? "overview-tile--link" : ""}" data-tile-id="${tile.id}" draggable="${state.layoutEditorOpen ? "true" : "false"}"${href} style="${tileStyle}">
      <div class="overview-tile__accent"></div>
      ${state.layoutEditorOpen ? `<div class="tile-drag-handle" aria-hidden="true">Drag</div>` : ""}
      <div class="overview-tile__title-row"><div class="overview-tile__title">${escapeHtml(tile.title)}</div></div>
      ${tile.id === "pos" ? renderPosLookupPanel(tile) : renderOverviewTileBody(tile)}
      ${state.layoutEditorOpen ? `<button class="tile-edit-button tile-edit-button--bottom" type="button" data-tile-edit="${tile.id}">Edit module</button>` : ""}
    </${tag}>
  `;
}

function renderOverviewTileBody(tile) {
  if (!tile.actions.length) return `<div class="overview-tile__body"></div>`;

  return `<div class="overview-tile__body"><div class="overview-tile__actions">${tile.actions.map((action) => `<a href="${sanitizeHref(tile.href)}">${escapeHtml(action)}</a>`).join("")}</div></div>`;
}

function renderPosLookupPanel(tile) {
  const query = state.posLookupQuery.trim();
  const results = getPosResults(query);
  return `
    <div class="overview-tile__body">
      <div class="pos-lookup">
        <label class="pos-search"><input data-pos-input type="text" value="${escapeHtml(state.posLookupQuery)}" placeholder="Search members or guests for POS" /></label>
        ${query ? `<div class="pos-results">${results.length ? results.map((result) => renderOverviewPOSResult(result)).join("") : `<div class="pos-empty">No members or recent guest entries matched that search.</div>`}</div>` : ""}
      </div>
      <div class="overview-tile__actions">${tile.actions.map((action) => renderPosAction(action, tile.href)).join("")}</div>
    </div>
  `;
}

function renderOverviewPOSResult(result) {
  return `
    <a class="pos-result" href="${escapeHtml(getPOSSelectionHref(result))}" data-pos-select="${result.key}">
      <div class="pos-result__avatar">${renderProfileVisual(result.photo || "", result.label, false)}</div>
      <div class="pos-result__copy">
        <strong>${escapeHtml(result.label)}</strong>
        <span>${escapeHtml(result.secondary || result.meta)}</span>
      </div>
    </a>
  `;
}

function renderPosAction(action, href) {
  if (action === "Sell to a Guest") {
    return `<a href="tools.html?guest=1" data-pos-guest>${escapeHtml(action)}</a>`;
  }
  return `<a href="${sanitizeHref(href)}">${escapeHtml(action)}</a>`;
}

function renderAlertsCount() {
  const count = getActiveAlerts().length;
  return count ? `<strong class="alert-count">${count}</strong>` : `<span class="alert-count alert-count--empty">0</span>`;
}

function renderAlertsDropdown() {
  const alerts = state.alerts.sort(sortByCreatedAtDesc);
  return `
    <div class="alerts-menu">
      <div class="alerts-menu__header">
        <div><span class="panel__eyebrow">System alerts</span><h4>${alerts.length ? `${getActiveAlerts().length} active` : "No alerts"}</h4></div>
        <a class="alerts-menu__link" href="outreach.html">Open outreach</a>
      </div>
      <div class="alerts-menu__list">
        ${alerts.length ? alerts.map((alert) => `<article class="alerts-menu__item alerts-menu__item--${alert.priority}"><div class="alerts-menu__item-copy"><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.message)}</p><span>${alert.active ? "Active" : "Previous"} | ${formatTimestamp(alert.createdAt)}</span></div><div class="alerts-menu__item-actions">${alert.active ? `<button class="icon-button" type="button" data-alert-dismiss="${alert.id}" aria-label="Dismiss alert">Dismiss</button>` : ""}<button class="icon-button" type="button" data-alert-delete-global="${alert.id}" aria-label="Delete alert">Delete</button></div></article>`).join("") : `<div class="empty-inline">Broadcast alerts sent from Outreach will appear here.</div>`}
      </div>
    </div>
  `;
}

function renderOutreach(query = "") {
  const alerts = getFilteredAlerts(query);
  const selected = getSelectedAlert(alerts);

  return `
    <section class="launch-header">
      <div><p class="eyebrow">Outreach</p><h3>Broadcast service</h3></div>
      <div class="launch-header__actions"><button class="primary-button" type="button" data-alert-new>New alert</button><button class="secondary-button" type="button" data-alert-clear>Clear selection</button></div>
    </section>
    <section class="record-shell">
      <article class="panel record-panel">
        <div class="panel__header"><span class="panel__eyebrow">Sent to all terminals</span><h4>${alerts.length} alert${alerts.length === 1 ? "" : "s"}</h4></div>
        <div class="record-list">${alerts.length ? alerts.map((alert) => renderAlertCard(alert, selected?.id === alert.id)).join("") : `<div class="empty-inline">No broadcast alerts yet. Send the first one from the form.</div>`}</div>
      </article>
      <article class="panel form-panel">
        <div class="panel__header"><span class="panel__eyebrow">${selected ? "Edit alert" : "New alert"}</span><h4>${selected ? "Update a system broadcast" : "Send a system broadcast"}</h4><p class="panel__copy">Alerts sent here appear in the alerts dropdown across the workspace on this device profile.</p></div>
        <form class="data-form" data-alert-form>
          <input type="hidden" name="id" value="${selected?.id || ""}" />
          <label><span>Alert title</span><input name="title" type="text" value="${escapeHtml(selected?.title || "")}" placeholder="Front desk note" required /></label>
          <label><span>Message</span><textarea name="message" rows="5" placeholder="Write the message that every terminal should see.">${escapeHtml(selected?.message || "")}</textarea></label>
          <div class="field-row">
            <label><span>Priority</span><select name="priority">${["info", "warning", "critical"].map((option) => `<option value="${option}" ${selected?.priority === option ? "selected" : ""}>${capitalize(option)}</option>`).join("")}</select></label>
            <label class="checkbox-panel"><span>Active now</span><input name="active" type="checkbox" ${selected ? (selected.active ? "checked" : "") : "checked"} /></label>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit">${selected ? "Update alert" : "Send alert"}</button>
            <button class="secondary-button" type="button" data-alert-reset>New blank form</button>
            ${selected ? `<button class="danger-button" type="button" data-alert-delete="${selected.id}">Delete</button>` : ""}
          </div>
        </form>
      </article>
    </section>
  `;
}

function renderAlertCard(alert, selected) {
  return `<button class="record-card ${selected ? "is-selected" : ""}" type="button" data-alert-select="${alert.id}"><div><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.message)}</p></div><span class="status-pill status-pill--${alert.priority}">${alert.active ? "Active" : "Inactive"}</span></button>`;
}

function renderMembersPage(query = "") {
  const records = getPageRecords("members");
  const filtered = !query
    ? records
    : records.filter((record) => `${record.firstName} ${record.lastName} ${record.memberId} ${record.barcodeValue} ${record.email} ${record.phone} ${record.town}`.toLowerCase().includes(query.toLowerCase()));
  const selected = records.find((record) => record.id === state.selectedRecordId) || null;
  const member = selected || createEmptyMember(state.memberDraft || {});
  const showProfile = Boolean(selected && state.memberProfileOpen);

  return `
    <section class="launch-header">
      <div><p class="eyebrow">Members</p><h3>Member intake and profile setup</h3></div>
      <div class="launch-header__actions">
        ${showProfile ? `<button class="primary-button" type="button" data-member-edit>Edit member</button>` : `<button class="primary-button" type="button" data-record-new>New member</button>`}
        <button class="secondary-button" type="button" data-record-clear>${showProfile ? "Back to intake" : "Clear selection"}</button>
      </div>
    </section>
    <section class="member-intake-shell">
      ${query ? `
        <article class="panel member-search-panel">
          <div class="panel__header"><span class="panel__eyebrow">Member search</span><h4>${filtered.length} result${filtered.length === 1 ? "" : "s"}</h4></div>
          <div class="member-search-grid">${filtered.length ? filtered.map((record) => renderMemberSearchCard(record, selected?.id === record.id)).join("") : `<div class="empty-inline">No member matched that search.</div>`}</div>
        </article>
      ` : ""}
      <article class="panel form-panel member-intake-panel">
        ${showProfile ? renderMemberProfile(member) : `
        <div class="panel__header"><span class="panel__eyebrow">${selected ? "Edit member" : "New member"}</span><h4>${selected ? "Update member profile" : "Create member profile"}</h4></div>
        <form class="member-form" data-member-form>
          <input type="hidden" name="id" value="${member.id || ""}" />
          <input type="hidden" name="existingPhoto" value="${escapeHtml(getMemberPhoto(member) || "")}" />
          <section class="member-form__header">
            <div class="member-photo-card">
              <button class="member-photo-preview" type="button" data-member-photo-trigger aria-label="Capture member photo">
                <div class="member-photo-preview__visual">${renderProfileVisual(getMemberPhoto(member), getMemberDisplayName(member), true)}</div>
                <div class="member-photo-preview__meta">
                  <strong>Capture photo</strong>
                  <span>Open the camera, take a photo, and attach it to this member.</span>
                </div>
              </button>
              <label><span>Upload picture</span><input name="photoFile" type="file" accept="image/*" /></label>
            </div>
            <div class="member-form__body">
              <div class="member-grid member-grid--two">
                <label><span>First name</span><input name="firstName" type="text" value="${escapeHtml(member.firstName || "")}" required /></label>
                <label><span>Last name</span><input name="lastName" type="text" value="${escapeHtml(member.lastName || "")}" required /></label>
              </div>
              <div class="member-grid member-grid--four">
                <label><span>DOB</span><input name="dob" type="date" value="${escapeHtml(member.dob || "")}" /></label>
                <label><span>Plan type</span><select name="planType">${MEMBER_PLAN_OPTIONS.map((option) => `<option value="${option}" ${member.planType === option ? "selected" : ""}>${option}</option>`).join("")}</select></label>
                <label><span>Status</span><select name="status">${["Active", "On Hold", "Prospect", "Inactive"].map((option) => `<option value="${option}" ${member.status === option ? "selected" : ""}>${option}</option>`).join("")}</select></label>
                <label><span>Household</span><input name="household" type="text" value="${escapeHtml(member.household || "")}" /></label>
              </div>
              <div class="member-grid member-grid--two">
                <label><span>Member ID</span><input name="memberId" type="text" value="${escapeHtml(member.memberId || "")}" placeholder="Club member number" required /></label>
                <label><span>Barcode / scan input</span><input name="barcodeValue" data-member-barcode type="text" value="${escapeHtml(member.barcodeValue || "")}" placeholder="Click here and scan existing barcode" /></label>
              </div>
              <div class="member-form__hint">Use a USB or Bluetooth barcode scanner here. Most scanners act like a keyboard and will populate the barcode field directly.</div>
            </div>
          </section>
          <section class="member-form__section">
            <div class="member-grid member-grid--three">
              <label><span>Email</span><input name="email" type="email" value="${escapeHtml(member.email || "")}" /></label>
              <label><span>Phone</span><input name="phone" type="tel" value="${escapeHtml(member.phone || "")}" /></label>
              <label><span>Town of residence</span><input name="town" type="text" value="${escapeHtml(member.town || "")}" /></label>
            </div>
          </section>
          <section class="member-form__section">
            <div class="member-grid member-grid--four">
              <label><span>Billing address</span><input name="billingAddress" type="text" value="${escapeHtml(member.billingAddress || "")}" /></label>
              <label><span>Billing town</span><input name="billingTown" type="text" value="${escapeHtml(member.billingTown || "")}" /></label>
              <label><span>Billing state</span><input name="billingState" type="text" value="${escapeHtml(member.billingState || "")}" /></label>
              <label><span>Billing ZIP</span><input name="billingZip" type="text" value="${escapeHtml(member.billingZip || "")}" /></label>
            </div>
          </section>
          <section class="member-form__section">
            <div class="member-grid member-grid--three">
              <label><span>Emergency contact</span><input name="emergencyName" type="text" value="${escapeHtml(member.emergencyName || "")}" /></label>
              <label><span>Relationship</span><input name="emergencyRelationship" type="text" value="${escapeHtml(member.emergencyRelationship || "")}" /></label>
              <label><span>Emergency phone</span><input name="emergencyPhone" type="tel" value="${escapeHtml(member.emergencyPhone || "")}" /></label>
            </div>
          </section>
          <section class="member-form__section">
            <label><span>Notes</span><textarea name="notes" rows="3">${escapeHtml(member.notes || "")}</textarea></label>
          </section>
          <div class="form-actions">
            <button class="primary-button" type="submit">${selected ? "Save member" : "Create member"}</button>
            <button class="secondary-button" type="button" data-record-reset>New blank form</button>
            ${selected ? `<button class="danger-button" type="button" data-record-delete="${selected.id}">Delete</button>` : ""}
          </div>
        </form>
        `}
      </article>
    </section>
  `;
}

function renderMemberProfile(member) {
  return `
    <div class="member-profile">
      <div class="panel__header">
        <span class="panel__eyebrow">Member profile</span>
        <h4>${escapeHtml(getMemberDisplayName(member))}</h4>
        <p class="panel__copy">${escapeHtml([member.town || "Town not entered", formatMemberAge(member.dob) || "Age unavailable"].join(" | "))}</p>
      </div>
      <section class="member-profile__hero">
        <div class="member-profile__visual">${renderProfileVisual(getMemberPhoto(member), getMemberDisplayName(member), true)}</div>
        <div class="member-profile__summary">
          <div class="member-profile__stat"><span>Status</span><strong>${escapeHtml(member.status || "Unknown")}</strong></div>
          <div class="member-profile__stat"><span>Plan</span><strong>${escapeHtml(member.planType || "Unassigned")}</strong></div>
          <div class="member-profile__stat"><span>Member ID</span><strong>${escapeHtml(member.memberId || "Not entered")}</strong></div>
          <div class="member-profile__stat"><span>Barcode</span><strong>${escapeHtml(member.barcodeValue || "Not entered")}</strong></div>
        </div>
      </section>
      <section class="member-profile__grid">
        <div class="member-profile__card">
          <span class="eyebrow">Residence</span>
          <strong>${escapeHtml(member.town || "Town not entered")}</strong>
          <p>${escapeHtml(formatMemberAge(member.dob) || "Age unavailable")}</p>
        </div>
        <div class="member-profile__card">
          <span class="eyebrow">Contact</span>
          <strong>${escapeHtml(member.phone || "Phone not entered")}</strong>
          <p>${escapeHtml(member.email || "Email not entered")}</p>
        </div>
        <div class="member-profile__card">
          <span class="eyebrow">Billing</span>
          <strong>${escapeHtml(member.billingAddress || "Billing address not entered")}</strong>
          <p>${escapeHtml([member.billingTown, member.billingState, member.billingZip].filter(Boolean).join(", ") || "Town / state / ZIP not entered")}</p>
        </div>
        <div class="member-profile__card">
          <span class="eyebrow">Emergency</span>
          <strong>${escapeHtml(member.emergencyName || "No emergency contact")}</strong>
          <p>${escapeHtml([member.emergencyRelationship, member.emergencyPhone].filter(Boolean).join(" | ") || "Relationship / phone not entered")}</p>
        </div>
      </section>
      <section class="member-profile__notes">
        <span class="eyebrow">Notes</span>
        <p>${escapeHtml(member.notes || "No notes entered.")}</p>
      </section>
      <div class="form-actions">
        <button class="primary-button" type="button" data-member-edit>Edit member</button>
        <button class="secondary-button" type="button" data-record-new>New member</button>
        <button class="danger-button" type="button" data-record-delete="${member.id}">Delete</button>
      </div>
    </div>
  `;
}

function renderMemberSearchCard(member, selected) {
  return `
    <button class="member-search-card ${selected ? "is-selected" : ""}" type="button" data-record-select="${member.id}">
      <div class="member-search-card__visual">${renderProfileVisual(getMemberPhoto(member), getMemberDisplayName(member), false)}</div>
      <div class="member-search-card__copy">
        <strong>${escapeHtml(getMemberDisplayName(member))}</strong>
        <span>${escapeHtml(member.town || "Town not entered")}</span>
        <span>${escapeHtml(formatMemberAge(member.dob) || "Age unavailable")}</span>
      </div>
    </button>
  `;
}

function renderGlobalLookupCard(member) {
  return `
    <button class="global-member-result" type="button" data-member-lookup-select="${member.id}">
      <div class="global-member-result__visual">${renderProfileVisual(getMemberPhoto(member), getMemberDisplayName(member), false)}</div>
      <div class="global-member-result__copy">
        <strong>${escapeHtml(getMemberDisplayName(member))}</strong>
        <span>${escapeHtml(member.town || "Town not entered")}</span>
        <span>${escapeHtml(formatMemberAge(member.dob) || "Age unavailable")}</span>
      </div>
    </button>
  `;
}

function renderCheckinPage() {
  const preview = state.checkinLastResult;
  return `
    <section class="launch-header">
      <div><p class="eyebrow">Check In</p><h3>Barcode check-in</h3></div>
    </section>
    <section class="checkin-shell">
      <article class="panel checkin-panel">
        <div class="panel__header">
          <span class="panel__eyebrow">Ready for next scan</span>
          <h4>Scan barcode or member ID</h4>
          <p class="panel__copy">Focus stays on the scan field after every check-in so the desk is ready for the next person immediately.</p>
        </div>
        <form class="checkin-form" data-checkin-form>
          <input data-checkin-input name="scanValue" type="text" placeholder="Scan barcode or type member ID" autofocus />
          <button class="primary-button" type="submit">Check in</button>
        </form>
      </article>
      <article class="panel checkin-preview-panel">
        <div class="panel__header"><span class="panel__eyebrow">Latest result</span><h4>${preview ? "Profile preview" : "Waiting for scan"}</h4></div>
        ${preview ? renderCheckinPreview(preview) : `<div class="empty-inline">Scan a barcode to show the latest member preview here.</div>`}
      </article>
    </section>
  `;
}

function renderCheckinPreview(profile) {
  return `
    <div class="checkin-preview">
      <div class="checkin-preview__visual">${renderProfileVisual(profile.photo || "", profile.name, true)}</div>
      <div class="checkin-preview__copy">
        <strong>${escapeHtml(profile.name)}</strong>
        <span>${escapeHtml(profile.age || "Age unavailable")}</span>
        <span class="status-pill ${profile.accountStatus === "Active" ? "status-pill--info" : profile.accountStatus === "Cancelled" ? "status-pill--critical" : "status-pill--warning"}">${escapeHtml(profile.accountStatus)}</span>
      </div>
    </div>
  `;
}

function renderPOSPage(query = "") {
  const member = getActivePOSMember();
  const searchResults = getPosResults(state.posMemberQuery.trim() || query);
  const subtotal = getPOSSubtotal();
  const discount = 0;
  const tax = +(subtotal * 0.0625).toFixed(2);
  const total = +(subtotal - discount + tax).toFixed(2);

  return `
    <section class="launch-header">
      <div><p class="eyebrow">Tools</p><h3>Point of sale</h3></div>
      <div class="launch-header__actions"><button class="secondary-button" type="button" data-pos-clear-member>Clear member</button></div>
    </section>
    <section class="pos-shell">
      <header class="pos-sale-header panel">
        <div class="pos-sale-header__member">
          <div class="pos-sale-header__photo">${renderProfileVisual(member ? getMemberPhoto(member) : state.posContext?.photo || "", member ? getMemberDisplayName(member) : state.posContext?.label || "Non-member", false)}</div>
          <div class="pos-sale-header__copy">
            <h4>${escapeHtml(member ? getMemberDisplayName(member) : state.posContext?.label || "Non-member Sale")}</h4>
            <p>${escapeHtml(member ? [member.planType || "Member", member.memberId || "", formatMemberAge(member.dob) || ""].filter(Boolean).join(" | ") : state.posContext?.meta || "Default walk-in account")}</p>
          </div>
        </div>
        <label class="pos-device-select">
          <span>Terminal mode</span>
          <select data-pos-device>
            <option value="square-terminal" ${state.posDevice === "square-terminal" ? "selected" : ""}>Square Terminal</option>
            <option value="tap-to-pay" ${state.posDevice === "tap-to-pay" ? "selected" : ""}>Tap to Pay</option>
            <option value="manual-card" ${state.posDevice === "manual-card" ? "selected" : ""}>Manual Card Entry</option>
            <option value="cash" ${state.posDevice === "cash" ? "selected" : ""}>Cash</option>
          </select>
        </label>
        <div class="pos-sale-header__date">${new Date().toLocaleDateString()}</div>
      </header>
      <div class="pos-sale-grid">
        <section class="pos-member-panel panel">
          <div class="pos-table">
            <div class="pos-table__head"><span>Member ID</span><span>Plan</span><span>Age</span><span>Barcode</span></div>
            <div class="pos-table__body">
              ${member ? `<div class="pos-table__row"><span>${escapeHtml(member.memberId || "")}</span><span>${escapeHtml(member.planType || "")}</span><span>${escapeHtml(formatMemberAge(member.dob) || "")}</span><span>${escapeHtml(member.barcodeValue || "")}</span></div>` : `<div class="pos-table__empty">No member attached to this sale.</div>`}
            </div>
          </div>
          <div class="pos-member-lookup">
            <label><span>Member lookup</span><input data-pos-member-query type="text" value="${escapeHtml(state.posMemberQuery)}" placeholder="Search name, barcode, phone, email" /></label>
            ${state.posMemberQuery.trim() || query ? `<div class="pos-member-results">${searchResults.length ? searchResults.map((result) => `<button class="pos-member-result" type="button" data-pos-member-select="${result.key}"><div class="pos-member-result__avatar">${renderProfileVisual(result.photo || "", result.label, false)}</div><div><strong>${escapeHtml(result.label)}</strong><span>${escapeHtml(result.secondary || result.meta)}</span></div></button>`).join("") : `<div class="empty-inline">No member matched that search.</div>`}</div>` : ""}
          </div>
          <div class="pos-account-card"><p>Prepared for modern terminal workflows such as Square Terminal or tap-to-pay integrations.</p></div>
        </section>
        <section class="pos-cart-panel panel">
          <div class="pos-table pos-table--cart">
            <div class="pos-table__head"><span>Department</span><span>Item Description</span><span>Price</span><span>Qty</span><span>Total</span></div>
            <div class="pos-table__body">${state.posCart.length ? state.posCart.map(renderPOSCartRow).join("") : `<div class="pos-table__empty">Cart is empty.</div>`}</div>
          </div>
          <div class="pos-summary">
            <div><span>Subtotal</span><strong>${formatCurrency(subtotal)}</strong></div>
            <div><span>Tax</span><strong>${formatCurrency(tax)}</strong></div>
            <div class="pos-summary__total"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
          </div>
          <div class="pos-controls">
            <div class="pos-scan-row">
              <button class="primary-button" type="button" data-pos-item-scan>Scan Item</button>
              <input data-pos-item-query type="text" value="${escapeHtml(state.posItemQuery)}" placeholder="Scan SKU or search item" />
            </div>
            ${state.posItemQuery.trim() ? `<div class="pos-item-results">${getCatalogMatches(state.posItemQuery).length ? getCatalogMatches(state.posItemQuery).map((item) => `<button class="pos-item-result" type="button" data-pos-item-add="${item.sku}"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.department)} | ${item.sku}</span></button>`).join("") : `<div class="empty-inline">No catalog item matched that search.</div>`}</div>` : ""}
            <div class="pos-shortcuts">
              ${POS_CATALOG.map((item) => `<button class="secondary-button" type="button" data-pos-item-add="${item.sku}">${escapeHtml(item.name)}</button>`).join("")}
            </div>
            <div class="form-actions">
              <button class="danger-button" type="button" data-pos-cancel>Cancel trans</button>
              <button class="secondary-button" type="button" data-pos-clear-cart>Clear cart</button>
              <button class="primary-button" type="button" data-pos-pay>Take payment</button>
            </div>
          </div>
        </section>
      </div>
    </section>
  `;
}

function renderPOSCartRow(item) {
  return `
    <div class="pos-cart-row">
      <span>${escapeHtml(item.department)}</span>
      <span>${escapeHtml(item.name)}</span>
      <span>${formatCurrency(item.price)}</span>
      <span class="pos-cart-row__qty"><button type="button" data-pos-qty="${item.id}" data-direction="-1">-</button><strong>${item.qty}</strong><button type="button" data-pos-qty="${item.id}" data-direction="1">+</button></span>
      <span class="pos-cart-row__total">${formatCurrency(item.price * item.qty)} <button type="button" data-pos-remove="${item.id}">Remove</button></span>
    </div>
  `;
}

function renderRecordPage(config, query = "") {
  const records = getPageRecords(pageKey);
  const filtered = !query ? records : records.filter((record) => Object.values(record).join(" ").toLowerCase().includes(query.toLowerCase()));
  const selected = getSelectedRecord(pageKey, filtered);
  const contextStrip = pageKey === "tools" && state.posContext ? `<article class="panel context-panel"><div class="panel__header"><span class="panel__eyebrow">POS handoff</span><h4>${escapeHtml(state.posContext.label)}</h4><p class="panel__copy">${escapeHtml(state.posContext.meta)}</p></div></article>` : "";

  return `
    <section class="launch-header">
      <div><p class="eyebrow">${config.banner}</p><h3>${config.title}</h3></div>
      <div class="launch-header__actions"><button class="primary-button" type="button" data-record-new>${config.actions[0][0]}</button><button class="secondary-button" type="button" data-record-clear>${config.actions[1][0]}</button></div>
    </section>
    ${contextStrip}
    <section class="record-shell">
      <article class="panel record-panel">
        <div class="panel__header"><span class="panel__eyebrow">Saved ${config.entity}s</span><h4>${filtered.length} item${filtered.length === 1 ? "" : "s"}</h4></div>
        <div class="record-list">${filtered.length ? filtered.map((record) => renderRecordCard(record, config, selected?.id === record.id)).join("") : `<div class="empty-inline">No ${config.entity}s yet. Add your first one.</div>`}</div>
      </article>
      <article class="panel form-panel">
        <div class="panel__header"><span class="panel__eyebrow">${selected ? "Edit entry" : "New entry"}</span><h4>${selected ? "Update saved information" : `Create ${config.entity}`}</h4></div>
        <form class="data-form" data-record-form>
          <input type="hidden" name="id" value="${selected?.id || ""}" />
          ${config.fields.map((field) => renderField(field, selected?.[field.name] || "")).join("")}
          <div class="form-actions">
            <button class="primary-button" type="submit">${selected ? "Save changes" : `Save ${config.entity}`}</button>
            <button class="secondary-button" type="button" data-record-reset>New blank form</button>
            ${selected ? `<button class="danger-button" type="button" data-record-delete="${selected.id}">Delete</button>` : ""}
          </div>
        </form>
      </article>
    </section>
  `;
}

function renderRecordCard(record, config, selected) {
  const preview = config.preview(record);
  return `<button class="record-card ${selected ? "is-selected" : ""}" type="button" data-record-select="${record.id}"><div><strong>${escapeHtml(preview.title)}</strong><p>${escapeHtml(preview.meta)}</p></div><span class="status-pill">${escapeHtml(preview.badge)}</span></button>`;
}

function renderField(field, value) {
  if (field.type === "textarea") return `<label><span>${field.label}</span><textarea name="${field.name}" rows="4">${escapeHtml(value)}</textarea></label>`;
  if (field.type === "select") return `<label><span>${field.label}</span><select name="${field.name}">${field.options.map((option) => `<option value="${option}" ${value === option ? "selected" : ""}>${option}</option>`).join("")}</select></label>`;
  return `<label><span>${field.label}</span><input name="${field.name}" type="${field.type}" value="${escapeHtml(value)}" ${field.required ? "required" : ""} /></label>`;
}

function renderSchedules(query = "") {
  const area = getActiveArea();
  const entries = getScheduleEntries(area.key, state.scheduleDate, query);
  const selected = entries.find((entry) => entry.id === state.selectedScheduleId) || null;
  const slots = buildTimeSlots();

  return `
    <section class="launch-header">
      <div><p class="eyebrow">Schedules</p><h3>Daily calendar workspace</h3></div>
      <div class="launch-header__actions"><button class="primary-button" type="button" data-schedule-new>New booking</button><button class="secondary-button" type="button">${formatDisplayDate(state.scheduleDate)}</button></div>
    </section>
    <section class="schedule-shell">
      <aside class="calendar-panel">
        <div class="calendar-panel__header">
          <button class="icon-button" type="button" data-month-shift="-1" aria-label="Previous month">&#8592;</button>
          <h4>${formatMonthLabel(state.visibleMonth)}</h4>
          <button class="icon-button" type="button" data-month-shift="1" aria-label="Next month">&#8594;</button>
        </div>
        <div class="mini-calendar">${renderMiniCalendar(state.visibleMonth)}</div>
        <div class="schedule-sidecard">
          <span class="panel__eyebrow">Selected day</span>
          <h4>${formatDisplayDate(state.scheduleDate)}</h4>
          <p>${entries.length} booking${entries.length === 1 ? "" : "s"} scheduled in ${area.label.toLowerCase()}.</p>
          ${selected ? `<div class="schedule-focus"><strong>${escapeHtml(selected.title)}</strong><span>${escapeHtml(selected.resource)} | ${escapeHtml(selected.start)} - ${escapeHtml(selected.end)}</span></div>` : ""}
        </div>
        <div class="agenda-list">
          <div class="panel__header"><span class="panel__eyebrow">Day bookings</span><h4>${entries.length ? "Click any booking to edit" : "No bookings yet"}</h4></div>
          ${renderScheduleAgenda(entries)}
        </div>
      </aside>
      <section class="schedule-panel">
        <div class="schedule-tabs">${SCHEDULE_AREAS.map((entry) => `<button class="schedule-tab ${entry.key === area.key ? "is-active" : ""}" data-area="${entry.key}" type="button">${entry.label}</button>`).join("")}</div>
        <div class="schedule-legend"><span class="legend-chip legend-chip--open">Open booking</span><span class="legend-chip legend-chip--class">Instruction</span><span class="legend-chip legend-chip--hold">Reserved</span></div>
        <div class="day-view">
          <div class="day-view__header">
            <div class="day-view__corner">${formatDisplayDate(state.scheduleDate)}</div>
            <div class="day-view__resource-head" style="grid-template-columns: repeat(${area.resources.length}, minmax(0, 1fr));">${area.resources.map((resource) => `<span>${resource}</span>`).join("")}</div>
          </div>
          <div class="day-view__content">
            <div class="time-rail">${slots.map((slot) => `<div class="time-rail__label ${slot.minutes % 60 === 0 ? "is-hour" : ""}">${slot.label}</div>`).join("")}</div>
            <div class="day-grid" style="--resources:${area.resources.length}; --slots:${slots.length};">
              ${renderScheduleSlots(area, slots)}
              ${entries.map((entry) => renderScheduleEvent(entry, area, slots.length)).join("")}
            </div>
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderScheduleAgenda(entries) {
  if (!entries.length) return `<div class="empty-inline">Use New booking or click directly in the grid to place a reservation.</div>`;
  return `<div class="agenda-list__items">${entries.map((entry) => `<button class="agenda-item agenda-item--${entry.kind}" type="button" data-schedule-select="${entry.id}"><strong>${escapeHtml(entry.title)}</strong><span>${escapeHtml(entry.resource)} | ${escapeHtml(entry.start)} - ${escapeHtml(entry.end)}</span></button>`).join("")}</div>`;
}

function renderMiniCalendar(monthKey) {
  const date = new Date(`${monthKey}T00:00:00`);
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOffset = (first.getDay() + 6) % 7;
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const cells = [];

  for (let index = 0; index < startOffset; index += 1) cells.push('<span class="mini-date mini-date--blank"></span>');
  for (let day = 1; day <= last.getDate(); day += 1) {
    const value = formatDate(year, month + 1, day);
    cells.push(`<button class="mini-date ${value === state.scheduleDate ? "is-active" : ""}" type="button" data-calendar-date="${value}">${day}</button>`);
  }

  return `<div class="mini-calendar__days">${days.map((day) => `<span>${day}</span>`).join("")}</div><div class="mini-calendar__dates">${cells.join("")}</div>`;
}

function renderScheduleSlots(area, slots) {
  return slots.flatMap((slot, slotIndex) => area.resources.map((resource, resourceIndex) => `<button class="calendar-slot ${slot.minutes % 60 === 0 ? "is-hour" : ""}" type="button" data-slot-resource="${resource}" data-slot-start="${slot.value}" style="grid-column:${resourceIndex + 1}; grid-row:${slotIndex + 1};" aria-label="Create booking for ${resource} at ${slot.label || slot.value}"></button>`)).join("");
}

function renderScheduleEvent(entry, area, slotCount) {
  const resourceIndex = area.resources.indexOf(entry.resource);
  const startSlot = Math.max(0, Math.floor((timeToMinutes(entry.start) - DAY_START_MINUTES) / SLOT_MINUTES));
  const endSlot = Math.min(slotCount, Math.ceil((timeToMinutes(entry.end) - DAY_START_MINUTES) / SLOT_MINUTES));
  const rowEnd = Math.max(startSlot + 1, endSlot);
  if (resourceIndex === -1) return "";

  return `<button class="calendar-event calendar-event--${entry.kind || "open"} ${state.selectedScheduleId === entry.id ? "is-selected" : ""}" type="button" data-schedule-select="${entry.id}" style="grid-column:${resourceIndex + 1}; grid-row:${startSlot + 1} / ${rowEnd + 1};"><strong>${escapeHtml(entry.title)}</strong><span>${escapeHtml(entry.start)} - ${escapeHtml(entry.end)}</span><small>${escapeHtml(entry.resource)}</small></button>`;
}

function renderScheduleModal() {
  if (!state.scheduleModalOpen) return "";
  const draft = state.scheduleDraft;
  const area = getAreaByKey(draft.area);

  return `
    <div class="utility-modal utility-modal--active" data-modal-surface="schedule">
      <div class="utility-modal__panel utility-modal__panel--wide">
        <div class="utility-modal__header">
          <div><p class="eyebrow">${draft.id ? "Edit booking" : "New booking"}</p><h3>${draft.id ? "Update the reservation" : "Create a reservation"}</h3></div>
          <button class="icon-button" type="button" data-schedule-close aria-label="Close">&times;</button>
        </div>
        <form class="data-form" data-schedule-modal-form>
          <input type="hidden" name="id" value="${draft.id || ""}" />
          <label><span>Booking title</span><input name="title" type="text" value="${escapeHtml(draft.title)}" placeholder="Private lesson, court hold, open play" required /></label>
          <div class="field-row">
            <label><span>Area</span><select name="area">${SCHEDULE_AREAS.map((entry) => `<option value="${entry.key}" ${entry.key === draft.area ? "selected" : ""}>${entry.label}</option>`).join("")}</select></label>
            <label><span>Type</span><select name="kind">${[["open", "Open booking"], ["class", "Instruction"], ["hold", "Reserved"]].map(([value, label]) => `<option value="${value}" ${value === draft.kind ? "selected" : ""}>${label}</option>`).join("")}</select></label>
          </div>
          <div class="field-row">
            <label><span>Resource</span><select name="resource">${area.resources.map((resource) => `<option value="${resource}" ${resource === draft.resource ? "selected" : ""}>${resource}</option>`).join("")}</select></label>
            <label><span>Date</span><input name="date" type="date" value="${escapeHtml(draft.date)}" required /></label>
          </div>
          <div class="field-row">
            <label><span>Start</span><input name="start" type="time" step="1800" value="${escapeHtml(draft.start)}" required /></label>
            <label><span>End</span><input name="end" type="time" step="1800" value="${escapeHtml(draft.end)}" required /></label>
          </div>
          <label><span>Notes</span><textarea name="notes" rows="4">${escapeHtml(draft.notes || "")}</textarea></label>
          <div class="form-actions">
            <button class="primary-button" type="submit">${draft.id ? "Save booking" : "Add booking"}</button>
            <button class="secondary-button" type="button" data-schedule-close>Cancel</button>
            ${draft.id ? `<button class="danger-button" type="button" data-schedule-delete="${draft.id}">Delete</button>` : ""}
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderTileEditorModal() {
  if (!state.editingTileId) return "";
  const tile = state.overviewTiles.find((entry) => entry.id === state.editingTileId);
  if (!tile) return "";

  return `
    <div class="utility-modal utility-modal--active" data-modal-surface="tile">
      <div class="utility-modal__panel">
        <div class="utility-modal__header">
          <div><p class="eyebrow">Module editor</p><h3>Edit tile details</h3></div>
          <button class="icon-button" type="button" data-tile-close aria-label="Close">&times;</button>
        </div>
        <form class="data-form" data-tile-form>
          <input type="hidden" name="id" value="${tile.id}" />
          <label><span>Title</span><input name="title" type="text" value="${escapeHtml(tile.title)}" required /></label>
          <div class="field-row">
            <label><span>Color</span><input name="color" type="color" value="${escapeHtml(tile.color)}" /></label>
            <label class="checkbox-panel"><span>Visible</span><input name="visible" type="checkbox" ${tile.visible ? "checked" : ""} /></label>
          </div>
          <label><span>Link</span><input name="href" list="tile-link-options" type="text" value="${escapeHtml(tile.href)}" required /><datalist id="tile-link-options">${LINK_OPTIONS.map((option) => `<option value="${option.href}">${option.label}</option>`).join("")}</datalist></label>
          <div class="form-actions"><button class="primary-button" type="submit">Save tile</button><button class="secondary-button" type="button" data-tile-close>Cancel</button></div>
        </form>
      </div>
    </div>
  `;
}

function renderAuthModal() {
  return `
    <div class="auth-modal" aria-hidden="true">
      <div class="auth-modal__panel">
        <div class="auth-brand">
          <img class="auth-brand__logo" src="./cedardale.png" alt="Cedardale logo" />
          <div>
            <p class="eyebrow">Staff sign in</p>
            <h3>Enter the club workspace</h3>
          </div>
        </div>
        <p class="auth-copy">Sign in to continue. You can stay logged in through the end of today on this device.</p>
        <form id="sign-in-form" class="auth-form">
          <label><span>Name</span><input id="name-input" name="displayName" type="text" placeholder="Staff name" required /></label>
          <label><span>Password</span><input name="password" type="password" placeholder="Password" required /></label>
          <label><span>Location</span><select name="location"><option>Cedardale - Courtside Operations</option><option>Cedardale - Fitness Desk</option><option>Cedardale - Event Office</option></select></label>
          <label class="checkbox-row"><input type="checkbox" name="rememberToday" /><span>Stay logged in for the day</span></label>
          <button type="submit" class="primary-button auth-submit">Sign in</button>
        </form>
      </div>
    </div>
  `;
}

function renderMemberCameraModal() {
  if (pageKey !== "members") return "";
  return `
    <div class="utility-modal member-camera-modal" data-member-camera-modal aria-hidden="true">
      <div class="utility-modal__panel utility-modal__panel--camera">
        <div class="utility-modal__header">
          <div><p class="eyebrow">Member photo</p><h3>Capture with camera</h3></div>
          <button class="icon-button" type="button" data-camera-close aria-label="Close">&times;</button>
        </div>
        <div class="member-camera">
          <div class="member-camera__stage">
            <video class="member-camera__video" data-member-camera-video autoplay playsinline muted></video>
            <div class="member-camera__empty" data-member-camera-empty>Allow camera access to preview the member photo here.</div>
          </div>
          <p class="member-camera__error" data-member-camera-error></p>
          <div class="form-actions member-camera__actions">
            <button class="primary-button" type="button" data-camera-capture>Use this photo</button>
            <button class="secondary-button" type="button" data-camera-upload>Upload instead</button>
            <button class="ghost-button" type="button" data-camera-close>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindSearch() {
  const input = document.querySelector("#page-search");
  input.addEventListener("input", (event) => {
    state.globalMemberQuery = event.target.value.trim();
    rerenderApp();
    const next = document.querySelector("#page-search");
    if (next) {
      next.focus();
      next.setSelectionRange(state.globalMemberQuery.length, state.globalMemberQuery.length);
    }
  });

  document.querySelectorAll("[data-member-lookup-select]").forEach((button) => {
    button.addEventListener("click", () => {
      handleGlobalMemberSelection(button.dataset.memberLookupSelect);
    });
  });
}

function bindTopbarInteractions() {
  document.querySelector("#alerts-toggle")?.addEventListener("click", () => {
    state.alertMenuOpen = !state.alertMenuOpen;
    rerenderApp();
  });

  document.querySelectorAll("[data-alert-dismiss]").forEach((button) => {
    button.addEventListener("click", () => {
      const alert = state.alerts.find((entry) => entry.id === button.dataset.alertDismiss);
      if (!alert) return;
      alert.active = false;
      saveStorage(STORAGE_KEYS.alerts, state.alerts);
      rerenderApp();
    });
  });

  document.querySelectorAll("[data-alert-delete-global]").forEach((button) => {
    button.addEventListener("click", () => {
      state.alerts = state.alerts.filter((entry) => entry.id !== button.dataset.alertDeleteGlobal);
      saveStorage(STORAGE_KEYS.alerts, state.alerts);
      rerenderApp();
    });
  });
}

function bindPageInteractions() {
  if (pageKey === "overview") return bindOverviewInteractions();
  if (pageKey === "checkin") return bindCheckinInteractions();
  if (pageKey === "schedules") return bindScheduleInteractions();
  if (pageKey === "communications") return bindOutreachInteractions();
  if (pageKey === "members") return bindMembersInteractions();
  if (pageKey === "tools") return bindPOSInteractions();
  bindRecordInteractions();
}

function bindOverviewInteractions() {
  document.querySelector("#layout-toggle")?.addEventListener("click", () => {
    state.layoutEditorOpen = !state.layoutEditorOpen;
    rerenderFrame();
  });

  document.querySelectorAll("[data-pos-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const caret = input.selectionStart ?? input.value.length;
      state.posLookupQuery = input.value;
      rerenderFrame();
      const nextInput = document.querySelector("[data-pos-input]");
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(caret, caret);
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const firstResult = getPosResults(state.posLookupQuery)[0];
      if (!firstResult) return;
      window.location.href = getPOSSelectionHref(firstResult);
    });
  });

  document.querySelectorAll("[data-pos-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const result = getPosResults(state.posLookupQuery).find((entry) => entry.key === button.dataset.posSelect);
      if (!result) return;
      openPOSSelection(result);
    });
  });

  document.querySelector("[data-pos-guest]")?.addEventListener("click", (event) => {
    event.preventDefault();
    openGuestPOS();
  });

  document.querySelector("[data-pos-clear]")?.addEventListener("click", () => {
    state.posContext = null;
    state.posLookupQuery = "";
    localStorage.removeItem(STORAGE_KEYS.posContext);
    rerenderFrame();
  });

  document.querySelectorAll("[data-tile-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editingTileId = button.dataset.tileEdit;
      rerenderApp();
    });
  });

  if (!state.layoutEditorOpen) return;

  document.querySelectorAll("[data-tile-id]").forEach((tile) => {
    tile.addEventListener("dragstart", (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", tile.dataset.tileId);
      tile.classList.add("is-dragging");
    });

    tile.addEventListener("dragend", () => {
      tile.classList.remove("is-dragging");
    });

    tile.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });

    tile.addEventListener("drop", (event) => {
      event.preventDefault();
      const dragId = event.dataTransfer.getData("text/plain");
      const dropId = tile.dataset.tileId;
      if (!dragId || dragId === dropId) return;
      moveTile(dragId, dropId);
    });
  });
}

function bindOutreachInteractions() {
  document.querySelector("[data-alert-new]")?.addEventListener("click", () => {
    state.selectedAlertId = null;
    rerenderFrame();
  });

  document.querySelector("[data-alert-clear]")?.addEventListener("click", () => {
    state.selectedAlertId = null;
    rerenderFrame();
  });

  document.querySelectorAll("[data-alert-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedAlertId = button.dataset.alertSelect;
      rerenderFrame();
    });
  });

  document.querySelector("[data-alert-reset]")?.addEventListener("click", () => {
    state.selectedAlertId = null;
    rerenderFrame();
  });

  document.querySelector("[data-alert-delete]")?.addEventListener("click", () => {
    const id = document.querySelector("[data-alert-delete]").dataset.alertDelete;
    state.alerts = state.alerts.filter((entry) => entry.id !== id);
    state.selectedAlertId = null;
    saveStorage(STORAGE_KEYS.alerts, state.alerts);
    rerenderApp();
  });

  document.querySelector("[data-alert-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const existing = state.alerts.find((entry) => entry.id === data.id);
    const alert = normalizeAlert({
      id: data.id || createId(),
      title: data.title,
      message: data.message,
      priority: data.priority,
      active: form.active.checked,
      createdAt: existing?.createdAt || new Date().toISOString(),
    });

    state.alerts = upsertRecord(state.alerts, alert).sort(sortByCreatedAtDesc);
    state.selectedAlertId = alert.id;
    saveStorage(STORAGE_KEYS.alerts, state.alerts);
    rerenderApp();
  });
}

function bindMembersInteractions() {
  document.querySelector("[data-record-new]")?.addEventListener("click", () => {
    state.selectedRecordId = null;
    state.memberProfileOpen = false;
    state.memberDraft = null;
    localStorage.removeItem(STORAGE_KEYS.memberDraft);
    rerenderFrame();
  });

  document.querySelector("[data-record-clear]")?.addEventListener("click", () => {
    state.selectedRecordId = null;
    state.memberProfileOpen = false;
    state.memberDraft = null;
    localStorage.removeItem(STORAGE_KEYS.memberDraft);
    rerenderFrame();
  });

  document.querySelectorAll("[data-record-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRecordId = button.dataset.recordSelect;
      state.memberProfileOpen = true;
      state.globalMemberQuery = "";
      rerenderApp();
    });
  });

  document.querySelectorAll("[data-member-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      state.memberProfileOpen = false;
      rerenderFrame();
    });
  });

  document.querySelector("[data-record-reset]")?.addEventListener("click", () => {
    state.selectedRecordId = null;
    state.memberProfileOpen = false;
    state.memberDraft = null;
    localStorage.removeItem(STORAGE_KEYS.memberDraft);
    rerenderFrame();
  });

  document.querySelector("[data-record-delete]")?.addEventListener("click", async () => {
    const id = document.querySelector("[data-record-delete]").dataset.recordDelete;
    state.records.members = state.records.members.filter((record) => record.id !== id);
    await deleteMemberPhoto(id);
    if (state.posContext?.memberId === id) {
      state.posContext = null;
      localStorage.removeItem(STORAGE_KEYS.posContext);
    }
    state.selectedRecordId = null;
    state.memberProfileOpen = false;
    state.memberDraft = null;
    localStorage.removeItem(STORAGE_KEYS.memberDraft);
    saveStorage(STORAGE_KEYS.records, state.records);
    rerenderApp();
  });

  document.querySelector("[data-member-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const id = data.id || createId();
    const photoFile = form.querySelector('[name="photoFile"]')?.files?.[0];
    const uploadedPhoto = photoFile ? await fileToOptimizedDataUrl(photoFile) : "";
    const finalPhoto = uploadedPhoto || data.existingPhoto || state.memberDraft?.photo || "";
    const record = normalizeMemberRecord({
      ...data,
      id,
      photo: "",
    });
    await saveMemberPhoto(id, finalPhoto);
    state.records.members = upsertRecord(state.records.members, record);
    if (state.posContext?.memberId === id) {
      state.posContext = {
        ...state.posContext,
        label: getMemberDisplayName(record),
        photo: finalPhoto || "",
      };
      saveStorage(STORAGE_KEYS.posContext, state.posContext);
    }
    state.globalMemberQuery = "";
    state.selectedRecordId = id;
    state.memberProfileOpen = true;
    state.memberDraft = null;
    localStorage.removeItem(STORAGE_KEYS.memberDraft);
    saveStorage(STORAGE_KEYS.records, state.records);
    rerenderApp();
  });

  document.querySelector("[data-member-photo-trigger]")?.addEventListener("click", async () => {
    await openMemberCameraModal();
  });

  document.querySelector('[name="photoFile"]')?.addEventListener("change", async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const preview = await fileToOptimizedDataUrl(file);
    await applyMemberPhoto(preview);
  });
}

function bindPOSInteractions() {
  document.querySelector("[data-pos-device]")?.addEventListener("change", (event) => {
    state.posDevice = event.target.value;
  });

  document.querySelector("[data-pos-member-query]")?.addEventListener("input", (event) => {
    state.posMemberQuery = event.target.value;
    rerenderFrame();
    const next = document.querySelector("[data-pos-member-query]");
    if (next) {
      next.focus();
      next.setSelectionRange(state.posMemberQuery.length, state.posMemberQuery.length);
    }
  });

  document.querySelector("[data-pos-member-query]")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const firstResult = getPosResults(state.posMemberQuery)[0];
    if (!firstResult) return;
    attachPOSMember(firstResult);
  });

  document.querySelectorAll("[data-pos-member-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const result = getPosResults(state.posMemberQuery).find((entry) => entry.key === button.dataset.posMemberSelect);
      if (!result) return;
      attachPOSMember(result);
    });
  });

  document.querySelector("[data-pos-clear-member]")?.addEventListener("click", () => {
    clearPOSContext();
  });

  document.querySelector("[data-pos-item-query]")?.addEventListener("input", (event) => {
    state.posItemQuery = event.target.value;
    rerenderFrame();
    const next = document.querySelector("[data-pos-item-query]");
    if (next) {
      next.focus();
      next.setSelectionRange(state.posItemQuery.length, state.posItemQuery.length);
    }
  });

  document.querySelector("[data-pos-item-scan]")?.addEventListener("click", () => {
    const exact = POS_CATALOG.find((item) => item.sku.toLowerCase() === state.posItemQuery.trim().toLowerCase());
    if (exact) {
      addCatalogItemToCart(exact.sku);
      return;
    }
    const first = getCatalogMatches(state.posItemQuery)[0];
    if (first) addCatalogItemToCart(first.sku);
  });

  document.querySelectorAll("[data-pos-item-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addCatalogItemToCart(button.dataset.posItemAdd);
    });
  });

  document.querySelectorAll("[data-pos-qty]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.direction);
      state.posCart = state.posCart
        .map((item) => item.id === button.dataset.posQty ? { ...item, qty: Math.max(1, item.qty + direction) } : item)
        .filter((item) => item.qty > 0);
      saveStorage(STORAGE_KEYS.posCart, state.posCart);
      rerenderFrame();
    });
  });

  document.querySelectorAll("[data-pos-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      state.posCart = state.posCart.filter((item) => item.id !== button.dataset.posRemove);
      saveStorage(STORAGE_KEYS.posCart, state.posCart);
      rerenderFrame();
    });
  });

  document.querySelector("[data-pos-clear-cart]")?.addEventListener("click", () => {
    state.posCart = [];
    state.posItemQuery = "";
    saveStorage(STORAGE_KEYS.posCart, state.posCart);
    rerenderFrame();
  });

  document.querySelector("[data-pos-cancel]")?.addEventListener("click", () => {
    state.posCart = [];
    state.posContext = null;
    state.posMemberQuery = "";
    state.posItemQuery = "";
    saveStorage(STORAGE_KEYS.posCart, state.posCart);
    localStorage.removeItem(STORAGE_KEYS.posContext);
    rerenderFrame();
  });

  document.querySelector("[data-pos-pay]")?.addEventListener("click", () => {
    if (!state.posCart.length) {
      window.alert("Add at least one item to the cart before taking payment.");
      return;
    }
    window.alert(`Payment captured in ${state.posDevice.replaceAll("-", " ")} mode. Connect a live processor SDK such as Square to complete real payment handling.`);
    state.posCart = [];
    saveStorage(STORAGE_KEYS.posCart, state.posCart);
    rerenderFrame();
  });
}

function bindCheckinInteractions() {
  document.querySelector("[data-checkin-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("[data-checkin-input]");
    const value = String(input?.value || "").trim();
    if (!value) return;
    processCheckinScan(value);
  });
}

function bindRecordInteractions() {
  const form = document.querySelector("[data-record-form]");

  document.querySelector("[data-record-new]")?.addEventListener("click", () => {
    state.selectedRecordId = null;
    rerenderFrame();
  });

  document.querySelector("[data-record-clear]")?.addEventListener("click", () => {
    state.selectedRecordId = null;
    rerenderFrame();
  });

  document.querySelectorAll("[data-record-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRecordId = button.dataset.recordSelect;
      rerenderFrame();
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const id = data.id || createId();
    state.records[pageKey] = upsertRecord(getPageRecords(pageKey), { ...data, id });
    state.selectedRecordId = id;
    saveStorage(STORAGE_KEYS.records, state.records);
    rerenderFrame();
  });

  document.querySelector("[data-record-reset]")?.addEventListener("click", () => {
    state.selectedRecordId = null;
    rerenderFrame();
  });

  document.querySelector("[data-record-delete]")?.addEventListener("click", () => {
    const id = document.querySelector("[data-record-delete]").dataset.recordDelete;
    state.records[pageKey] = getPageRecords(pageKey).filter((record) => record.id !== id);
    state.selectedRecordId = null;
    saveStorage(STORAGE_KEYS.records, state.records);
    rerenderFrame();
  });
}

function bindScheduleInteractions() {
  document.querySelectorAll("[data-area]").forEach((button) => {
    button.addEventListener("click", () => {
      state.scheduleArea = button.dataset.area;
      state.selectedScheduleId = null;
      rerenderFrame();
    });
  });

  document.querySelectorAll("[data-calendar-date]").forEach((button) => {
    button.addEventListener("click", () => {
      state.scheduleDate = button.dataset.calendarDate;
      state.visibleMonth = startOfMonth(button.dataset.calendarDate);
      state.selectedScheduleId = null;
      rerenderFrame();
    });
  });

  document.querySelectorAll("[data-month-shift]").forEach((button) => {
    button.addEventListener("click", () => {
      state.visibleMonth = shiftMonth(state.visibleMonth, Number(button.dataset.monthShift));
      rerenderFrame();
    });
  });

  document.querySelector("[data-schedule-new]")?.addEventListener("click", () => {
    openScheduleModal(createScheduleDraft({ area: state.scheduleArea, date: state.scheduleDate }));
  });

  document.querySelectorAll("[data-slot-resource]").forEach((button) => {
    button.addEventListener("click", () => {
      const start = button.dataset.slotStart;
      openScheduleModal(createScheduleDraft({
        area: state.scheduleArea,
        resource: button.dataset.slotResource,
        date: state.scheduleDate,
        start,
        end: minutesToTime(Math.min(DAY_END_MINUTES, timeToMinutes(start) + SLOT_MINUTES)),
      }));
    });
  });

  document.querySelectorAll("[data-schedule-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = state.scheduleEntries.find((item) => item.id === button.dataset.scheduleSelect);
      if (!entry) return;
      openScheduleModal(entry);
    });
  });
}

function bindModalInteractions() {
  document.querySelectorAll("[data-camera-close]").forEach((button) => {
    button.addEventListener("click", () => {
      closeMemberCameraModal();
    });
  });

  document.querySelector("[data-camera-capture]")?.addEventListener("click", () => {
    captureMemberPhoto();
  });

  document.querySelector("[data-camera-upload]")?.addEventListener("click", () => {
    closeMemberCameraModal();
    document.querySelector('[name="photoFile"]')?.click();
  });

  document.querySelectorAll("[data-tile-close]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editingTileId = null;
      rerenderApp();
    });
  });

  document.querySelector("[data-tile-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const tile = state.overviewTiles.find((entry) => entry.id === data.id);
    if (!tile) return;
    tile.title = String(data.title || "").trim() || tile.title;
    tile.color = normalizeColor(String(data.color || tile.color));
    tile.href = sanitizeHref(String(data.href || tile.href));
    tile.visible = form.visible.checked;
    state.editingTileId = null;
    saveStorage(STORAGE_KEYS.overview, state.overviewTiles);
    rerenderApp();
  });

  document.querySelectorAll("[data-schedule-close]").forEach((button) => {
    button.addEventListener("click", () => {
      closeScheduleModal();
    });
  });

  const scheduleForm = document.querySelector("[data-schedule-modal-form]");

  scheduleForm?.querySelector('[name="area"]')?.addEventListener("change", () => {
    const area = getAreaByKey(scheduleForm.area.value);
    const currentValues = Object.fromEntries(new FormData(scheduleForm).entries());
    state.scheduleDraft = normalizeScheduleEntry({
      ...currentValues,
      kind: currentValues.kind || "open",
      area: area.key,
      resource: area.resources.includes(currentValues.resource) ? currentValues.resource : area.resources[0],
      notes: currentValues.notes || "",
    });
    rerenderApp();
  });

  scheduleForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(scheduleForm).entries());
    const entry = normalizeScheduleEntry({ id: data.id || createId(), title: data.title, kind: data.kind, area: data.area, resource: data.resource, date: data.date, start: data.start, end: data.end, notes: data.notes || "" });

    if (timeToMinutes(entry.end) <= timeToMinutes(entry.start)) {
      window.alert("End time must be after start time.");
      return;
    }

    if (hasScheduleConflict(entry)) {
      window.alert("That resource already has a booking during this time. Adjust the court or the time range.");
      return;
    }

    state.scheduleEntries = upsertRecord(state.scheduleEntries, entry).map(normalizeScheduleEntry).sort(sortScheduleEntries);
    state.selectedScheduleId = entry.id;
    state.scheduleArea = entry.area;
    state.scheduleDate = entry.date;
    state.visibleMonth = startOfMonth(entry.date);
    saveStorage(STORAGE_KEYS.schedule, state.scheduleEntries);
    closeScheduleModal();
  });

  document.querySelector("[data-schedule-delete]")?.addEventListener("click", () => {
    const id = document.querySelector("[data-schedule-delete]").dataset.scheduleDelete;
    state.scheduleEntries = state.scheduleEntries.filter((entry) => entry.id !== id);
    state.selectedScheduleId = null;
    saveStorage(STORAGE_KEYS.schedule, state.scheduleEntries);
    closeScheduleModal();
  });
}

function bindAuth() {
  const form = document.querySelector("#sign-in-form");
  const signOutButton = document.querySelector("#sign-out-button");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("displayName") || "").trim();
    if (!name) return;
    sessionStorage.setItem(STORAGE_KEYS.authSession, "true");
    localStorage.setItem(STORAGE_KEYS.authName, name);
    if (data.get("rememberToday") === "on") localStorage.setItem(STORAGE_KEYS.authDay, todayKey());
    else localStorage.removeItem(STORAGE_KEYS.authDay);
    state.alertMenuOpen = false;
    document.body.classList.remove("is-locked");
    document.querySelector("#profile-chip").textContent = getInitials(name);
  });

  signOutButton.addEventListener("click", () => {
    sessionStorage.removeItem(STORAGE_KEYS.authSession);
    localStorage.removeItem(STORAGE_KEYS.authDay);
    localStorage.removeItem(STORAGE_KEYS.authName);
    state.alertMenuOpen = false;
    document.querySelector("#profile-chip").textContent = "CF";
    document.querySelector("#sign-in-form").reset();
    document.body.classList.add("is-locked");
  });
}

function syncAuthState() {
  const remembered = localStorage.getItem(STORAGE_KEYS.authDay);
  if (remembered && remembered !== todayKey()) localStorage.removeItem(STORAGE_KEYS.authDay);
  const locked = !(sessionStorage.getItem(STORAGE_KEYS.authSession) === "true" || localStorage.getItem(STORAGE_KEYS.authDay) === todayKey());
  document.body.classList.toggle("is-locked", locked);
  document.querySelector("#profile-chip").textContent = getInitials();
  document.querySelector("#name-input").value = localStorage.getItem(STORAGE_KEYS.authName) || "";
}

function rerenderFrame() {
  document.querySelector("#page-frame").innerHTML = renderCurrentPage(state.globalMemberQuery);
  bindPageInteractions();
}

function rerenderApp() {
  render(state.globalMemberQuery);
}

function openScheduleModal(entry) {
  state.selectedScheduleId = entry.id || null;
  state.scheduleDraft = normalizeScheduleEntry(entry);
  state.scheduleModalOpen = true;
  rerenderApp();
}

function closeScheduleModal() {
  state.scheduleModalOpen = false;
  state.scheduleDraft = createScheduleDraft({ area: state.scheduleArea, date: state.scheduleDate });
  rerenderApp();
}

function openPOSSelection(result) {
  if (!result) return;
  state.posContext = {
    memberId: result.memberId || "",
    key: result.key,
    label: result.label,
    meta: result.meta,
    secondary: result.secondary || "",
    photo: result.photo || "",
    href: "tools.html",
  };
  saveStorage(STORAGE_KEYS.posContext, state.posContext);
  state.posLookupQuery = result.label;
  state.posMemberQuery = result.label;
  window.location.href = getPOSSelectionHref(result);
}

function attachPOSMember(result) {
  if (!result) return;
  state.posContext = {
    memberId: result.memberId || "",
    key: result.key,
    label: result.label,
    meta: result.meta,
    secondary: result.secondary || "",
    photo: result.photo || "",
  };
  saveStorage(STORAGE_KEYS.posContext, state.posContext);
  state.posMemberQuery = result.label;
  rerenderFrame();
}

function clearPOSContext() {
  state.posContext = null;
  state.posLookupQuery = "";
  state.posMemberQuery = "";
  localStorage.removeItem(STORAGE_KEYS.posContext);
  rerenderFrame();
}

function openGuestPOS() {
  state.posContext = {
    memberId: "",
    key: "guest",
    label: "Guest checkout",
    meta: "Walk-in guest",
    secondary: "",
    photo: "",
    href: "tools.html",
  };
  state.posLookupQuery = "";
  state.posMemberQuery = "";
  saveStorage(STORAGE_KEYS.posContext, state.posContext);
  window.location.href = "tools.html?guest=1";
}

function getPOSSelectionHref(result) {
  if (!result) return "tools.html";
  if (result.memberId) return `tools.html?member=${encodeURIComponent(result.memberId)}`;
  if (result.key === "guest") return "tools.html?guest=1";
  return "tools.html";
}

function applyPOSRouteIntent() {
  const memberId = urlParams.get("member");
  const guest = urlParams.get("guest");
  if (guest === "1") {
    state.posContext = {
      memberId: "",
      key: "guest",
      label: "Guest checkout",
      meta: "Walk-in guest",
      secondary: "",
      photo: "",
    };
    saveStorage(STORAGE_KEYS.posContext, state.posContext);
    return;
  }

  if (!memberId) return;
  const member = state.records.members.find((entry) => entry.id === memberId);
  if (!member) return;
  state.posContext = {
    memberId: member.id,
    key: `member:${member.id}`,
    label: getMemberDisplayName(member),
    meta: [member.planType, member.memberId].filter(Boolean).join(" | "),
    secondary: formatMemberAge(member.dob) || "",
    photo: getMemberPhoto(member),
  };
  saveStorage(STORAGE_KEYS.posContext, state.posContext);
}

async function openMemberCameraModal() {
  const modal = document.querySelector("[data-member-camera-modal]");
  if (!modal) return;
  const video = modal.querySelector("[data-member-camera-video]");
  const error = modal.querySelector("[data-member-camera-error]");
  const empty = modal.querySelector("[data-member-camera-empty]");
  modal.classList.add("utility-modal--active");
  modal.setAttribute("aria-hidden", "false");
  if (error) error.textContent = "";
  if (empty) empty.hidden = false;
  stopMemberCameraStream();

  if (!navigator.mediaDevices?.getUserMedia) {
    if (error) error.textContent = "This browser does not support direct camera capture here. Use Upload instead.";
    return;
  }

  if (!window.isSecureContext) {
    if (error) error.textContent = "Camera capture requires this app to run from localhost or HTTPS so the browser can grant permission.";
    return;
  }

  try {
    memberCameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    if (!video) return;
    video.srcObject = memberCameraStream;
    await video.play();
    if (empty) empty.hidden = true;
  } catch (errorValue) {
    if (error) error.textContent = "Camera permission was blocked or unavailable. Allow access and try again, or use Upload instead.";
    stopMemberCameraStream();
    console.error(errorValue);
  }
}

function closeMemberCameraModal() {
  const modal = document.querySelector("[data-member-camera-modal]");
  const video = modal?.querySelector("[data-member-camera-video]");
  const empty = modal?.querySelector("[data-member-camera-empty]");
  if (video) video.srcObject = null;
  if (empty) empty.hidden = false;
  modal?.classList.remove("utility-modal--active");
  modal?.setAttribute("aria-hidden", "true");
  stopMemberCameraStream();
}

function stopMemberCameraStream() {
  if (!memberCameraStream) return;
  memberCameraStream.getTracks().forEach((track) => track.stop());
  memberCameraStream = null;
}

async function captureMemberPhoto() {
  const video = document.querySelector("[data-member-camera-video]");
  if (!video || !video.videoWidth || !video.videoHeight) return;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const optimizedPhoto = await optimizeImageDataUrl(canvas.toDataURL("image/jpeg", 0.9));
  await applyMemberPhoto(optimizedPhoto);
  closeMemberCameraModal();
}

async function applyMemberPhoto(photo) {
  const form = document.querySelector("[data-member-form]");
  if (!form) return;
  const existingPhoto = form.querySelector('[name="existingPhoto"]');
  const preview = form.querySelector(".member-photo-preview__visual");
  const memberId = form.querySelector('[name="id"]')?.value || "";
  if (existingPhoto) existingPhoto.value = photo || "";
  if (preview) preview.innerHTML = renderProfileVisual(photo, getPendingMemberName(), true);

  if (memberId) {
    const current = state.records.members.find((member) => member.id === memberId);
    if (current) {
      await saveMemberPhoto(memberId, photo || "");
      state.records.members = upsertRecord(state.records.members, normalizeMemberRecord({ ...current, photo: "" }));
      if (state.posContext?.memberId === memberId) {
        state.posContext = {
          ...state.posContext,
          label: getMemberDisplayName(current),
          photo: photo || "",
        };
        saveStorage(STORAGE_KEYS.posContext, state.posContext);
      }
      return;
    }
  }

  const draftMember = normalizeMemberRecord({
    ...(state.memberDraft || {}),
    id: memberId || state.memberDraft?.id || "",
    firstName: form.querySelector('[name="firstName"]')?.value || state.memberDraft?.firstName || "",
    lastName: form.querySelector('[name="lastName"]')?.value || state.memberDraft?.lastName || "",
    photo: photo || "",
  });
  state.memberDraft = draftMember;
  saveStorage(STORAGE_KEYS.memberDraft, draftMember);
}

function getPendingMemberName() {
  const form = document.querySelector("[data-member-form]");
  if (!form) return "Member";
  const firstName = form.querySelector('[name="firstName"]')?.value?.trim() || "";
  const lastName = form.querySelector('[name="lastName"]')?.value?.trim() || "";
  return `${firstName} ${lastName}`.trim() || "Member";
}

function moveTile(dragId, dropId) {
  const next = [...state.overviewTiles];
  const fromIndex = next.findIndex((entry) => entry.id === dragId);
  const toIndex = next.findIndex((entry) => entry.id === dropId);
  if (fromIndex === -1 || toIndex === -1) return;
  const [tile] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, tile);
  state.overviewTiles = next;
  saveStorage(STORAGE_KEYS.overview, state.overviewTiles);
  rerenderFrame();
}

function getPageTitle() {
  if (pageKey === "overview") return "Overview";
  if (pageKey === "checkin") return "Check In";
  if (pageKey === "schedules") return "Schedules";
  if (pageKey === "communications") return "Outreach";
  if (pageKey === "tools") return "Point of Sale";
  return PAGE_DEFS[pageKey]?.title || "ClubFlow OS";
}

function getSearchPlaceholder() {
  return "Lookup member by name, barcode, phone, or email";
}

function getPageRecords(key) { return state.records[key] || []; }
function getSelectedRecord(key, filtered) { return filtered.find((record) => record.id === state.selectedRecordId) || null; }
function getSelectedAlert(collection = state.alerts) { return collection.find((entry) => entry.id === state.selectedAlertId) || null; }
function getActiveArea() { return getAreaByKey(state.scheduleArea); }
function getAreaByKey(areaKey) { return SCHEDULE_AREAS.find((entry) => entry.key === areaKey) || SCHEDULE_AREAS[0]; }
function getActiveAlerts() { return state.alerts.filter((alert) => alert.active).sort(sortByCreatedAtDesc); }
function getActivePOSMember() { return state.posContext?.memberId ? state.records.members.find((member) => member.id === state.posContext.memberId) || null : null; }
function getMemberPhoto(member) {
  if (!member) return "";
  return state.memberPhotos[member.id] || member.photo || "";
}
function getMemberLookupResults(query) {
  const text = query.trim().toLowerCase();
  if (!text) return [];
  return state.records.members
    .filter((member) => `${member.firstName} ${member.lastName} ${member.memberId} ${member.barcodeValue} ${member.email} ${member.phone} ${member.town}`.toLowerCase().includes(text))
    .slice(0, 8);
}

function getFilteredAlerts(query = "") {
  const text = query.toLowerCase();
  return state.alerts.filter((alert) => !text || `${alert.title} ${alert.message} ${alert.priority}`.toLowerCase().includes(text)).sort(sortByCreatedAtDesc);
}

function getPosResults(query) {
  const text = query.trim().toLowerCase();
  if (!text) return [];

  const members = state.records.members
    .filter((member) => `${member.firstName} ${member.lastName} ${member.household} ${member.planType} ${member.memberId} ${member.barcodeValue} ${member.email} ${member.phone} ${member.town}`.toLowerCase().includes(text))
    .map((member) => ({
      key: `member:${member.id}`,
      memberId: member.id,
      label: getMemberDisplayName(member),
      meta: [member.planType, member.memberId, member.barcodeValue].filter(Boolean).join(" | ") || "Member profile",
      secondary: [member.town || "Town not entered", formatMemberAge(member.dob) || "Age unavailable"].join(" | "),
      href: "tools.html",
      photo: getMemberPhoto(member),
    }));

  const checkins = state.records.checkin
    .filter((entry) => `${entry.personName} ${entry.entryType} ${entry.location}`.toLowerCase().includes(text))
    .map((entry) => ({
      key: `checkin:${entry.id}`,
      label: entry.personName || "Unnamed guest",
      meta: [entry.entryType, entry.location].filter(Boolean).join(" | ") || "Check-in record",
      secondary: "Guest lookup",
      href: "tools.html",
      photo: "",
    }));

  return [...members, ...checkins].slice(0, 6);
}

function getScheduleEntries(areaKey, dateKey, query = "") {
  const text = query.toLowerCase();
  return state.scheduleEntries
    .filter((entry) => entry.area === areaKey && entry.date === dateKey)
    .filter((entry) => !text || `${entry.title} ${entry.resource} ${entry.notes}`.toLowerCase().includes(text))
    .sort(sortScheduleEntries);
}

function buildTimeSlots() {
  const slots = [];
  for (let minutes = DAY_START_MINUTES; minutes < DAY_END_MINUTES; minutes += SLOT_MINUTES) {
    slots.push({ minutes, value: minutesToTime(minutes), label: minutes % 60 === 0 ? formatHour(minutes) : "" });
  }
  return slots;
}

function getCatalogMatches(query) {
  const text = query.trim().toLowerCase();
  if (!text) return [];
  return POS_CATALOG.filter((item) => `${item.sku} ${item.department} ${item.name}`.toLowerCase().includes(text)).slice(0, 8);
}

function handleGlobalMemberSelection(memberId) {
  const member = state.records.members.find((entry) => entry.id === memberId);
  if (!member) return;
  state.globalMemberQuery = getMemberDisplayName(member);

  if (pageKey === "members") {
    state.selectedRecordId = member.id;
    state.globalMemberQuery = "";
    state.memberProfileOpen = true;
    rerenderApp();
    return;
  }

  if (pageKey === "tools") {
    state.posContext = { memberId: member.id, key: `member:${member.id}`, label: getMemberDisplayName(member), meta: [member.planType, member.memberId].filter(Boolean).join(" | "), photo: getMemberPhoto(member) };
    saveStorage(STORAGE_KEYS.posContext, state.posContext);
    rerenderApp();
    return;
  }

  if (pageKey === "checkin") {
    processCheckinMember(member);
    return;
  }

  state.selectedRecordId = member.id;
  saveStorage(STORAGE_KEYS.memberNavContext, member.id);
  window.location.href = "members.html";
}

function processCheckinScan(value) {
  const member = state.records.members.find((entry) => [entry.barcodeValue, entry.memberId].filter(Boolean).some((candidate) => candidate.toLowerCase() === value.toLowerCase()));
  if (member) {
    processCheckinMember(member);
    return;
  }

  state.checkinLastResult = { name: "Non-member", age: "", photo: "", accountStatus: "Non-member" };
  state.records.checkin = upsertRecord(state.records.checkin, { id: createId(), personName: "Non-member", entryType: "Guest", location: "Front desk", time: new Date().toISOString(), status: "Checked In", notes: `Scanned value: ${value}` });
  saveStorage(STORAGE_KEYS.records, state.records);
  rerenderFrame();
  focusCheckinInput();
}

function processCheckinMember(member) {
  const accountStatus = mapAccountStatus(member.status);
  state.checkinLastResult = {
    name: getMemberDisplayName(member),
    age: formatMemberAge(member.dob),
    photo: getMemberPhoto(member),
    accountStatus,
  };
  state.records.checkin = upsertRecord(state.records.checkin, { id: createId(), personName: getMemberDisplayName(member), entryType: "Member", location: "Front desk", time: new Date().toISOString(), status: "Checked In", notes: member.memberId || member.barcodeValue || "" });
  saveStorage(STORAGE_KEYS.records, state.records);
  rerenderFrame();
  focusCheckinInput();
}

function focusCheckinInput() {
  const input = document.querySelector("[data-checkin-input]");
  if (!input) return;
  input.value = "";
  input.focus();
}

function mapAccountStatus(status) {
  if (status === "Active") return "Active";
  if (status === "Inactive") return "Cancelled";
  return "Non-member";
}

function getPOSSubtotal() {
  return +state.posCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2);
}

function addCatalogItemToCart(sku) {
  const item = POS_CATALOG.find((entry) => entry.sku === sku);
  if (!item) return;
  const existing = state.posCart.find((entry) => entry.sku === sku);
  if (existing) {
    existing.qty += 1;
  } else {
    state.posCart = [...state.posCart, { ...item, id: createId(), qty: 1 }];
  }
  state.posItemQuery = "";
  saveStorage(STORAGE_KEYS.posCart, state.posCart);
  rerenderFrame();
}

function hasScheduleConflict(entry) {
  return state.scheduleEntries.some((other) => other.id !== entry.id && other.area === entry.area && other.date === entry.date && other.resource === entry.resource && timeToMinutes(entry.start) < timeToMinutes(other.end) && timeToMinutes(entry.end) > timeToMinutes(other.start));
}

function upsertRecord(records, record) {
  const index = records.findIndex((entry) => entry.id === record.id);
  if (index === -1) return [...records, record];
  const copy = [...records];
  copy[index] = record;
  return copy;
}

function createScheduleDraft(overrides = {}) {
  const area = getAreaByKey(overrides.area || SCHEDULE_AREAS[0].key);
  return normalizeScheduleEntry({ id: "", title: "", kind: "open", area: area.key, resource: overrides.resource || area.resources[0], date: overrides.date || todayKey(), start: overrides.start || "08:00", end: overrides.end || "09:00", notes: "", ...overrides });
}

function normalizeScheduleEntry(entry = {}) {
  const area = getAreaByKey(entry.area || SCHEDULE_AREAS[0].key);
  const resource = area.resources.includes(entry.resource) ? entry.resource : area.resources[0];
  return { id: entry.id || "", title: entry.title || "", kind: entry.kind || eventTone(entry.title || ""), area: area.key, resource, date: entry.date || todayKey(), start: entry.start || "08:00", end: entry.end || "09:00", notes: entry.notes || "" };
}

function normalizeOverviewTile(tile, index) {
  const fallback = DEFAULT_OVERVIEW_TILES.find((entry) => entry.id === tile.id) || DEFAULT_OVERVIEW_TILES[index] || DEFAULT_OVERVIEW_TILES[0];
  const actions = tile.id === "pos"
    ? (tile.actions || fallback.actions || []).filter((action) => action !== "End of Day" && action !== "Open Cash Drawer")
    : (tile.actions || fallback.actions || []);
  return { ...fallback, ...tile, actions, color: remapLegacyTileColor(normalizeColor(tile.color || toneToColor(tile.tone) || fallback.color)), href: sanitizeHref(tile.href || fallback.href), visible: tile.visible !== false };
}

function normalizeAlert(alert = {}) {
  return { id: alert.id || createId(), title: alert.title || "", message: alert.message || "", priority: ["info", "warning", "critical"].includes(alert.priority) ? alert.priority : "info", active: typeof alert.active === "boolean" ? alert.active : true, createdAt: alert.createdAt || new Date().toISOString() };
}

function normalizeMemberRecord(record = {}) {
  const firstName = record.firstName || (record.fullName ? String(record.fullName).split(" ").slice(0, -1).join(" ") : "");
  const lastName = record.lastName || (record.fullName ? String(record.fullName).split(" ").slice(-1).join("") : "");
  return {
    id: record.id || createId(),
    firstName: firstName || "",
    lastName: lastName || "",
    dob: record.dob || "",
    email: record.email || "",
    phone: record.phone || "",
    town: record.town || record.address || "",
    billingAddress: record.billingAddress || "",
    billingTown: record.billingTown || "",
    billingState: record.billingState || "",
    billingZip: record.billingZip || "",
    planType: record.planType || record.membership || MEMBER_PLAN_OPTIONS[0],
    status: record.status || "Active",
    household: record.household || "",
    memberId: record.memberId || "",
    barcodeValue: record.barcodeValue || "",
    emergencyName: record.emergencyName || "",
    emergencyRelationship: record.emergencyRelationship || "",
    emergencyPhone: record.emergencyPhone || "",
    photo: record.photo || "",
    notes: record.notes || "",
  };
}

function createEmptyMember(seed = {}) {
  return normalizeMemberRecord(seed);
}

function getMemberDisplayName(member) {
  const name = [member.firstName, member.lastName].filter(Boolean).join(" ").trim();
  return name || "Unnamed member";
}

function getMemberAge(dob) {
  if (!dob) return "";
  const birth = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return "";
  const now = new Date();
  const ms = now.getTime() - birth.getTime();
  if (ms < 0) return "";
  return (ms / (365.2425 * 24 * 60 * 60 * 1000)).toFixed(2);
}

function formatMemberAge(dob) {
  const age = getMemberAge(dob);
  return age ? `${age} years old` : "";
}

function loadRecords() {
  const loaded = loadStorage(STORAGE_KEYS.records, {});
  return {
    members: (loaded.members || []).map(normalizeMemberRecord),
    checkin: loaded.checkin || [],
    analytics: loaded.analytics || [],
    communications: loaded.communications || [],
    tools: loaded.tools || [],
    events: loaded.events || [],
  };
}

async function hydrateMemberPhotos() {
  const storedPhotos = await loadMemberPhotos();
  let didChange = false;
  state.memberPhotos = { ...storedPhotos };
  if (Object.keys(storedPhotos).length) didChange = true;
  const inlinePhotos = state.records.members.filter((member) => member.photo && !state.memberPhotos[member.id]);
  if (!inlinePhotos.length) return didChange;

  for (const member of inlinePhotos) {
    state.memberPhotos[member.id] = member.photo;
    await saveMemberPhoto(member.id, member.photo);
    didChange = true;
  }

  state.records.members = state.records.members.map((member) => member.photo ? normalizeMemberRecord({ ...member, photo: "" }) : member);
  saveStorage(STORAGE_KEYS.records, state.records);
  return true;
}

async function loadMemberPhotos() {
  try {
    const db = await openMemberPhotoDb();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction("memberPhotos", "readonly");
      const store = transaction.objectStore("memberPhotos");
      const request = store.getAll();
      request.onsuccess = () => {
        const entries = Object.fromEntries((request.result || []).map((entry) => [entry.id, entry.photo]));
        resolve(entries);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return loadStorage(STORAGE_KEYS.memberPhotosFallback, {});
  }
}

async function saveMemberPhoto(memberId, photo) {
  if (!memberId) return;
  if (!photo) {
    await deleteMemberPhoto(memberId);
    return;
  }

  state.memberPhotos = { ...state.memberPhotos, [memberId]: photo };

  try {
    const db = await openMemberPhotoDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction("memberPhotos", "readwrite");
      const store = transaction.objectStore("memberPhotos");
      const request = store.put({ id: memberId, photo });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const fallback = loadStorage(STORAGE_KEYS.memberPhotosFallback, {});
    fallback[memberId] = photo;
    saveStorage(STORAGE_KEYS.memberPhotosFallback, fallback);
  }
}

async function deleteMemberPhoto(memberId) {
  if (!memberId) return;
  const nextPhotos = { ...state.memberPhotos };
  delete nextPhotos[memberId];
  state.memberPhotos = nextPhotos;

  try {
    const db = await openMemberPhotoDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction("memberPhotos", "readwrite");
      const store = transaction.objectStore("memberPhotos");
      const request = store.delete(memberId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const fallback = loadStorage(STORAGE_KEYS.memberPhotosFallback, {});
    delete fallback[memberId];
    saveStorage(STORAGE_KEYS.memberPhotosFallback, fallback);
  }
}

function openMemberPhotoDb() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB unavailable"));
  if (memberPhotoDbPromise) return memberPhotoDbPromise;

  memberPhotoDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open("clubflow-media", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("memberPhotos")) {
        db.createObjectStore("memberPhotos", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return memberPhotoDbPromise;
}

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function createId() { return `id-${Math.random().toString(36).slice(2, 10)}`; }
function getSearchValue() { return document.querySelector("#page-search")?.value.trim() || ""; }
function formatCurrency(value) { return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value); }

function renderProfileVisual(photo, label, large) {
  if (photo) return `<img src="${escapeHtml(photo)}" alt="${escapeHtml(label)}" class="profile-visual__image ${large ? "is-large" : ""}" />`;
  return `<div class="profile-visual__fallback ${large ? "is-large" : ""}">${escapeHtml(getInitials(label))}</div>`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function fileToOptimizedDataUrl(file) {
  const dataUrl = await readFileAsDataUrl(file);
  return optimizeImageDataUrl(dataUrl);
}

function optimizeImageDataUrl(dataUrl) {
  return new Promise((resolve) => {
    if (!dataUrl) {
      resolve("");
      return;
    }

    const image = new Image();
    image.onload = () => {
      const maxDimension = 420;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(dataUrl);
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function getInitials(name = localStorage.getItem(STORAGE_KEYS.authName) || "") {
  const cleaned = name.trim();
  return !cleaned ? "CF" : cleaned.split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "CF";
}

function todayKey() {
  const now = new Date();
  return formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function startOfMonth(dateKey) {
  const [year, month] = dateKey.split("-").map(Number);
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

function shiftMonth(dateKey, delta) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setMonth(date.getMonth() + delta);
  return formatDate(date.getFullYear(), date.getMonth() + 1, 1);
}

function formatDate(year, month, day) { return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`; }
function formatMonthLabel(dateKey) { return new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" }); }
function formatDisplayDate(dateKey) { return new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }); }
function formatTimestamp(value) { return new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
function timeToMinutes(value) { const [hours, minutes] = value.split(":").map(Number); return hours * 60 + minutes; }
function minutesToTime(total) { return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`; }

function formatHour(minutes) {
  const hours = Math.floor(minutes / 60);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalized = hours % 12 || 12;
  return `${normalized}:00 ${suffix}`;
}

function eventTone(title) {
  const value = String(title || "").toLowerCase();
  if (value.includes("lesson") || value.includes("clinic") || value.includes("class")) return "class";
  if (value.includes("hold") || value.includes("reserved")) return "hold";
  return "open";
}

function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function sanitizeHref(value) { const cleaned = String(value || "").trim(); return !cleaned ? "index.html" : (/^[A-Za-z0-9._/#-]+$/.test(cleaned) ? cleaned : "index.html"); }
function normalizeColor(color) { const cleaned = String(color || "").trim(); return /^#[0-9a-fA-F]{6}$/.test(cleaned) ? cleaned : "#000f9f"; }

function remapLegacyTileColor(color) {
  const map = {
    "#57a8dd": "#000f9f",
    "#48627e": "#2333b0",
    "#a52222": "#4054c4",
    "#56a04d": "#95c93d",
    "#696987": "#6ca623",
    "#216c9a": "#3044b8",
    "#a09893": "#7eb82d",
    "#b2c1c9": "#5569d5",
    "#4392c1": "#b1da68",
  };
  return map[color.toLowerCase()] || color;
}

function shadeHex(hex, factor) {
  const normalized = normalizeColor(hex).slice(1);
  const parts = [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16));
  const shaded = parts.map((part) => Math.max(0, Math.min(255, Math.round(part * factor))));
  return `#${shaded.map((part) => part.toString(16).padStart(2, "0")).join("")}`;
}

function toneToColor(tone) {
  const map = { sky: "#000f9f", slate: "#2333b0", brick: "#4054c4", forest: "#95c93d", plum: "#6ca623", ocean: "#3044b8", stone: "#7eb82d", fog: "#5569d5", harbor: "#b1da68" };
  return map[tone] || "#000f9f";
}

function sortScheduleEntries(a, b) { return timeToMinutes(a.start) - timeToMinutes(b.start); }
function sortByCreatedAtDesc(a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); }
