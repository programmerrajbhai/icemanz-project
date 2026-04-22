import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient';

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const { slug, id } = await params;

  // Fetch the product by ID with its category
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          parent: {
            include: { parent: true }
          }
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category only
  let relatedProducts: any[] = [];
  if (product.categoryId) {
    relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      take: 5,
      include: { category: true }
    });
  }

  return (
    <ProductDetailsClient 
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
      slug={slug}
    />
  );
}
