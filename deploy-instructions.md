# Keyboard Warrior Backend Deployment Instructions

## Prerequisites
Your render.yaml and Dockerfile.render are properly configured and ready for deployment.

## Deployment Options

### Option 1: Render Dashboard (Recommended)
1. Login to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository: `levibean95-hub/keyboard-warrior`
4. Choose "Import from YAML" 
5. Select the `render.yaml` file in your repository root
6. Click "Deploy"

### Option 2: Render CLI
```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Deploy from render.yaml
render deploy
```

## Post-Deployment Configuration

After deployment, you need to set these environment variables in the Render dashboard:

1. **OPENAI_API_KEY**: Your OpenAI API key
2. **CORS_ORIGIN**: Your Vercel frontend URL (e.g., https://your-app.vercel.app)

### Setting Environment Variables:
1. Go to your service in the Render dashboard
2. Click on "Environment"
3. Add/update the required variables:
   - `OPENAI_API_KEY`: YOUR_OPENAI_API_KEY_HERE
   - `CORS_ORIGIN`: YOUR_VERCEL_FRONTEND_URL

## Service Details
- **Name**: keyboard-warrior-backend
- **Runtime**: Docker
- **Health Check**: /health
- **Port**: 5000
- **Database**: SQLite (file-based)

## Expected Service URL
After deployment, your service will be available at:
`https://keyboard-warrior-backend.onrender.com`

## Health Check
The service includes a health check endpoint at `/health` that will verify the service is running properly.

## Environment Variables Configured
- NODE_ENV=production
- PORT=5000
- DATABASE_URL=file:/app/data/keyboard-warrior.db
- JWT_SECRET=auto-generated
- RATE_LIMIT_WINDOW_MS=900000
- RATE_LIMIT_MAX_REQUESTS=100
- CORS_ORIGIN=needs manual setup
- OPENAI_API_KEY=needs manual setup