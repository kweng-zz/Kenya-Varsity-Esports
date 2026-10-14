#!/usr/bin/env node

import { Client, Databases, ID, Permission, Role, Query } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = new Client();
const databases = new Databases(client);

// Configure client
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'esports-db';
const TOURNAMENTS_COLLECTION_ID = 'tournaments';
const EVENT_TICKETS_COLLECTION = 'event_tickets';
const EVENT_TICKET_TYPES_COLLECTION = 'event_ticket_types';

const tournaments = [
    {
        // eFootball Mobile - Individual 1v1 - 200 KES per player
        slug: 'efootball-mobile',
        gameName: 'eFootball Mobile',
        title: 'eFootball Mobile | KVE 2026',
        description: 'Step onto the KVE stage and compete for the KSh 35,000 prize pool in our eFootball Mobile tournament. This is an individual 1v1 competition and all matches will be played physically at NIBS College, Ruiru Main Campus. Remote or online participation will not be permitted. Players must be physically present at the venue to compete.',
        detailedDescription: 'Step onto the KVE stage and compete for the KSh 35,000 prize pool in our eFootball Mobile tournament.\n\nThis is an individual 1v1 competition and all matches will be played physically at NIBS College, Ruiru Main Campus. Remote or online participation will not be permitted. Players must be physically present at the venue to compete.\n\nIf your institution pays your participation fee, any individual participation fee you have already paid will be refunded.\n\nDetailed eFootball Mobile tournament rules, match settings, format and other competition instructions will be shared with registered participants as the event approaches.\n\nRegister first to secure your place.',
        category: 'esports',
        status: 'published',
        tournamentStatus: 'registration_open',
        registrationDeadline: '2026-01-10T23:59:59.000Z',
        startDate: '2026-01-15T09:00:00.000Z',
        endDate: '2026-01-17T18:00:00.000Z',
        currency: 'KES',
        prizePool: 35000,
        showInEvents: true,
        isFeatured: true,
        featuredImageUrl: '/images/Efootball.png',
        bannerImageUrl: '/images/Efootball.png',
        ticketPrice: 200,
        ticketType: 'individual'
    },
    {
        // PUBG Mobile - Squad 4v4 - 800 KES whole team
        slug: 'pubg-mobile',
        gameName: 'PUBG Mobile',
        title: 'PUBG Mobile | KVE 2026',
        description: 'Squad up and compete for the KSh 30,000 prize pool in the KVE 2026 PUBG Mobile tournament. PUBG Mobile is a 4-player squad competition. Every registered team member must attend physically at NIBS College, Ruiru Main Campus. This is a fully physical tournament and no team or player will be allowed to compete online or remotely.',
        detailedDescription: 'Squad up and compete for the KSh 30,000 prize pool in the KVE 2026 PUBG Mobile tournament.\n\nPUBG Mobile is a 4-player squad competition. Every registered team member must attend physically at NIBS College, Ruiru Main Campus. This is a fully physical tournament and no team or player will be allowed to compete online or remotely.\n\nIf your institution pays your participation fee, any individual participation fee you have already paid will be refunded.\n\nSpecific PUBG Mobile rules, maps, scoring system, lobby procedures and tournament format will be communicated to registered teams closer to the event.\n\nSecure your squad\'s registration and wait for the official competition briefing.',
        category: 'esports',
        status: 'published',
        tournamentStatus: 'registration_open',
        registrationDeadline: '2026-01-17T23:59:59.000Z',
        startDate: '2026-01-22T09:00:00.000Z',
        endDate: '2026-01-24T18:00:00.000Z',
        currency: 'KES',
        prizePool: 30000,
        showInEvents: true,
        isFeatured: true,
        featuredImageUrl: '/images/PUBGM.png',
        bannerImageUrl: '/images/PUBGM.png',
        ticketPrice: 800,
        ticketType: 'team'
    },
    {
        // CODM Multiplayer 5v5 - 1000 KES whole team
        slug: 'codm-multiplayer',
        gameName: 'Call of Duty Mobile Multiplayer',
        title: 'CODM Multiplayer 5v5 | KVE 2026',
        description: 'Bring your squad and battle for the KSh 30,000 prize pool in Call of Duty Mobile Multiplayer at KVE 2026. CODM Multiplayer is a 5v5 team competition. All players must participate physically at NIBS College, Ruiru Main Campus. There will be no online or remote participation under any circumstances.',
        detailedDescription: 'Bring your squad and battle for the KSh 30,000 prize pool in Call of Duty Mobile Multiplayer at KVE 2026.\n\nCODM Multiplayer is a 5v5 team competition. All players must participate physically at NIBS College, Ruiru Main Campus. There will be no online or remote participation under any circumstances.\n\nIf your institution pays your participation fee, any individual participation fee you have already paid will be refunded.\n\nGame modes, maps, match format, competitive settings and complete CODM MP rules will be shared with registered teams as we approach the event.\n\nRegister your team to receive the official tournament information when released.',
        category: 'esports',
        status: 'published',
        tournamentStatus: 'registration_open',
        registrationDeadline: '2026-01-24T23:59:59.000Z',
        startDate: '2026-01-29T09:00:00.000Z',
        endDate: '2026-01-31T18:00:00.000Z',
        currency: 'KES',
        prizePool: 30000,
        showInEvents: true,
        isFeatured: true,
        featuredImageUrl: '/images/CODM MP.png',
        bannerImageUrl: '/images/CODM MP.png',
        ticketPrice: 1000,
        ticketType: 'team'
    },
    {
        // CODM 1v1 - 200 KES per player
        slug: 'codm-1v1',
        gameName: 'Call of Duty Mobile 1v1',
        title: 'CODM 1v1 | KVE 2026',
        description: 'No teammates to blame. Take on other players one-on-one for the KSh 15,000 prize pool in the KVE 2026 Call of Duty Mobile 1v1 tournament. This is an individual competition and every match will take place physically at NIBS College, Ruiru Main Campus. Players will not be permitted to compete online or remotely.',
        detailedDescription: 'No teammates to blame.\n\nTake on other players one-on-one for the KSh 15,000 prize pool in the KVE 2026 Call of Duty Mobile 1v1 tournament.\n\nThis is an individual competition and every match will take place physically at NIBS College, Ruiru Main Campus. Players will not be permitted to compete online or remotely.\n\nIf your institution pays your participation fee, any individual participation fee you have already paid will be refunded.\n\nThe official 1v1 rules, permitted settings, match format, maps and competition procedures will be sent to registered participants closer to the event.\n\nRegister now and prepare to prove yourself one-on-one.',
        category: 'esports',
        status: 'published',
        tournamentStatus: 'registration_open',
        registrationDeadline: '2026-01-31T23:59:59.000Z',
        startDate: '2026-02-05T09:00:00.000Z',
        endDate: '2026-02-07T18:00:00.000Z',
        currency: 'KES',
        prizePool: 15000,
        showInEvents: true,
        isFeatured: true,
        featuredImageUrl: '/images/CODM 1v1.png',
        bannerImageUrl: '/images/CODM 1v1.png',
        ticketPrice: 200,
        ticketType: 'individual'
    }
];

