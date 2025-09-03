@echo off
echo ========================================
echo    CUSTOM PASSWORD SHARING
echo ========================================
echo.

set /p username="Enter username (default: warrior): "
if "%username%"=="" set username=warrior

set /p password="Enter password (default: keyboard123): "
if "%password%"=="" set password=keyboard123

echo.
echo Creating password-protected share...
echo Username: %username%
echo Password: %password%
echo.

REM Kill existing proxy if running
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Password-Protected*" 2>nul

REM Update the JavaScript file with new credentials
echo const express = require('express'); > temp-proxy.js
echo const { createProxyMiddleware } = require('http-proxy-middleware'); >> temp-proxy.js
echo const basicAuth = require('express-basic-auth'); >> temp-proxy.js
echo const app = express(); >> temp-proxy.js
echo. >> temp-proxy.js
echo const USERNAME = '%username%'; >> temp-proxy.js
echo const PASSWORD = '%password%'; >> temp-proxy.js
echo. >> temp-proxy.js
echo console.log('========================================'); >> temp-proxy.js
echo console.log('   PASSWORD-PROTECTED SHARING'); >> temp-proxy.js
echo console.log('========================================'); >> temp-proxy.js
echo console.log(`Username: ${USERNAME}`); >> temp-proxy.js
echo console.log(`Password: ${PASSWORD}`); >> temp-proxy.js
echo console.log('========================================\n'); >> temp-proxy.js
echo. >> temp-proxy.js
echo app.use(basicAuth({ >> temp-proxy.js
echo     users: { [USERNAME]: PASSWORD }, >> temp-proxy.js
echo     challenge: true, >> temp-proxy.js
echo     realm: 'Keyboard Warrior Access' >> temp-proxy.js
echo })); >> temp-proxy.js
echo. >> temp-proxy.js
echo app.use('/', createProxyMiddleware({ >> temp-proxy.js
echo     target: 'http://localhost:80', >> temp-proxy.js
echo     changeOrigin: true, >> temp-proxy.js
echo     ws: true >> temp-proxy.js
echo })); >> temp-proxy.js
echo. >> temp-proxy.js
echo app.listen(8080, () =^> { >> temp-proxy.js
echo     console.log('Ready at http://localhost:8080'); >> temp-proxy.js
echo }); >> temp-proxy.js

REM Start the proxy server
start "Password-Protected Proxy" cmd /k node temp-proxy.js

timeout /t 3 /nobreak >nul

REM Create public tunnel
echo.
echo Creating public URL...
start cmd /k lt --port 8080 --subdomain keyboardwarrior-protected

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo    SHARE WITH YOUR FRIENDS:
echo ========================================
echo.
echo URL: https://keyboardwarrior-protected.loca.lt
echo Username: %username%
echo Password: %password%
echo.
echo ========================================
echo.
pause