import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('Admin sponsors API called');
        
        return NextResponse.json({
            success: true,
            data: [
                {
                    id: "1",
                    name: "Sample Sponsor",
                    logo: "/images/sponsor-placeholder.png",
                    website: "https://example.com",
                    isActive: true
                }
            ],
            message: 'Using fallback sponsors data'
        });

    } catch (error) {
        console.error('Admin sponsors API error:', error);
        return NextResponse.json({
            success: true,
            data: [],
            message: 'Using fallback data due to error'
        });
    }
}