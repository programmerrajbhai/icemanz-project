const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const id = 'amerikooler-qc060872-n-6-x-8-x-7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler';
  let product = await prisma.product.findUnique({ where: { id } });
  if (!product) { console.log('Not found'); return; }
  let rel = await prisma.product.findMany({ where: { categoryId: product.categoryId, id: { not: product.id } }, take: 20 });
  console.log('Same cat:', rel.length);
  if (rel.length < 10) {
    let more = await prisma.product.findMany({ where: { id: { notIn: [product.id, ...rel.map(p => p.id)] }, title: { contains: 'Walk-In', mode: 'insensitive' } }, take: 20 - rel.length });
    console.log('More Walk-In:', more.length);
    rel = [...rel, ...more];
  }
  console.log('Total:', rel.length);
}
main().finally(() => prisma.$disconnect());