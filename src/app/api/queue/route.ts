import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const userId = session.user.id;

    // Eerst: zoek leads die recent gebeld zijn
    const recentCalls = await prisma.callLog.findMany({
      where: {
        consultantId: userId,
        calledAt: {
          gte: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 uur geleden
        }
      },
      select: {
        leadId: true
      }
    });

    const recentlyCalledLeadIds = recentCalls.map(c => c.leadId);

    // Zoek de volgende lead
    const nextLead = await prisma.lead.findFirst({
      where: {
        ownerId: userId,
        doNotCall: false,
        OR: [
          { consentPhone: true },
          { lawfulBasis: 'LEGITIMATE_INTEREST' }
        ],
        status: {
          in: ['NEW', 'CONTACTED']
        },
        id: {
          notIn: recentlyCalledLeadIds.length > 0 ? recentlyCalledLeadIds : ['never-match']
        }
      },
      orderBy: [
        { createdAt: 'asc' }
      ]
    });

    if (!nextLead) {
      return NextResponse.json({ 
        message: 'Geen leads in wachtrij',
        empty: true 
      }, { status: 404 });
    }

    // Haal recente calls apart op
    const calls = await prisma.callLog.findMany({
      where: {
        leadId: nextLead.id
      },
      orderBy: { calledAt: 'desc' },
      take: 3
    });

    // Tel totaal aantal calls voor deze lead
    const callCount = await prisma.callLog.count({
      where: { leadId: nextLead.id }
    });

    return NextResponse.json({
      ...nextLead,
      calls,
      callCount
    });
    
  } catch (error) {
    console.error('Queue error:', error);
    return NextResponse.json({ 
      error: 'Interne fout bij ophalen queue' 
    }, { status: 500 });
  }
}
