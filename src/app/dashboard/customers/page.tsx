"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Filter, 
  Plus, 
  ChevronDown, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  Power,
  Users
} from 'lucide-react';
import ExportToolbar, { ColumnOption } from '@/app/Components/Dashboard/ExportToolbar';
import { ColumnDef, exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';
import AddCustomerModal, { CustomerFormData } from './AddCustomerModal';
import ViewCustomerModal from './ViewCustomerModal';

const initialCustomers: CustomerFormData[] = [
  {
    id: '1',
    contactType: 'Customers',
    isBusiness: false,
    businessName: '',
    contactId: 'CO0001',
    firstName: 'Walk-In Customer',
    name: 'Walk-In Customer',
    customerGroup: '',
    mobile: '',
    alternateNumber: '',
    landline: '',
    email: '',
    assignedTo: '',
    taxNumber: '',
    openingBalance: 0,
    advanceBalance: 0,
    payTermNumber: '',
    payTermType: '',
    creditLimit: 0,
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
    totalSaleDue: 0,
    totalSellReturnDue: 0,
    addedOn: '25/12/2025',
    status: 'active',
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerFormData[]>(initialCustomers);
  const [entriesCount, setEntriesCount] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerFormData | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerFormData | null>(null);

  // Actions dropdown active row
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Columns visibility matching screenshot
  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: 'action', label: 'Action', visible: true },
    { id: 'contactId', label: 'Contact ID', visible: true },
    { id: 'businessName', label: 'Business Name', visible: true },
    { id: 'name', label: 'Name', visible: true },
    { id: 'email', label: 'Email', visible: true },
    { id: 'taxNumber', label: 'Tax number', visible: true },
    { id: 'creditLimit', label: 'Credit Limit', visible: true },
    { id: 'payTerm', label: 'Pay term', visible: true },
    { id: 'openingBalance', label: 'Opening Balance', visible: true },
    { id: 'advanceBalance', label: 'Advance Balance', visible: true },
    { id: 'addedOn', label: 'Added On', visible: true },
    { id: 'customerGroup', label: 'Customer Group', visible: true },
    { id: 'address', label: 'Address', visible: true },
    { id: 'mobile', label: 'Mobile', visible: true },
    { id: 'totalSaleDue', label: 'Total Sale Due', visible: true },
    { id: 'totalSellReturnDue', label: 'Total Sell Return Due', visible: true },
    { id: 'customField1', label: 'Custom Field 1', visible: true },
    { id: 'customField2', label: 'Custom Field 2', visible: true },
    { id: 'customField3', label: 'Custom Field 3', visible: true },
    { id: 'customField4', label: 'Custom Field 4', visible: true },
    { id: 'customField5', label: 'Custom Field 5', visible: true },
    { id: 'customField6', label: 'Custom Field 6', visible: true },
    { id: 'customField7', label: 'Custom Field 7', visible: true },
    { id: 'customField8', label: 'Custom Field 8', visible: true },
    { id: 'customField9', label: 'Custom Field 9', visible: true },
    { id: 'customField10', label: 'Custom Field 10', visible: true },
  ]);

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const isColVisible = (id: string) => {
    return columns.find((c) => c.id === id)?.visible ?? true;
  };

  // Sorting
  const [sortField, setSortField] = useState<keyof CustomerFormData>('addedOn');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof CustomerFormData) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered & Sorted
  const filteredCustomers = customers.filter((cust) => {
    if (selectedStatus === 'active' && cust.status === 'inactive') return false;
    if (selectedStatus === 'inactive' && cust.status !== 'inactive') return false;
    if (selectedGroup !== 'all' && cust.customerGroup !== selectedGroup) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      cust.name?.toLowerCase().includes(query) ||
      cust.contactId?.toLowerCase().includes(query) ||
      cust.businessName?.toLowerCase().includes(query) ||
      cust.mobile?.toLowerCase().includes(query) ||
      cust.email?.toLowerCase().includes(query)
    );
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const valA = a[sortField] ?? '';
    const valB = b[sortField] ?? '';
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return sortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Calculate Totals
  const totalSalesDueSum = sortedCustomers.reduce((acc, c) => acc + (c.totalSaleDue || 0), 0);
  const totalSellReturnDueSum = sortedCustomers.reduce((acc, c) => acc + (c.totalSellReturnDue || 0), 0);

  // Export columns definition
  const exportColumns: ColumnDef<CustomerFormData>[] = [
    { id: 'contactId', label: 'Contact ID', accessor: (c: CustomerFormData) => c.contactId },
    { id: 'businessName', label: 'Business Name', accessor: (c: CustomerFormData) => c.businessName || '-' },
    { id: 'name', label: 'Name', accessor: (c: CustomerFormData) => c.name },
    { id: 'email', label: 'Email', accessor: (c: CustomerFormData) => c.email || '-' },
    { id: 'taxNumber', label: 'Tax number', accessor: (c: CustomerFormData) => c.taxNumber || '-' },
    { id: 'creditLimit', label: 'Credit Limit', accessor: (c: CustomerFormData) => c.creditLimit ? `৳ ${Number(c.creditLimit).toFixed(2)}` : '৳ 0.00' },
    { id: 'payTerm', label: 'Pay term', accessor: (c: CustomerFormData) => c.payTermNumber ? `${c.payTermNumber} ${c.payTermType}` : '-' },
    { id: 'openingBalance', label: 'Opening Balance', accessor: (c: CustomerFormData) => `৳ ${(c.openingBalance || 0).toFixed(2)}` },
    { id: 'advanceBalance', label: 'Advance Balance', accessor: (c: CustomerFormData) => `৳ ${(c.advanceBalance || 0).toFixed(2)}` },
    { id: 'addedOn', label: 'Added On', accessor: (c: CustomerFormData) => c.addedOn || '-' },
    { id: 'customerGroup', label: 'Customer Group', accessor: (c: CustomerFormData) => c.customerGroup || '-' },
    { id: 'address', label: 'Address', accessor: (c: CustomerFormData) => [c.addressLine1, c.city].filter(Boolean).join(', ') || '-' },
    { id: 'mobile', label: 'Mobile', accessor: (c: CustomerFormData) => c.mobile || '-' },
    { id: 'totalSaleDue', label: 'Total Sale Due', accessor: (c: CustomerFormData) => `৳ ${(c.totalSaleDue || 0).toFixed(2)}` },
    { id: 'totalSellReturnDue', label: 'Total Sell Return Due', accessor: (c: CustomerFormData) => `৳ ${(c.totalSellReturnDue || 0).toFixed(2)}` },
    { id: 'customField1', label: 'Custom Field 1', accessor: (c: CustomerFormData) => c.customField1 || '-' },
    { id: 'customField2', label: 'Custom Field 2', accessor: (c: CustomerFormData) => c.customField2 || '-' },
    { id: 'customField3', label: 'Custom Field 3', accessor: (c: CustomerFormData) => c.customField3 || '-' },
    { id: 'customField4', label: 'Custom Field 4', accessor: (c: CustomerFormData) => c.customField4 || '-' },
    { id: 'customField5', label: 'Custom Field 5', accessor: (c: CustomerFormData) => c.customField5 || '-' },
    { id: 'customField6', label: 'Custom Field 6', accessor: (c: CustomerFormData) => c.customField6 || '-' },
    { id: 'customField7', label: 'Custom Field 7', accessor: (c: CustomerFormData) => c.customField7 || '-' },
    { id: 'customField8', label: 'Custom Field 8', accessor: (c: CustomerFormData) => c.customField8 || '-' },
    { id: 'customField9', label: 'Custom Field 9', accessor: (c: CustomerFormData) => c.customField9 || '-' },
    { id: 'customField10', label: 'Custom Field 10', accessor: (c: CustomerFormData) => c.customField10 || '-' },
  ].filter((c) => isColVisible(c.id));

  // Export Handlers
  const handleExportCSV = () => exportToCSV('customers', exportColumns, sortedCustomers);
  const handleExportExcel = () => exportToExcel('customers', exportColumns, sortedCustomers);
  const handlePrint = () => printTable('Customers List', exportColumns, sortedCustomers);
  const handleExportPDF = () => exportToPDF('Customers List', exportColumns, sortedCustomers);

  // Add or Edit Customer save
  const handleSaveCustomer = (data: CustomerFormData) => {
    if (editingCustomer?.id) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? { ...data, id: editingCustomer.id } : c))
      );
    } else {
      const newCust: CustomerFormData = {
        ...data,
        id: String(Date.now()),
      };
      setCustomers((prev) => [newCust, ...prev]);
    }
  };

  // Delete handler
  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setOpenActionId(null);
    }
  };

  // Toggle Deactivate / Activate
  const handleToggleStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'inactive' ? 'active' : 'inactive' }
          : c
      )
    );
    setOpenActionId(null);
  };

  const visibleColCount = columns.filter((c) => c.visible).length;

  return (
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Top Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight flex items-center gap-2">
            <span>Customers</span>
            <span className="text-xs font-normal text-slate-400">
              Manage your Customers
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
          <div className="px-5 sm:px-6 py-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">
                Customer Group:
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full bg-[#0c0827] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="all">All Groups</option>
                <option value="None">None</option>
                <option value="Retail">Retail Customers</option>
                <option value="Wholesale">Wholesale Customers</option>
                <option value="VIP">VIP Club</option>
              </select>
            </div>
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

      {/* 2. Main Customers Table Card */}
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
              All your Customers
            </h2>

            {/* + Add Button */}
            <button
              type="button"
              onClick={() => {
                setEditingCustomer(null);
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

            {/* Search Input */}
            <div className="flex items-center gap-2 text-xs text-slate-300 self-end lg:self-auto w-full sm:w-auto">
              <span>Search:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="w-full sm:w-48 md:w-60 bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. Table Container */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0c0827]/60">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-300 font-semibold">
                {isColVisible('action') && <th className="px-3.5 py-3 text-center">Action</th>}
                {isColVisible('contactId') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('contactId')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Contact ID</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('businessName') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('businessName')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Business Name</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('name') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('email') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Email</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('taxNumber') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('taxNumber')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Tax number</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('creditLimit') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white text-right"
                    onClick={() => handleSort('creditLimit')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Credit Limit</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('payTerm') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white text-center"
                    onClick={() => handleSort('payTermNumber')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Pay term</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('openingBalance') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white text-right"
                    onClick={() => handleSort('openingBalance')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Opening Balance</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('advanceBalance') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white text-right"
                    onClick={() => handleSort('advanceBalance')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Advance Balance</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('addedOn') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('addedOn')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Added On</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('customerGroup') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('customerGroup')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Customer Group</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('address') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('addressLine1')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Address</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('mobile') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('mobile')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Mobile</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('totalSaleDue') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white text-right"
                    onClick={() => handleSort('totalSaleDue')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Total Sale Due</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('totalSellReturnDue') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white text-right"
                    onClick={() => handleSort('totalSellReturnDue')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Total Sell Return Due</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const fieldKey = `customField${num}` as keyof CustomerFormData;
                  return isColVisible(fieldKey) ? (
                    <th
                      key={fieldKey}
                      className="px-3.5 py-3 cursor-pointer hover:text-white"
                      onClick={() => handleSort(fieldKey)}
                    >
                      <div className="flex items-center gap-1">
                        <span>Custom Field {num}</span>
                        <ArrowUpDown size={12} className="text-slate-400" />
                      </div>
                    </th>
                  ) : null;
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {sortedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={visibleColCount} className="text-center py-8 text-slate-400">
                    No customers found matching criteria
                  </td>
                </tr>
              ) : (
                sortedCustomers.slice(0, entriesCount).map((cust) => {
                  const isActionOpen = openActionId === cust.id;

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Action Dropdown Column */}
                      {isColVisible('action') && (
                        <td className="px-3 py-2.5 text-center relative">
                          <div className="inline-block text-left" ref={isActionOpen ? actionMenuRef : null}>
                            <button
                              type="button"
                              onClick={() =>
                                setOpenActionId(isActionOpen ? null : (cust.id || null))
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold transition-all shadow-xs cursor-pointer"
                            >
                              <span>Actions</span>
                              <ChevronDown size={12} />
                            </button>

                            {/* Dropdown Menu */}
                            {isActionOpen && (
                              <div className="absolute left-3 mt-1 w-44 rounded-xl bg-[#0c0827] border border-white/15 shadow-2xl z-50 py-1.5 text-left text-xs animate-in fade-in zoom-in-95 duration-100">
                                {/* View */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setViewingCustomer(cust);
                                    setOpenActionId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <Eye size={13} className="text-cyan-400" />
                                  <span>View</span>
                                </button>

                                {/* Edit */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCustomer(cust);
                                    setIsAddModalOpen(true);
                                    setOpenActionId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <Edit3 size={13} className="text-amber-400" />
                                  <span>Edit</span>
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCustomer(cust.id || '')}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>

                                <div className="h-px bg-white/10 my-1" />

                                {/* Deactivate / Activate */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(cust.id || '')}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <Power size={13} className="text-indigo-400" />
                                  <span>{cust.status === 'inactive' ? 'Activate' : 'Deactivate'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Contact ID */}
                      {isColVisible('contactId') && (
                        <td className="px-3.5 py-2.5 font-medium text-cyan-300">
                          {cust.contactId}
                        </td>
                      )}

                      {/* Business Name */}
                      {isColVisible('businessName') && (
                        <td className="px-3.5 py-2.5">
                          {cust.businessName || '-'}
                        </td>
                      )}

                      {/* Name */}
                      {isColVisible('name') && (
                        <td className="px-3.5 py-2.5 font-semibold text-white">
                          {cust.name}
                        </td>
                      )}

                      {/* Email */}
                      {isColVisible('email') && (
                        <td className="px-3.5 py-2.5 text-slate-400">
                          {cust.email || '-'}
                        </td>
                      )}

                      {/* Tax number */}
                      {isColVisible('taxNumber') && (
                        <td className="px-3.5 py-2.5 text-slate-400">
                          {cust.taxNumber || '-'}
                        </td>
                      )}

                      {/* Credit Limit */}
                      {isColVisible('creditLimit') && (
                        <td className="px-3.5 py-2.5 text-right font-medium">
                          ৳ {cust.creditLimit ? Number(cust.creditLimit).toFixed(2) : '0.00'}
                        </td>
                      )}

                      {/* Pay term */}
                      {isColVisible('payTerm') && (
                        <td className="px-3.5 py-2.5 text-center text-slate-400">
                          {cust.payTermNumber ? `${cust.payTermNumber} ${cust.payTermType}` : '-'}
                        </td>
                      )}

                      {/* Opening Balance */}
                      {isColVisible('openingBalance') && (
                        <td className="px-3.5 py-2.5 text-right text-emerald-400 font-medium">
                          ৳ {(cust.openingBalance || 0).toFixed(2)}
                        </td>
                      )}

                      {/* Advance Balance */}
                      {isColVisible('advanceBalance') && (
                        <td className="px-3.5 py-2.5 text-right text-cyan-400 font-medium">
                          ৳ {(cust.advanceBalance || 0).toFixed(2)}
                        </td>
                      )}

                      {/* Added On */}
                      {isColVisible('addedOn') && (
                        <td className="px-3.5 py-2.5 text-slate-400">
                          {cust.addedOn || '-'}
                        </td>
                      )}

                      {/* Customer Group */}
                      {isColVisible('customerGroup') && (
                        <td className="px-3.5 py-2.5 text-slate-400">
                          {cust.customerGroup || '-'}
                        </td>
                      )}

                      {/* Address */}
                      {isColVisible('address') && (
                        <td className="px-3.5 py-2.5 text-slate-400 max-w-[150px] truncate">
                          {[cust.addressLine1, cust.city, cust.country].filter(Boolean).join(', ') || '-'}
                        </td>
                      )}

                      {/* Mobile */}
                      {isColVisible('mobile') && (
                        <td className="px-3.5 py-2.5 text-slate-300">
                          {cust.mobile || '-'}
                        </td>
                      )}

                      {/* Total Sale Due */}
                      {isColVisible('totalSaleDue') && (
                        <td className="px-3.5 py-2.5 text-right font-medium text-rose-400">
                          <div className="flex flex-col items-end leading-tight">
                            <span className="text-[10px] text-slate-400">৳</span>
                            <span>{(cust.totalSaleDue || 0).toFixed(2)}</span>
                          </div>
                        </td>
                      )}

                      {/* Total Sell Return Due */}
                      {isColVisible('totalSellReturnDue') && (
                        <td className="px-3.5 py-2.5 text-right font-medium text-amber-400">
                          ৳ {(cust.totalSellReturnDue || 0).toFixed(2)}
                        </td>
                      )}

                      {/* Custom Fields 1 - 10 */}
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const fieldKey = `customField${num}` as keyof CustomerFormData;
                        return isColVisible(fieldKey) ? (
                          <td key={fieldKey} className="px-3.5 py-2.5 text-slate-400">
                            {(cust[fieldKey] as string) || '-'}
                          </td>
                        ) : null;
                      })}
                    </tr>
                  );
                })
              )}

              {/* Summary Total Row matching screenshot */}
              {sortedCustomers.length > 0 && (
                <tr className="bg-white/[0.04] font-bold text-white border-t border-white/15">
                  <td
                    className="px-3.5 py-3 text-center"
                    colSpan={
                      // Count visible columns before totalSaleDue
                      columns.filter(
                        (c) =>
                          c.visible &&
                          ![
                            'totalSaleDue',
                            'totalSellReturnDue',
                            'customField1',
                            'customField2',
                            'customField3',
                            'customField4',
                            'customField5',
                            'customField6',
                            'customField7',
                            'customField8',
                            'customField9',
                            'customField10',
                          ].includes(c.id)
                      ).length
                    }
                  >
                    Total:
                  </td>

                  {isColVisible('totalSaleDue') && (
                    <td className="px-3.5 py-3 text-right text-rose-400">
                      <div className="flex flex-col items-end leading-tight">
                        <span className="text-[10px] text-slate-400 font-bold">৳</span>
                        <span>{totalSalesDueSum.toFixed(2)}</span>
                      </div>
                    </td>
                  )}

                  {isColVisible('totalSellReturnDue') && (
                    <td className="px-3.5 py-3 text-right text-amber-400">
                      ৳ {totalSellReturnDueSum.toFixed(2)}
                    </td>
                  )}

                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const fieldKey = `customField${num}`;
                    return isColVisible(fieldKey) ? (
                      <td key={fieldKey} className="px-3.5 py-3"></td>
                    ) : null;
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs text-slate-400">
          <div>
            Showing {sortedCustomers.length > 0 ? 1 : 0} to{' '}
            {Math.min(entriesCount, sortedCustomers.length)} of {sortedCustomers.length} entries
          </div>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              disabled
              className="px-3 py-1 rounded-lg bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-violet-600 text-white font-bold shadow-xs cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="px-3 py-1 rounded-lg bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
        initialData={editingCustomer}
      />

      {/* View Customer Modal */}
      <ViewCustomerModal
        isOpen={Boolean(viewingCustomer)}
        onClose={() => setViewingCustomer(null)}
        customer={viewingCustomer}
      />
    </div>
  );
}
