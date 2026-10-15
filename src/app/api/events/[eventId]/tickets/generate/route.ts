import { NextRequest, NextResponse } from 'next/server';
import { ticketService } from '@/lib/tickets';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    
    const { purchaseId, confirmationCode } = body;

    let purchase: any;
    
    if (purchaseId) {
      purchase = await ticketService.getPurchaseById(purchaseId);
    } else if (confirmationCode) {
      purchase = await ticketService.getPurchaseByConfirmationCode(confirmationCode);
    } else {
      return NextResponse.json(
        { success: false, error: 'Purchase ID or confirmation code required' },
        { status: 400 }
      );
    }

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: 'Purchase not found' },
        { status: 404 }
      );
    }

    // Get the ticket type details
    const ticketTypeDetails = await ticketService.getTicketTypeById(purchase.eventTicketTypeId);

    // Get event ticket details
    const eventTicket = await ticketService.getEventTicketById(purchase.eventTicketId);

    // Generate e-ticket data - safely handle null eventTicket
    const safeEventTicket = eventTicket ? eventTicket : { startDate: '' } as any;
    const eticketData = ticketService.generateETicketData(purchase, ticketTypeDetails || ({ name: 'TKT' } as any), safeEventTicket);

    return NextResponse.json({
      success: true,
      data: {
        eticket: eticketData,
        message: 'E-ticket generated successfully',
      },
    });
  } catch (error: unknown) {
    console.error('E-ticket generation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate e-ticket' },
      { status: 500 }
    );
  }
}