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
  Trash2,
  Package,
  CreditCard,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';

type Order = {
  id: string;
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  amountPaid: number;
  currency: string;
  stripeSessionId: string;
  stripePaymentId: string | null;
  status: string;
  shippingName?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingZip?: string | null;
  shippingCountry?: string | null;
  deliveryMethod?: string | null;
  createdAt: Date;
  invoice: any;
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const { data: orders, mutate } = useSWR<Order[]>('orders-refrigeration', getOrders as any, { fallbackData: initialOrders, refreshInterval: 10000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(null);

  const handleDelete = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      toast.success('Order deleted successfully');
      mutate();
      setDeleteConfirmOrder(null);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error('Failed to delete order');
      console.error(error);
    }
  };

  const getOrderProducts = (order: any) => {
    if (!order?.invoice?.products) return [];
    if (Array.isArray(order.invoice.products)) return order.invoice.products;
    if (typeof order.invoice.products === 'string') {
      try {
        return JSON.parse(order.invoice.products);
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const getProductTitle = (order: Order) => {
    const productsList = getOrderProducts(order);
    if (productsList.length > 0) {
      const titles = productsList
        .map((p: any) => p.name || p.title || p.projectName)
        .filter(Boolean);
      if (titles.length > 0) {
        return titles.join(', ');
      }
    }
    return order.invoice?.projectName || 'N/A';
  };

  const filteredOrders = (orders || []).filter(ord => {
    const term = searchTerm.toLowerCase();
    const prodTitle = getProductTitle(ord).toLowerCase();
    return (
      ord.customerName.toLowerCase().includes(term) ||
      ord.customerEmail.toLowerCase().includes(term) ||
      ord.id.toLowerCase().includes(term) ||
      prodTitle.includes(term) ||
      (ord.invoice?.projectName && ord.invoice.projectName.toLowerCase().includes(term))
    );
  });

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
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Refrigeration Equipment Orders</h1>

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
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Title</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Info</th>
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
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium line-clamp-2 max-w-xs">{getProductTitle(order)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-emerald-600">${order.amountPaid.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 uppercase">{order.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{order.customerName}</span>
                        <span className="text-sm text-gray-500">{order.customerEmail}</span>
                      </div>
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#004a99]">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order Details</h2>
                  <p className="text-xs text-gray-400">Order #{selectedOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/50 space-y-6">
              {/* Order Status & Amount Paid Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-xl border border-gray-100 shadow-sm gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Order Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Total Amount Paid</p>
                  <p className="text-3xl font-black text-emerald-600 tracking-tight">
                    ${selectedOrder.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-xs font-bold text-gray-400 uppercase ml-1.5">{selectedOrder.currency}</span>
                  </p>
                </div>
              </div>

              {/* Customer Details Card */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} className="text-[#004a99]" /> Customer Details
                </h3>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-gray-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Customer Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedOrder.customerName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-gray-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Email Address</p>
                      <p className="text-sm font-bold text-gray-900">{selectedOrder.customerEmail || 'N/A'}</p>
                    </div>
                  </div>
                  {(selectedOrder.customerPhone || selectedOrder.invoice?.phone) && (
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="text-gray-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                        <p className="text-sm font-bold text-gray-900">{selectedOrder.customerPhone || selectedOrder.invoice?.phone}</p>
                      </div>
                    </div>
                  )}
                  {(selectedOrder.shippingAddress || selectedOrder.invoice?.address) && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Shipping Address</p>
                        <p className="text-sm font-bold text-gray-900">
                          {selectedOrder.shippingAddress
                            ? `${selectedOrder.shippingName ? selectedOrder.shippingName + ' - ' : ''}${selectedOrder.shippingAddress}${selectedOrder.shippingCity ? ', ' + selectedOrder.shippingCity : ''}${selectedOrder.shippingState ? ', ' + selectedOrder.shippingState : ''}${selectedOrder.shippingZip ? ' ' + selectedOrder.shippingZip : ''}`
                            : selectedOrder.invoice?.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PRODUCTS SECTION - PLACED FIRST ABOVE PAYMENT DETAILS */}
              {getOrderProducts(selectedOrder).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Package size={16} className="text-[#004a99]" /> Products Ordered ({getOrderProducts(selectedOrder).length})
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                    {getOrderProducts(selectedOrder).map((product: any, index: number) => {
                      const title = product.title || product.name || product.model || 'Featured Product';
                      const brand = product.brand || 'ICEMANZ';
                      const qty = product.quantity || 1;
                      const priceNum = parseFloat(String(product.price || '0').replace(/[^0-9.]/g, '')) || 0;
                      const formattedPrice = priceNum > 0 ? `$${priceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : (product.price ? `$${product.price}` : '$0.00');

                      return (
                        <div key={index} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:bg-gray-50/50 transition-colors">
                          {/* Image */}
                          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl bg-white border border-gray-200 p-2.5 flex items-center justify-center overflow-hidden shadow-sm">
                            {product.image || (product.images && product.images[0]) ? (
                              <img
                                src={product.image || product.images[0]}
                                alt={title}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Package size={36} className="text-gray-300" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 w-full space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-blue-50 text-[#004a99] font-bold text-[10px] uppercase rounded-md tracking-wider">
                                {brand}
                              </span>
                              {product.category && (
                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 font-semibold text-[10px] rounded-md">
                                  {product.category}
                                </span>
                              )}
                            </div>

                            <h4 className="text-base font-bold text-gray-900 leading-snug">
                              {title}
                            </h4>

                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 pt-1">
                              <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 font-bold">Qty: {qty}</span>
                              <span className="bg-emerald-50 px-2.5 py-1 rounded-md text-emerald-700 font-bold">Price: {formattedPrice}</span>
                              {priceNum > 0 && (
                                <span className="bg-blue-50 px-2.5 py-1 rounded-md text-[#004a99] font-bold">
                                  Total: ${(priceNum * qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Project Details (if applicable) */}
              {selectedOrder.invoice && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} className="text-[#004a99]" /> Project Details
                  </h3>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                    <p className="text-base font-bold text-[#004a99]">
                      {selectedOrder.invoice.projectName || 'Custom Project'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                      {(selectedOrder.invoice.width && selectedOrder.invoice.length && selectedOrder.invoice.height) && (
                        <p><span className="font-bold text-gray-700">Dimensions:</span> {selectedOrder.invoice.width} x {selectedOrder.invoice.length} x {selectedOrder.invoice.height}</p>
                      )}
                      <p><span className="font-bold text-gray-700">Temp Range:</span> {selectedOrder.invoice.tempRange || selectedOrder.invoice.customTemp || 'N/A'}</p>
                    </div>
                    {selectedOrder.invoice.description && (
                      <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700 leading-relaxed border border-gray-100">
                        {selectedOrder.invoice.description}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAYMENT DETAILS CARD - PLACED AT THE BOTTOM */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={16} className="text-[#004a99]" /> Payment Details
                </h3>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-gray-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Date Paid</p>
                      <p className="text-sm font-bold text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign size={16} className="text-gray-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Stripe Payment ID</p>
                      <p className="text-xs font-mono font-semibold text-gray-800 break-all">{selectedOrder.stripePaymentId || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText size={16} className="text-gray-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Invoice ID</p>
                      <p className="text-xs font-mono font-semibold text-gray-800 break-all">{selectedOrder.invoiceId}</p>
                    </div>
                  </div>
                  {selectedOrder.deliveryMethod && (
                    <div className="flex items-start gap-3">
                      <Truck size={16} className="text-gray-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Delivery Method</p>
                        <p className="text-sm font-bold text-gray-900 capitalize">{selectedOrder.deliveryMethod}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                  onClick={() => handleDelete(deleteConfirmOrder.id)}
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
