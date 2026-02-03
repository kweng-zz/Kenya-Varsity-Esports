import { NextRequest, NextResponse } from 'next/server';

// Security headers for production
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// Content Security Policy
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://www.googletagmanager.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://embed.tawk.to https://*.tawk.to",
  "font-src 'self' https://fonts.gstatic.com https://embed.tawk.to https://*.tawk.to",
  "img-src 'self' data: https: blob: https://*.tawk.to https://images.ctfassets.net https://www.google-analytics.com https://www.googletagmanager.com",
  "connect-src 'self' https://*.tawk.to wss://*.tawk.to https://cdn.contentful.com https://api.appwrite.io https://fra.cloud.appwrite.io https://cloud.appwrite.io https://related-mosquito-42593.upstash.io https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src 'self' https://*.tawk.to https://vercel.live",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ');

/**
 * Adds security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set('Content-Security-Policy', CSP_DIRECTIVES);
  return response;
}

/**
 * Validates CSRF token for state-changing operations
 */
export function validateCSRFToken(request: NextRequest): boolean {
  // Only validate for state-changing methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }

  const token = request.headers.get('x-csrf-token');
  const sessionToken = request.cookies.get('csrf-token')?.value;
  
  // Allow requests with proper CSRF token or from same origin
  return token === sessionToken || isSameOrigin(request);
}

/**
 * Checks if request is from same origin
 */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  const referer = request.headers.get('referer');
  
  if (!origin && !referer) return true;
  
  const allowedOrigins = [
    `http://${host}`,
    `https://${host}`,
    ...(process.env.NODE_ENV === 'development' ? [`http://localhost:3000`, `http://localhost:3001`] : [])
  ];
  
  if (origin && allowedOrigins.includes(origin)) return true;
  
  if (referer && allowedOrigins.some(allowed => referer.startsWith(allowed))) return true;
  
  return false;
}

/**
 * Rate limiting for sensitive operations
 */
const SENSITIVE_OPERATIONS = new Map([
  ['/api/articles/[id]/likes', { limit: 5, windowMs: 60 * 1000 }],
  ['/api/articles/[id]/bookmarks', { limit: 10, windowMs: 60 * 1000 }],
  ['/api/contact', { limit: 3, windowMs: 60 * 1000 }],
  ['/api/newsletter/subscribe', { limit: 2, windowMs: 60 * 1000 }],
]);

export function getSensitiveRateLimit(pathname: string) {
  for (const [pattern, config] of SENSITIVE_OPERATIONS) {
    if (pathname.includes(pattern.replace('[id]', ''))) {
      return config;
    }
  }
  return null;
}

/**
 * Input sanitization for common attack vectors
 */
export function sanitizeInput(input: any): any {
  if (typeof input !== 'object' || input === null) {
    return sanitizeValue(input);
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeValue);
  }
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(input)) {
    // Remove potential prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    
    sanitized[key] = sanitizeValue(value);
  }
  
  return sanitized;
}

function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    return value
      .trim()
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .replace(/javascript:/gi, '') // Remove JavaScript URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .substring(0, 10000); // Limit length
  }
  
  return value;
}

/**
 * IP-based rate limiting for abuse prevention
 */
const IP_BLOCK_LIST = new Set();
const IP_SUSPICIOUS_ACTIVITY = new Map<string, { count: number; lastSeen: number }>();

export function isIPBlocked(ip: string): boolean {
  return IP_BLOCK_LIST.has(ip);
}

export function trackSuspiciousActivity(ip: string): void {
  const now = Date.now();
  const activity = IP_SUSPICIOUS_ACTIVITY.get(ip) || { count: 0, lastSeen: now };
  
  activity.count++;
  activity.lastSeen = now;
  
  // Block IPs with too many failed attempts
  if (activity.count > 50) {
    IP_BLOCK_LIST.add(ip);
    console.warn(`IP ${ip} blocked due to suspicious activity`);
  }
  
  // Reset counter after 1 hour
  if (now - activity.lastSeen > 60 * 60 * 1000) {
    activity.count = 0;
  }
  
  IP_SUSPICIOUS_ACTIVITY.set(ip, activity);
}

/**
 * SQL Injection detection
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    /(\/\*.*\*\/|--)/i,
    /(\b(or|and)\s+\d+\s*=\s*\d+)/i,
    /(\b(or|and)\s+['"]?['"]?\w+['"]?\s*=\s*['"]?['"]?\w+['"]?)/i,
    /(;|'|--|\*|\/)/i,
    /(\b(exec|sp_|xp_|sys)\w*\s*\()/i,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Middleware to apply all security measures
 */
export function securityMiddleware(request: NextRequest) {
  // Check if IP is blocked
  const clientIP = getClientIP(request);
  if (isIPBlocked(clientIP)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Validate CSRF for state-changing operations
  if (!validateCSRFToken(request)) {
    return new NextResponse('Invalid CSRF token', { status: 403 });
  }
  
  return null;
}

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return '127.0.0.1';
}