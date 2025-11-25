import { NextResponse } from 'next/server';

// @ts-ignore
import mailchimp from '@mailchimp/mailchimp_marketing';

export async function POST(request: Request) {
  // Check environment variables
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !server || !audienceId) {
    return NextResponse.json({
      success: false,
      error: 'Mailchimp environment variables are not configured'
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

    // Configure Mailchimp
    mailchimp.setConfig({
      apiKey,
      server,
    });

    // Process in batches
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < contacts.length; i += batchSize) {
      batches.push(contacts.slice(i, i + batchSize));
    }

    let totalAdded = 0;
    let totalUpdated = 0;
    let totalErrors = 0;
    const errorMessages: string[] = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      const members = batch.map((contact: any) => ({
        email_address: contact.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.fullname.split(' ')[0] || '',
          LNAME: contact.fullname.split(' ').slice(1).join(' ') || '',
          UNIVERSITY: contact.university || '',
          STUDENTID: contact.student_id || '',
          PHONE: contact.phone_number || '',
        },
      }));

      const response = await mailchimp.lists.batchListMembers(
        audienceId,
        {
          members,
          update_existing: true,
        }
      );

      totalAdded += response.new_members?.length || 0;
      totalUpdated += response.updated_members?.length || 0;
      totalErrors += response.errors?.length || 0;

      if (response.errors && response.errors.length > 0) {
        response.errors.forEach((error: any) => {
          errorMessages.push(`${error.email_address}: ${error.error}`);
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        added: totalAdded,
        updated: totalUpdated,
        errors: totalErrors,
        total: contacts.length,
        errorMessages: errorMessages.length > 0 ? errorMessages : undefined
      }
    });

  } catch (error: any) {
    console.error('Mailchimp sync error:', error);
    return NextResponse.json({
      success: false,
      error: error.response?.body?.title || error.message || 'Sync failed'
    }, { status: 500 });
  }
}