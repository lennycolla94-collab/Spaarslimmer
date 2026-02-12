import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering (uses headers/session)
export const dynamic = 'force-dynamic';

// GET - Check if user has Google Calendar connected
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Test: return de Client ID direct zodat we kunnen zien wat er gebeurt
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/calendar/google/callback`;
    
    // Bouw de URL
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
        clientIdPreview: clientId ? `${clientId.slice(0, 10)}...${clientId.slice(-10)}` : null,
        redirectUri: redirectUri,
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check calendar status', message: error.message },
      { status: 500 }
    );
  }
}
