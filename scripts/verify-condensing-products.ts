import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 Verifying Condensing Units products...\n');
  
  const category = await prisma.category.findUnique({
    where: { slug: 'condensing-units' },
    include: {
      products: {
        select: {
          brand: true,
          title: true,
          price: true,
          sku: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });
  
  if (!category) {
    console.log('❌ Category not found');
    return;
  }
  
  console.log(`✅ Category: ${category.name}`);
  console.log(`✅ Total products: ${category.products.length}\n`);
  
  // Get unique brands
  const brands = [...new Set(category.products.map(p => p.brand))];
  console.log('📊 Brands in this category:');
  brands.forEach(brand => {
    const count = category.products.filter(p => p.brand === brand).length;
    console.log(`   - ${brand}: ${count} products`);
  });
  console.log('');
  
  // Check if all are Turbo Air
  const allTurboAir = category.products.every(p => p.brand === 'Turbo Air');
  if (allTurboAir) {
    console.log('✅ All products are Turbo Air brand\n');
  } else {
    console.log('❌ Not all products are Turbo Air brand\n');
  }
  
  // Show first 5 products
  console.log('📦 First 5 products:');
  category.products.slice(0, 5).forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.sku} - ${p.title.substring(0, 60)}... - $${p.price}`);
  });
  
  console.log('   ...');
  
  // Show last 3 products
  console.log('\n📦 Last 3 products:');
  category.products.slice(-3).forEach((p, i) => {
    const num = category.products.length - 3 + i + 1;
    console.log(`   ${num}. ${p.sku} - ${p.title.substring(0, 60)}... - $${p.price}`);
  });
  
  console.log('\n✅ Verification complete!');
}

verify()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
