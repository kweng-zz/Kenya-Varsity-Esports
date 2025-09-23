"use client";
import { useState, useEffect } from "react";
import { Client, Databases } from 'appwrite';
import { ActionCards } from "./ActionCards";
import { HeroImageSection } from "./HeroImage";
// --- Appwrite Setup with lazy initialization ---
let client = null;
let databases = null;
const initializeAppwrite = () => {
    if (!client) {
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        if (!endpoint || !projectId) {
            console.warn('Appwrite configuration missing for banners, using fallback data');
            return null;
        }
        if (typeof endpoint !== 'string' || endpoint.trim() === '') {
            console.warn('Appwrite endpoint is invalid for banners, using fallback data');
            return null;
        }
        try {
            client = new Client()
                .setEndpoint(endpoint)
                .setProject(projectId);
            databases = new Databases(client);
        }
        catch (error) {
            console.error('Failed to initialize Appwrite client for banners:', error);
            return null;
        }
    }
    return databases;
};
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const COLLECTION_ID = 'hero_banners';
export function HeroBanner({ fallbackBanners = [] }) {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [cmsBanners, setCmsBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Load banners from Appwrite
    useEffect(() => {
        const loadAppwriteBanners = async () => {
            try {
                setIsLoading(true);
                const db = initializeAppwrite();
                if (!db) {
                    // Use fallback banners if Appwrite is not configured
                    setCmsBanners([]);
                    setIsLoading(false);
                    return;
                }
                const response = await db.listDocuments(DB_ID, COLLECTION_ID);
                // Filter only active banners and sort by order
                const activeBanners = response.documents
                    .filter((banner) => banner.isActive !== false)
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((banner) => ({
                    $id: banner.$id,
                    src: banner.src,
                    alt: banner.alt,
                    title: banner.title,
                    subtitle: banner.subtitle,
                    ctaText: banner.ctaText,
                    ctaLink: banner.ctaLink,
                    order: banner.order || 0,
                    isActive: banner.isActive !== false
                }));
                setCmsBanners(activeBanners);
            }
            catch (error) {
                console.error('Error loading Appwrite banners:', error);
                // If collection doesn't exist or other error, use fallback banners
                setCmsBanners([]);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadAppwriteBanners();
        // Set up polling to check for banner updates every 30 seconds
        const interval = setInterval(loadAppwriteBanners, 30000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    // Default fallback banners if none provided
    const defaultFallbackBanners = [
        {
            src: "/images/Join-Your-Uni.png",
            alt: "Join Your University",
            title: "Join Your University",
            subtitle: "Connect with your university esports community",
            ctaText: "Register Now",
            ctaLink: "/register"
        },
        {
            src: "/images/Join our tournaments.png",
            alt: "Join Our Tournaments",
            title: "Join Our Tournaments",
            subtitle: "Compete in exciting esports tournaments",
            ctaText: "View Tournaments",
            ctaLink: "/tournaments"
        }
    ];
    // Priority: CMS banners > provided fallbackBanners > default fallback banners
    const finalFallbackBanners = cmsBanners.length > 0
        ? cmsBanners
        : (fallbackBanners.length > 0 ? fallbackBanners : defaultFallbackBanners);
    const displayBanners = finalFallbackBanners;
    const currentBanner = displayBanners[currentBannerIndex];
    const totalBanners = displayBanners.length;
    // Removed auto-rotate carousel - manual navigation only
    const handlePreviousBanner = () => {
        if (totalBanners > 1) {
            setCurrentBannerIndex((prev) => prev === 0 ? totalBanners - 1 : prev - 1);
        }
    };
    const handleNextBanner = () => {
        if (totalBanners > 1) {
            setCurrentBannerIndex((prev) => prev === totalBanners - 1 ? 0 : prev + 1);
        }
    };
    return (<section className="w-full relative min-h-screen bg-black flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
      {/* Background Image Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Left side - normal image */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('/images/Mask Group.png')" }}></div>
        {/* Right side - inverted image */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-no-repeat bg-center transform -scale-x-100" style={{ backgroundImage: "url('/images/Mask Group.png')" }}></div>
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl">
        {/* Hero Image Section */}
        <HeroImageSection key={currentBanner.src} // Added key for better transitions
     imageSrc={currentBanner.src} alt={currentBanner.alt} title={currentBanner.title} subtitle={currentBanner.subtitle} ctaText={currentBanner.ctaText} ctaLink={currentBanner.ctaLink} onPrevious={handlePreviousBanner} onNext={handleNextBanner} showNavigation={totalBanners > 1} // Conditionally show navigation
    />

        {/* Action Cards Section */}
        <div className="mt-6 sm:mt-8 md:mt-12 w-full">
          <ActionCards />
        </div>

        {/* Carousel Indicators - only show if multiple banners */}
        {totalBanners > 1 && (<div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 flex gap-2">
            {Array.from({ length: totalBanners }).map((_, index) => (<button key={index} onClick={() => setCurrentBannerIndex(index)} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentBannerIndex
                    ? 'bg-red-600 scale-125'
                    : 'bg-white/50 hover:bg-white/80'}`} aria-label={`Go to banner ${index + 1}`}/>))}
          </div>)}
      </div>
    </section>);
}
