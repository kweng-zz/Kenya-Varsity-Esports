import fetch from 'node-fetch';

const RAILWAY_URL = 'https://kuer-production.up.railway.app';
const FRONTEND_ORIGIN = 'https://www.kenyaesportsrankings.org';

async function testCORS() {
  console.log('🔍 Testing CORS Configuration');
  console.log(`Backend URL: ${RAILWAY_URL}`);
  console.log(`Frontend Origin: ${FRONTEND_ORIGIN}`);
  console.log('=' .repeat(60));

  // Test endpoints
  const endpoints = [
    '/api/articles?pagination[page]=1&pagination[pageSize]=1',
    '/api/articles?populate=image',
    '/api/tournaments',
    '/_health'
  ];

  for (const endpoint of endpoints) {
    const url = `${RAILWAY_URL}${endpoint}`;
    console.log(`\nTesting: ${endpoint}`);
    
    try {
      // Test preflight request (OPTIONS)
      console.log('  Preflight (OPTIONS)...');
      const preflightResponse = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Origin': FRONTEND_ORIGIN,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type',
        }
      });

      console.log(`    Status: ${preflightResponse.status}`);
      console.log(`    CORS Headers:`);
      console.log(`      Access-Control-Allow-Origin: ${preflightResponse.headers.get('access-control-allow-origin')}`);
      console.log(`      Access-Control-Allow-Methods: ${preflightResponse.headers.get('access-control-allow-methods')}`);
      console.log(`      Access-Control-Allow-Headers: ${preflightResponse.headers.get('access-control-allow-headers')}`);

      // Test actual request
      console.log('  Actual GET request...');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Origin': FRONTEND_ORIGIN,
          'Content-Type': 'application/json',
        }
      });

      console.log(`    Status: ${response.status}`);
      console.log(`    Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
      
      if (response.ok) {
        console.log(`    ✅ ${endpoint} is working`);
      } else {
        console.log(`    ❌ ${endpoint} failed with status ${response.status}`);
      }

    } catch (error) {
      console.log(`    ❌ ${endpoint} error: ${error.message}`);
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🔧 If CORS is still blocked:');
  console.log('1. Ensure you\'ve deployed the updated middlewares.ts file');
  console.log('2. Check Railway logs for any startup errors');
  console.log('3. Verify the backend is running at the correct URL');
  console.log('4. Add ALLOWED_ORIGINS environment variable if needed');
}

testCORS().catch(console.error);