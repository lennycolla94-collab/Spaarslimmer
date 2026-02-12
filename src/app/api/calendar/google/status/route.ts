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

    // In productie: check database of user een Google refresh token heeft
    // Voor nu: check localStorage via client-side (deze API is placeholder)
    
    return NextResponse.json({ 
      connected: false, // User moet eerst OAuth doen
      authUrl: getGoogleAuthUrl()
    });

  } catch (error: any) {
    console.error('Calendar status error:', error);
    return NextResponse.json(
      { error: 'Failed to check calendar status' },
      { status: 500 }
    );
  }
}

// Helper functie om Google OAuth URL te genereren
function getGoogleAuthUrl() {
  // Trim de client ID (kan spaties/newlines bevatten bij copy-paste)
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/calendar/google/callback`;
  
  console.log('Google OAuth Debug:', {
    clientIdLength: clientId?.length,
    clientIdStart: clientId?.slice(0, 10),
    clientIdEnd: clientId?.slice(-10),
    redirectUri,
  });
  
  if (!clientId) {
    console.error('GOOGLE_CLIENT_ID is not set!');
    return '#';
  }
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'https://www.googleapis.com/auth/calendar.events',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
