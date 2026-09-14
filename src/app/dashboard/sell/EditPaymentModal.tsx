"use client";

import React, { useState, useEffect } from 'react';
import { X, DollarSign, CreditCard, CheckCircle2 } from 'lucide-react';

interface EditPaymentModalProps {
  isOpen: boolean;
  payment: any | null;
  onClose: () => void;
  onUpdate: (updatedPayment: any) => void;
}

export default function EditPaymentModal({
  isOpen,
  payment,
  onClose,
  onUpdate,
}: EditPaymentModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentAccount, setPaymentAccount] = useState('Cash');
  const [paymentNote, setPaymentNote] = useState('');

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount || 0);
      setPaymentMethod(payment.paymentMethod || 'Cash');
      setPaymentAccount(payment.paymentAccount || 'Cash');
      setPaymentNote(payment.paymentNote && payment.paymentNote !== '--' ? payment.paymentNote : '');
    }
  }, [payment]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !payment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...payment,
      amount,
      paymentMethod,
      paymentAccount,
      paymentNote: paymentNote || '--',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden z-20 flex flex-col text-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/80">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Edit Payment - <span className="font-mono text-cyan-300">{payment.referenceNo}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Amount:*</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#08051e] border border-white/10 text-white font-bold focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Payment Method:*</label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentAccount(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#08051e] border border-white/10 text-white focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="Cash" className="bg-[#0c0827]">Cash</option>
              <option value="Card" className="bg-[#0c0827]">Card</option>
              <option value="Bank Transfer" className="bg-[#0c0827]">Bank Transfer</option>
              <option value="Bkash / Nagad" className="bg-[#0c0827]">Bkash / Nagad</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Payment Account:</label>
            <input
              type="text"
              value={paymentAccount}
              onChange={(e) => setPaymentAccount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#08051e] border border-white/10 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Payment Note:</label>
            <textarea
              rows={2}
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="Payment note"
              className="w-full px-3 py-2 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/25 transition-all active:scale-95 cursor-pointer"
            >
              Update Payment
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
