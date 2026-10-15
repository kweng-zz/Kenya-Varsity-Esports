import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID, Query, Permission, Role } from 'node-appwrite';
import { ticketService, EventTicketType, EventTicket } from '@/lib/tickets';
import { paymentProviderFactory } from '@/lib/payments';
import { calculateOrderTotal } from '@/lib/pricing';

// Lazy init
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    if (!endpoint || !projectId || !apiKey) return null;
    try {
      client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
      databases = new Databases(client);
    } catch { return null; }
  }
  return databases;
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const EVENT_TICKET_PURCHASES_COLLECTION = 'event_ticket_purchases';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    
    const {
      ticketTypeId,
      quantity,
      userId,
      userEmail,
      userName,
      userPhone,
      paymentMethod,
      returnUrl,
      cancelUrl,
      metadata,
    } = body;

    // Validate required fields
    if (!ticketTypeId || !quantity || !userId || !userEmail || !userName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Get the ticket type details
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    let ticketTypeResponse;
    try {
      ticketTypeResponse = await db.getDocument(
        DB_ID,
        'event_ticket_types',
        ticketTypeId
      );
    } catch {
      return NextResponse.json(
        { success: false, error: 'Ticket type not found' },
        { status: 404 }
      );
    }

    const ticketType = ticketTypeResponse as unknown as {
      $id: string;
      eventTicketId: string;
      name: string;
      price: number;
      originalPrice: number;
      quantityTotal: number;
      quantitySold: number;
      quantityReserved: number;
      maxPerOrder: number;
      minPerOrder: number;
      salesStartDate?: string;
      salesEndDate?: string;
      isActive: boolean;
    };

    // Check if ticket type is available
    if (!ticketType.isActive) {
      return NextResponse.json(
        { success: false, error: 'This ticket type is not available' },
        { status: 400 }
      );
    }

    // Check sale dates
    const now = new Date();
    if (ticketType.salesStartDate && now < new Date(ticketType.salesStartDate)) {
      return NextResponse.json(
        { success: false, error: 'Sales for this ticket type have not started yet' },
        { status: 400 }
      );
    }
    if (ticketType.salesEndDate && now > new Date(ticketType.salesEndDate)) {
      return NextResponse.json(
        { success: false, error: 'Sales for this ticket type have ended' },
        { status: 400 }
      );
    }

    // Check quantity limits
    if (quantity < ticketType.minPerOrder) {
      return NextResponse.json(
        { success: false, error: `Minimum order is ${ticketType.minPerOrder} ticket(s)` },
        { status: 400 }
      );
    }
    if (quantity > ticketType.maxPerOrder) {
      return NextResponse.json(
        { success: false, error: `Maximum order is ${ticketType.maxPerOrder} ticket(s)` },
        { status: 400 }
      );
    }

    // Check availability
    const available = ticketType.quantityTotal - ticketType.quantitySold - ticketType.quantityReserved;
    if (available < quantity) {
      return NextResponse.json(
        { success: false, error: `Only ${available} ticket(s) available` },
        { status: 400 }
      );
    }

    // Get event ticket config for pricing calculations
    const eventTicketResponse = await db.getDocument(
      DB_ID,
      'event_tickets',
      ticketType.eventTicketId
    );
    const eventTicket = eventTicketResponse as unknown as EventTicket;

    // Check user ticket limit
    const userPurchases = await ticketService.getUserPurchases(userId);
    const userTicketsForEvent = userPurchases
      .filter(p => p.eventTicketId === ticketType.eventTicketId && p.status !== 'cancelled' && p.status !== 'refunded')
      .reduce((sum, p) => sum + p.quantity, 0);
    
    if (userTicketsForEvent + quantity > eventTicket.maxTicketsPerUser) {
      return NextResponse.json(
        { success: false, error: `Maximum ${eventTicket.maxTicketsPerUser} tickets per user for this event` },
        { status: 400 }
      );
    }

    // Calculate pricing
    const calculation = ticketService.calculatePurchase(ticketType as unknown as EventTicketType, quantity, eventTicket);

    // Reserve tickets temporarily
    const reserved = await ticketService.reserveTickets(ticketTypeId, quantity);
    if (!reserved) {
      return NextResponse.json(
        { success: false, error: 'Failed to reserve tickets. Please try again.' },
        { status: 500 }
      );
    }

    // Create purchase record with pending status
    const purchase = await ticketService.createPurchase({
      eventTicketId: ticketType.eventTicketId,
      eventTicketTypeId: ticketTypeId,
      userId,
      userEmail,
      userName,
      userPhone,
      quantity,
      unitPrice: ticketType.price,
      subtotal: calculation.subtotal,
      taxAmount: calculation.taxAmount,
      serviceFee: calculation.serviceFee,
      discountAmount: calculation.discountAmount,
      totalAmount: calculation.totalAmount,
      currency: calculation.currency,
      paymentStatus: 'pending',
      paymentMethod: paymentMethod || 'stripe',
      status: eventTicket.requiresApproval ? 'pending' : 'pending',
      purchasedAt: new Date().toISOString(),
      metadata: JSON.stringify(metadata || {}),
    });

    if (!purchase) {
      // Release reserved tickets
      await ticketService.releaseReservedTickets(ticketTypeId, quantity);
      return NextResponse.json(
        { success: false, error: 'Failed to create purchase record' },
        { status: 500 }
      );
    }

    // Create payment intent
    const paymentProvider = paymentProviderFactory.getProvider(paymentMethod as 'stripe' | 'mpesa' | 'paystack');
    if (!paymentProvider) {
      // Release reserved tickets
      await ticketService.releaseReservedTickets(ticketTypeId, quantity);
      return NextResponse.json(
        { success: false, error: 'Payment provider not configured' },
        { status: 500 }
      );
    }

    const paymentResult = await paymentProvider.createPaymentIntent({
      amount: calculation.totalAmount,
      currency: calculation.currency,
      customerEmail: userEmail,
      customerName: userName,
      description: `${quantity}x ${ticketType.name} for ${eventTicketResponse.eventTitle || 'Event'}`,
      metadata: {
        purchaseId: purchase.purchaseId,
        eventTicketId: ticketType.eventTicketId,
        eventTicketTypeId: ticketTypeId,
        quantity: quantity.toString(),
        ...metadata,
      },
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.kve.co.ke'}/events/${eventId}/tickets/success?purchaseId=${purchase.purchaseId}`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.kve.co.ke'}/events/${eventId}/tickets/cancelled?purchaseId=${purchase.purchaseId}`,
    });

    if (!paymentResult.success) {
      // Release reserved tickets
      await ticketService.releaseReservedTickets(ticketTypeId, quantity);
      // Update purchase status to failed
      await ticketService.updatePurchaseStatus(purchase.$id, 'cancelled', 'failed');
      return NextResponse.json(
        { success: false, error: paymentResult.error || 'Failed to initiate payment' },
        { status: 500 }
      );
    }

    // Update purchase with payment reference
    await ticketService.updatePurchaseStatus(
      purchase.$id,
      'pending',
      'pending',
      paymentResult.providerReference,
      JSON.stringify(paymentResult.providerResponse)
    );

    return NextResponse.json({
      success: true,
      data: {
        purchase: {
          purchaseId: purchase.purchaseId,
          confirmationCode: purchase.confirmationCode,
          quantity,
          totalAmount: calculation.totalAmount,
          currency: calculation.currency,
          status: purchase.status,
          paymentStatus: purchase.paymentStatus,
        },
        payment: {
          paymentIntentId: paymentResult.paymentIntentId,
          clientSecret: paymentResult.clientSecret,
          redirectUrl: paymentResult.redirectUrl,
          status: paymentResult.status,
        },
      },
    });
  } catch (error: unknown) {
    console.error('Ticket purchase API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process ticket purchase' },
      { status: 500 }
    );
  }
}