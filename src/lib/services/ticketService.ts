/**
 * Ticket Management Service
 * Handles all ticket-related database operations
 */

import { Client, Databases, Storage, Query, ID, Permission, Role } from 'appwrite';
import { 
  Ticket, 
  TicketResponse, 
  CreateTicketData, 
  CreateResponseData, 
  UpdateTicketData, 
  TicketFilters, 
  TicketStats,
  TicketStatus,
  TicketPriority,
  TICKET_SUBJECTS
} from '@/types/ticket';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const TICKETS_COLLECTION_ID = 'tickets';
const TICKET_RESPONSES_COLLECTION_ID = 'ticket_responses';
const TICKET_ATTACHMENTS_BUCKET_ID = 'ticket_attachments';

// Fallback to an existing bucket if ticket_attachments doesn't exist
const FALLBACK_BUCKET_ID = 'default'; // You can change this to any existing bucket ID

class TicketService {
  /**
   * Create a new support ticket
   */
  async createTicket(userId: string, userName: string, data: CreateTicketData): Promise<Ticket> {
    try {
      // Generate human-readable ticket ID
      const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
      
      // Determine priority based on subject if not provided
      const priority = data.priority || (TICKET_SUBJECTS[data.subject as keyof typeof TICKET_SUBJECTS] as TicketPriority) || 'medium';
      
      let attachmentUrl = '';
      let attachmentName = '';
      
      // Handle file upload if attachment exists
      if (data.attachment) {
        const fileId = ID.unique();
        const uploadedFile = await storage.createFile(
          TICKET_ATTACHMENTS_BUCKET_ID,
          fileId,
          data.attachment,
          [
            Permission.read(Role.user(userId)),
            Permission.read(Role.team('admins')),
            Permission.delete(Role.user(userId))
          ]
        );
        
        attachmentUrl = storage.getFileView(TICKET_ATTACHMENTS_BUCKET_ID, uploadedFile.$id).toString();
        attachmentName = data.attachment.name;
      }

      // Create ticket document
      const ticket = await databases.createDocument(
        DB_ID,
        TICKETS_COLLECTION_ID,
        ID.unique(),
        {
          ticketId,
          title: data.title,
          subject: data.subject,
          message: data.message,
          status: 'open' as TicketStatus,
          priority,
          userId,
          userName,
          attachmentUrl,
          attachmentName,
          responseCount: 0,
          isUnreadByUser: false,
          isUnreadByAdmin: true,
          tags: [],
          lastResponseAt: new Date().toISOString()
        },
        [
          Permission.read(Role.user(userId)),
          Permission.read(Role.team('admins')),
          Permission.update(Role.user(userId)),
          Permission.update(Role.team('admins')),
          Permission.delete(Role.team('admins'))
        ]
      );

      return ticket as unknown as Ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error('Failed to create ticket');
    }
  }

  /**
   * Get tickets with filters and pagination
   */
  async getTickets(filters: TicketFilters = {}, limit = 25, offset = 0): Promise<{ tickets: Ticket[], total: number }> {
    try {
      const queries: string[] = [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc('$createdAt')
      ];

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        queries.push(Query.equal('status', filters.status));
      }

      if (filters.priority && filters.priority.length > 0) {
        queries.push(Query.equal('priority', filters.priority));
      }

      if (filters.subject && filters.subject.length > 0) {
        queries.push(Query.equal('subject', filters.subject));
      }

      if (filters.assignedTo) {
        queries.push(Query.equal('assignedTo', filters.assignedTo));
      }

      if (filters.userId) {
        queries.push(Query.equal('userId', filters.userId));
      }

      if (filters.unreadOnly) {
        queries.push(Query.equal('isUnreadByAdmin', true));
      }

      if (filters.search) {
        queries.push(Query.search('title', filters.search));
      }

      if (filters.dateFrom) {
        queries.push(Query.greaterThanEqual('$createdAt', filters.dateFrom));
      }

      if (filters.dateTo) {
        queries.push(Query.lessThanEqual('$createdAt', filters.dateTo));
      }

      const response = await databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, queries);
      
