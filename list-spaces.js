const { createClient } = require('contentful-management');

async function listSpaces() {
  const token = 'CFPAT-YLsmBTsT6EV363dgkaDKQgOrFavL3DwbRQ-ugbUpp8I';
  
  try {
    const client = createClient({ accessToken: token });
    const spaces = await client.getSpaces();
    
    console.log('✅ Spaces you have access to:');
    spaces.items.forEach(space => {
      console.log(`  - ${space.name} (ID: ${space.sys.id})`);
    });
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

listSpaces();
