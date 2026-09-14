"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Percent, DollarSign, FileText } from 'lucide-react';

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDiscount: (discount: {
    type: 'percentage' | 'fixed';
    amount: number;
    note: string;
  }) => void;
}

export default function AddDiscountModal({
  isOpen,
  onClose,
  onSaveDiscount,
}: AddDiscountModalProps) {
  const [mounted, setMounted] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDiscount({
      type: discountType,
      amount: parseFloat(amount) || 0,
      note,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0 bg-[#0c0827]/70">
          <h2 className="text-base font-bold text-white tracking-wide">
            Add Discount
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Discount Type:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  discountType === 'percentage'
                    ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Percent size={14} />
                <span>Percentage (%)</span>
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  discountType === 'fixed'
                    ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign size={14} />
                <span>Fixed (৳)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Discount Amount:*
            </label>
            <input
              type="number"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0a0620] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-violet-500/70"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Note:
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Discount reason or note..."
              className="w-full bg-[#0a0620] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500/70"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-md cursor-pointer active:scale-95"
            >
              Apply Discount
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
