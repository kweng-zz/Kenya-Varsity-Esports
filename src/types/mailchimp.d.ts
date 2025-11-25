declare module '@mailchimp/mailchimp_marketing' {
  interface PingResponse {
    health_status: string;
  }

  interface ListMember {
    id: string;
    email_address: string;
    status: string;
    merge_fields: {
      FNAME?: string;
      LNAME?: string;
      UNIVERSITY?: string;
      STUDENTID?: string;
      PHONE?: string;
    };
  }

  interface BatchListMembersResponse {
    new_members: ListMember[];
    updated_members: ListMember[];
    errors: Array<{
      email_address: string;
      error: string;
    }>;
    total_created: number;
    total_updated: number;
    error_count: number;
  }

  interface ListStats {
    member_count: number;
    unsubscribe_count: number;
    cleaned_count: number;
  }

  interface ListResponse {
    id: string;
    name: string;
    stats: ListStats;
  }

  interface MembersResponse {
    members: ListMember[];
  }

  interface SetConfigParams {
    apiKey: string;
    server: string;
  }

  const mailchimp: {
    setConfig: (config: SetConfigParams) => void;
    ping: {
      get: () => Promise<PingResponse>;
    };
    lists: {
      addListMember: (listId: string, data: any) => Promise<ListMember>;
      batchListMembers: (listId: string, data: any) => Promise<BatchListMembersResponse>;
      getList: (listId: string) => Promise<ListResponse>;
      getListMembersInfo: (listId: string, params?: any) => Promise<MembersResponse>;
    };
  };

  export default mailchimp;
}