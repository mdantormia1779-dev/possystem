"use client";

import React, { useState } from 'react';
import { Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { FiChevronUp } from 'react-icons/fi';

interface InstructionRow {
  number: number;
  name: React.ReactNode;
  instruction: React.ReactNode;
}

const instructions: InstructionRow[] = [
  {
    number: 1,
    name: <span>Product Name <span className="text-slate-400 font-normal">(Required)</span></span>,
    instruction: 'Name of the product',
  },
  {
    number: 2,
    name: <span>Brand <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Name of the brand</p>
        <p className="text-slate-400">(If not found new brand with the given name will be created)</p>
      </div>
    ),
  },
  {
    number: 3,
    name: <span>Unit <span className="text-slate-400 font-normal">(Required)</span></span>,
    instruction: 'Name of the unit',
  },
  {
    number: 4,
    name: <span>Category <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Name of the Category</p>
        <p className="text-slate-400">(If not found new category with the given name will be created)</p>
      </div>
    ),
  },
  {
    number: 5,
    name: <span>Sub category <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Name of the Sub-Category</p>
        <p className="text-slate-400">(If not found new sub-category with the given name under the parent Category will be created)</p>
      </div>
    ),
  },
  {
    number: 6,
    name: <span>SKU <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: 'Product SKU. If blank an SKU will be automatically generated',
  },
  {
    number: 7,
    name: <span>Barcode Type <span className="text-slate-400 font-normal">(Optional, Default: C128)</span></span>,
    instruction: (
      <div>
        <p>Barcode Type for the product.</p>
        <p className="text-slate-400">Currently supported: C128, C39, EAN 13, EAN 8, UPC A, UPC E, ITF 14</p>
      </div>
    ),
  },
  {
    number: 8,
    name: <span>Manage Stock? <span className="text-slate-400 font-normal">(Required)</span></span>,
    instruction: (
      <div>
        <p>Enable or disable stock management</p>
        <p className="mt-1"><strong className="text-cyan-300 font-mono">1</strong> = Yes</p>
        <p><strong className="text-cyan-300 font-mono">0</strong> = No</p>
      </div>
    ),
  },
  {
    number: 9,
    name: <span>Alert quantity <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: 'Alert quantity',
  },
  {
    number: 10,
    name: <span>Expires in <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: 'Product expiry period [Only in numbers]',
  },
  {
    number: 11,
    name: <span>Expiry Period Unit <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Unit for the expiry period</p>
        <p className="text-slate-300 mt-0.5 font-medium">Available Options: days, months</p>
      </div>
    ),
  },
  {
    number: 12,
    name: <span>Applicable Tax <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Name of the Tax Rate</p>
        <p className="text-slate-400 mt-1 leading-relaxed">
          If purchase Price (Excluding Tax) is not same as Purchase Price (Including Tax) then you must supply the tax rate name.
        </p>
      </div>
    ),
  },
  {
    number: 13,
    name: <span>Selling Price Tax Type <span className="text-slate-400 font-normal">(Required)</span></span>,
    instruction: (
      <div>
        <p>Selling Price Tax Type</p>
        <p className="text-slate-300 mt-0.5 font-medium">Available Options: inclusive, exclusive</p>
      </div>
    ),
  },
  {
    number: 14,
    name: <span>Product Type <span className="text-slate-400 font-normal">(Required)</span></span>,
    instruction: (
      <div>
        <p>Product Type</p>
        <p className="text-slate-300 mt-0.5 font-medium">Available Options: single, variable</p>
      </div>
    ),
  },
  {
    number: 15,
    name: <span>Variation Name <span className="text-slate-400 font-normal">(Required if product type is variable)</span></span>,
    instruction: 'Name of the variation (Ex: Size, Color etc )',
  },
  {
    number: 16,
    name: <span>Variation Values <span className="text-slate-400 font-normal">(Required if product type is variable)</span></span>,
    instruction: (
      <div>
        <p>Values for the variation separated with &apos;|&apos;</p>
        <p className="text-slate-400 font-mono mt-0.5">(Ex: Red|Blue|Green)</p>
      </div>
    ),
  },
  {
    number: 17,
    name: <span>Variation SKUs <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: "SKUs of each variations separated by '|' if product type is variable",
  },
  {
    number: 18,
    name: (
      <div>
        <p>Purchase Price (Including Tax)</p>
        <p className="text-slate-400 font-normal text-[11px]">(Required if Purchase Price Excluding Tax is not given)</p>
      </div>
    ),
    instruction: (
      <div>
        <p>Purchase Price (Including Tax) [Only in numbers]</p>
        <p className="text-slate-400 mt-1">For variable products &apos;|&apos; separated values with the same order as Variation Values</p>
        <p className="text-slate-400 font-mono mt-0.5">(Ex: 84|85|88)</p>
      </div>
    ),
  },
  {
    number: 19,
    name: (
      <div>
        <p>Purchase Price (Excluding Tax)</p>
        <p className="text-slate-400 font-normal text-[11px]">(Required if Purchase Price Including Tax is not given)</p>
      </div>
    ),
    instruction: (
      <div>
        <p>Purchase Price (Excluding Tax) [Only in numbers]</p>
        <p className="text-slate-400 mt-1">For variable products &apos;|&apos; separated values with the same order as Variation Values</p>
        <p className="text-slate-400 font-mono mt-0.5">(Ex: 84|85|88)</p>
      </div>
    ),
  },
  {
    number: 20,
    name: <span>Profit Margin % <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Profit Margin [Only in numbers]</p>
        <p className="text-slate-400 mt-0.5">If blank default profit margin for the business will be used</p>
      </div>
    ),
  },
  {
    number: 21,
    name: <span>Selling Price <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Selling Price [Only in numbers]</p>
        <p className="text-slate-400 mt-0.5">If blank selling price will be calculated with the given Purchase Price and Applicable Tax</p>
      </div>
    ),
  },
  {
    number: 22,
    name: <span>Opening Stock <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Opening Stock [Only in numbers]</p>
        <p className="text-slate-400 mt-0.5">For variable products separate stock quantities with &apos;|&apos;</p>
        <p className="text-slate-400 font-mono mt-0.5">(Ex: 100|150|200)</p>
      </div>
    ),
  },
  {
    number: 23,
    name: (
      <div>
        <p>Opening stock location <span className="text-slate-400 font-normal">(Optional)</span></p>
        <p className="text-slate-400 font-normal text-[11px]">If blank first business location will be used</p>
      </div>
    ),
    instruction: 'Name of the business location',
  },
  {
    number: 24,
    name: <span>Expiry Date <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Stock Expiry Date</p>
        <p className="text-slate-400 font-mono mt-0.5">Format: mm-dd-yyyy; Ex: 11-25-2018</p>
      </div>
    ),
  },
  {
    number: 25,
    name: <span>Enable Product description, IMEI or Serial Number <span className="text-slate-400 font-normal">(Optional, Default: 0)</span></span>,
    instruction: (
      <div>
        <p><strong className="text-cyan-300 font-mono">1</strong> = Yes</p>
        <p><strong className="text-cyan-300 font-mono">0</strong> = No</p>
      </div>
    ),
  },
  {
    number: 26,
    name: <span>Weight <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: 'Optional',
  },
  {
    number: 27,
    name: <span>Rack <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Rack details separated by &apos;|&apos; for different business locations serially.</p>
        <p className="text-slate-400 font-mono mt-0.5">(Ex: R1|R5|R12)</p>
      </div>
    ),
  },
  {
    number: 28,
    name: <span>Row <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Row details separated by &apos;|&apos; for different business locations serially.</p>
        <p className="text-slate-400 font-mono mt-0.5">(Ex: ROW1|ROW2|ROW3)</p>
      </div>
    ),
  },
  {
    number: 29,
    name: <span>Position <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Position details separated by &apos;|&apos; for different business locations serially.</p>
        <p className="text-slate-400 font-mono mt-0.5">(Ex: POS1|POS2|POS3)</p>
      </div>
    ),
  },
  {
    number: 30,
    name: <span>Image <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p>Image name with extension.</p>
        <p className="text-slate-400">(Image name must be uploaded to the server public/uploads/img )</p>
        <p className="text-slate-400 mt-1">Or URL of the image</p>
      </div>
    ),
  },
  {
    number: 31,
    name: <span>Product Description <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: '',
  },
  {
    number: 32,
    name: <span>Custom Field1 <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: '',
  },
  {
    number: 33,
    name: <span>Custom Field2 <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: '',
  },
  {
    number: 34,
    name: <span>Custom Field3 <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: '',
  },
  {
    number: 35,
    name: <span>Custom Field4 <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: '',
  },
  {
    number: 36,
    name: <span>Not for selling <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: (
      <div>
        <p><strong className="text-cyan-300 font-mono">1</strong> = Yes</p>
        <p><strong className="text-cyan-300 font-mono">0</strong> = No</p>
      </div>
    ),
  },
  {
    number: 37,
    name: <span>Product locations <span className="text-slate-400 font-normal">(Optional)</span></span>,
    instruction: 'Comma separated string of business location names where product will be available',
  },
];

