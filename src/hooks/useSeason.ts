'use client';

import { useState, useEffect } from 'react';
import { Client, Databases } from 'appwrite';

interface SeasonInfo {
  currentSeason: number;
  previousSeason: number;
  isTransitioning: boolean;
  seasonEndDate?: Date;
  eventImage?: string;
  loading: boolean;
  error?: string;
}

// Lazy initialization to avoid build-time issues
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for season hook, using fallback data');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for season hook, using fallback data');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for season hook:', error);
      return null;
    }
  }
  return databases;
};

export const useSeason = () => {
  const [seasonInfo, setSeasonInfo] = useState<SeasonInfo>({
    currentSeason: 3,
    previousSeason: 2,
    isTransitioning: false,
    loading: true
  });

  useEffect(() => {
    const fetchSeasonInfo = async () => {
      try {
        const db = initializeAppwrite();
        if (!db) {
          // Use fallback data if Appwrite is not configured
          setSeasonInfo(prev => ({
            ...prev,
            loading: false
          }));
          return;
        }

        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '',
          'season_statistics'
        );

        // Find current season settings
        const currentSeasonDoc = response.documents.find(doc => 
          doc.$id === 'current_season_settings' || 
          (doc.label === 'Current Season Info' && doc.seasonStatus === 'active')
        );

        if (currentSeasonDoc) {
          const currentDate = new Date();
          const seasonEndDate = currentSeasonDoc.seasonEndDate ? new Date(currentSeasonDoc.seasonEndDate) : null;
          const isTransitioning = Boolean(seasonEndDate && currentDate > seasonEndDate);
          
          const currentSeason = currentSeasonDoc.seasonNumber || 3;
          
          setSeasonInfo({
            currentSeason: isTransitioning ? currentSeason + 1 : currentSeason,
            previousSeason: isTransitioning ? currentSeason : currentSeason - 1,
            isTransitioning,
            seasonEndDate: seasonEndDate || undefined,
            eventImage: currentSeasonDoc.eventImage,
            loading: false
          });
        } else {
          // Fallback to default values
          setSeasonInfo(prev => ({
            ...prev,
            loading: false
          }));
        }
      } catch (error) {
        console.error('Error fetching season info:', error);
        setSeasonInfo(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load season information'
        }));
      }
    };

    fetchSeasonInfo();
  }, []);

  const refreshSeasonInfo = async () => {
    setSeasonInfo(prev => ({ ...prev, loading: true }));
    
    try {
      const db = initializeAppwrite();
      if (!db) {
        setSeasonInfo(prev => ({
          ...prev,
          loading: false
        }));
        return;
      }

      const response = await db.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '',
        'season_statistics'
      );

      // Find current season settings
      const currentSeasonDoc = response.documents.find(doc => 
        doc.$id === 'current_season_settings' || 
        (doc.label === 'Current Season Info' && doc.seasonStatus === 'active')
      );

      if (currentSeasonDoc) {
        const currentDate = new Date();
        const seasonEndDate = currentSeasonDoc.seasonEndDate ? new Date(currentSeasonDoc.seasonEndDate) : null;
        const isTransitioning = Boolean(seasonEndDate && currentDate > seasonEndDate);
        
        const currentSeason = currentSeasonDoc.seasonNumber || 3;
        
        setSeasonInfo({
          currentSeason: isTransitioning ? currentSeason + 1 : currentSeason,
          previousSeason: isTransitioning ? currentSeason : currentSeason - 1,
          isTransitioning,
          seasonEndDate: seasonEndDate || undefined,
          eventImage: currentSeasonDoc.eventImage,
          loading: false
        });
      } else {
        // Fallback to default values
        setSeasonInfo(prev => ({
          ...prev,
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error refreshing season info:', error);
      setSeasonInfo(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to refresh season information'
      }));
    }
  };

  return {
    ...seasonInfo,
    refreshSeasonInfo
  };
};