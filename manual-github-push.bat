@echo off
echo =====================================
echo Manual GitHub Repository Setup
echo =====================================
echo.
echo Since GitHub CLI authentication is having issues, let's use the manual approach.
echo.
echo STEP 1: Create a Personal Access Token
echo ----------------------------------------
echo 1. Go to: https://github.com/settings/tokens/new
echo 2. Give it a name: "Keyboard Warrior Deploy"
echo 3. Select scopes: repo (all), workflow
echo 4. Click "Generate token"
echo 5. COPY THE TOKEN (starts with ghp_)
echo.
pause
echo.
echo STEP 2: Enter your GitHub username and token
echo ----------------------------------------
set /p GITHUB_USERNAME="Enter your GitHub username: "
set /p GITHUB_TOKEN="Enter your GitHub token (ghp_...): "
echo.

echo Configuring git with your credentials...
git config --global user.name "%GITHUB_USERNAME%"
git config --global user.email "%GITHUB_USERNAME%@users.noreply.github.com"

echo.
echo Creating repository using GitHub API...
curl -H "Authorization: token %GITHUB_TOKEN%" ^
     -H "Accept: application/vnd.github.v3+json" ^
     -X POST ^
     -d "{\"name\":\"keyboard-warrior\",\"description\":\"Keyboard Warrior - AI-powered argument assistance web application\",\"private\":false}" ^
     https://api.github.com/user/repos

echo.
echo Adding remote and pushing code...
git remote remove origin 2>nul
git remote add origin https://%GITHUB_USERNAME%:%GITHUB_TOKEN%@github.com/%GITHUB_USERNAME%/keyboard-warrior.git
git branch -M main
git push -u origin main --force

echo.
echo =====================================
echo Repository Setup Complete!
echo =====================================
echo.
echo Your repository: https://github.com/%GITHUB_USERNAME%/keyboard-warrior
echo.
echo NEXT STEPS FOR RENDER:
echo 1. Go to https://dashboard.render.com
echo 2. Click "New +" -> "Web Service"
echo 3. Connect GitHub and select "keyboard-warrior"
echo 4. Render will auto-detect render.yaml
echo 5. Set these environment variables:
echo    - OPENAI_API_KEY
echo    - CORS_ORIGIN (your Vercel URL)
echo.
pause