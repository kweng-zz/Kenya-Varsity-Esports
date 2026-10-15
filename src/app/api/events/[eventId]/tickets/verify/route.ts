import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { ticketService, deliverPurchaseTickets, parsePurchaseTickets, EventTicket } from '@/lib/tickets';
import { paymentProviderFactory } from '@/lib/payments';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Lazy Appwrite init (for resolving the source event's schedule/venue)
let appwriteClient: Client | null = null;
let appwriteDatabases: Databases | null = null;

const initializeAppwrite = (): Databases | null => {
  if (!appwriteClient) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    if (!endpoint || !projectId || !apiKey) return null;
    try {
      appwriteClient = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
      appwriteDatabases = new Databases(appwriteClient);
    } catch {
      return null;
    }
  }
  return appwriteDatabases;
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';

function extractVenueFromText(event: Record<string, unknown>): string | undefined {
  const text = `${event.description || ''} ${event.detailedDescription || ''}`;
  const match = text.match(
    /(?:at|@)\s+([^.\n]*(?:College|Campus|Centre|Center|University|Academy|Stadium|Arena|Hall)[^.\n]*)/i
  );
  return match ? match[1].trim().replace(/[,;]$/, '') : undefined;
}

/**
 * Resolve the real event schedule/venue. Ticket configs (`event_tickets`) store
 * `eventId` pointing at either a tournament or an external event document.
 */
async function resolveEventSchedule(
  eventTicket: EventTicket | null
): Promise<{ eventDate?: string; eventVenue?: string }> {
  const sourceId = (eventTicket as { eventId?: string } | null)?.eventId;
  if (!sourceId) return {};

  const db = initializeAppwrite();
  if (!db) return {};

  try {
    const res = await db.listDocuments(DB_ID, 'tournaments', [
      Query.equal('$id', sourceId),
      Query.limit(1),
    ]);
    if (res.documents.length > 0) {
      const t = res.documents[0] as Record<string, unknown>;
      return {
        eventDate: (t.startDate as string) || undefined,
        eventVenue:
          (t.venue as string) ||
          (t.location as string) ||
          (t.venueName as string) ||
          (t.format as string) ||
          extractVenueFromText(t),
      };
    }
  } catch {
    // fall through to external events
  }

  try {
    const res = await db.listDocuments(DB_ID, 'external_events', [
      Query.equal('$id', sourceId),
      Query.limit(1),
    ]);
    if (res.documents.length > 0) {
      const e = res.documents[0] as Record<string, unknown>;
      return {
        eventDate: (e.eventDate as string) || (e.startDate as string) || undefined,
        eventVenue: (e.venue as string) || (e.location as string) || undefined,
      };
    }
  } catch {
    // ignore
  }

  return {};
}

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

    // Webhook fallback: if the provider webhook hasn't confirmed the purchase yet
    // (or cannot reach this server, e.g. in local development), verify the payment
    // directly with the provider and deliver the e-tickets
    if (
      purchase.paymentStatus !== 'paid' &&
      purchase.status !== 'cancelled' &&
      purchase.status !== 'refunded' &&
      purchase.paymentReference &&
      purchase.paymentMethod
    ) {
      const provider = paymentProviderFactory.getProvider(
        purchase.paymentMethod as 'stripe' | 'mpesa' | 'paystack'
      );

      if (provider) {
        const paymentIntent = await provider.getPaymentIntent(purchase.paymentReference);

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          if (Math.abs(paymentIntent.amount - purchase.totalAmount) <= 1) {
            await ticketService.updatePurchaseStatus(
              purchase.$id,
              'confirmed',
              'paid',
              paymentIntent.providerReference || purchase.paymentReference,
              JSON.stringify(paymentIntent)
            );

            purchase.status = 'confirmed';
            purchase.paymentStatus = 'paid';
            purchase.paidAt = purchase.paidAt || new Date().toISOString();

            // Generate ticket codes (if needed) and email the e-tickets
            await deliverPurchaseTickets(purchase);
          } else {
            console.error(
              `Verification amount mismatch for ${purchase.purchaseId}: expected ${purchase.totalAmount}, got ${paymentIntent.amount}`
            );
          }
        }
      }
    }

    // Get the ticket type details
    const ticketTypeDetails = await ticketService.getTicketTypeById(purchase.eventTicketTypeId);

    // Get the ticket configuration + the source event's schedule/venue
    const eventTicket = await ticketService.getEventTicketById(purchase.eventTicketId);
    const schedule = await resolveEventSchedule(eventTicket);

    // The URL path may carry a stale or missing event id (e.g. legacy links);
    // always prefer the event id stored on the ticket configuration.
    const resolvedEventId = (eventTicket as { eventId?: string } | null)?.eventId || eventId;

    // Generate ticket codes if not already generated
    // (supports both the legacy array form and the { codes, scanned } object form)
    const parsedTickets = parsePurchaseTickets(purchase.tickets);
    let ticketCodes: string[] = parsedTickets.codes;

    if (ticketCodes.length === 0 && purchase.status === 'confirmed') {
      // Legacy confirmed purchases without stored codes - generate them for display
      ticketCodes = ticketService.generateTicketCodes(
        purchase,
        ticketTypeDetails || ({ name: 'TKT' } as any)
      );
    }

    // E-ticket metadata, when stored on the purchase (object form)
    const eticketData = parsedTickets.eticketData;

    return NextResponse.json({
      success: true,
      data: {
        purchase: {
          purchaseId: purchase.purchaseId,
          confirmationCode: purchase.confirmationCode,
          eventId: resolvedEventId,
          eventTitle: eventTicket?.eventTitle,
          eventDate: schedule.eventDate,
          eventTime: schedule.eventDate,
          eventVenue: schedule.eventVenue,
          ticketTypeName: ticketTypeDetails?.name,
          quantity: purchase.quantity,
          totalAmount: purchase.totalAmount,
          currency: purchase.currency,
          status: purchase.status,
          paymentStatus: purchase.paymentStatus,
          paymentMethod: purchase.paymentMethod,
          userName: purchase.userName,
          userEmail: purchase.userEmail,
          purchasedAt: purchase.purchasedAt,
          paidAt: purchase.paidAt,
          ticketCodes,
          // Include e-ticket data for frontend display
          eticketData,
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
