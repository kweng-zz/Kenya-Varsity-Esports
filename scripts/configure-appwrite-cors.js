#!/usr/bin/env node

import { Client } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🌐 Configuring Appwrite CORS and Platforms...\n');

// Configuration
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

// Production domain that needs to be added
const PRODUCTION_DOMAIN = 'https://kve.co.ke';
// Local development domains
const LOCAL_DOMAINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000',
    'https://localhost:3001'
];

if (!PROJECT_ID || !API_KEY) {
    console.log('❌ Missing required environment variables:');
    console.log('- NEXT_PUBLIC_APPWRITE_PROJECT_ID:', PROJECT_ID ? '✅' : '❌');
    console.log('- APPWRITE_API_KEY:', API_KEY ? '✅' : '❌');
    console.log('\nPlease check your .env file and try again.');
    process.exit(1);
}

console.log(`📋 Project ID: ${PROJECT_ID}`);
console.log(`🔌 Endpoint: ${ENDPOINT}`);
console.log(`🌐 Adding domain: ${PRODUCTION_DOMAIN}`);

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

async function configurePlatform() {
    try {
        console.log('\n🔧 Configuring Web Platform for CORS...');
        
        // First, try to get existing platforms
        let existingPlatforms = [];
        try {
            // Try to list platforms (this may not be available in all SDK versions)
            const platformsList = await client.teams.list();
            existingPlatforms = platformsList.teams || [];
            console.log('⚠️ Platform listing not available in this SDK version');
        } catch (error) {
            console.log('⚠️ Cannot fetch existing platforms (may not be supported by SDK):', error.message);
        }

        // Check if production domain already exists
        const productionExists = existingPlatforms.some(platform => 
            (platform.domain === PRODUCTION_DOMAIN || platform.hostname === PRODUCTION_DOMAIN) && 
            platform.type === 'web'
        );

        if (productionExists) {
            console.log(`✅ Production domain ${PRODUCTION_DOMAIN} already exists`);
        } else {
            console.log(`➕ Adding production domain: ${PRODUCTION_DOMAIN}`);
            
            try {
                await client.createPlatform('web', PRODUCTION_DOMAIN);
                console.log(`✅ Successfully added ${PRODUCTION_DOMAIN} to allowed platforms`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️ Platform ${PRODUCTION_DOMAIN} already exists (conflict)`);
                } else {
                    throw error;
                }
            }
        }

        // Add local development domains if they don't exist
        for (const domain of LOCAL_DOMAINS) {
            const localExists = existingPlatforms.some(platform => 
                (platform.domain === domain || platform.hostname === domain) && 
                platform.type === 'web'
            );

            if (!localExists) {
                try {
                    await client.createPlatform('web', domain);
                    console.log(`✅ Added development domain: ${domain}`);
                } catch (error) {
                    if (error.code === 409) {
                        console.log(`ℹ️ Development domain ${domain} already exists`);
                    } else {
                        console.log(`⚠️ Could not add ${domain}:`, error.message);
                    }
                }
            } else {
                console.log(`✅ Development domain already exists: ${domain}`);
            }
        }

        // Verify the configuration
        console.log('\n🔍 Verifying platform configuration...');
        const updatedPlatforms = await client.getPlatforms();
        const webPlatforms = updatedPlatforms.platforms.filter(p => p.type === 'web');
        
        console.log(`\n📊 Current Web Platforms (${webPlatforms.length}):`);
        webPlatforms.forEach((platform, index) => {
            const domain = platform.domain || platform.hostname;
            const isProduction = domain === PRODUCTION_DOMAIN;
            const isLocal = LOCAL_DOMAINS.includes(domain);
            
            console.log(`   ${index + 1}. ${domain} ${isProduction ? '🏭' : isLocal ? '🏠' : '🌐'}`);
        });

        console.log('\n🎉 CORS configuration completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Wait a few minutes for the changes to propagate');
        console.log('2. Test your production site at https://kve.co.ke');
        console.log('3. If CORS errors persist, you may need to:');
        console.log('   - Clear your browser cache');
        console.log('   - Restart your production server');
        console.log('   - Check if any CDN/Proxy is caching old responses');

    } catch (error) {
        console.error('❌ Failed to configure platform:', error);
        
        if (error.code === 401) {
            console.log('\n🔑 Authentication error. Please check:');
            console.log('- Your API key is valid');
            console.log('- API key has "platforms.write" scope');
            console.log('- API key has "platforms.read" scope');
        } else if (error.code === 403) {
            console.log('\n🚫 Permission error. Your API key may lack the required scopes.');
        }
        
        process.exit(1);
    }
}

async function showAlternativeInstructions() {
    console.log('\n🔧 Alternative: Manual Configuration');
    console.log('===================================');
    console.log('If the automatic configuration fails, you can add the domain manually:');
    console.log('\n1. Go to your Appwrite Console:');
    console.log(`   https://cloud.appwrite.io/project/${PROJECT_ID}`);
    console.log('\n2. Navigate to: Settings → Platform');
    console.log('\n3. Click "Add Platform" and select "Web"');
    console.log(`\n4. Enter the domain: ${PRODUCTION_DOMAIN}`);
    console.log('\n5. Click "Create" to save');
    console.log('\n6. Repeat for local development domains if needed:');
    LOCAL_DOMAINS.forEach(domain => {
        console.log(`   - ${domain}`);
    });
}

// Run the configuration
configurePlatform()
    .then(() => {
        console.log('\n✅ Platform configuration script completed');
    })
    .catch((error) => {
        console.error('\n❌ Configuration failed:', error.message);
        showAlternativeInstructions();
        process.exit(1);
    });