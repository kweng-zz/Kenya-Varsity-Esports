#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 RAILWAY BACKEND DEPLOYMENT FIX');
console.log('==================================\n');

console.log('❌ PROBLEM IDENTIFIED:');
console.log('Your Railway service is deploying the Next.js FRONTEND instead of the Strapi BACKEND\n');

console.log('📋 SOLUTION STEPS:');
console.log('1. Your Railway service should deploy from the kuer-backend/ directory');
console.log('2. The kuer-backend/ directory contains the proper Strapi configuration');
console.log('3. You need to either:');
console.log('   a) Change Railway root directory to kuer-backend/, OR');
console.log('   b) Move kuer-backend files to root directory\n');

console.log('🚀 RECOMMENDED APPROACH:');
console.log('Move the Strapi backend files to the root directory to fix deployment\n');

// Check if kuer-backend exists
const backendPath = path.join(process.cwd(), 'kuer-backend');
if (!fs.existsSync(backendPath)) {
    console.log('❌ Error: kuer-backend directory not found');
    process.exit(1);
}

console.log('📁 Files to move from kuer-backend/ to root:');
const backendFiles = fs.readdirSync(backendPath);
const criticalFiles = [
    'package.json',
    'Dockerfile', 
    'railway.json',
    'config/',
    'src/',
    'api/',
    'database/',
    'public/'
];

criticalFiles.forEach(file => {
    const filePath = path.join(backendPath, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} (missing)`);
    }
});

console.log('\n🔧 MANUAL STEPS REQUIRED:');
console.log('1. Go to Railway Dashboard: https://railway.app/dashboard');
console.log('2. Find your kuer-strapi-backend-production service');
console.log('3. Go to Settings > Environment');
console.log('4. Verify these environment variables are set:');

const requiredEnvVars = [
    'DATABASE_URL',
    'APP_KEYS',
    'API_TOKEN_SALT', 
    'ADMIN_JWT_SECRET',
    'TRANSFER_TOKEN_SALT',
    'JWT_SECRET',
    'NODE_ENV=production',
    'HOST=0.0.0.0',
    'PORT=8080'
];

requiredEnvVars.forEach(envVar => {
    console.log(`   - ${envVar}`);
});

console.log('\n5. In Settings > Deploy, set:');
console.log('   - Root Directory: kuer-backend');
console.log('   - OR move kuer-backend files to root');

console.log('\n6. Redeploy the service');

console.log('\n⚡ QUICK FIX OPTION:');
console.log('Run this command to move backend files to root:');
console.log('node move-backend-to-root.js');

console.log('\n🔍 VERIFICATION:');
console.log('After deployment, these endpoints should work:');
console.log('- https://kuer-strapi-backend-production.up.railway.app/admin');
console.log('- https://kuer-strapi-backend-production.up.railway.app/api');
console.log('- https://kuer-strapi-backend-production.up.railway.app/api/articles');