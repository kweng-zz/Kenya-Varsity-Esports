import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import { uploadAndProcessAsset, createAssetLink } from '@/lib/contentful-asset-utils';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
          details: 'Application is running in fallback mode. Contentful functionality is disabled.'
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
          details: 'NEXT_PUBLIC_CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN environment variables are not set.'
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

    // Get the existing entry
    const entry = await environment.getEntry(id);

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
        
        // If it's a timeout error, try to continue without the new image
        if (imageError instanceof Error && imageError.message.includes('timeout')) {
          console.warn('Asset processing timed out, continuing with existing image');
        }
        
        // Continue with existing image
      }
    }

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Update article fields
    entry.fields.title = { 'en-US': title };
    entry.fields.description = { 'en-US': description };
    entry.fields.content = { 'en-US': content };
    entry.fields.slug = { 'en-US': finalSlug };
    entry.fields.category = { 'en-US': category };
    entry.fields.author = { 'en-US': author || 'KUER Team' };
    entry.fields.featured = { 'en-US': featured };
    entry.fields.tags = { 'en-US': tags };

    // Update game if provided
    if (game) {
      entry.fields.game = { 'en-US': game };
    }

    // Update image if new one was uploaded
    if (imageAsset) {
      entry.fields.image = {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: imageAsset.sys.id
          }
        }
      };
    }

    // Update and publish the entry
    const updatedEntry = await entry.update();
    const publishedEntry = await updatedEntry.publish();

    return NextResponse.json({
      success: true,
      data: {
        id: publishedEntry.sys.id,
        ...publishedEntry.fields,
        createdAt: publishedEntry.sys.createdAt,
        updatedAt: publishedEntry.sys.updatedAt
      },
      message: 'Article updated successfully'
    });

  } catch (error) {
    console.error('Error updating article:', error);
    
    let errorMessage = 'Failed to update article';
    let details = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('Entry not found')) {
        details = 'Article not found';
      } else if (error.message.includes('Space not found')) {
        details = 'Invalid Contentful Space ID or insufficient permissions';
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if we're in fallback mode
    if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fallback mode enabled',
          details: 'Application is running in fallback mode. Contentful functionality is disabled.'
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
          details: 'NEXT_PUBLIC_CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN environment variables are not set.'
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

    // Get the entry
    const entry = await environment.getEntry(id);

    // Unpublish first, then delete
    if (entry.isPublished()) {
      await entry.unpublish();
    }
    
    await entry.delete();

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    
    let errorMessage = 'Failed to delete article';
    let details = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('Entry not found')) {
        details = 'Article not found';
      } else if (error.message.includes('Space not found')) {
        details = 'Invalid Contentful Space ID or insufficient permissions';
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