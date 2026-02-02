import { NextResponse, NextRequest } from 'next/server';
import { validateInput } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { getBlogDb } from '@/lib/blog-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!articleId) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ARTICLE_ID',
        message: 'Article ID is required'
      }, { status: 400 });
    }

    const db = getBlogDb();
    const result = db.getComments(articleId, page, limit);

    // Format dates for frontend
    const formattedComments = result.comments.map(comment => {
      const commentWithReplies = comment as any;
      return {
        ...comment,
        created_at: new Date(comment.created_at).toISOString(),
        replies: commentWithReplies.replies ? commentWithReplies.replies.map((reply: any) => ({
          ...reply,
          created_at: new Date(reply.created_at).toISOString()
        })) : []
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        comments: formattedComments,
        pagination: {
          page,
          limit,
          total: result.total,
          hasMore: result.hasMore,
          totalPages: Math.ceil(result.total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch comments'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check rate limit
  const rateLimitError = await checkRateLimit(request, 'PUBLIC');
  if (rateLimitError) return rateLimitError;

  try {
    const { id: articleId } = await params;
    const body = await request.json();
    const { authorName, content, authorAvatar, parentId } = body;

    // Input validation
    const validation = validateInput(body, {
      authorName: {
        required: true,
        type: 'string' as const,
        minLength: 2,
        maxLength: 100,
        sanitize: true
      },
      content: {
        required: true,
        type: 'string' as const,
        minLength: 1,
        maxLength: 2000,
        sanitize: true
      },
      authorAvatar: {
        required: false,
        type: 'string' as const,
        maxLength: 500
      },
      parentId: {
        required: false,
        type: 'number' as const,
        min: 1
      }
    });

    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validation.errors
      }, { status: 400 });
    }

    if (!articleId) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ARTICLE_ID',
        message: 'Article ID is required'
      }, { status: 400 });
    }

    const db = getBlogDb();
    const comment = db.createComment(articleId, authorName, content, authorAvatar, parentId);

    if (!comment) {
      return NextResponse.json({
        success: false,
        error: 'CREATION_FAILED',
        message: 'Failed to create comment'
      }, { status: 500 });
    }

    // Format date for frontend
    const formattedComment = {
      ...comment,
      created_at: new Date(comment.created_at).toISOString()
    };

    console.log('Comment created successfully:', { articleId, authorName, parentId });

    return NextResponse.json({
      success: true,
      data: formattedComment,
      message: 'Comment posted successfully!'
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to create comment'
    }, { status: 500 });
  }
}