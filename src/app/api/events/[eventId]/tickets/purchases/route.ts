import { NextRequest, NextResponse } from 'next/server';
import { ticketService } from '@/lib/tickets';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const purchases = await ticketService.getUserPurchases(userId);

    // Filter by event if needed
    const { eventId } = await params;
    let eventTicket = await ticketService.getEventTicket(eventId);
    if (!eventTicket) {
      eventTicket = await ticketService.getEventTicketBySlug(eventId);
    }

    let filteredPurchases = purchases;
    if (eventTicket) {
      filteredPurchases = purchases.filter(p => p.eventTicketId === eventTicket.$id);
    }

    return NextResponse.json({
      success: true,
      data: filteredPurchases.map(p => ({
        purchaseId: p.purchaseId,
        confirmationCode: p.confirmationCode,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        totalAmount: p.totalAmount,
        currency: p.currency,
        status: p.status,
        paymentStatus: p.paymentStatus,
        paymentMethod: p.paymentMethod,
        purchasedAt: p.purchasedAt,
        paidAt: p.paidAt,
        ticketTypeName: p.metadata ? JSON.parse(p.metadata).ticketTypeName : undefined,
      })),
    });
  } catch (error: unknown) {
    console.error('User purchases API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}