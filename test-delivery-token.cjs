const { createClient } = require('contentful');

async function test() {
  const token = 'EbPf_RaXZifTispawztmnR9jJ_rQBTQ2IZJh_YPBjOg';
  const spaceId = 'xuzj17370uho';

  try {
    const client = createClient({
      space: spaceId,
      accessToken: token,
      environment: 'master'
    });

    console.log('Testing Content Delivery API token...');
    console.log('Space ID:', spaceId);
    console.log('Token:', token);
    console.log('');

    const entries = await client.getEntries({ limit: 1 });
    console.log('✅ Token is valid!');
    console.log('Found', entries.total, 'total entries');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Status:', error.status);
    console.log('');
    console.log('The Content Delivery API token appears to be invalid or expired.');
    console.log('Please regenerate it from your Contentful dashboard.');
  }
}

test();
