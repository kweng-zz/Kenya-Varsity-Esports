import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if Strapi URL is configured (allow localhost:1337 as it's the default)
    if (!STRAPI_URL) {
      return NextResponse.json({
        success: false,
        error: 'Strapi is not configured',
        details: 'Please configure NEXT_PUBLIC_STRAPI_URL environment variable'
      }, { status: 503 });
    }

    const { id } = await params;
    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const slug = formData.get('slug') as string;
    const category = formData.get('category') as string;
    const game = formData.get('game') as string;
    const author = formData.get('author') as string;
    const featured = formData.get('featured') === 'true';
    const tags = formData.get('tags') as string;
    const image = formData.get('image') as File;

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

    // Upload new image if provided
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
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    // Convert content string to blocks format for Strapi
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

    // Create update data
    const updateData = {
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

    // Update article in Strapi
    const response = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Strapi API error:', errorData);
      throw new Error(`Failed to update article: ${response.status}`);
    }

    const updatedArticle = await response.json();

    return NextResponse.json({
      success: true,
      article: updatedArticle,
      message: 'Article updated successfully'
    });

  } catch (error) {
    console.error('Error updating article:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update article',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete article from Strapi
    const response = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Strapi API error:', errorData);
      throw new Error(`Failed to delete article: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete article',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get article from Strapi
    const response = await fetch(`${STRAPI_URL}/api/articles/${id}?populate=image`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Strapi API error:', errorData);
      throw new Error(`Failed to get article: ${response.status}`);
    }

    const article = await response.json();

    return NextResponse.json({
      success: true,
      article
    });

  } catch (error) {
    console.error('Error getting article:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get article',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}