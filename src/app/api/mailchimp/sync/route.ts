import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // MailChimp integration temporarily disabled for production build
  // TODO: Install @mailchimp/mailchimp_marketing dependency and re-enable
  
  return NextResponse.json({
    message: 'MailChimp sync temporarily disabled',
    status: 'maintenance'
  });
}