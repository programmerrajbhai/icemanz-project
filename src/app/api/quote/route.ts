import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const quoteRequest = await prisma.customQuoteRequest.create({
      data: {
        date: data.date,
        jobName: data.jobName,
        address: data.address,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        ambientTemp: data.ambientTemp,
        voltage: data.voltage,
        phase: data.phase,
        coolerSystemType: data.coolerSystemType,
        coolerRequiredTemp: data.coolerRequiredTemp,
        coolerDimension: data.coolerDimension,
        coolerNoOfDoors: data.coolerNoOfDoors,
        coolerDoorSize: data.coolerDoorSize,
        freezerSystemType: data.freezerSystemType,
        freezerRequiredTemp: data.freezerRequiredTemp,
        freezerDimension: data.freezerDimension,
        freezerNoOfDoors: data.freezerNoOfDoors,
        freezerDoorSize: data.freezerDoorSize,
        additionalInfo: data.additionalInfo
      }
    });

    return NextResponse.json({ success: true, quoteRequest }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating quote request:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
