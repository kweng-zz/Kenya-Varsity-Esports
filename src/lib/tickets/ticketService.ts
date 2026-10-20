import { Client, Databases, Query, ID, Permission, Role } from 'node-appwrite';
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
const EVENT_TICKETS_COLLECTION = 'event_tickets';
const EVENT_TICKET_TYPES_COLLECTION = 'event_ticket_types';
const EVENT_TICKET_PURCHASES_COLLECTION = 'event_ticket_purchases';

export interface ParsedPurchaseTickets {
  /** Individual ticket codes (one per attendee). */
  codes: string[];
  /** Map of ticket code -> ISO timestamp of the gate scan (empty when none scanned). */
  scanned: Record<string, string>;
  /** Optional e-ticket display payload. */
  eticketData: unknown | null;
}

/**
 * Parse the purchase `tickets` field, which is stored either as a legacy JSON
 * array of codes or as an object: `{ codes: string[], scanned?: { code: iso }, eticketData?: unknown }`.
 */
export function parsePurchaseTickets(raw: string | null | undefined): ParsedPurchaseTickets {
  const empty: ParsedPurchaseTickets = { codes: [], scanned: {}, eticketData: null };
  if (!raw) return empty;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return {
        codes: parsed.filter((c): c is string => typeof c === 'string'),
        scanned: {},
        eticketData: null,
      };
    }
    if (parsed && typeof parsed === 'object') {
      return {
        codes: Array.isArray(parsed.codes)
          ? parsed.codes.filter((c: unknown): c is string => typeof c === 'string')
          : [],
        scanned:
          parsed.scanned && typeof parsed.scanned === 'object' && !Array.isArray(parsed.scanned)
            ? (parsed.scanned as Record<string, string>)
            : {},
        eticketData: parsed.eticketData ?? null,
      };
    }
    return empty;
  } catch {
    return empty;
  }
}

export interface EventTicket {
  $id: string;
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  isActive: boolean;
  salesStartDate?: string;
  salesEndDate?: string;
  maxTicketsPerUser: number;
  requiresApproval: boolean;
  currency: string;
  taxRate: number;
  serviceFee: number;
  serviceFeeType: 'fixed' | 'percentage';
  description?: string;
  refundPolicy?: string;
  contactEmail?: string;
  totalSold: number;
  totalRevenue: number;
  $createdAt: string;
  $updatedAt: string;
}

export interface EventTicketType {
  $id: string;
  eventTicketId: string;
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
  quantityTotal: number;
  quantitySold: number;
  quantityReserved: number;
  maxPerOrder: number;
  minPerOrder: number;
  sortOrder: number;
  isActive: boolean;
  salesStartDate?: string;
  salesEndDate?: string;
  benefits: string[];
  color: string;
  isFeatured: boolean;
  $createdAt: string;
  $updatedAt: string;
}

