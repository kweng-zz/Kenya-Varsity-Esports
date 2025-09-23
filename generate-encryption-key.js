#!/usr/bin/env node

import crypto from 'crypto';

console.log('🔐 GENERATING ENCRYPTION KEY');
console.log('============================\n');

// Generate a secure encryption key (32 bytes = 256 bits)
function generateEncryptionKey() {
    return crypto.randomBytes(32).toString('base64url');
}

const encryptionKey = generateEncryptionKey();

console.log('🔑 ENCRYPTION KEY GENERATED:');
console.log('============================\n');

console.log('Variable Name: ENCRYPTION_KEY');
console.log(`Variable Value: ${encryptionKey}\n`);

console.log('📋 COPY-PASTE FORMAT:');
console.log('=====================');
console.log(`ENCRYPTION_KEY=${encryptionKey}\n`);

console.log('⚡ HOW TO ADD TO RAILWAY:');
console.log('========================');
console.log('1. Go to Railway Dashboard');
console.log('2. Click your service');
console.log('3. Settings → Environment');
console.log('4. Click "New Variable"');
console.log('5. Variable Name: ENCRYPTION_KEY');
console.log(`6. Variable Value: ${encryptionKey}`);
console.log('7. Click Save\n');

console.log('📝 NOTE:');
console.log('========');
console.log('This encryption key is used by Strapi for encrypting sensitive data.');
console.log('Keep this value secure and never share it publicly!');
console.log('If you lose this key, encrypted data cannot be decrypted.\n');

console.log('✅ COMPLETE ENVIRONMENT VARIABLES LIST:');
console.log('=======================================');
console.log('Make sure you have ALL of these in Railway:\n');

const allVars = [
    'NODE_ENV=production',
    'HOST=0.0.0.0',
    'PORT=8080',
    'DATABASE_URL=[your PostgreSQL connection string]',
    `ENCRYPTION_KEY=${encryptionKey}`,
    'API_TOKEN_SALT=[generated value]',
    'ADMIN_JWT_SECRET=[generated value]',
    'TRANSFER_TOKEN_SALT=[generated value]',
    'JWT_SECRET=[generated value]',
    'APP_KEYS=[generated comma-separated keys]'
];

allVars.forEach((variable, index) => {
    console.log(`${index + 1}. ${variable}`);
});

console.log('\n🎯 TOTAL: 10 environment variables needed for Strapi to work properly!');