"use client";
import { Card, CardContent } from "@/components/ui/card";
import { X, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Client, Databases } from "appwrite";
// Appwrite setup with lazy initialization
let client = null;
let databases = null;
const initializeAppwrite = () => {
    if (!client) {
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        if (!endpoint || !projectId) {
            console.warn('Appwrite configuration missing for highlights, using fallback data');
            return null;
        }
        if (typeof endpoint !== 'string' || endpoint.trim() === '') {
            console.warn('Appwrite endpoint is invalid for highlights, using fallback data');
            return null;
        }
        try {
            client = new Client()
                .setEndpoint(endpoint)
                .setProject(projectId);
            databases = new Databases(client);
        }
        catch (error) {
            console.error('Failed to initialize Appwrite client for highlights:', error);
            return null;
        }
    }
    return databases;
};
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const COLLECTION_ID = 'video-highlights';
// Utility function to extract YouTube video ID from URL
const extractYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
};
// Utility function to get YouTube thumbnail
const getYouTubeThumbnail = (videoId, quality = 'maxresdefault') => {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};
export const TopHighlightSection = () => {
    const [activeVideo, setActiveVideo] = useState(null);
    const [mainVideo, setMainVideo] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                const db = initializeAppwrite();
                if (!db) {
                    // Use fallback data if Appwrite is not configured
                    setMainVideo({
                        $id: 'fallback-main',
                        title: 'Main Season 2 Highlight',
                        description: 'Season 2 championship highlights',
                        youtubeUrl: 'https://youtu.be/WoSSsYqgb18?si=-FLMhxsoJ3p0-hqy',
                        isActive: true,
                        order: 0
                    });
                    setHighlights([
                        {
                            $id: 'fallback-1',
                            title: 'KUER DAY 1 HIGHLIGHTS',
                            badge: 'DAY 1 FINALS',
                            description: 'Season 2 was held at KCA University and here is the highlight for day 1',
                            youtubeUrl: 'https://youtu.be/bkP_yfEXW6o?si=oICSj8b72G7UVCtS',
                            isActive: true,
                            order: 1
                        },
                        {
                            $id: 'fallback-2',
                            title: 'KUER DAY 2 HIGHLIGHTS',
                            badge: 'DAY 2 FINALS',
                            description: 'Season 2 was held at KCA University and here is the highlight for day 2',
                            youtubeUrl: 'https://youtu.be/Yk-kScaNlbU?si=D8Lyafe88Km7vzzG',
                            isActive: true,
                            order: 2
                        }
                    ]);
                    setLoading(false);
                    return;
                }
                const response = await db.listDocuments(DB_ID, COLLECTION_ID);
                // Filter active highlights and sort by order
                const activeHighlights = response.documents
                    .filter((doc) => doc.isActive !== false)
                    .map((doc) => ({
                    $id: doc.$id,
                    title: doc.title || '',
                    description: doc.description || '',
                    youtubeUrl: doc.youtubeUrl || '',
                    thumbnailUrl: doc.thumbnailUrl,
                    badge: doc.badge,
                    duration: doc.duration,
                    isActive: doc.isActive !== false,
                    order: doc.order || 0,
                    isFeatured: doc.isFeatured || false
                }))
                    .sort((a, b) => a.order - b.order);
                // Set featured video as main video, or first video if no featured
                const featuredVideo = activeHighlights.find((h) => h.isFeatured);
                const mainVideoData = featuredVideo || activeHighlights[0];
                if (mainVideoData) {
                    setMainVideo(mainVideoData);
                    // Set remaining highlights (excluding main video)
                    setHighlights(activeHighlights.filter((h) => h.$id !== mainVideoData.$id));
                }
                else {
                    // Fallback data if no highlights in database
                    setMainVideo({
                        $id: 'fallback-main',
                        title: 'Main Season 2 Highlight',
                        description: 'Season 2 championship highlights',
                        youtubeUrl: 'https://youtu.be/WoSSsYqgb18?si=-FLMhxsoJ3p0-hqy',
                        isActive: true,
                        order: 0
                    });
                    setHighlights([
                        {
                            $id: 'fallback-1',
                            title: 'KUER DAY 1 HIGHLIGHTS',
                            badge: 'DAY 1 FINALS',
                            description: 'Season 2 was held at KCA University and here is the highlight for day 1',
                            youtubeUrl: 'https://youtu.be/bkP_yfEXW6o?si=oICSj8b72G7UVCtS',
                            isActive: true,
                            order: 1
                        },
                        {
                            $id: 'fallback-2',
                            title: 'KUER DAY 2 HIGHLIGHTS',
                            badge: 'DAY 2 FINALS',
                            description: 'Season 2 was held at KCA University and here is the highlight for day 2',
                            youtubeUrl: 'https://youtu.be/Yk-kScaNlbU?si=D8Lyafe88Km7vzzG',
                            isActive: true,
                            order: 2
                        }
                    ]);
                }
            }
            catch (error) {
                console.error('Error fetching video highlights:', error);
                // Fallback data if database fails
                setMainVideo({
                    $id: 'fallback-main',
                    title: 'Main Season 2 Highlight',
                    description: 'Season 2 championship highlights',
                    youtubeUrl: 'https://youtu.be/fQ8uKRDQV4g?si=FRHlGuAdkuOsqc3N',
                    isActive: true,
                    order: 0
                });
                setHighlights([
                    {
                        $id: 'fallback-1',
                        title: 'KUER DAY 1 HIGHLIGHTS',
                        badge: 'DAY 1 FINALS',
                        description: 'Season 2 was held at KCA University and here is the highlight for day 1',
                        youtubeUrl: 'https://youtu.be/bkP_yfEXW6o?si=oICSj8b72G7UVCtS',
                        isActive: true,
                        order: 1
                    },
                    {
                        $id: 'fallback-2',
                        title: 'KUER DAY 2 HIGHLIGHTS',
                        badge: 'DAY 2 FINALS',
                        description: 'Season 2 was held at KCA University and here is the highlight for day 2',
                        youtubeUrl: 'https://youtu.be/Yk-kScaNlbU?si=D8Lyafe88Km7vzzG',
                        isActive: true,
                        order: 2
                    }
                ]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchHighlights();
    }, []);
    const handleVideoClick = (youtubeUrl) => {
        const videoId = extractYouTubeVideoId(youtubeUrl);
        setActiveVideo(videoId);
    };
    const closeVideo = () => {
        setActiveVideo(null);
    };
    // Video Modal Component
    const VideoModal = ({ videoId, onClose }) => (<div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-4xl aspect-video">
                <button onClick={onClose} className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors">
                    <X className="w-8 h-8"/>
                </button>
                <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`} title="YouTube video player" style={{ border: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full rounded-none"/>
            </div>
        </div>);
    // Video Thumbnail Component
    const VideoThumbnail = ({ youtubeUrl, thumbnailUrl, className = "", playIconSize = "w-12 h-12", duration, title }) => {
        const videoId = extractYouTubeVideoId(youtubeUrl);
        const thumbnail = thumbnailUrl || getYouTubeThumbnail(videoId);
        return (<div className={`relative aspect-video rounded-none overflow-hidden cursor-pointer group ${className}`} onClick={() => handleVideoClick(youtubeUrl)}>
                <img src={thumbnail} alt={`${title} thumbnail`} className="w-full h-full object-cover transition-transform group-hover:scale-105" onError={(event) => {
                const target = event.target;
                target.src = 'https://placehold.co/640x360/111111/FFFFFF?text=Video+Thumbnail';
            }}/>
                {/* Play button - centered with transparent background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-transparent bg-opacity-50 rounded-full p-4 group-hover:scale-110 transition-transform">
                        <Play className={`${playIconSize} text-white fill-white`}/>
                    </div>
                </div>
                
                {/* Duration badge */}
                {duration && (<div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                        {duration}
                    </div>)}
                
                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 transition-all rounded-none pointer-events-none"></div>
            </div>);
    };
    return (<>
            <section className="w-full bg-black py-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-center font-['Hind', Helvetica] font-bold text-[46px] tracking-[1.84px] mb-16">
                        <span className="text-white tracking-[0.85px]">Top Highlight of </span>
                        <span className="text-[#961c18] tracking-[0.85px]">SEASON 2</span>
                    </h2>

                    {loading ? (<div className="text-center text-white">Loading highlights...</div>) : (<>
                            {/* Main Featured Video */}
                            {mainVideo && (<div className="mb-12 flex justify-center">
                                    <VideoThumbnail youtubeUrl={mainVideo.youtubeUrl} thumbnailUrl={mainVideo.thumbnailUrl} className="w-full max-w-6xl" playIconSize="w-20 h-20" title={mainVideo.title} duration={mainVideo.duration}/>
                                </div>)}

                            {/* Highlight Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {highlights.map((highlight) => (<div key={highlight.$id} className="flex flex-col md:flex-row gap-4 items-start">
                                        <div className="w-full md:w-[260px]">
                                            <VideoThumbnail youtubeUrl={highlight.youtubeUrl} thumbnailUrl={highlight.thumbnailUrl} title={highlight.title} duration={highlight.duration}/>
                                        </div>

                                        <Card className="bg-transparent border-0 flex-1">
                                            <CardContent className="p-0">
                                                {highlight.badge && (<div className="inline-block bg-[#961c18] hover:bg-[#7a1514] font-['Hind',Helvetica] font-medium text-white text-xs px-4 py-2 mb-2 transition-colors cursor-pointer" style={{
                        clipPath: 'polygon(0% 0%, 85% 0%, 100% 100%, 0% 100%)'
                    }}>
                                                        {highlight.badge}
                                                    </div>)}
                                                <h3 className="font-['Hind',Helvetica] font-semibold text-white text-[28px] mt-2 mb-4">
                                                    {highlight.title}
                                                </h3>
                                                <p className="font-['Hind',Helvetica] font-normal text-[#aaaaaa] text-lg">
                                                    {highlight.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>))}
                            </div>
                        </>)}
                </div>
            </section>

            {/* Video Modal */}
            {activeVideo && (<VideoModal videoId={activeVideo} onClose={closeVideo}/>)}
        </>);
};
