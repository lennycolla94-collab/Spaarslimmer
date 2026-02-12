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
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    let csvText = await file.text();
    
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.substring(1);
    }
    
    // Detecteer delimiter
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

    const results = {
      imported: 0,
      errors: [] as string[]
    };

    // Import één voor één
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        const rawPhone = row.TelefoonNummer || row.Telefoon || row.telefoon || row.phone;
        const companyName = row.Bedrijfsnaam || row.Bedrijf || row.bedrijf;
        
        if (!rawPhone || !companyName) {
          results.errors.push(`Rij ${i + 1}: Missing data`);
          continue;
        }

        const cleanPhone = rawPhone.toString().replace(/\D/g, '');
        
        if (cleanPhone.length < 7) {
          results.errors.push(`Rij ${i + 1}: Phone too short`);
          continue;
        }

        // Genereer hash
        const phoneHash = crypto.createHash('sha256').update(cleanPhone).digest('hex');

        // Parse "Niet bellen"
        const nietBellen = row['Niet bellen'] || '';
        const doNotCall = nietBellen.toString().toLowerCase().trim() === 'ja';

        // Insert met try/catch per rij
        try {
          await prisma.lead.create({
            data: {
              companyName: companyName.toString().trim(),
              phone: cleanPhone,
              phoneHash: phoneHash,
              status: 'NEW',
              ownerId: session.user.id,
              source: 'IMPORT',
              doNotCall: doNotCall,
              consentPhone: true,
            }
          });
          results.imported++;
        } catch (dbErr: any) {
          // Als duplicate, negeren
          if (dbErr.code === 'P2002') {
            // Duplicate - skip
          } else {
            results.errors.push(`Rij ${i + 1}: DB error`);
          }
        }
      } catch (err: any) {
        results.errors.push(`Rij ${i + 1}: ${err.message}`);
      }
    }

    return NextResponse.json({
      imported: results.imported,
      duplicates: 0,
      errors: results.errors.slice(0, 10),
      totalErrors: results.errors.length
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Import failed', details: error.message },
      { status: 500 }
    );
  }
}
