import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, Permission, Role } from 'node-appwrite';

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

function buildTypeData(body: any) {
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) data.name = toStr(body.name);
  if (body.description !== undefined) data.description = toStr(body.description);
  if (body.price !== undefined) data.price = toNumber(body.price);
  if (body.originalPrice !== undefined && body.originalPrice !== '') data.originalPrice = toNumber(body.originalPrice);
  if (body.quantityTotal !== undefined) data.quantityTotal = toInt(body.quantityTotal);
  if (body.maxPerOrder !== undefined) data.maxPerOrder = toInt(body.maxPerOrder);
  if (body.minPerOrder !== undefined) data.minPerOrder = toInt(body.minPerOrder);
  if (body.sortOrder !== undefined) data.sortOrder = toInt(body.sortOrder);
  if (body.isActive !== undefined) data.isActive = toBool(body.isActive);
  if (body.benefits !== undefined) {
    data.benefits = Array.isArray(body.benefits)
      ? body.benefits.map((b: unknown) => String(b)).filter(Boolean)
      : typeof body.benefits === 'string'
      ? body.benefits.split('\n').map((b: string) => b.trim()).filter(Boolean)
      : [];
  }
  if (body.color !== undefined) data.color = toStr(body.color);
  if (body.isFeatured !== undefined) data.isFeatured = toBool(body.isFeatured);
  if ('salesStartDate' in body) data.salesStartDate = toISOOrNull(body.salesStartDate);
  if ('salesEndDate' in body) data.salesEndDate = toISOOrNull(body.salesEndDate);

  return data;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; typeId: string }> }
) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
    }

    const { typeId } = await params;
    const body = await request.json();

    const typeData = buildTypeData(body);

    try {
      const doc = await db.updateDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, typeId, typeData);
      return NextResponse.json({ success: true, data: doc });
    } catch (error: any) {
      if (error?.code === 404) {
        return NextResponse.json({ success: false, error: 'Ticket type not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Admin ticket type update error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update ticket type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; typeId: string }> }
) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
    }

    const { typeId } = await params;

    try {
      await db.deleteDocument(DB_ID, EVENT_TICKET_TYPES_COLLECTION, typeId);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      if (error?.code === 404) {
        return NextResponse.json({ success: false, error: 'Ticket type not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Admin ticket type delete error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete ticket type' },
      { status: 500 }
    );
  }
}