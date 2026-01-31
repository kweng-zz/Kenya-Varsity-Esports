import { NextRequest, NextResponse } from 'next/server';
import { validateInput, commonSchemas } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitError = await checkRateLimit(request, 'CONTACT');
    if (rateLimitError) {
      return rateLimitError;
    }

    // Parse request body
    const body = await request.json();
    console.log('📨 Contact API:', JSON.stringify(body, null, 2));
    
    const { name, email, message } = body;

    // Simple validation
    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('🔄 Sending confirmation email to user...');

    // Send both emails (use Promise.allSettled to handle both)
    // Try with no-reply first, fallback to main email if fails
    const userPromise = (async () => {
      try {
        console.log('🔄 Sending user confirmation email...');
        console.log('📧 To:', email);
        console.log('📧 From:', process.env.SMTP_FROM_EMAIL);
        
        // Try with no-reply@tunzaesports.com first
        const result = await transporter.sendMail({
          from: process.env.SMTP_FROM_EMAIL, // Use no-reply@tunzaesports.com
          to: email, // Send to user directly 
          subject: `Thank you for contacting Tunza Esports`,
          text: `Hi ${name},

Thank you for contacting Tunza Esports!

We received your message:
"${message}"

We will review your inquiry and get back to you as soon as possible.

Best regards,
Tunza Esports Team`,
        });
        
        console.log('✅ User confirmation sent!');
        console.log('📧 Message ID:', result.messageId);
        console.log('📧 Envelope:', result.envelope);
        return result;
      } catch (noReplyError) {
        console.log('⚠️ no-reply failed, using main email instead');
        console.error('❌ no-reply error:', noReplyError);
        
        // Fallback to main email if no-reply doesn't work
        const fallbackResult = await transporter.sendMail({
          from: process.env.SMTP_EMAIL, // Use events@tunzaesports.com
          to: email,
          subject: `Thank you for contacting Tunza Esports`,
          text: `Hi ${name},

Thank you for contacting Tunza Esports!

We received your message:
"${message}"

We will review your inquiry and get back to you as soon as possible.

Best regards,
Tunza Esports Team`,
        });
        
        console.log('✅ Fallback user confirmation sent!');
        console.log('📧 Fallback Message ID:', fallbackResult.messageId);
        console.log('📧 Fallback Envelope:', fallbackResult.envelope);
        return fallbackResult;
      }
    })();

    const adminPromise = transporter.sendMail({
      from: process.env.SMTP_EMAIL, // Use events@tunzaesports.com for admin notifications
      to: process.env.SMTP_EMAIL, // Send to events@tunzaesports.com (your admin email)
      subject: `Website Contact: ${name}`,
      text: `New contact form submission from Tunza Esports website:

Name: ${name}
Email: ${email}
Message: ${message}

---
Submitted: ${new Date().toISOString()}`,
    });

    console.log('🔄 Sending both emails...');
    const results = await Promise.allSettled([userPromise, adminPromise]);

    console.log('📊 Email Results:', {
      user: results[0].status,
      admin: results[1].status
    });

    const userResult = results[0];
    const adminResult = results[1];

    // Extract successful results
    let successCount = 0;
    if (userResult.status === 'fulfilled') {
      console.log('✅ User confirmation sent successfully!');
      console.log('📧 Message ID:', userResult.value.messageId);
      successCount++;
    } else {
      console.log('❌ User email failed:', userResult.reason);
    }

    if (adminResult.status === 'fulfilled') {
      console.log('✅ Admin notification sent to Gmail!');
      console.log('📧 Admin Message ID:', adminResult.value.messageId);
      successCount++;
    } else {
      console.log('❌ Admin notification failed:', adminResult.reason);
    }
     return NextResponse.json({
       success: successCount > 0,
       message: `${successCount} email(s) sent successfully`
      });

    return NextResponse.json({
      success: successCount > 0,
      message: `${successCount} email(s) sent successfully`,
      userSent: userResult.status === 'fulfilled',
      adminSent: adminResult.status === 'fulfilled',
      messageId: userResult.status === 'fulfilled' ? userResult.value.messageId : null
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}