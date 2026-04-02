# Dual Lyrics

Dual Lyrics is a local browser app designed to feel closer to a Spotify-ready companion product than a terminal script.

It does four things:

- detects the current Spotify desktop track on Windows
- fetches lyrics from LRCLIB with fallback matching and plain-lyrics backup
- follows synced LRC timing when available
- automatically shows translated lyric lines when the song is not already in the chosen output language

## Recommended Format

The main experience is now a local web app served by PowerShell. That format is more marketable than a console shell because it is:

- visual and demo-friendly
- closer to a companion product or Spotify integration surface
- easy to evolve into an overlay, Electron app, or hosted UI later

## Run It

Run one PowerShell command:

```powershell
powershell -ExecutionPolicy Bypass -File .\dual-lyrics.ps1
```

That starts the local server and opens the browser app.

Defaults:

- output language is English
- translation is on by default
- if the detected song is already in English, the site keeps the original lyric-only look

You can still override the default output language at launch:

```powershell
powershell -ExecutionPolicy Bypass -File .\dual-lyrics.ps1 -TargetLanguage es
```

## Optional Terminal Shell

The original shell still exists for debugging and quick testing:

```powershell
powershell -ExecutionPolicy Bypass -File .\lyrics-shell.ps1
```

## Files

- `dual-lyrics-server.ps1`: local HTTP server and JSON API
- `dual-lyrics.ps1`: one-command launcher for the full app
- `SpotifyLyrics.Core.psm1`: shared Spotify, lyrics, sync, and translation logic
- `app/index.html`: product-style interface
- `app/styles.css`: UI styling
- `app/app.js`: client polling, progress, and synced lyric behavior
- `lyrics-shell.ps1`: terminal fallback

## Notes

- The app is fully independent of Spotify's Web API.
- It refreshes local Spotify state every five seconds and drops back to idle when Spotify closes.
- Song changes are detected from the local track key, and lyrics are reloaded automatically.
- The primary detector uses the Windows media session API.
- If that fails, there is a process/window-title fallback so the app can still attempt to lock onto the song.
- The lyric lookup path tries exact LRCLIB matches, cleaned title variants, LRCLIB search, and then a plain-lyrics fallback.
- If synced lyrics are missing, the UI estimates progress through plain lyrics and auto-scrolls the active line.
- Translation defaults to a Google web fallback with automatic source-language detection.
- You can change the output language from the site without restarting the app.
- The server is local only and listens on `http://localhost:8974/`.

## Most Productive Next Step

The next move from here is improving local detection quality: album art lookup, better paused-state detection for the fallback path, and a stronger translation provider strategy.
