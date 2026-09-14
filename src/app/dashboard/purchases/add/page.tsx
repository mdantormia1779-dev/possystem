"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Plus,
  Info,
  Calendar,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  CreditCard,
  Building,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import AddContactModal, { NewContactData } from '../AddContactModal';
import ImportPurchaseProductsModal from '../ImportPurchaseProductsModal';

interface PurchaseItemRow {
  id: string;
  productId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitCostBeforeDiscount: number;
  discountPercent: number;
  unitCostBeforeTax: number;
  lineTotal: number;
  profitMarginPercent: number;
  unitSellingPriceIncTax: number;
}

interface AdditionalExpense {
  name: string;
  amount: number;
}

interface SupplierOption {
  id: string;
  name: string;
  contactId: string;
  mobile: string;
  address: string;
  payTermNumber?: string;
  payTermType?: string;
}

const defaultSuppliers: SupplierOption[] = [
  {
    id: '1',
    name: 'SHAMIM',
    contactId: 'SHAMIM',
    mobile: '017953859',
    address: 'Station Road, Rangpur, Bangladesh',
    payTermNumber: '30',
    payTermType: 'Days'
  },
  {
    id: '2',
    name: 'JAMAL TRADERS',
    contactId: 'CO1042',
    mobile: '01812345678',
    address: 'Jahaj Company More, Rangpur',
    payTermNumber: '15',
    payTermType: 'Days'
  },
  {
    id: '3',
    name: 'KABIR MOTORS',
    contactId: 'CO1099',
    mobile: '01987654321',
    address: 'Tejgaon Industrial Area, Dhaka',
    payTermNumber: '1',
    payTermType: 'Months'
  }
];

const productCatalog = [
  { id: '1', name: 'Head Light', sku: '0003', defaultCost: 5000, margin: 400 },
  { id: '2', name: 'MOBILE STAND', sku: '0002', defaultCost: 1000, margin: 20 },
  { id: '3', name: 'TEST', sku: '00017896036', defaultCost: 400, margin: 80 },
  { id: '4', name: 'WD 400', sku: '0001', defaultCost: 120, margin: 33.33 },
  { id: '5', name: 'Brake Pad Set', sku: '0005', defaultCost: 650, margin: 25 },
  { id: '6', name: 'Engine Oil 10W-40', sku: '0006', defaultCost: 850, margin: 30 }
];

