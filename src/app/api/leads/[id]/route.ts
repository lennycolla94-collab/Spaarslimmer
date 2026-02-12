import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch single lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leadId = params.id;

    const lead = await prisma.$queryRaw`
      SELECT 
        id, companyname, phone, email, phonehash,
        contactname, niche, address, city, province, postalcode,
        currentprovider, currentsupplier,
        consentemail, consentphone, consentwhatsapp, lawfulbasis,
        donotcall, status, source, ownerid,
        createdat, updatedat
      FROM "Lead"
      WHERE id = ${leadId} AND ownerid = ${session.user.id}
      LIMIT 1
    `;

    if (!lead || !(lead as any[]).length) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Convert to camelCase
    const row = (lead as any[])[0];
    const camelCaseLead = {
      id: row.id,
      companyName: row.companyname,
      phone: row.phone,
      email: row.email,
      phoneHash: row.phonehash,
      contactName: row.contactname,
      niche: row.niche,
      address: row.address,
      city: row.city,
      province: row.province,
      postalCode: row.postalcode,
      currentProvider: row.currentprovider,
      currentSupplier: row.currentsupplier,
      consentEmail: row.consentemail,
      consentPhone: row.consentphone,
      consentWhatsapp: row.consentwhatsapp,
      lawfulBasis: row.lawfulbasis,
      doNotCall: row.donotcall,
      status: row.status,
      source: row.source,
      ownerId: row.ownerid,
      createdAt: row.createdat,
      updatedAt: row.updatedat,
    };

    return NextResponse.json(camelCaseLead);

  } catch (error: any) {
    console.error('Lead GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leadId = params.id;

    // Verify ownership before deleting
    const existing = await prisma.$queryRaw`
      SELECT id FROM "Lead"
      WHERE id = ${leadId} AND ownerid = ${session.user.id}
      LIMIT 1
    `;

    if (!(existing as any[]).length) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Delete related records first (cascade)
    await prisma.$executeRaw`DELETE FROM calls WHERE leadid = ${leadId}`;
    await prisma.$executeRaw`DELETE FROM appointments WHERE leadid = ${leadId}`;
    
    // Delete the lead
    await prisma.$executeRaw`DELETE FROM "Lead" WHERE id = ${leadId}`;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Lead DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead', details: error.message },
      { status: 500 }
    );
  }
}
