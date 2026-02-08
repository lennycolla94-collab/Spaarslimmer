import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/services/auth';
import { prisma } from '@/shared/db/prisma';

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

    // Verify lead belongs to this user
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

    // Create call log
    const callLog = await prisma.callLog.create({
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
    }

    if (newStatus !== lead.status) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: newStatus }
      });
    }

    // Create queue item for callback if requested
    if (result === 'CALLBACK_REQUESTED') {
      await prisma.queueItem.create({
        data: {
          leadId,
          assignedTo: session.user.id,
          type: 'CALL',
          status: 'PENDING',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          priority: 1
        }
      });
    }

    // Create follow-up queue item for no_answer
    if (result === 'NO_ANSWER') {
      await prisma.queueItem.create({
        data: {
          leadId,
          assignedTo: session.user.id,
          type: 'CALL',
          status: 'PENDING',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
          priority: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      callLog: {
        id: callLog.id,
        result: callLog.result,
        calledAt: callLog.calledAt
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

// Get call history for a lead
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is verplicht' },
        { status: 400 }
      );
    }

    // Verify lead belongs to user
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

    const calls = await prisma.callLog.findMany({
      where: { leadId },
      orderBy: { calledAt: 'desc' },
      select: {
        id: true,
        result: true,
        notes: true,
        duration: true,
        calledAt: true
      }
    });

    return NextResponse.json(calls);

  } catch (error) {
    console.error('Get calls error:', error);
    return NextResponse.json(
      { error: 'Interne fout' },
      { status: 500 }
    );
  }
}
