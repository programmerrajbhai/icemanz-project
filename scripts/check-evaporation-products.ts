import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: 'evaporation-units' },
    include: {
      products: {
        select: {
          id: true,
          title: true,
          brand: true,
          price: true,
          sku: true
        }
      }
    }
  });
  
  console.log('Category:', category?.name);
  console.log('Total products:', category?.products.length);
  console.log('\nFirst 5 products:');
  category?.products.slice(0, 5).forEach(p => {
    console.log(`- ${p.brand} | ${p.sku} | $${p.price} | ${p.title.substring(0, 60)}`);
  });
  
  // Check unique brands
  const brands = [...new Set(category?.products.map(p => p.brand))];
  console.log('\nUnique brands in category:', brands);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
