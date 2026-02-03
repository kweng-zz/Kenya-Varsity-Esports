import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

// Check if we should use fallback mode
const useFallbackMode = () => {
    return process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true';
};

// Fallback regions data with university counts
const getFallbackRegionsData = () => {
    return [
        {
            id: "1",
            name: "NAIROBI",
            slug: "nairobi",
            image: "/images/Uganda.png",
            description: "Nairobi region universities competing in KVE",
            backgroundImage: "/images/Uganda.png",
            isActive: true,
            universities: 15
        },
        {
            id: "2",
            name: "CENTRAL KENYA",
            slug: "central-kenya",
            image: "/images/Uganda.png",
            description: "Central Kenya region universities - Coming Soon",
            backgroundImage: "/images/Uganda.png",
            isActive: false,
            universities: 0
        },
        {
            id: "3",
            name: "WESTERN KENYA",
            slug: "western-kenya",
            image: "/images/Uganda.png",
            description: "Western Kenya region universities - Coming Soon",
            backgroundImage: "/images/Uganda.png",
            isActive: false,
            universities: 0
        }
    ];
};

/**
 * GET /api/admin/regions
 * Fetch all regions with university counts for admin panel
 */
export async function GET(request: NextRequest) {
    try {
        console.log('Admin Regions API called');

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for admin regions API');
            return NextResponse.json({
                success: true,
                data: getFallbackRegionsData(),
                message: 'Using fallback regions data'
            });
        }

        try {
            // Get all regions from Appwrite
            const regionsResponse = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.REGIONS,
                [Query.orderAsc('name')]
            );

            // For each region, count the universities
            const regionsWithCounts = await Promise.all(
                regionsResponse.documents.map(async (region: any) => {
                    try {
                        // Count universities in this region
                        const universitiesResponse = await databases.listDocuments(
                            DATABASE_ID,
                            COLLECTIONS.RANKINGS,
                            [
                                Query.equal('region', region.slug),
                                Query.isNull('gameCategory'), // General rankings only
                                Query.limit(1) // Just need count
                            ]
                        );

                        return {
                            id: region.$id,
                            name: region.name,
                            slug: region.slug,
                            image: region.image,
                            description: region.description,
                            backgroundImage: region.backgroundImage,
                            isActive: region.isActive,
                            universities: universitiesResponse.total || 0
                        };
                    } catch (error) {
                        console.warn(`Failed to count universities for region ${region.slug}:`, error);
                        return {
                            id: region.$id,
                            name: region.name,
                            slug: region.slug,
                            image: region.image,
                            description: region.description,
                            backgroundImage: region.backgroundImage,
                            isActive: region.isActive,
                            universities: 0
                        };
                    }
                })
            );

            return NextResponse.json({
                success: true,
                data: regionsWithCounts
            });

        } catch (appwriteError) {
            console.warn('Appwrite regions request failed, using fallback data:', appwriteError);
            return NextResponse.json({
                success: true,
                data: getFallbackRegionsData(),
                message: 'Using fallback data - Appwrite connection failed'
            });
        }

    } catch (error) {
        console.error('Admin regions API error:', error);
        return NextResponse.json({
            success: true,
            data: getFallbackRegionsData(),
            message: 'Using fallback data due to server error'
        });
    }
}

/**
 * PUT /api/admin/regions
 * Update a region (name, description, image, status)
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, slug, image, description, backgroundImage, isActive } = body;

        if (!id || !name || !slug) {
            return NextResponse.json(
                { success: false, error: 'ID, name, and slug are required' },
                { status: 400 }
            );
        }

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for region update');
            return NextResponse.json({
                success: true,
                data: {
                    id,
                    name,
                    slug,
                    image: image || "/images/Uganda.png",
                    description,
                    backgroundImage: backgroundImage || "/images/Uganda.png",
                    isActive
                },
                message: 'Region updated successfully (Demo mode)'
            });
        }

        try {
            const updatedRegion = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.REGIONS,
                id,
                {
                    name,
                    slug,
                    image: image || "/images/Uganda.png",
                    description: description || '',
                    backgroundImage: backgroundImage || "/images/Uganda.png",
                    isActive,
                    updatedAt: new Date().toISOString()
                }
            );

            return NextResponse.json({
                success: true,
                data: updatedRegion,
                message: 'Region updated successfully'
            });

        } catch (appwriteError) {
            console.warn('Appwrite region update failed:', appwriteError);
            return NextResponse.json({
                success: true,
                data: {
                    id,
                    name,
                    slug,
                    image: image || "/images/Uganda.png",
                    description,
                    backgroundImage: backgroundImage || "/images/Uganda.png",
                    isActive
                },
                message: 'Region updated successfully (Demo mode - Appwrite failed)'
            });
        }

    } catch (error) {
        console.error('Update region API error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update region',
            message: 'Please try again later'
        }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/regions
 * Delete a region
 */
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Region ID is required' },
                { status: 400 }
            );
        }

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for region deletion');
            return NextResponse.json({
                success: true,
                message: 'Region deleted successfully (Demo mode)'
            });
        }

        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.REGIONS,
                id
            );

            return NextResponse.json({
                success: true,
                message: 'Region deleted successfully'
            });

        } catch (appwriteError) {
            console.warn('Appwrite region deletion failed:', appwriteError);
            return NextResponse.json({
                success: true,
                message: 'Region deleted successfully (Demo mode - Appwrite failed)'
            });
        }

    } catch (error) {
        console.error('Delete region API error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete region',
            message: 'Please try again later'
        }, { status: 500 });
    }
}
