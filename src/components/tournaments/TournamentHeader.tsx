"use client";

import React from 'react';
import Link from 'next/link';
import { tournamentNavItems } from '@/lib/tournamentNavigation';

interface TournamentHeaderProps {
  slug: string;
  gameName: string;
  subtitle: string;
  currentPath: string;
  featuredImageUrl?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  slug,
  gameName,
  subtitle,
  currentPath,
  featuredImageUrl,
  children,
  actions
}) => {
  return (
    <section className="relative w-full py-20 md:py-32 bg-black min-h-[400px]">
      {/* Background with animated gradients and featured image */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: featuredImageUrl ? `url(${featuredImageUrl})` : 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F13]/80 via-black/90 to-black" />
        
        {/* Stylized background images in corners */}
        <img
          className="absolute -top-20 -left-20 w-96 h-96 object-contain opacity-20 pointer-events-none"
          alt="Top Left Background"
          src="/images/Mask Group.png"
        />
        <img
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] object-contain opacity-15 translate-x-1/4 translate-y-1/4 scale-x-[-1] pointer-events-none"
          alt="Bottom Right Background"
          src="/images/Mask Group.png"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Command Center Navigation */}
        <div className="flex flex-wrap gap-3 mb-10">
          {tournamentNavItems.map((item, index) => {
            const itemHref = item.href.replace('[slug]', slug);
            const isActive = currentPath === itemHref;
            return (
              <Link
                key={index}
                href={itemHref}
                className={`group relative px-5 py-2 transition-all duration-300 border-2 overflow-hidden ${
                  isActive 
                    ? 'bg-[#8c110d] border-[#8c110d] text-white shadow-[0_0_20px_rgba(140,17,13,0.3)]' 
                    : 'bg-black/50 backdrop-blur-sm border-gray-800 text-gray-400 hover:border-[#8c110d] hover:text-white'
                }`}
              >
                {!isActive && (
                  <div className="absolute inset-0 bg-[#8c110d]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                )}
                
                <span className="relative z-10 font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Header Layout */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Title Area */}
          <div className="relative">
            <div className="mb-4">
              <span className="text-[#8c110d] font-black text-sm tracking-[0.3em] uppercase">TOURNAMENT</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
              <span className="block">{gameName}</span>
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#8c110d] mt-2 block tracking-tight">
                {subtitle}
              </span>
            </h1>
            
            {/* Additional Status/Badges */}
            {children && (
              <div className="mt-6 flex flex-wrap gap-4">
                {children}
              </div>
            )}
          </div>
          
          {/* Action Buttons (e.g., Preview modes) */}
          {actions && (
            <div className="flex flex-col sm:flex-row gap-3 relative z-20">
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
