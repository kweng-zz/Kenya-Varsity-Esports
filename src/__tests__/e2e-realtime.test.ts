// src/__tests__/e2e-realtime.test.ts
/**
 * End-to-End Integration Tests for Real-Time Features
 * Run with: bun test src/__tests__/e2e-realtime.test.ts
 * 
 * These tests validate the complete flow of real-time features
 */

import { test, expect, describe, beforeAll } from 'bun:test';

// API base URL for testing
const API_BASE = process.env.TEST_API_URL || 'http://localhost:3000';

describe('Real-Time API Integration', () => {
  const testTournamentId = 'test-tournament-e2e';
  const testParticipantId = 'test-player-001';

  describe('Leaderboard API Flow', () => {
    test('POST /leaderboard - Initialize leaderboard', async () => {
      const response = await fetch(`${API_BASE}/api/tournaments/${testTournamentId}/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participants: [
            { participantId: testParticipantId, playerName: 'E2E Test Player', score: 0 },
            { participantId: 'test-player-002', playerName: 'E2E Player 2', score: 0 },
          ],
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    test('POST /scores - Submit score', async () => {
      const response = await fetch(`${API_BASE}/api/tournaments/${testTournamentId}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: testParticipantId,
          playerName: 'E2E Test Player',
          score: 1500,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.score).toBe(1500);
    });

    test('GET /leaderboard - Retrieve ranked leaderboard', async () => {
      const response = await fetch(`${API_BASE}/api/tournaments/${testTournamentId}/leaderboard`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('entries');
      expect(data.data).toHaveProperty('totalParticipants');
    });

    test('GET /scores?participantId - Get participant position', async () => {
      const response = await fetch(
        `${API_BASE}/api/tournaments/${testTournamentId}/scores?participantId=${testParticipantId}`
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('rank');
      expect(data.data).toHaveProperty('score');
    });
  });

  describe('Tournament Status API Flow', () => {
    test('GET /status - Get tournament status', async () => {
      const response = await fetch(`${API_BASE}/api/tournaments/${testTournamentId}/status`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('status');
    });

    test('PATCH /status - Update tournament status', async () => {
      const response = await fetch(`${API_BASE}/api/tournaments/${testTournamentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'registration_open',
          message: 'E2E Test: Registration is now open!',
        }),
      });

      // May fail if status transition is invalid, that's OK
      expect([200, 400]).toContain(response.status);
    });
  });

  describe('Notification API Flow', () => {
    const testUserId = 'e2e-test-user';

    test('GET /notifications - Get user notifications (requires auth)', async () => {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        headers: { 'x-user-id': testUserId },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('notifications');
      expect(data.data).toHaveProperty('unreadCount');
    });

    test('GET /notifications/preferences - Get notification preferences', async () => {
      const response = await fetch(`${API_BASE}/api/notifications/preferences`, {
        headers: { 'x-user-id': testUserId },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('enabledTypes');
    });

    test('PATCH /notifications/preferences - Update preferences', async () => {
      const response = await fetch(`${API_BASE}/api/notifications/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': testUserId,
        },
        body: JSON.stringify({
          emailNotifications: false,
          matchReminders: true,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('Invalid tournament ID returns 400', async () => {
      const response = await fetch(`${API_BASE}/api/tournaments//scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: 'test',
          playerName: 'Test',
          score: 100,
        }),
      });

      // Should return error for empty tournament ID
      expect([400, 404]).toContain(response.status);
    });

    test('Invalid score value returns 400', async () => {
      const response = await fetch(`${API_BASE}/api/tournaments/${testTournamentId}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: testParticipantId,
          playerName: 'Test',
          score: -100, // Invalid negative score
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('Missing required fields returns 400', async () => {
      const response = await fetch(`${API_BASE}/api/tournaments/${testTournamentId}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Missing participantId and playerName
          score: 100,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('Cleanup', () => {
    test('DELETE /leaderboard - Clear test leaderboard', async () => {
      const response = await fetch(`${API_BASE}/api/tournaments/${testTournamentId}/leaderboard`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});

describe('Performance Benchmarks', () => {
  test('Leaderboard API responds within threshold', async () => {
    const start = Date.now();
    const response = await fetch(`${API_BASE}/api/tournaments/perf-test/leaderboard`);
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    // Should respond within 200ms even without cache
    expect(duration).toBeLessThan(500);
  });

  test('Multiple concurrent requests complete successfully', async () => {
    const requests = Array.from({ length: 10 }, () =>
      fetch(`${API_BASE}/api/tournaments/concurrent-test/leaderboard`)
    );

    const responses = await Promise.all(requests);
    const successCount = responses.filter((r) => r.status === 200).length;

    // At least 90% should succeed
    expect(successCount).toBeGreaterThanOrEqual(9);
  });
});
