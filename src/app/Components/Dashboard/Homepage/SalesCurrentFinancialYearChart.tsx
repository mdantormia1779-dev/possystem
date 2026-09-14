"use client";

import React, { useState } from 'react';
import { FiShoppingCart, FiMenu, FiChevronUp, FiPrinter, FiDownload } from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface MonthlySalesData {
  month: string;
  sales: number;
}

const financialYearData: MonthlySalesData[] = [
  { month: 'Jan-2026', sales: 0 },
  { month: 'Feb-2026', sales: 0 },
  { month: 'Mar-2026', sales: 0 },
  { month: 'Apr-2026', sales: 0 },
  { month: 'May-2026', sales: 0 },
  { month: 'Jun-2026', sales: 0 },
  { month: 'Jul-2026', sales: 0 },
  { month: 'Aug-2026', sales: 25000 },
  { month: 'Sep-2026', sales: 0 },
  { month: 'Oct-2026', sales: 0 },
  { month: 'Nov-2026', sales: 0 },
  { month: 'Dec-2026', sales: 0 },
];

export default function SalesCurrentFinancialYearChart() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0c0827]/95 backdrop-blur-xl p-3 rounded-2xl border border-white/15 shadow-2xl text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
          <p className="font-semibold text-slate-400 mb-1">{label}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            <span className="text-slate-300 font-medium">Total Sales:</span>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-white">
              ৳{payload[0].value.toLocaleString()} BDT
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-[#120e34]/85 hover:bg-[#161242]/90 border border-white/10 hover:border-indigo-500/30 p-4 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-xl select-none overflow-hidden font-sans transition-all duration-300 mt-6">
      {/* Background ambient glowing orbs */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
        <div className="absolute -top-16 -right-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/10 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.18)] shrink-0">
            <FiShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
              Sales Current Financial Year
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Monthly revenue overview for FY 2026
            </p>
          </div>
        </div>

        {/* Legend & Options Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] shrink-0" />
            <span className="truncate max-w-[190px] xs:max-w-none">RANGPUR BIKE PARLOUR (BL0001)</span>
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Chart Options"
              aria-label="Chart Options"
            >
              <FiMenu className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setMenuOpen(false)} 
                />
                <div className="absolute right-0 top-full mt-2 w-40 rounded-2xl bg-[#140f38]/95 border border-white/15 shadow-2xl backdrop-blur-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-xs text-slate-300">
                  <button 
                    type="button" 
                    onClick={() => { window.print(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <FiPrinter className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Print chart</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <FiDownload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download PNG</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <FiDownload className="w-3.5 h-3.5 text-purple-400" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Recharts Container */}
      <div className="w-full h-80 sm:h-96 md:h-[420px] text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={financialYearData}
            margin={{ top: 15, right: 15, left: -10, bottom: 50 }}
          >
            <defs>
              <linearGradient id="financialYearGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35} />
                <stop offset="60%" stopColor="#6366f1" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#0c0827" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(255, 255, 255, 0.07)" 
            />

            <XAxis
              dataKey="month"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: 'rgba(255, 255, 255, 0.12)' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
              height={60}
            />

            <YAxis
              domain={[0, 30000]}
              ticks={[0, 5000, 10000, 15000, 20000, 25000, 30000]}
              tickFormatter={(val) => (val === 0 ? '0' : `${val / 1000}k`)}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: 'rgba(255, 255, 255, 0.12)' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
              label={{
                value: 'Total Sales (BDT)',
                angle: -90,
                position: 'insideLeft',
                offset: 20,
                fill: '#94a3b8',
                fontSize: 11,
                style: { textAnchor: 'middle' },
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#818cf8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#financialYearGradient)"
              dot={{
                r: 3,
                fill: '#0c0827',
                stroke: '#818cf8',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: '#818cf8',
                stroke: '#ffffff',
                strokeWidth: 2.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Back-to-Top Button */}
      <div className="absolute bottom-3 right-3 z-10">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 text-slate-300 hover:text-white flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <FiChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
