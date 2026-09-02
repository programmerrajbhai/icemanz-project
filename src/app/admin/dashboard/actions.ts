'use server';

import prisma from "@/lib/prisma";

export async function getDashboardData() {
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({
    where: { status: 'PAID' }
  });

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      invoice: true
    }
  });

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    recentOrders
  };
}


