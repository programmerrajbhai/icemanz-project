import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany()
  console.log(cats.map(c => ({slug: c.slug, id: c.id, parentId: c.parentId})))
}
main()