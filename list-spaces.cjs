const { createClient } = require('contentful-management');

async function listSpaces() {
  const token = 'CFPAT-w8LlkOQOeGpPm3W0k9f65UTiW2bvPJdt1fvEgTMo3TZ';
  
  console.log('Testing with token:', token.substring(0, 15) + '...');
  
  try {
    const client = createClient({ accessToken: token });
    const spaces = await client.getSpaces();
    
    console.log('✅ Spaces you have access to:');
    spaces.items.forEach(space => {
      console.log(`  - ${space.name} (ID: ${space.sys.id})`);
    });
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Status:', error.status);
  }
}

listSpaces();
