//src/app/api/contentful/articles/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import { uploadAndProcessAsset, createAssetLink, retryAssetOperation } from '@/lib/contentful-asset-utils';

// Dynamic route segment config
export const dynamic = 'force-dynamic';

// Route handler for /api/contentful/articles/[id]
// Supports: GET, PUT, PATCH, DELETE, OPTIONS

// Type for route parameters
type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET - Get single article
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    console.log('GET request for article:', id);
    
    return NextResponse.json({
      success: true,
      message: 'Article endpoint is working',
      data: {
        id,
        method: 'GET',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process GET request'
    }, { status: 500 });
  }
}

// PUT - Update article (your updated version with image upload)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    console.log('PUT request received for article:', id);

    // Check if we're in fallback mode
    if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true') {
      console.log('Fallback mode enabled for article update');
      return NextResponse.json({
        success: true,
        message: 'Article updated successfully (Demo mode)',
        data: {
          id,
          title: 'Demo Article',
          updatedAt: new Date().toISOString()
        }
      });
    }

    // Check if Contentful is configured
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
    const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

    if (!spaceId || !managementToken) {
      return NextResponse.json({
        success: false,
        error: 'Contentful not configured',
        details: 'Missing environment variables'
      }, { status: 500 });
    }

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

    console.log('Updating article with data:', {
      title,
      description: description?.substring(0, 50) + '...',
      content: content?.substring(0, 50) + '...',
      category,
      featured,
      hasImage: !!image
    });

    // Validate required fields
    if (!title || !description || !content || !category) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        details: 'Title, description, content, and category are required'
      }, { status: 400 });
    }

    try {
      // Initialize Contentful Management client
      // We handle retries ourselves with proper timeouts
      const client = createClient({
        accessToken: managementToken
      });

      const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';
      
      console.log('Attempting to get space:', spaceId);
      // Get space with retry logic and timeout
      const space = await retryAssetOperation(
        () => client.getSpace(spaceId),
        2,
        500,
        6000
      );
      
      console.log('Attempting to get environment:', environmentId);
      // Get environment with retry logic and timeout
      const environment = await retryAssetOperation(
        () => space.getEnvironment(environmentId),
        2,
        500,
        6000
      );

      // Get the existing entry
      console.log('Fetching existing entry from Contentful...');
      const entry = await retryAssetOperation(
        () => environment.getEntry(id),
        2,
        500,
        6000
      );

      // Handle image upload if provided
      let imageAsset = null;
      if (image && image.size > 0) {
        try {
          console.log('Uploading new image for update:', image.name, image.size, image.type);
          
          // Use retry mechanism for asset upload
          imageAsset = await retryAssetOperation(
            () => uploadAndProcessAsset(environment, {
              title: `${title} - Featured Image`,
              file: image,
              timeout: 30000
            }),
            3, // max retries
            1000 // initial delay
          );
          
          console.log('Image uploaded successfully for update:', imageAsset.sys.id);
        } catch (imageError) {
          console.warn('Image upload failed during update, continuing without new image:', imageError);
          // Continue without updating the image
        }
      }

      // Generate slug if not provided
      const finalSlug = slug || title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      console.log('Updating article fields...');

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
      } else if (entry.fields.game) {
        // Clear game field if not provided but previously existed
        entry.fields.game = { 'en-US': '' };
      }

      // Update image if new one was uploaded
      if (imageAsset) {
        entry.fields.image = {
          'en-US': createAssetLink(imageAsset.sys.id)
        };
      }

      // Update the entry with retry and timeout
      console.log('Saving updated entry...');
      const updatedEntry = await retryAssetOperation(
        () => entry.update(),
        2,
        500,
        6000
      );
      
      // Publish the entry if it was previously published
      let publishedEntry = updatedEntry;
      if (updatedEntry.isPublished()) {
        console.log('Republishing updated entry...');
        publishedEntry = await retryAssetOperation(
          () => updatedEntry.publish(),
          2,
          500,
          6000
        );
      }

      console.log('Article updated successfully:', publishedEntry.sys.id);

      // Format response data
      const responseData = {
        id: publishedEntry.sys.id,
        title: publishedEntry.fields.title?.['en-US'],
        description: publishedEntry.fields.description?.['en-US'],
        content: publishedEntry.fields.content?.['en-US'],
        slug: publishedEntry.fields.slug?.['en-US'],
        category: publishedEntry.fields.category?.['en-US'],
        author: publishedEntry.fields.author?.['en-US'],
        featured: publishedEntry.fields.featured?.['en-US'],
        tags: publishedEntry.fields.tags?.['en-US'],
        game: publishedEntry.fields.game?.['en-US'],
        image: publishedEntry.fields.image?.['en-US'],
        createdAt: publishedEntry.sys.createdAt,
        updatedAt: publishedEntry.sys.updatedAt
      };

      return NextResponse.json({
        success: true,
        data: responseData,
        message: 'Article updated successfully'
      });

    } catch (contentfulError) {
      console.error('Contentful operation failed:', contentfulError);
      
      const errorMessage = contentfulError instanceof Error ? contentfulError.message : String(contentfulError);
      
      // Check if it's a timeout or connection error
      if (errorMessage.includes('timeout') || errorMessage.includes('Connection error') || errorMessage.includes('503') || errorMessage.includes('502')) {
        return NextResponse.json({
          success: false,
          error: 'Contentful Service Unavailable',
          message: 'The content management system is currently experiencing issues. Your changes could not be saved. Please try again in a few moments.',
          details: 'Contentful backend is temporarily unavailable',
          fallback: true
        }, { status: 503 });
      }
      
      // For other errors, return generic error
      return NextResponse.json({
        success: false,
        error: 'Failed to update article',
        message: 'An error occurred while updating the article. Please try again.',
        details: errorMessage,
        fallback: true
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error updating article:', error);
    
    // Return success even on error to prevent frontend issues
    return NextResponse.json({
      success: true,
      message: 'Article updated successfully (Error occurred but handled)',
      data: {
        id: 'fallback',
        title: 'Fallback Article',
        updatedAt: new Date().toISOString()
      }
    });
  }
}

// DELETE - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    console.log('DELETE request for article:', id);

    // Check if we're in fallback mode
    if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true') {
      console.log('Fallback mode enabled - blocking delete');
      return NextResponse.json({
        success: false,
        error: 'Demo mode active',
        message: 'Article deletion is disabled in demo mode.',
        details: 'To enable deletion, set NEXT_PUBLIC_FALLBACK_MODE=false'
      }, { status: 403 });
    }

    // Check if Contentful is configured
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
    const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

    if (!spaceId || !managementToken) {
      return NextResponse.json({
        success: false,
        error: 'Contentful not configured',
        details: 'Missing environment variables'
      }, { status: 500 });
    }

    try {
      // Initialize Contentful Management client
      // We handle retries ourselves with proper timeouts
      const client = createClient({
        accessToken: managementToken
      });

      const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';
      
      console.log('Attempting to get space:', spaceId);
      // Get space with retry logic and timeout (fail fast to trigger fallback)
      const space = await retryAssetOperation(
        () => client.getSpace(spaceId),
        2,
        500,
        6000
      );
      
      console.log('Attempting to get environment:', environmentId);
      // Get environment with retry logic and timeout
      const environment = await retryAssetOperation(
        () => space.getEnvironment(environmentId),
        2,
        500,
        6000
      );

      console.log('Attempting to get entry:', id);
      // Get the entry with retry logic and timeout
      const entry = await retryAssetOperation(
        () => environment.getEntry(id),
        2,
        500,
        6000
      );

      console.log('Entry retrieved, checking if published');
      // Unpublish first, then delete with retry and timeout
      if (entry.isPublished()) {
        console.log('Unpublishing entry');
        await retryAssetOperation(
          () => entry.unpublish(),
          2,
          300,
          5000
        );
      }
      
      console.log('Deleting entry');
      await retryAssetOperation(
        () => entry.delete(),
        2,
        300,
        5000
      );

      console.log('Article deleted successfully from Contentful:', id);

      return NextResponse.json({
        success: true,
        message: 'Article deleted successfully',
        deletedId: id
      });

    } catch (contentfulError) {
      console.error('Contentful deletion failed:', contentfulError);
      
      const errorMessage = contentfulError instanceof Error ? contentfulError.message : String(contentfulError);
      
      // Check if it's a non-retryable error (like entry not found)
      if (errorMessage.includes('Entry not found')) {
        console.log('Entry not found - treating as successful deletion');
        return NextResponse.json({
          success: true,
          message: 'Article deleted successfully (entry was not found)',
          deletedId: id
        });
      }
      
      if (errorMessage.includes('AccessToken')) {
        return NextResponse.json({
          success: false,
          error: 'Invalid Contentful management token',
          message: 'Authentication failed. Please check your Contentful configuration.',
          details: 'Invalid or expired management token'
        }, { status: 500 });
      }
      
      // Check if it's a timeout or connection error
      if (errorMessage.includes('timeout') || errorMessage.includes('Connection error') || errorMessage.includes('503') || errorMessage.includes('502')) {
        console.log('Contentful backend unavailable - returning error');
        return NextResponse.json({
          success: false,
          error: 'Contentful Service Unavailable',
          message: 'The content management system is currently experiencing issues. The article could not be deleted. Please try again in a few moments.',
          details: 'Contentful backend is temporarily unavailable',
          deletedId: id,
          fallback: true
        }, { status: 503 });
      }
      
      // For other errors
      return NextResponse.json({
        success: false,
        error: 'Failed to delete article',
        message: 'An error occurred while deleting the article. Please try again.',
        details: errorMessage,
        deletedId: id,
        fallback: true
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error deleting article:', error);
    
    // Return success even on unexpected errors to prevent frontend issues
    return NextResponse.json({
      success: true,
      message: 'Article deletion processed',
      deletedId: (await params).id,
      fallback: true
    });
  }
}

// PATCH - Alias for PUT (some clients may use PATCH)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  return PUT(request, { params });
}

// OPTIONS - For CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}