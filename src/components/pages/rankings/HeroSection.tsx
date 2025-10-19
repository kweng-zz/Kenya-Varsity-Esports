
import React, { useState, useEffect } from "react";

interface UniversityRanking {
    id: string;
    university: string;
    rank: number;
    pubgm: number;
    codmBR: number;
    codmMP: number;
    efootball: number;
    total: number;
}

export const HeroSection = () => {
    const [rankings, setRankings] = useState<UniversityRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/rankings/general?limit=5');
                const data = await response.json();
                
                if (data.success && data.data) {
                    // Sort by total points in descending order (highest total first)
                    const sortedByTotal = data.data.sort((a: UniversityRanking, b: UniversityRanking) => b.total - a.total);
                    
                    // Automatically assign ranks based on total points
                    const rankedData = sortedByTotal.map((university: UniversityRanking, index: number) => ({
                        ...university,
                        rank: index + 1 // Rank 1 for highest total, rank 2 for second highest, etc.
                    }));
                    
                    setRankings(rankedData);
                } else {
                    // Fallback to sample data if no CMS data
                    setRankings([
                        {
                            id: "1",
                            university: "TECHNICAL UNIVERSITY OF KENYA",
                            rank: 1,
                            pubgm: 17,
                            codmBR: 842,
                            codmMP: 0,
                            efootball: 3,
                            total: 862,
                        }
                    ]);
                }
            } catch (err) {
                console.error('Error fetching rankings:', err);
                setError('Failed to load rankings');
                // Fallback data
                setRankings([
                    {
                        id: "1",
                        university: "TECHNICAL UNIVERSITY OF KENYA",
                        rank: 1,
                        pubgm: 17,
                        codmBR: 842,
                        codmMP: 0,
                        efootball: 3,
                        total: 862,
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    return (
        <section className="w-full relative min-h-screen">
            <div className="w-full h-full">
                <div className="relative w-full min-h-screen">
                    <div className="absolute inset-0 bg-[url(https://c.animaapp.com/mdpqpsw8vIfLwh/img/group-619.png)] bg-cover bg-center z-0"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
                        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl xl:text-[54px] text-center tracking-wide lg:tracking-[2.16px] leading-tight lg:leading-[70.2px] mb-8 max-w-4xl">
                            <span className="text-white">KUER </span>
                            <span className="text-red-800">SEASON 2 </span>
                            <span className="text-white">OVERALL RANKINGS</span>
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
                                                    PUBGM
                                                </th>
                                                <th className="text-white text-xs sm:text-sm font-bold py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center">
                                                    CODM BR
                                                </th>
                                                <th className="text-white text-xs sm:text-sm font-bold py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center">
                                                    CODM MP
                                                </th>
                                                <th className="text-white text-xs sm:text-sm font-bold py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center">
                                                    EFOOTBALL
                                                </th>
                                                <th className="text-white text-xs sm:text-sm font-bold py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center">
                                                    TOTAL
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-8">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="text-white">Loading rankings...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : error ? (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-8">
                                                        <span className="text-red-400">{error}</span>
                                                    </td>
                                                </tr>
                                            ) : rankings.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-8">
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
                                                            <span className="text-yellow-400 text-xs sm:text-sm font-bold bg-yellow-400 bg-opacity-20 px-1 sm:px-2 py-1 rounded">
                                                                #{ranking.rank}
                                                            </span>
                                                        </td>
                                                        <td className="text-white text-xs sm:text-sm py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center font-medium">
                                                            {ranking.pubgm}
                                                        </td>
                                                        <td className="text-white text-xs sm:text-sm py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center font-medium">
                                                            {ranking.codmBR}
                                                        </td>
                                                        <td className="text-white text-xs sm:text-sm py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center font-medium">
                                                            {ranking.codmMP}
                                                        </td>
                                                        <td className="text-white text-xs sm:text-sm py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3 text-center font-medium">
                                                            {ranking.efootball}
                                                        </td>
                                                        <td className="text-center py-2 sm:py-3 md:py-4 px-1 sm:px-2 md:px-3">
                                                            <span className="text-green-400 text-xs sm:text-sm font-bold bg-green-400 bg-opacity-20 px-1 sm:px-2 py-1 rounded">
                                                                {ranking.total}
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