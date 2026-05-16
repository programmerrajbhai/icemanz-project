import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const cats = await prisma.category.findMany();
  for (const c of cats) {
    const cnt = await prisma.product.count({ where: { categoryId: c.id }});
    if (cnt > 0) console.log(c.slug, cnt);
  }
}
main()
