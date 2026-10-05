import { NextResponse } from 'next/server';
import { getAllPosts, getCategories, getGames } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const category = searchParams.get('category') || undefined;
    const game = searchParams.get('game') || undefined;
    const search = searchParams.get('search') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : 
                     searchParams.get('featured') === 'false' ? false : undefined;
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    const result = getAllPosts({
      page,
      pageSize,
      category,
      game,
      search,
      featured,
      includeDrafts,
    });

    const [categories, games] = await Promise.all([
      getCategories(),
      getGames(),
    ]);

    return NextResponse.json({
      success: true,
      data: result.data,
      meta: result.meta,
      categories,
      games,
    });
  } catch (error: any) {
    console.error('Blogs API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}