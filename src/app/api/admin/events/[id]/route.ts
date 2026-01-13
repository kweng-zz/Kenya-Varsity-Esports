import { NextResponse } from 'next/server';
import { eventsService } from '@/lib/services/eventsService';
import { getUserFromRequest } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// PUT update event (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user?.labels?.includes('admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const eventData = await request.json();

    const updatedEvent = await eventsService.updateEvent(id, eventData);

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
    const user = await getUserFromRequest(request);
    
    if (!user?.labels?.includes('admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await eventsService.deleteEvent(id);

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
