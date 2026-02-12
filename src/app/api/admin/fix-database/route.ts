import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// This endpoint fixes the database column names to match the Prisma schema
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Temporarily allow any authenticated user to fix the database
    // TODO: Change back to admin only after fixing
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fix 1: Add missing contactname column if it doesn't exist
    await prisma.$executeRaw`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'Lead' AND column_name = 'contactname') THEN
          ALTER TABLE "Lead" ADD COLUMN "contactname" TEXT;
        END IF;
      END $$;
    `;

    // Fix 2: Rename companyName to companyname if needed
    await prisma.$executeRaw`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'companyName') THEN
          ALTER TABLE "Lead" RENAME COLUMN "companyName" TO "companyname";
        END IF;
      END $$;
    `;

    // Fix 3: Rename phoneHash to phonehash if needed
    await prisma.$executeRaw`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'phoneHash') THEN
          ALTER TABLE "Lead" RENAME COLUMN "phoneHash" TO "phonehash";
        END IF;
      END $$;
    `;

    // Fix 4: Rename other columns
    await prisma.$executeRaw`
      DO $$
      BEGIN
        -- postalCode -> postalcode
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'postalCode') THEN
          ALTER TABLE "Lead" RENAME COLUMN "postalCode" TO "postalcode";
        END IF;

        -- currentProvider -> currentprovider
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'currentProvider') THEN
          ALTER TABLE "Lead" RENAME COLUMN "currentProvider" TO "currentprovider";
        END IF;

        -- currentSupplier -> currentsupplier
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'currentSupplier') THEN
          ALTER TABLE "Lead" RENAME COLUMN "currentSupplier" TO "currentsupplier";
        END IF;

        -- consentEmail -> consentemail
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'consentEmail') THEN
          ALTER TABLE "Lead" RENAME COLUMN "consentEmail" TO "consentemail";
        END IF;

        -- consentPhone -> consentphone
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'consentPhone') THEN
          ALTER TABLE "Lead" RENAME COLUMN "consentPhone" TO "consentphone";
        END IF;

        -- consentWhatsapp -> consentwhatsapp
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'consentWhatsapp') THEN
          ALTER TABLE "Lead" RENAME COLUMN "consentWhatsapp" TO "consentwhatsapp";
        END IF;

        -- lawfulBasis -> lawfulbasis
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'lawfulBasis') THEN
          ALTER TABLE "Lead" RENAME COLUMN "lawfulBasis" TO "lawfulbasis";
        END IF;

        -- doNotCall -> donotcall
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'doNotCall') THEN
          ALTER TABLE "Lead" RENAME COLUMN "doNotCall" TO "donotcall";
        END IF;

        -- gdprAcceptanceDate -> gdpracceptancedate
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'gdprAcceptanceDate') THEN
          ALTER TABLE "Lead" RENAME COLUMN "gdprAcceptanceDate" TO "gdpracceptancedate";
        END IF;

        -- privacyPolicyVersion -> privacypolicyversion
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'privacyPolicyVersion') THEN
          ALTER TABLE "Lead" RENAME COLUMN "privacyPolicyVersion" TO "privacypolicyversion";
        END IF;

        -- createdAt -> createdat
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'createdAt') THEN
          ALTER TABLE "Lead" RENAME COLUMN "createdAt" TO "createdat";
        END IF;

        -- updatedAt -> updatedat
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name = 'updatedAt') THEN
          ALTER TABLE "Lead" RENAME COLUMN "updatedAt" TO "updatedat";
        END IF;
      END $$;
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Database columns fixed successfully' 
    });

  } catch (error: any) {
    console.error('Database fix error:', error);
    return NextResponse.json({ 
      error: 'Failed to fix database', 
      details: error.message 
    }, { status: 500 });
  }
}
