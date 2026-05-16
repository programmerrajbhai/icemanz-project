import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const productsData = JSON.parse(fs.readFileSync('final_products.json', 'utf8'))
  
  // Find parent category
  const parentCat = await prisma.category.findUnique({
    where: { slug: 'walk-in-cooler-freezer' }
  })
  
  if (!parentCat) {
    throw new Error('Parent category not found')
  }
  
  // Create or find sub-category
  let subCat = await prisma.category.findUnique({
    where: { slug: 'walk-in-cooler-no-floor' }
  })
  
  if (!subCat) {
    subCat = await prisma.category.create({
      data: {
        name: 'Walk-in Cooler No Floor',
        slug: 'walk-in-cooler-no-floor',
        parentId: parentCat.id
      }
    })
    console.log('Created sub-category:', subCat.name)
  } else {
    console.log('Found sub-category:', subCat.name)
  }
  
  // Delete existing products in this sub-category (to prevent duplicates)
  await prisma.product.deleteMany({
    where: { categoryId: subCat.id }
  })
  console.log('Cleared existing products in this category')
  
  // Insert new products
  let count = 0
  for (const product of productsData) {
    await prisma.product.create({
      data: {
        title: product.title,
        slug: product.slug,
        price: product.price,
        images: product.images,
        type: product.type,
        categoryId: subCat.id,
        badge: 'IN STOCK',
        warranty: [],
        detailedFeatures: [
          '4" Thick AK-XPS4 Insulation (R-29 for Coolers, R-32 for Freezers)',
          'Modular cam-lock design for easy installation',
          '26-gauge Acrylume coated galvanized steel finish',
          'Heavy-duty hardware and flush-mounted doors',
          'NSF, UL, and City of Los Angeles approved'
        ]
      }
    })
    count++
  }
  
  console.log(`Inserted ${count} products successfully!`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
