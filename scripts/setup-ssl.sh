#!/bin/bash

# SSL Certificate Setup Script for Keyboard Warrior
# This script sets up SSL certificates using Let's Encrypt

set -e

echo "🔐 Setting up SSL certificates for Keyboard Warrior..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN="${DOMAIN:-localhost}"
EMAIL="${EMAIL:-admin@example.com}"
CERT_PATH="${CERT_PATH:-./nginx/ssl}"

print_status() {
    echo -e "${BLUE}[SSL]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create SSL directory
create_ssl_directory() {
    print_status "Creating SSL directory..."
    mkdir -p "$CERT_PATH"
    print_success "SSL directory created"
}

# Generate self-signed certificate for development
generate_self_signed() {
    print_status "Generating self-signed certificate for development..."
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$CERT_PATH/key.pem" \
        -out "$CERT_PATH/cert.pem" \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN"
    
    print_success "Self-signed certificate generated"
}

# Setup Let's Encrypt certificate for production
setup_letsencrypt() {
    print_status "Setting up Let's Encrypt certificate..."
    
    # Install certbot if not available
    if ! command -v certbot &> /dev/null; then
        print_status "Installing certbot..."
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get update
            sudo apt-get install -y certbot python3-certbot-nginx
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            brew install certbot
        else
            print_error "Unsupported OS for automatic certbot installation"
            exit 1
        fi
    fi
    
    # Generate certificate
    sudo certbot certonly \
        --standalone \
        --preferred-challenges http \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN"
    
    # Copy certificates to nginx directory
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$CERT_PATH/cert.pem"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$CERT_PATH/key.pem"
    sudo chmod 644 "$CERT_PATH/cert.pem"
    sudo chmod 600 "$CERT_PATH/key.pem"
    
    print_success "Let's Encrypt certificate installed"
}

# Setup certificate renewal
setup_renewal() {
    print_status "Setting up certificate renewal..."
    
    # Create renewal script
    cat > /tmp/renew-cert.sh << 'EOF'
#!/bin/bash
certbot renew --quiet --no-self-upgrade
if [ $? -eq 0 ]; then
    # Copy renewed certificates
    cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$CERT_PATH/cert.pem"
    cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$CERT_PATH/key.pem"
    
    # Restart nginx
    docker-compose restart nginx
    
    echo "Certificates renewed successfully"
fi
EOF
    
    sudo mv /tmp/renew-cert.sh /usr/local/bin/renew-keyboard-warrior-cert.sh
    sudo chmod +x /usr/local/bin/renew-keyboard-warrior-cert.sh
    
    # Add to crontab
    (sudo crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/renew-keyboard-warrior-cert.sh") | sudo crontab -
    
    print_success "Certificate renewal configured"
}

# Main execution
main() {
    echo "========================================"
    echo "🔐 SSL Certificate Setup"
    echo "========================================"
    
    create_ssl_directory
    
    if [ "$ENVIRONMENT" = "production" ]; then
        setup_letsencrypt
        setup_renewal
    else
        generate_self_signed
    fi
    
    print_success "SSL setup completed!"
    echo ""
    print_status "Certificate location: $CERT_PATH"
    print_status "Domain: $DOMAIN"
    echo ""
}

# Handle arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --help, -h        Show this help"
        echo "  --production      Use Let's Encrypt (requires valid domain)"
        echo "  --development     Use self-signed certificate (default)"
        echo ""
        echo "Environment variables:"
        echo "  DOMAIN           Domain name (default: localhost)"
        echo "  EMAIL            Email for Let's Encrypt (default: admin@example.com)"
        echo "  CERT_PATH        Certificate path (default: ./nginx/ssl)"
        exit 0
        ;;
    --production)
        export ENVIRONMENT=production
        main
        ;;
    --development)
        export ENVIRONMENT=development
        main
        ;;
    *)
        export ENVIRONMENT=development
        main
        ;;
esac