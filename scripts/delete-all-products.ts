import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllProducts() {
  console.log('🗑️  Starting to delete all products...\n');

  try {
    // Get count before deletion
    const countBefore = await prisma.product.count();
    console.log(`📊 Found ${countBefore} products in database\n`);

    if (countBefore === 0) {
      console.log('✅ No products to delete. Database is already empty.\n');
      return;
    }

    // Delete all products
    const result = await prisma.product.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.count} products\n`);

    // Verify deletion
    const countAfter = await prisma.product.count();
    console.log(`📊 Products remaining: ${countAfter}\n`);

    if (countAfter === 0) {
      console.log('✨ All products have been successfully deleted!\n');
    } else {
      console.log('⚠️  Warning: Some products may still remain in the database\n');
    }

  } catch (error) {
    console.error('💥 Error deleting products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the deletion
deleteAllProducts();
