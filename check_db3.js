const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count({
    where: { title: { contains: 'Walk-In', mode: 'insensitive' } }
  });
  console.log(`Total Walk-In products: ${count}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
