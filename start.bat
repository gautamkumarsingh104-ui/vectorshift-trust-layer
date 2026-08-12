@echo off
cd /d "%~dp0"
echo.
echo  VectorShift Trust Layer Demo
echo  ============================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed.
  echo Download it from https://nodejs.org/ and try again.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies... this may take a minute.
  call npm install
  if %errorlevel% neq 0 (
    echo ERROR: npm install failed.
    pause
    exit /b 1
  )
)

echo Starting and opening browser...
echo Keep this window open while using the demo. Press Ctrl+C to stop.
echo.

node scripts/dev.mjs
