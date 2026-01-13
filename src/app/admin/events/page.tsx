'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Event {
  $id: string;
  title: string;
  gameSlug: string;
  image: string;
  date: string;
  time: string;
  prizePool: string;
  entryFee: string;
  status: 'OPEN' | 'LEAGUE' | 'PRO';
  tags: string[];
  registrationLink?: string;
  detailsLink?: string;
  isActive: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    gameSlug: '',
    image: '',
    date: '',
    time: '',
    prizePool: '',
    entryFee: '',
    status: 'OPEN' as 'OPEN' | 'LEAGUE' | 'PRO',
    tags: '',
    registrationLink: '',
    detailsLink: '',
    isActive: true
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/events');
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent.$id}` : '/api/admin/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();
      if (data.success) {
        await loadEvents();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      gameSlug: event.gameSlug,
      image: event.image,
      date: event.date,
      time: event.time,
      prizePool: event.prizePool,
      entryFee: event.entryFee,
      status: event.status,
      tags: event.tags.join(', '),
      registrationLink: event.registrationLink || '',
      detailsLink: event.detailsLink || '',
      isActive: event.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await loadEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      gameSlug: '',
      image: '',
      date: '',
      time: '',
      prizePool: '',
      entryFee: '',
      status: 'OPEN',
      tags: '',
      registrationLink: '',
      detailsLink: '',
      isActive: true
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Manage Events</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#E73138] hover:bg-[#c42127]">
          {showForm ? 'Cancel' : 'Add New Event'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-[#1A1A1A] p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-[#0F0F0F] border-gray-700 text-white"
              />
              <Input
                placeholder="Game Slug (e.g., valorant)"
                value={formData.gameSlug}
                onChange={(e) => setFormData({ ...formData, gameSlug: e.target.value })}
                required
                className="bg-[#0F0F0F] border-gray-700 text-white"
              />
              <Input
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
                className="bg-[#0F0F0F] border-gray-700 text-white"
              />
              <Input
                placeholder="Date (e.g., JANUARY 20, 2026)"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="bg-[#0F0F0F] border-gray-700 text-white"
              />
              <Input
                placeholder="Time (e.g., 18:00)"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="bg-[#0F0F0F] border-gray-700 text-white"
              />
              <Input
                placeholder="Prize Pool"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                required
                className="bg-[#0F0F0F] border-gray-700 text-white"
              />
              <Input
                placeholder="Entry Fee"
                value={formData.entryFee}
                onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                required
                className="bg-[#0F0F0F] border-gray-700 text-white"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="bg-[#0F0F0F] border border-gray-700 text-white rounded px-3 py-2"
              >
                <option value="OPEN">OPEN</option>
                <option value="LEAGUE">LEAGUE</option>
                <option value="PRO">PRO</option>
              </select>
              <Input
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="bg-[#0F0F0F] border-gray-700 text-white"
              />
              <Input
                placeholder="Registration Link (optional)"
                value={formData.registrationLink}
                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                className="bg-[#0F0F0F] border-gray-700 text-white"
              />
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-[#E73138] hover:bg-[#c42127]">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
              <Button type="button" onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0F0F0F]">
            <tr>
              <th className="text-left p-4 text-white">Title</th>
              <th className="text-left p-4 text-white">Date</th>
              <th className="text-left p-4 text-white">Status</th>
              <th className="text-left p-4 text-white">Active</th>
              <th className="text-right p-4 text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-400">
                  Loading events...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-400">
                  No events found. Create your first event!
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.$id} className="border-t border-gray-800 hover:bg-[#252525]">
                  <td className="p-4 text-white">{event.title}</td>
                  <td className="p-4 text-white">{event.date}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-[#E73138] text-white text-xs rounded">
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4 text-white">
                    {event.isActive ? '✓' : '✗'}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      onClick={() => handleEdit(event)}
                      size="sm"
                      variant="outline"
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.$id)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
