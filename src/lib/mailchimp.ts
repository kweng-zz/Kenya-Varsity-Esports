// @ts-ignore - No types available for this package
import mailchimp from '@mailchimp/mailchimp_marketing';

export interface MailchimpContact {
  email: string;
  fullname: string;
  university?: string;
  student_id?: string;
  phone_number?: string;
}

export interface MailchimpStats {
  totalSubscribers: number;
  unsubscribeCount: number;
  cleanedCount: number;
  audienceName: string;
}

export interface BatchResult {
  success: boolean;
  added: number;
  updated: number;
  errors: number;
  total: number;
  errorMessages?: string[];
}

class MailchimpService {
  private isConfigured = false;

  constructor() {
    this.configure();
  }

  private configure() {
    // Use NEXT_PUBLIC_ prefix for client-side access
    const apiKey = process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY;
    const server = process.env.NEXT_PUBLIC_MAILCHIMP_SERVER_PREFIX;
    const audienceId = process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID;

    console.log('🔧 Mailchimp Config Check:', {
      hasApiKey: !!apiKey,
      hasServer: !!server,
      hasAudienceId: !!audienceId,
      apiKeyLength: apiKey?.length,
      server,
      audienceId
    });

    if (!apiKey || !server || !audienceId) {
      console.warn('❌ Mailchimp environment variables are not fully configured');
      console.warn('API Key:', apiKey ? 'Present' : 'Missing');
      console.warn('Server Prefix:', server || 'Missing');
      console.warn('Audience ID:', audienceId || 'Missing');
      return;
    }

    try {
      mailchimp.setConfig({
        apiKey,
        server,
      });
      this.isConfigured = true;
      console.log('✅ Mailchimp configured successfully');
    } catch (error) {
      console.error('❌ Failed to configure Mailchimp:', error);
    }
  }

  private checkConfiguration(): boolean {
    if (!this.isConfigured) {
      console.error('Mailchimp is not properly configured. Check your environment variables.');
      return false;
    }
    return true;
  }

  async testConnection(): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.checkConfiguration()) {
      return { success: false, error: 'Mailchimp not configured. Check NEXT_PUBLIC_MAILCHIMP_API_KEY, NEXT_PUBLIC_MAILCHIMP_SERVER_PREFIX, and NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID environment variables.' };
    }

    try {
      const response = await mailchimp.ping.get();
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Mailchimp connection test failed:', error);
      return {
        success: false,
        error: error.response?.body?.title || error.message || 'Connection failed'
      };
    }
  }

  async addContact(contact: MailchimpContact): Promise<{ success: boolean; error?: string }> {
    if (!this.checkConfiguration()) {
      return { success: false, error: 'Mailchimp not configured' };
    }

    try {
      await mailchimp.lists.addListMember(
        process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID!,
        {
          email_address: contact.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: contact.fullname.split(' ')[0] || '',
            LNAME: contact.fullname.split(' ').slice(1).join(' ') || '',
            UNIVERSITY: contact.university || '',
            STUDENTID: contact.student_id || '',
            PHONE: contact.phone_number || '',
          },
        }
      );
      return { success: true };
    } catch (error: any) {
      console.error('Mailchimp add contact error:', error);

      if (error.status === 400) {
        if (error.response?.body?.title === 'Member Exists') {
          return { success: false, error: 'Already subscribed' };
        }
        return { success: false, error: 'Invalid email address' };
      }

      return {
        success: false,
        error: error.response?.body?.title || error.message || 'Failed to add contact'
      };
    }
  }

  async addContactsBatch(contacts: MailchimpContact[]): Promise<{ success: boolean; data?: BatchResult; error?: string }> {
    if (!this.checkConfiguration()) {
      return { success: false, error: 'Mailchimp not configured' };
    }

    if (contacts.length === 0) {
      return { success: false, error: 'No contacts to add' };
    }

    try {
      // Process in smaller batches to avoid timeouts
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < contacts.length; i += batchSize) {
        batches.push(contacts.slice(i, i + batchSize));
      }

      let totalAdded = 0;
      let totalUpdated = 0;
      let totalErrors = 0;
      const errorMessages: string[] = [];

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Processing batch ${i + 1}/${batches.length} with ${batch.length} contacts`);

        const members = batch.map(contact => ({
          email_address: contact.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: contact.fullname.split(' ')[0] || '',
            LNAME: contact.fullname.split(' ').slice(1).join(' ') || '',
            UNIVERSITY: contact.university || '',
            STUDENTID: contact.student_id || '',
            PHONE: contact.phone_number || '',
          },
        }));

        const response = await mailchimp.lists.batchListMembers(
          process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID!,
          {
            members,
            update_existing: true,
          }
        );

        totalAdded += response.new_members?.length || 0;
        totalUpdated += response.updated_members?.length || 0;
        totalErrors += response.errors?.length || 0;

        if (response.errors && response.errors.length > 0) {
          response.errors.forEach((error: any) => {
            errorMessages.push(`${error.email_address}: ${error.error}`);
          });
        }
      }

      const batchResult: BatchResult = {
        success: true,
        added: totalAdded,
        updated: totalUpdated,
        errors: totalErrors,
        total: contacts.length,
        errorMessages: errorMessages.length > 0 ? errorMessages : undefined
      };

      return {
        success: true,
        data: batchResult
      };
    } catch (error: any) {
      console.error('Mailchimp batch add error:', error);
      return {
        success: false,
        error: error.response?.body?.title || error.message || 'Batch operation failed'
      };
    }
  }

  async getAudienceStats(): Promise<MailchimpStats | null> {
    if (!this.checkConfiguration()) {
      return null;
    }

    try {
      const response = await mailchimp.lists.getList(process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID!);
      return {
        totalSubscribers: response.stats.member_count,
        unsubscribeCount: response.stats.unsubscribe_count,
        cleanedCount: response.stats.cleaned_count,
        audienceName: response.name
      };
    } catch (error: any) {
      console.error('Mailchimp stats error:', error);
      return null;
    }
  }

  async getRecentSubscribers(count: number = 10): Promise<any[]> {
    if (!this.checkConfiguration()) {
      return [];
    }

    try {
      const response = await mailchimp.lists.getListMembersInfo(process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID!, {
        count,
        sort_field: 'timestamp_opt',
        sort_dir: 'DESC'
      });
      return response.members || [];
    } catch (error: any) {
      console.error('Mailchimp get subscribers error:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const mailchimpService = new MailchimpService();