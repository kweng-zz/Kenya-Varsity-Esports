
import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const databases = new Databases(client);

// Configuration
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const COLLECTION_ID = 'participants';

if (!API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY is missing in .env file.');
    process.exit(1);
}

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

async function inspectSchema() {
    try {
        console.log(`🔍 Inspecting Collection: ${COLLECTION_ID} in DB: ${DB_ID}`);

        const collection = await databases.getCollection(DB_ID, COLLECTION_ID);
        console.log(`✅ Collection Name: ${collection.name}`);
        console.log(`📅 Created At: ${collection.$createdAt}`);
        
        console.log('\n📋 Attributes:');
        console.log('----------------------------------------');
        
        if (collection.attributes && collection.attributes.length > 0) {
            collection.attributes.forEach(attr => {
                console.log(`• [${attr.key}] (${attr.type}) ${attr.required ? '*Required*' : 'Optional'} - Status: ${attr.status}`);
            });
            console.log(`\nTotal Attributes: ${collection.attributes.length}`);
        } else {
            console.log('No attributes found.');
        }
        
    } catch (error) {
        console.error('❌ Error inspecting collection:', error.message);
    }
}

inspectSchema();
