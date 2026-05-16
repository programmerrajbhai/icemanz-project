import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const subCat = await prisma.category.findUnique({
        where: { slug: 'walk-in-combo-cooler-freezer' }
    })

    if (subCat) {
        const count = await prisma.product.count({
            where: { categoryId: subCat.id }
        })
        console.log(`Count: ${count}`)
    } else {
        console.log('Category not found')
    }
}

main().catch(console.error).finally(() => prisma.$disconnect())
