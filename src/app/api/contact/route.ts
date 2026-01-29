import { NextRequest, NextResponse } from 'next/server';
import { MailtrapClient } from 'mailtrap';
import { validateInput, commonSchemas } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';

// Initialize Mailtrap client
const getMailtrapClient = () => {
  const token = process.env.MAILTRAP_TOKEN;
  
  if (!token) {
    console.error('Missing MAILTRAP_TOKEN environment variable');
    return null;
  }
  
  return new MailtrapClient({ token });
};

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitError = await checkRateLimit(request, 'CONTACT');
    if (rateLimitError) {
    }

    // Parse request body
    const body = await request.json();
    console.log('API Contact Body:', JSON.stringify(body, null, 2));
    
    // Ensure type is set to default if not provided
    if (!body.type) {
      body.type = 'general';
    }
    
    const { name, email, message, type } = body;

    // Input validation using schema
    const validation = validateInput(body, commonSchemas.contactMessage);
    if (!validation.isValid) {
      console.error('Validation Error:', JSON.stringify(validation.errors, null, 2));
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validation.errors
      }, { status: 400 });
    }

    // Check for Mailtrap configuration
    const client = getMailtrapClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const senderEmail = process.env.MAILTRAP_SENDER_EMAIL || 'no-reply@tunzaesports.com';
    const recipientEmail = process.env.MAILTRAP_RECIPIENT_EMAIL || 'events@tunzaesports.com';

    // Send email to business using Mailtrap
    try {
      await client.send({
        from: { email: senderEmail, name: 'Tunza Esports Contact Form' },
        to: [{ email: recipientEmail }],
        subject: `Contact Form Inquiry: ${name}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
            <div style="background-color: #961c18; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Message from Website</h1>
            </div>
            
            <div style="padding: 30px; border: 1px solid #ddd; border-top: none; background-color: #fff;">
              <p style="font-size: 16px;">You have received a new inquiry from the Tunza Esports website.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Name:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">User Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${escapeHtml(email)}</td>
                </tr>
              </table>
              
              <div style="margin-top: 25px;">
                <p style="font-weight: bold; margin-bottom: 10px;">Message Content:</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eee; font-style: italic;">
                  ${escapeHtml(message).replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                You can reply directly to this email to contact the user.
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>This is an automated notification from <a href="https://tunzaesports.com" style="color: #961c18; text-decoration: none;">Tunza Esports</a>.</p>
            </div>
          </div>
        `,
        reply_to: { email },
      });
      console.log('Business notification email sent successfully');
    } catch (sendError) {
      console.error('Mailtrap Error:', sendError);
      const errorMessage = sendError instanceof Error ? sendError.message : 'Unknown error';
      return NextResponse.json(
        { success: false, error: `Failed to send email: ${errorMessage}` },
        { status: 500 }
      );
    }

    // Send confirmation email to user
    try {
      await client.send({
        from: { email: senderEmail, name: 'Tunza Esports' },
        to: [{ email }],
        subject: 'We received your message - Tunza Esports',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #961c18;">Thank you for reaching out!</h2>
            
            <p>Hi ${escapeHtml(name)},</p>
            
            <p>We have received your message and appreciate your interest in partnership or press opportunities with Tunza Esports.</p>
            
            <p>Our team will review your inquiry and get back to you as soon as possible.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Your Message:</strong></p>
              <p style="white-space: pre-wrap;">
                ${escapeHtml(message)}
              </p>
            </div>

            <p>Best regards,<br/>
            <strong>Tunza Esports Team</strong><br/>
            Kenya University Esports Rankings</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
          </div>
        `,
      });
      console.log('Confirmation email sent to user successfully');
    } catch (confirmError) {
      // Don't fail the request if confirmation email fails
      console.error('Confirmation email error:', confirmError);
    }

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
