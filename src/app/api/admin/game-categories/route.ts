import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID } from 'node-appwrite';

// Initialize server-side Appwrite client
const initializeAppwrite = () => {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId || !apiKey) {
        throw new Error('Appwrite server configuration missing');
    }

    const client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey);

    return new Databases(client);
};

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const GAME_CATEGORIES_COLLECTION = 'game_category_rankings';

// In-memory storage as fallback (will be lost on server restart)
const inMemoryStorage = new Map<string, any[]>();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        // Normalization map for category IDs
        const categoryIdNormalizationMap: Record<string, string[]> = {
            'pubg-mobile': ['pubgm', 'pubg', 'pubg-mobile'],
            'call-of-duty-mobile-br': ['codm', 'codm-br', 'call-of-duty-mobile-br'],
            'efootball-mobile': ['efootball', 'efootball-mobile'],
            'eafc-1v1': ['eafc', 'eafc-1v1'],
            'eafc-2v2': ['eafc-2v2'],
            'eafc-women': ['eafc-women'],
            'codm-multiplayer': ['codm-mp', 'codm-multiplayer']
        };

        try {
            const databases = initializeAppwrite();
            
            // If a specific categoryId is requested, only fetch that category
            let queries: any[] = [Query.limit(1000)];
            if (categoryId) {
                // Try to find the normalized version of the categoryId
                let normalizedId = categoryId;
                for (const [nId, aliases] of Object.entries(categoryIdNormalizationMap)) {
                    if (aliases.includes(categoryId)) {
                        normalizedId = nId;
                        break;
                    }
                }
                queries = [Query.equal('categoryId', normalizedId), Query.limit(1000)];
            }
            
            const response = await databases.listDocuments(
                DATABASE_ID,
                GAME_CATEGORIES_COLLECTION,
                queries
            );

            // Group documents by categoryId and normalize
            const groupedData: Record<string, any[]> = {};
            response.documents.forEach((doc: any) => {
                let cId = doc.categoryId;
                
                // Normalize the categoryId
                for (const [normalizedId, aliases] of Object.entries(categoryIdNormalizationMap)) {
                    if (aliases.includes(cId)) {
                        cId = normalizedId;
                        break;
                    }
                }
                
                if (!groupedData[cId]) {
                    groupedData[cId] = [];
                }
                groupedData[cId].push(doc);
            });

            console.log('✅ Admin API - Fetched rankings from Appwrite:', Object.keys(groupedData));

            return NextResponse.json({
                success: true,
                data: groupedData,
                source: 'appwrite'
            });
        } catch (appwriteError: any) {
            console.warn('⚠️ Appwrite collection not found, using fallback storage:', appwriteError.message);
            
            // Fallback to in-memory storage - return as grouped object
            const groupedData: Record<string, any[]> = {};
            
            inMemoryStorage.forEach((rankings, cId) => {
                // If a specific categoryId is requested, only include that category
                if (categoryId) {
                    let normalizedId = categoryId;
                    for (const [nId, aliases] of Object.entries(categoryIdNormalizationMap)) {
                        if (aliases.includes(categoryId)) {
                            normalizedId = nId;
                            break;
                        }
                    }
                    if (cId !== normalizedId) {
                        return; // Skip this category
                    }
                }
                
                // Normalize the categoryId
                let normalizedId = cId;
                for (const [nId, aliases] of Object.entries(categoryIdNormalizationMap)) {
                    if (aliases.includes(cId)) {
                        normalizedId = nId;
                        break;
                    }
                }
                
                if (!groupedData[normalizedId]) {
                    groupedData[normalizedId] = [];
                }
                groupedData[normalizedId].push(...rankings);
            });

            console.log('✅ Admin API - Fetched rankings from fallback:', Object.keys(groupedData));

            return NextResponse.json({
                success: true,
                data: groupedData,
                source: 'fallback'
            });
        }
    } catch (error: any) {
        console.error('❌ Error fetching game category rankings:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch game category rankings'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { categoryId, rankings, replaceAll } = body;

        if (!categoryId || !Array.isArray(rankings)) {
            return NextResponse.json({
                success: false,
                error: 'Category ID and rankings array are required'
            }, { status: 400 });
        }

        // Normalization map for category IDs
        const categoryIdNormalizationMap: Record<string, string[]> = {
            'pubg-mobile': ['pubgm', 'pubg', 'pubg-mobile'],
            'call-of-duty-mobile-br': ['codm', 'codm-br', 'call-of-duty-mobile-br'],
            'efootball-mobile': ['efootball', 'efootball-mobile'],
            'eafc-1v1': ['eafc', 'eafc-1v1'],
            'eafc-2v2': ['eafc-2v2'],
            'eafc-women': ['eafc-women'],
            'codm-multiplayer': ['codm-mp', 'codm-multiplayer']
        };

        // Normalize the incoming categoryId
        let normalizedCategoryId = categoryId;
        for (const [nId, aliases] of Object.entries(categoryIdNormalizationMap)) {
            if (aliases.includes(categoryId)) {
                normalizedCategoryId = nId;
                break;
            }
        }

        try {
            const databases = initializeAppwrite();
            console.log('✅ Appwrite initialized for POST');
            console.log('📝 DATABASE_ID:', DATABASE_ID);
            console.log('📝 COLLECTION:', GAME_CATEGORIES_COLLECTION);
            console.log('📝 Original Category ID:', categoryId);
            console.log('📝 Normalized Category ID:', normalizedCategoryId);
            console.log('📝 Rankings count:', rankings.length);
            console.log('📝 Replace all:', replaceAll);

            const createdRankings = [];
            const now = new Date().toISOString();

            // ALWAYS delete existing rankings for this specific category before adding new ones
            // This ensures we don't have duplicate or mixed data when updating a category
            try {
                console.log('🗑️ Attempting to delete existing rankings for category:', normalizedCategoryId);
                
                // First, try to delete with the normalized ID
                let existingRankings = await databases.listDocuments(
                    DATABASE_ID,
                    GAME_CATEGORIES_COLLECTION,
                    [Query.equal('categoryId', normalizedCategoryId)]
                );

                console.log('🗑️ Found existing rankings with normalized ID:', existingRankings.documents.length);
                
                // If no results with normalized ID, try with original ID
                if (existingRankings.documents.length === 0) {
                    console.log('🗑️ No results with normalized ID, trying original ID:', categoryId);
                    existingRankings = await databases.listDocuments(
                        DATABASE_ID,
                        GAME_CATEGORIES_COLLECTION,
                        [Query.equal('categoryId', categoryId)]
                    );
                    console.log('🗑️ Found existing rankings with original ID:', existingRankings.documents.length);
                }

                // Delete all found documents
                for (const doc of existingRankings.documents) {
                    await databases.deleteDocument(
                        DATABASE_ID,
                        GAME_CATEGORIES_COLLECTION,
                        doc.$id
                    );
                    console.log('🗑️ Deleted:', doc.$id);
                }
            } catch (e) {
                console.log('⚠️ Error deleting existing rankings:', (e as any).message);
            }

            // Create new rankings
            console.log('📝 Creating new rankings...');
            for (const ranking of rankings) {
                console.log('📝 Creating ranking:', { rank: ranking.rank, university: ranking.university, total: ranking.total });
                
                // Ensure numeric fields are properly converted
                const rankValue = parseInt(String(ranking.rank)) || 0;
                const winsValue = parseInt(String(ranking.wins)) || 0;
                const lossesValue = parseInt(String(ranking.losses)) || 0;
                const totalValue = parseInt(String(ranking.total)) || 0;
                
                console.log('📝 Parsed values:', { rankValue, winsValue, lossesValue, totalValue });
                
                const response = await databases.createDocument(
                    DATABASE_ID,
                    GAME_CATEGORIES_COLLECTION,
                    ID.unique(),
                    {
                        categoryId: String(normalizedCategoryId),
                        rank: String(rankValue),
                        playerName: String(ranking.playerName || ''),
                        university: String(ranking.university || ''),
                        wins: String(winsValue),
                        losses: String(lossesValue),
                        total: String(totalValue),
                        image: String(ranking.image || ''),
                        createdAt: now,
                        updatedAt: now
                    }
                );
                console.log('✅ Created ranking:', response.$id);
                createdRankings.push(response);
            }

            console.log('✅ Successfully saved all rankings to Appwrite');
            return NextResponse.json({
                success: true,
                data: createdRankings,
                message: `Successfully saved ${createdRankings.length} rankings for category ${categoryId}`,
                source: 'appwrite'
            });
        } catch (appwriteError: any) {
            console.error('❌ Appwrite error:', appwriteError.message);
            console.error('❌ Full error:', appwriteError);
            
            // Fallback to in-memory storage
            const now = new Date().toISOString();
            const rankingsWithMetadata = rankings.map((ranking: any) => ({
                ...ranking,
                categoryId,
                $id: `${categoryId}-${ranking.rank}-${Date.now()}`,
                createdAt: now,
                updatedAt: now
            }));

            inMemoryStorage.set(categoryId, rankingsWithMetadata);

            return NextResponse.json({
                success: true,
                data: rankingsWithMetadata,
                message: `Successfully saved ${rankingsWithMetadata.length} rankings for category ${categoryId} (using fallback storage)`,
                source: 'fallback',
                warning: 'Collection not found in Appwrite. Data is stored in memory and will be lost on server restart. Please create the game_category_rankings collection in Appwrite.'
            });
        }
    } catch (error: any) {
        console.error('Error saving game category rankings:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to save game category rankings'
        }, { status: 500 });
    }
}
