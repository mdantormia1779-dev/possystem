"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  ChevronDown, 
  ArrowUpDown, 
  Filter, 
  Download, 
  Package, 
  Hourglass, 
  Eye, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  Info,
  Power,
  Copy,
  Layers,
  History
} from 'lucide-react';
import ExportToolbar, { ColumnOption } from '@/app/Components/Dashboard/ExportToolbar';
import { ColumnDef, exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';
import ViewProductModal from './ViewProductModal';
import DeleteProductModal from './DeleteProductModal';
import { 
  BulkDeleteModal, 
  AddToLocationModal, 
  RemoveFromLocationModal, 
  BulkDeactivateModal 
} from './BulkActionModals';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  barcodeType?: string;
  unit: string;
  brand?: string;
  category?: string;
  businessLocation: string;
  manageStock?: boolean;
  alertQuantity?: number | string;
  description?: string;
  image?: string;
  tax?: string;
  productType: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  status: 'active' | 'inactive';
}

const initialProducts: ProductItem[] = [
  {
    id: '1',
    name: 'Head Light',
    sku: '0003',
    barcodeType: 'Code 128 (C128)',
    unit: 'Pieces',
    brand: 'Robin',
    category: '-',
    businessLocation: 'RANGPUR BIKE PARLOUR',
    manageStock: true,
    alertQuantity: 5,
    tax: '-',
    productType: 'Single',
    purchasePrice: 5000.0,
    sellingPrice: 25000.0,
    currentStock: 0.0,
    status: 'active',
  },
  {
    id: '2',
    name: 'MOBILE STAND',
    sku: '0002',
    barcodeType: 'Code 128 (C128)',
    unit: 'Pieces',
    brand: 'MOTO WOLF',
    category: '-',
    businessLocation: 'RANGPUR BIKE PARLOUR',
    manageStock: true,
    alertQuantity: 10,
    tax: '-',
    productType: 'Single',
    purchasePrice: 1000.0,
    sellingPrice: 1200.0,
    currentStock: 33.0,
    status: 'active',
  },
  {
    id: '3',
    name: 'TEST',
    sku: '00017896036',
    barcodeType: 'Code 128 (C128)',
    unit: 'Pieces',
    brand: 'WD',
    category: '-',
    businessLocation: 'RANGPUR BIKE PARLOUR',
    manageStock: true,
    alertQuantity: 2,
    tax: '-',
    productType: 'Single',
    purchasePrice: 400.0,
    sellingPrice: 720.0,
    currentStock: 0.0,
    status: 'active',
  },
  {
    id: '4',
    name: 'WD 400',
    sku: '0001',
    barcodeType: 'Code 128 (C128)',
    unit: 'Pieces',
    brand: 'WD',
    category: '-',
    businessLocation: 'RANGPUR BIKE PARLOUR',
    manageStock: true,
    alertQuantity: 5,
    tax: '-',
    productType: 'Single',
    purchasePrice: 120.0,
    sellingPrice: 160.0,
    currentStock: 0.0,
    status: 'active',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<'all' | 'stock'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [entriesCount, setEntriesCount] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected row checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter criteria
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  // Actions dropdown active row
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  // Modals
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Bulk Action Modals
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isAddToLocationOpen, setIsAddToLocationOpen] = useState(false);
  const [isRemoveFromLocationOpen, setIsRemoveFromLocationOpen] = useState(false);
  const [isBulkDeactivateOpen, setIsBulkDeactivateOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterCategory, filterBrand, filterLocation, activeTab, entriesCount]);

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
    { id: 'image', label: 'Product Image', visible: true },
    { id: 'action', label: 'Action', visible: true },
    { id: 'name', label: 'Product', visible: true },
    { id: 'businessLocation', label: 'Business Location', visible: true },
    { id: 'purchasePrice', label: 'Unit Purchase Price', visible: true },
    { id: 'sellingPrice', label: 'Selling Price', visible: true },
    { id: 'currentStock', label: 'Current stock', visible: true },
    { id: 'productType', label: 'Product Type', visible: true },
    { id: 'category', label: 'Category', visible: true },
    { id: 'brand', label: 'Brand', visible: true },
    { id: 'tax', label: 'Tax', visible: true },
    { id: 'sku', label: 'SKU', visible: true },
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
  const [sortField, setSortField] = useState<keyof ProductItem>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof ProductItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Checkbox helpers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter logic
  const filteredProducts = products.filter((prod) => {
    if (activeTab === 'stock' && prod.currentStock <= 0) return false;
    if (filterType !== 'all' && prod.productType !== filterType) return false;
    if (filterCategory !== 'all' && prod.category !== filterCategory) return false;
    if (filterBrand !== 'all' && prod.brand !== filterBrand) return false;
    if (filterLocation !== 'all' && prod.businessLocation !== filterLocation) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      prod.name.toLowerCase().includes(q) ||
      prod.sku.toLowerCase().includes(q) ||
      (prod.brand && prod.brand.toLowerCase().includes(q)) ||
      prod.businessLocation.toLowerCase().includes(q)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const valA = a[sortField] ?? '';
    const valB = b[sortField] ?? '';
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return sortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Export Columns definition
  const exportColumns: ColumnDef<ProductItem>[] = [
    { id: 'name', label: 'Product', accessor: (p: ProductItem) => p.name },
    { id: 'businessLocation', label: 'Business Location', accessor: (p: ProductItem) => p.businessLocation },
    { id: 'purchasePrice', label: 'Unit Purchase Price', accessor: (p: ProductItem) => `৳ ${p.purchasePrice.toFixed(2)}` },
    { id: 'sellingPrice', label: 'Selling Price', accessor: (p: ProductItem) => `৳ ${p.sellingPrice.toFixed(2)}` },
    { id: 'currentStock', label: 'Current stock', accessor: (p: ProductItem) => `${p.currentStock.toFixed(2)} ${p.unit}` },
    { id: 'productType', label: 'Product Type', accessor: (p: ProductItem) => p.productType },
    { id: 'category', label: 'Category', accessor: (p: ProductItem) => p.category || '-' },
    { id: 'brand', label: 'Brand', accessor: (p: ProductItem) => p.brand || '-' },
    { id: 'tax', label: 'Tax', accessor: (p: ProductItem) => p.tax || '-' },
    { id: 'sku', label: 'SKU', accessor: (p: ProductItem) => p.sku },
  ].filter((c) => isColVisible(c.id));

  // Export Handlers
  const handleExportCSV = () => exportToCSV('products', exportColumns, sortedProducts);
  const handleExportExcel = () => exportToExcel('products', exportColumns, sortedProducts);
  const handlePrint = () => printTable('Products List', exportColumns, sortedProducts);
  const handleExportPDF = () => exportToPDF('Products List', exportColumns, sortedProducts);

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      setOpenActionId(null);
    }
  };

  // Bulk Handlers & Triggers
  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one product using the checkboxes.', 'warning');
      return;
    }
    setIsBulkDeleteOpen(true);
  };

  const handleAddToLocationClick = () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one product using the checkboxes.', 'warning');
      return;
    }
    setIsAddToLocationOpen(true);
  };

  const handleRemoveFromLocationClick = () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one product using the checkboxes.', 'warning');
      return;
    }
    setIsRemoveFromLocationOpen(true);
  };

  const handleBulkDeactivateClick = () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one product using the checkboxes.', 'warning');
      return;
    }
    setIsBulkDeactivateOpen(true);
  };

  // Bulk Confirmations
  const confirmBulkDelete = () => {
    const count = selectedIds.length;
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
    showToast(`Successfully deleted ${count} product(s).`, 'success');
  };

  const confirmAddToLocation = (loc: string) => {
    const count = selectedIds.length;
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, businessLocation: loc } : p))
    );
    setSelectedIds([]);
    setIsAddToLocationOpen(false);
    showToast(`Successfully assigned location "${loc}" to ${count} product(s).`, 'success');
  };

  const confirmRemoveFromLocation = (loc: string) => {
    const count = selectedIds.length;
    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id)
          ? {
              ...p,
              businessLocation:
                loc === 'All Locations'
                  ? '-'
                  : p.businessLocation === loc
                  ? '-'
                  : p.businessLocation,
            }
          : p
      )
    );
    setSelectedIds([]);
    setIsRemoveFromLocationOpen(false);
    showToast(`Successfully removed location for ${count} product(s).`, 'success');
  };

  const confirmBulkDeactivate = (action: 'deactivate' | 'activate') => {
    const count = selectedIds.length;
    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id)
          ? { ...p, status: action === 'deactivate' ? 'inactive' : 'active' }
          : p
      )
    );
    setSelectedIds([]);
    setIsBulkDeactivateOpen(false);
    showToast(
      `Successfully ${action === 'deactivate' ? 'deactivated' : 'activated'} ${count} product(s).`,
      'success'
    );
  };

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / entriesCount));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = sortedProducts.slice(
    (safeCurrentPage - 1) * entriesCount,
    safeCurrentPage * entriesCount
  );
  const startEntry = sortedProducts.length === 0 ? 0 : (safeCurrentPage - 1) * entriesCount + 1;
  const endEntry = Math.min(safeCurrentPage * entriesCount, sortedProducts.length);

  const visibleColCount = columns.filter((c) => c.visible).length + 1; // +1 for checkbox

  return (
    <div className="space-y-5 select-none font-sans pb-10">
      {/* 1. Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight flex items-center gap-2">
          <span>Products</span>
          <span className="text-xs font-normal text-slate-400">Manage your products</span>
        </h1>
      </div>

      {/* 2. Collapsible Filters Card */}
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
          <div className="px-5 sm:px-6 py-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-in fade-in duration-200">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Product Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-[#0c0827] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Single">Single</option>
                <option value="Variable">Variable</option>
                <option value="Combo">Combo</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Brand:</label>
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full bg-[#0c0827] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="all">All Brands</option>
                <option value="Robin">Robin</option>
                <option value="MOTO WOLF">MOTO WOLF</option>
                <option value="WD">WD</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">Business Location:</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-[#0c0827] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="all">All Locations</option>
                <option value="RANGPUR BIKE PARLOUR">RANGPUR BIKE PARLOUR</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Products Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-7 overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
          <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Tabs & Top Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
          {/* Tabs: All Products / Stock Report */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Package size={15} />
              <span>All Products</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stock')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'stock'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Hourglass size={15} />
              <span>Stock Report</span>
            </button>
          </div>

          {/* Top Right: + Add and Download Excel */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Link
              href="/dashboard/products/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add</span>
            </Link>

            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Download size={14} />
              <span>Download Excel</span>
            </button>
          </div>
        </div>

        {/* Control Bar: Show entries, ExportToolbar, Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
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

            {/* Functional Export Toolbar */}
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
              placeholder="Search ..."
              className="w-full sm:w-48 md:w-60 bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* 4. Products Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0c0827]/60">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-300 font-semibold">
                {/* Select All Checkbox */}
                <th className="px-3.5 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    className="accent-violet-500 rounded cursor-pointer"
                  />
                </th>

                {isColVisible('image') && (
                  <th className="px-3.5 py-3 text-center">Product image</th>
                )}

                {isColVisible('action') && (
                  <th className="px-3.5 py-3 text-center">Action</th>
                )}

                {isColVisible('name') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Product</span>
                      <Info size={12} className="text-cyan-400" />
                      <ArrowUpDown size={12} className="text-slate-400 ml-0.5" />
                    </div>
                  </th>
                )}

                {isColVisible('businessLocation') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('businessLocation')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Business Location</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('purchasePrice') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('purchasePrice')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Unit Purchase Price</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('sellingPrice') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('sellingPrice')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Selling Price</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('currentStock') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('currentStock')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Current stock</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('productType') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('productType')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Product Type</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('category') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Category</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('brand') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('brand')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Brand</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('tax') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('tax')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Tax</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('sku') && (
                  <th
                    className="px-3.5 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('sku')}
                  >
                    <div className="flex items-center gap-1">
                      <span>SKU</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-slate-300">
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={visibleColCount} className="text-center py-10 text-slate-400">
                    No products found matching criteria
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => {
                  const isActionOpen = openActionId === prod.id;
                  const isChecked = selectedIds.includes(prod.id);

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="px-3.5 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(prod.id)}
                          className="accent-violet-500 rounded cursor-pointer"
                        />
                      </td>

                      {/* Product Image */}
                      {isColVisible('image') && (
                        <td className="px-3.5 py-2.5 text-center">
                          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
                            <ImageIcon size={16} />
                          </div>
                        </td>
                      )}

                      {/* Action Dropdown */}
                      {isColVisible('action') && (
                        <td className="px-3.5 py-2.5 text-center relative">
                          <div
                            className="inline-block text-left"
                            ref={isActionOpen ? actionMenuRef : null}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenActionId(isActionOpen ? null : prod.id)
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold transition-all shadow-xs cursor-pointer"
                            >
                              <span>Actions</span>
                              <ChevronDown size={12} />
                            </button>

                            {isActionOpen && (
                              <div className="absolute left-3 mt-1 w-44 rounded-xl bg-[#0c0827] border border-white/15 shadow-2xl z-50 py-1.5 text-left text-xs animate-in fade-in zoom-in-95 duration-100">
                                {/* View */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setViewingProduct(prod);
                                    setOpenActionId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <Eye size={13} className="text-cyan-400" />
                                  <span>View</span>
                                </button>

                                {/* Edit */}
                                <Link
                                  href={`/dashboard/products/create?editId=${prod.id}`}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <Edit3 size={13} className="text-amber-400" />
                                  <span>Edit</span>
                                </Link>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeletingProduct(prod);
                                    setOpenActionId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>

                                <div className="h-px bg-white/10 my-1" />

                                {/* Duplicate */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const duplicated: ProductItem = {
                                      ...prod,
                                      id: String(Date.now()),
                                      name: `${prod.name} (Copy)`,
                                      sku: `${prod.sku}-COPY`,
                                    };
                                    setProducts((prev) => [duplicated, ...prev]);
                                    setOpenActionId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <Copy size={13} className="text-indigo-400" />
                                  <span>Duplicate</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Product Name */}
                      {isColVisible('name') && (
                        <td className="px-3.5 py-2.5 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span>{prod.name}</span>
                            {prod.status === 'inactive' && (
                              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Business Location */}
                      {isColVisible('businessLocation') && (
                        <td className="px-3.5 py-2.5 text-slate-300">
                          {prod.businessLocation}
                        </td>
                      )}

                      {/* Unit Purchase Price */}
                      {isColVisible('purchasePrice') && (
                        <td className="px-3.5 py-2.5 text-slate-200">
                          ৳ {prod.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      )}

                      {/* Selling Price */}
                      {isColVisible('sellingPrice') && (
                        <td className="px-3.5 py-2.5 text-slate-200">
                          ৳ {prod.sellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      )}

                      {/* Current Stock */}
                      {isColVisible('currentStock') && (
                        <td className="px-3.5 py-2.5">
                          <span
                            className={`font-semibold ${
                              prod.currentStock > 0 ? 'text-emerald-400' : 'text-slate-400'
                            }`}
                          >
                            {prod.currentStock.toFixed(2)} {prod.unit}
                          </span>
                        </td>
                      )}

                      {/* Product Type */}
                      {isColVisible('productType') && (
                        <td className="px-3.5 py-2.5 text-slate-300">
                          {prod.productType}
                        </td>
                      )}

                      {/* Category */}
                      {isColVisible('category') && (
                        <td className="px-3.5 py-2.5 text-slate-400">
                          {prod.category || '-'}
                        </td>
                      )}

                      {/* Brand */}
                      {isColVisible('brand') && (
                        <td className="px-3.5 py-2.5 text-slate-300">
                          {prod.brand || '-'}
                        </td>
                      )}

                      {/* Tax */}
                      {isColVisible('tax') && (
                        <td className="px-3.5 py-2.5 text-slate-400">
                          {prod.tax || '-'}
                        </td>
                      )}

                      {/* SKU */}
                      {isColVisible('sku') && (
                        <td className="px-3.5 py-2.5 text-cyan-300 font-mono">
                          {prod.sku}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Bulk Action Toolbar (matching screenshot media_1789381117002.png) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-white/10 mt-4">
          <button
            type="button"
            onClick={handleBulkDeleteClick}
            className="px-3.5 py-1.5 rounded-xl border border-rose-400 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            <span>Delete Selected</span>
            {selectedIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-[10px] font-bold">
                {selectedIds.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleAddToLocationClick}
            className="px-3.5 py-1.5 rounded-xl border border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/15 text-cyan-400 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            <span>Add to location</span>
            {selectedIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-[10px] font-bold">
                {selectedIds.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleRemoveFromLocationClick}
            className="px-3.5 py-1.5 rounded-xl border border-slate-400 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            <span>Remove from location</span>
            {selectedIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/15 text-[10px] font-bold">
                {selectedIds.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleBulkDeactivateClick}
            className="px-3.5 py-1.5 rounded-xl border border-amber-400 bg-amber-500/5 hover:bg-amber-500/15 text-amber-400 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            <span>Deactivate Selected</span>
            {selectedIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] font-bold">
                {selectedIds.length}
              </span>
            )}
          </button>

          {/* Tooltip (i) */}
          <div className="relative group inline-flex items-center">
            <button
              type="button"
              className="w-4 h-4 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors shadow-xs"
              title="Bulk actions info"
            >
              i
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col items-center w-56 p-2 rounded-xl bg-[#0c0827] border border-white/20 text-[11px] text-slate-200 shadow-xl z-50 text-center pointer-events-none">
              <span>Select checkboxes in the table to apply bulk actions to multiple products simultaneously.</span>
              <div className="w-2 h-2 bg-[#0c0827] border-r border-b border-white/20 rotate-45 -mb-3 mt-1" />
            </div>
          </div>
        </div>

        {/* 6. Footer: Showing entries & Pagination (matching media_1789381117002.png) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs text-slate-400">
          <div>
            Showing {startEntry} to {endEntry} of {sortedProducts.length} entries
          </div>

          <div className="flex items-center gap-1 self-end sm:self-auto select-none">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                safeCurrentPage <= 1
                  ? 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white cursor-pointer'
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  safeCurrentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                safeCurrentPage >= totalPages
                  ? 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[120] max-w-sm rounded-2xl bg-[#120e34] border border-white/15 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 flex items-start gap-3 text-xs">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-slate-200 leading-relaxed font-medium">
            {toast.message}
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* View Product Details Modal (matching screenshot media_1789380389875.png) */}
      <ViewProductModal
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
        product={viewingProduct}
      />

      {/* Single Delete Product Confirmation Modal */}
      <DeleteProductModal
        isOpen={!!deletingProduct}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) {
            setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
            setSelectedIds((prev) => prev.filter((id) => id !== deletingProduct.id));
            setDeletingProduct(null);
            showToast(`Deleted product "${deletingProduct.name}".`, 'success');
          }
        }}
      />

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteOpen}
        selectedProducts={products.filter((p) => selectedIds.includes(p.id))}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
      />

      {/* Add To Location Modal */}
      <AddToLocationModal
        isOpen={isAddToLocationOpen}
        selectedCount={selectedIds.length}
        onClose={() => setIsAddToLocationOpen(false)}
        onConfirm={confirmAddToLocation}
      />

      {/* Remove From Location Modal */}
      <RemoveFromLocationModal
        isOpen={isRemoveFromLocationOpen}
        selectedCount={selectedIds.length}
        onClose={() => setIsRemoveFromLocationOpen(false)}
        onConfirm={confirmRemoveFromLocation}
      />

      {/* Bulk Deactivate Modal */}
      <BulkDeactivateModal
        isOpen={isBulkDeactivateOpen}
        selectedCount={selectedIds.length}
        hasActive={products
          .filter((p) => selectedIds.includes(p.id))
          .some((p) => p.status !== 'inactive')}
        onClose={() => setIsBulkDeactivateOpen(false)}
        onConfirm={confirmBulkDeactivate}
      />

    </div>
  );
}