// Use only Role.any() as the error says "Permissions must be one of: (any, guests)"
const TOURNAMENT_PERMISSIONS = [
    Permission.read(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any())
];

const TICKET_PERMISSIONS = [
    Permission.read(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any())
];

async function createTournaments() {
    try {
        console.log('🚀 Creating KVE 2026 tournaments with ticket configurations...\n');

        // Check if API key is configured
        const apiKey = process.env.APPWRITE_API_KEY;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        
        if (!apiKey || apiKey === 'your_appwrite_api_key_here') {
            console.log('❌ Appwrite API key not configured!');
            console.log('Please update APPWRITE_API_KEY in your .env file');
            return;
        }
        
        if (!projectId || projectId === 'your_appwrite_project_id_here') {
            console.log('❌ Appwrite Project ID not configured!');
            console.log('Please update NEXT_PUBLIC_APPWRITE_PROJECT_ID in your .env file');
            return;
        }
        
        console.log(`📋 Using Project ID: ${projectId}`);
        console.log(`🔑 API Key configured: ${apiKey.substring(0, 10)}...`);
        console.log(`📦 Database ID: ${DATABASE_ID}`);
        console.log('');

        for (const tournament of tournaments) {
            try {
                console.log(`🎮 Creating tournament: ${tournament.title}`);
                
                // Check if tournament with this slug already exists
                const existing = await databases.listDocuments(
                    DATABASE_ID,
                    TOURNAMENTS_COLLECTION_ID,
                    [
                        Query.equal('slug', tournament.slug),
                        Query.limit(1)
                    ]
                );
                
                let tournamentId;
                
                // Build tournament data without ticketPrice/ticketType (those are for ticket config)
                const { ticketPrice, ticketType, ...tournamentData } = tournament;
                
                if (existing.documents.length > 0) {
                    console.log(`  ⚠️ Tournament "${tournament.title}" (slug: ${tournament.slug}) already exists, updating...`);
                    tournamentId = existing.documents[0].$id;
                    
                    const updated = await databases.updateDocument(
                        DATABASE_ID,
                        TOURNAMENTS_COLLECTION_ID,
                        tournamentId,
                        tournamentData,
                        TOURNAMENT_PERMISSIONS
                    );
                    console.log(`  ✅ Updated: ${updated.title} (ID: ${updated.$id})`);
                } else {
                    const result = await databases.createDocument(
                        DATABASE_ID,
                        TOURNAMENTS_COLLECTION_ID,
                        ID.unique(),
                        tournamentData,
                        TOURNAMENT_PERMISSIONS
                    );
                    tournamentId = result.$id;
                    console.log(`  ✅ Created: ${result.title} (ID: ${result.$id})`);
                }
                
                console.log(`     Slug: ${tournament.slug}`);
                console.log(`     Prize Pool: ${tournament.currency} ${tournament.prizePool?.toLocaleString()}`);
                console.log(`     Ticket: ${ticketPrice} KES (${ticketType})`);
                console.log('');

                // Create ticket configuration for this tournament
                await createTicketConfiguration(tournamentId, tournament.title, ticketPrice, ticketType, tournament.currency);
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1500));
                
            } catch (error) {
                console.error(`  ❌ Error creating tournament "${tournament.title}":`, error.message);
            }
        }

        console.log('🎉 KVE 2026 tournaments with ticket configurations created successfully!');
        console.log('\n📋 Summary:');
        tournaments.forEach((t, i) => {
            console.log(`${i + 1}. ${t.title} - ${t.currency} ${t.prizePool?.toLocaleString()} - ${t.ticketPrice} KES (${t.ticketType})`);
        });

    } catch (error) {
        console.error('❌ Tournament creation failed:', error);
        process.exit(1);
    }
}

