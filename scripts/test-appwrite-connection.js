#!/usr/bin/env node

import { Client, Databases } from 'node-appwrite';
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

async function testConnection() {
    console.log('🔍 Testing Appwrite Database Connection...\n');
    
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    
    console.log('📋 Configuration:');
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Project ID: ${projectId}`);
    console.log(`Database ID: ${DATABASE_ID}`);
    console.log(`API Key: ${apiKey ? apiKey.substring(0, 20) + '...' : 'Not set'}\n`);
    
    // Test 1: Check if API key is still placeholder
    if (!apiKey || apiKey === 'paste_your_actual_api_key_here') {
        console.log('❌ API Key is still the placeholder value');
        console.log('📋 You need to:');
        console.log('1. Go to https://cloud.appwrite.io');
        console.log('2. Open your project: ' + projectId);
        console.log('3. Go to Settings → API Keys');
        console.log('4. Create a new API Key with database permissions');
        console.log('5. Update APPWRITE_API_KEY in your .env file');
        console.log('\n💡 Your app works fine in fallback mode for now!');
        return;
    }
    
    try {
        console.log('🔄 Testing connection to Appwrite...');
        
        // Test 2: Try to list databases
        const databasesList = await databases.list();
        console.log('✅ Successfully connected to Appwrite!');
        console.log(`📊 Found ${databasesList.total} database(s)\n`);
        
        // Test 3: Check if our specific database exists
        let ourDatabase = null;
        try {
            ourDatabase = await databases.get(DATABASE_ID);
            console.log('✅ Database "' + DATABASE_ID + '" exists');
            console.log(`📅 Created: ${new Date(ourDatabase.$createdAt).toLocaleString()}`);
            console.log(`📅 Updated: ${new Date(ourDatabase.$updatedAt).toLocaleString()}\n`);
        } catch (error) {
            if (error.code === 404) {
                console.log('❌ Database "' + DATABASE_ID + '" does not exist');
                console.log('📋 Run: npm run setup:appwrite to create it\n');
                return;
            } else {
                throw error;
            }
        }
        
        // Test 4: List collections in the database
        try {
            const collections = await databases.listCollections(DATABASE_ID);
            console.log('📁 Collections in database:');
            
            if (collections.total === 0) {
                console.log('❌ No collections found');
                console.log('📋 Run: npm run setup:appwrite to create collections\n');
            } else {
                console.log(`✅ Found ${collections.total} collection(s):`);
                collections.collections.forEach(collection => {
                    console.log(`   - ${collection.name} (${collection.$id})`);
                });
                console.log('');
                
                // Test 5: Check if we have data
                const expectedCollections = ['universities', 'regions', 'game-categories', 'rankings', 'sponsors', 'contact-messages'];
                const existingCollections = collections.collections.map(c => c.$id);
                const missingCollections = expectedCollections.filter(c => !existingCollections.includes(c));
                
                if (missingCollections.length > 0) {
                    console.log('⚠️  Missing collections:', missingCollections.join(', '));
                    console.log('📋 Run: npm run setup:appwrite to create missing collections\n');
                } else {
                    console.log('✅ All expected collections exist!');
                    
                    // Test 6: Check for sample data
                    try {
                        const universities = await databases.listDocuments(DATABASE_ID, 'universities');
                        const rankings = await databases.listDocuments(DATABASE_ID, 'rankings');
                        
                        console.log(`📊 Data summary:`);
                        console.log(`   - Universities: ${universities.total}`);
                        console.log(`   - Rankings: ${rankings.total}`);
                        
                        if (universities.total === 0 || rankings.total === 0) {
                            console.log('⚠️  No sample data found');
                            console.log('📋 Run: npm run populate:appwrite to add sample data\n');
                        } else {
                            console.log('✅ Sample data exists!\n');
                            
                            console.log('🎉 Your Appwrite database is fully set up and ready!');
                            console.log('📋 To switch to live mode:');
                            console.log('1. Set NEXT_PUBLIC_FALLBACK_MODE=false in .env');
                            console.log('2. Restart your dev server: npm run dev');
                            console.log('3. Visit: http://localhost:3000/rankings');
                        }
                    } catch (error) {
                        console.log('⚠️  Could not check sample data:', error.message);
                    }
                }
            }
        } catch (error) {
            console.log('❌ Could not list collections:', error.message);
        }
        
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        
        if (error.code === 401) {
            console.log('🔑 This is likely an API key issue:');
            console.log('   - Check that your API key is correct');
            console.log('   - Ensure it has the required database permissions');
            console.log('   - Make sure it hasn\'t expired');
        } else if (error.code === 404) {
            console.log('🔍 Project not found:');
            console.log('   - Check that your Project ID is correct: ' + projectId);
            console.log('   - Ensure you\'re using the right Appwrite account');
        }
        
        console.log('\n💡 Your app still works perfectly in fallback mode!');
    }
}

testConnection().catch(console.error);