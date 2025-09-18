import React from "react";
import Link from "next/link";

export const ComingSoonSection = () => {
  // Data for the coming soon games
  const comingSoonGames = [
    {
      name: "Coming Soon Game 1",
      image: "/images/EA-WRC.png", // You can replace with actual image paths
      route: "/games/coming-soon-1",
    },
    {
      name: "Coming Soon Game 2", 
      image: "/images/Mobile-Legends.png", // You can replace with actual image paths
      route: "/games/coming-soon-2",
    },
    {
      name: "Fortnite",
      image: "https://c.animaapp.com/md9thhqb0sYxAU/img/fortnight.png",
      route: "/games/fortnite",
    },
  ];

  return (
    <section className="w-full py-20 bg-black relative">
      {/* Background images */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left background image */}
        <img
          className="absolute top-105 left-20 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2"
          alt="Background Left"
          src="/images/Mask Group.png"
        />
        
        {/* Right background image - inverted */}
        <img
          className="absolute top-105 right-20 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]"
          alt="Background Right"
          src="/images/Mask Group.png"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Coming Soon Header */}
        <div className="mb-16 text-center">
          <h2 className="font-bold text-[46px] tracking-[1.84px] mb-6">
            <span className="text-white tracking-[0.85px]">COMING </span>
            <span className="text-red-600/50 tracking-[0.85px]">SOON </span>
            <span className="text-red-600/50 tracking-[0.85px]">OR</span>
            <span className="text-white tracking-[0.85px]"> FUTURE CONSIDERATIONS</span>
          </h2>
          <p className="text-[#aaaaaa] text-[32px] max-w-4xl mx-auto">
            The gaming titles that may join future seasons. <Link href="/contact" className="text-red-600/50 underline">Contact Us</Link>
            <br /> if you wish a game to be added in the roster.
          </p>
        </div>

        {/* Coming Soon Games */}
        <div className="grid grid-cols-1 md:grid-cols-3 mb-32 justify-items-center">
          {comingSoonGames.map((game, index) => (
            <div
              key={`coming-soon-game-${index}`}
              className="relative w-[360px] h-[430px] overflow-hidden bg-black cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-[360px] h-[430px] object-cover border border-white/70"
              />
              
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-2xl font-bold mb-2">COMING SOON</h3>
                  <div className="w-16 h-1 bg-[#961c18] mx-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div> 

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-[#aaaaaa] text-lg max-w-3xl mx-auto">
            Stay tuned for announcements about new gaming titles that will be added to future KUER seasons. 
            These games are currently under consideration based on community interest and competitive viability.
          </p>
        </div>
      </div>
    </section>
  );
};