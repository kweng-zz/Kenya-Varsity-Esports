'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default function AdminContactMessages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filter !== 'all') {
                params.append('status', filter);
            }
            
            const response = await fetch(`/api/contact?${params.toString()}`);
            const result = await response.json();
            
            if (result.success) {
                setMessages(result.data);
            } else {
                console.error('Failed to fetch messages:', result.error);
                // For demo purposes, use sample data
                setMessages([
                    {
                        id: '1',
                        name: 'John Doe',
                        email: 'john@example.com',
                        message: 'We are interested in sponsoring your esports tournaments. Please contact us to discuss partnership opportunities.',
                        type: 'partnership',
                        status: 'unread',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: '2',
                        name: 'Jane Smith',
                        email: 'jane@press.com',
                        message: 'I am a journalist writing about university esports in Kenya. Would love to interview someone from your team.',
                        type: 'press',
                        status: 'read',
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                        updatedAt: new Date(Date.now() - 86400000).toISOString()
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Fallback to sample data
            setMessages([
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    message: 'We are interested in sponsoring your esports tournaments. Please contact us to discuss partnership opportunities.',
                    type: 'partnership',
                    status: 'unread',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (messageId: string) => {
        try {
            // In a real implementation, you would update the message status via API
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, status: 'read', updatedAt: new Date().toISOString() }
                        : msg
                )
            );
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const deleteMessage = async (messageId: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            try {
                // In a real implementation, you would delete via API
                setMessages(prev => prev.filter(msg => msg.id !== messageId));
                if (selectedMessage?.id === messageId) {
                    setSelectedMessage(null);
                }
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'partnership':
                return 'bg-blue-100 text-blue-800';
            case 'press':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'unread' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-gray-100 text-gray-800';
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'all') return true;
        return msg.status === filter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                    <p className="text-gray-600 mt-2">Manage contact form submissions and inquiries</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className={filter === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        All ({messages.length})
                    </Button>
                    <Button
                        variant={filter === 'unread' ? 'default' : 'outline'}
                        onClick={() => setFilter('unread')}
                        className={filter === 'unread' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        Unread ({messages.filter(m => m.status === 'unread').length})
                    </Button>
                    <Button
                        variant={filter === 'read' ? 'default' : 'outline'}
                        onClick={() => setFilter('read')}
                        className={filter === 'read' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        Read ({messages.filter(m => m.status === 'read').length})
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Messages List */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Messages ({filteredMessages.length})</h2>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {filteredMessages.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No messages found
                            </div>
                        ) : (
                            filteredMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                        selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                                    onClick={() => setSelectedMessage(message)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{message.name}</h3>
                                            <p className="text-sm text-gray-600">{message.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
                                                {message.type}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                                                {message.status}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                        {message.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(message.createdAt).toLocaleDateString()} at{' '}
                                        {new Date(message.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Message Details</h2>
                    </div>
                    {selectedMessage ? (
                        <div className="p-4">
                            <div className="mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {selectedMessage.name}
                                        </h3>
                                        <p className="text-gray-600">{selectedMessage.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedMessage.type)}`}>
                                            {selectedMessage.type}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                                            {selectedMessage.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <p className="text-gray-800 whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                <div className="text-sm text-gray-500 mb-4">
                                    <p>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                    {selectedMessage.updatedAt !== selectedMessage.createdAt && (
                                        <p>Updated: {new Date(selectedMessage.updatedAt).toLocaleString()}</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {selectedMessage.status === 'unread' && (
                                        <Button
                                            onClick={() => markAsRead(selectedMessage.id)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Mark as Read
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: Your inquiry&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for your message.%0D%0A%0D%0ABest regards,%0D%0AKUER Team`)}
                                    >
                                        Reply via Email
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            Select a message to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}