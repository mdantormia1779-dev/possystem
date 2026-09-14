import React from 'react';
import { 
  AlertCircle, 
  Info, 
  FileSpreadsheet, 
  Printer, 
  Columns, 
  FileText 
} from 'lucide-react';

const ProductStockAlert = () => {
  const tableData = [
    {
      id: 1,
      product: 'WD 40D (0001)',
      location: 'RANGPUR BIKE PARLOUR',
    },
  ];

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-[#120e34]/85 hover:bg-[#161242]/90 border border-white/10 hover:border-amber-500/30 p-4 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-xl select-none overflow-hidden font-sans transition-all duration-300 mt-6">
      {/* Background ambient glowing orbs */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
        <div className="absolute -top-16 -right-16 w-52 sm:w-72 h-52 sm:h-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-52 sm:w-72 h-52 sm:h-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
            <AlertCircle size={20} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300 tracking-tight">
                Product Stock Alert
              </h2>
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center text-[11px] font-bold cursor-pointer hover:bg-cyan-500/30 transition-colors">
                <Info size={12} strokeWidth={2.5} />
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Low inventory warning for registered products
            </p>
          </div>
        </div>

        <span className="text-[11px] bg-amber-500/15 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30">
          {tableData.length} Alert
        </span>
      </div>

      {/* Action / Export Buttons Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button 
          type="button" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <FileSpreadsheet size={13} className="text-emerald-400" />
          <span>Export CSV</span>
        </button>

        <button 
          type="button" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <FileSpreadsheet size={13} className="text-cyan-400" />
          <span>Export Excel</span>
        </button>

        <button 
          type="button" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <Printer size={13} className="text-indigo-400" />
          <span>Print</span>
        </button>

        <button 
          type="button" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <Columns size={13} className="text-purple-400" />
          <span>Column visibility</span>
        </button>

        <button 
          type="button" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <FileText size={13} className="text-rose-400" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/[0.04] text-indigo-200/80 uppercase tracking-wider text-[11px] font-bold border-b border-white/10">
              <th className="py-3 px-4 sm:px-6 w-1/2">
                Product
              </th>
              <th className="py-3 px-4 sm:px-6 w-1/2">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-slate-300">
            {tableData.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.04] transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">
                  {row.product}
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-300 font-medium uppercase">
                  {row.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination Info */}
      <div className="pt-4 text-xs text-slate-400 flex items-center justify-between">
        <span>Showing 1 to {tableData.length} of {tableData.length} entries</span>
      </div>

      {/* Bottom Scroll / Progress Indicator */}
      <div className="mt-4 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="w-3/5 h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full" />
      </div>
    </div>
  );
};

export default ProductStockAlert;
