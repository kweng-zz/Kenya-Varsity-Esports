import { NextRequest, NextResponse } from 'next/server';
import { getAppwriteServer, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite-server';

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
            // Initialize Appwrite server
            const appwrite = getAppwriteServer();
            if (!appwrite) {
                throw new Error('Appwrite server not initialized');
            }

            // Get game categories from tournaments (primary source)
            let gameCategories: any[] = [];
            
            // Image mapping for game categories
            const gameImageMap: Record<string, string> = {
                'pubgm': '/images/PUBGM.jpeg',
                'pubg-mobile': '/images/PUBGM.jpeg',
                'codm': '/images/CODM-BR.png',
                'codm-br': '/images/CODM-BR.png',
                'call-of-duty-mobile': '/images/CODM-BR.png',
                'efootball': '/images/Efootball-Mobile.png',
                'efootball-mobile': '/images/Efootball-Mobile.png',
                'eafc': '/images/EAFC--Open.png',
                'eafc-1v1': '/images/EAFC-1-v1-Open.png',
                'eafc-2v2': '/images/EAFC--Open.png',
                'eafc-women': '/images/EAFC-Women.png',
                'codm-mp': '/images/CODM-MP.png',
                'codm-multiplayer': '/images/CODM-MP.png',
                'rocket-league': '/images/Rocket-League.png',
                'valorant': '/images/Valorant.png',
                'chess': '/images/Chess.png',
                'nba2k': '/images/NBA2k.png',
                'fighting-games': '/images/Fighting-Games-Open.png'
            };
            
            // Extract from tournaments
            if (gameCategories.length === 0) {
                try {
                    const tournamentsResponse = await appwrite.databases.listDocuments(
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
                            // Use mapped image or fallback to featuredImageUrl
                            const mappedImage = gameImageMap[gameSlug];
                            const image = tournament.featuredImageUrl || mappedImage || `/images/${gameSlug}.png`;
                            
                            uniqueGames.set(gameSlug, {
                                slug: gameSlug,
                                name: tournament.gameName,
                                title: `${tournament.gameName.toUpperCase()} RANKINGS`,
                                description: tournament.description || `Current standings for ${tournament.gameName} tournament`,
                                image: image,
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
                const rankingsResponse = await appwrite.databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.RANKINGS,
                    [
                        Query.equal('season', season),
                        Query.orderDesc('totalPoints'),
                        Query.limit(1000)
                    ]
                );
                // Filter to only include rankings with a gameCategory (exclude general rankings)
                allRankings = rankingsResponse.documents.filter((doc: any) => doc.gameCategory && doc.gameCategory !== null);
            } catch (e) {
                console.log('📊 API - No rankings found for season:', season);
            }

            console.log('📊 API - Rankings fetched:', allRankings.length);

            // Also try to fetch game category rankings from the API endpoint
            let gameCategoryRankings: any[] = [];
            try {
                const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/game-categories`);
                if (apiResponse.ok) {
                    const apiResult = await apiResponse.json();
                    if (apiResult.success && apiResult.data) {
                        // Flatten the grouped data back into an array
                        Object.values(apiResult.data).forEach((rankings: any) => {
                            if (Array.isArray(rankings)) {
                                gameCategoryRankings.push(...rankings);
                            }
                        });
                    }
                }
                console.log('📊 API - Game category rankings fetched:', gameCategoryRankings.length);
            } catch (e) {
                console.log('📊 API - Game category rankings API not available:', (e as any).message);
                // Fallback: try direct database access
                try {
                    const gameCategoryRankingsResponse = await appwrite.databases.listDocuments(
                        DATABASE_ID,
                        'game_category_rankings',
                        [Query.limit(1000)]
                    );
                    gameCategoryRankings = gameCategoryRankingsResponse.documents;
                    console.log('📊 API - Game category rankings fetched from database:', gameCategoryRankings.length);
                } catch (dbError) {
                    console.log('📊 API - Game category rankings collection not found:', (dbError as any).message);
                }
            }

            // Group rankings by game category
            const rankingsByCategory = new Map<string, any[]>();
            
            allRankings.forEach((ranking: any) => {
                const categorySlug = ranking.gameCategory;
                if (!rankingsByCategory.has(categorySlug)) {
                    rankingsByCategory.set(categorySlug, []);
                }
                rankingsByCategory.get(categorySlug)!.push(ranking);
            });

            // Normalize category ID mapping (handle different slug formats)
            const categoryIdNormalizationMap: Record<string, string> = {
                'pubgm': 'pubg-mobile',
                'pubg': 'pubg-mobile',
                'codm': 'call-of-duty-mobile-br',
                'codm-br': 'call-of-duty-mobile-br',
                'efootball': 'efootball-mobile',
                'eafc': 'eafc-1v1',
                'eafc-1v1': 'eafc-1v1',
                'eafc-2v2': 'eafc-2v2',
                'eafc-women': 'eafc-women',
                'codm-mp': 'codm-multiplayer',
                'codm-multiplayer': 'codm-multiplayer'
            };

            // Also add game category rankings - group by categoryId
            const gameCategoryRankingsByCategory = new Map<string, any[]>();
            gameCategoryRankings.forEach((ranking: any) => {
                // Normalize the categoryId to match tournament slugs
                let categoryId = ranking.categoryId;
                const normalizedId = categoryIdNormalizationMap[categoryId];
                if (normalizedId) {
                    categoryId = normalizedId;
                }
                
                if (!gameCategoryRankingsByCategory.has(categoryId)) {
                    gameCategoryRankingsByCategory.set(categoryId, []);
                }
                gameCategoryRankingsByCategory.get(categoryId)!.push(ranking);
            });

            console.log('📊 API - Game category rankings by category:', Array.from(gameCategoryRankingsByCategory.keys()));

            // Add game category rankings to rankingsByCategory - ONLY if not already present from traditional rankings
            gameCategoryRankingsByCategory.forEach((rankings, categoryId) => {
                // Only use game category rankings if we don't have traditional rankings for this category
                if (!rankingsByCategory.has(categoryId) || rankingsByCategory.get(categoryId)!.length === 0) {
                    rankingsByCategory.set(categoryId, rankings);
                }
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
                
                console.log('📊 API - Looking for rankings for category:', categorySlug, 'Found:', categoryRankings.length);
                
                // Sort rankings by total points descending (for traditional rankings)
                // or by rank (for game category rankings)
                const sortedRankings = categoryRankings.sort((a: any, b: any) => {
                    // If it's a game category ranking (has rank field), sort by rank
                    if (a.rank !== undefined && b.rank !== undefined) {
                        const rankA = typeof a.rank === 'string' ? parseInt(a.rank) : a.rank;
                        const rankB = typeof b.rank === 'string' ? parseInt(b.rank) : b.rank;
                        return rankA - rankB;
                    }
                    // Otherwise sort by totalPoints
                    return (b.totalPoints || 0) - (a.totalPoints || 0);
                });
                
                // Get image from category or from first ranking if available
                let categoryImage = category.image;
                if (!categoryImage && sortedRankings.length > 0 && sortedRankings[0].image) {
                    categoryImage = sortedRankings[0].image;
                }
                
                const categoryData = {
                    id: categorySlug,
                    name: category.name,
                    title: category.title || `${category.name.toUpperCase()} RANKINGS`,
                    description: category.description || `Current standings for ${category.name} tournament`,
                    image: categoryImage,
                    isActive: category.isActive !== false,
                    universities: sortedRankings.map((ranking: any, index: number) => {
                        // Handle both traditional rankings and game category rankings
                        if (ranking.universityName) {
                            // Traditional ranking format (from old rankings collection)
                            return {
                                id: ranking.$id,
                                playerName: ranking.universityName,
                                university: ranking.universityName,
                                rank: index + 1,
                                points: ranking.placementPoints || 0,
                                wins: ranking.participationPoints || 0,
                                losses: ranking.socialMediaPoints || 0,
                                bonuses: ranking.bonusPoints || 0,
                                total: ranking.totalPoints || 0
                            };
                        } else {
                            // Game category ranking format (from admin panel)
                            // All values are stored as strings, convert to appropriate types
                            const rankNum = parseInt(String(ranking.rank)) || 0;
                            const winsNum = parseInt(String(ranking.wins)) || 0;
                            const lossesNum = parseInt(String(ranking.losses)) || 0;
                            const totalNum = parseInt(String(ranking.total)) || 0;
                            
                            console.log('📊 API - Parsing ranking:', { 
                                rankRaw: ranking.rank, 
                                winsRaw: ranking.wins, 
                                lossesRaw: ranking.losses, 
                                totalRaw: ranking.total,
                                rankNum,
                                winsNum,
                                lossesNum,
                                totalNum
                            });
                            
                            // playerName is the squad name, university is the university name
                            const squadName = ranking.playerName || 'Unknown Squad';
                            const universityName = ranking.university || 'Unknown University';
                            
                            return {
                                id: ranking.$id,
                                playerName: squadName,
                                university: universityName,
                                rank: rankNum,
                                wins: winsNum,
                                losses: lossesNum,
                                total: totalNum
                            };
                        }
                    })
                };

                if (season === 'september') {
                    if (category.category === 'added' || category.type === 'added') {
                        septemberAdded.push(categoryData);
                    } else {
                        septemberMain.push(categoryData);
                    }
                } else if (season === 'january') {
                    if (category.category === 'added' || category.type === 'added') {
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
