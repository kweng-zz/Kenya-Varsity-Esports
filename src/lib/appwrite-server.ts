import { Client, Databases, Query, Account } from 'node-appwrite';

// Server-side Appwrite configuration with API key authentication
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (client && databases) {
    return { client, databases };
  }

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    console.error('Appwrite server configuration missing:', {
      endpoint: !!endpoint,
      projectId: !!projectId,
      apiKey: !!apiKey
    });
    return null;
  }

  try {
    client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    databases = new Databases(client);
    console.log('✅ Appwrite server client initialized');
    return { client, databases };
  } catch (error) {
    console.error('Failed to initialize Appwrite server client:', error);
    return null;
  }
};

export const getAppwriteServer = () => {
  return initializeAppwrite();
};

/**
 * Creates an Appwrite client authenticated with a user's JWT token
 * @param jwt The JWT token from the client-side session bridge
 */
export const getSessionClient = (jwt: string) => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!endpoint || !projectId) {
    console.error('❌ Missing Appwrite env vars for session client:', { endpoint: !!endpoint, projectId: !!projectId });
    return null;
  }

  console.log(`🔌 Initializing session client with JWT for project: ${projectId}`);
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setJWT(jwt); // Use JWT for user impersonation

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    }
  };
};

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
export const COLLECTIONS = {
  RANKINGS: process.env.NEXT_PUBLIC_APPWRITE_RANKINGS_COLLECTION_ID || 'rankings',
  REGIONS: process.env.NEXT_PUBLIC_APPWRITE_REGIONS_COLLECTION_ID || 'regions',
  REGIONAL_RANKINGS: process.env.NEXT_PUBLIC_APPWRITE_REGIONAL_RANKINGS_COLLECTION_ID || 'regional_rankings',
  GAME_CATEGORIES: process.env.NEXT_PUBLIC_APPWRITE_GAME_CATEGORIES_COLLECTION_ID || 'game-categories',
  UNIVERSITIES: process.env.NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID || 'universities',
  SPONSORS: process.env.NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID || 'sponsors',
  CONTACT_MESSAGES: process.env.NEXT_PUBLIC_APPWRITE_CONTACT_MESSAGES_COLLECTION_ID || 'contact-messages',
  EVENTS: process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID || 'events',
};

// Helper function to handle Appwrite errors
export const handleAppwriteError = (error: any) => {
  console.error('Appwrite error:', error);
  return {
    success: false,
    error: error.message || 'An error occurred',
    data: null
  };
};

// Helper function for successful responses
export const handleAppwriteSuccess = (data: any, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

export { Query };
