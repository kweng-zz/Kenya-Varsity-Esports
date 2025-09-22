'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminPage() {
  const { user, profile, loading, signOut } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading admin panel...
      </div>
    );
  }

  // Unauthorized access
  if (!profile?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
        <button
          onClick={signOut}
          className="px-4 py-2 rounded bg-red-700 hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Control Panel</h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-300">{profile.fullname}</span>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded bg-red-700 hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example cards for different sections */}
        <Link
          href="/admin/statistics"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Statistics</h2>
          <p>Edit season statistics displayed on the homepage.</p>
        </Link>

        <Link
          href="/admin/banners"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Hero Banners</h2>
          <p>Manage homepage hero banners and call-to-action buttons.</p>
        </Link>

        <Link
          href="/admin/highlights"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Highlights</h2>
          <p>Manage homepage highlights and featured content.</p>
        </Link>

        <Link
          href="/admin/tournaments"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Tournaments</h2>
          <p>Create and manage tournaments, prizes, and schedules.</p>
        </Link>

        <Link
          href="/admin/participants"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Participants</h2>
          <p>Manage tournament participants, approvals, and registrations.</p>
        </Link>

        <Link
          href="/admin/registrations"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Registration Management</h2>
          <p>Review and approve tournament registration requests.</p>
        </Link>

        <Link
          href="/admin/team-captains-manager"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Team Captains Manager</h2>
          <p>Add, edit, and manage authorized team captains who can register for tournaments.</p>
        </Link>

        <Link
          href="/admin/blogs"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Blog Management</h2>
          <p>Create, edit, and manage blog posts and articles.</p>
        </Link>

        <Link
          href="/admin/calendar"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Calendar Management</h2>
          <p>Manage tournament dates, registration deadlines, and events.</p>
        </Link>

        <Link
          href="/admin/users"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Users</h2>
          <p>Manage platform users, roles, and permissions.</p>
        </Link>

        <Link
          href="/admin/universities"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Universities</h2>
          <p>Manage university WhatsApp groups and community links.</p>
        </Link>

        <Link
          href="/admin/tickets"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <h2 className="text-2xl font-semibold">Support Tickets</h2>
          <p>Manage and respond to user support tickets quickly.</p>
        </Link>
      </section>
    </div>
  );
}
