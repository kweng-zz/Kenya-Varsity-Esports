// src/lib/startup.ts
/**
 * Application startup initialization
 * Handles WebSocket server initialization and other startup tasks
 */

import { ensureWebSocketInitialized } from './websocket-init';

// Initialize on module load
let initializationPromise: Promise<void> | null = null;

export async function initializeApp() {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = performInitialization();
  return initializationPromise;
}

async function performInitialization() {
  console.log('🚀 Starting application initialization...');
  
  try {
    // Initialize WebSocket server
    await ensureWebSocketInitialized();
    console.log('✅ WebSocket initialization completed');
    
    // Add other startup tasks here
    // - Cache warmup
    // - Database health checks
    // - Background tasks
    
    console.log('✅ Application initialization completed');
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
  }
}

// Auto-initialize after a short delay to ensure server is ready
if (typeof window === 'undefined') {
  setTimeout(() => {
    initializeApp().catch(console.error);
  }, 2000);
}

export { initializationPromise };