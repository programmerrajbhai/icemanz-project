'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getQuotes, updateQuoteStatus, deleteQuoteRequest } from './actions';
import {
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Search,
  MapPin,
  Calendar,
  Briefcase,
  Wind,
  Box,
  Zap,
  Info,
  User,
  Mail,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

export type Quote = {
  id: string;
  jobName: string;
  address: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  date?: string | null;
  ambientTemp?: string | null;
  voltage?: string | null;
  phase?: string | null;

  coolerSystemType?: string | null;
  coolerRequiredTemp?: string | null;
  coolerDimension?: string | null;
  coolerNoOfDoors?: string | null;
  coolerDoorSize?: string | null;

  freezerSystemType?: string | null;
  freezerRequiredTemp?: string | null;
  freezerDimension?: string | null;
  freezerNoOfDoors?: string | null;
  freezerDoorSize?: string | null;

  additionalInfo?: string | null;
  status: string;
  createdAt: Date;
};

export default function QuotesClient({ quotes: initialQuotes }: { quotes: Quote[] }) {
  const { data: quotes, mutate } = useSWR<Quote[]>('quotes', getQuotes as any, { fallbackData: initialQuotes, refreshInterval: 10000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const filteredQuotes = (quotes || []).filter(quote =>
    quote.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const loadingToast = toast.loading('Updating status...');
    const result = await updateQuoteStatus(id, newStatus);

    if (result.success) {
      mutate();
      toast.success(`Status updated to ${newStatus}`, { id: loadingToast });
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote({ ...selectedQuote, status: newStatus });
      }
    } else {
      toast.error(result.error || 'Failed to update', { id: loadingToast });
    }
  };

  const executeDelete = async (id: string) => {
    const loadingToast = toast.loading('Deleting request...');
    const result = await deleteQuoteRequest(id);

    if (result.success) {
      mutate();
      toast.success('Quote request deleted', { id: loadingToast });
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote(null);
      }
    } else {
      toast.error(result.error || 'Failed to delete', { id: loadingToast });
    }
  };

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[240px]">
        <p className="text-sm font-bold text-gray-900 leading-snug">Are you sure you want to delete this quote request?</p>
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
      case 'REVIEWED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"><CheckCircle2 size={12} /> {status}</span>;
      case 'DECLINED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800"><XCircle size={12} /> Declined</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quote Requests</h1>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] transition-all"
            placeholder="Search by job name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Job Name</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Address</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#004a99]">
                          <Briefcase size={18} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{quote.jobName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {quote.fullName ? (
                        <div className="text-sm font-medium text-gray-900">{quote.fullName}</div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">No name</div>
                      )}
                      {quote.email && <div className="text-xs text-gray-500">{quote.email}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 truncate max-w-[250px]">{quote.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 cursor-pointer rounded-sm transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
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
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3 text-gray-400">
                      <Search size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">No requests found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View */}
      {selectedQuote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-[#004a99] rounded-lg"><Briefcase size={20} /></div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Quote Request Details</h2>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
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
                  {getStatusBadge(selectedQuote.status)}
                </div>
                <div className="flex gap-3">
                  {selectedQuote.status !== 'REVIEWED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedQuote.id, 'REVIEWED')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 size={16} /> Mark as Reviewed
                    </button>
                  )}
                  {selectedQuote.status !== 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedQuote.id, 'PENDING')}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                    >
                      <Clock size={16} /> Revert to Pending
                    </button>
                  )}
                </div>
              </div>

              {/* Detail Cards */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* General Info */}
                <div className="space-y-6">
                  <div className="h-full flex flex-col">
                    <h3 className="text-[12px] font-bold text-[#004a99] uppercase tracking-[0.15em] border-b border-gray-100 pb-4 mb-5">General Information</h3>

                    <div className="bg-white p-5 rounded-xl border border-[#004a99]/30 mb-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Job Name</p>
                      <p className="text-[18px] font-bold text-[#004a99] leading-tight">{selectedQuote.jobName}</p>
                    </div>

                    <div className="space-y-4 mb-5">
                      {selectedQuote.fullName && (
                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm">
                          <User size={16} className="text-gray-400" />
                          <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Contact Name</p>
                            <p className="text-[13px] font-bold text-gray-900 mt-0.5">{selectedQuote.fullName}</p>
                          </div>
                        </div>
                      )}

                      {selectedQuote.email && (
                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm">
                          <Mail size={16} className="text-gray-400" />
                          <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Email Address</p>
                            <p className="text-[13px] font-bold text-gray-900 mt-0.5">
                              <a href={`mailto:${selectedQuote.email}`} className="text-[#004a99] hover:underline">
                                {selectedQuote.email}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedQuote.phone && (
                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm">
                          <Phone size={16} className="text-gray-400" />
                          <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Phone Number</p>
                            <p className="text-[13px] font-bold text-gray-900 mt-0.5">
                              <a href={`tel:${selectedQuote.phone}`} className="text-[#004a99] hover:underline">
                                {selectedQuote.phone}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Installation Address</p>
                          <p className="text-[13px] font-bold text-gray-900 mt-0.5">{selectedQuote.address}</p>
                        </div>
                      </div>

                      {selectedQuote.date && (
                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm">
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Target Date</p>
                            <p className="text-[13px] font-bold text-gray-900 mt-0.5">{selectedQuote.date}</p>
                          </div>
                        </div>
                      )}

                      {(selectedQuote.ambientTemp || selectedQuote.voltage || selectedQuote.phase) && (
                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100/80 shadow-sm">
                          <Zap size={16} className="text-gray-400" />
                          <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Technical Specs</p>
                            <p className="text-[13px] font-bold text-gray-900 mt-0.5">
                              {selectedQuote.ambientTemp && `${selectedQuote.ambientTemp} Ambient | `}
                              {selectedQuote.voltage && `${selectedQuote.voltage}V `}
                              {selectedQuote.phase && `${selectedQuote.phase}`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedQuote.additionalInfo && (
                      <div className="mt-auto">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2.5">Additional Info</p>
                        <div className="p-4 bg-[#f8fafe] rounded-xl border border-blue-100/60 text-[13px] text-gray-700 leading-relaxed font-medium shadow-sm">
                          {selectedQuote.additionalInfo}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cooler & Freezer Specs */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
                    <h3 className="text-[12px] font-bold text-emerald-600 uppercase tracking-[0.15em] border-b border-gray-50 pb-4 mb-5">Cooler Specs</h3>

                    {selectedQuote.coolerSystemType || selectedQuote.coolerDimension ? (
                      <div className="space-y-4 mb-8">
                        {selectedQuote.coolerSystemType && (
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50/80">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">System Type</span>
                            <span className="text-[13px] font-bold text-gray-900">{selectedQuote.coolerSystemType}</span>
                          </div>
                        )}
                        {selectedQuote.coolerRequiredTemp && (
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50/80">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Req. Temp</span>
                            <span className="text-[13px] font-bold text-gray-900">{selectedQuote.coolerRequiredTemp}</span>
                          </div>
                        )}
                        {selectedQuote.coolerDimension && (
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50/80">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Dimensions</span>
                            <span className="text-[13px] font-bold text-gray-900">{selectedQuote.coolerDimension}</span>
                          </div>
                        )}
                        {selectedQuote.coolerNoOfDoors && (
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50/80">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Doors</span>
                            <span className="text-[13px] font-bold text-gray-900">{selectedQuote.coolerNoOfDoors} <span className="text-gray-500 font-medium">({selectedQuote.coolerDoorSize || 'Size N/A'})</span></span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[12px] text-gray-400 font-medium italic mb-8">No cooler specs provided</div>
                    )}

                    <h3 className="text-[12px] font-bold text-blue-600 uppercase tracking-[0.15em] border-b border-gray-50 pb-4 mb-5">Freezer Specs</h3>

                    {selectedQuote.freezerSystemType || selectedQuote.freezerDimension ? (
                      <div className="space-y-4">
                        {selectedQuote.freezerSystemType && (
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50/80">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">System Type</span>
                            <span className="text-[13px] font-bold text-gray-900">{selectedQuote.freezerSystemType}</span>
                          </div>
                        )}
                        {selectedQuote.freezerRequiredTemp && (
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50/80">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Req. Temp</span>
                            <span className="text-[13px] font-bold text-gray-900">{selectedQuote.freezerRequiredTemp}</span>
                          </div>
                        )}
                        {selectedQuote.freezerDimension && (
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50/80">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Dimensions</span>
                            <span className="text-[13px] font-bold text-gray-900">{selectedQuote.freezerDimension}</span>
                          </div>
                        )}
                        {selectedQuote.freezerNoOfDoors && (
                          <div className="flex justify-between items-center py-2.5 border-b border-gray-50/80">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Doors</span>
                            <span className="text-[13px] font-bold text-gray-900">{selectedQuote.freezerNoOfDoors} <span className="text-gray-500 font-medium">({selectedQuote.freezerDoorSize || 'Size N/A'})</span></span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[12px] text-gray-400 font-medium italic">No freezer specs provided</div>
                    )}

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
          background: #f1f1f1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; 
        }
      `}} />
    </div>
  );
}
