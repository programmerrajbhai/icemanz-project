import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    where: { title: 'STX110MP2' }
  });
  console.log(prods[0]);
}

main().catch(console.error).finally(() => prisma.$disconnect());
