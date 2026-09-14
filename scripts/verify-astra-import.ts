import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyImport() {
  console.log('🔍 Verifying Astra Products Import...\n');

  // Get total count
  const totalCount = await prisma.product.count({
    where: { brand: 'Astra' }
  });
  console.log(`✅ Total Astra products: ${totalCount}\n`);

  // Get counts by category
  console.log('📊 Products by Category:');
  const categories = await prisma.category.findMany({
    where: {
      slug: {
        in: [
          'walk-in-cooler-no-floor',
          'walk-in-cooler-with-floor',
          'walk-in-freezer-with-floor',
          'walk-in-combo-cooler-freezer'
        ]
      }
    }
  });

  for (const category of categories) {
    const count = await prisma.product.count({
      where: {
        categoryId: category.id,
        brand: 'Astra'
      }
    });
    console.log(`   ${category.name}: ${count} products`);
  }

  // Sample products from each category
  console.log('\n📦 Sample Products:');
  for (const category of categories) {
    const samples = await prisma.product.findMany({
      where: {
        categoryId: category.id,
        brand: 'Astra'
      },
      select: {
        title: true,
        sku: true,
        slug: true,
        price: true
      },
      take: 3
    });

    if (samples.length > 0) {
      console.log(`\n${category.name}:`);
      samples.forEach(p => {
        console.log(`   • ${p.title}`);
        console.log(`     SKU: ${p.sku} | Price: $${p.price} | URL: /walk-in-cooler-freezer/${p.slug}`);
      });
    }
  }

  // Check for products with missing data
  console.log('\n\n🔎 Data Quality Check:');
  
  const missingDescriptions = await prisma.product.count({
    where: {
      brand: 'Astra',
      OR: [
        { description: null },
        { description: '' }
      ]
    }
  });
  console.log(`   Products without description: ${missingDescriptions}`);

  const missingPrices = await prisma.product.count({
    where: {
      brand: 'Astra',
      OR: [
        { price: null },
        { price: '' },
        { price: '0' }
      ]
    }
  });
  console.log(`   Products without price: ${missingPrices}`);

  const missingSKU = await prisma.product.count({
    where: {
      brand: 'Astra',
      OR: [
        { sku: null },
        { sku: '' }
      ]
    }
  });
  console.log(`   Products without SKU: ${missingSKU}`);

  // Check refrigeration types distribution
  console.log('\n\n🌡️  Refrigeration Types:');
  const allAstraProducts = await prisma.product.findMany({
    where: { brand: 'Astra' },
    select: {
      features: true
    }
  });

  const refrigerationCounts: Record<string, number> = {};
  allAstraProducts.forEach(p => {
    const features = p.features as any;
    const refType = features?.refrigerationType || 'Unknown';
    refrigerationCounts[refType] = (refrigerationCounts[refType] || 0) + 1;
  });

  Object.entries(refrigerationCounts).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} products`);
  });

  // Size distribution
  console.log('\n\n📐 Size Distribution (Width x Length):');
  const sizeCounts: Record<string, number> = {};
  allAstraProducts.forEach(p => {
    const features = p.features as any;
    const dimensions = features?.dimensions || 'Unknown';
    sizeCounts[dimensions] = (sizeCounts[dimensions] || 0) + 1;
  });

  const sortedSizes = Object.entries(sizeCounts)
    .sort((a, b) => {
      // Sort by width first, then length
      const [w1, l1] = a[0].split(' x ').map(n => parseInt(n) || 0);
      const [w2, l2] = b[0].split(' x ').map(n => parseInt(n) || 0);
      return w1 - w2 || l1 - l2;
    });

  sortedSizes.slice(0, 10).forEach(([size, count]) => {
    console.log(`   ${size}: ${count} products`);
  });
  if (sortedSizes.length > 10) {
    console.log(`   ... and ${sortedSizes.length - 10} more sizes`);
  }

  console.log('\n\n✅ Import verification complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Visit http://localhost:3000/walk-in-cooler-freezer/walk-in-cooler-no-floor');
  console.log('   2. Visit http://localhost:3000/walk-in-cooler-freezer/walk-in-cooler-with-floor');
  console.log('   3. Visit http://localhost:3000/walk-in-cooler-freezer/walk-in-freezer-with-floor');
  console.log('   4. Click on any product to view its detail page');

  await prisma.$disconnect();
}

verifyImport().catch(console.error);
