import { NextRequest, NextResponse } from 'next/server';
import { paymentProviderFactory } from '@/lib/payments';
import { ticketService, EventTicketPurchase, deliverPurchaseTickets } from '@/lib/tickets';

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

    const { paymentIntentId, status, data: webhookData } = parsed;

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
      case 'succeeded': {
        // Providers parse webhook events into a consistent `amount` in main currency units
        const paidAmount = typeof webhookData?.amount === 'number' && webhookData.amount > 0
          ? webhookData.amount
          : null;
        const expectedTotal = purchase.totalAmount;

        if (paidAmount === null) {
          console.warn(`Webhook for ${paymentIntentId} has no payable amount, skipping amount check`);
          newStatus = 'confirmed';
          newPaymentStatus = 'paid';
        } else if (Math.abs(paidAmount - expectedTotal) > 1) {
          console.error(`Webhook amount mismatch: expected ${expectedTotal}, got ${paidAmount}`);
          newStatus = 'cancelled';
          newPaymentStatus = 'failed';
        } else {
          newStatus = 'confirmed';
          newPaymentStatus = 'paid';
        }
        break;
      }
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
          paymentDetails: JSON.stringify(webhookData),
          ...(newPaymentStatus === 'paid' && { paidAt: new Date().toISOString() }),
          ...(newStatus === 'cancelled' && { cancelledAt: new Date().toISOString() }),
          ...(newStatus === 'refunded' && { refundedAt: new Date().toISOString() }),
        }
      );

      // If payment failed/cancelled, release reserved tickets
      if (['failed', 'cancelled'].includes(newPaymentStatus)) {
        await ticketService.releaseReservedTickets(purchase.eventTicketTypeId, purchase.quantity);
      }

      // If payment succeeded, generate ticket codes and email the e-tickets
      if (newPaymentStatus === 'paid' && purchase.status !== 'confirmed') {
        const delivery = await deliverPurchaseTickets(purchase);
        if (!delivery.emailSent) {
          console.error(
            `Ticket email not sent for purchase ${purchase.purchaseId}: ${delivery.emailError || 'unknown error'}`
          );
        }
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