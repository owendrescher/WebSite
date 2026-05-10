# owentools Supabase Sync Setup

The codebase is wired for optional login and cross-device sync. It stays local-first:

- Signed out: tools keep using browser `localStorage`.
- Signed in: matching `localStorage` keys are mirrored to Supabase.
- On page load/sign-in: cloud state downloads, updates local storage, and reloads once if newer cloud data was applied.

## 1. Create a Supabase project

Create a project at https://supabase.com, then open the project dashboard.

## 2. Create the sync table

Open **SQL Editor** in Supabase, paste the contents of `supabase/schema.sql`, and run it.

This creates `public.tool_state` with row-level security so users can only read and write their own rows.

## 3. Add your browser config

In Supabase, go to **Project Settings > API** and copy:

- Project URL
- anon public key

Paste them into `shared/supabase-config.js`:

```js
window.OWENTOOLS_SUPABASE = {
  url: "https://your-project.supabase.co",
  anonKey: "your-anon-public-key"
};
```

The anon key is meant to be public in browser apps. Row-level security is what protects the data.

## 4. Configure login redirects

In Supabase, go to **Authentication > URL Configuration**.

Set **Site URL** to the deployed owentools URL.

Add your deployed URLs to **Redirect URLs**, for example:

```text
https://your-domain.com/**
http://localhost:*/**
```

Password login does not need a magic-link redirect for normal sign-in, but Supabase may still send confirmation or recovery emails depending on your auth settings.

## 5. Configure password auth

In Supabase, go to **Authentication > Providers > Email**.

Make sure **Email provider** is enabled.

For the simplest personal owentools setup, you can turn off **Confirm email**. Then creating an account signs in immediately.

If you leave **Confirm email** on, the first account creation will send a confirmation email. After confirming once, future sign-ins use email + password.

The sync code uses Supabase's persistent browser session. That means a device should stay signed in until you click **Sign out**, clear site data, or the browser blocks persistent storage.

If the widget says the account is waiting on email confirmation and password sign-in says invalid credentials:

- Turn off **Confirm email** for the simplest setup, then delete/recreate the test user in **Authentication > Users**.
- Or open **Authentication > Users**, click the user, and confirm the email manually if Supabase shows it as unconfirmed.
- If the account was first created with magic-link testing, use **Reset password** in the widget to add/set a password for that existing account.

## 6. Test

1. Open `index.html` through your deployed site or a local web server.
2. Click the sync button.
3. Enter your email and password.
4. Click **Create account** the first time, then **Sign in** on other devices.
4. Change data in a synced tool.
5. Open the same tool in another browser/device and sign in.

## Currently Wired Tools

- Launcher login button
- Daily Task List
- Notepad To-Do List
- Book Reader notes/bookmarks/settings metadata
- Nutrition and Cost Analysis
- Arabic Script Learning progress
- Converted Lang Game scores
- Baseball dashboard state

Large binary/autosave data, like local PDF files stored in IndexedDB, is intentionally not uploaded by this first pass.
