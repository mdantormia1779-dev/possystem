"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Info, 
  Plus, 
  X, 
  Upload, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link2, 
  Image as ImageIcon, 
  Code, 
  Undo, 
  Redo,
  ChevronDown,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();

  // General Fields
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [barcodeType, setBarcodeType] = useState('Code 128 (C128)');
  const [unit, setUnit] = useState('Pieces (Pc(s))');
  const [brand, setBrand] = useState('Please Select');
  const [category, setCategory] = useState('Please Select');
  const [businessLocations, setBusinessLocations] = useState<string[]>([
    'RANGPUR BIKE PARLOUR (BL0001)',
  ]);
  const [manageStock, setManageStock] = useState(true);
  const [alertQuantity, setAlertQuantity] = useState('');
  const [description, setDescription] = useState('');

  // Flags & Details
  const [enableImei, setEnableImei] = useState(false);
  const [notForSelling, setNotForSelling] = useState(false);
  const [weight, setWeight] = useState('');
  const [prepTime, setPrepTime] = useState('');

  // Tax & Pricing
  const [applicableTax, setApplicableTax] = useState('None');
  const [taxType, setTaxType] = useState<'Exclusive' | 'Inclusive'>('Exclusive');
  const [productType, setProductType] = useState('Single');

  // Pricing calculations
  const [purchaseExcTax, setPurchaseExcTax] = useState<number | string>('');
  const [purchaseIncTax, setPurchaseIncTax] = useState<number | string>('');
  const [marginPercent, setMarginPercent] = useState<number | string>('20.00');
  const [sellingExcTax, setSellingExcTax] = useState<number | string>('');

  // Success Feedback
  const [submitted, setSubmitted] = useState(false);

  // Auto-calculation of taxes and selling price
  useEffect(() => {
    const exc = Number(purchaseExcTax) || 0;
    const margin = Number(marginPercent) || 0;

    let taxRate = 0;
    if (applicableTax === 'VAT 5%') taxRate = 0.05;
    if (applicableTax === 'GST 18%') taxRate = 0.18;

    const inc = exc * (1 + taxRate);
    setPurchaseIncTax(exc > 0 ? inc.toFixed(2) : '');

    const selling = exc * (1 + margin / 100);
    setSellingExcTax(exc > 0 ? selling.toFixed(2) : '');
  }, [purchaseExcTax, marginPercent, applicableTax]);

  const handleRemoveLocation = (loc: string) => {
    setBusinessLocations((prev) => prev.filter((item) => item !== loc));
  };

  const handleSave = (redirectMode: 'list' | 'another' | 'stock') => {
    if (!productName.trim()) {
      alert('Please enter a product name!');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      if (redirectMode === 'another') {
        setProductName('');
        setSku('');
        setPurchaseExcTax('');
        setSubmitted(false);
      } else {
        router.push('/dashboard/products');
      }
    }, 800);
  };

  return (
    <div className="space-y-6 select-none font-sans pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
            Add new product
          </h1>
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
          <CheckCircle2 size={18} />
          <span>Product saved successfully! Redirecting...</span>
        </div>
      )}

      {/* Card 1: Main Product Information */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs">
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
          <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        {/* Row 1: Product Name, SKU, Barcode Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Product Name:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              required
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-slate-300 font-semibold">SKU:</label>
              <div title="Leave empty to autogenerate" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                <Info size={13} />
              </div>
            </div>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU"
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Barcode Type:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={barcodeType}
                onChange={(e) => setBarcodeType(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none pr-9"
              >
                <option value="Code 128 (C128)">Code 128 (C128)</option>
                <option value="Code 39">Code 39</option>
                <option value="EAN-13">EAN-13</option>
                <option value="UPC-A">UPC-A</option>
                <option value="QR Code">QR Code</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Unit, Brand, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Unit:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none pr-9"
                >
                  <option value="Pieces (Pc(s))">Pieces (Pc(s))</option>
                  <option value="Box">Box</option>
                  <option value="Dozen">Dozen</option>
                  <option value="Kg">Kg</option>
                  <option value="Meter">Meter</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-300 flex items-center justify-center cursor-pointer transition-colors"
                title="Add Unit"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Brand:</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none pr-9"
                >
                  <option value="Please Select">Please Select</option>
                  <option value="Robin">Robin</option>
                  <option value="MOTO WOLF">MOTO WOLF</option>
                  <option value="WD">WD</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-300 flex items-center justify-center cursor-pointer transition-colors"
                title="Add Brand"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Category:</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none pr-9"
              >
                <option value="Please Select">Please Select</option>
                <option value="Parts">Parts</option>
                <option value="Accessories">Accessories</option>
                <option value="Lubricants">Lubricants</option>
                <option value="Helmet">Helmet</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 3: Business Locations, Manage Stock?, Alert quantity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-slate-300 font-semibold">Business Locations:</label>
              <div title="Locations where this product is available" className="text-cyan-400 cursor-pointer">
                <Info size={13} />
              </div>
            </div>
            <div className="w-full min-h-[42px] bg-[#08051e] border border-white/15 rounded-xl p-2 flex flex-wrap gap-1.5 items-center">
              {businessLocations.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[11px] font-semibold"
                >
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(loc)}
                    className="hover:text-white cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-2 cursor-pointer pt-3">
              <input
                type="checkbox"
                checked={manageStock}
                onChange={(e) => setManageStock(e.target.checked)}
                className="accent-violet-500 rounded cursor-pointer w-4 h-4"
              />
              <span className="text-slate-200 font-semibold">Manage Stock?</span>
              <div title="Enable stock management at product level" className="text-cyan-400 cursor-pointer">
                <Info size={13} />
              </div>
            </label>
            <p className="text-[10px] text-slate-400 mt-1 pl-6">
              Enable stock management at product level
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-slate-300 font-semibold">Alert quantity:</label>
              <div title="Low stock alert trigger" className="text-cyan-400 cursor-pointer">
                <Info size={13} />
              </div>
            </div>
            <input
              type="number"
              value={alertQuantity}
              onChange={(e) => setAlertQuantity(e.target.value)}
              placeholder="Alert quantity"
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>

        {/* Row 4: Product Description Rich Area */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-slate-300 font-semibold">Product Description:</label>
          <div className="rounded-xl border border-white/15 bg-[#08051e] overflow-hidden">
            {/* Toolbar simulation */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/[0.02] text-slate-400">
              <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5 cursor-pointer"><Undo size={14} /></button>
              <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5 cursor-pointer"><Redo size={14} /></button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5 cursor-pointer font-bold"><Bold size={14} /></button>
              <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5 cursor-pointer italic"><Italic size={14} /></button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5 cursor-pointer"><List size={14} /></button>
              <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5 cursor-pointer"><ListOrdered size={14} /></button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5 cursor-pointer"><Link2 size={14} /></button>
              <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5 cursor-pointer"><ImageIcon size={14} /></button>
              <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5 cursor-pointer"><Code size={14} /></button>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write detailed product description here..."
              className="w-full bg-transparent p-3 text-white placeholder-slate-500 focus:outline-none resize-y"
            />
          </div>
        </div>

        {/* Row 5: Product Brochure & Product Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Product brochure:</label>
            <input
              type="file"
              className="block w-full text-xs text-slate-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-xl file:border file:border-white/15
                file:text-xs file:font-semibold
                file:bg-[#0c0827] file:text-slate-200
                hover:file:bg-white/10 file:cursor-pointer cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Max file size: 5MB | Allowed: .pdf, .csv, .zip, .doc, .docx, .jpeg, .jpg, .png
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Product Image:</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-xs text-slate-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-xl file:border file:border-white/15
                file:text-xs file:font-semibold
                file:bg-[#0c0827] file:text-slate-200
                hover:file:bg-white/10 file:cursor-pointer cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Max file size: 5MB | Aspect ratio should be 1:1
            </p>
          </div>
        </div>

      </div>

      {/* Card 2: Flags & Custom Specifications */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableImei}
              onChange={(e) => setEnableImei(e.target.checked)}
              className="accent-violet-500 rounded cursor-pointer w-4 h-4"
            />
            <span className="text-slate-200 font-semibold">
              Enable Product description, IMEI or Serial Number
            </span>
            <div title="Allow entering IMEI or Serial number in sales" className="text-cyan-400 cursor-pointer">
              <Info size={13} />
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notForSelling}
              onChange={(e) => setNotForSelling(e.target.checked)}
              className="accent-violet-500 rounded cursor-pointer w-4 h-4"
            />
            <span className="text-slate-200 font-semibold">Not for selling</span>
            <div title="Item will not be available in POS sale" className="text-cyan-400 cursor-pointer">
              <Info size={13} />
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Weight:</label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight"
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Service staff time/Preparation time (in minutes):
            </label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="Service staff time/Preparation time (in minutes)"
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>
      </div>

      {/* Card 3: Pricing & Tax Section */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs">
        
        {/* Tax and Type row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Applicable Tax:</label>
            <div className="relative">
              <select
                value={applicableTax}
                onChange={(e) => setApplicableTax(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none pr-9"
              >
                <option value="None">None</option>
                <option value="VAT 5%">VAT 5%</option>
                <option value="GST 18%">GST 18%</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Selling Price Tax Type:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={taxType}
                onChange={(e) => setTaxType(e.target.value as 'Exclusive' | 'Inclusive')}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none pr-9"
              >
                <option value="Exclusive">Exclusive</option>
                <option value="Inclusive">Inclusive</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-slate-300 font-semibold">
                Product Type:<span className="text-rose-400 ml-0.5">*</span>
              </label>
              <div title="Single or Variable product" className="text-cyan-400 cursor-pointer">
                <Info size={13} />
              </div>
            </div>
            <div className="relative">
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none pr-9"
              >
                <option value="Single">Single</option>
                <option value="Variable">Variable</option>
                <option value="Combo">Combo</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Pricing Grid with Green Header (matching screenshot) */}
        <div className="overflow-x-auto rounded-xl border border-emerald-500/30">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-emerald-700/85 text-white font-bold">
                <th className="px-4 py-3 border-r border-emerald-600/40" colSpan={2}>
                  Default Purchase Price
                </th>
                <th className="px-4 py-3 border-r border-emerald-600/40">
                  <div className="flex items-center gap-1">
                    <span>x Margin(%)</span>
                    <Info size={12} className="text-emerald-200" />
                  </div>
                </th>
                <th className="px-4 py-3 border-r border-emerald-600/40">
                  Default Selling Price
                </th>
                <th className="px-4 py-3">Product Image</th>
              </tr>
              <tr className="bg-emerald-800/70 text-emerald-100 text-[11px] border-t border-emerald-600/40">
                <th className="px-4 py-1.5 border-r border-emerald-600/40">
                  Exc. tax<span className="text-rose-300 ml-0.5">*</span>
                </th>
                <th className="px-4 py-1.5 border-r border-emerald-600/40">
                  Inc. tax<span className="text-rose-300 ml-0.5">*</span>
                </th>
                <th className="px-4 py-1.5 border-r border-emerald-600/40"></th>
                <th className="px-4 py-1.5 border-r border-emerald-600/40">Exc. tax</th>
                <th className="px-4 py-1.5"></th>
              </tr>
            </thead>
            <tbody className="bg-[#0c0827]/80 divide-y divide-white/10 text-slate-300">
              <tr>
                {/* Exc. Tax */}
                <td className="px-3 py-3 border-r border-white/10">
                  <input
                    type="number"
                    step="any"
                    value={purchaseExcTax}
                    onChange={(e) => setPurchaseExcTax(e.target.value)}
                    placeholder="Exc. tax"
                    className="w-full bg-[#08051e] border border-white/15 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </td>

                {/* Inc. Tax */}
                <td className="px-3 py-3 border-r border-white/10">
                  <input
                    type="number"
                    step="any"
                    value={purchaseIncTax}
                    readOnly
                    placeholder="Inc. tax"
                    className="w-full bg-[#08051e]/60 border border-white/10 rounded-lg px-3 py-1.5 text-emerald-300 placeholder-slate-500 focus:outline-none cursor-not-allowed"
                  />
                </td>

                {/* Margin % */}
                <td className="px-3 py-3 border-r border-white/10">
                  <input
                    type="number"
                    step="any"
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(e.target.value)}
                    placeholder="20.00"
                    className="w-full bg-[#08051e] border border-white/15 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </td>

                {/* Selling Exc. Tax */}
                <td className="px-3 py-3 border-r border-white/10">
                  <input
                    type="number"
                    step="any"
                    value={sellingExcTax}
                    onChange={(e) => setSellingExcTax(e.target.value)}
                    placeholder="Exc. tax"
                    className="w-full bg-[#08051e] border border-white/15 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </td>

                {/* Image upload inside row */}
                <td className="px-3 py-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-[11px] text-slate-400
                      file:mr-2 file:py-1 file:px-2.5
                      file:rounded-lg file:border file:border-white/15
                      file:text-[11px] file:font-semibold
                      file:bg-[#0c0827] file:text-slate-200
                      hover:file:bg-white/10 file:cursor-pointer cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Max: 5MB, 1:1 ratio
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* Bottom Buttons (matching screenshot) */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={() => handleSave('stock')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Save & Add Opening Stock
        </button>

        <button
          type="button"
          onClick={() => handleSave('another')}
          className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Save And Add Another
        </button>

        <button
          type="button"
          onClick={() => handleSave('list')}
          className="px-7 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-md shadow-violet-600/25 active:scale-95 cursor-pointer"
        >
          Save
        </button>
      </div>

    </div>
  );
}
