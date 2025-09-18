import React from "react";

export const StatisticsSection = () => {
  // Data for statistics to enable mapping
  const statistics = [
    {
      value: "13.2K",
      label: "TIKTOK\nLIKES",
    },
    {
      value: "1.48k",
      label: "YOUTUBE\nSUBSCRIBERS",
    },
    {
      value: "3500+",
      label: "INSTAGRAM\nFOLLOWERS",
    },
    {
      value: "1000+",
      label: "ALL TIME\nPARTICIPANTS",
    },
  ];

  return (
    <section className="w-full bg-[#0c0e11] py-16">
      <div className="container mx-auto flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-6xl">
          {statistics.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                className="w-12 h-[45px] mb-5"
                alt="Star"
                src="https://c.animaapp.com/md7xc8iywLDvVn/img/star-4.svg"
              />
              <div className="[font-family:'Hind',Helvetica] font-semibold text-[#961c18] text-[54px] text-center">
                {stat.value}
              </div>
              <div className="[font-family:'Hind',Helvetica] font-semibold text-[#bcc6c9] text-xl text-center mt-6 whitespace-pre-line">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
