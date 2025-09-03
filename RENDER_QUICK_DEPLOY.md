# 🚀 Quick Render Deployment Guide

Your backend is ready to deploy! Follow these steps:

## 1. Go to Render Dashboard
👉 **[Click here to open Render](https://dashboard.render.com/new/web)**

## 2. Connect GitHub Repository
- Click **"Connect GitHub"** if not already connected
- Select **`levibean95-hub/keyboard-warrior`** repository
- Branch: **`master`**

## 3. Render Will Auto-Detect Your Configuration
Render will automatically find your `render.yaml` file and use these settings:
- ✅ Service name: `keyboard-warrior-backend`
- ✅ Docker deployment with Node.js
- ✅ Health checks configured
- ✅ Database included

## 4. Click "Create Web Service"
Just click the button - Render will handle everything else!

## 5. Set Environment Variables (IMPORTANT!)
After deployment starts, go to **Environment** tab and add:

### Required Variables:
```
OPENAI_API_KEY = [Your OpenAI API key]
CORS_ORIGIN = [Your Vercel frontend URL, e.g., https://your-app.vercel.app]
```

### Already Set For You:
- ✅ NODE_ENV = production
- ✅ PORT = 5000
- ✅ DATABASE_URL = file:/app/data/keyboard-warrior.db
- ✅ JWT_SECRET = (auto-generated)
- ✅ Rate limiting configured

## 6. Your Backend URL
Once deployed, your backend will be available at:
```
https://keyboard-warrior-backend.onrender.com
```

## 7. Update Your Frontend
In your Vercel frontend, update the API URL to point to your new Render backend.

---

## 🎯 Quick Checklist:
- [ ] Open [Render Dashboard](https://dashboard.render.com/new/web)
- [ ] Connect GitHub repo `levibean95-hub/keyboard-warrior`
- [ ] Click "Create Web Service"
- [ ] Add `OPENAI_API_KEY` in Environment tab
- [ ] Add `CORS_ORIGIN` in Environment tab
- [ ] Copy backend URL for frontend configuration

## 🆘 Troubleshooting:
- **Build fails?** Check the build logs - the Docker configuration is tested and working
- **Can't connect from frontend?** Verify `CORS_ORIGIN` matches your Vercel URL exactly
- **Health check failing?** The `/health` endpoint should auto-recover

Your deployment should take about 5-10 minutes. The free tier will spin down after inactivity but auto-restart on requests.