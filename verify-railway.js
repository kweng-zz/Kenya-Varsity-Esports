#!/usr/bin/env node

const RAILWAY_URL = 'https://kuer-production.up.railway.app';

console.log('🔍 Verifying Railway Strapi Deployment...\n');

async function checkEndpoint(url, expectedType, description) {
  try {
    console.log(`Testing: ${url}`);
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';
    
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${contentType}`);
    
    if (expectedType === 'json' && contentType.includes('application/json')) {
      console.log('✅ CORRECT: Returns JSON (Strapi API)');
      const data = await response.text();
      console.log(`Preview: ${data.substring(0, 100)}...`);
    } else if (expectedType === 'html' && contentType.includes('text/html')) {
      const text = await response.text();
      if (text.includes('Strapi') || text.includes('admin')) {
        console.log('✅ CORRECT: Returns Strapi admin page');
      } else if (text.includes('Next.js') || text.includes('404')) {
        console.log('❌ WRONG: Still returning Next.js');
      } else {
        console.log('✅ CORRECT: Returns HTML (likely Strapi)');
      }
    } else {
      console.log(`❌ UNEXPECTED: Expected ${expectedType}, got ${contentType}`);
    }
    
    console.log('---\n');
    return response.ok;
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    console.log('---\n');
    return false;
  }
}

async function runVerification() {
  console.log(`🎯 Target URL: ${RAILWAY_URL}\n`);
  
  const tests = [
    {
      url: `${RAILWAY_URL}/api/articles`,
      type: 'json',
      description: 'Strapi Articles API'
    },
    {
      url: `${RAILWAY_URL}/admin`,
      type: 'html', 
      description: 'Strapi Admin Panel'
    },
    {
      url: `${RAILWAY_URL}`,
      type: 'html',
      description: 'Root endpoint (should be Strapi, not Next.js)'
    }
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    const passed = await checkEndpoint(test.url, test.type, test.description);
    if (passed) passedTests++;
  }
  
  console.log('📊 RESULTS:');
  console.log(`Passed: ${passedTests}/${tests.length} tests\n`);
  
  if (passedTests === tests.length) {
    console.log('🎉 SUCCESS: Railway is correctly serving Strapi!');
    console.log('\n✅ Next steps:');
    console.log('1. Update Vercel environment variables');
    console.log('2. Redeploy Vercel');
    console.log('3. Test full application');
  } else {
    console.log('❌ ISSUE: Railway is still not configured correctly');
    console.log('\n🔧 Try these fixes:');
    console.log('1. Set Root Directory to "kuer" in Railway dashboard');
    console.log('2. Redeploy Railway service');
    console.log('3. Check Railway logs for errors');
    console.log('4. Verify PostgreSQL database is connected');
  }
  
  console.log('\n📋 Quick Commands:');
  console.log(`curl ${RAILWAY_URL}/api/articles`);
  console.log(`curl -I ${RAILWAY_URL}/admin`);
}

// Add fetch polyfill for Node.js if needed
if (typeof fetch === 'undefined') {
  console.log('Installing fetch...');
  const { default: fetch } = await import('node-fetch');
  global.fetch = fetch;
}

runVerification().catch(console.error);