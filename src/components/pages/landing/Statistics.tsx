'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface StatItem {
  id: string;
  number: string;
  label: string;
}

interface StatisticsData {
  seasonTitle: string;
  image: string;
  seasonNumber: number;
  stats: StatItem[];
}

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

const StatItemComponent = ({ number, label }: { number: string; label: string }) => (
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
  const [stats, setStats] = useState<StatItem[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(
    '/images/Join our tournaments.png'
  );
  const [seasonNumber, setSeasonNumber] = useState<number>(3);
  const [titleText, setTitleText] = useState('STATISTICS OF SEASON 3');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/statistics');
        const data = await response.json();
        
        if (data.success && data.data) {
          const statsData = data.data;
          setStats(statsData.stats);
          setImageUrl(statsData.image);
          setSeasonNumber(statsData.seasonNumber);
          setTitleText(statsData.seasonTitle);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Use default stats if fetch fails
        const defaultStats: StatItem[] = [
          { id: '1', number: '50+', label: 'Universities\nParticipating' },
          { id: '2', number: '1000+', label: 'Active\nPlayers' },
          { id: '3', number: '25+', label: 'Tournaments\nCompleted' },
          { id: '4', number: '100K+', label: 'Prize Pool\nDistributed' },
          { id: '5', number: '15+', label: 'Game\nTitles' },
        ];
        setStats(defaultStats);
        setTitleText('STATISTICS OF SEASON 3');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-black py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 animate-pulse">
              <div className="w-full h-[400px] bg-gray-800 rounded-none"></div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-12">
                Loading...
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 w-full">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-700">
                      <div className="w-6 h-6 bg-gray-600 rounded"></div>
                    </div>
                    <div>
                      <p className="text-4xl font-semibold text-gray-600">--</p>
                      <p className="text-sm font-normal text-gray-500">Loading...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
              unoptimized
              loading="eager"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/Join our tournaments.png';
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
                  key={stat.id}
                  className={`sm:col-span-1 ${
                    idx === 4 ? 'sm:col-span-2 lg:col-span-1 sm:col-start-1 lg:col-start-3 lg:row-start-1 mt-5 flex justify-center' : ''
                  }`}
                >
                  <StatItemComponent number={stat.number} label={stat.label} />
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