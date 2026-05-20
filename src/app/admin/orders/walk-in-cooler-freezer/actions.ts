'use server';

import prisma from '@/lib/prisma';

export async function getOrders() {
    const orders = await prisma.order.findMany({
        where: {
            category: 'walk-in-cooler-freezer'
        },
        include: {
            invoice: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    return orders;
}

export async function deleteOrder(orderId: string) {
    await prisma.order.delete({
        where: { id: orderId },
    });
    return { success: true };
}
