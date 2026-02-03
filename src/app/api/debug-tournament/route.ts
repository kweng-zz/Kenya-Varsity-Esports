import { NextResponse } from 'next/server';
import { tournamentServiceSSR } from '@/lib/services/tournamentServiceSSR';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'efootball-mobile';
  
  try {
    const tournament = await tournamentServiceSSR.getTournamentBySlug(slug);
    
    return NextResponse.json({
      slug,
      found: !!tournament,
      data: tournament,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
