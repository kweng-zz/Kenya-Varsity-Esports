import { NextResponse } from 'next/server';

// @ts-ignore
import mailchimp from '@mailchimp/mailchimp_marketing';

export async function GET() {
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
    // Configure Mailchimp
    mailchimp.setConfig({
      apiKey,
      server,
    });

    const stats = await mailchimp.lists.getList(audienceId);
    
    return NextResponse.json({
      success: true,
      stats: {
        totalSubscribers: stats.stats.member_count,
        unsubscribeCount: stats.stats.unsubscribe_count,
        cleanedCount: stats.stats.cleaned_count,
        audienceName: stats.name
      }
    });
  } catch (error: any) {
    console.error('Mailchimp API error:', error);
    return NextResponse.json({
      success: false,
      error: error.response?.body?.title || error.message || 'Failed to fetch stats'
    }, { status: 500 });
  }
}