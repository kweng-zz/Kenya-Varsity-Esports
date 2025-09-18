'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ticketService } from '@/lib/services/ticketService';
import { FooterSection, Navigation } from '@/components';
import { 
  Ticket, 
  TicketResponse, 
  TICKET_STATUS_LABELS, 
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_PRIORITY_COLORS 
} from '@/types/ticket';

const TicketView: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    loadTicketData();
  }, [ticketId, user]);

  const loadTicketData = async () => {
    try {
      setLoading(true);
      const [ticketData, responsesData] = await Promise.all([
        ticketService.getTicket(ticketId),
        ticketService.getTicketResponses(ticketId)
      ]);

      if (!ticketData) {
        setError('Ticket not found');
        return;
      }

      // Check if user has access to this ticket
      if (ticketData.userId !== user?.$id && !user?.labels?.includes('admin')) {
        setError('You do not have access to this ticket');
        return;
      }

      setTicket(ticketData);
      setResponses(responsesData);

      // Mark as read for the current user
      const isAdmin = user?.labels?.includes('admin') || false;
      await ticketService.markAsRead(ticketId, isAdmin);
      
    } catch (err) {
      console.error('Error loading ticket:', err);
      setError('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await ticketService.addResponse(user.$id, user.name, {
        ticketId,
        message: newMessage,
        attachment: attachment || undefined
      });

      setNewMessage('');
      setAttachment(null);
      await loadTicketData(); // Reload to show new response
    } catch (err) {
      console.error('Error submitting response:', err);
      alert('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachment(file);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <main className="bg-black w-full min-h-screen">
        <div className="w-full relative z-20">
          <Navigation />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading ticket...</div>
        </div>
        <FooterSection />
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="bg-black w-full min-h-screen">
        <div className="w-full relative z-20">
          <Navigation />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error || 'Ticket not found'}</div>
            <Button onClick={() => router.push('/help')} className="bg-[#961c18] hover:bg-[#D13431]">
              Back to Help
            </Button>
          </div>
        </div>
        <FooterSection />
      </main>
    );
  }

  const isAdmin = user?.labels?.includes('admin') || false;

  return (
    <main className="bg-black w-full min-h-screen">
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Ticket Header */}
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{ticket.title}</h1>
              <p className="text-gray-300">Ticket ID: {ticket.ticketId}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-white text-sm ${TICKET_STATUS_COLORS[ticket.status]}`}>
                {TICKET_STATUS_LABELS[ticket.status]}
              </span>
              <span className={`px-3 py-1 rounded-full text-white text-sm ${TICKET_PRIORITY_COLORS[ticket.priority]}`}>
                {TICKET_PRIORITY_LABELS[ticket.priority]} Priority
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Subject:</span>
              <span className="text-white ml-2">{ticket.subject}</span>
            </div>
            <div>
              <span className="text-gray-400">Created:</span>
              <span className="text-white ml-2">{formatDate(ticket.$createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-400">Last Updated:</span>
              <span className="text-white ml-2">{formatDate(ticket.$updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Original Message */}
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {ticket.userName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">{ticket.userName || 'User'}</div>
              <div className="text-gray-400 text-sm">{formatDate(ticket.$createdAt)}</div>
            </div>
          </div>
          <div className="text-gray-300 whitespace-pre-wrap">{ticket.message}</div>
          {ticket.attachmentUrl && (
            <div className="mt-4">
              <a 
                href={ticket.attachmentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#961c18] hover:text-[#D13431] underline"
              >
                📎 {ticket.attachmentName || 'View Attachment'}
              </a>
            </div>
          )}
        </div>

        {/* Responses */}
        {responses.map((response) => (
          <div key={response.$id} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                response.isAdminResponse ? 'bg-[#961c18]' : 'bg-blue-600'
              }`}>
                <span className="text-white font-bold">
                  {response.userName?.charAt(0).toUpperCase() || (response.isAdminResponse ? 'A' : 'U')}
                </span>
              </div>
              <div>
                <div className="text-white font-medium">
                  {response.userName || (response.isAdminResponse ? 'Admin' : 'User')}
                  {response.isAdminResponse && (
                    <span className="ml-2 px-2 py-1 bg-[#961c18] text-white text-xs rounded">ADMIN</span>
                  )}
                </div>
                <div className="text-gray-400 text-sm">{formatDate(response.$createdAt)}</div>
              </div>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap">{response.message}</div>
            {response.attachmentUrl && (
              <div className="mt-4">
                <a 
                  href={response.attachmentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#961c18] hover:text-[#D13431] underline"
                >
                  📎 {response.attachmentName || 'View Attachment'}
                </a>
              </div>
            )}
          </div>
        ))}

        {/* Response Form */}
        {ticket.status !== 'closed' && (
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Add Response</h3>
            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={6}
                  className="w-full p-4 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#961c18] focus:outline-none resize-vertical"
                  placeholder="Type your response here..."
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Attach Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#961c18] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#961c18] file:text-white hover:file:bg-[#D13431] file:cursor-pointer"
                />
                {attachment && (
                  <p className="text-green-400 text-sm mt-2">
                    ✓ File selected: {attachment.name}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !newMessage.trim()}
                  className="bg-[#961c18] hover:bg-[#D13431] text-white font-bold py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Response'}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push('/help')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6"
                >
                  Back to Help
                </Button>
              </div>
            </form>
          </div>
        )}

        {ticket.status === 'closed' && (
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 text-center">
            <div className="text-gray-400 mb-4">This ticket has been closed.</div>
            <Button
              onClick={() => router.push('/help')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6"
            >
              Back to Help
            </Button>
          </div>
        )}
      </div>

      <FooterSection />
    </main>
  );
};

export default TicketView;