#!/usr/bin/env node

/**
 * Migration script to update rankings collection schema
 * Adds dynamic game category attributes and total attribute
 */

import { Client, Databases } from 'node-appwrite';
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
const COLLECTION_ID = 'rankings';

// Game categories that need to be added as attributes
const gameCategories = [
  'pubgm',
  'codm',
  'codm-mp',
  'efootball',
  'eafc-2v2',
  'eafc-women',
  'fighting-games-open',
  'fighting-games-women',
  'rocket-league'
];

async function migrateRankingsSchema() {
  try {
    console.log('🚀 Migrating rankings collection schema...');
    console.log(`Database ID: ${DATABASE_ID}`);
    console.log(`Collection ID: ${COLLECTION_ID}`);

    // Get collection to see existing attributes
    const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
    console.log(`\n📋 Current attributes: ${collection.attributes.length}`);
    collection.attributes.forEach(attr => {
      console.log(`  - ${attr.key} (${attr.type})`);
    });

    // Add total attribute if it doesn't exist
    const hasTotal = collection.attributes.some(attr => attr.key === 'total');
    if (!hasTotal) {
      try {
        console.log('\n📝 Adding "total" attribute...');
        await databases.createIntegerAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          'total',
          false, // required
          null,  // min
          null,  // max
          0      // default
        );
        console.log('✅ "total" attribute created');
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 409) {
          console.log('ℹ️  "total" attribute already exists');
        } else {
          console.error('❌ Error creating "total" attribute:', error.message);
        }
      }
    } else {
      console.log('\n✅ "total" attribute already exists');
    }

    // Add game category attributes
    console.log('\n📝 Adding game category attributes...');
    for (const category of gameCategories) {
      const hasCategory = collection.attributes.some(attr => attr.key === category);
      
      if (!hasCategory) {
        try {
          console.log(`  Adding "${category}"...`);
          await databases.createIntegerAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            category,
            false, // required
            null,  // min
            null,  // max
            0      // default
          );
          console.log(`  ✅ "${category}" created`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          if (error.code === 409) {
            console.log(`  ℹ️  "${category}" already exists`);
          } else {
            console.error(`  ❌ Error creating "${category}":`, error.message);
          }
        }
      } else {
        console.log(`  ✅ "${category}" already exists`);
      }
    }

    console.log('\n✅ Rankings schema migration complete!');
    console.log('\nYou can now:');
    console.log('1. Use the admin panel to add rankings with game category scores');
    console.log('2. The frontend will automatically display the rankings with dynamic columns');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateRankingsSchema();
