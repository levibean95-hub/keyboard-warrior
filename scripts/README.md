# GitHub Setup Scripts

This directory contains scripts to help you set up GitHub authentication and create a repository for the Keyboard Warrior project.

## Scripts Overview

### 1. `github-setup.bat` (Batch Script)
**Primary setup script for Windows Command Prompt**
- Checks GitHub CLI installation
- Handles authentication verification
- Stages and commits all project changes
- Creates GitHub repository
- Pushes code to GitHub
- Provides deployment instructions

**Usage:**
```batch
.\scripts\github-setup.bat
```

### 2. `github-setup.ps1` (PowerShell Script)
**Enhanced PowerShell version with token support**
- All features of the batch script
- Better error handling and colored output
- Supports token authentication via parameters
- More detailed status messages

**Usage:**
```powershell
# Interactive authentication
.\scripts\github-setup.ps1

# With token authentication
.\scripts\github-setup.ps1 -UseToken -Token "ghp_your_token_here"
```

### 3. `token-auth.bat` (Authentication Helper)
**Simple token authentication assistant**
- Guides you through GitHub token creation
- Handles token input securely
- Authenticates with GitHub CLI

**Usage:**
```batch
.\scripts\token-auth.bat
```

### 4. `quick-deploy.bat` (Quick Updates)
**For pushing updates after initial setup**
- Stages and commits changes
- Pushes to existing repository
- Shows deployment status

**Usage:**
```batch
.\scripts\quick-deploy.bat
```

## Authentication Methods

### Method 1: Browser Authentication (Recommended)
1. Run any setup script
2. When prompted, run: `gh auth login`
3. Follow browser prompts to authenticate
4. Re-run the setup script

### Method 2: Token Authentication
1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Name: "Keyboard Warrior Deploy"
4. Select scopes:
   - ✅ `repo` (Full control of repositories)
   - ✅ `workflow` (Update GitHub Actions)
   - ✅ `write:packages` (Upload packages)
5. Generate and copy the token
6. Use one of these approaches:
   ```batch
   # Option A: Use the token helper
   .\scripts\token-auth.bat
   
   # Option B: Direct authentication
   echo YOUR_TOKEN | gh auth login --with-token
   
   # Option C: PowerShell with parameters
   .\scripts\github-setup.ps1 -UseToken -Token "YOUR_TOKEN"
   ```

### Method 3: Manual Setup
If scripts fail, you can do this manually:
```batch
# 1. Authenticate
gh auth login

# 2. Stage changes
git add .

# 3. Commit
git commit -m "Initial Keyboard Warrior commit"

# 4. Create repository
gh repo create keyboard-warrior --public --description "AI-powered argument assistance web application"

# 5. Add remote and push
git remote add origin https://github.com/USERNAME/keyboard-warrior.git
git push -u origin master
```

## Troubleshooting

### "You are not logged into any GitHub hosts"
- Run `gh auth login` for browser authentication
- Or use `.\scripts\token-auth.bat` for token authentication

### "Repository already exists"
- This is usually fine, the script will continue to push
- If push fails, the repository might have different content
- Use `git push --force` if you're sure about overwriting

### "Failed to create repository"
- You might not have sufficient permissions
- Try creating the repository manually on GitHub first
- Then run `.\scripts\quick-deploy.bat` to push code

### "Permission denied (publickey)"
- Your authentication might have expired
- Re-run `gh auth login`
- Make sure you have proper Git credentials

### PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Next Steps After Successful Setup

1. **Verify Repository**: Visit `https://github.com/USERNAME/keyboard-warrior`
2. **Deploy to Render**:
   - Go to [Render.com](https://render.com)
   - Connect GitHub account
   - Create new Web Service
   - Select `keyboard-warrior` repository
   - Use build command: `npm run build:prod`
   - Use start command: `npm start`

## Repository Configuration

The created repository will have:
- **Name**: `keyboard-warrior`
- **Visibility**: Public
- **Description**: "Keyboard Warrior - AI-powered argument assistance web application with character-based conversations"
- **Default Branch**: `master`
- **Auto-deploy**: Ready for Render/Vercel deployment

## Environment Variables for Deployment

When deploying, set these environment variables:
- `NODE_ENV=production`
- `PORT=10000` (for Render)
- Add your OpenAI API key if using AI features
- Any other service-specific configuration

## Support

If you encounter issues:
1. Check GitHub CLI installation: `gh --version`
2. Verify authentication: `gh auth status`
3. Check repository status: `git status`
4. Review the error messages carefully
5. Try the manual setup approach if scripts fail