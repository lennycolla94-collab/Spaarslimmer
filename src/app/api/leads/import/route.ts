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
    
    let delimiter = ',';
    if (semiCount > commaCount) delimiter = ';';
    
    // Parse CSV
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
    });

    const rows = parseResult.data as any[];
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Geen data' }, { status: 400 });
    }

    let imported = 0;
    let duplicates = 0;
    let errors = [] as string[];

    // Verzamel alle phoneHashes uit CSV
    const phoneHashesInFile = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      const rawPhone = row.TelefoonNummer;
      const companyName = row.Bedrijfsnaam;
      
      if (!rawPhone || !companyName) {
        errors.push(`Rij ${i + 1}: Telefoon of bedrijf mist`);
        continue;
      }

      const cleanPhone = rawPhone.toString().replace(/\D/g, '');
      
      if (cleanPhone.length < 7) {
        errors.push(`Rij ${i + 1}: Telefoon te kort`);
        continue;
      }

      const phoneHash = crypto.createHash('sha256').update(cleanPhone).digest('hex');
      
      // Check duplicate in huidige file
      if (phoneHashesInFile.has(phoneHash)) {
        duplicates++;
        continue;
      }
      phoneHashesInFile.add(phoneHash);

      // Check duplicate in database
      const existing = await prisma.lead.findFirst({
        where: { phoneHash }
      });
      
      if (existing) {
        duplicates++;
        continue;
      }

      try {
        // Insert zonder ON CONFLICT
        await prisma.lead.create({
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
        imported++;
      } catch (dbErr: any) {
        if (dbErr.code === 'P2002') {
          duplicates++; // Duplicate key
        } else {
          errors.push(`Rij ${i + 1}: ${dbErr.message}`);
        }
      }
    }

    return NextResponse.json({ imported, duplicates, errors: errors.slice(0, 5) });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
