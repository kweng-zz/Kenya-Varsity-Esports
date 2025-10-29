//src/app/api/contentful/articles/[id]/route.ts
// DEPRECATED: This route is deprecated. Use /api/contentful/articles/update?id=<id> instead.
// This file is kept for backward compatibility and redirects to the new endpoint.

import { NextRequest, NextResponse } from 'next/server';

// Dynamic route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/contentful/articles/[id]
 * Retrieve a single article by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    console.log('GET request for article:', id);
    
    return NextResponse.json({
      success: true,
      message: 'Article endpoint is working',
      data: {
        id,
        method: 'GET',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process GET request'
    }, { status: 500 });
  }
}

/**
 * PUT /api/contentful/articles/[id]
 * DEPRECATED: Use /api/contentful/articles/update?id=<id> instead
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  console.log('PUT request to deprecated endpoint, redirecting to /api/contentful/articles/update?id=' + id);
  
  // Redirect to the new endpoint
  const newUrl = new URL(request.url);
  newUrl.pathname = '/api/contentful/articles/update';
  newUrl.searchParams.set('id', id);
  
  return NextResponse.redirect(newUrl, { status: 307 });
}

/**
 * DELETE /api/contentful/articles/[id]
 * DEPRECATED: Use /api/contentful/articles/update?id=<id> instead
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  console.log('DELETE request to deprecated endpoint, redirecting to /api/contentful/articles/update?id=' + id);
  
  // Redirect to the new endpoint
  const newUrl = new URL(request.url);
  newUrl.pathname = '/api/contentful/articles/update';
  newUrl.searchParams.set('id', id);
  
  return NextResponse.redirect(newUrl, { status: 307 });
}

/**
 * PATCH /api/contentful/articles/[id]
 * DEPRECATED: Use /api/contentful/articles/update?id=<id> instead
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  console.log('PATCH request to deprecated endpoint, redirecting to /api/contentful/articles/update?id=' + id);
  
  // Redirect to the new endpoint
  const newUrl = new URL(request.url);
  newUrl.pathname = '/api/contentful/articles/update';
  newUrl.searchParams.set('id', id);
  
  return NextResponse.redirect(newUrl, { status: 307 });
}

/**
 * OPTIONS /api/contentful/articles/[id]
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
