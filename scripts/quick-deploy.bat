@echo off
echo ==============================================
echo     Keyboard Warrior - Quick Deploy
echo ==============================================
echo.

REM Set the project directory
cd /d "C:\Users\B\Videos\Projects\Keyboard Warrior"

echo This script will:
echo 1. Stage and commit all changes
echo 2. Push to GitHub
echo 3. Display deployment instructions
echo.

set /p confirm="Continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    pause
    exit /b 0
)

echo.
echo Step 1: Staging all changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to stage changes
    pause
    exit /b 1
)

echo.
echo Step 2: Creating commit...
git commit -m "Update Keyboard Warrior project - ready for deployment

🤖 Generated with Claude Code (https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
if %errorlevel% neq 0 (
    echo No changes to commit or commit failed
)

echo.
echo Step 3: Pushing to GitHub...
git push
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub
    echo Make sure you're authenticated and have a remote repository set up
    echo Run .\scripts\github-setup.bat if you haven't already
    pause
    exit /b 1
)

echo.
echo SUCCESS! Changes pushed to GitHub.
echo.
echo ==============================================
echo          RENDER DEPLOYMENT GUIDE
echo ==============================================
echo.
echo 1. Go to: https://render.com
echo 2. Sign in with your GitHub account
echo 3. Click "New +" -^> "Web Service"
echo 4. Connect your "keyboard-warrior" repository
echo 5. Configure the service:
echo    ┌─────────────────────────────────────────┐
echo    │ Name: keyboard-warrior                  │
echo    │ Environment: Node                       │
echo    │ Build Command: npm run build:prod       │
echo    │ Start Command: npm start                │
echo    │ Instance Type: Free                     │
echo    └─────────────────────────────────────────┘
echo.
echo 6. Add Environment Variables:
echo    - NODE_ENV = production
echo    - PORT = 10000
echo    - Add your OpenAI API key if needed
echo.
echo 7. Click "Create Web Service"
echo.
echo Your app will be deployed automatically!
echo.
pause