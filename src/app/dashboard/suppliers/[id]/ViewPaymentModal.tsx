"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, User, Building, Phone, Calendar, Banknote, Hash, FileText } from 'lucide-react';

export interface PaymentItem {
  id: string;
  paidOn: string;
  refNo: string;
  amount: string;
  method: string;
  paymentFor: string;
  note?: string;
  supplierName?: string;
  supplierMobile?: string;
  businessName?: string;
  businessAddress?: string;
  businessMobile?: string;
}

interface ViewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentItem | null;
}

export default function ViewPaymentModal({
  isOpen,
  onClose,
  payment,
}: ViewPaymentModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !payment) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=750,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt - ${payment.refNo}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #1e293b; }
            .header { border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; color: #312e81; }
            .grid { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13px; line-height: 1.6; }
            .box { flex: 1; }
            .amount-box { background: #f1f5f9; border-radius: 8px; padding: 15px; margin-top: 15px; font-size: 14px; }
            .btn { display: none; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Payment Receipt (Ref: ${payment.refNo})</div>
          </div>
          <div class="grid">
            <div class="box">
              <strong>Supplier:</strong> ${payment.supplierName || 'SHAMIM'}<br>
              <strong>Mobile:</strong> ${payment.supplierMobile || '017953859'}
            </div>
            <div class="box" style="text-align: right;">
              <strong>Business:</strong> ${payment.businessName || 'RANGPUR BIKE PARLOUR'}<br>
              ${payment.businessAddress || 'RANGPUR, RANGPUR, Bangladesh'}<br>
              <strong>Mobile:</strong> ${payment.businessMobile || '01957387109'}
            </div>
          </div>
          <div class="amount-box">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span><strong>Amount:</strong> ৳ ${payment.amount}</span>
              <span><strong>Reference No:</strong> ${payment.refNo}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span><strong>Payment Method:</strong> ${payment.method}</span>
              <span><strong>Paid on:</strong> ${payment.paidOn}</span>
            </div>
            ${payment.note ? `<div style="margin-top: 8px;"><strong>Payment Note:</strong> ${payment.note}</div>` : ''}
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto flex flex-col font-sans">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-xs pointer-events-none" />

        {/* Modal Header matching media_1789376438887.png */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 shrink-0 bg-[#0c0827]/70">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            View Payment ( Reference No: {payment.refNo} )
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 text-xs">
          {/* Top Section: Supplier vs Business */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-5 border-b border-white/10">
            {/* Left: Supplier info */}
            <div className="space-y-1.5">
              <p className="text-slate-400 font-semibold">Supplier:</p>
              <p className="text-sm font-bold text-white">{payment.supplierName || 'SHAMIM'}</p>
              <p className="text-slate-300 pt-1">
                <span className="text-slate-400 font-medium">Mobile:</span> {payment.supplierMobile || '017953859'}
              </p>
            </div>

            {/* Right: Business info */}
            <div className="space-y-1.5 sm:text-right">
              <p className="text-slate-400 font-semibold">Business:</p>
              <p className="font-bold text-white text-xs leading-relaxed">
                {payment.businessName || 'RANGPUR BIKE PARLOUR'}
              </p>
              <p className="text-slate-400 text-[11px]">
                {payment.businessAddress || 'RANGPUR, RANGPUR, Bangladesh'}
              </p>
              <p className="text-slate-300 text-[11px]">
                <span className="text-slate-400 font-medium">Mobile:</span> {payment.businessMobile || '01957387109'}
              </p>
            </div>
          </div>

          {/* Bottom Section: Amount, Method, Ref, Paid on */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Left Column */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs sm:text-sm">Amount :</span>
                <span className="text-sm font-extrabold text-emerald-400">৳ {payment.amount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Payment Method :</span>
                <span className="text-slate-300 font-medium">{payment.method}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-white">Payment Note :</span>
                <span className="text-slate-300">{payment.note || '—'}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2 sm:text-right">
              <div>
                <span className="font-bold text-white">Reference No:</span>{' '}
                <span className="font-mono text-cyan-300">{payment.refNo}</span>
              </div>
              <div>
                <span className="font-bold text-white">Paid on:</span>{' '}
                <span className="text-slate-300">{payment.paidOn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer matching media_1789376438887.png */}
        <div className="px-5 sm:px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0 bg-[#0c0827]/40">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Printer size={15} />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1e1b4b] hover:bg-[#25215c] text-slate-300 hover:text-white border border-white/15 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
