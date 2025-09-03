#!/usr/bin/env node

/**
 * Security Secret Generator
 * 
 * This script generates cryptographically secure secrets for production deployment.
 * Run this script to generate all required secrets for your .env.production file.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

function generateHexSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

function generateUUID() {
  return crypto.randomUUID();
}

function generateJWTSecret() {
  // Generate a 512-bit (64 byte) secret for JWT
  return crypto.randomBytes(64).toString('base64');
}

function generateDatabaseKey() {
  // Generate a 256-bit (32 byte) key for database encryption
  return crypto.randomBytes(32).toString('base64');
}

function generateCSRFSecret() {
  // Generate a 256-bit (32 byte) secret for CSRF protection
  return crypto.randomBytes(32).toString('hex');
}

function generateSessionSecret() {
  // Generate a 512-bit (64 byte) secret for session management
  return crypto.randomBytes(64).toString('base64');
}

console.log(colorize('🔒 Security Secret Generator', 'bright'));
console.log(colorize('================================', 'cyan'));
console.log();

console.log(colorize('Generating cryptographically secure secrets...', 'blue'));
console.log();

// Generate all required secrets
const secrets = {
  JWT_SECRET: generateJWTSecret(),
  JWT_REFRESH_SECRET: generateJWTSecret(),
  DATABASE_ENCRYPTION_KEY: generateDatabaseKey(),
  CSRF_SECRET: generateCSRFSecret(),
  SESSION_SECRET: generateSessionSecret(),
};

// Display generated secrets
console.log(colorize('✅ Generated Secrets:', 'green'));
console.log(colorize('===================', 'green'));
console.log();

for (const [key, value] of Object.entries(secrets)) {
  console.log(colorize(`${key}=`, 'yellow') + colorize(value, 'cyan'));
  console.log();
}

// Additional secure identifiers
console.log(colorize('📋 Additional Secure Identifiers:', 'green'));
console.log(colorize('================================', 'green'));
console.log();

console.log(colorize('JWT_ISSUER=', 'yellow') + colorize(`keyboard-warrior-api-${generateHexSecret(8)}`, 'cyan'));
console.log(colorize('JWT_AUDIENCE=', 'yellow') + colorize(`keyboard-warrior-app-${generateHexSecret(8)}`, 'cyan'));
console.log();

// Generate .env.production template
const envTemplate = `# Generated Production Environment Variables
# Generated on: ${new Date().toISOString()}
# 
# ⚠️  CRITICAL SECURITY NOTICE:
# These secrets are cryptographically secure and unique.
# Store them securely and never commit to version control!

# Application Environment
NODE_ENV=production
PORT=5000

# CORS Configuration
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com

# Database Configuration
DATABASE_PATH=./database.db
DATABASE_ENCRYPTION_KEY=${secrets.DATABASE_ENCRYPTION_KEY}
DATABASE_POOL_SIZE=10
DATABASE_TIMEOUT=30000

# JWT Security Configuration
JWT_SECRET=${secrets.JWT_SECRET}
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=${secrets.JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRATION=7d
JWT_ISSUER=keyboard-warrior-api-${generateHexSecret(8)}
JWT_AUDIENCE=keyboard-warrior-app-${generateHexSecret(8)}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
STRICT_RATE_LIMIT_MAX_REQUESTS=20

# Password Security
BCRYPT_ROUNDS=12

# API Keys (SET THESE MANUALLY!)
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log
LOG_MAX_SIZE=20m
LOG_MAX_FILES=5

# Security Configuration
CSRF_SECRET=${secrets.CSRF_SECRET}
SESSION_SECRET=${secrets.SESSION_SECRET}
HELMET_CSP_DIRECTIVES=default-src 'self'; script-src 'self' 'unsafe-inline'

# SSL Configuration (for production)
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/key.pem

# Monitoring and Health Checks
HEALTH_CHECK_TIMEOUT=5000
PERFORMANCE_MONITORING_ENABLED=true

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@yourdomain.com

# Redis Configuration (for session storage and caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
`;

// Save to file
const envPath = path.join(__dirname, '..', '.env.production.generated');

try {
  fs.writeFileSync(envPath, envTemplate);
  
  console.log(colorize('💾 Configuration File Generated:', 'green'));
  console.log(colorize('==============================', 'green'));
  console.log();
  console.log(colorize(`File saved to: ${envPath}`, 'cyan'));
  console.log();
  
} catch (error) {
  console.error(colorize('❌ Error saving configuration file:', 'red'));
  console.error(error.message);
}

// Security warnings and next steps
console.log(colorize('⚠️  SECURITY WARNINGS:', 'red'));
console.log(colorize('=====================', 'red'));
console.log();
console.log(colorize('1. These secrets are highly sensitive!', 'yellow'));
console.log(colorize('2. Store them in a secure password manager', 'yellow'));
console.log(colorize('3. Never commit them to version control', 'yellow'));
console.log(colorize('4. Rotate them regularly (monthly recommended)', 'yellow'));
console.log(colorize('5. Set up monitoring for secret usage', 'yellow'));
console.log();

console.log(colorize('📋 NEXT STEPS:', 'blue'));
console.log(colorize('==============', 'blue'));
console.log();
console.log(colorize('1. Review and update .env.production.generated', 'cyan'));
console.log(colorize('2. Set your actual API keys (OpenAI, email, etc.)', 'cyan'));
console.log(colorize('3. Configure your domain and URLs', 'cyan'));
console.log(colorize('4. Test the configuration in staging first', 'cyan'));
console.log(colorize('5. Deploy to production with these secrets', 'cyan'));
console.log();

console.log(colorize('🔐 Security Validation:', 'magenta'));
console.log(colorize('======================', 'magenta'));

// Validate secret strength
for (const [key, value] of Object.entries(secrets)) {
  const entropy = value.length * Math.log2(64); // Base64 character set
  const strength = entropy >= 256 ? 'Strong' : entropy >= 128 ? 'Medium' : 'Weak';
  const color = strength === 'Strong' ? 'green' : strength === 'Medium' ? 'yellow' : 'red';
  
  console.log(`${key}: ${colorize(strength, color)} (${Math.round(entropy)} bits entropy)`);
}

console.log();
console.log(colorize('✅ All secrets generated successfully!', 'bright'));
console.log(colorize('Ready for production deployment.', 'green'));