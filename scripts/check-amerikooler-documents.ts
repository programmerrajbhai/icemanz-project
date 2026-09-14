import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDocuments() {
  console.log('\n📄 Checking Amerikooler Product Documents\n');

  try {
    // Get a sample product
    const product = await prisma.product.findFirst({
      where: { brand: 'Amerikooler' }
    });

    if (!product) {
      console.log('❌ No Amerikooler products found');
      return;
    }

    console.log('✅ Sample Product:', product.title);
    console.log('\n📎 Documents:');
    
    if (product.documents && Array.isArray(product.documents)) {
      const docs = product.documents as Array<{ name: string; url: string }>;
      docs.forEach((doc, i) => {
        console.log(`   ${i + 1}. ${doc.name}`);
        console.log(`      URL: ${doc.url}`);
      });
      console.log(`\n✅ Total documents: ${docs.length}`);
    } else {
      console.log('   No documents found');
    }

    // Check all products
    const allProducts = await prisma.product.findMany({
      where: { brand: 'Amerikooler' },
      select: {
        id: true,
        title: true,
        documents: true
      }
    });

    const withDocs = allProducts.filter(p => 
      p.documents && Array.isArray(p.documents) && p.documents.length > 0
    );

    console.log(`\n📊 Statistics:`);
    console.log(`   Total Amerikooler products: ${allProducts.length}`);
    console.log(`   Products with documents: ${withDocs.length}`);
    console.log(`   Coverage: ${((withDocs.length / allProducts.length) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDocuments();
