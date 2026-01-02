"use client";

import { RadialNavigation } from "@/components/RadialNavigation";
import Link from "next/link";

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
        src: "/images/Join-Your-Uni.png",
        alt: "Join Your University",
        title: "JOIN YOUR INSTITUTION'S ESPORTS LEGACY",
        subtitle: "Connect with the largest University Esports community in Kenya.",
        ctaText: "REGISTER NOW",
        ctaLink: "/register"
    },
];

export function HeroBanner({ fallbackBanners = [] }: HeroBannerProps) {
    const displayBanners = fallbackBanners.length > 0 ? fallbackBanners : defaultFallbackBanners;
    const mainContent = displayBanners[0]; 

    return (
        <section style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2rem',
            gap: '2rem',
            backgroundImage: `url(${mainContent.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}>
            
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 1,
                pointerEvents: 'none',
            }}></div>
            
            {/* Left Content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
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
            <div style={{
                position: 'relative',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '600px',
                height: '600px',
                flexShrink: 0,
            }}>
                <RadialNavigation />
            </div>
        </section>
    );
}
