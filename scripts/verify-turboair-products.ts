import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyTurboAirProducts() {
  console.log('🔍 Verifying Turbo Air Condensing Units Products...\n');

  try {
    // Get the Condensing Units category
    const category = await prisma.category.findUnique({
      where: { slug: 'condensing-units' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      console.log('❌ Condensing Units category not found!');
      return;
    }

    console.log(`✅ Category found: ${category.name}`);
    console.log(`📦 Total products: ${category._count.products}\n`);

    // Get all Turbo Air products
    const products = await prisma.product.findMany({
      where: {
        brand: 'Turbo Air',
        categoryId: category.id
      },
      orderBy: {
        title: 'asc'
      }
    });

    console.log(`Found ${products.length} Turbo Air products:\n`);

    // Group by temperature type
    const byTempType = products.reduce((acc, p) => {
      const tempType = (p.features as any)?.temperatureType || 'Unknown';
      if (!acc[tempType]) acc[tempType] = [];
      acc[tempType].push(p);
      return acc;
    }, {} as Record<string, typeof products>);

    for (const [tempType, prods] of Object.entries(byTempType)) {
      console.log(`\n${tempType}:`);
      console.log(`  Count: ${prods.length}`);
      for (const p of prods) {
        const hp = (p.features as any)?.hp || 'N/A';
        const hasImages = p.images.length > 0;
        const hasDocs = (p.documents as any[])?.length || 0;
        console.log(`  - ${p.title}`);
        console.log(`    HP: ${hp}, Images: ${hasImages ? '✓' : '✗'}, Documents: ${hasDocs}`);
      }
    }

    // Check data quality
    console.log('\n\n📊 Data Quality Check:');
    const withImages = products.filter(p => p.images.length > 0).length;
    const withDocuments = products.filter(p => (p.documents as any[])?.length > 0).length;
    const withPrice = products.filter(p => parseFloat(p.price || '0') > 0).length;
    const withDescription = products.filter(p => p.description && p.description.length > 50).length;
    const withFeatures = products.filter(p => p.keyFeatures && p.keyFeatures.length > 50).length;

    console.log(`  Products with images: ${withImages}/${products.length} (${Math.round(withImages / products.length * 100)}%)`);
    console.log(`  Products with documents: ${withDocuments}/${products.length} (${Math.round(withDocuments / products.length * 100)}%)`);
    console.log(`  Products with price: ${withPrice}/${products.length} (${Math.round(withPrice / products.length * 100)}%)`);
    console.log(`  Products with description: ${withDescription}/${products.length} (${Math.round(withDescription / products.length * 100)}%)`);
    console.log(`  Products with features: ${withFeatures}/${products.length} (${Math.round(withFeatures / products.length * 100)}%)`);

    // Sample product details
    if (products.length > 0) {
      const sample = products[0];
      console.log('\n\n📋 Sample Product Details:');
      console.log(`  Title: ${sample.title}`);
      console.log(`  Brand: ${sample.brand}`);
      console.log(`  Price: $${parseFloat(sample.price || '0').toLocaleString()}`);
      console.log(`  Images: ${sample.images.length}`);
      console.log(`  Documents: ${(sample.documents as any[])?.length || 0}`);
      console.log(`  HP: ${(sample.features as any)?.hp || 'N/A'}`);
      console.log(`  Temperature Type: ${(sample.features as any)?.temperatureType || 'N/A'}`);
      console.log(`  Badge: ${sample.badge}`);
      console.log(`  URL: http://localhost:3000/condensing-units/${sample.slug}`);

      if ((sample.documents as any[])?.length > 0) {
        console.log('\n  Documents:');
        for (const doc of sample.documents as any[]) {
          console.log(`    - ${doc.name}: ${doc.url}`);
        }
      }
    }

    console.log('\n✅ Verification complete!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTurboAirProducts();
