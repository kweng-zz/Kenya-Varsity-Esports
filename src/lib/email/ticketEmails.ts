import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

interface TicketEmailData {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  ticketTypeName: string;
  quantity: number;
  ticketCodes: string[];
  purchaseId: string;
  confirmationCode: string;
  totalAmount: number;
  currency: string;
}

interface TicketEmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
}

function createTransporter(config: TicketEmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: { rejectUnauthorized: false },
  });
}

async function generateTicketEmailHTML(data: TicketEmailData): Promise<string> {
  // Generate QR codes for each ticket
  const ticketCodesHtml = await Promise.all(data.ticketCodes.map(async (code, index) => {
    const qrCodeDataUrl = await QRCode.toDataURL(code, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      }
    });
    
    return `
    <div style="background: #f8f9fa; border: 2px solid #8c110d; border-radius: 12px; padding: 20px; margin: 16px 0; text-align: center;">
      <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Ticket ${index + 1} of ${data.quantity}</div>
      <div style="margin: 16px auto; width: 180px; height: 180px;">
        <img src="${qrCodeDataUrl}" alt="QR Code for ${code}" style="width: 100%; height: 100%; border-radius: 8px; background: white; padding: 8px;" />
      </div>
      <div style="font-family: 'Courier New', monospace; font-size: 14px; font-weight: bold; color: #8c110d; letter-spacing: 1px; margin: 12px 0; word-break: break-all;">${code}</div>
      <div style="font-size: 11px; color: #999;">${data.ticketTypeName} • ${data.eventTitle}</div>
      <div style="font-size: 10px; color: #aaa; margin-top: 8px;">Scan at gate for entry</div>
    </div>
  `;
  }));
  
  const resolvedTicketCodesHtml = await Promise.all(ticketCodesHtml);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your E-Tickets - ${data.eventTitle}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #8c110d 0%, #b91c17 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: 1px;">🎟️ Your E-Tickets</h1>
            <p style="margin: 12px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">${data.eventTitle}</p>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 24px;">Hi ${data.userName},</p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 24px;">Thank you for your purchase! Your tickets for <strong>${data.eventTitle}</strong> have been confirmed. Please find your e-tickets below.</p>
            
            <!-- Event Details Card -->
            <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #8c110d;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a;">Event Details</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; width: 100px;">Date:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.eventDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Venue:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.eventVenue}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Ticket Type:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.ticketTypeName} (x${data.quantity})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Order ID:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-family: monospace;">${data.purchaseId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Confirmation:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-family: monospace;">${data.confirmationCode}</td>
                </tr>
              </table>
            </div>

            <!-- Tickets -->
            <div style="margin: 32px 0;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a;">Your Tickets</h2>
              <p style="font-size: 14px; color: #666; margin: 0 0 16px;">Save these tickets to your phone or print them. Each ticket has a unique code that will be scanned at entry.</p>
              ${ticketCodesHtml}
            </div>

            <!-- Important Info -->
            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 12px; font-size: 16px; color: #856404;">⚠️ Important Information</h3>
              <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px; line-height: 1.8;">
                <li>Present this e-ticket on your mobile device or as a printout at the venue</li>
                <li>Each ticket code can only be scanned once - duplicates will be rejected</li>
                <li>Arrive at least 30 minutes before the event start time</li>
                <li>Bring a valid photo ID that matches the name on the ticket</li>
                <li>For support, contact us at tickets@kuer.esports.com</li>
              </ul>
            </div>

            <!-- Footer Info -->
            <div style="border-top: 1px solid #eee; padding-top: 24px; margin-top: 32px;">
              <p style="font-size: 14px; color: #666; margin: 0 0 8px;">If you have any questions, reply to this email or contact our support team.</p>
              <p style="font-size: 14px; color: #666; margin: 0;">Thank you for choosing Kuer Esports!</p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #1a1a1a; padding: 24px 30px; text-align: center;">
            <p style="margin: 0 0 8px; color: #888; font-size: 12px;">Kuer Esports • Nairobi, Kenya</p>
            <p style="margin: 0; color: #666; font-size: 11px;">This is an automated email. Please do not reply directly.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function generateTicketEmailText(data: TicketEmailData): string {
  const ticketCodesText = data.ticketCodes.map((code, index) => 
    `Ticket ${index + 1}: ${code}`
  ).join('\n');

  return `
Your E-Tickets - ${data.eventTitle}

Hi ${data.userName},

Thank you for your purchase! Your tickets for ${data.eventTitle} have been confirmed.

EVENT DETAILS:
Date: ${data.eventDate}
Venue: ${data.eventVenue}
Ticket Type: ${data.ticketTypeName} (x${data.quantity})
Order ID: ${data.purchaseId}
Confirmation: ${data.confirmationCode}

YOUR TICKETS:
${ticketCodesText}

IMPORTANT INFORMATION:
- Present this e-ticket on your mobile device or as a printout at the venue
- Each ticket code can only be scanned once - duplicates will be rejected
- Arrive at least 30 minutes before the event start time
- Bring a valid photo ID that matches the name on the ticket
- For support, contact us at tickets@kuer.esports.com

Thank you for choosing Kuer Esports!

---
Kuer Esports • Nairobi, Kenya
This is an automated email. Please do not reply directly.
  `.trim();
}

