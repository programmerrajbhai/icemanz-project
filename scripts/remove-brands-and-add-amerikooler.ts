import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting brand cleanup and addition...\n');

  // Step 1: Delete Dade products
  console.log('🗑️  Deleting Dade products...');
  const deletedDade = await prisma.product.deleteMany({
    where: {
      brand: 'Dade'
    }
  });
  console.log(`✓ Deleted ${deletedDade.count} Dade product(s)\n`);

  // Step 2: Delete Mr. Winter products
  console.log('🗑️  Deleting Mr. Winter products...');
  const deletedMrWinter = await prisma.product.deleteMany({
    where: {
      brand: 'Mr. Winter'
    }
  });
  console.log(`✓ Deleted ${deletedMrWinter.count} Mr. Winter product(s)\n`);

  // Step 3: Verify no products with these brands remain
  const remainingDade = await prisma.product.count({
    where: { brand: 'Dade' }
  });
  const remainingMrWinter = await prisma.product.count({
    where: { brand: 'Mr. Winter' }
  });

  if (remainingDade === 0 && remainingMrWinter === 0) {
    console.log('✅ Successfully removed all Dade and Mr. Winter products\n');
  } else {
    console.log(`⚠️  Warning: ${remainingDade} Dade and ${remainingMrWinter} Mr. Winter products still remain\n`);
  }

  // Step 4: Check current brands
  console.log('📊 Current brands in database:');
  const allProducts = await prisma.product.findMany({
    select: { brand: true }
  });
  
  const brandCounts = allProducts.reduce((acc, product) => {
    const brand = product.brand || 'Unknown';
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(brandCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([brand, count]) => {
      console.log(`  - ${brand}: ${count} product(s)`);
    });

  console.log('\n✅ Brand cleanup complete!');
  console.log('📝 Note: Amerikooler brand will appear in filters with 0 products automatically in the client component');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
