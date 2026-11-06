@echo off
cd /d "%~dp0"
start "" http://localhost:5500
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 5500 --directory dist
) else (
  python -m http.server 5500 --directory dist
)
