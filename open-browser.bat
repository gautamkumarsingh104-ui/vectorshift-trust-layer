@echo off
cd /d "%~dp0"
echo Opening VectorShift demo in your browser...

powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:5173/' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel%==0 (
  start "" "http://127.0.0.1:5173/"
  echo Opened http://127.0.0.1:5173/
  exit /b 0
)

powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:5174/' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel%==0 (
  start "" "http://127.0.0.1:5174/"
  echo Opened http://127.0.0.1:5174/
  exit /b 0
)

echo.
echo ERROR: Dev server is not running.
echo Double-click start.bat first, then try open-browser.bat again.
echo.
pause
