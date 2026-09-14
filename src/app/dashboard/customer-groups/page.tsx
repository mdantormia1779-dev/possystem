"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ArrowUpDown, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import ExportToolbar, { ColumnOption } from '@/app/Components/Dashboard/ExportToolbar';
import { ColumnDef, exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';
import AddCustomerGroupModal, { CustomerGroupFormData } from './AddCustomerGroupModal';

const initialCustomerGroups: CustomerGroupFormData[] = [];

export default function CustomerGroupsPage() {
  const [customerGroups, setCustomerGroups] = useState<CustomerGroupFormData[]>(initialCustomerGroups);
  const [entriesCount, setEntriesCount] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroupFormData | null>(null);

  // Columns visibility
  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: 'name', label: 'Customer Group Name', visible: true },
    { id: 'calculationPercentage', label: 'Calculation Percentage (%)', visible: true },
    { id: 'sellingPriceGroup', label: 'Selling Price Group', visible: true },
    { id: 'action', label: 'Action', visible: true },
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
  const [sortField, setSortField] = useState<keyof CustomerGroupFormData>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof CustomerGroupFormData) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort
  const filteredGroups = customerGroups.filter((g) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(query) ||
      (g.sellingPriceGroup && g.sellingPriceGroup.toLowerCase().includes(query)) ||
      (g.calculationPercentage && String(g.calculationPercentage).includes(query))
    );
  });

  const sortedGroups = [...filteredGroups].sort((a, b) => {
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
  const exportColumns: ColumnDef<CustomerGroupFormData>[] = [
    { id: 'name', label: 'Customer Group Name', accessor: (g: CustomerGroupFormData) => g.name },
    {
      id: 'calculationPercentage',
      label: 'Calculation Percentage (%)',
      accessor: (g: CustomerGroupFormData) =>
        g.priceCalculationType === 'Percentage' && g.calculationPercentage
          ? `${g.calculationPercentage}%`
          : '-',
    },
    {
      id: 'sellingPriceGroup',
      label: 'Selling Price Group',
      accessor: (g: CustomerGroupFormData) =>
        g.priceCalculationType === 'Selling Price Group' && g.sellingPriceGroup
          ? g.sellingPriceGroup
          : '-',
    },
  ].filter((c) => isColVisible(c.id));

  // Export Handlers
  const handleExportCSV = () => exportToCSV('customer_groups', exportColumns, sortedGroups);
  const handleExportExcel = () => exportToExcel('customer_groups', exportColumns, sortedGroups);
  const handlePrint = () => printTable('Customer Groups List', exportColumns, sortedGroups);
  const handleExportPDF = () => exportToPDF('Customer Groups List', exportColumns, sortedGroups);

  // Save (Add/Edit)
  const handleSaveGroup = (data: CustomerGroupFormData) => {
    if (editingGroup?.id) {
      setCustomerGroups((prev) =>
        prev.map((g) => (g.id === editingGroup.id ? { ...data, id: editingGroup.id } : g))
      );
    } else {
      const newGroup: CustomerGroupFormData = {
        ...data,
        id: String(Date.now()),
      };
      setCustomerGroups((prev) => [newGroup, ...prev]);
    }
    setEditingGroup(null);
  };

  // Delete
  const handleDeleteGroup = (id: string) => {
    if (confirm('Are you sure you want to delete this customer group?')) {
      setCustomerGroups((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const visibleColCount = columns.filter((c) => c.visible).length;

  return (
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Top Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
          Customer Groups
        </h1>
      </div>

      {/* Main Table Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-7 overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
          <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Card Header: All Customer Groups & + Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            All Customer Groups
          </h2>

          <button
            type="button"
            onClick={() => {
              setEditingGroup(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add</span>
          </button>
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

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0c0827]/60">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-300 font-semibold">
                {isColVisible('name') && (
                  <th
                    className="px-4 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Customer Group Name</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('calculationPercentage') && (
                  <th
                    className="px-4 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('calculationPercentage')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Calculation Percentage (%)</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('sellingPriceGroup') && (
                  <th
                    className="px-4 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('sellingPriceGroup')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Selling Price Group</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}

                {isColVisible('action') && (
                  <th className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Action</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-slate-300">
              {sortedGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColCount}
                    className="text-center py-10 text-slate-400 bg-white/[0.01]"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                sortedGroups.slice(0, entriesCount).map((group) => (
                  <tr
                    key={group.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    {isColVisible('name') && (
                      <td className="px-4 py-3 font-semibold text-white">
                        {group.name}
                      </td>
                    )}

                    {isColVisible('calculationPercentage') && (
                      <td className="px-4 py-3 text-slate-300">
                        {group.priceCalculationType === 'Percentage' && group.calculationPercentage
                          ? `${group.calculationPercentage}%`
                          : '-'}
                      </td>
                    )}

                    {isColVisible('sellingPriceGroup') && (
                      <td className="px-4 py-3 text-slate-300">
                        {group.priceCalculationType === 'Selling Price Group' && group.sellingPriceGroup
                          ? group.sellingPriceGroup
                          : '-'}
                      </td>
                    )}

                    {isColVisible('action') && (
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingGroup(group);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGroup(group.id || '')}
                            className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 hover:text-white border border-rose-500/30 transition-all cursor-pointer"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs text-slate-400">
          <div>
            Showing {sortedGroups.length > 0 ? 1 : 0} to{' '}
            {Math.min(entriesCount, sortedGroups.length)} of {sortedGroups.length} entries
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled
              className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Add / Edit Customer Group Modal */}
      <AddCustomerGroupModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingGroup(null);
        }}
        onSave={handleSaveGroup}
        initialData={editingGroup}
      />

    </div>
  );
}
