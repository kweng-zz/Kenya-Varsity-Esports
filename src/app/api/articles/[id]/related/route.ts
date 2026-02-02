import { NextResponse, NextRequest } from 'next/server';
import { contentful, transformContentfulArticle } from '@/lib/contentful';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!articleId) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ARTICLE_ID',
        message: 'Article ID is required'
      }, { status: 400 });
    }

    // First, get the current article to extract its metadata
    const currentArticle = await contentful.getArticleBySlug(articleId);
    
    if (!currentArticle) {
      return NextResponse.json({
        success: false,
        error: 'ARTICLE_NOT_FOUND',
        message: 'Article not found'
      }, { status: 404 });
    }

    const transformedCurrent = transformContentfulArticle(currentArticle);
    const currentCategory = transformedCurrent.category;
    const currentGame = transformedCurrent.game;
    const currentTags = transformedCurrent.tags;
    const currentAuthor = transformedCurrent.author;

    // Build query for related articles
    let relatedArticles: any[] = [];

    // Strategy 1: Same category
    if (currentCategory) {
      const categoryResult = await contentful.getArticles({
        category: currentCategory,
        pageSize: limit + 1, // +1 to exclude current article
        featured: false
      });
      
      // Filter out current article and transform
      const categoryArticles = categoryResult.data
        .filter(article => article.sys.id !== currentArticle.sys.id)
        .slice(0, limit)
        .map(transformContentfulArticle);
      
      relatedArticles = relatedArticles.concat(categoryArticles);
    }

    // Strategy 2: Same game (if not enough from category)
    if (relatedArticles.length < limit && currentGame) {
      const gameResult = await contentful.getArticles({
        game: currentGame,
        pageSize: limit - relatedArticles.length + 1,
        featured: false
      });
      
      const gameArticles = gameResult.data
        .filter(article => 
          article.sys.id !== currentArticle.sys.id &&
          !relatedArticles.some(related => related.id === article.sys.id)
        )
        .slice(0, limit - relatedArticles.length)
        .map(transformContentfulArticle);
      
      relatedArticles = relatedArticles.concat(gameArticles);
    }

    // Strategy 3: Same tags (if still not enough)
    if (relatedArticles.length < limit && currentTags.length > 0) {
      // Try to find articles with matching tags
      for (const tag of currentTags.slice(0, 2)) { // Limit to first 2 tags
        if (relatedArticles.length >= limit) break;
        
        const tagResult = await contentful.getArticles({
          pageSize: limit - relatedArticles.length + 1,
          featured: false
        });
        
        const tagArticles = tagResult.data
          .filter(article => 
            article.sys.id !== currentArticle.sys.id &&
            !relatedArticles.some(related => related.id === article.sys.id) &&
            (article.fields as any).tags?.includes(tag)
          )
          .slice(0, limit - relatedArticles.length)
          .map(transformContentfulArticle);
        
        relatedArticles = relatedArticles.concat(tagArticles);
      }
    }

    // Strategy 4: Same author (last resort)
    if (relatedArticles.length < limit && currentAuthor) {
      const authorResult = await contentful.getArticles({
        pageSize: limit - relatedArticles.length + 1,
        featured: false
      });
      
      const authorArticles = authorResult.data
        .filter(article => 
          article.sys.id !== currentArticle.sys.id &&
          !relatedArticles.some(related => related.id === article.sys.id) &&
          (article.fields as any).author === currentAuthor
        )
        .slice(0, limit - relatedArticles.length)
        .map(transformContentfulArticle);
      
      relatedArticles = relatedArticles.concat(authorArticles);
    }

    // Limit final results
    relatedArticles = relatedArticles.slice(0, limit);

    // If still no related articles, get latest articles as fallback
    if (relatedArticles.length === 0) {
      const latestResult = await contentful.getArticles({
        pageSize: limit,
        featured: false
      });
      
      relatedArticles = latestResult.data
        .filter(article => article.sys.id !== currentArticle.sys.id)
        .slice(0, limit)
        .map(transformContentfulArticle);
    }

    return NextResponse.json({
      success: true,
      data: {
        relatedArticles: relatedArticles.map(article => ({
          id: article.id,
          title: article.title,
          description: article.description,
          slug: article.slug,
          category: article.category,
          game: article.game,
          author: article.author,
          imageUrl: article.imageUrl,
          publishedAt: article.publishedAt,
          tags: article.tags
        })),
        totalCount: relatedArticles.length
      }
    });

  } catch (error) {
    console.error('Error fetching related articles:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch related articles'
    }, { status: 500 });
  }
}