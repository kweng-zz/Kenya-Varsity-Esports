"use client";

import { RadialNavigation } from "@/components/RadialNavigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface HeroBannerProps {
  fallbackBanners?: Array<{
    src: string;
    alt: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>;
}

const defaultFallbackBanners = [
    {
        src: "/images/Join-Your-Uni.webp",
        alt: "Join Your University",
        title: "JOIN YOUR INSTITUTION'S ESPORTS LEGACY",
        subtitle: "To get information for upcoming events.",
        ctaText: "UPCOMING EVENTS",
        ctaLink: "/events"
    },
];

export function HeroBanner({ fallbackBanners = [] }: HeroBannerProps) {
    const displayBanners = fallbackBanners.length > 0 ? fallbackBanners : defaultFallbackBanners;
    const mainContent = displayBanners[0]; 
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Load video after page load for better performance
        const timer = setTimeout(() => {
            setShouldLoadVideo(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <section className="hero-banner">
                {/* Fallback Image Background - sits at bottom */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url("${mainContent.src}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    zIndex: 0, // Base layer
                }} />

                {/* Video Background - on top of image, but behind overlay */}
                {shouldLoadVideo && (
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={mainContent.src}
                        onLoadStart={() => setIsVideoLoaded(false)}
                        onCanPlay={() => setIsVideoLoaded(true)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 1, // Above image
                            opacity: isVideoLoaded ? 1 : 0,
                            transition: 'opacity 0.5s ease-in-out',
                        }}
                        title="Hero background video showing esports highlights"
                    >
                        {/* Optimized video sources - WebM first for modern browsers, MP4 as fallback */}
                        <source src="/images/IMG_7172.webm" type="video/webm" />
                        <source src="/images/IMG_7172.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}

                {/* Dark Overlay - on top of everything */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    zIndex: 2, // Above video
                    pointerEvents: 'none',
                }}></div>
                
                <div className="content-container">
                    {/* Left Content */}
                    <div className="text-content">
                        <h1 style={{
                            fontSize: 'clamp(1.875rem, 5vw, 3.75rem)',
                            fontWeight: 'bold',
                            color: 'white',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                            lineHeight: '1.2',
                        }}>
                            {mainContent.title}
                        </h1>
                        <p style={{
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            color: '#d1d5db',
                            marginBottom: '2rem',
                            maxWidth: '500px',
                        }}>
                            {mainContent.subtitle}
                        </p>
                        <Link 
                            href={mainContent.ctaLink || "/register"}
                            style={{
                                display: 'inline-block',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '0.75rem 2rem',
                                fontSize: '1.125rem',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                borderRadius: '0.125rem',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s ease',
                                width: 'fit-content',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#b91c1c';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#dc2626';
                            }}
                        >
                            {mainContent.ctaText}
                        </Link>
                    </div>

                    {/* Right Content - Radial Navigation */}
                    <div className="radial-wrapper">
                        <RadialNavigation />
                    </div>
                </div>
            </section>

            <style jsx>{`
                .hero-banner {
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    background-color: #000;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .content-container {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 1800px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    gap: 2rem;
                }

                .text-content {
                    max-width: 600px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .radial-wrapper {
                    position: relative;
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                @media (max-width: 1024px) {
                    .content-container {
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        padding-top: 6rem;
                        padding-bottom: 4rem;
                    }
                    
                    .text-content {
                        align-items: center;
                        margin-bottom: 2rem;
                        max-width: 100%;
                    }

                    .radial-wrapper {
                        width: 100%;
                        justify-content: center;
                        overflow: visible;
                    }
                }
            `}</style>
        </>
    );
}
