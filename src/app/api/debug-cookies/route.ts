import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  return NextResponse.json({
    message: 'Cookie Debug Info',
    cookies: allCookies.map(c => ({ 
      name: c.name, 
      value: c.name === 'appwrite-session' ? `PRESENT (Length: ${c.value.length})` : c.value 
    })),
    cookieHeader: 'See internal logs'
  });
}
