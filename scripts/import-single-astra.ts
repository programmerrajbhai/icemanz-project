import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importSingleAstraProduct() {
  try {
    console.log('🚀 Importing single Astra product for testing...\n');

    // Read the JSON file
    const jsonFilePath = path.join(process.cwd(), 'data', 'astra-products-full.json');
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const allProducts = JSON.parse(fileContent);

    // Get the second product (index 1) - Astra 5 x 6 Walk-In Cooler No Floor
    const astraProduct = allProducts[1];

    console.log(`📦 Importing: ${astraProduct.title}\n`);

    // Find or create category
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

    // Find or create subcategory
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

    // Prepare product data
    const productData = {
      title: astraProduct.title,
      slug: astraProduct.handle,
      brand: astraProduct.vendor,
      sku: astraProduct.variants[0]?.sku || null,
      badge: astraProduct.tags.includes('new') ? 'New' : (astraProduct.tags.includes('QuickShip') ? 'Quick Ship' : null),
      description: astraProduct.body_html, // Keep full HTML
      keyFeatures: astraProduct.body_html, // Keep full HTML for key features too
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
      categoryId: subcategory.id
    };

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: astraProduct.handle }
    });

    let product;
    if (existingProduct) {
      product = await prisma.product.update({
        where: { slug: astraProduct.handle },
        data: productData
      });
      console.log('✅ Product updated successfully!');
    } else {
      product = await prisma.product.create({
        data: productData
      });
      console.log('✅ Product created successfully!');
    }

    console.log('\n📋 Product Details:');
    console.log('   ID:', product.id);
    console.log('   Title:', product.title);
    console.log('   SKU:', product.sku);
    console.log('   Price:', product.price);
    console.log('   Images:', product.images.length);
    console.log('   Warranty items:', product.warranty.length);
    console.log('   FAQs:', Array.isArray(productData.faqs) ? productData.faqs.length : 0);
    console.log('   Layouts:', Array.isArray(productData.layouts) ? productData.layouts.length : 0);
    console.log('   Documents:', productData.documents);
    console.log('   DetailedFeatures:', product.detailedFeatures.length);

    console.log('\n🔗 View product at:');
    console.log(`   http://localhost:3000/walk-in-cooler-freezer/walk-in-cooler-no-floor/${product.id}`);

    // Show what's in the data
    console.log('\n📊 Data Structure Check:');
    console.log('   - description length:', product.description?.length || 0);
    console.log('   - specs:', typeof product.specs, Object.keys(product.specs || {}).length);
    console.log('   - documents:', typeof product.documents);
    console.log('   - productOptions:', typeof product.productOptions);
    console.log('   - features:', typeof product.features);
    console.log('   - layouts:', Array.isArray(product.layouts) ? product.layouts.length : 0);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importSingleAstraProduct()
  .then(() => {
    console.log('\n✅ Import complete! Check the product page now.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
