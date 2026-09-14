"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface NewBrandData {
  brandName: string;
  shortDescription?: string;
}

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (brandData: NewBrandData) => void;
}

export default function AddBrandModal({
  isOpen,
  onClose,
  onSave,
}: AddBrandModalProps) {
  const [mounted, setMounted] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    setError('');
    setBrandName('');
    setShortDescription('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      setError('Brand name is required.');
      return;
    }

    onSave({
      brandName: brandName.trim(),
      shortDescription: shortDescription.trim(),
    });

    handleClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={handleClose} aria-hidden="true" />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 overflow-hidden z-10 flex flex-col text-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e0a2b]">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Add brand
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Brand Name Field */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Brand name:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => {
                setBrandName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Brand name"
              autoFocus
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Short description Field */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Short description:
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Short description"
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition-all shadow-md shadow-violet-600/30 active:scale-95 cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-xl bg-[#242b35] hover:bg-[#2e3744] text-slate-200 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
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
