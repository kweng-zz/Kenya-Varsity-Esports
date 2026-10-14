import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';

async function setupEventsCollection() {
  try {
    console.log('🎯 Setting up Events Collection...');

    // Create Events Collection
    const eventsCollection = await databases.createCollection(
      databaseId,
      ID.unique(),
      'events',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.create(Role.team('admins')),
        Permission.update(Role.users()),
        Permission.update(Role.team('admins')),
        Permission.delete(Role.users()),
        Permission.delete(Role.team('admins'))
      ]
    );

    const collectionId = eventsCollection.$id;
    console.log('✅ Events collection created:', collectionId);

    // Create attributes
    console.log('📝 Creating attributes...');

    await databases.createStringAttribute(databaseId, collectionId, 'title', 255, true);
    await databases.createStringAttribute(databaseId, collectionId, 'gameSlug', 100, true);
    await databases.createStringAttribute(databaseId, collectionId, 'image', 2000, true);
    await databases.createStringAttribute(databaseId, collectionId, 'date', 50, true);
    await databases.createStringAttribute(databaseId, collectionId, 'time', 20, true);
    await databases.createStringAttribute(databaseId, collectionId, 'prizePool', 100, true);
    await databases.createStringAttribute(databaseId, collectionId, 'entryFee', 100, true);
    await databases.createEnumAttribute(databaseId, collectionId, 'status', ['OPEN', 'LEAGUE', 'PRO'], true);
    await databases.createStringAttribute(databaseId, collectionId, 'tags', 1000, false, undefined, true); // Array - no default for arrays
    await databases.createStringAttribute(databaseId, collectionId, 'registrationLink', 500, false);
    await databases.createStringAttribute(databaseId, collectionId, 'detailsLink', 500, false);
    await databases.createBooleanAttribute(databaseId, collectionId, 'isActive', true);
    await databases.createBooleanAttribute(databaseId, collectionId, 'isFeatured', false); // New attribute for hero section

    console.log('✅ All attributes created successfully');

    // Wait for attributes to be ready (Appwrite processes them asynchronously)
    console.log('⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

    // Create indexes for better query performance
    console.log('🔍 Creating indexes...');
    
    await databases.createIndex(databaseId, collectionId, 'status_index', 'key', ['status']);
    await databases.createIndex(databaseId, collectionId, 'isActive_index', 'key', ['isActive']);
    await databases.createIndex(databaseId, collectionId, 'date_index', 'key', ['date']);

    console.log('✅ Indexes created successfully');

    // Add sample event
    console.log('📋 Adding sample event...');
    
    await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        title: 'KUER SEASON 3: QUALIFIERS',
        gameSlug: 'valorant',
        image: '/images/Valorant.png',
        date: 'JANUARY 20, 2026',
        time: '18:00',
        prizePool: 'KSH 150,000 PRIZE POOL',
        entryFee: 'FREE FOR STUDENTS',
        status: 'OPEN',
        tags: ['ALL TITLES', 'VALORANT'],
        registrationLink: '/tournament-registration',
        isActive: true,
        isFeatured: true
      }
    );

    console.log('✅ Sample event added');
    console.log('\n🎉 Events collection setup complete!');
    console.log('📌 Collection ID:', collectionId);
    console.log('\n⚠️  IMPORTANT: Add this to your .env.local file:');
    console.log(`NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID=${collectionId}`);

  } catch (error) {
    console.error('❌ Error setting up events collection:', error.message);
    if (error.code === 409) {
      console.log('ℹ️  Collection might already exist. Check your Appwrite console.');
    }
    process.exit(1);
  }
}

setupEventsCollection();
