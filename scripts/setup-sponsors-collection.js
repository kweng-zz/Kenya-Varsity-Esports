import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const setupSponsorsCollection = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID || 'sponsors';

  console.log(`🚀 Setting up Sponsors collection: ${collectionId}`);

  try {
    // 1. Create Collection
    try {
      // Use proper Permission helper for reliability
      await databases.createCollection(
        databaseId, 
        collectionId, 
        'Sponsors', 
        [
          Permission.read(Role.any()), // Public read
          Permission.create(Role.users()), // Authenticated users can create
          Permission.create(Role.team('admins')),
          Permission.update(Role.users()),
          Permission.update(Role.team('admins')),
          Permission.delete(Role.users()),
          Permission.delete(Role.team('admins')),
        ], 
        false
      );
      console.log('✅ Collection created');
    } catch (e) {
      if (e.code === 409) console.log('ℹ️ Collection already exists');
      else throw e;
    }

    // 2. Create Attributes
    const attributes = [
      { name: 'name', type: 'string', size: 255, required: true },
      { name: 'logo', type: 'string', size: 1000, required: true },
      { name: 'website', type: 'string', size: 1000, required: false },
      { name: 'isActive', type: 'boolean', required: false, default: true },
      { name: 'order', type: 'integer', required: false, default: 0 },
      { name: 'tier', type: 'string', size: 50, required: false, default: 'partner' }
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(databaseId, collectionId, attr.name, attr.size, attr.required, attr.default);
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(databaseId, collectionId, attr.name, attr.required, attr.default);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(databaseId, collectionId, attr.name, attr.required, 0, 1000, attr.default);
        }
        console.log(`✅ Attribute created: ${attr.name}`);
      } catch (e) {
        if (e.code === 409) console.log(`ℹ️ Attribute ${attr.name} already exists`);
        else console.error(`❌ Error creating attribute ${attr.name}:`, e.message);
      }
    }

    console.log('🎉 Sponsors collection setup complete!');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
};

setupSponsorsCollection();