      return {
        tickets: response.documents as unknown as Ticket[],
        total: response.total
      };
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new Error('Failed to fetch tickets');
    }
  }

  /**
   * Get a single ticket by ID
   */
  async getTicket(ticketId: string): Promise<Ticket | null> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        TICKETS_COLLECTION_ID,
        [Query.equal('ticketId', ticketId)]
      );

      return response.documents.length > 0 ? response.documents[0] as unknown as Ticket : null;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      return null;
    }
  }

  /**
   * Update ticket
   */
  async updateTicket(ticketId: string, updates: UpdateTicketData): Promise<Ticket> {
    try {
      const ticket = await this.getTicket(ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      const updatedTicket = await databases.updateDocument(
        DB_ID,
        TICKETS_COLLECTION_ID,
        ticket.$id,
        {
          ...updates,
          $updatedAt: new Date().toISOString()
        }
      );

      return updatedTicket as unknown as Ticket;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw new Error('Failed to update ticket');
    }
  }

  /**
   * Add response to ticket
   */
  async addResponse(userId: string, userName: string, data: CreateResponseData): Promise<TicketResponse> {
    try {
      const ticket = await this.getTicket(data.ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      let attachmentUrl = '';
      let attachmentName = '';
      
      // Handle file upload if attachment exists
      if (data.attachment) {
        const fileId = ID.unique();
        const uploadedFile = await storage.createFile(
          TICKET_ATTACHMENTS_BUCKET_ID,
          fileId,
          data.attachment,
          [
            Permission.read(Role.user(ticket.userId)),
            Permission.read(Role.team('admins')),
            Permission.delete(Role.user(userId))
          ]
        );
        
        attachmentUrl = storage.getFileView(TICKET_ATTACHMENTS_BUCKET_ID, uploadedFile.$id).toString();
        attachmentName = data.attachment.name;
      }

      // Determine if this is an admin response
      const isAdminResponse = userName.includes('@') || userId === 'admin'; // You might want to check against admin role

      // Create response document
      const response = await databases.createDocument(
        DB_ID,
        TICKET_RESPONSES_COLLECTION_ID,
        ID.unique(),
        {
          ticketId: data.ticketId,
          message: data.message,
          isAdminResponse,
          userId,
          userName,
          attachmentUrl,
          attachmentName,
          isInternal: data.isInternal || false
        },
        [
          Permission.read(Role.user(ticket.userId)),
          Permission.read(Role.team('admins')),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.team('admins'))
        ]
      );

      // Update ticket with response info
      const newStatus: TicketStatus = isAdminResponse ? 'waiting-for-user' : 'waiting-for-admin';
      await databases.updateDocument(
        DB_ID,
        TICKETS_COLLECTION_ID,
        ticket.$id,
        {
          responseCount: ticket.responseCount + 1,
          lastResponseAt: new Date().toISOString(),
          status: ticket.status === 'closed' ? ticket.status : newStatus,
          isUnreadByUser: isAdminResponse,
          isUnreadByAdmin: !isAdminResponse
        }
      );

      return response as unknown as TicketResponse;
    } catch (error) {
      console.error('Error adding response:', error);
      throw new Error('Failed to add response');
    }
  }

  /**
   * Get responses for a ticket
   */
  async getTicketResponses(ticketId: string): Promise<TicketResponse[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        TICKET_RESPONSES_COLLECTION_ID,
        [
          Query.equal('ticketId', ticketId),
          Query.orderAsc('$createdAt')
        ]
      );

      return response.documents as unknown as TicketResponse[];
    } catch (error) {
      console.error('Error fetching ticket responses:', error);
      throw new Error('Failed to fetch ticket responses');
    }
  }

  /**
   * Mark ticket as read
   */
  async markAsRead(ticketId: string, isAdmin: boolean): Promise<void> {
    try {
      const ticket = await this.getTicket(ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      const updateData = isAdmin 
        ? { isUnreadByAdmin: false }
        : { isUnreadByUser: false };

      await databases.updateDocument(
        DB_ID,
        TICKETS_COLLECTION_ID,
        ticket.$id,
        updateData
      );
    } catch (error) {
      console.error('Error marking ticket as read:', error);
      throw new Error('Failed to mark ticket as read');
    }
  }

  /**
   * Get ticket statistics for admin dashboard
   */
  async getTicketStats(): Promise<TicketStats> {
    try {
      const [
        totalResponse,
        openResponse,
        inProgressResponse,
        waitingUserResponse,
        waitingAdminResponse,
        resolvedResponse,
        closedResponse,
        unreadResponse
      ] = await Promise.all([
        databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [Query.limit(1)]),
        databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [Query.equal('status', 'open'), Query.limit(1)]),
        databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [Query.equal('status', 'in-progress'), Query.limit(1)]),
        databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [Query.equal('status', 'waiting-for-user'), Query.limit(1)]),
        databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [Query.equal('status', 'waiting-for-admin'), Query.limit(1)]),
        databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [Query.equal('status', 'resolved'), Query.limit(1)]),
        databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [Query.equal('status', 'closed'), Query.limit(1)]),
        databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [Query.equal('isUnreadByAdmin', true), Query.limit(1)])
      ]);

      return {
        total: totalResponse.total,
        open: openResponse.total,
        inProgress: inProgressResponse.total,
        waitingForUser: waitingUserResponse.total,
        waitingForAdmin: waitingAdminResponse.total,
        resolved: resolvedResponse.total,
        closed: closedResponse.total,
        unreadByAdmin: unreadResponse.total,
        averageResponseTime: 0, // Calculate this based on your needs
        totalResponseTime: 0
      };
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      throw new Error('Failed to fetch ticket statistics');
    }
  }

  /**
   * Close ticket
   */
  async closeTicket(ticketId: string): Promise<void> {
    try {
      await this.updateTicket(ticketId, { status: 'closed' });
    } catch (error) {
      console.error('Error closing ticket:', error);
      throw new Error('Failed to close ticket');
    }
  }

  /**
   * Reopen ticket
   */
  async reopenTicket(ticketId: string): Promise<void> {
    try {
      await this.updateTicket(ticketId, { status: 'open' });
    } catch (error) {
      console.error('Error reopening ticket:', error);
      throw new Error('Failed to reopen ticket');
    }
  }
}

export const ticketService = new TicketService();
export default ticketService;