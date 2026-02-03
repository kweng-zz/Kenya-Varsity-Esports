import { NextResponse } from 'next/server';
import { listmonkService } from '@/lib/listmonk';

export async function GET() {
  // Check environment variables
  const listmonkUrl = process.env.LISTMONK_URL;
  const listmonkUsername = process.env.LISTMONK_USERNAME;
  const listmonkPassword = process.env.LISTMONK_PASSWORD;

  if (!listmonkUrl || !listmonkUsername || !listmonkPassword) {
    return NextResponse.json({
      success: false,
      error: 'Listmonk environment variables are not configured'
    }, { status: 500 });
  }

  try {
    const stats = await listmonkService.getListStats();

    if (stats) {
      return NextResponse.json({
        success: true,
        data: stats
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stats'
    }, { status: 500 });

  } catch (error: any) {
    console.error('Newsletter stats error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch stats'
    }, { status: 500 });
  }
}
