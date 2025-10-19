#!/usr/bin/env node

import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client();
const databases = new Databases(client);

// Configure client
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'esports-db';

// Collection schemas
const collections = [
    {
        id: 'universities',
        name: 'Universities',
        attributes: [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'slug', type: 'string', size: 100, required: true },
            { key: 'region', type: 'string', size: 100, required: true },
            { key: 'logo', type: 'url', required: false },
            { key: 'isActive', type: 'boolean', required: false, default: true },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'slug_index', type: 'key', attributes: ['slug'] },
            { key: 'region_index', type: 'key', attributes: ['region'] }
        ]
    },
    {
        id: 'regions',
        name: 'Regions',
        attributes: [
            { key: 'name', type: 'string', size: 100, required: true },
            { key: 'slug', type: 'string', size: 100, required: true },
            { key: 'image', type: 'url', required: true },
            { key: 'description', type: 'string', size: 500, required: false },
            { key: 'backgroundImage', type: 'url', required: false },
            { key: 'isActive', type: 'boolean', required: false, default: true },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'slug_index', type: 'key', attributes: ['slug'] }
        ]
    },
    {
        id: 'game-categories',
        name: 'Game Categories',
        attributes: [
            { key: 'name', type: 'string', size: 100, required: true },
            { key: 'slug', type: 'string', size: 100, required: true },
            { key: 'title', type: 'string', size: 200, required: true },
            { key: 'description', type: 'string', size: 500, required: false },
            { key: 'image', type: 'url', required: true },
            { key: 'season', type: 'string', size: 50, required: true }, // 'september' or 'january'
            { key: 'category', type: 'string', size: 50, required: true }, // 'main' or 'added'
            { key: 'isActive', type: 'boolean', required: false, default: true },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'slug_index', type: 'key', attributes: ['slug'] },
            { key: 'season_index', type: 'key', attributes: ['season'] },
            { key: 'category_index', type: 'key', attributes: ['category'] }
        ]
    },
    {
        id: 'rankings',
        name: 'Rankings',
        attributes: [
            { key: 'universityId', type: 'string', size: 50, required: true },
            { key: 'universityName', type: 'string', size: 255, required: true },
            { key: 'gameCategory', type: 'string', size: 100, required: false }, // null for general rankings
            { key: 'region', type: 'string', size: 100, required: false },
            { key: 'rank', type: 'integer', required: true },
            { key: 'placementPoints', type: 'integer', required: false, default: 0 },
            { key: 'participationPoints', type: 'integer', required: false, default: 0 },
            { key: 'socialMediaPoints', type: 'integer', required: false, default: 0 },
            { key: 'bonusPoints', type: 'integer', required: false, default: 0 },
            { key: 'totalPoints', type: 'integer', required: true },
            { key: 'season', type: 'string', size: 50, required: true },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'university_index', type: 'key', attributes: ['universityId'] },
            { key: 'game_category_index', type: 'key', attributes: ['gameCategory'] },
            { key: 'region_index', type: 'key', attributes: ['region'] },
            { key: 'season_index', type: 'key', attributes: ['season'] },
            { key: 'total_points_index', type: 'key', attributes: ['totalPoints'] }
        ]
    },
    {
        id: 'sponsors',
        name: 'Sponsors',
        attributes: [
            { key: 'name', type: 'string', size: 200, required: true },
            { key: 'logo', type: 'url', required: true },
            { key: 'website', type: 'url', required: false },
            { key: 'description', type: 'string', size: 1000, required: false },
            { key: 'tier', type: 'string', size: 50, required: true }, // 'platinum', 'gold', 'silver', 'bronze'
            { key: 'isActive', type: 'boolean', required: false, default: true },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'tier_index', type: 'key', attributes: ['tier'] }
        ]
    },
    {
        id: 'contact-messages',
        name: 'Contact Messages',
        attributes: [
            { key: 'name', type: 'string', size: 200, required: true },
            { key: 'email', type: 'email', required: true },
            { key: 'message', type: 'string', size: 2000, required: true },
            { key: 'type', type: 'string', size: 50, required: true }, // 'partnership', 'press', 'general'
            { key: 'status', type: 'string', size: 50, required: false, default: 'unread' }, // 'unread', 'read', 'replied'
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'status_index', type: 'key', attributes: ['status'] },
            { key: 'type_index', type: 'key', attributes: ['type'] },
            { key: 'created_at_index', type: 'key', attributes: ['createdAt'] }
        ]
    }
];

