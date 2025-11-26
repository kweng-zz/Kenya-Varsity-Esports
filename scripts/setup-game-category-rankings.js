#!/usr/bin/env node

/**
 * Setup script to create the game_category_rankings collection in Appwrite
 * Run this script to initialize the collection for storing game category rankings
 */

import { config } from 'dotenv';
import { Client, Databases, ID } from 'node-appwrite';

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

async function setupCollection() {
    try {
        console.log('🔧 Setting up game_category_rankings collection...');
        console.log('   Endpoint:', endpoint);
        console.log('   Project ID:', projectId);
        console.log('   Database ID:', databaseId);

        // Try to create the collection
        const collection = await databases.createCollection(
            databaseId,
            'game_category_rankings',
            'Game Category Rankings',
            undefined,
            false
        );

        console.log('✅ Collection created successfully:', collection.$id);

        // Create attributes
        const attributes = [
            {
                name: 'categoryId',
                type: 'string',
                required: true,
                size: 255
            },
            {
                name: 'rank',
                type: 'integer',
                required: true
            },
            {
                name: 'playerName',
                type: 'string',
                required: true,
                size: 255
            },
            {
                name: 'university',
                type: 'string',
                required: true,
                size: 255
            },
            {
                name: 'wins',
                type: 'integer',
                required: false
            },
            {
                name: 'losses',
                type: 'integer',
                required: false
            },
            {
                name: 'total',
                type: 'integer',
                required: false
            },
            {
                name: 'image',
                type: 'string',
                required: false,
                size: 2048
            },
            {
                name: 'createdAt',
                type: 'string',
                required: false
            },
            {
                name: 'updatedAt',
                type: 'string',
                required: false
            }
        ];

        console.log('📝 Creating attributes...');
        for (const attr of attributes) {
            try {
                await databases.createStringAttribute(
                    databaseId,
                    'game_category_rankings',
                    attr.name,
                    attr.size || 255,
                    attr.required
                );
                console.log(`   ✅ Created attribute: ${attr.name}`);
            } catch (e) {
                if ((e instanceof Error) && e.message.includes('already exists')) {
                    console.log(`   ℹ️  Attribute already exists: ${attr.name}`);
                } else {
                    throw e;
                }
            }
        }

        // Create indexes
        console.log('🔍 Creating indexes...');
        try {
            await databases.createIndex(
                databaseId,
                'game_category_rankings',
                'categoryId_idx',
                'key',
                ['categoryId']
            );
            console.log('   ✅ Created index: categoryId_idx');
        } catch (e) {
            if ((e instanceof Error) && e.message.includes('already exists')) {
                console.log('   ℹ️  Index already exists: categoryId_idx');
            } else {
                console.warn('   ⚠️  Could not create index:', (e instanceof Error) ? e.message : String(e));
            }
        }

        console.log('\n✅ Setup complete! The game_category_rankings collection is ready to use.');
        console.log('\n📌 You can now:');
        console.log('   1. Edit game category rankings in the admin panel');
        console.log('   2. Rankings will be saved to Appwrite');
        console.log('   3. Rankings will appear on the main rankings page');

    } catch (error) {
        if ((error instanceof Error) && error.message.includes('already exists')) {
            console.log('✅ Collection already exists. Skipping creation.');
            console.log('\n📌 The game_category_rankings collection is ready to use.');
        } else {
            console.error('❌ Error setting up collection:', (error instanceof Error) ? error.message : String(error));
            console.error('\nFull error:', error);
            process.exit(1);
        }
    }
}

setupCollection();
