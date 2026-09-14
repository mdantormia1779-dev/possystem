"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Trash2,
  Calendar,
  Building,
  DollarSign,
  ArrowUpDown,
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';

interface PurchaseRecord {
  id: string;
  referenceNo: string;
  supplierName: string;
  purchaseDate: string;
  businessLocation: string;
  status: 'Received' | 'Pending' | 'Ordered';
  paymentStatus: 'Paid' | 'Partial' | 'Due';
  grandTotal: number;
  paymentDue: number;
  paidAmount: number;
  itemsCount: number;
  paymentMethod?: string;
  items?: any[];
  shippingCharges?: number;
  totalExpenses?: number;
  calculatedTax?: number;
  calculatedDiscount?: number;
}

const initialMockPurchases: PurchaseRecord[] = [
  {
    id: 'PO-1001',
    referenceNo: 'PO-202609-8812',
    supplierName: 'SHAMIM',
    purchaseDate: '14/09/2026 05:15 PM',
    businessLocation: 'RANGPUR BIKE PARLOUR (BL0001)',
    status: 'Received',
    paymentStatus: 'Paid',
    grandTotal: 12500,
    paidAmount: 12500,
    paymentDue: 0,
    itemsCount: 3,
    paymentMethod: 'Cash',
    items: [
      { name: 'Head Light', quantity: 2, unitCostBeforeTax: 5000, lineTotal: 10000 },
      { name: 'MOBILE STAND', quantity: 2, unitCostBeforeTax: 1000, lineTotal: 2000 },
      { name: 'WD 400', quantity: 4, unitCostBeforeTax: 120, lineTotal: 480 }
    ]
  },
  {
    id: 'PO-1002',
    referenceNo: 'PO-202609-4321',
    supplierName: 'JAMAL TRADERS',
    purchaseDate: '12/09/2026 11:30 AM',
    businessLocation: 'RANGPUR BIKE PARLOUR (BL0001)',
    status: 'Received',
    paymentStatus: 'Partial',
    grandTotal: 8400,
    paidAmount: 5000,
    paymentDue: 3400,
    itemsCount: 4,
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Brake Pad Set', quantity: 8, unitCostBeforeTax: 650, lineTotal: 5200 },
      { name: 'Engine Oil 10W-40', quantity: 3, unitCostBeforeTax: 850, lineTotal: 2550 }
    ]
  },
  {
    id: 'PO-1003',
    referenceNo: 'PO-202609-1109',
    supplierName: 'KABIR MOTORS',
    purchaseDate: '08/09/2026 02:45 PM',
    businessLocation: 'DHAKA CENTRAL OUTLET (BL0002)',
    status: 'Ordered',
    paymentStatus: 'Due',
    grandTotal: 15600,
    paidAmount: 0,
    paymentDue: 15600,
    itemsCount: 5,
    paymentMethod: 'Cheque',
    items: [
      { name: 'Head Light', quantity: 3, unitCostBeforeTax: 5000, lineTotal: 15000 },
      { name: 'WD 400', quantity: 5, unitCostBeforeTax: 120, lineTotal: 600 }
    ]
  }
];

