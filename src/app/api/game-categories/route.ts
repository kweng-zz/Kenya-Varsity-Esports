import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('Admin game categories API called');
        
        return NextResponse.json({
            success: true,
            data: [
                {
                    id: "pubgm",
                    name: "PUBG Mobile",
                    title: "PUBGM RANKINGS",
                    description: "Current standings for PUBGM tournament",
                    image: "/images/PUBGM.jpeg",
                    isActive: true,
                    type: "main",
                    order: 1
                },
                {
                    id: "codm",
                    name: "Call of Duty Mobile",
                    title: "CODM RANKINGS", 
                    description: "Current standings for CODM tournament",
                    image: "/images/CODM-BR.png",
                    isActive: true,
                    type: "main",
                    order: 2
                },
                {
                    id: "efootball",
                    name: "eFootball Mobile",
                    title: "EFOOTBALL RANKINGS",
                    description: "Current standings for eFootball tournament",
                    image: "/images/EFootball-Mobile.png",
                    isActive: true,
                    type: "main",
                    order: 3
                }
            ],
            message: 'Using fallback game categories data'
        });

    } catch (error) {
        console.error('Admin game categories API error:', error);
        return NextResponse.json({
            success: true,
            data: [],
            message: 'Using fallback data due to error'
        });
    }
}