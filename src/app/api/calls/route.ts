import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Create a new call log
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, result, notes, duration } = body;

    if (!leadId || !result) {
      return NextResponse.json(
        { error: 'Lead ID and result are required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const lead = await prisma.$queryRaw`
      SELECT id FROM "Lead"
      WHERE id = ${leadId} AND ownerid = ${session.user.id}
      LIMIT 1
    `;

    if (!(lead as any[]).length) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Insert call log
    await prisma.$executeRaw`
      INSERT INTO calls (
        id, leadid, consultantid, result, notes, duration, calledat
      ) VALUES (
        gen_random_uuid(),
        ${leadId},
        ${session.user.id},
        ${result},
        ${notes || null},
        ${duration || null},
        NOW()
      )
    `;

    // Update lead status if needed
    if (result === 'NOTE') {
      // Just a note, don't change status
    } else if (result === 'INTERESTED') {
      await prisma.$executeRaw`
        UPDATE "Lead" SET status = 'CONTACTED', updatedat = NOW()
        WHERE id = ${leadId}
      `;
    } else if (result === 'QUOTED') {
      await prisma.$executeRaw`
        UPDATE "Lead" SET status = 'QUOTED', updatedat = NOW()
        WHERE id = ${leadId}
      `;
    } else if (result === 'SALE') {
      await prisma.$executeRaw`
        UPDATE "Lead" SET status = 'SALE_MADE', updatedat = NOW()
        WHERE id = ${leadId}
      `;
    } else if (result === 'NOT_INTERESTED') {
      await prisma.$executeRaw`
        UPDATE "Lead" SET status = 'NOT_INTERESTED', updatedat = NOW()
        WHERE id = ${leadId}
      `;
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Call POST error:', error);
    return NextResponse.json(
      { error: 'Failed to save call', details: error.message },
      { status: 500 }
    );
  }
}
