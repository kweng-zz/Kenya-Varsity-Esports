'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";





export default function VerifyEmailPage() {
    const { resendVerificationEmail, verifyEmail } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');
    const isNewRegistration = searchParams.get('new') === 'true';

    const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // If we have userId and secret, attempt verification
        if (userId && secret && status === 'idle') {
            const verify = async () => {
                setStatus('verifying');
                try {
                    const { error } = await verifyEmail(userId, secret);
                    if (error) {
                        setStatus('error');
                        setMessage('Verification failed. The link may be invalid or expired.');
                    } else {
                        setStatus('success');
                        setMessage('Email verified successfully! You can now access all features.');
                        // Optional: Redirect to login or home after a delay
                        setTimeout(() => router.push('/'), 3000);
                    }
                } catch (err) {
                    setStatus('error');
                    setMessage('An unexpected error occurred during verification.');
                }
            };
            verify();
        }
    }, [userId, secret, status, verifyEmail, router]);

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
                {/* Header Logic based on Status */}
                {status === 'verifying' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
                        <h1 className="text-3xl font-bold text-white mb-4">Verifying Email...</h1>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="mx-auto mb-4 bg-green-900/20 p-4 rounded-full w-fit border border-green-600/30">
                             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-green-500 mb-2">Verified!</h1>
                        <p className="text-gray-300 mb-6">Redirecting you to the homepage...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                         <div className="mx-auto mb-4 bg-red-900/20 p-4 rounded-full w-fit border border-red-600/30">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-red-500 mb-2">Verification Failed</h1>
                        <p className="text-gray-300 mb-6">{message}</p>
                    </>
                )}

                {/* Default State (Registration Confirm or Idle) */}
                {status === 'idle' && (
                    <>
                        <h1 className="text-3xl font-bold text-[#961c18] mb-4">
                            {isNewRegistration ? 'Check Your Inbox' : 'Verify Your Email'}
                        </h1>
                        <p className="text-gray-300 mb-6">
                            {isNewRegistration 
                                ? "We’ve sent a verification link to your email address. Please click the link to activate your account."
                                : "Please check your inbox and click the link to activate your account."
                            }
                        </p>
                    </>
                )}

                {/* Status Message (for resend action) */}
                {status === 'idle' && message && <p className="text-sm text-green-400 mb-4">{message}</p>}

                {/* Resend Button - only show if not success */}
                {status !== 'success' && (
                    <Button 
                        onClick={handleResend} 
                        disabled={isLoading || status === 'verifying'}
                        className="w-full bg-[#961c18] hover:bg-[#7a1514] rounded-lg mt-2"
                    >
                        {isLoading ? 'Resending...' : 'Resend Verification Email'}
                    </Button>
                )}

                {(status === 'success' || status === 'error' || status === 'idle') && (
                    <p 
                        onClick={() => router.push('/login')} 
                        className="mt-6 text-sm text-[#961c18] hover:text-[#7a1514] cursor-pointer"
                    >
                        {status === 'success' ? 'Continue to Sign In' : 'Back to Sign In'}
                    </p>
                )}
            </div>
        </section>
    );
}