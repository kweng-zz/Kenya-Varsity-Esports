import { NextResponse, NextRequest } from 'next/server';
import { validateInput } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { getBlogDb } from '@/lib/blog-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  // Check rate limit (less restrictive for authenticated read operations)
  const rateLimitError = await checkRateLimit(request, 'AUTHENTICATED');
  if (rateLimitError) return rateLimitError;

  try {
    const { name: authorName } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!authorName) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_AUTHOR_NAME',
        message: 'Author name is required'
      }, { status: 400 });
    }

    const db = getBlogDb();
    const followerCount = db.getFollowerCount(decodeURIComponent(authorName));
    
    let following = false;
    if (userId) {
      following = db.isFollowing(decodeURIComponent(authorName), userId);
    }

    return NextResponse.json({
      success: true,
      data: {
        authorName: decodeURIComponent(authorName),
        followerCount,
        following
      }
    });

  } catch (error) {
    console.error('Error fetching follow status:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch follow status'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  // Check rate limit (use authenticated rate limit for user actions)
  const rateLimitError = await checkRateLimit(request, 'AUTHENTICATED');
  if (rateLimitError) return rateLimitError;

  try {
    const { name: authorName } = await params;
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

    if (!authorName) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_AUTHOR_NAME',
        message: 'Author name is required'
      }, { status: 400 });
    }

    const db = getBlogDb();
    const result = db.toggleFollow(decodeURIComponent(authorName), userId);

    console.log('Follow toggle successful:', { authorName, userId, following: result.following });

    return NextResponse.json({
      success: true,
      data: {
        following: result.following,
        followerCount: result.followerCount
      },
      message: result.following ? 'Author followed successfully!' : 'Unfollowed successfully!'
    });

  } catch (error) {
    console.error('Error toggling follow:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to toggle follow'
    }, { status: 500 });
  }
}