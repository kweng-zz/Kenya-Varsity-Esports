import { NextResponse } from 'next/server';
import { validateInput, commonSchemas } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';

// @ts-ignore
import mailchimp from '@mailchimp/mailchimp_marketing';

export async function POST(request: Request) {
  // Check rate limit
  const rateLimitError = await checkRateLimit(request as any, 'NEWSLETTER');
  if (rateLimitError) return rateLimitError;

  // Check environment variables
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !server || !audienceId) {
    console.error('Mailchimp configuration missing');
    return NextResponse.json({
      success: false,
      error: 'SERVICE_UNAVAILABLE',
      message: 'Newsletter service is temporarily unavailable'
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { email, tags } = body;

    // Input validation using schema
    const validation = validateInput(body, commonSchemas.newsletterSubscription);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validation.errors
      }, { status: 400 });
    }

    // Configure Mailchimp
    mailchimp.setConfig({
      apiKey,
      server,
    });

    // Add subscriber to Mailchimp
    const response = await mailchimp.lists.addListMember(audienceId, {
      email_address: email.trim().toLowerCase(),
      status: 'subscribed',
      tags: tags || ['website-newsletter'],
    });

    console.log('Newsletter subscription successful:', email);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);

    // Handle specific Mailchimp errors
    if (error.response?.body?.title === 'Member Exists') {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    }

    if (error.response?.body?.title === 'Invalid Resource') {
      return NextResponse.json({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'Please enter a valid email address'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'SUBSCRIPTION_FAILED',
      message: 'Failed to subscribe. Please try again later.'
    }, { status: 500 });
  }
}