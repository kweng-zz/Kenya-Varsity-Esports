import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { ticketService, parsePurchaseTickets, EventTicket, EventTicketPurchase } from '@/lib/tickets';
import { verifyAdminAuth } from '@/lib/middleware/admin-auth';
import { approveRegistration } from '@/lib/tournaments/approveRegistration';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Lazy Appwrite init (tournament + registration lookups)
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

/**
 * Ticket codes look like `${PREFIX}-${purchaseId}-${NNN}` where purchaseId
 * starts with `EVT-`. The last `-NNN` group is the ticket index; everything
 * from `EVT-` up to that index is the purchase id.
 */
function parseTicketCode(code: string): { purchaseId: string; index: number } | null {
  const trimmed = code.trim();
  const lastDash = trimmed.lastIndexOf('-');
  if (lastDash < 0) return null;

  const indexPart = trimmed.slice(lastDash + 1);
  if (!/^\d{3}$/.test(indexPart)) return null;

  const head = trimmed.slice(0, lastDash);
  const evtPos = head.indexOf('EVT-');
  if (evtPos < 0) return null;

  return { purchaseId: head.slice(evtPos), index: parseInt(indexPart, 10) };
}

type RegistrationState =
  | 'approved_now'
  | 'already_approved'
  | 'none'
  | 'rejected'
  | 'external'
  | 'lookup_error';

interface RegistrationSummary {
  state: RegistrationState;
  registrationId?: string;
  playerName?: string;
  teamName?: string;
  email?: string;
  tournamentId?: string;
  tournamentTitle?: string;
}

/**
 * Resolve the buyer's tournament registration for the ticket's source event.
 * When a registration is still awaiting approval it is auto-approved (this is
 * the "scan the ticket = approve the player" behaviour).
 * External events (non-tournament) simply return state 'external'.
 */
