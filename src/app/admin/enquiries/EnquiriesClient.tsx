'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import {
  Eye,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  X,
  User,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getEnquiries, deleteEnquiry, updateEnquiryStatus } from './actions';

type Enquiry = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

// SWR fetcher using Server Action
const fetcher = async () => {
  const data = await getEnquiries();
  return data;
};

export default function EnquiriesClient({ initialData }: { initialData: any[] }) {
  const { data: enquiries, mutate } = useSWR<Enquiry[]>('enquiries', fetcher, {
    fallbackData: initialData,
    refreshInterval: 30000, // Poll every 30 seconds
    revalidateOnFocus: true,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const filteredEnquiries = (enquiries || []).filter(enquiry =>
    enquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const executeDelete = async (id: string) => {
    const loadingToast = toast.loading('Deleting enquiry...');
    try {
      await deleteEnquiry(id);
      mutate(enquiries?.filter(e => e.id !== id), { revalidate: false });
      toast.success('Enquiry deleted successfully', { id: loadingToast });
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
    } catch (error) {
      toast.error('Failed to delete enquiry', { id: loadingToast });
    }
  };

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[240px]">
        <p className="text-sm font-bold text-gray-900 leading-snug">Are you sure you want to delete this enquiry?</p>
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const loadingToast = toast.loading('Updating status...');
    try {
      await updateEnquiryStatus(id, newStatus);
      mutate(enquiries?.map(e => e.id === id ? { ...e, status: newStatus } : e), { revalidate: false });
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
      toast.success(`Status updated to ${newStatus}`, { id: loadingToast });
    } catch (error) {
      toast.error('Failed to update status', { id: loadingToast });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RESOLVED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"><CheckCircle2 size={12} /> Resolved</span>;
      case 'REVIEWED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800"><Clock size={12} /> Reviewed</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">General Enquiries</h1>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
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
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{enquiry.fullName}</span>
                        <span className="text-sm text-gray-500">{enquiry.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium line-clamp-1 max-w-xs">{enquiry.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(enquiry.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 cursor-pointer rounded-sm transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(enquiry.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 cursor-pointer rounded-sm transition-colors"
                          title="Delete Enquiry"
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
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-[#004a99]" size={24} />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Enquiry Details</h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
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
                  {getStatusBadge(selectedEnquiry.status)}
                </div>
                <div className="flex gap-3">
                  {selectedEnquiry.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, 'RESOLVED')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 size={18} /> Mark Resolved
                    </button>
                  )}
                  {selectedEnquiry.status !== 'REVIEWED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, 'REVIEWED')}
                      className="px-5 py-2.5 bg-[#004a99] hover:bg-blue-800 text-white text-sm font-bold rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                    >
                      <Clock size={18} /> Mark Reviewed
                    </button>
                  )}
                  {selectedEnquiry.status !== 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, 'PENDING')}
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
                          <p className="text-[13px] font-bold text-gray-900 mt-0.5 group-hover:text-[#004a99] transition-colors">{selectedEnquiry.fullName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm group cursor-pointer transition-colors hover:border-[#004a99]/30">
                        <div className="text-gray-400 group-hover:text-[#004a99] transition-colors"><Mail size={16} /></div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Email Address</p>
                          <a href={`mailto:${selectedEnquiry.email}`} className="text-[13px] font-bold text-gray-900 mt-0.5 hover:text-[#004a99] hover:underline transition-colors block">{selectedEnquiry.email}</a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm group cursor-pointer transition-colors hover:border-[#004a99]/30">
                        <div className="text-gray-400 group-hover:text-[#004a99] transition-colors"><Phone size={16} /></div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Phone Number</p>
                          <a href={`tel:${selectedEnquiry.phone}`} className="text-[13px] font-bold text-gray-900 mt-0.5 hover:text-[#004a99] hover:underline transition-colors block">{selectedEnquiry.phone || 'N/A'}</a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm group cursor-pointer transition-colors hover:border-[#004a99]/30">
                        <div className="text-gray-400 group-hover:text-[#004a99] transition-colors"><Calendar size={16} /></div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Submitted On</p>
                          <p className="text-[13px] font-bold text-gray-900 mt-0.5 group-hover:text-[#004a99] transition-colors">{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Message Details */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
                    <h3 className="text-[12px] font-bold text-emerald-600 uppercase tracking-[0.15em] border-b border-gray-50 pb-4 mb-5">Enquiry Message</h3>

                    <div className="p-4 bg-[#f8fafe] rounded-xl border border-blue-100/60 text-[14px] text-gray-800 leading-relaxed font-medium shadow-sm min-h-[200px] whitespace-pre-wrap">
                      {selectedEnquiry.message}
                    </div>
                  </div>
                </div>
              </div>

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
