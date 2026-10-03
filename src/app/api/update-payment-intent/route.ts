import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

// State tax rates (matches checkout/page.tsx)
const STATE_TAX_RATES: Record<string, number> = {
  CA: 0.0725,
  NY: 0.08875,
  TX: 0.0625,
  FL: 0.06,
  NJ: 0.06625,
  PA: 0.06,
  IL: 0.0625,
  OH: 0.0575,
  GA: 0.04,
  NC: 0.0475,
  MI: 0.06,
  VA: 0.053,
  WA: 0.065,
  AZ: 0.056,
  MA: 0.0625,
};

// Astra shipping rates by state
const ASTRA_SHIPPING_RATES: Record<string, number> = {
  NY: 1000, NJ: 1000, CT: 1000, PA: 1000,
  MA: 1000, RI: 1000, NH: 1000, VT: 1000,
  ME: 1000, DE: 1000, MD: 1000,
  VA: 1500, WV: 1500, NC: 1500, SC: 1500,
  GA: 1500, FL: 1500, TN: 1500, KY: 1500,
  AL: 1500, MS: 1500, OH: 1750, IN: 1750,
  MI: 1750, WI: 1750, MN: 1750, IA: 1750,
  MO: 2000, IL: 2000, AR: 2000, LA: 2000,
  TX: 2500, OK: 2500, KS: 2500, NE: 2500,
  SD: 2500, ND: 2500, MT: 3000, WY: 3000,
  CO: 2500, NM: 2500, AZ: 2500, UT: 2500,
  NV: 2500, ID: 3000, OR: 3000, WA: 3000,
  CA: 2500, AK: 4500, HI: 4500,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      paymentIntentId,
      cartItems,
      deliveryMethod,
      state,          // shipping state (e.g. "NY")
      invoiceRequestId,
    } = body;

    if (!paymentIntentId || !cartItems?.length) {
      return NextResponse.json({ error: 'paymentIntentId and cartItems are required' }, { status: 400 });
    }

    // ── 1. Server-side price validation ─────────────────────────────────────
    const productIds: string[] = cartItems.map((i: any) => i.id).filter(Boolean);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });
    const dbPriceMap = new Map<string, number>();
    dbProducts.forEach(p => {
      if (p.price) {
        const parsed = parseFloat(String(p.price).replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed)) dbPriceMap.set(p.id, parsed);
      }
    });

    const validatedSubtotal = cartItems.reduce((acc: number, item: any) => {
      const dbPrice = dbPriceMap.get(item.id);
      const price = dbPrice !== undefined ? dbPrice : (parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0);
      return acc + price * (item.quantity || 1);
    }, 0);

    // ── 2. Shipping ──────────────────────────────────────────────────────────
    // Mixed cart rule: calculate each applicable rate and take the highest one.
    let shippingCharge = 0;
    if (deliveryMethod === 'ship' && state) {
      const upperState = state.toUpperCase();
      const hasAstra = cartItems.some((i: any) => (i.brand || '').toLowerCase() === 'astra');
      const hasAmerikooler = cartItems.some((i: any) => (i.brand || '').toLowerCase() === 'amerikooler');
      const hasRefrig = cartItems.some((i: any) =>
        i.category === 'refrigeration-equipment' ||
        i.category === 'condensing-units' ||
        i.category === 'evaporation-units' ||
        i.category === 'combo-units-package-units'
      );

      const applicableRates: number[] = [];
      if (hasAstra) applicableRates.push(ASTRA_SHIPPING_RATES[upperState] ?? 2000);
      if (hasAmerikooler) applicableRates.push(1495);
      if (hasRefrig) applicableRates.push(500);

      // Highest rate wins; fall back to $1,000 if no recognised brand
      shippingCharge = applicableRates.length > 0 ? Math.max(...applicableRates) : 1000;
    }

    // ── 3. Tax ───────────────────────────────────────────────────────────────
    let taxAmount = 0;
    if (state) {
      const upperState = state.toUpperCase();
      const taxRate = STATE_TAX_RATES[upperState] ?? 0.07;
      taxAmount = (validatedSubtotal + shippingCharge) * taxRate;
    }

    const newTotal = validatedSubtotal + shippingCharge + taxAmount;
    const newTotalCents = Math.round(newTotal * 100);

    // Stripe minimum is $0.50 (50 cents)
    const finalCents = Math.max(newTotalCents, 50);

    // ── 4. Update the PaymentIntent ──────────────────────────────────────────
    await stripe.paymentIntents.update(paymentIntentId, {
      amount: finalCents,
      metadata: {
        shippingCharge: shippingCharge.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        subtotal: validatedSubtotal.toFixed(2),
        deliveryMethod: deliveryMethod || 'ship',
        shippingState: state || '',
      },
    });

    // ── 5. Update the InvoiceRequest total if we have one ────────────────────
    if (invoiceRequestId) {
      try {
        await prisma.invoiceRequest.update({
          where: { id: invoiceRequestId },
          data: {
            totalAmount: newTotal,
            totalWithTax: newTotal,
          },
        });
      } catch {
        // Non-fatal — order can still proceed
      }
    }

    return NextResponse.json({
      success: true,
      breakdown: {
        subtotal: validatedSubtotal,
        shipping: shippingCharge,
        tax: parseFloat(taxAmount.toFixed(2)),
        total: newTotal,
      },
    });
  } catch (error: any) {
    console.error('[UPDATE-PAYMENT-INTENT] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
