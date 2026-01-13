import { NextResponse } from 'next/server';
import { eventsService } from '@/lib/services/eventsService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'OPEN' | 'LEAGUE' | 'PRO' | null;

    let events;
    if (status) {
      events = await eventsService.getEventsByStatus(status);
    } else {
      events = await eventsService.getActiveEvents();
    }

    return NextResponse.json({
      success: true,
      data: events
    });
  } catch (error: any) {
    console.error('Events API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch events'
      },
      { status: 500 }
    );
  }
}
