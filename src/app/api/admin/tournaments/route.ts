// src/app/api/admin/tournaments/route.ts
/**
 * Tournament Management API (Admin)
 * GET: List tournaments with filters
 * POST: Create new tournament
 */

import { NextRequest, NextResponse } from 'next/server';
import { tournamentManagement } from '@/lib/services/tournamentManagement';
import { checkRateLimit } from '@/lib/redis-rate-limit';

/**
 * GET /api/admin/tournaments
 * List all tournaments with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      status: searchParams.get('status') as 'draft' | 'published' | 'archived' | undefined,
      tournamentStatus: searchParams.get('tournamentStatus') as any,
      gameName: searchParams.get('gameName') || undefined,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: Math.min(100, parseInt(searchParams.get('pageSize') || '20', 10)),
    };

    const result = await tournamentManagement.list(filters);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('[Admin Tournaments API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/tournaments
 * Create a new tournament
 */
export async function POST(request: NextRequest) {
  // Rate limit
  const rateLimitResponse = await checkRateLimit(request, 'ADMIN');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // TODO: Add admin authentication
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    // }

    const body = await request.json();

    // Validate required fields
    if (!body.slug || !body.gameName) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR', message: 'slug and gameName are required' },
        { status: 400 }
      );
    }

    const result = await tournamentManagement.create({
      slug: body.slug,
      gameName: body.gameName,
      title: body.title,
      description: body.description,
      detailedDescription: body.detailedDescription,
      category: body.category,
      featuredImageUrl: body.featuredImageUrl,
      bannerImageUrl: body.bannerImageUrl,
      startDate: body.startDate,
      endDate: body.endDate,
      registrationStartDate: body.registrationStartDate,
      registrationEndDate: body.registrationEndDate,
      format: body.format,
      maxParticipants: body.maxParticipants,
      prizePool: body.prizePool,
      currency: body.currency,
      rules: body.rules,
      requirements: body.requirements,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'CREATE_FAILED', message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.tournament,
    }, { status: 201 });

  } catch (error) {
    console.error('[Admin Tournaments API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
