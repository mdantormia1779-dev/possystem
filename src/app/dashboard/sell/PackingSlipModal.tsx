"use client";

import React, { useEffect } from 'react';
import { X, Printer, PackageCheck } from 'lucide-react';
import { SaleRecord } from './DeleteSaleModal';

interface PackingSlipModalProps {
  isOpen: boolean;
  sale: SaleRecord | null;
  onClose: () => void;
}

export default function PackingSlipModal({
  isOpen,
  sale,
  onClose,
}: PackingSlipModalProps) {
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

  const items = sale.items && sale.items.length > 0
    ? sale.items
    : [
        {
          name: 'MOBILE STAND 0002 , MOTO WOLF',
          quantity: sale.totalItems || 1,
        }
      ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col text-slate-200 max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/80">
          <div className="flex items-center gap-2">
            <PackageCheck size={18} className="text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Packing Slip - <span className="font-mono text-cyan-300">#{sale.invoiceNo}</span>
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

        {/* Printable slip */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs custom-scrollbar">
          <div className="p-6 rounded-2xl bg-[#08051e] border border-white/10 space-y-5">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <h1 className="text-lg font-black text-white tracking-wider">RANGPUR BIKE PARLOUR</h1>
                <p className="text-slate-400 text-[11px] mt-1">RANGPUR, Bangladesh</p>
                <p className="text-slate-400 text-[11px]">Phone: 01957387109</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-xs uppercase tracking-wider mb-2">
                  Packing Slip
                </span>
                <p className="text-slate-300 font-semibold">Invoice: #{sale.invoiceNo}</p>
                <p className="text-slate-400 text-[11px]">Date: {sale.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Ship To:</p>
                <p className="text-white font-bold mt-1">{sale.customerName}</p>
                <p className="text-slate-400 mt-0.5">{sale.shippingDetails || 'Standard Delivery'}</p>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Shipping Details:</p>
                <p className="text-slate-300 mt-1"><span className="text-slate-400">Status:</span> {sale.shippingStatus || 'Ready for Dispatch'}</p>
                <p className="text-slate-300 mt-0.5"><span className="text-slate-400">Total Items:</span> {sale.totalItems}</p>
              </div>
            </div>

            {/* Package Contents Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c0827] text-slate-300 font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3 w-12">#</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center w-24">Quantity</th>
                    <th className="py-2.5 px-3 text-center w-28">Verified [✓]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-[#08051e]/60">
                  {items.map((it: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-white">{it.name}</td>
                      <td className="py-3 px-3 text-center text-slate-200">{Number(it.quantity || 1).toFixed(2)} Pc(s)</td>
                      <td className="py-3 px-3 text-center">
                        <div className="w-5 h-5 border border-white/20 rounded mx-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-end text-slate-400 text-[11px]">
              <div>
                <p>Packed By: <span className="text-white font-medium">{sale.addedBy}</span></p>
                <p className="text-[10px] text-slate-500 mt-1">Please verify contents immediately upon delivery.</p>
              </div>
              <div className="text-right">
                <div className="w-36 border-b border-white/20 mb-1"></div>
                <p className="text-[10px]">Packer Signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0c0827]/90 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Packing Slip</span>
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
    </div>
  );
}
