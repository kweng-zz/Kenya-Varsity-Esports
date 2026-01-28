import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID } from 'node-appwrite';
import { checkAdminAuth } from '@/lib/auth-check';

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
const RANKINGS_COLLECTION = 'game_category_rankings';

// In-memory storage as fallback
const inMemoryStorage = new Map<string, any[]>();

interface RankingEntry {
    rank: number;
    playerName: string;
    university: string;
    wins: number;
    losses: number;
    total: number;
    points?: number;
    image?: string;
    game?: string;
}

interface RankingsRequest {
    categoryId: string;
    rankings: RankingEntry[];
    replaceAll?: boolean;
}

/**
 * GET /api/admin/rankings
 * Fetch rankings for a specific game category or all categories
 * Query params:
 *   - categoryId: (optional) Specific category to fetch
 *   - limit: (optional) Number of rankings to return (default: 100)
 */
export async function GET(request: NextRequest) {
    // Check admin authentication
    const authError = await checkAdminAuth(request);
    if (authError) return authError;

    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const limit = parseInt(searchParams.get('limit') || '100');

        console.log('📊 Admin Rankings API - GET called with:', { categoryId, limit });

        try {
            const databases = initializeAppwrite();

            let queries: any[] = [Query.limit(limit)];
            
            if (categoryId) {
                queries.push(Query.equal('categoryId', categoryId));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                RANKINGS_COLLECTION,
                queries
            );

            console.log('✅ Admin Rankings API - Fetched from Appwrite:', response.documents.length);

            // Transform documents to match RankingEntry format
            const rankings = response.documents.map((doc: any) => ({
                id: doc.$id,
                rank: parseInt(doc.rank) || 0,
                playerName: doc.playerName || '',
                university: doc.university || '',
                wins: parseInt(doc.wins) || 0,
                losses: parseInt(doc.losses) || 0,
                total: parseInt(doc.total) || 0,
                points: parseInt(doc.points) || parseInt(doc.total) || 0,
                image: doc.image || '',
                game: doc.game || categoryId || '',
                categoryId: doc.categoryId || categoryId || ''
            }));

            return NextResponse.json({
                success: true,
                data: rankings,
                source: 'appwrite',
                count: rankings.length
            });
        } catch (appwriteError: any) {
            console.warn('⚠️ Appwrite error, using fallback storage:', appwriteError.message);

            // Fallback to in-memory storage
            let rankings: any[] = [];

            if (categoryId) {
                rankings = inMemoryStorage.get(categoryId) || [];
            } else {
                // Return all rankings from all categories
                inMemoryStorage.forEach((categoryRankings) => {
                    rankings.push(...categoryRankings);
                });
            }

            return NextResponse.json({
                success: true,
                data: rankings,
                source: 'fallback',
                count: rankings.length,
                warning: 'Using fallback storage - Appwrite collection may not exist'
            });
        }
    } catch (error: any) {
        console.error('❌ Error fetching rankings:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch rankings'
        }, { status: 500 });
    }
}

/**
 * POST /api/admin/rankings
 * Create or update rankings for a game category
 * Body:
 *   - categoryId: string (required) - The game category ID
 *   - rankings: RankingEntry[] (required) - Array of ranking entries
 *   - replaceAll: boolean (optional) - If true, replace all existing rankings for this category
 */
