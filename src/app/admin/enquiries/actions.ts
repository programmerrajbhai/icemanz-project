'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getEnquiries() {
  try {
    const enquiries = await prisma.generalEnquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return enquiries;
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw new Error('Failed to fetch enquiries');
  }
}

export async function deleteEnquiry(id: string) {
  try {
    await prisma.generalEnquiry.delete({
      where: { id }
    });
    revalidatePath('/admin/enquiries');
    return { success: true };
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    throw new Error('Failed to delete enquiry');
  }
}

export async function updateEnquiryStatus(id: string, status: string) {
  try {
    const enquiry = await prisma.generalEnquiry.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/enquiries');
    return { success: true, enquiry };
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    throw new Error('Failed to update enquiry status');
  }
}
