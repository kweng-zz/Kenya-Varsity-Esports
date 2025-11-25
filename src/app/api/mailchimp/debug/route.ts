import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    // Regular env vars
    MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY ? 'Present' : 'Missing',
    MAILCHIMP_SERVER_PREFIX: process.env.MAILCHIMP_SERVER_PREFIX ? 'Present' : 'Missing', 
    MAILCHIMP_AUDIENCE_ID: process.env.MAILCHIMP_AUDIENCE_ID ? 'Present' : 'Missing',
    
    // NEXT_PUBLIC_ env vars
    NEXT_PUBLIC_MAILCHIMP_API_KEY: process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY ? 'Present' : 'Missing',
    NEXT_PUBLIC_MAILCHIMP_SERVER_PREFIX: process.env.NEXT_PUBLIC_MAILCHIMP_SERVER_PREFIX ? 'Present' : 'Missing',
    NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID: process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID ? 'Present' : 'Missing',
    
    // Values (partial for security)
    MAILCHIMP_API_KEY_PREVIEW: process.env.MAILCHIMP_API_KEY ? `${process.env.MAILCHIMP_API_KEY.substring(0, 10)}...` : 'N/A',
    SERVER_PREFIX_VALUE: process.env.MAILCHIMP_SERVER_PREFIX || process.env.NEXT_PUBLIC_MAILCHIMP_SERVER_PREFIX || 'N/A',
    AUDIENCE_ID_VALUE: process.env.MAILCHIMP_AUDIENCE_ID || process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID || 'N/A',
  };

  return NextResponse.json({
    environment: 'Server',
    envVars,
    allMailchimpEnvKeys: Object.keys(process.env).filter(key => key.includes('MAILCHIMP'))
  });
}