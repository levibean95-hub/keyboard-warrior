# Render Deployment Guide for Keyboard Warrior Backend

This guide will walk you through deploying the Keyboard Warrior backend to Render using the pre-configured render.yaml file.

## Prerequisites

1. ✅ Render.yaml file is already configured at project root
2. ✅ Dockerfile.render is ready in backend directory
3. ❌ GitHub repository needs to be set up
4. ❌ Code needs to be pushed to GitHub
5. ❌ Environment variables need to be configured in Render

## Step 1: GitHub Repository Setup

Since Render deployments work best with GitHub repositories, you need to:

### 1.1 Create GitHub Repository
```bash
# Go to GitHub.com and create a new repository named "keyboard-warrior"
# Choose public or private based on your preference
# Do NOT initialize with README, .gitignore, or license (we already have these)
```

### 1.2 Add GitHub Remote and Push
```bash
# Add the GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/keyboard-warrior.git

# Commit all current changes
git add .
git commit -m "Initial project setup with Render deployment configuration"

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Render Deployment Using MCP Server

Since you have the Render MCP server connected and authenticated, you can use it to deploy:

### 2.1 List Workspaces (if needed)
The Render MCP server should allow you to list and select workspaces.

### 2.2 Create Service from render.yaml
With the Render MCP server, you can create the service using the existing render.yaml configuration.

## Step 3: Manual Render Dashboard Method (Alternative)

If MCP doesn't work as expected, you can deploy manually:

### 3.1 Login to Render Dashboard
1. Go to [render.com](https://render.com)
2. Login with your account

### 3.2 Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Choose "Build and deploy from a Git repository"
4. Connect your GitHub account if not already connected
5. Select your "keyboard-warrior" repository
6. Click "Connect"

### 3.3 Configure Service Settings
Use these settings (most are pre-configured in render.yaml):

- **Name**: `keyboard-warrior-backend`
- **Runtime**: `Docker`
- **Region**: `Oregon (US West)`
- **Branch**: `main` (or `master`)
- **Dockerfile Path**: `./backend/Dockerfile.render`
- **Docker Context**: `./backend`

### 3.4 Environment Variables
Set these environment variables in the Render dashboard:

#### Auto-Generated/Pre-configured:
- `NODE_ENV`: `production`
- `PORT`: `5000`
- `DATABASE_URL`: `file:/app/data/keyboard-warrior.db`
- `RATE_LIMIT_WINDOW_MS`: `900000`
- `RATE_LIMIT_MAX_REQUESTS`: `100`
- `JWT_SECRET`: (Let Render auto-generate this)

#### Manual Configuration Required:
- `OPENAI_API_KEY`: Your OpenAI API key (from OpenAI dashboard)
- `CORS_ORIGIN`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

### 3.5 Deploy
1. Click "Create Web Service"
2. Wait for the build and deployment to complete
3. The service will be available at `https://keyboard-warrior-backend.onrender.com`

## Step 4: Verify Deployment

### 4.1 Health Check
Once deployed, verify the health endpoint:
```bash
curl https://keyboard-warrior-backend.onrender.com/health
```

Should return:
```json
{"status":"OK","timestamp":"...","version":"1.0.0"}
```

### 4.2 API Endpoints
Test the main API endpoints:
```bash
# Test API status
curl https://keyboard-warrior-backend.onrender.com/api/health

# Test character endpoints (should work without auth)
curl https://keyboard-warrior-backend.onrender.com/api/characters
```

## Step 5: Configure Frontend

Update your frontend environment variables to point to the Render backend:

### Frontend .env.production
```env
VITE_API_URL=https://keyboard-warrior-backend.onrender.com
```

## Current Service Configuration

The render.yaml file is configured with:

### Service Specs:
- **Type**: Web Service
- **Runtime**: Docker
- **Plan**: Free (upgradeable)
- **Health Check**: `/health` endpoint
- **Docker Context**: `./backend`
- **Dockerfile**: `./backend/Dockerfile.render`

### Optimizations:
- Multi-stage Docker build for smaller image size
- Non-root user for security
- Proper signal handling with dumb-init
- Built-in health checks
- SQLite database with persistent storage

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are listed in package.json
2. **Health Check Fails**: Ensure the `/health` endpoint is implemented
3. **CORS Issues**: Make sure `CORS_ORIGIN` is set to your frontend URL
4. **Database Issues**: SQLite file will be created automatically in `/app/data`

### Logs:
Access deployment logs through the Render dashboard to debug issues.

## Cost Information

- **Free Plan**: 750 hours/month, automatic sleeping after 15 minutes of inactivity
- **Paid Plans**: Start at $7/month for always-on services
- **Database**: SQLite runs in the same container (no additional cost)

## Next Steps After Deployment

1. ✅ Backend deployed to Render
2. ⏳ Deploy frontend to Vercel
3. ⏳ Update CORS_ORIGIN with Vercel URL
4. ⏳ Test full application integration
5. ⏳ Set up custom domain (optional)
6. ⏳ Configure monitoring and alerts

## Security Notes

- Environment variables are encrypted at rest
- Service runs as non-root user
- JWT secrets are auto-generated securely
- HTTPS is enforced by default
- Rate limiting is pre-configured

---

**Note**: The render.yaml file contains all the necessary configuration. You can either use the Render MCP server for automated deployment or follow the manual dashboard steps above.