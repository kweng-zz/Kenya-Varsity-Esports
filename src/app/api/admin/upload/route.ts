import { NextResponse } from 'next/server';
import { Client, Storage, ID, Databases } from 'node-appwrite';
import { getUserFromRequest } from '@/lib/auth-utils';
import { InputFile } from 'node-appwrite/file';
import { checkAdminAuth } from '@/lib/auth-check';

export const dynamic = 'force-dynamic';

// POST upload file (admin only)
export async function POST(request: Request) {
  // Check admin authentication
  const authError = await checkAdminAuth(request as any);
  if (authError) return authError;

  try {

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
    const profileCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID;

    if (!endpoint || !projectId || !apiKey || !dbId || !profileCollectionId) {
      return NextResponse.json({ success: false, error: 'Appwrite server configuration missing' }, { status: 500 });
    }

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const databases = new Databases(client);



    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketId = (formData.get('bucketId') as string) || 'season-images';

if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // File validation
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      }, { status: 400 });
    }

    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: `File size ${file.size} bytes exceeds maximum allowed size of ${maxSize} bytes (10MB)` 
      }, { status: 400 });
    }

    // Additional filename validation
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ 
        success: false, 
        error: `File extension ${fileExtension} not allowed. Allowed extensions: ${allowedExtensions.join(', ')}` 
      }, { status: 400 });
    }

    // Sanitize filename
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();

    const storage = new Storage(client);

    console.log('API Upload - File info:', { name: file.name, size: file.size, type: file.type });

// Convert Web File to node-appwrite compatible InputFile
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const inputFile = InputFile.fromBuffer(buffer, sanitizedName);

    console.log('API Upload - Attempting to create file in bucket:', bucketId);

    const response = await storage.createFile(
      bucketId,
      ID.unique(),
      inputFile
    );

    console.log('API Upload - Success:', response.$id);

    const imageUrl = `${endpoint}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${projectId}`;

    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        fileId: response.$id
      }
    });
  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to upload file'
    }, { status: 500 });
  }
}
