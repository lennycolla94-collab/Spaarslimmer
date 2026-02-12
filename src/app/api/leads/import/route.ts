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
    
    // DEBUG: Log eerste 500 karakters
    console.log('DEBUG - Raw text (first 500 chars):', csvText.substring(0, 500));
    
    // Detecteer delimiter: TSV (tab), semicolon (;) of CSV (komma)
    const firstLine = csvText.split('\n')[0];
    console.log('DEBUG - First line:', firstLine);
    
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semiCount = (firstLine.match(/;/g) || []).length;
    
    let delimiter = ',';
    if (semiCount > commaCount && semiCount > tabCount) {
      delimiter = ';';
    } else if (tabCount > commaCount) {
      delimiter = '\t';
    }
    console.log('DEBUG - Tabs:', tabCount, 'Commas:', commaCount, 'Semicolons:', semiCount, 'Using:', JSON.stringify(delimiter));
    
    console.log('DEBUG - Tabs:', tabCount, 'Commas:', commaCount, 'Using delimiter:', JSON.stringify(delimiter));
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
      transformHeader: (header) => header.trim(), // Trim alle headers
    });

    const leads = parseResult.data as any[];
    
    console.log('DEBUG - Total rows:', leads.length);
    
    if (leads.length === 0) {
      return NextResponse.json({ 
        error: 'Geen data gevonden in bestand',
        imported: 0,
        duplicates: 0,
        errors: ['Bestand bevat geen rijen'] 
      }, { status: 400 });
    }
    
    // DEBUG: Log eerste rij
    console.log('DEBUG - Eerste rij:', JSON.stringify(leads[0]));
    console.log('DEBUG - Kolomnamen:', Object.keys(leads[0]));

    const results = {
      imported: 0,
      duplicates: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      
      try {
        // Haal waarden op met verschillende mogelijke kolomnamen
        const phone = lead.TelefoonNummer || lead.Telefoon || lead.phone || lead.telefoon || lead.telefoonnummer;
        const companyName = lead.Bedrijfsnaam || lead.Bedrijf || lead.companyName || lead.bedrijf || lead.bedrijfsnaam;

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
        const nietBellen = lead['Niet bellen'] || lead['niet_bellen'] || lead.NietBellen || '';
        const doNotCall = nietBellen.toString().toLowerCase() === 'ja' || 
                          nietBellen.toString().toLowerCase() === 'yes' ||
                          nietBellen.toString().toLowerCase() === 'true';

        await prisma.lead.create({
          data: {
            companyName: companyName.toString().trim(),
            contactName: lead.Contact || lead.contact || '',
            email: lead.Email || lead.email || '',
            phone: cleanPhone,
            phoneHash,
            address: lead.Adres || lead.adres || lead.adress || '',
            city: lead.Gemeente || lead.gemeente || lead.city || '',
            postalCode: lead.Postcode || lead.postcode || lead.postalCode || '',
            province: lead.Provincie || lead.provincie || lead.province || 'Onbekend',
            niche: lead.Niche || lead.niche || lead.Branche || lead.branche || '',
            currentProvider: lead.Provider || lead.provider || '',
            currentSupplier: lead.Leverancier || lead.leverancier || '',
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
      errors: results.errors.slice(0, 10), // Max 10 errors tonen
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
