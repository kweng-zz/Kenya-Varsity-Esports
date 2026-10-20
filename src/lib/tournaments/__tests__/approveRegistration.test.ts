import { describe, it, expect, mock, beforeEach } from 'bun:test';

const storedRegistration = {
  $id: 'registration-1',
  tournamentId: 'tournament-1',
  playerName: 'Legacy Player',
  email: 'player@example.com',
  userId: 'user-1',
  status: 'registered',
  players: JSON.stringify({ players: [], substitutes: [] }),
  registrationDate: '2026-10-15T00:00:00.000Z',
};

const mockGetDocument = mock(() => Promise.resolve(storedRegistration));
const mockUpdateDocument = mock(() => Promise.resolve({}));
const mockCreateDocument = mock(() => Promise.resolve({}));
const mockGetTicketPurchaseRequirement = mock(() =>
  Promise.resolve({
    requiresTicket: true,
    hasPaidTicket: false,
    hasPendingPurchase: false,
  })
);

mock.module('node-appwrite', () => ({
  Client: class {
    setEndpoint() {
      return this;
    }
    setProject() {
      return this;
    }
    setKey() {
      return this;
    }
  },
  Databases: class {
    getDocument(...args: unknown[]) {
      return mockGetDocument(...(args as []));
    }
    updateDocument(...args: unknown[]) {
      return mockUpdateDocument(...(args as []));
    }
    createDocument(...args: unknown[]) {
      return mockCreateDocument(...(args as []));
    }
  },
  Permission: {
    read: () => '',
    update: () => '',
    delete: () => '',
  },
  Role: {
    any: () => '',
    users: () => '',
    team: () => '',
  },
}));

mock.module('mailtrap', () => ({
  MailtrapClient: class {},
}));

mock.module('@/lib/tickets', () => ({
  ticketService: {
    getTicketPurchaseRequirement: mockGetTicketPurchaseRequirement,
  },
}));

const { approveRegistration } = await import('../approveRegistration');

describe('approveRegistration ticket enforcement', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT = 'https://example.com/v1';
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID = 'test-project';
    process.env.APPWRITE_API_KEY = 'test-key';
    process.env.NEXT_PUBLIC_APPWRITE_DB_ID = 'test-db';
    delete process.env.MAILTRAP_TOKEN;

    mockGetDocument.mockClear();
    mockGetDocument.mockImplementation(() => Promise.resolve(storedRegistration));
    mockUpdateDocument.mockClear();
    mockCreateDocument.mockClear();
    mockGetTicketPurchaseRequirement.mockClear();
    mockGetTicketPurchaseRequirement.mockImplementation(() =>
      Promise.resolve({
        requiresTicket: true,
        hasPaidTicket: false,
        hasPendingPurchase: false,
      })
    );
  });

  const approve = () =>
    approveRegistration({
      registrationId: 'registration-1',
      status: 'approved',
      // Deliberately omit ticket identity fields; the stored registration
      // must be used instead.
      registration: { tournamentId: 'tournament-1' },
      tournamentTitle: 'Test Tournament',
      tournamentSlug: 'test-tournament',
    });

  it('blocks approval when there is no paid ticket', async () => {
    const result = await approve();

    expect(result.success).toBe(false);
    expect(result.code).toBe('TICKET_REQUIRED');
    expect(mockUpdateDocument).not.toHaveBeenCalled();
    expect(mockGetTicketPurchaseRequirement).toHaveBeenCalledWith('tournament-1', {
      email: 'player@example.com',
      userId: 'user-1',
    });
  });

  it('fails closed when the ticket check itself fails', async () => {
    mockGetTicketPurchaseRequirement.mockImplementation(() =>
      Promise.resolve({
        requiresTicket: false,
        hasPaidTicket: false,
        hasPendingPurchase: false,
        checkFailed: true,
      })
    );

    const result = await approve();

    expect(result.success).toBe(false);
    expect(result.code).toBe('TICKET_CHECK_FAILED');
    expect(mockUpdateDocument).not.toHaveBeenCalled();
  });

  it('approves when the stored registration has a paid ticket', async () => {
    mockGetTicketPurchaseRequirement.mockImplementation(() =>
      Promise.resolve({
        requiresTicket: true,
        hasPaidTicket: true,
        hasPendingPurchase: false,
      })
    );

    const result = await approve();

    expect(result.success).toBe(true);
    expect(result.participantCreated).toBe(true);
    expect(mockUpdateDocument).toHaveBeenCalledWith(
      'test-db',
      'tournament_registrations',
      'registration-1',
      { status: 'approved' }
    );
  });

  it('does not require a ticket for free events', async () => {
    mockGetTicketPurchaseRequirement.mockImplementation(() =>
      Promise.resolve({
        requiresTicket: false,
        hasPaidTicket: false,
        hasPendingPurchase: false,
      })
    );

    const result = await approve();

    expect(result.success).toBe(true);
    expect(mockUpdateDocument).toHaveBeenCalled();
  });
});
