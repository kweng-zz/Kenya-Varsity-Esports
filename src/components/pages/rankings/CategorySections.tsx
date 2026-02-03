'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { SEASON_SEMESTERS } from "@/config/seasonConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper function to get KVE placement points table headers
const getGameHeaders = (gameSlug: string) => {
  // All games use the same KVE placement points system
  return {
    col1: "PLACEMENT PTS",
    col2: "PARTICIPATION PTS", 
    col3: "SOCIAL MEDIA PTS",
    col4: "BONUS PTS"
  };
};

// Types for game categories
interface GameCategoryRanking {
  id: string;
  university: string;
  rank: number;
  plnum: number;
  ccumW: number;
  ccumMW: number;
  bonuses: number;
  total: number;
}

interface GameCategoryInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  universities: GameCategoryRanking[];
}

interface CategoriesData {
  septemberMain: GameCategoryInfo[];
  septemberAdded: GameCategoryInfo[];
  januaryMain: GameCategoryInfo[];
  januaryAdded: GameCategoryInfo[];
}

// Default empty data
const getDefaultCategoriesData = (): CategoriesData => {
  return {
    septemberMain: [],
    septemberAdded: [],
    januaryMain: [],
    januaryAdded: []
  };
};

export const CategorySection = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoriesData, setCategoriesData] = useState<CategoriesData>(getDefaultCategoriesData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load game categories and rankings from optimized API
    const loadCategoriesData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Loading rankings data from API...');
        
        const response = await fetch('/api/rankings/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('📊 Frontend - Rankings API response:', result);

        if (result.success && result.data) {
          // Ensure the data structure is valid
          const data = result.data;
          console.log('📊 Frontend - Raw categories data:', data);
          console.log('📊 Frontend - September Main:', data.septemberMain);
          console.log('📊 Frontend - September Added:', data.septemberAdded);
          
          // Log detailed category information
          if (data.septemberMain && data.septemberMain.length > 0) {
            console.log('📊 Frontend - First category details:', data.septemberMain[0]);
            console.log('📊 Frontend - All September Main categories:', data.septemberMain.map((cat: GameCategoryInfo) => ({
              id: cat.id,
              name: cat.name,
              image: cat.image,
              universitiesCount: cat.universities?.length || 0
            })));
            if (data.septemberMain[0].universities) {
              console.log('📊 Frontend - First category universities:', data.septemberMain[0].universities);
            }
          }
          
          if (data.septemberAdded && data.septemberAdded.length > 0) {
            console.log('📊 Frontend - All September Added categories:', data.septemberAdded.map((cat: GameCategoryInfo) => ({
              id: cat.id,
              name: cat.name,
              image: cat.image,
              universitiesCount: cat.universities?.length || 0
            })));
          }
          
          const validatedData: CategoriesData = {
            septemberMain: Array.isArray(data.septemberMain) ? data.septemberMain : [],
            septemberAdded: Array.isArray(data.septemberAdded) ? data.septemberAdded : [],
            januaryMain: Array.isArray(data.januaryMain) ? data.januaryMain : [],
            januaryAdded: Array.isArray(data.januaryAdded) ? data.januaryAdded : []
          };
          
          console.log('📊 Frontend - Validated categories data:', validatedData);
          console.log('📊 Frontend - Total categories to render:', 
            validatedData.septemberMain.length + validatedData.septemberAdded.length);
          
          // Log sample university data from first category
          if (validatedData.septemberMain.length > 0 && validatedData.septemberMain[0].universities) {
            console.log('📊 Frontend - Sample university data:', validatedData.septemberMain[0].universities.slice(0, 2));
          }
          
          setCategoriesData(validatedData);
        } else {
          throw new Error(result.error || 'Failed to load rankings data');
        }
      } catch (error) {
        console.error('Error loading categories data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        
        // Keep the default fallback data that was set in useState
        // setCategoriesData already has the default data
      } finally {
        setLoading(false);
      }
    };

    loadCategoriesData();
  }, []);

  const handleCategoryClick = (category: GameCategoryInfo) => {
    if (!category.isActive) {
      setSelectedCategory(category.name);
      setShowComingSoonModal(true);
    }
  };

  const closeModal = () => {
    setShowComingSoonModal(false);
    setSelectedCategory('');
  };

  const getSeason = (seasonName: 'september' | 'january') => {
    // Determine which seasons have data
    const hasSeptemberData = categoriesData?.septemberMain?.length > 0 || categoriesData?.septemberAdded?.length > 0;
    const hasJanuaryData = categoriesData?.januaryMain?.length > 0 || categoriesData?.januaryAdded?.length > 0;

    const septemberConfig = SEASON_SEMESTERS.september;
    const januaryConfig = SEASON_SEMESTERS.january;

    const seasons = [
      {
        name: 'september' as const,
        title: `${septemberConfig.titleParts.part1} ${septemberConfig.titleParts.part2} ${septemberConfig.titleParts.part3}`,
        description: septemberConfig.description,
        isActive: hasSeptemberData,
      },
      {
        name: 'january' as const,
        title: `${januaryConfig.titleParts.part1} ${januaryConfig.titleParts.part2} ${januaryConfig.titleParts.part3}`,
        description: januaryConfig.description,
        isActive: hasJanuaryData,
      },
    ];
    return seasons.find(s => s.name === seasonName);
  };

  const renderCategoryGrid = (categories: GameCategoryInfo[], seasonName: 'september' | 'january', addBottomMargin: boolean = true) => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return null;
    }

    return (
      <div className={`max-w-7xl mx-auto grid grid-cols-3 gap-x-20 gap-y-8 justify-items-center ${addBottomMargin ? 'mb-10' : ''}`}>
        {categories.map((category, index) => {
          const shouldShowAsActive = seasonName === 'september' ? category.isActive : (category.isActive && getSeason('january')?.isActive);
          
          if (shouldShowAsActive) {
            return (
              <Link
                key={`category-${category.id}-${index}`}
                href={`/rankings/${category.id}`}
                className="relative h-[430px] w-[360px] block transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 cursor-pointer overflow-hidden"
              >
                <img
                  className="w-[360px] h-[430px] object-cover border border-white"
                  alt={category.name}
                  src={category.image}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-white text-lg font-bold mb-2">{category.name}</h3>
                    <p className="text-white/90 text-sm">View Rankings</p>
                  </div>
                </div>
              </Link>
            );
          } else {
            return (
              <div
                key={`category-${category.id}-${index}`}
                onClick={() => handleCategoryClick(category)}
                className="relative h-[430px] w-[360px] transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 cursor-pointer overflow-hidden group"
              >
                <img
                  className="w-[360px] h-[430px] object-cover"
                  alt={category.name}
                  src={category.image}
                />
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <h3 className="text-white text-lg font-bold mb-2">COMING SOON</h3>
                    <p className="text-white/90 text-sm">{category.name}</p>
                    <p className="text-white/70 text-xs mt-1">Click for details</p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <section className="w-full relative">
        <div className="relative w-full h-full bg-[url(https://c.animaapp.com/mdpqpsw8vIfLwh/img/group-677.png)] bg-cover bg-center">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
                <p className="text-white">Loading rankings...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full relative">
      <div className="relative w-full h-full bg-[url(https://c.animaapp.com/mdpqpsw8vIfLwh/img/group-677.png)] bg-cover bg-center">
        <div className="container mx-auto px-4">
          {/* Error message */}
          {error && (
            <div className="text-center mb-8">
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-red-400 text-sm">
                  {error}
                </p>
                <p className="text-red-300 text-xs mt-2">
                  Showing fallback data
                </p>
              </div>
            </div>
          )}

          {/* September Season */}
          {getSeason('september') && (
            <>
              <div id="september-season" className="mt-16 text-center">
                <h2 className="font-bold text-[46px] tracking-[1.84px] mt-17">
                  <span className="text-white tracking-[0.85px]">{SEASON_SEMESTERS.september.titleParts.part1} </span>
                  <span className="text-red-900 tracking-[0.85px]">{SEASON_SEMESTERS.september.titleParts.part2}</span>
                  <br />
                  <span className="text-white tracking-[0.85px]">
                    {SEASON_SEMESTERS.september.titleParts.part3}
                  </span>
                </h2>
                <p className="text-[#aaaaaa] text-[32px] max-w-4xl mx-auto">
                  {getSeason('september')?.description}
                </p>
              </div>

              {/* September Season - Main categories */}
              {categoriesData?.septemberMain && categoriesData.septemberMain.length > 0 && 
                renderCategoryGrid(categoriesData.septemberMain, 'september')}

              {/* "Added for September Season" text */}
              {categoriesData?.septemberAdded && categoriesData.septemberAdded.length > 0 && (
                <div className="text-center mb-16">
                </div>
              )}

              {/* September Season - Added categories */}
              {categoriesData?.septemberAdded && categoriesData.septemberAdded.length > 0 && (
                <div>
                  {renderCategoryGrid(categoriesData.septemberAdded, 'september', false)}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoonModal} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="bg-[#1a1a1a] border-[#961c18] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">
              {selectedCategory}
            </DialogTitle>
            <DialogTitle className="text-xl font-semibold text-[#961c18] text-center">
              Rankings Coming Soon
            </DialogTitle>
            <DialogDescription className="text-[#aaaaaa] text-center">
              Rankings for the {selectedCategory} category will be available soon. We&apos;re currently setting up competitions and gathering university participation data for this category.
            </DialogDescription>
          </DialogHeader>

          {/* Icon */}
          <div className="w-16 h-16 bg-[#961c18] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>

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
            <p className="text-[#aaaaaa] text-sm text-center">
              Stay tuned for updates on category competitions and university rankings.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};