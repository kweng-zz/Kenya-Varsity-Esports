import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export const CompetitionSection = () => {
    // Data for the information cards
    const infoCards = [
        {
            title: "44+ Universities and Growing",
            description: "We also collaborate closely with university clubs, leaders, and societies to host on-campus and online tournaments",
            image: "https://c.animaapp.com/mdczve1hcUQk59/img/22-1.png",
            alt: "Element",
        },
        {
            title: "1,000+ Participants",
            description: "KUER is open to all university students, regardless of skill level. Whether you're a casual player, competitive athlete, or content creator, there's a place for you in the KUER community.",
            image: "https://c.animaapp.com/mdczve1hcUQk59/img/chatgpt-image-jul-20--2025--10-58-56-pm-1.png",
            alt: "Chatgpt image jul",
        },
        {
            title: "National & Future International Competitions",
            description: "Per Semester tournaments feed into our national rankings and finals, with top-performing students earning national MVP. KUER aims to scale to regional and continental competitions, putting Kenyan university gamers on the global stage.",
            image: "https://c.animaapp.com/mdczve1hcUQk59/img/chatgpt-image-jul-20--2025--11-11-17-pm-1.png",
            alt: "Chatgpt image jul",
        },
        {
            title: "Beyond Gaming: Esports Education",
            description: "We are pioneering esports education in Kenya, offering upcoming programs in casting, streaming, tournament organizing, and content creation to help build the next generation of esports professionals.",
            image: "https://c.animaapp.com/mdczve1hcUQk59/img/untitled-2-1.png",
            alt: "Untitled",
        },
    ];
    return (<section className="relative w-full py-16 bg-[url(https://c.animaapp.com/mdczve1hcUQk59/img/group-421.png)] bg-cover">
      <p className="font-['Hind',Helvetica] font-normal text-[#bcc6c9] text-lg text-center max-w-3xl mx-auto mb-12 px-6">
          We are the premier university esports platform in Kenya, delivering competitive, social,
          and educational experiences to students across the country. KUER creates opportunitites for University
          gamers to thrive through regular tournaments, rankings, content creation and esports
          education-all while pursuing their studies. </p> <p className="font-['Hind',Helvetica] font-normal text-[#bcc6c9] text-lg text-center max-w-3xl mx-auto mt-12 px-6"> If you are interested in joining KUER 
          or partnering with us, please contact us at <span className="text-red-800">info@kuer.co.ke</span>
        </p>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-4">
          
          {infoCards.map((card, index) => (<Card key={index} className="flex flex-row items-center h-[130px] bg-[#420f16] shadow-[0px_4px_40px_#00000040] border-none rounded-none">
              {/* Image on the left side */}
              <div className="w-[199px] h-[110px] m-2.5 bg-transparent flex-shrink-0 order-1">
                <img className="w-full h-full object-cover" alt={card.alt} src={card.image}/>
              </div>
              {/* Text content on the right side */}
              <div className="flex-1 py-2.5 px-4 order-2">
                <h3 className="font-['Hind',Helvetica] font-semibold text-white text-xl mb-2">
                  {card.title}
                </h3>
                <p className="font-['Hind',Helvetica] font-normal text-[#bcc6c9] text-sm">
                  {card.description}
                </p>
              </div>
            </Card>))}
        </div>

        <div className="relative">
          <Card className="w-full h-[580px] bg-[#000000cc] border-none rounded-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(261deg,rgba(150,28,24,0.6)_0%,rgba(224,50,91,0.05)_100%)]"/>

            <div className="relative h-[233px] mx-10 mt-7 mb-4 flex items-center justify-center">
              <img className="w-[436px] h-[243px] object-cover" alt="Intense focus in" src="https://c.animaapp.com/mdczve1hcUQk59/img/intense-focus-in-esports-competition-1.png"/>
            </div>

            <CardContent className="relative px-10 pt-4">
              <h2 className="font-['Hind',Helvetica] font-semibold text-white text-[28px] mb-6">
                A LOCAL MOVEMENT WITH A NATIONAL VISION
              </h2>
              <p className="font-['Hind',Helvetica] font-normal text-[#bcc6c9] text-lg">
                Kenya University Esports Rankings (KUER) was founded by gamers,
                for gamers—with the mission to build a thriving esports
                ecosystem in Kenyan universities. We believe every student
                deserves a platform to compete, learn, and grow within the world
                of gaming and esports.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>);
};
