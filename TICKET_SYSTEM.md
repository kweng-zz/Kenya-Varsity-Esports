# Event Ticket System

A standalone, integrable ticket system for events with payment integration support.

## Features

- **Multiple Ticket Types**: VIP, Regular, Early Bird, etc. with different pricing and benefits
- **Payment Integration**: Supports Stripe (cards), M-Pesa (Kenya mobile money), Paystack (Nigeria/Africa)
- **Inventory Management**: Track ticket availability, reservations, and sales
- **Purchase Flow**: Complete checkout with payment verification
- **Ticket Delivery**: QR codes, confirmation codes, PDF tickets (planned)
- **Admin Dashboard**: Manage events, ticket types, and view purchases

## Architecture

### Database Collections

1. **event_tickets** - Event-level ticket configuration
2. **event_ticket_types** - Individual ticket tiers (VIP, Regular, etc.)
3. **event_ticket_purchases** - User purchases with payment tracking

### API Routes

- `GET /api/events/[eventId]/tickets` - Get ticket configuration for an event
- `POST /api/events/[eventId]/tickets/purchase` - Create a purchase
- `POST /api/events/[eventId]/tickets/verify` - Verify payment and update status
- `GET /api/events/[eventId]/tickets/purchases` - Get user's purchases
- `POST /api/payments/webhook` - Payment provider webhooks

### Components

- `PurchaseTicketButton` - Main button to trigger ticket purchase modal
- `TicketPurchaseModal` - Full purchase flow (select → payment → success)
- `TicketBadge` - Small badge for event cards
- `TicketTypeDisplay` - Display ticket types on event pages
- `TicketDetailPage` - View purchased tickets with QR codes

## Setup

### 1. Database Setup

Run the setup script to create collections:

```bash
npm run setup:event-tickets
```

### 2. Environment Variables

Add payment provider credentials to `.env`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_TEST_MODE=true

# M-Pesa (Kenya)
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=...
MPESA_PASSKEY=...
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/webhook?provider=mpesa
MPESA_ENVIRONMENT=sandbox

# Paystack (Nigeria/Africa)
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_CALLBACK_URL=https://yourdomain.com/api/payments/webhook?provider=paystack
PAYSTACK_TEST_MODE=true
```

### 3. Webhook Configuration

Configure webhooks in payment provider dashboards:

- **Stripe**: `https://yourdomain.com/api/payments/webhook?provider=stripe`
- **M-Pesa**: Use the callback URL from environment
- **Paystack**: `https://yourdomain.com/api/payments/webhook?provider=paystack`

## Usage

### Adding Tickets to an Event

1. Create an `event_tickets` document with event configuration
2. Create `event_ticket_types` documents for each tier
3. Set `isActive: true` and configure sale dates

### Displaying Ticket Button

```tsx
import { PurchaseTicketButton } from '@/components/events/tickets';

<PurchaseTicketButton
  eventId={event.$id}
  eventTitle={event.title}
  eventSlug={event.gameSlug}
  userId={user.$id}
  userEmail={user.email}
  userName={user.name}
  userPhone={user.phone}
/>
```

### Checking Ticket Availability

The events API automatically includes ticket info:
```json
{
  "hasTickets": true,
  "startingPrice": 5000,
  "currency": "KES"
}
```

## Payment Flow

1. User clicks "Get Tickets" button
2. Modal opens with ticket type selection
3. User selects quantity and proceeds to payment
4. System creates purchase record with `pending` status
5. Payment intent created with selected provider
6. User completes payment (redirect or in-modal)
7. Webhook verifies payment and updates status
8. Tickets generated with unique codes
9. User redirected to success page with ticket access

## Ticket Types Configuration

Each ticket type can have:
- **Name**: VIP, Regular, Early Bird, Student, etc.
- **Price**: Base price
- **Original Price**: For showing discounts
- **Quantity**: Total available
- **Benefits**: Array of included perks
- **Sale Dates**: When this type is available
- **Limits**: Min/max per order
- **Featured**: Highlight in UI
- **Color**: Custom theme color

## Security

- All purchases require authenticated user
- Payment verification via webhook signatures
- Tickets tied to user account
- QR codes unique per ticket
- Admin-only ticket management

## Extending

### Adding New Payment Provider

1. Create new provider class extending `BasePaymentProvider`
2. Implement required methods
3. Register in `PaymentProviderFactory`
4. Add environment variables

### Custom Ticket Fields

Add fields to `event_ticket_types` collection:
- Seat assignments
- Meal preferences
- Workshop selections
- Merchandise bundles

## Testing

Use test mode for all payment providers:
- Stripe: Test card numbers (4242 4242 4242 4242)
- M-Pesa: Sandbox phone numbers (254708374149)
- Paystack: Test card (4084 0840 8408 4081)

## Monitoring

Check purchase statuses in Appwrite console:
- `event_ticket_purchases` collection
- Filter by `paymentStatus` and `status`
- View revenue in `event_tickets` totals