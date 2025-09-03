#!/bin/bash

# Staging Deployment Script for Keyboard Warrior
# This script deploys the application to staging environment

set -e  # Exit on any error

echo "🚀 Starting Keyboard Warrior Staging Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STAGING_HOST="${STAGING_HOST:-staging.keyboardwarrior.app}"
STAGING_USER="${STAGING_USER:-deploy}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/keyboard-warrior}"
BACKUP_PATH="${BACKUP_PATH:-/opt/backups/keyboard-warrior}"
DOCKER_IMAGE="${DOCKER_IMAGE:-ghcr.io/your-username/keyboard-warrior:develop}"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[STAGING]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we have the required environment variables
check_environment() {
    print_status "Checking environment variables..."
    
    if [ -z "$STAGING_HOST" ]; then
        print_error "STAGING_HOST is not set"
        exit 1
    fi
    
    if [ -z "$DEPLOY_TOKEN" ]; then
        print_warning "DEPLOY_TOKEN is not set - using SSH key authentication"
    fi
    
    print_success "Environment check passed"
}

# Check if staging server is accessible
check_server_access() {
    print_status "Checking server access..."
    
    if ssh -o ConnectTimeout=10 ${STAGING_USER}@${STAGING_HOST} "echo 'Server accessible'" > /dev/null 2>&1; then
        print_success "Server is accessible"
    else
        print_error "Cannot connect to staging server"
        exit 1
    fi
}

# Create backup of current deployment
create_backup() {
    print_status "Creating backup of current deployment..."
    
    ssh ${STAGING_USER}@${STAGING_HOST} "
        if [ -d '${DEPLOY_PATH}' ]; then
            sudo mkdir -p ${BACKUP_PATH}
            sudo cp -r ${DEPLOY_PATH} ${BACKUP_PATH}/$(date +%Y%m%d-%H%M%S)
            # Keep only last 5 backups
            sudo find ${BACKUP_PATH} -maxdepth 1 -type d -name '20*' | sort -r | tail -n +6 | xargs sudo rm -rf
            echo 'Backup created successfully'
        else
            echo 'No existing deployment to backup'
        fi
    "
    
    print_success "Backup completed"
}

# Pull latest Docker image
pull_docker_image() {
    print_status "Pulling latest Docker image..."
    
    ssh ${STAGING_USER}@${STAGING_HOST} "
        sudo docker pull ${DOCKER_IMAGE}
    "
    
    print_success "Docker image pulled"
}

# Deploy application
deploy_application() {
    print_status "Deploying application..."
    
    # Copy deployment files
    ssh ${STAGING_USER}@${STAGING_HOST} "
        sudo mkdir -p ${DEPLOY_PATH}
        cd ${DEPLOY_PATH}
        
        # Download docker-compose file
        curl -s https://raw.githubusercontent.com/your-username/keyboard-warrior/develop/docker-compose.yml -o docker-compose.yml
        
        # Set environment variables
        cat > .env << EOF
OPENAI_API_KEY=${OPENAI_API_KEY}
JWT_SECRET=${JWT_SECRET}
NODE_ENV=staging
FRONTEND_URL=https://${STAGING_HOST}
GRAFANA_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
EOF
    "
    
    # Deploy with docker-compose
    ssh ${STAGING_USER}@${STAGING_HOST} "
        cd ${DEPLOY_PATH}
        sudo docker-compose down --remove-orphans || true
        sudo docker-compose up -d
    "
    
    print_success "Application deployed"
}

# Run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Wait for application to start
    sleep 30
    
    # Check health endpoint
    for i in {1..10}; do
        if curl -f -s https://${STAGING_HOST}/health > /dev/null; then
            print_success "Health check passed"
            return 0
        fi
        print_warning "Health check attempt $i failed, retrying..."
        sleep 10
    done
    
    print_error "Health checks failed"
    return 1
}

# Run smoke tests
run_smoke_tests() {
    print_status "Running smoke tests..."
    
    # Test API endpoints
    if curl -f -s -X POST https://${STAGING_HOST}/api/arguments \
       -H "Content-Type: application/json" \
       -d '{"topic": "test deployment", "position": "staging works"}' > /dev/null; then
        print_success "API smoke test passed"
    else
        print_warning "API smoke test failed"
        return 1
    fi
    
    # Test frontend
    if curl -f -s https://${STAGING_HOST}/ > /dev/null; then
        print_success "Frontend smoke test passed"
    else
        print_warning "Frontend smoke test failed"
        return 1
    fi
    
    print_success "Smoke tests completed"
}

# Rollback deployment
rollback_deployment() {
    print_error "Deployment failed, rolling back..."
    
    ssh ${STAGING_USER}@${STAGING_HOST} "
        cd ${DEPLOY_PATH}
        sudo docker-compose down --remove-orphans || true
        
        # Find latest backup
        LATEST_BACKUP=\$(sudo find ${BACKUP_PATH} -maxdepth 1 -type d -name '20*' | sort -r | head -n 1)
        
        if [ -n \"\$LATEST_BACKUP\" ]; then
            sudo cp -r \$LATEST_BACKUP/* ${DEPLOY_PATH}/
            sudo docker-compose up -d
            echo 'Rollback completed'
        else
            echo 'No backup found for rollback'
        fi
    "
    
    print_warning "Rollback completed"
}

# Cleanup old Docker images
cleanup_images() {
    print_status "Cleaning up old Docker images..."
    
    ssh ${STAGING_USER}@${STAGING_HOST} "
        # Remove dangling images
        sudo docker image prune -f
        
        # Remove old images (keep last 3 versions)
        sudo docker images --format 'table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}' | \
        grep keyboard-warrior | \
        tail -n +4 | \
        awk '{print \$1}' | \
        xargs -r sudo docker rmi || true
    "
    
    print_success "Cleanup completed"
}

# Send deployment notification
send_notification() {
    local status=$1
    local message=$2
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 Staging Deployment: $status\n$message\nEnvironment: $STAGING_HOST\"}" \
            $SLACK_WEBHOOK_URL > /dev/null 2>&1 || true
    fi
}

# Main execution
main() {
    echo "========================================"
    echo "🎯 Keyboard Warrior Staging Deployment"
    echo "========================================"
    
    check_environment
    check_server_access
    create_backup
    pull_docker_image
    deploy_application
    
    if run_health_checks && run_smoke_tests; then
        cleanup_images
        send_notification "SUCCESS" "Deployment completed successfully"
        
        echo ""
        echo "========================================"
        print_success "🎉 Staging deployment completed successfully!"
        echo "========================================"
        echo ""
        print_status "Staging URL: https://$STAGING_HOST"
        print_status "Health Check: https://$STAGING_HOST/health"
        print_status "Grafana: https://$STAGING_HOST:3001"
        echo ""
    else
        rollback_deployment
        send_notification "FAILED" "Deployment failed and was rolled back"
        
        echo ""
        echo "========================================"
        print_error "❌ Staging deployment failed!"
        echo "========================================"
        echo ""
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --no-backup    Skip backup creation"
        echo "  --no-tests     Skip smoke tests"
        exit 0
        ;;
    --no-backup)
        export SKIP_BACKUP=true
        main
        ;;
    --no-tests)
        export SKIP_TESTS=true
        main
        ;;
    *)
        main
        ;;
esac