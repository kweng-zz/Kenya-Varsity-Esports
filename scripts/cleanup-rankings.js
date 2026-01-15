const { Client, Databases, Query } = require('node-appwrite');

// Initialize Appwrite
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const RANKINGS_COLLECTION = 'game_category_rankings';

async function cleanupRankings() {
    try {
        console.log('🧹 Starting cleanup of rankings...');
        console.log('Database ID:', DATABASE_ID);
        console.log('Collection:', RANKINGS_COLLECTION);

        // Fetch all rankings
        const response = await databases.listDocuments(
            DATABASE_ID,
            RANKINGS_COLLECTION,
            [Query.limit(1000)]
        );

        console.log(`📊 Found ${response.documents.length} total rankings`);

        // Find and delete call-of-duty-mobile-br rankings
        const codmBrRankings = response.documents.filter(doc => 
            doc.categoryId === 'call-of-duty-mobile-br'
        );

        console.log(`🗑️ Found ${codmBrRankings.length} call-of-duty-mobile-br rankings to delete`);

        if (codmBrRankings.length > 0) {
            for (const doc of codmBrRankings) {
                await databases.deleteDocument(
                    DATABASE_ID,
                    RANKINGS_COLLECTION,
                    doc.$id
                );
                console.log(`✅ Deleted: ${doc.$id} - ${doc.playerName || 'Unknown'}`);
            }
            console.log(`✅ Successfully deleted ${codmBrRankings.length} rankings`);
        } else {
            console.log('ℹ️ No call-of-duty-mobile-br rankings found to delete');
        }

        // Show remaining rankings by category
        const remaining = await databases.listDocuments(
            DATABASE_ID,
            RANKINGS_COLLECTION,
            [Query.limit(1000)]
        );

        const byCategory = new Map();
        remaining.documents.forEach(doc => {
            const count = byCategory.get(doc.categoryId) || 0;
            byCategory.set(doc.categoryId, count + 1);
        });

        console.log('\n📊 Remaining rankings by category:');
        byCategory.forEach((count, category) => {
            console.log(`  - ${category}: ${count} rankings`);
        });

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}

cleanupRankings();
