import { NextRequest, NextResponse } from 'next/server';
import { approveRegistration } from '@/lib/tournaments/approveRegistration';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { registrationId, status, registration, tournamentTitle, tournamentSlug: providedSlug } = body;

        if (!registrationId || !status || !registration) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        if (status !== 'approved' && status !== 'rejected') {
            return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
        }

        const result = await approveRegistration({
            registrationId,
            status,
            registration,
            tournamentTitle,
            tournamentSlug: providedSlug,
        });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || 'Internal Server Error' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, participantCreated: result.participantCreated });
    } catch (error) {
        console.error('Approve Registration Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
