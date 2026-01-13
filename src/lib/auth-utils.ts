import { cookies } from 'next/headers';
import { account } from '@/lib/appwrite';

export async function getUserFromRequest(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    if (!session) {
      return null;
    }

    // Get current user
    const user = await account.get();
    return user;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}
