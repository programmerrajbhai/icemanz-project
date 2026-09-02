import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            parentId: true
        }
    });

    console.log('\nAll Categories:');
    console.log('================');
    categories.forEach(cat => {
        console.log(`ID: ${cat.id}`);
        console.log(`Name: ${cat.name}`);
        console.log(`Slug: ${cat.slug}`);
        console.log(`Parent ID: ${cat.parentId || 'None'}`);
        console.log('---');
    });
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
