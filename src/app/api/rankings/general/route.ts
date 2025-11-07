import { NextRequest, NextResponse } from 'next/server';
import { getAppwriteServer, DATABASE_ID, COLLECTIONS, Query, handleAppwriteError, handleAppwriteSuccess } from '@/lib/appwrite-server';

// Check if we should use fallback mode
const useFallbackMode = () => {
    return process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true';
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const region = searchParams.get('region');

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for general rankings API');
            
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
            
            return NextResponse.json(handleAppwriteSuccess(sampleRankings.slice(0, limit)));
        }

        const appwrite = getAppwriteServer();
        if (!appwrite) {
            console.error('Appwrite server not initialized, using fallback data');
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
            ];
            return NextResponse.json(handleAppwriteSuccess(sampleRankings.slice(0, limit)));
        }

        const queries = [
            Query.equal('season', 'september'),
            Query.isNull('gameCategory'), // General rankings have no specific game category
            Query.orderDesc('totalPoints'),
            Query.limit(limit)
        ];

        if (region) {
            queries.push(Query.equal('region', region));
        }

        const response = await appwrite.databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.RANKINGS,
            queries
        );

        const rankings = response.documents.map((doc: any, index: number) => ({
            id: doc.$id,
            university: doc.universityName,
            rank: index + 1,
            pubgm: doc.placementPoints || 0,
            codmBR: doc.participationPoints || 0,
            codmMP: doc.socialMediaPoints || 0,
            efootball: doc.bonusPoints || 0,
            total: doc.totalPoints
        }));

        return NextResponse.json(handleAppwriteSuccess(rankings));

    } catch (error) {
        console.error('General rankings API error:', error);
        return NextResponse.json(handleAppwriteError(error), { status: 500 });
    }
}