export interface EventTicketPurchase {
  $id: string;
  purchaseId: string;
  eventTicketId: string;
  eventTicketTypeId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  taxAmount: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod?: string;
  paymentReference?: string;
  paymentDetails?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  confirmationCode?: string;
  tickets?: string;
  purchasedAt: string;
  paidAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  notes?: string;
  metadata?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface TicketAvailability {
  ticketType: EventTicketType;
  available: number;
  isAvailable: boolean;
  isOnSale: boolean;
  saleMessage?: string;
}

export interface TicketPurchaseRequirement {
  /** Whether this event has a ticket configuration (i.e. registration requires a ticket). */
  requiresTicket: boolean;
  /** Whether the buyer has a confirmed, fully paid purchase. */
  hasPaidTicket: boolean;
  /** Whether the buyer has a purchase that is still awaiting payment confirmation. */
  hasPendingPurchase: boolean;
  /** True when the requirement could not be determined (e.g. database error). */
  checkFailed?: boolean;
}

export interface PurchaseCalculation {
  subtotal: number;
  taxAmount: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
}

export class TicketService {
  async getEventTicket(eventId: string): Promise<EventTicket | null> {
    try {
      const db = initializeAppwrite();
      if (!db) return null;

      const response = await db.listDocuments(DB_ID, EVENT_TICKETS_COLLECTION, [
        Query.equal('eventId', eventId),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) return null;
      return response.documents[0] as unknown as EventTicket;
    } catch (error) {
      console.error('Error fetching event ticket:', error);
      return null;
    }
  }

  async getEventTicketBySlug(eventSlug: string): Promise<EventTicket | null> {
    try {
      const db = initializeAppwrite();
      if (!db) return null;

      const response = await db.listDocuments(DB_ID, EVENT_TICKETS_COLLECTION, [
        Query.equal('eventSlug', eventSlug),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) return null;
      return response.documents[0] as unknown as EventTicket;
    } catch (error) {
      console.error('Error fetching event ticket by slug:', error);
      return null;
    }
  }

  async getEventTicketById(eventTicketDocId: string): Promise<EventTicket | null> {
    try {
      const db = initializeAppwrite();
      if (!db) return null;

      const response = await db.getDocument(DB_ID, EVENT_TICKETS_COLLECTION, eventTicketDocId);
      return response as unknown as EventTicket;
    } catch (error) {
      console.error('Error fetching event ticket by id:', error);
      return null;
    }
  }

  async getTicketTypeById(ticketTypeId: string): Promise<EventTicketType | null> {
    try {
      const db = initializeAppwrite();
      if (!db) return null;

      const response = await db.getDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, ticketTypeId);
      return response as unknown as EventTicketType;
    } catch (error) {
      console.error('Error fetching ticket type by id:', error);
      return null;
    }
  }

  async getEventTicketTypes(eventTicketId: string): Promise<EventTicketType[]> {
    try {
      const db = initializeAppwrite();
      if (!db) return [];

      const response = await db.listDocuments(DB_ID, EVENT_TICKET_TYPES_COLLECTION, [
        Query.equal('eventTicketId', eventTicketId),
        Query.equal('isActive', true),
        Query.orderAsc('sortOrder'),
      ]);

      return response.documents as unknown as EventTicketType[];
    } catch (error) {
      console.error('Error fetching ticket types:', error);
      return [];
    }
  }

  async getTicketAvailability(eventTicketId: string): Promise<TicketAvailability[]> {
    const ticketTypes = await this.getEventTicketTypes(eventTicketId);
    const now = new Date();

    return ticketTypes.map(ticketType => {
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

      const available = ticketType.quantityTotal - ticketType.quantitySold - ticketType.quantityReserved;
      const isAvailable = available > 0 && isOnSale && ticketType.isActive;

      return {
        ticketType,
        available,
        isAvailable,
        isOnSale,
        saleMessage,
      };
    });
  }

  calculatePurchase(
    ticketType: EventTicketType,
    quantity: number,
    eventTicket: EventTicket
  ): PurchaseCalculation {
    return calculateOrderTotal({
      price: ticketType.price,
      originalPrice: ticketType.originalPrice,
      quantity,
      taxRate: eventTicket.taxRate || 16,
      serviceFee: eventTicket.serviceFee || 0,
      serviceFeeType: eventTicket.serviceFeeType || 'fixed',
      currency: eventTicket.currency,
    });
  }

  async createPurchase(
    purchaseData: Omit<EventTicketPurchase, '$id' | '$createdAt' | '$updatedAt' | 'purchaseId' | 'confirmationCode'>
  ): Promise<EventTicketPurchase | null> {
    try {
      const db = initializeAppwrite();
      if (!db) return null;

      // Generate unique purchase ID
      const purchaseId = `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Generate confirmation code
      const confirmationCode = `CONF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // Remove metadata from purchaseData since collection doesn't have that attribute (25 attr limit)
      const { metadata, ...purchaseDataWithoutMeta } = purchaseData as any;

      const response = await db.createDocument(
        DB_ID,
        EVENT_TICKET_PURCHASES_COLLECTION,
        ID.unique(),
        {
          ...purchaseDataWithoutMeta,
          purchaseId,
          confirmationCode,
          // Store metadata in paymentDetails field instead
          paymentDetails: metadata || '{}',
        },
        [
          Permission.read(Role.user(purchaseData.userId)),
          Permission.update(Role.user(purchaseData.userId)),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
        ]
      );

      // Update ticket type sold count
      await this.incrementTicketTypeSold(purchaseData.eventTicketTypeId, purchaseData.quantity);

      // Update event ticket total sold and revenue
      await this.incrementEventTicketStats(purchaseData.eventTicketId, purchaseData.quantity, purchaseData.totalAmount);

      return {
        ...response,
        purchaseId,
        confirmationCode,
      } as unknown as EventTicketPurchase;
    } catch (error) {
      console.error('Error creating purchase:', error);
      return null;
    }
  }

  private async incrementTicketTypeSold(ticketTypeId: string, quantity: number): Promise<void> {
    try {
      const db = initializeAppwrite();
      if (!db) return;

      const response = await db.getDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, ticketTypeId);
      await db.updateDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, ticketTypeId, {
        quantitySold: (response.quantitySold || 0) + quantity,
      });
    } catch (error) {
      console.error('Error incrementing ticket type sold:', error);
    }
  }

