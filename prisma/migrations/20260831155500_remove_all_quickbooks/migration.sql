-- Remove all QuickBooks related fields and tables
-- This migration completely removes QuickBooks integration

-- Remove QuickBooks fields from InvoiceRequest
ALTER TABLE "InvoiceRequest" DROP COLUMN IF EXISTS "qboInvoiceId";
ALTER TABLE "InvoiceRequest" DROP COLUMN IF EXISTS "qboCustomerId";

-- Drop QboToken table completely
DROP TABLE IF EXISTS "QboToken";
