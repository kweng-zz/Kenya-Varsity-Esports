"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaTiktok, 
  FaDiscord, 
  FaLinkedin, 
  FaTwitch, 
  FaExternalLinkAlt 
} from "react-icons/fa";

// Define the team member interface
interface TeamMember {
  name: string;
  role: string;
  backgroundImage: string;
  socialUrls?: string[];
  bio?: string;
}

// Team Member Card Component (inline)
const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex-shrink-0 w-[300px] h-[400px] relative group cursor-pointer">
      {/* Background Image */}
      <div className="absolute inset-0 rounded-none overflow-hidden">
        <Image
          src={imageError ? "https://placehold.co/300x400/111111/FFFFFF?text=Team+Member" : member.backgroundImage}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="font-['Hind',Helvetica] font-bold text-xl mb-2 tracking-wide">
          {member.name.toUpperCase()}
        </h3>
        <p className="font-['Hind',Helvetica] font-medium text-[#961c18] text-sm mb-4">
          {member.role}
        </p>
        
        {/* Bio */}
        {member.bio && (
          <p className="font-['Hind',Helvetica] text-sm text-gray-300 mb-4 line-clamp-3">
            {member.bio}
          </p>
        )}

        {/* Social Links */}
        {member.socialUrls && member.socialUrls.length > 0 && (
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {member.socialUrls.slice(0, 4).map((url, socialIndex) => {
              // Determine platform based on URL
              let platform = 'link';
              if (url.includes('instagram.com')) platform = 'instagram';
              else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'twitter';
              else if (url.includes('youtube.com')) platform = 'youtube';
              else if (url.includes('tiktok.com')) platform = 'tiktok';
              else if (url.includes('discord.gg')) platform = 'discord';
              else if (url.includes('linkedin.com')) platform = 'linkedin';
              else if (url.includes('twitch.tv')) platform = 'twitch';

              // Get the appropriate icon component
              const getIcon = () => {
                const iconProps = { size: 16, className: "text-white" };
                switch (platform) {
                  case 'instagram':
                    return <FaInstagram {...iconProps} />;
                  case 'twitter':
                    return <FaTwitter {...iconProps} />;
                  case 'youtube':
                    return <FaYoutube {...iconProps} />;
                  case 'tiktok':
                    return <FaTiktok {...iconProps} />;
                  case 'discord':
                    return <FaDiscord {...iconProps} />;
                  case 'linkedin':
                    return <FaLinkedin {...iconProps} />;
                  case 'twitch':
                    return <FaTwitch {...iconProps} />;
                  default:
                    return <FaExternalLinkAlt {...iconProps} />;
                }
              };

              return (
                <a
                  key={socialIndex}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/20 hover:bg-[#961c18] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer z-10 relative"
                  title={`Visit ${platform} profile`}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  {getIcon()}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#961c18] rounded-none transition-colors duration-300" />
    </div>
  );
};

// Carousel Controls Component (inline)
const TeamCarouselControls = ({ 
  onScrollLeft, 
  onScrollRight, 
  isAtStart, 
  isAtEnd 
}: {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  isAtStart: boolean;
  isAtEnd: boolean;
}) => {
  return (
    <div className="flex justify-center mt-8 gap-4">
      <button
        onClick={onScrollLeft}
        disabled={isAtStart}
        className={`w-12 h-12 rounded-none border-2 flex items-center justify-center transition-all duration-200 ${
          isAtStart
            ? 'border-gray-600 text-gray-600 cursor-not-allowed'
            : 'border-[#961c18] text-[#961c18] hover:bg-[#961c18] hover:text-white'
        }`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onScrollRight}
        disabled={isAtEnd}
        className={`w-12 h-12 rounded-none border-2 flex items-center justify-center transition-all duration-200 ${
          isAtEnd
            ? 'border-gray-600 text-gray-600 cursor-not-allowed'
            : 'border-[#961c18] text-[#961c18] hover:bg-[#961c18] hover:text-white'
        }`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export const MeetTheTeamSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Team members data
  const teamMembers: TeamMember[] = [
    {
      name: "Uganda",
      role: "CODM BR Caster",
      backgroundImage: "/images/Uganda.png",
      bio: "Professional Call of Duty Mobile Battle Royale caster with extensive gaming experience and community engagement.",
      socialUrls: [
        "https://www.tiktok.com/@ugandacodm?_t=ZM-8z0AOpqeBIG&_r=1",
        "https://www.instagram.com/ugandacodm_?igsh=MTV3dHM4eWRuaXZyYg%3D%3D&utm_source=qr",
        "https://youtube.com/@ugandacodm?si=Y04ka50nxt9KGYZi",
        "https://discord.gg/Uk3yNYGA",
        "https://www.linkedin.com/in/mark-kucel-opio-067467194?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
        "https://x.com/markkucel?s=21",
      ],
    },
    {
      name: "Mr 420",
      role: "Lead CODM MP Caster",
      backgroundImage: "/images/Mr 420.png",
      bio: "Lead Call of Duty Mobile Multiplayer caster bringing energy and expertise to every match.",
      socialUrls: [
        "https://www.instagram.com/clay.ogstoner/",
        "https://www.youtube.com/@clayogstoner",
      ],
    },
    {
      name: "Mich Gaming",
      role: "Lead PUBGM Caster",
      backgroundImage: "/images/Mich Gaming.jpg",
      bio: "Expert PUBG Mobile caster with deep game knowledge and engaging commentary style.",
      socialUrls: [
        "https://www.tiktok.com/@michgaming?_t=ZM-8yytiqAmyzl&_r=1",
        "https://www.instagram.com/michgaming_?igsh=bmJ4cmZjMXRuYTRq&utm_source=qr",
        "http://www.youtube.com/@michgamingpubg",
      ],
    },
    {
      name: "Maddox",
      role: "CODM BR Caster",
      backgroundImage: "/images/Maddox Jpg.png",
      bio: "Dynamic Call of Duty Mobile Battle Royale caster known for exciting play-by-play commentary.",
      socialUrls: [
        "https://www.tiktok.com/@_.mad_dox._?_t=ZM-8yyvdJQYY12&_r=1",
        "https://youtube.com/@_mad_dox_?si=X5-R-JuYPEVSIwxn",
        "https://www.instagram.com/_.mad.dox._?utm_source=qr&igsh=bmI2azF6MHJvaG40",
      ],
    },
    {
      name: "Joan",
      role: "Lead Admin CODM MP",
      backgroundImage: "/images/Joan.JPEG",
      bio: "Lead administrator for Call of Duty Mobile Multiplayer tournaments, ensuring fair play and smooth operations.",
      socialUrls: [
        "https://www.instagram.com/__oseko?igsh=MTF6NzE2dzh5bWF2dQ%3D%3D&utm_source=qr",
      ],
    },
    {
      name: "Don Bashra",
      role: "PUBGM and CODM BR Caster",
      backgroundImage: "/images/Don Bashra.jpg",
      bio: "Versatile caster covering both PUBG Mobile and Call of Duty Mobile Battle Royale with professional expertise.",
      socialUrls: [
        "https://youtube.com/c/DonBashrah",
        "https://tiktok.com/@donbashrah",
        "https://www.instagram.com/don_bashrah/",
      ],
    },
  ];

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft <= 5); // Small tolerance for rounding
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 5); // Small tolerance for rounding
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      // Also check on resize
      const handleResize = () => {
        setTimeout(checkScrollPosition, 100);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [teamMembers.length]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Card width (300px) + gap (20px)
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      // Update scroll position after animation
      setTimeout(checkScrollPosition, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Card width (300px) + gap (20px)
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      // Update scroll position after animation
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <section className="w-full py-24 bg-[#0c0e11e6] flex justify-center items-center">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="mb-16 flex items-center justify-center">
          <Image
            className="w-[22px] h-[26px] mr-3"
            alt="Polygon"
            src="https://c.animaapp.com/md6ebassseX7AK/img/polygon-1.svg"
            width={22}
            height={26}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <h2 className="font-['Hind',Helvetica] font-bold text-white text-[46px] tracking-[1.84px]">
            MEET THE TEAM
          </h2>
        </header>

        {/* Horizontal scrolling container for team members */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} index={index} />
          ))}
        </div>

        {/* Navigation Controls */}
        <TeamCarouselControls
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
          isAtStart={isAtStart}
          isAtEnd={isAtEnd}
        />
      </div>
    </section>
  );
};