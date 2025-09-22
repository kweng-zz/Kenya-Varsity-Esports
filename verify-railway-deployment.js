import fetch from 'node-fetch';

// Configuration
const RAILWAY_URL = process.env.RAILWAY_URL || 'https://your-app.railway.app';
const HEALTH_CHECK_ENDPOINTS = [
  '/',
  '/admin',
  '/api/users/me',
  '/_health'
];

async function checkEndpoint(url) {
  try {
    console.log(`Checking: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Railway-Health-Check'
      }
    });
    
    console.log(`  Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      console.log(`  ✅ ${url} is working`);
      return true;
    } else {
      console.log(`  ⚠️  ${url} returned ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`  ❌ ${url} failed: ${error.message}`);
    return false;
  }
}

async function verifyDeployment() {
  console.log('🚀 Verifying Railway Deployment');
  console.log(`Base URL: ${RAILWAY_URL}`);
  console.log('=' .repeat(50));
  
  let successCount = 0;
  
  for (const endpoint of HEALTH_CHECK_ENDPOINTS) {
    const fullUrl = `${RAILWAY_URL}${endpoint}`;
    const success = await checkEndpoint(fullUrl);
    if (success) successCount++;
    console.log('');
  }
  
  console.log('=' .repeat(50));
  console.log(`Results: ${successCount}/${HEALTH_CHECK_ENDPOINTS.length} endpoints working`);
  
  if (successCount === HEALTH_CHECK_ENDPOINTS.length) {
    console.log('🎉 All endpoints are working! Deployment successful.');
  } else if (successCount > 0) {
    console.log('⚠️  Some endpoints are working. Check the logs for issues.');
  } else {
    console.log('❌ No endpoints are working. Check your deployment configuration.');
  }
  
  console.log('\nNext steps:');
  console.log('1. Update your frontend API_URL to:', RAILWAY_URL);
  console.log('2. Test admin panel at:', `${RAILWAY_URL}/admin`);
  console.log('3. Check Railway logs if any issues persist');
}

// Run verification
verifyDeployment().catch(console.error);