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
    const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
    });

    const rows = parseResult.data as any[];
    let imported = 0;
    let duplicates = 0;
    let errors = [] as string[];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        const rawPhone = row['TelefoonNummer'];
        const companyName = row['Bedrijfsnaam']?.toString().trim();
        
        if (!rawPhone || !companyName || companyName === '') {
          errors.push(`Rij ${i + 1}: Mist telefoonnummer of bedrijfsnaam`);
          continue;
        }

        const cleanPhone = rawPhone.toString().replace(/\D/g, '');
        if (cleanPhone.length < 7) {
          errors.push(`Rij ${i + 1}: Telefoon te kort`);
          continue;
        }

        const phoneHash = crypto.createHash('sha256').update(cleanPhone).digest('hex');

        // Check duplicate met raw SQL
        const existing: any = await prisma.$queryRaw`SELECT id FROM "Lead" WHERE phonehash = ${phoneHash} LIMIT 1`;
        
        if (existing && existing.length > 0) {
          duplicates++;
          continue;
        }

        // Insert met raw SQL - alle velden in juiste volgorde
        // Fallback voor companyName indien leeg
        const safeCompanyName = companyName && companyName.trim() !== '' ? companyName.trim() : 'Onbekend Bedrijf';
        
        await prisma.$executeRaw`
          INSERT INTO "Lead" (
            id, companyname, phone, phonehash, status, 
            ownerid, source, consentphone, donotcall,
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
            NOW(), 
            NOW()
          )
        `;
        imported++;
        
      } catch (err: any) {
        console.error(`Row ${i+1} error:`, err);
        errors.push(`Rij ${i + 1}: ${err.message}`);
      }
    }

    return NextResponse.json({ 
      imported, 
      duplicates,
      errors: errors.slice(0, 5),
      totalRows: rows.length
    });

  } catch (error: any) {
    console.error('IMPORT ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
