-- AlterTable
ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT,
ADD COLUMN "shippingName" TEXT,
ADD COLUMN "shippingAddress" TEXT,
ADD COLUMN "shippingCity" TEXT,
ADD COLUMN "shippingState" TEXT,
ADD COLUMN "shippingZip" TEXT,
ADD COLUMN "shippingCountry" TEXT,
ADD COLUMN "deliveryMethod" TEXT;
