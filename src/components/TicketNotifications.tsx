'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ticketService } from '@/lib/services/ticketService';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface TicketNotification {
  id: string;
  ticketId: string;
  title: string;
  type: 'new_ticket' | 'new_response' | 'urgent';
  timestamp: string;
  isRead: boolean;
}

export const TicketNotifications: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<TicketNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  const isAdmin = user?.labels?.includes('admin') || false;

  useEffect(() => {
    if (!isAdmin) return;

    // Load initial notifications
    loadNotifications();

    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  const loadNotifications = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      
      // Get unread tickets and recent activity
      const { tickets } = await ticketService.getTickets(
        { unreadOnly: true },
        10,
        0
      );

      const newNotifications: TicketNotification[] = tickets.map(ticket => ({
        id: ticket.$id,
        ticketId: ticket.ticketId,
        title: ticket.title,
        type: ticket.priority === 'urgent' ? 'urgent' : 'new_ticket',
        timestamp: ticket.$createdAt,
        isRead: false
      }));

      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (notification: TicketNotification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    router.push(`/help/tickets/${notification.ticketId}`);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setIsOpen(false);
  };

  if (!isAdmin) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
        title="Support Tickets"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v4" />
        </svg>
        
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Support Tickets</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push('/admin/tickets')}
                  className="bg-[#961c18] hover:bg-[#D13431] text-xs py-1 px-2"
                >
                  View All
                </Button>
                {notifications.length > 0 && (
                  <Button
                    onClick={clearAllNotifications}
                    className="bg-gray-600 hover:bg-gray-700 text-xs py-1 px-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No new tickets
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors ${
                    !notification.isRead ? 'bg-gray-700/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.type === 'urgent' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">
                          {notification.ticketId}
                        </span>
                        {notification.type === 'urgent' && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            URGENT
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm truncate">
                        {notification.title}
                      </p>
                      
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-700 text-center">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/admin/tickets');
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm"
              >
                View All Tickets ({unreadCount} unread)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default TicketNotifications;