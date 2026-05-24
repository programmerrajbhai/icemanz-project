import { getDashboardData, getQboStatus } from "./actions";
import DashboardClient from "./DashboardClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const initialData = await getDashboardData();
  const qboStatus = await getQboStatus();

  return <DashboardClient initialData={initialData} qboStatus={qboStatus} />;
}
