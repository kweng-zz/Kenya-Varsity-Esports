'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";





export default function VerifyEmailPage() {
    const { resendVerificationEmail } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleResend = async () => {
        setIsLoading(true);
        try {
            await resendVerificationEmail();
            setMessage('Verification email sent. Check your inbox.');
        } catch (error) {
            setMessage('Failed to resend verification email. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
        return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[#961c18] mb-4">Verify Your Email</h1>
        <p className="text-gray-300 mb-6">
          We’ve sent a verification link to your email address. Please check your inbox and click the link to activate your account.
        </p>

        {message && <p className="text-sm text-gray-400 mb-4">{message}</p>}

        <Button 
          onClick={handleResend} 
          disabled={isLoading}
          className="w-full bg-[#961c18] hover:bg-[#7a1514] rounded-lg"
        >
          {isLoading ? 'Resending...' : 'Resend Verification Email'}
        </Button>

        <p 
          onClick={() => router.push('/login')} 
          className="mt-6 text-sm text-[#961c18] hover:text-[#7a1514] cursor-pointer"
        >
          Already verified? Sign in
        </p>
      </div>
    </section>
  );
}