export async function POST(request: NextRequest) {
    // Check admin authentication
    const authError = await checkAdminAuth(request);
    if (authError) return authError;

    try {
        const body: RankingsRequest = await request.json();
        const { categoryId, rankings, replaceAll = true } = body;

        if (!categoryId || !Array.isArray(rankings)) {
            return NextResponse.json({
                success: false,
                error: 'Category ID and rankings array are required'
            }, { status: 400 });
        }

        if (rankings.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Rankings array cannot be empty'
            }, { status: 400 });
        }

        console.log('📝 Admin Rankings API - POST called with:', {
            categoryId,
            rankingsCount: rankings.length,
            replaceAll
        });

        try {
            const databases = initializeAppwrite();

            // If replaceAll is true, delete existing rankings for this category
            if (replaceAll) {
                try {
                    console.log('🗑️ Deleting existing rankings for category:', categoryId);

                    const existingRankings = await databases.listDocuments(
                        DATABASE_ID,
                        RANKINGS_COLLECTION,
                        [Query.equal('categoryId', categoryId)]
                    );

                    console.log('🗑️ Found existing rankings:', existingRankings.documents.length);

                    for (const doc of existingRankings.documents) {
                        await databases.deleteDocument(
                            DATABASE_ID,
                            RANKINGS_COLLECTION,
                            doc.$id
                        );
                        console.log('🗑️ Deleted ranking:', doc.$id);
                    }
                } catch (deleteError: any) {
                    console.warn('⚠️ Error deleting existing rankings:', deleteError.message);
                }
            }

            // Create new rankings
            const createdRankings = [];
            const now = new Date().toISOString();

            console.log('📝 Creating new rankings...');

            for (const ranking of rankings) {
                const rankValue = parseInt(String(ranking.rank)) || 0;
                const winsValue = parseInt(String(ranking.wins)) || 0;
                const lossesValue = parseInt(String(ranking.losses)) || 0;
                const totalValue = parseInt(String(ranking.total)) || 0;
                const pointsValue = parseInt(String(ranking.points || ranking.total)) || 0;

                const doc = await databases.createDocument(
                    DATABASE_ID,
                    RANKINGS_COLLECTION,
                    ID.unique(),
                    {
                        categoryId: String(categoryId),
                        rank: String(rankValue),
                        playerName: String(ranking.playerName || ''),
                        university: String(ranking.university || ''),
                        wins: String(winsValue),
                        losses: String(lossesValue),
                        total: String(totalValue),
                        points: String(pointsValue),
                        image: String(ranking.image || ''),
                        createdAt: now,
                        updatedAt: now
                    }
                );

                createdRankings.push({
                    id: doc.$id,
                    ...ranking,
                    rank: rankValue,
                    wins: winsValue,
                    losses: lossesValue,
                    total: totalValue,
                    points: pointsValue
                });

                console.log('✅ Created ranking:', doc.$id);
            }

            console.log('✅ Successfully saved all rankings to Appwrite');

            return NextResponse.json({
                success: true,
                data: createdRankings,
                message: `Successfully saved ${createdRankings.length} rankings for category ${categoryId}`,
                source: 'appwrite',
                count: createdRankings.length
            });
        } catch (appwriteError: any) {
            console.error('❌ Appwrite error:', appwriteError.message);

            // Fallback to in-memory storage
            const now = new Date().toISOString();
            const rankingsWithMetadata = rankings.map((ranking: any, index: number) => ({
                id: `${categoryId}-${index}-${Date.now()}`,
                ...ranking,
                categoryId,
                createdAt: now,
                updatedAt: now
            }));

            inMemoryStorage.set(categoryId, rankingsWithMetadata);

            return NextResponse.json({
                success: true,
                data: rankingsWithMetadata,
                message: `Successfully saved ${rankingsWithMetadata.length} rankings for category ${categoryId} (using fallback storage)`,
                source: 'fallback',
                count: rankingsWithMetadata.length,
                warning: 'Collection not found in Appwrite. Data is stored in memory and will be lost on server restart.'
            });
        }
    } catch (error: any) {
        console.error('❌ Error saving rankings:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to save rankings'
        }, { status: 500 });
    }
}

/**
 * PUT /api/admin/rankings
 * Update a specific ranking entry
 * Body:
 *   - rankingId: string (required) - The ranking document ID
 *   - categoryId: string (required) - The game category ID
 *   - ranking: RankingEntry (required) - Updated ranking data
 */
