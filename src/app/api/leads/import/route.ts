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

    const csvText = await file.text();
    
    // Parse CSV
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
    });

    const rows = parseResult.data as any[];
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Geen data' }, { status: 400 });
    }

    let imported = 0;
    let errors = [] as string[];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      const rawPhone = row.TelefoonNummer;
      const companyName = row.Bedrijfsnaam;
      
      if (!rawPhone || !companyName) {
        errors.push(`Rij ${i + 1}: Telefoon of bedrijf mist`);
        continue;
      }

      // Schoon telefoonnummer (alleen cijfers)
      const cleanPhone = rawPhone.toString().replace(/\D/g, '');
      
      if (cleanPhone.length < 7) {
        errors.push(`Rij ${i + 1}: Telefoon te kort`);
        continue;
      }

      // Hash als string
      const phoneHash: string = crypto.createHash('sha256').update(cleanPhone).digest('hex');

      try {
        // ALLEEN verplichte velden
        await prisma.$executeRaw`
          INSERT INTO "Lead" ("id", "companyName", "phone", "phoneHash", "status", "ownerId", "source", "doNotCall", "consentPhone", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${companyName}, ${cleanPhone}, ${phoneHash}, 'NEW', ${session.user.id}, 'IMPORT', false, true, NOW(), NOW())
          ON CONFLICT ("phoneHash") DO NOTHING
        `;
        imported++;
      } catch (dbErr: any) {
        errors.push(`Rij ${i + 1}: ${dbErr.message}`);
      }
    }

    return NextResponse.json({ imported, errors: errors.slice(0, 5) });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
