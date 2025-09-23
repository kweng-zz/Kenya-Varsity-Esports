#!/usr/bin/env node

import crypto from 'crypto';

console.log('🔧 RAILWAY ENVIRONMENT VARIABLES SETUP');
console.log('======================================\n');

console.log('📋 REQUIRED ENVIRONMENT VARIABLES FOR STRAPI ON RAILWAY:');
console.log('Copy these to your Railway dashboard (Settings > Environment):\n');

// Generate secure random strings
function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('base64url');
}

const envVars = {
    'NODE_ENV': 'production',
    'HOST': '0.0.0.0',
    'PORT': '8080',
    'APP_KEYS': `${generateSecret()},${generateSecret()},${generateSecret()},${generateSecret()}`,
    'API_TOKEN_SALT': generateSecret(),
    'ADMIN_JWT_SECRET': generateSecret(),
    'TRANSFER_TOKEN_SALT': generateSecret(),
    'JWT_SECRET': generateSecret(),
    'DATABASE_URL': 'postgresql://username:password@host:port/database'
};

console.log('🔑 GENERATED ENVIRONMENT VARIABLES:');
console.log('===================================\n');

Object.entries(envVars).forEach(([key, value]) => {
    if (key === 'DATABASE_URL') {
        console.log(`${key}=${value}`);
        console.log('   ⚠️  Replace with your actual PostgreSQL connection string from Railway\n');
    } else {
        console.log(`${key}=${value}\n`);
    }
});

console.log('📝 MANUAL STEPS:');
console.log('1. Go to Railway Dashboard: https://railway.app/dashboard');
console.log('2. Find your kuer-strapi-backend-production service');
console.log('3. Go to Settings > Environment');
console.log('4. Add each environment variable above');
console.log('5. For DATABASE_URL, use the PostgreSQL connection string from Railway');
console.log('6. Save and redeploy');

console.log('\n🔍 POSTGRESQL SETUP:');
console.log('If you don\'t have a PostgreSQL database:');
console.log('1. In Railway dashboard, click "New" > "Database" > "PostgreSQL"');
console.log('2. Copy the DATABASE_URL from the PostgreSQL service');
console.log('3. Paste it as the DATABASE_URL environment variable');

console.log('\n⚡ VERIFICATION:');
console.log('After setting environment variables and redeploying:');
console.log('Run: node diagnose-railway.cjs');

console.log('\n💾 BACKUP:');
console.log('Save these environment variables securely!');
console.log('You\'ll need them if you redeploy or migrate services.');