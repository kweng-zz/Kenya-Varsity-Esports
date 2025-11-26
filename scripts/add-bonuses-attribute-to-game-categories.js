#!/usr/bin/env node

/**
 * Migration script to add the 'bonuses' attribute to the game_category_rankings collection
 * This script adds the missing bonuses attribute that is needed for correct total calculation
 * Run this script if you already have the game_category_rankings collection but it's missing the bonuses attribute
 */

import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

// Load environment variables from .env file
config();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;

if (!endpoint || !projectId || !apiKey || !databaseId) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_APPWRITE_ENDPOINT');
    console.error('   - NEXT_PUBLIC_APPWRITE_PROJECT_ID');
    console.error('   - APPWRITE_API_KEY');
    console.error('   - NEXT_PUBLIC_APPWRITE_DB_ID');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);

async function addBonusesAttribute() {
    try {
        console.log('🔧 Adding bonuses attribute to game_category_rankings collection...');
        console.log('   Endpoint:', endpoint);
        console.log('   Project ID:', projectId);
        console.log('   Database ID:', databaseId);

        // Try to add the bonuses attribute
        try {
            await databases.createIntegerAttribute(
                databaseId,
                'game_category_rankings',
                'bonuses',
                false
            );
            console.log('✅ Successfully added bonuses attribute to game_category_rankings collection');
        } catch (e) {
            if ((e instanceof Error) && e.message.includes('already exists')) {
                console.log('ℹ️  Bonuses attribute already exists in the collection');
            } else {
                throw e;
            }
        }

        console.log('\n✅ Migration complete!');
        console.log('\n📌 The game_category_rankings collection now has the bonuses attribute.');
        console.log('   You can now:');
        console.log('   1. Add bonus points to game category rankings');
        console.log('   2. Total points will be calculated correctly (points + wins + losses + bonuses)');
        console.log('   3. Update existing rankings with bonus values');

    } catch (error) {
        console.error('❌ Error adding bonuses attribute:', (error instanceof Error) ? error.message : String(error));
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

addBonusesAttribute();
