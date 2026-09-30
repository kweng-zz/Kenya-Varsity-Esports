import { NextRequest, NextResponse } from 'next/server';
import { paymentProviderFactory } from '@/lib/payments';
import { ticketService, EventTicketPurchase, EventTicketType, EventTicket } from '@/lib/tickets';
import { sendTicketConfirmationEmail } from '@/lib/email/ticketEmails';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const providerId = request.nextUrl.searchParams.get('provider') as 'stripe' | 'mpesa' | 'paystack' | null;
    const signature = request.headers.get('stripe-signature') || 
                      request.headers.get('x-paystack-signature') || 
                      request.headers.get('x-mpesa-signature') || '';

    const payload = await request.text();

    if (!providerId) {
      return NextResponse.json(
        { success: false, error: 'Provider parameter required' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = paymentProviderFactory.verifyWebhookSignature(payload, signature, providerId);
    if (!isValid) {
      console.error(`Invalid webhook signature for ${providerId}`);
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(payload);
    const parsed = paymentProviderFactory.parseWebhookEvent(event, providerId);

    if (!parsed) {
      return NextResponse.json({ success: true, message: 'Event not handled' });
    }

    const { paymentIntentId, status, data } = parsed;

    // Find purchase by payment reference
    const db = (await import('node-appwrite')).Databases;
    const client = new (await import('node-appwrite')).Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
      .setKey(process.env.APPWRITE_API_KEY || '');
    
    const databases = new db(client);
    const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';

    const purchaseResponse = await databases.listDocuments(
      DB_ID,
      'event_ticket_purchases',
      [
        (await import('node-appwrite')).Query.equal('paymentReference', paymentIntentId),
        (await import('node-appwrite')).Query.limit(1),
      ]
    );

    if (purchaseResponse.documents.length === 0) {
      console.warn(`No purchase found for payment intent: ${paymentIntentId}`);
      return NextResponse.json({ success: true, message: 'Purchase not found' });
    }

    const purchase = purchaseResponse.documents[0] as unknown as EventTicketPurchase;

    // Update purchase status based on payment status
    let newStatus = purchase.status;
    let newPaymentStatus = purchase.paymentStatus;

    switch (status) {
      case 'succeeded':
        newStatus = 'confirmed';
        newPaymentStatus = 'paid';
        break;
      case 'failed':
        newStatus = 'cancelled';
        newPaymentStatus = 'failed';
        break;
      case 'cancelled':
        newStatus = 'cancelled';
        newPaymentStatus = 'cancelled';
        break;
      case 'refunded':
        newStatus = 'refunded';
        newPaymentStatus = 'refunded';
        break;
      case 'processing':
      case 'pending':
        newStatus = 'pending';
        newPaymentStatus = 'pending';
        break;
    }

    if (newStatus !== purchase.status || newPaymentStatus !== purchase.paymentStatus) {
      await databases.updateDocument(
        DB_ID,
        'event_ticket_purchases',
        purchase.$id,
        {
          status: newStatus,
          paymentStatus: newPaymentStatus,
          paymentDetails: JSON.stringify(data),
          ...(newPaymentStatus === 'paid' && { paidAt: new Date().toISOString() }),
          ...(newStatus === 'cancelled' && { cancelledAt: new Date().toISOString() }),
          ...(newStatus === 'refunded' && { refundedAt: new Date().toISOString() }),
        }
      );

      // If payment failed/cancelled, release reserved tickets
      if (['failed', 'cancelled'].includes(newPaymentStatus)) {
        await ticketService.releaseReservedTickets(purchase.eventTicketTypeId, purchase.quantity);
      }

      // If payment succeeded and was previously reserved, generate ticket codes and send email
      if (newPaymentStatus === 'paid' && purchase.status !== 'confirmed') {
        // Get ticket type for code generation
        const ticketTypeResponse = await databases.getDocument(
          DB_ID,
          'event_ticket_types',
          purchase.eventTicketTypeId
        );
        const ticketType = ticketTypeResponse as unknown as EventTicketType;
        const ticketCodes = ticketService.generateTicketCodes(purchase, ticketType);
        
        await databases.updateDocument(
          DB_ID,
          'event_ticket_purchases',
          purchase.$id,
          {
            tickets: JSON.stringify(ticketCodes),
          }
        );

        // Get event ticket details for email
        const eventTicketResponse = await databases.getDocument(
          DB_ID,
          'event_tickets',
          purchase.eventTicketId
        );
        const eventTicket = eventTicketResponse as unknown as EventTicket;

        // Send e-ticket email
        await sendTicketConfirmationEmail({
          userEmail: purchase.userEmail,
          userName: purchase.userName,
          eventTitle: eventTicket.eventTitle,
          eventDate: eventTicket.salesStartDate ? new Date(eventTicket.salesStartDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'TBA',
          eventVenue: 'Nairobi Convention Center, Kenya', // Could be stored in event_tickets
          ticketTypeName: ticketType.name,
          quantity: purchase.quantity,
          ticketCodes,
          purchaseId: purchase.purchaseId,
          confirmationCode: purchase.confirmationCode || `CONF-${purchase.purchaseId}`,
          totalAmount: purchase.totalAmount,
          currency: purchase.currency,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Payment webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}