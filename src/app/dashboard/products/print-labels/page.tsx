"use client";

import React, { useState } from 'react';
import { Search, Info, Settings, Trash2, Printer, X, Eye } from 'lucide-react';
import { FiChevronUp } from 'react-icons/fi';

interface LabelProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  variation?: string;
  quantity: number;
  packingDate: string;
  priceGroup: string;
}

const availableDemoProducts = [
  { id: '1', name: 'Head Light', sku: '0003', price: 25000.0, variation: 'Single' },
  { id: '2', name: 'MOBILE STAND', sku: '0002', price: 1200.0, variation: 'Black' },
  { id: '3', name: 'TEST', sku: '00017896036', price: 720.0, variation: 'Standard' },
  { id: '4', name: 'WD 400', sku: '0001', price: 160.0, variation: '400ml' },
];

export default function PrintLabelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof availableDemoProducts>([]);
  
  // Selected products to print labels for
  const [selectedProducts, setSelectedProducts] = useState<LabelProductItem[]>([
    {
      id: '1',
      name: 'Head Light',
      sku: '0003',
      price: 25000.0,
      variation: 'Single',
      quantity: 4,
      packingDate: '2026-09-14',
      priceGroup: 'Default Selling Price',
    },
  ]);

  // Information to show in labels (checkboxes & font sizes matching screenshot media_1789382237762.png)
  const [showProductName, setShowProductName] = useState(true);
  const [productNameSize, setProductNameSize] = useState('15');

  const [showProductVariation, setShowProductVariation] = useState(true);
  const [productVariationSize, setProductVariationSize] = useState('17');

  const [showProductPrice, setShowProductPrice] = useState(true);
  const [productPriceSize, setProductPriceSize] = useState('17');

  const [priceType, setPriceType] = useState('inc. tax');

  const [showBusinessName, setShowBusinessName] = useState(true);
  const [businessNameSize, setBusinessNameSize] = useState('20');

  const [showPackingDate, setShowPackingDate] = useState(true);
  const [packingDateSize, setPackingDateSize] = useState('12');

  const [barcodeSetting, setBarcodeSetting] = useState('Default');

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Search handler
  const handleSearchChange = (q: string) => {
    setSearchTerm(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = availableDemoProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.sku.toLowerCase().includes(q.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleAddProduct = (prod: (typeof availableDemoProducts)[0]) => {
    if (!selectedProducts.some((p) => p.id === prod.id)) {
      setSelectedProducts((prev) => [
        ...prev,
        {
          id: prod.id,
          name: prod.name,
          sku: prod.sku,
          price: prod.price,
          variation: prod.variation,
          quantity: 5,
          packingDate: new Date().toISOString().split('T')[0],
          priceGroup: 'Default Selling Price',
        },
      ]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleQuantityChange = (id: string, qty: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p))
    );
  };

  const handlePackingDateChange = (id: string, date: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, packingDate: date } : p))
    );
  };

  const handlePriceGroupChange = (id: string, group: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, priceGroup: group } : p))
    );
  };

  return (
    <div className="space-y-6 select-none font-sans pb-16">
      {/* Top Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
          Print Labels
        </h1>
        <div
          title="Print custom barcode labels for products"
          className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
        >
          <Info size={16} />
        </div>
      </div>

      {/* Card 1: Add products to generate Labels (matching media_1789382237762.png) */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-6 sm:p-7 space-y-5">
        <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
          Add products to generate Labels
        </h2>

        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white shadow-inner focus-within:border-indigo-500/60">
            <Search size={16} className="text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Enter products name to print labels"
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
            />
          </div>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-[#0c0827] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden text-xs divide-y divide-white/10">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAddProduct(item)}
                  className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center justify-between text-slate-200 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-white">{item.name}</span>
                  <span className="font-mono text-cyan-300 text-[11px]">SKU: {item.sku}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Products Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">No. of labels</th>
                <th className="px-4 py-3">Packing Date</th>
                <th className="px-4 py-3">Selling Price Group</th>
                <th className="px-3 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {selectedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">
                    No products added yet. Use the search box above to add products.
                  </td>
                </tr>
              ) : (
                selectedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5">
                      <div className="font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-cyan-300 font-mono">SKU: {p.sku}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min="1"
                        value={p.quantity}
                        onChange={(e) => handleQuantityChange(p.id, Number(e.target.value))}
                        className="w-24 bg-[#08051e] border border-white/15 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-indigo-500/60"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="date"
                        value={p.packingDate}
                        onChange={(e) => handlePackingDateChange(p.id, e.target.value)}
                        className="bg-[#08051e] border border-white/15 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-indigo-500/60"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        value={p.priceGroup}
                        onChange={(e) => handlePriceGroupChange(p.id, e.target.value)}
                        className="bg-[#08051e] border border-white/15 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-indigo-500/60 cursor-pointer"
                      >
                        <option value="Default Selling Price">Default Selling Price</option>
                        <option value="Wholesale">Wholesale</option>
                        <option value="Retail">Retail</option>
                      </select>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-colors"
                        title="Remove product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 2: Information to show in Labels (matching media_1789382237762.png) */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-6 sm:p-7 space-y-6">
        <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
          Information to show in Labels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={showProductName}
                onChange={(e) => setShowProductName(e.target.checked)}
                className="accent-violet-500 rounded cursor-pointer"
              />
              <span>Product Name</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Size</span>
              <input
                type="text"
                value={productNameSize}
                onChange={(e) => setProductNameSize(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          {/* Product Variation */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={showProductVariation}
                onChange={(e) => setShowProductVariation(e.target.checked)}
                className="accent-violet-500 rounded cursor-pointer"
              />
              <span>Product Variation (recommended)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Size</span>
              <input
                type="text"
                value={productVariationSize}
                onChange={(e) => setProductVariationSize(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          {/* Product Price & Show Price */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={showProductPrice}
                onChange={(e) => setShowProductPrice(e.target.checked)}
                className="accent-violet-500 rounded cursor-pointer"
              />
              <span>Product Price</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Size</span>
              <input
                type="text"
                value={productPriceSize}
                onChange={(e) => setProductPriceSize(e.target.value)}
                className="w-20 bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500/60"
              />
              <div className="flex-1">
                <select
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value)}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500/60 cursor-pointer"
                >
                  <option value="inc. tax">inc. tax</option>
                  <option value="exc. tax">exc. tax</option>
                </select>
              </div>
              <div title="Tax inclusion setting for barcode label" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                <Info size={14} />
              </div>
            </div>
          </div>

          {/* Business Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={showBusinessName}
                onChange={(e) => setShowBusinessName(e.target.checked)}
                className="accent-violet-500 rounded cursor-pointer"
              />
              <span>Business name</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Size</span>
              <input
                type="text"
                value={businessNameSize}
                onChange={(e) => setBusinessNameSize(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>

          {/* Print Packing Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
              <input
                type="checkbox"
                checked={showPackingDate}
                onChange={(e) => setShowPackingDate(e.target.checked)}
                className="accent-violet-500 rounded cursor-pointer"
              />
              <span>Print packing date</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Size</span>
              <input
                type="text"
                value={packingDateSize}
                onChange={(e) => setPackingDateSize(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>
        </div>

        {/* Barcode Setting */}
        <div className="pt-4 border-t border-white/10 max-w-sm space-y-1.5 text-xs">
          <label className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Settings size={14} className="text-slate-400" />
            <span>Barcode setting:</span>
          </label>
          <select
            value={barcodeSetting}
            onChange={(e) => setBarcodeSetting(e.target.value)}
            className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer"
          >
            <option value="Default">Default (Continuous Roll 58mm)</option>
            <option value="20_labels">20 Labels per Sheet</option>
            <option value="30_labels">30 Labels per Sheet</option>
            <option value="40_labels">40 Labels per Sheet</option>
          </select>
        </div>

        {/* Action Button: Preview */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all shadow-md shadow-violet-600/30 active:scale-95 cursor-pointer"
          >
            <Eye size={15} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Barcode Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e0a2b]">
              <h2 className="text-base font-bold text-white tracking-wide">
                Barcode Labels Preview
              </h2>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedProducts.flatMap((p) =>
                  Array.from({ length: p.quantity }, (_, i) => (
                    <div
                      key={`${p.id}-${i}`}
                      className="bg-white text-black p-3 rounded-lg border border-slate-300 shadow-sm flex flex-col items-center justify-between text-center min-h-[140px]"
                    >
                      {showBusinessName && (
                        <div
                          className="font-bold tracking-tight uppercase"
                          style={{ fontSize: `${Math.min(14, Number(businessNameSize) || 12)}px` }}
                        >
                          RANGPUR BIKE PARLOUR
                        </div>
                      )}

                      {showProductName && (
                        <div
                          className="font-semibold text-slate-900 mt-1"
                          style={{ fontSize: `${Math.min(13, Number(productNameSize) || 11)}px` }}
                        >
                          {p.name}
                        </div>
                      )}

                      {showProductVariation && p.variation && (
                        <div
                          className="text-slate-600 italic text-[10px]"
                          style={{ fontSize: `${Math.min(11, Number(productVariationSize) || 10)}px` }}
                        >
                          Var: {p.variation}
                        </div>
                      )}

                      {/* Mock Barcode Graphic */}
                      <div className="my-2 flex flex-col items-center">
                        <div className="flex items-center gap-[2px] h-9">
                          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 2, 1].map((w, idx) => (
                            <span
                              key={idx}
                              className="bg-black inline-block h-full"
                              style={{ width: `${w}px` }}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[9px] text-slate-700 tracking-wider">
                          {p.sku}
                        </span>
                      </div>

                      {/* Price & Date */}
                      <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-900 pt-1 border-t border-slate-200">
                        {showProductPrice && (
                          <span>
                            ৳ {p.price.toFixed(2)}
                          </span>
                        )}
                        {showPackingDate && (
                          <span className="text-[9px] text-slate-500 font-normal">
                            {p.packingDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#0e0a2b]">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition-all shadow-md shadow-violet-600/30 cursor-pointer"
              >
                <Printer size={15} />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-[11px] text-slate-500 flex items-center justify-between max-w-7xl mx-auto w-full pt-4">
        <span>DATABYTE - V6.5 | Copyright © 2026 All rights reserved.</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-7 h-7 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
          title="Scroll to top"
        >
          <FiChevronUp className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
