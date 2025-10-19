import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID, COLLECTIONS, handleAppwriteError, handleAppwriteSuccess } from '@/lib/appwrite';

// Check if we should use fallback mode
const useFallbackMode = () => {
    return process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true';
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ region: string }> }
) {
    try {
        const { region } = await params;
        const regionSlug = region;

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log(`Using fallback mode for region: ${regionSlug}`);
            
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
                },
                {
                    id: "3",
                    university: "KENYATTA UNIVERSITY",
                    rank: 3,
                    pubgm: 12,
                    codmBR: 650,
                    codmMP: 1,
                    efootball: 2,
                    total: 665,
                }
            ];

            const regionData = {
                region: {
                    id: "1",
                    name: regionSlug.toUpperCase().replace(/-/g, ' '),
                    slug: regionSlug,
                    backgroundImage: "/images/Uganda.png",
                    description: `${regionSlug.toUpperCase().replace(/-/g, ' ')} region universities competing in KUER`,
                    isActive: true
                },
                seasons: [
                    {
                        seasonName: 'september' as const,
                        seasonTitle: 'KUER SEASON 2',
                        description: 'Current rankings for the September 2024 semester',
                        isActive: true,
                        universities: sampleRankings
                    },
                    {
                        seasonName: 'january' as const,
                        seasonTitle: 'JANUARY 2026 SEASON',
                        description: 'Rankings for the January 2026 semester - Coming Soon',
                        isActive: false,
                        universities: []
                    }
                ]
            };
            
            return NextResponse.json(handleAppwriteSuccess(regionData));
        }

        // Get region info from Appwrite - using string queries instead of Query
        const regionsResponse = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.REGIONS,
            [
                `equal("slug", "${regionSlug}")`,
                'limit(1)'
            ]
        );

        if (regionsResponse.documents.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Region not found' },
                { status: 404 }
            );
        }

        const regionDoc = regionsResponse.documents[0];

        // Get rankings for this region - September season
        const septemberRankings = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.RANKINGS,
            [
                `equal("season", "september")`,
                `equal("region", "${regionSlug}")`,
                'isNull("gameCategory")', // General rankings only
                'orderDesc("totalPoints")',
                'limit(50)'
            ]
        );

        // Get rankings for this region - January season (if available)
        const januaryRankings = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.RANKINGS,
            [
                `equal("season", "january")`,
                `equal("region", "${regionSlug}")`,
                'isNull("gameCategory")',
                'orderDesc("totalPoints")',
                'limit(50)'
            ]
        );

        // Format September rankings
        const septemberUniversities = septemberRankings.documents.map((doc: any, index: number) => ({
            id: doc.$id,
            university: doc.universityName,
            rank: index + 1,
            pubgm: doc.pubgmPoints || 0,
            codmBR: doc.codmBRPoints || 0,
            codmMP: doc.codmMPPoints || 0,
            efootball: doc.efootballPoints || 0,
            total: doc.totalPoints,
            plnum: doc.placementPoints || 0,
            ccumW: doc.participationPoints || 0,
            ccumMW: doc.socialMediaPoints || 0,
            bonuses: doc.bonusPoints || 0
        }));

        // Format January rankings
        const januaryUniversities = januaryRankings.documents.map((doc: any, index: number) => ({
            id: doc.$id,
            university: doc.universityName,
            rank: index + 1,
            pubgm: doc.pubgmPoints || 0,
            codmBR: doc.codmBRPoints || 0,
            codmMP: doc.codmMPPoints || 0,
            efootball: doc.efootballPoints || 0,
            total: doc.totalPoints,
            plnum: doc.placementPoints || 0,
            ccumW: doc.participationPoints || 0,
            ccumMW: doc.socialMediaPoints || 0,
            bonuses: doc.bonusPoints || 0
        }));

        const regionData = {
            region: {
                id: regionDoc.$id,
                name: regionDoc.name,
                slug: regionDoc.slug,
                backgroundImage: regionDoc.backgroundImage || '/images/Uganda.png',
                description: regionDoc.description,
                isActive: regionDoc.isActive
            },
            seasons: [
                {
                    seasonName: 'september' as const,
                    seasonTitle: 'KUER SEASON 2',
                    description: 'Current rankings for the September 2024 semester',
                    isActive: true,
                    universities: septemberUniversities
                },
                {
                    seasonName: 'january' as const,
                    seasonTitle: 'JANUARY 2026 SEASON',
                    description: 'Rankings for the January 2026 semester - Coming Soon',
                    isActive: januaryUniversities.length > 0,
                    universities: januaryUniversities
                }
            ]
        };

        return NextResponse.json(handleAppwriteSuccess(regionData));

    } catch (error) {
        console.error('Region rankings API error:', error);
        return NextResponse.json(handleAppwriteError(error), { status: 500 });
    }
}