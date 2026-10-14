import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import { MailtrapClient } from 'mailtrap';

// Initialize Appwrite Admin Client
const getAppwriteAdmin = () => {
    const client = new Client();
    client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
        .setKey(process.env.APPWRITE_API_KEY || '');
    
    return {
        databases: new Databases(client)
    };
};

// Initialize Mailtrap client
const getMailtrapClient = () => {
    const token = process.env.MAILTRAP_TOKEN;
    if (!token) return null;
    return new MailtrapClient({ token });
};

// Helper function to generate slug from game name
const generateSlugFromName = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Replace multiple hyphens with single
        .trim();
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { registrationId, status, registration, tournamentTitle, tournamentSlug: providedSlug } = body;

        if (!registrationId || !status || !registration) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const appwrite = getAppwriteAdmin();
        const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
        const REG_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID!;
        const PART_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PARTICIPANTS_COLLECTION_ID || 'participants';
        const TOURNAMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID || 'tournaments';

        // Derive tournamentSlug - fetch from tournament if not provided
        let tournamentSlug = providedSlug;
        if (!tournamentSlug && registration.tournamentId) {
            try {
                const tournament = await appwrite.databases.getDocument(
                    DB_ID,
                    TOURNAMENTS_COLLECTION_ID,
                    registration.tournamentId
                );
                // Use slug from tournament, or derive from gameName
                tournamentSlug = tournament.slug || (tournament.gameName ? generateSlugFromName(tournament.gameName) : null);
                console.log(`🔍 Derived tournamentSlug="${tournamentSlug}" from tournament ${registration.tournamentId}`);
            } catch (tournamentError) {
                console.error(`❌ Could not fetch tournament ${registration.tournamentId} to derive slug:`, tournamentError);
            }
        }

        // 1. Update Registration Status
        await appwrite.databases.updateDocument(
            DB_ID,
            REG_COLLECTION_ID,
            registrationId,
            { status }
        );

        // 2. If approved, create participant
        if (status === 'approved') {
            try {
                // Parse team data if it's a string
                let teamData = registration.players;
                if (typeof teamData === 'string') {
                    try { teamData = JSON.parse(teamData); } catch (e) { teamData = { players: [], substitutes: [] }; }
                }

                const totalMembers = (teamData?.players?.length || 0) + (teamData?.substitutes?.length || 0) + 1; // +1 for captain

                await appwrite.databases.createDocument(
                    DB_ID,
                    PART_COLLECTION_ID,
                    registrationId, // Use same ID to prevent duplicates
                    {
                        tournamentSlug: tournamentSlug || 'unknown',
                        teamName: registration.teamName || registration.playerName,
                        teamLeader: registration.playerName,
                        teamLeaderEmail: registration.email,
                        teamLeaderPhone: registration.phone || '', // Check if phone exists in registration or add default
                        university: registration.university || '',
                        members: typeof registration.players === 'string' ? registration.players : JSON.stringify(registration.players || []),
                        registrationDate: registration.registrationDate || new Date().toISOString(),
                        status: 'approved',
                        paymentStatus: 'pending',
                        totalMembers: totalMembers
                    },
                    [
                        Permission.read(Role.any()),
                        Permission.update(Role.users()),
                        Permission.update(Role.team('admins')),
                        Permission.delete(Role.users()),
                        Permission.delete(Role.team('admins'))
                    ]
                );
                console.log(`✅ Participant created for ${registrationId}`);
            } catch (partError: any) {
                console.error('Error creating participant:', partError);
                // We check if it's a conflict (already exists) - if so, we might want to update it instead, 
                // but for now we essentially treat "already exists" as success or just log it.
                if (partError.code !== 409) {
                     console.error('Failed to create participant document');
                } else {
                     console.log('Participant already exists, skipping creation.');
                }
            }

            // 3. Send Email Notification
            const mailClient = getMailtrapClient();
            if (mailClient && registration.email) {
                const senderEmail = process.env.MAILTRAP_SENDER_EMAIL || 'no-reply@tunzaesports.com';
                try {
                    await mailClient.send({
                        from: { email: senderEmail, name: 'Tunza Esports' },
                        to: [{ email: registration.email }],
                        subject: `Registration Approved - ${tournamentTitle}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                                <div style="background-color: #961c18; padding: 20px; text-align: center;">
                                    <h1 style="color: white; margin: 0;">Registration Approved!</h1>
                                </div>
                                <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                                    <p>Hi <strong>${registration.playerName}</strong>,</p>
                                    <p>Congratulations! Your registration for <strong>${tournamentTitle}</strong> has been approved.</p>
                                    <p>You can now see your team listed in the tournament participants page.</p>
                                    
                                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
                                        <p style="margin: 0;"><strong>Tournament:</strong> ${tournamentTitle}</p>
                                        <p style="margin: 5px 0 0 0;"><strong>Team:</strong> ${registration.teamName || registration.playerName}</p>
                                        <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Approved</p>
                                    </div>

                                    <p>If you have any questions, feel free to contact us.</p>
                                    
                                    <p>Best regards,<br/><strong>Tunza Esports Team</strong></p>
                                </div>
                                <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
                                    <p>© ${new Date().getFullYear()} Tunza Esports. All rights reserved.</p>
                                </div>
                            </div>
                        `
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

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Approve Registration Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
