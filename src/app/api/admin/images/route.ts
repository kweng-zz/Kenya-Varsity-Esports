import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';
import { verifyAdminAuth } from '@/lib/middleware/admin-auth';

export const dynamic = 'force-dynamic';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif']);

/**
 * Recursively collect images bundled in public/ (up to `depth` nested levels),
 * returned as web paths, e.g. /images/Efootball.png or /images/images/Chess.png.
 */
async function collectImages(dir: string, urlPrefix: string, depth: number): Promise<string[]> {
  let images: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const url = `${urlPrefix}/${entry.name}`;
      if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        images.push(url);
      } else if (entry.isDirectory() && depth > 0) {
        images = images.concat(await collectImages(path.join(dir, entry.name), url, depth - 1));
      }
    }
  } catch {
    // Directory missing or unreadable - treat as no images
  }
  return images;
}

/**
 * GET /api/admin/images
 * Lists local images available under public/images so admin forms can offer
 * them as autocomplete options (e.g. /images/Efootball.png).
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const images = await collectImages(imagesDir, '/images', 1);
  images.sort((a, b) => a.localeCompare(b));

  return NextResponse.json({ success: true, data: images });
}
