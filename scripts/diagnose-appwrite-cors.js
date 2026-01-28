#!/usr/bin/env node

import { Client, Account } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Appwrite CORS Diagnostic Tool\n');

// Configuration
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

// Domains to check
const PRODUCTION_DOMAIN = 'https://kve.co.ke';
const FRANKFURT_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const TEST_ENDPOINTS = [
    ENDPOINT,
    FRANKFURT_ENDPOINT
];

if (!PROJECT_ID || !API_KEY) {
    console.log('❌ Missing required environment variables');
    process.exit(1);
}

console.log(`📋 Project ID: ${PROJECT_ID}`);
console.log(`🔌 Primary Endpoint: ${ENDPOINT}`);
console.log(`🌐 Production Domain: ${PRODUCTION_DOMAIN}`);

// Initialize client
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

async function testEndpoint(endpoint, label) {
    console.log(`\n🔧 Testing ${label} endpoint: ${endpoint}`);
    
    try {
        const testClient = new Client()
            .setEndpoint(endpoint)
            .setProject(PROJECT_ID)
            .setKey(API_KEY);
            
        const account = new Account(testClient);
        const result = await account.get();
        
        console.log(`✅ ${label} endpoint is accessible`);
        console.log(`   Project: ${result.name || result.$id}`);
        console.log(`   User ID: ${result.$id}`);
        return true;
    } catch (error) {
        console.log(`❌ ${label} endpoint failed:`, error.message);
        if (error.code) {
            console.log(`   Error code: ${error.code}`);
        }
        return false;
    }
}

async function checkPlatforms() {
    console.log('\n🌐 Checking Platform Configuration...');
    
    try {
        const platforms = await client.getPlatforms();
        const webPlatforms = platforms.platforms.filter(p => p.type === 'web');
        
        console.log(`📊 Found ${webPlatforms.length} web platform(s):`);
        
        let productionFound = false;
        webPlatforms.forEach((platform, index) => {
            const domain = platform.domain || platform.hostname;
            const isProduction = domain === PRODUCTION_DOMAIN;
            const isFrankfurt = domain.includes('fra.cloud.appwrite.io');
            
            if (isProduction) productionFound = true;
            
            console.log(`   ${index + 1}. ${domain}`);
            console.log(`      Type: ${platform.type}`);
            console.log(`      ID: ${platform.$id}`);
            if (isFrankfurt) {
                console.log(`      🇪🇺 Frankfurt region`);
            }
            if (isProduction) {
                console.log(`      🏭 PRODUCTION DOMAIN ✅`);
            }
        });

        if (!productionFound) {
            console.log(`\n❌ PRODUCTION DOMAIN NOT FOUND: ${PRODUCTION_DOMAIN}`);
            console.log('   This is likely causing your CORS errors!');
            return false;
        } else {
            console.log(`\n✅ Production domain is configured`);
            return true;
        }
    } catch (error) {
        console.log('❌ Failed to check platforms:', error.message);
        return false;
    }
}

async function testCORSHeaders() {
    console.log('\n🔍 Testing CORS Headers...');
    
    const endpoints = [
        `${ENDPOINT}/account`,
        `${FRANKFURT_ENDPOINT}/account`,
        `${ENDPOINT}/databases`,
        `${FRANKFURT_ENDPOINT}/databases`
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'OPTIONS',
                headers: {
                    'Origin': PRODUCTION_DOMAIN,
                    'Access-Control-Request-Method': 'GET',
                    'Access-Control-Request-Headers': 'content-type'
                }
            });

            console.log(`\n📡 OPTIONS ${endpoint}:`);
            console.log(`   Status: ${response.status}`);
            
            const corsHeaders = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
                'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
                'access-control-max-age': response.headers.get('access-control-max-age')
            };

            Object.entries(corsHeaders).forEach(([key, value]) => {
                if (value) {
                    console.log(`   ${key}: ${value}`);
                }
            });

            if (response.status === 204) {
                console.log(`   ✅ CORS preflight successful`);
            } else {
                console.log(`   ⚠️ Unexpected CORS response`);
            }
        } catch (error) {
            console.log(`\n❌ Failed to test ${endpoint}:`, error.message);
        }
    }
}

