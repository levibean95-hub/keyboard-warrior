# Simple GitHub Push Instructions

## Option 1: If you already have a GitHub account and want to do it manually

1. **Create a new repository on GitHub:**
   - Go to: https://github.com/new
   - Repository name: `keyboard-warrior`
   - Description: "Keyboard Warrior - AI-powered argument assistance web application"
   - Public repository
   - DO NOT initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Push your code (run these commands):**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/keyboard-warrior.git
   git branch -M main
   git push -u origin main
   ```

   If it asks for credentials, use:
   - Username: your GitHub username
   - Password: a Personal Access Token (not your password)
     - Get one here: https://github.com/settings/tokens/new

## Option 2: Use the manual script

Run: `manual-github-push.bat`

This will guide you through creating a token and pushing the code.

## After GitHub Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select `keyboard-warrior` repository
5. Render will detect the `render.yaml` file
6. Click "Create Web Service"
7. Set environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `CORS_ORIGIN`: Your Vercel frontend URL