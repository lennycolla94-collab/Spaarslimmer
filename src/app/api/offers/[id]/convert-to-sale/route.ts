import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { calculateOfferCommission } from '@/lib/commission';

// POST /api/offers/[id]/convert-to-sale - Convert offer to sale
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await Promise.resolve(params);

    // Get the offer
    const offer = await prisma.offer.findFirst({
      where: { 
        id,
        consultantId: session.user.id 
      },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Only ACCEPTED offers can be converted to SOLD
    if (offer.status !== 'ACCEPTED') {
      return NextResponse.json(
        { error: 'Offer must be accepted before converting to sale' },
        { status: 400 }
      );
    }

    // Calculate full commission
    const products = JSON.parse(offer.products || '[]');
    const hasConvergence = products.some((p: any) => p.type === 'MOBILE') && 
                          products.some((p: any) => p.type === 'INTERNET');
    
    const commissionCalc = calculateOfferCommission(products, 'BC', { hasConvergence });

    // Calculate activation date (for clawback tracking)
    const activationDate = new Date();
    
    // Update to SOLD status with full effective commission
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: {
        status: 'SOLD',
        potentialCommission: null, // Clear potential, set effective
        effectiveCommission: commissionCalc.effectiveCommission,
        soldAt: new Date(),
        activationDate: activationDate,
        clawbackStatus: 'PENDING',
        clawbackRisk: 100, // 100% risk initially
      },
      include: {
        lead: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            city: true,
            phone: true,
          },
        },
      },
    });

    // Schedule automatic follow-up call for 30 days from now
    const followUpDate = new Date(activationDate);
    followUpDate.setDate(followUpDate.getDate() + 30);

    // Create a scheduled queue item for follow-up
    await prisma.queueItem.create({
      data: {
        leadId: offer.leadId,
        assignedTo: session.user.id,
        priority: 2,
        dueDate: followUpDate,
        status: 'PENDING',
        type: 'FOLLOW_UP',
        notes: `Automatische opvolgcall voor ${updatedOffer.lead.companyName}. Sale geactiveerd op ${activationDate.toLocaleDateString('nl-BE')}.`,
      },
    });

    // Optionally: Create a Sale record or trigger commission payout logic
    // This could integrate with your existing commission system
    
    return NextResponse.json({ 
      offer: updatedOffer,
      commission: {
        effective: commissionCalc.effectiveCommission,
        breakdown: commissionCalc.breakdown,
      },
      message: 'Offer successfully converted to sale'
    });
  } catch (error) {
    console.error('Error converting offer to sale:', error);
    return NextResponse.json(
      { error: 'Failed to convert to sale' },
      { status: 500 }
    );
  }
}
