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

  // Quick View Modal
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);

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

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      alert('Please select products to delete.');
      return;
    }
    if (confirm(`Delete ${selectedIds.length} selected product(s)?`)) {
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
  };

  // Bulk Deactivate
  const handleBulkDeactivate = () => {
    if (selectedIds.length === 0) {
      alert('Please select products to deactivate.');
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'inactive' } : p))
    );
    setSelectedIds([]);
  };

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
                sortedProducts.slice(0, entriesCount).map((prod) => {
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
                                  onClick={() => handleDeleteProduct(prod.id)}
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
                          {prod.name}
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

        {/* 5. Bulk Action Toolbar (matching screenshot below table) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-white/10 mt-4">
          <button
            type="button"
            onClick={handleBulkDelete}
            className="px-3 py-1.5 rounded-lg border border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Delete Selected
          </button>
          <button
            type="button"
            onClick={() => alert(`Added ${selectedIds.length} items to location.`)}
            className="px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Add to location
          </button>
          <button
            type="button"
            onClick={() => alert(`Removed ${selectedIds.length} items from location.`)}
            className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Remove from location
          </button>
          <button
            type="button"
            onClick={handleBulkDeactivate}
            className="px-3 py-1.5 rounded-lg border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Deactivate Selected
          </button>
          <div title="Bulk actions apply to all checked items above" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
            <Info size={15} />
          </div>
        </div>

        {/* 6. Footer: Showing entries & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs text-slate-400">
          <div>
            Showing {sortedProducts.length > 0 ? 1 : 0} to{' '}
            {Math.min(entriesCount, sortedProducts.length)} of {sortedProducts.length} entries
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

      {/* Quick View Product Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0e0a2b] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-6 text-xs text-slate-200 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{viewingProduct.name}</h3>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 divide-y divide-white/10">
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">SKU:</span>
                <span className="font-mono text-cyan-300">{viewingProduct.sku}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Brand:</span>
                <span>{viewingProduct.brand || '-'}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Location:</span>
                <span>{viewingProduct.businessLocation}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Purchase Price:</span>
                <span className="text-emerald-400 font-bold">৳ {viewingProduct.purchasePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Selling Price:</span>
                <span className="text-indigo-300 font-bold">৳ {viewingProduct.sellingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Current Stock:</span>
                <span className="text-amber-400 font-bold">{viewingProduct.currentStock} {viewingProduct.unit}</span>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
