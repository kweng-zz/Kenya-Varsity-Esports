'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export const ContactForm = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setErrorMessage('Please fill in all fields');
            setSubmitStatus('error');
            return;
        }

        if (formData.name.trim().length < 2) {
            setErrorMessage('Name must be at least 2 characters long');
            setSubmitStatus('error');
            return;
        }

        if (formData.message.trim().length < 10) {
            setErrorMessage('Message must be at least 10 characters long');
            setSubmitStatus('error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            setErrorMessage('Please enter a valid email address');
            setSubmitStatus('error');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            console.log('📤 Submitting contact form...');
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    type: 'partnership'
                }),
            });

            console.log('📊 Response status:', response.status);
            const result = await response.json();
            console.log('📊 Response data:', result);

            if (result.success || response.ok) {
                console.log('✅ Form submitted successfully');
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                console.error('❌ Form submission failed:', result.error);
                setSubmitStatus('error');
                setErrorMessage(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('❌ Contact form error:', error);
            setSubmitStatus('error');
            setErrorMessage('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {submitStatus === 'success' && (
                <div className="bg-green-900/20 border border-green-600/30 rounded p-4 mb-4">
                    <p className="text-green-400 text-sm">
                        Message sent successfully! We'll get back to you soon.
                    </p>
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="bg-red-900/20 border border-red-600/30 rounded p-4 mb-4">
                    <p className="text-red-400 text-sm">
                        {errorMessage}
                    </p>
                </div>
            )}

            <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full h-32 bg-transparent border border-white/20 rounded-none text-white font-['Hind',Helvetica] font-semibold p-5 placeholder:text-white"
                placeholder="WRITE MESSAGE"
                disabled={isSubmitting}
                required
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/20 rounded-none text-white font-['Hind',Helvetica] font-semibold p-5 placeholder:text-white"
                    placeholder="YOUR NAME"
                    disabled={isSubmitting}
                    required
                />

                <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/20 rounded-none text-white font-['Hind',Helvetica] font-semibold p-5 placeholder:text-white"
                    placeholder="YOUR EMAIL"
                    disabled={isSubmitting}
                    required
                />
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#961c18] hover:bg-[#7a1714] text-white font-['Hind',Helvetica] font-semibold px-10 py-6 rounded-none relative overflow-hidden skewed-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="relative z-10">
                        {isSubmitting ? 'SENDING...' : 'SUBMIT'}
                    </span>
                </Button>
            </div>
        </form>
    );
};