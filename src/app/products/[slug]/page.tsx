import prisma from '@/lib/prisma';
import ProductListClient from './ProductListClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Find category by slug
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  // Fetch all root categories with their subcategories
  const dbCategories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      subcategories: {
        include: {
          subcategories: true
        }
      }
    }
  });

  let products: any[] = [];

  if (category) {
    // Collect all category IDs (this category + its subcategories + sub-subcategories)
    const categoryIdsToFetch = [category.id];
    
    const subCategories = await prisma.category.findMany({
      where: { parentId: category.id },
      include: { subcategories: true }
    });

    for (const sub of subCategories) {
      categoryIdsToFetch.push(sub.id);
      for (const subSub of sub.subcategories) {
        categoryIdsToFetch.push(subSub.id);
      }
    }

    products = await prisma.product.findMany({
      where: {
        categoryId: { in: categoryIdsToFetch }
      },
      include: {
        category: true
      }
    });
  } else {
    // Fallback if slug doesn't match any category, show all products
    products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
  }

  return <ProductListClient products={products} categories={dbCategories as any} slug={slug} />;
}
