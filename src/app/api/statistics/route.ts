import { NextResponse } from 'next/server';
import { getStatistics } from '@/lib/statistics';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const STATISTICS_DIR = resolve(process.cwd(), 'content/statistics');
const STATISTICS_FILE = join(STATISTICS_DIR, 'season-stats.md');

function writeStatisticsData(data: {
  seasonTitle: string;
  image: string;
  seasonNumber: number;
  stats: { id: string; number: string; label: string }[];
}): void {
  if (!existsSync(STATISTICS_DIR)) {
    require('fs').mkdirSync(STATISTICS_DIR, { recursive: true });
  }

  const fileContent = matter.stringify('', data);
  writeFileSync(STATISTICS_FILE, fileContent, 'utf-8');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const statistics = getStatistics();
    
    return NextResponse.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.stats || !Array.isArray(body.stats)) {
      return NextResponse.json(
        { success: false, error: 'Invalid stats data' },
        { status: 400 }
      );
    }
    
    const data = {
      seasonTitle: body.seasonTitle || 'STATISTICS OF SEASON 3',
      image: body.image || '/images/Join our tournaments.png',
      seasonNumber: body.seasonNumber || 3,
      stats: body.stats,
    };
    
    writeStatisticsData(data);
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error updating statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update statistics' },
      { status: 500 }
    );
  }
}