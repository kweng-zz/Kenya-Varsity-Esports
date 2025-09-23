import React from "react";
export const HeroSection = () => {
    return (<section className="relative w-full h-screen">
      <div className="relative h-full w-full">
        {/* Background image */}
        <img className="w-full h-full object-cover" alt="Esports players competing" src="https://c.animaapp.com/md7xc8iywLDvVn/img/esports-1.png"/>

        <div className="absolute inset-0 w-full h-full">
          <div className="relative h-full">
            {/* Overlay image */}
            <img className="w-full h-full object-cover" alt="Background overlay" src="https://c.animaapp.com/md7xc8iywLDvVn/img/group-418.png"/>

            {/* Main content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[668px] text-center">
              <h2 className="font-bold text-white text-2xl mb-[14px] font-['Hind',Helvetica]">
                ABOUT US
              </h2>
              <h1 className="font-bold text-[#8e130e] text-[54px] tracking-[2.16px] leading-[70.2px] font-['Hind',Helvetica]">
                KENYA UNIVERSITY
                <br />
                ESPORTS RANKINGS
              </h1>
            </div>

            {/* Decorative elements */}
            <div className="absolute w-[592px] h-1 bottom-[100px] right-0 bg-red-900 opacity-20"/>
            
            {/* Sponsor Rectangle - Slanted Trapezium (Ready for logos) */}
            <div className="absolute bottom-0 left-0 w-[951px] h-[100px] bg-red-900 flex items-center px-6" style={{
            clipPath: 'polygon(0% 0%, 85% 0%, 100% 100%, 0% 100%)',
            overflow: 'hidden' // keeps it clipped inside
        }}>
  <img src="/images/B34R-CL4N-with-name.png" alt="B34R-CL4N" className="max-h-[150px] object-contain"/>
    </div>

          </div>
        </div>
      </div>
    </section>);
};
