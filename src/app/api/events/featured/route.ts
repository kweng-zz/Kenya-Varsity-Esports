import { NextResponse } from 'next/server';
import { eventsServiceSSR } from '@/lib/services/eventsServiceSSR';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const featuredEvent = await eventsServiceSSR.getFeaturedEvent();

    if (!featuredEvent) {
      return NextResponse.json({
        success: false,
        error: 'No featured event found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: featuredEvent
    });
  } catch (error: any) {
    console.error('Featured Event API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch featured event'
      },
      { status: 500 }
    );
  }
}
