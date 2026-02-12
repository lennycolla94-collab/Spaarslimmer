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

    // Test met verschillende env vars
    const clientIdFromOAuth = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientIdFromAgenda = process.env.GOOGLE_AGENDA_SECRET?.trim();
    
    // Gebruik degene die werkt
    const clientId = clientIdFromOAuth || clientIdFromAgenda || '';
    
    console.log('Env vars check:', {
      hasOAuthId: !!clientIdFromOAuth,
      hasAgendaSecret: !!clientIdFromAgenda,
      using: clientId ? (clientIdFromOAuth ? 'GOOGLE_CLIENT_ID' : 'GOOGLE_AGENDA_SECRET') : 'NONE'
    });
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
