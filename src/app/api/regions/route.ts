import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID, COLLECTIONS, Query, handleAppwriteError, handleAppwriteSuccess } from '@/lib/appwrite';

// Check if we should use fallback mode
const useFallbackMode = () => {
    return process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true';
};

export async function GET(request: NextRequest) {
    try {
        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for regions API');
            
            const sampleRegions = [
                {
                    id: "1",
                    name: "NAIROBI",
                    slug: "nairobi",
                    image: "/images/Uganda.png",
                    description: "Nairobi region universities competing in KUER Season 2",
                    backgroundImage: "/images/nairobi-bg.jpg",
                    isActive: true
                },
                {
                    id: "2",
                    name: "CENTRAL KENYA",
                    slug: "central-kenya",
                    image: "/images/Uganda.png",
                    description: "Central Kenya region universities - Coming Soon",
                    backgroundImage: "/images/central-bg.jpg",
                    isActive: false
                },
                {
                    id: "3",
                    name: "WESTERN KENYA",
                    slug: "western-kenya",
                    image: "/images/Uganda.png",
                    description: "Western Kenya region universities - Coming Soon",
                    backgroundImage: "/images/western-bg.jpg",
                    isActive: false
                }
            ];
            
            return NextResponse.json(handleAppwriteSuccess(sampleRegions));
        }

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

        return NextResponse.json(handleAppwriteSuccess(regions));

    } catch (error) {
        console.error('Regions API error:', error);
        return NextResponse.json(handleAppwriteError(error), { status: 500 });
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

        const newRegion = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.REGIONS,
            'unique()',
            {
                name,
                slug,
                image,
                description: description || '',
                backgroundImage: backgroundImage || '',
                isActive,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );

        return NextResponse.json(handleAppwriteSuccess(newRegion, 'Region created successfully'));

    } catch (error) {
        console.error('Create region API error:', error);
        return NextResponse.json(handleAppwriteError(error), { status: 500 });
    }
}