import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addSecurityHeaders, securityMiddleware } from './lib/security';

export function proxy(request: NextRequest) {
  // 1. Run security middleware (IP blocking, CSRF)
  const securityResponse = securityMiddleware(request);
  if (securityResponse) return securityResponse;

  // 2. Handle Strapi admin panel requests
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.searchParams.has('documentId')) {
    
    if (request.nextUrl.pathname.includes('content-manager')) {
      return addSecurityHeaders(NextResponse.redirect(new URL('/admin/blogs', request.url)));
    }
  }

  // 3. Apply standard response with security headers
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};
