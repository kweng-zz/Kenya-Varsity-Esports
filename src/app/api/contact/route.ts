import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { validateInput, commonSchemas } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';

// Validate environment variables
const validateEnv = () => {
  const required = ['SMTP_EMAIL', 'SMTP_PASSWORD', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_FROM_EMAIL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing);
    return false;
  }
  return true;
};

// Create Zoho Mail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitError = await checkRateLimit(request, 'CONTACT');
  if (rateLimitError) return rateLimitError;

  try {
    // Validate environment variables
    if (!validateEnv()) {
      console.error('❌ Missing SMTP environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error - missing email credentials' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, message, type = 'general' } = body;

    console.log('📧 Contact form submission received');
    console.log(`🔌 Attempting to send using: ${process.env.SMTP_EMAIL}`);

    // Input validation using schema
    const validation = validateInput(body, commonSchemas.contactMessage);
    if (!validation.isValid) {
      console.error('❌ Validation errors:', validation.errors);
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validation.errors
      }, { status: 400 });
    }

    // Create transporter
    console.log('🔌 Creating SMTP transporter...');
    const transporter = createTransporter();

    // Test connection
    try {
      console.log('🧪 Testing SMTP connection...');
      await transporter.verify();
      console.log('✅ SMTP connection verified');
    } catch (verifyError) {
      console.error('❌ SMTP connection failed:', verifyError);
      return NextResponse.json(
        { success: false, error: 'Email service connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    // Email to Tunza Admin
    const mailOptions = {
      from: `"Tunza Esports Contact Form" <${process.env.SMTP_FROM_EMAIL}>`,
      to: 'events@tunzaesports.com',
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
      replyTo: email,
    };

    // Send email to KUER
    console.log('📤 Sending email to KUER...');
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent to KUER:', info.messageId);
    } catch (sendError) {
      console.error('❌ Failed to send email to KUER:', sendError);
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please check your email and try again.' },
        { status: 500 }
      );
    }

    // Optional: Send confirmation email to user
    const confirmationEmail = {
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: 'We received your message - Tunza Esports',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #961c18;">Thank you for reaching out!</h2>
          
          <p>Hi ${escapeHtml(name)},</p>
          
          <p>We have received your message and appreciate your interest in partnership or press opportunities with KUER.</p>
          
          <p>Our team will review your inquiry and get back to you as soon as possible.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap;">
              ${escapeHtml(message)}
            </p>
          </div>

          <p>Best regards,<br/>
          <strong>KUER Team</strong><br/>
          Kenya University Esports Rankings</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            This is an automated confirmation email. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    try {
      console.log('📤 Sending confirmation email to user...');
      const confirmInfo = await transporter.sendMail(confirmationEmail);
      console.log('✅ Confirmation email sent:', confirmInfo.messageId);
    } catch (confirmError) {
      console.error('⚠️ Error sending confirmation email (non-critical):', confirmError);
      // Don't fail the request if confirmation email fails
    }

    console.log('✅ Contact form processed successfully');
    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Unexpected error in contact form:', error);
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
