import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID, COLLECTIONS, Query, handleAppwriteError, handleAppwriteSuccess } from '@/lib/appwrite';

// Check if we should use fallback mode
const useFallbackMode = () => {
    return process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true';
};

// Fallback data for when Appwrite is not configured
const getFallbackData = () => {
    const sampleRankings = [
        {
            id: "1",
            university: "TECHNICAL UNIVERSITY OF KENYA",
            rank: 1,
            plnum: 17,
            ccumW: 842,
            ccumMW: 0,
            bonuses: 3,
            total: 862,
        },
        {
            id: "2",
            university: "UNIVERSITY OF NAIROBI",
            rank: 2,
            plnum: 15,
            ccumW: 720,
            ccumMW: 2,
            bonuses: 5,
            total: 740,
        },
        {
            id: "3",
            university: "KENYATTA UNIVERSITY",
            rank: 3,
            plnum: 12,
            ccumW: 650,
            ccumMW: 1,
            bonuses: 2,
            total: 663,
        },
    ];

    return {
        septemberMain: [
            {
                id: "pubgm",
                name: "PUBGM",
                title: "PUBGM RANKINGS",
                description: "Current standings for PUBGM tournament",
                image: "/images/PUBGM.jpeg",
                isActive: true,
                universities: sampleRankings,
            },
            {
                id: "codm",
                name: "CALL OF DUTY MOBILE",
                title: "CODM RANKINGS",
                description: "Current standings for CODM tournament",
                image: "/images/CODM-BR.png",
                isActive: true,
                universities: sampleRankings,
            },
            {
                id: "efootball",
                name: "EFOOTBALL",
                title: "EFOOTBALL RANKINGS",
                description: "Current standings for EFOOTBALL tournament",
                image: "/images/Efootball-Mobile.png",
                isActive: true,
                universities: sampleRankings,
            },
        ],
        septemberAdded: [
            {
                id: "codm-mp",
                name: "CODM-MULTIPLAYER",
                title: "CODM-MULTIPLAYER RANKINGS",
                description: "Current standings for CODM-MULTIPLAYER tournament",
                image: "/images/CODM-MP.png",
                isActive: true,
                universities: sampleRankings,
            },
            {
                id: "eafc-2v2",
                name: "EAFC-2V2",
                title: "EAFC-2V2 RANKINGS",
                description: "Current standings for EAFC-2V2 tournament",
                image: "/images/EAFC--Open.png",
                isActive: true,
                universities: sampleRankings,
            },
            {
                id: "eafc-women",
                name: "EAFC-WOMEN",
                title: "EAFC-WOMEN RANKINGS",
                description: "Current standings for EAFC-Women tournament",
                image: "/images/EAFC-Women.png",
                isActive: true,
                universities: sampleRankings,
            },
        ],
        januaryMain: [],
        januaryAdded: []
    };
};