export default function ImportProductsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownloadTemplate = () => {
    // Generate CSV template with all 37 headers matching screenshot
    const headers = [
      "Product Name*",
      "Brand",
      "Unit*",
      "Category",
      "Sub category",
      "SKU",
      "Barcode Type",
      "Manage Stock?*",
      "Alert quantity",
      "Expires in",
      "Expiry Period Unit",
      "Applicable Tax",
      "Selling Price Tax Type*",
      "Product Type*",
      "Variation Name",
      "Variation Values",
      "Variation SKUs",
      "Purchase Price (Including Tax)",
      "Purchase Price (Excluding Tax)",
      "Profit Margin %",
      "Selling Price",
      "Opening Stock",
      "Opening stock location",
      "Expiry Date",
      "Enable Product description, IMEI or Serial Number",
      "Weight",
      "Rack",
      "Row",
      "Position",
      "Image",
      "Product Description",
      "Custom Field1",
      "Custom Field2",
      "Custom Field3",
      "Custom Field4",
      "Not for selling",
      "Product locations"
    ];

    const sampleRow = [
      "Sample Product",
      "Robin",
      "Pieces",
      "Electronics",
      "",
      "SAMPLE-001",
      "C128",
      "1",
      "5",
      "",
      "",
      "",
      "exclusive",
      "single",
      "",
      "",
      "",
      "1000",
      "1000",
      "20",
      "1200",
      "10",
      "RANGPUR BIKE PARLOUR",
      "",
      "0",
      "",
      "",
      "",
      "",
      "",
      "Sample description",
      "",
      "",
      "",
      "",
      "0",
      "RANGPUR BIKE PARLOUR"
    ];

    const csvContent = "data:text/csv;charset=utf-8," + 
      headers.join(",") + "\n" +
      sampleRow.join(",") + "\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "import_products_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMessage({
      type: 'success',
      text: 'Template downloaded successfully (import_products_template.csv)!',
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
        text: 'Please select a CSV file to import!',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage({
        type: 'success',
        text: `Products imported successfully from "${selectedFile.name}"!`,
      });
      setSelectedFile(null);
    }, 800);
  };

  return (
    <div className="space-y-6 select-none font-sans pb-16">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
          Import Products
        </h1>
      </div>

      {/* Card 1: File To Import & Download Template (matching media_1789382718564.png) */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-xl backdrop-blur-xl p-6 sm:p-7 space-y-6">
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

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <label className="block text-xs font-semibold text-slate-300">
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

      {/* Card 2: Instructions Table (matching media_1789382718564.png, media_1789382738459.png, media_1789382756276.png) */}
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

        {/* Full 37-Column Instructions Table */}
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
