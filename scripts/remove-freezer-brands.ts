import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking products for walk-in-freezer-with-floor category...\n');
  
  // Find the category
  const category = await prisma.category.findUnique({
    where: { slug: 'walk-in-freezer-with-floor' }
  });
  
  if (!category) {
    console.log('Category not found');
    return;
  }
  
  // Find products to delete
  const productsToDelete = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      brand: { in: ['Dade', 'Mr. Winter', 'Norlake'] }
    },
    select: {
      id: true,
      title: true,
      brand: true
    }
  });
  
  console.log('Products to delete:');
  productsToDelete.forEach(p => console.log(`  - ${p.brand}: ${p.title}`));
  console.log(`\nTotal: ${productsToDelete.length} products\n`);
  
  // Delete them
  const deleted = await prisma.product.deleteMany({
    where: {
      categoryId: category.id,
      brand: { in: ['Dade', 'Mr. Winter', 'Norlake'] }
    }
  });
  
  console.log(`✅ Deleted ${deleted.count} products from walk-in-freezer-with-floor category`);
  
  // Show remaining brands
  const remaining = await prisma.product.findMany({
    where: { categoryId: category.id },
    select: { brand: true }
  });
  
  const brandCounts = remaining.reduce((acc, p) => {
    const brand = p.brand || 'Unknown';
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📊 Remaining brands:');
  Object.entries(brandCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([brand, count]) => {
      console.log(`  - ${brand}: ${count} product(s)`);
    });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
