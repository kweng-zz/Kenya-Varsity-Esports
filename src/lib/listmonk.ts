/**
 * Listmonk Newsletter Service
 * 
 * Self-hosted newsletter and mailing list manager
 * API Documentation: https://listmonk.app/docs/apis/apis/
 */

export interface ListmonkContact {
  email: string;
  name: string;
  university?: string;
  student_id?: string;
  phone_number?: string;
  tags?: string[];
}

export interface ListmonkStats {
  totalSubscribers: number;
  activeSubscribers: number;
  blockedSubscribers: number;
  listName: string;
}

export interface BatchResult {
  success: boolean;
  added: number;
  updated: number;
  errors: number;
  total: number;
  errorMessages?: string[];
}

interface ListmonkSubscriber {
  id: number;
  email: string;
  name: string;
  status: 'enabled' | 'disabled' | 'blocklisted';
  lists: { id: number; name: string }[];
  attribs: Record<string, any>;
  created_at: string;
  updated_at: string;
}

class ListmonkService {
  private baseUrl: string;
  private username: string;
  private password: string;
  private listId: number;
  private isConfigured = false;

  constructor() {
    this.baseUrl = process.env.LISTMONK_URL || '';
    this.username = process.env.LISTMONK_USERNAME || '';
    this.password = process.env.LISTMONK_PASSWORD || '';
    this.listId = parseInt(process.env.LISTMONK_LIST_ID || '1', 10);

    this.checkConfiguration();
  }

  private checkConfiguration(): boolean {
    if (!this.baseUrl || !this.username || !this.password) {
      console.warn('⚠️ Listmonk is not fully configured. Check LISTMONK_URL, LISTMONK_USERNAME, LISTMONK_PASSWORD environment variables.');
      this.isConfigured = false;
      return false;
    }
    this.isConfigured = true;
    console.log('✅ Listmonk configured:', { url: this.baseUrl, listId: this.listId });
    return true;
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
    return `Basic ${credentials}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    if (!this.isConfigured) {
      return { success: false, error: 'Listmonk not configured' };
    }

    const auth = this.getAuthHeader();
    // DEBUG: Log credentials (safely)
    console.log(`[Listmonk] Connecting to: ${this.baseUrl}`);
    console.log(`[Listmonk] User: '${this.username}' (Length: ${this.username.length})`);
    console.log(`[Listmonk] Pass: '${this.password.substring(0, 1)}***' (Length: ${this.password.length})`);
    console.log(`[Listmonk] Auth Header: ${auth.substring(0, 20)}...`);

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Listmonk API error (${response.status}):`, errorBody);
        return {
          success: false,
          error: `API error: ${response.status} - ${errorBody}`
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      console.error('Listmonk request error:', error);
      return { success: false, error: error.message || 'Request failed' };
    }
  }

  /**
   * Test connection to Listmonk instance
   */
  async testConnection(): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.isConfigured) {
      return { 
        success: false, 
        error: 'Listmonk not configured. Check LISTMONK_URL, LISTMONK_USERNAME, LISTMONK_PASSWORD environment variables.' 
      };
    }

    const result = await this.request<{ data: any[] }>('/api/lists');
    if (result.success) {
      return { success: true, data: { message: 'Connection successful', lists: result.data } };
    }
    return result;
  }

  /**
   * Add a single subscriber to Listmonk
   */
  async addContact(contact: ListmonkContact): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured) {
      return { success: false, error: 'Listmonk not configured' };
    }

    const payload = {
      email: contact.email.trim().toLowerCase(),
      name: contact.name || contact.email.split('@')[0],
      status: 'enabled',
      lists: [this.listId],
      preconfirm_subscriptions: true, // Skip double opt-in
      attribs: {
        university: contact.university || '',
        student_id: contact.student_id || '',
        phone: contact.phone_number || '',
        source: 'website',
        tags: contact.tags || ['website-signup'],
      },
    };

    const result = await this.request<{ data: ListmonkSubscriber }>('/api/subscribers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (result.success) {
      console.log('✅ Subscriber added to Listmonk:', contact.email);
      return { success: true };
    }

    // Handle "already exists" case
    if (result.error?.includes('already exists') || result.error?.includes('duplicate')) {
      return { success: false, error: 'Already subscribed' };
    }

    return { success: false, error: result.error };
  }

  /**
   * Add multiple subscribers in batch
   */
  async addContactsBatch(contacts: ListmonkContact[]): Promise<{ success: boolean; data?: BatchResult; error?: string }> {
    if (!this.isConfigured) {
      return { success: false, error: 'Listmonk not configured' };
    }

    if (contacts.length === 0) {
      return { success: false, error: 'No contacts to add' };
    }

    let added = 0;
    let updated = 0;
    let errors = 0;
    const errorMessages: string[] = [];

    // Process contacts one by one (Listmonk doesn't have a native batch endpoint)
    // For large batches, consider using the import CSV feature
    for (const contact of contacts) {
      const result = await this.addContact(contact);
      if (result.success) {
        added++;
      } else if (result.error === 'Already subscribed') {
        updated++; // Count as updated since they're already in the list
      } else {
        errors++;
        errorMessages.push(`${contact.email}: ${result.error}`);
      }
    }

    return {
      success: true,
      data: {
        success: errors === 0,
        added,
        updated,
        errors,
        total: contacts.length,
        errorMessages: errorMessages.length > 0 ? errorMessages : undefined,
      },
    };
  }

  /**
   * Get list statistics
   */
  async getListStats(): Promise<ListmonkStats | null> {
    if (!this.isConfigured) {
      return null;
    }

    try {
      // Get list info
      const listResult = await this.request<{ data: { id: number; name: string; subscriber_count: number }[] }>('/api/lists');
      if (!listResult.success || !listResult.data) {
        return null;
      }

      const list = (listResult.data as any).data?.find((l: any) => l.id === this.listId);
      if (!list) {
        console.warn('List not found:', this.listId);
        return null;
      }

      // Get subscriber counts by status
      const statsResult = await this.request<{ data: { total: number } }>(`/api/subscribers?list_id=${this.listId}&per_page=1`);

      return {
        totalSubscribers: list.subscriber_count || 0,
        activeSubscribers: list.subscriber_count || 0,
        blockedSubscribers: 0,
        listName: list.name,
      };
    } catch (error: any) {
      console.error('Listmonk stats error:', error);
      return null;
    }
  }

  /**
   * Get recent subscribers
   */
  async getRecentSubscribers(count: number = 10): Promise<any[]> {
    if (!this.isConfigured) {
      return [];
    }

    const result = await this.request<{ data: { results: ListmonkSubscriber[] } }>(
      `/api/subscribers?list_id=${this.listId}&per_page=${count}&order_by=created_at&order=desc`
    );

    if (result.success && result.data) {
      return (result.data as any).data?.results || [];
    }

    return [];
  }
}

// Export a singleton instance
export const listmonkService = new ListmonkService();

// Re-export with legacy name for backwards compatibility during migration
export const mailchimpService = listmonkService;
