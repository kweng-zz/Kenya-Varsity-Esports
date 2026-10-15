/**
 * Quick SMTP credential check for ticket emails.
 *
 * Usage (from the project root):
 *   node --env-file=.env.local scripts/test-smtp.js
 *
 * Reads SMTP_EVENTS_EMAIL / SMTP_EVENTS_PASSWORD when present, otherwise
 * SMTP_EMAIL / SMTP_PASSWORD - the same precedence the ticket email
 * transport uses. Runs nodemailer's verify() only; no email is sent.
 */
import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST || 'sbg106.truehost.cloud';
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_EVENTS_EMAIL || process.env.SMTP_EMAIL || '';
const pass = process.env.SMTP_EVENTS_PASSWORD || process.env.SMTP_PASSWORD || '';

if (!user || !pass) {
  console.error(
    '❌ SMTP credentials missing. Set SMTP_EMAIL / SMTP_PASSWORD (or the SMTP_EVENTS_* overrides).'
  );
  process.exit(1);
}

console.log(`Checking SMTP login for ${user} at ${host}:${port} ...`);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15000,
});

try {
  await transporter.verify();
  console.log('✅ SMTP login OK - ticket emails can be sent with these credentials.');
} catch (error) {
  console.error(`❌ SMTP login failed: ${error.code || error.name} - ${error.message}`);
  console.error(
    'Update SMTP_PASSWORD (or SMTP_EVENTS_PASSWORD) with the correct mailbox password and run again.'
  );
  process.exit(1);
}
