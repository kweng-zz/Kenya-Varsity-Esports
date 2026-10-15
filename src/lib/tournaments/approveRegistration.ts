/**
 * Shared tournament registration approval logic.
 *
 * Used by:
 *  - POST /api/admin/approve-registration (manual admin approval)
 *  - POST /api/events/[eventId]/tickets/check-in (gate scan auto-approval)
 *  - POST /api/tournaments/[id]/participants (auto-approve on registration
 *    when the player already checked in a ticket)
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import { MailtrapClient } from 'mailtrap';

export interface ApproveRegistrationPayload {
  tournamentId?: string;
  playerName?: string;
  email?: string;
  phone?: string;
  university?: string;
  teamName?: string;
  players?: unknown;
  registrationDate?: string;
  [key: string]: unknown;
}

export interface ApproveRegistrationArgs {
  registrationId: string;
  status: 'approved' | 'rejected';
  registration: ApproveRegistrationPayload;
  tournamentTitle?: string;
  tournamentSlug?: string;
}

export interface ApproveRegistrationResult {
  success: boolean;
  error?: string;
  participantCreated?: boolean;
}

const getAppwriteAdmin = (): Databases | null => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!endpoint || !projectId || !apiKey) return null;

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return new Databases(client);
};

const getMailtrapClient = () => {
  const token = process.env.MAILTRAP_TOKEN;
  if (!token) return null;
  return new MailtrapClient({ token });
};

const generateSlugFromName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

export async function approveRegistration(
  args: ApproveRegistrationArgs
): Promise<ApproveRegistrationResult> {
  const { registrationId, status, registration } = args;

  const databases = getAppwriteAdmin();
  if (!databases) {
    return { success: false, error: 'Appwrite admin client not configured' };
  }

  const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
  const REG_COLLECTION_ID =
    process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID || 'tournament_registrations';
  const PART_COLLECTION_ID =
    process.env.NEXT_PUBLIC_APPWRITE_PARTICIPANTS_COLLECTION_ID || 'participants';
  const TOURNAMENTS_COLLECTION_ID =
    process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID || 'tournaments';

  // Derive tournamentSlug - fetch from tournament if not provided
  let tournamentSlug = args.tournamentSlug;
  if (!tournamentSlug && registration.tournamentId) {
    try {
      const tournament = await databases.getDocument(
        DB_ID,
        TOURNAMENTS_COLLECTION_ID,
        registration.tournamentId
      );
      tournamentSlug =
        tournament.slug || (tournament.gameName ? generateSlugFromName(tournament.gameName) : null);
      console.log(`🔍 Derived tournamentSlug="${tournamentSlug}" from tournament ${registration.tournamentId}`);
    } catch (tournamentError) {
      console.error(`❌ Could not fetch tournament ${registration.tournamentId} to derive slug:`, tournamentError);
    }
  }

  // 1. Update Registration Status
  try {
    await databases.updateDocument(DB_ID, REG_COLLECTION_ID, registrationId, { status });
  } catch (error) {
    console.error('Error updating registration status:', error);
    return { success: false, error: 'Failed to update registration status' };
  }

  // 2. If approved, create participant
  let participantCreated = false;
  if (status === 'approved') {
    try {
      // Parse team data if it's a string
      let teamData = registration.players;
      if (typeof teamData === 'string') {
        try {
          teamData = JSON.parse(teamData);
        } catch {
          teamData = { players: [], substitutes: [] };
        }
      }

      const totalMembers =
        ((teamData as { players?: unknown[]; substitutes?: unknown[] })?.players?.length || 0) +
        ((teamData as { players?: unknown[]; substitutes?: unknown[] })?.substitutes?.length || 0) +
        1; // +1 for captain

      await databases.createDocument(
        DB_ID,
        PART_COLLECTION_ID,
        registrationId, // Use same ID to prevent duplicates
        {
          tournamentSlug: tournamentSlug || 'unknown',
          teamName: registration.teamName || registration.playerName,
          teamLeader: registration.playerName,
          teamLeaderEmail: registration.email,
          teamLeaderPhone: registration.phone || '',
          university: registration.university || '',
          members:
            typeof registration.players === 'string'
              ? registration.players
              : JSON.stringify(registration.players || []),
          registrationDate: registration.registrationDate || new Date().toISOString(),
          status: 'approved',
          paymentStatus: 'pending',
          totalMembers,
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.update(Role.team('admins')),
          Permission.delete(Role.users()),
          Permission.delete(Role.team('admins')),
        ]
      );
      participantCreated = true;
      console.log(`✅ Participant created for ${registrationId}`);
    } catch (partError) {
      const code = (partError as { code?: number })?.code;
      if (code !== 409) {
        console.error('Error creating participant:', partError);
      } else {
        console.log('Participant already exists, skipping creation.');
      }
    }

    // 3. Send Email Notification
    const mailClient = getMailtrapClient();
    if (mailClient && registration.email) {
      const senderEmail = process.env.MAILTRAP_SENDER_EMAIL || 'no-reply@tunzaesports.com';
      const title = args.tournamentTitle || 'Tournament';
      try {
        await mailClient.send({
          from: { email: senderEmail, name: 'KVE' },
          to: [{ email: registration.email }],
          subject: `Registration Approved - ${title}`,
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                  <div style="background-color: #961c18; padding: 20px; text-align: center;">
                      <h1 style="color: white; margin: 0;">Registration Approved!</h1>
                  </div>
                  <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                      <p>Hi <strong>${registration.playerName}</strong>,</p>
                      <p>Congratulations! Your registration for <strong>${title}</strong> has been approved.</p>
                      <p>You can now see your team listed in the tournament participants page.</p>

                      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
                          <p style="margin: 0;"><strong>Tournament:</strong> ${title}</p>
                          <p style="margin: 5px 0 0 0;"><strong>Team:</strong> ${registration.teamName || registration.playerName}</p>
                          <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Approved</p>
                      </div>

                      <p>If you have any questions, feel free to contact us.</p>

                      <p>Best regards,<br/><strong>KVE Team</strong></p>
                  </div>
                  <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
                      <p>© ${new Date().getFullYear()} KVE. All rights reserved.</p>
                  </div>
              </div>
          `,
        });
        console.log(`📧 Approval email sent to ${registration.email}`);
      } catch (mailError) {
        console.error('❌ Error sending approval email:', mailError);
      }
    } else {
      if (!mailClient) {
        console.warn('⚠️ Mailtrap client not initialized. Check MAILTRAP_TOKEN environment variable.');
      }
      if (!registration.email) {
        console.warn(`⚠️ No email address found for registration ${registrationId}. Skipping email notification.`);
      }
    }
  }

  return { success: true, participantCreated };
}
