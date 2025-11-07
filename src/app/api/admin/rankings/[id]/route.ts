import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';

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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const databases = initializeAppwrite();
        const body = await request.json();
        const { universityName, region, season, ...scores } = body;
        const { id } = await params;

        if (!id) {
            return NextResponse.json({
                success: false,
                error: 'ID is required'
            }, { status: 400 });
        }

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

        const now = new Date().toISOString();

        const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id,
            {
                universityName,
                region,
                season,
                totalPoints,
                ...scores,
                updatedAt: now
            }
        );

        return NextResponse.json({
            success: true,
            data: response
        });
    } catch (error: any) {
        console.error('Error updating ranking:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to update ranking'
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const databases = initializeAppwrite();
        const { id } = await params;

        if (!id) {
            return NextResponse.json({
                success: false,
                error: 'ID is required'
            }, { status: 400 });
        }

        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Ranking deleted successfully'
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error deleting ranking:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to delete ranking'
        }, { status: 500 });
    }
}
