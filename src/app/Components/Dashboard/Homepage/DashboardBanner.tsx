"use client";

import React, { useState } from 'react';
import { Calendar, ChevronDown, Sparkles, Check } from 'lucide-react';

const dateOptions: string[] = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'This Month',
  'Last Month',
  'Financial Year',
  'Custom Date Range',
];

interface DashboardBannerProps {
  adminName?: string;
  shopName?: string;
  onDateChange?: (date: string) => void;
}

export default function DashboardBanner({
  adminName = 'Admin',
  shopName = 'Rangpur Bike Parlour',
  onDateChange,
}: DashboardBannerProps) {
  const [selectedDate, setSelectedDate] = useState<string>('Filter by Date');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleSelect = (option: string) => {
    setSelectedDate(option);
    setDropdownOpen(false);
    if (onDateChange) {
      onDateChange(option);
    }
  };

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#161042]/95 via-[#1c1453]/90 to-[#130d38]/95 border border-white/10 p-4 sm:p-6 lg:p-7 backdrop-blur-xl shadow-2xl z-30">
      {/* Background ambient glowing orbs */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none -z-10">
        <div className="absolute -top-16 -right-16 w-48 sm:w-80 h-48 sm:h-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-16 left-1/4 w-44 sm:w-72 h-44 sm:h-72 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
        {/* Left Side: Admin Greetings & Shop Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white/10 border border-white/15 text-indigo-200 backdrop-blur-md shadow-xs">
              <Sparkles size={12} className="text-cyan-300 shrink-0" />
              <span>Enterprise POS Overview</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              Live Terminal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight truncate">
              Welcome {adminName}
            </h1>
            <span className="text-xl sm:text-2xl animate-bounce shrink-0">👋</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-xl leading-relaxed">
            {shopName} • Live financial breakdown, sales returns, and store performance.
          </p>
        </div>

        {/* Right Side: Date Filter Dropdown */}
        <div className="relative shrink-0 w-full md:w-auto z-40">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            className="w-full md:w-auto flex items-center justify-between gap-3 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-md transition-all cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 truncate">
              <Calendar className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="truncate">{selectedDate}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-300 transition-transform duration-200 shrink-0 ${
                dropdownOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu Modal / Popover */}
          {dropdownOpen && (
            <>
              {/* Invisible backdrop click-listener to close dropdown */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />

              <div className="absolute left-0 md:left-auto right-0 mt-2 w-full md:w-60 rounded-2xl bg-[#110d33] border border-white/20 shadow-2xl backdrop-blur-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1 flex items-center justify-between">
                  <span>Filter by Date</span>
                  {selectedDate !== 'Filter by Date' && (
                    <button
                      type="button"
                      onClick={() => handleSelect('Filter by Date')}
                      className="text-[10px] text-cyan-400 hover:underline capitalize"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-0.5 [scrollbar-width:thin]">
                  {dateOptions.map((opt) => {
                    const isSelected = selectedDate === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelect(opt)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600/40 to-cyan-500/20 text-white font-bold border border-indigo-500/30'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}