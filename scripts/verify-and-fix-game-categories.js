#!/usr/bin/env node

/**
 * Verification and fix script for game_category_rankings collection
 * This script checks if the collection exists and has the correct schema
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

async function verifyAndFix() {
    try {
        console.log('��� Verifying game_category_rankings collection...');
        console.log('   Endpoint:', endpoint);
        console.log('   Project ID:', projectId);
        console.log('   Database ID:', databaseId);

        // Try to get the collection
        try {
            const collection = await databases.getCollection(
                databaseId,
                'game_category_rankings'
            );
            console.log('✅ Collection exists:', collection.$id);
            console.log('📋 Collection name:', collection.name);
            console.log('📊 Attributes:', collection.attributes.length);
            
            // List all attributes
            console.log('\n📝 Current attributes:');
            collection.attributes.forEach((attr: any) => {
                console.log(`   - ${attr.key} (${attr.type})`);
            });

            // Check for required attributes
            const requiredAttrs = ['categoryId', 'rank', 'playerName', 'university', 'wins', 'losses', 'total', 'image'];
            const missingAttrs = requiredAttrs.filter(attr => 
                !collection.attributes.some((a: any) => a.key === attr)
            );

            if (missingAttrs.length > 0) {
                console.log('\n⚠️  Missing attributes:', missingAttrs);
                console.log('\n🔧 Adding missing attributes...');
                
                for (const attr of missingAttrs) {
                    try {
                        if (attr === 'image') {
                            await databases.createStringAttribute(
                                databaseId,
                                'game_category_rankings',
                                attr,
                                2048,
                                false
                            );
                        } else if (['wins', 'losses', 'total', 'rank'].includes(attr)) {
                            await databases.createIntegerAttribute(
                                databaseId,
                                'game_category_rankings',
                                attr,
                                false
                            );
                        } else {
                            await databases.createStringAttribute(
                                databaseId,
                                'game_category_rankings',
                                attr,
                                255,
                                attr === 'categoryId' || attr === 'playerName' || attr === 'university'
                            );
                        }
                        console.log(`   ✅ Added attribute: ${attr}`);
                    } catch (e) {
                        if ((e instanceof Error) && e.message.includes('already exists')) {
                            console.log(`   ℹ️  Attribute already exists: ${attr}`);
                        } else {
                            console.error(`   ❌ Error adding attribute ${attr}:`, (e instanceof Error) ? e.message : String(e));
                        }
                    }
                }
            } else {
                console.log('\n✅ All required attributes exist!');
            }

        } catch (e) {
            if ((e instanceof Error) && e.message.includes('not found')) {
                console.log('❌ Collection does not exist. Creating it now...');
                
                // Create the collection
                const collection = await databases.createCollection(
                    databaseId,
                    'game_category_rankings',
                    'Game Category Rankings',
                    undefined,
                    false
                );
                console.log('✅ Collection created:', collection.$id);

                // Create attributes
                const attributes = [
                    { name: 'categoryId', type: 'string', required: true, size: 255 },
                    { name: 'rank', type: 'integer', required: true },
                    { name: 'playerName', type: 'string', required: true, size: 255 },
                    { name: 'university', type: 'string', required: true, size: 255 },
                    { name: 'wins', type: 'integer', required: false },
                    { name: 'losses', type: 'integer', required: false },
                    { name: 'total', type: 'integer', required: false },
                    { name: 'image', type: 'string', required: false, size: 2048 },
                    { name: 'createdAt', type: 'string', required: false },
                    { name: 'updatedAt', type: 'string', required: false }
                ];

                console.log('📝 Creating attributes...');
                for (const attr of attributes) {
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
                        console.log(`   ✅ Created attribute: ${attr.name}`);
                    } catch (e) {
                        console.error(`   ❌ Error creating attribute ${attr.name}:`, (e instanceof Error) ? e.message : String(e));
                    }
                }

                // Create index
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
                    console.warn('   ⚠️  Could not create index:', (e instanceof Error) ? e.message : String(e));
                }
            } else {
                throw e;
            }
        }

        console.log('\n✅ Verification and setup complete!');
        console.log('\n📌 Next steps:');
        console.log('   1. Add game category rankings through the admin panel');
        console.log('   2. Rankings will be saved to Appwrite');
        console.log('   3. Rankings will appear on the rankings page');

    } catch (error) {
        console.error('❌ Error during verification:', (error instanceof Error) ? error.message : String(error));
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

verifyAndFix();
