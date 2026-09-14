"use client";

import React, { useState } from 'react';
import { Download, Upload, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { FiChevronUp } from 'react-icons/fi';

interface OpeningStockInstruction {
  number: number;
  name: React.ReactNode;
  instruction: React.ReactNode;
}

const instructions: OpeningStockInstruction[] = [
  {
    number: 1,
    name: <span>SKU<span className="text-slate-400 font-normal">(Required)</span></span>,
    instruction: '',
  },
  {
    number: 2,
    name: (
      <div>
        <p>Location <span className="text-slate-400 font-normal">(Optional)</span></p>
        <p className="text-slate-400 font-normal text-[11px] mt-0.5">If blank first business location will be used</p>
      </div>
    ),
    instruction: 'Name of the business location',
  },
  {
    number: 3,
    name: <span>Quantity <span className="text-slate-400 font-normal">(Required)</span></span>,
    instruction: '',
  },
  {
    number: 4,
    name: <span>Unit Cost (Before Tax) <span className="text-slate-400 font-normal">(Required)</span></span>,
    instruction: '',
  },
  {
    number: 5,
    name: <span>Lot Number <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: '',
  },
  {
    number: 6,
    name: <span>Expiry Date <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>
          Stock expiry date in <strong className="text-white">Business date format</strong>{' '}
          <strong className="text-cyan-300 font-mono">dd/mm/yyyy</strong>, Type: <strong className="text-white">text</strong>, Example:{' '}
          <strong className="text-cyan-300 font-mono">14/09/2026</strong>
        </p>
      </div>
    ),
  },
];

export default function ImportOpeningStockPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownloadTemplate = () => {
    const headers = [
      "SKU*",
      "Location",
      "Quantity*",
      "Unit Cost (Before Tax)*",
      "Lot Number",
      "Expiry Date"
    ];
    const sampleRows = [
      ["SKU001", "Main Store", "50", "250.00", "LOT-9921", "14/09/2026"],
      ["SKU002", "Main Store", "100", "120.50", "LOT-9922", "31/12/2026"]
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...sampleRows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "import_opening_stock_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatusMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMessage({
        type: 'error',
        text: 'Please select a file to import (CSV or Excel file).'
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    // Simulate import processing
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage({
        type: 'success',
        text: `Successfully processed "${selectedFile.name}". Opening stock has been imported!`
      });
      setSelectedFile(null);
      const fileInput = document.getElementById('stock-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none min-h-screen">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Import Opening Stock
        </h1>
      </div>

      {/* Card 1: File Upload Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-6 sm:p-7 space-y-6">
        {statusMessage && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 border text-xs sm:text-sm animate-in fade-in duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle size={18} className="shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>File To Import:</span>
              <span title="Upload .csv, .xls, or .xlsx file containing opening stock information">
                <Info size={14} className="text-cyan-400 cursor-help" />
              </span>
            </label>
            <input
              id="stock-file-input"
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-400
                file:mr-3 file:py-2 file:px-4
                file:rounded-xl file:border file:border-white/15
                file:text-xs file:font-semibold
                file:bg-[#0c0827] file:text-slate-200
                hover:file:bg-white/10 file:cursor-pointer cursor-pointer"
            />
          </div>

          <div className="sm:self-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md shadow-violet-600/30 active:scale-95 cursor-pointer"
            >
              <Upload size={15} />
              <span>{isSubmitting ? 'Importing...' : 'Submit'}</span>
            </button>
          </div>
        </form>

        {/* Download Template File Button (Green) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30 active:scale-95 cursor-pointer"
          >
            <Download size={15} />
            <span>Download template file</span>
          </button>
        </div>
      </div>

      {/* Card 2: Instructions Table (matching media_1789382930332.png) */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-6 sm:p-7 space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Instructions
          </h2>
          <div className="text-xs text-slate-400 mt-1 space-y-0.5">
            <p>lang_v1.instruction_line1</p>
            <p>lang_v1.instruction_line2</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
                <th className="px-4 py-3 w-28">Column Number</th>
                <th className="px-6 py-3 min-w-[280px]">Column Name</th>
                <th className="px-6 py-3 min-w-[420px]">Instruction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {instructions.map((row) => (
                <tr key={row.number} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-cyan-300 font-mono font-medium">
                    {row.number}
                  </td>
                  <td className="px-6 py-3 font-semibold text-white">
                    {row.name}
                  </td>
                  <td className="px-6 py-3 text-slate-300 leading-relaxed whitespace-normal max-w-xl">
                    {row.instruction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
