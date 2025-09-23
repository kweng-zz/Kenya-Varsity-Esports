import { FooterSection } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { RegistrationFormSection } from "@/components/pages/register/Form";
export default function RegisterPage() {
    return (<div className="bg-black w-full min-h-screen" data-model-id="1:2">
      <div className="bg-black w-full relative">
        
        {/* Subtle diamond-like angular lines background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main dark background */}
          <div className="absolute inset-0 bg-black"></div>
          
          
        </div>
        
        {/* Navigation at the top */}
        <div className="relative z-20">
          <Navigation />
        </div>

        {/* Main Content Section */}
        <div className="relative z-10 min-h-screen py-16">
          {/* Registration Form - This component should contain everything */}
          <div className="relative z-20">
            <RegistrationFormSection />
          </div>
        </div>

        {/* Footer Section */}
        <div className="relative z-10">
          <FooterSection />
        </div>
        </div>
      </div>);
}
