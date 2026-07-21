(function () {
  "use strict";

  const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  const REQUEST_TIMEOUT_MS = 12000;
  const DEFAULT_SYNC = {
    toolId: "owentools",
    label: "owentools",
    include: [],
    exclude: [],
    loginOnly: false
  };

  const pageConfig = { ...DEFAULT_SYNC, ...(window.OWENTOOLS_SYNC || {}) };
  const supabaseConfig = window.OWENTOOLS_SUPABASE || {};
  const configured = Boolean(
    supabaseConfig.url &&
    supabaseConfig.anonKey &&
    !String(supabaseConfig.url).includes("PASTE_") &&
    !String(supabaseConfig.anonKey).includes("PASTE_")
  );

  let client = null;
  let session = null;
  let syncReady = false;
  let suppressUpload = false;
  let pendingUploads = new Map();
  let flushTimer = 0;
  let pullTimer = 0;
  let pullInFlight = false;
  let lastPullAt = 0;
  let lastPullChangedKeys = [];
  let lastPulledValues = {};
  let realtimeChannel = null;
  let autoPullStarted = false;
  let statusEl = null;
  let menuEl = null;
  let copyEl = null;
  let recoveryMode = false;
  let manualSyncButton = null;
  let saveHistoryListEl = null;
  let quickLoadTimeEl = null;
  let saveHistoryRows = [];

  const META_KEY = `owentools-sync-meta:${pageConfig.toolId}`;
  const AUTH_STORAGE_KEY = "owentools-auth-session";
  const AUTH_STORAGE_BACKUP_KEY = "owentools-auth-session-backup";
  const EMAIL_STORAGE_KEY = "owentools-sync-email";
  const POSITION_KEY = "owentools-sync-position";
  const HARD_DENY_PATTERNS = [
    "games:",
    "games-archive:",
    "analytics-day:",
    "hrs:"
  ];
  const LOCAL_CLEANUP_DENY_PATTERNS = [
    "games:",
    "games-archive:",
    "analytics-day:",
    "hrs:"
  ];

  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;
  const authSessionMemory = new Map();
  const restoredValueMemory = new Map();
  let explicitSignOutInProgress = false;

  function matchesAny(key, patterns) {
    if (!patterns || !patterns.length) return false;
    return patterns.some((pattern) => {
      if (pattern instanceof RegExp) return pattern.test(key);
      const text = String(pattern);
      if (text.endsWith("*")) return key.startsWith(text.slice(0, -1));
      return key === text || key.startsWith(text);
    });
  }

  function shouldSyncKey(key) {
    if (pageConfig.loginOnly) return false;
    if (String(key).startsWith("owentools-sync-")) return false;
    if (isHardDeniedKey(key)) return false;
    if (!key || matchesAny(key, pageConfig.exclude)) return false;
    if (!pageConfig.include || pageConfig.include.length === 0) return true;
    return matchesAny(key, pageConfig.include);
  }

  function isHardDeniedKey(key) {
    return matchesAny(String(key || ""), HARD_DENY_PATTERNS);
  }

  function cleanupLocalDeniedKeys() {
    try {
      const keys = [];
      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index);
        if (matchesAny(String(key || ""), LOCAL_CLEANUP_DENY_PATTERNS)) keys.push(key);
      }
      keys.forEach((key) => originalRemoveItem.call(window.localStorage, key));
      if (keys.length) console.info("owentools sync removed local cache keys", keys);
    } catch (error) {
      console.warn("owentools sync local cache cleanup failed", error);
    }
  }

  function createSafeAuthStorage() {
    return {
      getItem(key) {
        try {
          const localValue = window.localStorage.getItem(key);
          if (localValue != null) return localValue;
        } catch {
          // fall through
        }
        try {
          const sessionValue = window.sessionStorage.getItem(key);
          if (sessionValue != null) return sessionValue;
        } catch {
          // fall through
        }
        if (key === AUTH_STORAGE_KEY) {
          try {
            const backupValue = window.localStorage.getItem(AUTH_STORAGE_BACKUP_KEY);
            if (backupValue != null) return backupValue;
          } catch {
            // fall through
          }
        }
        return authSessionMemory.get(key) || null;
      },
      setItem(key, value) {
        authSessionMemory.set(key, String(value));
        try {
          originalSetItem.call(window.localStorage, key, value);
          if (key === AUTH_STORAGE_KEY) originalSetItem.call(window.localStorage, AUTH_STORAGE_BACKUP_KEY, value);
          return;
        } catch {
          cleanupLocalDeniedKeys();
        }
        try {
          originalSetItem.call(window.localStorage, key, value);
          return;
        } catch {
          // fall through to session storage
        }
        try {
          window.sessionStorage.setItem(key, value);
        } catch {
          // in-memory value remains available for this tab
        }
      },
      removeItem(key) {
        authSessionMemory.delete(key);
        try {
          originalRemoveItem.call(window.localStorage, key);
        } catch {
          // ignore
        }
        try {
          window.sessionStorage.removeItem(key);
        } catch {
          // ignore
        }
        if (key === AUTH_STORAGE_KEY && explicitSignOutInProgress) {
          try { originalRemoveItem.call(window.localStorage, AUTH_STORAGE_BACKUP_KEY); } catch {}
          try { window.sessionStorage.removeItem(AUTH_STORAGE_BACKUP_KEY); } catch {}
        }
      }
    };
  }

  function readMeta() {
    try {
      return JSON.parse(window.localStorage.getItem(META_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function writeMeta(meta) {
    try {
      originalSetItem.call(window.localStorage, META_KEY, JSON.stringify(meta || {}));
    } catch {
      // ignore metadata failures
    }
  }

  function markLocalUpdated(key) {
    if (!shouldSyncKey(key)) return;
    const meta = readMeta();
    meta[key] = new Date().toISOString();
    writeMeta(meta);
  }

  function markSyncedUpdated(key, updatedAt) {
    if (!shouldSyncKey(key)) return;
    const meta = readMeta();
    meta[key] = new Date(Date.parse(updatedAt || "") || Date.now()).toISOString();
    writeMeta(meta);
  }

  function localUpdatedAt(key) {
    const value = readMeta()[key];
    const time = value ? Date.parse(value) : 0;
    return Number.isFinite(time) ? time : 0;
  }

  function dataWeight(value) {
    if (value == null) return -1;
    const text = String(value);
    const trimmed = text.trim();
    if (!trimmed || trimmed === "[]" || trimmed === "{}" || trimmed === "null") return 0;
    try {
      return structuredWeight(JSON.parse(trimmed));
    } catch {
      return Math.min(1000000, trimmed.length);
    }
  }

  function structuredWeight(value) {
    if (value == null) return 0;
    if (Array.isArray(value)) {
      return value.reduce((sum, item) => sum + 2 + structuredWeight(item), value.length);
    }
    if (typeof value === "object") {
      return Object.entries(value).reduce((sum, [key, item]) => {
        if (item == null || item === "" || (Array.isArray(item) && item.length === 0)) return sum;
        return sum + 2 + String(key).length * 0.05 + structuredWeight(item);
      }, Object.keys(value).length);
    }
    if (typeof value === "string") return value.trim() ? 1 : 0;
    if (typeof value === "number") return Number.isFinite(value) ? 1 : 0;
    if (typeof value === "boolean") return value ? 1 : 0;
    return 0;
  }

  function shouldUseCloudValue(localValue, cloudValue, localTime, cloudTime, key = "") {
    if (String(key || "") === "manual-state-last-push:v1") {
      if (dataWeight(cloudValue) === 0 && dataWeight(localValue) > 0) return false;
      if (localValue == null && cloudValue != null) return true;
      return cloudTime > localTime;
    }
    if (String(key || "").startsWith("player-tracker:v1:")) {
      if (localValue == null && cloudValue != null) return true;
      if (dataWeight(localValue) === 0 && dataWeight(cloudValue) > 0) return true;
      return cloudTime > localTime;
    }
    const localWeight = dataWeight(localValue);
    const cloudWeight = dataWeight(cloudValue);
    if (cloudWeight > localWeight) return true;
    if (localWeight > cloudWeight) return false;
    return cloudTime > localTime;
  }

  function isExplicitManualPushBundle(value) {
    try {
      const parsed = JSON.parse(String(value || ""));
      const snapshot = parsed?.snapshot && typeof parsed.snapshot === "object" ? parsed.snapshot : parsed;
      return Boolean(
        snapshot &&
        typeof snapshot === "object" &&
        String(snapshot.pushId || parsed?.pushId || "").trim() &&
        Array.isArray(snapshot.trackedPlayers) &&
        Array.isArray(snapshot.pendingGamePicks) &&
        Array.isArray(snapshot.tossupScoreboards) &&
        Array.isArray(snapshot.lockedTossupScoreboards) &&
        Array.isArray(snapshot.overUnderScoreboards)
      );
    } catch {
      return false;
    }
  }

  function readLocalValue(key) {
    try {
      const localValue = window.localStorage.getItem(key);
      if (localValue != null) return localValue;
    } catch {
      // fall through
    }
    try {
      const sessionValue = window.sessionStorage.getItem(key);
      if (sessionValue != null) return sessionValue;
    } catch {
      // fall through
    }
    return restoredValueMemory.has(key) ? restoredValueMemory.get(key) : null;
  }

  function writeLocalValue(key, value) {
    suppressUpload = true;
    try {
      if (value == null) {
        restoredValueMemory.delete(key);
        originalRemoveItem.call(window.localStorage, key);
        try { originalRemoveItem.call(window.sessionStorage, key); } catch {}
      } else {
        restoredValueMemory.set(key, String(value));
        originalSetItem.call(window.localStorage, key, value);
      }
    } catch (error) {
      if (error?.name === "QuotaExceededError") {
        cleanupLocalDeniedKeys();
        try {
          if (value == null) originalRemoveItem.call(window.localStorage, key);
          else originalSetItem.call(window.localStorage, key, value);
          return;
        } catch (retryError) {
          if (value != null) {
            try {
              originalSetItem.call(window.sessionStorage, key, value);
            } catch {
              // in-memory restored value remains available for sync comparisons in this tab
            }
            console.warn("owentools sync restored value outside localStorage after quota failure", key, retryError);
            return;
          }
          console.warn("owentools sync could not remove local value after quota cleanup", key, retryError);
          return;
        }
      }
      setErrorStatus(error, `Could not restore ${key}`);
    } finally {
      suppressUpload = false;
    }
  }

  function listSyncableLocalKeys() {
    const keys = [];
    try {
      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index);
        if (shouldSyncKey(key)) keys.push(key);
      }
    } catch {
      return [];
    }
    return keys;
  }

  function encodeValue(value) {
    return {
      value,
      deleted: value == null,
      savedAt: new Date().toISOString()
    };
  }

  function withTimeout(promise, label) {
    let timeoutId = 0;
    const timeout = new Promise((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error(`${label} timed out`)), REQUEST_TIMEOUT_MS);
    });
    return Promise.race([Promise.resolve(promise), timeout]).finally(() => {
      window.clearTimeout(timeoutId);
    });
  }

  function describeError(error, fallback = "Sync failed") {
    if (!error) return fallback;
    return error.message || error.error_description || error.details || error.hint || String(error);
  }

  function setErrorStatus(error, fallback = "Sync failed") {
    const message = describeError(error, fallback);
    setState("error");
    setStatus("Sync failed");
    if (copyEl) {
      copyEl.textContent = message;
    }
    return message;
  }

  function dispatchSyncStateChanged(detail = {}) {
    try {
      window.dispatchEvent(new CustomEvent("owentools:sync-state-changed", {
        detail: {
          toolId: pageConfig.toolId,
          label: pageConfig.label,
          ...detail
        }
      }));
    } catch {
      // CustomEvent can be unavailable in very old embedded browsers.
    }
  }

  function dispatchSyncLifecycleEvent(name, detail = {}) {
    try {
      window.dispatchEvent(new CustomEvent(name, {
        detail: {
          toolId: pageConfig.toolId,
          label: pageConfig.label,
          ...detail
        }
      }));
    } catch {
      // CustomEvent can be unavailable in very old embedded browsers.
    }
  }

  function queueUpload(key, value) {
    if (suppressUpload || !shouldSyncKey(key)) return;
    markLocalUpdated(key);
    if (pageConfig.manualOnly) return;
    if (!syncReady || !session) return;
    pendingUploads.set(key, value);
    window.clearTimeout(flushTimer);
    flushTimer = window.setTimeout(flushUploads, 650);
  }

  async function flushUploads() {
    if (pageConfig.manualOnly) return true;
    if (!client || !session || pendingUploads.size === 0) return;
    const rows = Array.from(pendingUploads.entries()).map(([key, value]) => ({
      user_id: session.user.id,
      tool_id: pageConfig.toolId,
      state_key: key,
      data: encodeValue(value),
      updated_at: new Date(localUpdatedAt(key) || Date.now()).toISOString()
    }));
    pendingUploads.clear();

    let result;
    try {
      result = await withTimeout(
        client.from("tool_state").upsert(rows, { onConflict: "user_id,tool_id,state_key" }),
        "Sync upload"
      );
    } catch (error) {
      rows.forEach((row) => pendingUploads.set(row.state_key, row.data.value));
      setErrorStatus(error, "Sync upload timed out");
      console.warn("owentools sync upload timed out", error);
      return false;
    }

    const { error } = result;

    if (error) {
      rows.forEach((row) => pendingUploads.set(row.state_key, row.data.value));
      setErrorStatus(error, "Sync upload failed");
      console.warn("owentools sync upload failed", error);
      return false;
    }
    setStatus("Synced");
    return true;
  }

  async function loadCloudState(options = {}) {
    if (!client || !session || pageConfig.loginOnly) return { ok: true, changed: false };
    const forceCloud = Boolean(options.forceCloud);
    let result;
    try {
      result = await withTimeout(
        client
          .from("tool_state")
          .select("state_key,data,updated_at")
          .eq("user_id", session.user.id)
          .eq("tool_id", pageConfig.toolId),
        "Sync download"
      );
    } catch (error) {
      console.warn("owentools sync download timed out", error);
      setErrorStatus(error, "Sync download timed out");
      return { ok: false, changed: false };
    }

    const { data, error } = result;

    if (error) {
      console.warn("owentools sync download failed", error);
      setErrorStatus(error, "Sync download failed");
      return { ok: false, changed: false };
    }

    let changed = false;
    const changedKeys = [];
    const pulledValues = {};
    const rows = data || [];
    const deniedCloudKeys = rows
      .map((row) => row.state_key)
      .filter((key) => isHardDeniedKey(key));
    if (deniedCloudKeys.length) {
      void withTimeout(
        client
          .from("tool_state")
          .delete()
          .eq("user_id", session.user.id)
          .eq("tool_id", pageConfig.toolId)
          .in("state_key", deniedCloudKeys),
        "Cloud cache cleanup"
      ).catch((cleanupError) => console.warn("owentools sync cloud cache cleanup failed", cleanupError));
    }

    rows.forEach((row) => {
      const key = row.state_key;
      if (!shouldSyncKey(key)) return;
      const value = row.data?.deleted ? null : String(row.data?.value ?? "");
      pulledValues[key] = value;
      const localValue = readLocalValue(key);
      const cloudTime = Date.parse(row.updated_at || "") || 0;
      const localTime = localUpdatedAt(key);
      const protectLocalSaveBundle = String(key || "") === "manual-state-last-push:v1";
      const forceVerifiedManualBundle = forceCloud && protectLocalSaveBundle && isExplicitManualPushBundle(value);
      if ((!forceCloud || (protectLocalSaveBundle && !forceVerifiedManualBundle)) && !shouldUseCloudValue(localValue, value, localTime, cloudTime, key)) {
        pendingUploads.set(key, localValue);
        return;
      }
      markSyncedUpdated(key, row.updated_at);
      if (localValue !== value) {
        writeLocalValue(key, value);
        changed = true;
        changedKeys.push(key);
      }
    });
    return { ok: true, changed, changedKeys, pulledValues };
  }

  async function uploadLocalState() {
    if (pageConfig.manualOnly) return true;
    if (!client || !session || pageConfig.loginOnly) return true;
    listSyncableLocalKeys().forEach((key) => pendingUploads.set(key, readLocalValue(key)));
    return flushUploads();
  }

  async function forceUploadLocalState() {
    if (!client || !session || pageConfig.loginOnly) return true;
    const now = new Date().toISOString();
    const values = new Map(listSyncableLocalKeys().map((key) => [key, readLocalValue(key)]));
    const bridgeEntries = window.MLBDashboardManualSyncBridge?.getPushEntries?.() || {};
    Object.entries(bridgeEntries).forEach(([key, value]) => {
      if (shouldSyncKey(key)) values.set(key, value == null ? null : String(value));
    });
    const rows = Array.from(values.entries()).map(([key, value]) => ({
      user_id: session.user.id,
      tool_id: pageConfig.toolId,
      state_key: key,
      data: encodeValue(value),
      updated_at: now
    }));
    if (!rows.length) return true;
    let result;
    try {
      result = await withTimeout(
        client.from("tool_state").upsert(rows, { onConflict: "user_id,tool_id,state_key" }),
        "Sync push"
      );
    } catch (error) {
      setErrorStatus(error, "Sync push timed out");
      console.warn("owentools sync push timed out", error);
      return false;
    }
    const { error } = result;
    if (error) {
      setErrorStatus(error, "Sync push failed");
      console.warn("owentools sync push failed", error);
      return false;
    }
    rows.forEach((row) => markSyncedUpdated(row.state_key, now));
    pendingUploads.clear();
    setStatus("Synced");
    return true;
  }

  async function pushLocalState(reason = "manual-push") {
    dispatchSyncLifecycleEvent("owentools:sync-before-push", { source: reason });
    const uploaded = reason === "manual-push" ? await forceUploadLocalState() : await uploadLocalState();
    if (uploaded) dispatchSyncLifecycleEvent("owentools:sync-pushed", { source: reason });
    return uploaded;
  }

  async function pullCloudState(reason = "auto") {
    if (!client || !session || pageConfig.loginOnly || pullInFlight) return false;
    pullInFlight = true;
    try {
      const download = await loadCloudState({ forceCloud: reason === "manual-pull" });
      if (!download.ok) return false;
      lastPullChangedKeys = download.changedKeys || [];
      lastPulledValues = download.pulledValues || {};
      lastPullAt = Date.now();
      if (download.changed) dispatchSyncStateChanged({ changedKeys: download.changedKeys || [], source: reason });
      if (session) {
        setState("signed-in");
        setStatus("Synced");
      }
      return Boolean(download.changed);
    } finally {
      pullInFlight = false;
    }
  }

  async function pullRemoteState(reason = "manual-pull") {
    lastPullChangedKeys = [];
    lastPulledValues = {};
    const changed = await pullCloudState(reason);
    dispatchSyncLifecycleEvent("owentools:sync-pulled", {
      source: reason,
      changed: Boolean(changed),
      changedKeys: [...lastPullChangedKeys],
      pulledValues: { ...lastPulledValues }
    });
    return changed;
  }

  function saveHistoryPrefix() {
    return String(pageConfig.saveHistoryPrefix || "manual-save:v2:");
  }

  function saveHistoryTimestamp(row = {}) {
    const keyParts = String(row.state_key || "").slice(saveHistoryPrefix().length).split(":");
    const fromKey = keyParts.map(Number).find((part) => Number.isFinite(part) && part > 1000000000000);
    return Date.parse(row.updated_at || "") || fromKey || 0;
  }

  function formatSaveTime(value, includeDate = true) {
    const time = Number(value) || Date.parse(String(value || ""));
    if (!Number.isFinite(time) || time <= 0) return "No saves yet";
    return new Date(time).toLocaleString([], includeDate
      ? { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }
      : { hour: "numeric", minute: "2-digit" });
  }

  function saveRowValue(row = {}) {
    return row?.data?.deleted ? null : String(row?.data?.value ?? "");
  }

  function saveRowDescription(row = {}) {
    return window.MLBDashboardManualSyncBridge?.describeSaveValue?.(saveRowValue(row)) || { date: "", counts: {}, total: 0 };
  }

  function activeSaveDate() {
    return String(window.MLBDashboardManualSyncBridge?.getActiveDate?.() || "");
  }

  function renderSaveHistory() {
    const latest = saveHistoryRows[0] || null;
    if (quickLoadTimeEl) quickLoadTimeEl.textContent = latest ? formatSaveTime(saveHistoryTimestamp(latest), false) : "No saves yet";
    if (!saveHistoryListEl) return;
    saveHistoryListEl.replaceChildren();
    if (!saveHistoryRows.length) {
      const empty = document.createElement("p");
      empty.className = "owentools-sync__save-empty";
      empty.textContent = "No saved snapshots yet.";
      saveHistoryListEl.appendChild(empty);
      return;
    }
    saveHistoryRows.forEach((row, index) => {
      const description = saveRowDescription(row);
      const counts = description.counts || {};
      const details = [
        counts.pendingGamePicks ? `${counts.pendingGamePicks} picks` : "",
        counts.trackedPlayers ? `${counts.trackedPlayers} players` : "",
        counts.tossupScoreboards || counts.lockedTossupScoreboards ? `${Number(counts.tossupScoreboards || 0) + Number(counts.lockedTossupScoreboards || 0)} tossups` : "",
        counts.overUnderScoreboards ? `${counts.overUnderScoreboards} O/U` : "",
      ].filter(Boolean).join(" · ") || "Empty snapshot";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "owentools-sync__save-item";
      button.innerHTML = `<strong>${index === 0 ? "Latest · " : ""}${formatSaveTime(saveHistoryTimestamp(row))}</strong><small>${description.date ? `${description.date} · ` : ""}${details}</small>`;
      button.addEventListener("click", async () => {
        await loadSaveRow(row);
      });
      saveHistoryListEl.appendChild(button);
    });
  }

  async function fetchSaveHistory() {
    if (!client || !session) return [];
    let result;
    try {
      result = await withTimeout(
        client
          .from("tool_state")
          .select("state_key,data,updated_at")
          .eq("user_id", session.user.id)
          .eq("tool_id", pageConfig.toolId)
          .like("state_key", `${saveHistoryPrefix()}%`)
          .order("updated_at", { ascending: false }),
        "Load save list"
      );
    } catch (error) {
      setErrorStatus(error, "Could not load saves");
      return saveHistoryRows;
    }
    if (result.error) {
      setErrorStatus(result.error, "Could not load saves");
      return saveHistoryRows;
    }
    const selectedDate = activeSaveDate();
    saveHistoryRows = (result.data || []).filter((row) => {
      if (saveRowValue(row) == null) return false;
      return !selectedDate || saveRowDescription(row).date === selectedDate;
    });
    renderSaveHistory();
    return saveHistoryRows;
  }

  async function saveSnapshot() {
    if (!client || !session) return false;
    dispatchSyncLifecycleEvent("owentools:sync-before-push", { source: "manual-save" });
    const value = window.MLBDashboardManualSyncBridge?.getSaveValue?.();
    if (!value) {
      setErrorStatus(new Error("The dashboard did not produce a save snapshot."), "Save failed");
      return false;
    }
    const now = Date.now();
    const saveDate = activeSaveDate() || "undated";
    const stateKey = `${saveHistoryPrefix()}${saveDate}:${now}:${Math.random().toString(36).slice(2, 10)}`;
    const row = {
      user_id: session.user.id,
      tool_id: pageConfig.toolId,
      state_key: stateKey,
      data: encodeValue(String(value)),
      updated_at: new Date(now).toISOString(),
    };
    let result;
    try {
      result = await withTimeout(
        client.from("tool_state").insert(row),
        "Save snapshot"
      );
    } catch (error) {
      setErrorStatus(error, "Save timed out");
      return false;
    }
    if (result.error) {
      setErrorStatus(result.error, "Save failed");
      return false;
    }
    saveHistoryRows = [
      { state_key: stateKey, data: row.data, updated_at: row.updated_at },
      ...saveHistoryRows.filter((savedRow) => saveRowDescription(savedRow).date === saveDate),
    ];
    renderSaveHistory();
    setState("signed-in");
    setStatus("Saved");
    if (copyEl) copyEl.textContent = `Saved ${formatSaveTime(now)}. Previous saves were kept.`;
    return true;
  }

  async function loadSaveRow(row) {
    if (!row) return false;
    setStatus("Loading...");
    const applied = Boolean(window.MLBDashboardManualSyncBridge?.applySaveValue?.(saveRowValue(row)));
    if (!applied) {
      setErrorStatus(new Error("This snapshot could not be read."), "Load failed");
      return false;
    }
    setState("signed-in");
    setStatus("Loaded");
    if (copyEl) copyEl.textContent = `Loaded the save from ${formatSaveTime(saveHistoryTimestamp(row))}.`;
    if (saveHistoryListEl) saveHistoryListEl.hidden = true;
    return true;
  }

  async function quickLoadLatest() {
    const rows = await fetchSaveHistory();
    if (!rows.length) {
      setStatus("No saves");
      return false;
    }
    return loadSaveRow(rows[0]);
  }

  function scheduleCloudPull(delay = 0, reason = "auto") {
    if (!client || !session || pageConfig.loginOnly) return;
    window.clearTimeout(pullTimer);
    pullTimer = window.setTimeout(() => {
      void pullCloudState(reason);
    }, Math.max(0, Number(delay) || 0));
  }

  function startAutoPullLoop() {
    if (!configured) return;
    if (pageConfig.manualOnly) return;
    if (autoPullStarted) return;
    autoPullStarted = true;
    const interval = Math.max(2500, Number(pageConfig.pullIntervalMs) || 5000);
    window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      if (!session || !syncReady) return;
      if (Date.now() - lastPullAt < interval - 250) return;
      scheduleCloudPull(0, "poll");
    }, interval);
    window.addEventListener("focus", () => scheduleCloudPull(80, "focus"));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") scheduleCloudPull(80, "visible");
    });
    window.addEventListener("storage", (event) => {
      if (event.key === META_KEY || shouldSyncKey(event.key || "")) scheduleCloudPull(80, "storage");
    });
  }

  function stopRealtimeSubscription() {
    if (!client || !realtimeChannel) {
      realtimeChannel = null;
      return;
    }
    try {
      client.removeChannel(realtimeChannel);
    } catch {
      // Polling remains the fallback if realtime cleanup is unavailable.
    }
    realtimeChannel = null;
  }

  function startRealtimeSubscription() {
    if (pageConfig.manualOnly) return;
    if (!client || !session || pageConfig.loginOnly || realtimeChannel || typeof client.channel !== "function") return;
    try {
      const userId = session.user?.id;
      if (!userId) return;
      realtimeChannel = client
        .channel(`owentools-sync:${pageConfig.toolId}:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tool_state",
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            const row = payload?.new || payload?.old || {};
            if (row.tool_id !== pageConfig.toolId) return;
            if (row.state_key && !shouldSyncKey(row.state_key)) return;
            scheduleCloudPull(40, "realtime");
          }
        )
        .subscribe((status) => {
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            stopRealtimeSubscription();
          }
        });
    } catch (error) {
      realtimeChannel = null;
      console.warn("owentools sync realtime subscription failed", error);
    }
  }

  async function reconcileAfterSignIn() {
    try {
      syncReady = true;
      setState("signed-in");
      setStatus(session?.user?.email || "Synced");
      startAutoPullLoop();
      startRealtimeSubscription();
      if (pageConfig.manualOnly) return;
      await pullCloudState("signin");
      await uploadLocalState();
    } catch (error) {
      syncReady = Boolean(session);
      setErrorStatus(error);
      console.warn("owentools sync reconcile failed", error);
    }
  }

  function patchLocalStorage() {
    if (Storage.prototype.__owentoolsSyncPatched) return;
    Storage.prototype.__owentoolsSyncPatched = true;

    Storage.prototype.setItem = function (key, value) {
      originalSetItem.call(this, key, value);
      if (this === window.localStorage) queueUpload(key, String(value));
    };

    Storage.prototype.removeItem = function (key) {
      originalRemoveItem.call(this, key);
      if (this === window.localStorage) queueUpload(key, null);
    };
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        if (window.supabase) resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }

  function createWidget() {
    const root = document.createElement("div");
    root.className = "owentools-sync";
    if (window.localStorage.getItem(POSITION_KEY) === "bottom-right") {
      root.classList.add("is-bottom-right");
    }
    root.innerHTML = `
      <button class="owentools-sync__button" type="button" aria-expanded="false">
        <span class="owentools-sync__dot"></span>
        <span class="owentools-sync__status">Sync</span>
      </button>
      <div class="owentools-sync__menu" hidden>
        <p class="owentools-sync__title">owentools sync</p>
        <p class="owentools-sync__copy"></p>
        <form class="owentools-sync__form">
          <input class="owentools-sync__email" type="email" name="email" autocomplete="username" placeholder="email@example.com" />
          <input class="owentools-sync__password" type="password" name="password" autocomplete="current-password" placeholder="Password" />
          <div class="owentools-sync__actions">
            <button class="owentools-sync__signin" type="submit">Sign in</button>
            <button class="owentools-sync__signup" type="button">Create account</button>
          </div>
          <button class="owentools-sync__reset" type="button">Reset password</button>
        </form>
        <div class="owentools-sync__manual-row" hidden>
          ${pageConfig.saveHistory ? `
            <button class="owentools-sync__save" type="button">Save</button>
            <div class="owentools-sync__load-split">
              <button class="owentools-sync__quick-load" type="button"><span>Quick Load</span><small>No saves yet</small></button>
              <button class="owentools-sync__load-list-toggle" type="button" aria-expanded="false">Load <span aria-hidden="true">▾</span></button>
            </div>
            <div class="owentools-sync__save-list" hidden></div>
          ` : `
            <button class="owentools-sync__pull" type="button">Pull</button>
            <button class="owentools-sync__push" type="button">Push</button>
          `}
        </div>
        <button class="owentools-sync__signout" type="button" hidden>Sign out</button>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .owentools-sync{position:fixed;right:max(14px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));z-index:2147483647;font:500 14px/1.35 system-ui,-apple-system,Segoe UI,sans-serif;color:#111}
      .owentools-sync.is-bottom-right{top:auto;bottom:max(14px,env(safe-area-inset-bottom))}
      .owentools-sync__button{display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:8px 12px;border:1px solid rgba(0,0,0,.14);border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 12px 28px rgba(0,0,0,.16);backdrop-filter:blur(14px);cursor:pointer;color:#111}
      .owentools-sync__dot{width:8px;height:8px;border-radius:50%;background:#a1a1aa}
      .owentools-sync[data-state="signed-in"] .owentools-sync__dot{background:#16a34a}
      .owentools-sync[data-state="working"] .owentools-sync__dot{background:#2563eb}
      .owentools-sync[data-state="error"] .owentools-sync__dot{background:#dc2626}
      .owentools-sync__menu{position:absolute;right:0;top:48px;width:min(300px,calc(100vw - 28px));padding:14px;border:1px solid rgba(0,0,0,.14);border-radius:14px;background:rgba(255,255,255,.96);box-shadow:0 18px 44px rgba(0,0,0,.22);backdrop-filter:blur(18px)}
      .owentools-sync__title{margin:0 0 6px;font-weight:800}
      .owentools-sync__copy{margin:0 0 12px;color:#52525b}
      .owentools-sync__form{display:grid;gap:8px}
      .owentools-sync__form[hidden],.owentools-sync__manual-row[hidden],.owentools-sync__signout[hidden],.owentools-sync__save-list[hidden]{display:none!important}
      .owentools-sync input{min-width:0;padding:9px 10px;border:1px solid #d4d4d8;border-radius:10px;font:inherit}
      .owentools-sync__actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .owentools-sync__form button,.owentools-sync__pull,.owentools-sync__push,.owentools-sync__save,.owentools-sync__quick-load,.owentools-sync__load-list-toggle,.owentools-sync__signout{padding:9px 10px;border:0;border-radius:10px;background:#111827;color:white;font:700 13px/1 system-ui;cursor:pointer}
      .owentools-sync__signup{background:#3f3f46!important}
      .owentools-sync__reset{background:transparent!important;color:#3f3f46!important;border:1px solid #d4d4d8!important}
      .owentools-sync__manual-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}
      .owentools-sync__save{background:#0f766e!important}
      .owentools-sync__load-split{display:grid;grid-template-columns:minmax(0,1fr) auto;border-radius:10px;overflow:hidden;background:#1d4ed8}
      .owentools-sync__quick-load,.owentools-sync__load-list-toggle{border-radius:0!important;background:#1d4ed8!important}
      .owentools-sync__quick-load{display:flex;min-width:0;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;text-align:left}
      .owentools-sync__quick-load small{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:italic 10px/1.15 system-ui;opacity:.8}
      .owentools-sync__load-list-toggle{border-left:1px solid rgba(255,255,255,.28)!important;padding-inline:10px!important}
      .owentools-sync__save-list{grid-column:1/-1;max-height:260px;overflow:auto;padding:5px;border:1px solid #d4d4d8;border-radius:10px;background:white}
      .owentools-sync__save-item{display:flex;width:100%;flex-direction:column;align-items:flex-start;gap:3px;padding:9px;border:0;border-bottom:1px solid #e4e4e7;background:white;color:#18181b;text-align:left;cursor:pointer}
      .owentools-sync__save-item:last-child{border-bottom:0}.owentools-sync__save-item:hover{background:#f4f4f5}
      .owentools-sync__save-item strong{font:700 12px/1.25 system-ui}.owentools-sync__save-item small{font:500 10px/1.25 system-ui;color:#71717a}
      .owentools-sync__save-empty{margin:8px;color:#71717a;font:italic 12px/1.3 system-ui}
      .owentools-sync__signout{width:100%;margin-top:6px}
      .owentools-sync__pull{background:#1d4ed8!important}
      .owentools-sync__push{background:#0f766e!important}
      .owentools-sync__signout{background:#27272a}
      .owentools-sync.is-bottom-right .owentools-sync__menu{top:auto;bottom:48px}
      @media (max-width: 700px){.owentools-sync{top:auto;bottom:max(14px,env(safe-area-inset-bottom))}.owentools-sync__menu{top:auto;bottom:48px}}
    `;

    document.head.append(style);
    document.body.append(root);

    statusEl = root.querySelector(".owentools-sync__status");
    menuEl = root.querySelector(".owentools-sync__menu");
    const button = root.querySelector(".owentools-sync__button");
    const copy = root.querySelector(".owentools-sync__copy");
    copyEl = copy;
    const form = root.querySelector(".owentools-sync__form");
    const email = root.querySelector(".owentools-sync__email");
    const password = root.querySelector(".owentools-sync__password");
    const signIn = root.querySelector(".owentools-sync__signin");
    const signUp = root.querySelector(".owentools-sync__signup");
    const reset = root.querySelector(".owentools-sync__reset");
    manualSyncButton = root.querySelector(".owentools-sync__manual-row");
    const pullButton = root.querySelector(".owentools-sync__pull");
    const pushButton = root.querySelector(".owentools-sync__push");
    const saveButton = root.querySelector(".owentools-sync__save");
    const quickLoadButton = root.querySelector(".owentools-sync__quick-load");
    const loadListToggle = root.querySelector(".owentools-sync__load-list-toggle");
    quickLoadTimeEl = quickLoadButton?.querySelector("small") || null;
    saveHistoryListEl = root.querySelector(".owentools-sync__save-list");
    const signOut = root.querySelector(".owentools-sync__signout");
    try {
      email.value = window.localStorage.getItem(EMAIL_STORAGE_KEY) || "";
    } catch {
      // ignore
    }

    button.addEventListener("click", (event) => {
      if (event?.shiftKey) {
        const bottom = !root.classList.contains("is-bottom-right");
        root.classList.toggle("is-bottom-right", bottom);
        try {
          if (bottom) window.localStorage.setItem(POSITION_KEY, "bottom-right");
          else window.localStorage.removeItem(POSITION_KEY);
        } catch {
          // ignore
        }
        return;
      }
      const next = menuEl.hidden;
      menuEl.hidden = !next;
      button.setAttribute("aria-expanded", String(next));
      if (next && pageConfig.saveHistory && session) void fetchSaveHistory();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!client || !password.value) return;
      if (recoveryMode) {
        setStatus("Saving...");
        let result;
        try {
          result = await withTimeout(client.auth.updateUser({ password: password.value }), "Password update");
        } catch (error) {
          copy.textContent = error.message;
          setState("error");
          setStatus("Try again");
          return;
        }
        const { error } = result;
        if (error) {
          copy.textContent = error.message;
          setState("error");
          setStatus("Try again");
          return;
        }
        password.value = "";
        recoveryMode = false;
        copy.textContent = "Password updated. This browser is signed in.";
        setStatus("Synced");
        refreshWidget();
        return;
      }
      if (!email.value) return;
      try {
        window.localStorage.setItem(EMAIL_STORAGE_KEY, email.value.trim());
      } catch {
        // ignore
      }
      setStatus("Signing in...");
      let result;
      try {
        result = await withTimeout(
          client.auth.signInWithPassword({
            email: email.value.trim(),
            password: password.value
          }),
          "Sign in"
        );
      } catch (error) {
        copy.textContent = error.message;
        setState("error");
        setStatus("Try again");
        return;
      }
      const { data, error } = result;
      if (error) {
        copy.textContent = error.message;
        setState("error");
        setStatus("Try again");
        return;
      }
      password.value = "";
      if (data.session) {
        session = data.session;
        refreshWidget();
        await reconcileAfterSignIn();
      }
    });

    signUp.addEventListener("click", async () => {
      if (!client || !email.value || !password.value) return;
      try {
        window.localStorage.setItem(EMAIL_STORAGE_KEY, email.value.trim());
      } catch {
        // ignore
      }
      setStatus("Creating...");
      let result;
      try {
        result = await withTimeout(
          client.auth.signUp({
            email: email.value.trim(),
            password: password.value
          }),
          "Create account"
        );
      } catch (error) {
        copy.textContent = error.message;
        setState("error");
        setStatus("Try again");
        return;
      }
      const { data, error } = result;
      if (error) {
        copy.textContent = error.message;
        setState("error");
        setStatus("Try again");
        return;
      }
      password.value = "";
      if (data.session) {
        session = data.session;
        refreshWidget();
        await reconcileAfterSignIn();
        copy.textContent = "Account created. Sync is turning on.";
        setStatus("Syncing...");
        return;
      }
      copy.textContent = "Account created. Check your email to confirm it, then sign in here.";
      setStatus("Confirm email");
    });

    reset.addEventListener("click", async () => {
      if (!client || !email.value) return;
      setStatus("Sending...");
      let result;
      try {
        result = await withTimeout(
          client.auth.resetPasswordForEmail(email.value, {
            redirectTo: window.location.href.split("#")[0]
          }),
          "Password reset"
        );
      } catch (error) {
        copy.textContent = error.message;
        setState("error");
        setStatus("Try again");
        return;
      }
      const { error } = result;
      if (error) {
        copy.textContent = error.message;
        setState("error");
        setStatus("Try again");
        return;
      }
      copy.textContent = "Check your email for the password reset link.";
      setStatus("Reset sent");
    });

    signOut.addEventListener("click", async () => {
      explicitSignOutInProgress = true;
      try {
        if (client) await client.auth.signOut();
        try { originalRemoveItem.call(window.localStorage, AUTH_STORAGE_BACKUP_KEY); } catch {}
      } finally {
        explicitSignOutInProgress = false;
      }
    });

    pullButton?.addEventListener("click", async () => {
      if (!session) return;
      setStatus("Pulling...");
      await pullRemoteState("manual-pull");
      setState("signed-in");
      setStatus("Synced");
    });

    pushButton?.addEventListener("click", async () => {
      if (!session) return;
      setStatus("Pushing...");
      const uploaded = await pushLocalState("manual-push");
      if (!uploaded) return;
      setState("signed-in");
      setStatus("Synced");
    });
    saveButton?.addEventListener("click", async () => {
      setStatus("Saving...");
      await saveSnapshot();
    });
    quickLoadButton?.addEventListener("click", async () => {
      await quickLoadLatest();
    });
    loadListToggle?.addEventListener("click", async () => {
      if (!saveHistoryListEl) return;
      const opening = saveHistoryListEl.hidden;
      saveHistoryListEl.hidden = !opening;
      loadListToggle.setAttribute("aria-expanded", String(opening));
      if (opening) await fetchSaveHistory();
    });
    document.getElementById("dateInput")?.addEventListener("change", () => {
      saveHistoryRows = [];
      renderSaveHistory();
      if (pageConfig.saveHistory && session) void fetchSaveHistory();
    });

    root.__refresh = () => {
      if (!configured) {
        copy.textContent = "Add your Supabase URL and anon key to shared/supabase-config.js to enable cross-device sync.";
        form.hidden = true;
        manualSyncButton.hidden = true;
        signOut.hidden = true;
        setState("error");
        setStatus("Sync setup");
        return;
      }
      if (session) {
        try {
          if (session.user?.email) window.localStorage.setItem(EMAIL_STORAGE_KEY, session.user.email);
        } catch {
          // ignore
        }
        copy.textContent = `${pageConfig.label} is syncing through ${session.user.email || "your account"}.`;
        form.hidden = true;
        manualSyncButton.hidden = pageConfig.loginOnly;
        signOut.hidden = false;
        setState("signed-in");
        setStatus("Synced");
        return;
      }
      if (recoveryMode) {
        email.hidden = true;
        signUp.hidden = true;
        reset.hidden = true;
        signIn.textContent = "Set password";
        password.placeholder = "New password";
        copy.textContent = "Enter a new password for this account.";
        form.hidden = false;
        manualSyncButton.hidden = true;
        signOut.hidden = true;
        setState("signed-out");
        setStatus("Set password");
        return;
      }
      email.hidden = false;
      signUp.hidden = false;
      reset.hidden = false;
      signIn.textContent = "Sign in";
      password.placeholder = "Password";
      copy.textContent = `Sign in once to sync ${pageConfig.label}. This browser will stay signed in unless you sign out or clear site data.`;
      form.hidden = false;
      manualSyncButton.hidden = true;
      signOut.hidden = true;
      setState("signed-out");
      setStatus("Sign in");
    };

    root.__refresh();
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function setState(state) {
    const root = document.querySelector(".owentools-sync");
    if (root) root.dataset.state = state;
  }

  function refreshWidget() {
    document.querySelector(".owentools-sync")?.__refresh?.();
  }

  async function initSupabase() {
    if (!configured) return;
    setState("working");
    setStatus("Connecting...");
    await loadScript(SUPABASE_CDN);
    client = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: createSafeAuthStorage(),
        storageKey: AUTH_STORAGE_KEY
      }
    });
    const result = await withTimeout(client.auth.getSession(), "Session restore");
    session = result.data.session;
    refreshWidget();
    if (session) {
      await reconcileAfterSignIn();
    }

    client.auth.onAuthStateChange(async (_event, nextSession) => {
      stopRealtimeSubscription();
      session = nextSession;
      recoveryMode = _event === "PASSWORD_RECOVERY";
      syncReady = false;
      refreshWidget();
      if (session) {
        await reconcileAfterSignIn();
      }
      else {
        setState("signed-out");
        setStatus("Sign in");
      }
    });
  }

  window.OwenToolsSync = {
    uploadLocalState,
    forceUploadLocalState,
    loadCloudState,
    pullCloudState,
    pullRemoteState,
    pushLocalState,
    flushUploads,
    getSession: () => session
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      void flushUploads();
    }
  });

  window.addEventListener("pagehide", () => {
    void flushUploads();
  });

  patchLocalStorage();
  cleanupLocalDeniedKeys();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      createWidget();
      initSupabase().catch((error) => {
        console.warn("owentools sync failed to initialize", error);
        setState("error");
        setStatus("Sync offline");
      });
    });
  } else {
    createWidget();
    initSupabase().catch((error) => {
      console.warn("owentools sync failed to initialize", error);
      setState("error");
      setStatus("Sync offline");
    });
  }
})();
