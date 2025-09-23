import { Navigation, FooterSection } from "@/components";
export default function RankingsPage() {
    return (<main className="bg-black w-full min-h-screen">
            {/* Navigation at the top - full width across entire page */}
            <div className="w-full relative z-20">
                <Navigation />
            </div>

            {/* Content Area with Animation */}
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                <div className="text-center">
                    {/* Animated Icon */}
                    <div className="mb-8">
                        <div className="relative inline-block">
                            {/* Rotating gear/cog animation */}
                            <div className="w-24 h-24 mx-auto mb-4 animate-spin">
                                <svg className="w-full h-full text-[#961c18]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
                                </svg>
                            </div>
                            
                            {/* Pulsing dots */}
                            <div className="flex justify-center space-x-2">
                                <div className="w-2 h-2 bg-[#961c18] rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-[#961c18] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-[#961c18] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Text */}
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-pulse">
                        RANKINGS
                    </h1>
                    
                    {/* Subtitle */}
                    <div className="relative">
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#961c18] mb-4">
                            Under Rebuild
                        </h2>
                        
                        {/* Animated underline */}
                        <div className="w-32 h-1 bg-[#961c18] mx-auto rounded-full">
                            <div className="h-full bg-white rounded-full animate-ping"></div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-relaxed">
                        We're working hard to bring you an amazing new rankings experience. 
                        Our team is rebuilding this section to provide better performance, 
                        more detailed statistics, and an improved user interface.
                    </p>

                    {/* Coming Soon Badge */}
                    <div className="mt-12">
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#961c18] to-[#D13431] text-white font-bold rounded-full shadow-lg animate-bounce">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Coming Soon
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-8 max-w-md mx-auto">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Progress</span>
                            <span>75%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-[#961c18] to-[#D13431] h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <FooterSection />
        </main>);
}
