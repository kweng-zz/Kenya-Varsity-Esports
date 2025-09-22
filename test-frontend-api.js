#!/usr/bin/env node

/**
 * Test Frontend API Route
 * 
 * This script tests the frontend API route that's failing
 */

import https from 'https';

const FRONTEND_URL = 'https://www.kenyaesportsrankings.org';
const TEST_ENDPOINT = '/api/strapi/articles/create';

console.log('🧪 Testing Frontend API Route\n');

function testFrontendAPI() {
  return new Promise((resolve) => {
    // Create test form data
    const boundary = '----formdata-test-' + Math.random().toString(16);
    const formData = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="title"',
      '',
      'Test Article',
      `--${boundary}`,
      'Content-Disposition: form-data; name="description"',
      '',
      'Test description',
      `--${boundary}`,
      'Content-Disposition: form-data; name="content"',
      '',
      'Test content',
      `--${boundary}`,
      'Content-Disposition: form-data; name="category"',
      '',
      'Test',
      `--${boundary}`,
      'Content-Disposition: form-data; name="author"',
      '',
      'Test Author',
      `--${boundary}--`,
      ''
    ].join('\r\n');

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formData)
      }
    };

    console.log(`🔍 Testing: ${FRONTEND_URL}${TEST_ENDPOINT}`);
    console.log(`📝 Method: POST`);
    console.log(`📋 Content-Type: multipart/form-data`);
    console.log();

    const req = https.request(FRONTEND_URL + TEST_ENDPOINT, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 Response Status: ${res.statusCode}`);
        console.log(`📋 Response Headers:`);
        Object.entries(res.headers).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });
        console.log();
        
        if (data) {
          try {
            const jsonData = JSON.parse(data);
            console.log(`📄 Response Body:`);
            console.log(JSON.stringify(jsonData, null, 2));
          } catch (e) {
            console.log(`📄 Response Body (raw):`);
            console.log(data);
          }
        }
        
        console.log();
        
        // Analyze the response
        if (res.statusCode === 503) {
          console.log('❌ SERVICE UNAVAILABLE (503)');
          console.log('   This usually means:');
          console.log('   1. Missing STRAPI_API_TOKEN environment variable');
          console.log('   2. Strapi backend is not accessible');
          console.log('   3. Environment variables not deployed to Vercel');
        } else if (res.statusCode === 403) {
          console.log('🔒 FORBIDDEN (403)');
          console.log('   This means Strapi permissions need to be configured');
        } else if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ SUCCESS');
          console.log('   Article creation API is working!');
        } else {
          console.log(`⚠️ UNEXPECTED STATUS: ${res.statusCode}`);
        }
        
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request Failed:', error.message);
      resolve({ error: error.message });
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      console.log('❌ Request Timeout');
      resolve({ error: 'timeout' });
    });
    
    req.write(formData);
    req.end();
  });
}

async function main() {
  const result = await testFrontendAPI();
  
  console.log('\n📋 DIAGNOSIS:');
  console.log('─'.repeat(50));
  
  if (result.status === 503) {
    console.log('🔧 SOLUTION NEEDED:');
    console.log('1. Add STRAPI_API_TOKEN to your Vercel environment variables');
    console.log('2. Get the token from Strapi admin panel:');
    console.log('   - Go to: https://kuer-strapi-backend-production.up.railway.app/admin');
    console.log('   - Settings → API Tokens → Create new API Token');
    console.log('   - Copy the token and add to Vercel environment variables');
    console.log('3. Redeploy your frontend on Vercel');
  } else if (result.status === 403) {
    console.log('🔧 SOLUTION NEEDED:');
    console.log('1. Configure Strapi permissions for article creation');
    console.log('2. In Strapi admin: Settings → Users & Permissions → Roles → Authenticated');
    console.log('3. Enable create, update, delete permissions for Article');
  } else if (result.status === 200 || result.status === 201) {
    console.log('✅ Everything is working correctly!');
  }
}

main().catch(console.error);