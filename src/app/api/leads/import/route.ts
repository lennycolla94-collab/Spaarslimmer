import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import Papa from 'papaparse';

function hashPhone(phone: string): string {
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
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    let csvText = await file.text();
    
    // Verwijder BOM (Byte Order Mark) als deze aanwezig is
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.substring(1);
    }
    
    // Detecteer delimiter: TSV (tab), semicolon (;) of CSV (komma)
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
        error: 'Geen data gevonden in bestand',
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
        // Map Dutch column names to database fields
        const phone = row.TelefoonNummer || row.Telefoon || row.phone || row.telefoon || row.telefoonnummer;
        const companyName = row.Bedrijfsnaam || row.Bedrijf || row.companyName || row.bedrijf || row.bedrijfsnaam;

        if (!phone) {
          results.errors.push(`Rij ${i + 1}: Geen telefoonnummer gevonden`);
          continue;
        }
        
        if (!companyName) {
          results.errors.push(`Rij ${i + 1}: Geen bedrijfsnaam gevonden`);
          continue;
        }

        const cleanPhone = phone.toString().replace(/\s/g, '');
        
        if (cleanPhone.length < 8) {
          results.errors.push(`Rij ${i + 1}: Telefoonnummer te kort (${cleanPhone})`);
          continue;
        }
        
        const phoneHash = hashPhone(cleanPhone);

        // Check for duplicate
        const existing = await prisma.lead.findFirst({
          where: { phoneHash }
        });

        if (existing) {
          results.duplicates++;
          continue;
        }

        // Parse "Niet bellen" (Ja/Nee) naar boolean
        const nietBellen = row['Niet bellen'] || row['niet_bellen'] || row.NietBellen || '';
        const doNotCall = nietBellen.toString().toLowerCase() === 'ja' || 
                          nietBellen.toString().toLowerCase() === 'yes' ||
                          nietBellen.toString().toLowerCase() === 'true';

        // Create the lead with properly mapped fields
        await prisma.lead.create({
          data: {
            companyName: companyName.toString().trim(),
            phone: cleanPhone,
            phoneHash,
            email: row.Email || row.email || '',
            niche: row.Niche || row.niche || row.Branche || row.branche || '',
            address: row.Adres || row.adres || row.adress || row.Address || '',
            city: row.Gemeente || row.gemeente || row.city || row.City || '',
            postalCode: row.Postcode || row.postcode || row.postalCode || '',
            province: row.Provincie || row.provincie || row.province || 'Onbekend',
            currentProvider: row.Provider || row.provider || '',
            currentSupplier: row.Leverancier || row.leverancier || '',
            status: 'NEW',
            ownerId: session.user.id,
            consentPhone: true,
            doNotCall,
            source: 'IMPORT',
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