async function checkProjectStatus() {
    console.log('\n📊 Checking Project Status...');
    
    try {
        const account = new Account(client);
        const user = await account.get();
        
        console.log(`✅ Project is accessible`);
        console.log(`   User: ${user.name || user.email}`);
        console.log(`   User ID: ${user.$id}`);
        
        // Check if project is archived
        if (user.labels && user.labels.includes('archived')) {
            console.log(`⚠️ Project appears to be archived`);
            return false;
        }
        
        return true;
    } catch (error) {
        console.log(`❌ Project access failed:`, error.message);
        return false;
    }
}

async function generateRecommendations(platformsOk, projectOk) {
    console.log('\n💡 Recommendations:');
    console.log('==================');
    
    if (!platformsOk) {
        console.log('1. 🚨 ADD PRODUCTION DOMAIN TO PLATFORMS:');
        console.log(`   Run: node scripts/configure-appwrite-cors.js`);
        console.log('   Or add manually in Appwrite Console → Settings → Platform');
    }
    
    if (!projectOk) {
        console.log('2. 🚨 CHECK PROJECT STATUS:');
        console.log('   Ensure project is not archived');
        console.log('   Verify API key has required scopes');
    }
    
    if (platformsOk && projectOk) {
        console.log('✅ Configuration looks good!');
        console.log('\nIf CORS errors persist, try:');
        console.log('1. Clear browser cache and hard refresh (Ctrl+F5)');
        console.log('2. Check if CDN/Proxy is caching responses');
        console.log('3. Wait 5-10 minutes for platform changes to propagate');
        console.log('4. Verify your production site is using the correct endpoint');
        console.log('5. Check browser network tab for exact error details');
    }
    
    console.log('\n🔧 Useful Commands:');
    console.log(`- Configure CORS: node scripts/configure-appwrite-cors.js`);
    console.log(`- Check status: node scripts/check-appwrite-status.js`);
    console.log(`- Test connection: node scripts/test-appwrite-connection.js`);
}

// Main diagnostic flow
async function runDiagnostics() {
    console.log('🚀 Starting comprehensive CORS diagnostics...\n');
    
    // Test different endpoints
    console.log('1️⃣ Testing Endpoint Accessibility');
    const endpointResults = await Promise.all([
        testEndpoint(ENDPOINT, 'Primary'),
        testEndpoint(FRANKFURT_ENDPOINT, 'Frankfurt')
    ]);
    
    // Check project status
    console.log('\n2️⃣ Checking Project Status');
    const projectStatus = await checkProjectStatus();
    
    // Check platforms
    console.log('\n3️⃣ Checking Platform Configuration');
    const platformsOk = await checkPlatforms();
    
    // Test CORS headers
    console.log('\n4️⃣ Testing CORS Headers');
    await testCORSHeaders();
    
    // Generate recommendations
    console.log('\n5️⃣ Generating Recommendations');
    await generateRecommendations(platformsOk, projectStatus);
    
    console.log('\n🎯 Diagnostic Summary:');
    console.log('======================');
    console.log(`Endpoints: ${endpointResults.filter(r => r).length}/${endpointResults.length} accessible`);
    console.log(`Project: ${projectStatus ? '✅' : '❌'}`);
    console.log(`Platforms: ${platformsOk ? '✅' : '❌'}`);
    
    const overallStatus = endpointResults.some(r => r) && projectStatus && platformsOk;
    console.log(`Overall: ${overallStatus ? '✅ GOOD' : '❌ NEEDS ATTENTION'}`);
}

// Run diagnostics
runDiagnostics()
    .catch((error) => {
        console.error('\n❌ Diagnostic failed:', error);
        process.exit(1);
    });