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
    const MAX_ROWS = 500; // Limiet om timeout te voorkomen
    
    if (rows.length > MAX_ROWS) {
      return NextResponse.json({ 
        error: `Bestand te groot. Maximum ${MAX_ROWS} leads per import. Jouw bestand heeft ${rows.length} leads. Split het bestand in kleinere delen.`
      }, { status: 400 });
    }

    let imported = 0;
    let duplicates = 0;
    const errors: string[] = [];

    // Process in smaller batches
    const BATCH_SIZE = 50;
    
    for (let batchStart = 0; batchStart < rows.length; batchStart += BATCH_SIZE) {
      const batch = rows.slice(batchStart, batchStart + BATCH_SIZE);
      
      // Process batch in parallel
      await Promise.all(batch.map(async (row, idx) => {
        const rowNum = batchStart + idx + 1;
        
        try {
          // Vereiste velden
          const rawPhone = row['TelefoonNummer'];
          const companyName = row['Bedrijfsnaam']?.toString().trim();
          
          if (!rawPhone || !companyName || companyName === '') {
            errors.push(`Rij ${rowNum}: Mist telefoonnummer of bedrijfsnaam`);
            return;
          }

          const cleanPhone = rawPhone.toString().replace(/\D/g, '');
          if (cleanPhone.length < 7) {
            errors.push(`Rij ${rowNum}: Telefoon te kort`);
            return;
          }

          const phoneHash = crypto.createHash('sha256').update(cleanPhone).digest('hex');

          // Check duplicate
          const existing: any = await prisma.$queryRaw`SELECT id FROM "Lead" WHERE phonehash = ${phoneHash} LIMIT 1`;
          
          if (existing && existing.length > 0) {
            duplicates++;
            return;
          }

          // Optionele velden
          const contactName = row['Contactpersoon']?.toString().trim() || null;
          const niche = row['Niche']?.toString().trim() || null;
          const address = row['Adres']?.toString().trim() || null;
          const postalCode = row['Postcode']?.toString().trim() || null;
          const city = row['Gemeente']?.toString().trim() || null;
          const province = row['Provincie']?.toString().trim() || null;
          const email = row['Email']?.toString().trim() || null;
          const currentProvider = row['HuidigeProvider']?.toString().trim() || null;
          
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
