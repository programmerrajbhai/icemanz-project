import prisma from '@/lib/prisma';
import OrdersClient from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function WalkInCoolerOrdersPage() {
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { category: 'walk-in-cooler-freezer' },
        { category: null }
      ]
    },
    include: {
      invoice: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return (
    <div className="w-full">
      <OrdersClient initialOrders={orders} />
    </div>
  );
}
