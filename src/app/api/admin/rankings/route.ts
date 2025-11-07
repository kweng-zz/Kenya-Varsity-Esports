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
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_RANKINGS_COLLECTION_ID || 'rankings';

export async function GET(request: NextRequest) {
    try {
        const databases = initializeAppwrite();
        const { searchParams } = new URL(request.url);
        const season = searchParams.get('season') || 'september';
        const limit = parseInt(searchParams.get('limit') || '100');

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('season', season),
                Query.orderDesc('totalPoints'),
                Query.limit(limit)
            ]
        );

        return NextResponse.json({
            success: true,
            data: response.documents
        });
    } catch (error: any) {
        console.error('Error fetching rankings:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch rankings'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const databases = initializeAppwrite();
        const body = await request.json();
        const { universityName, region, season, ...scores } = body;

        if (!universityName || !season) {
            return NextResponse.json({
                success: false,
                error: 'University name and season are required'
            }, { status: 400 });
        }

        // Calculate total points
        let totalPoints = 0;
        Object.values(scores).forEach((score: any) => {
            if (typeof score === 'number') {
                totalPoints += score;
            }
        });

        const universityId = universityName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        const now = new Date().toISOString();

        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                universityId,
                universityName,
                region,
                season,
                totalPoints,
                ...scores,
                createdAt: now,
                updatedAt: now
            }
        );

        return NextResponse.json({
            success: true,
            data: response
        });
    } catch (error: any) {
        console.error('Error creating ranking:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create ranking'
        }, { status: 500 });
    }
}
