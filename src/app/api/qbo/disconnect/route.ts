import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    await prisma.qboToken.deleteMany();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting QBO:', error);
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });
  }
}