export default function PurchasesListPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(initialMockPurchases);
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(true);

  // View modal state
  const [viewingPurchase, setViewingPurchase] = useState<PurchaseRecord | null>(null);

  // Load newly created purchases from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pos_purchases');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formattedFromStorage: PurchaseRecord[] = parsed.map((item: any, idx: number) => ({
            id: 'stored-' + idx,
            referenceNo: item.referenceNo || `PO-${idx}`,
            supplierName: item.supplierName || 'Selected Supplier',
            purchaseDate: item.purchaseDate || new Date().toLocaleDateString('en-GB'),
            businessLocation: item.businessLocation || 'RANGPUR BIKE PARLOUR (BL0001)',
            status: 'Received',
            paymentStatus: item.status || (item.paymentDue === 0 ? 'Paid' : item.paidAmount > 0 ? 'Partial' : 'Due'),
            grandTotal: item.purchaseTotal || 0,
            paidAmount: item.paidAmount || 0,
            paymentDue: item.paymentDue !== undefined ? item.paymentDue : 0,
            itemsCount: item.items ? item.items.length : 0,
            paymentMethod: item.paymentMethod || 'Cash',
            items: item.items || [],
            shippingCharges: item.shippingCharges || 0,
            totalExpenses: item.totalExpenses || 0,
            calculatedTax: item.calculatedTax || 0,
            calculatedDiscount: item.calculatedDiscount || 0
          }));

          setPurchases((prev) => {
            const existingRefs = new Set(prev.map((p) => p.referenceNo));
            const newOnes = formattedFromStorage.filter((p) => !existingRefs.has(p.referenceNo));
            return [...newOnes, ...prev];
          });
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this purchase record?')) {
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filteredPurchases = purchases.filter((item) => {
    const matchesSearch =
      item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSupplier = supplierFilter === 'All' || item.supplierName === supplierFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'All' || item.paymentStatus === paymentStatusFilter;
    const matchesLocation = locationFilter === 'All' || item.businessLocation.includes(locationFilter);

    return matchesSearch && matchesSupplier && matchesStatus && matchesPaymentStatus && matchesLocation;
  });

  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.grandTotal, 0);
  const totalPaid = purchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalDue = purchases.reduce((sum, p) => sum + p.paymentDue, 0);

  return (
    <div className="space-y-6 select-none font-sans pb-16 text-slate-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight flex items-center gap-2">
            <span>Purchases</span>
            <span className="text-xs font-normal text-slate-400">Manage your purchases</span>
          </h1>
        </div>

        <Link
          href="/dashboard/purchases/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition-all active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.3)] w-fit cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Purchase</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-5 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Purchases</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <FileText size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">৳{totalPurchasesAmount.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{purchases.length} total orders recorded</p>
        </div>

        <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-5 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Paid</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 mt-2">৳{totalPaid.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Cleared vendor balance</p>
        </div>

        <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-5 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Purchase Due</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-400 mt-2">৳{totalDue.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Pending payments to suppliers</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-5 py-3.5 bg-[#0c0827]/60 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-violet-400" />
            <span>Filter Purchases</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 text-slate-400 ${showFilters ? 'rotate-180' : ''}`}
          />
        </button>

        {showFilters && (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Supplier:</label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer"
              >
                <option value="All" className="bg-[#0c0827]">All Suppliers</option>
                {Array.from(new Set(purchases.map((p) => p.supplierName))).map((sup) => (
                  <option key={sup} value={sup} className="bg-[#0c0827]">
                    {sup}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Purchase Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer"
              >
                <option value="All" className="bg-[#0c0827]">All Statuses</option>
                <option value="Received" className="bg-[#0c0827]">Received</option>
                <option value="Pending" className="bg-[#0c0827]">Pending</option>
                <option value="Ordered" className="bg-[#0c0827]">Ordered</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Payment Status:</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer"
              >
                <option value="All" className="bg-[#0c0827]">All Statuses</option>
                <option value="Paid" className="bg-[#0c0827]">Paid</option>
                <option value="Partial" className="bg-[#0c0827]">Partial</option>
                <option value="Due" className="bg-[#0c0827]">Due</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Search Keyword:</label>
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ref No / Supplier..."
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl overflow-hidden p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-wide">All Purchases</h2>
          <span className="text-xs text-slate-400">{filteredPurchases.length} records</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin scrollbar-thumb-white/15">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-white/[0.04] text-indigo-200/90 uppercase tracking-wider text-[11px] font-bold border-b border-white/10 select-none">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Reference No</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Purchase Status</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-right">Payment Due</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 bg-white/[0.01]">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No purchase records match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {item.purchaseDate}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      {item.referenceNo}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {item.supplierName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          item.status === 'Received'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          item.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.paymentStatus === 'Partial'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-cyan-300">
                      ৳{item.grandTotal.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-rose-400">
                      ৳{item.paymentDue.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingPurchase(item)}
                          className="p-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-colors cursor-pointer"
                          title="View Invoice"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice View Modal */}
      {viewingPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-xs text-slate-200">
            
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-xs pointer-events-none" />

            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/70">
              <div>
                <h3 className="text-base font-bold text-white">Purchase Details</h3>
                <p className="text-[11px] text-slate-400">{viewingPurchase.referenceNo}</p>
              </div>
              <button
                onClick={() => setViewingPurchase(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[#08051e] border border-white/10 rounded-2xl">
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Supplier</span>
                  <span className="font-bold text-white">{viewingPurchase.supplierName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Date</span>
                  <span className="font-bold text-white">{viewingPurchase.purchaseDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Location</span>
                  <span className="font-bold text-white">{viewingPurchase.businessLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Payment Method</span>
                  <span className="font-bold text-white">{viewingPurchase.paymentMethod || 'Cash'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Payment Status</span>
                  <span className="font-bold text-cyan-300">{viewingPurchase.paymentStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Purchase Status</span>
                  <span className="font-bold text-emerald-300">{viewingPurchase.status}</span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-white mb-2">Purchased Items</h4>
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Cost</th>
                        <th className="py-2.5 px-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-[#08051e]/60">
                      {viewingPurchase.items && viewingPurchase.items.length > 0 ? (
                        viewingPurchase.items.map((it: any, i: number) => (
                          <tr key={i} className="hover:bg-white/[0.04]">
                            <td className="py-2.5 px-3 text-slate-400">{i + 1}</td>
                            <td className="py-2.5 px-3 font-semibold text-white">{it.name}</td>
                            <td className="py-2.5 px-3 text-center text-slate-200">{it.quantity}</td>
                            <td className="py-2.5 px-3 text-right text-slate-200">৳{Number(it.unitCostBeforeTax || 0).toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-cyan-300">৳{Number(it.lineTotal || 0).toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-400">
                            {viewingPurchase.itemsCount} items in this purchase order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="flex flex-col items-end space-y-1.5 text-xs pt-3 border-t border-white/10">
                <div className="flex justify-between w-56 text-slate-400">
                  <span>Grand Total:</span>
                  <span className="font-extrabold text-white">৳{viewingPurchase.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-56 text-emerald-400">
                  <span>Paid Amount:</span>
                  <span className="font-extrabold">৳{viewingPurchase.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-56 text-rose-400">
                  <span>Payment Due:</span>
                  <span className="font-extrabold">৳{viewingPurchase.paymentDue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0c0827]/70 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingPurchase(null)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
