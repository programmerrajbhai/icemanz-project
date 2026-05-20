'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getOrders, deleteOrder } from './actions';
import {
  Eye,
  CheckCircle2,
  Clock,
  X,
  Search,
  FileText,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  DollarSign,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

type Order = {
  id: string;
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  amountPaid: number;
  currency: string;
  stripeSessionId: string;
  stripePaymentId: string | null;
  status: string;
  createdAt: Date;
  invoice: any;
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const { data: orders, mutate } = useSWR<Order[]>('orders-walkin', getOrders as any, { fallbackData: initialOrders, refreshInterval: 10000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(null);

  const handleDelete = async () => {
    if (!deleteConfirmOrder) return;
    try {
      await deleteOrder(deleteConfirmOrder.id);
      mutate();
      toast.success('Order deleted successfully!');
      setDeleteConfirmOrder(null);
    } catch (error) {
      toast.error('Failed to delete order');
      console.error(error);
    }
  };

  const filteredOrders = (orders || []).filter(ord =>
    ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ord.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ord.invoice?.projectName && ord.invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"><CheckCircle2 size={12} /> Paid</span>;
      case 'REFUNDED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800"><X size={12} /> Refunded</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800"><Clock size={12} /> {status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Walk-in Cooler & Freezer Orders</h1>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
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
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID / Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Info</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{order.id.substring(0, 8)}...</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{order.customerName}</span>
                        <span className="text-sm text-gray-500">{order.customerEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium line-clamp-1">{order.invoice?.projectName || <span className="text-gray-400 italic">No project name</span>}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-emerald-600">${order.amountPaid.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 uppercase">{order.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 cursor-pointer rounded-sm transition-colors inline-block mr-2"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmOrder(order)}
                        className="p-1.5 text-red-600 hover:bg-red-50 cursor-pointer rounded-sm transition-colors inline-block"
                        title="Delete Order"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="text-[#004a99]" size={24} />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order Details</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30">
              <div className="flex items-center justify-between bg-white p-5 rounded-lg border border-gray-100 shadow-sm mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Order Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Amount Paid</p>
                  <p className="text-2xl font-black text-emerald-600">${selectedOrder.amountPaid.toFixed(2)} <span className="text-sm font-bold text-gray-400 uppercase">{selectedOrder.currency}</span></p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Customer Details</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-100 space-y-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-bold text-gray-900">{selectedOrder.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-bold text-gray-900">{selectedOrder.customerEmail}</p>
                      </div>
                    </div>
                    {selectedOrder.invoice?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.invoice.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.invoice?.address && (
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.invoice.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Payment Details</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-100 space-y-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date Paid</p>
                        <p className="text-sm font-bold text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Stripe Payment ID</p>
                        <p className="text-xs font-mono text-gray-900 break-all">{selectedOrder.stripePaymentId || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Invoice ID</p>
                        <p className="text-xs font-mono text-gray-900 break-all">{selectedOrder.invoiceId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.invoice?.products && selectedOrder.invoice.products.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4">Products</h3>
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                      {(selectedOrder.invoice.products as any[]).map((product: any, index: number) => (
                        <div key={index} className="p-4">
                          <div className="flex gap-4">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name || 'Product'}
                                className="w-20 h-20 object-cover rounded border border-gray-200"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">{product.name || 'Product'}</p>
                              <p className="text-xs text-gray-500 mt-1">{product.brand || 'ICEMANZ'}</p>
                              <div className="flex gap-4 mt-2 text-sm">
                                <span className="text-gray-600">Qty: <span className="font-semibold">{product.quantity || 1}</span></span>
                                <span className="text-gray-600">Price: <span className="font-semibold">{product.price}</span></span>
                                {product.category && (
                                  <span className="text-gray-600">Category: <span className="font-semibold">{product.category}</span></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.invoice && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4">Project Details</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-[#004a99] mb-2">{selectedOrder.invoice.projectName || 'Custom Project'}</p>
                    <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                      {(selectedOrder.invoice.width && selectedOrder.invoice.length && selectedOrder.invoice.height) && (
                        <p><span className="font-semibold">Dimensions:</span> {selectedOrder.invoice.width}x{selectedOrder.invoice.length}x{selectedOrder.invoice.height}</p>
                      )}
                      <p><span className="font-semibold">Temp Range:</span> {selectedOrder.invoice.tempRange || selectedOrder.invoice.customTemp || 'N/A'}</p>
                    </div>
                    {selectedOrder.invoice.description && (
                      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
                        {selectedOrder.invoice.description}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Trash2 className="text-red-600" size={24} />
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Delete Order</h2>
              </div>
              <button
                onClick={() => setDeleteConfirmOrder(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this order? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