export async function PUT(request: NextRequest) {
    // Check admin authentication
    const authError = await checkAdminAuth(request);
    if (authError) return authError;

    try {
        const body = await request.json();
        const { rankingId, categoryId, ranking } = body;

        if (!rankingId || !categoryId || !ranking) {
            return NextResponse.json({
                success: false,
                error: 'Ranking ID, category ID, and ranking data are required'
            }, { status: 400 });
        }

        console.log('📝 Admin Rankings API - PUT called with:', { rankingId, categoryId });

        try {
            const databases = initializeAppwrite();

            const rankValue = parseInt(String(ranking.rank)) || 0;
            const winsValue = parseInt(String(ranking.wins)) || 0;
            const lossesValue = parseInt(String(ranking.losses)) || 0;
            const totalValue = parseInt(String(ranking.total)) || 0;
            const pointsValue = parseInt(String(ranking.points || ranking.total)) || 0;

            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                RANKINGS_COLLECTION,
                rankingId,
                {
                    rank: String(rankValue),
                    playerName: String(ranking.playerName || ''),
                    university: String(ranking.university || ''),
                    wins: String(winsValue),
                    losses: String(lossesValue),
                    total: String(totalValue),
                    points: String(pointsValue),
                    image: String(ranking.image || ''),
                    updatedAt: new Date().toISOString()
                }
            );

            console.log('✅ Updated ranking:', rankingId);

            return NextResponse.json({
                success: true,
                data: {
                    id: updatedDoc.$id,
                    ...ranking,
                    rank: rankValue,
                    wins: winsValue,
                    losses: lossesValue,
                    total: totalValue,
                    points: pointsValue
                },
                message: 'Ranking updated successfully',
                source: 'appwrite'
            });
        } catch (appwriteError: any) {
            console.error('❌ Appwrite error:', appwriteError.message);

            return NextResponse.json({
                success: false,
                error: 'Failed to update ranking in Appwrite',
                details: appwriteError.message
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('❌ Error updating ranking:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to update ranking'
        }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/rankings
 * Delete a specific ranking entry or all rankings for a category
 * Query params:
 *   - rankingId: (optional) Specific ranking to delete
 *   - categoryId: (optional) Delete all rankings for this category
 */
export async function DELETE(request: NextRequest) {
    // Check admin authentication
    const authError = await checkAdminAuth(request);
    if (authError) return authError;

    try {
        const { searchParams } = new URL(request.url);
        const rankingId = searchParams.get('rankingId');
        const categoryId = searchParams.get('categoryId');

        if (!rankingId && !categoryId) {
            return NextResponse.json({
                success: false,
                error: 'Either rankingId or categoryId is required'
            }, { status: 400 });
        }

        console.log('🗑️ Admin Rankings API - DELETE called with:', { rankingId, categoryId });

        try {
            const databases = initializeAppwrite();

            if (rankingId) {
                // Delete specific ranking
                await databases.deleteDocument(
                    DATABASE_ID,
                    RANKINGS_COLLECTION,
                    rankingId
                );

                console.log('✅ Deleted ranking:', rankingId);

                return NextResponse.json({
                    success: true,
                    message: 'Ranking deleted successfully'
                });
            } else if (categoryId) {
                // Delete all rankings for category
                const existingRankings = await databases.listDocuments(
                    DATABASE_ID,
                    RANKINGS_COLLECTION,
                    [Query.equal('categoryId', categoryId)]
                );

                console.log('🗑️ Found rankings to delete:', existingRankings.documents.length);

                let deletedCount = 0;
                for (const doc of existingRankings.documents) {
                    await databases.deleteDocument(
                        DATABASE_ID,
                        RANKINGS_COLLECTION,
                        doc.$id
                    );
                    deletedCount++;
                    console.log('🗑️ Deleted ranking:', doc.$id);
                }

                return NextResponse.json({
                    success: true,
                    message: `Deleted ${deletedCount} rankings for category ${categoryId}`,
                    count: deletedCount
                });
            }
        } catch (appwriteError: any) {
            console.error('❌ Appwrite error:', appwriteError.message);

            return NextResponse.json({
                success: false,
                error: 'Failed to delete ranking from Appwrite',
                details: appwriteError.message
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('❌ Error deleting ranking:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to delete ranking'
        }, { status: 500 });
    }
}
