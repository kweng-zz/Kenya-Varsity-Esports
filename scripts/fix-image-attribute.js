#!/usr/bin/env node

/**
 * Fix script for image attribute size
 * Increases the image attribute size limit to 5MB
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

async function fixImageAttribute() {
  try {
    console.log('🚀 Fixing image attribute size...');
    console.log(`Database ID: ${DATABASE_ID}`);
    console.log(`Collection ID: ${COLLECTION_ID}`);

    // Try to delete the existing image attribute
    try {
      await databases.deleteAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'image'
      );
      console.log('✅ Deleted existing image attribute');
    } catch (error) {
      if (error.code === 404) {
        console.log('ℹ️  image attribute does not exist');
      } else {
        console.log('⚠️  Could not delete image attribute:', error.message);
      }
    }

    // Wait a moment for the deletion to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create the image attribute with larger size
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'image',
        5000000, // 5MB for base64 encoded images
        false // not required
      );
      console.log('✅ Created image attribute with 5MB size limit');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  image attribute already exists');
      } else {
        console.error('❌ Error creating image attribute:', error.message);
        throw error;
      }
    }

    console.log('\n✅ Image attribute fixed!');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  }
}

fixImageAttribute();
