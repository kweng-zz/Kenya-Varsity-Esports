import { NextRequest, NextResponse } from 'next/server';
import { Models } from 'appwrite';
import { getSessionClient } from '@/lib/appwrite-server';

/**
 * Simple authentication check for admin routes
 * @param request - The incoming request
 * @returns NextResponse with error if not authenticated, null if authenticated
 */
export async function checkAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('appwrite-session')?.value;

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
    let user: Models.User<Record<string, unknown>> | null = null;
    try {
      user = await sessionClient.account.get();
    } catch (sessionError: any) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Invalid session or guest user' },
        { status: 401 }
      );
    }
    
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

    // Authentication passed
    return null;

  } catch (error) {
    console.error('Admin auth verification failed:', error);
    return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED', message: 'Authentication failed' },
      { status: 401 }
    );
  }
}