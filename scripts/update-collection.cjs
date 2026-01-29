const { Client, Databases } = require('node-appwrite');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY; // Must use Server API Key
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const collectionId = 'season_statistics';

if (!endpoint || !projectId || !apiKey || !dbId) {
    console.error('❌ Missing configuration. Please ensure .env has endpoint, project ID, API key, and DB ID.');
    process.exit(1);
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);

const updateSchema = async () => {
    try {
        console.log(`Checking attribute 'seasonTitle' in collection ${collectionId}...`);
        
        try {
            await databases.createStringAttribute(dbId, collectionId, 'seasonTitle', 255, false);
            console.log('✅ Attribute "seasonTitle" created successfully!');
            console.log('⏳ Waiting for attribute to be available (this may take a few seconds)...');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️ Attribute "seasonTitle" already exists.');
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error('❌ Error updating schema:', error.message);
    }
};

updateSchema();
