
import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const databases = new Databases(client);

// Configuration
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const COLLECTION_ID = 'participants'; // Static ID for simplicity

if (!API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY is missing in .env file.');
    process.exit(1);
}

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

async function setupParticipantsCollection() {
    try {
        console.log(`🚀 Setting up Participants Collection (${COLLECTION_ID})...`);

        // 1. Create Collection
        try {
            await databases.createCollection(
                DB_ID,
                COLLECTION_ID,
                'Participants',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.create(Role.team('admins')),
                    Permission.update(Role.users()),
                    Permission.update(Role.team('admins')),
                    Permission.delete(Role.users()),
                    Permission.delete(Role.team('admins'))
                ]
            );
            console.log('✅ Collection created.');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️ Collection already exists.');
            } else {
                throw error;
            }
        }

        // 2. Add Attributes
        const attributes = [
            { key: 'tournamentSlug', type: 'string', size: 100, required: true },
            { key: 'teamName', type: 'string', size: 100, required: true },
            { key: 'teamLeader', type: 'string', size: 100, required: true },
            { key: 'teamLeaderEmail', type: 'email', required: true },
            { key: 'teamLeaderPhone', type: 'string', size: 50, required: false },
            { key: 'university', type: 'string', size: 100, required: false },
            { key: 'members', type: 'string', size: 5000, required: true }, // JSON string
            { key: 'registrationDate', type: 'datetime', required: true },
            { key: 'status', type: 'string', size: 50, required: true },
            { key: 'paymentStatus', type: 'string', size: 50, required: true },
            { key: 'totalMembers', type: 'integer', required: true }
        ];

        for (const attr of attributes) {
            try {
                console.log(`📝 Adding attribute: ${attr.key}`);
                switch (attr.type) {
                    case 'string':
                        await databases.createStringAttribute(DB_ID, COLLECTION_ID, attr.key, attr.size, attr.required);
                        break;
                    case 'email':
                        await databases.createEmailAttribute(DB_ID, COLLECTION_ID, attr.key, attr.required);
                        break;
                    case 'integer':
                        await databases.createIntegerAttribute(DB_ID, COLLECTION_ID, attr.key, attr.required);
                        break;
                    case 'datetime':
                        await databases.createDatetimeAttribute(DB_ID, COLLECTION_ID, attr.key, attr.required);
                        break;
                }
                // Small delay to prevent rate limits
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️ Attribute ${attr.key} already exists.`);
                } else {
                    console.error(`❌ Failed to add attribute ${attr.key}:`, error.message);
                }
            }
        }

        console.log('🎉 Participants collection setup complete!');

    } catch (error) {
        console.error('❌ Error setting up participants collection:', error);
        process.exit(1);
    }
}

setupParticipantsCollection();
