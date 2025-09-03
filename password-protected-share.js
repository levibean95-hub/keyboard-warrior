// Simple password-protected proxy server
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const basicAuth = require('express-basic-auth');
const app = express();

// Set your custom username and password here
const USERNAME = 'KBW';
const PASSWORD = 'KBWPass';

console.log('========================================');
console.log('   PASSWORD-PROTECTED SHARING');
console.log('========================================');
console.log(`Username: ${USERNAME}`);
console.log(`Password: ${PASSWORD}`);
console.log('========================================\n');

// Basic authentication
app.use(basicAuth({
    users: { [USERNAME]: PASSWORD },
    challenge: true,
    realm: 'Keyboard Warrior Access'
}));

// Proxy all requests to your frontend dev server
app.use('/', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true
}));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Password-protected proxy running on port ${PORT}`);
    console.log(`\nTo share with friends:`);
    console.log(`1. Run: lt --port ${PORT}`);
    console.log(`2. Share the URL with username and password\n`);
});