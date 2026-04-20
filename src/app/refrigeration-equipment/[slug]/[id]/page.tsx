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

  // Fetch related products from the same category
  let relatedProducts: any[] = [];
  if (product.categoryId) {
    // Get products from same category or parent category
    const categoryIds = [product.categoryId];
    
    // Also get sibling categories if there's a parent
    if (product.category?.parentId) {
      const siblings = await prisma.category.findMany({
        where: { parentId: product.category.parentId }
      });
      siblings.forEach(s => categoryIds.push(s.id));
    }

    relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        id: { not: product.id }
      },
      take: 5,
      include: { category: true }
    });
  }

  // If not enough related products, fill with random products
  if (relatedProducts.length < 5) {
    const moreProducts = await prisma.product.findMany({
      where: {
        id: { notIn: [product.id, ...relatedProducts.map(p => p.id)] }
      },
      take: 5 - relatedProducts.length,
      include: { category: true }
    });
    relatedProducts = [...relatedProducts, ...moreProducts];
  }

  return (
    <ProductDetailsClient 
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
      slug={slug}
    />
  );
}
