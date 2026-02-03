import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const slug = formData.get('slug') as string;
    const category = formData.get('category') as string;
    const game = formData.get('game') as string;
    const author = formData.get('author') as string;
    const featured = formData.get('featured') === 'true';
    const tags = (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(tag => tag) || [];
    const image = formData.get('image') as File | null;

    // Validate required fields
    if (!title || !description || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if we're in fallback mode
    if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fallback mode enabled',
          details: 'Application is running in fallback mode. Strapi functionality is disabled. To enable article creation, configure Strapi and disable fallback mode.'
        },
        { status: 503 }
      );
    }

    // Check if Strapi is configured
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Strapi not configured',
          details: 'NEXT_PUBLIC_STRAPI_URL environment variable is not set. Please configure Strapi connection.'
        },
        { status: 500 }
      );
    }

    if (!strapiToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Strapi API token not configured',
          details: 'STRAPI_API_TOKEN environment variable is not set. Please configure Strapi API token.'
        },
        { status: 500 }
      );
    }

    // Test Strapi connection first
    try {
      const testResponse = await fetch(`${strapiUrl}/api/articles?pagination[pageSize]=1`, {
        headers: {
          'Authorization': `Bearer ${strapiToken}`,
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!testResponse.ok) {
        throw new Error(`Strapi connection failed: ${testResponse.status}`);
      }
    } catch (error) {
      console.error('Strapi connection test failed:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot connect to Strapi',
          details: 'Strapi server is not responding. Please ensure Strapi is running and accessible.'
        },
        { status: 503 }
      );
    }

    // Prepare article data
    const articleData = {
      title,
      description,
      content,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-'),
      category,
      game: game || null,
      author: author || 'KVE Team',
      featured,
      tags,
      publishedAt: new Date().toISOString(),
    };

    // Create article in Strapi
    const createResponse = await fetch(`${strapiUrl}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({ data: articleData }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${createResponse.status}: ${createResponse.statusText}`);
    }

    const createdArticle = await createResponse.json();

    // Handle image upload if provided
    if (image && createdArticle.data?.id) {
      try {
        const imageFormData = new FormData();
        imageFormData.append('files', image);
        imageFormData.append('ref', 'api::article.article');
        imageFormData.append('refId', createdArticle.data.id.toString());
        imageFormData.append('field', 'image');

        const uploadResponse = await fetch(`${strapiUrl}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${strapiToken}`,
          },
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          console.warn('Image upload failed, but article was created successfully');
        }
      } catch (imageError) {
        console.warn('Image upload error:', imageError);
        // Don't fail the entire request if image upload fails
      }
    }

    return NextResponse.json({
      success: true,
      data: createdArticle.data,
      message: 'Article created successfully'
    });

  } catch (error) {
    console.error('Error creating article:', error);
    
    let errorMessage = 'Failed to create article';
    let details = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('fetch')) {
        details = 'Network error: Cannot connect to Strapi server';
      } else if (error.message.includes('timeout')) {
        details = 'Request timeout: Strapi server is not responding';
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: details || 'Please check server logs for more information'
      },
      { status: 500 }
    );
  }
}