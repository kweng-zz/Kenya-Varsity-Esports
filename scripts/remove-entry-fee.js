
import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const client = new Client();
const databases = new Databases(client);

// Configure client
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const eventsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID;

if (!endpoint || !projectId || !apiKey || !dbId || !eventsCollectionId) {
    console.error('❌ Missing environment variables');
    console.log({ endpoint, projectId, apiKeyExists: !!apiKey, dbId, eventsCollectionId });
    process.exit(1);
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

async function removeEntryFee() {
    try {
        console.log(`🚀 Attempting to remove 'entryFee' attribute from collection ${eventsCollectionId}...`);
        
        await databases.deleteAttribute(dbId, eventsCollectionId, 'entryFee');
        
        console.log("✅ 'entryFee' attribute removed successfully!");
    } catch (error) {
        if (error.code === 404) {
             console.log("ℹ️ Attribute 'entryFee' not found. It might have been already removed.");
        } else {
             console.error('❌ Error removing attribute:', error);
        }
    }
}

removeEntryFee();