async function resolveTournamentRegistration(
  purchase: EventTicketPurchase,
  eventTicket: EventTicket
): Promise<RegistrationSummary> {
  const db = initializeAppwrite();
  const sourceId = (eventTicket as { eventId?: string }).eventId;
  if (!db || !sourceId) return { state: 'lookup_error' };

  const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
  const TOURNAMENTS_COLLECTION =
    process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID || 'tournaments';
  const REGS_COLLECTION =
    process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID || 'tournament_registrations';

  // Is the source event a tournament? (external events have no registrations)
  let tournament: Record<string, unknown> | null = null;
  try {
    tournament = (await db.getDocument(DB_ID, TOURNAMENTS_COLLECTION, sourceId)) as unknown as Record<
      string,
      unknown
    >;
  } catch {
    tournament = null;
  }

  if (!tournament) {
    return { state: 'external', tournamentId: sourceId };
  }

  const tournamentTitle =
    (tournament.gameName as string) || (tournament.title as string) || (tournament.name as string) || 'Tournament';

  // Find the buyer's registration. Match by email first (registration userIds are
  // sometimes email-derived, e.g. `user_<email>`), fall back to the real userId.
  let registration: Record<string, unknown> | null = null;
  const email = purchase.userEmail?.toLowerCase();

  try {
    if (email) {
      const res = await db.listDocuments(DB_ID, REGS_COLLECTION, [
        Query.equal('tournamentId', sourceId),
        Query.equal('email', email),
        Query.limit(1),
      ]);
      registration = (res.documents[0] as unknown as Record<string, unknown>) || null;
    }

    if (!registration && purchase.userEmail && purchase.userEmail !== email) {
      const res = await db.listDocuments(DB_ID, REGS_COLLECTION, [
        Query.equal('tournamentId', sourceId),
        Query.equal('email', purchase.userEmail),
        Query.limit(1),
      ]);
      registration = (res.documents[0] as unknown as Record<string, unknown>) || null;
    }

    if (!registration && purchase.userId) {
      const res = await db.listDocuments(DB_ID, REGS_COLLECTION, [
        Query.equal('tournamentId', sourceId),
        Query.equal('userId', purchase.userId),
        Query.limit(1),
      ]);
      registration = (res.documents[0] as unknown as Record<string, unknown>) || null;
    }
  } catch (error) {
    console.error('Error looking up tournament registration:', error);
    return { state: 'lookup_error', tournamentId: sourceId, tournamentTitle };
  }

  if (!registration) {
    return {
      state: 'none',
      tournamentId: sourceId,
      tournamentTitle,
      playerName: purchase.userName,
      email: purchase.userEmail,
    };
  }

  const summary: RegistrationSummary = {
    state: 'none',
    registrationId: registration.$id as string,
    playerName: (registration.playerName as string) || purchase.userName,
    teamName: (registration.teamName as string) || undefined,
    email: (registration.email as string) || purchase.userEmail,
    tournamentId: sourceId,
    tournamentTitle,
  };

  const status = registration.status as string;
  if (status === 'approved') {
    summary.state = 'already_approved';
    return summary;
  }
  if (status === 'rejected') {
    summary.state = 'rejected';
    return summary;
  }

  // 'registered' (current) and 'pending' (legacy) both await approval
  const approval = await approveRegistration({
    registrationId: registration.$id as string,
    status: 'approved',
    registration,
    tournamentTitle,
    tournamentSlug: (tournament.slug as string) || undefined,
  });

  summary.state = approval.success ? 'approved_now' : 'lookup_error';
  return summary;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    // Admin-only: this endpoint records check-ins and approves registrations
    const auth = await verifyAdminAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { eventId } = await params;

    let body: { code?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'INVALID_BODY', message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const rawCode = typeof body.code === 'string' ? body.code.trim() : '';
    if (!rawCode) {
      return NextResponse.json(
        { success: false, error: 'MISSING_CODE', message: 'Ticket code is required' },
        { status: 400 }
      );
    }

    const parsedCode = parseTicketCode(rawCode);
    if (!parsedCode) {
      return NextResponse.json({
        success: true,
        data: { result: 'invalid', message: 'Not a valid KVE ticket code' },
      });
    }

    const purchase = await ticketService.getPurchaseById(parsedCode.purchaseId);
    if (!purchase) {
      return NextResponse.json({
        success: true,
        data: { result: 'invalid', message: 'Ticket not found' },
      });
    }

    const ticketsState = parsePurchaseTickets(purchase.tickets);
    if (!ticketsState.codes.includes(rawCode)) {
      return NextResponse.json({
        success: true,
        data: { result: 'invalid', message: 'Code does not belong to this ticket purchase' },
      });
    }

    const eventTicket = await ticketService.getEventTicketById(purchase.eventTicketId);
    if (!eventTicket) {
      return NextResponse.json({
        success: true,
        data: { result: 'invalid', message: 'Ticket configuration not found' },
      });
    }

    // The scanned ticket must belong to the event the scanner is set to
    if ((eventTicket as { eventId?: string }).eventId !== eventId) {
      return NextResponse.json({
        success: true,
        data: {
          result: 'wrong_event',
          message: `This ticket is for "${eventTicket.eventTitle}" — not for the selected event`,
          correctEventId: (eventTicket as { eventId?: string }).eventId,
          correctEventTitle: eventTicket.eventTitle,
        },
      });
    }

    // Only confirmed + paid tickets are valid for entry
    if (purchase.status !== 'confirmed' || purchase.paymentStatus !== 'paid') {
      return NextResponse.json({
        success: true,
        data: {
          result: 'not_paid',
          message: `Ticket is not valid for entry (payment ${purchase.paymentStatus}, status ${purchase.status})`,
          purchase: {
            purchaseId: purchase.purchaseId,
            userName: purchase.userName,
            userEmail: purchase.userEmail,
          },
        },
      });
    }

    const ticketType = await ticketService.getTicketTypeById(purchase.eventTicketTypeId);
    const alreadyScannedAt = ticketsState.scanned[rawCode] || null;

    if (alreadyScannedAt) {
      // Duplicate scan: still report (and self-heal) the registration state,
      // but never double-count the check-in.
      const registration = await resolveTournamentRegistration(purchase, eventTicket);
      return NextResponse.json({
        success: true,
        data: {
          result: 'already_scanned',
          scannedAt: alreadyScannedAt,
          message: `Ticket already scanned at ${new Date(alreadyScannedAt).toLocaleString()}`,
          stats: {
            scanned: Object.keys(ticketsState.scanned).length,
            total: ticketsState.codes.length,
          },
          purchase: {
            purchaseId: purchase.purchaseId,
            userName: purchase.userName,
            userEmail: purchase.userEmail,
            quantity: purchase.quantity,
            ticketTypeName: ticketType?.name || 'Ticket',
            eventTitle: eventTicket.eventTitle,
            codeIndex: parsedCode.index,
          },
          registration,
        },
      });
    }

    // Tournament registration auto-approval (no-op for external events).
    // Done before marking the scan so a failed approval leaves the ticket
    // re-scannable.
    const registration = await resolveTournamentRegistration(purchase, eventTicket);

    // Record the check-in
    const markResult = await ticketService.markTicketCodeScanned(purchase.$id, rawCode);
    if (!markResult) {
      return NextResponse.json(
        {
          success: false,
          error: 'SCAN_FAILED',
          message: 'Could not record the check-in — please scan again',
        },
        { status: 500 }
      );
    }

    const scannedAt = markResult.scanned[rawCode] || new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: {
        result: 'valid',
        scannedAt,
        message: 'Ticket valid — check-in recorded',
        stats: {
          scanned: Object.keys(markResult.scanned).length,
          total: markResult.codes.length,
        },
        purchase: {
          purchaseId: purchase.purchaseId,
          userName: purchase.userName,
          userEmail: purchase.userEmail,
          quantity: purchase.quantity,
          ticketTypeName: ticketType?.name || 'Ticket',
          eventTitle: eventTicket.eventTitle,
          codeIndex: markResult.codes.indexOf(rawCode) + 1,
        },
        registration,
      },
    });
  } catch (error) {
    console.error('Ticket check-in API error:', error);
    return NextResponse.json(
      { success: false, error: 'CHECK_IN_FAILED', message: 'Check-in failed' },
      { status: 500 }
    );
  }
}
