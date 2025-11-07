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
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REGIONAL_RANKINGS_COLLECTION_ID || 'regional_rankings';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const databases = initializeAppwrite();
        const body = await request.json();
        const { region, image, universities } = body;
        const { id } = await params;

        if (!region || !universities) {
            return NextResponse.json({
                success: false,
                error: 'Region and universities are required'
            }, { status: 400 });
        }

        const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            id,
            {
                region,
                image,
                universities: JSON.stringify(universities)
            }
        );

        return NextResponse.json({
            success: true,
            data: response
        });
    } catch (error: any) {
        console.error('Error updating regional ranking:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to update regional ranking'
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
                message: 'Regional ranking deleted successfully'
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error deleting regional ranking:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to delete regional ranking'
        }, { status: 500 });
    }
}
