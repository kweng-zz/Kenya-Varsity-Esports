#!/usr/bin/env node

/**
 * Fix Script: Update Tournaments Collection Permissions
 * 
 * This script updates the tournaments collection permissions to allow
 * proper document-level permissions for admin management.
 * 
 * The error "Permissions must be one of: (any, guests)" occurs when
 * document-level permissions exceed collection-level permissions.
 * 
 * Prerequisites:
 * - Appwrite Admin SDK credentials (API Key with collections.write scope)
 * - Environment variables configured
 * 
 * Usage: node scripts/fix-tournaments-collection-permissions.js
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'esports-db';
const TOURNAMENTS_COLLECTION_ID = 'tournaments';

async function fixCollectionPermissions() {
  try {
    console.log('🚀 Fixing Tournaments Collection Permissions\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if API key is configured
    const apiKey = process.env.APPWRITE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    
    if (!apiKey || apiKey === 'your_appwrite_api_key_here') {
      console.log('❌ Appwrite API key not configured!');
      console.log('Please update APPWRITE_API_KEY in your .env file');
      console.log('The API key must have "collections.write" scope');
      return;
    }
    
    if (!projectId || projectId === 'your_appwrite_project_id_here') {
      console.log('❌ Appwrite Project ID not configured!');
      console.log('Please update NEXT_PUBLIC_APPWRITE_PROJECT_ID in your .env file');
      return;
    }
    
    console.log(`📋 Using Project ID: ${projectId}`);
    console.log(`🔑 API Key configured: ${apiKey.substring(0, 10)}...`);
    console.log(`📦 Database ID: ${DATABASE_ID}`);
    console.log(`📁 Collection ID: ${TOURNAMENTS_COLLECTION_ID}`);
    console.log('');

    // First, get current collection to see existing permissions
    console.log('🔍 Fetching current collection permissions...');
    try {
      const collection = await databases.getCollection(DATABASE_ID, TOURNAMENTS_COLLECTION_ID);
      console.log(`✅ Collection found: ${collection.name}`);
      console.log(`   Current permissions:`);
      console.log(`     Read: ${collection.$permissions.read?.join(', ') || 'none'}`);
      console.log(`     Create: ${collection.$permissions.create?.join(', ') || 'none'}`);
      console.log(`     Update: ${collection.$permissions.update?.join(', ') || 'none'}`);
      console.log(`     Delete: ${collection.$permissions.delete?.join(', ') || 'none'}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error fetching collection: ${error.message}`);
      if (error.code === 404) {
        console.log('Collection does not exist. Please create it first.');
      }
      return;
    }

    // Update collection permissions
    console.log('🔧 Updating collection permissions...');
    console.log('New permissions will allow:');
    console.log('  - Read: any (public read access)');
    console.log('  - Create: users (authenticated users can create)');
    console.log('  - Update: users, team:admins (authenticated users + admins team)');
    console.log('  - Delete: users, team:admins (authenticated users + admins team)');
    console.log('');

    try {
      await databases.updateCollection(
        DATABASE_ID,
        TOURNAMENTS_COLLECTION_ID,
        TOURNAMENTS_COLLECTION_ID, // name stays the same
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.update(Role.team('admins')),
          Permission.delete(Role.users()),
          Permission.delete(Role.team('admins')),
        ],
        false, // enabled
        false, // documentSecurity - keep existing or set to true for document-level permissions
        // Note: documentSecurity must be true to use document-level permissions
      );

      console.log('✅ Collection permissions updated successfully!');
      console.log('');
      console.log('📋 Next steps:');
      console.log('1. Ensure the "admins" team exists in Appwrite Console > Teams');
      console.log('2. Add admin users to the "admins" team');
      console.log('3. The admin panel should now work correctly');
      console.log('');

    } catch (error) {
      console.error(`❌ Error updating collection: ${error.message}`);
      console.log('');
      console.log('💡 Possible solutions:');
      console.log('1. Make sure your API key has "collections.write" scope');
      console.log('2. If documentSecurity is false, you may need to enable it in Appwrite Console');
      console.log('3. You can also manually update permissions in Appwrite Console:');
      console.log('   - Go to Databases > Your Database > tournaments collection');
      console.log('   - Click Settings > Permissions');
      console.log('   - Add "team:admins" to Update and Delete permissions');
      console.log('   - Enable "Document Security" if not already enabled');
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

fixCollectionPermissions().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});