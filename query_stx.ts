import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: 'STX110MP2', mode: 'insensitive' } },
        { keyFeatures: { contains: 'STX110MP2', mode: 'insensitive' } },
        { description: { contains: 'STX110MP2', mode: 'insensitive' } }
      ]
    }
  });
  console.log(`Found ${prods.length} products with STX110MP2`);
  if (prods.length > 0) {
    console.log(prods[0].title);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
