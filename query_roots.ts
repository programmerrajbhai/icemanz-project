import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const rootSlugs = ['evaporation-units', 'condensing-units', 'combo-units-package-units'];
  const cats = await prisma.category.findMany({
    where: { slug: { in: rootSlugs } },
  });
  console.log(cats);
}

main().catch(console.error).finally(() => prisma.$disconnect());
