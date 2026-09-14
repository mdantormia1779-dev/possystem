"use client";

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  FileSpreadsheet,
  Printer,
  FileText,
  Columns3,
  X,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { FiChevronUp } from 'react-icons/fi';

interface PriceGroup {
  id: string;
  name: string;
  description: string;
}

export default function SellingPriceGroupPage() {
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceGroup | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalError, setModalError] = useState('');

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PriceGroup | null>(null);

  // Filtered entries
  const filteredGroups = useMemo(() => {
    return priceGroups.filter((g) => {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      );
    });
  }, [priceGroups, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / entriesPerPage));
  const displayedGroups = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredGroups.slice(start, start + entriesPerPage);
  }, [filteredGroups, currentPage, entriesPerPage]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setModalName('');
    setModalDescription('');
    setModalError('');
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (item: PriceGroup) => {
    setEditingItem(item);
    setModalName(item.name);
    setModalDescription(item.description);
    setModalError('');
    setIsAddEditModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) {
      setModalError('Name is required.');
      return;
    }

    if (editingItem) {
      setPriceGroups((prev) =>
        prev.map((g) =>
          g.id === editingItem.id
            ? { ...g, name: modalName.trim(), description: modalDescription.trim() }
            : g
        )
      );
    } else {
      const newGroup: PriceGroup = {
        id: Date.now().toString(),
        name: modalName.trim(),
        description: modalDescription.trim(),
      };
      setPriceGroups((prev) => [newGroup, ...prev]);
    }

    setIsAddEditModalOpen(false);
    setEditingItem(null);
    setModalName('');
    setModalDescription('');
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setPriceGroups((prev) => prev.filter((g) => g.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Description'];
    const rows = filteredGroups.map((g) => [g.name, g.description]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'selling_price_groups.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Selling Price Group
        </h1>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-6 sm:p-7 space-y-5">
        {/* Card Header & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              All Selling Price Group
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Set multiple price for products. Name different price and then update price from &quot;Update Price&quot; or List Products -&gt; Actions -&gt; Add or edit Group prices
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 active:scale-95 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add</span>
          </button>
        </div>

        {/* Controls: Show Entries, Export Buttons, Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Show Entries */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#0c0827] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            {/* Export buttons */}
            <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5 text-xs">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-2.5 py-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Export CSV"
              >
                <FileSpreadsheet size={13} className="text-emerald-400" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-2.5 py-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 border-l border-white/10 cursor-pointer"
                title="Export Excel"
              >
                <FileSpreadsheet size={13} className="text-emerald-400" />
                <span className="hidden sm:inline">Export Excel</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-2.5 py-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 border-l border-white/10 cursor-pointer"
                title="Print Table"
              >
                <Printer size={13} className="text-cyan-400" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                type="button"
                className="px-2.5 py-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 border-l border-white/10 cursor-pointer"
                title="Column visibility"
              >
                <Columns3 size={13} className="text-violet-400" />
                <span className="hidden sm:inline">Column visibility</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-2.5 py-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 border-l border-white/10 cursor-pointer"
                title="Export PDF"
              >
                <FileText size={13} className="text-rose-400" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search ..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-[#0c0827] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
                <th className="px-6 py-3 min-w-[200px]">Name</th>
                <th className="px-6 py-3 min-w-[320px]">Description</th>
                <th className="px-6 py-3 w-32 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {displayedGroups.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400 text-xs">
                    No data available in table
                  </td>
                </tr>
              ) : (
                displayedGroups.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 font-medium text-white">{item.name}</td>
                    <td className="px-6 py-3.5 text-slate-400">{item.description || '-'}</td>
                    <td className="px-6 py-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setItemToDelete(item);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-2">
          <div>
            Showing{' '}
            {filteredGroups.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to{' '}
            {Math.min(currentPage * entriesPerPage, filteredGroups.length)} of{' '}
            {filteredGroups.length} entries
          </div>

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Selling Price Group Modal (matching media_1789382972462.png) */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsAddEditModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 overflow-hidden z-10 flex flex-col text-slate-200 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e0a2b]">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {editingItem ? 'Edit Selling Price Group' : 'Add Selling Price Group'}
              </h2>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4 text-xs">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  {modalError}
                </div>
              )}

              {/* Name:* */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Name:<span className="text-rose-400 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => {
                    setModalName(e.target.value);
                    if (modalError) setModalError('');
                  }}
                  placeholder="Name"
                  autoFocus
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                />
              </div>

              {/* Description: */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Description:
                </label>
                <textarea
                  rows={4}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 resize-y"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition-all shadow-md shadow-violet-600/30 active:scale-95 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#242b35] hover:bg-[#2e3744] text-slate-200 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsDeleteModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-[#120e34] rounded-2xl p-6 border border-white/15 shadow-2xl z-10 text-slate-200">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle size={22} />
              <h3 className="text-base font-bold text-white">Delete Selling Price Group?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-white">&quot;{itemToDelete.name}&quot;</strong>? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-[11px] text-slate-500 flex items-center justify-between max-w-7xl mx-auto w-full pt-4">
        <span>DATABYTE - v6.5 | Copyright © 2026 All rights reserved.</span>
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
