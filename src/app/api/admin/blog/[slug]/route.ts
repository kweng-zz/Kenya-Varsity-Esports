import { NextResponse } from 'next/server';
import { getPostBySlug, savePost, deletePost } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  try {
    const { slug } = await params;
    const post = getPostBySlug(slug, true);
    
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error('Admin Blog Get error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { savePost, getPostBySlug } = await import('@/lib/blog');
    
    const existingPost = getPostBySlug(slug, true);
    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = {
      ...existingPost,
      ...body,
      slug: body.slug || slug,
      updatedAt: new Date().toISOString(),
    };

    savePost(updatedPost);
    
    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error: any) {
    console.error('Admin Blog Update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  try {
    const { slug } = await params;
    const { getPostBySlug, deletePost } = await import('@/lib/blog');
    
    const existingPost = getPostBySlug(slug, true);
    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    deletePost(slug);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Blog Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}