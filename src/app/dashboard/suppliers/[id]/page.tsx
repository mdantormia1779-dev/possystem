"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Smartphone, 
  Info, 
  Plus, 
  BookOpen, 
  Download, 
  Hourglass, 
  Paperclip, 
  CreditCard, 
  Activity, 
  Calendar, 
  Printer, 
  FileText, 
  ChevronDown, 
  ArrowUpDown, 
  Eye, 
  Edit, 
  Trash2, 
  Tag 
} from 'lucide-react';
import ExportToolbar, { ColumnOption } from '@/app/Components/Dashboard/ExportToolbar';
import { ColumnDef, exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';
import AddDiscountModal from './AddDiscountModal';
import AddNoteModal, { NoteItem } from '@/app/dashboard/users/[id]/AddNoteModal';
import ViewPaymentModal, { PaymentItem } from './ViewPaymentModal';
import EditPaymentModal from './EditPaymentModal';
import DeletePaymentModal from './DeletePaymentModal';

// Sample contacts list to allow switching in top dropdown
const allSuppliersData = [
  {
    id: '1',
    contactId: 'SHAMIM',
    name: 'SHAMIM',
    mobile: '017953859',
    taxNumber: '',
    address: 'RANGPUR, BANGLADESH',
    businessLocation: 'RANGPUR BIKE PARLOUR',
  },
  {
    id: '2',
    contactId: 'Robin',
    name: 'Robin',
    mobile: '564656454656',
    taxNumber: '',
    address: 'DHAKA, BANGLADESH',
    businessLocation: 'RANGPUR BIKE PARLOUR',
  },
  {
    id: '3',
    contactId: 'MOTO WOLF',
    name: 'MOTO WOLF',
    mobile: '017956635',
    taxNumber: '',
    address: 'RANGPUR, BANGLADESH',
    businessLocation: 'RANGPUR BIKE PARLOUR',
  },
  {
    id: '4',
    contactId: 'CO0002',
    name: 'dhaka',
    mobile: '235545656',
    taxNumber: '',
    address: 'DHAKA, BANGLADESH',
    businessLocation: 'RANGPUR BIKE PARLOUR',
  },
];

export default function ViewContactPage() {
  const params = useParams();
  const router = useRouter();
  const supplierId = (params?.id as string) || '1';

  // Find active supplier or default to first
  const currentSupplier =
    allSuppliersData.find((s) => s.id === supplierId || s.contactId === supplierId) ||
    allSuppliersData[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'ledger' | 'purchases' | 'stock' | 'documents' | 'payments' | 'activities'
  >('ledger');

  // Add Discount Modal
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountNote, setDiscountNote] = useState<string | null>(null);

  // Tab 1: Ledger States
  const [ledgerDateRange, setLedgerDateRange] = useState('01/01/2026 - 31/12/2026');
  const [ledgerFormat, setLedgerFormat] = useState<'Format 1' | 'Format 2' | 'Format 3'>('Format 1');
  const [ledgerLocation, setLedgerLocation] = useState('All locations');

  const ledgerData = [
    {
      id: '1',
      date: '26/07/2026 07:55 PM',
      refNo: 'PO2026/0003',
      type: 'Purchase',
      location: 'RANGPUR BIKE PARLOUR',
      paymentStatus: 'Paid',
      debit: '',
      credit: '120.00',
      paymentMethod: '',
      others: '',
    },
    {
      id: '2',
      date: '26/07/2026 07:55 PM',
      refNo: 'PP2026/0003',
      type: 'Payment',
      location: 'RANGPUR BIKE PARLOUR',
      paymentStatus: '',
      debit: '120.00',
      credit: '',
      paymentMethod: 'Cash',
      others: 'Payment For: PO2026/0003',
    },
  ];

  // Tab 2: Purchases State
  const [purchasesDateRange, setPurchasesDateRange] = useState('01/01/2026 - 31/12/2026');
  const [purchasesEntries, setPurchasesEntries] = useState(25);
  const [purchasesSearch, setPurchasesSearch] = useState('');

  const [purchasesColumns, setPurchasesColumns] = useState<ColumnOption[]>([
    { id: 'action', label: 'Action', visible: true },
    { id: 'date', label: 'Date', visible: true },
    { id: 'refNo', label: 'Reference No', visible: true },
    { id: 'location', label: 'Location', visible: true },
    { id: 'supplier', label: 'Supplier', visible: true },
    { id: 'purchaseStatus', label: 'Purchase Status', visible: true },
    { id: 'paymentStatus', label: 'Payment Status', visible: true },
    { id: 'grandTotal', label: 'Grand Total', visible: true },
    { id: 'paymentDue', label: 'Payment due', visible: true },
    { id: 'addedBy', label: 'Added By', visible: true },
  ]);

  const purchasesData = [
    {
      id: '1',
      date: '26/07/2026 07:55 PM',
      refNo: 'PO2026/0003',
      location: 'RANGPUR BIKE PARLOUR',
      supplier: '',
      purchaseStatus: 'Received',
      paymentStatus: 'Paid',
      grandTotal: 120.0,
      paymentDue: 'Purchase: ৳ 0.00',
      addedBy: 'Admin',
    },
  ];

  // Tab 3: Stock Report State
  const [stockLocation, setStockLocation] = useState('All locations');
  const [stockEntries, setStockEntries] = useState(25);
  const [stockSearch, setStockSearch] = useState('');

  const [stockColumns, setStockColumns] = useState<ColumnOption[]>([
    { id: 'product', label: 'Product', visible: true },
    { id: 'sku', label: 'SKU', visible: true },
    { id: 'purchaseQuantity', label: 'Purchase Quantity', visible: true },
    { id: 'totalSold', label: 'Total Sold', visible: true },
    { id: 'unitTransfered', label: 'Total Unit Transfered', visible: true },
    { id: 'totalReturned', label: 'Total returned', visible: true },
    { id: 'currentStock', label: 'Current stock', visible: true },
    { id: 'currentStockValue', label: 'Current Stock Value', visible: true },
  ]);

  const stockData = [
    {
      id: '1',
      product: 'WD 40D (0001)',
      sku: '0001',
      purchaseQuantity: '1.00 Pc(s)',
      totalSold: '1.00 Pc(s)',
      unitTransfered: '0.00 Pc(s)',
      totalReturned: '0.0000',
      currentStock: '0.00 Pc(s)',
      currentStockValue: '৳ 0.00',
    },
  ];

  // Tab 4: Documents & Note State
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [notesEntries, setNotesEntries] = useState(25);
  const [notesSearch, setNotesSearch] = useState('');

  const [notesColumns, setNotesColumns] = useState<ColumnOption[]>([
    { id: 'action', label: 'Action', visible: true },
    { id: 'heading', label: 'Heading', visible: true },
    { id: 'addedBy', label: 'Added By', visible: true },
    { id: 'createdAt', label: 'Created At', visible: true },
    { id: 'updatedAt', label: 'Updated At', visible: true },
  ]);

  // Tab 5: Payments State & Modals
  const [paymentsData, setPaymentsData] = useState<PaymentItem[]>([
    {
      id: '1',
      paidOn: '26/07/2026 07:55 PM',
      refNo: 'PP2026/0003',
      amount: '120.00',
      method: 'Cash',
      paymentFor: 'PO2026/0003 (Purchase)',
      note: '--',
      supplierName: currentSupplier.name || 'SHAMIM',
      supplierMobile: currentSupplier.mobile || '017953859',
      businessName: 'RANGPUR BIKE PARLOUR RANGPUR BIKE PARLOUR',
      businessAddress: 'RANGPUR,RANGPUR,Bangladesh',
      businessMobile: '01957387109',
    },
  ]);

  const [selectedViewPayment, setSelectedViewPayment] = useState<PaymentItem | null>(null);
  const [selectedEditPayment, setSelectedEditPayment] = useState<PaymentItem | null>(null);
  const [selectedDeletePayment, setSelectedDeletePayment] = useState<PaymentItem | null>(null);

  const handleUpdatePayment = (updated: PaymentItem) => {
    setPaymentsData((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleConfirmDeletePayment = (paymentId: string) => {
    setPaymentsData((prev) => prev.filter((p) => p.id !== paymentId));
  };

  // Tab 6: Activities State
  const activitiesData = [
    { id: '1', date: '26/07/2026 07:55 PM', action: 'Purchase Added', by: 'Admin', note: 'Reference PO2026/0003' },
    { id: '2', date: '26/07/2026 07:55 PM', action: 'Payment Added', by: 'Admin', note: 'Reference PP2026/0003 (৳ 120.00)' },
  ];

  // Export handlers for Purchases
  const exportPurchasesColumns: ColumnDef<any>[] = [
    { id: 'date', label: 'Date', accessor: (i) => i.date },
    { id: 'refNo', label: 'Reference No', accessor: (i) => i.refNo },
    { id: 'location', label: 'Location', accessor: (i) => i.location },
    { id: 'purchaseStatus', label: 'Purchase Status', accessor: (i) => i.purchaseStatus },
    { id: 'paymentStatus', label: 'Payment Status', accessor: (i) => i.paymentStatus },
    { id: 'grandTotal', label: 'Grand Total', accessor: (i) => `৳ ${i.grandTotal.toFixed(2)}` },
    { id: 'paymentDue', label: 'Payment due', accessor: (i) => i.paymentDue },
    { id: 'addedBy', label: 'Added By', accessor: (i) => i.addedBy },
  ];

  // Export handlers for Stock
  const exportStockColumns: ColumnDef<any>[] = [
    { id: 'product', label: 'Product', accessor: (i) => i.product },
    { id: 'sku', label: 'SKU', accessor: (i) => i.sku },
    { id: 'purchaseQuantity', label: 'Purchase Quantity', accessor: (i) => i.purchaseQuantity },
    { id: 'totalSold', label: 'Total Sold', accessor: (i) => i.totalSold },
    { id: 'unitTransfered', label: 'Total Unit Transfered', accessor: (i) => i.unitTransfered },
    { id: 'totalReturned', label: 'Total returned', accessor: (i) => i.totalReturned },
    { id: 'currentStock', label: 'Current stock', accessor: (i) => i.currentStock },
    { id: 'currentStockValue', label: 'Current Stock Value', accessor: (i) => i.currentStockValue },
  ];

  const handleAddNote = (noteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt' | 'addedBy'>) => {
    const now = new Date().toLocaleString();
    const newNote: NoteItem = {
      ...noteData,
      id: String(Date.now()),
      addedBy: 'Admin',
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 select-none font-sans pb-10">
      {/* Top Breadcrumb & Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/suppliers"
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
            title="Back to Suppliers"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
            View Contact
          </h1>
        </div>

        {/* Contact Switcher Dropdown matching media_1789376044526.png */}
        <div className="relative min-w-[220px]">
          <select
            value={currentSupplier.id}
            onChange={(e) => router.push(`/dashboard/suppliers/${e.target.value}`)}
            className="w-full appearance-none bg-[#120e34] border border-white/15 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-white focus:outline-none focus:border-violet-500/70 cursor-pointer shadow-lg"
          >
            {allSuppliersData.map((sup) => (
              <option key={sup.id} value={sup.id}>
                - ({sup.name || sup.contactId})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Profile Overview Card matching media_1789376044526.png */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left Details */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <User size={13} />
              <span>Supplier</span>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-violet-400 shrink-0" />
                <span className="font-semibold text-white">Address:</span>
                <span>{currentSupplier.address || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Mobile:</span>
                <span>{currentSupplier.mobile}</span>
              </div>
            </div>
          </div>

          {/* Middle Details */}
          <div className="text-xs text-slate-300 space-y-1 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-cyan-400 shrink-0" />
              <span className="font-semibold text-white">Tax number:</span>
              <span>{currentSupplier.taxNumber || '—'}</span>
            </div>
            {discountNote && (
              <div className="flex items-center gap-2 text-violet-300 font-medium">
                <Tag size={13} />
                <span>{discountNote}</span>
              </div>
            )}
          </div>

          {/* Right Action: Add Discount */}
          <div className="flex items-center justify-start md:justify-end shrink-0">
            <button
              type="button"
              onClick={() => setIsDiscountModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Add Discount</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation & Content Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center overflow-x-auto border-b border-white/10 bg-[#0c0827]/50 scrollbar-none">
          {[
            { id: 'ledger', label: 'Ledger', icon: BookOpen },
            { id: 'purchases', label: 'Purchases', icon: Download },
            { id: 'stock', label: 'Stock Report', icon: Hourglass },
            { id: 'documents', label: 'Documents & Note', icon: Paperclip },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'activities', label: 'Activities', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-5 py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-white/[0.04]'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents Area */}
        <div className="p-4 sm:p-6 lg:p-7 space-y-6">
          {/* ===================== TAB 1: LEDGER ===================== */}
          {activeTab === 'ledger' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Controls: Date Range, Ledger Format, Location, Print/PDF */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs pb-4 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Date Range */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">Date Range:</span>
                    <input
                      type="text"
                      value={ledgerDateRange}
                      onChange={(e) => setLedgerDateRange(e.target.value)}
                      className="bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 text-white w-48 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  {/* Ledger Format Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">Ledger format:</span>
                    <div className="inline-flex rounded-xl border border-white/15 bg-[#0c0827] p-0.5">
                      {(['Format 1', 'Format 2', 'Format 3'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setLedgerFormat(fmt)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            ledgerFormat === fmt
                              ? 'bg-violet-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Business Location */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">Business Location:</span>
                    <select
                      value={ledgerLocation}
                      onChange={(e) => setLedgerLocation(e.target.value)}
                      className="bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                    >
                      <option value="All locations">All locations</option>
                      <option value="RANGPUR BIKE PARLOUR">RANGPUR BIKE PARLOUR</option>
                    </select>
                  </div>
                </div>

                {/* Right Print & PDF Icons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => printTable('Contact Ledger', [
                      { id: 'date', label: 'Date', accessor: (i) => i.date },
                      { id: 'refNo', label: 'Reference No', accessor: (i) => i.refNo },
                      { id: 'type', label: 'Type', accessor: (i) => i.type },
                      { id: 'location', label: 'Location', accessor: (i) => i.location },
                      { id: 'credit', label: 'Credit', accessor: (i) => i.credit ? `৳ ${i.credit}` : '' },
                      { id: 'debit', label: 'Debit', accessor: (i) => i.debit ? `৳ ${i.debit}` : '' },
                    ], ledgerData)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer transition-colors"
                    title="Print Ledger"
                  >
                    <Printer size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exportToPDF('Contact Ledger', [
                      { id: 'date', label: 'Date', accessor: (i) => i.date },
                      { id: 'refNo', label: 'Reference No', accessor: (i) => i.refNo },
                      { id: 'type', label: 'Type', accessor: (i) => i.type },
                      { id: 'location', label: 'Location', accessor: (i) => i.location },
                      { id: 'credit', label: 'Credit', accessor: (i) => i.credit ? `৳ ${i.credit}` : '' },
                      { id: 'debit', label: 'Debit', accessor: (i) => i.debit ? `৳ ${i.debit}` : '' },
                    ], ledgerData)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer transition-colors"
                    title="Export PDF"
                  >
                    <FileText size={15} />
                  </button>
                </div>
              </div>

              {/* Two Info Cards Side by Side matching media_1789376044526.png */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Card: To */}
                <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0c0827]/70">
                  <div className="bg-cyan-900/40 border-b border-white/10 px-4 py-2 font-bold text-cyan-300 text-xs">
                    To:
                  </div>
                  <div className="p-4 text-xs space-y-1 text-slate-300">
                    <p className="font-semibold text-white">Mobile: {currentSupplier.mobile}</p>
                    <p>{currentSupplier.address || 'RANGPUR, BANGLADESH'}</p>
                  </div>
                </div>

                {/* Right Card: Account Summary */}
                <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0c0827]/70">
                  <div className="bg-cyan-900/40 border-b border-white/10 px-4 py-2 font-bold text-cyan-300 text-xs">
                    Account Summary
                  </div>
                  <div className="p-4 text-xs space-y-2 text-slate-300">
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-semibold">
                      <Info size={12} />
                      <span>01/01/2026 To 31/12/2026</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Total Purchase:</span>
                      <span className="font-semibold text-white">৳ 120.00</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Total paid:</span>
                      <span className="font-semibold text-white">৳ 120.00</span>
                    </div>

                    <hr className="border-white/10 my-2" />

                    <p className="font-bold text-slate-200">Overall Summary</p>
                    <div className="flex justify-between py-0.5">
                      <span>Total Purchase:</span>
                      <span className="font-semibold text-white">৳ 120.00</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Total paid:</span>
                      <span className="font-semibold text-white">৳ 120.00</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Balance due:</span>
                      <span className="font-bold text-emerald-400">৳ 0.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ledger Table */}
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 italic">
                  Showing all invoices and payments between 01/01/2026 and 31/12/2026
                </p>
                <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-white/[0.04] text-indigo-200/90 uppercase text-[11px] font-bold border-b border-white/10">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Reference No</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Payment Status</th>
                        <th className="py-3 px-4">Debit</th>
                        <th className="py-3 px-4">Credit</th>
                        <th className="py-3 px-4">Payment Method</th>
                        <th className="py-3 px-4">Others</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-slate-300">
                      {ledgerData.map((row) => (
                        <tr key={row.id} className="hover:bg-white/[0.04] transition-colors">
                          <td className="py-3 px-4 text-white font-medium">{row.date}</td>
                          <td className="py-3 px-4 font-mono text-cyan-300">{row.refNo}</td>
                          <td className="py-3 px-4">{row.type}</td>
                          <td className="py-3 px-4">{row.location}</td>
                          <td className="py-3 px-4">
                            {row.paymentStatus ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {row.paymentStatus}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-200">
                            {row.debit ? `৳ ${row.debit}` : '—'}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-200">
                            {row.credit ? `৳ ${row.credit}` : '—'}
                          </td>
                          <td className="py-3 px-4">{row.paymentMethod || '—'}</td>
                          <td className="py-3 px-4 text-slate-400">{row.others || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: PURCHASES ===================== */}
          {activeTab === 'purchases' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Date range filter */}
              <div className="flex items-center gap-2 text-xs pb-3 border-b border-white/10">
                <span className="font-semibold text-slate-300">Date Range:</span>
                <input
                  type="text"
                  value={purchasesDateRange}
                  onChange={(e) => setPurchasesDateRange(e.target.value)}
                  className="bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 text-white w-52 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>Show</span>
                    <select
                      value={purchasesEntries}
                      onChange={(e) => setPurchasesEntries(Number(e.target.value))}
                      className="bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <ExportToolbar
                    columns={purchasesColumns}
                    onToggleColumn={(id) =>
                      setPurchasesColumns((p) =>
                        p.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
                      )
                    }
                    onExportCSV={() => exportToCSV('purchases', exportPurchasesColumns, purchasesData)}
                    onExportExcel={() => exportToExcel('purchases', exportPurchasesColumns, purchasesData)}
                    onPrint={() => printTable('Purchases List', exportPurchasesColumns, purchasesData)}
                    onExportPDF={() => exportToPDF('Purchases List', exportPurchasesColumns, purchasesData)}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Search ..."
                  value={purchasesSearch}
                  onChange={(e) => setPurchasesSearch(e.target.value)}
                  className="w-full sm:w-56 bg-[#0c0827] border border-white/15 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder:text-slate-500"
                />
              </div>

              {/* Purchases Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[900px]">
                  <thead>
                    <tr className="bg-white/[0.04] text-indigo-200/90 uppercase text-[11px] font-bold border-b border-white/10">
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Reference No</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Supplier</th>
                      <th className="py-3 px-4">Purchase Status</th>
                      <th className="py-3 px-4">Payment Status</th>
                      <th className="py-3 px-4">Grand Total</th>
                      <th className="py-3 px-4">Payment due</th>
                      <th className="py-3 px-4">Added By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-slate-300">
                    {purchasesData.map((row) => (
                      <tr key={row.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-xs font-semibold cursor-pointer"
                          >
                            <span>Actions</span>
                            <ChevronDown size={13} />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-white font-medium">{row.date}</td>
                        <td className="py-3 px-4 font-mono text-cyan-300">{row.refNo}</td>
                        <td className="py-3 px-4">{row.location}</td>
                        <td className="py-3 px-4">{row.supplier || '—'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {row.purchaseStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {row.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">৳ {row.grandTotal.toFixed(2)}</td>
                        <td className="py-3 px-4 text-slate-300">{row.paymentDue}</td>
                        <td className="py-3 px-4 text-slate-300">{row.addedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/[0.06] font-bold border-t-2 border-white/10 text-xs">
                      <td colSpan={6} className="py-3 px-4 text-center text-slate-200">Total:</td>
                      <td className="py-3 px-4 text-emerald-400">Paid - 1</td>
                      <td className="py-3 px-4 text-white">৳ 120.00</td>
                      <td className="py-3 px-4 text-slate-300">Purchase Due - ৳ 0.00 | Return - ৳ 0.00</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                <span>Showing 1 to 1 of 1 entries</span>
                <div className="inline-flex items-center gap-1.5">
                  <button type="button" disabled className="px-3 py-1 rounded-xl bg-white/5 opacity-50 cursor-not-allowed">Previous</button>
                  <span className="w-7 h-7 rounded-xl bg-violet-600 text-white font-bold flex items-center justify-center">1</span>
                  <button type="button" disabled className="px-3 py-1 rounded-xl bg-white/5 opacity-50 cursor-not-allowed">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: STOCK REPORT ===================== */}
          {activeTab === 'stock' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-xs pb-3 border-b border-white/10">
                <span className="font-semibold text-slate-300">Business Location:</span>
                <select
                  value={stockLocation}
                  onChange={(e) => setStockLocation(e.target.value)}
                  className="bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 text-white focus:outline-none cursor-pointer"
                >
                  <option value="All locations">All locations</option>
                  <option value="RANGPUR BIKE PARLOUR">RANGPUR BIKE PARLOUR</option>
                </select>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>Show</span>
                    <select
                      value={stockEntries}
                      onChange={(e) => setStockEntries(Number(e.target.value))}
                      className="bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <ExportToolbar
                    columns={stockColumns}
                    onToggleColumn={(id) =>
                      setStockColumns((p) =>
                        p.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
                      )
                    }
                    onExportCSV={() => exportToCSV('stock_report', exportStockColumns, stockData)}
                    onExportExcel={() => exportToExcel('stock_report', exportStockColumns, stockData)}
                    onPrint={() => printTable('Stock Report', exportStockColumns, stockData)}
                    onExportPDF={() => exportToPDF('Stock Report', exportStockColumns, stockData)}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Search ..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="w-full sm:w-56 bg-[#0c0827] border border-white/15 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder:text-slate-500"
                />
              </div>

              {/* Stock Table matching media_1789376077234.png */}
              <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[850px]">
                  <thead>
                    <tr className="bg-white/[0.04] text-indigo-200/90 uppercase text-[11px] font-bold border-b border-white/10">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Purchase Quantity</th>
                      <th className="py-3 px-4">Total Sold</th>
                      <th className="py-3 px-4">Total Unit Transfered</th>
                      <th className="py-3 px-4">Total returned</th>
                      <th className="py-3 px-4">Current stock</th>
                      <th className="py-3 px-4">Current Stock Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-slate-300">
                    {stockData.map((row) => (
                      <tr key={row.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{row.product}</td>
                        <td className="py-3 px-4 font-mono text-cyan-300">{row.sku}</td>
                        <td className="py-3 px-4">{row.purchaseQuantity}</td>
                        <td className="py-3 px-4">{row.totalSold}</td>
                        <td className="py-3 px-4">{row.unitTransfered}</td>
                        <td className="py-3 px-4">{row.totalReturned}</td>
                        <td className="py-3 px-4">{row.currentStock}</td>
                        <td className="py-3 px-4 font-bold text-white">{row.currentStockValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                <span>Showing 1 to 1 of 1 entries</span>
                <div className="inline-flex items-center gap-1.5">
                  <button type="button" disabled className="px-3 py-1 rounded-xl bg-white/5 opacity-50 cursor-not-allowed">Previous</button>
                  <span className="w-7 h-7 rounded-xl bg-violet-600 text-white font-bold flex items-center justify-center">1</span>
                  <button type="button" disabled className="px-3 py-1 rounded-xl bg-white/5 opacity-50 cursor-not-allowed">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: DOCUMENTS & NOTE ===================== */}
          {activeTab === 'documents' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>Show</span>
                    <select
                      value={notesEntries}
                      onChange={(e) => setNotesEntries(Number(e.target.value))}
                      className="bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <ExportToolbar
                    columns={notesColumns}
                    onToggleColumn={(id) =>
                      setNotesColumns((p) =>
                        p.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
                      )
                    }
                    onExportCSV={() => exportToCSV('notes', [
                      { id: 'heading', label: 'Heading', accessor: (i) => i.heading },
                      { id: 'addedBy', label: 'Added By', accessor: (i) => i.addedBy },
                      { id: 'createdAt', label: 'Created At', accessor: (i) => i.createdAt },
                    ], notes)}
                    onExportExcel={() => exportToExcel('notes', [
                      { id: 'heading', label: 'Heading', accessor: (i) => i.heading },
                      { id: 'addedBy', label: 'Added By', accessor: (i) => i.addedBy },
                      { id: 'createdAt', label: 'Created At', accessor: (i) => i.createdAt },
                    ], notes)}
                    onPrint={() => printTable('Documents & Notes', [
                      { id: 'heading', label: 'Heading', accessor: (i) => i.heading },
                      { id: 'addedBy', label: 'Added By', accessor: (i) => i.addedBy },
                      { id: 'createdAt', label: 'Created At', accessor: (i) => i.createdAt },
                    ], notes)}
                    onExportPDF={() => exportToPDF('Documents & Notes', [
                      { id: 'heading', label: 'Heading', accessor: (i) => i.heading },
                      { id: 'addedBy', label: 'Added By', accessor: (i) => i.addedBy },
                      { id: 'createdAt', label: 'Created At', accessor: (i) => i.createdAt },
                    ], notes)}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search ..."
                    value={notesSearch}
                    onChange={(e) => setNotesSearch(e.target.value)}
                    className="w-full sm:w-56 bg-[#0c0827] border border-white/15 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    <span>Add</span>
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Notes Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-white/[0.04] text-indigo-200/90 uppercase text-[11px] font-bold border-b border-white/10">
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Heading</th>
                      <th className="py-3 px-4">Added By</th>
                      <th className="py-3 px-4">Created At</th>
                      <th className="py-3 px-4">Updated At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-slate-300">
                    {notes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                          No data available in table
                        </td>
                      </tr>
                    ) : (
                      notes.map((note) => (
                        <tr key={note.id} className="hover:bg-white/[0.04] transition-colors">
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-rose-400 hover:text-rose-300 cursor-pointer p-1"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">{note.heading}</td>
                          <td className="py-3 px-4">{note.addedBy}</td>
                          <td className="py-3 px-4">{note.createdAt}</td>
                          <td className="py-3 px-4">{note.updatedAt}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                <span>Showing {notes.length} of {notes.length} entries</span>
                <div className="inline-flex items-center gap-1.5">
                  <button type="button" disabled className="px-3 py-1 rounded-xl bg-white/5 opacity-50 cursor-not-allowed">Previous</button>
                  <button type="button" disabled className="px-3 py-1 rounded-xl bg-white/5 opacity-50 cursor-not-allowed">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: PAYMENTS ===================== */}
          {activeTab === 'payments' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[700px]">
                  <thead>
                    <tr className="bg-white/[0.04] text-indigo-200/90 uppercase text-[11px] font-bold border-b border-white/10">
                      <th className="py-3 px-4">Paid on</th>
                      <th className="py-3 px-4">Reference No</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Payment For</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-slate-300">
                    {paymentsData.map((row) => (
                      <tr key={row.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-4 text-white font-medium">{row.paidOn}</td>
                        <td className="py-3 px-4 font-mono text-cyan-300">{row.refNo}</td>
                        <td className="py-3 px-4 font-bold text-white">{row.amount}</td>
                        <td className="py-3 px-4">{row.method}</td>
                        <td className="py-3 px-4 text-cyan-400">{row.paymentFor}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedViewPayment(row)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-violet-500/40 text-violet-300 hover:bg-violet-500/20 text-xs font-semibold cursor-pointer transition-colors"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedEditPayment(row)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold cursor-pointer transition-colors"
                            >
                              <Edit size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedDeletePayment(row)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold cursor-pointer transition-colors"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== TAB 6: ACTIVITIES ===================== */}
          {activeTab === 'activities' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-white/[0.04] text-indigo-200/90 uppercase text-[11px] font-bold border-b border-white/10">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">By</th>
                      <th className="py-3 px-4">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-slate-300">
                    {activitiesData.map((act) => (
                      <tr key={act.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-4 text-white font-medium">{act.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {act.action}
                          </span>
                        </td>
                        <td className="py-3 px-4">{act.by}</td>
                        <td className="py-3 px-4 text-slate-400">{act.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-[11px] text-slate-500 pt-2 text-center sm:text-left">
        DATABYTE - V6.5 | Copyright © 2026 All rights reserved.
      </div>

      {/* Modals */}
      <AddDiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        onSaveDiscount={(disc) => {
          setDiscountNote(
            `Discount: ${disc.type === 'percentage' ? `${disc.amount}%` : `৳ ${disc.amount}`}${
              disc.note ? ` (${disc.note})` : ''
            }`
          );
        }}
      />

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleAddNote}
      />

      <ViewPaymentModal
        isOpen={Boolean(selectedViewPayment)}
        onClose={() => setSelectedViewPayment(null)}
        payment={selectedViewPayment}
      />

      <EditPaymentModal
        isOpen={Boolean(selectedEditPayment)}
        onClose={() => setSelectedEditPayment(null)}
        payment={selectedEditPayment}
        onUpdatePayment={handleUpdatePayment}
      />

      <DeletePaymentModal
        isOpen={Boolean(selectedDeletePayment)}
        onClose={() => setSelectedDeletePayment(null)}
        payment={selectedDeletePayment}
        onConfirmDelete={handleConfirmDeletePayment}
      />
    </div>
  );
}
