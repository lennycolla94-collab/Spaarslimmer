-- Rename columns in Lead table to match Prisma schema with @map
-- This fixes the mismatch between old camelCase columns and new lowercase columns

-- Check if we need to rename columns (PostgreSQL specific)
DO $$
BEGIN
    -- Rename companyName to companyname if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'companyName') THEN
        ALTER TABLE "Lead" RENAME COLUMN "companyName" TO "companyname";
    END IF;

    -- Rename phoneHash to phonehash if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'phoneHash') THEN
        ALTER TABLE "Lead" RENAME COLUMN "phoneHash" TO "phonehash";
    END IF;

    -- Rename contactName to contactname if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'contactName') THEN
        ALTER TABLE "Lead" RENAME COLUMN "contactName" TO "contactname";
    END IF;

    -- Rename postalCode to postalcode if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'postalCode') THEN
        ALTER TABLE "Lead" RENAME COLUMN "postalCode" TO "postalcode";
    END IF;

    -- Rename currentProvider to currentprovider if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'currentProvider') THEN
        ALTER TABLE "Lead" RENAME COLUMN "currentProvider" TO "currentprovider";
    END IF;

    -- Rename currentSupplier to currentsupplier if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'currentSupplier') THEN
        ALTER TABLE "Lead" RENAME COLUMN "currentSupplier" TO "currentsupplier";
    END IF;

    -- Rename consentEmail to consentemail if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'consentEmail') THEN
        ALTER TABLE "Lead" RENAME COLUMN "consentEmail" TO "consentemail";
    END IF;

    -- Rename consentPhone to consentphone if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'consentPhone') THEN
        ALTER TABLE "Lead" RENAME COLUMN "consentPhone" TO "consentphone";
    END IF;

    -- Rename consentWhatsapp to consentwhatsapp if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'consentWhatsapp') THEN
        ALTER TABLE "Lead" RENAME COLUMN "consentWhatsapp" TO "consentwhatsapp";
    END IF;

    -- Rename lawfulBasis to lawfulbasis if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'lawfulBasis') THEN
        ALTER TABLE "Lead" RENAME COLUMN "lawfulBasis" TO "lawfulbasis";
    END IF;

    -- Rename doNotCall to donotcall if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'doNotCall') THEN
        ALTER TABLE "Lead" RENAME COLUMN "doNotCall" TO "donotcall";
    END IF;

    -- Rename gdprAcceptanceDate to gdpracceptancedate if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'gdprAcceptanceDate') THEN
        ALTER TABLE "Lead" RENAME COLUMN "gdprAcceptanceDate" TO "gdpracceptancedate";
    END IF;

    -- Rename privacyPolicyVersion to privacypolicyversion if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'privacyPolicyVersion') THEN
        ALTER TABLE "Lead" RENAME COLUMN "privacyPolicyVersion" TO "privacypolicyversion";
    END IF;

    -- Rename ownerId to ownerId (keep as is - no change needed)

    -- Rename createdAt to createdat if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'createdAt') THEN
        ALTER TABLE "Lead" RENAME COLUMN "createdAt" TO "createdat";
    END IF;

    -- Rename updatedAt to updatedat if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'Lead' AND column_name = 'updatedAt') THEN
        ALTER TABLE "Lead" RENAME COLUMN "updatedAt" TO "updatedat";
    END IF;

    -- Add contactname column if neither camelCase nor lowercase exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Lead' AND column_name IN ('contactName', 'contactname')) THEN
        ALTER TABLE "Lead" ADD COLUMN "contactname" TEXT;
    END IF;

END $$;
