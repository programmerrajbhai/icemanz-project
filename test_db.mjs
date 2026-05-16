import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'walk-in-cooler-no-floor'
      }
    }
  });
  console.log(products.length);
}
main()
