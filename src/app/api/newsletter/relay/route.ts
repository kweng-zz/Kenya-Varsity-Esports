
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Security Check: verify a secret header OR Basic Auth
  const secretHeader = request.headers.get('x-relay-secret');
  const authHeader = request.headers.get('authorization'); 
  const envSecret = process.env.LISTMONK_RELAY_SECRET;

  let isAuthorized = false;

  // Check custom header
  if (secretHeader === envSecret) {
    isAuthorized = true;
  } 
  // Check Authorization header (Basic or Bearer)
  else if (authHeader) {
    if (authHeader.startsWith('Bearer ') && authHeader.includes(envSecret!)) {
      isAuthorized = true;
    } else if (authHeader.startsWith('Basic ')) {
      try {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = atob(base64Credentials);
        const [username, password] = credentials.split(':');
        if (password === envSecret) {
          isAuthorized = true;
        }
      } catch (e) {
        console.error('Basic Auth decode error', e);
      }
    }
  }

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized relay access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { from, to, subject, html, text } = body;

    // 2. Call Resend API directly
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: from, // Verified domain email
        to: [to],   // Recipient
        subject: subject,
        html: html,
        text: text,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Resend API Error:', errorData);
      return NextResponse.json({ error: 'Failed to send via Resend', details: errorData }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data.id });

  } catch (error: any) {
    console.error('Relay Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
