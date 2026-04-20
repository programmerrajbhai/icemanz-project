import prisma from '@/lib/prisma';
import RefrigerationEquipmentClient from './RefrigerationEquipmentClient';

export const dynamic = 'force-dynamic';

export default async function RefrigerationSubcategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Find category by slug
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  // Fetch all root categories with their subcategories for the sidebar
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
  let title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (category) {
    title = category.name;
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
    // If slug doesn't match an exact category, we fallback to an empty product list or fetch all if "all"
    if (slug === 'all' || !slug) {
      title = "All Products";
      products = await prisma.product.findMany({
        include: {
          category: true
        }
      });
    }
  }

  return (
    <RefrigerationEquipmentClient 
      products={products} 
      categories={dbCategories as any} 
      slug={slug}
      title={title}
    />
  );
}
