const { createClient } = require('contentful-management');

async function test() {
  const token = 'CFPAT-251jZnIYtfDQxS4IYgncrUjYdpf5aUNEjZcem-yu2Nc';
  const spaceId = 'xuzj17370uho';
  
  try {
    const client = createClient({ accessToken: token });
    
    console.log('Step 1: Listing all spaces...');
    const spaces = await client.getSpaces();
    console.log(`✅ Found ${spaces.items.length} space(s):`);
    spaces.items.forEach(space => {
      console.log(`  - ${space.name} (${space.sys.id})`);
    });
    
    console.log('\nStep 2: Trying to access your space...');
    const space = await client.getSpace(spaceId);
    console.log(`✅ Successfully accessed: ${space.name}`);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('This means the token does not have access to space:', spaceId);
  }
}

test();
