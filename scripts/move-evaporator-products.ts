import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function moveProducts() {
  try {
    // Get both categories
    const evapUnits = await prisma.category.findUnique({
      where: { slug: 'evaporation-units' }
    });
    
    const evapCoils = await prisma.category.findUnique({
      where: { slug: 'evaporator-coils' }
    });
    
    if (!evapUnits || !evapCoils) {
      console.log('❌ Categories not found!');
      return;
    }
    
    console.log('📦 Moving products from evaporator-coils to evaporation-units...');
    
    // Move all products
    const result = await prisma.product.updateMany({
      where: { categoryId: evapCoils.id },
      data: { categoryId: evapUnits.id }
    });
    
    console.log(`✅ Moved ${result.count} products`);
    
    // Delete the empty evaporator-coils category
    await prisma.category.delete({
      where: { id: evapCoils.id }
    });
    
    console.log('✅ Deleted evaporator-coils category');
    console.log('\n🎉 All Turbo Air products are now in evaporation-units!');
    console.log('   View at: http://localhost:3000/refrigeration-equipment/evaporation-units\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

moveProducts();
