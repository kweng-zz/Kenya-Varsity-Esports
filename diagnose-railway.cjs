#!/usr/bin/env node

const https = require('https');

console.log('🔍 Railway Backend Diagnostic Tool\n');

async function checkEndpoint(url, description) {
  return new Promise((resolve) => {
    console.log(`Testing: ${description}`);
    console.log(`URL: ${url}`);
    
    const req = https.get(url, (res) => {
      console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
      console.log(`Headers:`, Object.keys(res.headers).map(h => `${h}: ${res.headers[h]}`).slice(0, 5));
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data.length > 0 && data.length < 500) {
          console.log(`Response: ${data.substring(0, 200)}...`);
        }
        console.log('---\n');
        resolve({ status: res.statusCode, success: res.statusCode < 400 });
      });
    });
    
    req.on('error', (error) => {
      console.log(`Error: ${error.message}`);
      console.log('---\n');
      resolve({ error: error.message, success: false });
    });
    
    req.setTimeout(15000, () => {
      console.log('Error: Request timeout (15s)');
      console.log('---\n');
      req.destroy();
      resolve({ error: 'Timeout', success: false });
    });
  });
}

async function runDiagnostics() {
  console.log('🧪 Running comprehensive backend diagnostics...\n');
  
  const tests = [
    {
      url: 'https://kuer-production-3e7c.up.railway.app',
      description: 'Root endpoint (should redirect or show info)'
    },
    {
      url: 'https://kuer-production-3e7c.up.railway.app/admin',
      description: 'Admin panel (should show login page)'
    },
    {
      url: 'https://kuer-production-3e7c.up.railway.app/api',
      description: 'API root (should show API info)'
    },
    {
      url: 'https://kuer-production-3e7c.up.railway.app/api/articles',
      description: 'Articles endpoint (should return JSON)'
    },
    {
      url: 'https://kuer-production-3e7c.up.railway.app/_health',
      description: 'Health check (might exist)'
    }
  ];
  
  const results = [];
  for (const test of tests) {
    const result = await checkEndpoint(test.url, test.description);
    results.push({ ...test, ...result });
  }
  
  console.log('📊 DIAGNOSTIC SUMMARY:');
  console.log('======================');
  
  const working = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Working endpoints: ${working}/${total}`);
  console.log(`❌ Failed endpoints: ${total - working}/${total}\n`);
  
  if (working === 0) {
    console.log('🚨 CRITICAL: All endpoints failed');
    console.log('📋 This indicates:');
    console.log('   • Service is not running at all');
    console.log('   • Deployment failed completely');
    console.log('   • Wrong URL or service not deployed');
    console.log('   • Environment variables missing');
    
    console.log('\n🔧 IMMEDIATE ACTIONS NEEDED:');
    console.log('1. Check Railway dashboard deployment status');
    console.log('2. Verify all 9 environment variables are set');
    console.log('3. Check deployment logs for errors');
    console.log('4. Ensure PostgreSQL service is running');
    console.log('5. Try manual redeploy from dashboard');
    
  } else if (working < total) {
    console.log('⚠️  PARTIAL: Some endpoints working');
    console.log('📋 This might indicate:');
    console.log('   • Service is starting but not fully configured');
    console.log('   • Some routes are working, others aren\'t');
    console.log('   • Database connection issues');
    
  } else {
    console.log('🎉 SUCCESS: All endpoints responding!');
    console.log('📋 Your backend is working correctly');
    console.log('   • CORS errors should now be resolved');
    console.log('   • Frontend should be able to connect');
  }
  
  console.log('\n🌐 Railway Dashboard: https://railway.app/dashboard');
  console.log('📝 Next: Check deployment logs if issues persist');
}

runDiagnostics().catch(console.error);