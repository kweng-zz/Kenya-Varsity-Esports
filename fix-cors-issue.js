#!/usr/bin/env node

/**
 * CORS Issue Fix Script
 * 
 * This script helps diagnose and fix the CORS issue you're experiencing.
 * The problem is that your frontend is trying to access the wrong Strapi URL.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URLs to test
const CORRECT_STRAPI_URL = 'https://kuer-strapi-backend-production.up.railway.app';
const WRONG_STRAPI_URL = 'https://kuer-production.up.railway.app';
const FRONTEND_URL = 'https://www.kenyaesportsrankings.org';

console.log('🔍 CORS Issue Diagnosis\n');

// Function to test URL
function testURL(url) {
  return new Promise((resolve) => {
    const req = https.request(url + '/api/articles', { method: 'HEAD' }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        headers: res.headers,
        accessible: res.statusCode < 400
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        error: error.message,
        accessible: false
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        accessible: false
      });
    });
    
    req.end();
  });
}

// Function to test CORS
function testCORS(strapiUrl, origin) {
  return new Promise((resolve) => {
    const options = {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };
    
    const req = https.request(strapiUrl + '/api/articles', options, (res) => {
      const corsHeaders = {
        'access-control-allow-origin': res.headers['access-control-allow-origin'],
        'access-control-allow-methods': res.headers['access-control-allow-methods'],
        'access-control-allow-headers': res.headers['access-control-allow-headers']
      };
      
      resolve({
        status: res.statusCode,
        corsHeaders,
        corsEnabled: !!res.headers['access-control-allow-origin']
      });
    });
    
    req.on('error', (error) => {
      resolve({
        status: 'ERROR',
        error: error.message,
        corsEnabled: false
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        corsEnabled: false
      });
    });
    
    req.end();
  });
}

async function main() {
  console.log('1. Testing Strapi URLs...\n');
  
  // Test both URLs
  const correctTest = await testURL(CORRECT_STRAPI_URL);
  const wrongTest = await testURL(WRONG_STRAPI_URL);
  
  console.log(`✅ Correct URL (${CORRECT_STRAPI_URL}):`);
  console.log(`   Status: ${correctTest.status}`);
  console.log(`   Accessible: ${correctTest.accessible ? '✅ YES' : '❌ NO'}`);
  if (correctTest.headers && correctTest.headers['x-powered-by']) {
    console.log(`   Powered by: ${correctTest.headers['x-powered-by']}`);
  }
  console.log();
  
  console.log(`❌ Wrong URL (${WRONG_STRAPI_URL}):`);
  console.log(`   Status: ${wrongTest.status}`);
  console.log(`   Accessible: ${wrongTest.accessible ? '✅ YES' : '❌ NO'}`);
  if (wrongTest.error) {
    console.log(`   Error: ${wrongTest.error}`);
  }
  console.log();
  
  // Test CORS if correct URL is accessible
  if (correctTest.accessible) {
    console.log('2. Testing CORS configuration...\n');
    
    const corsTest = await testCORS(CORRECT_STRAPI_URL, FRONTEND_URL);
    console.log(`CORS Test from ${FRONTEND_URL}:`);
    console.log(`   Status: ${corsTest.status}`);
    console.log(`   CORS Enabled: ${corsTest.corsEnabled ? '✅ YES' : '❌ NO'}`);
    
    if (corsTest.corsHeaders) {
      console.log('   CORS Headers:');
      Object.entries(corsTest.corsHeaders).forEach(([key, value]) => {
        if (value) {
          console.log(`     ${key}: ${value}`);
        }
      });
    }
    console.log();
  }
  
  // Check local .env file
  console.log('3. Checking local .env file...\n');
  
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const strapiUrlMatch = envContent.match(/NEXT_PUBLIC_STRAPI_URL=(.+)/);
    
    if (strapiUrlMatch) {
      const localStrapiUrl = strapiUrlMatch[1].trim();
      console.log(`Local .env STRAPI_URL: ${localStrapiUrl}`);
      
      if (localStrapiUrl === CORRECT_STRAPI_URL) {
        console.log('✅ Local .env has correct URL');
      } else {
        console.log('❌ Local .env has incorrect URL');
        console.log(`   Should be: ${CORRECT_STRAPI_URL}`);
      }
    } else {
      console.log('❌ NEXT_PUBLIC_STRAPI_URL not found in .env');
    }
  } else {
    console.log('❌ .env file not found');
  }
  console.log();
  
  // Provide solutions
  console.log('🔧 SOLUTIONS:\n');
  
  console.log('1. **Update your deployment environment variables:**');
  console.log('   If you\'re using Vercel:');
  console.log('   - Go to your Vercel dashboard');
  console.log('   - Navigate to your project settings');
  console.log('   - Update NEXT_PUBLIC_STRAPI_URL to:');
  console.log(`     ${CORRECT_STRAPI_URL}`);
  console.log();
  
  console.log('2. **Redeploy your frontend:**');
  console.log('   - After updating environment variables');
  console.log('   - Trigger a new deployment');
  console.log('   - Clear browser cache');
  console.log();
  
  console.log('3. **Verify the fix:**');
  console.log('   - Check browser network tab');
  console.log('   - Ensure requests go to the correct URL');
  console.log(`   - Should see: ${CORRECT_STRAPI_URL}/api/articles`);
  console.log(`   - Should NOT see: ${WRONG_STRAPI_URL}/api/articles`);
  console.log();
  
  console.log('4. **If CORS still fails after URL fix:**');
  console.log('   - The backend CORS config has been updated');
  console.log('   - Redeploy your Strapi backend');
  console.log('   - Wait a few minutes for Railway to update');
  console.log();
  
  console.log('📋 SUMMARY:');
  console.log(`   ✅ Correct Strapi URL: ${CORRECT_STRAPI_URL}`);
  console.log(`   ❌ Wrong URL being used: ${WRONG_STRAPI_URL}`);
  console.log('   🔧 Fix: Update deployment environment variables');
  console.log('   🚀 Then: Redeploy frontend');
}

main().catch(console.error);