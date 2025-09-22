import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // Check if Strapi URL is configured (allow localhost:1337 as it's the default)
    if (!STRAPI_URL) {
      return NextResponse.json({
        success: false,
        error: 'Strapi is not configured',
        details: 'Please configure NEXT_PUBLIC_STRAPI_URL environment variable'
      }, { status: 503 });
    }

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

    // Test Strapi connection first
    try {
      console.log('Testing Strapi connection at:', STRAPI_URL);
      const testResponse = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
        },
      });

      console.log('Strapi test response status:', testResponse.status);
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error('Strapi test response error:', errorText);
        
        if (testResponse.status === 403) {
          return NextResponse.json({
            success: false,
            error: 'Strapi permissions not configured',
            details: 'Please enable Article permissions for Public role in Strapi admin panel. See STRAPI_QUICK_SETUP.md for instructions.'
          }, { status: 403 });
        } else if (testResponse.status === 404) {
          return NextResponse.json({
            success: false,
            error: 'Article content type not found',
            details: 'Please create the Article content type in Strapi admin panel. See STRAPI_QUICK_SETUP.md for instructions.'
          }, { status: 404 });
        }
        
        throw new Error(`Strapi connection failed: ${testResponse.status} - ${errorText}`);
      }
      
      console.log('Strapi connection test successful');
    } catch (connectionError) {
      console.error('Strapi connection error:', connectionError);
      return NextResponse.json({
        success: false,
        error: 'Cannot connect to Strapi server',
        details: `Please ensure Strapi is running at ${STRAPI_URL}. Error: ${connectionError instanceof Error ? connectionError.message : 'Unknown error'}`
      }, { status: 503 });
    }

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
        } else {
          console.warn('Image upload failed, continuing without image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // Continue without image rather than failing the entire request
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

    // Create article data
    const articleData = {
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
        publishedAt: new Date().toISOString(),
        ...(imageId && { image: imageId }),
      }
    };

    console.log('Creating article with data:', {
      ...articleData,
      data: {
        ...articleData.data,
        content: '[Content blocks - truncated for logging]'
      }
    });

    // Create article in Strapi
    const response = await fetch(`${STRAPI_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      body: JSON.stringify(articleData),
    });

    console.log('Strapi create response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Strapi API error:', errorData);
      
      if (response.status === 403) {
        return NextResponse.json({
          success: false,
          error: 'Strapi permissions not configured for article creation',
          details: 'Please enable create, update, delete permissions for Article and upload permission in Strapi admin panel. See PERMISSION_FIX.md for step-by-step instructions.'
        }, { status: 403 });
      }
      
      throw new Error(`Failed to create article: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const createdArticle = await response.json();
    console.log('Article created successfully:', {
      id: createdArticle.data?.id,
      documentId: createdArticle.data?.documentId,
      slug: createdArticle.data?.slug || createdArticle.data?.attributes?.slug,
      title: createdArticle.data?.title || createdArticle.data?.attributes?.title
    });

    // Verify the article can be retrieved by slug
    try {
      const verifyResponse = await fetch(`${STRAPI_URL}/api/articles?filters[slug][$eq]=${finalSlug}&populate=image`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
        },
      });
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('Article verification successful:', {
          found: verifyData.data?.length > 0,
          slug: finalSlug,
          count: verifyData.data?.length
        });
      } else {
        console.warn('Article verification failed:', verifyResponse.status);
      }
    } catch (verifyError) {
      console.warn('Article verification error:', verifyError);
    }

    return NextResponse.json({
      success: true,
      article: createdArticle,
      message: 'Article created successfully',
      debug: {
        slug: finalSlug,
        imageUploaded: !!imageId,
        imageId: imageId
      }
    });

  } catch (error) {
    console.error('Error creating article:', error);
    
    // Check if it's a connection error
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return NextResponse.json({
        success: false,
        error: 'Cannot connect to Strapi server',
        details: 'Please ensure Strapi is running at ' + STRAPI_URL
      }, { status: 503 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create article',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}