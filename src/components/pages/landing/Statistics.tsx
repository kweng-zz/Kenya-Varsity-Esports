'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Client, Databases, Models } from 'appwrite';

// --- Types ---
interface SeasonStatsDoc {
  $id: string;
  number: string;
  label: string;
  image?: string;
  seasonNumber?: number;
  seasonStatus?: 'active' | 'completed';
  seasonEndDate?: string;
  eventImage?: string;
}

interface SeasonInfo {
  seasonNumber: number;
}

// --- Appwrite Setup with lazy initialization ---
let client: Client | null = null;
let databases: Databases | null = null;

const initializeAppwrite = () => {
  // Check if we're in fallback mode
  if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true') {
    console.log('Fallback mode enabled, Appwrite disabled for statistics');
    return null;
  }

  if (!client) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
      console.warn('Appwrite configuration missing for statistics, using fallback data');
      return null;
    }

    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      console.warn('Appwrite endpoint is invalid for statistics, using fallback data');
      return null;
    }

    try {
      client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      databases = new Databases(client);
    } catch (error) {
      console.error('Failed to initialize Appwrite client for statistics:', error);
      return null;
    }
  }
  return databases;
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const COLLECTION_ID = 'season_statistics';

// --- Icon ---
const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <div className="flex items-center gap-4">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#961c18]">
      <StarIcon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-4xl font-semibold text-white">{number}</p>
      <p className="text-sm font-normal text-gray-400 whitespace-pre-line tracking-wider">{label}</p>
    </div>
  </div>
);

const SeasonStatistics = () => {
  const [stats, setStats] = useState<SeasonStatsDoc[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(
    'https://placehold.co/600x400/111111/FFFFFF?text=Event+Image'
  );
  const [seasonInfo, setSeasonInfo] = useState<SeasonInfo>({
    seasonNumber: 3
  });
  const [titleText, setTitleText] = useState('SEASON STATISTICS');

  // Helper function to determine season info
  const getSeasonNumber = (documents: Record<string, unknown>[]): number => {
    const currentSeasonDoc = documents.find(doc => 
      doc.$id === 'current_season_settings' || doc.seasonStatus === 'active'
    );
    return (currentSeasonDoc?.seasonNumber as number) || 2;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const db = initializeAppwrite();
        if (!db) {
          // Use fallback data if Appwrite is not configured
          const defaultStats: SeasonStatsDoc[] = [
            { $id: '1', number: '50+', label: 'Universities\nParticipating', seasonNumber: 2 },
            { $id: '2', number: '1000+', label: 'Active\nPlayers', seasonNumber: 2 },
            { $id: '3', number: '25+', label: 'Tournaments\nCompleted', seasonNumber: 2 },
            { $id: '4', number: '100K+', label: 'Prize Pool\nDistributed', seasonNumber: 2 },
            { $id: '5', number: '15+', label: 'Game\nTitles', seasonNumber: 2 },
          ];
          setStats(defaultStats);
          setTitleText('SEASON 2 STATISTICS');
          return;
        }

        const response = await db.listDocuments(DB_ID, COLLECTION_ID);

        // Get season number
        const seasonNumber = getSeasonNumber(response.documents);
        setSeasonInfo({ seasonNumber });

        // Filter statistics for the previous season (exclude settings document)
        const statisticsOnly = response.documents.filter(doc => 
          doc.$id !== 'current_season_settings' && 
          doc.label !== 'Current Season Info'
        );

        // Map Appwrite documents to SeasonStatsDoc safely
        const mapped: SeasonStatsDoc[] = statisticsOnly.map(doc => ({
          $id: doc.$id,
          number: doc.number ?? '',
          label: doc.label ?? '',
          image: doc.image,
          seasonNumber: doc.seasonNumber,
          seasonStatus: doc.seasonStatus,
          seasonEndDate: doc.seasonEndDate,
          eventImage: doc.eventImage
        }));

        setStats(mapped);

        // Set the event image from the statistics data
        const eventImage = mapped.find(doc => doc.eventImage)?.eventImage;
        if (eventImage) {
          setImageUrl(eventImage);
        }

        // Set dynamic title with season number (previous season stats usually)
        setTitleText(`STATISTICS OF SEASON ${seasonNumber - 1}`);

      } catch (err) {
        console.error('Error fetching stats:', err);
        // Set default stats if fetch fails
        const defaultStats: SeasonStatsDoc[] = [
          { $id: '1', number: '50+', label: 'Universities\nParticipating', seasonNumber: 2 },
          { $id: '2', number: '1000+', label: 'Active\nPlayers', seasonNumber: 2 },
          { $id: '3', number: '25+', label: 'Tournaments\nCompleted', seasonNumber: 2 },
          { $id: '4', number: '100K+', label: 'Prize Pool\nDistributed', seasonNumber: 2 },
          { $id: '5', number: '15+', label: 'Game\nTitles', seasonNumber: 2 },
        ];
        setStats(defaultStats);
        setTitleText('SEASON 2 STATISTICS');
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="w-full bg-black py-16 sm:py-24 relative">
      {/* Background images */}
      <div
        className="absolute pointer-events-none"
        style={{
          backgroundImage: "url('/images/Mask Group.png')",
          backgroundPosition: "left",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto",
          transform: "rotate(180deg) scaleX(-1)",
          top: '20px',
          left: '0px',
          width: '800px',
          height: '400px',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          backgroundImage: "url('/images/Mask Group.png')",
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto",
          transform: "scaleX(-1)",
          bottom: '0px',
          right: '0px',
          width: '230px',
          height: '400px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Image */}
          <div className="w-full lg:w-1/2">
            <Image
                src={imageUrl}
                alt="Trophies from a previous season's e-sports event"
                width={600}
                height={400}
                className="w-full h-auto rounded-none shadow-2xl object-cover"
                unoptimized // <-- bypass Next.js optimization (required for SVG)
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://placehold.co/600x400/111111/FFFFFF?text=Event+Image';
                }}
                />
          </div>

          {/* Right: Statistics */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-12">
              {titleText}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 w-full">
              {stats.map((stat, idx) => (
                <div
                  key={stat.$id}
                  className={`sm:col-span-1 ${
                    idx === 4 ? 'sm:col-span-2 lg:col-span-1 sm:col-start-1 lg:col-start-3 lg:row-start-1 mt-5 flex justify-center' : ''
                  }`}
                >
                  <StatItem number={stat.number} label={stat.label} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonStatistics;
