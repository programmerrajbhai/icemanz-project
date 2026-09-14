import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugProduct() {
  try {
    const product = await prisma.product.findFirst({
      where: { brand: 'Astra' }
    });

    if (!product) {
      console.log('No product found');
      return;
    }

    console.log('Product ID:', product.id);
    console.log('\n✅ Has layouts?', Array.isArray(product.layouts), 'Length:', Array.isArray(product.layouts) ? product.layouts.length : 'N/A');
    console.log('✅ Has documents?', typeof product.documents);
    console.log('✅ Has documents.resources?', (product.documents as any)?.resources?.length);

    if (Array.isArray(product.layouts) && product.layouts.length > 0) {
      console.log('\n📦 First Layout:', JSON.stringify(product.layouts[0], null, 2));
    }

    if ((product.documents as any)?.resources) {
      console.log('\n📄 First Resource:', JSON.stringify((product.documents as any).resources[0], null, 2));
    }

    console.log('\n🔍 Raw layouts type:', typeof product.layouts);
    console.log('🔍 Raw documents type:', typeof product.documents);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugProduct();
