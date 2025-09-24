import { Environment } from 'contentful-management';

export interface AssetUploadOptions {
  title: string;
  file: File;
  timeout?: number;
}

export async function uploadAndProcessAsset(
  environment: Environment,
  options: AssetUploadOptions
): Promise<any> {
  const { title, file, timeout = 30000 } = options;

  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    console.log(`Creating upload for: ${title}`);
    
    // First create an upload
    const upload = await environment.createUpload({
      file: arrayBuffer
    });

    console.log('Upload created, creating asset...');
    
    // Create asset with upload reference
    const asset = await environment.createAsset({
      fields: {
        title: {
          'en-US': title
        },
        file: {
          'en-US': {
            contentType: file.type,
            fileName: file.name,
            uploadFrom: {
              sys: {
                type: 'Link',
                linkType: 'Upload',
                id: upload.sys.id
              }
            }
          }
        }
      }
    });

    console.log('Asset created, processing...');

    // Process asset with timeout
    const processedAsset = await Promise.race([
      asset.processForAllLocales(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Asset processing timeout')), timeout)
      )
    ]) as any;

    console.log('Asset processed, publishing...');
    
    // Publish asset
    const publishedAsset = await processedAsset.publish();
    
    console.log('Asset published successfully');
    return publishedAsset;

  } catch (error) {
    console.error('Asset upload failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error('Asset processing timed out. Please try with a smaller image or try again later.');
      }
      if (error.message.includes('ValidationFailed')) {
        throw new Error('Invalid file format or size. Please check your image and try again.');
      }
    }
    
    throw error;
  }
}

export function createAssetLink(assetId: string) {
  return {
    sys: {
      type: 'Link',
      linkType: 'Asset',
      id: assetId
    }
  };
}

export async function retryAssetOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Asset operation attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}