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

    const csvText = await file.text();
    
    // Detecteer of het een TSV (tab) of CSV (komma) bestand is
    const firstLine = csvText.split('\n')[0];
    const delimiter = firstLine.includes('\t') ? '\t' : ',';
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: delimiter,
    });

    const leads = parseResult.data as any[];

    const results = {
      imported: 0,
      duplicates: 0,
      errors: [] as string[]
    };

    for (const lead of leads) {
      try {
        const phone = lead.TelefoonNummer || lead.phone || lead.telefoon;
        const companyName = lead.Bedrijfsnaam || lead.companyName || lead.bedrijf;

        if (!phone || !companyName) {
          results.errors.push(`Missing phone or company name for row`);
          continue;
        }

        const cleanPhone = phone.toString().replace(/\s/g, '');
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
        const nietBellen = lead['Niet bellen'] || lead['niet_bellen'] || '';
        const doNotCall = nietBellen.toString().toLowerCase() === 'ja' || 
                          nietBellen.toString().toLowerCase() === 'yes' ||
                          nietBellen.toString().toLowerCase() === 'true';

        await prisma.lead.create({
          data: {
            companyName,
            email: lead.Email || lead.email || '',
            phone: cleanPhone,
            phoneHash,
            address: lead.Adres || lead.address || '',
            city: lead.Gemeente || lead.city || '',
            postalCode: lead.Postcode || lead.postalCode || '',
            province: lead.Provincie || lead.province || 'Onbekend',
            niche: lead.Niche || lead.niche || '',
            currentProvider: lead.Provider || lead.provider || '',
            status: 'NEW',
            ownerId: session.user.id,
            consentPhone: true,
            doNotCall,
            source: 'IMPORT',
          }
        });

        results.imported++;
      } catch (err) {
        results.errors.push(`Failed to import: ${err}`);
      }
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Import failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
