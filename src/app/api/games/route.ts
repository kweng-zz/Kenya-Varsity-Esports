import { NextResponse } from 'next/server';
import { getActiveGames } from '@/lib/games';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const games = getActiveGames();
    
    return NextResponse.json({
      success: true,
      data: games,
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}