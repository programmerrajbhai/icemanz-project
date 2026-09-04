import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOptions() {
  console.log('🔍 Checking product options for Add to Cart vs Choose Options...\n');
  
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'condensing-units'
      }
    },
    select: {
      sku: true,
      title: true,
      productOptions: true
    }
  });
  
  const withOptions = products.filter(p => p.productOptions !== null && p.productOptions !== undefined);
  const withoutOptions = products.filter(p => p.productOptions === null || p.productOptions === undefined);
  
  console.log(`📊 Total products: ${products.length}`);
  console.log(`✅ Products with "Add to Cart" (no options): ${withoutOptions.length}`);
  console.log(`📋 Products with "Choose Options": ${withOptions.length}\n`);
  
  if (withOptions.length > 0) {
    console.log('Products with options:');
    withOptions.forEach(p => {
      console.log(`   - ${p.sku}: ${p.title.substring(0, 50)}...`);
    });
  } else {
    console.log('✅ All products will show "Add to Cart" button (no product options configured)');
  }
}

checkOptions()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
