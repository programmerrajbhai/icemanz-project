import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProduct() {
  const product = await prisma.product.findUnique({
    where: { id: 'f9a1badd-1168-4c7f-b030-0ac944549de9' }
  });
  
  if (!product) {
    console.log('❌ Product not found');
    return;
  }
  
  console.log('✅ Product:', product.title);
  console.log('Brand:', product.brand);
  console.log('\nDocuments in database:');
  console.log(JSON.stringify(product.documents, null, 2));
  
  await prisma.$disconnect();
}

checkProduct();
