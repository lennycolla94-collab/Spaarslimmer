import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { calculateOfferCommission } from '@/lib/commission';

// PATCH /api/offers/[id]/status - Update offer status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const { status: newStatus } = body;

    if (!newStatus || !['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'].includes(newStatus)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

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

    // Calculate commission based on status
    let updateData: any = { status: newStatus };
    
    if (newStatus === 'SENT') {
      // When sent: 30% potential commission
      updateData.sentAt = new Date();
      
      // Recalculate commission from products
      const products = JSON.parse(offer.products || '[]');
      const hasConvergence = products.some((p: any) => p.type === 'MOBILE') && 
                            products.some((p: any) => p.type === 'INTERNET');
      
      const commissionCalc = calculateOfferCommission(products, 'BC', { hasConvergence });
      updateData.potentialCommission = commissionCalc.potentialCommission;
      
    } else if (newStatus === 'ACCEPTED') {
      // When accepted: full commission
      updateData.acceptedAt = new Date();
      
      const products = JSON.parse(offer.products || '[]');
      const hasConvergence = products.some((p: any) => p.type === 'MOBILE') && 
                            products.some((p: any) => p.type === 'INTERNET');
      
      const commissionCalc = calculateOfferCommission(products, 'BC', { hasConvergence });
      updateData.effectiveCommission = commissionCalc.effectiveCommission;
      
    } else if (newStatus === 'REJECTED' || newStatus === 'EXPIRED') {
      // No commission
      updateData.potentialCommission = null;
      updateData.effectiveCommission = null;
    }

    // Update the offer
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: updateData,
      include: {
        lead: {
          select: {
            companyName: true,
            contactName: true,
            city: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({ offer: updatedOffer });
  } catch (error) {
    console.error('Error updating offer status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
