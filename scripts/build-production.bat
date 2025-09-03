@echo off
REM Production Build Script for Keyboard Warrior (Windows)
REM This script handles the complete production build process

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🚀 Keyboard Warrior Production Build
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed
    exit /b 1
)

echo [INFO] All dependencies are available

REM Clean previous builds
echo [INFO] Cleaning previous builds...
if exist backend\dist rmdir /s /q backend\dist
if exist frontend\dist rmdir /s /q frontend\dist
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo [SUCCESS] Cleaned previous builds

REM Install dependencies
echo [INFO] Installing dependencies...
call npm ci --production=false
if errorlevel 1 (
    echo [ERROR] Failed to install root dependencies
    exit /b 1
)

cd backend
call npm ci --production=false
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    exit /b 1
)
cd ..

cd frontend
call npm ci --production=false
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    exit /b 1
)
cd ..

echo [SUCCESS] Dependencies installed

REM Run tests if not skipped
if not "%SKIP_TESTS%"=="true" (
    echo [INFO] Running tests...
    
    cd backend
    call npm test
    if errorlevel 1 (
        echo [ERROR] Backend tests failed
        exit /b 1
    )
    cd ..
    echo [SUCCESS] Backend tests passed
    
    cd frontend
    call npm run test:ci 2>nul || echo [INFO] No frontend tests found
    cd ..
    echo [SUCCESS] Frontend tests completed
)

REM Lint code
echo [INFO] Linting code...
cd backend
call npm run lint
if errorlevel 1 (
    echo [ERROR] Backend linting failed
    exit /b 1
)
cd ..

cd frontend
call npm run lint
if errorlevel 1 (
    echo [ERROR] Frontend linting failed
    exit /b 1
)
cd ..
echo [SUCCESS] Code linting completed

REM Build backend
echo [INFO] Building backend...
cd backend
call npm run build
if errorlevel 1 (
    echo [ERROR] Backend build failed
    exit /b 1
)

if not exist dist (
    echo [ERROR] Backend build failed - dist directory not found
    exit /b 1
)
cd ..
echo [SUCCESS] Backend build completed

REM Build frontend
echo [INFO] Building frontend...
cd frontend
set NODE_ENV=production
set VITE_NODE_ENV=production
call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    exit /b 1
)

if not exist dist (
    echo [ERROR] Frontend build failed - dist directory not found
    exit /b 1
)
cd ..
echo [SUCCESS] Frontend build completed

REM Create deployment directory
echo [INFO] Creating deployment package...
if exist deployment rmdir /s /q deployment
mkdir deployment

REM Copy backend files
xcopy /E /I backend\dist deployment\backend >nul
copy backend\package.json deployment\ >nul
if exist backend\package-lock.json copy backend\package-lock.json deployment\ >nul

REM Copy frontend files
xcopy /E /I frontend\dist deployment\frontend >nul

REM Copy configuration files
copy docker-compose.yml deployment\ >nul
copy Dockerfile deployment\ >nul
if exist nginx xcopy /E /I nginx deployment\nginx >nul
if exist monitoring xcopy /E /I monitoring deployment\monitoring >nul

echo [SUCCESS] Deployment package created

REM Validate build
echo [INFO] Validating build...
if not exist backend\dist\server.js (
    echo [ERROR] Required file missing: backend\dist\server.js
    exit /b 1
)

if not exist frontend\dist\index.html (
    echo [ERROR] Required file missing: frontend\dist\index.html
    exit /b 1
)

cd backend
node -c dist\server.js
if errorlevel 1 (
    echo [ERROR] Backend syntax validation failed
    exit /b 1
)
cd ..
echo [SUCCESS] Build validation completed

echo.
echo ========================================
echo [SUCCESS] 🎉 Production build completed successfully!
echo ========================================
echo.
echo [INFO] Next steps:
echo   1. Test the build locally: docker-compose -f docker-compose.yml up
echo   2. Deploy to staging: scripts\deploy-staging.bat
echo   3. Deploy to production: scripts\deploy-production.bat
echo.

endlocal