const { Client, Users, Databases, ID, Query } = require('node-appwrite');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const profileCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID;

if (!endpoint || !projectId || !apiKey) {
    console.error('❌ Missing configuration. Please ensure .env has endpoint, project ID, and API key.');
    process.exit(1);
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const users = new Users(client);
const databases = new Databases(client);

const crypto = require('crypto');

const createAdmin = async () => {
    // Generate a strong random password if not provided in env
    const generatePassword = () => {
        return crypto.randomBytes(16).toString('hex') + '!Aa1'; // Ensure complexity
    };

    const email = process.env.ADMIN_EMAIL || 'admin@kve.com';
    const password = process.env.ADMIN_PASSWORD || generatePassword();
    const name = 'Admin User';

    try {
        // Search for user
        const userList = await users.list([
            Query.equal('email', email)
        ]);

        let userId;

        if (userList.total > 0) {
            userId = userList.users[0].$id;
            
            // Update password
            try {
                await users.updatePassword(userId, password);
                console.log('✅ Password updated.');
            } catch (pwError) {
                console.warn('⚠️ Could not update password (might be same as previous or API restriction):', pwError.message);
            }
        } else {
            const newUser = await users.create(ID.unique(), email, undefined, password, name);
            userId = newUser.$id;
        }

        // Check/Create Profile
        if (dbId && profileCollectionId) {
            try {
                const profile = await databases.getDocument(dbId, profileCollectionId, userId);
                
                await databases.updateDocument(dbId, profileCollectionId, userId, {
                    isAdmin: true,
                    status: 'approved',
                    user_type: 'visitor'
                });

            } catch (error) {
                if (error.code === 404) {
                    await databases.createDocument(dbId, profileCollectionId, userId, {
                        fullname: name,
                        email: email,
                        isAdmin: true,
                        isTeamCaptain: false,
                        user_type: 'visitor',
                        status: 'approved',
                        university: 'KVE Administration'
                    });
                } else {
                    throw error;
                }
            }
        } else {
             console.warn('⚠️ Database ID or Profile Collection ID missing. Cannot create profile document.');
        }

        console.log('--------------------------------------------------');
        console.log('🔐 SECURE ADMIN ACCOUNT READY');
        console.log('--------------------------------------------------');
        console.log(`👤 Email:    ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log('--------------------------------------------------');
        console.log('⚠️  SAVE THIS PASSWORD NOW. IT WILL NOT BE SHOWN AGAIN.');
        console.log('--------------------------------------------------');

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    }
};

createAdmin();
