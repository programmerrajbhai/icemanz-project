'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getQuotes() {
  const quotes = await prisma.customQuoteRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return quotes;
}

export async function updateQuoteStatus(id: string, status: string) {
  try {
    const updated = await prisma.customQuoteRequest.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/quotes');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating quote status:', error);
    return { success: false, error: 'Failed to update quote status' };
  }
}

export async function deleteQuoteRequest(id: string) {
  try {
    await prisma.customQuoteRequest.delete({
      where: { id }
    });
    revalidatePath('/admin/quotes');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting quote request:', error);
    return { success: false, error: 'Failed to delete quote request' };
  }
}
