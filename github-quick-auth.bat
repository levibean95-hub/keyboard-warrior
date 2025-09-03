@echo off
echo =====================================
echo GitHub Quick Authentication
echo =====================================
echo.
echo This will open your browser to authenticate with GitHub.
echo After authenticating, this script will automatically:
echo 1. Create the repository
echo 2. Push your code
echo.
pause

echo Authenticating with GitHub...
"C:\Program Files\GitHub CLI\gh.exe" auth login -w

echo.
echo Checking authentication status...
"C:\Program Files\GitHub CLI\gh.exe" auth status

echo.
echo Creating repository and pushing code...
"C:\Program Files\GitHub CLI\gh.exe" repo create keyboard-warrior --public --description "Keyboard Warrior - AI-powered argument assistance web application" --source=. --remote=origin --push

echo.
echo =====================================
echo GitHub Setup Complete!
echo =====================================
echo.
echo Your repository is now at: https://github.com/YOUR_USERNAME/keyboard-warrior
echo.
echo Next steps:
echo 1. Go to https://render.com
echo 2. Click "New +" and select "Web Service"
echo 3. Connect your GitHub account
echo 4. Select the "keyboard-warrior" repository
echo 5. Render will auto-detect the render.yaml file
echo 6. Click "Create Web Service"
echo.
echo Don't forget to set these environment variables in Render:
echo - OPENAI_API_KEY: Your OpenAI API key
echo - CORS_ORIGIN: Your Vercel frontend URL
echo.
pause