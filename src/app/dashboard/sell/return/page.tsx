"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Save,
  CheckCircle2,
  DollarSign,
  Info,
  Layers,
  RotateCcw
} from 'lucide-react';

interface ReturnProduct {
  id: string;
  name: string;
  unitPrice: number;
  sellQuantity: number;
  returnQuantity: number;
}

function SellReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceParam = searchParams.get('invoice') || '0003';

  // State for parent sale
  const [parentInvoice, setParentInvoice] = useState(invoiceParam);
  const [parentDate, setParentDate] = useState('14/09/2026');
  const [parentCustomer, setParentCustomer] = useState('Walk-In Customer');
  const [parentLocation, setParentLocation] = useState('RANGPUR BIKE PARLOUR');

  // Return fields matching Screenshot 2
  const [returnInvoiceNo, setReturnInvoiceNo] = useState('');
  const [returnDate, setReturnDate] = useState('14/09/2026 05:46 PM');
  const [discountType, setDiscountType] = useState('Percentage');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Products
  const [products, setProducts] = useState<ReturnProduct[]>([
    {
      id: '1',
      name: 'MOBILE STAND 0002',
      unitPrice: 1200,
      sellQuantity: 4,
      returnQuantity: 0,
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load parent sale from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pos_sales');
      if (stored) {
        const sales = JSON.parse(stored);
        const match = sales.find((s: any) => s.invoiceNo === invoiceParam);
        if (match) {
          setParentInvoice(match.invoiceNo);
          setParentDate(match.date?.split(' ')[0] || '14/09/2026');
          setParentCustomer(match.customerName || 'Walk-In Customer');
          setParentLocation(match.location || 'RANGPUR BIKE PARLOUR');
          if (match.items && match.items.length > 0) {
            setProducts(
              match.items.map((it: any, idx: number) => ({
                id: String(idx + 1),
                name: it.name || 'MOBILE STAND 0002',
                unitPrice: Number(it.unitPrice || 1200),
                sellQuantity: Number(it.quantity || 4),
                returnQuantity: 0,
              }))
            );
          }
        }
      }
    } catch {
      // Ignored
    }
  }, [invoiceParam]);

  const handleReturnQuantityChange = (id: string, qty: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const validQty = Math.max(0, Math.min(qty, p.sellQuantity));
          return { ...p, returnQuantity: validQty };
        }
        return p;
      })
    );
  };

  // Computations
  const returnSubtotal = products.reduce((acc, p) => acc + p.returnQuantity * p.unitPrice, 0);
  const calculatedDiscount =
    discountType === 'Percentage'
      ? (returnSubtotal * (Number(discountAmount) || 0)) / 100
      : Number(discountAmount) || 0;
  const returnTotal = Math.max(0, returnSubtotal - calculatedDiscount);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (returnSubtotal <= 0) {
      setToastMessage('Please specify a return quantity greater than 0.');
      return;
    }

    // Save return to localStorage
    try {
      const storedReturns = localStorage.getItem('pos_sell_returns') || '[]';
      const parsed = JSON.parse(storedReturns);
      const newReturn = {
        id: String(Date.now()),
        parentInvoice,
        returnInvoiceNo: returnInvoiceNo || `RET-${parentInvoice}`,
        returnDate,
        customer: parentCustomer,
        location: parentLocation,
        returnTotal,
        items: products.filter((p) => p.returnQuantity > 0),
      };
      localStorage.setItem('pos_sell_returns', JSON.stringify([newReturn, ...parsed]));
    } catch {
      // Ignored
    }

    setToastMessage(`Sell Return for Invoice #${parentInvoice} saved successfully!`);
    setTimeout(() => {
      router.push('/dashboard/sell');
    }, 1500);
  };

  return (
    <div className="space-y-6 select-none font-sans pb-16 text-slate-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[120] flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-900/95 to-indigo-900/95 border border-violet-500/40 text-white shadow-2xl backdrop-blur-xl animate-in fade-in duration-200">
          <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/sell"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
            Sell Return
          </h1>
        </div>
      </div>

      {/* Card 1: Parent Sale matching Screenshot 2 */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-cyan-300 tracking-wide uppercase">
          Parent Sale
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#08051e]/80 border border-white/10 text-xs">
          <div className="space-y-1.5">
            <p className="text-slate-300">
              <span className="font-bold text-white">Invoice No:</span> {parentInvoice}
            </p>
            <p className="text-slate-300">
              <span className="font-bold text-white">Date:</span> {parentDate}
            </p>
          </div>
          <div className="space-y-1.5 sm:text-right">
            <p className="text-slate-300">
              <span className="font-bold text-white">Customer:</span> {parentCustomer}
            </p>
            <p className="text-slate-300">
              <span className="font-bold text-white">Business Location:</span> {parentLocation}
            </p>
          </div>
        </div>
      </div>

      {/* Card 2: Return Details Form matching Screenshot 2 */}
      <form onSubmit={handleSave} className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-5 sm:p-6 space-y-6">
        
        {/* Row 1: Invoice No & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Invoice No.:</label>
            <input
              type="text"
              value={returnInvoiceNo}
              onChange={(e) => setReturnInvoiceNo(e.target.value)}
              placeholder="Return Invoice No. (Optional)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Date:*</label>
            <div className="relative">
              <input
                type="text"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Products Table matching Screenshot 2 */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3.5 w-12">#</th>
                <th className="py-3 px-3.5">Product Name</th>
                <th className="py-3 px-3.5 text-right">Unit Price</th>
                <th className="py-3 px-3.5 text-center">Sell Quantity</th>
                <th className="py-3 px-3.5 text-center w-40">Return Quantity</th>
                <th className="py-3 px-3.5 text-right">Return Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-[#08051e]/60">
              {products.map((p, idx) => {
                const subtotal = p.returnQuantity * p.unitPrice;
                return (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-3.5 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3.5 font-semibold text-white">{p.name}</td>
                    <td className="py-3 px-3.5 text-right text-slate-200">
                      ৳ {p.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3.5 text-center text-slate-300">
                      {p.sellQuantity.toFixed(2)} Pc(s)
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <input
                        type="number"
                        min={0}
                        max={p.sellQuantity}
                        step="any"
                        value={p.returnQuantity === 0 ? '' : p.returnQuantity}
                        placeholder="0.00"
                        onChange={(e) => handleReturnQuantityChange(p.id, parseFloat(e.target.value) || 0)}
                        className="w-28 text-center py-1.5 px-2 rounded-lg bg-[#0c0827] border border-white/15 text-white font-bold focus:outline-none focus:border-violet-500"
                      />
                    </td>
                    <td className="py-3 px-3.5 text-right font-bold text-cyan-300">
                      ৳ {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Discount & Totals Grid matching Screenshot 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-2">
          
          {/* Discount Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Discount Type:</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="Percentage" className="bg-[#0c0827]">Percentage</option>
                <option value="Fixed" className="bg-[#0c0827]">Fixed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Discount Amount:</label>
              <input
                type="number"
                min={0}
                step="any"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Right Summary Table matching Screenshot 2 */}
          <div className="flex flex-col items-end space-y-2 text-xs">
            <div className="flex justify-between w-64 text-slate-400">
              <span>Total Return Discount:</span>
              <span className="font-semibold text-slate-300">(-) ৳ {calculatedDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-64 text-slate-400">
              <span>Total Return Tax - :</span>
              <span className="font-semibold text-slate-300">(+) ৳ 0.00</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t border-white/10 text-sm font-extrabold text-white">
              <span>Return Total:</span>
              <span className="text-cyan-300">৳ {returnTotal.toFixed(2)}</span>
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/25 transition-all active:scale-95 cursor-pointer"
              >
                <Save size={14} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

      </form>

      {/* Footer Subtext */}
      <div className="text-center pt-3 text-[10px] text-slate-500">
        DATABYTE - V6.5 | Copyright © 2026 All rights reserved.
      </div>

    </div>
  );
}

export default function SellReturnPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading Sell Return...</div>}>
      <SellReturnContent />
    </Suspense>
  );
}
