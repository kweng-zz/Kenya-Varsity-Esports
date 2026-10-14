'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { calculateOrderTotal } from '@/lib/pricing';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface CandidateEvent {
  id: string;
  title: string;
  game: string;
  slug: string;
  source: 'tournament' | 'external';
  date: string | null;
  status: string;
}

interface TicketTypeDoc {
  $id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  quantityTotal: number;
  quantitySold?: number;
  quantityReserved?: number;
  maxPerOrder?: number;
  minPerOrder?: number;
  sortOrder?: number;
  isActive?: boolean;
  salesStartDate?: string;
  salesEndDate?: string;
  benefits?: string[];
  color?: string;
  isFeatured?: boolean;
}

interface EventTicketConfig {
  $id: string;
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  isActive?: boolean;
  salesStartDate?: string;
  salesEndDate?: string;
  maxTicketsPerUser?: number;
  requiresApproval?: boolean;
  currency?: string;
  taxRate?: number;
  serviceFee?: number;
  serviceFeeType?: 'fixed' | 'percentage';
  description?: string;
  refundPolicy?: string;
  contactEmail?: string;
  totalSold?: number;
  totalRevenue?: number;
  ticketTypes: TicketTypeDoc[];
}

interface TypeDraft {
  key: string;
  $id?: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  quantityTotal: string;
  maxPerOrder: string;
  minPerOrder: string;
  benefits: string;
  color: string;
  isFeatured: boolean;
  isActive: boolean;
  salesStartDate: string;
  salesEndDate: string;
}

interface ConfigFields {
  currency: string;
  taxRate: string;
  serviceFee: string;
  serviceFeeType: 'fixed' | 'percentage';
  maxTicketsPerUser: string;
  requiresApproval: boolean;
  isActive: boolean;
  salesStartDate: string;
  salesEndDate: string;
  description: string;
  refundPolicy: string;
  contactEmail: string;
}

interface EditorState {
  event: CandidateEvent;
  configId?: string;
  fields: ConfigFields;
  types: TypeDraft[];
  removedIds: string[];
}

