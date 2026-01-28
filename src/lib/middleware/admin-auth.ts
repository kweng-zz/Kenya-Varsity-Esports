import { NextRequest, NextResponse } from 'next/server';
import { getSessionClient } from '@/lib/appwrite-server';

/**
 * Middleware to verify admin authentication
 * @param request - The incoming request
 * @returns NextResponse with user data or error
 */
export async function verifyAdminAuth(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get session client with JWT
    const sessionClient = getSessionClient(sessionToken);
    
    if (!sessionClient) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Invalid session token' },
        { status: 401 }
      );
    }

    // Verify session with Appwrite
    const user = await sessionClient.account.get();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Invalid session' },
        { status: 401 }
      );
    }

    // Check if user has admin profile
    const profile = await sessionClient.databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!,
      user.$id
    ).catch(() => null);

    if (!profile || !profile.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Return user data for use in protected routes
    return { user, profile };

  } catch (error) {
    console.error('Admin auth verification failed:', error);
    return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED', message: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Higher-order function to protect admin routes
 * @param handler - The route handler function
 * @returns Protected route handler
 */
export function withAdminAuth(handler: (request: NextRequest, context: { user: any, profile: any }) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = await verifyAdminAuth(request);
    
    // If authResult is a NextResponse (error), return it
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    // If authResult contains user data, proceed with handler
    return handler(request, authResult as { user: any, profile: any });
  };
}