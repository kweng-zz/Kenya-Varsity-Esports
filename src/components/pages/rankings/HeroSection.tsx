import React, { useState, useEffect } from "react";
import { CURRENT_SEASON, SEASON_GENERAL } from "@/config/seasonConfig";

interface GameCategory {
  slug: string;
  name: string;
  id?: string;
}

interface UniversityRanking {
  id: string;
  university: string;
  rank: number;
  [key: string]: any;
}

export const HeroSection = () => {
  const [rankings, setRankings] = useState<UniversityRanking[]>([]);
  const [gameCategories, setGameCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load game categories from tournaments database
        try {
          const tournamentsResponse = await fetch('/api/rankings/categories');
          const tournamentsResult = await tournamentsResponse.json();
          
          if (tournamentsResult.success && tournamentsResult.data) {
            const allCategories = new Map<string, GameCategory>();
            
            const addCategories = (categoryList: any[]) => {
              if (Array.isArray(categoryList)) {
                categoryList.forEach((cat: any) => {
                  if (cat.id && !allCategories.has(cat.id)) {
                    allCategories.set(cat.id, {
                      slug: cat.id,
                      name: cat.name || cat.title || '',
                      id: cat.id
                    });
                  }
                });
              }
            };

            if (tournamentsResult.data.septemberMain) addCategories(tournamentsResult.data.septemberMain);
            if (tournamentsResult.data.septemberAdded) addCategories(tournamentsResult.data.septemberAdded);
            if (tournamentsResult.data.januaryMain) addCategories(tournamentsResult.data.januaryMain);
            if (tournamentsResult.data.januaryAdded) addCategories(tournamentsResult.data.januaryAdded);

            const categories = Array.from(allCategories.values());
            setGameCategories(categories);
            console.log('✅ Loaded game categories:', categories);
          }
        } catch (err) {
          console.warn('Failed to load game categories:', err);
          setGameCategories([]);
        }

        // Fetch general rankings
        const response = await fetch('/api/rankings/general?limit=5');
        const data = await response.json();
        
        console.log('HeroSection - API Response:', data);
        
        if (data.success && data.data) {
          // Sort by total points in descending order
          const sortedByTotal = data.data.sort((a: any, b: any) => {
            const totalA = a.total || 0;
            const totalB = b.total || 0;
            return totalB - totalA;
          });
          
          console.log('HeroSection - Sorted data:', sortedByTotal);
          
          // Assign ranks based on total points
          const rankedData = sortedByTotal.map((university: any, index: number) => {
            const mappedData = {
              id: university.id || university.$id,
              university: university.university || university.universityName || 'Unknown',
              rank: index + 1,
              total: university.total || 0
            };
            console.log('HeroSection - Mapped university:', mappedData);
            return mappedData;
          });
          
          console.log('HeroSection - Final ranked data:', rankedData);
          setRankings(rankedData);
        } else {
          // Fallback data
          console.log('HeroSection - Using fallback data');
          setRankings([
            {
              id: "1",
              university: "TECHNICAL UNIVERSITY OF KENYA",
              rank: 1,
              total: 862,
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load rankings');
        setRankings([
          {
            id: "1",
            university: "TECHNICAL UNIVERSITY OF KENYA",
            rank: 1,
            total: 862,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="w-full relative min-h-screen">
      <div className="w-full h-full">
        <div className="relative w-full min-h-screen">
          <div className="absolute inset-0 bg-[url(https://c.animaapp.com/mdpqpsw8vIfLwh/img/group-619.png)] bg-cover bg-center z-0"></div>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl xl:text-[54px] text-center tracking-wide lg:tracking-[2.16px] leading-tight lg:leading-[70.2px] mb-8 max-w-4xl">
              <span className="text-white">{SEASON_GENERAL.titleParts.part1} </span>
              <span className="text-red-800">{SEASON_GENERAL.titleParts.part2} </span>
              <span className="text-white">{SEASON_GENERAL.titleParts.part3}</span>
            </h1>

            <div className="w-full max-w-6xl px-2 sm:px-4">
              <div className="bg-black bg-opacity-60 rounded-lg p-3 sm:p-4 md:p-6 backdrop-blur-sm overflow-x-auto">
                <div className="min-w-[600px] sm:min-w-full">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-600">
                        <th className="text-white text-xs sm:text-sm font-bold py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-left min-w-[120px] sm:min-w-0">
                          UNIVERSITY
                        </th>
                        <th className="text-white text-xs sm:text-sm font-bold py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center">
                          RANK
                        </th>
                        <th className="text-white text-xs sm:text-sm font-bold py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center">
                          TOTAL POINTS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={3} className="text-center py-8">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-white">Loading rankings...</span>
                            </div>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={3} className="text-center py-8">
                            <span className="text-red-400">{error}</span>
                          </td>
                        </tr>
                      ) : rankings.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-8">
                            <span className="text-gray-400">No rankings data available</span>
                          </td>
                        </tr>
                      ) : (
                        rankings.map((ranking, index) => (
                          <tr 
                            key={ranking.id} 
                            className={`border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-30 transition-colors ${
                              index % 2 === 0 ? 'bg-gray-900 bg-opacity-20' : 'bg-transparent'
                            }`}
                          >
                            <td className="text-white text-xs sm:text-sm py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 font-medium">
                              <div className="truncate max-w-[100px] sm:max-w-none" title={ranking.university}>
                                {ranking.university}
                              </div>
                            </td>
                            <td className="text-center py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3">
                              <span className="text-yellow-300 text-xs sm:text-sm font-bold bg-yellow-900 bg-opacity-40 px-1 sm:px-2 py-1 rounded">
                                #{ranking.rank}
                              </span>
                            </td>
                            <td className="text-center py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3">
                              <span className="text-green-300 text-xs sm:text-sm font-bold bg-green-900 bg-opacity-40 px-1 sm:px-2 py-1 rounded">
                                {ranking.total || 0}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
