import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'walk-in-combo-cooler-freezer'
      }
    },
    select: {
      sku: true,
      title: true,
      images: true
    }
  });

  console.log('\nProduct Images in Database:');
  console.log('============================\n');
  
  products.forEach(product => {
    console.log(`SKU: ${product.sku}`);
    console.log(`Title: ${product.title}`);
    console.log(`Images (${product.images.length}):`);
    product.images.forEach((img, idx) => {
      console.log(`  ${idx + 1}. ${img}`);
    });
    console.log('---\n');
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
