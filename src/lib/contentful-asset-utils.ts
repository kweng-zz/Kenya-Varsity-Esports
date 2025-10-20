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
  delay: number = 1000,
  timeout: number = 6000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      console.log(`[Attempt ${attempt}/${maxRetries}] Starting operation with ${timeout}ms timeout`);
      
      // Wrap operation with timeout using Promise.race
      const result = await Promise.race([
        operation(),
        new Promise<T>((_, reject) => {
          timeoutId = setTimeout(() => {
            console.warn(`[Attempt ${attempt}/${maxRetries}] Operation timeout after ${timeout}ms`);
            reject(new Error(`Operation timeout after ${timeout}ms`));
          }, timeout);
        })
      ]);
      
      // Clear timeout if operation succeeded
      if (timeoutId) clearTimeout(timeoutId);
      
      console.log(`[Attempt ${attempt}/${maxRetries}] Operation succeeded`);
      return result;
      
    } catch (error) {
      // Clear timeout on error
      if (timeoutId) clearTimeout(timeoutId);
      
      lastError = error as Error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.warn(`[Attempt ${attempt}/${maxRetries}] Failed:`, errorMessage);
      
      // Check if this is a retryable error
      const isRetryable = isRetryableError(errorMessage);
      
      if (attempt < maxRetries && isRetryable) {
        const waitTime = delay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`[Attempt ${attempt}/${maxRetries}] Retryable error. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else if (attempt < maxRetries && !isRetryable) {
        console.warn(`[Attempt ${attempt}/${maxRetries}] Non-retryable error. Stopping retries.`);
        throw lastError;
      } else {
        console.warn(`[Attempt ${attempt}/${maxRetries}] Max retries exhausted. Throwing error.`);
      }
    }
  }
  
  throw lastError!;
}

function isRetryableError(errorMessage: string): boolean {
  // Connection errors
  if (errorMessage.includes('Connection error') || 
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ECONNRESET') ||
      errorMessage.includes('ETIMEDOUT') ||
      errorMessage.includes('EHOSTUNREACH') ||
      errorMessage.includes('ENETUNREACH')) {
    return true;
  }
  
  // Backend errors
  if (errorMessage.includes('503') ||
      errorMessage.includes('502') ||
      errorMessage.includes('504') ||
      errorMessage.includes('Backend fetch failed') ||
      errorMessage.includes('Service Unavailable')) {
    return true;
  }
  
  // Timeout errors
  if (errorMessage.includes('timeout') ||
      errorMessage.includes('TIMEOUT') ||
      errorMessage.includes('timed out')) {
    return true;
  }
  
  // Rate limiting
  if (errorMessage.includes('429') ||
      errorMessage.includes('Too Many Requests')) {
    return true;
  }
  
  return false;
}