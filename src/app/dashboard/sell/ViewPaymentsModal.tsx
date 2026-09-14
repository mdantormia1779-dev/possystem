"use client";

import React, { useEffect, useState } from 'react';
import { X, Mail, Printer, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { SaleRecord } from './DeleteSaleModal';
import EditPaymentModal from './EditPaymentModal';

interface ViewPaymentsModalProps {
  isOpen: boolean;
  sale: SaleRecord | null;
  onClose: () => void;
  onNotify?: (msg: string) => void;
}

export default function ViewPaymentsModal({
  isOpen,
  sale,
  onClose,
  onNotify,
}: ViewPaymentsModalProps) {
  const [payments, setPayments] = useState<any[]>([]);
  const [editingPayment, setEditingPayment] = useState<any | null>(null);

  useEffect(() => {
    if (sale) {
      setPayments([
        {
          id: 'pay-1',
          date: sale.date,
          referenceNo: `SP2026/${sale.invoiceNo}`,
          amount: sale.totalPaid,
          paymentMethod: sale.paymentMethod,
          paymentNote: '--',
          paymentAccount: sale.paymentMethod,
        }
      ]);
    }
  }, [sale]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !sale) return null;

  const handleSendNotification = () => {
    if (onNotify) {
      onNotify(`Payment received notification sent for Invoice #${sale.invoiceNo}`);
    }
  };

  const handleDeletePayment = (payId: string) => {
    if (confirm('Are you sure you want to delete this payment record?')) {
      setPayments((prev) => prev.filter((p) => p.id !== payId));
      if (onNotify) {
        onNotify('Payment record removed successfully');
      }
    }
  };

  const handleUpdatePayment = (updated: any) => {
    setPayments((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (onNotify) {
      onNotify(`Payment ${updated.referenceNo} updated successfully!`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col text-slate-200 max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/80">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            View Payments <span className="text-slate-400 font-normal text-sm sm:text-base">( Invoice No.: <span className="font-semibold text-white">{sale.invoiceNo}</span> )</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs custom-scrollbar">
          
          {/* Top 3-column Info Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-2xl bg-[#08051e]/80 border border-white/10 leading-relaxed">
            <div>
              <p className="text-slate-400 text-[11px]">Customer:</p>
              <p className="font-bold text-white text-sm mt-0.5">{sale.customerName}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">{sale.customerName}</p>
            </div>

            <div>
              <p className="text-slate-400 text-[11px]">Business:</p>
              <p className="font-bold text-white text-sm mt-0.5">{sale.location || 'RANGPUR BIKE PARLOUR'}</p>
              <p className="text-slate-300 text-[11px] mt-0.5">RANGPUR BIKE PARLOUR</p>
              <p className="text-slate-400 text-[11px]">RANGPUR, RANGPUR, Bangladesh</p>
              <p className="text-slate-400 text-[11px]">Mobile: 01957387109</p>
            </div>

            <div>
              <p><span className="font-bold text-white">Invoice No.:</span> #{sale.invoiceNo}</p>
              <p className="mt-1"><span className="font-bold text-white">Date:</span> {sale.date}</p>
              <p className="mt-1">
                <span className="font-bold text-white">Payment Status:</span>{' '}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {sale.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Send Payment Received Notification Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSendNotification}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Mail size={14} />
              <span>Send Payment Received Notification</span>
            </button>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0827] text-slate-300 font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5">Reference No</th>
                  <th className="py-3 px-3.5 text-right">Amount</th>
                  <th className="py-3 px-3.5">Payment Method</th>
                  <th className="py-3 px-3.5">Payment Note</th>
                  <th className="py-3 px-3.5">Payment Account</th>
                  <th className="py-3 px-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#08051e]/60">
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.03]">
                      <td className="py-3 px-3.5 text-slate-300">{p.date}</td>
                      <td className="py-3 px-3.5 font-mono text-cyan-300">{p.referenceNo}</td>
                      <td className="py-3 px-3.5 text-right font-bold text-emerald-300">
                        ৳ {Number(p.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3.5 text-slate-200">{p.paymentMethod}</td>
                      <td className="py-3 px-3.5 text-slate-400">{p.paymentNote}</td>
                      <td className="py-3 px-3.5 text-slate-300">{p.paymentAccount}</td>
                      <td className="py-3 px-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            title="Edit Payment"
                            onClick={() => setEditingPayment(p)}
                            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors cursor-pointer"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            title="Delete Payment"
                            onClick={() => handleDeletePayment(p.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">
                      No payments found for this invoice.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0c0827]/90 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print</span>
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

      {/* Edit Payment Sub-Modal */}
      <EditPaymentModal
        isOpen={!!editingPayment}
        payment={editingPayment}
        onClose={() => setEditingPayment(null)}
        onUpdate={handleUpdatePayment}
      />
    </div>
  );
}
