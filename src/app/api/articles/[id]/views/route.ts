import { NextResponse, NextRequest } from 'next/server';
import { getBlogDb } from '@/lib/blog-db';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;

    if (!articleId) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ARTICLE_ID',
        message: 'Article ID is required'
      }, { status: 400 });
    }

    const db = getBlogDb();
    const views = db.getViews(articleId);

    if (!views) {
      return NextResponse.json({
        success: true,
        data: {
          viewCount: 0,
          lastViewed: null
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        viewCount: views.viewCount,
        lastViewed: new Date(views.lastViewed).toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch views'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check rate limit (less restrictive for views)
  const rateLimitError = await checkRateLimit(request, 'PUBLIC');
  if (rateLimitError) return rateLimitError;

  try {
    const { id: articleId } = await params;

    if (!articleId) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ARTICLE_ID',
        message: 'Article ID is required'
      }, { status: 400 });
    }

    const db = getBlogDb();
    const result = db.trackView(articleId);

    console.log('View tracked successfully:', { articleId, viewCount: result.viewCount });

    return NextResponse.json({
      success: true,
      data: {
        viewCount: result.viewCount,
        lastViewed: new Date(result.lastViewed).toISOString()
      },
      message: 'View tracked successfully!'
    });

  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to track view'
    }, { status: 500 });
  }
}