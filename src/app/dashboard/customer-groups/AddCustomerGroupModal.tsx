"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Info, ChevronDown } from 'lucide-react';

export interface CustomerGroupFormData {
  id?: string;
  name: string;
  priceCalculationType: 'Percentage' | 'Selling Price Group';
  calculationPercentage?: number | string;
  sellingPriceGroup?: string;
}

interface AddCustomerGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CustomerGroupFormData) => void;
  initialData?: CustomerGroupFormData | null;
}

export default function AddCustomerGroupModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddCustomerGroupModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [priceCalculationType, setPriceCalculationType] = useState<'Percentage' | 'Selling Price Group'>('Percentage');
  const [calculationPercentage, setCalculationPercentage] = useState('');
  const [sellingPriceGroup, setSellingPriceGroup] = useState('Please Select');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPriceCalculationType(initialData.priceCalculationType || 'Percentage');
      setCalculationPercentage(
        initialData.calculationPercentage !== undefined ? String(initialData.calculationPercentage) : ''
      );
      setSellingPriceGroup(initialData.sellingPriceGroup || 'Please Select');
    } else {
      setName('');
      setPriceCalculationType('Percentage');
      setCalculationPercentage('');
      setSellingPriceGroup('Please Select');
    }
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialData?.id,
      name: name.trim(),
      priceCalculationType,
      calculationPercentage: priceCalculationType === 'Percentage' ? calculationPercentage : '',
      sellingPriceGroup: priceCalculationType === 'Selling Price Group' ? sellingPriceGroup : '',
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e0a2b] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#120e34]">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            {initialData ? 'Edit Customer Group' : 'Add Customer Group'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs select-none">
          
          {/* Customer Group Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Customer Group Name:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer Group Name"
              required
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Price calculation type */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Price calculation type:
            </label>
            <div className="relative">
              <select
                value={priceCalculationType}
                onChange={(e) => setPriceCalculationType(e.target.value as 'Percentage' | 'Selling Price Group')}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none pr-9"
              >
                <option value="Percentage">Percentage</option>
                <option value="Selling Price Group">Selling Price Group</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* If Percentage selected */}
          {priceCalculationType === 'Percentage' ? (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="text-slate-300 font-semibold">
                  Calculation Percentage (%):
                </label>
                <div title="Percentage to calculate selling price for this customer group" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                  <Info size={14} />
                </div>
              </div>
              <input
                type="number"
                step="any"
                value={calculationPercentage}
                onChange={(e) => setCalculationPercentage(e.target.value)}
                placeholder="Calculation Percentage (%)"
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          ) : (
            /* If Selling Price Group selected */
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Selling Price Group:
              </label>
              <div className="relative">
                <select
                  value={sellingPriceGroup}
                  onChange={(e) => setSellingPriceGroup(e.target.value)}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none pr-9"
                >
                  <option value="Please Select">Please Select</option>
                  <option value="Default Selling Price">Default Selling Price</option>
                  <option value="Retail Price">Retail Price</option>
                  <option value="Wholesale Price">Wholesale Price</option>
                  <option value="VIP Price">VIP Price</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-lg shadow-violet-500/25 active:scale-95 cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#202234] hover:bg-[#2c2f48] text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer border border-white/10"
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
