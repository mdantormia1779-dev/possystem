"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Printer,
  Edit,
  Trash2,
  Tag,
  CreditCard,
  RotateCcw,
  RefreshCw,
  Mail,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import ExportToolbar, { ColumnOption } from '@/app/Components/Dashboard/ExportToolbar';
import { ColumnDef, exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';
import PurchaseDetailsModal, { PurchaseDetailsRecord } from './PurchaseDetailsModal';
import PurchasePaymentsModal from './PurchasePaymentsModal';
import UpdatePurchaseStatusModal from './UpdatePurchaseStatusModal';

// Mock initial purchases matching user screenshot
const initialMockPurchases: PurchaseDetailsRecord[] = [
  {
    id: 'PO-2026-0005',
    referenceNo: 'PO2026/0005',
    supplierName: 'SHAMIM',
    supplierMobile: '564656454656',
    purchaseDate: '16/08/2026 09:28 PM',
    businessName: 'RANGPUR BIKE PARLOUR',
    businessLocation: 'RANGPUR BIKE PARLOUR',
    businessAddress: 'RANGPUR,RANGPUR,Bangladesh',
    businessMobile: '01957387109',
    status: 'Received',
    paymentStatus: 'Paid',
    grandTotal: 5000,
    paidAmount: 5000,
    paymentDue: 0,
    paymentMethod: 'Cash',
    addedBy: 'Admin',
    shippingCharges: 0,
    calculatedDiscount: 0,
    calculatedTax: 0,
    additionalNotes: '--',
    shippingDetails: '--',
    items: [
      {
        name: 'Head Light',
        sku: '0003',
        quantity: 1,
        unit: 'Pieces',
        unitCostBeforeDiscount: 5000,
        discountPercent: 0,
        unitCostBeforeTax: 5000,
        subtotalBeforeTax: 5000,
        tax: 0,
        unitCostPriceAfterTax: 5000,
        lineTotal: 5000
      }
    ],
    payments: [
      {
        date: '16/08/2026',
        referenceNo: 'PP2026/0005',
        amount: 5000,
        paymentMode: 'Cash',
        paymentNote: '--'
      }
    ],
    activities: [
      {
        date: '16/08/2026 03:29 PM',
        action: 'Added',
        by: 'Admin',
        status: 'Received',
        total: 5000,
        paymentStatus: 'Due'
      }
    ]
  },
  {
    id: 'PO-2026-0004',
    referenceNo: 'PO2026/0004',
    supplierName: 'JAMAL TRADERS',
    supplierMobile: '01812345678',
    purchaseDate: '16/08/2026 09:20 PM',
    businessName: 'RANGPUR BIKE PARLOUR',
    businessLocation: 'RANGPUR BIKE PARLOUR',
    businessAddress: 'RANGPUR,RANGPUR,Bangladesh',
    businessMobile: '01957387109',
    status: 'Received',
    paymentStatus: 'Paid',
    grandTotal: 33000,
    paidAmount: 33000,
    paymentDue: 0,
    paymentMethod: 'Bank Transfer',
    addedBy: 'Admin',
    shippingCharges: 0,
    calculatedDiscount: 0,
    calculatedTax: 0,
    additionalNotes: '--',
    shippingDetails: '--',
    items: [
      {
        name: 'Engine Oil 10W-40',
        sku: '0006',
        quantity: 30,
        unit: 'Pieces',
        unitCostBeforeDiscount: 850,
        discountPercent: 0,
        unitCostBeforeTax: 850,
        subtotalBeforeTax: 25500,
        tax: 0,
        unitCostPriceAfterTax: 850,
        lineTotal: 25500
      },
      {
        name: 'Brake Pad Set',
        sku: '0005',
        quantity: 10,
        unit: 'Pieces',
        unitCostBeforeDiscount: 750,
        discountPercent: 0,
        unitCostBeforeTax: 750,
        subtotalBeforeTax: 7500,
        tax: 0,
        unitCostPriceAfterTax: 750,
        lineTotal: 7500
      }
    ],
    payments: [
      {
        date: '16/08/2026',
        referenceNo: 'PP2026/0004',
        amount: 33000,
        paymentMode: 'Bank Transfer',
        paymentNote: '--'
      }
    ],
    activities: [
      {
        date: '16/08/2026 03:20 PM',
        action: 'Added',
        by: 'Admin',
        status: 'Received',
        total: 33000,
        paymentStatus: 'Paid'
      }
    ]
  },
  {
    id: 'PO-2026-0003',
    referenceNo: 'PO2026/0003',
    supplierName: 'KABIR MOTORS',
    supplierMobile: '01987654321',
    purchaseDate: '16/08/2026 09:15 PM',
    businessName: 'RANGPUR BIKE PARLOUR',
    businessLocation: 'RANGPUR BIKE PARLOUR',
    businessAddress: 'RANGPUR,RANGPUR,Bangladesh',
    businessMobile: '01957387109',
    status: 'Received',
    paymentStatus: 'Paid',
    grandTotal: 120,
    paidAmount: 120,
    paymentDue: 0,
    paymentMethod: 'Cash',
    addedBy: 'Admin',
    shippingCharges: 0,
    calculatedDiscount: 0,
    calculatedTax: 0,
    additionalNotes: '--',
    shippingDetails: '--',
    items: [
      {
        name: 'WD 400',
        sku: '0001',
        quantity: 1,
        unit: 'Pieces',
        unitCostBeforeDiscount: 120,
        discountPercent: 0,
        unitCostBeforeTax: 120,
        subtotalBeforeTax: 120,
        tax: 0,
        unitCostPriceAfterTax: 120,
        lineTotal: 120
      }
    ],
    payments: [
      {
        date: '16/08/2026',
        referenceNo: 'PP2026/0003',
        amount: 120,
        paymentMode: 'Cash',
        paymentNote: '--'
      }
    ],
    activities: [
      {
        date: '16/08/2026 03:15 PM',
        action: 'Added',
        by: 'Admin',
        status: 'Received',
        total: 120,
        paymentStatus: 'Paid'
      }
    ]
  }
];

export default function PurchasesListPage() {
  const router = useRouter();

  // Main data state
  const [purchases, setPurchases] = useState<PurchaseDetailsRecord[]>(initialMockPurchases);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Actions dropdown active row
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Modals state
  const [viewingPurchase, setViewingPurchase] = useState<PurchaseDetailsRecord | null>(null);
  const [paymentsPurchase, setPaymentsPurchase] = useState<PurchaseDetailsRecord | null>(null);
  const [statusPurchase, setStatusPurchase] = useState<PurchaseDetailsRecord | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Columns for export and visibility
  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: 'date', label: 'Date', visible: true },
    { id: 'referenceNo', label: 'Reference No', visible: true },
    { id: 'location', label: 'Location', visible: true },
    { id: 'supplier', label: 'Supplier', visible: true },
    { id: 'status', label: 'Purchase Status', visible: true },
    { id: 'paymentStatus', label: 'Payment Status', visible: true },
    { id: 'grandTotal', label: 'Grand Total', visible: true },
    { id: 'paymentDue', label: 'Payment due', visible: true },
    { id: 'addedBy', label: 'Added By', visible: true }
  ]);

  // Load newly created purchases from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pos_purchases');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formattedFromStorage: PurchaseDetailsRecord[] = parsed.map((item: any, idx: number) => ({
            id: item.id || 'stored-' + idx,
            referenceNo: item.referenceNo || `PO-${idx}`,
            supplierName: item.supplierName || 'Selected Supplier',
            supplierMobile: item.supplierMobile || '017953859',
            purchaseDate: item.purchaseDate || new Date().toLocaleDateString('en-GB'),
            businessName: item.businessName || 'RANGPUR BIKE PARLOUR',
            businessLocation: item.businessLocation || 'RANGPUR BIKE PARLOUR',
            businessAddress: 'RANGPUR,RANGPUR,Bangladesh',
            businessMobile: '01957387109',
            status: item.status || 'Received',
            paymentStatus: item.paymentDue === 0 ? 'Paid' : item.paidAmount > 0 ? 'Partial' : 'Due',
            grandTotal: item.purchaseTotal || item.grandTotal || 0,
            paidAmount: item.paidAmount || 0,
            paymentDue: item.paymentDue !== undefined ? item.paymentDue : 0,
            paymentMethod: item.paymentMethod || 'Cash',
            items: item.items || [],
            shippingCharges: item.shippingCharges || 0,
            shippingDetails: item.shippingDetails || '--',
            additionalNotes: item.additionalNotes || '--',
            calculatedTax: item.calculatedTax || 0,
            calculatedDiscount: item.calculatedDiscount || 0,
            addedBy: item.addedBy || 'Admin',
            payments: item.payments || (item.paidAmount > 0 ? [
              {
                date: item.purchaseDate ? item.purchaseDate.split(' ')[0] : new Date().toLocaleDateString('en-GB'),
                referenceNo: (item.referenceNo || `PO-${idx}`).replace('PO', 'PP'),
                amount: item.paidAmount,
                paymentMode: item.paymentMethod || 'Cash',
                paymentNote: '--'
              }
            ] : []),
            activities: item.activities || [
              {
                date: item.purchaseDate || new Date().toLocaleString('en-GB'),
                action: 'Added',
                by: 'Admin',
                status: item.status || 'Received',
                total: item.purchaseTotal || item.grandTotal || 0,
                paymentStatus: item.paymentDue === 0 ? 'Paid' : 'Due'
              }
            ]
          }));

          setPurchases((prev) => {
            const existingRefs = new Set(prev.map((p) => p.referenceNo));
            const newOnes = formattedFromStorage.filter((p) => !existingRefs.has(p.referenceNo));
            return [...newOnes, ...prev];
          });
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-menu-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Action Handlers
  const handleView = (record: PurchaseDetailsRecord) => {
    setOpenDropdownId(null);
    setViewingPurchase(record);
  };

  const handlePrint = (record: PurchaseDetailsRecord) => {
    setOpenDropdownId(null);
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Purchase Order - #${record.referenceNo}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 25px; color: #212529; font-size: 12px; }
              .title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th { background: #20c997; color: white; padding: 8px; border: 1px solid #1ba87e; text-align: left; }
              td { padding: 8px; border: 1px solid #dee2e6; }
              .meta { display: flex; justify-content: space-between; margin-bottom: 20px; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="title">Purchase Details (Reference No: #${record.referenceNo})</div>
            <div class="meta">
              <div>
                <strong>Supplier:</strong> ${record.supplierName}<br>
                <strong>Mobile:</strong> ${record.supplierMobile || '564656454656'}
              </div>
              <div>
                <strong>Business:</strong> ${record.businessLocation}<br>
                <strong>Date:</strong> ${record.purchaseDate}<br>
                <strong>Status:</strong> ${record.status}<br>
                <strong>Payment:</strong> ${record.paymentStatus}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${(record.items || []).map((it, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${it.name}</td>
                    <td>${it.sku}</td>
                    <td>${it.quantity} ${it.unit || 'Pieces'}</td>
                    <td>৳ ${(it.unitCostBeforeTax || 0).toFixed(2)}</td>
                    <td>৳ ${(it.lineTotal || 0).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="margin-top: 20px; text-align: right; font-size: 14px; font-weight: bold;">
              Purchase Total: ৳ ${record.grandTotal.toFixed(2)}
            </div>
            <script>
              window.onload = function() { window.print(); };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleEdit = (record: PurchaseDetailsRecord) => {
    setOpenDropdownId(null);
    router.push(`/dashboard/purchases/add?edit=${record.id}`);
  };

  const handleDelete = (id: string, refNo: string) => {
    setOpenDropdownId(null);
    if (confirm(`Are you sure you want to delete purchase record #${refNo}?`)) {
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      try {
        const stored = JSON.parse(localStorage.getItem('pos_purchases') || '[]');
        const filtered = stored.filter((item: any) => item.id !== id && item.referenceNo !== refNo);
        localStorage.setItem('pos_purchases', JSON.stringify(filtered));
      } catch {
        // Ignored
      }
      showToast(`Purchase order #${refNo} deleted successfully.`);
    }
  };

  const handleLabels = (record: PurchaseDetailsRecord) => {
    setOpenDropdownId(null);
    router.push(`/dashboard/products/print-labels`);
  };

  const handleViewPayments = (record: PurchaseDetailsRecord) => {
    setOpenDropdownId(null);
    setPaymentsPurchase(record);
  };

  const handlePurchaseReturn = (record: PurchaseDetailsRecord) => {
    setOpenDropdownId(null);
    router.push(`/dashboard/purchases/returns/add?ref=${record.referenceNo}`);
  };

  const handleUpdateStatus = (record: PurchaseDetailsRecord) => {
    setOpenDropdownId(null);
    setStatusPurchase(record);
  };

  const handleNotification = (record: PurchaseDetailsRecord) => {
    setOpenDropdownId(null);
    showToast(`Items received notification sent to ${record.supplierName} (${record.supplierMobile || '01957387109'}) successfully!`);
  };

  const handlePaymentAdded = (updated: PurchaseDetailsRecord) => {
    setPurchases((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setPaymentsPurchase(updated);
    showToast(`Payment of ৳ ${updated.paidAmount.toFixed(2)} recorded successfully.`);
  };

  const handleStatusUpdated = (updated: PurchaseDetailsRecord) => {
    setPurchases((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Purchase status updated to "${updated.status}" successfully.`);
  };

  // Filter logic
  const filteredPurchases = purchases.filter((item) => {
    const matchesSearch =
      item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.businessLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSupplier = supplierFilter === 'All' || item.supplierName === supplierFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'All' || item.paymentStatus === paymentStatusFilter;
    const matchesLocation = locationFilter === 'All' || item.businessLocation.includes(locationFilter);

    return matchesSearch && matchesSupplier && matchesStatus && matchesPaymentStatus && matchesLocation;
  });

  // Calculate totals
  const totalGrandAmount = filteredPurchases.reduce((sum, p) => sum + p.grandTotal, 0);
  const totalDueAmount = filteredPurchases.reduce((sum, p) => sum + p.paymentDue, 0);
  const paidCount = filteredPurchases.filter((p) => p.paymentStatus === 'Paid').length;

  // Export Columns Mapping
  const exportCols: ColumnDef<PurchaseDetailsRecord>[] = [
    { id: 'date', label: 'Date', accessor: (p) => p.purchaseDate },
    { id: 'referenceNo', label: 'Reference No', accessor: (p) => p.referenceNo },
    { id: 'location', label: 'Location', accessor: (p) => p.businessLocation },
    { id: 'supplier', label: 'Supplier', accessor: (p) => p.supplierName },
    { id: 'status', label: 'Purchase Status', accessor: (p) => p.status },
    { id: 'paymentStatus', label: 'Payment Status', accessor: (p) => p.paymentStatus },
    { id: 'grandTotal', label: 'Grand Total', accessor: (p) => `৳ ${p.grandTotal.toFixed(2)}` },
    { id: 'paymentDue', label: 'Payment due', accessor: (p) => `৳ ${p.paymentDue.toFixed(2)}` },
    { id: 'addedBy', label: 'Added By', accessor: (p) => p.addedBy || 'Admin' }
  ];

  const handleExportCSV = () => {
    exportToCSV('Purchases_List', exportCols, filteredPurchases);
  };

  const handleExportExcel = () => {
    exportToExcel('Purchases_List', exportCols, filteredPurchases);
  };

  const handlePrintAll = () => {
    printTable('Purchases List', exportCols, filteredPurchases);
  };

  const handleExportPDF = () => {
    exportToPDF('Purchases List', exportCols, filteredPurchases);
  };

  const handleToggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const isColVisible = (id: string) => {
    const col = columns.find((c) => c.id === id);
    return col ? col.visible : true;
  };

  return (
    <div className="space-y-6 select-none font-sans pb-16 text-slate-200">
      
      {/* Toast alert matching project cosmic style */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-3 duration-200 border border-white/20">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header matching products / dashboard page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight flex items-center gap-2">
            <span>Purchases</span>
            <span className="text-xs font-normal text-slate-400">Manage your purchases</span>
          </h1>
        </div>

        <Link
          href="/dashboard/purchases/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition-all active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.3)] w-fit cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Purchase</span>
        </Link>
      </div>

      {/* Collapsible Filters Section */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-5 sm:px-6 py-3.5 text-left text-sm font-bold text-white hover:bg-white/[0.03] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-cyan-400">
            <Filter size={16} />
            <span className="text-slate-200">Filters</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${
              showFilters ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showFilters && (
          <div className="px-5 sm:px-6 py-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs bg-[#0c0827]/40 animate-in fade-in duration-200">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Supplier:</label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="All" className="bg-[#0c0827]">All Suppliers</option>
                {Array.from(new Set(purchases.map((p) => p.supplierName))).map((sup) => (
                  <option key={sup} value={sup} className="bg-[#0c0827]">
                    {sup}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Purchase Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="All" className="bg-[#0c0827]">All Statuses</option>
                <option value="Received" className="bg-[#0c0827]">Received</option>
                <option value="Pending" className="bg-[#0c0827]">Pending</option>
                <option value="Ordered" className="bg-[#0c0827]">Ordered</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Payment Status:</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="All" className="bg-[#0c0827]">All Statuses</option>
                <option value="Paid" className="bg-[#0c0827]">Paid</option>
                <option value="Partial" className="bg-[#0c0827]">Partial</option>
                <option value="Due" className="bg-[#0c0827]">Due</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Business Location:</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="All" className="bg-[#0c0827]">All Locations</option>
                <option value="RANGPUR BIKE PARLOUR" className="bg-[#0c0827]">RANGPUR BIKE PARLOUR</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Table Card matching project cosmic style */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl overflow-visible p-5 sm:p-7 space-y-4">
        
        {/* Card Header with 'All Purchases' & '+ Add' button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white tracking-wide">
              All Purchases
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {filteredPurchases.length} records
            </span>
          </div>

          <Link
            href="/dashboard/purchases/add"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition-all active:scale-95 shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add</span>
          </Link>
        </div>

        {/* Controls Toolbar: Show entries, Exports, Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs pt-1">
          {/* Show entries */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Show</span>
            <div className="relative">
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 pr-7 text-xs text-white focus:outline-none focus:border-indigo-500/60 appearance-none cursor-pointer"
              >
                <option value={10} className="bg-[#0c0827]">10</option>
                <option value={25} className="bg-[#0c0827]">25</option>
                <option value={50} className="bg-[#0c0827]">50</option>
                <option value={100} className="bg-[#0c0827]">100</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
            <span>entries</span>
          </div>

          {/* Export Toolbar (CSV, Excel, Print, Column visibility, PDF) */}
          <div className="flex items-center justify-center">
            <ExportToolbar
              columns={columns}
              onToggleColumn={handleToggleColumn}
              onExportCSV={handleExportCSV}
              onExportExcel={handleExportExcel}
              onPrint={handlePrintAll}
              onExportPDF={handleExportPDF}
            />
          </div>

          {/* Search keyword */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-slate-400">Search:</span>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ref No / Supplier..."
                className="bg-[#08051e] border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 w-36 sm:w-44"
              />
            </div>
          </div>
        </div>

        {/* Purchases Table matching project cosmic colors */}
        <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin scrollbar-thumb-white/15 min-h-[260px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-white/[0.04] text-indigo-200/90 uppercase tracking-wider text-[11px] font-bold border-b border-white/10 select-none">
              <tr>
                <th className="py-3.5 px-4 w-28 text-left">Action</th>
                {isColVisible('date') && (
                  <th className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('referenceNo') && (
                  <th className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Reference No</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('location') && (
                  <th className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Location</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('supplier') && (
                  <th className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Supplier</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('status') && (
                  <th className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Purchase Status</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('paymentStatus') && (
                  <th className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Payment Status</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('grandTotal') && (
                  <th className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Grand Total</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('paymentDue') && (
                  <th className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Payment due</span>
                      <Info size={11} className="text-cyan-400" />
                    </div>
                  </th>
                )}
                {isColVisible('addedBy') && (
                  <th className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Added By</span>
                      <ArrowUpDown size={11} className="text-slate-400" />
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 bg-white/[0.01]">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((item) => {
                  const isOpen = openDropdownId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                      {/* Action Dropdown Column */}
                      <td className="py-3 px-4 relative action-menu-container">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(isOpen ? null : item.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <span>Actions</span>
                          <ChevronDown size={13} className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu matching Image 1 in cosmic theme */}
                        {isOpen && (
                          <div className="absolute left-4 top-11 z-50 w-56 bg-[#120e34] border border-white/15 rounded-2xl shadow-2xl py-2 text-xs text-slate-200 backdrop-blur-2xl animate-in fade-in-50 duration-100 divide-y divide-white/10">
                            {/* Group 1 */}
                            <div className="py-1">
                              {/* 1. View */}
                              <button
                                type="button"
                                onClick={() => handleView(item)}
                                className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-left hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                              >
                                <Eye size={14} className="text-cyan-400" />
                                <span className="font-medium">View</span>
                              </button>

                              {/* 2. Print */}
                              <button
                                type="button"
                                onClick={() => handlePrint(item)}
                                className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-left hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                              >
                                <Printer size={14} className="text-indigo-400" />
                                <span className="font-medium">Print</span>
                              </button>

                              {/* 3. Edit */}
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-left hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                              >
                                <Edit size={14} className="text-amber-400" />
                                <span className="font-medium">Edit</span>
                              </button>

                              {/* 4. Delete */}
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id, item.referenceNo)}
                                className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-left hover:bg-white/10 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} className="text-rose-400" />
                                <span className="font-medium">Delete</span>
                              </button>

                              {/* 5. Labels */}
                              <button
                                type="button"
                                onClick={() => handleLabels(item)}
                                className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-left hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                              >
                                <Tag size={14} className="text-violet-400" />
                                <span className="font-medium">Labels</span>
                              </button>
                            </div>

                            {/* Group 2 */}
                            <div className="py-1">
                              {/* 6. View Payments */}
                              <button
                                type="button"
                                onClick={() => handleViewPayments(item)}
                                className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-left hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                              >
                                <CreditCard size={14} className="text-emerald-400" />
                                <span className="font-medium">View Payments</span>
                              </button>

                              {/* 7. Purchase Return */}
                              <button
                                type="button"
                                onClick={() => handlePurchaseReturn(item)}
                                className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-left hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                              >
                                <RotateCcw size={14} className="text-sky-400" />
                                <span className="font-medium">Purchase Return</span>
                              </button>

                              {/* 8. Update Status */}
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item)}
                                className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-left hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                              >
                                <RefreshCw size={14} className="text-blue-400" />
                                <span className="font-medium">Update Status</span>
                              </button>

                              {/* 9. Items Received Notification */}
                              <button
                                type="button"
                                onClick={() => handleNotification(item)}
                                className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-left hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                              >
                                <Mail size={14} className="text-teal-400" />
                                <span className="font-medium">Items Received Notification</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      {isColVisible('date') && (
                        <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                          {item.purchaseDate}
                        </td>
                      )}

                      {/* Reference No */}
                      {isColVisible('referenceNo') && (
                        <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                          {item.referenceNo}
                        </td>
                      )}

                      {/* Location */}
                      {isColVisible('location') && (
                        <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                          {item.businessLocation}
                        </td>
                      )}

                      {/* Supplier */}
                      {isColVisible('supplier') && (
                        <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">
                          {item.supplierName}
                        </td>
                      )}

                      {/* Purchase Status */}
                      {isColVisible('status') && (
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              item.status === 'Received'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : item.status === 'Pending'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      )}

                      {/* Payment Status */}
                      {isColVisible('paymentStatus') && (
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              item.paymentStatus === 'Paid'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : item.paymentStatus === 'Partial'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {item.paymentStatus}
                          </span>
                        </td>
                      )}

                      {/* Grand Total */}
                      {isColVisible('grandTotal') && (
                        <td className="py-3 px-4 text-right font-extrabold text-cyan-300 whitespace-nowrap">
                          ৳ {item.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      )}

                      {/* Payment due */}
                      {isColVisible('paymentDue') && (
                        <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                          Purchase: <span className="font-bold text-rose-400">৳ {item.paymentDue.toFixed(2)}</span>
                        </td>
                      )}

                      {/* Added By */}
                      {isColVisible('addedBy') && (
                        <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                          {item.addedBy || 'Admin'}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Total Row Footer matching Image 1 in cosmic dark theme */}
            {filteredPurchases.length > 0 && (
              <tfoot className="bg-white/[0.04] font-bold text-slate-200 border-t-2 border-white/15 select-none">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Total:</td>
                  {isColVisible('date') && <td className="py-3.5 px-4"></td>}
                  {isColVisible('referenceNo') && <td className="py-3.5 px-4"></td>}
                  {isColVisible('location') && <td className="py-3.5 px-4"></td>}
                  {isColVisible('supplier') && <td className="py-3.5 px-4"></td>}
                  {isColVisible('status') && <td className="py-3.5 px-4"></td>}
                  {isColVisible('paymentStatus') && (
                    <td className="py-3.5 px-4 whitespace-nowrap text-emerald-400 font-bold">
                      Paid - {paidCount}
                    </td>
                  )}
                  {isColVisible('grandTotal') && (
                    <td className="py-3.5 px-4 whitespace-nowrap text-right text-cyan-300 font-extrabold">
                      ৳ {totalGrandAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  )}
                  {isColVisible('paymentDue') && (
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs leading-tight">
                      <div className="text-slate-200 font-bold">Purchase Due - <span className="text-rose-400">৳ {totalDueAmount.toFixed(2)}</span></div>
                      <div className="text-slate-400 font-normal">Purchase Return - ৳ 0.00</div>
                    </td>
                  )}
                  {isColVisible('addedBy') && <td className="py-3.5 px-4"></td>}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination & Summary */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2 select-none">
          <div>
            Showing 1 to {filteredPurchases.length} of {filteredPurchases.length} entries
          </div>

          <div className="inline-flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-40 cursor-pointer transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold shadow-md">
              {currentPage}
            </span>
            <button
              type="button"
              disabled={true}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-40 cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-[11px] text-slate-500 pt-2">
        DATABYTE - v6.5 | Copyright © 2026 All rights reserved.
      </div>

      {/* 1. Purchase Details Modal (Themed to project cosmic dark) */}
      <PurchaseDetailsModal
        isOpen={!!viewingPurchase}
        onClose={() => setViewingPurchase(null)}
        purchase={viewingPurchase}
      />

      {/* 2. View Payments Modal */}
      <PurchasePaymentsModal
        isOpen={!!paymentsPurchase}
        onClose={() => setPaymentsPurchase(null)}
        purchase={paymentsPurchase}
        onPaymentAdded={handlePaymentAdded}
      />

      {/* 3. Update Purchase Status Modal */}
      <UpdatePurchaseStatusModal
        isOpen={!!statusPurchase}
        onClose={() => setStatusPurchase(null)}
        purchase={statusPurchase}
        onStatusUpdated={handleStatusUpdated}
      />

    </div>
  );
}
