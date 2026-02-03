// src/lib/realtime/index.ts
/**
 * Real-time module exports
 */

export * from './types';
export * from './websocket-client';
// export * from './tournament-subscription'; // Server-only, do not export to client

// Server exports should only be used server-side
// Server exports removed to prevent client-side bundling
// Import server functions directly from '@/lib/realtime/websocket-server'
