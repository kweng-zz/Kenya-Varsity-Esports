import React from 'react';
import Image from 'next/image';

const logos = [
  { src: '/images/Valorant.png', alt: 'Valorant' },
  { src: '/images/Bloodstrike.png', alt: 'Bloodstrike' },
  { src: '/images/EA-WRC.png', alt: 'EA WRC' },
  { src: '/images/EAFC--Open.png', alt: 'EAFC' },
  { src: '/images/Efootball-Mobile.png', alt: 'eFootball' },
  { src: '/images/Mobile-Legends.png', alt: 'Mobile Legends' },
  { src: '/images/NBA2k.png', alt: 'NBA 2K' },
  { src: '/images/PUBGM.jpeg', alt: 'PUBGM' },
  { src: '/images/Rocket-League.png', alt: 'Rocket League' },
  { src: '/images/Chess.png', alt: 'Chess' },
  { src: '/images/CODM-BR.png', alt: 'CODM BR' },
];

export const LogoLoop = () => {
  // Duplicate the logos to create a seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden bg-transparent py-10">
      <div className="flex animate-infinite-scroll whitespace-nowrap">
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-8 md:mx-12 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={60}
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
