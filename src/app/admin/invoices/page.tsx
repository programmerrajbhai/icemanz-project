import prisma from "@/lib/prisma";
import { Search, Filter, Download, MoreHorizontal, FileText, CheckCircle2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
  const invoices = await prisma.invoiceRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track all customer quote requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
            <Filter size={16} />
            Filter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or project..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table Wrapper for Horizontal Scroll */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Client / Project</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Contact Info</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Items Requested</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText size={48} className="mb-4 opacity-20" />
                      <p className="font-medium text-slate-600">No invoice requests found</p>
                      <p className="text-sm mt-1">When customers submit a request, it will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{invoice.fullName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{invoice.projectName || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{invoice.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{invoice.phone || 'No phone'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                          {invoice.products ? (invoice.products as any[]).length : 0} items
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        invoice.status === 'PENDING' ? 'bg-orange-50 text-orange-700' :
                        invoice.status === 'REVIEWED' ? 'bg-blue-50 text-blue-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {invoice.status === 'PENDING' && <span className="size-1.5 rounded-full bg-orange-500"></span>}
                        {invoice.status === 'REVIEWED' && <span className="size-1.5 rounded-full bg-blue-500"></span>}
                        {invoice.status === 'COMPLETED' && <CheckCircle2 size={12} />}
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        {invoices.length > 0 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
            <span>Showing 1 to {invoices.length} of {invoices.length} entries</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer">Prev</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
