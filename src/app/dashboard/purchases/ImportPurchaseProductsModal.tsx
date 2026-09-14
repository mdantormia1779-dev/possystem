"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, FileSpreadsheet, Download, AlertCircle } from 'lucide-react';

interface ImportPurchaseProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: any[]) => void;
}

export default function ImportPurchaseProductsModal({
  isOpen,
  onClose,
  onImport
}: ImportPurchaseProductsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Product Name,SKU,Quantity,Unit Cost,Discount Percent,Profit Margin %\n" +
      "Head Light,0003,10,5000,0,400\n" +
      "MOBILE STAND,0002,5,1000,0,20\n" +
      "WD 400,0001,20,120,0,33.33";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "purchase_products_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockImported = [
      {
        id: 'imp-' + Date.now() + '-1',
        name: 'Head Light',
        sku: '0003',
        quantity: 5,
        unitCostBeforeDiscount: 5000,
        discountPercent: 0,
        profitMarginPercent: 400,
      },
      {
        id: 'imp-' + Date.now() + '-2',
        name: 'MOBILE STAND',
        sku: '0002',
        quantity: 2,
        unitCostBeforeDiscount: 1000,
        discountPercent: 0,
        profitMarginPercent: 20,
      }
    ];

    onImport(mockImported);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 overflow-hidden text-slate-200">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-xs pointer-events-none" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c0827]/70">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <FileSpreadsheet className="text-violet-400" size={18} />
            Import Products for Purchase
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-300">
          <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-start gap-2.5 text-violet-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-violet-400" />
            <p>
              Upload a CSV file containing purchase item details or download the pre-formatted template.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold hover:bg-emerald-500/30 transition-colors"
            >
              <Download size={14} />
              Download Template CSV
            </button>
          </div>

          <div className="border-2 border-dashed border-white/15 bg-[#08051e]/60 rounded-2xl p-6 text-center hover:border-violet-500/50 transition-colors">
            <Upload className="mx-auto text-slate-400 mb-2" size={28} />
            <p className="font-semibold text-slate-200">Choose CSV file or drag and drop</p>
            <p className="text-[11px] text-slate-500 mt-1">Maximum file size: 5MB</p>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="mt-3 block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-600/30 file:text-violet-200 hover:file:bg-violet-600/50 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
            >
              Upload & Import
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
