import { NextResponse } from 'next/server';
import { sponsorsServiceSSR } from '@/lib/services/sponsorsServiceSSR';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sponsors = await sponsorsServiceSSR.getActiveSponsors();
    return NextResponse.json({ success: true, data: sponsors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}