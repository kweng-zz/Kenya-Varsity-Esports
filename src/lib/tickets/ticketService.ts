import { Client, Databases, Query, ID, Permission, Role } from 'node-appwrite';

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

export interface PurchaseCalculation {
  subtotal: number;
  taxAmount: number;
  serviceFee: number;
  paystackFee: number;
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
    const subtotal = ticketType.price * quantity;
    
    // Tax (VAT) - default 16% for Kenya if not set
    const taxRate = eventTicket.taxRate || 16;
    const taxAmount = (subtotal * taxRate) / 100;
    
    // Platform service fee - default small fixed fee if not set
    let serviceFee = 0;
    const feeType = eventTicket.serviceFeeType || 'fixed';
    const feeValue = eventTicket.serviceFee || 0;
    if (feeType === 'percentage') {
      serviceFee = (subtotal * feeValue) / 100;
    } else {
      serviceFee = feeValue;
    }

    // Paystack transaction fee estimate (added at checkout)
    // Local cards: ~1.5% + small fixed, Intl: ~3.9%
    // We'll use a blended rate of ~2.5% + KES 10
    const paystackRate = 0.025;
    const paystackFixedFee = 10;
    const paystackFee = (subtotal + taxAmount + serviceFee) * paystackRate + paystackFixedFee;

    const discountAmount = ticketType.originalPrice > ticketType.price
      ? (ticketType.originalPrice - ticketType.price) * quantity
      : 0;

    const totalAmount = subtotal + taxAmount + serviceFee + paystackFee - discountAmount;

    return {
      subtotal,
      taxAmount,
      serviceFee,
      paystackFee: Math.round(paystackFee),
      discountAmount,
      totalAmount: Math.max(0, Math.round(totalAmount)),
      currency: eventTicket.currency,
    };
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
          Permission.read(Role.team('admins')),
          Permission.update(Role.team('admins')),
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

  async generateTicketQRCodes(purchase: EventTicketPurchase): Promise<string[]> {
    // This would integrate with a QR code generation service
    // For now, return placeholder data
    const codes = JSON.parse(purchase.tickets || '[]');
    return codes.map((code: string) => `data:image/svg+xml;base64,${btoa(`<svg>QR for ${code}</svg>`)}`);
  }
}

export const ticketService = new TicketService();