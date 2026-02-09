import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, leadId } = body;

    if (!type || !leadId) {
      return NextResponse.json(
        { error: 'Type and leadId are required' },
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
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Create follow-up tasks based on type
    const tasks = [];

    if (type === 'QUOTE_SENT') {
      // Day 1: Email reminder
      tasks.push({
        leadId,
        assignedTo: session.user.id,
        type: 'EMAIL',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        priority: 1
      });

      // Day 3: WhatsApp
      tasks.push({
        leadId,
        assignedTo: session.user.id,
        type: 'WHATSAPP',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: 1
      });

      // Day 7: Call
      tasks.push({
        leadId,
        assignedTo: session.user.id,
        type: 'CALL',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 2
      });
    }

    // Create queue items
    for (const task of tasks) {
      await prisma.queueItem.create({ data: task });
    }

    return NextResponse.json({
      success: true,
      message: `Follow-up sequence started with ${tasks.length} tasks`
    });

  } catch (error) {
    console.error('Sequence start error:', error);
    return NextResponse.json(
      { error: 'Failed to start sequence' },
      { status: 500 }
    );
  }
}
