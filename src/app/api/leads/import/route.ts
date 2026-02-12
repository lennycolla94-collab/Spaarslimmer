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

    const results = {
      imported: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        const rawPhone = row.TelefoonNummer || row.Telefoon || row.telefoon || row.phone;
        const companyName = row.Bedrijfsnaam || row.Bedrijf || row.bedrijf;
        
        if (!rawPhone || !companyName) {
          results.errors.push(`Rij ${i + 1}: Missing phone or company`);
          continue;
        }

        const cleanPhone = rawPhone.toString().replace(/\D/g, '');
        
        if (cleanPhone.length < 7) {
          results.errors.push(`Rij ${i + 1}: Phone too short: ${cleanPhone}`);
          continue;
        }

        // Genereer hash - FORCEER dat het een string is
        const hash = crypto.createHash('sha256');
        hash.update(cleanPhone);
        const phoneHash = hash.digest('hex');
        
        // EXTRA CHECK: zorg dat hash echt een string is
        if (typeof phoneHash !== 'string' || phoneHash.length === 0) {
          results.errors.push(`Rij ${i + 1}: Hash generation failed`);
          continue;
        }

        const nietBellen = row['Niet bellen'] || '';
        const doNotCall = nietBellen.toString().toLowerCase().trim() === 'ja';

        // Log voor debugging
        console.log(`Row ${i + 1}: phone=${cleanPhone}, hash=${phoneHash.substring(0, 10)}...`);

        // Insert
        await prisma.lead.create({
          data: {
            companyName: companyName.toString().trim(),
            phone: cleanPhone,
            phoneHash: phoneHash, // EXPLICIET als string
            status: 'NEW',
            ownerId: session.user.id,
            source: 'IMPORT',
            doNotCall: doNotCall,
            consentPhone: true,
          }
        });

        results.imported++;
      } catch (err: any) {
        results.errors.push(`Rij ${i + 1}: ${err.message}`);
      }
    }

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Import failed', message: error.message },
      { status: 500 }
    );
  }
}
