import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { calculateOfferCommission } from '@/lib/commission';

// PATCH /api/offers/[id]/status - Update offer status with automatic commission calculation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, isNewCustomer, hasPortability, hasConvergence } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Get current offer
    const offer = await prisma.offer.findFirst({
      where: {
        id,
        consultantId: session.user.id,
      },
      include: {
        lead: true,
      },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Parse products
    const products = typeof offer.products === 'string' 
      ? JSON.parse(offer.products) 
      : offer.products;

    // Calculate commission based on new status
    let potentialCommission: number | null = offer.potentialCommission;
    let effectiveCommission: number | null = offer.effectiveCommission;
    let sentAt: Date | null = offer.sentAt;
    let acceptedAt: Date | null = offer.acceptedAt;

    const commissionOptions = {
      isNewCustomer: isNewCustomer ?? false,
      hasPortability: hasPortability ?? false,
      hasConvergence: hasConvergence ?? false,
    };

    switch (status) {
      case 'SENT':
        // When offer is sent: calculate potential commission
        const sentCalc = calculateOfferCommission(products, commissionOptions);
        potentialCommission = sentCalc.potentialCommission;
        effectiveCommission = null;
        sentAt = new Date();
        break;

      case 'ACCEPTED':
        // When offer is accepted: calculate effective commission
        const acceptedCalc = calculateOfferCommission(products, commissionOptions);
        potentialCommission = null; // Remove from potential
        effectiveCommission = acceptedCalc.effectiveCommission;
        acceptedAt = new Date();
        break;

      case 'REJECTED':
      case 'EXPIRED':
        // When rejected/expired: clear all commission
        potentialCommission = null;
        effectiveCommission = null;
        break;

      case 'DRAFT':
        // Back to draft: clear commissions
        potentialCommission = null;
        effectiveCommission = null;
        sentAt = null;
        acceptedAt = null;
        break;
    }

    // Update offer
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: {
        status,
        potentialCommission,
        effectiveCommission,
        sentAt,
        acceptedAt,
      },
      include: {
        lead: {
          select: {
            companyName: true,
            contactName: true,
            city: true,
          },
        },
      },
    });

    // Return with commission breakdown
    const commissionBreakdown = calculateOfferCommission(products, commissionOptions);

    return NextResponse.json({
      offer: updatedOffer,
      commission: {
        status: getCommissionStatusLabel(status),
        potential: potentialCommission,
        effective: effectiveCommission,
        breakdown: commissionBreakdown.breakdown,
      },
    });
  } catch (error) {
    console.error('Error updating offer status:', error);
    return NextResponse.json(
      { error: 'Failed to update offer status' },
      { status: 500 }
    );
  }
}

function getCommissionStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'DRAFT': 'Nog niet verstuurd',
    'SENT': 'Potentiële commissie',
    'ACCEPTED': 'Effectieve commissie',
    'REJECTED': 'Geen commissie',
    'EXPIRED': 'Verlopen',
  };
  return labels[status] || status;
}
