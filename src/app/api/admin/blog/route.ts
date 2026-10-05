import { NextResponse } from 'next/server';
import { getAllPosts, getCategories, getGames, getAuthors } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || undefined;

    const result = getAllPosts({
      page,
      pageSize,
      search,
      includeDrafts: true,
    });

    const [categories, games, authors] = await Promise.all([
      getCategories(),
      getGames(),
      getAuthors(),
    ]);

    return NextResponse.json({
      success: true,
      data: result.data,
      meta: result.meta,
      categories,
      games,
      authors,
    });
  } catch (error: any) {
    console.error('Admin Blogs API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { savePost } = await import('@/lib/blog');
    
    savePost(body);
    
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    console.error('Admin Blog Create error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create blog post' },
      { status: 500 }
    );
  }
}