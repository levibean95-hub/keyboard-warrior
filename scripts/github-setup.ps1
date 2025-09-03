# Keyboard Warrior - GitHub Setup PowerShell Script
param(
    [switch]$UseToken,
    [string]$Token = ""
)

Write-Host "==============================================" -ForegroundColor Green
Write-Host "    Keyboard Warrior - GitHub Setup" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Set the project directory
Set-Location "C:\Users\B\Videos\Projects\Keyboard Warrior"
Write-Host "Current directory: $(Get-Location)"
Write-Host ""

# Step 1: Check GitHub CLI
Write-Host "Step 1: Check GitHub CLI installation..." -ForegroundColor Yellow
try {
    $ghVersion = & "C:\Program Files\GitHub CLI\gh.exe" --version
    Write-Host $ghVersion -ForegroundColor Green
} catch {
    Write-Host "ERROR: GitHub CLI not found at expected location" -ForegroundColor Red
    Write-Host "Please install GitHub CLI from: https://cli.github.com/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Authentication
Write-Host ""
Write-Host "Step 2: Check authentication status..." -ForegroundColor Yellow

$authStatus = & "C:\Program Files\GitHub CLI\gh.exe" auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "You need to authenticate with GitHub first." -ForegroundColor Red
    Write-Host ""
    
    if ($UseToken -and $Token) {
        Write-Host "Authenticating with provided token..." -ForegroundColor Yellow
        $Token | & "C:\Program Files\GitHub CLI\gh.exe" auth login --with-token
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Token authentication failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "AUTHENTICATION OPTIONS:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "OPTION 1 - Browser Authentication (Recommended):" -ForegroundColor White
        Write-Host '& "C:\Program Files\GitHub CLI\gh.exe" auth login' -ForegroundColor Gray
        Write-Host ""
        Write-Host "OPTION 2 - Token Authentication:" -ForegroundColor White
        Write-Host "1. Go to https://github.com/settings/tokens" -ForegroundColor Gray
        Write-Host "2. Generate a new token with 'repo' permissions" -ForegroundColor Gray
        Write-Host "3. Run this script with: .\github-setup.ps1 -UseToken -Token 'your_token_here'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "OPTION 3 - Interactive Token:" -ForegroundColor White
        Write-Host '& "C:\Program Files\GitHub CLI\gh.exe" auth login --with-token' -ForegroundColor Gray
        Write-Host "(Then paste your token when prompted)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Please complete authentication and run this script again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host $authStatus -ForegroundColor Green
}

# Step 3: Stage changes
Write-Host ""
Write-Host "Step 3: Stage all changes for commit..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to stage changes" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 4: Commit
Write-Host ""
Write-Host "Step 4: Create commit with all changes..." -ForegroundColor Yellow
$commitMessage = @"
Complete Keyboard Warrior implementation with Docker deployment support

- Full-stack web application for argument assistance
- React frontend with TypeScript
- Node.js/Express backend with AI integration
- Docker containerization for easy deployment
- Comprehensive deployment documentation
- Security configurations and environment setup
- Character-based conversation system
- Production-ready configuration files

🤖 Generated with Claude Code (https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
"@

git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create commit" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 5: Create repository
Write-Host ""
Write-Host "Step 5: Create GitHub repository..." -ForegroundColor Yellow
& "C:\Program Files\GitHub CLI\gh.exe" repo create keyboard-warrior --public --description "Keyboard Warrior - AI-powered argument assistance web application with character-based conversations" --clone=false
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Repository creation failed (might already exist)" -ForegroundColor Yellow
    Write-Host "Continuing with push attempt..." -ForegroundColor Yellow
}

# Step 6: Add remote
Write-Host ""
Write-Host "Step 6: Add GitHub remote (if not already added)..." -ForegroundColor Yellow
$username = & "C:\Program Files\GitHub CLI\gh.exe" api user --jq .login 2>$null
if ($username) {
    git remote add origin "https://github.com/$username/keyboard-warrior.git" 2>$null
    Write-Host "Note: Ignore 'remote origin already exists' error if shown" -ForegroundColor Gray
} else {
    Write-Host "Could not determine GitHub username, using generic remote..." -ForegroundColor Yellow
    git remote add origin "https://github.com/$(whoami)/keyboard-warrior.git" 2>$null
}

# Step 7: Push
Write-Host ""
Write-Host "Step 7: Push to GitHub..." -ForegroundColor Yellow
git push -u origin master
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push to GitHub" -ForegroundColor Red
    Write-Host "This might be due to:" -ForegroundColor Yellow
    Write-Host "1. Authentication issues" -ForegroundColor Gray
    Write-Host "2. Repository already exists with different content" -ForegroundColor Gray
    Write-Host "3. Network connectivity issues" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Try manual push: git push -u origin master --force" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}

# Success message
Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "SUCCESS! Repository created and pushed to GitHub" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

if ($username) {
    Write-Host "Repository URL: https://github.com/$username/keyboard-warrior" -ForegroundColor Cyan
} else {
    Write-Host "Repository URL: Check your GitHub account for the keyboard-warrior repo" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Next steps for Render deployment:" -ForegroundColor Yellow
Write-Host "1. Go to https://render.com" -ForegroundColor White
Write-Host "2. Connect your GitHub account" -ForegroundColor White
Write-Host "3. Create a new Web Service" -ForegroundColor White
Write-Host "4. Connect to your keyboard-warrior repository" -ForegroundColor White
Write-Host "5. Use these settings:" -ForegroundColor White
Write-Host "   - Build Command: npm run build:prod" -ForegroundColor Gray
Write-Host "   - Start Command: npm start" -ForegroundColor Gray
Write-Host "   - Environment: Node.js" -ForegroundColor Gray
Write-Host "   - Auto-Deploy: Yes" -ForegroundColor Gray
Write-Host ""
Write-Host "The repository is now ready for deployment!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"