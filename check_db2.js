const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    take: 10
  });
  console.log(categories);
}
main().catch(console.error).finally(() => prisma.$disconnect());
