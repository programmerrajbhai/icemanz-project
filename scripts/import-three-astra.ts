import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importThreeAstraProducts() {
  try {
    console.log('🚀 Importing 3 sample Astra products...\n');

    // Read the JSON file
    const jsonFilePath = path.join(process.cwd(), 'data', 'astra-products-full.json');
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const allProducts = JSON.parse(fileContent);

    // Select 3 different types:
    // Index 3: Cooler with Floor
    // Index 27: Freezer with Floor  
    // Index 37: Combo Cooler & Freezer
    const selectedIndexes = [3, 27, 37];
    const productsToImport = selectedIndexes.map(i => allProducts[i]);

    console.log(`📦 Selected products:`);
    productsToImport.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title}`);
    });
    console.log('');

    // Find or create categories
    let category = await prisma.category.findFirst({
      where: { slug: 'walk-in-cooler-freezer' }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Walk-In Cooler/Freezer',
          slug: 'walk-in-cooler-freezer'
        }
      });
    }

    let subcategory = await prisma.category.findFirst({
      where: { slug: 'walk-in-cooler-no-floor' }
    });

    if (!subcategory) {
      subcategory = await prisma.category.create({
        data: {
          name: 'Walk-In Cooler No Floor',
          slug: 'walk-in-cooler-no-floor',
          parentId: category.id
        }
      });
    }

    const importedProducts = [];

    for (const astraProduct of productsToImport) {
      console.log(`\n📦 Processing: ${astraProduct.title}`);

      // Determine category based on product type
      let targetCategoryId = category.id;
      if (astraProduct.tags.includes('Astra Cooler No Floor') || astraProduct.tags.includes('No Floor')) {
        targetCategoryId = subcategory.id;
      }

      const productData = {
        title: astraProduct.title,
        slug: astraProduct.handle,
        brand: astraProduct.vendor,
        sku: astraProduct.variants[0]?.sku || null,
        badge: astraProduct.tags.includes('new') ? 'New' : (astraProduct.tags.includes('QuickShip') ? 'Quick Ship' : null),
        description: astraProduct.body_html,
        keyFeatures: astraProduct.body_html,
        condition: 'New',
        type: astraProduct.product_type,
        price: astraProduct.variants[0]?.price || null,
        images: astraProduct.images.map((img: any) => img.src),
        warranty: astraProduct.warranty || [],
        detailedFeatures: [
          astraProduct.standard_features_html,
          astraProduct.refrigeration_options_html,
          astraProduct.additional_options_html
        ].filter(Boolean),
        specs: astraProduct.specifications || {},
        documents: {
          resources: astraProduct.resources || [],
          certifications: astraProduct.certifications || []
        },
        faqs: astraProduct.faqs || [],
        productOptions: {
          configurable_properties: astraProduct.configurable_properties || {},
          refrigeration_choice: astraProduct.refrigeration_choice,
          addons: astraProduct.addons || [],
          variants: astraProduct.variants || []
        },
        features: {
          standard_features_html: astraProduct.standard_features_html || '',
          refrigeration_options_html: astraProduct.refrigeration_options_html || '',
          additional_options_html: astraProduct.additional_options_html || ''
        },
        layouts: astraProduct.layouts || [],
        categoryId: targetCategoryId
      };

      const existingProduct = await prisma.product.findUnique({
        where: { slug: astraProduct.handle }
      });

      let product;
      if (existingProduct) {
        product = await prisma.product.update({
          where: { slug: astraProduct.handle },
          data: productData
        });
        console.log('   ✅ Updated');
      } else {
        product = await prisma.product.create({
          data: productData
        });
        console.log('   ✅ Created');
      }

      importedProducts.push({
        id: product.id,
        title: product.title,
        slug: product.slug
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Import Complete!');
    console.log('='.repeat(70));
    console.log('\n📋 Imported Products:\n');
    
    importedProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   🔗 http://localhost:3000/walk-in-cooler-freezer/walk-in-cooler-no-floor/${p.id}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importThreeAstraProducts()
  .then(() => {
    console.log('✅ All done! Check the products now.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });
