"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle } from 'lucide-react';
import { PaymentItem } from './ViewPaymentModal';

interface DeletePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentItem | null;
  onConfirmDelete: (paymentId: string) => void;
}

export default function DeletePaymentModal({
  isOpen,
  onClose,
  payment,
  onConfirmDelete,
}: DeletePaymentModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !payment) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#120e34] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-4 my-auto font-sans">
        {/* Warning Icon matching media_1789376469030.png */}
        <div className="w-20 h-20 mx-auto rounded-full border-2 border-amber-400/70 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          <span className="text-4xl font-light">!</span>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Are you sure ?
          </h3>
          <p className="text-xs text-slate-400">
            This payment will be deleted.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDelete(payment.id);
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
