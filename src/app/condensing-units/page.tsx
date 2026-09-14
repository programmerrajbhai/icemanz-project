import prisma from '@/lib/prisma';
import CondensingUnitsClient from './CondensingUnitsClient';

export const dynamic = 'force-dynamic';

export default async function CondensingUnitsPage() {
  // Fetch the condensing units category
  const category = await prisma.category.findUnique({
    where: { slug: 'condensing-units' }
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  // Fetch all products in this category
  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id
    },
    orderBy: {
      title: 'asc'
    }
  });

  const serializedProducts = JSON.parse(JSON.stringify(products));
  const serializedCategory = JSON.parse(JSON.stringify(category));

  return (
    <CondensingUnitsClient 
      products={serializedProducts}
      category={serializedCategory}
    />
  );
}
