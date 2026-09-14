"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { ProductItem } from './page';

interface DeleteProductModalProps {
  isOpen: boolean;
  product: ProductItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProductModal({
  isOpen,
  product,
  onClose,
  onConfirm,
}: DeleteProductModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || !product) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-md bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col text-slate-200 p-6 animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <IoClose className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.25)] mx-auto mb-4">
          <FiAlertTriangle className="w-7 h-7 stroke-[2]" />
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-white tracking-wide">
            Delete Product
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-white">{product.name}</span>?
          </p>

          <div className="mt-3 py-2 px-3 bg-white/5 border border-white/10 rounded-xl inline-flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400">SKU: <span className="text-cyan-300 font-mono font-medium">{product.sku}</span></span>
            {product.brand && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-slate-400">Brand: <span className="text-white">{product.brand}</span></span>
              </>
            )}
          </div>

          <p className="text-[11px] text-rose-400/90 mt-3">
            This action is permanent and cannot be undone. All linked stock data for this product will be removed.
          </p>
        </div>

        {/* Action Buttons */}
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
            <span>Delete Product</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
