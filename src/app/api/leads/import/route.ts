import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import Papa from 'papaparse';

function hashPhone(phone: string): string {
  if (!phone) return '';
  return crypto.createHash('sha256').update(phone).digest('hex');
}

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
    
    // Verwijder BOM
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.substring(1);
    }
    
    // Detecteer delimiter
    const firstLine = csvText.split('\n')[0];
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semiCount = (firstLine.match(/;/g) || []).length;
    
    let delimiter = ',';
    if (semiCount > commaCount && semiCount > tabCount) {
      delimiter = ';';
    } else if (tabCount > commaCount) {
      delimiter = '\t';
    }
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
      transformHeader: (header) => header.trim(),
    });

    const rows = parseResult.data as any[];
    
    if (rows.length === 0) {
      return NextResponse.json({ 
        error: 'Geen data gevonden',
        imported: 0,
        duplicates: 0,
        errors: ['Bestand bevat geen rijen'] 
      }, { status: 400 });
    }

    const results = {
      imported: 0,
      duplicates: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        // Haal telefoonnummer op
        let phone = row.TelefoonNummer || row.Telefoon || row.telefoon || row.phone;
        
        if (!phone) {
          results.errors.push(`Rij ${i + 1}: Geen telefoonnummer gevonden`);
          continue;
        }

        // Haal bedrijfsnaam op
        let companyName = row.Bedrijfsnaam || row.Bedrijf || row.bedrijf || row.company;
        
        if (!companyName) {
          results.errors.push(`Rij ${i + 1}: Geen bedrijfsnaam gevonden`);
          continue;
        }

        // Schoon telefoonnummer op
        const cleanPhone = phone.toString().replace(/\s/g, '').replace(/\D/g, '');
        
        if (cleanPhone.length < 7) {
          results.errors.push(`Rij ${i + 1}: Telefoonnummer te kort (${cleanPhone})`);
          continue;
        }
        
        // Genereer hash
        const phoneHash = hashPhone(cleanPhone);
        
        if (!phoneHash) {
          results.errors.push(`Rij ${i + 1}: Kan hash niet genereren`);
          continue;
        }

        // Check for duplicate
        const existing = await prisma.lead.findFirst({
          where: { phoneHash }
        });

        if (existing) {
          results.duplicates++;
          continue;
        }

        // Parse "Niet bellen"
        const nietBellen = row['Niet bellen'] || '';
        const doNotCall = nietBellen.toString().toLowerCase().trim() === 'ja';

        // Create the lead
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
      } catch (err: any) {
        results.errors.push(`Rij ${i + 1}: ${err.message || 'Onbekende fout'}`);
      }
    }

    return NextResponse.json({
      imported: results.imported,
      duplicates: results.duplicates,
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
