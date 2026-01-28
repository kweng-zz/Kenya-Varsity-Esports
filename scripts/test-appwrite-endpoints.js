#!/usr/bin/env node

import { Client } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client();

// Test both endpoints
const endpoints = [
    'https://cloud.appwrite.io/v1',
    'https://fra.cloud.appwrite.io/v1'
];

async function testEndpoints() {
    console.log('🔍 Testing Appwrite endpoints...\n');
    
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    
    if (!projectId || !apiKey) {
        console.log('❌ Missing environment variables');
        return;
    }
    
    for (const endpoint of endpoints) {
        console.log(`🌐 Testing: ${endpoint}`);
        
        try {
            client
                .setEndpoint(endpoint)
                .setProject(projectId)
                .setKey(apiKey);
            
            // Test with a simple API call
            const response = await fetch(`${endpoint}/account`, {
                method: 'GET',
                headers: {
                    'X-Appwrite-Project': projectId,
                    'X-Appwrite-Key': apiKey
                }
            });
            
            if (response.ok) {
                console.log(`✅ ${endpoint} - Working`);
                
                // Check CORS headers
                const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
                const corsMethods = response.headers.get('Access-Control-Allow-Methods');
                
                console.log(`   CORS Origin: ${corsOrigin || 'Not set'}`);
                console.log(`   CORS Methods: ${corsMethods || 'Not set'}`);
            } else {
                console.log(`❌ ${endpoint} - Failed (${response.status})`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint} - Error: ${error.message}`);
        }
        
        console.log('');
    }
    
    console.log('💡 Recommendations:');
    console.log('1. Use the Frankfurt endpoint: https://fra.cloud.appwrite.io/v1');
    console.log('2. Update your .env file with the correct endpoint');
    console.log('3. Restart your application after changing the endpoint');
    console.log('4. Clear browser cache and test again');
}

// Run the test
testEndpoints();