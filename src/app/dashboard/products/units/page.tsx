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
  Edit,
  Trash2,
  Info,
  AlertTriangle
} from 'lucide-react';
import { FiChevronUp } from 'react-icons/fi';

export interface UnitItem {
  id: string;
  name: string;
  shortName: string;
  allowDecimal: 'Yes' | 'No';
  isMultiple?: boolean;
  baseUnit?: string;
  multiplier?: number;
}

const INITIAL_UNITS: UnitItem[] = [
  {
    id: 'unit-1',
    name: 'Pieces',
    shortName: 'Pc(s)',
    allowDecimal: 'No',
  },
];

export default function UnitsPage() {
  const [units, setUnits] = useState<UnitItem[]>(INITIAL_UNITS);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitItem | null>(null);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [allowDecimal, setAllowDecimal] = useState<'Please Select' | 'Yes' | 'No'>('Please Select');
  const [isMultiple, setIsMultiple] = useState(false);
  const [multiplier, setMultiplier] = useState<string>('1');
  const [baseUnit, setBaseUnit] = useState<string>('');
  const [modalError, setModalError] = useState('');

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<UnitItem | null>(null);

  // Filtered units
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q) ||
        u.allowDecimal.toLowerCase().includes(q)
      );
    });
  }, [units, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUnits.length / entriesPerPage));
  const displayedUnits = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredUnits.slice(start, start + entriesPerPage);
  }, [filteredUnits, currentPage, entriesPerPage]);

  const handleOpenAddModal = () => {
    setEditingUnit(null);
    setName('');
    setShortName('');
    setAllowDecimal('Please Select');
    setIsMultiple(false);
    setMultiplier('1');
    setBaseUnit(units[0]?.name || '');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: UnitItem) => {
    setEditingUnit(item);
    setName(item.name);
    setShortName(item.shortName);
    setAllowDecimal(item.allowDecimal);
    setIsMultiple(!!item.isMultiple);
    setMultiplier(item.multiplier ? item.multiplier.toString() : '1');
    setBaseUnit(item.baseUnit || units[0]?.name || '');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setModalError('Name is required.');
      return;
    }
    if (!shortName.trim()) {
      setModalError('Short name is required.');
      return;
    }
    if (allowDecimal === 'Please Select') {
      setModalError('Allow decimal is required.');
      return;
    }

    if (editingUnit) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === editingUnit.id
            ? {
                ...u,
                name: name.trim(),
                shortName: shortName.trim(),
                allowDecimal,
                isMultiple,
                baseUnit: isMultiple ? baseUnit : undefined,
                multiplier: isMultiple ? Number(multiplier) || 1 : undefined,
              }
            : u
        )
      );
    } else {
      const newUnit: UnitItem = {
        id: Date.now().toString(),
        name: name.trim(),
        shortName: shortName.trim(),
        allowDecimal,
        isMultiple,
        baseUnit: isMultiple ? baseUnit : undefined,
        multiplier: isMultiple ? Number(multiplier) || 1 : undefined,
      };
      setUnits((prev) => [...prev, newUnit]);
    }

    setIsModalOpen(false);
    setEditingUnit(null);
  };

  const handleDeleteConfirm = () => {
    if (unitToDelete) {
      setUnits((prev) => prev.filter((u) => u.id !== unitToDelete.id));
      setIsDeleteModalOpen(false);
      setUnitToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Short name', 'Allow decimal'];
    const rows = filteredUnits.map((u) => [u.name, u.shortName, u.allowDecimal]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'units.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span>Units</span>
          <span className="text-xs sm:text-sm font-normal text-slate-400">
            Manage your units
          </span>
        </h1>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-6 sm:p-7 space-y-5">
        {/* Card Header & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              All your units
            </h2>
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

        {/* Table (matching media_1789382987651.png) */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
                <th className="px-6 py-3 min-w-[160px]">Name</th>
                <th className="px-6 py-3 min-w-[140px]">Short name</th>
                <th className="px-6 py-3 min-w-[160px]">
                  <span className="inline-flex items-center gap-1.5">
                    <span>Allow decimal</span>
                    <span title="Allow decimal places in quantity">
                      <Info size={13} className="text-cyan-400 cursor-help" />
                    </span>
                  </span>
                </th>
                <th className="px-6 py-3 w-40 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {displayedUnits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 text-xs">
                    No data available in table
                  </td>
                </tr>
              ) : (
                displayedUnits.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 font-medium text-white">{item.name}</td>
                    <td className="px-6 py-3.5 text-slate-300">{item.shortName}</td>
                    <td className="px-6 py-3.5 text-slate-300">{item.allowDecimal}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 transition-colors text-xs font-medium cursor-pointer"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUnitToDelete(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 transition-colors text-xs font-medium cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
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
            {filteredUnits.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to{' '}
            {Math.min(currentPage * entriesPerPage, filteredUnits.length)} of{' '}
            {filteredUnits.length} entries
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
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-md shadow-indigo-600/30">
              {currentPage}
            </span>
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

      {/* Add / Edit Unit Modal (matching media_1789382999157.png) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg bg-[#120e34] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 overflow-hidden z-10 flex flex-col text-slate-200 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e0a2b]">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {editingUnit ? 'Edit Unit' : 'Add Unit'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (modalError) setModalError('');
                  }}
                  placeholder="Name"
                  autoFocus
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                />
              </div>

              {/* Short name:* */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Short name:<span className="text-rose-400 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => {
                    setShortName(e.target.value);
                    if (modalError) setModalError('');
                  }}
                  placeholder="Short name"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                />
              </div>

              {/* Allow decimal:* */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Allow decimal:<span className="text-rose-400 ml-0.5">*</span>
                </label>
                <select
                  value={allowDecimal}
                  onChange={(e) => {
                    setAllowDecimal(e.target.value as any);
                    if (modalError) setModalError('');
                  }}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer"
                >
                  <option value="Please Select">Please Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Add as multiple of other unit */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={isMultiple}
                    onChange={(e) => setIsMultiple(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-[#08051e] border-white/20 focus:ring-indigo-500/40"
                  />
                  <span>Add as multiple of other unit</span>
                  <span title="Define this unit as a multiple of an existing base unit (e.g., 1 Box = 10 Pieces)">
                    <Info size={13} className="text-cyan-400" />
                  </span>
                </label>

                {isMultiple && (
                  <div className="mt-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span>1 {name || 'Unit'} =</span>
                      <input
                        type="number"
                        min="1"
                        value={multiplier}
                        onChange={(e) => setMultiplier(e.target.value)}
                        placeholder="Times"
                        className="w-24 bg-[#08051e] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <span>times</span>
                      <select
                        value={baseUnit}
                        onChange={(e) => setBaseUnit(e.target.value)}
                        className="bg-[#08051e] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
                        {units.map((u) => (
                          <option key={u.id} value={u.name}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
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
                  onClick={() => setIsModalOpen(false)}
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
      {isDeleteModalOpen && unitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsDeleteModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-[#120e34] rounded-2xl p-6 border border-white/15 shadow-2xl z-10 text-slate-200">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle size={22} />
              <h3 className="text-base font-bold text-white">Delete Unit?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete unit{' '}
              <strong className="text-white">&quot;{unitToDelete.name}&quot; ({unitToDelete.shortName})</strong>? This action
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
