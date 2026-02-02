import { NextResponse, NextRequest } from 'next/server';
import { contentful, transformContentfulArticle } from '@/lib/contentful';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name: authorName } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '5');
    const excludeId = searchParams.get('excludeId');

    if (!authorName) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_AUTHOR_NAME',
        message: 'Author name is required'
      }, { status: 400 });
    }

    // Decode the author name from URL
    const decodedAuthorName = decodeURIComponent(authorName);
    
    console.log('=== Author Articles Debug ===');
    console.log('Author name param:', authorName);
    console.log('Decoded author name:', decodedAuthorName);
    console.log('Exclude ID:', excludeId);
    console.log('Limit:', limit);
    
    // Fetch all articles and filter by author
    const allArticlesResult = await contentful.getArticles({
      pageSize: 50, // Get more articles to filter from
      // Don't filter by featured - include all articles for author filtering
    });
    
    console.log('Total articles fetched from Contentful:', allArticlesResult.data.length);
    
    // Filter articles by the specific author (case-insensitive)
    const authorArticles = allArticlesResult.data
      .filter(article => {
        const fields = article.fields as any;
        const articleAuthor = fields.author;
        
        // Debug each article
        console.log('Article:', {
          id: article.sys.id,
          title: fields.title,
          author: articleAuthor,
          authorType: typeof articleAuthor,
          comparison: articleAuthor && typeof articleAuthor === 'string' ? articleAuthor.toLowerCase() === decodedAuthorName.toLowerCase() : false
        });
        
        // Case-insensitive comparison with null check and trim whitespace
        return articleAuthor && 
               typeof articleAuthor === 'string' && 
               articleAuthor.trim().toLowerCase() === decodedAuthorName.trim().toLowerCase();
      })
      .filter(article => {
        // Exclude the current article if excludeId is provided
        if (excludeId) {
          return article.sys.id !== excludeId;
        }
        return true;
      })
      .slice(0, limit)
      .map(transformContentfulArticle);
    
    console.log('Filtered author articles count:', authorArticles.length);

    // If no articles found, return empty array with success
    return NextResponse.json({
      success: true,
      data: {
        articles: authorArticles.map(article => ({
          id: article.id,
          title: article.title,
          description: article.description,
          slug: article.slug,
          category: article.category,
          game: article.game,
          author: article.author,
          authorAvatar: article.authorAvatar,
          imageUrl: article.imageUrl,
          publishedAt: article.publishedAt,
          tags: article.tags
        })),
        totalCount: authorArticles.length,
        author: decodedAuthorName,
        debug: {
          searchedAuthor: decodedAuthorName,
          totalArticles: allArticlesResult.data.length,
          foundArticles: authorArticles.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching author articles:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch author articles'
    }, { status: 500 });
  }
}