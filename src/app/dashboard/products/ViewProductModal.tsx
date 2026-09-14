"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Image as ImageIcon } from 'lucide-react';
import { ProductItem } from './page';

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
}

export default function ViewProductModal({
  isOpen,
  onClose,
  product,
}: ViewProductModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !product) return null;

  const handlePrint = () => {
    window.print();
  };

  const marginCalculated = product.purchasePrice > 0
    ? (((product.sellingPrice - product.purchasePrice) / product.purchasePrice) * 100).toFixed(2)
    : '0.00';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0e0a2b] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#120e34]">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            {product.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs select-none [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
          
          {/* Top Section: Details (3 columns) & Product Image */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Column 1 */}
            <div className="space-y-2">
              <p><strong className="text-slate-400">SKU:</strong> <span className="text-cyan-300 font-mono font-medium">{product.sku}</span></p>
              <p><strong className="text-slate-400">Brand:</strong> <span className="text-white">{product.brand || 'Robin'}</span></p>
              <p><strong className="text-slate-400">Unit:</strong> <span className="text-white">{product.unit || 'Pc(s)'}</span></p>
              <p><strong className="text-slate-400">Barcode Type:</strong> <span className="text-white">{product.barcodeType || 'C128'}</span></p>
              <p><strong className="text-slate-400">Available in locations:</strong> <span className="text-white">{product.businessLocation}</span></p>
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              <p><strong className="text-slate-400">Category:</strong> <span className="text-slate-300">{product.category || '--'}</span></p>
              <p><strong className="text-slate-400">Sub category:</strong> <span className="text-slate-300">--</span></p>
              <p><strong className="text-slate-400">Manage Stock?:</strong> <span className="text-emerald-400 font-semibold">{product.manageStock ? 'Yes' : 'No'}</span></p>
              <p><strong className="text-slate-400">Alert quantity:</strong> <span className="text-slate-300">{product.alertQuantity || '--'}</span></p>
            </div>

            {/* Column 3 */}
            <div className="space-y-2">
              <p><strong className="text-slate-400">Expires in:</strong> <span className="text-slate-300">Not Applicable</span></p>
              <p><strong className="text-slate-400">Applicable Tax:</strong> <span className="text-slate-300">{product.tax || 'None'}</span></p>
              <p><strong className="text-slate-400">Selling Price Tax Type:</strong> <span className="text-slate-300">Exclusive</span></p>
              <p><strong className="text-slate-400">Product Type:</strong> <span className="text-slate-300">{product.productType || 'Single'}</span></p>
            </div>

            {/* Far Right: Product Image Box */}
            <div className="lg:col-span-1 flex justify-center lg:justify-end">
              <div className="w-44 h-44 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shadow-inner">
                <ImageIcon size={64} strokeWidth={1.2} className="text-slate-600" />
              </div>
            </div>
          </div>

          {/* Table 1: Default Purchase & Selling Price (Green Header) */}
          <div className="overflow-x-auto rounded-xl border border-emerald-500/30">
            <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
              <thead>
                <tr className="bg-emerald-600 text-white font-bold">
                  <th className="px-4 py-3">Default Purchase Price (Exc. tax)</th>
                  <th className="px-4 py-3">Default Purchase Price (Inc. tax)</th>
                  <th className="px-4 py-3">x Margin(%)</th>
                  <th className="px-4 py-3">Default Selling Price (Exc. tax)</th>
                  <th className="px-4 py-3">Default Selling Price (Inc. tax)</th>
                  <th className="px-4 py-3">Variation Images</th>
                </tr>
              </thead>
              <tbody className="bg-[#0c0827]/80 text-slate-200 divide-y divide-white/10">
                <tr>
                  <td className="px-4 py-3 font-semibold">
                    ৳ {product.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ৳ {product.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-cyan-300">
                    {marginCalculated}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    ৳ {product.sellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    ৳ {product.sellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    --
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: Product Stock Details (Green Header) */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-xs tracking-wide">
              Product Stock Details
            </h3>
            <div className="overflow-x-auto rounded-xl border border-emerald-500/30">
              <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                <thead>
                  <tr className="bg-emerald-600 text-white font-bold">
                    <th className="px-3.5 py-2.5">SKU</th>
                    <th className="px-3.5 py-2.5">Product</th>
                    <th className="px-3.5 py-2.5">Location</th>
                    <th className="px-3.5 py-2.5">Unit Price</th>
                    <th className="px-3.5 py-2.5">Current stock</th>
                    <th className="px-3.5 py-2.5">Current Stock Value</th>
                    <th className="px-3.5 py-2.5">Total unit sold</th>
                    <th className="px-3.5 py-2.5">Total Unit Transfered</th>
                    <th className="px-3.5 py-2.5">Total Unit Adjusted</th>
                  </tr>
                </thead>
                <tbody className="bg-[#0c0827]/80 text-slate-200 divide-y divide-white/10">
                  <tr>
                    <td className="px-3.5 py-3 font-mono text-cyan-300">{product.sku}</td>
                    <td className="px-3.5 py-3 font-semibold text-white">{product.name}</td>
                    <td className="px-3.5 py-3">{product.businessLocation}</td>
                    <td className="px-3.5 py-3">৳ {product.sellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3.5 py-3 text-emerald-400 font-semibold">{product.currentStock.toFixed(2)}{product.unit}</td>
                    <td className="px-3.5 py-3">৳ {(product.currentStock * product.purchasePrice).toFixed(2)}</td>
                    <td className="px-3.5 py-3">1.00{product.unit}</td>
                    <td className="px-3.5 py-3">0.00{product.unit}</td>
                    <td className="px-3.5 py-3">0.00{product.unit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-white/10 bg-[#120e34]">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Printer size={15} />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#202234] hover:bg-[#2c2f48] text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer border border-white/10"
          >
            Close
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
