import { NextResponse, NextRequest } from 'next/server';
import { contentful, transformContentfulArticle } from '@/lib/contentful';

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

    // Get the current article to find its published date
    const currentArticle = await contentful.getArticleBySlug(articleId);
    
    if (!currentArticle) {
      return NextResponse.json({
        success: false,
        error: 'ARTICLE_NOT_FOUND',
        message: 'Article not found'
      }, { status: 404 });
    }

    const transformedCurrent = transformContentfulArticle(currentArticle);
    const currentPublishedDate = new Date(transformedCurrent.publishedAt);

    // Get all articles sorted by published date (newest first)
    const allArticlesResult = await contentful.getArticles({
      pageSize: 100, // Get a reasonable number of articles
      // Don't filter by featured - include all articles for navigation
    });

    // Transform and sort all articles by published date (including current article for index finding)
    const allArticlesIncludingCurrent = allArticlesResult.data
      .map(transformContentfulArticle)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    console.log('=== Navigation Debug ===');
    console.log('Article ID (slug param):', articleId);
    console.log('Transformed current article slug:', transformedCurrent.slug);
    console.log('Current article sys.id:', transformedCurrent.id);
    console.log('All articles count:', allArticlesIncludingCurrent.length);
    
    // Find the current article's index in the sorted array by matching IDs
    const currentIndex = allArticlesIncludingCurrent.findIndex(article => article.id === currentArticle.sys.id);
    
    console.log('Found index:', currentIndex);
    console.log('Current article ID:', currentArticle.sys.id);
    console.log('Has previous:', currentIndex > 0);
    console.log('Has next:', currentIndex < allArticlesIncludingCurrent.length - 1);
    
    // Log the articles around current index for debugging
    if (currentIndex >= 0) {
      console.log('Previous article:', currentIndex > 0 ? allArticlesIncludingCurrent[currentIndex - 1].title : 'None');
      console.log('Current article:', allArticlesIncludingCurrent[currentIndex].title);
      console.log('Next article:', currentIndex < allArticlesIncludingCurrent.length - 1 ? allArticlesIncludingCurrent[currentIndex + 1].title : 'None');
    }
    
    let prevArticle = null;
    let nextArticle = null;

    if (currentIndex > 0) {
      // Previous article is the one before current (older)
      prevArticle = allArticlesIncludingCurrent[currentIndex - 1];
    }
    
    if (currentIndex < allArticlesIncludingCurrent.length - 1) {
      // Next article is the one after current (newer)
      nextArticle = allArticlesIncludingCurrent[currentIndex + 1];
    }
    
    // Helper function to format article for response
    const formatArticleForNav = (article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: article.category,
      imageUrl: article.imageUrl,
      publishedAt: article.publishedAt
    });

    return NextResponse.json({
      success: true,
      data: {
        prev: prevArticle ? formatArticleForNav(prevArticle) : null,
        next: nextArticle ? formatArticleForNav(nextArticle) : null,
        current: {
          id: transformedCurrent.id,
          title: transformedCurrent.title,
          slug: transformedCurrent.slug,
          publishedAt: transformedCurrent.publishedAt
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