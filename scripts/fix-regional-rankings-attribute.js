#!/usr/bin/env node

/**
 * Fix script for Regional Rankings collection
 * Removes the JSON universities attribute and creates a string attribute instead
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
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REGIONAL_RANKINGS_COLLECTION_ID || 'regional_rankings';

async function fixRegionalRankingsAttribute() {
  try {
    console.log('🚀 Fixing Regional Rankings collection...');
    console.log(`Database ID: ${DATABASE_ID}`);
    console.log(`Collection ID: ${COLLECTION_ID}`);

    // Try to delete the existing universities attribute
    try {
      await databases.deleteAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'universities'
      );
      console.log('✅ Deleted existing universities attribute');
    } catch (error) {
      if (error.code === 404) {
        console.log('ℹ️  universities attribute does not exist');
      } else {
        console.log('⚠️  Could not delete universities attribute:', error.message);
      }
    }

    // Wait a moment for the deletion to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create the universities attribute as a string
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'universities',
        1000000, // Large size for JSON stringified universities array
        true // required
      );
      console.log('✅ Created universities attribute as string');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  universities attribute already exists');
      } else {
        console.error('❌ Error creating universities attribute:', error.message);
        throw error;
      }
    }

    console.log('\n✅ Regional Rankings collection fixed!');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  }
}

fixRegionalRankingsAttribute();
