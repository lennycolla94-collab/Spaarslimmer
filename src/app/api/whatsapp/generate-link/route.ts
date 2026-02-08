import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateWhatsAppLink, MessageType, isValidWhatsAppNumber } from '@/lib/whatsapp-service';
import { checkConsent } from '@/middleware/gdpr';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { leadId, messageType, customMessage } = body;
    
    if (!leadId || !messageType) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, messageType' },
        { status: 400 }
      );
    }
    
    // Validate message type
    const validTypes: MessageType[] = ['quote_reminder', 'followup', 'welcome', 'activation_check'];
    if (!validTypes.includes(messageType)) {
      return NextResponse.json(
        { error: `Invalid messageType. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Get lead data
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        consultant: {
          select: { name: true, email: true },
        },
        callLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Check WhatsApp consent (GDPR)
    const hasWhatsAppConsent = checkConsent(lead, 'whatsapp');
    if (!hasWhatsAppConsent) {
      return NextResponse.json(
        { 
          error: 'Lead has not consented to WhatsApp contact',
          gdprViolation: true 
        },
        { status: 403 }
      );
    }
    
    // Validate phone number
    if (!isValidWhatsAppNumber(lead.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number for WhatsApp' },
        { status: 400 }
      );
    }
    
    // Get quote data if available from recent call logs
    const lastQuote = lead.callLogs.find(log => 
      log.notes?.includes('Quote email sent') || 
      log.notes?.includes('Offerte')
    );
    
    // Prepare message data
    const messageData = {
      leadName: lead.companyName.split(' ')[0] || 'klant',
      companyName: lead.companyName,
      consultantName: lead.consultant?.name || 'Uw Consultant',
      quoteId: lastQuote?.notes?.match(/Quote email sent: ([^.]+)/)?.[1] || undefined,
      savingsAmount: 150.00, // Would come from actual quote data
      productType: lead.currentProvider || 'onze diensten',
    };
    
    // Generate WhatsApp link
    const { link, message } = generateWhatsAppLink(
      lead.phone,
      messageType as MessageType,
      messageData
    );
    
    // Log the WhatsApp action
    await prisma.callLog.create({
      data: {
        leadId,
        consultantId: lead.consultantId,
        result: 'conversation',
        notes: `WhatsApp ${messageType} link generated. Message preview: ${message.substring(0, 50)}...`,
      },
    });
    
    return NextResponse.json({
      link,
      message,
      phone: lead.phone,
      messageType,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error generating WhatsApp link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
