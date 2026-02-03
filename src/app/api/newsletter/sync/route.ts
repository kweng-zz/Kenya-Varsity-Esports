import { NextResponse } from 'next/server';
import { listmonkService } from '@/lib/listmonk';

export async function POST(request: Request) {
  // Check environment variables
  const listmonkUrl = process.env.LISTMONK_URL;
  const listmonkUsername = process.env.LISTMONK_USERNAME;
  const listmonkPassword = process.env.LISTMONK_PASSWORD;

  if (!listmonkUrl || !listmonkUsername || !listmonkPassword) {
    return NextResponse.json({
      success: false,
      error: 'Listmonk environment variables are not configured'
    }, { status: 500 });
  }

  try {
    const { contacts } = await request.json();

    if (!contacts || !Array.isArray(contacts)) {
      return NextResponse.json({
        success: false,
        error: 'Contacts array is required'
      }, { status: 400 });
    }

    // Transform contacts to Listmonk format
    const listmonkContacts = contacts.map((contact: any) => ({
      email: contact.email,
      name: contact.fullname || contact.name || contact.email.split('@')[0],
      university: contact.university,
      student_id: contact.student_id,
      phone_number: contact.phone_number,
      tags: contact.subscribeNewsletter ? ['newsletter', 'website-signup'] : ['transactional'],
    }));

    // Add contacts via Listmonk service
    const result = await listmonkService.addContactsBatch(listmonkContacts);

    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        data: result.data
      });
    }

    return NextResponse.json({
      success: false,
      error: result.error || 'Sync failed'
    }, { status: 500 });

  } catch (error: any) {
    console.error('Newsletter sync error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Sync failed'
    }, { status: 500 });
  }
}
