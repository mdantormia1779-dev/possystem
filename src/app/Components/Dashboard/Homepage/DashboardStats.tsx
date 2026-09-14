"use client";

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Receipt, 
  FileText, 
  ArrowLeftRight, 
  Download, 
  AlertTriangle, 
  RotateCcw, 
  CircleDollarSign, 
  Info, 
  Calendar, 
  ChevronDown,
  Sparkles,
  Check
} from 'lucide-react';

interface StatItem {
  id: number;
  title: string;
  amount: string;
  hasInfo: boolean;
  infoText?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconColor: string;
  iconBoxStyle: string;
  subtext: string;
  trend?: string;
  isPositive?: boolean;
}

const statsData: StatItem[] = [
  {
    id: 1,
    title: 'Total Sales',
    amount: '1,24,500.00',
    hasInfo: false,
    icon: ShoppingCart,
    iconColor: 'text-cyan-400',
    iconBoxStyle: 'bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 border-cyan-500/30 shadow-[0_0_16px_rgba(6,182,212,0.18)]',
    subtext: 'Gross sales today',
    trend: '+14.2%',
    isPositive: true,
  },
  {
    id: 2,
    title: 'Net Sales',
    amount: '98,250.00',
    hasInfo: true,
    infoText: 'Net = Total Gross Sales - Discounts - Customer Sell Returns',
    icon: Receipt,
    iconColor: 'text-emerald-400',
    iconBoxStyle: 'bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border-emerald-500/30 shadow-[0_0_16px_rgba(16,185,129,0.18)]',
    subtext: 'Net profit balance',
    trend: '+9.4%',
    isPositive: true,
  },
  {
    id: 3,
    title: 'Invoice Due',
    amount: '14,200.00',
    hasInfo: false,
    icon: FileText,
    iconColor: 'text-amber-400',
    iconBoxStyle: 'bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border-amber-500/30 shadow-[0_0_16px_rgba(245,158,11,0.18)]',
    subtext: 'Pending customer bills',
    trend: '6 bills',
    isPositive: false,
  },
  {
    id: 4,
    title: 'Total Sell Return',
    amount: '2,100.00',
    hasInfo: true,
    infoText: 'Total value of items returned by customers after sale',
    icon: ArrowLeftRight,
    iconColor: 'text-rose-400',
    iconBoxStyle: 'bg-gradient-to-tr from-rose-500/20 to-pink-500/10 border-rose-500/30 shadow-[0_0_16px_rgba(244,63,94,0.18)]',
    subtext: 'Returned merchandise',
    trend: '2 returns',
    isPositive: false,
  },
  {
    id: 5,
    title: 'Total Purchase',
    amount: '86,200.00',
    hasInfo: false,
    icon: Download,
    iconColor: 'text-indigo-400',
    iconBoxStyle: 'bg-gradient-to-tr from-indigo-500/20 to-cyan-500/10 border-indigo-500/30 shadow-[0_0_16px_rgba(99,102,241,0.18)]',
    subtext: 'Supplier procurement',
    trend: '8 bills',
    isPositive: true,
  },
  {
    id: 6,
    title: 'Purchase Due',
    amount: '8,400.00',
    hasInfo: false,
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    iconBoxStyle: 'bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border-amber-500/30 shadow-[0_0_16px_rgba(245,158,11,0.18)]',
    subtext: 'Payable to vendors',
    trend: '2 payables',
    isPositive: false,
  },
  {
    id: 7,
    title: 'Purchase Return',
    amount: '1,500.00',
    hasInfo: false,
    icon: RotateCcw,
    iconColor: 'text-fuchsia-400',
    iconBoxStyle: 'bg-gradient-to-tr from-fuchsia-500/20 to-purple-500/10 border-fuchsia-500/30 shadow-[0_0_16px_rgba(217,70,239,0.18)]',
    subtext: 'Vendor returns',
    trend: '1 return',
    isPositive: false,
  },
  {
    id: 8,
    title: 'Expense',
    amount: '6,850.00',
    hasInfo: false,
    icon: CircleDollarSign,
    iconColor: 'text-rose-400',
    iconBoxStyle: 'bg-gradient-to-tr from-red-500/20 to-rose-500/10 border-red-500/30 shadow-[0_0_16px_rgba(239,68,68,0.18)]',
    subtext: 'Shop utility & wages',
    trend: '4 entries',
    isPositive: false,
  },
];

const dateOptions = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'This Month',
  'Last Month',
  'Financial Year',
];

export default function DashboardStats() {
  const [selectedDate, setSelectedDate] = useState<string>('This Month');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  return (
    <div className="w-full font-sans mt-6 space-y-4 sm:space-y-6">
      {/* 8 Stats Cards Grid (1 col on mobile, 2 cols on sm/md, 3 cols on lg (1024px), 4 cols on xl) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {statsData.map((item) => {
          const Icon = item.icon;
          const showInfo = activeTooltip === item.id;

          return (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-2xl bg-[#120e34]/80 hover:bg-[#171242]/95 border border-white/10 hover:border-indigo-500/40 p-3.5 sm:p-4 lg:p-4.5 xl:p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 blur-xl transition-all duration-300 pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                {/* Glowing Icon Container */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105 ${item.iconBoxStyle}`}
                >
                  <Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={2.2} />
                </div>

                {/* Content Details */}
                <div className="flex flex-col min-w-0 flex-1">
                  {/* Title & Info Icon */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                      {item.title}
                    </span>

                    {item.hasInfo && (
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(showInfo ? null : item.id)}
                          onMouseEnter={() => setActiveTooltip(item.id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
                          aria-label="Information"
                        >
                          <Info className="w-3.5 h-3.5 text-cyan-400" />
                        </button>

                        {/* Tooltip Popup */}
                        {showInfo && item.infoText && (
                          <div className="absolute right-0 bottom-full mb-2 w-48 sm:w-56 p-2.5 rounded-xl bg-[#0c0827] border border-white/20 text-[11px] text-slate-200 shadow-2xl backdrop-blur-xl z-50">
                            {item.infoText}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Amount with Taka Sign */}
                  <div className="text-base sm:text-lg lg:text-base xl:text-lg 2xl:text-xl font-extrabold text-white mt-0.5 flex items-baseline gap-1 tracking-normal tabular-nums group-hover:text-indigo-100 transition-colors whitespace-nowrap">
                    <span className="text-indigo-400 font-medium text-xs sm:text-sm lg:text-xs xl:text-sm shrink-0">৳</span>
                    <span className="shrink-0">{item.amount}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Subtext & Trend Pill */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 gap-2">
                <span className="truncate">{item.subtext}</span>
                {item.trend && (
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border shrink-0 ${
                    item.isPositive 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {item.trend}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}