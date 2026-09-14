"use client";

import React, { useState, useEffect } from 'react';
import { X, DollarSign, CreditCard, Banknote, CheckCircle2, Plus } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  totalPayable: number;
  totalItems: number;
  onClose: () => void;
  onFinalize: (paymentDetails: any) => void;
}

export default function PaymentModal({
  isOpen,
  totalPayable,
  totalItems,
  onClose,
  onFinalize,
}: PaymentModalProps) {
  const [amount, setAmount] = useState<number>(totalPayable);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentAccount, setPaymentAccount] = useState('Cash (Balance: -33,160.00)');
  const [paymentNote, setPaymentNote] = useState('');
  const [sellNote, setSellNote] = useState('');
  const [staffNote, setStaffNote] = useState('');

  useEffect(() => {
    setAmount(totalPayable);
  }, [totalPayable]);

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

  const totalPaying = Number(amount) || 0;
  const changeReturn = Math.max(0, totalPaying - totalPayable);
  const balance = Math.max(0, totalPayable - totalPaying);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinalize({
      amount: totalPaying,
      paymentMethod,
      paymentAccount,
      paymentNote,
      sellNote,
      staffNote,
      totalPayable,
      changeReturn,
      balance,
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card matching Screenshot 2 */}
      <div className="relative w-full max-w-4xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden z-10 flex flex-col text-slate-200 max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/90">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Payment
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-5 text-xs custom-scrollbar">
            
            <p className="font-bold text-slate-300">
              Advance Balance: <span className="text-emerald-400">৳ 0.00</span>
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (8 cols): Inputs */}
              <div className="lg:col-span-8 p-5 rounded-2xl bg-[#08051e]/80 border border-white/10 space-y-4">
                
                {/* Amount & Method */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Amount:*</label>
                    <div className="relative">
                      <Banknote size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        step="any"
                        required
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0c0827] border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Payment Method:*</label>
                    <div className="relative">
                      <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0c0827] border border-white/10 text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                      >
                        <option value="Cash" className="bg-[#0c0827]">Cash</option>
                        <option value="Card" className="bg-[#0c0827]">Card</option>
                        <option value="Bank Transfer" className="bg-[#0c0827]">Bank Transfer</option>
                        <option value="Bkash / Nagad" className="bg-[#0c0827]">Bkash / Nagad</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Account */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Payment Account:</label>
                  <div className="relative">
                    <Banknote size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={paymentAccount}
                      onChange={(e) => setPaymentAccount(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0c0827] border border-white/10 text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      <option value="Cash (Balance: -33,160.00)" className="bg-[#0c0827]">Cash (Balance: -33,160.00)</option>
                      <option value="Main Bank Account" className="bg-[#0c0827]">Main Bank Account</option>
                    </select>
                  </div>
                </div>

                {/* Payment Note */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Payment note:</label>
                  <textarea
                    rows={2}
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Payment note"
                    className="w-full p-2.5 rounded-xl bg-[#0c0827] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                {/* Add Payment Row Button matching Screenshot 2 */}
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  Add Payment Row
                </button>

                {/* Sell note & Staff note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Sell note:</label>
                    <textarea
                      rows={2}
                      value={sellNote}
                      onChange={(e) => setSellNote(e.target.value)}
                      placeholder="Sell note"
                      className="w-full p-2.5 rounded-xl bg-[#0c0827] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Staff note:</label>
                    <textarea
                      rows={2}
                      value={staffNote}
                      onChange={(e) => setStaffNote(e.target.value)}
                      placeholder="Staff note"
                      className="w-full p-2.5 rounded-xl bg-[#0c0827] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column (4 cols): Orange Summary Card matching Screenshot 2 */}
              <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 p-5 text-white shadow-2xl space-y-4 font-sans">
                
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Items:</span>
                  <p className="text-xl font-black mt-0.5">{totalItems.toFixed(2)}</p>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Payable:</span>
                  <p className="text-xl font-black mt-0.5">৳ {totalPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Paying:</span>
                  <p className="text-xl font-black mt-0.5">৳ {totalPaying.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Change Return:</span>
                  <p className="text-xl font-black mt-0.5">৳ {changeReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Balance:</span>
                  <p className="text-xl font-black mt-0.5">৳ {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

              </div>

            </div>

          </div>

          {/* Footer Actions matching Screenshot 2 */}
          <div className="px-6 py-4 bg-[#0c0827]/90 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-white/10 active:scale-95 cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/25 transition-all active:scale-95 cursor-pointer"
            >
              Finalize Payment
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
