import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import { uploadAndProcessAsset, createAssetLink, retryAssetOperation } from '@/lib/contentful-asset-utils';

// Ensure this route is always dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * PUT /api/contentful/articles/update
 * Update an existing article
 * 
 * Query parameters:
 * - id: The article ID to update
 */
export async function PUT(request: NextRequest) {
  try {
    // Get article ID from query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing article ID',
        details: 'Please provide an article ID via ?id=<articleId>'
      }, { status: 400 });
    }

    console.log('PUT request received for article update:', id);

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
      console.warn('Contentful not configured');
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

      // Validate slug format
      if (!finalSlug || !/^[a-z0-9-]+$/.test(finalSlug)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid slug format',
          message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
          details: `Generated slug: "${finalSlug}"`
        }, { status: 400 });
      }

      console.log('Updating article fields with data:', {
        title,
        slug: finalSlug,
        category,
        game: game?.trim() || 'not set',
        author: author || 'KUER Team',
        featured,
        tags: tags.length
      });

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
      if (game && game.trim()) {
        entry.fields.game = { 'en-US': game.trim() };
      } else {
        // Remove game field if not provided or empty
        delete entry.fields.game;
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
      console.error('Full error details:', {
        message: errorMessage,
        stack: contentfulError instanceof Error ? contentfulError.stack : undefined,
        name: contentfulError instanceof Error ? contentfulError.name : undefined
      });

      // Check for specific Contentful validation errors
      if (errorMessage.includes('ValidationFailed') || errorMessage.includes('validation')) {
        console.error('Validation error detected:', errorMessage);
        return NextResponse.json({
          success: false,
          error: 'Validation Error',
          message: 'The article data failed validation. Please check all required fields and try again.',
          details: errorMessage,
          fallback: true
        }, { status: 400 });
      }

      // Check for slug uniqueness errors
      if (errorMessage.includes('unique') || errorMessage.includes('already exists')) {
        console.error('Uniqueness constraint violated:', errorMessage);
        return NextResponse.json({
          success: false,
          error: 'Duplicate Slug',
          message: 'An article with this slug already exists. Please choose a different slug.',
          details: errorMessage,
          fallback: true
        }, { status: 409 });
      }

      // Check for entry not found
      if (errorMessage.includes('Entry not found') || errorMessage.includes('does not exist')) {
        console.error('Entry not found:', errorMessage);
        return NextResponse.json({
          success: false,
          error: 'Article Not Found',
          message: 'The article you are trying to update could not be found.',
          details: errorMessage,
          fallback: true
        }, { status: 404 });
      }

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
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update article',
      message: 'An unexpected error occurred while updating the article.',
      details: errorMessage
    }, { status: 500 });
  }
}

/**
 * DELETE /api/contentful/articles/update
 * Delete an article
 * 
 * Query parameters:
 * - id: The article ID to delete
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get article ID from query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing article ID',
        details: 'Please provide an article ID via ?id=<articleId>'
      }, { status: 400 });
    }

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
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete article',
      message: 'An unexpected error occurred while deleting the article.',
      details: errorMessage
    }, { status: 500 });
  }
}

// Add OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
