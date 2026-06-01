import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
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
  for (const root of rootCategories) {
    categoryIdsToFetch.push(root.id);
    for (const sub of root.subcategories) {
      categoryIdsToFetch.push(sub.id);
      for (const subSub of sub.subcategories) {
        categoryIdsToFetch.push(subSub.id);
      }
    }
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIdsToFetch }
    }
  });
  console.log('Total products matched:', products.length);
  console.log('categoryIdsToFetch count:', categoryIdsToFetch.length);
  console.log('categoryIdsToFetch:', categoryIdsToFetch);
}

main().catch(console.error).finally(() => prisma.$disconnect());
