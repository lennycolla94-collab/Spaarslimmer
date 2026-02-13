import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { calculateOfferCommission } from '@/lib/commission';

// GET /api/offers - List offers for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const offers = await prisma.offer.findMany({
      where: {
        consultantId: session.user.id,
        ...(status && status !== 'ALL' ? { status } : {}),
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
      orderBy: { createdAt: 'desc' },
    });

    // Calculate commission totals
    const potentialCommission = offers
      .filter(o => o.status === 'SENT')
      .reduce((sum, o) => sum + (o.potentialCommission || 0), 0);
    
    const effectiveCommission = offers
      .filter(o => o.status === 'ACCEPTED')
      .reduce((sum, o) => sum + (o.effectiveCommission || 0), 0);

    return NextResponse.json({
      offers,
      totals: {
        potentialCommission,
        effectiveCommission,
        totalOffers: offers.length,
        sentCount: offers.filter(o => o.status === 'SENT').length,
        acceptedCount: offers.filter(o => o.status === 'ACCEPTED').length,
      },
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// POST /api/offers - Create new offer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, products, isNewCustomer, hasPortability, hasConvergence } = body;

    if (!leadId || !products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate totals
    const totalRetail = products.reduce((sum: number, p: any) => sum + (p.retailValue || 0), 0);
    const totalASP = products.reduce((sum: number, p: any) => sum + (p.aspValue || 0), 0);

    // Create offer (DRAFT status - no commission yet)
    const offer = await prisma.offer.create({
      data: {
        leadId,
        consultantId: session.user.id,
        products: JSON.stringify(products),
        totalRetail,
        totalASP,
        customerSavings: body.customerSavings || 0,
        status: 'DRAFT',
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

    return NextResponse.json({ offer });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
