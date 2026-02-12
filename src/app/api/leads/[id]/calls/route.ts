import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch call logs for a lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leadId = params.id;

    // Verify ownership
    const lead = await prisma.$queryRaw`
      SELECT id FROM "Lead"
      WHERE id = ${leadId} AND ownerid = ${session.user.id}
      LIMIT 1
    `;

    if (!(lead as any[]).length) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const calls = await prisma.$queryRaw`
      SELECT 
        id, result, notes, duration, calledat
      FROM calls
      WHERE leadid = ${leadId}
      ORDER BY calledat DESC
    `;

    // Convert to camelCase
    const camelCaseCalls = (calls as any[]).map(call => ({
      id: call.id,
      result: call.result,
      notes: call.notes,
      duration: call.duration,
      calledAt: call.calledat,
    }));

    return NextResponse.json(camelCaseCalls);

  } catch (error: any) {
    console.error('Calls GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calls', details: error.message },
      { status: 500 }
    );
  }
}
