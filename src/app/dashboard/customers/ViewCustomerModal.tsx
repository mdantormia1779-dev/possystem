"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText,
  CreditCard,
  Tag
} from 'lucide-react';
import { CustomerFormData } from './AddCustomerModal';

interface ViewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerFormData | null;
}

export default function ViewCustomerModal({
  isOpen,
  onClose,
  customer,
}: ViewCustomerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !customer) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-xs pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 shrink-0 bg-[#0c0827]/70 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Customer Profile
              </h2>
              <p className="text-[11px] text-slate-400">ID: {customer.contactId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-5 scrollbar-thin scrollbar-thumb-white/15 text-xs">
          
          {/* Key Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#0a0620]/80 border border-white/10 rounded-2xl p-3.5 space-y-1">
              <span className="text-slate-400 text-[11px]">Total Sale Due</span>
              <p className="text-sm font-bold text-rose-400">৳ {(customer.totalSaleDue || 0).toFixed(2)}</p>
            </div>
            <div className="bg-[#0a0620]/80 border border-white/10 rounded-2xl p-3.5 space-y-1">
              <span className="text-slate-400 text-[11px]">Credit Limit</span>
              <p className="text-sm font-bold text-indigo-300">
                {customer.creditLimit ? `৳ ${Number(customer.creditLimit).toFixed(2)}` : 'No Limit'}
              </p>
            </div>
            <div className="bg-[#0a0620]/80 border border-white/10 rounded-2xl p-3.5 space-y-1">
              <span className="text-slate-400 text-[11px]">Opening Balance</span>
              <p className="text-sm font-bold text-emerald-400">৳ {(customer.openingBalance || 0).toFixed(2)}</p>
            </div>
          </div>

          {/* Details list */}
          <div className="bg-[#0a0620]/60 border border-white/10 rounded-2xl p-4 divide-y divide-white/10 space-y-3">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Name / Business:</span>
              <span className="font-semibold text-white">{customer.name} {customer.businessName ? `(${customer.businessName})` : ''}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Customer Group:</span>
              <span className="font-medium text-white">{customer.customerGroup || 'None'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Mobile:</span>
              <span className="font-medium text-white">{customer.mobile || '—'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Email:</span>
              <span className="font-medium text-white">{customer.email || '—'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Tax number:</span>
              <span className="font-medium text-white">{customer.taxNumber || '—'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Total Sell Return Due:</span>
              <span className="font-medium text-amber-400">৳ {(customer.totalSellReturnDue || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Address:</span>
              <span className="font-medium text-white">
                {[customer.addressLine1, customer.city, customer.country].filter(Boolean).join(', ') || '—'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Added On:</span>
              <span className="font-medium text-white">{customer.addedOn || '—'}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-white/10 bg-[#0c0827]/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
