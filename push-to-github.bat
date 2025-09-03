@echo off
echo Checking GitHub authentication...
"C:\Program Files\GitHub CLI\gh.exe" auth status

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Not authenticated with GitHub!
    echo Please run: "C:\Program Files\GitHub CLI\gh.exe" auth login
    pause
    exit /b 1
)

echo.
echo Creating repository and pushing code...
"C:\Program Files\GitHub CLI\gh.exe" repo create keyboard-warrior --public --description "Keyboard Warrior - AI-powered argument assistance web application" --source=. --remote=origin --push

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================
    echo SUCCESS! Repository created and code pushed!
    echo =====================================
    echo.
    echo Your repository: https://github.com/YOUR_USERNAME/keyboard-warrior
    echo.
    echo NEXT STEPS FOR RENDER DEPLOYMENT:
    echo.
    echo 1. Go to https://dashboard.render.com
    echo 2. Click "New +" then "Web Service"
    echo 3. Connect your GitHub account if not connected
    echo 4. Select "keyboard-warrior" repository
    echo 5. Render will detect render.yaml automatically
    echo 6. Click "Create Web Service"
    echo.
    echo IMPORTANT: Set these in Render Environment:
    echo - OPENAI_API_KEY = your OpenAI API key
    echo - CORS_ORIGIN = your Vercel frontend URL
    echo.
) else (
    echo.
    echo ERROR: Failed to create repository or push code.
    echo The repository might already exist or there was an error.
    echo.
    echo Try manually:
    echo git remote add origin https://github.com/YOUR_USERNAME/keyboard-warrior.git
    echo git push -u origin master
)

pause