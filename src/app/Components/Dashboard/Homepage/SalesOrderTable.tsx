"use client";

import React, { useState } from 'react';
import { 
  FiAlertCircle, 
  FiChevronDown 
} from 'react-icons/fi';
import { 
  BsArrowDownUp 
} from 'react-icons/bs';
import ExportToolbar, { ColumnOption } from '../ExportToolbar';
import { ColumnDef, exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';

interface SalesOrderItem {
  id?: string;
  action?: string;
  date?: string;
  orderNo?: string;
  customerName?: string;
  contactNumber?: string;
  location?: string;
  status?: string;
  shippingStatus?: string;
  quantityRemaining?: string;
}

export default function SalesOrderTable() {
  const [entriesCount, setEntriesCount] = useState<number>(25);

  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: 'action', label: 'Action', visible: true },
    { id: 'date', label: 'Date', visible: true },
    { id: 'orderNo', label: 'Order No.', visible: true },
    { id: 'customerName', label: 'Customer name', visible: true },
    { id: 'contactNumber', label: 'Contact Number', visible: true },
    { id: 'location', label: 'Location', visible: true },
    { id: 'status', label: 'Status', visible: true },
    { id: 'shippingStatus', label: 'Shipping Status', visible: true },
    { id: 'quantityRemaining', label: 'Quantity Remaining', visible: true },
  ]);

  const data: SalesOrderItem[] = [];

  const handleToggleColumn = (id: string) => {
    setColumns(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  const isColVisible = (id: string) => Boolean(columns.find(c => c.id === id)?.visible);

  const exportColumns: ColumnDef<SalesOrderItem>[] = [
    { id: 'date', label: 'Date', accessor: (item: SalesOrderItem) => item.date || '' },
    { id: 'orderNo', label: 'Order No.', accessor: (item: SalesOrderItem) => item.orderNo || '' },
    { id: 'customerName', label: 'Customer name', accessor: (item: SalesOrderItem) => item.customerName || '' },
    { id: 'contactNumber', label: 'Contact Number', accessor: (item: SalesOrderItem) => item.contactNumber || '' },
    { id: 'location', label: 'Location', accessor: (item: SalesOrderItem) => item.location || '' },
    { id: 'status', label: 'Status', accessor: (item: SalesOrderItem) => item.status || '' },
    { id: 'shippingStatus', label: 'Shipping Status', accessor: (item: SalesOrderItem) => item.shippingStatus || '' },
    { id: 'quantityRemaining', label: 'Quantity Remaining', accessor: (item: SalesOrderItem) => item.quantityRemaining || '' },
  ].filter(c => isColVisible(c.id));

  const handleExportCSV = () => exportToCSV('sales_orders', exportColumns, data);
  const handleExportExcel = () => exportToExcel('sales_orders', exportColumns, data);
  const handlePrint = () => printTable('Sales Orders', exportColumns, data);
  const handleExportPDF = () => exportToPDF('Sales Orders', exportColumns, data);

  const visibleColumns = columns.filter(c => c.visible);

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-[#120e34]/85 hover:bg-[#161242]/90 border border-white/10 hover:border-indigo-500/30 p-4 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-xl select-none overflow-hidden font-sans transition-all duration-300 mt-6">
      {/* Background ambient glowing orbs */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
        <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Card Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0">
          <FiAlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
            Sales Order
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Order management & shipping fulfillment tracker
          </p>
        </div>
      </div>

      {/* Table Control Bar: Show Entries + Export Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        {/* Entries Selector */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
          <span>Show</span>
          <div className="relative">
            <select
              value={entriesCount}
              onChange={(e) => setEntriesCount(Number(e.target.value))}
              className="appearance-none bg-[#0c0827] border border-white/15 rounded-xl px-3 py-1.5 pr-7 text-xs text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer shadow-xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <FiChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <span>entries</span>
        </div>

        {/* Export Toolbar Buttons */}
        <ExportToolbar
          columns={columns}
          onToggleColumn={handleToggleColumn}
          onExportCSV={handleExportCSV}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          onExportPDF={handleExportPDF}
        />
      </div>

      {/* Table Section with Responsive Horizontal Scroll */}
      <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs min-w-[750px]">
          <thead>
            <tr className="bg-white/[0.04] text-indigo-200/80 uppercase tracking-wider text-[11px] font-bold border-b border-white/10">
              {visibleColumns.map((header) => (
                <th key={header.id} className="py-3 px-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span>{header.label}</span>
                    {header.id !== 'action' && (
                      <BsArrowDownUp className="w-2.5 h-2.5 text-slate-500 opacity-70" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-slate-300">
            <tr>
              <td colSpan={visibleColumns.length || 1} className="py-8 text-center text-slate-400 text-xs font-medium">
                {visibleColumns.length === 0 ? 'No columns visible' : 'No data available in table'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Table Footer: Entries Info & Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs text-slate-400">
        <div>
          Showing 0 to 0 of 0 entries
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
            disabled
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.02] text-slate-500 text-xs font-medium cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
