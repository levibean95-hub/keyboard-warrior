@echo off
echo ==============================================
echo     GitHub Token Authentication Helper
echo ==============================================
echo.

echo This script will help you authenticate with GitHub using a personal access token.
echo.

echo Step 1: Create a GitHub Personal Access Token
echo =============================================
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token" -^> "Generate new token (classic)"
echo 3. Give it a descriptive name like "Keyboard Warrior Deploy"
echo 4. Select these scopes:
echo    ✓ repo (Full control of private repositories)
echo    ✓ workflow (Update GitHub Action workflows)
echo    ✓ write:packages (Upload packages to GitHub Package Registry)
echo 5. Click "Generate token"
echo 6. COPY the token immediately (you won't see it again!)
echo.

echo Step 2: Authenticate with the token
echo ===================================
echo.
set /p token="Paste your GitHub token here: "

echo.
echo Authenticating with GitHub...
echo %token% | "C:\Program Files\GitHub CLI\gh.exe" auth login --with-token

if %errorlevel% eq 0 (
    echo.
    echo SUCCESS! You are now authenticated with GitHub.
    echo.
    echo You can now run the main setup script:
    echo .\scripts\github-setup.bat
    echo.
) else (
    echo.
    echo ERROR: Authentication failed.
    echo Please check your token and try again.
    echo.
)

pause