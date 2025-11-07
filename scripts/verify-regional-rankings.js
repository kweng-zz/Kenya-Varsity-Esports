#!/usr/bin/env node

/**
 * Verify script for Regional Rankings collection
 * Checks if the collection and attributes are properly set up
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

async function verifyRegionalRankingsCollection() {
  try {
    console.log('🔍 Verifying Regional Rankings collection...');
    console.log(`Database ID: ${DATABASE_ID}`);
    console.log(`Collection ID: ${COLLECTION_ID}`);

    // Get collection details
    const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
    
    console.log('\n✅ Collection found!');
    console.log(`Collection Name: ${collection.name}`);
    console.log(`Attributes: ${collection.attributes.length}`);
    
    console.log('\n📋 Attributes:');
    collection.attributes.forEach((attr) => {
      console.log(`  - ${attr.key} (${attr.type}): required=${attr.required}`);
    });

    // Check for universities attribute
    const universitiesAttr = collection.attributes.find(a => a.key === 'universities');
    if (universitiesAttr) {
      console.log('\n✅ universities attribute found!');
      console.log(`   Type: ${universitiesAttr.type}`);
      console.log(`   Required: ${universitiesAttr.required}`);
      if (universitiesAttr.type === 'string') {
        console.log(`   Size: ${universitiesAttr.size}`);
      }
    } else {
      console.log('\n❌ universities attribute NOT found!');
    }

    // Check for image attribute
    const imageAttr = collection.attributes.find(a => a.key === 'image');
    if (imageAttr) {
      console.log('\n✅ image attribute found!');
      console.log(`   Type: ${imageAttr.type}`);
      console.log(`   Required: ${imageAttr.required}`);
      if (imageAttr.type === 'string') {
        console.log(`   Size: ${imageAttr.size}`);
      }
    } else {
      console.log('\n❌ image attribute NOT found!');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyRegionalRankingsCollection();
