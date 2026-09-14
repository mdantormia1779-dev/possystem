"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  FiFileText, 
  FiPrinter, 
  FiColumns, 
  FiCheck 
} from 'react-icons/fi';
import { 
  BsFileEarmarkSpreadsheet, 
  BsFileEarmarkPdf 
} from 'react-icons/bs';

export interface ColumnOption {
  id: string;
  label: string;
  visible: boolean;
}

interface ExportToolbarProps {
  columns: ColumnOption[];
  onToggleColumn: (id: string) => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  onExportPDF: () => void;
}

export default function ExportToolbar({
  columns,
  onToggleColumn,
  onExportCSV,
  onExportExcel,
  onPrint,
  onExportPDF,
}: ExportToolbarProps) {
  const [isColMenuOpen, setIsColMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsColMenuOpen(false);
      }
    };
    if (isColMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColMenuOpen]);

  return (
    <div className="flex items-center gap-1.5 flex-wrap relative">
      {/* 1. Export CSV */}
      <button
        type="button"
        onClick={onExportCSV}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 text-[11px] sm:text-xs font-medium text-slate-200 transition-all shadow-2xs active:scale-95 cursor-pointer"
        title="Download CSV file"
      >
        <FiFileText className="w-3.5 h-3.5 text-cyan-400" />
        <span>Export CSV</span>
      </button>

      {/* 2. Export Excel */}
      <button
        type="button"
        onClick={onExportExcel}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 text-[11px] sm:text-xs font-medium text-slate-200 transition-all shadow-2xs active:scale-95 cursor-pointer"
        title="Download Excel spreadsheet (.xls)"
      >
        <BsFileEarmarkSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
        <span>Export Excel</span>
      </button>

      {/* 3. Print */}
      <button
        type="button"
        onClick={onPrint}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 text-[11px] sm:text-xs font-medium text-slate-200 transition-all shadow-2xs active:scale-95 cursor-pointer"
        title="Print table"
      >
        <FiPrinter className="w-3.5 h-3.5 text-indigo-400" />
        <span>Print</span>
      </button>

      {/* 4. Column Visibility with Dropdown Menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsColMenuOpen((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-medium transition-all shadow-2xs active:scale-95 cursor-pointer ${
            isColMenuOpen
              ? 'border-indigo-500/50 bg-indigo-600/20 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]'
              : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200'
          }`}
          title="Toggle column visibility"
        >
          <FiColumns className="w-3.5 h-3.5 text-slate-300" />
          <span>Column visibility</span>
        </button>

        {isColMenuOpen && (
          <div className="absolute left-0 top-full mt-2 w-52 sm:w-56 rounded-2xl bg-[#140f38]/95 border border-white/15 shadow-2xl backdrop-blur-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1.5 border-b border-white/10 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Toggle Columns
            </div>
            <div className="py-1 max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin">
              {columns.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => onToggleColumn(col.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    col.visible
                      ? 'text-white bg-indigo-500/15 hover:bg-indigo-500/25'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{col.label}</span>
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      col.visible
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-xs'
                        : 'border-white/20 bg-black/20 text-transparent'
                    }`}
                  >
                    <FiCheck className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Export PDF */}
      <button
        type="button"
        onClick={onExportPDF}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 text-[11px] sm:text-xs font-medium text-slate-200 transition-all shadow-2xs active:scale-95 cursor-pointer"
        title="Export / Print to PDF"
      >
        <BsFileEarmarkPdf className="w-3.5 h-3.5 text-rose-400" />
        <span>Export PDF</span>
      </button>
    </div>
  );
}
