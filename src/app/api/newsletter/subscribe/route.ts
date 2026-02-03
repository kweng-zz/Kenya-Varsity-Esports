import { NextResponse } from 'next/server';
import { validateInput, commonSchemas } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { listmonkService } from '@/lib/listmonk';

export async function POST(request: Request) {
  // Check rate limit
  const rateLimitError = await checkRateLimit(request as any, 'NEWSLETTER');
  if (rateLimitError) return rateLimitError;

  // Check environment variables
  const listmonkUrl = process.env.LISTMONK_URL;
  const listmonkUsername = process.env.LISTMONK_USERNAME;
  const listmonkPassword = process.env.LISTMONK_PASSWORD;

  if (!listmonkUrl || !listmonkUsername || !listmonkPassword) {
    console.error('Listmonk configuration missing');
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

    // Add subscriber to Listmonk
    const result = await listmonkService.addContact({
      email: email.trim().toLowerCase(),
      name: email.split('@')[0], // Use email prefix as name if not provided
      tags: tags || ['website-newsletter', 'kve-updates'],
    });

    if (result.success) {
      console.log('Newsletter subscription successful:', email);
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter!'
      });
    }

    // Handle "already subscribed" case
    if (result.error === 'Already subscribed') {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    }

    // Handle other errors
    return NextResponse.json({
      success: false,
      error: 'SUBSCRIPTION_FAILED',
      message: result.error || 'Failed to subscribe. Please try again later.'
    }, { status: 500 });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);

    return NextResponse.json({
      success: false,
      error: 'SUBSCRIPTION_FAILED',
      message: 'Failed to subscribe. Please try again later.'
    }, { status: 500 });
  }
}