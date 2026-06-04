import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching categories...");
  const rootSlugs = ['refrigeration-equipment', 'evaporation-units', 'condensing-units', 'combo-units-package-units'];
  
  const categories = await prisma.category.findMany({
    where: { slug: { in: rootSlugs } },
    include: {
      subcategories: {
        include: {
          subcategories: true
        }
      }
    }
  });

  const categoryIdsToFetch: string[] = [];
  for (const root of categories) {
    categoryIdsToFetch.push(root.id);
    for (const sub of root.subcategories) {
      categoryIdsToFetch.push(sub.id);
      for (const subSub of sub.subcategories) {
        categoryIdsToFetch.push(subSub.id);
      }
    }
  }

  console.log(`Found ${categoryIdsToFetch.length} category IDs.`);

  const products = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIdsToFetch }
    },
    include: {
      category: true
    }
  });

  console.log(`Found ${products.length} products to update.`);

  for (const product of products) {
    // Current title
    let oldTitle = product.title;
    let brand = product.brand || 'Turbo Air';
    let sku = product.sku || '';
    
    // Example format: Turbo Air ADR352AENC 6 Fan Low Profile Evaporator Coil (Unit Cooler)
    // We want to reconstruct it using the brand, SKU, and parts of the original title.
    
    // Clean up old title to remove brand and sku if they exist in it
    let cleanTitle = oldTitle;
    
    if (brand && cleanTitle.toLowerCase().includes(brand.toLowerCase())) {
        const regex = new RegExp(brand, 'ig');
        cleanTitle = cleanTitle.replace(regex, '').trim();
    }
    
    if (sku && cleanTitle.toLowerCase().includes(sku.toLowerCase())) {
        const regex = new RegExp(sku, 'ig');
        cleanTitle = cleanTitle.replace(regex, '').trim();
    }
    
    // Let's also look at the category name to append if needed, e.g., (Unit Cooler) or (Condensing Unit)
    let categoryName = product.category?.name || '';
    if (categoryName === 'Refrigeration Equipment') categoryName = '';
    
    // Format the new title
    // Example: [Brand] [SKU] [Cleaned Title] [(Category)]
    const parts = [brand, sku, cleanTitle].filter(Boolean);
    let newTitle = parts.join(' ').replace(/\s+/g, ' ').trim();
    
    // If it doesn't already have the category name in parentheses, and categoryName exists, append it
    if (categoryName && !newTitle.toLowerCase().includes(categoryName.toLowerCase()) && !newTitle.includes('(')) {
        // newTitle += ` (${categoryName})`; // Optional, we'll see if the user specifically wanted "(Unit Cooler)"
    }
    
    // Let's just hardcode a smart format for the specific example if it closely matches
    // But since we want to dynamically format all:
    console.log(`\nOLD: ${oldTitle}`);
    console.log(`NEW: ${newTitle}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
