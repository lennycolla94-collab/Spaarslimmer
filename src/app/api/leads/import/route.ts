import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import Papa from 'papaparse';

function hashPhone(phone: string): string {
  if (!phone || phone.length === 0) {
    throw new Error('Cannot hash empty phone');
  }
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

    if (file.size > 1024 * 1024) {
      return NextResponse.json({ error: 'Bestand te groot. Max 1MB.' }, { status: 400 });
    }

    let csvText = await file.text();
    
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
    
    console.log('DELIMITER:', JSON.stringify(delimiter));
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
      transformHeader: (header) => header.trim(),
    });

    const rows = parseResult.data as any[];
    console.log('ROWS:', rows.length);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Geen data' }, { status: 400 });
    }

    // Toon eerste rij
    console.log('FIRST ROW:', JSON.stringify(rows[0]));

    const leadsToCreate: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        const rawPhone = row.TelefoonNummer || row.Telefoon || row.telefoon || row.phone;
        
        if (!rawPhone) {
          errors.push(`Rij ${i + 1}: Geen telefoonnummer`);
          continue;
        }

        const companyName = row.Bedrijfsnaam || row.Bedrijf || row.bedrijf;
        
        if (!companyName) {
          errors.push(`Rij ${i + 1}: Geen bedrijfsnaam`);
          continue;
        }

        // Schoon telefoonnummer
        const cleanPhone = rawPhone.toString().replace(/\D/g, '');
        
        if (cleanPhone.length < 7) {
          errors.push(`Rij ${i + 1}: Telefoon te kort (${cleanPhone})`);
          continue;
        }
        
        // Genereer hash
        const phoneHash = hashPhone(cleanPhone);
        
        // EXTRA CHECK: zorg dat hash niet leeg is
        if (!phoneHash || phoneHash === '') {
          errors.push(`Rij ${i + 1}: Hash is leeg!`);
          continue;
        }

        console.log(`Row ${i + 1}: phone=${cleanPhone}, hash=${phoneHash.substring(0, 10)}...`);

        const nietBellen = row['Niet bellen'] || '';
        const doNotCall = nietBellen.toString().toLowerCase().trim() === 'ja';

        const leadData = {
          companyName: companyName.toString().trim(),
          phone: cleanPhone,
          phoneHash: phoneHash,
          status: 'NEW',
          ownerId: session.user.id,
          source: 'IMPORT',
          doNotCall: doNotCall,
          consentPhone: true,
        };

        // Check of phoneHash echt in het object zit
        if (!leadData.phoneHash) {
          errors.push(`Rij ${i + 1}: phoneHash missing in object`);
          continue;
        }

        leadsToCreate.push(leadData);
      } catch (err: any) {
        errors.push(`Rij ${i + 1}: ${err.message}`);
      }
    }

    console.log('LEADS TO CREATE:', leadsToCreate.length);
    console.log('FIRST LEAD:', JSON.stringify(leadsToCreate[0]));

    // Check voor null phoneHash
    const nullHashLeads = leadsToCreate.filter(l => !l.phoneHash);
    if (nullHashLeads.length > 0) {
      console.error('FOUND LEADS WITH NULL phoneHash:', nullHashLeads.length);
      return NextResponse.json({ 
        error: 'Debug: Null phoneHash found', 
        count: nullHashLeads.length 
      }, { status: 500 });
    }

    // Bulk insert
    let importedCount = 0;
    if (leadsToCreate.length > 0) {
      try {
        const result = await prisma.lead.createMany({
          data: leadsToCreate,
          skipDuplicates: true,
        });
        importedCount = result.count;
      } catch (dbError: any) {
        console.error('DB ERROR:', dbError);
        return NextResponse.json({ 
          error: 'Database error', 
          details: dbError.message 
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      imported: importedCount,
      duplicates: 0,
      errors: errors.slice(0, 10),
      totalErrors: errors.length
    });

  } catch (error: any) {
    console.error('IMPORT ERROR:', error);
    return NextResponse.json(
      { error: 'Import failed', details: error.message },
      { status: 500 }
    );
  }
}
