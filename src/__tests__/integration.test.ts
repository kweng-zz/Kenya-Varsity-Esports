import { test, expect, describe } from 'bun:test';

describe('Blog Ecosystem Integration Tests', () => {
  test('Bookmark API works correctly', async () => {
    const validPayload = {
      articleId: 'test-article',
      userId: 'test-user'
    };

    const response = await fetch('http://localhost:3000/api/articles/test-article/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload)
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('bookmarked');
  });

  test('View tracking API works', async () => {
    const response = await fetch('http://localhost:3000/api/articles/test-article/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('viewCount');
  });

  test('Security blocks SQL injection', async () => {
    const maliciousPayload = {
      articleId: "test'; DROP TABLE users; --",
      userId: "test-user'; DELETE FROM article_likes; --"
    };

    const response = await fetch('http://localhost:3000/api/articles/test-article/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maliciousPayload)
    });

    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('SECURITY_VIOLATION');
  });

  test('Security blocks XSS attempts', async () => {
    const xssPayload = {
      articleId: 'test-article',
      userId: '<script>alert("xss")</script>'
    };

    const response = await fetch('http://localhost:3000/api/articles/test-article/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(xssPayload)
    });

    const data = await response.json();
    
    // Should reject the malicious input
    expect(response.status).toBe(400);
  });

  test('Rate limiting prevents abuse', async () => {
    // Make multiple rapid requests
    const promises = Array.from({ length: 15 }, (_, i) =>
      fetch('http://localhost:3000/api/articles/test-article/views', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': `test-bot-${i}` // Vary user agent to avoid simple IP blocking
        }
      })
    );

    const responses = await Promise.allSettled(promises);
    const rateLimitedCount = responses.filter(
      res => res.status === 'fulfilled' && res.value.status === 429
    ).length;
    
    // Some requests should be rate limited
    expect(rateLimitedCount).toBeGreaterThan(0);
  });

  test('Authentication integration maintains user context', async () => {
    // Test with authenticated user
    const authResponse = await fetch('http://localhost:3000/api/articles/test-article/bookmarks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': 'appwrite-session=valid-session-token'
      },
      body: JSON.stringify({ 
        articleId: 'test-article', 
        userId: 'authenticated-user' 
      })
    });

    const authData = await authResponse.json();
    
    // Should work for authenticated users
    expect(authResponse.status).toBe(200);
    expect(authData.success).toBe(true);
  });
});

describe('Production Readiness Tests', () => {
  test('Security headers are present', async () => {
    const response = await fetch('http://localhost:3000/api/articles/test-article/bookmarks');
    
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
  });

  test('CSP header prevents XSS', async () => {
    const response = await fetch('http://localhost:3000/api/articles/test-article/bookmarks');
    const csp = response.headers.get('Content-Security-Policy');
    
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
  });

  test('Input validation works correctly', async () => {
    const invalidPayload = {
      articleId: '', // Empty string should fail validation
      userId: 'a'.repeat(300) // Too long should fail validation
    };

    const response = await fetch('http://localhost:3000/api/articles/test-article/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload)
    });

    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
  });
});

// Performance test
test('API response times are acceptable', async () => {
  const startTime = Date.now();
  
  const response = await fetch('http://localhost:3000/api/articles/test-article/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articleId: 'test', userId: 'test' })
  });
  
  const responseTime = Date.now() - startTime;
  
  expect(response.status).toBe(200);
  expect(responseTime).toBeLessThan(1000); // Should respond in under 1 second
});