"use client";

import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X, Calendar, DollarSign, User } from 'lucide-react';

export interface SaleRecord {
  id: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  contactNumber: string;
  location: string;
  paymentStatus: 'Paid' | 'Partial' | 'Due';
  paymentMethod: string;
  totalAmount: number;
  totalPaid: number;
  sellDue: number;
  sellReturnDue: number;
  shippingStatus: string;
  totalItems: number;
  addedBy: string;
  sellNote?: string;
  staffNote?: string;
  shippingDetails?: string;
  items?: any[];
}

interface DeleteSaleModalProps {
  isOpen: boolean;
  sale: SaleRecord | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export default function DeleteSaleModal({
  isOpen,
  sale,
  onClose,
  onConfirm,
}: DeleteSaleModalProps) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#120e34] border border-white/15 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-10 flex flex-col text-slate-200 p-6 sm:p-7 animate-in zoom-in-95 duration-200">
        {/* Glow behind warning */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-rose-500/15 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="relative w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)] mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-white tracking-wide">
            Delete Sale Record
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Are you sure you want to delete invoice <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">#{sale.invoiceNo}</span>?
          </p>

          {/* Sale details card */}
          <div className="mt-4 p-3.5 bg-[#08051e]/80 border border-white/10 rounded-2xl text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <User size={13} className="text-violet-400" /> Customer:
              </span>
              <span className="font-semibold text-white">{sale.customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar size={13} className="text-cyan-400" /> Date:
              </span>
              <span className="font-medium text-slate-300">{sale.date}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <span className="text-slate-400 flex items-center gap-1.5">
                <DollarSign size={13} className="text-emerald-400" /> Total Amount:
              </span>
              <span className="font-extrabold text-emerald-300">৳ {sale.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <p className="text-[11px] text-rose-400/90 mt-3.5 leading-normal">
            This action is irreversible. All linked payment logs and item stock transactions for this invoice will be adjusted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all border border-white/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(sale.id);
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all active:scale-95 cursor-pointer border border-rose-400/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
