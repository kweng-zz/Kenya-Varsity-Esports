#!/usr/bin/env node

/**
 * Fix script for game_category_rankings collection
 * Adds missing attributes to the collection
 */

import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

config();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;

if (!endpoint || !projectId || !apiKey || !databaseId) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);

async function fixCollection() {
    try {
        console.log('🔍 Checking game_category_rankings collection...');

        // Get the collection
        const collection = await databases.getCollection(
            databaseId,
            'game_category_rankings'
        );

        console.log('✅ Collection found');
        console.log('📋 Current attributes:');
        
        const existingAttrs = new Set();
        collection.attributes.forEach(attr => {
            console.log(`   - ${attr.key}`);
            existingAttrs.add(attr.key);
        });

        // Required attributes
        const requiredAttrs = [
            { name: 'categoryId', type: 'string', size: 255, required: true },
            { name: 'rank', type: 'integer', required: true },
            { name: 'playerName', type: 'string', size: 255, required: true },
            { name: 'university', type: 'string', size: 255, required: true },
            { name: 'wins', type: 'integer', required: false },
            { name: 'losses', type: 'integer', required: false },
            { name: 'total', type: 'integer', required: false },
            { name: 'image', type: 'string', size: 2048, required: false },
            { name: 'createdAt', type: 'string', required: false },
            { name: 'updatedAt', type: 'string', required: false }
        ];

        // Find missing attributes
        const missingAttrs = requiredAttrs.filter(attr => !existingAttrs.has(attr.name));

        if (missingAttrs.length === 0) {
            console.log('\n✅ All required attributes exist!');
            return;
        }

        console.log('\n⚠️  Missing attributes:', missingAttrs.map(a => a.name).join(', '));
        console.log('\n🔧 Adding missing attributes...');

        for (const attr of missingAttrs) {
            try {
                if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(
                        databaseId,
                        'game_category_rankings',
                        attr.name,
                        attr.required
                    );
                } else {
                    await databases.createStringAttribute(
                        databaseId,
                        'game_category_rankings',
                        attr.name,
                        attr.size || 255,
                        attr.required
                    );
                }
                console.log(`   ✅ Added: ${attr.name}`);
            } catch (e) {
                if (e.message && e.message.includes('already exists')) {
                    console.log(`   ℹ️  Already exists: ${attr.name}`);
                } else {
                    console.error(`   ❌ Error adding ${attr.name}:`, e.message);
                }
            }
        }

        console.log('\n✅ Collection fixed!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixCollection();
