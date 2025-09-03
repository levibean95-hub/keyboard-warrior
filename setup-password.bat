@echo off
echo ========================================
echo    KEYBOARD WARRIOR - PASSWORD SETUP
echo ========================================
echo.

echo Choose an option:
echo.
echo 1. Share WITHOUT password (using LocalTunnel - visitors enter their IP)
echo 2. Share WITH your own password (using basic auth)
echo 3. Share on local network only (no internet)
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Starting public tunnel...
    echo Visitors will need to enter their IP address as shown on the page.
    echo.
    lt --port 80
) else if "%choice%"=="2" (
    echo.
    set /p username="Enter username: "
    set /p password="Enter password: "
    echo.
    echo Setting up password protection...
    echo Username: %username%
    echo Password: %password%
    echo.
    echo NOTE: This requires rebuilding the Docker container with authentication.
    echo Would need to modify the nginx configuration.
    pause
) else if "%choice%"=="3" (
    echo.
    echo Your app is available on local network only.
    echo Share this with people on your WiFi:
    echo.
    ipconfig | findstr /i "ipv4"
    echo.
    echo They can access at: http://[YOUR-IP-ADDRESS]
    echo.
    pause
) else (
    echo Invalid choice!
    pause
)