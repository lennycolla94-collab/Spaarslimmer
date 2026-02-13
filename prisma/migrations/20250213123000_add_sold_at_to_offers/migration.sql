-- Add soldAt column to offers table
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "soldAt" TIMESTAMP(3);

-- Update status enum comment (for documentation)
COMMENT ON COLUMN "offers"."status" IS 'DRAFT, SENT, ACCEPTED, SOLD, REJECTED, EXPIRED';
