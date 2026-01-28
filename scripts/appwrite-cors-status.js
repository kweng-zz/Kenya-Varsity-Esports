#!/usr/bin/env node

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔑 Appwrite API Key Configuration Guide\n');

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID) {
    console.log('❌ NEXT_PUBLIC_APPWRITE_PROJECT_ID not found in .env');
    process.exit(1);
}

console.log(`📋 Project ID: ${PROJECT_ID}`);
console.log(`🔑 Current API Key: ${API_KEY ? API_KEY.substring(0, 10) + '...' : 'Not configured'}`);

console.log('\n🎯 CORS Status Analysis:');
console.log('========================');

console.log('\n✅ GOOD NEWS: Your CORS is likely already working!');
console.log('   - The diagnostic showed "access-control-allow-origin: https://kve.co.ke"');
console.log('   - This means your production domain is already configured');

console.log('\n⚠️  However, your API key lacks platform management scopes');
console.log('   - Current key cannot add/remove platforms');
console.log('   - This is fine for normal app operation');

console.log('\n🔧 If you need to manage platforms in the future:');

console.log('\n1️⃣  Create a New API Key with Platform Scopes:');
console.log('============================================');
console.log(`\n   Go to: https://cloud.appwrite.io/project/${PROJECT_ID}/keys`);
console.log('\n   Click "Create API Key" and configure:');
console.log('   - Name: "Platform Management Key"');
console.log('   - Scopes (select these):');
console.log('     ✅ platforms.read');
console.log('     ✅ platforms.write');
console.log('     ✅ users.read');
console.log('     ✅ users.write');
console.log('     ✅ databases.read');
console.log('     ✅ databases.write');
console.log('     ✅ collections.read');
console.log('     ✅ collections.write');
console.log('     ✅ documents.read');
console.log('     ✅ documents.write');

console.log('\n2️⃣  Update Your .env File:');
console.log('========================');
console.log('   Replace your current APPWRITE_API_KEY with the new key');
console.log('   Then you can run: npm run configure:appwrite-cors');

console.log('\n🎯 Current CORS Status:');
console.log('====================');
console.log('✅ Production domain (https://kve.co.ke) appears to be configured');
console.log('✅ CORS headers are being returned correctly');
console.log('✅ Both endpoints (cloud and frankfurt) allow your domain');

console.log('\n🚀 If you\'re still seeing CORS errors:');
console.log('====================================');
console.log('1. Clear browser cache and hard refresh (Ctrl+F5)');
console.log('2. Check browser Network tab for exact error details');
console.log('3. Verify your production site uses the correct endpoint');
console.log('4. Wait 5-10 minutes for any recent changes to propagate');
console.log('5. Check if CDN/Proxy is caching old CORS responses');

console.log('\n🔍 Quick Test Commands:');
console.log('======================');
console.log('- Diagnose CORS: npm run diagnose:appwrite-cors');
console.log('- Test connection: npm run test:appwrite');
console.log('- Check status: npm run check:appwrite');

console.log('\n📋 Manual Platform Management (if needed):');
console.log('==========================================');
console.log(`1. Go to: https://cloud.appwrite.io/project/${PROJECT_ID}/settings/platform`);
console.log('2. Click "Add Platform" → "Web"');
console.log('3. Enter: https://kve.co.ke');
console.log('4. Click "Create"');

console.log('\n💡 Summary:');
console.log('===========');
console.log('Your CORS is likely already working correctly!');
console.log('The API key scope issue only affects platform management,');
console.log('not normal app operations or CORS functionality.');