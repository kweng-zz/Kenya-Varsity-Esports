import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID, Permission, Role } from 'node-appwrite';

const initializeAppwrite = () => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!endpoint || !projectId || !apiKey) return null;
  try {
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    return new Databases(client);
  } catch {
    return null;
  }
};

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const EVENT_TICKETS_COLLECTION = 'event_tickets';
const EVENT_TICKET_TYPES_COLLECTION = 'event_ticket_types';

// Use Role.any() for read, Role.users() and Role.team('admins') for write
const TICKET_PERMISSIONS = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.create(Role.team('admins')),
  Permission.update(Role.users()),
  Permission.update(Role.team('admins')),
  Permission.delete(Role.users()),
  Permission.delete(Role.team('admins')),
];

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toInt(value: unknown, fallback = 0): number {
  const n = parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
}

function toBool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function toStr(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toISOOrNull(value: unknown): string | null {
  if (!value || typeof value !== 'string') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function buildConfigData(body: any, { forCreate }: { forCreate: boolean }) {
  const data: Record<string, unknown> = {};

  if (body.eventId !== undefined) data.eventId = toStr(body.eventId);
  if (body.eventTitle !== undefined) data.eventTitle = toStr(body.eventTitle);
  if (body.eventSlug !== undefined) data.eventSlug = toStr(body.eventSlug);

  if (body.isActive !== undefined) data.isActive = toBool(body.isActive, true);
  if (body.requiresApproval !== undefined) data.requiresApproval = toBool(body.requiresApproval);
  if (body.currency !== undefined) data.currency = toStr(body.currency, 'KES');
  if (body.taxRate !== undefined) data.taxRate = toNumber(body.taxRate);
  if (body.serviceFee !== undefined) data.serviceFee = toNumber(body.serviceFee);
  if (body.serviceFeeType !== undefined) {
    data.serviceFeeType = body.serviceFeeType === 'percentage' ? 'percentage' : 'fixed';
  }
  if (body.maxTicketsPerUser !== undefined) data.maxTicketsPerUser = toInt(body.maxTicketsPerUser, 5);
  if (body.description !== undefined) data.description = toStr(body.description);
  if (body.refundPolicy !== undefined) data.refundPolicy = toStr(body.refundPolicy);
  if (body.contactEmail !== undefined) data.contactEmail = toStr(body.contactEmail);

  if (forCreate && body.salesStartDate !== undefined) data.salesStartDate = toISOOrNull(body.salesStartDate);
  if (forCreate && body.salesEndDate !== undefined) data.salesEndDate = toISOOrNull(body.salesEndDate);
  if (!forCreate && 'salesStartDate' in body) data.salesStartDate = toISOOrNull(body.salesStartDate);
  if (!forCreate && 'salesEndDate' in body) data.salesEndDate = toISOOrNull(body.salesEndDate);

  if (forCreate) {
    data.totalSold = 0;
    data.totalRevenue = 0;
  }

  return data;
}

function buildTypeData(body: any, eventTicketId: string, index: number) {
  const benefits = Array.isArray(body.benefits)
    ? body.benefits.map((b: unknown) => String(b)).filter(Boolean)
    : typeof body.benefits === 'string'
    ? body.benefits.split('\n').map((b: string) => b.trim()).filter(Boolean)
    : [];

  const price = toNumber(body.price);

  return {
    eventTicketId,
    name: toStr(body.name, 'Untitled'),
    description: toStr(body.description),
    price,
    originalPrice: body.originalPrice !== undefined && body.originalPrice !== '' ? toNumber(body.originalPrice) : price,
    quantityTotal: toInt(body.quantityTotal, 0),
    maxPerOrder: toInt(body.maxPerOrder, 10),
    minPerOrder: toInt(body.minPerOrder, 1),
    sortOrder: body.sortOrder !== undefined ? toInt(body.sortOrder, index) : index,
    isActive: toBool(body.isActive, true),
    benefits,
    color: toStr(body.color, '#8c110d'),
    isFeatured: toBool(body.isFeatured),
    ...(body.salesStartDate !== undefined ? { salesStartDate: toISOOrNull(body.salesStartDate) } : {}),
    ...(body.salesEndDate !== undefined ? { salesEndDate: toISOOrNull(body.salesEndDate) } : {}),
  };
}

async function loadTicketTypes(db: Databases, eventTicketId: string) {
  try {
    const res = await db.listDocuments(DB_ID, EVENT_TICKET_TYPES_COLLECTION, [
      Query.equal('eventTicketId', eventTicketId),
      Query.orderAsc('sortOrder'),
      Query.limit(100),
    ]);
    return res.documents;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
    }

    const response = await db.listDocuments(DB_ID, EVENT_TICKETS_COLLECTION, [
      Query.orderDesc('$createdAt'),
      Query.limit(200),
    ]);

    const data = await Promise.all(
      response.documents.map(async (config: any) => ({
        ...config,
        ticketTypes: await loadTicketTypes(db, config.$id),
      }))
    );

    return NextResponse.json({ success: true, data, total: response.total });
  } catch (error) {
    console.error('Admin event tickets list error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch ticket configurations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();

    if (!body.eventId || !body.eventTitle) {
      return NextResponse.json(
        { success: false, error: 'eventId and eventTitle are required' },
        { status: 400 }
      );
    }

    const configData = buildConfigData(body, { forCreate: true }) as Record<string, any>;
    if (!configData.eventSlug) {
      configData.eventSlug = String(configData.eventTitle)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    let config: any;
    try {
      config = await db.createDocument(DB_ID, EVENT_TICKETS_COLLECTION, ID.unique(), configData, TICKET_PERMISSIONS);
    } catch (error: any) {
      if (error?.code === 409) {
        return NextResponse.json(
          { success: false, error: 'This event already has a ticket configuration' },
          { status: 409 }
        );
      }
      throw error;
    }

    const ticketTypes: any[] = Array.isArray(body.ticketTypes) ? body.ticketTypes : [];
    const createdTypes: any[] = [];
    for (let i = 0; i < ticketTypes.length; i++) {
      const typeData = buildTypeData(ticketTypes[i], config.$id, i);
      const doc = await db.createDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, ID.unique(), typeData, TICKET_PERMISSIONS);
      createdTypes.push(doc);
    }

    return NextResponse.json({ success: true, data: { ...config, ticketTypes: createdTypes } }, { status: 201 });
  } catch (error: any) {
    console.error('Admin event tickets create error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create ticket configuration' },
      { status: 500 }
    );
  }
}