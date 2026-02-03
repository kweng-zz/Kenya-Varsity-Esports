import { NextResponse } from 'next/server';
import { listmonkService } from '@/lib/listmonk';

export async function GET() {
  try {
    const result = await listmonkService.testConnection();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Listmonk connection successful',
        data: result.data
      });
    }

    return NextResponse.json({
      success: false,
      error: result.error || 'Connection failed'
    }, { status: 500 });

  } catch (error: any) {
    console.error('Newsletter test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Connection test failed'
    }, { status: 500 });
  }
}
