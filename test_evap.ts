import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const slug = 'evaporation-units';
  const category = await prisma.category.findUnique({ where: { slug } });
  
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

  const products = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIdsToFetch }
    }
  });
  console.log(`Products for ${slug}: ${products.length}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
