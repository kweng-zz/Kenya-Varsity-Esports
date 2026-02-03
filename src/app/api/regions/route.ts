import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID, COLLECTIONS, Query, handleAppwriteError, handleAppwriteSuccess } from '@/lib/appwrite';

// Check if we should use fallback mode
const useFallbackMode = () => {
    return process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true';
};

// Fallback regions data - using EXISTING images only
const getFallbackRegionsData = () => {
    return [
        {
            id: "1",
            name: "NAIROBI",
            slug: "nairobi",
            image: "/images/uganda.png", // Use existing image (lowercase)
            description: "Nairobi region universities competing in KVE Season 2",
            backgroundImage: "/images/uganda.png", // Use existing image instead of nairobi-bg.jpg
            isActive: true
        },
        {
            id: "2",
            name: "CENTRAL KENYA",
            slug: "central-kenya",
            image: "/images/uganda.png", // Use existing image
            description: "Central Kenya region universities - Coming Soon",
            backgroundImage: "/images/uganda.png", // Use existing image instead of central-bg.jpg
            isActive: false
        },
        {
            id: "3",
            name: "WESTERN KENYA",
            slug: "western-kenya",
            image: "/images/uganda.png", // Use existing image
            description: "Western Kenya region universities - Coming Soon",
            backgroundImage: "/images/uganda.png", // Use existing image instead of western-bg.jpg
            isActive: false
        }
    ];
};

export async function GET(request: NextRequest) {
    try {
        console.log('Regions API called');

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for regions API');
            return NextResponse.json({
                success: true,
                data: getFallbackRegionsData(),
                message: 'Using fallback regions data'
            });
        }

        try {
            // Try to get data from Appwrite
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.REGIONS,
                [
                    Query.orderAsc('name')
                ]
            );

            const regions = response.documents.map((doc: any) => ({
                id: doc.$id,
                name: doc.name,
                slug: doc.slug,
                image: doc.image,
                description: doc.description,
                backgroundImage: doc.backgroundImage,
                isActive: doc.isActive
            }));

            return NextResponse.json({
                success: true,
                data: regions
            });

        } catch (appwriteError) {
            console.warn('Appwrite regions request failed, using fallback data:', appwriteError);
            // If Appwrite fails, return fallback data with 200 status
            return NextResponse.json({
                success: true,
                data: getFallbackRegionsData(),
                message: 'Using fallback data - Appwrite connection failed'
            });
        }

    } catch (error) {
        console.error('Regions API error:', error);
        // Even if there's an unexpected error, return successful response with fallback data
        return NextResponse.json({
            success: true,
            data: getFallbackRegionsData(),
            message: 'Using fallback data due to server error'
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, image, description, backgroundImage, isActive = true } = body;

        if (!name || !slug || !image) {
            return NextResponse.json(
                { success: false, error: 'Name, slug, and image are required' },
                { status: 400 }
            );
        }

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for region creation');
            return NextResponse.json({
                success: true,
                data: {
                    id: 'demo-' + Date.now(),
                    name,
                    slug,
                    image: image || "/images/uganda.png", // Default to existing image
                    description,
                    backgroundImage: backgroundImage || "/images/uganda.png", // Default to existing image
                    isActive
                },
                message: 'Region created successfully (Demo mode)'
            });
        }

        try {
            const newRegion = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.REGIONS,
                'unique()',
                {
                    name,
                    slug,
                    image: image || "/images/uganda.png", // Default to existing image
                    description: description || '',
                    backgroundImage: backgroundImage || "/images/uganda.png", // Default to existing image
                    isActive,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );

            return NextResponse.json({
                success: true,
                data: newRegion,
                message: 'Region created successfully'
            });

        } catch (appwriteError) {
            console.warn('Appwrite region creation failed:', appwriteError);
            return NextResponse.json({
                success: true,
                data: {
                    id: 'demo-' + Date.now(),
                    name,
                    slug,
                    image: image || "/images/uganda.png", // Default to existing image
                    description,
                    backgroundImage: backgroundImage || "/images/uganda.png", // Default to existing image
                    isActive
                },
                message: 'Region created successfully (Demo mode - Appwrite failed)'
            });
        }

    } catch (error) {
        console.error('Create region API error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create region',
            message: 'Please try again later'
        });
    }
}