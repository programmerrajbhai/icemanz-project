'use client';

import { useState } from 'react';
import {
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Search,
  FileText,
  MapPin,
  Phone,
  Mail,
  Box,
  Thermometer,
  Calendar,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { updateInvoiceStatus, deleteInvoiceRequest } from './actions';

type Invoice = {
  id: string;
  projectName: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  width: string | null;
  length: string | null;
  height: string | null;
  tempRange: string | null;
  customTemp: string | null;
  quantity: string | null;
  products: any;
  status: string;
  createdAt: Date;
};

export default function InvoicesClient({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  const filteredInvoices = invoices.filter(inv =>
    inv.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.projectName && inv.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (newStatus === 'APPROVED') {
      setShowApproveModal(true);
      return;
    }

    const loadingToast = toast.loading('Updating status...');
    try {
      const response = await fetch(`/api/admin/invoices/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updatedData = await response.json();
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
      toast.success(`Status updated to ${newStatus}`, { id: loadingToast });
      if (selectedInvoice && selectedInvoice.id === id) {
        setSelectedInvoice({ ...selectedInvoice, status: newStatus });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update', { id: loadingToast });
    }
  };

  const submitApproval = async () => {
    if (!selectedInvoice || !totalAmount) return;

    const loadingToast = toast.loading('Creating invoice and sending email...');
    try {
      const response = await fetch(`/api/admin/invoices/${selectedInvoice.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE',
          totalAmount: totalAmount,
          message: adminMessage
        }),
      });

      if (!response.ok) throw new Error('Failed to approve invoice');

      const updatedData = await response.json();
      setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? { ...inv, status: 'APPROVED' } : inv));
      setSelectedInvoice({ ...selectedInvoice, status: 'APPROVED' });
      setShowApproveModal(false);
      setTotalAmount('');
      setAdminMessage('');
      toast.success('Invoice approved and email sent to client!', { id: loadingToast });
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve', { id: loadingToast });
    }
  };

  const executeDelete = async (id: string) => {
    const loadingToast = toast.loading('Deleting request...');
    const result = await deleteInvoiceRequest(id);

    if (result.success) {
      setInvoices(invoices.filter(inv => inv.id !== id));
      toast.success('Invoice request deleted', { id: loadingToast });
      if (selectedInvoice && selectedInvoice.id === id) {
        setSelectedInvoice(null);
      }
    } else {
      toast.error(result.error || 'Failed to delete', { id: loadingToast });
    }
  };

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[240px]">
        <p className="text-sm font-bold text-gray-900 leading-snug">Are you sure you want to delete this invoice request?</p>
        <p className="text-xs font-medium text-gray-500 mb-1">This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete(id);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      id: `delete-confirm-${id}`,
      style: { maxWidth: '400px' }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"><CheckCircle2 size={12} /> Approved</span>;
      case 'DECLINED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800"><XCircle size={12} /> Declined</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Invoice Requests</h1>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004a99] focus:border-[#004a99] sm:text-sm transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client Info</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{invoice.fullName}</span>
                        <span className="text-sm text-gray-500">{invoice.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium line-clamp-1">{invoice.projectName || <span className="text-gray-400 italic">No project name</span>}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {invoice.width && invoice.length ? `${invoice.width}x${invoice.length} ft` : 'Custom dimensions'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 cursor-pointer rounded-sm transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 cursor-pointer rounded-sm transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No invoice requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="text-[#004a99]" size={24} />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Invoice Request Details</h2>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30">

              {/* Action Bar inside Modal */}
              <div className="flex items-center justify-between bg-white p-5 rounded-lg border border-gray-100 shadow-sm mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Current Status:</span>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
                <div className="flex gap-3">
                  {selectedInvoice.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedInvoice.id, 'APPROVED')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 size={18} /> Approve
                    </button>
                  )}
                  {selectedInvoice.status !== 'DECLINED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedInvoice.id, 'DECLINED')}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                    >
                      <XCircle size={18} /> Decline
                    </button>
                  )}
                  {selectedInvoice.status !== 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedInvoice.id, 'PENDING')}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                    >
                      <Clock size={18} /> Mark Pending
                    </button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Client Information */}
                <div className="space-y-6">
                  <div className="h-full flex flex-col">
                    <h3 className="text-[12px] font-bold text-[#004a99] uppercase tracking-[0.15em] border-b border-gray-100 pb-4 mb-5">Client Information</h3>
                    <div className="space-y-4">

                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm group cursor-pointer transition-colors hover:border-[#004a99]/30">
                        <div className="text-gray-400 group-hover:text-[#004a99] transition-colors"><User size={16} /></div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Full Name</p>
                          <p className="text-[13px] font-bold text-gray-900 mt-0.5 group-hover:text-[#004a99] transition-colors">{selectedInvoice.fullName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm group cursor-pointer transition-colors hover:border-[#004a99]/30">
                        <div className="text-gray-400 group-hover:text-[#004a99] transition-colors"><Mail size={16} /></div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Email Address</p>
                          <a href={`mailto:${selectedInvoice.email}`} className="text-[13px] font-bold text-gray-900 mt-0.5 hover:text-[#004a99] hover:underline transition-colors block">{selectedInvoice.email}</a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm group cursor-pointer transition-colors hover:border-[#004a99]/30">
                        <div className="text-gray-400 group-hover:text-[#004a99] transition-colors"><Phone size={16} /></div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Phone Number</p>
                          <a href={`tel:${selectedInvoice.phone}`} className="text-[13px] font-bold text-gray-900 mt-0.5 hover:text-[#004a99] hover:underline transition-colors block">{selectedInvoice.phone || 'N/A'}</a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm group cursor-pointer transition-colors hover:border-[#004a99]/30">
                        <div className="text-gray-400 group-hover:text-[#004a99] transition-colors"><MapPin size={16} /></div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Project Address</p>
                          <p className="text-[13px] font-bold text-gray-900 mt-0.5 leading-snug group-hover:text-[#004a99] transition-colors">{selectedInvoice.address || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm group cursor-pointer transition-colors hover:border-[#004a99]/30">
                        <div className="text-gray-400 group-hover:text-[#004a99] transition-colors"><Calendar size={16} /></div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Submitted On</p>
                          <p className="text-[13px] font-bold text-gray-900 mt-0.5 group-hover:text-[#004a99] transition-colors">{new Date(selectedInvoice.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
                    <h3 className="text-[12px] font-bold text-emerald-600 uppercase tracking-[0.15em] border-b border-gray-50 pb-4 mb-5">Project & Specifications</h3>

                    <div className="bg-white p-5 rounded-xl border border-emerald-600/20 mb-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Project Name</p>
                      <p className="text-[18px] font-bold text-emerald-700 leading-tight">{selectedInvoice.projectName || 'Not provided'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col gap-1.5 bg-gray-50/60 p-4 rounded-xl border border-gray-100 transition-colors hover:bg-gray-50 cursor-pointer">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Dimensions (ft)</p>
                        <p className="text-[13px] font-bold text-gray-900 leading-snug">
                          {selectedInvoice.width && selectedInvoice.length && selectedInvoice.height
                            ? `${selectedInvoice.width}W × ${selectedInvoice.length}L × ${selectedInvoice.height}H`
                            : 'Custom / Not provided'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 bg-gray-50/60 p-4 rounded-xl border border-gray-100 transition-colors hover:bg-gray-50 cursor-pointer">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Temperature</p>
                        <p className="text-[13px] font-bold text-gray-900 leading-snug">
                          {selectedInvoice.customTemp ? selectedInvoice.customTemp : (selectedInvoice.tempRange || 'Not provided')}
                        </p>
                      </div>
                    </div>

                    {selectedInvoice.description && (
                      <div className="mb-8">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2.5">Description / Notes</p>
                        <div className="p-4 bg-[#f8fafe] rounded-xl border border-blue-100/60 text-[13px] text-gray-700 leading-relaxed font-medium shadow-sm">
                          {selectedInvoice.description}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Requested Products (Qty: {selectedInvoice.quantity})</p>
                      <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedInvoice.products && Array.isArray(selectedInvoice.products) ? (
                          selectedInvoice.products.map((prod: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group">
                              <div className="size-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1.5 group-hover:border-emerald-600/20 transition-colors">
                                <img src={prod.image || '/Walk-inCooler&Freezer/combounits.jpg'} alt={prod.title} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">{prod.brand}</p>
                                <p className="text-[13px] font-bold text-gray-900 truncate leading-snug group-hover:text-emerald-700 transition-colors">{prod.title}</p>
                                <p className="text-[12px] font-bold text-gray-500 mt-1">${prod.price}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-5 text-[13px] text-gray-400 font-medium italic border-2 border-dashed border-gray-100 rounded-xl text-center bg-gray-50/50">
                            No products associated with this request.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Approve Modal Overlay */}
      {showApproveModal && selectedInvoice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Approve Invoice Request</h3>
            <p className="text-sm text-gray-500 mb-6">Enter the total amount for this project to generate a payment link.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (USD)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#004a99] focus:border-[#004a99]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Message (Optional)</label>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Any additional notes for the client..."
                  rows={3}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-[#004a99] focus:border-[#004a99]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setTotalAmount('');
                  setAdminMessage('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitApproval}
                disabled={!totalAmount || parseFloat(totalAmount) <= 0}
                className="px-4 py-2 text-sm font-medium text-white bg-[#004a99] hover:bg-[#004a99]/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve & Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global styles for custom scrollbar in modal */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
