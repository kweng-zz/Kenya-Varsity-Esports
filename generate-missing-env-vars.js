#!/usr/bin/env node

import crypto from 'crypto';

console.log('🚨 MISSING ENVIRONMENT VARIABLES DETECTED');
console.log('=========================================\n');

console.log('❌ CURRENT VARIABLES (6/9):');
console.log('✅ ENCRYPTION_KEY');
console.log('✅ NEXT_PUBLIC_BASE_URL');
console.log('✅ NEXT_PUBLIC_STRAPI_API_TOKEN');
console.log('✅ NEXT_PUBLIC_STRAPI_URL');
console.log('✅ NODE_ENV');
console.log('✅ STRAPI_API_TOKEN\n');

console.log('❌ MISSING CRITICAL VARIABLES (3):');
console.log('❌ DATABASE_URL');
console.log('❌ APP_KEYS');
console.log('❌ JWT_SECRET\n');

// Generate secure random strings
function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('base64url');
}

console.log('🔑 GENERATED MISSING VARIABLES:');
console.log('===============================\n');

console.log('1. APP_KEYS (Required for Strapi):');
const appKeys = `${generateSecret()},${generateSecret()},${generateSecret()},${generateSecret()}`;
console.log(`APP_KEYS=${appKeys}\n`);

console.log('2. JWT_SECRET (Required for users-permissions plugin):');
const jwtSecret = generateSecret();
console.log(`JWT_SECRET=${jwtSecret}\n`);

console.log('3. DATABASE_URL (Required for database connection):');
console.log('DATABASE_URL=postgresql://username:password@host:port/database');
console.log('⚠️  You need to get this from your PostgreSQL service in Railway\n');

console.log('📋 ADDITIONAL RECOMMENDED VARIABLES:');
console.log('====================================\n');

console.log('4. HOST (Recommended):');
console.log('HOST=0.0.0.0\n');

console.log('5. PORT (Recommended):');
console.log('PORT=8080\n');

console.log('6. API_TOKEN_SALT (Recommended):');
const apiTokenSalt = generateSecret();
console.log(`API_TOKEN_SALT=${apiTokenSalt}\n`);

console.log('7. ADMIN_JWT_SECRET (Recommended):');
const adminJwtSecret = generateSecret();
console.log(`ADMIN_JWT_SECRET=${adminJwtSecret}\n`);

console.log('8. TRANSFER_TOKEN_SALT (Recommended):');
const transferTokenSalt = generateSecret();
console.log(`TRANSFER_TOKEN_SALT=${transferTokenSalt}\n`);

console.log('🚀 IMMEDIATE ACTION REQUIRED:');
console.log('=============================\n');

console.log('1. ADD THESE VARIABLES TO RAILWAY:');
console.log('   - Go to Railway Dashboard');
console.log('   - Your Service → Settings → Environment');
console.log('   - Click "New Variable" for each missing variable\n');

console.log('2. GET DATABASE_URL:');
console.log('   - If you have PostgreSQL service: copy its DATABASE_URL');
console.log('   - If not: Create new PostgreSQL service in Railway');
console.log('   - Add the DATABASE_URL to your Strapi service\n');

console.log('3. CRITICAL VARIABLES TO ADD FIRST:');
console.log(`   APP_KEYS=${appKeys}`);
console.log(`   JWT_SECRET=${jwtSecret}`);
console.log('   DATABASE_URL=[from PostgreSQL service]');
console.log('   HOST=0.0.0.0');
console.log('   PORT=8080\n');

console.log('⚡ AFTER ADDING VARIABLES:');
console.log('=========================');
console.log('1. Railway will automatically redeploy');
console.log('2. Monitor deployment logs for success');
console.log('3. Run: node diagnose-railway.cjs');
console.log('4. Strapi should start successfully\n');

console.log('🎯 SUCCESS CRITERIA:');
console.log('====================');
console.log('✅ All 9 environment variables set');
console.log('✅ PostgreSQL service running');
console.log('✅ DATABASE_URL pointing to active database');
console.log('✅ Strapi starts without errors');
console.log('✅ Health check passes at /admin');