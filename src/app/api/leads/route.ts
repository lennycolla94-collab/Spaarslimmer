import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/leads - Haal leads op met filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const province = searchParams.get('province');
    const niche = searchParams.get('niche');
    const provider = searchParams.get('provider');
    const excludeDoNotCall = searchParams.get('excludeDoNotCall') === 'true';
    
    const where: any = {};
    
    if (province) {
      where.province = province;
    }
    
    if (niche) {
      where.niche = niche;
    }
    
    if (provider) {
      where.currentProvider = provider;
    }
    
    if (excludeDoNotCall) {
      where.doNotCall = false;
    }
    
    const leads = await prisma.lead.findMany({
      where,
      include: {
        consultant: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { callLogs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads - Maak nieuwe lead aan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check for duplicates on phone
    const existingLead = await prisma.lead.findUnique({
      where: { phone: body.phone },
    });
    
    if (existingLead) {
      return NextResponse.json(
        { error: 'Lead with this phone number already exists' },
        { status: 409 }
      );
    }
    
    const lead = await prisma.lead.create({
      data: {
        companyName: body.companyName,
        niche: body.niche,
        phone: body.phone,
        email: body.email,
        address: body.address,
        city: body.city,
        province: body.province,
        currentProvider: body.currentProvider,
        currentSupplier: body.currentSupplier,
        consultantId: body.consultantId,
        lawfulBasis: body.lawfulBasis || 'LEGITIMATE_INTEREST',
        consentEmail: body.consentEmail || false,
        consentWhatsApp: body.consentWhatsApp || false,
        consentPhone: body.consentPhone || false,
        doNotCall: body.doNotCall || false,
      },
      include: {
        consultant: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
