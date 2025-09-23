'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ticketService } from '@/lib/services/ticketService';
import { FooterSection, Navigation } from '@/components';
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, TICKET_STATUS_COLORS, TICKET_PRIORITY_COLORS } from '@/types/ticket';
const UserTicketsPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        loadTickets();
    }, [user, currentPage]);
    const loadTickets = async () => {
        if (!user)
            return;
        try {
            setLoading(true);
            const { tickets: ticketData, total } = await ticketService.getTickets({ userId: user.$id }, itemsPerPage, (currentPage - 1) * itemsPerPage);
            setTickets(ticketData);
            setTotalPages(Math.ceil(total / itemsPerPage));
        }
        catch (error) {
            console.error('Error loading tickets:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1)
            return 'Just now';
        if (diffInHours < 24)
            return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7)
            return `${diffInDays}d ago`;
        return formatDate(dateString);
    };
    if (!user) {
        return (<main className="bg-black w-full min-h-screen">
        <div className="w-full relative z-20">
          <Navigation />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-white text-xl mb-4">Please log in to view your tickets</div>
            <Button onClick={() => router.push('/login')} className="bg-[#961c18] hover:bg-[#D13431]">
              Log In
            </Button>
          </div>
        </div>
        <FooterSection />
      </main>);
    }
    return (<main className="bg-black w-full min-h-screen">
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Support Tickets</h1>
            <p className="text-gray-400">View and manage your support tickets</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/help/new-ticket')} className="bg-[#961c18] hover:bg-[#D13431]">
              Create New Ticket
            </Button>
            <Button onClick={() => router.push('/help')} className="bg-gray-600 hover:bg-gray-700">
              Back to Help
            </Button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (<div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700 text-center">
              <div className="text-white text-xl">Loading your tickets...</div>
            </div>) : tickets.length === 0 ? (<div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700 text-center">
              <div className="text-white text-xl mb-4">No tickets found</div>
              <p className="text-gray-400 mb-6">
                You haven't created any support tickets yet. Need help? Create your first ticket!
              </p>
              <Button onClick={() => router.push('/help/new-ticket')} className="bg-[#961c18] hover:bg-[#D13431]">
                Create Your First Ticket
              </Button>
            </div>) : (tickets.map((ticket) => (<div key={ticket.$id} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{ticket.title}</h3>
                      {ticket.isUnreadByUser && (<span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <span className="text-gray-400">ID: {ticket.ticketId}</span>
                      <span className="text-gray-400">Subject: {ticket.subject}</span>
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${TICKET_STATUS_COLORS[ticket.status]}`}>
                        {TICKET_STATUS_LABELS[ticket.status]}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${TICKET_PRIORITY_COLORS[ticket.priority]}`}>
                        {TICKET_PRIORITY_LABELS[ticket.priority]} Priority
                      </span>
                    </div>

                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {ticket.message.length > 150
                ? `${ticket.message.substring(0, 150)}...`
                : ticket.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span>Created: {formatDate(ticket.$createdAt)}</span>
                      <span>Last Updated: {getTimeAgo(ticket.$updatedAt)}</span>
                      <span>Responses: {ticket.responseCount}</span>
                      {ticket.lastResponseAt && (<span>Last Response: {getTimeAgo(ticket.lastResponseAt)}</span>)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button onClick={() => router.push(`/help/tickets/${ticket.ticketId}`)} className="bg-[#961c18] hover:bg-[#D13431] whitespace-nowrap">
                      View Ticket
                    </Button>
                    
                    {ticket.status === 'closed' && (<Button onClick={() => router.push('/help/new-ticket')} className="bg-gray-600 hover:bg-gray-700 whitespace-nowrap text-sm">
                        Create New
                      </Button>)}
                  </div>
                </div>
              </div>)))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (<div className="mt-8 flex items-center justify-center gap-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50">
              Previous
            </Button>
            
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50">
              Next
            </Button>
          </div>)}

        {/* Quick Actions */}
        <div className="mt-12 bg-gray-800/30 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Need More Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Create a New Ticket</h3>
              <p className="text-gray-400 mb-4">
                Have a new issue or question? Create a support ticket and we'll help you out.
              </p>
              <Button onClick={() => router.push('/help/new-ticket')} className="bg-[#961c18] hover:bg-[#D13431]">
                Create New Ticket
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Browse Help Articles</h3>
              <p className="text-gray-400 mb-4">
                Check out our help articles and FAQ for quick answers to common questions.
              </p>
              <Button onClick={() => router.push('/help')} className="bg-gray-600 hover:bg-gray-700">
                Browse Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </main>);
};
export default UserTicketsPage;
