import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// POST /api/queue/auto-followup - Create automatic follow-up calls for sales older than 30 days
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all sales that:
    // 1. Are SOLD status
    // 2. Have activationDate > 30 days ago
    // 3. Don't have followUpDone = true
    // 4. Don't already have a queue item for follow-up
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const eligibleSales = await prisma.offer.findMany({
      where: {
        consultantId: session.user.id,
        status: 'SOLD',
        activationDate: {
          lte: thirtyDaysAgo,
        },
        followUpDone: false,
        followUpQueued: false,
      },
      include: {
        lead: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            phone: true,
          },
        },
      },
    });

    // Create queue items for each eligible sale
    const createdQueueItems = [];
    for (const sale of eligibleSales) {
      const queueItem = await prisma.queueItem.create({
        data: {
          leadId: sale.leadId,
          assignedTo: session.user.id,
          priority: 2, // Medium priority
          dueDate: new Date(), // Due now
          status: 'PENDING',
          type: 'FOLLOW_UP',
          notes: `Automatische opvolgcall voor ${sale.lead.companyName}. Sale van ${sale.activationDate?.toLocaleDateString('nl-BE')}.`,
        },
      });

      // Mark the offer as queued
      await prisma.offer.update({
        where: { id: sale.id },
        data: { followUpQueued: true },
      });

      createdQueueItems.push(queueItem);
    }

    return NextResponse.json({
      message: `${createdQueueItems.length} opvolgcalls toegevoegd aan queue`,
      queueItems: createdQueueItems,
    });
  } catch (error) {
    console.error('Error creating auto follow-ups:', error);
    return NextResponse.json(
      { error: 'Failed to create follow-ups' },
      { status: 500 }
    );
  }
}

// GET /api/queue/auto-followup - Check for pending follow-ups
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pendingFollowUps = await prisma.offer.count({
      where: {
        consultantId: session.user.id,
        status: 'SOLD',
        activationDate: {
          lte: thirtyDaysAgo,
        },
        followUpDone: false,
        followUpQueued: false,
      },
    });

    return NextResponse.json({
      pendingCount: pendingFollowUps,
      message: `${pendingFollowUps} opvolgcalls wachten om in queue geplaatst te worden`,
    });
  } catch (error) {
    console.error('Error checking follow-ups:', error);
    return NextResponse.json(
      { error: 'Failed to check follow-ups' },
      { status: 500 }
    );
  }
}
