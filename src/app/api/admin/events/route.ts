import { NextResponse } from 'next/server';
import { eventsServiceSSR } from '@/lib/services/eventsServiceSSR';

export const dynamic = 'force-dynamic';

// GET all events (admin only)
export async function GET(request: Request) {
  try {

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

    const eventData = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'gameSlug', 'image', 'date', 'time', 'prizePool', 'entryFee', 'status'];
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
