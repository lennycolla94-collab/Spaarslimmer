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
    
    // Verwijder BOM
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.substring(1);
    }
    
    // Detecteer delimiter
    const firstLine = csvText.split('\n')[0];
    const semiCount = (firstLine.match(/;/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const delimiter = semiCount > commaCount ? ';' : ',';
    
    // Parse CSV
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
    });

    const rows = parseResult.data as any[];
    
    // DEBUG: Log wat we hebben
    console.log('Total rows:', rows.length);
    console.log('First row:', JSON.stringify(rows[0]));
    console.log('Columns:', Object.keys(rows[0] || {}));

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Geen data gevonden' }, { status: 400 });
    }

    let imported = 0;
    let duplicates = 0;
    let errors = [] as string[];

    for (let i = 0; i < Math.min(rows.length, 50); i++) { // Max 50 voor test
      const row = rows[i];
      
      try {
        // Haal data op met verschillende mogelijke kolomnamen
        const rawPhone = row['TelefoonNummer'] || row['telefoonNummer'] || row['telefoonnummer'];
        const companyName = row['Bedrijfsnaam'] || row['bedrijfsnaam'];
        
        console.log(`Row ${i + 1}: phone=${rawPhone}, company=${companyName}`);
        
        if (!rawPhone || !companyName) {
          errors.push(`Rij ${i + 1}: Mist data`);
          continue;
        }

        const cleanPhone = rawPhone.toString().replace(/\D/g, '');
        
        if (cleanPhone.length < 7) {
          errors.push(`Rij ${i + 1}: Telefoon te kort: ${cleanPhone}`);
          continue;
        }

        const phoneHash = crypto.createHash('sha256').update(cleanPhone).digest('hex');

        // Check duplicate
        const existing = await prisma.lead.findFirst({
          where: { phoneHash }
        });
        
        if (existing) {
          duplicates++;
          continue;
        }

        // Insert
        const newLead = await prisma.lead.create({
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
        
        console.log(`Row ${i + 1}: CREATED ${newLead.id}`);
        imported++;
        
      } catch (err: any) {
        console.error(`Row ${i + 1} ERROR:`, err.message);
        errors.push(`Rij ${i + 1}: ${err.message}`);
      }
    }

    return NextResponse.json({ 
      imported, 
      duplicates, 
      errors: errors.slice(0, 5),
      message: `Processed ${Math.min(rows.length, 50)} rows`
    });

  } catch (error: any) {
    console.error('IMPORT ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
