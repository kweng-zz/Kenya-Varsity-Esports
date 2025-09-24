import { NextRequest, NextResponse } from 'next/server';
import { strapiAPI, transformStrapiArticle } from '@/lib/strapi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const category = searchParams.get('category') || undefined;
    const game = searchParams.get('game') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '0');

    // Fetch articles from Strapi
    const response = await strapiAPI.getArticles({
      page,
      pageSize: limit > 0 ? limit : pageSize,
      featured,
      category,
      game,
      search,
      populate: ['image']
    });

    // Transform articles
    const transformedArticles = response.data.map(transformStrapiArticle);

    return NextResponse.json({
      success: true,
      articles: transformedArticles,
      pagination: response.meta?.pagination
    });

  } catch (error) {
    console.error('Error fetching articles from Strapi:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch articles',
      articles: []
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 });
}