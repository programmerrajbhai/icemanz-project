import prisma from '@/lib/prisma';
import EnquiriesClient from './EnquiriesClient';

export const metadata = {
  title: 'General Enquiries | Admin Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function EnquiriesPage() {
  const enquiries = await prisma.generalEnquiry.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <EnquiriesClient initialData={enquiries} />;
}
