-- Remove QuickBooks payment link (we use Stripe for payments now)
ALTER TABLE "InvoiceRequest" DROP COLUMN IF EXISTS "qboPaymentLink";

-- Remove old paymentLink field
ALTER TABLE "InvoiceRequest" DROP COLUMN IF EXISTS "paymentLink";

-- Add Stripe checkout URL field  
ALTER TABLE "InvoiceRequest" ADD COLUMN IF NOT EXISTS "stripeCheckoutUrl" TEXT;

-- Note: qboInvoiceId and qboCustomerId are kept for accounting/invoicing purposes only
