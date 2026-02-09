import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashPhone(phone: string): string {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {
      ownerId: session.user.id
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        _count: {
          select: { calls: true }
        }
      }
    });

    return NextResponse.json(leads);

  } catch (error) {
    console.error('Leads GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { companyName, phone, email, city, province, niche, currentProvider } = body;

    if (!companyName || !phone) {
      return NextResponse.json(
        { error: 'Company name and phone are required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\s/g, '');
    const phoneHash = hashPhone(cleanPhone);

    // Check duplicate
    const existing = await prisma.lead.findFirst({
      where: { phoneHash }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Lead with this phone already exists' },
        { status: 409 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        companyName,
        email: email || '',
        phone: cleanPhone,
        phoneHash,
        city: city || '',
        province: province || '',
        niche: niche || '',
        currentProvider: currentProvider || '',
        status: 'NEW',
        ownerId: session.user.id,
        consentPhone: true,
        doNotCall: false,
        source: 'MANUAL',
      }
    });

    return NextResponse.json(lead);

  } catch (error) {
    console.error('Lead POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingLead = await prisma.lead.findFirst({
      where: { id, ownerId: session.user.id }
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: updates
    });

    return NextResponse.json(lead);

  } catch (error) {
    console.error('Lead PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}
