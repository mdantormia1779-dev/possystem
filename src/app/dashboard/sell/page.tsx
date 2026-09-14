"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  ArrowUpDown,
  CreditCard,
  FileText,
  CheckCircle2,
  Printer,
  Download,
  X,
  MoreVertical,
  Edit3,
  Truck,
  RotateCcw,
  ExternalLink,
  Mail,
  Banknote,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import ExportToolbar, { ColumnOption } from '@/app/Components/Dashboard/ExportToolbar';
import { exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';
import DeleteSaleModal, { SaleRecord } from './DeleteSaleModal';
import SellDetailsModal from './SellDetailsModal';
import EditShippingModal from './EditShippingModal';
import ViewPaymentsModal from './ViewPaymentsModal';
import PackingSlipModal from './PackingSlipModal';
import DeliveryNoteModal from './DeliveryNoteModal';
import InvoiceUrlModal from './InvoiceUrlModal';
import NewSaleNotificationModal from './NewSaleNotificationModal';

const initialSales: SaleRecord[] = [
  {
    id: '1',
    invoiceNo: '0003',
    date: '14/09/2026 05:18 PM',
    customerName: 'Walk-In Customer',
    contactNumber: '',
    location: 'RANGPUR BIKE PARLOUR',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    totalAmount: 4800,
    totalPaid: 4800,
    sellDue: 0,
    sellReturnDue: 0,
    shippingStatus: '',
    totalItems: 1.0,
    addedBy: 'Admin',
    items: [{ name: 'Head Light', quantity: 1, unitPrice: 4800, subtotal: 4800 }]
  },
  {
    id: '2',
    invoiceNo: '0002',
    date: '16/08/2026 09:33 PM',
    customerName: 'Walk-In Customer',
    contactNumber: '',
    location: 'RANGPUR BIKE PARLOUR',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    totalAmount: 25000,
    totalPaid: 25000,
    sellDue: 0,
    sellReturnDue: 0,
    shippingStatus: '',
    totalItems: 1.0,
    addedBy: 'Admin',
    items: [{ name: 'MOBILE STAND', quantity: 2, unitPrice: 12500, subtotal: 25000 }]
  },
  {
    id: '3',
    invoiceNo: '0001',
    date: '26/07/2026 08:22 PM',
    customerName: 'Walk-In Customer',
    contactNumber: '',
    location: 'RANGPUR BIKE PARLOUR',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    totalAmount: 160,
    totalPaid: 160,
    sellDue: 0,
    sellReturnDue: 0,
    shippingStatus: '',
    totalItems: 1.0,
    addedBy: 'Admin',
    items: [{ name: 'WD 400', quantity: 1, unitPrice: 160, subtotal: 160 }]
  }
];

export default function SalesPage() {
  const [sales, setSales] = useState<SaleRecord[]>(initialSales);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesCount, setEntriesCount] = useState(25);
  const [showFilters, setShowFilters] = useState(true);
  const [customerFilter, setCustomerFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');

  // Action Menu dropdown state
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals state
  const [deleteModalSale, setDeleteModalSale] = useState<SaleRecord | null>(null);
  const [sellDetailsModalSale, setSellDetailsModalSale] = useState<SaleRecord | null>(null);
  const [editShippingModalSale, setEditShippingModalSale] = useState<SaleRecord | null>(null);
  const [viewPaymentsModalSale, setViewPaymentsModalSale] = useState<SaleRecord | null>(null);
  const [packingSlipModalSale, setPackingSlipModalSale] = useState<SaleRecord | null>(null);
  const [deliveryNoteModalSale, setDeliveryNoteModalSale] = useState<SaleRecord | null>(null);
  const [invoiceUrlModalSale, setInvoiceUrlModalSale] = useState<SaleRecord | null>(null);
  const [notificationModalSale, setNotificationModalSale] = useState<SaleRecord | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Delete sale handler
  const handleDeleteSaleConfirm = (id: string) => {
    const saleToDelete = sales.find((s) => s.id === id);
    const updated = sales.filter((s) => s.id !== id);
    setSales(updated);
    try {
      localStorage.setItem('pos_sales', JSON.stringify(updated));
    } catch {
      // Ignored
    }
    showToast(`Invoice #${saleToDelete?.invoiceNo || id} was deleted successfully.`);
  };

  // Update shipping handler
  const handleSaveShipping = (saleId: string, shippingData: any) => {
    setSales((prev) =>
      prev.map((s) => {
        if (s.id === saleId) {
          return {
            ...s,
            shippingStatus: shippingData.shippingStatus || s.shippingStatus,
            shippingDetails: shippingData.shippingDetails || s.shippingDetails,
          };
        }
        return s;
      })
    );
    showToast('Shipping details updated successfully.');
  };

  // Copy invoice URL handler
  const handleCopyInvoiceUrl = (invoiceNo: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/sell/invoice/${invoiceNo}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast(`Invoice #${invoiceNo} URL copied to clipboard!`);
    }).catch(() => {
      showToast(`Invoice URL: ${url}`);
    });
  };

  // Send new sale notification
  const handleSendSaleNotification = (invoiceNo: string) => {
    showToast(`New sale notification sent for Invoice #${invoiceNo}.`);
  };

  // Column visibility
  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: 'action', label: 'Action', visible: true },
    { id: 'date', label: 'Date', visible: true },
    { id: 'invoiceNo', label: 'Invoice No.', visible: true },
    { id: 'customerName', label: 'Customer name', visible: true },
    { id: 'contactNumber', label: 'Contact Number', visible: true },
    { id: 'location', label: 'Location', visible: true },
    { id: 'paymentStatus', label: 'Payment Status', visible: true },
    { id: 'paymentMethod', label: 'Payment Method', visible: true },
    { id: 'totalAmount', label: 'Total amount', visible: true },
    { id: 'totalPaid', label: 'Total paid', visible: true },
    { id: 'sellDue', label: 'Sell Due', visible: true },
    { id: 'sellReturnDue', label: 'Sell Return Due', visible: true },
    { id: 'shippingStatus', label: 'Shipping Status', visible: true },
    { id: 'totalItems', label: 'Total Items', visible: true },
    { id: 'addedBy', label: 'Added By', visible: true },
    { id: 'sellNote', label: 'Sell note', visible: true },
    { id: 'staffNote', label: 'Staff note', visible: true },
    { id: 'shippingDetails', label: 'Shipping Details', visible: true }
  ]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pos_sales');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSales((prev) => {
            const existingInvoices = new Set(prev.map((s) => s.invoiceNo));
            const newSales = parsed.filter((s: any) => !existingInvoices.has(s.invoiceNo));
            return [...newSales, ...prev];
          });
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  const isColVisible = (id: string) => {
    const col = columns.find((c) => c.id === id);
    return col ? col.visible : true;
  };

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  // Filter sales
  const filteredSales = sales.filter((item) => {
    const matchesSearch =
      item.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCustomer = customerFilter === 'All' || item.customerName === customerFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'All' || item.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesCustomer && matchesPaymentStatus;
  });

  // Calculate totals for summary footer matching Screenshot 1
  const totalAmountSum = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalPaidSum = filteredSales.reduce((acc, s) => acc + s.totalPaid, 0);
  const totalDueSum = filteredSales.reduce((acc, s) => acc + s.sellDue, 0);
  const totalReturnDueSum = filteredSales.reduce((acc, s) => acc + s.sellReturnDue, 0);
  const paidCount = filteredSales.filter((s) => s.paymentStatus === 'Paid').length;
  const cashCount = filteredSales.filter((s) => s.paymentMethod === 'Cash').length;

  // Export handlers
  const exportColumns = [
    { id: 'date', label: 'Date', accessor: (s: SaleRecord) => s.date },
    { id: 'invoiceNo', label: 'Invoice No.', accessor: (s: SaleRecord) => s.invoiceNo },
    { id: 'customerName', label: 'Customer name', accessor: (s: SaleRecord) => s.customerName },
    { id: 'contactNumber', label: 'Contact Number', accessor: (s: SaleRecord) => s.contactNumber || '' },
    { id: 'location', label: 'Location', accessor: (s: SaleRecord) => s.location },
    { id: 'paymentStatus', label: 'Payment Status', accessor: (s: SaleRecord) => s.paymentStatus },
    { id: 'paymentMethod', label: 'Payment Method', accessor: (s: SaleRecord) => s.paymentMethod },
    { id: 'totalAmount', label: 'Total amount', accessor: (s: SaleRecord) => `৳ ${s.totalAmount.toFixed(2)}` },
    { id: 'totalPaid', label: 'Total paid', accessor: (s: SaleRecord) => `৳ ${s.totalPaid.toFixed(2)}` },
    { id: 'sellDue', label: 'Sell Due', accessor: (s: SaleRecord) => `৳ ${s.sellDue.toFixed(2)}` },
    { id: 'sellReturnDue', label: 'Sell Return Due', accessor: (s: SaleRecord) => `৳ ${s.sellReturnDue.toFixed(2)}` },
    { id: 'shippingStatus', label: 'Shipping Status', accessor: (s: SaleRecord) => s.shippingStatus || '' },
    { id: 'totalItems', label: 'Total Items', accessor: (s: SaleRecord) => s.totalItems },
    { id: 'addedBy', label: 'Added By', accessor: (s: SaleRecord) => s.addedBy },
    { id: 'sellNote', label: 'Sell note', accessor: (s: SaleRecord) => s.sellNote || '' },
    { id: 'staffNote', label: 'Staff note', accessor: (s: SaleRecord) => s.staffNote || '' },
    { id: 'shippingDetails', label: 'Shipping Details', accessor: (s: SaleRecord) => s.shippingDetails || '' }
  ].filter((c) => isColVisible(c.id));

  const handleExportCSV = () => exportToCSV('all_sales', exportColumns, filteredSales);
  const handleExportExcel = () => exportToExcel('all_sales', exportColumns, filteredSales);
  const handleExportPDF = () => exportToPDF('All Sales Report', exportColumns, filteredSales);
  const handlePrint = () => printTable('All Sales Report', exportColumns, filteredSales);

  return (
    <div className="space-y-6 select-none font-sans pb-16 text-slate-200">
      
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
          Sales
        </h1>
      </div>

      {/* Filters Accordion matching Screenshot 1 */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-5 py-3.5 bg-[#0c0827]/60 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-violet-400" />
            <span>Filters</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 text-slate-400 ${showFilters ? 'rotate-180' : ''}`}
          />
        </button>

        {showFilters && (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Customer:</label>
              <select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer"
              >
                <option value="All" className="bg-[#0c0827]">All Customers</option>
                {Array.from(new Set(sales.map((s) => s.customerName))).map((c) => (
                  <option key={c} value={c} className="bg-[#0c0827]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Payment Status:</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer"
              >
                <option value="All" className="bg-[#0c0827]">All Statuses</option>
                <option value="Paid" className="bg-[#0c0827]">Paid</option>
                <option value="Partial" className="bg-[#0c0827]">Partial</option>
                <option value="Due" className="bg-[#0c0827]">Due</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Search Keyword:</label>
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Invoice No / Customer..."
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Card: All sales matching Screenshot 1 */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 space-y-5 text-xs text-slate-200">
        
        {/* Header & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            All sales
          </h2>

          {/* + Add Button on right */}
          <Link
            href="/dashboard/sell/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add</span>
          </Link>
        </div>

        {/* Control Bar: Show entries, ExportToolbar, Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Show Entries Dropdown */}
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span>Show</span>
              <div className="relative">
                <select
                  value={entriesCount}
                  onChange={(e) => setEntriesCount(Number(e.target.value))}
                  className="appearance-none bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 pr-7 text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer shadow-xs"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span>entries</span>
            </div>

            {/* Export Toolbar (5 buttons matching Screenshot 1) */}
            <ExportToolbar
              columns={columns}
              onToggleColumn={toggleColumn}
              onExportCSV={handleExportCSV}
              onExportExcel={handleExportExcel}
              onPrint={handlePrint}
              onExportPDF={handleExportPDF}
            />
          </div>

          {/* Search Box */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 px-3.5 py-1.5 text-xs bg-[#0c0827]/80 border border-white/15 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500/50 shadow-xs"
            />
          </div>
        </div>

        {/* Table Section with Horizontal Scroll & exact columns from Screenshot 1 */}
        <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin scrollbar-thumb-white/15">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[1300px]">
            <thead>
              <tr className="bg-white/[0.04] text-indigo-200/90 uppercase tracking-wider text-[11px] font-bold border-b border-white/10 select-none">
                {isColVisible('action') && <th className="py-3 px-4 w-28">Action</th>}
                {isColVisible('date') && <th className="py-3 px-4">Date</th>}
                {isColVisible('invoiceNo') && <th className="py-3 px-4">Invoice No.</th>}
                {isColVisible('customerName') && <th className="py-3 px-4">Customer name</th>}
                {isColVisible('contactNumber') && <th className="py-3 px-4">Contact Number</th>}
                {isColVisible('location') && <th className="py-3 px-4">Location</th>}
                {isColVisible('paymentStatus') && <th className="py-3 px-4">Payment Status</th>}
                {isColVisible('paymentMethod') && <th className="py-3 px-4">Payment Method</th>}
                {isColVisible('totalAmount') && <th className="py-3 px-4 text-right">Total amount</th>}
                {isColVisible('totalPaid') && <th className="py-3 px-4 text-right">Total paid</th>}
                {isColVisible('sellDue') && <th className="py-3 px-4 text-right">Sell Due</th>}
                {isColVisible('sellReturnDue') && <th className="py-3 px-4 text-right">Sell Return Due</th>}
                {isColVisible('shippingStatus') && <th className="py-3 px-4">Shipping Status</th>}
                {isColVisible('totalItems') && <th className="py-3 px-4 text-center">Total Items</th>}
                {isColVisible('addedBy') && <th className="py-3 px-4">Added By</th>}
                {isColVisible('sellNote') && <th className="py-3 px-4">Sell note</th>}
                {isColVisible('staffNote') && <th className="py-3 px-4">Staff note</th>}
                {isColVisible('shippingDetails') && <th className="py-3 px-4">Shipping Details</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 bg-white/[0.01]">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={18} className="py-12 text-center text-slate-400">
                    No sales records found.
                  </td>
                </tr>
              ) : (
                filteredSales.slice(0, entriesCount).map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                    {/* Action Button & Dropdown matching Screenshot 1 */}
                    {isColVisible('action') && (
                      <td className="py-3 px-4 relative">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionId(activeActionId === item.id ? null : item.id);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <span>Actions</span>
                            <ChevronDown size={13} className={activeActionId === item.id ? 'rotate-180 transition-transform' : 'transition-transform'} />
                          </button>

                          {/* Action Dropdown Menu */}
                          {activeActionId === item.id && (
                            <>
                              {/* Backdrop click dismiss */}
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setActiveActionId(null)}
                              />

                              <div className="absolute left-0 mt-1 w-52 rounded-2xl bg-[#0c0827] border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.8)] py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 select-none">
                                
                                {/* 1. View */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSellDetailsModalSale(item);
                                    setActiveActionId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <Eye size={14} className="text-violet-400" />
                                  <span>View</span>
                                </button>

                                {/* 2. Edit */}
                                <Link
                                  href={`/dashboard/pos/${item.id}/edit?invoice=${item.invoiceNo}`}
                                  onClick={() => setActiveActionId(null)}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <Edit3 size={14} className="text-cyan-400" />
                                  <span>Edit</span>
                                </Link>

                                {/* 3. Delete (Opens confirmation modal) */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeleteModalSale(item);
                                    setActiveActionId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-rose-500/25 flex items-center gap-2.5 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                  <span>Delete</span>
                                </button>

                                {/* 4. Edit Shipping */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditShippingModalSale(item);
                                    setActiveActionId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <Truck size={14} className="text-emerald-400" />
                                  <span>Edit Shipping</span>
                                </button>

                                {/* 5. Print Invoice */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSellDetailsModalSale(item);
                                    setActiveActionId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <Printer size={14} className="text-indigo-400" />
                                  <span>Print Invoice</span>
                                </button>

                                {/* 6. Packing Slip */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPackingSlipModalSale(item);
                                    setActiveActionId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <PackageCheck size={14} className="text-amber-400" />
                                  <span>Packing Slip</span>
                                </button>

                                {/* 7. Delivery Note */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeliveryNoteModalSale(item);
                                    setActiveActionId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <FileText size={14} className="text-sky-400" />
                                  <span>Delivery Note</span>
                                </button>

                                {/* Divider Line */}
                                <div className="border-t border-white/10 my-1" />

                                {/* 8. View Payments */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setViewPaymentsModalSale(item);
                                    setActiveActionId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <Banknote size={14} className="text-emerald-400" />
                                  <span>View Payments</span>
                                </button>

                                {/* 9. Sell Return */}
                                <Link
                                  href={`/dashboard/sell/return?invoice=${item.invoiceNo}`}
                                  onClick={() => setActiveActionId(null)}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <RotateCcw size={14} className="text-teal-400" />
                                  <span>Sell Return</span>
                                </Link>

                                {/* 10. Invoice URL */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInvoiceUrlModalSale(item);
                                    setActiveActionId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <ExternalLink size={14} className="text-purple-400" />
                                  <span>Invoice URL</span>
                                </button>

                                {/* 11. New Sale Notification */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNotificationModalSale(item);
                                    setActiveActionId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-violet-600/30 flex items-center gap-2.5 text-slate-200 transition-colors cursor-pointer"
                                >
                                  <Mail size={14} className="text-pink-400" />
                                  <span>New Sale Notification</span>
                                </button>

                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Date */}
                    {isColVisible('date') && (
                      <td className="py-3 px-4 text-slate-300">{item.date}</td>
                    )}

                    {/* Invoice No. */}
                    {isColVisible('invoiceNo') && (
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                        <span>{item.invoiceNo}</span>
                        {item.invoiceNo === '0002' && (
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                            R
                          </span>
                        )}
                      </td>
                    )}

                    {/* Customer name */}
                    {isColVisible('customerName') && (
                      <td className="py-3 px-4 font-semibold text-slate-200">{item.customerName}</td>
                    )}

                    {/* Contact Number */}
                    {isColVisible('contactNumber') && (
                      <td className="py-3 px-4 text-slate-400">{item.contactNumber || '-'}</td>
                    )}

                    {/* Location */}
                    {isColVisible('location') && (
                      <td className="py-3 px-4 text-slate-300">{item.location}</td>
                    )}

                    {/* Payment Status */}
                    {isColVisible('paymentStatus') && (
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.paymentStatus}
                        </span>
                      </td>
                    )}

                    {/* Payment Method */}
                    {isColVisible('paymentMethod') && (
                      <td className="py-3 px-4 text-slate-300">{item.paymentMethod}</td>
                    )}

                    {/* Total amount */}
                    {isColVisible('totalAmount') && (
                      <td className="py-3 px-4 text-right font-bold text-slate-200">
                        ৳ {item.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    )}

                    {/* Total paid */}
                    {isColVisible('totalPaid') && (
                      <td className="py-3 px-4 text-right font-bold text-emerald-300">
                        ৳ {item.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    )}

                    {/* Sell Due */}
                    {isColVisible('sellDue') && (
                      <td className="py-3 px-4 text-right font-bold text-slate-300">
                        ৳ {item.sellDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    )}

                    {/* Sell Return Due */}
                    {isColVisible('sellReturnDue') && (
                      <td className="py-3 px-4 text-right text-cyan-300 font-semibold">
                        ৳ {item.sellReturnDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    )}

                    {/* Shipping Status */}
                    {isColVisible('shippingStatus') && (
                      <td className="py-3 px-4 text-slate-400">{item.shippingStatus || '-'}</td>
                    )}

                    {/* Total Items */}
                    {isColVisible('totalItems') && (
                      <td className="py-3 px-4 text-center text-slate-300">
                        {item.totalItems.toFixed(2)}
                      </td>
                    )}

                    {/* Added By */}
                    {isColVisible('addedBy') && (
                      <td className="py-3 px-4 text-slate-300">{item.addedBy}</td>
                    )}

                    {/* Sell note */}
                    {isColVisible('sellNote') && (
                      <td className="py-3 px-4 text-slate-400">{item.sellNote || '-'}</td>
                    )}

                    {/* Staff note */}
                    {isColVisible('staffNote') && (
                      <td className="py-3 px-4 text-slate-400">{item.staffNote || '-'}</td>
                    )}

                    {/* Shipping Details */}
                    {isColVisible('shippingDetails') && (
                      <td className="py-3 px-4 text-slate-400">{item.shippingDetails || '-'}</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>

            {/* Footer Summary Row matching Screenshot 1 */}
            <tfoot className="border-t-2 border-white/20 bg-white/[0.03] font-bold text-xs">
              <tr>
                <td colSpan={6} className="py-3 px-4 text-right font-extrabold text-white">
                  Total:
                </td>
                <td className="py-3 px-4 text-emerald-300">
                  Paid - {paidCount}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  Cash - {cashCount}
                </td>
                <td className="py-3 px-4 text-right text-white">
                  ৳ {totalAmountSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right text-emerald-300">
                  ৳ {totalPaidSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right text-slate-300">
                  ৳ {totalDueSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right text-cyan-300">
                  ৳ {totalReturnDueSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td colSpan={6}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination & Status matching Screenshot 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-3 border-t border-white/10">
          <div>
            Showing 1 to {Math.min(entriesCount, filteredSales.length)} of {filteredSales.length} entries
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-500 cursor-not-allowed text-xs font-semibold"
            >
              Previous
            </button>
            <span className="w-8 h-8 rounded-lg bg-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
              1
            </span>
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-500 cursor-not-allowed text-xs font-semibold"
            >
              Next
            </button>
          </div>
        </div>

        {/* Footer Subtext */}
        <div className="text-center pt-3 border-t border-white/5 text-[10px] text-slate-500">
          DATABYTE - V6.5 | Copyright © 2026 All rights reserved.
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[120] flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-900/95 to-indigo-900/95 border border-violet-500/40 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-0.5 rounded-lg"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. Delete Sale Modal */}
      <DeleteSaleModal
        isOpen={!!deleteModalSale}
        sale={deleteModalSale}
        onClose={() => setDeleteModalSale(null)}
        onConfirm={handleDeleteSaleConfirm}
      />

      {/* 2. Sell Details Modal (matching screenshot) */}
      <SellDetailsModal
        isOpen={!!sellDetailsModalSale}
        sale={sellDetailsModalSale}
        onClose={() => setSellDetailsModalSale(null)}
        onOpenPackingSlip={(s) => {
          setSellDetailsModalSale(null);
          setPackingSlipModalSale(s);
        }}
      />

      {/* 3. Edit Shipping Modal */}
      <EditShippingModal
        isOpen={!!editShippingModalSale}
        sale={editShippingModalSale}
        onClose={() => setEditShippingModalSale(null)}
        onSave={handleSaveShipping}
      />

      {/* 4. View Payments Modal */}
      <ViewPaymentsModal
        isOpen={!!viewPaymentsModalSale}
        sale={viewPaymentsModalSale}
        onClose={() => setViewPaymentsModalSale(null)}
        onNotify={(msg) => showToast(msg)}
      />

      {/* 5. Packing Slip Modal */}
      <PackingSlipModal
        isOpen={!!packingSlipModalSale}
        sale={packingSlipModalSale}
        onClose={() => setPackingSlipModalSale(null)}
      />

      {/* 6. Delivery Note Modal */}
      <DeliveryNoteModal
        isOpen={!!deliveryNoteModalSale}
        sale={deliveryNoteModalSale}
        onClose={() => setDeliveryNoteModalSale(null)}
      />

      {/* 7. Invoice URL Modal (matching Screenshot 3) */}
      <InvoiceUrlModal
        isOpen={!!invoiceUrlModalSale}
        sale={invoiceUrlModalSale}
        onClose={() => setInvoiceUrlModalSale(null)}
        onView={(s) => {
          setInvoiceUrlModalSale(null);
          setSellDetailsModalSale(s);
        }}
      />

      {/* 8. New Sale Notification Modal (matching Screenshot 4) */}
      <NewSaleNotificationModal
        isOpen={!!notificationModalSale}
        sale={notificationModalSale}
        onClose={() => setNotificationModalSale(null)}
        onSend={(msg) => showToast(msg)}
      />

    </div>
  );
}
