#!/usr/bin/env node

const https = require('https');
const http = require('http');

console.log('🧪 Testing Strapi Backend Connectivity...\n');

const testEndpoints = [
  'https://kuer-strapi-backend-production.up.railway.app',
  'https://kuer-strapi-backend-production.up.railway.app/admin',
  'https://kuer-strapi-backend-production.up.railway.app/api/articles'
];

async function testEndpoint(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let statusIcon = '✅';
      if (res.statusCode >= 400) {
        statusIcon = '❌';
      } else if (res.statusCode >= 300) {
        statusIcon = '⚠️';
      }
      
      console.log(`${statusIcon} ${url}`);
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      
      // Check for CORS headers
      const corsHeader = res.headers['access-control-allow-origin'];
      if (corsHeader) {
        console.log(`   CORS: ${corsHeader}`);
      } else {
        console.log(`   CORS: ❌ No Access-Control-Allow-Origin header`);
      }
      
      console.log('');
      resolve({ url, status: res.statusCode, success: res.statusCode < 400, cors: !!corsHeader });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${url}`);
      console.log(`   Error: ${error.message}`);
      console.log('');
      resolve({ url, error: error.message, success: false });
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ ${url}`);
      console.log(`   Error: Request timeout`);
      console.log('');
      req.destroy();
      resolve({ url, error: 'Timeout', success: false });
    });
  });
}

async function runTests() {
  console.log('Testing backend endpoints...\n');
  
  const results = [];
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }
  
  console.log('🏁 Test Summary:');
  console.log('================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === 0) {
    console.log('\n🚨 All tests failed - Backend is not responding');
    console.log('📋 Possible issues:');
    console.log('   • Railway deployment failed');
    console.log('   • Environment variables not set correctly');
    console.log('   • Database connection issues');
    console.log('   • Build errors in Strapi');
    console.log('\n🔧 Next steps:');
    console.log('   1. Run: node fix-railway-backend.cjs');
    console.log('   2. Check Railway dashboard for deployment logs');
    console.log('   3. Verify database service is running');
  } else if (successful < total) {
    console.log('\n⚠️  Some tests failed');
    console.log('📋 Check the specific endpoints that failed above');
  } else {
    console.log('\n🎉 All tests passed! Backend is working correctly');
    console.log('📋 If you\'re still getting CORS errors in your frontend:');
    console.log('   • Clear browser cache');
    console.log('   • Check if CORS headers are present (shown above)');
    console.log('   • Verify frontend is using the correct backend URL');
  }
  
  console.log('\n🌐 Frontend should use:');
  console.log('NEXT_PUBLIC_STRAPI_URL=https://kuer-strapi-backend-production.up.railway.app');
}

runTests().catch(console.error);