# Keyboard Warrior - Docker Deployment Guide

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5000

### 2. Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## Production Configuration

### Security Setup (IMPORTANT)

Before deploying to production:

1. **Generate secure secrets:**
```bash
# Generate DATABASE_ENCRYPTION_KEY (32 chars)
openssl rand -hex 16

# Generate JWT_SECRET (64 chars)
openssl rand -hex 32

# Generate JWT_REFRESH_SECRET (64 chars)
openssl rand -hex 32
```

2. **Create production environment file:**
```bash
cp .env.production .env
# Edit .env and replace all CHANGE-THIS values with generated secrets
```

3. **Optional: Enable OpenAI Integration**
   - Get API key from https://platform.openai.com/api-keys
   - Add to .env: `OPENAI_API_KEY=your-actual-api-key`
   - Without API key, the app uses enhanced mock responses (fully functional)

### Deployment Commands

```bash
# Build images
docker-compose build

# Start in production mode
docker-compose --env-file .env up -d

# View logs
docker-compose logs -f

# Check service health
docker-compose ps

# Restart services
docker-compose restart

# Update and redeploy
docker-compose pull
docker-compose up -d --build
```

## Features

### AI Response System
- **With OpenAI API**: Full AI-powered argument responses
- **Without API (Default)**: Enhanced contextual mock responses
  - Analyzes conversation context
  - Provides tone-appropriate responses
  - Fully functional for testing/demo

### Available Tones
- calm-collected: Logical and composed responses
- aggressive: Direct and forceful arguments
- cunning: Strategic and manipulative tactics
- playful: Humorous and lighthearted responses
- nerd: Academic and analytical arguments
- casual: Relaxed and informal style
- professional: Business-like and diplomatic

## Architecture

```
┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │
│  (Nginx)    │     │  (Node.js)  │
│   Port 80   │     │  Port 5000  │
└─────────────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │   SQLite    │
                    │  Database   │
                    └─────────────┘
```

## Monitoring

### Health Checks
- Frontend: http://localhost/
- Backend: http://localhost:5000/health

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

## Troubleshooting

### Port Conflicts
If ports 80 or 5000 are in use:
```bash
# Change ports in docker-compose.yml
# Frontend: Change "80:80" to "8080:80"
# Backend: Change "5000:5000" to "5001:5000"
```

### Database Issues
```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

### Build Issues
```bash
# Clean rebuild
docker-compose build --no-cache
docker-compose up
```

## Data Persistence

Data is stored in Docker volumes:
- `backend-data`: SQLite database
- `backend-logs`: Application logs

Backup data:
```bash
docker run --rm -v keyboard-warrior_backend-data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz /data
```

Restore data:
```bash
docker run --rm -v keyboard-warrior_backend-data:/data -v $(pwd):/backup alpine tar xzf /backup/data-backup.tar.gz -C /
```

## Security Notes

1. **Never commit .env files with real secrets**
2. **Use HTTPS in production** (add SSL certificates to nginx)
3. **Regularly update Docker images**
4. **Monitor logs for suspicious activity**
5. **Set up firewall rules for production**

## Support

For issues or questions:
- Check application logs: `docker-compose logs`
- Verify health endpoints are responding
- Ensure all environment variables are set correctly
- Database is accessible at `/app/data/database.db` inside container