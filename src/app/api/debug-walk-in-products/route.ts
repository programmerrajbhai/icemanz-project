import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'walk-in-cooler-freezer'
      }
    },
    include: { category: true }
  });
  return NextResponse.json(products);
}
