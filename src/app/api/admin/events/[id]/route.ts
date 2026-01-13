import { NextResponse } from 'next/server';
import { eventsServiceSSR } from '@/lib/services/eventsServiceSSR';

export const dynamic = 'force-dynamic';

// PUT update event (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // If making this event featured, unset others
    if (body.isFeatured) {
      const allEvents = await eventsServiceSSR.getAllEvents();
      await Promise.all(
        allEvents
          .filter(e => e.isFeatured && e.$id !== id)
          .map(e => eventsServiceSSR.updateEvent(e.$id, { isFeatured: false }))
      );
    }

    const updatedEvent = await eventsServiceSSR.updateEvent(id, body);

    return NextResponse.json({
      success: true,
      data: updatedEvent
    });
  } catch (error: any) {
    console.error('Admin event PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE event (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await eventsServiceSSR.deleteEvent(id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error: any) {
    console.error('Admin event DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
