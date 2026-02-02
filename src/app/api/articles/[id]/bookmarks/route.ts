import { NextResponse, NextRequest } from 'next/server';
import { validateInput } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { getBlogDb } from '@/lib/blog-db';
import { ProductionLogger, ErrorTracker } from '@/lib/production-logger';
import { addSecurityHeaders, securityMiddleware, sanitizeInput, detectSQLInjection, getSensitiveRateLimit } from '@/lib/security';

export async function GET(request: NextRequest) {
  // Apply security middleware
  const securityError = securityMiddleware(request);
  if (securityError) return securityError;

  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const articleId = searchParams.get('articleId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Validate inputs
    const validation = validateInput({ userId, articleId, page, limit }, {
      userId: {
        required: true,
        type: 'string' as const,
        minLength: 1,
        maxLength: 255,
        sanitize: true
      },
      articleId: {
        required: false,
        type: 'string' as const,
        minLength: 1,
        maxLength: 255,
        sanitize: true
      },
      page: { type: 'number' as const, min: 1, max: 100 },
      limit: { type: 'number' as const, min: 1, max: 100 }
    });

    if (!validation.isValid) {
      const response = NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input parameters',
        details: validation.errors
      }, { status: 400 });
      return addSecurityHeaders(response);
    }

    // Additional security checks
    if (userId && detectSQLInjection(userId)) {
      const response = NextResponse.json({
        success: false,
        error: 'SECURITY_VIOLATION',
        message: 'Invalid characters detected in user ID'
      }, { status: 400 });
      return addSecurityHeaders(response);
    }
    
    if (articleId && detectSQLInjection(articleId)) {
      const response = NextResponse.json({
        success: false,
        error: 'SECURITY_VIOLATION',
        message: 'Invalid characters detected in article ID'
      }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const db = getBlogDb();

    // If articleId is provided, check if specific article is bookmarked
    if (articleId) {
      const isBookmarked = db.isBookmarked(articleId, userId!);
      const response = NextResponse.json({
        success: true,
        data: {
          isBookmarked
        }
      });
      return addSecurityHeaders(response);
    }

    // Otherwise, return all user bookmarks with pagination
    const result = db.getBookmarks(userId!, page, limit);

    // Format dates for frontend
    const formattedBookmarks = result.bookmarks.map(bookmark => ({
      ...bookmark,
      created_at: new Date(bookmark.created_at).toISOString()
    }));

    const response = NextResponse.json({
      success: true,
      data: {
        bookmarks: formattedBookmarks,
        pagination: {
          page,
          limit,
          total: result.total,
          hasMore: result.hasMore,
          totalPages: Math.ceil(result.total / limit)
        }
      }
    });
    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    const response = NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch bookmarks'
    }, { status: 500 });
    return addSecurityHeaders(response);
  }
}

export async function POST(request: NextRequest) {
  // Apply security middleware
  const securityError = securityMiddleware(request);
  if (securityError) return securityError;

  // Enhanced rate limiting for sensitive operations
  const sensitiveLimit = getSensitiveRateLimit('/api/articles/[id]/bookmarks');
  const rateLimitConfig = sensitiveLimit || { limit: 10, windowMs: 60 * 1000 };
  const rateLimitError = await checkRateLimit(request, 'PUBLIC');
  if (rateLimitError) return addSecurityHeaders(rateLimitError);

  try {
    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { articleId, userId } = sanitizedBody;

    // Input validation
    const validation = validateInput(sanitizedBody, {
      articleId: {
        required: true,
        type: 'string' as const,
        minLength: 1,
        maxLength: 255,
        sanitize: true
      },
      userId: {
        required: true,
        type: 'string' as const,
        minLength: 1,
        maxLength: 255,
        sanitize: true
      }
    });

    if (!validation.isValid) {
      const response = NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validation.errors
      }, { status: 400 });
      return addSecurityHeaders(response);
    }

    // Security checks
    if (detectSQLInjection(articleId) || detectSQLInjection(userId)) {
      const response = NextResponse.json({
        success: false,
        error: 'SECURITY_VIOLATION',
        message: 'Invalid characters detected'
      }, { status: 400 });
      return addSecurityHeaders(response);
    }

    const db = getBlogDb();
    const result = db.toggleBookmark(articleId, userId);

    console.log('Bookmark toggle successful:', { articleId, userId, bookmarked: result.bookmarked });

    const response = NextResponse.json({
      success: true,
      data: {
        bookmarked: result.bookmarked
      },
      message: result.bookmarked ? 'Article bookmarked successfully!' : 'Bookmark removed successfully!'
    });
    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error toggling bookmark:', error);
    const response = NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to toggle bookmark'
    }, { status: 500 });
    return addSecurityHeaders(response);
  }
}