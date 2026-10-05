import { NextResponse, NextRequest } from 'next/server';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleSlug } = await params;

    if (!articleSlug) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ARTICLE_ID',
        message: 'Article ID is required'
      }, { status: 400 });
    }

    // Get the current article
    const currentArticle = getPostBySlug(articleSlug, true);
    
    if (!currentArticle) {
      return NextResponse.json({
        success: false,
        error: 'ARTICLE_NOT_FOUND',
        message: 'Article not found'
      }, { status: 404 });
    }

    // Get all posts sorted by published date (newest first)
    const allPostsResponse = getAllPosts({ pageSize: 1000, includeDrafts: true });
    const allPosts = allPostsResponse.data;
    
    // Find the current article's index in the sorted array
    const currentIndex = allPosts.findIndex((article: { slug: string }) => article.slug === articleSlug);
    
    let prevArticle = null;
    let nextArticle = null;

    if (currentIndex > 0) {
      // Previous article is the one before current (older)
      const prev = allPosts[currentIndex - 1];
      prevArticle = {
        id: prev.id,
        title: prev.title,
        slug: prev.slug,
        category: prev.category,
        imageUrl: prev.imageUrl,
        publishedAt: prev.publishedAt
      };
    }
    
    if (currentIndex < allPosts.length - 1) {
      // Next article is the one after current (newer)
      const next = allPosts[currentIndex + 1];
      nextArticle = {
        id: next.id,
        title: next.title,
        slug: next.slug,
        category: next.category,
        imageUrl: next.imageUrl,
        publishedAt: next.publishedAt
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        prev: prevArticle,
        next: nextArticle,
        current: {
          id: currentArticle.id,
          title: currentArticle.title,
          slug: currentArticle.slug,
          publishedAt: currentArticle.publishedAt
        }
      }
    });

  } catch (error) {
    console.error('Error fetching article navigation:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch article navigation'
    }, { status: 500 });
  }
}