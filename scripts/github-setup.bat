@echo off
echo ==============================================
echo     Keyboard Warrior - GitHub Setup
echo ==============================================
echo.

REM Set the project directory
cd /d "C:\Users\B\Videos\Projects\Keyboard Warrior"

echo Current directory: %CD%
echo.

echo Step 1: Check GitHub CLI installation...
"C:\Program Files\GitHub CLI\gh.exe" --version
if %errorlevel% neq 0 (
    echo ERROR: GitHub CLI not found at expected location
    echo Please install GitHub CLI from: https://cli.github.com/
    pause
    exit /b 1
)

echo.
echo Step 2: Check authentication status...
"C:\Program Files\GitHub CLI\gh.exe" auth status
if %errorlevel% neq 0 (
    echo.
    echo You need to authenticate with GitHub first.
    echo.
    echo OPTION 1 - Browser Authentication (Recommended):
    echo Run: "C:\Program Files\GitHub CLI\gh.exe" auth login
    echo.
    echo OPTION 2 - Token Authentication:
    echo 1. Go to https://github.com/settings/tokens
    echo 2. Generate a new token with repo permissions
    echo 3. Run: "C:\Program Files\GitHub CLI\gh.exe" auth login --with-token
    echo 4. Paste your token when prompted
    echo.
    echo Please complete authentication and run this script again.
    pause
    exit /b 1
)

echo.
echo Step 3: Stage all changes for commit...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to stage changes
    pause
    exit /b 1
)

echo.
echo Step 4: Create commit with all changes...
git commit -m "Complete Keyboard Warrior implementation with Docker deployment support

- Full-stack web application for argument assistance
- React frontend with TypeScript
- Node.js/Express backend with AI integration
- Docker containerization for easy deployment
- Comprehensive deployment documentation
- Security configurations and environment setup
- Character-based conversation system
- Production-ready configuration files

🤖 Generated with Claude Code (https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
if %errorlevel% neq 0 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)

echo.
echo Step 5: Create GitHub repository...
"C:\Program Files\GitHub CLI\gh.exe" repo create keyboard-warrior --public --description "Keyboard Warrior - AI-powered argument assistance web application with character-based conversations" --clone=false
if %errorlevel% neq 0 (
    echo ERROR: Failed to create repository
    echo This might be because the repository already exists
    echo Continuing with push attempt...
)

echo.
echo Step 6: Add GitHub remote (if not already added)...
git remote add origin https://github.com/%USERNAME%/keyboard-warrior.git 2>nul
echo Note: Ignore 'remote origin already exists' error if shown

echo.
echo Step 7: Push to GitHub...
git push -u origin master
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub
    echo This might be due to:
    echo 1. Authentication issues
    echo 2. Repository already exists with different content
    echo 3. Network connectivity issues
    echo.
    echo Try manual push: git push -u origin master --force
    pause
    exit /b 1
)

echo.
echo ==============================================
echo SUCCESS! Repository created and pushed to GitHub
echo ==============================================
echo.
echo Repository URL: https://github.com/%USERNAME%/keyboard-warrior
echo.
echo Next steps for Render deployment:
echo 1. Go to https://render.com
echo 2. Connect your GitHub account
echo 3. Create a new Web Service
echo 4. Connect to your keyboard-warrior repository
echo 5. Use these settings:
echo    - Build Command: npm run build:prod
echo    - Start Command: npm start
echo    - Environment: Node.js
echo    - Auto-Deploy: Yes
echo.
echo The repository is now ready for deployment!
echo.
pause