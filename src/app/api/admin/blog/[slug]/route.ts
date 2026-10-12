import { NextResponse } from 'next/server';
import { getPostBySlug, savePost, deletePost } from '@/lib/blog';
import { checkAdminAuth } from '@/lib/auth-check';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await checkAdminAuth(request as any);
  if (authError) return authError;

  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug, true);
    
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
  const authError = await checkAdminAuth(request as any);
  if (authError) return authError;

  try {
    const { slug } = await params;
    const body = await request.json();
    
    const existingPost = await getPostBySlug(slug, true);
    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = {
      ...existingPost,
      ...body,
      slug: body.slug || slug,
      updatedAt: new Date().toISOString(),
    };

    await savePost(updatedPost);
    
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
  const authError = await checkAdminAuth(request as any);
  if (authError) return authError;

  try {
    const { slug } = await params;
    
    const existingPost = await getPostBySlug(slug, true);
    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    await deletePost(slug);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Blog Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}