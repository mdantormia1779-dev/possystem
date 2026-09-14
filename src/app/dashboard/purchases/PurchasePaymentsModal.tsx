"use client";

import React, { useState } from 'react';
import { X, Plus, DollarSign, Calendar, CreditCard, Building } from 'lucide-react';
import { PurchaseDetailsRecord, PurchasePaymentDetail } from './PurchaseDetailsModal';

interface PurchasePaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: PurchaseDetailsRecord | null;
  onPaymentAdded: (updatedPurchase: PurchaseDetailsRecord) => void;
}

export default function PurchasePaymentsModal({
  isOpen,
  onClose,
  purchase,
  onPaymentAdded
}: PurchasePaymentsModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<string>('Cash');
  const [payNote, setPayNote] = useState<string>('');
  const [payDate, setPayDate] = useState<string>(
    new Date().toLocaleDateString('en-GB')
  );

  if (!isOpen || !purchase) return null;

  const formatMoney = (val: number | undefined) => {
    const num = Number(val || 0);
    return `৳ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const payments: PurchasePaymentDetail[] = (purchase.payments && purchase.payments.length > 0)
    ? purchase.payments
    : (purchase.paidAmount > 0 ? [
        {
          date: purchase.purchaseDate ? purchase.purchaseDate.split(' ')[0] : '16/08/2026',
          referenceNo: purchase.referenceNo.replace('PO', 'PP'),
          amount: purchase.paidAmount,
          paymentMode: purchase.paymentMethod || 'Cash',
          paymentNote: '--'
        }
      ] : []);

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      alert('Please enter a valid payment amount greater than 0.');
      return;
    }

    const newPayment: PurchasePaymentDetail = {
      date: payDate,
      referenceNo: `PP-${Date.now().toString().slice(-6)}`,
      amount: payAmount,
      paymentMode: payMethod,
      paymentNote: payNote || '--'
    };

    const newPaidAmount = purchase.paidAmount + payAmount;
    const newDue = Math.max(0, purchase.grandTotal - newPaidAmount);
    const newStatus = newDue === 0 ? 'Paid' : 'Partial';

    const updatedPurchase: PurchaseDetailsRecord = {
      ...purchase,
      paidAmount: newPaidAmount,
      paymentDue: newDue,
      paymentStatus: newStatus,
      payments: [...payments, newPayment],
      activities: [
        ...(purchase.activities || []),
        {
          date: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          action: 'Payment Added',
          by: 'Admin',
          status: purchase.status,
          total: payAmount,
          paymentStatus: newStatus
        }
      ]
    };

    onPaymentAdded(updatedPurchase);
    setShowAddForm(false);
    setPayAmount(0);
    setPayNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e0a2b] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto flex flex-col font-sans backdrop-blur-2xl">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-xs pointer-events-none" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#120e34]/90">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>View Payments</span>
              <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                #{purchase.referenceNo}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Supplier: <span className="text-slate-200 font-semibold">{purchase.supplierName}</span> | Location: <span className="text-slate-200">{purchase.businessLocation}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#08051e]/80 border border-white/10 rounded-2xl text-center">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Grand Total</span>
              <span className="font-extrabold text-white text-base mt-1 block">{formatMoney(purchase.grandTotal)}</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[11px] font-medium">Total Paid</span>
              <span className="font-extrabold text-emerald-400 text-base mt-1 block">{formatMoney(purchase.paidAmount)}</span>
            </div>
            <div>
              <span className="text-rose-400 block text-[11px] font-medium">Payment Due</span>
              <span className="font-extrabold text-rose-400 text-base mt-1 block">{formatMoney(purchase.paymentDue)}</span>
            </div>
          </div>

          {/* Payments Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white text-xs">Payment History</h4>
              {purchase.paymentDue > 0 && !showAddForm && (
                <button
                  type="button"
                  onClick={() => {
                    setPayAmount(purchase.paymentDue);
                    setShowAddForm(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <Plus size={14} />
                  <span>Add Payment</span>
                </button>
              )}
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white font-bold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-white/10 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 border-r border-white/10">Date</th>
                    <th className="py-2.5 px-3 border-r border-white/10">Reference No</th>
                    <th className="py-2.5 px-3 border-r border-white/10 text-right">Amount</th>
                    <th className="py-2.5 px-3 border-r border-white/10">Payment Method</th>
                    <th className="py-2.5 px-3">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-[#08051e]/60 text-slate-200">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        No payments recorded yet.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.04]">
                        <td className="py-2.5 px-3 border-r border-white/10 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 border-r border-white/10 whitespace-nowrap">{p.date}</td>
                        <td className="py-2.5 px-3 border-r border-white/10 font-semibold text-cyan-300 font-mono">{p.referenceNo}</td>
                        <td className="py-2.5 px-3 border-r border-white/10 text-right font-bold text-emerald-400">{formatMoney(p.amount)}</td>
                        <td className="py-2.5 px-3 border-r border-white/10">{p.paymentMode}</td>
                        <td className="py-2.5 px-3 text-slate-400">{p.paymentNote || '--'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Payment Form */}
          {showAddForm && (
            <form onSubmit={handleAddPaymentSubmit} className="p-4 bg-[#08051e] border border-white/10 rounded-2xl space-y-3 animate-in fade-in duration-150">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <DollarSign size={15} className="text-emerald-400" />
                <span>Record New Payment</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Amount: *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={payAmount}
                    onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                    max={purchase.paymentDue}
                    className="w-full bg-[#0c0827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Payment Method:</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full bg-[#0c0827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Cash" className="bg-[#0c0827]">Cash</option>
                    <option value="Card" className="bg-[#0c0827]">Card</option>
                    <option value="Bank Transfer" className="bg-[#0c0827]">Bank Transfer</option>
                    <option value="Cheque" className="bg-[#0c0827]">Cheque</option>
                    <option value="bKash / Nagad" className="bg-[#0c0827]">bKash / Nagad</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Paid On:</label>
                  <input
                    type="text"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full bg-[#0c0827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Payment Note:</label>
                <input
                  type="text"
                  placeholder="Optional note..."
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="w-full bg-[#0c0827] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Payment
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#120e34]/90 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
