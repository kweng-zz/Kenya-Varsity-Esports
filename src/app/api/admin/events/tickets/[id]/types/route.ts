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
const EVENT_TICKET_TYPES_COLLECTION = 'event_ticket_types';

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
    }

    const { id } = await params;
    const body = await request.json();

    // Get current ticket types to determine sortOrder
    const existing = await db.listDocuments(DB_ID, EVENT_TICKET_TYPES_COLLECTION, [
      Query.equal('eventTicketId', id),
      Query.orderDesc('sortOrder'),
      Query.limit(1),
    ]);
    const nextSortOrder = existing.documents.length > 0 ? (existing.documents[0].sortOrder ?? 0) + 1 : 0;

    const typeData = buildTypeData(body, id, nextSortOrder);
    const doc = await db.createDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, ID.unique(), typeData, TICKET_PERMISSIONS);

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error: any) {
    console.error('Admin ticket type create error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create ticket type' },
      { status: 500 }
    );
  }
}