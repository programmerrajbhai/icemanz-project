import prisma from '@/lib/prisma';
import QuotesClient from './QuotesClient';

export const metadata = {
  title: 'Quote Requests | Admin Dashboard',
};

export default async function QuotesPage() {
  const quotes = await prisma.customQuoteRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <QuotesClient quotes={quotes} />;
}
