import prisma from '@/lib/prisma';
import RequestInvoiceClient from './RequestInvoiceClient';
import { notFound } from 'next/navigation';

export default async function RequestInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>
}) {
  const { productId } = await searchParams;

  let initialAddedProduct = null;
  if (productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        images: true,
        price: true,
        badge: true,
        category: {
          select: { name: true }
        }
      }
    });

    if (product) {
      initialAddedProduct = {
        id: product.id,
        brand: product.category?.name || 'ICEMANZ',
        title: product.title,
        image: product.images[0] || '/Walk-inCooler&Freezer/combounits.jpg',
        rating: 5,
        reviews: 0,
        price: product.price ? (product.price.startsWith('$') ? product.price : `$${product.price}`) : 'Price on Request',
        href: '#'
      };
    }
  }

  // Fetch some random/recent products for the suggested sidebar
  const dbProducts = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      images: true,
      price: true,
      category: { select: { name: true } }
    }
  });

  const initialSuggestedProducts = dbProducts
    .filter(p => p.id !== productId) // Don't suggest the one we are already requesting
    .map((p, i) => ({
      id: p.id,
      brand: p.category?.name || 'ICEMANZ',
      title: p.title,
      image: p.images[0] || `/slider/s_${(i % 3) + 1}.jpeg`,
      rating: 4 + (i % 2), // random-ish rating 4 or 5
      reviews: 100 + (i * 23),
      price: p.price ? (p.price.startsWith('$') ? p.price : `$${p.price}`) : 'Price on Request',
      href: '#'
    }));

  return (
    <RequestInvoiceClient 
      initialAddedProduct={initialAddedProduct} 
      initialSuggestedProducts={initialSuggestedProducts} 
    />
  );
}
