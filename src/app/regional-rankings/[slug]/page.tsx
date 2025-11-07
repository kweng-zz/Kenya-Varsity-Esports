'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navigation, FooterSection } from '@/components';

interface University {
  id: string;
  name: string;
  [key: string]: any; // Dynamic game category scores
}

interface GameCategory {
  slug: string;
  name: string;
  id?: string;
}

interface RegionalRanking {
  $id: string;
  region: string;
  image: string;
  universities: University[];
}

export default function RegionalRankingsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [ranking, setRanking] = useState<RegionalRanking | null>(null);
  const [gameCategories, setGameCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch game categories from tournaments
        let categories: GameCategory[] = [];
        try {
          const tournamentsResponse = await fetch('/api/rankings/categories');
          const tournamentsResult = await tournamentsResponse.json();
          
          if (tournamentsResult.success && tournamentsResult.data) {
            // Extract unique game categories from all seasons
            const allCategories = new Map<string, GameCategory>();
            
            const addCategories = (categoryList: any[]) => {
              categoryList.forEach((cat: any) => {
                if (!allCategories.has(cat.id)) {
                  allCategories.set(cat.id, {
                    slug: cat.id,
                    name: cat.name,
                    id: cat.id
                  });
                }
              });
            };

            if (tournamentsResult.data.septemberMain) addCategories(tournamentsResult.data.septemberMain);
            if (tournamentsResult.data.septemberAdded) addCategories(tournamentsResult.data.septemberAdded);
            if (tournamentsResult.data.januaryMain) addCategories(tournamentsResult.data.januaryMain);
            if (tournamentsResult.data.januaryAdded) addCategories(tournamentsResult.data.januaryAdded);

            categories = Array.from(allCategories.values());
            console.log('Loaded game categories:', categories);
          }
        } catch (err) {
          console.warn('Failed to load game categories:', err);
        }

        setGameCategories(categories);

        // Fetch regional ranking
        const response = await fetch('/api/admin/regional-rankings');
        const result = await response.json();

        if (result.success && result.data) {
          // Find the ranking that matches the slug
          const regionName = slug.replace(/-/g, ' ').toUpperCase();
          
          const foundRanking = result.data.find((doc: any) => 
            doc.region.toUpperCase() === regionName
          );

          if (foundRanking) {
            // Parse universities if needed
            let universities = [];
            if (foundRanking.universities) {
              if (typeof foundRanking.universities === 'string') {
                try {
                  universities = JSON.parse(foundRanking.universities);
                } catch (e) {
                  universities = [];
                }
              } else if (Array.isArray(foundRanking.universities)) {
                universities = foundRanking.universities;
              }
            }

            setRanking({
              $id: foundRanking.$id,
              region: foundRanking.region,
              image: foundRanking.image,
              universities
            });
          } else {
            setError('Regional ranking not found');
          }
        } else {
          setError(result.error || 'Failed to load regional rankings');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load regional ranking');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-gray-900 min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
            <p className="text-white">Loading regional rankings...</p>
          </div>
        </div>
        <FooterSection />
      </main>
    );
  }

  if (error || !ranking) {
    return (
      <main className="bg-gray-900 min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Regional Ranking Not Found</h1>
            <p className="text-[#aaaaaa] mb-8">{error || 'The regional ranking you are looking for does not exist.'}</p>
            <Link
              href="/rankings"
              className="inline-block bg-[#961c18] hover:bg-[#961c18]/80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Back to Rankings
            </Link>
          </div>
        </div>
        <FooterSection />
      </main>
    );
  }

  // Calculate totals for each university across all game categories
  const getUniversityTotal = (uni: University) => {
    let total = 0;
    gameCategories.forEach(cat => {
      const score = uni[cat.slug] || 0;
      total += typeof score === 'number' ? score : 0;
    });
    return total;
  };

  // Sort universities by total score
  const sortedUniversities = [...ranking.universities].sort((a, b) => {
    return getUniversityTotal(b) - getUniversityTotal(a);
  });

  return (
    <main className="bg-gray-900 min-h-screen">
      <Navigation />

      {/* Hero Section with Image */}
      <section className="relative w-full h-96 overflow-hidden">
        {ranking.image && (
          <img
            src={ranking.image}
            alt={ranking.region}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-2">{ranking.region}</h1>
            <p className="text-[#aaaaaa] text-lg">{ranking.universities.length} Universities</p>
          </div>
        </div>
      </section>

      {/* Rankings Table Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-full mx-auto">
          {ranking.universities.length > 0 ? (
            <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#961c18]">
                    <th className="text-left py-4 px-6 text-[#961c18] font-bold sticky left-0 bg-gray-800 z-10">Rank</th>
                    <th className="text-left py-4 px-6 text-[#961c18] font-bold sticky left-20 bg-gray-800 z-10">University</th>
                    {gameCategories.length > 0 ? (
                      gameCategories.map(cat => (
                        <th key={cat.slug} className="text-center py-4 px-4 text-[#961c18] font-bold whitespace-nowrap">
                          {cat.name.toUpperCase()}
                        </th>
                      ))
                    ) : null}
                    <th className="text-center py-4 px-6 text-[#961c18] font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUniversities.map((uni, idx) => {
                    const total = getUniversityTotal(uni);
                    return (
                      <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-6 text-white font-bold sticky left-0 bg-gray-800 z-10">#{idx + 1}</td>
                        <td className="py-4 px-6 text-white sticky left-20 bg-gray-800 z-10">{uni.name}</td>
                        {gameCategories.length > 0 ? (
                          gameCategories.map(cat => (
                            <td key={cat.slug} className="text-center py-4 px-4 text-[#aaaaaa]">
                              {uni[cat.slug] || 0}
                            </td>
                          ))
                        ) : null}
                        <td className="text-center py-4 px-6 text-[#961c18] font-bold text-lg">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#aaaaaa] text-lg">No universities found for this region.</p>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              href="/rankings"
              className="inline-flex items-center text-[#961c18] hover:text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Rankings
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
