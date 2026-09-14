"use client";

import React, { useEffect, useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { SaleRecord } from './DeleteSaleModal';

interface InvoiceUrlModalProps {
  isOpen: boolean;
  sale: SaleRecord | null;
  onClose: () => void;
  onView?: (sale: SaleRecord) => void;
}

export default function InvoiceUrlModal({
  isOpen,
  sale,
  onClose,
  onView,
}: InvoiceUrlModalProps) {
  const [copied, setCopied] = useState(false);

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

  // Generate unique URL matching screenshot structure
  const invoiceHash = '5322b402a313d376cfa381ff19b43b77';
  const url = `https://rbp.corebitsoft.com/invoice/${invoiceHash}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleView = () => {
    if (onView) {
      onView(sale);
      onClose();
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col text-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header matching Screenshot 3 */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/80">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Invoice URL - Invoice No.: <span className="font-mono text-cyan-300">{sale.invoiceNo}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-3 text-xs">
          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={url}
              className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-[#08051e] border border-white/15 text-slate-200 text-xs font-mono select-all focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-300" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Link to view the invoice without login.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0c0827]/90 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-white/10 active:scale-95 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleView}
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>View</span>
          </button>
        </div>

      </div>
    </div>
  );
}
