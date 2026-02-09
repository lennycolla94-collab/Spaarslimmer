import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phone, message } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\s/g, '').replace(/^0/, '32');
    const encodedMessage = encodeURIComponent(message || '');
    const waLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    return NextResponse.json({ 
      link: waLink,
      phone: cleanPhone
    });

  } catch (error) {
    console.error('WhatsApp link error:', error);
    return NextResponse.json(
      { error: 'Failed to generate link' },
      { status: 500 }
    );
  }
}
