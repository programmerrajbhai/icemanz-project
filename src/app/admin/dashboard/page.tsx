import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch stats from DB
  const totalRequests = await prisma.invoiceRequest.count();
  const newRequests = await prisma.invoiceRequest.count({
    where: { status: 'PENDING' }
  });
  const totalProducts = await prisma.product.count();

  const stats = [
    {
      title: "Total Invoice Requests",
      value: totalRequests.toString(),
      trend: "+12.5%",
      isPositive: true,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "New Requests (Pending)",
      value: newRequests.toString(),
      trend: "Needs Action",
      isPositive: false,
      icon: BellIcon,
      color: "bg-orange-500",
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      trend: "+4 this week",
      isPositive: true,
      icon: PackageIcon,
      color: "bg-emerald-500",
    },
    {
      title: "Revenue Generated",
      value: "$45,231.89",
      trend: "+20.1%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`size-12 rounded-xl flex items-center justify-center text-white ${stat.color} bg-opacity-10`}>
                <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Invoice Requests</h2>
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="font-medium text-slate-600">No recent activity yet</p>
            <p className="text-sm mt-1">New requests will appear here</p>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <PackageIcon size={20} />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-blue-700">Add New Product</span>
              </div>
              <TrendingUp size={18} className="text-slate-400 group-hover:text-blue-600" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-emerald-700">View All Invoices</span>
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-emerald-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BellIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
}

function PackageIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
}
