import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import { uploadAndProcessAsset, createAssetLink } from '@/lib/contentful-asset-utils';

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
          details: 'Application is running in fallback mode. Contentful functionality is disabled. To enable article creation, configure Contentful and disable fallback mode.'
        },
        { status: 503 }
      );
    }

    // Check if Contentful is configured
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
    const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';

    if (!spaceId || !managementToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contentful not configured',
          details: 'NEXT_PUBLIC_CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN environment variables are not set. Please configure Contentful connection.'
        },
        { status: 500 }
      );
    }

    // Initialize Contentful Management client
    const client = createClient({
      accessToken: managementToken
    });

    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Handle image upload if provided
    let imageAsset = null;
    if (image) {
      try {
        imageAsset = await uploadAndProcessAsset(environment, {
          title: `${title} - Featured Image`,
          file: image,
          timeout: 30000
        });
      } catch (imageError) {
        console.warn('Image upload failed:', imageError);
        
        // If it's a timeout error, try to continue without the image
        if (imageError instanceof Error && imageError.message.includes('timeout')) {
          console.warn('Asset processing timed out, continuing without image');
        }
        
        // Continue without image rather than failing the entire request
      }
    }

    // Prepare article data
    const articleFields: any = {
      title: { 'en-US': title },
      description: { 'en-US': description },
      content: { 'en-US': content },
      slug: { 'en-US': finalSlug },
      category: { 'en-US': category },
      author: { 'en-US': author || 'KUER Team' },
      featured: { 'en-US': featured },
      tags: { 'en-US': tags },
      publishedAt: { 'en-US': new Date().toISOString() }
    };

    // Add game if provided
    if (game) {
      articleFields.game = { 'en-US': game };
    }

    // Add image if uploaded successfully
    if (imageAsset) {
      articleFields.image = {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: imageAsset.sys.id
          }
        }
      };
    }

    // Create article entry
    const entry = await environment.createEntry('article', {
      fields: articleFields
    });

    // Publish the entry
    const publishedEntry = await entry.publish();

    return NextResponse.json({
      success: true,
      data: {
        id: publishedEntry.sys.id,
        ...publishedEntry.fields,
        createdAt: publishedEntry.sys.createdAt,
        updatedAt: publishedEntry.sys.updatedAt
      },
      message: 'Article created successfully'
    });

  } catch (error) {
    console.error('Error creating article:', error);
    
    let errorMessage = 'Failed to create article';
    let details = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('Space not found')) {
        details = 'Invalid Contentful Space ID or insufficient permissions';
      } else if (error.message.includes('The access token you sent could not be found')) {
        details = 'Invalid Contentful Management Token';
      } else if (error.message.includes('ValidationFailed')) {
        details = 'Content validation failed - check required fields and data format';
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