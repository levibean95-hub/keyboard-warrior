# Keyboard Warrior - Deployment Guide

This guide provides comprehensive instructions for deploying the Keyboard Warrior application in various environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Docker**: v20.0.0 or higher (for containerized deployment)
- **Docker Compose**: v2.0.0 or higher

### Development Tools
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions:
  - TypeScript and JavaScript Language Features
  - Docker
  - ESLint
  - Prettier

## 🌍 Environment Configuration

### Backend Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```bash
# Core Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
FRONTEND_URL=https://your-domain.com

# Database
DB_PATH=./database/keyboard_warrior.db

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# Security
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

Copy `frontend/.env.example` to `frontend/.env` and configure:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api

# Application
VITE_APP_TITLE=Keyboard Warrior
VITE_NODE_ENV=production
```

## 🚀 Local Development

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd keyboard-warrior
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit the .env files with your configuration
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

This will start:
- Frontend development server at `http://localhost:3000`
- Backend development server at `http://localhost:5000`

### Development with Docker

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

## 🐳 Docker Deployment

### Single Container Deployment

1. **Build the production image:**
   ```bash
   docker build -t keyboard-warrior .
   ```

2. **Run the container:**
   ```bash
   docker run -p 5000:5000 \
     -e OPENAI_API_KEY=your_key_here \
     -e JWT_SECRET=your_secret_here \
     -v $(pwd)/database:/app/database \
     keyboard-warrior
   ```

### Multi-Container Deployment with Docker Compose

1. **Set up environment variables:**
   ```bash
   # Create .env file in root directory
   cat > .env << EOF
   OPENAI_API_KEY=your_openai_api_key_here
   JWT_SECRET=your_super_secret_jwt_key_here
   GRAFANA_ADMIN_PASSWORD=admin_password_here
   EOF
   ```

2. **Deploy the stack:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Application: `http://localhost:5000`
   - Grafana (monitoring): `http://localhost:3001`
   - Prometheus (metrics): `http://localhost:9090`

## 🏭 Production Deployment

### Build for Production

#### Using Build Scripts

**Linux/macOS:**
```bash
chmod +x scripts/build-production.sh
./scripts/build-production.sh
```

**Windows:**
```cmd
scripts\build-production.bat
```

#### Manual Build Process

```bash
# Install dependencies
npm run install:all

# Build backend
cd backend
npm run build
cd ..

# Build frontend
cd frontend
npm run build
cd ..
```

### Production Server Setup

#### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Application Deployment

```bash
# Create application directory
sudo mkdir -p /opt/keyboard-warrior
cd /opt/keyboard-warrior

# Copy application files
# (Upload your built application or clone from repository)

# Set up environment
cp .env.example .env
# Edit .env with production values

# Deploy with Docker Compose
docker-compose -f docker-compose.yml up -d

# Set up reverse proxy (Nginx)
sudo apt install nginx
# Configure nginx (see nginx configuration below)
```

#### 3. Nginx Configuration

Create `/etc/nginx/sites-available/keyboard-warrior`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/ssl/certs/your-domain.com.pem;
    ssl_certificate_key /etc/ssl/private/your-domain.com.key;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # API requests
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }

    # Static files
    location / {
        root /opt/keyboard-warrior/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/keyboard-warrior /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Using EC2

1. **Launch EC2 instance** (t3.medium or larger)
2. **Install Docker and Docker Compose**
3. **Follow production deployment steps**
4. **Configure security groups** (ports 80, 443, 22)
5. **Set up Elastic IP**
6. **Configure Route 53** for DNS

#### Using ECS (Elastic Container Service)

1. **Push image to ECR:**
   ```bash
   aws ecr create-repository --repository-name keyboard-warrior
   docker tag keyboard-warrior:latest <account-id>.dkr.ecr.<region>.amazonaws.com/keyboard-warrior:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/keyboard-warrior:latest
   ```

2. **Create ECS task definition**
3. **Set up ECS service with ALB**
4. **Configure auto-scaling**

### Google Cloud Platform

#### Using Cloud Run

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/keyboard-warrior

# Deploy to Cloud Run
gcloud run deploy keyboard-warrior \
  --image gcr.io/PROJECT_ID/keyboard-warrior \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=your_key_here
```

### Heroku Deployment

1. **Create Heroku app:**
   ```bash
   heroku create keyboard-warrior-app
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set OPENAI_API_KEY=your_key_here
   heroku config:set JWT_SECRET=your_secret_here
   heroku config:set NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

## 📊 Monitoring & Logging

### Built-in Monitoring

The application includes:
- Health check endpoint: `/health`
- Prometheus metrics: `:9090`
- Grafana dashboard: `:3001`

### Log Management

Logs are structured and include:
- Request/response logging
- Error tracking
- Performance metrics
- Security events

Access logs:
```bash
# Docker deployment
docker-compose logs -f app

# View specific service logs
docker logs keyboard-warrior-app -f

# Production logs
sudo journalctl -u keyboard-warrior -f
```

### Monitoring Setup

1. **Prometheus configuration** (`monitoring/prometheus.yml`)
2. **Grafana dashboards** (included in docker-compose)
3. **Alert rules** for critical metrics

## 🔍 Troubleshooting

### Common Issues

#### Application Won't Start

1. **Check environment variables:**
   ```bash
   # Verify .env files exist and are properly configured
   ls -la backend/.env frontend/.env
   ```

2. **Check database permissions:**
   ```bash
   # Ensure database directory is writable
   chmod 755 database/
   ```

3. **Verify OpenAI API key:**
   ```bash
   # Test API key
   curl -H "Authorization: Bearer $OPENAI_API_KEY" \
        https://api.openai.com/v1/models
   ```

#### Docker Issues

1. **Container fails to start:**
   ```bash
   docker logs <container_name>
   docker-compose logs app
   ```

2. **Port conflicts:**
   ```bash
   # Check for processes using required ports
   netstat -tulpn | grep :5000
   lsof -i :5000
   ```

#### Performance Issues

1. **High memory usage:**
   ```bash
   # Monitor resource usage
   docker stats
   htop
   ```

2. **Slow API responses:**
   - Check OpenAI API rate limits
   - Monitor database query performance
   - Review application logs for errors

### Health Checks

```bash
# Application health
curl http://localhost:5000/health

# Database connectivity
# Check database file exists and is accessible
ls -la database/keyboard_warrior.db

# API functionality
curl -X POST http://localhost:5000/api/arguments \
     -H "Content-Type: application/json" \
     -d '{"topic": "test", "position": "test"}'
```

### Maintenance Tasks

#### Database Backup

```bash
# Create backup
sqlite3 database/keyboard_warrior.db ".backup database/backup/$(date +%Y%m%d_%H%M%S)_keyboard_warrior.db"

# Restore from backup
sqlite3 database/keyboard_warrior.db ".restore database/backup/backup_file.db"
```

#### Log Rotation

```bash
# Set up logrotate for application logs
sudo cat > /etc/logrotate.d/keyboard-warrior << EOF
/opt/keyboard-warrior/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **HTTPS**: Always use SSL/TLS in production
3. **Rate Limiting**: Configured by default
4. **Security Headers**: Implemented via Helmet.js
5. **Input Validation**: All API endpoints are validated
6. **Database Security**: Use proper file permissions
7. **Container Security**: Run as non-root user

## 📞 Support

For deployment issues:
1. Check the logs first
2. Review this documentation
3. Check the GitHub Issues page
4. Contact the development team

---

**Last Updated**: September 2024
**Version**: 1.0.0