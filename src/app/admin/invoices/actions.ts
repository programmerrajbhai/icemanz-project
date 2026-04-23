'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getInvoices() {
  const invoices = await prisma.invoiceRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return invoices;
}

export async function updateInvoiceStatus(id: string, status: string) {
  try {
    await prisma.invoiceRequest.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/invoices');
    return { success: true };
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function deleteInvoiceRequest(id: string) {
  try {
    await prisma.invoiceRequest.delete({
      where: { id }
    });
    revalidatePath('/admin/invoices');
    return { success: true };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return { success: false, error: 'Failed to delete invoice' };
  }
}
