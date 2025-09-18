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

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

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
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
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
    // Re-run the effect
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
      'season_statistics'
    );
    // ... (same logic as above)
  };

  return {
    ...seasonInfo,
    refreshSeasonInfo
  };
};