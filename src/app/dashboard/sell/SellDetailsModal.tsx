"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import { SaleRecord } from './DeleteSaleModal';

interface SellDetailsModalProps {
  isOpen: boolean;
  sale: SaleRecord | null;
  onClose: () => void;
  onOpenPackingSlip?: (sale: SaleRecord) => void;
}

export default function SellDetailsModal({
  isOpen,
  sale,
  onClose,
  onOpenPackingSlip,
}: SellDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || !sale) return null;

  const items = sale.items && sale.items.length > 0
    ? sale.items
    : [
        {
          name: 'MOBILE STAND 0002 , MOTO WOLF',
          quantity: sale.totalItems || 1,
          unitPrice: sale.totalAmount / (sale.totalItems || 1),
          discount: 0,
          tax: 0,
          subtotal: sale.totalAmount,
        }
      ];

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col text-slate-200 max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/80">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Sell Details <span className="text-slate-400 font-normal text-sm sm:text-base">( Invoice No. : <span className="font-semibold text-white">{sale.invoiceNo}</span> )</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs custom-scrollbar">
          
          {/* Top Meta Info (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-2xl bg-[#08051e]/80 border border-white/10 leading-relaxed">
            <div>
              <p><span className="font-bold text-white">Invoice No. :</span> #{sale.invoiceNo}</p>
              <p className="mt-1">
                <span className="font-bold text-white">Status:</span>{' '}
                <span className="text-emerald-400 font-semibold">Final</span>
              </p>
              <p className="mt-1">
                <span className="font-bold text-white">Payment Status:</span>{' '}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {sale.paymentStatus}
                </span>
              </p>
            </div>

            <div>
              <p><span className="font-bold text-white">Customer name:</span> {sale.customerName}</p>
              <p className="mt-1"><span className="font-bold text-white">Address:</span> {sale.customerName}</p>
            </div>

            <div className="md:text-right">
              <p><span className="font-bold text-white">Shipping:</span> {sale.shippingDetails || '--'}</p>
              <p className="mt-1"><span className="font-bold text-white">Date:</span> {sale.date}</p>
            </div>
          </div>

          {/* Products Table */}
          <div>
            <h3 className="font-bold text-white mb-2 text-sm">Products:</h3>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-10">#</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3 text-center">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Discount</th>
                    <th className="py-2.5 px-3 text-right">Tax</th>
                    <th className="py-2.5 px-3 text-right">Price inc. tax</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-[#08051e]/60">
                  {items.map((it: any, idx: number) => {
                    const qty = Number(it.quantity || 1);
                    const price = Number(it.unitPrice || 0);
                    const sub = Number(it.subtotal || qty * price);
                    return (
                      <tr key={idx} className="hover:bg-white/[0.03]">
                        <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-3 font-semibold text-white">{it.name}</td>
                        <td className="py-3 px-3 text-center text-slate-200">{qty.toFixed(2)} Pc(s)</td>
                        <td className="py-3 px-3 text-right text-slate-200">৳ {price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right text-slate-400">৳ 0.00</td>
                        <td className="py-3 px-3 text-right text-slate-400">৳ 0.00</td>
                        <td className="py-3 px-3 text-right text-slate-200">৳ {price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right font-bold text-cyan-300">৳ {sub.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Info & Totals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: Payment Info */}
            <div>
              <h3 className="font-bold text-white mb-2 text-sm">Payment Info:</h3>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-600 text-white font-bold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 w-10">#</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Reference No</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3">Payment mode</th>
                      <th className="py-2.5 px-3">Payment note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-[#08051e]/60">
                    <tr className="hover:bg-white/[0.03]">
                      <td className="py-3 px-3 text-slate-400">1</td>
                      <td className="py-3 px-3 text-slate-300">{sale.date.split(' ')[0]}</td>
                      <td className="py-3 px-3 font-mono text-cyan-300">SP2026/{sale.invoiceNo}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-300">
                        ৳ {sale.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-slate-300">{sale.paymentMethod}</td>
                      <td className="py-3 px-3 text-slate-400">--</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Totals Breakdown */}
            <div className="bg-[#08051e]/80 border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10 text-xs">
              <div className="flex justify-between py-2.5 px-4 font-semibold">
                <span className="text-slate-300">Total:</span>
                <span className="text-white font-bold">৳ {sale.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2.5 px-4 text-slate-400">
                <span className="flex items-center gap-2">Discount: <span className="text-[10px] text-slate-500">(-)</span></span>
                <span>0.00 %</span>
              </div>
              <div className="flex justify-between py-2.5 px-4 text-slate-400">
                <span className="flex items-center gap-2">Order Tax: <span className="text-[10px] text-slate-500">(+)</span></span>
                <span>0.00</span>
              </div>
              <div className="flex justify-between py-2.5 px-4 text-slate-400">
                <span className="flex items-center gap-2">Shipping: <span className="text-[10px] text-slate-500">(+)</span></span>
                <span>৳ 0.00</span>
              </div>
              <div className="flex justify-between py-2.5 px-4 text-slate-400">
                <span>Round Off:</span>
                <span>৳ 0.00</span>
              </div>
              <div className="flex justify-between py-2.5 px-4 font-bold text-slate-200 bg-white/[0.02]">
                <span>Total Payable:</span>
                <span className="text-white">৳ {sale.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2.5 px-4 font-bold text-emerald-400 bg-emerald-500/[0.04]">
                <span>Total paid:</span>
                <span>৳ {sale.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2.5 px-4 font-bold text-rose-400 bg-rose-500/[0.04]">
                <span>Total remaining:</span>
                <span>৳ {sale.sellDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-white mb-1.5">Sell note:</p>
              <div className="p-3 bg-[#08051e]/80 border border-white/10 rounded-xl text-slate-400">
                {sale.sellNote || '--'}
              </div>
            </div>
            <div>
              <p className="font-bold text-white mb-1.5">Staff note:</p>
              <div className="p-3 bg-[#08051e]/80 border border-white/10 rounded-xl text-slate-400">
                {sale.staffNote || '--'}
              </div>
            </div>
          </div>

          {/* Activities Table */}
          <div>
            <h3 className="font-bold text-white mb-2 text-sm">Activities:</h3>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c0827] text-slate-300 font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">By</th>
                    <th className="py-2.5 px-3">Note</th>
                  </tr>
                </thead>
                <tbody className="bg-[#08051e]/60 divide-y divide-white/10">
                  <tr>
                    <td className="py-3 px-3 text-slate-300">{sale.date}</td>
                    <td className="py-3 px-3 text-slate-300">Added</td>
                    <td className="py-3 px-3 font-semibold text-white">{sale.addedBy}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span>Status: <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">Final</span></span>
                        <span>Total: <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">৳ {sale.totalAmount.toFixed(2)}</span></span>
                        <span>Payment Status: <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">{sale.paymentStatus}</span></span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0c0827]/90 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenPackingSlip && onOpenPackingSlip(sale)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
          >
            <FileText size={14} />
            <span>Packing Slip</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-lg shadow-violet-600/20 active:scale-95 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Invoice</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-white/10 active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
