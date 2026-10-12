import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = '/home/tonny/Documents/work/apps/Kuer/public/uploads/blog';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'cover' or 'body'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Allowed: jpg, png, webp, gif' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File too large. Max 5MB' }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileExt = extname(file.name).toLowerCase();
    const baseName = file.name.replace(extname(file.name), ''); // strip original extension
    const safeName = baseName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
    // Map MIME type to exactly one extension
    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    const guaranteedExt = extMap[file.type] || '.png';
    const uniqueName = `${randomUUID()}_${safeName}${guaranteedExt}`;
    const filePath = join(UPLOAD_DIR, uniqueName);
    
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/blog/${uniqueName}`;
    const markdown = type === 'cover' ? '' : `![](${publicUrl})`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        markdown,
        filename: uniqueName,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}