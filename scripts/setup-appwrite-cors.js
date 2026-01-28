#!/usr/bin/env node

import { Client } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client();

// Configure client
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

async function setupCORS() {
    try {
        console.log('🔧 Configuring CORS for Appwrite project...');
        
        // Check environment variables
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const apiKey = process.env.APPWRITE_API_KEY;
        
        if (!projectId) {
            console.log('❌ NEXT_PUBLIC_APPWRITE_PROJECT_ID not found in .env');
            return;
        }
        
        if (!apiKey) {
            console.log('❌ APPWRITE_API_KEY not found in .env');
            return;
        }
        
        console.log(`📋 Project ID: ${projectId}`);
        console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
        
        // For Appwrite, CORS is configured at the project level
        // We need to use the API with platform-wide permissions to add domains
        const productionDomain = 'https://kve.co.ke';
        const localhostDomains = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001'
        ];
        
        // List of all allowed domains
        const allowedDomains = [productionDomain, ...localhostDomains];
        
        console.log('\n🌐 Adding domains to CORS allowlist:');
        allowedDomains.forEach(domain => {
            console.log(`   - ${domain}`);
        });
        
        // Note: This requires API key with platform scopes
        // If using project-scoped API key, CORS must be configured via Appwrite Console
        console.log('\n⚠️  Note about CORS configuration:');
        console.log('CORS can be configured in two ways:');
        console.log('');
        console.log('Option 1: Via Appwrite Console (Recommended)');
        console.log('1. Go to https://cloud.appwrite.io');
        console.log('2. Select your project');
        console.log('3. Go to Settings → CORS');
        console.log('4. Add these domains:');
        allowedDomains.forEach(domain => {
            console.log(`   - ${domain}`);
        });
        console.log('');
        console.log('Option 2: Via API (Requires platform-scoped API key)');
        console.log('1. Create API key with platform scopes');
        console.log('2. Use /v1/projects/{projectId}/cors endpoint');
        console.log('');
        
        // Test current CORS configuration
        console.log('🧪 Testing CORS configuration...');
        
        try {
            // Try to access a simple endpoint to test CORS
            const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/health`, {
                method: 'GET',
                headers: {
                    'Origin': productionDomain,
                    'Access-Control-Request-Method': 'GET',
                    'Access-Control-Request-Headers': 'content-type'
                }
            });
            
            if (response.ok) {
                const corsHeaders = response.headers.get('Access-Control-Allow-Origin');
                if (corsHeaders) {
                    console.log('✅ CORS headers detected:', corsHeaders);
                } else {
                    console.log('⚠️ No CORS headers in response (may be preflight issue)');
                }
            }
        } catch (testError) {
            console.log('⚠️ CORS test failed:', testError.message);
        }
        
        console.log('\n🚀 CORS Setup Instructions:');
        console.log('1. Go to Appwrite Console: https://cloud.appwrite.io');
        console.log('2. Select your project:', projectId);
        console.log('3. Navigate to Settings → CORS');
        console.log('4. Add the following domains:');
        allowedDomains.forEach(domain => {
            console.log(`   - ${domain}`);
        });
        console.log('5. Save the configuration');
        console.log('6. Wait 2-3 minutes for changes to propagate');
        console.log('7. Clear browser cache and test your site');
        console.log('');
        console.log('💡 Additional Tips:');
        console.log('- Ensure you use the correct Appwrite endpoint URL');
        console.log('- Check if you need to specify the Frankfurt region endpoint');
        console.log('- Some CDNs may cache CORS responses, so cache clearing helps');
        
    } catch (error) {
        console.error('❌ CORS setup failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response);
        }
    }
}

// Run the setup
setupCORS();