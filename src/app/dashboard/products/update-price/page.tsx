"use client";

import React, { useState } from 'react';
import { Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { FiChevronUp } from 'react-icons/fi';

export default function UpdatePricePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExport = () => {
    // Generate mock CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Product Name,SKU,Default Purchase Price (Exc. Tax),Default Selling Price (Exc. Tax)\n" +
      "Head Light,0003,5000.00,25000.00\n" +
      "MOBILE STAND,0002,1000.00,1200.00\n" +
      "TEST,00017896036,400.00,720.00\n" +
      "WD 400,0001,120.00,160.00\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_prices_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMessage({
      type: 'success',
      text: 'Product prices exported successfully as CSV!',
    });
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
        text: 'Please select a file to import!',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage({
        type: 'success',
        text: `Product prices imported successfully from "${selectedFile.name}"!`,
      });
      setSelectedFile(null);
    }, 800);
  };

  return (
    <div className="space-y-6 select-none font-sans pb-16">
      {/* Top Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
          Update Price
        </h1>
      </div>

      {/* Main Card (matching media_1789382159228.png) */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-sm sm:text-base font-bold text-white tracking-wide border-b border-white/10 pb-3">
          Import Export Product Price
        </h2>

        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in duration-150 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
          {/* Left Action: Export */}
          <div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition-all shadow-md shadow-violet-600/30 active:scale-95 cursor-pointer"
            >
              <Download size={15} />
              <span>Export product prices</span>
            </button>
          </div>

          {/* Right Action: Import */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                File To Import:
              </label>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-400
                  file:mr-3 file:py-2 file:px-4
                  file:rounded-xl file:border file:border-white/15
                  file:text-xs file:font-semibold
                  file:bg-[#0c0827] file:text-slate-200
                  hover:file:bg-white/10 file:cursor-pointer cursor-pointer"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md shadow-violet-600/30 active:scale-95 cursor-pointer"
              >
                <Upload size={14} />
                <span>{isSubmitting ? 'Importing...' : 'Submit'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="pt-6 border-t border-white/10 text-xs text-slate-300 space-y-2">
          <h3 className="font-bold text-white text-xs">Instructions:</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Export product prices by clicking on above button</li>
            <li>Make changes in product price including tax &amp; selling price groups.</li>
            <li>Do not change any product name, sku &amp; headers</li>
            <li>After making changes import the file</li>
          </ul>
        </div>
      </div>

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