async function createDatabase() {
    try {
        console.log('🚀 Creating Appwrite database...');
        
        // Check if API key is configured
        const apiKey = process.env.APPWRITE_API_KEY;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        
        if (!apiKey || apiKey === 'your_appwrite_api_key_here') {
            console.log('❌ Appwrite API key not configured!');
            console.log('');
            console.log('📋 To set up Appwrite database, follow these steps:');
            console.log('');
            console.log('1. Go to https://cloud.appwrite.io');
            console.log('2. Create a new project (or use existing)');
            console.log('3. Go to "API Keys" in your project settings');
            console.log('4. Create a new API key with these scopes:');
            console.log('   - databases.read');
            console.log('   - databases.write');
            console.log('   - collections.read');
            console.log('   - collections.write');
            console.log('   - attributes.read');
            console.log('   - attributes.write');
            console.log('   - indexes.read');
            console.log('   - indexes.write');
            console.log('   - documents.read');
            console.log('   - documents.write');
            console.log('');
            console.log('5. Update your .env file:');
            console.log('   APPWRITE_API_KEY=your_actual_api_key_here');
            console.log('');
            console.log('6. Run this script again: npm run setup:appwrite');
            console.log('');
            console.log('💡 Your application is currently working in fallback mode.');
            console.log('   Visit http://localhost:3000/rankings to see it in action!');
            console.log('');
            return;
        }
        
        if (!projectId || projectId === 'your_appwrite_project_id_here') {
            console.log('❌ Appwrite Project ID not configured!');
            console.log('');
            console.log('Please update NEXT_PUBLIC_APPWRITE_PROJECT_ID in your .env file');
            console.log('with your actual Appwrite project ID.');
            console.log('');
            return;
        }
        
        console.log(`📋 Using Project ID: ${projectId}`);
        console.log(`🔑 API Key configured: ${apiKey.substring(0, 10)}...`);
        
        // Check if database exists, if not try to create it
        try {
            const existingDb = await databases.get(DATABASE_ID);
            console.log('✅ Database already exists: ' + existingDb.name);
        } catch (error) {
            if (error.code === 404) {
                // Database doesn't exist, try to create it
                try {
                    await databases.create(DATABASE_ID, 'Esports Database');
                    console.log('✅ Database created successfully');
                } catch (createError) {
                    if (createError.code === 403 && createError.type === 'additional_resource_not_allowed') {
                        console.log('⚠️  Database limit reached. Using existing database instead...');
                        
                        // List existing databases and use the first one
                        const dbList = await databases.list();
                        if (dbList.total > 0) {
                            const existingDbId = dbList.databases[0].$id;
                            console.log(`📋 Using existing database: ${existingDbId}`);
                            console.log('💡 Update your .env file with:');
                            console.log(`NEXT_PUBLIC_APPWRITE_DB_ID=${existingDbId}`);
                            
                            // Update the DATABASE_ID for this session
                            process.env.NEXT_PUBLIC_APPWRITE_DB_ID = existingDbId;
                            global.DATABASE_ID = existingDbId;
                        } else {
                            throw new Error('No databases available and cannot create new one');
                        }
                    } else {
                        throw createError;
                    }
                }
            } else {
                throw error;
            }
        }

        // Create collections
        for (const collection of collections) {
            try {
                console.log(`📁 Creating collection: ${collection.name}`);
                
                await databases.createCollection(
                    DATABASE_ID,
                    collection.id,
                    collection.name,
                    [
                        Permission.read(Role.any()),
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users())
                    ]
                );

                // Add attributes
                for (const attr of collection.attributes) {
                    console.log(`  📝 Adding attribute: ${attr.key}`);
                    
                    switch (attr.type) {
                        case 'string':
                            await databases.createStringAttribute(
                                DATABASE_ID,
                                collection.id,
                                attr.key,
                                attr.size,
                                attr.required,
                                attr.default || null
                            );
                            break;
                        case 'integer':
                            await databases.createIntegerAttribute(
                                DATABASE_ID,
                                collection.id,
                                attr.key,
                                attr.required,
                                null,
                                null,
                                attr.default || null
                            );
                            break;
                        case 'boolean':
                            await databases.createBooleanAttribute(
                                DATABASE_ID,
                                collection.id,
                                attr.key,
                                attr.required,
                                attr.default || null
                            );
                            break;
                        case 'datetime':
                            await databases.createDatetimeAttribute(
                                DATABASE_ID,
                                collection.id,
                                attr.key,
                                attr.required,
                                attr.default || null
                            );
                            break;
                        case 'email':
                            await databases.createEmailAttribute(
                                DATABASE_ID,
                                collection.id,
                                attr.key,
                                attr.required,
                                attr.default || null
                            );
                            break;
                        case 'url':
                            await databases.createUrlAttribute(
                                DATABASE_ID,
                                collection.id,
                                attr.key,
                                attr.required,
                                attr.default || null
                            );
                            break;
                    }
                    
                    // Wait a bit between attribute creation
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Create indexes
                if (collection.indexes) {
                    for (const index of collection.indexes) {
                        console.log(`  🔍 Creating index: ${index.key}`);
                        try {
                            await databases.createIndex(
                                DATABASE_ID,
                                collection.id,
                                index.key,
                                index.type,
                                index.attributes
                            );
                        } catch (error) {
                            console.log(`    ⚠️ Index creation failed (may already exist): ${error.message}`);
                        }
                        
                        // Wait a bit between index creation
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                console.log(`✅ Collection ${collection.name} created successfully`);
                
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️ Collection ${collection.name} already exists, skipping...`);
                } else {
                    console.error(`❌ Error creating collection ${collection.name}:`, error);
                }
            }
        }

        console.log('🎉 Database setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Update your .env file with the following variables:');
        console.log(`NEXT_PUBLIC_APPWRITE_DB_ID=${DATABASE_ID}`);
        console.log(`NEXT_PUBLIC_APPWRITE_RANKINGS_COLLECTION_ID=rankings`);
        console.log(`NEXT_PUBLIC_APPWRITE_REGIONS_COLLECTION_ID=regions`);
        console.log(`NEXT_PUBLIC_APPWRITE_GAME_CATEGORIES_COLLECTION_ID=game-categories`);
        console.log(`NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID=universities`);
        console.log(`NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID=sponsors`);
        console.log(`NEXT_PUBLIC_APPWRITE_CONTACT_MESSAGES_COLLECTION_ID=contact-messages`);
        console.log('\n2. Run the data population script:');
        console.log('npm run populate:appwrite');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
}

// Run the setup
createDatabase();