import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/leads/search?q=query&limit=10
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({ leads: [] });
    }

    // Search in companyName, contactName, and city
    const leads = await prisma.lead.findMany({
      where: {
        ownerId: session.user.id,
        OR: [
          { companyName: { contains: query, mode: 'insensitive' } },
          { contactName: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        companyName: true,
        contactName: true,
        city: true,
        phone: true,
      },
      orderBy: { companyName: 'asc' },
      take: limit,
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error searching leads:', error);
    return NextResponse.json(
      { error: 'Failed to search leads' },
      { status: 500 }
    );
  }
}
