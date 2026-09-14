"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (agentData: AgentFormData) => void;
}

export interface AgentFormData {
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  commissionPercentage: string;
}

export default function AddSalesCommissionAgentModal({
  isOpen,
  onClose,
  onSave,
}: AddAgentModalProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [formData, setFormData] = useState<AgentFormData>({
    prefix: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    commissionPercentage: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      {/* Click backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-xl bg-[#120e34] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col max-h-[90vh] text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Add sales commission agent
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Row 1: Prefix, First Name, Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Prefix:
              </label>
              <input
                type="text"
                name="prefix"
                value={formData.prefix}
                onChange={handleChange}
                placeholder="Mr / Mrs"
                className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                First Name:*
              </label>
              <input
                type="text"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Last Name:
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Email, Contact Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Contact Number:
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Address:
            </label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-3 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors resize-y"
            />
          </div>

          {/* Row 4: Sales Commission Percentage (%) */}
          <div className="sm:w-1/2">
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Sales Commission Percentage (%):
            </label>
            <input
              type="text"
              name="commissionPercentage"
              value={formData.commissionPercentage}
              onChange={handleChange}
              placeholder="Sales Commission Percentage (%)"
              className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all border border-white/10 cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/25 active:scale-95 cursor-pointer"
            >
              Save Agent
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}