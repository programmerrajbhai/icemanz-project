import { redirect } from 'next/navigation';

export default function QuickbooksLaunchPage() {
  // Redirect users to the admin dashboard when they click "Launch" from QuickBooks Apps.com
  redirect('/admin/dashboard');
}
