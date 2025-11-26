import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Validate environment variables
const validateEnv = () => {
  const required = ['ZOHO_EMAIL', 'ZOHO_PASSWORD', 'ZOHO_SMTP_HOST', 'ZOHO_SMTP_PORT'];
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
    host: process.env.ZOHO_SMTP_HOST,
    port: parseInt(process.env.ZOHO_SMTP_PORT || '587'),
    secure: process.env.ZOHO_SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!validateEnv()) {
      console.error('❌ Missing Zoho environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error - missing email credentials' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, message } = body;

    console.log('📧 Contact form submission received:', { name, email });

    // Validate input
    if (!name || !email || !message) {
      console.error('❌ Missing required fields:', { name: !!name, email: !!email, message: !!message });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create transporter
    console.log('🔌 Creating Zoho SMTP transporter...');
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

    // Email to KUER
    const mailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: 'info@kuer.co.ke',
      subject: `New Partnership/Press Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #961c18;">New Contact Form Submission</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-left: 4px solid #961c18;">
              ${escapeHtml(message)}
            </p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated message from the KUER website contact form.
          </p>
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
      from: process.env.ZOHO_EMAIL,
      to: email,
      subject: 'We received your message - KUER',
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
