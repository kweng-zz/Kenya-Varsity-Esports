'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";

interface RegionInfo {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  backgroundImage: string;
  isActive: boolean;
}

export const GamePackageSection = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [regions, setRegions] = useState<RegionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/regions');
        const result = await response.json();
        
        if (result.success && result.data) {
          setRegions(result.data);
          console.log(`Loaded ${result.data.length} regions from ${result.source}`);
        } else {
          console.error('Failed to load regions:', result.error);
          setRegions([]);
        }
      } catch (error) {
        console.error('Error loading regions:', error);
        setRegions([]);
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  const handleRegionClick = (region: RegionInfo) => {
    if (!region.isActive) {
      setSelectedRegion(region.name);
      setShowComingSoonModal(true);
    }
  };

  const closeModal = () => {
    setShowComingSoonModal(false);
    setSelectedRegion('');
  };

  if (loading) {
    return (
      <section className="w-full relative">
        <div className="relative w-full h-full bg-[url(https://c.animaapp.com/mdpqpsw8vIfLwh/img/group-677.png)] bg-cover bg-center">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="font-['Hind',Helvetica] font-bold text-5xl tracking-wider leading-[70.2px] mt-25">
              <span className="text-white">KUER </span>
              <span className="text-[#961c18]">SEASON 2</span>
              <span className="text-white"> OVERALL REGIONAL RANKINGS</span>
            </h2>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
              <p className="text-white">Loading regions...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full relative">
      <div className="relative w-full h-full bg-[url(https://c.animaapp.com/mdpqpsw8vIfLwh/img/group-677.png)] bg-cover bg-center">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="font-['Hind',Helvetica] font-bold text-5xl tracking-wider leading-[70.2px] mt-25">
            <span className="text-white">KUER </span>
            <span className="text-[#961c18]">SEASON 2</span>
            <span className="text-white"> OVERALL REGIONAL RANKINGS</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-x-20 gap-y-8 justify-items-center">
          {regions.map((region, index) => {
            if (region.isActive) {
              return (
                <Link
                  key={`${region.id}-${index}`}
                  href={`/regions/${region.slug}`}
                  className="relative h-[430px] w-[360px] block transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 cursor-pointer overflow-hidden"
                >
                  <img
                    className="w-[360px] h-[430px] object-cover border border-white"
                    alt={region.name}
                    src={region.image}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-white text-lg font-bold mb-2">{region.name}</h3>
                      <p className="text-white/90 text-sm">View Rankings</p>
                    </div>
                  </div>
                </Link>
              );
            } else {
              return (
                <div
                  key={`${region.id}-${index}`}
                  onClick={() => handleRegionClick(region)}
                  className="relative h-[430px] w-[360px] transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 cursor-pointer overflow-hidden group"
                >
                  <img
                    className="w-[360px] h-[430px] object-cover border border-white"
                    alt={region.name}
                    src={region.image}
                  />
                  {/* Coming Soon Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center">
                      <h3 className="text-white text-lg font-bold mb-2">COMING SOON</h3>
                      <p className="text-white/90 text-sm">{region.name}</p>
                      <p className="text-white/70 text-xs mt-1">Click for details</p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#961c18] rounded-lg max-w-md w-full p-8 text-center relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-[#961c18] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-[#961c18] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedRegion}
            </h2>
            <h3 className="text-xl font-semibold text-[#961c18] mb-4">
              Rankings Coming Soon
            </h3>
            <p className="text-[#aaaaaa] mb-8 leading-relaxed">
              Rankings for the {selectedRegion} region will be available soon. We&apos;re currently setting up competitions and gathering university participation data for this region.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-[#961c18] hover:bg-[#961c18]/80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                onClick={closeModal}
              >
                Return to Home
              </Link>
              <Link
                href="/tournaments"
                className="bg-transparent border border-[#961c18] text-[#961c18] hover:bg-[#961c18] hover:text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                onClick={closeModal}
              >
                View Tournaments
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-[#961c18]/30">
              <p className="text-[#aaaaaa] text-sm">
                Stay tuned for updates on regional competitions and university rankings.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};