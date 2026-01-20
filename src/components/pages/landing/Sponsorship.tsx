// SponsorTiers.tsx
import React from 'react';
import Image from 'next/image'; // If using Next.js

const SponsorTiers = () => {
  const tiers = [
    {
      level: 'PLATINUM',
      description: 'Brand Visibility',
      benefits: [
        'Logo on tournament overlays',
        'Logo on posters',
        'Social media mentions',
        'Featured in recap assets',
      ],
      buttonText: 'BECOME A SPONSOR',
      colorClass: 'red-900 border-red-900',
      textColor: 'text-white',
      buttonColor: 'bg-red-900 hover:bg-red-600',
      iconColor: 'bg-gradient-to-br from-gray-300 to-gray-400',
      iconBorder: 'border-gray-300',
    },
    {
      level: 'GOLD',
      description: 'Brand Visibility',
      benefits: [
        'Branded on tournament overlays',
        'Branding on 2 recap assets',
        'Featured in recap videos',
      ],
      buttonText: 'BECOME A SPONSOR',
      colorClass: 'red-900 border-red-900',
      textColor: 'text-white',
      buttonColor: 'bg-red-900 hover:bg-red-600',
      iconColor: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconBorder: 'border-yellow-500',
    },
    {
      level: 'SILVER',
      description: 'Brand Visibility',
      benefits: [
        'Listed in supporting partners',
        'Pictured in recap banners',
        'Recognized in broadcasts',
      ],
      buttonText: 'BECOME A SPONSOR',
      colorClass: 'red-900 border-red-900',
      textColor: 'text-white',
      buttonColor: 'bg-red-900 hover:bg-red-600',
      iconColor: 'bg-gradient-to-br from-gray-400 to-gray-500',
      iconBorder: 'border-gray-400',
    },
    {
      level: 'BRONZE',
      description: 'Bronze Benefits',
      benefits: [
        'Branded banners, MVP, Social Media',
        'Weekly social media integrations',
        'Co-branded Discord community',
      ],
      buttonText: 'BECOME A SPONSOR',
      colorClass: 'red-900 border-red-900',
      textColor: 'text-white',
      buttonColor: 'bg-red-900 hover:bg-red-600',
      iconColor: 'bg-gradient-to-br from-orange-600 to-amber-700',
      iconBorder: 'border-orange-600',
    },
  ];

  const getTierIcon = (level: string) => {
    switch (level) {
      case 'PLATINUM':
        return (
          <svg className="w-10 h-10 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'GOLD':
        return (
          <svg className="w-10 h-10 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'SILVER':
        return (
          <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'BRONZE':
        return (
          <svg className="w-10 h-10 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-5">
          SPONSORSHIP TIERS
        </h1>
        <p className="text-gray-400 text-center mb-12">
          Join us in building the future of esports in Kenya
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tiers.map((tier, index) => (
            <div
              key={tier.level}
              className={`relative rounded-2xl overflow-hidden border-2 ${tier.colorClass} backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col`}
            > 
              <div className="p-6 md:p-8 flex flex-col grow">
                {/* Tier Header */}
                <div className="text-center mb-8">
                  <div className={`inline-block p-4 rounded-full ${tier.iconColor} border-4 ${tier.iconBorder} mb-4 shadow-lg`}>
                    <div className="w-16 h-16 flex items-center justify-center mx-auto">
                      {getTierIcon(tier.level)}
                    </div>
                  </div>
                  <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${tier.textColor}`}>
                    {tier.level} SPONSOR
                  </h2>
                  <p className="text-gray-600 font-medium">{tier.description}</p>
                </div>

                {/* Benefits List */}
                <div className="mb-8 grow">
                  <h3 className="font-semibold text-white mb-4">Benefits Include:</h3>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className={`w-5 h-5 ${tier.textColor} mt-1 mr-3 shrink-0`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-white">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <button
                    className={`w-full py-3 px-6 rounded-lg ${tier.buttonColor} text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg`}
                    onClick={() => console.log(`Clicked ${tier.level} sponsor`)}
                  >
                    {tier.buttonText}
                  </button>
                  
                  {/* Price or additional info */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Contact us for pricing details
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default SponsorTiers;