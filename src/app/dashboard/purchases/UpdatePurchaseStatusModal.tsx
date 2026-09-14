"use client";

import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { PurchaseDetailsRecord } from './PurchaseDetailsModal';

interface UpdatePurchaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: PurchaseDetailsRecord | null;
  onStatusUpdated: (updatedPurchase: PurchaseDetailsRecord) => void;
}

export default function UpdatePurchaseStatusModal({
  isOpen,
  onClose,
  purchase,
  onStatusUpdated
}: UpdatePurchaseStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(purchase?.status || 'Received');

  if (!isOpen || !purchase) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPurchase: PurchaseDetailsRecord = {
      ...purchase,
      status: selectedStatus,
      activities: [
        ...(purchase.activities || []),
        {
          date: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          action: 'Status Updated',
          by: 'Admin',
          status: selectedStatus,
          total: purchase.grandTotal,
          paymentStatus: purchase.paymentStatus
        }
      ]
    };
    onStatusUpdated(updatedPurchase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e0a2b] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto flex flex-col font-sans backdrop-blur-2xl">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-xs pointer-events-none" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#120e34]/90">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <RefreshCw size={16} className="text-cyan-400" />
            <span>Update Status</span>
            <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
              #{purchase.referenceNo}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Purchase Status: *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 font-medium cursor-pointer shadow-inner"
            >
              <option value="Received" className="bg-[#0c0827]">Received</option>
              <option value="Pending" className="bg-[#0c0827]">Pending</option>
              <option value="Ordered" className="bg-[#0c0827]">Ordered</option>
            </select>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Updating status will adjust stock availability and append an activity note to #{purchase.referenceNo}.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
            >
              Update Status
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
