import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function QuickbooksDisconnectPage() {
  // Clear the QBO tokens from the database when this page is accessed
  try {
    await prisma.qboToken.deleteMany();
    console.log('QuickBooks disconnected successfully via Intuit App Center.');
  } catch (error) {
    console.error('Error disconnecting QuickBooks:', error);
  }

  // Redirect to admin dashboard after disconnecting
  redirect('/admin/dashboard?qbo_disconnected=true');
}
