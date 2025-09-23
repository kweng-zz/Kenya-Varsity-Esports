#!/usr/bin/env node

import crypto from 'crypto';

console.log('🔑 GENERATING ALL MISSING ENVIRONMENT VARIABLES');
console.log('===============================================\n');

// Generate secure random strings
function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('base64url');
}

function generateAppKeys() {
    return `${generateSecret()},${generateSecret()},${generateSecret()},${generateSecret()}`;
}

console.log('📋 COPY THESE VALUES TO RAILWAY DASHBOARD:');
console.log('==========================================\n');

const envVars = [
    {
        name: 'API_TOKEN_SALT',
        value: generateSecret(),
        description: 'Required for admin API tokens'
    },
    {
        name: 'ADMIN_JWT_SECRET', 
        value: generateSecret(),
        description: 'Required for admin authentication'
    },
    {
        name: 'TRANSFER_TOKEN_SALT',
        value: generateSecret(), 
        description: 'Required for transfer tokens'
    },
    {
        name: 'JWT_SECRET',
        value: generateSecret(),
        description: 'Required for users-permissions plugin'
    },
    {
        name: 'APP_KEYS',
        value: generateAppKeys(),
        description: 'Required for Strapi security (4 comma-separated keys)'
    },
    {
        name: 'HOST',
        value: '0.0.0.0',
        description: 'Required for Railway deployment'
    },
    {
        name: 'PORT',
        value: '8080',
        description: 'Required for Railway port binding'
    }
];

console.log('🚀 ADD THESE TO RAILWAY (one by one):');
console.log('=====================================\n');

envVars.forEach((envVar, index) => {
    console.log(`${index + 1}. Variable Name: ${envVar.name}`);
    console.log(`   Variable Value: ${envVar.value}`);
    console.log(`   Description: ${envVar.description}\n`);
});

console.log('📝 STEP-BY-STEP INSTRUCTIONS:');
console.log('=============================');
console.log('1. Go to Railway Dashboard');
console.log('2. Click on your service');
console.log('3. Go to Settings → Environment');
console.log('4. For each variable above:');
console.log('   - Click "New Variable"');
console.log('   - Enter the Variable Name exactly as shown');
console.log('   - Enter the Variable Value exactly as shown');
console.log('   - Click Save');
console.log('5. Railway will redeploy automatically after each variable\n');

console.log('⚡ QUICK COPY-PASTE FORMAT:');
console.log('===========================');
console.log('Copy these one by one into Railway:\n');

envVars.forEach(envVar => {
    console.log(`${envVar.name}=${envVar.value}`);
});

console.log('\n🎯 EXPECTED SEQUENCE:');
console.log('=====================');
console.log('1. Add API_TOKEN_SALT → Error will change to next missing variable');
console.log('2. Add ADMIN_JWT_SECRET → Error will change to next missing variable');
console.log('3. Add TRANSFER_TOKEN_SALT → Error will change to next missing variable');
console.log('4. Add JWT_SECRET → Error will change to next missing variable');
console.log('5. Add APP_KEYS → Error will change to next missing variable');
console.log('6. Add HOST and PORT → Strapi should start successfully!');

console.log('\n✅ SUCCESS INDICATORS:');
console.log('======================');
console.log('When all variables are added, you should see:');
console.log('   "Server started on port 8080"');
console.log('   "Admin panel available at /admin"');
console.log('   No error messages');
console.log('   Health check passing');

console.log('\n🔍 FINAL VERIFICATION:');
console.log('======================');
console.log('After all variables are added and Strapi starts:');
console.log('Run: node diagnose-railway.cjs');
console.log('All endpoints should return 200 OK status!');