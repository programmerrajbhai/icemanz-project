import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'walk-in-cooler-freezer'
      }
    }
  });
  console.log('Products in walk-in-cooler-freezer:', products.length);
}
main()
