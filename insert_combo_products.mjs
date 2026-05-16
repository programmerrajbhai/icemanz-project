import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const productsData = JSON.parse(fs.readFileSync('final_combo_products.json', 'utf8'))

  // Find parent category
  const parentCat = await prisma.category.findUnique({
    where: { slug: 'walk-in-cooler-freezer' }
  })

  if (!parentCat) {
    throw new Error('Parent category not found')
  }

  // Create or find sub-category
  let subCat = await prisma.category.findUnique({
    where: { slug: 'walk-in-combo-cooler-freezer' }
  })

  if (!subCat) {
    subCat = await prisma.category.create({
      data: {
        name: 'Walk-in Combo Cooler Freezer',
        slug: 'walk-in-combo-cooler-freezer',
        parentId: parentCat.id
      }
    })
    console.log('Created sub-category:', subCat.name)
  } else {
    console.log('Found sub-category:', subCat.name)
  }

  // Insert products
  let count = 0;
  for (const p of productsData) {
    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { slug: p.slug }
    })

    if (!existing) {
      try {
        await prisma.product.create({
          data: {
            title: p.title,
            slug: p.slug,
            price: p.price,
            images: p.images,
            type: p.type,
            categoryId: subCat.id,
            // Empty fields as defaults
            description: '',
            keyFeatures: '',
            condition: '',
            warranty: [],
            detailedFeatures: [],
          }
        })
        count++
      } catch (e) {
        if (e.code === 'P2002') {
          console.log(`Skipping duplicate slug: ${p.slug}`)
        } else {
          throw e
        }
      }
    }
  }

  console.log(`Successfully inserted ${count} new products!`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
