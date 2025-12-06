'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';

interface NavItem {
    label: string;
    href: string;
    icon?: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: "Tournaments", href: "/tournaments", icon: "🏆" },
    { label: "Rankings", href: "/rankings", icon: "📊" },
    { label: "Community", href: "/community", icon: "👥" },
    { label: "Discord", href: "https://discord.com/invite/yGHCzZax5S", icon: "💬" },
];

interface SliceCoordinates {
    pathData: string;
    labelX: number;
    labelY: number;
    midAngle: number;
}

export function RadialNavigation() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState<string | null>(null); // Fixed typo: was 'aciveItem'
    const totalItems = NAV_ITEMS.length;
    const sliceAngle = 360 / totalItems;

    // Memoize the slice calculations for better performance
    const getSliceCoordinates = useCallback((index: number): SliceCoordinates => {
        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        const midAngle = startAngle + sliceAngle / 2;
        
        // Calculate label position (at 65% radius)
        const labelRadius = 195;
        const labelX = Math.cos((midAngle - 90) * Math.PI / 180) * labelRadius;
        const labelY = Math.sin((midAngle - 90) * Math.PI / 180) * labelRadius;

        // Create SVG path for the slice
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        const radius = 300;

        const x1 = Math.cos(startRad) * radius;
        const y1 = Math.sin(startRad) * radius;
        const x2 = Math.cos(endRad) * radius;
        const y2 = Math.sin(endRad) * radius;

        const largeArc = sliceAngle > 180 ? 1 : 0;
        const pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        return { pathData, labelX, labelY, midAngle };
    }, [sliceAngle]);

    const handleItemClick = useCallback((href: string) => {
        setActiveItem(href);
        // Reset active state after animation
        setTimeout(() => setActiveItem(null), 1000);
    }, []);

    const handleMouseEnter = useCallback((href: string) => {
        setHoveredItem(href);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredItem(null);
    }, []);

    return (
        <div className="radial-navigation-container">
            <style jsx>{`
                .radial-navigation-container {
                    position: relative;
                    width: 600px;
                    height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                }

                @keyframes pulse-glow {
                    0%, 100% { 
                        filter: drop-shadow(0 0 15px rgba(220, 38, 38, 0.6));
                        opacity: 0.8;
                    }
                    50% { 
                        filter: drop-shadow(0 0 30px rgba(220, 38, 38, 1));
                        opacity: 1;
                    }
                }

                @keyframes rotate-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes hologram-flicker {
                    0%, 100% { opacity: 0.7; }
                    25% { opacity: 0.9; }
                    50% { opacity: 0.6; }
                    75% { opacity: 0.8; }
                }

                @keyframes energy-pulse {
                    0% { 
                        transform: scale(1);
                        opacity: 0.3;
                    }
                    50% { 
                        transform: scale(1.05);
                        opacity: 0.6;
                    }
                    100% { 
                        transform: scale(1);
                        opacity: 0.3;
                    }
                }

                @keyframes scan-line {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(600px); }
                }

                @keyframes slice-activate {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                .radial-slice {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .radial-slice:hover {
                    filter: brightness(1.5) drop-shadow(0 0 20px rgba(220, 38, 38, 0.9));
                }

                .radial-slice.active {
                    animation: slice-activate 0.6s ease-out;
                }

                .radial-slice svg {
                    width: 100%;
                    height: 100%;
                }

                .center-circle {
                    position: absolute;
                    width: 220px;
                    height: 220px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(153, 27, 27, 0.8) 100%);
                    border: 3px solid rgba(239, 68, 68, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 20;
                    box-shadow: 
                        0 0 40px rgba(220, 38, 38, 0.8),
                        inset 0 0 30px rgba(0, 0, 0, 0.4),
                        0 0 0 8px rgba(220, 38, 38, 0.3);
                    animation: 
                        pulse-glow 2s ease-in-out infinite,
                        energy-pulse 3s ease-in-out infinite;
                    backdrop-filter: blur(5px);
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .center-circle:hover {
                    transform: scale(1.05);
                    box-shadow: 
                        0 0 50px rgba(220, 38, 38, 1),
                        inset 0 0 30px rgba(0, 0, 0, 0.4),
                        0 0 0 8px rgba(220, 38, 38, 0.5);
                }

                .center-circle::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: conic-gradient(
                        from 0deg,
                        transparent,
                        rgba(239, 68, 68, 0.4),
                        transparent,
                        rgba(239, 68, 68, 0.4),
                        transparent
                    );
                    animation: rotate-slow 4s linear infinite;
                    z-index: -1;
                }

                .center-circle::after {
                    content: '';
                    position: absolute;
                    width: 104%;
                    height: 104%;
                    border-radius: 50%;
                    border: 2px solid transparent;
                    border-top: 2px solid rgba(239, 68, 68, 0.6);
                    border-right: 2px solid rgba(239, 68, 68, 0.3);
                    animation: rotate-slow 3s linear infinite reverse;
                }

                .center-circle img {
                    width: 75%;
                    height: 75%;
                    object-fit: contain;
                    filter: 
                        drop-shadow(0 0 10px rgba(0, 0, 0, 0.7))
                        brightness(1.2);
                    animation: hologram-flicker 3s ease-in-out infinite;
                    border-radius: 50%;
                    background: transparent;
                    transition: transform 0.3s ease;
                }

                .center-circle:hover img {
                    transform: scale(1.1);
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
                        0 2px 4px rgba(0, 0, 0, 0.9),
                        0 0 10px rgba(220, 38, 38, 0.8);
                    font-size: 14px;
                    text-align: center;
                    width: 90px;
                    z-index: 15;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                }

                .slice-label .icon {
                    font-size: 32px;
                    margin-bottom: 6px;
                    filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.6));
                    transition: all 0.3s ease;
                }

                .slice-label .text {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 800;
                    background: linear-gradient(45deg, #fff, #fecaca);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    transition: all 0.3s ease;
                }

                .slice-link {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    color: white;
                    width: 100%;
                    pointer-events: all;
                }

                .outer-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 3px solid rgba(220, 38, 38, 0.4);
                    animation: 
                        pulse-glow 3s ease-in-out infinite,
                        rotate-slow 60s linear infinite;
                    box-shadow: 
                        inset 0 0 30px rgba(220, 38, 38, 0.2),
                        0 0 30px rgba(220, 38, 38, 0.3);
                }

                .outer-ring-2 {
                    position: absolute;
                    width: 92%;
                    height: 92%;
                    border-radius: 50%;
                    border: 2px solid rgba(239, 68, 68, 0.3);
                    animation: 
                        pulse-glow 4s ease-in-out infinite,
                        rotate-slow 45s linear infinite reverse;
                    animation-delay: 0.5s;
                }

                .outer-ring-3 {
                    position: absolute;
                    width: 85%;
                    height: 85%;
                    border-radius: 50%;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    animation: 
                        pulse-glow 5s ease-in-out infinite,
                        rotate-slow 30s linear infinite;
                    animation-delay: 1s;
                }

                .scan-line {
                    position: absolute;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, 
                        transparent, 
                        rgba(239, 68, 68, 0.8), 
                        transparent);
                    animation: scan-line 4s linear infinite;
                    z-index: 10;
                }

                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: rgba(239, 68, 68, 0.8);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 5;
                }
            `}</style>

            {/* Outer rings for visual effect */}
            <div className="outer-ring"></div>
            <div className="outer-ring-2"></div>
            <div className="outer-ring-3"></div>

            {/* Scan line effect */}
            <div className="scan-line"></div>

            {/* Navigation slices */}
            {NAV_ITEMS.map((item, index) => {
                const { pathData, labelX, labelY, midAngle } = getSliceCoordinates(index);
                const isExternal = item.href.startsWith('http');
                const isHovered = hoveredItem === item.href;
                const isActive = activeItem === item.href;

                const sliceColor = isHovered 
                    ? 'rgba(220, 38, 38, 0.8)' 
                    : 'rgba(220, 38, 38, 0.5)';

                const LinkComponent = isExternal ? 'a' : Link;
                const linkProps = isExternal 
                    ? { 
                        href: item.href, 
                        target: '_blank', 
                        rel: 'noopener noreferrer',
                        className: 'slice-link'
                    }
                    : { 
                        href: item.href,
                        className: 'slice-link'
                    };

                return (
                    <div 
                        key={item.href}
                        className={`radial-slice ${isActive ? 'active' : ''}`}
                        onMouseEnter={() => handleMouseEnter(item.href)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* SVG Slice */}
                        <svg
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                cursor: 'pointer',
                                filter: isHovered 
                                    ? 'drop-shadow(0 0 25px rgba(220, 38, 38, 1)) brightness(1.2)' 
                                    : 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.5))',
                                transition: 'all 0.3s ease',
                            }}
                            viewBox="-300 -300 600 600"
                        >
                            <path
                                d={pathData}
                                fill={sliceColor}
                                stroke="rgba(239, 68, 68, 0.9)"
                                strokeWidth="3"
                                style={{
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        </svg>

                        {/* Label */}
                        <div
                            className="slice-label"
                            style={{
                                left: `calc(50% + ${labelX}px)`,
                                top: `calc(50% + ${labelY}px)`,
                                transform: isHovered 
                                    ? `translate(-50%, -50%) scale(1.2) rotate(${midAngle - 90}deg)` 
                                    : `translate(-50%, -50%) scale(1) rotate(${midAngle - 90}deg)`,
                                opacity: isHovered ? 1 : 0.9,
                                filter: isHovered ? 'brightness(1.3)' : 'brightness(1)',
                            }}
                        >
                            <LinkComponent
                                {...linkProps}
                                onClick={() => handleItemClick(item.href)}
                            >
                                <div className="icon">{item.icon}</div>
                                <div className="text">{item.label}</div>
                            </LinkComponent>
                        </div>
                    </div>
                );
            })}

            {/* Center Logo */}
            <div className="center-circle">
                <div className="logo-container">
                    <img 
                        src="/images/KUER transparent.png" 
                        alt="KUER Logo"
                        onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        </div>
    );
}