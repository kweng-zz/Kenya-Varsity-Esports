#!/usr/bin/env node

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🌐 Configuring Appwrite Platforms via REST API...\n');

// Configuration
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

// Production domain that needs to be added
const PRODUCTION_DOMAIN = 'https://kve.co.ke';
// Local development domains
const LOCAL_DOMAINS = [
    'http://localhost:3000',
    'http://localhost:3001'
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
console.log(`🌐 Production Domain: ${PRODUCTION_DOMAIN}`);

async function makeRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
}

async function listPlatforms() {
    try {
        console.log('📋 Fetching existing platforms...');
        const response = await makeRequest(`${ENDPOINT}/projects/${PROJECT_ID}/platforms`);
        console.log(`✅ Found ${response.total} existing platform(s)`);
        
        response.platforms.forEach((platform, index) => {
            console.log(`   ${index + 1}. ${platform.type} - ${platform.domain}`);
        });
        
        return response.platforms;
    } catch (error) {
        console.log('⚠️ Could not fetch existing platforms:', error.message);
        return [];
    }
}

async function addPlatform(domain, type = 'web') {
    try {
        console.log(`➕ Adding ${type} platform: ${domain}`);
        
        const response = await makeRequest(`${ENDPOINT}/projects/${PROJECT_ID}/platforms`, {
            method: 'POST',
            body: JSON.stringify({
                type: type,
                domain: domain
            })
        });
        
        console.log(`✅ Successfully added ${domain}`);
        return response;
    } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`ℹ️ Platform ${domain} already exists`);
            return null;
        }
        throw error;
    }
}

async function deletePlatform(platformId) {
    try {
        console.log(`🗑️ Removing platform: ${platformId}`);
        await makeRequest(`${ENDPOINT}/projects/${PROJECT_ID}/platforms/${platformId}`, {
            method: 'DELETE'
        });
        console.log(`✅ Successfully removed platform ${platformId}`);
    } catch (error) {
        console.log(`⚠️ Could not remove platform ${platformId}:`, error.message);
    }
}

async function configurePlatform() {
    try {
        // Get existing platforms
        const existingPlatforms = await listPlatforms();
        
        // Check if production domain already exists
        const productionExists = existingPlatforms.some(platform => 
            platform.domain === PRODUCTION_DOMAIN && platform.type === 'web'
        );

        if (productionExists) {
            console.log(`✅ Production domain ${PRODUCTION_DOMAIN} already configured`);
        } else {
            console.log(`➕ Adding production domain: ${PRODUCTION_DOMAIN}`);
            await addPlatform(PRODUCTION_DOMAIN, 'web');
        }

        // Add local development domains if they don't exist
        for (const domain of LOCAL_DOMAINS) {
            const localExists = existingPlatforms.some(platform => 
                platform.domain === domain && platform.type === 'web'
            );

            if (!localExists) {
                await addPlatform(domain, 'web');
            } else {
                console.log(`✅ Development domain already exists: ${domain}`);
            }
        }

        // Verify the configuration
        console.log('\n🔍 Verifying platform configuration...');
        const updatedPlatforms = await listPlatforms();
        const webPlatforms = updatedPlatforms.filter(p => p.type === 'web');
        
        console.log(`\n📊 Current Web Platforms (${webPlatforms.length}):`);
        webPlatforms.forEach((platform, index) => {
            const domain = platform.domain;
            const isProduction = domain === PRODUCTION_DOMAIN;
            const isLocal = LOCAL_DOMAINS.includes(domain);
            
            console.log(`   ${index + 1}. ${domain} ${isProduction ? '🏭' : isLocal ? '🏠' : '🌐'} [ID: ${platform.$id}]`);
        });

        // Check if production domain is now configured
        const productionConfigured = webPlatforms.some(platform => platform.domain === PRODUCTION_DOMAIN);
        
        if (productionConfigured) {
            console.log('\n🎉 CORS configuration completed successfully!');
            console.log('\n📋 Next steps:');
            console.log('1. Wait a few minutes for the changes to propagate');
            console.log('2. Test your production site at https://kve.co.ke');
            console.log('3. If CORS errors persist, try:');
            console.log('   - Clear browser cache and hard refresh (Ctrl+F5)');
            console.log('   - Restart your production server');
            console.log('   - Check browser network tab for exact error details');
        } else {
            console.log('\n⚠️ Production domain may not have been added successfully');
            console.log('Please add it manually in the Appwrite Console');
        }

    } catch (error) {
        console.error('❌ Failed to configure platforms:', error);
        
        if (error.message.includes('401')) {
            console.log('\n🔑 Authentication error. Please check:');
            console.log('- Your API key is valid');
            console.log('- API key has "platforms.write" scope');
            console.log('- API key has "platforms.read" scope');
        } else if (error.message.includes('403')) {
            console.log('\n🚫 Permission error. Your API key may lack the required scopes.');
        } else if (error.message.includes('404')) {
            console.log('\n🔍 Project not found. Check your Project ID.');
        }
        
        process.exit(1);
    }
}

async function showAlternativeInstructions() {
    console.log('\n🔧 Alternative: Manual Configuration');
    console.log('===================================');
    console.log('If the automatic configuration fails, add the domain manually:');
    console.log('\n1. Go to your Appwrite Console:');
    console.log(`   https://cloud.appwrite.io/project/${PROJECT_ID}`);
    console.log('\n2. Navigate to: Settings → Platform');
    console.log('\n3. Click "Add Platform" and select "Web"');
    console.log(`\n4. Enter the domain: ${PRODUCTION_DOMAIN}`);
    console.log('\n5. Click "Create" to save');
    console.log('\n6. For local development, also add:');
    LOCAL_DOMAINS.forEach(domain => {
        console.log(`   - ${domain}`);
    });
    
    console.log('\n🔧 Required API Key Scopes:');
    console.log('- platforms.read');
    console.log('- platforms.write');
    console.log('- users.read');
    console.log('- users.write');
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