import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TEST: Hardcoded Client ID om te verifiëren dat de env var het probleem is
    const envClientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const hardcodedClientId = '141912898123-tcjnrs44h99ni3itpd9ecjoanv239lu.apps.googleusercontent.com';
    
    // Gebruik hardcoded versie voor test
    const clientId = hardcodedClientId;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/calendar/google/callback`;
    
    let authUrl = '#';
    if (clientId) {
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
      });
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    
    return NextResponse.json({ 
      connected: false,
      authUrl: authUrl,
      debug: {
        hasClientId: !!clientId,
        clientIdLength: clientId?.length || 0,
        redirectUri: redirectUri,
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check calendar status', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
