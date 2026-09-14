import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CondensingUnitProductClient from './CondensingUnitProductClient';

export const dynamic = 'force-dynamic';

export default async function CondensingUnitDetailsPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const { slug, id } = await params;

  // Fetch product from database
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true
    }
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same brand or category)
  const relatedProducts = await prisma.product.findMany({
    where: {
      OR: [
        { categoryId: product.categoryId },
        { brand: product.brand }
      ],
      id: { not: product.id }
    },
    take: 8,
    include: { category: true }
  });

  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedRelated = JSON.parse(JSON.stringify(relatedProducts));

  return (
    <CondensingUnitProductClient
      product={serializedProduct}
      relatedProducts={serializedRelated}
    />
  );
}