interface Purchase {
  purchaseId: string;
  confirmationCode: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  status: string;
  purchasedAt: string;
  userEmail: string;
  userName: string;
  ticketTypeName: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const DEFAULT_COLOR = '#8c110d';

const newTypeDraft = (): TypeDraft => ({
  key: `new-${Math.random().toString(36).slice(2)}`,
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  quantityTotal: '',
  maxPerOrder: '10',
  minPerOrder: '1',
  benefits: '',
  color: DEFAULT_COLOR,
  isFeatured: false,
  isActive: true,
  salesStartDate: '',
  salesEndDate: '',
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const isoToLocal = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatMoney = (amount: number, currency: string) =>
  `${currency} ${Math.round(amount).toLocaleString()}`;

const configToFields = (config?: EventTicketConfig): ConfigFields => ({
  currency: config?.currency || 'KES',
  taxRate: config?.taxRate?.toString() ?? '16',
  serviceFee: config?.serviceFee?.toString() ?? '0',
  serviceFeeType: config?.serviceFeeType || 'fixed',
  maxTicketsPerUser: config?.maxTicketsPerUser?.toString() ?? '5',
  requiresApproval: config?.requiresApproval ?? false,
  isActive: config?.isActive ?? true,
  salesStartDate: isoToLocal(config?.salesStartDate),
  salesEndDate: isoToLocal(config?.salesEndDate),
  description: config?.description || '',
  refundPolicy: config?.refundPolicy || '',
  contactEmail: config?.contactEmail || '',
});

const typeToDraft = (type: TicketTypeDoc): TypeDraft => ({
  key: type.$id,
  $id: type.$id,
  name: type.name || '',
  description: type.description || '',
  price: type.price?.toString() ?? '',
  originalPrice: type.originalPrice?.toString() ?? '',
  quantityTotal: type.quantityTotal?.toString() ?? '',
  maxPerOrder: type.maxPerOrder?.toString() ?? '10',
  minPerOrder: type.minPerOrder?.toString() ?? '1',
  benefits: Array.isArray(type.benefits) ? type.benefits.join('\n') : '',
  color: type.color || DEFAULT_COLOR,
  isFeatured: type.isFeatured ?? false,
  isActive: type.isActive ?? true,
  salesStartDate: isoToLocal(type.salesStartDate),
  salesEndDate: isoToLocal(type.salesEndDate),
});

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminEventTicketsPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<CandidateEvent[]>([]);
  const [configs, setConfigs] = useState<EventTicketConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'configured' | 'unconfigured'>('all');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [purchases, setPurchases] = useState<{ config: EventTicketConfig; items: Purchase[] } | null>(null);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventGame, setNewEventGame] = useState('');
  const [newEventSource, setNewEventSource] = useState<'tournament' | 'external'>('external');
  const [newEventDate, setNewEventDate] = useState<string>('');

  /* --------------------------- Data loading --------------------------- */

  const loadConfigs = useCallback(async () => {
    const res = await fetch('/api/admin/events/tickets', { cache: 'no-store' });
    const json = await res.json();
    if (json.success) setConfigs(json.data as EventTicketConfig[]);
    else throw new Error(json.error || 'Failed to load ticket configurations');
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventsRes, configsRes] = await Promise.all([
        fetch('/api/admin/events', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/admin/events/tickets', { cache: 'no-store' }).then((r) => r.json()),
      ]);
      if (eventsRes.success) setEvents(eventsRes.data as CandidateEvent[]);
      if (configsRes.success) setConfigs(configsRes.data as EventTicketConfig[]);
      if (!eventsRes.success && !configsRes.success) {
        throw new Error(eventsRes.error || configsRes.error || 'Failed to load data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!profile?.isAdmin) {
      router.push('/');
      return;
    }
    loadAll();
  }, [authLoading, profile, router, loadAll]);

  /* --------------------------- Event Creation -------------------------- */

  const handleCreateEvent = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const slug = newEventTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // First, create the actual event in the database
      let eventId: string;
      let eventTitle = newEventTitle;

      if (newEventSource === 'external') {
        // Create external event
        const eventRes = await fetch('/api/external-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newEventTitle,
            description: '',
            imageUrl: '/images/hero-bg.jpg',
            externalUrl: `https://kuer.esports.com/events/${slug}`,
            eventDate: newEventDate ? new Date(newEventDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            venue: '',
            prizePool: '',
            status: 'published',
            tags: ['esports', 'tournament'],
            isFeatured: false,
          }),
        });
        const eventJson = await eventRes.json();
        if (!eventJson.success) throw new Error(eventJson.error || 'Failed to create external event');
        eventId = eventJson.data.$id;
      } else {
        // Create tournament
        const eventRes = await fetch('/api/admin/tournaments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newEventTitle,
            gameName: newEventGame,
            slug: slug,
            startDate: newEventDate ? new Date(newEventDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'esports',
            format: 'Online',
            status: 'published',
            tournamentStatus: 'registration_open',
          }),
        });
        const eventJson = await eventRes.json();
        if (!eventJson.success) throw new Error(eventJson.error || 'Failed to create tournament');
        eventId = eventJson.data.$id || eventJson.data.id;
      }

      // Then create the ticket configuration linked to the event
      const ticketRes = await fetch('/api/admin/events/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: eventId,
          eventTitle: eventTitle,
          eventSlug: slug,
          source: newEventSource,
        }),
      });

      const ticketJson = await ticketRes.json();
      if (!ticketJson.success) throw new Error(ticketJson.error || 'Failed to create ticket configuration');

      setSuccess(`Event "${newEventTitle}" created with ticket configuration.`);
      setCreatingEvent(false);
      await loadAll();
      setEditor({
        event: {
          id: eventId,
          title: eventTitle,
          game: newEventGame || '',
          slug: slug,
          source: newEventSource,
          date: newEventDate || null,
          status: 'draft',
        },
        configId: ticketJson.data.$id,
        fields: configToFields(ticketJson.data),
        types: ticketJson.data.ticketTypes.map(typeToDraft).length > 0 
          ? ticketJson.data.ticketTypes.map(typeToDraft) 
          : [newTypeDraft()],
        removedIds: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------ Rows ------------------------------- */

  const configByEvent = useMemo(() => {
    const map = new Map<string, EventTicketConfig>();
    configs.forEach((c) => map.set(c.eventId, c));
    return map;
  }, [configs]);

  const rows = useMemo(() => {
    const merged = events.map((event) => ({ event, config: configByEvent.get(event.id) }));
    // Include configurations whose parent event no longer appears in the events list
    const knownIds = new Set(events.map((e) => e.id));
    const orphans = configs
      .filter((c) => !knownIds.has(c.eventId))
      .map((c) => ({
        event: {
          id: c.eventId,
          title: c.eventTitle || 'Unknown event',
          game: '',
          slug: c.eventSlug || '',
          source: 'external' as const,
          date: null,
          status: 'unknown',
        },
        config: c,
      }));

    const all = [...merged, ...orphans];
    const term = search.trim().toLowerCase();
    return all.filter(({ event, config }) => {
      if (filter === 'configured' && !config) return false;
      if (filter === 'unconfigured' && config) return false;
      if (!term) return true;
      return (
        event.title.toLowerCase().includes(term) ||
        event.game.toLowerCase().includes(term) ||
        event.slug.toLowerCase().includes(term)
      );
    });
  }, [events, configs, configByEvent, search, filter]);

  const stats = useMemo(() => {
    const configured = configs.length;
    const sold = configs.reduce((sum, c) => sum + (c.totalSold || 0), 0);
    const revenue = configs.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
    const currencies = Array.from(new Set(configs.map((c) => c.currency || 'KES')));
    return { configured, sold, revenue, currency: currencies[0] || 'KES', multiCurrency: currencies.length > 1 };
  }, [configs]);

  /* ----------------------------- Editor ------------------------------ */

  const openEditor = (event: CandidateEvent, config?: EventTicketConfig) => {
    setError(null);
    setSuccess(null);
    setEditor({
      event,
      configId: config?.$id,
      fields: configToFields(config),
      types:
        config && config.ticketTypes.length > 0
          ? config.ticketTypes.map(typeToDraft)
          : [newTypeDraft()],
      removedIds: [],
    });
  };

  // Deep link support: /admin/events/tickets?eventId=<id> opens the editor directly
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('eventId');
    if (id) setPendingEventId(id);
  }, []);

  useEffect(() => {
    if (!pendingEventId || loading || editor) return;
    const event = events.find((e) => e.id === pendingEventId);
    if (event) {
      openEditor(event, configByEvent.get(event.id));
      setPendingEventId(null);
    } else if (configs.length > 0 || events.length > 0) {
      // Event not found in the list — clear to avoid looping
      setPendingEventId(null);
    }
  }, [pendingEventId, loading, events, configs, configByEvent, editor]);

  const updateField = <K extends keyof ConfigFields>(key: K, value: ConfigFields[K]) => {
    setEditor((prev) => (prev ? { ...prev, fields: { ...prev.fields, [key]: value } } : prev));
  };

  const updateType = (key: string, patch: Partial<TypeDraft>) => {
    setEditor((prev) =>
      prev ? { ...prev, types: prev.types.map((t) => (t.key === key ? { ...t, ...patch } : t)) } : prev
    );
  };

  const addType = () => {
    setEditor((prev) => (prev ? { ...prev, types: [...prev.types, newTypeDraft()] } : prev));
  };

  const removeType = (key: string) => {
    setEditor((prev) => {
      if (!prev) return prev;
      const target = prev.types.find((t) => t.key === key);
      const removedIds = target?.$id ? [...prev.removedIds, target.$id] : prev.removedIds;
      return { ...prev, types: prev.types.filter((t) => t.key !== key), removedIds };
    });
  };

  const handleSave = async () => {
    if (!editor) return;

    if (editor.types.some((t) => !t.name.trim())) {
      setError('Every ticket type needs a name.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        isActive: editor.fields.isActive,
        requiresApproval: editor.fields.requiresApproval,
        currency: editor.fields.currency,
        taxRate: Number(editor.fields.taxRate) || 0,
        serviceFee: Number(editor.fields.serviceFee) || 0,
        serviceFeeType: editor.fields.serviceFeeType,
        maxTicketsPerUser: parseInt(editor.fields.maxTicketsPerUser, 10) || 5,
        description: editor.fields.description,
        refundPolicy: editor.fields.refundPolicy,
        contactEmail: editor.fields.contactEmail,
        salesStartDate: editor.fields.salesStartDate || null,
        salesEndDate: editor.fields.salesEndDate || null,
      };

      const jsonHeaders = { 'Content-Type': 'application/json' };
      let configId = editor.configId;

      if (!configId) {
        const res = await fetch('/api/admin/events/tickets', {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({
            eventId: editor.event.id,
            eventTitle: editor.event.title,
            eventSlug: editor.event.slug || slugify(editor.event.title),
            ...payload,
            ticketTypes: [],
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to create configuration');
        configId = json.data.$id as string;
      } else {
        const res = await fetch(`/api/admin/events/tickets/${configId}`, {
          method: 'PUT',
          headers: jsonHeaders,
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to update configuration');
      }

      // Upsert ticket types
      for (let i = 0; i < editor.types.length; i++) {
        const t = editor.types[i];
        const typePayload = {
          name: t.name.trim(),
          description: t.description,
          price: Number(t.price) || 0,
          originalPrice: t.originalPrice === '' ? undefined : Number(t.originalPrice),
          quantityTotal: parseInt(t.quantityTotal, 10) || 0,
          maxPerOrder: parseInt(t.maxPerOrder, 10) || 10,
          minPerOrder: parseInt(t.minPerOrder, 10) || 1,
          sortOrder: i,
          isActive: t.isActive,
          isFeatured: t.isFeatured,
          benefits: t.benefits.split('\n').map((b) => b.trim()).filter(Boolean),
          color: t.color,
          salesStartDate: t.salesStartDate || null,
          salesEndDate: t.salesEndDate || null,
        };

        const res = await fetch(
          t.$id
            ? `/api/admin/events/tickets/${configId}/types/${t.$id}`
            : `/api/admin/events/tickets/${configId}/types`,
          {
            method: t.$id ? 'PUT' : 'POST',
            headers: jsonHeaders,
            body: JSON.stringify(typePayload),
          }
        );
        const json = await res.json();
        if (!json.success) throw new Error(json.error || `Failed to save ticket type "${t.name}"`);
      }

      // Delete removed ticket types
      for (const removedId of editor.removedIds) {
        await fetch(`/api/admin/events/tickets/${configId}/types/${removedId}`, { method: 'DELETE' });
      }

      setSuccess(`Ticket configuration for "${editor.event.title}" saved.`);
      setEditor(null);
      await loadConfigs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ticket configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfig = async (config: EventTicketConfig) => {
    if (!confirm(`Delete the ticket configuration for "${config.eventTitle}"? This cannot be undone.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/events/tickets/${config.$id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to delete configuration');
      setSuccess(`Deleted ticket configuration for "${config.eventTitle}".`);
      await loadConfigs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete configuration');
    }
  };

  const openPurchases = async (config: EventTicketConfig) => {
    setLoadingPurchases(true);
    setPurchases({ config, items: [] });
    try {
      const res = await fetch(
        `/api/admin/events/tickets/purchases?eventId=${config.$id}&limit=50`,
        { cache: 'no-store' }
      );
      const json = await res.json();
      if (json.success) setPurchases({ config, items: json.data as Purchase[] });
      else setError(json.error || 'Failed to load purchases');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load purchases');
    } finally {
      setLoadingPurchases(false);
    }
  };

  /* ----------------------------- Render ------------------------------ */

  if (authLoading || (!profile?.isAdmin && !error)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c110d]" />
      </div>
    );
  }

  if (!profile?.isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-gray-400">You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Event Ticket Management</h1>
            <p className="text-gray-400">
              Create ticket tiers and set prices per event or game. Configure fees, availability and sales windows.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadAll}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold"
            >
              Refresh
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
            >
              Back to Admin
            </button>
          </div>
        </div>

        {/* Event Creation Form */}
        {creatingEvent && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">Create New Event</h2>
                <p className="text-gray-400">
                  Create an event that will appear on the event page and set up ticket prices.
                </p>
              </div>
              <button onClick={() => setCreatingEvent(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newEventTitle.trim()) {
                  setError('Event title is required');
                  return;
                }
                handleCreateEvent();
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  placeholder="e.g., Summer Championship 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Game / Sport</label>
                  <input
                    type="text"
                    value={newEventGame}
                    onChange={(e) => setNewEventGame(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                    placeholder="e.g., Football, Chess, Basketball"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Source Type</label>
                  <select
                    value={newEventSource}
                    onChange={(e) => setNewEventSource(e.target.value as 'tournament' | 'external')}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  >
                    <option value="tournament">Tournament</option>
                    <option value="external">External Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event Date (optional)</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#8c110d] hover:bg-[#7a0f0b] disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold text-white"
                  disabled={saving}
                >
                  {saving ? 'Creating…' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setCreatingEvent(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="bg-red-900/60 border border-red-700 text-red-100 px-4 py-3 rounded mb-6 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-white">✕</button>
          </div>
        )}
        {success && (
          <div className="bg-green-900/60 border border-green-700 text-green-100 px-4 py-3 rounded mb-6 flex justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-300 hover:text-white">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-[#e06c67]">{events.length}</div>
            <div className="text-sm text-gray-400">Total Events</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{stats.configured}</div>
            <div className="text-sm text-gray-400">With Tickets</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{stats.sold}</div>
            <div className="text-sm text-gray-400">Tickets Sold</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {formatMoney(stats.revenue, stats.currency)}
            </div>
            <div className="text-sm text-gray-400">Revenue{stats.multiCurrency ? ' (mixed currencies)' : ''}</div>
          </div>
        </div>

        {/* Editor */}
        {editor && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {editor.configId ? 'Edit' : 'Configure'} Tickets
                </h2>
                <p className="text-gray-400">
                  {editor.event.title}
                  {editor.event.game ? ` · ${editor.event.game}` : ''}
                  {editor.event.source === 'tournament' ? ' · Tournament' : ' · External event'}
                </p>
              </div>
              <button onClick={() => setEditor(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            {/* Config fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={editor.fields.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                >
                  <option value="KES">KES (Kenyan Shilling)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="NGN">NGN (Nigerian Naira)</option>
                  <option value="GHS">GHS (Ghanaian Cedi)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tax / VAT Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editor.fields.taxRate}
                  onChange={(e) => updateField('taxRate', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  placeholder="e.g., 16"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Tickets Per User</label>
                <input
                  type="number"
                  value={editor.fields.maxTicketsPerUser}
                  onChange={(e) => updateField('maxTicketsPerUser', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service Fee</label>
                <input
                  type="number"
                  step="0.01"
                  value={editor.fields.serviceFee}
                  onChange={(e) => updateField('serviceFee', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service Fee Type</label>
                <select
                  value={editor.fields.serviceFeeType}
                  onChange={(e) => updateField('serviceFeeType', e.target.value as 'fixed' | 'percentage')}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                >
                  <option value="fixed">Fixed amount per ticket</option>
                  <option value="percentage">Percentage of subtotal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Support Email</label>
                <input
                  type="email"
                  value={editor.fields.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                  placeholder="tickets@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sales Open</label>
                <input
                  type="datetime-local"
                  value={editor.fields.salesStartDate}
                  onChange={(e) => updateField('salesStartDate', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sales Close</label>
                <input
                  type="datetime-local"
                  value={editor.fields.salesEndDate}
                  onChange={(e) => updateField('salesEndDate', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                />
              </div>
              <div className="flex items-end gap-6 pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editor.fields.isActive}
                    onChange={(e) => updateField('isActive', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700"
                  />
                  <span className="text-sm">Ticket sales active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editor.fields.requiresApproval}
                    onChange={(e) => updateField('requiresApproval', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700"
                  />
                  <span className="text-sm">Requires approval</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Description / Terms</label>
                <textarea
                  value={editor.fields.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-20"
                  placeholder="Shown to buyers on the ticket page"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Refund Policy</label>
                <textarea
                  value={editor.fields.refundPolicy}
                  onChange={(e) => updateField('refundPolicy', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 h-20"
                  placeholder="e.g., Refunds up to 7 days before the event"
                />
              </div>
            </div>

            {/* Ticket types */}
            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ticket Types &amp; Prices</h3>
                <button
                  onClick={addType}
                  className="text-sm bg-[#8c110d] hover:bg-[#7a0f0b] px-3 py-1.5 rounded font-medium"
                >
                  + Add Ticket Type
                </button>
              </div>

              <div className="space-y-4">
                {editor.types.map((t, index) => {
                  const breakdown = calculateOrderTotal({
                    price: Number(t.price) || 0,
                    originalPrice: Number(t.originalPrice) || Number(t.price) || 0,
                    quantity: 1,
                    taxRate: Number(editor.fields.taxRate) || 0,
                    serviceFee: Number(editor.fields.serviceFee) || 0,
                    serviceFeeType: editor.fields.serviceFeeType,
                    currency: editor.fields.currency,
                  });

                  return (
                    <div key={t.key} className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Ticket Type #{index + 1}</h4>
                        {editor.types.length > 1 && (
                          <button
                            onClick={() => removeType(t.key)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Name *</label>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => updateType(t.key, { name: e.target.value })}
                            placeholder="e.g., Standard, VIP, Early Bird"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Color</label>
                          <input
                            type="color"
                            value={t.color}
                            onChange={(e) => updateType(t.key, { color: e.target.value })}
                            className="w-full h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Price *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={t.price}
                            onChange={(e) => updateType(t.key, { price: e.target.value })}
                            placeholder="e.g., 200"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Original Price</label>
                          <input
                            type="number"
                            step="0.01"
                            value={t.originalPrice}
                            onChange={(e) => updateType(t.key, { originalPrice: e.target.value })}
                            placeholder="For showing a discount"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Total Quantity</label>
                          <input
                            type="number"
                            value={t.quantityTotal}
                            onChange={(e) => updateType(t.key, { quantityTotal: e.target.value })}
                            placeholder="e.g., 100"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Max Per Order</label>
                          <input
                            type="number"
                            value={t.maxPerOrder}
                            onChange={(e) => updateType(t.key, { maxPerOrder: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Min Per Order</label>
                          <input
                            type="number"
                            value={t.minPerOrder}
                            onChange={(e) => updateType(t.key, { minPerOrder: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Sales Open</label>
                          <input
                            type="datetime-local"
                            value={t.salesStartDate}
                            onChange={(e) => updateType(t.key, { salesStartDate: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Sales Close</label>
                          <input
                            type="datetime-local"
                            value={t.salesEndDate}
                            onChange={(e) => updateType(t.key, { salesEndDate: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Benefits (one per line)</label>
                        <textarea
                          value={t.benefits}
                          onChange={(e) => updateType(t.key, { benefits: e.target.value })}
                          rows={3}
                          placeholder={'Event entry\nLive streaming access\nDiscord access'}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <input
                          type="text"
                          value={t.description}
                          onChange={(e) => updateType(t.key, { description: e.target.value })}
                          placeholder="Brief description of this ticket type"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={t.isActive}
                            onChange={(e) => updateType(t.key, { isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                          />
                          <span className="text-sm">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={t.isFeatured}
                            onChange={(e) => updateType(t.key, { isFeatured: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                          />
                          <span className="text-sm">Featured</span>
                        </label>
                        {t.$id && (
                          <span className="text-xs text-gray-500">
                            Sold: {configs
                              .find((c) => c.$id === editor.configId)
                              ?.ticketTypes.find((tt) => tt.$id === t.$id)?.quantitySold ?? 0}
                          </span>
                        )}
                      </div>

                      {/* Price preview */}
                      {Number(t.price) > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="bg-gray-900/60 p-2 rounded">
                            <div className="text-gray-400">Base</div>
                            <div className="font-semibold">{formatMoney(breakdown.subtotal, editor.fields.currency)}</div>
                          </div>
                          <div className="bg-gray-900/60 p-2 rounded">
                            <div className="text-gray-400">+ Tax ({editor.fields.taxRate}%)</div>
                            <div className="font-semibold">{formatMoney(breakdown.taxAmount, editor.fields.currency)}</div>
                          </div>
                          <div className="bg-gray-900/60 p-2 rounded">
                            <div className="text-gray-400">+ Service fee</div>
                            <div className="font-semibold">{formatMoney(breakdown.serviceFee, editor.fields.currency)}</div>
                          </div>
                          <div className="bg-[#8c110d]/20 border border-[#8c110d] p-2 rounded">
                            <div className="text-gray-300">Buyer pays</div>
                            <div className="font-bold">{formatMoney(breakdown.totalAmount, editor.fields.currency)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#8c110d] hover:bg-[#7a0f0b] disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold"
              >
                {saving ? 'Saving…' : 'Save Ticket Configuration'}
              </button>
              <button
                onClick={() => setEditor(null)}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, game or slug…"
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
          >
            <option value="all">All events</option>
            <option value="configured">With tickets</option>
            <option value="unconfigured">Without tickets</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tickets</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading events…</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No events match your filters.</td>
                  </tr>
                ) : (
                  rows.map(({ event, config }) => {
                    const currency = config?.currency || 'KES';
                    const prices = (config?.ticketTypes || [])
                      .map((t) => t.price)
                      .filter((p) => typeof p === 'number');
                    const from = prices.length ? Math.min(...prices) : null;
                    return (
                      <tr key={`${event.source}-${event.id}`} className="hover:bg-gray-800">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{event.title}</div>
                          <div className="text-xs text-gray-500">
                            {event.game ? `${event.game} · ` : ''}
                            {event.slug ? `/${event.slug}` : event.source === 'external' ? 'External event' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 capitalize">{event.source}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {config ? `${config.ticketTypes.length} type${config.ticketTypes.length === 1 ? '' : 's'}` : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {from !== null ? formatMoney(from, currency) : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{config?.totalSold ?? '—'}</td>
                        <td className="px-6 py-4">
                          {config ? (
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                config.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                              }`}
                            >
                              {config.isActive ? 'Active' : 'Inactive'}
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900 text-yellow-300">
                              Not configured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => openEditor(event, config)}
                            className="text-[#e06c67] hover:text-white"
                          >
                            {config ? 'Edit Tickets' : 'Set Prices'}
                          </button>
                          {config && (
                            <>
                              <button
                                onClick={() => openPurchases(config)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                Purchases
                              </button>
                              <button
                                onClick={() => handleDeleteConfig(config)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Purchases modal */}
      {purchases && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
              <div>
                <h2 className="text-xl font-bold">Purchases</h2>
                <p className="text-sm text-gray-400">{purchases.config.eventTitle}</p>
              </div>
              <button onClick={() => setPurchases(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6">
              {loadingPurchases ? (
                <p className="text-gray-400">Loading purchases…</p>
              ) : purchases.items.length === 0 ? (
                <p className="text-gray-400">No purchases yet for this event.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                      <th className="py-2">Confirmation</th>
                      <th className="py-2">Buyer</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Qty</th>
                      <th className="py-2">Total</th>
                      <th className="py-2">Payment</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.items.map((p) => (
                      <tr key={p.purchaseId} className="border-b border-gray-800/60">
                        <td className="py-2 font-mono text-xs">{p.confirmationCode}</td>
                        <td className="py-2">
                          <div>{p.userName || '—'}</div>
                          <div className="text-xs text-gray-500">{p.userEmail}</div>
                        </td>
                        <td className="py-2">{p.ticketTypeName}</td>
                        <td className="py-2">{p.quantity}</td>
                        <td className="py-2">{formatMoney(p.totalAmount, p.currency || purchases.config.currency || 'KES')}</td>
                        <td className="py-2 capitalize">{p.paymentStatus}</td>
                        <td className="py-2 capitalize">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
