import { ticketService, parsePurchaseTickets, EventTicketPurchase, EventTicketType, EventTicket } from './ticketService';
import { sendTicketConfirmationEmail } from '@/lib/email/ticketEmails';

export interface TicketDeliveryResult {
  success: boolean;
  ticketCodes: string[];
  emailSent: boolean;
  emailError?: string;
}

function formatEventDate(eventTicket: EventTicket | null): string {
  const dateStr = (eventTicket as { startDate?: string } | null)?.startDate || eventTicket?.salesStartDate;
  if (!dateStr) return 'TBA';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'TBA';
  }
}

/**
 * Generates e-ticket codes for a paid purchase (if not already generated) and
 * persists them on the purchase document.
 *
 * Confirmation emails are opt-in via TICKET_EMAIL_ENABLED=true - buyers
 * otherwise download their PDF e-tickets from the success/ticket pages.
 *
 * Call this only when a purchase transitions to paid, to avoid duplicate work.
 */
export async function deliverPurchaseTickets(purchase: EventTicketPurchase): Promise<TicketDeliveryResult> {
  // Reuse previously generated codes when available
  // (supports both the legacy array form and the { codes, scanned } object form)
  let ticketCodes: string[] = parsePurchaseTickets(purchase.tickets).codes;

  const ticketType = await ticketService.getTicketTypeById(purchase.eventTicketTypeId);
  const eventTicket = await ticketService.getEventTicketById(purchase.eventTicketId);

  if (ticketCodes.length === 0) {
    try {
      ticketCodes = ticketService.generateTicketCodes(
        purchase,
        ticketType || ({ name: 'TKT' } as EventTicketType)
      );
      await ticketService.updatePurchaseTickets(purchase.$id, ticketCodes);
      purchase.tickets = JSON.stringify(ticketCodes);
    } catch (error) {
      console.error(`Failed to generate ticket codes for purchase ${purchase.purchaseId}:`, error);
      return { success: false, ticketCodes: [], emailSent: false, emailError: 'Ticket code generation failed' };
    }
  }

  // Ticket confirmation emails are opt-in: enable with TICKET_EMAIL_ENABLED=true
  // once valid SMTP credentials are configured (see .env.production.example).
  // Buyers download their PDF e-tickets from the success/ticket pages.
  if (process.env.TICKET_EMAIL_ENABLED !== 'true') {
    console.info(
      `Ticket confirmation email skipped for ${purchase.purchaseId} (TICKET_EMAIL_ENABLED is not 'true').`
    );
    return { success: true, ticketCodes, emailSent: false };
  }

  const emailResult = await sendTicketConfirmationEmail({
    userEmail: purchase.userEmail,
    userName: purchase.userName,
    eventTitle: eventTicket?.eventTitle || 'KVE 2026',
    eventDate: formatEventDate(eventTicket),
    eventVenue:
      (eventTicket as { venue?: string; location?: string } | null)?.venue ||
      (eventTicket as { venue?: string; location?: string } | null)?.location ||
      'Nairobi Convention Center, Kenya',
    ticketTypeName: ticketType?.name || 'Standard',
    quantity: purchase.quantity,
    ticketCodes,
    purchaseId: purchase.purchaseId,
    confirmationCode: purchase.confirmationCode || `CONF-${purchase.purchaseId}`,
    totalAmount: purchase.totalAmount,
    currency: purchase.currency,
  });

  if (!emailResult.success) {
    console.error(`Failed to email e-tickets for purchase ${purchase.purchaseId}:`, emailResult.error);
  }

  return { success: true, ticketCodes, emailSent: emailResult.success, emailError: emailResult.error };
}
