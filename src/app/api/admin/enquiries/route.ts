import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const enquiries = await prisma.generalEnquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ enquiries });
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
