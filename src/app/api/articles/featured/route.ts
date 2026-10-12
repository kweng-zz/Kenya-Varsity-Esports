import { NextResponse } from 'next/server';
import { getFeaturedArticles } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const featuredArticles = await getFeaturedArticles(1, true);
    
    if (featuredArticles.length > 0) {
      return NextResponse.json({
        success: true,
        data: featuredArticles[0],
      });
    }
    
    return NextResponse.json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error('Error fetching featured article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured article' },
      { status: 500 }
    );
  }
}