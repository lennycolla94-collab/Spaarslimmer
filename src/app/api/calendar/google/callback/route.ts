import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering (uses headers/session)
export const dynamic = 'force-dynamic';

// GET - Handle Google OAuth callback
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect('/settings?calendar=error');
    }

    if (!code) {
      return NextResponse.redirect('/settings?calendar=error');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/calendar/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange error:', errorData);
      return NextResponse.redirect('/settings?calendar=error');
    }

    const tokens = await tokenResponse.json();
    
    // Store tokens (in production: encrypt and save to database)
    // For now: redirect with access token (client will store in localStorage)
    const redirectUrl = new URL('/settings', process.env.NEXTAUTH_URL);
    redirectUrl.searchParams.set('calendar', 'connected');
    redirectUrl.searchParams.set('access_token', tokens.access_token);
    
    if (tokens.refresh_token) {
      redirectUrl.searchParams.set('refresh_token', tokens.refresh_token);
    }

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error: any) {
    console.error('Google callback error:', error);
    return NextResponse.redirect('/settings?calendar=error');
  }
}