  private async incrementEventTicketStats(eventTicketId: string, quantity: number, revenue: number): Promise<void> {
    try {
      const db = initializeAppwrite();
      if (!db) return;

      const response = await db.getDocument(DB_ID, EVENT_TICKETS_COLLECTION, eventTicketId);
      await db.updateDocument(DB_ID, EVENT_TICKETS_COLLECTION, eventTicketId, {
        totalSold: (response.totalSold || 0) + quantity,
        totalRevenue: (response.totalRevenue || 0) + revenue,
      });
    } catch (error) {
      console.error('Error incrementing event ticket stats:', error);
    }
  }

  async getUserPurchases(userId: string): Promise<EventTicketPurchase[]> {
    try {
      const db = initializeAppwrite();
      if (!db) return [];

      const response = await db.listDocuments(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, [
        Query.equal('userId', userId),
        Query.orderDesc('purchasedAt'),
      ]);

      return response.documents as unknown as EventTicketPurchase[];
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      return [];
    }
  }

  async getPurchaseById(purchaseId: string): Promise<EventTicketPurchase | null> {
    try {
      const db = initializeAppwrite();
      if (!db) return null;

      const response = await db.listDocuments(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, [
        Query.equal('purchaseId', purchaseId),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) return null;
      return response.documents[0] as unknown as EventTicketPurchase;
    } catch (error) {
      console.error('Error fetching purchase:', error);
      return null;
    }
  }

  async getPurchaseByConfirmationCode(confirmationCode: string): Promise<EventTicketPurchase | null> {
    try {
      const db = initializeAppwrite();
      if (!db) return null;

      const response = await db.listDocuments(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, [
        Query.equal('confirmationCode', confirmationCode),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) return null;
      return response.documents[0] as unknown as EventTicketPurchase;
    } catch (error) {
      console.error('Error fetching purchase by confirmation code:', error);
      return null;
    }
  }

  async updatePurchaseStatus(
    purchaseId: string,
    status: EventTicketPurchase['status'],
    paymentStatus?: EventTicketPurchase['paymentStatus'],
    paymentReference?: string,
    paymentDetails?: string
  ): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) return false;

      const updateData: Partial<EventTicketPurchase> = { status };
      
      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }
      if (paymentReference) {
        updateData.paymentReference = paymentReference;
      }
      if (paymentDetails) {
        updateData.paymentDetails = paymentDetails;
      }
      if (paymentStatus === 'paid' && status === 'confirmed') {
        updateData.paidAt = new Date().toISOString();
      }
      if (status === 'cancelled') {
        updateData.cancelledAt = new Date().toISOString();
      }
      if (status === 'refunded') {
        updateData.refundedAt = new Date().toISOString();
      }

