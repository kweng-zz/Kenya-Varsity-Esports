import { Client, Databases, Account, Storage, Query } from 'appwrite';

// Appwrite configuration
const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

// Initialize services
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
export const COLLECTIONS = {
    RANKINGS: process.env.NEXT_PUBLIC_APPWRITE_RANKINGS_COLLECTION_ID || '',
    REGIONS: process.env.NEXT_PUBLIC_APPWRITE_REGIONS_COLLECTION_ID || '',
    REGIONAL_RANKINGS: process.env.NEXT_PUBLIC_APPWRITE_REGIONAL_RANKINGS_COLLECTION_ID || 'regional_rankings',
    GAME_CATEGORIES: process.env.NEXT_PUBLIC_APPWRITE_GAME_CATEGORIES_COLLECTION_ID || '',
    UNIVERSITIES: process.env.NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID || '',
    SPONSORS: process.env.NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID || '',
    CONTACT_MESSAGES: process.env.NEXT_PUBLIC_APPWRITE_CONTACT_MESSAGES_COLLECTION_ID || '',
    EVENTS: process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID || '',
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

export { client, Query };