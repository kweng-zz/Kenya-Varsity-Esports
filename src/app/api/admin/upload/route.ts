import { NextResponse } from 'next/server';
import { Client, Storage, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketId = (formData.get('bucketId') as string) || 'season-images';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId || !apiKey) {
      return NextResponse.json({ success: false, error: 'Appwrite server configuration missing' }, { status: 500 });
    }

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const storage = new Storage(client);

    console.log('API Upload - File info:', { name: file.name, size: file.size, type: file.type });

    // Convert Web File to node-appwrite compatible InputFile
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const inputFile = InputFile.fromBuffer(buffer, file.name);

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
