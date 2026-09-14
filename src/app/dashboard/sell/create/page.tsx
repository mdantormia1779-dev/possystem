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
  Sparkles,
  MapPin,
  FolderOpen,
  Printer,
  X
} from 'lucide-react';
import AddCustomerModal, { NewCustomerContactData } from '../AddCustomerModal';

interface SaleItemRow {
  id: string;
  productId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

interface AdditionalExpense {
  name: string;
  amount: number;
}

interface CustomerOption {
  id: string;
  name: string;
  mobile: string;
  billingAddress: string;
  shippingAddress: string;
  payTermNumber?: string;
  payTermType?: string;
}

const defaultCustomers: CustomerOption[] = [
  {
    id: '1',
    name: 'Walk-In Customer',
    mobile: '',
    billingAddress: 'Walk-In Customer',
    shippingAddress: 'Walk-In Customer, '
  },
  {
    id: '2',
    name: 'Md. Al-Amin',
    mobile: '01711223344',
    billingAddress: 'Dhap, Rangpur',
    shippingAddress: 'Dhap, Rangpur, Bangladesh'
  },
  {
    id: '3',
    name: 'Sojib Ahmed',
    mobile: '01899887766',
    billingAddress: 'Modern More, Rangpur',
    shippingAddress: 'Modern More, Rangpur'
  }
];

const productCatalog = [
  { id: '1', name: 'Head Light', sku: '0003', sellingPrice: 25000 },
  { id: '2', name: 'MOBILE STAND', sku: '0002', sellingPrice: 1200 },
  { id: '3', name: 'TEST', sku: '00017896036', sellingPrice: 720 },
  { id: '4', name: 'WD 400', sku: '0001', sellingPrice: 160 },
  { id: '5', name: 'Brake Pad Set', sku: '0005', sellingPrice: 850 },
  { id: '6', name: 'Engine Oil 10W-40', sku: '0006', sellingPrice: 1100 }
];

export default function AddSalePage() {
  const router = useRouter();

  // Modals state
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Top Location & Customer
  const [businessLocation, setBusinessLocation] = useState('RANGPUR BIKE PARLOUR (BL0001)');
  const [customers, setCustomers] = useState<CustomerOption[]>(defaultCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState('1');

  // General fields
  const [payTermNumber, setPayTermNumber] = useState('');
  const [payTermType, setPayTermType] = useState('Please Select');
  const [saleDate, setSaleDate] = useState('');
  const [status, setStatus] = useState('Final');
  const [invoiceScheme, setInvoiceScheme] = useState('Default');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Middle Section: Product Search & Table
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof productCatalog>([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<SaleItemRow[]>([]);

  // Discount & Tax Section
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [orderTax, setOrderTax] = useState('None');

  // Additional Expenses Section
  const [showAdditionalExpenses, setShowAdditionalExpenses] = useState(false);
  const [expenses, setExpenses] = useState<AdditionalExpense[]>([
    { name: '', amount: 0 },
    { name: '', amount: 0 },
    { name: '', amount: 0 },
    { name: '', amount: 0 }
  ]);

  // Payment Section
  const [advanceBalance] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paidOn, setPaidOn] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentAccount, setPaymentAccount] = useState('Cash');
  const [paymentNote, setPaymentNote] = useState('');

  // Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize dates and invoice
  useEffect(() => {
    const now = new Date();
    const formatted =
      now.toLocaleDateString('en-GB') +
      ' ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    setSaleDate(formatted);
    setPaidOn(formatted);
    setInvoiceNo(String(Math.floor(1000 + Math.random() * 9000)));
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

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Add Product to Table
  const handleAddProduct = (prod: (typeof productCatalog)[0]) => {
    const existingIndex = items.findIndex((it) => it.productId === prod.id || it.sku === prod.sku);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].subtotal =
        updated[existingIndex].quantity * updated[existingIndex].unitPrice - updated[existingIndex].discount;
      setItems(updated);
    } else {
      const newItem: SaleItemRow = {
        id: 'sale-row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        productId: prod.id,
        name: prod.name,
        sku: prod.sku,
        quantity: 1,
        unitPrice: prod.sellingPrice,
        discount: 0,
        subtotal: prod.sellingPrice * 1
      };
      setItems((prev) => [...prev, newItem]);
    }
    setSearchQuery('');
    setIsSearchDropdownOpen(false);
  };

  const handleRowChange = (id: string, field: 'quantity' | 'unitPrice' | 'discount', value: number) => {
    setItems((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          const qty = Number(updated.quantity) || 0;
          const price = Number(updated.unitPrice) || 0;
          const disc = Number(updated.discount) || 0;
          updated.subtotal = Math.max(0, qty * price - disc);
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
  const totalItems = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  const subtotalAmount = items.reduce((sum, it) => sum + (Number(it.subtotal) || 0), 0);

  let calculatedDiscount = 0;
  if (discountType === 'Percentage') {
    calculatedDiscount = (subtotalAmount * (Number(discountAmount) || 0)) / 100;
  } else {
    calculatedDiscount = Number(discountAmount) || 0;
  }

  let taxRate = 0;
  if (orderTax === 'VAT 5%') taxRate = 0.05;
  if (orderTax === 'GST 10%') taxRate = 0.10;
  if (orderTax === 'Tax 15%') taxRate = 0.15;
  const taxableBase = Math.max(0, subtotalAmount - calculatedDiscount);
  const calculatedTax = taxableBase * taxRate;

  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const totalPayable = Math.max(
    0,
    subtotalAmount - calculatedDiscount + calculatedTax + totalExpenses
  );

  // Sync paid amount with total payable by default
  useEffect(() => {
    if (paidAmount === 0 && totalPayable > 0) {
      setPaidAmount(Number(totalPayable.toFixed(2)));
    }
  }, [totalPayable]);

  const changeReturn = Math.max(0, (Number(paidAmount) || 0) - totalPayable);
  const balanceDue = Math.max(0, totalPayable - (Number(paidAmount) || 0));

  // Handle saving new customer
  const handleSaveCustomer = (newContact: NewCustomerContactData) => {
    const fullAddress = [
      newContact.addressLine1,
      newContact.city,
      newContact.state,
      newContact.country
    ].filter(Boolean).join(', ') || 'Address on file';

    const newCust: CustomerOption = {
      id: newContact.id || String(Date.now()),
      name: newContact.name,
      mobile: newContact.mobile,
      billingAddress: fullAddress,
      shippingAddress: newContact.shippingAddress || fullAddress,
      payTermNumber: newContact.payTermNumber,
      payTermType: newContact.payTermType
    };

    setCustomers((prev) => [newCust, ...prev]);
    setSelectedCustomerId(newCust.id);
  };

  // Submit Handler
  const handleSaveSale = (printAfter = false) => {
    if (items.length === 0) {
      alert('Please add at least one product to the sale!');
      return;
    }

    setIsSaving(true);

    const saleRecord = {
      id: 'SALE-' + Date.now(),
      invoiceNo: invoiceNo || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: saleDate,
      customerName: selectedCustomer.name,
      contactNumber: selectedCustomer.mobile || 'N/A',
      location: businessLocation,
      paymentStatus: balanceDue === 0 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Due',
      paymentMethod,
      totalAmount: totalPayable,
      totalPaid: Math.min(totalPayable, paidAmount),
      sellDue: balanceDue,
      sellReturnDue: 0,
      shippingStatus: 'Ordered',
      totalItems,
      addedBy: 'Admin',
      sellNote: '',
      staffNote: '',
      shippingDetails: '',
      items
    };

    try {
      const stored = JSON.parse(localStorage.getItem('pos_sales') || '[]');
      localStorage.setItem('pos_sales', JSON.stringify([saleRecord, ...stored]));
    } catch {
      // Ignored
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      if (printAfter) {
        window.print();
      }
      setTimeout(() => {
        router.push('/dashboard/sell');
      }, 800);
    }, 600);
  };

  return (
    <div className="w-full space-y-6 select-none font-sans pb-20 text-slate-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
          Add Sale
        </h1>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
          <CheckCircle2 size={18} />
          <span>Sale registered successfully! Redirecting to All sales...</span>
        </div>
      )}

      {/* Top Bar: Location pin & select dropdown matching Screenshot 2 */}
      <div className="max-w-xs flex items-center gap-2 p-2 rounded-xl bg-[#120e34]/85 border border-white/10 shadow-lg backdrop-blur-xl text-xs">
        <MapPin size={16} className="text-cyan-400 shrink-0 ml-1" />
        <div className="relative flex-1">
          <select
            value={businessLocation}
            onChange={(e) => setBusinessLocation(e.target.value)}
            className="w-full bg-transparent text-white font-semibold focus:outline-none appearance-none pr-6 cursor-pointer"
          >
            <option value="RANGPUR BIKE PARLOUR (BL0001)" className="bg-[#0c0827]">RANGPUR BIKE PARLOUR (BL0001)</option>
            <option value="DHAKA CENTRAL OUTLET (BL0002)" className="bg-[#0c0827]">DHAKA CENTRAL OUTLET (BL0002)</option>
          </select>
          <ChevronDown size={14} className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div title="Business Location" className="text-cyan-400 cursor-pointer mr-1">
          <Info size={14} />
        </div>
      </div>

      {/* Top Card: Customer, Pay Term, Sale Date, Status, Invoice Scheme, Invoice No, Attach Document */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
          <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        {/* Row 1: Customer, Pay term, Sale Date */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          {/* Customer:* with Blue '+' Button */}
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Customer:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <User size={15} />
                </span>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none shadow-inner"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0c0827]">
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
              </div>

              {/* Blue '+' Button to Add New Contact */}
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(true)}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 cursor-pointer"
                title="Add a new contact"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Billing & Shipping Address underneath Customer matching Screenshot 2 */}
            <div className="mt-3 space-y-1 text-[11px] text-slate-400">
              <div>
                <span className="font-semibold text-slate-300">Billing Address: </span>
                <span className="text-indigo-200/90">{selectedCustomer.billingAddress}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-300">Shipping Address: </span>
                <span className="text-indigo-200/90">{selectedCustomer.shippingAddress}</span>
              </div>
            </div>
          </div>

          {/* Pay term: (i) */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="font-semibold text-slate-300">Pay term:</label>
              <div title="Payment Terms" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                <Info size={14} />
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={payTermNumber}
                onChange={(e) => setPayTermNumber(e.target.value)}
                placeholder="Pay term"
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

          {/* Sale Date:* with Calendar Icon */}
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Sale Date:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Calendar size={15} />
              </span>
              <input
                type="text"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                placeholder="DD/MM/YYYY HH:MM"
                className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Status, Invoice scheme, Invoice No, Attach Document */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
          
          {/* Status:* */}
          <div className="md:col-span-3">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Status:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none shadow-inner pr-9"
              >
                <option value="Final" className="bg-[#0c0827]">Final</option>
                <option value="Draft" className="bg-[#0c0827]">Draft</option>
                <option value="Quotation" className="bg-[#0c0827]">Quotation</option>
                <option value="Please Select" className="bg-[#0c0827]">Please Select</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Invoice scheme: */}
          <div className="md:col-span-3">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Invoice scheme:
            </label>
            <div className="relative">
              <select
                value={invoiceScheme}
                onChange={(e) => setInvoiceScheme(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer appearance-none shadow-inner pr-9"
              >
                <option value="Default" className="bg-[#0c0827]">Default</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Invoice No.: */}
          <div className="md:col-span-3">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Invoice No.:
            </label>
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Invoice No."
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
            />
            <p className="text-[10px] text-slate-400 mt-1">Keep blank to auto generate</p>
          </div>

          {/* Attach Document: with Browse.. button */}
          <div className="md:col-span-3">
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
            <div className="mt-1 text-[10px] text-slate-400 leading-tight space-y-0.5">
              <p>Max File size: 5MB</p>
              <p>Allowed File: .pdf, .csv, .zip, .doc, .docx, .jpeg, .jpg, .png</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Card: Products Table & Search Bar underneath matching Screenshot 2 */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        {/* Sale Items Table */}
        <div className="overflow-x-auto border border-white/10 rounded-xl scrollbar-thin scrollbar-thumb-white/15">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/[0.04] text-indigo-200/90 uppercase tracking-wider text-[11px] font-bold border-b border-white/10 select-none">
                <th className="py-3 px-3.5 w-12 text-center">#</th>
                <th className="py-3 px-3.5 min-w-[220px]">Product</th>
                <th className="py-3 px-3.5 w-32">Quantity</th>
                <th className="py-3 px-3.5 w-36">Unit Price</th>
                <th className="py-3 px-3.5 w-32">Discount</th>
                <th className="py-3 px-3.5 w-36">Subtotal</th>
                <th className="py-3 px-3.5 w-12 text-center">
                  <X size={16} className="mx-auto text-slate-400" />
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 bg-[#08051e]/60">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 font-medium">
                    No products added yet. Use the search bar below to add products.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-3.5 text-center text-slate-400 font-semibold">
                      {index + 1}
                    </td>

                    <td className="py-3 px-3.5">
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-slate-400">SKU: {item.sku}</p>
                    </td>

                    <td className="py-2.5 px-3.5">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleRowChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0c0827] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                      />
                    </td>

                    <td className="py-2.5 px-3.5">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleRowChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0c0827] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                      />
                    </td>

                    <td className="py-2.5 px-3.5">
                      <input
                        type="number"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => handleRowChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0c0827] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                      />
                    </td>

                    <td className="py-3 px-3.5 font-bold text-cyan-300">
                      ৳{item.subtotal.toFixed(2)}
                    </td>

                    <td className="py-3 px-3.5 text-center">
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

        {/* Table summary on right matching Screenshot 2 */}
        <div className="flex justify-end gap-6 text-xs text-slate-300 font-semibold pr-2">
          <div>Items: <span className="text-white font-bold">{totalItems.toFixed(2)}</span></div>
          <div>Total: <span className="text-cyan-300 font-bold">৳{subtotalAmount.toFixed(2)}</span></div>
        </div>

        {/* Search Bar Underneath Table matching Screenshot 2 */}
        <div ref={searchRef} className="relative flex items-center gap-2 pt-1">
          <div className="relative flex-1 flex items-center">
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

          <button
            type="button"
            onClick={() => setIsSearchDropdownOpen(true)}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer"
            title="Search"
          >
            <Plus size={18} />
          </button>

          {/* Autocomplete Dropdown */}
          {isSearchDropdownOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-12 top-full mt-2 bg-[#0c0827] border border-white/15 rounded-2xl shadow-2xl z-30 max-h-60 overflow-y-auto divide-y divide-white/10">
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
                  <span className="font-bold text-emerald-400">৳{prod.sellingPrice.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Discount & Order Tax Card matching Screenshot 2 */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        {/* Discount row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div title="Discount Type" className="text-cyan-400 cursor-pointer">
                <Info size={14} />
              </div>
              <label className="font-semibold text-slate-300">
                Discount Type:*
              </label>
            </div>
            <div className="relative">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 appearance-none pr-9 shadow-inner cursor-pointer"
              >
                <option value="Percentage" className="bg-[#0c0827]">Percentage</option>
                <option value="Fixed" className="bg-[#0c0827]">Fixed</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div title="Discount Amount" className="text-cyan-400 cursor-pointer">
                <Info size={14} />
              </div>
              <label className="font-semibold text-slate-300">
                Discount Amount:*
              </label>
            </div>
            <input
              type="number"
              min="0"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 shadow-inner"
            />
          </div>

          <div className="md:col-span-3 text-right">
            <span className="font-semibold text-slate-400">Discount Amount:(-) </span>
            <span className="font-bold text-amber-300">{calculatedDiscount.toFixed(2)}</span>
          </div>
        </div>

        {/* Order Tax row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
          <div className="md:col-span-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div title="Order Tax" className="text-cyan-400 cursor-pointer">
                <Info size={14} />
              </div>
              <label className="font-semibold text-slate-300">
                Order Tax:*
              </label>
            </div>
            <div className="relative">
              <select
                value={orderTax}
                onChange={(e) => setOrderTax(e.target.value)}
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
            <span className="font-semibold text-slate-400">Order Tax:(+) </span>
            <span className="font-bold text-emerald-300">{calculatedTax.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Additional Expenses & Total Payable matching Screenshot 3 */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-4 text-xs text-slate-200">
        
        {/* Centered Button: + Add additional expenses */}
        <div className="flex justify-center">
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

        {/* Total Payable Display on Right */}
        <div className="text-right pt-2 border-t border-white/10">
          <span className="font-semibold text-slate-400">Total Payable: </span>
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-200 text-base ml-1">
            ৳{totalPayable.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Add payment Card matching Screenshot 3 */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white">Add payment</h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Advance Balance: ৳{advanceBalance.toFixed(2)}
          </p>
        </div>

        {/* Row 1: Amount:*, Paid on:*, Payment Method:* */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Amount:* */}
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

          {/* Paid on:* */}
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

          {/* Payment Method:* */}
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

        {/* Change Return & Balance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-white/10 font-bold">
          <div className="text-emerald-400 text-sm">
            Change Return: ৳{changeReturn.toFixed(2)}
          </div>
          <div className="text-rose-400 text-sm">
            Balance: ৳{balanceDue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons matching Screenshot 3 */}
      <div className="flex justify-center items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => handleSaveSale(false)}
          disabled={isSaving}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        <button
          type="button"
          onClick={() => handleSaveSale(true)}
          disabled={isSaving}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          <Printer size={16} />
          <span>Save and print</span>
        </button>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSave={handleSaveCustomer}
      />

    </div>
  );
}
