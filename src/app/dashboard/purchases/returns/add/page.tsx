"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Building,
  Calendar,
  Search,
  Trash2,
  FolderOpen,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ReturnItemRow {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

const defaultSuppliers = [
  { id: '1', name: 'SHAMIM', mobile: '017953859' },
  { id: '2', name: 'JAMAL TRADERS', mobile: '01812345678' },
  { id: '3', name: 'KABIR MOTORS', mobile: '01987654321' }
];

const availableProducts = [
  { id: '1', name: 'Head Light', sku: '0003', defaultPrice: 5000 },
  { id: '2', name: 'MOBILE STAND', sku: '0002', defaultPrice: 1000 },
  { id: '3', name: 'TEST', sku: '00017896036', defaultPrice: 400 },
  { id: '4', name: 'WD 400', sku: '0001', defaultPrice: 120 },
  { id: '5', name: 'Brake Pad Set', sku: '0005', defaultPrice: 650 },
  { id: '6', name: 'Engine Oil 10W-40', sku: '0006', defaultPrice: 850 }
];

export default function AddPurchaseReturnPage() {
  const router = useRouter();

  // Top Card States (matching screenshot)
  const [supplierId, setSupplierId] = useState('');
  const [businessLocation, setBusinessLocation] = useState('Please Select');
  const [referenceNo, setReferenceNo] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Search & Table States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof availableProducts>([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<ReturnItemRow[]>([]);
  const [purchaseTax, setPurchaseTax] = useState('None');

  // Submit Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize date & reference
  useEffect(() => {
    const now = new Date();
    const formatted =
      now.toLocaleDateString('en-GB') +
      ' ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    setReturnDate(formatted);
    setReferenceNo(
      `PR-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(
        1000 + Math.random() * 9000
      )}`
    );
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products when search changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const filtered = availableProducts.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
      setSearchResults(filtered);
      setIsSearchDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchDropdownOpen(false);
    }
  }, [searchQuery]);

  // Add Product to Table
  const handleAddProduct = (prod: (typeof availableProducts)[0]) => {
    const existingIndex = items.findIndex((it) => it.sku === prod.sku);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].subtotal =
        updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setItems(updated);
    } else {
      const newItem: ReturnItemRow = {
        id: 'ret-item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        name: prod.name,
        sku: prod.sku,
        quantity: 1,
        unitPrice: prod.defaultPrice,
        subtotal: prod.defaultPrice * 1
      };
      setItems((prev) => [...prev, newItem]);
    }
    setSearchQuery('');
    setIsSearchDropdownOpen(false);
  };

  const handleRowChange = (id: string, field: 'quantity' | 'unitPrice', val: number) => {
    setItems((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: val };
          updated.subtotal = (Number(updated.quantity) || 0) * (Number(updated.unitPrice) || 0);
          return updated;
        }
        return row;
      })
    );
  };

  const handleDeleteRow = (id: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  // Calculations
  const subtotalSum = items.reduce((acc, row) => acc + (Number(row.subtotal) || 0), 0);

  let taxRate = 0;
  if (purchaseTax === 'VAT 5%') taxRate = 0.05;
  if (purchaseTax === 'GST 10%') taxRate = 0.10;
  if (purchaseTax === 'Tax 15%') taxRate = 0.15;

  const totalAmount = subtotalSum + subtotalSum * taxRate;

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierId || supplierId === 'Please Select') {
      alert('Please select a Supplier!');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one product to the return table!');
      return;
    }

    setIsSubmitting(true);

    const foundSupplier = defaultSuppliers.find((s) => s.id === supplierId);

    const returnRecord = {
      id: 'PR-' + Date.now(),
      referenceNo,
      parentPurchaseRef: 'PO-MANUAL',
      supplierName: foundSupplier?.name || 'Selected Supplier',
      date: returnDate,
      businessLocation: businessLocation === 'Please Select' ? 'RANGPUR BIKE PARLOUR (BL0001)' : businessLocation,
      paymentStatus: 'Due',
      grandTotal: totalAmount,
      paymentDue: totalAmount,
      items
    };

    try {
      const stored = JSON.parse(localStorage.getItem('pos_purchase_returns') || '[]');
      localStorage.setItem('pos_purchase_returns', JSON.stringify([returnRecord, ...stored]));
    } catch {
      // Ignored
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push('/dashboard/purchases/returns');
      }, 800);
    }, 600);
  };

  return (
    <div className="w-full space-y-6 select-none font-sans pb-20 text-slate-200">
      
      {/* Page Title & Back Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/purchases/returns"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
            Add Purchase Return
          </h1>
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
          <CheckCircle2 size={18} />
          <span>Purchase return added successfully! Redirecting...</span>
        </div>
      )}

      {/* Top Card: Supplier, Business Location, Reference No, Date, Attach Document */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
          <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        {/* Row 1: Supplier, Business Location, Reference No, Date */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          
          {/* Supplier:* */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Supplier:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <User size={15} />
              </span>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none shadow-inner"
              >
                <option value="" className="bg-[#0c0827]">Please Select</option>
                {defaultSuppliers.map((sup) => (
                  <option key={sup.id} value={sup.id} className="bg-[#0c0827]">
                    {sup.name} ({sup.mobile})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Business Location:* */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Business Location:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={businessLocation}
                onChange={(e) => setBusinessLocation(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none shadow-inner pr-9"
              >
                <option value="Please Select" className="bg-[#0c0827]">Please Select</option>
                <option value="RANGPUR BIKE PARLOUR (BL0001)" className="bg-[#0c0827]">RANGPUR BIKE PARLOUR (BL0001)</option>
                <option value="DHAKA CENTRAL OUTLET (BL0002)" className="bg-[#0c0827]">DHAKA CENTRAL OUTLET (BL0002)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Reference No: */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Reference No:
            </label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="PR-XXXX"
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
            />
          </div>

          {/* Date:* */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Date:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Calendar size={15} />
              </span>
              <input
                type="text"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                placeholder="DD/MM/YYYY HH:MM"
                className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Attach Document */}
        <div className="max-w-md pt-1">
          <label className="block font-semibold text-slate-300 mb-1.5">
            Attach Document:
          </label>
          <div className="flex border border-white/15 rounded-xl overflow-hidden bg-[#08051e] shadow-inner">
            <span className="flex-1 px-3.5 py-2.5 text-slate-400 truncate text-xs">
              {attachedFile ? attachedFile.name : 'No file chosen'}
            </span>
            <label className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold cursor-pointer transition-colors text-xs flex items-center gap-1.5 shrink-0">
              <FolderOpen size={14} />
              <span>Browse..</span>
              <input
                type="file"
                onChange={(e) => e.target.files && setAttachedFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400 leading-tight space-y-0.5">
            <p>Max File size: 5MB</p>
            <p>Allowed File: .pdf, .csv, .zip, .doc, .docx, .jpeg, .jpg, .png</p>
          </div>
        </div>
      </div>

      {/* Second Card: Search Products & Return Items Table */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        <h2 className="text-base font-bold text-white tracking-wide">
          Search Products
        </h2>

        {/* Full Width Search Input with Q icon */}
        <div ref={searchRef} className="relative w-full">
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsSearchDropdownOpen(true);
              }}
              placeholder="Search Products"
              className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner placeholder:text-slate-500"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchDropdownOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#0c0827] border border-white/15 rounded-2xl shadow-2xl z-30 max-h-60 overflow-y-auto divide-y divide-white/10">
              {searchResults.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => handleAddProduct(prod)}
                  className="w-full px-4 py-3 text-left hover:bg-violet-600/20 flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-white group-hover:text-cyan-300">{prod.name}</span>
                    <span className="text-[11px] text-slate-400 ml-2">SKU: {prod.sku}</span>
                  </div>
                  <span className="font-bold text-emerald-400">৳{prod.defaultPrice.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Return Items Table */}
        <div className="overflow-x-auto border border-white/10 rounded-xl scrollbar-thin scrollbar-thumb-white/15">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/[0.04] text-indigo-200/90 uppercase tracking-wider text-[11px] font-bold border-b border-white/10 select-none">
                <th className="py-3 px-4 min-w-[200px]">Product</th>
                <th className="py-3 px-4 w-36">Quantity</th>
                <th className="py-3 px-4 w-40">Unit Price</th>
                <th className="py-3 px-4 w-36">Subtotal</th>
                <th className="py-3 px-4 w-12 text-center">
                  <Trash2 size={16} className="mx-auto text-slate-400" />
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 bg-[#08051e]/60">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 font-medium">
                    No products added yet. Use the search bar above to select products to return.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                    {/* Product */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-slate-400">SKU: {item.sku}</p>
                    </td>

                    {/* Quantity */}
                    <td className="py-2.5 px-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleRowChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0c0827] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                      />
                    </td>

                    {/* Unit Price */}
                    <td className="py-2.5 px-4">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleRowChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0c0827] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                      />
                    </td>

                    {/* Subtotal */}
                    <td className="py-3 px-4 font-bold text-cyan-300">
                      ৳{item.subtotal.toFixed(2)}
                    </td>

                    {/* Delete */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(item.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Below Table: Purchase Tax on Left, Total Amount on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          
          {/* Purchase Tax */}
          <div className="flex items-center gap-3">
            <label className="font-semibold text-slate-300 shrink-0">
              Purchase Tax:
            </label>
            <div className="relative w-48">
              <select
                value={purchaseTax}
                onChange={(e) => setPurchaseTax(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/60 appearance-none shadow-inner cursor-pointer pr-9"
              >
                <option value="None" className="bg-[#0c0827]">None</option>
                <option value="VAT 5%" className="bg-[#0c0827]">VAT 5%</option>
                <option value="GST 10%" className="bg-[#0c0827]">GST 10%</option>
                <option value="Tax 15%" className="bg-[#0c0827]">Tax 15%</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Total Amount: 0.00 */}
          <div className="text-right">
            <span className="font-semibold text-slate-400">Total Amount: </span>
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-200 text-base ml-1">
              ৳{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Centered Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Footer Subtext matching screenshot */}
        <div className="text-center pt-4 border-t border-white/5 text-[10px] text-slate-500">
          DATABYTE - V6.5 | Copyright © 2026 All rights reserved.
        </div>
      </div>
    </div>
  );
}
