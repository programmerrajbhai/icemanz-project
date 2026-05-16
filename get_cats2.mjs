import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany()
  console.log(cats.find(c => c.slug === 'walk-in-cooler-no-floor'))
}
main()
