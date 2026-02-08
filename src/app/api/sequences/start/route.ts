import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  createQuoteSequence, 
  createActivationSequence, 
  getSequenceDetails,
  SequenceType 
} from '@/lib/sequence-engine';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { leadId, consultantId, sequenceType } = body;
    
    if (!leadId || !consultantId || !sequenceType) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, consultantId, sequenceType' },
        { status: 400 }
      );
    }
    
    // Validate sequence type
    if (!['quote', 'activation'].includes(sequenceType)) {
      return NextResponse.json(
        { error: 'Invalid sequenceType. Must be "quote" or "activation"' },
        { status: 400 }
      );
    }
    
    // Check if lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { 
        id: true, 
        companyName: true,
        consultantId: true,
        consentEmail: true,
        consentWhatsApp: true,
        consentPhone: true,
      },
    });
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Verify consultant owns this lead (or is admin - skip for now)
    if (lead.consultantId !== consultantId) {
      return NextResponse.json(
        { error: 'Unauthorized - lead belongs to different consultant' },
        { status: 403 }
      );
    }
    
    // Cancel any existing pending sequences for this lead
    await prisma.queueItem.updateMany({
      where: {
        leadId,
        consultantId,
        status: 'pending',
      },
      data: {
        status: 'cancelled',
      },
    });
    
    // Create sequence based on type
    let queueItems;
    if (sequenceType === 'quote') {
      queueItems = await createQuoteSequence(leadId, consultantId);
    } else {
      queueItems = await createActivationSequence(leadId, consultantId);
    }
    
    // Log sequence start
    await prisma.callLog.create({
      data: {
        leadId,
        consultantId,
        result: 'conversation',
        notes: `Started ${sequenceType} sequence. Created ${queueItems.length} queue items.`,
      },
    });
    
    // Get sequence details for response
    const sequenceDetails = getSequenceDetails(sequenceType as SequenceType);
    
    return NextResponse.json({
      success: true,
      sequenceType,
      leadId,
      companyName: lead.companyName,
      itemsCreated: queueItems.length,
      items: queueItems.map(item => ({
        id: item.id,
        type: item.type,
        scheduledAt: item.scheduledAt,
        priority: item.priority,
        status: item.status,
      })),
      timeline: sequenceDetails.items.map(item => ({
        type: item.type,
        day: item.daysFromStart,
        description: item.description,
      })),
    });
    
  } catch (error) {
    console.error('Error starting sequence:', error);
    return NextResponse.json(
      { error: 'Failed to start sequence' },
      { status: 500 }
    );
  }
}
