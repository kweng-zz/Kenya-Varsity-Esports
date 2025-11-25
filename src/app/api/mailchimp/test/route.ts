import { NextResponse } from 'next/server';

// @ts-ignore
import mailchimp from '@mailchimp/mailchimp_marketing';

export async function GET() {
  // Check environment variables
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !server) {
    return NextResponse.json({
      success: false,
      error: 'Mailchimp environment variables are not configured'
    }, { status: 500 });
  }

  try {
    // Configure Mailchimp
    mailchimp.setConfig({
      apiKey,
      server,
    });

    const response = await mailchimp.ping.get();
    
    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    console.error('Mailchimp test error:', error);
    return NextResponse.json({
      success: false,
      error: error.response?.body?.title || error.message || 'Connection test failed'
    }, { status: 500 });
  }
}