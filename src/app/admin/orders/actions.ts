'use server';

import prisma from '@/lib/prisma';

export async function getOrders() {
    const orders = await prisma.order.findMany({
        include: {
            invoice: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    return orders;
}
