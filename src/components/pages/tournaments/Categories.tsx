"use client";

import React, { useEffect, useState } from "react";
import { getTournamentsPageData, SeasonInfo } from "@/lib/pagedata/tournaments";

export const CategoriesSection = () => {
  const [seasons, setSeasons] = useState<SeasonInfo[]>([]);

  useEffect(() => {
    const data = getTournamentsPageData();
    setSeasons(data.seasons);
  }, []);

  const scrollToSeason = (season: 'september' | 'january') => {
    // Scroll to the roaster section
    const roasterSection = document.getElementById('roaster-section');
    if (roasterSection) {
      roasterSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // After scrolling, highlight the specific season
      setTimeout(() => {
        const seasonElement = document.getElementById(
          season === 'september' ? 'september-season' : 'january-season'
        );
        if (seasonElement) {
          seasonElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 500);
    }
  };

  return (
    <section className="w-full py-20 bg-[#0c0e11]">
      <div className="container mx-auto px-4">
        {/* Title aligned to the right */}
        <div className="mb-16 text-left">
          <h2 className="font-bold text-[46px] tracking-[1.84px] text-white">
            CATEGORIES
          </h2>
        </div>

        {/* Dynamic seasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 justify-items-center">
          {seasons.map((season) => (
            <div 
              key={season.id}
              className="w-[360px] h-[367px] overflow-hidden bg-black cursor-pointer group relative"
              onClick={() => scrollToSeason(season.name as 'september' | 'january')}
            >
              <img
                src={season.image}
                alt={season.subtitle}
                className="w-[424.96px] h-[367px] object-cover rounded-lg border border-white/50 transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-110 group-hover:border-[#961c18]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-season.png';
                }}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#961c18]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center pb-6">
                <div className="text-center">
                  <h3 className="text-white text-xl font-bold mb-2">{season.subtitle}</h3>
                  <p className="text-white/90 text-sm">
                    {season.isActive ? 'Click to view tournaments' : 'Coming Soon'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {!season.isActive && (
                <div className="absolute top-4 right-4 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">
                  Coming Soon
                </div>
              )}

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(150,28,24,0.5)]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

