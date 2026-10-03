'use server';

import prisma from '@/lib/prisma';

// Enrich product stubs that only have {id, qty, price} (old orders)
// by looking up full product data from DB using partial ID match
async function enrichProducts(products: any[]): Promise<any[]> {
    if (!products || !Array.isArray(products)) return products || [];

    return await Promise.all(
        products.map(async (p: any) => {
            // Already has full data (new format)
            if (p.name || p.title) return p;

            // Old format: only has {id, qty, price} — look up product by partial ID
            const partialId = p.id;
            if (!partialId) return p;

            try {
                const dbProduct = await prisma.product.findFirst({
                    where: { id: { startsWith: partialId } },
                    select: {
                        id: true,
                        title: true,
                        brand: true,
                        images: true,
                        price: true,
                        category: { select: { slug: true, name: true } }
                    }
                });

                if (dbProduct) {
                    return {
                        ...p,
                        id: dbProduct.id,
                        name: dbProduct.title,
                        brand: dbProduct.brand,
                        image: dbProduct.images?.[0] || null,
                        category: dbProduct.category?.name || p.category,
                        // Keep original price/qty from the order, not DB price
                        quantity: p.qty || p.quantity || 1,
                    };
                }
            } catch {
                // ignore lookup errors
            }
            return { ...p, quantity: p.qty || p.quantity || 1 };
        })
    );
}

export async function getOrders() {
    const orders = await prisma.order.findMany({
        include: { invoice: true },
        orderBy: { createdAt: 'desc' },
    });

    // Enrich each order's invoice products
    const enriched = await Promise.all(
        orders.map(async (order) => {
            if (!order.invoice?.products) return order;
            const rawProducts = Array.isArray(order.invoice.products)
                ? order.invoice.products
                : [];
            const enrichedProducts = await enrichProducts(rawProducts as any[]);
            return {
                ...order,
                invoice: {
                    ...order.invoice,
                    products: enrichedProducts,
                },
            };
        })
    );

    return enriched;
}

export async function deleteOrder(orderId: string) {
    await prisma.order.delete({
        where: { id: orderId },
    });
    return { success: true };
}
