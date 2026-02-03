import { NextRequest, NextResponse } from 'next/server';

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

    // Check if Strapi is configured
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiUrl || !strapiToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Strapi not configured',
          details: 'Please configure Strapi connection in environment variables'
        },
        { status: 500 }
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
    };

    // Update article in Strapi
    const updateResponse = await fetch(`${strapiUrl}/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({ data: articleData }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${updateResponse.status}: ${updateResponse.statusText}`);
    }

    const updatedArticle = await updateResponse.json();

    // Handle image upload if provided
    if (image && updatedArticle.data?.id) {
      try {
        const imageFormData = new FormData();
        imageFormData.append('files', image);
        imageFormData.append('ref', 'api::article.article');
        imageFormData.append('refId', updatedArticle.data.id.toString());
        imageFormData.append('field', 'image');

        const uploadResponse = await fetch(`${strapiUrl}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${strapiToken}`,
          },
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          console.warn('Image upload failed, but article was updated successfully');
        }
      } catch (imageError) {
        console.warn('Image upload error:', imageError);
        // Don't fail the entire request if image upload fails
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedArticle.data,
      message: 'Article updated successfully'
    });

  } catch (error) {
    console.error('Error updating article:', error);
    
    let errorMessage = 'Failed to update article';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: 'Please check server logs for more information'
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

    // Check if Strapi is configured
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiUrl || !strapiToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Strapi not configured',
          details: 'Please configure Strapi connection in environment variables'
        },
        { status: 500 }
      );
    }

    // Delete article from Strapi
    const deleteResponse = await fetch(`${strapiUrl}/api/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${strapiToken}`,
      },
    });

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${deleteResponse.status}: ${deleteResponse.statusText}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    
    let errorMessage = 'Failed to delete article';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: 'Please check server logs for more information'
      },
      { status: 500 }
    );
  }
}