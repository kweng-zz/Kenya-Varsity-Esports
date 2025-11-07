#!/usr/bin/env node

/**
 * Setup script for Regional Rankings collection in Appwrite
 * Creates the regional_rankings collection with proper attributes
 */

import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REGIONAL_RANKINGS_COLLECTION_ID || 'regional_rankings';

async function setupRegionalRankingsCollection() {
  try {
    console.log('🚀 Setting up Regional Rankings collection...');
    console.log(`Database ID: ${DATABASE_ID}`);
    console.log(`Collection ID: ${COLLECTION_ID}`);

    // Try to create the collection
    let collectionExists = false;
    try {
      const collection = await databases.createCollection(
        DATABASE_ID,
        COLLECTION_ID,
        'Regional Rankings',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      console.log('�� Collection created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Collection already exists, updating permissions and attributes...');
        collectionExists = true;

        // Update permissions on existing collection
        try {
          await databases.updateCollection(
            DATABASE_ID,
            COLLECTION_ID,
            'Regional Rankings',
            [
              Permission.read(Role.any()),
              Permission.create(Role.users()),
              Permission.update(Role.users()),
              Permission.delete(Role.users())
            ]
          );
          console.log('✅ Collection permissions updated');
        } catch (permError) {
          console.log('⚠️  Could not update permissions, may already be set');
        }
      } else {
        throw error;
      }
    }

    // Create/update attributes
    const attributes = [
      {
        name: 'region',
        type: 'string',
        required: true,
        size: 255,
      },
      {
        name: 'image',
        type: 'string',
        required: false,
        size: 5000000, // 5MB for base64 encoded images
      },
      {
        name: 'universities',
        type: 'string',
        required: true,
        size: 1000000, // Large size for JSON stringified universities array
      },
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            attr.name,
            attr.size,
            attr.required
          );
        }
        console.log(`✅ Attribute '${attr.name}' created`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Attribute '${attr.name}' already exists`);
        } else {
          console.error(`❌ Error creating attribute '${attr.name}':`, error.message);
        }
      }
    }

    // Create index on region field for faster queries
    try {
      await databases.createIndex(
        DATABASE_ID,
        COLLECTION_ID,
        'region_index',
        'key',
        ['region'],
        ['ASC']
      );
      console.log('✅ Index on region field created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Index already exists');
      } else {
        console.error('❌ Error creating index:', error.message);
      }
    }

    console.log('\n✅ Regional Rankings collection setup complete!');
    console.log('\nYou can now:');
    console.log('1. Navigate to /admin/regional-rankings');
    console.log('2. Click "Add Regional Ranking"');
    console.log('3. Enter region name and upload an image');
    console.log('4. Add universities with their ranking scores');
    console.log('5. Click "Save Ranking"');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupRegionalRankingsCollection();
