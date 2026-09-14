import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAstraProducts() {
  try {
    console.log('🗑️  Deleting all Astra products...\n');

    // Count before deletion
    const countBefore = await prisma.product.count({
      where: {
        brand: 'Astra'
      }
    });

    console.log(`📊 Found ${countBefore} Astra products to delete`);

    // Delete all Astra products
    const result = await prisma.product.deleteMany({
      where: {
        brand: 'Astra'
      }
    });

    console.log(`✅ Successfully deleted ${result.count} Astra products\n`);

    // Verify deletion
    const countAfter = await prisma.product.count({
      where: {
        brand: 'Astra'
      }
    });

    console.log(`📊 Remaining Astra products: ${countAfter}`);
    
    if (countAfter === 0) {
      console.log('✅ All Astra products have been deleted successfully!');
    } else {
      console.log('⚠️  Some products may still remain');
    }

  } catch (error) {
    console.error('❌ Error deleting products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAstraProducts()
  .then(() => {
    console.log('\n✅ Deletion completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deletion failed:', error);
    process.exit(1);
  });
