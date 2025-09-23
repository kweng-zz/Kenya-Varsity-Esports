'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ticketService } from '@/lib/services/ticketService';
import { TICKET_SUBJECTS } from '@/types/ticket';
import { FooterSection, Navigation } from '@/components';
const NewTicketForm = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        subject: 'General Support',
        message: '',
        attachment: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const subjectOptions = Object.keys(TICKET_SUBJECTS);
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }
        else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters long';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        if (!user) {
            alert('You must be logged in to create a ticket.');
            router.push('/login');
            return;
        }
        setIsSubmitting(true);
        try {
            const ticket = await ticketService.createTicket(user.$id, user.name, {
                title: formData.title,
                subject: formData.subject,
                message: formData.message,
                attachment: formData.attachment || undefined
            });
            // Show success message
            alert(`Ticket created successfully! Your ticket ID is: ${ticket.ticketId}\n\nYou can track your ticket status in the help section.`);
            // Redirect to ticket view or help page
            router.push(`/help/tickets/${ticket.ticketId}`);
        }
        catch (error) {
            console.error('Error creating ticket:', error);
            alert('There was an error creating your ticket. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, attachment: file }));
    };
    return (<div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Support Ticket</h1>
          <p className="text-gray-300">
            Need help? Submit a support ticket and our team will get back to you as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-white font-['Hind',Helvetica] font-medium text-lg mb-2">
              Title *
            </label>
            <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className={`w-full p-4 bg-gray-700 text-white rounded border ${errors.title ? 'border-red-500' : 'border-gray-600'} focus:border-[#961c18] focus:outline-none text-lg`} placeholder="Brief description of your issue"/>
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block text-white font-['Hind',Helvetica] font-medium text-lg mb-2">
              Subject
            </label>
            <select value={formData.subject} onChange={(e) => handleInputChange('subject', e.target.value)} className="w-full p-4 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#961c18] focus:outline-none text-lg">
              {subjectOptions.map((option) => (<option key={option} value={option}>
                  {option}
                </option>))}
            </select>
          </div>

          {/* Message Text Area */}
          <div>
            <label className="block text-white font-['Hind',Helvetica] font-medium text-lg mb-2">
              Message *
            </label>
            <textarea value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} rows={12} className={`w-full p-4 bg-gray-700 text-white rounded border ${errors.message ? 'border-red-500' : 'border-gray-600'} focus:border-[#961c18] focus:outline-none text-lg resize-vertical`} placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, and any other relevant information..."/>
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
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-4 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#961c18] focus:outline-none text-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#961c18] file:text-white hover:file:bg-[#D13431] file:cursor-pointer"/>
              {formData.attachment && (<p className="text-green-400 text-sm mt-2">
                  ✓ File selected: {formData.attachment.name}
                </p>)}
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Supported formats: JPG, PNG, GIF (Max size: 5MB)
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button type="button" onClick={() => router.push('/help')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 text-lg transition-colors duration-300" disabled={isSubmitting}>
              Cancel
            </Button>
            
            <Button type="submit" className="bg-[#961c18] hover:bg-[#D13431] text-white font-bold py-4 px-8 text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </div>);
};
export default function NewTicketPage() {
    return (<main className="bg-black w-full min-h-screen">
      {/* Navigation at the top - full width across entire page */}
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      {/* New Ticket Form */}
      <div className="py-16">
        <NewTicketForm />
      </div>

      {/* Footer section - full width */}
      <FooterSection />
    </main>);
}
