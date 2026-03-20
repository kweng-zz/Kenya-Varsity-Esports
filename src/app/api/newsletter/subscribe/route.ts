import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, name, tags } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const listmonkUrl = process.env.LISTMONK_URL;
    const listmonkUsername = process.env.LISTMONK_USERNAME;
    const listmonkPassword = process.env.LISTMONK_PASSWORD;
    const listmonkListId = process.env.LISTMONK_LIST_ID;

    if (!listmonkUrl || !listmonkUsername || !listmonkPassword || !listmonkListId) {
      console.error('Listmonk configuration is missing');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const basicAuth = Buffer.from(`${listmonkUsername}:${listmonkPassword}`).toString('base64');
    
    // Parse list IDs. Handle comma-separated list IDs if provided
    const listIds = listmonkListId.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));

    const res = await fetch(`${listmonkUrl}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        name: name || email.split('@')[0],
        status: 'enabled',
        lists: listIds,
        attribs: tags ? { tags } : {},
        preconfirm_subscriptions: true
      }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Listmonk API Error:', errorData);
        
        // If subscriber already exists, Listmonk might return 409
        if (res.status === 409) {
           return NextResponse.json({ success: true, message: 'Already subscribed!' });
        }
        
        return NextResponse.json({ success: false, error: errorData.message || 'Failed to subscribe' }, { status: res.status });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });

  } catch (error: any) {
    console.error('Subscription Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}