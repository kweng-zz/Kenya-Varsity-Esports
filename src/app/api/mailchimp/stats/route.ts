import { NextResponse } from 'next/server';

export async function GET() {
  // MailChimp integration temporarily disabled for production build
  // TODO: Install @mailchimp/mailchimp_marketing dependency and re-enable
  
  return NextResponse.json({
    message: 'MailChimp stats temporarily disabled',
    status: 'maintenance'
  });
}