      await db.updateDocument(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, purchaseId, updateData);
      return true;
    } catch (error) {
      console.error('Error updating purchase status:', error);
      return false;
    }
  }

  async updatePurchaseTickets(purchaseDocId: string, ticketCodes: string[]): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) return false;

      await db.updateDocument(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, purchaseDocId, {
        tickets: JSON.stringify(ticketCodes),
      });
      return true;
    } catch (error) {
      console.error('Error updating purchase tickets:', error);
      return false;
    }
  }

  /**
   * Mark one ticket code as scanned (checked in at the gate).
   * The tickets field is upgraded from a legacy array to `{ codes, scanned }`.
   * Returns the resulting scan map, or null when the purchase/code is invalid.
   */
  async markTicketCodeScanned(
    purchaseDocId: string,
    code: string,
    timestamp: string = new Date().toISOString()
  ): Promise<{ scanned: Record<string, string>; codes: string[] } | null> {
    try {
      const db = initializeAppwrite();
      if (!db) return null;

      const doc = (await db.getDocument(
        DB_ID,
        EVENT_TICKET_PURCHASES_COLLECTION,
        purchaseDocId
      )) as unknown as EventTicketPurchase;

      const parsed = parsePurchaseTickets(doc.tickets);
      if (!parsed.codes.includes(code)) return null;

      if (parsed.scanned[code]) {
        return { scanned: parsed.scanned, codes: parsed.codes };
      }

      const scanned = { ...parsed.scanned, [code]: timestamp };
      const payload: Record<string, unknown> = { codes: parsed.codes, scanned };
      if (parsed.eticketData) payload.eticketData = parsed.eticketData;

      await db.updateDocument(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, purchaseDocId, {
        tickets: JSON.stringify(payload),
      });

      return { scanned, codes: parsed.codes };
    } catch (error) {
      console.error('Error marking ticket code as scanned:', error);
      return null;
    }
  }

  /**
   * Ticket configurations attached to a source event (tournament or external event).
   */
  async getEventTicketConfigsByEventId(sourceEventId: string): Promise<EventTicket[]> {
    try {
      const db = initializeAppwrite();
      if (!db) return [];

      const res = await db.listDocuments(DB_ID, EVENT_TICKETS_COLLECTION, [
        Query.equal('eventId', sourceEventId),
        Query.limit(20),
      ]);
      return res.documents as unknown as EventTicket[];
    } catch (error) {
      console.error('Error fetching ticket configs by event:', error);
      return [];
    }
  }

  /**
   * Has this buyer already checked in a ticket for the given source event?
   * Used to auto-approve tournament registrations after a gate scan.
   */
  async hasCheckedInTicketForTournament(
    sourceEventId: string,
    buyer: { email?: string; userId?: string }
  ): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) return false;
      if (!buyer.email && !buyer.userId) return false;

      const configs = await this.getEventTicketConfigsByEventId(sourceEventId);
      if (configs.length === 0) return false;

      const email = buyer.email?.toLowerCase();

      for (const config of configs) {
        const res = await db.listDocuments(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, [
          Query.equal('eventTicketId', config.$id),
          Query.limit(200),
        ]);

        const checkedIn = (res.documents as unknown as EventTicketPurchase[]).some((p) => {
          const emailMatch = !!email && !!p.userEmail && p.userEmail.toLowerCase() === email;
          const userMatch = !!buyer.userId && p.userId === buyer.userId;
          if (!emailMatch && !userMatch) return false;
          return Object.keys(parsePurchaseTickets(p.tickets).scanned).length > 0;
        });

        if (checkedIn) return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking checked-in tickets for tournament:', error);
      return false;
    }
  }

  /**
   * Determine whether an event requires a ticket for registration and whether
   * the buyer already has a confirmed, paid ticket.
   *
   * A ticket configuration (`event_tickets`) linked to the source event is the
   * source of truth: if one exists, registration is only allowed after the
   * buyer's payment has been confirmed. Events without a ticket configuration
   * remain free to register for.
   */
  async getTicketPurchaseRequirement(
    sourceEventId: string,
    buyer: { email?: string; userId?: string }
  ): Promise<TicketPurchaseRequirement> {
    const noRequirement: TicketPurchaseRequirement = {
      requiresTicket: false,
      hasPaidTicket: false,
      hasPendingPurchase: false,
    };

    try {
      const db = initializeAppwrite();
      if (!db) {
        return { ...noRequirement, checkFailed: true };
      }

      const configsResponse = await db.listDocuments(DB_ID, EVENT_TICKETS_COLLECTION, [
        Query.equal('eventId', sourceEventId),
        Query.limit(20),
      ]);

      if (configsResponse.documents.length === 0) {
        return noRequirement;
      }

      const email = buyer.email?.trim().toLowerCase();
      const userId = buyer.userId?.trim();

      if (!email && !userId) {
        return { requiresTicket: true, hasPaidTicket: false, hasPendingPurchase: false };
      }

      let hasPendingPurchase = false;
      const pageSize = 100;

      for (const config of configsResponse.documents) {
        let offset = 0;
        let total = 0;

        do {
          const purchases = await db.listDocuments(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, [
            Query.equal('eventTicketId', config.$id),
            Query.limit(pageSize),
            Query.offset(offset),
          ]);

          total = purchases.total;

          for (const purchase of purchases.documents as unknown as EventTicketPurchase[]) {
            const emailMatch = !!email && purchase.userEmail?.trim().toLowerCase() === email;
            const userMatch = !!userId && purchase.userId === userId;

            if (!emailMatch && !userMatch) continue;

            if (purchase.status === 'confirmed' && purchase.paymentStatus === 'paid') {
              return {
                requiresTicket: true,
                hasPaidTicket: true,
                hasPendingPurchase: false,
              };
            }

            if (purchase.paymentStatus === 'pending') {
              hasPendingPurchase = true;
            }
          }

          if (purchases.documents.length === 0) break;
          offset += purchases.documents.length;
        } while (offset < total);
      }

      return {
        requiresTicket: true,
        hasPaidTicket: false,
        hasPendingPurchase,
      };
    } catch (error) {
      console.error('Error checking ticket purchase requirement:', error);
      return { ...noRequirement, checkFailed: true };
    }
  }

  async releaseReservedTickets(ticketTypeId: string, quantity: number): Promise<void> {
    try {
      const db = initializeAppwrite();
      if (!db) return;

      const response = await db.getDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, ticketTypeId);
      await db.updateDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, ticketTypeId, {
        quantityReserved: Math.max(0, (response.quantityReserved || 0) - quantity),
      });
    } catch (error) {
      console.error('Error releasing reserved tickets:', error);
    }
  }

  async reserveTickets(ticketTypeId: string, quantity: number): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) return false;

      const response = await db.getDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, ticketTypeId);
      const available = response.quantityTotal - response.quantitySold - response.quantityReserved;
      
      if (available < quantity) {
        return false;
      }

      await db.updateDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, ticketTypeId, {
        quantityReserved: (response.quantityReserved || 0) + quantity,
      });
      return true;
    } catch (error) {
      console.error('Error reserving tickets:', error);
      return false;
    }
  }

  generateTicketCodes(purchase: EventTicketPurchase, ticketType: EventTicketType): string[] {
    const codes: string[] = [];
    const prefix = ticketType.name.substring(0, 3).toUpperCase();
    
    for (let i = 0; i < purchase.quantity; i++) {
      const code = `${prefix}-${purchase.purchaseId}-${String(i + 1).padStart(3, '0')}`;
      codes.push(code);
    }
    
    return codes;
  }

  // Generate e-ticket data with game title specific info
  generateETicketData(purchase: EventTicketPurchase, ticketType: EventTicketType, event?: { startDate?: string }): any {
    // Map ticket type names to game title images and names
    const gameTitleMap: Record<string, { title: string; imageUrl: string }> = {
      'eFootball Mobile': {
        title: 'eFootball Mobile',
        imageUrl: '/images/Efootball.png',
      },
      'PUBG Mobile': {
        title: 'PUBG Mobile',
        imageUrl: '/images/PUBGM.png',
      },
      'CODM Multiplayer 5v5': {
        title: 'CODM Multiplayer 5v5',
        imageUrl: '/images/CODM MP.png',
      },
      'CODM 1v1': {
        title: 'CODM 1v1',
        imageUrl: '/images/CODM 1v1.png',
      },
    };
    
    const gameInfo = gameTitleMap[ticketType.name] || {
      title: ticketType.name,
      imageUrl: '/images/Efootball.png',
    };
    
    // Format event date if available
    let eventDateStr = '';
    let eventTimeStr = '';
    if (event?.startDate) {
      const eventDate = new Date(event.startDate);
      eventDateStr = eventDate.toLocaleDateString('en-US');
      eventTimeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    
    return {
      // Ticket identification
      purchaseId: purchase.purchaseId,
      confirmationCode: purchase.confirmationCode,
      eventTitle: event ? 'KVE 2026 Event' : 'Event',
      gameTitle: gameInfo.title,
      gameImage: gameInfo.imageUrl,
      quantity: purchase.quantity,
      eventDate: eventDateStr,
      eventTime: eventTimeStr,
      
      // Ticket codes
      ticketCodes: this.generateTicketCodes(purchase, ticketType),
      
      // Purchase info
      totalAmount: purchase.totalAmount,
      currency: purchase.currency,
      paymentStatus: purchase.paymentStatus,
      purchasedAt: purchase.purchasedAt,
    };
  }

  async generateTicketQRCodes(purchase: EventTicketPurchase): Promise<string[]> {
    // This would integrate with a QR code generation service
    // For now, return placeholder data
    const codes = parsePurchaseTickets(purchase.tickets).codes;
    return codes.map((code: string) => `data:image/svg+xml;base64,${btoa(`<svg>QR for ${code}</svg>`)}`);
  }

  async getAllPurchases(
    filters: {
      eventTicketId?: string;
      status?: EventTicketPurchase['status'];
      paymentStatus?: EventTicketPurchase['paymentStatus'];
      search?: string;
      startDate?: string;
      endDate?: string;
    } = {},
    limit = 25,
    offset = 0
  ): Promise<{ purchases: EventTicketPurchase[]; total: number }> {
    try {
      const db = initializeAppwrite();
      if (!db) return { purchases: [], total: 0 };

      const queries: string[] = [
        Query.orderDesc('purchasedAt'),
        Query.limit(limit),
        Query.offset(offset),
      ];

      if (filters.eventTicketId) {
        queries.push(Query.equal('eventTicketId', filters.eventTicketId));
      }
      if (filters.status) {
        queries.push(Query.equal('status', filters.status));
      }
      if (filters.paymentStatus) {
        queries.push(Query.equal('paymentStatus', filters.paymentStatus));
      }
      if (filters.search) {
        queries.push(Query.search('confirmationCode', filters.search));
      }
      if (filters.startDate) {
        queries.push(Query.greaterThanEqual('purchasedAt', filters.startDate));
      }
      if (filters.endDate) {
        queries.push(Query.lessThanEqual('purchasedAt', filters.endDate));
      }

      const [purchasesResponse, totalResponse] = await Promise.all([
        db.listDocuments(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, queries),
        db.listDocuments(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, [
          ...queries.filter(q => !q.startsWith('limit') && !q.startsWith('offset')),
          Query.limit(1),
        ]),
      ]);

      return {
        purchases: purchasesResponse.documents as unknown as EventTicketPurchase[],
        total: totalResponse.total,
      };
    } catch (error) {
      console.error('Error fetching all purchases:', error);
      return { purchases: [], total: 0 };
    }
  }

  async getAllEventTickets(): Promise<EventTicket[]> {
    try {
      const db = initializeAppwrite();
      if (!db) return [];

      const response = await db.listDocuments(DB_ID, EVENT_TICKETS_COLLECTION, [
        Query.orderDesc('$createdAt'),
      ]);

      return response.documents as unknown as EventTicket[];
    } catch (error) {
      console.error('Error fetching all event tickets:', error);
      return [];
    }
  }

  async updatePurchase(
    purchaseId: string,
    data: Partial<EventTicketPurchase>
  ): Promise<boolean> {
    try {
      const db = initializeAppwrite();
      if (!db) return false;

      await db.updateDocument(DB_ID, EVENT_TICKET_PURCHASES_COLLECTION, purchaseId, data);
      return true;
    } catch (error) {
      console.error('Error updating purchase:', error);
      return false;
    }
  }
}

export const ticketService = new TicketService();