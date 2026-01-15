import { NextResponse } from 'next/server';
import { Client, Storage, ID, Databases } from 'node-appwrite';
import { getUserFromRequest } from '@/lib/auth-utils';
import { InputFile } from 'node-appwrite/file';

export const dynamic = 'force-dynamic';

// POST upload file (admin only)
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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

    try {
      const profile: any = await databases.getDocument(
        dbId,
        profileCollectionId,
        user.$id
      );

      if (!profile.isAdmin) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: Admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to verify admin status' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketId = (formData.get('bucketId') as string) || 'season-images';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

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
