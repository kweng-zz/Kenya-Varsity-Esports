"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface NewTicketFormData {
  title: string;
  subject: string;
  message: string;
  attachment: File | null;
}

export const NewTicketForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<NewTicketFormData>({
    title: '',
    subject: 'General Support',
    message: '',
    attachment: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<NewTicketFormData>>({});

  const subjectOptions = [
    'General Support',
    'Tournament Registration',
    'Account Issues',
    'Technical Problems',
    'Payment & Billing',
    'Student Verification',
    'Rankings & Leaderboards',
    'Bug Report',
    'Feature Request'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<NewTicketFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate ticket ID
      const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
      
      // Show success message
      alert(`Ticket created successfully! Your ticket ID is: ${ticketId}\n\nYou will receive an email confirmation shortly.`);
      
      // Redirect back to help page
      router.push('/help');
      
    } catch (error) {
      alert('There was an error creating your ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof NewTicketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, attachment: file }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-white font-['Hind',Helvetica] font-medium text-lg mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full p-4 bg-gray-700 text-white rounded border ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              } focus:border-[#961c18] focus:outline-none text-lg`}
              placeholder="Brief description of your issue"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block text-white font-['Hind',Helvetica] font-medium text-lg mb-2">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full p-4 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#961c18] focus:outline-none text-lg"
            >
              {subjectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Message Text Area */}
          <div>
            <label className="block text-white font-['Hind',Helvetica] font-medium text-lg mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={12}
              className={`w-full p-4 bg-gray-700 text-white rounded border ${
                errors.message ? 'border-red-500' : 'border-gray-600'
              } focus:border-[#961c18] focus:outline-none text-lg resize-vertical`}
              placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, and any other relevant information..."
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            <p className="text-gray-400 text-sm mt-1">
              {formData.message.length} characters (minimum 10 required)
            </p>
          </div>

          {/* Image Attachment */}
          <div>
            <label className="block text-white font-['Hind',Helvetica] font-medium text-lg mb-2">
              Attach Image (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-4 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#961c18] focus:outline-none text-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#961c18] file:text-white hover:file:bg-[#D13431] file:cursor-pointer"
              />
              {formData.attachment && (
                <p className="text-green-400 text-sm mt-2">
                  ✓ File selected: {formData.attachment.name}
                </p>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Supported formats: JPG, PNG, GIF (Max size: 5MB)
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              type="button"
              onClick={() => router.push('/help')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 text-lg transition-colors duration-300"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              className="bg-[#961c18] hover:bg-[#D13431] text-white font-bold py-4 px-8 text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};