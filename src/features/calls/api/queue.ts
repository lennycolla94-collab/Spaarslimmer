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

    // Haal volgende lead op die:
    // 1. Van deze user is
    // 2. Niet doNotCall heeft
    // 3. Phone consent heeft (of legitimate interest)
    // 4. Niet recent gebeld (laatste 4 uur)
    // 5. Status is NEW of CONTACTED
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
        // Niet gebeld in laatste 4 uur
        calls: {
          none: {
            calledAt: {
              gte: new Date(Date.now() - 4 * 60 * 60 * 1000)
            }
          }
        }
      },
      orderBy: [
        { createdAt: 'asc' } // Oudste eerst (FIFO)
      ],
      include: {
        calls: {
          orderBy: { calledAt: 'desc' },
          take: 3 // Laatste 3 gesprekken tonen
        }
      }
    });

    if (!nextLead) {
      return NextResponse.json({ 
        message: 'Geen leads in wachtrij',
        empty: true 
      }, { status: 404 });
    }

    // Decryptie gebeurt automatisch via Prisma middleware
    return NextResponse.json(nextLead);
    
  } catch (error) {
    console.error('Queue error:', error);
    return NextResponse.json({ 
      error: 'Interne fout bij ophalen queue' 
    }, { status: 500 });
  }
}
