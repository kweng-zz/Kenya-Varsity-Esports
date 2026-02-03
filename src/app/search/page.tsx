
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Trophy, Ticket } from "lucide-react";
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { contentful, TransformedArticle, transformContentfulArticle } from '@/lib/contentful';
import { getTournamentsPageData, GameInfo } from '@/lib/pagedata/tournaments';

interface Event {
  $id: string;
  title: string;
  gameSlug: string;
  image: string;
  date: string;
  time: string;
  prizePool: string;
  entryFee: string;
  status: 'OPEN' | 'LEAGUE' | 'PRO';
  tags: string[];
  isActive: boolean;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(true);
  const [blogResults, setBlogResults] = useState<TransformedArticle[]>([]);
  const [tournamentResults, setTournamentResults] = useState<GameInfo[]>([]);
  const [eventResults, setEventResults] = useState<Event[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (!query.trim()) {
            setBlogResults([]);
            setTournamentResults([]);
            setEventResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();

        // 1. Search Blogs via Contentful
        const blogsPromise = contentful.getArticles({ search: query, pageSize: 6 })
            .then(res => res.data.map(transformContentfulArticle))
            .catch(err => { console.error('Blog search error', err); return []; });

        // 2. Search Tournaments (Local Filter)
        const tournamentsData = getTournamentsPageData();
        const filteredTournaments = tournamentsData.games.filter(game => 
            game.name.toLowerCase().includes(lowerQuery) || 
            (game as any).searchTerms?.some((term: string) => term.toLowerCase().includes(lowerQuery)) ||
            (game.season && game.season.toLowerCase().includes(lowerQuery))
        );

        // 3. Search Events (Fetch API)
        const eventsPromise = fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    return data.data.filter((event: Event) => 
                        event.title.toLowerCase().includes(lowerQuery) ||
                        event.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
                    );
                }
                return [];
            })
            .catch(err => { console.error('Event search error', err); return []; });

        const [blogs, events] = await Promise.all([blogsPromise, eventsPromise]);
        
        setBlogResults(blogs);
        setTournamentResults(filteredTournaments);
        setEventResults(events);

      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <main className="bg-black min-h-screen text-white">
      <div className="relative z-20">
        <Navigation />
      </div>

      <div className="container mx-auto px-4 py-12 min-h-[60vh]">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#961c18]">
          Search Results for "{query}"
        </h1>

        {loading ? (
             <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18]"></div>
            </div>
        ) : (
            <div className="space-y-12">
                {/* Tournaments Results */}
                {tournamentResults.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Tournaments</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tournamentResults.map((game) => (
                                <Link href={game.route} key={game.id} className="block group">
                                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group-hover:border-[#961c18] transition-colors">
                                        <div className="relative h-48 w-full">
                                            <Image 
                                                src={game.image} 
                                                alt={game.name} 
                                                fill 
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-xl font-bold mb-1 group-hover:text-[#961c18] transition-colors">{game.name}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="px-2 py-0.5 bg-[#961c18]/20 text-[#961c18] text-xs rounded uppercase font-semibold">
                                                    {game.season} Season
                                                </span>
                                                <span className={`px-2 py-0.5 text-xs rounded uppercase font-semibold ${game.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {game.isActive ? 'Active' : 'Ended'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                 {/* Events Results */}
                 {eventResults.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {eventResults.map((event) => (
                                <div key={event.$id} className="group relative bg-[#0F0F0F] border border-gray-800 hover:border-[#961c18] transition-all duration-300 flex flex-col h-full rounded-lg overflow-hidden">
                                     <div className="relative h-48 overflow-hidden">
                                        <div className="absolute top-0 right-0 z-10 m-2">
                                            <span className="inline-block py-1 px-3 text-[10px] font-bold uppercase text-white bg-[#961c18] rounded">
                                                {event.status}
                                            </span>
                                        </div>
                                        <div 
                                            className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                                            style={{ backgroundImage: `url('${event.image}')` }}
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold uppercase text-white mb-3">
                                            {event.title}
                                        </h3>
                                        <div className="space-y-2 mb-4 flex-grow">
                                            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase">
                                                <Calendar size={14} className="text-[#961c18]" />
                                                <span>{event.date} • {event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase">
                                                <Trophy size={14} className="text-[#961c18]" />
                                                <span>{event.prizePool}</span>
                                            </div>
                                        </div>
                                        <Link href="/tournament-registration" className="mt-auto block text-center py-2 bg-[#961c18] text-white text-sm font-bold uppercase rounded hover:bg-[#7d1714] transition-colors">
                                            Register Now
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Blogs Results */}
                {blogResults.length > 0 && (
                    <section>
                         <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">News & Articles</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogResults.map((blog) => (
                                 <Link href={`/blogs/${blog.slug}`} key={blog.id} className="block group">
                                     <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group-hover:border-[#961c18] transition-colors h-full flex flex-col">
                                         <div className="relative h-48 w-full">
                                             {blog.imageUrl ? (
                                                <Image 
                                                    src={blog.imageUrl} 
                                                    alt={blog.title} 
                                                    fill 
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                             ) : (
                                                 <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                     <span className="text-gray-600">No Image</span>
                                                 </div>
                                             )}
                                         </div>
                                         <div className="p-4 flex flex-col flex-grow">
                                             <div className="text-[#961c18] text-xs font-bold uppercase mb-2 tracking-wide">
                                                 {blog.category}
                                             </div>
                                             <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-[#961c18] transition-colors">
                                                 {blog.title}
                                             </h3>
                                             <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                                                 {blog.description}
                                             </p>
                                             <div className="text-xs text-gray-500 mt-auto">
                                                 {new Date(blog.publishedAt).toLocaleDateString()}
                                             </div>
                                         </div>
                                     </div>
                                 </Link>
                            ))}
                         </div>
                    </section>
                )}

                {tournamentResults.length === 0 && blogResults.length === 0 && eventResults.length === 0 && (
                    <div className="text-center py-20 bg-gray-900/50 rounded-lg">
                        <h3 className="text-xl text-gray-400 mb-2">No results found for "{query}"</h3>
                        <p className="text-gray-500">Try checking your spelling or use different keywords.</p>
                        <div className="mt-8">
                            <Link href="/tournaments" className="inline-block px-6 py-2 bg-[#961c18] text-white rounded hover:bg-[#7d1714] transition-colors mx-2">
                                Browse Tournaments
                            </Link>
                            <Link href="/blogs" className="inline-block px-6 py-2 border border-gray-600 text-white rounded hover:bg-gray-800 transition-colors mx-2">
                                Read News
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>

      <FooterSection />
    </main>
  );
}
