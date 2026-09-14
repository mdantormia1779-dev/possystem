"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiTrash2, FiAlertTriangle, FiMapPin, FiSlash, FiCheckCircle } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { ProductItem } from './page';

interface BulkDeleteModalProps {
  isOpen: boolean;
  selectedProducts: ProductItem[];
  onClose: () => void;
  onConfirm: () => void;
}

export function BulkDeleteModal({
  isOpen,
  selectedProducts,
  onClose,
  onConfirm,
}: BulkDeleteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col text-slate-200 p-6 animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
        >
          <IoClose className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.25)] mx-auto mb-4">
          <FiAlertTriangle className="w-7 h-7 stroke-[2]" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-white tracking-wide">
            Delete Selected Products
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-white">{selectedProducts.length}</span> selected product(s)?
          </p>

          <div className="mt-3.5 max-h-32 overflow-y-auto space-y-1.5 p-2 bg-[#08051e] border border-white/10 rounded-xl text-left text-xs">
            {selectedProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-2 py-1 bg-white/5 rounded-lg text-slate-300">
                <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                <span className="text-[11px] font-mono text-cyan-300">SKU: {p.sku}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-rose-400/90 mt-3">
            This action cannot be undone. All linked stock data will be erased.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all border border-white/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-semibold text-xs shadow-lg shadow-rose-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            <span>Delete ({selectedProducts.length})</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface AddToLocationModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (location: string) => void;
}

export function AddToLocationModal({
  isOpen,
  selectedCount,
  onClose,
  onConfirm,
}: AddToLocationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [targetLocation, setTargetLocation] = useState('RANGPUR BIKE PARLOUR');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col text-slate-200 p-6 animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
        >
          <IoClose className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.25)] mx-auto mb-4">
          <FiMapPin className="w-7 h-7 stroke-[2]" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-white tracking-wide">
            Add to Location
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Select the business location to assign to{' '}
            <span className="font-semibold text-cyan-300">{selectedCount}</span> selected product(s).
          </p>

          <div className="mt-4 text-left">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Business Location:
            </label>
            <select
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/60 cursor-pointer"
            >
              <option value="RANGPUR BIKE PARLOUR">RANGPUR BIKE PARLOUR (BL0001)</option>
              <option value="DHAKA MAIN BRANCH">DHAKA MAIN BRANCH (BL0002)</option>
              <option value="CHITTAGONG OUTLET">CHITTAGONG OUTLET (BL0003)</option>
              <option value="SYLHET POINT">SYLHET POINT (BL0004)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all border border-white/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(targetLocation);
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>Apply Location</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface RemoveFromLocationModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (location: string) => void;
}

export function RemoveFromLocationModal({
  isOpen,
  selectedCount,
  onClose,
  onConfirm,
}: RemoveFromLocationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [targetLocation, setTargetLocation] = useState('All Locations');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col text-slate-200 p-6 animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
        >
          <IoClose className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.25)] mx-auto mb-4">
          <FiSlash className="w-7 h-7 stroke-[2]" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-white tracking-wide">
            Remove from Location
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Choose location to remove from{' '}
            <span className="font-semibold text-amber-300">{selectedCount}</span> selected product(s).
          </p>

          <div className="mt-4 text-left">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Location to Remove:
            </label>
            <select
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60 cursor-pointer"
            >
              <option value="All Locations">All Locations (Reset to None)</option>
              <option value="RANGPUR BIKE PARLOUR">RANGPUR BIKE PARLOUR (BL0001)</option>
              <option value="DHAKA MAIN BRANCH">DHAKA MAIN BRANCH (BL0002)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all border border-white/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(targetLocation);
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <FiSlash className="w-3.5 h-3.5" />
            <span>Remove Location</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface BulkDeactivateModalProps {
  isOpen: boolean;
  selectedCount: number;
  hasActive: boolean;
  onClose: () => void;
  onConfirm: (action: 'deactivate' | 'activate') => void;
}

export function BulkDeactivateModal({
  isOpen,
  selectedCount,
  hasActive,
  onClose,
  onConfirm,
}: BulkDeactivateModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col text-slate-200 p-6 animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
        >
          <IoClose className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.25)] mx-auto mb-4">
          <FiAlertTriangle className="w-7 h-7 stroke-[2]" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-white tracking-wide">
            {hasActive ? 'Deactivate Selected Products' : 'Activate Selected Products'}
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {hasActive ? (
              <>
                Are you sure you want to deactivate{' '}
                <span className="font-semibold text-amber-400">{selectedCount}</span> selected product(s)?
                Deactivated products will not appear in the POS sell screen.
              </>
            ) : (
              <>
                Are you sure you want to re-activate{' '}
                <span className="font-semibold text-emerald-400">{selectedCount}</span> selected product(s)?
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all border border-white/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(hasActive ? 'deactivate' : 'activate');
              onClose();
            }}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-semibold text-xs shadow-lg transition-all active:scale-95 cursor-pointer ${
              hasActive
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-amber-500/30'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-500/30'
            }`}
          >
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>{hasActive ? 'Deactivate' : 'Activate'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
