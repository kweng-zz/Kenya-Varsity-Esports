import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

// Check if we should use fallback mode
const useFallbackMode = () => {
    return process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true';
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const season = searchParams.get('season') || 'september';

        console.log('📊 Game Category Rankings API called with:', { season });

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for game category rankings API');
            return NextResponse.json({
                success: true,
                data: {
                    septemberMain: [],
                    septemberAdded: [],
                    januaryMain: [],
                    januaryAdded: []
                },
                message: 'Fallback mode enabled - no data available'
            });
        }

        try {
            // First try to get game categories from GAME_CATEGORIES collection
            let gameCategories: any[] = [];
            
            try {
                const gameCategoriesResponse = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.GAME_CATEGORIES,
                    [Query.limit(100)]
                );
                gameCategories = gameCategoriesResponse.documents;
                console.log('📊 API - Game categories from GAME_CATEGORIES collection:', gameCategories.length);
            } catch (e) {
                console.log('📊 API - GAME_CATEGORIES collection not available or empty');
            }
            
            // If no game categories found, extract from tournaments
            if (gameCategories.length === 0) {
                try {
                    const tournamentsResponse = await databases.listDocuments(
                        DATABASE_ID,
                        'tournaments',
                        [Query.limit(100)]
                    );
                    
                    console.log('📊 API - Tournaments fetched:', tournamentsResponse.documents.length);
                    
                    // Extract unique games from tournaments
                    const uniqueGames = new Map<string, any>();
                    tournamentsResponse.documents.forEach((tournament: any) => {
                        const gameSlug = tournament.slug || tournament.gameName.toLowerCase().replace(/\s+/g, '-');
                        if (!uniqueGames.has(gameSlug)) {
                            uniqueGames.set(gameSlug, {
                                slug: gameSlug,
                                name: tournament.gameName,
                                title: `${tournament.gameName.toUpperCase()} RANKINGS`,
                                description: tournament.description || `Current standings for ${tournament.gameName} tournament`,
                                image: tournament.featuredImageUrl || `/images/${tournament.gameName.replace(/\s+/g, '')}.png`,
                                isActive: true,
                                type: 'main'
                            });
                        }
                    });
                    
                    gameCategories = Array.from(uniqueGames.values());
                    console.log('📊 API - Unique game categories extracted from tournaments:', gameCategories.length);
                } catch (tournamentsError) {
                    console.warn('📊 API - Could not fetch tournaments:', tournamentsError);
                }
            }

            // Get all rankings for the specified season with game categories
            let allRankings: any[] = [];
            try {
                const rankingsResponse = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.RANKINGS,
                    [
                        Query.equal('season', season),
                        Query.isNotNull('gameCategory'),
                        Query.orderDesc('totalPoints'),
                        Query.limit(1000)
                    ]
                );
                allRankings = rankingsResponse.documents;
            } catch (e) {
                console.log('📊 API - No rankings found for season:', season);
            }

            console.log('📊 API - Rankings fetched:', allRankings.length);

            // Group rankings by game category
            const rankingsByCategory = new Map<string, any[]>();
            
            allRankings.forEach((ranking: any) => {
                const categorySlug = ranking.gameCategory;
                if (!rankingsByCategory.has(categorySlug)) {
                    rankingsByCategory.set(categorySlug, []);
                }
                rankingsByCategory.get(categorySlug)!.push(ranking);
            });

            console.log('📊 API - Rankings grouped by category:', Array.from(rankingsByCategory.keys()));

            // Build categories with their rankings
            const septemberMain: any[] = [];
            const septemberAdded: any[] = [];
            const januaryMain: any[] = [];
            const januaryAdded: any[] = [];

            gameCategories.forEach((category: any) => {
                const categorySlug = category.slug || category.id;
                const categoryRankings = rankingsByCategory.get(categorySlug) || [];
                
                // Sort rankings by total points descending
                const sortedRankings = categoryRankings.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
                
                const categoryData = {
                    id: categorySlug,
                    name: category.name,
                    title: category.title || `${category.name.toUpperCase()} RANKINGS`,
                    description: category.description || `Current standings for ${category.name} tournament`,
                    image: category.image || `/images/${category.name.replace(/\s+/g, '')}.png`,
                    isActive: category.isActive !== false,
                    universities: sortedRankings.map((ranking: any, index: number) => ({
                        id: ranking.$id,
                        university: ranking.universityName,
                        rank: index + 1,
                        plnum: ranking.placementPoints || 0,
                        ccumW: ranking.participationPoints || 0,
                        ccumMW: ranking.socialMediaPoints || 0,
                        bonuses: ranking.bonusPoints || 0,
                        total: ranking.totalPoints || 0
                    }))
                };

                if (season === 'september') {
                    if (category.type === 'added') {
                        septemberAdded.push(categoryData);
                    } else {
                        septemberMain.push(categoryData);
                    }
                } else if (season === 'january') {
                    if (category.type === 'added') {
                        januaryAdded.push(categoryData);
                    } else {
                        januaryMain.push(categoryData);
                    }
                }
            });

            console.log('📊 API - September Main categories:', septemberMain.length);
            console.log('📊 API - September Added categories:', septemberAdded.length);

            return NextResponse.json({
                success: true,
                data: {
                    septemberMain,
                    septemberAdded,
                    januaryMain,
                    januaryAdded
                }
            });

        } catch (appwriteError) {
            console.warn('Appwrite request failed:', appwriteError);
            
            return NextResponse.json({
                success: true,
                data: {
                    septemberMain: [],
                    septemberAdded: [],
                    januaryMain: [],
                    januaryAdded: []
                },
                message: 'Appwrite connection failed - no data available'
            });
        }

    } catch (error) {
        console.error('Game category rankings API error:', error);
        return NextResponse.json({
            success: true,
            data: {
                septemberMain: [],
                septemberAdded: [],
                januaryMain: [],
                januaryAdded: []
            },
            message: 'Server error - no data available'
        });
    }
}
