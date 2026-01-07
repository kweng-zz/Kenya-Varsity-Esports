'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';

import { MessageCircle, Info, Newspaper, Users, CircleHelp } from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { label: "Discord", href: "https://discord.com/invite/yGHCzZax5S", icon: <MessageCircle size={28} /> },
    { label: "About", href: "/about", icon: <Info size={28} /> },
    { label: "Blogs", href: "/blogs", icon: <Newspaper size={28} /> },
    { label: "Community", href: "/community", icon: <Users size={28} /> },
    { label: "FAQ", href: "/faq", icon: <CircleHelp size={28} /> },
];



export function RadialNavigation() {
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const totalItems = NAV_ITEMS.length;
    const sliceAngle = 360 / totalItems;

    const sliceCoordinates = useMemo(() => {
        return NAV_ITEMS.map((_, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = startAngle + sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            
            const labelRadius = 155;
            const labelX = Math.cos((midAngle - 90) * Math.PI / 180) * labelRadius;
            const labelY = Math.sin((midAngle - 90) * Math.PI / 180) * labelRadius;

            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            const radius = 240;

            const x1 = Math.cos(startRad) * radius;
            const y1 = Math.sin(startRad) * radius;
            const x2 = Math.cos(endRad) * radius;
            const y2 = Math.sin(endRad) * radius;

            const largeArc = sliceAngle > 180 ? 1 : 0;
            const pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return { pathData, labelX, labelY, midAngle };
        });
    }, [sliceAngle]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        
        let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90;
        if (angle < 0) angle += 360;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 100 && distance < 300) {
            const itemIndex = Math.floor(angle / sliceAngle);
            const hoveredHref = NAV_ITEMS[itemIndex]?.href || null;
            setHoveredItem(hoveredHref);
        } else {
            setHoveredItem(null);
        }
    }, [sliceAngle]);

    const handleMouseLeave = useCallback(() => {
        setHoveredItem(null);
    }, []);

    const handleItemClick = useCallback((item: NavItem) => {
        setActiveItem(item.href);
        
        const isExternal = item.href.startsWith('http');
        
        if (isExternal) {
            // Open external links in new tab
            window.open(item.href, '_blank', 'noopener,noreferrer');
        } else {
            // Use Next.js router for internal navigation
            router.push(item.href);
        }
        
        setTimeout(() => setActiveItem(null), 1000);
    }, [router]);

    return (
        <div className="responsive-wrapper">
            <div 
                className="radial-navigation-container"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <style jsx>{`
                    .responsive-wrapper {
                        width: 480px;
                        height: 480px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .radial-navigation-container {
                        position: relative;
                        width: 700px;
                        height: 700px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: transparent;
                        flex-shrink: 0;
                        transition: transform 0.3s ease;
                    }

                    @media (max-width: 640px) {
                        .responsive-wrapper {
                            width: 320px;
                            height: 320px;
                        }
                        .radial-navigation-container {
                            transform: scale(0.53);
                        }
                    }

                    @media (max-width: 400px) {
                        .responsive-wrapper {
                            width: 280px;
                            height: 280px;
                        }
                        .radial-navigation-container {
                            transform: scale(0.46);
                        }
                    }
    

                @keyframes pulse-glow {
                    0%, 100% { 
                        filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.7)) drop-shadow(0 0 40px rgba(220, 38, 38, 0.4));
                    }
                    50% { 
                        filter: drop-shadow(0 0 35px rgba(220, 38, 38, 1)) drop-shadow(0 0 60px rgba(220, 38, 38, 0.6));
                    }
                }

                @keyframes rotate-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes rotate-reverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }

                @keyframes hologram-flicker {
                    0%, 100% { opacity: 0.85; }
                    25% { opacity: 1; }
                    50% { opacity: 0.75; }
                    75% { opacity: 0.9; }
                }

                @keyframes energy-pulse {
                    0%, 100% { 
                        transform: scale(1);
                        opacity: 0.4;
                    }
                    50% { 
                        transform: scale(1.08);
                        opacity: 0.7;
                    }
                }

                @keyframes slice-activate {
                    0% { transform: scale(1); }
                    30% { transform: scale(1.15); }
                    60% { transform: scale(0.95); }
                    100% { transform: scale(1); }
                }

                @keyframes particle-float {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                    }
                    80% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--tx), var(--ty)) scale(0);
                        opacity: 0;
                    }
                }

                @keyframes ring-pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.4;
                    }
                    50% {
                        transform: scale(1.02);
                        opacity: 0.6;
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }

                .radial-slice {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    pointer-events: none;
                }

                .radial-slice path {
                    pointer-events: auto;
                    cursor: pointer;
                }

                .radial-slice.active {
                    animation: slice-activate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .center-circle {
                    position: absolute;
                    width: 176px;
                    height: 176px;
                    border-radius: 50%;
                    background: 
                        radial-gradient(circle at 30% 30%, rgba(40, 40, 40, 1) 0%, rgba(20, 20, 20, 0.95) 40%, rgba(0, 0, 0, 0.9) 100%);
                    border: 4px solid rgba(40, 40, 40, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 20;
                    box-shadow: 
                        0 0 50px rgba(0, 0, 0, 0.9),
                        0 0 100px rgba(0, 0, 0, 0.6),
                        inset 0 0 40px rgba(0, 0, 0, 0.5),
                        inset -10px -10px 30px rgba(0, 0, 0, 0.3),
                        inset 10px 10px 30px rgba(100, 100, 100, 0.3),
                        0 0 0 10px rgba(0, 0, 0, 0.3),
                        0 0 0 15px rgba(0, 0, 0, 0.15);
                    animation: 
                        pulse-glow 2.5s ease-in-out infinite,
                        energy-pulse 4s ease-in-out infinite;
                    backdrop-filter: blur(8px);
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    pointer-events: none;
                }

                .center-circle::before {
                    content: '';
                    position: absolute;
                    width: 110%;
                    height: 110%;
                    border-radius: 50%;
                    background: conic-gradient(
                        from 0deg,
                        transparent 0deg,
                        rgba(60, 60, 60, 0.6) 30deg,
                        transparent 60deg,
                        rgba(60, 60, 60, 0.4) 120deg,
                        transparent 150deg,
                        rgba(60, 60, 60, 0.5) 210deg,
                        transparent 240deg,
                        rgba(60, 60, 60, 0.6) 300deg,
                        transparent 360deg
                    );
                    animation: rotate-slow 6s linear infinite;
                    z-index: -1;
                }

                .center-circle::after {
                    content: '';
                    position: absolute;
                    width: 108%;
                    height: 108%;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-top: 3px solid rgba(60, 60, 60, 0.8);
                    border-right: 3px solid rgba(60, 60, 60, 0.5);
                    border-bottom: 3px solid rgba(60, 60, 60, 0.3);
                    animation: rotate-reverse 4s linear infinite;
                }

                .center-circle img {
                    width: 75%;
                    height: 75%;
                    object-fit: contain;
                    filter: 
                        drop-shadow(0 0 15px rgba(0, 0, 0, 0.8))
                        drop-shadow(0 0 5px rgba(220, 38, 38, 0.6))
                        brightness(1.25)
                        contrast(1.1);
                    animation: hologram-flicker 4s ease-in-out infinite;
                    border-radius: 50%;
                    background: transparent;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .logo-container {
                    width: 160px;
                    height: 160px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background: transparent;
                    position: relative;
                }

                .slice-label {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: white;
                    text-shadow: 
                        0 3px 6px rgba(0, 0, 0, 1),
                        0 0 20px rgba(220, 38, 38, 1),
                        0 0 30px rgba(220, 38, 38, 0.5);
                    font-size: 14px;
                    text-align: center;
                    width: 90px;
                    z-index: 15;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    pointer-events: none;
                }

                .slice-label .icon {
                    margin-bottom: 8px;
                    filter: 
                        drop-shadow(0 0 12px rgba(220, 38, 38, 0.8))
                        drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .slice-label .text {
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 900;
                    background: linear-gradient(
                        135deg,
                        #ffffff 0%,
                        #fecaca 30%,
                        #ffffff 50%,
                        #fca5a5 70%,
                        #ffffff 100%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 3s linear infinite;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .outer-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 4px solid rgba(40, 40, 40, 0.5);
                    box-shadow: 
                        inset 0 0 40px rgba(0, 0, 0, 0.3),
                        0 0 40px rgba(40, 40, 40, 0.4),
                        0 0 60px rgba(40, 40, 40, 0.2);
                    animation: ring-pulse 3s ease-in-out infinite;
                    pointer-events: none;
                }

                .outer-ring-2 {
                    position: absolute;
                    width: 92%;
                    height: 92%;
                    border-radius: 50%;
                    border: 3px solid rgba(60, 60, 60, 0.4);
                    box-shadow: 
                        inset 0 0 30px rgba(60, 60, 60, 0.2),
                        0 0 30px rgba(60, 60, 60, 0.3);
                    animation: ring-pulse 3s ease-in-out infinite 0.5s;
                    pointer-events: none;
                }

                .outer-ring-3 {
                    position: absolute;
                    width: 85%;
                    height: 85%;
                    border-radius: 50%;
                    border: 2px solid rgba(80, 80, 80, 0.3);
                    box-shadow: 
                        inset 0 0 20px rgba(80, 80, 80, 0.15),
                        0 0 20px rgba(80, 80, 80, 0.2);
                    animation: ring-pulse 3s ease-in-out infinite 1s;
                    pointer-events: none;
                }

                .particle-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 5;
                }

                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: radial-gradient(circle, rgba(239, 68, 68, 1) 0%, transparent 70%);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    animation: particle-float 3s ease-out infinite;
                    opacity: 0;
                }

                .glow-effect {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: radial-gradient(
                        circle at center,
                        transparent 45%,
                        rgba(220, 38, 38, 0.1) 60%,
                        transparent 70%
                    );
                    animation: energy-pulse 4s ease-in-out infinite;
                    pointer-events: none;
                }
            `}</style>

            {/* Particle effects */}
            <div className="particle-container">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            '--tx': `${Math.cos((i / 12) * Math.PI * 2) * 200}px`,
                            '--ty': `${Math.sin((i / 12) * Math.PI * 2) * 200}px`,
                            animationDelay: `${i * 0.25}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Glow effect */}
            <div className="glow-effect" />

            {/* Outer rings */}
            <div className="outer-ring" />
            <div className="outer-ring-2" />
            <div className="outer-ring-3" />

            {/* Navigation slices */}
            {NAV_ITEMS.map((item, index) => {
                const coords = sliceCoordinates[index];
                const isHovered = hoveredItem === item.href;
                const isActive = activeItem === item.href;

                return (
                    <div
                        key={item.href}
                        className={`radial-slice ${isActive ? 'active' : ''}`}
                        onClick={() => handleItemClick(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleItemClick(item);
                            }
                        }}
                        aria-label={`Navigate to ${item.label}`}
                    >
                        <svg
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                filter: isHovered 
                                    ? 'drop-shadow(0 0 30px rgba(220, 38, 38, 1)) drop-shadow(0 0 15px rgba(239, 68, 68, 1)) brightness(1.3)' 
                                    : 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.6))',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                pointerEvents: 'none',
                            }}
                            viewBox="-300 -300 600 600"
                        >
                            <defs>
                                <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={isHovered ? "rgba(239, 68, 68, 0.85)" : "rgba(20, 20, 20, 0.9)"} />
                                    <stop offset="50%" stopColor={isHovered ? "rgba(220, 38, 38, 0.8)" : "rgba(10, 10, 10, 0.85)"} />
                                    <stop offset="100%" stopColor={isHovered ? "rgba(185, 28, 28, 0.75)" : "rgba(0, 0, 0, 0.8)"} />
                                </linearGradient>
                            </defs>
                            <path
                                d={coords.pathData}
                                fill={`url(#gradient-${index})`}
                                stroke={isHovered ? "rgba(239, 68, 68, 1)" : "rgba(40, 40, 40, 0.9)"}
                                strokeWidth={isHovered ? "4" : "3"}
                                style={{
                                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                }}
                            />
                        </svg>

                        <div
                            className="slice-label"
                            style={{
                                left: `calc(50% + ${coords.labelX}px)`,
                                top: `calc(50% + ${coords.labelY}px)`,
                                transform: isHovered 
                                    ? `translate(-50%, -50%) scale(1.3) rotate(${coords.midAngle - 90}deg)` 
                                    : `translate(-50%, -50%) scale(1) rotate(${coords.midAngle - 90}deg)`,
                                opacity: isHovered ? 1 : 0.92,
                                filter: isHovered ? 'brightness(1.4) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' : 'brightness(1)',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                            }}>
                                <div className="icon">{item.icon}</div>
                                <div className="text">{item.label}</div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Center Logo */}
            <div className="center-circle">
                <div className="logo-container">
                    <img 
                        src="/images/KVE white no words.png" 
                        alt="KUER Logo"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        </div>
      </div>
    );
}