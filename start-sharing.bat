@echo off
echo ========================================
echo    KEYBOARD WARRIOR - SHARE WITH FRIENDS
echo ========================================
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [1/3] Starting application containers...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start containers
    pause
    exit /b 1
)

echo.
echo [2/3] Waiting for services to be ready...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Creating public URL...
echo.
echo ========================================
echo    YOUR APP IS NOW ACCESSIBLE AT:
echo ========================================
echo.
echo    LOCAL:  http://localhost
echo.

REM Start localtunnel
echo Creating public URL (this may take a moment)...
start /b cmd /c "lt --port 80 --subdomain keyboardwarrior-demo 2>&1 | find \"your url is\" && pause"

timeout /t 3 /nobreak >nul
echo.
echo    PUBLIC: https://keyboardwarrior-demo.loca.lt
echo.
echo ========================================
echo    SHARE THIS URL WITH YOUR FRIENDS!
echo    https://keyboardwarrior-demo.loca.lt
echo ========================================
echo.
echo NOTE: When friends visit the URL, they may need to:
echo   1. Enter the password shown on their screen
echo   2. Click "Click to Continue" button
echo.
echo Press CTRL+C to stop sharing (containers will keep running)
echo.
pause