#!/usr/bin/env node

/**
 * Reconcile legacy tournament registrations against ticket purchases.
 *
 * A tournament "requires a ticket" when an event_tickets configuration exists
 * for its eventId. A registration is considered paid only when a matching
 * purchase has status=confirmed and paymentStatus=paid.
 *
 * Usage:
 *   node scripts/notify-unpaid-registrations.mjs
 *       Dry run: print the affected registrants. No emails, no deletions.
 *
 *   node scripts/notify-unpaid-registrations.mjs --send
 *       Send one reminder email per unpaid registrant/event.
 *
 *   node scripts/notify-unpaid-registrations.mjs --send \
 *     --base-url https://www.kve.co.ke \
 *     --deadline "27 October 2026"
 *       Send reminders with an explicit purchase link and deadline.
 *
 *   node scripts/notify-unpaid-registrations.mjs \
 *     --delete-unpaid --confirm-delete --before 2026-10-27T23:59:59Z
 *       Delete unpaid registrations created before the deadline. This is
 *       intentionally a separate, explicit action. Approved registrations are
 *       never deleted by this script.
 *
 * Environment:
 *   APPWRITE_API_KEY, NEXT_PUBLIC_APPWRITE_ENDPOINT,
 *   NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_DB_ID
 *   SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, SMTP_FROM_EMAIL
 *   NEXT_PUBLIC_APP_URL (fallback base URL)
 *
 * Note: running --send more than once will send repeat reminders.
 */

import dotenv from 'dotenv';
import { Client, Databases, Query } from 'node-appwrite';
import { MailtrapClient } from 'mailtrap';
import nodemailer from 'nodemailer';

const envFile = process.env.ENV_FILE || '.env.local';
dotenv.config({ path: envFile, quiet: true });
if (!process.env.ENV_FILE) {
  dotenv.config({ quiet: true });
}

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getArg = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const SEND = hasFlag('--send');
const DELETE_UNPAID = hasFlag('--delete-unpaid');
const CONFIRM_DELETE = hasFlag('--confirm-delete');
const SHOW_EMAILS = hasFlag('--show-emails');
const EVENT_FILTER = getArg('--event');
const BASE_URL = getArg(
  '--base-url',
  process.env.NEXT_PUBLIC_APP_URL || 'https://www.kve.co.ke'
).replace(/\/+$/, '');
const DEADLINE = getArg(
  '--deadline',
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
);
const BEFORE = getArg('--before');

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const REGS =
  process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID ||
  'tournament_registrations';

if (!endpoint || !projectId || !apiKey || !DB_ID) {
  console.error('Missing Appwrite configuration. Set the Appwrite environment variables first.');
  process.exit(1);
}

if (DELETE_UNPAID && !CONFIRM_DELETE) {
  console.error('Refusing to delete registrations without --confirm-delete.');
  process.exit(1);
}

let beforeTimestamp = null;
if (BEFORE) {
  beforeTimestamp = new Date(BEFORE).getTime();
  if (Number.isNaN(beforeTimestamp)) {
    console.error(`Invalid --before date: ${BEFORE}`);
    process.exit(1);
  }
}

const databases = new Databases(
  new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey)
);

async function listAll(collection, queries = []) {
  const documents = [];
  let offset = 0;
  const pageSize = 100;

  while (true) {
    const response = await databases.listDocuments(DB_ID, collection, [
      ...queries,
      Query.limit(pageSize),
      Query.offset(offset),
    ]);

    documents.push(...response.documents);
    if (response.documents.length < pageSize) break;
    offset += response.documents.length;
  }

  return documents;
}

