#!/usr/bin/env node
/**
 * Register a web platform (hostname) with the Appwrite project so that
 * browser requests from that origin pass Appwrite's CORS checks.
 *
 * Usage:
 *   node scripts/add-appwrite-platform.js <hostname> [display name]
 *
 * Example:
 *   node scripts/add-appwrite-platform.js appeals-greatest-permit-champion.trycloudflare.com "Cloudflare tunnel (dev)"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load env from the project root (prefer .env.local, fall back to .env)
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const file of ['.env.local', '.env']) {
  const fullPath = path.join(projectRoot, file);
  if (fs.existsSync(fullPath) && typeof process.loadEnvFile === 'function') {
    try { process.loadEnvFile(fullPath); } catch { /* ignore */ }
  }
}

const hostname = process.argv[2];
const displayName = process.argv[3] || `Tunnel: ${hostname}`;

if (!hostname) {
  console.error('Usage: node scripts/add-appwrite-platform.js <hostname> [display name]');
  process.exit(1);
}

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

if (!PROJECT_ID || !API_KEY) {
  console.error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID or APPWRITE_API_KEY in env');
  process.exit(1);
}

const headers = {
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
  'Content-Type': 'application/json',
};

async function main() {
  console.log(`Project:  ${PROJECT_ID}`);
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Hostname: ${hostname}\n`);

  // Check for an existing platform (best effort - requires platforms.read scope)
  let existing = null;
  const listRes = await fetch(`${ENDPOINT}/projects/${PROJECT_ID}/platforms`, { headers });
  const listBody = await listRes.json().catch(() => ({}));
  if (listRes.ok) {
    const platforms = listBody.platforms || [];
    existing = platforms.find(p => p.type === 'web' && p.hostname === hostname) || null;
  } else {
    console.log(`Note: cannot list platforms (${listRes.status}: ${listBody.message || 'unknown'}). Trying to create directly...\n`);
  }

  if (existing) {
    console.log(`Already registered as platform ${existing.$id} (${existing.name})`);
  } else {
    // platformId max length is 36 chars; keep it short and unique
    const platformId = `tunnel-${Date.now().toString(36)}`;
    const createRes = await fetch(`${ENDPOINT}/projects/${PROJECT_ID}/platforms`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        platformId,
        type: 'web',
        name: displayName,
        hostname,
      }),
    });
    const createBody = await createRes.json().catch(() => ({}));
    if (createRes.ok) {
      console.log(`Registered: ${createBody.name} -> ${createBody.hostname} (${createBody.$id})`);
    } else if (createRes.status === 409) {
      console.log('Platform already exists (conflict) - OK');
    } else {
      throw new Error(`Failed to create platform (${createRes.status}): ${createBody.message || JSON.stringify(createBody)}`);
    }
  }

  // Verify CORS with a real request - the OPTIONS preflight alone is misleading
  // because Appwrite omits the allow-origin header on actual requests from
  // unregistered origins.
  const probe = await fetch(`${ENDPOINT}/account`, {
    headers: {
      'Origin': `https://${hostname}`,
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Response-Format': '1.6.0',
    },
  });
  const allowOrigin = probe.headers.get('access-control-allow-origin');
  console.log(`\nCORS check (real request) for https://${hostname}: status ${probe.status}`);
  console.log(`access-control-allow-origin: ${allowOrigin || '(none)'}`);

  if (allowOrigin && (allowOrigin === `https://${hostname}` || allowOrigin === '*')) {
    console.log('CORS OK - browser requests from this origin will work');
  } else {
    console.log('CORS NOT confirmed yet - platform changes can take a minute to propagate');
  }
}

main().catch(error => {
  console.error(`\nError: ${error.message}`);
  console.log('\nIf this is a permissions error, add the platform manually:');
  console.log(`  Appwrite Console -> Settings -> Platforms -> Add Web platform -> ${hostname}`);
  process.exit(1);
});
