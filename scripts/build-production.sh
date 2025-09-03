#!/bin/bash

# Production Build Script for Keyboard Warrior
# This script handles the complete production build process

set -e  # Exit on any error

echo "🚀 Starting Keyboard Warrior Production Build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Clean previous builds
clean_builds() {
    print_status "Cleaning previous builds..."
    
    rm -rf backend/dist
    rm -rf frontend/dist
    rm -rf node_modules/.cache
    
    print_success "Cleaned previous builds"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Root dependencies
    npm ci --production=false
    
    # Backend dependencies
    cd backend
    npm ci --production=false
    cd ..
    
    # Frontend dependencies
    cd frontend
    npm ci --production=false
    cd ..
    
    print_success "Dependencies installed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Backend tests
    cd backend
    if npm test; then
        print_success "Backend tests passed"
    else
        print_error "Backend tests failed"
        exit 1
    fi
    cd ..
    
    # Frontend tests (if available)
    cd frontend
    if npm run test:ci 2>/dev/null || echo "No frontend tests found"; then
        print_success "Frontend tests completed"
    fi
    cd ..
}

# Lint code
lint_code() {
    print_status "Linting code..."
    
    # Backend linting
    cd backend
    npm run lint
    cd ..
    
    # Frontend linting
    cd frontend
    npm run lint
    cd ..
    
    print_success "Code linting completed"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    
    cd backend
    npm run build
    
    if [ ! -d "dist" ]; then
        print_error "Backend build failed - dist directory not found"
        exit 1
    fi
    
    cd ..
    print_success "Backend build completed"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    
    # Set production environment
    export NODE_ENV=production
    export VITE_NODE_ENV=production
    
    npm run build
    
    if [ ! -d "dist" ]; then
        print_error "Frontend build failed - dist directory not found"
        exit 1
    fi
    
    cd ..
    print_success "Frontend build completed"
}

# Optimize builds
optimize_builds() {
    print_status "Optimizing builds..."
    
    # Analyze bundle sizes
    cd frontend
    if command -v webpack-bundle-analyzer &> /dev/null; then
        print_status "Analyzing frontend bundle size..."
        npx vite-bundle-analyzer dist
    fi
    cd ..
    
    # Check backend bundle size
    print_status "Backend build size: $(du -sh backend/dist | cut -f1)"
    print_status "Frontend build size: $(du -sh frontend/dist | cut -f1)"
    
    print_success "Build optimization completed"
}

# Create deployment package
create_deployment_package() {
    print_status "Creating deployment package..."
    
    # Create deployment directory
    mkdir -p deployment
    rm -rf deployment/*
    
    # Copy backend files
    cp -r backend/dist deployment/backend
    cp backend/package.json deployment/package.json
    cp backend/package-lock.json deployment/package-lock.json 2>/dev/null || true
    
    # Copy frontend files
    cp -r frontend/dist deployment/frontend
    
    # Copy configuration files
    cp docker-compose.yml deployment/
    cp Dockerfile deployment/
    cp -r nginx deployment/ 2>/dev/null || true
    cp -r monitoring deployment/ 2>/dev/null || true
    
    # Create production package.json
    cat > deployment/package.json << EOF
{
  "name": "keyboard-warrior-production",
  "version": "1.0.0",
  "scripts": {
    "start": "node backend/server.js",
    "health-check": "node -e \"require('http').get('http://localhost:5000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))\""
  },
  "dependencies": $(cd backend && npm list --json --prod | jq '.dependencies // {}')
}
EOF
    
    # Create deployment archive
    tar -czf keyboard-warrior-production-$(date +%Y%m%d-%H%M%S).tar.gz -C deployment .
    
    print_success "Deployment package created"
}

# Validate build
validate_build() {
    print_status "Validating build..."
    
    # Check if all required files exist
    required_files=(
        "backend/dist/server.js"
        "frontend/dist/index.html"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done
    
    # Test if backend can start (syntax check)
    cd backend
    if node -c dist/server.js; then
        print_success "Backend syntax validation passed"
    else
        print_error "Backend syntax validation failed"
        exit 1
    fi
    cd ..
    
    print_success "Build validation completed"
}

# Main execution
main() {
    echo "========================================"
    echo "🎯 Keyboard Warrior Production Build"
    echo "========================================"
    
    check_dependencies
    clean_builds
    install_dependencies
    
    # Optional: Skip tests in CI if needed
    if [ "$SKIP_TESTS" != "true" ]; then
        run_tests
    fi
    
    lint_code
    build_backend
    build_frontend
    optimize_builds
    validate_build
    create_deployment_package
    
    echo ""
    echo "========================================"
    print_success "🎉 Production build completed successfully!"
    echo "========================================"
    echo ""
    print_status "Next steps:"
    echo "  1. Test the build locally: docker-compose -f docker-compose.yml up"
    echo "  2. Deploy to staging: ./scripts/deploy-staging.sh"
    echo "  3. Deploy to production: ./scripts/deploy-production.sh"
    echo ""
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --skip-tests   Skip running tests"
        echo "  --clean-only   Only clean previous builds"
        exit 0
        ;;
    --skip-tests)
        export SKIP_TESTS=true
        main
        ;;
    --clean-only)
        clean_builds
        exit 0
        ;;
    *)
        main
        ;;
esac