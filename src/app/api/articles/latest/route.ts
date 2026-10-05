import { NextResponse } from 'next/server';
import { getFeaturedArticles, getAllPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '2', 10);
    const includeDrafts = searchParams.get('includeDrafts') === 'true';
    
    // First try to get featured articles
    const featuredPosts = getFeaturedArticles(limit, true);
    
    let postsToReturn = featuredPosts;
    
    // If no featured posts, get the most recent posts
    if (featuredPosts.length === 0) {
      const allPostsResponse = getAllPosts({
        pageSize: limit,
        includeDrafts: true,
      });
      postsToReturn = allPostsResponse.data;
    }
    
    const formattedPosts = postsToReturn.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      category: post.category,
      date: post.publishedAt,
      slug: post.slug,
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedPosts,
    });
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}