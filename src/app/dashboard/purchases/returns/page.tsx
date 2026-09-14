"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  ArrowUpDown,
  RotateCcw,
  FileText
} from 'lucide-react';

interface PurchaseReturnRecord {
  id: string;
  referenceNo: string;
  parentPurchaseRef: string;
  supplierName: string;
  date: string;
  businessLocation: string;
  paymentStatus: 'Paid' | 'Due';
  grandTotal: number;
  paymentDue: number;
}

const mockReturns: PurchaseReturnRecord[] = [
  {
    id: 'PR-1',
    referenceNo: 'PR-2026-001',
    parentPurchaseRef: 'PO-202609-8812',
    supplierName: 'SHAMIM',
    date: '13/09/2026 03:20 PM',
    businessLocation: 'RANGPUR BIKE PARLOUR (BL0001)',
    paymentStatus: 'Paid',
    grandTotal: 1200,
    paymentDue: 0
  },
  {
    id: 'PR-2',
    referenceNo: 'PR-2026-002',
    parentPurchaseRef: 'PO-202609-4321',
    supplierName: 'JAMAL TRADERS',
    date: '10/09/2026 04:45 PM',
    businessLocation: 'RANGPUR BIKE PARLOUR (BL0001)',
    paymentStatus: 'Due',
    grandTotal: 650,
    paymentDue: 650
  }
];

export default function PurchaseReturnsPage() {
  const [returns, setReturns] = useState<PurchaseReturnRecord[]>(mockReturns);
  const [searchQuery, setSearchQuery] = useState('');

  // Load created returns from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('pos_purchase_returns');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReturns((prev) => {
            const existingRefs = new Set(prev.map((r) => r.referenceNo));
            const newOnes = parsed.filter((r: any) => !existingRefs.has(r.referenceNo));
            return [...newOnes, ...prev];
          });
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  const filtered = returns.filter(
    (r) =>
      r.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.parentPurchaseRef.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none font-sans pb-16 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight flex items-center gap-2">
            <span>List Purchase Return</span>
            <span className="text-xs font-normal text-slate-400">Manage purchase returns</span>
          </h1>
        </div>

        <Link
          href="/dashboard/purchases/returns/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition-all active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.3)] w-fit cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Purchase Return</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl overflow-hidden p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, supplier..."
              className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>
          <span className="text-xs text-slate-400">{filtered.length} return records</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin scrollbar-thumb-white/15">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-white/[0.04] text-indigo-200/90 uppercase tracking-wider text-[11px] font-bold border-b border-white/10 select-none">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Reference No</th>
                <th className="py-3.5 px-4">Parent Purchase</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-right">Payment Due</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/[0.01]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400">
                    No purchase return records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3.5 px-4 text-slate-300">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{item.referenceNo}</td>
                    <td className="py-3.5 px-4 text-slate-300">{item.parentPurchaseRef}</td>
                    <td className="py-3.5 px-4 text-slate-300">{item.businessLocation}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{item.supplierName}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          item.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-cyan-300">৳{item.grandTotal.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-rose-400">৳{item.paymentDue.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setReturns((prev) => prev.filter((r) => r.id !== item.id))}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
