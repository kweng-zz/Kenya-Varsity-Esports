/**
 * Listmonk Client Service
 * 
 * Client-side service for interacting with Listmonk via API routes
 */

export interface ListmonkContact {
  email: string;
  fullname: string;
  university?: string;
  student_id?: string;
  phone_number?: string;
  subscribeNewsletter?: boolean;
}

export interface BatchResult {
  success: boolean;
  added: number;
  updated: number;
  errors: number;
  total: number;
}

class ListmonkClientService {
  /**
   * Test connection to the newsletter service
   */
  async testConnection(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('/api/newsletter/test');
      const data = await response.json();
      return data;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get newsletter statistics
   */
  async getStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('/api/newsletter/stats');
      const data = await response.json();
      return data;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Add multiple contacts in batch
   */
  async addContactsBatch(contacts: ListmonkContact[]): Promise<{ success: boolean; data?: BatchResult; error?: string }> {
    try {
      const response = await fetch('/api/newsletter/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts }),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Add a single contact
   */
  async addContact(contact: ListmonkContact): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/newsletter/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: [{
            email: contact.email,
            name: contact.fullname,
            university: contact.university,
            student_id: contact.student_id,
            phone_number: contact.phone_number,
            subscribeNewsletter: contact.subscribeNewsletter,
          }],
        }),
      });
      const data = await response.json();
      return { success: data.success, error: data.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Subscribe to newsletter (public endpoint)
   */
  async subscribe(email: string, tags?: string[]): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tags }),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const listmonkClientService = new ListmonkClientService();

// Legacy export for backwards compatibility
export const mailchimpClientService = listmonkClientService;

// Re-export types with legacy names
export type MailchimpContact = ListmonkContact;
