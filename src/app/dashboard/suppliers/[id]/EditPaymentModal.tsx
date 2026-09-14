"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Banknote, Calendar, CreditCard, FileUp, FileText } from 'lucide-react';
import { PaymentItem } from './ViewPaymentModal';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentItem | null;
  onUpdatePayment: (updated: PaymentItem) => void;
}

export default function EditPaymentModal({
  isOpen,
  onClose,
  payment,
  onUpdatePayment,
}: EditPaymentModalProps) {
  const [mounted, setMounted] = useState(false);
  const [method, setMethod] = useState('Cash');
  const [paidOn, setPaidOn] = useState('');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('Cash (Balance: -37,960.00)');
  const [note, setNote] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (payment) {
      setMethod(payment.method || 'Cash');
      setPaidOn(payment.paidOn || '');
      setAmount(payment.amount || '0.00');
      setNote(payment.note || '');
    }
  }, [payment, isOpen]);

  if (!isOpen || !mounted || !payment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePayment({
      ...payment,
      method,
      paidOn,
      amount,
      note,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-xs pointer-events-none" />

        {/* Modal Header matching media_1789376449492.png */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 shrink-0 bg-[#0c0827]/70 backdrop-blur-sm">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Edit payment
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-5 scrollbar-thin scrollbar-thumb-white/15 text-xs">
          {/* Top 3 Summary Cards matching media_1789376449492.png */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card 1 */}
            <div className="bg-[#0a0620]/80 border border-white/10 rounded-2xl p-3.5 space-y-1">
              <p className="text-slate-400 font-semibold">Supplier:</p>
              <p className="font-bold text-white">{payment.supplierName || 'SHAMIM'}</p>
              <p className="text-slate-400 font-semibold pt-1">Business:</p>
              <p className="text-slate-300">{payment.businessName || '—'}</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0a0620]/80 border border-white/10 rounded-2xl p-3.5 space-y-1">
              <p className="text-slate-400 font-semibold">Reference No:</p>
              <p className="font-mono text-cyan-300 font-bold">PO2026/0003</p>
              <p className="text-slate-400 font-semibold pt-1">Location:</p>
              <p className="text-slate-300">RANGPUR BIKE PARLOUR</p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0a0620]/80 border border-white/10 rounded-2xl p-3.5 space-y-1">
              <p className="text-slate-400 font-semibold">Total amount:</p>
              <p className="font-bold text-emerald-400 text-sm">{payment.amount}</p>
              <p className="text-slate-400 font-semibold pt-1">Payment Note:</p>
              <p className="text-slate-300">{payment.note || '--'}</p>
            </div>
          </div>

          {/* Form Controls Row 1: Payment Method, Paid on, Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Payment Method:<span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <Banknote size={15} />
                </span>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/70 cursor-pointer shadow-inner"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Paid on:<span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <Calendar size={15} />
                </span>
                <input
                  type="text"
                  required
                  value={paidOn}
                  onChange={(e) => setPaidOn(e.target.value)}
                  placeholder="DD/MM/YYYY HH:mm"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Amount:<span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <Banknote size={15} />
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Form Controls Row 2: Attach Document & Payment Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Attach Document:
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-slate-200 cursor-pointer transition-all active:scale-95">
                  <FileUp size={14} className="text-violet-400" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    onChange={(e) => e.target.files && setFileName(e.target.files[0].name)}
                    accept=".pdf,.csv,.zip,.doc,.docx,.jpeg,.jpg,.png"
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400 truncate max-w-[180px]">
                  {fileName || 'No file chosen'}
                </span>
              </div>
              <p className="text-[10px] text-amber-300/80 mt-1">
                Previously uploaded file will be replaced
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Allowed File: .pdf, .csv, .zip, .doc, .docx, .jpeg, .jpg, .png
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Payment Account:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <CreditCard size={15} />
                </span>
                <select
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/70 cursor-pointer shadow-inner"
                >
                  <option value="Cash (Balance: -37,960.00)">Cash (Balance: -37,960.00)</option>
                  <option value="Main Cash Account">Main Cash Account</option>
                  <option value="Bank Account">Bank Account</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Note */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Payment Note:
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Payment note..."
              className="w-full bg-[#0a0620] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500/70 shadow-inner"
            />
          </div>

          {/* Modal Footer matching media_1789376449492.png */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#1e1b4b] hover:bg-[#25215c] text-slate-300 hover:text-white border border-white/15 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
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