async function createTicketConfiguration(tournamentId, eventTitle, ticketPrice, ticketType, currency) {
    try {
        console.log(`  🎫 Creating ticket configuration for ${eventTitle}...`);
        
        // Check if ticket config already exists for this tournament
        const existingTicket = await databases.listDocuments(
            DATABASE_ID,
            EVENT_TICKETS_COLLECTION,
            [
                Query.equal('eventId', tournamentId),
                Query.limit(1)
            ]
        );
        
        let eventTicketId;
        
        if (existingTicket.documents.length > 0) {
            console.log(`     ⚠️ Ticket config already exists, skipping...`);
            eventTicketId = existingTicket.documents[0].$id;
            return;
        }

        const eventSlug = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Create event_tickets document
        const eventTicketResponse = await databases.createDocument(
            DATABASE_ID,
            EVENT_TICKETS_COLLECTION,
            ID.unique(),
            {
                eventId: tournamentId,
                eventTitle: eventTitle,
                eventSlug: eventSlug,
                isActive: true,
                maxTicketsPerUser: ticketType === 'team' ? 1 : 2,
                currency: currency,
                taxRate: 0,
                serviceFee: 0,
                serviceFeeType: 'fixed',
                description: `Ticket for ${eventTitle}`,
                totalSold: 0,
                totalRevenue: 0,
            },
            TICKET_PERMISSIONS
        );
        
        eventTicketId = eventTicketResponse.$id;
        console.log(`     ✅ Created ticket config (ID: ${eventTicketId})`);

        // Create ticket type based on tournament type
        const ticketTypeName = ticketType === 'team' ? 'Team Registration' : 'Individual Registration';
        const quantityTotal = ticketType === 'team' ? 25 : 64;

        await databases.createDocument(
            DATABASE_ID,
            EVENT_TICKET_TYPES_COLLECTION,
            ID.unique(),
            {
                eventTicketId: eventTicketId,
                name: ticketTypeName,
                description: `${ticketType === 'team' ? 'Per team/squad' : 'Per player'} registration for ${eventTitle}`,
                price: ticketPrice,
                originalPrice: ticketPrice,
                quantityTotal: quantityTotal,
                quantitySold: 0,
                quantityReserved: 0,
                maxPerOrder: ticketType === 'team' ? 1 : 2,
                minPerOrder: 1,
                sortOrder: 0,
                isActive: true,
                benefits: [
                    `Entry to ${eventTitle}`,
                    'Physical tournament at NIBS College, Ruiru Main Campus'
                ],
                color: '#8c110d',
                isFeatured: true,
            },
            TICKET_PERMISSIONS
        );
        
        console.log(`     ✅ Created ticket type: ${ticketTypeName} - ${ticketPrice} KES`);
        console.log(`     Max orders: ${quantityTotal} ${ticketType === 'team' ? 'teams' : 'players'}`);
        
    } catch (error) {
        console.error(`     ❌ Error creating ticket config:`, error.message);
    }
}

// Run the creation
createTournaments();