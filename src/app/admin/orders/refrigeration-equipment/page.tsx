import prisma from '@/lib/prisma';
import OrdersClient from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { category: 'refrigeration-equipment' },
        { invoice: { category: 'refrigeration-equipment' } }
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
