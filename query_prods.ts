import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    include: { category: true }
  });
  console.log(`Total products: ${prods.length}`);
  const catCounts = prods.reduce((acc, p) => {
    const cat = p.category?.slug || 'none';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  console.log(catCounts);
}

main().catch(console.error).finally(() => prisma.$disconnect());
