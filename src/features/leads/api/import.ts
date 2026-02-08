import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'papaparse';
import { prisma } from '@/shared/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/services/auth';
import { z } from 'zod';
import { encryption, gdprHash } from '@/shared/utils/encryption';

// Validatie schema voor CSV rijen
const LeadCSVSchema = z.object({
  Bedrijfsnaam: z.string().min(1),
  Niche: z.string().optional().default('Onbekend'),
  TelefoonNummer: z.string().min(1),
  Gemeente: z.string().optional(),
  Email: z.string().email().optional().or(z.literal('')),
  Adres: z.string().optional(),
  Provincie: z.string().optional(),
  'Niet bellen': z.string().optional().transform(v => v?.toLowerCase() === 'ja' || v?.toLowerCase() === 'true'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Geen bestand geüpload' }, { status: 400 });
    }

    // Alleen CSV toestaan
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Alleen CSV bestanden toegestaan' }, { status: 400 });
    }

    const text = await file.text();
    
    // Parse CSV
    const { data, errors } = parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (errors.length > 0) {
      return NextResponse.json({ 
        error: 'CSV parse fout', 
        details: errors.slice(0, 5) 
      }, { status: 400 });
    }

    const results = {
      success: 0,
      skipped: 0,
      errors: [] as string[],
      duplicates: 0,
    };

    // Normaliseer telefoonnummers en check duplicates
    const rows = data as any[];
    const normalizedPhones = rows.map(row => {
      const phone = row.TelefoonNummer?.toString().trim() || '';
      // Normaliseer naar +32 formaat
      const cleaned = phone.replace(/[\s\-\.\(\)]/g, '');
      if (cleaned.startsWith('0')) {
        return '+32' + cleaned.substring(1);
      }
      return cleaned;
    }).filter(Boolean);
    
    // Check duplicates via phoneHash (performance)
    const phoneHashes = normalizedPhones.map(p => gdprHash(p));
    
    const existingLeads = await prisma.lead.findMany({
      where: {
        ownerId: session.user.id,
        phoneHash: { in: phoneHashes },
      },
      select: { phoneHash: true },
    });
    
    const existingHashes = new Set(existingLeads.map(l => l.phoneHash));

    // Process in batches van 100 voor database performance
    const batchSize = 100;
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      
      const processedBatch = batch.map((row, idx) => {
        try {
          const validated = LeadCSVSchema.parse(row);
          const phone = validated.TelefoonNummer.toString().trim();
          
          // Normaliseer
          const cleaned = phone.replace(/[\s\-\.\(\)]/g, '');
          const normalizedPhone = cleaned.startsWith('0') ? '+32' + cleaned.substring(1) : cleaned;
          const phoneHash = gdprHash(normalizedPhone);
          
          // Skip duplicates
          if (existingHashes.has(phoneHash)) {
            results.duplicates++;
            return null;
          }
          
          // Voeg toe aan existing hashes om duplicates in zelfde import te voorkomen
          existingHashes.add(phoneHash);
          
          return {
            companyName: validated.Bedrijfsnaam,
            niche: validated.Niche,
            encryptedPhone: encryption.encrypt(normalizedPhone),
            phoneHash: phoneHash,
            encryptedEmail: validated.Email ? encryption.encrypt(validated.Email) : null,
            city: validated.Gemeente || null,
            address: validated.Adres || null,
            province: validated.Provincie || null,
            status: 'NEW',
            doNotCall: validated['Niet bellen'] || false,
            ownerId: session.user.id,
            consentPhone: false,
            consentEmail: false,
            consentWhatsapp: false,
            lawfulBasis: 'LEGITIMATE_INTEREST' as const,
            source: 'csv_import',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        } catch (error) {
          results.errors.push(`Rij ${i + idx + 2}: ${error instanceof Error ? error.message : 'Ongeldige data'}`);
          return null;
        }
      }).filter(Boolean);

      if (processedBatch.length > 0) {
        // Prisma SQLite/PostgreSQL createMany
        await prisma.$transaction(
          processedBatch.map(leadData => 
            prisma.lead.create({ data: leadData as any })
          )
        );
        results.success += processedBatch.length;
      }
    }

    return NextResponse.json({
      message: 'Import voltooid',
      imported: results.success,
      duplicates: results.duplicates,
      errors: results.errors.slice(0, 10),
      total: rows.length,
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ 
      error: 'Interne server fout' 
    }, { status: 500 });
  }
}
