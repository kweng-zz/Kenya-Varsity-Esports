import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const EXTERNAL_EVENTS_COLLECTION = 'external_events';
const EVENT_TICKETS_COLLECTION = 'event_tickets';
const EVENT_TICKET_TYPES_COLLECTION = 'event_ticket_types';

async function createExternalEventWithTickets() {
  try {
    console.log('🚀 Creating external event with tickets...\n');

    // 1. Create the external event
    console.log('📅 Creating external event...');
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 30); // 30 days from now
    
    const externalEvent = await databases.createDocument(
      DB_ID,
      EXTERNAL_EVENTS_COLLECTION,
      ID.unique(),
      {
        title: 'Kuer Esports Championship 2025 - External Event',
        description: 'Join us for the biggest esports championship of the year! This external event features top teams competing across multiple game titles. Purchase your tickets now to secure your spot!',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=675&fit=crop',
        externalUrl: 'https://kuer.esports.com/championship-2025',
        eventDate: eventDate.toISOString(),
        venue: 'Nairobi Convention Center, Kenya',
        status: 'published',
        tags: ['esports', 'championship', 'gaming', 'tournament', 'external'],
        isFeatured: true,
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log(`✅ External event created: ${externalEvent.$id}`);
    console.log(`   Title: ${externalEvent.title}`);
    console.log(`   Date: ${externalEvent.eventDate}`);
    console.log(`   Venue: ${externalEvent.venue}`);

    // 2. Create the event ticket configuration
    console.log('\n🎫 Creating event ticket configuration...');
    const salesStartDate = new Date();
    salesStartDate.setDate(salesStartDate.getDate() - 1); // Sales started yesterday
    
    const salesEndDate = new Date(eventDate);
    salesEndDate.setDate(salesEndDate.getDate() - 1); // Sales end 1 day before event

    const eventTicket = await databases.createDocument(
      DB_ID,
      EVENT_TICKETS_COLLECTION,
      ID.unique(),
      {
        eventId: externalEvent.$id,
        eventTitle: externalEvent.title,
        eventSlug: 'kuer-esports-championship-2025',
        isActive: true,
        salesStartDate: salesStartDate.toISOString(),
        salesEndDate: salesEndDate.toISOString(),
        maxTicketsPerUser: 4,
        requiresApproval: false,
        currency: 'KES',
        taxRate: 16,
        serviceFee: 100,
        serviceFeeType: 'fixed',
        description: 'Tickets for the Kuer Esports Championship 2025. All tickets include access to the main event, gaming zones, and meet & greet sessions.',
        refundPolicy: 'Full refund available up to 7 days before the event. 50% refund 3-6 days before. No refunds within 48 hours of the event.',
        contactEmail: 'tickets@kuer.esports.com',
        totalSold: 0,
        totalRevenue: 0,
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.team('admins')),
        Permission.update(Role.team('admins')),
        Permission.delete(Role.team('admins')),
      ]
    );

    console.log(`✅ Event ticket config created: ${eventTicket.$id}`);
    console.log(`   Event ID: ${eventTicket.eventId}`);
    console.log(`   Currency: ${eventTicket.currency}`);
    console.log(`   Tax Rate: ${eventTicket.taxRate}%`);
    console.log(`   Service Fee: ${eventTicket.serviceFee} ${eventTicket.serviceFeeType}`);
    console.log(`   Sales: ${eventTicket.salesStartDate} to ${eventTicket.salesEndDate}`);

    // 3. Create ticket types
    console.log('\n🎟️ Creating ticket types...');
    
    const ticketTypes = [
      {
        name: 'Early Bird',
        description: 'Limited early bird pricing - get your tickets before they sell out!',
        price: 2500,
        originalPrice: 3500,
        quantityTotal: 100,
        quantitySold: 0,
        quantityReserved: 0,
        maxPerOrder: 2,
        minPerOrder: 1,
        sortOrder: 1,
        isActive: true,
        salesStartDate: salesStartDate.toISOString(),
        salesEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        benefits: [
          'Access to main championship event',
          'Early entry (30 mins before general)',
          'Exclusive Early Bird badge',
          'Digital event program',
        ],
        color: '#10b981',
        isFeatured: true,
      },
      {
        name: 'Regular',
        description: 'Standard admission to the championship event.',
        price: 3500,
        originalPrice: 3500,
        quantityTotal: 300,
        quantitySold: 0,
        quantityReserved: 0,
        maxPerOrder: 4,
        minPerOrder: 1,
        sortOrder: 2,
        isActive: true,
        salesStartDate: salesStartDate.toISOString(),
        salesEndDate: salesEndDate.toISOString(),
        benefits: [
          'Access to main championship event',
          'Gaming zone access',
          'Digital event program',
          'Meet & greet sessions',
        ],
        color: '#3b82f6',
        isFeatured: false,
      },
      {
        name: 'VIP',
        description: 'Premium experience with exclusive perks and priority access.',
        price: 7500,
        originalPrice: 9000,
        quantityTotal: 50,
        quantitySold: 0,
        quantityReserved: 0,
        maxPerOrder: 2,
        minPerOrder: 1,
        sortOrder: 3,
        isActive: true,
        salesStartDate: salesStartDate.toISOString(),
        salesEndDate: salesEndDate.toISOString(),
        benefits: [
          'All Regular benefits',
          'Priority seating at main stage',
          'VIP lounge access with refreshments',
          'Exclusive VIP merchandise pack',
          'Backstage tour & player meet & greet',
          'Priority parking',
          'Dedicated VIP support line',
        ],
        color: '#f59e0b',
        isFeatured: true,
      },
      {
        name: 'Student',
        description: 'Discounted tickets for students with valid ID.',
        price: 2000,
        originalPrice: 3500,
        quantityTotal: 100,
        quantitySold: 0,
        quantityReserved: 0,
        maxPerOrder: 2,
        minPerOrder: 1,
        sortOrder: 4,
        isActive: true,
        salesStartDate: salesStartDate.toISOString(),
        salesEndDate: salesEndDate.toISOString(),
        benefits: [
          'Access to main championship event',
          'Gaming zone access',
          'Digital event program',
          'Student verification required at entry',
        ],
        color: '#8b5cf6',
        isFeatured: false,
      },
    ];

    const createdTicketTypes = [];
    for (const ticketType of ticketTypes) {
      const created = await databases.createDocument(
        DB_ID,
        EVENT_TICKET_TYPES_COLLECTION,
        ID.unique(),
        {
          eventTicketId: eventTicket.$id,
          ...ticketType,
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.team('admins')),
          Permission.update(Role.team('admins')),
          Permission.delete(Role.team('admins')),
        ]
      );
      createdTicketTypes.push(created);
      console.log(`✅ Created ticket type: ${created.name} (${created.$id})`);
      console.log(`   Price: KES ${created.price} (was KES ${created.originalPrice})`);
      console.log(`   Available: ${created.quantityTotal}`);
      console.log(`   Featured: ${created.isFeatured}`);
    }

    console.log('\n🎉 Successfully created external event with ticket system!');
    console.log('\n📋 Summary:');
    console.log(`External Event ID: ${externalEvent.$id}`);
    console.log(`Event Ticket Config ID: ${eventTicket.$id}`);
    console.log(`Ticket Types Created: ${createdTicketTypes.length}`);
    console.log('\n🔗 View on events page: http://localhost:3000/events');
    console.log(`🔗 Event detail page: http://localhost:3000/events/${externalEvent.$id}`);
    console.log('\n💡 Users can now:');
    console.log('  1. View the event on the events page');
    console.log('  2. Click "Get Tickets" to purchase');
    console.log('  3. Select ticket type and quantity');
    console.log('  4. Pay via Stripe, M-Pesa, or Paystack');
    console.log('  5. Receive e-ticket via email after payment confirmation');

  } catch (error) {
    console.error('❌ Error creating external event with tickets:', error);
    process.exit(1);
  }
}

createExternalEventWithTickets();