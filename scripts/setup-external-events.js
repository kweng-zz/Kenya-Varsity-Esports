
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const collectionId = 'external_events';

async function setupExternalEventsCollection() {
  try {
    console.log(`🚀 Setting up External Events Collection (${collectionId})...`);

    // 1. Create Collection
    try {
      await databases.createCollection(
        databaseId,
        collectionId,
        'External Events',
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
      console.log('✅ Collection created.');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️ Collection already exists.');
      } else {
        throw error;
      }
    }

    // 2. Add Attributes
    const attributes = [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 5000, required: false },
      { key: 'imageUrl', type: 'string', size: 1000, required: true },
      { key: 'externalUrl', type: 'string', size: 1000, required: true },
      { key: 'eventDate', type: 'datetime', required: false },
      { key: 'venue', type: 'string', size: 255, required: false },
      { key: 'status', type: 'string', size: 50, required: true },
      { key: 'tags', type: 'string', size: 1000, required: false, array: true },
      { key: 'isFeatured', type: 'boolean', required: false, default: false }
    ];

    for (const attr of attributes) {
      try {
        console.log(`📝 Adding attribute: ${attr.key}`);
        switch (attr.type) {
          case 'string':
            await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size, attr.required, undefined, attr.array || false);
            break;
          case 'integer':
            await databases.createIntegerAttribute(databaseId, collectionId, attr.key, attr.required);
            break;
          case 'boolean':
            await databases.createBooleanAttribute(databaseId, collectionId, attr.key, attr.required, attr.default);
            break;
          case 'datetime':
            await databases.createDatetimeAttribute(databaseId, collectionId, attr.key, attr.required);
            break;
        }
        // Small delay to prevent rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️ Attribute ${attr.key} already exists.`);
        } else {
          console.error(`❌ Failed to add attribute ${attr.key}:`, error.message);
        }
      }
    }

    console.log('🎉 External Events collection setup complete!');

  } catch (error) {
    console.error('❌ Error setting up collection:', error);
    process.exit(1);
  }
}

setupExternalEventsCollection();
