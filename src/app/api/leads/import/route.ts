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

    // Limiteer bestandsgrootte
    if (file.size > 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Bestand te groot. Max 1MB per import.' 
      }, { status: 400 });
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

    if (rows.length > 1000) {
      return NextResponse.json({ 
        error: 'Te veel rijen. Max 1000 leads per import.' 
      }, { status: 400 });
    }

    // Bereid leads voor
    const leadsToCreate: any[] = [];
    const errors: string[] = [];
    const phoneHashes: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        // Haal telefoonnummer op
        const rawPhone = row.TelefoonNummer || row.Telefoon || row.telefoon || row.phone;
        
        if (!rawPhone) {
          errors.push(`Rij ${i + 1}: Geen telefoonnummer`);
          continue;
        }

        // Haal bedrijfsnaam op
        const companyName = row.Bedrijfsnaam || row.Bedrijf || row.bedrijf || row.company;
        
        if (!companyName) {
          errors.push(`Rij ${i + 1}: Geen bedrijfsnaam`);
          continue;
        }

        // Schoon telefoonnummer op (alleen cijfers)
        const cleanPhone = rawPhone.toString().replace(/\D/g, '');
        
        if (cleanPhone.length < 7) {
          errors.push(`Rij ${i + 1}: Telefoonnummer te kort (${cleanPhone})`);
          continue;
        }
        
        // Genereer hash
        const phoneHash = hashPhone(cleanPhone);
        
        // Check of hash geldig is
        if (!phoneHash || phoneHash.length === 0) {
          errors.push(`Rij ${i + 1}: Kan hash niet genereren`);
          continue;
        }

        phoneHashes.push(phoneHash);

        // Parse "Niet bellen"
        const nietBellen = row['Niet bellen'] || '';
        const doNotCall = nietBellen.toString().toLowerCase().trim() === 'ja';

        leadsToCreate.push({
          companyName: companyName.toString().trim(),
          phone: cleanPhone,
          phoneHash: phoneHash,
          status: 'NEW',
          ownerId: session.user.id,
          source: 'IMPORT',
          doNotCall: doNotCall,
          consentPhone: true,
          email: row.Email || row.email || '',
          niche: row.Niche || row.niche || '',
          address: row.Adres || row.adres || '',
          city: row.Gemeente || row.gemeente || '',
          postalCode: row.Postcode || row.postcode || '',
          province: row.Provincie || row.provincie || 'Onbekend',
          currentProvider: row.Provider || row.provider || '',
        });
      } catch (err: any) {
        errors.push(`Rij ${i + 1}: ${err.message}`);
      }
    }

    // Check duplicates in database
    let duplicateCount = 0;
    if (phoneHashes.length > 0) {
      const existingLeads = await prisma.lead.findMany({
        where: { phoneHash: { in: phoneHashes } },
        select: { phoneHash: true }
      });

      const existingHashes = new Set(existingLeads.map(l => l.phoneHash));
      
      // Filter out duplicates
      const uniqueLeads = leadsToCreate.filter(lead => {
        if (existingHashes.has(lead.phoneHash)) {
          duplicateCount++;
          return false;
        }
        return true;
      });

      leadsToCreate.length = 0;
      leadsToCreate.push(...uniqueLeads);
    }

    // Bulk insert
    let importedCount = 0;
    if (leadsToCreate.length > 0) {
      const result = await prisma.lead.createMany({
        data: leadsToCreate,
        skipDuplicates: true,
      });
      importedCount = result.count;
    }

    return NextResponse.json({
      imported: importedCount,
      duplicates: duplicateCount,
      errors: errors.slice(0, 10),
      totalErrors: errors.length
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Import failed', details: error.message },
      { status: 500 }
    );
  }
}
