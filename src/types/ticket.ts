/**
 * Ticket Management System Types
 */

export interface Ticket {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  ticketId: string; // Human-readable ID like TKT-123456
  title: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  userId: string; // User who created the ticket
  userName: string; // Name of user who created the ticket
  assignedTo?: string; // Admin user ID
  attachmentUrl?: string;
  attachmentName?: string;
  lastResponseAt?: string;
  responseCount: number;
  isUnreadByUser: boolean;
  isUnreadByAdmin: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TicketResponse {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  ticketId: string;
  message: string;
  isAdminResponse: boolean;
  userId: string; // ID of user who sent the response
  userName: string; // Name of user who sent the response
  attachmentUrl?: string;
  attachmentName?: string;
  isInternal?: boolean; // For admin-only notes
}

export interface TicketUser {
  $id: string;
  name: string;
  email: string;
  university?: string;
  isAdmin: boolean;
}

export type TicketStatus = 
  | 'open' 
  | 'in-progress' 
  | 'waiting-for-user' 
  | 'waiting-for-admin' 
  | 'resolved' 
  | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  subject?: string[];
  assignedTo?: string;
  userId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  unreadOnly?: boolean;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  waitingForUser: number;
  waitingForAdmin: number;
  resolved: number;
  closed: number;
  unreadByAdmin: number;
  averageResponseTime: number; // in hours
  totalResponseTime: number;
}

export interface CreateTicketData {
  title: string;
  subject: string;
  message: string;
  priority?: TicketPriority;
  attachment?: File;
}

export interface CreateResponseData {
  ticketId: string;
  message: string;
  isInternal?: boolean;
  attachment?: File;
}

export interface UpdateTicketData {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  tags?: string[];
}

// Subject categories with their default priorities
export const TICKET_SUBJECTS = {
  'General Support': 'medium',
  'Tournament Registration': 'high',
  'Account Issues': 'high',
  'Technical Problems': 'medium',
  'Payment & Billing': 'high',
  'Student Verification': 'medium',
  'Rankings & Leaderboards': 'low',
  'Bug Report': 'medium',
  'Feature Request': 'low'
} as const;

export const TICKET_STATUS_LABELS = {
  'open': 'Open',
  'in-progress': 'In Progress',
  'waiting-for-user': 'Waiting for User',
  'waiting-for-admin': 'Waiting for Admin',
  'resolved': 'Resolved',
  'closed': 'Closed'
} as const;

export const TICKET_PRIORITY_LABELS = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
  'urgent': 'Urgent'
} as const;

export const TICKET_STATUS_COLORS = {
  'open': 'bg-blue-500',
  'in-progress': 'bg-yellow-500',
  'waiting-for-user': 'bg-orange-500',
  'waiting-for-admin': 'bg-purple-500',
  'resolved': 'bg-green-500',
  'closed': 'bg-gray-500'
} as const;

export const TICKET_PRIORITY_COLORS = {
  'low': 'bg-gray-500',
  'medium': 'bg-blue-500',
  'high': 'bg-orange-500',
  'urgent': 'bg-red-500'
} as const;