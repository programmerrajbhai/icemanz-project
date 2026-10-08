import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Apnar prisma client import

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q'); // jemon: ?q=cooler

  try {
    // Jodi specific kono product khuje, tahole search korbe
    if (query) {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          title: true,
          price: true,
          description: true,
          category: { select: { name: true } }
        },
        take: 5, // Top 5 product dibe jate AI confuse na hoy
      });
      return NextResponse.json({ success: true, data: products });
    }

    // Jodi normal question hoy, tobe general info dibe
    return NextResponse.json({
      success: true,
      store_info: {
        name: "Icemanz Refrigeration",
        support_phone: "+1 (718) 678-6005",
        support_email: "sales@icemanz.com",
        shipping: "36-48 Hour Quick Ship",
        address: "New York, USA" // Apnar ashol address diben
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}