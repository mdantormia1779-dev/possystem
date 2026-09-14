"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Filter, 
  Plus, 
  ChevronDown, 
  ArrowUpDown, 
  Banknote, 
  Eye, 
  Edit3, 
  Trash2, 
  Power, 
  MoreVertical 
} from 'lucide-react';
import ExportToolbar, { ColumnOption } from '@/app/Components/Dashboard/ExportToolbar';
import { ColumnDef, exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';
import AddSupplierModal, { SupplierFormData } from './AddSupplierModal';
import AddPaymentModal from './AddPaymentModal';
import ViewSupplierModal from './ViewSupplierModal';

const initialSuppliers: SupplierFormData[] = [
  {
    id: '1',
    contactType: 'Suppliers',
    isBusiness: false,
    businessName: '',
    contactId: 'SHAMIM',
    name: 'SHAMIM',
    mobile: '017953859',
    alternateNumber: '',
    landline: '',
    email: '',
    assignedTo: '',
    taxNumber: '',
    openingBalance: 0,
    advanceBalance: 0,
    payTermNumber: '',
    payTermType: 'Days',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    customField5: '',
    customField6: '',
    customField7: '',
    customField8: '',
    customField9: '',
    customField10: '',
    shippingAddress: '',
    totalPurchaseDue: 0,
    totalPurchaseReturnDue: 0,
    addedOn: '26/07/2026',
    status: 'active',
  },
  {
    id: '2',
    contactType: 'Suppliers',
    isBusiness: false,
    businessName: '',
    contactId: 'Robin',
    name: 'Robin',
    mobile: '564656454656',
    alternateNumber: '',
    landline: '',
    email: '',
    assignedTo: '',
    taxNumber: '',
    openingBalance: 0,
    advanceBalance: 0,
    payTermNumber: '',
    payTermType: 'Days',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    customField5: '',
    customField6: '',
    customField7: '',
    customField8: '',
    customField9: '',
    customField10: '',
    shippingAddress: '',
    totalPurchaseDue: 0,
    totalPurchaseReturnDue: 0,
    addedOn: '16/08/2026',
    status: 'active',
  },
  {
    id: '3',
    contactType: 'Suppliers',
    isBusiness: false,
    businessName: '',
    contactId: 'MOTO WOLF',
    name: 'MOTO WOLF',
    mobile: '017956635',
    alternateNumber: '',
    landline: '',
    email: '',
    assignedTo: '',
    taxNumber: '',
    openingBalance: 0,
    advanceBalance: 0,
    payTermNumber: '',
    payTermType: 'Days',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    customField5: '',
    customField6: '',
    customField7: '',
    customField8: '',
    customField9: '',
    customField10: '',
    shippingAddress: '',
    totalPurchaseDue: 0,
    totalPurchaseReturnDue: 0,
    addedOn: '26/07/2026',
    status: 'active',
  },
  {
    id: '4',
    contactType: 'Suppliers',
    isBusiness: true,
    businessName: 'dhaka',
    contactId: 'CO0002',
    name: 'dhaka',
    mobile: '235545656',
    alternateNumber: '',
    landline: '',
    email: '',
    assignedTo: '',
    taxNumber: '',
    openingBalance: 0,
    advanceBalance: 0,
    payTermNumber: '',
    payTermType: 'Days',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    customField5: '',
    customField6: '',
    customField7: '',
    customField8: '',
    customField9: '',
    customField10: '',
    shippingAddress: '',
    totalPurchaseDue: 0,
    totalPurchaseReturnDue: 0,
    addedOn: '29/12/2025',
    status: 'active',
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierFormData[]>(initialSuppliers);
  const [entriesCount, setEntriesCount] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierFormData | null>(null);

  const [paymentSupplier, setPaymentSupplier] = useState<SupplierFormData | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<SupplierFormData | null>(null);

  // Actions dropdown active row
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Columns definition for visibility
  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: 'action', label: 'Action', visible: true },
    { id: 'contactId', label: 'Contact ID', visible: true },
    { id: 'businessName', label: 'Business Name', visible: true },
    { id: 'name', label: 'Name', visible: true },
    { id: 'email', label: 'Email', visible: true },
    { id: 'taxNumber', label: 'Tax number', visible: true },
    { id: 'payTerm', label: 'Pay term', visible: true },
    { id: 'openingBalance', label: 'Opening Balance', visible: true },
    { id: 'advanceBalance', label: 'Advance Balance', visible: true },
    { id: 'addedOn', label: 'Added On', visible: true },
    { id: 'address', label: 'Address', visible: true },
    { id: 'mobile', label: 'Mobile', visible: true },
    { id: 'totalPurchaseDue', label: 'Total Purchase Due', visible: true },
    { id: 'totalPurchaseReturnDue', label: 'Total Purchase Return Due', visible: true },
    { id: 'customField1', label: 'Custom Field 1', visible: true },
    { id: 'customField2', label: 'Custom Field 2', visible: true },
    { id: 'customField3', label: 'Custom Field 3', visible: true },
    { id: 'customField4', label: 'Custom Field 4', visible: true },
    { id: 'customField5', label: 'Custom Field 5', visible: true },
  ]);

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const isColVisible = (id: string) => Boolean(columns.find((c) => c.id === id)?.visible);

  // Filter logic
  const filteredSuppliers = suppliers.filter((sup) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sup.contactId.toLowerCase().includes(q) ||
      sup.name.toLowerCase().includes(q) ||
      sup.businessName.toLowerCase().includes(q) ||
      sup.mobile.includes(q) ||
      sup.email.toLowerCase().includes(q);

    const matchesStatus =
      selectedStatus === 'all' ? true : sup.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalPurchaseDueSum = filteredSuppliers.reduce((acc, curr) => acc + (curr.totalPurchaseDue || 0), 0);
  const totalPurchaseReturnDueSum = filteredSuppliers.reduce((acc, curr) => acc + (curr.totalPurchaseReturnDue || 0), 0);

  // Export columns definition
  const exportColumns: ColumnDef<SupplierFormData>[] = [
    { id: 'contactId', label: 'Contact ID', accessor: (item: SupplierFormData) => item.contactId },
    { id: 'businessName', label: 'Business Name', accessor: (item: SupplierFormData) => item.businessName || '' },
    { id: 'name', label: 'Name', accessor: (item: SupplierFormData) => item.name },
    { id: 'email', label: 'Email', accessor: (item: SupplierFormData) => item.email || '' },
    { id: 'taxNumber', label: 'Tax number', accessor: (item: SupplierFormData) => item.taxNumber || '' },
    { id: 'payTerm', label: 'Pay term', accessor: (item: SupplierFormData) => item.payTermNumber ? `${item.payTermNumber} ${item.payTermType}` : '' },
    { id: 'openingBalance', label: 'Opening Balance', accessor: (item: SupplierFormData) => `৳ ${(item.openingBalance || 0).toFixed(2)}` },
    { id: 'advanceBalance', label: 'Advance Balance', accessor: (item: SupplierFormData) => `৳ ${(item.advanceBalance || 0).toFixed(2)}` },
    { id: 'addedOn', label: 'Added On', accessor: (item: SupplierFormData) => item.addedOn || '' },
    { id: 'address', label: 'Address', accessor: (item: SupplierFormData) => item.addressLine1 || item.city || '' },
    { id: 'mobile', label: 'Mobile', accessor: (item: SupplierFormData) => item.mobile || '' },
    { id: 'totalPurchaseDue', label: 'Total Purchase Due', accessor: (item: SupplierFormData) => `৳ ${(item.totalPurchaseDue || 0).toFixed(2)}` },
    { id: 'totalPurchaseReturnDue', label: 'Total Purchase Return Due', accessor: (item: SupplierFormData) => `৳ ${(item.totalPurchaseReturnDue || 0).toFixed(2)}` },
    { id: 'customField1', label: 'Custom Field 1', accessor: (item: SupplierFormData) => item.customField1 || '' },
    { id: 'customField2', label: 'Custom Field 2', accessor: (item: SupplierFormData) => item.customField2 || '' },
    { id: 'customField3', label: 'Custom Field 3', accessor: (item: SupplierFormData) => item.customField3 || '' },
    { id: 'customField4', label: 'Custom Field 4', accessor: (item: SupplierFormData) => item.customField4 || '' },
    { id: 'customField5', label: 'Custom Field 5', accessor: (item: SupplierFormData) => item.customField5 || '' },
  ].filter((c) => isColVisible(c.id));

  // Export Handlers
  const handleExportCSV = () => exportToCSV('suppliers', exportColumns, filteredSuppliers);
  const handleExportExcel = () => exportToExcel('suppliers', exportColumns, filteredSuppliers);
  const handlePrint = () => printTable('Suppliers List', exportColumns, filteredSuppliers);
  const handleExportPDF = () => exportToPDF('Suppliers List', exportColumns, filteredSuppliers);

  // Save supplier handler (add / edit)
  const handleSaveSupplier = (data: SupplierFormData) => {
    if (editingSupplier && editingSupplier.id) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? { ...data, id: editingSupplier.id } : s))
      );
      setEditingSupplier(null);
    } else {
      const newSup: SupplierFormData = {
        ...data,
        id: String(Date.now()),
      };
      setSuppliers((prev) => [newSup, ...prev]);
    }
  };

  // Delete handler
  const handleDeleteSupplier = (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      setOpenActionId(null);
    }
  };

  // Toggle Deactivate / Activate
  const handleToggleStatus = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'inactive' ? 'active' : 'inactive' }
          : s
      )
    );
    setOpenActionId(null);
  };

  // Handle Payment save
  const handleSavePayment = (paymentData: {
    supplierId: string;
    amount: number;
  }) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === paymentData.supplierId) {
          const newDue = Math.max(0, (s.totalPurchaseDue || 0) - paymentData.amount);
          return { ...s, totalPurchaseDue: newDue };
        }
        return s;
      })
    );
  };

  const visibleColCount = columns.filter((c) => c.visible).length;

  return (
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Top Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight flex items-center gap-2">
            <span>Suppliers</span>
            <span className="text-xs font-normal text-slate-400">
              Manage your Suppliers
            </span>
          </h1>
        </div>
      </div>

      {/* 1. Filters Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between px-5 sm:px-6 py-3.5 text-left text-sm font-bold text-white hover:bg-white/[0.03] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-cyan-400">
            <Filter size={16} />
            <span className="text-slate-200">Filters</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${
              isFilterOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isFilterOpen && (
          <div className="px-5 sm:px-6 py-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">
                Status Filter:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#0c0827] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Suppliers Table Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-7 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
          <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Card Header & Controls Bar */}
        <div className="space-y-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              All your Suppliers
            </h2>

            {/* + Add Button */}
            <button
              type="button"
              onClick={() => {
                setEditingSupplier(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add</span>
            </button>
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

              {/* Functional Export Toolbar (5 buttons) */}
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
        </div>

        {/* 3. Table Section with Horizontal Scroll */}
        <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin scrollbar-thumb-white/15">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap min-w-[1200px]">
            <thead>
              <tr className="bg-white/[0.04] text-indigo-200/90 uppercase tracking-wider text-[11px] font-bold border-b border-white/10">
                {isColVisible('action') && (
                  <th className="py-3 px-4 w-28">Action</th>
                )}
                {isColVisible('contactId') && (
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span>Contact ID</span>
                      <ArrowUpDown size={11} className="text-slate-500" />
                    </div>
                  </th>
                )}
                {isColVisible('businessName') && (
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span>Business Name</span>
                      <ArrowUpDown size={11} className="text-slate-500" />
                    </div>
                  </th>
                )}
                {isColVisible('name') && (
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span>Name</span>
                      <ArrowUpDown size={11} className="text-slate-500" />
                    </div>
                  </th>
                )}
                {isColVisible('email') && (
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span>Email</span>
                      <ArrowUpDown size={11} className="text-slate-500" />
                    </div>
                  </th>
                )}
                {isColVisible('taxNumber') && (
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span>Tax number</span>
                      <ArrowUpDown size={11} className="text-slate-500" />
                    </div>
                  </th>
                )}
                {isColVisible('payTerm') && (
                  <th className="py-3 px-4">Pay term</th>
                )}
                {isColVisible('openingBalance') && (
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span>Opening Balance</span>
                      <ArrowUpDown size={11} className="text-slate-500" />
                    </div>
                  </th>
                )}
                {isColVisible('advanceBalance') && (
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span>Advance Balance</span>
                      <ArrowUpDown size={11} className="text-slate-500" />
                    </div>
                  </th>
                )}
                {isColVisible('addedOn') && (
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span>Added On</span>
                      <ArrowUpDown size={11} className="text-slate-500" />
                    </div>
                  </th>
                )}
                {isColVisible('address') && (
                  <th className="py-3 px-4">Address</th>
                )}
                {isColVisible('mobile') && (
                  <th className="py-3 px-4">Mobile</th>
                )}
                {isColVisible('totalPurchaseDue') && (
                  <th className="py-3 px-4 text-rose-300">Total Purchase Due</th>
                )}
                {isColVisible('totalPurchaseReturnDue') && (
                  <th className="py-3 px-4 text-rose-300">Total Purchase Return Due</th>
                )}
                {isColVisible('customField1') && (
                  <th className="py-3 px-4">Custom Field 1</th>
                )}
                {isColVisible('customField2') && (
                  <th className="py-3 px-4">Custom Field 2</th>
                )}
                {isColVisible('customField3') && (
                  <th className="py-3 px-4">Custom Field 3</th>
                )}
                {isColVisible('customField4') && (
                  <th className="py-3 px-4">Custom Field 4</th>
                )}
                {isColVisible('customField5') && (
                  <th className="py-3 px-4">Custom Field 5</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06] text-slate-300">
              {filteredSuppliers.length === 0 || visibleColCount === 0 ? (
                <tr>
                  <td colSpan={visibleColCount || 1} className="py-8 text-center text-slate-400 font-medium">
                    {visibleColCount === 0 ? 'No columns visible' : 'No suppliers available'}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.slice(0, entriesCount).map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.04] transition-colors">
                    {/* Action Dropdown Column */}
                    {isColVisible('action') && (
                      <td className="py-3 px-4 relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionId(openActionId === row.id ? null : (row.id || ''));
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                          <span>Actions</span>
                          <ChevronDown size={13} className="text-cyan-300" />
                        </button>

                        {/* Actions Popover Dropdown matching media_1789375290366.png */}
                        {openActionId === row.id && (
                          <div
                            ref={actionMenuRef}
                            className="absolute left-4 top-11 z-50 w-36 bg-[#0e0a29] border border-white/20 rounded-xl shadow-2xl py-1.5 text-xs text-slate-300 backdrop-blur-2xl animate-in fade-in duration-150"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionId(null);
                                setPaymentSupplier(row);
                              }}
                              className="w-full px-3.5 py-1.5 flex items-center gap-2 hover:bg-white/10 hover:text-white text-left cursor-pointer transition-colors"
                            >
                              <Banknote size={13} className="text-emerald-400" />
                              <span>Pay</span>
                            </button>
                            <Link
                              href={`/dashboard/suppliers/${row.id}`}
                              className="w-full px-3.5 py-1.5 flex items-center gap-2 hover:bg-white/10 hover:text-white text-left cursor-pointer transition-colors"
                            >
                              <Eye size={13} className="text-cyan-400" />
                              <span>View</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionId(null);
                                setEditingSupplier(row);
                                setIsAddModalOpen(true);
                              }}
                              className="w-full px-3.5 py-1.5 flex items-center gap-2 hover:bg-white/10 hover:text-white text-left cursor-pointer transition-colors"
                            >
                              <Edit3 size={13} className="text-amber-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSupplier(row.id || '')}
                              className="w-full px-3.5 py-1.5 flex items-center gap-2 hover:bg-rose-500/20 text-rose-300 text-left cursor-pointer transition-colors"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(row.id || '')}
                              className="w-full px-3.5 py-1.5 flex items-center gap-2 hover:bg-white/10 hover:text-slate-200 text-left cursor-pointer transition-colors border-t border-white/10 mt-1 pt-1.5"
                            >
                              <Power size={13} className={row.status === 'inactive' ? 'text-emerald-400' : 'text-slate-400'} />
                              <span>{row.status === 'inactive' ? 'Activate' : 'Deactivate'}</span>
                            </button>
                          </div>
                        )}
                      </td>
                    )}

                    {isColVisible('contactId') && (
                      <td className="py-3 px-4 font-semibold text-white">
                        {row.contactId}
                      </td>
                    )}
                    {isColVisible('businessName') && (
                      <td className="py-3 px-4 text-slate-300">
                        {row.businessName || '—'}
                      </td>
                    )}
                    {isColVisible('name') && (
                      <td className="py-3 px-4 text-slate-200 font-medium">
                        {row.name}
                      </td>
                    )}
                    {isColVisible('email') && (
                      <td className="py-3 px-4 text-slate-400">
                        {row.email || '—'}
                      </td>
                    )}
                    {isColVisible('taxNumber') && (
                      <td className="py-3 px-4 text-slate-400">
                        {row.taxNumber || '—'}
                      </td>
                    )}
                    {isColVisible('payTerm') && (
                      <td className="py-3 px-4 text-slate-400">
                        {row.payTermNumber ? `${row.payTermNumber} ${row.payTermType}` : '—'}
                      </td>
                    )}
                    {isColVisible('openingBalance') && (
                      <td className="py-3 px-4 font-medium text-slate-200">
                        ৳ {(row.openingBalance || 0).toFixed(2)}
                      </td>
                    )}
                    {isColVisible('advanceBalance') && (
                      <td className="py-3 px-4 font-medium text-slate-200">
                        ৳ {(row.advanceBalance || 0).toFixed(2)}
                      </td>
                    )}
                    {isColVisible('addedOn') && (
                      <td className="py-3 px-4 text-slate-300">
                        {row.addedOn || '—'}
                      </td>
                    )}
                    {isColVisible('address') && (
                      <td className="py-3 px-4 text-slate-300">
                        {row.addressLine1 || row.city || '—'}
                      </td>
                    )}
                    {isColVisible('mobile') && (
                      <td className="py-3 px-4 text-slate-200 font-medium">
                        {row.mobile}
                      </td>
                    )}
                    {isColVisible('totalPurchaseDue') && (
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        ৳ {(row.totalPurchaseDue || 0).toFixed(2)}
                      </td>
                    )}
                    {isColVisible('totalPurchaseReturnDue') && (
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        ৳ {(row.totalPurchaseReturnDue || 0).toFixed(2)}
                      </td>
                    )}
                    {isColVisible('customField1') && (
                      <td className="py-3 px-4 text-slate-400">{row.customField1 || '—'}</td>
                    )}
                    {isColVisible('customField2') && (
                      <td className="py-3 px-4 text-slate-400">{row.customField2 || '—'}</td>
                    )}
                    {isColVisible('customField3') && (
                      <td className="py-3 px-4 text-slate-400">{row.customField3 || '—'}</td>
                    )}
                    {isColVisible('customField4') && (
                      <td className="py-3 px-4 text-slate-400">{row.customField4 || '—'}</td>
                    )}
                    {isColVisible('customField5') && (
                      <td className="py-3 px-4 text-slate-400">{row.customField5 || '—'}</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>

            {/* Total Summary Row matching media_1789375237387.png */}
            {filteredSuppliers.length > 0 && (
              <tfoot>
                <tr className="bg-white/[0.06] text-white font-bold border-t-2 border-white/10">
                  <td
                    colSpan={
                      columns
                        .filter((c) => c.visible)
                        .findIndex((c) => c.id === 'totalPurchaseDue') || 12
                    }
                    className="py-3.5 px-4 text-center font-bold text-slate-200"
                  >
                    Total:
                  </td>
                  {isColVisible('totalPurchaseDue') && (
                    <td className="py-3.5 px-4 font-bold text-white">
                      ৳ {totalPurchaseDueSum.toFixed(2)}
                    </td>
                  )}
                  {isColVisible('totalPurchaseReturnDue') && (
                    <td className="py-3.5 px-4 font-bold text-white">
                      ৳ {totalPurchaseReturnDueSum.toFixed(2)}
                    </td>
                  )}
                  {/* Fill empty remaining columns */}
                  <td colSpan={5} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* 4. Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs text-slate-400 border-t border-white/10 mt-2">
          <div>
            Showing 1 to {Math.min(filteredSuppliers.length, entriesCount)} of {filteredSuppliers.length} entries
          </div>

          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.02] text-slate-500 text-xs font-medium cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-xl bg-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-xs"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.02] text-slate-500 text-xs font-medium cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding Notice */}
      <div className="text-[11px] text-slate-500 pt-2 text-center sm:text-left">
        DATABYTE - V6.5 | Copyright © 2026 All rights reserved.
      </div>

      {/* Modals */}
      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        initialData={editingSupplier}
      />

      <AddPaymentModal
        isOpen={Boolean(paymentSupplier)}
        onClose={() => setPaymentSupplier(null)}
        supplier={paymentSupplier}
        onSavePayment={handleSavePayment}
      />

      <ViewSupplierModal
        isOpen={Boolean(viewingSupplier)}
        onClose={() => setViewingSupplier(null)}
        supplier={viewingSupplier}
      />
    </div>
  );
}
