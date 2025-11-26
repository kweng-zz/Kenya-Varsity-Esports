#!/usr/bin/env node

/**
 * Migration script to add the 'image' attribute to the game_category_rankings collection
 * This script adds the missing image attribute that is needed to display featured images in the rankings page
 * Run this script if you already have the game_category_rankings collection but it's missing the image attribute
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

async function addImageAttribute() {
    try {
        console.log('🔧 Adding image attribute to game_category_rankings collection...');
        console.log('   Endpoint:', endpoint);
        console.log('   Project ID:', projectId);
        console.log('   Database ID:', databaseId);

        // Try to add the image attribute
        try {
            await databases.createStringAttribute(
                databaseId,
                'game_category_rankings',
                'image',
                2048,
                false
            );
            console.log('✅ Successfully added image attribute to game_category_rankings collection');
        } catch (e) {
            if ((e instanceof Error) && e.message.includes('already exists')) {
                console.log('ℹ️  Image attribute already exists in the collection');
            } else {
                throw e;
            }
        }

        console.log('\n✅ Migration complete!');
        console.log('\n📌 The game_category_rankings collection now has the image attribute.');
        console.log('   You can now:');
        console.log('   1. Add image URLs to game category rankings');
        console.log('   2. Images will be displayed in the rankings page');
        console.log('   3. Update existing rankings with image URLs');

    } catch (error) {
        console.error('❌ Error adding image attribute:', (error instanceof Error) ? error.message : String(error));
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

addImageAttribute();
