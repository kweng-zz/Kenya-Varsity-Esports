import { NextRequest, NextResponse } from 'next/server';
import { ticketService } from '@/lib/tickets';
import { paymentProviderFactory } from '@/lib/payments';
import { calculateOrderTotal, fromSubunits } from '@/lib/pricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const body = await request.json();
    const { purchaseId, confirmationCode, paymentIntentId, paymentMethod } = body;

    let purchase;

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

    // If payment intent ID provided, verify with payment provider
    if (paymentIntentId && paymentMethod) {
      const provider = paymentProviderFactory.getProvider(paymentMethod as 'stripe' | 'mpesa' | 'paystack');
      if (provider) {
        const paymentIntent = await provider.getPaymentIntent(paymentIntentId);
        if (paymentIntent) {
          // Update purchase status based on payment status
          let newStatus = purchase.status;
          let newPaymentStatus = purchase.paymentStatus;

          if (paymentIntent.status === 'succeeded') {
            // Verify amount matches expected total
            const expectedTotal = purchase.totalAmount;
            const paidAmount = paymentIntent.amount;
            
            if (Math.abs(paidAmount - expectedTotal) > 1) {
              console.error(`Amount mismatch: expected ${expectedTotal}, got ${paidAmount}`);
              newStatus = 'cancelled';
              newPaymentStatus = 'failed';
            } else {
              newStatus = 'confirmed';
              newPaymentStatus = 'paid';
            }
          } else if (paymentIntent.status === 'failed') {
            newStatus = 'cancelled';
            newPaymentStatus = 'failed';
          } else if (paymentIntent.status === 'cancelled') {
            newStatus = 'cancelled';
            newPaymentStatus = 'cancelled';
          } else if (paymentIntent.status === 'refunded') {
            newStatus = 'refunded';
            newPaymentStatus = 'refunded';
          }

          if (newStatus !== purchase.status || newPaymentStatus !== purchase.paymentStatus) {
            await ticketService.updatePurchaseStatus(
              purchase.$id,
              newStatus,
              newPaymentStatus,
              paymentIntent.providerReference || paymentIntentId,
              JSON.stringify(paymentIntent)
            );
            purchase.status = newStatus;
            purchase.paymentStatus = newPaymentStatus;
            purchase.paidAt = paymentIntent.status === 'succeeded' ? new Date().toISOString() : purchase.paidAt;
          }
        }
      }
    }

    // Generate ticket codes if not already generated
    let ticketCodes: string[] = [];
    if (purchase.tickets) {
      try {
        ticketCodes = JSON.parse(purchase.tickets);
      } catch {
        ticketCodes = [];
      }
    }

    if (ticketCodes.length === 0 && purchase.status === 'confirmed') {
      // Get ticket type for code generation
      const db = (await import('node-appwrite')).Databases;
      // We'll generate codes here
      const ticketTypeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/databases/${process.env.NEXT_PUBLIC_APPWRITE_DB_ID}/collections/event_ticket_types/documents/${purchase.eventTicketTypeId}`,
        {
          headers: {
            'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY || '',
          },
        }
      );
      
      if (ticketTypeResponse.ok) {
        const ticketType = await ticketTypeResponse.json();
        ticketCodes = ticketService.generateTicketCodes(purchase, ticketType);
        // Update purchase with ticket codes
        // Note: In production, you'd update the document here
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        purchase: {
          purchaseId: purchase.purchaseId,
          confirmationCode: purchase.confirmationCode,
          quantity: purchase.quantity,
          totalAmount: purchase.totalAmount,
          currency: purchase.currency,
          status: purchase.status,
          paymentStatus: purchase.paymentStatus,
          purchasedAt: purchase.purchasedAt,
          paidAt: purchase.paidAt,
          ticketCodes,
        },
      },
    });
  } catch (error: unknown) {
    console.error('Ticket verification API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify ticket' },
      { status: 500 }
    );
  }
}