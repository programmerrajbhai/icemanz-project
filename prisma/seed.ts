import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Categories
  console.log('📁 Creating categories...');

  const walkInCategory = await prisma.category.upsert({
    where: { slug: 'walk-in-cooler-no-floor' },
    update: {},
    create: {
      name: 'Walk-in Cooler (No Floor)',
      slug: 'walk-in-cooler-no-floor',
    },
  });

  const walkInFloorCategory = await prisma.category.upsert({
    where: { slug: 'walk-in-cooler-with-floor' },
    update: {},
    create: {
      name: 'Walk-in Cooler (With Floor)',
      slug: 'walk-in-cooler-with-floor',
    },
  });

  const freezerCategory = await prisma.category.upsert({
    where: { slug: 'walk-in-freezer' },
    update: {},
    create: {
      name: 'Walk-in Freezer',
      slug: 'walk-in-freezer',
    },
  });

  const refrigerationCategory = await prisma.category.upsert({
    where: { slug: 'refrigeration-equipment' },
    update: {},
    create: {
      name: 'Refrigeration Equipment',
      slug: 'refrigeration-equipment',
    },
  });

  const evaporationUnitsCategory = await prisma.category.upsert({
    where: { slug: 'evaporation-units' },
    update: {},
    create: {
      name: 'Evaporation Units',
      slug: 'evaporation-units',
      parentId: refrigerationCategory.id,
    },
  });

  console.log('✅ Categories created');


  // 2. Load and Import Real Products from JSON
  console.log('📦 Loading Amerikooler products from JSON file...');
  
  try {
    // Reading the JSON file from the data folder
    const jsonPath = path.join(process.cwd(), 'data', 'amerikooler-products-2026-10-03.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const productsData = JSON.parse(fileContent);

    console.log(`🧊 Importing ${productsData.length} actual products to database...`);

    for (const item of productsData) {
      // Determine correctly matched Category based on tags or title
      let catId = walkInCategory.id; // Default to Walk-in Cooler No Floor
      const tags = item.tags || [];
      const isFreezer = item.title.includes('Freezer') || tags.includes('Freezer Floor');
      const hasFloor = tags.includes('Floor');
      const noFloor = tags.includes('No Floor');

      if (isFreezer) {
        catId = freezerCategory.id;
      } else if (hasFloor && !noFloor) {
        catId = walkInFloorCategory.id;
      }

      // Map JSON data to Prisma Database schema
      const productPayload = {
        title: item.title,
        slug: item.handle,
        brand: item.vendor || 'Amerikooler',
        sku: item.variants?.[0]?.sku || item.handle,
        description: item.description || '',
        keyFeatures: item.features?.slice(0, 3).join(', ') || 'High quality commercial refrigeration',
        condition: 'New',
        type: item.type || 'Walk-In Boxes',
        price: item.price ? item.price.toString() : '0',
        images: item.images?.map((img: any) => img.src) || [],
        warranty: ['15 Year Panel Warranty', '5 Year Compressor Warranty', '1 Year Parts Warranty'],
        detailedFeatures: item.features || [],
        specs: item.specifications || {},
        categoryId: catId,
      };

      await prisma.product.upsert({
        where: { slug: item.handle },
        update: productPayload,
        create: productPayload,
      });
    }
    console.log('✅ Real Walk-in products successfully imported!');

  } catch (error) {
    console.error('❌ Error reading JSON file. Make sure the file exists in the data folder.', error);
  }

  // 3. Create Demo Parts/Equipment Products (Keeping them so website parts section doesn't look empty)
  console.log('🔧 Creating Refrigeration & Evaporator demo products...');

  const equipmentProducts = [
    {
      title: 'Commercial Reach-in Refrigerator - 3 Door',
      slug: 'commercial-reach-in-refrigerator-3-door',
      brand: 'TRUE',
      sku: 'REF-3D-001',
      badge: 'POPULAR',
      description: 'Professional 3-door reach-in refrigerator with stainless steel construction.',
      keyFeatures: 'Energy efficient, Digital controls, Heavy duty casters',
      condition: 'New',
      type: 'Reach-in Refrigerator',
      price: '3499',
      images: ['/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-1.jpg'],
      warranty: ['3 Year Parts & Labor Warranty'],
      detailedFeatures: ['Stainless steel interior', '72 cu. ft. capacity', 'Digital display'],
      categoryId: refrigerationCategory.id,
    }
  ];

  for (const product of equipmentProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  // Get final counts
  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();

  console.log('\n🎉 Seeding completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Categories: ${categoryCount}`);
  console.log(`   - Total Products in DB: ${productCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });