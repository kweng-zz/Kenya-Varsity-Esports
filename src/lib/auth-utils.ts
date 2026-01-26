import { cookies } from 'next/headers';
import { getSessionClient } from '@/lib/appwrite-server';

export async function getUserFromRequest(request: Request) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    console.log('🍪 Server Checking Cookies...');
    allCookies.forEach(c => {
      const displayValue = c.name === 'appwrite-session' ? '[JWT TOKEN]' : c.value;
      console.log(`   - Available: "${c.name}" (Length: ${c.value?.length || 0})`);
    });
    
    // Get the JWT token bridge
    const session = allCookies.find(c => c.name.trim() === 'appwrite-session');
    
    if (!session || !session.value || session.value === 'undefined') {
      console.log('❌ Appwrite session cookie not found or invalid.');
      return null;
    }

    console.log(`🔑 Found appwrite-session secret (Length: ${session.value.length})...`);
    const sessionClient = getSessionClient(session.value);
    if (!sessionClient) {
      console.error('Failed to initialize session client');
      return null;
    }

    // Get currently logged in user using their specific session
    const user = await sessionClient.account.get();
    return user;
  } catch (error: any) {
    console.error('❌ Error getting user from request:', error.message || error);
    if (error.response) {
      console.error('   Appwrite Response:', error.response);
    }
    return null;
  }
}