export default function AddPurchasePage() {
  const router = useRouter();

  // Modals state
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Suppliers
  const [suppliers, setSuppliers] = useState<SupplierOption[]>(defaultSuppliers);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');

  // Top Card Form States
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [businessLocation, setBusinessLocation] = useState<string>('RANGPUR BIKE PARLOUR (BL0001)');
  const [payTermNumber, setPayTermNumber] = useState<string>('');
  const [payTermType, setPayTermType] = useState<string>('Please Select');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Middle Section: Product Search & Table
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<typeof productCatalog>([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<PurchaseItemRow[]>([]);

  // Discount & Tax Section
  const [discountType, setDiscountType] = useState<'None' | 'Percentage' | 'Fixed'>('None');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [purchaseTax, setPurchaseTax] = useState<string>('None');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Shipping & Additional Expenses Section
  const [shippingDetails, setShippingDetails] = useState<string>('');
  const [shippingCharges, setShippingCharges] = useState<number>(0);
  const [showAdditionalExpenses, setShowAdditionalExpenses] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<AdditionalExpense[]>([
    { name: '', amount: 0 },
    { name: '', amount: 0 },
    { name: '', amount: 0 },
    { name: '', amount: 0 }
  ]);

  // Payment Section
  const [advanceBalance] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paidOn, setPaidOn] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
  const [paymentAccount, setPaymentAccount] = useState<string>('Cash');
  const [paymentNote, setPaymentNote] = useState<string>('');

  // Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize dates
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    setPurchaseDate(formatted);
    setPaidOn(formatted);
    setReferenceNo(`PO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`);
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
      const filtered = productCatalog.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
      setSearchResults(filtered);
      setIsSearchDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchDropdownOpen(false);
    }
  }, [searchQuery]);

  // Selected supplier details
  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);

  // Handle supplier change
  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedSupplierId(id);
    const found = suppliers.find((s) => s.id === id);
    if (found) {
      if (found.payTermNumber) setPayTermNumber(found.payTermNumber);
      if (found.payTermType) setPayTermType(found.payTermType);
    }
  };

  // Add Product from Catalog to Table
  const handleAddProduct = (prod: (typeof productCatalog)[0]) => {
    const existingIndex = items.findIndex((item) => item.productId === prod.id || item.sku === prod.sku);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      updateRowCalculations(updated[existingIndex]);
      setItems(updated);
    } else {
      const unitCost = prod.defaultCost;
      const discount = 0;
      const unitCostBeforeTax = unitCost - (unitCost * discount) / 100;
      const margin = prod.margin || 20;
      const sellingPrice = unitCostBeforeTax * (1 + margin / 100);

      const newItem: PurchaseItemRow = {
        id: 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        productId: prod.id,
        name: prod.name,
        sku: prod.sku,
        quantity: 1,
        unitCostBeforeDiscount: unitCost,
        discountPercent: discount,
        unitCostBeforeTax: unitCostBeforeTax,
        lineTotal: unitCostBeforeTax * 1,
        profitMarginPercent: margin,
        unitSellingPriceIncTax: Number(sellingPrice.toFixed(2))
      };
      setItems((prev) => [...prev, newItem]);
    }

    setSearchQuery('');
    setIsSearchDropdownOpen(false);
  };

  // Update item calculations
  const updateRowCalculations = (row: PurchaseItemRow) => {
    const qty = Number(row.quantity) || 0;
    const cost = Number(row.unitCostBeforeDiscount) || 0;
    const disc = Number(row.discountPercent) || 0;
    const margin = Number(row.profitMarginPercent) || 0;

    const unitCostBeforeTax = cost - (cost * disc) / 100;
    const lineTotal = qty * unitCostBeforeTax;
    const unitSellingPriceIncTax = unitCostBeforeTax * (1 + margin / 100);

    row.unitCostBeforeTax = Number(unitCostBeforeTax.toFixed(2));
    row.lineTotal = Number(lineTotal.toFixed(2));
    row.unitSellingPriceIncTax = Number(unitSellingPriceIncTax.toFixed(2));
  };

  const handleRowChange = (id: string, field: keyof PurchaseItemRow, value: any) => {
    setItems((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          updateRowCalculations(updated);
          return updated;
        }
        return row;
      })
    );
  };

  const handleDeleteRow = (id: string) => {
    setItems((prev) => prev.filter((row) => row.id !== id));
  };

  // Calculations for Net Total & Summary
  const totalItems = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const netTotalAmount = items.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0);

  // Discount calculation
  let calculatedDiscount = 0;
  if (discountType === 'Percentage') {
    calculatedDiscount = (netTotalAmount * (Number(discountAmount) || 0)) / 100;
  } else if (discountType === 'Fixed') {
    calculatedDiscount = Number(discountAmount) || 0;
  }

  // Tax calculation
  let taxRate = 0;
  if (purchaseTax === 'VAT 5%') taxRate = 0.05;
  if (purchaseTax === 'GST 10%') taxRate = 0.10;
  if (purchaseTax === 'Tax 15%') taxRate = 0.15;
  const taxableBase = Math.max(0, netTotalAmount - calculatedDiscount);
  const calculatedTax = taxableBase * taxRate;

  // Additional expenses calculation
  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  // Overall Purchase Total
  const purchaseTotal = Math.max(
    0,
    netTotalAmount - calculatedDiscount + calculatedTax + (Number(shippingCharges) || 0) + totalExpenses
  );

  // Keep paid amount in sync by default if user hasn't explicitly customized it
  useEffect(() => {
    if (paidAmount === 0 && purchaseTotal > 0) {
      setPaidAmount(Number(purchaseTotal.toFixed(2)));
    }
  }, [purchaseTotal]);

  const paymentDue = Math.max(0, purchaseTotal - (Number(paidAmount) || 0));

  // Handle saving new supplier from AddContactModal
  const handleSaveContact = (newContact: NewContactData) => {
    const fullAddress = [
      newContact.addressLine1,
      newContact.city,
      newContact.state,
      newContact.country
    ].filter(Boolean).join(', ') || newContact.shippingAddress || 'Address on file';

    const newSup: SupplierOption = {
      id: newContact.id || String(Date.now()),
      name: newContact.name,
      contactId: newContact.contactId,
      mobile: newContact.mobile,
      address: fullAddress,
      payTermNumber: newContact.payTermNumber,
      payTermType: newContact.payTermType
    };

    setSuppliers((prev) => [newSup, ...prev]);
    setSelectedSupplierId(newSup.id);
    if (newContact.payTermNumber) setPayTermNumber(newContact.payTermNumber);
    if (newContact.payTermType) setPayTermType(newContact.payTermType);
  };

  // Handle imported products
  const handleImportProducts = (imported: any[]) => {
    const formattedRows: PurchaseItemRow[] = imported.map((item, idx) => {
      const qty = item.quantity || 1;
      const cost = item.unitCostBeforeDiscount || 100;
      const disc = item.discountPercent || 0;
      const margin = item.profitMarginPercent || 20;
      const unitCostBeforeTax = cost - (cost * disc) / 100;
      const lineTotal = qty * unitCostBeforeTax;
      const unitSellingPriceIncTax = unitCostBeforeTax * (1 + margin / 100);

      return {
        id: 'imp-' + Date.now() + '-' + idx,
        name: item.name || 'Product ' + (idx + 1),
        sku: item.sku || 'SKU' + (idx + 1),
        quantity: qty,
        unitCostBeforeDiscount: cost,
        discountPercent: disc,
        unitCostBeforeTax: Number(unitCostBeforeTax.toFixed(2)),
        lineTotal: Number(lineTotal.toFixed(2)),
        profitMarginPercent: margin,
        unitSellingPriceIncTax: Number(unitSellingPriceIncTax.toFixed(2))
      };
    });

    setItems((prev) => [...prev, ...formattedRows]);
  };

  // Submit form
  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSupplierId) {
      alert('Please select a Supplier!');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one product to the purchase table!');
      return;
    }

    setIsSaving(true);

    const purchaseData = {
      referenceNo,
      supplierId: selectedSupplierId,
      supplierName: selectedSupplier?.name,
      purchaseDate,
      businessLocation,
      payTerm: `${payTermNumber} ${payTermType}`,
      items,
      totalItems,
      netTotalAmount,
      discountType,
      discountAmount,
      calculatedDiscount,
      purchaseTax,
      calculatedTax,
      shippingDetails,
      shippingCharges,
      expenses,
      totalExpenses,
      purchaseTotal,
      paidAmount,
      paymentDue,
      paymentMethod,
      paymentAccount,
      paymentNote,
      status: paymentDue === 0 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Due'
    };

    try {
      const existingPurchases = JSON.parse(localStorage.getItem('pos_purchases') || '[]');
      localStorage.setItem('pos_purchases', JSON.stringify([purchaseData, ...existingPurchases]));
    } catch {
      // Ignored
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/purchases');
      }, 800);
    }, 600);
  };

  return (
    <div className="w-full space-y-6 select-none font-sans pb-20 text-slate-200">
      
      {/* Top Header matching website styling */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
          Add Purchase
        </h1>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
          <CheckCircle2 size={18} />
          <span>Purchase order created successfully! Redirecting to purchases list...</span>
        </div>
      )}

      {/* Top Card: Supplier, Ref, Date, Location, Pay Term, Attach Document */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
          <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        {/* Row 1: Supplier, Reference No, Purchase Date */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          {/* Supplier: * with User Icon and Blue + Button */}
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Supplier:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <User size={15} />
                </span>
                <select
                  value={selectedSupplierId}
                  onChange={handleSupplierChange}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none shadow-inner"
                >
                  <option value="" className="bg-[#0c0827]">Please Select</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id} className="bg-[#0c0827]">
                      {sup.name} ({sup.mobile})
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
              </div>

              {/* Blue '+' Button to Add New Contact */}
              <button
                type="button"
                onClick={() => setIsAddContactOpen(true)}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 cursor-pointer"
                title="Add a new contact"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Address Display underneath Supplier dropdown */}
            <div className="mt-2 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Address: </span>
              <span className="text-indigo-200/90">
                {selectedSupplier ? selectedSupplier.address : 'Please select a supplier to view address'}
              </span>
            </div>
          </div>

          {/* Reference No with Info Icon */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="font-semibold text-slate-300">Reference No:</label>
              <div title="Reference Number / PO Number" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                <Info size={14} />
              </div>
            </div>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="PO-XXXX"
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
            />
          </div>

          {/* Purchase Date: * with Calendar Icon */}
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Purchase Date:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Calendar size={15} />
              </span>
              <input
                type="text"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                placeholder="DD/MM/YYYY HH:MM"
                className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Business Location, Pay term, Attach Document */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
          
          {/* Business Location: * */}
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Business Location:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={businessLocation}
                onChange={(e) => setBusinessLocation(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none shadow-inner pr-9"
              >
                <option value="RANGPUR BIKE PARLOUR (BL0001)" className="bg-[#0c0827]">RANGPUR BIKE PARLOUR (BL0001)</option>
                <option value="DHAKA CENTRAL OUTLET (BL0002)" className="bg-[#0c0827]">DHAKA CENTRAL OUTLET (BL0002)</option>
                <option value="CHITTAGONG BRANCH (BL0003)" className="bg-[#0c0827]">CHITTAGONG BRANCH (BL0003)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Pay term: with Info Icon */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="font-semibold text-slate-300">Pay term:</label>
              <div title="Payment Terms in Days or Months" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                <Info size={14} />
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={payTermNumber}
                onChange={(e) => setPayTermNumber(e.target.value)}
                placeholder="Term"
                className="w-1/2 bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
              />
              <div className="relative w-1/2">
                <select
                  value={payTermType}
                  onChange={(e) => setPayTermType(e.target.value)}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none shadow-inner pr-8"
                >
                  <option value="Please Select" className="bg-[#0c0827]">Please Select</option>
                  <option value="Days" className="bg-[#0c0827]">Days</option>
                  <option value="Months" className="bg-[#0c0827]">Months</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Attach Document with Browse Button & Hint */}
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Attach Document:
            </label>
            <div className="flex border border-white/15 rounded-xl overflow-hidden bg-[#08051e] shadow-inner">
              <span className="flex-1 px-3.5 py-2.5 text-slate-400 truncate text-xs">
                {attachedFile ? attachedFile.name : 'No file chosen'}
              </span>
              <label className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold cursor-pointer transition-colors text-xs flex items-center gap-1 shrink-0">
                <span>Browse</span>
                <input
                  type="file"
                  onChange={(e) => e.target.files && setAttachedFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400 leading-tight space-y-0.5">
              <p>Max File size: 5MB</p>
              <p>Allowed File: pdf, csv, zip, doc, docx, jpeg, jpg, png</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Card: Product Search & Purchase Table */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        {/* Search Bar with Import Products & Add New Product */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Import Products Button */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shrink-0 shadow-md cursor-pointer active:scale-95"
          >
            Import Products
          </button>

          {/* Center Search Input */}
          <div ref={searchRef} className="relative flex-1">
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
                placeholder="Enter Product name / SKU / Scan bar code"
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
                    <div className="text-right">
                      <span className="font-bold text-emerald-400">৳{prod.defaultCost.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 block">Margin: {prod.margin}%</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* + Add new product link/button */}
          <Link
            href="/dashboard/products/create"
            className="inline-flex items-center justify-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs font-semibold py-2.5 px-3.5 rounded-xl hover:bg-white/5 border border-cyan-400/20 transition-all shrink-0"
          >
            <Plus size={16} />
            <span>Add new product</span>
          </Link>
        </div>

        {/* Purchase Items Table with Green Header (#28a745 / emerald gradient) */}
        <div className="overflow-x-auto border border-white/10 rounded-xl scrollbar-thin scrollbar-thumb-white/15">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold whitespace-nowrap select-none shadow-sm">
                <th className="py-3 px-3.5 w-10 text-center">#</th>
                <th className="py-3 px-3.5 min-w-[200px]">Product Name</th>
                <th className="py-3 px-3.5 w-32">Purchase Quantity</th>
                <th className="py-3 px-3.5 w-36">Unit Cost (Before Discount)</th>
                <th className="py-3 px-3.5 w-32">Discount Percent</th>
                <th className="py-3 px-3.5 w-32">Unit Cost (Before Tax)</th>
                <th className="py-3 px-3.5 w-28">Line Total</th>
                <th className="py-3 px-3.5 w-28">Profit Margin %</th>
                <th className="py-3 px-3.5 w-36">Unit Selling Price (Inc. tax)</th>
                <th className="py-3 px-3.5 w-12 text-center">
                  <Trash2 size={16} className="mx-auto" />
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 bg-[#08051e]/60">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-500 font-medium">
                    No products added yet. Use the search bar above to add products.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                    {/* # */}
                    <td className="py-3 px-3.5 text-center text-slate-400 font-semibold">
                      {index + 1}
                    </td>

                    {/* Product Name */}
                    <td className="py-3 px-3.5">
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-slate-400">SKU: {item.sku}</p>
                    </td>

                    {/* Purchase Quantity */}
                    <td className="py-2.5 px-3.5">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleRowChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0c0827] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                      />
                    </td>

                    {/* Unit Cost (Before Discount) */}
                    <td className="py-2.5 px-3.5">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitCostBeforeDiscount}
                        onChange={(e) => handleRowChange(item.id, 'unitCostBeforeDiscount', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0c0827] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                      />
                    </td>

                    {/* Discount Percent */}
                    <td className="py-2.5 px-3.5">
                      <input
                        type="number"
                        step="0.01"
                        value={item.discountPercent}
                        onChange={(e) => handleRowChange(item.id, 'discountPercent', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0c0827] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                      />
                    </td>

                    {/* Unit Cost (Before Tax) */}
                    <td className="py-3 px-3.5 font-bold text-slate-200">
                      {item.unitCostBeforeTax.toFixed(2)}
                    </td>

                    {/* Line Total */}
                    <td className="py-3 px-3.5 font-bold text-cyan-300">
                      {item.lineTotal.toFixed(2)}
                    </td>

                    {/* Profit Margin % */}
                    <td className="py-2.5 px-3.5">
                      <input
                        type="number"
                        step="0.01"
                        value={item.profitMarginPercent}
                        onChange={(e) => handleRowChange(item.id, 'profitMarginPercent', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0c0827] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                      />
                    </td>

                    {/* Unit Selling Price (Inc. tax) */}
                    <td className="py-3 px-3.5 font-bold text-emerald-300">
                      {item.unitSellingPriceIncTax.toFixed(2)}
                    </td>

                    {/* Action Trash */}
                    <td className="py-3 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(item.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete row"
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

        {/* Table Summary */}
        <div className="flex flex-col items-end pt-2 text-xs space-y-1.5 text-slate-300 font-medium">
          <div className="flex justify-between w-64">
            <span className="text-slate-400">Total Items:</span>
            <span className="font-bold text-white">{totalItems.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-64">
            <span className="text-slate-400">Net Total Amount:</span>
            <span className="font-extrabold text-cyan-300 text-sm">৳{netTotalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Discount, Tax & Additional Notes Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        {/* Row 1: Discount Type, Discount Amount, and Right-side Discount (-) display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Discount Type:
            </label>
            <div className="relative">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 appearance-none pr-9 shadow-inner cursor-pointer"
              >
                <option value="None" className="bg-[#0c0827]">None</option>
                <option value="Percentage" className="bg-[#0c0827]">Percentage</option>
                <option value="Fixed" className="bg-[#0c0827]">Fixed</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-5">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Discount Amount:
            </label>
            <input
              type="number"
              min="0"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
              disabled={discountType === 'None'}
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          <div className="md:col-span-3 text-right">
            <span className="font-semibold text-slate-400">Discount: (-) </span>
            <span className="font-bold text-amber-300">{calculatedDiscount.toFixed(2)}</span>
          </div>
        </div>

        {/* Row 2: Purchase Tax and Right-side Purchase Tax (+) display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Purchase Tax:
            </label>
            <div className="relative">
              <select
                value={purchaseTax}
                onChange={(e) => setPurchaseTax(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 appearance-none pr-9 shadow-inner cursor-pointer"
              >
                <option value="None" className="bg-[#0c0827]">None</option>
                <option value="VAT 5%" className="bg-[#0c0827]">VAT 5%</option>
                <option value="GST 10%" className="bg-[#0c0827]">GST 10%</option>
                <option value="Tax 15%" className="bg-[#0c0827]">Tax 15%</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-5"></div>

          <div className="md:col-span-3 text-right">
            <span className="font-semibold text-slate-400">Purchase Tax: (+) </span>
            <span className="font-bold text-emerald-300">{calculatedTax.toFixed(2)}</span>
          </div>
        </div>

        {/* Row 3: Additional Notes */}
        <div className="pt-2">
          <label className="block font-semibold text-slate-300 mb-1.5">
            Additional Notes:
          </label>
          <textarea
            rows={3}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full bg-[#08051e] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner resize-y placeholder-slate-500"
          />
        </div>
      </div>

      {/* Shipping Details & Additional Expenses Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        {/* Shipping details & charges */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-7">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Shipping Details:
            </label>
            <input
              type="text"
              value={shippingDetails}
              onChange={(e) => setShippingDetails(e.target.value)}
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner placeholder-slate-500"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block font-semibold text-slate-300 mb-1.5 text-right md:text-left">
              (+) Additional Shipping charges:
            </label>
            <input
              type="number"
              min="0"
              value={shippingCharges}
              onChange={(e) => setShippingCharges(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner"
            />
          </div>
        </div>

        {/* Centered Button: + Add additional expenses */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShowAdditionalExpenses(!showAdditionalExpenses)}
            className="px-5 py-2.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <span>+ Add additional expenses</span>
            {showAdditionalExpenses ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        {/* Collapsible 4 Rows of Additional Expenses */}
        {showAdditionalExpenses && (
          <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-200 p-4 rounded-2xl bg-[#0c0827]/70 border border-white/10">
            <div className="grid grid-cols-12 gap-3 text-slate-400 font-bold mb-1 px-1">
              <div className="col-span-8">Additional expense name</div>
              <div className="col-span-4">Amount</div>
            </div>

            {expenses.map((exp, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-8">
                  <input
                    type="text"
                    value={exp.name}
                    placeholder={`Expense ${i + 1}`}
                    onChange={(e) => {
                      const updated = [...expenses];
                      updated[i].name = e.target.value;
                      setExpenses(updated);
                    }}
                    className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="number"
                    min="0"
                    value={exp.amount}
                    onChange={(e) => {
                      const updated = [...expenses];
                      updated[i].amount = parseFloat(e.target.value) || 0;
                      setExpenses(updated);
                    }}
                    className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Purchase Total Right display */}
        <div className="text-right pt-3 border-t border-white/10">
          <span className="font-semibold text-slate-400">Purchase Total: </span>
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-200 text-base ml-1">
            ৳{purchaseTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Add payment Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white">Add payment</h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Advance Balance: ৳{advanceBalance.toFixed(2)}
          </p>
        </div>

        {/* Row 1: Amount: *, Paid on: *, Payment Method: * */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Amount: * */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Amount:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <DollarSign size={15} />
              </span>
              <input
                type="number"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner font-semibold"
              />
            </div>
          </div>

          {/* Paid on: * */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Paid on:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Calendar size={15} />
              </span>
              <input
                type="text"
                value={paidOn}
                onChange={(e) => setPaidOn(e.target.value)}
                placeholder="DD/MM/YYYY HH:MM"
                className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner"
              />
            </div>
          </div>

          {/* Payment Method: * */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Payment Method:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <CreditCard size={15} />
              </span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 appearance-none shadow-inner cursor-pointer"
              >
                <option value="Cash" className="bg-[#0c0827]">Cash</option>
                <option value="Card" className="bg-[#0c0827]">Card</option>
                <option value="Bank Transfer" className="bg-[#0c0827]">Bank Transfer</option>
                <option value="Cheque" className="bg-[#0c0827]">Cheque</option>
                <option value="Other" className="bg-[#0c0827]">Other</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 pointer-events-none text-slate-400" />
            </div>
          </div>
        </div>

        {/* Row 2: Payment Account */}
        <div className="max-w-md">
          <label className="block font-semibold text-slate-300 mb-1.5">
            Payment Account:
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Building size={15} />
            </span>
            <select
              value={paymentAccount}
              onChange={(e) => setPaymentAccount(e.target.value)}
              className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 appearance-none shadow-inner cursor-pointer"
            >
              <option value="Cash" className="bg-[#0c0827]">Cash</option>
              <option value="Bank Account (BL0001)" className="bg-[#0c0827]">Bank Account (BL0001)</option>
              <option value="None" className="bg-[#0c0827]">None</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* Row 3: Payment note */}
        <div>
          <label className="block font-semibold text-slate-300 mb-1.5">
            Payment note:
          </label>
          <textarea
            rows={3}
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            className="w-full bg-[#08051e] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner resize-y placeholder-slate-500"
          />
        </div>

        {/* Payment due display */}
        <div className="text-right pt-2">
          <span className="font-semibold text-slate-400">Payment due: </span>
          <span className="font-black text-rose-400 text-sm ml-1">
            ৳{paymentDue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Save Button Centered at Bottom */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleSavePurchase}
          disabled={isSaving}
          className="px-10 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onSave={handleSaveContact}
      />

      {/* Import Products Modal */}
      <ImportPurchaseProductsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportProducts}
      />

    </div>
  );
}
