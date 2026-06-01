import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      category: { slug: 'walk-in-cooler-no-floor' },
      type: 'Top-Mount Refrigeration'
    }
  });

  console.log(`Found ${products.length} Top-Mount Refrigeration products`);
  
  // If there are 14, let's look for one that might be wrong
  for (const p of products) {
    if (p.title.includes('Box Only')) {
      console.log(`Fixing type for ${p.title} to No Refrigeration`);
      await prisma.product.update({
        where: { id: p.id },
        data: { type: 'No Refrigeration' }
      });
    }
  }
}

main().finally(() => prisma.$disconnect());