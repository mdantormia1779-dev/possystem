"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Minus } from 'lucide-react';

export interface VariationItem {
  id: string;
  name: string;
  values: string[];
}

interface AddVariationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; values: string[] }) => void;
  editVariation?: VariationItem | null;
}

export default function AddVariationModal({
  isOpen,
  onClose,
  onSave,
  editVariation,
}: AddVariationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [variationName, setVariationName] = useState('');
  const [variationValues, setVariationValues] = useState<string[]>(['', '']);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editVariation) {
      setVariationName(editVariation.name);
      setVariationValues(editVariation.values.length > 0 ? editVariation.values : ['', '']);
    } else {
      setVariationName('');
      setVariationValues(['', '']);
    }
    setError('');
  }, [editVariation, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    setError('');
    setVariationName('');
    setVariationValues(['', '']);
    onClose();
  };

  const handleAddValueRow = () => {
    setVariationValues((prev) => [...prev, '']);
  };

  const handleRemoveValueRow = (index: number) => {
    if (variationValues.length <= 1) return;
    setVariationValues((prev) => prev.filter((_, i) => i !== index));
  };

  const handleValueChange = (index: number, val: string) => {
    setVariationValues((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variationName.trim()) {
      setError('Variation Name is required.');
      return;
    }

    const validValues = variationValues.map((v) => v.trim()).filter(Boolean);
    if (validValues.length === 0) {
      setError('At least one variation value is required.');
      return;
    }

    onSave({
      name: variationName.trim(),
      values: validValues,
    });

    handleClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={handleClose} aria-hidden="true" />

      {/* Modal Card matching media_1789382378427.png */}
      <div className="relative w-full max-w-lg bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 overflow-hidden z-10 flex flex-col text-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e0a2b]">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            {editVariation ? 'Edit Variation' : 'Add Variation'}
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

          {/* Variation Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <label className="block text-slate-300 font-semibold sm:text-right">
              Variation Name:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="sm:col-span-2">
              <input
                type="text"
                value={variationName}
                onChange={(e) => {
                  setVariationName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Variation Name"
                autoFocus
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          {/* Variation Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start pt-2">
            <label className="block text-slate-300 font-semibold sm:text-right pt-2">
              Add variation values:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="sm:col-span-2 space-y-2.5">
              {variationValues.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleValueChange(idx, e.target.value)}
                    placeholder="Variation value"
                    className="flex-1 bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                  />
                  {idx === 0 ? (
                    <button
                      type="button"
                      onClick={handleAddValueRow}
                      className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center cursor-pointer transition-all shadow-md shadow-violet-600/30 active:scale-95 shrink-0"
                      title="Add Value"
                    >
                      <Plus size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemoveValueRow(idx)}
                      className="w-9 h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition-all shadow-md shadow-rose-500/30 active:scale-95 shrink-0"
                      title="Remove Value"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10 mt-6">
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
