
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

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const TOURNAMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID || 'tournaments';

async function addDateAttributes() {
    console.log('🚀 Starting Appwrite schema migration for Tournament Dates...');
    
    if (!process.env.APPWRITE_API_KEY) {
        console.error('❌ APPWRITE_API_KEY not found in .env');
        process.exit(1);
    }

    try {
        console.log(`📋 Using Database ID: ${DATABASE_ID}`);
        console.log(`📋 Using Collection ID: ${TOURNAMENTS_COLLECTION_ID}`);

        // List current attributes
        console.log('🔍 Checking existing attributes...');
        const attributes = await databases.listAttributes(DATABASE_ID, TOURNAMENTS_COLLECTION_ID);
        const attributeNames = attributes.attributes.map(a => a.key);
        
        console.log('Current attributes:', attributeNames.join(', '));

        // Add startDate if missing
        if (!attributeNames.includes('startDate')) {
            console.log('➕ Adding startDate attribute...');
            await databases.createDatetimeAttribute(
                DATABASE_ID,
                TOURNAMENTS_COLLECTION_ID,
                'startDate',
                false, // required
                null   // default value
            );
            console.log('✅ startDate attribute creation initiated');
        } else {
            console.log('ℹ️ startDate already exists');
        }

        // Add endDate if missing
        if (!attributeNames.includes('endDate')) {
            console.log('➕ Adding endDate attribute...');
            await databases.createDatetimeAttribute(
                DATABASE_ID,
                TOURNAMENTS_COLLECTION_ID,
                'endDate',
                false, // required
                null   // default value
            );
            console.log('✅ endDate attribute creation initiated');
        } else {
            console.log('ℹ️ endDate already exists');
        }

        console.log('\n🎉 Migration request sent successfully!');
        console.log('⏳ Please wait a few seconds for Appwrite to process the attribute creation before trying to save data.');

    } catch (error) {
        console.error('❌ Error during migration:', error);
        // If error suggests attributes are processing, that's fine
        if (error.code === 409) { // Conflict
             console.log('⚠️ Attribute already exists or is being created.');
        }
    }
}

addDateAttributes();
