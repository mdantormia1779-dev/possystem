"use client";

import React, { useState } from 'react';
import { 
  AlertCircle, 
  Info
} from 'lucide-react';
import ExportToolbar, { ColumnOption } from '../ExportToolbar';
import { ColumnDef, exportToCSV, exportToExcel, exportToPDF, printTable } from '@/app/utils/tableExport';

interface StockAlertItem {
  id: number;
  product: string;
  location: string;
}

const ProductStockAlert = () => {
  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: 'product', label: 'Product', visible: true },
    { id: 'location', label: 'Location', visible: true },
  ]);

  const tableData: StockAlertItem[] = [
    {
      id: 1,
      product: 'WD 40D (0001)',
      location: 'RANGPUR BIKE PARLOUR',
    },
  ];

  const handleToggleColumn = (id: string) => {
    setColumns(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  const isColVisible = (id: string) => Boolean(columns.find(c => c.id === id)?.visible);

  const exportColumns: ColumnDef<StockAlertItem>[] = [
    { id: 'product', label: 'Product', accessor: (item: StockAlertItem) => item.product },
    { id: 'location', label: 'Location', accessor: (item: StockAlertItem) => item.location },
  ].filter(c => isColVisible(c.id));

  const handleExportCSV = () => exportToCSV('product_stock_alert', exportColumns, tableData);
  const handleExportExcel = () => exportToExcel('product_stock_alert', exportColumns, tableData);
  const handlePrint = () => printTable('Product Stock Alert', exportColumns, tableData);
  const handleExportPDF = () => exportToPDF('Product Stock Alert', exportColumns, tableData);

  const visibleColCount = columns.filter(c => c.visible).length;

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
      <div className="mb-4">
        <ExportToolbar
          columns={columns}
          onToggleColumn={handleToggleColumn}
          onExportCSV={handleExportCSV}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          onExportPDF={handleExportPDF}
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/[0.04] text-indigo-200/80 uppercase tracking-wider text-[11px] font-bold border-b border-white/10">
              {isColVisible('product') && (
                <th className="py-3 px-4 sm:px-6 w-1/2">Product</th>
              )}
              {isColVisible('location') && (
                <th className="py-3 px-4 sm:px-6 w-1/2">Location</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-slate-300">
            {tableData.length === 0 || visibleColCount === 0 ? (
              <tr>
                <td colSpan={visibleColCount || 1} className="py-6 text-center text-slate-400">
                  {visibleColCount === 0 ? 'No columns visible' : 'No alerts found'}
                </td>
              </tr>
            ) : (
              tableData.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.04] transition-colors">
                  {isColVisible('product') && (
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">
                      {row.product}
                    </td>
                  )}
                  {isColVisible('location') && (
                    <td className="py-3.5 px-4 sm:px-6 text-slate-300 font-medium uppercase">
                      {row.location}
                    </td>
                  )}
                </tr>
              ))
            )}
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
