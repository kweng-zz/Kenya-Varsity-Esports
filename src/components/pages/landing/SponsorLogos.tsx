"use client";

import React, { useEffect, useState } from 'react';
import { Sponsor } from '@/lib/services/sponsorsService';

export const SponsorLogos = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch('/api/sponsors');
        const result = await response.json();
        if (result.success) {
          setSponsors(result.data);
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading || sponsors.length === 0) return null;

  return (
    <section className="w-full py-12 bg-zinc-950/50 border-y border-white/5">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-gray-500 font-bold uppercase tracking-[0.2em] text-xs mb-8">
           Official Partners & Sponsors
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-70 hover:opacity-100 transition-opacity duration-500">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.$id}
              href={sponsor.website || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110"
              title={sponsor.name}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-16 md:h-20 w-auto object-contain max-w-[200px]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
