import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formData, addedProducts } = body;

    const newRequest = await prisma.invoiceRequest.create({
      data: {
        projectName: formData.projectName,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        width: formData.width,
        length: formData.length,
        height: formData.height,
        tempRange: formData.tempRange,
        customTemp: formData.customTemp,
        quantity: formData.quantity,
        products: addedProducts, // JSON Array of added products
      },
    });

    return NextResponse.json(
      { message: 'Invoice request created successfully', request: newRequest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Invoice Request Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit request', details: error.message },
      { status: 500 }
    );
  }
}
