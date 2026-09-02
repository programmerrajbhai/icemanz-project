import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Update all combo products to use local images
  const localImage = '/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif';

  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'walk-in-combo-cooler-freezer'
      }
    }
  });

  console.log(`Updating ${products.length} combo products with local images...\n`);

  for (const product of products) {
    try {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: [localImage]
        }
      });
      console.log(`✓ Updated: ${product.sku}`);
    } catch (error: any) {
      console.error(`✗ Failed to update ${product.sku}:`, error.message);
    }
  }

  console.log('\n✓ All combo products updated with local images!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
