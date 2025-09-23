import { NextResponse } from 'next/server';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
// Create new article
export async function POST(request) {
    try {
        // Ensure Strapi URL is configured
        if (!STRAPI_URL) {
            return NextResponse.json({
                success: false,
                error: 'Strapi is not configured',
                details: 'Please configure NEXT_PUBLIC_STRAPI_URL environment variable'
            }, { status: 503 });
        }
        const formData = await request.formData();
        // Extract form fields
        const title = formData.get('title');
        const description = formData.get('description');
        const content = formData.get('content');
        const slug = formData.get('slug');
        const category = formData.get('category');
        const game = formData.get('game');
        const author = formData.get('author');
        const featured = formData.get('featured') === 'true';
        const tags = formData.get('tags');
        const image = formData.get('image');
        // Validate required fields
        if (!title || !description || !content || !category) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 });
        }
        // Generate slug if not provided
        const finalSlug = slug || title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        let imageId = null;
        // Upload image if provided
        if (image && image.size > 0) {
            try {
                const imageFormData = new FormData();
                imageFormData.append('files', image);
                const imageResponse = await fetch(`${STRAPI_URL}/api/upload`, {
                    method: 'POST',
                    headers: {
                        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
                    },
                    body: imageFormData,
                });
                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    imageId = imageData[0]?.id;
                }
                else {
                    console.error('Failed to upload image to Strapi:', imageResponse.statusText);
                }
            }
            catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        // Convert content string to blocks format expected by Strapi editor (or store as string)
        const contentBlocks = content ? [
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        text: content
                    }
                ]
            }
        ] : [];
        // Prepare data for Strapi
        const createData = {
            data: {
                title,
                description,
                content: contentBlocks,
                slug: finalSlug,
                category,
                game: game || null,
                author: author || 'KUER Team',
                featured,
                tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                ...(imageId && { image: imageId }),
            }
        };
        // Create article in Strapi
        const response = await fetch(`${STRAPI_URL}/api/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
            },
            body: JSON.stringify(createData),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Strapi API error:', errorData);
            throw new Error(`Failed to create article: ${response.status}`);
        }
        const createdArticle = await response.json();
        return NextResponse.json({
            success: true,
            article: createdArticle,
            message: 'Article created successfully'
        });
    }
    catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create article',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
export async function GET() {
    return NextResponse.json({
        success: false,
        error: 'Method not allowed'
    }, { status: 405 });
}
