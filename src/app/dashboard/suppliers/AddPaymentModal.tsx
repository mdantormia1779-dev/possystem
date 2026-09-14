"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Banknote, 
  Calendar, 
  CreditCard, 
  FileUp, 
  FileText 
} from 'lucide-react';
import { SupplierFormData } from './AddSupplierModal';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SupplierFormData | null;
  onSavePayment: (paymentData: {
    supplierId: string;
    method: string;
    paidOn: string;
    amount: number;
    account: string;
    note: string;
    fileName?: string;
  }) => void;
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  supplier,
  onSavePayment,
}: AddPaymentModalProps) {
  const [mounted, setMounted] = useState(false);
  const [method, setMethod] = useState('Cash');
  const [paidOn, setPaidOn] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [account, setAccount] = useState('None');
  const [note, setNote] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setPaidOn(`${day}/${month}/${year} ${hours}:${minutes}`);
    if (supplier) {
      setAmount(supplier.totalPurchaseDue ? supplier.totalPurchaseDue.toFixed(2) : '0.00');
    }
  }, [supplier, isOpen]);

  if (!isOpen || !mounted || !supplier) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    onSavePayment({
      supplierId: supplier.id || '',
      method,
      paidOn,
      amount: numAmount,
      account,
      note,
      fileName,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-xs pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 shrink-0 bg-[#0c0827]/70 backdrop-blur-sm">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Add payment
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/15">
          {/* Top Summary Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Card: Supplier details */}
            <div className="bg-[#0a0620]/80 border border-white/10 rounded-2xl p-4 text-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">Supplier:</span>
                <span className="text-white font-semibold">{supplier.name || supplier.contactId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">Business:</span>
                <span className="text-slate-300">{supplier.businessName || '—'}</span>
              </div>
            </div>

            {/* Right Card: Balance summary */}
            <div className="bg-[#0a0620]/80 border border-white/10 rounded-2xl p-4 text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Purchase:</span>
                <span className="text-white font-medium">৳ 120.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Paid:</span>
                <span className="text-white font-medium">৳ 120.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Purchase Due:</span>
                <span className="text-rose-400 font-bold">৳ {(supplier.totalPurchaseDue || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Opening Balance:</span>
                <span className="text-white font-medium">৳ {(supplier.openingBalance || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Opening Balance Due:</span>
                <span className="text-amber-400 font-bold">৳ 0.00</span>
              </div>
            </div>
          </div>

          {/* Payment Method, Paid on, Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Paid on */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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

          {/* Attach Document & Payment Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Attach Document */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Attach Document:
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-slate-200 cursor-pointer transition-all active:scale-95">
                  <FileUp size={14} className="text-violet-400" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.csv,.zip,.doc,.docx,.jpeg,.jpg,.png"
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400 truncate max-w-[180px]">
                  {fileName || 'No file chosen'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Allowed File: .pdf, .csv, .zip, .doc, .docx, .jpeg, .jpg, .png
              </p>
            </div>

            {/* Payment Account */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                  <option value="None">None</option>
                  <option value="Cash In Hand">Cash In Hand</option>
                  <option value="Main Bank Account">Main Bank Account</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payment Note:
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add payment note..."
              className="w-full bg-[#0a0620] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Save
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
