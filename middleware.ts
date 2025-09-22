// Middleware to handle Strapi admin panel errors
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle Strapi admin panel requests
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.searchParams.has('documentId')) {
    
    // Check if this is a content-manager preview request
    if (request.nextUrl.pathname.includes('content-manager')) {
      console.warn('Blocking direct content-manager access:', request.nextUrl.pathname);
      
      // Redirect to the proper admin panel or return 404
      return NextResponse.redirect(new URL('/admin/blogs', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/strapi/:path*'
  ]
};