export async function sendTicketConfirmationEmail(data: TicketEmailData): Promise<{ success: boolean; error?: string }> {
  const config: TicketEmailConfig = {
    host: process.env.SMTP_HOST || 'sbg106.truehost.cloud',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465',
    user: process.env.SMTP_EVENTS_EMAIL || process.env.SMTP_EMAIL || 'events@tunzaesports.com',
    pass: process.env.SMTP_EVENTS_PASSWORD || process.env.SMTP_PASSWORD || '',
    fromEmail: process.env.SMTP_EVENTS_EMAIL || process.env.SMTP_EMAIL || 'events@tunzaesports.com',
    fromName: 'Kuer Esports Tickets',
  };

  if (!config.user || !config.pass) {
    console.warn('SMTP credentials not configured, skipping ticket email');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const transporter = createTransporter(config);
    
    const html = await generateTicketEmailHTML(data);
    const text = generateTicketEmailText(data);

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: data.userEmail,
      subject: `Your E-Tickets for ${data.eventTitle} 🎟️`,
      text,
      html,
      headers: {
        'Auto-Submitted': 'auto-generated',
        Precedence: 'bulk',
      },
    });

    console.log(`✅ Ticket confirmation email sent to ${data.userEmail} for purchase ${data.purchaseId}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to send ticket confirmation email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendTicketRefundEmail(data: TicketEmailData): Promise<{ success: boolean; error?: string }> {
  const config: TicketEmailConfig = {
    host: process.env.SMTP_HOST || 'sbg106.truehost.cloud',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465',
    user: process.env.SMTP_EVENTS_EMAIL || process.env.SMTP_EMAIL || 'events@tunzaesports.com',
    pass: process.env.SMTP_EVENTS_PASSWORD || process.env.SMTP_PASSWORD || '',
    fromEmail: process.env.SMTP_EVENTS_EMAIL || process.env.SMTP_EMAIL || 'events@tunzaesports.com',
    fromName: 'Kuer Esports Tickets',
  };

  if (!config.user || !config.pass) {
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const transporter = createTransporter(config);
    
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: data.userEmail,
      subject: `Ticket Refund Confirmation - ${data.eventTitle}`,
      text: `Hi ${data.userName},\n\nYour refund for ${data.quantity}x ${data.ticketTypeName} for ${data.eventTitle} has been processed.\n\nRefund Amount: ${data.currency} ${data.totalAmount}\nOrder ID: ${data.purchaseId}\n\nThe refund will be credited back to your original payment method within 5-10 business days.\n\nIf you have any questions, contact us at tickets@kuer.esports.com\n\nThank you,\nKuer Esports`,
      headers: {
        'Auto-Submitted': 'auto-generated',
        Precedence: 'bulk',
      },
    });

    console.log(`✅ Ticket refund email sent to ${data.userEmail} for purchase ${data.purchaseId}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to send ticket refund email:', error);
    return { success: false, error: error.message };
  }
}