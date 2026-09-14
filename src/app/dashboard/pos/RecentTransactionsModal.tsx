"use client";

import React, { useState, useEffect } from 'react';
import { X, Check, Edit2, Printer, Trash2, FileText, Clock } from 'lucide-react';

interface RecentTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (invoiceNo: string) => void;
  onPrint: (invoiceNo: string) => void;
  onDelete: (invoiceNo: string) => void;
}

export default function RecentTransactionsModal({
  isOpen,
  onClose,
  onEdit,
  onPrint,
  onDelete,
}: RecentTransactionsModalProps) {
  const [activeTab, setActiveTab] = useState<'Final' | 'Quotation' | 'Draft'>('Final');
  const [transactions, setTransactions] = useState([
    { id: '1', invoiceNo: '0003', customer: 'Walk-In Customer', amount: 4800 },
    { id: '2', invoiceNo: '0002', customer: 'Walk-In Customer', amount: 25000 },
    { id: '3', invoiceNo: '0001', customer: 'Walk-In Customer', amount: 160 },
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pos_sales');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(
            parsed.map((s: any, idx: number) => ({
              id: s.id || String(idx + 1),
              invoiceNo: s.invoiceNo,
              customer: s.customerName || 'Walk-In Customer',
              amount: s.totalAmount || 0,
            }))
          );
        }
      }
    } catch {
      // Ignored
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container matching Screenshot 3 */}
      <div className="relative w-full max-w-2xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden z-10 flex flex-col text-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/90">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-violet-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Recent Transactions
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

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Tabs matching Screenshot 3 */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('Final')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'Final'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Check size={14} />
              <span>Final</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Quotation')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'Quotation'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span>&gt;_ Quotation</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Draft')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'Draft'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span>&gt;_ Draft</span>
            </button>
          </div>

          {/* Transactions List */}
          {activeTab === 'Final' ? (
            <div className="space-y-3">
              {transactions.map((tx, idx) => (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#08051e]/80 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">{idx + 1}.</span>
                    <span className="font-bold text-white text-sm">
                      {tx.invoiceNo} <span className="font-normal text-slate-400 text-xs">({tx.customer})</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-extrabold text-sm text-emerald-400">
                      ৳ {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>

                    {/* Action buttons matching Screenshot 3 */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(tx.invoiceNo)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrint(tx.invoiceNo)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        <Printer size={12} />
                        <span>Print</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(tx.invoiceNo)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 italic">
              No {activeTab.toLowerCase()} records found.
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0c0827]/90 border-t border-white/10 flex items-center justify-end">
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
