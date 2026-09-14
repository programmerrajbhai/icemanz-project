import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProductData() {
  try {
    // Get one Astra product
    const product = await prisma.product.findFirst({
      where: {
        brand: 'Astra'
      }
    });

    if (!product) {
      console.log('No Astra product found');
      return;
    }

    console.log('Product Title:', product.title);
    console.log('\n📋 Database Structure:');
    console.log('- detailedFeatures:', Array.isArray(product.detailedFeatures) ? `Array with ${product.detailedFeatures.length} items` : typeof product.detailedFeatures);
    console.log('- features:', typeof product.features);
    console.log('- specs:', typeof product.specs);
    console.log('- faqs:', typeof product.faqs);
    console.log('- productOptions:', typeof product.productOptions);
    console.log('- documents:', typeof product.documents);
    console.log('- warranty:', Array.isArray(product.warranty) ? `Array with ${product.warranty.length} items` : typeof product.warranty);

    console.log('\n📦 Detailed Features (first 3):');
    if (Array.isArray(product.detailedFeatures)) {
      product.detailedFeatures.slice(0, 3).forEach((feature: string, i: number) => {
        console.log(`${i + 1}. ${feature.substring(0, 100)}...`);
      });
    }

    console.log('\n🎨 Features Object:');
    if (product.features && typeof product.features === 'object') {
      console.log(JSON.stringify(product.features, null, 2).substring(0, 500));
    }

    console.log('\n🔧 Product Options:');
    if (product.productOptions && typeof product.productOptions === 'object') {
      console.log(JSON.stringify(product.productOptions, null, 2).substring(0, 500));
    }

    console.log('\n📄 Documents:');
    if (product.documents && typeof product.documents === 'object') {
      console.log(JSON.stringify(product.documents, null, 2).substring(0, 300));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductData();
