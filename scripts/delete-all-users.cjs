const { Client, Users, Databases, Query } = require('node-appwrite');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
    console.error('❌ Missing configuration. Please ensure NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, and APPWRITE_API_KEY are set in your .env file.');
    process.exit(1);
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const users = new Users(client);
const databases = new Databases(client);

const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const profileCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID;

const deleteAllUsers = async () => {
    try {
        console.log('🔄 Fetching users...');
        const userList = await users.list([Query.limit(100)]);
        
        console.log(`Found ${userList.total} users.`);

        for (const user of userList.users) {
            console.log(`🗑️ Deleting user: ${user.name} (${user.$id})`);
            try {
                await users.delete(user.$id);
                console.log(`✅ User ${user.$id} deleted from Auth.`);
            } catch (error) {
                console.error(`❌ Failed to delete user ${user.$id}:`, error.message);
            }
        }

        if (dbId && profileCollectionId) {
            console.log('🔄 Fetching profile documents...');
            const documents = await databases.listDocuments(dbId, profileCollectionId, [Query.limit(100)]);
            console.log(`Found ${documents.total} documents.`);
            
            for (const doc of documents.documents) {
                 console.log(`🗑️ Deleting profile: ${doc.$id}`);
                 try {
                     await databases.deleteDocument(dbId, profileCollectionId, doc.$id);
                     console.log(`✅ Profile ${doc.$id} deleted from DB.`);
                 } catch (error) {
                     console.error(`❌ Failed to delete profile ${doc.$id}:`, error.message);
                 }
            }
        } else {
            console.warn('⚠️ Database ID or Profile Collection ID not found, skipping profile deletion.');
        }

        console.log('🎉 Cleanup complete.');

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    }
};

deleteAllUsers();
