import { Client, Storage, ID } from 'appwrite';

class StorageService {
  private client: Client;
  private storage: Storage;
  private bucketId = 'season-images'; // Default bucket identified from AdminBannersPage

  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
    
    this.storage = new Storage(this.client);
  }

  /**
   * Upload a file to Appwrite Storage via Server-Side API
   * @param file - The file to upload
   * @param bucketId - Optional bucket ID (defaults to season-images)
   * @returns The public view URL of the uploaded file
   */
  async uploadFile(file: File, bucketId: string = this.bucketId): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketId', bucketId);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      return data.data.url;
    } catch (error) {
      console.error('Error uploading file via API:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Appwrite Storage
   * @param fileId - The ID of the file to delete
   * @param bucketId - Optional bucket ID
   */
  async deleteFile(fileId: string, bucketId: string = this.bucketId): Promise<void> {
    try {
      await this.storage.deleteFile(bucketId, fileId);
    } catch (error) {
      console.error('Error deleting file from Appwrite Storage:', error);
      throw error;
    }
  }

  /**
   * Extract file ID from an Appwrite view URL
   * @param url - The Appwrite view URL
   * @returns The file ID or null if not found
   */
  getFileIdFromUrl(url: string): string | null {
    if (!url.includes('/storage/buckets/') || !url.includes('/files/')) {
      return null;
    }
    
    const parts = url.split('/files/');
    if (parts.length < 2) return null;
    
    const fileIdPart = parts[1].split('/')[0];
    return fileIdPart.split('?')[0];
  }
}

export const storageService = new StorageService();
