import prisma from '@/lib/prisma';
import InvoicesClient from './InvoicesClient';

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
  const invoices = await prisma.invoiceRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Convert Prisma Date objects to standard ISO strings or pass directly if supported by Client Components
  // Next.js App Router allows passing Date objects to Client Components natively now.
  
  return (
    <div className="w-full">
      <InvoicesClient initialInvoices={invoices} />
    </div>
  );
}
