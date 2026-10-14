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
const EVENT_TICKETS_COLLECTION = 'event_tickets';

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

function buildConfigData(body: any) {
  const data: Record<string, unknown> = {};

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
  if ('salesStartDate' in body) data.salesStartDate = toISOOrNull(body.salesStartDate);
  if ('salesEndDate' in body) data.salesEndDate = toISOOrNull(body.salesEndDate);

  return data;
}

export async function PUT(
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

    const configData = buildConfigData(body);

    try {
      const config = await db.updateDocument(DB_ID, EVENT_TICKETS_COLLECTION, id, configData);
      return NextResponse.json({ success: true, data: config });
    } catch (error: any) {
      if (error?.code === 404) {
        return NextResponse.json({ success: false, error: 'Ticket configuration not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Admin event tickets update error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update ticket configuration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = initializeAppwrite();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
    }

    const { id } = await params;

    try {
      await db.deleteDocument(DB_ID, EVENT_TICKETS_COLLECTION, id);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      if (error?.code === 404) {
        return NextResponse.json({ success: false, error: 'Ticket configuration not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Admin event tickets delete error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete ticket configuration' },
      { status: 500 }
    );
  }
}