import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.category.findMany().then(c => console.log(c.map(x => ({name: x.name, slug: x.slug})))).finally(() => prisma.$disconnect());
