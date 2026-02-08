import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendQuoteEmail, QuoteData } from '@/lib/email-service';
import { checkConsent } from '@/middleware/gdpr';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { leadId, quoteData } = body;
    
    if (!leadId || !quoteData) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, quoteData' },
        { status: 400 }
      );
    }
    
    // Get lead with consent info
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        consultant: {
          select: { name: true, email: true },
        },
      },
    });
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    if (!lead.email) {
      return NextResponse.json(
        { error: 'Lead has no email address' },
        { status: 400 }
      );
    }
    
    // Check email consent (GDPR)
    const hasEmailConsent = checkConsent(lead, 'email');
    if (!hasEmailConsent) {
      return NextResponse.json(
        { 
          error: 'Lead has not consented to email contact',
          gdprViolation: true 
        },
        { status: 403 }
      );
    }
    
    // Prepare quote data with consultant info
    const fullQuoteData: QuoteData = {
      ...quoteData,
      consultantName: lead.consultant?.name || 'Uw Consultant',
      consultantEmail: lead.consultant?.email || 'info@smartsn.be',
      consultantPhone: '+32 470 12 34 56', // Would come from consultant profile
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
    
    // Send email
    const result = await sendQuoteEmail(lead.email, fullQuoteData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
    
    // Log the email in call logs for tracking
    await prisma.callLog.create({
      data: {
        leadId,
        consultantId: lead.consultantId,
        result: 'conversation',
        notes: `Quote email sent: ${quoteData.quoteId}. MessageId: ${result.messageId}`,
      },
    });
    
    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      sentTo: lead.email,
      sentAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error sending quote email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
