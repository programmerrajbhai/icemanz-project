const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({
    where: { category: { slug: 'walk-in-cooler-no-floor' }, brand: 'Amerikooler' }
  });
  let topMountCount = 0;
  for(const p of products) {
    if(p.type === 'Top-Mount Refrigeration') {
      topMountCount++;
      console.log(`- ${p.title}`);
    }
  }
  console.log(`Total Top-Mount: ${topMountCount}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
