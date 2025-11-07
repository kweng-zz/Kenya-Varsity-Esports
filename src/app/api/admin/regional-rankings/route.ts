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
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REGIONAL_RANKINGS_COLLECTION_ID || 'regional_rankings';

export async function GET(request: NextRequest) {
    try {
        const databases = initializeAppwrite();
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.orderAsc('region')]
        );

        return NextResponse.json({
            success: true,
            data: response.documents
        });
    } catch (error: any) {
        console.error('Error fetching regional rankings:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch regional rankings'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const databases = initializeAppwrite();
        const body = await request.json();
        const { region, image, universities } = body;

        if (!region || !universities) {
            return NextResponse.json({
                success: false,
                error: 'Region and universities are required'
            }, { status: 400 });
        }

        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
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
        console.error('Error creating regional ranking:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create regional ranking'
        }, { status: 500 });
    }
}
