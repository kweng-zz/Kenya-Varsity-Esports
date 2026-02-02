import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    /* ---------------- Rate limit ---------------- */
    const rateLimitError = await checkRateLimit(request, 'CONTACT');
    if (rateLimitError) return rateLimitError;

    /* ---------------- Input ---------------- */
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    /* ---------------- Admin transporter ---------------- */
    const adminTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_EVENTS_EMAIL,
        pass: process.env.SMTP_EVENTS_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    /* ---------------- No-reply transporter ---------------- */
    const noreplyTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_NOREPLY_EMAIL,
        pass: process.env.SMTP_NOREPLY_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    /* ---------------- 1️⃣ Admin email ---------------- */
    const adminPromise = adminTransporter.sendMail({
      from: `"Tunza Esports Website" <${process.env.SMTP_EVENTS_EMAIL}>`,
      to: process.env.SMTP_EVENTS_EMAIL,
      subject: `Website Contact: ${name}`,
      text: `New contact form submission from the Tunza Esports website:

Name: ${name}
Email: ${email}

Message:
${message}

---
Submitted at: ${new Date().toISOString()}`,
    });

    /* ---------------- 2️⃣ Auto-reply ---------------- */
    const userPromise = noreplyTransporter.sendMail({
      from: `"Tunza Esports" <${process.env.SMTP_NOREPLY_EMAIL}>`,
      to: email,
      replyTo: process.env.SMTP_EVENTS_EMAIL,
      subject: 'Thank you for contacting Tunza Esports',
      headers: {
        'Auto-Submitted': 'auto-replied',
        Precedence: 'bulk',
      },
      text: `Hi ${name},

Thanks for contacting Tunza Esports.
We’ve received your message and our team will get back to you shortly.

Please do not reply to this email.

Regards,
Tunza Esports`,
    });

    const results = await Promise.allSettled([userPromise, adminPromise]);

    return NextResponse.json({
      success: true,
      userAutoReplySent: results[0].status === 'fulfilled',
      adminNotificationSent: results[1].status === 'fulfilled',
    });

  } catch (error) {
    console.error('❌ Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
