import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAstraCategories() {
  try {
    console.log('🔧 Fixing Astra product categories...\n');

    // Get or create main category
    let mainCategory = await prisma.category.findFirst({
      where: { slug: 'walk-in-cooler-freezer' }
    });

    if (!mainCategory) {
      mainCategory = await prisma.category.create({
        data: {
          name: 'Walk-In Cooler/Freezer',
          slug: 'walk-in-cooler-freezer'
        }
      });
    }

    // Create all subcategories
    const subcategories = [
      { name: 'Walk-in Cooler (No Floor)', slug: 'walk-in-cooler-no-floor' },
      { name: 'Walk-In Cooler With Floor', slug: 'walk-in-cooler-with-floor' },
      { name: 'Walk-In Freezer With Floor', slug: 'walk-in-freezer-with-floor' },
      { name: 'Walk-In Combo (Cooler & Freezer)', slug: 'walk-in-combo-cooler-freezer' }
    ];

    const categoryMap = new Map<string, string>();

    for (const subcat of subcategories) {
      let category = await prisma.category.findFirst({
        where: { slug: subcat.slug }
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: subcat.name,
            slug: subcat.slug,
            parentId: mainCategory.id
          }
        });
        console.log(`✅ Created: ${subcat.name}`);
      } else {
        console.log(`✓ Found: ${subcat.name}`);
      }
      
      categoryMap.set(subcat.slug, category.id);
    }

    // Get all Astra products
    const astraProducts = await prisma.product.findMany({
      where: { brand: 'Astra' }
    });

    console.log(`\n📦 Processing ${astraProducts.length} Astra products...`);

    let updated = 0;

    for (const product of astraProducts) {
      const title = product.title.toLowerCase();
      let targetCategoryId: string | null = null;

      // Determine category based on title
      if (title.includes('combo')) {
        targetCategoryId = categoryMap.get('walk-in-combo-cooler-freezer') || null;
      } else if (title.includes('freezer')) {
        targetCategoryId = categoryMap.get('walk-in-freezer-with-floor') || null;
      } else if (title.includes('cooler')) {
        if (title.includes('no floor') || title.includes('floorless')) {
          targetCategoryId = categoryMap.get('walk-in-cooler-no-floor') || null;
        } else if (title.includes('with floor') || title.includes('floor')) {
          targetCategoryId = categoryMap.get('walk-in-cooler-with-floor') || null;
        } else {
          targetCategoryId = categoryMap.get('walk-in-cooler-no-floor') || null;
        }
      }

      if (targetCategoryId && product.categoryId !== targetCategoryId) {
        await prisma.product.update({
          where: { id: product.id },
          data: { categoryId: targetCategoryId }
        });
        updated++;
      }
    }

    console.log(`\n✅ Updated ${updated} products`);

    // Show final count by category
    console.log('\n📊 Final Distribution:');
    for (const [slug, id] of categoryMap) {
      const count = await prisma.product.count({
        where: { categoryId: id, brand: 'Astra' }
      });
      const cat = await prisma.category.findUnique({ where: { id } });
      console.log(`   ${cat?.name}: ${count} products`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixAstraCategories()
  .then(() => {
    console.log('\n✅ Category fix completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
