@echo off
echo ========================================
echo    STOPPING KEYBOARD WARRIOR
echo ========================================
echo.

echo Stopping Docker containers...
docker-compose down

echo.
echo Application stopped successfully!
echo.
pause