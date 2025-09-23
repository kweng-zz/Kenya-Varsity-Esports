#!/usr/bin/env node

console.log('🔍 CHECKING MISSING ENVIRONMENT VARIABLES');
console.log('=========================================\n');

console.log('✅ VARIABLES YOU HAVE SET:');
const setVars = [
    'ADMIN_JWT_SECRET',
    'API_TOKEN_SALT', 
    'APP_KEYS',
    'HOST',
    'JWT_SECRET',
    'NODE_ENV',
    'TRANSFER_TOKEN_SALT'
];

setVars.forEach(varName => {
    console.log(`   ✅ ${varName}`);
});

console.log('\n❌ MISSING CRITICAL VARIABLES:');
console.log('   ❌ PORT=8080');
console.log('   ❌ DATABASE_URL=postgresql://...');

console.log('\n🔧 ADD THESE TO RAILWAY DASHBOARD:');
console.log('==================================');
console.log('Variable Name: PORT');
console.log('Variable Value: 8080');
console.log('');
console.log('Variable Name: DATABASE_URL');
console.log('Variable Value: [Your PostgreSQL connection string]');

console.log('\n📋 HOW TO GET DATABASE_URL:');
console.log('1. In Railway dashboard, look for a PostgreSQL service');
console.log('2. If you don\'t have one, create: New → Database → PostgreSQL');
console.log('3. Click on the PostgreSQL service');
console.log('4. Go to Variables tab');
console.log('5. Copy the DATABASE_URL value');
console.log('6. Add it to your Strapi service environment variables');

console.log('\n⚡ AFTER ADDING MISSING VARIABLES:');
console.log('1. Railway will automatically redeploy');
console.log('2. Wait 2-3 minutes for deployment');
console.log('3. Run: node diagnose-railway.cjs');

console.log('\n🚨 IMPORTANT:');
console.log('Without DATABASE_URL, Strapi cannot start!');
console.log('Without PORT=8080, Railway cannot route traffic correctly!');