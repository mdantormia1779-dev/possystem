"use client";

import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, ArrowUpDown } from 'lucide-react';
import { FiChevronUp } from 'react-icons/fi';
import ExportToolbar, { ColumnOption } from '@/app/Components/Dashboard/ExportToolbar';
import { ColumnDef, exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';
import AddVariationModal, { VariationItem } from './AddVariationModal';

const initialVariations: VariationItem[] = [
  {
    id: '1',
    name: 'Size',
    values: ['Small', 'Medium', 'Large', 'XL'],
  },
  {
    id: '2',
    name: 'Color',
    values: ['Red', 'Blue', 'Black', 'Silver'],
  },
  {
    id: '3',
    name: 'Capacity',
    values: ['128GB', '256GB', '512GB'],
  },
];

export default function VariationsPage() {
  const [variations, setVariations] = useState<VariationItem[]>(initialVariations);
  const [entriesCount, setEntriesCount] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sorting
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVariation, setEditingVariation] = useState<VariationItem | null>(null);

  // Columns visibility
  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: 'name', label: 'Variations', visible: true },
    { id: 'values', label: 'Values', visible: true },
    { id: 'action', label: 'Action', visible: true },
  ]);

  const isColVisible = (id: string) => columns.find((c) => c.id === id)?.visible ?? true;

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  // Filter & Search
  const filteredVariations = variations.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.values.some((v) => v.toLowerCase().includes(q))
    );
  });

  const sortedVariations = [...filteredVariations].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedVariations.length / entriesCount));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedVariations = sortedVariations.slice(
    (safeCurrentPage - 1) * entriesCount,
    safeCurrentPage * entriesCount
  );
  const startEntry = sortedVariations.length === 0 ? 0 : (safeCurrentPage - 1) * entriesCount + 1;
  const endEntry = Math.min(safeCurrentPage * entriesCount, sortedVariations.length);

  // Export definitions
  const exportColumns: ColumnDef<VariationItem>[] = [
    { id: 'name', label: 'Variations', accessor: (v: VariationItem) => v.name },
    { id: 'values', label: 'Values', accessor: (v: VariationItem) => v.values.join(', ') },
  ];

  const handleExportCSV = () => exportToCSV('variations', exportColumns, sortedVariations);
  const handleExportExcel = () => exportToExcel('variations', exportColumns, sortedVariations);
  const handlePrint = () => printTable('Variations List', exportColumns, sortedVariations);
  const handleExportPDF = () => exportToPDF('Variations List', exportColumns, sortedVariations);

  // Handlers
  const handleSaveVariation = (data: { name: string; values: string[] }) => {
    if (editingVariation) {
      setVariations((prev) =>
        prev.map((v) => (v.id === editingVariation.id ? { ...v, ...data } : v))
      );
      setEditingVariation(null);
    } else {
      const newVar: VariationItem = {
        id: String(Date.now()),
        name: data.name,
        values: data.values,
      };
      setVariations((prev) => [newVar, ...prev]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this variation?')) {
      setVariations((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="space-y-6 select-none font-sans pb-16">
      {/* Header (matching media_1789382347832.png) */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight flex items-center gap-2">
          <span>Variations</span>
          <span className="text-xs font-normal text-slate-400">Manage product variations</span>
        </h1>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            All variations
          </h2>

          <button
            type="button"
            onClick={() => {
              setEditingVariation(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/30 active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add</span>
          </button>
        </div>

        {/* Toolbar Bar: Entries, Export, Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Show Entries */}
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span>Show</span>
              <select
                value={entriesCount}
                onChange={(e) => {
                  setEntriesCount(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#0c0827] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            {/* Export Toolbar */}
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
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search ..."
              className="bg-[#0c0827] border border-white/15 rounded-xl pl-8 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 w-full sm:w-48"
            />
            <Search size={13} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
                {isColVisible('name') && (
                  <th
                    className="px-4 py-3 cursor-pointer hover:text-white"
                    onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Variations</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                {isColVisible('values') && <th className="px-4 py-3">Values</th>}
                {isColVisible('action') && <th className="px-4 py-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {paginatedVariations.length === 0 ? (
                <tr>
                  <td colSpan={columns.filter((c) => c.visible).length} className="text-center py-10 text-slate-400">
                    No variations found
                  </td>
                </tr>
              ) : (
                paginatedVariations.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                    {isColVisible('name') && (
                      <td className="px-4 py-3 font-semibold text-white">
                        {v.name}
                      </td>
                    )}
                    {isColVisible('values') && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {v.values.map((val, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-cyan-300 text-[11px]"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      </td>
                    )}
                    {isColVisible('action') && (
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVariation(v);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(v.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: Showing entries & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 text-xs text-slate-400">
          <div>
            Showing {startEntry} to {endEntry} of {sortedVariations.length} entries
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

      {/* Add / Edit Variation Modal (matching media_1789382378427.png) */}
      <AddVariationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVariation(null);
        }}
        onSave={handleSaveVariation}
        editVariation={editingVariation}
      />

      {/* Footer */}
      <footer className="mt-8 text-[11px] text-slate-500 flex items-center justify-between max-w-7xl mx-auto w-full pt-4">
        <span>DATABYTE - V6.5 | Copyright © 2026 All rights reserved.</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-7 h-7 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
          title="Scroll to top"
        >
          <FiChevronUp className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
