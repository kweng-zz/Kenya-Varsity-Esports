#!/usr/bin/env node

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Checking Appwrite Configuration Status...\n');

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const fallbackMode = process.env.NEXT_PUBLIC_FALLBACK_MODE;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;

console.log('📋 Current Configuration:');
console.log('========================');
console.log(`Fallback Mode: ${fallbackMode === 'true' ? '✅ ENABLED (using demo data)' : '❌ DISABLED (requires Appwrite)'}`);
console.log(`Endpoint: ${endpoint || 'Not set'}`);
console.log(`Project ID: ${projectId ? (projectId === 'your_appwrite_project_id_here' ? '❌ Not configured (placeholder)' : `✅ ${projectId}`) : '❌ Not set'}`);
console.log(`Database ID: ${dbId || 'Not set'}`);
console.log(`API Key: ${apiKey ? (apiKey === 'your_appwrite_api_key_here' ? '❌ Not configured (placeholder)' : `✅ ${apiKey.substring(0, 10)}...`) : '❌ Not set'}`);

console.log('\n🎯 Status Summary:');
console.log('==================');

if (fallbackMode === 'true') {
    console.log('✅ Your application is working in FALLBACK MODE');
    console.log('   - All features are functional with demo data');
    console.log('   - No Appwrite setup required');
    console.log('   - Visit http://localhost:3000/rankings to see it in action');
    console.log('   - Admin panel available at http://localhost:3000/admin');
} else {
    console.log('⚠️  Your application is configured for APPWRITE MODE');
    
    const hasValidProjectId = projectId && projectId !== 'your_appwrite_project_id_here';
    const hasValidApiKey = apiKey && apiKey !== 'your_appwrite_api_key_here';
    
    if (hasValidProjectId && hasValidApiKey) {
        console.log('✅ Appwrite credentials appear to be configured');
        console.log('   - You can try running: npm run setup:appwrite');
        console.log('   - Then: npm run populate:appwrite');
    } else {
        console.log('❌ Appwrite credentials are not properly configured');
        console.log('\n📋 To fix this, you have two options:');
        console.log('\nOption 1: Enable Fallback Mode (Recommended for testing)');
        console.log('   - Set NEXT_PUBLIC_FALLBACK_MODE=true in your .env file');
        console.log('   - Restart your dev server: npm run dev');
        console.log('\nOption 2: Configure Appwrite');
        console.log('   - Go to https://cloud.appwrite.io');
        console.log('   - Create/access your project');
        console.log('   - Get your Project ID and API Key');
        console.log('   - Update your .env file with the real values');
        console.log('   - Run: npm run setup:appwrite');
    }
}

console.log('\n🚀 Quick Commands:');
console.log('==================');
console.log('Check this status: npm run check:appwrite');
console.log('Start application: npm run dev');
console.log('Setup Appwrite: npm run setup:appwrite');
console.log('Populate data: npm run populate:appwrite');

console.log('\n💡 Need help? Check QUICK_START.md for detailed instructions.');