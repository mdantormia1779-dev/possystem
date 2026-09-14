"use client";

import React, { useState } from 'react';
import { 
  FiAlertCircle, 
  FiFileText, 
  FiPrinter, 
  FiColumns, 
  FiChevronDown 
} from 'react-icons/fi';
import { 
  BsFileEarmarkSpreadsheet, 
  BsFileEarmarkPdf, 
  BsArrowDownUp 
} from 'react-icons/bs';

const tableHeaders = [
  { id: 'action', label: 'Action', sortable: true },
  { id: 'date', label: 'Date', sortable: true },
  { id: 'orderNo', label: 'Order No.', sortable: true },
  { id: 'customerName', label: 'Customer name', sortable: true },
  { id: 'contactNumber', label: 'Contact Number', sortable: true },
  { id: 'location', label: 'Location', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'shippingStatus', label: 'Shipping Status', sortable: false },
  { id: 'quantityRemaining', label: 'Quantity Remaining', sortable: false },
];

export default function SalesOrderTable() {
  const [entriesCount, setEntriesCount] = useState<number>(25);

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
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <FiFileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <BsFileEarmarkSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <FiPrinter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <FiColumns className="w-3.5 h-3.5 text-purple-400" />
            <span>Column visibility</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <BsFileEarmarkPdf className="w-3.5 h-3.5 text-rose-400" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Table Section with Responsive Horizontal Scroll */}
      <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs min-w-[750px]">
          <thead>
            <tr className="bg-white/[0.04] text-indigo-200/80 uppercase tracking-wider text-[11px] font-bold border-b border-white/10">
              {tableHeaders.map((header) => (
                <th key={header.id} className="py-3 px-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span>{header.label}</span>
                    {header.sortable && (
                      <BsArrowDownUp className="w-2.5 h-2.5 text-slate-500 opacity-70" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-slate-300">
            <tr>
              <td colSpan={tableHeaders.length} className="py-8 text-center text-slate-400 text-xs font-medium">
                No data available in table
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
