import { redirect } from 'next/navigation';

export default function QuickbooksConnectPage() {
  // Redirect to our existing connect API route
  redirect('/api/qbo/connect');
}
