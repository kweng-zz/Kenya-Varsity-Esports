/**
 * Tournament schema and initialization utilities
 * This module handles tournament data initialization and schema management
 */

import { Client, Databases } from 'appwrite';

// Lazy initialization to avoid build-time issues
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for tournament schema');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for tournament schema');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for tournament schema:', error);
      return null;
    }
  }
  return databases;
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';

/**
 * Initialize tournament data for a specific game
 * This function can be used to set up initial tournament data or perform
 * any necessary initialization when a tournament page is accessed
 * 
 * @param gameSlug - The slug identifier for the game
 * @param gameName - The display name of the game
 */
export const initializeTournamentData = async (gameSlug: string, gameName: string): Promise<void> => {
  try {
    // Log the initialization for debugging
    console.log(`🎮 Initializing tournament data for ${gameName} (${gameSlug})`);
    
    // Here you can add any initialization logic needed for tournaments
    // For example:
    // - Check if tournament data exists
    // - Create default tournament entries
    // - Set up game-specific configurations
    // - Initialize leaderboards
    
    // For now, this is a placeholder that logs the initialization
    // You can expand this function based on your specific requirements
    
    // Example: You might want to ensure a tournament collection exists for this game
    // or perform other setup tasks
    
  } catch (error) {
    console.error(`❌ Error initializing tournament data for ${gameName}:`, error);
    // Don't throw the error to prevent breaking the UI
    // Tournament pages should still work even if initialization fails
  }
};

/**
 * Tournament schema types and interfaces
 * Add your tournament-related types here as needed
 */
export interface TournamentInitializationOptions {
  gameSlug: string;
  gameName: string;
  createDefaults?: boolean;
  setupLeaderboards?: boolean;
}

/**
 * Extended initialization function with options
 * Use this for more complex initialization scenarios
 */
export const initializeTournamentDataWithOptions = async (
  options: TournamentInitializationOptions
): Promise<void> => {
  try {
    console.log(`🎮 Initializing tournament data with options:`, options);
    
    const { gameSlug, gameName, createDefaults = false, setupLeaderboards = false } = options;
    
    // Perform basic initialization
    await initializeTournamentData(gameSlug, gameName);
    
    // Additional initialization based on options
    if (createDefaults) {
      // Create default tournament entries
      console.log(`📝 Creating default tournament entries for ${gameName}`);
    }
    
    if (setupLeaderboards) {
      // Set up leaderboards
      console.log(`🏆 Setting up leaderboards for ${gameName}`);
    }
    
  } catch (error) {
    console.error(`❌ Error in extended tournament initialization:`, error);
  }
};

const tournamentSchema = {
  initializeTournamentData,
  initializeTournamentDataWithOptions,
};

export default tournamentSchema;