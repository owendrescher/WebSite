@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
del "%SCRIPT_DIR%player-heatmaps-url.txt" >nul 2>nul
start "Player Heatmaps Server" powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start-heatmaps-server.ps1"
for /l %%i in (1,1,20) do (
  if exist "%SCRIPT_DIR%player-heatmaps-url.txt" goto open_url
  timeout /t 1 /nobreak >nul
)
start "" "http://localhost:8765/player-heatmaps.html"
exit /b

:open_url
set /p HEATMAPS_URL=<"%SCRIPT_DIR%player-heatmaps-url.txt"
start "" "%HEATMAPS_URL%"
