'use server';

import prisma from '@/lib/prisma';

async function enrichProducts(products: any[]): Promise<any[]> {
    if (!products || !Array.isArray(products)) return products || [];
    return await Promise.all(
        products.map(async (p: any) => {
            if (p.name || p.title) return { ...p, quantity: p.qty || p.quantity || 1 };
            const partialId = p.id;
            if (!partialId) return { ...p, quantity: p.qty || p.quantity || 1 };
            try {
                const dbProduct = await prisma.product.findFirst({
                    where: { id: { startsWith: partialId } },
                    select: { id: true, title: true, brand: true, images: true, category: { select: { name: true } } }
                });
                if (dbProduct) {
                    return {
                        ...p,
                        id: dbProduct.id,
                        name: dbProduct.title,
                        brand: dbProduct.brand,
                        image: dbProduct.images?.[0] || null,
                        category: dbProduct.category?.name || p.category,
                        quantity: p.qty || p.quantity || 1,
                    };
                }
            } catch { /* ignore */ }
            return { ...p, quantity: p.qty || p.quantity || 1 };
        })
    );
}

export async function getOrders() {
    const orders = await prisma.order.findMany({
        where: {
            OR: [
                { category: 'refrigeration-equipment' },
                { invoice: { category: 'refrigeration-equipment' } }
            ]
        },
        include: { invoice: true },
        orderBy: { createdAt: 'desc' },
    });

    return await Promise.all(orders.map(async (order) => {
        if (!order.invoice?.products) return order;
        const raw = Array.isArray(order.invoice.products) ? order.invoice.products : [];
        return { ...order, invoice: { ...order.invoice, products: await enrichProducts(raw as any[]) } };
    }));
}

export async function deleteOrder(orderId: string) {
    await prisma.order.delete({ where: { id: orderId } });
    return { success: true };
}