const maskEmail = (email) => {
  if (!email) return '(no email)';
  if (SHOW_EMAILS) return email;
  const [local, domain] = email.split('@');
  const visible = local?.slice(0, 2) || '';
  return `${visible}***@${domain || ''}`;
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function buildReminderEmail(reminder) {
  const title = reminder.title;
  const name = reminder.playerName || 'there';
  const eventUrl = `${BASE_URL}/events/${encodeURIComponent(reminder.eventId)}`;
  const paymentNote = reminder.hasPendingPurchase
    ? 'We can see a ticket payment linked to your account that is still pending. If you started a payment, please complete it so it can be confirmed.'
    : 'We could not find a ticket purchase linked to this email address.';

  const text = `
Hi ${name},

Your registration for ${title} is saved, but it has not been approved yet because we have not received a confirmed ticket payment.

${paymentNote}

From now on, tournament registration requires a paid ticket before a place can be confirmed.

Buy your ticket here:
${eventUrl}

If you already paid using a different email address, please reply to this email with your payment confirmation code so we can match it to your registration.

Your existing registration details are safe - you do not need to register again. Once your payment is confirmed, our team can approve your registration.

Please complete this by ${reminder.deadline}. Registrations that still have no confirmed paid ticket after that date may be removed so the slot can be released.

Thank you,
KVE Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #961c18; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Ticket payment required</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #ddd; border-top: none;">
        <p>Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p>
          Your registration for <strong>${escapeHtml(title)}</strong> is saved, but it has not
          been approved yet because we have not received a confirmed ticket payment.
        </p>
        <div style="background-color: #fff7e6; border-left: 4px solid #d97706; padding: 12px 16px; margin: 18px 0;">
          ${escapeHtml(paymentNote)}
        </div>
        <p>
          From now on, tournament registration requires a paid ticket before a place can be
          confirmed.
        </p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${escapeHtml(eventUrl)}"
             style="display: inline-block; background-color: #961c18; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
            Buy your ticket
          </a>
        </p>
        <p style="font-size: 13px; color: #555;">
          If the button does not work, copy this link into your browser:<br />
          <a href="${escapeHtml(eventUrl)}">${escapeHtml(eventUrl)}</a>
        </p>
        <p>
          If you already paid using a different email address, please reply to this email with
          your payment confirmation code so we can match it to your registration.
        </p>
        <p>
          Your existing registration details are safe &mdash; you do not need to register again.
          Once your payment is confirmed, our team can approve your registration.
        </p>
        <p>
          Please complete this by <strong>${escapeHtml(reminder.deadline)}</strong>. Registrations
          that still have no confirmed paid ticket after that date may be removed so the slot can
          be released.
        </p>
        <p>Thank you,<br /><strong>KVE Team</strong></p>
      </div>
      <div style="text-align: center; padding: 16px; font-size: 12px; color: #999;">
        <p>This is an automated message. Please do not reply directly.</p>
      </div>
    </div>
  `.trim();

  return {
    subject: `Action required: ticket payment for ${title}`,
    text,
    html,
    eventUrl,
  };
}

function createMailer() {
  const mailtrapToken = process.env.MAILTRAP_TOKEN;

  // Prefer Mailtrap when it is configured; production uses it for approval
  // emails. Fall back to the ticket-email SMTP mailbox.
  if (mailtrapToken) {
    const client = new MailtrapClient({ token: mailtrapToken });
    const sender =
      process.env.MAILTRAP_SENDER_EMAIL ||
      process.env.SMTP_FROM_EMAIL ||
      process.env.SMTP_EMAIL ||
      'no-reply@tunzaesports.com';

    return {
      provider: 'Mailtrap',
      verify: async () => {},
      send: async ({ to, subject, text, html }) => {
        await client.send({
          from: { email: sender, name: 'KVE' },
          to: [{ email: to }],
          subject,
          text,
          html,
        });
      },
    };
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM_EMAIL || user;

  if (!host || !user || !pass || !from) {
    throw new Error(
      'No email transport configured. Set MAILTRAP_TOKEN, or SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD and SMTP_FROM_EMAIL.'
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  return {
    provider: 'SMTP',
    verify: () => transporter.verify(),
    send: ({ to, subject, text, html }) =>
      transporter.sendMail({
        from: `KVE <${from}>`,
        replyTo: user,
        to,
        subject,
        text,
        html,
      }),
  };
}

async function main() {
  const configs = await listAll(
    'event_tickets',
    EVENT_FILTER ? [Query.equal('eventId', EVENT_FILTER)] : []
  );

  const configsByEvent = new Map();
  for (const config of configs) {
    if (!config.eventId) continue;
    if (!configsByEvent.has(config.eventId)) configsByEvent.set(config.eventId, []);
    configsByEvent.get(config.eventId).push(config);
  }

  if (configsByEvent.size === 0) {
    console.log('No event ticket configurations found. Nothing to reconcile.');
    return;
  }

  const registrations = await listAll(REGS);
  const registrationsByEvent = new Map();
  for (const registration of registrations) {
    if (!registration.tournamentId) continue;
    if (!registrationsByEvent.has(registration.tournamentId)) {
      registrationsByEvent.set(registration.tournamentId, []);
    }
    registrationsByEvent.get(registration.tournamentId).push(registration);
  }

  const unpaid = [];
  const summary = [];

  for (const [eventId, eventConfigs] of configsByEvent) {
    const eventRegistrations = registrationsByEvent.get(eventId) || [];
    if (eventRegistrations.length === 0) continue;

    const purchaseMap = new Map();
    for (const config of eventConfigs) {
      const purchases = await listAll('event_ticket_purchases', [
        Query.equal('eventTicketId', config.$id),
      ]);
      for (const purchase of purchases) purchaseMap.set(purchase.$id, purchase);
    }
    const purchases = [...purchaseMap.values()];

    const paidEmails = new Set();
    const paidUserIds = new Set();
    const pendingEmails = new Set();
    const pendingUserIds = new Set();

    for (const purchase of purchases) {
      const email = purchase.userEmail?.trim().toLowerCase();
      const userId = purchase.userId;

      if (purchase.status === 'confirmed' && purchase.paymentStatus === 'paid') {
        if (email) paidEmails.add(email);
        if (userId) paidUserIds.add(userId);
      } else if (
        purchase.paymentStatus === 'pending' &&
        purchase.status !== 'cancelled' &&
        purchase.status !== 'refunded'
      ) {
        if (email) pendingEmails.add(email);
        if (userId) pendingUserIds.add(userId);
      }
    }

    let paidCount = 0;
    for (const registration of eventRegistrations) {
      const email = registration.email?.trim().toLowerCase();
      const userId = registration.userId;
      const isPaid =
        (email && paidEmails.has(email)) || (userId && paidUserIds.has(userId));

      if (isPaid) {
        paidCount += 1;
        continue;
      }

      const hasPendingPurchase =
        (email && pendingEmails.has(email)) || (userId && pendingUserIds.has(userId));

      unpaid.push({
        registrationId: registration.$id,
        eventId,
        title:
          eventConfigs[0].eventTitle ||
          eventConfigs[0].eventSlug ||
          eventId,
        email: registration.email,
        playerName: registration.playerName,
        teamName: registration.teamName,
        status: registration.status,
        createdAt: registration.$createdAt,
        hasPendingPurchase: Boolean(hasPendingPurchase),
        deadline: DEADLINE,
      });
    }

    summary.push({
      eventId,
      title: eventConfigs[0].eventTitle || eventConfigs[0].eventSlug || eventId,
      registrations: eventRegistrations.length,
      paid: paidCount,
      unpaid: eventRegistrations.length - paidCount,
    });
  }

  console.log(`Appwrite endpoint: ${endpoint}`);
  console.log(`Mode: ${SEND ? 'SEND REMINDERS' : DELETE_UNPAID ? 'DELETE UNPAID' : 'DRY RUN'}`);
  console.log(`Ticket deadline in email: ${DEADLINE}`);
  console.log('');

  if (summary.length === 0) {
    console.log('No ticket-enabled tournaments have registrations. Nothing to do.');
    return;
  }

  console.table(summary);
  console.log('');

  if (unpaid.length === 0) {
    console.log('All registrations for ticket-enabled tournaments have a confirmed paid ticket.');
    return;
  }

  console.log(`Registrations without a confirmed paid ticket: ${unpaid.length}`);
  for (const reminder of unpaid) {
    console.log(
      `- ${maskEmail(reminder.email)} | ${reminder.title} | status=${reminder.status} | ${
        reminder.hasPendingPurchase ? 'payment pending' : 'no purchase found'
      }`
    );
  }
  console.log('');

  if (DELETE_UNPAID) {
    const approvedUnpaid = unpaid.filter((item) => item.status === 'approved');
    if (approvedUnpaid.length > 0) {
      console.warn(
        `WARNING: ${approvedUnpaid.length} unpaid registration(s) are already approved and will NOT be deleted. Review them manually.`
      );
    }

    const candidates = unpaid.filter((item) => {
      if (item.status === 'approved') return false;
      if (beforeTimestamp !== null && new Date(item.createdAt).getTime() >= beforeTimestamp) {
        return false;
      }
      return true;
    });

    if (beforeTimestamp !== null) {
      console.log(
        `Only registrations created before ${new Date(beforeTimestamp).toISOString()} are eligible for deletion.`
      );
    }

    console.log(`Deleting ${candidates.length} unpaid registration(s)...`);
    let deleted = 0;
    for (const candidate of candidates) {
      try {
        await databases.deleteDocument(DB_ID, REGS, candidate.registrationId);
        deleted += 1;
        console.log(`  Deleted ${candidate.registrationId} (${maskEmail(candidate.email)})`);
      } catch (error) {
        console.error(
          `  Failed to delete ${candidate.registrationId}:`,
          error instanceof Error ? error.message : error
        );
      }
    }
    console.log(`Deleted ${deleted} of ${candidates.length} eligible registration(s).`);
    return;
  }

  if (!SEND) {
    console.log('Dry run only. Re-run with --send to email these users.');
    return;
  }

  const mailer = createMailer();
  console.log(`Email transport: ${mailer.provider}`);
  await mailer.verify();

  // One email per registrant per event, even if duplicate registrations exist.
  const uniqueReminders = new Map();
  for (const reminder of unpaid) {
    const key = `${reminder.eventId}:${reminder.email?.trim().toLowerCase() || reminder.registrationId}`;
    if (!uniqueReminders.has(key)) uniqueReminders.set(key, reminder);
  }

  console.log(`Sending ${uniqueReminders.size} reminder email(s)...`);
  let sent = 0;
  const failures = [];

  for (const reminder of uniqueReminders.values()) {
    if (!reminder.email) {
      failures.push({ reminder, error: 'Registration has no email address' });
      console.warn(`  Skipped registration ${reminder.registrationId}: no email address`);
      continue;
    }

    const email = buildReminderEmail(reminder);
    try {
      await mailer.send({
        to: reminder.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });
      sent += 1;
      console.log(
        `  Sent to ${maskEmail(reminder.email)} for ${reminder.title} (${email.eventUrl})`
      );
    } catch (error) {
      failures.push({ reminder, error });
      console.error(
        `  Failed to send to ${maskEmail(reminder.email)}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log('');
  console.log(`Sent ${sent} of ${uniqueReminders.size} reminder email(s).`);
  if (failures.length > 0) {
    console.error(`${failures.length} reminder(s) failed. Review the errors above.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Reconciliation failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
