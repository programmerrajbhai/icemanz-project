import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Basic validation
        if (!body.fullName || !body.email || !body.phone || !body.message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const enquiry = await prisma.generalEnquiry.create({
            data: {
                fullName: body.fullName,
                email: body.email,
                phone: body.phone,
                message: body.message,
            }
        });

        return NextResponse.json({ success: true, enquiry }, { status: 201 });
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
