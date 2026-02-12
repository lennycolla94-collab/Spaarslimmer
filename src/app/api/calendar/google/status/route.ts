import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// HARDCODED voor test - dit moet werken!
const HARDCODED_CLIENT_ID = '141912898123-m9j02df8rfbo5jqi685lhutgluso8ja5.apps.googleusercontent.com';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/calendar/google/callback`;
    
    const params = new URLSearchParams({
      client_id: HARDCODED_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    return NextResponse.json({ 
      connected: false,
      authUrl: authUrl,
      debug: {
        hardcoded: true,
        clientId: HARDCODED_CLIENT_ID.slice(0, 20) + '...',
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
