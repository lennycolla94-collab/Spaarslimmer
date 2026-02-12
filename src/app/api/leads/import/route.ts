import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    let csvText = await file.text();
    
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.substring(1);
    }
    
    const firstLine = csvText.split('\n')[0];
    const semiCount = (firstLine.match(/;/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const delimiter = semiCount > commaCount ? ';' : ',';
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
    });

    const rows = parseResult.data as any[];
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Geen data' }, { status: 400 });
    }

    // Test eerst 1 rij
    const testRow = rows[0];
    const rawPhone = testRow.TelefoonNummer || testRow.Telefoon || testRow.telefoon || testRow.phone;
    const companyName = testRow.Bedrijfsnaam || testRow.Bedrijf || testRow.bedrijf;
    
    if (!rawPhone || !companyName) {
      return NextResponse.json({ 
        error: 'Missing data in first row',
        phone: rawPhone,
        company: companyName
      }, { status: 400 });
    }

    const cleanPhone = rawPhone.toString().replace(/\D/g, '');
    const phoneHash = crypto.createHash('sha256').update(cleanPhone).digest('hex');

    // Probeer 1 lead te maken
    try {
      const lead = await prisma.lead.create({
        data: {
          companyName: companyName.toString().trim(),
          phone: cleanPhone,
          phoneHash: phoneHash,
          status: 'NEW',
          ownerId: session.user.id,
          source: 'IMPORT',
          doNotCall: false,
          consentPhone: true,
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Test lead created',
        leadId: lead.id,
        totalRows: rows.length
      });
      
    } catch (dbErr: any) {
      return NextResponse.json({ 
        error: 'DB Error on first row',
        code: dbErr.code,
        message: dbErr.message,
        meta: dbErr.meta
      }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Import failed', message: error.message },
      { status: 500 }
    );
  }
}
