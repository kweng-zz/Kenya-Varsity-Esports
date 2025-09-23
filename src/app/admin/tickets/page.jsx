'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ticketService } from '@/lib/services/ticketService';
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '@/types/ticket';
const AdminTicketsPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 25;
    useEffect(() => {
        if (!user?.labels?.includes('admin')) {
            router.push('/');
            return;
        }
        loadTickets();
        loadStats();
    }, [user, filters, currentPage]);
    const loadTickets = async () => {
        try {
            setLoading(true);
            const { tickets: ticketData, total } = await ticketService.getTickets({ ...filters, search: searchTerm }, itemsPerPage, (currentPage - 1) * itemsPerPage);
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
    const loadStats = async () => {
        try {
            const statsData = await ticketService.getTicketStats();
            setStats(statsData);
        }
        catch (error) {
            console.error('Error loading stats:', error);
        }
    };
    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await ticketService.updateTicket(ticketId, { status: newStatus });
            await loadTickets();
            await loadStats();
        }
        catch (error) {
            console.error('Error updating ticket status:', error);
            alert('Failed to update ticket status');
        }
    };
    const handlePriorityChange = async (ticketId, newPriority) => {
        try {
            await ticketService.updateTicket(ticketId, { priority: newPriority });
            await loadTickets();
        }
        catch (error) {
            console.error('Error updating ticket priority:', error);
            alert('Failed to update ticket priority');
        }
    };
    const handleAssignToMe = async (ticketId) => {
        try {
            await ticketService.updateTicket(ticketId, {
                assignedTo: user?.$id,
                status: 'in-progress'
            });
            await loadTickets();
            await loadStats();
        }
        catch (error) {
            console.error('Error assigning ticket:', error);
            alert('Failed to assign ticket');
        }
    };
    const handleBulkStatusChange = async (newStatus) => {
        if (selectedTickets.length === 0)
            return;
        try {
            await Promise.all(selectedTickets.map(ticketId => ticketService.updateTicket(ticketId, { status: newStatus })));
            setSelectedTickets([]);
            await loadTickets();
            await loadStats();
        }
        catch (error) {
            console.error('Error updating tickets:', error);
            alert('Failed to update tickets');
        }
    };
    const toggleTicketSelection = (ticketId) => {
        setSelectedTickets(prev => prev.includes(ticketId)
            ? prev.filter(id => id !== ticketId)
            : [...prev, ticketId]);
    };
    const selectAllTickets = () => {
        setSelectedTickets(tickets.map(t => t.ticketId));
    };
    const clearSelection = () => {
        setSelectedTickets([]);
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
    if (!user?.labels?.includes('admin')) {
        return <div>Access denied</div>;
    }
    return (<div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ticket Management</h1>
            <p className="text-gray-400">Manage and respond to support tickets</p>
          </div>
          <Button onClick={() => router.push('/admin')} className="bg-gray-600 hover:bg-gray-700">
            Back to Admin
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{stats.open}</div>
              <div className="text-sm text-gray-400">Open</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">{stats.waitingForUser}</div>
              <div className="text-sm text-gray-400">Waiting User</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{stats.waitingForAdmin}</div>
              <div className="text-sm text-gray-400">Waiting Admin</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
              <div className="text-sm text-gray-400">Resolved</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-400">{stats.closed}</div>
              <div className="text-sm text-gray-400">Closed</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-400">{stats.unreadByAdmin}</div>
              <div className="text-sm text-gray-400">Unread</div>
            </div>
          </div>)}

        {/* Filters and Search */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tickets..." className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-[#961c18] focus:outline-none"/>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select value={filters.status?.[0] || ''} onChange={(e) => setFilters(prev => ({
            ...prev,
            status: e.target.value ? [e.target.value] : undefined
        }))} className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-[#961c18] focus:outline-none">
                <option value="">All Statuses</option>
                {Object.entries(TICKET_STATUS_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select value={filters.priority?.[0] || ''} onChange={(e) => setFilters(prev => ({
            ...prev,
            priority: e.target.value ? [e.target.value] : undefined
        }))} className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-[#961c18] focus:outline-none">
                <option value="">All Priorities</option>
                {Object.entries(TICKET_PRIORITY_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input type="checkbox" checked={filters.unreadOnly || false} onChange={(e) => setFilters(prev => ({
            ...prev,
            unreadOnly: e.target.checked || undefined
        }))} className="mr-2"/>
                Unread only
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={loadTickets} className="bg-[#961c18] hover:bg-[#D13431]">
              Apply Filters
            </Button>
            <Button onClick={() => {
            setFilters({});
            setSearchTerm('');
            setCurrentPage(1);
        }} className="bg-gray-600 hover:bg-gray-700">
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTickets.length > 0 && (<div className="bg-gray-800 p-4 rounded-lg mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm">{selectedTickets.length} tickets selected</span>
              <div className="flex gap-2">
                <Button onClick={() => handleBulkStatusChange('in-progress')} className="bg-yellow-600 hover:bg-yellow-700 text-sm py-1 px-3">
                  Mark In Progress
                </Button>
                <Button onClick={() => handleBulkStatusChange('resolved')} className="bg-green-600 hover:bg-green-700 text-sm py-1 px-3">
                  Mark Resolved
                </Button>
                <Button onClick={() => handleBulkStatusChange('closed')} className="bg-gray-600 hover:bg-gray-700 text-sm py-1 px-3">
                  Close
                </Button>
                <Button onClick={clearSelection} className="bg-red-600 hover:bg-red-700 text-sm py-1 px-3">
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>)}

        {/* Tickets Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-4 text-left">
                    <input type="checkbox" onChange={(e) => e.target.checked ? selectAllTickets() : clearSelection()} checked={selectedTickets.length === tickets.length && tickets.length > 0}/>
                  </th>
                  <th className="p-4 text-left">Ticket</th>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Subject</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Priority</th>
                  <th className="p-4 text-left">Created</th>
                  <th className="p-4 text-left">Last Response</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400">
                      Loading tickets...
                    </td>
                  </tr>) : tickets.length === 0 ? (<tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400">
                      No tickets found
                    </td>
                  </tr>) : (tickets.map((ticket) => (<tr key={ticket.$id} className="border-t border-gray-700 hover:bg-gray-700/50">
                      <td className="p-4">
                        <input type="checkbox" checked={selectedTickets.includes(ticket.ticketId)} onChange={() => toggleTicketSelection(ticket.ticketId)}/>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-white">{ticket.ticketId}</div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {ticket.title}
                          </div>
                          {ticket.isUnreadByAdmin && (<span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2"></span>)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-300">{ticket.userName || 'Unknown'}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-300">{ticket.subject}</div>
                      </td>
                      <td className="p-4">
                        <select value={ticket.status} onChange={(e) => handleStatusChange(ticket.ticketId, e.target.value)} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm">
                          {Object.entries(TICKET_STATUS_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                        </select>
                      </td>
                      <td className="p-4">
                        <select value={ticket.priority} onChange={(e) => handlePriorityChange(ticket.ticketId, e.target.value)} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm">
                          {Object.entries(TICKET_PRIORITY_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-400">{getTimeAgo(ticket.$createdAt)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-400">
                          {ticket.lastResponseAt ? getTimeAgo(ticket.lastResponseAt) : 'No responses'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button onClick={() => router.push(`/help/tickets/${ticket.ticketId}`)} className="bg-[#961c18] hover:bg-[#D13431] text-sm py-1 px-3">
                            View
                          </Button>
                          {ticket.assignedTo !== user?.$id && (<Button onClick={() => handleAssignToMe(ticket.ticketId)} className="bg-blue-600 hover:bg-blue-700 text-sm py-1 px-3">
                              Assign to Me
                            </Button>)}
                        </div>
                      </td>
                    </tr>)))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (<div className="p-4 border-t border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50">
                  Previous
                </Button>
                <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50">
                  Next
                </Button>
              </div>
            </div>)}
        </div>
      </div>
    </div>);
};
export default AdminTicketsPage;
