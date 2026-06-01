import prisma from '@/lib/prisma';
import RefrigerationEquipmentClient from './(with-sidebar)/[slug]/RefrigerationEquipmentClient';

export const revalidate = 3600; // Revalidate every hour

export default async function RefrigerationEquipmentPage() {
  // Fetch all root categories for the sidebar
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

  // Fetch root categories that belong to refrigeration equipment
  const rootSlugs = ['evaporation-units', 'condensing-units', 'combo-units-package-units'];
  const rootCategories = await prisma.category.findMany({
    where: { slug: { in: rootSlugs } },
    include: {
      subcategories: {
        include: {
          subcategories: true
        }
      }
    }
  });

  const categoryIdsToFetch: string[] = [];

  // Collect all category IDs (root + subcategories + sub-subcategories)
  for (const root of rootCategories) {
    categoryIdsToFetch.push(root.id);
    for (const sub of root.subcategories) {
      categoryIdsToFetch.push(sub.id);
      for (const subSub of sub.subcategories) {
        categoryIdsToFetch.push(subSub.id);
      }
    }
  }

  // Fetch products
  const products = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIdsToFetch }
    },
    include: {
      category: true
    }
  });

  return (
    <RefrigerationEquipmentClient
      products={products}
      categories={dbCategories as any}
      slug="refrigeration-equipment"
      title="Refrigeration Equipment"
    />
  );
}
