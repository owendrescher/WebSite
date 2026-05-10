(function () {
  "use strict";

  const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
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
  let statusEl = null;
  let menuEl = null;

  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;

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
    if (!key || matchesAny(key, pageConfig.exclude)) return false;
    if (!pageConfig.include || pageConfig.include.length === 0) return true;
    return matchesAny(key, pageConfig.include);
  }

  function readLocalValue(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeLocalValue(key, value) {
    suppressUpload = true;
    try {
      if (value == null) originalRemoveItem.call(window.localStorage, key);
      else originalSetItem.call(window.localStorage, key, value);
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

  function queueUpload(key, value) {
    if (!syncReady || suppressUpload || !session || !shouldSyncKey(key)) return;
    pendingUploads.set(key, value);
    window.clearTimeout(flushTimer);
    flushTimer = window.setTimeout(flushUploads, 650);
  }

  async function flushUploads() {
    if (!client || !session || pendingUploads.size === 0) return;
    const rows = Array.from(pendingUploads.entries()).map(([key, value]) => ({
      user_id: session.user.id,
      tool_id: pageConfig.toolId,
      state_key: key,
      data: encodeValue(value),
      updated_at: new Date().toISOString()
    }));
    pendingUploads.clear();

    const { error } = await client
      .from("tool_state")
      .upsert(rows, { onConflict: "user_id,tool_id,state_key" });

    if (error) {
      rows.forEach((row) => pendingUploads.set(row.state_key, row.data.value));
      setStatus("Sync paused");
      console.warn("owentools sync upload failed", error);
      return;
    }

    setStatus("Synced");
  }

  async function loadCloudState() {
    if (!client || !session || pageConfig.loginOnly) return false;
    const { data, error } = await client
      .from("tool_state")
      .select("state_key,data,updated_at")
      .eq("user_id", session.user.id)
      .eq("tool_id", pageConfig.toolId);

    if (error) {
      console.warn("owentools sync download failed", error);
      setStatus("Sync paused");
      return false;
    }

    let changed = false;
    (data || []).forEach((row) => {
      const key = row.state_key;
      if (!shouldSyncKey(key)) return;
      const value = row.data?.deleted ? null : String(row.data?.value ?? "");
      const localValue = readLocalValue(key);
      if (localValue !== value) {
        writeLocalValue(key, value);
        changed = true;
      }
    });
    return changed;
  }

  async function uploadLocalState() {
    if (!client || !session || pageConfig.loginOnly) return;
    listSyncableLocalKeys().forEach((key) => pendingUploads.set(key, readLocalValue(key)));
    await flushUploads();
  }

  async function reconcileAfterSignIn() {
    setStatus("Syncing...");
    const changed = await loadCloudState();
    await uploadLocalState();
    syncReady = true;
    setStatus(session?.user?.email || "Synced");

    if (changed && !sessionStorage.getItem(`owentools-sync-reloaded:${pageConfig.toolId}`)) {
      sessionStorage.setItem(`owentools-sync-reloaded:${pageConfig.toolId}`, "1");
      window.location.reload();
    }
  }

  function patchLocalStorage() {
    if (Storage.prototype.__owentoolsSyncPatched) return;
    Storage.prototype.__owentoolsSyncPatched = true;

    Storage.prototype.setItem = function (key, value) {
      originalSetItem.call(this, key, value);
      if (this === window.localStorage) queueUpload(String(key), String(value));
    };

    Storage.prototype.removeItem = function (key) {
      originalRemoveItem.call(this, key);
      if (this === window.localStorage) queueUpload(String(key), null);
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
    root.innerHTML = `
      <button class="owentools-sync__button" type="button" aria-expanded="false">
        <span class="owentools-sync__dot"></span>
        <span class="owentools-sync__status">Sync</span>
      </button>
      <div class="owentools-sync__menu" hidden>
        <p class="owentools-sync__title">owentools sync</p>
        <p class="owentools-sync__copy"></p>
        <form class="owentools-sync__form">
          <input class="owentools-sync__email" type="email" autocomplete="email" placeholder="email@example.com" />
          <input class="owentools-sync__password" type="password" autocomplete="current-password" placeholder="Password" />
          <div class="owentools-sync__actions">
            <button class="owentools-sync__signin" type="submit">Sign in</button>
            <button class="owentools-sync__signup" type="button">Create account</button>
          </div>
        </form>
        <button class="owentools-sync__signout" type="button" hidden>Sign out</button>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .owentools-sync{position:fixed;right:max(14px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));z-index:2147483647;font:500 14px/1.35 system-ui,-apple-system,Segoe UI,sans-serif;color:#111}
      .owentools-sync__button{display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:8px 12px;border:1px solid rgba(0,0,0,.14);border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 12px 28px rgba(0,0,0,.16);backdrop-filter:blur(14px);cursor:pointer;color:#111}
      .owentools-sync__dot{width:8px;height:8px;border-radius:50%;background:#a1a1aa}
      .owentools-sync[data-state="signed-in"] .owentools-sync__dot{background:#16a34a}
      .owentools-sync[data-state="working"] .owentools-sync__dot{background:#2563eb}
      .owentools-sync[data-state="error"] .owentools-sync__dot{background:#dc2626}
      .owentools-sync__menu{position:absolute;right:0;top:48px;width:min(300px,calc(100vw - 28px));padding:14px;border:1px solid rgba(0,0,0,.14);border-radius:14px;background:rgba(255,255,255,.96);box-shadow:0 18px 44px rgba(0,0,0,.22);backdrop-filter:blur(18px)}
      .owentools-sync__title{margin:0 0 6px;font-weight:800}
      .owentools-sync__copy{margin:0 0 12px;color:#52525b}
      .owentools-sync__form{display:grid;gap:8px}
      .owentools-sync input{min-width:0;padding:9px 10px;border:1px solid #d4d4d8;border-radius:10px;font:inherit}
      .owentools-sync__actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .owentools-sync__form button,.owentools-sync__signout{padding:9px 10px;border:0;border-radius:10px;background:#111827;color:white;font:700 13px/1 system-ui;cursor:pointer}
      .owentools-sync__signup{background:#3f3f46!important}
      .owentools-sync__signout{width:100%;margin-top:6px;background:#27272a}
      @media (max-width: 700px){.owentools-sync{top:auto;bottom:max(14px,env(safe-area-inset-bottom))}.owentools-sync__menu{top:auto;bottom:48px}}
    `;

    document.head.append(style);
    document.body.append(root);

    statusEl = root.querySelector(".owentools-sync__status");
    menuEl = root.querySelector(".owentools-sync__menu");
    const button = root.querySelector(".owentools-sync__button");
    const copy = root.querySelector(".owentools-sync__copy");
    const form = root.querySelector(".owentools-sync__form");
    const email = root.querySelector(".owentools-sync__email");
    const password = root.querySelector(".owentools-sync__password");
    const signUp = root.querySelector(".owentools-sync__signup");
    const signOut = root.querySelector(".owentools-sync__signout");

    button.addEventListener("click", () => {
      const next = menuEl.hidden;
      menuEl.hidden = !next;
      button.setAttribute("aria-expanded", String(next));
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!client || !email.value || !password.value) return;
      setStatus("Signing in...");
      const { error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value
      });
      if (error) {
        copy.textContent = error.message;
        setState("error");
        setStatus("Try again");
        return;
      }
      password.value = "";
    });

    signUp.addEventListener("click", async () => {
      if (!client || !email.value || !password.value) return;
      setStatus("Creating...");
      const { data, error } = await client.auth.signUp({
        email: email.value,
        password: password.value
      });
      if (error) {
        copy.textContent = error.message;
        setState("error");
        setStatus("Try again");
        return;
      }
      password.value = "";
      if (data.session) {
        copy.textContent = "Account created. Sync is turning on.";
        setStatus("Syncing...");
        return;
      }
      copy.textContent = "Account created. Check your email to confirm it, then sign in here.";
      setStatus("Confirm email");
    });

    signOut.addEventListener("click", async () => {
      if (client) await client.auth.signOut();
    });

    root.__refresh = () => {
      if (!configured) {
        copy.textContent = "Add your Supabase URL and anon key to shared/supabase-config.js to enable cross-device sync.";
        form.hidden = true;
        signOut.hidden = true;
        setState("error");
        setStatus("Sync setup");
        return;
      }
      if (session) {
        copy.textContent = `${pageConfig.label} is syncing through ${session.user.email || "your account"}.`;
        form.hidden = true;
        signOut.hidden = false;
        setState("signed-in");
        setStatus("Synced");
        return;
      }
      copy.textContent = `Sign in once to sync ${pageConfig.label}. This browser will stay signed in unless you sign out or clear site data.`;
      form.hidden = false;
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
        detectSessionInUrl: true
      }
    });
    const result = await client.auth.getSession();
    session = result.data.session;
    refreshWidget();
    if (session) await reconcileAfterSignIn();

    client.auth.onAuthStateChange(async (_event, nextSession) => {
      session = nextSession;
      syncReady = false;
      refreshWidget();
      if (session) await reconcileAfterSignIn();
      else {
        setState("signed-out");
        setStatus("Sign in");
      }
    });
  }

  window.OwenToolsSync = {
    uploadLocalState,
    loadCloudState,
    flushUploads,
    getSession: () => session
  };

  patchLocalStorage();

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
