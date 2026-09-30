import { NextResponse } from "next/server";
import { Client, Databases, Query } from "node-appwrite";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || "";
const EVENT_TICKETS_COLLECTION = "event_tickets";
const EVENT_TICKET_TYPES_COLLECTION = "event_ticket_types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { eventId } = await params;

    // Try to find event_tickets by eventId first, then by eventSlug
    let eventTicket = null;

    const response = await db.listDocuments(DB_ID, EVENT_TICKETS_COLLECTION, [
      Query.equal("eventId", eventId),
      Query.equal("isActive", true),
      Query.limit(1),
    ]);

    if (response.documents.length > 0) {
      eventTicket = response.documents[0];
    } else {
      // Try by slug
      const slugResponse = await db.listDocuments(DB_ID, EVENT_TICKETS_COLLECTION, [
        Query.equal("eventSlug", eventId),
        Query.equal("isActive", true),
        Query.limit(1),
      ]);
      if (slugResponse.documents.length > 0) {
        eventTicket = slugResponse.documents[0];
      }
    }

    if (!eventTicket) {
      return NextResponse.json(
        { success: false, error: "Event ticket configuration not found" },
        { status: 404 }
      );
    }

    // Check if sales are active
    const now = new Date();
    if (eventTicket.salesStartDate && now < new Date(eventTicket.salesStartDate)) {
      return NextResponse.json(
        { success: false, error: "Ticket sales have not started yet", eventTicket },
        { status: 400 }
      );
    }
    if (eventTicket.salesEndDate && now > new Date(eventTicket.salesEndDate)) {
      return NextResponse.json(
        { success: false, error: "Ticket sales have ended", eventTicket },
        { status: 400 }
      );
    }

    if (!eventTicket.isActive) {
      return NextResponse.json(
        { success: false, error: "Ticket sales are currently inactive", eventTicket },
        { status: 400 }
      );
    }

    // Get ticket types
    const ticketTypesResponse = await db.listDocuments(DB_ID, EVENT_TICKET_TYPES_COLLECTION, [
      Query.equal("eventTicketId", eventTicket.$id),
      Query.equal("isActive", true),
      Query.orderAsc("sortOrder"),
    ]);

    const ticketTypes = ticketTypesResponse.documents.map((t: any) => {
      const available = t.quantityTotal - t.quantitySold - t.quantityReserved;
      return {
        ...t,
        available,
        isAvailable: available > 0,
      };
    });

    // Filter only available ticket types
    const availableTypes = ticketTypes.filter((t: any) => t.isAvailable);

    // Build availability array for frontend
    const availability = ticketTypes.map((ticketType: any) => {
      let isOnSale = true;
      let saleMessage: string | undefined;

      if (ticketType.salesStartDate) {
        const startDate = new Date(ticketType.salesStartDate);
        if (now < startDate) {
          isOnSale = false;
          saleMessage = `Sales start on ${startDate.toLocaleDateString()}`;
        }
      }

      if (ticketType.salesEndDate) {
        const endDate = new Date(ticketType.salesEndDate);
        if (now > endDate) {
          isOnSale = false;
          saleMessage = 'Sales have ended';
        }
      }

      return {
        ticketType,
        available: ticketType.available,
        isAvailable: ticketType.isAvailable && isOnSale,
        isOnSale,
        saleMessage,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        eventTicket,
        ticketTypes: availableTypes,
        availability,
        paymentProviders: ['paystack', 'mpesa', 'stripe'],
      },
    });
  } catch (error: any) {
    console.error("Event tickets API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch event tickets" },
      { status: 500 }
    );
  }
}