import { NextResponse } from 'next/server';
import { sponsorsServiceSSR } from '@/lib/services/sponsorsServiceSSR';
import { getUserFromRequest } from '@/lib/auth-utils';
import { databases, DATABASE_ID } from '@/lib/appwrite';

const PROFILE_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID || '';

async function verifyAdmin(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return null;

  try {
    const profile = await databases.getDocument(DATABASE_ID, PROFILE_COLLECTION_ID, user.$id);
    if (profile.isAdmin) return user;
    return null;
  } catch (error) {
    return null;
  }
}

// GET all sponsors
export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const sponsors = await sponsorsServiceSSR.getAllSponsors();
    return NextResponse.json({ success: true, data: sponsors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create/update sponsor
export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const { $id, ...sponsorData } = data;

    if ($id) {
      const updated = await sponsorsServiceSSR.updateSponsor($id, sponsorData);
      return NextResponse.json({ success: true, data: updated });
    } else {
      const created = await sponsorsServiceSSR.createSponsor(sponsorData);
      return NextResponse.json({ success: true, data: created });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE sponsor - using dynamic route or query param?
// I'll support both $id in body or DELETE with search param if I had a separate file, 
// for now I'll use DELETE and expect data in body or search param.
export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await sponsorsServiceSSR.deleteSponsor(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
