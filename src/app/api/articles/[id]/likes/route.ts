import { NextResponse, NextRequest } from 'next/server';
import { validateInput } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { getBlogDb } from '@/lib/blog-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    const db = getBlogDb();
    const likes = db.getLikes(articleId, userId || undefined);
    
    return NextResponse.json({
      success: true,
      data: {
        count: likes.count,
        isLiked: likes.userLiked || false
      }
    });

  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch likes'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: articleId } = await params;
  // Check rate limit
  const rateLimitError = await checkRateLimit(request, 'PUBLIC');
  if (rateLimitError) return rateLimitError;

  try {
    const body = await request.json();
    const { userId } = body;

    // Input validation
    const validation = validateInput(body, {
      userId: {
        required: true,
        type: 'string' as const,
        minLength: 1,
        maxLength: 255,
        sanitize: true
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
    const result = db.toggleLike(articleId, userId);

    console.log('Like toggle successful:', { articleId, userId, liked: result.liked });
    
    return NextResponse.json({
      success: true,
      data: {
        isLiked: result.liked,
        totalLikes: result.totalLikes
      },
      message: result.liked ? 'Article liked successfully!' : 'Like removed successfully!'
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to toggle like'
    }, { status: 500 });
  }
}