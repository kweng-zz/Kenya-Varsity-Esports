import { NextResponse } from 'next/server';
import { eventsServiceSSR } from '@/lib/services/eventsServiceSSR';
import { getUserFromRequest } from '@/lib/auth-utils';
import { databases, DATABASE_ID } from '@/lib/appwrite';

export const dynamic = 'force-dynamic';

// GET all events (admin only)
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin status
    const profileCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID;
    if (!profileCollectionId) {
      console.error('Profile collection ID not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    try {
      const profile = await databases.getDocument(
        DATABASE_ID,
        profileCollectionId,
        user.$id
      );

      if (!profile.isAdmin) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: Admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to verify admin status' },
        { status: 500 }
      );
    }

    const events = await eventsServiceSSR.getAllEvents();

    return NextResponse.json({
      success: true,
      data: events
    });
  } catch (error: any) {
    console.error('Admin events GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new event (admin only)
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin status
    const profileCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID;
    if (!profileCollectionId) {
      console.error('Profile collection ID not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    try {
      const profile = await databases.getDocument(
        DATABASE_ID,
        profileCollectionId,
        user.$id
      );

      if (!profile.isAdmin) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: Admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to verify admin status' },
        { status: 500 }
      );
    }

    const eventData = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'gameSlug', 'image', 'date', 'time', 'prizePool', 'status'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Ensure tags is an array
    if (!eventData.tags || !Array.isArray(eventData.tags)) {
      eventData.tags = [];
    }

    // Set isActive to true by default
    if (typeof eventData.isActive !== 'boolean') {
      eventData.isActive = true;
    }

    // If making this event featured, unset others
    if (eventData.isFeatured) {
      const allEvents = await eventsServiceSSR.getAllEvents();
      await Promise.all(
        allEvents
          .filter(e => e.isFeatured)
          .map(e => eventsServiceSSR.updateEvent(e.$id, { isFeatured: false }))
      );
    }

    const newEvent = await eventsServiceSSR.createEvent(eventData);

    return NextResponse.json({
      success: true,
      data: newEvent
    });
  } catch (error: any) {
    console.error('Admin events POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
