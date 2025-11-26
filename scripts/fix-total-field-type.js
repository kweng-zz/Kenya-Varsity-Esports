#!/usr/bin/env node

/**
 * Migration script to fix the 'total' field type in game_category_rankings collection
 * Changes 'total' from integer to string to match other numeric fields
 */

import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;

if (!endpoint || !projectId || !apiKey || !databaseId) {
    console.error('❌ Missing required environment variables');
    console.error('Required: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY, NEXT_PUBLIC_APPWRITE_DB_ID');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);

async function fixTotalFieldType() {
    try {
        console.log('🔧 Starting migration to fix total field type...\n');

        const collectionId = 'game_category_rankings';

        // Get collection info
        console.log('📋 Fetching collection schema...');
        const collection = await databases.getCollection(databaseId, collectionId);
        
        console.log('✅ Collection found');
        console.log('📊 Current attributes:');
        collection.attributes.forEach((attr) => {
            console.log(`   - ${attr.key}: ${attr.type}${attr.size ? ` (size: ${attr.size})` : ''}`);
        });

        // Check if total field exists and is integer
        const totalAttr = collection.attributes.find(attr => attr.key === 'total');
        
        if (!totalAttr) {
            console.log('\n⚠️  Total field not found in collection');
            return;
        }

        if (totalAttr.type === 'string') {
            console.log('\n✅ Total field is already a string. No migration needed.');
            return;
        }

        console.log('\n🔄 Total field is currently:', totalAttr.type);
        console.log('📝 Need to change it to: string\n');

        // Delete the old integer field
        console.log('🗑️  Deleting old total field (integer)...');
        try {
            await databases.deleteAttribute(databaseId, collectionId, 'total');
            console.log('✅ Old total field deleted');
        } catch (error) {
            console.error('❌ Error deleting old total field:', error.message);
            throw error;
        }

        // Wait a moment for the deletion to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create new string field
        console.log('📝 Creating new total field (string)...');
        try {
            await databases.createStringAttribute(
                databaseId,
                collectionId,
                'total',
                255,
                false,
                null
            );
            console.log('✅ New total field created as string');
        } catch (error) {
            console.error('❌ Error creating new total field:', error.message);
            throw error;
        }

        console.log('\n✅ Migration complete!');
        console.log('📊 The total field is now a string, matching other numeric fields.');
        console.log('\n⚠️  Note: Existing data in the total field may have been lost.');
        console.log('   You may need to re-enter rankings data.');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run the migration
fixTotalFieldType();