export async function GET(request: NextRequest) {
    let category: string | null = null;
    let limit = 50;

    try {
        const { searchParams } = new URL(request.url);
        category = searchParams.get('category');
        const region = searchParams.get('region');
        limit = parseInt(searchParams.get('limit') || '50');

        console.log('Rankings API called with:', { category, region, limit });

        // Use fallback mode if enabled OR if Appwrite fails
        if (useFallbackMode()) {
            console.log('Using fallback mode for rankings API');
            
            if (category === 'all') {
                return NextResponse.json({
                    success: true,
                    data: getFallbackData(),
                    message: 'Using fallback rankings data'
                });
            }
            
            // Return sample rankings for other requests
            const sampleRankings = [
                {
                    id: "1",
                    university: "TECHNICAL UNIVERSITY OF KENYA",
                    rank: 1,
                    pubgm: 17,
                    codmBR: 842,
                    codmMP: 0,
                    efootball: 3,
                    total: 862,
                },
                {
                    id: "2",
                    university: "UNIVERSITY OF NAIROBI",
                    rank: 2,
                    pubgm: 15,
                    codmBR: 720,
                    codmMP: 2,
                    efootball: 5,
                    total: 742,
                }
            ].slice(0, limit);
            
            return NextResponse.json({
                success: true,
                data: sampleRankings,
                message: 'Using fallback rankings data'
            });
        }

        try {
            // Try to get data from Appwrite
            if (category === 'all') {
                // Get all game categories and their rankings
                const [gameCategories, allRankings] = await Promise.all([
                    databases.listDocuments(
                        DATABASE_ID,
                        COLLECTIONS.GAME_CATEGORIES,
                        [
                            Query.equal('season', 'september'),
                            Query.orderAsc('name')
                        ]
                    ),
                    databases.listDocuments(
                        DATABASE_ID,
                        COLLECTIONS.RANKINGS,
                        [
                            Query.equal('season', 'september'),
                            Query.isNotNull('gameCategory'),
                            Query.orderAsc('totalPoints')
                        ]
                    )
                ]);

                // Group categories by type
                const septemberMain = gameCategories.documents
                    .filter((cat: any) => cat.category === 'main')
                    .map((category: any) => ({
                        id: category.slug,
                        name: category.name,
                        title: category.title,
                        description: category.description,
                        image: category.image,
                        isActive: category.isActive,
                        universities: allRankings.documents
                            .filter((ranking: any) => ranking.gameCategory === category.slug)
                            .sort((a: any, b: any) => b.totalPoints - a.totalPoints)
                            .map((ranking: any, index: number) => ({
                                id: ranking.$id,
                                university: ranking.universityName,
                                rank: index + 1,
                                plnum: ranking.placementPoints,
                                ccumW: ranking.participationPoints,
                                ccumMW: ranking.socialMediaPoints,
                                bonuses: ranking.bonusPoints,
                                total: ranking.totalPoints
                            }))
                    }));

                const septemberAdded = gameCategories.documents
                    .filter((cat: any) => cat.category === 'added')
                    .map((category: any) => ({
                        id: category.slug,
                        name: category.name,
                        title: category.title,
                        description: category.description,
                        image: category.image,
                        isActive: category.isActive,
                        universities: allRankings.documents
                            .filter((ranking: any) => ranking.gameCategory === category.slug)
                            .sort((a: any, b: any) => b.totalPoints - a.totalPoints)
                            .map((ranking: any, index: number) => ({
                                id: ranking.$id,
                                university: ranking.universityName,
                                rank: index + 1,
                                plnum: ranking.placementPoints,
                                ccumW: ranking.participationPoints,
                                ccumMW: ranking.socialMediaPoints,
                                bonuses: ranking.bonusPoints,
                                total: ranking.totalPoints
                            }))
                    }));

                return NextResponse.json({
                    success: true,
                    data: {
                        septemberMain,
                        septemberAdded,
                        januaryMain: [],
                        januaryAdded: []
                    }
                });
            }

            // Get rankings for specific category or general rankings
            const queries = [
                Query.equal('season', 'september'),
                Query.orderDesc('totalPoints'),
                Query.limit(limit)
            ];

            if (category && category !== 'general') {
                queries.push(Query.equal('gameCategory', category));
            } else {
                queries.push(Query.isNull('gameCategory'));
            }

            if (region) {
                queries.push(Query.equal('region', region));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.RANKINGS,
                queries
            );

            const rankings = response.documents.map((doc: any, index: number) => ({
                id: doc.$id,
                university: doc.universityName,
                rank: index + 1,
                pubgm: doc.gameCategory === 'pubgm' ? doc.totalPoints : 0,
                codmBR: doc.gameCategory === 'codm' ? doc.totalPoints : 0,
                codmMP: doc.gameCategory === 'codm-mp' ? doc.totalPoints : 0,
                efootball: doc.gameCategory === 'efootball' ? doc.totalPoints : 0,
                total: doc.totalPoints,
                placementPoints: doc.placementPoints,
                participationPoints: doc.participationPoints,
                socialMediaPoints: doc.socialMediaPoints,
                bonusPoints: doc.bonusPoints
            }));

            return NextResponse.json({
                success: true,
                data: rankings
            });

        } catch (appwriteError) {
            console.warn('Appwrite request failed, using fallback data:', appwriteError);
            
            // If Appwrite fails, return fallback data with 200 status
            if (category === 'all') {
                return NextResponse.json({
                    success: true,
                    data: getFallbackData(),
                    message: 'Using fallback data - Appwrite connection failed'
                });
            }
            
            const sampleRankings = [
                {
                    id: "1",
                    university: "TECHNICAL UNIVERSITY OF KENYA",
                    rank: 1,
                    pubgm: 17,
                    codmBR: 842,
                    codmMP: 0,
                    efootball: 3,
                    total: 862,
                }
            ].slice(0, limit);
            
            return NextResponse.json({
                success: true,
                data: sampleRankings,
                message: 'Using fallback data - Appwrite connection failed'
            });
        }

    } catch (error) {
        console.error('Rankings API error:', error);
        // Even if there's an unexpected error, return successful response with fallback data
        return NextResponse.json({
            success: true,
            data: category === 'all' ? getFallbackData() : [],
            message: 'Using fallback data due to server error'
        });
    }
}