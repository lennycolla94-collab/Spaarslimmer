import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/services/auth';
import { prisma } from '@/shared/db/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const userId = session.user.id;

    const [
      total,
      newLeads,
      contacted,
      quoted,
      sales,
      lost
    ] = await Promise.all([
      prisma.lead.count({ where: { ownerId: userId } }),
      prisma.lead.count({ where: { ownerId: userId, status: 'NEW' } }),
      prisma.lead.count({ where: { ownerId: userId, status: 'CONTACTED' } }),
      prisma.lead.count({ where: { ownerId: userId, status: 'QUOTED' } }),
      prisma.lead.count({ where: { ownerId: userId, status: 'SALE_MADE' } }),
      prisma.lead.count({ where: { ownerId: userId, status: 'LOST' } }),
    ]);

    return NextResponse.json({
      total,
      new: newLeads,
      contacted,
      quoted,
      sales,
      lost,
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Interne fout' },
      { status: 500 }
    );
  }
}
