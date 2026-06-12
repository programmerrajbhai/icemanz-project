const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({
    where: { category: { slug: 'condensing-units' } },
    take: 5
  });
  console.log(products);
}

check();
