export interface MailchimpContact {
  email: string;
  fullname: string;
  university?: string;
  student_id?: string;
  phone_number?: string;
}

export interface BatchResult {
  success: boolean;
  added: number;
  updated: number;
  errors: number;
  total: number;
  errorMessages?: string[];
}

class MailchimpClientService {
  async testConnection(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('/api/mailchimp/test');
      const data = await response.json();
      
      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Connection test failed'
      };
    }
  }

  async getAudienceStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      const response = await fetch('/api/mailchimp/stats');
      const data = await response.json();
      
      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch stats'
      };
    }
  }

  async addContactsBatch(contacts: MailchimpContact[]): Promise<{ success: boolean; data?: BatchResult; error?: string }> {
    try {
      const response = await fetch('/api/mailchimp/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts }),
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Batch operation failed'
      };
    }
  }

  async addContact(contact: MailchimpContact): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/mailchimp/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts: [contact] }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add contact'
      };
    }
  }
}

export const mailchimpClientService = new MailchimpClientService();