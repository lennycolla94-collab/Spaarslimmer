import { NextRequest, NextResponse } from 'next/server';

// Debug endpoint - verwijder na fix!
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  
  // Check welke env vars beschikbaar zijn (mask secrets!)
  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    GOOGLE_CLIENT_ID_RAW: process.env.GOOGLE_CLIENT_ID ? 
      `${process.env.GOOGLE_CLIENT_ID.slice(0, 30)}... (len:${process.env.GOOGLE_CLIENT_ID.length})` : 'NOT SET',
    GOOGLE_CLIENT_ID_TRIMMED: clientId ? 
      `${clientId.slice(0, 30)}... (len:${clientId.length})` : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 
      'SET (hidden)' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  });
}
