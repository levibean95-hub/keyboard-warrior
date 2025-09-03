# 🐳 Keyboard Warrior Docker Deployment Guide

## ✅ Deployment Status
**Status**: SUCCESSFULLY DEPLOYED  
**Date**: September 1, 2025  
**Environment**: Docker Containers with Docker Compose

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose v2.0+
- 4GB RAM minimum
- Ports 80 and 5000 available

### Deploy Application
```bash
# Build and start containers
docker-compose up -d

# Check container status
docker ps

# View logs
docker-compose logs -f
```

## 📦 Container Architecture

### Services
1. **Frontend** (nginx:alpine)
   - Port: 80
   - Serves React application
   - Reverse proxy to backend API

2. **Backend** (node:20-alpine)
   - Port: 5000
   - Express.js API server
   - SQLite database
   - OpenAI integration

## 🔧 Configuration

### Environment Variables
Create `.env.production` file with:
```env
# Required for AI features
OPENAI_API_KEY=your-api-key-here

# Security (generate secure random values)
JWT_SECRET=generate-64-char-secret
JWT_REFRESH_SECRET=generate-another-64-char-secret
DATABASE_ENCRYPTION_KEY=generate-32-char-key
```

### Generate Secure Secrets
```bash
# Generate 32-character key
openssl rand -hex 32

# Generate 64-character secret
openssl rand -hex 64
```

## 🎯 Access Points

### Local Development
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Production URLs
Update these in production:
- Frontend: https://your-domain.com
- Backend: https://api.your-domain.com

## 🛠️ Common Commands

### Container Management
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View logs
docker-compose logs -f [service-name]

# Execute commands in container
docker exec -it keyboard-warrior-backend sh
docker exec -it keyboard-warrior-frontend sh
```

### Build and Deploy
```bash
# Rebuild images
docker-compose build

# Rebuild specific service
docker-compose build frontend
docker-compose build backend

# Pull latest and redeploy
docker-compose pull
docker-compose up -d
```

### Debugging
```bash
# Check container health
docker ps

# Inspect container
docker inspect keyboard-warrior-backend

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a
```

## 📊 Health Monitoring

### Health Endpoints
- Backend: `curl http://localhost:5000/health`
- Frontend: `curl http://localhost/`

### Container Health Checks
Both containers include built-in health checks:
- Interval: 30s
- Timeout: 10s
- Retries: 3
- Start period: 40s

## 🔒 Security Considerations

1. **API Keys**: Never commit actual API keys
2. **Secrets**: Use environment variables for sensitive data
3. **HTTPS**: Configure SSL certificates in production
4. **Firewall**: Restrict port access as needed
5. **Updates**: Regularly update base images

## 📈 Performance Optimization

### Current Metrics
- Frontend bundle: ~308KB (99KB gzipped)
- Backend startup: ~5 seconds
- Memory usage: ~200MB per container
- CPU usage: <5% idle

### Optimization Tips
1. Enable caching headers in nginx
2. Use CDN for static assets
3. Configure database connection pooling
4. Implement Redis for session storage
5. Use Docker Swarm or Kubernetes for scaling

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Verify ports are available
netstat -an | grep :80
netstat -an | grep :5000
```

### API Connection Issues
```bash
# Test backend directly
curl http://localhost:5000/health

# Check nginx proxy
docker exec keyboard-warrior-frontend cat /etc/nginx/conf.d/default.conf
```

### Database Issues
```bash
# Access backend container
docker exec -it keyboard-warrior-backend sh

# Check database file
ls -la /app/data/
```

## 🚢 Production Deployment Options

### Option 1: Cloud Providers
- **AWS ECS/Fargate**: Use provided Dockerfiles
- **Google Cloud Run**: Deploy containers directly
- **Azure Container Instances**: Import docker-compose.yml
- **DigitalOcean App Platform**: Connect GitHub repo

### Option 2: VPS Deployment
```bash
# On your VPS
git clone <your-repo>
cd keyboard-warrior
docker-compose -f docker-compose.yml up -d
```

### Option 3: Kubernetes
Convert docker-compose to K8s manifests:
```bash
kompose convert -f docker-compose.yml
kubectl apply -f .
```

## 📝 Backup and Recovery

### Backup Database
```bash
# Create backup
docker exec keyboard-warrior-backend \
  cp /app/data/database.db /app/data/backup-$(date +%Y%m%d).db

# Copy to host
docker cp keyboard-warrior-backend:/app/data/backup-*.db ./backups/
```

### Restore Database
```bash
# Copy backup to container
docker cp ./backup.db keyboard-warrior-backend:/app/data/database.db

# Restart container
docker-compose restart backend
```

## 🔄 Updates and Maintenance

### Update Process
1. Backup database
2. Pull latest code
3. Rebuild images
4. Test in staging
5. Deploy to production

```bash
# Complete update workflow
docker-compose down
git pull origin main
docker-compose build
docker-compose up -d
```

## 📞 Support

### Resources
- Docker Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- Nginx Config: https://nginx.org/en/docs

### Container Versions
- Frontend: nginx:alpine
- Backend: node:20-alpine
- Docker Compose: v2.39.1

## ✨ Success Indicators

✅ All containers running  
✅ Health checks passing  
✅ API responding  
✅ Frontend accessible  
✅ Database connected  
✅ Logs show no errors  

---

**Deployment Complete!** 🎉

Your Keyboard Warrior application is now running in Docker containers.
Access it at: http://localhost