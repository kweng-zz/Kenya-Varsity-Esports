import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      console.error('RESEND_API_KEY or RESEND_AUDIENCE_ID is missing');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        unsubscribed: false,
      }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error('Resend API Error:', errorData);
        return NextResponse.json({ success: false, error: errorData.message || 'Failed to subscribe' }, { status: res.status });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });

  } catch (error: any) {
    console.error('Subscription Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}