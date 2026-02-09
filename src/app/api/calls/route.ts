import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, result, notes, duration } = body;

    if (!leadId || !result) {
      return NextResponse.json(
        { error: 'Lead ID en resultaat zijn verplicht' },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        ownerId: session.user.id
      }
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead niet gevonden' },
        { status: 404 }
      );
    }

    // Create call record
    const callRecord = await prisma.callLog.create({
      data: {
        leadId,
        consultantId: session.user.id,
        result,
        notes: notes || null,
        duration: duration || null,
        calledAt: new Date()
      }
    });

    // Update lead status based on result
    let newStatus = lead.status;
    if (result === 'CONVERSATION') {
      newStatus = 'CONTACTED';
    } else if (result === 'NOT_INTERESTED') {
      newStatus = 'LOST';
    } else if (result === 'QUOTE_SENT') {
      newStatus = 'QUOTE_SENT';
    }

    if (newStatus !== lead.status) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: newStatus }
      });
    }

    return NextResponse.json({
      success: true,
      call: {
        id: callRecord.id,
        result: callRecord.result,
        calledAt: callRecord.calledAt
      }
    });

  } catch (error) {
    console.error('Call log error:', error);
    return NextResponse.json(
      { error: 'Interne fout bij opslaan gesprek' },
      { status: 500 }
    );
  }
}
