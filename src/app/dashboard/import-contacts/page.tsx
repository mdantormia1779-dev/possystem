"use client";

import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface InstructionRow {
  number: number;
  name: string;
  instruction: React.ReactNode;
}

const instructions: InstructionRow[] = [
  {
    number: 1,
    name: 'Contact type (Required)',
    instruction: (
      <div>
        <p className="font-semibold text-slate-200">Available Options:</p>
        <p><strong className="text-cyan-300">1</strong> = Customer,</p>
        <p><strong className="text-cyan-300">2</strong> = Supplier,</p>
        <p><strong className="text-cyan-300">3</strong> = Both</p>
      </div>
    ),
  },
  {
    number: 2,
    name: 'Prefix (Optional)',
    instruction: 'Optional (e.g. Mr, Mrs, Miss)',
  },
  {
    number: 3,
    name: 'First Name (Required)',
    instruction: <span className="text-rose-400 font-semibold">Required for individual contacts</span>,
  },
  {
    number: 4,
    name: 'Middle name (Optional)',
    instruction: 'Optional',
  },
  {
    number: 5,
    name: 'Last Name (Optional)',
    instruction: 'Optional',
  },
  {
    number: 6,
    name: 'Business Name',
    instruction: <span className="text-amber-400 font-semibold">Required if contact type is supplier or both</span>,
  },
  {
    number: 7,
    name: 'Contact ID (Optional)',
    instruction: 'Leave empty to autogenerate',
  },
  {
    number: 8,
    name: 'Tax number (Optional)',
    instruction: 'Tax / GST / VAT identification number',
  },
  {
    number: 9,
    name: 'Opening Balance (Optional)',
    instruction: 'Default is 0',
  },
  {
    number: 10,
    name: 'Pay term (Optional)',
    instruction: 'Number value (e.g. 30)',
  },
  {
    number: 11,
    name: 'Pay term period (Required if pay term is set)',
    instruction: (
      <div>
        <p className="font-semibold text-slate-200">Available Options:</p>
        <p><strong className="text-cyan-300">days</strong> or <strong className="text-cyan-300">months</strong></p>
      </div>
    ),
  },
  {
    number: 12,
    name: 'Credit Limit (Optional)',
    instruction: 'Keep blank for no limit',
  },
  {
    number: 13,
    name: 'Email (Optional)',
    instruction: 'Valid email address',
  },
  {
    number: 14,
    name: 'Mobile (Required)',
    instruction: <span className="text-rose-400 font-semibold">Required contact phone number</span>,
  },
  {
    number: 15,
    name: 'Alternate contact number (Optional)',
    instruction: 'Secondary contact number',
  },
  {
    number: 16,
    name: 'Landline (Optional)',
    instruction: 'Telephone number',
  },
  {
    number: 17,
    name: 'City (Optional)',
    instruction: 'City name',
  },
  {
    number: 18,
    name: 'State (Optional)',
    instruction: 'State or Division',
  },
  {
    number: 19,
    name: 'Country (Optional)',
    instruction: 'Country name',
  },
  {
    number: 20,
    name: 'Address line 1 (Optional)',
    instruction: 'Street address line 1',
  },
  {
    number: 21,
    name: 'Address line 2 (Optional)',
    instruction: 'Street address line 2',
  },
  {
    number: 22,
    name: 'Zip Code (Optional)',
    instruction: 'Postal / Zip code',
  },
  {
    number: 23,
    name: 'Customer Group (Optional)',
    instruction: 'Name of the Customer Group (e.g. Retail, Wholesale)',
  },
  {
    number: 24,
    name: 'Custom Field 1 (Optional)',
    instruction: 'Custom field value 1',
  },
  {
    number: 25,
    name: 'Custom Field 2 (Optional)',
    instruction: 'Custom field value 2',
  },
  {
    number: 26,
    name: 'Custom Field 3 (Optional)',
    instruction: 'Custom field value 3',
  },
  {
    number: 27,
    name: 'Custom Field 4 (Optional)',
    instruction: 'Custom field value 4',
  },
  {
    number: 28,
    name: 'Custom Field 5 (Optional)',
    instruction: 'Custom field value 5',
  },
  {
    number: 29,
    name: 'Custom Field 6 (Optional)',
    instruction: 'Custom field value 6',
  },
  {
    number: 30,
    name: 'Custom Field 7 (Optional)',
    instruction: 'Custom field value 7',
  },
  {
    number: 31,
    name: 'Custom Field 8 (Optional)',
    instruction: 'Custom field value 8',
  },
  {
    number: 32,
    name: 'Custom Field 9 (Optional)',
    instruction: 'Custom field value 9',
  },
  {
    number: 33,
    name: 'Custom Field 10 (Optional)',
    instruction: 'Custom field value 10',
  },
];

export default function ImportContactsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setStatusMessage(null);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'Contact type',
      'Prefix',
      'First Name',
      'Middle name',
      'Last Name',
      'Business Name',
      'Contact ID',
      'Tax number',
      'Opening Balance',
      'Pay term',
      'Pay term period',
      'Credit Limit',
      'Email',
      'Mobile',
      'Alternate contact number',
      'Landline',
      'City',
      'State',
      'Country',
      'Address line 1',
      'Address line 2',
      'Zip Code',
      'Customer Group',
      'Custom Field 1',
      'Custom Field 2',
      'Custom Field 3',
      'Custom Field 4',
      'Custom Field 5',
      'Custom Field 6',
      'Custom Field 7',
      'Custom Field 8',
      'Custom Field 9',
      'Custom Field 10',
    ];

    const sampleRow = [
      '1',
      'Mr',
      'John',
      '',
      'Doe',
      '',
      'CO0010',
      '',
      '0',
      '30',
      'days',
      '5000',
      'john@example.com',
      '01712345678',
      '',
      '',
      'Dhaka',
      'Dhaka',
      'Bangladesh',
      'Road 12, Dhanmondi',
      '',
      '1209',
      'Retail',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ];

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contacts_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMessage({ type: 'error', text: 'Please select a file to import!' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage({
        type: 'success',
        text: `File "${selectedFile.name}" processed successfully! Contacts imported into system.`,
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none font-sans pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
          Import Contacts
        </h1>
      </div>

      {/* 1. Upload Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
          <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 max-w-lg">
              <label className="block text-slate-300 font-bold text-xs mb-2">
                File To Import:
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-xl file:border file:border-white/15
                    file:text-xs file:font-semibold
                    file:bg-[#0c0827] file:text-slate-200
                    hover:file:bg-white/10 file:cursor-pointer cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0 self-start sm:self-end flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-150 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : (
                <AlertCircle size={16} className="shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Download Template File Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
            >
              <Download size={15} strokeWidth={2.5} />
              <span>Download template file</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Instructions Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#120e34]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-5 sm:p-7 overflow-hidden">
        
        <div className="space-y-2 pb-4 border-b border-white/10 mb-5">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Instructions
          </h2>
          <div className="text-xs text-slate-300 space-y-1">
            <p>Follow the instructions carefully before importing the file.</p>
            <p>The columns of the file should be in the following order.</p>
          </div>
        </div>

        {/* Instructions Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0c0827]/60">
          <table className="w-full text-left text-xs whitespace-normal border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-300 font-semibold">
                <th className="px-4 py-3 w-32">Column Number</th>
                <th className="px-4 py-3 w-72">Column Name</th>
                <th className="px-4 py-3">Instruction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {instructions.map((row) => (
                <tr key={row.number} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-400">
                    {row.number}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {row.instruction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
