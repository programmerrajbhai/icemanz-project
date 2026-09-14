import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAstraProducts() {
  try {
    console.log('🔍 Verifying Astra products import...\n');

    // Count total products
    const totalProducts = await prisma.product.count();
    console.log(`📊 Total products in database: ${totalProducts}`);

    // Count Astra products
    const astraProducts = await prisma.product.count({
      where: {
        brand: 'Astra'
      }
    });
    console.log(`🔵 Astra products: ${astraProducts}`);

    // Count products in Walk-In Cooler/Freezer category
    const category = await prisma.category.findFirst({
      where: {
        slug: 'walk-in-cooler-freezer'
      },
      include: {
        products: true,
        subcategories: {
          include: {
            products: true
          }
        }
      }
    });

    if (category) {
      console.log(`\n📁 Category: ${category.name} (${category.slug})`);
      console.log(`   Products directly in category: ${category.products.length}`);
      
      if (category.subcategories.length > 0) {
        console.log(`   Subcategories: ${category.subcategories.length}`);
        for (const subcat of category.subcategories) {
          console.log(`     - ${subcat.name}: ${subcat.products.length} products`);
        }
      }
    }

    // Sample products
    console.log('\n📦 Sample Astra products:');
    const sampleProducts = await prisma.product.findMany({
      where: {
        brand: 'Astra'
      },
      take: 5,
      select: {
        title: true,
        slug: true,
        price: true,
        sku: true
      }
    });

    sampleProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title}`);
      console.log(`      SKU: ${product.sku}, Price: $${product.price}`);
    });

    console.log('\n✅ Verification completed!');

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAstraProducts();
