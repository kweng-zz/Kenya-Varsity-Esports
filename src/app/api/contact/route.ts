import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID, COLLECTIONS, handleAppwriteError, handleAppwriteSuccess } from '@/lib/appwrite';

// Check if we should use fallback mode
const useFallbackMode = () => {
    return process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true';
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, message, type = 'general' } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for contact API - message received:', {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                message: message.trim(),
                type
            });
            
            return NextResponse.json(
                handleAppwriteSuccess(
                    { id: 'demo-' + Date.now() },
                    'Message sent successfully! We will get back to you soon.'
                )
            );
        }

        // Create contact message document - use native ID generation
        const contactMessage = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.CONTACT_MESSAGES,
            'unique()', // Let Appwrite generate the ID
            {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                message: message.trim(),
                type,
                status: 'unread',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );

        return NextResponse.json(
            handleAppwriteSuccess(
                { id: contactMessage.$id },
                'Message sent successfully! We will get back to you soon.'
            )
        );

    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json(handleAppwriteError(error), { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Use fallback mode if enabled
        if (useFallbackMode()) {
            console.log('Using fallback mode for contact GET API');
            return NextResponse.json(
                handleAppwriteSuccess([
                    {
                        id: 'demo-1',
                        name: 'John Doe',
                        email: 'john@example.com',
                        message: 'This is a demo message',
                        type: 'general',
                        status: 'unread',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ])
            );
        }

        // Build queries manually instead of using Query import
        const queries: string[] = [];
        
        // Add ordering
        queries.push('orderDesc("createdAt")');
        
        // Add limit
        queries.push(`limit(${limit})`);
        
        // Add status filter if provided
        if (status) {
            queries.push(`equal("status", "${status}")`);
        }
        
        // Add type filter if provided
        if (type) {
            queries.push(`equal("type", "${type}")`);
        }

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.CONTACT_MESSAGES,
            queries
        );

        const messages = response.documents.map((doc: any) => ({
            id: doc.$id,
            name: doc.name,
            email: doc.email,
            message: doc.message,
            type: doc.type,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        }));

        return NextResponse.json(handleAppwriteSuccess(messages));

    } catch (error) {
        console.error('Get contact messages API error:', error);
        return NextResponse.json(handleAppwriteError(error), { status: 500 });
    }
}