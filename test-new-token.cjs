const { createClient } = require('contentful');

async function test() {
  const token = 'iG2vxSfRjlwqfFNLwDNTiBjzc3c7P8kLmiACo5QMtJA';
  const spaceId = 'xuzj17370uho';

  try {
    const client = createClient({
      space: spaceId,
      accessToken: token,
      environment: 'master'
    });

    console.log('Testing NEW Content Delivery API token...');
    console.log('Space ID:', spaceId);
    console.log('Token:', token);
    console.log('Token ends with:', token.slice(-10));
    console.log('');

    const entries = await client.getEntries({ limit: 1 });
    console.log('✅ NEW Token is valid!');
    console.log('Found', entries.total, 'total entries');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Status:', error.status);
  }
}

test();
