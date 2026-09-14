import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProduct() {
  try {
    const product = await prisma.product.findFirst({
      where: { brand: 'Astra' }
    });

    if (!product) {
      console.log('No product found');
      return;
    }

    console.log('✅ Product:', product.title);
    console.log('\n📦 Layouts:', product.layouts);
    console.log('\n📄 Documents:', product.documents);
    console.log('\n🎨 Features:', product.features);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProduct();
