"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Landmark, DollarSign, CreditCard, Banknote, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RegisterDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseRegister: () => void;
}

export default function RegisterDetailsModal({
  isOpen,
  onClose,
  onCloseRegister,
}: RegisterDetailsModalProps) {
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

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-[#120e34] border border-white/15 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col text-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Landmark size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Register Details</h2>
              <p className="text-[11px] text-slate-400">Open Time: 09/14/2026 09:30 AM</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0a0620] border border-white/10">
              <span className="text-[11px] text-slate-400 block font-medium">Cash in Hand (Opening)</span>
              <span className="text-base font-bold text-white">৳ 5,000.00</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0a0620] border border-white/10">
              <span className="text-[11px] text-slate-400 block font-medium">Cash Payment</span>
              <span className="text-base font-bold text-emerald-400">৳ 29,960.00</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0a0620] border border-white/10">
              <span className="text-[11px] text-slate-400 block font-medium">Card Payment</span>
              <span className="text-base font-bold text-cyan-400">৳ 12,400.00</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0a0620] border border-white/10">
              <span className="text-[11px] text-slate-400 block font-medium">bKash / Mobile</span>
              <span className="text-base font-bold text-pink-400">৳ 8,500.00</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Sales</span>
              <span className="text-xl font-extrabold text-white">৳ 50,860.00</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium block">Total Expenses</span>
              <span className="text-base font-bold text-rose-400">৳ 1,200.00</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
            <Clock size={16} className="shrink-0 mt-0.5" />
            <span>Register is active and running for counter 1 (Admin User).</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            Keep Open
          </button>
          <button
            type="button"
            onClick={() => {
              onCloseRegister();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500/40 text-xs font-bold text-rose-300 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ShieldAlert size={14} />
            <span>Close Register</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
