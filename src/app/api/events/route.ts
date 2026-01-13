import { NextResponse } from 'next/server';
import { eventsServiceSSR } from '@/lib/services/eventsServiceSSR';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'OPEN' | 'LEAGUE' | 'PRO' | null;
    const featured = searchParams.get('featured') === 'true';

    let events;
    if (featured) {
      const event = await eventsServiceSSR.getFeaturedEvent();
      events = event ? [event] : [];
    } else if (status) {
      // Note: We might need to update eventsServiceSSR to support status filters
      // For now, let's fetch active and filter
      const active = await eventsServiceSSR.getActiveEvents();
      events = active.filter(e => e.status === status);
    } else {
      events = await eventsServiceSSR.getActiveEvents();
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
