import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
    const { name, email, university, studentId, phone } = body;

    console.log('📧 Registration notification request received for:', email);

    // Validate input
    if (!name || !email || !university || !studentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = createTransporter();

    // Email to KUER Admin
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: 'events@tunzaesports.com', // Admin email
      subject: `New Participant Registration: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #961c18; border-bottom: 2px solid #961c18; padding-bottom: 10px;">New Participant Verification Required</h2>
          
          <p>A new user has registered as a <strong>Participant</strong> and requires validation.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Institution:</strong> ${university}</p>
            <p style="margin: 10px 0;"><strong>Student ID:</strong> ${studentId}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone || 'N/A'}</p>
          </div>

          <p>Please log in to the Admin Panel to approve or reject this user.</p>
          
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kve.co.ke/'}/admin/users" 
             style="display: inline-block; background-color: #961c18; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">
             Go to Admin Panel
          </a>

          <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
            This is an automated notification from KVE.
          </p>
        </div>
      `,
    };

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Registration notification sent:', info.messageId);
      return NextResponse.json({ success: true, message: 'Notification sent' }, { status: 200 });
    } catch (sendError) {
      console.error('❌ Failed to send registration notification:', sendError);
      return NextResponse.json(
        { success: false, error: 'Failed to send notification email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Unexpected error in registration notification:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
