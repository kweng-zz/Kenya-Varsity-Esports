#!/usr/bin/env node

import crypto from 'crypto';

console.log('🔐 Generating Strapi Security Keys for Railway Deployment\n');

// Generate APP_KEYS (4 keys)
const appKeys = [];
for (let i = 0; i < 4; i++) {
  appKeys.push(crypto.randomBytes(16).toString('base64'));
}

// Generate other secrets
const jwtSecret = crypto.randomBytes(64).toString('base64');
const adminJwtSecret = crypto.randomBytes(64).toString('base64');
const apiTokenSalt = crypto.randomBytes(16).toString('base64');
const transferTokenSalt = crypto.randomBytes(16).toString('base64');

console.log('Copy these environment variables to your Railway dashboard:\n');
console.log('APP_KEYS=' + appKeys.join(','));
console.log('JWT_SECRET=' + jwtSecret);
console.log('ADMIN_JWT_SECRET=' + adminJwtSecret);
console.log('API_TOKEN_SALT=' + apiTokenSalt);
console.log('TRANSFER_TOKEN_SALT=' + transferTokenSalt);

console.log('\n✅ Keys generated successfully!');
console.log('📝 Add these to your Railway environment variables.');