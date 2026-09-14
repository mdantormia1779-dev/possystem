"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  RotateCcw,
  Landmark,
  Calculator,
  Undo2,
  CreditCard,
  PauseCircle,
  Plus,
  Search,
  Barcode,
  Trash2,
  Minus,
  CheckCircle2,
  FileText,
  Clock,
  Building2,
  ChevronDown,
  User,
  ShoppingBag,
  Layers,
  Sparkles,
  Printer,
  X,
  DollarSign,
  AlertCircle
} from 'lucide-react';

import CalculatorPopup from '../../CalculatorPopup';
import PaymentModal from '../../PaymentModal';
import RecentTransactionsModal from '../../RecentTransactionsModal';
import AddExpenseModal from '../../AddExpenseModal';
import RegisterDetailsModal from '../../RegisterDetailsModal';
import AddCustomerModal from '../../AddCustomerModal';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  unit: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  brand: string;
  image?: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Head Light',
    sku: 'HL-001',
    price: 4800,
    stock: 10,
    unit: 'Pc(s)',
    category: 'Lights & Electrical',
    brand: 'Yamaha',
  },
  {
    id: 'p2',
    name: 'MOBILE STAND',
    sku: 'MS-002',
    price: 350,
    stock: 25,
    unit: 'Pc(s)',
    category: 'Accessories',
    brand: 'Universal',
  },
  {
    id: 'p3',
    name: 'TEST',
    sku: 'TST-003',
    price: 1200,
    stock: 15,
    unit: 'Pc(s)',
    category: 'Accessories',
    brand: 'Custom',
  },
  {
    id: 'p4',
    name: 'WD 40D',
    sku: 'WD-004',
    price: 420,
    stock: 50,
    unit: 'Pc(s)',
    category: 'Lubricants',
    brand: 'WD-40',
  },
  {
    id: 'p5',
    name: 'Yamalube 4T 10W-40',
    sku: 'OIL-101',
    price: 650,
    stock: 35,
    unit: 'Bottle',
    category: 'Lubricants',
    brand: 'Yamaha',
  },
  {
    id: 'p6',
    name: 'Front Brake Pad Set',
    sku: 'BP-012',
    price: 850,
    stock: 18,
    unit: 'Set',
    category: 'Brakes & Engine',
    brand: 'Nissin',
  },
  {
    id: 'p7',
    name: 'Chain Cleaner Spray 400ml',
    sku: 'CC-044',
    price: 380,
    stock: 40,
    unit: 'Pc(s)',
    category: 'Lubricants',
    brand: 'Motul',
  },
  {
    id: 'p8',
    name: 'LED Signal Indicator Pair',
    sku: 'IND-088',
    price: 550,
    stock: 12,
    unit: 'Pair',
    category: 'Lights & Electrical',
    brand: 'Universal',
  },
  {
    id: 'p9',
    name: 'NGK Iridium Spark Plug',
    sku: 'SP-990',
    price: 320,
    stock: 45,
    unit: 'Pc(s)',
    category: 'Brakes & Engine',
    brand: 'NGK',
  },
  {
    id: 'p10',
    name: 'Handle Grip Pro Alloy',
    sku: 'HG-200',
    price: 240,
    stock: 30,
    unit: 'Pair',
    category: 'Accessories',
    brand: 'Universal',
  },
];

function PosEditContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const idParam = (params?.id as string) || '8';
  const invoiceParam = searchParams.get('invoice') || '0003';

  // Customers State
  const [customers, setCustomers] = useState([
    { name: 'Walk-In Customer', contactId: 'CO0001', phone: 'N/A' },
    { name: 'Rabby', contactId: 'CO0002', phone: '01711223344' },
    { name: 'Al-Amin', contactId: 'CO0003', phone: '01899887766' },
    { name: 'General Client', contactId: 'CO0004', phone: '01900112233' },
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState('Walk-In Customer (CO0001)');
  const [payTermValue, setPayTermValue] = useState('');
  const [payTermUnit, setPayTermUnit] = useState('Months');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [showBrandFilter, setShowBrandFilter] = useState(false);

  // Cart State (Initialized with screenshot item: Head Light 4800)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'p1',
      name: 'Head Light',
      sku: 'HL-001',
      price: 4800,
      quantity: 1,
      unit: 'Pc(s)',
      stock: 10,
    },
  ]);

  // Adjustments State
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [orderTaxRate, setOrderTaxRate] = useState<number>(0);
  const [shippingDetails, setShippingDetails] = useState('');
  const [shippingCharges, setShippingCharges] = useState<number>(0);
  const [packingCharges, setPackingCharges] = useState<number>(0);

  // Modals
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRecentTransactionsOpen, setIsRecentTransactionsOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isRegisterDetailsOpen, setIsRegisterDetailsOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [completedReceipt, setCompletedReceipt] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Calculations
  const itemsSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const totalItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountType === 'percentage') {
      return (itemsSubtotal * (discountValue || 0)) / 100;
    }
    return discountValue || 0;
  }, [itemsSubtotal, discountType, discountValue]);

  const taxAmount = useMemo(() => {
    const afterDiscount = Math.max(0, itemsSubtotal - discountAmount);
    return (afterDiscount * (orderTaxRate || 0)) / 100;
  }, [itemsSubtotal, discountAmount, orderTaxRate]);

  const totalPayable = useMemo(() => {
    const total =
      itemsSubtotal -
      discountAmount +
      taxAmount +
      (Number(shippingCharges) || 0) +
      (Number(packingCharges) || 0);
    return Math.max(0, total);
  }, [itemsSubtotal, discountAmount, taxAmount, shippingCharges, packingCharges]);

  // Cart Operations
  const addToCart = (prod: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.id === prod.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: prod.id,
          name: prod.name,
          sku: prod.sku,
          price: prod.price,
          quantity: 1,
          unit: prod.unit,
          stock: prod.stock,
        },
      ];
    });
    showToast(`Added ${prod.name} to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const setItemQuantity = (id: string, qty: number) => {
    const validQty = Math.max(1, isNaN(qty) ? 1 : qty);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: validQty } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to reset and clear the cart?')) {
      setCart([]);
      showToast('Cart cleared');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const matchesBrand =
        selectedBrand === 'All' || p.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [searchQuery, selectedCategory, selectedBrand]);

  // Handle finalize from PaymentModal
  const handleFinalizePayment = (details: any) => {
    setIsPaymentOpen(false);
    setCompletedReceipt({
      invoiceNo: invoiceParam,
      customer: selectedCustomer,
      items: [...cart],
      totalPayable,
      paid: details.totalPaying || totalPayable,
      change: details.changeReturn || 0,
      paymentMethod: details.paymentMethod || 'Multiple',
      date: new Date().toLocaleString(),
    });
    showToast(`Invoice #${invoiceParam} successfully paid and updated!`);
  };

  // Handle Quick Cash Pay
  const handleCashPay = () => {
    if (cart.length === 0) {
      showToast('Please add products to cart first!');
      return;
    }
    setCompletedReceipt({
      invoiceNo: invoiceParam,
      customer: selectedCustomer,
      items: [...cart],
      totalPayable,
      paid: totalPayable,
      change: 0,
      paymentMethod: 'Cash',
      date: new Date().toLocaleString(),
    });
    showToast(`Invoice #${invoiceParam} successfully finalized with Cash!`);
  };

  // Categories list
  const categories = ['All', 'Lights & Electrical', 'Accessories', 'Lubricants', 'Brakes & Engine'];
  const brands = ['All', 'Yamaha', 'Universal', 'WD-40', 'Nissin', 'Motul', 'NGK', 'Custom'];

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] bg-[#07041a] text-slate-100 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative font-sans select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[10000] flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-900 border border-violet-500/40 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* TOP HEADER BAR (matching Image 1) */}
      <header className="px-4 py-2.5 bg-[#0e0a2b] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Location Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Building2 size={14} className="text-violet-400" />
            <span>Location: <strong className="text-white">RANGPUR BIKE PARLOUR</strong></span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Clock size={13} className="text-slate-400" />
            <span>09/14/2026 17:34</span>
          </span>
        </div>

        {/* Right: Quick Action Buttons (matching Image 1 icons) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* 1. Back button */}
          <Link
            href="/dashboard/sell"
            title="Go to Sales List"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>

          {/* 2. Reset / Clear */}
          <button
            type="button"
            onClick={clearCart}
            title="Reset / Clear Cart"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>

          {/* 3. Register Details */}
          <button
            type="button"
            onClick={() => setIsRegisterDetailsOpen(true)}
            title="Register Details"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Landmark size={16} />
          </button>

          {/* 4. Calculator */}
          <button
            type="button"
            onClick={() => setIsCalculatorOpen(true)}
            title="Calculator"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Calculator size={16} />
          </button>

          {/* 5. Sell Return */}
          <Link
            href={`/dashboard/sell/return?invoice=${invoiceParam}`}
            title="Sell Return"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Undo2 size={16} />
          </Link>

          {/* 6. Card Pay */}
          <button
            type="button"
            onClick={() => setIsPaymentOpen(true)}
            title="Card Payment"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <CreditCard size={16} />
          </button>

          {/* 7. Suspend */}
          <button
            type="button"
            onClick={() => showToast('Current sale has been suspended.')}
            title="Suspend Sale"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            <PauseCircle size={16} />
          </button>

          {/* 8. + Add Expense Button */}
          <button
            type="button"
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Expense</span>
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* LEFT COLUMN: Cart, Customer & Adjustments (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col border-r border-white/10 bg-[#0c0827] overflow-y-auto">
          {/* Invoice Header Badge */}
          <div className="px-4 py-2 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-violet-300 tracking-wide">
              Invoice No.: <span className="text-white font-mono text-sm">{invoiceParam}</span>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Editing POS Sale
            </span>
          </div>

          {/* Customer & Pay Term Row */}
          <div className="p-3.5 space-y-2.5 border-b border-white/10 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full bg-[#120e34] border border-white/15 rounded-xl pl-9 pr-8 py-2 text-xs text-white font-medium focus:outline-none focus:border-violet-500 cursor-pointer appearance-none"
                >
                  {customers.map((c) => (
                    <option key={c.contactId} value={`${c.name} (${c.contactId})`}>
                      {c.name} ({c.contactId})
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(true)}
                title="Add Customer"
                className="p-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-300 transition-colors cursor-pointer shrink-0"
              >
                <Plus size={15} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-slate-400 shrink-0">Pay term:</span>
              <input
                type="number"
                placeholder="Months / Days"
                value={payTermValue}
                onChange={(e) => setPayTermValue(e.target.value)}
                className="w-24 bg-[#120e34] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
              <select
                value={payTermUnit}
                onChange={(e) => setPayTermUnit(e.target.value)}
                className="bg-[#120e34] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="Months">Months</option>
                <option value="Days">Days</option>
              </select>
            </div>
          </div>

          {/* Product Search Bar */}
          <div className="p-3.5 border-b border-white/10 flex items-center gap-2">
            <div className="relative flex-1">
              <Barcode size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
              <input
                type="text"
                placeholder="Enter Product name / SKU / Scan bar code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#120e34] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <button
              type="button"
              onClick={() => showToast('Quick Product Creation')}
              className="p-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 transition-colors cursor-pointer shrink-0"
            >
              <Plus size={15} />
            </button>
          </div>

          {/* Autocomplete suggestions if user typed in left search */}
          {searchQuery && (
            <div className="bg-[#120e34] border-b border-white/15 max-h-40 overflow-y-auto divide-y divide-white/5">
              {filteredProducts.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    addToCart(p);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 hover:bg-violet-600/20 flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div>
                    <span className="font-semibold text-white">{p.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2 font-mono">({p.sku})</span>
                  </div>
                  <span className="font-bold text-emerald-400">৳ {p.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* Cart Table (matching Image 1 layout) */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#120e34] text-slate-400 text-[11px] font-semibold sticky top-0 z-10 border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-center">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                  <th className="py-2.5 px-2 text-center w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      <ShoppingBag size={28} className="mx-auto mb-2 text-slate-600" />
                      <span>No products in cart. Select from right catalog.</span>
                    </td>
                  </tr>
                ) : (
                  cart.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Product Name & SKU */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white leading-tight">{item.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          SKU: <span className="font-mono text-slate-300">{item.sku}</span> | Stock: {item.stock} {item.unit}
                        </div>
                      </td>

                      {/* Quantity Controls: [-] [1.00] [+] Pc(s) */}
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Minus size={11} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => setItemQuantity(item.id, parseFloat(e.target.value))}
                            className="w-12 text-center bg-[#0a0620] border border-white/15 rounded-lg py-0.5 text-xs font-bold text-white focus:outline-none focus:border-violet-500"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="block text-[10px] text-center text-slate-500 mt-0.5">{item.unit}</span>
                      </td>

                      {/* Subtotal */}
                      <td className="py-3 px-3 text-right font-bold text-white font-mono">
                        {(item.price * item.quantity).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      {/* Trash Button */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cart Summary & Adjustments Form (matching Image 1) */}
          <div className="p-3.5 bg-[#0e0a2b] border-t border-white/10 space-y-2.5 text-xs">
            {/* Items & Subtotal */}
            <div className="flex items-center justify-between font-bold text-slate-200 pb-2 border-b border-white/5">
              <span>Items: <strong className="text-cyan-400">{totalItemCount.toFixed(2)}</strong></span>
              <span>Total: <strong className="text-white font-mono">{itemsSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
            </div>

            {/* Discount Row */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 text-slate-400 font-medium">Discount Type:</div>
              <div className="col-span-4">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-[#120e34] border border-white/15 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="0.00"
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#120e34] border border-white/15 rounded-lg px-2 py-1 text-xs text-white text-right focus:outline-none"
                />
              </div>
              <div className="col-span-2 text-right text-rose-400 font-mono font-medium">
                (-) {discountAmount.toFixed(2)}
              </div>
            </div>

            {/* Order Tax Row */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 text-slate-400 font-medium">Order Tax:</div>
              <div className="col-span-6">
                <select
                  value={orderTaxRate}
                  onChange={(e) => setOrderTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#120e34] border border-white/15 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value={0}>None</option>
                  <option value={5}>VAT (5%)</option>
                  <option value={10}>GST (10%)</option>
                  <option value={15}>Standard Tax (15%)</option>
                </select>
              </div>
              <div className="col-span-2 text-right text-emerald-400 font-mono font-medium">
                (+) {taxAmount.toFixed(2)}
              </div>
            </div>

            {/* Shipping Row */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 text-slate-400 font-medium">Shipping:</div>
              <div className="col-span-4">
                <input
                  type="text"
                  placeholder="Shipping details"
                  value={shippingDetails}
                  onChange={(e) => setShippingDetails(e.target.value)}
                  className="w-full bg-[#120e34] border border-white/15 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="0.00"
                  value={shippingCharges || ''}
                  onChange={(e) => setShippingCharges(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#120e34] border border-white/15 rounded-lg px-2 py-1 text-xs text-white text-right focus:outline-none"
                />
              </div>
              <div className="col-span-2 text-right text-slate-300 font-mono font-medium">
                (+) {(Number(shippingCharges) || 0).toFixed(2)}
              </div>
            </div>

            {/* Packing Charge Row */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 text-slate-400 font-medium">Packing Charge:</div>
              <div className="col-span-6">
                <input
                  type="number"
                  placeholder="0.00"
                  value={packingCharges || ''}
                  onChange={(e) => setPackingCharges(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#120e34] border border-white/15 rounded-lg px-2 py-1 text-xs text-white text-right focus:outline-none"
                />
              </div>
              <div className="col-span-2 text-right text-slate-300 font-mono font-medium">
                (+) {(Number(packingCharges) || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Catalog Grid & Brand Filter (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#07041a] overflow-hidden">
          {/* Header Controls & Filter Pills (matching Image 1) */}
          <div className="p-3 bg-[#0c0827] border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            {/* Brands Switch Button (matching Image 1) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBrandFilter(!showBrandFilter)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  showBrandFilter
                    ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/40'
                    : 'bg-[#120e34] hover:bg-white/10 text-slate-200 border-white/15'
                }`}
              >
                <Layers size={13} />
                <span>Brands</span>
                <ChevronDown size={13} className={showBrandFilter ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-[360px] sm:max-w-md scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Filter Search */}
            <div className="relative w-40 sm:w-48">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#120e34] border border-white/15 rounded-xl pl-7 pr-2.5 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Brand Pills Bar (if toggled) */}
          {showBrandFilter && (
            <div className="px-3 py-2 bg-[#120e34] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto animate-in slide-in-from-top-2 duration-150">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">Brand:</span>
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBrand(b)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedBrand === b
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {/* Products Grid (matching Image 1 cards: Head Light, MOBILE STAND, TEST, WD 40D) */}
          <div className="flex-1 p-3.5 overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const inCart = cart.find((i) => i.id === product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`group relative flex flex-col justify-between p-3 rounded-2xl bg-[#0e0a2b] border transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] select-none ${
                      inCart
                        ? 'border-violet-500/60 ring-1 ring-violet-500/40 bg-gradient-to-b from-[#160f3d] to-[#0e0a2b]'
                        : 'border-white/10 hover:border-violet-400/40'
                    }`}
                  >
                    {/* Badge if item is already in cart */}
                    {inCart && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-lg border border-violet-400 animate-in zoom-in">
                        {inCart.quantity}
                      </span>
                    )}

                    {/* Product Name */}
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-mono">
                        <span>{product.sku}</span>
                        <span>•</span>
                        <span className="text-slate-500">{product.brand}</span>
                      </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-400 font-mono">
                        ৳ {product.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                        {product.stock} {product.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION & PAY BAR (matching Image 1) */}
      <footer className="px-3 py-2.5 bg-[#0a0620] border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 shrink-0 z-20">
        {/* Left Action Buttons (matching Image 1: Draft, Quotation, Suspend, Credit Sale, Card, Multiple Pay, Cash) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Draft */}
          <button
            type="button"
            onClick={() => showToast('Sale saved as Draft')}
            className="px-3 py-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FileText size={13} />
            <span>Draft</span>
          </button>

          {/* Quotation */}
          <button
            type="button"
            onClick={() => showToast('Quotation generated successfully')}
            className="px-3 py-2 rounded-xl bg-sky-700/60 hover:bg-sky-700 text-sky-200 border border-sky-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FileText size={13} />
            <span>Quotation</span>
          </button>

          {/* Suspend */}
          <button
            type="button"
            onClick={() => showToast('Sale suspended')}
            className="px-3 py-2 rounded-xl bg-amber-700/60 hover:bg-amber-700 text-amber-200 border border-amber-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PauseCircle size={13} />
            <span>Suspend</span>
          </button>

          {/* Credit Sale */}
          <button
            type="button"
            onClick={() => {
              showToast('Sale marked as Credit Sale (Due)');
              handleFinalizePayment({ paymentMethod: 'Credit / Due', totalPaying: 0, changeReturn: 0 });
            }}
            className="px-3 py-2 rounded-xl bg-purple-700/60 hover:bg-purple-700 text-purple-200 border border-purple-600 text-xs font-bold transition-all cursor-pointer"
          >
            <span>Credit Sale</span>
          </button>

          {/* Card */}
          <button
            type="button"
            onClick={() => {
              setIsPaymentOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-rose-700/60 hover:bg-rose-700 text-rose-200 border border-rose-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CreditCard size={13} />
            <span>Card</span>
          </button>

          {/* Multiple Pay (Opens Image 2 Payment Modal) */}
          <button
            type="button"
            onClick={() => setIsPaymentOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <DollarSign size={14} />
            <span>Multiple Pay</span>
          </button>

          {/* Cash Pay (Quick finalize) */}
          <button
            type="button"
            onClick={handleCashPay}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 size={14} />
            <span>Cash</span>
          </button>
        </div>

        {/* Right Section: Total Payable & Recent Transactions (matching Image 1) */}
        <div className="flex items-center gap-3">
          {/* Total Payable Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-xs text-slate-400 font-semibold">Total Payable:</span>
            <span className="text-base sm:text-lg font-black text-emerald-400 font-mono tracking-tight">
              ৳ {totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Recent Transactions Button (Opens Image 3 Recent Transactions Modal) */}
          <button
            type="button"
            onClick={() => setIsRecentTransactionsOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Clock size={14} />
            <span>Recent Transactions</span>
          </button>
        </div>
      </footer>

      {/* SUB-MODALS */}

      {/* 1. Calculator Popup (Image 4) */}
      <CalculatorPopup
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* 2. Payment Modal (Image 2) */}
      <PaymentModal
        isOpen={isPaymentOpen}
        totalPayable={totalPayable}
        totalItems={totalItemCount}
        onClose={() => setIsPaymentOpen(false)}
        onFinalize={handleFinalizePayment}
      />

      {/* 3. Recent Transactions Modal (Image 3) */}
      <RecentTransactionsModal
        isOpen={isRecentTransactionsOpen}
        onClose={() => setIsRecentTransactionsOpen(false)}
        onEdit={(invoice) => {
          setIsRecentTransactionsOpen(false);
          showToast(`Loaded invoice #${invoice}`);
        }}
        onPrint={(invoice) => {
          showToast(`Printing invoice #${invoice}...`);
        }}
        onDelete={(invoice) => {
          showToast(`Transaction #${invoice} deleted`);
        }}
      />

      {/* 4. Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSave={(exp) => {
          showToast(`Expense ৳ ${exp.amount} saved under ${exp.category}`);
        }}
      />

      {/* 5. Register Details Modal */}
      <RegisterDetailsModal
        isOpen={isRegisterDetailsOpen}
        onClose={() => setIsRegisterDetailsOpen(false)}
        onCloseRegister={() => {
          showToast('Register has been closed.');
        }}
      />

      {/* 6. Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onCustomerAdded={(newCust) => {
          setCustomers((prev) => [
            ...prev,
            { name: newCust.name, contactId: newCust.contactId, phone: newCust.phone },
          ]);
          setSelectedCustomer(`${newCust.name} (${newCust.contactId})`);
          showToast(`Customer ${newCust.name} added!`);
        }}
      />

      {/* 7. Receipt Popup after completing sale */}
      {completedReceipt && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#120e34] border border-white/20 rounded-3xl shadow-2xl p-6 text-slate-200 flex flex-col">
            <div className="text-center pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-white">Payment Successful!</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Invoice #{completedReceipt.invoiceNo}</p>
            </div>

            <div className="py-4 space-y-2 text-xs border-b border-white/10">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-white font-medium">{completedReceipt.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="text-white font-medium">{completedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Payable:</span>
                <span className="text-white font-bold font-mono">৳ {completedReceipt.totalPayable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Paid:</span>
                <span className="text-emerald-400 font-bold font-mono">৳ {completedReceipt.paid.toFixed(2)}</span>
              </div>
              {completedReceipt.change > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Change Return:</span>
                  <span className="text-cyan-400 font-bold font-mono">৳ {completedReceipt.change.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-violet-600/30"
              >
                <Printer size={15} />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setCompletedReceipt(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PosEditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] text-slate-400 text-xs">
          Loading POS Edit Terminal...
        </div>
      }
    >
      <PosEditContent />
    </Suspense>
  );
}
