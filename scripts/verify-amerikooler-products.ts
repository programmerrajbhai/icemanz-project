import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAmeriKoolerProducts() {
  console.log('\n📊 Amerikooler Import Verification\n');

  try {
    // Get all Amerikooler products
    const amerikoolerProducts = await prisma.product.findMany({
      where: { brand: 'Amerikooler' },
      include: { category: true }
    });

    console.log(`✅ Total Amerikooler products: ${amerikoolerProducts.length}\n`);

    // Group by category
    const byCategory = amerikoolerProducts.reduce((acc: any, p) => {
      const cat = p.category?.name || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    console.log('📦 Products by category:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });

    // Price statistics
    const prices = amerikoolerProducts.map(p => parseFloat(p.price || '0'));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    console.log('\n💰 Price range:');
    console.log(`   Min: $${minPrice.toFixed(2)}`);
    console.log(`   Max: $${maxPrice.toFixed(2)}`);
    console.log(`   Average: $${avgPrice.toFixed(2)}`);

    // Check for products with complete data
    const withImages = amerikoolerProducts.filter(p => p.images.length > 0);
    const withSpecs = amerikoolerProducts.filter(p => p.specs !== null);
    const withFeatures = amerikoolerProducts.filter(p => p.features && Object.keys(p.features).length > 0);

    console.log('\n📋 Data completeness:');
    console.log(`   Products with images: ${withImages.length} (${((withImages.length / amerikoolerProducts.length) * 100).toFixed(1)}%)`);
    console.log(`   Products with specs: ${withSpecs.length} (${((withSpecs.length / amerikoolerProducts.length) * 100).toFixed(1)}%)`);
    console.log(`   Products with features: ${withFeatures.length} (${((withFeatures.length / amerikoolerProducts.length) * 100).toFixed(1)}%)`);

    // Sample products
    console.log('\n🔍 Sample products:\n');
    amerikoolerProducts.slice(0, 3).forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   Price: $${p.price}`);
      console.log(`   Category: ${p.category?.name || 'Uncategorized'}`);
      console.log(`   SKU: ${p.sku}`);
      console.log(`   Images: ${p.images.length}`);
      console.log(`   URL: /product/${p.slug}`);
      console.log('');
    });

    console.log('✨ Verification complete!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAmeriKoolerProducts();
