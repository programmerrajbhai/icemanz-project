import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.category.findMany();
  console.log(cats.map(c => ({ name: c.name, slug: c.slug })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
