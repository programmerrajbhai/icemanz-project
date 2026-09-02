/*
  Warnings:

  - You are about to drop the column `paymentLink` on the `InvoiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `qboPaymentLink` on the `InvoiceRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomQuoteRequest" ADD COLUMN     "email" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "InvoiceRequest" DROP COLUMN "paymentLink",
DROP COLUMN "qboPaymentLink",
ADD COLUMN     "stripeCheckoutUrl" TEXT;
