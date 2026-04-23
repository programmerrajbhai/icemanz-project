'use server';

import prisma from "@/lib/prisma";

export async function getDashboardData() {
  const totalRequests = await prisma.invoiceRequest.count();
  const newRequests = await prisma.invoiceRequest.count({
    where: { status: 'PENDING' }
  });
  const totalProducts = await prisma.product.count();
  
  const recentInvoices = await prisma.invoiceRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return {
    totalRequests,
    newRequests,
    totalProducts,
    recentInvoices
  };
}
