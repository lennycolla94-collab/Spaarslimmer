import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
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

    // Parse CSV
    let csvText = await file.text();
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.substring(1);
    }
    
    const firstLine = csvText.split('\n')[0];
    const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
    });

    const rows = parseResult.data as any[];
    
    // Debug: log eerste rij om kolomnamen te zien
    console.log('CSV Headers:', parseResult.meta.fields);
    console.log('First row:', rows[0]);
    
    const MAX_ROWS = 1000;
    
    if (rows.length > MAX_ROWS) {
      return NextResponse.json({ 
        error: `Bestand te groot. Maximum ${MAX_ROWS} leads per import. Jouw bestand heeft ${rows.length} leads. Split het bestand in kleinere delen.`
      }, { status: 400 });
    }

    // Check of de vereiste kolommen aanwezig zijn
    const headers = parseResult.meta.fields || [];
    const hasBedrijfsnaam = headers.some((h: string) => h.toLowerCase().includes('bedrijf') || h.toLowerCase().includes('company'));
    const hasTelefoon = headers.some((h: string) => h.toLowerCase().includes('telefoon') || h.toLowerCase().includes('phone') || h.toLowerCase().includes('tel'));
    
    if (!hasBedrijfsnaam || !hasTelefoon) {
      return NextResponse.json({ 
        error: `CSV kolommen niet herkend. Gevonden kolommen: ${headers.join(', ')}. Vereist: Bedrijfsnaam en TelefoonNummer (of varianten zoals Company, Phone, etc.)`
      }, { status: 400 });
    }

    let imported = 0;
    let duplicates = 0;
    const errors: string[] = [];

    // Process in smaller batches (meer voor betere performance)
    const BATCH_SIZE = 100;
    
    for (let batchStart = 0; batchStart < rows.length; batchStart += BATCH_SIZE) {
      const batch = rows.slice(batchStart, batchStart + BATCH_SIZE);
      
      // Process batch in parallel
      await Promise.all(batch.map(async (row, idx) => {
        const rowNum = batchStart + idx + 1;
        
        try {
          // Helper functie om kolom waarde te vinden (case insensitive + trim)
          const getValue = (...possibleNames: string[]): string | undefined => {
            // Eerst: normalize alle keys in de row (trim lowercase)
            const normalizedRow: Record<string, string> = {};
            for (const [key, value] of Object.entries(row)) {
              const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, '');
              normalizedRow[normalizedKey] = String(value || '');
            }
            
            for (const name of possibleNames) {
              const normalizedName = name.trim().toLowerCase().replace(/\s+/g, '');
              // Try normalized match
              if (normalizedRow[normalizedName] !== undefined) {
                return normalizedRow[normalizedName];
              }
              // Try exact match as fallback
              if (row[name] !== undefined) return row[name];
            }
            return undefined;
          };

          // Vereiste velden (meerdere mogelijke kolomnamen)
          const rawPhone = getValue('TelefoonNummer', 'telefoonnummer', 'Telefoon', 'telefoon', 'Phone', 'phone', 'Tel', 'tel', 'GSM', 'gsm', 'Mobiel', 'mobiel');
          const companyName = getValue('Bedrijfsnaam', 'bedrijfsnaam', 'Bedrijf', 'bedrijf', 'Company', 'company', 'Naam', 'naam')?.toString().trim();
          
          if (!rawPhone || !companyName || companyName === '') {
            errors.push(`Rij ${rowNum}: Mist telefoonnummer of bedrijfsnaam`);
            return;
          }

          // Telefoon: verwijder alle niet-cijfers en spaties
          const cleanPhone = rawPhone.toString().replace(/\D/g, '').replace(/\s/g, '');
          if (cleanPhone.length < 9) {  // Belgische nummers zijn 10 cijfers
            errors.push(`Rij ${rowNum}: Telefoonnummer te kort (${cleanPhone.length} cijfers)`);
            return;
          }

          const phoneHash = crypto.createHash('sha256').update(cleanPhone).digest('hex');

          // Check duplicate
          const existing: any = await prisma.$queryRaw`SELECT id FROM "Lead" WHERE phonehash = ${phoneHash} LIMIT 1`;
          
          if (existing && existing.length > 0) {
            duplicates++;
            return;
          }

          // Optionele velden (flexibele kolomnamen)
          const contactName = getValue('Contactpersoon', 'contactpersoon', 'Contact', 'contact', 'Contactpers', 'contactpers')?.toString().trim() || null;
          const niche = getValue('Niche', 'niche', 'Sector', 'sector', 'Branche', 'branche', 'Industrie', 'industrie')?.toString().trim() || null;
          // Combineer Adres en Straat als beide bestaan
          const adresValue = getValue('Adres', 'adres', 'Adress', 'adress', 'Address', 'address');
          const straatValue = getValue('Straat', 'straat', 'Street', 'street');
          const address = (adresValue || straatValue)?.toString().trim() || null;
          const postalCode = getValue('Postcode', 'postcode', 'Post code', 'post code', 'Zip', 'zip', 'Zipcode', 'zipcode')?.toString().trim() || null;
          const city = getValue('Gemeente', 'gemeente', 'Stad', 'stad', 'City', 'city', 'Plaats', 'plaats')?.toString().trim() || null;
          const province = getValue('Provincie', 'provincie', 'Province', 'province', 'State', 'state')?.toString().trim() || null;
          const email = getValue('Email', 'email', 'E-mail', 'e-mail', 'Mail', 'mail', 'E-mailadres', 'e-mailadres', 'E-mailAdress', 'e-mailadress', 'EmailAdress', 'emailadress')?.toString().trim() || null;
          const currentProvider = getValue('HuidigeProvider', 'huidigeprovider', 'Provider', 'provider', 'Huidige provider', 'huidige provider', 'Leverancier', 'leverancier')?.toString().trim() || null;
          
          const safeCompanyName = companyName || 'Onbekend Bedrijf';
          
          await prisma.$executeRaw`
            INSERT INTO "Lead" (
              id, companyname, phone, phonehash, status, 
              ownerid, source, consentphone, donotcall,
              contactname, niche, address, postalcode, city, province, email, currentprovider,
              createdat, updatedat
            ) VALUES (
              gen_random_uuid(), 
              ${safeCompanyName}, 
              ${cleanPhone}, 
              ${phoneHash}, 
              'NEW', 
              ${session.user.id}, 
              'IMPORT', 
              true, 
              false,
              ${contactName},
              ${niche},
              ${address},
              ${postalCode},
              ${city},
              ${province},
              ${email},
              ${currentProvider},
              NOW(), 
              NOW()
            )
          `;
          imported++;
          
        } catch (err: any) {
          console.error(`Row ${rowNum} error:`, err);
          errors.push(`Rij ${rowNum}: ${err.message}`);
        }
      }));
    }

    const duration = Date.now() - startTime;
    console.log(`Import completed: ${imported}/${rows.length} in ${duration}ms`);

    return NextResponse.json({ 
      imported, 
      duplicates,
      errors: errors.slice(0, 5),
      totalRows: rows.length,
      duration: `${duration}ms`
    });

  } catch (error: any) {
    console.error('IMPORT ERROR:', error);
    return NextResponse.json({ 
      error: error.message
    }, { status: 500 });
  }
}
