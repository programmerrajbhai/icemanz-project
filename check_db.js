const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count({
    where: { categoryId: 'some-category-id' } // I don't know the exact ID, let's just count all products or group by category
  });
  const products = await prisma.product.findMany({
    take: 20,
    include: { category: true }
  });
  console.log(`Total products fetched: ${products.length}`);
  console.log(products.map(p => p.category?.slug).join(', '));
}
main().catch(console.error).finally(() => prisma.$disconnect());
